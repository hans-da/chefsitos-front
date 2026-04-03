import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap, throwError } from 'rxjs'; // <-- throwError importado

import { ApiService } from './api.service';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private cartSignal = signal<Cart | null>(null);
  
  cart = this.cartSignal.asReadonly();
  cartCount = computed(() => {
    const current = this.cartSignal();
    return current ? current.items.reduce((total, item) => total + item.cantidad, 0) : 0;
  });

  constructor() {
    // Signals are synchronous, manual check for local cart is enough
    const savedCartId = localStorage.getItem('uamishop_cart_id');
    if (savedCartId && this.auth.isAuthenticated()) {
      this.getCart(savedCartId).subscribe();
    }
  }

  createCart(clienteId: string): Observable<Cart> {
    return this.http.post<Cart>(this.api.getSalesUrl('/api/v1/carritos'), { clienteId }).pipe(
      tap(cart => {
        this.cartSignal.set(cart);
        localStorage.setItem('uamishop_cart_id', cart.carritoId);
      })
    );
  }

  getCart(carritoId: string): Observable<Cart> {
    return this.http.get<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${carritoId}`)).pipe(
      tap(cart => this.cartSignal.set(cart)),
      catchError(err => {
        if (err.status === 404) {
          this.clearLocalCart();
        }
        return of(null as any);
      })
    );
  }

  addProduct(productoId: string, cantidad: number): Observable<Cart> {
    const clientId = this.auth.currentUser()?.id;
    if (!clientId) return throwError(() => new Error('Usuario no autenticado'));

    const current = this.cartSignal();
    
    //  INTERCEPCIÓN MOCK: Si es el producto de prueba, no llamamos al servidor
    if (productoId === '11111111-1111-1111-1111-111111111111') {
      const mockCart: Cart = current || {
        carritoId: 'mock-cart-1111',
        clienteId: clientId,
        estado: 'ACTIVO',
        items: [],
        descuentos: [],
        subtotal: 0,
        total: 0,
        moneda: 'MXN'
      };

      const items = [...mockCart.items];
      const existingItemIndex = items.findIndex(i => i.productoId === productoId);
      const precioUnitario = 150.50;

      if (existingItemIndex >= 0) {
        const item = items[existingItemIndex];
        items[existingItemIndex] = { 
          ...item, 
          cantidad: item.cantidad + cantidad,
          subtotal: (item.cantidad + cantidad) * precioUnitario
        };
      } else {
        items.push({
          productoId: productoId,
          nombreProducto: 'Producto Mock (Activado)',
          cantidad: cantidad,
          sku: 'MOCK-SKU',
          precioUnitario: precioUnitario,
          subtotal: cantidad * precioUnitario,
          moneda: 'MXN'
        });
      }

      const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);
      const updatedCart: Cart = { ...mockCart, items, subtotal: totalAmount, total: totalAmount };
      
      this.cartSignal.set(updatedCart);
      return of(updatedCart);
    }

    // Lógica normal para productos reales
    if (!current || current.estado !== 'ACTIVO') {
      return this.createCart(clientId).pipe(
        switchMap((newCart: any) => 
          this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${newCart.carritoId}/productos`), { productoId, cantidad })
        ),
        tap(cart => this.cartSignal.set(cart))
      );
    }

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`), { productoId, cantidad }).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  updateQuantity(productoId: string, cantidad: number): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.patch<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`), { nuevaCantidad: cantidad }).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  removeProduct(productoId: string): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`)).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  clearCart(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`)).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  startCheckout(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/checkout`), {}).pipe(
      tap(cart => {
        this.cartSignal.set(cart);
      })
    );
  }

  completeCheckout(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/checkout/completar`), {}).pipe(
      tap(() => this.clearLocalCart())
    );
  }

  abandonCart(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/abandonar`), {}).pipe(
      tap(() => this.clearLocalCart())
    );
  }

  clearLocalCart() {
    this.cartSignal.set(null);
    localStorage.removeItem('uamishop_cart_id');
  }
}
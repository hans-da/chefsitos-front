import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap } from 'rxjs'; // <-- Aquí agregué switchMap

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
    if (!clientId) throw new Error('Usuario no autenticado');

    const current = this.cartSignal();
    
    // Si no hay carrito o el estado no es ACTIVO, crear uno nuevo y luego agregar el producto
    if (!current || current.estado !== 'ACTIVO') {
      return this.createCart(clientId).pipe(
        switchMap((newCart: any) => //
          this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${newCart.carritoId}/productos`), { productoId, cantidad })
        ),
        tap(cart => this.cartSignal.set(cart))
      );
    }

    // Si ya existe un carrito activo, agregar directamente
    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`), { productoId, cantidad }).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  updateQuantity(productoId: string, cantidad: number): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.patch<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`), { nuevaCantidad: cantidad }).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  removeProduct(productoId: string): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`)).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  clearCart(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`)).pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  startCheckout(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/checkout`), {}).pipe(
      tap(cart => {
        this.cartSignal.set(cart);
      })
    );
  }

  completeCheckout(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/checkout/completar`), {}).pipe(
      tap(() => this.clearLocalCart())
    );
  }

  abandonCart(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) throw new Error('No hay carrito activo');

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/abandonar`), {}).pipe(
      tap(() => this.clearLocalCart())
    );
  }

  clearLocalCart() {
    this.cartSignal.set(null);
    localStorage.removeItem('uamishop_cart_id');
  }
}
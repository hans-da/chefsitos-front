import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, switchMap, throwError } from 'rxjs';

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
    return current ? current.items.reduce((total: number, item: any) => total + item.cantidad, 0) : 0;
  });

  /** Indica si el carrito actual permite edición (solo en estado ACTIVO) */
  isEditable = computed(() => {
    const current = this.cartSignal();
    return current !== null && current.estado === 'ACTIVO';
  });

  /** Indica si el carrito está en proceso de checkout */
  isInCheckout = computed(() => {
    const current = this.cartSignal();
    return current !== null && current.estado === 'EN_CHECKOUT';
  });

  constructor() {
    const savedCartId = localStorage.getItem('uamishop_cart_id');
    if (savedCartId && this.auth.isAuthenticated()) {
      this.getCart(savedCartId).subscribe();
    }
  }

  createCart(clienteId: string): Observable<Cart> {
    return this.http.post<Cart>(this.api.getSalesUrl('/api/v1/carritos'), { clienteId }).pipe(
      tap((cart: Cart) => {
        this.cartSignal.set(cart);
        localStorage.setItem('uamishop_cart_id', cart.carritoId);
      })
    );
  }

  getCart(carritoId: string): Observable<Cart> {
    return this.http.get<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${carritoId}`)).pipe(
      tap((cart: Cart) => this.cartSignal.set(cart)),
      catchError((err: any) => {
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

    // Si el carrito está en checkout, no se pueden agregar productos
    if (current && current.estado === 'EN_CHECKOUT') {
      return throwError(() => new Error('El carrito está en proceso de checkout. Completa o cancela la compra actual.'));
    }

    // Si no hay carrito o el carrito no está activo, crear uno nuevo
    if (!current || current.estado !== 'ACTIVO') {
      return this.createCart(clientId).pipe(
        switchMap((newCart: any) =>
          this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${newCart.carritoId}/productos`), { productoId, cantidad })
        ),
        tap((cart: Cart) => this.cartSignal.set(cart))
      );
    }

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`), { productoId, cantidad }).pipe(
      tap((cart: Cart) => this.cartSignal.set(cart))
    );
  }

  updateQuantity(productoId: string, cantidad: number): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));
    if (current.estado !== 'ACTIVO') return throwError(() => new Error('El carrito no permite edición en su estado actual'));

    return this.http.patch<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`), { nuevaCantidad: cantidad }).pipe(
      tap((cart: Cart) => this.cartSignal.set(cart))
    );
  }

  removeProduct(productoId: string): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));
    if (current.estado !== 'ACTIVO') return throwError(() => new Error('El carrito no permite edición en su estado actual'));

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos/${productoId}`)).pipe(
      tap((cart: Cart) => this.cartSignal.set(cart))
    );
  }

  clearCart(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));
    if (current.estado !== 'ACTIVO') return throwError(() => new Error('El carrito no permite edición en su estado actual'));

    return this.http.delete<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/productos`)).pipe(
      tap((cart: Cart) => this.cartSignal.set(cart))
    );
  }

  startCheckout(): Observable<Cart> {
    const current = this.cartSignal();
    if (!current) return throwError(() => new Error('No hay carrito activo'));

    // Si ya está en checkout, devolver el estado actual sin volver a llamar al backend
    if (current.estado === 'EN_CHECKOUT') {
      return of(current);
    }

    return this.http.post<Cart>(this.api.getSalesUrl(`/api/v1/carritos/${current.carritoId}/checkout`), {}).pipe(
      tap((cart: Cart) => {
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

  /** Limpia el carrito del estado local y localStorage */
  clearLocalCart() {
    this.cartSignal.set(null);
    localStorage.removeItem('uamishop_cart_id');
  }
}
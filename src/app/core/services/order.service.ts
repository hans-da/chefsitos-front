import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, Address } from '../models/order.model';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getOrders(): Observable<Order[]> {
    // API does not filter by user, we fetch all and frontend will filter (per prompt instructions).
    return this.http.get<Order[]>(this.api.getOrdersUrl('/api/v1/ordenes'));
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}`));
  }

  createOrderFromCart(carritoId: string, direccion: Address): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl('/api/v1/ordenes/desde-carrito'), { carritoId, direccion });
  }

  createDirectOrder(clienteId: string, direccion: Address, items: CartItem[]): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl('/api/v1/ordenes/directa'), { clienteId, items, direccion });
  }

  confirmOrder(id: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/confirmar`), {});
  }

  cancelOrder(id: string, motivo: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/cancelar`), { motivo });
  }
}

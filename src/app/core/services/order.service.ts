import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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
    return this.http.get<Order[]>(this.api.getOrdersUrl('/api/v1/ordenes')).pipe(
      catchError(err => {
        console.error('Error cargando órdenes (posible fallo de red o gateway):', err);
        return of([]); // Devolvemos lista vacía para no romper el dashboard
      })
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}`));
  }

  createOrderFromCart(carritoId: string, direccion: Address): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl('/api/v1/ordenes/desde-carrito'), { carritoId, direccion });
  }

  createDirectOrder(clienteId: string, direccion: Address, items: CartItem[]): Observable<Order> {
    // Map CartItem[] to ItemOrdenRequest[] (only productoId and cantidad)
    const itemsMapped = items.map(item => ({
      productoId: item.productoId,
      cantidad: item.cantidad
    }));
    return this.http.post<Order>(this.api.getOrdersUrl('/api/v1/ordenes/directa'), { clienteId, items: itemsMapped, direccion });
  }

  confirmOrder(id: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/confirmar`), {});
  }

  processPayment(id: string, referenciaPago: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/pago`), { referenciaPago });
  }

  markInPreparation(id: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/en-preparacion`), {});
  }

  markAsSent(id: string, proveedorLogistico: string, numeroGuia: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/enviada`), { proveedorLogistico, numeroGuia });
  }

  markAsDelivered(id: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/entregada`), {});
  }

  cancelOrder(id: string, motivo: string): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}/cancelar`), { motivo });
  }
}

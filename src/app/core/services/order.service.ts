import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Order, Address } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  /**
   * Obtiene TODAS las órdenes del sistema.
   * El filtrado por cliente se hace en el frontend.
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.api.getOrdersUrl('/api/v1/ordenes')).pipe(
      catchError(err => {
        console.error('Error cargando órdenes:', err);
        return of([]);
      })
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(this.api.getOrdersUrl(`/api/v1/ordenes/${id}`));
  }

  createOrderFromCart(carritoId: string, direccion: Address): Observable<Order> {
    return this.http.post<Order>(this.api.getOrdersUrl('/api/v1/ordenes/desde-carrito'), { carritoId, direccion });
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, BadgeComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-12 pb-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Mis Órdenes</h1>
            <p class="text-gray-500 mt-2">Revisa el historial y estado de tus compras en UAMIShop.</p>
          </div>
        </div>

        @if (loading()) {
          <app-loading-spinner message="Cargando tu historial de órdenes..."></app-loading-spinner>
        } @else if (orders().length === 0) {
          <div class="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Aún no tienes órdenes</h3>
            <p class="text-gray-500 mb-8 max-w-sm">No hemos encontrado compras recientes en tu historial o el servidor no está disponible. ¡Empieza a llenar tu carrito!</p>
            <a routerLink="/catalogo" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1">
              Ir al catálogo
            </a>
          </div>
        } @else {
          <div class="space-y-6">
            @for (order of orders(); track order.id) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden group">
                <div class="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  
                  <div class="flex-grow">
                    <div class="flex items-center gap-3 mb-2">
                       <h3 class="text-lg font-bold text-gray-900 leading-none">Orden #{{ order.numeroOrden }}</h3>
                       <app-badge [text]="order.estado" [type]="getStatusBadgeType(order.estado)"></app-badge>
                    </div>
                    <div class="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4 mt-3">
                       <p class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657l-4.243 4.243a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg> {{ order.direccionResumen }}</p>
                    </div>
                  </div>

                  <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                    <p class="text-2xl font-extrabold text-gray-900">{{ order.total | currency:order.moneda }}</p>
                    <a [routerLink]="['/mis-ordenes', order.id]" class="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors flex items-center bg-indigo-50 px-4 py-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white">
                      Ver detalle
                      <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                  </div>

                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  auth = inject(AuthService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().pipe(
      // Si el backend falla, devolvemos un arreglo vacío
      catchError(() => of([]))
    ).subscribe({
      next: (allOrders) => {
        const clientId = this.auth.currentUser()?.id;
        const userOrders = allOrders.filter(o => o.clienteId === clientId);
        
        userOrders.reverse();
        this.orders.set(userOrders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getStatusBadgeType(estado: string): 'success'|'warning'|'danger'|'info'|'neutral' {
    switch(estado) {
      case 'ENTREGADA': return 'success';
      case 'CANCELADA': return 'danger';
      case 'EN_TRANSITO':
      case 'ENVIADA': return 'info';
      case 'EN_PREPARACION':
      case 'PAGO_PROCESADO': return 'warning';
      default: return 'neutral';
    }
  }
}
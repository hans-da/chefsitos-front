import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../core/models/order.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, BadgeComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8 pb-4 border-b border-gray-200">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Órdenes</h1>
          <p class="text-gray-500 mt-1">Monitorea y actualiza el estado de todos los pedidos.</p>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Orden ID (Corta)</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                @for (order of orders(); track order.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 font-bold border-l-4 border-indigo-500 pl-4">{{ order.numeroOrden }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.clienteId | slice:0:15 }}...</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">---</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ order.total | currency:order.moneda }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-badge [text]="order.estado" [type]="getBadgeType(order.estado)"></app-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end flex-wrap max-w-xs">
                      @if (order.estado === 'PENDIENTE') {
                        <button (click)="confirmOrder(order.id)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors">Confirmar</button>
                      }

                      @if (order.estado === 'CONFIRMADA') {
                        <button (click)="processPayment(order.id)" class="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors">Pagar</button>
                      }

                      @if (order.estado === 'PAGO_PROCESADO') {
                        <button (click)="markInPreparation(order.id)" class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">Preparar</button>
                      }

                      @if (order.estado === 'EN_PREPARACION') {
                        <button (click)="markAsSent(order.id)" class="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors">Enviar</button>
                      }

                      @if (order.estado === 'ENVIADA') {
                        <button (click)="markAsDelivered(order.id)" class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors">Entregada</button>
                      }

                      @if (order.estado !== 'CANCELADA' && order.estado !== 'ENTREGADA' && order.estado !== 'ENVIADA') {
                        <button (click)="cancelOrder(order.id)" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors">Cancelar</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">No hay órdenes en el sistema.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    <app-footer></app-footer>
  `
})
export class AdminOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  
  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // Reverse array as default sort workaround
        this.orders.set([...orders].reverse());
      }
    });
  }

  getBadgeType(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    switch (status) {
      case 'PENDIENTE': return 'warning';
      case 'CONFIRMADA': return 'warning';
      case 'PAGO_PROCESADO': return 'success';
      case 'EN_PREPARACION': return 'info';
      case 'ENVIADA': return 'info';
      case 'ENTREGADA': return 'success';
      case 'CANCELADA': return 'danger';
      default: return 'neutral';
    }
  }

  confirmOrder(id: string) {
    if (confirm('¿Estás seguro de confirmar esta orden y pasarla a preparación?')) {
      this.orderService.confirmOrder(id).subscribe({
        next: () => {
          this.notification.success('Orden confirmada exitosamente');
          this.loadOrders();
        }
      });
    }
  }

  processPayment(id: string) {
    const ref = prompt('Ingrese el número de referencia de pago:');
    if (ref) {
      this.orderService.processPayment(id, ref).subscribe({
        next: () => {
          this.notification.success('Pago procesado correctamente');
          this.loadOrders();
        }
      });
    }
  }

  markInPreparation(id: string) {
    this.orderService.markInPreparation(id).subscribe({
      next: () => {
        this.notification.success('Orden marcada en preparación');
        this.loadOrders();
      }
    });
  }

  markAsSent(id: string) {
    const proveedor = prompt('Proveedor Logístico:');
    const guia = prompt('Número de Guía:');
    if (proveedor && guia) {
      this.orderService.markAsSent(id, proveedor, guia).subscribe({
        next: () => {
          this.notification.success('Orden marcada como enviada');
          this.loadOrders();
        }
      });
    }
  }

  markAsDelivered(id: string) {
    this.orderService.markAsDelivered(id).subscribe({
      next: () => {
        this.notification.success('Orden marcada como entregada');
        this.loadOrders();
      }
    });
  }

  cancelOrder(id: string) {
    const motivo = prompt('Por favor, ingresa el motivo de la cancelación:');
    if (motivo) {
      if (motivo.length < 5) {
        this.notification.error('El motivo es demasiado corto');
        return;
      }
      this.orderService.cancelOrder(id, motivo).subscribe({
        next: () => {
          this.notification.success('Orden cancelada exitosamente');
          this.loadOrders();
        }
      });
    }
  }
}

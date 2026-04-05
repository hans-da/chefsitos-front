import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../core/models/order.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

/**
 * ═══════════════════════════════════════════════════════
 * MOCKS DE FRONTEND — Para enriquecer la experiencia admin
 * Los datos de referencia de pago y guía son generados 
 * localmente cuando el backend no los proporciona.
 * ═══════════════════════════════════════════════════════
 */
function generarReferenciaPagoMock(): string {
  return `REF-MOCK-${Date.now().toString(36).toUpperCase()}`;
}

function generarGuiaEnvioMock(): string {
  return `GUIA-MX-${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, BadgeComponent, FormsModule, LoadingSpinnerComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8 pb-4 border-b border-gray-200">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Órdenes</h1>
          <p class="text-gray-500 mt-1">Monitorea y actualiza el estado de todos los pedidos.</p>
        </div>

        @if (loading()) {
          <app-loading-spinner message="Cargando órdenes..."></app-loading-spinner>
        } @else {
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">N° Orden</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Dirección</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                    <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acción Siguiente</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  @for (order of orders(); track order.id) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 font-bold border-l-4 border-indigo-500 pl-4">{{ order.numeroOrden }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.clienteId | slice:0:12 }}...</td>
                      <td class="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{{ order.direccionResumen || '—' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ order.total | currency:order.moneda }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <app-badge [text]="order.estado" [type]="getBadgeType(order.estado)"></app-badge>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex gap-2 justify-end flex-wrap">

                          @if (order.estado === 'PENDIENTE') {
                            <button (click)="confirmOrder(order.id)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Confirmar
                            </button>
                          }

                          @if (order.estado === 'CONFIRMADA') {
                            <button (click)="openPaymentModal(order.id)" class="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Registrar Pago
                            </button>
                          }

                          @if (order.estado === 'PAGO_PROCESADO') {
                            <button (click)="markInPreparation(order.id)" class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Iniciar Preparación
                            </button>
                          }

                          @if (order.estado === 'EN_PREPARACION') {
                            <button (click)="openShippingModal(order.id)" class="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Marcar Enviada
                            </button>
                          }

                          @if (order.estado === 'ENVIADA') {
                            <button (click)="markAsDelivered(order.id)" class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Confirmar Entrega
                            </button>
                          }

                          @if (order.estado !== 'CANCELADA' && order.estado !== 'ENTREGADA' && order.estado !== 'ENVIADA') {
                            <button (click)="openCancelModal(order.id)" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs">
                              Cancelar
                            </button>
                          }

                          @if (order.estado === 'ENTREGADA' || order.estado === 'CANCELADA') {
                            <span class="text-gray-400 text-xs italic px-3 py-1.5">Finalizada</span>
                          }

                        </div>
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
        }

      </div>
    </div>

    <!-- UI de Modales Personalizados (Reemplazando los prompt nativos) -->
    @if (modalType() !== 'NONE') {
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex flex-col justify-center items-center p-4 animate-in">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
          
          <!-- Sombreado Verde Premium del modal -->
          <div class="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600 rounded-full blur-[80px] opacity-15 pointer-events-none"></div>

          @if (modalType() === 'PAYMENT') {
            <h3 class="text-xl font-black text-gray-900 mb-2 relative z-10">Registrar Pago</h3>
            <p class="text-gray-500 text-sm mb-6 relative z-10">Ingresa la referencia de la transacción bancaria.</p>
            <div class="space-y-4 relative z-10">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Referencia de Pago</label>
                <input [(ngModel)]="paymentRef" type="text" class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none">
              </div>
              <div class="flex gap-3 justify-end pt-4">
                <button (click)="closeModal()" class="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button (click)="confirmPayment()" [disabled]="!paymentRef" class="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-30">Confirmar Pago</button>
              </div>
            </div>
          }

          @if (modalType() === 'SHIPPING') {
            <h3 class="text-xl font-black text-gray-900 mb-2 relative z-10">Detalles de Envío</h3>
            <p class="text-gray-500 text-sm mb-6 relative z-10">Ingresa el proveedor logístico y el número de guía de rastreo.</p>
            <div class="space-y-4 relative z-10">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Proveedor Logístico</label>
                <input [(ngModel)]="shippingProvider" type="text" class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none">
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Número de Guía de Envío</label>
                <input [(ngModel)]="shippingGuide" type="text" class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none">
              </div>
              <div class="flex gap-3 justify-end pt-4">
                <button (click)="closeModal()" class="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
                <button (click)="confirmShipping()" [disabled]="!shippingProvider || !shippingGuide" class="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-30">Marcar Enviada</button>
              </div>
            </div>
          }

          @if (modalType() === 'CANCEL') {
            <h3 class="text-xl font-black text-rose-600 mb-2 relative z-10">Cancelar Orden</h3>
            <p class="text-gray-500 text-sm mb-6 relative z-10">Esta acción no se puede deshacer. Escribe un motivo (mínimo 10 caracteres).</p>
            <div class="space-y-4 relative z-10">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Motivo de cancelación</label>
                <textarea [(ngModel)]="cancelReason" rows="3" class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-gray-900 resize-none focus:ring-2 focus:ring-rose-600 outline-none"></textarea>
              </div>
              <div class="flex gap-3 justify-end pt-4">
                <button (click)="closeModal()" class="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Atrás</button>
                <button (click)="confirmCancel()" [disabled]="cancelReason.length < 10" class="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-30">Confirmar Cancelación</button>
              </div>
            </div>
          }

        </div>
      </div>
    }

    <app-footer></app-footer>
  `
})
export class AdminOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  
  orders = signal<Order[]>([]);
  loading = signal(true);

  // --- Modal UI State ---
  modalType = signal<'NONE'|'PAYMENT'|'SHIPPING'|'CANCEL'>('NONE');
  modalOrderId = signal<string | null>(null);

  paymentRef = '';
  shippingProvider = 'UAMIShop Express';
  shippingGuide = '';
  cancelReason = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set([...orders].reverse());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
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
    this.orderService.confirmOrder(id).subscribe({
      next: () => {
        this.notification.success('Orden confirmada exitosamente');
        this.loadOrders();
      },
      error: () => this.notification.error('Error al confirmar la orden')
    });
  }

  markInPreparation(id: string) {
    this.orderService.markInPreparation(id).subscribe({
      next: () => {
        this.notification.success('Orden marcada en preparación');
        this.loadOrders();
      },
      error: () => this.notification.error('Error al marcar en preparación')
    });
  }

  markAsDelivered(id: string) {
    this.orderService.markAsDelivered(id).subscribe({
      next: () => {
        this.notification.success('Orden marcada como entregada');
        this.loadOrders();
      },
      error: () => this.notification.error('Error al marcar como entregada')
    });
  }

  // --- Manejo del Modal UI ---

  closeModal() {
    this.modalType.set('NONE');
    this.modalOrderId.set(null);
  }

  openPaymentModal(id: string) {
    this.paymentRef = generarReferenciaPagoMock();
    this.modalOrderId.set(id);
    this.modalType.set('PAYMENT');
  }

  confirmPayment() {
    const id = this.modalOrderId();
    if (id && this.paymentRef) {
      this.orderService.processPayment(id, this.paymentRef).subscribe({
        next: () => {
          this.notification.success('Pago registrado correctamente');
          this.loadOrders();
          this.closeModal();
        },
        error: () => this.notification.error('Error al registrar el pago')
      });
    }
  }

  openShippingModal(id: string) {
    this.shippingProvider = 'UAMIShop Express';
    this.shippingGuide = generarGuiaEnvioMock();
    this.modalOrderId.set(id);
    this.modalType.set('SHIPPING');
  }

  confirmShipping() {
    const id = this.modalOrderId();
    if (id && this.shippingProvider && this.shippingGuide) {
      this.orderService.markAsSent(id, this.shippingProvider, this.shippingGuide).subscribe({
        next: () => {
          this.notification.success('Orden marcada como enviada');
          this.loadOrders();
          this.closeModal();
        },
        error: () => this.notification.error('Error al marcar como enviada')
      });
    }
  }

  openCancelModal(id: string) {
    this.cancelReason = '';
    this.modalOrderId.set(id);
    this.modalType.set('CANCEL');
  }

  confirmCancel() {
    const id = this.modalOrderId();
    if (id && this.cancelReason.length >= 10) {
      this.orderService.cancelOrder(id, this.cancelReason).subscribe({
        next: () => {
          this.notification.success('Orden cancelada exitosamente');
          this.loadOrders();
          this.closeModal();
        },
        error: () => this.notification.error('Error al cancelar la orden')
      });
    }
  }
}

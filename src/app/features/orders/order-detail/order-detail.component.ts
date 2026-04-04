import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

/**
 * ═══════════════════════════════════════════════════════
 * MOCKS DE FRONTEND — Solo datos de apoyo visual
 * Estos datos NO vienen del backend. Se generan localmente
 * para enriquecer la experiencia sin romper el contrato REST.
 * ═══════════════════════════════════════════════════════
 */
function generarReferenciaPagoMock(orderId: string): string {
  return `REF-${orderId.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

function generarGuiaEnvioMock(orderId: string): string {
  return `GUIA-MX-${orderId.substring(0, 6).toUpperCase()}${Math.floor(Math.random() * 9000 + 1000)}`;
}

const PROVEEDOR_MOCK = 'UAMIShop Express';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BadgeComponent, LoadingSpinnerComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-12 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button (click)="goBack()" class="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8 group font-medium text-sm">
          <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver a mis órdenes
        </button>

        @if (loading()) {
           <app-loading-spinner message="Cargando detalles de la orden..."></app-loading-spinner>
        } @else if (order()) {
           <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             
             <!-- Header -->
             <div class="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
               <div>
                 <h1 class="text-2xl font-extrabold text-gray-900">Orden {{ order()?.numeroOrden }}</h1>
                 <p class="text-sm text-gray-500 mt-1">ID: {{ order()?.id }}</p>
               </div>
               <app-badge [text]="order()?.estado!" [type]="getStatusBadgeType(order()?.estado!)" customClasses="px-4 py-2 text-sm font-bold shadow-sm"></app-badge>
             </div>

             <!-- Stepper -->
             <div class="p-8 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-8">Estado del pedido</h3>
                
                <div class="relative max-w-3xl mx-auto">
                  @if (order()?.estado !== 'CANCELADA') {
                    <div class="absolute inset-0 top-1/2 -mt-1 h-2 bg-gray-100 rounded-full z-0 hidden sm:block"></div>
                    <div class="absolute inset-0 top-1/2 -mt-1 h-2 bg-emerald-500 rounded-full z-0 hidden sm:block transition-all duration-1000" [style.width]="getStepperProgress() + '%'"></div>
                    
                    <div class="relative z-10 flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
                      
                      <!-- Step 1: Confirmada -->
                      <div class="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors" [ngClass]="getStepClass('CONFIRMADA')">1</div>
                        <span class="text-sm font-medium text-gray-700">Confirmada</span>
                      </div>

                      <!-- Step 2: Pago -->
                      <div class="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors" [ngClass]="getStepClass('PAGO_PROCESADO')">2</div>
                        <span class="text-sm font-medium text-gray-700">Pago procesado</span>
                      </div>

                      <!-- Step 3: Preparación -->
                      <div class="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors" [ngClass]="getStepClass('EN_PREPARACION')">3</div>
                        <span class="text-sm font-medium text-gray-700">En preparación</span>
                      </div>

                      <!-- Step 4: Enviada -->
                      <div class="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors" [ngClass]="getStepClass('ENVIADA')">4</div>
                        <span class="text-sm font-medium text-gray-700">Enviada</span>
                      </div>

                      <!-- Step 5: Entregada -->
                      <div class="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors" [ngClass]="getStepClass('ENTREGADA')">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700">Entregada</span>
                      </div>

                    </div>
                  } @else {
                    <div class="bg-red-50 p-6 rounded-2xl flex items-center gap-4 border border-red-100">
                       <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                       </div>
                       <div>
                         <h4 class="text-red-900 font-bold text-lg">Orden Cancelada</h4>
                         <p class="text-red-700 text-sm mt-1">Esta orden fue cancelada y el proceso se detuvo.</p>
                       </div>
                    </div>
                  }
                </div>
             </div>

             <!-- Información de envío y tracking (Mock visual) -->
             @if (showTrackingInfo()) {
               <div class="p-8 border-b border-gray-100 bg-indigo-50/30">
                 <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Información de Envío</h3>
                 <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div class="bg-white rounded-xl p-4 border border-gray-100">
                     <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Proveedor</p>
                     <p class="font-bold text-gray-900">{{ proveedorMock }}</p>
                     <p class="text-[8px] text-gray-400 italic mt-1">* Dato de referencia (mock)</p>
                   </div>
                   <div class="bg-white rounded-xl p-4 border border-gray-100">
                     <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Guía de Envío</p>
                     <p class="font-bold text-gray-900 font-mono text-sm">{{ guiaMock }}</p>
                     <p class="text-[8px] text-gray-400 italic mt-1">* Dato de referencia (mock)</p>
                   </div>
                   <div class="bg-white rounded-xl p-4 border border-gray-100">
                     <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ref. Pago</p>
                     <p class="font-bold text-gray-900 font-mono text-sm">{{ refPagoMock }}</p>
                     <p class="text-[8px] text-gray-400 italic mt-1">* Dato de referencia (mock)</p>
                   </div>
                 </div>
               </div>
             }

             <!-- Details -->
             <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Dirección de Envío</h3>
                    <p class="text-gray-900 font-medium whitespace-pre-line">{{ order()?.direccionResumen || 'No especificada' }}</p>
                  </div>
                  <div class="md:text-right">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total</h3>
                    <p class="text-3xl font-extrabold text-gray-900">{{ order()?.total | currency:order()?.moneda }}</p>
                  </div>
                </div>

                @if (canCancel()) {
                  <div class="mt-8 pt-8 border-t border-gray-100">
                    @if (!showCancelModal) {
                      <button (click)="showCancelModal = true" class="text-red-600 hover:text-red-800 font-bold transition-colors">
                        Cancelar pedido
                      </button>
                    }
                    
                    @if (showCancelModal) {
                      <div class="mt-4 bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h4 class="text-red-900 font-bold mb-2">Motivo de cancelación</h4>
                        <p class="text-red-700 text-sm mb-4">Por favor escribe brevemente por qué deseas cancelar este pedido (Mínimo 10 caracteres).</p>
                        <textarea [(ngModel)]="cancelReason" rows="3" class="w-full text-sm rounded-lg border-red-200 focus:ring-red-500 focus:border-red-500 p-3 mb-4"></textarea>
                        <div class="flex gap-2">
                           <button 
                             [disabled]="cancelReason.length < 10" 
                             (click)="executeCancelation()" 
                             class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors">
                             Confirmar Cancelación
                           </button>
                           <button (click)="showCancelModal = false" class="text-gray-600 hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold transition-colors">
                             Atrás
                           </button>
                        </div>
                      </div>
                    }
                  </div>
                }
             </div>

           </div>
        }
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
  `]
})
export class OrderDetailComponent implements OnInit {
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  route = inject(ActivatedRoute);
  location = inject(Location);

  order = signal<Order | null>(null);
  loading = signal(true);

  showCancelModal = false;
  cancelReason = '';

  // ═══ MOCKS FRONTEND — Solo apoyo visual ═══
  refPagoMock = '';
  guiaMock = '';
  proveedorMock = PROVEEDOR_MOCK;

  // Stepper con todos los pasos reales del backend
  private readonly stepLogic: OrderStatus[] = ['PENDIENTE', 'CONFIRMADA', 'PAGO_PROCESADO', 'EN_PREPARACION', 'ENVIADA', 'ENTREGADA'];

  /** Mostrar info de tracking solo si la orden tiene pago procesado o más */
  showTrackingInfo = computed(() => {
    const estado = this.order()?.estado;
    if (!estado) return false;
    const idx = this.stepLogic.indexOf(estado);
    return idx >= this.stepLogic.indexOf('PAGO_PROCESADO');
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadOrder(id);
      }
    });
  }

  loadOrder(id: string) {
    this.orderService.getOrderById(id).subscribe({
      next: (o) => {
        this.order.set(o);
        // Generar mocks basados en el ID de la orden
        this.refPagoMock = o.referenciaPago || generarReferenciaPagoMock(o.id);
        this.guiaMock = o.numeroGuia || generarGuiaEnvioMock(o.id);
        this.proveedorMock = o.proveedorLogistico || PROVEEDOR_MOCK;
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('No se pudo cargar la orden');
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  canCancel(): boolean {
    const estado = this.order()?.estado;
    if (!estado) return false;
    return !['ENVIADA', 'ENTREGADA', 'CANCELADA'].includes(estado);
  }

  executeCancelation() {
    if (this.cancelReason.length < 10) return;
    
    this.orderService.cancelOrder(this.order()!.id, this.cancelReason).subscribe({
      next: (updatedOrder) => {
        this.order.set(updatedOrder);
        this.showCancelModal = false;
        this.notification.success('Orden cancelada exitosamente.');
      },
      error: () => {
        this.notification.error('Hubo un error al cancelar la orden.');
      }
    });
  }

  getStepperProgress(): number {
    const estado = this.order()?.estado || 'PENDIENTE';
    const idx = Math.max(0, this.stepLogic.indexOf(estado));
    // 5 pasos visuales: CONFIRMADA(0), PAGO(1), PREP(2), ENVIADA(3), ENTREGADA(4)
    let visualStep = 0;
    if (idx >= this.stepLogic.indexOf('CONFIRMADA')) visualStep = 0;
    if (idx >= this.stepLogic.indexOf('PAGO_PROCESADO')) visualStep = 1;
    if (idx >= this.stepLogic.indexOf('EN_PREPARACION')) visualStep = 2;
    if (idx >= this.stepLogic.indexOf('ENVIADA')) visualStep = 3;
    if (idx >= this.stepLogic.indexOf('ENTREGADA')) visualStep = 4;

    return (visualStep / 4) * 100;
  }

  getStepClass(targetStep: OrderStatus): string {
    const estado = this.order()?.estado || 'PENDIENTE';
    const currentIdx = this.stepLogic.indexOf(estado);
    const targetIdx = this.stepLogic.indexOf(targetStep);

    if (currentIdx >= targetIdx) {
      return 'bg-emerald-500 text-white border-none z-10';
    } else {
      return 'bg-white text-gray-400 border-2 border-gray-200 z-10';
    }
  }

  getStatusBadgeType(estado: string): 'success'|'warning'|'danger'|'info'|'neutral' {
    switch(estado) {
      case 'ENTREGADA': return 'success';
      case 'CANCELADA': return 'danger';
      case 'ENVIADA': return 'info';
      case 'EN_PREPARACION':
      case 'PAGO_PROCESADO': return 'warning';
      default: return 'neutral';
    }
  }
}

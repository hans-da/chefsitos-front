import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { Address } from '../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-12 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        @if (orderCompleted) {
          <div class="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 max-w-2xl mx-auto transform animate-fade-in-up">
            <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner shadow-emerald-200">
               <svg class="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">¡Orden Confirmada!</h1>
            <p class="text-gray-500 mb-8 leading-relaxed">Tu pedido ha sido procesado exitosamente. En breve recibirás un correo con la confirmación. El ID de tu orden es: <br><span class="font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-md mt-2 inline-block font-bold">#{{ finalOrderId }}</span></p>
            <div class="flex gap-4 justify-center">
              <a routerLink="/mis-ordenes" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-0.5">Ver mis órdenes</a>
              <a routerLink="/" class="px-6 py-3 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5">Volver al inicio</a>
            </div>
          </div>
        } @else if (loading) {
          <app-loading-spinner message="Procesando tu pedido, por favor espera..."></app-loading-spinner>
        } @else {
          
          <div class="mb-10 text-center">
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Completa tu pedido</h1>
            <p class="text-gray-500 mt-2">Estás a un paso de recibir tus productos. Ingresa tu dirección de envío.</p>
          </div>

          <div class="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            <!-- Address Form -->
            <div class="w-full md:w-3/5 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17.657 16.657l-4.243 4.243a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Dirección de Envío
              </h2>
              
              <form [formGroup]="addressForm" (ngSubmit)="submitOrder()" class="space-y-6">
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del destinatario *</label>
                  <input type="text" formControlName="nombreDestinatario" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3" placeholder="Ej. Juan Pérez">
                  @if (addressForm.get('nombreDestinatario')?.invalid && addressForm.get('nombreDestinatario')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium">Nombre es requerido.</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Calle y número *</label>
                  <input type="text" formControlName="calle" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3" placeholder="Ej. Av. Principal 123, Col. Centro">
                  @if (addressForm.get('calle')?.invalid && addressForm.get('calle')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium">Calle es requerida.</p>
                  }
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Ciudad *</label>
                    <input type="text" formControlName="ciudad" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Estado *</label>
                    <input type="text" formControlName="estado" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Código Postal *</label>
                    <input type="text" formControlName="codigoPostal" maxlength="5" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3" placeholder="5 dígitos">
                    @if (addressForm.get('codigoPostal')?.invalid && addressForm.get('codigoPostal')?.touched) {
                      <p class="text-red-500 text-xs mt-1 font-medium">Requiere exactamente 5 dígitos.</p>
                    }
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Teléfono *</label>
                    <input type="text" formControlName="telefono" maxlength="10" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3" placeholder="10 dígitos">
                    @if (addressForm.get('telefono')?.invalid && addressForm.get('telefono')?.touched) {
                      <p class="text-red-500 text-xs mt-1 font-medium">Requiere exactamente 10 dígitos.</p>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Instrucciones de entrega (Opcional)</label>
                  <textarea formControlName="instrucciones" rows="2" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border px-4 py-3" placeholder="Ej. Dejar en portería"></textarea>
                </div>

                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                   <p class="text-sm text-indigo-800 font-medium flex items-center gap-2">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     País de envío fijo: México
                   </p>
                </div>

              </form>
            </div>

            <!-- Order Summary Sidebar -->
            <div class="w-full md:w-2/5 p-8 md:p-10 bg-gray-50 flex flex-col justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Resumen de tu pedido</h2>
                
                <ul class="space-y-4 mb-6 relative pl-4 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-gray-200">
                  @for (item of cart()?.items; track item.productoId) {
                    <li class="relative">
                      <span class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></span>
                      <div class="flex justify-between items-start">
                        <div class="pr-4">
                          <p class="text-sm font-bold text-gray-900 leading-tight">{{ item.nombreProducto }}</p>
                          <p class="text-xs text-gray-500 mt-1">Cant: {{ item.cantidad }}</p>
                        </div>
                        <p class="text-sm font-semibold text-gray-900 whitespace-nowrap">{{ item.subtotal | currency:item.moneda }}</p>
                      </div>
                    </li>
                  }
                </ul>

                <div class="space-y-3 pt-6 border-t border-gray-200 text-sm text-gray-600">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-medium text-gray-900">{{ cart()?.subtotal | currency:cart()?.moneda }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Envío a domicilio</span>
                    <span class="font-medium text-emerald-600">Gratis</span>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <div class="flex justify-between items-end mb-6">
                  <span class="text-base font-bold text-gray-900">Total a pagar</span>
                  <span class="text-3xl font-extrabold text-indigo-600">{{ cart()?.total | currency:cart()?.moneda }}</span>
                </div>

                <button 
                  [disabled]="addressForm.invalid"
                  (click)="submitOrder()"
                  class="w-full py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Finalizar Compra
                </button>
              </div>
            </div>

          </div>
        }
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.5s ease-out forwards;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  fb = inject(FormBuilder);
  router = inject(Router);

  cart = this.cartService.cart;

  loading = false;
  orderCompleted = false;
  finalOrderId = '';

  addressForm = this.fb.group({
    nombreDestinatario: ['', Validators.required],
    calle: ['', Validators.required],
    ciudad: ['', Validators.required],
    estado: ['', Validators.required],
    codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    instrucciones: ['']
  });

  ngOnInit() {
    const c = this.cart();
    if (!c || c.estado !== 'EN_CHECKOUT') {
      this.notification.error('El carrito no está en proceso de checkout');
      this.router.navigate(['/carrito']);
    }
  }

  submitOrder() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const c = this.cart();
    if (!c) return;

    this.loading = true;
    const addressData = this.addressForm.value as Address;

    this.orderService.createOrderFromCart(c.carritoId, addressData).subscribe({
      next: (order) => {
        this.orderCompleted = true;
        this.finalOrderId = order.numeroOrden;
        this.cartService.clearLocalCart();
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al procesar la orden. Intenta nuevamente.');
        this.loading = false;
      }
    });
  }
}

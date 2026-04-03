import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Address } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent, CurrencyPipe],
  template: `
    <app-navbar></app-navbar>
    <div class="bg-[#fafafa] min-h-screen pt-12 pb-32 px-4">
      <div class="max-w-3xl mx-auto">
        
        <div class="text-center mb-16 animate-in fade-in duration-1000">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-6">
            <span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span class="text-[9px] font-black uppercase tracking-[0.2em]">Checkout · Demo Auth</span>
          </div>
          <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Finalizar <span class="text-indigo-600">Compra</span></h1>
        </div>

        <!-- Resumen del carrito -->
        @if (cart()) {
          <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 italic">Resumen del Pedido</h2>
            <div class="space-y-3">
              @for (item of cart()!.items; track item.productoId) {
                <div class="flex justify-between items-center text-sm">
                  <span class="font-semibold text-gray-700">{{ item.nombreProducto }} × <span class="text-indigo-600 font-bold">{{ item.cantidad }}</span></span>
                  <span class="font-bold text-gray-900">{{ item.subtotal | currency:item.moneda }}</span>
                </div>
              }
              <div class="border-t pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span class="text-indigo-600">{{ cart()!.total | currency:cart()!.moneda }}</span>
              </div>
            </div>
          </div>
        } @else {
          <div class="bg-white rounded-3xl p-12 text-center border border-gray-100 mb-8">
            <p class="text-gray-500">Tu carrito está vacío. <a routerLink="/catalogo" class="text-indigo-600 font-bold">Ir al catálogo</a></p>
          </div>
        }

        <!-- Formulario de envío -->
        <form [formGroup]="checkoutForm" (ngSubmit)="processOrder()" class="space-y-8">
          <div class="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-10 italic underline decoration-indigo-200 underline-offset-8">01 Información del Destinatario</h2>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2">
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Nombre Completo del Destinatario</label>
                  <input formControlName="nombreDestinatario" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="Juan Pérez">
                  @if (checkoutForm.get('nombreDestinatario')?.touched && checkoutForm.get('nombreDestinatario')?.invalid) {
                    <p class="text-red-500 text-xs mt-1 ml-2">Este campo es requerido</p>
                  }
                </div>
                <div class="col-span-2">
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Calle y Número</label>
                  <input formControlName="calle" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="Av. Universidad 186, int. 4">
                  @if (checkoutForm.get('calle')?.touched && checkoutForm.get('calle')?.invalid) {
                    <p class="text-red-500 text-xs mt-1 ml-2">Este campo es requerido</p>
                  }
                </div>
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ciudad</label>
                  <input formControlName="ciudad" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="Ciudad de México">
                </div>
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Estado</label>
                  <input formControlName="estado" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="CDMX">
                </div>
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Código Postal</label>
                  <input formControlName="codigoPostal" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="09340">
                  @if (checkoutForm.get('codigoPostal')?.touched && checkoutForm.get('codigoPostal')?.invalid) {
                    <p class="text-red-500 text-xs mt-1 ml-2">Código postal inválido (5 dígitos)</p>
                  }
                </div>
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Teléfono de Contacto</label>
                  <input formControlName="telefono" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="5512345678">
                  @if (checkoutForm.get('telefono')?.touched && checkoutForm.get('telefono')?.invalid) {
                    <p class="text-red-500 text-xs mt-1 ml-2">Teléfono requerido (10 dígitos)</p>
                  }
                </div>
                <div class="col-span-2">
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Instrucciones de Entrega (Opcional)</label>
                  <input formControlName="instrucciones" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="Dejar en portería, llamar antes de entregar...">
                </div>
              </div>
            </div>
          </div>

          <!-- Botón de pago -->
          <div class="bg-gray-900 rounded-[3.5rem] p-12 shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
            <div class="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-30"></div>

            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 italic relative z-10">02 Confirmar y Pagar</h2>
            
            <div class="relative z-10 space-y-4 text-gray-300 text-sm mb-10">
              <p>Al confirmar, se creará tu orden en el sistema con el estado <strong class="text-white">PENDIENTE</strong>. El administrador la procesará y notificará el avance.</p>
            </div>

            @if (processing()) {
              <div class="w-full mt-4 py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-3 relative z-10">
                <span class="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Procesando...
              </div>
            } @else {
              <button type="submit" [disabled]="checkoutForm.invalid || !cart()" class="w-full mt-4 py-7 bg-white text-gray-900 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-indigo-400 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20 disabled:grayscale relative z-10">
                Confirmar Orden · {{ cart()?.total | currency:cart()?.moneda }}
              </button>
            }
            <p class="text-center text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mt-8 relative z-10">Transacción procesada por UAMIShop</p>
          </div>
        </form>
      </div>
    </div>
    <app-footer></app-footer>
  `
})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  router = inject(Router);

  cart = this.cartService.cart;
  processing = signal(false);

  checkoutForm = this.fb.group({
    nombreDestinatario: ['', Validators.required],
    calle: ['', Validators.required],
    ciudad: ['', Validators.required],
    estado: ['', Validators.required],
    codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    instrucciones: ['']
  });

  processOrder() {
    if (this.checkoutForm.invalid || !this.cart()) return;

    const current = this.cart()!;
    this.processing.set(true);

    const direccion: Address = {
      nombreDestinatario: this.checkoutForm.value.nombreDestinatario!,
      calle: this.checkoutForm.value.calle!,
      ciudad: this.checkoutForm.value.ciudad!,
      estado: this.checkoutForm.value.estado!,
      codigoPostal: this.checkoutForm.value.codigoPostal!,
      telefono: this.checkoutForm.value.telefono!,
      instrucciones: this.checkoutForm.value.instrucciones || undefined
    };

    // Flujo real: startCheckout → createOrderFromCart → completeCheckout
    this.cartService.startCheckout().pipe(
      switchMap(() =>
        this.orderService.createOrderFromCart(current.carritoId, direccion)
      ),
      switchMap(() =>
        this.cartService.completeCheckout()
      )
    ).subscribe({
      next: () => {
        this.processing.set(false);
        this.notification.success('¡Orden creada exitosamente! Puedes seguir su estado en Mis Órdenes.');
        this.router.navigate(['/mis-ordenes']);
      },
      error: (err) => {
        this.processing.set(false);
        const msg = err?.error?.message || 'Ocurrió un error al procesar tu orden. Intenta de nuevo.';
        this.notification.error(msg);
      }
    });
  }
}
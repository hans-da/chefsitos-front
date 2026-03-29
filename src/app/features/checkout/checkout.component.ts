import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component'; // Corregido
import { FooterComponent } from '../../shared/components/footer/footer.component'; // Corregido

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="bg-[#fafafa] min-h-screen pt-12 pb-32 px-4">
      <div class="max-w-3xl mx-auto">
        
        <div class="text-center mb-16 animate-in fade-in duration-1000">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-6">
            <span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span class="text-[9px] font-black uppercase tracking-[0.2em]">Secure Checkout Gateway</span>
          </div>
          <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Pago <span class="text-indigo-600">Seguro</span></h1>
        </div>

        <form [formGroup]="checkoutForm" class="space-y-8">
          <div class="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-10 italic underline decoration-indigo-200 underline-offset-8">01 Información de Envío</h2>
            <div class="space-y-6">
              <div class="group">
                <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Dirección Completa</label>
                <input formControlName="address" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="Av. Universidad 186, Iztapalapa...">
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ciudad</label>
                  <input formControlName="city" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="CDMX">
                </div>
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Código Postal</label>
                  <input formControlName="zip" class="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none" placeholder="09340">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-[3.5rem] p-12 shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
             <div class="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-30"></div>
             
             <h2 class="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-12 italic relative z-10">02 Detalles de la Tarjeta</h2>

             <div class="space-y-8 relative z-10">
                <div class="space-y-3">
                  <label class="text-[9px] font-black text-indigo-200 uppercase tracking-widest ml-4">Número de Tarjeta</label>
                  <input formControlName="card" class="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 font-black tracking-[0.4em] focus:border-indigo-400 transition-all text-xl outline-none" placeholder="0000 0000 0000 0000">
                </div>

                <div class="grid grid-cols-2 gap-8">
                  <div class="space-y-3">
                    <label class="text-[9px] font-black text-indigo-200 uppercase tracking-widest ml-4">Expiración</label>
                    <input formControlName="exp" class="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 font-bold focus:border-indigo-400 transition-all text-center outline-none" placeholder="MM / YY">
                  </div>
                  <div class="space-y-3">
                    <label class="text-[9px] font-black text-indigo-200 uppercase tracking-widest ml-4">CVC</label>
                    <input formControlName="cvc" class="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 font-bold focus:border-indigo-400 transition-all text-center outline-none" placeholder="***">
                  </div>
                </div>
             </div>

             <button type="button" [disabled]="checkoutForm.invalid" class="w-full mt-16 py-7 bg-white text-gray-900 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-indigo-400 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20 disabled:grayscale">
                Pagar {{ cart()?.total | currency:cart()?.moneda }}
             </button>
             <p class="text-center text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mt-8">Transacción Protegida por UAMI-SECURE</p>
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
  cart = this.cartService.cart;

  checkoutForm = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    card: ['', [Validators.required, Validators.minLength(16)]],
    exp: ['', Validators.required],
    cvc: ['', [Validators.required, Validators.minLength(3)]]
  });
}
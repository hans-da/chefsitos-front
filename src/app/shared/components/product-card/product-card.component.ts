import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div [routerLink]="['/productos', product?.idProducto]" class="group bg-white rounded-[2.5rem] p-6 hover:translate-y-[-8px] transition-all duration-500 border border-gray-100 shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-900/10 h-full flex flex-col justify-between cursor-pointer relative overflow-hidden">
      <!-- Subtle internal glow -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div>
        <div class="relative overflow-hidden rounded-2xl mb-5">
          <img 
            [src]="product?.imagenUrl || 'https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=600&auto=format&fit=crop'" 
            class="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          @if (product?.disponible) {
            <div class="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">Activo</div>
          }
        </div>

        <div class="space-y-1 mb-6 relative z-10">
          <p class="font-black text-xl text-[#1a1a1a] tracking-tight line-clamp-1 italic uppercase">{{ product?.nombreProducto }}</p>
          <div class="flex items-center justify-between">
            <p class="text-emerald-600 font-black text-2xl tracking-tighter">
              $\{{ product?.precio }}
            </p>
            <span class="text-gray-300 text-[9px] uppercase font-black tracking-[0.2em]">{{ product?.moneda }}</span>
          </div>
        </div>
      </div>

      @if (product?.disponible) {
        <button 
          (click)="addToCart($event)"
          [disabled]="adding()"
          class="w-full py-4 bg-gray-900 hover:bg-[#006341] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 shadow-xl hover:shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2 relative z-10"
        >
          @if (adding()) {
            <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Añadiendo...
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
            Al Carrito
          }
        </button>
      } @else {
        <div class="w-full py-4 border-2 border-gray-800 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center cursor-not-allowed">
          No Disponible
        </div>
      }
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: any;
  
  cartService = inject(CartService);
  notification = inject(NotificationService);
  adding = signal(false);

  addToCart(e: Event) {
    e.stopPropagation();
    if (!this.product?.idProducto) return;
    
    this.adding.set(true);
    this.cartService.addProduct(this.product.idProducto, 1).subscribe({
      next: () => {
        this.adding.set(false);
        this.notification.success(`¡${this.product.nombreProducto} añadido al carrito!`);
      },
      error: (err) => {
        this.adding.set(false);
        if (err && err.message === 'Usuario no autenticado') {
          this.notification.error('Inicia sesión para añadir productos al carrito');
        }
      }
    });
  }
}
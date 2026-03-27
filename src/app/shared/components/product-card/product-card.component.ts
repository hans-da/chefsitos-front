import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { BadgeComponent } from '../badge/badge.component';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  template: `
    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div class="relative w-full pt-[100%] bg-gray-50 overflow-hidden">
        <img 
          [src]="'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'" 
          [alt]="product.nombreProducto"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        @if (!product.disponible) {
          <div class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span class="bg-gray-900 text-white px-4 py-2 rounded-full font-semibold tracking-wide text-sm shadow-lg">Agotado</span>
          </div>
        }
      </div>
      
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start mb-2 gap-2">
          <h3 class="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
            <a [routerLink]="['/productos', product.idProducto]" class="hover:text-indigo-600 transition-colors">
              {{ product.nombreProducto }}
            </a>
          </h3>
          <span class="font-bold text-lg text-emerald-600 whitespace-nowrap">{{ product.precio | currency:product.moneda }}</span>
        </div>
        
        <p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {{ product.descripcion }}
        </p>
        
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <app-badge [text]="product.disponible ? 'Disponible' : 'Sin stock'" [type]="product.disponible ? 'success' : 'neutral'"></app-badge>
          
          <button 
            [disabled]="!product.disponible"
            (click)="addToCart($event)"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-indigo-50 disabled:hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Agregar al carrito">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  
  cartService = inject(CartService);
  notification = inject(NotificationService);

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.product.disponible) return;
    
    this.cartService.addProduct(this.product.idProducto, 1).subscribe({
      next: () => this.notification.success(`${this.product.nombreProducto} agregado al carrito`),
      error: () => this.notification.error('Error al agregar el producto. Inicia sesión primero.')
    });
  }
}

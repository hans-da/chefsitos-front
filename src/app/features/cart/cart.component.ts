import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-12 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Tu Carrito de Compras</h1>

        @if (!cart() || cart()!.items.length === 0) {
          <div class="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div class="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg class="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h3>
            <p class="text-gray-500 mb-8 max-w-sm">Aún no has agregado ningún producto. Descubre nuestro catálogo y encuentra lo que buscas.</p>
            <a routerLink="/catalogo" class="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1">
              Explorar Catálogo
            </a>
          </div>
        } @else {
          <div class="flex flex-col lg:flex-row gap-8">
            
            <!-- Items Box -->
            <div class="w-full lg:w-2/3">
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                <div class="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 class="text-xl font-bold text-gray-900">Productos ({{ totalItems() }})</h2>
                  <button (click)="clearCart()" class="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center group transition-colors">
                    <svg class="w-4 h-4 mr-1 transform group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Vaciar Carrito
                  </button>
                </div>

                <ul class="divide-y divide-gray-100">
                  @for (item of cart()!.items; track item.productoId) {
                    <li class="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                      <!-- Image placeholder per item -->
                      <div class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden relative border border-gray-200">
                        <img 
                          [src]="'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'" 
                          [alt]="item.nombreProducto"
                          class="absolute inset-0 w-full h-full object-cover"
                        >
                      </div>

                      <div class="flex-grow flex flex-col justify-between">
                        <div class="flex justify-between items-start gap-4">
                          <div>
                            <h3 class="text-lg font-bold text-gray-900 line-clamp-2">
                              <a [routerLink]="['/productos', item.productoId]" class="hover:text-indigo-600 transition-colors">{{ item.nombreProducto }}</a>
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">SKU: {{ item.sku }}</p>
                          </div>
                          <div class="text-right">
                             <p class="text-lg font-bold text-gray-900">{{ item.subtotal | currency:item.moneda }}</p>
                             <p class="text-xs text-gray-500 mt-1">{{ item.precioUnitario | currency:item.moneda }} c/u</p>
                          </div>
                        </div>

                        <div class="flex items-center justify-between mt-6">
                           <div class="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                             <button (click)="updateQty(item.productoId, item.cantidad - 1)" class="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors font-bold disabled:opacity-50" [disabled]="item.cantidad <= 1">-</button>
                             <input type="number" 
                               readonly
                               [value]="item.cantidad" 
                               class="w-12 text-center text-sm font-semibold text-gray-900 border-x border-gray-300 py-2 focus:outline-none bg-gray-50">
                             <button (click)="updateQty(item.productoId, item.cantidad + 1)" class="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors font-bold disabled:opacity-50" [disabled]="item.cantidad >= 10">+</button>
                           </div>
                           
                           <button (click)="removeItem(item.productoId)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                             Eliminar
                           </button>
                        </div>
                      </div>
                    </li>
                  }
                </ul>
                
              </div>
            </div>

            <!-- Summary Box -->
            <div class="w-full lg:w-1/3">
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-28">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Resumen de Compra</h2>
                
                <div class="space-y-4 text-sm text-gray-600 mb-6">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-medium text-gray-900">{{ cart()?.subtotal | currency:cart()?.moneda }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Envío</span>
                    <span class="font-medium text-emerald-600">Gratis</span>
                  </div>
                  <!-- Cupón UI Mock -->
                  <div class="pt-4 border-t border-gray-100">
                    <label for="cupon" class="block text-sm font-medium text-gray-700 mb-2">Código de descuento</label>
                    <div class="flex gap-2">
                       <input [(ngModel)]="cupon" type="text" id="cupon" placeholder="EJ: UAMI20" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border">
                       <button (click)="applyCoupon()" class="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">Aplicar</button>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-6 mb-8 flex justify-between items-end">
                  <span class="text-base font-bold text-gray-900">Total</span>
                  <span class="text-3xl font-extrabold text-gray-900">{{ cart()?.total | currency:cart()?.moneda }}</span>
                </div>

                <button 
                  (click)="proceedToCheckout()"
                  [disabled]="!canCheckout()"
                  class="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed">
                  Continuar al Checkout
                </button>
                @if (!canCheckout() && cart()!.total < 50) {
                  <p class="text-red-500 text-xs text-center mt-3 font-medium">El total debe ser mayor a $50.00 MXN para proceder.</p>
                }
              </div>
            </div>

          </div>
        }
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class CartComponent {
  cartService = inject(CartService);
  notification = inject(NotificationService);
  router = inject(Router);

  cart = this.cartService.cart;
  cupon = '';

  totalItems = computed(() => {
    const c = this.cart();
    return c ? c.items.reduce((acc, i) => acc + i.cantidad, 0) : 0;
  });

  updateQty(productId: string, qty: number) {
    if (qty < 1 || qty > 10) return;
    this.cartService.updateQuantity(productId, qty).subscribe({
      error: () => this.notification.error('Error al actualizar la cantidad')
    });
  }

  removeItem(productId: string) {
    this.cartService.removeProduct(productId).subscribe({
      next: () => this.notification.success('Producto eliminado del carrito'),
      error: () => this.notification.error('Error al eliminar producto')
    });
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.cartService.clearCart().subscribe({
        next: () => this.notification.info('Carrito vaciado'),
        error: () => this.notification.error('Error al vaciar carrito')
      });
    }
  }

  applyCoupon() {
    if (!this.cupon) return;
    // UI Only as per prompt
    this.notification.info('Funcionalidad de cupones no disponible en esta versión, pronto estará lista.');
    this.cupon = '';
  }

  canCheckout(): boolean {
    const c = this.cart();
    return !!c && c.items.length > 0 && c.total >= 50;
  }

  proceedToCheckout() {
    if (!this.canCheckout()) return;
    
    // As mentioned in prompt: create order requires EN_CHECKOUT state
    this.cartService.startCheckout().subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: () => {
        this.notification.error('No se pudo iniciar el proceso de checkout. Verifica el inventario.');
      }
    });
  }
}

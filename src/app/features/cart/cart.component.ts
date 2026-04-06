import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { NotificationService } from '../../core/services/notification.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-[#fafafa] min-h-screen pt-24 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-12">
          <h1 class="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">Mi <span class="text-indigo-600">Carrito</span></h1>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Revisa tus productos antes de finalizar</p>
        </div>

        <!-- Banner: carrito en checkout -->
        @if (cartService.isInCheckout()) {
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div class="flex-grow">
              <h3 class="font-bold text-amber-900">Carrito en proceso de compra</h3>
              <p class="text-amber-700 text-sm mt-1">Este carrito ya inició el proceso de checkout. Completa tu compra o los items se liberarán automáticamente.</p>
            </div>
            <button 
              (click)="continueToCheckout()"
              class="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all flex-shrink-0">
              Continuar al checkout →
            </button>
          </div>
        }

        @if (!cart() || (cart()?.items?.length ?? 0) === 0) {
          <div class="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
            <div class="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-10 relative">
              <div class="absolute inset-0 bg-indigo-50 rounded-full animate-ping opacity-20"></div>
              <svg class="w-16 h-16 text-indigo-200 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h3 class="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Tu carrito está vacío</h3>
            <a routerLink="/catalogo" class="px-12 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 shadow-2xl transition-all active:scale-95">
              Explorar Catálogo
            </a>
          </div>
        } @else {
          <div class="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start">
            
            <div class="w-full lg:col-span-8 space-y-6">
              <div class="flex justify-between items-end px-4 mb-4">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ totalItems() }} Artículos seleccionados</span>
                
                @if (cartService.isEditable()) {
                  <div class="flex items-center gap-4">
                    @if (showConfirmClear) {
                      <div class="flex items-center gap-3">
                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">¿Vaciar carrito?</span>
                        <button (click)="confirmClear(true)" class="px-4 py-2 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg hover:bg-red-600 transition-colors">Sí, vaciar</button>
                        <button (click)="confirmClear(false)" class="px-4 py-2 bg-gray-100 text-gray-600 text-[9px] font-black uppercase rounded-lg hover:bg-gray-200 transition-colors">No</button>
                      </div>
                    } @else {
                      <button (click)="showConfirmClear = true" class="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="3"></path></svg>
                        Limpiar carrito
                      </button>
                    }
                  </div>
                }
              </div>

              @for (item of cart()!.items; track item.productoId) {
                <div class="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 relative overflow-hidden" [class.opacity-60]="!cartService.isEditable()">
                  
                  <div class="w-full sm:w-40 h-40 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-100">
                    <img 
                      [src]="getProductImage(item)" 
                      [alt]="item.nombreProducto"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    >
                  </div>

                  <div class="flex-grow flex flex-col justify-between py-2">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="text-xl font-black text-gray-900 tracking-tighter uppercase mb-1">
                          <a [routerLink]="['/productos', item.productoId]" class="hover:text-indigo-600 transition-colors">{{ item.nombreProducto }}</a>
                        </h3>
                        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">SKU: {{ item.sku }}</p>
                      </div>
                      <div class="text-right flex flex-col">
                         <span class="text-xl font-black text-indigo-600">{{ item.subtotal | currency:item.moneda }}</span>
                         <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ item.precioUnitario | currency:item.moneda }} c/u</span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between mt-8">
                       @if (cartService.isEditable()) {
                         <div class="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
                           <button (click)="updateQty(item.productoId, item.cantidad - 1)" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 font-black disabled:opacity-20 transition-colors" [disabled]="item.cantidad <= 1">－</button>
                           <span class="w-12 text-center font-black text-indigo-600 text-base">{{ item.cantidad }}</span>
                           <button (click)="updateQty(item.productoId, item.cantidad + 1)" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 font-black disabled:opacity-20 transition-colors" [disabled]="item.cantidad >= 10">＋</button>
                         </div>
                         
                         <button (click)="removeItem(item.productoId)" class="group/del p-3 text-gray-300 hover:text-red-500 transition-colors">
                            <svg class="w-5 h-5 group-hover/del:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2.5"></path></svg>
                         </button>
                       } @else {
                         <div class="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
                           <span class="px-4 py-2 font-black text-gray-500 text-base">Cantidad: {{ item.cantidad }}</span>
                         </div>
                       }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Resumen Sidebar -->
            <div class="w-full lg:col-span-4 lg:sticky lg:top-28">
              <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-300/40 border border-gray-100 text-gray-900 relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-600 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
                
                <h2 class="text-2xl font-black uppercase tracking-tighter mb-10 italic text-gray-900">Resumen</h2>
                
                <div class="space-y-6 mb-12">
                  <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                    <span class="font-bold text-lg text-gray-900">{{ cart()?.subtotal | currency:cart()?.moneda }}</span>
                  </div>
                  <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Envío</span>
                    <span class="font-black text-[10px] uppercase tracking-widest text-emerald-600">Bonificado</span>
                  </div>
                  
                  @if (cartService.isEditable()) {
                    <div class="pt-2">
                      <label class="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Código Promocional</label>
                      <div class="flex gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-400 transition-all">
                         <input [(ngModel)]="cupon" type="text" placeholder="UAMI2026" class="bg-transparent border-none text-gray-900 text-xs font-bold w-full focus:ring-0 px-2 uppercase placeholder:text-gray-300">
                         <button (click)="applyCoupon()" class="px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-600 transition-all">Aplicar</button>
                      </div>
                    </div>
                  }
                </div>

                <div class="mb-10">
                  <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-2">Total a pagar</span>
                  <div class="text-5xl font-black tracking-tighter leading-none italic text-gray-900">{{ cart()?.total | currency:cart()?.moneda }}</div>
                </div>

                @if (cartService.isInCheckout()) {
                  <button 
                    (click)="continueToCheckout()"
                    class="group relative w-full py-6 bg-amber-500 text-white rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all">
                    Continuar Checkout →
                  </button>
                } @else {
                  <button 
                    (click)="proceedToCheckout()"
                    [disabled]="!canCheckout()"
                    class="group relative w-full py-6 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:bg-gray-400">
                    Proceder al Checkout
                  </button>

                  @if (!canCheckout() && (cart()?.total ?? 0) < 50) {
                    <p class="text-[10px] font-black text-red-500 text-center mt-6 uppercase tracking-widest animate-pulse">Min. $50.00 para ordenar</p>
                  }
                }
              </div>
              
              <p class="mt-8 text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Chefsitos Pay • Transacción Segura</p>
            </div>

          </div>
        }
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  catalogService = inject(CatalogService);
  notification = inject(NotificationService);
  router = inject(Router);
  cart = this.cartService.cart;
  cupon = '';
  showConfirmClear = false;

  ngOnInit() {
    // Al iniciar, buscamos los productos para asegurar que el caché tenga las imágenes
    this.catalogService.getProducts().subscribe();
  }

  totalItems = computed(() => {
    const c = this.cart();
    return c ? c.items.reduce((acc: number, i: CartItem) => acc + i.cantidad, 0) : 0;
  });

  getProductImage(item: CartItem): string {
    // Primero, si el backend del carrito ya devolvió la url, la usamos
    // Si no, la buscamos del cache del catálogo.
    // Si nada funciona, mostramos el mock / placeholder genérico.
    const fromCache = this.catalogService.getFromCache(item.productoId)?.imagenUrl;
    return fromCache || item.imagenUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
  }

  updateQty(productId: string, qty: number) {
    if (qty < 1 || qty > 10) return;
    this.cartService.updateQuantity(productId, qty).subscribe({
      error: (err: any) => this.notification.error(err?.message || 'Error al actualizar la cantidad')
    });
  }

  removeItem(productId: string) {
    this.cartService.removeProduct(productId).subscribe({
      next: () => this.notification.success('Producto eliminado del carrito'),
      error: (err: any) => this.notification.error(err?.message || 'Error al eliminar producto')
    });
  }

  confirmClear(proceed: boolean) {
    if (proceed) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.notification.info('Carrito vaciado');
          this.showConfirmClear = false;
        },
        error: () => {
          this.notification.error('Error al vaciar carrito');
          this.showConfirmClear = false;
        }
      });
    } else {
      this.showConfirmClear = false;
    }
  }

  applyCoupon() {
    if (!this.cupon) return;
    this.notification.info('Los cupones estarán disponibles próximamente.');
    this.cupon = '';
  }

  canCheckout(): boolean {
    const c = this.cart();
    return !!c && c.items.length > 0 && c.total >= 50 && c.estado === 'ACTIVO';
  }

  proceedToCheckout() {
    if (!this.canCheckout()) return;
    this.cartService.startCheckout().subscribe({
      next: () => this.router.navigate(['/checkout']),
      error: () => this.notification.error('Error al iniciar checkout. Revisa inventario.')
    });
  }

  continueToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
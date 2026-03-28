import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, ProductStats } from '../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, BadgeComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-8 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Back Button -->
        <button (click)="goBack()" class="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8 group font-medium text-sm">
          <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al catálogo
        </button>

        @if (loading()) {
          <app-loading-spinner message="Cargando detalles del producto..."></app-loading-spinner>
        } @else if (product()) {
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex flex-col md:flex-row">
              
              <!-- Image Section -->
              <div class="w-full md:w-1/2 lg:w-3/5 bg-gray-50 relative group">
                <img 
                  [src]="'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'" 
                  [alt]="product()?.nombreProducto"
                  class="w-full h-full object-cover min-h-[400px] md:min-h-[500px]"
                />
                @if (!product()?.disponible) {
                  <div class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span class="bg-gray-900 text-white px-8 py-4 rounded-full font-bold tracking-widest text-lg shadow-2xl">Agotado</span>
                  </div>
                }
              </div>

              <!-- Product Info Section -->
              <div class="w-full md:w-1/2 lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                
                <div class="mb-4">
                  <app-badge 
                    [text]="product()!.disponible ? 'Disponible para envío' : 'Sin stock'" 
                    [type]="product()!.disponible ? 'success' : 'neutral'"
                    customClasses="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs uppercase tracking-wider rounded-md border border-emerald-200">
                  </app-badge>
                </div>
                
                <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                  {{ product()?.nombreProducto }}
                </h1>
                
                <div class="text-3xl font-bold text-gray-900 mb-6">
                  {{ product()?.precio | currency:product()?.moneda }}
                </div>
                
                <div class="prose prose-sm sm:prose text-gray-500 mb-6 max-w-none">
                  <p>{{ product()?.descripcion }}</p>
                </div>

                <div class="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Categoría</span>
                  <span class="text-sm font-semibold text-gray-700">{{ categoryName() }}</span>
                </div>

                <!-- Stats -->
                @if (stats()) {
                  <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                      <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Unidades vendidas</p>
                      <p class="text-xl font-bold text-gray-900">{{ stats()?.cantidadVendida }}</p>
                    </div>
                    <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                      <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Ventas Totales</p>
                      <p class="text-xl font-bold text-gray-900">{{ stats()?.ventasTotales | currency:product()?.moneda }}</p>
                    </div>
                    <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 col-span-2 flex justify-between items-center">
                      <div>
                        <p class="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Deseado por muchos</p>
                        <p class="text-sm font-medium text-gray-900">Agregado {{ stats()?.vecesAgregadoAlCarrito }} veces al carrito</p>
                      </div>
                      @if (stats()?.ultimaVentaAt) {
                        <div class="text-right">
                          <p class="text-[10px] text-gray-400 uppercase font-bold">Última venta</p>
                          <p class="text-xs font-semibold text-gray-500">{{ stats()?.ultimaVentaAt | date:'shortDate' }}</p>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (product()?.disponible) {
                  <form [formGroup]="addToCartForm" (ngSubmit)="addToCart()" class="mt-auto">
                    <div class="flex items-center gap-4 border-t border-gray-100 pt-8">
                      <div class="w-32">
                        <label for="quantity" class="sr-only">Cantidad</label>
                        <select 
                          id="quantity" 
                          formControlName="quantity"
                          class="block w-full text-base font-semibold text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-xl shadow-sm py-4 bg-gray-50 border text-center cursor-pointer">
                          <option [value]="1">1</option>
                          <option [value]="2">2</option>
                          <option [value]="3">3</option>
                          <option [value]="4">4</option>
                          <option [value]="5">5</option>
                          <option [value]="6">6</option>
                          <option [value]="7">7</option>
                          <option [value]="8">8</option>
                          <option [value]="9">9</option>
                          <option [value]="10">10</option>
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        class="flex-1 bg-indigo-600 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 transition-all transform hover:-translate-y-1">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        Añadir al carrito
                      </button>
                    </div>
                    <p class="text-xs text-center text-gray-400 mt-4">Máximo de 10 unidades por pedido.</p>
                  </form>
                } @else {
                  <div class="mt-auto border-t border-gray-100 pt-8">
                     <button disabled class="w-full bg-gray-300 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-gray-500 cursor-not-allowed">
                        Producto no disponible
                      </button>
                  </div>
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
export class ProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  notification = inject(NotificationService);
  fb = inject(FormBuilder);
  location = inject(Location);

  loading = signal(true);
  product = signal<Product | null>(null);
  stats = signal<ProductStats | null>(null);
  categoryName = signal<string>('Cargando...');

  addToCartForm = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProductInfo(id);
      }
    });
  }

  loadProductInfo(id: string) {
    this.loading.set(true);
    
    this.catalogService.getProductById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);

        // Fetch category name
        this.categoryService.getCategoryById(p.idCategoria).subscribe({
          next: (c) => this.categoryName.set(c.nombreCategoria),
          error: () => this.categoryName.set('Categoría no disponible')
        });

        // Fetch stats independently
        this.catalogService.getProductStats(id).subscribe({
          next: (s) => this.stats.set(s),
          error: () => {} // ignore if stats not found
        });
      },
      error: () => {
        this.notification.error('No se pudo cargar el producto.');
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  addToCart() {
    if (this.addToCartForm.invalid) return;

    const qty = Number(this.addToCartForm.value.quantity);
    const prod = this.product();

    if (prod && qty > 0) {
      this.cartService.addProduct(prod.idProducto, qty).subscribe({
        next: () => {
          this.notification.success(`Se agregaron ${qty} unidades de ${prod.nombreProducto} al carrito.`);
        },
        error: () => {
           this.notification.error('Error al agregar al carrito. Verifica si has iniciado sesión.');
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}

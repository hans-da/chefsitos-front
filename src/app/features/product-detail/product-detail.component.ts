import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product } from '../../core/models/product.model';
import { Stats } from '../../core/models/stats.model';
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

    <main class="bg-white min-h-screen pt-24 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button (click)="goBack()" class="group flex items-center text-gray-400 hover:text-indigo-600 transition-all mb-16 font-black text-[10px] uppercase tracking-[0.3em]">
          <span class="mr-3 transform group-hover:-translate-x-2 transition-transform">←</span> 
          Regresar al Menú
        </button>

        @if (loading()) {
          <app-loading-spinner message="Preparando tu selección..."></app-loading-spinner>
        } @else if (product()) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            
            <div class="lg:col-span-7 relative">
              <div class="absolute -top-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
              <div class="aspect-square bg-gray-50 rounded-[4rem] overflow-hidden border border-gray-100 relative shadow-2xl shadow-indigo-100/20 group">
                <img 
                  [src]="product()?.imagenUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'" 
                  [alt]="product()?.nombreProducto"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                @if (!product()?.disponible) {
                  <div class="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                    <span class="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl">Agotado temporalmente</span>
                  </div>
                }
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col pt-4">
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <span class="py-1 px-4 rounded-full bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest">{{ categoryName() }}</span>
                  <app-badge [text]="product()?.disponible ? 'En Cocina' : 'No Disponible'" [type]="product()?.disponible ? 'success' : 'neutral'"></app-badge>
                </div>
                
                <h1 class="text-5xl md:text-6xl font-black text-gray-900 leading-[0.9] mb-6 tracking-tighter italic uppercase">
                  {{ product()?.nombreProducto }}
                </h1>
                
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-light text-indigo-600">{{ product()?.precio | currency:product()?.moneda }}</span>
                  <span class="text-xs font-black text-gray-300 uppercase tracking-widest">I.V.A Incluido</span>
                </div>
              </div>

              <p class="text-gray-400 text-lg leading-relaxed mb-12 font-medium italic">
                "{{ product()?.descripcion }}"
              </p>

              @if (stats()) {
                <div class="grid grid-cols-2 gap-4 mb-12 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <div class="text-center border-r border-gray-200">
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Ordenados</p>
                    <p class="text-xl font-black text-gray-900">{{ stats()?.cantidadVendida }}<span class="text-indigo-600 text-sm ml-1">u.</span></p>
                  </div>
                  <div class="text-center">
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Deseados</p>
                    <p class="text-xl font-black text-gray-900">{{ stats()?.vecesAgregadoAlCarrito }}<span class="text-emerald-500 text-sm ml-1">❤</span></p>
                  </div>
                </div>
              }

              @if (product()?.disponible) {
                <form [formGroup]="addToCartForm" (ngSubmit)="addToCart()" class="space-y-6">
                  <div class="flex flex-col sm:flex-row items-center gap-4">
                    <div class="relative w-full sm:w-32 group">
                      <select formControlName="quantity" class="w-full appearance-none bg-white border-2 border-gray-100 rounded-[1.5rem] py-4 px-6 font-black text-gray-900 focus:border-indigo-600 focus:ring-0 transition-all cursor-pointer">
                        @for (n of [1,2,3,4,5]; track n) { <option [value]="n">{{n}}</option> }
                      </select>
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      </div>
                    </div>
                    
                    <button type="submit" class="group relative flex-grow w-full bg-gray-900 text-white py-5 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-indigo-600 transition-all duration-300 active:scale-95 overflow-hidden">
                       <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <span class="relative z-10">Agregar a mi orden</span>
                    </button>
                  </div>
                </form>
              }

              <div class="mt-12 flex items-center gap-4 py-6 border-t border-gray-50">
                <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preparación higiénica garantizada por <span class="text-indigo-300 italic">Chefsitos</span></p>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
    <app-footer></app-footer>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private catalogService = inject(CatalogService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private notification = inject(NotificationService);

  product = signal<Product | null>(null);
  stats = signal<Stats | null>(null);
  categoryName = signal<string>('Cargando...');
  loading = signal(true);

  addToCartForm = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductData(id);
    }
  }

  loadProductData(id: string) {
    this.loading.set(true);
    this.catalogService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.loadCategoryName(prod.idCategoria);
        this.loadStats(id);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('No pudimos encontrar ese producto');
        this.router.navigate(['/catalogo']);
      }
    });
  }

  loadCategoryName(catId: string) {
    this.categoryService.getCategoryById(catId).subscribe(cat => {
      this.categoryName.set(cat.nombreCategoria);
    });
  }

  loadStats(id: string) {
    this.catalogService.getProductStats(id).subscribe(s => this.stats.set(s));
  }

  goBack() { this.router.navigate(['/catalogo']); }

  addToCart() {
    const prod = this.product();
    if (prod && this.addToCartForm.valid) {
      const qty = this.addToCartForm.value.quantity || 1;
      this.cartService.addProduct(prod.idProducto, qty).subscribe({
        next: () => this.notification.success(`¡Listo! ${qty} ${prod.nombreProducto} al carrito`),
        error: () => this.notification.error('Inicia sesión para ordenar')
      });
    }
  }
}
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoryService } from '../../../core/services/category.service';
import { OrderService } from '../../../core/services/order.service';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white py-16 px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <!-- Stat Card 1 -->
        <div class="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center group hover:bg-emerald-50 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
             <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 17v-10l8 4"></path></svg>
          </div>
          <p class="text-5xl font-black text-gray-900 tracking-tighter mb-1">
            @if (loading()) { <span class="inline-block w-16 h-10 bg-gray-200 rounded animate-pulse"></span> }
            @else { {{ productoCount() }} }
          </p>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Productos Totales</p>
        </div>

        <!-- Stat Card 2 -->
        <div class="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center group hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
             <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </div>
          <p class="text-5xl font-black text-emerald-500 tracking-tighter mb-1">
            @if (loading()) { <span class="inline-block w-16 h-10 bg-gray-200 rounded animate-pulse"></span> }
            @else { {{ categoriaCount() }} }
          </p>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-gray-500">Categorías Disponibles</p>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center group hover:bg-emerald-600 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
             <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <p class="text-5xl font-black text-gray-900 group-hover:text-white tracking-tighter mb-1">
            @if (loading()) { <span class="inline-block w-16 h-10 bg-gray-200 rounded animate-pulse"></span> }
            @else { {{ ordersCount() }} }
          </p>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-emerald-100">Órdenes Procesadas</p>
        </div>

      </div>
    </section>
  `
})
export class StatsBarComponent implements OnInit {
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  orderService = inject(OrderService);

  productoCount = signal(0);
  categoriaCount = signal(0);
  ordersCount = signal(0);
  loading = signal(true);

  ngOnInit() {
    forkJoin({
      products: this.catalogService.getProducts().pipe(catchError(() => of([]))),
      categories: this.categoryService.getCategories().pipe(catchError(() => of([]))),
      orders: this.orderService.getOrders().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ products, categories, orders }) => {
        this.productoCount.set(products.length);
        this.categoriaCount.set(categories.length);
        this.ordersCount.set(orders.length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
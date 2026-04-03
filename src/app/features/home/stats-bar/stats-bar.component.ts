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
    <section class="bg-gray-950 text-white py-10">
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center px-6">
        
        <div>
          <p class="text-3xl font-black text-indigo-400">
            @if (loading()) { <span class="inline-block w-12 h-8 bg-indigo-900 rounded animate-pulse"></span> }
            @else { {{ productoCount() }} }
          </p>
          <p class="text-xs uppercase text-gray-400">Productos Totales</p>
        </div>

        <div>
          <p class="text-3xl font-black text-purple-400">
            @if (loading()) { <span class="inline-block w-12 h-8 bg-purple-900 rounded animate-pulse"></span> }
            @else { {{ categoriaCount() }} }
          </p>
          <p class="text-xs uppercase text-gray-400">Categorías Disponibles</p>
        </div>

        <div>
           <p class="text-3xl font-black text-indigo-400">
            @if (loading()) { <span class="inline-block w-12 h-8 bg-indigo-900 rounded animate-pulse"></span> }
            @else { {{ ordersCount() }} }
          </p>
          <p class="text-xs uppercase text-gray-400">Órdenes Procesadas</p>
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
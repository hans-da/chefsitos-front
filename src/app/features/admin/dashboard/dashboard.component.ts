import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoryService } from '../../../core/services/category.service';
import { OrderService } from '../../../core/services/order.service';
import { forkJoin, of, catchError } from 'rxjs';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Administración</h1>
          <p class="text-gray-500 mt-2">Bienvenido al control central de UAMIShop. Gestiona productos y categorías.</p>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Productos</p>
              <p class="text-2xl font-bold text-gray-900">{{ productCount() }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Categorías</p>
              <p class="text-2xl font-bold text-gray-900">{{ categoryCount() }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Órdenes Abiertas</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeOrdersCount() }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Top Producto</p>
              <p class="text-xl font-bold text-gray-900 line-clamp-1" [title]="topProductName()">{{ topProductName() }}</p>
            </div>
          </div>

        </div>

        <!-- Quick Access -->
        <h2 class="text-xl font-bold text-gray-900 mb-6">Accesos Rápidos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <a routerLink="/admin/productos" class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 block">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Gestión de Productos</h3>
            <p class="mt-2 text-gray-500 text-sm">Añade, edita, activa o desactiva productos de tu tienda.</p>
          </a>

          <a routerLink="/admin/categorias" class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 block">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Gestión de Categorías</h3>
            <p class="mt-2 text-gray-500 text-sm">Organiza tu tienda creando y modificando categorías.</p>
          </a>

          <a routerLink="/admin/ordenes" class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 block">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Gestión de Órdenes</h3>
            <p class="mt-2 text-gray-500 text-sm">Visualiza, confirma y monitorea los pedidos de tus clientes.</p>
          </a>

        </div>

      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class AdminDashboardComponent implements OnInit {
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  orderService = inject(OrderService);

  productCount = signal(0);
  categoryCount = signal(0);
  activeOrdersCount = signal(0);
  topProductName = signal('N/A');

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      products: this.catalogService.getProducts().pipe(catchError(() => of([]))),
      categories: this.categoryService.getCategories().pipe(catchError(() => of([]))),
      orders: this.orderService.getOrders().pipe(catchError(() => of([]))),
      bestSellers: this.catalogService.getBestSellers(1).pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        this.productCount.set(res.products.length);
        this.categoryCount.set(res.categories.length);
        
        // Count non-final orders
        const activeCount = res.orders.filter(o => 
          o.estado !== 'ENTREGADA' && o.estado !== 'CANCELADA'
        ).length;
        this.activeOrdersCount.set(activeCount);

        // Find top product name
        if (res.bestSellers.length > 0) {
          const topId = res.bestSellers[0].productoId;
          const topProd = res.products.find(p => p.idProducto === topId);
          if (topProd) {
            this.topProductName.set(topProd.nombreProducto);
          }
        }
      }
    });
  }
}

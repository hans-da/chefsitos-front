import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Product, ProductStats } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden bg-gray-50 pt-16 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6">
            Descubre <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">UAMIShop</span>
          </h1>
          <p class="mt-4 text-xl text-gray-500 leading-relaxed mb-10">
            La tienda digital donde encuentras calidad, rapidez y una experiencia de compra inigualable. Explora nuestro catálogo y descubre productos seleccionados para ti.
          </p>
          <div class="flex justify-center gap-4">
            <a routerLink="/catalogo" class="px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-transform transform hover:-translate-y-1">
              Ver catálogo completo
            </a>
          </div>
        </div>
      </div>
      <!-- Background Decorations -->
      <div class="absolute top-0 inset-x-0 h-[40rem] bg-gradient-to-b from-indigo-50 to-white -z-10"></div>
    </div>

    @if (loading()) {
      <app-loading-spinner [fullScreen]="false" message="Cargando las mejores recomendaciones..."></app-loading-spinner>
    } @else {
      <!-- Bestsellers Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Los Más Vendidos</h2>
          <a routerLink="/catalogo" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1 group">
            Ver más
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (product of bestSellerProducts(); track product.idProducto) {
            <app-product-card [product]="product"></app-product-card>
          } @empty {
             <div class="col-span-full py-12 text-center flex flex-col items-center opacity-70">
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
               <p class="text-gray-500 text-lg">Aún no hay productos destacados.</p>
             </div>
          }
        </div>
      </div>

      <!-- Categories Highlights -->
      <div class="bg-indigo-600 py-24 mt-12 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 pattern-dots border-white"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white tracking-tight">Explora por Categorías</h2>
            <p class="mt-4 text-indigo-100 max-w-2xl mx-auto text-lg">Encuentra exactamente lo que buscas navegando a través de nuestras selecciones cuidadosamente organizadas.</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (cat of categories().slice(0,6); track cat.idCategoria) {
              <a [routerLink]="['/catalogo']" [queryParams]="{category: cat.idCategoria}" 
                 class="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                <h3 class="text-xl font-bold text-white group-hover:text-indigo-600 mb-2 transition-colors">{{ cat.nombreCategoria }}</h3>
                <p class="text-indigo-100 group-hover:text-gray-500 text-sm line-clamp-2 transition-colors">{{ cat.descripcion }}</p>
                <div class="mt-4 flex items-center text-white group-hover:text-indigo-600 text-sm font-semibold transition-colors">
                  Explorar <svg class="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </a>
            }
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
  styles: [`
    .pattern-dots {
      background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `]
})
export class HomeComponent implements OnInit {
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);

  loading = signal(true);
  bestSellerProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // We need to fetch best seller stats and merge with actual products.
    // However, if the API does not provide best-sellers we fallback to recent products.
    forkJoin({
      bestStats: this.catalogService.getBestSellers(4), // get top 4
      allProducts: this.catalogService.getProducts(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (res) => {
        // Merge stats with products
        const topIds = res.bestStats.map(s => s.productoId);
        let topProducts = res.allProducts.filter(p => topIds.includes(p.idProducto));
        
        // Fallback strategy if BestSellers endpoint returns empty or fails to match
        if (topProducts.length === 0 && res.allProducts.length > 0) {
          topProducts = res.allProducts.slice(0, 4);
        }

        this.bestSellerProducts.set(topProducts);
        this.categories.set(res.categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

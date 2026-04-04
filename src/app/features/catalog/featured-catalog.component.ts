import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CatalogService } from '../../core/services/catalog.service';
import { Product, ProductStats } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

/**
 * Componente para la ruta /destacados.
 * Usa GET /api/v1/productos/mas-vendidos para obtener los productos más vendidos
 * y los enriquece con datos del catálogo para mostrar nombre, imagen, precio.
 */
@Component({
  selector: 'app-featured-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <section class="bg-[#fafafa] min-h-screen px-6 py-12 relative overflow-hidden">
      <!-- Grid Background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div class="max-w-7xl mx-auto relative z-10">

        <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <span class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] block mb-2">Los favoritos de la comunidad</span>
            <h1 class="text-5xl font-black tracking-tighter uppercase italic text-gray-900">
              Productos Destacados
            </h1>
          </div>
          <a routerLink="/catalogo" class="text-white font-bold bg-gray-900 px-6 py-3 rounded-full text-xs uppercase tracking-widest border border-gray-800 hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-lg hover:shadow-indigo-600/30">
            Ver catálogo completo →
          </a>
        </div>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-gray-100 rounded-[2.5rem] h-80 animate-pulse border border-gray-200"></div>
            }
          </div>
        } @else if (products().length === 0) {
          <div class="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 shadow-sm">
            <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </div>
            <h3 class="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Aún no hay destacados</h3>
            <p class="text-gray-500 font-medium mb-8">Los productos más vendidos aparecerán aquí conforme se registren compras.</p>
            <a routerLink="/catalogo" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/30">
              Explorar catálogo
            </a>
          </div>
        } @else {
          <p class="text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-indigo-100 inline-block mb-8">
            {{ products().length }} productos destacados
          </p>
          <div class="grid md:grid-cols-3 gap-8">
            @for (p of products(); track p.idProducto) {
              <app-product-card [product]="p"></app-product-card>
            }
          </div>
        }

      </div>
    </section>

    <app-footer></app-footer>
  `
})
export class FeaturedCatalogComponent implements OnInit {
  private catalogService = inject(CatalogService);

  loading = signal(true);
  products = signal<Product[]>([]);

  ngOnInit() {
    this.loadFeatured();
  }

  loadFeatured() {
    forkJoin({
      bestSellers: this.catalogService.getBestSellers(12).pipe(catchError(() => of([]))),
      allProducts: this.catalogService.getProducts().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ bestSellers, allProducts }) => {
        // Mapear stats a productos completos usando el catálogo
        const productMap = new Map<string, Product>();
        allProducts.forEach(p => productMap.set(p.idProducto, p));

        const featured: Product[] = [];
        for (const stat of bestSellers) {
          const product = productMap.get(stat.productoId);
          if (product) {
            featured.push(product);
          }
        }

        this.products.set(featured);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

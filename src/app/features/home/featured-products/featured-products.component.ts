import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogService } from '../../../core/services/catalog.service';
import { Product, ProductStats } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <section class="bg-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Los más vendidos</span>
            <h2 class="text-6xl font-black tracking-tighter text-[#1a1a1a] uppercase italic">Productos <span class="text-emerald-500">Destacados</span></h2>
          </div>
          <a routerLink="/destacados" class="px-8 py-3 bg-gray-50 text-gray-900 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
            Ver todos los destacados
          </a>
        </div>
        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="bg-gray-100 rounded-3xl h-64 animate-pulse"></div>
            }
          </div>
        } @else if (products().length > 0) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (p of products(); track p.idProducto) {
              <app-product-card [product]="p"></app-product-card>
            }
          </div>
        } @else {
          <div class="text-center py-16 text-gray-400">
            <p class="text-lg font-semibold">No hay productos destacados por el momento</p>
            <p class="text-sm mt-2">Los más vendidos aparecerán aquí conforme se registren compras.</p>
            <a routerLink="/catalogo" class="inline-block mt-6 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
              Explorar catálogo
            </a>
          </div>
        }
      </div>
    </section>
  `
})
export class FeaturedProductsComponent implements OnInit {
  catalogService = inject(CatalogService);
  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    // Usar endpoint de más vendidos + enriquecer con catálogo
    forkJoin({
      bestSellers: this.catalogService.getBestSellers(6).pipe(catchError(() => of([]))),
      allProducts: this.catalogService.getProducts().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ bestSellers, allProducts }) => {
        if (bestSellers.length > 0) {
          // Mapear stats a productos completos
          const productMap = new Map<string, Product>();
          allProducts.forEach(p => productMap.set(p.idProducto, p));

          const featured: Product[] = [];
          for (const stat of bestSellers) {
            const product = productMap.get(stat.productoId);
            if (product && product.disponible) {
              featured.push(product);
            }
          }
          this.products.set(featured.slice(0, 6));
        } else {
          // Fallback: si no hay más vendidos, mostrar los primeros disponibles
          this.products.set(allProducts.filter(p => p.disponible).slice(0, 6));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

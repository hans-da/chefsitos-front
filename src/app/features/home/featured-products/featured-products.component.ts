import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <section class="bg-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-end mb-12">
          <h2 class="text-4xl font-black uppercase tracking-tighter">Destacados</h2>
          <a routerLink="/catalogo" class="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1">
            Ver todos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
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
            <p class="text-lg font-semibold">No hay productos disponibles por el momento</p>
            <p class="text-sm mt-2">Vuelve pronto para ver las novedades</p>
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
    this.catalogService.getProducts().subscribe({
      next: (all) => {
        // Solo productos disponibles, máximo 6 en home
        this.products.set(all.filter(p => p.disponible).slice(0, 6));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

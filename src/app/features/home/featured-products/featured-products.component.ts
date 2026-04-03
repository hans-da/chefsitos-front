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
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Selección Especial</span>
            <h2 class="text-6xl font-black tracking-tighter text-[#1a1a1a] uppercase italic">Productos <span class="text-emerald-500">Destacados</span></h2>
          </div>
          <a routerLink="/catalogo" class="px-8 py-3 bg-gray-50 text-gray-900 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
            Ver catálogo completo
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

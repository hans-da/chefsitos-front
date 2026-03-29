import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CatalogService } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';

import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <section class="bg-gray-950 text-white min-h-screen px-6 py-10">
      <div class="max-w-7xl mx-auto">

        <h1 class="text-4xl font-black mb-6">Catálogo</h1>

        <div class="bg-gray-900 p-6 rounded-2xl mb-10">

          <h2 class="text-xl font-bold mb-4">Filtros</h2>

          <button (click)="setCategory(null)">Todas</button>

          @for (cat of categories(); track $index) {
            <button (click)="setCategory($any(cat).idCategoria)">
              {{ $any(cat).nombreCategoria }}
            </button>
          }

          <select (change)="setSortOrder($event)">
            <option value="none">Relevancia</option>
            <option value="price_asc">Precio ↑</option>
            <option value="price_desc">Precio ↓</option>
          </select>

          <label>
            <input type="checkbox" checked (change)="showOnlyAvailable.set(!showOnlyAvailable())">
            Solo disponibles
          </label>

        </div>

        <p>Mostrando {{ finalProducts().length }} productos</p>

        @if (loading()) {
          <p>Cargando...</p>
        } @else {

          <div class="grid md:grid-cols-3 gap-6">

            @for (p of finalProducts(); track $index) {
              <app-product-card [product]="p"></app-product-card>
            }

          </div>

          @if (finalProducts().length === 0) {
            <div class="text-center mt-10">
              <h3 class="text-2xl font-bold mb-2">No se encontraron productos</h3>
              <p class="text-gray-400">Intenta ajustar tus filtros o verifica la conexión.</p>
            </div>
          }

        }

      </div>
    </section>

    <app-footer></app-footer>
  `
})
export class CatalogComponent implements OnInit {

  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  route = inject(ActivatedRoute);

  loading = signal(true);
  allProducts = signal<any[]>([]);
  categories = signal<any[]>([]);

  selectedCategory = signal<string | null>(null);
  sortOrder = signal('none');
  showOnlyAvailable = signal(true);

  filteredProducts = computed(() => {
    let p = this.allProducts();

    if (this.showOnlyAvailable()) {
      p = p.filter(x => x.disponible);
    }

    if (this.selectedCategory()) {
      p = p.filter(x => x.idCategoria === this.selectedCategory());
    }

    return p;
  });

  finalProducts = computed(() => {
    let p = [...this.filteredProducts()];

    if (this.sortOrder() === 'price_asc') {
      p.sort((a, b) => a.precio - b.precio);
    }

    if (this.sortOrder() === 'price_desc') {
      p.sort((a, b) => b.precio - a.precio);
    }

    return p;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      prods: this.catalogService.getProducts().pipe(
        catchError(() => of([]))
      ),
      cats: this.categoryService.getCategories().pipe(
        catchError(() => of([]))
      )
    }).subscribe({
      next: (res) => {
        this.allProducts.set(res.prods);
        this.categories.set(res.cats);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setCategory(id: string | null) {
    this.selectedCategory.set(id);
  }

  setSortOrder(e: any) {
    this.sortOrder.set(e.target.value);
  }
}
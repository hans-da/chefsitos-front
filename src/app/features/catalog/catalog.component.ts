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

    <section class="bg-gray-950 text-white min-h-screen px-6 py-12">
      <div class="max-w-7xl mx-auto">

        <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <h1 class="text-5xl font-black tracking-tighter uppercase italic">
            {{ title() }}
          </h1>
          <p class="text-gray-500 font-bold bg-gray-900 px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-gray-800">
            {{ finalProducts().length }} productos encontrados
          </p>
        </div>

        <div class="bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] mb-12 border border-gray-800/50 shadow-2xl flex flex-wrap items-center gap-6">
          
          <div class="flex flex-col gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Categorías</span>
            <div class="flex flex-wrap gap-2">
              <button 
                (click)="setCategory(null)" 
                [class]="!selectedCategory() ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
                class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Todas
              </button>
              @for (cat of categories(); track $index) {
                <button 
                  (click)="setCategory($any(cat).idCategoria)"
                  [class]="selectedCategory() === $any(cat).idCategoria ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
                  class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  {{ $any(cat).nombreCategoria }}
                </button>
              }
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Orden</span>
            <select 
              (change)="setSortOrder($event)"
              class="bg-gray-800 border-none text-gray-300 text-xs font-black uppercase tracking-wider rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="none">Relevancia</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Estado</span>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" checked (change)="showOnlyAvailable.set(!showOnlyAvailable())" class="sr-only peer">
                <div class="w-10 h-6 bg-gray-800 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span class="text-xs font-black uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">Solo Disponibles</span>
            </label>
          </div>

        </div>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-gray-900 rounded-[2.5rem] h-80 animate-pulse border border-gray-800"></div>
            }
          </div>
        } @else {

          <div class="grid md:grid-cols-3 gap-8">
            @for (p of finalProducts(); track $index) {
              <app-product-card [product]="p"></app-product-card>
            }
          </div>

          @if (finalProducts().length === 0) {
            <div class="text-center py-24 bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-800 mt-12">
              <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 class="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Sin coincidencias</h3>
              <p class="text-gray-500 font-medium">Prueba a limpiar los filtros para ver más productos.</p>
              <button (click)="resetFilters()" class="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all">Limpiar Todo</button>
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

  title = computed(() => {
    const isDestacados = this.route.snapshot.url.some(s => s.path === 'destacados');
    return isDestacados ? 'Destacados' : 'Catálogo';
  });

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
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategory.set(params['categoria']);
      }
    });
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

  resetFilters() {
    this.selectedCategory.set(null);
    this.sortOrder.set('none');
    this.showOnlyAvailable.set(true);
  }
}
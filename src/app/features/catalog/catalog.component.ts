import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoadingSpinnerComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen pt-8 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Productos</h1>
            <p class="text-gray-500 mt-2">Encuentra todo lo que necesitas en nuestra tienda.</p>
          </div>
          <div class="w-full md:w-auto">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                [value]="searchTerm()"
                (input)="onSearch($event)"
                class="w-full md:w-80 pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
              >
              <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>

        @if (loading()) {
          <app-loading-spinner message="Cargando el catálogo..."></app-loading-spinner>
        } @else {
          <div class="flex flex-col lg:flex-row gap-8">
            
            <!-- Filters Sidebar -->
            <aside class="w-full lg:w-64 flex-shrink-0">
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  Filtros
                </h3>
                
                <!-- Category Filter -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Categorías</h4>
                  <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <label class="flex items-center cursor-pointer group">
                      <input type="radio" name="category" [checked]="selectedCategory() === null" (change)="setCategory(null)" class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                      <span class="ml-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">Todas</span>
                    </label>
                    @for (cat of categories(); track cat.idCategoria) {
                      <label class="flex items-center cursor-pointer group">
                        <input type="radio" name="category" [checked]="selectedCategory() === cat.idCategoria" (change)="setCategory(cat.idCategoria)" class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <span class="ml-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ cat.nombreCategoria }}</span>
                      </label>
                    }
                  </div>
                </div>

                <!-- Price Filter -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Ordenamiento</h4>
                  <select 
                    [value]="sortOrder()"
                    (change)="setSortOrder($event)"
                    class="block w-full text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 bg-gray-50 border">
                    <option value="none">Relevancia</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                  </select>
                </div>

                <!-- Availability Filter -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Disponibilidad</h4>
                  <label class="flex items-center cursor-pointer group">
                    <input type="checkbox" [checked]="showOnlyAvailable()" (change)="toggleAvailable()" class="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500">
                    <span class="ml-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">Solo disponibles</span>
                  </label>
                </div>

              </div>
            </aside>

            <!-- Product Grid -->
            <div class="flex-grow">
              
              <div class="mb-4 text-sm text-gray-500">
                Mostrando <span class="font-bold text-gray-900">{{ filteredProducts().length }}</span> productos
              </div>

              @if (filteredProducts().length === 0) {
                <div class="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                  <p class="text-gray-500 mb-6 max-w-sm">Intenta ajustar tus filtros o buscar con términos diferentes para encontrar lo que buscas.</p>
                  <button (click)="resetFilters()" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Limpiar filtros</button>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  @for (product of filteredProducts(); track product.idProducto) {
                    <app-product-card [product]="product"></app-product-card>
                  }
                </div>
              }

            </div>
          </div>
        }
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7c7cc; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
  `]
})
export class CatalogComponent implements OnInit {
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  route = inject(ActivatedRoute);

  loading = signal(true);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  // Filtering signals
  searchTerm = signal('');
  selectedCategory = signal<string | null>(null);
  showOnlyAvailable = signal(false);
  sortOrder = signal<'none' | 'price_asc' | 'price_desc'>('none');

  filteredProducts = computed(() => {
    let result = this.products();

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter(p => p.nombreProducto.toLowerCase().includes(term) || p.descripcion.toLowerCase().includes(term));
    }

    if (this.selectedCategory()) {
      result = result.filter(p => p.idCategoria === this.selectedCategory());
    }

    if (this.showOnlyAvailable()) {
      result = result.filter(p => p.disponible);
    }

    if (this.sortOrder() === 'price_asc') {
      result.sort((a,b) => a.precio - b.precio);
    } else if (this.sortOrder() === 'price_desc') {
      result.sort((a,b) => b.precio - a.precio);
    }

    return result;
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });

    this.loadData();
  }

  loadData() {
    forkJoin({
      products: this.catalogService.getProducts(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.categories.set(res.categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  setCategory(id: string | null) {
    this.selectedCategory.set(id);
  }

  toggleAvailable() {
    this.showOnlyAvailable.update(v => !v);
  }

  setSortOrder(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOrder.set(select.value as any);
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.showOnlyAvailable.set(false);
    this.sortOrder.set('none');
  }
}

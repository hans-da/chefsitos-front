import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

const CATEGORY_COLORS = [
  'bg-indigo-600', 'bg-purple-600', 'bg-teal-600',
  'bg-rose-600', 'bg-amber-600', 'bg-sky-600'
];

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-gray-900 text-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        
        <h2 class="text-4xl font-black mb-12">
          ¿Qué estás buscando?
        </h2>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="rounded-3xl h-28 bg-gray-800 animate-pulse"></div>
            }
          </div>
        } @else if (categories().length > 0) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (cat of categories(); track cat.idCategoria; let i = $index) {
              <a
                [routerLink]="['/catalogo']"
                [queryParams]="{ categoria: cat.idCategoria }"
                [class]="'group relative p-10 rounded-[2rem] overflow-hidden hover:scale-105 transition-all cursor-pointer block ' + getColor(i)"
              >
                <!-- Filtro de contraste para legibilidad perfecta -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="relative z-10">
                  <p class="text-xl font-black tracking-tight uppercase">{{ cat.nombreCategoria }}</p>
                  @if (cat.descripcion) {
                    <p class="text-white/90 text-sm mt-2 line-clamp-2 leading-relaxed">{{ cat.descripcion }}</p>
                  }
                </div>
              </a>
            }
          </div>
        } @else {
          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-10 rounded-3xl bg-gray-800 text-gray-500 text-center col-span-3">
              <p>No hay categorías disponibles</p>
            </div>
          </div>
        }

      </div>
    </section>
  `
})
export class CategoryGridComponent implements OnInit {
  categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        // Solo mostrar las 6 primeras para el grid home
        this.categories.set(cats.slice(0, 6));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getColor(index: number): string {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  }
}
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

const CATEGORY_COLORS = [
  'from-[#006341] to-[#004d32]', // Deep Emerald
  'from-[#50E38F] to-[#006341]', // Bright Emerald to Deep
  'from-[#121212] to-[#333333]', // Dark Matte
  'from-[#004d32] to-[#121212]', // Dark Green to Black
  'from-[#84f0b1] to-[#50E38F]', // Light Mint to Bright
  'from-[#1a1a1a] to-[#006341]'  // Black to Emerald
];

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white py-24 px-6 relative overflow-hidden">
      <!-- Decorative background element -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-50"></div>
      
      <div class="max-w-6xl mx-auto relative z-10">
        
        <div class="flex flex-col mb-16">
          <span class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Explora por Categoría</span>
          <h2 class="text-6xl font-black tracking-tighter text-[#1a1a1a] uppercase italic">
            ¿Qué estás <span class="text-emerald-500">buscando</span>?
          </h2>
        </div>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="rounded-[2.5rem] h-48 bg-gray-50 animate-pulse border border-gray-100"></div>
            }
          </div>
        } @else if (categories().length > 0) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (cat of categories(); track cat.idCategoria; let i = $index) {
              <a
                [routerLink]="['/catalogo']"
                [queryParams]="{ categoria: cat.idCategoria }"
                class="group relative p-12 rounded-[2.5rem] overflow-hidden hover:translate-y-[-8px] transition-all duration-500 cursor-pointer block shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-900/20"
              >
                <!-- Background Gradient -->
                <div [class]="'absolute inset-0 bg-gradient-to-br z-0 transition-transform duration-700 group-hover:scale-110 ' + getColor(i)"></div>
                
                <!-- Texture overlay -->
                <div class="absolute inset-0 opacity-10 mix-blend-overlay z-[1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div class="relative z-10">
                  <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 group-hover:bg-white transition-colors">
                     <svg class="w-6 h-6 text-white group-hover:text-emerald-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                  <p class="text-3xl font-black tracking-tighter uppercase italic text-white mb-2 leading-none">{{ cat.nombreCategoria }}</p>
                  @if (cat.descripcion) {
                    <p class="text-white font-bold uppercase tracking-widest leading-relaxed line-clamp-2 text-[11px] opacity-90">{{ cat.descripcion }}</p>
                  }
                </div>
              </a>
            }
          </div>
        } @else {
          <div class="bg-gray-50 border border-dashed border-gray-200 rounded-[3rem] p-20 text-center">
            <p class="text-gray-400 font-black uppercase tracking-widest text-xs">No hay categorías disponibles en este momento</p>
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
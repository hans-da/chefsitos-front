import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-[2.5rem] mx-4 mt-4 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.3)]">
      
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" 
          class="w-full h-full object-cover scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-gray-900/80 to-purple-900/70"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
        
        <h1 class="text-8xl md:text-[10rem] font-black text-white uppercase mb-6">
          UAMI<span class="text-indigo-400">SHOP</span>
        </h1>

        <p class="text-xl md:text-2xl text-gray-200 mb-12">
          Tu mercado universitario digital dentro de la UAM.
        </p>

        <div class="flex gap-6 justify-center">
          <a routerLink="/catalogo" class="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black hover:scale-105 transition-all text-sm uppercase tracking-widest">
            Explorar
          </a>

          <a routerLink="/destacados" class="px-10 py-5 border-2 border-white/30 text-white rounded-3xl font-black hover:bg-white/10 hover:scale-105 transition-all text-sm uppercase tracking-widest">
            Destacados
          </a>
        </div>

      </div>
    </section>
  `
})
export class HeroComponent {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-32 bg-white">
      <!-- Grid Background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div class="relative z-10 text-center px-4 max-w-6xl mx-auto">
        
        <h1 class="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] mb-8">
          <span class="text-[#1a1a1a]">UAMI</span><span class="text-[#50E38F]">SHOP</span>
        </h1>

        <p class="text-xl md:text-2xl text-gray-500 font-medium mb-16 tracking-tight">
          Tu mercado universitario digital dentro de la UAM.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a routerLink="/catalogo" class="px-12 py-5 bg-[#006341] text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
            Explorar
          </a>

          <a routerLink="/destacados" class="px-12 py-5 bg-[#121212] text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-gray-900/30 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
            Destacados
          </a>
        </div>

      </div>
    </section>
  `
})
export class HeroComponent {}
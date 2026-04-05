import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <!-- Glow del diseño -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      
      <div class="relative z-10 w-full max-w-md mx-auto">
        <h1 class="text-9xl font-black text-indigo-600 tracking-tighter italic">404</h1>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mt-4">Página no encontrada</h2>
        <p class="text-gray-500 mt-2 font-medium">Lo sentimos, la página que estás buscando no existe o fue movida.</p>
        
        <div class="mt-8 relative z-10">
          <a routerLink="/" class="inline-flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}

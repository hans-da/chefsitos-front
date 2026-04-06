import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Algo salió mal</h1>
        <p class="mt-4 text-gray-500 max-w-xs mx-auto">
          Hemos detectado un problema técnico. No te preocupes, tus datos están seguros.
        </p>
        
        <div class="mt-10 flex flex-col gap-4">
          <button (click)="restartApp()" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
            Reiniciar Aplicación
          </button>
          <a routerLink="/" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Ir a la página principal
          </a>
        </div>
        
        <p class="mt-8 text-xs text-gray-400">
          Si el problema persiste, por favor contacta a soporte técnico.
        </p>
      </div>
    </div>
  `
})
export class ErrorComponent {
  private router = inject(Router);

  restartApp() {
    window.location.href = '/';
  }
}

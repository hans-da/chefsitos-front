import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 class="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
        <div class="bg-indigo-600 px-2 text-sm rounded rotate-12 absolute translate-x-32 -translate-y-16 text-white inline-block">
          Página no encontrada
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Oops! Te perdiste.</h2>
        <p class="mt-2 text-sm text-gray-600">
          La página que buscas no existe o ha sido movida.
        </p>
        <div class="mt-10">
          <a routerLink="/" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1">
            <svg class="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `
})
export class NotFoundComponent {}

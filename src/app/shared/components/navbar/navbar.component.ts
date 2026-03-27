import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-40 bg-opacity-90 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          
          <!-- Logo & Primary Nav -->
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center gap-2 group">
              <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-md shadow-indigo-600/20">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <span class="font-bold text-xl tracking-tight text-gray-900">UAMIShop</span>
            </a>
            
            <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a routerLink="/" routerLinkActive="border-indigo-500 text-gray-900" [routerLinkActiveOptions]="{exact: true}" 
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Inicio
              </a>
              <a routerLink="/catalogo" routerLinkActive="border-indigo-500 text-gray-900" 
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Catálogo
              </a>
            </div>
          </div>

          <!-- Secondary Nav / Actions -->
          <div class="flex items-center gap-4">
            
            <!-- Cart Icon -->
            <a routerLink="/carrito" class="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50 group">
              <svg class="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              @if (cartCount() > 0) {
                <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 rounded-full shadow-sm animate-bounce-short">
                  {{ cartCount() }}
                </span>
              }
            </a>

            <!-- User Menu -->
            <div class="relative ml-2" (click)="toggleDropdown()">
              @if (auth.isAuthenticated()) {
                <button class="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                    {{ auth.currentUser()?.name?.charAt(0) }}
                  </div>
                  <div class="hidden md:flex flex-col items-start">
                    <span class="text-sm font-medium text-gray-700 leading-tight">{{ auth.currentUser()?.name }}</span>
                    <span class="text-xs text-gray-500 leading-tight">{{ auth.currentUser()?.role === 'ADMIN' ? 'Administrador' : 'Cliente' }}</span>
                  </div>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                @if (dropdownOpen()) {
                  <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 py-1 transition-all">
                    @if (auth.isAdmin()) {
                      <div class="px-1 py-1">
                        <a routerLink="/admin" class="group flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg">
                          <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          Panel Admin
                        </a>
                      </div>
                    } @else {
                      <div class="px-1 py-1">
                        <a routerLink="/mis-ordenes" class="group flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg">
                          <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                          Mis Órdenes
                        </a>
                      </div>
                    }
                    <div class="px-1 py-1">
                      <button (click)="logout()" class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <svg class="w-4 h-4 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <a routerLink="/login" class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all hover:-translate-y-0.5">
                  Iniciar sesión
                </a>
              }
            </div>

          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    @keyframes bounce-short {
      0%, 100% { transform: translate(25%, -25%) }
      50% { transform: translate(25%, -35%) }
    }
    .animate-bounce-short {
      animation: bounce-short 1s ease-in-out infinite;
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  dropdownOpen = signal(false);
  cartCount = this.cartService.cartCount;

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  logout() {
    this.auth.logout();
    this.dropdownOpen.set(false);
  }
}

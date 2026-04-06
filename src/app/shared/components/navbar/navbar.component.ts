import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav 
      [class.nav-scrolled]="isScrolled()" 
      class="fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 transition-all duration-500 ease-out px-4 py-4"
    >
      <div class="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl border border-gray-100/50 rounded-[2rem] px-6 lg:px-10 shadow-sm transition-all duration-500"
            [class.shadow-2xl]="isScrolled()"
            [class.bg-white/90]="isScrolled()">
        <div class="flex justify-between h-20 items-center">
          
          <a routerLink="/" class="flex items-center gap-3 group relative">
            <div class="w-16 h-16 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative drop-shadow-2xl">
              <img src="images/logo-chefsitos.png" 
                   alt="Team Chefsitos" 
                   class="w-full h-full object-contain">
            </div>
            
            <div class="flex flex-col ml-2">
              <span class="text-[8px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none mb-1">Team Chefsitos</span>
              <span class="font-black text-xl tracking-tighter text-gray-900 uppercase italic leading-none">
                UAMI<span class="text-indigo-600">SHOP</span>
              </span>
            </div>
          </a>

          <div class="hidden md:flex items-center gap-2">
            @if (!auth.isAdmin()) {
              <a routerLink="/" routerLinkActive="text-indigo-600 bg-indigo-50/50" [routerLinkActiveOptions]="{exact: true}" 
                 class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all">Inicio</a>
              <a routerLink="/catalogo" routerLinkActive="text-indigo-600 bg-indigo-50/50" 
                 class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all">Explorar</a>
              <a routerLink="/destacados" routerLinkActive="text-indigo-600 bg-indigo-50/50" 
                 class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all">Destacados</a>
            }
          </div>

          <div class="flex items-center gap-4">
            @if (!auth.isAdmin()) {
              <a routerLink="/carrito" class="relative p-3 text-gray-400 hover:text-indigo-600 transition-all rounded-2xl hover:bg-indigo-50 active:scale-90 group">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                @if (cartCount() > 0) {
                  <span class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white ring-4 ring-white animate-bounce">
                    {{ cartCount() }}
                  </span>
                }
              </a>
            }

            <div class="relative">
              @if (auth.isAuthenticated()) {
                <button (click)="toggleDropdown()" class="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all">
                  <div class="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black text-sm uppercase">
                    {{ auth.currentUser()?.name?.charAt(0) }}
                  </div>
                </button>
                @if (dropdownOpen()) {
                  <div class="absolute right-0 mt-4 w-60 rounded-[2rem] shadow-2xl bg-white border border-gray-100 p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div class="px-5 py-4 bg-gray-50 rounded-2xl mb-2">
                      <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">{{ auth.currentUser()?.role }}</p>
                      <p class="text-xs font-black text-gray-900 truncate tracking-tight">{{ auth.currentUser()?.email }}</p>
                    </div>
                    @if (auth.isAdmin()) {
                      <a routerLink="/admin" (click)="dropdownOpen.set(false)" class="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mb-1 border-b border-gray-50">Panel Admin</a>
                    } @else {
                      <a routerLink="/mis-ordenes" (click)="dropdownOpen.set(false)" class="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">Mis Pedidos</a>
                    }
                    <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-xl transition-all border-t border-gray-50 mt-2 pt-4 italic">Cerrar Sesión</button>
                  </div>
                }
              } @else {
                <a routerLink="/login" class="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all">Ingresar</a>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="h-28"></div>
  `,
  styles: [`
    .nav-scrolled { padding-top: 1rem; width: 95%; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  dropdownOpen = signal(false);
  isScrolled = signal(false);
  cartCount = this.cartService.cartCount;

  @HostListener('window:scroll', [])
  onWindowScroll() { this.isScrolled.set(window.scrollY > 20); }
  
  toggleDropdown() { this.dropdownOpen.update(v => !v); }
  
  logout() { 
    this.auth.logout(); 
    this.dropdownOpen.set(false); 
    this.router.navigate(['/login']); 
  }
}
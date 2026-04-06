import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

/**
 * AUTENTICACIÓN EN MODO DEMO
 * ─────────────────────────────────────────────────────────────────
 * Este servicio simula autenticación de forma LOCAL (sin backend).
 * Los usuarios se guardan en localStorage. NO hay JWT, ni sesión real.
 * Esto es intencional para el contexto de este proyecto académico.
 * No interfiere con los flujos reales de catálogo, carrito ni órdenes.
 */
export const TEST_CLIENT_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(this.getStoredUser());

  currentUser = this.userSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null);
  isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  isCustomer = computed(() => this.userSignal()?.role === 'CUSTOMER');

  constructor(private router: Router) {}

  /** DEMO: simula login como cliente (sin autenticación real). */
  loginAsCustomer() {
    const user: User = { id: TEST_CLIENT_ID, name: 'Cliente de Pruebas (Demo)', role: 'CUSTOMER' };
    this.setUser(user);
    this.router.navigate(['/']);
  }

  /** DEMO: simula login como admin (sin autenticación real). */
  loginAsAdmin() {
    const user: User = { id: '742912a7-f5dc-461b-9d41-332308cf240e', name: 'Administrador Tienda (Demo)', role: 'ADMIN' };
    this.setUser(user);
    this.router.navigate(['/admin']);
  }

  logout() {
    localStorage.removeItem('uamishop_user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setUser(user: User) {
    localStorage.setItem('uamishop_user', JSON.stringify(user));
    this.userSignal.set(user);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem('uamishop_user');
    if (data) {
      try {
        return JSON.parse(data) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

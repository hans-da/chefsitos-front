import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

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

  loginAsCustomer() {
    const user: User = { id: TEST_CLIENT_ID, name: 'Cliente de Pruebas', role: 'CUSTOMER' };
    this.setUser(user);
    this.router.navigate(['/']);
  }

  loginAsAdmin() {
    const user: User = { id: '742912a7-f5dc-461b-9d41-332308cf240e', name: 'Administrador Tienda', role: 'ADMIN' };
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

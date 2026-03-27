import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
      
      <div class="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div class="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
           <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h2 class="mt-2 text-center text-4xl font-extrabold text-white tracking-tight">Bienvenido a UAMIShop</h2>
        <p class="mt-3 text-center text-indigo-100 max-w-sm mx-auto">Selecciona el perfil con el que deseas ingresar a la plataforma (Simulación frontend).</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
         <div class="bg-white/80 backdrop-blur-md py-10 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/40">
           
           <div class="space-y-6">
              <button 
                (click)="loginCustomer()"
                class="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-lg">
                Entrar como Cliente
              </button>
              
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-transparent text-gray-500 bg-white rounded-full leading-relaxed">O</span>
                </div>
              </div>

              <button 
                (click)="loginAdmin()"
                class="w-full flex justify-center py-4 px-4 border-2 border-indigo-600 rounded-2xl shadow-sm text-lg font-medium text-indigo-600 bg-transparent hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1">
                Entrar como Administrador
              </button>
           </div>
         </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);

  loginCustomer() {
    this.auth.loginAsCustomer();
  }

  loginAdmin() {
    this.auth.loginAsAdmin();
  }
}

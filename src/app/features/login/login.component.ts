import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div class="absolute inset-0 opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'black\'/%3E%3C/svg%3E');"></div>
      </div>
      
      <div class="relative sm:mx-auto sm:w-full sm:max-w-md z-10 text-center px-4">
        <div class="mx-auto w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-100 mb-10 transform hover:rotate-12 transition-transform duration-500">
           <div class="w-10 h-10 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-200">
             <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
           </div>
        </div>
        <h2 class="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic">UAMI<span class="text-indigo-600">Shop</span></h2>
        <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Portal de Acceso • Chefsitos Team</p>
      </div>

      <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10 px-4">
         <div class="bg-white/80 backdrop-blur-2xl py-12 px-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] border border-white/50">
           
           <div class="space-y-6">
              <button 
                (click)="loginCustomer()"
                class="group relative w-full flex items-center justify-between py-5 px-6 bg-gray-900 text-white font-black rounded-[1.8rem] hover:bg-indigo-600 transition-all duration-300 active:scale-[0.97] shadow-xl shadow-gray-200 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span class="relative z-10 text-xs uppercase tracking-widest">Entrar como Cliente</span>
                <svg class="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>
              
              <div class="relative py-2">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-50"></div></div>
                <div class="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">
                  <span class="px-6 bg-white/0 backdrop-blur-none">Verificación</span>
                </div>
              </div>

              <button 
                (click)="loginAdmin()"
                class="group w-full flex items-center justify-between py-5 px-6 border-2 border-gray-50 text-gray-400 font-black rounded-[1.8rem] hover:border-indigo-100 hover:bg-indigo-50/30 hover:text-indigo-600 transition-all duration-300 active:scale-[0.97]">
                <span class="text-xs uppercase tracking-widest">Acceso Administrativo</span>
                <svg class="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
              </button>
           </div>
           
           <div class="mt-12 flex flex-col items-center gap-1">
             <p class="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Ingeniería de Software</p>
             <p class="text-[10px] font-bold text-indigo-200 italic">Unidad Iztapalapa</p>
           </div>
         </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  loginCustomer() { this.auth.loginAsCustomer(); }
  loginAdmin() { this.auth.loginAsAdmin(); }
}
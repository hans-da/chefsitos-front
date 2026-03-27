import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-gray-100 mt-24">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <span class="font-bold text-xl text-gray-900">UAMIShop</span>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed max-w-sm">
              La plataforma de comercio electrónico moderna, diseñada para empresas que buscan escalar su venta física con elegancia y rendimiento superior.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Enlaces Rápidos</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Inicio</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Catálogo</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Ofertas</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Soporte</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Ayuda y Contacto</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Políticas de Devolución</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Estado de Orden</a></li>
            </ul>
          </div>

        </div>
        
        <div class="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">
            &copy; 2026 UAMIShop. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6">
             <a href="#" class="text-gray-400 hover:text-gray-500">
               <span class="sr-only">Twitter</span>
               <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
             </a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

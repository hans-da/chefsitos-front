import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-white border-t mt-20">
      <div class="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">

        <div>
          <h2 class="text-2xl font-black mb-4">UAMIShop</h2>
          <p class="text-gray-500">
            Tu mercado universitario digital diseñado por la comunidad para la comunidad
          </p>
        </div>

        <div>
          <h3 class="font-bold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2 text-gray-500">
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/catalogo">Catálogo</a></li>
            <li><a>Ofertas</a></li>
            <li><a>Soporte</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold mb-4">Ayuda y Contacto</h3>
          <ul class="space-y-2 text-gray-500">
            <li><a>Políticas de Devolución</a></li>
            <li><a>Estado de Orden</a></li>
          </ul>
        </div>

      </div>

      <div class="text-center text-gray-400 pb-6">
        © 2026 UAMIShop. Todos los derechos reservados
      </div>
    </footer>
  `
})
export class FooterComponent {}
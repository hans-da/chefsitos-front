import { Component } from '@angular/core';

@Component({
  selector: 'app-category-grid',
  standalone: true,
  template: `
    <section class="bg-gray-900 text-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        
        <h2 class="text-4xl font-black mb-12">
          ¿Qué estás buscando?
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          
          <div class="p-10 rounded-3xl bg-indigo-600 hover:scale-105 transition-all cursor-pointer">
            Electrónicos
          </div>

          <div class="p-10 rounded-3xl bg-gray-800 hover:scale-105 transition-all cursor-pointer">
            Libros
          </div>

          <div class="p-10 rounded-3xl bg-gray-800 hover:scale-105 transition-all cursor-pointer">
            Servicios
          </div>

        </div>

      </div>
    </section>
  `
})
export class CategoryGridComponent {}
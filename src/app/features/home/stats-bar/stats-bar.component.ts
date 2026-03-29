import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  template: `
    <section class="bg-gray-950 text-white py-10">
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        <div>
          <p class="text-3xl font-black text-indigo-400">+500</p>
          <p class="text-xs uppercase text-gray-400">Alumnos</p>
        </div>

        <div>
          <p class="text-3xl font-black text-purple-400">+120</p>
          <p class="text-xs uppercase text-gray-400">Productos</p>
        </div>

        <div>
          <p class="text-3xl font-black text-indigo-400">+80</p>
          <p class="text-xs uppercase text-gray-400">Vendedores</p>
        </div>

        <div>
          <p class="text-3xl font-black text-purple-400">100%</p>
          <p class="text-xs uppercase text-gray-400">UAM</p>
        </div>

      </div>
    </section>
  `
})
export class StatsBarComponent {}
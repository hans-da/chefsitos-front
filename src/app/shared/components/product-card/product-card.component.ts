import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-900 rounded-3xl p-6 hover:scale-105 transition-all cursor-pointer">
      
      <img 
        [src]="product?.imagenUrl || 'https://via.placeholder.com/300'" 
        class="h-40 w-full object-cover rounded-xl mb-4"
      />

      <p class="font-bold text-lg">{{ product?.name || product?.nombreProducto }}</p>
      <p class="text-indigo-400 font-black">
        \${{ product?.price || product?.precio }}
      </p>

    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: any;
}
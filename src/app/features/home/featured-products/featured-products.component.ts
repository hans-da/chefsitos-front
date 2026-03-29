import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// CORRECCIÓN: Ruta exacta según tu árbol de archivos
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="bg-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-black mb-12 uppercase tracking-tighter">Destacados</h2>
        <div class="grid md:grid-cols-3 gap-8">
          @for (p of products; track p.name) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      </div>
    </section>
  `
})
export class FeaturedProductsComponent {
 products = [
    { 
      name: 'Laptop ', 
      price: 5000, 
      imagenUrl: 'images/laptop.jfif' 
    },
    { 
      name: 'Libros', 
      price: 200, 
      imagenUrl: 'images/libro.jfif' 
    },
    { 
      name: 'Servicio programación', 
      price: 600, 
      imagenUrl: 'images/codigo.jpg' 
    }
  ];
}

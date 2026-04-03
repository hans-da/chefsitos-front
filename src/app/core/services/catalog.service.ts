import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductStats } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.getCatalogUrl('/api/v1/productos')).pipe(
      map(products => [this.getMockProduct(), ...products]),
      catchError(err => {
        console.error('Error cargando productos:', err);
        return of([this.getMockProduct()]);
      })
    );
  }

  private getMockProduct(): Product {
    return {
      idProducto: '11111111-1111-1111-1111-111111111111',
      nombreProducto: '📦 Producto Mock (Activado)',
      descripcion: 'Producto de prueba activado para verificar el flujo de compra y visualización.',
      precio: 15.50,
      moneda: 'MXN',
      disponible: true,
      fechaCreacion: new Date().toISOString(),
      idCategoria: 'cat-mock',
      imagenUrl: 'https://placehold.co/400'
    };
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`));
  }

  getBestSellers(limit: number = 10): Observable<ProductStats[]> {
    return this.http.get<ProductStats[]>(this.api.getCatalogUrl(`/api/v1/productos/mas-vendidos?limit=${limit}`));
  }

  getProductStats(id: string): Observable<ProductStats> {
    return this.http.get<ProductStats>(this.api.getCatalogUrl(`/api/v1/productos/${id}/estadisticas`));
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl('/api/v1/productos'), data);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`), data);
  }


  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/activar`), {});
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/desactivar`), {});
  }
}

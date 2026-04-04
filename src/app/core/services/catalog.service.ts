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

  uploadImageToCloudinary(file: File): Observable<any> {
    const url = `https://api.cloudinary.com/v1_1/dh7s2na7p/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'uamishop');
    return this.http.post<any>(url, formData);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.getCatalogUrl('/api/v1/productos')).pipe(
      map(products => products.map(p => ({
        ...p,
        // Mapeamos lo que llega del back (urlImagen) a lo que usa el front (imagenUrl)
        imagenUrl: (p as any).urlImagen || (p as any).imagenUrl
      }))),
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
      nombreProducto: ' Producto Mock (Activado)',
      descripcion: 'Producto de prueba activado para verificar el flujo de compra y visualización.',
      precio: 150.50,
      moneda: 'MXN',
      disponible: true,
      fechaCreacion: new Date().toISOString(),
      idCategoria: 'cat-mock',
      imagenUrl: 'https://placehold.co/400'
    };
  }

  getProductById(id: string): Observable<Product> {
    if (id === '11111111-1111-1111-1111-111111111111') {
      return of(this.getMockProduct());
    }
    return this.http.get<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`)).pipe(
      map(p => ({ 
        ...p, 
        imagenUrl: (p as any).urlImagen || (p as any).imagenUrl 
      }))
    );
  }

  getBestSellers(limit: number = 10): Observable<ProductStats[]> {
    return this.http.get<ProductStats[]>(this.api.getCatalogUrl(`/api/v1/productos/mas-vendidos?limit=${limit}`));
  }

  getProductStats(id: string): Observable<ProductStats> {
    return this.http.get<ProductStats>(this.api.getCatalogUrl(`/api/v1/productos/${id}/estadisticas`));
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    const payload = {
      ...data,
      urlImagen: data.imagenUrl
    };
    return this.http.post<Product>(this.api.getCatalogUrl('/api/v1/productos'), payload);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    // Ahora incluimos explícitamente 'disponible' en el payload 
    // y mapeamos imagenUrl a urlImagen para el PatchRequest de Java
    const payload = {
      ...data,
      urlImagen: data.imagenUrl,
      disponible: data.disponible 
    };
    return this.http.patch<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`), payload).pipe(
      map(p => ({
        ...p,
        imagenUrl: (p as any).urlImagen || (p as any).imagenUrl
      }))
    );
  }

  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/activar`), {});
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/desactivar`), {});
  }
}
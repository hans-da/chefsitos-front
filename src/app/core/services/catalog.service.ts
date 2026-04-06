import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, forkJoin } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductStats } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  /** Cache interno de productos para enriquecer items de carrito/orden */
  private productCache = new Map<string, Product>();

  uploadImageToCloudinary(file: File): Observable<any> {
    const url = `https://api.cloudinary.com/v1_1/dh7s2na7p/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'uamishop');
    return this.http.post<any>(url, formData);
  }

  /**
   * Obtiene TODOS los productos del backend.
   * NO inyecta productos falsos/mock.
   * Si falla, devuelve arreglo vacío.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.getCatalogUrl('/api/v1/productos')).pipe(
      map(products => products.map(p => this.normalizeProduct(p))),
      map(products => {
        // Cachear para enriquecimiento
        products.forEach(p => this.productCache.set(p.idProducto, p));
        return products;
      }),
      catchError(err => {
        console.error('Error cargando productos:', err);
        return of([]);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`)).pipe(
      map(p => this.normalizeProduct(p))
    );
  }

  getBestSellers(limit: number = 10): Observable<ProductStats[]> {
    return this.http.get<ProductStats[]>(this.api.getCatalogUrl(`/api/v1/productos/mas-vendidos?limit=${limit}`)).pipe(
      catchError(err => {
        console.error('Error cargando más vendidos:', err);
        return of([]);
      })
    );
  }

  getProductStats(id: string): Observable<ProductStats> {
    return this.http.get<ProductStats>(this.api.getCatalogUrl(`/api/v1/productos/${id}/estadisticas`));
  }

  /**
   * Enriquecer un arreglo de items (de carrito u orden) con datos del catálogo.
   * Retorna un mapa productoId -> Product para usarlo en la UI.
   */
  enrichProducts(productIds: string[]): Observable<Map<string, Product>> {
    // Primero verificar cache
    const missing = productIds.filter(id => !this.productCache.has(id));

    if (missing.length === 0) {
      // Todo está en cache
      const result = new Map<string, Product>();
      productIds.forEach(id => {
        const cached = this.productCache.get(id);
        if (cached) result.set(id, cached);
      });
      return of(result);
    }

    // Cargar todos los productos y cachear
    return this.getProducts().pipe(
      map(products => {
        const result = new Map<string, Product>();
        productIds.forEach(id => {
          const found = this.productCache.get(id);
          if (found) result.set(id, found);
        });
        return result;
      })
    );
  }

  /** Buscar producto en cache local */
  getFromCache(id: string): Product | undefined {
    return this.productCache.get(id);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    const payload = {
      ...data,
      urlImagen: data.imagenUrl
    };
    return this.http.post<Product>(this.api.getCatalogUrl('/api/v1/productos'), payload);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    const payload = {
      ...data,
      urlImagen: data.imagenUrl,
      disponible: data.disponible
    };
    return this.http.patch<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}`), payload).pipe(
      map(p => this.normalizeProduct(p))
    );
  }

  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/activar`), {});
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(this.api.getCatalogUrl(`/api/v1/productos/${id}/desactivar`), {});
  }

  /** Normaliza campos de imagen del backend al modelo del frontend */
  private normalizeProduct(p: any): Product {
    return {
      ...p,
      imagenUrl: p.urlImagen || p.imagenUrl
    };
  }
}
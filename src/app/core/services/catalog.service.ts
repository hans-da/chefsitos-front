import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductStats } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.getCatalogUrl('/api/v1/productos'));
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

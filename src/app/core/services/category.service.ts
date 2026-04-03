import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api.getCatalogUrl('/api/v1/categorias')).pipe(
      catchError(err => {
        console.error('Error cargando categorías:', err);
        return of([]);
      })
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(this.api.getCatalogUrl(`/api/v1/categorias/${id}`));
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.api.getCatalogUrl('/api/v1/categorias'), data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(this.api.getCatalogUrl(`/api/v1/categorias/${id}`), data);
  }
}

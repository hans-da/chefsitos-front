import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * SERVICIO CENTRALIZADO DE URLs (API GATEWAY)
 * -------------------------------------------------------------------
 * REGLA DE ARQUITECTURA: Toda petición DEBE pasar por el API Gateway 
 * (puerto 8080). El Frontend NO TIENE PERMITIDO saltarse este ciclo para
 * comunicarse directamente con el puerto 8081, 8082 o 8083.
 * 
 * En desarrollo: proxy.conf.json redirige /api/** -> localhost:8080
 * En producción: Nginx redirige /api/** -> host.docker.internal:8080
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  // Alias semánticos para mantener compatibilidad de llamadas existentes
  getCatalogUrl(path: string): string {
    return this.url(path);
  }

  getOrdersUrl(path: string): string {
    return this.url(path);
  }

  getSalesUrl(path: string): string {
    return this.url(path);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  getCatalogUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}${path}`
      : `${environment.catalogApiUrl}${path}`;
  }

  getOrdersUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}${path}`
      : `${environment.ordersApiUrl}${path}`;
  }

  getSalesUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}${path}`
      : `${environment.salesApiUrl}${path}`;
  }
}

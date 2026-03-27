import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  getCatalogUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}/catalog${path}`
      : `${environment.catalogApiUrl}${path}`;
  }

  getOrdersUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}/orders${path}`
      : `${environment.ordersApiUrl}${path}`;
  }

  getSalesUrl(path: string): string {
    return environment.useGateway 
      ? `${environment.apiUrl}/sales${path}`
      : `${environment.salesApiUrl}${path}`;
  }
}

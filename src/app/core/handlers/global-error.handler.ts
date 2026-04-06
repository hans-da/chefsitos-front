import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Manejador global de errores.
 * Solo registra errores en consola. NO redirige a /error para evitar
 * loops infinitos y redirects por errores menores.
 * Los errores HTTP se manejan en el httpErrorInterceptor.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    // Ignorar errores HTTP — ya los maneja el interceptor
    if (error instanceof HttpErrorResponse) {
      return;
    }

    // Si el error envuelve un HttpErrorResponse (Angular a veces lo wrappea)
    if (error?.rejection instanceof HttpErrorResponse) {
      return;
    }

    // Log para desarrolladores, sin redirigir
    console.error('[GlobalErrorHandler]', error);
  }
}

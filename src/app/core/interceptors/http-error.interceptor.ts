import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.status === 401) {
        errorMessage = 'Sesión expirada';
        router.navigate(['/login']);
      } else if (error.error instanceof SyntaxError || (typeof error.error === 'string' && error.error.includes('<!doctype'))) {
        // Ignorar errores de parseo HTML/JSON del Gateway para no romper la UI con mensajes técnicos
        return throwError(() => error);
      } else if (error.message && error.message.includes('Unexpected token')) {
        // Ignorar notificaciones visuales de JSON mal formado
        return throwError(() => error);
      } else if (error.status === 0 || error.status >= 500) {
        errorMessage = 'El servidor no responde. Por favor, intenta más tarde.';
        router.navigate(['/error']);
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      }

      notificationService.error(errorMessage);
      return throwError(() => error);
    })
  );
};

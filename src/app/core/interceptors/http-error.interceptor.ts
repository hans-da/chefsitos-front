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
        // Ignorar errores de parseo HTML/JSON del Gateway
        return throwError(() => error);
      } else if (error.message && error.message.includes('Unexpected token')) {
        // Ignorar notificaciones de JSON mal formado
        return throwError(() => error);
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.status >= 500) {
        errorMessage = 'El servidor encontró un error. Intenta más tarde.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Solicitud inválida';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'Conflicto: la operación no se puede completar';
      }

      notificationService.error(errorMessage);
      return throwError(() => error);
    })
  );
};

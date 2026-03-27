import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error && error.error.message) {
        // Backend returned standard error message
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor: Intente más tarde';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      }

      notificationService.error(errorMessage);
      return throwError(() => error);
    })
  );
};

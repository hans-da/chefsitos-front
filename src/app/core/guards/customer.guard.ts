import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que evita que los administradores accedan a rutas de clientes.
 * Si es admin, redirige al dashboard de admin.
 */
export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};

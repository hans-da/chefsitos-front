import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { ErrorHandler } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([httpErrorInterceptor])
    )
  ]
};

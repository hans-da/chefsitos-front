import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);
    
    // Log error to console for developers
    console.error('Global Error Caught:', error);

    // Redirect to error page inside NgZone to ensure change detection works
    this.zone.run(() => {
      router.navigate(['/error']);
    });
  }
}

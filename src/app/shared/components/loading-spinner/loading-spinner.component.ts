import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]" [class.min-h-screen]="fullScreen">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
        <div class="absolute inset-2 rounded-full border-t-2 border-emerald-400 animate-spin animation-delay-150"></div>
        <div class="absolute inset-4 rounded-full border-t-2 border-indigo-300 animate-spin animation-delay-300"></div>
      </div>
      @if (message) {
        <p class="mt-4 text-gray-500 text-sm font-medium animate-pulse">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .animation-delay-150 { animation-delay: 150ms; }
    .animation-delay-300 { animation-delay: 300ms; }
  `]
})
export class LoadingSpinnerComponent {
  @Input() fullScreen = false;
  @Input() message = 'Cargando...';
}

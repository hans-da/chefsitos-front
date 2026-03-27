import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (msg of notificationService.messages(); track msg.id) {
        <div 
          class="flex items-center p-4 rounded-lg shadow-lg text-white max-w-sm w-full transition-all duration-300 ease-in-out border border-white/20"
          [ngClass]="{
            'bg-emerald-500': msg.type === 'success',
            'bg-red-500': msg.type === 'error',
            'bg-indigo-500': msg.type === 'info'
          }"
        >
          <div class="flex-shrink-0 mr-3">
            @if (msg.type === 'success') {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            } @else if (msg.type === 'error') {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            } @else {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
          </div>
          <p class="font-medium text-sm">{{ msg.message }}</p>
          <button (click)="notificationService.remove(msg.id)" class="ml-auto text-white/80 hover:text-white transition-colors p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}

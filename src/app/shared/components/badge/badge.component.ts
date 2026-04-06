import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      [ngClass]="colorClasses"
    >
      {{ text }}
    </span>
  `
})
export class BadgeComponent {
  @Input({ required: true }) text!: string;
  @Input() type: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
  @Input() customClasses = '';

  get colorClasses(): string {
    if (this.customClasses) return this.customClasses;
    
    switch (this.type) {
      case 'success': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'danger': return 'bg-red-100 text-red-800 border border-red-200';
      case 'info': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }
}

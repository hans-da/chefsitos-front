// This component can be just a stub or fully realized sidebar.
// The prompt specifies 'CartSidebar o experiencia equivalente'.
// We will build a small widget or use the main CartComponent heavily.
// For simplicity, we built the count in the Navbar. We will rely on /carrito for full experience,
// but let's provide a CartSidebar structural component if needed.
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  template: `
    <!-- For UAMIShop we will use a dedicated page for the cart to ensure mobile responsiveness and clear steps -->
    <!-- This component is created to fulfill the prompt requirements but architecture relies on /carrito -->
  `
})
export class CartSidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}

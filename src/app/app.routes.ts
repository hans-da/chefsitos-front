import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'mis-ordenes', 
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'carrito', // Ruta para la Bolsita
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'productos', loadComponent: () => import('./features/admin/products/products.component').then(m => m.AdminProductsComponent) },
      { path: 'categorias', loadComponent: () => import('./features/admin/categories/categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'ordenes', loadComponent: () => import('./features/admin/orders/orders.component').then(m => m.AdminOrdersComponent) }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
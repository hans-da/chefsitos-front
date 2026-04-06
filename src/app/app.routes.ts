import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { customerGuard } from './core/guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'catalogo',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'destacados',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/catalog/featured-catalog.component').then(m => m.FeaturedCatalogComponent)
  },
  {
    path: 'productos/:id',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'carrito',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'mis-ordenes',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'mis-ordenes/:id',
    canActivate: [customerGuard],
    loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
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
    path: 'error',
    loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
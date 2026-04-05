import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component'; // Ruta corregida
import { HeroComponent } from './hero/hero.component';
import { StatsBarComponent } from './stats-bar/stats-bar.component'; 
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    StatsBarComponent,
    CategoryGridComponent,
    FeaturedProductsComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-stats-bar></app-stats-bar>
      <app-category-grid></app-category-grid>
      <app-featured-products></app-featured-products>
    </main>
  `
})
export class HomeComponent {}
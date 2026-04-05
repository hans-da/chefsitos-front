import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent, BadgeComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Productos</h1>
            <p class="text-gray-500 mt-1">Administra el inventario de la tienda.</p>
          </div>
          <button (click)="openModal()" class="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nuevo Producto
          </button>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU / ID</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" class="relative px-6 py-4"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                @for (prod of products(); track prod.idProducto) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ prod.idProducto.substring(0,8) }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                          <img *ngIf="prod.imagenUrl" [src]="prod.imagenUrl" class="h-full w-full object-cover">
                          <svg *ngIf="!prod.imagenUrl" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-bold text-gray-900">{{ prod.nombreProducto }}</div>
                          <div class="text-sm text-gray-500">{{ getCategoryName(prod.idCategoria) }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ prod.precio | currency:prod.moneda }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-badge [text]="prod.disponible ? 'Activo' : 'Inactivo'" [type]="prod.disponible ? 'success' : 'neutral'"></app-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                      @if (prod.disponible) {
                         <button (click)="deactivate(prod.idProducto)" class="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors">Desactivar</button>
                      } @else {
                         <button (click)="activate(prod.idProducto)" class="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors">Activar</button>
                      }
                      <button (click)="editProduct(prod)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors">Editar</button>
                    </td>
                  </tr>
                } @empty {
                   <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">No hay productos registrados.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="relative z-10 inline-block align-bottom bg-white rounded-3xl sm:rounded-[2rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-gray-100">
            <form [formGroup]="prodForm" (ngSubmit)="saveProduct()">
              <div class="bg-white px-6 pt-8 pb-6 sm:p-10 sm:pb-8">
                <div class="sm:flex sm:items-start">
                  <div class="w-full">
                    <h3 class="text-2xl leading-none font-extrabold text-gray-900 mb-6" id="modal-title">
                      {{ isEditing() ? 'Editar' : 'Nuevo' }} Producto
                    </h3>
                    
                    <div class="space-y-6">

                      <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Imagen del Producto *</label>
                        <div class="flex items-center gap-4">
                          <div class="h-20 w-20 bg-white rounded-xl overflow-hidden border-2 border-dashed border-indigo-200 flex items-center justify-center shadow-sm">
                            <img *ngIf="imagePreview" [src]="imagePreview" class="h-full w-full object-cover">
                            <svg *ngIf="!imagePreview" class="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                          <div class="flex-1">
                            <input type="file" (change)="onFileSelected($event)" accept="image/*" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer">
                            <p class="text-xs text-indigo-400 mt-2">Formatos: JPG, PNG. Máx 5MB.</p>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="sm:col-span-2">
                          <label class="block text-sm font-bold text-gray-700 mb-2">Nombre del producto *</label>
                          <input type="text" formControlName="nombreProducto" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 bg-gray-50 border">
                        </div>
                        
                        <div>
                          <label class="block text-sm font-bold text-gray-700 mb-2">Precio *</label>
                          <div class="relative mt-1 rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" formControlName="precio" step="0.01" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-7 px-4 py-3 bg-gray-50 border">
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm font-bold text-gray-700 mb-2">Moneda (Fija)</label>
                          <input type="text" formControlName="moneda" [readonly]="true" class="block w-full border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-500 border px-4 py-3 cursor-not-allowed">
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Categoría *</label>
                        <select formControlName="idCategoria" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 bg-gray-50 border">
                          <option value="">Selecciona una categoría</option>
                          @for (cat of categories(); track cat.idCategoria) {
                            <option [value]="cat.idCategoria">{{ cat.nombreCategoria }}</option>
                          }
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                        <textarea formControlName="descripcion" rows="4" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 bg-gray-50 border"></textarea>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-6 py-4 sm:px-10 flex justify-end gap-3 rounded-b-[2rem]">
                <button type="button" (click)="closeModal()" class="w-full sm:w-auto inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors">
                  Cancelar
                </button>
                <button type="submit" [disabled]="prodForm.invalid || isUploading()" class="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors">
                  {{ isUploading() ? 'Subiendo...' : 'Guardar Producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
    <app-footer></app-footer>
  `
})
export class AdminProductsComponent implements OnInit {
  catalogService = inject(CatalogService);
  categoryService = inject(CategoryService);
  notification = inject(NotificationService);
  fb = inject(FormBuilder);

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = signal(false);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentEditId: string | null = null;

  prodForm = this.fb.group({
    nombreProducto: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    moneda: ['MXN', Validators.required],
    idCategoria: ['', Validators.required],
    imagenUrl: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getCategories().subscribe(cats => this.categories.set(cats));
    this.refreshProducts();
  }

  refreshProducts() {
    this.catalogService.getProducts().subscribe(prods => {
      // Usamos el spread operator para asegurar que el Signal detecte el cambio de referencia
      this.products.set([...prods]);
    });
  }

  getCategoryName(id: string): string {
    const cat = this.categories().find(c => c.idCategoria === id);
    return cat ? cat.nombreCategoria : 'Sin Categoría';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openModal() {
    this.isModalOpen.set(true);
    this.isEditing.set(false);
    this.currentEditId = null;
    this.imagePreview = null;
    this.selectedFile = null;
    this.prodForm.reset({ moneda: 'MXN' });
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  editProduct(prod: Product) {
    this.isEditing.set(true);
    this.currentEditId = prod.idProducto;
    this.imagePreview = prod.imagenUrl || null;
    this.prodForm.patchValue({
      nombreProducto: prod.nombreProducto,
      descripcion: prod.descripcion,
      precio: prod.precio,
      moneda: prod.moneda,
      idCategoria: prod.idCategoria,
      imagenUrl: prod.imagenUrl
    });
    this.isModalOpen.set(true);
  }

  saveProduct() {
    if (this.prodForm.invalid) return;
    const val = this.prodForm.value as Partial<Product>;

    if (this.selectedFile) {
      this.isUploading.set(true);
      this.catalogService.uploadImageToCloudinary(this.selectedFile).subscribe({
        next: (res) => {
          val.imagenUrl = res.secure_url;
          this.proceedToSave(val);
        },
        error: () => {
          this.notification.error('Error al subir imagen a la nube');
          this.isUploading.set(false);
        }
      });
    } else {
      this.proceedToSave(val);
    }
  }

  private proceedToSave(val: Partial<Product>) {
    if (this.isEditing() && this.currentEditId) {
      this.catalogService.updateProduct(this.currentEditId, val).subscribe({
        next: () => {
          this.notification.success('Producto actualizado');
          this.finalizeAction();
        },
        error: () => this.isUploading.set(false)
      });
    } else {
      this.catalogService.createProduct(val).subscribe({
        next: () => {
          this.notification.success('Producto creado');
          this.finalizeAction();
        },
        error: () => this.isUploading.set(false)
      });
    }
  }

  private finalizeAction() {
    this.refreshProducts();
    this.closeModal();
    this.isUploading.set(false);
    this.selectedFile = null;
    this.imagePreview = null;
  }

  activate(id: string) {
  // Creamos un objeto que coincida exactamente con lo que el Entity de Java espera
  const updatePayload = {
    idProducto: id,
    disponible: true
  };

  this.catalogService.updateProduct(id, updatePayload as any).subscribe({
    next: () => {
      this.notification.success('Petición de activación enviada');
      // Aumentamos el delay a 1 segundo para dar tiempo al commit de la DB
      setTimeout(() => {
        this.refreshProducts();
      }, 1000);
    },
    error: (err) => {
      this.notification.error('El servidor rechazó la actualización');
    }
  });
}

  deactivate(id: string) {
    this.catalogService.updateProduct(id, { disponible: false } as any).subscribe({
      next: () => {
        this.notification.info('Producto desactivado');
        setTimeout(() => {
          this.refreshProducts();
        }, 500);
      }
    });
  }
}
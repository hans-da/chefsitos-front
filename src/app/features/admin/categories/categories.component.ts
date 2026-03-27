import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models/category.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Categorías</h1>
            <p class="text-gray-500 mt-1">Crea y administra las categorías de tu catálogo.</p>
          </div>
          <button (click)="openModal()" class="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nueva Categoría
          </button>
        </div>

        <!-- Categories Table -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" class="relative px-6 py-4"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                @for (cat of categories(); track cat.idCategoria) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ cat.idCategoria.substring(0,8) }}...</td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ cat.nombreCategoria }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 line-clamp-2 max-w-sm">{{ cat.descripcion }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button (click)="editCategory(cat)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors">Editar</button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="px-6 py-12 text-center text-gray-500">No hay categorías registradas. ¡Crea la primera!</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
          <div class="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="relative z-10 inline-block align-bottom bg-white rounded-3xl sm:rounded-[2rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100">
            <form [formGroup]="catForm" (ngSubmit)="saveCategory()">
              <div class="bg-white px-6 pt-8 pb-6 sm:p-10 sm:pb-8">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-2xl leading-none font-extrabold text-gray-900 mb-6" id="modal-title">
                      {{ isEditing() ? 'Editar' : 'Nueva' }} Categoría
                    </h3>
                    
                    <div class="space-y-6">
                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                        <input type="text" formControlName="nombreCategoria" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 bg-gray-50 border">
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                        <textarea formControlName="descripcion" rows="3" class="block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 bg-gray-50 border"></textarea>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-6 py-4 sm:px-10 sm:flex sm:flex-row-reverse rounded-b-[2rem]">
                <button type="submit" [disabled]="catForm.invalid" class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors">
                  Guardar
                </button>
                <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                  Cancelar
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
export class AdminCategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);
  notification = inject(NotificationService);
  fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentEditId: string | null = null;

  catForm = this.fb.group({
    nombreCategoria: ['', Validators.required],
    descripcion: ['', Validators.required]
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  openModal() {
    this.isModalOpen.set(true);
    this.isEditing.set(false);
    this.currentEditId = null;
    this.catForm.reset();
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  editCategory(cat: Category) {
    this.isEditing.set(true);
    this.currentEditId = cat.idCategoria;
    this.catForm.patchValue({
      nombreCategoria: cat.nombreCategoria,
      descripcion: cat.descripcion
    });
    this.isModalOpen.set(true);
  }

  saveCategory() {
    if (this.catForm.invalid) return;

    const val = this.catForm.value as Partial<Category>;

    if (this.isEditing() && this.currentEditId) {
      this.categoryService.updateCategory(this.currentEditId, val).subscribe({
        next: () => {
          this.notification.success('Categoría actualizada');
          this.loadCategories();
          this.closeModal();
        }
      });
    } else {
      this.categoryService.createCategory(val).subscribe({
        next: () => {
          this.notification.success('Categoría creada');
          this.loadCategories();
          this.closeModal();
        }
      });
    }
  }
}

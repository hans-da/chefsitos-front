/** Respuesta del backend al leer una categoría */
export interface Category {
  idCategoria: string;
  nombreCategoria: string;
  descripcion: string;
  idCategoriaPadre?: string | null; // Campo en la RESPUESTA del backend
}

/** Payload para crear o actualizar una categoría */
export interface CategoryRequest {
  nombreCategoria: string;
  descripcion: string;
  categoriaPadreId?: string | null; // Campo en la PETICIÓN al backend
}

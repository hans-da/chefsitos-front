export interface Product {
  idProducto: string;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  moneda: string;
  disponible: boolean;
  fechaCreacion: string;
  idCategoria: string;
  imagenUrl?: string;
}

export interface ProductStats {
  productoId: string;
  ventasTotales: number;
  cantidadVendida: number;
  vecesAgregadoAlCarrito: number;
  ultimaVentaAt: string | null;
}

export interface Stats { // Cambiado de ProductStats a Stats
  productoId: string;
  ventasTotales: number;
  cantidadVendida: number;
  vecesAgregadoAlCarrito: number;
  ultimaVentaAt: string | null;
}
export interface CartItem {
  productoId: string;
  nombreProducto: string;
  sku: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  moneda: string;
}

export interface Cart {
  carritoId: string;
  clienteId: string;
  items: CartItem[];
  descuentos: unknown[];
  estado: 'ACTIVO' | 'EN_CHECKOUT' | 'COMPLETADO' | 'ABANDONADO';
  subtotal: number;
  total: number;
  moneda: string;
}

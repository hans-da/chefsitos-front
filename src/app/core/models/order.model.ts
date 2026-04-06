export type OrderStatus =
  'PENDIENTE' | 'CONFIRMADA' | 'PAGO_PROCESADO' |
  'EN_PREPARACION' | 'ENVIADA' |
  'ENTREGADA' | 'CANCELADA';

export interface OrderItem {
  productoId: string;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
  moneda?: string;
}

export interface Order {
  id: string;
  numeroOrden: string;
  clienteId: string;
  estado: OrderStatus;
  total: number;
  moneda: string;
  direccionResumen: string;
  /** Items de la orden - puede venir del backend si lo soporta */
  items?: OrderItem[];
  /** Fecha de creación de la orden */
  fechaCreacion?: string;
  /** Referencia de pago (viene del backend tras procesar pago) */
  referenciaPago?: string;
  /** Datos de envío opcionales */
  proveedorLogistico?: string;
  numeroGuia?: string;
}

export interface Address {
  nombreDestinatario: string;
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  telefono: string;
  instrucciones?: string;
}

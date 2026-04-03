export type OrderStatus =
  'PENDIENTE' | 'CONFIRMADA' | 'PAGO_PROCESADO' |
  'EN_PREPARACION' | 'ENVIADA' |
  'ENTREGADA' | 'CANCELADA';

export interface Order {
  id: string;
  numeroOrden: string;
  clienteId: string;
  estado: OrderStatus;
  total: number;
  moneda: string;
  direccionResumen: string;
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

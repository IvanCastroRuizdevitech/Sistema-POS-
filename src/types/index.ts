export enum TipoMovimientoEnum {
  Entrada = 'Entrada',
  Salida = 'Salida',
  Venta = 'Venta',
}

export enum TipoPersonaEnum {
  Cliente = 'Cliente',
  Empleado = 'Empleado',
  Proveedor = 'Proveedor',
}

export interface TipoIdentificacion {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Persona {
  id: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  tipo: TipoPersonaEnum;
  tipo_identificacion_id: string;
  numero_identificacion: string;
}

export interface Rol {
  id: string;
  nombre: string;
  permisos?: string;
}

export interface Usuario {
  id: string;
  persona_id: string;
  email: string;
  password: string;
  rol_id: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface Compañia {
  id: string;
  nombre: string;
  nit?: string;
  direccion?: string;
}

export interface Tienda {
  id: string;
  nombre: string;
  direccion?: string;
  compania_id: string;
}

export interface Unidad {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Impuesto {
  id: string;
  nombre: string;
  porcentaje: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  unidad_id: string;
  impuesto_id: string;
}

export interface Inventario {
  id: string;
  producto_id: string;
  tienda_id: string;
  saldo: number;
}

export interface Kardex {
  id: string;
  producto_id: string;
  tienda_id: string;
  fecha: Date;
  tipo_movimiento: TipoMovimientoEnum;
  cantidad: number;
  saldo_anterior: number;
  saldo_nuevo: number;
  observaciones?: string;
}

export interface MetodoPago {
  id: string;
  nombre: string;
}

export interface Venta {
  id: string;
  vendedor_id: string;
  cliente_id?: string;
  tienda_id: string;
  fecha: Date;
  subtotal: number;
  impuestos: number;
  total: number;
  metodo_pago_id: string;
  estado: EstadoVentaEnum;
}

export interface DetalleVenta {
  id: string;
  venta_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Gasto {
  id: string;
  tienda_id: string;
  empleado_id: string;
  concepto: string;
  subtotal: number;
  impuestos: number;
  total: number;
  fecha: Date;
}

export interface DetalleGasto {
  id: string;
  gasto_id: string;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  subtotal: number;
}

export interface ProveedorProducto {
  id: string;
  proveedor_id: string;
  producto_id: string;
  precio_compra: number;
  fecha_ultima_compra?: Date;
}

// Simulated data storage (for demonstration)
export interface DataStore {
  tipos_identificacion: TipoIdentificacion[];
  personas: Persona[];
  roles: Rol[];
  usuarios: Usuario[];
  compañias: Compañia[];
  tiendas: Tienda[];
  unidades: Unidad[];
  impuestos: Impuesto[];
  productos: Producto[];
  inventarios: Inventario[];
  kardex: Kardex[];
  metodos_pago: MetodoPago[];
  ventas: Venta[];
  detalles_ventas: DetalleVenta[];
  gastos: Gasto[];
  detalles_gastos: DetalleGasto[];
  proveedores_productos: ProveedorProducto[];
  migrated?: boolean;
}


export enum TipoPagoEnum {
  Efectivo = 'Efectivo',
  Transferencia = 'Transferencia',
  Tarjeta = 'Tarjeta',
}

export enum EstadoVentaEnum {
  Pendiente = 'Pendiente',
  Completada = 'Completada',
  Cancelada = 'Cancelada',
}


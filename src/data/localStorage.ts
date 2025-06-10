import { v4 as uuidv4 } from 'uuid';
import { DataStore, TipoIdentificacion, Rol, MetodoPago, Unidad, Impuesto, Persona, TipoPersonaEnum, Usuario, Producto, Inventario, Kardex, TipoMovimientoEnum, Venta, DetalleVenta, Gasto, DetalleGasto, ProveedorProducto } from '../types';

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const initialData: DataStore = {
  tipos_identificacion: [
    { id: '1', nombre: 'Cédula de Ciudadanía', descripcion: 'Documento de identidad nacional' },
    { id: '2', nombre: 'Cédula de Extranjería', descripcion: 'Documento para extranjeros' },
    { id: '3', nombre: 'NIT', descripcion: 'Número de Identificación Tributaria' },
    { id: '4', nombre: 'Pasaporte', descripcion: 'Documento de viaje internacional' },
  ],
  personas: [],
  roles: [
    { id: '1', nombre: 'Administrador', permisos: 'all' },
    { id: '2', nombre: 'Vendedor', permisos: 'sales,inventory_read,products_read,clients_read' },
  ],
  usuarios: [],
  compañias: [],
  tiendas: [],
  unidades: [
    { id: '1', nombre: 'Unidad', descripcion: 'Producto individual' },
    { id: '2', nombre: 'Paquete', descripcion: 'Conjunto de productos' },
    { id: '3', nombre: 'Kit', descripcion: 'Kit de accesorios' },
  ],
  impuestos: [
    { id: '1', nombre: 'IVA 19%', porcentaje: 19 },
    { id: '2', nombre: 'IVA 5%', porcentaje: 5 },
    { id: '3', nombre: 'Exento', porcentaje: 0 },
  ],
  productos: [],
  inventarios: [],
  kardex: [],
  metodos_pago: [
    { id: '1', nombre: 'Efectivo' },
    { id: '2', nombre: 'Transferencia' },
    { id: '3', nombre: 'Tarjeta de Crédito' },
    { id: '4', nombre: 'Tarjeta de Débito' },
  ],
  ventas: [],
  detalles_ventas: [],
  gastos: [],
  detalles_gastos: [],
  proveedores_productos: [],
};

// Generate sample data
const generateSampleData = (): DataStore => {
  const data = { ...initialData };

  // Personas (Clientes, Empleados, Proveedores)
  const adminPersonaId = uuidv4();
  const vendedorPersonaId = uuidv4();
  const cliente1Id = uuidv4();
  const cliente2Id = uuidv4();
  const proveedor1Id = uuidv4();

  data.personas.push(
    { id: adminPersonaId, nombre: 'Administrador Sistema', telefono: '3001234567', direccion: 'Oficina Principal', tipo_identificacion_id: '1', numero_identificacion: '1234567', tipo: TipoPersonaEnum.Empleado },
    { id: vendedorPersonaId, nombre: 'Vendedor Demo', telefono: '3007654321', direccion: 'Tienda Principal', tipo_identificacion_id: '1', numero_identificacion: '87654321', tipo: TipoPersonaEnum.Empleado },
    { id: cliente1Id, nombre: 'Juan Pérez', telefono: '3101112233', direccion: 'Calle Falsa 123', tipo_identificacion_id: '1', numero_identificacion: '100100100', tipo: TipoPersonaEnum.Cliente },
    { id: cliente2Id, nombre: 'María López', telefono: '3204445566', direccion: 'Avenida Siempre Viva 742', tipo_identificacion_id: '1', numero_identificacion: '200200200', tipo: TipoPersonaEnum.Cliente },
    { id: proveedor1Id, nombre: 'Distribuidora Celular S.A.S.', telefono: '6017890123', direccion: 'Zona Industrial', tipo_identificacion_id: '3', numero_identificacion: '900900900-1', tipo: TipoPersonaEnum.Proveedor },
  );

  // Usuarios
  data.usuarios.push(
    { id: uuidv4(), persona_id: adminPersonaId, email: 'admin@tienda.com', password: 'admin123', rol_id: '1', fecha_creacion: new Date(), activo: true },
    { id: uuidv4(), persona_id: vendedorPersonaId, email: 'vendedor@tienda.com', password: 'vendedor123', rol_id: '2', fecha_creacion: new Date(), activo: true },
  );

  // Compañías y Tiendas
  const compania1Id = uuidv4();
  const tienda1Id = uuidv4();
  data.compañias.push(
    { id: compania1Id, nombre: 'Accesorios Móviles S.A.S.', nit: '900123456-7', direccion: 'Calle 123 #45-67, Bogotá' },
  );
  data.tiendas.push(
    { id: tienda1Id, compania_id: compania1Id, nombre: 'Tienda Principal', direccion: 'Centro Comercial Andino' },
  );

  // Productos
  const producto1Id = uuidv4();
  const producto2Id = uuidv4();
  const producto3Id = uuidv4();
  data.productos.push(
    { id: producto1Id, nombre: 'Protector Pantalla iPhone 15', categoria: 'Protectores', precio: 25.00, unidad_id: '1', impuesto_id: '1' },
    { id: producto2Id, nombre: 'Cargador Rápido USB-C', categoria: 'Cargadores', precio: 40.00, unidad_id: '1', impuesto_id: '1' },
    { id: producto3Id, nombre: 'Audífonos Inalámbricos Bluetooth', categoria: 'Audífonos', precio: 80.00, unidad_id: '1', impuesto_id: '1' },
  );

  // Inventario
  data.inventarios.push(
    { id: uuidv4(), producto_id: producto1Id, tienda_id: tienda1Id, saldo: 50 },
    { id: uuidv4(), producto_id: producto2Id, tienda_id: tienda1Id, saldo: 30 },
    { id: uuidv4(), producto_id: producto3Id, tienda_id: tienda1Id, saldo: 20 },
  );

  // Ventas y Detalles de Ventas
  const venta1Id = uuidv4();
  const venta2Id = uuidv4();
  const venta3Id = uuidv4();

  data.ventas.push(
    { id: venta1Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), subtotal: 25.00, impuestos: 4.75, total: 29.75, metodo_pago_id: '1', cliente_id: cliente1Id, vendedor_id: vendedorPersonaId, tienda_id: tienda1Id },
    { id: venta2Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), subtotal: 40.00, impuestos: 7.60, total: 47.60, metodo_pago_id: '2', cliente_id: cliente2Id, vendedor_id: vendedorPersonaId, tienda_id: tienda1Id },
    { id: venta3Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), subtotal: 80.00, impuestos: 15.20, total: 95.20, metodo_pago_id: '3', cliente_id: cliente1Id, vendedor_id: vendedorPersonaId, tienda_id: tienda1Id },
  );

  data.detalles_ventas.push(
    { id: uuidv4(), venta_id: venta1Id, producto_id: producto1Id, cantidad: 1, precio_unitario: 25.00, subtotal: 25.00 },
    { id: uuidv4(), venta_id: venta2Id, producto_id: producto2Id, cantidad: 1, precio_unitario: 40.00, subtotal: 40.00 },
    { id: uuidv4(), venta_id: venta3Id, producto_id: producto3Id, cantidad: 1, precio_unitario: 80.00, subtotal: 80.00 },
  );

  // Kardex
  data.kardex.push(
    { id: uuidv4(), producto_id: producto1Id, tienda_id: tienda1Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), tipo_movimiento: TipoMovimientoEnum.Entrada, cantidad: 50, saldo_anterior: 0, saldo_nuevo: 50, observaciones: 'Compra inicial' },
    { id: uuidv4(), producto_id: producto1Id, tienda_id: tienda1Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), tipo_movimiento: TipoMovimientoEnum.Salida, cantidad: 1, saldo_anterior: 50, saldo_nuevo: 49, observaciones: `Venta ${venta1Id}` },
  );

  // Gastos y Detalles de Gastos
  const gasto1Id = uuidv4();
  data.gastos.push(
    { id: gasto1Id, fecha: generateRandomDate(new Date(2025, 0, 1), new Date()), tienda_id: tienda1Id, empleado_id: vendedorPersonaId, concepto: 'Alquiler local', subtotal: 100.00, impuestos: 19.00, total: 119.00 },
  );
  data.detalles_gastos.push(
    { id: uuidv4(), gasto_id: gasto1Id, descripcion: 'Pago de alquiler', cantidad: 1, valor_unitario: 100.00, subtotal: 100.00 },
  );

  // Proveedores_Productos
  data.proveedores_productos.push(
    { id: uuidv4(), proveedor_id: proveedor1Id, producto_id: producto1Id, precio_compra: 15.00 },
    { id: uuidv4(), proveedor_id: proveedor1Id, producto_id: producto2Id, precio_compra: 25.00 },
  );

  return data;
};

// Function to simulate localStorage operations
export const getLocalStorageData = (): DataStore => {
  const data = localStorage.getItem('pos_data');
  //console.log('Data from localStorage:', data); // Debugging line to check localStorage content
  if (data) {
    const parsedData = JSON.parse(data);
    // Convert date strings back to Date objects
    parsedData.usuarios = parsedData.usuarios?.map((usuario: any) => ({
      ...usuario,
      fecha_creacion: new Date(usuario.fecha_creacion),
    })) || [];
    parsedData.ventas = parsedData.ventas?.map((venta: any) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    })) || [];
    parsedData.gastos = parsedData.gastos?.map((gasto: any) => ({
      ...gasto,
      fecha: new Date(gasto.fecha),
    })) || [];
    parsedData.kardex = parsedData.kardex?.map((kardex: any) => ({
      ...kardex,
      fecha: new Date(kardex.fecha),
    })) || [];
    parsedData.inventarios = parsedData.inventarios?.map((inventario: any) => ({
      ...inventario,
     fecha: new Date(inventario.fecha), // Ensure saldo is a number
    })) || [];
    console.log('Data from localStorage parsedData:', parsedData); // Debugging line to check localStorage content
    return parsedData;
  }
  return generateSampleData(); // Initialize with sample data if no data exists
};

export const setLocalStorageData = (data: DataStore) => {
  localStorage.setItem('pos_data', JSON.stringify(data));
};

// Helper function to generate unique IDs
export const generateId = (): string => uuidv4();

// Initialize data if not exists (now handled by getLocalStorageData)
export const initializeData = () => {
  // This function is now redundant as getLocalStorageData initializes if no data exists
  // However, keeping it for compatibility if other parts of the app call it.
  getLocalStorageData(); 
};



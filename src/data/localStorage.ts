import { v4 as uuidv4 } from 'uuid';
import { DataStore, TipoIdentificacion, Rol, MetodoPago, Unidad, Impuesto } from '../types';

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
    { id: '2', nombre: 'Vendedor', permisos: 'sales,inventory_read' },
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
  inventario: [],
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

// Function to simulate localStorage operations
export const getLocalStorageData = (): DataStore => {
  const data = localStorage.getItem('pos_data');
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
    return parsedData;
  }
  return initialData;
};

export const setLocalStorageData = (data: DataStore) => {
  localStorage.setItem('pos_data', JSON.stringify(data));
};

// Helper function to generate unique IDs
export const generateId = (): string => uuidv4();

// Initialize data if not exists
export const initializeData = () => {
  const existingData = localStorage.getItem('pos_data');
  if (!existingData) {
    setLocalStorageData(initialData);
  }
};


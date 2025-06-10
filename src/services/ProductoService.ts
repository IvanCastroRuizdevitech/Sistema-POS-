import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Producto, Inventario, Kardex, TipoMovimientoEnum } from '../types';

export class ProductoService {
  static getAll(): Producto[] {
    const data = getLocalStorageData();
    console.log('Productos obtenidos:', data.productos);
    return data.productos;
  }

  static getById(id: string): Producto | undefined {
    const data = getLocalStorageData();
    return data.productos.find(p => p.id === id);
  }

  static getByCategoria(categoria: string): Producto[] {
    const data = getLocalStorageData();
    return data.productos.filter(p => p.categoria === categoria);
  }

  static getCategorias(): string[] {
    const data = getLocalStorageData();
    const categorias = Array.from(new Set(data.productos.map(p => p.categoria)));
    return categorias.filter(c => c && c.trim() !== '');
  }

  static create(producto: Omit<Producto, 'id'>): Producto {
    const data = getLocalStorageData();
    const newProducto: Producto = {
      ...producto,
      id: generateId(),
    };
    data.productos.push(newProducto);
    setLocalStorageData(data);
    return newProducto;
  }

  static update(id: string, updates: Partial<Omit<Producto, 'id'>>): Producto | null {
    const data = getLocalStorageData();
    const index = data.productos.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.productos[index] = { ...data.productos[index], ...updates };
    setLocalStorageData(data);
    return data.productos[index];
  }

  static delete(id: string): boolean {
    const data = getLocalStorageData();
    const index = data.productos.findIndex(p => p.id === id);
    if (index === -1) return false;

    // Check if product is referenced in inventory or sales
    const hasInventory = data.inventarios.some(i => i.producto_id === id);
    const hasSales = data.detalles_ventas.some(dv => dv.producto_id === id);
    
    if (hasInventory || hasSales) {
      throw new Error('No se puede eliminar este producto porque tiene movimientos de inventario o ventas asociadas');
    }

    data.productos.splice(index, 1);
    setLocalStorageData(data);
    return true;
  }
}


import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Inventario, Kardex, TipoMovimientoEnum } from '../types';

export class InventarioService {
  static getAll(): Inventario[] {
    const data = getLocalStorageData();
    return data.inventarios;
  }

  static getByTienda(tiendaId: string): Inventario[] {
    const data = getLocalStorageData();
    return data.inventarios.filter(i => i.tienda_id === tiendaId);
  }

  static getByProducto(productoId: string): Inventario[] {
    const data = getLocalStorageData();
    return data.inventarios.filter(i => i.producto_id === productoId);
  }

  static getByProductoAndTienda(productoId: string, tiendaId: string): Inventario | undefined {
    const data = getLocalStorageData();
    return data.inventarios.find(i => i.producto_id === productoId && i.tienda_id === tiendaId);
  }

  static getSaldoProducto(productoId: string, tiendaId: string): number {
    const inventario = this.getByProductoAndTienda(productoId, tiendaId);
    return inventario?.saldo || 0;
  }

  static getProductosBajoStock(tiendaId?: string, limite: number = 10): Inventario[] {
    const data = getLocalStorageData();
    let inventarios = data.inventarios.filter(i => i.saldo <= limite);
    
    if (tiendaId) {
      inventarios = inventarios.filter(i => i.tienda_id === tiendaId);
    }
    
    return inventarios;
  }

  static actualizarStock(
    productoId: string, 
    tiendaId: string, 
    cantidad: number, 
    tipoMovimiento: TipoMovimientoEnum
  ): boolean {
    const data = getLocalStorageData();
    
    // Find or create inventory record
    let inventario = data.inventarios.find(i => 
      i.producto_id === productoId && i.tienda_id === tiendaId
    );

    if (!inventario) {
      inventario = {
        id: generateId(),
        producto_id: productoId,
        tienda_id: tiendaId,
        saldo: 0
      };
      data.inventarios.push(inventario);
    }

    // Calculate new balance
    let nuevoSaldo = inventario.saldo;
    
    switch (tipoMovimiento) {
      case TipoMovimientoEnum.Entrada:
        nuevoSaldo += cantidad;
        break;
      case TipoMovimientoEnum.Salida:
      case TipoMovimientoEnum.Venta:
        nuevoSaldo -= cantidad;
        break;
    }

    // Validate stock availability for outgoing movements
    if ((tipoMovimiento === TipoMovimientoEnum.Salida || tipoMovimiento === TipoMovimientoEnum.Venta) 
        && nuevoSaldo < 0) {
      throw new Error('Stock insuficiente para realizar esta operación');
    }

    // Update inventory
    inventario.saldo = nuevoSaldo;

    // Create kardex record
    const kardex: Kardex = {
      id: generateId(),
      producto_id: productoId,
      tienda_id: tiendaId,
      fecha: new Date(),
      tipo_movimiento: tipoMovimiento,
      cantidad: cantidad,
      saldo_anterior: inventario.saldo,
      saldo_nuevo: nuevoSaldo,
      observaciones: `Movimiento de ${tipoMovimiento.toLowerCase()}`
    };

    data.kardex.push(kardex);
    setLocalStorageData(data);
    
    return true;
  }

  static getKardexByProducto(productoId: string, tiendaId?: string): Kardex[] {
    const data = getLocalStorageData();
    let kardex = data.kardex.filter(k => k.producto_id === productoId);
    
    if (tiendaId) {
      kardex = kardex.filter(k => k.tienda_id === tiendaId);
    }
    
    return kardex.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  static getMovimientosRecientes(tiendaId?: string, limite: number = 50): Kardex[] {
    const data = getLocalStorageData();
    let kardex = data.kardex;
    
    if (tiendaId) {
      kardex = kardex.filter(k => k.tienda_id === tiendaId);
    }
    
    return kardex
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limite);
  }
}


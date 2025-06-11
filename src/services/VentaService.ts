import { getLocalStorageData, setLocalStorageData, generateId } from "../data/localStorage";
import { Venta, DetalleVenta, TipoPagoEnum, EstadoVentaEnum, TipoMovimientoEnum } from "../types";
import { InventarioService } from "./InventarioService";
import { ProductoService } from "./ProductoService";

export class VentaService {
  static getAll(): Venta[] {
    const data = getLocalStorageData();
    return data.ventas;
  }

  static getById(id: string): Venta | undefined {
    const data = getLocalStorageData();
    return data.ventas.find((v) => v.id === id);
  }

  static getDetallesByVentaId(ventaId: string): DetalleVenta[] {
    const data = getLocalStorageData();
    return data.detalles_ventas.filter((dv) => dv.venta_id === ventaId);
  }

  static create(venta: Omit<Venta, "id" | "fecha_venta" | "total" | "estado">, detalles: Omit<DetalleVenta, "id" | "venta_id">[]): Venta {
    const data = getLocalStorageData();

    const newVenta: Venta = {
      ...venta,
      id: generateId(),
      fecha: new Date(),
      total: 0,
      estado: EstadoVentaEnum.Completada,
    };

    let totalVenta = 0;
    const newDetalles: DetalleVenta[] = [];

    for (const detalle of detalles) {
      const producto = ProductoService.getById(detalle.producto_id);
      if (!producto) {
        throw new Error(`Producto con ID ${detalle.producto_id} no encontrado.`);
      }

      // Check and update inventory
      const stockDisponible = InventarioService.getSaldoProducto(producto.id, newVenta.tienda_id);
      if (stockDisponible < detalle.cantidad) {
        throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Disponible: ${stockDisponible}, Solicitado: ${detalle.cantidad}`);
      }
      InventarioService.actualizarStock(producto.id, newVenta.tienda_id, detalle.cantidad, TipoMovimientoEnum.Venta);

      const subtotalDetalle = producto.precio * detalle.cantidad;
      totalVenta += subtotalDetalle;

      newDetalles.push({
        ...detalle,
        id: generateId(),
        venta_id: newVenta.id,
        precio_unitario: producto.precio,
        subtotal: subtotalDetalle,
      });
    }

    newVenta.total = totalVenta;

    data.ventas.push(newVenta);
    data.detalles_ventas.push(...newDetalles);
    setLocalStorageData(data);

    return newVenta;
  }

  static update(id: string, updates: Partial<Omit<Venta, "id">>): Venta | null {
    const data = getLocalStorageData();
    const index = data.ventas.findIndex((v) => v.id === id);
    if (index === -1) return null;

    data.ventas[index] = { ...data.ventas[index], ...updates };
    setLocalStorageData(data);
    return data.ventas[index];
  }

  static delete(id: string): boolean {
    const data = getLocalStorageData();
    const index = data.ventas.findIndex((v) => v.id === id);
    if (index === -1) return false;

    // Revert inventory for deleted sale
    const detalles = data.detalles_ventas.filter(dv => dv.venta_id === id);
    for (const detalle of detalles) {
      InventarioService.actualizarStock(detalle.producto_id, data.ventas[index].tienda_id, detalle.cantidad, TipoMovimientoEnum.Entrada); // Revert as an entry
    }

    data.ventas.splice(index, 1);
    data.detalles_ventas = data.detalles_ventas.filter(dv => dv.venta_id !== id);
    setLocalStorageData(data);
    return true;
  }

  static getVentasByFecha(fecha: Date): Venta[] {
    const data = getLocalStorageData();
    const fechaString = fecha.toISOString().split("T")[0];
    return data.ventas.filter(venta => {
      const fechaVentaString = (venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha)).toISOString().split("T")[0];
      return fechaVentaString === fechaString;
    });
  }

  static getIngresosMensuales(year: number, month: number): number {
    const data = getLocalStorageData();
    const ventasMes = data.ventas.filter(venta => {
      const ventaDate = new Date(venta.fecha);
      return ventaDate.getFullYear() === year && ventaDate.getMonth() === month - 1; // Month is 0-indexed
    });
    return ventasMes.reduce((sum, venta) => sum + venta.total, 0);
  }
}


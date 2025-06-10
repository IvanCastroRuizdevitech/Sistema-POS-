import React, { useState, useEffect } from 'react';
import { VentaService } from '../services/VentaService';
import { ProductoService } from '../services/ProductoService';
import { TiendaService } from '../services/TiendaService';
import { PersonaService } from '../services/PersonaService';
import { Venta, DetalleVenta, Producto, Tienda, Persona } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Calendar, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VentaReporte extends Venta {
  fecha_venta: string;
  cliente_nombre?: string;
  tienda_nombre?: string;
  empleado_nombre?: string;
  tipo_pago: string;
}

interface ReporteVentasDiarias {
  fecha: string;
  total_ventas: number;
  cantidad_ventas: number;
}

interface ReporteProductosMasVendidos {
  producto_nombre: string;
  cantidad_vendida: number;
  ingresos_totales: number;
}

export const ReportesPage: React.FC = () => {
  const { persona } = useAuth();
  const [ventas, setVentas] = useState<VentaReporte[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [selectedTienda, setSelectedTienda] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [reporteVentasDiarias, setReporteVentasDiarias] = useState<ReporteVentasDiarias[]>([]);
  const [reporteProductos, setReporteProductos] = useState<ReporteProductosMasVendidos[]>([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [promedioVenta, setPromedioVenta] = useState(0);

  useEffect(() => {
    loadTiendas();
    loadVentas();
  }, []);

  useEffect(() => {
    generateReports();
  }, [ventas, selectedTienda, fechaInicio, fechaFin]);

  const loadTiendas = () => {
    setTiendas(TiendaService.getAll());
  };

  const loadVentas = () => {
    const allVentas = VentaService.getAll();
    const ventasConInfo = allVentas.map(venta => {
      const cliente = venta.cliente_id ? PersonaService.getById(venta.cliente_id) : null;
      const tienda = TiendaService.getById(venta.tienda_id);
      const empleado = PersonaService.getById(venta.vendedor_id);
      
      return {
        ...venta,
        fecha_venta: venta.fecha instanceof Date ? venta.fecha.toISOString() : venta.fecha || '',
        cliente_nombre: cliente ? cliente.nombre : 'Consumidor Final',
        tienda_nombre: tienda?.nombre || 'Tienda Desconocida',
        empleado_nombre: empleado ? empleado.nombre : 'Empleado Desconocido',
        tipo_pago: venta.metodo_pago_id ?? 'Desconocido',
      };
    });
    setVentas(ventasConInfo);
  };

  const generateReports = () => {
    let ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha_venta);
      const dentroRangoFecha = fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      const dentroTienda = !selectedTienda || venta.tienda_id === selectedTienda;
      return dentroRangoFecha && dentroTienda;
    });

    // Calcular métricas generales
    setTotalVentas(ventasFiltradas.length);
    const ingresosTotales = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
    setTotalIngresos(ingresosTotales);
    setPromedioVenta(ventasFiltradas.length > 0 ? ingresosTotales / ventasFiltradas.length : 0);

    // Generar reporte de ventas diarias
    const ventasPorDia: { [key: string]: { total: number; cantidad: number } } = {};
    ventasFiltradas.forEach(venta => {
      const fecha = new Date(venta.fecha_venta).toISOString().split('T')[0];
      if (!ventasPorDia[fecha]) {
        ventasPorDia[fecha] = { total: 0, cantidad: 0 };
      }
      ventasPorDia[fecha].total += venta.total;
      ventasPorDia[fecha].cantidad += 1;
    });

    const reporteDiario = Object.entries(ventasPorDia)
      .map(([fecha, data]) => ({
        fecha,
        total_ventas: data.total,
        cantidad_ventas: data.cantidad,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    setReporteVentasDiarias(reporteDiario);

    // Generar reporte de productos más vendidos
    const productoVentas: { [key: string]: { cantidad: number; ingresos: number; nombre: string } } = {};
    ventasFiltradas.forEach(venta => {
      const detalles = VentaService.getDetallesByVentaId(venta.id);
      detalles.forEach(detalle => {
        const producto = ProductoService.getById(detalle.producto_id);
        if (producto) {
          if (!productoVentas[detalle.producto_id]) {
            productoVentas[detalle.producto_id] = { cantidad: 0, ingresos: 0, nombre: producto.nombre };
          }
          productoVentas[detalle.producto_id].cantidad += detalle.cantidad;
          productoVentas[detalle.producto_id].ingresos += detalle.subtotal;
        }
      });
    });

    const reporteProductosMasVendidos = Object.values(productoVentas)
      .map(data => ({
        producto_nombre: data.nombre,
        cantidad_vendida: data.cantidad,
        ingresos_totales: data.ingresos,
      }))
      .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
      .slice(0, 10);
    setReporteProductos(reporteProductosMasVendidos);
  };

  const exportToCSV = () => {
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha_venta);
      const dentroRangoFecha = fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      const dentroTienda = !selectedTienda || venta.tienda_id === selectedTienda;
      return dentroRangoFecha && dentroTienda;
    });

    const csvContent = [
      ['ID Venta', 'Fecha', 'Cliente', 'Tienda', 'Empleado', 'Método Pago', 'Total'].join(','),
      ...ventasFiltradas.map(venta => [
        venta.id,
        new Date(venta.fecha_venta).toLocaleDateString(),
        venta.cliente_nombre,
        venta.tienda_nombre,
        venta.empleado_nombre,
        venta.tipo_pago,
        venta.total.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${fechaInicio.toISOString().split('T')[0]}_${fechaFin.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes y Analytics</h1>
        <Button
          onClick={exportToCSV}
          className="flex items-center gap-2"
          variant="default"
          size="default"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="">
          <CardTitle>Filtros de Reporte</CardTitle>
          <CardDescription>Seleccione los criterios para generar los reportes</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="tienda">Tienda</Label>
            <Select value={selectedTienda} onValueChange={setSelectedTienda}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las tiendas" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="" className="">Todas las tiendas</SelectItem>
                {tiendas.map(tienda => (
                  <SelectItem key={tienda.id} value={tienda.id} className="">
                    {tienda.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
            <Input
              type="date"
              value={fechaInicio.toISOString().split('T')[0]}
              onChange={(e) => setFechaInicio(new Date(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="fecha-fin">Fecha Fin</Label>
            <Input
              type="date"
              value={fechaFin.toISOString().split('T')[0]}
              onChange={(e) => setFechaFin(new Date(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIngresos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">En el período seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVentas}</div>
            <p className="text-xs text-muted-foreground">Transacciones realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioVenta.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor promedio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reporteProductos.reduce((sum, p) => sum + p.cantidad_vendida, 0)}</div>
            <p className="text-xs text-muted-foreground">Unidades totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="">
            <CardTitle>Ventas Diarias</CardTitle>
            <CardDescription>Evolución de las ventas en el tiempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reporteVentasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_ventas" stroke="#8884d8" name="Ingresos ($)" />
                <Line type="monotone" dataKey="cantidad_ventas" stroke="#82ca9d" name="Cantidad Ventas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="">
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Top 10 productos por cantidad vendida</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reporteProductos.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto_nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad_vendida" fill="#8884d8" name="Cantidad Vendida" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de ventas recientes */}
      <Card>
        <CardHeader className="">
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Últimas transacciones en el período seleccionado</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tienda</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas
                .filter(venta => {
                  const fechaVenta = new Date(venta.fecha_venta);
                  const dentroRangoFecha = fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
                  const dentroTienda = !selectedTienda || venta.tienda_id === selectedTienda;
                  return dentroRangoFecha && dentroTienda;
                })
                .slice(0, 10)
                .map(venta => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-medium">{venta.id.substring(0, 8)}</TableCell>
                    <TableCell>{new Date(venta.fecha_venta).toLocaleDateString()}</TableCell>
                    <TableCell>{venta.cliente_nombre}</TableCell>
                    <TableCell>{venta.tienda_nombre}</TableCell>
                    <TableCell>{venta.empleado_nombre}</TableCell>
                    <TableCell>{venta.tipo_pago}</TableCell>
                    <TableCell className="text-right">${venta.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabla de productos más vendidos */}
      <Card>
        <CardHeader className="">
          <CardTitle>Ranking de Productos</CardTitle>
          <CardDescription>Productos ordenados por cantidad vendida</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posición</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad Vendida</TableHead>
                <TableHead className="text-right">Ingresos Totales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reporteProductos.map((producto, index) => (
                <TableRow key={producto.producto_nombre}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{producto.producto_nombre}</TableCell>
                  <TableCell className="text-right">{producto.cantidad_vendida}</TableCell>
                  <TableCell className="text-right">${producto.ingresos_totales.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


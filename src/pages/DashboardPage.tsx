import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { VentaService } from '../services/VentaService';
import { ProductoService } from '../services/ProductoService';
import { PersonaService } from '../services/PersonaService';
import { InventarioService } from '../services/InventarioService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Mail, 
  Shield, 
  Building, 
  LogOut, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, persona, rol, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para las métricas
  const [ventasHoy, setVentasHoy] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [ventasRecientes, setVentasRecientes] = useState<any[]>([]);
  const [productosPopulares, setProductosPopulares] = useState<any[]>([]);
  const [clientesRecientes, setClientesRecientes] = useState<any[]>([]);
  const [productosBajoStock, setProductosBajoStock] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Cargar ventas de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ventas = VentaService.getAll();
    const ventasDelDia = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      fechaVenta.setHours(0, 0, 0, 0);
      return fechaVenta.getTime() === hoy.getTime();
    });
    const totalVentasHoy = ventasDelDia.reduce((sum, venta) => sum + venta.total, 0);
    setVentasHoy(totalVentasHoy);

    // Cargar total de productos
    const productos = ProductoService.getAll();
    setTotalProductos(productos.length);

    // Cargar total de clientes
    const clientes = PersonaService.getClientes();
    setTotalClientes(clientes.length);

    // Cargar ventas recientes (últimas 5)
    const ventasOrdenadas = ventas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
    setVentasRecientes(ventasOrdenadas);

    // Cargar productos más vendidos
    const detallesVentas = VentaService.getAllDetalles();
    const productosVendidos = detallesVentas.reduce((acc, detalle) => {
      if (acc[detalle.producto_id]) {
        acc[detalle.producto_id] += detalle.cantidad;
      } else {
        acc[detalle.producto_id] = detalle.cantidad;
      }
      return acc;
    }, {} as Record<string, number>);

    const productosPopularesArray = Object.entries(productosVendidos)
      .map(([productoId, cantidad]) => {
        const producto = productos.find(p => p.id === productoId);
        return {
          producto: producto?.nombre || 'Producto Desconocido',
          cantidad
        };
      })
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
    setProductosPopulares(productosPopularesArray);

    // Cargar clientes recientes (últimos 5)
    const clientesOrdenados = clientes
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .slice(0, 5);
    setClientesRecientes(clientesOrdenados);

    // Cargar productos con bajo stock
    const inventarios = InventarioService.getAll();
    const productosBajoStockArray = inventarios
      .filter(inv => inv.saldo <= 10)
      .map(inv => {
        const producto = productos.find(p => p.id === inv.producto_id);
        return {
          producto: producto?.nombre || 'Producto Desconocido',
          stock: inv.saldo
        };
      })
      .slice(0, 5);
    setProductosBajoStock(productosBajoStockArray);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getClienteNombre = (clienteId?: string) => {
    if (!clienteId) return 'Consumidor Final';
    const cliente = PersonaService.getById(clienteId);
    return cliente?.nombre || 'Cliente Desconocido';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido al Sistema POS</p>
          </div>
          <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{persona?.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <Badge variant={rol?.nombre === 'Administrador' ? 'default' : 'secondary'}>
                    {rol?.nombre}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge variant="outline" className="text-green-600">
                    Activo
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('/ventas')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Ventas
              </CardTitle>
              <CardDescription>Gestionar ventas y POS</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ir a Ventas</Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('/inventario')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario
              </CardTitle>
              <CardDescription>Gestionar productos y stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Ver Inventario</Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('/reportes')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reportes
              </CardTitle>
              <CardDescription>Análisis y reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Ver Reportes</Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('/configuracion')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>Gestionar sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Configurar</Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Ventas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(ventasHoy)}</div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Ingresos del día
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalProductos}</div>
              <p className="text-xs text-gray-500">Total en catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalClientes}</div>
              <p className="text-xs text-gray-500">Registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventas Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Ventas Recientes
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('/reportes')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver todas
                </Button>
              </CardTitle>
              <CardDescription>Últimas 5 transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              {ventasRecientes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay ventas registradas</p>
                </div>
              ) : (
                <ResponsiveTable>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Cliente</TableHead>
                        <TableHead className="min-w-[100px]">Total</TableHead>
                        <TableHead className="min-w-[140px]">Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ventasRecientes.map((venta) => (
                        <TableRow key={venta.id}>
                          <TableCell className="font-medium">
                            {getClienteNombre(venta.cliente_id)}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(venta.total)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(venta.fecha)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTable>
              )}
            </CardContent>
          </Card>

          {/* Productos Populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productos Populares
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('/productos')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver todos
                </Button>
              </CardTitle>
              <CardDescription>Más vendidos</CardDescription>
            </CardHeader>
            <CardContent>
              {productosPopulares.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay datos de ventas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productosPopulares.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.producto}</span>
                      <Badge variant="outline">{item.cantidad} vendidos</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clientes Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('/clientes')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver todos
                </Button>
              </CardTitle>
              <CardDescription>Clientes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              {clientesRecientes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay clientes registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientesRecientes.map((cliente) => (
                    <div key={cliente.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{cliente.nombre}</p>
                        <p className="text-sm text-gray-500">{cliente.numero_identificacion}</p>
                      </div>
                      <Badge variant="outline">{cliente.telefono || 'Sin teléfono'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productos con Bajo Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Stock Bajo
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('/inventario')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver inventario
                </Button>
              </CardTitle>
              <CardDescription>Productos que requieren reposición</CardDescription>
            </CardHeader>
            <CardContent>
              {productosBajoStock.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Todos los productos tienen stock suficiente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productosBajoStock.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="font-medium">{item.producto}</span>
                      <Badge variant="destructive">{item.stock} unidades</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


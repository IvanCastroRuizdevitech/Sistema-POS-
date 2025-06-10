import React, { useState, useEffect } from 'react';
import { InventarioService } from '../services/InventarioService';
import { ProductoService } from '../services/ProductoService';
import { TiendaService } from '../services/TiendaService';
import { Inventario, Producto, Tienda, TipoMovimientoEnum } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';

export const InventarioPage: React.FC = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [selectedTienda, setSelectedTienda] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMovimientoDialogOpen, setIsMovimientoDialogOpen] = useState(false);
  const [movimientoData, setMovimientoData] = useState({
    producto_id: '',
    tienda_id: '',
    cantidad: '',
    tipo_movimiento: TipoMovimientoEnum.Entrada,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadInventarios = () => {
    if (selectedTienda && selectedTienda !== 'all') {
      setInventarios(InventarioService.getByTienda(selectedTienda));
      console.log('Inventarios cargados por tienda:', inventarios , 'con filtro de tienda:', selectedTienda);
    } else {
      setInventarios(InventarioService.getAll());
      console.log('Inventarios cargados por tienda:', inventarios , 'sin filtro de tienda');
    }
  };

  const loadProductos = () => {
    setProductos(ProductoService.getAll());
    console.log('Productos cargados:', productos);
  };

  const loadTiendas = () => {
    setTiendas(TiendaService.getAll());
    console.log('Tiendas cargadas:', tiendas);
  };

  const getProductoNombre = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    return producto?.nombre || 'Producto no encontrado';
  };

  const getProductoCategoria = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    return producto?.categoria || '';
  };

  const getTiendaNombre = (tiendaId: string) => {
    const tienda = tiendas.find(t => t.id === tiendaId);
    return tienda?.nombre || 'Tienda no encontrada';
  };

  const getInventarioConProducto = () => {
    return inventarios.map(inv => {
      const producto = productos.find(p => p.id === inv.producto_id);
      return {
        ...inv,
        producto: producto
      };
    }).filter(item => {
      if (!item.producto) return false;
      const matchesSearch = item.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getProductosBajoStock = () => {
    return InventarioService.getProductosBajoStock(selectedTienda, 10);
  };

  const handleMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cantidad = parseInt(movimientoData.cantidad);
      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      InventarioService.actualizarStock(
        movimientoData.producto_id,
        movimientoData.tienda_id,
        cantidad,
        movimientoData.tipo_movimiento
      );
      
      loadInventarios();
      setIsMovimientoDialogOpen(false);
      resetMovimientoForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  const resetMovimientoForm = () => {
    setMovimientoData({
      producto_id: '',
      tienda_id: '',
      cantidad: '',
      tipo_movimiento: TipoMovimientoEnum.Entrada,
    });
    setError('');
  };

  const handleMovimientoDialogClose = () => {
    setIsMovimientoDialogOpen(false);
    resetMovimientoForm();
  };

  const inventarioConProducto = getInventarioConProducto();
  const productosBajoStock = getProductosBajoStock();

  useEffect(() => {
    loadInventarios();
    loadProductos();
    loadTiendas();
  }, []);

  useEffect(() => {
    loadInventarios();
  }, [selectedTienda]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-600">Gestión de stock y movimientos</p>
        </div>
        <Dialog open={isMovimientoDialogOpen} onOpenChange={setIsMovimientoDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsMovimientoDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
              <DialogDescription>
                Registre una entrada o salida de productos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMovimiento}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tienda_id">Tienda *</Label>
                  <Select
                    value={movimientoData.tienda_id}
                    onValueChange={(value) => setMovimientoData({ ...movimientoData, tienda_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una tienda" />
                    </SelectTrigger>
                    <SelectContent value="all" className="">
                      {tiendas.map((tienda) => (
                        <SelectItem key={tienda.id} value={tienda.id} className="">
                          {tienda.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="producto_id">Producto *</Label>
                  <Select
                    value={movimientoData.producto_id}
                    onValueChange={(value) => setMovimientoData({ ...movimientoData, producto_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent className="">
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id} className="">
                          {producto.nombre} - {producto.categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipo_movimiento">Tipo de Movimiento *</Label>
                  <Select
                    value={movimientoData.tipo_movimiento}
                    onValueChange={(value) => setMovimientoData({ ...movimientoData, tipo_movimiento: value as TipoMovimientoEnum })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value={TipoMovimientoEnum.Entrada} className="">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          Entrada
                        </div>
                      </SelectItem>
                      <SelectItem value={TipoMovimientoEnum.Salida} className="">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Salida
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cantidad">Cantidad *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={movimientoData.cantidad}
                    onChange={(e) => setMovimientoData({ ...movimientoData, cantidad: e.target.value })}
                    placeholder="Cantidad"
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleMovimientoDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Procesando...' : 'Registrar Movimiento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts for low stock */}
      {productosBajoStock.length > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="">
            <strong>Alerta de Stock Bajo:</strong> {productosBajoStock.length} producto(s) con stock bajo (≤10 unidades)
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={selectedTienda} onValueChange={setSelectedTienda}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="all" className="">Todas las tiendas</SelectItem>
                  {tiendas.map((tienda) => (
                    <SelectItem key={tienda.id} value={tienda.id} className="">
                      {tienda.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock de Productos
          </CardTitle>
          <CardDescription>
            {inventarioConProducto.length} producto(s) en inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inventarioConProducto.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay productos en inventario</p>
              <p className="text-sm text-gray-400">Registre movimientos de entrada para comenzar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tienda</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventarioConProducto.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {getProductoNombre(item.producto_id)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getProductoCategoria(item.producto_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTiendaNombre(item.tienda_id)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${item.saldo <= 10 ? 'text-red-600' : item.saldo <= 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {item.saldo}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.saldo <= 10 ? (
                        <Badge variant="destructive">Stock Bajo</Badge>
                      ) : item.saldo <= 20 ? (
                        <Badge variant="secondary">Stock Medio</Badge>
                      ) : (
                        <Badge variant="default">Stock Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


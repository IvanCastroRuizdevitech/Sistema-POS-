import React, { useState, useEffect } from 'react';
import { ProductoService } from '../services/ProductoService';
import { InventarioService } from '../services/InventarioService';
import { VentaService } from '../services/VentaService';
import { TiendaService } from '../services/TiendaService';
import { PersonaService } from '../services/PersonaService';
import { Producto, DetalleVenta, TipoPagoEnum, Venta, Persona, Tienda } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, ShoppingCart, DollarSign, CreditCard, Banknote, Receipt, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CartItem extends Producto {
  cantidad: number;
}

export const POSPage: React.FC = () => {
  const { persona } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<TipoPagoEnum>(TipoPagoEnum.Efectivo);
  const [clientes, setClientes] = useState<Persona[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [selectedTienda, setSelectedTienda] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [reciboVenta, setReciboVenta] = useState<Venta | null>(null);

  useEffect(() => {
    loadProductos();
    loadClientes();
    loadTiendas();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const loadProductos = () => {
    setProductos(ProductoService.getAll());
  };

  const loadClientes = () => {
    setClientes(PersonaService.getClientes());
  };

  const loadTiendas = () => {
    setTiendas(TiendaService.getAll());
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (producto: Producto) => {
    if (!selectedTienda) {
      setError('Por favor, seleccione una tienda antes de agregar productos al carrito.');
      return;
    }

    const existingItem = cart.find(item => item.id === producto.id);
    const stockDisponible = InventarioService.getSaldoProducto(producto.id, selectedTienda);

    if (existingItem) {
      if (existingItem.cantidad + 1 > stockDisponible) {
        setError(`Stock insuficiente para ${producto.nombre}. Disponible: ${stockDisponible}`);
        return;
      }
      setCart(cart.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      if (1 > stockDisponible) {
        setError(`Stock insuficiente para ${producto.nombre}. Disponible: ${stockDisponible}`);
        return;
      }
      setCart([...cart, { ...producto, cantidad: 1 }]);
    }
    setError('');
  };

  const removeFromCart = (productoId: string) => {
    setCart(cart.filter(item => item.id !== productoId));
  };

  const updateCartQuantity = (productoId: string, cantidad: number) => {
    if (!selectedTienda) {
      setError('Por favor, seleccione una tienda antes de modificar la cantidad.');
      return;
    }

    const stockDisponible = InventarioService.getSaldoProducto(productoId, selectedTienda);
    if (cantidad > stockDisponible) {
      setError(`Stock insuficiente. Disponible: ${stockDisponible}`);
      return;
    }

    if (cantidad <= 0) {
      setCart(cart.filter(item => item.id !== productoId));
    } else {
      setCart(cart.map(item =>
        item.id === productoId ? { ...item, cantidad: cantidad } : item
      ));
    }
    setError('');
  };

  const calculateTotal = () => {
    const newTotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    setTotal(newTotal);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('El carrito está vacío. Agregue productos para realizar una venta.');
      return;
    }
    if (!selectedTienda) {
      setError('Por favor, seleccione una tienda para la venta.');
      return;
    }
    setIsCheckoutOpen(true);
    setError('');
  };

  const finalizeSale = () => {
    if (!selectedTienda) {
      setError('Debe seleccionar una tienda para finalizar la venta.');
      return;
    }

    try {
      const detallesVenta: Omit<DetalleVenta, 'id' | 'venta_id'>[] = cart.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio, // This will be overwritten by service, but good for type safety
        subtotal: item.precio * item.cantidad, // This will be overwritten by service
      }));

      const newVenta: Omit<Venta, 'id' | 'fecha_venta' | 'total' | 'estado'> = {
        cliente_id: selectedCliente || null,
        empleado_id: persona?.id || 'unknown',
        tienda_id: selectedTienda,
        tipo_pago: selectedPaymentMethod,
      };

      const ventaRegistrada = VentaService.create(newVenta, detallesVenta);
      setReciboVenta(ventaRegistrada);
      setVentaExitosa(true);
      setCart([]);
      setTotal(0);
      setIsCheckoutOpen(false);
      setError('');
      loadProductos(); // Refresh product stock display
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar la venta.');
      setVentaExitosa(false);
    }
  };

  const closeReceipt = () => {
    setVentaExitosa(false);
    setReciboVenta(null);
  };

  const getClienteNombre = (clienteId: string | null) => {
    if (!clienteId) return 'Consumidor Final';
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Consumidor Final';
  };

  const getProductoNombre = (productoId: string) => {
    const producto = ProductoService.getById(productoId);
    return producto?.nombre || 'Producto Desconocido';
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Product List */}
      <div className="w-2/3 p-4 border-r border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Punto de Venta</h1>
        
        <div className="mb-4 flex items-center gap-4">
          <Select
            value={selectedTienda || ''}
            onValueChange={(value) => {
              setSelectedTienda(value);
              setCart([]); // Clear cart when changing store
              setError('');
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Tienda" />
            </SelectTrigger>
            <SelectContent>
              {tiendas.map(tienda => (
                <SelectItem key={tienda.id} value={tienda.id}>
                  {tienda.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

        <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-180px)] pr-2">
          {filteredProductos.map(producto => (
            <Card 
              key={producto.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(producto)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                <p className="text-sm text-gray-500">{producto.categoria}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-xl font-bold">${producto.precio.toFixed(2)}</span>
                <span className="text-sm text-gray-600">
                  Stock: {selectedTienda ? InventarioService.getSaldoProducto(producto.id, selectedTienda) : 'N/A'}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="w-1/3 p-4 bg-white flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>El carrito está vacío</p>
              <p className="text-sm">Agregue productos desde la lista</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                        className="w-20 text-center inline-block"
                      />
                    </TableCell>
                    <TableCell className="text-right">${(item.precio * item.cantidad).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-3xl font-bold text-green-600">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full py-3 text-lg" onClick={handleCheckout} disabled={cart.length === 0 || !selectedTienda}>
            <DollarSign className="h-6 w-6 mr-2" />
            Pagar
          </Button>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Venta</DialogTitle>
            <DialogDescription>Seleccione el método de pago y el cliente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Productos:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell className="text-right">${(item.precio * item.cantidad).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right text-xl font-bold mt-2">Total: ${total.toFixed(2)}</div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Método de Pago:</h3>
              <Select value={selectedPaymentMethod} onValueChange={(value: TipoPagoEnum) => setSelectedPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoPagoEnum.Efectivo}>
                    <div className="flex items-center gap-2"><Banknote className="h-4 w-4" /> Efectivo</div>
                  </SelectItem>
                  <SelectItem value={TipoPagoEnum.Transferencia}>
                    <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Transferencia</div>
                  </SelectItem>
                  <SelectItem value={TipoPagoEnum.Tarjeta}>
                    <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Tarjeta</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cliente:</h3>
              <Select value={selectedCliente || ''} onValueChange={(value) => setSelectedCliente(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Cliente (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Consumidor Final</SelectItem>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido} ({cliente.identificacion})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancelar</Button>
            <Button onClick={finalizeSale}>Confirmar Venta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={ventaExitosa} onOpenChange={setVentaExitosa}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2"><CheckCircle className="h-6 w-6" /> Venta Exitosa</DialogTitle>
            <DialogDescription>El recibo de su venta es el siguiente:</DialogDescription>
          </DialogHeader>
          {reciboVenta && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recibo de Venta #{reciboVenta.id?.substring(0, 8)}</CardTitle>
                <p className="text-sm text-gray-500">Fecha: {new Date(reciboVenta.fecha_venta).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Tienda: {getTiendaNombre(reciboVenta.tienda_id)}</p>
                <p className="text-sm text-gray-500">Cliente: {getClienteNombre(reciboVenta.cliente_id)}</p>
                <p className="text-sm text-gray-500">Vendedor: {persona?.nombre} {persona?.apellido}</p>
                <p className="text-sm text-gray-500">Método de Pago: {reciboVenta.tipo_pago}</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VentaService.getDetallesByVentaId(reciboVenta.id).map(detalle => (
                      <TableRow key={detalle.id}>
                        <TableCell>{getProductoNombre(detalle.producto_id)}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell className="text-right">${detalle.precio_unitario.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${detalle.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right text-2xl font-bold mt-4">Total: ${reciboVenta.total.toFixed(2)}</div>
              </CardContent>
            </Card>
          )}
          <DialogFooter>
            <Button onClick={closeReceipt}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


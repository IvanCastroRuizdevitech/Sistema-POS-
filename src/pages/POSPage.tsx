import React, { useState, useEffect } from 'react';
import { ProductoService } from '../services/ProductoService';
import { InventarioService } from '../services/InventarioService';
import { VentaService } from '../services/VentaService';
import { TiendaService } from '../services/TiendaService';
import { PersonaService } from '../services/PersonaService';
import { Producto, DetalleVenta, Venta, Persona, Tienda, TipoPagoEnum } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Search, ShoppingCart, DollarSign, CreditCard, Banknote, Receipt, XCircle, CheckCircle, Plus, Minus, Trash2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CartItem extends Producto {
  cantidad: number;
}

export const POSPage: React.FC = () => {
  const { persona } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<TipoPagoEnum>(TipoPagoEnum.Efectivo);
  const [clientes, setClientes] = useState<Persona[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [selectedTienda, setSelectedTienda] = useState<string>('all');
  const [error, setError] = useState('');
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [reciboVenta, setReciboVenta] = useState<Venta | null>(null);

  useEffect(() => {
    loadProductos();
    loadClientes();
    loadTiendas();
  }, []);

  useEffect(() => {
    calculateTotals();
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

  const categories = Array.from(new Set(productos.map(p => p.categoria)));

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      removeFromCart(productoId);
    } else {
      setCart(cart.map(item =>
        item.id === productoId ? { ...item, cantidad: cantidad } : item
      ));
    }
    setError('');
  };

  const calculateTotals = () => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const newImpuestos = newSubtotal * 0.19; // 19% IVA
    const newTotal = newSubtotal + newImpuestos;
    
    setSubtotal(newSubtotal);
    setImpuestos(newImpuestos);
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
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad,
      }));

      const newVenta: Omit<Venta, 'id' | 'fecha_venta' | 'estado'>= {
        cliente_id: selectedCliente || undefined,
        vendedor_id: persona?.id || 'unknown',
        tienda_id: selectedTienda,
        metodo_pago_id: selectedPaymentMethod,
        subtotal: subtotal,
        fecha: new Date(),
        impuestos: impuestos,
        total: total,
      };

      const ventaRegistrada = VentaService.create(newVenta, detallesVenta);
      setReciboVenta(ventaRegistrada);
      setVentaExitosa(true);
      setCart([]);
      setSubtotal(0);
      setImpuestos(0);
      setTotal(0);
      setIsCheckoutOpen(false);
      setError('');
      loadProductos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar la venta.');
      setVentaExitosa(false);
    }
  };

  const closeReceipt = () => {
    setVentaExitosa(false);
    setReciboVenta(null);
  };

  const getClienteNombre = (clienteId?: string) => {
    if (!clienteId) return 'Consumidor Final';
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Consumidor Final';
  };

  const getTiendaNombre = (tiendaId: string) => {
    const tienda = tiendas.find(t => t.id === tiendaId);
    return tienda ? tienda.nombre : 'Tienda Desconocida';
  };

  const getMetodoPagoNombre = (metodoId: string) => {
    const metodos = {
      '1': 'Efectivo',
      '2': 'Transferencia',
      '3': 'Tarjeta de Crédito',
      '4': 'Tarjeta de Débito'
    };
    return metodos[metodoId as keyof typeof metodos] || 'Desconocido';
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Panel de Productos */}
      <div className="flex-1 lg:w-2/3 p-4 lg:border-r border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Punto de Venta
          </h1>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              value={selectedTienda}
              onValueChange={(value) => {
                setSelectedTienda(value);
                setCart([]);
                setError('');
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Seleccionar Tienda" />
              </SelectTrigger>
              <SelectContent className="">
                {tiendas.map(tienda => (
                  <SelectItem key={tienda.id} value={tienda.id} className="">
                    {tienda.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all" className="">Todas las categorías</SelectItem>
                {categories.map((categoria, index) => (
                  <SelectItem key={index} value={categoria} className="">
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] pr-2">
          {filteredProductos.map(producto => {
            const stock = selectedTienda ? InventarioService.getSaldoProducto(producto.id, selectedTienda) : 0;
            const isOutOfStock = stock <= 0;
            
            return (
              <Card 
                key={producto.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:scale-105'
                }`}
                onClick={() => !isOutOfStock && addToCart(producto)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm lg:text-base line-clamp-2">{producto.nombre}</CardTitle>
                  <Badge variant="outline" className="w-fit text-xs">
                    {producto.categoria}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg lg:text-xl font-bold text-green-600">
                      ${producto.precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Stock: {selectedTienda ? stock : 'N/A'}</span>
                    {isOutOfStock && <Badge variant="destructive" className="text-xs">Agotado</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Panel del Carrito */}
      <div className="w-full lg:w-1/3 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Carrito ({cart.length})
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">El carrito está vacío</p>
              <p className="text-sm">Agregue productos desde la lista</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <Card key={item.id} className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                      {item.nombre}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.cantidad - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.cantidad + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500">${item.precio.toFixed(2)} c/u</p>
                      <p className="font-bold text-green-600">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Resumen y Pago */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Impuestos (19%):</span>
              <span>${impuestos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            className="w-full py-3 text-lg" 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || !selectedTienda}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Procesar Pago
          </Button>
        </div>
      </div>

      {/* Dialog de Checkout */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Finalizar Venta
            </DialogTitle>
            <DialogDescription>
              Revise los detalles de la venta y seleccione el método de pago.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Resumen de Productos */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Productos:</h3>
              <ResponsiveTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Producto</TableHead>
                      <TableHead className="min-w-[80px] text-center">Cant.</TableHead>
                      <TableHead className="min-w-[100px] text-right">Precio Unit.</TableHead>
                      <TableHead className="min-w-[100px] text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nombre}</TableCell>
                        <TableCell className="text-center">{item.cantidad}</TableCell>
                        <TableCell className="text-right">${item.precio.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTable>
              
              <div className="mt-4 space-y-2 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (19%):</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Método de Pago:</h3>
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

            {/* Cliente */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cliente:</h3>
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Consumidor Final" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="all" className="">Consumidor Final</SelectItem>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id} className="">
                      {cliente.nombre} ({cliente.numero_identificacion})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="">{error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={finalizeSale} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Recibo */}
      <Dialog open={ventaExitosa} onOpenChange={closeReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> 
              ¡Venta Exitosa!
            </DialogTitle>
            <DialogDescription>
              La venta se ha procesado correctamente.
            </DialogDescription>
          </DialogHeader>
          
          {reciboVenta && (
            <div className="space-y-4">
              <Card className="p-4">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">RECIBO DE VENTA</h3>
                  <p className="text-sm text-gray-600">#{reciboVenta.id?.substring(0, 8)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(reciboVenta.fecha).toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tienda:</span>
                    <span>{getTiendaNombre(reciboVenta.tienda_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span>{getClienteNombre(reciboVenta.cliente_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Método de Pago:</span>
                    <span>{getMetodoPagoNombre(reciboVenta.metodo_pago_id)}</span>
                  </div>
                </div>
                
                <div className="border-t mt-4 pt-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${reciboVenta.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos:</span>
                    <span>${reciboVenta.impuestos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${reciboVenta.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={closeReceipt} className="w-full">
              <Receipt className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


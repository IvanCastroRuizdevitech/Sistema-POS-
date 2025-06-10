import React, { useState, useEffect } from 'react';
import { ProductoService } from '../services/ProductoService';
import { UnidadService } from '../services/UnidadService';
import { ImpuestoService } from '../services/ImpuestoService';
import { Producto, Unidad, Impuesto } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';

export const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [impuestos, setImpuestos] = useState<Impuesto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    unidad_id: '',
    impuesto_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Loading productos...");
    loadProductos();
    loadUnidades();
    loadImpuestos();
    loadCategorias();
  }, []);

  const loadProductos = () => {
    setProductos(ProductoService.getAll());
  };

  const loadUnidades = () => {
    setUnidades(UnidadService.getAll());
  };

  const loadImpuestos = () => {
    setImpuestos(ImpuestoService.getAll());
  };

  const loadCategorias = () => {
    setCategorias(ProductoService.getCategorias());
  };

  const getUnidadNombre = (unidadId: string) => {
    const unidad = unidades.find(u => u.id === unidadId);
    return unidad?.nombre || 'Sin unidad';
  };

  const getImpuestoNombre = (impuestoId: string) => {
    const impuesto = impuestos.find(i => i.id === impuestoId);
    return impuesto?.nombre || 'Sin impuesto';
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === '' || producto.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
      };

      if (editingProducto) {
        ProductoService.update(editingProducto.id, productoData);
      } else {
        ProductoService.create(productoData);
      }
      
      loadProductos();
      loadCategorias();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      unidad_id: producto.unidad_id,
      impuesto_id: producto.impuesto_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        ProductoService.delete(id);
        loadProductos();
        loadCategorias();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      precio: '',
      unidad_id: '',
      impuesto_id: '',
    });
    setEditingProducto(null);
    setError('');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestión de productos y catálogo</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                {editingProducto 
                  ? 'Modifique los datos del producto' 
                  : 'Complete los datos para crear un nuevo producto'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Categoría del producto"
                    list="categorias"
                    required
                  />
                  <datalist id="categorias">
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="precio">Precio *</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unidad_id">Unidad *</Label>
                  <Select
                    value={formData.unidad_id}
                    onValueChange={(value) => setFormData({ ...formData, unidad_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidad) => (
                        <SelectItem key={unidad.id} value={unidad.id}>
                          {unidad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="impuesto_id">Impuesto *</Label>
                  <Select
                    value={formData.impuesto_id}
                    onValueChange={(value) => setFormData({ ...formData, impuesto_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un impuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      {impuestos.map((impuesto) => (
                        <SelectItem key={impuesto.id} value={impuesto.id}>
                          {impuesto.nombre} ({impuesto.porcentaje}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : (editingProducto ? 'Actualizar' : 'Crear')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {categorias.map((categoria, index) => (
                    <SelectItem key={index} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Productos
          </CardTitle>
          <CardDescription>
            {filteredProductos.length} producto(s) {searchTerm || selectedCategoria ? 'encontrado(s)' : 'registrado(s)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedCategoria ? 'No se encontraron productos' : 'No hay productos registrados'}
              </p>
              <p className="text-sm text-gray-400">
                {searchTerm || selectedCategoria ? 'Intente con otros términos de búsqueda' : 'Haga clic en "Nuevo Producto" para comenzar'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Impuesto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>${producto.precio.toFixed(2)}</TableCell>
                    <TableCell>{getUnidadNombre(producto.unidad_id)}</TableCell>
                    <TableCell>{getImpuestoNombre(producto.impuesto_id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(producto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(producto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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


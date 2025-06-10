import React, { useState, useEffect } from 'react';
import { PersonaService } from '../services/PersonaService';
import { Persona, TipoPersonaEnum, TipoIdentificacion } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Truck, Search } from 'lucide-react';
import { getLocalStorageData } from '../data/localStorage';

export const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Persona[]>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Persona | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    tipo_identificacion_id: '',
    numero_identificacion: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProveedores();
    loadTiposIdentificacion();
  }, []);

  const loadProveedores = () => {
    setProveedores(PersonaService.getProveedores());
  };

  const loadTiposIdentificacion = () => {
    const data = getLocalStorageData();
    setTiposIdentificacion(data.tipos_identificacion);
  };

  const getTipoIdentificacionNombre = (tipoId: string) => {
    const tipo = tiposIdentificacion.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.telefono.includes(searchTerm) ||
                         proveedor.numero_identificacion.includes(searchTerm);
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const proveedorData = {
        ...formData,
        tipo: TipoPersonaEnum.Proveedor,
      };

      if (editingProveedor) {
        PersonaService.update(editingProveedor.id, proveedorData);
      } else {
        PersonaService.create(proveedorData);
      }
      
      loadProveedores();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proveedor: Persona) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      tipo_identificacion_id: proveedor.tipo_identificacion_id,
      numero_identificacion: proveedor.numero_identificacion,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      try {
        PersonaService.delete(id);
        loadProveedores();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el proveedor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      direccion: '',
      tipo_identificacion_id: '',
      numero_identificacion: '',
    });
    setEditingProveedor(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600">Gestión de proveedores y suministradores</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </DialogTitle>
              <DialogDescription>
                {editingProveedor 
                  ? 'Modifique los datos del proveedor' 
                  : 'Complete los datos para crear un nuevo proveedor'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre/Razón Social *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre o razón social del proveedor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_identificacion_id">Tipo de Identificación *</Label>
                  <Select
                    value={formData.tipo_identificacion_id}
                    onValueChange={(value) => setFormData({ ...formData, tipo_identificacion_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent className="">
                      {tiposIdentificacion.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id} className="">
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numero_identificacion">Número de Identificación *</Label>
                  <Input
                    id="numero_identificacion"
                    value={formData.numero_identificacion}
                    onChange={(e) => setFormData({ ...formData, numero_identificacion: e.target.value })}
                    placeholder="Número de identificación"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Número de teléfono"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección comercial"
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
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : (editingProveedor ? 'Actualizar' : 'Crear')}
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
                  placeholder="Buscar proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lista de Proveedores
          </CardTitle>
          <CardDescription>
            {filteredProveedores.length} proveedor(es) {searchTerm ? 'encontrado(s)' : 'registrado(s)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProveedores.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
              </p>
              <p className="text-sm text-gray-400">
                {searchTerm ? 'Intente con otros términos de búsqueda' : 'Haga clic en "Nuevo Proveedor" para comenzar'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre/Razón Social</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="mb-1 w-fit">
                          {getTipoIdentificacionNombre(proveedor.tipo_identificacion_id)}
                        </Badge>
                        <span className="text-sm text-gray-600">{proveedor.numero_identificacion}</span>
                      </div>
                    </TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell className="max-w-xs truncate">{proveedor.direccion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(proveedor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(proveedor.id)}
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


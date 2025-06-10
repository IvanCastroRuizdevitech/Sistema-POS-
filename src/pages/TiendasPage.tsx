import React, { useState, useEffect } from 'react';
import { TiendaService } from '../services/TiendaService';
import { CompañiaService } from '../services/CompañiaService';
import { Tienda, Compañia } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Store } from 'lucide-react';

export const TiendasPage: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [compañias, setCompañias] = useState<Compañia[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTienda, setEditingTienda] = useState<Tienda | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    compañia_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTiendas();
    loadCompañias();
  }, []);

  const loadTiendas = () => {
    setTiendas(TiendaService.getAll());
  };

  const loadCompañias = () => {
    setCompañias(CompañiaService.getAll());
  };

  const getCompañiaNombre = (compañiaId: string) => {
    const compañia = compañias.find(c => c.id === compañiaId);
    return compañia?.nombre || 'Sin compañía';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingTienda) {
        TiendaService.update(editingTienda.id, formData);
      } else {
        TiendaService.create(formData);
      }
      
      loadTiendas();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la tienda');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tienda: Tienda) => {
    setEditingTienda(tienda);
    setFormData({
      nombre: tienda.nombre,
      direccion: tienda.direccion || '',
      compañia_id: tienda.compañia_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tienda?')) {
      try {
        TiendaService.delete(id);
        loadTiendas();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar la tienda');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      direccion: '',
      compañia_id: '',
    });
    setEditingTienda(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Tiendas</h1>
          <p className="text-gray-600">Gestión de tiendas y sucursales</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tienda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTienda ? 'Editar Tienda' : 'Nueva Tienda'}
              </DialogTitle>
              <DialogDescription>
                {editingTienda 
                  ? 'Modifique los datos de la tienda' 
                  : 'Complete los datos para crear una nueva tienda'
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
                    placeholder="Nombre de la tienda"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compañia_id">Compañía *</Label>
                  <Select
                    value={formData.compañia_id}
                    onValueChange={(value) => setFormData({ ...formData, compañia_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una compañía" />
                    </SelectTrigger>
                    <SelectContent>
                      {compañias.map((compañia) => (
                        <SelectItem key={compañia.id} value={compañia.id}>
                          {compañia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección de la tienda"
                  />
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
                <Button type="submit" disabled={loading || compañias.length === 0}>
                  {loading ? 'Guardando...' : (editingTienda ? 'Actualizar' : 'Crear')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {compañias.length === 0 && (
        <Alert className="mb-6">
          <AlertDescription>
            Debe crear al menos una compañía antes de poder crear tiendas.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Lista de Tiendas
          </CardTitle>
          <CardDescription>
            {tiendas.length} tienda(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tiendas.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay tiendas registradas</p>
              <p className="text-sm text-gray-400">Haga clic en "Nueva Tienda" para comenzar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Compañía</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiendas.map((tienda) => (
                  <TableRow key={tienda.id}>
                    <TableCell className="font-medium">{tienda.nombre}</TableCell>
                    <TableCell>{getCompañiaNombre(tienda.compañia_id)}</TableCell>
                    <TableCell>{tienda.direccion || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tienda)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tienda.id)}
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


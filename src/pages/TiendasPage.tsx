import React, { useState, useEffect } from 'react';
import storesApiService, { Store, CreateStoreRequest, UpdateStoreRequest } from '../services/api/storesApiService';
import companiesApiService, { Company } from '../services/api/companiesApiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Store as StoreIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const TiendasPage: React.FC = () => {
  const [tiendas, setTiendas] = useState<Store[]>([]);
  const [compañias, setCompañias] = useState<Company[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [editingTienda, setEditingTienda] = useState<Store | null>(null);
  const [formData, setFormData] = useState<CreateStoreRequest>({
    nombre: '',
    direccion: '',
    compania_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTiendas();
    loadCompañias();
  }, []);

  const loadTiendas = async () => {
    setIsLoading(true);
    try {
      const data = await storesApiService.getAll();
      setTiendas(data);
    } catch (error) {
      console.error('Error cargando tiendas:', error);
      toast.error('No se pudieron cargar las tiendas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompañias = async () => {
    try {
      const data = await companiesApiService.getAll();
      setCompañias(data);
    } catch (error) {
      console.error('Error cargando compañías:', error);
      toast.error('No se pudieron cargar las compañías');
    }
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
        await storesApiService.update(editingTienda.id, formData as UpdateStoreRequest);
        toast.success('Tienda actualizada exitosamente');
      } else {
        await storesApiService.create(formData);
        toast.success('Tienda creada exitosamente');
      }
      
      await loadTiendas();
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la tienda');
      toast.error(`Error: ${err.message || 'Error al guardar la tienda'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tienda: Store) => {
    setEditingTienda(tienda);
    setFormData({
      nombre: tienda.nombre,
      direccion: tienda.direccion || '',
      compania_id: tienda.compania_id,
      telefono: tienda.telefono,
      email: tienda.email
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setStoreToDelete(id);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!storeToDelete) return;
    
    try {
      await storesApiService.delete(storeToDelete);
      await loadTiendas();
      toast.success('Tienda eliminada exitosamente');
    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Error al eliminar la tienda'}`);
    } finally {
      setIsAlertDialogOpen(false);
      setStoreToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      direccion: '',
      compania_id: '',
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
                  <Label htmlFor="compania_id">Compañía *</Label>
                  <Select
                    value={formData.compania_id}
                    onValueChange={(value) => setFormData({ ...formData, compania_id: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección de la tienda"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Teléfono de contacto"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Correo electrónico"
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
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingTienda ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingTienda ? 'Actualizar' : 'Crear'
                  )}
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
            <StoreIcon className="h-5 w-5" />
            Lista de Tiendas
          </CardTitle>
          <CardDescription>
            {tiendas.length} tienda(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tiendas.length === 0 ? (
            <div className="text-center py-8">
              <StoreIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiendas.map((tienda) => (
                  <TableRow key={tienda.id}>
                    <TableCell className="font-medium">{tienda.nombre}</TableCell>
                    <TableCell>{tienda.compania_nombre || getCompañiaNombre(tienda.compania_id)}</TableCell>
                    <TableCell>{tienda.direccion || '-'}</TableCell>
                    <TableCell>{tienda.telefono || '-'}</TableCell>
                    <TableCell>{tienda.email || '-'}</TableCell>
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
                          onClick={() => confirmDelete(tienda.id)}
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

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar esta tienda?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tienda será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import companiesApiService from '../services/api/companiesApiService';
import { Company } from '../services/api/companiesApiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Plus, Edit, Trash2, Building, Loader2, AlertCircle } from 'lucide-react';
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

export const CompañiasPage: React.FC = () => {
  const [compañias, setCompañias] = useState<Company[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [editingCompañia, setEditingCompañia] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadCompañias();
  }, []);

  const loadCompañias = async () => {
    try {
      setPageLoading(true);
      const data = await companiesApiService.getAll();
      setCompañias(data);
      if (data.length === 0) {
        setError('No hay compañías registradas.');
        toast.success('¡No hay compañías registradas.!', {
          description: 'Crea una nueva compañía ...',
        });
      } else {
        setError('');
      }
    } catch (err: any) {
      console.error('Error loading companies:', err);
      setError(err.message || 'Error al cargar las compañías');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingCompañia) {
        await companiesApiService.update(editingCompañia.id, formData);
        toast.success('¡Compañia editada exitosamente!', {
          description: 'Listando Compañias...',
        });
      } else {
        await companiesApiService.create(formData);
        toast.success('¡Compañia creada exitosamente!', {
          description: 'Listando Compañias...',
        });
      }
      
      await loadCompañias();

      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error('❌ Error al guardar la compañía');
      console.error('Error saving company:', err);
      setError(err.message || 'Error al guardar la compañía');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (compañia: Company) => {
    setEditingCompañia(compañia);
    setFormData({
      nombre: compañia.nombre,
      nit: compañia.nit || '',
      direccion: compañia.direccion || '',
      telefono: compañia.telefono || '',
      email: compañia.email || '',
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setCompanyToDelete(id);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;
    
    try {
      setError('');
      await companiesApiService.delete(companyToDelete);
      toast.success('¡Compañía eliminada exitosamente!', {
        description: 'Listando Compañias...',
      });
      await loadCompañias();
    } catch (err: any) {
      toast.error('❌ Error al eliminar la compañía');
      console.error('Error deleting company:', err);
      setError(err.message || 'Error al eliminar la compañía');
    } finally {
      setIsAlertDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      nit: '',
      direccion: '',
      telefono: '',
      email: '',
    });
    setEditingCompañia(null);
    setError('');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (pageLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando compañías...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compañías</h1>
          <p className="text-gray-600">Gestión de compañías y organizaciones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Compañía
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCompañia ? 'Editar Compañía' : 'Nueva Compañía'}
              </DialogTitle>
              <DialogDescription>
                {editingCompañia 
                  ? 'Modifique los datos de la compañía' 
                  : 'Complete los datos para crear una nueva compañía'
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
                    placeholder="Nombre de la compañía"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="nit">NIT *</Label>
                  <Input
                    id="nit"
                    value={formData.nit}
                    onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    placeholder="Número de Identificación Tributaria"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección de la compañía"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Número de teléfono"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Correo electrónico"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleDialogClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingCompañia ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !isDialogOpen && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Lista de Compañías
          </CardTitle>
          <CardDescription>
            {compañias.length} compañía(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {compañias.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay compañías registradas</p>
              <p className="text-sm text-gray-400">Haga clic en "Nueva Compañía" para comenzar</p>
            </div>
          ) : (
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>NIT</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compañias.map((compañia) => (
                    <TableRow key={compañia.id}>
                      <TableCell className="font-medium">{compañia.nombre}</TableCell>
                      <TableCell>{compañia.nit || '-'}</TableCell>
                      <TableCell>{compañia.direccion || '-'}</TableCell>
                      <TableCell>{compañia.telefono || '-'}</TableCell>
                      <TableCell>{compañia.email || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(compañia)}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(compañia.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTable>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar esta compañía?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La compañía será eliminada permanentemente del sistema.
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

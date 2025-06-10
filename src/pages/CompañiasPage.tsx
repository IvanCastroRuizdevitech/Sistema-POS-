import React, { useState, useEffect } from 'react';
import { CompañiaService } from '../services/CompañiaService';
import { Compañia } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Building } from 'lucide-react';

export const CompañiasPage: React.FC = () => {
  const [compañias, setCompañias] = useState<Compañia[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompañia, setEditingCompañia] = useState<Compañia | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    NIT: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompañias();
  }, []);

  const loadCompañias = () => {
    setCompañias(CompañiaService.getAll());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingCompañia) {
        CompañiaService.update(editingCompañia.id, formData);
      } else {
        CompañiaService.create(formData);
      }
      
      loadCompañias();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la compañía');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (compañia: Compañia) => {
    setEditingCompañia(compañia);
    setFormData({
      nombre: compañia.nombre,
      NIT: compañia.NIT || '',
      direccion: compañia.direccion || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta compañía?')) {
      try {
        CompañiaService.delete(id);
        loadCompañias();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar la compañía');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      NIT: '',
      direccion: '',
    });
    setEditingCompañia(null);
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
          <DialogContent>
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
                  />
                </div>
                <div>
                  <Label htmlFor="NIT">NIT</Label>
                  <Input
                    id="NIT"
                    value={formData.NIT}
                    onChange={(e) => setFormData({ ...formData, NIT: e.target.value })}
                    placeholder="Número de Identificación Tributaria"
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección de la compañía"
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : (editingCompañia ? 'Actualizar' : 'Crear')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compañias.map((compañia) => (
                  <TableRow key={compañia.id}>
                    <TableCell className="font-medium">{compañia.nombre}</TableCell>
                    <TableCell>{compañia.NIT || '-'}</TableCell>
                    <TableCell>{compañia.direccion || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(compañia)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(compañia.id)}
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


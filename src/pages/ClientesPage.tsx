import React, { useState, useEffect } from 'react';
import { PersonaService } from '../services/PersonaService';
import { getLocalStorageData } from '../data/localStorage';
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
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Persona[]>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Persona | null>(null);
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
    loadClientes();
    loadTiposIdentificacion();
  }, []);

  const loadClientes = () => {
    setClientes(PersonaService.getClientes());
  };

  const loadTiposIdentificacion = () => {
    const data = getLocalStorageData();
    setTiposIdentificacion(data.tipos_identificacion);
  };

  const getTipoIdentificacionNombre = (tipoId: string) => {
    const tipo = tiposIdentificacion.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const clienteData = {
        ...formData,
        tipo: TipoPersonaEnum.Cliente,
      };

      if (editingCliente) {
        PersonaService.update(editingCliente.id, clienteData);
      } else {
        PersonaService.create(clienteData);
      }
      
      loadClientes();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Persona) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      tipo_identificacion_id: cliente.tipo_identificacion_id,
      numero_identificacion: cliente.numero_identificacion,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      try {
        PersonaService.delete(id);
        loadClientes();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el cliente');
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
    setEditingCliente(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCliente 
                  ? 'Modifique los datos del cliente' 
                  : 'Complete los datos para crear un nuevo cliente'
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
                    placeholder="Nombre completo del cliente"
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
                      <SelectValue placeholder="Seleccione el tipo de identificación" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposIdentificacion.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
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
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección del cliente"
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
                  {loading ? 'Guardando...' : (editingCliente ? 'Actualizar' : 'Crear')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
          <CardDescription>
            {clientes.length} cliente(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay clientes registrados</p>
              <p className="text-sm text-gray-400">Haga clic en "Nuevo Cliente" para comenzar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {getTipoIdentificacionNombre(cliente.tipo_identificacion_id)}
                        </Badge>
                        <div className="text-sm">{cliente.numero_identificacion}</div>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.telefono || '-'}</TableCell>
                    <TableCell>{cliente.direccion || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cliente)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
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


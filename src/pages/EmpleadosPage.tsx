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
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { getLocalStorageData } from '../data/localStorage';

export const EmpleadosPage: React.FC = () => {
  console.log("Rendering EmpleadosPage");
  
  const [empleados, setEmpleados] = useState<Persona[]>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Persona | null>(null);
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
    loadEmpleados();
    loadTiposIdentificacion();
  }, []);

  const loadEmpleados = () => {
    setEmpleados(PersonaService.getEmpleados());
  };

  const loadTiposIdentificacion = () => {
    const data = getLocalStorageData();
    setTiposIdentificacion(data.tipos_identificacion);
  };

  const getTipoIdentificacionNombre = (tipoId: string) => {
    const tipo = tiposIdentificacion.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.telefono.includes(searchTerm) ||
                         empleado.numero_identificacion.includes(searchTerm);
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const empleadoData = {
        ...formData,
        tipo: TipoPersonaEnum.Empleado,
      };

      if (editingEmpleado) {
        PersonaService.update(editingEmpleado.id, empleadoData);
      } else {
        PersonaService.create(empleadoData);
      }
      
      loadEmpleados();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (empleado: Persona) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      tipo_identificacion_id: empleado.tipo_identificacion_id,
      numero_identificacion: empleado.numero_identificacion,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        PersonaService.delete(id);
        loadEmpleados();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el empleado');
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
    setEditingEmpleado(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-600">Gestión de empleados y personal</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
              </DialogTitle>
              <DialogDescription>
                {editingEmpleado 
                  ? 'Modifique los datos del empleado' 
                  : 'Complete los datos para crear un nuevo empleado'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre completo del empleado"
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
                    placeholder="Dirección de residencia"
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
                  {loading ? 'Guardando...' : (editingEmpleado ? 'Actualizar' : 'Crear')}
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
                  placeholder="Buscar empleados..."
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
            <Users className="h-5 w-5" />
            Lista de Empleados
          </CardTitle>
          <CardDescription>
            {filteredEmpleados.length} empleado(s) {searchTerm ? 'encontrado(s)' : 'registrado(s)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmpleados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron empleados' : 'No hay empleados registrados'}
              </p>
              <p className="text-sm text-gray-400">
                {searchTerm ? 'Intente con otros términos de búsqueda' : 'Haga clic en "Nuevo Empleado" para comenzar'}
              </p>
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
                {filteredEmpleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">{empleado.nombre}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="mb-1 w-fit">
                          {getTipoIdentificacionNombre(empleado.tipo_identificacion_id)}
                        </Badge>
                        <span className="text-sm text-gray-600">{empleado.numero_identificacion}</span>
                      </div>
                    </TableCell>
                    <TableCell>{empleado.telefono}</TableCell>
                    <TableCell className="max-w-xs truncate">{empleado.direccion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(empleado)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(empleado.id)}
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


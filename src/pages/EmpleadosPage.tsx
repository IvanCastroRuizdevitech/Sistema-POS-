import React, { useState, useEffect } from 'react';
import employeesApiService, { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../services/api/employeesApiService';
import storesApiService from '../services/api/storesApiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Search, Loader2, Calendar, DollarSign } from 'lucide-react';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TipoIdentificacion {
  id: string;
  nombre: string;
}

export const EmpleadosPage: React.FC = () => {
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [editingEmpleado, setEditingEmpleado] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    nombre: '',
    tipo_identificacion_id: '',
    numero_identificacion: '',
    telefono: '',
    direccion: '',
    email: '',
    cargo: '',
    tienda_id: '',
    fecha_contratacion: new Date(),
    salario: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmpleados();
    loadTiendas();
    loadTiposIdentificacion();
  }, []);

  const loadEmpleados = async () => {
    setIsLoading(true);
    try {
      const data = await employeesApiService.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      toast.error('No se pudieron cargar los empleados');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTiendas = async () => {
    try {
      const data = await storesApiService.getAll();
      setTiendas(data);
    } catch (error) {
      console.error('Error cargando tiendas:', error);
      toast.error('No se pudieron cargar las tiendas');
    }
  };

  const loadTiposIdentificacion = async () => {
    try {
      // Simulación de tipos de identificación - En un caso real, esto vendría de una API
      setTiposIdentificacion([
        { id: '1', nombre: 'Cédula de Ciudadanía' },
        { id: '2', nombre: 'Cédula de Extranjería' },
        { id: '3', nombre: 'Pasaporte' },
        { id: '4', nombre: 'NIT' }
      ]);
    } catch (error) {
      console.error('Error cargando tipos de identificación:', error);
    }
  };

  const getTipoIdentificacionNombre = (tipoId: string) => {
    const tipo = tiposIdentificacion.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  const getTiendaNombre = (tiendaId: string) => {
    const tienda = tiendas.find(t => t.id === tiendaId);
    return tienda?.nombre || 'Sin tienda';
  };

  const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = 
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.numero_identificacion.includes(searchTerm) ||
      (empleado.telefono && empleado.telefono.includes(searchTerm)) ||
      (empleado.cargo && empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingEmpleado) {
        await employeesApiService.update(editingEmpleado.id, formData as UpdateEmployeeRequest);
        toast.success('Empleado actualizado exitosamente');
      } else {
        await employeesApiService.create(formData);
        toast.success('Empleado creado exitosamente');
      }
      
      await loadEmpleados();
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el empleado');
      toast.error(`Error: ${err.message || 'Error al guardar el empleado'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (empleado: Employee) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      tipo_identificacion_id: empleado.tipo_identificacion_id,
      numero_identificacion: empleado.numero_identificacion,
      telefono: empleado.telefono || '',
      direccion: empleado.direccion || '',
      email: empleado.email || '',
      cargo: empleado.cargo,
      tienda_id: empleado.tienda_id,
      fecha_contratacion: new Date(empleado.fecha_contratacion),
      salario: empleado.salario
    });
    setDate(new Date(empleado.fecha_contratacion));
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setEmployeeToDelete(id);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      await employeesApiService.delete(employeeToDelete);
      await loadEmpleados();
      toast.success('Empleado eliminado exitosamente');
    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Error al eliminar el empleado'}`);
    } finally {
      setIsAlertDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo_identificacion_id: '',
      numero_identificacion: '',
      telefono: '',
      direccion: '',
      email: '',
      cargo: '',
      tienda_id: '',
      fecha_contratacion: new Date(),
      salario: 0
    });
    setDate(new Date());
    setEditingEmpleado(null);
    setError('');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un tipo" />
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
                    placeholder="Dirección de residencia"
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
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Cargo del empleado"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tienda_id">Tienda *</Label>
                  <Select
                    value={formData.tienda_id}
                    onValueChange={(value) => setFormData({ ...formData, tienda_id: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione una tienda" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiendas.map((tienda) => (
                        <SelectItem key={tienda.id} value={tienda.id}>
                          {tienda.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fecha_contratacion">Fecha de Contratación *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          if (newDate) {
                            setFormData({ ...formData, fecha_contratacion: newDate });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="salario">Salario *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="salario"
                      type="number"
                      value={formData.salario}
                      onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) })}
                      placeholder="Salario mensual"
                      className="pl-10"
                      required
                      min="0"
                      step="1000"
                    />
                  </div>
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
                <Button type="submit" disabled={loading || tiendas.length === 0}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingEmpleado ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingEmpleado ? 'Actualizar' : 'Crear'
                  )}
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Empleados
          </CardTitle>
          <CardDescription>
            {filteredEmpleados.length} empleado(s) {searchTerm ? 'encontrado(s)' : 'registrado(s)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEmpleados.length === 0 ? (
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Tienda</TableHead>
                    <TableHead>Contratación</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Contacto</TableHead>
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
                            {empleado.tipo_identificacion || getTipoIdentificacionNombre(empleado.tipo_identificacion_id)}
                          </Badge>
                          <span className="text-sm text-gray-600">{empleado.numero_identificacion}</span>
                        </div>
                      </TableCell>
                      <TableCell>{empleado.cargo}</TableCell>
                      <TableCell>{empleado.tienda_nombre || getTiendaNombre(empleado.tienda_id)}</TableCell>
                      <TableCell>
                        {empleado.fecha_contratacion ? 
                          format(new Date(empleado.fecha_contratacion), 'dd/MM/yyyy') : 
                          'No disponible'
                        }
                      </TableCell>
                      <TableCell>{formatCurrency(empleado.salario)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          {empleado.telefono && <span>{empleado.telefono}</span>}
                          {empleado.email && <span className="text-blue-600">{empleado.email}</span>}
                        </div>
                      </TableCell>
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
                            onClick={() => confirmDelete(empleado.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este empleado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El empleado será eliminado permanentemente del sistema.
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

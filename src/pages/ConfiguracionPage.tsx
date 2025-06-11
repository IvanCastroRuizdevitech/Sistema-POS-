import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLocalStorageData, setLocalStorageData } from '../data/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Database, 
  Users, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Building,
  Store,
  Package,
  DollarSign
} from 'lucide-react';

export const ConfiguracionPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false);
  
  // Estados para estadísticas del sistema
  const [systemStats, setSystemStats] = useState({
    totalCompanias: 0,
    totalTiendas: 0,
    totalUsuarios: 0,
    totalProductos: 0,
    totalVentas: 0,
    totalClientes: 0,
    totalProveedores: 0,
    totalInventarios: 0,
    dataSize: '0 KB'
  });

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = () => {
    const data = getLocalStorageData();
    const dataString = JSON.stringify(data);
    const dataSize = new Blob([dataString]).size;
    
    setSystemStats({
      totalCompanias: data.compañias?.length || 0,
      totalTiendas: data.tiendas?.length || 0,
      totalUsuarios: data.usuarios?.length || 0,
      totalProductos: data.productos?.length || 0,
      totalVentas: data.ventas?.length || 0,
      totalClientes: data.personas?.filter(p => p.tipo === 'Cliente').length || 0,
      totalProveedores: data.personas?.filter(p => p.tipo === 'Proveedor').length || 0,
      totalInventarios: data.inventarios?.length || 0,
      dataSize: formatBytes(dataSize)
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleBackupData = () => {
    try {
      setIsLoading(true);
      const data = getLocalStorageData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sistema-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showMessage('Backup creado exitosamente', 'success');
      setIsBackupDialogOpen(false);
    } catch (error) {
      showMessage('Error al crear el backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setIsLoading(true);
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validar estructura básica
        if (!jsonData.usuarios || !jsonData.productos || !jsonData.compañias) {
          throw new Error('Archivo de backup inválido');
        }
        
        setLocalStorageData(jsonData);
        loadSystemStats();
        showMessage('Datos restaurados exitosamente', 'success');
        setIsRestoreDialogOpen(false);
        
        // Recargar la página para reflejar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        showMessage('Error al restaurar los datos. Verifique que el archivo sea válido.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('pos_data');
      showMessage('Todos los datos han sido eliminados', 'success');
      setIsClearDataDialogOpen(false);
      
      // Recargar la página para reinicializar con datos por defecto
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showMessage('Error al eliminar los datos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStats = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadSystemStats();
      setIsLoading(false);
      showMessage('Estadísticas actualizadas', 'success');
    }, 1000);
  };

  // Verificar permisos de administrador
  if (!hasPermission('all')) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="">
            No tiene permisos para acceder a la configuración del sistema.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Configuración del Sistema
        </h1>
        <p className="text-gray-600">Gestione la configuración y mantenimiento del sistema POS</p>
      </div>

      {message && (
        <Alert 
          variant={messageType === 'error' ? 'destructive' : 'default'} 
          className="mb-6"
        >
          {messageType === 'success' && <CheckCircle className="h-4 w-4" />}
          {messageType === 'error' && <AlertTriangle className="h-4 w-4" />}
          {messageType === 'info' && <Info className="h-4 w-4" />}
          <AlertDescription className="">{message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de Datos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        {/* Tab General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
              <CardDescription>
                Estadísticas generales y estado del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Compañías</p>
                    <p className="text-2xl font-bold text-blue-600">{systemStats.totalCompanias}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Store className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tiendas</p>
                    <p className="text-2xl font-bold text-green-600">{systemStats.totalTiendas}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Productos</p>
                    <p className="text-2xl font-bold text-purple-600">{systemStats.totalProductos}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ventas</p>
                    <p className="text-2xl font-bold text-orange-600">{systemStats.totalVentas}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usuarios Registrados</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{systemStats.totalUsuarios} usuarios</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Clientes y Proveedores</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{systemStats.totalClientes} clientes</Badge>
                    <Badge variant="outline">{systemStats.totalProveedores} proveedores</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Inventarios</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{systemStats.totalInventarios} registros</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tamaño de Datos</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{systemStats.dataSize}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleRefreshStats} 
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar Estadísticas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Base de Datos */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestión de Base de Datos
              </CardTitle>
              <CardDescription>
                Herramientas para backup, restauración y mantenimiento de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Backup */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Crear Backup
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Descargue una copia de seguridad de todos los datos del sistema en formato JSON.
                </p>
                <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Crear Backup
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Backup de Datos</DialogTitle>
                      <DialogDescription>
                        Se descargará un archivo JSON con todos los datos del sistema.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleBackupData} disabled={isLoading}>
                        {isLoading ? 'Creando...' : 'Crear Backup'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Restore */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Restaurar Datos
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Restaure los datos del sistema desde un archivo de backup.
                </p>
                <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar Datos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Restaurar Datos</DialogTitle>
                      <DialogDescription>
                        Seleccione un archivo de backup para restaurar los datos. 
                        <strong className="text-red-600"> Esto sobrescribirá todos los datos actuales.</strong>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreData}
                        disabled={isLoading}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Clear Data */}
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-700">
                  <Trash2 className="h-5 w-5" />
                  Limpiar Todos los Datos
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  <strong>¡PELIGRO!</strong> Esta acción eliminará permanentemente todos los datos del sistema.
                </p>
                <Dialog open={isClearDataDialogOpen} onOpenChange={setIsClearDataDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar Datos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-600">¡Confirmar Eliminación!</DialogTitle>
                      <DialogDescription>
                        Esta acción eliminará <strong>TODOS</strong> los datos del sistema de forma permanente.
                        No se puede deshacer. ¿Está seguro de que desea continuar?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsClearDataDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleClearAllData} disabled={isLoading}>
                        {isLoading ? 'Eliminando...' : 'Sí, Eliminar Todo'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Usuarios */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Información sobre usuarios y roles del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Roles Disponibles</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Administrador</span>
                        <Badge>Acceso completo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vendedor</span>
                        <Badge variant="outline">Acceso limitado</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Usuarios Activos</h4>
                    <div className="text-3xl font-bold text-green-600">
                      {systemStats.totalUsuarios}
                    </div>
                    <p className="text-sm text-green-600">usuarios registrados</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Permisos por Rol</h4>
                  <ResponsiveTable>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Módulo</TableHead>
                          <TableHead className="min-w-[120px] text-center">Administrador</TableHead>
                          <TableHead className="min-w-[120px] text-center">Vendedor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Dashboard</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Ventas</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Productos</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-yellow-100 text-yellow-800">👁 Solo lectura</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Inventario</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-yellow-100 text-yellow-800">👁 Solo lectura</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Clientes</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-yellow-100 text-yellow-800">👁 Solo lectura</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Reportes</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Compañías</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-red-100 text-red-800">✗ Sin acceso</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Empleados</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-red-100 text-red-800">✗ Sin acceso</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Configuración</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-red-100 text-red-800">✗ Sin acceso</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ResponsiveTable>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


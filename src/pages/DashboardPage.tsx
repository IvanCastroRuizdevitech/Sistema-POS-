import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Building, LogOut } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, persona, rol, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido al Sistema POS</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{persona?.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-medium">{user?.correo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <Badge variant={rol?.nombre === 'Administrador' ? 'default' : 'secondary'}>
                    {rol?.nombre}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge variant="outline" className="text-green-600">
                    Activo
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ventas</CardTitle>
              <CardDescription>Gestionar ventas y POS</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ir a Ventas</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Inventario</CardTitle>
              <CardDescription>Gestionar productos y stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Ver Inventario</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reportes</CardTitle>
              <CardDescription>Análisis y reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Ver Reportes</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configuración</CardTitle>
              <CardDescription>Gestionar sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Configurar</Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ventas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-gray-500">+0% desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Total en inventario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Registrados</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


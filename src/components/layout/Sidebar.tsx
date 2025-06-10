import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Store, 
  Building, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  UserCheck,
  Truck,
  Boxes
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, permission: null },
  { name: 'Compañías', href: '/companias', icon: Building, permission: 'all' },
  { name: 'Tiendas', href: '/tiendas', icon: Store, permission: 'all' },
  { name: 'Empleados', href: '/empleados', icon: UserCheck, permission: 'all' },
  { name: 'Clientes', href: '/clientes', icon: Users, permission: null },
  { name: 'Proveedores', href: '/proveedores', icon: Truck, permission: 'all' },
  { name: 'Productos', href: '/productos', icon: Package, permission: null },
  { name: 'Inventario', href: '/inventario', icon: Boxes, permission: null },
  { name: 'Ventas', href: '/ventas', icon: ShoppingCart, permission: null },
  { name: 'Reportes', href: '/reportes', icon: BarChart3, permission: null },
  { name: 'Configuración', href: '/configuracion', icon: Settings, permission: 'all' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, hasPermission, persona } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (item.permission === null) return true;
    if (item.permission === 'all') return hasPermission('all');
    return hasPermission(item.permission);
  });

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Store className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-bold text-white">Sistema POS</span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{persona?.nombre}</p>
              <p className="text-xs text-gray-400">Usuario activo</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-3 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={logout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};


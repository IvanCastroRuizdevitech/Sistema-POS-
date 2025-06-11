import React, { useState } from 'react';
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
  Boxes,
  Menu,
  X
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

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const { logout, hasPermission, persona } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (item.permission === null) return true;
    if (item.permission === 'all') return hasPermission('all');
    return hasPermission(item.permission);
  });

  const handleLinkClick = () => {
    // En móvil, cerrar el sidebar al hacer clic en un enlace
    if (window.innerWidth < 768 && onToggle) {
      onToggle();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-gray-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Sistema POS</span>
          </div>
          
          {/* Botón cerrar para móvil */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-gray-700"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Navegación */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
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
          
          {/* Usuario y logout */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{persona?.nombre}</p>
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
    </>
  );
};

// Componente para el botón hamburguesa
export const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="md:hidden fixed top-4 left-4 z-60 bg-gray-900 text-white hover:bg-gray-700"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};


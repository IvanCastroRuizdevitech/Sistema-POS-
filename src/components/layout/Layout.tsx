import React, { useState } from 'react';
import { Sidebar, MobileMenuButton } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Botón hamburguesa para móvil */}
      <MobileMenuButton onClick={toggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="md:hidden h-16" /> {/* Espaciado para el botón hamburguesa en móvil */}
        {children}
      </main>
    </div>
  );
};


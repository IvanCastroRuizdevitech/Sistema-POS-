import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, Persona, Rol } from '../types';
import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';

interface AuthContextType {
  user: Usuario | null;
  persona: Persona | null;
  rol: Rol | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [rol, setRol] = useState<Rol | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData.user);
      setPersona(userData.persona);
      setRol(userData.rol);
    }
  }, []);

  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    const data = getLocalStorageData();
    
    // Find user by email
    const foundUser = data.usuarios.find(u => u.correo === correo && u.activo);
    
    if (!foundUser || foundUser.contraseña !== contraseña) {
      return false;
    }

    // Find associated persona and rol
    const foundPersona = data.personas.find(p => p.id === foundUser.persona_id);
    const foundRol = data.roles.find(r => r.id === foundUser.rol_id);

    if (!foundPersona || !foundRol) {
      return false;
    }

    setUser(foundUser);
    setPersona(foundPersona);
    setRol(foundRol);

    // Save to localStorage for persistence
    localStorage.setItem('current_user', JSON.stringify({
      user: foundUser,
      persona: foundPersona,
      rol: foundRol
    }));

    return true;
  };

  const logout = () => {
    setUser(null);
    setPersona(null);
    setRol(null);
    localStorage.removeItem('current_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!rol) return false;
    if (rol.permisos === 'all') return true;
    return rol.permisos?.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    persona,
    rol,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


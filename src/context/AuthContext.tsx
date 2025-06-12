import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, Persona, Rol } from '../types';
import { authApiService, AuthResponse } from '../services/api/authApiService';

interface AuthContextType {
  user: Usuario | null;
  persona: Persona | null;
  rol: Rol | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and validate token
    const initializeAuth = async () => {
      try {
        if (authApiService.isAuthenticated()) {
          const userData = authApiService.getCurrentUser();
          if (userData) {
            // Validate token with backend
            await authApiService.validateToken();
            
            // Convert API response to local types
            const convertedUser: Usuario = {
              id: userData.id,
              persona_id: userData.persona.id,
              email: userData.email,
              password: '', // Don't store password
              rol_id: userData.rol.id,
              fecha_creacion: new Date(),
              activo: true,
            };

            const convertedPersona: Persona = {
              id: userData.persona.id,
              nombre: userData.persona.nombre,
              telefono: userData.persona.telefono,
              direccion: userData.persona.direccion,
              tipo_identificacion_id: userData.persona.tipo_identificacion_id,
              numero_identificacion: userData.persona.numero_identificacion,
              tipo: userData.persona.tipo as any,
            };

            const convertedRol: Rol = {
              id: userData.rol.id,
              nombre: userData.rol.nombre,
              permisos: userData.rol.permisos,
            };

            setUser(convertedUser);
            setPersona(convertedPersona);
            setRol(convertedRol);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If token validation fails, logout
        authApiService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    console.log('AuthContext: login function called'); // Debug log
    try {
      setLoading(true);
      const response: AuthResponse = await authApiService.login({
        email: correo,
        password: contraseña,
      });

      // Convert API response to local types
      const convertedUser: Usuario = {
        id: response.user.id,
        persona_id: response.user.persona.id,
        email: response.user.email,
        password: '', // Don't store password
        rol_id: response.user.rol.id,
        fecha_creacion: new Date(),
        activo: true,
      };

      const convertedPersona: Persona = {
        id: response.user.persona.id,
        nombre: response.user.persona.nombre,
        telefono: response.user.persona.telefono,
        direccion: response.user.persona.direccion,
        tipo_identificacion_id: response.user.persona.tipo_identificacion_id,
        numero_identificacion: response.user.persona.numero_identificacion,
        tipo: response.user.persona.tipo as any,
      };

      const convertedRol: Rol = {
        id: response.user.rol.id,
        nombre: response.user.rol.nombre,
        permisos: response.user.rol.permisos,
      };

      setUser(convertedUser);
      setPersona(convertedPersona);
      setRol(convertedRol);

      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApiService.logout();
    setUser(null);
    setPersona(null);
    setRol(null);
  };

  const hasPermission = (permission: string): boolean => {
    console.log("Checking permission:", permission, "for rol:", rol);
    if (!rol) {
      console.log("No rol found, returning false.");
      return false;
    }
    if (rol.permisos === 'all') {
      console.log("Rol has all permissions, returning true.");
      return true;
    }
    const result = rol.permisos?.includes(permission) || false;
    console.log("Permission check result:", result);
    return result;
  };

  const value: AuthContextType = {
    user,
    persona,
    rol,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



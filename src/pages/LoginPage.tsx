import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Store, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(correo, contraseña);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Verifique su correo y contraseña.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setCorreo(email);
    setContraseña(password);
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Error al iniciar sesión con usuario de prueba.');
      }
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sistema POS</CardTitle>
          <CardDescription>
            Gestión de Tienda de Accesorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña</Label>
              <div className="relative">
                <Input
                  id="contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">Usuarios de prueba:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDemoLogin('admin@tienda.com', 'admin123')}
                disabled={loading}
              >
                <strong>Administrador:</strong> admin@tienda.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDemoLogin('vendedor@tienda.com', 'vendedor123')}
                disabled={loading}
              >
                <strong>Vendedor:</strong> vendedor@tienda.com
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p><strong>Nota:</strong> Estos usuarios deben existir en la base de datos del backend.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


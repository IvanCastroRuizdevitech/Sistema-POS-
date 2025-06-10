import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes permisos para acceder a esta página
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Tu rol actual no tiene los permisos necesarios para ver este contenido. 
            Contacta al administrador si necesitas acceso.
          </p>
          <Button onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


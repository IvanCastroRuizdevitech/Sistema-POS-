import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Usuario, Persona, TipoPersonaEnum } from '../types';

// Initialize demo users
export const initializeDemoUsers = () => {
  const data = getLocalStorageData();
  
  // Check if demo users already exist
  const adminExists = data.usuarios.some(u => u.email === 'admin@tienda.com');
  const vendedorExists = data.usuarios.some(u => u.email === 'vendedor@tienda.com');
  
  if (!adminExists || !vendedorExists) {
    // Create demo personas
    const adminPersona: Persona = {
      id: generateId(),
      nombre: 'Administrador Sistema',
      telefono: '3001234567',
      direccion: 'Oficina Principal',
      tipo: TipoPersonaEnum.Empleado,
      tipo_identificacion_id: '1',
      numero_identificacion: '12345678',
    };

    const vendedorPersona: Persona = {
      id: generateId(),
      nombre: 'Vendedor Demo',
      telefono: '3007654321',
      direccion: 'Tienda Principal',
      tipo: TipoPersonaEnum.Empleado,
      tipo_identificacion_id: '1',
      numero_identificacion: '87654321',
    };

    // Create demo users
    const adminUser: Usuario = {
      id: generateId(),
      persona_id: adminPersona.id,
      email: 'admin@tienda.com',
      password: 'admin123',
      rol_id: '1', // Administrador
      activo: true,
      fecha_creacion: new Date(),
    };

    const vendedorUser: Usuario = {
      id: generateId(),
      persona_id: vendedorPersona.id,
      email: 'vendedor@tienda.com',
      password: 'vendedor123',
      rol_id: '2', // Vendedor
      activo: true,
      fecha_creacion: new Date(),
    };

    // Add to data
    if (!adminExists) {
      data.personas.push(adminPersona);
      data.usuarios.push(adminUser);
    }
    
    if (!vendedorExists) {
      data.personas.push(vendedorPersona);
      data.usuarios.push(vendedorUser);
    }

    // Save updated data
    setLocalStorageData(data);
  }
};


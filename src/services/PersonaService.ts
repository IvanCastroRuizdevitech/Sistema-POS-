import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Persona, TipoPersonaEnum } from '../types';

export class PersonaService {
  static getAll(): Persona[] {
    const data = getLocalStorageData();
    return data.personas;
  }

  static getById(id: string): Persona | undefined {
    const data = getLocalStorageData();
    return data.personas.find(p => p.id === id);
  }

  static getByTipo(tipo: TipoPersonaEnum): Persona[] {
    const data = getLocalStorageData();
    return data.personas.filter(p => p.tipo === tipo);
  }

  static getClientes(): Persona[] {
    return this.getByTipo(TipoPersonaEnum.Cliente);
  }

  static getEmpleados(): Persona[] {
    return this.getByTipo(TipoPersonaEnum.Empleado);
  }

  static getProveedores(): Persona[] {
    return this.getByTipo(TipoPersonaEnum.Proveedor);
  }

  static create(persona: Omit<Persona, 'id'>): Persona {
    const data = getLocalStorageData();
    
    // Check if numero_identificacion already exists
    const exists = data.personas.some(p => p.numero_identificacion === persona.numero_identificacion);
    if (exists) {
      throw new Error('Ya existe una persona con este número de identificación');
    }

    const newPersona: Persona = {
      ...persona,
      id: generateId(),
    };
    data.personas.push(newPersona);
    setLocalStorageData(data);
    return newPersona;
  }

  static update(id: string, updates: Partial<Omit<Persona, 'id'>>): Persona | null {
    const data = getLocalStorageData();
    const index = data.personas.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Check if numero_identificacion already exists (excluding current record)
    if (updates.numero_identificacion) {
      const exists = data.personas.some(p => 
        p.numero_identificacion === updates.numero_identificacion && p.id !== id
      );
      if (exists) {
        throw new Error('Ya existe una persona con este número de identificación');
      }
    }

    data.personas[index] = { ...data.personas[index], ...updates };
    setLocalStorageData(data);
    return data.personas[index];
  }

  static delete(id: string): boolean {
    const data = getLocalStorageData();
    const index = data.personas.findIndex(p => p.id === id);
    if (index === -1) return false;

    // Check if persona is referenced by any user
    const isReferenced = data.usuarios.some(u => u.persona_id === id);
    if (isReferenced) {
      throw new Error('No se puede eliminar esta persona porque está asociada a un usuario');
    }

    data.personas.splice(index, 1);
    setLocalStorageData(data);
    return true;
  }
}


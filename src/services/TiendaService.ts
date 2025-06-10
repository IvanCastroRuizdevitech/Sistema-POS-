import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Tienda } from '../types';

export class TiendaService {
  static getAll(): Tienda[] {
    const data = getLocalStorageData();
    return data.tiendas;
  }

  static getById(id: string): Tienda | undefined {
    const data = getLocalStorageData();
    return data.tiendas.find(t => t.id === id);
  }

  static getByCompañia(compañiaId: string): Tienda[] {
    const data = getLocalStorageData();
    return data.tiendas.filter(t => t.compañia_id === compañiaId);
  }

  static create(tienda: Omit<Tienda, 'id'>): Tienda {
    const data = getLocalStorageData();
    const newTienda: Tienda = {
      ...tienda,
      id: generateId(),
    };
    data.tiendas.push(newTienda);
    setLocalStorageData(data);
    return newTienda;
  }

  static update(id: string, updates: Partial<Omit<Tienda, 'id'>>): Tienda | null {
    const data = getLocalStorageData();
    const index = data.tiendas.findIndex(t => t.id === id);
    if (index === -1) return null;

    data.tiendas[index] = { ...data.tiendas[index], ...updates };
    setLocalStorageData(data);
    return data.tiendas[index];
  }

  static delete(id: string): boolean {
    const data = getLocalStorageData();
    const index = data.tiendas.findIndex(t => t.id === id);
    if (index === -1) return false;

    data.tiendas.splice(index, 1);
    setLocalStorageData(data);
    return true;
  }
}


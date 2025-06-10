import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { Compañia } from '../types';

export class CompañiaService {
  static getAll(): Compañia[] {
    const data = getLocalStorageData();
    return data.compañias;
  }

  static getById(id: string): Compañia | undefined {
    const data = getLocalStorageData();
    return data.compañias.find(c => c.id === id);
  }

  static create(compañia: Omit<Compañia, 'id'>): Compañia {
    const data = getLocalStorageData();
    const newCompañia: Compañia = {
      ...compañia,
      id: generateId(),
    };
    data.compañias.push(newCompañia);
    setLocalStorageData(data);
    return newCompañia;
  }

  static update(id: string, updates: Partial<Omit<Compañia, 'id'>>): Compañia | null {
    const data = getLocalStorageData();
    const index = data.compañias.findIndex(c => c.id === id);
    if (index === -1) return null;

    data.compañias[index] = { ...data.compañias[index], ...updates };
    setLocalStorageData(data);
    return data.compañias[index];
  }

  static delete(id: string): boolean {
    const data = getLocalStorageData();
    const index = data.compañias.findIndex(c => c.id === id);
    if (index === -1) return false;

    data.compañias.splice(index, 1);
    setLocalStorageData(data);
    return true;
  }
}


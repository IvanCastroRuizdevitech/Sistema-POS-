import { getLocalStorageData, setLocalStorageData } from "../data/localStorage";
import { Unidad } from "../types";
import { v4 as uuidv4 } from "uuid";

export const UnidadService = {
  getAll: (): Unidad[] => {
    const data = getLocalStorageData();
    return data.unidades;
  },

  getById: (id: string): Unidad | undefined => {
    const data = getLocalStorageData();
    return data.unidades.find((unidad) => unidad.id === id);
  },

  create: (unidad: Omit<Unidad, "id">): Unidad => {
    const data = getLocalStorageData();
    const newUnidad: Unidad = { id: uuidv4(), ...unidad };
    data.unidades.push(newUnidad);
    setLocalStorageData(data);
    return newUnidad;
  },

  update: (id: string, updatedFields: Partial<Unidad>): Unidad | undefined => {
    const data = getLocalStorageData();
    const index = data.unidades.findIndex((unidad) => unidad.id === id);
    if (index > -1) {
       data.unidades[index] = { ...data.unidades[index], ...updatedFields };
    setLocalStorageData(data);
      return data.unidades[index];
    }
    return undefined;
  },

  delete: (id: string): boolean => {
    const data = getLocalStorageData();
    const initialLength = data.unidades.length;
    data.unidades = data.unidades.filter((unidad) => unidad.id !== id);
    if (data.unidades.length < initialLength) {
      setLocalStorageData(data);
      return true;
    }
    return false;
  },
};



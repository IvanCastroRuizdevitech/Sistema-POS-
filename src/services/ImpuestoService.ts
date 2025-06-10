import { getLocalStorageData, updateLocalStorageData } from "../data/localStorage";
import { Impuesto } from "../types";
import { v4 as uuidv4 } from "uuid";

export const ImpuestoService = {
  getAll: (): Impuesto[] => {
    const data = getLocalStorageData();
    return data.impuestos;
  },

  getById: (id: string): Impuesto | undefined => {
    const data = getLocalStorageData();
    return data.impuestos.find((impuesto) => impuesto.id === id);
  },

  create: (impuesto: Omit<Impuesto, "id">): Impuesto => {
    const data = getLocalStorageData();
    const newImpuesto: Impuesto = { id: uuidv4(), ...impuesto };
    data.impuestos.push(newImpuesto);
    updateLocalStorageData(data);
    return newImpuesto;
  },

  update: (id: string, updatedFields: Partial<Impuesto>): Impuesto | undefined => {
    const data = getLocalStorageData();
    const index = data.impuestos.findIndex((impuesto) => impuesto.id === id);
    if (index > -1) {
      data.impuestos[index] = { ...data.impuestos[index], ...updatedFields };
      updateLocalStorageData(data);
      return data.impuestos[index];
    }
    return undefined;
  },

  delete: (id: string): boolean => {
    const data = getLocalStorageData();
    const initialLength = data.impuestos.length;
    data.impuestos = data.impuestos.filter((impuesto) => impuesto.id !== id);
    if (data.impuestos.length < initialLength) {
      updateLocalStorageData(data);
      return true;
    }
    return false;
  },
};



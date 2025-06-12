import { companiesApiService, Company, CreateCompanyRequest, UpdateCompanyRequest, CompanyStats } from './api/companiesApiService';
import { Compañia } from '../types';

export class CompañiaService {
  static async getAll(): Promise<Compañia[]> {
    try {
      const companies = await companiesApiService.getAll();
      return companies.map(this.mapApiToLocal);
    } catch (error) {
      console.error('Error in CompañiaService.getAll:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Compañia | null> {
    try {
      const company = await companiesApiService.getById(id);
      return this.mapApiToLocal(company);
    } catch (error) {
      console.error('Error in CompañiaService.getById:', error);
      return null;
    }
  }

  static async getByNit(nit: string): Promise<Compañia | null> {
    try {
      const company = await companiesApiService.getByNit(nit);
      return company ? this.mapApiToLocal(company) : null;
    } catch (error) {
      console.error('Error in CompañiaService.getByNit:', error);
      return null;
    }
  }

  static async getStats(id: string): Promise<CompanyStats | null> {
    try {
      return await companiesApiService.getStats(id);
    } catch (error) {
      console.error('Error in CompañiaService.getStats:', error);
      return null;
    }
  }

  static async create(compañia: Omit<Compañia, 'id'>): Promise<Compañia> {
    try {
      const createRequest: CreateCompanyRequest = {
        nombre: compañia.nombre,
        nit: compañia.nit,
        direccion: compañia.direccion,
        telefono: compañia.telefono,
        email: compañia.email,
      };

      const company = await companiesApiService.create(createRequest);
      return this.mapApiToLocal(company);
    } catch (error) {
      console.error('Error in CompañiaService.create:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Omit<Compañia, 'id'>>): Promise<Compañia | null> {
    try {
      const updateRequest: UpdateCompanyRequest = {};
      
      if (updates.nombre !== undefined) updateRequest.nombre = updates.nombre;
      if (updates.nit !== undefined) updateRequest.nit = updates.nit;
      if (updates.direccion !== undefined) updateRequest.direccion = updates.direccion;
      if (updates.telefono !== undefined) updateRequest.telefono = updates.telefono;
      if (updates.email !== undefined) updateRequest.email = updates.email;

      const company = await companiesApiService.update(id, updateRequest);
      return this.mapApiToLocal(company);
    } catch (error) {
      console.error('Error in CompañiaService.update:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await companiesApiService.delete(id);
      return true;
    } catch (error) {
      console.error('Error in CompañiaService.delete:', error);
      throw error;
    }
  }

  // Helper method to map API response to local interface
  private static mapApiToLocal(company: Company): Compañia {
    return {
      id: company.id,
      nombre: company.nombre,
      nit: company.nit,
      direccion: company.direccion,
      telefono: company.telefono,
      email: company.email,
    };
  }

  // Helper method to map local interface to API request
  private static mapLocalToApi(compañia: Compañia): CreateCompanyRequest {
    return {
      nombre: compañia.nombre,
      nit: compañia.nit,
      direccion: compañia.direccion,
      telefono: compañia.telefono,
      email: compañia.email,
    };
  }
}


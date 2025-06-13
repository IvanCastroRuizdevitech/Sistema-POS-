import { apiClient } from './apiClient';
import { toast } from 'sonner';

export interface Company {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  telefono?: string;
  email?: string;
  fecha_creacion?: Date;
  activo?: boolean;
}

export interface CreateCompanyRequest {
  nombre: string;
  nit: string;
  direccion: string;
  telefono?: string;
  email?: string;
}

export interface UpdateCompanyRequest {
  nombre?: string;
  nit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface CompanyStats {
  total_tiendas: number;
  total_empleados: number;
}

class CompaniesApiService {
  async getAll(): Promise<Company[]> {
    try {
      const response = await apiClient.get<Company[]>('/companies');
      return response;
    } catch (error: any) {
      toast.error('❌ Error al obtener las compañías');
      console.error('Error fetching companies:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las compañías');
    }
  }

  async getById(id: string): Promise<Company> {
    try {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching company:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener la compañía');
    }
  }

  async getByNit(nit: string): Promise<Company | null> {
    try {
      const response = await apiClient.get<Company>(`/companies/nit/${nit}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching company by NIT:', error);
      return null;
    }
  }

  async getStats(id: string): Promise<CompanyStats> {
    try {
      const response = await apiClient.get<CompanyStats>(`/companies/${id}/stats`);
      return response;
    } catch (error: any) {
      console.error('Error fetching company stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }

  async create(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      const response = await apiClient.post<Company>('/companies', companyData);
      return response;
    } catch (error: any) {
      console.error('Error creating company:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la compañía');
    }
  }

  async update(id: string, companyData: UpdateCompanyRequest): Promise<Company> {
    try {
      const response = await apiClient.patch<Company>(`/companies/${id}`, companyData);
      return response;
    } catch (error: any) {
      console.error('Error updating company:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la compañía');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/companies/${id}`);
    } catch (error: any) {
      console.error('Error deleting company:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la compañía');
    }
  }
}

export const companiesApiService = new CompaniesApiService();
export default companiesApiService;


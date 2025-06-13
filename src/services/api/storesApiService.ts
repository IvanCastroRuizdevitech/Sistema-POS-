import { apiClient } from './apiClient';
import { toast } from 'sonner';

export interface Store {
  id: string;
  nombre: string;
  direccion: string;
  compania_id: string;
  compania_nombre?: string;
  telefono?: string;
  email?: string;
  fecha_creacion?: Date;
  activo?: boolean;
}

export interface CreateStoreRequest {
  nombre: string;
  direccion: string;
  compania_id: string;
  telefono?: string;
  email?: string;
}

export interface UpdateStoreRequest {
  nombre?: string;
  direccion?: string;
  compania_id?: string;
  telefono?: string;
  email?: string;
}

export interface StoreStats {
  total_stores: number;
  total_companies_with_stores: number;
}

class StoresApiService {
  async getAll(): Promise<Store[]> {
    try {
      const response = await apiClient.get<Store[]>('/stores');
      return response;
    } catch (error: any) {
      toast.error('❌ Error al obtener las tiendas');
      console.error('Error fetching stores:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las tiendas');
    }
  }

  async getById(id: string): Promise<Store> {
    try {
      const response = await apiClient.get<Store>(`/stores/${id}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching store:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener la tienda');
    }
  }

  async getByCompany(companyId: string): Promise<Store[]> {
    try {
      const response = await apiClient.get<Store[]>(`/stores/company/${companyId}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching stores by company:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener tiendas de la compañía');
    }
  }

  async getStats(): Promise<StoreStats> {
    try {
      const response = await apiClient.get<StoreStats>('/stores/stats');
      return response;
    } catch (error: any) {
      console.error('Error fetching store stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de tiendas');
    }
  }

  async create(storeData: CreateStoreRequest): Promise<Store> {
    try {
      const response = await apiClient.post<Store>('/stores', storeData);
      toast.success('✅ Tienda creada exitosamente');
      return response;
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al crear la tienda'}`);
      console.error('Error creating store:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la tienda');
    }
  }

  async update(id: string, storeData: UpdateStoreRequest): Promise<Store> {
    try {
      const response = await apiClient.patch<Store>(`/stores/${id}`, storeData);
      toast.success('✅ Tienda actualizada exitosamente');
      return response;
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al actualizar la tienda'}`);
      console.error('Error updating store:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la tienda');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/stores/${id}`);
      toast.success('✅ Tienda eliminada exitosamente');
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al eliminar la tienda'}`);
      console.error('Error deleting store:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la tienda');
    }
  }
}

export const storesApiService = new StoresApiService();
export default storesApiService;

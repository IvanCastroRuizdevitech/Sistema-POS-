import { apiClient } from './apiClient';
import { toast } from 'sonner';

export interface Employee {
  id: string;
  persona_id: string;
  nombre: string;
  tipo_identificacion_id: string;
  tipo_identificacion?: string;
  numero_identificacion: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  cargo: string;
  tienda_id: string;
  tienda_nombre?: string;
  fecha_contratacion: Date;
  salario: number;
  activo?: boolean;
  fecha_creacion?: Date;
}

export interface CreateEmployeeRequest {
  nombre: string;
  tipo_identificacion_id: string;
  numero_identificacion: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  cargo: string;
  tienda_id: string;
  fecha_contratacion: Date;
  salario: number;
}

export interface UpdateEmployeeRequest {
  nombre?: string;
  tipo_identificacion_id?: string;
  numero_identificacion?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  cargo?: string;
  tienda_id?: string;
  fecha_contratacion?: Date;
  salario?: number;
}

export interface EmployeeStats {
  total_employees: number;
  total_stores_with_employees: number;
  average_salary: number;
  min_salary: number;
  max_salary: number;
}

class EmployeesApiService {
  async getAll(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<Employee[]>('/employees');
      return response;
    } catch (error: any) {
      toast.error('❌ Error al obtener los empleados');
      console.error('Error fetching employees:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los empleados');
    }
  }

  async getById(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get<Employee>(`/employees/${id}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el empleado');
    }
  }

  async getByStore(storeId: string): Promise<Employee[]> {
    try {
      const response = await apiClient.get<Employee[]>(`/employees/store/${storeId}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching employees by store:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener empleados de la tienda');
    }
  }

  async getStats(): Promise<EmployeeStats> {
    try {
      const response = await apiClient.get<EmployeeStats>('/employees/stats');
      return response;
    } catch (error: any) {
      console.error('Error fetching employee stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de empleados');
    }
  }

  async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      const response = await apiClient.post<Employee>('/employees', employeeData);
      toast.success('✅ Empleado creado exitosamente');
      return response;
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al crear el empleado'}`);
      console.error('Error creating employee:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el empleado');
    }
  }

  async update(id: string, employeeData: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const response = await apiClient.patch<Employee>(`/employees/${id}`, employeeData);
      toast.success('✅ Empleado actualizado exitosamente');
      return response;
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al actualizar el empleado'}`);
      console.error('Error updating employee:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el empleado');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/employees/${id}`);
      toast.success('✅ Empleado eliminado exitosamente');
    } catch (error: any) {
      toast.error(`❌ Error: ${error.response?.data?.message || 'Error al eliminar el empleado'}`);
      console.error('Error deleting employee:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el empleado');
    }
  }
}

export const employeesApiService = new EmployeesApiService();
export default employeesApiService;

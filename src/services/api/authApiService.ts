import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  tipo_identificacion_id: string;
  numero_identificacion: string;
  rol_id: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    persona: {
      id: string;
      nombre: string;
      telefono?: string;
      direccion?: string;
      tipo_identificacion_id: string;
      numero_identificacion: string;
      tipo: string;
    };
    rol: {
      id: string;
      nombre: string;
      permisos: string;
    };
  };
}

export interface ValidateTokenResponse {
  valid: boolean;
  user: AuthResponse['user'];
}

class AuthApiService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data
      if (response.access_token) {
        apiClient.setAuthToken(response.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Store token and user data
      if (response.access_token) {
        apiClient.setAuthToken(response.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  async validateToken(): Promise<ValidateTokenResponse> {
    try {
      const response = await apiClient.get<ValidateTokenResponse>('/auth/validate');
      return response;
    } catch (error: any) {
      console.error('Token validation error:', error);
      throw new Error('Token inválido');
    }
  }

  async getProfile(): Promise<AuthResponse['user']> {
    try {
      const response = await apiClient.get<AuthResponse['user']>('/auth/profile');
      return response;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error('Error al obtener perfil');
    }
  }

  logout() {
    apiClient.removeAuthToken();
  }

  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }

  getCurrentUser(): AuthResponse['user'] | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
}

export const authApiService = new AuthApiService();
export default authApiService;


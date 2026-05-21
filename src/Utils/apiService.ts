import { BASE_URL } from '../services/constants';
import { toast } from 'react-toastify';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Ошибка входа';
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Произошла ошибка при входе';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || 'Ошибка регистрации';
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout/`, {
        method: 'POST',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Произошла ошибка при выходе';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },
};

import api from './api';
import { User, UserRole } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/profile');
  return response.data;
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.patch('/users/me/password', { currentPassword, newPassword });
};

export const logout = async (): Promise<void> => {
  // Clear token from local storage
  localStorage.removeItem('token');
};

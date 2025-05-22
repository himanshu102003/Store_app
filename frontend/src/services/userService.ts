import api from './api';
import { User, PaginatedResponse } from '../types';

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>('/users', { params: filters });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const updateUserPassword = async (data: UpdatePasswordData): Promise<void> => {
  await api.patch('/users/me/password', data);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/profile');
  return response.data;
};

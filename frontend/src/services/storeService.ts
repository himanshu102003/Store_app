import api from './api';
import { Store, PaginatedResponse } from '../types';

export interface CreateStoreData {
  name: string;
  description: string;
  address: string;
}

export interface UpdateStoreData extends Partial<CreateStoreData> {}

export interface StoreFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export const getStores = async (filters: StoreFilters = {}): Promise<PaginatedResponse<Store>> => {
  const response = await api.get<PaginatedResponse<Store>>('/stores', { params: filters });
  return response.data;
};

export const getStoreById = async (id: string): Promise<Store> => {
  const response = await api.get<Store>(`/stores/${id}`);
  return response.data;
};

export const createStore = async (data: CreateStoreData): Promise<Store> => {
  const response = await api.post<Store>('/stores', data);
  return response.data;
};

export const updateStore = async (id: string, data: UpdateStoreData): Promise<Store> => {
  const response = await api.patch<Store>(`/stores/${id}`, data);
  return response.data;
};

export const deleteStore = async (id: string): Promise<void> => {
  await api.delete(`/stores/${id}`);
};

export const getMyStore = async (): Promise<Store> => {
  const response = await api.get<Store>('/stores/my-store');
  return response.data;
};

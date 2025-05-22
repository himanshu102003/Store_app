import api from './api';
import { Rating, PaginatedResponse } from '../types';

export interface CreateRatingData {
  value: number;
  comment?: string;
}

export interface RatingFilters {
  storeId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const getRatings = async (filters: RatingFilters = {}): Promise<PaginatedResponse<Rating>> => {
  const response = await api.get<PaginatedResponse<Rating>>('/ratings', { params: filters });
  return response.data;
};

export const getRatingById = async (id: string): Promise<Rating> => {
  const response = await api.get<Rating>(`/ratings/${id}`);
  return response.data;
};

export const createRating = async (storeId: string, data: CreateRatingData): Promise<Rating> => {
  const response = await api.post<Rating>(`/ratings/${storeId}`, data);
  return response.data;
};

export const updateRating = async (id: string, data: Partial<CreateRatingData>): Promise<Rating> => {
  const response = await api.patch<Rating>(`/ratings/${id}`, data);
  return response.data;
};

export const deleteRating = async (id: string): Promise<void> => {
  await api.delete(`/ratings/${id}`);
};

export const getStoreAverageRating = async (storeId: string): Promise<number> => {
  const response = await api.get<{ average: number }>(`/ratings/store/${storeId}/average`);
  return response.data.average;
};

export const getMyRatings = async (): Promise<Rating[]> => {
  const response = await api.get<Rating[]>('/ratings/my-ratings');
  return response.data;
};

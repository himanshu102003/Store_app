export type UserRole = 'user' | 'store_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  ownerId: string;
  owner?: User;
  averageRating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  value: number;
  comment?: string;
  userId: string;
  storeId: string;
  user?: User;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

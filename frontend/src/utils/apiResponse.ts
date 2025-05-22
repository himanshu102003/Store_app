import { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export const createApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> => {
  return {
    success: response.data.success,
    data: response.data.data,
    message: response.data.message,
    error: response.data.error,
    status: response.status,
  };
};

export const createErrorResponse = <T>(
  error: any
): ApiResponse<T> => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      success: false,
      message: error.response.data?.message || 'An error occurred',
      error: error.response.data?.error || 'Unknown error',
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
      error: 'Network Error',
      status: 0,
    };
  }
  
  // Something happened in setting up the request that triggered an Error
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
    error: 'Request Error',
    status: 0,
  };
};

export const isApiResponse = <T>(
  response: unknown
): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof response.success === 'boolean'
  );
};

export const isPaginatedResponse = <T>(
  response: unknown
): response is { items: T[]; total: number; page: number; limit: number; totalPages: number } => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'items' in response &&
    'total' in response &&
    'page' in response &&
    'limit' in response &&
    'totalPages' in response
  );
};

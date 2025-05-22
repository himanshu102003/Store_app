import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from './apiResponse';
import { showToast } from './ui';

/**
 * Create an axios instance with default config
 */
export const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * Wrapper for API requests with proper typing and error handling
 */
export const apiRequest = async <T>(
  request: () => Promise<AxiosResponse<ApiResponse<T>>>,
  options?: {
    showError?: boolean;
    errorMessage?: string;
    showSuccess?: boolean;
    successMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  const {
    showError = true,
    errorMessage = 'An error occurred',
    showSuccess = false,
    successMessage = 'Operation completed successfully',
  } = options || {};

  try {
    const response = await request();
    
    if (showSuccess && successMessage) {
      showToast(successMessage, 'success');
    }
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    
    if (showError) {
      const message = error.response?.data?.message || errorMessage;
      showToast(message, 'error');
    }
    
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred',
      message: error.response?.data?.message || errorMessage,
    };
  }
};

/**
 * Create a GET request
 */
export const get = <T>(
  api: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    showError?: boolean;
    errorMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(
    () => api.get<ApiResponse<T>>(url, config),
    options
  );
};

/**
 * Create a POST request
 */
export const post = <T>(
  api: AxiosInstance,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  options?: {
    showError?: boolean;
    errorMessage?: string;
    showSuccess?: boolean;
    successMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(
    () => api.post<ApiResponse<T>>(url, data, config),
    options
  );
};

/**
 * Create a PUT request
 */
export const put = <T>(
  api: AxiosInstance,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  options?: {
    showError?: boolean;
    errorMessage?: string;
    showSuccess?: boolean;
    successMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(
    () => api.put<ApiResponse<T>>(url, data, config),
    options
  );
};

/**
 * Create a PATCH request
 */
export const patch = <T>(
  api: AxiosInstance,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  options?: {
    showError?: boolean;
    errorMessage?: string;
    showSuccess?: boolean;
    successMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(
    () => api.patch<ApiResponse<T>>(url, data, config),
    options
  );
};

/**
 * Create a DELETE request
 */
export const del = <T>(
  api: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    showError?: boolean;
    errorMessage?: string;
    showSuccess?: boolean;
    successMessage?: string;
  }
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(
    () => api.delete<ApiResponse<T>>(url, config),
    options
  );
};

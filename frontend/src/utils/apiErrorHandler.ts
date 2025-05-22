import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred'): void => {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = axiosError.response;
      
      if (status === 401) {
        // Unauthorized - redirect to login or handle token refresh
        toast.error('Session expired. Please log in again.');
        // You might want to redirect to login here
        return;
      }
      
      if (status === 403) {
        // Forbidden - user doesn't have permission
        toast.error('You do not have permission to perform this action.');
        return;
      }
      
      if (status === 404) {
        // Not found
        toast.error('The requested resource was not found.');
        return;
      }
      
      if (status === 422 && data?.errors) {
        // Validation errors
        Object.values(data.errors).flat().forEach((message) => {
          toast.error(message);
        });
        return;
      }
      
      // Handle other error messages from the server
      if (data?.message) {
        toast.error(data.message);
        return;
      }
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('No response from server:', axiosError.request);
      toast.error('Unable to connect to the server. Please try again later.');
      return;
    }
  }
  
  // Fallback error message
  console.error('Error:', error);
  toast.error(defaultMessage);
};

export const extractErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    return error.message || defaultMessage;
  }
  
  return defaultMessage;
};

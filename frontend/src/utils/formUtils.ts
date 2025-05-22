import { FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { ValidationError } from 'yup';

export const getErrorMessage = (
  errors: FieldErrors<FieldValues>,
  fieldName: string
): string | undefined => {
  const error = errors[fieldName] as FieldError | undefined;
  return error?.message;
};

export const parseYupErrors = <T extends FieldValues>(
  error: unknown
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  if (error instanceof ValidationError) {
    error.inner.forEach((err) => {
      const path = err.path as Path<T>;
      if (path && !errors[path]) {
        errors[path] = err.message;
      }
    });
  }

  return errors;
};

export const formatFormData = <T extends Record<string, any>>(data: T): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};

export const formatSelectOptions = <T extends { id: string | number; name: string }>(
  items: T[]
): { value: string; label: string }[] => {
  return items.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
};

export const formatCurrencyInput = (value: string): number => {
  // Remove any non-digit characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // Parse to float and round to 2 decimal places
  const number = parseFloat(numericValue);
  return isNaN(number) ? 0 : Math.round(number * 100) / 100;
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  
  return value;
};

export const formatCreditCardNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as XXXX XXXX XXXX XXXX
  const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4]]
      .filter(Boolean)
      .join(' ');
  }
  
  return value;
};

export const formatExpiryDate = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as MM/YY
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})$/);
  if (match) {
    return match[1] + (match[2] ? `/${match[2]}` : '');
  }
  
  return value;
};

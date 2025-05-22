import api from '../services/api';
import { handleApiError } from './apiErrorHandler';

export const uploadFile = async (
  file: File,
  presignedUrl: string
): Promise<{ url: string }> => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    // Return the URL without the query parameters
    return { url: presignedUrl.split('?')[0] };
  } catch (error) {
    handleApiError(error, 'Failed to upload file');
    throw error;
  }
};

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  folder = 'uploads'
): Promise<{ url: string }> => {
  try {
    const response = await api.get<{ url: string }>('/upload/presigned-url', {
      params: { fileName, fileType, folder },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to get upload URL');
    throw error;
  }
};

export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (file: File) => void
): void => {
  const file = event.target.files?.[0];
  if (file) {
    // Validate file type if needed
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File is too large. Maximum size is 5MB.');
    }

    callback(file);
  }
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

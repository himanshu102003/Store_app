import { toast, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'loading';

const toastConfig: ToastOptions = {
  position: 'top-right',
  duration: 5000,
};

export const showToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
): string => {
  const mergedOptions = { ...toastConfig, ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, mergedOptions);
    case 'error':
      return toast.error(message, mergedOptions);
    case 'loading':
      return toast.loading(message, mergedOptions);
    case 'info':
    default:
      return toast(message, mergedOptions);
  }
};

export const dismissToast = (toastId?: string): void => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({
    top: 0,
    behavior,
  });
};

export const copyToClipboard = (text: string): boolean => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const truncateText = (text: string, maxLength: number, ellipsis = '...'): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + ellipsis;
};

export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isElementInViewport = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const toggleFullscreen = (element: HTMLElement = document.documentElement): void => {
  if (!document.fullscreenElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};

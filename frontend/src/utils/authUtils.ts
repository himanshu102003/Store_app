import { UserRole } from '../types';

/**
 * Check if the current user has the required role
 * @param userRole The user's role
 * @param requiredRole The required role
 * @returns boolean
 */
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    store_owner: 2,
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Check if the current user has any of the required roles
 * @param userRole The user's role
 * @param requiredRoles Array of required roles
 * @returns boolean
 */
export const hasAnyRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.some((role) => hasRole(userRole, role));
};

/**
 * Check if the current user has all the required roles
 * @param userRole The user's role
 * @param requiredRoles Array of required roles
 * @returns boolean
 */
export const hasAllRoles = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.every((role) => hasRole(userRole, role));
};

/**
 * Get the highest role from an array of roles
 * @param roles Array of roles
 * @returns UserRole
 */
export const getHighestRole = (roles: UserRole[]): UserRole => {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    store_owner: 2,
    admin: 3,
  };

  return roles.reduce((highest, current) => {
    return roleHierarchy[current] > roleHierarchy[highest] ? current : highest;
  }, 'user' as UserRole);
};

/**
 * Check if the current user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Redirect to login page if not authenticated
 */
export const requireAuth = (): void => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
};

/**
 * Redirect to home page if already authenticated
 */
export const requireGuest = (): void => {
  if (isAuthenticated()) {
    window.location.href = '/';
  }
};

/**
 * Get the current user's role
 * @returns UserRole or null if not authenticated
 */
export const getCurrentUserRole = (): UserRole | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'user';
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Get the current user's ID
 * @returns string or null if not authenticated
 */
export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

import { atom } from 'jotai';
import { User } from '../types';
import { authAPI } from '../utils/api';

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);

// Derived atoms
export const authStateAtom = atom(
  (get) => ({
    user: get(userAtom),
    isAuthenticated: get(isAuthenticatedAtom),
    isLoading: get(isLoadingAtom),
    error: get(authErrorAtom),
  })
);

// Action atoms
export const loginAtom = atom(
  null,
  async (get, set, { email, password }: { email: string; password: string }) => {
    try {
      set(isLoadingAtom, true);
      set(authErrorAtom, null);
      
      const { user } = await authAPI.login(email, password);
      
      set(userAtom, user);
      set(isAuthenticatedAtom, true);
    } catch (error) {
      set(authErrorAtom, error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      set(isLoadingAtom, false);
    }
  }
);

export const registerAtom = atom(
  null,
  async (get, set, { name, email, password }: { name: string; email: string; password: string }) => {
    try {
      set(isLoadingAtom, true);
      set(authErrorAtom, null);
      
      const { user } = await authAPI.register(name, email, password);
      
      set(userAtom, user);
      set(isAuthenticatedAtom, true);
    } catch (error) {
      set(authErrorAtom, error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      set(isLoadingAtom, false);
    }
  }
);

export const logoutAtom = atom(
  null,
  (get, set) => {
    authAPI.logout();
    set(userAtom, null);
    set(isAuthenticatedAtom, false);
  }
);

export const initAuthAtom = atom(
  null,
  async (get, set) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      set(isAuthenticatedAtom, false);
      set(userAtom, null);
      return;
    }
    
    try {
      set(isLoadingAtom, true);
      const user = await authAPI.getCurrentUser();
      set(userAtom, user);
      set(isAuthenticatedAtom, true);
    } catch (error) {
      // Token might be invalid or expired
      localStorage.removeItem('authToken');
      set(isAuthenticatedAtom, false);
      set(userAtom, null);
    } finally {
      set(isLoadingAtom, false);
    }
  }
);
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser, setToken, logout as logoutAction } from '@/store/slices/authSlice';
import api from '@/services/api';
import type { User, UserRole } from '@/types';

// ===== useAuth =====
export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector(s => s.auth);

  // Hydrate from localStorage + validate with backend on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('smp_auth_token');
    const storedUser = localStorage.getItem('smp_auth_user');

    if (storedToken && storedUser && !isAuthenticated) {
      dispatch(setToken(storedToken));
      dispatch(setUser(JSON.parse(storedUser)));

      // Validate token with backend
      api.get('/auth/me')
        .then((res) => {
          const backendUser = res.data.user;
          dispatch(setUser(backendUser));
          localStorage.setItem('smp_auth_user', JSON.stringify(backendUser));
        })
        .catch(() => {
          // Token invalid — clear everything
          localStorage.removeItem('smp_auth_token');
          localStorage.removeItem('smp_auth_user');
          dispatch(logoutAction());
        });
    }
  }, [dispatch, isAuthenticated]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('smp_auth_token', newToken);
      localStorage.setItem('smp_auth_user', JSON.stringify(userData));

      dispatch(setToken(newToken));
      dispatch(setUser(userData));

      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password';
      return { success: false, error: message };
    }
  }, [dispatch]);

  const register = useCallback(async (data: { schoolName: string; adminName: string; email: string; phone: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/onboard', {
        school: {
          name: data.schoolName,
          email: data.email,
          phone: data.phone,
        },
        admin: {
          name: data.adminName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        },
      });

      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('smp_auth_token', newToken);
      localStorage.setItem('smp_auth_user', JSON.stringify(userData));

      dispatch(setToken(newToken));
      dispatch(setUser(userData));

      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('smp_auth_token');
    localStorage.removeItem('smp_auth_user');
    dispatch(logoutAction());
    router.push('/login');
  }, [dispatch, router]);

  const getDashboardPath = useCallback((role?: UserRole) => {
    const r = role || user?.role;
    return `/dashboard/${r}`;
  }, [user]);

  return { user, token, isAuthenticated, login, register, logout, getDashboardPath };
}

// ===== useDebounce =====
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ===== useLocalStorage =====
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch { /* ignore */ }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}

// ===== useRequireAuth =====
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('smp_auth_token');
    const storedUser = localStorage.getItem('smp_auth_user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    setChecked(true);
  }, [router, allowedRoles]);

  return { user, isAuthenticated, checked };
}

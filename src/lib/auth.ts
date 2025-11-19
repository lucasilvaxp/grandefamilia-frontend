"use client";

import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { email: string } | null;
}

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_USER_KEY = 'admin_user';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string, user: { email: string }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthUser(): { email: string } | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();
    
    setAuthState({
      isAuthenticated: !!token,
      token,
      user,
    });
    setIsLoading(false);
  }, []);

  const login = (token: string, user: { email: string }) => {
    setAuthToken(token, user);
    setAuthState({
      isAuthenticated: true,
      token,
      user,
    });
  };

  const logout = () => {
    clearAuthToken();
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return {
    ...authState,
    isLoading,
    login,
    logout,
  };
}

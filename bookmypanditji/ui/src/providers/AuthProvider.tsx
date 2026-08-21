'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, AuthTokens, api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { identifier: string; password: string }) => Promise<void>;
  register: (data: { email?: string; phone?: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRefreshToken && storedUser) {
      setTokens({ accessToken: storedToken, refreshToken: storedRefreshToken, expiresIn: 0 });
      setUser(JSON.parse(storedUser));
      
      // Validate token by fetching user profile
      try {
        const response = await api.getMe();
        if (response.success) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        // Token invalid, clear auth
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setTokens(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = async (data: { identifier: string; password: string }) => {
    const response = await api.login(data);
    if (response.success) {
      const { user: userData, tokens: tokensData } = response.data;
      setUser(userData);
      setTokens(tokensData);
      localStorage.setItem('accessToken', tokensData.accessToken);
      localStorage.setItem('refreshToken', tokensData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Login failed');
    }
  };

  const register = async (data: { email?: string; phone?: string; password: string; name: string }) => {
    const response = await api.register(data);
    if (response.success) {
      const { user: userData, tokens: tokensData } = response.data;
      setUser(userData);
      setTokens(tokensData);
      localStorage.setItem('accessToken', tokensData.accessToken);
      localStorage.setItem('refreshToken', tokensData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      await api.logout(tokens?.refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getMe();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await api.updateProfile(data);
    if (response.success) {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      throw new Error('Profile update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
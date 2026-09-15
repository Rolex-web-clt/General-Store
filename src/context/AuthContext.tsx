/**
 * Auth Context & Provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  loginDemo: (role: 'ADMIN' | 'CUSTOMER') => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check initial user on page load
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        }
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.success) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await api.register({ name, email, password: pass, phone });
    if (res.success) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    const res = await api.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.changePassword({ currentPassword, newPassword });
  };

  const loginDemo = async (role: 'ADMIN' | 'CUSTOMER') => {
    if (role === 'ADMIN') {
      await login('admin@generalstore.com', 'admin123');
    } else {
      await login('customer@example.com', 'customer123');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        loginDemo,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

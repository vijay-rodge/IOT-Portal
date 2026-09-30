import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogleCredential: (credential: string) => Promise<void>;
  setAuthSession: (user: User, accessToken: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuthSession = (newUser: User, accessToken: string) => {
    setUser(newUser);
    setAccessToken(accessToken);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  };

  // Restore session on initial load using httpOnly refresh token cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        const { user: refreshedUser, accessToken } = res.data.data;
        setUser(refreshedUser);
        setAccessToken(accessToken);
      } catch (err) {
        // No valid session, user is logged out
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, accessToken } = res.data.data;
    setAuthSession(loggedInUser, accessToken);
  };

  const register = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    const res = await api.post('/auth/register', data);
    const { user: registeredUser, accessToken } = res.data.data;
    setAuthSession(registeredUser, accessToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const loginWithGoogleCredential = async (credential: string) => {
    const res = await api.post('/auth/google/token', { credential });
    const { user: googleUser, accessToken } = res.data.data;
    setAuthSession(googleUser, accessToken);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === ('ADMIN' as UserRole);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        loginWithGoogleCredential,
        setAuthSession,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

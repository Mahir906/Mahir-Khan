import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, AdminUser, getAuthToken, getStoredUser, setAuthSession, clearAuthSession } from '../services/api.ts';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  setupFirstAdmin: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getAdminMe();
      if (res.success && res.user) {
        setUser(res.user);
        setToken(currentToken);
        setAuthSession(currentToken, res.user);
      } else {
        clearAuthSession();
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      clearAuthSession();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.loginAdmin({ email, password: pass });
    if (res.success && res.token && res.user) {
      setAuthSession(res.token, res.user);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const setupFirstAdmin = async (email: string, pass: string, name: string) => {
    const res = await api.setupAdmin({ email, password: pass, name });
    if (res.success && res.token && res.user) {
      setAuthSession(res.token, res.user);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        setupFirstAdmin,
        logout,
        refreshUser,
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

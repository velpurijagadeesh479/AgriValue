import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { getAuthData, isAuthenticated as checkAuth, logout as performLogout, saveAuthData } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        setLoading(false);
        return;
      }

      const cachedUser = getAuthData();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const { user: currentUser } = await apiRequest('/auth/me');
        setUser(currentUser);
        saveAuthData({ token: localStorage.getItem('authToken'), user: currentUser });
      } catch {
        performLogout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (session) => {
    saveAuthData(session);
    setUser(session.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    performLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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

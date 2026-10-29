import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('learnrec_token');
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        try {
          // Verify token validity by calling /auth/me
          const response = await authService.getCurrentUser();
          if (response?.data) {
            setUser(response.data);
            localStorage.setItem('learnrec_user', JSON.stringify(response.data));
          }
        } catch {
          // Token expired or invalid
          authService.logout();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password });
    if (response?.data) {
      const { accessToken, refreshToken, id, email: userEmail, fullName, roles } = response.data;
      const userData = { id, email: userEmail, fullName, roles };

      localStorage.setItem('learnrec_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('learnrec_refresh_token', refreshToken);
      }
      localStorage.setItem('learnrec_user', JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response?.message || 'Login failed');
  }, []);

  const register = useCallback(async (registrationData) => {
    const response = await authService.register(registrationData);
    return response;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUserProfile = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response?.data) {
        setUser(response.data);
        localStorage.setItem('learnrec_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;

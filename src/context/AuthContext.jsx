import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Try to verify the token with the backend
          try {
            const response = await authAPI.verifyToken();
            if (response.success) {
              setUser(response.user);
            } else {
              // Token is invalid, clear local storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
            // Token is invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
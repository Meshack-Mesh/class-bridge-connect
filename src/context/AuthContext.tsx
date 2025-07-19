import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.verifyToken();
        if (response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.user.name}!`,
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || 'Please check your credentials and try again.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    try {
      setLoading(true);
      const response = await authAPI.register({ name, email, password, confirmPassword: password, role });
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast({
          title: "Registration Successful",
          description: `Welcome to EduConnect, ${response.data.user.name}!`,
        });
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || 'Please try again with different details.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      // Even if API call fails, remove local token
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await authAPI.resetPassword(email);
      if (response.success) {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
      } else {
        throw new Error(response.error || 'Password reset failed');
      }
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || 'Please try again.',
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
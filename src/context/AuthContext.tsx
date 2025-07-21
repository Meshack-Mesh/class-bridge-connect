import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authAPI, userAPI } from '@/services/api';
import type { User, RegisterFormData, ProfileFormData, PasswordChangeFormData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterFormData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profileData: ProfileFormData) => Promise<User>;
  changePassword: (passwordData: PasswordChangeFormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = authAPI.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      return userData;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message || 'Login failed',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterFormData): Promise<User> => {
    setLoading(true);
    try {
      const newUser = await authAPI.register(userData);
      setUser(newUser);
      toast({
        title: "Registration Successful",
        description: `Welcome to EduConnect, ${newUser.name}!`,
      });
      return newUser;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || error.message || 'Registration failed',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileFormData): Promise<User> => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    try {
      const updatedUser = await userAPI.updateProfile(profileData);
      setUser(updatedUser);
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData: PasswordChangeFormData): Promise<void> => {
    setLoading(true);
    try {
      await userAPI.changePassword(passwordData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
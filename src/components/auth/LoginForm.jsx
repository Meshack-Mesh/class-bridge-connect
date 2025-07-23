import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User, Lock, GraduationCap, BookOpen } from 'lucide-react';

export const LoginForm = ({ isLoading, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // email or registration number for login
    email: '',
    registrationNumber: '',
    password: '',
    role: 'student',
    action: 'login',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const validateForm = () => {
    const { name, identifier, email, registrationNumber, password, action } = formData;

    if (!password) return 'Password is required.';

    if (action === 'register') {
      if (!name) return 'Full name is required.';
      if (formData.role === 'teacher' && !email) return 'Email is required for teachers.';
      if (formData.role === 'student' && !registrationNumber)
        return 'Registration number is required for students.';
    } else {
      if (!identifier) return 'Email or Registration Number is required.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      
      if (formData.action === 'login') {
        const success = await login({
          identifier: formData.identifier,
          password: formData.password
        });
        
        if (success) {
          if (onSuccess) onSuccess();
        }
      } else {
        const success = await register({
          name: formData.name,
          email: formData.role === 'teacher' ? formData.email : undefined,
          registrationNumber: formData.role === 'student' ? formData.registrationNumber : undefined,
          password: formData.password,
          role: formData.role
        });
        
        if (success) {
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="backdrop-blur-lg bg-card/95 border border-border/50 shadow-lg">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-2">
            {formData.action === 'login' ? (
              <User className="w-6 h-6 text-primary-foreground" />
            ) : (
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {formData.action === 'login' ? 'Welcome Back' : 'Join EduConnect'}
          </CardTitle>
          <CardDescription className="text-sm">
            {formData.action === 'login'
              ? 'Sign in to your account'
              : 'Create your account and start learning'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formData.action === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        {formData.role === 'teacher' ? (
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        )}
                        <SelectValue placeholder="Select your role" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Teacher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-10"
                      required
                    />
                  </div>
                )}

                {formData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-sm font-medium">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      type="text"
                      name="registrationNumber"
                      placeholder="Enter your registration number"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="h-10"
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium">
                {formData.action === 'login' ? 'Email or Registration Number' : 'Email/Registration'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="identifier"
                  type="text"
                  name="identifier"
                  placeholder={formData.action === 'login' ? 'Enter your email or registration number' : 'Auto-filled based on role'}
                  value={formData.identifier}
                  onChange={handleChange}
                  className="pl-10 h-10"
                  required={formData.action === 'login'}
                  disabled={formData.action === 'register'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center p-3 rounded-md">
                {errorMessage}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || isLoading} 
              className="w-full h-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {(loading || isLoading) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : formData.action === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    action: formData.action === 'login' ? 'register' : 'login',
                  })
                }
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
              >
                {formData.action === 'login'
                  ? "Don't have an account? Register here"
                  : 'Already have an account? Sign in here'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

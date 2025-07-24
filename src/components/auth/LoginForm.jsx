import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const LoginForm = ({ isLoading = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    action: 'login',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, password, confirmPassword, email, action } = formData;

    if (!name || !password) return 'Full name and password are required.';
    if (!email) return 'Email is required.';

    if (action === 'register') {
      if (!confirmPassword) return 'Please confirm your password.';
      if (password !== confirmPassword) return 'Passwords do not match.';
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
      const endpoint =
        formData.action === 'login'
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

      const payload =
        formData.action === 'login'
          ? {
              email: formData.email,
              password: formData.password,
              role: formData.role,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              role: formData.role,
            };

      const response = await axios.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (onSuccess) onSuccess(response.data.user);

        const { role } = response.data.user;
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      } else {
        setErrorMessage('Authentication failed: Token not received');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold">
            {formData.action === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {formData.action === 'login'
              ? 'Sign in to your account'
              : 'Register to use EduConnect'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {formData.action === 'register' && (
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-500 text-center">{errorMessage}</div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? 'Processing...'
                : formData.action === 'login'
                ? 'Sign In'
                : 'Register'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'student',
                    action: formData.action === 'login' ? 'register' : 'login',
                  })
                }
                className="text-sm text-blue-600 hover:underline"
              >
                {formData.action === 'login'
                  ? "Don't have an account? Register"
                  : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

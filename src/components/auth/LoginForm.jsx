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
    const { name, email, password, confirmPassword, action } = formData;
    if (!email || !password) return 'Email and password are required.';
    if (action === 'register') {
      if (!name) return 'Full name is required.';
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-tr from-blue-100 via-white to-purple-100">
      {/* Left Welcome Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col justify-center items-center p-10 text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-xl">
          Welcome to EduConnect
        </h1>
        <p className="text-lg text-center max-w-md font-medium">
          Learn, grow, and stay connected. Log in to access your personalized dashboard.
        </p>
      </div>

      {/* Right Login/Register Section */}
      <div className="flex items-center justify-center p-6 bg-gray-100">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200 bg-white">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold">
              {formData.action === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {formData.action === 'login'
                ? 'Sign in to your account'
                : 'Register to use EduConnect'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formData.action === 'register' && (
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
              )}

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

              {errorMessage && (
                <div className="text-sm text-red-500 text-center font-medium">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full mt-2">
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
                  className="text-sm text-blue-600 hover:underline font-semibold"
                >
                  {formData.action === 'login'
                    ? "Don't have an account? Register"
                    : 'Already have an account? Sign In'}
                </button>
              </div>

              {/* Role Selection at the Bottom */}
              <div className="pt-6 text-center">
                <p className="font-semibold text-gray-700 mb-2">Sign In As:</p>
                <div className="flex justify-center gap-8">
                  <label className="flex items-center gap-2 font-bold text-purple-600">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={handleChange}
                      className="accent-purple-500"
                    />
                    Student
                  </label>
                  <label className="flex items-center gap-2 font-bold text-pink-600">
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={formData.role === 'teacher'}
                      onChange={handleChange}
                      className="accent-pink-500"
                    />
                    Teacher
                  </label>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

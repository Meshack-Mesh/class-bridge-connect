import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

export const LoginForm = ({ isLoading, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    password: '',
    role: 'student',
    action: 'login',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const validateForm = () => {
    const { name, email, registrationNumber, password, role, action } = formData;

    if (!role || !password) return 'Role and password are required.';

    if (action === 'register') {
      if (!name) return 'Full name is required.';
      if (role === 'teacher' && !email) return 'Email is required for teachers.';
      if (role === 'student' && !registrationNumber)
        return 'Registration number is required for students.';
    } else {
      if (role === 'teacher' && !email) return 'Email is required for teachers.';
      if (role === 'student' && !registrationNumber)
        return 'Registration number is required for students.';
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
      const payload =
        formData.role === 'teacher'
          ? { email: formData.email, password: formData.password }
          : { registrationNumber: formData.registrationNumber, password: formData.password };

      if (formData.action === 'register') {
        payload.name = formData.name;
        payload.role = formData.role;
      }

      const endpoint =
        formData.action === 'login'
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

      const response = await axios.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Success!');

        if (onSuccess) onSuccess(response.data.user);

        const { role } = response.data.user;
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      } else {
        setErrorMessage('Authentication failed: Token not received');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage(
        error.response?.data?.message || 'An unexpected error occurred'
      );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>
          {formData.action === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {formData.action === 'login'
            ? 'Sign in to your account'
            : 'Register for EduConnect'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.action === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {formData.role === 'teacher' ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                placeholder="Enter your registration number"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? 'Processing...'
              : formData.action === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  action: formData.action === 'login' ? 'register' : 'login',
                })
              }
              className="text-sm text-primary hover:underline"
            >
              {formData.action === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    action: 'login', // or 'register'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      {formData.action === 'register' && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLoading
          ? 'Processing...'
          : formData.action === 'login'
          ? 'Login'
          : 'Register'}
      </button>

      <p
        onClick={() =>
          setFormData({
            ...formData,
            action: formData.action === 'login' ? 'register' : 'login',
          })
        }
        className="text-center text-blue-500 hover:underline cursor-pointer"
      >
        {formData.action === 'login'
          ? "Don't have an account? Register"
          : 'Already have an account? Login'}
      </p>
    </form>
  );
};

// API service for EduConnect MERN backend
import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Export the api instance for direct use
export { api };

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    console.log('Login attempt:', credentials);
    
    const loginData = {
      password: credentials.password
    };

    // Add email for teachers or registrationNumber for students
    if (credentials.email) {
      loginData.email = credentials.email;
    } else if (credentials.registrationNumber) {
      loginData.registrationNumber = credentials.registrationNumber;
    }

    const response = await api.post('/auth/login', loginData);
    const userData = response.data;
    
    // Store token and user data
    if (userData.success && userData.token) {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
    }
    
    return userData;
  },

  register: async (userData) => {
    console.log('Registration attempt:', userData);
    
    const registerData = {
      username: userData.name, // Map 'name' to 'username' for backend
      password: userData.password,
      role: userData.role
    };

    // Add email for teachers or registrationNumber for students
    if (userData.role === 'teacher') {
      registerData.email = userData.email;
    } else if (userData.role === 'student') {
      registerData.registrationNumber = userData.registrationNumber;
    }

    const response = await api.post('/auth/register', registerData);
    const newUser = response.data;
    
    // Store token and user data
    if (newUser.success && newUser.token) {
      localStorage.setItem('token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser.user));
    }
    
    return newUser;
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Classes API
export const classesAPI = {
  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  createClass: async (classData) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  getClass: async (classId) => {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  },

  updateClass: async (classId, classData) => {
    const response = await api.put(`/classes/${classId}`, classData);
    return response.data;
  },

  deleteClass: async (classId) => {
    await api.delete(`/classes/${classId}`);
  },

  joinClass: async (inviteCode) => {
    const response = await api.post('/classes/join', { inviteCode });
    return response.data;
  },
};

// Assignments API
export const assignmentsAPI = {
  getAssignments: async (classId) => {
    const url = classId ? `/assignments?classId=${classId}` : '/assignments';
    const response = await api.get(url);
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const formData = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('description', assignmentData.description);
    formData.append('classId', assignmentData.classId);
    formData.append('dueDate', assignmentData.dueDate);
    formData.append('maxGrade', assignmentData.maxGrade.toString());
    
    if (assignmentData.instructions) {
      formData.append('instructions', assignmentData.instructions);
    }
    
    if (assignmentData.attachments) {
      assignmentData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAssignment: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    await api.delete(`/assignments/${assignmentId}`);
  },
};

// User/Profile API
export const userAPI = {
  updateProfile: async (profileData) => {
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    
    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar);
    }

    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    await api.put('/users/change-password', passwordData);
  },
};

// Submissions API
export const submissionsAPI = {
  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    
    if (submissionData.content) {
      formData.append('content', submissionData.content);
    }
    
    if (submissionData.attachments) {
      submissionData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(`/submissions/${assignmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  gradeSubmission: async (submissionId, grade, feedback) => {
    const response = await api.put(`/submissions/${submissionId}/grade`, { grade, feedback });
    return response.data;
  },
};

// Announcements API
export const announcementsAPI = {
  getAnnouncements: async (classId) => {
    const response = await api.get(`/announcements?classId=${classId}`);
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const formData = new FormData();
    formData.append('title', announcementData.title);
    formData.append('content', announcementData.content);
    formData.append('classId', announcementData.classId);
    
    if (announcementData.attachments) {
      announcementData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post('/announcements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};
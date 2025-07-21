// API service for EduConnect MERN backend
import axios from 'axios';
import {
  User, Class, Assignment, Submission, Announcement, Message, Notification,
  ApiResponse, PaginatedResponse, LoginFormData, RegisterFormData,
  ClassFormData, AssignmentFormData, SubmissionFormData, AnnouncementFormData,
  ProfileFormData, PasswordChangeFormData
} from '@/types';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<User & { token: string }> => {
    console.log('Auth attempt:', { email, password: 'mkoo09', action: 'login' });
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    
    // Store token and user data
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  },

  register: async (userData: RegisterFormData): Promise<User & { token: string }> => {
    const response = await api.post('/auth/register', userData);
    const newUser = response.data;
    
    // Store token and user data
    localStorage.setItem('token', newUser.token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return newUser;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  verifyToken: async (): Promise<User> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Classes API
export const classesAPI = {
  getClasses: async (): Promise<Class[]> => {
    const response = await api.get('/classes');
    return response.data;
  },

  createClass: async (classData: ClassFormData): Promise<Class> => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  getClass: async (classId: string): Promise<Class> => {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  },

  updateClass: async (classId: string, classData: Partial<ClassFormData>): Promise<Class> => {
    const response = await api.put(`/classes/${classId}`, classData);
    return response.data;
  },

  deleteClass: async (classId: string): Promise<void> => {
    await api.delete(`/classes/${classId}`);
  },

  joinClass: async (inviteCode: string): Promise<Class> => {
    const response = await api.post('/classes/join', { inviteCode });
    return response.data;
  },
};

// Assignments API
export const assignmentsAPI = {
  getAssignments: async (classId?: string): Promise<Assignment[]> => {
    const url = classId ? `/assignments?classId=${classId}` : '/assignments';
    const response = await api.get(url);
    return response.data;
  },

  createAssignment: async (assignmentData: AssignmentFormData): Promise<Assignment> => {
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

  getAssignment: async (assignmentId: string): Promise<Assignment> => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  updateAssignment: async (assignmentId: string, assignmentData: Partial<AssignmentFormData>): Promise<Assignment> => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId: string): Promise<void> => {
    await api.delete(`/assignments/${assignmentId}`);
  },
};

// User/Profile API
export const userAPI = {
  updateProfile: async (profileData: ProfileFormData): Promise<User> => {
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

  changePassword: async (passwordData: PasswordChangeFormData): Promise<void> => {
    await api.put('/users/change-password', passwordData);
  },
};

// Submissions API
export const submissionsAPI = {
  submitAssignment: async (assignmentId: string, submissionData: SubmissionFormData): Promise<Submission> => {
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

  getSubmissions: async (assignmentId: string): Promise<Submission[]> => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  gradeSubmission: async (submissionId: string, grade: number, feedback?: string): Promise<Submission> => {
    const response = await api.put(`/submissions/${submissionId}/grade`, { grade, feedback });
    return response.data;
  },
};

// Announcements API
export const announcementsAPI = {
  getAnnouncements: async (classId: string): Promise<Announcement[]> => {
    const response = await api.get(`/announcements?classId=${classId}`);
    return response.data;
  },

  createAnnouncement: async (announcementData: AnnouncementFormData): Promise<Announcement> => {
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
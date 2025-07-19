// API service for MERN backend integration
import {
  User, Class, Assignment, Submission, Announcement, Message, Notification,
  ApiResponse, PaginatedResponse, LoginFormData, RegisterFormData,
  ClassFormData, AssignmentFormData, SubmissionFormData, AnnouncementFormData,
  ProfileFormData, PasswordChangeFormData
} from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


class ApiService {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async upload(endpoint: string, formData: FormData): Promise<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Upload error');
    }
  }
}

const apiService = new ApiService();

// Authentication API
export const authAPI = {
  login: (data: LoginFormData) => 
    apiService.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterFormData) => 
    apiService.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => 
    apiService.request('/auth/logout', { method: 'POST' }),

  verifyToken: () => 
    apiService.request<User>('/auth/verify'),

  resetPassword: (email: string) => 
    apiService.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  changePassword: (data: PasswordChangeFormData) => 
    apiService.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// User/Profile API
export const userAPI = {
  getProfile: () => 
    apiService.request<User>('/users/profile'),

  updateProfile: (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    return apiService.upload('/users/profile', formData);
  },

  changePassword: (data: PasswordChangeFormData) => 
    apiService.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getNotifications: () => 
    apiService.request<Notification[]>('/users/notifications'),

  markNotificationRead: (notificationId: string) => 
    apiService.request(`/users/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),
};

// Classes API
export const classAPI = {
  getClasses: () => 
    apiService.request<Class[]>('/classes'),

  getClass: (classId: string) => 
    apiService.request<Class>(`/classes/${classId}`),

  createClass: (data: ClassFormData) => 
    apiService.request<Class>('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateClass: (classId: string, data: Partial<ClassFormData>) => 
    apiService.request<Class>(`/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteClass: (classId: string) => 
    apiService.request(`/classes/${classId}`, {
      method: 'DELETE',
    }),

  joinClass: (inviteCode: string) => 
    apiService.request<Class>('/classes/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    }),

  leaveClass: (classId: string) => 
    apiService.request(`/classes/${classId}/leave`, {
      method: 'POST',
    }),

  addStudent: (classId: string, studentEmail: string) => 
    apiService.request(`/classes/${classId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentEmail }),
    }),

  removeStudent: (classId: string, studentId: string) => 
    apiService.request(`/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
    }),

  getClassStudents: (classId: string) => 
    apiService.request<User[]>(`/classes/${classId}/students`),
};

// Assignments API
export const assignmentAPI = {
  getAssignments: (classId?: string) => 
    apiService.request<Assignment[]>(`/assignments${classId ? `?classId=${classId}` : ''}`),

  getAssignment: (assignmentId: string) => 
    apiService.request<Assignment>(`/assignments/${assignmentId}`),

  createAssignment: (data: AssignmentFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('classId', data.classId);
    formData.append('dueDate', data.dueDate);
    formData.append('maxGrade', data.maxGrade.toString());
    if (data.instructions) {
      formData.append('instructions', data.instructions);
    }
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }
    return apiService.upload('/assignments', formData);
  },

  updateAssignment: (assignmentId: string, data: Partial<AssignmentFormData>) => 
    apiService.request<Assignment>(`/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAssignment: (assignmentId: string) => 
    apiService.request(`/assignments/${assignmentId}`, {
      method: 'DELETE',
    }),

  getSubmissions: (assignmentId: string) => 
    apiService.request<Submission[]>(`/assignments/${assignmentId}/submissions`),

  getMySubmission: (assignmentId: string) => 
    apiService.request<Submission>(`/assignments/${assignmentId}/my-submission`),
};

// Submissions API
export const submissionAPI = {
  submitAssignment: (assignmentId: string, data: SubmissionFormData) => {
    const formData = new FormData();
    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    return apiService.upload(`/submissions/${assignmentId}`, formData);
  },

  updateSubmission: (submissionId: string, data: SubmissionFormData) => {
    const formData = new FormData();
    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    return apiService.upload(`/submissions/${submissionId}`, formData);
  },

  gradeSubmission: (submissionId: string, grade: number, feedback?: string) => 
    apiService.request<Submission>(`/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify({ grade, feedback }),
    }),

  getSubmission: (submissionId: string) => 
    apiService.request<Submission>(`/submissions/${submissionId}`),
};

// Announcements API
export const announcementAPI = {
  getAnnouncements: (classId: string) => 
    apiService.request<Announcement[]>(`/announcements?classId=${classId}`),

  getAnnouncement: (announcementId: string) => 
    apiService.request<Announcement>(`/announcements/${announcementId}`),

  createAnnouncement: (data: AnnouncementFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('classId', data.classId);
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    return apiService.upload('/announcements', formData);
  },

  updateAnnouncement: (announcementId: string, data: Partial<AnnouncementFormData>) => 
    apiService.request<Announcement>(`/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAnnouncement: (announcementId: string) => 
    apiService.request(`/announcements/${announcementId}`, {
      method: 'DELETE',
    }),

  addComment: (announcementId: string, content: string) => 
    apiService.request(`/announcements/${announcementId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Messages API
export const messageAPI = {
  getMessages: (userId?: string) => 
    apiService.request<Message[]>(`/messages${userId ? `?userId=${userId}` : ''}`),

  sendMessage: (recipientId: string, content: string, classId?: string) => 
    apiService.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, content, classId }),
    }),

  markMessageRead: (messageId: string) => 
    apiService.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    }),

  getConversations: () => 
    apiService.request<{ user: User; lastMessage: Message; unreadCount: number }[]>('/messages/conversations'),
};

// Analytics API (for teachers)
export const analyticsAPI = {
  getClassAnalytics: (classId: string) => 
    apiService.request<{
      studentCount: number;
      assignmentCount: number;
      averageGrade: number;
      submissionRate: number;
      studentPerformance: { student: User; averageGrade: number; submissionRate: number }[];
    }>(`/analytics/classes/${classId}`),

  getAssignmentAnalytics: (assignmentId: string) => 
    apiService.request<{
      submissionCount: number;
      averageGrade: number;
      gradeDistribution: { range: string; count: number }[];
      lateSubmissions: number;
    }>(`/analytics/assignments/${assignmentId}`),

  getStudentProgress: (studentId?: string) => 
    apiService.request<{
      overallGrade: number;
      submissionRate: number;
      recentGrades: { assignment: Assignment; grade: number; date: string }[];
      improvementTrend: 'up' | 'down' | 'stable';
    }>(`/analytics/student-progress${studentId ? `?studentId=${studentId}` : ''}`),
};
// Global type definitions for EduConnect

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  _id: string;
  name: string;
  subject: string;
  description: string;
  teacher: User;
  students: User[];
  inviteCode: string;
  color: string;
  schedule?: {
    day: string;
    time: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  class: Class;
  teacher: User;
  dueDate: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  maxGrade: number;
  submissions: Submission[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  assignment: Assignment;
  student: User;
  content?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  grade?: number;
  feedback?: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  class: Class;
  teacher: User;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  announcement: Announcement;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  recipient: User;
  class?: Class;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'message' | 'class';
  user: User;
  read: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher';
}

export interface ClassFormData {
  name: string;
  subject: string;
  description: string;
  color: string;
  schedule?: {
    day: string;
    time: string;
  }[];
}

export interface AssignmentFormData {
  title: string;
  description: string;
  instructions?: string;
  classId: string;
  dueDate: string;
  maxGrade: number;
  attachments?: File[];
}

export interface SubmissionFormData {
  content?: string;
  attachments?: File[];
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  classId: string;
  attachments?: File[];
}

export interface ProfileFormData {
  name: string;
  email: string;
  avatar?: File;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
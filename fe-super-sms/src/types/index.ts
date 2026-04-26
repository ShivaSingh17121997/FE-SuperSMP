// ===== User & Auth Types =====
export type UserRole = 'super-admin' | 'school-admin' | 'principal' | 'teacher' | 'parent' | 'student' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  schoolName: string;
  adminName: string;
  email: string;
  password: string;
  phone: string;
}

// ===== School Types =====
export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  principalName: string;
  studentsCount: number;
  teachersCount: number;
  plan: 'starter' | 'professional' | 'enterprise';
  isActive: boolean;
  createdAt: string;
}

// ===== Student Types =====
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodGroup?: string;
  admissionDate: string;
  isActive: boolean;
  schoolId?: string;
}

// ===== Teacher Types =====
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  employeeId: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: number;
  joinDate: string;
  salary: number;
  isActive: boolean;
  schoolId?: string;
}

// ===== Attendance Types =====
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  class: string;
  section: string;
  markedBy: string;
}

// ===== Homework Types =====
export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  assignedBy: string;
  attachments?: string[];
  submissions: number;
  totalStudents: number;
  createdAt: string;
}

// ===== Exam Types =====
export interface Exam {
  id: string;
  name: string;
  type: 'unit-test' | 'mid-term' | 'final' | 'quiz';
  class: string;
  subject: string;
  date: string;
  totalMarks: number;
  duration: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  percentage: number;
}

// ===== Fee Types =====
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: PaymentStatus;
  type: 'tuition' | 'transport' | 'library' | 'lab' | 'other';
  createdAt: string;
}

// ===== Notice Types =====
export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'urgent';
  author: string;
  targetAudience: UserRole[];
  isPublished: boolean;
  createdAt: string;
}

// ===== Event Types =====
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  type: 'holiday' | 'exam' | 'event' | 'meeting';
  color: string;
}

// ===== Staff Types =====
export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  isActive: boolean;
}

// ===== Dashboard Stats =====
export interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Notification Types =====
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// ===== UI State =====
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  isMobileMenuOpen: boolean;
}

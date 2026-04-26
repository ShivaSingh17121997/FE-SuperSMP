/**
 * LocalStorage Database Service
 * Acts as a complete DB replacement for testing.
 * Seeds initial data on first load, provides full CRUD.
 */

import { mockStudents, mockTeachers, mockAttendance, mockHomework, mockExams, mockResults, mockFees, mockNotices, mockEvents, mockStaff, mockSchools, mockNotifications } from '@/lib/mock-data';
import type { Student, Teacher, AttendanceRecord, Homework, Exam, ExamResult, FeeInvoice, Notice, CalendarEvent, Staff, School, Notification, User } from '@/types';

// ===== Seed Users (credentials for login) =====
export interface DBUser extends User {
  password: string;
}

const SEED_USERS: DBUser[] = [
  { id: 'u1', name: 'Platform Admin', email: 'superadmin@supersmp.com', password: 'admin123', role: 'super-admin', isActive: true, createdAt: '2024-01-01', phone: '+91-9999999999' },
  { id: 'u2', name: 'Rajesh Kumar', email: 'admin@dps.edu', password: 'school123', role: 'school-admin', isActive: true, createdAt: '2024-01-15', schoolId: '1', phone: '+91-9876543200' },
  { id: 'u3', name: 'Dr. Priya Sharma', email: 'principal@dps.edu', password: 'principal123', role: 'principal', isActive: true, createdAt: '2024-01-15', schoolId: '1', phone: '+91-9876543201' },
  { id: 'u4', name: 'Dr. Meena Iyer', email: 'meena@school.edu', password: 'teacher123', role: 'teacher', isActive: true, createdAt: '2018-06-15', schoolId: '1', phone: '+91-9876543220' },
  { id: 'u5', name: 'Rakesh Mehta', email: 'rakesh@school.edu', password: 'teacher123', role: 'teacher', isActive: true, createdAt: '2020-01-10', schoolId: '1', phone: '+91-9876543221' },
  { id: 'u6', name: 'Vikram Patel', email: 'parent@email.com', password: 'parent123', role: 'parent', isActive: true, createdAt: '2020-04-01', schoolId: '1', phone: '+91-9876543200' },
  { id: 'u7', name: 'Aarav Patel', email: 'aarav@student.edu', password: 'student123', role: 'student', isActive: true, createdAt: '2020-04-01', schoolId: '1', phone: '+91-9876543210' },
];

// Keys
const KEYS = {
  users: 'smp_users',
  students: 'smp_students',
  teachers: 'smp_teachers',
  attendance: 'smp_attendance',
  homework: 'smp_homework',
  exams: 'smp_exams',
  results: 'smp_results',
  fees: 'smp_fees',
  notices: 'smp_notices',
  events: 'smp_events',
  staff: 'smp_staff',
  schools: 'smp_schools',
  notifications: 'smp_notifications',
  authToken: 'smp_auth_token',
  authUser: 'smp_auth_user',
  seeded: 'smp_seeded',
} as const;

// ===== Helper Functions =====
function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// ===== Seed Database =====
export function seedDatabase(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.seeded)) return;

  setItem(KEYS.users, SEED_USERS);
  setItem(KEYS.students, mockStudents);
  setItem(KEYS.teachers, mockTeachers);
  setItem(KEYS.attendance, mockAttendance);
  setItem(KEYS.homework, mockHomework);
  setItem(KEYS.exams, mockExams);
  setItem(KEYS.results, mockResults);
  setItem(KEYS.fees, mockFees);
  setItem(KEYS.notices, mockNotices);
  setItem(KEYS.events, mockEvents);
  setItem(KEYS.staff, mockStaff);
  setItem(KEYS.schools, mockSchools);
  setItem(KEYS.notifications, mockNotifications);

  localStorage.setItem(KEYS.seeded, 'true');
}

// ===== Auth Service =====
export const authService = {
  login(email: string, password: string): { user: User; token: string } | null {
    const users = getItem<DBUser>(KEYS.users);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;

    const token = `smp_token_${user.id}_${Date.now()}`;
    const { password: _, ...userData } = user;

    localStorage.setItem(KEYS.authToken, token);
    localStorage.setItem(KEYS.authUser, JSON.stringify(userData));

    return { user: userData, token };
  },

  logout(): void {
    localStorage.removeItem(KEYS.authToken);
    localStorage.removeItem(KEYS.authUser);
  },

  getSession(): { user: User; token: string } | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(KEYS.authToken);
    const userData = localStorage.getItem(KEYS.authUser);
    if (!token || !userData) return null;
    return { user: JSON.parse(userData), token };
  },

  isAuthenticated(): boolean {
    return !!this.getSession();
  },

  register(data: { schoolName: string; adminName: string; email: string; phone: string; password: string }): { user: User; token: string } {
    const users = getItem<DBUser>(KEYS.users);
    const schoolId = generateId();
    const userId = generateId();

    // Create school
    const schools = getItem<School>(KEYS.schools);
    schools.push({
      id: schoolId, name: data.schoolName, address: '', city: '', state: '',
      phone: data.phone, email: data.email, principalName: data.adminName,
      studentsCount: 0, teachersCount: 0, plan: 'starter', isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setItem(KEYS.schools, schools);

    // Create user
    const newUser: DBUser = {
      id: userId, name: data.adminName, email: data.email,
      password: data.password, role: 'school-admin', isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      schoolId, phone: data.phone,
    };
    users.push(newUser);
    setItem(KEYS.users, users);

    const { password: _, ...userData } = newUser;
    const token = `smp_token_${userId}_${Date.now()}`;
    localStorage.setItem(KEYS.authToken, token);
    localStorage.setItem(KEYS.authUser, JSON.stringify(userData));

    return { user: userData, token };
  },

  onboardSchool(data: { schoolName: string; principalName: string; email: string; phone: string; password: string; city: string; state: string; address: string; plan: School['plan'] }): { school: School; user: User } {
    const users = getItem<DBUser>(KEYS.users);
    const schools = getItem<School>(KEYS.schools);
    const schoolId = generateId();
    const userId = generateId();

    const newSchool: School = {
      id: schoolId,
      name: data.schoolName,
      address: data.address,
      city: data.city,
      state: data.state,
      phone: data.phone,
      email: data.email,
      principalName: data.principalName,
      studentsCount: 0,
      teachersCount: 0,
      plan: data.plan,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    schools.push(newSchool);
    setItem(KEYS.schools, schools);

    const newUser: DBUser = {
      id: userId,
      name: data.principalName,
      email: data.email,
      password: data.password,
      role: 'school-admin',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      schoolId,
      phone: data.phone,
    };
    users.push(newUser);
    setItem(KEYS.users, users);

    const { password: _, ...userData } = newUser;
    return { school: newSchool, user: userData };
  },

  getAllUsers(): User[] {
    return getItem<DBUser>(KEYS.users).map(({ password: _, ...u }) => u);
  },
};

// ===== Generic CRUD Service =====
function createCRUD<T extends { id: string }>(key: string) {
  return {
    getAll(): T[] {
      return getItem<T>(key);
    },
    getById(id: string): T | undefined {
      return getItem<T>(key).find(item => item.id === id);
    },
    create(item: Omit<T, 'id'>): T {
      const items = getItem<T>(key);
      const newItem = { ...item, id: generateId() } as T;
      items.push(newItem);
      setItem(key, items);
      return newItem;
    },
    update(id: string, updates: Partial<T>): T | undefined {
      const items = getItem<T>(key);
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return undefined;
      items[index] = { ...items[index], ...updates };
      setItem(key, items);
      return items[index];
    },
    delete(id: string): boolean {
      const items = getItem<T>(key);
      const filtered = items.filter(item => item.id !== id);
      if (filtered.length === items.length) return false;
      setItem(key, filtered);
      return true;
    },
    search(query: string, fields: (keyof T)[]): T[] {
      const items = getItem<T>(key);
      const q = query.toLowerCase();
      return items.filter(item =>
        fields.some(field => String(item[field]).toLowerCase().includes(q))
      );
    },
    filter(predicate: (item: T) => boolean): T[] {
      return getItem<T>(key).filter(predicate);
    },
    count(): number {
      return getItem<T>(key).length;
    },
  };
}

// ===== Module Services =====
export const studentService = {
  ...createCRUD<Student>(KEYS.students),
  createWithAccounts(studentData: Omit<Student, 'id'>, studentPassword: string, parentPassword: string): { student: Student } {
    const student = this.create(studentData);
    const users = getItem<DBUser>(KEYS.users);
    
    // Create Student User
    users.push({
      id: generateId(),
      name: student.name,
      email: student.email,
      password: studentPassword,
      role: 'student',
      isActive: true,
      createdAt: student.admissionDate,
      schoolId: student.schoolId || '1',
      phone: student.phone || '',
    });

    // Create Parent User
    if (student.parentEmail) {
      users.push({
        id: generateId(),
        name: student.parentName || 'Parent',
        email: student.parentEmail,
        password: parentPassword,
        role: 'parent',
        isActive: true,
        createdAt: student.admissionDate,
        schoolId: student.schoolId || '1',
        phone: student.parentPhone || '',
      });
    }

    setItem(KEYS.users, users);
    return { student };
  }
};

export const teacherService = {
  ...createCRUD<Teacher>(KEYS.teachers),
  createWithAccount(teacherData: Omit<Teacher, 'id'>, password: string): Teacher {
    const teacher = this.create(teacherData);
    const users = getItem<DBUser>(KEYS.users);
    
    users.push({
      id: generateId(),
      name: teacher.name,
      email: teacher.email,
      password: password,
      role: 'teacher',
      isActive: true,
      createdAt: teacher.joinDate,
      schoolId: teacher.schoolId || '1',
      phone: teacher.phone || '',
    });

    setItem(KEYS.users, users);
    return teacher;
  }
};

export const attendanceService = createCRUD<AttendanceRecord>(KEYS.attendance);
export const homeworkService = createCRUD<Homework>(KEYS.homework);
export const examService = createCRUD<Exam>(KEYS.exams);
export const resultService = createCRUD<ExamResult>(KEYS.results);
export const feeService = createCRUD<FeeInvoice>(KEYS.fees);
export const noticeService = createCRUD<Notice>(KEYS.notices);
export const eventService = createCRUD<CalendarEvent>(KEYS.events);
export const staffService = createCRUD<Staff>(KEYS.staff);
export const schoolService = createCRUD<School>(KEYS.schools);
export const notificationService = createCRUD<Notification>(KEYS.notifications);

// ===== Teacher-specific =====
export interface ClassTeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  class: string;
  section: string;
  assignedDate: string;
}

const CLASS_TEACHER_KEY = 'smp_class_teachers';

export const classTeacherService = {
  ...createCRUD<ClassTeacherAssignment>(CLASS_TEACHER_KEY),

  getByClass(cls: string, section: string): ClassTeacherAssignment | undefined {
    return getItem<ClassTeacherAssignment>(CLASS_TEACHER_KEY)
      .find(ct => ct.class === cls && ct.section === section);
  },

  getByTeacher(teacherId: string): ClassTeacherAssignment[] {
    return getItem<ClassTeacherAssignment>(CLASS_TEACHER_KEY)
      .filter(ct => ct.teacherId === teacherId);
  },

  assign(teacherId: string, teacherName: string, cls: string, section: string): ClassTeacherAssignment {
    const items = getItem<ClassTeacherAssignment>(CLASS_TEACHER_KEY);
    // Remove existing assignment for this class/section
    const filtered = items.filter(ct => !(ct.class === cls && ct.section === section));
    const assignment: ClassTeacherAssignment = {
      id: generateId(), teacherId, teacherName,
      class: cls, section, assignedDate: new Date().toISOString().split('T')[0],
    };
    filtered.push(assignment);
    setItem(CLASS_TEACHER_KEY, filtered);
    return assignment;
  },

  unassign(cls: string, section: string): void {
    const items = getItem<ClassTeacherAssignment>(CLASS_TEACHER_KEY);
    setItem(CLASS_TEACHER_KEY, items.filter(ct => !(ct.class === cls && ct.section === section)));
  },
};

// ===== Dashboard Stats Helpers =====
export const dashboardService = {
  getSchoolAdminStats() {
    return {
      totalStudents: studentService.count(),
      totalTeachers: teacherService.count(),
      totalStaff: staffService.count(),
      feeCollected: feeService.getAll().reduce((sum, f) => sum + f.paidAmount, 0),
      feePending: feeService.getAll().reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      attendanceToday: attendanceService.filter(a => a.date === new Date().toISOString().split('T')[0]),
      activeHomework: homeworkService.getAll().length,
      recentNotices: noticeService.getAll().slice(0, 5),
    };
  },

  getSuperAdminStats() {
    return {
      totalSchools: schoolService.count(),
      totalUsers: authService.getAllUsers().length,
      totalStudents: studentService.count(),
      totalTeachers: teacherService.count(),
    };
  },
};

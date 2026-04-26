import type { Student, Teacher, AttendanceRecord, Homework, Exam, ExamResult, FeeInvoice, Notice, CalendarEvent, Staff, School, Notification } from '@/types';

export const mockSchools: School[] = [
  { id: '1', name: 'Delhi Public School', address: '123 Education Lane', city: 'New Delhi', state: 'Delhi', phone: '+91-11-2345-6789', email: 'admin@dps.edu', principalName: 'Dr. Priya Sharma', studentsCount: 1850, teachersCount: 95, plan: 'enterprise', isActive: true, createdAt: '2024-01-15' },
  { id: '2', name: "St. Xavier's Academy", address: '456 Scholar Ave', city: 'Mumbai', state: 'Maharashtra', phone: '+91-22-3456-7890', email: 'admin@stxaviers.edu', principalName: 'Fr. Joseph D\'Souza', studentsCount: 1200, teachersCount: 65, plan: 'professional', isActive: true, createdAt: '2024-02-20' },
  { id: '3', name: 'Greenwood International', address: '789 Green Rd', city: 'Bangalore', state: 'Karnataka', phone: '+91-80-4567-8901', email: 'admin@greenwood.edu', principalName: 'Mrs. Anita Desai', studentsCount: 980, teachersCount: 52, plan: 'professional', isActive: true, createdAt: '2024-03-10' },
  { id: '4', name: 'National Model School', address: '321 National Highway', city: 'Hyderabad', state: 'Telangana', phone: '+91-40-5678-9012', email: 'admin@nms.edu', principalName: 'Mr. Ravi Teja', studentsCount: 750, teachersCount: 40, plan: 'starter', isActive: true, createdAt: '2024-04-05' },
  { id: '5', name: 'Cambridge School', address: '654 British Lane', city: 'Pune', state: 'Maharashtra', phone: '+91-20-6789-0123', email: 'admin@cambridge.edu', principalName: 'Dr. Sarah Williams', studentsCount: 1500, teachersCount: 78, plan: 'enterprise', isActive: true, createdAt: '2024-05-12' },
];

export const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Patel', email: 'aarav@student.edu', phone: '+91-9876543210', rollNumber: '2024001', class: '10', section: 'A', parentName: 'Vikram Patel', parentPhone: '+91-9876543200', parentEmail: 'vikram@email.com', dateOfBirth: '2010-03-15', gender: 'male', address: '123 Main St, Delhi', bloodGroup: 'B+', admissionDate: '2020-04-01', isActive: true },
  { id: '2', name: 'Priya Singh', email: 'priya@student.edu', phone: '+91-9876543211', rollNumber: '2024002', class: '10', section: 'A', parentName: 'Rajesh Singh', parentPhone: '+91-9876543201', parentEmail: 'rajesh@email.com', dateOfBirth: '2010-07-22', gender: 'female', address: '456 Park Ave, Delhi', bloodGroup: 'A+', admissionDate: '2020-04-01', isActive: true },
  { id: '3', name: 'Arjun Kumar', email: 'arjun@student.edu', phone: '+91-9876543212', rollNumber: '2024003', class: '9', section: 'B', parentName: 'Suresh Kumar', parentPhone: '+91-9876543202', parentEmail: 'suresh@email.com', dateOfBirth: '2011-01-10', gender: 'male', address: '789 Oak Rd, Delhi', bloodGroup: 'O+', admissionDate: '2021-04-01', isActive: true },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@student.edu', phone: '+91-9876543213', rollNumber: '2024004', class: '9', section: 'A', parentName: 'Kiran Reddy', parentPhone: '+91-9876543203', parentEmail: 'kiran@email.com', dateOfBirth: '2011-05-18', gender: 'female', address: '321 Elm St, Delhi', bloodGroup: 'AB+', admissionDate: '2021-04-01', isActive: true },
  { id: '5', name: 'Rohan Gupta', email: 'rohan@student.edu', phone: '+91-9876543214', rollNumber: '2024005', class: '8', section: 'C', parentName: 'Amit Gupta', parentPhone: '+91-9876543204', parentEmail: 'amit@email.com', dateOfBirth: '2012-09-30', gender: 'male', address: '654 Pine Ave, Delhi', bloodGroup: 'B-', admissionDate: '2022-04-01', isActive: true },
  { id: '6', name: 'Kavya Nair', email: 'kavya@student.edu', phone: '+91-9876543215', rollNumber: '2024006', class: '10', section: 'B', parentName: 'Mohan Nair', parentPhone: '+91-9876543205', parentEmail: 'mohan@email.com', dateOfBirth: '2010-11-12', gender: 'female', address: '987 Cedar Ln, Delhi', bloodGroup: 'O-', admissionDate: '2020-04-01', isActive: true },
  { id: '7', name: 'Sahil Verma', email: 'sahil@student.edu', phone: '+91-9876543216', rollNumber: '2024007', class: '8', section: 'A', parentName: 'Deepak Verma', parentPhone: '+91-9876543206', parentEmail: 'deepak@email.com', dateOfBirth: '2012-04-25', gender: 'male', address: '147 Birch Rd, Delhi', bloodGroup: 'A-', admissionDate: '2022-04-01', isActive: true },
  { id: '8', name: 'Ishita Sharma', email: 'ishita@student.edu', phone: '+91-9876543217', rollNumber: '2024008', class: '11', section: 'A', parentName: 'Rahul Sharma', parentPhone: '+91-9876543207', parentEmail: 'rahul@email.com', dateOfBirth: '2009-08-07', gender: 'female', address: '258 Maple Dr, Delhi', bloodGroup: 'B+', admissionDate: '2019-04-01', isActive: true },
];

export const mockTeachers: Teacher[] = [
  { id: '1', name: 'Dr. Meena Iyer', email: 'meena@school.edu', phone: '+91-9876543220', employeeId: 'T001', department: 'Science', subjects: ['Physics', 'Chemistry'], qualification: 'Ph.D. Physics', experience: 12, joinDate: '2018-06-15', salary: 65000, isActive: true },
  { id: '2', name: 'Rakesh Mehta', email: 'rakesh@school.edu', phone: '+91-9876543221', employeeId: 'T002', department: 'Mathematics', subjects: ['Mathematics'], qualification: 'M.Sc. Mathematics', experience: 8, joinDate: '2020-01-10', salary: 55000, isActive: true },
  { id: '3', name: 'Sunita Rao', email: 'sunita@school.edu', phone: '+91-9876543222', employeeId: 'T003', department: 'English', subjects: ['English'], qualification: 'M.A. English Literature', experience: 15, joinDate: '2015-07-20', salary: 70000, isActive: true },
  { id: '4', name: 'Amir Khan', email: 'amir@school.edu', phone: '+91-9876543223', employeeId: 'T004', department: 'Computer Science', subjects: ['Computer Science'], qualification: 'B.Tech + M.Ed', experience: 6, joinDate: '2021-08-01', salary: 50000, isActive: true },
  { id: '5', name: 'Lakshmi Devi', email: 'lakshmi@school.edu', phone: '+91-9876543224', employeeId: 'T005', department: 'Hindi', subjects: ['Hindi'], qualification: 'M.A. Hindi', experience: 20, joinDate: '2010-03-05', salary: 75000, isActive: true },
  { id: '6', name: 'Vikas Joshi', email: 'vikas@school.edu', phone: '+91-9876543225', employeeId: 'T006', department: 'Social Studies', subjects: ['History', 'Geography'], qualification: 'M.A. History', experience: 10, joinDate: '2019-04-12', salary: 58000, isActive: true },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', studentName: 'Aarav Patel', date: '2026-04-18', status: 'present', class: '10', section: 'A', markedBy: 'Dr. Meena Iyer' },
  { id: '2', studentId: '2', studentName: 'Priya Singh', date: '2026-04-18', status: 'present', class: '10', section: 'A', markedBy: 'Dr. Meena Iyer' },
  { id: '3', studentId: '3', studentName: 'Arjun Kumar', date: '2026-04-18', status: 'absent', class: '9', section: 'B', markedBy: 'Rakesh Mehta' },
  { id: '4', studentId: '4', studentName: 'Sneha Reddy', date: '2026-04-18', status: 'late', class: '9', section: 'A', markedBy: 'Rakesh Mehta' },
  { id: '5', studentId: '5', studentName: 'Rohan Gupta', date: '2026-04-18', status: 'present', class: '8', section: 'C', markedBy: 'Sunita Rao' },
  { id: '6', studentId: '6', studentName: 'Kavya Nair', date: '2026-04-18', status: 'present', class: '10', section: 'B', markedBy: 'Dr. Meena Iyer' },
  { id: '7', studentId: '7', studentName: 'Sahil Verma', date: '2026-04-18', status: 'half-day', class: '8', section: 'A', markedBy: 'Sunita Rao' },
  { id: '8', studentId: '8', studentName: 'Ishita Sharma', date: '2026-04-18', status: 'present', class: '11', section: 'A', markedBy: 'Amir Khan' },
];

export const mockHomework: Homework[] = [
  { id: '1', title: 'Quadratic Equations Practice', description: 'Solve exercises 5.1 to 5.3 from NCERT', subject: 'Mathematics', class: '10', section: 'A', dueDate: '2026-04-20', assignedBy: 'Rakesh Mehta', submissions: 28, totalStudents: 35, createdAt: '2026-04-16' },
  { id: '2', title: 'Essay on Climate Change', description: 'Write a 500-word essay on effects of climate change', subject: 'English', class: '10', section: 'A', dueDate: '2026-04-22', assignedBy: 'Sunita Rao', submissions: 15, totalStudents: 35, createdAt: '2026-04-15' },
  { id: '3', title: 'Newton\'s Laws Worksheet', description: 'Complete the worksheet on Newton\'s three laws of motion', subject: 'Physics', class: '9', section: 'B', dueDate: '2026-04-19', assignedBy: 'Dr. Meena Iyer', submissions: 30, totalStudents: 32, createdAt: '2026-04-14' },
  { id: '4', title: 'Python Programming Assignment', description: 'Create a calculator program using functions', subject: 'Computer Science', class: '11', section: 'A', dueDate: '2026-04-25', assignedBy: 'Amir Khan', submissions: 10, totalStudents: 28, createdAt: '2026-04-17' },
];

export const mockExams: Exam[] = [
  { id: '1', name: 'Mid-Term Examination', type: 'mid-term', class: '10', subject: 'Mathematics', date: '2026-05-10', totalMarks: 100, duration: 180, status: 'upcoming' },
  { id: '2', name: 'Unit Test 3', type: 'unit-test', class: '10', subject: 'Science', date: '2026-04-25', totalMarks: 50, duration: 60, status: 'upcoming' },
  { id: '3', name: 'Final Exam', type: 'final', class: '9', subject: 'English', date: '2026-06-15', totalMarks: 100, duration: 180, status: 'upcoming' },
  { id: '4', name: 'Weekly Quiz', type: 'quiz', class: '8', subject: 'Computer Science', date: '2026-04-18', totalMarks: 25, duration: 30, status: 'completed' },
];

export const mockResults: ExamResult[] = [
  { id: '1', studentId: '1', studentName: 'Aarav Patel', examId: '4', marksObtained: 23, totalMarks: 25, grade: 'A+', percentage: 92 },
  { id: '2', studentId: '2', studentName: 'Priya Singh', examId: '4', marksObtained: 21, totalMarks: 25, grade: 'A', percentage: 84 },
  { id: '3', studentId: '3', studentName: 'Arjun Kumar', examId: '4', marksObtained: 18, totalMarks: 25, grade: 'B+', percentage: 72 },
  { id: '4', studentId: '4', studentName: 'Sneha Reddy', examId: '4', marksObtained: 24, totalMarks: 25, grade: 'A+', percentage: 96 },
  { id: '5', studentId: '5', studentName: 'Rohan Gupta', examId: '4', marksObtained: 15, totalMarks: 25, grade: 'B', percentage: 60 },
];

export const mockFees: FeeInvoice[] = [
  { id: 'INV-001', studentId: '1', studentName: 'Aarav Patel', class: '10-A', amount: 25000, paidAmount: 25000, dueDate: '2026-04-30', status: 'paid', type: 'tuition', createdAt: '2026-04-01' },
  { id: 'INV-002', studentId: '2', studentName: 'Priya Singh', class: '10-A', amount: 25000, paidAmount: 15000, dueDate: '2026-04-30', status: 'partial', type: 'tuition', createdAt: '2026-04-01' },
  { id: 'INV-003', studentId: '3', studentName: 'Arjun Kumar', class: '9-B', amount: 22000, paidAmount: 0, dueDate: '2026-04-15', status: 'overdue', type: 'tuition', createdAt: '2026-03-15' },
  { id: 'INV-004', studentId: '4', studentName: 'Sneha Reddy', class: '9-A', amount: 22000, paidAmount: 22000, dueDate: '2026-04-30', status: 'paid', type: 'tuition', createdAt: '2026-04-01' },
  { id: 'INV-005', studentId: '5', studentName: 'Rohan Gupta', class: '8-C', amount: 20000, paidAmount: 0, dueDate: '2026-04-30', status: 'pending', type: 'tuition', createdAt: '2026-04-01' },
  { id: 'INV-006', studentId: '1', studentName: 'Aarav Patel', class: '10-A', amount: 5000, paidAmount: 5000, dueDate: '2026-04-30', status: 'paid', type: 'transport', createdAt: '2026-04-01' },
  { id: 'INV-007', studentId: '6', studentName: 'Kavya Nair', class: '10-B', amount: 25000, paidAmount: 0, dueDate: '2026-04-20', status: 'overdue', type: 'tuition', createdAt: '2026-03-20' },
];

export const mockNotices: Notice[] = [
  { id: '1', title: 'Annual Day Celebration', content: 'The school annual day will be held on May 15th. All students are requested to participate in the cultural programs.', category: 'event', author: 'Principal', targetAudience: ['school-admin', 'teacher', 'parent', 'student'], isPublished: true, createdAt: '2026-04-15' },
  { id: '2', title: 'Mid-Term Exam Schedule Released', content: 'The mid-term examination schedule for all classes has been released. Please check the exam portal for details.', category: 'academic', author: 'Exam Coordinator', targetAudience: ['teacher', 'parent', 'student'], isPublished: true, createdAt: '2026-04-14' },
  { id: '3', title: 'Parent-Teacher Meeting', content: 'PTM scheduled for April 25th, Saturday. Time: 10 AM to 1 PM. Attendance is mandatory.', category: 'general', author: 'School Admin', targetAudience: ['teacher', 'parent'], isPublished: true, createdAt: '2026-04-12' },
  { id: '4', title: 'School Closed - Public Holiday', content: 'School will remain closed on April 21st on account of a public holiday.', category: 'urgent', author: 'School Admin', targetAudience: ['school-admin', 'teacher', 'parent', 'student'], isPublished: true, createdAt: '2026-04-10' },
];

export const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Annual Day', description: 'School annual day celebration', date: '2026-05-15', type: 'event', color: '#6366f1' },
  { id: '2', title: 'Mid-Term Exams', description: 'Mid-term examinations begin', date: '2026-05-10', endDate: '2026-05-20', type: 'exam', color: '#f59e0b' },
  { id: '3', title: 'PTM', description: 'Parent-teacher meeting', date: '2026-04-25', type: 'meeting', color: '#10b981' },
  { id: '4', title: 'Republic Day', description: 'National holiday', date: '2026-01-26', type: 'holiday', color: '#ef4444' },
  { id: '5', title: 'Summer Vacation', description: 'Summer vacation begins', date: '2026-06-01', endDate: '2026-06-30', type: 'holiday', color: '#ef4444' },
  { id: '6', title: 'Sports Day', description: 'Annual sports day', date: '2026-04-28', type: 'event', color: '#6366f1' },
];

export const mockStaff: Staff[] = [
  { id: '1', name: 'Ramesh Driver', role: 'Driver', department: 'Transport', phone: '+91-9876543230', email: 'ramesh@school.edu', joinDate: '2019-01-15', salary: 18000, isActive: true },
  { id: '2', name: 'Suresh Peon', role: 'Peon', department: 'Administration', phone: '+91-9876543231', email: 'suresh@school.edu', joinDate: '2020-03-10', salary: 12000, isActive: true },
  { id: '3', name: 'Geeta Clerk', role: 'Clerk', department: 'Office', phone: '+91-9876543232', email: 'geeta@school.edu', joinDate: '2018-06-20', salary: 22000, isActive: true },
  { id: '4', name: 'Ravi Guard', role: 'Security Guard', department: 'Security', phone: '+91-9876543233', email: 'ravi@school.edu', joinDate: '2017-11-05', salary: 15000, isActive: true },
  { id: '5', name: 'Meera Cook', role: 'Cook', department: 'Canteen', phone: '+91-9876543234', email: 'meera@school.edu', joinDate: '2021-02-14', salary: 16000, isActive: true },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'New Student Registered', message: 'Aarav Patel has been registered in Class 10-A', type: 'info', isRead: false, createdAt: '2026-04-18T09:30:00' },
  { id: '2', title: 'Fee Payment Received', message: 'Payment of ₹25,000 received from Vikram Patel', type: 'success', isRead: false, createdAt: '2026-04-18T09:15:00' },
  { id: '3', title: 'Attendance Alert', message: '5 students absent in Class 9-B today', type: 'warning', isRead: true, createdAt: '2026-04-18T08:45:00' },
  { id: '4', title: 'Homework Overdue', message: '12 submissions pending for "Quadratic Equations"', type: 'error', isRead: false, createdAt: '2026-04-17T16:00:00' },
];

// Chart data
export const attendanceChartData = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 95, absent: 5 },
  { month: 'Apr', present: 90, absent: 10 },
  { month: 'May', present: 87, absent: 13 },
  { month: 'Jun', present: 93, absent: 7 },
];

export const feeCollectionData = [
  { month: 'Jan', collected: 850000, pending: 150000 },
  { month: 'Feb', collected: 920000, pending: 80000 },
  { month: 'Mar', collected: 780000, pending: 220000 },
  { month: 'Apr', collected: 650000, pending: 350000 },
  { month: 'May', collected: 900000, pending: 100000 },
  { month: 'Jun', collected: 950000, pending: 50000 },
];

export const studentPerformanceData = [
  { subject: 'Math', average: 78 },
  { subject: 'Science', average: 82 },
  { subject: 'English', average: 75 },
  { subject: 'Hindi', average: 85 },
  { subject: 'SST', average: 80 },
  { subject: 'CS', average: 90 },
];

export const enrollmentTrendData = [
  { year: '2021', students: 1200 },
  { year: '2022', students: 1450 },
  { year: '2023', students: 1620 },
  { year: '2024', students: 1780 },
  { year: '2025', students: 1850 },
  { year: '2026', students: 2100 },
];

export const revenueData = [
  { month: 'Jan', revenue: 1250000 },
  { month: 'Feb', revenue: 1180000 },
  { month: 'Mar', revenue: 1350000 },
  { month: 'Apr', revenue: 1420000 },
  { month: 'May', revenue: 1280000 },
  { month: 'Jun', revenue: 1500000 },
];

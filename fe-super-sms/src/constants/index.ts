import {
  LayoutDashboard, Users, GraduationCap, ClipboardList, BookOpen,
  FileText, CreditCard, Bell, Calendar, BarChart3, Settings,
  Building2, Shield, UserCheck, BookCheck, Megaphone, Bus
} from 'lucide-react';
import type { UserRole } from '@/types';

export const APP_NAME = 'SuperSMP';
export const APP_TAGLINE = 'Manage Your Entire School in One Smart Platform';
export const APP_DESCRIPTION = 'The all-in-one school management platform trusted by 500+ schools. Manage students, teachers, attendance, fees, exams, and more.';

export const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'school-admin', label: 'School Admin' },
  { value: 'principal', label: 'Principal' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
];

export const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const SECTIONS = ['A', 'B', 'C', 'D'];
export const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super-admin', 'school-admin', 'principal', 'teacher', 'parent', 'student', 'staff'] },
  { label: 'Schools', href: '/dashboard/schools', icon: Building2, roles: ['super-admin'] },
  { label: 'Students', href: '/dashboard/students', icon: GraduationCap, roles: ['super-admin', 'school-admin', 'principal', 'teacher'] },
  { label: 'Teachers', href: '/dashboard/teachers', icon: Users, roles: ['super-admin', 'school-admin', 'principal'] },
  { label: 'Attendance', href: '/dashboard/attendance', icon: ClipboardList, roles: ['school-admin', 'principal', 'teacher', 'parent', 'student'] },
  { label: 'Homework', href: '/dashboard/homework', icon: BookOpen, roles: ['school-admin', 'principal', 'teacher', 'parent', 'student'] },
  { label: 'Exams', href: '/dashboard/exams', icon: FileText, roles: ['school-admin', 'principal', 'teacher', 'parent', 'student'] },
  { label: 'Timetable', href: '/dashboard/timetable', icon: Calendar, roles: ['super-admin', 'school-admin', 'principal', 'teacher', 'parent', 'student', 'staff'] },
  { label: 'Fees', href: '/dashboard/fees', icon: CreditCard, roles: ['school-admin', 'principal', 'parent'] },
  { label: 'Notices', href: '/dashboard/notices', icon: Megaphone, roles: ['school-admin', 'principal', 'teacher', 'parent', 'student', 'staff'] },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar, roles: ['school-admin', 'principal', 'teacher', 'parent', 'student', 'staff'] },
  { label: 'Staff', href: '/dashboard/staff', icon: UserCheck, roles: ['school-admin', 'principal'] },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['super-admin', 'school-admin', 'principal'] },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['super-admin', 'school-admin'] },
];

export const PUBLIC_NAV = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 2999,
    period: '/month',
    description: 'Perfect for small schools just getting started',
    features: [
      'Up to 500 students',
      'Basic attendance tracking',
      'Fee management',
      'Homework module',
      'Email support',
      '5 admin accounts',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 7999,
    period: '/month',
    description: 'For growing schools that need more power',
    features: [
      'Up to 2000 students',
      'Advanced analytics',
      'Exam management',
      'Parent communication',
      'Priority support',
      'Unlimited admin accounts',
      'Custom branding',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 14999,
    period: '/month',
    description: 'For large institutions with complex needs',
    features: [
      'Unlimited students',
      'Multi-branch support',
      'Advanced reporting',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'Data migration support',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const FEATURES = [
  { title: 'Student Management', description: 'Complete student lifecycle management from admission to alumni.', icon: GraduationCap },
  { title: 'Teacher Management', description: 'Manage teacher profiles, schedules, and performance tracking.', icon: Users },
  { title: 'Attendance Tracking', description: 'Digital attendance with real-time notifications to parents.', icon: ClipboardList },
  { title: 'Homework & Assignments', description: 'Create, distribute, and track assignments digitally.', icon: BookOpen },
  { title: 'Exam Management', description: 'Schedule exams, enter marks, generate report cards automatically.', icon: BookCheck },
  { title: 'Fee Management', description: 'Online fees, invoicing, payment tracking, and reminders.', icon: CreditCard },
  { title: 'Communication', description: 'Instant notices, announcements, and parent-teacher messaging.', icon: Megaphone },
  { title: 'Analytics & Reports', description: 'Data-driven insights for better decision making.', icon: BarChart3 },
  { title: 'Transport Management', description: 'Track school buses and manage transport routes.', icon: Bus },
  { title: 'Security & Roles', description: 'Role-based access control for data security.', icon: Shield },
  { title: 'Calendar & Events', description: 'School calendar with events, holidays, and scheduling.', icon: Calendar },
  { title: 'Multi-Branch', description: 'Manage multiple school branches from one dashboard.', icon: Building2 },
];

export const TESTIMONIALS = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Principal, Delhi Public School',
    content: 'SuperSMP has transformed how we manage our school. The attendance and fee modules alone have saved us 20 hours per week.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'School Admin, St. Xavier\'s Academy',
    content: 'The best school management software we\'ve ever used. Clean interface, powerful features, and excellent support.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Parent, Greenwood International',
    content: 'I love being able to track my child\'s attendance and homework in real-time. The parent app is incredibly intuitive.',
    rating: 5,
  },
  {
    name: 'Mohammad Ali',
    role: 'Teacher, National Model School',
    content: 'Marking attendance and managing homework has never been easier. SuperSMP lets me focus on what matters — teaching.',
    rating: 4,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How long does it take to set up SuperSMP?',
    answer: 'Most schools are up and running within 24 hours. Our team handles data migration and provides hands-on onboarding support.',
  },
  {
    question: 'Can parents access the platform?',
    answer: 'Yes! Parents get a dedicated dashboard where they can view attendance, homework, fees, exam results, and communicate with teachers.',
  },
  {
    question: 'Is my school data secure?',
    answer: 'Absolutely. We use bank-grade encryption, regular backups, and comply with all data protection regulations. Each school\'s data is completely isolated.',
  },
  {
    question: 'Can I customize the platform for my school?',
    answer: 'Yes, the Professional and Enterprise plans include custom branding, custom fields, and configurable workflows to match your school\'s processes.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer email support for Starter, priority support for Professional, and 24/7 dedicated support for Enterprise plans. All plans include free onboarding.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! Start with a 14-day free trial on any plan. No credit card required. Experience the full platform before committing.',
  },
];

export const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/contact' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

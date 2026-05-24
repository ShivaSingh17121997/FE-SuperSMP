import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import type {
  Student, Teacher, Staff, AttendanceRecord, Homework, Exam, ExamResult,
  FeeInvoice, Notice, CalendarEvent, Notification, School,
  Question, QuestionPaper, BulkUploadResult, FilterMetadata,
} from '@/types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = rawApiUrl.endsWith('/api') || rawApiUrl.endsWith('/api/')
  ? rawApiUrl
  : rawApiUrl.replace(/\/$/, '') + '/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Try Redux state first, then localStorage
      const token = (getState() as RootState).auth.token
        || (typeof window !== 'undefined' ? localStorage.getItem('smp_auth_token') : null);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Students', 'Teachers', 'Staff', 'Attendance', 'Homework',
    'Exams', 'ExamResults', 'Fees', 'Notices', 'Calendar',
    'Notifications', 'ClassTeachers', 'Schools', 'Dashboard', 'Timetable',
    'Questions', 'QuestionPapers', 'QuestionFilters',
  ],
  endpoints: (builder) => ({

    // ────────── Dashboard ──────────
    getDashboardStats: builder.query<any, void>({
      query: () => '/dashboard/stats',
      transformResponse: (res: any) => res.data,
      providesTags: ['Dashboard'],
    }),

    // ────────── Schools ──────────
    getSchools: builder.query<School[], void>({
      query: () => '/schools',
      transformResponse: (res: any) => res.data,
      providesTags: ['Schools'],
    }),
    getSchool: builder.query<School, string>({
      query: (id) => `/schools/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createSchool: builder.mutation<School, Partial<School>>({
      query: (body) => ({ url: '/schools', method: 'POST', body }),
      invalidatesTags: ['Schools', 'Dashboard'],
    }),
    onboardSchool: builder.mutation<any, { school: any; admin: any }>({
      query: (body) => ({ url: '/auth/onboard', method: 'POST', body }),
      invalidatesTags: ['Schools', 'Dashboard'],
    }),
    updateSchool: builder.mutation<School, { id: string; body: Partial<School> }>({
      query: ({ id, body }) => ({ url: `/schools/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Schools', 'Dashboard'],
    }),
    deleteSchool: builder.mutation<void, string>({
      query: (id) => ({ url: `/schools/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Schools', 'Dashboard'],
    }),

    // ────────── Students ──────────
    getStudents: builder.query<{ data: Student[]; pagination: any }, Record<string, string> | void>({
      query: (params) => ({ url: '/students', params: params || {} }),
      transformResponse: (res: any) => ({ data: res.data, pagination: res.pagination }),
      providesTags: ['Students'],
    }),
    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createStudent: builder.mutation<Student, any>({
      query: (body) => ({ url: '/students', method: 'POST', body }),
      invalidatesTags: ['Students', 'Dashboard'],
    }),
    updateStudent: builder.mutation<Student, { id: string; body: Partial<Student> }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Students'],
    }),
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Students', 'Dashboard'],
    }),

    // ────────── Teachers ──────────
    getTeachers: builder.query<{ data: Teacher[]; pagination: any }, Record<string, string> | void>({
      query: (params) => ({ url: '/teachers', params: params || {} }),
      transformResponse: (res: any) => ({ data: res.data, pagination: res.pagination }),
      providesTags: ['Teachers'],
    }),
    getTeacher: builder.query<Teacher, string>({
      query: (id) => `/teachers/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createTeacher: builder.mutation<Teacher, any>({
      query: (body) => ({ url: '/teachers', method: 'POST', body }),
      invalidatesTags: ['Teachers', 'Dashboard'],
    }),
    updateTeacher: builder.mutation<Teacher, { id: string; body: Partial<Teacher> }>({
      query: ({ id, body }) => ({ url: `/teachers/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Teachers'],
    }),
    deleteTeacher: builder.mutation<void, string>({
      query: (id) => ({ url: `/teachers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Teachers', 'Dashboard'],
    }),

    // ────────── Staff ──────────
    getStaff: builder.query<{ data: Staff[]; pagination: any }, Record<string, string> | void>({
      query: (params) => ({ url: '/staff', params: params || {} }),
      transformResponse: (res: any) => ({ data: res.data, pagination: res.pagination }),
      providesTags: ['Staff'],
    }),
    getStaffMember: builder.query<Staff, string>({
      query: (id) => `/staff/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createStaff: builder.mutation<Staff, any>({
      query: (body) => ({ url: '/staff', method: 'POST', body }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
    updateStaff: builder.mutation<Staff, { id: string; body: Partial<Staff> }>({
      query: ({ id, body }) => ({ url: `/staff/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Staff'],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({ url: `/staff/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),

    // ────────── Attendance ──────────
    getAttendance: builder.query<AttendanceRecord[], Record<string, string> | void>({
      query: (params) => ({ url: '/attendance', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation<any, any>({
      query: (body) => ({ url: '/attendance', method: 'POST', body }),
      invalidatesTags: ['Attendance', 'Dashboard'],
    }),
    resetPassword: builder.mutation<any, { id: string; body: { newPassword: string } }>({
      query: ({ id, body }) => ({ url: `/auth/reset-password/${id}`, method: 'PUT', body }),
    }),
    updateAttendance: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/attendance/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Attendance'],
    }),
    deleteAttendance: builder.mutation<void, string>({
      query: (id) => ({ url: `/attendance/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Attendance'],
    }),

    // ────────── Homework ──────────
    getHomeworks: builder.query<Homework[], Record<string, string> | void>({
      query: (params) => ({ url: '/homework', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Homework'],
    }),
    getHomework: builder.query<Homework, string>({
      query: (id) => `/homework/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createHomework: builder.mutation<Homework, any>({
      query: (body) => ({ url: '/homework', method: 'POST', body }),
      invalidatesTags: ['Homework'],
    }),
    updateHomework: builder.mutation<Homework, { id: string; body: Partial<Homework> }>({
      query: ({ id, body }) => ({ url: `/homework/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Homework'],
    }),
    deleteHomework: builder.mutation<void, string>({
      query: (id) => ({ url: `/homework/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Homework'],
    }),

    // ────────── Exams ──────────
    getExams: builder.query<Exam[], Record<string, string> | void>({
      query: (params) => ({ url: '/exams', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Exams'],
    }),
    getExam: builder.query<Exam, string>({
      query: (id) => `/exams/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createExam: builder.mutation<Exam, any>({
      query: (body) => ({ url: '/exams', method: 'POST', body }),
      invalidatesTags: ['Exams'],
    }),
    updateExam: builder.mutation<Exam, { id: string; body: Partial<Exam> }>({
      query: ({ id, body }) => ({ url: `/exams/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Exams'],
    }),
    deleteExam: builder.mutation<void, string>({
      query: (id) => ({ url: `/exams/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Exams'],
    }),

    // ── Exam Results ──
    getExamResults: builder.query<ExamResult[], Record<string, string> | void>({
      query: (params) => ({ url: '/exams/results/all', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['ExamResults'],
    }),
    createExamResult: builder.mutation<ExamResult, any>({
      query: (body) => ({ url: '/exams/results/create', method: 'POST', body }),
      invalidatesTags: ['ExamResults'],
    }),
    updateExamResult: builder.mutation<ExamResult, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/exams/results/${id}`, method: 'PUT', body }),
      invalidatesTags: ['ExamResults'],
    }),
    deleteExamResult: builder.mutation<void, string>({
      query: (id) => ({ url: `/exams/results/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ExamResults'],
    }),

    // ────────── Fees ──────────
    getFees: builder.query<FeeInvoice[], Record<string, string> | void>({
      query: (params) => ({ url: '/fees', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Fees'],
    }),
    getFee: builder.query<FeeInvoice, string>({
      query: (id) => `/fees/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createFee: builder.mutation<FeeInvoice, any>({
      query: (body) => ({ url: '/fees', method: 'POST', body }),
      invalidatesTags: ['Fees', 'Dashboard'],
    }),
    updateFee: builder.mutation<FeeInvoice, { id: string; body: Partial<FeeInvoice> }>({
      query: ({ id, body }) => ({ url: `/fees/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Fees', 'Dashboard'],
    }),
    deleteFee: builder.mutation<void, string>({
      query: (id) => ({ url: `/fees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Fees', 'Dashboard'],
    }),

    // ────────── Notices ──────────
    getNotices: builder.query<Notice[], Record<string, string> | void>({
      query: (params) => ({ url: '/notices', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Notices'],
    }),
    getNotice: builder.query<Notice, string>({
      query: (id) => `/notices/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createNotice: builder.mutation<Notice, any>({
      query: (body) => ({ url: '/notices', method: 'POST', body }),
      invalidatesTags: ['Notices'],
    }),
    updateNotice: builder.mutation<Notice, { id: string; body: Partial<Notice> }>({
      query: ({ id, body }) => ({ url: `/notices/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Notices'],
    }),
    deleteNotice: builder.mutation<void, string>({
      query: (id) => ({ url: `/notices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notices'],
    }),

    // ────────── Calendar ──────────
    getEvents: builder.query<CalendarEvent[], Record<string, string> | void>({
      query: (params) => ({ url: '/calendar', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Calendar'],
    }),
    getEvent: builder.query<CalendarEvent, string>({
      query: (id) => `/calendar/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createEvent: builder.mutation<CalendarEvent, any>({
      query: (body) => ({ url: '/calendar', method: 'POST', body }),
      invalidatesTags: ['Calendar'],
    }),
    updateEvent: builder.mutation<CalendarEvent, { id: string; body: Partial<CalendarEvent> }>({
      query: ({ id, body }) => ({ url: `/calendar/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Calendar'],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({ url: `/calendar/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Calendar'],
    }),

    // ────────── Notifications ──────────
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      transformResponse: (res: any) => res.data,
      providesTags: ['Notifications'],
    }),
    createNotification: builder.mutation<Notification, any>({
      query: (body) => ({ url: '/notifications', method: 'POST', body }),
      invalidatesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notifications'],
    }),

    // ────────── Class Teachers ──────────
    getClassTeachers: builder.query<any[], void>({
      query: () => '/class-teachers',
      transformResponse: (res: any) => res.data,
      providesTags: ['ClassTeachers'],
    }),
    assignClassTeacher: builder.mutation<any, { teacherId: string; class: string; section: string }>({
      query: (body) => ({ url: '/class-teachers', method: 'POST', body }),
      invalidatesTags: ['ClassTeachers'],
    }),
    removeClassTeacher: builder.mutation<void, string>({
      query: (id) => ({ url: `/class-teachers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ClassTeachers'],
    }),

    // ────────── Timetable ──────────
    getTimetables: builder.query<any[], Record<string, string> | void>({
      query: (params) => ({ url: '/timetable', params: params || {} }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Timetable'],
    }),
    createTimetableSlot: builder.mutation<any, any>({
      query: (body) => ({ url: '/timetable', method: 'POST', body }),
      invalidatesTags: ['Timetable'],
    }),
    deleteTimetableSlot: builder.mutation<void, string>({
      query: (id) => ({ url: `/timetable/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Timetable'],
    }),

    // ────────── Question Bank ──────────
    getQuestions: builder.query<{ data: Question[]; pagination: any }, Record<string, string> | void>({
      query: (params) => ({ url: '/question-bank/questions', params: params || {} }),
      transformResponse: (res: any) => ({ data: res.data, pagination: res.pagination }),
      providesTags: ['Questions'],
    }),
    getQuestion: builder.query<Question, string>({
      query: (id) => `/question-bank/questions/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createQuestion: builder.mutation<Question, Partial<Question>>({
      query: (body) => ({ url: '/question-bank/questions', method: 'POST', body }),
      invalidatesTags: ['Questions', 'QuestionFilters'],
    }),
    updateQuestion: builder.mutation<Question, { id: string; body: Partial<Question> }>({
      query: ({ id, body }) => ({ url: `/question-bank/questions/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Questions'],
    }),
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({ url: `/question-bank/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Questions'],
    }),
    bulkUploadQuestions: builder.mutation<{ data: BulkUploadResult }, any>({
      query: (body) => ({ url: '/question-bank/questions/bulk', method: 'POST', body }),
      invalidatesTags: ['Questions', 'QuestionFilters'],
    }),
    getQuestionFilters: builder.query<FilterMetadata, void>({
      query: () => '/question-bank/filters',
      transformResponse: (res: any) => res.data,
      providesTags: ['QuestionFilters'],
    }),

    // ── Question Papers ──
    getQuestionPapers: builder.query<{ data: QuestionPaper[]; pagination: any }, Record<string, string> | void>({
      query: (params) => ({ url: '/question-bank/papers', params: params || {} }),
      transformResponse: (res: any) => ({ data: res.data, pagination: res.pagination }),
      providesTags: ['QuestionPapers'],
    }),
    getQuestionPaperById: builder.query<QuestionPaper, string>({
      query: (id) => `/question-bank/papers/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: ['QuestionPapers'],
    }),
    createQuestionPaper: builder.mutation<QuestionPaper, any>({
      query: (body) => ({ url: '/question-bank/papers', method: 'POST', body }),
      invalidatesTags: ['QuestionPapers', 'Questions'],
    }),
    updateQuestionPaper: builder.mutation<QuestionPaper, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/question-bank/papers/${id}`, method: 'PUT', body }),
      invalidatesTags: ['QuestionPapers'],
    }),
    deleteQuestionPaper: builder.mutation<void, string>({
      query: (id) => ({ url: `/question-bank/papers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['QuestionPapers'],
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardStatsQuery,
  // Schools
  useGetSchoolsQuery, useGetSchoolQuery, useCreateSchoolMutation, useOnboardSchoolMutation,
  useUpdateSchoolMutation, useDeleteSchoolMutation,
  // Students
  useGetStudentsQuery, useGetStudentQuery, useCreateStudentMutation,
  useUpdateStudentMutation, useDeleteStudentMutation,
  // Teachers
  useGetTeachersQuery, useGetTeacherQuery, useCreateTeacherMutation,
  useUpdateTeacherMutation, useDeleteTeacherMutation,
  // Staff
  useGetStaffQuery, useGetStaffMemberQuery, useCreateStaffMutation,
  useUpdateStaffMutation, useDeleteStaffMutation,
  // Attendance
  useGetAttendanceQuery, useMarkAttendanceMutation,
  useUpdateAttendanceMutation, useDeleteAttendanceMutation,
  // Homework
  useGetHomeworksQuery, useGetHomeworkQuery, useCreateHomeworkMutation,
  useUpdateHomeworkMutation, useDeleteHomeworkMutation,
  // Exams
  useGetExamsQuery, useGetExamQuery, useCreateExamMutation,
  useUpdateExamMutation, useDeleteExamMutation,
  // Exam Results
  useGetExamResultsQuery, useCreateExamResultMutation,
  useUpdateExamResultMutation, useDeleteExamResultMutation,
  // Fees
  useGetFeesQuery, useGetFeeQuery, useCreateFeeMutation,
  useUpdateFeeMutation, useDeleteFeeMutation,
  // Notices
  useGetNoticesQuery, useGetNoticeQuery, useCreateNoticeMutation,
  useUpdateNoticeMutation, useDeleteNoticeMutation,
  // Calendar
  useGetEventsQuery, useGetEventQuery, useCreateEventMutation,
  useUpdateEventMutation, useDeleteEventMutation,
  // Notifications
  useGetNotificationsQuery, useCreateNotificationMutation,
  useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  // Class Teachers
  useGetClassTeachersQuery, useAssignClassTeacherMutation, useRemoveClassTeacherMutation,
  // Timetable
  useGetTimetablesQuery, useCreateTimetableSlotMutation, useDeleteTimetableSlotMutation,
  // Auth Extra
  useResetPasswordMutation,
  // Question Bank
  useGetQuestionsQuery, useGetQuestionQuery, useCreateQuestionMutation,
  useUpdateQuestionMutation, useDeleteQuestionMutation,
  useBulkUploadQuestionsMutation, useGetQuestionFiltersQuery,
  // Question Papers
  useGetQuestionPapersQuery, useGetQuestionPaperByIdQuery,
  useCreateQuestionPaperMutation, useUpdateQuestionPaperMutation,
  useDeleteQuestionPaperMutation,
} = apiSlice;

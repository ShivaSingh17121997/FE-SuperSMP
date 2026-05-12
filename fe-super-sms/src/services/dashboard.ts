import api from './api';

export interface TeacherStats {
  todayClassesCount: number;
  activeHomeworkCount: number;
  pendingAttendanceCount: number;
  pendingEvaluationsCount: number;
}

export const dashboardService = {
  getStats: async (): Promise<TeacherStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  },
};

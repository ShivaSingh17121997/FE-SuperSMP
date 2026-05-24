'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { Clock, BookOpen, ClipboardList, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '@/hooks';
import type { Homework, Notice } from '@/types';
import api from '@/services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingHomework, setPendingHomework] = useState<Homework[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [hwRes, noticeRes, attendanceRes, examsRes, resultsRes] = await Promise.all([
          api.get('/homework'),
          api.get('/notices'),
          api.get('/attendance'),
          api.get('/exams'),
          api.get('/exams/results/all'),
        ]);

        const allHw = hwRes.data.data || [];
        const filteredHw = allHw.filter((hw: any) => hw.class === user?.class && hw.section === user?.section);
        setPendingHomework(filteredHw.slice(0, 3));

        setNotices((noticeRes.data.data || []).slice(0, 3));
        setAttendance(attendanceRes.data.data || []);
        setExams(examsRes.data.data || []);
        setExamResults(resultsRes.data.data || []);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[new Date().getDay()];
        const timetableRes = await api.get(`/timetable?day=${dayName}`);
        const allTimetable = timetableRes.data.data || [];
        const studentTimetable = allTimetable.filter((t: any) => t.class === user?.class && t.section === user?.section);
        setTimetableSlots(studentTimetable);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getAttendanceRate = () => {
    const studentRecords = attendance.filter((r: any) => r.studentId === user?.studentId);
    if (studentRecords.length === 0) return '0%';
    let presentCount = 0;
    studentRecords.forEach((r: any) => {
      if (r.status === 'present' || r.status === 'late') presentCount++;
      else if (r.status === 'half-day') presentCount += 0.5;
    });
    return `${Math.round((presentCount / studentRecords.length) * 100)}%`;
  };

  const getLastExamScore = () => {
    const studentRecords = examResults.filter((r: any) => r.studentId === user?.studentId);
    if (studentRecords.length === 0) return '0%';
    const lastResult = studentRecords[studentRecords.length - 1];
    const percent = lastResult.totalMarks > 0 ? Math.round((lastResult.marksObtained / lastResult.totalMarks) * 100) : 0;
    return `${percent}%`;
  };

  const getUpcomingExamsCount = () => {
    return exams.filter((e: any) => e.class === user?.class && e.status === 'upcoming').length;
  };

  const getMyPerformanceData = () => {
    const examSubjectMap: Record<string, string> = {};
    exams.forEach((e: any) => {
      examSubjectMap[e._id || e.id] = e.subject;
    });

    const subjectScores: Record<string, { obtained: number; total: number }> = {};
    examResults.forEach((r: any) => {
      if (r.studentId === user?.studentId) {
        const subject = examSubjectMap[r.examId];
        if (subject) {
          subjectScores[subject] = {
            obtained: r.marksObtained || 0,
            total: r.totalMarks || 100,
          };
        }
      }
    });

    const data = Object.entries(subjectScores).map(([subject, scores]) => ({
      subject,
      average: scores.total > 0 ? Math.round((scores.obtained / scores.total) * 100) : 0,
    }));

    if (data.length === 0) {
      return [
        { subject: 'Math', average: 0 },
        { subject: 'Science', average: 0 },
        { subject: 'English', average: 0 },
        { subject: 'Hindi', average: 0 },
        { subject: 'SST', average: 0 },
        { subject: 'CS', average: 0 },
      ];
    }
    return data;
  };

  const stats = [
    { title: 'Attendance', value: getAttendanceRate(), change: attendance.length > 0 ? 2 : undefined, changeLabel: attendance.length > 0 ? 'this month' : undefined, icon: ClipboardList, color: 'green' },
    { title: 'Pending Homework', value: pendingHomework.length.toString(), icon: BookOpen, color: 'amber' },
    { title: 'Last Exam Score', value: getLastExamScore(), icon: BarChart3, color: 'indigo' },
    { title: 'Upcoming Exams', value: getUpcomingExamsCount().toString(), icon: Clock, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Student Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Stay on top of your studies, {user?.name?.split(' ')[0] || 'Student'}. Have a great day!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Today&apos;s Timetable</h3>
          <div className="space-y-2">
            {timetableSlots.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="w-20 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1.5 rounded text-center">{cls.startTime || cls.time}</div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{cls.subject}</p>
                  <p className="text-xs text-text-secondary">{cls.teacher?.name || 'Teacher'}</p>
                </div>
              </div>
            ))}
            {timetableSlots.length === 0 && !loading && (
              <p className="text-sm text-text-secondary italic text-center py-6">No classes scheduled for today.</p>
            )}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading schedule...</p>}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Pending Homework</h3>
            <div className="space-y-3">
              {pendingHomework.map(hw => (
                <div key={hw.id} className="p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary">{hw.title}</p>
                    <Badge variant="warning">Due: {hw.dueDate}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">{hw.subject}</p>
                </div>
              ))}
              {pendingHomework.length === 0 && !loading && <p className="text-sm text-text-secondary">No pending homework assignments.</p>}
              {loading && <p className="text-sm text-text-secondary animate-pulse">Loading homework...</p>}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Notices</h3>
            <div className="space-y-3">
              {notices.map(notice => (
                <div key={notice.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                  <Bell className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{notice.title}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{new Date(notice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {notices.length === 0 && !loading && <p className="text-sm text-text-secondary">No recent notices.</p>}
              {loading && <p className="text-sm text-text-secondary animate-pulse">Loading notices...</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-text-primary mb-4">My Performance</h3>
        <BarChartComponent
          data={getMyPerformanceData()}
          dataKeys={[{ key: 'average', color: '#6366f1', name: 'My Score' }]}
          xKey="subject"
        />
      </Card>
    </div>
  );
}

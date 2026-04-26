'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { Clock, BookOpen, ClipboardList, BarChart3, Bell } from 'lucide-react';
import { homeworkService, noticeService } from '@/services/db';
import { studentPerformanceData } from '@/lib/mock-data';
import { useAuth } from '@/hooks';
import type { Homework, Notice } from '@/types';

const timetable = [
  { time: '8:00 AM', subject: 'Mathematics', teacher: 'Rakesh Mehta' },
  { time: '9:00 AM', subject: 'Physics', teacher: 'Dr. Meena Iyer' },
  { time: '10:00 AM', subject: 'English', teacher: 'Sunita Rao' },
  { time: '11:30 AM', subject: 'Computer Science', teacher: 'Amir Khan' },
  { time: '12:30 PM', subject: 'Hindi', teacher: 'Lakshmi Devi' },
  { time: '2:00 PM', subject: 'Physical Education', teacher: 'Sports Dept.' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [pendingHomework, setPendingHomework] = useState<Homework[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // In a real app we'd filter homework by the student's class
    setPendingHomework(homeworkService.getAll().slice(0, 3));
    setNotices(noticeService.getAll().slice(0, 3));
  }, []);

  const stats = [
    { title: 'Attendance', value: '94%', change: 2, changeLabel: 'this month', icon: ClipboardList, color: 'green' },
    { title: 'Pending Homework', value: pendingHomework.length.toString(), icon: BookOpen, color: 'amber' },
    { title: 'Last Exam Score', value: '88%', change: 6, changeLabel: 'improvement', icon: BarChart3, color: 'indigo' },
    { title: 'Upcoming Exams', value: '3', icon: Clock, color: 'red' },
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
            {timetable.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="w-20 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1.5 rounded text-center">{cls.time}</div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{cls.subject}</p>
                  <p className="text-xs text-text-secondary">{cls.teacher}</p>
                </div>
              </div>
            ))}
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
              {pendingHomework.length === 0 && <p className="text-sm text-text-secondary">No pending homework assignments.</p>}
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
                    <p className="text-xs text-text-tertiary mt-0.5">{notice.createdAt}</p>
                  </div>
                </div>
              ))}
              {notices.length === 0 && <p className="text-sm text-text-secondary">No recent notices.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-text-primary mb-4">My Performance</h3>
        <BarChartComponent
          data={studentPerformanceData}
          dataKeys={[{ key: 'average', color: '#6366f1', name: 'My Score' }]}
          xKey="subject"
        />
      </Card>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { BookOpen, ClipboardList, FileText, Clock, Award, Star } from 'lucide-react';
import { homeworkService } from '@/services/db';
import { studentPerformanceData } from '@/lib/mock-data';
import { useAuth } from '@/hooks';
import { dashboardService, TeacherStats } from '@/services/dashboard';
import api from '@/services/api';
import type { Homework } from '@/types';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeHomework, setActiveHomework] = useState<Homework[]>([]);
  const [todaysClasses, setTodaysClasses] = useState<any[]>([]);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Stats
        const statsData = await dashboardService.getStats();
        setStats(statsData);

        // 2. Fetch Today's Classes (Timetable)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[new Date().getDay()];
        const timetableRes = await api.get(`/timetable?day=${dayName}`);
        setTodaysClasses(timetableRes.data.data);

        // 3. Fetch Active Homework
        let allHw = homeworkService.getAll();
        if (user?.id) {
          allHw = allHw.filter(h => h.assignedBy === user.id);
        }
        setActiveHomework(allHw.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const dashboardStats = [
    { title: 'Today\'s Classes', value: stats?.todayClassesCount.toString() || '0', icon: BookOpen, color: 'indigo' },
    { title: 'Pending Attendance', value: stats?.pendingAttendanceCount.toString() || '0', icon: ClipboardList, color: 'amber' },
    { title: 'Active Homework', value: stats?.activeHomeworkCount.toString() || '0', icon: FileText, color: 'blue' },
    { title: 'Pending Evaluations', value: stats?.pendingEvaluationsCount.toString() || '0', icon: Clock, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Teacher Dashboard</h1>
            {user?.isClassTeacher && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full text-xs font-bold shadow-sm animate-pulse-subtle">
                <Award size={14} className="fill-white" />
                <span>CLASS TEACHER ({user.class}-{user.section})</span>
              </div>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back, {user?.name || 'Teacher'}. Here&apos;s your day.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Today&apos;s Schedule</h3>
            <Badge variant="flat">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Badge>
          </div>
          <div className="space-y-3">
            {todaysClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors group">
                <div className="w-16 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1.5 rounded-md text-center transition-colors group-hover:bg-primary-100">
                  {cls.startTime || cls.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{cls.subject}</p>
                  <p className="text-xs text-text-secondary font-medium">Class {cls.class}-{cls.section} • Room {cls.room || 'N/A'}</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                  Mark Attendance
                </button>
              </div>
            ))}
            {todaysClasses.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-sm text-text-secondary italic">No classes scheduled for today.</p>
              </div>
            )}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading schedule...</p>}
          </div>
        </Card>

        {/* Homework */}
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Active Homework</h3>
          <div className="space-y-3">
            {activeHomework.map(hw => (
              <div key={hw.id} className="p-3 rounded-lg border border-border hover:border-primary-200 hover:bg-surface-secondary transition-all">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-text-primary">{hw.title}</p>
                  <Badge variant={hw.submissions / hw.totalStudents > 0.8 ? 'success' : 'warning'}>
                    {hw.submissions}/{hw.totalStudents}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mb-3">Class {hw.class}-{hw.section} • Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                <div className="w-full bg-surface-tertiary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {activeHomework.length === 0 && !loading && (
              <p className="text-sm text-text-secondary italic">No active homework assignments.</p>
            )}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading homework...</p>}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">Class Performance</h3>
          <div className="flex gap-2">
             <Badge variant="success">Pass Rate: 85%</Badge>
          </div>
        </div>
        <div className="h-[300px]">
          <BarChartComponent
            data={studentPerformanceData}
            dataKeys={[{ key: 'average', color: '#6366f1', name: 'Average Score' }]}
            xKey="subject"
          />
        </div>
      </Card>
    </div>
  );
}

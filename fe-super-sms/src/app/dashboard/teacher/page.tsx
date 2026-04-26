'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { BookOpen, ClipboardList, FileText, Clock } from 'lucide-react';
import { homeworkService } from '@/services/db';
import { studentPerformanceData } from '@/lib/mock-data';
import { useAuth } from '@/hooks';
import type { Homework } from '@/types';

const todaysClasses = [
  { time: '8:00 AM', subject: 'Physics', class: '10-A', room: '301' },
  { time: '9:00 AM', subject: 'Physics', class: '10-B', room: '302' },
  { time: '10:30 AM', subject: 'Chemistry', class: '9-A', room: 'Lab 1' },
  { time: '12:00 PM', subject: 'Physics', class: '11-A', room: '401' },
  { time: '2:00 PM', subject: 'Science', class: '8-C', room: '205' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeHomework, setActiveHomework] = useState<Homework[]>([]);

  useEffect(() => {
    // Show only homework created by this teacher
    let allHw = homeworkService.getAll();
    if (user?.name) {
      allHw = allHw.filter(h => h.assignedBy === user.name);
    }
    setActiveHomework(allHw.slice(0, 5));
  }, [user]);

  const stats = [
    { title: 'Today\'s Classes', value: todaysClasses.length.toString(), icon: BookOpen, color: 'indigo' },
    { title: 'Pending Attendance', value: '2', icon: ClipboardList, color: 'amber' },
    { title: 'Active Homework', value: activeHomework.length.toString(), icon: FileText, color: 'blue' },
    { title: 'Pending Evaluations', value: '12', icon: Clock, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Teacher Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Welcome back, {user?.name || 'Teacher'}. Here&apos;s your day.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {todaysClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="w-16 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded text-center">{cls.time}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{cls.subject}</p>
                  <p className="text-xs text-text-secondary">Class {cls.class} • Room {cls.room}</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer">
                  Mark Attendance
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Homework */}
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Active Homework</h3>
          <div className="space-y-3">
            {activeHomework.map(hw => (
              <div key={hw.id} className="p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-text-primary">{hw.title}</p>
                  <Badge variant={hw.submissions / hw.totalStudents > 0.8 ? 'success' : 'warning'}>
                    {hw.submissions}/{hw.totalStudents}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">Class {hw.class}-{hw.section} • Due: {hw.dueDate}</p>
                <div className="mt-2 w-full bg-surface-tertiary rounded-full h-1.5">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {activeHomework.length === 0 && <p className="text-sm text-text-secondary">No active homework assignments.</p>}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-text-primary mb-4">Class Performance</h3>
        <BarChartComponent
          data={studentPerformanceData}
          dataKeys={[{ key: 'average', color: '#6366f1', name: 'Average Score' }]}
          xKey="subject"
        />
      </Card>
    </div>
  );
}

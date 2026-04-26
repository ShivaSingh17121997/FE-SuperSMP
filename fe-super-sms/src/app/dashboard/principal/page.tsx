'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { AreaChartComponent, BarChartComponent } from '@/components/charts';
import { Users, GraduationCap, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { studentService, teacherService, staffService } from '@/services/db';
import { attendanceChartData, studentPerformanceData } from '@/lib/mock-data';
import { useAuth } from '@/hooks';

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);

  useEffect(() => {
    setTotalStudents(studentService.count());
    setTotalTeachers(teacherService.count());
    setTotalStaff(staffService.getAll().length);
  }, []);

  const stats = [
    { title: 'Total Students', value: totalStudents.toLocaleString(), icon: GraduationCap, color: 'indigo' },
    { title: 'Total Teachers', value: totalTeachers.toLocaleString(), icon: Users, color: 'blue' },
    { title: 'Other Staff', value: totalStaff.toLocaleString(), icon: UserCheck, color: 'amber' },
    { title: 'Teacher Attendance', value: '98%', icon: Clock, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Principal Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Welcome back, {user?.name || 'Principal'}. Here&apos;s the school overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">School Attendance Trend</h3>
          <AreaChartComponent data={attendanceChartData} dataKey="present" color="#10b981" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Overall Performance</h3>
          <BarChartComponent
            data={studentPerformanceData}
            dataKeys={[{ key: 'average', color: '#6366f1', name: 'Average Score' }]}
            xKey="subject"
          />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Staff on Leave Today</h3>
            <Badge variant="warning">3 Staff Members</Badge>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Dr. Meena Iyer', role: 'Senior Physics Teacher', status: 'Sick Leave' },
              { name: 'Rakesh Mehta', role: 'Math Teacher', status: 'Casual Leave' },
              { name: 'Sunil Kumar', role: 'Librarian', status: 'Half Day' },
            ].map((staff, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-secondary font-bold text-xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{staff.name}</p>
                    <p className="text-xs text-text-tertiary">{staff.role}</p>
                  </div>
                </div>
                <Badge variant={staff.status === 'Sick Leave' ? 'danger' : 'warning'}>{staff.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4 border-b border-border pb-2">Attention Required</h3>
          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">Low Attendance</p>
                <p className="text-xs text-text-secondary">Class 10-B attendance is below 85% this week.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">Syllabus Completion</p>
                <p className="text-xs text-text-secondary">Science syllabus for Class 8 is lagging behind schedule.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

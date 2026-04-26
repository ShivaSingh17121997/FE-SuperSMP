'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { AreaChartComponent } from '@/components/charts';
import { ClipboardList, BookOpen, CreditCard, BarChart3, Bell } from 'lucide-react';
import { noticeService, homeworkService, feeService } from '@/services/db';
import { attendanceChartData, mockEvents } from '@/lib/mock-data';
import { useAuth } from '@/hooks';
import type { Notice, Homework, FeeInvoice } from '@/types';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [fees, setFees] = useState<FeeInvoice[]>([]);

  useEffect(() => {
    setNotices(noticeService.getAll().slice(0, 5));
    // In a real app we'd filter homework & fees by the student(s) linked to this parent
    setHomework(homeworkService.getAll().slice(0, 3));
    setFees(feeService.getAll().filter(f => f.status !== 'paid'));
  }, []);

  const totalFeesDue = fees.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);

  const stats = [
    { title: 'Attendance This Month', value: '92%', change: 1.5, changeLabel: 'vs last month', icon: ClipboardList, color: 'green' },
    { title: 'Pending Homework', value: homework.length.toString(), icon: BookOpen, color: 'amber' },
    { title: 'Fees Due', value: `₹${totalFeesDue.toLocaleString()}`, icon: CreditCard, color: 'red' },
    { title: 'Last Exam Score', value: '86%', change: 4, changeLabel: 'improvement', icon: BarChart3, color: 'indigo' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Parent Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Track your child&apos;s academic progress and school activities.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Attendance History</h3>
          <AreaChartComponent data={attendanceChartData} dataKey="present" color="#10b981" />
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Pending Homework</h3>
          <div className="space-y-3">
            {homework.map(hw => (
              <div key={hw.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-text-primary">{hw.title}</p>
                  <Badge variant="warning">Due: {hw.dueDate}</Badge>
                </div>
                <p className="text-xs text-text-secondary">{hw.subject} • Class {hw.class}</p>
              </div>
            ))}
            {homework.length === 0 && <p className="text-sm text-text-secondary">No pending homework assignments.</p>}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">School Notices</h3>
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

        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {mockEvents.slice(0, 4).map(event => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: event.color }} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{event.title}</p>
                  <p className="text-xs text-text-secondary">{event.date} • {event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

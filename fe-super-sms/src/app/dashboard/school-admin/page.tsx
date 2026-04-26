'use client';

import React from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { BarChartComponent, AreaChartComponent, PieChartComponent } from '@/components/charts';
import { GraduationCap, Users, CreditCard, ClipboardList, Bell, Zap } from 'lucide-react';
import { useGetDashboardStatsQuery, useGetNoticesQuery, useGetFeesQuery } from '@/store/slices/apiSlice';
import { attendanceChartData, feeCollectionData } from '@/lib/mock-data';
import type { Notice, FeeInvoice } from '@/types';

export default function SchoolAdminDashboard() {
  const { data: dashStats, isLoading } = useGetDashboardStatsQuery();
  const { data: notices = [] } = useGetNoticesQuery();
  const { data: feeData = [] } = useGetFeesQuery();

  const feeCollected = (feeData as FeeInvoice[]).reduce((sum, f) => sum + (f.paidAmount || 0), 0);

  const feeDistribution = [
    { name: 'Paid', value: (feeData as FeeInvoice[]).filter(f => f.status === 'paid').length },
    { name: 'Pending', value: (feeData as FeeInvoice[]).filter(f => f.status === 'pending').length },
    { name: 'Overdue', value: (feeData as FeeInvoice[]).filter(f => f.status === 'overdue').length },
  ];

  const stats = [
    { title: 'Total Students', value: (dashStats?.totalStudents ?? 0).toLocaleString(), change: 4.2, changeLabel: 'vs last year', icon: GraduationCap, color: 'indigo' },
    { title: 'Total Teachers', value: String(dashStats?.totalTeachers ?? 0), change: 2, changeLabel: 'new this year', icon: Users, color: 'blue' },
    { title: 'Fee Collected', value: `₹${(feeCollected / 100000).toFixed(1)}L`, change: 18, changeLabel: 'this month', icon: CreditCard, color: 'green' },
    { title: 'Attendance Today', value: '94%', change: 2.1, changeLabel: 'vs yesterday', icon: ClipboardList, color: 'purple' },
  ];

  const quickActions = [
    { label: 'Add Student', icon: GraduationCap, href: '/dashboard/students' },
    { label: 'Add Teacher', icon: Users, href: '/dashboard/teachers' },
    { label: 'Post Notice', icon: Bell, href: '/dashboard/notices' },
    { label: 'Generate Report', icon: Zap, href: '/dashboard/reports' },
  ];

  const recentNotices = (notices as Notice[]).slice(0, 5);

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading dashboard...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">School Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Welcome back, Admin. Here&apos;s your school overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Card key={i} hover className="flex flex-col items-center gap-3 text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-text-primary">{action.label}</span>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-text-primary mb-4">Fee Collection Trend</h3>
          <BarChartComponent data={feeCollectionData} dataKeys={[{ key: 'collected', color: '#6366f1', name: 'Collected' }, { key: 'pending', color: '#f59e0b', name: 'Pending' }]} />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Fee Status</h3>
          <PieChartComponent data={feeDistribution} dataKey="value" nameKey="name" innerRadius={50} height={240} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Attendance Trend</h3>
          <AreaChartComponent data={attendanceChartData} dataKey="present" color="#10b981" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {recentNotices.map((notice: any) => (
              <div key={notice._id || notice.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="mt-0.5">
                  <Badge variant={notice.category === 'urgent' ? 'danger' : notice.category === 'event' ? 'info' : 'default'}>
                    {notice.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{notice.title}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{notice.createdAt}</p>
                </div>
              </div>
            ))}
            {recentNotices.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No notices yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

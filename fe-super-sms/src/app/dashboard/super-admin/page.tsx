'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card } from '@/components/ui';
import { AreaChartComponent, BarChartComponent } from '@/components/charts';
import { Building2, Users, CreditCard, TrendingUp, HeadphonesIcon, Activity } from 'lucide-react';
import { useGetDashboardStatsQuery, useGetSchoolsQuery } from '@/store/slices/apiSlice';

export default function SuperAdminDashboard() {
  const { data: dashStats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: schools = [], isLoading: schoolsLoading } = useGetSchoolsQuery();

  const getLast6Months = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      result.push({
        month: months[targetDate.getMonth()],
        year: targetDate.getFullYear(),
        monthIndex: targetDate.getMonth(),
      });
    }
    return result;
  };

  const getRevenueData = () => {
    const months = getLast6Months();
    return months.map(m => {
      let revenue = 0;
      schools.forEach((school: any) => {
        const createdDate = new Date(school.createdAt);
        const endOfMonth = new Date(m.year, m.monthIndex + 1, 0, 23, 59, 59, 999);
        if (createdDate <= endOfMonth && school.isActive) {
          if (school.plan === 'starter') revenue += 5000;
          else if (school.plan === 'professional') revenue += 15000;
          else if (school.plan === 'enterprise') revenue += 50000;
        }
      });
      return { month: m.month, revenue };
    });
  };

  const getEnrollmentData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    return years.map(y => {
      let students = 0;
      schools.forEach((school: any) => {
        const createdYear = new Date(school.createdAt).getFullYear();
        if (createdYear <= y && school.isActive) {
          students += school.studentsCount || 0;
        }
      });
      return { year: String(y), students };
    });
  };

  const stats = [
    { title: 'Total Schools', value: String(dashStats?.totalSchools ?? schools.length), change: 12, changeLabel: 'vs last month', icon: Building2, color: 'indigo' },
    { title: 'Total Users', value: (dashStats?.totalUsers ?? 0).toLocaleString(), change: 8.5, changeLabel: 'vs last month', icon: Users, color: 'blue' },
    { title: 'Total Students', value: (dashStats?.totalStudents ?? 0).toLocaleString(), icon: CreditCard, color: 'green' },
    { title: 'Total Teachers', value: (dashStats?.totalTeachers ?? 0).toLocaleString(), icon: TrendingUp, color: 'purple' },
    { title: 'Support Tickets', value: '23', change: -12, changeLabel: 'vs last week', icon: HeadphonesIcon, color: 'amber' },
    { title: 'Platform Uptime', value: '99.9%', icon: Activity, color: 'cyan' },
  ];

  if (statsLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading dashboard...</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
        <p className="text-sm text-text-secondary mt-1">Monitor your entire SaaS platform at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Revenue Trend</h3>
          <AreaChartComponent data={getRevenueData()} dataKey="revenue" xKey="month" color="#6366f1" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Enrollment Growth</h3>
          <AreaChartComponent data={getEnrollmentData()} dataKey="students" xKey="year" color="#10b981" />
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-text-primary mb-4">Registered Schools</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-text-secondary uppercase">School</th>
                <th className="pb-3 text-xs font-semibold text-text-secondary uppercase">City</th>
                <th className="pb-3 text-xs font-semibold text-text-secondary uppercase">Students</th>
                <th className="pb-3 text-xs font-semibold text-text-secondary uppercase">Plan</th>
                <th className="pb-3 text-xs font-semibold text-text-secondary uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {schools.map((school: any) => (
                <tr key={school._id || school.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="py-3 text-sm font-medium text-text-primary">{school.name}</td>
                  <td className="py-3 text-sm text-text-secondary">{school.city}</td>
                  <td className="py-3 text-sm text-text-secondary">{(school.studentsCount || 0).toLocaleString()}</td>
                  <td className="py-3"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">{school.plan}</span></td>
                  <td className="py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${school.isActive ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-500'}`}>{school.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

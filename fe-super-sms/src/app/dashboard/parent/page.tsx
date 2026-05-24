'use client';

import React, { useEffect, useState } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { AreaChartComponent } from '@/components/charts';
import { ClipboardList, BookOpen, CreditCard, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '@/hooks';
import type { Notice, Homework, FeeInvoice } from '@/types';
import api from '@/services/api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [fees, setFees] = useState<FeeInvoice[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [hwRes, noticeRes, feeRes, attendanceRes, resultsRes, eventsRes] = await Promise.all([
          api.get('/homework'),
          api.get('/notices'),
          api.get('/fees'),
          api.get('/attendance'),
          api.get('/exams/results/all'),
          api.get('/calendar'),
        ]);

        const allHw = hwRes.data.data || [];
        const childHw = allHw.filter((hw: any) => hw.class === user?.class && hw.section === user?.section);
        setHomework(childHw.slice(0, 3));

        setNotices((noticeRes.data.data || []).slice(0, 5));

        const allFees = feeRes.data.data || [];
        const childFees = allFees.filter((f: any) => f.studentId === user?.studentId && f.status !== 'paid');
        setFees(childFees);

        setAttendance(attendanceRes.data.data || []);
        setExamResults(resultsRes.data.data || []);
        setEvents((eventsRes.data.data || []).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch parent data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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

  const getAttendanceHistoryData = () => {
    const months = getLast6Months();
    const childRecords = attendance.filter((r: any) => r.studentId === user?.studentId);
    return months.map(m => {
      let presentCount = 0;
      let totalCount = 0;
      childRecords.forEach(r => {
        const recordDate = new Date(r.date);
        if (recordDate.getMonth() === m.monthIndex && recordDate.getFullYear() === m.year) {
          totalCount++;
          if (r.status === 'present' || r.status === 'late') {
            presentCount++;
          } else if (r.status === 'half-day') {
            presentCount += 0.5;
          }
        }
      });
      const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
      return { month: m.month, present: rate, absent: totalCount > 0 ? 100 - rate : 0 };
    });
  };

  const getAttendanceRate = () => {
    const childRecords = attendance.filter((r: any) => r.studentId === user?.studentId);
    if (childRecords.length === 0) return '0%';
    let presentCount = 0;
    childRecords.forEach((r: any) => {
      if (r.status === 'present' || r.status === 'late') presentCount++;
      else if (r.status === 'half-day') presentCount += 0.5;
    });
    return `${Math.round((presentCount / childRecords.length) * 100)}%`;
  };

  const getLastExamScore = () => {
    const childRecords = examResults.filter((r: any) => r.studentId === user?.studentId);
    if (childRecords.length === 0) return '0%';
    const lastResult = childRecords[childRecords.length - 1];
    const percent = lastResult.totalMarks > 0 ? Math.round((lastResult.marksObtained / lastResult.totalMarks) * 100) : 0;
    return `${percent}%`;
  };

  const totalFeesDue = fees.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);

  const stats = [
    { title: 'Attendance This Month', value: getAttendanceRate(), change: attendance.length > 0 ? 1.5 : undefined, changeLabel: attendance.length > 0 ? 'vs last month' : undefined, icon: ClipboardList, color: 'green' },
    { title: 'Pending Homework', value: homework.length.toString(), icon: BookOpen, color: 'amber' },
    { title: 'Fees Due', value: `₹${totalFeesDue.toLocaleString()}`, icon: CreditCard, color: 'red' },
    { title: 'Last Exam Score', value: getLastExamScore(), icon: BarChart3, color: 'indigo' },
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
          <AreaChartComponent data={getAttendanceHistoryData()} dataKey="present" color="#10b981" />
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
            {homework.length === 0 && !loading && <p className="text-sm text-text-secondary">No pending homework assignments.</p>}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading homework...</p>}
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
                  <p className="text-xs text-text-tertiary mt-0.5">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {notices.length === 0 && !loading && <p className="text-sm text-text-secondary">No recent notices.</p>}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading notices...</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: event.color }} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{event.title}</p>
                  <p className="text-xs text-text-secondary">{new Date(event.date).toLocaleDateString()} • {event.type}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && !loading && <p className="text-sm text-text-secondary">No upcoming events.</p>}
            {loading && <p className="text-sm text-text-secondary animate-pulse">Loading events...</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

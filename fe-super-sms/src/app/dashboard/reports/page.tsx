'use client';

import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button } from '@/components/ui';
import { AreaChartComponent, BarChartComponent, LineChartComponent, PieChartComponent } from '@/components/charts';
import { Download } from 'lucide-react';
import { useGetStudentsQuery, useGetAttendanceQuery, useGetFeesQuery, useGetExamsQuery, useGetExamResultsQuery } from '@/store/slices/apiSlice';
import type { Student, FeeInvoice, AttendanceRecord } from '@/types';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('attendance');

  const { data: studentsRes } = useGetStudentsQuery();
  const students = studentsRes?.data || [];
  const { data: attendanceData = [] } = useGetAttendanceQuery();
  const { data: feeData = [] } = useGetFeesQuery();
  const { data: exams = [] } = useGetExamsQuery();
  const { data: examResults = [] } = useGetExamResultsQuery();

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

  const getAttendanceTrendData = () => {
    const months = getLast6Months();
    return months.map(m => {
      let presentCount = 0;
      let totalCount = 0;
      (attendanceData as any[]).forEach(r => {
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

  const getFeeCollectionData = () => {
    const months = getLast6Months();
    return months.map(m => {
      let collected = 0;
      let pending = 0;
      (feeData as FeeInvoice[]).forEach(f => {
        const dateStr = f.createdAt || f.dueDate;
        if (!dateStr) return;
        const invoiceDate = new Date(dateStr);
        if (invoiceDate.getMonth() === m.monthIndex && invoiceDate.getFullYear() === m.year) {
          collected += f.paidAmount || 0;
          pending += Math.max(0, f.amount - (f.paidAmount || 0));
        }
      });
      return { month: m.month, collected, pending };
    });
  };

  const getCollectionRateData = () => {
    const feeCol = getFeeCollectionData();
    return feeCol.map(d => ({
      ...d,
      rate: d.collected + d.pending > 0 ? Math.round((d.collected / (d.collected + d.pending)) * 100) : 0,
    }));
  };

  const getSubjectPerformanceData = () => {
    const examSubjectMap: Record<string, string> = {};
    exams.forEach((e: any) => {
      examSubjectMap[e._id || e.id] = e.subject;
    });

    const subjectSums: Record<string, { totalObtained: number; totalMax: number }> = {};
    examResults.forEach((r: any) => {
      const subject = examSubjectMap[r.examId];
      if (subject) {
        if (!subjectSums[subject]) {
          subjectSums[subject] = { totalObtained: 0, totalMax: 0 };
        }
        subjectSums[subject].totalObtained += r.marksObtained || 0;
        subjectSums[subject].totalMax += r.totalMarks || 100;
      }
    });

    const data = Object.entries(subjectSums).map(([subject, stats]) => ({
      subject,
      average: stats.totalMax > 0 ? Math.round((stats.totalObtained / stats.totalMax) * 100) : 0,
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

  const getEnrollmentTrendData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    return years.map(y => {
      let count = 0;
      students.forEach((s: any) => {
        if (!s.admissionDate) return;
        const admissionYear = new Date(s.admissionDate).getFullYear();
        if (admissionYear <= y && s.isActive) {
          count++;
        }
      });
      return { year: String(y), students: count };
    });
  };

  const getGenderData = () => {
    const counts = { Male: 0, Female: 0, Other: 0 };
    students.forEach(s => {
      if (s.gender === 'male') counts.Male++;
      else if (s.gender === 'female') counts.Female++;
      else counts.Other++;
    });
    return [
      { name: 'Male', value: counts.Male },
      { name: 'Female', value: counts.Female },
      { name: 'Other', value: counts.Other },
    ];
  };

  const getClassStrengthData = () => {
    const classCounts: Record<string, number> = {};
    students.forEach(s => {
      if (!s.class) return;
      classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    });
    return Object.entries(classCounts).map(([cls, count]) => ({
      class: `Class ${cls}`,
      students: count,
    })).sort((a, b) => {
      const numA = parseInt(a.class.replace('Class ', ''));
      const numB = parseInt(b.class.replace('Class ', ''));
      return numA - numB;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">Data-driven insights for better decision making.</p>
        </div>
        <Button variant="outline" icon={Download}>Export Report</Button>
      </div>

      <Tabs
        tabs={[
          { label: 'Attendance', value: 'attendance' },
          { label: 'Fee Collection', value: 'fees' },
          { label: 'Academic', value: 'academic' },
          { label: 'Demographics', value: 'demographics' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'attendance' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Attendance Rate</h3>
            <AreaChartComponent data={getAttendanceTrendData()} dataKey="present" color="#10b981" />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Present vs Absent</h3>
            <LineChartComponent
              data={getAttendanceTrendData()}
              dataKeys={[
                { key: 'present', color: '#10b981', name: 'Present %' },
                { key: 'absent', color: '#ef4444', name: 'Absent %' },
              ]}
            />
          </Card>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Fee Collection Trend</h3>
            <BarChartComponent
              data={getFeeCollectionData()}
              dataKeys={[
                { key: 'collected', color: '#6366f1', name: 'Collected' },
                { key: 'pending', color: '#f59e0b', name: 'Pending' },
              ]}
              stacked
            />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Collection Rate</h3>
            <AreaChartComponent
              data={getCollectionRateData()}
              dataKey="rate"
              color="#6366f1"
            />
          </Card>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Subject-wise Performance</h3>
            <BarChartComponent
              data={getSubjectPerformanceData()}
              dataKeys={[{ key: 'average', color: '#6366f1', name: 'Average Score' }]}
              xKey="subject"
            />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Enrollment Growth</h3>
            <AreaChartComponent data={getEnrollmentTrendData()} dataKey="students" xKey="year" color="#10b981" />
          </Card>
        </div>
      )}

      {activeTab === 'demographics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Gender Distribution</h3>
            <PieChartComponent data={getGenderData()} dataKey="value" nameKey="name" innerRadius={50} />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Class-wise Strength</h3>
            {students.length > 0 ? (
              <BarChartComponent
                data={getClassStrengthData()}
                dataKeys={[{ key: 'students', color: '#6366f1', name: 'Students' }]}
                xKey="class"
              />
            ) : (
              <p className="text-sm text-text-secondary py-12 text-center">No student data available.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

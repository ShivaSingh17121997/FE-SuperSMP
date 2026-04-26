'use client';

import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button } from '@/components/ui';
import { AreaChartComponent, BarChartComponent, LineChartComponent, PieChartComponent } from '@/components/charts';
import { Download } from 'lucide-react';
import { attendanceChartData, feeCollectionData, studentPerformanceData, enrollmentTrendData } from '@/lib/mock-data';
import { studentService } from '@/services/db';
import type { Student } from '@/types';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(studentService.getAll());
  }, []);

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
            <AreaChartComponent data={attendanceChartData} dataKey="present" color="#10b981" />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Present vs Absent</h3>
            <LineChartComponent
              data={attendanceChartData}
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
              data={feeCollectionData}
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
              data={feeCollectionData.map(d => ({ ...d, rate: Math.round((d.collected / (d.collected + d.pending)) * 100) }))}
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
              data={studentPerformanceData}
              dataKeys={[{ key: 'average', color: '#6366f1', name: 'Average Score' }]}
              xKey="subject"
            />
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Enrollment Growth</h3>
            <AreaChartComponent data={enrollmentTrendData} dataKey="students" xKey="year" color="#10b981" />
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

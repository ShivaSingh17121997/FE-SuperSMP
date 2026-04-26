'use client';

import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Badge } from '@/components/ui';
import { useGetStudentsQuery, useGetAttendanceQuery, useMarkAttendanceMutation } from '@/store/slices/apiSlice';
import { CLASSES, SECTIONS } from '@/constants';
import { Check, X, Clock, AlertTriangle, Save } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { AttendanceStatus } from '@/types';

import { useAuth } from '@/hooks';

const statusConfig: Record<AttendanceStatus, { icon: typeof Check; color: string; bg: string; label: string }> = {
  present: { icon: Check, color: 'text-success-500', bg: 'bg-success-50', label: 'Present' },
  absent: { icon: X, color: 'text-danger-500', bg: 'bg-danger-50', label: 'Absent' },
  late: { icon: Clock, color: 'text-warning-500', bg: 'bg-warning-50', label: 'Late' },
  'half-day': { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Half Day' },
};

export default function AttendancePage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal', 'teacher'].includes(user.role);
  
  // Cast user to any to access the dynamically injected properties (class, section)
  const userData = user as any; 
  const [selectedClass, setSelectedClass] = useState(userData?.class || '10');
  const [selectedSection, setSelectedSection] = useState(userData?.section || 'A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const { data: studentsData } = useGetStudentsQuery({ class: selectedClass, section: selectedSection });
  const students = studentsData?.data || [];
  const { data: existingAttendance = [] } = useGetAttendanceQuery({ date, class: selectedClass, section: selectedSection });
  const [markAttendance] = useMarkAttendanceMutation();

  // Load existing attendance records
  useEffect(() => {
    const map: Record<string, AttendanceStatus> = {};
    if (Array.isArray(existingAttendance)) {
        existingAttendance.forEach((a: any) => { 
            if (a.studentId) map[a.studentId] = a.status; 
        });
    }
    setAttendance(map);
    setSaved(false);
  }, [existingAttendance]);

  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const saveAttendance = async () => {
    try {
      // Send attendance data to backend
      const records = students.map((student: any) => ({
        studentId: student._id || student.id,
        studentName: student.name,
        class: selectedClass,
        section: selectedSection,
        date,
        status: attendance[student._id || student.id] || 'present',
      }));

      await markAttendance({ records, date, class: selectedClass, section: selectedSection }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save attendance failed:', err);
    }
  };

  const getStudentId = (s: any) => s._id || s.id;
  const presentCount = students.filter((s: any) => (attendance[getStudentId(s)] || 'present') === 'present').length;
  const absentCount = students.filter((s: any) => attendance[getStudentId(s)] === 'absent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{canManage ? 'Mark Attendance' : 'View Attendance'}</h1>
          <p className="text-sm text-text-secondary mt-1">{canManage ? 'Mark daily attendance for your class.' : 'View your daily attendance records.'}</p>
        </div>
        {canManage && (
          <Button icon={Save} onClick={saveAttendance} variant={saved ? 'outline' : 'primary'}>
            {saved ? '✓ Saved!' : 'Save Attendance'}
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} value={selectedClass} onChange={e => setSelectedClass(e.target.value)} disabled={!canManage} className="w-36" />
          <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))} value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={!canManage} className="w-36" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} disabled={!canManage} className="px-3 py-2 text-sm rounded-lg border border-border bg-surface" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-text-primary">{students.length}</p>
          <p className="text-xs text-text-secondary">Total</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-success-500">{presentCount}</p>
          <p className="text-xs text-text-secondary">Present</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-danger-500">{absentCount}</p>
          <p className="text-xs text-text-secondary">Absent</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-primary-600">{students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%</p>
          <p className="text-xs text-text-secondary">Rate</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="space-y-2">
          {students.map((student: any) => {
            const sid = getStudentId(student);
            const status = attendance[sid] || 'present';
            return (
              <div key={sid} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{student.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{student.name}</p>
                    <p className="text-xs text-text-tertiary">Roll: {student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(Object.keys(statusConfig) as AttendanceStatus[]).map(s => {
                    const config = statusConfig[s];
                    const Icon = config.icon;
                    return (
                      <button
                        key={s}
                        onClick={() => canManage && toggleStatus(sid, s)}
                        disabled={!canManage}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                          canManage && 'cursor-pointer',
                          status === s ? `${config.bg} ${config.color}` : 'text-text-tertiary hover:bg-surface-tertiary'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 inline mr-1" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {students.length === 0 && (
            <p className="text-center py-8 text-sm text-text-secondary">No students found in Class {selectedClass}-{selectedSection}.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

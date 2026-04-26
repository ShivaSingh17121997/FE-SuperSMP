'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Tabs, DataTable, Modal, Input, Select } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { useGetExamsQuery, useCreateExamMutation, useUpdateExamMutation, useDeleteExamMutation, useGetExamResultsQuery } from '@/store/slices/apiSlice';
import { studentPerformanceData } from '@/lib/mock-data';
import { CLASSES, SUBJECTS } from '@/constants';
import type { Exam, ExamResult } from '@/types';

import { useAuth } from '@/hooks';

const statusVariant = { upcoming: 'info' as const, ongoing: 'warning' as const, completed: 'success' as const };

export default function ExamsPage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal', 'teacher'].includes(user.role);

  const userData = user as any;
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';
  const queryParams: Record<string, string> = isStudentOrParent && userData?.class ? { class: String(userData.class) } : {};


  const { data: exams = [], isLoading } = useGetExamsQuery(queryParams);
  // Optional: Also restrict exam results here or backend
  const { data: results = [] } = useGetExamResultsQuery();
  const [createExam] = useCreateExamMutation();
  const [updateExamApi] = useUpdateExamMutation();
  const [deleteExamApi] = useDeleteExamMutation();

  const [activeTab, setActiveTab] = useState('exams');
  const [showExamModal, setShowExamModal] = useState(false);
  const [editExam, setEditExam] = useState<any>(null);
  const [examForm, setExamForm] = useState({ name: '', type: 'unit-test' as Exam['type'], class: '', subject: '', date: '', totalMarks: '', duration: '' });

  const getId = (e: any) => e._id || e.id;
  const resetExamForm = () => { setExamForm({ name: '', type: 'unit-test', class: '', subject: '', date: '', totalMarks: '', duration: '' }); setEditExam(null); };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...examForm, totalMarks: parseInt(examForm.totalMarks) || 100, duration: parseInt(examForm.duration) || 60, status: 'upcoming' as const };
      if (editExam) {
        await updateExamApi({ id: getId(editExam), body: data }).unwrap();
      } else {
        await createExam(data).unwrap();
      }
      setShowExamModal(false);
      resetExamForm();
    } catch (err) { console.error('Save failed:', err); }
  };

  const handleDeleteExam = async (id: string) => {
    if (confirm('Delete this exam?')) {
      try { await deleteExamApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEditExam = (e: any) => {
    setEditExam(e);
    setExamForm({ name: e.name, type: e.type, class: e.class, subject: e.subject, date: e.date, totalMarks: String(e.totalMarks), duration: String(e.duration) });
    setShowExamModal(true);
  };

  const examColumns = [
    { key: 'name', label: 'Exam Name' },
    { key: 'type', label: 'Type', render: (e: any) => <Badge variant="info">{e.type}</Badge> },
    { key: 'class', label: 'Class', render: (e: any) => `Class ${e.class}` },
    { key: 'subject', label: 'Subject' },
    { key: 'date', label: 'Date' },
    { key: 'totalMarks', label: 'Total Marks' },
    { key: 'status', label: 'Status', render: (e: any) => <Badge variant={statusVariant[e.status as keyof typeof statusVariant] || 'default'}>{e.status}</Badge> },
    ...(canManage ? [{ key: 'actions', label: 'Actions', render: (e: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEditExam(e)} className="text-text-tertiary hover:text-primary-600 cursor-pointer"><Edit className="w-4 h-4"/></button>
        <button onClick={() => handleDeleteExam(getId(e))} className="text-text-tertiary hover:text-danger-500 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
      </div>
    )}] : [])
  ];

  const resultColumns = [
    { key: 'studentName', label: 'Student' },
    { key: 'marksObtained', label: 'Marks', render: (r: any) => `${r.marksObtained}/${r.totalMarks}` },
    { key: 'percentage', label: 'Percentage', render: (r: any) => `${r.percentage}%` },
    { key: 'grade', label: 'Grade', render: (r: any) => { const variant = r.percentage >= 90 ? 'success' : r.percentage >= 60 ? 'info' : 'warning'; return <Badge variant={variant as any}>{r.grade}</Badge>; }},
  ];

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading exams...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Exams & Results</h1>
          <p className="text-sm text-text-secondary mt-1">Manage exams, enter marks, and view results.</p>
        </div>
        {canManage && <Button icon={FileText} onClick={() => { resetExamForm(); setShowExamModal(true); }}>Schedule Exam</Button>}
      </div>

      <Tabs tabs={[
        { label: `Exams (${(exams as any[]).length})`, value: 'exams' },
        { label: `Results (${(results as any[]).length})`, value: 'results' },
        { label: 'Performance', value: 'performance' },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'exams' && (
        <Card className="p-4"><DataTable columns={examColumns} data={exams as any[]} emptyMessage="No exams scheduled yet." /></Card>
      )}
      {activeTab === 'results' && (
        <Card className="p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4">Exam Results</h3>
          <DataTable columns={resultColumns} data={results as any[]} emptyMessage="No results published yet." />
        </Card>
      )}
      {activeTab === 'performance' && (
        <Card>
          <h3 className="text-base font-semibold text-text-primary mb-4">Subject-wise Average Performance</h3>
          <BarChartComponent data={studentPerformanceData} dataKeys={[{ key: 'average', color: '#6366f1', name: 'Class Average' }]} xKey="subject" />
        </Card>
      )}

      {canManage && (
        <Modal isOpen={showExamModal} onClose={() => { setShowExamModal(false); resetExamForm(); }} title={editExam ? 'Edit Exam' : 'Schedule Exam'} size="lg">
          <form className="space-y-4" onSubmit={handleSaveExam}>
            <Input label="Exam Name" placeholder="E.g. Term 1 Final" required value={examForm.name} onChange={e => setExamForm(f => ({ ...f, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" options={[{ value: 'unit-test', label: 'Unit Test' }, { value: 'mid-term', label: 'Mid Term' }, { value: 'final', label: 'Final Exam' }, { value: 'quiz', label: 'Quiz' }]} value={examForm.type} onChange={e => setExamForm(f => ({ ...f, type: e.target.value as Exam['type'] }))} />
              <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} placeholder="Select Class" value={examForm.class} onChange={e => setExamForm(f => ({ ...f, class: e.target.value }))} required />
              <Select label="Subject" options={SUBJECTS.map(s => ({ value: s, label: s }))} placeholder="Select Subject" value={examForm.subject} onChange={e => setExamForm(f => ({ ...f, subject: e.target.value }))} required />
              <Input label="Date" type="date" value={examForm.date} onChange={e => setExamForm(f => ({ ...f, date: e.target.value }))} required />
              <Input label="Total Marks" type="number" placeholder="100" value={examForm.totalMarks} onChange={e => setExamForm(f => ({ ...f, totalMarks: e.target.value }))} required />
              <Input label="Duration (minutes)" type="number" placeholder="60" value={examForm.duration} onChange={e => setExamForm(f => ({ ...f, duration: e.target.value }))} required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setShowExamModal(false)}>Cancel</Button>
              <Button type="submit">{editExam ? 'Update' : 'Schedule'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Input, Textarea, Select } from '@/components/ui';
import { Plus, Calendar, Users, Trash2, Edit } from 'lucide-react';
import { useGetHomeworksQuery, useCreateHomeworkMutation, useUpdateHomeworkMutation, useDeleteHomeworkMutation } from '@/store/slices/apiSlice';
import { useAuth } from '@/hooks';
import { CLASSES, SECTIONS, SUBJECTS } from '@/constants';
import type { Homework } from '@/types';

export default function HomeworkPage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal', 'teacher'].includes(user.role);
  
  const userData = user as any;
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';
  const queryParams: Record<string, string> = isStudentOrParent && userData?.class ? { class: String(userData.class), section: String(userData.section) } : {};

  
  const { data: homework = [], isLoading } = useGetHomeworksQuery(queryParams);
  const [createHomework] = useCreateHomeworkMutation();
  const [updateHomework] = useUpdateHomeworkMutation();
  const [deleteHomeworkApi] = useDeleteHomeworkMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', subject: '', class: '', section: '', dueDate: '' });

  const resetForm = () => { setForm({ title: '', description: '', subject: '', class: '', section: '', dueDate: '' }); setEditItem(null); };
  const getId = (item: any) => item._id || item.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateHomework({ id: getId(editItem), body: form }).unwrap();
      } else {
        await createHomework({
          ...form,
          assignedBy: user?.name || 'Teacher',
          submissions: 0,
          totalStudents: 40,
          createdAt: new Date().toISOString().split('T')[0],
        }).unwrap();
      }
      setShowCreateModal(false);
      resetForm();
    } catch (err) { console.error('Save failed:', err); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this homework?')) {
      try { await deleteHomeworkApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEdit = (hw: any) => {
    setEditItem(hw);
    setForm({ title: hw.title, description: hw.description || '', subject: hw.subject, class: hw.class, section: hw.section, dueDate: hw.dueDate });
    setShowCreateModal(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading homework...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Homework</h1>
          <p className="text-sm text-text-secondary mt-1">{(homework as any[]).length} assignments</p>
        </div>
        {canManage && <Button icon={Plus} onClick={() => { resetForm(); setShowCreateModal(true); }}>Create Homework</Button>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(homework as any[]).map((hw: any) => (
          <Card key={getId(hw)} hover className="flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <Badge variant="info">{hw.subject}</Badge>
              {canManage && (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(hw)} className="p-1 text-text-tertiary hover:text-primary-600 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(getId(hw))} className="p-1 text-text-tertiary hover:text-danger-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-2">{hw.title}</h3>
            <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-2">{hw.description}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Submissions</span>
                <span className="font-medium text-text-primary">{hw.submissions || 0}/{hw.totalStudents || 40}</span>
              </div>
              <div className="w-full bg-surface-tertiary rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${(hw.totalStudents || 40) > 0 ? ((hw.submissions || 0) / (hw.totalStudents || 40)) * 100 : 0}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {hw.dueDate}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {typeof hw.assignedBy === 'object' ? hw.assignedBy.name : hw.assignedBy}</span>
              </div>
            </div>
          </Card>
        ))}
        {(homework as any[]).length === 0 && (
          <div className="col-span-full text-center py-12 text-text-secondary">No homework created yet.</div>
        )}
      </div>

      {canManage && (
        <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm(); }} title={editItem ? 'Edit Homework' : 'Create Homework'} size="lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Title" placeholder="Homework title" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea label="Description" placeholder="Homework description and instructions..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="grid grid-cols-3 gap-4">
              <Select label="Subject" options={SUBJECTS.map(s => ({ value: s, label: s }))} placeholder="Select" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} placeholder="Select" value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} />
              <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: s }))} placeholder="Select" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
            </div>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }} type="button">Cancel</Button>
              <Button type="submit">{editItem ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

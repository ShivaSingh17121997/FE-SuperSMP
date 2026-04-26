'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, SearchBar, DataTable, Modal, Input, Select } from '@/components/ui';
import { useGetStudentsQuery, useCreateStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation, useResetPasswordMutation, useGetClassTeachersQuery } from '@/store/slices/apiSlice';
import { Award, Plus, Download, Trash2, Edit, Key } from 'lucide-react';
import { CLASSES, SECTIONS } from '@/constants';
import type { Student } from '@/types';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [newPass, setNewPass] = useState('');
  const [resetting, setResetting] = useState(false);

  const { data: studentsData, isLoading } = useGetStudentsQuery();
  const students = studentsData?.data || [];
  const { data: classTeachers = [] } = useGetClassTeachersQuery();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudentApi] = useDeleteStudentMutation();
  const [resetPass] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    name: '', email: '', rollNumber: '', class: '', section: '',
    parentName: '', parentPhone: '', parentEmail: '', password: '', parentPassword: '',
  });

  const filtered = useMemo(() => {
    if (!search) return students;
    return students.filter((s: any) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.class?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, students]);

  const getId = (s: any) => s._id || s.id;

  const resetForm = () => {
    setFormData({
      name: '', email: '', rollNumber: '', class: '', section: '',
      parentName: '', parentPhone: '', parentEmail: '', password: '', parentPassword: '',
    });
    setEditingStudent(null);
    setNewPass('');
    setResetting(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudent({ ...formData, isActive: true, admissionDate: new Date().toISOString().split('T')[0] }).unwrap();
      setShowAddModal(false);
      resetForm();
    } catch (err) { console.error('Add failed:', err); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      await updateStudent({
        id: getId(editingStudent),
        body: {
          name: formData.name, email: formData.email, rollNumber: formData.rollNumber,
          class: formData.class, section: formData.section,
          parentName: formData.parentName, parentPhone: formData.parentPhone, parentEmail: formData.parentEmail,
        },
      }).unwrap();
      setShowAddModal(false);
      resetForm();
    } catch (err) { console.error('Update failed:', err); }
  };

  const handleResetPassword = async () => {
    if (!editingStudent || !newPass) return;
    try {
      await resetPass({ id: getId(editingStudent), body: { newPassword: newPass } }).unwrap();
      alert('Password reset successfully!');
      setNewPass('');
      setResetting(false);
    } catch (err) { console.error('Reset failed:', err); alert('Failed to reset password'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this student?')) {
      try { await deleteStudentApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEdit = (s: any) => {
    setEditingStudent(s);
    setFormData({
      name: s.name, email: s.email, rollNumber: s.rollNumber,
      class: s.class, section: s.section,
      parentName: s.parentName || '', parentPhone: s.parentPhone || '', parentEmail: s.parentEmail || '',
      password: '', parentPassword: '',
    });
    setShowAddModal(true);
  };

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (s: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
          <div>
            <p className="text-sm font-medium text-text-primary">{s.name}</p>
            <p className="text-xs text-text-tertiary">{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'class', label: 'Class', render: (s: any) => `Class ${s.class}` },
    { key: 'section', label: 'Section' },
    { 
        key: 'classTeacher', 
        label: 'Class Teacher', 
        render: (s: any) => {
            const ct = classTeachers.find((c: any) => String(c.class) === String(s.class) && String(c.section) === String(s.section));
            return ct ? (
                <div className="flex items-center gap-1 text-sm text-text-secondary" title={`Class Teacher: ${ct.teacherName || ct.teacherId?.name}`}>
                    <Award className="w-3.5 h-3.5 text-warning-500" />
                    <span>{ct.teacherName || ct.teacherId?.name}</span>
                </div>
            ) : '-';
        }
    },
    { key: 'parentName', label: 'Parent', render: (s: any) => s.parentName || '-' },
    { key: 'isActive', label: 'Status', render: (s: any) => <Badge variant={s.isActive ? 'success' : 'danger'}>{s.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (s: any) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(s)} className="p-1.5 text-text-tertiary hover:text-primary-600 cursor-pointer"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(getId(s))} className="p-1.5 text-text-tertiary hover:text-danger-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading students...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <p className="text-sm text-text-secondary mt-1">{filtered.length} total students</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download} size="sm">Export</Button>
          <Button icon={Plus} size="sm" onClick={() => { resetForm(); setShowAddModal(true); }}>Add Student</Button>
        </div>
      </div>

      <Card className="p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students..." className="mb-4 sm:w-80" />
        <DataTable columns={columns} data={filtered} />
      </Card>

      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm(); }} title={editingStudent ? 'Edit Student' : 'Add New Student'} size="lg">
        <form className="space-y-4" onSubmit={editingStudent ? handleEdit : handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Student name" required value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" type="email" placeholder="student@school.edu" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
            <Input label="Roll Number" placeholder="101" required value={formData.rollNumber} onChange={e => setFormData(f => ({ ...f, rollNumber: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} placeholder="Select" value={formData.class} onChange={e => setFormData(f => ({ ...f, class: e.target.value }))} required />
              <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: s }))} placeholder="Select" value={formData.section} onChange={e => setFormData(f => ({ ...f, section: e.target.value }))} required />
            </div>
            {!editingStudent && (
              <Input label="Login Password" type="password" placeholder="Set initial password" required value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
            )}
            <div className="col-span-1 md:col-span-2 border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Parent/Guardian Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Parent Name" placeholder="Father/Mother name" value={formData.parentName} onChange={e => setFormData(f => ({ ...f, parentName: e.target.value }))} />
                <Input label="Parent Phone" placeholder="+91-9876543210" value={formData.parentPhone} onChange={e => setFormData(f => ({ ...f, parentPhone: e.target.value }))} />
                <Input label="Parent Email" type="email" placeholder="parent@email.com" value={formData.parentEmail} onChange={e => setFormData(f => ({ ...f, parentEmail: e.target.value }))} />
                {!editingStudent && (
                    <Input label="Parent Password" type="password" placeholder="Set parent password" value={formData.parentPassword} onChange={e => setFormData(f => ({ ...f, parentPassword: e.target.value }))} />
                )}
              </div>
            </div>

            {editingStudent && (
                <div className="col-span-2 border-t border-border pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2"><Key className="w-4 h-4" /> Admin Controls</h4>
                        <button type="button" onClick={() => setResetting(!resetting)} className="text-xs text-primary-600 hover:underline">
                            {resetting ? 'Cancel Reset' : 'Reset Password'}
                        </button>
                    </div>
                    {resetting && (
                        <div className="flex items-end gap-3 p-3 bg-surface-tertiary rounded-lg border border-border">
                            <div className="flex-1">
                                <Input label="New Password" type="password" placeholder="Enter new password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                            </div>
                            <Button type="button" size="sm" onClick={handleResetPassword} disabled={!newPass}>Confirm Reset</Button>
                        </div>
                    )}
                </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }} type="button">Cancel</Button>
            <Button type="submit">{editingStudent ? 'Update Student' : 'Add Student'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

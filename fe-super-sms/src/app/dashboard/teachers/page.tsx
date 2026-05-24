'use client';

import React, { useState, useMemo } from 'react';
import { Button, Card, Badge, SearchBar, DataTable, Modal, Input, Select } from '@/components/ui';
import { Plus, Download, Trash2, Edit, Award, Key } from 'lucide-react';
import { useGetTeachersQuery, useCreateTeacherMutation, useUpdateTeacherMutation, useDeleteTeacherMutation, useGetClassTeachersQuery, useAssignClassTeacherMutation, useRemoveClassTeacherMutation, useResetPasswordMutation } from '@/store/slices/apiSlice';
import { CLASSES, SECTIONS } from '@/constants';
import type { Teacher } from '@/types';

export default function TeachersPage() {
  const { data: teachersData, isLoading } = useGetTeachersQuery();
  const teachers = teachersData?.data || [];
  const { data: classTeachers = [] } = useGetClassTeachersQuery();
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacherApi] = useDeleteTeacherMutation();
  const [assignClassTeacher] = useAssignClassTeacherMutation();
  const [removeClassTeacher] = useRemoveClassTeacherMutation();
  const [resetPass] = useResetPasswordMutation();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [assignTeacherObj, setAssignTeacherObj] = useState<any>(null);
  const [assignClass, setAssignClass] = useState('');
  const [assignSection, setAssignSection] = useState('');
  
  const [newPass, setNewPass] = useState('');
  const [resetting, setResetting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', employeeId: '',
    subjects: '' as string, qualification: '', experience: '',
    password: '',
  });

  const filtered = useMemo(() => {
    if (!search) return teachers;
    return teachers.filter((t: any) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department?.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, teachers]);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', department: '', employeeId: '', subjects: '', qualification: '', experience: '', password: '' });
    setEditingTeacher(null);
    setNewPass('');
    setResetting(false);
  };

  const getId = (t: any) => t._id || t.id;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeacher({
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
        experience: parseInt(formData.experience) || 0,
        salary: 50000,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
      }).unwrap();
      setShowAddModal(false);
      resetForm();
    } catch (err) { console.error('Create failed:', err); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    try {
      await updateTeacher({
        id: getId(editingTeacher),
        body: {
          name: formData.name, email: formData.email, phone: formData.phone,
          department: formData.department, employeeId: formData.employeeId,
          subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
          qualification: formData.qualification, experience: parseInt(formData.experience) || 0,
        },
      }).unwrap();
      setShowAddModal(false);
      resetForm();
    } catch (err) { console.error('Update failed:', err); }
  };

  const handleResetPassword = async () => {
    if (!editingTeacher || !newPass) return;
    try {
      await resetPass({ id: getId(editingTeacher), body: { newPassword: newPass } }).unwrap();
      alert('Password reset successfully!');
      setNewPass('');
      setResetting(false);
    } catch (err: any) {
      console.error('Reset failed:', err);
      alert(err?.data?.message || err?.message || 'Failed to reset password');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try { await deleteTeacherApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name, email: teacher.email, phone: teacher.phone || '',
      department: teacher.department, employeeId: teacher.employeeId,
      subjects: teacher.subjects?.join(', ') || '', qualification: teacher.qualification || '',
      experience: String(teacher.experience),
      password: '',
    });
    setShowAddModal(true);
  };

  const openAssign = (teacher: any) => {
    setAssignTeacherObj(teacher);
    const existing = classTeachers.find((ct: any) => ct.teacherId === getId(teacher));
    setAssignClass(existing?.class || '');
    setAssignSection(existing?.section || '');
    setShowAssignModal(true);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherObj || !assignClass || !assignSection) return;
    try {
      await assignClassTeacher({ teacherId: getId(assignTeacherObj), class: assignClass, section: assignSection }).unwrap();
      setShowAssignModal(false);
      setAssignTeacherObj(null);
    } catch (err) { console.error('Assign failed:', err); }
  };

  const handleUnassign = async (teacherId: string) => {
    const assignment = classTeachers.find((ct: any) => ct.teacherId === teacherId);
    if (assignment) {
      try { await removeClassTeacher(assignment._id || assignment.id).unwrap(); } catch (err) { console.error('Unassign failed:', err); }
    }
  };

  const getClassTeacherBadge = (teacherId: string) => {
    const assignment = classTeachers.find((ct: any) => {
        const ctId = ct.teacherId?._id || ct.teacherId?.id || ct.teacherId;
        return String(ctId) === String(teacherId);
    });
    if (assignment) return `Class ${assignment.class}-${assignment.section}`;
    return null;
  };

  const columns = [
    {
      key: 'name', label: 'Teacher',
      render: (t: any) => {
        const isClassTeacher = getClassTeacherBadge(getId(t));
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isClassTeacher ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-cyan-600'} flex items-center justify-center text-white text-xs font-bold relative`}>
              {t.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                 <p className="text-sm font-medium text-text-primary">{t.name}</p>
                 {isClassTeacher && (
                    <span title={`Class Teacher: ${isClassTeacher}`}>
                        <Award className="w-4 h-4 text-warning-500 fill-warning-100" />
                    </span>
                 )}
              </div>
              <p className="text-xs text-text-tertiary">{t.email}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'employeeId', label: 'ID' },
    { key: 'department', label: 'Department' },
    { key: 'subjects', label: 'Subjects', render: (t: any) => t.subjects?.join(', ') || '-' },
    { key: 'experience', label: 'Exp', render: (t: any) => `${t.experience} yrs` },
    {
      key: 'classTeacher', label: 'Class Teacher',
      render: (t: any) => {
        const badge = getClassTeacherBadge(getId(t));
        return badge ? (
          <div className="flex items-center gap-1">
            <Badge variant="success"><Award className="w-3 h-3 inline mr-1" />{badge}</Badge>
            <button onClick={() => handleUnassign(getId(t))} className="text-xs text-danger-500 hover:text-danger-600 cursor-pointer ml-1">✕</button>
          </div>
        ) : (
          <button onClick={() => openAssign(t)} className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer">Assign</button>
        );
      },
    },
    { key: 'isActive', label: 'Status', render: (t: any) => <Badge variant={t.isActive ? 'success' : 'danger'}>{t.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (t: any) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(t)} className="p-1.5 text-text-tertiary hover:text-primary-600 cursor-pointer"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(getId(t))} className="p-1.5 text-text-tertiary hover:text-danger-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading teachers...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Teachers</h1>
          <p className="text-sm text-text-secondary mt-1">{filtered.length} teachers • {classTeachers.length} class teachers assigned</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download} size="sm">Export</Button>
          <Button icon={Plus} size="sm" onClick={() => { resetForm(); setShowAddModal(true); }}>Add Teacher</Button>
        </div>
      </div>

      <Card className="p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search teachers..." className="mb-4 sm:w-80" />
        <DataTable columns={columns} data={filtered} />
      </Card>

      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm(); }} title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'} size="lg">
        <form className="space-y-4" onSubmit={editingTeacher ? handleEdit : handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Teacher name" required value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" type="email" placeholder="teacher@school.edu" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" placeholder="+91-9876543210" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Employee ID" placeholder="TCH-001" value={formData.employeeId} onChange={e => setFormData(f => ({ ...f, employeeId: e.target.value }))} />
            <Input label="Department" placeholder="Science" value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))} />
            <Input label="Subjects (comma-separated)" placeholder="Physics, Chemistry" value={formData.subjects} onChange={e => setFormData(f => ({ ...f, subjects: e.target.value }))} />
            <Input label="Qualification" placeholder="M.Sc., Ph.D." value={formData.qualification} onChange={e => setFormData(f => ({ ...f, qualification: e.target.value }))} />
            <Input label="Experience (years)" type="number" placeholder="5" value={formData.experience} onChange={e => setFormData(f => ({ ...f, experience: e.target.value }))} />
            {!editingTeacher ? (
              <Input label="Login Password" type="password" placeholder="Set initial password" required value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
            ) : (
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
            <Button type="submit">{editingTeacher ? 'Update Teacher' : 'Add Teacher'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign as Class Teacher">
        <form className="space-y-4" onSubmit={handleAssign}>
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-text-primary"><strong>Teacher:</strong> {assignTeacherObj?.name}</p>
            <p className="text-xs text-text-secondary">{assignTeacherObj?.department} • {assignTeacherObj?.subjects?.join(', ')}</p>
          </div>
          <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} placeholder="Select class" value={assignClass} onChange={e => setAssignClass(e.target.value)} required />
          <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))} placeholder="Select section" value={assignSection} onChange={e => setAssignSection(e.target.value)} required />
          {assignClass && assignSection && (() => {
            const existing = classTeachers.find((ct: any) => ct.class === assignClass && ct.section === assignSection);
            return existing ? (
              <div className="p-2 bg-warning-50 border border-yellow-200 rounded-lg text-xs text-warning-600">⚠ {existing.teacherName} is currently assigned to this class. They will be replaced.</div>
            ) : null;
          })()}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAssignModal(false)} type="button">Cancel</Button>
            <Button type="submit" icon={Award}>Assign Class Teacher</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

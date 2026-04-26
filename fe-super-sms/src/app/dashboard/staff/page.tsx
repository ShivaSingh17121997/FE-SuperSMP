'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, SearchBar, DataTable, Modal, Input, Select } from '@/components/ui';
import { Plus, Download, Trash2, Edit, Key } from 'lucide-react';
import { useGetStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation, useResetPasswordMutation } from '@/store/slices/apiSlice';
import type { Staff } from '@/types';

export default function StaffPage() {
  const { data: staffData, isLoading } = useGetStaffQuery();
  const staff = staffData?.data || [];
  const [createStaff] = useCreateStaffMutation();
  const [updateStaffApi] = useUpdateStaffMutation();
  const [deleteStaffApi] = useDeleteStaffMutation();
  const [resetPass] = useResetPasswordMutation();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [newPass, setNewPass] = useState('');
  const [resetting, setResetting] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', department: '', salary: '', password: '' });

  const filtered = search
    ? staff.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()) || s.role?.toLowerCase().includes(search.toLowerCase()))
    : staff;

  const resetForm = () => { 
      setForm({ name: '', email: '', phone: '', role: '', department: '', salary: '', password: '' }); 
      setEditItem(null); 
      setNewPass('');
      setResetting(false);
  };
  const getId = (s: any) => s._id || s.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateStaffApi({ id: getId(editItem), body: { ...form, salary: parseInt(form.salary) || 0 } }).unwrap();
      } else {
        await createStaff({
          ...form, salary: parseInt(form.salary) || 0, isActive: true,
          joinDate: new Date().toISOString().split('T')[0],
        }).unwrap();
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) { console.error('Save failed:', err); }
  };

  const handleResetPassword = async () => {
    if (!editItem || !newPass) return;
    try {
      await resetPass({ id: getId(editItem), body: { newPassword: newPass } }).unwrap();
      alert('Password reset successfully!');
      setNewPass('');
      setResetting(false);
    } catch (err) { console.error('Reset failed:', err); alert('Failed to reset password'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this staff member?')) {
      try { await deleteStaffApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEdit = (s: any) => {
    setEditItem(s);
    setForm({ 
        name: s.name, email: s.email, phone: s.phone, 
        role: s.role, department: s.department, salary: String(s.salary),
        password: ''
    });
    setShowAddModal(true);
  };

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (s: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
          <div>
            <p className="text-sm font-medium text-text-primary">{s.name}</p>
            <p className="text-xs text-text-tertiary">{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary', render: (s: any) => `₹${(s.salary || 0).toLocaleString()}` },
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

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading staff...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Staff Management</h1>
          <p className="text-sm text-text-secondary mt-1">{filtered.length} staff members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download} size="sm">Export</Button>
          <Button icon={Plus} size="sm" onClick={() => { resetForm(); setShowAddModal(true); }}>Add Staff</Button>
        </div>
      </div>

      <Card className="p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." className="mb-4 sm:w-80" />
        <DataTable columns={columns} data={filtered} />
      </Card>

      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm(); }} title={editItem ? 'Edit Staff' : 'Add Staff Member'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Full Name" placeholder="Staff name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email" type="email" placeholder="staff@school.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" placeholder="+91-9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Select label="Role" options={[
            { value: 'Driver', label: 'Driver' }, { value: 'Peon', label: 'Peon' },
            { value: 'Clerk', label: 'Clerk' }, { value: 'Security Guard', label: 'Security Guard' },
            { value: 'Cook', label: 'Cook' }, { value: 'Librarian', label: 'Librarian' },
          ]} placeholder="Select role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <Input label="Department" placeholder="Administration" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <Input label="Salary" type="number" placeholder="15000" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          {!editItem ? (
              <Input label="Initial Password" type="password" placeholder="Password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          ) : (
                <div className="border-t border-border pt-4 mt-2">
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
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }} type="button">Cancel</Button>
            <Button type="submit">{editItem ? 'Update' : 'Add'} Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

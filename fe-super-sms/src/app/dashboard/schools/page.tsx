'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, SearchBar, DataTable, Modal, Input, Select } from '@/components/ui';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { useGetSchoolsQuery, useOnboardSchoolMutation, useUpdateSchoolMutation, useDeleteSchoolMutation } from '@/store/slices/apiSlice';
import type { School } from '@/types';

export default function SchoolsPage() {
  const { data: schools = [], isLoading, refetch } = useGetSchoolsQuery();
  const [onboardSchool] = useOnboardSchoolMutation();
  const [updateSchool] = useUpdateSchoolMutation();
  const [deleteSchool] = useDeleteSchoolMutation();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', phone: '', email: '',
    website: '', principalName: '', plan: 'starter' as School['plan'],
    password: ''
  });

  const filtered = search
    ? schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.city?.toLowerCase().includes(search.toLowerCase()))
    : schools;

  const resetForm = () => {
    setForm({ name: '', address: '', city: '', state: '', phone: '', email: '', website: '', principalName: '', plan: 'starter', password: '' });
    setEditSchool(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editSchool) {
        await updateSchool({ id: editSchool.id || (editSchool as any)._id, body: form }).unwrap();
      } else {
        await onboardSchool({
          school: {
            name: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            phone: form.phone,
            email: form.email,
          },
          admin: {
            name: form.principalName,
            email: form.email,
            phone: form.phone,
            password: form.password,
          },
        }).unwrap();
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate/delete this school?')) {
      try {
        await deleteSchool(id).unwrap();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const openEdit = (s: School) => {
    setEditSchool(s);
    setForm({ name: s.name, address: s.address, city: s.city, state: s.state, phone: s.phone, email: s.email, website: s.website || '', principalName: s.principalName, plan: s.plan, password: '' });
    setShowModal(true);
  };

  const getId = (s: any) => s._id || s.id;

  const columns = [
    {
      key: 'name', label: 'School Name',
      render: (s: School) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{s.name}</p>
            <p className="text-xs text-text-tertiary">{s.city}, {s.state}</p>
          </div>
        </div>
      )
    },
    { key: 'principalName', label: 'Principal' },
    { key: 'studentsCount', label: 'Students', render: (s: School) => (s.studentsCount || 0).toLocaleString() },
    { key: 'plan', label: 'Plan', render: (s: School) => <Badge variant={s.plan === 'enterprise' ? 'success' : s.plan === 'professional' ? 'info' : 'default'} className="capitalize">{s.plan}</Badge> },
    { key: 'isActive', label: 'Status', render: (s: School) => <Badge variant={s.isActive ? 'success' : 'danger'}>{s.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (s: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(s)} className="p-1 text-text-tertiary hover:text-primary-600"><Edit className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(getId(s))} className="p-1 text-text-tertiary hover:text-danger-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading schools...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Schools Management</h1>
          <p className="text-sm text-text-secondary mt-1">Manage all registered schools on the platform.</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowModal(true); }}>Onboard School</Button>
      </div>

      <Card className="p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search schools by name or city..." className="mb-4 sm:w-80" />
        <DataTable columns={columns} data={filtered} />
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editSchool ? 'Edit School' : 'Onboard New School'} size="lg">
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="School Name" placeholder="E.g. Delhi Public School" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Principal Name" placeholder="Dr. Priya Sharma" required value={form.principalName} onChange={e => setForm(f => ({ ...f, principalName: e.target.value }))} />
            <Input label="Email" type="email" placeholder="school@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" placeholder="+91-0000000000" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="City" placeholder="Mumbai" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            <Input label="State" placeholder="Maharashtra" required value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            <Select label="Subscription Plan" options={[{ value: 'starter', label: 'Starter' }, { value: 'professional', label: 'Professional' }, { value: 'enterprise', label: 'Enterprise' }]} value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value as School['plan'] }))} />
            <Input label="Website (optional)" placeholder="https://..." value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
            {!editSchool && (
              <Input label="Admin Password" type="password" placeholder="Set initial password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            )}
          </div>
          <Input label="Address" placeholder="Full school address" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button type="submit">{editSchool ? 'Update School' : 'Onboard School'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

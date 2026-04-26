'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Input, Textarea, Select } from '@/components/ui';
import { Plus, Bell, Megaphone, Trash2, Edit } from 'lucide-react';
import { useGetNoticesQuery, useCreateNoticeMutation, useUpdateNoticeMutation, useDeleteNoticeMutation } from '@/store/slices/apiSlice';
import { useAuth } from '@/hooks';
import type { Notice } from '@/types';

const categoryColors = { general: 'default' as const, academic: 'info' as const, event: 'success' as const, urgent: 'danger' as const };

export default function NoticesPage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal'].includes(user.role);
  const { data: notices = [], isLoading } = useGetNoticesQuery();
  const [createNotice] = useCreateNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();
  const [deleteNoticeApi] = useDeleteNoticeMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' as Notice['category'] });

  const resetForm = () => { setForm({ title: '', content: '', category: 'general' }); setEditItem(null); };
  const getId = (item: any) => item._id || item.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateNotice({ id: getId(editItem), body: form }).unwrap();
      } else {
        await createNotice({
          ...form,
          author: user?.name || 'Admin',
          targetAudience: ['super-admin', 'school-admin', 'principal', 'teacher', 'parent', 'student'],
          isPublished: true,
          createdAt: new Date().toISOString().split('T')[0],
        }).unwrap();
      }
      setShowCreateModal(false);
      resetForm();
    } catch (err) { console.error('Save failed:', err); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this notice?')) {
      try { await deleteNoticeApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  const openEdit = (notice: any) => {
    setEditItem(notice);
    setForm({ title: notice.title, content: notice.content, category: notice.category });
    setShowCreateModal(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading notices...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notices & Announcements</h1>
          <p className="text-sm text-text-secondary mt-1">{(notices as any[]).length} notices</p>
        </div>
        {canManage && <Button icon={Plus} onClick={() => { resetForm(); setShowCreateModal(true); }}>Create Notice</Button>}
      </div>

      <div className="space-y-4">
        {(notices as any[]).map((notice: any) => (
          <Card key={getId(notice)} hover>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                {notice.category === 'urgent' ? <Bell className="w-5 h-5 text-danger-500" /> : <Megaphone className="w-5 h-5 text-primary-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-base font-semibold text-text-primary">{notice.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={categoryColors[notice.category as keyof typeof categoryColors] || 'default'}>{notice.category}</Badge>
                    {canManage && (
                      <>
                        <button onClick={() => openEdit(notice)} className="p-1 text-text-tertiary hover:text-primary-600 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(getId(notice))} className="p-1 text-text-tertiary hover:text-danger-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{notice.content}</p>
                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span>By: {typeof notice.author === 'object' ? notice.author.name : notice.author}</span>
                  <span>{notice.createdAt}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {(notices as any[]).length === 0 && (
          <div className="text-center py-12 text-text-secondary">No notices yet. Create one to get started.</div>
        )}
      </div>

      {canManage && (
        <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm(); }} title={editItem ? 'Edit Notice' : 'Create Notice'} size="lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Notice Title" placeholder="Enter notice title" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea label="Content" placeholder="Write notice content..." rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            <Select label="Category" options={[
              { value: 'general', label: 'General' }, { value: 'academic', label: 'Academic' },
              { value: 'event', label: 'Event' }, { value: 'urgent', label: 'Urgent' },
            ]} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Notice['category'] }))} />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }} type="button">Cancel</Button>
              <Button type="submit">{editItem ? 'Update' : 'Publish'} Notice</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

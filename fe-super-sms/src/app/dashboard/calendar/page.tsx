'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Modal, Input, Select, Textarea } from '@/components/ui';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '@/store/slices/apiSlice';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const COLOR_MAP = { holiday: '#ef4444', exam: '#f59e0b', event: '#3b82f6', meeting: '#10b981' };

export default function CalendarPage() {
  const { data: events = [], isLoading } = useGetEventsQuery();
  const [createEvent] = useCreateEventMutation();
  const [deleteEventApi] = useDeleteEventMutation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', endDate: '', type: 'event' as CalendarEvent['type'] });

  const getId = (e: any) => e._id || e.id;
  const eventList = events as any[];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventList.filter(e => e.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date();
  const isToday = (day: number | null) => day !== null && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const typeColors = { holiday: 'danger' as const, exam: 'warning' as const, event: 'info' as const, meeting: 'success' as const };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const color = COLOR_MAP[form.type];
      await createEvent({ ...form, color }).unwrap();
      setShowModal(false);
      setForm({ title: '', description: '', date: '', endDate: '', type: 'event' });
    } catch (err) { console.error('Create failed:', err); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      try { await deleteEventApi(id).unwrap(); } catch (err) { console.error('Delete failed:', err); }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading calendar...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Calendar & Events</h1>
          <p className="text-sm text-text-secondary mt-1">View school events, holidays, and schedule.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Add Event</Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-lg font-semibold text-text-primary">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
            {DAYS.map(day => (
              <div key={day} className="bg-surface-secondary px-2 py-2 text-center text-xs font-semibold text-text-secondary">{day}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={i} className={cn('bg-surface min-h-[80px] p-2 transition-colors', day && 'hover:bg-surface-secondary', !day && 'bg-surface-secondary/50')}>
                  {day && (
                    <>
                      <span className={cn('text-sm font-medium', isToday(day) ? 'w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center' : 'text-text-primary')}>{day}</span>
                      {dayEvents.map((event: any) => (
                        <div key={getId(event)} className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate" style={{ backgroundColor: (event.color || '#3b82f6') + '20', color: event.color || '#3b82f6' }}>
                          {event.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-base font-semibold text-text-primary mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {eventList.slice(0, 10).map((event: any) => (
                <div key={getId(event)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors group">
                  <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: event.color || '#3b82f6' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{event.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{event.date}</p>
                    <Badge variant={typeColors[event.type as keyof typeof typeColors] || 'default'} className="mt-1">{event.type}</Badge>
                  </div>
                  <button onClick={() => handleDelete(getId(event))} className="opacity-0 group-hover:opacity-100 p-1 text-text-tertiary hover:text-danger-500 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {eventList.length === 0 && <p className="text-sm text-text-secondary">No upcoming events.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Event">
        <form className="space-y-4" onSubmit={handleCreate}>
          <Input label="Event Title" placeholder="Annual Sports Day" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Description" placeholder="Optional details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Select label="Type" options={[{ value: 'holiday', label: 'Holiday' }, { value: 'exam', label: 'Exam' }, { value: 'event', label: 'School Event' }, { value: 'meeting', label: 'Meeting' }]} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CalendarEvent['type'] }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            <Input label="End Date (Optional)" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

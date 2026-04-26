'use client';

import React, { useState } from 'react';
import { Card, Select, Button, Modal, Badge } from '@/components/ui';
import { Plus, Trash2, Award } from 'lucide-react';
import { useAuth } from '@/hooks';
import { useGetTimetablesQuery, useCreateTimetableSlotMutation, useDeleteTimetableSlotMutation, useGetTeachersQuery, useAssignClassTeacherMutation, useGetClassTeachersQuery } from '@/store/slices/apiSlice';
import { CLASSES, SECTIONS, SUBJECTS } from '@/constants';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TimetablePage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal'].includes(user.role);
  
  const userData = user as any;
  const isTeacher = user?.role === 'teacher';
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const [viewMode, setViewMode] = useState<'class' | 'teacher'>(isTeacher ? 'teacher' : 'class');
  const [selectedClass, setSelectedClass] = useState(isStudentOrParent ? (userData?.class || '10') : '10');
  const [selectedSection, setSelectedSection] = useState(isStudentOrParent ? (userData?.section || 'A') : 'A');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const { data: teachersData } = useGetTeachersQuery();
  const teachers = teachersData?.data || [];
  const { data: classTeachers = [] } = useGetClassTeachersQuery();
  
  const queryParams: any = {};
  if (viewMode === 'class' && !isTeacher) {
    queryParams.class = selectedClass;
    queryParams.section = selectedSection;
  } else if (viewMode === 'teacher' && !isTeacher) {
    queryParams.teacher = selectedTeacher;
  }

  const { data: timetables = [], isLoading, refetch } = useGetTimetablesQuery(queryParams, {
    skip: viewMode === 'teacher' && !isTeacher && !selectedTeacher,
  });

  const [createSlot] = useCreateTimetableSlotMutation();
  const [deleteSlot] = useDeleteTimetableSlotMutation();
  const [assignClassTeacherMutation] = useAssignClassTeacherMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [form, setForm] = useState({ class: '10', section: 'A', subject: 'Mathematics', teacher: '' });
  const [isClassTeacher, setIsClassTeacher] = useState(false);

  const getSlot = (day: string, period: number) => {
    return (timetables as any[]).find(t => t.day === day && t.period === period);
  };

  const handleCellClick = (day: string, period: number) => {
    if (!canManage) return;
    const slot = getSlot(day, period);
    if (!slot) {
      setSelectedDay(day);
      setSelectedPeriod(period);
      setForm({
         class: viewMode === 'class' ? selectedClass : '',
         section: viewMode === 'class' ? selectedSection : '',
         subject: '',
         teacher: viewMode === 'teacher' ? selectedTeacher : '',
      });
      setIsClassTeacher(false);
      setShowModal(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSlot({
         ...form,
         day: selectedDay,
         period: selectedPeriod,
      }).unwrap();
      
      if (isClassTeacher) {
         try {
           await assignClassTeacherMutation({ teacherId: form.teacher, class: form.class, section: form.section }).unwrap();
         } catch(err) {
           console.error('Class teacher assignment failed:', err);
         }
      }

      setShowModal(false);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || 'Conflict detected. Cannot save slot.');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this schedule slot?')) {
      try {
        await deleteSlot(id).unwrap();
        refetch();
      } catch (err) {
         console.error(err);
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading schedule...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Timetable</h1>
          <p className="text-sm text-text-secondary mt-1">Manage weekly class and teacher schedules.</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <Select 
            label="View By" 
            options={[{ value: 'class', label: 'Class/Section' }, { value: 'teacher', label: 'Teacher' }]} 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as 'class' | 'teacher')} 
            disabled={!canManage} 
            className="w-40" 
          />
          
          {viewMode === 'class' && (
            <>
              <Select label="Class" options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} value={selectedClass} onChange={e => setSelectedClass(e.target.value)} disabled={isStudentOrParent} className="w-32" />
              <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))} value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={isStudentOrParent} className="w-32" />
            </>
          )}

          {viewMode === 'teacher' && !isTeacher && (
            <Select 
              label="Teacher" 
              options={[{ value: '', label: 'Select Teacher' }, ...teachers.map((t: any) => ({ value: t._id || t.id, label: t.name }))]} 
              value={selectedTeacher} 
              onChange={e => setSelectedTeacher(e.target.value)} 
              className="w-64" 
            />
          )}

          {viewMode === 'teacher' && isTeacher && (
             <div className="px-4 py-2 bg-surface-secondary text-sm font-medium rounded-lg text-text-primary border border-border mb-[2px]">
               Viewing Your Schedule
             </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left border-collapse min-w-[800px]">
             <thead className="bg-surface-secondary text-text-secondary">
               <tr>
                 <th className="p-4 border-b border-r border-border font-semibold text-center w-24">Period</th>
                 {DAYS.map(day => (
                   <th key={day} className="p-4 border-b border-border font-semibold text-center min-w-[140px]">{day}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {PERIODS.map(period => (
                 <tr key={period} className="border-b border-border hover:bg-surface-secondary/50">
                   <td className="p-4 border-r border-border text-center font-medium bg-surface-secondary text-text-primary">
                     Period {period}
                   </td>
                   {DAYS.map(day => {
                     const slot = getSlot(day, period);
                     return (
                       <td 
                         key={`${day}-${period}`} 
                         className={`p-2 border-r border-border relative transition-colors ${!slot && canManage ? 'hover:bg-primary-50 cursor-pointer' : ''}`}
                         onClick={() => handleCellClick(day, period)}
                       >
                         {slot ? (
                           <div className="bg-surface border border-border rounded p-2 text-center relative group min-h-[60px] flex flex-col items-center justify-center">
                             <Badge variant="info" className="mb-1 text-xs">{slot.subject}</Badge>
                             {viewMode === 'class' ? (
                                <div className="flex items-center gap-1">
                                    <p className="text-[11px] font-medium text-text-secondary mt-1">{slot.teacher?.name || 'Unknown Teacher'}</p>
                                    {classTeachers.some((ct: any) => {
                                        const ctId = ct.teacherId?._id || ct.teacherId?.id || ct.teacherId;
                                        const slotTeacherId = slot.teacher?._id || slot.teacher?.id || slot.teacher;
                                        return String(ctId) === String(slotTeacherId) && String(ct.class) === String(slot.class) && String(ct.section) === String(slot.section);
                                    }) && (
                                        <span title="Class Teacher">
                                            <Award className="w-3 h-3 text-warning-500 mt-1" />
                                        </span>
                                    )}
                                </div>
                             ) : (
                                <p className="text-[11px] font-medium text-text-secondary mt-1">Class {slot.class}-{slot.section}</p>
                             )}
                             {canManage && (
                               <button 
                                 onClick={(e) => handleDelete(slot._id || slot.id, e)} 
                                 className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white rounded shadow-sm text-danger-500 hover:bg-danger-50 transition-opacity"
                                 title="Remove Slot"
                               >
                                 <Trash2 className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                         ) : (
                           canManage ? <div className="text-transparent flex items-center justify-center w-full h-full text-xs opacity-0 hover:opacity-100 hover:text-primary-400 group-hover:opacity-100 min-h-[40px]"><Plus className="w-4 h-4" /> Add</div> : null
                         )}
                       </td>
                     )
                   })}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </Card>

      {canManage && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Assign ${selectedDay}, Period ${selectedPeriod}`}>
          <form className="space-y-4" onSubmit={handleSave}>
            {viewMode === 'teacher' ? (
              <div className="grid grid-cols-2 gap-4">
                <Select label="Class" options={[{ value: '', label: 'Select Class' }, ...CLASSES.map(c => ({ value: c, label: `Class ${c}` }))]} value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} required />
                <Select label="Section" options={[{ value: '', label: 'Select Section' }, ...SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))]} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} required />
              </div>
            ) : (
              <Select label="Teacher" options={[{ value: '', label: 'Select Teacher' }, ...teachers.map((t: any) => ({ value: t._id || t.id, label: t.name }))]} value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} required />
            )}
            <Select label="Subject" options={[{ value: '', label: 'Select Subject' }, ...SUBJECTS.map(s => ({ value: s, label: s }))]} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
            
            <div className="flex items-center gap-2 pt-2 pb-1">
              <input type="checkbox" id="assignCT" checked={isClassTeacher} onChange={e => setIsClassTeacher(e.target.checked)} className="rounded border-border text-primary-600 focus:ring-primary-500" />
              <label htmlFor="assignCT" className="text-sm text-text-primary cursor-pointer select-none">Also assign as focal Class Teacher</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Save Slot</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

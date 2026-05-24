'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Map, CheckCircle2, Circle, Clock, TrendingUp, BookOpen, AlertCircle, Loader2, Plus, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CLASSES, SECTIONS, SUBJECTS } from '@/constants';
import api from '@/services/api';

export default function CourseRoadmapPage() {
  const userRole = useAppSelector(s => s.auth.user?.role);
  const isAdmin = userRole === 'school-admin' || userRole === 'super-admin' || userRole === 'principal';
  
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editChapters, setEditChapters] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/roadmap/progress/${selectedClass}/${selectedSection}/${selectedSubject}/2023-2024`);
      if (res.data && res.data.success) {
        setRoadmapData(res.data.data);
      } else {
        setRoadmapData(null);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
      setRoadmapData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, selectedSection, selectedSubject]);

  useEffect(() => {
    fetchRoadmap();
    setIsEditing(false); // Reset edit mode on filter change
  }, [fetchRoadmap]);

  const handleCreateNew = () => {
    setEditChapters([{ chapterName: '', expectedDays: 5, term: 'Term 1', order: 1 }]);
    setIsEditing(true);
  };

  const handleAddChapter = () => {
    setEditChapters([...editChapters, { chapterName: '', expectedDays: 5, term: 'Term 1', order: editChapters.length + 1 }]);
  };

  const handleRemoveChapter = (index: number) => {
    const newChapters = [...editChapters];
    newChapters.splice(index, 1);
    setEditChapters(newChapters);
  };

  const handleChapterChange = (index: number, field: string, value: any) => {
    const newChapters = [...editChapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setEditChapters(newChapters);
  };

  const handleSaveRoadmap = async () => {
    // Validate
    if (editChapters.some(c => !c.chapterName.trim())) {
      alert("Please ensure all chapters have a name.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        className: selectedClass,
        subject: selectedSubject,
        academicYear: '2023-2024',
        chapters: editChapters.map((c, i) => ({ ...c, order: i + 1 }))
      };
      const res = await api.post('/roadmap', payload);
      if (res.data.success) {
        setIsEditing(false);
        fetchRoadmap(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save roadmap. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'In Progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/5 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Map className="w-8 h-8 text-primary-600" />
            Course Roadmap
          </h1>
          <p className="text-text-secondary mt-1">
            Track syllabus progress, manage lesson plans, and ensure academic goals are met.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={isEditing}
            className="w-full bg-surface-secondary border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-shadow disabled:opacity-50"
          >
            {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Section</label>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={isEditing}
            className="w-full bg-surface-secondary border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-shadow disabled:opacity-50"
          >
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isEditing}
            className="w-full bg-surface-secondary border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-shadow disabled:opacity-50"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
          <p>Loading course syllabus...</p>
        </div>
      ) : isEditing ? (
        // Roadmap Builder Form (Edit/Create Mode)
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="text-xl font-bold text-text-primary">Create Roadmap for Class {selectedClass} - {selectedSubject}</h3>
              <p className="text-sm text-text-secondary">Define the chapters and expected timeline for the academic year.</p>
            </div>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2 text-text-tertiary hover:bg-surface-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            {editChapters.map((chapter, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-4 bg-surface-secondary/50 p-4 rounded-2xl border border-border/50 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Chapter Name</label>
                  <input 
                    type="text" 
                    value={chapter.chapterName}
                    onChange={(e) => handleChapterChange(index, 'chapterName', e.target.value)}
                    placeholder="e.g. Introduction to Algebra"
                    className="w-full bg-white dark:bg-surface border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                
                <div className="w-full md:w-32 shrink-0">
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Expected Days</label>
                  <input 
                    type="number" 
                    min="1"
                    value={chapter.expectedDays}
                    onChange={(e) => handleChapterChange(index, 'expectedDays', parseInt(e.target.value) || 1)}
                    className="w-full bg-white dark:bg-surface border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                
                <div className="w-full md:w-32 shrink-0">
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Term</label>
                  <select 
                    value={chapter.term}
                    onChange={(e) => handleChapterChange(index, 'term', e.target.value)}
                    className="w-full bg-white dark:bg-surface border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Full Year">Full Year</option>
                  </select>
                </div>

                <div className="pt-5 shrink-0">
                  <button 
                    onClick={() => handleRemoveChapter(index)}
                    disabled={editChapters.length === 1}
                    className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6">
            <button 
              onClick={handleAddChapter}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-secondary hover:bg-surface border border-border text-text-primary text-sm font-medium rounded-xl transition-all w-full md:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
            
            <button 
              onClick={handleSaveRoadmap}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-primary-500/20 w-full md:w-auto justify-center disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Roadmap'}
            </button>
          </div>
        </div>

      ) : !roadmapData ? (
        // No Roadmap State
        <div className="bg-surface border border-border rounded-3xl p-12 text-center text-text-secondary flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
            <Map className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-text-primary">No Roadmap Defined</h3>
          <p className="max-w-md mx-auto mb-8 text-text-tertiary">
            There is currently no syllabus or roadmap defined for Class {selectedClass} - {selectedSubject}. 
            Creating a roadmap helps teachers track progress and keeps students on schedule.
          </p>
          
          {isAdmin && (
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create New Roadmap
            </button>
          )}
        </div>
      ) : (
        // Premium Progress Dashboard
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Analytics Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-primary-100 font-medium mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Overall Progress
              </h3>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-6xl font-black tracking-tighter">{roadmapData.percentCompleted}%</span>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${roadmapData.percentCompleted}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm bg-black/10 rounded-xl p-4 backdrop-blur-sm">
                <div>
                  <p className="text-primary-200">Completed</p>
                  <p className="font-bold text-lg">{roadmapData.completedDays} Days</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-200">Expected Total</p>
                  <p className="font-bold text-lg">{roadmapData.totalExpectedDays} Days</p>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            <div className={cn(
              "border rounded-2xl p-5 flex items-start gap-4",
              roadmapData.percentCompleted === 0 
                ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                : "bg-green-500/10 border-green-500/20"
            )}>
              <div className={cn(
                "p-2 rounded-full shrink-0",
                roadmapData.percentCompleted === 0 ? "bg-gray-200 dark:bg-gray-700" : "bg-green-500/20"
              )}>
                <AlertCircle className={cn(
                  "w-6 h-6",
                  roadmapData.percentCompleted === 0 ? "text-gray-500" : "text-green-600"
                )} />
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold",
                  roadmapData.percentCompleted === 0 ? "text-gray-700 dark:text-gray-300" : "text-green-700 dark:text-green-500"
                )}>
                  Status: {roadmapData.percentCompleted === 0 ? 'Not Started' : roadmapData.progressStatus}
                </h4>
                <p className={cn(
                  "text-sm mt-1",
                  roadmapData.percentCompleted === 0 ? "text-gray-500" : "text-green-600/80 dark:text-green-400/80"
                )}>
                  {roadmapData.percentCompleted === 0 
                    ? "Classes for this subject haven't been marked as started by the teacher yet."
                    : "The class is currently maintaining a good pace according to the syllabus schedule."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Col: Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary-500" />
                  Chapter Timeline
                </h3>
                {userRole === 'teacher' && (
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                    Update Progress
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {roadmapData.chapters.map((chapter: any, index: number) => (
                  <div 
                    key={chapter.chapterId} 
                    className={cn(
                      "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md",
                      getStatusColor(chapter.status)
                    )}
                  >
                    <div className="shrink-0 transition-transform group-hover:scale-110">
                      {getStatusIcon(chapter.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className="font-semibold text-text-primary truncate">
                          {index + 1}. {chapter.chapterName}
                        </h4>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-surface uppercase tracking-wider shrink-0">
                          {chapter.term || 'Term 1'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm font-medium opacity-80">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> 
                          {chapter.expectedDays} Expected Days
                        </span>
                        <span>•</span>
                        <span>Status: {chapter.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

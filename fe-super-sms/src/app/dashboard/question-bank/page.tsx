'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge, Button, Modal, Input, Select } from '@/components/ui';
import { useAuth } from '@/hooks';
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkUploadQuestionsMutation,
  useGetQuestionPapersQuery,
  useCreateQuestionPaperMutation,
  useDeleteQuestionPaperMutation,
} from '@/store/slices/apiSlice';
import { CLASSES, SUBJECTS, DIFFICULTIES, QUESTION_TYPES, QUESTION_CATEGORIES, EXAM_TYPES } from '@/constants';
import type { Question, QuestionPaper, QuestionOption, QuestionFilters } from '@/types';
import {
  Search, Filter, Plus, Upload, FileText, Trash2, Edit, Eye, CheckSquare, Square,
  BookOpen, ChevronDown, Download, AlertCircle, CheckCircle, X, Database, Layers
} from 'lucide-react';

// ── Colour helpers ─────────────────────────────────────────────────────────
const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};
const typeColor: Record<string, string> = {
  mcq: 'bg-indigo-100 text-indigo-700',
  paragraph: 'bg-purple-100 text-purple-700',
};
const categoryColor: Record<string, string> = {
  optional: 'bg-sky-100 text-sky-700',
  theoretical: 'bg-orange-100 text-orange-700',
  practical: 'bg-pink-100 text-pink-700',
};

// ── Helpers ────────────────────────────────────────────────────────────────
const getId = (item: any) => item?._id || item?.id || '';

const emptyForm = () => ({
  class: '', subject: '', chapter: '', topic: '',
  questionType: 'mcq' as 'mcq' | 'paragraph',
  questionText: '', marks: '1',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  category: 'theoretical' as 'optional' | 'theoretical' | 'practical',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ] as QuestionOption[],
  modelAnswer: '', tags: '',
});

// ─────────────────────────────────────────────────────────────────────────────
export default function QuestionBankPage() {
  const router = useRouter();
  const { user } = useAuth();
  const canBulkUpload = ['super-admin', 'school-admin', 'principal'].includes(user?.role ?? '');
  const canManage = ['super-admin', 'school-admin', 'principal', 'teacher'].includes(user?.role ?? '');

  // ── Tabs ──
  const [activeTab, setActiveTab] = useState<'bank' | 'papers'>('bank');

  // ── Filters ──
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const queryParams: Record<string, string> = {};
  if (filters.class) queryParams.class = filters.class;
  if (filters.subject) queryParams.subject = filters.subject;
  if (filters.chapter) queryParams.chapter = filters.chapter;
  if (filters.topic) queryParams.topic = filters.topic;
  if (filters.questionType) queryParams.questionType = filters.questionType;
  if (filters.category) queryParams.category = filters.category;
  if (filters.difficulty) queryParams.difficulty = filters.difficulty;
  if (search.trim()) queryParams.search = search.trim();

  const { data: questionsRes, isLoading: qLoading, refetch: refetchQ } = useGetQuestionsQuery(queryParams);
  const { data: papersRes, isLoading: pLoading } = useGetQuestionPapersQuery({});
  const questions: Question[] = (questionsRes as any)?.data || [];
  const papers: QuestionPaper[] = (papersRes as any)?.data || [];

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [bulkUpload] = useBulkUploadQuestionsMutation();
  const [createPaper] = useCreateQuestionPaperMutation();
  const [deletePaper] = useDeleteQuestionPaperMutation();

  // ── Selection (checkbox) ──
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAll = () => {
    if (selected.size === questions.length) setSelected(new Set());
    else setSelected(new Set(questions.map(getId)));
  };

  // ── Question Form Modal ──
  const [showQModal, setShowQModal] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [qForm, setQForm] = useState(emptyForm());
  const [qSaving, setQSaving] = useState(false);
  const [qError, setQError] = useState('');

  const openAddQ = () => { setEditQ(null); setQForm(emptyForm()); setQError(''); setShowQModal(true); };
  const openEditQ = (q: Question) => {
    setEditQ(q);
    setQForm({
      class: q.class, subject: q.subject, chapter: q.chapter || '',
      topic: q.topic || '', questionType: q.questionType,
      questionText: q.questionText, marks: String(q.marks),
      difficulty: q.difficulty, category: q.category,
      options: q.options?.length ? q.options.map(o => ({ ...o })) : emptyForm().options,
      modelAnswer: q.modelAnswer || '',
      tags: q.tags?.join(', ') || '',
    });
    setQError(''); setShowQModal(true);
  };

  const handleSaveQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setQSaving(true); setQError('');
    try {
      const payload: any = {
        ...qForm,
        marks: parseFloat(qForm.marks) || 1,
        tags: qForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        options: qForm.questionType === 'mcq' ? qForm.options.filter(o => o.text.trim()) : [],
      };
      if (editQ) {
        await updateQuestion({ id: getId(editQ), body: payload }).unwrap();
      } else {
        await createQuestion(payload).unwrap();
      }
      setShowQModal(false);
    } catch (err: any) {
      setQError(err?.data?.message || 'Failed to save question. Please try again.');
    } finally { setQSaving(false); }
  };

  const handleDeleteQ = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try { await deleteQuestion(id).unwrap(); } catch { alert('Failed to delete'); }
  };

  // ── MCQ Option helpers ──
  const setOptionText = (idx: number, text: string) => {
    setQForm(f => ({ ...f, options: f.options.map((o, i) => i === idx ? { ...o, text } : o) }));
  };
  const setOptionCorrect = (idx: number) => {
    setQForm(f => ({ ...f, options: f.options.map((o, i) => ({ ...o, isCorrect: i === idx })) }));
  };
  const addOption = () => {
    if (qForm.options.length >= 6) return;
    setQForm(f => ({ ...f, options: [...f.options, { text: '', isCorrect: false }] }));
  };
  const removeOption = (idx: number) => {
    if (qForm.options.length <= 2) return;
    setQForm(f => ({ ...f, options: f.options.filter((_, i) => i !== idx) }));
  };

  // ── Bulk Upload Modal ──
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkLoading(true); setBulkResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const res = await bulkUpload({ fileBase64: base64 }).unwrap();
        setBulkResult(res.data);
        setBulkLoading(false);
      };
      reader.readAsDataURL(bulkFile);
    } catch (err: any) {
      setBulkResult({ error: err?.data?.message || 'Upload failed' });
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'class,subject,chapter,topic,questionType,questionText,marks,difficulty,category,optionA,optionB,optionC,optionD,correctOption,modelAnswer,tags',
      '10,Mathematics,Algebra,Quadratic Equations,mcq,"What is the discriminant of ax² + bx + c?",1,medium,theoretical,b²-4ac,b²+4ac,4ac-b²,b+4ac,A,,algebra',
      '9,Science,Physics,Motion,paragraph,"Explain Newton\'s first law of motion.",5,easy,theoretical,,,,,,An object at rest stays at rest...,newton laws',
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'question_bank_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Preview Modal ──
  const [previewQ, setPreviewQ] = useState<Question | null>(null);

  // ── Create Paper Modal ──
  const [showCreatePaperModal, setShowCreatePaperModal] = useState(false);
  const [paperForm, setPaperForm] = useState({ title: '', class: '', subject: '', examType: 'unit-test', duration: '60', instructions: 'Answer all questions. All questions carry equal marks.' });
  const [paperSaving, setPaperSaving] = useState(false);

  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaperSaving(true);
    try {
      const selectedIds = Array.from(selected);
      const paper = await createPaper({
        ...paperForm,
        duration: parseInt(paperForm.duration) || 60,
        questionIds: selectedIds,
      }).unwrap();
      setShowCreatePaperModal(false);
      setSelected(new Set());
      router.push(`/dashboard/question-bank/${getId(paper)}`);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to create paper');
    } finally { setPaperSaving(false); }
  };

  const handleDeletePaper = async (id: string) => {
    if (!confirm('Delete this question paper?')) return;
    try { await deletePaper(id).unwrap(); } catch { alert('Failed to delete paper'); }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Database className="w-7 h-7 text-primary-600" />
            Question Bank
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Store, organise, and reuse questions for building exam papers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canBulkUpload && (
            <Button variant="outline" icon={Upload} onClick={() => setShowBulkModal(true)}>
              Bulk Upload
            </Button>
          )}
          {canManage && (
            <Button icon={Plus} onClick={openAddQ}>
              Add Question
            </Button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-surface-secondary rounded-lg w-fit">
        {([['bank', `Question Bank (${questions.length})`, BookOpen], ['papers', `Papers (${papers.length})`, Layers]] as const).map(([tab, label, Icon]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB 1: Question Bank
      ══════════════════════════════════════════════════ */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          {/* ── Search + Filter bar ── */}
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search questions…"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface"
                  />
                </div>
                <button
                  onClick={() => setFiltersOpen(f => !f)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors cursor-pointer ${
                    filtersOpen || activeFiltersCount > 0
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-border text-text-secondary hover:border-primary-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>
                {activeFiltersCount > 0 && (
                  <button onClick={() => setFilters({})} className="px-3 py-2 text-sm text-danger-500 hover:text-danger-700 transition-colors cursor-pointer">
                    Clear
                  </button>
                )}
              </div>

              {/* ── Expanded Filters ── */}
              {filtersOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-border">
                  {[
                    { label: 'Class', key: 'class', options: CLASSES.map(c => ({ value: c, label: `Class ${c}` })) },
                    { label: 'Subject', key: 'subject', options: SUBJECTS.map(s => ({ value: s, label: s })) },
                    { label: 'Type', key: 'questionType', options: QUESTION_TYPES },
                    { label: 'Category', key: 'category', options: QUESTION_CATEGORIES },
                    { label: 'Difficulty', key: 'difficulty', options: DIFFICULTIES },
                  ].map(({ label, key, options }) => (
                    <div key={key}>
                      <label className="text-xs text-text-tertiary mb-1 block">{label}</label>
                      <select
                        value={(filters as any)[key] || ''}
                        onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full text-xs border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                      >
                        <option value="">All</option>
                        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-text-tertiary mb-1 block">Chapter</label>
                    <input
                      value={filters.chapter || ''}
                      onChange={e => setFilters(f => ({ ...f, chapter: e.target.value }))}
                      placeholder="Any chapter"
                      className="w-full text-xs border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-tertiary mb-1 block">Topic</label>
                    <input
                      value={filters.topic || ''}
                      onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}
                      placeholder="Any topic"
                      className="w-full text-xs border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* ── Selection Actions ── */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <CheckSquare className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">{selected.size} question{selected.size > 1 ? 's' : ''} selected</span>
              <Button size="sm" icon={FileText} onClick={() => setShowCreatePaperModal(true)}>
                Create Question Paper
              </Button>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-text-tertiary hover:text-text-primary cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Questions Table ── */}
          <Card className="overflow-hidden">
            {qLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-text-tertiary">
                <Database className="w-12 h-12 opacity-30" />
                <p className="text-sm font-medium">No questions found</p>
                <p className="text-xs">Try adjusting filters or add your first question</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary">
                      <th className="p-3 w-10">
                        <button onClick={toggleAll} className="cursor-pointer text-text-tertiary hover:text-primary-600">
                          {selected.size === questions.length && questions.length > 0
                            ? <CheckSquare className="w-4 h-4 text-primary-600" />
                            : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="p-3 text-left font-semibold text-text-secondary">Question</th>
                      <th className="p-3 text-left font-semibold text-text-secondary w-20">Class</th>
                      <th className="p-3 text-left font-semibold text-text-secondary w-28">Subject</th>
                      <th className="p-3 text-left font-semibold text-text-secondary w-24">Chapter</th>
                      <th className="p-3 text-center font-semibold text-text-secondary w-16">Marks</th>
                      <th className="p-3 text-center font-semibold text-text-secondary w-20">Type</th>
                      <th className="p-3 text-center font-semibold text-text-secondary w-20">Level</th>
                      <th className="p-3 text-center font-semibold text-text-secondary w-24">Category</th>
                      <th className="p-3 text-center font-semibold text-text-secondary w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => {
                      const id = getId(q);
                      const isSelected = selected.has(id);
                      return (
                        <tr key={id} className={`border-b border-border-light transition-colors ${isSelected ? 'bg-primary-50' : 'hover:bg-surface-secondary'}`}>
                          <td className="p-3">
                            <button onClick={() => toggleSelect(id)} className="cursor-pointer text-text-tertiary hover:text-primary-600">
                              {isSelected ? <CheckSquare className="w-4 h-4 text-primary-600" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="text-text-primary font-medium line-clamp-2 leading-snug">
                              <span className="text-text-tertiary text-xs mr-1">{i + 1}.</span>
                              {q.questionText}
                            </p>
                            {q.topic && <p className="text-xs text-text-tertiary mt-0.5">Topic: {q.topic}</p>}
                          </td>
                          <td className="p-3 text-text-secondary">Class {q.class}</td>
                          <td className="p-3 text-text-secondary">{q.subject}</td>
                          <td className="p-3 text-text-tertiary text-xs">{q.chapter || '—'}</td>
                          <td className="p-3 text-center font-semibold text-text-primary">{q.marks}</td>
                          <td className="p-3 text-center">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[q.questionType]}`}>{q.questionType.toUpperCase()}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${difficultyColor[q.difficulty]}`}>{q.difficulty}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColor[q.category]}`}>{q.category}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setPreviewQ(q)} className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-tertiary hover:text-primary-600 transition-colors cursor-pointer" title="Preview">
                                <Eye className="w-4 h-4" />
                              </button>
                              {canManage && <>
                                <button onClick={() => openEditQ(q)} className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-tertiary hover:text-primary-600 transition-colors cursor-pointer" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteQ(id)} className="p-1.5 rounded-md hover:bg-danger-50 text-text-tertiary hover:text-danger-600 transition-colors cursor-pointer" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 2: Question Papers
      ══════════════════════════════════════════════════ */}
      {activeTab === 'papers' && (
        <div className="space-y-3">
          {pLoading ? (
            <Card className="flex items-center justify-center h-48">
              <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
            </Card>
          ) : papers.length === 0 ? (
            <Card className="flex flex-col items-center justify-center h-48 gap-3 text-text-tertiary">
              <Layers className="w-12 h-12 opacity-30" />
              <p className="text-sm font-medium">No question papers yet</p>
              <p className="text-xs">Select questions from the bank and create a paper</p>
            </Card>
          ) : (
            papers.map(paper => {
              const pid = getId(paper);
              const totalQs = paper.sections?.reduce((s, sec) => s + (sec.questions?.length ?? 0), 0) ?? 0;
              return (
                <Card key={pid} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary truncate">{paper.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          paper.status === 'finalized' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {paper.status === 'finalized' ? '✓ Finalized' : '✎ Draft'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                        <span>Class {paper.class}</span>
                        <span>{paper.subject}</span>
                        <span>{paper.examType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span>{totalQs} questions</span>
                        <span>{paper.totalMarks} marks</span>
                        <span>{paper.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" icon={Edit}
                        onClick={() => router.push(`/dashboard/question-bank/${pid}`)}>
                        Open Editor
                      </Button>
                      <button onClick={() => handleDeletePaper(pid)} className="p-2 rounded-lg hover:bg-danger-50 text-text-tertiary hover:text-danger-600 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════ */}

      {/* ── Add / Edit Question Modal ── */}
      <Modal isOpen={showQModal} onClose={() => setShowQModal(false)} title={editQ ? 'Edit Question' : 'Add Question'} size="lg">
        <form onSubmit={handleSaveQ} className="space-y-4">
          {qError && (
            <div className="flex items-start gap-2 p-3 bg-danger-50 text-danger-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{qError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Class *</label>
              <select required value={qForm.class} onChange={e => setQForm(f => ({ ...f, class: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                <option value="">Select class</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Subject *</label>
              <select required value={qForm.subject} onChange={e => setQForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Chapter</label>
              <input value={qForm.chapter} onChange={e => setQForm(f => ({ ...f, chapter: e.target.value }))}
                placeholder="e.g. Algebra" className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Topic</label>
              <input value={qForm.topic} onChange={e => setQForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="e.g. Quadratic equations" className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Question Type *</label>
              <select required value={qForm.questionType}
                onChange={e => setQForm(f => ({ ...f, questionType: e.target.value as any }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Marks *</label>
              <input required type="number" step="0.5" min="0.5" value={qForm.marks}
                onChange={e => setQForm(f => ({ ...f, marks: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Difficulty</label>
              <select value={qForm.difficulty} onChange={e => setQForm(f => ({ ...f, difficulty: e.target.value as any }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Category</label>
              <select value={qForm.category} onChange={e => setQForm(f => ({ ...f, category: e.target.value as any }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                {QUESTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Question Text *</label>
            <textarea required rows={3} value={qForm.questionText}
              onChange={e => setQForm(f => ({ ...f, questionText: e.target.value }))}
              placeholder="Enter the full question here…"
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface resize-none" />
          </div>

          {/* MCQ Options */}
          {qForm.questionType === 'mcq' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary">Answer Options *</label>
                <button type="button" onClick={addOption} className="text-xs text-primary-600 hover:underline cursor-pointer">+ Add option</button>
              </div>
              {qForm.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button type="button" onClick={() => setOptionCorrect(idx)}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 cursor-pointer transition-colors ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'border-border hover:border-primary-400'}`}
                    title="Mark as correct" />
                  <input value={opt.text} onChange={e => setOptionText(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className={`flex-1 text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${opt.isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-border bg-surface'}`} />
                  {qForm.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} className="text-text-tertiary hover:text-danger-500 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-text-tertiary">● = correct answer</p>
            </div>
          )}

          {/* Paragraph model answer */}
          {qForm.questionType === 'paragraph' && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Model Answer</label>
              <textarea rows={4} value={qForm.modelAnswer}
                onChange={e => setQForm(f => ({ ...f, modelAnswer: e.target.value }))}
                placeholder="Expected answer / marking scheme…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface resize-none" />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
            <input value={qForm.tags} onChange={e => setQForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. algebra, quadratic, important"
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowQModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={qSaving}>{editQ ? 'Update Question' : 'Save Question'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── Bulk Upload Modal ── */}
      <Modal isOpen={showBulkModal} onClose={() => { setShowBulkModal(false); setBulkFile(null); setBulkResult(null); }} title="Bulk Upload Questions" size="md">
        <div className="space-y-5">
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-sm font-medium text-primary-800 mb-2">📋 Upload Format</p>
            <p className="text-xs text-primary-700 mb-3">
              Upload an Excel (.xlsx) or CSV (.csv) file. Required columns: <code className="bg-white px-1 rounded">class, subject, questionType, questionText, marks</code>.
              For MCQ include <code className="bg-white px-1 rounded">optionA…optionD, correctOption (A/B/C/D)</code>.
            </p>
            <button onClick={downloadTemplate} className="flex items-center gap-2 text-xs text-primary-700 hover:text-primary-900 font-medium cursor-pointer underline">
              <Download className="w-3 h-3" /> Download Template CSV
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
          >
            <Upload className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
            {bulkFile ? (
              <p className="text-sm font-medium text-primary-700">{bulkFile.name} <span className="text-text-tertiary">({(bulkFile.size / 1024).toFixed(1)} KB)</span></p>
            ) : (
              <>
                <p className="text-sm text-text-secondary">Click to select file</p>
                <p className="text-xs text-text-tertiary mt-1">Excel (.xlsx) or CSV (.csv) · Max 500 questions</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
              onChange={e => { setBulkFile(e.target.files?.[0] || null); setBulkResult(null); }} />
          </div>

          {bulkResult && (
            <div className={`p-4 rounded-lg border ${bulkResult.error ? 'bg-danger-50 border-danger-200' : 'bg-emerald-50 border-emerald-200'}`}>
              {bulkResult.error ? (
                <div className="flex items-center gap-2 text-danger-700"><AlertCircle className="w-4 h-4" /><span className="text-sm">{bulkResult.error}</span></div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium"><CheckCircle className="w-4 h-4" /><span className="text-sm">Upload Complete</span></div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-emerald-700">✓ Created: <strong>{bulkResult.created}</strong></span>
                    <span className="text-amber-700">⊘ Skipped: <strong>{bulkResult.skipped}</strong></span>
                  </div>
                  {bulkResult.errors?.length > 0 && (
                    <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                      {bulkResult.errors.map((err: string, i: number) => (
                        <p key={i} className="text-xs text-danger-600">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowBulkModal(false); setBulkFile(null); setBulkResult(null); }}>Close</Button>
            <Button onClick={handleBulkUpload} isLoading={bulkLoading} disabled={!bulkFile} icon={Upload}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Question Preview Modal ── */}
      <Modal isOpen={!!previewQ} onClose={() => setPreviewQ(null)} title="Question Preview" size="md">
        {previewQ && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[previewQ.questionType]}`}>{previewQ.questionType.toUpperCase()}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[previewQ.difficulty]}`}>{previewQ.difficulty}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[previewQ.category]}`}>{previewQ.category}</span>
              <span className="text-xs text-text-tertiary">Class {previewQ.class} · {previewQ.subject}</span>
              {previewQ.chapter && <span className="text-xs text-text-tertiary">· {previewQ.chapter}</span>}
            </div>
            <div className="p-4 bg-surface-secondary rounded-lg">
              <p className="font-semibold text-text-primary text-base leading-relaxed">{previewQ.questionText}</p>
            </div>
            {previewQ.questionType === 'mcq' && previewQ.options?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Options</p>
                {previewQ.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg border ${opt.isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-border'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-surface-tertiary text-text-secondary'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-sm ${opt.isCorrect ? 'text-emerald-800 font-medium' : 'text-text-primary'}`}>{opt.text}</span>
                    {opt.isCorrect && <span className="ml-auto text-xs text-emerald-600 font-medium">✓ Correct</span>}
                  </div>
                ))}
              </div>
            )}
            {previewQ.questionType === 'paragraph' && previewQ.modelAnswer && (
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Model Answer</p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 whitespace-pre-wrap">{previewQ.modelAnswer}</div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-text-tertiary pt-2 border-t border-border">
              <span>Marks: <strong className="text-text-primary">{previewQ.marks}</strong></span>
              <span>Used in <strong className="text-text-primary">{previewQ.usageCount}</strong> paper{previewQ.usageCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Create Question Paper Modal ── */}
      <Modal isOpen={showCreatePaperModal} onClose={() => setShowCreatePaperModal(false)} title={`Create Question Paper (${selected.size} questions)`} size="md">
        <form onSubmit={handleCreatePaper} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Paper Title *</label>
            <input required value={paperForm.title} onChange={e => setPaperForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Mathematics Mid-Term 2024 — Class 10"
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Class *</label>
              <select required value={paperForm.class} onChange={e => setPaperForm(f => ({ ...f, class: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                <option value="">Select class</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Subject *</label>
              <select required value={paperForm.subject} onChange={e => setPaperForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Exam Type</label>
              <select value={paperForm.examType} onChange={e => setPaperForm(f => ({ ...f, examType: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface">
                {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Duration (minutes)</label>
              <input type="number" min="10" value={paperForm.duration} onChange={e => setPaperForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Instructions</label>
            <textarea rows={2} value={paperForm.instructions} onChange={e => setPaperForm(f => ({ ...f, instructions: e.target.value }))}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowCreatePaperModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={paperSaving} icon={FileText}>Create Paper & Open Editor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

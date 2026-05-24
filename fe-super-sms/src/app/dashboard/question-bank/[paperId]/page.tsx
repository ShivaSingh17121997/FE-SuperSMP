'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetQuestionPaperByIdQuery, useUpdateQuestionPaperMutation } from '@/store/slices/apiSlice';
import { EXAM_TYPES, QUESTION_TYPES } from '@/constants';
import type { PaperSection, PaperQuestion, QuestionOption } from '@/types';
import {
  ArrowLeft, Save, Download, CheckCircle, Plus, Trash2, GripVertical,
  Edit2, FileText, BookOpen, Clock, Award, ChevronDown, ChevronUp,
  AlertCircle, Printer, FileDown, Eye
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────
const getId = (item: any): string => item?._id || item?.id || String(Math.random());

// ── Word Export ──────────────────────────────────────────────────────────────
async function exportToWord(paper: any) {
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, AlignmentType, WidthType } = await import('docx');

    const children: any[] = [
      new Paragraph({
        text: paper.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Class: ${paper.class}  |  Subject: ${paper.subject}  |  Total Marks: ${paper.totalMarks}  |  Duration: ${paper.duration} min`, bold: false, size: 20 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({ text: paper.instructions, italics: true, spacing: { after: 300 } } as any),
    ];

    let qNum = 1;
    for (const section of (paper.sections || [])) {
      children.push(new Paragraph({ text: section.name, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }));
      if (section.instructions) {
        children.push(new Paragraph({ text: section.instructions, italics: true, spacing: { after: 150 } } as any));
      }
      for (const q of section.questions) {
        children.push(new Paragraph({
          children: [new TextRun({ text: `Q${qNum}. ${q.questionText}`, bold: true })],
          spacing: { before: 200, after: 100 },
        }));
        if (q.questionType === 'mcq' && q.options?.length) {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
          q.options.forEach((opt: any, idx: number) => {
            children.push(new Paragraph({ text: `     (${letters[idx]}) ${opt.text}`, spacing: { after: 60 } }));
          });
        }
        children.push(new Paragraph({ children: [new TextRun({ text: `[${q.marks} mark${q.marks !== 1 ? 's' : ''}]`, color: '888888', size: 18 })], spacing: { after: 80 } }));
        qNum++;
      }
    }

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${paper.title.replace(/\s+/g, '_')}.docx`; a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Word export failed:', err);
    alert('Word export failed. Please try again.');
  }
}

// ── PDF Export ─────────────────────────────────────────────────────────────
async function exportToPDF(paper: any) {
  try {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW = 210; const margin = 15; const contentW = pageW - 2 * margin;
    let y = margin;

    const checkPage = (needed = 10) => {
      if (y + needed > 280) { doc.addPage(); y = margin; }
    };

    // Header
    doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.text(paper.title, pageW / 2, y, { align: 'center' }); y += 8;

    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Class: ${paper.class}  |  Subject: ${paper.subject}  |  Marks: ${paper.totalMarks}  |  Duration: ${paper.duration} min`, pageW / 2, y, { align: 'center' }); y += 7;

    doc.setFontSize(9); doc.setFont('helvetica', 'italic');
    const instrLines = doc.splitTextToSize(paper.instructions || '', contentW);
    doc.text(instrLines, margin, y); y += instrLines.length * 5 + 5;

    doc.setDrawColor(180); doc.line(margin, y, pageW - margin, y); y += 5;

    let qNum = 1;
    for (const section of (paper.sections || [])) {
      checkPage(12);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text(section.name, margin, y); y += 7;
      if (section.instructions) {
        doc.setFontSize(9); doc.setFont('helvetica', 'italic');
        doc.text(section.instructions, margin, y); y += 6;
      }

      for (const q of section.questions) {
        const qText = `Q${qNum}. ${q.questionText}`;
        const lines = doc.splitTextToSize(qText, contentW);
        checkPage(lines.length * 5 + 20);
        doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(lines, margin, y); y += lines.length * 5 + 2;

        if (q.questionType === 'mcq' && q.options?.length) {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
          q.options.forEach((opt: any, idx: number) => {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
            const optLines = doc.splitTextToSize(`   (${letters[idx]}) ${opt.text}`, contentW - 5);
            doc.text(optLines, margin + 5, y); y += optLines.length * 4 + 1;
          });
        }
        doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(150);
        doc.text(`[${q.marks} mark${q.marks !== 1 ? 's' : ''}]`, pageW - margin, y, { align: 'right' });
        doc.setTextColor(0); y += 6;
        qNum++;
      }
      y += 4;
    }

    doc.save(`${paper.title.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF export failed. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function QuestionPaperEditorPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params?.paperId as string;

  const { data: paper, isLoading } = useGetQuestionPaperByIdQuery(paperId, { skip: !paperId });
  const [updatePaper] = useUpdateQuestionPaperMutation();

  // Local editable state
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [duration, setDuration] = useState(60);
  const [examType, setExamType] = useState('unit-test');
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [status, setStatus] = useState<'draft' | 'finalized'>('draft');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Which section is collapsed
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  // Inline edit state
  const [editingQKey, setEditingQKey] = useState<string | null>(null);

  useEffect(() => {
    if (paper) {
      setTitle(paper.title);
      setInstructions(paper.instructions);
      setDuration(paper.duration);
      setExamType(paper.examType);
      setSections(JSON.parse(JSON.stringify(paper.sections))); // deep clone
      setStatus(paper.status);
    }
  }, [paper]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  // ── Computed totals ──
  const totalMarks = sections.reduce((sum, sec) => sum + sec.questions.reduce((s, q) => s + (q.marks || 0), 0), 0);
  const totalQuestions = sections.reduce((sum, sec) => sum + sec.questions.length, 0);

  // ── Save ──
  const handleSave = async (newStatus?: 'draft' | 'finalized') => {
    setSaving(true); setSaveMsg('');
    try {
      await updatePaper({
        id: paperId,
        body: { title, instructions, duration, examType, sections, totalMarks, status: newStatus || status },
      }).unwrap();
      setStatus(newStatus || status);
      setIsDirty(false);
      setSaveMsg(newStatus === 'finalized' ? 'Paper finalized!' : 'Saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      setSaveMsg('Save failed: ' + (err?.data?.message || 'Unknown error'));
    } finally { setSaving(false); }
  };

  // ── Section operations ──
  const addSection = () => {
    const newSec: PaperSection = { name: `Section ${String.fromCharCode(65 + sections.length)}`, instructions: '', questions: [] };
    setSections(s => [...s, newSec]); markDirty();
  };

  const updateSection = (idx: number, field: keyof PaperSection, value: any) => {
    setSections(s => s.map((sec, i) => i === idx ? { ...sec, [field]: value } : sec)); markDirty();
  };

  const deleteSection = (idx: number) => {
    if (!confirm('Delete this section and all its questions?')) return;
    setSections(s => s.filter((_, i) => i !== idx)); markDirty();
  };

  // ── Question operations ──
  const addManualQuestion = (sectionIdx: number) => {
    const newQ: PaperQuestion = {
      questionRef: null, questionText: 'New question…', questionType: 'paragraph',
      marks: 1, options: [], modelAnswer: '', order: 0,
    };
    setSections(s => s.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      return { ...sec, questions: [...sec.questions, newQ] };
    })); markDirty();
  };

  const updateQuestion = (sectionIdx: number, qIdx: number, updates: Partial<PaperQuestion>) => {
    setSections(s => s.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      return { ...sec, questions: sec.questions.map((q, j) => j === qIdx ? { ...q, ...updates } : q) };
    })); markDirty();
  };

  const deleteQuestion = (sectionIdx: number, qIdx: number) => {
    setSections(s => s.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      return { ...sec, questions: sec.questions.filter((_, j) => j !== qIdx) };
    })); markDirty();
  };

  const moveQuestion = (sectionIdx: number, qIdx: number, dir: -1 | 1) => {
    setSections(s => s.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      const qs = [...sec.questions];
      const target = qIdx + dir;
      if (target < 0 || target >= qs.length) return sec;
      [qs[qIdx], qs[target]] = [qs[target], qs[qIdx]];
      return { ...sec, questions: qs };
    })); markDirty();
  };

  // ── Loading ──
  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full" />
    </div>
  );

  if (!paper) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="w-12 h-12 text-danger-400" />
      <p className="text-text-secondary">Question paper not found.</p>
      <button onClick={() => router.back()} className="text-primary-600 hover:underline text-sm cursor-pointer">Go back</button>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/dashboard/question-bank')} className="p-1.5 hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            {previewMode ? (
              <h1 className="text-lg font-bold text-text-primary truncate">{title}</h1>
            ) : (
              <input
                value={title}
                onChange={e => { setTitle(e.target.value); markDirty(); }}
                className="text-lg font-bold text-text-primary bg-transparent border-b-2 border-transparent hover:border-border focus:border-primary-500 focus:outline-none transition-colors min-w-0 flex-1 truncate"
              />
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
              status === 'finalized' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {status === 'finalized' ? '✓ Finalized' : '✎ Draft'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {saveMsg && (
              <span className={`text-xs font-medium ${saveMsg.includes('fail') ? 'text-danger-600' : 'text-emerald-600'}`}>{saveMsg}</span>
            )}
            <button
              onClick={() => setPreviewMode(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                previewMode ? 'bg-surface-secondary border-border text-text-secondary' : 'border-border hover:border-primary-400 text-text-secondary'
              }`}
            >
              <Eye className="w-4 h-4" /> {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => exportToPDF({ title, instructions, duration, examType, sections, totalMarks, class: paper.class, subject: paper.subject })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:border-red-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={() => exportToWord({ title, instructions, duration, examType, sections, totalMarks, class: paper.class, subject: paper.subject })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Word
            </button>
            {status !== 'finalized' && (
              <button
                onClick={() => handleSave('finalized')}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Finalize
              </button>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving || !isDirty}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="flex items-center gap-6 px-4 py-2 bg-surface-secondary text-xs text-text-secondary border-t border-border-light">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalQuestions} Questions</span>
          <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {totalMarks} Marks</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
            {previewMode ? `${duration} min` : (
              <input type="number" value={duration} min={10}
                onChange={e => { setDuration(parseInt(e.target.value) || 60); markDirty(); }}
                className="w-14 border-b border-border bg-transparent focus:outline-none focus:border-primary-500 text-xs" />
            )}
            {' '}min
          </span>
          <span className="flex items-center gap-1">
            {previewMode ? examType.replace('-', ' ') : (
              <select value={examType} onChange={e => { setExamType(e.target.value); markDirty(); }}
                className="border-b border-border bg-transparent focus:outline-none focus:border-primary-500 text-xs cursor-pointer">
                {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            )}
          </span>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* ── Instructions ── */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-semibold text-amber-800 mb-1">General Instructions</p>
          {previewMode ? (
            <p className="text-sm text-amber-900 italic">{instructions}</p>
          ) : (
            <textarea rows={2} value={instructions} onChange={e => { setInstructions(e.target.value); markDirty(); }}
              className="w-full text-sm text-amber-900 bg-transparent border-b border-amber-300 focus:outline-none focus:border-amber-500 resize-none" />
          )}
        </div>

        {/* ══ Sections ══ */}
        {sections.map((section, sIdx) => {
          const isCollapsed = collapsed.has(sIdx);
          const secMarks = section.questions.reduce((s, q) => s + (q.marks || 0), 0);
          return (
            <div key={sIdx} className="border border-border rounded-xl overflow-hidden shadow-sm">
              {/* Section header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-secondary">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button onClick={() => setCollapsed(c => { const n = new Set(c); n.has(sIdx) ? n.delete(sIdx) : n.add(sIdx); return n; })}
                    className="text-text-tertiary hover:text-primary-600 cursor-pointer">
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  {previewMode ? (
                    <h2 className="font-bold text-text-primary">{section.name}</h2>
                  ) : (
                    <input value={section.name} onChange={e => updateSection(sIdx, 'name', e.target.value)}
                      className="font-bold text-text-primary bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none" />
                  )}
                  <span className="text-xs text-text-tertiary shrink-0">{section.questions.length} Q · {secMarks} marks</span>
                </div>
                {!previewMode && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => addManualQuestion(sIdx)}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                    <button onClick={() => deleteSection(sIdx)}
                      className="p-1 text-text-tertiary hover:text-danger-500 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="divide-y divide-border-light">
                  {/* Section instructions */}
                  {!previewMode && (
                    <div className="px-4 py-2 bg-surface">
                      <input value={section.instructions} onChange={e => updateSection(sIdx, 'instructions', e.target.value)}
                        placeholder="Section instructions (optional)…"
                        className="w-full text-xs text-text-secondary bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none italic" />
                    </div>
                  )}
                  {section.instructions && previewMode && (
                    <div className="px-4 py-2 text-xs text-text-secondary italic bg-surface">{section.instructions}</div>
                  )}

                  {/* Questions */}
                  {section.questions.length === 0 && (
                    <div className="px-4 py-8 text-center text-text-tertiary text-sm">
                      {previewMode ? 'No questions' : (
                        <button onClick={() => addManualQuestion(sIdx)} className="text-primary-600 hover:underline cursor-pointer">
                          + Add your first question
                        </button>
                      )}
                    </div>
                  )}

                  {section.questions.map((q, qIdx) => {
                    const qKey = `${sIdx}-${qIdx}`;
                    const isEditingThis = editingQKey === qKey;
                    const globalNum = sections.slice(0, sIdx).reduce((s, sec) => s + sec.questions.length, 0) + qIdx + 1;

                    return (
                      <div key={qIdx} className={`p-4 group ${isEditingThis ? 'bg-primary-50' : 'hover:bg-surface-secondary'} transition-colors`}>
                        <div className="flex items-start gap-3">
                          {!previewMode && (
                            <div className="flex flex-col gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveQuestion(sIdx, qIdx, -1)} disabled={qIdx === 0} className="text-text-tertiary hover:text-primary-600 disabled:opacity-30 cursor-pointer">
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => moveQuestion(sIdx, qIdx, 1)} disabled={qIdx === section.questions.length - 1} className="text-text-tertiary hover:text-primary-600 disabled:opacity-30 cursor-pointer">
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold shrink-0">{globalNum}</span>

                          <div className="flex-1 min-w-0">
                            {isEditingThis ? (
                              /* ── Inline Edit ── */
                              <div className="space-y-3">
                                <textarea rows={2} value={q.questionText}
                                  onChange={e => updateQuestion(sIdx, qIdx, { questionText: e.target.value })}
                                  className="w-full text-sm border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                                <div className="flex gap-3">
                                  <div>
                                    <label className="text-xs text-text-tertiary">Type</label>
                                    <select value={q.questionType} onChange={e => updateQuestion(sIdx, qIdx, { questionType: e.target.value as any })}
                                      className="block text-xs border border-border rounded px-2 py-1 mt-0.5 focus:outline-none">
                                      {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-text-tertiary">Marks</label>
                                    <input type="number" step="0.5" min="0.5" value={q.marks}
                                      onChange={e => updateQuestion(sIdx, qIdx, { marks: parseFloat(e.target.value) || 1 })}
                                      className="block w-16 text-xs border border-border rounded px-2 py-1 mt-0.5 focus:outline-none" />
                                  </div>
                                </div>
                                {q.questionType === 'mcq' && (q.options || []).map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <button type="button" onClick={() => {
                                      const newOpts = q.options.map((o, i) => ({ ...o, isCorrect: i === oIdx }));
                                      updateQuestion(sIdx, qIdx, { options: newOpts });
                                    }} className={`w-4 h-4 rounded-full border-2 shrink-0 cursor-pointer ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`} />
                                    <input value={opt.text} onChange={e => {
                                      const newOpts = q.options.map((o, i) => i === oIdx ? { ...o, text: e.target.value } : o);
                                      updateQuestion(sIdx, qIdx, { options: newOpts });
                                    }} className="flex-1 text-xs border border-border rounded px-2 py-1 focus:outline-none" />
                                  </div>
                                ))}
                                {q.questionType === 'paragraph' && (
                                  <textarea rows={2} placeholder="Model answer…" value={q.modelAnswer || ''}
                                    onChange={e => updateQuestion(sIdx, qIdx, { modelAnswer: e.target.value })}
                                    className="w-full text-xs border border-border rounded-lg px-3 py-2 focus:outline-none resize-none text-text-secondary italic" />
                                )}
                                <button onClick={() => setEditingQKey(null)} className="text-xs text-primary-600 hover:underline cursor-pointer">Done editing</button>
                              </div>
                            ) : (
                              /* ── Display mode ── */
                              <div>
                                <p className="text-sm text-text-primary font-medium leading-relaxed">{q.questionText}</p>
                                {q.questionType === 'mcq' && q.options?.length > 0 && (
                                  <div className="mt-2 grid grid-cols-2 gap-1">
                                    {q.options.map((opt, oIdx) => (
                                      <div key={oIdx} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${previewMode && opt.isCorrect ? 'bg-emerald-50 text-emerald-800 font-medium' : 'text-text-secondary'}`}>
                                        <span className="font-bold text-text-tertiary">{String.fromCharCode(65 + oIdx)}.</span> {opt.text}
                                        {previewMode && opt.isCorrect && <span className="ml-auto text-emerald-600">✓</span>}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {previewMode && q.questionType === 'paragraph' && q.modelAnswer && (
                                  <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-800 italic">{q.modelAnswer}</div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <span className="text-xs font-semibold text-text-tertiary">[{q.marks}m]</span>
                            {!previewMode && (
                              <>
                                <button onClick={() => setEditingQKey(isEditingThis ? null : qKey)} className="p-1 text-text-tertiary hover:text-primary-600 cursor-pointer" title="Edit inline">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteQuestion(sIdx, qIdx)} className="p-1 text-text-tertiary hover:text-danger-500 cursor-pointer" title="Remove">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ── Add Section ── */}
        {!previewMode && (
          <button onClick={addSection}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-text-tertiary hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        )}

        {/* Bottom padding */}
        <div className="h-12" />
      </div>
    </div>
  );
}

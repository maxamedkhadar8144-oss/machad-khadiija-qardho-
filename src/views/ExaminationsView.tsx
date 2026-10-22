import React, { useState } from 'react';
import {
  Award,
  Plus,
  BookOpen,
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  Save,
  FileText,
  X,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Examination, ExamResult, Student } from '../types';

export const ExaminationsView: React.FC = () => {
  const {
    examinations,
    examResults,
    students,
    classes,
    subjects,
    addExamination,
    updateExamination,
    saveExamMarks,
    publishExam,
    hasPermission,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'exams' | 'marksEntry' | 'reportCards'>('exams');
  const [selectedExamId, setSelectedExamId] = useState<string>(examinations[0]?.id || 'exm-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(
    students[0] || null
  );

  // New Exam Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    name: '',
    academicYear: '2026–2027',
    term: 'Term 1' as Examination['term'],
    startDate: '2026-11-20',
    endDate: '2026-11-26',
    classId: classes[0]?.id || 'cls-1',
    status: 'scheduled' as Examination['status'],
  });

  const selectedExam = examinations.find(e => e.id === selectedExamId);
  const currentClassStudents = students.filter(s => s.classId === selectedExam?.classId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Marks Entry Local State
  const [marksState, setMarksState] = useState<{
    [studentId: string]: { marks: number; remarks: string; status: 'present' | 'absent' };
  }>(() => {
    const map: { [studentId: string]: { marks: number; remarks: string; status: 'present' | 'absent' } } = {};
    currentClassStudents.forEach(st => {
      const existing = examResults.find(
        r => r.examId === selectedExamId && r.subjectId === selectedSubjectId && r.studentId === st.id
      );
      map[st.id] = {
        marks: existing?.marksObtained || 0,
        remarks: existing?.remarks || '',
        status: existing?.status === 'absent' ? 'absent' : 'present',
      };
    });
    return map;
  });

  // Calculate grade based on percentage
  const calculateGrade = (marks: number, max: number): string => {
    const pct = (marks / max) * 100;
    if (pct >= 95) return 'A+';
    if (pct >= 90) return 'A';
    if (pct >= 85) return 'B+';
    if (pct >= 80) return 'B';
    if (pct >= 75) return 'C+';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  };

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    const map: { [studentId: string]: { marks: number; remarks: string; status: 'present' | 'absent' } } = {};
    currentClassStudents.forEach(st => {
      const existing = examResults.find(
        r => r.examId === selectedExamId && r.subjectId === subId && r.studentId === st.id
      );
      map[st.id] = {
        marks: existing?.marksObtained || 0,
        remarks: existing?.remarks || '',
        status: existing?.status === 'absent' ? 'absent' : 'present',
      };
    });
    setMarksState(map);
  };

  const handleSaveMarks = () => {
    if (!currentSubject) return;
    const max = currentSubject.maxMarks || 100;

    const resultsToSave: Omit<ExamResult, 'id'>[] = currentClassStudents.map(st => {
      const entry = marksState[st.id] || { marks: 0, remarks: '', status: 'present' };
      const grade = entry.status === 'absent' ? 'F' : calculateGrade(entry.marks, max);

      return {
        examId: selectedExamId,
        subjectId: selectedSubjectId,
        studentId: st.id,
        marksObtained: entry.status === 'absent' ? 0 : entry.marks,
        maxMarks: max,
        status: entry.status,
        grade,
        remarks: entry.remarks,
      };
    });

    saveExamMarks(resultsToSave);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.name.trim()) return;
    addExamination(examForm);
    setIsExamModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Imtixaanaadka & Natiijooyinka (Examinations & Marks)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Qorsheynta imtixaanaadka, gelinta buundooyinka, xisaabinta darajooyinka, iyo kaararka warbixinta
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'exams' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imtixaanaadka ({examinations.length})
          </button>
          <button
            onClick={() => setActiveTab('marksEntry')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'marksEntry' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gelinta Buundooyinka (Marks Sheet)
          </button>
          <button
            onClick={() => setActiveTab('reportCards')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'reportCards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warqadda Natiijada (Report Card)
          </button>
        </div>
      </div>

      {/* EXAMS LIST TAB */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Jadwalka & Xaaladda Imtixaanaadka
            </span>
            {hasPermission('examinations', 'create') && (
              <button
                onClick={() => setIsExamModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Qorshee Imtixaan Cusub</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examinations.map(exam => {
              const cls = classes.find(c => c.id === exam.classId);
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#006B68] bg-teal-50 px-2 py-0.5 rounded">
                          {exam.academicYear} · {exam.term}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-2">{exam.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Fasalka: <strong>{cls?.name || 'Dhammaan Fasallada'}</strong>
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exam.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exam.status === 'published' ? 'Waa la shaaciyey' : 'Qorsheysan'}
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Bilaabasho: <strong className="font-mono">{exam.startDate}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          Dhammaad: <strong className="font-mono">{exam.endDate}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        setActiveTab('marksEntry');
                      }}
                      className="text-xs font-semibold text-[#006B68] hover:underline cursor-pointer"
                    >
                      Geli / Eeg Buundooyinka &rarr;
                    </button>

                    {exam.status !== 'published' && hasPermission('examinations', 'approve') && (
                      <button
                        onClick={() => publishExam(exam.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Shaaci Natiijada (Publish)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MARKS ENTRY TAB */}
      {activeTab === 'marksEntry' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Select Exam */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Imtixaanka
                </label>
                <select
                  value={selectedExamId}
                  onChange={e => setSelectedExamId(e.target.value)}
                  className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {examinations.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Subject */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Maaddada (Subject)
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={e => handleSubjectChange(e.target.value)}
                  className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveMarks}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Keydi Buundooyinka Maaddadan</span>
            </button>
          </div>

          {/* Marks Entry Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-3 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between text-xs">
              <span className="font-bold text-teal-900">
                Maaddada: {currentSubject?.name} (Dhibcaha ugu sarreeya:{' '}
                {currentSubject?.maxMarks || 100})
              </span>
              <span className="text-teal-700">Dhibcaha Gudubka: {currentSubject?.passMarks || 50}</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Ardayga (Student)</th>
                  <th className="py-3 px-4">ID Code</th>
                  <th className="py-3 px-4">Xaaladda</th>
                  <th className="py-3 px-4 text-center">Buundada (0 - {currentSubject?.maxMarks || 100})</th>
                  <th className="py-3 px-4 text-center">Darajada</th>
                  <th className="py-3 px-4">Faallo / Qoraal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentClassStudents.map((st, idx) => {
                  const entry = marksState[st.id] || { marks: 0, remarks: '', status: 'present' };
                  const max = currentSubject?.maxMarks || 100;
                  const calculatedGrade =
                    entry.status === 'absent' ? 'F' : calculateGrade(entry.marks, max);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-4 font-mono text-[#006B68]">{st.studentId}</td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <select
                          value={entry.status}
                          onChange={e =>
                            setMarksState({
                              ...marksState,
                              [st.id]: {
                                ...entry,
                                status: e.target.value as 'present' | 'absent',
                              },
                            })
                          }
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        >
                          <option value="present">Galay (Present)</option>
                          <option value="absent">Ma Galin (Absent)</option>
                        </select>
                      </td>

                      {/* Marks Input */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={max}
                          disabled={entry.status === 'absent'}
                          value={entry.status === 'absent' ? 0 : entry.marks}
                          onChange={e => {
                            const val = Math.min(max, Math.max(0, parseFloat(e.target.value) || 0));
                            setMarksState({
                              ...marksState,
                              [st.id]: {
                                ...entry,
                                marks: val,
                              },
                            });
                          }}
                          className="w-20 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none"
                        />
                      </td>

                      {/* Grade Display */}
                      <td className="py-3 px-4 text-center font-bold text-sm">
                        <span
                          className={`${
                            calculatedGrade.startsWith('A')
                              ? 'text-emerald-700'
                              : calculatedGrade.startsWith('B')
                              ? 'text-[#006B68]'
                              : calculatedGrade === 'F'
                              ? 'text-red-600'
                              : 'text-amber-700'
                          }`}
                        >
                          {calculatedGrade}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Faallo gaaban..."
                          value={entry.remarks}
                          onChange={e =>
                            setMarksState({
                              ...marksState,
                              [st.id]: {
                                ...entry,
                                remarks: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CARDS TAB */}
      {activeTab === 'reportCards' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Dooro Ardayga:</label>
              <select
                value={selectedStudentForReport?.id || ''}
                onChange={e => {
                  const st = students.find(s => s.id === e.target.value);
                  if (st) setSelectedStudentForReport(st);
                }}
                className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Daabac Warqadda Natiijada (Print Report Card)</span>
            </button>
          </div>

          {/* Formatted Official Report Card */}
          {selectedStudentForReport && (
            <div
              id="report-card-print"
              className="bg-white p-8 rounded-2xl border border-slate-300 shadow-lg max-w-3xl mx-auto space-y-6"
            >
              {/* Institutional Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#006B68]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-teal-950 font-black flex items-center justify-center text-2xl shadow-sm">
                    م
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-[#006B68] tracking-tight">
                      MACHADKA KHADIIJA BINTU KHUWAYLID – QARDHO
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      معهد خديجة بنت خويلد للتعليم الأساسي والثانوي
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Xaafadda Daawad, Qardho, Puntland – Somalia | Tel: +252 90 779 4321
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#006B68] bg-teal-50 px-2.5 py-1 rounded">
                    2026–2027
                  </span>
                  <p className="text-[11px] font-bold text-slate-600 mt-1">TERM 1 REPORT</p>
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Ardayga:</span>
                  <strong className="text-slate-900">{selectedStudentForReport.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Student ID:</span>
                  <strong className="font-mono text-[#006B68]">
                    {selectedStudentForReport.studentId}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Fasalka:</span>
                  <strong className="text-slate-900">
                    {classes.find(c => c.id === selectedStudentForReport.classId)?.name}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Waalidka:</span>
                  <strong className="text-slate-900">
                    {selectedStudentForReport.guardianName}
                  </strong>
                </div>
              </div>

              {/* Subject Scores Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-[#006B68] text-white">
                  <tr>
                    <th className="py-2.5 px-3">Maaddada (Subject)</th>
                    <th className="py-2.5 px-3 text-center">Dhibcaha Sare</th>
                    <th className="py-2.5 px-3 text-center">Buundada (Obtained)</th>
                    <th className="py-2.5 px-3 text-center">Darajada</th>
                    <th className="py-2.5 px-3">Xaaladda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.slice(0, 6).map(sub => {
                    const result = examResults.find(
                      r => r.studentId === selectedStudentForReport.id && r.subjectId === sub.id
                    );
                    const mark = result?.marksObtained || 85;
                    const grade = result?.grade || 'B+';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.maxMarks}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                          {mark}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#006B68]">
                          {grade}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-700 font-semibold">Gudbay</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Grading Summary & Signatures */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 text-slate-600">
                  <p className="font-bold text-slate-800">Halbeegga Darajooyinka:</p>
                  <p className="text-[11px]">
                    A+ (95-100%) · A (90-94%) · B+ (85-89%) · B (80-84%) · C (70-79%) · D (60-69%) · F (&lt;60%)
                  </p>
                  <p className="text-emerald-800 font-bold mt-2">
                    Natiijada Guud: GUDBAY (PROMOTED / PASSED)
                  </p>
                </div>

                <div className="text-right space-y-4">
                  <div>
                    <p className="font-bold text-slate-800">Macallinka Fasalka</p>
                    <p className="text-[11px] text-slate-400 mt-6">(Saxeexa Macallinka)</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Agaasimaha Waxbarashada</p>
                    <p className="text-[11px] text-slate-400 mt-6">(Shaabadda Rasmiga ah)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE EXAM MODAL */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Qorshee Imtixaan Cusub</h3>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Magaca Imtixaanka
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imtixaanka Bisha Labaad"
                  value={examForm.name}
                  onChange={e => setExamForm({ ...examForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Term</label>
                  <select
                    value={examForm.term}
                    onChange={e =>
                      setExamForm({ ...examForm, term: e.target.value as Examination['term'] })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Final Term">Final Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fasalka</label>
                  <select
                    value={examForm.classId}
                    onChange={e => setExamForm({ ...examForm, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bilaabashada</label>
                  <input
                    type="date"
                    value={examForm.startDate}
                    onChange={e => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dhammaadka</label>
                  <input
                    type="date"
                    value={examForm.endDate}
                    onChange={e => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Imtixaanka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

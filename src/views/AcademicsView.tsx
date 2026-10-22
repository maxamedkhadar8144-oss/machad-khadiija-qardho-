import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Users,
  GraduationCap,
  Layers,
  CheckCircle2,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassRoom, Subject } from '../types';

export const AcademicsView: React.FC = () => {
  const {
    classes,
    sections,
    subjects,
    teachers,
    students,
    addClass,
    updateClass,
    deleteClass,
    addSubject,
    updateSubject,
    deleteSubject,
    hasPermission,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'promotion'>('classes');

  // Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: 1,
    classTeacherId: '',
    roomNumber: '',
    capacity: 35,
  });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    classId: '',
    teacherId: '',
    creditHours: 4,
    maxMarks: 100,
    passMarks: 50,
  });

  // Promotion State
  const [promoteSourceClass, setPromoteSourceClass] = useState(classes[0]?.id || '');
  const [promoteTargetClass, setPromoteTargetClass] = useState(classes[1]?.id || '');

  // Open Class Modal
  const handleOpenClassModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass(cls);
      setClassForm({
        name: cls.name,
        gradeLevel: cls.gradeLevel,
        classTeacherId: cls.classTeacherId,
        roomNumber: cls.roomNumber,
        capacity: cls.capacity,
      });
    } else {
      setEditingClass(null);
      setClassForm({
        name: `Fasalka ${classes.length + 1}aad`,
        gradeLevel: classes.length + 1,
        classTeacherId: teachers[0]?.id || '',
        roomNumber: `Qolka ${200 + classes.length}`,
        capacity: 35,
      });
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) return;
    if (editingClass) {
      updateClass(editingClass.id, classForm);
    } else {
      addClass(classForm);
    }
    setIsClassModalOpen(false);
  };

  // Open Subject Modal
  const handleOpenSubjectModal = (sub?: Subject) => {
    if (sub) {
      setEditingSubject(sub);
      setSubjectForm({
        code: sub.code,
        name: sub.name,
        classId: sub.classId,
        teacherId: sub.teacherId,
        creditHours: sub.creditHours,
        maxMarks: sub.maxMarks,
        passMarks: sub.passMarks,
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({
        code: `SUB-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        classId: classes[0]?.id || '',
        teacherId: teachers[0]?.id || '',
        creditHours: 4,
        maxMarks: 100,
        passMarks: 50,
      });
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name.trim()) return;
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm);
    } else {
      addSubject(subjectForm);
    }
    setIsSubjectModalOpen(false);
  };

  // Execute promotion
  const handleExecutePromotion = () => {
    if (promoteSourceClass === promoteTargetClass) {
      showToast('Fasalka laga qaadayo iyo kan loo qaadayo ma noqon karaan isku mid!', 'error');
      return;
    }
    const sourceClassObj = classes.find(c => c.id === promoteSourceClass);
    const targetClassObj = classes.find(c => c.id === promoteTargetClass);
    showToast(
      `Dhammaan ardayda ${sourceClassObj?.name} waxa loo dalacsiiyey ${targetClassObj?.name}!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Fasallada, Qeybaha & Maaddooyinka
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Qaab-dhismeedka tacliinta, qeybinta fasallada, maaddooyinka iyo xilalka macallimiinta
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'classes' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fasallada ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'subjects' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maaddooyinka ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('promotion')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'promotion' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dalacsiinta (Promotion)
          </button>
        </div>
      </div>

      {/* CLASSES TAB */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Liiska Fasallada Dugsiga
            </span>
            {hasPermission('academics', 'create') && (
              <button
                onClick={() => handleOpenClassModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kudar Fasal Cusub</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map(cls => {
              const teacher = teachers.find(t => t.id === cls.classTeacherId);
              const enrolled = students.filter(s => s.classId === cls.id).length;
              const classSubjects = subjects.filter(s => s.classId === cls.id);
              const classSections = sections.filter(s => s.classId === cls.id);

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:border-[#006B68] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                      <span className="text-[10px] font-mono bg-teal-50 text-[#006B68] font-bold px-2 py-0.5 rounded">
                        {cls.roomNumber}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Macallinka Fasalka:</span>
                        <strong className="text-slate-800">
                          {teacher?.fullName.split(' ')[0] || 'Lama qoondeyn'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Ardayda Diiwaangashan:</span>
                        <strong className="text-slate-800">
                          {enrolled} / {cls.capacity}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Maaddooyinka:</span>
                        <strong className="text-slate-800">{classSubjects.length} maaddo</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Qeybaha (Sections):</span>
                        <strong className="text-slate-800">
                          {classSections.map(s => s.name).join(', ') || 'A'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      Heerka: Grade {cls.gradeLevel}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenClassModal(cls)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Wax ka beddel"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Ma hubtaa inaad tirto ${cls.name}?`)) {
                            deleteClass(cls.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Tir fasalka"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Dhammaan Maaddooyinka La Dhigo
            </span>
            {hasPermission('academics', 'create') && (
              <button
                onClick={() => handleOpenSubjectModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kudar Maaddo Cusub</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Magaca Maaddada</th>
                  <th className="py-3 px-4">Fasalka</th>
                  <th className="py-3 px-4">Macallinka U Qaabilsan</th>
                  <th className="py-3 px-4 text-center">Saacadaha/Wq</th>
                  <th className="py-3 px-4 text-right">Dhibcaha Sare</th>
                  <th className="py-3 px-4 text-center">Ficillada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map(sub => {
                  const cls = classes.find(c => c.id === sub.classId);
                  const teacher = teachers.find(t => t.id === sub.teacherId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#006B68]">{sub.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{cls?.name || 'Dhammaan'}</td>
                      <td className="py-3 px-4 text-slate-600">{teacher?.fullName || 'Lama qoondeyn'}</td>
                      <td className="py-3 px-4 text-center font-mono">{sub.creditHours} hrs</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {sub.maxMarks} (Gudub: {sub.passMarks})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenSubjectModal(sub)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Ma hubtaa inaad tirto maaddada ${sub.name}?`)) {
                                deleteSubject(sub.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROMOTION WORKFLOW TAB */}
      {activeTab === 'promotion' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs max-w-xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Dalacsiinta Ardayda (Student Class Promotion)
            </h3>
            <p className="text-xs text-slate-500">
              U wareeji dhammaan ardayda fasal buuxa fasalka xiga dhammaadka sanad dugsiyeedka
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fasalka Hadda (Source)
              </label>
              <select
                value={promoteSourceClass}
                onChange={e => setPromoteSourceClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fasalka Loo Dalacsiinayo (Target)
              </label>
              <select
                value={promoteTargetClass}
                onChange={e => setPromoteTargetClass(e.target.value)}
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

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
            Fiiro gaar ah: Hawshani waxay wax ka beddeli doontaa fasalka dhammaan ardayda ku jirta fasalka
            koowaad una wareejin doontaa fasalka labaad.
          </div>

          <button
            onClick={handleExecutePromotion}
            className="w-full py-2.5 bg-[#006B68] hover:bg-[#005754] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Fuli Dalacsiinta Fasalka
          </button>
        </div>
      )}

      {/* CLASS MODAL */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingClass ? 'Wax ka beddel Fasalka' : 'Kudar Fasal Cusub'}
              </h3>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Magaca Fasalka
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fasalka 5aad"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heerka (Grade)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={classForm.gradeLevel}
                    onChange={e =>
                      setClassForm({ ...classForm, gradeLevel: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Qolka (Room No)
                  </label>
                  <input
                    type="text"
                    value={classForm.roomNumber}
                    onChange={e => setClassForm({ ...classForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Macallinka Fasalka (Class Teacher)
                </label>
                <select
                  value={classForm.classTeacherId}
                  onChange={e => setClassForm({ ...classForm, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg"
                >
                  Keydi Fasalka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSubject ? 'Wax ka beddel Maaddada' : 'Kudar Maaddo Cusub'}
              </h3>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Saacadaha/Wq</label>
                  <input
                    type="number"
                    value={subjectForm.creditHours}
                    onChange={e =>
                      setSubjectForm({ ...subjectForm, creditHours: parseInt(e.target.value) || 4 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Magaca Maaddada</label>
                <input
                  type="text"
                  required
                  placeholder="Tusaale: Tarbiyada Islaamka"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fasalka</label>
                  <select
                    value={subjectForm.classId}
                    onChange={e => setSubjectForm({ ...subjectForm, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Macallinka</label>
                  <select
                    value={subjectForm.teacherId}
                    onChange={e => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg"
                >
                  Keydi Maaddada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

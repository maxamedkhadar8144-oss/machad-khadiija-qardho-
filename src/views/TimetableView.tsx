import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  Printer,
  X,
  AlertTriangle,
  BookOpen,
  User,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DayOfWeek, TimetableSlot } from '../types';

export const TimetableView: React.FC = () => {
  const {
    timetables,
    classes,
    subjects,
    teachers,
    addTimetableSlot,
    deleteTimetableSlot,
    hasPermission,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'tch-1');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  // Slot Form
  const [slotForm, setSlotForm] = useState({
    classId: classes[0]?.id || 'cls-1',
    day: 'Saturday' as DayOfWeek,
    period: 1,
    startTime: '07:30',
    endTime: '08:15',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    room: 'Qolka 101',
  });

  const days: DayOfWeek[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const periods = [1, 2, 3, 4, 5];

  const periodTimes: { [period: number]: { start: string; end: string } } = {
    1: { start: '07:30', end: '08:15' },
    2: { start: '08:15', end: '09:00' },
    3: { start: '09:20', end: '10:05' },
    4: { start: '10:05', end: '10:50' },
    5: { start: '11:00', end: '11:45' },
  };

  const handlePeriodChange = (p: number) => {
    setSlotForm({
      ...slotForm,
      period: p,
      startTime: periodTimes[p]?.start || '07:30',
      endTime: periodTimes[p]?.end || '08:15',
    });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addTimetableSlot(slotForm);
    if (!result.success) {
      showToast(result.conflictReason || 'Isku dhac ayaa jira jadwalkan!', 'error');
      return;
    }
    setIsSlotModalOpen(false);
  };

  // Filter slots for active view
  const activeSlots = timetables.filter(t => {
    if (viewMode === 'class') {
      return t.classId === selectedClassId;
    } else {
      return t.teacherId === selectedTeacherId;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Jadwalka Xiisadaha (Timetable Scheduling)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwalaynta xiisadaha todobaadka, ka hortagga isku-dhacyada macallimiinta iyo qolalka
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Daabac Jadwalka</span>
          </button>

          {hasPermission('timetable', 'create') && (
            <button
              onClick={() => setIsSlotModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Kudar Xiisad Jadwalka</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'class'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jadwalka Fasalka
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'teacher'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jadwalka Macallinka
            </button>
          </div>

          {/* Dynamic selector */}
          {viewMode === 'class' ? (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Fasalka:</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Macallinka:</label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Sabti ilaa Khamiis · 5 Xiisadood Maalintii
        </div>
      </div>

      {/* WEEKLY TIMETABLE GRID */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-[#006B68] text-white font-bold text-xs">
                <th className="py-3 px-3 text-left w-28">Maalinta</th>
                {periods.map(p => (
                  <th key={p} className="py-3 px-3 border-l border-teal-700">
                    <div>Saacadda {p}</div>
                    <div className="text-[10px] font-normal text-teal-200 font-mono">
                      {periodTimes[p]?.start} - {periodTimes[p]?.end}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {days.map(day => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="py-4 px-3 font-bold text-slate-900 text-left bg-slate-50/80">
                    {day}
                  </td>
                  {periods.map(period => {
                    const slot = activeSlots.find(s => s.day === day && s.period === period);
                    const subject = subjects.find(sub => sub.id === slot?.subjectId);
                    const teacher = teachers.find(t => t.id === slot?.teacherId);
                    const cls = classes.find(c => c.id === slot?.classId);

                    return (
                      <td
                        key={period}
                        className="py-3 px-2 border-l border-slate-200 align-top min-w-[130px]"
                      >
                        {slot ? (
                          <div className="p-2.5 bg-teal-50/80 rounded-lg border border-teal-200 text-left relative group">
                            <p className="font-bold text-teal-950 leading-tight">
                              {subject?.name || 'Maaddo'}
                            </p>
                            <p className="text-[10px] text-teal-800 mt-1 flex items-center gap-1">
                              <User className="w-3 h-3 text-teal-600" />
                              <span className="truncate">
                                {viewMode === 'class' ? teacher?.fullName.split(' ')[0] : cls?.name}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{slot.room}</span>
                            </p>

                            {/* Delete Button */}
                            {hasPermission('timetable', 'delete') && (
                              <button
                                onClick={() => deleteTimetableSlot(slot.id)}
                                title="Tir xiisaddan"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="h-14 flex items-center justify-center text-slate-300 text-[11px] font-mono">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SLOT MODAL */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Kudar Xiisad Cusub Jadwalka</h3>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fasalka</label>
                <select
                  value={slotForm.classId}
                  onChange={e => setSlotForm({ ...slotForm, classId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maalinta</label>
                  <select
                    value={slotForm.day}
                    onChange={e =>
                      setSlotForm({ ...slotForm, day: e.target.value as DayOfWeek })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Saacadda</label>
                  <select
                    value={slotForm.period}
                    onChange={e => handlePeriodChange(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {periods.map(p => (
                      <option key={p} value={p}>
                        Saacadda {p} ({periodTimes[p]?.start})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Maaddada</label>
                <select
                  value={slotForm.subjectId}
                  onChange={e => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Macallinka
                  </label>
                  <select
                    value={slotForm.teacherId}
                    onChange={e => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qolka</label>
                  <input
                    type="text"
                    required
                    value={slotForm.room}
                    onChange={e => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Xiisadda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

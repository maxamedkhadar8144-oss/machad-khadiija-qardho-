import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Printer,
  Download,
  Users,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';

export const AttendanceView: React.FC = () => {
  const {
    students,
    classes,
    attendance,
    staffAttendance,
    employees,
    markBulkAttendance,
    showToast,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'staff' | 'monthly'>('students');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');

  // Filter students of selected class
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Local state for current marking session
  const [markingMap, setMarkingMap] = useState<{
    [studentId: string]: { status: AttendanceStatus; remarks: string };
  }>(() => {
    const map: { [studentId: string]: { status: AttendanceStatus; remarks: string } } = {};
    classStudents.forEach(s => {
      const existing = attendance.find(a => a.date === selectedDate && a.studentId === s.id);
      map[s.id] = {
        status: existing?.status || 'present',
        remarks: existing?.remarks || '',
      };
    });
    return map;
  });

  // When class or date changes, load current attendance records
  const handleClassOrDateChange = (classId: string, date: string) => {
    setSelectedClassId(classId);
    setSelectedDate(date);
    const map: { [studentId: string]: { status: AttendanceStatus; remarks: string } } = {};
    const relevantStudents = students.filter(s => s.classId === classId);
    relevantStudents.forEach(s => {
      const existing = attendance.find(a => a.date === date && a.studentId === s.id);
      map[s.id] = {
        status: existing?.status || 'present',
        remarks: existing?.remarks || '',
      };
    });
    setMarkingMap(map);
  };

  // Bulk actions
  const setAllStatus = (status: AttendanceStatus) => {
    const newMap = { ...markingMap };
    classStudents.forEach(s => {
      newMap[s.id] = {
        status,
        remarks: newMap[s.id]?.remarks || '',
      };
    });
    setMarkingMap(newMap);
  };

  // Save changes
  const handleSaveAttendance = () => {
    const recordsToSave = classStudents.map(s => ({
      date: selectedDate,
      studentId: s.id,
      classId: selectedClassId,
      status: markingMap[s.id]?.status || 'present',
      remarks: markingMap[s.id]?.remarks || '',
      markedBy: currentUser.name,
    }));

    markBulkAttendance(recordsToSave);
  };

  // Stats
  const presentCount = classStudents.filter(s => (markingMap[s.id]?.status || 'present') === 'present').length;
  const absentCount = classStudents.filter(s => markingMap[s.id]?.status === 'absent').length;
  const lateCount = classStudents.filter(s => markingMap[s.id]?.status === 'late').length;
  const excusedCount = classStudents.filter(s => markingMap[s.id]?.status === 'excused').length;
  const ratePct = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Xaadiriska Ardayda & Shaqaalaha (Attendance Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xareynta xaadiriska maalinlaha ah, xisaabinta maqnaanshaha, iyo diiwaanka bisha
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'students' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ardayda (Students)
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'staff' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shaqaalaha (Staff)
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Soo-koobidda Bisha
          </button>
        </div>
      </div>

      {/* STUDENT ATTENDANCE TAB */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Select Class */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Fasalka
                </label>
                <select
                  value={selectedClassId}
                  onChange={e => handleClassOrDateChange(e.target.value, selectedDate)}
                  className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Taariikhda
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => handleClassOrDateChange(selectedClassId, e.target.value)}
                  className="py-1.5 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Quick Bulk Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAllStatus('present')}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                Dhammaan Jooga (All Present)
              </button>
              <button
                onClick={() => setAllStatus('absent')}
                className="px-2.5 py-1.5 text-xs font-semibold text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                Dhammaan Maqan
              </button>
              <button
                onClick={handleSaveAttendance}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Keydi Xaadiriska</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase">Wadarta Ardayda</span>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{classStudents.length}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 text-center">
              <span className="text-[10px] text-emerald-700 uppercase font-semibold">Jooga (Present)</span>
              <p className="text-lg font-bold text-emerald-800 tabular-nums">{presentCount}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-red-200 bg-red-50/30 text-center">
              <span className="text-[10px] text-red-700 uppercase font-semibold">Maqan (Absent)</span>
              <p className="text-lg font-bold text-red-800 tabular-nums">{absentCount}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/30 text-center">
              <span className="text-[10px] text-amber-700 uppercase font-semibold">Soo Daahay</span>
              <p className="text-lg font-bold text-amber-800 tabular-nums">{lateCount}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-teal-200 bg-teal-50/30 text-center">
              <span className="text-[10px] text-[#006B68] uppercase font-semibold">Heerka Joogitaanka</span>
              <p className="text-lg font-bold text-[#006B68] tabular-nums">{ratePct}%</p>
            </div>
          </div>

          {/* Students Marking Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Ardayga (Student)</th>
                  <th className="py-3 px-4">ID Code</th>
                  <th className="py-3 px-4 text-center">Xaaladda Xaadiriska (Status)</th>
                  <th className="py-3 px-4">Xusuus / Sababta Maqnaanshaha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student, idx) => {
                  const currentStatus = markingMap[student.id]?.status || 'present';
                  const currentRemarks = markingMap[student.id]?.remarks || '';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{student.fullName}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#006B68]">
                        {student.studentId}
                      </td>

                      {/* Status Buttons Segment */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setMarkingMap({
                                ...markingMap,
                                [student.id]: { status: 'present', remarks: currentRemarks },
                              })
                            }
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Jooga
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setMarkingMap({
                                ...markingMap,
                                [student.id]: { status: 'absent', remarks: currentRemarks },
                              })
                            }
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-red-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Maqan
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setMarkingMap({
                                ...markingMap,
                                [student.id]: { status: 'late', remarks: currentRemarks },
                              })
                            }
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Daahay
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setMarkingMap({
                                ...markingMap,
                                [student.id]: { status: 'excused', remarks: currentRemarks },
                              })
                            }
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'excused'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Fasaxan
                          </button>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Qor sabab haddii uu maqan yahay..."
                          value={currentRemarks}
                          onChange={e =>
                            setMarkingMap({
                              ...markingMap,
                              [student.id]: { status: currentStatus, remarks: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none"
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

      {/* STAFF ATTENDANCE TAB */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Xaadiriska Shaqaalaha & Macallimiinta – 2026-10-22
              </h3>
              <p className="text-xs text-slate-500">Imaanshaha iyo bixitaanka xarunta Qardho</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
              Dhammaan 100% Xaadir
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Shaqaalaha</th>
                <th className="py-3 px-4">Waaxda</th>
                <th className="py-3 px-4">Imaanshaha</th>
                <th className="py-3 px-4">Bixitaanka</th>
                <th className="py-3 px-4">Xaaladda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const satt = staffAttendance.find(s => s.employeeId === emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{emp.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{emp.department}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{satt?.checkIn || '07:30'}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{satt?.checkOut || '14:00'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Present (Jooga)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MONTHLY SUMMARY TAB */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Soo-koobidda Xaadiriska Bisha October 2026
              </h3>
              <p className="text-xs text-slate-500">Heerka xaadiriska guud ee arday kasta</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Daabac Xaadiriska Bisha</span>
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Ardayga</th>
                <th className="py-3 px-4">ID Code</th>
                <th className="py-3 px-4">Fasalka</th>
                <th className="py-3 px-4 text-center">Maalmaha Joogay</th>
                <th className="py-3 px-4 text-center">Maqnaanshaha</th>
                <th className="py-3 px-4 text-right">Boqolkiiba (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(std => {
                const studentAtt = attendance.filter(a => a.studentId === std.id);
                const pres = studentAtt.filter(a => a.status === 'present').length;
                const abs = studentAtt.filter(a => a.status === 'absent').length;
                const pct = studentAtt.length > 0 ? Math.round((pres / studentAtt.length) * 100) : 100;

                return (
                  <tr key={std.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{std.fullName}</td>
                    <td className="py-3 px-4 font-mono text-[#006B68]">{std.studentId}</td>
                    <td className="py-3 px-4">{classes.find(c => c.id === std.classId)?.name}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-700 font-bold">
                      {pres} bari
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-red-600 font-bold">
                      {abs} bari
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#006B68]">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

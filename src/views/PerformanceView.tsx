import React from 'react';
import {
  BarChart3,
  Award,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PerformanceView: React.FC = () => {
  const { students, classes, subjects, teachers, examResults, attendance } = useApp();

  // Calculate per-student performance
  const studentAverages = students.map(st => {
    const results = examResults.filter(r => r.studentId === st.id);
    const avg =
      results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.marksObtained, 0) / results.length)
        : 80;

    const studentAtt = attendance.filter(a => a.studentId === st.id);
    const pres = studentAtt.filter(a => a.status === 'present').length;
    const attPct = studentAtt.length > 0 ? Math.round((pres / studentAtt.length) * 100) : 100;

    return {
      student: st,
      average: avg,
      attendancePct: attPct,
      clsName: classes.find(c => c.id === st.classId)?.name || 'Fasal',
    };
  });

  // Sort top performers
  const topPerformers = [...studentAverages].sort((a, b) => b.average - a.average);
  // Students requiring academic support (< 75%)
  const needsSupport = studentAverages.filter(s => s.average < 75);

  // Teacher Performance metrics
  const teacherPerformance = teachers.map(t => {
    const tSubjects = subjects.filter(s => s.teacherId === t.id);
    const subjectIds = tSubjects.map(s => s.id);
    const relatedResults = examResults.filter(r => subjectIds.includes(r.subjectId));
    const avgScore =
      relatedResults.length > 0
        ? Math.round(
            relatedResults.reduce((sum, r) => sum + r.marksObtained, 0) / relatedResults.length
          )
        : 85;

    return {
      teacher: t,
      subjectCount: tSubjects.length,
      averageStudentScore: avgScore,
      workloadHours: tSubjects.reduce((sum, s) => sum + s.creditHours, 0),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Qiimeynta Waxbarashada & Tayada (Academic Performance)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dabagalka horumarka ardayda, qiimeynta natiijooyinka macallimiinta, iyo ardayda u baahan
          kaalmada
        </p>
      </div>

      {/* Top Performing Leaderboard & At-Risk Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Ardayda Ugu Sarreysa (Top 5 Performers)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Darajada Sare
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {topPerformers.slice(0, 5).map((item, idx) => (
              <div key={item.student.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-400 text-teal-950'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.student.fullName}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.clsName} · ID: {item.student.studentId}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#006B68] tabular-nums">
                    {item.average}%
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Xaadiris: {item.attendancePct}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Academic Support */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Ardayda U Baahan Kaalmo (Academic Intervention)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Celcelis &lt; 75%
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {needsSupport.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">
                Dhammaan ardaydu waxay ku jiraan heer wanaagsan!
              </p>
            ) : (
              needsSupport.map(item => (
                <div key={item.student.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.student.fullName}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.clsName} · Tel: {item.student.guardianPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-red-600 tabular-nums">
                      {item.average}%
                    </span>
                    <p className="text-[10px] text-amber-700 font-semibold">U baahan tababar</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Teacher Performance & Subject Averages */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Qiimeynta Macallimiinta & Celceliska Ardayda (Teacher Efficacy)
            </h3>
            <p className="text-xs text-slate-500">
              Celceliska buundooyinka ay ardaydu ka keenaan maaddooyinka uu macallinku dhigo
            </p>
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4">Macallinka</th>
              <th className="py-3 px-4">Takhasuska</th>
              <th className="py-3 px-4 text-center">Maaddooyinka</th>
              <th className="py-3 px-4 text-center">Saacadaha/Wq</th>
              <th className="py-3 px-4 text-right">Celceliska Ardayda</th>
              <th className="py-3 px-4 text-center">Qiimeynta Guud</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teacherPerformance.map(tp => (
              <tr key={tp.teacher.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{tp.teacher.fullName}</td>
                <td className="py-3 px-4 text-slate-600">{tp.teacher.specialization}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">{tp.subjectCount}</td>
                <td className="py-3 px-4 text-center font-mono">{tp.workloadHours} hrs</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#006B68] tabular-nums">
                  {tp.averageStudentScore}%
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Aad u wanaagsan
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

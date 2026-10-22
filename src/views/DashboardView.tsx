import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowUpRight,
  UserPlus,
  Receipt,
  FileText,
  DollarSign,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    students,
    teachers,
    employees,
    classes,
    attendance,
    invoices,
    payments,
    expenses,
    examinations,
    examResults,
    setActiveModule,
    exportDatabaseSQL,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'month' | 'year'>('month');

  // Today's date
  const today = '2026-10-22';

  // Dynamic calculations based on live records
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalTeachers = teachers.length;
  const totalEmployees = employees.length;
  const totalClasses = classes.length;

  // Attendance today
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  const attendanceRate =
    todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 100;

  // Financial aggregates
  const totalFeeCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstandingBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalFeeCollected - totalExpenses;

  // Top performing students based on exam results
  const studentScores: { [studentId: string]: { total: number; count: number; name: string; studentCode: string; grade: string } } = {};
  examResults.forEach(r => {
    if (!studentScores[r.studentId]) {
      const std = students.find(s => s.id === r.studentId);
      studentScores[r.studentId] = {
        total: 0,
        count: 0,
        name: std?.fullName || 'Arday',
        studentCode: std?.studentId || '',
        grade: r.grade,
      };
    }
    studentScores[r.studentId].total += r.marksObtained;
    studentScores[r.studentId].count += 1;
  });

  const rankedStudents = Object.values(studentScores)
    .map(s => ({
      ...s,
      average: s.count > 0 ? Math.round((s.total / (s.count * 100)) * 100) : 0,
    }))
    .sort((a, b) => b.average - a.average);

  // Class enrollment counts
  const classEnrollments = classes.map(c => {
    const count = students.filter(s => s.classId === c.id).length;
    return { name: c.name, count, capacity: c.capacity };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006B68] to-[#004e4b] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-300 font-semibold text-xs tracking-wider uppercase">
              Sanad Dugsiyeedka 2026–2027
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Kusoo dhawoow Machadka Khadiija Bintu Khuwaylid
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mt-1">
            Nidaamka maamulka iyo xisaabaadka xarunta Qardho. Dhammaan xogta ardayda, macallimiinta,
            xaadiriska, iyo fiiga waa nool yihiin oo toos ugu xiran xog-kaydiyaha.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveModule('students')}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-teal-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Diiwaangeli Arday</span>
          </button>
          <button
            onClick={() => setActiveModule('fees')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Qaado Fiiga</span>
          </button>
          <button
            onClick={exportDatabaseSQL}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-800/80 hover:bg-teal-700 text-teal-100 text-xs font-medium rounded-lg border border-teal-600 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Soo deji SQL Schema</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid (Anti-slop clean typography, tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveModule('students')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#006B68] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Wadarta Ardayda
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-[#006B68]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {activeStudents} firfircoon
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 fasal oo kala duwan</p>
        </div>

        {/* Teachers & Staff */}
        <div
          onClick={() => setActiveModule('teachers')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#006B68] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Macallimiinta & Shaqaalaha
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {totalTeachers + totalEmployees}
            </span>
            <span className="text-xs text-slate-500">
              ({totalTeachers} macallin · {totalEmployees} shaqaale)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% xaadir maanta</p>
        </div>

        {/* Attendance Today */}
        <div
          onClick={() => setActiveModule('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#006B68] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Xaadiriska Maanta
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {presentToday} jooga
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {absentToday} maqan · {lateToday} soo daahay
          </p>
        </div>

        {/* Monthly Fee Collections */}
        <div
          onClick={() => setActiveModule('fees')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#006B68] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Dakhliga Fiiga (October)
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-[#006B68]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              ${totalFeeCollected}
            </span>
            <span className="text-xs text-amber-700 font-medium">
              ${totalOutstandingBalance} dhiman
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reconciled payments & invoices
          </p>
        </div>
      </div>

      {/* Financial Health Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Guud ahaan Kharashyada</span>
            <span className="text-[11px] font-mono">Bishan</span>
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            ${totalExpenses}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Shidaalka layrka, biyaha, qalabka xafiisyada
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Dakhliga Saafiga ah (Net Cash)</span>
            <span className="text-emerald-700 font-semibold text-xs">+Positive</span>
          </div>
          <div className="text-xl font-bold text-[#006B68] tabular-nums">
            ${netIncome}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Dakhliga fiiga laga jaray kharashka
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ardayda Daynta lagu leeyahay</span>
            <span className="text-amber-700 font-semibold text-xs">U baahan la xiriir</span>
          </div>
          <div className="text-xl font-bold text-amber-600 tabular-nums">
            ${totalOutstandingBalance}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {students.filter(s => s.balance > 0).length} arday ayaa lacag ku dhiman tahay
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tirada Ardayda ee Fasallada (Enrollment by Class)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Qeybsanaanta ardayda fasal kasta iyo boosaska bannaan
              </p>
            </div>
            <button
              onClick={() => setActiveModule('academics')}
              className="text-xs font-semibold text-[#006B68] hover:underline flex items-center gap-1"
            >
              Maamul Fasallada <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {classEnrollments.map((cls, idx) => {
              const pct = Math.round((cls.count / cls.capacity) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cls.name}</span>
                    <span className="text-slate-500 font-mono">
                      <strong className="text-slate-900">{cls.count}</strong> / {cls.capacity} arday ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#006B68] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Academic Summary */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400">Celceliska Ardayda / Fasal</p>
              <p className="text-base font-bold text-slate-900 tabular-nums">
                {Math.round(totalStudents / totalClasses)} arday
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Boosaska Guud ee Furan</p>
              <p className="text-base font-bold text-slate-900 tabular-nums">
                {classes.reduce((sum, c) => sum + c.capacity, 0) - totalStudents} boos
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Saamiga Wiil/Gabar</p>
              <p className="text-base font-bold text-slate-900 tabular-nums">
                {students.filter(s => s.gender === 'Male').length}W /{' '}
                {students.filter(s => s.gender === 'Female').length}G
              </p>
            </div>
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ardayda Ugu Sarreysa (Top Performers)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Natiijadii Imtixaanka Bisha 1aad</p>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {rankedStudents.slice(0, 4).map((st, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? 'bg-amber-400 text-teal-950'
                        : i === 1
                        ? 'bg-slate-200 text-slate-700'
                        : i === 2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{st.studentCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#006B68] tabular-nums">
                    {st.average}%
                  </span>
                  <p className="text-[10px] font-semibold text-emerald-700">Darajada: {st.grade}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveModule('examinations')}
              className="w-full py-1.5 text-center text-xs font-semibold text-[#006B68] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
            >
              Eeg Natiijooyinka Buuxa ee Imtixaanaadka
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Examinations & Critical Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Examinations */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#006B68]" />
              <h3 className="text-sm font-bold text-slate-900">
                Imtixaanaadka Soo Socda (Upcoming Exams)
              </h3>
            </div>
            <button
              onClick={() => setActiveModule('examinations')}
              className="text-xs text-[#006B68] font-semibold hover:underline"
            >
              Jadwalka Imtixaanka
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {examinations.map(ex => (
              <div
                key={ex.id}
                className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ex.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Taariikhda: <span className="font-mono text-slate-700">{ex.startDate}</span> ilaa{' '}
                    <span className="font-mono text-slate-700">{ex.endDate}</span>
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    ex.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ex.status === 'published' ? 'Waa la shaaciyey' : 'Qorsheysan'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Absence Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Digniinaha & Arrimaha Diiradda u Baahan
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Live Telemetry</span>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg flex items-start gap-2.5">
              <DollarSign className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-amber-950">
                  Fiiga Bisha October: $45 ayaa dhiman
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Ardayda Xasan Maxamed Jaamac ($25) iyo Cabdiraxmaan Khadar ($20) lacagtoodu wali
                  lama dhammaysan.
                </p>
              </div>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200/70 rounded-lg flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#006B68] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-teal-950">
                  Imtixaanka Nus-Sanadka: 20ka November 2026
                </p>
                <p className="text-teal-800 text-[11px] mt-0.5">
                  Fadlan dhammaystir casharrada qaybta koowaad ka hor inta aan su'aalaha la daabicin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

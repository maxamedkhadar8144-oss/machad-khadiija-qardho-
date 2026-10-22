import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  Users,
  CalendarCheck,
  Award,
  DollarSign,
  Briefcase,
  Database,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    students,
    classes,
    teachers,
    employees,
    invoices,
    payments,
    expenses,
    payroll,
    attendance,
    exportDatabaseSQL,
    showToast,
  } = useApp();

  const [reportType, setReportType] = useState<
    'students' | 'fees' | 'attendance' | 'finance' | 'payroll'
  >('students');

  // Generic CSV exporter helper
  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${Date.now()}.csv`;
    link.click();
    showToast(`Warbixinta ${filename} CSV ahaan ayaa loo soo dejiyey`);
  };

  const handleExportCurrent = () => {
    if (reportType === 'students') {
      const headers = ['ID', 'Magaca', 'Jinsiga', 'Fasalka', 'Waalidka', 'Tel', 'Haraaga'];
      const rows = students.map(s => [
        s.studentId,
        s.fullName,
        s.gender,
        classes.find(c => c.id === s.classId)?.name || '',
        s.guardianName,
        s.guardianPhone,
        `$${s.balance}`,
      ]);
      exportCSV('diiwaanka_ardayda', headers, rows);
    } else if (reportType === 'fees') {
      const headers = ['Invoice No', 'Ardayga', 'Nooca', 'Cadadka', 'Bixiyey', 'Haraaga', 'Xaaladda'];
      const rows = invoices.map(i => {
        const std = students.find(s => s.id === i.studentId);
        return [
          i.invoiceNo,
          std?.fullName || '',
          i.category,
          `$${i.netAmount}`,
          `$${i.paidAmount}`,
          `$${i.balance}`,
          i.status,
        ];
      });
      exportCSV('warbixinta_fiiga', headers, rows);
    } else if (reportType === 'attendance') {
      const headers = ['Taariikhda', 'Ardayga', 'Fasalka', 'Xaaladda', 'Xusuus'];
      const rows = attendance.map(a => {
        const std = students.find(s => s.id === a.studentId);
        return [
          a.date,
          std?.fullName || '',
          classes.find(c => c.id === a.classId)?.name || '',
          a.status,
          a.remarks || '',
        ];
      });
      exportCSV('warbixinta_xaadiriska', headers, rows);
    } else if (reportType === 'finance') {
      const headers = ['Voucher No', 'Sharaxaadda', 'Qeybta', 'Cadadka', 'Habka', 'Taariikhda'];
      const rows = expenses.map(e => [
        e.voucherNo,
        e.title,
        e.category,
        `$${e.amount}`,
        e.paymentMethod,
        e.date,
      ]);
      exportCSV('warbixinta_kharashaadka', headers, rows);
    } else if (reportType === 'payroll') {
      const headers = ['Bisha', 'Shaqaalaha', 'Mushaharka Asalka', 'Gunno', 'Jarid', 'Saafiga', 'Xaaladda'];
      const rows = payroll.map(p => {
        const emp = employees.find(e => e.id === p.employeeId);
        return [
          p.monthYear,
          emp?.fullName || '',
          `$${p.baseSalary}`,
          `+$${p.allowances}`,
          `-$${p.deductions}`,
          `$${p.netSalary}`,
          p.status,
        ];
      });
      exportCSV('warbixinta_mushahaarka', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Xarunta Warbixinnada & Soodejinta (Reports & Exports)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Soo saarista warbixinnada ardayda, maaliyadda, xaadiriska, mushaharka iyo soo dejinta SQL
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Daabac Warbixinta</span>
          </button>

          <button
            onClick={handleExportCurrent}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Soo deji CSV</span>
          </button>

          <button
            onClick={exportDatabaseSQL}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Soo deji MySQL Database (.sql)</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'students', label: 'Warbixinta Ardayda' },
          { id: 'fees', label: 'Warbixinta Fiiga & Daynta' },
          { id: 'attendance', label: 'Warbixinta Xaadiriska' },
          { id: 'finance', label: 'Warbixinta Kharashaadka' },
          { id: 'payroll', label: 'Warbixinta Mushaharka' },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id as typeof reportType)}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              reportType === r.id
                ? 'bg-[#006B68] text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Active Report View Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {reportType === 'students' && 'Warbixinta Guud ee Ardayda Diiwaangashan'}
              {reportType === 'fees' && 'Warbixinta Biilasha, Bixinta Fiiga iyo Daynta'}
              {reportType === 'attendance' && 'Diiwaanka Xaadiriska ee Maanta & Bisha'}
              {reportType === 'finance' && 'Xisaab-xirka Kharashaadka Xarunta'}
              {reportType === 'payroll' && 'Diiwaanka Mushahaarka Shaqaalaha'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Machadka Khadiija Bintu Khuwaylid – Qardho · Sanad Dugsiyeedka 2026–2027
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Tirada Safafka: {students.length}
          </span>
        </div>

        {/* Dynamic Table based on report type */}
        <div className="overflow-x-auto">
          {reportType === 'students' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Magaca Ardayga</th>
                  <th className="py-2.5 px-3">Fasalka</th>
                  <th className="py-2.5 px-3">Waalidka</th>
                  <th className="py-2.5 px-3">Telefoonka</th>
                  <th className="py-2.5 px-3 text-right">Haraaga Fiiga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="py-2 px-3 font-mono font-bold text-[#006B68]">{s.studentId}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="py-2 px-3">{classes.find(c => c.id === s.classId)?.name}</td>
                    <td className="py-2 px-3">{s.guardianName}</td>
                    <td className="py-2 px-3 font-mono">{s.guardianPhone}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-700">
                      ${s.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'fees' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Invoice No</th>
                  <th className="py-2.5 px-3">Ardayga</th>
                  <th className="py-2.5 px-3">Nooca</th>
                  <th className="py-2.5 px-3 text-right">Lacagta</th>
                  <th className="py-2.5 px-3 text-right">Bixiyey</th>
                  <th className="py-2.5 px-3 text-right">Haraaga</th>
                  <th className="py-2.5 px-3">Xaaladda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => {
                  const std = students.find(s => s.id === inv.studentId);
                  return (
                    <tr key={inv.id}>
                      <td className="py-2 px-3 font-mono font-bold text-[#006B68]">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {std?.fullName || 'Arday'}
                      </td>
                      <td className="py-2 px-3">{inv.category}</td>
                      <td className="py-2 px-3 text-right font-mono">${inv.netAmount}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700 font-bold">
                        ${inv.paidAmount}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-amber-700 font-bold">
                        ${inv.balance}
                      </td>
                      <td className="py-2 px-3 font-semibold">{inv.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

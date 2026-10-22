import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  Printer,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee, LeaveRequest, PayrollRecord } from '../types';

export const HRManagementView: React.FC = () => {
  const {
    employees,
    payroll,
    leaveRequests,
    addEmployee,
    submitLeaveRequest,
    updateLeaveStatus,
    payEmployeeSalary,
    hasPermission,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leaves'>('employees');
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [viewingPayslip, setViewingPayslip] = useState<PayrollRecord | null>(null);

  // New Employee Form
  const [empForm, setEmpForm] = useState({
    employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
    fullName: '',
    gender: 'Male' as Employee['gender'],
    department: 'Administration' as Employee['department'],
    roleTitle: '',
    phone: '+252 90 ',
    email: '',
    baseSalary: 450,
    contractType: 'Permanent' as Employee['contractType'],
    joinDate: '2026-09-01',
    emergencyContact: '+252 90 ',
  });

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    employeeId: employees[0]?.id || '',
    leaveType: 'Sick Leave' as LeaveRequest['leaveType'],
    startDate: '2026-10-25',
    endDate: '2026-10-27',
    reason: 'Sababo caafimaad',
  });

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.fullName.trim()) return;

    addEmployee({
      ...empForm,
      status: 'active',
    });
    setIsEmployeeModalOpen(false);
  };

  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest(leaveForm);
    setIsLeaveModalOpen(false);
  };

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.baseSalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Kheyraadka Dadka & Mushahaarka (HRP & Payroll)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diiwaanka shaqaalaha, qandaraasyada, codsiyada fasaxa, iyo bixinta mushaharka bilaha
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasPermission('hr', 'create') && (
            <>
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Codsi Fasax (Leave)
              </button>
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Kudar Shaqaale Cusub</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 uppercase">Wadarta Shaqaalaha</span>
          <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">
            {employees.length} shaqaale
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Maamul, macallimiin, iyo taageero</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 uppercase">Miisaaniyadda Mushaharka / Bishii</span>
          <div className="text-2xl font-black text-[#006B68] tabular-nums mt-1">
            ${totalMonthlyPayroll}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total base payroll budget</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 uppercase">Codsiyada Fasaxa</span>
          <div className="text-2xl font-black text-amber-600 tabular-nums mt-1">
            {leaveRequests.filter(l => l.status === 'pending').length} sugaya
          </div>
          <p className="text-[11px] text-slate-400 mt-1">U baahan ansixin maamulka</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'employees' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Liiska Shaqaalaha ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'payroll' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mushaharka (Payroll Sheets)
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'leaves' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fasaxyada ({leaveRequests.length})
        </button>
      </div>

      {/* EMPLOYEES TAB */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div
              key={emp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-[#006B68] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#006B68] bg-teal-50 px-1.5 py-0.5 rounded">
                      {emp.employeeId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-tight">
                      {emp.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">{emp.roleTitle}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                    {emp.department}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Mushaharka: <strong className="font-mono font-bold">${emp.baseSalary}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Qandaraaska: {emp.contractType}</span>
                <span className="font-mono">{emp.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYROLL TAB */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Xaashida Bixinta Mushaharka (Payroll Sheet) – October 2026
              </h3>
              <p className="text-xs text-slate-500">
                Xisaabinta gunnooyinka, jarka, iyo soo saarista payslip-ka shaqaalaha
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Daabac Xaashida Guud</span>
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Shaqaalaha</th>
                <th className="py-3 px-4 text-right">Mushaharka Asalka</th>
                <th className="py-3 px-4 text-right">Gunno (Allowances)</th>
                <th className="py-3 px-4 text-right">Jarid (Deductions)</th>
                <th className="py-3 px-4 text-right">Mushaharka Saafiga</th>
                <th className="py-3 px-4">Xaaladda</th>
                <th className="py-3 px-4 text-center">Ficil / Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payroll.map(pr => {
                const emp = employees.find(e => e.id === pr.employeeId);
                return (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{emp?.fullName || 'Shaqaale'}</p>
                      <p className="text-[10px] text-slate-400">{emp?.roleTitle}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">${pr.baseSalary}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 tabular-nums">
                      +${pr.allowances}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-red-600 tabular-nums">
                      -${pr.deductions}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${pr.netSalary}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pr.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pr.status === 'paid' ? 'Waa la bixiyey' : 'Wuu dhiman yahay'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {pr.status !== 'paid' && (
                          <button
                            onClick={() => payEmployeeSalary(pr.id)}
                            className="px-2.5 py-1 bg-[#006B68] text-white text-[11px] font-bold rounded"
                          >
                            Bixi
                          </button>
                        )}
                        <button
                          onClick={() => setViewingPayslip(pr)}
                          className="p-1 text-slate-600 hover:text-[#006B68] rounded"
                          title="Daabac Payslip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAVES TAB */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Codsiyada Fasaxa Shaqaalaha (Leave Requests)
              </h3>
              <p className="text-xs text-slate-500">
                Ogolaanshaha ama diidmada fasaxyada caafimaadka iyo shakhsiga ah
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Shaqaalaha</th>
                <th className="py-3 px-4">Nooca Fasaxa</th>
                <th className="py-3 px-4">Wakhtiga</th>
                <th className="py-3 px-4">Sababta</th>
                <th className="py-3 px-4">Xaaladda</th>
                <th className="py-3 px-4 text-center">Go'aanka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map(lv => {
                const emp = employees.find(e => e.id === lv.employeeId);
                return (
                  <tr key={lv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {emp?.fullName || 'Shaqaale'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{lv.leaveType}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {lv.startDate} ilaa {lv.endDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lv.reason}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lv.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lv.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {lv.status === 'pending' && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateLeaveStatus(lv.id, 'approved')}
                            className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded"
                            title="Oggolow"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(lv.id, 'rejected')}
                            className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                            title="Diid"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* NEW EMPLOYEE MODAL */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Diiwaangeli Shaqaale Cusub</h3>
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.employeeId}
                    onChange={e => setEmpForm({ ...empForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mushaharka ($/Bishii)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={empForm.baseSalary}
                    onChange={e =>
                      setEmpForm({ ...empForm, baseSalary: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Magaca Buuxa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Magaca shaqaalaha"
                  value={empForm.fullName}
                  onChange={e => setEmpForm({ ...empForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waaxda (Department)
                  </label>
                  <select
                    value={empForm.department}
                    onChange={e =>
                      setEmpForm({
                        ...empForm,
                        department: e.target.value as Employee['department'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Finance">Finance</option>
                    <option value="Support">Support</option>
                    <option value="IT">IT</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Magaca Shaqada (Role)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madaxa Maktabadda"
                    value={empForm.roleTitle}
                    onChange={e => setEmpForm({ ...empForm, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefoonka</label>
                  <input
                    type="text"
                    required
                    value={empForm.phone}
                    onChange={e => setEmpForm({ ...empForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={empForm.email}
                    onChange={e => setEmpForm({ ...empForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Shaqaalaha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE REQUEST MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Gudbi Codsi Fasax (Leave Request)</h3>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shaqaalaha</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={e => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.roleTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nooca Fasaxa
                </label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e =>
                    setLeaveForm({
                      ...leaveForm,
                      leaveType: e.target.value as LeaveRequest['leaveType'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="Sick Leave">Sick Leave (Fasax Caafimaad)</option>
                  <option value="Annual Leave">Annual Leave (Fasaxa Sanadka)</option>
                  <option value="Emergency Leave">Emergency Leave (Xaalad Degdeg)</option>
                  <option value="Maternity/Paternity">Maternity/Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bilaabashada
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dhammaadka
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sababta</label>
                <textarea
                  rows={3}
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  placeholder="Qor faahfaahinta codsigaaga..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Gudbi Codsiga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PAYSLIP MODAL */}
      {viewingPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Warqadda Mushaharka (Payslip)</h3>
              <button
                onClick={() => setViewingPayslip(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              id="official-payslip"
              className="p-6 bg-slate-50 rounded-xl border border-slate-300 space-y-4 text-xs font-sans"
            >
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-base font-black text-[#006B68]">
                  MACHADKA KHADIIJA BINTU KHUWAYLID – QARDHO
                </h2>
                <p className="text-[11px] text-slate-500">Bisha: {viewingPayslip.monthYear}</p>
              </div>

              <div className="space-y-1.5">
                {(() => {
                  const emp = employees.find(e => e.id === viewingPayslip.employeeId);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Magaca:</span>
                        <strong className="text-slate-900">{emp?.fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Xilka:</span>
                        <strong className="text-slate-800">{emp?.roleTitle}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Waaxda:</span>
                        <strong className="text-slate-800">{emp?.department}</strong>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mushaharka Asalka:</span>
                  <span className="font-mono tabular-nums">${viewingPayslip.baseSalary}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Gunnooyinka (Allowances):</span>
                  <span className="font-mono tabular-nums">+${viewingPayslip.allowances}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>Jaridda (Deductions):</span>
                  <span className="font-mono tabular-nums">-${viewingPayslip.deductions}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#006B68]">
                  <span>MUSHAHARKA SAAFIGA AH:</span>
                  <span className="font-mono tabular-nums text-base">
                    ${viewingPayslip.netSalary}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
                <span>Maamulka Maaliyadda & Xisaabaadka</span>
                <span>Saxeex & Shaabad</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewingPayslip(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Xir
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Daabac Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Printer,
  Download,
  Calendar,
  X,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

export const FinanceView: React.FC = () => {
  const {
    payments,
    expenses,
    students,
    addExpense,
    deleteExpense,
    hasPermission,
    showToast,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'ledger'>('overview');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Utilities' as Expense['category'],
    amount: 50,
    paymentMethod: 'Cash' as Expense['paymentMethod'],
    date: '2026-10-22',
    approvedBy: currentUser.name,
    notes: '',
  });

  // Calculate totals
  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCash = totalIncome - totalExpense;

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || expenseForm.amount <= 0) {
      showToast('Fadlan geli magaca kharashka iyo cadadka saxda ah', 'error');
      return;
    }

    addExpense(expenseForm);
    setIsExpenseModalOpen(false);
  };

  // Group expenses by category
  const categoryBreakdown: { [cat: string]: number } = {};
  expenses.forEach(e => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Xisaabaadka & Maaliyadda Guud (Financial Accounts)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diiwaanka dakhliga, warqadaha bixinta kharashaadka, iyo xisaab-xirka guud ee xarunta
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('finance', 'create') && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Diiwaangeli Kharash Cusub</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Wadarta Dakhliga (Total Income)</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 tabular-nums mt-2">
            ${totalIncome}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lacagaha fiiga ee la qabtay</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Wadarta Kharashyada (Expenses)</span>
            <div className="p-1.5 rounded-md bg-red-50 text-red-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700 tabular-nums mt-2">${totalExpense}</div>
          <p className="text-[11px] text-slate-400 mt-1">Shidaal, dayactir, biyaha, qalab</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-teal-200 bg-teal-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-teal-800">
            <span>Dakhliga Saafiga ah (Net Balance)</span>
            <div className="p-1.5 rounded-md bg-teal-100 text-[#006B68]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#006B68] tabular-nums mt-2">${netCash}</div>
          <p className="text-[11px] text-teal-700 mt-1">Haraaga xisaabta xarunta</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guudmar & Qeybinta Kharashka
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'expenses' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Warqadaha Kharashka ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Diiwaanka Guud (Ledger)
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Category Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Qeybinta Kharashaadka (Expense Categories)
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([cat, amt]) => {
                const pct = Math.round((amt / totalExpense) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="font-mono text-slate-600">
                        ${amt} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006B68] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cash Flow Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Dhaqdhaqaaqa Lacagta (Cash Flow Summary)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Dakhliga Fiiga (Cash & EVC):</span>
                <strong className="font-mono text-emerald-800 font-bold">${totalIncome}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Shidaalka & Matoorka:</span>
                <strong className="font-mono text-red-700 font-bold">
                  ${categoryBreakdown['Fuel & Generator'] || 0}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Biyaha & Korontada:</span>
                <strong className="font-mono text-red-700 font-bold">
                  ${categoryBreakdown['Utilities'] || 0}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Qalabka Xafiisyada & Waxbarashada:</span>
                <strong className="font-mono text-red-700 font-bold">
                  ${categoryBreakdown['Educational Materials'] || 0}
                </strong>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex justify-between text-sm">
                <span className="font-bold text-teal-950">Baaqiga Saafiga ah:</span>
                <strong className="font-mono font-black text-xl text-[#006B68]">${netCash}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSES TABLE TAB */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Sharaxaadda Kharashka</th>
                <th className="py-3 px-4">Qeybta (Category)</th>
                <th className="py-3 px-4 text-right">Cadadka ($)</th>
                <th className="py-3 px-4">Habka Bixinta</th>
                <th className="py-3 px-4">Taariikhda</th>
                <th className="py-3 px-4">Oggolaaday</th>
                <th className="py-3 px-4 text-center">Ficil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#006B68]">{exp.voucherNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{exp.title}</td>
                  <td className="py-3 px-4 text-slate-600">{exp.category}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-red-600 tabular-nums">
                    ${exp.amount}
                  </td>
                  <td className="py-3 px-4">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{exp.date}</td>
                  <td className="py-3 px-4 text-slate-600">{exp.approvedBy}</td>
                  <td className="py-3 px-4 text-center">
                    {hasPermission('finance', 'delete') && (
                      <button
                        onClick={() => {
                          if (confirm(`Ma hubtaa inaad tirto kharashkan ${exp.voucherNo}?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Tir kharashka"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEDGER TAB */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Buugga Dhaqdhaqaaqa Guud (General Financial Ledger)
              </h3>
              <p className="text-xs text-slate-500">Dhammaan lacagaha soo galay iyo kuwa baxay</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Daabac Buugga Xisaabta</span>
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Taariikhda</th>
                <th className="py-3 px-4">Tixraaca</th>
                <th className="py-3 px-4">Sharaxaadda</th>
                <th className="py-3 px-4 text-right">Dakhli (Credit)</th>
                <th className="py-3 px-4 text-right">Kharash (Debit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => {
                const std = students.find(s => s.id === p.studentId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{p.date}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-800">
                      {p.receiptNo}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      Bixinta Fiiga – {std?.fullName}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      +${p.amount}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-400">—</td>
                  </tr>
                );
              })}
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono text-slate-500">{e.date}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-red-700">{e.voucherNo}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{e.title}</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">—</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-red-600 tabular-nums">
                    -${e.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEW EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Diiwaangeli Kharash Cusub</h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sharaxaadda Kharashka
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shidaalka Matoorka Layrka"
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qeybta</label>
                  <select
                    value={expenseForm.category}
                    onChange={e =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value as Expense['category'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Fuel & Generator">Fuel & Generator</option>
                    <option value="Utilities">Utilities (Biyaha/Korontada)</option>
                    <option value="Educational Materials">Educational Materials</option>
                    <option value="Maintenance">Maintenance (Dayactir)</option>
                    <option value="Salaries">Salaries (Mushaharooyin)</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cadadka ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={expenseForm.amount}
                    onChange={e =>
                      setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Habka Bixinta
                  </label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={e =>
                      setExpenseForm({
                        ...expenseForm,
                        paymentMethod: e.target.value as Expense['paymentMethod'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Cash">Cash (Caddaan)</option>
                    <option value="Mobile Money">Mobile Money (EVC)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taariikhda
                  </label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Kharashka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

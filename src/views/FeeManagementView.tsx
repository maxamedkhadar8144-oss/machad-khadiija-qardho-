import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  DollarSign,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Invoice, Payment, Student } from '../types';

export const FeeManagementView: React.FC = () => {
  const {
    students,
    invoices,
    payments,
    classes,
    createInvoice,
    recordPayment,
    cancelInvoice,
    hasPermission,
    showToast,
    currentUser,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'billing'>('invoices');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  // New Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: students[0]?.id || '',
    category: 'Tuition Fee' as Invoice['category'],
    amount: 30,
    discount: 0,
    dueDate: '2026-11-10',
    academicYear: '2026–2027',
    term: 'Term 1',
    notes: 'Fiiga Bisha November 2026',
  });

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 30,
    paymentMethod: 'EVC Plus / Mobile Money' as Payment['paymentMethod'],
    referenceNo: '',
    notes: 'Bixinta fiiga',
  });

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const student = students.find(s => s.id === inv.studentId);
      const matchSearch =
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        student?.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student?.studentId.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, students, search, statusFilter]);

  // Aggregate sums
  const totalBilled = invoices.reduce((sum, i) => sum + i.netAmount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = invoices
    .filter(i => i.status !== 'cancelled')
    .reduce((sum, i) => sum + i.balance, 0);

  // Handle open payment modal
  const handleOpenPay = (inv: Invoice) => {
    setSelectedInvoiceForPay(inv);
    setPaymentForm({
      amount: inv.balance,
      paymentMethod: 'EVC Plus / Mobile Money',
      referenceNo: `EVC-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Bixinta biilka ${inv.invoiceNo}`,
    });
    setIsPaymentModalOpen(true);
  };

  // Submit Payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;

    if (paymentForm.amount <= 0) {
      showToast('Fadlan geli lacag sax ah', 'error');
      return;
    }

    recordPayment({
      invoiceNo: selectedInvoiceForPay.invoiceNo,
      studentId: selectedInvoiceForPay.studentId,
      amount: paymentForm.amount,
      paymentMethod: paymentForm.paymentMethod,
      referenceNo: paymentForm.referenceNo || `REF-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      recordedBy: currentUser.name,
      notes: paymentForm.notes,
    });

    setIsPaymentModalOpen(false);
  };

  // Submit New Invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const net = Math.max(0, invoiceForm.amount - invoiceForm.discount);
    const invoiceNo = `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`;

    createInvoice({
      invoiceNo,
      studentId: invoiceForm.studentId,
      academicYear: invoiceForm.academicYear,
      term: invoiceForm.term,
      category: invoiceForm.category,
      amount: invoiceForm.amount,
      discount: invoiceForm.discount,
      netAmount: net,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: invoiceForm.dueDate,
      status: 'unpaid',
      notes: invoiceForm.notes,
    });

    setIsInvoiceModalOpen(false);
  };

  // Generate batch invoices for entire class
  const handleGenerateClassBatch = (classId: string, monthName: string) => {
    const classStds = students.filter(s => s.classId === classId && s.status === 'active');
    classStds.forEach((std, i) => {
      const invoiceNo = `INV-2026-${String(invoices.length + 1 + i).padStart(4, '0')}`;
      createInvoice({
        invoiceNo,
        studentId: std.id,
        academicYear: '2026–2027',
        term: 'Term 1',
        category: 'Tuition Fee',
        amount: 30,
        discount: 0,
        netAmount: 30,
        issueDate: new Date().toISOString().substring(0, 10),
        dueDate: '2026-11-10',
        status: 'unpaid',
        notes: `Fiiga Bisha ${monthName} 2026`,
      });
    });
    showToast(`Biilasha ${classStds.length} arday ayaa si wadar ah loo jaray!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Biilasha & Bixinta Fiiga (Fee Billing & Invoices)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jaridda biilasha ardayda, qabashada lacagaha, soo saarista rasiidada, iyo dabagalka daynta
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasPermission('fees', 'create') && (
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Jar Biil Cusub</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Wadarta La Biiliyey (Billed)</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">${totalBilled}</div>
          <p className="text-[11px] text-slate-400 mt-1">{invoices.length} biil oo la jaray</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span>Lacagta Soo Xarootay (Collected)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 tabular-nums mt-1">${totalPaid}</div>
          <p className="text-[11px] text-emerald-700 mt-1">{payments.length} lacag-bixin diiwaangashan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-800">
            <span>Daynta Dhiman (Outstanding)</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 tabular-nums mt-1">
            ${totalOutstanding}
          </div>
          <p className="text-[11px] text-amber-800 mt-1">Lacagta weli dhiman bishan</p>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Biilasha (Invoices)
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'payments' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rasiidadaha (Receipts)
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'billing' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jaridda Wadareed (Batch Billing)
          </button>
        </div>

        {/* Search & Status Filter */}
        {activeTab === 'invoices' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Raadi invoice, arday..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="all">Dhammaan Biilasha</option>
              <option value="unpaid">Aan Bixin (Unpaid)</option>
              <option value="partial">Qayb Bixiyey (Partial)</option>
              <option value="paid">Baxsan (Paid)</option>
            </select>
          </div>
        )}
      </div>

      {/* INVOICES TABLE TAB */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Ardayga (Student)</th>
                <th className="py-3 px-4">Fasalka</th>
                <th className="py-3 px-4">Nooca Fiiga</th>
                <th className="py-3 px-4 text-right">Lacagta</th>
                <th className="py-3 px-4 text-right">Bixiyey</th>
                <th className="py-3 px-4 text-right">Haraaga</th>
                <th className="py-3 px-4">Wakhtiga Ku Eg</th>
                <th className="py-3 px-4">Xaaladda</th>
                <th className="py-3 px-4 text-center">Ficilka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const std = students.find(s => s.id === inv.studentId);
                const cls = classes.find(c => c.id === std?.classId);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#006B68]">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{std?.fullName || 'Arday'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{std?.studentId}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{cls?.name || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      ${inv.netAmount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold tabular-nums">
                      ${inv.paidAmount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-700 font-black tabular-nums">
                      ${inv.balance}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'partial'
                            ? 'bg-blue-100 text-blue-800'
                            : inv.status === 'cancelled'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status === 'paid'
                          ? 'Baxsan'
                          : inv.status === 'partial'
                          ? 'Qayb'
                          : inv.status === 'cancelled'
                          ? 'Baabi’iyey'
                          : 'Aan bixin'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.balance > 0 && inv.status !== 'cancelled' && (
                          <button
                            onClick={() => handleOpenPay(inv)}
                            className="px-2.5 py-1 bg-[#006B68] hover:bg-[#005754] text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Qaado Lacagta
                          </button>
                        )}
                        {inv.status !== 'cancelled' && hasPermission('fees', 'delete') && (
                          <button
                            onClick={() => {
                              if (confirm(`Ma hubtaa inaad baabi'iso ${inv.invoiceNo}?`)) {
                                cancelInvoice(inv.id);
                              }
                            }}
                            title="Baabi'i Biilka"
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAYMENTS & RECEIPTS TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Diiwaanka Lacag-bixinta & Rasiidada (Payment Receipts)
              </h3>
              <p className="text-xs text-slate-500">Dhammaan lacagihii la qabtay iyo tixraacyadooda</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Ardayga</th>
                <th className="py-3 px-4">Invoice Tixraac</th>
                <th className="py-3 px-4 text-right">Lacagta</th>
                <th className="py-3 px-4">Habka Bixinta</th>
                <th className="py-3 px-4">Ref No</th>
                <th className="py-3 px-4">Taariikhda</th>
                <th className="py-3 px-4">Qabtay</th>
                <th className="py-3 px-4 text-center">Rasiid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => {
                const std = students.find(s => s.id === p.studentId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#006B68]">{p.receiptNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{std?.fullName || 'Arday'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.invoiceNo}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      ${p.amount}
                    </td>
                    <td className="py-3 px-4">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.referenceNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.date}</td>
                    <td className="py-3 px-4 text-slate-600">{p.recordedBy}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setViewingReceipt(p)}
                        className="p-1 text-slate-600 hover:text-[#006B68] hover:bg-teal-50 rounded"
                        title="Daabac Rasiidka"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* BATCH BILLING TAB */}
      {activeTab === 'billing' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-xl mx-auto shadow-2xs space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Jaridda Biilasha ee Fasallada (Batch Monthly Billing)
            </h3>
            <p className="text-xs text-slate-500">
              Si toos ah ugu jar biilasha bisha dhammaan ardayda fasal gaar ah ama dugsiga oo dhan
            </p>
          </div>

          <div className="space-y-3 pt-3">
            {classes.map(cls => {
              const enrolled = students.filter(s => s.classId === cls.id && s.status === 'active');
              return (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {enrolled.length} arday firfircoon · Fiiga bishii $30
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateClassBatch(cls.id, 'November')}
                    className="px-3 py-1.5 bg-[#006B68] hover:bg-[#005754] text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Jar Biilasha Bisha Nov
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Jar Biil Cusub</h3>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dooro Ardayga
                </label>
                <select
                  value={invoiceForm.studentId}
                  onChange={e => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nooca Fiiga (Category)
                </label>
                <select
                  value={invoiceForm.category}
                  onChange={e =>
                    setInvoiceForm({
                      ...invoiceForm,
                      category: e.target.value as Invoice['category'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="Tuition Fee">Tuition Fee (Fiiga Waxbarashada)</option>
                  <option value="Admission Fee">Admission Fee (Diiwaangelinta)</option>
                  <option value="Exam Fee">Exam Fee (Imtixaanka)</option>
                  <option value="Books & Uniform">Books & Uniform (Kutubta & Dareyska)</option>
                  <option value="Transport">Transport (Gaadiidka)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cadadka ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={invoiceForm.amount}
                    onChange={e =>
                      setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dhimis / Waiver ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={invoiceForm.discount}
                    onChange={e =>
                      setInvoiceForm({ ...invoiceForm, discount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taariikhda Bixintu ku Eg tahay
                </label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Jar Biilka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isPaymentModalOpen && selectedInvoiceForPay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Qabo Lacag Bixinta ({selectedInvoiceForPay.invoiceNo})
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs flex justify-between">
              <span>Haraaga Dhiman:</span>
              <span className="font-bold text-amber-700 font-mono">
                ${selectedInvoiceForPay.balance}
              </span>
            </div>

            <form onSubmit={handleSavePayment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cadadka La Bixinayo ($)
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoiceForPay.balance}
                  value={paymentForm.amount}
                  onChange={e =>
                    setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Habka Bixinta
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value as Payment['paymentMethod'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="EVC Plus / Mobile Money">EVC Plus / Sahal / Telesom</option>
                  <option value="Cash">Cash (Caddaan Xafiiska)</option>
                  <option value="Bank Transfer">Bank Transfer (Salaam / IBS / Dahabshiil)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tixraaca (Ref / Transaction ID)
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.referenceNo}
                  onChange={e => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Bixinta & Soo saar Rasiid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Rasiidka Bixinta Rasmiga ah</h3>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Receipt Box */}
            <div
              id="official-receipt"
              className="p-6 bg-slate-50/50 rounded-xl border border-slate-300 space-y-4 text-xs font-sans"
            >
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-base font-black text-[#006B68]">
                  MACHADKA KHADIIJA BINTU KHUWAYLID – QARDHO
                </h2>
                <p className="text-[11px] text-slate-500">Rasiidka Qabashada Lacagta Fiiga</p>
                <div className="flex justify-between items-center mt-3 text-[11px]">
                  <span className="font-mono font-bold text-[#006B68]">
                    No: {viewingReceipt.receiptNo}
                  </span>
                  <span className="font-mono text-slate-500">Taariikh: {viewingReceipt.date}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ardayga:</span>
                  <strong className="text-slate-900">
                    {students.find(s => s.id === viewingReceipt.studentId)?.fullName}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biilka Tixraaca:</span>
                  <strong className="font-mono text-slate-800">{viewingReceipt.invoiceNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Habka Bixinta:</span>
                  <strong className="text-slate-800">{viewingReceipt.paymentMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <strong className="font-mono text-slate-800">{viewingReceipt.referenceNo}</strong>
                </div>
              </div>

              <div className="py-2.5 px-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between text-sm">
                <span className="font-bold text-teal-950">WADARTA LA BIXIYEY:</span>
                <span className="font-mono font-black text-xl text-[#006B68]">
                  ${viewingReceipt.amount}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <span>Qasnajiga: {viewingReceipt.recordedBy}</span>
                <span>(Saxeex & Shaabad)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Xir
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Daabac Rasiidka</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

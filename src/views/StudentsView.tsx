import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  CreditCard,
  FileCheck,
  ArrowRightLeft,
  X,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    sections,
    attendance,
    invoices,
    payments,
    examResults,
    subjects,
    timetables,
    addStudent,
    updateStudent,
    deleteStudent,
    settings,
    hasPermission,
    showToast,
  } = useApp();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<
    'overview' | 'personal' | 'guardian' | 'attendance' | 'results' | 'fees' | 'timetable' | 'idcard' | 'certificate'
  >('overview');
  const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);
  const [targetClassId, setTargetClassId] = useState('');

  // Form State for Register / Edit
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '2014-01-01',
    phone: '',
    email: '',
    address: 'Xaafadda Daawad, Qardho',
    admissionDate: '2026-09-01',
    academicYear: '2026–2027',
    classId: 'cls-1',
    sectionId: 'sec-1',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Aabe (Father)',
    emergencyContact: '',
    previousSchool: '',
    medicalNotes: '',
    status: 'active' as Student['status'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: '',
  });

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch =
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.guardianName.toLowerCase().includes(search.toLowerCase());

      const matchClass = selectedClass === 'all' || s.classId === selectedClass;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;
      const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;

      return matchSearch && matchClass && matchGender && matchStatus;
    });
  }, [students, search, selectedClass, selectedGender, selectedStatus]);

  // Open Registration Modal with generated student code
  const handleOpenRegister = () => {
    const nextNum = students.length + 1;
    const generatedId = `MKB-2026-${String(nextNum).padStart(3, '0')}`;
    setFormData({
      studentId: generatedId,
      fullName: '',
      gender: 'Male',
      dob: '2014-05-10',
      phone: '+252 90 ',
      email: '',
      address: 'Xaafadda Horseed, Qardho',
      admissionDate: '2026-09-01',
      academicYear: '2026–2027',
      classId: classes[0]?.id || 'cls-1',
      sectionId: sections[0]?.id || 'sec-1',
      guardianName: '',
      guardianPhone: '+252 90 ',
      guardianRelation: 'Aabe (Father)',
      emergencyContact: '+252 90 ',
      previousSchool: '',
      medicalNotes: '',
      status: 'active',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      notes: '',
    });
    setEditingStudent(null);
    setIsRegisterOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      gender: student.gender,
      dob: student.dob,
      phone: student.phone,
      email: student.email,
      address: student.address,
      admissionDate: student.admissionDate,
      academicYear: student.academicYear,
      classId: student.classId,
      sectionId: student.sectionId,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianRelation: student.guardianRelation,
      emergencyContact: student.emergencyContact,
      previousSchool: student.previousSchool,
      medicalNotes: student.medicalNotes,
      status: student.status,
      photoUrl: student.photoUrl,
      notes: student.notes || '',
    });
    setIsRegisterOpen(true);
  };

  // Save Student (Create or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Fadlan geli magaca buuxa ee ardayga', 'error');
      return;
    }
    if (!formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      showToast('Fadlan geli xogta waalidka / mas’uulka', 'error');
      return;
    }

    // Check duplicate Student ID if creating
    if (!editingStudent) {
      const duplicate = students.some(
        s => s.studentId.trim().toLowerCase() === formData.studentId.trim().toLowerCase()
      );
      if (duplicate) {
        showToast('Lambarka ardayga (Student ID) hore ayuu u jiray!', 'error');
        return;
      }
      addStudent(formData);
    } else {
      updateStudent(editingStudent.id, formData);
    }

    setIsRegisterOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID Code',
      'Full Name',
      'Gender',
      'Class',
      'Guardian Name',
      'Guardian Phone',
      'Fee Balance',
      'Status',
    ];
    const rows = filteredStudents.map(s => [
      `"${s.studentId}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${classes.find(c => c.id === s.classId)?.name || ''}"`,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      `"$${s.balance}"`,
      `"${s.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ardayda_machadka_khadiija_${Date.now()}.csv`;
    link.click();
    showToast('Liiska ardayda CSV ahaan ayaa loo soo dejiyey');
  };

  // Transfer class
  const handleExecuteTransfer = () => {
    if (!transferringStudent || !targetClassId) return;
    updateStudent(transferringStudent.id, { classId: targetClassId });
    showToast(`Ardayga ${transferringStudent.fullName} waxa loo wareejiyey fasalka cusub.`);
    setTransferringStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Diiwaanka & Maamulka Ardayda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diiwaangelinta, xogta buuxda, kaararka aqoonsiga, iyo warbixinnada shakhsiga ah ee ardayda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Soo deji CSV</span>
          </button>

          {hasPermission('students', 'create') && (
            <button
              onClick={handleOpenRegister}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Diiwaangeli Arday Cusub</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ku raadi magac, ID (MKB-...), ama waalid..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006B68]"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">Dhammaan Fasallada</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">Wiil / Gabar (All)</option>
              <option value="Male">Wiilal (Male)</option>
              <option value="Female">Gabdho (Female)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">Xaaladda (Dhammaan)</option>
              <option value="active">Active (Dhiganaya)</option>
              <option value="graduated">Qalin-jebiyey</option>
              <option value="transferred">Wareegay</option>
              <option value="suspended">Joojiyey</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ardayga (Student)</th>
                <th className="py-3 px-4">ID Code</th>
                <th className="py-3 px-4">Fasalka</th>
                <th className="py-3 px-4">Waalidka & Tel</th>
                <th className="py-3 px-4 text-right">Haraaga Fiiga</th>
                <th className="py-3 px-4">Xaaladda</th>
                <th className="py-3 px-4 text-center">Ficillada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Wax arday ah laguma helin xulashadan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const studentClass = classes.find(c => c.id === student.classId);
                  return (
                    <tr key={student.id} className="hover:bg-teal-50/20 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photoUrl}
                            alt={student.fullName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {student.fullName}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {student.gender === 'Male' ? 'Wiil' : 'Gabar'} · {student.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ID Code */}
                      <td className="py-3 px-4 font-mono font-semibold text-[#006B68]">
                        {student.studentId}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">
                          {studentClass?.name || 'Lama qoondeyn'}
                        </span>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{student.guardianName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {student.guardianPhone} ({student.guardianRelation})
                        </p>
                      </td>

                      {/* Fee Balance */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {student.balance > 0 ? (
                          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            ${student.balance}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            Baxsan ($0)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            student.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status === 'active' ? 'Active' : student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Full Profile */}
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              setProfileTab('overview');
                            }}
                            title="Eeg xogta buuxda (Full Profile)"
                            className="p-1.5 text-slate-600 hover:text-[#006B68] hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick ID Card */}
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              setProfileTab('idcard');
                            }}
                            title="Daabac Kaarka Aqoonsiga (ID Card)"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          {/* Class Transfer */}
                          <button
                            onClick={() => {
                              setTransferringStudent(student);
                              setTargetClassId(student.classId);
                            }}
                            title="U wareeji fasal kale (Transfer Class)"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          {hasPermission('students', 'edit') && (
                            <button
                              onClick={() => handleOpenEdit(student)}
                              title="Wax ka beddel"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete/Archive */}
                          {hasPermission('students', 'delete') && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Ma hubtaa inaad ardayga ${student.fullName} ka saarto nidaamka?`
                                  )
                                ) {
                                  deleteStudent(student.id);
                                }
                              }}
                              title="Tir ardayga"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Wadarta Ardayda la helay: <strong>{filteredStudents.length}</strong>
          </span>
          <span className="font-mono text-slate-400">
            Machadka Khadiija Bintu Khuwaylid – Qardho
          </span>
        </div>
      </div>

      {/* REGISTRATION & EDIT MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingStudent ? 'Wax ka beddel Xogta Ardayga' : 'Diiwaangelinta Arday Cusub'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fadlan buuxi macluumaadka shakhsiga, waalidka iyo fasalka
                </p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Student ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Magaca Buuxa ee Ardayga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tusaale: Faadumo Axmed Cali"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006B68]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jinsiga (Gender)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e =>
                      setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Male">Wiil (Male)</option>
                    <option value="Female">Gabar (Female)</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taariikhda Dhalashada
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fasalka <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classId}
                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cinwaanka & Xaafadda Qardho
                  </label>
                  <input
                    type="text"
                    placeholder="Xaafadda Daawad, Qardho"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefoonka Ardayga
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Magaca Waalidka / Mas’uulka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Magaca aabaha ama hooyada"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Guardian Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tel Waalidka (EVC/Zaad) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                {/* Guardian Relationship */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xiriirka (Relation)
                  </label>
                  <select
                    value={formData.guardianRelation}
                    onChange={e => setFormData({ ...formData, guardianRelation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Aabe (Father)">Aabe (Father)</option>
                    <option value="Hooyo (Mother)">Hooyo (Mother)</option>
                    <option value="Adeer / Abti">Adeer / Abti</option>
                    <option value="Walaal">Walaal</option>
                  </select>
                </div>

                {/* Previous School */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dugsigiisii Hore (haddii uu jiro)
                  </label>
                  <input
                    type="text"
                    placeholder="Dugsiga Hoose ee..."
                    value={formData.previousSchool}
                    onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Medical Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xusuus Caafimaad (Medical Notes)
                  </label>
                  <input
                    type="text"
                    placeholder="Xasaasiyad, aragga oo daciif ah, iwm..."
                    value={formData.medicalNotes}
                    onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Keydi Waxka-beddelka' : 'Diiwaangeli Ardayga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASS TRANSFER MODAL */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">U wareeji Fasal Kale</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ardayga: <strong>{transferringStudent.fullName}</strong> ({transferringStudent.studentId})
            </p>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Dooro Fasalka Cusub
              </label>
              <select
                value={targetClassId}
                onChange={e => setTargetClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setTransferringStudent(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Ka noqo
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm"
              >
                Xaqiiji Wareejinta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE & CERTIFICATES MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl my-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <img
                  src={viewingStudent.photoUrl}
                  alt={viewingStudent.fullName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#006B68]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {viewingStudent.fullName}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-50 text-[#006B68] font-bold">
                      {viewingStudent.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {classes.find(c => c.id === viewingStudent.classId)?.name} · Sanad Dugsiyeedka{' '}
                    {viewingStudent.academicYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tab Buttons */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
              {[
                { id: 'overview', label: 'Guudmarka (Overview)' },
                { id: 'personal', label: 'Xogta Shakhsiga' },
                { id: 'guardian', label: 'Waalidka & Mas’uulka' },
                { id: 'attendance', label: 'Xaadiriska' },
                { id: 'results', label: 'Natiijooyinka' },
                { id: 'fees', label: 'Fiiga & Biilasha' },
                { id: 'idcard', label: 'Kaarka Aqoonsiga (ID)' },
                { id: 'certificate', label: 'Shahaadada Ardaynimada' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id as typeof profileTab)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    profileTab === tab.id
                      ? 'bg-[#006B68] text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-4 min-h-[280px]">
              {profileTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Xaaladda Fiiga</p>
                    <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                      ${viewingStudent.balance}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {viewingStudent.balance === 0
                        ? 'Dhammaan biilasha waa la bixiyey'
                        : 'Waxa ku dhiman lacag bishan'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Celceliska Imtixaanaadka</p>
                    <p className="text-xl font-bold text-[#006B68] mt-1 tabular-nums">
                      {(() => {
                        const marks = examResults.filter(r => r.studentId === viewingStudent.id);
                        if (marks.length === 0) return 'Lama gelin';
                        const avg = Math.round(
                          marks.reduce((sum, m) => sum + m.marksObtained, 0) / marks.length
                        );
                        return `${avg}%`;
                      })()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Imtixaanka Bisha 1aad</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Heerka Xaadiriska</p>
                    <p className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">
                      {(() => {
                        const recs = attendance.filter(a => a.studentId === viewingStudent.id);
                        if (recs.length === 0) return '100%';
                        const pres = recs.filter(r => r.status === 'present').length;
                        return `${Math.round((pres / recs.length) * 100)}%`;
                      })()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Xaadiriska diiwaangashan</p>
                  </div>

                  <div className="md:col-span-3 p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs">
                    <h4 className="font-bold text-teal-900 mb-1">Xusuus Qoraal (Notes)</h4>
                    <p className="text-teal-800">
                      {viewingStudent.notes || 'Wax qoraal ah oo gaar ah looma reebin ardaygan.'}
                    </p>
                  </div>
                </div>
              )}

              {profileTab === 'personal' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Jinsiga:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Taariikhda Dhalashada:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {viewingStudent.dob}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Taariikhda Gelitaanka:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {viewingStudent.admissionDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Cinwaanka:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Dugsiga Hore:</span>
                    <span className="font-semibold text-slate-800">
                      {viewingStudent.previousSchool || 'Machadka Khadiija'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Caafimaadka:</span>
                    <span className="font-semibold text-slate-800">
                      {viewingStudent.medicalNotes || 'Caafimaad qab'}
                    </span>
                  </div>
                </div>
              )}

              {profileTab === 'guardian' && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-400">Magaca Mas’uulka:</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {viewingStudent.guardianName}
                    </p>
                    <p className="text-slate-500 mt-2">Xiriirka: {viewingStudent.guardianRelation}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-400">Telefoonka:</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">
                      {viewingStudent.guardianPhone}
                    </p>
                    <p className="text-slate-500 mt-2">
                      Xiriirka Degdegga ah: {viewingStudent.emergencyContact || 'Waa isku mid'}
                    </p>
                  </div>
                </div>
              )}

              {profileTab === 'attendance' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">
                    Diiwaanka Xaadiriska ee {viewingStudent.fullName}
                  </h4>
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Taariikhda</th>
                        <th className="py-2 px-3">Xaaladda</th>
                        <th className="py-2 px-3">Faahfaahin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance
                        .filter(a => a.studentId === viewingStudent.id)
                        .map(rec => (
                          <tr key={rec.id}>
                            <td className="py-2 px-3 font-mono">{rec.date}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  rec.status === 'present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : rec.status === 'absent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-500">{rec.remarks || '—'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'results' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Natiijooyinka Imtixaanaadka</h4>
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Maaddada</th>
                        <th className="py-2 px-3">Buundada</th>
                        <th className="py-2 px-3">Darajada</th>
                        <th className="py-2 px-3">Xusuus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {examResults
                        .filter(r => r.studentId === viewingStudent.id)
                        .map(res => {
                          const sub = subjects.find(s => s.id === res.subjectId);
                          return (
                            <tr key={res.id}>
                              <td className="py-2 px-3 font-semibold text-slate-800">
                                {sub?.name || 'Maaddo'}
                              </td>
                              <td className="py-2 px-3 font-mono tabular-nums">
                                {res.marksObtained} / {res.maxMarks}
                              </td>
                              <td className="py-2 px-3 font-bold text-[#006B68]">{res.grade}</td>
                              <td className="py-2 px-3 text-slate-500">{res.remarks || '—'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'fees' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Biilasha & Rasiidadaha</h4>
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Invoice No</th>
                        <th className="py-2 px-3">Nooca</th>
                        <th className="py-2 px-3 text-right">Lacagta</th>
                        <th className="py-2 px-3 text-right">Bixiyey</th>
                        <th className="py-2 px-3 text-right">Haraaga</th>
                        <th className="py-2 px-3">Xaaladda</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices
                        .filter(i => i.studentId === viewingStudent.id)
                        .map(inv => (
                          <tr key={inv.id}>
                            <td className="py-2 px-3 font-mono font-semibold text-[#006B68]">
                              {inv.invoiceNo}
                            </td>
                            <td className="py-2 px-3">{inv.category}</td>
                            <td className="py-2 px-3 text-right font-mono">${inv.netAmount}</td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-700">
                              ${inv.paidAmount}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-amber-700 font-bold">
                              ${inv.balance}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  inv.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ID CARD GENERATOR / PREVIEW */}
              {profileTab === 'idcard' && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl space-y-4">
                  <div
                    id="student-id-card"
                    className="w-[340px] h-[210px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 relative flex flex-col justify-between"
                  >
                    {/* Top Institutional Bar */}
                    <div className="bg-[#006B68] text-white p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-400 text-teal-950 font-black flex items-center justify-center text-sm">
                          م
                        </div>
                        <div>
                          <p className="text-[10px] font-bold leading-none tracking-tight">
                            Machadka Khadiija Bintu Khuwaylid
                          </p>
                          <p className="text-[8px] text-teal-200">Qardho, Puntland – Somalia</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-teal-800 px-1.5 py-0.5 rounded">
                        2026–27
                      </span>
                    </div>

                    {/* Middle Card Details */}
                    <div className="px-4 py-2 flex items-center gap-4">
                      <img
                        src={viewingStudent.photoUrl}
                        alt={viewingStudent.fullName}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#006B68] shadow-sm shrink-0"
                      />
                      <div className="text-xs">
                        <p className="font-black text-slate-900 leading-tight">
                          {viewingStudent.fullName}
                        </p>
                        <p className="text-[11px] font-mono text-[#006B68] font-bold mt-0.5">
                          ID: {viewingStudent.studentId}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Fasalka:{' '}
                          <strong className="text-slate-800">
                            {classes.find(c => c.id === viewingStudent.classId)?.name}
                          </strong>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Waalidka: {viewingStudent.guardianPhone}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Strip */}
                    <div className="bg-[#FFA900] text-teal-950 px-4 py-1.5 flex items-center justify-between text-[9px] font-bold">
                      <span>STUDENT IDENTITY CARD</span>
                      <span className="font-mono">VALID UNTIL: JULY 2027</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Daabac Kaarka (Print ID Card)</span>
                  </button>
                </div>
              )}

              {/* ENROLLMENT CERTIFICATE */}
              {profileTab === 'certificate' && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl space-y-4">
                  <div
                    id="enrollment-certificate"
                    className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border-4 border-double border-[#006B68] text-center space-y-4"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-teal-950 font-black flex items-center justify-center text-xl">
                        م
                      </div>
                      <div>
                        <h2 className="text-base font-black text-[#006B68] uppercase tracking-wide">
                          Machadka Khadiija Bintu Khuwaylid – Qardho
                        </h2>
                        <p className="text-xs text-slate-500">
                          معهد خديجة بنت خويلد للتعليم الأساسي والثانوي
                        </p>
                      </div>
                    </div>

                    <div className="py-2 border-y border-amber-300">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                        SHAHAADADA CAYMISKA ARDAYNIMADA (ENROLLMENT CERTIFICATE)
                      </h3>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
                      Waxaa halkan lagu caddaynayaa in ardayga/ardayadda lagu magacaabo{' '}
                      <strong className="text-slate-950 font-bold underline">
                        {viewingStudent.fullName}
                      </strong>{' '}
                      ee wata lambarka aqoonsiga{' '}
                      <strong className="font-mono text-[#006B68]">
                        {viewingStudent.studentId}
                      </strong>{' '}
                      uu si rasmi ah uga tirsan yahay ardayda wax ka barata Machadka Khadiija Bintu
                      Khuwaylid ee magaalada Qardho, gaar ahaan{' '}
                      <strong>
                        {classes.find(c => c.id === viewingStudent.classId)?.name}
                      </strong>{' '}
                      sanad dugsiyeedka <strong>{viewingStudent.academicYear}</strong>.
                    </p>

                    <div className="pt-6 grid grid-cols-2 text-xs text-slate-600">
                      <div>
                        <p className="font-bold">Agaasimaha Waxbarashada</p>
                        <p className="text-[11px] text-slate-400 mt-6">
                          Saynab Maxamed Nuur (Saxeex & Shaabad)
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">Agaasimaha Guud</p>
                        <p className="text-[11px] text-slate-400 mt-6">
                          Sheekh Cabdulqaadir Xuseen (Saxeex)
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Daabac Shahaadada (Print Certificate)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

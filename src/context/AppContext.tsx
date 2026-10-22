import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Student,
  Teacher,
  Employee,
  ClassRoom,
  Section,
  Subject,
  AttendanceRecord,
  StaffAttendanceRecord,
  Examination,
  ExamResult,
  Invoice,
  Payment,
  Expense,
  PayrollRecord,
  LeaveRequest,
  TimetableSlot,
  InternalMessage,
  SupportTicket,
  SystemSettings,
  AuditLog,
} from '../types';
import {
  initialSettings,
  initialUsers,
  initialClasses,
  initialSections,
  initialSubjects,
  initialTeachers,
  initialEmployees,
  initialStudents,
  initialAttendance,
  initialStaffAttendance,
  initialExaminations,
  initialExamResults,
  initialInvoices,
  initialPayments,
  initialExpenses,
  initialPayroll,
  initialLeaveRequests,
  initialTimetable,
  initialMessages,
  initialSupportTickets,
  initialAuditLogs,
} from '../data/initialData';
import { generateMySQLScript } from '../utils/sqlGenerator';

interface AppContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentAcademicYear: string;
  setCurrentAcademicYear: (year: string) => void;

  // Data collections
  students: Student[];
  teachers: Teacher[];
  employees: Employee[];
  classes: ClassRoom[];
  sections: Section[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  staffAttendance: StaffAttendanceRecord[];
  examinations: Examination[];
  examResults: ExamResult[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  payroll: PayrollRecord[];
  leaveRequests: LeaveRequest[];
  timetables: TimetableSlot[];
  messages: InternalMessage[];
  tickets: SupportTicket[];
  auditLogs: AuditLog[];

  // Student actions
  addStudent: (student: Omit<Student, 'id' | 'balance'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Class & Academic actions
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, sub: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Teacher actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Attendance actions
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  markBulkAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Examination actions
  addExamination: (exam: Omit<Examination, 'id'>) => void;
  updateExamination: (id: string, exam: Partial<Examination>) => void;
  saveExamMarks: (results: Omit<ExamResult, 'id'>[]) => void;
  publishExam: (id: string) => void;

  // Billing & Finance actions
  createInvoice: (invoice: Omit<Invoice, 'id' | 'paidAmount' | 'balance'>) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'receiptNo'>) => void;
  cancelInvoice: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'voucherNo'>) => void;
  deleteExpense: (id: string) => void;

  // HR & Payroll actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  submitLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected') => void;
  payEmployeeSalary: (payrollId: string) => void;

  // Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => { success: boolean; conflictReason?: string };
  deleteTimetableSlot: (id: string) => void;

  // Messages & Tickets
  sendMessage: (msg: Omit<InternalMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNo' | 'createdAt' | 'messages' | 'status'>, initialMsg: string) => void;
  replyTicket: (ticketId: string, replyText: string) => void;
  resolveTicket: (ticketId: string) => void;

  // Utilities
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export') => boolean;
  exportDatabaseSQL: () => void;
  resetToDefaults: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; id: number } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'MKB_SMS_STORAGE_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  };

  const initial = loadInitialData();

  const [settings, setSettings] = useState<SystemSettings>(initial?.settings || initialSettings);
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [currentUser] = useState<User>(initialUsers[0]);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState<string>(settings.academicYear || '2026–2027');

  const [students, setStudents] = useState<Student[]>(initial?.students || initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initial?.teachers || initialTeachers);
  const [employees, setEmployees] = useState<Employee[]>(initial?.employees || initialEmployees);
  const [classes, setClasses] = useState<ClassRoom[]>(initial?.classes || initialClasses);
  const [sections, setSections] = useState<Section[]>(initial?.sections || initialSections);
  const [subjects, setSubjects] = useState<Subject[]>(initial?.subjects || initialSubjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initial?.attendance || initialAttendance);
  const [staffAttendance] = useState<StaffAttendanceRecord[]>(initial?.staffAttendance || initialStaffAttendance);
  const [examinations, setExaminations] = useState<Examination[]>(initial?.examinations || initialExaminations);
  const [examResults, setExamResults] = useState<ExamResult[]>(initial?.examResults || initialExamResults);
  const [invoices, setInvoices] = useState<Invoice[]>(initial?.invoices || initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initial?.payments || initialPayments);
  const [expenses, setExpenses] = useState<Expense[]>(initial?.expenses || initialExpenses);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initial?.payroll || initialPayroll);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initial?.leaveRequests || initialLeaveRequests);
  const [timetables, setTimetables] = useState<TimetableSlot[]>(initial?.timetables || initialTimetable);
  const [messages, setMessages] = useState<InternalMessage[]>(initial?.messages || initialMessages);
  const [tickets, setTickets] = useState<SupportTicket[]>(initial?.tickets || initialSupportTickets);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initial?.auditLogs || initialAuditLogs);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; id: number } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        settings,
        students,
        teachers,
        employees,
        classes,
        sections,
        subjects,
        attendance,
        examinations,
        examResults,
        invoices,
        payments,
        expenses,
        payroll,
        leaveRequests,
        timetables,
        messages,
        tickets,
        auditLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {
      // storage full or disabled
    }
  }, [
    settings,
    students,
    teachers,
    employees,
    classes,
    sections,
    subjects,
    attendance,
    examinations,
    examResults,
    invoices,
    payments,
    expenses,
    payroll,
    leaveRequests,
    timetables,
    messages,
    tickets,
    auditLogs,
  ]);

  const logAudit = (action: AuditLog['action'], module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      module,
      details,
      ipAddress: '192.168.1.10',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('UPDATE', 'Settings', 'Updated system preferences');
    showToast('Habaynta nidaamka si guul leh ayaa loo keydiyey');
  };

  // Role permissions checker
  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export'): boolean => {
    if (currentRole === 'Super Admin') return true;
    if (currentRole === 'Administrator') {
      if (module === 'settings' && action === 'delete') return false;
      return true;
    }
    if (currentRole === 'Academic Manager') {
      if (['dashboard', 'students', 'academics', 'teachers', 'attendance', 'examinations', 'timetable', 'performance', 'reports', 'messages', 'help', 'profile'].includes(module)) {
        return true;
      }
      return action === 'view';
    }
    if (currentRole === 'Accountant') {
      if (['dashboard', 'fees', 'finance', 'payroll', 'reports', 'messages', 'help', 'profile'].includes(module)) {
        return true;
      }
      return action === 'view';
    }
    if (currentRole === 'Teacher') {
      if (['dashboard', 'attendance', 'examinations', 'timetable', 'messages', 'help', 'profile'].includes(module)) {
        if (action === 'delete') return false;
        return true;
      }
      if (['students', 'academics'].includes(module)) {
        return action === 'view';
      }
      return false;
    }
    if (currentRole === 'HR Manager') {
      if (['dashboard', 'hr', 'payroll', 'teachers', 'messages', 'reports', 'help', 'profile'].includes(module)) {
        return true;
      }
      return action === 'view';
    }
    if (currentRole === 'Student' || currentRole === 'Parent') {
      if (['dashboard', 'timetable', 'attendance', 'examinations', 'fees', 'messages', 'help', 'profile'].includes(module)) {
        return action === 'view';
      }
      return false;
    }
    return action === 'view';
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'balance'>) => {
    const newId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      balance: 0,
    };
    setStudents(prev => [newStudent, ...prev]);
    logAudit('CREATE', 'Students', `Registered new student: ${newStudent.fullName} (${newStudent.studentId})`);
    showToast(`Arday cusub (${newStudent.fullName}) si guul ah ayaa loo diiwaangeliyey`);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updatedFields } : s)));
    logAudit('UPDATE', 'Students', `Updated student ID: ${id}`);
    showToast('Xogta ardayga waa la cusbooneysiiyey');
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    logAudit('DELETE', 'Students', `Archived/Removed student ID: ${id} (${target?.fullName || ''})`);
    showToast('Ardayga nidaamka waa laga tiray', 'info');
  };

  // Classes & Subjects
  const addClass = (clsData: Omit<ClassRoom, 'id'>) => {
    const newId = `cls-${Date.now()}`;
    const newClass: ClassRoom = { ...clsData, id: newId };
    setClasses(prev => [...prev, newClass]);
    // Create default Section A
    const secId = `sec-${Date.now()}`;
    setSections(prev => [...prev, { id: secId, classId: newId, name: 'A', room: newClass.roomNumber }]);
    logAudit('CREATE', 'Classes', `Added class: ${newClass.name}`);
    showToast(`Fasal cusub (${newClass.name}) ayaa lagu daray`);
  };

  const updateClass = (id: string, clsData: Partial<ClassRoom>) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...clsData } : c)));
    logAudit('UPDATE', 'Classes', `Updated class: ${id}`);
    showToast('Xogta fasalka waa la cusbooneysiiyey');
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    logAudit('DELETE', 'Classes', `Deleted class ID: ${id}`);
    showToast('Fasalka waa la tiray', 'info');
  };

  const addSubject = (subData: Omit<Subject, 'id'>) => {
    const newId = `sub-${Date.now()}`;
    const newSubject: Subject = { ...subData, id: newId };
    setSubjects(prev => [...prev, newSubject]);
    logAudit('CREATE', 'Academics', `Added subject: ${newSubject.name} (${newSubject.code})`);
    showToast(`Maaddo cusub (${newSubject.name}) ayaa lagu daray`);
  };

  const updateSubject = (id: string, subData: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...subData } : s)));
    logAudit('UPDATE', 'Academics', `Updated subject: ${id}`);
    showToast('Maaddada waa la cusbooneysiiyey');
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    logAudit('DELETE', 'Academics', `Deleted subject: ${id}`);
    showToast('Maaddada waa la tiray', 'info');
  };

  // Teachers
  const addTeacher = (tData: Omit<Teacher, 'id'>) => {
    const newId = `tch-${Date.now()}`;
    const newTeacher: Teacher = { ...tData, id: newId };
    setTeachers(prev => [newTeacher, ...prev]);
    logAudit('CREATE', 'Teachers', `Added teacher: ${newTeacher.fullName}`);
    showToast(`Macallin cusub (${newTeacher.fullName}) ayaa lagu daray`);
  };

  const updateTeacher = (id: string, tData: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...tData } : t)));
    logAudit('UPDATE', 'Teachers', `Updated teacher: ${id}`);
    showToast('Xogta macallinka waa la cusbooneysiiyey');
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    logAudit('DELETE', 'Teachers', `Deleted teacher: ${id}`);
    showToast('Macallinka waa laga saaray liiska', 'info');
  };

  // Attendance
  const markAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.date === rec.date && a.studentId === rec.studentId));
      return [{ ...rec, id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` }, ...filtered];
    });
  };

  const markBulkAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    setAttendance(prev => {
      const date = records[0]?.date;
      const classId = records[0]?.classId;
      // remove old records for this date and class
      const remaining = prev.filter(a => !(a.date === date && a.classId === classId));
      const newlyCreated: AttendanceRecord[] = records.map((r, i) => ({
        ...r,
        id: `att-${Date.now()}-${i}`,
      }));
      return [...newlyCreated, ...remaining];
    });
    logAudit('CREATE', 'Attendance', `Bulk marked attendance for date: ${records[0]?.date}`);
    showToast(`Xaadiriska ${records.length} arday si guul ah ayaa loo xareeyey`);
  };

  // Examination
  const addExamination = (examData: Omit<Examination, 'id'>) => {
    const newId = `exm-${Date.now()}`;
    const newExam: Examination = { ...examData, id: newId };
    setExaminations(prev => [newExam, ...prev]);
    logAudit('CREATE', 'Examinations', `Scheduled examination: ${newExam.name}`);
    showToast(`Imtixaan cusub (${newExam.name}) ayaa la qorsheeyey`);
  };

  const updateExamination = (id: string, examData: Partial<Examination>) => {
    setExaminations(prev => prev.map(e => (e.id === id ? { ...e, ...examData } : e)));
    logAudit('UPDATE', 'Examinations', `Updated examination: ${id}`);
    showToast('Xogta imtixaanka waa la cusbooneysiiyey');
  };

  const saveExamMarks = (results: Omit<ExamResult, 'id'>[]) => {
    setExamResults(prev => {
      const examId = results[0]?.examId;
      const subjectId = results[0]?.subjectId;
      const remaining = prev.filter(r => !(r.examId === examId && r.subjectId === subjectId));
      const newlyCreated: ExamResult[] = results.map((r, i) => ({
        ...r,
        id: `res-${Date.now()}-${i}`,
      }));
      return [...newlyCreated, ...remaining];
    });
    logAudit('UPDATE', 'Examinations', `Entered marks for exam: ${results[0]?.examId}`);
    showToast(`Buundooyinka ${results.length} arday ayaa la keydiyey`);
  };

  const publishExam = (id: string) => {
    setExaminations(prev => prev.map(e => (e.id === id ? { ...e, status: 'published' } : e)));
    logAudit('UPDATE', 'Examinations', `Published exam ID: ${id}`);
    showToast('Natiijada imtixaanka si rasmi ah ayaa loo shaaciyey (Published)');
  };

  // Invoices & Billing
  const createInvoice = (invData: Omit<Invoice, 'id' | 'paidAmount' | 'balance'>) => {
    const newId = `inv-${Date.now()}`;
    const newInvoice: Invoice = {
      ...invData,
      id: newId,
      paidAmount: 0,
      balance: invData.netAmount,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    // update student balance
    setStudents(prev =>
      prev.map(s => (s.id === invData.studentId ? { ...s, balance: s.balance + invData.netAmount } : s))
    );
    logAudit('CREATE', 'Fee Management', `Created invoice: ${newInvoice.invoiceNo} ($${newInvoice.netAmount})`);
    showToast(`Biil cusub (${newInvoice.invoiceNo}) oo dhan $${newInvoice.netAmount} ayaa la jaray`);
  };

  const recordPayment = (payData: Omit<Payment, 'id' | 'receiptNo'>) => {
    const newId = `pay-${Date.now()}`;
    const receiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: Payment = {
      ...payData,
      id: newId,
      receiptNo,
    };
    setPayments(prev => [newPayment, ...prev]);

    // allocate to invoice
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.invoiceNo === payData.invoiceNo) {
          const newPaid = inv.paidAmount + payData.amount;
          const newBal = Math.max(0, inv.netAmount - newPaid);
          const newStatus = newBal === 0 ? 'paid' : 'partial';
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBal,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    // deduct student balance
    setStudents(prev =>
      prev.map(s => {
        if (s.id === payData.studentId) {
          return { ...s, balance: Math.max(0, s.balance - payData.amount) };
        }
        return s;
      })
    );

    logAudit('PAYMENT', 'Fee Management', `Recorded payment receipt ${receiptNo}: $${payData.amount}`);
    showToast(`Lacag bixin ($${payData.amount}) ayaa la diiwaangeliyey. Rasiid: ${receiptNo}`);
  };

  const cancelInvoice = (id: string) => {
    const target = invoices.find(i => i.id === id);
    if (!target) return;
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status: 'cancelled' } : i)));
    setStudents(prev =>
      prev.map(s => (s.id === target.studentId ? { ...s, balance: Math.max(0, s.balance - target.balance) } : s))
    );
    logAudit('UPDATE', 'Fee Management', `Cancelled invoice ${target.invoiceNo}`);
    showToast(`Biilka ${target.invoiceNo} waa la baabi'iyey`, 'info');
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'voucherNo'>) => {
    const newId = `exp-${Date.now()}`;
    const voucherNo = `VCH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newExpense: Expense = {
      ...expData,
      id: newId,
      voucherNo,
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('CREATE', 'Finance', `Recorded expense voucher ${voucherNo}: $${expData.amount}`);
    showToast(`Kharash ($${expData.amount}) ayaa la diiwaangeliyey`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAudit('DELETE', 'Finance', `Removed expense ID: ${id}`);
    showToast('Kharashka waa la tiray', 'info');
  };

  // HR & Employees
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmp: Employee = { ...empData, id: newId };
    setEmployees(prev => [newEmp, ...prev]);
    logAudit('CREATE', 'HR', `Added employee: ${newEmp.fullName} (${newEmp.roleTitle})`);
    showToast(`Shaqaale cusub (${newEmp.fullName}) ayaa lagu daray`);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...empData } : e)));
    logAudit('UPDATE', 'HR', `Updated employee: ${id}`);
    showToast('Xogta shaqaalaha waa la cusbooneysiiyey');
  };

  const submitLeaveRequest = (leaveData: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newId = `lv-${Date.now()}`;
    const newLeave: LeaveRequest = { ...leaveData, id: newId, status: 'pending' };
    setLeaveRequests(prev => [newLeave, ...prev]);
    showToast('Codsiga fasaxa waa la gudbiyey');
  };

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(l => (l.id === id ? { ...l, status, approvedBy: currentUser.name } : l)));
    logAudit('UPDATE', 'HR', `Updated leave request ${id} to ${status}`);
    showToast(`Codsiga fasaxa waa la ${status === 'approved' ? 'ogolaaday' : 'diidey'}`);
  };

  const payEmployeeSalary = (payrollId: string) => {
    setPayroll(prev =>
      prev.map(p =>
        p.id === payrollId
          ? { ...p, status: 'paid', paymentDate: new Date().toISOString().substring(0, 10) }
          : p
      )
    );
    showToast('Mushaharka shaqaalaha waa la bixiyey');
  };

  // Timetable
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    // Check conflicts:
    // 1. Same teacher at same day and period
    const teacherConflict = timetables.find(
      t => t.day === slotData.day && t.period === slotData.period && t.teacherId === slotData.teacherId
    );
    if (teacherConflict) {
      return {
        success: false,
        conflictReason: `Macallinku hore ayuu fasal kale ugu qorsheysan yahay wakhtigan (${slotData.day}, Saacadda ${slotData.period})`,
      };
    }
    // 2. Same class at same day and period
    const classConflict = timetables.find(
      t => t.day === slotData.day && t.period === slotData.period && t.classId === slotData.classId
    );
    if (classConflict) {
      return {
        success: false,
        conflictReason: `Fasalkani hore ayuu xiisad ugu lahaa wakhtigan (${slotData.day}, Saacadda ${slotData.period})`,
      };
    }

    const newId = `tt-${Date.now()}`;
    setTimetables(prev => [...prev, { ...slotData, id: newId }]);
    logAudit('CREATE', 'Timetable', `Added schedule slot for Class ${slotData.classId} (${slotData.day})`);
    showToast('Xiisad cusub ayaa jadwalka lagu daray');
    return { success: true };
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
    showToast('Xiisadda jadwalka waa laga saaray', 'info');
  };

  // Messaging
  const sendMessage = (msgData: Omit<InternalMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newId = `msg-${Date.now()}`;
    const newMsg: InternalMessage = {
      ...msgData,
      id: newId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };
    setMessages(prev => [newMsg, ...prev]);
    logAudit('CREATE', 'Messages', `Sent message: ${newMsg.title}`);
    showToast('Farriinta si guul ah ayaa loo diray');
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, isRead: true } : m)));
  };

  // Support Tickets
  const createTicket = (
    tData: Omit<SupportTicket, 'id' | 'ticketNo' | 'createdAt' | 'messages' | 'status'>,
    initialMsg: string
  ) => {
    const newId = `tkt-${Date.now()}`;
    const ticketNo = `TCK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...tData,
      id: newId,
      ticketNo,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: `tm-${Date.now()}`,
          sender: tData.submittedBy,
          text: initialMsg,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Tikid cusub (${ticketNo}) ayaa la furay`);
  };

  const replyTicket = (ticketId: string, replyText: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newReplies = [
            ...t.messages,
            {
              id: `tm-${Date.now()}`,
              sender: currentUser.name,
              text: replyText,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ];
          return {
            ...t,
            status: t.status === 'open' ? 'in_progress' : t.status,
            messages: newReplies,
          };
        }
        return t;
      })
    );
    showToast('Jawaabta tikidka waa la gudbiyey');
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, status: 'resolved' } : t)));
    showToast('Tikidka xaaladdiisu waxay noqotay: Xalliyey (Resolved)');
  };

  // Export complete MySQL SQL
  const exportDatabaseSQL = () => {
    const sql = generateMySQLScript(
      settings,
      students,
      teachers,
      employees,
      classes,
      sections,
      subjects,
      invoices,
      payments,
      expenses,
      payroll
    );

    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `machadka_school_db_${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAudit('EXPORT', 'Database', 'Exported complete MySQL 8.0 schema and seed database');
    showToast('Faylka MySQL SQL Database si guul leh ayaa loo soo dejiyey!');
  };

  // Reset to initial seed data
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(initialSettings);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setEmployees(initialEmployees);
    setClasses(initialClasses);
    setSections(initialSections);
    setSubjects(initialSubjects);
    setAttendance(initialAttendance);
    setExaminations(initialExaminations);
    setExamResults(initialExamResults);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setPayroll(initialPayroll);
    setLeaveRequests(initialLeaveRequests);
    setTimetables(initialTimetable);
    setMessages(initialMessages);
    setTickets(initialSupportTickets);
    setAuditLogs(initialAuditLogs);
    showToast('Xogtii asalka ahayd ee Machadka dib ayaa loo soo celiyey');
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        currentUser,
        currentRole,
        setCurrentRole,
        activeModule,
        setActiveModule,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchTerm,
        setSearchTerm,
        currentAcademicYear,
        setCurrentAcademicYear,
        students,
        teachers,
        employees,
        classes,
        sections,
        subjects,
        attendance,
        staffAttendance,
        examinations,
        examResults,
        invoices,
        payments,
        expenses,
        payroll,
        leaveRequests,
        timetables,
        messages,
        tickets,
        auditLogs,
        addStudent,
        updateStudent,
        deleteStudent,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        markAttendance,
        markBulkAttendance,
        addExamination,
        updateExamination,
        saveExamMarks,
        publishExam,
        createInvoice,
        recordPayment,
        cancelInvoice,
        addExpense,
        deleteExpense,
        addEmployee,
        updateEmployee,
        submitLeaveRequest,
        updateLeaveStatus,
        payEmployeeSalary,
        addTimetableSlot,
        deleteTimetableSlot,
        sendMessage,
        markMessageRead,
        createTicket,
        replyTicket,
        resolveTicket,
        hasPermission,
        exportDatabaseSQL,
        resetToDefaults,
        showToast,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

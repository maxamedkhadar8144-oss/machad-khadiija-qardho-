export type UserRole =
  | 'Super Admin'
  | 'Administrator'
  | 'Academic Manager'
  | 'Accountant'
  | 'Teacher'
  | 'HR Manager'
  | 'Receptionist'
  | 'Student'
  | 'Parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. MKB-2026-001
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  email: string;
  address: string;
  admissionDate: string;
  academicYear: string;
  classId: string;
  sectionId: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  emergencyContact: string;
  previousSchool: string;
  medicalNotes: string;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  photoUrl: string;
  balance: number; // outstanding fee balance
  notes?: string;
}

export interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  employmentStatus: 'Full-time' | 'Part-time' | 'Contract';
  joinDate: string;
  assignedSubjectIds: string[];
  assignedClassIds: string[];
  photoUrl: string;
  salary: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  department: 'Administration' | 'Teaching' | 'Finance' | 'Support' | 'IT' | 'Security';
  roleTitle: string;
  phone: string;
  email: string;
  baseSalary: number;
  contractType: 'Permanent' | 'Probationary' | 'Contract';
  joinDate: string;
  status: 'active' | 'on_leave' | 'terminated';
  emergencyContact: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Fasalka 1aad"
  gradeLevel: number;
  classTeacherId: string;
  roomNumber: string;
  capacity: number;
}

export interface Section {
  id: string;
  classId: string;
  name: string; // e.g. "A", "B"
  room: string;
}

export interface Subject {
  id: string;
  code: string; // e.g. ARB-101
  name: string; // e.g. "Luuqadda Carabiga"
  classId: string;
  teacherId: string;
  creditHours: number;
  maxMarks: number;
  passMarks: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  classId: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
}

export interface StaffAttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface Examination {
  id: string;
  name: string; // e.g. "Imtixaanka Nus-Sanadka (Mid-Term)"
  academicYear: string;
  term: 'Term 1' | 'Term 2' | 'Final Term';
  startDate: string;
  endDate: string;
  classId: string;
  status: 'draft' | 'scheduled' | 'review' | 'published';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  status: 'present' | 'absent' | 'exempt';
  grade: string; // A+, A, B, C, D, F
  remarks?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string; // e.g. INV-2026-0042
  studentId: string;
  academicYear: string;
  term: string;
  category: 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Books & Uniform' | 'Transport';
  amount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'partial' | 'unpaid' | 'cancelled';
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNo: string; // e.g. RCP-2026-0089
  invoiceNo: string;
  studentId: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'EVC Plus / Mobile Money' | 'Cheque';
  referenceNo: string;
  date: string;
  recordedBy: string;
  notes?: string;
}

export interface Expense {
  id: string;
  voucherNo: string;
  title: string;
  category: 'Salaries' | 'Utilities' | 'Maintenance' | 'Educational Materials' | 'Fuel & Generator' | 'Rent' | 'Administrative';
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Mobile Money';
  date: string;
  approvedBy: string;
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  monthYear: string; // "October 2026"
  employeeId: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Maternity/Paternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

export interface TimetableSlot {
  id: string;
  classId: string;
  day: DayOfWeek;
  period: number; // 1 to 6
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientGroup: 'All' | 'Teachers' | 'Students' | 'Parents' | 'Staff' | 'Individual';
  recipientId?: string;
  recipientName?: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isAnnouncement: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  category: 'Academic' | 'Billing & Fees' | 'Portal Access' | 'Attendance' | 'Other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  submittedBy: string;
  userRole: UserRole;
  createdAt: string;
  assignedTo?: string;
  messages: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

export interface SystemSettings {
  institutionName: string;
  institutionArabicName: string;
  institutionTagline: string;
  location: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  currentTerm: string;
  currency: string;
  currencySymbol: string;
  primaryColor: string;
  secondaryColor: string;
  theme: 'light' | 'dark';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'PAYMENT' | 'EXPORT';
  module: string;
  details: string;
  ipAddress: string;
}

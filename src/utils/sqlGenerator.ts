import {
  Student,
  Teacher,
  Employee,
  ClassRoom,
  Section,
  Subject,
  Invoice,
  Payment,
  Expense,
  PayrollRecord,
  SystemSettings,
} from '../types';

export function generateMySQLScript(
  settings: SystemSettings,
  students: Student[],
  teachers: Teacher[],
  employees: Employee[],
  classes: ClassRoom[],
  sections: Section[],
  subjects: Subject[],
  invoices: Invoice[],
  payments: Payment[],
  expenses: Expense[],
  payroll: PayrollRecord[]
): string {
  return `-- ====================================================================
-- MACHADKA KHADIIJA BINTU KHUWAYLID – QARDHO
-- COMPLETE SCHOOL MANAGEMENT SYSTEM (SMS) RELATIONAL DATABASE
-- Target Engine: MySQL 8.0+ / MariaDB 10.4+ (Compatible with XAMPP)
-- Generated on: ${new Date().toISOString()}
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`machadka_school_db\`;
CREATE DATABASE \`machadka_school_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`machadka_school_db\`;

-- --------------------------------------------------------------------
-- 1. SYSTEM SETTINGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE \`system_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`institution_name\` VARCHAR(255) NOT NULL,
  \`institution_arabic\` VARCHAR(255),
  \`city\` VARCHAR(100) NOT NULL,
  \`region\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(50),
  \`email\` VARCHAR(100),
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`currency\` VARCHAR(10) DEFAULT 'USD',
  \`primary_color\` VARCHAR(20) DEFAULT '#006B68',
  \`secondary_color\` VARCHAR(20) DEFAULT '#FFA900',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO \`system_settings\` (\`institution_name\`, \`institution_arabic\`, \`city\`, \`region\`, \`phone\`, \`email\`, \`academic_year\`, \`currency\`)
VALUES ('${settings.institutionName.replace(/'/g, "''")}', '${settings.institutionArabicName.replace(/'/g, "''")}', '${settings.city}', '${settings.region}', '${settings.phone}', '${settings.email}', '${settings.academicYear}', '${settings.currency}');

-- --------------------------------------------------------------------
-- 2. USERS & ROLES
-- --------------------------------------------------------------------
CREATE TABLE \`roles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`role_name\` VARCHAR(50) NOT NULL UNIQUE,
  \`description\` VARCHAR(255)
) ENGINE=InnoDB;

INSERT INTO \`roles\` (\`role_name\`, \`description\`) VALUES
('Super Admin', 'Full administrative authority across all modules'),
('Administrator', 'Day-to-day administrative management'),
('Academic Manager', 'Curriculum, classes, exams and attendance supervision'),
('Accountant', 'Fee billing, collection, expenses, and financial reconciliation'),
('Teacher', 'Attendance marking, marks entry, and student oversight'),
('HR Manager', 'Employee management, attendance, leave, and payroll'),
('Receptionist', 'Visitor management, student inquiries, front desk'),
('Student', 'Portal view for timetable, attendance, marks, and invoices'),
('Parent', 'Portal view for student performance, attendance, and fee status');

CREATE TABLE \`users\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role_name\` VARCHAR(50) NOT NULL,
  \`phone\` VARCHAR(50),
  \`status\` ENUM('active', 'inactive') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO \`users\` (\`id\`, \`full_name\`, \`email\`, \`password_hash\`, \`role_name\`, \`phone\`) VALUES
('usr-1', 'Sheekh Cabdulqaadir Xuseen', 'admin@machadkakhadiija.edu.so', '$2y$12$e8VwM9z18rZq6iIeFq47K.N3s8J2oH5uK8M8v4m9v6w7w8x9y0z1a', 'Super Admin', '+252 90 779 1100'),
('usr-2', 'Saynab Maxamed Nuur', 'academic@machadkakhadiija.edu.so', '$2y$12$e8VwM9z18rZq6iIeFq47K.N3s8J2oH5uK8M8v4m9v6w7w8x9y0z1a', 'Academic Manager', '+252 90 779 1102'),
('usr-3', 'Jaamac Cali Shire', 'accountant@machadkakhadiija.edu.so', '$2y$12$e8VwM9z18rZq6iIeFq47K.N3s8J2oH5uK8M8v4m9v6w7w8x9y0z1a', 'Accountant', '+252 90 779 1103');

-- --------------------------------------------------------------------
-- 3. CLASSES & SECTIONS
-- --------------------------------------------------------------------
CREATE TABLE \`classes\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`grade_level\` INT NOT NULL,
  \`class_teacher_id\` VARCHAR(50),
  \`room_number\` VARCHAR(50),
  \`capacity\` INT DEFAULT 35
) ENGINE=InnoDB;

${classes.map(c => `INSERT INTO \`classes\` (\`id\`, \`name\`, \`grade_level\`, \`class_teacher_id\`, \`room_number\`, \`capacity\`) VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', ${c.gradeLevel}, '${c.classTeacherId}', '${c.roomNumber}', ${c.capacity});`).join('\n')}

CREATE TABLE \`sections\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`class_id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(50) NOT NULL,
  \`room\` VARCHAR(50),
  FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

${sections.map(s => `INSERT INTO \`sections\` (\`id\`, \`class_id\`, \`name\`, \`room\`) VALUES ('${s.id}', '${s.classId}', '${s.name}', '${s.room}');`).join('\n')}

-- --------------------------------------------------------------------
-- 4. TEACHERS & SUBJECTS
-- --------------------------------------------------------------------
CREATE TABLE \`teachers\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`teacher_id_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`gender\` ENUM('Male', 'Female') NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`qualification\` TEXT,
  \`specialization\` VARCHAR(150),
  \`employment_status\` VARCHAR(50) DEFAULT 'Full-time',
  \`salary\` DECIMAL(10,2) DEFAULT 0.00,
  \`join_date\` DATE
) ENGINE=InnoDB;

${teachers.map(t => `INSERT INTO \`teachers\` (\`id\`, \`teacher_id_code\`, \`full_name\`, \`gender\`, \`email\`, \`phone\`, \`qualification\`, \`specialization\`, \`salary\`, \`join_date\`) VALUES ('${t.id}', '${t.teacherId}', '${t.fullName.replace(/'/g, "''")}', '${t.gender}', '${t.email}', '${t.phone}', '${t.qualification.replace(/'/g, "''")}', '${t.specialization.replace(/'/g, "''")}', ${t.salary}, '${t.joinDate}');`).join('\n')}

CREATE TABLE \`subjects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`class_id\` VARCHAR(50) NOT NULL,
  \`teacher_id\` VARCHAR(50),
  \`credit_hours\` INT DEFAULT 3,
  \`max_marks\` INT DEFAULT 100,
  \`pass_marks\` INT DEFAULT 50,
  FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

${subjects.map(s => `INSERT INTO \`subjects\` (\`id\`, \`code\`, \`name\`, \`class_id\`, \`teacher_id\`, \`credit_hours\`, \`max_marks\`, \`pass_marks\`) VALUES ('${s.id}', '${s.code}', '${s.name.replace(/'/g, "''")}', '${s.classId}', '${s.teacherId}', ${s.creditHours}, ${s.maxMarks}, ${s.passMarks});`).join('\n')}

-- --------------------------------------------------------------------
-- 5. STUDENTS
-- --------------------------------------------------------------------
CREATE TABLE \`students\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`student_id_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`gender\` ENUM('Male', 'Female') NOT NULL,
  \`dob\` DATE,
  \`phone\` VARCHAR(50),
  \`email\` VARCHAR(150),
  \`address\` VARCHAR(255),
  \`admission_date\` DATE,
  \`academic_year\` VARCHAR(50),
  \`class_id\` VARCHAR(50),
  \`section_id\` VARCHAR(50),
  \`guardian_name\` VARCHAR(150) NOT NULL,
  \`guardian_phone\` VARCHAR(50) NOT NULL,
  \`guardian_relation\` VARCHAR(50),
  \`previous_school\` VARCHAR(150),
  \`medical_notes\` TEXT,
  \`status\` ENUM('active', 'graduated', 'transferred', 'suspended') DEFAULT 'active',
  \`balance\` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`section_id\`) REFERENCES \`sections\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

${students.map(std => `INSERT INTO \`students\` (\`id\`, \`student_id_code\`, \`full_name\`, \`gender\`, \`dob\`, \`phone\`, \`email\`, \`address\`, \`admission_date\`, \`academic_year\`, \`class_id\`, \`section_id\`, \`guardian_name\`, \`guardian_phone\`, \`guardian_relation\`, \`previous_school\`, \`medical_notes\`, \`status\`, \`balance\`) VALUES ('${std.id}', '${std.studentId}', '${std.fullName.replace(/'/g, "''")}', '${std.gender}', '${std.dob}', '${std.phone}', '${std.email}', '${std.address.replace(/'/g, "''")}', '${std.admissionDate}', '${std.academicYear}', '${std.classId}', '${std.sectionId}', '${std.guardianName.replace(/'/g, "''")}', '${std.guardianPhone}', '${std.guardianRelation.replace(/'/g, "''")}', '${std.previousSchool.replace(/'/g, "''")}', '${(std.medicalNotes || '').replace(/'/g, "''")}', '${std.status}', ${std.balance});`).join('\n')}

-- --------------------------------------------------------------------
-- 6. ATTENDANCE
-- --------------------------------------------------------------------
CREATE TABLE \`attendance\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`date\` DATE NOT NULL,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`class_id\` VARCHAR(50) NOT NULL,
  \`status\` ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  \`remarks\` VARCHAR(255),
  \`marked_by\` VARCHAR(50),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`uniq_att_date_student\` (\`date\`, \`student_id\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. EXAMINATIONS & MARKS
-- --------------------------------------------------------------------
CREATE TABLE \`examinations\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`academic_year\` VARCHAR(50) NOT NULL,
  \`term\` VARCHAR(50) NOT NULL,
  \`start_date\` DATE,
  \`end_date\` DATE,
  \`class_id\` VARCHAR(50),
  \`status\` ENUM('draft', 'scheduled', 'review', 'published') DEFAULT 'draft'
) ENGINE=InnoDB;

CREATE TABLE \`exam_results\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`exam_id\` VARCHAR(50) NOT NULL,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`subject_id\` VARCHAR(50) NOT NULL,
  \`marks_obtained\` DECIMAL(5,2) NOT NULL,
  \`max_marks\` DECIMAL(5,2) DEFAULT 100.00,
  \`grade\` VARCHAR(10),
  \`status\` ENUM('present', 'absent', 'exempt') DEFAULT 'present',
  FOREIGN KEY (\`exam_id\`) REFERENCES \`examinations\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 8. INVOICES & PAYMENTS
-- --------------------------------------------------------------------
CREATE TABLE \`invoices\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`invoice_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`academic_year\` VARCHAR(50) NOT NULL,
  \`term\` VARCHAR(50) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`discount\` DECIMAL(10,2) DEFAULT 0.00,
  \`net_amount\` DECIMAL(10,2) NOT NULL,
  \`paid_amount\` DECIMAL(10,2) DEFAULT 0.00,
  \`balance\` DECIMAL(10,2) NOT NULL,
  \`issue_date\` DATE NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`status\` ENUM('paid', 'partial', 'unpaid', 'cancelled') DEFAULT 'unpaid',
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

${invoices.map(i => `INSERT INTO \`invoices\` (\`id\`, \`invoice_no\`, \`student_id\`, \`academic_year\`, \`term\`, \`category\`, \`amount\`, \`discount\`, \`net_amount\`, \`paid_amount\`, \`balance\`, \`issue_date\`, \`due_date\`, \`status\`) VALUES ('${i.id}', '${i.invoiceNo}', '${i.studentId}', '${i.academicYear}', '${i.term}', '${i.category}', ${i.amount}, ${i.discount}, ${i.netAmount}, ${i.paidAmount}, ${i.balance}, '${i.issueDate}', '${i.dueDate}', '${i.status}');`).join('\n')}

CREATE TABLE \`payments\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`receipt_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`invoice_no\` VARCHAR(50) NOT NULL,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`reference_no\` VARCHAR(100),
  \`date\` DATE NOT NULL,
  \`recorded_by\` VARCHAR(150),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

${payments.map(p => `INSERT INTO \`payments\` (\`id\`, \`receipt_no\`, \`invoice_no\`, \`student_id\`, \`amount\`, \`payment_method\`, \`reference_no\`, \`date\`, \`recorded_by\`) VALUES ('${p.id}', '${p.receiptNo}', '${p.invoiceNo}', '${p.studentId}', ${p.amount}, '${p.paymentMethod}', '${p.referenceNo}', '${p.date}', '${p.recordedBy.replace(/'/g, "''")}');`).join('\n')}

-- --------------------------------------------------------------------
-- 9. EXPENSES & PAYROLL
-- --------------------------------------------------------------------
CREATE TABLE \`expenses\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`voucher_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`date\` DATE NOT NULL,
  \`approved_by\` VARCHAR(150)
) ENGINE=InnoDB;

${expenses.map(e => `INSERT INTO \`expenses\` (\`id\`, \`voucher_no\`, \`title\`, \`category\`, \`amount\`, \`payment_method\`, \`date\`, \`approved_by\`) VALUES ('${e.id}', '${e.voucherNo}', '${e.title.replace(/'/g, "''")}', '${e.category}', ${e.amount}, '${e.paymentMethod}', '${e.date}', '${e.approvedBy.replace(/'/g, "''")}');`).join('\n')}

CREATE TABLE \`employees\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`employee_id_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`gender\` ENUM('Male', 'Female') NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`role_title\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(50),
  \`email\` VARCHAR(150),
  \`base_salary\` DECIMAL(10,2) NOT NULL,
  \`contract_type\` VARCHAR(50) DEFAULT 'Permanent',
  \`join_date\` DATE,
  \`status\` ENUM('active', 'on_leave', 'terminated') DEFAULT 'active'
) ENGINE=InnoDB;

${employees.map(emp => `INSERT INTO \`employees\` (\`id\`, \`employee_id_code\`, \`full_name\`, \`gender\`, \`department\`, \`role_title\`, \`phone\`, \`email\`, \`base_salary\`, \`contract_type\`, \`join_date\`, \`status\`) VALUES ('${emp.id}', '${emp.employeeId}', '${emp.fullName.replace(/'/g, "''")}', '${emp.gender}', '${emp.department}', '${emp.roleTitle.replace(/'/g, "''")}', '${emp.phone}', '${emp.email}', ${emp.baseSalary}, '${emp.contractType}', '${emp.joinDate}', '${emp.status}');`).join('\n')}

CREATE TABLE \`payroll\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`month_year\` VARCHAR(50) NOT NULL,
  \`employee_id\` VARCHAR(50) NOT NULL,
  \`base_salary\` DECIMAL(10,2) NOT NULL,
  \`allowances\` DECIMAL(10,2) DEFAULT 0.00,
  \`deductions\` DECIMAL(10,2) DEFAULT 0.00,
  \`net_salary\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('paid', 'pending') DEFAULT 'pending',
  \`payment_date\` DATE,
  FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

${payroll.map(pr => `INSERT INTO \`payroll\` (\`id\`, \`month_year\`, \`employee_id\`, \`base_salary\`, \`allowances\`, \`deductions\`, \`net_salary\`, \`status\`, \`payment_date\`) VALUES ('${pr.id}', '${pr.monthYear}', '${pr.employeeId}', ${pr.baseSalary}, ${pr.allowances}, ${pr.deductions}, ${pr.netSalary}, '${pr.status}', ${pr.paymentDate ? `'${pr.paymentDate}'` : 'NULL'});`).join('\n')}

SET FOREIGN_KEY_CHECKS = 1;
-- ====================================================================
-- END OF SCHEMA & SEED SCRIPT
-- ====================================================================
`;
}

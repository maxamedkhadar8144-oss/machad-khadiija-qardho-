# Machadka Khadiija Bintu Khuwaylid – Qardho
## Complete School Management System (SMS) Web Application

A modern, production-oriented, centralized School Management System engineered specifically for **Machadka Khadiija Bintu Khuwaylid – Qardho** (Puntland, Somalia) for Academic Year **2026–2027**. Inspired by the administrative workflow and modular organization of SEC LMS, with institutional brand identity and complete database connectivity.

---

### Institutional Identity & Brand System

- **Institution Name:** Machadka Khadiija Bintu Khuwaylid – Qardho
- **Arabic Name:** معهد خديجة بنت خويلd للتعليم الأساسي والثانوي
- **Location:** Xaafadda Daawad, Wadada Laamiga, Qardho, Karkaar, Puntland, Somalia
- **Academic Year:** Configurable, initially **2026–2027**
- **Brand Colors:**
  - **Primary Deep Teal:** `#006B68` (Navigation, primary actions, active branding)
  - **Secondary Golden Yellow:** `#FFA900` (Highlights, emblems, secondary accents)
  - **White:** `#FFFFFF` (Cards, surfaces, certificates)
  - **Light Gray:** `#F5F7F7` (Canvas background)

---

### Core Functional Modules & Architecture

1. **Dashboard & Live Analytics:**
   - Real-time aggregated database statistics (Total students, Active, New admissions, Teachers, Staff, Classes, Today's attendance percentage, Monthly fee income, Outstanding student balances, Monthly expenses, Net cash balance).
   - Class enrollment distribution bars and capacity tracking.
   - Top-performing students leaderboard & at-risk student monitoring.
   - Upcoming examinations and actionable financial alerts.

2. **Student Management:**
   - Full CRUD: Register student, Edit, Archive/Delete with validation and duplicate ID check.
   - Comprehensive multi-tab profile: Overview, Personal Information, Guardian Information, Attendance records, Examination marks & grades, Fee balances & invoices.
   - **Student Identity Card Generator (ID Card):** Formatted, branded, print-ready student ID card.
   - **Enrollment Certificate Generator:** Official printable certificate with institutional headers and signature lines.
   - Class transfer workflow & CSV data export.

3. **Classes, Sections & Academics:**
   - Class configuration (Fasalka 1aad to 4aad), Section assignments, Room numbers, and Class Teachers.
   - Subject management with credit hours, max marks, and pass mark thresholds.
   - Student class promotion workflow (Batch advancement).

4. **Teacher Management:**
   - Teacher directory, qualification records, specializations, contact details.
   - Assigned subjects & classes with automated weekly workload hour calculation.
   - Teacher weekly schedule inspector.

5. **Attendance Management:**
   - Daily & Class-based attendance with status tracking: **Present (Jooga)**, **Absent (Maqan)**, **Late (Soo Daahay)**, **Excused (Fasaxan)**.
   - Bulk attendance marking with quick action buttons ("Mark All Present", "Mark All Absent").
   - Monthly attendance summaries and attendance percentage calculations.
   - Staff attendance tracking.

6. **Examinations & Results:**
   - Exam setup (Month 1 Assessment, Mid-Term, Final Term) by academic year and class.
   - Dynamic Marks Entry sheet with validation against maximum marks.
   - Automatic grading scale (A+, A, B+, B, C+, C, D, F) and pass/fail tagging.
   - Draft vs Published results workflow.
   - **Official Printable Report Card (Warqadda Natiijada):** Complete with institutional emblem, subject breakdown, overall result, and signature lines.

7. **Fee Billing & Student Invoices:**
   - Fee structures: Tuition fee, Admission, Examination, Books & Uniform, Transport.
   - Batch monthly invoice generation for entire classes.
   - Recording full or partial payments with automatic allocation to invoices.
   - **Official Printable Payment Receipt (Rasiid):** Includes unique receipt number, transaction reference (EVC Plus, Salaam Bank, Cash), date, and cashier signature.
   - Overdue balance tracking and discount/waiver records.

8. **Financial Management & Accounts:**
   - Revenue vs Expense tracking, Daily collection ledger, and net income reconciliation.
   - Expense vouchers with category breakdowns (Fuel & Generator, Utilities, Educational Materials, Maintenance, Administrative).
   - General financial ledger with printable statements.

9. **Human Resource Management (HRP) & Payroll:**
   - Employee records across departments (Administration, Teaching, Finance, Support, IT, Security).
   - Staff leave requests with approval/rejection decision workflow.
   - Monthly payroll generation with printable **Payslips**.

10. **Timetable Scheduling:**
    - Weekly schedule grid (Saturday through Thursday, Periods 1 to 5).
    - Class timetable and Teacher timetable views.
    - **Automated Conflict Detection:** Prevents teacher double-booking, classroom double-booking, and overlapping lessons.
    - Printable weekly timetable.

11. **Internal Messaging & Notification Center:**
    - Direct communication and school announcements for Teachers, Students, Parents, and Staff.
    - Unread indicator badges and priority flags (Normal, High, Urgent).

12. **Central Reports & Exports:**
    - Instant CSV export and formatted printable sheets for Student directories, Fee collections, Attendance, and Financial vouchers.
    - One-click MySQL 8.0 schema and seed database generator (`machadka_school_db.sql`).

13. **Settings Center & Security:**
    - General institution preferences, brand colors, academic year, and currency.
    - **Role-Based Access Control (RBAC):** Real permission enforcement across 9 roles:
      1. Super Admin
      2. Administrator
      3. Academic Manager
      4. Accountant
      5. Teacher
      6. HR Manager
      7. Receptionist
      8. Student
      9. Parent
    - **Audit Log Viewer:** Full audit trail tracking user, action (CREATE, UPDATE, DELETE, PAYMENT, LOGIN, EXPORT), module, timestamp, and IP address.

14. **Help Center & Support Desk:**
    - Frequently Asked Questions (FAQs) and searchable knowledge base.
    - Real Support Ticket creation, assignment, message replies, and resolution workflow.

---

### Local Development on Windows with XAMPP

1. **Install XAMPP:**
   - Download and install XAMPP with PHP 8.2+ and MySQL from [apachefriends.org](https://www.apachefriends.org/).
   - Open the **XAMPP Control Panel** and start **Apache** and **MySQL**.

2. **Import MySQL Database:**
   - Open `http://localhost/phpmyadmin` in your web browser.
   - In the application top navigation bar, click the **MySQL Schema (.sql)** button (or go to **Settings -> Kaydinta & XAMPP MySQL**).
   - In phpMyAdmin, click **Import** tab, choose the downloaded `machadka_school_db.sql` file, and click **Import**.
   - The script creates the database `machadka_school_db`, creates all relational tables with foreign keys and indexes, and seeds complete initial data.

3. **Default Administrative Accounts:**
   - **Super Admin:** `admin@machadkakhadiija.edu.so` / Password: `AdminPassword2026!`
   - **Academic Manager:** `academic@machadkakhadiija.edu.so`
   - **Accountant:** `accountant@machadkakhadiija.edu.so`

---

### Production Deployment Notes

- **Database Engine:** MySQL 8.0+ or MariaDB 10.4+ with `utf8mb4` character set.
- **Environment:** Run `npm run build` to generate optimized production assets in `/dist`.
- **Security:** In production, enforce HTTPS, configure CORS, and rotate default administrative passwords upon first login.

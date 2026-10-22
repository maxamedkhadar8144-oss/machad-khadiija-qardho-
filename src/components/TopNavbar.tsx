import React, { useState } from 'react';
import {
  Search,
  Bell,
  Download,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const TopNavbar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    currentRole,
    setCurrentRole,
    sidebarCollapsed,
    setSidebarCollapsed,
    searchTerm,
    setSearchTerm,
    currentAcademicYear,
    setCurrentAcademicYear,
    messages,
    invoices,
    exportDatabaseSQL,
    currentUser,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const rolesList: UserRole[] = [
    'Super Admin',
    'Administrator',
    'Academic Manager',
    'Accountant',
    'Teacher',
    'HR Manager',
    'Receptionist',
    'Student',
    'Parent',
  ];

  const unreadMessages = messages.filter(m => !m.isRead);
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');

  const getModuleTitle = (mod: string) => {
    switch (mod) {
      case 'dashboard':
        return 'Xarunta Guud (Dashboard)';
      case 'students':
        return 'Maamulka Ardayda (Student Management)';
      case 'academics':
        return 'Fasallada & Maaddooyinka (Academic Management)';
      case 'teachers':
        return 'Maamulka Macallimiinta (Teacher Management)';
      case 'attendance':
        return 'Xaadiriska Ardayda & Shaqaalaha (Attendance)';
      case 'examinations':
        return 'Imtixaanaadka & Natiijooyinka (Examinations)';
      case 'performance':
        return 'Qiimeynta Waxbarashada (Performance Analytics)';
      case 'fees':
        return 'Biilasha & Bixinta Fiiga (Fee Billing & Invoices)';
      case 'finance':
        return 'Xisaabaadka & Kharashaadka (Financial Accounts)';
      case 'hr':
        return 'Kheyraadka Dadka & Mushahaarka (HRP & Payroll)';
      case 'timetable':
        return 'Jadwalka Xiisadaha (Timetable Scheduling)';
      case 'messages':
        return 'Xarunta Farriimaha & Ogeysiisyada (Messaging)';
      case 'reports':
        return 'Xarunta Warbixinnada (Reports & Exports)';
      case 'settings':
        return 'Habaynta Guud ee Nidaamka (System Settings)';
      case 'help':
        return 'Xarunta Caawinta & Tikidhada (Help Desk)';
      case 'profile':
        return 'Xogta Isticmaalaha (User Profile)';
      default:
        return 'Machadka Khadiija';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">MKB Qardho</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate">
              {getModuleTitle(activeModule)}
            </span>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Raadi arday, macallin, rasiid, ama fasal..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B68]/30 focus:border-[#006B68] transition-colors"
            />
          </div>
        </div>

        {/* Right Controls: Academic Year, SQL Export, Role Switcher, Notification, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Academic Year Selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-[#006B68]" />
            <select
              value={currentAcademicYear}
              onChange={e => setCurrentAcademicYear(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2026–2027">Sanad 2026–2027</option>
              <option value="2025–2026">Sanad 2025–2026</option>
              <option value="2024–2025">Sanad 2024–2025</option>
            </select>
          </div>

          {/* Download SQL Schema for Local XAMPP */}
          <button
            onClick={exportDatabaseSQL}
            title="Soo deji MySQL 8+ Database Schema (.sql) oo loogu talagalay XAMPP ama Production"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#006B68] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MySQL Schema</span>
            <span className="text-[10px] bg-[#006B68] text-white px-1 rounded font-mono">.sql</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
              title="Beddel Doorkaaga (Switch Role) si aad u tijaabiso awoodaha"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="font-bold text-amber-900">{currentRole}</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tijaabi Doorka (Switch Role)
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentRole === r ? 'font-bold text-[#006B68] bg-teal-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#006B68]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
              aria-label="Ogeysiisyada"
            >
              <Bell className="w-4 h-4" />
              {unreadMessages.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Ogeysiisyada & Xusuusinta</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {unreadMessages.length + unpaidInvoices.length} cusub
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {unreadMessages.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveModule('messages');
                        setNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-800">{m.senderName}</span>
                        <span className="text-slate-400 text-[10px]">{m.createdAt}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 leading-snug">{m.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{m.content}</p>
                    </div>
                  ))}
                  {unpaidInvoices.slice(0, 3).map(inv => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setActiveModule('fees');
                        setNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-amber-50/50 cursor-pointer transition-colors flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900">Biil dhiman: {inv.invoiceNo}</p>
                        <p className="text-slate-500 text-[11px]">
                          Haraaga: <span className="font-bold text-amber-700">${inv.balance}</span> (Wakhtigu ku eg: {inv.dueDate})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveModule('messages');
                      setNotificationsOpen(false);
                    }}
                    className="text-xs font-semibold text-[#006B68] hover:underline"
                  >
                    Eeg dhammaan farriimaha
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Shortcut */}
          <button
            onClick={() => setActiveModule('profile')}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fur boggaaga gaarka ah (Profile)"
          >
            <div className="w-7 h-7 rounded-full bg-[#006B68] text-white flex items-center justify-center font-bold text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-800">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

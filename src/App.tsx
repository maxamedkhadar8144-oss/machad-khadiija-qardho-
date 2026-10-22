import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { ToastNotification } from './components/ToastNotification';
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { AcademicsView } from './views/AcademicsView';
import { TeachersView } from './views/TeachersView';
import { AttendanceView } from './views/AttendanceView';
import { ExaminationsView } from './views/ExaminationsView';
import { FeeManagementView } from './views/FeeManagementView';
import { FinanceView } from './views/FinanceView';
import { HRManagementView } from './views/HRManagementView';
import { TimetableView } from './views/TimetableView';
import { MessagesView } from './views/MessagesView';
import { PerformanceView } from './views/PerformanceView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { HelpCenterView } from './views/HelpCenterView';
import { UserProfileView } from './views/UserProfileView';
import { ShieldAlert } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeModule, sidebarCollapsed, hasPermission, setActiveModule, currentRole } = useApp();

  const renderModule = () => {
    // RBAC validation check
    if (!hasPermission(activeModule, 'view')) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4 my-12">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Galidda Qaybtan Xayiraad Baa Ku Xiran (Restricted Access)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Doorkaaga hadda (<strong className="text-slate-800">{currentRole}</strong>) fasax uma
              haysto inuu furo module-kan. Waxaad doorkaaga ka beddeli kartaa bar-madaxeedka sare si
              aad u tijaabiso awoodaha Super Admin ama Administrator.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('dashboard')}
            className="px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
          >
            Ku noqo Dashboard-ka
          </button>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'academics':
        return <AcademicsView />;
      case 'teachers':
        return <TeachersView />;
      case 'attendance':
        return <AttendanceView />;
      case 'examinations':
        return <ExaminationsView />;
      case 'fees':
        return <FeeManagementView />;
      case 'finance':
        return <FinanceView />;
      case 'hr':
        return <HRManagementView />;
      case 'timetable':
        return <TimetableView />;
      case 'messages':
        return <MessagesView />;
      case 'performance':
        return <PerformanceView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpCenterView />;
      case 'profile':
        return <UserProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F7] text-slate-800 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopNavbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  Receipt,
  Wallet,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart3,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentRole,
    messages,
    invoices,
    settings,
  } = useApp();

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;
  const overdueInvoicesCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').length;

  const navGroups = [
    {
      title: 'GUUD (MAIN)',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ARDAIDA & WAXBARASHADA',
      items: [
        { id: 'students', label: 'Ardayda (Students)', icon: Users },
        { id: 'academics', label: 'Fasallada & Maaddooyinka', icon: BookOpen },
        { id: 'teachers', label: 'Macallimiinta (Teachers)', icon: GraduationCap },
        { id: 'timetable', label: 'Jadwalka (Timetable)', icon: Calendar },
      ],
    },
    {
      title: 'HOWLGALKA AKHRISKA',
      items: [
        { id: 'attendance', label: 'Xaadiriska (Attendance)', icon: CalendarCheck },
        { id: 'examinations', label: 'Imtixaanaadka & Natiijada', icon: Award },
        { id: 'performance', label: 'Qiimeynta (Performance)', icon: BarChart3 },
      ],
    },
    {
      title: 'MAALIYADDA & HR',
      items: [
        { id: 'fees', label: 'Fiiga & Biilasha (Fees)', icon: Receipt, badge: overdueInvoicesCount ? `${overdueInvoicesCount}` : undefined, badgeColor: 'bg-amber-500' },
        { id: 'finance', label: 'Xisaabaadka & Kharashka', icon: Wallet },
        { id: 'hr', label: 'Shaqaalaha & Mushaharka (HR)', icon: Briefcase },
      ],
    },
    {
      title: 'XIRIIRKA & WARBIXINNADA',
      items: [
        { id: 'messages', label: 'Farriimaha (Messages)', icon: MessageSquare, badge: unreadMessagesCount ? `${unreadMessagesCount}` : undefined, badgeColor: 'bg-teal-400 text-teal-950 font-bold' },
        { id: 'reports', label: 'Warbixinnada (Reports)', icon: FileSpreadsheet },
        { id: 'help', label: 'Xarunta Caawinta (Help)', icon: HelpCircle },
        { id: 'settings', label: 'Habaynta (Settings)', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[#006B68] text-white transition-all duration-300 shadow-xl ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-4 border-b border-teal-700/60 bg-[#005754]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Institution Crest / Emblem */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 text-teal-950 font-black text-xl shrink-0 shadow-md">
            <span>م</span>
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight truncate">
                Machadka Khadiija
              </h1>
              <p className="text-[11px] font-medium text-teal-200 truncate">
                Bintu Khuwaylid – Qardho
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role Pill info */}
      {!sidebarCollapsed && (
        <div className="px-4 py-2.5 bg-[#004e4b]/70 border-b border-teal-800/40 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-white truncate">{currentRole}</span>
          </div>
          <span className="text-[10px] text-teal-300/80 font-mono">{settings.academicYear}</span>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-teal-300/80 uppercase">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 relative ${
                      isActive
                        ? 'bg-amber-400 text-teal-950 font-bold shadow-sm'
                        : 'text-teal-100 hover:bg-teal-700/60 hover:text-white'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-950' : 'text-teal-200'}`} />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          item.badgeColor || 'bg-teal-700 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Toggle */}
      <div className="p-3 border-t border-teal-700/60 bg-[#005754] flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="text-[11px] text-teal-200 truncate">
            <span>© 2026 MKB Qardho</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1.5 rounded-lg text-teal-200 hover:bg-teal-700 hover:text-white transition-colors ${
            sidebarCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

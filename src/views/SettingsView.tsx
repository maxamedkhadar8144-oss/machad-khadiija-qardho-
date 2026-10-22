import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Palette,
  Database,
  History,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SystemSettings, UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    auditLogs,
    exportDatabaseSQL,
    resetToDefaults,
    hasPermission,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'roles' | 'audit' | 'database'>('general');

  // Local form state
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const rolesMatrix: { role: UserRole; desc: string; modules: string[] }[] = [
    { role: 'Super Admin', desc: 'Awood buuxda dhammaan qaybaha nidaamka', modules: ['Dhammaan Qaybaha (Full Access)'] },
    { role: 'Administrator', desc: 'Maamulka guud ee xafiisyada iyo dugsiga', modules: ['Ardayda', 'Macallimiinta', 'Fasallada', 'Xaadiriska', 'Biilasha', 'Warbixinnada'] },
    { role: 'Academic Manager', desc: 'Kormeerka manhajka, fasallada iyo imtixaanaadka', modules: ['Fasallada', 'Maaddooyinka', 'Imtixaanaadka', 'Natiijooyinka', 'Jadwalka'] },
    { role: 'Accountant', desc: 'Xisaabinta fiiga, kharashaadka iyo rasiidada', modules: ['Biilasha', 'Rasiidadaha', 'Kharashaadka', 'Mushahaarka', 'Ledger'] },
    { role: 'Teacher', desc: 'Xaadiriska ardayda iyo gelinta buundooyinka', modules: ['Xaadiriska', 'Gelinta Buundooyinka', 'Jadwalka Macallinka'] },
    { role: 'HR Manager', desc: 'Maamulka shaqaalaha, fasaxyada iyo qandaraasyada', modules: ['Diiwaanka Shaqaalaha', 'Fasaxyada', 'Payroll'] },
    { role: 'Receptionist', desc: 'Qaabilaadda iyo diiwaangelinta xogta', modules: ['Diiwaanka Ardayda', 'Farriimaha'] },
    { role: 'Student', desc: 'Eegidda jadwalka, buundooyinka iyo xaadiriska', modules: ['Jadwalka', 'Natiijada', 'Xaadiriska'] },
    { role: 'Parent', desc: 'Dabagalka ilmaha, fiiga iyo xaadiriska', modules: ['Xogta Ardayga', 'Biilasha', 'Xaadiriska'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Xarunta Habaynta Guud (System Settings)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Habaynta astaanta machadka, xogta hay’adda, doorka isticmaalayaasha, iyo xog-kaydiyaha
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'general' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Xogta Machadka (General)
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'appearance' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Midabbada & Astaanta (Theme)
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'roles' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Doorka & Awoodaha (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Diiwaanka Ficilada (Audit Logs)
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'database' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kaydinta & XAMPP MySQL
        </button>
      </div>

      {/* GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs max-w-3xl space-y-4">
          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Magaca Machadka (Soomaali)
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Magaca Machadka (Carabi)
                </label>
                <input
                  type="text"
                  value={formData.institutionArabicName}
                  onChange={e =>
                    setFormData({ ...formData, institutionArabicName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-arabic"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Magaalada</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gobolka & Dalka</label>
                <input
                  type="text"
                  value={`${formData.region}, ${formData.country}`}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefoonka Xarunta</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email-ka Rasmiga ah</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sanad Dugsiyeedka Bilowga ah
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lacagta (Currency)</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="USD">USD ($) - Doolar</option>
                  <option value="SLSH">Somali Shilling</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#006B68] text-white font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Keydi Macluumaadka</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Astaamaha Muuqaalka & Midabbada Machadka
          </h3>
          <p className="text-xs text-slate-500">
            Midabbada rasmiga ah ee Machadka Khadiija Bintu Khuwaylid
          </p>

          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Midabka Koowaad (Primary Deep Teal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <span className="font-mono text-slate-700">{formData.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Midabka Labaad (Secondary Golden Yellow)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <span className="font-mono text-slate-700">{formData.secondaryColor}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => updateSettings(formData)}
              className="px-4 py-2 bg-[#006B68] text-white font-bold rounded-lg text-xs"
            >
              Keydi Midabbada
            </button>
          </div>
        </div>
      )}

      {/* ROLES & PERMISSIONS TAB */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Doorka (Role Name)</th>
                <th className="py-3 px-4">Sharaxaadda Shaqada</th>
                <th className="py-3 px-4">Qaybaha U Furan (Permissions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesMatrix.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{r.role}</td>
                  <td className="py-3 px-4 text-slate-600">{r.desc}</td>
                  <td className="py-3 px-4">
                    <span className="bg-teal-50 text-[#006B68] px-2 py-0.5 rounded font-medium text-[11px]">
                      {r.modules.join(', ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Diiwaanka Amniga & Ficilada Nidaamka (Audit Logs)
              </h3>
              <p className="text-xs text-slate-500">
                Ficillada xasaasiga ah ee lagu qabtay nidaamka oo leh taariikh iyo IP Address
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Waqtiga</th>
                <th className="py-3 px-4">Qofka</th>
                <th className="py-3 px-4">Ficilka</th>
                <th className="py-3 px-4">Waaxda</th>
                <th className="py-3 px-4">Faahfaahinta</th>
                <th className="py-3 px-4 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{log.userName}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'PAYMENT'
                          ? 'bg-amber-100 text-amber-800'
                          : log.action === 'DELETE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{log.module}</td>
                  <td className="py-2.5 px-4 text-slate-600">{log.details}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-400 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DATABASE & XAMPP TAB */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Xog-kaydiyaha & Tilmaamaha XAMPP / MySQL 8+
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Soo deji faylka SQL ee xog-kaydiyaha si aad toos ugu shubato phpMyAdmin ama MySQL
              Console
            </p>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-teal-950">
              Tilmaamaha Ku-rakibidda XAMPP (Local Installation Instructions):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-teal-900 leading-relaxed">
              <li>Fur XAMPP Control Panel, ka dib shid Apache iyo MySQL.</li>
              <li>Fur biraawsarkaaga gal <code>http://localhost/phpmyadmin</code>.</li>
              <li>Guji batoonka hoose ee "Soo deji MySQL Database (.sql)".</li>
              <li>phpMyAdmin dhexdiisa ku dhufo <strong>Import</strong>, ka dib dooro faylka la soo dejiyey ee <code>machadka_school_db.sql</code>.</li>
              <li>Dhammaan jaantusyada (Tables), furaheyaasha (Keys), iyo macluumaadka ardayda si toos ah ayay u samaysmi doonaan.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={exportDatabaseSQL}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#006B68] hover:bg-[#005754] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Soo deji Faylka SQL (machadka_school_db.sql)</span>
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    'Ma hubtaa inaad dib ugu celiso xogtii asalka ahayd ee Machadka Khadiija?'
                  )
                ) {
                  resetToDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Dib ugu Celi Asalkii (Reset Database)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

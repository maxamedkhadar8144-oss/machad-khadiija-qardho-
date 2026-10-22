import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Key,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserProfileView: React.FC = () => {
  const { currentUser, currentRole, showToast } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Xogta profile-kaaga si guul leh ayaa loo keydiyey');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Furaha cusub iyo kan xaqiijinta ma aha isku mid!', 'error');
      return;
    }
    showToast('Furaha sirta ah (Password) si guul leh ayaa loo beddelay');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Xogta Isticmaalaha (User Profile & Security)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Maamulka xogtaada shakhsiga ah, furaha sirta ah, iyo xaaladda koontadaada
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#006B68] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
          {currentUser.name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
            <span className="text-xs font-mono font-bold text-[#006B68] bg-teal-50 px-2 py-0.5 rounded">
              {currentRole}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Machadka Khadiija Bintu Khuwaylid – Xarunta Maamulka Qardho
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-600">
            <span>{currentUser.email}</span>
            <span>·</span>
            <span className="font-mono">{currentUser.phone}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Koonto Firfircoon (Active)
          </span>
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            Soo galay: {currentUser.lastLogin || 'Maanta'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#006B68]" />
            <span>Wax ka beddel Macluumaadka</span>
          </h4>

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Magaca Buuxa</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telefoonka</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#006B68] text-white font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
              >
                Keydi Xogta
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#006B68]" />
            <span>Beddel Furaha Sirta ah (Change Password)</span>
          </h4>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Furaha Hadda</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={e =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Furaha Cusub</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Xaqiiji Furaha Cusub</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={e =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#006B68] text-white font-bold rounded-lg shadow-sm hover:bg-[#005754] transition-colors cursor-pointer"
              >
                Beddel Furaha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

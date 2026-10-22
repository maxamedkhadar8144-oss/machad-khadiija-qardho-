import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-teal-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-950',
    error: 'border-red-300 bg-red-50 text-red-950',
    info: 'border-teal-300 bg-teal-50 text-teal-950',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold max-w-md ${
          borders[toast.type]
        }`}
      >
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

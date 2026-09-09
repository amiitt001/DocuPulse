import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#18181b] text-zinc-100 shadow-xl flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none max-w-sm">
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-zinc-300 shrink-0" />}
      <span className="text-xs font-medium tracking-tight text-white truncate">
        {message}
      </span>
    </div>
  );
};

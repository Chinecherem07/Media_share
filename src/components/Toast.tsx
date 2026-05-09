'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'info'; }
let addToastFn: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') { addToastFn?.(message, type); }

const iconMap = { success: CheckCircle, error: XCircle, info: Info };
const styleMap = {
  success: 'bg-[#f0fdf4] border-[#16a34a]/20 text-[#16a34a]',
  error: 'bg-[#fef2f2] border-[#dc2626]/20 text-[#dc2626]',
  info: 'bg-[#f5f5f5] border-[#1a1a1a]/10 text-[#1a1a1a]',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now(); setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  useEffect(() => { addToastFn = addToast; return () => { addToastFn = null; }; }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-[2000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = iconMap[t.type];
        return (
          <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium border pointer-events-auto max-w-sm shadow-md animate-[fadeIn_0.2s_ease] ${styleMap[t.type]}`}>
            <Icon className="w-4 h-4 shrink-0" /><span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="shrink-0 opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
          </div>
        );
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icon = type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  
  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg",
        type === 'success' ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      )}>
        {icon}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-current opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
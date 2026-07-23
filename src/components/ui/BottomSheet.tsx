// src/components/ui/BottomSheet.tsx — 移动端底部弹出面板（§6.2）
import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative max-h-[85vh] overflow-y-auto rounded-t-[20px] bg-white p-4 shadow-sheet pb-safe">
        <div className="flex justify-center pb-2">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
        {title && (
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-500">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

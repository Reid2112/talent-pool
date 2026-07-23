// src/components/ui/Modal.tsx — 模态框（§6.2）
import { type ReactNode, useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-sheet">{children}</div>
    </div>
  );
}

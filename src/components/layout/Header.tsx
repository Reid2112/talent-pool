// src/components/layout/Header.tsx — 顶部导航栏（§6.1）
import { type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  right?: ReactNode;
  onBack?: () => void;
}

export function Header({ title, showBack = false, right, onBack }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="flex h-13 items-center justify-between px-3 pt-safe" style={{ height: 52 }}>
      <div className="flex w-10 items-center justify-start">
        {showBack && (
          <button onClick={() => (onBack ? onBack() : navigate(-1))} className="text-slate-600">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      {title && <h1 className="flex-1 text-center text-base font-semibold text-slate-900">{title}</h1>}
      <div className="flex w-10 items-center justify-end">{right}</div>
    </header>
  );
}

// src/components/ui/Tag.tsx — 技能/标签（§6.2）
import { type ReactNode } from 'react';

export interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'accent';
}

export function Tag({ children, variant = 'default' }: TagProps) {
  const cls = variant === 'accent' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600';
  return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

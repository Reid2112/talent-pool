// src/components/ui/Section.tsx — 通用卡片分区（多处复用）
import { type ReactNode } from 'react';

export interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`card space-y-2.5 p-3.5 ${className}`}>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

/** 标签-值的行布局 */
export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

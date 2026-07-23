// src/components/ui/Empty.tsx — 空状态占位（§6.2）
import { type ReactNode } from 'react';
import { FileText } from 'lucide-react';

export interface EmptyProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function Empty({
  title = '暂无数据',
  description = '',
  action,
  icon
}: EmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="text-slate-300">{icon ?? <FileText size={64} strokeWidth={1.5} />}</div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

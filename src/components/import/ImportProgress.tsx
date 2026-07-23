// src/components/import/ImportProgress.tsx — 批量导入进度条（§8.5 / Phase 2）
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { BatchProgress } from '@/services/import/batch';

export interface ImportProgressProps {
  progress: BatchProgress;
}

export function ImportProgress({ progress }: ImportProgressProps) {
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="card space-y-3 p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {progress.errors.length > 0 ? (
            <AlertCircle size={18} className="text-amber-500" />
          ) : progress.done === progress.total ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <Loader2 size={18} className="animate-spin text-blue-600" />
          )}
          <span className="text-sm font-medium text-slate-900">
            {progress.done === progress.total ? '导入完成' : '正在解析…'}
          </span>
        </div>
        <span className="text-[13px] font-medium text-blue-600">{pct}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {progress.done} / {progress.total} 文件
        </span>
        {progress.currentFile && (
          <span className="text-slate-400 truncate max-w-[180px]">{progress.currentFile}</span>
        )}
      </div>

      {/* 错误列表 */}
      {progress.errors.length > 0 && (
        <div className="space-y-1 rounded-lg bg-red-50 p-2.5">
          {progress.errors.map((err, i) => (
            <p key={i} className="text-xs text-red-600 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

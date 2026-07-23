// src/components/candidate/StatusFlowSheet.tsx — 状态流转底部弹层（§14 Phase3）
// 视觉参考设计稿 StatusFlowSheet (id 3:556)
import { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { BottomSheet, Button } from '@/components/ui';
import { getStatusMeta, STATUS_FLOW, STATUS_BRANCHES } from '@/constants/contact-status';
import type { ContactStatus } from '@/types/candidate';

export interface StatusFlowSheetProps {
  open: boolean;
  currentStatus: ContactStatus;
  candidateName: string;
  onClose: () => void;
  onConfirm: (newStatus: ContactStatus) => void;
}

export function StatusFlowSheet({ open, currentStatus, candidateName, onClose, onConfirm }: StatusFlowSheetProps) {
  const currentMeta = getStatusMeta(currentStatus);
  const [selected, setSelected] = useState<ContactStatus>(currentStatus);

  // 每次打开 BottomSheet 时重置选中状态
  useEffect(() => {
    if (open) setSelected(currentStatus);
  }, [open, currentStatus]);

  return (
    <BottomSheet open={open} title="更新联系状态" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-slate-500">
          当前状态：<span className={`font-medium ${currentMeta.text}`}>{currentMeta.label}</span>
          {' · '}{candidateName}
        </p>

        {/* 主流程步进器 */}
        <div className="space-y-2.5">
          <p className="section-title">主流程</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FLOW.map((s, i) => {
              const meta = getStatusMeta(s);
              const isSelected = selected === s;
              const isCurrent = s === currentStatus;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={14} className="text-slate-300" />}
                  <button
                    onClick={() => setSelected(s)}
                    disabled={!currentMeta.next.includes(s)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isCurrent
                          ? 'border-2 border-blue-600 bg-blue-50 text-blue-600'
                          : currentMeta.next.includes(s)
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'cursor-not-allowed bg-slate-50 text-slate-300'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {meta.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 分支状态 */}
        <div className="space-y-2.5">
          <p className="section-title">分支</p>
          <div className="flex gap-2">
            {STATUS_BRANCHES.map((s) => {
              const meta = getStatusMeta(s);
              const isSelected = selected === s;
              const isCurrent = s === currentStatus;
              const canSelect = currentMeta.next.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  disabled={!canSelect}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                        ? 'border-2 border-blue-600 bg-blue-50 text-blue-600'
                        : canSelect
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'cursor-not-allowed bg-slate-50 text-slate-300'
                  }`}
                >
                  {isSelected && <Check size={14} />}
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 确认按钮 */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button
            onClick={() => {
              if (selected !== currentStatus) onConfirm(selected);
              onClose();
            }}
            disabled={selected === currentStatus}
            className="flex-1"
          >
            更新为 {getStatusMeta(selected).label}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

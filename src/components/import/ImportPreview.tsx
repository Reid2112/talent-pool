// src/components/import/ImportPreview.tsx — AI 提取结果预览确认（§8.5 步骤 3 / Phase 2）
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import type { Candidate, Skill } from '@/types/candidate';

export interface ImportPreviewProps {
  candidates: Candidate[];
  onConfirm: (candidates: Candidate[]) => void;
  onCancel: () => void;
  onEdit: (candidate: Candidate) => void;
}

export function ImportPreview({ candidates, onConfirm, onCancel, onEdit }: ImportPreviewProps) {
  return (
    <div className="card space-y-4 p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">AI 提取结果</h3>
          <p className="text-xs text-slate-400">请确认或编辑后再入库</p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
          {candidates.length} 位候选人
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
              {c.name?.charAt(0) || '?'}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900 truncate">{c.name || '未命名'}</p>
                <button
                  onClick={() => onEdit(c)}
                  className="shrink-0 text-slate-400 hover:text-blue-600"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {[c.currentPosition, c.currentCompany, c.currentLocation].filter(Boolean).join(' · ') || '待完善'}
              </p>
              {c.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s.name} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          <X size={16} /> 放弃
        </Button>
        <Button onClick={() => onConfirm(candidates)} className="flex-1">
          <Check size={16} /> 确认入库
        </Button>
      </div>
    </div>
  );
}

/** 单条候选人快速编辑面板 */
export function ImportPreviewEdit({
  candidate,
  onSave,
  onCancel
}: {
  candidate: Candidate;
  onSave: (c: Candidate) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Candidate>({ ...candidate });

  const set = (patch: Partial<Candidate>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="card space-y-3 p-3.5">
      <h3 className="text-sm font-semibold text-slate-900">快速编辑</h3>
      <Input
        label="姓名"
        value={form.name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="候选人姓名"
      />
      <Input
        label="当前职位"
        value={form.currentPosition}
        onChange={(e) => set({ currentPosition: e.target.value })}
      />
      <Input
        label="当前公司"
        value={form.currentCompany}
        onChange={(e) => set({ currentCompany: e.target.value })}
      />
      <Input
        label="技能（逗号分隔）"
        value={form.skills.map((s: Skill) => s.name).join(', ')}
        onChange={(e) =>
          set({
            skills: e.target.value
              .split(/[,，]/)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((name: string) => ({ name, level: 3 as const, category: 'other' as const }))
          })
        }
      />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
        <Button onClick={() => onSave(form)} className="flex-1">保存</Button>
      </div>
    </div>
  );
}

// src/components/candidate/FollowUpForm.tsx — 新增跟进记录表单（§14 Phase3）
// 视觉参考设计稿 FollowupPage (id 3:366)
import { useState } from 'react';
import { BottomSheet, Button, Input, Textarea } from '@/components/ui';
import { FilterChip } from '@/components/ui';
import { genId } from '@/utils/id';
import type { FollowUpRecord } from '@/types/candidate';

export interface FollowUpFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: FollowUpRecord) => void;
}

type FollowUpMethod = FollowUpRecord['method'];

const METHODS: { value: FollowUpMethod; label: string }[] = [
  { value: 'phone', label: '电话' },
  { value: 'wechat', label: '微信' },
  { value: 'email', label: '邮件' },
  { value: 'meeting', label: '见面' },
  { value: 'other', label: '其他' }
];

export function FollowUpForm({ open, onClose, onSave }: FollowUpFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [method, setMethod] = useState<FollowUpMethod>('wechat');
  const [summary, setSummary] = useState('');
  const [attitude, setAttitude] = useState('');
  const [nextStep, setNextStep] = useState('');

  const handleSave = () => {
    if (!summary.trim()) return;
    onSave({
      id: genId(),
      date,
      method,
      summary: summary.trim(),
      attitude: attitude.trim() || undefined,
      nextStep: nextStep.trim() || undefined,
      createdAt: new Date().toISOString()
    });
    // 重置表单
    setDate(today);
    setMethod('wechat');
    setSummary('');
    setAttitude('');
    setNextStep('');
    onClose();
  };

  return (
    <BottomSheet open={open} title="添加跟进记录" onClose={onClose}>
      <div className="space-y-4">
        {/* 沟通日期 */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-700">沟通日期</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 沟通方式 */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-700">沟通方式</label>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <FilterChip
                key={m.value}
                label={m.label}
                active={method === m.value}
                onClick={() => setMethod(m.value)}
              />
            ))}
          </div>
        </div>

        {/* 沟通摘要 */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-700">沟通摘要 *</label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="简要记录沟通内容、候选人反馈..."
            className="min-h-[80px]"
          />
        </div>

        {/* 对方态度 */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-700">对方态度（选填）</label>
          <Input
            value={attitude}
            onChange={(e) => setAttitude(e.target.value)}
            placeholder="积极 / 观望 / 暂不考虑..."
          />
        </div>

        {/* 下一步计划 */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-slate-700">下一步计划（选填）</label>
          <Input
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            placeholder="下周安排面试 / 发送JD..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">取消</Button>
          <Button onClick={handleSave} disabled={!summary.trim()} className="flex-1">保存记录</Button>
        </div>
      </div>
    </BottomSheet>
  );
}

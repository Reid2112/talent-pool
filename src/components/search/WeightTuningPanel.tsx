// src/components/search/WeightTuningPanel.tsx — 匹配权重微调面板（§10.2 / 设计稿 id 3:677）
import { useState } from 'react';
import { BottomSheet, Button } from '@/components/ui';
import { defaultMatchWeights } from '@/types/search';
import type { MatchWeights } from '@/types/search';

export interface WeightTuningPanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (weights: MatchWeights) => void;
}

interface SliderDef {
  key: keyof MatchWeights;
  label: string;
  description: string;
}

const SLIDERS: SliderDef[] = [
  { key: 'semantic', label: '语义相似度', description: 'JD 与候选人整体画像的语义匹配' },
  { key: 'keyword', label: '关键词匹配', description: '技能名、行业、岗位等直接命中' },
  { key: 'skillGraph', label: '技能迁移', description: '通过图谱找到的可迁移技能' },
  { key: 'hardCondition', label: '硬条件', description: '年限、地点、学历、薪资' }
];

export function WeightTuningPanel({ open, onClose, onSave }: WeightTuningPanelProps) {
  const [weights, setWeights] = useState<MatchWeights>(() => {
    try {
      const saved = localStorage.getItem('tp_match_weights');
      return saved ? (JSON.parse(saved) as MatchWeights) : { ...defaultMatchWeights };
    } catch {
      return { ...defaultMatchWeights };
    }
  });

  const total = Object.values(weights).reduce((s, v) => s + v, 0);

  const setWeight = (key: keyof MatchWeights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: Math.round(value) / 100 }));
  };

  const reset = () => {
    setWeights({ ...defaultMatchWeights });
  };

  const handleSave = () => {
    // 归一化确保总和为 1
    const sum = Object.values(weights).reduce((s, v) => s + v, 0);
    const normalized: MatchWeights = { ...weights };
    if (sum !== 1 && sum > 0) {
      for (const k of Object.keys(normalized) as (keyof MatchWeights)[]) {
        normalized[k] = Math.round((normalized[k] / sum) * 100) / 100;
      }
    }
    localStorage.setItem('tp_match_weights', JSON.stringify(normalized));
    onSave(normalized);
    onClose();
  };

  return (
    <BottomSheet open={open} title="匹配权重调整" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-xs text-slate-400">
          调整四个维度的权重，总和自动归一化为 100%。拖拽滑块微调匹配偏好。
        </p>

        {SLIDERS.map((s) => (
          <div key={s.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-900">{s.label}</span>
                <p className="text-[11px] text-slate-400">{s.description}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">{Math.round(weights[s.key] * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(weights[s.key] * 100)}
              onChange={(e) => setWeight(s.key, Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
            />
          </div>
        ))}

        {/* 总和指示器 */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-[13px] text-slate-500">合计</span>
          <span
            className={`text-sm font-bold ${Math.abs(total - 1) < 0.01 ? 'text-green-600' : 'text-amber-600'}`}
          >
            {Math.round(total * 100)}%
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={reset} className="text-sm text-slate-500 underline">
            恢复默认
          </button>
          <div className="flex flex-1 gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">取消</Button>
            <Button onClick={handleSave} className="flex-1">保存权重</Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

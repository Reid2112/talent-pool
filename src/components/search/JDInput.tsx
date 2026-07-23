// src/components/search/JDInput.tsx — JD 文本输入区域（§6.1）
import { Button, Textarea } from '@/components/ui';
import { Sparkles } from 'lucide-react';

export interface JDInputProps {
  value: string;
  onChange: (text: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function JDInput({ value, onChange, onSearch, isSearching }: JDInputProps) {
  return (
    <div className="card space-y-3 p-3.5">
      <span className="section-title">岗位 JD</span>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="粘贴岗位 JD，AI 语义理解 + 技能图谱迁移打分…"
        className="min-h-[120px]"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">≈ {Math.ceil(value.length / 3)} tokens</span>
        <Button size="sm" onClick={onSearch} disabled={isSearching || !value.trim()}>
          <Sparkles size={16} /> {isSearching ? '匹配中…' : '开始匹配'}
        </Button>
      </div>
    </div>
  );
}

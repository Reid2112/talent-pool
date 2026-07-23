// src/components/search/MatchExplanation.tsx — 匹配维度得分展示（§6.1）
import { formatPercent } from '@/utils/format';
import type { MatchBreakdown } from '@/types/search';

export interface MatchExplanationProps {
  breakdown: MatchBreakdown;
}

const DIMENSIONS = [
  { key: 'keywordScore' as const, label: '关键词' },
  { key: 'semanticScore' as const, label: '语义' },
  { key: 'skillGraphScore' as const, label: '迁移' },
  { key: 'experienceScore' as const, label: '年限' },
  { key: 'locationScore' as const, label: '地点' },
] as const;

export function MatchExplanation({ breakdown }: MatchExplanationProps) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
      {DIMENSIONS.map(({ key, label }) => (
        <span key={key}>
          {label} {formatPercent(breakdown[key])}
        </span>
      ))}
    </div>
  );
}

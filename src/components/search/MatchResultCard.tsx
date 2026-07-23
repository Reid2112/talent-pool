// src/components/search/MatchResultCard.tsx — 单张匹配结果卡片（§6.1）
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui';
import { MatchExplanation } from './MatchExplanation';
import { formatPercent } from '@/utils/format';
import type { MatchResult } from '@/types/search';

export interface MatchResultCardProps {
  result: MatchResult;
}

export function MatchResultCard({ result }: MatchResultCardProps) {
  const navigate = useNavigate();
  const { candidate: c, overallScore, explanation, breakdown } = result;

  return (
    <div
      onClick={() => navigate(`/candidates/${c.id}`)}
      className="card cursor-pointer space-y-2.5 p-3 transition active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name={c.name} size={40} />
          <div>
            <p className="text-sm font-bold text-slate-900">{c.name}</p>
            <p className="text-xs text-slate-500">{c.currentPosition}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-600">{formatPercent(overallScore)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${overallScore}%` }} />
      </div>
      <p className="text-xs text-slate-600">{explanation}</p>
      <MatchExplanation breakdown={breakdown} />
    </div>
  );
}

// src/components/candidate/CandidateCard.tsx — 列表中的候选人卡片（§1.3 猎聘式左右结构）
import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { Tag } from '@/components/ui';
import type { Candidate } from '@/types/candidate';
import { formatYears } from '@/utils/format';

export interface CandidateCardProps {
  candidate: Candidate;
  onClick?: (candidate: Candidate) => void;
  onToggleStar?: (id: string) => void;
}

export function CandidateCard({ candidate, onClick, onToggleStar }: CandidateCardProps) {
  const c = candidate;
  return (
    <div
      onClick={() => onClick?.(c)}
      className="card flex items-center gap-3 p-3 transition active:scale-[0.99]"
    >
      <Avatar name={c.name} size={48} />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-slate-900">{c.name}</span>
            {onToggleStar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(c.id);
                }}
                className="text-amber-500"
              >
                <Star size={14} fill={c.isStarred ? 'currentColor' : 'none'} strokeWidth={1.8} />
              </button>
            )}
          </div>
          <StatusBadge status={c.contactStatus} />
        </div>
        <p className="text-[13px] text-slate-600">
          {c.currentPosition} · {c.currentCompany} · {formatYears(c.yearsOfExperience)}
        </p>
        {c.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {c.skills.slice(0, 2).map((s) => (
              <Tag key={s.name}>{s.name}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

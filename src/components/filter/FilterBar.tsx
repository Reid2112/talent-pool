// src/components/filter/FilterBar.tsx — 筛选标签栏：显示已激活的筛选条件（§6.2）
import { X } from 'lucide-react';
import type { CandidateFilter } from '@/types/filter';
import { getStatusMeta } from '@/constants/contact-status';

interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

interface FilterBarProps {
  filter: CandidateFilter;
  /** 清除筛选：传 value 时移除数组中的单项，不传时清空整个 key */
  onClearFilter: (key: keyof CandidateFilter, value?: string) => void;
  onResetAll: () => void;
}

export function FilterBar({ filter, onClearFilter, onResetAll }: FilterBarProps) {
  const chips: ActiveFilter[] = [];

  if (filter.keyword) {
    chips.push({
      key: 'keyword',
      label: `搜索：${filter.keyword}`,
      onRemove: () => onClearFilter('keyword')
    });
  }

  if (filter.contactStatus?.length) {
    filter.contactStatus.forEach((s) => {
      chips.push({
        key: `status-${s}`,
        label: getStatusMeta(s).label,
        onRemove: () => onClearFilter('contactStatus', s)
      });
    });
  }

  if (filter.industry?.length) {
    filter.industry.forEach((ind) => {
      chips.push({
        key: `industry-${ind}`,
        label: ind,
        onRemove: () => onClearFilter('industry', ind)
      });
    });
  }

  if (filter.currentLocation?.length) {
    filter.currentLocation.forEach((loc) => {
      chips.push({
        key: `location-${loc}`,
        label: loc,
        onRemove: () => onClearFilter('currentLocation', loc)
      });
    });
  }

  if (filter.starred) {
    chips.push({
      key: 'starred',
      label: '仅收藏',
      onRemove: () => onClearFilter('starred')
    });
  }

  if (filter.yearsOfExperience) {
    const { min, max } = filter.yearsOfExperience;
    const label = max != null ? `${min}–${max} 年` : `≥ ${min} 年`;
    chips.push({
      key: 'years',
      label,
      onRemove: () => onClearFilter('yearsOfExperience')
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-medium text-blue-700"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="text-blue-500 hover:text-blue-700">
            <X size={12} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onResetAll}
          className="shrink-0 text-[12px] text-slate-400 underline"
        >
          全部清除
        </button>
      )}
    </div>
  );
}

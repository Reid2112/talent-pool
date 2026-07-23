// src/components/filter/FilterOptions.tsx — 各维度筛选项（§6.1）
import { FilterChip } from '@/components/ui';
import { INDUSTRIES } from '@/constants/industries';
import { LOCATIONS } from '@/constants/locations';
import { ALL_STATUSES, getStatusMeta } from '@/constants/contact-status';
import type { ContactStatus } from '@/types/candidate';

export interface FilterOptionsProps {
  industry: string[];
  status: ContactStatus[];
  location: string[];
  starred: boolean;
  onToggleIndustry: (industry: string) => void;
  onToggleStatus: (status: ContactStatus) => void;
  onToggleLocation: (location: string) => void;
  onToggleStarred: () => void;
}

export function FilterOptions({
  industry,
  status,
  location,
  starred,
  onToggleIndustry,
  onToggleStatus,
  onToggleLocation,
  onToggleStarred,
}: FilterOptionsProps) {
  return (
    <div className="space-y-5">
      <FilterField label="行业">
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <FilterChip key={i} label={i} active={industry.includes(i)} onClick={() => onToggleIndustry(i)} />
          ))}
        </div>
      </FilterField>

      <FilterField label="联系状态">
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <FilterChip key={s} label={getStatusMeta(s).label} active={status.includes(s)} onClick={() => onToggleStatus(s)} />
          ))}
        </div>
      </FilterField>

      <FilterField label="现居城市">
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((l) => (
            <FilterChip key={l} label={l} active={location.includes(l)} onClick={() => onToggleLocation(l)} />
          ))}
        </div>
      </FilterField>

      <FilterField label="其他">
        <FilterChip label="仅看收藏" active={starred} onClick={onToggleStarred} />
      </FilterField>
    </div>
  );
}

/** 筛选维度标题 */
function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="section-title">{label}</p>
      {children}
    </div>
  );
}

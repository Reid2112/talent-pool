// src/components/filter/FilterPanel.tsx — 多维筛选底部弹层（§6.1）
import { useState, useEffect } from 'react';
import { BottomSheet, Button } from '@/components/ui';
import { FilterOptions } from './FilterOptions';
import { useCandidateStore } from '@/stores/candidate.store';
import { useUIStore } from '@/stores/ui.store';
import type { ContactStatus } from '@/types/candidate';

export function FilterPanel() {
  const { isFilterPanelOpen, closeFilterPanel } = useUIStore();
  const { filter, setFilter, resetFilter, candidates } = useCandidateStore();

  const [industry, setIndustry] = useState<string[]>(filter.industry ?? []);
  const [status, setStatus] = useState<ContactStatus[]>(filter.contactStatus ?? []);
  const [location, setLocation] = useState<string[]>(filter.currentLocation ?? []);
  const [starred, setStarred] = useState<boolean>(filter.starred ?? false);

  // 每次打开 BottomSheet 时，重置本地状态为当前生效的 filter
  useEffect(() => {
    if (isFilterPanelOpen) {
      setIndustry(filter.industry ?? []);
      setStatus(filter.contactStatus ?? []);
      setLocation(filter.currentLocation ?? []);
      setStarred(filter.starred ?? false);
    }
  }, [isFilterPanelOpen, filter.industry, filter.contactStatus, filter.currentLocation, filter.starred]);

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) => {
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const apply = () => {
    setFilter({ industry, contactStatus: status, currentLocation: location, starred });
    closeFilterPanel();
  };

  const reset = () => {
    setIndustry([]);
    setStatus([]);
    setLocation([]);
    setStarred(false);
    resetFilter();
    closeFilterPanel();
  };

  return (
    <BottomSheet open={isFilterPanelOpen} title="筛选" onClose={closeFilterPanel}>
      <FilterOptions
        industry={industry}
        status={status}
        location={location}
        starred={starred}
        onToggleIndustry={(v) => toggle(industry, v, setIndustry)}
        onToggleStatus={(v) => toggle(status, v, setStatus)}
        onToggleLocation={(v) => toggle(location, v, setLocation)}
        onToggleStarred={() => setStarred((v) => !v)}
      />
      <div className="flex items-center justify-between pt-5">
        <button onClick={reset} className="text-sm text-slate-500">重置</button>
        <Button onClick={apply}>应用 · {candidates.length} 个结果</Button>
      </div>
    </BottomSheet>
  );
}

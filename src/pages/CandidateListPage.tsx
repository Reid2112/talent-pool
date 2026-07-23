// src/pages/CandidateListPage.tsx — 候选人列表页（§6.1）
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '@/hooks/useCandidates';
import { CandidateList } from '@/components/candidate/CandidateList';
import { SearchBar, FilterChip } from '@/components/ui';
import { FilterPanel } from '@/components/filter/FilterPanel';
import { FilterBar } from '@/components/filter/FilterBar';
import { useUIStore } from '@/stores/ui.store';
import { useCandidateStore } from '@/stores/candidate.store';
import type { CandidateFilter } from '@/types/filter';

export function CandidateListPage() {
  const { candidates, isLoading, setFilter, resetFilter, toggleStar } = useCandidates();
  const filter = useCandidateStore((s) => s.filter);
  const { openFilterPanel } = useUIStore();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [filterStarred, setFilterStarred] = useState(false);

  const onSearch = (v: string) => {
    setKeyword(v);
    setFilter({ keyword: v });
  };

  const handleClearFilter = (key: keyof CandidateFilter, value?: string) => {
    if (key === 'keyword') {
      setKeyword('');
      setFilter({ keyword: '' });
    } else if (key === 'contactStatus') {
      if (value) {
        const current = filter.contactStatus ?? [];
        setFilter({ contactStatus: current.filter((s) => s !== value) });
      } else {
        setFilter({ contactStatus: undefined });
      }
    } else if (key === 'industry') {
      if (value) {
        const current = filter.industry ?? [];
        setFilter({ industry: current.filter((i) => i !== value) });
      } else {
        setFilter({ industry: undefined });
      }
    } else if (key === 'currentLocation') {
      if (value) {
        const current = filter.currentLocation ?? [];
        setFilter({ currentLocation: current.filter((l) => l !== value) });
      } else {
        setFilter({ currentLocation: undefined });
      }
    } else if (key === 'starred') {
      setFilterStarred(false);
      setFilter({ starred: undefined });
    } else if (key === 'yearsOfExperience') {
      setFilter({ yearsOfExperience: undefined });
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 pt-safe pb-2 pt-3">
        <h1 className="text-2xl font-bold text-slate-900">人才库</h1>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[13px] font-medium text-blue-600">
          {candidates.length} 位候选人
        </span>
      </header>
      <div className="flex flex-col gap-4 px-4">
        <SearchBar value={keyword} placeholder="搜索姓名、公司、技能…" onChange={onSearch} />
        <div className="flex gap-2">
          <FilterChip label="筛选" onClick={openFilterPanel} />
          <FilterChip
            label="收藏"
            active={filterStarred}
            onClick={() => {
              setFilterStarred((v) => !v);
              setFilter({ starred: !filterStarred });
            }}
          />
        </div>
      </div>
      {/* 激活的筛选条件标签 */}
      <FilterBar filter={filter} onClearFilter={handleClearFilter} onResetAll={() => { setKeyword(''); setFilterStarred(false); resetFilter(); }} />
      <div className="px-4">
        <CandidateList
          candidates={candidates}
          isLoading={isLoading}
          onClick={(c) => navigate(`/candidates/${c.id}`)}
          onToggleStar={toggleStar}
        />
      </div>
      <FilterPanel />
    </>
  );
}

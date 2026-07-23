// src/pages/SearchPage.tsx — JD 智能匹配页（§6.1，Phase 2）
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { JDInput } from '@/components/search/JDInput';
import { MatchResultList } from '@/components/search/MatchResultList';
import { WeightTuningPanel } from '@/components/search/WeightTuningPanel';
import { useSearch } from '@/hooks/useSearch';
import { AlertCircle, SlidersHorizontal } from 'lucide-react';
import type { MatchWeights } from '@/types/search';

export function SearchPage() {
  const { jdText, setJDText, results, isSearching, error, search } = useSearch();
  const [weightOpen, setWeightOpen] = useState(false);

  return (
    <>
      <Header
        title="智能匹配"
        right={
          <button onClick={() => setWeightOpen(true)} className="text-slate-600">
            <SlidersHorizontal size={18} />
          </button>
        }
      />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <JDInput
          value={jdText}
          onChange={setJDText}
          onSearch={() => void search()}
          isSearching={isSearching}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <MatchResultList results={results} error={error} isSearching={isSearching} />
      </div>

      {/* Weight Tuning Panel */}
      <WeightTuningPanel
        open={weightOpen}
        onClose={() => setWeightOpen(false)}
        onSave={(_weights: MatchWeights) => {
          // 权重已保存到 localStorage，下次搜索时 scorer 会读取
        }}
      />
    </>
  );
}

// src/components/search/MatchResultList.tsx — 匹配结果列表（含初始引导态，§6.1）
import { MatchResultCard } from './MatchResultCard';
import { Search, FileText, GitCompare, ListOrdered } from 'lucide-react';
import type { MatchResult } from '@/types/search';

export interface MatchResultListProps {
  results: MatchResult[];
  error: string | null;
  isSearching: boolean;
}

/** 未搜索时的引导状态 */
export function MatchWelcomeGuide() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <Search size={28} className="text-blue-500" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <p className="text-[15px] font-semibold text-slate-700">AI 智能匹配</p>
        <p className="text-[13px] leading-relaxed text-slate-400">
          粘贴岗位 JD 后点击「开始匹配」，AI 将自动解析需求
        </p>
      </div>
      <div className="flex flex-col gap-2.5 pt-2 text-left">
        {[
          { icon: FileText, text: '语义理解 JD 中的核心要求与隐含需求' },
          { icon: GitCompare, text: '四维打分：关键词 · 语义 · 技能迁移 · 硬条件' },
          { icon: ListOrdered, text: '候选人按匹配度降序排列，附详细理由' }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <item.icon size={16} className="mt-0.5 shrink-0 text-blue-400" />
            <span className="text-[13px] text-slate-500">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchResultList({ results, error, isSearching }: MatchResultListProps) {
  // 初始引导状态（未搜索且无结果）
  if (!error && results.length === 0 && !isSearching) {
    return <MatchWelcomeGuide />;
  }

  if (results.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">匹配结果</h2>
        <span className="text-xs text-slate-400">按匹配度降序</span>
      </div>
      {results.map((r) => (
        <MatchResultCard key={r.candidate.id} result={r} />
      ))}
    </section>
  );
}

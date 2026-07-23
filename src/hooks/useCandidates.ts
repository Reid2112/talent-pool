// src/hooks/useCandidates.ts — 候选人列表 + 筛选 + 分页（§3 hooks 层）
import { useEffect } from 'react';
import { useCandidateStore } from '@/stores/candidate.store';

/** 候选人列表 hook：挂载时自动加载 */
export function useCandidates() {
  const store = useCandidateStore();

  useEffect(() => {
    void store.fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}

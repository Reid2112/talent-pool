// src/hooks/useCandidateDetail.ts — 候选人详情 + 编辑（§3 hooks 层）
import { useCallback, useEffect, useState } from 'react';
import { getCandidateById } from '@/db/candidate.db';
import { useCandidateStore } from '@/stores/candidate.store';
import type { Candidate } from '@/types/candidate';

export function useCandidateDetail(id?: string) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const saveCandidate = useCandidateStore((s) => s.saveCandidate);
  const deleteCandidate = useCandidateStore((s) => s.deleteCandidate);
  const addFollowUpRecord = useCandidateStore((s) => s.addFollowUpRecord);
  const setStatus = useCandidateStore((s) => s.setStatus);
  const setNextFollowUpDate = useCandidateStore((s) => s.setNextFollowUpDate);

  /** 强制从 DB 重新拉取当前候选人数据 */
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    if (!id) {
      setCandidate(null);
      setIsLoading(false);
      return;
    }
    getCandidateById(id)
      .then((c) => {
        if (active) setCandidate(c ?? null);
      })
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [id, version]); // version 变化时重新拉取

  return { candidate, isLoading, refresh, saveCandidate, deleteCandidate, addFollowUpRecord, setStatus, setNextFollowUpDate };
}

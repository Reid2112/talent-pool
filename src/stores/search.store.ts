// src/stores/search.store.ts — JD 输入、搜索状态、匹配结果（§7.1）
import { create } from 'zustand';
import type { MatchResult, ParsedJD } from '@/types/search';
import { matchCandidates, parseJD } from '@/services/matching/matcher';
import { getAllCandidates } from '@/db/candidate.db';

interface SearchStore {
  jdText: string;
  parsedJD: ParsedJD | null;
  results: MatchResult[];
  isSearching: boolean;
  error: string | null;

  setJDText: (text: string) => void;
  search: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  jdText: '',
  parsedJD: null,
  results: [],
  isSearching: false,
  error: null,

  setJDText: (text) => set({ jdText: text }),

  search: async () => {
    const { jdText } = get();
    if (!jdText.trim()) return;
    set({ isSearching: true, error: null });
    try {
      const candidates = await getAllCandidates();
      const results = await matchCandidates({ rawText: jdText }, candidates);
      set({ results, isSearching: false });
    } catch (err) {
      set({ isSearching: false, error: (err as Error).message });
    }
  },

  clearResults: () => set({ results: [], parsedJD: null, error: null })
}));

export { parseJD };

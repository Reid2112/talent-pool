// src/stores/import.store.ts — 导入进度、中间状态（§7.1）
import { create } from 'zustand';
import type { Candidate } from '@/types/candidate';
import { batchImport, type BatchProgress } from '@/services/import/batch';
import { bulkPutCandidates } from '@/db/candidate.db';

interface ImportStore {
  isImporting: boolean;
  progress: BatchProgress | null;
  extractedData: Candidate[]; // AI 提取的候选人数据（待确认）
  error: string | null;

  startImport: (files: File[]) => Promise<void>;
  confirmImport: (data: Candidate[]) => Promise<void>;
  updateExtractedCandidate: (candidate: Candidate) => void;
  cancelImport: () => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  isImporting: false,
  progress: null,
  extractedData: [],
  error: null,

  startImport: async (files) => {
    set({ isImporting: true, error: null, extractedData: [], progress: { done: 0, total: files.length, currentFile: '', errors: [] } });
    try {
      // 先提取不入库（confirm=false），等用户确认
      const extracted = await batchImport(
        files,
        (p) => set({ progress: p }),
        false
      );
      set({ extractedData: extracted, isImporting: false });
    } catch (err) {
      set({ isImporting: false, error: (err as Error).message });
    }
  },

  confirmImport: async (data) => {
    await bulkPutCandidates(data);
    set({ extractedData: [], progress: null });
  },

  updateExtractedCandidate: (candidate) => {
    set((s) => ({
      extractedData: s.extractedData.map((c) => (c.id === candidate.id ? candidate : c))
    }));
  },

  cancelImport: () => set({ isImporting: false, extractedData: [], progress: null })
}));

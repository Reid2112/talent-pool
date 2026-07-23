// src/stores/candidate.store.ts — 候选人列表、筛选、排序、当前选中（§7.1）
import { create } from 'zustand';
import type { Candidate, ContactStatus, FollowUpRecord } from '@/types/candidate';
import type { CandidateFilter, SortOption } from '@/types/filter';
import { emptyFilter, defaultSort } from '@/types/filter';
import {
  getAllCandidates,
  getCandidateById,
  deleteCandidate as dbDelete,
  updateCandidate as dbUpdate,
  createCandidate as dbCreate,
  putCandidate as dbPut
} from '@/db/candidate.db';

interface CandidateStore {
  candidates: Candidate[];
  total: number;
  filter: CandidateFilter;
  sort: SortOption;
  isLoading: boolean;
  error: string | null;

  fetchCandidates: () => Promise<void>;
  setFilter: (filter: Partial<CandidateFilter>) => void;
  resetFilter: () => void;
  setSort: (sort: SortOption) => void;
  deleteCandidate: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  setStatus: (id: string, status: ContactStatus) => Promise<void>;
  saveCandidate: (candidate: Candidate) => Promise<string>;
  addFollowUpRecord: (id: string, record: FollowUpRecord) => Promise<void>;
  setNextFollowUpDate: (id: string, date: string) => Promise<void>;
}

/** 应用筛选 */
function applyFilter(list: Candidate[], filter: CandidateFilter): Candidate[] {
  return list.filter((c) => {
    if (c.isArchived && !filter.contactStatus?.includes('archived')) return false;
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      const hay = [c.name, c.currentPosition, c.currentCompany, ...c.skills.map((s) => s.name), ...c.autoTags].join(' ').toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    if (filter.industry?.length && !filter.industry.some((i) => c.industry.includes(i))) return false;
    if (filter.contactStatus?.length && !filter.contactStatus.includes(c.contactStatus)) return false;
    if (filter.currentLocation?.length && !filter.currentLocation.includes(c.currentLocation)) return false;
    if (filter.starred && !c.isStarred) return false;
    if (filter.yearsOfExperience) {
      const { min, max } = filter.yearsOfExperience;
      if (min != null && c.yearsOfExperience < min) return false;
      if (max != null && c.yearsOfExperience > max) return false;
    }
    return true;
  });
}

/** 应用排序 */
function applySort(list: Candidate[], sort: SortOption): Candidate[] {
  const dir = sort.direction === 'asc' ? 1 : -1;
  const pick = (c: Candidate): string | number => {
    if (sort.field === 'name') return c.name;
    if (sort.field === 'yearsOfExperience') return c.yearsOfExperience;
    return c[sort.field] ?? '';
  };
  return [...list].sort((a, b) => {
    const av = pick(a);
    const bv = pick(b);
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export const useCandidateStore = create<CandidateStore>((set, get) => ({
  candidates: [],
  total: 0,
  filter: emptyFilter,
  sort: defaultSort,
  isLoading: false,
  error: null,

  fetchCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const all = await getAllCandidates();
      const filtered = applyFilter(all, get().filter);
      const sorted = applySort(filtered, get().sort);
      set({ candidates: sorted, total: all.filter((c) => !c.isArchived).length, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  setFilter: (filter) => {
    set({ filter: { ...get().filter, ...filter } });
    void get().fetchCandidates();
  },
  resetFilter: () => {
    set({ filter: emptyFilter });
    void get().fetchCandidates();
  },
  setSort: (sort) => {
    set({ sort });
    void get().fetchCandidates();
  },

  deleteCandidate: async (id) => {
    await dbDelete(id);
    await get().fetchCandidates();
  },

  toggleStar: async (id) => {
    const c = get().candidates.find((x) => x.id === id);
    if (!c) return;
    await dbUpdate(id, { isStarred: !c.isStarred });
    await get().fetchCandidates();
  },

  setStatus: async (id, status) => {
    await dbUpdate(id, { contactStatus: status });
    await get().fetchCandidates();
  },

  saveCandidate: async (candidate) => {
    const exists = get().candidates.some((c) => c.id === candidate.id);
    if (exists) {
      await dbPut(candidate);
    } else {
      await dbCreate(candidate);
    }
    await get().fetchCandidates();
    return candidate.id;
  },

  addFollowUpRecord: async (id, record) => {
    const candidate = await getCandidateById(id);
    if (!candidate) throw new Error('候选人不存在');
    const updated = [...candidate.followUpRecords, record];
    await dbUpdate(id, { followUpRecords: updated });
    await get().fetchCandidates();
  },

  setNextFollowUpDate: async (id, date) => {
    await dbUpdate(id, { nextFollowUpDate: date });
    await get().fetchCandidates();
  }
}));

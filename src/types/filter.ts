// src/types/filter.ts — 筛选条件与排序（§4.3）
import type { ContactStatus } from './candidate';

/** 候选人筛选条件 */
export interface CandidateFilter {
  industry?: string[];
  position?: string[];
  yearsOfExperience?: { min?: number; max?: number };
  contactStatus?: ContactStatus[];
  currentLocation?: string[];
  salaryRange?: { min?: number; max?: number };
  education?: string[];
  skills?: string[];
  tags?: string[];
  keyword?: string;
  starred?: boolean;
}

/** 排序选项 */
export interface SortOption {
  field: 'updatedAt' | 'createdAt' | 'name' | 'yearsOfExperience' | 'lastContactDate';
  direction: 'asc' | 'desc';
}

/** 默认筛选（空） */
export const emptyFilter: CandidateFilter = {};

/** 默认排序：按更新时间降序 */
export const defaultSort: SortOption = { field: 'updatedAt', direction: 'desc' };

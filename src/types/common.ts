// src/types/common.ts — 通用类型（分页、排序等）

/** 分页参数 */
export interface Pagination {
  page: number;
  pageSize: number;
}

/** 分页结果 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 异步状态 */
export interface AsyncState {
  isLoading: boolean;
  error: string | null;
}

/** 通用操作结果 */
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

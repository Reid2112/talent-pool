// src/db/candidate.db.ts — 候选人表 CRUD 操作（§3 db 层，只负责 IndexedDB）
import { db } from './index';
import type { Candidate } from '@/types/candidate';

/** 获取全部候选人（不含归档） */
export async function getAllCandidates(): Promise<Candidate[]> {
  return db.candidates.toArray();
}

/** 按 id 获取 */
export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  return db.candidates.get(id);
}

/** 新建 */
export async function createCandidate(candidate: Candidate): Promise<string> {
  await db.candidates.add(candidate);
  return candidate.id;
}

/** 更新（局部合并，自动刷新 updatedAt） */
export async function updateCandidate(
  id: string,
  patch: Partial<Candidate>
): Promise<void> {
  await db.candidates.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

/** 全量替换 */
export async function putCandidate(candidate: Candidate): Promise<string> {
  await db.candidates.put({
    ...candidate,
    updatedAt: new Date().toISOString()
  });
  return candidate.id;
}

/** 删除 */
export async function deleteCandidate(id: string): Promise<void> {
  await db.candidates.delete(id);
}

/** 批量写入（导入用） */
export async function bulkPutCandidates(candidates: Candidate[]): Promise<void> {
  const now = new Date().toISOString();
  await db.candidates.bulkPut(candidates.map((c) => ({ ...c, updatedAt: now })));
}

/** 候选人总数 */
export async function countCandidates(): Promise<number> {
  return db.candidates.count();
}

// src/services/import/batch.ts — 批量导入编排（§8.5 / §9.3，并发不超过 3）
import { MAX_IMPORT_CONCURRENCY } from '@/constants/config';
import { parseFileToText } from './file-parser';
import { extractCandidateFromText, mergeExtracted } from './ai-extractor';
import { bulkPutCandidates } from '@/db/candidate.db';
import type { Candidate } from '@/types/candidate';

/** 进度回调 */
export interface BatchProgress {
  done: number;
  total: number;
  currentFile: string;
  errors: string[];
}

/** 简易并发池 */
async function pool<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

/**
 * 批量导入：文件 → 解析 → AI 提取 → 入库（§8.5 全流程）
 * @param files 待导入文件
 * @param onProgress 进度回调
 * @param confirm 是否已用户确认（确认后才真正入库）
 */
export async function batchImport(
  files: File[],
  onProgress: (p: BatchProgress) => void,
  confirm: boolean
): Promise<Candidate[]> {
  const progress: BatchProgress = { done: 0, total: files.length, currentFile: '', errors: [] };
  const extracted: Candidate[] = [];

  await pool(files, MAX_IMPORT_CONCURRENCY, async (file) => {
    progress.currentFile = file.name;
    try {
      const text = await parseFileToText(file);
      const partial = await extractCandidateFromText(text);
      extracted.push(mergeExtracted(partial));
    } catch (err) {
      progress.errors.push(`${file.name}: ${(err as Error).message}`);
    }
    progress.done++;
    onProgress({ ...progress });
  });

  if (confirm && extracted.length > 0) {
    await bulkPutCandidates(extracted);
  }
  return extracted;
}

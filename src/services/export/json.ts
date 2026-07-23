// src/services/export/json.ts — JSON 导出（完整数据，用于备份恢复，§13.2）
import { saveAs } from 'file-saver';
import type { Candidate } from '@/types/candidate';

/** 导出全部候选人为 JSON 备份文件 */
export function exportJson(candidates: Candidate[], filename = '人才库备份.json'): void {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    count: candidates.length,
    candidates
  };
  const json = JSON.stringify(payload, null, 2);
  saveAs(new Blob([json], { type: 'application/json;charset=utf-8' }), filename);
}

/** 从 JSON 备份恢复（解析校验） */
export function parseBackup(jsonText: string): Candidate[] {
  const data = JSON.parse(jsonText) as { candidates?: Candidate[] };
  if (!Array.isArray(data.candidates)) throw new Error('备份文件格式无效');
  return data.candidates;
}

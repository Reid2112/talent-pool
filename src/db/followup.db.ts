// src/db/followup.db.ts — 跟进记录表 CRUD（§3 db 层）
// 注：§4.1 中 followUpRecords 嵌在 Candidate 内，本模块提供对嵌入式数组的增删操作。
import { getCandidateById, updateCandidate } from './candidate.db';
import { genId } from '@/utils/id';
import type { FollowUpRecord } from '@/types/candidate';

/** 追加一条跟进记录 */
export async function addFollowUp(
  candidateId: string,
  record: Omit<FollowUpRecord, 'id' | 'createdAt'>
): Promise<string> {
  const candidate = await getCandidateById(candidateId);
  if (!candidate) throw new Error('候选人不存在');
  const newRecord: FollowUpRecord = {
    ...record,
    id: genId(),
    createdAt: new Date().toISOString()
  };
  await updateCandidate(candidateId, {
    followUpRecords: [newRecord, ...candidate.followUpRecords],
    lastContactDate: record.date,
    nextFollowUpDate: record.nextStep ? record.date : candidate.nextFollowUpDate
  });
  return newRecord.id;
}

/** 删除一条跟进记录 */
export async function removeFollowUp(
  candidateId: string,
  recordId: string
): Promise<void> {
  const candidate = await getCandidateById(candidateId);
  if (!candidate) throw new Error('候选人不存在');
  await updateCandidate(candidateId, {
    followUpRecords: candidate.followUpRecords.filter((r) => r.id !== recordId)
  });
}

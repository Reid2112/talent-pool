// src/db/skill-graph.db.ts — 本地技能图谱缓存（§10.1 第二层：AI 实时补充结果缓存）
import { db, type SkillGraphEdge } from './index';

export type { SkillGraphEdge };

/** 查询两个技能间的迁移关系（缓存命中则直接返回） */
export async function getTransferEdge(
  fromSkill: string,
  toSkill: string
): Promise<SkillGraphEdge | undefined> {
  return db.skillGraph.get(`${fromSkill}::${toSkill}`);
}

/** 写入/更新一条迁移关系缓存 */
export async function putTransferEdge(
  edge: Omit<SkillGraphEdge, 'key' | 'cachedAt'>
): Promise<void> {
  await db.skillGraph.put({
    ...edge,
    key: `${edge.fromSkill}::${edge.toSkill}`,
    cachedAt: new Date().toISOString()
  });
}

/** 清空缓存 */
export async function clearSkillGraph(): Promise<void> {
  await db.skillGraph.clear();
}

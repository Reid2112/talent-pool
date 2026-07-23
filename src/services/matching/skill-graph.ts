// src/services/matching/skill-graph.ts — 技能图谱遍历查询（§8.4 c / §10.1）
// 第一层：静态预设图谱（assets/skill-graph.json）；第二层：AI 实时补充（缓存到 db）。
import skillGraphData from '@/assets/skill-graph.json';
import { getTransferEdge, putTransferEdge } from '@/db/skill-graph.db';
import { withFallback } from '../ai/factory';
import { PROMPTS, fillTemplate } from '../ai/prompts';

interface StaticGraphNode {
  category: string;
  related: { skill: string; weight: number; reason: string }[];
}
type StaticGraph = { skills: Record<string, StaticGraphNode>; categories: Record<string, string[]> };

const STATIC_GRAPH = skillGraphData as unknown as StaticGraph;

/** 静态图谱查关联 */
export function queryStaticGraph(skill: string): { skill: string; weight: number; reason: string }[] {
  return STATIC_GRAPH.skills?.[skill]?.related ?? [];
}

/**
 * 查询候选人技能 → JD 技能的可迁移权重：
 * 先查静态图谱，再查本地缓存，最后 AI 实时分析并缓存（§10.1 第二层）。
 */
export async function getTransferWeight(
  candidateSkill: string,
  jdSkill: string
): Promise<{ weight: number; reason: string }> {
  // 1. 静态图谱直接命中
  const related = queryStaticGraph(candidateSkill).find((r) => r.skill === jdSkill);
  if (related) return { weight: related.weight, reason: related.reason };

  // 2. 本地缓存
  const cached = await getTransferEdge(candidateSkill, jdSkill);
  if (cached) return { weight: cached.weight, reason: cached.reason };

  // 3. AI 实时分析并缓存
  const prompt = fillTemplate(PROMPTS.SKILL_TRANSFER, {
    candidateSkill,
    jdSkill
  });
  const raw = await withFallback((p) =>
    p.chat([{ role: 'user', content: prompt }], { responseFormat: 'json_object' })
  );
  const parsed = JSON.parse(raw) as { isTransferable: boolean; weight: number; relationship: string };
  if (!parsed.isTransferable) return { weight: 0, reason: '不可迁移' };
  await putTransferEdge({
    fromSkill: candidateSkill,
    toSkill: jdSkill,
    weight: parsed.weight,
    reason: parsed.relationship
  });
  return { weight: parsed.weight, reason: parsed.relationship };
}

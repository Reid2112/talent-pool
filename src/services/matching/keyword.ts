// src/services/matching/keyword.ts — 关键词匹配算法（§8.4 a，纯逻辑无网络）
import type { Candidate } from '@/types/candidate';
import type { ParsedJD } from '@/types/search';

/**
 * 关键词匹配得分（0-100）：
 * - 技能名直接命中 +10/个（上限 50）
 * - 行业匹配 +15
 * - 岗位匹配 +15
 * - 公司匹配 +5
 * 总分映射到 0-100。
 */
export function keywordScore(candidate: Candidate, jd: ParsedJD): { score: number; hits: string[] } {
  let raw = 0;
  const hits: string[] = [];

  // 技能命中
  const candSkills = new Set(candidate.skills.map((s) => s.name.toLowerCase()));
  const jdSkills = [...jd.requiredSkills, ...jd.preferredSkills].map((s) => s.toLowerCase());
  let skillHit = 0;
  for (const sk of jdSkills) {
    if (candSkills.has(sk)) {
      skillHit += 10;
      hits.push(sk);
    }
  }
  raw += Math.min(skillHit, 50);

  // 行业匹配
  if (jd.industry.some((ind) => candidate.industry.includes(ind))) {
    raw += 15;
    hits.push('行业');
  }

  // 岗位匹配
  if (jd.title && candidate.currentPosition.includes(jd.title)) {
    raw += 15;
    hits.push('岗位');
  }

  // 公司匹配
  if (jd.responsibilities?.some((r) => candidate.currentCompany.includes(r))) {
    raw += 5;
  }

  // 映射到 0-100（raw 上限约 85）
  return { score: Math.min(100, Math.round((raw / 85) * 100)), hits };
}

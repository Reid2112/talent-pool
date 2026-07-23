// src/services/matching/scorer.ts — 多维度加权打分与排序（§8.4 d / §10.2，纯逻辑）
import type { MatchBreakdown, MatchResult, MatchWeights } from '@/types/search';
import type { Candidate } from '@/types/candidate';
import { defaultMatchWeights } from '@/types/search';

/**
 * 综合得分 = Σ(维度得分 × 权重)
 * 权重默认：语义 0.4 / 关键词 0.3 / 迁移 0.2 / 硬条件 0.1（§10.2）
 */
export function computeOverallScore(breakdown: MatchBreakdown, weights: MatchWeights = defaultMatchWeights): number {
  const total =
    breakdown.semanticScore * weights.semantic +
    breakdown.keywordScore * weights.keyword +
    breakdown.skillGraphScore * weights.skillGraph +
    breakdown.experienceScore * weights.hardCondition * 0.5 +
    breakdown.locationScore * weights.hardCondition * 0.5;
  return Math.round(Math.min(100, total));
}

/** 仅计算工作年限得分（0-100） */
export function experienceScore(candidate: Candidate, jd: import('@/types/search').ParsedJD): number {
  const min = jd.yearsRequired?.min ?? 0;
  if (candidate.yearsOfExperience < min - 2) return 0;
  if (candidate.yearsOfExperience >= min) return 100;
  // ±2 年内梯度
  const diff = candidate.yearsOfExperience - (min - 2);
  return Math.round((diff / 2) * 100);
}

/** 仅计算地点匹配得分（0-100） */
export function locationScore(candidate: Candidate, jd: import('@/types/search').ParsedJD): number {
  if (!jd.location) return 50; // 无地点要求 → 中等分
  if (candidate.currentLocation === jd.location) return 100;
  if (candidate.willingToRelocate) return 50;
  return 0;
}

/** 按综合得分降序排序 */
export function rankByScore(results: MatchResult[]): MatchResult[] {
  return [...results].sort((a, b) => b.overallScore - a.overallScore);
}

/** 占位：生成 MatchResult（语义/迁移维度 Phase 2 接入 AI 后填充） */
export function buildMatchResult(
  candidate: Candidate,
  breakdown: MatchBreakdown,
  explanation: string
): MatchResult {
  return {
    candidate,
    overallScore: computeOverallScore(breakdown),
    breakdown,
    explanation,
    transferableSkills: []
  };
}

// src/types/search.ts — JD 搜索与匹配结果（§4.2）
import type { Candidate } from './candidate';

/** 原始 JD */
export interface JobDescription {
  rawText: string;
  parsedInfo?: ParsedJD;
}

/** AI 解析后的结构化 JD */
export interface ParsedJD {
  title: string;
  industry: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  yearsRequired: { min: number; max?: number };
  location: string;
  education?: string;
  responsibilities: string[];
  keywords: string[];
  embedding?: number[];
}

/** 匹配维度得分明细 */
export interface MatchBreakdown {
  keywordScore: number; // 关键词匹配 0-100
  semanticScore: number; // 语义相似度 0-100
  skillGraphScore: number; // 技能图谱迁移 0-100
  experienceScore: number; // 年限/经验 0-100
  locationScore: number; // 地点 0-100
}

/** 可迁移技能说明 */
export interface TransferableSkill {
  candidateSkill: string;
  jdSkill: string;
  relationship: string;
  weight: number; // 0-1
}

/** 单个候选人匹配结果 */
export interface MatchResult {
  candidate: Candidate;
  overallScore: number; // 综合匹配度 0-100
  breakdown: MatchBreakdown;
  explanation: string;
  transferableSkills: TransferableSkill[];
}

/** §10.2 匹配权重配置（默认值，可在设置中微调） */
export interface MatchWeights {
  semantic: number; // 语义 0-1，默认 0.4
  keyword: number; // 关键词 0-1，默认 0.3
  skillGraph: number; // 技能迁移 0-1，默认 0.2
  hardCondition: number; // 硬条件 0-1，默认 0.1
}

export const defaultMatchWeights: MatchWeights = {
  semantic: 0.4,
  keyword: 0.3,
  skillGraph: 0.2,
  hardCondition: 0.1
};

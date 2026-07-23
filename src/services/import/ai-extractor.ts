// src/services/import/ai-extractor.ts — 调用 AI 从文本提取结构化候选人信息（§8.5 步骤 2）
import { withFallback } from '../ai/factory';
import { PROMPTS, fillTemplate } from '../ai/prompts';
import type { Candidate } from '@/types/candidate';
import { genId } from '@/utils/id';
import { createEmptyCandidate } from '@/types/candidate';

/** 从文本提取候选人（部分字段） */
export async function extractCandidateFromText(text: string): Promise<Partial<Candidate>> {
  const raw = await withFallback((p) =>
    p.chat(
      [
        { role: 'system', content: '你是资深猎头顾问助手，只返回 JSON，找不到的字段留空，不要编造。' },
        { role: 'user', content: fillTemplate(PROMPTS.RESUME_EXTRACTION, { resumeText: text }) }
      ],
      { responseFormat: 'json_object' }
    )
  );
  try {
    return JSON.parse(raw) as Partial<Candidate>;
  } catch {
    throw new Error('AI 返回内容解析失败，请重试或手动录入');
  }
}

/** 合并提取结果到空候选人模板 */
export function mergeExtracted(extracted: Partial<Candidate>): Candidate {
  return { ...createEmptyCandidate(genId()), ...extracted, updatedAt: new Date().toISOString() };
}

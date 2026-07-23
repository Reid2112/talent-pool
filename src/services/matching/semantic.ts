// src/services/matching/semantic.ts — 语义向量匹配（§8.4 b，需调用 AI embedding）
import { withFallback } from '../ai/factory';
import { getActiveAIProvider } from '../ai/factory';

/** 余弦相似度 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/** 生成文本向量 */
export async function embed(text: string): Promise<number[]> {
  const provider = getActiveAIProvider();
  const vecs = await provider.embed([text]);
  return vecs[0];
}

/** 语义相似度得分 0-100（JD 向量 · 候选人画像向量） */
export async function semanticScore(jdEmbedding: number[], candidateText: string): Promise<number> {
  const candEmbedding = await withFallback((p) => p.embed([candidateText])).then((v) => v[0]);
  const sim = cosineSimilarity(jdEmbedding, candEmbedding); // -1..1
  // 映射 0..1 → 0..100
  return Math.round(Math.max(0, (sim + 1) / 2) * 100);
}

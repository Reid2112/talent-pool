// src/services/matching/matcher.ts — 主匹配流程（§8.4）
// JD 解析 → 生成语义向量 → 对每个候选人四维得分 → 加权综合排序
import type { Candidate } from '@/types/candidate';
import type { JobDescription, MatchResult, ParsedJD } from '@/types/search';
import { withFallback } from '../ai/factory';
import { PROMPTS, fillTemplate } from '../ai/prompts';
import { keywordScore } from './keyword';
import { experienceScore, locationScore, buildMatchResult, rankByScore } from './scorer';
import { semanticScore, embed } from './semantic';
import { getTransferWeight } from './skill-graph';

/** 解析 JD（§8.4 步骤 1） */
export async function parseJD(jdText: string): Promise<ParsedJD> {
  const raw = await withFallback((p) =>
    p.chat(
      [
        { role: 'system', content: '你是资深猎头顾问，只返回 JSON。' },
        { role: 'user', content: fillTemplate(PROMPTS.JD_PARSING, { jdText }) }
      ],
      { responseFormat: 'json_object' }
    )
  );
  return JSON.parse(raw) as ParsedJD;
}

/** 对全部候选人执行匹配（§8.4 全流程） */
export async function matchCandidates(
  jd: JobDescription,
  candidates: Candidate[]
): Promise<MatchResult[]> {
  const parsed = jd.parsedInfo ?? (await parseJD(jd.rawText));
  const jdEmbedding = parsed.embedding ?? (await embed(jd.rawText));

  const results = await Promise.all(
    candidates.map(async (c) => {
      const kw = keywordScore(c, parsed);
      const sem = await semanticScore(jdEmbedding, candidateToText(c)).catch(() => 0);
      const exp = experienceScore(c, parsed);
      const loc = locationScore(c, parsed);

      // 技能迁移：遍历 JD 必须技能，找候选人可迁移技能的最大权重
      let maxTransfer = 0;
      for (const jdSkill of parsed.requiredSkills) {
        for (const candSkill of c.skills.map((s) => s.name)) {
          const { weight } = await getTransferWeight(candSkill, jdSkill).catch(() => ({ weight: 0, reason: '' }));
          maxTransfer = Math.max(maxTransfer, weight);
        }
      }

      const breakdown = {
        keywordScore: kw.score,
        semanticScore: sem,
        skillGraphScore: Math.round(maxTransfer * 100),
        experienceScore: exp,
        locationScore: loc
      };
      return buildMatchResult(c, breakdown, kw.hits.length ? `命中：${kw.hits.join('、')}` : '关键词未直接命中');
    })
  );

  return rankByScore(results);
}

/** 候选人画像文本（用于语义向量） */
function candidateToText(c: Candidate): string {
  return [c.currentPosition, c.currentCompany, ...c.skills.map((s) => s.name), ...c.autoTags, ...c.industry].join(' ');
}

// src/db/index.ts — Dexie 实例初始化 + 数据库版本定义（§3 db 层）
import Dexie, { type Table } from 'dexie';
import type { Candidate } from '@/types/candidate';

/** 技能图谱迁移关系缓存条目（AI 实时补充，§10.1 第二层） */
export interface SkillGraphEdge {
  key: string; // `${fromSkill}::${toSkill}`
  fromSkill: string;
  toSkill: string;
  weight: number;
  reason: string;
  cachedAt: string;
}

/** 数据库表结构 */
export interface AppDB {
  candidates: Table<Candidate, string>;
  skillGraph: Table<SkillGraphEdge, string>;
}

/** Dexie 单例 */
export const db = new Dexie('TalentPoolDB') as Dexie & AppDB;

db.version(1).stores({
  // 主键 id；索引常用筛选/排序字段
  candidates:
    'id, createdAt, updatedAt, contactStatus, isStarred, isArchived, currentLocation, name',
  // 技能图谱迁移关系缓存
  skillGraph: 'key, fromSkill, toSkill'
});

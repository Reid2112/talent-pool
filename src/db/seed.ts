// src/db/seed.ts — 首启示例数据（仅当库为空时写入，便于演示验证）
import { db } from './index';
import { createEmptyCandidate } from '@/types/candidate';
import { genId } from '@/utils/id';
import type { Candidate } from '@/types/candidate';

const SAMPLES: Array<Partial<Candidate> & { name: string }> = [
  {
    name: '张伟',
    currentPosition: '高级前端工程师',
    currentCompany: '字节跳动',
    yearsOfExperience: 8,
    currentLocation: '北京',
    industry: ['互联网'],
    phone: '138-****-1234',
    email: 'zhangwei@bytedance.com',
    wechat: 'zhangwei_dev',
    contactStatus: 'contacted',
    isStarred: true,
    skills: [
      { name: 'React', level: 5, category: 'framework' },
      { name: 'TypeScript', level: 4, category: 'programming_language' },
      { name: '性能优化', level: 4, category: 'domain_knowledge' },
      { name: '工程化', level: 4, category: 'domain_knowledge' }
    ],
    expectedSalary: { amount: 80000, months: 15, type: 'monthly' },
    currentSalary: { amount: 60000, months: 15, type: 'monthly' },
    generalNotes: '朋友圈口碑好，技术深度不错，团队管理有经验。建议重点推。',
    nextFollowUpDate: new Date().toISOString().slice(0, 10)
  },
  {
    name: '李娜',
    currentPosition: '后端架构师',
    currentCompany: '腾讯',
    yearsOfExperience: 10,
    currentLocation: '深圳',
    industry: ['互联网'],
    contactStatus: 'interviewing',
    skills: [
      { name: 'Go', level: 5, category: 'programming_language' },
      { name: '分布式系统', level: 5, category: 'domain_knowledge' }
    ],
    expectedSalary: { amount: 90000, months: 16, type: 'monthly' }
  },
  {
    name: '王强',
    currentPosition: '算法专家',
    currentCompany: '商汤科技',
    yearsOfExperience: 6,
    currentLocation: '上海',
    industry: ['人工智能'],
    contactStatus: 'new',
    skills: [
      { name: '机器学习', level: 5, category: 'domain_knowledge' },
      { name: '计算机视觉', level: 4, category: 'domain_knowledge' }
    ]
  },
  {
    name: '陈静',
    currentPosition: '产品经理',
    currentCompany: '美团',
    yearsOfExperience: 7,
    currentLocation: '北京',
    industry: ['互联网'],
    contactStatus: 'offered',
    isStarred: true,
    skills: [{ name: 'B端产品', level: 5, category: 'domain_knowledge' }]
  }
];

/** 若库为空，写入示例数据 */
export async function seedIfEmpty(): Promise<void> {
  const count = await db.candidates.count();
  if (count > 0) return;
  const now = new Date().toISOString();
  const candidates: Candidate[] = SAMPLES.map((s) => ({
    ...createEmptyCandidate(genId()),
    ...s,
    createdAt: now,
    updatedAt: now
  } as Candidate));
  await db.candidates.bulkPut(candidates);
}

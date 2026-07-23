// src/types/candidate.ts — 候选人相关所有类型（§4.1）

/** 技能分类 */
export type SkillCategory =
  | 'programming_language'
  | 'framework'
  | 'tool'
  | 'domain_knowledge'
  | 'soft_skill'
  | 'other';

/** 技能（含熟练度 1-5） */
export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: SkillCategory;
}

/** 学历 */
export type Degree = 'associate' | 'bachelor' | 'master' | 'phd' | 'other';

/** 教育经历 */
export interface Education {
  school: string;
  degree: Degree;
  major: string;
  startYear: number;
  endYear: number;
}

/** 历任公司 */
export interface PreviousCompany {
  name: string;
  position: string;
  startYear: number;
  endYear?: number; // 空表示至今
  description?: string;
}

/** 重点项目 */
export interface Project {
  name: string;
  role: string;
  description: string;
  highlights: string[];
  startDate?: string;
  endDate?: string;
}

/** 薪资 */
export interface Salary {
  amount: number; // 月薪（元）
  months: number; // 年薪月份数 12/13/14/15...
  type: 'monthly' | 'annual' | 'hourly';
}

/** 联系状态（§1.2 状态机） */
export type ContactStatus =
  | 'new' // 待联系
  | 'contacted' // 已联系
  | 'interviewing' // 面试中
  | 'offered' // 已发Offer
  | 'onboarded' // 已入职
  | 'declined' // 暂不考虑
  | 'archived'; // 已归档

/** 跟进记录 */
export interface FollowUpRecord {
  id: string;
  date: string;
  method: 'phone' | 'wechat' | 'email' | 'meeting' | 'other';
  summary: string;
  attitude?: string;
  nextStep?: string;
  createdAt: string;
}

/** 录入方式 */
export type ImportSource =
  | 'manual'
  | 'resume_pdf'
  | 'resume_word'
  | 'photo'
  | 'voice'
  | 'video'
  | 'batch';

/** 原始文件引用 */
export interface SourceFileRef {
  id: string;
  originalName: string;
  type: 'pdf' | 'word' | 'image' | 'audio' | 'video';
  processedAt: string;
  deleted: boolean;
}

/** 候选人（核心实体） */
export interface Candidate {
  id: string;
  createdAt: string;
  updatedAt: string;

  // === 基本信息 ===
  name: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthYear?: number;
  phone?: string;
  email?: string;
  wechat?: string;
  otherContact?: string;

  // === 职业信息 ===
  industry: string[];
  currentPosition: string;
  subPositions: string[];
  yearsOfExperience: number;
  currentCompany: string;
  previousCompanies: PreviousCompany[];

  // === 技能 ===
  skills: Skill[];
  autoTags: string[];

  // === 项目经验 ===
  projectTypes: string[];
  keyProjects: Project[];

  // === 教育 ===
  education: Education[];

  // === 薪资 ===
  currentSalary?: Salary;
  expectedSalary?: Salary;
  salaryNegotiable: boolean;

  // === 地点 ===
  currentLocation: string;
  willingToRelocate: boolean;
  preferredLocations: string[];

  // === 联系状态 ===
  contactStatus: ContactStatus;
  lastContactDate?: string;
  nextFollowUpDate?: string;

  // === 跟进记录 ===
  followUpRecords: FollowUpRecord[];

  // === 备注 ===
  generalNotes: string;
  customTags: string[];
  customFields: Record<string, string>;

  // === 来源 ===
  importSource: ImportSource;
  sourceFiles: SourceFileRef[];

  // === 收藏 / 归档 ===
  isStarred: boolean;
  isArchived: boolean;
}

/** 新建候选人时的默认值工厂 */
export function createEmptyCandidate(id: string): Candidate {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    name: '',
    industry: [],
    currentPosition: '',
    subPositions: [],
    yearsOfExperience: 0,
    currentCompany: '',
    previousCompanies: [],
    skills: [],
    autoTags: [],
    projectTypes: [],
    keyProjects: [],
    education: [],
    salaryNegotiable: true,
    currentLocation: '',
    willingToRelocate: false,
    preferredLocations: [],
    contactStatus: 'new',
    followUpRecords: [],
    generalNotes: '',
    customTags: [],
    customFields: {},
    importSource: 'manual',
    sourceFiles: [],
    isStarred: false,
    isArchived: false
  };
}

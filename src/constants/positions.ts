// src/constants/positions.ts — 岗位分类常量
export const POSITIONS = [
  '前端开发',
  '后端开发',
  '移动开发',
  '全栈开发',
  '算法工程师',
  '数据工程师',
  '测试工程师',
  '运维/DevOps',
  '安全工程师',
  '产品经理',
  '项目经理',
  '设计师',
  '数据分析',
  '运营',
  '市场',
  '销售',
  'HR',
  '财务',
  '架构师',
  '技术管理'
] as const;

export type Position = (typeof POSITIONS)[number];

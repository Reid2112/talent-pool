// src/constants/industries.ts — 行业分类常量
export const INDUSTRIES = [
  '互联网',
  '金融',
  '制造',
  '医疗健康',
  '教育',
  '电商零售',
  '企业服务',
  '文娱游戏',
  '汽车出行',
  '物流',
  '房地产',
  '新能源',
  '半导体',
  '人工智能',
  '通信'
] as const;

export type Industry = (typeof INDUSTRIES)[number];

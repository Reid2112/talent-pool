// src/constants/locations.ts — 城市/地区常量
export const LOCATIONS = [
  '北京',
  '上海',
  '深圳',
  '广州',
  '杭州',
  '成都',
  '南京',
  '武汉',
  '苏州',
  '西安',
  '厦门',
  '长沙',
  '重庆',
  '天津',
  '青岛',
  '合肥',
  '远程'
] as const;

export type Location = (typeof LOCATIONS)[number];

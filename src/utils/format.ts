// src/utils/format.ts — 日期、薪资、百分比格式化
import dayjs from 'dayjs';
import type { Salary } from '@/types/candidate';

/** 格式化日期 YYYY-MM-DD */
export function formatDate(date?: string | Date): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

/** 格式化日期时间 YYYY-MM-DD HH:mm */
export function formatDateTime(date?: string | Date): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

/** 相对时间（如「3 天前」） */
export function formatRelative(date?: string | Date): string {
  if (!date) return '';
  const d = dayjs(date);
  const now = dayjs();
  const diffDay = now.diff(d, 'day');
  if (diffDay === 0) return '今天';
  if (diffDay === 1) return '昨天';
  if (diffDay < 7) return `${diffDay} 天前`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} 周前`;
  return d.format('YYYY-MM-DD');
}

/** 格式化薪资：60K × 15 个月 */
export function formatSalary(salary?: Salary): string {
  if (!salary) return '面议';
  const k = Math.round(salary.amount / 1000);
  return `${k}K × ${salary.months} 个月`;
}

/** 格式化百分比 0-100 → "92%" */
export function formatPercent(score: number): string {
  return `${Math.round(score)}%`;
}

/** 工作年限展示 */
export function formatYears(years: number): string {
  return `${years} 年`;
}

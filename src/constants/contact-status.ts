// src/constants/contact-status.ts — 联系状态枚举与显示映射（§1.2 状态机）
import type { ContactStatus } from '@/types/candidate';

/** 状态显示映射：label + Tailwind 配色（soft 背景 / 文字色） */
export interface StatusMeta {
  value: ContactStatus;
  label: string;
  /** soft 背景色 class */
  softBg: string;
  /** 文字色 class */
  text: string;
  /** 状态机下一步可流转到的状态 */
  next: ContactStatus[];
}

export const STATUS_META: Record<ContactStatus, StatusMeta> = {
  new: {
    value: 'new',
    label: '待联系',
    softBg: 'bg-slate-100',
    text: 'text-slate-500',
    next: ['contacted', 'declined']
  },
  contacted: {
    value: 'contacted',
    label: '已联系',
    softBg: 'bg-blue-50',
    text: 'text-blue-600',
    next: ['interviewing', 'declined']
  },
  interviewing: {
    value: 'interviewing',
    label: '面试中',
    softBg: 'bg-violet-50',
    text: 'text-violet-600',
    next: ['offered', 'declined']
  },
  offered: {
    value: 'offered',
    label: '已发Offer',
    softBg: 'bg-amber-50',
    text: 'text-amber-600',
    next: ['onboarded', 'declined']
  },
  onboarded: {
    value: 'onboarded',
    label: '已入职',
    softBg: 'bg-green-50',
    text: 'text-green-600',
    next: ['archived']
  },
  declined: {
    value: 'declined',
    label: '暂不考虑',
    softBg: 'bg-red-50',
    text: 'text-red-600',
    next: ['new', 'archived']
  },
  archived: {
    value: 'archived',
    label: '已归档',
    softBg: 'bg-slate-100',
    text: 'text-slate-400',
    next: ['new']
  }
};

/** 状态机主流程顺序（用于步进器展示） */
export const STATUS_FLOW: ContactStatus[] = ['new', 'contacted', 'interviewing', 'offered', 'onboarded'];

/** 分支状态（非主流程） */
export const STATUS_BRANCHES: ContactStatus[] = ['declined', 'archived'];

/** 全部状态列表 */
export const ALL_STATUSES: ContactStatus[] = [...STATUS_FLOW, ...STATUS_BRANCHES];

/** 获取状态显示元数据 */
export function getStatusMeta(status: ContactStatus): StatusMeta {
  return STATUS_META[status];
}

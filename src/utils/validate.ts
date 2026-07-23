// src/utils/validate.ts — 通用校验函数
import { z } from 'zod';

/** 手机号校验（宽松：1 开头 11 位） */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value.replace(/[\s-]/g, ''));
}

/** 邮箱校验 */
export function isEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

/** 微信号校验（字母开头，6-20 位，允许字母数字下划线减号） */
export function isWechat(value: string): boolean {
  return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(value);
}

/** 是否为空字符串 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** PIN 码校验：6 位数字 */
export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

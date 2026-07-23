// src/services/auth/pin.ts — PIN 码设置与验证（§11.2）
// 使用 SHA-256 哈希存储，不存明文。
import { STORAGE_KEYS } from '@/constants/config';
import { isValidPin } from '@/utils/validate';

/** SHA-256 → 十六进制字符串 */
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 设置 PIN 码（哈希后存储） */
export async function setPinCode(pin: string): Promise<void> {
  if (!isValidPin(pin)) throw new Error('PIN 码必须为 6 位数字');
  localStorage.setItem(STORAGE_KEYS.pinHash, await sha256Hex(pin));
}

/** 是否已设置 PIN */
export function hasPinSet(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.pinHash);
}

/** 清除 PIN */
export function clearPin(): void {
  localStorage.removeItem(STORAGE_KEYS.pinHash);
}

/** 验证 PIN 码 */
export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.pinHash);
  if (!stored) return true; // 未设置则不拦截
  if (!isValidPin(pin)) return false;
  const hash = await sha256Hex(pin);
  return hash === stored;
}

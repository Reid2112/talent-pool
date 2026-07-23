// src/utils/id.ts — 本地唯一 ID 生成
import { customAlphabet } from 'nanoid';

// 排除易混字符的短 ID
const nanoid = customAlphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz', 16);

/** 生成 16 位本地唯一 ID */
export function genId(): string {
  return nanoid();
}

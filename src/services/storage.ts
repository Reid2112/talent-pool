// src/services/storage.ts — 本地存储管理（API Key、头像、附件，§9.1 / §12.2）
import { STORAGE_KEYS } from '@/constants/config';
import type { ProviderId } from '@/types/ai';

/** Base64 混淆（§9.1 至少 Base64 混淆，非强加密） */
function obfuscate(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function deobfuscate(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** 读取 API Key（按 Provider） */
export function getApiKey(provider: ProviderId): string | null {
  const key = provider === 'deepseek' ? STORAGE_KEYS.deepseekApiKey : STORAGE_KEYS.tongyiApiKey;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return deobfuscate(raw);
  } catch {
    return null;
  }
}

/** 保存 API Key（混淆存储） */
export function setApiKey(provider: ProviderId, apiKey: string): void {
  const key = provider === 'deepseek' ? STORAGE_KEYS.deepseekApiKey : STORAGE_KEYS.tongyiApiKey;
  localStorage.setItem(key, obfuscate(apiKey));
}

/** 清除某 Provider 的 Key */
export function clearApiKey(provider: ProviderId): void {
  const key = provider === 'deepseek' ? STORAGE_KEYS.deepseekApiKey : STORAGE_KEYS.tongyiApiKey;
  localStorage.removeItem(key);
}

/** 当前激活 Provider */
export function getActiveProvider(): ProviderId {
  return (localStorage.getItem(STORAGE_KEYS.activeProvider) as ProviderId) ?? 'deepseek';
}
export function setActiveProvider(provider: ProviderId): void {
  localStorage.setItem(STORAGE_KEYS.activeProvider, provider);
}

/** 头像存 IndexedDB 太重，此处暂存内存 URL 映射；正式可扩展为 IndexedDB Blob。 */
const avatarStore = new Map<string, string>();
export function setAvatar(id: string, dataUrl: string): void {
  avatarStore.set(id, dataUrl);
}
export function getAvatar(id: string): string | undefined {
  return avatarStore.get(id);
}

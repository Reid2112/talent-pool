// src/utils/preferences.ts — 用户偏好设置（localStorage）
const KEY_USER_NAME = 'tp_user_name';
const DEFAULT_NAME = '猎头顾问';

export function getUserName(): string {
  return localStorage.getItem(KEY_USER_NAME) || DEFAULT_NAME;
}

export function setUserName(name: string): void {
  localStorage.setItem(KEY_USER_NAME, name.trim() || DEFAULT_NAME);
}

// src/utils/onboarding.ts — 引导页完成状态（独立模块，避免循环依赖）
const KEY = 'tp_onboarding_done';

export function isOnboardingDone(): boolean {
  return localStorage.getItem(KEY) === 'true';
}

export function setOnboardingDone(): void {
  localStorage.setItem(KEY, 'true');
}

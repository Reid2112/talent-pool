// src/stores/auth.store.ts — 锁屏状态（§7.1 / §11）
import { create } from 'zustand';
import { STORAGE_KEYS, LOCK_CONFIG } from '@/constants/config';
import { hasPinSet, verifyPin, setPinCode, clearPin } from '@/services/auth/pin';
import { isBiometricSupported, verifyBiometric } from '@/services/auth/biometric';

interface AuthStore {
  isLocked: boolean;
  isLockEnabled: boolean;
  hasPinSet: boolean;
  biometricEnabled: boolean;
  failedAttempts: number;
  lockUntil: number;

  init: () => Promise<void>;
  lock: () => void;
  unlock: (pin: string) => Promise<boolean>;
  unlockWithBiometric: () => Promise<boolean>;
  setLockEnabled: (enabled: boolean) => void;
  setupPin: (pin: string) => Promise<void>;
  disableLock: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLocked: false,
  isLockEnabled: false,
  hasPinSet: false,
  biometricEnabled: false,
  failedAttempts: 0,
  lockUntil: 0,

  init: async () => {
    const enabled = localStorage.getItem(STORAGE_KEYS.lockEnabled) === 'true';
    const bio = localStorage.getItem(STORAGE_KEYS.biometricEnabled) === 'true';
    set({
      isLockEnabled: enabled,
      hasPinSet: hasPinSet(),
      biometricEnabled: bio,
      isLocked: enabled && hasPinSet()
    });
  },

  lock: () => {
    if (get().isLockEnabled) set({ isLocked: true });
  },

  unlock: async (pin) => {
    const now = Date.now();
    if (get().lockUntil > now) {
      throw new Error(`错误次数过多，请于 ${Math.ceil((get().lockUntil - now) / 1000)} 秒后重试`);
    }
    const ok = await verifyPin(pin);
    if (ok) {
      set({ isLocked: false, failedAttempts: 0, lockUntil: 0 });
      return true;
    }
    const attempts = get().failedAttempts + 1;
    const lockUntil = attempts >= LOCK_CONFIG.maxFailedAttempts ? now + LOCK_CONFIG.failedLockDurationMs : 0;
    set({ failedAttempts: attempts, lockUntil });
    return false;
  },

  unlockWithBiometric: async () => {
    if (!isBiometricSupported()) return false;
    const ok = await verifyBiometric();
    if (ok) set({ isLocked: false, failedAttempts: 0, lockUntil: 0 });
    return ok;
  },

  setLockEnabled: (enabled) => {
    localStorage.setItem(STORAGE_KEYS.lockEnabled, String(enabled));
    set({ isLockEnabled: enabled, isLocked: false });
  },

  setupPin: async (pin) => {
    await setPinCode(pin);
    set({ hasPinSet: true });
  },

  disableLock: () => {
    clearPin();
    localStorage.removeItem(STORAGE_KEYS.lockEnabled);
    localStorage.removeItem(STORAGE_KEYS.biometricEnabled);
    set({ isLockEnabled: false, hasPinSet: false, isLocked: false, biometricEnabled: false });
  }
}));

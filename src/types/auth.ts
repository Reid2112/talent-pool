// src/types/auth.ts — 锁屏相关类型（§11）

/** 锁屏状态 */
export interface LockState {
  isLocked: boolean;
  isLockEnabled: boolean;
  hasPinSet: boolean;
  biometricEnabled: boolean;
  /** 错误次数（5 次错误锁定 1 分钟，§11.2） */
  failedAttempts: number;
  /** 锁定截止时间戳（毫秒），0 表示未锁定 */
  lockUntil: number;
}

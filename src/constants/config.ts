// src/constants/config.ts — 全局配置（API Key 存储键名、锁屏参数等）

/** localStorage 键名 */
export const STORAGE_KEYS = {
  deepseekApiKey: 'tp_deepseek_api_key',
  tongyiApiKey: 'tp_tongyi_api_key',
  activeProvider: 'tp_active_provider',
  pinHash: 'tp_pin_hash',
  biometricEnabled: 'tp_biometric_enabled',
  lockEnabled: 'tp_lock_enabled',
  lockTimeoutMs: 'tp_lock_timeout_ms',
  matchWeights: 'tp_match_weights'
} as const;

/** 锁屏参数（§11.2） */
export const LOCK_CONFIG = {
  /** 切后台超过该毫秒数自动锁定 */
  autoLockTimeoutMs: 30_000,
  /** PIN 错误次数上限 */
  maxFailedAttempts: 5,
  /** 超过上限后锁定时长（毫秒） */
  failedLockDurationMs: 60_000,
  /** PIN 长度 */
  pinLength: 6
} as const;

/** DeepSeek API（§9.4） */
export const DEEPSEEK_CONFIG = {
  endpoint: 'https://api.deepseek.com/v1',
  chatModel: 'deepseek-chat',
  embeddingModel: 'deepseek-embedding',
  requestTimeoutMs: 30_000
} as const;

/** 通义千问 API */
export const TONGYI_CONFIG = {
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  chatModel: 'qwen-plus',
  requestTimeoutMs: 30_000
} as const;

/** 导入并发上限（§9.3） */
export const MAX_IMPORT_CONCURRENCY = 3;

/** 搜索防抖延迟（§9.3 800ms） */
export const SEARCH_DEBOUNCE_MS = 800;

/** 列表分页大小 */
export const PAGE_SIZE = 20;

// src/hooks/useAuth.ts — 锁屏验证 + 自动锁定（§3 hooks 层 / §11.2）
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { LOCK_CONFIG } from '@/constants/config';

export function useAuth() {
  const store = useAuthStore();

  // 初始化
  useEffect(() => {
    void store.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切后台超过 30s 自动锁定（§11.2）
  useEffect(() => {
    if (!store.isLockEnabled) return;
    let hiddenAt = 0;
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
      } else if (document.visibilityState === 'visible' && hiddenAt) {
        if (Date.now() - hiddenAt > LOCK_CONFIG.autoLockTimeoutMs) store.lock();
        hiddenAt = 0;
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [store.isLockEnabled, store]);

  return store;
}

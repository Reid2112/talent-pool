// src/services/ai/factory.ts — AI Provider 工厂（按配置选择 + 降级，§9.2）
import { DeepSeekProvider } from './deepseek';
import { TongyiProvider } from './tongyi';
import { getActiveProvider, getApiKey } from '../storage';
import type { AIProvider, ProviderId } from '@/types/ai';

const providers: Record<ProviderId, () => AIProvider> = {
  deepseek: () => new DeepSeekProvider(),
  tongyi: () => new TongyiProvider()
};

/** 是否已配置某 Provider */
export function hasProvider(provider: ProviderId): boolean {
  return !!getApiKey(provider);
}

/** 当前激活的 Provider 实例 */
export function getActiveAIProvider(): AIProvider {
  return providers[getActiveProvider()]();
}

/**
 * 执行 AI 调用，自动降级（§9.2）：
 * 默认 DeepSeek → 失败且配置了通义 → 切换通义 → 仍失败 → 抛出。
 */
export async function withFallback<T>(action: (p: AIProvider) => Promise<T>): Promise<T> {
  const active = getActiveProvider();
  try {
    return await action(providers[active]());
  } catch (err) {
    const fallback: ProviderId = active === 'deepseek' ? 'tongyi' : 'deepseek';
    if (fallback !== active && hasProvider(fallback)) {
      return await action(providers[fallback]());
    }
    throw err;
  }
}

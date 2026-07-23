// src/services/ai/index.ts — AI 服务统一导出
export * from './types';
export * from './prompts';
export { DeepSeekProvider } from './deepseek';
export { TongyiProvider } from './tongyi';
export { getActiveAIProvider, hasProvider, withFallback } from './factory';

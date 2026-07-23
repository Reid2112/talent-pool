// src/types/ai.ts — AI 请求/响应类型（§8.2）

/** 对话角色 */
export type ChatRole = 'system' | 'user' | 'assistant';

/** 对话消息 */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** 对话补全选项 */
export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json_object';
}

/** AI Provider 统一接口（§8.2） */
export interface AIProvider {
  name: string;
  /** 对话补全 */
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>;
  /** 生成文本嵌入向量 */
  embed(texts: string[]): Promise<number[][]>;
  /** 视觉理解（图片/视频帧） */
  vision(imageBase64: string, prompt: string): Promise<string>;
  /** 语音转文字 */
  speechToText(audioBase64: string): Promise<string>;
}

/** Provider 标识 */
export type ProviderId = 'deepseek' | 'tongyi';

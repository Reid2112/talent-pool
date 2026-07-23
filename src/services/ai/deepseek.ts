// src/services/ai/deepseek.ts — DeepSeek API 封装（§9.4，OpenAI 兼容格式）
import { DEEPSEEK_CONFIG } from '@/constants/config';
import { getApiKey } from '../storage';
import type { AIProvider, ChatMessage, ChatOptions } from '@/types/ai';

/** 带 30s 超时的 fetch（§15.6） */
async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';

  private get key(): string {
    const k = getApiKey('deepseek');
    if (!k) throw new Error('未配置 DeepSeek API Key，请在设置页填写');
    return k;
  }

  private get headers(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.key}`
    };
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const res = await fetchWithTimeout(
      `${DEEPSEEK_CONFIG.endpoint}/chat/completions`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.chatModel,
          messages,
          temperature: options?.temperature ?? 0.3,
          max_tokens: options?.maxTokens,
          response_format: options?.responseFormat === 'json_object' ? { type: 'json_object' } : undefined
        })
      },
      DEEPSEEK_CONFIG.requestTimeoutMs
    );
    if (!res.ok) throw new Error(`DeepSeek 请求失败：${res.status} ${await res.text()}`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    return data.choices[0].message.content;
  }

  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetchWithTimeout(
      `${DEEPSEEK_CONFIG.endpoint}/embeddings`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ model: DEEPSEEK_CONFIG.embeddingModel, input: texts })
      },
      DEEPSEEK_CONFIG.requestTimeoutMs
    );
    if (!res.ok) throw new Error(`DeepSeek 向量请求失败：${res.status}`);
    const data = (await res.json()) as { data: { embedding: number[] }[] };
    return data.data.map((d) => d.embedding);
  }

  async vision(imageBase64: string, prompt: string): Promise<string> {
    // DeepSeek 视觉能力按其文档扩展；此处复用 chat 多模态格式
    const res = await fetchWithTimeout(
      `${DEEPSEEK_CONFIG.endpoint}/chat/completions`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.chatModel,
          messages: [
            { role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }] }
          ]
        })
      },
      DEEPSEEK_CONFIG.requestTimeoutMs
    );
    if (!res.ok) throw new Error(`DeepSeek 视觉请求失败：${res.status}`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    return data.choices[0].message.content;
  }

  async speechToText(audioBase64: string): Promise<string> {
    // DeepSeek 暂无原生 STT，回退提示需通义千问
    void audioBase64;
    throw new Error('DeepSeek 暂不支持语音转文字，请切换到通义千问');
  }
}

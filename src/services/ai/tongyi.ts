// src/services/ai/tongyi.ts — 通义千问 API 封装（备用，§9.2）
import { TONGYI_CONFIG } from '@/constants/config';
import { getApiKey } from '../storage';
import type { AIProvider, ChatMessage, ChatOptions } from '@/types/ai';

export class TongyiProvider implements AIProvider {
  name = '通义千问';

  private get key(): string {
    const k = getApiKey('tongyi');
    if (!k) throw new Error('未配置通义千问 API Key');
    return k;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TONGYI_CONFIG.requestTimeoutMs);
    try {
      const res = await fetch(`${TONGYI_CONFIG.endpoint}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.key}` },
        body: JSON.stringify({
          model: TONGYI_CONFIG.chatModel,
          messages,
          temperature: options?.temperature ?? 0.3,
          response_format: options?.responseFormat === 'json_object' ? { type: 'json_object' } : undefined
        }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`通义千问请求失败：${res.status}`);
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return data.choices[0].message.content;
    } finally {
      clearTimeout(timer);
    }
  }

  async embed(texts: string[]): Promise<number[][]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TONGYI_CONFIG.requestTimeoutMs);
    try {
      const res = await fetch(`${TONGYI_CONFIG.endpoint}/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.key}` },
        body: JSON.stringify({ model: 'text-embedding-v3', input: { texts } }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`通义千问向量请求失败：${res.status}`);
      const data = (await res.json()) as { output: { embeddings: { embedding: number[] }[] } };
      return data.output.embeddings.map((e) => e.embedding);
    } finally {
      clearTimeout(timer);
    }
  }

  async vision(imageBase64: string, prompt: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TONGYI_CONFIG.requestTimeoutMs);
    try {
      const res = await fetch(`${TONGYI_CONFIG.endpoint}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.key}` },
        body: JSON.stringify({
          model: 'qwen-vl-plus',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
              ]
            }
          ]
        }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`通义千问视觉请求失败：${res.status}`);
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return data.choices[0].message.content;
    } finally {
      clearTimeout(timer);
    }
  }

  async speechToText(audioBase64: string): Promise<string> {
    // 通义千问 Paraformer 语音识别 API (OSS 文件 URL 模式)
    // 客户端直传模式：使用 dashscope 的实时语音识别
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TONGYI_CONFIG.requestTimeoutMs);
    try {
      // 使用通义千问的 SenseVoice / Paraformer API
      const res = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.key}`,
          'X-DashScope-Async': 'enable'
        },
        body: JSON.stringify({
          model: 'paraformer-v2',
          input: {
            audio: `data:audio/webm;base64,${audioBase64}`
          },
          parameters: {
            format: 'webm',
            sample_rate: 16000
          }
        }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`通义千问语音识别请求失败：${res.status}`);
      const data = (await res.json()) as { output?: { task_status?: string; task_id?: string; results?: { transcription_url?: string }[] } };
      // 异步任务模式：返回 task_id 后轮询
      if (data.output?.task_id) {
        const taskId = data.output.task_id;
        // 轮询结果（最多等待 30s）
        for (let i = 0; i < 30; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          const statusRes = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${this.key}` }
          });
          const statusData = (await statusRes.json()) as { output?: { task_status?: string; results?: { transcription_url?: string }[] } };
          if (statusData.output?.task_status === 'SUCCEEDED') {
            const url = statusData.output.results?.[0]?.transcription_url;
            if (url) {
              const transRes = await fetch(url);
              const transData = (await transRes.json()) as { transcription?: string; text?: string };
              return transData.transcription ?? transData.text ?? '未能识别到语音内容';
            }
          }
          if (statusData.output?.task_status === 'FAILED') {
            throw new Error('通义千问语音识别任务失败');
          }
        }
        throw new Error('通义千问语音识别超时，请重试');
      }
      throw new Error('通义千问语音识别返回格式异常');
    } finally {
      clearTimeout(timer);
    }
  }
}

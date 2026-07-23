// src/utils/file.ts — 文件处理（读文件、Base64 转换、MIME 判断）
import type { ImportSource } from '@/types/candidate';

/** 读取文件为 ArrayBuffer */
export function readArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/** 读取文件为文本 */
export function readText(file: File): Promise<string> {
  return file.text();
}

/** 读取文件为 DataURL（Base64） */
export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** 提取 Base64 纯数据（去掉 data:xxx;base64, 前缀） */
export function stripDataUrl(dataUrl: string): string {
  const idx = dataUrl.indexOf(',');
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
}

/** 文件大小人类可读 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** 根据 MIME 判断导入来源 */
export function inferImportSource(file: File): ImportSource {
  const t = file.type;
  if (t === 'application/pdf') return 'resume_pdf';
  if (t.includes('word') || t.includes('officedocument.wordprocessing')) return 'resume_word';
  if (t.startsWith('image/')) return 'photo';
  if (t.startsWith('audio/')) return 'voice';
  if (t.startsWith('video/')) return 'video';
  return 'manual';
}

// src/services/import/file-parser.ts — 文件解析（PDF/Word/图片 → 文本，§8.5 / §13.1）
// 注意：pdfjs-dist 和 mammoth 体积较大，按需动态加载以减少首屏 JS
import { withFallback } from '../ai/factory';
import { stripDataUrl } from '@/utils/file';

let pdfjsWorkerConfigured = false;

async function getPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsWorkerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    pdfjsWorkerConfigured = true;
  }
  return pdfjsLib;
}

/** 解析 PDF → 文本 */
export async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await getPdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    text += (await page.getTextContent()).items.map((it) => ('str' in it ? it.str : '')).join(' ') + '\n';
  }
  return text;
}

/** 解析 Word(.docx) → 文本 */
export async function parseWord(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

/** 图片 → AI Vision → 文本（名片/简历照） */
export async function parseImage(file: File, prompt: string): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
  return withFallback((p) => p.vision(stripDataUrl(dataUrl), prompt));
}

/** 视频抽帧 + AI 视觉分析（§13.1） */
export async function parseVideo(file: File, prompt: string): Promise<string> {
  const { extractVideoFrames } = await import('@/utils/media');
  const frames = await extractVideoFrames(file, 3);
  const results: string[] = [];
  for (const frame of frames) {
    results.push(await withFallback((p) => p.vision(stripDataUrl(frame), prompt)));
  }
  return results.join('\n');
}

/** 通用入口：按文件类型分发 */
export async function parseFileToText(file: File): Promise<string> {
  const type = file.type;
  if (type === 'application/pdf') return parsePdf(file);
  if (type.includes('word') || file.name.endsWith('.docx')) return parseWord(file);
  if (type.startsWith('image/')) return parseImage(file, '提取图片中所有可见文字信息，返回结构化 JSON。');
  if (type.startsWith('video/')) return parseVideo(file, '描述视频画面中的人物、场景、行业线索。');
  if (type.startsWith('audio/')) {
    const { transcribeAudio } = await import('./voice');
    return transcribeAudio(file);
  }
  throw new Error(`不支持的文件类型：${type}`);
}

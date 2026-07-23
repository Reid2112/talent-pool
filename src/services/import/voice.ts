// src/services/import/voice.ts — 语音录制 + 转文字（§13.1）
import { withFallback } from '../ai/factory';
import { stripDataUrl } from '@/utils/file';

/** 录制语音，返回 Blob（调用方停止后 resolve） */
export function recordVoice(): { stop: () => Promise<Blob>; cancel: () => void } {
  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  const chunks: BlobPart[] = [];
  let resolveStop: (b: Blob) => void = () => {};
  let rejectStop: (e: unknown) => void = () => {};
  let streamReady = false;

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((s) => {
      stream = s;
      mediaRecorder = new MediaRecorder(s);
      mediaRecorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      mediaRecorder.onstop = () => {
        resolveStop(new Blob(chunks, { type: 'audio/webm' }));
        s.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      streamReady = true;
    })
    .catch(rejectStop);

  const doStop = (): Promise<Blob> =>
    new Promise<Blob>((resolve, reject) => {
      resolveStop = resolve;
      rejectStop = reject;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      } else if (!streamReady) {
        // Stream not ready yet — cancel stream when it resolves
        rejectStop = reject;
        resolveStop = resolve;
        streamReady = true; // signal that we're waiting to stop
        navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
          s.getTracks().forEach((t) => t.stop());
        });
        reject(new Error('录音尚未就绪，请重试'));
      }
    });

  return {
    stop: doStop,
    cancel: () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        // Override onstop to avoid resolving with a blob we don't need
        mediaRecorder.onstop = () => stream?.getTracks().forEach((t) => t.stop());
        mediaRecorder.stop();
      } else if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    }
  };
}

/** Blob → Base64 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(stripDataUrl(r.result as string));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** 音频文件 → 文字 */
export async function transcribeAudio(file: Blob): Promise<string> {
  const base64 = await blobToBase64(file);
  return withFallback((p) => p.speechToText(base64));
}

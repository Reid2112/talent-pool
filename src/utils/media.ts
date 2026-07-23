// src/utils/media.ts — 媒体处理（图片压缩、视频抽帧）

/** 图片压缩为指定尺寸的 JPEG Base64（用于头像/名片） */
export async function compressImage(
  file: File,
  maxDim = 512,
  quality = 0.85
): Promise<string> {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('画布上下文不可用');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}

/** 从视频中抽取若干帧为 JPEG Base64（用于 AI Vision，§13.1） */
export async function extractVideoFrames(
  file: File,
  count = 3
): Promise<string[]> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('视频加载失败'));
    });
    const frames: string[] = [];
    const duration = video.duration;
    for (let i = 0; i < count; i++) {
      const t = (duration * (i + 1)) / (count + 1);
      video.currentTime = t;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        frames.push(canvas.toDataURL('image/jpeg', 0.8));
      }
    }
    return frames;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}

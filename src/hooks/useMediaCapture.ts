// src/hooks/useMediaCapture.ts — 拍照/录音/录像（§3 hooks 层）
import { useState } from 'react';

export function useMediaCapture() {
  const [isCapturing, setIsCapturing] = useState(false);

  async function captureImage(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = () => resolve(input.files?.[0] ?? null);
      input.click();
    });
  }

  return { isCapturing, setIsCapturing, captureImage };
}

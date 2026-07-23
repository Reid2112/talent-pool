// src/components/import/VoiceRecorder.tsx — 语音录制按钮（§13.1 / Phase 2）
import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { recordVoice, transcribeAudio } from '@/services/import/voice';
import { toast } from 'sonner';

export interface VoiceRecorderProps {
  onTranscribed: (text: string) => void;
}

export function VoiceRecorder({ onTranscribed }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<ReturnType<typeof recordVoice> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = useCallback(async () => {
    try {
      recorderRef.current = recordVoice();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error('无法访问麦克风，请检查权限');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) return;
    clearInterval(timerRef.current);
    setRecording(false);
    setTranscribing(true);
    try {
      const blob = await recorderRef.current.stop();
      const text = await transcribeAudio(blob);
      if (text.trim()) {
        onTranscribed(text);
        toast.success('语音转文字完成');
      } else {
        toast.error('未能识别到语音内容');
      }
    } catch (err) {
      toast.error(`语音转文字失败：${(err as Error).message}`);
    } finally {
      setTranscribing(false);
    }
  }, [onTranscribed]);

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {transcribing ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
          <p className="text-sm text-slate-500">识别中…</p>
        </div>
      ) : recording ? (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={stopRecording}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100 transition active:scale-95"
          >
            <div className={`absolute inset-0 animate-ping rounded-full bg-red-400/20 ${duration > 5 ? 'animate-pulse' : ''}`} />
            <Square size={28} className="text-red-600" fill="currentColor" />
          </button>
          <p className="text-sm font-medium text-slate-700">
            录制中 {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </p>
          <p className="text-xs text-slate-400">点击停止并开始识别</p>
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 transition active:scale-95 hover:bg-blue-200"
        >
          <Mic size={32} className="text-blue-600" />
        </button>
      )}
    </div>
  );
}

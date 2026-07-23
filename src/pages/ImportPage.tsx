// src/pages/ImportPage.tsx — 导入候选人页（§6.1 / Phase 2 全模态导入）
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useImport } from '@/hooks/useImport';
import { ImportPanel } from '@/components/import/ImportPanel';
import { VoiceRecorder } from '@/components/import/VoiceRecorder';
import { ImportProgress } from '@/components/import/ImportProgress';
import { ImportPreview, ImportPreviewEdit } from '@/components/import/ImportPreview';
import { extractCandidateFromText } from '@/services/import/ai-extractor';
import { mergeExtracted } from '@/services/import/ai-extractor';
import type { Candidate } from '@/types/candidate';
import type { ImportModeType } from '@/components/import/ImportPanel';
import { useMediaCapture } from '@/hooks/useMediaCapture';
import { toast } from 'sonner';

export function ImportPage() {
  const { startImport, isImporting, progress, extractedData, confirmImport, cancelImport, updateExtractedCandidate } = useImport();
  const navigate = useNavigate();
  const [mode, setMode] = useState<ImportModeType>('file');
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [voiceText, setVoiceText] = useState('');
  const { captureImage } = useMediaCapture();

  const handleCameraCapture = async () => {
    const file = await captureImage();
    if (file) handleFiles([file]);
  };

  const handleFiles = useCallback(
    (files: File[]) => {
      void startImport(files);
    },
    [startImport]
  );

  const handleVoiceTranscribed = useCallback(async (text: string) => {
    setVoiceText(text);
    try {
      const partial = await extractCandidateFromText(text);
      const candidate = mergeExtracted(partial);
      confirmImport([candidate]);
      toast.success('语音录入完成，候选人已入库');
    } catch (err) {
      toast.error(`语音信息提取失败：${(err as Error).message}`);
    }
  }, [confirmImport]);

  const handleConfirm = useCallback(
    (candidates: Candidate[]) => {
      confirmImport(candidates);
      toast.success(`${candidates.length} 位候选人已入库`);
    },
    [confirmImport]
  );

  return (
    <>
      <Header title="导入候选人" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <ImportPanel
          mode={mode}
          onModeChange={setMode}
          onNavigateManual={() => navigate('/candidates/new')}
          onFiles={handleFiles}
          onCameraCapture={handleCameraCapture}
        />

        {/* Voice Import Mode */}
        {mode === 'voice' && (
          <div className="card p-4">
            <p className="mb-3 text-sm text-slate-600">
              录制语音描述候选人信息，AI 将自动识别并提取结构化数据。
            </p>
            <VoiceRecorder onTranscribed={handleVoiceTranscribed} />
            {voiceText && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">识别文本：</p>
                <p className="mt-1 text-[13px] text-slate-700">{voiceText}</p>
              </div>
            )}
          </div>
        )}

        {/* Import Progress */}
        {isImporting && progress && <ImportProgress progress={progress} />}

        {/* AI Extraction Preview with Edit Support */}
        {extractedData.length > 0 && !editingCandidate && (
          <ImportPreview
            candidates={extractedData}
            onConfirm={handleConfirm}
            onCancel={cancelImport}
            onEdit={(c) => setEditingCandidate(c)}
          />
        )}

        {/* Inline Edit */}
        {editingCandidate && (
          <ImportPreviewEdit
            candidate={editingCandidate}
            onSave={(updated) => {
              updateExtractedCandidate(updated);
              setEditingCandidate(null);
            }}
            onCancel={() => setEditingCandidate(null)}
          />
        )}
      </div>
    </>
  );
}

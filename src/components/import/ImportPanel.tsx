// src/components/import/ImportPanel.tsx — 导入方式选择面板（§6.1）
import { FilterChip } from '@/components/ui';
import { FileDropzone } from './FileDropzone';
import { FileText, FileImage, Video, Camera } from 'lucide-react';

/** 导入模式 */
export type ImportModeType = 'file' | 'voice' | 'manual';

export interface ImportPanelProps {
  mode: ImportModeType;
  onModeChange: (mode: ImportModeType) => void;
  onNavigateManual: () => void;
  onFiles: (files: File[]) => void;
  onCameraCapture: () => void;
}

const FILE_OPTIONS = [
  { icon: FileText, label: 'PDF 简历', accept: '.pdf' },
  { icon: FileText, label: 'Word 简历', accept: '.docx' },
  { icon: FileImage, label: '图片/名片', accept: 'image/*' },
  { icon: Video, label: '视频文件', accept: 'video/*' }
] as const;

export function ImportPanel({ mode, onModeChange, onNavigateManual, onFiles, onCameraCapture }: ImportPanelProps) {
  return (
    <>
      {/* Mode Selector */}
      <div className="flex gap-2">
        <FilterChip label="文件导入" active={mode === 'file'} onClick={() => onModeChange('file')} />
        <FilterChip label="语音录入" active={mode === 'voice'} onClick={() => onModeChange('voice')} />
        <FilterChip label="手动录入" active={mode === 'manual'} onClick={onNavigateManual} />
      </div>

      {/* File Import Mode */}
      {mode === 'file' && (
        <>
          <div className="grid grid-cols-2 gap-2.5 text-center">
            {FILE_OPTIONS.map((m) => (
              <label
                key={m.label}
                className="card flex cursor-pointer flex-col items-center justify-center gap-2 py-5 transition hover:border-blue-400"
              >
                <m.icon size={24} className="text-blue-600" />
                <span className="text-[13px] font-medium text-slate-900">{m.label}</span>
                <input
                  type="file"
                  accept={m.accept}
                  hidden
                  onChange={(e) => {
                    if (e.target.files) onFiles(Array.from(e.target.files));
                    e.target.value = '';
                  }}
                />
              </label>
            ))}
          </div>

          {/* 快捷拍照录入 */}
          <button
            onClick={onCameraCapture}
            className="card flex items-center justify-center gap-2.5 py-4 transition hover:border-blue-400"
          >
            <Camera size={20} className="text-blue-600" />
            <span className="text-[13px] font-medium text-slate-900">拍照录入名片/简历</span>
          </button>

          <FileDropzone onFiles={onFiles} />
        </>
      )}
    </>
  );
}

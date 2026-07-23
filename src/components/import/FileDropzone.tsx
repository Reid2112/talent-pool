// src/components/import/FileDropzone.tsx — 文件拖拽/选择区域（§13.1 / Phase 2）
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { formatFileSize } from '@/utils/file';

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export function FileDropzone({ onFiles, accept = '.pdf,.docx,image/*,audio/*,video/*', multiple = true }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFiles(Array.from(e.dataTransfer.files));
      }
    },
    [onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(Array.from(e.target.files));
        // 重置 input 以允许重复选择同一文件
        e.target.value = '';
      }
    },
    [onFiles]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center gap-3 rounded-[14px] border-2 border-dashed p-6 text-center transition ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
          isDragging ? 'bg-blue-100' : 'bg-slate-100'
        }`}
      >
        <Upload size={24} className={isDragging ? 'text-blue-600' : 'text-slate-400'} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">
          {isDragging ? '松开以添加文件' : '点击或拖拽文件到此处'}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          支持 PDF / Word / 图片 / 音频 / 视频，可批量上传
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={handleChange}
      />
    </div>
  );
}

/** 已选文件列表预览 */
export function FilePreviewList({ files, onRemove }: { files: File[]; onRemove: (idx: number) => void }) {
  return (
    <div className="space-y-1.5">
      {files.map((f, i) => (
        <div key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-slate-400" />
            <div>
              <p className="text-[13px] font-medium text-slate-700 truncate max-w-[200px]">{f.name}</p>
              <p className="text-[11px] text-slate-400">{formatFileSize(f.size)}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(i);
            }}
            className="text-[13px] text-red-500"
          >
            移除
          </button>
        </div>
      ))}
    </div>
  );
}

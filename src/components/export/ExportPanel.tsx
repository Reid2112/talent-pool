// src/components/export/ExportPanel.tsx — 导出格式选择弹层（§6.1，接 useExport）
import { useState } from 'react';
import { BottomSheet, Button, FilterChip } from '@/components/ui';
import { useUIStore } from '@/stores/ui.store';
import { useCandidateStore } from '@/stores/candidate.store';
import { useExport, type ExportFormat } from '@/hooks/useExport';

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'excel', label: 'Excel (.xlsx) · 适合电脑查看' },
  { id: 'csv', label: 'CSV · 通用表格格式' },
  { id: 'json', label: 'JSON · 完整备份可恢复' },
  { id: 'pdf', label: 'PDF · 候选人档案可打印' }
];

export function ExportPanel() {
  const { isExportPanelOpen, closeExportPanel } = useUIStore();
  const { candidates } = useCandidateStore();
  const { doExport } = useExport();
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [starredOnly, setStarredOnly] = useState(false);

  const target = starredOnly ? candidates.filter((c) => c.isStarred) : candidates;

  const handleExport = () => {
    doExport(format, target);
    closeExportPanel();
  };

  return (
    <BottomSheet open={isExportPanelOpen} title="导出候选人" onClose={closeExportPanel}>
      <div className="space-y-5">
        <div className="space-y-2.5">
          <p className="section-title">选择格式</p>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm transition ${
                format === f.id ? 'border-blue-600 bg-blue-50 font-medium text-slate-900' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <span>{f.label}</span>
              <span className={`h-5 w-5 rounded-full border-2 ${format === f.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`} />
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          <p className="section-title">导出范围</p>
          <div className="flex gap-2">
            <FilterChip label={`全部 ${candidates.length} 位`} active={!starredOnly} onClick={() => setStarredOnly(false)} />
            <FilterChip label={`仅收藏 ${candidates.filter((c) => c.isStarred).length} 位`} active={starredOnly} onClick={() => setStarredOnly(true)} />
          </div>
        </div>

        <Button onClick={handleExport} className="w-full" size="lg">导出 {target.length} 位候选人</Button>
      </div>
    </BottomSheet>
  );
}

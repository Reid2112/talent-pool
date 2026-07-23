// src/hooks/useExport.ts — 导出操作（§3 hooks 层）
import { toast } from 'sonner';
import type { Candidate } from '@/types/candidate';
import { exportExcel } from '@/services/export/excel';
import { exportCsv } from '@/services/export/csv';
import { exportJson } from '@/services/export/json';
import { exportPdf } from '@/services/export/pdf';

export type ExportFormat = 'excel' | 'csv' | 'json' | 'pdf';

export function useExport() {
  const doExport = async (format: ExportFormat, candidates: Candidate[]) => {
    if (candidates.length === 0) {
      toast.error('没有可导出的候选人');
      return;
    }
    try {
      switch (format) {
        case 'excel':
          await exportExcel(candidates);
          break;
        case 'csv':
          exportCsv(candidates);
          break;
        case 'json':
          exportJson(candidates);
          break;
        case 'pdf':
          await exportPdf(candidates);
          break;
      }
      toast.success(`已导出 ${candidates.length} 位候选人`);
    } catch (err) {
      toast.error(`导出失败：${(err as Error).message}`);
    }
  };
  return { doExport };
}

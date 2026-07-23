// src/services/export/csv.ts — CSV 导出（原生实现，§13.2，UTF-8 BOM 防乱码）
import { saveAs } from 'file-saver';
import type { Candidate } from '@/types/candidate';

const HEADERS = ['姓名', '当前职位', '公司', '工作年限', '城市', '行业', '技能', '联系状态', '电话', '邮箱', '微信', '备注'];

function escapeCell(v: unknown): string {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportCsv(candidates: Candidate[], filename = '候选人.csv'): void {
  const rows = candidates.map((c) =>
    [
      c.name,
      c.currentPosition,
      c.currentCompany,
      c.yearsOfExperience,
      c.currentLocation,
      c.industry.join(' / '),
      c.skills.map((s) => s.name).join(' / '),
      c.contactStatus,
      c.phone ?? '',
      c.email ?? '',
      c.wechat ?? '',
      c.generalNotes
    ]
      .map(escapeCell)
      .join(',')
  );
  const csv = '\uFEFF' + [HEADERS.join(','), ...rows].join('\n');
  saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
}

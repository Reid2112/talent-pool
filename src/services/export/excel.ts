// src/services/export/excel.ts — Excel 导出（SheetJS，§13.2）
// xlsx 体积较大（~500KB），按需动态加载
import type { Candidate } from '@/types/candidate';
import { formatSalary } from '@/utils/format';

/** 候选人 → 行数据 */
function toRow(c: Candidate): Record<string, string | number> {
  return {
    姓名: c.name,
    当前职位: c.currentPosition,
    公司: c.currentCompany,
    工作年限: c.yearsOfExperience,
    城市: c.currentLocation,
    行业: c.industry.join(' / '),
    技能: c.skills.map((s) => s.name).join(' / '),
    联系状态: c.contactStatus,
    电话: c.phone ?? '',
    邮箱: c.email ?? '',
    微信: c.wechat ?? '',
    当前薪资: formatSalary(c.currentSalary),
    期望薪资: formatSalary(c.expectedSalary),
    备注: c.generalNotes,
    更新时间: c.updatedAt
  };
}

export async function exportExcel(candidates: Candidate[], filename = '候选人.xlsx'): Promise<void> {
  const XLSX = await import('xlsx');
  const { saveAs } = await import('file-saver');
  const rows = candidates.map(toRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '候选人');
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([out], { type: 'application/octet-stream' }), filename);
}

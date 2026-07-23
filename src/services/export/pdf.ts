// src/services/export/pdf.ts — PDF 导出（jsPDF，候选人档案，§13.2）
// jsPDF 体积较大，按需动态加载
import type { Candidate } from '@/types/candidate';
import { formatSalary, formatDate } from '@/utils/format';

/** 每个候选人一页档案 */
export async function exportPdf(candidates: Candidate[], filename = '候选人档案.pdf'): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  candidates.forEach((c, idx) => {
    if (idx > 0) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(c.name || '未命名', margin, y);
    y += 24;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = [
      `职位：${c.currentPosition} @ ${c.currentCompany}`,
      `年限：${c.yearsOfExperience} 年 ｜ 城市：${c.currentLocation}`,
      `行业：${c.industry.join(' / ')}`,
      `技能：${c.skills.map((s) => s.name).join(' / ')}`,
      `当前薪资：${formatSalary(c.currentSalary)}`,
      `期望薪资：${formatSalary(c.expectedSalary)}`,
      `联系状态：${c.contactStatus}`,
      `电话：${c.phone ?? '-'} ｜ 邮箱：${c.email ?? '-'} ｜ 微信：${c.wechat ?? '-'}`,
      `上次联系：${formatDate(c.lastContactDate)}`,
      ``,
      `备注：${c.generalNotes || '-'}`
    ];
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, pageW - margin * 2);
      wrapped.forEach((ln: string) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(ln, margin, y);
        y += 16;
      });
    });
  });

  doc.save(filename);
}

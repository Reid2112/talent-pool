// src/components/candidate/CandidateDetail.tsx — 候选人详情页主体（§6.1）
import { Trash2, Plus, ChevronDown, Star } from 'lucide-react';
import { Avatar, Section, Row } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { SkillTagGroup } from './SkillTagGroup';
import { ContactTimeline } from './ContactTimeline';
import { formatSalary, formatYears, formatDate } from '@/utils/format';
import type { Candidate } from '@/types/candidate';

export interface CandidateDetailProps {
  candidate: Candidate;
  onToggleStar: () => void;
  onOpenStatusSheet: () => void;
  onOpenFollowUp: () => void;
  onDelete: () => void;
}

export function CandidateDetail({
  candidate: c,
  onToggleStar,
  onOpenStatusSheet,
  onOpenFollowUp,
  onDelete,
}: CandidateDetailProps) {
  return (
    <>
      {/* Hero Card */}
      <div className="card flex items-center gap-3.5 p-4">
        <Avatar name={c.name} size={64} />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">{c.name}</span>
              <button onClick={onToggleStar} className="text-amber-500">
                <Star size={16} fill={c.isStarred ? 'currentColor' : 'none'} strokeWidth={1.8} />
              </button>
            </div>
            <button onClick={onOpenStatusSheet} className="flex items-center gap-0.5">
              <StatusBadge status={c.contactStatus} />
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
          <p className="text-sm text-slate-600">{c.currentPosition} · {c.currentCompany}</p>
          <p className="text-xs text-slate-400">{formatYears(c.yearsOfExperience)} · {c.currentLocation}</p>
        </div>
      </div>

      {/* Contact Info */}
      <Section title="联系方式">
        <Row label="电话" value={c.phone ?? '-'} />
        <Row label="邮箱" value={c.email ?? '-'} />
        <Row label="微信" value={c.wechat ?? '-'} />
      </Section>

      {/* Skills */}
      {c.skills.length > 0 && (
        <Section title="技能">
          <SkillTagGroup skills={c.skills} />
        </Section>
      )}

      {/* Salary */}
      <Section title="薪资">
        <Row label="当前" value={formatSalary(c.currentSalary)} />
        <Row label="期望" value={`${formatSalary(c.expectedSalary)}${c.salaryNegotiable ? ' · 可议' : ''}`} />
      </Section>

      {/* Key Projects */}
      {c.keyProjects[0] && (
        <Section title="重点项目">
          <p className="text-sm font-semibold text-slate-900">{c.keyProjects[0].name}</p>
          <p className="text-xs text-slate-400">{c.keyProjects[0].role}</p>
          <p className="text-[13px] leading-relaxed text-slate-600">{c.keyProjects[0].description}</p>
        </Section>
      )}

      {/* Industry */}
      {c.industry.length > 0 && (
        <Section title="行业">
          <div className="flex flex-wrap gap-1.5">
            {c.industry.map((ind) => (
              <span key={ind} className="chip-default">{ind}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Follow-up Records */}
      <Section title="跟进记录">
        <ContactTimeline records={c.followUpRecords} />
        <button
          onClick={onOpenFollowUp}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-[13px] font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Plus size={16} />
          添加跟进记录
        </button>
        {c.nextFollowUpDate && (
          <p className="pt-1 text-xs text-slate-400">下次跟进：{formatDate(c.nextFollowUpDate)}</p>
        )}
      </Section>

      {/* Notes */}
      {c.generalNotes && (
        <Section title="备注">
          <p className="text-[13px] leading-relaxed text-slate-600">{c.generalNotes}</p>
        </Section>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 transition active:bg-red-50"
      >
        <Trash2 size={16} /> 删除候选人
      </button>
    </>
  );
}

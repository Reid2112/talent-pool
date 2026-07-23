// src/components/candidate/ContactTimeline.tsx — 跟进记录时间线（§6.1 / §14 Phase3）
import type { FollowUpRecord } from '@/types/candidate';
import { formatDate } from '@/utils/format';

export interface ContactTimelineProps {
  records: FollowUpRecord[];
}

const METHOD_LABEL: Record<FollowUpRecord['method'], string> = {
  phone: '电话',
  wechat: '微信',
  email: '邮件',
  meeting: '见面',
  other: '其他'
};

export function ContactTimeline({ records }: ContactTimelineProps) {
  if (records.length === 0) {
    return <p className="text-xs text-slate-400">暂无跟进记录</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {records.map((r, i) => (
        <div key={r.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
            {i < records.length - 1 && <span className="w-0.5 flex-1 bg-slate-200" />}
          </div>
          <div className="flex-1 space-y-1 pb-1">
            <p className="text-xs font-medium text-slate-900">
              {formatDate(r.date)} · {METHOD_LABEL[r.method]}
            </p>
            <p className="text-[13px] text-slate-600">{r.summary}</p>
            {r.attitude && <p className="text-xs text-slate-400">态度：{r.attitude}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

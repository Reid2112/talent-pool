// src/components/candidate/StatusBadge.tsx — 联系状态标签（§6.2）
import { getStatusMeta } from '@/constants/contact-status';
import type { ContactStatus } from '@/types/candidate';

export interface StatusBadgeProps {
  status: ContactStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.softBg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

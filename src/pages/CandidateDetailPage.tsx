// src/pages/CandidateDetailPage.tsx — 候选人详情页（§6.1 / Phase 3 完善）
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCandidateDetail } from '@/hooks/useCandidateDetail';
import { useCandidateStore } from '@/stores/candidate.store';
import { Header } from '@/components/layout/Header';
import { CandidateDetail } from '@/components/candidate/CandidateDetail';
import { StatusFlowSheet } from '@/components/candidate/StatusFlowSheet';
import { FollowUpForm } from '@/components/candidate/FollowUpForm';
import { ConfirmDialog } from '@/components/ui';
import { toast } from 'sonner';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidate, refresh, deleteCandidate, addFollowUpRecord, setStatus: updateStatus } = useCandidateDetail(id);
  const toggleStar = useCandidateStore((s) => s.toggleStar);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  if (!candidate) {
    return (
      <>
        <Header title="候选人详情" showBack />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-400">加载中或不存在</p>
        </div>
      </>
    );
  }

  const onDelete = async () => {
    await deleteCandidate(candidate.id);
    toast.success('已删除');
    navigate('/candidates');
  };

  const handleStatusChange = async (newStatus: typeof candidate.contactStatus) => {
    await updateStatus(candidate.id, newStatus);
    refresh();
    toast.success('状态已更新');
  };

  const handleAddFollowUp = async (record: typeof candidate.followUpRecords[number]) => {
    await addFollowUpRecord(candidate.id, record);
    refresh();
    toast.success('跟进记录已添加');
  };

  const handleToggleStar = async () => {
    await toggleStar(candidate.id);
    refresh();
    toast.success(candidate.isStarred ? '已取消收藏' : '已收藏');
  };

  return (
    <>
      <Header
        title="候选人详情"
        showBack
        right={
          <button onClick={() => navigate(`/candidates/${candidate.id}/edit`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
        }
      />
      <div className="flex flex-col gap-3.5 px-4 pb-6">
        <CandidateDetail
          candidate={candidate}
          onToggleStar={handleToggleStar}
          onOpenStatusSheet={() => setStatusSheetOpen(true)}
          onOpenFollowUp={() => setFollowUpOpen(true)}
          onDelete={() => setConfirmOpen(true)}
        />
      </div>

      {/* Status Flow Sheet */}
      <StatusFlowSheet
        open={statusSheetOpen}
        currentStatus={candidate.contactStatus}
        candidateName={candidate.name}
        onClose={() => setStatusSheetOpen(false)}
        onConfirm={handleStatusChange}
      />

      {/* Follow-Up Form */}
      <FollowUpForm
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSave={handleAddFollowUp}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="删除候选人"
        message={`确认删除 ${candidate.name}？此操作不可撤销。`}
        danger
        confirmText="删除"
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

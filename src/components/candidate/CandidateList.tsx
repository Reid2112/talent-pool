// src/components/candidate/CandidateList.tsx — 候选人列表（含虚拟滚动 / 空/加载态，§6.2 / §14 Phase3）
import { CandidateCard } from './CandidateCard';
import { Empty, CandidateCardSkeleton } from '@/components/ui';
import { useVirtualList } from '@/hooks/useVirtualList';
import type { Candidate } from '@/types/candidate';

export interface CandidateListProps {
  candidates: Candidate[];
  isLoading?: boolean;
  onClick?: (candidate: Candidate) => void;
  onToggleStar?: (id: string) => void;
  /** 启用虚拟滚动阈值：超过此数量自动开启，默认 50 */
  virtualThreshold?: number;
}

const ITEM_HEIGHT = 92; // 单张卡片预估高度 (48 头像 + 上下 padding)

export function CandidateList({
  candidates,
  isLoading,
  onClick,
  onToggleStar,
  virtualThreshold = 50
}: CandidateListProps) {
  const useVirtual = candidates.length > virtualThreshold;
  const { containerRef, range, totalHeight, offsetY } = useVirtualList(candidates, {
    itemHeight: ITEM_HEIGHT,
    overscan: 5
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <CandidateCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <Empty
        title="还没有候选人"
        description="手动录入，或从 PDF / Word / 图片批量导入"
      />
    );
  }

  // 虚拟滚动模式
  if (useVirtual) {
    const visibleItems = candidates.slice(range.start, range.end);
    return (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="relative" style={{ height: totalHeight }}>
          <div
            className="absolute left-0 right-0 flex flex-col gap-3 px-4"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleItems.map((c) => (
              <CandidateCard key={c.id} candidate={c} onClick={onClick} onToggleStar={onToggleStar} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 普通列表模式（小于阈值）
  return (
    <div className="flex flex-col gap-3">
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} onClick={onClick} onToggleStar={onToggleStar} />
      ))}
    </div>
  );
}

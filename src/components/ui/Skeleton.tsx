// src/components/ui/Skeleton.tsx — 骨架屏加载（§6.2）
export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

/** 候选人卡片骨架 */
export function CandidateCardSkeleton() {
  return (
    <div className="card flex items-center gap-3 p-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

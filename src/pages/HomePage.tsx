// src/pages/HomePage.tsx — 首页仪表盘（§6.1：统计卡片 + 今日待跟进）
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '@/hooks/useCandidates';
import { CandidateCard } from '@/components/candidate/CandidateCard';
import { formatDate } from '@/utils/format';
import { getUserName } from '@/utils/preferences';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export function HomePage() {
  const { candidates, fetchCandidates } = useCandidates();
  const navigate = useNavigate();

  useEffect(() => {
    void fetchCandidates();
  }, [fetchCandidates]);

  const stats = useMemo(() => {
    const total = candidates.length;
    const pending = candidates.filter((c) => c.contactStatus === 'new').length;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const newThisWeek = candidates.filter((c) => new Date(c.createdAt).getTime() > weekAgo).length;
    return { total, pending, newThisWeek };
  }, [candidates]);

  const today = formatDate(new Date());
  const todayFollowUps = candidates.filter((c) => c.nextFollowUpDate && formatDate(c.nextFollowUpDate) === today).slice(0, 5);

  return (
    <>
      <header className="pt-safe px-4 pb-2 pt-3">
        <h1 className="text-[22px] font-bold text-slate-900">{getGreeting()}，{getUserName()}</h1>
        <p className="text-[13px] text-slate-500">今天有 {todayFollowUps.length} 位候选人需要跟进</p>
      </header>
      <div className="flex flex-col gap-5 px-4">
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard label="候选人总数" value={stats.total} />
          <StatCard label="待联系" value={stats.pending} valueClass="text-amber-600" />
          <StatCard label="本周新增" value={`+${stats.newThisWeek}`} valueClass="text-green-600" />
        </div>
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-900">今日待跟进</h2>
            <button onClick={() => navigate('/candidates')} className="text-[13px] font-medium text-blue-600">
              查看全部 ›
            </button>
          </div>
          {todayFollowUps.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">今天暂无跟进安排</p>
          ) : (
            todayFollowUps.map((c) => <CandidateCard key={c.id} candidate={c} onClick={(cand) => navigate(`/candidates/${cand.id}`)} />)
          )}
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, valueClass = 'text-slate-900' }: { label: string; value: string | number; valueClass?: string }) {
  return (
    <div className="card flex flex-col gap-1 p-3.5">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={`text-[22px] font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

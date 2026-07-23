// src/App.tsx — 路由顶层 + 全局 Provider + 锁屏 gating + 引导 gating（§5）
import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { isOnboardingDone } from '@/utils/onboarding';

// 首页和列表页在首屏就需要的，保持同步加载
import { HomePage } from '@/pages/HomePage';
import { CandidateListPage } from '@/pages/CandidateListPage';

// 其他页面按需懒加载 — 减少首屏 JS 体积
const CandidateDetailPage = lazy(() =>
  import('@/pages/CandidateDetailPage').then((m) => ({ default: m.CandidateDetailPage }))
);
const CandidateEditPage = lazy(() =>
  import('@/pages/CandidateEditPage').then((m) => ({ default: m.CandidateEditPage }))
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const ImportPage = lazy(() =>
  import('@/pages/ImportPage').then((m) => ({ default: m.ImportPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const LockPage = lazy(() =>
  import('@/pages/LockPage').then((m) => ({ default: m.LockPage }))
);
const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage }))
);

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    </div>
  );
}

export default function App() {
  const { isLocked } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isOnboardingDone() && location.pathname !== '/lock') {
      setShowOnboarding(true);
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
        {/* 引导页（独立路由，首次访问） */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* 锁屏独立路由（不套 Layout，§6.1） */}
        <Route path="/lock" element={<LockPage />} />

        {/* 主应用外壳 */}
        <Route
          path="/*"
          element={
            isLocked ? (
              <Navigate to="/lock" replace />
            ) : showOnboarding && !isOnboardingDone() ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <AppLayout />
            )
          }
        >
          <Route index element={<HomePage />} />
          <Route path="candidates" element={<CandidateListPage />} />
          <Route path="candidates/new" element={<CandidateEditPage />} />
          <Route path="candidates/:id" element={<CandidateDetailPage />} />
          <Route path="candidates/:id/edit" element={<CandidateEditPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}

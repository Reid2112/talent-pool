// src/components/layout/AppLayout.tsx — 整体布局（Header + 内容 + 底部导航，§6.1）
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

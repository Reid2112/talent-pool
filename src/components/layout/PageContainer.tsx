// src/components/layout/PageContainer.tsx — 页面容器（处理安全区，§6.1）
import { type ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  /** 是否需要底部留白以避开 Tab 栏 */
  bottomNav?: boolean;
}

export function PageContainer({ children, bottomNav = true }: PageContainerProps) {
  return (
    <main className={`flex-1 overflow-y-auto bg-slate-50 ${bottomNav ? 'pb-28' : ''}`}>
      <div className="flex flex-col gap-4 px-4 pb-6 pt-2">{children}</div>
    </main>
  );
}

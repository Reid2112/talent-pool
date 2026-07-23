// src/components/layout/BottomNav.tsx — 底部胶囊 Tab 导航（§5.1 / 移动端规范）
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Search, PlusCircle, Settings } from 'lucide-react';

const TABS = [
  { label: '首页', path: '/', icon: Home },
  { label: '人才库', path: '/candidates', icon: Users },
  { label: '搜索', path: '/search', icon: Search },
  { label: '导入', path: '/import', icon: PlusCircle },
  { label: '设置', path: '/settings', icon: Settings }
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <nav className="px-[21px] pb-[21px] pt-3 pb-safe">
      <div className="flex h-[62px] items-center justify-between gap-1 rounded-[36px] border border-slate-200 bg-white p-1">
        {TABS.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-[26px] transition ${
                active ? 'bg-blue-600' : ''
              }`}
            >
              <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-white' : 'text-slate-400'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

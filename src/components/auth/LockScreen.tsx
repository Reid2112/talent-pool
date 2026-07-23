// src/components/auth/LockScreen.tsx — 锁屏界面（§11）
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { PinInput } from './PinInput';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export function LockScreen() {
  const unlock = useAuthStore((s) => s.unlock);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (pin: string) => {
    setError('');
    const ok = await unlock(pin);
    if (!ok) {
      setError('PIN 码错误，请重试');
    } else {
      // 解锁成功 → 跳转到首页
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-7 bg-slate-50 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <Lock size={32} className="text-blue-600" />
      </div>
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-slate-900">已锁定</h1>
        <p className="text-sm text-slate-500">请输入 6 位 PIN 码解锁</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <PinInput onSubmit={handleSubmit} />
      <button
        onClick={() => {
          if (confirm('本应用数据仅存储在您的设备上，无服务端可重置密码。\n\n如需清除 PIN 码，请在浏览器设置中清除本站点数据（localStorage + IndexedDB）。\n\n注意：这将同时删除所有候选人数据。')) {
            toast.error('请在浏览器设置 → 隐私与安全 → 站点数据中清除本应用数据');
          }
        }}
        className="text-xs text-slate-400 underline"
      >
        忘记密码？
      </button>
    </div>
  );
}

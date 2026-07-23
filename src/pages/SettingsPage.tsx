// src/pages/SettingsPage.tsx — 设置页（§6.1：AI 服务 / 应用锁 / 导出 / 数据管理 / 提醒）
import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Input, Button, Section } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useCandidates } from '@/hooks/useCandidates';
import { useExport } from '@/hooks/useExport';
import { ExportPanel } from '@/components/export/ExportPanel';
import { setApiKey, getApiKey } from '@/services/storage';
import { getActiveAIProvider } from '@/services/ai/factory';
import { parseBackup } from '@/services/export/json';
import { bulkPutCandidates } from '@/db/candidate.db';
import { db } from '@/db';
import { requestNotificationPermission, checkTodayFollowUps, startReminderTimer } from '@/services/reminder';
import { getUserName, setUserName } from '@/utils/preferences';
import { toast } from 'sonner';

export function SettingsPage() {
  const { isLockEnabled, setLockEnabled, hasPinSet, setupPin } = useAuthStore();
  const { openExportPanel } = useUIStore();
  const { candidates } = useCandidates();
  const { doExport } = useExport();
  const [apiKey, setApiKeyState] = useState(getApiKey('deepseek') ?? '');
  const [pinInput, setPinInput] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(Notification.permission === 'granted');
  const [userName, setUserNameState] = useState(getUserName());
  const restoreRef = useRef<HTMLInputElement>(null);

  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('请先填写 API Key');
      return;
    }
    setApiKey('deepseek', apiKey);
    setTesting(true);
    try {
      const provider = getActiveAIProvider();
      await provider.chat([{ role: 'user', content: '回复"OK"' }], { maxTokens: 10 });
      toast.success('连接成功！DeepSeek API 可用');
    } catch (err) {
      toast.error(`连接失败：${(err as Error).message}`);
    } finally {
      setTesting(false);
    }
  };

  const saveUserName = () => {
    setUserName(userName);
    toast.success('用户名已更新');
  };

  const enableLock = async () => {
    if (!hasPinSet && pinInput.length !== 6) {
      toast.error('请先设置 6 位 PIN 码');
      return;
    }
    if (!hasPinSet) await setupPin(pinInput);
    setLockEnabled(true);
    toast.success('应用锁已开启');
  };

  const enableNotifications = async () => {
    const ok = await requestNotificationPermission();
    if (ok) {
      setNotifEnabled(true);
      // 授权成功后立即启动定时检查（main.tsx 启动时权限未授予，不会重复）
      startReminderTimer();
      toast.success('通知权限已开启，每小时自动检查跟进');
    } else {
      toast.error('通知权限被拒绝，请在浏览器设置中修改');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const restored = parseBackup(text);
      if (!confirm(`即将从备份恢复 ${restored.length} 位候选人，当前数据将被覆盖。确认？`)) return;
      await db.candidates.clear();
      await bulkPutCandidates(restored);
      toast.success(`已从备份恢复 ${restored.length} 位候选人`);
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      toast.error(`备份恢复失败：${(err as Error).message}`);
    }
    e.target.value = '';
  };

  const clearAll = async () => {
    if (!confirm('确认清除所有候选人数据？此操作不可撤销。')) return;
    await db.candidates.clear();
    toast.success('已清除所有数据');
    location.reload();
  };

  return (
    <>
      <Header title="设置" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Section title="AI 服务">
          <Input label="DeepSeek API Key" value={apiKey} onChange={(e) => setApiKeyState(e.target.value)} placeholder="sk-..." />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">主 DeepSeek · 备 通义千问</span>
            <Button size="sm" variant="secondary" onClick={testConnection} disabled={testing}>{testing ? '测试中…' : '测试连接'}</Button>
          </div>
        </Section>

        <Section title="个人偏好">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="称呼"
                value={userName}
                onChange={(e) => setUserNameState(e.target.value)}
                placeholder="猎头顾问"
              />
            </div>
            <Button size="sm" onClick={saveUserName}>保存</Button>
          </div>
          <p className="text-[11px] text-slate-400">首页问候语将使用此称呼</p>
        </Section>

        <Section title="应用锁">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">PIN 码锁屏</span>
            <Toggle on={isLockEnabled} onClick={() => (isLockEnabled ? setLockEnabled(false) : enableLock())} />
          </div>
          {!hasPinSet && (
            <Input label="设置 6 位 PIN" value={pinInput} maxLength={6} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} placeholder="6 位数字" />
          )}
        </Section>

        <Section title="数据导出">
          <button
            onClick={openExportPanel}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900"
          >
            <span>选择格式导出（Excel / CSV / JSON / PDF）</span>
            <span className="text-slate-400">›</span>
          </button>
        </Section>

        <Section title="数据管理">
          <button onClick={() => doExport('json', candidates)} className="flex w-full items-center justify-between py-1.5 text-sm text-slate-900">
            备份全部数据（JSON） <span className="text-slate-400">›</span>
          </button>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-slate-900">从备份恢复</span>
            <label className="cursor-pointer rounded-lg bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-600">
              选择文件
              <input ref={restoreRef} type="file" accept=".json" hidden onChange={handleRestore} />
            </label>
          </div>
          <button onClick={clearAll} className="flex w-full items-center justify-between py-1.5 text-sm text-red-600">
            清除所有数据 <span className="text-slate-400">›</span>
          </button>
        </Section>

        <Section title="提醒设置">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900">跟进提醒通知</span>
              <p className="text-xs text-slate-400">每天检查待跟进候选人并推送提醒</p>
            </div>
            <Toggle on={notifEnabled} onClick={enableNotifications} />
          </div>
          <button onClick={() => void checkTodayFollowUps().then((n) => toast.success(`找到 ${n} 位今日待跟进候选人`))} className="text-[13px] text-blue-600">
            手动检查今日跟进 ›
          </button>
        </Section>

        <p className="text-center text-[13px] text-slate-500">猎头人才库 v1.0.0 · 纯本地 PWA</p>
      </div>
      <ExportPanel />
    </>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[26px] w-11 rounded-full transition ${on ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

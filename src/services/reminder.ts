// src/services/reminder.ts — 跟进提醒服务（§14 Phase3，Web Notification + 定时检查）
import { getAllCandidates } from '@/db/candidate.db';
import { formatDate } from '@/utils/format';

/** 请求通知权限 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const r = await Notification.requestPermission();
  return r === 'granted';
}

/** 检查今日待跟进并发通知 */
export async function checkTodayFollowUps(): Promise<number> {
  const today = formatDate(new Date());
  const candidates = await getAllCandidates();
  const due = candidates.filter((c) => c.nextFollowUpDate && formatDate(c.nextFollowUpDate) === today);
  if (due.length > 0 && Notification.permission === 'granted') {
    new Notification('猎头人才库 · 今日跟进提醒', {
      body: `今天有 ${due.length} 位候选人需要跟进：${due.map((c) => c.name).slice(0, 5).join('、')}${due.length > 5 ? '…' : ''}`
    });
  }
  return due.length;
}

/** 启动定时检查（每小时一次），返回停止函数 */
export function startReminderTimer(): () => void {
  void checkTodayFollowUps();
  const timer = setInterval(() => void checkTodayFollowUps(), 60 * 60 * 1000);
  return () => clearInterval(timer);
}

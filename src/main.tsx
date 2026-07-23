// src/main.tsx — 应用入口，挂载 React（§3）
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { seedIfEmpty } from './db/seed';
import { startReminderTimer } from './services/reminder';
import './styles/fonts.css';
import './styles/index.css';

// 首启写入示例数据（库为空时）
void seedIfEmpty();

// 启动周期性跟进提醒（如果已授权通知权限）
if (Notification.permission === 'granted') {
  startReminderTimer();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/talent-pool">
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </BrowserRouter>
  </StrictMode>
);

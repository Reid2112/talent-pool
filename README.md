# 猎头人才库 PWA

纯本地 PWA（渐进式网页应用），专为猎头个人使用设计。安装在安卓手机桌面，全屏运行，外观与原生 App 一致。所有数据存 IndexedDB，无网络也能正常使用（仅 AI 功能需联网）。

## 技术栈（§2）

React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + React Router 6 + Zustand + Dexie 4 + Zod + vite-plugin-pwa。AI：DeepSeek（主）/ 通义千问（备）。

## 快速开始

```bash
npm install
npm run dev      # 开发
npm run build    # 构建
npm run typecheck
```

在设置页填写 DeepSeek API Key 后即可使用 AI 匹配 / 简历导入功能。

## 目录结构（§3）

严格分层：`Pages → Hooks → Stores → Services → DB / AI API`，组件只通过 props 收数据、回调出事件。详见 `src/` 各层。

## 开发阶段（§14）

- **Phase 1（底座）**：脚手架 / PWA / Dexie / 类型 / 基础 UI / 路由 / 列表 / 录入 / 详情 / 删除 / 应用锁 — ✅ 已完成
- **Phase 2（核心智能）**：AI 接入 / JD 匹配 / 全模态导入 — 服务层骨架已就绪，待填实
- **Phase 3（完善体验）**：筛选 / 导出 / 提醒 / 虚拟滚动 — 部分已实现

## 设计稿

视觉蓝本见 Ardot 设计文件（fileId `706682305653390`），含 19 屏 + Design System 规范页。

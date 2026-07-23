// src/stores/ui.store.ts — 全局 UI 状态（§7.1）
import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark'; // 一期只做 light
  activeTab: string;
  isFilterPanelOpen: boolean;
  isExportPanelOpen: boolean;

  setActiveTab: (tab: string) => void;
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  openExportPanel: () => void;
  closeExportPanel: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  activeTab: '/',
  isFilterPanelOpen: false,
  isExportPanelOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  openFilterPanel: () => set({ isFilterPanelOpen: true }),
  closeFilterPanel: () => set({ isFilterPanelOpen: false }),
  openExportPanel: () => set({ isExportPanelOpen: true }),
  closeExportPanel: () => set({ isExportPanelOpen: false })
}));

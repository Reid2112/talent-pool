// src/hooks/useImport.ts — 文件导入流程（§3 hooks 层）
import { useImportStore } from '@/stores/import.store';

export function useImport() {
  return useImportStore();
}

// src/hooks/useSearch.ts — JD 搜索 + 匹配（§3 hooks 层）
import { useSearchStore } from '@/stores/search.store';
import { SEARCH_DEBOUNCE_MS } from '@/constants/config';
import { debounce } from '@/utils/debounce';

export function useSearch() {
  const store = useSearchStore();
  // 防抖搜索（§9.3 800ms）
  const debouncedSearch = debounce(() => void store.search(), SEARCH_DEBOUNCE_MS);
  return { ...store, debouncedSearch };
}

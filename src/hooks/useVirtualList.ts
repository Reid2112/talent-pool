// src/hooks/useVirtualList.ts — 轻量虚拟滚动 hook（无额外依赖，§14 Phase3）
// 使用 scroll + ResizeObserver 实现窗口化渲染，适用于 1000+ 列表场景
import { useRef, useState, useEffect } from 'react';

interface UseVirtualListOptions {
  /** 每项的预估高度（px） */
  itemHeight: number;
  /** 超出屏幕的额外渲染行数（缓冲区） */
  overscan?: number;
}

interface VirtualListResult {
  /** 容器 ref callback，挂载到滚动父元素 */
  containerRef: (el: HTMLDivElement | null) => void;
  /** 当前可见范围 */
  range: { start: number; end: number };
  /** 占位总高度 */
  totalHeight: number;
  /** 可见项偏移量 */
  offsetY: number;
}

/**
 * 虚拟滚动 hook
 * 只渲染可视区域 + overscan 范围内的项目
 */
export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
): VirtualListResult {
  const { itemHeight, overscan = 3 } = options;
  const elRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const containerRef = (el: HTMLDivElement | null) => {
    if (el) {
      elRef.current = el;
      setContainerHeight(el.clientHeight);
    }
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onScroll = () => setScrollTop(el.scrollTop);
    const onResize = () => setContainerHeight(el.clientHeight);

    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => onResize());
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(items.length, start + visibleCount + overscan * 2);

  return {
    containerRef,
    range: { start, end },
    totalHeight: items.length * itemHeight,
    offsetY: start * itemHeight
  };
}

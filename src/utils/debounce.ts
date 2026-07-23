// src/utils/debounce.ts — 防抖/节流

/** 防抖：延迟 wait 毫秒后调用，期间再次调用则重置计时 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** 节流：每 wait 毫秒最多调用一次 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number
): (...args: A) => void {
  let last = 0;
  return (...args: A) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

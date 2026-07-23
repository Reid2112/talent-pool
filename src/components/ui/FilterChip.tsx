// src/components/ui/FilterChip.tsx — 筛选标签（§6.2）
export interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'chip-active' : 'chip-default'}
    >
      {label}
    </button>
  );
}

// src/components/ui/SearchBar.tsx — 顶部搜索框（§6.2）
import { Search } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ value = '', placeholder = '搜索…', onChange }: SearchBarProps) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5">
      <Search size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

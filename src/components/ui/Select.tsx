// src/components/ui/Select.tsx — 移动端选择器（native select + Tailwind 风格，§6.2）
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, value, options, placeholder, onChange, className = '' }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <span className="text-[13px] font-medium text-slate-700">{label}</span>}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${className}`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

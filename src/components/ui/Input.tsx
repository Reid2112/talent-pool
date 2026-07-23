// src/components/ui/Input.tsx — 输入框（§6.2）
import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, invalid, className = '', id, ...rest },
  ref
) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
      <input
        ref={ref}
        id={id}
        className={`input-base ${invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
        {...rest}
      />
      {hint && (
        <span className={`text-[11px] ${invalid ? 'text-red-500' : 'text-slate-400'}`}>{hint}</span>
      )}
    </label>
  );
});

// src/components/ui/Button.tsx — 基础按钮（§6.2 纯展示）
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
  danger: 'bg-red-600 text-white hover:bg-red-700'
} as const;

const SIZE = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:opacity-50 disabled:pointer-events-none ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

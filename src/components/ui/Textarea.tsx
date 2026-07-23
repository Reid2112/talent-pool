// src/components/ui/Textarea.tsx — 多行输入（§6.2）
import { type TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, className = '', id, ...rest },
  ref
) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
      <textarea
        ref={ref}
        id={id}
        className={`input-base min-h-[80px] resize-y py-2.5 ${className}`}
        {...rest}
      />
    </label>
  );
});

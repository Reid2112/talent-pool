// src/components/auth/PinInput.tsx — 6 位 PIN 码输入组件（§11）
import { useState } from 'react';
import { Delete } from 'lucide-react';
import { LOCK_CONFIG } from '@/constants/config';

export interface PinInputProps {
  onSubmit: (pin: string) => void;
}

export function PinInput({ onSubmit }: PinInputProps) {
  const [pin, setPin] = useState('');

  const tap = (d: string) => {
    if (pin.length >= LOCK_CONFIG.pinLength) return;
    const next = pin + d;
    setPin(next);
    if (next.length === LOCK_CONFIG.pinLength) {
      onSubmit(next);
      setTimeout(() => setPin(''), 200);
    }
  };
  const del = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-3.5">
        {Array.from({ length: LOCK_CONFIG.pinLength }).map((_, i) => (
          <span
            key={i}
            className={`h-3.5 w-3.5 rounded-full border ${i < pin.length ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'].map((d, i) =>
          d === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              onClick={() => tap(d)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-900 active:bg-slate-200"
            >
              {d}
            </button>
          )
        )}
        <button onClick={del} className="flex h-14 w-14 items-center justify-center rounded-full text-slate-500 active:bg-slate-100">
          <Delete size={22} />
        </button>
      </div>
    </div>
  );
}

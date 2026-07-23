import type { Config } from 'tailwindcss';

// tailwind.config.ts — 主题定制（§1.3 / §15.5）
// 颜色直接使用 Tailwind 内置 slate/gray/blue/green/amber/red/violet 色板，
// 与设计 Token 一一对应：bg=slate-50, border=slate-200, textPrimary=slate-900,
// textSecondary=slate-600, textMuted=slate-400, accent=blue-600, accentSoft=blue-50。
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px'
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        sheet: '0 -4px 24px 0 rgba(0, 0, 0, 0.20)'
      },
      spacing: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
} satisfies Config;

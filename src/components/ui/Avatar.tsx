// src/components/ui/Avatar.tsx — 头像（首字母/图片，§6.2 / §14 头像管理）
export interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

const COLORS: ReadonlyArray<readonly [string, string]> = [
  ['bg-blue-50', 'text-blue-600'],
  ['bg-violet-50', 'text-violet-600'],
  ['bg-amber-50', 'text-amber-600'],
  ['bg-green-50', 'text-green-600'],
  ['bg-slate-100', 'text-slate-500']
];

function pickColor(name: string): readonly [string, string] {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return COLORS[sum % COLORS.length];
}

export function Avatar({ name, src, size = 48 }: AvatarProps) {
  const initial = name.charAt(0) || '?';
  const [bg, fg] = pickColor(name);
  const dim = { width: size, height: size, fontSize: size * 0.4 };
  if (src) {
    return <img src={src} alt={name} style={dim} className="rounded-full object-cover" />;
  }
  return (
    <div style={dim} className={`flex items-center justify-center rounded-full font-semibold ${bg} ${fg}`}>
      {initial}
    </div>
  );
}

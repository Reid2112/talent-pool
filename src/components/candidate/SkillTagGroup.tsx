// src/components/candidate/SkillTagGroup.tsx — 技能标签组（§6.2）
import { Tag } from '@/components/ui';
import type { Skill } from '@/types/candidate';

export interface SkillTagGroupProps {
  skills: Skill[];
}

export function SkillTagGroup({ skills }: SkillTagGroupProps) {
  if (skills.length === 0) return <span className="text-xs text-slate-400">暂无技能</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <Tag key={s.name} variant="accent">
          {s.name}
        </Tag>
      ))}
    </div>
  );
}

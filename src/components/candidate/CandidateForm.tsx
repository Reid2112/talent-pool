// src/components/candidate/CandidateForm.tsx — 候选人录入/编辑表单（§6.1 全量分区块表单）
import { Button, Input, Textarea, Section } from '@/components/ui';
import { isPhone, isEmail, isWechat } from '@/utils/validate';
import type { Candidate } from '@/types/candidate';

export interface CandidateFormProps {
  form: Candidate;
  onChange: (patch: Partial<Candidate>) => void;
  onSubmit: () => void;
}

export function CandidateForm({ form, onChange, onSubmit }: CandidateFormProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <Section title="基本信息">
        <Input label="姓名 *" value={form.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="请输入姓名" />
        <Input
          label="电话"
          value={form.phone ?? ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="138-xxxx-xxxx"
          hint={form.phone && !isPhone(form.phone) ? '手机号格式不正确' : undefined}
          invalid={!!(form.phone && !isPhone(form.phone))}
        />
        <Input
          label="邮箱"
          value={form.email ?? ''}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="name@example.com"
          hint={form.email && !isEmail(form.email) ? '邮箱格式不正确' : undefined}
          invalid={!!(form.email && !isEmail(form.email))}
        />
        <Input
          label="微信"
          value={form.wechat ?? ''}
          onChange={(e) => onChange({ wechat: e.target.value })}
          hint={form.wechat && !isWechat(form.wechat) ? '微信号格式不正确' : undefined}
          invalid={!!(form.wechat && !isWechat(form.wechat))}
        />
      </Section>

      <Section title="职业信息">
        <Input label="当前职位 *" value={form.currentPosition} onChange={(e) => onChange({ currentPosition: e.target.value })} />
        <Input label="当前公司 *" value={form.currentCompany} onChange={(e) => onChange({ currentCompany: e.target.value })} />
        <Input
          label="工作年限"
          type="number"
          value={form.yearsOfExperience}
          onChange={(e) => onChange({ yearsOfExperience: Number(e.target.value) || 0 })}
        />
        <Input label="现居城市" value={form.currentLocation} onChange={(e) => onChange({ currentLocation: e.target.value })} />
      </Section>

      <Section title="技能">
        <Input
          label="技能（逗号分隔）"
          value={form.skills.map((s) => s.name).join(', ')}
          onChange={(e) =>
            onChange({
              skills: e.target.value
                .split(/[,，]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((name) => ({ name, level: 3 as const, category: 'other' as const }))
            })
          }
          placeholder="React, TypeScript, 性能优化"
        />
      </Section>

      <Section title="薪资">
        <Input
          label="期望月薪（元）"
          type="number"
          value={form.expectedSalary?.amount ?? undefined}
          onChange={(e) =>
            onChange({
              expectedSalary: {
                amount: e.target.value === '' ? 0 : Number(e.target.value) || 0,
                months: form.expectedSalary?.months ?? 14,
                type: 'monthly'
              }
            })
          }
          placeholder="80000"
        />
      </Section>

      <Section title="备注">
        <Textarea value={form.generalNotes} onChange={(e) => onChange({ generalNotes: e.target.value })} placeholder="通用备注…" />
      </Section>

      <Button onClick={onSubmit} size="lg">保存候选人</Button>
    </div>
  );
}

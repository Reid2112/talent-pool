// src/pages/OnboardingPage.tsx — 首启引导页（§14 Phase3 / 设计稿 id 3:600）
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { setOnboardingDone } from '@/utils/onboarding';
import { Users, Search, Shield, Sparkles, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    icon: Users,
    title: '高效管理候选人',
    description: '手动录入或批量导入 PDF / Word / 图片 / 语音 / 视频，AI 自动提取结构化信息，全程离线可用的本地人才库。'
  },
  {
    icon: Search,
    title: 'AI 智能匹配',
    description: '粘贴岗位 JD，AI 语义理解 + 技能图谱自动计算匹配度，按综合得分降序排列，附可读的匹配理由。'
  },
  {
    icon: Sparkles,
    title: '全模态导入',
    description: '支持 PDF 简历、Word 文档、名片拍照、语音口述、视频面试等多种录入方式，AI 自动解析为结构化候选人档案。'
  },
  {
    icon: Shield,
    title: '安全与隐私',
    description: '所有数据存储在您的设备上，无需联网。可设置 6 位 PIN 码 + 指纹保护，切换应用自动锁定，确保候选人信息安全。'
  }
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    setOnboardingDone();
    navigate('/', { replace: true });
  };

  const current = STEPS[step];

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Progress dots */}
      <div className="flex items-center justify-between px-4 pt-12">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-blue-600' : i < step ? 'w-1.5 bg-blue-400' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={finish}
          className="text-[13px] font-medium text-slate-400"
        >
          跳过
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 pb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 shadow-sm">
          <current.icon size={44} className="text-blue-600" strokeWidth={1.5} />
        </div>

        <div className="space-y-3 text-center">
          <h2 className="text-[22px] font-bold text-slate-900">{current.title}</h2>
          <p className="text-[15px] leading-relaxed text-slate-500">{current.description}</p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between px-4 pb-8 pb-safe">
        {step < STEPS.length - 1 ? (
          <>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-sm font-medium text-slate-400"
              disabled={step === 0}
            >
              {step > 0 ? '上一步' : ''}
            </button>
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="min-w-[120px]"
            >
              下一步 <ChevronRight size={18} />
            </Button>
          </>
        ) : (
          <>
            <div />
            <Button onClick={finish} className="min-w-[140px]" size="lg">
              开始使用
            </Button>
          </>
        )}
      </div>
    </div>
  );
}


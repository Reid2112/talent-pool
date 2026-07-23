// src/pages/CandidateEditPage.tsx — 新增/编辑候选人页（§6.1）
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CandidateForm } from '@/components/candidate/CandidateForm';
import { useCandidateDetail } from '@/hooks/useCandidateDetail';
import { createEmptyCandidate } from '@/types/candidate';
import type { Candidate } from '@/types/candidate';
import { genId } from '@/utils/id';
import { isPhone, isEmail } from '@/utils/validate';
import { toast } from 'sonner';

export function CandidateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidate, saveCandidate } = useCandidateDetail(id);
  const [form, setForm] = useState<Candidate>(() => candidate ?? createEmptyCandidate(genId()));
  const isEdit = !!id;

  useEffect(() => {
    if (candidate) setForm(candidate);
  }, [candidate]);

  const set = (patch: Partial<Candidate>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('请填写姓名');
      return;
    }
    if (form.phone && !isPhone(form.phone)) {
      toast.error('手机号格式不正确');
      return;
    }
    if (form.email && !isEmail(form.email)) {
      toast.error('邮箱格式不正确');
      return;
    }
    await saveCandidate(form);
    toast.success(isEdit ? '已更新' : '已添加');
    navigate('/candidates');
  };

  return (
    <>
      <Header
        title={isEdit ? '编辑候选人' : '新建候选人'}
        showBack
        right={
          <button onClick={handleSubmit} className="text-[15px] font-medium text-blue-600">
            保存
          </button>
        }
      />
      <CandidateForm form={form} onChange={set} onSubmit={handleSubmit} />
    </>
  );
}

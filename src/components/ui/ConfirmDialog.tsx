// src/components/ui/ConfirmDialog.tsx — 确认对话框（§6.2）
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = '确认操作',
  message = '',
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {message && <p className="text-sm text-slate-500">{message}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

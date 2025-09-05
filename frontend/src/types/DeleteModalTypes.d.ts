interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: (() => void) ;
  confirmText?: string;
  cancelText?: string;
}

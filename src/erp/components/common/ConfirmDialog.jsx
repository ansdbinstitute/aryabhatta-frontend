import React from 'react';
import useUIStore from '../../stores/uiStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ConfirmDialog = () => {
  const confirmDialog = useUIStore((s) => s.confirmDialog);
  const hideConfirm = useUIStore((s) => s.hideConfirm);

  if (!confirmDialog) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    hideConfirm();
  };

  return (
    <Modal
      isOpen={!!confirmDialog}
      onClose={hideConfirm}
      title={confirmDialog.title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={hideConfirm}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm}>
            {confirmDialog.confirmText || 'Confirm'}
          </Button>
        </>
      }
    >
      <p className="text-slate-600 text-sm">{confirmDialog.message}</p>
    </Modal>
  );
};

export default ConfirmDialog;

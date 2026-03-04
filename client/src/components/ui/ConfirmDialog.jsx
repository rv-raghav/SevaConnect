import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "danger",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="body-text mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button onClick={onClose} variant="secondary" size="md">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant={confirmVariant} size="md">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

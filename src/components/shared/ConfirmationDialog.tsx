import styles from "../../css/ConfirmationPage.module.css";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmationDialog({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancelButton = true,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlayStyle}>
      <div className={styles.dialog}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className={styles.actionsStyle}>
          {showCancelButton && (
            <button onClick={onCancel} className={styles.button}>
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} className={styles.button}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <Motion.div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            aria-label="Close modal backdrop"
          />
          <Motion.div
            className={`modal-card relative z-[1] w-full ${maxWidth} max-h-[90vh] flex flex-col`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b [border-color:var(--border)]">
              <h2 className="section-title">{title}</h2>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
}

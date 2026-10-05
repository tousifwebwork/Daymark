"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Sheet({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      dialogRef.current?.querySelector("input, textarea, button")?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          ref={dialogRef}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="surface relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] p-6 sm:max-w-md sm:rounded-[2rem]"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="surface-2 mx-auto mb-4 h-1 w-10 rounded-full sm:hidden" />
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 id="sheet-title" className="text-xl font-semibold tracking-tight">{title}</h2>
              <button type="button" onClick={onClose} className="muted grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl leading-none" aria-label="Close dialog">
                ×
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
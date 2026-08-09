import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  onReset?: () => void;
};

export function AlertModal({ open, title, message, onClose, onRetry, onReset }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-heading/40 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
        className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-warning"
            aria-hidden
          />
          <div className="min-w-0">
            <h3 id="alert-title" className="text-base font-semibold text-heading">
              {title}
            </h3>
            <p id="alert-message" className="mt-2 text-sm leading-relaxed text-foreground">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              Reset
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              Try Again
            </button>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

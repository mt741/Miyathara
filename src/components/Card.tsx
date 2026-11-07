import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Draws a small caret on the top edge, at this distance from the right edge. */
  caretRight?: number;
};

export function Card({ title, onClose, closeLabel = "Close", caretRight, className = "", children, ...props }: CardProps) {
  return (
    <div className={`relative rounded-card bg-white p-5 text-ink shadow-card md:p-6 ${className}`} {...props}>
      {caretRight !== undefined && (
        <span aria-hidden className="absolute -top-2 h-4 w-4 rotate-45 rounded-sm bg-white" style={{ right: caretRight }} />
      )}
      {(title || onClose) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>}
          {onClose && (
            <Button variant="icon" aria-label={closeLabel} onClick={onClose} className="-mr-2 -mt-1 shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

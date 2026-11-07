import type { HTMLAttributes, ReactNode } from "react";
import closeIcon from "../assets/close.svg";

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Draws the caret on the top edge. The value is the distance from the card's right edge to the caret's center. */
  caretRight?: number;
};

/** White card with a soft shadow, as the About and How it works windows in the design. */
export function Card({ title, onClose, closeLabel = "Close", caretRight, className = "", children, ...props }: CardProps) {
  return (
    <div className={`relative rounded-card bg-white p-5 text-ink-soft shadow-card md:p-[25px] ${className}`} {...props}>
      {caretRight !== undefined && (
        <svg
          aria-hidden
          width="42"
          height="23"
          viewBox="0 0 42 23"
          className="absolute -top-[22px]"
          style={{ right: caretRight - 21 }}
        >
          <path d="M0 23 17.6 3.2Q21-.8 24.4 3.2L42 23Z" fill="white" />
        </svg>
      )}
      {(title || onClose) && (
        <div className="mb-5 flex items-center justify-between gap-4 md:mb-6">
          {title && <h2 className="text-2xl font-bold leading-tight md:text-[30px]">{title}</h2>}
          {onClose && (
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="-mr-1 shrink-0 rounded-full p-1 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-link"
            >
              <img src={closeIcon} width={25} height={25} alt="" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

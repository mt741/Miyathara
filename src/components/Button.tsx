import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "glass" | "nav" | "icon" | "plain";

const variants: Record<Variant, string> = {
  // "Go to map": translucent pill over the hero photo
  glass:
    "rounded-full border border-white/40 bg-white/15 px-8 py-3 text-lg text-white backdrop-blur-sm hover:bg-white/25 md:px-14 md:py-4 md:text-[1.75rem] md:leading-none",
  // Text links in the navbar
  nav: "text-sm text-white/90 hover:text-white md:text-base",
  // Round outline icon button (back arrow, close)
  icon: "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-black/5",
  plain: "",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "plain", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link ${variants[variant]} ${className}`}
      {...props}
    />
  );
});

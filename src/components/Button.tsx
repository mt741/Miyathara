import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "glass" | "nav" | "icon" | "plain";

const variants: Record<Variant, string> = {
  // "Go to map": translucent pill over the hero photo
  glass:
    "rounded-full bg-white/10 px-10 py-3 text-xl text-white hover:bg-white/20 md:px-[85px] md:py-[17px] md:text-[33px] md:leading-normal",
  // Text links in the navbar
  nav: "text-base text-white hover:text-white/80 md:text-xl",
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

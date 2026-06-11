import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "bg-sunset text-white shadow-sm hover:bg-sunset/90",
  secondary: "bg-wood/20 text-ink border border-wood/40 hover:bg-wood/30",
  ghost: "text-ink/70 hover:text-ink hover:bg-wood/10",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

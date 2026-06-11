"use client";

import { boxLabels, type BoxVariant } from "@/lib/daily";
import { cn } from "@/lib/cn";

const boxStyles: Record<BoxVariant, string> = {
  wood: "from-amber-700 to-amber-900 border-amber-950",
  cloth: "from-rose-300 to-rose-400 border-rose-500",
  paper: "from-stone-200 to-stone-300 border-stone-400",
  iron: "from-zinc-500 to-zinc-700 border-zinc-800",
};

type Props = {
  variant: BoxVariant;
  opened?: boolean;
  isDeep?: boolean;
  className?: string;
};

export function TreasureBox({ variant, opened = false, isDeep = false, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex h-36 w-36 items-center justify-center rounded-2xl border-4 bg-gradient-to-br shadow-lg transition-transform",
          boxStyles[variant],
          isDeep && "ring-4 ring-amber-300/60 shadow-amber-200/50",
          opened && "animate-box-open",
        )}
        aria-hidden
      >
        <div className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 rounded bg-black/20" />
        <div
          className={cn(
            "absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-t-lg border-4 border-b-0 bg-gradient-to-b transition-transform origin-bottom",
            boxStyles[variant],
            opened && "-rotate-[110deg]",
          )}
        />
        <span className="text-4xl">{opened ? "✨" : isDeep ? "🌟" : "📦"}</span>
      </div>
      <p className="text-sm text-ink/60">{boxLabels[variant]}</p>
    </div>
  );
}

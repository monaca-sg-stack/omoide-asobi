"use client";

import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function AnswerInput({
  value,
  onChange,
  placeholder = "思い浮かんだことを、そのまま書いてみてください…",
}: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={6}
      className={cn(
        "note-lines w-full resize-none rounded-xl border border-wood/30 bg-white/60 p-4",
        "text-base leading-7 text-ink placeholder:text-ink/30",
        "focus:border-sunset/50 focus:outline-none focus:ring-2 focus:ring-sunset/20",
      )}
    />
  );
}

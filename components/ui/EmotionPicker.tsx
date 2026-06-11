"use client";

import { emotionLabels } from "@/lib/content";
import { cn } from "@/lib/cn";
import type { Emotion } from "@/types/session";

const selectable: Emotion[] = ["warm", "nostalgic", "fun"];

type Props = {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
};

export function EmotionPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {selectable.map((emotion) => {
        const { label, bg } = emotionLabels[emotion];
        const selected = value === emotion;
        return (
          <button
            key={emotion}
            type="button"
            onClick={() => onChange(emotion)}
            className={cn(
              "rounded-full px-5 py-2 text-sm transition-all",
              bg,
              selected
                ? "ring-2 ring-wood ring-offset-2 ring-offset-paper scale-105"
                : "opacity-80 hover:opacity-100",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

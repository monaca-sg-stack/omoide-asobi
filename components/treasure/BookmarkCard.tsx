import { emotionLabels } from "@/lib/content";
import { cn } from "@/lib/cn";
import type { Bookmark } from "@/types/session";

type Props = {
  bookmark: Bookmark;
  compact?: boolean;
  onClick?: () => void;
};

export function BookmarkCard({ bookmark, compact = false, onClick }: Props) {
  const { bg, label } = emotionLabels[bookmark.emotion];

  const inner = (
    <>
      <div
        className={cn(
          "h-2 w-full rounded-t-lg",
          bookmark.skipped ? "bg-gray-300" : bg,
          bookmark.isDeep && !bookmark.skipped && "h-3 bg-gradient-to-r from-amber-200 to-orange-300",
        )}
      />
      <div className="p-3">
        <p className="text-xs text-ink/50">
          {bookmark.skipped ? "？" : label}
        </p>
        <p className={cn("font-medium text-ink", compact ? "text-sm" : "text-base")}>
          {bookmark.questionTitle}
        </p>
        {!compact && bookmark.answerText && (
          <p className="mt-1 line-clamp-2 text-sm text-ink/70">
            {bookmark.answerText}
          </p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full overflow-hidden rounded-lg border border-wood/30 bg-white text-left shadow-sm transition hover:shadow-md"
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="w-28 shrink-0 overflow-hidden rounded-lg border border-wood/30 bg-white shadow-sm">
      {inner}
    </div>
  );
}

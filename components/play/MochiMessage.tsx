type Props = {
  message: string;
};

export function MochiMessage({ message }: Props) {
  return (
    <div className="flex gap-3 rounded-2xl border border-wood/20 bg-white/80 p-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage/30 text-2xl"
        aria-hidden
      >
        🐾
      </div>
      <div>
        <p className="text-xs font-medium text-sage">モチ</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/80">{message}</p>
      </div>
    </div>
  );
}

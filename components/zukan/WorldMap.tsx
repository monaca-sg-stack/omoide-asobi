"use client";

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

type Props = {
  keywords: string[];
  seed: string;
};

export function WorldMap({ keywords, seed }: Props) {
  if (keywords.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink/60">あなたの世界地図</h2>
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-wood/30 bg-white/40">
          <p className="text-sm text-ink/30">まだ、白い地図です</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-ink/60">あなたの世界地図</h2>
      <div className="relative h-48 overflow-hidden rounded-2xl border border-wood/20 bg-[#EDE8DC]">
        {keywords.map((keyword, i) => {
          const h = hashString(`${seed}_${keyword}_${i}`);
          const left = 8 + (h % 72);
          const top = 10 + ((h >> 4) % 60);
          const size =
            i === 0 ? "text-base" : i < 3 ? "text-sm" : "text-xs";
          const rotate = ((h % 7) - 3) * 2;

          return (
            <span
              key={keyword}
              className={`absolute font-rounded text-ink/70 ${size}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `rotate(${rotate}deg)`,
              }}
            >
              {keyword}
            </span>
          );
        })}
      </div>
    </section>
  );
}

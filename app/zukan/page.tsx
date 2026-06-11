"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { MochiMessage } from "@/components/play/MochiMessage";
import { KeywordChips } from "@/components/zukan/KeywordChips";
import { TitleStamp } from "@/components/zukan/TitleStamp";
import { WorldMap } from "@/components/zukan/WorldMap";
import { getZukanMochiMessage } from "@/lib/zukan/mochi";
import {
  getDisplayTitle,
  getOrCreateZukan,
  hasZukanContent,
} from "@/lib/zukan/storage";
import { getUser } from "@/lib/storage";
import type { AsobiZukan } from "@/types/zukan";

function ZukanContent() {
  const [zukan, setZukan] = useState<AsobiZukan | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) return;
    setZukan(getOrCreateZukan(user.id));
  }, []);

  if (!zukan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink/50">読み込み中…</p>
      </div>
    );
  }

  const displayTitle = getDisplayTitle(zukan);
  const hasContent = hasZukanContent(zukan);
  const topKeywords = zukan.frequentKeywords.slice(0, 8).map((k) => k.keyword);
  const worldLabels = zukan.favoriteWorlds.map((w) => w.label);
  const themeLabels = zukan.reactiveThemes.map((t) => t.label);

  return (
    <AppShell>
      <Header title="あそび人図鑑" />
      <main className="space-y-8 px-4 pb-8">
        {!hasContent ? (
          <div className="space-y-6 py-8 text-center">
            <div className="text-5xl">📖</div>
            <p className="text-sm leading-relaxed text-ink/60">
              図鑑は、まだ白いページです。
              <br />
              宝箱を開けるたびに、あなたらしさが
              <br />
              少しずつ描かれていきます。
            </p>
          </div>
        ) : (
          <>
            {displayTitle && <TitleStamp title={displayTitle} />}

            <KeywordChips
              title="よく出てくるもの"
              items={[...new Set([...topKeywords, ...worldLabels])].slice(0, 8)}
              emptyText="まだ少しだけ"
            />

            <KeywordChips
              title="心が動きやすいテーマ"
              items={themeLabels}
            />

            <WorldMap
              keywords={zukan.worldMapKeywords}
              seed={zukan.userId}
            />

            {zukan.titleHistory.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-sm font-medium text-ink/60">昔の呼び名</h2>
                <div className="flex flex-wrap gap-2">
                  {zukan.titleHistory
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <span
                        key={`${entry.title}_${entry.from}`}
                        className="rounded-full bg-wood/10 px-3 py-1 text-xs text-ink/50"
                      >
                        {entry.title}
                      </span>
                    ))}
                </div>
              </section>
            )}
          </>
        )}

        <MochiMessage message={getZukanMochiMessage(zukan, false)} />
      </main>
    </AppShell>
  );
}

export default function ZukanPage() {
  return (
    <AuthGuard>
      <ZukanContent />
    </AuthGuard>
  );
}

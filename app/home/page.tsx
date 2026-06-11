"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { MochiMessage } from "@/components/play/MochiMessage";
import { BookmarkCard } from "@/components/treasure/BookmarkCard";
import { TreasureBox } from "@/components/treasure/TreasureBox";
import { Button } from "@/components/ui/Button";
import { getBoxLabel, getBoxVariant } from "@/lib/daily";
import { getMochiGreeting } from "@/lib/mochi";
import {
  getBookmarks,
  getOrCreateTodaySession,
  markSessionOpened,
} from "@/lib/storage";
import type { Bookmark, DailySession } from "@/types/session";

function HomeContent() {
  const router = useRouter();
  const [session, setSession] = useState<DailySession | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [opening, setOpening] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const today = getOrCreateTodaySession();
      setSession(today);
      setBookmarks(getBookmarks().slice(-8).reverse());
      setBoxOpened(!!today.openedAt || !!today.completedAt);
    } catch {
      setLoadError("データの読み込みに失敗しました。設定から作り直せます。");
    }
  }, []);

  if (loadError) {
    return (
      <AppShell>
        <Header />
        <main className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="text-sm text-ink/70">{loadError}</p>
          <Button onClick={() => router.push("/settings")}>設定へ</Button>
        </main>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink/50">読み込み中…</p>
      </div>
    );
  }

  const variant = getBoxVariant(session.date, !!session.isDeepBox);
  const completed = !!session.completedAt;
  const greeting = session.isDeepBox
    ? "今日は深い宝箱の日。少しだけ、記憶の奥まで遊んでみよう。"
    : getMochiGreeting(session.date);
  const boxLabel = getBoxLabel(session.date, !!session.isDeepBox);

  function handleOpen() {
    if (!session) return;
    if (completed) {
      router.push("/album");
      return;
    }
    setOpening(true);
    markSessionOpened(session.id);
    setTimeout(() => {
      setBoxOpened(true);
      setTimeout(() => {
        router.push(`/play/${session.id}`);
      }, 600);
    }, 800);
  }

  return (
    <AppShell>
      <Header />
      <main className="space-y-8 px-4 pb-8">
        <section className="flex flex-col items-center space-y-6 py-4">
          {session.isDeepBox && !completed && (
            <span className="rounded-full bg-amber-100 px-4 py-1 text-xs font-medium text-amber-800">
              ✨ 今日は深い宝箱
            </span>
          )}
          <TreasureBox
            variant={variant}
            opened={boxOpened || opening}
            isDeep={!!session.isDeepBox}
          />
          {completed ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-ink/60">今日の宝箱は開封済みです</p>
              <Button onClick={() => router.push("/album")}>
                今日のしおりを見る
              </Button>
            </div>
          ) : (
            <Button onClick={handleOpen} disabled={opening}>
              {opening ? "開けています…" : `${boxLabel}を開ける`}
            </Button>
          )}
        </section>

        {bookmarks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-ink/60">しおり棚</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {bookmarks.map((b) => (
                <BookmarkCard key={b.id} bookmark={b} compact />
              ))}
            </div>
          </section>
        )}

        <MochiMessage message={greeting} />
      </main>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

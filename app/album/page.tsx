"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { BookmarkCard } from "@/components/treasure/BookmarkCard";
import { formatDateJa } from "@/lib/daily";
import { getCompletedSessions, getBookmarks } from "@/lib/storage";
import { getQuestionById } from "@/lib/questions";
import type { Bookmark, DailySession } from "@/types/session";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type AlbumEntry = {
  session: DailySession;
  bookmarks: Bookmark[];
};

function AlbumContent() {
  const [entries, setEntries] = useState<AlbumEntry[]>([]);
  const [selected, setSelected] = useState<AlbumEntry | null>(null);
  const [view, setView] = useState<"list" | "shelf">("list");

  useEffect(() => {
    const sessions = getCompletedSessions();
    const allBookmarks = getBookmarks();
    const data = sessions.map((session) => ({
      session,
      bookmarks: allBookmarks.filter((b) => b.sessionId === session.id),
    }));
    setEntries(data);
  }, []);

  const allBookmarks = entries.flatMap((e) => e.bookmarks);

  return (
    <AppShell>
      <Header title="アルバム" />
      <main className="space-y-6 px-4 pb-8">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-full px-4 py-1.5 text-sm ${
              view === "list"
                ? "bg-sunset text-white"
                : "bg-wood/20 text-ink/70"
            }`}
          >
            一覧
          </button>
          <button
            type="button"
            onClick={() => setView("shelf")}
            className={`rounded-full px-4 py-1.5 text-sm ${
              view === "shelf"
                ? "bg-sunset text-white"
                : "bg-wood/20 text-ink/70"
            }`}
          >
            しおり棚
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="space-y-4 py-12 text-center">
            <p className="text-ink/60">まだしおりがありません。</p>
            <Link href="/home">
              <Button>今日の宝箱を開けましょう</Button>
            </Link>
          </div>
        ) : view === "list" ? (
          <div className="space-y-3">
            {entries.map(({ session, bookmarks }) => (
              <button
                key={session.id}
                type="button"
                onClick={() => setSelected({ session, bookmarks })}
                className="w-full rounded-xl border border-wood/20 bg-white/60 p-4 text-left transition hover:shadow-sm"
              >
                <p className="text-sm text-ink/50">
                  {formatDateJa(session.date)}
                </p>
                <p className="mt-1 font-medium text-ink">
                  {bookmarks.map((b) => b.questionTitle).join("、")}
                </p>
                <div className="mt-2 flex gap-1">
                  {bookmarks.map((b) => (
                    <span
                      key={b.id}
                      className={`h-2 w-6 rounded-full ${
                        b.skipped ? "bg-gray-300" : "bg-sunset/60"
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allBookmarks.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                onClick={() => {
                  const entry = entries.find(
                    (e) => e.session.id === b.sessionId,
                  );
                  if (entry) setSelected(entry);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal
        >
          <div
            className="max-h-[80vh] w-full max-w-app overflow-y-auto rounded-2xl bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-ink/50">
              {formatDateJa(selected.session.date)}
            </p>
            <div className="mt-4 space-y-6">
              {selected.session.questionIds.map((qid, i) => {
                const q = getQuestionById(qid);
                const answer = selected.session.answers[i];
                const bookmark = selected.bookmarks.find(
                  (b) => b.questionId === qid,
                );
                return (
                  <div key={qid} className="space-y-2">
                    <h3 className="font-rounded font-medium text-ink">
                      {q?.title}
                    </h3>
                    <p className="text-sm text-ink/60">{q?.body}</p>
                    <p className="rounded-lg bg-white/80 p-3 text-sm leading-relaxed text-ink">
                      {answer?.skipped
                        ? "今日は出てこなかった"
                        : answer?.text}
                    </p>
                    {bookmark && (
                      <BookmarkCard bookmark={bookmark} compact />
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full text-center text-sm text-ink/50"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function AlbumPage() {
  return (
    <AuthGuard>
      <AlbumContent />
    </AuthGuard>
  );
}

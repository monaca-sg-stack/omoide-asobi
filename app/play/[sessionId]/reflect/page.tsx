"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MochiMessage } from "@/components/play/MochiMessage";
import { BookmarkCard } from "@/components/treasure/BookmarkCard";
import { Button } from "@/components/ui/Button";
import { EmotionPicker } from "@/components/ui/EmotionPicker";
import { getMochiMessage } from "@/lib/mochi";
import { getQuestionById } from "@/lib/questions";
import { getZukanMochiMessage, getZukanReflectHint } from "@/lib/zukan/mochi";
import { completeSession, getSessionById } from "@/lib/storage";
import type { Bookmark, DailySession, Emotion } from "@/types/session";

function ReflectContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<DailySession | null>(null);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [stamped, setStamped] = useState(false);
  const [zukanHint, setZukanHint] = useState<string | null>(null);

  useEffect(() => {
    const s = getSessionById(sessionId);
    if (!s) {
      router.replace("/home");
      return;
    }
    if (s.completedAt) {
      router.replace("/home");
      return;
    }
    if (!s.answers.length) {
      router.replace(`/play/${sessionId}`);
      return;
    }
    setSession(s);
  }, [sessionId, router]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink/50">読み込み中…</p>
      </div>
    );
  }

  const mochiMessage = getMochiMessage(session.answers);

  function handleComplete() {
    if (!emotion) return;
    const result = completeSession(sessionId, emotion);
    if (result) {
      setStamped(true);
      if (result.zukanUpdate) {
        const { zukan, titleChanged } = result.zukanUpdate;
        const hasNewContent = result.session.answers.some(
          (a) => !a.skipped && a.text.trim(),
        );
        if (hasNewContent) {
          setZukanHint(
            titleChanged && zukan.title
              ? getZukanMochiMessage(zukan, true)
              : getZukanReflectHint(),
          );
        }
      }
      setTimeout(() => router.push("/home"), 1800);
    }
  }

  const previewBookmarks: Bookmark[] = session.questionIds.map((qid, index) => {
    const q = getQuestionById(qid);
    const a = session.answers[index];
    return {
      id: `preview_${qid}`,
      sessionId,
      date: session.date,
      questionId: qid,
      questionTitle: q?.title ?? "",
      answerText: a?.skipped ? "今日は出てこなかった" : (a?.text ?? ""),
      emotion: a?.skipped ? "unknown" : (emotion ?? "warm"),
      skipped: a?.skipped ?? false,
      createdAt: new Date().toISOString(),
    };
  });

  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <div className="flex-1 space-y-8">
        <h2 className="font-rounded text-xl font-medium text-ink">
          あなたの答え
        </h2>

        <div className="space-y-4">
          {session.answers.map((answer) => {
            const q = getQuestionById(answer.questionId);
            return (
              <div
                key={answer.questionId}
                className="rounded-xl border border-wood/20 bg-white/60 p-4"
              >
                <p className="text-xs text-ink/50">{q?.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {answer.skipped
                    ? "今日は出てこなかった"
                    : answer.text || "（未入力）"}
                </p>
              </div>
            );
          })}
        </div>

        {stamped && (
          <div className="flex justify-center gap-3 animate-bookmark-stamp">
            {previewBookmarks.map((b) => (
              <BookmarkCard key={b.id} bookmark={b} compact />
            ))}
          </div>
        )}

        <MochiMessage message={mochiMessage} />

        {!stamped && (
          <div className="space-y-4">
            <p className="text-center text-sm text-ink/60">
              今日のしおりの色は？
            </p>
            <EmotionPicker value={emotion} onChange={setEmotion} />
          </div>
        )}
      </div>

      {!stamped && (
        <Button fullWidth onClick={handleComplete} disabled={!emotion}>
          しおり棚にしまう
        </Button>
      )}

      {stamped && (
        <div className="space-y-3 text-center">
          <p className="text-sm text-sage">しおりにしまいました…</p>
          {zukanHint && (
            <div className="space-y-2">
              <p className="text-sm text-ink/60">{zukanHint}</p>
              <Link
                href="/zukan"
                className="inline-block text-sm text-sunset underline-offset-2 hover:underline"
              >
                図鑑をのぞく
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function ReflectPage() {
  return (
    <AuthGuard>
      <ReflectContent />
    </AuthGuard>
  );
}

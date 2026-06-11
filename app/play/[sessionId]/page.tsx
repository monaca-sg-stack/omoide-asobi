"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AnswerInput } from "@/components/play/AnswerInput";
import { QuestionCard } from "@/components/play/QuestionCard";
import { Button } from "@/components/ui/Button";
import { getQuestionById } from "@/lib/questions";
import {
  clearPlayDraft,
  getPlayDraft,
  getSessionById,
  savePlayDraft,
  saveSessionAnswers,
} from "@/lib/storage";
import type { Answer, DailySession } from "@/types/session";

function PlayContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<DailySession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loaded = getSessionById(sessionId);
      if (!loaded) {
        router.replace("/home");
        return;
      }
      if (loaded.completedAt) {
        router.replace("/home");
        return;
      }
      if (!loaded.questionIds?.length) {
        setError("今日の宝箱を作り直してください。");
        return;
      }

      setSession(loaded);

      const draft = getPlayDraft();
      if (draft?.sessionId === sessionId) {
        setCurrentIndex(draft.currentIndex);
        setAnswers(draft.answers);
        const current = draft.answers[draft.currentIndex];
        setText(current?.skipped ? "" : (current?.text ?? ""));
      } else {
        setAnswers(
          loaded.questionIds.map((qid) => ({
            questionId: qid,
            text: "",
            skipped: false,
          })),
        );
      }
      setReady(true);
    } catch {
      setError("データの読み込みに失敗しました。");
    }
  }, [sessionId, router]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-sm text-ink/70">{error}</p>
        <Button onClick={() => router.push("/settings")}>設定へ</Button>
      </main>
    );
  }

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink/50">読み込み中…</p>
      </div>
    );
  }

  const questionId = session.questionIds[currentIndex];
  const question = getQuestionById(questionId);
  const total = session.questionIds.length;
  const isLast = currentIndex === total - 1;

  if (!question) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-sm text-ink/70">
          問いが見つかりませんでした。
        </p>
        <Button onClick={() => router.push("/home")}>ホームへ</Button>
      </main>
    );
  }

  function persistDraft(index: number, updatedAnswers: Answer[]) {
    savePlayDraft({ sessionId, currentIndex: index, answers: updatedAnswers });
    saveSessionAnswers(sessionId, updatedAnswers);
  }

  function handleNext() {
    const updated = [...answers];
    updated[currentIndex] = {
      questionId,
      text: text.trim(),
      skipped: false,
    };
    setAnswers(updated);

    if (isLast) {
      saveSessionAnswers(sessionId, updated);
      clearPlayDraft();
      router.push(`/play/${sessionId}/reflect`);
      return;
    }

    const nextIndex = currentIndex + 1;
    persistDraft(nextIndex, updated);
    setCurrentIndex(nextIndex);
    const nextAnswer = updated[nextIndex];
    setText(nextAnswer?.skipped ? "" : (nextAnswer?.text ?? ""));
  }

  function handleSkip() {
    const updated = [...answers];
    updated[currentIndex] = {
      questionId,
      text: "",
      skipped: true,
    };
    setAnswers(updated);

    if (isLast) {
      saveSessionAnswers(sessionId, updated);
      clearPlayDraft();
      router.push(`/play/${sessionId}/reflect`);
      return;
    }

    const nextIndex = currentIndex + 1;
    persistDraft(nextIndex, updated);
    setCurrentIndex(nextIndex);
    setText("");
  }

  function handleQuit() {
    if (window.confirm("途中でやめますか？入力内容は保存されます。")) {
      persistDraft(currentIndex, answers);
      router.push("/home");
    }
  }

  return (
    <main className="flex min-h-screen flex-col px-6 py-6">
      <button
        type="button"
        onClick={handleQuit}
        className="self-start text-sm text-ink/50 hover:text-ink"
      >
        ← やめる
      </button>

      <div className="flex-1 space-y-6 py-6">
        <QuestionCard question={question} index={currentIndex} total={total} />
        <AnswerInput value={text} onChange={setText} />
      </div>

      <div className="space-y-3 pb-8">
        <Button fullWidth onClick={handleNext} disabled={!text.trim()}>
          {isLast ? "ふりかえりへ" : "つぎの問いへ"}
        </Button>
        <Button fullWidth variant="ghost" onClick={handleSkip}>
          今日は出てこなかった
        </Button>
      </div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <AuthGuard>
      <PlayContent />
    </AuthGuard>
  );
}

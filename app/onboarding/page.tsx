"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnswerInput } from "@/components/play/AnswerInput";
import { MochiMessage } from "@/components/play/MochiMessage";
import { QuestionCard } from "@/components/play/QuestionCard";
import { BookmarkCard } from "@/components/treasure/BookmarkCard";
import { Button } from "@/components/ui/Button";
import { getQuestionById } from "@/lib/questions";
import { updateUser } from "@/lib/storage";
import type { Bookmark } from "@/types/session";

const sampleQuestionId = "q01";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const question = getQuestionById(sampleQuestionId)!;

  function finish() {
    updateUser({ onboardingComplete: true });
    router.push("/home");
  }

  if (step === 0) {
    return (
      <main className="flex min-h-screen flex-col px-6 py-12">
        <div className="flex-1 space-y-8 pt-12">
          <div className="text-center text-5xl">🐾</div>
          <MochiMessage message="こんにちは、モチだよ。ここは記憶の屋根裏。あなたの思い出が、宝箱にしまわれているんだ。" />
          <p className="text-center text-sm text-ink/60">
            脳トレじゃないよ。正解もひとつじゃない。
            <br />
            自分の人生で、あそぼう。
          </p>
        </div>
        <Button fullWidth onClick={() => setStep(1)}>
          つぎへ
        </Button>
      </main>
    );
  }

  if (step === 1) {
    return (
      <main className="flex min-h-screen flex-col px-6 py-8">
        <div className="flex-1 space-y-6">
          <QuestionCard question={question} index={0} total={1} />
          <AnswerInput value={answer} onChange={setAnswer} />
        </div>
        <div className="space-y-3 pt-4">
          <Button
            fullWidth
            onClick={() => setStep(2)}
            disabled={!answer.trim()}
          >
            できた
          </Button>
          <Button fullWidth variant="ghost" onClick={() => setStep(2)}>
            今日は出てこなかった
          </Button>
        </div>
      </main>
    );
  }

  const previewBookmark: Bookmark = {
    id: "onboarding_preview",
    sessionId: "onboarding",
    date: new Date().toISOString().slice(0, 10),
    questionId: sampleQuestionId,
    questionTitle: question.title,
    answerText: answer.trim() || "今日は出てこなかった",
    emotion: answer.trim() ? "warm" : "unknown",
    skipped: !answer.trim(),
    createdAt: new Date().toISOString(),
  };

  return (
    <main className="flex min-h-screen flex-col px-6 py-12">
      <div className="flex-1 space-y-8 pt-8">
        <h2 className="text-center font-rounded text-xl font-medium text-ink">
          あなたの答えが、しおりになりました
        </h2>
        <div className="flex justify-center">
          <div className="animate-bookmark-stamp w-48">
            <BookmarkCard bookmark={previewBookmark} />
          </div>
        </div>
        <MochiMessage message="いいね。これが思い出しあそびの流れだよ。毎日、宝箱をひとつ開けよう。" />
      </div>
      <Button fullWidth onClick={finish}>
        部屋へ行く
      </Button>
    </main>
  );
}

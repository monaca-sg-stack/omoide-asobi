"use client";

import { pickDailyQuestions, todayString } from "@/lib/daily";
import { getQuestionById } from "@/lib/questions";
import { hasValidQuestions, repairAllSessions, repairSession } from "@/lib/session-repair";
import { clearZukan } from "@/lib/zukan/storage";
import { updateZukanFromSession } from "@/lib/zukan/update";
import type { Bookmark, DailySession, Emotion, UserProfile } from "@/types/session";
import type { ZukanUpdateResult } from "@/types/zukan";

const KEYS = {
  user: "omoide_user",
  sessions: "omoide_sessions",
  bookmarks: "omoide_bookmarks",
  playDraft: "omoide_play_draft",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUser(): UserProfile | null {
  return readJson<UserProfile | null>(KEYS.user, null);
}

export function createGuestUser(): UserProfile {
  const user: UserProfile = {
    id: `guest_${Date.now()}`,
    displayName: "ゲスト",
    onboardingComplete: false,
    reminderEnabled: false,
    reminderTime: "20:00",
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.user, user);
  return user;
}

export function updateUser(partial: Partial<UserProfile>): UserProfile | null {
  const user = getUser();
  if (!user) return null;
  const updated = { ...user, ...partial };
  writeJson(KEYS.user, updated);
  return updated;
}

export function clearUser(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.sessions);
  localStorage.removeItem(KEYS.bookmarks);
  localStorage.removeItem(KEYS.playDraft);
  clearZukan();
}

export function getSessions(): DailySession[] {
  const raw = readJson<DailySession[]>(KEYS.sessions, []);
  if (!isBrowser() || raw.length === 0) return raw;

  const needsRepair = raw.some((s) => !hasValidQuestions(s));
  if (!needsRepair) return raw;

  const repaired = repairAllSessions(raw);
  writeJson(KEYS.sessions, repaired);
  return repaired;
}

export function getSessionById(id: string): DailySession | undefined {
  return getSessions().find((s) => s.id === id);
}

export function getTodaySession(): DailySession | undefined {
  const today = todayString();
  return getSessions().find((s) => s.date === today);
}

export function getOrCreateTodaySession(): DailySession {
  const today = todayString();
  let sessions = getSessions();
  const existingIndex = sessions.findIndex((s) => s.date === today);

  if (existingIndex !== -1) {
    const existing = sessions[existingIndex];
    if (!hasValidQuestions(existing)) {
      const repaired = repairSession(existing, sessions);
      sessions = [...sessions];
      sessions[existingIndex] = repaired;
      writeJson(KEYS.sessions, sessions);
      return repaired;
    }
    return existing;
  }

  const { questionIds, isDeepBox } = pickDailyQuestions(today, sessions);
  const session: DailySession = {
    id: today,
    date: today,
    questionIds,
    answers: [],
    isDeepBox,
  };

  writeJson(KEYS.sessions, [...sessions, session]);
  return session;
}

/** 今日の宝箱を問いごと作り直す（確認済みのとき） */
export function resetTodaySession(): DailySession {
  const today = todayString();
  const sessions = getSessions().filter((s) => s.date !== today);
  const { questionIds, isDeepBox } = pickDailyQuestions(today, sessions);
  const session: DailySession = {
    id: today,
    date: today,
    questionIds,
    answers: [],
    isDeepBox,
  };
  writeJson(KEYS.sessions, [...sessions, session]);
  clearPlayDraft();
  return session;
}

export function markSessionOpened(sessionId: string): DailySession | null {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return null;

  sessions[index] = {
    ...sessions[index],
    openedAt: new Date().toISOString(),
  };
  writeJson(KEYS.sessions, sessions);
  return sessions[index];
}

export function saveSessionAnswers(
  sessionId: string,
  answers: DailySession["answers"],
): DailySession | null {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return null;

  sessions[index] = { ...sessions[index], answers };
  writeJson(KEYS.sessions, sessions);
  return sessions[index];
}

export function completeSession(
  sessionId: string,
  emotion: Emotion,
): {
  session: DailySession;
  bookmarks: Bookmark[];
  zukanUpdate?: ZukanUpdateResult;
} | null {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return null;

  const session = sessions[index];
  const completed: DailySession = {
    ...session,
    emotion,
    completedAt: new Date().toISOString(),
  };
  sessions[index] = completed;
  writeJson(KEYS.sessions, sessions);

  const existingBookmarks = getBookmarks();
  const newBookmarks: Bookmark[] = session.questionIds.map((questionId, i) => {
    const question = getQuestionById(questionId);
    const answer = session.answers[i];
    return {
      id: `${sessionId}_${questionId}`,
      sessionId,
      date: session.date,
      questionId,
      questionTitle: question?.title ?? "思い出しあそび",
      answerText: answer?.skipped ? "今日は出てこなかった" : (answer?.text ?? ""),
      emotion: answer?.skipped ? "unknown" : emotion,
      skipped: answer?.skipped ?? false,
      createdAt: new Date().toISOString(),
      isDeep: (question?.depth ?? 1) >= 2,
    };
  });

  const merged = [
    ...existingBookmarks.filter((b) => b.sessionId !== sessionId),
    ...newBookmarks,
  ];
  writeJson(KEYS.bookmarks, merged);

  const user = getUser();
  let zukanUpdate: ZukanUpdateResult | undefined;
  if (user) {
    zukanUpdate = updateZukanFromSession(
      user.id,
      session.answers,
      emotion,
    );
  }

  return { session: completed, bookmarks: newBookmarks, zukanUpdate };
}

export function getBookmarks(): Bookmark[] {
  return readJson<Bookmark[]>(KEYS.bookmarks, []);
}

export function getCompletedSessions(): DailySession[] {
  return getSessions()
    .filter((s) => s.completedAt)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type PlayDraft = {
  sessionId: string;
  currentIndex: number;
  answers: DailySession["answers"];
};

export function getPlayDraft(): PlayDraft | null {
  return readJson<PlayDraft | null>(KEYS.playDraft, null);
}

export function savePlayDraft(draft: PlayDraft): void {
  writeJson(KEYS.playDraft, draft);
}

export function clearPlayDraft(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.playDraft);
}

import { questions } from "@/lib/questions";
import type { Question } from "@/types/question";
import type { DailySession } from "@/types/session";

function hashDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateJa(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function getRecentQuestionIds(sessions: DailySession[], days: number): Set<string> {
  const recent = new Set<string>();
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  for (const session of sorted.slice(0, days)) {
    for (const id of session.questionIds) {
      recent.add(id);
    }
  }
  return recent;
}

/** 土曜 = 深い宝箱の日 */
export function isDeepBoxDay(date: string): boolean {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 6;
}

function pickFromPool(
  pool: Question[],
  fallback: Question[],
  date: string,
  slot: number,
  used: Set<string>,
): string | null {
  const candidates = (pool.length > 0 ? pool : fallback).filter(
    (q) => !used.has(q.id),
  );
  if (candidates.length === 0) return null;

  const seed = hashDate(date);
  const index = (seed + slot * 11) % candidates.length;
  return candidates[index].id;
}

export type DailyPick = {
  questionIds: string[];
  isDeepBox: boolean;
};

/**
 * 平日: 深度① ×1 ＋ 深度② ×1
 * 土曜: 深度③ ×1 ＋ 深度② ×1（深い宝箱）
 */
export function pickDailyQuestions(
  date: string,
  pastSessions: DailySession[],
): DailyPick {
  const recent = getRecentQuestionIds(pastSessions, 7);
  const notRecent = (q: Question) => !recent.has(q.id);

  const pool1 = questions.filter((q) => q.depth === 1 && notRecent(q));
  const pool2 = questions.filter((q) => q.depth === 2 && notRecent(q));
  const pool3 = questions.filter((q) => q.depth === 3 && notRecent(q));

  const all1 = questions.filter((q) => q.depth === 1);
  const all2 = questions.filter((q) => q.depth === 2);
  const all3 = questions.filter((q) => q.depth === 3);

  const used = new Set<string>();
  const isDeepBox = isDeepBoxDay(date);

  if (isDeepBox) {
    const ids: string[] = [];
    const q3 = pickFromPool(pool3, all3, date, 0, used);
    if (q3) {
      ids.push(q3);
      used.add(q3);
    }
    const q2 = pickFromPool(pool2, all2, date, 1, used);
    if (q2) ids.push(q2);
    if (ids.length === 0) {
      ids.push(all3[0]?.id ?? all2[0]?.id ?? questions[0].id);
    }
    return { questionIds: ids, isDeepBox: true };
  }

  const ids: string[] = [];
  const q1 = pickFromPool(pool1, all1, date, 0, used);
  if (q1) {
    ids.push(q1);
    used.add(q1);
  }
  const q2 = pickFromPool(pool2, all2, date, 1, used);
  if (q2) ids.push(q2);

  if (ids.length === 0) {
    ids.push(all1[0]?.id ?? questions[0].id);
    if (all2[0] && all2[0].id !== ids[0]) ids.push(all2[0].id);
  }

  return { questionIds: ids, isDeepBox: false };
}

export const boxVariants = ["wood", "cloth", "paper", "iron"] as const;
export type BoxVariant = (typeof boxVariants)[number];

export function getBoxVariant(date: string, isDeepBox = false): BoxVariant {
  if (isDeepBox) return "iron";
  const index = hashDate(date) % boxVariants.length;
  return boxVariants[index];
}

export const boxLabels: Record<BoxVariant, string> = {
  wood: "木の宝箱",
  cloth: "布の袋",
  paper: "紙の封筒",
  iron: "古い鉄箱",
};

export function getBoxLabel(date: string, isDeepBox: boolean): string {
  if (isDeepBox) return "深い宝箱";
  return boxLabels[getBoxVariant(date, false)];
}

export const depthLabels: Record<1 | 2 | 3, string> = {
  1: "あたたかい問い",
  2: "ちょい深い問い",
  3: "深い宝箱の問い",
};

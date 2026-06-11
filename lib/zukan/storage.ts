"use client";

import {
  DEFAULT_TITLE,
  memoryTypeLabels,
  themeLabels,
  worldLabels,
} from "@/lib/zukan/dictionaries";
import type { AsobiZukan, MemoryType } from "@/types/zukan";

const ZUKAN_KEY = "omoide_zukan";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emptyMemoryScores(): Record<MemoryType, number> {
  return { scene: 0, person: 0, sense: 0, episode: 0 };
}

export function createEmptyZukan(userId: string): AsobiZukan {
  const now = new Date().toISOString();
  return {
    userId,
    updatedAt: now,
    title: "",
    titleAssignedAt: now,
    titleHistory: [],
    favoriteWorlds: [],
    memoryTypeScores: emptyMemoryScores(),
    memoryTypeLabel: memoryTypeLabels.episode,
    reactiveThemes: [],
    frequentKeywords: [],
    worldMapKeywords: [],
    totalAnswers: 0,
  };
}

export function getZukan(): AsobiZukan | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(ZUKAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AsobiZukan;
  } catch {
    return null;
  }
}

export function saveZukan(zukan: AsobiZukan): void {
  if (!isBrowser()) return;
  localStorage.setItem(ZUKAN_KEY, JSON.stringify(zukan));
}

export function clearZukan(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ZUKAN_KEY);
}

export function getOrCreateZukan(userId: string): AsobiZukan {
  const existing = getZukan();
  if (existing && existing.userId === userId) {
    return {
      ...existing,
      memoryTypeScores: {
        ...emptyMemoryScores(),
        ...existing.memoryTypeScores,
      },
    };
  }
  const fresh = createEmptyZukan(userId);
  saveZukan(fresh);
  return fresh;
}

export function dominantMemoryType(
  scores: Record<MemoryType, number>,
): MemoryType {
  const entries = Object.entries(scores) as [MemoryType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "episode";
}

export function getWorldLabel(tag: keyof typeof worldLabels): string {
  return worldLabels[tag];
}

export function getThemeLabel(tag: keyof typeof themeLabels): string {
  return themeLabels[tag];
}

export function hasZukanContent(zukan: AsobiZukan): boolean {
  return (
    zukan.totalAnswers > 0 &&
    (zukan.frequentKeywords.length > 0 ||
      zukan.favoriteWorlds.length > 0 ||
      zukan.reactiveThemes.length > 0)
  );
}

export function getDisplayTitle(zukan: AsobiZukan): string | null {
  if (zukan.totalAnswers < 3) return null;
  return zukan.title || DEFAULT_TITLE;
}

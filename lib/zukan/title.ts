import {
  DEFAULT_TITLE,
  TITLE_COOLDOWN_DAYS,
  TITLE_MIN_ANSWERS,
  titlePatterns,
} from "@/lib/zukan/dictionaries";
import type { AsobiZukan } from "@/types/zukan";

function daysBetween(a: string, b: string): number {
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return ms / (1000 * 60 * 60 * 24);
}

export function buildKeywordBlob(zukan: AsobiZukan, extra: string[] = []): string {
  const fromZukan = zukan.frequentKeywords.map((k) => k.keyword);
  return [...fromZukan, ...extra].join(" ");
}

export function computeTitle(blob: string): string {
  const sorted = [...titlePatterns].sort((a, b) => b.priority - a.priority);

  for (const pattern of sorted) {
    if (pattern.keywords.length === 0) continue;
    if (pattern.keywords.some((kw) => blob.includes(kw))) {
      return pattern.title;
    }
  }

  return DEFAULT_TITLE;
}

export function maybeUpdateTitle(
  zukan: AsobiZukan,
  newKeywords: string[],
): { title: string; changed: boolean } {
  if (zukan.totalAnswers < TITLE_MIN_ANSWERS) {
    return { title: zukan.title || DEFAULT_TITLE, changed: false };
  }

  const blob = buildKeywordBlob(zukan, newKeywords);
  const candidate = computeTitle(blob);

  if (zukan.title === candidate || (!zukan.title && candidate === DEFAULT_TITLE)) {
    return { title: zukan.title || candidate, changed: false };
  }

  if (
    zukan.title &&
    zukan.titleAssignedAt &&
    daysBetween(zukan.titleAssignedAt, new Date().toISOString()) < TITLE_COOLDOWN_DAYS
  ) {
    return { title: zukan.title, changed: false };
  }

  return { title: candidate, changed: true };
}

export function applyTitleChange(
  zukan: AsobiZukan,
  newTitle: string,
  changed: boolean,
): void {
  if (!changed) {
    if (!zukan.title) {
      zukan.title = newTitle;
      zukan.titleAssignedAt = new Date().toISOString();
    }
    return;
  }

  if (zukan.title) {
    zukan.titleHistory.push({
      title: zukan.title,
      from: zukan.titleAssignedAt || zukan.updatedAt,
      to: new Date().toISOString(),
    });
    if (zukan.titleHistory.length > 5) {
      zukan.titleHistory = zukan.titleHistory.slice(-5);
    }
  }

  zukan.title = newTitle;
  zukan.titleAssignedAt = new Date().toISOString();
}

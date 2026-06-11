import { extractFromText, scoreMemoryType } from "@/lib/zukan/extract";
import {
  applyTitleChange,
  maybeUpdateTitle,
} from "@/lib/zukan/title";
import {
  dominantMemoryType,
  getOrCreateZukan,
  saveZukan,
} from "@/lib/zukan/storage";
import { memoryTypeLabels, themeLabels, worldLabels } from "@/lib/zukan/dictionaries";
import { getQuestionById } from "@/lib/questions";
import type { Answer, Emotion } from "@/types/session";
import type {
  AsobiZukan,
  KeywordCount,
  ThemeTag,
  ZukanUpdateResult,
} from "@/types/zukan";

function incrementTagCounts<T extends string>(
  items: { tag: T; label: string; count: number }[],
  tags: T[],
  labelMap: Record<T, string>,
): { tag: T; label: string; count: number }[] {
  const map = new Map(items.map((i) => [i.tag, { ...i }]));

  for (const tag of tags) {
    const existing = map.get(tag);
    if (existing) {
      existing.count += 1;
      map.set(tag, existing);
    } else {
      map.set(tag, { tag, label: labelMap[tag], count: 1 });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

function incrementKeywords(
  items: KeywordCount[],
  keywords: string[],
): KeywordCount[] {
  const map = new Map(items.map((i) => [i.keyword, { ...i }]));
  const now = new Date().toISOString();

  for (const keyword of keywords) {
    const existing = map.get(keyword);
    if (existing) {
      existing.count += 1;
      existing.lastSeen = now;
      map.set(keyword, existing);
    } else {
      map.set(keyword, { keyword, count: 1, lastSeen: now });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

function boostThemesFromEmotion(
  themes: ThemeTag[],
  emotion?: Emotion,
): ThemeTag[] {
  const boosted = [...themes];
  if (emotion === "warm") boosted.push("family");
  if (emotion === "nostalgic") boosted.push("childhood", "season");
  if (emotion === "fun") boosted.push("friend", "detour");
  return boosted;
}

function trimZukan(zukan: AsobiZukan): void {
  zukan.favoriteWorlds = zukan.favoriteWorlds.slice(0, 6);
  zukan.reactiveThemes = zukan.reactiveThemes.slice(0, 5);
  zukan.frequentKeywords = zukan.frequentKeywords.slice(0, 12);
  zukan.worldMapKeywords = zukan.frequentKeywords
    .slice(0, 8)
    .map((k) => k.keyword);
}

export function updateZukanFromSession(
  userId: string,
  answers: Answer[],
  emotion?: Emotion,
): ZukanUpdateResult {
  const zukan = getOrCreateZukan(userId);
  const sessionKeywords: string[] = [];

  for (const answer of answers) {
    if (answer.skipped || !answer.text.trim()) continue;

    const extracted = extractFromText(answer.text);
    const question = getQuestionById(answer.questionId);
    const themes = boostThemesFromEmotion(extracted.themes, emotion);

    zukan.favoriteWorlds = incrementTagCounts(
      zukan.favoriteWorlds,
      extracted.worlds,
      worldLabels,
    );
    zukan.reactiveThemes = incrementTagCounts(
      zukan.reactiveThemes,
      themes,
      themeLabels,
    );
    zukan.frequentKeywords = incrementKeywords(
      zukan.frequentKeywords,
      extracted.keywords,
    );

    sessionKeywords.push(...extracted.keywords);

    const memoryDelta = scoreMemoryType(question, extracted);
    for (const [type, score] of Object.entries(memoryDelta)) {
      const key = type as keyof typeof zukan.memoryTypeScores;
      zukan.memoryTypeScores[key] += score ?? 0;
    }

    zukan.totalAnswers += 1;
  }

  const dominant = dominantMemoryType(zukan.memoryTypeScores);
  zukan.memoryTypeLabel = memoryTypeLabels[dominant];

  trimZukan(zukan);

  const { title, changed } = maybeUpdateTitle(zukan, sessionKeywords);
  applyTitleChange(zukan, title, changed);

  zukan.updatedAt = new Date().toISOString();
  saveZukan(zukan);

  return {
    zukan,
    titleChanged: changed,
    newKeywords: sessionKeywords,
  };
}

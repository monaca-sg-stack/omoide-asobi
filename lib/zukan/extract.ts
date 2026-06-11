import {
  personKeywords,
  sceneKeywords,
  senseKeywords,
  themeDictionary,
  worldDictionary,
} from "@/lib/zukan/dictionaries";
import type { ThemeTag, WorldTag } from "@/types/zukan";
import type { Question } from "@/types/question";
import type { MemoryType } from "@/types/zukan";

export type ExtractedContent = {
  worlds: WorldTag[];
  themes: ThemeTag[];
  keywords: string[];
  matchedWords: string[];
};

function matchDictionary<T extends string>(
  text: string,
  dictionary: Record<T, string[]>,
): T[] {
  const found: T[] = [];
  for (const [tag, words] of Object.entries(dictionary) as [T, string[]][]) {
    if (words.some((word) => text.includes(word))) {
      found.push(tag);
    }
  }
  return found;
}

function collectMatchedWords(
  text: string,
  dictionaries: Record<string, string[]>[],
): string[] {
  const words = new Set<string>();
  for (const dict of dictionaries) {
    for (const terms of Object.values(dict)) {
      for (const term of terms) {
        if (text.includes(term)) {
          words.add(term);
        }
      }
    }
  }
  return [...words];
}

export function extractFromText(text: string): ExtractedContent {
  const worlds = matchDictionary(text, worldDictionary);
  const themes = matchDictionary(text, themeDictionary);
  const matchedWords = collectMatchedWords(text, [
    worldDictionary,
    themeDictionary,
  ]);

  return {
    worlds,
    themes,
    keywords: matchedWords,
    matchedWords,
  };
}

export function scoreMemoryType(
  question: Question | undefined,
  extracted: ExtractedContent,
): Partial<Record<MemoryType, number>> {
  const delta: Partial<Record<MemoryType, number>> = {};

  if (question) {
    switch (question.category) {
      case "sense":
        delta.sense = (delta.sense ?? 0) + 3;
        break;
      case "episode":
        delta.episode = (delta.episode ?? 0) + 2;
        break;
      case "discover":
        delta.scene = (delta.scene ?? 0) + 2;
        break;
      case "associate":
        delta.episode = (delta.episode ?? 0) + 1;
        delta.scene = (delta.scene ?? 0) + 1;
        break;
    }
  }

  const textBlob = extracted.matchedWords.join(" ");
  if (personKeywords.some((w) => textBlob.includes(w))) {
    delta.person = (delta.person ?? 0) + 2;
  }
  if (senseKeywords.some((w) => textBlob.includes(w))) {
    delta.sense = (delta.sense ?? 0) + 2;
  }
  if (sceneKeywords.some((w) => textBlob.includes(w))) {
    delta.scene = (delta.scene ?? 0) + 2;
  }

  return delta;
}

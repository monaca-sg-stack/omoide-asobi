export type MemoryType = "scene" | "person" | "sense" | "episode";

export type WorldTag =
  | "travel"
  | "school"
  | "secret_base"
  | "forest"
  | "candy_shop"
  | "sea"
  | "home"
  | "festival"
  | "street";

export type ThemeTag =
  | "childhood"
  | "detour"
  | "food"
  | "festival"
  | "family"
  | "friend"
  | "season"
  | "sound"
  | "smell";

export type KeywordCount = {
  keyword: string;
  count: number;
  lastSeen: string;
};

export type TitleHistoryEntry = {
  title: string;
  from: string;
  to?: string;
};

export type TaggedCount<T extends string> = {
  tag: T;
  label: string;
  count: number;
};

export type AsobiZukan = {
  userId: string;
  updatedAt: string;
  title: string;
  titleAssignedAt: string;
  titleHistory: TitleHistoryEntry[];
  favoriteWorlds: TaggedCount<WorldTag>[];
  memoryTypeScores: Record<MemoryType, number>;
  memoryTypeLabel: string;
  reactiveThemes: TaggedCount<ThemeTag>[];
  frequentKeywords: KeywordCount[];
  worldMapKeywords: string[];
  totalAnswers: number;
};

export type ZukanUpdateResult = {
  zukan: AsobiZukan;
  titleChanged: boolean;
  newKeywords: string[];
};

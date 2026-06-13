export type QuestionCategory = "episode" | "discover" | "associate" | "sense";

export type SenseType = "smell" | "sound" | "temperature" | "touch" | "sight" | "taste";

/** 1=あたたかい想起 / 2=ちょい深度 / 3=週1の深い宝箱 */
export type QuestionDepth = 1 | 2 | 3;

/** 問いが届けたい感情（UIには出さない・出題バランス用） */
export type EmotionalTone =
  | "joy"        // たのしい・わくわく
  | "warm"       // うれしい・じんわりあたたかい
  | "nostalgic"  // 懐かしい・なつかしさ
  | "surprise"   // ドキッとする（約10%）
  | "melancholy"; // さみしい・かなしい・じんわり（約10%）

export type Question = {
  id: string;
  title: string;
  body: string;
  hint: string;
  category: QuestionCategory;
  senseType?: SenseType;
  estimatedMinutes: number;
  depth: QuestionDepth;
  emotionalTone: EmotionalTone;
  /** 設計・ドキュメント用（UIには出さない） */
  cognitiveTargets?: string[];
};

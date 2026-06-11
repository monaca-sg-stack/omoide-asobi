export type Emotion = "warm" | "nostalgic" | "fun" | "unknown";

export type Answer = {
  questionId: string;
  text: string;
  skipped: boolean;
};

export type DailySession = {
  id: string;
  date: string;
  questionIds: string[];
  answers: Answer[];
  emotion?: Emotion;
  completedAt?: string;
  openedAt?: string;
  /** 土曜の「深い宝箱」 */
  isDeepBox?: boolean;
};

export type Bookmark = {
  id: string;
  sessionId: string;
  date: string;
  questionId: string;
  questionTitle: string;
  answerText: string;
  emotion: Emotion;
  skipped: boolean;
  createdAt: string;
  isDeep?: boolean;
};

export type UserProfile = {
  id: string;
  displayName: string;
  onboardingComplete: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  createdAt: string;
};

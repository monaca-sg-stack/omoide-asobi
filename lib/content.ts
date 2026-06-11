export const appMeta = {
  name: "思い出しあそび",
  tagline: "1日5分、自分の人生であそぶ",
  description:
    "記憶力の低下に悩む大人向け。脳トレではなく、自分の人生の思い出で遊びながら、結果的に脳をやさしく活性化するアプリ。",
  organization: "合同会社もなか",
  theme: "大人があそぶように生きる",
};

export const emotionLabels: Record<
  import("@/types/session").Emotion,
  { label: string; color: string; bg: string }
> = {
  warm: { label: "あたたかい", color: "text-orange-700", bg: "bg-orange-200" },
  nostalgic: { label: "しんみり", color: "text-blue-700", bg: "bg-blue-200" },
  fun: { label: "おもしろい", color: "text-green-700", bg: "bg-green-200" },
  unknown: { label: "？", color: "text-gray-600", bg: "bg-gray-200" },
};

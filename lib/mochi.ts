const genericMessages = [
  "いい思い出だね。あなただけの宝物だよ。",
  "そういう記憶、大切にしておこうね。",
  "書いてくれてありがとう。宝箱が少し重くなった気がする。",
  "正解なんてないんだ。あなたの答えがいちばん素敵。",
];

const skippedMessages = [
  "今日は出てこなかった記憶。？のしおりに入れておくね。また会いに来よう。",
  "思い出せなくても大丈夫。記憶はね、急かすと逃げちゃうんだ。",
];

const keywordMessages: { keywords: string[]; message: string }[] = [
  {
    keywords: ["煙", "工場"],
    message: "工場の煙、わたしも好きだな。あなただけの景色だね。",
  },
  {
    keywords: ["海", "ビーチ", "砂"],
    message: "海の記憶は、体が覚えてることが多いんだよね。",
  },
  {
    keywords: ["雨", "傘"],
    message: "雨の日の記憶、しんみりするけど味があるね。",
  },
  {
    keywords: ["母", "父", "お母さん", "お父さん", "家族"],
    message: "家族の記憶は、宝箱のいちばん奥にしまわれがちだね。",
  },
  {
    keywords: ["友達", "友人", "仲間"],
    message: "誰かと一緒だった記憶、あたたかいね。",
  },
  {
    keywords: ["食べ", "料理", "ごはん", "ラーメン", "カレー"],
    message: "食べ物の記憶は、匂いまで一緒に蘇ることがあるよね。",
  },
  {
    keywords: ["笑", "楽し"],
    message: "笑いの記憶、いちばん長持ちするんだって。",
  },
];

export function getMochiMessage(answers: { text: string; skipped: boolean }[]): string {
  const hasSkipped = answers.some((a) => a.skipped);
  if (hasSkipped && answers.every((a) => a.skipped || !a.text.trim())) {
    return skippedMessages[Math.floor(Math.random() * skippedMessages.length)];
  }

  const combined = answers.map((a) => a.text).join(" ");

  for (const { keywords, message } of keywordMessages) {
    if (keywords.some((kw) => combined.includes(kw))) {
      return message;
    }
  }

  if (hasSkipped) {
    return "思い出せたものも、出てこなかったものも、どちらもあなたの一日の記録だよ。";
  }

  return genericMessages[Math.floor(Math.random() * genericMessages.length)];
}

export const mochiGreetings = [
  "今日はどんな思い出が出てくるかな？",
  "宝箱、開ける準備はできた？",
  "あなたの記憶の屋根裏へ、ようこそ。",
  "正解はひとつじゃないよ。あなたの答えが宝物。",
];

export function getMochiGreeting(date: string): string {
  const index = date.charCodeAt(date.length - 1) % mochiGreetings.length;
  return mochiGreetings[index];
}

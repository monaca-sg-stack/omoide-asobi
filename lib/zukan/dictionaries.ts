import type { MemoryType, ThemeTag, WorldTag } from "@/types/zukan";

export const worldLabels: Record<WorldTag, string> = {
  travel: "旅",
  school: "学校",
  secret_base: "秘密基地",
  forest: "森",
  candy_shop: "駄菓子屋",
  sea: "海",
  home: "家",
  festival: "お祭り",
  street: "街",
};

export const themeLabels: Record<ThemeTag, string> = {
  childhood: "子ども時代",
  detour: "寄り道",
  food: "食べ物",
  festival: "お祭り",
  family: "家族",
  friend: "仲間",
  season: "季節",
  sound: "音",
  smell: "匂い",
};

export const memoryTypeLabels: Record<MemoryType, string> = {
  scene: "情景記憶型",
  person: "人物記憶型",
  sense: "感覚記憶型",
  episode: "エピソード記憶型",
};

export const worldDictionary: Record<WorldTag, string[]> = {
  travel: ["旅", "旅行", "電車", "飛行機", "温泉", "ホテル", "道の駅", "バス"],
  school: ["学校", "教室", "黒板", "休み時間", "先生", "文化祭", "体育祭", "給食"],
  secret_base: ["秘密基地", "基地", "小屋", "木の上", "河原", "トンネル", "秘密"],
  forest: ["森", "山", "木", "キャンプ", "虫", "川", "林"],
  candy_shop: ["駄菓子", "駄菓子屋", "ベビースター", "うまい棒", "棒付き"],
  sea: ["海", "ビーチ", "砂浜", "波", "貝", "海水浴", "潮"],
  home: ["家", "部屋", "居間", "台所", "布団", "風呂", "一人暮らし"],
  festival: ["祭り", "お祭り", "花火", "盆踊り", "屋台", "縁日"],
  street: ["帰り道", "道", "街", "商店街", "コンビニ", "公園", "坂道"],
};

export const themeDictionary: Record<ThemeTag, string[]> = {
  childhood: ["子ども", "子供", "幼い", "小学生", "幼稚園", "幼少"],
  detour: ["寄り道", "遠回り", "ぶらぶら", "探検", "散歩"],
  food: ["食べ", "料理", "ごはん", "お菓子", "ラーメン", "弁当", "食卓"],
  festival: ["祭り", "文化祭", "体育祭", "イベント", "花火"],
  family: ["家族", "母", "父", "お母さん", "お父さん", "兄弟", "祖母", "祖父", "親"],
  friend: ["友達", "友人", "仲間", "クラスメイト", "友だち"],
  season: ["夏", "冬", "春", "秋", "夏休み", "冬休み", "梅雨"],
  sound: ["音", "声", "チャイム", "音楽", "笑い声", "洗濯機"],
  smell: ["匂い", "香り", "臭い", "線香", "洗剤", "コーヒー"],
};

export const personKeywords = [
  "母",
  "父",
  "友達",
  "友人",
  "仲間",
  "家族",
  "先生",
  "祖母",
  "祖父",
  "兄弟",
  "姉",
  "妹",
  "兄",
  "弟",
];

export const senseKeywords = [
  "匂い",
  "香り",
  "音",
  "声",
  "温度",
  "手触り",
  "感触",
  "味",
  "暖か",
  "冷た",
];

export const sceneKeywords = [
  "景色",
  "夕焼け",
  "夕暮れ",
  "空",
  "窓",
  "景色",
  "風景",
  "道",
  "公園",
];

export type TitlePattern = {
  keywords: string[];
  title: string;
  priority: number;
};

export const titlePatterns: TitlePattern[] = [
  { keywords: ["寄り道", "遠回り", "ぶらぶら"], title: "寄り道冒険家", priority: 10 },
  { keywords: ["焚き火", "たき火", "キャンプファイヤー"], title: "焚き火編集者", priority: 9 },
  { keywords: ["秘密基地", "基地", "小屋"], title: "秘密基地建築家", priority: 9 },
  { keywords: ["夕焼け", "夕暮れ", "夕方"], title: "夕暮れ収集家", priority: 8 },
  { keywords: ["海", "波", "砂浜"], title: "潮風コレクター", priority: 8 },
  { keywords: ["駄菓子", "駄菓子屋"], title: "駄菓子屋常連", priority: 8 },
  { keywords: ["無駄", "失敗", "うまくいか"], title: "無駄研究家", priority: 7 },
  { keywords: ["旅", "旅行", "電車"], title: "妄想旅行家", priority: 7 },
  { keywords: ["音", "声", "歌", "チャイム"], title: "記憶の音響家", priority: 6 },
  { keywords: ["匂い", "香り", "線香"], title: "匂いの地図製作者", priority: 6 },
  { keywords: ["友達", "仲間", "友人"], title: "仲間思い出し職人", priority: 6 },
  { keywords: ["食べ", "料理", "ごはん", "食卓"], title: "食卓アーカイビスト", priority: 5 },
  { keywords: ["学校", "教室", "文化祭"], title: "放課後コレクター", priority: 5 },
  { keywords: ["雨", "傘"], title: "雨の日の観察者", priority: 4 },
];

export const DEFAULT_TITLE = "思い出しあそび人";

export const TITLE_MIN_ANSWERS = 3;
export const TITLE_COOLDOWN_DAYS = 7;

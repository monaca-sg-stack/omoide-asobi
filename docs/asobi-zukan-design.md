# あそび人図鑑 — 追加設計書

> 思い出しあそびを「もなかのコミュニティOS」へ進化させる機能設計  
> 合同会社もなか | テーマ：大人があそぶように生きる

---

## 0. この機能の核心

```
❌ プロフィールを書く
✅ 遊んだ結果として、その人らしさが浮かび上がる
```

ユーザーはプロフィールを作っているつもりがない。  
毎日の思い出しあそびの回答が、自然に **あそび人図鑑** を育てる。

---

## 1. 前提思想

### あそび人とは

もなかの思想に共感し、ときどき遊びに来て、自分のやりたいことを持ち込み、他のあそび人と何かを始め、応援や寄付（あそび賽銭）をし、B2Bプロジェクトに参加することもある人。

### 今後の重要テーマ

**「あそび人同士が出会うこと」**

ただし出会いの軸は「職業が同じ」ではなく **「遊ぶと面白そう」**。

### UXで守る感情

| 感じさせない | 感じさせる |
|---|---|
| 分析されている | 自分のことを少し発見した |
| 診断された | 宝箱の中を覗いた |
| プロフィールを書かされた | 遊んだら増えていた |
| 点数・タイプ・パーセント | ゆるい言葉とイラスト的な配置 |

---

## 2. 作りたくないもの（禁止リスト）

以下は **UIもデータモデルも存在しない**。

- 自己紹介文（自由記述プロフィール）
- 職業入力
- 趣味入力
- スキルタグ
- MBTI・性格診断
- プロフィール編集画面
- 「あなたは◯◯型です」の断定文
- 数値スコア・レーダーチャート・適合率％
- フォロー数・いいね数・ランキング

**理由**：人が自分で書くとすぐ陳腐化する。本当に面白い人間性は肩書きでは表現できない。

---

## 3. 新概念：あそび人図鑑

### 定義

ユーザーごとに **自動生成** される「図鑑の1ページ」。  
入力項目はゼロ。思い出しあそびの回答からだけ育つ。

### 図鑑に蓄積する情報

| カテゴリ | 例 | 出どころ |
|---|---|---|
| **あそび人称号** | 寄り道冒険家、焚き火編集者 | キーワード・テーマの組み合わせから自動生成 |
| **好きな世界** | 旅、学校、秘密基地、森、駄菓子屋、海 | 回答内キーワードの蓄積 |
| **記憶タイプ** | 情景記憶型、人物記憶型、感覚記憶型、エピソード記憶型 | 問いカテゴリ＋キーワード傾向 |
| **心が動きやすいテーマ** | 子ども時代、寄り道、食べ物、お祭り、家族 | 感情色＋キーワード＋問いテーマ |
| **よく登場するキーワード** | 夏休み、自転車、夕焼け… | 回答テキストから抽出 |
| **あなたの世界地図** | キーワードをゆるく散らばしたビジュアル | 上位キーワードの配置（分析感なし） |

### 称号の性質

- **固定診断ではない** — 遊ぶたびに少しずつ変化しうる
- **過去の称号は「昔の呼び名」として残せる**（図鑑の折り目・しおり感）
- ユーザーが選ぶ・編集するものではない

---

## 4. UX設計

### 4.1 ナビゲーション

BottomNav に **「図鑑」** タブを追加（4タブ構成）。

```
ホーム | 図鑑 | アルバム | 設定
```

ルート：`/zukan`

### 4.2 図鑑画面の雰囲気

**図鑑・博物館・宝箱の中を覗く感覚。** ダッシュボードやSNSプロフィールにしない。

```
┌─────────────────────────────────┐
│  あそび人図鑑                     │
│  ─────────────────              │
│                                 │
│  最近のあなた                    │
│                                 │
│      🐾 寄り道冒険家              │
│      （手書き風・スタンプ風）      │
│                                 │
│  よく出てくるもの                 │
│   [駄菓子屋] [学校] [夏休み]      │
│   [自転車]  …ゆるく散らばす       │
│                                 │
│  心が動きやすいテーマ              │
│   子ども時代 · 旅 · 食べ物        │
│                                 │
│  あなたの世界地図                 │
│   （キーワードを雲のように配置）    │
│                                 │
│  モチ：                          │
│  「図鑑に、ひとつ増えたね」        │
└─────────────────────────────────┘
```

### 4.3 コピーライティング原則

| ❌ 使わない | ✅ 使う |
|---|---|
| 分析結果 | 最近のあなた |
| あなたのタイプは | よく出てくるもの |
| 適合度87% | 心が動きやすいテーマ |
| プロフィール | あそび人図鑑 |
| 診断 | （言葉自体を使わない） |

### 4.4 更新の見せ方

セッション完了（しおり獲得）後、**小さな演出**のみ。

```
「図鑑に、ひとつ増えたかも」
→ タップで図鑑へ（任意）
```

強制遷移しない。義務感を出さない。

### 4.5 データが少ないとき（空状態）

```
図鑑は、まだ白いページです。
宝箱を開けるたびに、あなたらしさが
少しずつ描かれていきます。
```

「あと◯回で解放」などのゲーミフィケーションは **しない**。

---

## 5. 技術設計 — MVP（localStorage のみ）

### 5.1 処理フロー

```
セッション完了（completeSession）
    ↓
updateZukanFromSession(answers, questionIds, emotion)
    ↓
キーワード抽出 → カウンタ更新 → 称号再計算
    ↓
localStorage に保存
    ↓
/zukan で表示
```

**トリガー**：`completeSession()` の末尾で1回だけ呼ぶ。  
プレイ中のリアルタイム分析はしない（「分析されている」感を避ける）。

### 5.2 データ構造

#### `types/zukan.ts`

```ts
export type MemoryType =
  | "scene"      // 情景記憶型
  | "person"     // 人物記憶型
  | "sense"      // 感覚記憶型
  | "episode";   // エピソード記憶型

export type WorldTag =
  | "travel" | "school" | "secret_base" | "forest"
  | "candy_shop" | "sea" | "home" | "festival" | "street";

export type ThemeTag =
  | "childhood" | "detour" | "food" | "festival"
  | "family" | "friend" | "season" | "sound" | "smell";

export type KeywordCount = {
  keyword: string;
  count: number;
  lastSeen: string; // ISO date
};

export type AsobiZukan = {
  userId: string;
  updatedAt: string;

  /** 現在の称号 */
  title: string;
  /** 過去の称号（最大5件） */
  titleHistory: { title: string; from: string; to?: string }[];

  /** 好きな世界（上位6） */
  favoriteWorlds: { tag: WorldTag; label: string; count: number }[];

  /** 記憶タイプ（スコアは内部のみ、UIには出さない） */
  memoryTypeScores: Record<MemoryType, number>;
  /** 表示用の「いちばん近い」タイプ名 */
  memoryTypeLabel: string;

  /** 心が動きやすいテーマ（上位5） */
  reactiveThemes: { tag: ThemeTag; label: string; count: number }[];

  /** よく登場するキーワード（上位12） */
  frequentKeywords: KeywordCount[];

  /** 世界地図用（上位8、配置は表示時にランダム固定シード） */
  worldMapKeywords: string[];

  /** 累計回答数（空状態判定用） */
  totalAnswers: number;
};
```

#### localStorage キー

```ts
omoide_zukan  // AsobiZukan
```

ユーザーIDと紐づけ。`clearUser()` 時に一緒に削除。

### 5.3 キーワード抽出（MVP：辞書マッチング）

**外部AI APIは使わない。** ルールベースで十分なMVP。

#### `lib/zukan/dictionaries.ts`

3種類の辞書を用意。

**① 世界タグ辞書**（好きな世界）

```ts
const worldDictionary: Record<WorldTag, string[]> = {
  travel: ["旅", "旅行", "電車", "飛行機", "温泉", "ホテル", "道の駅"],
  school: ["学校", "教室", "黒板", "休み時間", "先生", "文化祭", "体育祭"],
  secret_base: ["秘密基地", "基地", "小屋", "木の上", "河原", "トンネル"],
  forest: ["森", "山", "木", "キャンプ", "虫", "川"],
  candy_shop: ["駄菓子", "駄菓子屋", "棒付き", "ベビースター", "うまい棒"],
  sea: ["海", "ビーチ", "砂浜", "波", "貝", "海水浴"],
  home: ["家", "部屋", "居間", "台所", "布団", "風呂"],
  festival: ["祭り", "お祭り", "花火", "盆踊り", "屋台"],
  street: ["帰り道", "道", "街", "商店街", "コンビニ", "公園"],
};
```

**② テーマタグ辞書**（心が動きやすいテーマ）

```ts
const themeDictionary: Record<ThemeTag, string[]> = {
  childhood: ["子ども", "子供", "幼い", "小学生", "幼稚園"],
  detour: ["寄り道", "遠回り", "ぶらぶら", "探検"],
  food: ["食べ", "料理", "ごはん", "お菓子", "ラーメン", "弁当"],
  festival: ["祭り", "文化祭", "体育祭", "イベント"],
  family: ["家族", "母", "父", "お母さん", "お父さん", "兄弟", "祖母", "祖父"],
  friend: ["友達", "友人", "仲間", "クラスメイト"],
  season: ["夏", "冬", "春", "秋", "夏休み", "冬休み"],
  sound: ["音", "声", "チャイム", "音楽", "笑い声"],
  smell: ["匂い", "香り", "臭い", "線香", "洗剤"],
};
```

**③ 称号用キーワード辞書**

```ts
const titlePatterns: {
  keywords: string[];
  title: string;
  priority: number;
}[] = [
  { keywords: ["寄り道", "遠回り", "ぶらぶら"], title: "寄り道冒険家", priority: 10 },
  { keywords: ["焚き火", "火", "たき火"], title: "焚き火編集者", priority: 9 },
  { keywords: ["秘密基地", "基地", "小屋"], title: "秘密基地建築家", priority: 9 },
  { keywords: ["夕焼け", "夕暮れ", "夕方"], title: "夕暮れ収集家", priority: 8 },
  { keywords: ["無駄", "ダメ", "失敗"], title: "無駄研究家", priority: 7 },
  { keywords: ["海", "波", "砂"], title: "潮風コレクター", priority: 8 },
  { keywords: ["駄菓子", "駄菓子屋"], title: "駄菓子屋常連", priority: 8 },
  { keywords: ["旅", "旅行", "電車"], title: "妄想旅行家", priority: 7 },
  { keywords: ["音", "声", "歌"], title: "記憶の音響家", priority: 6 },
  { keywords: ["匂い", "香り"], title: "匂いの地図製作者", priority: 6 },
  { keywords: ["友達", "仲間"], title: "仲間思い出し職人", priority: 6 },
  { keywords: ["食べ", "料理", "ごはん"], title: "食卓アーカイビスト", priority: 5 },
  // フォールバック
  { keywords: [], title: "思い出しあそび人", priority: 0 },
];
```

#### `lib/zukan/extract.ts` — 抽出アルゴリズム

```ts
function extractFromText(text: string): {
  worlds: WorldTag[];
  themes: ThemeTag[];
  keywords: string[];
} {
  // 1. 辞書マッチ：テキストに含まれるタグを収集
  // 2. キーワード：辞書にヒットした語＋2〜4文字の名詞っぽい連続（簡易）
  // 3. スキップ回答・空文字は無視
}
```

**記憶タイプスコア**（内部計算のみ）：

| 加算要因 | 配点 |
|---|---|
| 問い category = `sense` | sense +3 |
| 問い category = `episode` | episode +2 |
| 問い category = `discover` | scene +2 |
| 問い category = `associate` | episode +1, scene +1 |
| キーワードに人名・家族語 | person +2 |
| キーワードに匂い・音・触覚語 | sense +2 |
| キーワードに場所・景色語 | scene +2 |

最大スコアのタイプを `memoryTypeLabel` に反映。  
**UIには「情景記憶型」などのラベルを小さく出すか、Phase 2で省略も可**（診断感が強い場合）。

MVP推奨：**記憶タイプは図鑑に出さず内部データのみ**。  
「好きな世界」「テーマ」「キーワード」だけ見せる方が思想に合う。

### 5.4 称号生成ロジック

```ts
function computeTitle(
  zukan: AsobiZukan,
  newKeywords: string[],
): string {
  // 1. 全 frequentKeywords + 今回のキーワードを結合
  // 2. titlePatterns を priority 降順で走査
  // 3. keywords のいずれかがテキスト群に含まれる最初の pattern を採用
  // 4. 同点なら priority が高い方
  // 5. フォールバック: "思い出しあそび人"
}
```

**称号変更時**：

```ts
if (newTitle !== zukan.title) {
  zukan.titleHistory.push({
    title: zukan.title,
    from: zukan.updatedAt,
    to: new Date().toISOString(),
  });
  zukan.title = newTitle;
  // titleHistory は最大5件
}
```

**変更頻度の抑制**（陳腐化・振れ防止）：

- 称号は **最低7日間は変わらない**（クールダウン）
- または **累計回答5件以上** で初称号表示
- 変更時のみモチが「呼び名が変わったみたい」と一言（任意）

### 5.5 更新関数

```ts
// lib/zukan/update.ts
export function updateZukanFromSession(
  userId: string,
  answers: Answer[],
  questionIds: string[],
  emotion?: Emotion,
): AsobiZukan {
  const zukan = getZukan() ?? createEmptyZukan(userId);

  for (const answer of answers) {
    if (answer.skipped || !answer.text.trim()) continue;

    const extracted = extractFromText(answer.text);
    const question = getQuestionById(answer.questionId);

    // カウンタ更新
    incrementWorlds(zukan, extracted.worlds);
    incrementThemes(zukan, extracted.themes, emotion);
    incrementKeywords(zukan, extracted.keywords);
    updateMemoryScores(zukan, question, extracted);

    zukan.totalAnswers += 1;
  }

  // 上位N件にトリム
  trimTopItems(zukan);

  // 称号再計算（クールダウン考慮）
  maybeUpdateTitle(zukan);

  // 世界地図用キーワード更新
  zukan.worldMapKeywords = zukan.frequentKeywords
    .slice(0, 8)
    .map((k) => k.keyword);

  zukan.updatedAt = new Date().toISOString();
  saveZukan(zukan);
  return zukan;
}
```

### 5.6 ファイル構成（追加）

```
omoide-asobi/
├── types/
│   └── zukan.ts
├── lib/
│   └── zukan/
│       ├── dictionaries.ts   # 辞書データ
│       ├── extract.ts        # キーワード抽出
│       ├── update.ts         # 図鑑更新
│       ├── title.ts          # 称号生成
│       └── storage.ts        # get/save zukan
├── app/
│   └── zukan/
│       └── page.tsx          # 図鑑画面
└── components/
    └── zukan/
        ├── ZukanPage.tsx     # メイン
        ├── TitleStamp.tsx    # 称号スタンプ
        ├── KeywordCloud.tsx  # 世界地図・キーワード配置
        └── ThemeList.tsx     # テーマ一覧
```

### 5.7 既存コードへの変更（最小）

| ファイル | 変更 |
|---|---|
| `lib/storage.ts` → `completeSession()` | 末尾で `updateZukanFromSession()` 呼び出し |
| `lib/storage.ts` → `clearUser()` | `omoide_zukan` も削除 |
| `components/layout/BottomNav.tsx` | 「図鑑」タブ追加 |
| `app/play/.../reflect/page.tsx` | 完了後に任意で「図鑑に増えたかも」表示 |

**触らない**：問いデータ、宝箱ロジック、正誤なしの振り返り、AuthGuard。

---

## 6. 図鑑画面 UI 詳細

### 6.1 セクション構成

| 順 | セクション | 内容 | 空のとき |
|---|---|---|---|
| 1 | ヘッダー | 「あそび人図鑑」 | 同左 |
| 2 | 称号スタンプ | 手書き風スタンプで称号 | 非表示 |
| 3 | よく出てくるもの | チップ状、最大8個 | 「まだ少しだけ」 |
| 4 | 心が動きやすいテーマ | 中黒区切り、最大5個 | 非表示 |
| 5 | あなたの世界地図 | キーワードをランダム配置（固定シード） | 点線の空マップ |
| 6 | モチの一言 | 図鑑を覗くコメント | 空状態メッセージ |

### 6.2 世界地図コンポーネント

- 分析チャートではなく **紙の地図に付箋が貼られた** イメージ
- キーワードの位置は `userId + keyword` をシードに固定（毎回同じ位置）
- フォントサイズは出現回数に比例（最大・最小を制限）
- タップでキーワードがふわっと揺れる程度のインタラクション

### 6.3 デザイントークン

- 背景：生成り `#F5F0E8`（既存）
- スタンプ枠：木色 `#C4A882`、破線 border
- チップ：白背景、角丸、影なし or 極薄
- **グラフ色・赤青の対比・%表示は禁止**

---

## 7. 将来構想 — Phase 2 以降

### 7.1 あそび人同士のマッチング

**軸**：「遊ぶと面白そう」

```
あなたと相性のよいあそび人

  秘密基地建築家
  焚き火編集者
  妄想旅行家

  共通してよく出てくる記憶
  森 · 寄り道 · 夏休み
```

**マッチングスコア（内部）**：

```ts
function compatibilityScore(a: AsobiZukan, b: AsobiZukan): number {
  // 1. favoriteWorlds のタグ重複（重み高）
  // 2. reactiveThemes のタグ重複
  // 3. frequentKeywords の文字列重複
  // 4. 称号パターンの類似（同じ titlePatterns グループ）
  // ❌ 職業・年齢・居住地は使わない
}
```

**表示ルール**：

- 「適合度87%」は出さない
- 「共通してよく出てくる記憶」だけ見せる
- 相手の図鑑ページは **入力項目なしの図鑑1ページ** のみ閲覧可

### 7.2 Firebase 化設計

#### Firestore コレクション

```
users/{uid}
  - displayName, createdAt, ...

zukan/{uid}
  - title, titleHistory, favoriteWorlds, ...
  - memoryTypeScores (非公開フィールド扱い)
  - updatedAt, totalAnswers

sessions/{uid}/daily/{date}
  - （既存設計）

bookmarks/{uid}/items/{id}
  - （既存設計）
```

#### Cloud Functions（将来）

```
onSessionComplete(uid, sessionId)
  → 回答テキスト取得
  → updateZukan（サーバー側でも同じ辞書ロジック）
  → zukan/{uid} 更新
```

**MVPの辞書ロジックをそのまま共通化**すれば、クライアント/サーバーで一貫性を保てる。

#### マッチング用（Phase 3）

```
zukan_index/{uid}   // 検索用の軽量ドキュメント
  - worldTags: string[]
  - themeTags: string[]
  - topKeywords: string[]
  - title
```

Firestore の `array-contains` で粗く絞り込み → クライアントで compatibilityScore 計算。

#### Security Rules 方針

```js
// zukan: 本人は read/write、他者は read のみ（マッチング用フィールドのみ）
match /zukan/{uid} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == uid;
}
// memoryTypeScores は将来 public にしない選択肢も
```

### 7.3 AI 強化（任意・Phase 3）

辞書マッチングの限界を超える場合のみ：

- 回答テキストから **追加キーワード** を LLM で提案（ユーザーには見せず内部のみ）
- 称号の **バリエーション生成**（テンプレート＋LLM装飾）
- **必ず** 「分析結果」UIにはしない。図鑑の文言が少し豊かになる程度

---

## 8. 既存思想を壊さないチェックリスト

実装前に必ず確認。

- [ ] プロフィール編集画面が存在しない
- [ ] ユーザーが図鑑の中身を手動で書き換えられない
- [ ] 点数・％・ランキング・診断結果の表示がない
- [ ] 「分析しました」という文言がない
- [ ] セッション中にリアルタイム抽出しない（完了後のみ）
- [ ] 思い出せなかった（？しおり）回答は図鑑に悪影響を与えない
- [ ] 脳トレ・IQ・認知年齢とは無関係の見せ方
- [ ] モチのトーンは共感・発見（先生・診断者ではない）

---

## 9. MVP 実装タスク（推奨順）

| # | タスク | 工数目安 |
|---|---|---|
| 1 | `types/zukan.ts` + 辞書データ | 小 |
| 2 | `lib/zukan/extract.ts` + `update.ts` + `title.ts` | 中 |
| 3 | `completeSession()` へのフック | 小 |
| 4 | `/zukan` ページ + コンポーネント | 中 |
| 5 | BottomNav に「図鑑」追加 | 小 |
| 6 | 振り返り画面の「図鑑に増えたかも」演出 | 小 |
| 7 | `handoff-for-ai.md` 更新 | 小 |

**MVP でやらないこと**：マッチング、Firebase、LLM、他者図鑑閲覧。

---

## 10. 成功指標

| 指標 | 意味 |
|---|---|
| 図鑑ページの週1回以上閲覧率 | 「自分の発見」として見ているか |
| 累計回答数とキーワード数の相関 | 遊ぶほど育つか |
| 称号変更後の継続率 | 変化が楽しみになっているか |
| 「分析されている」と感じたというフィードバック | **ゼロが理想** |

---

## 付録：モチのセリフ例（図鑑用）

```
「図鑑に、ひとつ増えたみたい」
「駄菓子屋、よく出てくるね」
「呼び名が変わったみたい。…寄り道冒険家、いいじゃない」
「まだ白いページだけど、これから一緒に埋めていこう」
```

---

*思い出しあそび × あそび人図鑑 — プロフィールを書かず、遊んだ結果として人らしさが浮かび上がる*

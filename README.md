# 思い出しあそび

合同会社もなかがつくる、大人向け「思い出しあそび」アプリです。

> **脳トレではない。** 自分の人生で遊びながら、結果的に脳が元気になる。

## 起動方法

```bash
cd omoide-asobi
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## 体験の流れ

1. ランディング → ゲストではじめる
2. オンボーディング（モチの案内 + 体験問い）
3. ホームで「今日の宝箱」を開ける
4. 問いに答える → 振り返り → しおり獲得
5. アルバムで過去の思い出を見返す

## ドキュメント

| ファイル | 内容 |
|---|---|
| [作りたいもの.md](./作りたいもの.md) | ビジョン・思想・必須条件 |
| [docs/product-concept.md](./docs/product-concept.md) | 全設計（ミニゲーム30・UI・MVP等） |
| [docs/screen-structure.md](./docs/screen-structure.md) | 画面構成・ルーティング |
| [docs/asobi-zukan-design.md](./docs/asobi-zukan-design.md) | あそび人図鑑（追加設計） |

## MVPの実装状況

| 機能 | 状態 |
|---|---|
| ランディング | ✅ |
| ゲストログイン | ✅ |
| オンボーディング | ✅ |
| 今日の宝箱 | ✅ |
| 問い（35問・3層ローテ） | ✅ |
| 深い宝箱（土曜） | ✅ |
| 振り返り・しおり | ✅ |
| アルバム | ✅ |
| 設定 | ✅ |
| あそび人図鑑 | ✅ |
| Firebase連携 | 🔜 Phase 2 |
| 通知 | 🔜 Phase 2 |

データは MVP ではブラウザの localStorage に保存されます。

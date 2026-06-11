import type { AsobiZukan } from "@/types/zukan";

export function getZukanMochiMessage(
  zukan: AsobiZukan,
  titleChanged: boolean,
): string {
  if (zukan.totalAnswers === 0) {
    return "図鑑は、まだ白いページだよ。宝箱を開けるたびに、あなたらしさが描かれていくんだ。";
  }

  if (titleChanged && zukan.title) {
    return `呼び名が変わったみたい。…${zukan.title}、いいじゃない。`;
  }

  const top = zukan.frequentKeywords[0]?.keyword;
  if (top) {
    return `「${top}」、よく出てくるね。図鑑に、あなたの景色が少しずつ増えてる。`;
  }

  return "遊んだ記憶が、少しずつ図鑑に残っていくよ。";
}

export function getZukanReflectHint(): string {
  return "図鑑に、ひとつ増えたかも。";
}

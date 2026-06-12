import { pickDailyQuestions, todayString, isDeepBoxDay, formatDateJa } from "../lib/daily.ts";
import { getQuestionById, questions } from "../lib/questions.ts";

const today = todayString();
const pick = pickDailyQuestions(today, []);

console.log("今日:", formatDateJa(today), `(${today})`);
console.log("深い宝箱:", isDeepBoxDay(today) ? "はい（土曜）" : "いいえ");
console.log("");
console.log("【今日の予定問い】");
pick.questionIds.forEach((id, i) => {
  const q = getQuestionById(id);
  console.log(`${i + 1}. [${id}] 深度${q?.depth} ${q?.title}`);
  console.log(`   ${q?.body}`);
});

console.log("");
console.log("【全35問 一覧】");
for (const depth of [1, 2, 3] as const) {
  console.log(`--- 深度${depth} ---`);
  questions
    .filter((q) => q.depth === depth)
    .forEach((q) => {
      const mark = pick.questionIds.includes(q.id) ? " ← 今日" : "";
      console.log(`  [${q.id}] ${q.title}${mark}`);
    });
}

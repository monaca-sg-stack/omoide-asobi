import type { Question } from "@/types/question";
import { depthLabels } from "@/lib/daily";

type Props = {
  question: Question;
  index: number;
  total: number;
};

export function QuestionCard({ question, index, total }: Props) {
  const depthLabel = depthLabels[question.depth];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink/50">
          問い {index + 1} / {total}
        </p>
        {question.depth >= 2 && (
          <span
            className={`rounded-full px-3 py-0.5 text-xs ${
              question.depth === 3
                ? "bg-amber-100 text-amber-800"
                : "bg-sage/20 text-sage"
            }`}
          >
            {depthLabel}
          </span>
        )}
      </div>
      <h2 className="font-rounded text-xl font-medium leading-relaxed text-ink">
        {question.body}
      </h2>
      <p className="text-sm text-ink/50">💡 {question.hint}</p>
    </div>
  );
}

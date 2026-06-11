type Props = {
  title: string;
  items: string[];
  emptyText?: string;
};

export function KeywordChips({ title, items, emptyText }: Props) {
  if (items.length === 0 && emptyText) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink/60">{title}</h2>
        <p className="text-sm text-ink/40">{emptyText}</p>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-ink/60">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-wood/25 bg-white/70 px-3 py-1.5 text-sm text-ink/80"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

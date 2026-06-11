import Link from "next/link";

type Props = {
  title?: string;
  showSettings?: boolean;
  backHref?: string;
};

export function Header({ title = "あなたの部屋", showSettings = true, backHref }: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-ink/60 hover:text-ink"
            aria-label="戻る"
          >
            ←
          </Link>
        )}
        <h1 className="font-rounded text-lg font-medium text-ink">{title}</h1>
      </div>
      {showSettings && (
        <Link href="/settings" className="text-sm text-ink/60 hover:text-ink">
          設定
        </Link>
      )}
    </header>
  );
}

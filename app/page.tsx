import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { appMeta } from "@/lib/content";

const features = [
  {
    title: "脳トレではない",
    body: "計算や漢字ではなく、自分の人生を思い出すあそびです。",
  },
  {
    title: "正解はひとつじゃない",
    body: "誰の答えも正解。違う答えが出るほど面白い。",
  },
  {
    title: "1日5分でできる",
    body: "宝箱をひとつ開けるだけ。長く続かないから、短く。",
  },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col px-6 py-12">
      <div className="flex-1 space-y-10">
        <div className="space-y-4 pt-8">
          <p className="text-sm text-sage">{appMeta.organization}</p>
          <h1 className="font-rounded text-3xl font-bold leading-tight text-ink">
            {appMeta.name}
          </h1>
          <p className="text-lg text-ink/70">{appMeta.tagline}</p>
        </div>

        <div className="flex justify-center py-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-wood/40 bg-gradient-to-br from-amber-700 to-amber-900 text-5xl shadow-lg">
            📦
          </div>
        </div>

        <div className="space-y-4">
          {features.map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-wood/20 bg-white/60 p-4"
            >
              <h2 className="font-rounded font-medium text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink/70">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <Link href="/login">
          <Button fullWidth>宝箱を開けてみる</Button>
        </Link>
        <p className="text-center text-xs text-ink/40">
          {appMeta.theme}
        </p>
      </div>
    </main>
  );
}

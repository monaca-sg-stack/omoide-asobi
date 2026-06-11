"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { appMeta } from "@/lib/content";
import { createGuestUser, getUser } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user?.onboardingComplete) {
      router.replace("/home");
    } else if (user && !user.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [router]);

  function handleStart() {
    const user = createGuestUser();
    if (displayName.trim()) {
      user.displayName = displayName.trim();
      localStorage.setItem("omoide_user", JSON.stringify(user));
    }
    router.push("/onboarding");
  }

  return (
    <main className="flex min-h-screen flex-col px-6 py-12">
      <div className="flex-1 space-y-8 pt-8">
        <div className="space-y-2">
          <h1 className="font-rounded text-2xl font-bold text-ink">
            {appMeta.name}へようこそ
          </h1>
          <p className="text-sm leading-relaxed text-ink/70">
            あなたの思い出は、あなただけの宝箱に入ります。
            <br />
            まずは気軽に、ゲストではじめられます。
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm text-ink/60">
            なんとお呼びすればいいですか？（任意）
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="ニックネーム"
            className="w-full rounded-xl border border-wood/30 bg-white/60 px-4 py-3 text-ink placeholder:text-ink/30 focus:border-sunset/50 focus:outline-none focus:ring-2 focus:ring-sunset/20"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleStart}>
          ゲストではじめる
        </Button>
        <p className="text-center text-xs text-ink/40">
          データはこの端末に保存されます
        </p>
      </div>
    </main>
  );
}

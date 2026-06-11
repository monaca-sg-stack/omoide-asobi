"use client";

import { getUser } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  requireOnboarding?: boolean;
};

export function AuthGuard({ children, requireOnboarding = true }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const user = getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (requireOnboarding && !user.onboardingComplete) {
        router.replace("/onboarding");
        return;
      }
      setReady(true);
    } catch {
      router.replace("/login");
    }
  }, [router, requireOnboarding]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-ink/50">読み込み中…</p>
      </div>
    );
  }

  return <>{children}</>;
}

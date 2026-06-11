"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { appMeta } from "@/lib/content";
import { clearUser, getUser, resetTodaySession, updateUser } from "@/lib/storage";

function SettingsContent() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setDisplayName(user.displayName);
      setReminderEnabled(user.reminderEnabled);
      setReminderTime(user.reminderTime);
    }
  }, []);

  function handleSave() {
    updateUser({
      displayName: displayName.trim() || "ゲスト",
      reminderEnabled,
      reminderTime,
    });
    alert("保存しました");
  }

  function handleResetToday() {
    if (
      window.confirm(
        "今日の宝箱を作り直しますか？\n入力途中の内容は消えます。",
      )
    ) {
      resetTodaySession();
      router.push("/home");
    }
  }

  function handleLogout() {
    if (window.confirm("ログアウトしますか？データはこの端末に残ります。")) {
      clearUser();
      router.push("/");
    }
  }

  return (
    <AppShell>
      <Header title="設定" showSettings={false} />
      <main className="space-y-8 px-4 pb-8">
        <section className="space-y-3">
          <label htmlFor="name" className="text-sm text-ink/60">
            なんとお呼びすればいいですか？
          </label>
          <input
            id="name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-wood/30 bg-white/60 px-4 py-3 text-ink focus:border-sunset/50 focus:outline-none focus:ring-2 focus:ring-sunset/20"
          />
        </section>

        <section className="space-y-3 rounded-xl border border-wood/20 bg-white/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink">宝箱のお知らせ</span>
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="h-5 w-5 accent-sunset"
            />
          </div>
          {reminderEnabled && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="rounded-lg border border-wood/30 bg-white/60 px-3 py-2 text-sm"
            />
          )}
          <p className="text-xs text-ink/40">
            ※ MVPでは通知は未実装です。設定だけ保存されます。
          </p>
        </section>

        <Button fullWidth variant="secondary" onClick={handleSave}>
          保存する
        </Button>

        <section className="space-y-3 rounded-xl border border-wood/20 bg-white/40 p-4">
          <h2 className="font-rounded font-medium text-ink">宝箱の作り直し</h2>
          <p className="text-sm text-ink/60">
            画面が読み込まれない・問いが表示されないときは、今日の宝箱を作り直してみてください。
          </p>
          <Button fullWidth variant="secondary" onClick={handleResetToday}>
            今日の宝箱を作り直す
          </Button>
        </section>

        <section className="space-y-2 rounded-xl border border-wood/20 bg-white/40 p-4">
          <h2 className="font-rounded font-medium text-ink">このアプリについて</h2>
          <p className="text-sm leading-relaxed text-ink/70">
            {appMeta.name}は、{appMeta.organization}がつくる
            「{appMeta.theme}」をテーマにした思い出しあそびアプリです。
          </p>
          <p className="text-sm text-ink/60">
            脳トレではなく、自分の人生で遊びながら、結果的に脳をやさしく活性化することを目指しています。
          </p>
        </section>

        <Button fullWidth variant="ghost" onClick={handleLogout}>
          ログアウト
        </Button>
      </main>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/home", label: "ホーム" },
  { href: "/zukan", label: "図鑑" },
  { href: "/album", label: "アルバム" },
  { href: "/settings", label: "設定" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-wood/20 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-app items-center justify-around px-4 py-3">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm transition-colors",
                active ? "font-medium text-sunset" : "text-ink/50 hover:text-ink",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

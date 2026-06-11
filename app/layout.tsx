import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";
import { appMeta } from "@/lib/content";
import "./globals.css";

const sans = Noto_Sans_JP({
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const rounded = M_PLUS_Rounded_1c({
  weight: ["500", "700"],
  variable: "--font-rounded",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${appMeta.name} — ${appMeta.tagline}`,
  description: appMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${sans.variable} ${rounded.variable}`}>
      <body>
        <div className="mx-auto min-h-screen max-w-app">{children}</div>
      </body>
    </html>
  );
}

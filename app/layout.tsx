import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "台灣油價歷史趨勢 · fuel.futa.gg";
const description =
  "查看台灣 92、95、98 無鉛汽油、超級柴油，以及西德州、杜拜與布蘭特原油的每週價格與歷史趨勢。";

export const metadata: Metadata = {
  metadataBase: new URL("https://fuel.futa.gg"),
  title,
  description,
  applicationName: "台灣油價",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "fuel.futa.gg",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "台灣油價歷史趨勢視覺化",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff9df" },
    { media: "(prefers-color-scheme: dark)", color: "#10172a" },
  ],
};

const themeScript = `
(() => {
  const storageKey = "fuel-theme-mode";
  const allowedModes = new Set(["system", "light", "dark"]);
  let mode = "system";

  try {
    const storedMode = window.localStorage.getItem(storageKey);
    if (allowedModes.has(storedMode)) mode = storedMode;
  } catch {}

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
  const root = document.documentElement;
  root.dataset.theme = resolved === "dark" ? "night" : "bumblebee";
  root.dataset.themeMode = mode;
  root.style.colorScheme = resolved;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      data-theme="bumblebee"
      data-theme-mode="system"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

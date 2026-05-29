import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Oswald } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import LoadingScreen from "@/components/effects/LoadingScreen";
import SnowParticles from "@/components/effects/SnowParticles";
import MouseLight from "@/components/effects/MouseLight";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const display = Oswald({
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Содружество Хотошо — Бурят-монгольская порода | Premium Kennel",
  description:
    "Хотошо — древняя бурятская порода. Сила, верность и спокойствие поколений. Премиальный питомник «Содружество Хотошо».",
  keywords: [
    "Хотошо",
    "бурят-монгольская собака",
    "питомник Хотошо",
    "Содружество Хотошо",
    "щенки Хотошо",
    "banhar",
  ],
  metadataBase: new URL("https://sodrujestvo-hotosho.ru"),
  openGraph: {
    title: "Содружество Хотошо",
    description:
      "Древняя бурятская порода. Сила, верность и спокойствие поколений.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${display.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-0 text-text-primary min-h-screen overflow-x-hidden">
        <LoadingScreen />
        <MouseLight />
        <SnowParticles />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

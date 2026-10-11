import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/features/games/GameContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { JotaiProvider } from "@/components/providers/JotaiProvider";
import { MainNav } from "@/components/MainNav";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRFGC - Iranian Fighting Game Community",
  description:
    "A scalable, community-driven platform for Iran's FGC with centralized infrastructure and game-specific subdomains",
  keywords:
    "fighting games, iran, fgc, mortal kombat, street fighter, tekken, guilty gear, blazblue, under night in-birth",
  authors: [{ name: "IRFGC Team" }],
  openGraph: {
    title: "IRFGC - Iranian Fighting Game Community",
    description:
      "Unite Iran's FGC with centralized infrastructure and game-specific communities",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--irfgc-canvas)] font-sans text-[var(--irfgc-text-primary)] antialiased">
        <JotaiProvider>
          <SessionProvider>
            <GameProvider>
              <MainNav />
              {children}
            </GameProvider>
          </SessionProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}

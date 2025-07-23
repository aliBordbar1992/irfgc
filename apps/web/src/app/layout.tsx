import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/features/games/GameContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { JotaiProvider } from "@/components/providers/JotaiProvider";
import { MainNav } from "@/components/MainNav";

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
    <html lang="fa" dir="rtl">
      <body className="font-sans">
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

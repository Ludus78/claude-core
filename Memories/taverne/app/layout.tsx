import type { Metadata } from "next";
import { Caveat_Brush, Gloria_Hallelujah, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Ambiance } from "./ambiance";

const titre = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--police-titre", display: "swap" });
const texte = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--police-texte", display: "swap" });
const craie = Gloria_Hallelujah({ subsets: ["latin"], weight: "400", variable: "--police-craie", display: "swap" });

export const metadata: Metadata = {
  title: "La Taverne des Souvenirs",
  description: "Raconte ton héros et les histoires qui vous ont marqués.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable} ${craie.variable}`}>
      <body>
        <Ambiance />
        {children}
      </body>
    </html>
  );
}

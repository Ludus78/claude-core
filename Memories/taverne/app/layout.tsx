import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import "./globals.css";

const titre = Cinzel({ subsets: ["latin"], variable: "--police-titre", display: "swap" });
const texte = Crimson_Pro({ subsets: ["latin"], variable: "--police-texte", display: "swap" });

export const metadata: Metadata = {
  title: "La Taverne des Souvenirs",
  description: "Raconte ton héros et les histoires qui vous ont marqués.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body>{children}</body>
    </html>
  );
}

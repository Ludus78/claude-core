import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SéanceClub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-fond text-texte">{children}</body>
    </html>
  );
}

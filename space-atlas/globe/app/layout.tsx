import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "space-atlas · Globe des orbites",
  description: "Où sont les satellites en ce moment ? Un globe pour comprendre les orbites.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

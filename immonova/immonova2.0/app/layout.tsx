import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import SharedLayout from "./components/SharedLayout";
import { PostHogProvider } from "./components/PostHogProvider";
import { defaultMetadata } from "./metadata";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`scroll-smooth ${nunito.variable}`}>
      <body className="antialiased overflow-y-auto">
        <PostHogProvider>
            <SharedLayout>
              {children}
            </SharedLayout>
        </PostHogProvider>
      </body>
    </html>
  );
}

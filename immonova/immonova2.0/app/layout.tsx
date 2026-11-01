import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`scroll-smooth ${nunito.variable} ${fraunces.variable}`}>
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

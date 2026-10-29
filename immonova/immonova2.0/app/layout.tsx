import type { Metadata } from "next";
import "./globals.css";
import SharedLayout from "./components/SharedLayout";
import { PostHogProvider } from "./components/PostHogProvider";
import { defaultMetadata } from "./metadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
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

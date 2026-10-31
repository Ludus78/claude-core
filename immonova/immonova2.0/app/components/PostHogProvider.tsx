"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { CookieBanner } from "./CookieConsent"
import { applyConsent, readConsent } from "./consent"

// Initialisé une seule fois, désactivé tant que le visiteur n'a pas accepté.
if (typeof window !== "undefined" && !posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    capture_pageview: false, // We capture pageviews manually
    capture_pageleave: true, // Enable pageleave capture
    advanced_disable_decide: true, // pas de requête de configuration avant l'accord
    persistence: "memory", // aucun cookie ni stockage avant l'accord (voir consent.ts)
    opt_out_capturing_by_default: true,
    opt_out_capturing_persistence_type: "localStorage",
  })
  applyConsent(readConsent())
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
      <CookieBanner />
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthog.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}

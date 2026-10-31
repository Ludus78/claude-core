import posthog from "posthog-js"

export const CONSENT_KEY = "immonova-consent"
export const CONSENT_REOPEN_EVENT = "immonova:consent-reopen"

export type Consent = "granted" | "denied"

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === "granted" || value === "denied" ? value : null
  } catch {
    return null
  }
}

export function saveConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // stockage indisponible : le choix vaut pour cette visite seulement
  }
  applyConsent(value)
}

export function applyConsent(value: Consent | null) {
  if (value === "granted") {
    if (!posthog.has_opted_in_capturing()) {
      posthog.set_config({ persistence: "localStorage+cookie" })
      posthog.opt_in_capturing()
      posthog.capture("$pageview", { $current_url: window.location.href })
    }
  } else {
    posthog.opt_out_capturing()
  }
}

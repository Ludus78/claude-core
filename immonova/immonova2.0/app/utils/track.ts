import posthog from "posthog-js"

// Les propriétés ne contiennent jamais de montant ni de donnée saisie par le visiteur.
// Sans consentement, PostHog est désactivé et capture() n'envoie rien (voir components/consent.ts).
export function trackEvent(name: string, properties?: Record<string, string>) {
  try {
    posthog.capture(name, properties)
  } catch {
    // la mesure ne doit jamais casser une page
  }
}

"use client"

import { useEffect, useState } from "react"
import { CONSENT_REOPEN_EVENT, readConsent, saveConsent } from "./consent"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readConsent() === null)
    const show = () => setVisible(true)
    window.addEventListener(CONSENT_REOPEN_EVENT, show)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, show)
  }, [])

  if (!visible) return null

  const choose = (value: "granted" | "denied") => {
    saveConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Préférences de mesure d'audience"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Nous mesurons l&apos;audience du site (pages vues, usage des calculettes) avec PostHog pour
          l&apos;améliorer. Aucune mesure n&apos;a lieu sans votre accord, et vous pouvez changer d&apos;avis
          à tout moment en bas de page.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

export function ManageCookiesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className="mt-2 block text-sm text-gray-500 underline hover:text-primary-700"
    >
      Gérer les cookies
    </button>
  )
}

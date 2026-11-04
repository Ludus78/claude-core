import type { OMMJsonObject } from "satellite.js";
import { GROUPS, isGroupId, type GroupId } from "./groups";

// CelesTrak updates every 2 hours and asks for one download per update (D26; à vérifier à la source,
// https://celestrak.org/usage-policy.php, consulté le 2026-11-03).
export const TTL_MS = 2 * 60 * 60 * 1000;
// CelesTrak blocks an IP after 50 HTTP errors in 2 hours (même source, à vérifier) : we stop far below that.
export const MAX_ERRORS_PER_WINDOW = 5;
const FETCH_TIMEOUT_MS = 15_000;

const ENDPOINT = "https://celestrak.org/NORAD/elements/gp.php";

export type GroupData = {
  group: GroupId;
  fetchedAt: number;
  stale: boolean;
  records: OMMJsonObject[];
};

type Entry = { records: OMMJsonObject[]; fetchedAt: number };

export type CacheDeps = {
  fetchImpl?: typeof fetch;
  now?: () => number;
};

export function createCelestrakCache({ fetchImpl = fetch, now = Date.now }: CacheDeps = {}) {
  const entries = new Map<GroupId, Entry>();
  const inFlight = new Map<GroupId, Promise<Entry>>();
  let errorTimes: number[] = [];

  function recentErrors(): number {
    const cutoff = now() - TTL_MS;
    errorTimes = errorTimes.filter((time) => time > cutoff);
    return errorTimes.length;
  }

  async function download(group: GroupId): Promise<Entry> {
    const url = `${ENDPOINT}?GROUP=${encodeURIComponent(group)}&FORMAT=json`;
    let response: Response;
    let body: unknown;
    try {
      response = await fetchImpl(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!response.ok) {
        errorTimes.push(now());
        throw new Error(`CelesTrak a répondu ${response.status}`);
      }
      // CelesTrak can answer 200 with plain text when it has nothing to send: invalid JSON counts as an error.
      body = await response.json();
    } catch (error) {
      if (!(error instanceof Error && error.message.startsWith("CelesTrak a répondu"))) errorTimes.push(now());
      throw error;
    }
    if (!Array.isArray(body)) {
      errorTimes.push(now());
      throw new Error("Réponse CelesTrak inattendue");
    }
    const records = body.slice(0, GROUPS[group].maxObjects) as OMMJsonObject[];
    return { records, fetchedAt: now() };
  }

  async function get(group: GroupId): Promise<GroupData> {
    const cached = entries.get(group);
    if (cached && now() - cached.fetchedAt < TTL_MS) {
      return { group, ...cached, stale: false };
    }

    // Error budget exhausted: keep serving the old copy, never call CelesTrak again until the window passes.
    if (recentErrors() >= MAX_ERRORS_PER_WINDOW) {
      if (cached) return { group, ...cached, stale: true };
      throw new Error("Trop d'erreurs CelesTrak, nouvel essai plus tard");
    }

    let pending = inFlight.get(group);
    if (!pending) {
      pending = download(group).finally(() => inFlight.delete(group));
      inFlight.set(group, pending);
    }

    try {
      const entry = await pending;
      entries.set(group, entry);
      return { group, ...entry, stale: false };
    } catch (error) {
      if (cached) return { group, ...cached, stale: true };
      throw error;
    }
  }

  return { get };
}

// Kept on globalThis so that hot reloads in `next dev` do not reset the TTL and the error budget.
const holder = globalThis as unknown as { __celestrakCache?: ReturnType<typeof createCelestrakCache> };
export const celestrakCache = (holder.__celestrakCache ??= createCelestrakCache());
export { isGroupId };

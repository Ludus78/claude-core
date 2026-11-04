import { describe, expect, it, vi } from "vitest";
import { createCelestrakCache, MAX_ERRORS_PER_WINDOW, TTL_MS } from "./celestrak-cache";
import { GROUPS } from "./groups";

const TWO_HOURS = 2 * 60 * 60 * 1000;

function records(count: number) {
  return Array.from({ length: count }, (_, index) => ({ OBJECT_NAME: `SAT-${index}`, NORAD_CAT_ID: index }));
}

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

function setup(responses: Array<() => Promise<Response>>) {
  let clock = 1_000_000;
  const now = () => clock;
  const fetchImpl = vi.fn(async (_input?: unknown, _init?: unknown) => {
    const next = responses.shift();
    if (!next) throw new Error("fetch inattendu");
    return next();
  });
  const cache = createCelestrakCache({ fetchImpl: fetchImpl as unknown as typeof fetch, now });
  return {
    cache,
    fetchImpl,
    advance: (ms: number) => {
      clock += ms;
    },
  };
}

describe("createCelestrakCache", () => {
  it("TTL = 2 h", () => {
    expect(TTL_MS).toBe(TWO_HOURS);
  });

  it("ne télécharge qu'une fois dans le TTL de 2 h", async () => {
    const { cache, fetchImpl, advance } = setup([async () => okResponse(records(3))]);

    const first = await cache.get("stations");
    advance(TWO_HOURS - 1000);
    const second = await cache.get("stations");

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(first.stale).toBe(false);
    expect(second.stale).toBe(false);
    expect(second.records).toHaveLength(3);
  });

  it("retélécharge après le TTL", async () => {
    const { cache, fetchImpl, advance } = setup([
      async () => okResponse(records(2)),
      async () => okResponse(records(4)),
    ]);

    await cache.get("stations");
    advance(TWO_HOURS + 1000);
    const refreshed = await cache.get("stations");

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(refreshed.records).toHaveLength(4);
    expect(refreshed.stale).toBe(false);
  });

  it("sert la copie stale quand CelesTrak échoue et qu'une copie existe", async () => {
    const { cache, advance } = setup([
      async () => okResponse(records(2)),
      async () => {
        throw new Error("réseau coupé");
      },
    ]);

    await cache.get("stations");
    advance(TWO_HOURS + 1000);
    const result = await cache.get("stations");

    expect(result.stale).toBe(true);
    expect(result.records).toHaveLength(2);
  });

  it("sert la copie stale aussi sur une réponse HTTP en erreur", async () => {
    const { cache, advance } = setup([
      async () => okResponse(records(2)),
      async () => new Response("oops", { status: 503 }),
    ]);

    await cache.get("stations");
    advance(TWO_HOURS + 1000);
    const result = await cache.get("stations");

    expect(result.stale).toBe(true);
    expect(result.records).toHaveLength(2);
  });

  it("lève une erreur quand l'échec survient sans copie", async () => {
    const { cache } = setup([
      async () => {
        throw new Error("réseau coupé");
      },
    ]);

    await expect(cache.get("starlink")).rejects.toThrow("réseau coupé");
  });

  it("lève une erreur quand la réponse HTTP est en échec et qu'il n'y a pas de copie", async () => {
    const { cache } = setup([async () => new Response("oops", { status: 500 })]);

    await expect(cache.get("stations")).rejects.toThrow("CelesTrak a répondu 500");
  });

  it("deux appels simultanés ne déclenchent qu'un seul fetch", async () => {
    let release: (response: Response) => void = () => {};
    const pending = new Promise<Response>((resolve) => {
      release = resolve;
    });
    const { cache, fetchImpl } = setup([() => pending]);

    const first = cache.get("stations");
    const second = cache.get("stations");
    release(okResponse(records(5)));
    const [a, b] = await Promise.all([first, second]);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(a.records).toHaveLength(5);
    expect(b.records).toHaveLength(5);
  });

  it("après MAX_ERRORS_PER_WINDOW erreurs, plus aucun fetch avant la fin de la fenêtre", async () => {
    // HTTP errors are the ones counted in the error budget.
    const failing = async () => new Response("oops", { status: 500 });
    const { cache, fetchImpl, advance } = setup([
      async () => okResponse(records(2)),
      ...Array.from({ length: MAX_ERRORS_PER_WINDOW }, () => failing),
    ]);

    await cache.get("stations");
    advance(TWO_HOURS + 1000);
    // Each of these attempts fails and is served from the old copy.
    for (let i = 0; i < MAX_ERRORS_PER_WINDOW; i++) {
      const result = await cache.get("stations");
      expect(result.stale).toBe(true);
    }
    expect(fetchImpl).toHaveBeenCalledTimes(1 + MAX_ERRORS_PER_WINDOW);

    // Budget exhausted: the old copy is served without calling CelesTrak.
    const blocked = await cache.get("stations");
    expect(blocked.stale).toBe(true);
    expect(blocked.records).toHaveLength(2);
    expect(fetchImpl).toHaveBeenCalledTimes(1 + MAX_ERRORS_PER_WINDOW);
  });

  it("reprend les fetch seulement quand la fenêtre d'erreurs est passée", async () => {
    // HTTP errors are the ones counted in the error budget.
    const failing = async () => new Response("oops", { status: 500 });
    const { cache, fetchImpl, advance } = setup([
      async () => okResponse(records(2)),
      ...Array.from({ length: MAX_ERRORS_PER_WINDOW }, () => failing),
      async () => okResponse(records(7)),
    ]);

    await cache.get("stations");
    advance(TWO_HOURS + 1000);
    for (let i = 0; i < MAX_ERRORS_PER_WINDOW; i++) {
      await cache.get("stations");
    }
    const callsBeforeWait = fetchImpl.mock.calls.length;

    // Still inside the window: no new call.
    advance(TWO_HOURS - 60_000);
    await cache.get("stations");
    expect(fetchImpl.mock.calls.length).toBe(callsBeforeWait);

    // Window over: CelesTrak is called again and the fresh copy is served.
    advance(120_000);
    const result = await cache.get("stations");
    expect(fetchImpl.mock.calls.length).toBe(callsBeforeWait + 1);
    expect(result.stale).toBe(false);
    expect(result.records).toHaveLength(7);
  });

  it("tronque le groupe à maxObjects", async () => {
    const max = GROUPS.stations.maxObjects;
    const { cache } = setup([async () => okResponse(records(max + 25))]);

    const result = await cache.get("stations");

    expect(result.records).toHaveLength(max);
    expect(result.records[0]).toEqual({ OBJECT_NAME: "SAT-0", NORAD_CAT_ID: 0 });
  });

  it("l'URL contient GROUP=<groupe>&FORMAT=json", async () => {
    const { cache, fetchImpl } = setup([async () => okResponse(records(1))]);

    await cache.get("oneweb");

    const url = String(fetchImpl.mock.calls[0][0]);
    expect(url).toContain("GROUP=oneweb&FORMAT=json");
    expect(url.startsWith("https://celestrak.org/NORAD/elements/gp.php?")).toBe(true);
  });
});

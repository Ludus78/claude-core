// Convertit un rapport Confio (JSON téléchargé depuis le popup) en MailFeatures,
// et rejoue le scoring pour comparer avec l'ancien riskLevel.
import { readFileSync } from "node:fs";
import { Auth, MailFeatures, LinkFeature, scoreMail } from "./scoring";

const toAuth = (v: unknown): Auth => {
  const s = String(v ?? "").toLowerCase();
  if (s === "pass") return "pass";
  if (["fail", "softfail", "permerror", "temperror"].includes(s)) return "fail";
  return "none"; // none, neutral, missing...
};

import { toUnicode } from "node:punycode";

const ENTITIES: Record<string, string> = { eacute: "é", egrave: "è", ecirc: "ê", agrave: "à", ccedil: "ç", amp: "&", quot: '"' };

// Le rapport contient du texte de lien passé dans un parseur d'URL :
// espaces en %20, accents en punycode (xn--...). On le remet en texte lisible.
function decodeDisplay(raw: string): string {
  let t = raw;
  try { t = decodeURIComponent(t); } catch {}
  t = t.replace(/&([a-z]+);/gi, (_, n) => ENTITIES[n.toLowerCase()] ?? "");
  if (t.startsWith("xn--")) { try { t = toUnicode(t); } catch {} }
  return t;
}

function toLink(l: any): LinkFeature | null {
  const domain = String(l.actualHost ?? l.domain ?? l.host ?? "").toLowerCase();
  const text = decodeDisplay(String(l.displayHost ?? l.text ?? ""));
  return domain ? { text, domain } : null;
}

export function toFeatures(m: any): MailFeatures {
  return {
    senderDomain: String(m.senderDomain ?? ""),
    spf: toAuth(m.auth?.spf), dkim: toAuth(m.auth?.dkim), dmarc: toAuth(m.auth?.dmarc),
    links: (m.links ?? []).map(toLink).filter((x: LinkFeature | null): x is LinkFeature => !!x),
  };
}

// Usage : npx tsx adapter.ts rapport.json
if (process.argv[2]) {
  const report = JSON.parse(readFileSync(process.argv[2], "utf8"));
  (async () => {
    for (const [i, m] of report.mails.entries()) {
      const f = toFeatures(m);
      const d = await scoreMail(f);
      const flag = d.verdict !== "safe" ? "  <-- à examiner" : "";
      console.log(`#${i + 1} ${f.senderDomain} | ancien: ${m.riskLevel} | nouveau: ${d.verdict} | ${f.links.length} liens${flag}`);
      d.reasons.forEach((r) => console.log(`      - ${r}`));
    }
  })();
}
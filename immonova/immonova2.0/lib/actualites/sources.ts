// Récupération des sources publiques pour les brouillons d'actualités (voir docs/actualites-hebdo.md).
// Seules les sources dont la réutilisation a été vérifiée sont actives.

export type DocumentSource = {
  sourceId: string;
  nom: string;
  url: string;
  periode: string; // AAAA-MM
  texte: string;
  mention: string; // à faire figurer dans le brouillon
};

type Source = {
  id: string;
  nom: string;
  actif: boolean;
  raison?: string;
  mention: (periode: string) => string;
  urlsRecentes: (maintenant: Date) => { url: string; periode: string }[];
};

// La Banque de France publie les données d'un mois environ cinq semaines après.
const MOIS_A_ESSAYER = 4;
const TAILLE_MAX_TEXTE = 8000;

const periodes = (maintenant: Date) =>
  Array.from({ length: MOIS_A_ESSAYER }, (_, i) => {
    const d = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() - i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  });

export const SOURCES: Source[] = [
  {
    id: 'banque-de-france',
    nom: 'Banque de France',
    actif: true,
    // Réutilisation autorisée à condition de citer la Banque de France et la date de mise à jour
    // (https://www.banque-france.fr/fr/infos-legales, lu le 2026-11-02, à revérifier).
    mention: (periode) => `Source : Banque de France, crédits aux particuliers, données de ${periode}.`,
    urlsRecentes: (maintenant) =>
      periodes(maintenant).map((periode) => ({
        url: `https://www.banque-france.fr/en/statistics/loans/loans-individuals-france-${periode}`,
        periode,
      })),
  },
  {
    id: 'notaires-de-france',
    nom: 'Notaires de France',
    actif: false,
    raison:
      "Les mentions légales de notaires.fr exigent une autorisation écrite du webmestre pour toute reproduction hors usage privé. Désactivée tant que cette autorisation n'est pas obtenue.",
    mention: (periode) => `Source : Notaires de France, note de conjoncture immobilière (${periode}).`,
    urlsRecentes: () => [],
  },
];

const ENTITES: Record<string, string> = {
  '&amp;': '&',
  '&nbsp;': ' ',
  '&euro;': '€',
  '&quot;': '"',
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
};

// Garde le texte principal d'une page HTML, sans balises ni scripts.
export function htmlEnTexte(html: string): string {
  const principal = /<main[\s\S]*?<\/main>/i.exec(html)?.[0] ?? html;
  return principal
    .replace(/<(script|style|nav|header|footer|svg|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#39;/gi, (e) => ENTITES[e] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, TAILLE_MAX_TEXTE);
}

async function lirePage(url: string): Promise<string | null> {
  try {
    const reponse = await fetch(url, {
      headers: { 'User-Agent': 'ImmoNovaBot/1.0 (+https://immonova.org)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!reponse.ok) return null;
    return htmlEnTexte(await reponse.text());
  } catch {
    return null;
  }
}

// Pour chaque source active, renvoie la publication la plus récente trouvée (une par source).
export async function recupererSources(maintenant = new Date()): Promise<DocumentSource[]> {
  const documents: DocumentSource[] = [];
  for (const source of SOURCES.filter((s) => s.actif)) {
    for (const { url, periode } of source.urlsRecentes(maintenant)) {
      const texte = await lirePage(url);
      if (texte) {
        documents.push({ sourceId: source.id, nom: source.nom, url, periode, texte, mention: source.mention(periode) });
        break;
      }
    }
  }
  return documents;
}

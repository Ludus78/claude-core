import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { Anthropic } from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';
import { recupererSources, type DocumentSource } from '@/lib/actualites/sources';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Plafonds (voir docs/actualites-hebdo.md)
const MAX_BROUILLONS = 2;
const MAX_TITRE = 120;
const MAX_RESUME = 300;
const MAX_TEXTE = 1800;

// Clé et modèle : choix reporté (voir docs/actualites-hebdo.md, décision 2).
const MODELE = process.env.NEWS_MODEL || 'claude-sonnet-5-5';

const IMAGES: Record<string, string> = {
  tendances: '/images/news-prices.jpg',
  financement: '/images/news-credit.jpg',
  conseils: '/images/news-energy.jpg',
};

const CONSIGNE = `Tu rédiges des brouillons d'actualités pour un site français d'aide à l'achat immobilier (public : primo-accédants et investisseurs locatifs).

Règles strictes :
- Utilise UNIQUEMENT le texte de la source fournie. N'utilise pas ta mémoire. Un chiffre absent de la source ne doit pas apparaître.
- Résume avec tes propres mots, en français, sans recopier de phrases. Ton informatif et neutre, jamais un conseil personnalisé.
- Si la source n'apporte rien de nouveau ou d'utile, renvoie une liste vide.
- Au maximum ${MAX_BROUILLONS} brouillons, chacun sur un sujet différent.
- Catégories autorisées : "tendances", "financement", "conseils".

Réponds uniquement par un tableau JSON, sans texte autour : [{"title": "...", "excerpt": "...", "content": "...", "category": "..."}]
title : ${MAX_TITRE} caractères maximum. excerpt : une ou deux phrases, ${MAX_RESUME} caractères maximum. content : deux ou trois courts paragraphes, ${MAX_TEXTE} caractères maximum.`;

type Brouillon = { title: string; excerpt: string; content: string; category: string };

const secretValide = (fourni: string | null, attendu: string) => {
  const a = Buffer.from(fourni ?? '');
  const b = Buffer.from(`Bearer ${attendu}`);
  return a.length === b.length && timingSafeEqual(a, b);
};

const normaliser = (s: string) => s.toLowerCase().replace(/(\d)[\s  ](\d)/g, '$1$2').replace(/(\d),(\d)/g, '$1.$2');

// Tous les nombres du brouillon doivent figurer dans le texte de la source.
const chiffresDansSource = (brouillon: Brouillon, source: string) => {
  const texteSource = normaliser(source);
  const nombres = normaliser(`${brouillon.title} ${brouillon.excerpt} ${brouillon.content}`).match(/\d+(?:\.\d+)?/g) ?? [];
  return nombres.every((n) => texteSource.includes(n));
};

const estBrouillon = (b: unknown): b is Brouillon => {
  const o = b as Record<string, unknown>;
  return (
    !!o &&
    typeof o.title === 'string' && o.title.length > 0 && o.title.length <= MAX_TITRE &&
    typeof o.excerpt === 'string' && o.excerpt.length > 0 && o.excerpt.length <= MAX_RESUME &&
    typeof o.content === 'string' && o.content.length > 0 && o.content.length <= MAX_TEXTE &&
    typeof o.category === 'string' && o.category in IMAGES
  );
};

async function rediger(anthropic: Anthropic, source: DocumentSource): Promise<Brouillon[]> {
  const reponse = await anthropic.messages.create({
    model: MODELE,
    max_tokens: 2000,
    system: CONSIGNE,
    messages: [{ role: 'user', content: `Source : ${source.nom} (${source.periode})\n\n${source.texte}` }],
  });
  const bloc = reponse.content.find((c) => c.type === 'text');
  const json = bloc && bloc.type === 'text' ? /\[[\s\S]*\]/.exec(bloc.text)?.[0] : null;
  if (!json) return [];
  try {
    const liste = JSON.parse(json);
    return Array.isArray(liste) ? liste.filter(estBrouillon).filter((b) => chiffresDansSource(b, source.texte)) : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !secretValide(request.headers.get('authorization'), secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.CLAUDE_API_KEY) {
    return NextResponse.json({ error: 'Clé API non configurée' }, { status: 503 });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
    const sources = await recupererSources();

    // Doublons : une publication déjà en brouillon ou publiée n'est pas retraitée.
    // Limite : un brouillon supprimé dans /admin ne laisse pas de trace, la publication serait donc retraitée.
    const dejaUtilisees = new Set(
      (await prisma.newsArticle.findMany({ where: { sourceUrl: { not: null } }, select: { sourceUrl: true } })).map((a) => a.sourceUrl),
    );

    let crees = 0;
    for (const source of sources) {
      if (crees >= MAX_BROUILLONS) break;
      if (dejaUtilisees.has(source.url)) continue;
      const brouillons = await rediger(anthropic, source);
      for (const b of brouillons.slice(0, MAX_BROUILLONS - crees)) {
        await prisma.newsArticle.create({
          data: {
            title: b.title,
            excerpt: b.excerpt,
            content: `${b.content}\n\n${source.mention}`,
            category: b.category,
            authorName: source.nom,
            imageUrl: IMAGES[b.category],
            sourceUrl: source.url,
            isPublished: false,
          },
        });
        crees++;
      }
    }

    // Journal : uniquement des nombres, jamais de clé ni de contenu
    console.log(`cron actualites : ${sources.length} source(s) lue(s), ${crees} brouillon(s) créé(s)`);
    return NextResponse.json({ sources: sources.length, brouillons: crees });
  } catch (error) {
    console.error('cron actualites : échec', error instanceof Error ? error.name : 'erreur');
    return NextResponse.json({ error: 'Échec du rafraîchissement' }, { status: 500 });
  }
}

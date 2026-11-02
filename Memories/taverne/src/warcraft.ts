// Listes proposées dans le formulaire. Elles décrivent les personnages que les amis ont réellement joués.
// À vérifier à la source (le jeu ajoute des races et des classes avec les extensions) : état connu en 2026,
// noms français à confirmer. Pour ajouter une entrée, la placer ici : le formulaire et la validation suivent.

export type Race = { nom: string; camp: "Alliance" | "Horde" | "Les deux camps" };

export const RACES: Race[] = [
  { nom: "Humain", camp: "Alliance" },
  { nom: "Nain", camp: "Alliance" },
  { nom: "Elfe de la nuit", camp: "Alliance" },
  { nom: "Gnome", camp: "Alliance" },
  { nom: "Draeneï", camp: "Alliance" },
  { nom: "Worgen", camp: "Alliance" },
  { nom: "Elfe du Vide", camp: "Alliance" },
  { nom: "Draeneï sancteforge", camp: "Alliance" },
  { nom: "Nain sombrefer", camp: "Alliance" },
  { nom: "Kultirassien", camp: "Alliance" },
  { nom: "Mécagnome", camp: "Alliance" },
  { nom: "Orc", camp: "Horde" },
  { nom: "Mort-vivant", camp: "Horde" },
  { nom: "Tauren", camp: "Horde" },
  { nom: "Troll", camp: "Horde" },
  { nom: "Elfe de sang", camp: "Horde" },
  { nom: "Gobelin", camp: "Horde" },
  { nom: "Sacrenuit", camp: "Horde" },
  { nom: "Tauren de Haut-Roc", camp: "Horde" },
  { nom: "Orc mag'har", camp: "Horde" },
  { nom: "Troll zandalari", camp: "Horde" },
  { nom: "Vulpérin", camp: "Horde" },
  { nom: "Pandaren", camp: "Les deux camps" },
  { nom: "Draconide (dracthyr)", camp: "Les deux camps" },
  { nom: "Terrestre", camp: "Les deux camps" },
];

export const CLASSES: string[] = [
  "Chevalier de la mort",
  "Chasseur de démons",
  "Druide",
  "Évocateur",
  "Chasseur",
  "Mage",
  "Moine",
  "Paladin",
  "Prêtre",
  "Voleur",
  "Chaman",
  "Démoniste",
  "Guerrier",
];

// Le jeu propose deux sexes de personnage.
export const SEXES: string[] = ["Homme", "Femme"];

export const CAMPS: Race["camp"][] = ["Alliance", "Horde", "Les deux camps"];

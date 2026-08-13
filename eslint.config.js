/* ESLint — le filet GÉNÉRIQUE ; le filet propre au dépôt est `outils/gardien.js`,
   et aucune de ses onze pannes n'est visible d'ici. Ce qu'ESLint attrape seul :
   identifiant fautif, variable morte, clé dupliquée.

   TROIS BLOCS pour trois natures de fichiers, et une seule difficulté : les pages
   ne chargent AUCUN module ES — un `<script src>` classique partage la portée
   globale (§9, §13), donc `frise.js` emploie `escapeH` sans l'avoir déclaré.

   LA LISTE DES GLOBALS VIENT DU GARDIEN, pas d'ici : il relève déjà, par page,
   les noms de haut niveau de ce qu'elle charge (R2). La recopier l'aurait fait
   vieillir au premier module ajouté (§12). On retire de chaque fichier ses
   propres déclarations, sinon `no-redeclare` proteste. */
const js      = require("@eslint/js");
const globals = require("globals");
const { PAGES, nomsExposes, declarationsDeHautNiveau } = require("./outils/gardien.js");

/* Pour chaque fichier de page : ce que ses VOISINS lui posent dans la portée
   globale. En `writable`, pas en `readonly` — `CONTENU` est déclaré par
   `noyau.js` et réaffecté par `contenu-io.js`, c'est la vie normale d'un global
   de script. */
const voisinage = new Map();
for (const page of PAGES) {
  const exposes = nomsExposes(page);
  for (const s of page.sources) {
    if (!s.f.endsWith(".js")) continue;              // écarte les scripts en ligne
    const siens = new Set(declarationsDeHautNiveau(s.code));
    const dehors = voisinage.get(s.f) || new Set();
    for (const n of exposes) if (!siens.has(n)) dehors.add(n);
    voisinage.set(s.f, dehors);
  }
}
const enGlobals = noms => Object.fromEntries([...noms].map(n => [n, "writable"]));

const REGLES = {
  ...js.configs.recommended.rules,
  /* Deux assouplissements, et pas un de plus, pour des idiomes voulus : un
     `localStorage` refusé ne doit pas casser la partie (`catch(e){}`), et
     `vars:"local"` parce que les noms de haut niveau d'une page SONT sa surface
     publique — R5 du gardien tient ce bout-là, lui sait lire un `onclick=`.
     Tout le reste était du vrai code mort, retiré plutôt qu'excusé. */
  "no-empty": ["error", { allowEmptyCatch: true }],
  "no-unused-vars": ["error", { args: "none", vars: "local", caughtErrors: "none" }]
};

module.exports = [
  { ignores: ["node_modules/**", "captures/**"] },

  // 1) Les fichiers de page — portée globale partagée, un bloc par fichier pour
  //    que chacun reçoive exactement le voisinage qui est le sien.
  ...[...voisinage].map(([fichier, noms]) => ({
    files: [fichier],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...enGlobals(noms) }
    },
    rules: REGLES
  })),

  // 2) Le mode double (§12) — trois fichiers se chargent par `<script src>` ET
  //    par `require`, et testent eux-mêmes par quelle porte ils sont entrés.
  //    Les deux portes, donc les globals des deux côtés.
  {
    files: ["app/moteur.js", "app/regles.js", "grammaire/grammaire2.js"],
    languageOptions: { globals: { module: "writable", require: "readonly", window: "readonly" } }
  },

  // 3) Node — les suites, le banc d'essai, les outils.
  {
    files: ["tests/**/*.js", "outils/**/*.js", "grammaire/**/*.js", "eslint.config.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: globals.node },
    rules: REGLES
  }
];

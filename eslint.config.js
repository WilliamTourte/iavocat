/* ESLint — le filet GÉNÉRIQUE. Le filet propre au dépôt, lui, est
   `outils/gardien.js` : aucune des huit pannes qu'il rejoue n'est visible d'ici.
   Ce qu'ESLint attrape et que personne d'autre n'attrape : un identifiant
   fautif, une variable morte dans une fonction, une clé dupliquée.

   TROIS BLOCS, parce que ce dépôt a trois natures de fichiers, et une seule
   difficulté : les pages ne chargent AUCUN module ES. Un `<script src>` classique
   partage la portée globale de la page (§9, §13) — donc `frise.js` emploie
   `escapeH` sans l'avoir déclaré, et c'est correct.

   D'OÙ VIENT LA LISTE DES GLOBALS : du gardien, pas d'ici. Il relève déjà, pour
   chacune des deux pages, les noms de haut niveau de tous les fichiers qu'elle
   charge (c'est ce dont sa règle R2 est faite). Recopier cette liste à la main
   ici l'aurait fait vieillir au premier module ajouté, et le §12 ne pardonne pas
   les copies. On la lui demande, et on retire de chaque fichier ses propres
   déclarations — sans quoi `no-redeclare` reprocherait à `creerMoteur` d'exister. */
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
  /* Deux assouplissements, et pas un de plus : ils portent des idiomes voulus.
     Un `localStorage` refusé (navigation privée, file:// verrouillé) ne doit pas
     casser la partie — d'où les `catch(e){}` de `sauverPartie`, `effacerPartie`
     et `effacerTuto`. Et `vars:"local"` parce que les noms de haut niveau d'une
     page SONT sa surface publique : `tutoPasser` n'est appelée que depuis un
     `onclick=` du HTML, qu'ESLint ne lit pas. C'est R5 du gardien qui tient ce
     bout-là, et lui sait lire les `onclick=`. `caughtErrors:"none"` va avec :
     un `catch(e)` dont on ignore la raison est ici une décision, pas un oubli.
     Tout ce qui restait après ces deux-là était du vrai code mort, et a été
     retiré plutôt qu'excusé. */
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

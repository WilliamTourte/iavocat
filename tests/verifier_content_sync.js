// Garde-fou de synchronisation : app/content.js doit être EXACTEMENT ce que
// l'atelier exporterait depuis son SEED en ce moment. Si quelqu'un modifie
// SEED (dans atelier_v3.html) sans relancer `npm run export:seed`, ce
// contrôle échoue plutôt que de laisser content.js dériver en silence.
// Ce n'est pas une des « six suites » (§5 de ARCHITECTURE.md) — c'est un
// contrôle en plus, qui ne teste aucun comportement, seulement un fichier.
//
// ⚠ Scopé à la phase actuelle (une seule affaire : SEED = l'exemple = le
// contenu joué). Le jour où l'atelier sert à écrire une AUTRE affaire que
// SEED et à l'exporter délibérément, ce contrôle devient un faux négatif
// permanent — le retirer (ou le remplacer par une validation moins stricte
// de content.js seul) à ce moment-là, pas avant.
const fs = require("fs");
const path = require("path");
const H = require("./harnais").creerHarnais(path.join(__dirname, "..", "app"));

const w = H.bootAtelier();
w.demanderExemple(); w.demanderExemple();   // SEED vierge, confirmé

const erreurs = w.valider().filter(i => i.niveau === "erreur");
if (erreurs.length) {
  console.log("  ÉCHEC — SEED a une erreur au diagnostic (voir npm run export:seed)");
  for (const e of erreurs) console.log(`    · ${e.msg}`);
  process.exit(1);
}

const attendu = "/* Généré par l'atelier IAvocat — ne pas éditer à la main, repasser par l'atelier. */\n"
  + "window.CONTENU = " + JSON.stringify(w.nettoyerPourJeu(w.CONTENU), null, 2) + ";\n";

const cible = path.join(__dirname, "..", "app", "content.js");
const surDisque = fs.readFileSync(cible, "utf8");

if (surDisque === attendu) {
  console.log("  ok — app/content.js correspond exactement à l'export du SEED");
  process.exit(0);
} else {
  console.log("  ÉCHEC — app/content.js a dérivé de SEED (l'atelier a changé sans réexport)");
  console.log("    → lancer : npm run export:seed");
  process.exit(1);
}

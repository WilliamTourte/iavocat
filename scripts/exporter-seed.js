// Régénère app/content.js depuis le SEED de l'atelier — en passant PAR
// l'atelier (son diagnostic, sa fonction d'export), jamais en tapant du
// JSON à la main. C'est la garantie que content.js ne diverge pas de
// SEED sans que personne ne s'en aperçoive.
//
// Usage : npm run export:seed
const fs = require("fs");
const path = require("path");
const H = require("../tests/harnais").creerHarnais(path.join(__dirname, "..", "app"));

const w = H.bootAtelier();
w.demanderExemple(); w.demanderExemple();   // deux clics : charge le SEED, confirmé

const erreurs = w.valider().filter(i => i.niveau === "erreur");
if (erreurs.length) {
  console.error(`export:seed refusé — ${erreurs.length} erreur(s) au diagnostic de l'atelier :`);
  for (const e of erreurs) console.error(`  · ${e.msg}`);
  process.exit(1);
}

// La même fonction que le bouton « Exporter content.js » de l'atelier.
const data = "/* Généré par l'atelier IAvocat — ne pas éditer à la main, repasser par l'atelier. */\n"
  + "window.CONTENU = " + JSON.stringify(w.nettoyerPourJeu(w.CONTENU), null, 2) + ";\n";

const cible = path.join(__dirname, "..", "app", "content.js");
fs.writeFileSync(cible, data);
console.log(`content.js régénéré depuis SEED (${data.length} octets) — 0 erreur au diagnostic.`);

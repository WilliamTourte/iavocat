#!/usr/bin/env node
/* `npm run export` — un seul fichier HTML, le JEU SEUL (jamais l'atelier), pour
 * un canal qui n'accepte qu'un fichier.
 * Même inlinage que `tests/harnais.js` (§13) : les balises d'app/index.html sont
 * remplacées par leur contenu, dans l'ORDRE. Aucune réécriture au-delà ; le
 * contenu livré part avec.
 */
const fs   = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..");
const SOURCE = path.join(RACINE, "app", "index.html");
const SORTIE = path.join(RACINE, "export", "iavocat.html");

function inliner(html, dossier) {
  const lire = f => fs.readFileSync(path.join(dossier, f), "utf8");
  return html
    .replace(/<script src="([^"]+)"><\/script>/g, (_, f) => `<script>\n${lire(f)}\n</script>`)
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, f) => `<style>\n${lire(f)}\n</style>`);
}

/* Ce que l'export SERAIT, sans rien écrire — c'est par là que R12 compare le
   fichier commité, au lieu de recopier l'inlinage et de mentir avec lui (§16). */
function construire() {
  return inliner(fs.readFileSync(SOURCE, "utf8"), path.dirname(SOURCE));
}

function main() {
  const replie = construire();

  fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
  fs.writeFileSync(SORTIE, replie);

  const ko = (Buffer.byteLength(replie) / 1024).toFixed(0);
  console.log(`Écrit — ${path.relative(RACINE, SORTIE)} (${ko} Ko)`);
  console.log("Un seul fichier, aucune dépendance : s'ouvre en double-clic, en file://.");
}

/* MODE DOUBLE, comme `regles.js` et `moteur.js` (§17) : lancé, il écrit ;
   requis, il ne fait que construire. */
if (require.main === module) main();
module.exports = { construire, SORTIE };

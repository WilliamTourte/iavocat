#!/usr/bin/env node
/* `npm run export` — un seul fichier HTML, le JEU SEUL (jamais l'atelier),
 * prêt à envoyer par un canal qui n'accepte qu'un fichier (WhatsApp, mail…).
 *
 * Même inlinage que `tests/harnais.js` (§13) : les balises <script src> et
 * <link rel=stylesheet> d'app/index.html sont remplacées par leur contenu
 * lu sur disque, dans l'ORDRE des balises. Aucune réécriture au-delà — la
 * page qui en sort est celle qui tourne en file://, juste repliée en un seul
 * fichier. Le contenu (content.js) part avec : c'est le contenu livré.
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

function main() {
  const html = fs.readFileSync(SOURCE, "utf8");
  const replie = inliner(html, path.dirname(SOURCE));

  fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
  fs.writeFileSync(SORTIE, replie);

  const ko = (Buffer.byteLength(replie) / 1024).toFixed(0);
  console.log(`Écrit — ${path.relative(RACINE, SORTIE)} (${ko} Ko)`);
  console.log("Un seul fichier, aucune dépendance : s'ouvre en double-clic, en file://.");
}

main();

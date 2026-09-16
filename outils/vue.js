#!/usr/bin/env node
/* `npm run vue` — voir le jeu tourner, pour de vrai : `app/index.html` en
 * file:// dans Chromium, le chemin docile joué, des captures dans `captures/`.
 *
 * Seul à éprouver le VRAI chargement des balises et de la feuille de style, là
 * où le harnais les inline (§13), et seul à permettre la relecture à l'œil.
 * Ce n'est PAS une suite : aucune assertion, hors `npm test`, et il ne sort en 1
 * que sur une erreur JS. Il n'implémente rien — il injecte `tests/harnais.js`.
 *
 * ÉCART À CONNAÎTRE : le chemin docile surligne sans ouvrir les pièces, dont les
 * puces restent « ● ». Artefact du pilote, pas du jeu.
 */
const fs   = require("fs");
const path = require("path");

const RACINE   = path.join(__dirname, "..");
const CAPTURES = path.join(RACINE, "captures");
const JEU      = "file://" + path.join(RACINE, "app", "index.html");

/* ---- Trouver un Chromium ---- le projet n'en télécharge aucun : `npm install`
   reste léger pour un dépôt dont le livrable n'a aucune dépendance. */
function trouverNavigateur() {
  const pistes = [];
  if (process.env.CHROMIUM_PATH) pistes.push(process.env.CHROMIUM_PATH);
  if (process.env.PLAYWRIGHT_BROWSERS_PATH)
    pistes.push(path.join(process.env.PLAYWRIGHT_BROWSERS_PATH, "chromium"));
  pistes.push(
    "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  );
  return pistes.find(p => { try { return fs.statSync(p).isFile(); } catch { return false; } });
}

/* ---- Le harnais, porté dans la page ---- trois bouchons suffisent à le faire
   vivre dans un navigateur, et on évite une seconde version (§12). */
function amorceHarnais() {
  const source = fs.readFileSync(path.join(RACINE, "tests", "harnais.js"), "utf8");
  return `(() => {
    const module  = { exports: {} };
    const process = { exit() {} };
    const require = n => n === "fs" ? { readFileSync: () => "" } : { JSDOM: function () {} };
    ${source}
    window.__H = module.exports.creerHarnais("");
  })();`;
}

/* ---- Le chemin docile, une étape à la fois ---- le corps d'`instruire()`,
   déroulé pour capturer entre deux. La décision reste chez les autres. */
const UN_PAS = `(() => {
  const H = window.__H;
  const r = R.remiseCourante(S);
  const a = R.attenteCourante(S, r);
  if (!a) return null;
  const L = H.lienTag(window, a.attend);
  if (!L) return { echec: "aucun lien ne porte le tag attendu" };
  const i = H.composerLien(window, L);
  if (i < 0) return { echec: "la phrase n'a pas pu se former" };
  const phrase = (S.brouillon[i] || {}).texte || "";
  // PIÈGE : le numéro se lit AVANT l'envoi — servir la dernière attente ouvre la
  // remise suivante, et la capture serait nommée d'après un écran qui n'existe pas.
  const remise = S.remisesEnvoyees;
  envoyer(i);
  return { tag: a.attend, question: a.question || null, phrase, remise };
})();`;

const CANAL = `document.getElementById("discussion").innerText.trim()`;

async function main() {
  const exe = trouverNavigateur();
  if (!exe) {
    console.log("Aucun Chromium trouvé — rien à montrer, et ce n'est pas une erreur.");
    console.log("Poser CHROMIUM_PATH ou PLAYWRIGHT_BROWSERS_PATH pour en désigner un.");
    return 0;
  }

  let chromium;
  try { ({ chromium } = require("playwright-core")); }
  catch {
    console.log("playwright-core n'est pas installé — `npm install` d'abord.");
    return 0;
  }

  fs.rmSync(CAPTURES, { recursive: true, force: true });
  fs.mkdirSync(CAPTURES, { recursive: true });

  const navigateur = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 900 } });

  const pannes = [];
  page.on("pageerror", e => pannes.push("erreur JS : " + e.message));
  page.on("console", m => { if (m.type() === "error") pannes.push("console : " + m.text()); });

  let n = 0;
  const capturer = async nom => {
    const f = path.join(CAPTURES, String(n++).padStart(2, "0") + "-" + nom + ".png");
    await page.screenshot({ path: f, fullPage: true });
    return path.relative(RACINE, f);
  };

  await page.goto(JEU);
  await page.waitForFunction("window.JEU && window.R && window.S");
  await page.evaluate(amorceHarnais());

  console.log("Le jeu, dans un vrai navigateur — " + JEU + "\n");
  console.log("  " + await capturer("depart"));

  let garde = 0;
  while (garde++ < 40) {
    const pas = await page.evaluate(UN_PAS);
    if (!pas) break;
    if (pas.echec) { console.log("\n  ARRÊT — " + pas.echec); break; }

    console.log("  " + await capturer("remise" + pas.remise + "-" + pas.tag));
    if (pas.question) console.log("      question — " + pas.question);
    console.log("      envoyé   — " + pas.phrase);
  }

  const fin = await page.evaluate(`window.__H.terminer(window)`);
  console.log("  " + await capturer("fin"));

  console.log("\n──────── le fil de l'avocat ────────\n");
  console.log(await page.evaluate(CANAL));
  console.log("\n──────── la fin atteinte ────────\n");
  console.log(fin ? fin.trim() : "(aucune — la clôture ne s'est pas ouverte)");

  await navigateur.close();

  if (pannes.length) {
    console.log("\nLa page a bronché :");
    for (const p of pannes) console.log("  " + p);
    return 1;
  }
  console.log("\nCaptures dans captures/ — à relire à l'œil.");
  return 0;
}

main().then(c => process.exit(c)).catch(e => { console.error(e); process.exit(1); });

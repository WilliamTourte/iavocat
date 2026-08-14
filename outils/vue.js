#!/usr/bin/env node
/* `npm run vue` — voir le jeu tourner, pour de vrai. Ouvre `app/index.html` en
 * file:// dans Chromium, joue le chemin docile, capture dans `captures/`.
 *
 * Deux choses qu'il est seul à faire : éprouver le VRAI chargement des balises
 * et de la feuille de style, là où le harnais les inline (§13) ; et permettre la
 * relecture à l'œil, irremplaçable (§2 de la passation).
 *
 * Ce n'est PAS une suite : aucune assertion, hors `npm test`. Il ne sort en 1
 * que sur une erreur JS de la page. Il ne réimplémente rien — il injecte
 * `tests/harnais.js` et appelle ses chemins, donc il joue ce que jouent les
 * suites, sans nommer aucune pièce ni aucun empan (§16).
 *
 * UN ÉCART À CONNAÎTRE : le chemin docile surligne sans ouvrir les pièces, dont
 * les puces restent « ● ». Artefact du pilote, pas du jeu.
 * CE QU'IL FAUT REGARDER : la mise en forme — seul endroit où le CSS se charge
 * pour de vrai, et aucun contrôle ne le vérifie.
 */
const fs   = require("fs");
const path = require("path");

const RACINE   = path.join(__dirname, "..");
const CAPTURES = path.join(RACINE, "captures");
const JEU      = "file://" + path.join(RACINE, "app", "index.html");

/* ---- Trouver un Chromium ------------------------------------------------
   Le projet ne télécharge aucun navigateur : `playwright-core` n'en embarque
   pas, et c'est délibéré — `npm install` reste léger pour un dépôt dont le
   livrable n'a aucune dépendance. Le navigateur vient donc de la machine. */
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

/* ---- Le harnais, porté dans la page ---- ses fonctions de chemin prennent une
   fenêtre et l'actionnent : trois bouchons suffisent à le faire vivre dans un
   navigateur, et on évite d'en écrire une seconde version (§12). */
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
   déroulé pour capturer entre deux. La décision reste chez les autres :
   l'attente vient de `regles.js`, le lien et sa composition du harnais. */
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
  envoyer(i);
  return { tag: a.attend, question: a.question || null, phrase, remise: S.remisesEnvoyees };
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

  /* Une erreur de page est un plantage, pas un jugement : jsdom ne la verrait
     pas de la même façon, et c'est bien pour ça qu'on regarde ici. */
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

  let remiseVue = 0, garde = 0;
  while (garde++ < 40) {
    const pas = await page.evaluate(UN_PAS);
    if (!pas) break;
    if (pas.echec) { console.log("\n  ARRÊT — " + pas.echec); break; }

    if (pas.remise > remiseVue) { remiseVue = pas.remise; }
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

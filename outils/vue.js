#!/usr/bin/env node
/* `npm run vue` — voir le jeu tourner, pour de vrai.
 *
 * Ouvre `app/index.html` en file:// dans Chromium, joue le chemin docile, et
 * dépose une capture à chaque étape dans `captures/`, en versant le fil de
 * l'avocat sur la sortie standard.
 *
 * Pourquoi cet outil existe alors que six suites tournent déjà :
 *
 *   1. Le harnais de test INLINE `moteur.js`, `regles.js` et `content.js` au
 *      boot, parce que jsdom ne charge aucun <script src> (§13). Ici les trois
 *      balises se chargent pour de vrai : c'est le seul endroit du projet qui
 *      éprouve le vrai chemin de chargement du jeu.
 *   2. « La relecture à l'œil reste irremplaçable » (§6 de PASSATION.md). Une
 *      suite dit qu'une phrase s'est formée ; elle ne dit pas qu'elle se lit.
 *
 * Ce n'est PAS une suite de test : aucune assertion, et il n'entre pas dans
 * `npm test` — même statut que `demo:grammaire`. Il ne sort en 1 que si la
 * page lève une erreur JS, ce qui n'est pas un jugement mais un plantage.
 *
 * Il ne réimplémente rien : il injecte `tests/harnais.js` dans la page et
 * appelle ses fonctions de chemin, donc il joue exactement ce que jouent les
 * suites. Il ne nomme aucune pièce, aucun empan, aucune valeur (§16).
 *
 * UN ÉCART À CONNAÎTRE EN REGARDANT LES CAPTURES : le chemin docile surligne
 * sans ouvrir les pièces, là où un joueur les ouvrirait. Les puces du dossier
 * restent donc marquées « ● » (non consultée) alors que des empans sont déjà
 * retenus. C'est un artefact du pilote, pas du jeu.
 *
 * ET CE QU'IL FAUT REGARDER : la mise en forme. C'est le seul endroit du dépôt
 * où le CSS se charge pour de vrai — le harnais l'inline, ici il vient d'un
 * <link> (§13). Aucun contrôle ne le vérifie ; une page sans style se voit sur
 * les captures, et nulle part ailleurs.
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

/* ---- Le harnais, porté dans la page -------------------------------------
   `tests/harnais.js` est du CommonJS écrit pour Node, mais ses fonctions de
   chemin (`composerLien`, `lienTag`, `terminer`…) ne touchent ni au disque ni
   à jsdom : elles prennent une fenêtre et l'actionnent. Trois bouchons
   suffisent donc à le faire vivre dans un navigateur — et on évite ainsi
   d'en écrire une seconde version, ce que ce dépôt ne pardonne pas (§12). */
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

/* ---- Le chemin docile, une étape à la fois -------------------------------
   C'est le corps de `instruire()` du harnais, déroulé pas à pas pour qu'on
   puisse capturer entre deux. La décision reste chez les autres : l'attente
   courante vient de `regles.js` (l'exemplaire unique de la normalisation), le
   lien et sa composition viennent du harnais. */
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

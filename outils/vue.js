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
  // PIÈGE : le numéro se lit AVANT l'envoi — servir la dernière attente ouvre la
  // remise suivante, et la capture serait nommée d'après un écran qui n'existe
  // pas. composerLien ENVOIE, puisque c'est le geste du joueur (§16) : on lit
  // donc le numéro avant lui, et plus entre lui et l'envoi.
  // SECOND PIÈGE : ce bloc est un GABARIT — pas un seul accent grave dedans, il
  // le refermerait. Le filet générique l'a vu, aucune suite ne l'aurait vu.
  const remise = S.remisesEnvoyees;
  const i = H.composerLien(window, L);
  if (i < 0) return { echec: "la phrase n'a pas pu se former" };
  const phrase = (S.brouillon[i] || {}).texte || "";
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

  /* ---- Le portable du playtest : 1280×800 (§4.6) ---- une partie neuve, dans
     un contexte neuf — tutoriel compris, puisque c'est lui qui prend la place.
     AU-DESSUS du seuil de `.wrap.avecLateral` (900px) : les panneaux — et la
     pièce, DANS le CONTEXTE — s'y ouvrent dans la colonne LATÉRALE, à côté de la conversation —
     c'est la capture "piece" qui le montre, question et composeur lisibles en
     même temps. La colonne doit tenir dans la fenêtre : on le DIT, on ne
     l'asserte pas. */
  console.log("\n──────── 1280×800 ────────\n");
  const etroit = await navigateur.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await etroit.newPage();
  p2.on("pageerror", e => pannes.push("erreur JS (1280×800) : " + e.message));
  await p2.goto(JEU);
  await p2.waitForFunction("window.JEU && window.R && window.S");
  await p2.evaluate(amorceHarnais());
  /* LA BULLE ÉVITE CE QUI PARLE OU AGIT (§4.8) : à chaque capture, on DIT ce
     qu'elle recouvre encore. `TUTO_EVITE` est un `const` du jeu : pas une
     propriété de `window`, mais lisible par son nom (R2). */
  const recouvre = () => p2.evaluate(`(() => {
    const b = document.getElementById("tuto");
    if (!b || b.hidden) return [];
    const q = b.getBoundingClientRect();
    return [...document.querySelectorAll(TUTO_EVITE)].filter(el => {
      if (!el.offsetParent || b.contains(el)) return false;
      const r = el.getBoundingClientRect();
      return r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom;
    }).map(el => el.className || el.tagName);
  })()`);
  const capturer2 = async nom => {
    const f = path.join(CAPTURES, String(n++).padStart(2, "0") + "-1280-" + nom + ".png");
    await p2.screenshot({ path: f });
    const sous = await recouvre();
    return path.relative(RACINE, f) + (sous.length ? `   (la bulle recouvre : ${sous.join(", ")})` : "");
  };
  console.log("  " + await capturer2("depart"));
  /* De VRAIS clics, pas des appels directs : c'est ce qui éprouve le bouton
     agrégé du message et sa porte vers le CONTEXTE (§4.6), et la bavarde du
     tutoriel qui se réduit en icône entre les deux (§4.8) — rien de tout ça
     n'est visible d'une suite. */
  await p2.click("#discussion .attach");
  console.log("  " + await capturer2("contexte-recu"));
  /* CLIQUER DISCUSSION AGRANDIT LA CONVERSATION (§4.6) : les colonnes échangent
     leurs parts, la bulle se replace (`placerTuto`). Un second clic rend la place. */
  await p2.click(`#titreDISCUSSION [data-f="discussion"]`);
  console.log("  " + await capturer2("discussion-agrandie"));
  await p2.click(`#titreDISCUSSION [data-f="discussion"]`);
  const pid1280 = await p2.evaluate("__H.pidPremiereRemise(window)");
  await p2.click(`[data-f="d:${pid1280}"]`);
  console.log("  " + await capturer2("piece"));
  /* Un VRAI clic sur le passage attendu : la confirmation (§4.3) ne vit qu'un
     rendu, et seule une capture prise juste après la montre. */
  const veut1280 = await p2.evaluate(
    "__H.lienTag(window, R.attenteCourante(S, R.remiseCourante(S)).attend).termes[0]");
  await p2.click(`#panPiece [data-f="e:${veut1280}"]`);
  console.log("  " + await capturer2("piece-retenu"));
  /* Et on PREND le passage sans rien refermer : la pièce vit dans le CONTEXTE,
     le passage retenu paraît juste dessous (§4.6). */
  await p2.click(`#contexte [data-f="c:${veut1280}"]`);
  console.log("  " + await capturer2("contexte"));
  const pli = await p2.evaluate(`(() => {
    const e = document.querySelector(".envoi");
    return { envoi: e ? Math.round(e.getBoundingClientRect().bottom) : null, fenetre: innerHeight,
             page: document.documentElement.scrollHeight };
  })()`);
  console.log(`      → Envoyer ${pli.envoi !== null && pli.envoi <= pli.fenetre ? "au-dessus du" : "SOUS LE"} pli`
            + ` (bas ${pli.envoi}px, fenêtre ${pli.fenetre}px, page ${pli.page}px)`);
  /* LA BULLE DU TUTORIEL EST EN SURIMPRESSION (§4.8) : « tout effacer » la
     redéploie, et rien ne doit bouger autour — c'était une soixantaine de
     pixels quand elle vivait dans le flux (retour de playtest, Jean). On le
     DIT en mesurant la conversation avant et après, on ne l'asserte pas. */
  const hautFil = () => p2.evaluate(`Math.round(document.getElementById("discussion").getBoundingClientRect().top)`);
  const avant = await hautFil();
  await p2.click(`#composeur [data-f="effacer"]`);
  console.log("  " + await capturer2("tout-efface"));
  const apres = await hautFil();
  console.log(`      la bulle redéployée ${avant === apres ? "ne décale rien" : `DÉCALE la conversation de ${apres - avant}px`}`);
  /* Le rendu suivant sans consigne neuve la réduit au « ? » collé à la zone. */
  await p2.evaluate("rendreTout()");
  console.log("  " + await capturer2("tuto-reduit"));

  /* LA COMPARAISON EN COURS, CONTEXTE ouvert (§4.6) : la réponse au plus long —
     deux passages et l'article — ne doit pas écraser le CONTEXTE. Retour de
     playtest (Jean) : à 1280×800, la pièce y était coupée. On DIT les hauteurs,
     on ne les asserte pas. Et le CONTEXTE resté ouvert entre deux envois (§4.6),
     on le dit aussi. */
  const resteOuvert = await p2.evaluate(`(() => {
    const H = __H, L = () => H.lienTag(window, R.attenteCourante(S, R.remiseCourante(S)).attend);
    // PIÈGE : la porte de la barre est une BASCULE — sur un CONTEXTE déjà
    // ouvert, elle le refermerait. Et la voix ouvre POUR ÉCRIRE : la phrase
    // pleine, il se refermerait de lui-même. On consulte donc, par la barre.
    if (panneau !== "contexte") basculerPanneau("contexte");
    H.composerLien(window, L());
    return !document.getElementById("panCONTEXTE").hidden;
  })()`);
  console.log(`      après un envoi, le CONTEXTE ${resteOuvert ? "reste ouvert" : "S'EST REFERMÉ"}`);
  /* RETENIR LES DEUX PASSAGES (§4.8) : la remise 1 ne les extrait plus d'avance
     (§3). De VRAIS clics, là où le halo les montre : le texte de la pièce,
     l'index quand elle ne porte plus rien d'attendu, la pièce suivante. */
  const halo = () => p2.evaluate(`(() => { const h = document.querySelector("[data-tuto]");
    return !h ? "(aucun)" : h.getAttribute("data-f") || "#" + (h.id || h.className); })()`);
  const [tA, tB] = await p2.evaluate("__H.sousTerme(__H.lienTag(window, R.attenteCourante(S, R.remiseCourante(S)).attend)).termes");
  const pieceDe = k => k.slice(0, k.indexOf("."));
  console.log("  " + await capturer2("relier-retenir") + `   (halo : ${await halo()})`);
  if (await p2.evaluate(`S.modalPiece !== "${pieceDe(tA)}"`)) {
    if (await p2.evaluate("indexPlie()")) await p2.click(`#zoneDossier [data-f="dossier"]`);
    await p2.click(`#zoneDossier [data-f="d:${pieceDe(tA)}"]`);
  }
  await p2.click(`#panPiece [data-f="e:${tA}"]`);
  console.log("  " + await capturer2("relier-premier-retenu") + `   (halo : ${await halo()})`);
  if (pieceDe(tA) !== pieceDe(tB)) {
    if (await p2.evaluate("indexPlie()")) await p2.click(`#zoneDossier [data-f="dossier"]`);
    console.log("  " + await capturer2("relier-autre-piece") + `   (halo : ${await halo()})`);
    await p2.click(`#zoneDossier [data-f="d:${pieceDe(tB)}"]`);
  }
  await p2.click(`#panPiece [data-f="e:${tB}"]`);
  console.log("  " + await capturer2("relier-retenus") + `   (halo : ${await halo()})`);
  /* Les deux passages PRIS À LA MAIN, l'article NON LU : c'est le temps où le
     tutoriel désigne sa puce, puis son bloc (§4.8). */
  await p2.click(`#contexte [data-f="c:${tA}"]`);
  await p2.click(`#contexte [data-f="c:${tB}"]`);
  /* De VRAIS clics : la puce de l'article, puis son bloc — ceux que le halo montre. */
  console.log("  " + await capturer2("article-a-lire") + `   (halo : ${await halo()})`);
  /* Une pièce encore ouverte replie l'index : le halo montre d'abord « déplier ». */
  if (await halo() === "dossier") {
    await p2.click(`#zoneDossier [data-f="dossier"]`);
    console.log("  " + await capturer2("article-deplie") + `   (halo : ${await halo()})`);
  }
  const fArticle = await halo();
  if (fArticle.startsWith("d:")) await p2.click(`#zoneDossier [data-f="${fArticle}"]`);
  /* L'ARTICLE SE RETIENT, PUIS SE PREND (passe F) : son texte dans la pièce,
     puis sa fiche au CONTEXTE — plus un bouton du composeur. */
  console.log("  " + await capturer2("article-a-retenir") + `   (halo : ${await halo()})`);
  const cleArt = await p2.evaluate(`__H.cleArticle(window, S.modalPiece)`);
  if (cleArt) await p2.click(`#panPiece [data-f="e:${cleArt}"]`);
  console.log("  " + await capturer2("article-a-prendre") + `   (halo : ${await halo()})`);
  const fFiche = await halo();
  if (fFiche.startsWith("c:")) await p2.click(`#zoneRetenus [data-f="${fFiche}"]`);
  console.log("  " + await capturer2("comparaison"));
  const hauteurs = await p2.evaluate(`(() => {
    const h = id => Math.round(document.getElementById(id).getBoundingClientRect().height);
    return { contexte: h("panCONTEXTE"), composeur: h("composeur") };
  })()`);
  console.log(`      CONTEXTE ${hauteurs.contexte}px, réponse ${hauteurs.composeur}px (fenêtre 800px)`);

  /* ---- EN DESSOUS DU SEUIL : 390×800 (§4.6) ---- aucune des deux largeurs
     ci-dessus ne descend sous 900px ; sans ce troisième contexte, le repli
     empilé d'origine (les panneaux ENTRE la conversation et le composeur)
     ne serait plus jamais rejoué par `npm run vue`. */
  console.log("\n──────── 390×800 (sous le seuil) ────────\n");
  const mobile = await navigateur.newContext({ viewport: { width: 390, height: 800 } });
  const p3 = await mobile.newPage();
  p3.on("pageerror", e => pannes.push("erreur JS (390×800) : " + e.message));
  await p3.goto(JEU);
  await p3.waitForFunction("window.JEU && window.R && window.S");
  await p3.evaluate(amorceHarnais());
  const capturer3 = async nom => {
    const f = path.join(CAPTURES, String(n++).padStart(2, "0") + "-390-" + nom + ".png");
    await p3.screenshot({ path: f });
    return path.relative(RACINE, f);
  };
  console.log("  " + await capturer3("depart"));
  await p3.click("#discussion .attach");
  console.log("  " + await capturer3("contexte-recu"));
  /* Sous le seuil, le panneau descend à son plancher et la conversation prend
     le reste (§4.6). */
  await p3.click(`#titreDISCUSSION [data-f="discussion"]`);
  console.log("  " + await capturer3("discussion-agrandie"));
  await p3.click(`#titreDISCUSSION [data-f="discussion"]`);
  const pid390 = await p3.evaluate("__H.pidPremiereRemise(window)");
  await p3.click(`[data-f="d:${pid390}"]`);
  console.log("  " + await capturer3("piece"));
  const veut390 = await p3.evaluate(
    "__H.lienTag(window, R.attenteCourante(S, R.remiseCourante(S)).attend).termes[0]");
  await p3.click(`#panPiece [data-f="e:${veut390}"]`);
  console.log("  " + await capturer3("piece-retenu"));
  await p3.click(`#contexte [data-f="c:${veut390}"]`);
  console.log("  " + await capturer3("contexte"));

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

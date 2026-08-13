#!/usr/bin/env node
/* `npm run gardien` — les conventions que les six suites ne voient pas (§16 bis).
 * Onze règles, onze pannes réellement vécues ; chacune cite le § qui la tranche.
 *
 *   R1  la forme des balises que le harnais doit reconnaître        §13, §2
 *   R2  un nom de haut niveau, une seule fois par page              §2
 *   R3  toute `var(--x)` a une définition                           §2
 *   R4  une famille CSS a un porteur                                §14
 *   R5  un `onclick` vise une fonction qui existe                   §2
 *   R6  un id visé existe — et le tutoriel vise quelque chose       §2, §4.8
 *   R7  aucun reste du schéma 2                                     §2
 *   R8  la carte ne ment pas sur les tailles                        §12
 *   R9  `attend`/`apres` ne se lisent plus sur une remise           §3, §11, §15
 *   R10 aucune recopie d'un prédicat que `regles.js` exporte       §12, §16
 *   R11 aucun renvoi « §x » ne pointe dans le vide                 §12
 *
 * TERRITOIRES : R7, R9 et R10 marchent sur `app/`, `tests/` ET `outils/`, R11
 * sur tout le dépôt, documents compris ; les huit autres sur les deux pages.
 * Avant d'ajouter une règle, demander SUR QUEL TERRITOIRE elle marche — la
 * réponse n'est pas « `app/` » par défaut.
 *
 * CE N'EST PAS UNE CINQUIÈME SOURCE DE VÉRITÉ (§12) : le jour où une règle et
 * son § divergent, c'est le § qui a raison. Aucune règle ne connaît une pièce,
 * un empan ni une valeur — même discipline que les suites (§16).
 *
 * Zéro dépendance. Sortie 1 sur écart. Dans `npm test`, APRÈS les six suites.
 */
const fs   = require("fs");
const path = require("path");

const RACINE  = path.join(__dirname, "..");
const lire    = rel => fs.readFileSync(path.join(RACINE, rel), "utf8");
const existe  = rel => fs.existsSync(path.join(RACINE, rel));
// `wc -l` compte les sauts de ligne : un fichier qui finit par un saut n'a pas
// une ligne vide de plus. La carte est écrite avec ces chiffres-là.
const nbLignes = rel => { const s = lire(rel); return s.split("\n").length - (s.endsWith("\n") ? 1 : 0); };

/* Trois territoires, pas un : `app/` porte le livrable, mais `tests/` et
   `outils/` REFLÈTENT ses règles, et un reflet qui dérive ne se voit nulle part
   — les suites éprouvent le jeu, jamais elles-mêmes (§16). */
const TERRITOIRES = ["app", "tests", "outils"];
function fichiersJS(racines) {
  const out = [];
  const marcher = rel => {
    for (const e of fs.readdirSync(path.join(RACINE, rel), { withFileTypes: true })) {
      const r = rel + "/" + e.name;
      if (e.isDirectory()) marcher(r);
      else if (r.endsWith(".js")) out.push(r);
    }
  };
  for (const r of racines) if (existe(r)) marcher(r);
  return out;
}

/* Le compte-rendu prend la forme de `tests/harnais.js` : même sortie à l'œil. */
let tenues = 0, ecarts = 0;
function regle(nom, liste) {
  if (!liste.length) { tenues++; console.log("  ok — " + nom); return; }
  ecarts += liste.length;
  console.log("  ÉCHEC — " + nom);
  for (const e of liste) console.log("         · " + e);
}
function bilan() {
  console.log(`\n${tenues} règle(s) tenue(s), ${ecarts} écart(s)`);
  process.exit(ecarts ? 1 : 0);
}

/* TROIS vues d'un source JS, parce que les règles en demandent trois :
     `code`     tout blanchi sauf le code — on y compte les accolades (R2)
     `chaines`  le contenu des chaînes — classes CSS et HTML engendré (R4)
     `sansComm` le source moins les commentaires — seule vue où un `onclick="…"`
                se lit d'un bloc (R5, R6)
   Un `split` ne suffit pas : gabarits imbriqués, regex dont les accolades
   fausseraient la profondeur, commentaires qui citent du code. */
const MOTS_AVANT_REGEX = /(?:^|[^\w$.])(?:return|typeof|case|in|of|do|else|delete|void|instanceof|new|yield)$/;
function debutDeRegex(codeAvant) {
  const t = codeAvant.replace(/\s+$/, "");
  if (!t) return true;
  if ("(,=:[!&|?{};+-*%~^<>".includes(t[t.length - 1])) return true;
  return MOTS_AVANT_REGEX.test(t);
}
// La fin d'un littéral régulier, drapeaux compris. -1 s'il ne s'en referme pas
// avant la fin de ligne : c'était une division, finalement.
function finDeRegex(src, i) {
  let j = i + 1, classe = false;
  while (j < src.length) {
    const c = src[j];
    if (c === "\\") { j += 2; continue; }
    if (c === "\n") return -1;
    if (classe) { if (c === "]") classe = false; j++; continue; }
    if (c === "[") { classe = true; j++; continue; }
    if (c === "/") { j++; while (j < src.length && /[a-z]/.test(src[j])) j++; return j; }
    j++;
  }
  return -1;
}
function decouperJS(src) {
  const chaines = [];
  let code = "", sansComm = "";
  const pile = [];                       // {t:"gabarit",txt} | {t:"interp",prof}
  const dansCode = () => !pile.length || pile[pile.length - 1].t === "interp";
  let i = 0;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (dansCode()) {
      if (c === "/" && d === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
      /* Blanchi, mais REND SES SAUTS DE LIGNE : R7 et R9 comptent les `\n` de
         `code` pour dire où regarder. */
      if (c === "/" && d === "*") {
        const j = src.indexOf("*/", i + 2), fin = j < 0 ? src.length : j + 2;
        const sauts = src.slice(i, fin).replace(/[^\n]/g, "");
        code += sauts; sansComm += sauts; i = fin; continue;
      }
      if (c === "/" && debutDeRegex(code)) {
        const j = finDeRegex(src, i);
        if (j > 0) { sansComm += src.slice(i, j); code += "/RE/"; i = j; continue; }
      }
      if (c === '"' || c === "'") {
        let j = i + 1, txt = "";
        while (j < src.length && src[j] !== c) {
          if (src[j] === "\\") { txt += src[j + 1] || ""; j += 2; } else txt += src[j++];
        }
        chaines.push(txt); sansComm += src.slice(i, j + 1); code += c + c; i = j + 1; continue;
      }
      if (c === "`") { pile.push({ t: "gabarit", txt: "" }); sansComm += c; code += "``"; i++; continue; }
      const sommet = pile[pile.length - 1];
      if (sommet && sommet.t === "interp") {
        if (c === "{") sommet.prof++;
        else if (c === "}") {
          if (sommet.prof === 0) { pile.pop(); sansComm += c; i++; continue; }
          sommet.prof--;
        }
      }
      sansComm += c; code += c; i++; continue;
    }
    const g = pile[pile.length - 1];     // on lit le texte d'un gabarit
    if (c === "\\") { g.txt += src[i + 1] || ""; sansComm += src.slice(i, i + 2); i += 2; continue; }
    if (c === "`")  { chaines.push(g.txt); pile.pop(); sansComm += c; i++; continue; }
    if (c === "$" && d === "{") { pile.push({ t: "interp", prof: 0 }); sansComm += "${"; i += 2; continue; }
    // Même raison qu'au commentaire de bloc : le texte d'un gabarit est blanchi,
    // mais ses sauts de ligne restent, sinon les lignes annoncées dérivent.
    if (c === "\n") code += c;
    g.txt += c; sansComm += c; i++;
  }
  return { code, chaines, sansComm };
}

/* Les déclarations à PROFONDEUR D'ACCOLADE ZÉRO — les seules qui prennent un nom
   dans la page. Sans le compte, une fermeture (§9) passerait pour une collision,
   et on ferait retirer ce qui protège du vrai piège. */
const DECLARATION = /(function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/y;
function declarationsDeHautNiveau(code) {
  const noms = [];
  let prof = 0, precedent = "";
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (c === "{") { prof++; precedent = c; continue; }
    if (c === "}") { prof--; precedent = c; continue; }
    // Une déclaration ouvre une instruction : ce qui la précède est un `;`, une
    // accolade fermante, ou le début du fichier. Sans ce garde-fou, le `g` de
    // `const f = function g(){}` passerait pour un nom de haut niveau.
    if (prof === 0 && /[A-Za-z]/.test(c) && (precedent === "" || precedent === ";" || precedent === "}")) {
      DECLARATION.lastIndex = i;
      const m = DECLARATION.exec(code);
      if (m && m.index === i) {
        noms.push(m[2]);
        let j = DECLARATION.lastIndex;
        /* `let selA=null, selB=null;` déclare DEUX noms, et un nom manquant à
           l'inventaire est une collision que R2 ne verrait pas. */
        if (m[1] !== "function" && m[1] !== "class") {
          let d = 0;
          while (j < code.length) {
            const k = code[j];
            if ("([{".includes(k)) d++;
            else if (")]}".includes(k)) { if (d === 0) break; d--; }
            else if (d === 0 && k === ";") break;
            else if (d === 0 && k === ",") {
              const suite = /\s*([A-Za-z_$][\w$]*)/y;
              suite.lastIndex = j + 1;
              const n = suite.exec(code);
              if (n) { noms.push(n[1]); j = suite.lastIndex; continue; }
            }
            j++;
          }
        }
        i = j - 1;
        continue;
      }
    }
    if (!/\s/.test(c)) precedent = c;
  }
  return noms;
}

/* ---- CSS ---------------------------------------------------------------- */
const sansCommentairesCSS = s => s.replace(/\/\*[\s\S]*?\*\//g, "");
/* Les sélecteurs : ce qui précède une `{`, à toute profondeur. Les préludes
   d'at-règles sont écartés — `@keyframes pouls` ne nomme aucune famille. */
function classesCSS(css) {
  const out = new Set();
  for (const m of sansCommentairesCSS(css).matchAll(/([^{}]*)\{/g)) {
    const s = m[1].trim();
    if (!s || s.startsWith("@")) continue;
    for (const k of s.matchAll(/\.([A-Za-z][\w-]*)/g)) out.add(k[1]);
  }
  return out;
}
const varsDefinies  = txt => new Set([...txt.matchAll(/(--[A-Za-z][\w-]*)\s*:/g)].map(m => m[1]));
const varsEmployees = txt => new Set([...txt.matchAll(/var\(\s*(--[A-Za-z][\w-]*)/g)].map(m => m[1]));

/* ---- HTML --------------------------------------------------------------- */
const sansCommentairesHTML = s => s.replace(/<!--[\s\S]*?-->/g, "");

/* Les classes qu'une page POSE réellement (R4, R6). Deux gisements, pas un de
   plus : un `class="…"` (statique ou engendré), et toute chaîne qui n'est QU'un
   mot. Prendre tous les mots de toutes les chaînes serait trop large d'une
   chose : `content.js` est de la PROSE, et une famille morte y passerait pour
   portée par le texte de l'affaire — un gardien qui lit le contenu ne garde
   rien (§9). */
function classesPosees(page) {
  const out = new Set();
  const attribut = txt => {
    for (const m of txt.matchAll(/class="([^"]*)"/g))
      for (const k of m[1].matchAll(/[A-Za-z][\w-]*/g)) out.add(k[0]);
  };
  attribut(page.html);
  for (const s of page.sources) {
    attribut(s.sansComm);
    for (const c of s.chaines) if (/^[A-Za-z][\w-]*$/.test(c)) out.add(c);
  }
  return out;
}

/* Tout se juge PAR PAGE : `escapeAttr` et `$` sont déclarés dans `jeu.js` ET
   dans `noyau.js`, et c'est légitime — jamais la même page. */
const TAG_SCRIPT_STRICT = /^<script src="([^"]+)"><\/script>$/;
const TAG_LIEN_STRICT   = /^<link rel="stylesheet" href="([^"]+)">$/;

function chargerPage(htmlRel, nom) {
  const brut = lire(htmlRel);
  const html = sansCommentairesHTML(brut);
  const dossier = path.posix.dirname(htmlRel);
  const resoudre = f => path.posix.join(dossier, f);

  const balisesScript = [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
  const balisesLien   = [...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0])
                          .filter(t => t.includes("stylesheet"));

  const scripts = [], feuilles = [], enLigne = [];
  for (const t of balisesScript) {
    const m = TAG_SCRIPT_STRICT.exec(t);
    if (m) scripts.push(resoudre(m[1]));
    else if (/^<script>[\s\S]*<\/script>$/.test(t)) enLigne.push(t.slice(8, -9));
  }
  for (const t of balisesLien) { const m = TAG_LIEN_STRICT.exec(t); if (m) feuilles.push(resoudre(m[1])); }

  // Les sources, découpés une fois : chaque règle repioche dans ces trois vues.
  const sources = scripts.filter(existe).map(f => ({ f, ...decouperJS(lire(f)) }));
  for (const [i, corps] of enLigne.entries())
    sources.push({ f: htmlRel + ` (script en ligne ${i + 1})`, ...decouperJS(corps) });

  return { nom, htmlRel, brut, html, dossier, resoudre,
           balisesScript, balisesLien, scripts, feuilles, sources,
           css: feuilles.filter(existe).map(lire).join("\n") };
}

const PAGES = [
  chargerPage("app/index.html",      "le jeu"),
  chargerPage("app/atelier_v3.html", "l'atelier")
];

/* CE QU'UNE PAGE EXPOSE À ELLE-MÊME. Deux lecteurs : R5, pour juger un
   `onclick=`, et `eslint.config.js` pour ses `globals` — la liste n'est écrite
   nulle part, elle se calcule (§12). */
function nomsExposes(page) {
  const noms = new Set();
  for (const s of page.sources) {
    for (const n of declarationsDeHautNiveau(s.code)) noms.add(n);
    for (const m of s.sansComm.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) noms.add(m[1]);
  }
  return noms;
}

/* Mode double : lancé, il contrôle et sort en 1 sur écart ; `require`, il ne rend
   que l'inventaire, sans rien afficher ni terminer le processus. */
module.exports = { PAGES, decouperJS, declarationsDeHautNiveau, nomsExposes };
if (require.main !== module) return;

console.log("Le gardien — les conventions que les six suites ne voient pas.\n");

/* R1 — LA FORME DES BALISES (§13). Une balise déviante n'est PAS inlinée du
   tout : l'écart se dit ICI plutôt qu'en `ReferenceError` au milieu d'une suite.
   Plus deux cas qu'aucune suite ne nomme : un fichier chargé qui n'existe pas,
   et une balise en commentaire — que le harnais inlinerait quand même. */
{
  const faux = [];
  for (const p of PAGES) {
    for (const t of p.balisesScript) {
      if (TAG_SCRIPT_STRICT.test(t)) continue;
      if (/^<script>[\s\S]*<\/script>$/.test(t)) continue;   // bloc en ligne : légitime
      faux.push(`${p.htmlRel} — balise hors de la forme que le harnais inline : ${t.split("\n")[0].slice(0, 90)}`);
    }
    for (const t of p.balisesLien)
      if (!TAG_LIEN_STRICT.test(t))
        faux.push(`${p.htmlRel} — feuille hors de la forme que le harnais inline : ${t.slice(0, 90)}`);
    for (const f of [...p.scripts, ...p.feuilles])
      if (!existe(f)) faux.push(`${p.htmlRel} — charge ${f}, qui n'existe pas`);
    // Une balise COMMENTÉE est inlinée quand même : un exemple mis en
    // commentaire deviendrait un fichier chargé sous test, et sous test seul.
    for (const c of p.brut.match(/<!--[\s\S]*?-->/g) || [])
      if (/<script src="|<link rel="stylesheet" href="/.test(c))
        faux.push(`${p.htmlRel} — une balise en commentaire : le harnais l'inlinerait quand même`);
  }
  regle("R1 · les balises ont la forme exacte que le harnais inline, sans defer ni async", faux);
}

/* R2 — UN NOM DE HAUT NIVEAU, UNE SEULE FOIS PAR PAGE (§2, §9). `const` contre
   `const` LÈVE et les suites le voient ; `function` contre `function` ÉCRASE EN
   SILENCE — c'est cette moitié-là que la règle tient. */
{
  const faux = [];
  for (const p of PAGES) {
    const par = new Map();
    for (const s of p.sources)
      for (const n of declarationsDeHautNiveau(s.code))
        par.set(n, [...(par.get(n) || []), s.f]);
    for (const [n, fichiers] of par)
      if (fichiers.length > 1)
        faux.push(`${p.nom} — « ${n} » est déclaré en haut niveau par ${[...new Set(fichiers)].join(" et ")}`);
  }
  regle("R2 · deux fichiers d'une même page ne se disputent aucun nom de haut niveau", faux);
}

/* R3 — TOUTE `var(--x)` A UNE DÉFINITION (§2). Introuvable, elle rend la
   déclaration INVALIDE AU CALCUL : pour un raccourci, toutes les longhands sont
   vidées — pas de filet du tout, et aucune suite ne lit un style calculé. Les
   définitions se relèvent dans la feuille ET dans les scripts (§4.3). */
{
  const faux = [];
  for (const p of PAGES) {
    const cssNet = sansCommentairesCSS(p.css);
    const ailleurs = p.html + "\n" + p.sources.map(s => s.sansComm).join("\n");
    const definies = new Set([...varsDefinies(cssNet), ...varsDefinies(ailleurs)]);
    const employees = new Set([...varsEmployees(cssNet), ...varsEmployees(ailleurs)]);
    for (const v of employees) if (!definies.has(v)) faux.push(`${p.nom} — ${v} est employée, jamais définie`);
    for (const v of varsDefinies(cssNet)) if (!employees.has(v)) faux.push(`${p.nom} — ${v} est définie, jamais employée`);
  }
  regle("R3 · toute variable CSS employée est définie, et toute variable définie sert", faux);
}

/* R4 — UNE FAMILLE CSS A UN PORTEUR (§14). PAR JETON, jamais sur `class="…"`
   entier : un test plus strict ferait retirer une famille vivante, pire que d'en
   laisser une morte. */
{
  const faux = [];
  for (const p of PAGES) {
    const posees = classesPosees(p);
    for (const c of classesCSS(p.css)) if (!posees.has(c)) faux.push(`${p.nom} — la famille .${c} n'est portée par rien`);
  }
  regle("R4 · toute famille CSS d'une page est portée par un élément qu'elle engendre", faux);
}

/* R5 — UN `onclick` VISE UNE FONCTION QUI EXISTE (§2). Un gestionnaire renommé
   donne un bouton qui ne fait rien, sans un mot — d'où les `window.X = X`
   explicites de l'atelier. */
const MOTS_CLES = new Set(["if", "for", "while", "switch", "return", "typeof", "function", "catch", "do", "else", "new", "delete", "void"]);
{
  const faux = [];
  for (const p of PAGES) {
    const connus = nomsExposes(p);
    const vises = new Map();
    const recolter = (txt, ou) => {
      for (const h of txt.matchAll(/\bon[a-z]+\s*=\s*"([^"]*)"/g))
        for (const a of h[1].matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g))
          if (!MOTS_CLES.has(a[2])) vises.set(a[2], ou);
    };
    recolter(p.html, p.htmlRel);
    for (const s of p.sources) recolter(s.sansComm, s.f);
    for (const [n, ou] of vises)
      if (!connus.has(n)) faux.push(`${p.nom} — ${ou} vise ${n}(), que rien n'expose à la page`);
  }
  regle("R5 · tout gestionnaire d'événement vise une fonction que la page expose", faux);
}

/* R6 — UN ID VISÉ EXISTE, ET LE TUTORIEL VISE QUELQUE CHOSE (§2, §4.8).
   `majTutoriel` NE SE PLAINT JAMAIS d'une cible introuvable : seule une capture
   le prouvait. On contrôle par les sélecteurs mêmes que `tutoEtape` écrit. */
{
  const faux = [];
  for (const p of PAGES) {
    const dispo = new Set([...p.html.matchAll(/id="([\w-]+)"/g)].map(m => m[1]));
    for (const s of p.sources)                              // les ids ENGENDRÉS comptent aussi
      for (const m of s.sansComm.matchAll(/id="([\w-]+)"/g)) dispo.add(m[1]);
    const classes = classesPosees(p);

    for (const s of p.sources) {
      for (const m of s.sansComm.matchAll(/(?:\$|getElementById)\(\s*"([\w-]+)"\s*\)/g))
        if (!dispo.has(m[1])) faux.push(`${p.nom} — ${s.f} vise l'id #${m[1]}, qu'aucun élément ne porte`);
      // Les ancres du tutoriel : `ou:"#zoneRetenus"`, `ou:"#composeur button.envoi"`…
      for (const m of s.sansComm.matchAll(/\bou:\s*"([^"]+)"/g)) {
        const sel = m[1];
        for (const k of sel.matchAll(/#([\w-]+)/g))
          if (!dispo.has(k[1])) faux.push(`${p.nom} — le tutoriel vise « ${sel} » : aucun élément ne porte #${k[1]}`);
        for (const k of sel.matchAll(/\.([A-Za-z][\w-]*)/g))
          if (!classes.has(k[1])) faux.push(`${p.nom} — le tutoriel vise « ${sel} » : rien ne porte la classe .${k[1]}`);
      }
    }
  }
  regle("R6 · tout id visé existe, et les quatre ancres du tutoriel visent quelque chose", faux);
}

/* R7 — AUCUN RESTE DU SCHÉMA 2 (§2). La migration 2→3 avait été faite dans
   l'import, pas partout : `l.a[0]` levait une `TypeError` sur un chemin
   qu'aucune suite ne couvre. */
{
  const faux = [];
  for (const f of fichiersJS(TERRITOIRES)) {
    const { code } = decouperJS(lire(f));
    for (const m of code.matchAll(/\.[ab]\[/g)) {
      const ligne = code.slice(0, m.index).split("\n").length;
      faux.push(`${f}:${ligne} — « ${m[0]} » : écriture du schéma 2`);
    }
  }
  regle("R7 · plus rien ne déplie un lien du schéma 2", faux);
}

/* R8 — LA CARTE NE MENT PAS SUR LES TAILLES (§12). Tolérance : TROIS LIGNES,
   assez pour un commentaire retouché, pas pour un changement réel. Le message
   imprime le chiffre à écrire. */
{
  const faux = [];
  const carte = lire("docs/CARTE.md");
  const fichiersDe = rel => {
    if (!existe(rel)) return [];
    if (!fs.statSync(path.join(RACINE, rel)).isDirectory()) return [rel];
    return fs.readdirSync(path.join(RACINE, rel)).map(n => rel.replace(/\/$/, "") + "/" + n);
  };
  for (const ligne of carte.split("\n")) {
    const cellules = ligne.split("|").map(s => s.trim());
    if (cellules.length < 4 || !/^`app\//.test(cellules[1])) continue;
    const chemins = [...cellules[1].matchAll(/`([^`]+)`/g)].flatMap(m => fichiersDe(m[1]));
    if (!chemins.length) continue;
    // « 664 » ou « 156 + 257 (css) + 1808 (js) » : chaque nombre porte son
    // extension, la première étant celle du premier chemin de la ligne.
    const nombres = [...cellules[2].matchAll(/(\d+)\s*(?:\((css|js|html)\))?/g)];
    if (!nombres.length) continue;
    const parExt = {};
    for (const f of chemins) {
      const ext = path.extname(f).slice(1);
      parExt[ext] = (parExt[ext] || 0) + nbLignes(f);
    }
    for (const [i, m] of nombres.entries()) {
      const ext = m[2] || (i === 0 ? path.extname(chemins[0]).slice(1) : null);
      if (!ext || parExt[ext] === undefined) continue;
      if (Math.abs(parExt[ext] - Number(m[1])) > 3)
        faux.push(`docs/CARTE.md — ${cellules[1]} annonce ${m[1]} ligne(s) de ${ext}, il y en a ${parExt[ext]}`);
    }
  }
  regle("R8 · le tableau des territoires de docs/CARTE.md dit les tailles réelles", faux);
}

/* R9 — `attend`/`apres` NE SE LISENT PLUS SUR UNE REMISE (§3, §11). Sœur de R7 :
   l'ancienne écriture reste LISIBLE, donc une branche restée à `r.attend` répond
   « non » pour toujours sans que rien ne casse.
   QUATRE FONCTIONS y échappent, et seulement elles : les normalisateurs
   `attentesDe` (regles.js) et `attentesDeRemise` (noyau.js) — *on ne les fusionne
   pas, on dit lequel est lequel* — et les convertisseurs `attentesEditables`
   (frise.js) et `migrerContenu` (contenu-io.js).
   ELLE LIT DU TEXTE, PAS DES TYPES : est une remise un récepteur écrit `r`,
   `remise`, ou une indexation de `remises` — R9 rend cette convention de nommage
   contraignante. Les ÉCRITURES sont hors champ : c'est la LIRE qui est interdit. */
{
  const faux = [];
  const TOLERES = {
    "app/regles.js":             ["attentesDe"],
    "app/atelier/noyau.js":      ["attentesDeRemise"],
    "app/atelier/frise.js":      ["attentesEditables"],
    "app/atelier/contenu-io.js": ["migrerContenu"]
  };
  const estRemise = recv => recv === "r" || recv === "remise" || /remises(\[[^\]]*\])?$/.test(recv);
  // La fonction qui contient une position : la dernière déclarée avant elle.
  // Heuristique assumée — le gardien lit du texte (voir l'en-tête de R9).
  const fonctionEn = (code, i) => {
    const avant = [...code.slice(0, i).matchAll(/function\s+([A-Za-z_$][\w$]*)/g)];
    return avant.length ? avant[avant.length - 1][1] : "";
  };
  for (const f of fichiersJS(TERRITOIRES)) {
    if (f === "app/content.js") continue;                   // du contenu, pas du code
    const { code } = decouperJS(lire(f));
    const permis = TOLERES[f] || [];
    for (const m of code.matchAll(/([A-Za-z_$][\w$]*(?:\.[\w$]+|\[[^\]]*\])*)\.(attend|apres)\b\s*(=[^=]|\b)?/g)) {
      if (!estRemise(m[1])) continue;
      if (m[3] && m[3].startsWith("=")) continue;                       // une écriture
      if (/\bdelete\s+$/.test(code.slice(Math.max(0, m.index - 8), m.index))) continue;
      const nom = fonctionEn(code, m.index);
      if (permis.includes(nom)) continue;
      const ligne = code.slice(0, m.index).split("\n").length;
      faux.push(`${f}:${ligne} — « ${m[1]}.${m[2]} » dans ${nom || "(hors fonction)"} : `
              + `le tag vit sur l'ATTENTE (§3). Passer par attentesDe / attentesDeRemise.`);
    }
  }
  regle("R9 · plus rien ne lit « attend » ou « apres » posé sur une remise", faux);
}

/* R10 — AUCUNE RECOPIE D'UN PRÉDICAT QUE `regles.js` EXPORTE (§12, §16). Sœur de
   R2, un cran plus haut : R2 interdit de se disputer un NOM, R10 de réécrire une
   DÉCISION. Un prédicat recopié affirme l'ancienne vérité pour toujours, et les
   suites ne se lisent pas elles-mêmes.
   LE MOT EST ASSEMBLÉ : écrit en clair, ce fichier se dénoncerait lui-même — une
   règle qui doit s'exclure de son propre champ, on finit par la croire fausse. */
{
  const faux = [];
  const MAISON = "app/regles.js";                       // la seule maison (§12)
  const MOT = "règle";
  const MOTIF = new RegExp('includes\\(\\s*["\']' + MOT + '["\']\\s*\\)', "g");
  for (const f of fichiersJS(TERRITOIRES)) {
    if (f === MAISON || f === "app/content.js") continue;   // la maison, et de la prose
    const { sansComm } = decouperJS(lire(f));
    for (const m of sansComm.matchAll(MOTIF)) {
      const ligne = sansComm.slice(0, m.index).split("\n").length;
      faux.push(`${f}:${ligne} — « ${m[0]} » recopie le prédicat d'${MAISON} : `
              + `appeler estRegle (ReglesJeu.estRegle dans une page, require dans une suite).`);
    }
  }
  regle("R10 · aucun fichier ne recopie un prédicat que regles.js exporte", faux);
}

/* R11 — AUCUN RENVOI « §x » NE POINTE DANS LE VIDE (§12, §16 bis). Un renvoi
   mort ne casse rien, ne lève rien : il envoie lire une section qui n'existe
   pas, ou pire, une qui existe et parle d'autre chose.
   LES NUMÉROS SONT UNIQUES DANS TOUT LE DÉPÔT — §1 à §7 dans CONCEPTION.md,
   §8.x dans ECRITURE.md, §9 à §17 dans ARCHITECTURE.md : un renvoi n'a pas à
   nommer son fichier, et la règle vérifie qu'aucun numéro n'est servi deux fois.
   UNE EXCEPTION : `docs/PASSATION.md` numérote ses propres sections de 1 à 4 —
   on n'y juge que les renvois à deux niveaux et « §16 bis ». */
{
  const faux = [];
  const DOCS = ["docs/CONCEPTION.md", "docs/ECRITURE.md", "docs/ARCHITECTURE.md"];

  // Les sections réellement présentes : un titre Markdown « ## 4.5 … » ou, pour
  // ECRITURE, un paragraphe en gras « **8.6 … ». La valeur est le fichier, ce
  // qui fait tomber du même coup les numéros servis deux fois.
  const chez = new Map();
  for (const d of DOCS) {
    if (!existe(d)) { faux.push(`${d} est introuvable — les renvois « §x » n'ont plus de maison.`); continue; }
    const src = lire(d);
    const nums = [...src.matchAll(/^#+ (\d+(?:\.\d+)*(?: bis)?)\.? /gm)].map(m => m[1])
      .concat([...src.matchAll(/^\*\*(\d+\.\d+) /gm)].map(m => m[1]));
    for (const n of nums) {
      if (chez.has(n) && chez.get(n) !== d)
        faux.push(`« §${n} » existe dans ${chez.get(n)} ET dans ${d} — un numéro, un seul document.`);
      chez.set(n, d);
    }
  }

  // `§8.x` et `§4.x` sont des GABARITS de prose : le numéro y est suivi d'une
  // lettre, jamais d'un chiffre. Les compter reviendrait à lire la section « 8 »
  // toute seule, qui n'existe pas — R11 s'y est prise au premier essai.
  // (Et pour la même raison, aucun exemple de renvoi mort ne s'écrit ici avec
  //  son signe : cette règle lit sa propre prose, comme celle de tout le monde.)
  const MOTIF_REF = /§\s?(\d+(?:\.\d+)*)( bis)?(\.[a-zà-ÿ])?/g;
  const aJuger = [];
  for (const f of fichiersJS(TERRITOIRES).concat(fichiersJS(["grammaire"]))) aJuger.push([f, lire(f), false]);
  for (const p of ["app/index.html", "app/atelier_v3.html", "app/jeu.css", "app/atelier/atelier.css"])
    if (existe(p)) aJuger.push([p, lire(p), false]);
  for (const d of ["docs/CARTE.md", "docs/HISTORIQUE.md", "CLAUDE.md", ...DOCS])
    if (existe(d)) aJuger.push([d, lire(d), false]);
  if (existe("docs/PASSATION.md")) aJuger.push(["docs/PASSATION.md", lire("docs/PASSATION.md"), true]);

  for (const [f, src, maison] of aJuger) {
    for (const m of src.matchAll(MOTIF_REF)) {
      if (m[3]) continue;                          // un gabarit « §8.x », pas un renvoi
      const num = m[1] + (m[2] || "");
      // Un document ne se cite pas lui-même par son propre numéro de section.
      if (maison && !num.includes(".") && num !== "16 bis") continue;
      const ligne = src.slice(0, m.index).split("\n").length;
      if (!chez.has(num)) {
        faux.push(`${f}:${ligne} — « §${num} » ne désigne aucune section : `
                + `§1–§7 sont dans CONCEPTION.md, §8.x dans ECRITURE.md, §9–§17 dans ARCHITECTURE.md.`);
        continue;
      }
      /* LE RENVOI QUI NOMME SON FICHIER doit nommer le BON — le cas le plus
         traître, parce qu'il a l'air plus précis. LE NOM DOIT ÊTRE
         GRAMMATICALEMENT ADJACENT : une fenêtre de caractères lierait chaque
         numéro au mauvais voisin. Deux tournures reconnues, et deux seulement :

           docs/ARCHITECTURE.md §12      le nom, puis le numéro
           §4.4 de CONCEPTION            le numéro, une préposition, le nom

         Tout le reste est un renvoi NU — le cas ordinaire, et le bon. */
      const AVANT = /(?:docs\/)?(CONCEPTION|ECRITURE|ARCHITECTURE)(?:\.md)?`?\s*$/;
      const APRES = /^\s*[»)]?\s*(?:de|d'|dans|du)\s+`?(?:docs\/)?(CONCEPTION|ECRITURE|ARCHITECTURE)/;
      const nomme = src.slice(Math.max(0, m.index - 40), m.index).match(AVANT)
                 || src.slice(m.index + m[0].length, m.index + m[0].length + 40).match(APRES);
      if (!nomme) continue;                        // renvoi nu : le numéro suffit
      const attendu = "docs/" + nomme[1] + ".md";
      if (chez.get(num) !== attendu)
        faux.push(`${f}:${ligne} — « §${num} » est annoncé dans ${nomme[1]}, il vit dans `
                + `${chez.get(num).replace("docs/", "")}.`);
    }
  }
  regle("R11 · tout renvoi « §x » désigne une section qui existe, et une seule", faux);
}

bilan();

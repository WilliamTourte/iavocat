#!/usr/bin/env node
/* `npm run gardien` — les conventions que les suites ne voient pas (§16).
 * Six règles, six pannes réellement vécues. Les numéros gardent leurs trous :
 * cinq règles ont été retirées (var CSS non définie, famille CSS orpheline,
 * reste du schéma 2, carte de tailles menteuse, prédicat recopié), et renuméroter
 * casserait tout ce qui cite « Rn ».
 *
 *   R1  la forme des balises que le harnais doit reconnaître        §13
 *   R2  un nom de haut niveau, une seule fois par page              §9
 *   R5  un `onclick` vise une fonction qui existe
 *   R6  un id visé existe — et le tutoriel vise quelque chose       §4.8
 *   R9  `attend`/`apres` ne se lisent plus sur une remise           §11, §15
 *   R11 aucun renvoi « §x » ne pointe dans le vide                  §12
 *
 * TERRITOIRES : R9 marche sur `app/`, `tests/` ET `outils/`, R11 sur tout le
 * dépôt, documents compris ; les quatre autres sur les deux pages. Avant
 * d'ajouter une règle, demander SUR QUEL TERRITOIRE elle marche.
 *
 * Ce n'est pas une cinquième source de vérité (§12) : le jour où une règle et
 * son § divergent, c'est le § qui a raison. Zéro dépendance ; sortie 1 sur
 * écart ; dans `npm test`, APRÈS les suites.
 */
const fs   = require("fs");
const path = require("path");

const RACINE  = path.join(__dirname, "..");
const lire    = rel => fs.readFileSync(path.join(RACINE, rel), "utf8");
const existe  = rel => fs.existsSync(path.join(RACINE, rel));

/* Trois territoires : `tests/` et `outils/` REFLÈTENT les règles du jeu, et un
   reflet qui dérive ne se voit nulle part (§16). */
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

/* TROIS vues d'un source JS : `code` (tout blanchi sauf le code — on y compte
   les accolades, R2), `chaines` (classes CSS et HTML engendré, R6), `sansComm`
   (seule vue où un `onclick="…"` se lit d'un bloc, R5 et R6). Un `split` ne
   suffit pas : gabarits imbriqués, regex dont les accolades fausseraient la
   profondeur, commentaires qui citent du code. */
const MOTS_AVANT_REGEX = /(?:^|[^\w$.])(?:return|typeof|case|in|of|do|else|delete|void|instanceof|new|yield)$/;
function debutDeRegex(codeAvant) {
  const t = codeAvant.replace(/\s+$/, "");
  if (!t) return true;
  if ("(,=:[!&|?{};+-*%~^<>".includes(t[t.length - 1])) return true;
  return MOTS_AVANT_REGEX.test(t);
}
// -1 s'il ne se referme pas avant la fin de ligne : c'était une division.
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
      /* Blanchi, mais REND SES SAUTS DE LIGNE : R9 y compte les lignes. */
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
    // Même raison : sans les sauts de ligne, les lignes annoncées dérivent.
    if (c === "\n") code += c;
    g.txt += c; sansComm += c; i++;
  }
  return { code, chaines, sansComm };
}

/* Les déclarations à PROFONDEUR D'ACCOLADE ZÉRO — les seules qui prennent un
   nom dans la page ; sans le compte, une fermeture (§9) passerait pour une
   collision. `async` en tête compte comme une déclaration ordinaire. */
const DECLARATION = /(?:async\s+)?(function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/y;
function declarationsDeHautNiveau(code) {
  const noms = [];
  let prof = 0, precedent = "";
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (c === "{") { prof++; precedent = c; continue; }
    if (c === "}") { prof--; precedent = c; continue; }
    // Une déclaration ouvre une instruction : sans ce garde-fou, le `g` de
    // `const f = function g(){}` passerait pour un nom de haut niveau.
    if (prof === 0 && /[A-Za-z]/.test(c) && (precedent === "" || precedent === ";" || precedent === "}")) {
      DECLARATION.lastIndex = i;
      const m = DECLARATION.exec(code);
      if (m && m.index === i) {
        noms.push(m[2]);
        let j = DECLARATION.lastIndex;
        /* `let a=1, b=2;` déclare DEUX noms ; un nom manquant à l'inventaire
           est une collision que R2 ne verrait pas. */
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

/* ---- HTML --------------------------------------------------------------- */
const sansCommentairesHTML = s => s.replace(/<!--[\s\S]*?-->/g, "");

/* Les classes qu'une page POSE (R6) : un `class="…"`, et toute chaîne qui n'est
   QU'un mot. Pas tous les mots de toutes les chaînes — `content.js` est de la
   PROSE, et un gardien qui lit le contenu ne garde rien (§9). */
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

/* Tout se juge PAR PAGE : `escapeAttr` et `$` vivent dans `jeu.js` ET dans
   `noyau.js`, légitimement — jamais la même page. */
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

/* CE QU'UNE PAGE EXPOSE À ELLE-MÊME — lu par R5 et par `eslint.config.js`,
   dont les `globals` ne s'écrivent nulle part : ils se calculent (§12). */
function nomsExposes(page) {
  const noms = new Set();
  for (const s of page.sources) {
    for (const n of declarationsDeHautNiveau(s.code)) noms.add(n);
    for (const m of s.sansComm.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) noms.add(m[1]);
  }
  return noms;
}

/* Mode double : lancé il contrôle, `require` il ne rend que l'inventaire. */
module.exports = { PAGES, decouperJS, declarationsDeHautNiveau, nomsExposes };
if (require.main !== module) return;

console.log("Le gardien — les conventions que les suites ne voient pas.\n");

/* R1 — LA FORME DES BALISES (§13). Une balise déviante n'est PAS inlinée du
   tout : l'écart se dit ICI plutôt qu'en `ReferenceError` au milieu d'une
   suite. Plus deux cas : un fichier chargé qui n'existe pas, et une balise en
   commentaire — que le harnais inlinerait quand même. */
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
    // Une balise COMMENTÉE est inlinée quand même : un exemple mis de côté
    // deviendrait un fichier chargé sous test, et sous test seul.
    for (const c of p.brut.match(/<!--[\s\S]*?-->/g) || [])
      if (/<script src="|<link rel="stylesheet" href="/.test(c))
        faux.push(`${p.htmlRel} — une balise en commentaire : le harnais l'inlinerait quand même`);
  }
  regle("R1 · les balises ont la forme exacte que le harnais inline, sans defer ni async", faux);
}

/* R2 — UN NOM DE HAUT NIVEAU, UNE SEULE FOIS PAR PAGE (§9). `const` contre
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

/* R5 — UN `onclick` VISE UNE FONCTION QUI EXISTE : un gestionnaire renommé
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

/* R6 — UN ID VISÉ EXISTE, ET LE TUTORIEL VISE QUELQUE CHOSE (§4.8).
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

/* R9 — `attend`/`apres` NE SE LISENT PLUS SUR UNE REMISE (§11). L'ancienne
   écriture reste LISIBLE : une branche restée à `r.attend` répond « non » pour
   toujours sans que rien ne casse. QUATRE FONCTIONS y échappent, et seulement
   elles : `attentesDe`, `attentesDeRemise`, `attentesEditables`, `migrerContenu`.
   ELLE LIT DU TEXTE, PAS DES TYPES : est une remise un récepteur écrit `r`,
   `remise`, ou une indexation de `remises`. Les ÉCRITURES sont hors champ. */
{
  const faux = [];
  const TOLERES = {
    "app/regles.js":             ["attentesDe"],
    "app/atelier/noyau.js":      ["attentesDeRemise"],
    "app/atelier/frise.js":      ["attentesEditables"],
    "app/atelier/contenu-io.js": ["migrerContenu"]
  };
  const estRemise = recv => recv === "r" || recv === "remise" || /remises(\[[^\]]*\])?$/.test(recv);
  // Heuristique assumée : la fonction contenante est la dernière déclarée.
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

/* R11 — AUCUN RENVOI « §x » NE POINTE DANS LE VIDE (§12, §16). Un renvoi mort
   ne casse rien, ne lève rien : il envoie lire une section qui n'existe pas, ou
   pire, une qui existe et parle d'autre chose. LES NUMÉROS SONT UNIQUES DANS
   TOUT LE DÉPÔT — §1 à §8 dans CONCEPTION.md, §9 à §17 dans ARCHITECTURE.md.
   EXCEPTION : `docs/PASSATION.md` numérote ses propres sections, on n'y juge
   que les renvois à deux niveaux. */
{
  const faux = [];
  const DOCS = ["docs/CONCEPTION.md", "docs/ARCHITECTURE.md"];

  // Les sections présentes : un titre « ## 4.5 … », ou une ligne de table
  // « | **8.1** | … » (le §8). La valeur est le fichier, ce qui fait tomber du
  // même coup les numéros servis deux fois.
  const chez = new Map();
  for (const d of DOCS) {
    if (!existe(d)) { faux.push(`${d} est introuvable — les renvois « §x » n'ont plus de maison.`); continue; }
    const src = lire(d);
    const nums = [...src.matchAll(/^#+ (\d+(?:\.\d+)*)\.? /gm)].map(m => m[1])
      .concat([...src.matchAll(/^\|\s*\*\*(\d+\.\d+)\*\*\s*\|/gm)].map(m => m[1]));
    for (const n of nums) {
      if (chez.has(n) && chez.get(n) !== d)
        faux.push(`« §${n} » existe dans ${chez.get(n)} ET dans ${d} — un numéro, un seul document.`);
      chez.set(n, d);
    }
  }

  // `§8.x` et `§4.x` sont des GABARITS de prose : le numéro y est suivi d'une
  // lettre, jamais d'un chiffre. Les compter reviendrait à juger une section
  // « 8 » toute seule, qui n'existe pas.
  const MOTIF_REF = /§\s?(\d+(?:\.\d+)*)(\.[a-zà-ÿ])?/g;
  const aJuger = [];
  for (const f of fichiersJS(TERRITOIRES).concat(fichiersJS(["grammaire"]))) aJuger.push([f, lire(f), false]);
  for (const p of ["app/index.html", "app/atelier_v3.html", "app/jeu.css", "app/atelier/atelier.css"])
    if (existe(p)) aJuger.push([p, lire(p), false]);
  for (const d of ["CLAUDE.md", ...DOCS]) if (existe(d)) aJuger.push([d, lire(d), false]);
  if (existe("docs/PASSATION.md")) aJuger.push(["docs/PASSATION.md", lire("docs/PASSATION.md"), true]);

  for (const [f, src, maison] of aJuger) {
    for (const m of src.matchAll(MOTIF_REF)) {
      if (m[2]) continue;                          // un gabarit « §8.x », pas un renvoi
      const num = m[1];
      if (maison && !num.includes(".")) continue;  // le document ne se cite pas lui-même
      const ligne = src.slice(0, m.index).split("\n").length;
      if (!chez.has(num)) {
        faux.push(`${f}:${ligne} — « §${num} » ne désigne aucune section : `
                + `§1–§8 sont dans CONCEPTION.md, §9–§17 dans ARCHITECTURE.md.`);
        continue;
      }
      /* LE RENVOI QUI NOMME SON FICHIER doit nommer le BON — le cas le plus
         traître, parce qu'il a l'air plus précis. Deux tournures reconnues :
         « docs/ARCHITECTURE.md §12 » et « §4.4 de CONCEPTION » ; tout le reste
         est un renvoi NU, le cas ordinaire et le bon. */
      const AVANT = /(?:docs\/)?(CONCEPTION|ARCHITECTURE)(?:\.md)?`?\s*$/;
      const APRES = /^\s*[»)]?\s*(?:de|d'|dans|du)\s+`?(?:docs\/)?(CONCEPTION|ARCHITECTURE)/;
      const nomme = src.slice(Math.max(0, m.index - 40), m.index).match(AVANT)
                 || src.slice(m.index + m[0].length, m.index + m[0].length + 40).match(APRES);
      if (!nomme) continue;
      const attendu = "docs/" + nomme[1] + ".md";
      if (chez.get(num) !== attendu)
        faux.push(`${f}:${ligne} — « §${num} » est annoncé dans ${nomme[1]}, il vit dans `
                + `${chez.get(num).replace("docs/", "")}.`);
    }
  }
  regle("R11 · tout renvoi « §x » désigne une section qui existe, et une seule", faux);
}

bilan();

// Le moteur de la grammaire, en mode double (`require` ou `<script src>`).
// Aucune donnée : on reçoit GRAMMAIRE / CHAMPS / LIENS / DISCORDANCES et on rend
// les fonctions pures qui composent, valident et reconnaissent une phrase (§14).
function creerMoteur(GRAMMAIRE, CHAMPS, LIENS, DISCORDANCES) {
  const G = GRAMMAIRE;
  const C = Object.fromEntries(CHAMPS.map(c => [c.id, c]));
  const estFinal = e => G.finaux.includes(e);
  const offerts = e => G.blocs.filter(b => b.de === e);

  /* ---- LA VÉRIFICATION (§4.5) ---- depuis la passe G, le joueur déclare la
     relation et le moteur la vérifie : `deduire` est l'oracle, il ne rédige plus
     — sauf pour un contenu d'avant, dont le second terme porte encore `deduit`
     (§11). La relation VRAIE se tire du DOSSIER pour les deux relations de la
     passe N — concordent / ne concordent pas —, des valeurs pour les formes
     d'avant. */
  const enNombre = v => {
    const s = String(v == null ? "" : v).trim();
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  };
  function comparer(a, b) {
    const x = enNombre(a), y = enNombre(b);
    if (x !== null && y !== null) return x < y ? -1 : x > y ? 1 : 0;
    const sa = String(a), sb = String(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  }
  /* LE DOSSIER DÉCLARE SES DISCORDANCES, TOUT LE RESTE CONCORDE (§4.2, passe N).
     Une heure ne dit pas ce qu'elle contredit : 21h52 et 22h04 diffèrent et
     concordent. PIÈGE PAYÉ (l'essai du 8 octobre) : le verdict vivait dans les
     liens, et changer la relation d'un lien changeait le fait sans que rien le
     dise — il vit à part, et un lien qui le contredit est faux. */
  const clePaire = (x, y) => [String(x), String(y)].sort().join("|");
  const DISC = new Set((DISCORDANCES || []).filter(p => Array.isArray(p) && p.length === 2)
                                           .map(([x, y]) => clePaire(x, y)));
  const discorde = (idA, idB) => DISC.has(clePaire(idA, idB));
  const parDossier = f => f.deduction === "concordance" || f.deduction === "discordance";
  // La forme qui lie deux empans. L'ORDRE de déclaration tranche les ambiguïtés
  // (§11). Dimensions différentes : la JUXTAPOSITION si le contenu en déclare
  // une, sinon null (§4.11) — ce sont les règles qui la refusent en session 1.
  // PIÈGE : elle n'entre jamais dans la boucle — déclarée plus haut, elle
  // passerait pour une « différence » entre deux passages de même dimension.
  const estJuxta = f => f.deduction === "juxtaposition" && (f.arite || 2) === 2;
  function deduire(idA, idB) {
    const a = C[idA], b = C[idB];
    if (!a || !b || idA === idB) return null;
    if (a.dim !== b.dim)
      return (Object.entries(G.formes).find(([, f]) => estJuxta(f)) || [null])[0];
    const egal = comparer(a.valeur, b.valeur) === 0;
    for (const [nom, f] of Object.entries(G.formes)) {
      if (!f.deduction || (f.arite || 2) !== 2 || estJuxta(f)) continue;
      const s = f.slots && f.slots[0];
      if (s !== "*" && !(s || []).includes(a.dim)) continue;
      const vrai = parDossier(f) ? (f.deduction === "discordance") === discorde(idA, idB)
                                 : (f.deduction === "egalite" ? egal : !egal);
      if (vrai) return nom;
    }
    return null;
  }
  /* LES DEUX RELATIONS D'UNE DIMENSION (passe G) : de chaque côté — égalité ou
     concordance, puis différence, ordre ou discordance —, la PREMIÈRE forme
     déclarée qui la nomme, celle que `deduire` rendrait. La vraie est donc
     toujours l'une des deux. */
  const nomme = (f, d) => !!f.deduction && !estJuxta(f) && (f.arite || 2) === 2 && !!f.slots
    && (f.slots[0] === "*" || (f.slots[0] || []).includes(d));
  function relationsDe(d) {
    const fs = Object.entries(G.formes);
    const positif = f => f.deduction === "egalite" || f.deduction === "concordance";
    const egal = fs.find(([, f]) => nomme(f, d) && positif(f));
    const autre = fs.find(([, f]) => nomme(f, d) && !positif(f));
    return [egal, autre].filter(Boolean).map(([nom]) => nom);
  }
  /* UNE RELATION FAUSSE : une comparaison, emboîtée ou non, dont la forme n'est
     pas la vraie — celle du dossier, ou des valeurs. Elle part, et l'avocat la
     refuse (§4.5). */
  function fausse(r) {
    if (!r || typeof r !== "object") return false;
    const f = G.formes[r.forme] || {};
    const t = r.termes || [];
    if (f.deduction && !estJuxta(f) && (f.arite || 2) === 2 && t.length === 2
        && t.every(x => typeof x === "string") && deduire(t[0], t[1]) !== r.forme) return true;
    return t.some(x => typeof x === "object" && fausse(x));
  }
  function ordonner(forme, termes) {
    const f = G.formes[forme];
    if (!f || !f.ordonne || termes.length !== 2) return termes;
    if (termes.some(t => typeof t === "object" || !C[t])) return termes;
    const [x, y] = termes;
    const inverser = (f.sens || "asc") === "asc"
      ? comparer(C[x].valeur, C[y].valeur) > 0
      : comparer(C[x].valeur, C[y].valeur) < 0;
    return inverser ? [y, x] : [x, y];
  }

  // Une chaîne de blocs → sa forme réduite. Un bloc `relation` pose la forme que
  // le joueur a CHOISIE (passe G) ; `deduit` la fait DÉDUIRE des deux termes (un
  // contenu d'avant) ; `imbrique` EMBOÎTE ce qui précède. Sans aucun : la
  // dernière forme gagne, termes à plat (§11).
  function reduire(ch) {
    let termes = [], forme = null;
    for (const p of ch) {
      const b = p.bloc;
      if (b.type === "terme") termes.push(p.valeur);
      if (b.deduit || b.type === "relation") {
        forme = termes.length === 2 ? (b.deduit ? deduire(termes[0], termes[1]) : p.valeur || null) : null;
        if (forme) termes = ordonner(forme, termes);
      } else if (b.forme) {
        if (b.imbrique) termes = [{ forme, termes }];
        forme = b.forme;
      }
    }
    return { forme, termes };
  }
  const dimDe = t => (typeof t === "object" ? "affirmation" : C[t].dim);
  function valider(r) {
    const f = G.formes[r.forme];
    if (!f) return "ces deux-là ne se comparent pas";
    if (r.termes.length !== f.arite) return "arité";
    for (let i = 0; i < r.termes.length; i++) {
      const s = f.slots[i], d = dimDe(r.termes[i]);
      if (s !== "*" && !s.includes(d)) return `slot ${i} refuse « ${d} »`;
      // PIÈGE : un terme EMBOÎTÉ doit tenir pour lui-même — « affirmation » est
      // une catégorie que tout objet satisfait, et la qualification est le seul
      // chemin de clôture (§4.5).
      if (typeof r.termes[i] === "object") {
        const err = valider(r.termes[i]);
        if (err) return err;
      }
    }
    if (f.relation === "meme_dim") {
      const ds = r.termes.map(dimDe);
      if (new Set(ds).size !== 1) return "dimensions différentes";
      if (r.termes[0] === r.termes[1]) return "terme répété";
    }
    return null;
  }
  const memeTerme = (a, b) => (typeof a === "object" || typeof b === "object")
    ? (typeof a === "object" && typeof b === "object" && memeRed(a, b))
    : a === b;
  function memeRed(x, y) {
    if (x.forme !== y.forme || x.termes.length !== y.termes.length) return false;
    const f = G.formes[x.forme];
    if (f.ordonne) return x.termes.every((t, i) => memeTerme(t, y.termes[i]));
    return x.termes.every(t => y.termes.some(u => memeTerme(t, u)))
        && y.termes.every(t => x.termes.some(u => memeTerme(t, u)));
  }
  const lienDe = r => LIENS.find(l => memeRed({ forme: l.forme, termes: l.termes }, r));
  const nomDe = v => (C[v] ? (C[v].nom || C[v].texte) : String(v));
  const citeDe = v => {
    const c = C[v]; if (!c) return String(v);
    return (c.nom || c.texte) + " : « " + c.texte + " »" + (c.court ? " (" + c.court + ")" : "");
  };
  function rendre(ch) {
    let bouts = [], termes = [], forme = null;
    for (const p of ch) {
      const b = p.bloc;
      // PIÈGE : un bloc peut être terme ET `deduit` — les deux traitements
      // s'enchaînent, jamais l'un ou l'autre.
      if (b.type === "terme") {
        termes.push(p.valeur);
        bouts.push(b.source === "note" ? b.texte : nomDe(p.valeur));
      } else if (b.texte) bouts.push(b.texte);
      if (b.deduit || b.type === "relation") {
        forme = termes.length === 2 ? (b.deduit ? deduire(termes[0], termes[1]) : p.valeur || null) : null;
        const f = forme && G.formes[forme];
        if (f && f.patron) {
          const ord = ordonner(forme, termes);
          bouts.splice(bouts.length - 2, 2,
            f.patron.replace("{a}", nomDe(ord[0])).replace("{b}", nomDe(ord[1])));
          termes = ord;
        }
      } else if (b.forme) {
        // PIÈGE : le flag est porté par la LIAISON, jamais par le terme — la
        // voie de comparaison partage le même bloc de premier terme.
        if (b.cite && termes.length === 1 && typeof termes[0] === "string")
          bouts.splice(bouts.length - 1, 1, citeDe(termes[0]));
        if (b.imbrique) termes = [{ forme, termes }];
        forme = b.forme;
      }
    }
    return bouts.filter(t => t != null && t !== "")
      .reduce((acc, t) => acc + (acc && !/^[,;:.…]/.test(t) ? " " : "") + t, "") + ".";
  }
  function squelettes() {
    const out = [];
    (function m(e, acc) { if (estFinal(e)) return out.push(acc);
      for (const b of offerts(e)) m(b.vers, [...acc, b]); })(G.depart, []);
    return out;
  }
  return { C, estFinal, offerts, reduire, dimDe, valider, memeTerme, memeRed, lienDe, rendre,
           squelettes, comparer, deduire, ordonner, relationsDe, fausse, discorde };
}

const _projections = (function () {

/* PIÈGE : le passage d'un ARTICLE n'est pas un champ (§11, passe F) — ni
   dimension ni valeur, jamais un terme. `champsDe` ne le rend pas : le moteur
   ne le voit jamais, et aucune boucle « par dimension » n'a à l'écarter.
   `articlesDe` le rend, pour l'écran et l'atelier. */
const projeter = (contenu, garder) => {
  const out = [];
  for (const [pid, p] of Object.entries((contenu || {}).pieces || {}))
    for (const [eid, e] of Object.entries(p.empans || {}))
      if (garder(e))
        out.push({ id: pid + "." + eid, pid, eid, dim: e.dim, valeur: e.valeur,
                   texte: e.texte, nom: e.nom || e.texte, qui: e.qui || p.qui || "",
                   court: p.court || "" });
  return out;
};
const champsDe   = contenu => projeter(contenu, e => !e.article);
const articlesDe = contenu => projeter(contenu, e => !!e.article);

function comparaisonsDe(liens, formes) {
  const out = [], vus = new Set();
  const rec = t => {
    if (!t || typeof t !== "object" || Array.isArray(t)) return;
    if (t.forme && (((formes || {})[t.forme] || {}).arite || 2) === 2) {
      const cle = JSON.stringify([t.forme, t.termes]);
      if (!vus.has(cle)) { vus.add(cle); out.push({ forme: t.forme, termes: t.termes }); }
    }
    for (const u of (t.termes || [])) rec(u);
  };
  for (const L of (liens || [])) rec(L);
  return out;
}

/* La dimension se lit par la couleur ET par le trait, au même rang (§4.3,
   §4.10). PIÈGE PAYÉ : l'ancienne palette opposait un rouge (qui) à un vert
   (où) et un bleu à un mauve — indiscernables sous deutéranopie. Celle-ci n'a
   plus de rouge ; elle a été choisie à la mesure (distance OKLab minimale
   entre paires, en vision normale et sous trois déficiences simulées), sur le
   fond sombre comme sur le papier des pièces, où `jeu.css` la fonce. */
const PALETTE_DIM = ["#5ab4ea", "#f0a020", "#2fbf8f", "#e8dc5a", "#d886b6", "#c8ccd2"];
const TRAITS_DIM  = ["solid", "double", "dotted", "dashed", "wavy"];
function couleurDim(dimensions, d) {
  const i = (dimensions || []).indexOf(d);
  return i < 0 ? null : PALETTE_DIM[i % PALETTE_DIM.length];
}
function traitDim(dimensions, d) {
  const i = (dimensions || []).indexOf(d);
  return i < 0 ? null : TRAITS_DIM[i % TRAITS_DIM.length];
}

  return { champsDe, articlesDe, comparaisonsDe, couleurDim, traitDim, PALETTE_DIM, TRAITS_DIM };
})();

const _api = { creerMoteur, ..._projections };
if (typeof module !== "undefined" && module.exports) module.exports = _api;
if (typeof window !== "undefined") window.MoteurGrammaire = _api;

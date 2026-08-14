// Le moteur de la grammaire, en mode double (`require` ou `<script src>`).
// Aucune donnée : on reçoit GRAMMAIRE / CHAMPS / LIENS et on rend les fonctions
// pures qui composent, valident et reconnaissent une phrase (§14).
function creerMoteur(GRAMMAIRE, CHAMPS, LIENS) {
  const G = GRAMMAIRE;
  const C = Object.fromEntries(CHAMPS.map(c => [c.id, c]));
  const estFinal = e => G.finaux.includes(e);
  const offerts = e => G.blocs.filter(b => b.de === e);

  /* ---- LA DÉDUCTION (§4.5) ---- la relation se calcule de la dimension et des
     valeurs : le joueur désigne, il ne déclare plus. */
  // Une valeur en nombre quand elle en est un (« 22:04 » compris), sinon null.
  // Volontairement fruste : une valeur est un jeton de contenu, pas un type.
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
  // La forme qui lie deux empans, ou null (dimensions différentes → null, le seul
  // refus qui existe). L'ORDRE de déclaration tranche les ambiguïtés (§11).
  function deduire(idA, idB) {
    const a = C[idA], b = C[idB];
    if (!a || !b || idA === idB || a.dim !== b.dim) return null;
    const egal = comparer(a.valeur, b.valeur) === 0;
    for (const [nom, f] of Object.entries(G.formes)) {
      if (!f.deduction || (f.arite || 2) !== 2) continue;
      const s = f.slots && f.slots[0];
      if (s !== "*" && !(s || []).includes(a.dim)) continue;
      if (f.deduction === "egalite" ? egal : !egal) return nom;
    }
    return null;
  }
  // Les deux termes rangés selon le `sens` (« asc » par défaut). Sans effet sur
  // une forme non ordonnée : `memeRed` y ignore l'ordre.
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

  // Une chaîne de blocs → sa forme réduite. `deduit` fait DÉDUIRE la forme des
  // deux termes ; `imbrique` EMBOÎTE ce qui précède (§4.5). Sans l'un ni l'autre :
  // la dernière forme gagne, termes à plat (§11).
  function reduire(ch) {
    let termes = [], forme = null;
    for (const p of ch) {
      const b = p.bloc;
      if (b.type === "terme") termes.push(p.valeur);
      if (b.deduit) {
        forme = termes.length === 2 ? deduire(termes[0], termes[1]) : null;
        if (forme) termes = ordonner(forme, termes);
      } else if (b.forme) {
        if (b.imbrique) termes = [{ forme, termes }];
        forme = b.forme;
      }
    }
    return { forme, termes };
  }
  const dimDe = t => (typeof t === "object" ? "affirmation" : C[t].dim);
  // → null si la phrase est sensée (catégories respectées), sinon la raison.
  function valider(r) {
    const f = G.formes[r.forme];
    // Aucune forme : la déduction n'a rien trouvé (§4.5).
    if (!f) return "ces deux-là ne se comparent pas";
    if (r.termes.length !== f.arite) return "arité";
    for (let i = 0; i < r.termes.length; i++) {
      const s = f.slots[i], d = dimDe(r.termes[i]);
      if (s !== "*" && !s.includes(d)) return `slot ${i} refuse « ${d} »`;
      // Un terme EMBOÎTÉ doit tenir pour lui-même : « affirmation » est une
      // catégorie que tout objet satisfait, et la qualification est le seul
      // chemin de clôture (§4.5, §14).
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
  // Le lien du contenu que la phrase reconnaît (ou undefined : bruit sensé).
  const lienDe = r => LIENS.find(l => memeRed({ forme: l.forme, termes: l.termes }, r));
  // La chaîne → le texte français : un empan s'écrit par son `nom` (§4.1), rien
  // ne s'insère devant une ponctuation, et une forme déduite écrit d'un bloc par
  // son `patron` — seul endroit où l'accord se joue (§8.8 de docs/ECRITURE.md).
  const nomDe = v => (C[v] ? (C[v].nom || C[v].texte) : String(v));
  // Une liaison `cite` écrit l'empan qui précède DEUX FOIS — nom, citation,
  // pièce (§4.1).
  const citeDe = v => {
    const c = C[v]; if (!c) return String(v);
    return (c.nom || c.texte) + " : « " + c.texte + " »" + (c.court ? " (" + c.court + ")" : "");
  };
  function rendre(ch) {
    let bouts = [], termes = [], forme = null;
    for (const p of ch) {
      const b = p.bloc;
      // Un bloc peut être terme ET `deduit` — le second empan clôt la paire :
      // les deux traitements s'enchaînent, jamais l'un ou l'autre.
      if (b.type === "terme") {
        termes.push(p.valeur);
        bouts.push(b.source === "note" ? b.texte : nomDe(p.valeur));
      } else if (b.texte) bouts.push(b.texte);
      if (b.deduit) {
        forme = termes.length === 2 ? deduire(termes[0], termes[1]) : null;
        const f = forme && G.formes[forme];
        if (f && f.patron) {
          // Les deux derniers fragments SONT les termes : un automate à
          // déduction ne place aucune liaison entre eux.
          const ord = ordonner(forme, termes);
          bouts.splice(bouts.length - 2, 2,
            f.patron.replace("{a}", nomDe(ord[0])).replace("{b}", nomDe(ord[1])));
          termes = ord;
        }
      } else if (b.forme) {
        // Le flag est porté par la LIAISON, jamais par le terme : la voie de
        // comparaison partage le même bloc de premier terme (§14).
        if (b.cite && termes.length === 1 && typeof termes[0] === "string")
          bouts.splice(bouts.length - 1, 1, citeDe(termes[0]));
        if (b.imbrique) termes = [{ forme, termes }];
        forme = b.forme;
      }
    }
    return bouts.filter(t => t != null && t !== "")
      .reduce((acc, t) => acc + (acc && !/^[,;:.…]/.test(t) ? " " : "") + t, "") + ".";
  }
  // Tous les squelettes de phrase (chemins de l'automate, départ → final).
  function squelettes() {
    const out = [];
    (function m(e, acc) { if (estFinal(e)) return out.push(acc);
      for (const b of offerts(e)) m(b.vers, [...acc, b]); })(G.depart, []);
    return out;
  }
  return { C, estFinal, offerts, reduire, dimDe, valider, memeTerme, memeRed, lienDe, rendre,
           squelettes, comparer, deduire, ordonner };
}

/* LES PROJECTIONS DU CONTENU — pures, sans fabrique : on passe un contenu, on
   reçoit une vue. C'est leur seule maison (§12, §14), et ce ne sont pas des
   DONNÉES. ELLES SONT CLOÎTRÉES, et il le faut : on ne sort que par
   `MoteurGrammaire.x` (§9). */
const _projections = (function () {

/* Les empans aplatis en « pid.eid » : exactement l'argument CHAMPS que
   `creerMoteur` attend. `nom` porte la phrase composée (§4.1), `court` dit d'où
   sort une citation (§4.5). */
function champsDe(contenu) {
  const out = [];
  for (const [pid, p] of Object.entries((contenu || {}).pieces || {}))
    for (const [eid, e] of Object.entries(p.empans || {}))
      out.push({ id: pid + "." + eid, pid, eid, dim: e.dim, valeur: e.valeur,
                 texte: e.texte, nom: e.nom || e.texte, qui: e.qui || p.qui || "",
                 court: p.court || "" });
  return out;
}

/* Les COMPARAISONS (arité 2), emboîtées comprises : l'article étant obligatoire,
   elles vivent en terme emboîté — et on ne suppose pas laquelle des deux
   écritures l'affaire emploie (§14). */
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

/* La couleur d'une dimension : par son RANG, jamais par sa pertinence (§4.3).
   `null` si inconnue — à l'appelant d'en décider : le jeu grise, l'atelier
   signale en rouge. */
const PALETTE_DIM = ["#7fb3d5", "#d99a9a", "#9dc98c", "#c9ab6a", "#b79ad6", "#7fc9c1"];
function couleurDim(dimensions, d) {
  const i = (dimensions || []).indexOf(d);
  return i < 0 ? null : PALETTE_DIM[i % PALETTE_DIM.length];
}

  return { champsDe, comparaisonsDe, couleurDim, PALETTE_DIM };
})();

const _api = { creerMoteur, ..._projections };
if (typeof module !== "undefined" && module.exports) module.exports = _api;
if (typeof window !== "undefined") window.MoteurGrammaire = _api;

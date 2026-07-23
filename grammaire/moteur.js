// Le moteur de la grammaire — partagé par le banc d'essai (Node) et
// l'atelier (navigateur). Mode double : `require` ou `<script src>`.
// Aucune donnée ici : on reçoit GRAMMAIRE / CHAMPS / LIENS et on rend les
// fonctions pures qui composent, valident et reconnaissent une phrase.
function creerMoteur(GRAMMAIRE, CHAMPS, LIENS) {
  const G = GRAMMAIRE;
  const C = Object.fromEntries(CHAMPS.map(c => [c.id, c]));
  const estFinal = e => G.finaux.includes(e);
  const offerts = e => G.blocs.filter(b => b.de === e);

  // Une chaîne de blocs choisis → sa forme réduite {forme, termes}.
  function reduire(ch) {
    const termes = ch.filter(p => p.bloc.type === "terme").map(p => p.valeur);
    const forme = ch.map(p => p.bloc.forme).filter(Boolean).pop() || null;
    return { forme, termes };
  }
  const dimDe = t => (typeof t === "object" ? "affirmation" : C[t].dim);
  // → null si la phrase est sensée (catégories respectées), sinon la raison.
  function valider(r) {
    const f = G.formes[r.forme];
    if (r.termes.length !== f.arite) return "arité";
    for (let i = 0; i < r.termes.length; i++) {
      const s = f.slots[i], d = dimDe(r.termes[i]);
      if (s !== "*" && !s.includes(d)) return `slot ${i} refuse « ${d} »`;
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
  // La chaîne de blocs → le texte français de la phrase.
  function rendre(ch) {
    return ch.map(p => p.bloc.type === "terme"
      ? (p.bloc.source === "note" ? p.bloc.texte : C[p.valeur].texte)
      : p.bloc.texte).join(" ") + ".";
  }
  // Tous les squelettes de phrase (chemins de l'automate, départ → final).
  function squelettes() {
    const out = [];
    (function m(e, acc) { if (estFinal(e)) return out.push(acc);
      for (const b of offerts(e)) m(b.vers, [...acc, b]); })(G.depart, []);
    return out;
  }
  return { C, estFinal, offerts, reduire, dimDe, valider, memeTerme, memeRed, lienDe, rendre, squelettes };
}

const _api = { creerMoteur };
if (typeof module !== "undefined" && module.exports) module.exports = _api;
if (typeof window !== "undefined") window.MoteurGrammaire = _api;

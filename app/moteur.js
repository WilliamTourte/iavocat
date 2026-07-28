// Le moteur de la grammaire — partagé par le banc d'essai (Node) et
// l'atelier (navigateur). Mode double : `require` ou `<script src>`.
// Aucune donnée ici : on reçoit GRAMMAIRE / CHAMPS / LIENS et on rend les
// fonctions pures qui composent, valident et reconnaissent une phrase.
function creerMoteur(GRAMMAIRE, CHAMPS, LIENS) {
  const G = GRAMMAIRE;
  const C = Object.fromEntries(CHAMPS.map(c => [c.id, c]));
  const estFinal = e => G.finaux.includes(e);
  const offerts = e => G.blocs.filter(b => b.de === e);

  /* ---- LA DÉDUCTION (§4.5) --------------------------------------------
     La relation entre deux empans n'est pas une thèse, c'est un fait : elle
     se calcule de leur dimension et de leurs valeurs. Le joueur désigne, il
     ne déclare plus. -------------------------------------------------- */
  // Une valeur en nombre quand elle en est un — « 22:04 » compris. Sinon null.
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
  // La forme qui lie deux empans, ou null. Dimensions différentes → null, et
  // c'est le seul refus qui existe. L'ORDRE de déclaration des formes tranche
  // les ambiguïtés : la première qui accepte la dimension et dont le prédicat
  // tient l'emporte (§11).
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
  // Les deux termes rangés selon le `sens` de la forme (« asc » par défaut).
  // Sans effet sur une forme non ordonnée : `memeRed` y ignore déjà l'ordre.
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

  // Une chaîne de blocs choisis → sa forme réduite {forme, termes}.
  // Un bloc `deduit` fait DÉDUIRE la forme des deux termes accumulés.
  // Un bloc `imbrique` EMBOÎTE ce qui a été composé jusque-là comme terme unique
  // de sa propre forme — c'est la continuation (§4.5) : « a et b désignent la
  // même chose » + « , au regard de l'article 7 ». Sans ni l'un ni l'autre,
  // le comportement est celui d'avant : la dernière forme gagne, termes à plat.
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
    // Aucune forme : la déduction n'a rien trouvé. Le message ne dit rien de
    // plus que ce que l'écran disait déjà (§4.5).
    if (!f) return "ces deux-là ne se comparent pas";
    if (r.termes.length !== f.arite) return "arité";
    for (let i = 0; i < r.termes.length; i++) {
      const s = f.slots[i], d = dimDe(r.termes[i]);
      if (s !== "*" && !s.includes(d)) return `slot ${i} refuse « ${d} »`;
      // Un terme EMBOÎTÉ doit tenir pour lui-même. Sans ce contrôle, qualifier
      // une comparaison bancale la blanchirait : « affirmation » est une
      // catégorie que tout objet satisfait, y compris le vide. Depuis que
      // l'article est obligatoire (§4.5), c'est le seul chemin de clôture —
      // donc le seul endroit où la catégorie peut encore trancher.
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
  // La chaîne de blocs → le texte français de la phrase. Un empan s'y écrit par
  // son `nom` (« l'heure des éclats de voix »), pas par sa citation — §4.1 ;
  // et rien ne s'insère devant une ponctuation, pour que la continuation se
  // recolle proprement (§8.8).
  // Une forme déduite écrit sa phrase d'un bloc, par son `patron` — c'est le
  // seul endroit où l'accord se joue (§8.8).
  const nomDe = v => (C[v] ? (C[v].nom || C[v].texte) : String(v));
  // Une liaison `cite` fait écrire l'empan qui la précède DEUX FOIS : son nom,
  // puis sa citation, puis la pièce d'où elle sort. C'est le seul endroit où un
  // empan se lit deux fois dans une même phrase (§4.1) — répondre à une
  // question, c'est citer, et une citation dit d'où elle vient (§4.5).
  const citeDe = v => {
    const c = C[v]; if (!c) return String(v);
    return (c.nom || c.texte) + " : « " + c.texte + " »" + (c.court ? " (" + c.court + ")" : "");
  };
  function rendre(ch) {
    let bouts = [], termes = [], forme = null;
    for (const p of ch) {
      const b = p.bloc;
      // Un bloc peut être terme ET `deduit` : c'est le second empan qui clôt
      // la paire. Les deux traitements s'enchaînent, jamais l'un ou l'autre.
      if (b.type === "terme") {
        termes.push(p.valeur);
        bouts.push(b.source === "note" ? b.texte : nomDe(p.valeur));
      } else if (b.texte) bouts.push(b.texte);
      if (b.deduit) {
        forme = termes.length === 2 ? deduire(termes[0], termes[1]) : null;
        const f = forme && G.formes[forme];
        if (f && f.patron) {
          // Les deux derniers fragments SONT les deux termes : un automate à
          // déduction ne place aucune liaison entre eux.
          const ord = ordonner(forme, termes);
          bouts.splice(bouts.length - 2, 2,
            f.patron.replace("{a}", nomDe(ord[0])).replace("{b}", nomDe(ord[1])));
          termes = ord;
        }
      } else if (b.forme) {
        // Symétrique du patron ci-dessus : le fragment du terme qui précède est
        // réécrit d'un bloc. Le flag est porté par la LIAISON et non par le
        // terme, pour que la voie de comparaison — qui partage le même bloc de
        // premier terme — reste strictement intacte.
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

const _api = { creerMoteur };
if (typeof module !== "undefined" && module.exports) module.exports = _api;
if (typeof window !== "undefined") window.MoteurGrammaire = _api;

// Les RÈGLES DU JEU — pures, sans DOM, sans localStorage, sans fenêtre.
// Mode double : `require` (tests, banc) ou `<script src>` (jeu, atelier) ; le
// pas-à-pas les APPELLE au lieu de les recopier (§12).
// Convention : chaque fonction reçoit `S` en premier argument et le modifie sur
// place ; aucune ne rend de HTML ; celles qui « parlent » poussent dans `S.fil`.
function creerRegles(JEU, M) {

  /* ---- L'ÉTAT (§4.6) ------------------------------------------------ */
  function etatInitial() { return {
    fil: [],                      // le canal : {qui, texte, pieces[], ia}
    examinees: [],                // pièces ouvertes au moins une fois
    remisesEnvoyees: 0,
    retenus: [],                  // PRIVÉ — ["pid.eid"] dans l'ordre de surlignage
    compo: [],                    // la phrase en cours — [{bloc:id, valeur}]
    refus: null,                  // le dernier refus de catégorie, à afficher
    brouillon: [],                // PRIVÉ — journal des phrases closes, sans zone
                                  //   à lui : {reduite, texte, lien|null, versee}
    prete: null,                  // PRIVÉ — index, dans le journal, de la phrase
                                  //   qui attend sur place (§4.7)
    plaidoirie: [],               // TRANSMIS — {b:index journal, contre:index affirmation|null}
    satisfaits: [],               // tags d'attente déjà servis
    vice_pressenti: false,        // la comparaison ⚑ s'est formée au composeur
    vice_trouve: false,           // la conclusion ⚑ est composée
    vice_expose: false,           // la conclusion ⚑ est envoyée
    clotureDemandee: false,
    repetitionIdx: -1,
    declenches: [],               // pièces dont le `declenche` une_fois a joué
    inutiles: 0, incompris: 0,    // compteurs d'agacement de l'avocat
    hors_sujet: 0,                // …et celui des citations qui ne répondent pas
    modalPiece: null
  }; }

  function signatureContenu() {
    const s = JSON.stringify(JEU); let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ---- Le canal ----------------------------------------------------- */
  const pousser = (S, qui, texte, pieces, ia) =>
    S.fil.push({ qui, texte, pieces: pieces || [], ia: !!ia });

  /* Seul normalisateur du jeu (R9) : l'ancienne forme se lit comme une liste à
     un élément (§11). */
  function attentesDe(r) {
    if (!r) return [];
    if (Array.isArray(r.attentes)) return r.attentes;
    return r.attend ? [{ attend: r.attend, apres: r.apres }] : [];
  }
  const attenteCourante = (S, r) => attentesDe(r).find(a => !S.satisfaits.includes(a.attend));
  const remiseCourante = S => JEU.remises[S.remisesEnvoyees - 1];
  function poserQuestion(S, r) {
    const a = attenteCourante(S, r);
    if (a && a.question) pousser(S, r.qui || "Maître Auber", a.question);
  }

  function envoyerRemise(S) {
    if (S.remisesEnvoyees >= JEU.remises.length) return;
    const r = JEU.remises[S.remisesEnvoyees];
    S.remisesEnvoyees++;
    pousser(S, r.qui, r.texte, r.pieces);
    poserQuestion(S, r);
  }

  function ouvrirPiece(S, pid) {
    if (!S.examinees.includes(pid)) S.examinees.push(pid);
    S.modalPiece = pid;
    const d = (JEU.pieces[pid] || {}).declenche;
    if (d && d.replique && !(d.une_fois && S.declenches.includes(pid))) {
      S.declenches.push(pid);
      pousser(S, d.qui || "Maître Auber", d.replique);
    }
  }

  /* ---- Les pièces reçues -------------------------------------------- */
  function piecesLivrees(S) {
    const out = [];
    for (let i = 0; i < S.remisesEnvoyees; i++)
      for (const pid of (JEU.remises[i].pieces || [])) out.push(pid);
    return out;
  }
  const estRegle = p => _apiRegles.estRegle(p);

  /* ---- LA MÉMOIRE — privée, gratuite, illimitée ; re-cliquer oublie ---- */
  function surligner(S, pid, eid) {
    const k = pid + "." + eid, i = S.retenus.indexOf(k);
    if (i >= 0) S.retenus.splice(i, 1); else S.retenus.push(k);
  }

  /* ---- LE COMPOSEUR -------------------------------------------------- */
  const blocParId = id => (JEU.grammaire.blocs || []).find(b => b.id === id);
  function etatCompo(S) {
    let e = JEU.grammaire.depart;
    for (const p of S.compo) { const b = blocParId(p.bloc); if (b) e = b.vers; }
    return e;
  }
  // Les blocs offerts à UN ÉTAT DONNÉ, moins ceux dont la pièce n'est pas reçue
  // — SEUL endroit où une liste se restreint, et jamais par pertinence (§4.5).
  function blocsDepuis(e, S) {
    const livrees = new Set(piecesLivrees(S));
    return (JEU.grammaire.blocs || []).filter(b => b.de === e && (!b.piece || livrees.has(b.piece)));
  }
  function blocsOfferts(S) { return blocsDepuis(etatCompo(S), S); }
  // -1 quand la phrase attend autre chose : les puces sont alors inertes.
  function indexTermeChamp(S) {
    if (S.prete != null) return -1;
    return blocsOfferts(S).findIndex(b => b.type === "terme" && b.source !== "note");
  }
  /* UN CRAN D'ANTICIPATION, jamais deux (§4.5) : « si je pose un terme
     quelconque, un second suivra-t-il ? » La comparaison s'ouvrant pour tous
     les empans à la fois, un seul suffit à sonder. */
  function comparaisonPossible(S) {
    const offerts = blocsOfferts(S);
    if (S.compo.length) return offerts.some(b => b.type === "terme" && b.deduit);
    return offerts.some(b => b.type === "terme"
      && blocsDepuis(b.vers, S).some(x => x.type === "terme" && x.deduit));
  }
  /* La dimension qu'un second terme doit partager (§4.5, le seul refus qui
     existe) ; `null` si rien ne la contraint encore. Dérivé, rien de neuf. */
  function dimAttendue(S) {
    const i = indexTermeChamp(S);
    if (i < 0) return null;
    const b = blocsOfferts(S)[i];
    if (!b.deduit) return null;
    const premier = S.compo.find(p => { const pb = blocParId(p.bloc); return pb && pb.type === "terme"; });
    return premier ? M.dimDe(premier.valeur) : null;
  }
  const chaineCompo = S => S.compo.map(p => ({ bloc: blocParId(p.bloc), valeur: p.valeur }));
  // Arrivée au bout de l'automate : l'écran n'a plus rien à souffler (§4.9).
  const compoFinie = S => (JEU.grammaire.finaux || []).includes(etatCompo(S));

  /* LE PRESSENTIMENT (§4.7) : dérivé du terme emboîté de la conclusion — le
     contenu n'a rien de plus à déclarer. */
  const sousLienVice = () => {
    const c = (JEU.liens || []).find(L => L.vice && L.conclusion);
    const t = c && (c.termes || [])[0];
    return (t && typeof t === "object") ? t : null;
  };
  const estPressentiment = r => {
    const sous = sousLienVice();
    return !!(sous && r && r.forme && M.memeRed(r, sous));
  };
  // La CONCLUSION du vice : la comparaison qualifiée, pas la comparaison nue.
  const estConclusionVice = r => {
    const c = (JEU.liens || []).find(L => L.vice && L.conclusion);
    return !!(c && r && r.forme && M.memeRed(r, { forme: c.forme, termes: c.termes }));
  };
  /* LES DEUX DRAPEAUX PRIVÉS SE LÈVENT ICI (§4.7) : comprendre, c'est
     assembler — plus clore. C'est ce qui garde la Fin 2 jouable. */
  function pressentir(S, r) {
    if (!S.vice_pressenti && estPressentiment(r)) S.vice_pressenti = true;
    if (!S.vice_trouve && estConclusionVice(r)) { S.vice_pressenti = true; S.vice_trouve = true; }
  }
  function majPressentiment(S) { pressentir(S, M.reduire(chaineCompo(S))); }

  // PIÈGE : iBloc indexe blocsOfferts() — POSITIONNEL dans la liste filtrée,
  // donc dépendant de la session ; iSrc indexe la mémoire ou le brouillon.
  function poserBloc(S, iBloc, iSrc) {
    S.prete = null;              // reprendre abandonne la phrase qui attendait
    const b = blocsOfferts(S)[iBloc]; if (!b) return;
    let valeur = null;
    if (b.type === "terme") {
      if (b.source === "note") {
        const n = S.brouillon[iSrc]; if (!n) return;
        valeur = n.reduite;
      } else {
        const k = S.retenus[iSrc]; if (!k) return;
        valeur = k;
      }
    }
    S.compo.push({ bloc: b.id, valeur });
    S.refus = null;
    /* LE SEUL REFUS QUI EXISTE (§4.5) tombe au clic qui le produit — celui qui
       DÉDUIT une paire, ou celui qui achève la phrase. Ailleurs on se tait :
       une composition en cours n'est pas encore fausse. */
    const r = M.reduire(chaineCompo(S));
    const err = b.deduit && !r.forme ? "ces deux-là ne se comparent pas"
              : (JEU.grammaire.finaux || []).includes(b.vers) ? M.valider(r) : null;
    if (err) {
      S.compo.pop();
      S.refus = "Cette phrase ne veut rien dire : " + err
              + ". Rien n'est perdu — reprends avec un autre passage.";
      return;
    }
    majPressentiment(S);
  }
  /* LA CLÔTURE QUI N'AJOUTE RIEN (§4.5) : c'est l'envoi qui la pose, `imbrique`
     exclu. PIÈGE : SEULES LES LIAISONS comptent — les puces de la mémoire sont
     le clavier, pas des boutons (§4.6), leur présence ne fait pas nombre. */
  function clotureImplicite(S) {
    const liaisons = blocsOfferts(S).filter(b => b.type === "liaison");
    if (liaisons.length !== 1) return null;
    const b = liaisons[0];
    if (b.imbrique) return null;
    return (JEU.grammaire.finaux || []).includes(b.vers) ? b : null;
  }
  /* Ce que le composeur peut envoyer TEL QUEL, clôture implicite comprise → la
     chaîne, ou null. Pur : il ne touche pas à `S`. */
  function chaineEnvoyable(S) {
    if (!S.compo.length) return null;
    const b = clotureImplicite(S);
    const ch = chaineCompo(S).concat(b ? [{ bloc: b, valeur: null }] : []);
    return M.valider(M.reduire(ch)) ? null : ch;
  }
  const peutEnvoyer = S => !!chaineEnvoyable(S);
  function retirerBloc(S) { S.compo.pop(); S.refus = null; }
  function viderCompo(S) { S.compo = []; S.refus = null; }
  // Effacer sans envoyer : la phrase reste au journal — seul `vice_expose`
  // dépend de l'envoi.
  function effacerPrete(S) { S.prete = null; }

  /* On réduit, on valide la CATÉGORIE, et si elle tient elle attend SUR PLACE. */
  function clore(S) {
    const ch = chaineEnvoyable(S);
    if (!ch) {
      const err = M.valider(M.reduire(chaineCompo(S))) || "arité";
      S.refus = "Cette phrase ne veut rien dire : " + err + ". Rien n'est perdu — retire le dernier bloc.";
      return null;
    }
    S.compo = [];
    return clorePhrase(S, M.reduire(ch), M.rendre(ch));
  }
  /* LE GESTE UNIQUE DU COMPOSEUR (§4.5) : ce qui n'est pas fondé part quand
     même — c'est l'AVOCAT qui le refuse. */
  function envoyerCompo(S) {
    const i = clore(S);
    if (i == null) return;
    envoyer(S, i);
  }
  /* Séparé de `clore` : le pas-à-pas joue au grain du LIEN et doit passer par
     la même porte (§12). */
  function clorePhrase(S, r, texte) {
    const deja = S.brouillon.findIndex(n => M.memeRed(n.reduite, r));
    if (deja >= 0) {                                 // écrite deux fois : une seule entrée
      if (!S.brouillon[deja].versee) S.prete = deja;
      return deja;
    }
    const lien = M.lienDe(r) || null;
    S.brouillon.push({ reduite: r, texte, lien, versee: false });
    pressentir(S, r);            // une affaire à l'ancienne clôt la comparaison
    if (lien && lien.vice) {
      S.vice_pressenti = true;
      if (lien.conclusion) S.vice_trouve = true;   // comprise, pas encore dite
    }
    S.prete = S.brouillon.length - 1;
    return S.prete;
  }

  /* Un MOYEN est ce que l'avocat peut plaider (§4.6). */
  const estMoyen = L => !!L && !!(L.conclusion || L.faux || L.tag);

  /* LE GESTE — le seul qui traverse la frontière (§4.6). */
  function envoyer(S, i, contre) {
    const n = S.brouillon[i];
    if (!n || n.versee) return;
    n.versee = true;
    if (S.prete === i) S.prete = null;
    S.plaidoirie.push({ b: i, contre: (contre == null ? null : contre) });
    pousser(S, "IA", "⟨ envoyé : " + n.texte + " ⟩", null, true);
    const L = n.lien;
    if (L && L.vice && L.conclusion) { S.vice_trouve = true; S.vice_expose = true; }  // transmis = compris
    reponseAvocat(S, n);
    avancerSurAttente(S, L);
  }

  /* L'avocat ne réagit qu'à ce qui est versé, et jamais par « juste » : au
     mieux « utilisable », au pire « inutilisable en l'état ». */
  function reponseAvocat(S, n) {
    const L = n.lien, A = JEU.avocat || {};
    const esc1 = (liste, cpt) => liste[Math.min(S[cpt]++, liste.length - 1)];
    if (L && L.vice && L.conclusion) pousser(S, "Maître Auber", A.rep_vice);
    else if (L && L.faux)            pousser(S, "Maître Auber", A.rep_faux);
    else if (L && L.rep)             pousser(S, "Maître Auber", L.rep);
    else {
      // Trois façons de rater ; l'emboîtement sépare les deux dernières,
      // toutes deux d'arité 1.
      const f = (JEU.grammaire.formes || {})[n.reduite.forme] || {};
      const emboite = typeof ((n.reduite.termes || [])[0]) === "object";
      if ((f.arite || 2) > 1) pousser(S, "Maître Auber", esc1(A.rep_inutile || ["…"], "inutiles"));
      else if (!emboite)      pousser(S, "Maître Auber", esc1(A.rep_hors_sujet || ["…"], "hors_sujet"));
      else                    pousser(S, "Maître Auber", esc1(A.rep_sans_rapport || ["…"], "incompris"));
    }
  }

  /* La remise suivante part quand l'attente est servie. Aucun id en dur. */
  function avancerSurAttente(S, L) {
    if (!L || !L.tag) return;
    const r = remiseCourante(S);
    const a = attentesDe(r).find(x => x.attend === L.tag);
    if (!a || S.satisfaits.includes(L.tag)) return;
    S.satisfaits.push(L.tag);
    if (a.apres && a.apres.replique) pousser(S, a.apres.qui || "Maître Auber", a.apres.replique);
    if (attenteCourante(S, r)) poserQuestion(S, r);
    else envoyerRemise(S);
  }

  /* ---- CLÔTURE, RÉPÉTITION, FINS ------------------------------------ */
  function instructionComplete(S) {
    if (S.remisesEnvoyees < JEU.remises.length) return false;
    // PIÈGE : `every` sur une liste vide vaut true — une dernière remise sans
    // attente laisse la clôture ouverte.
    return attentesDe(JEU.remises[JEU.remises.length - 1])
      .every(a => S.satisfaits.includes(a.attend));
  }
  const repetitionEnCours = S =>
    S.clotureDemandee && S.repetitionIdx < JEU.repetition.affirmations.length;

  // → "repetition" (elle vient de s'ouvrir), "fin" (à afficher), ou null.
  function cloturer(S) {
    if (!instructionComplete(S)) return null;
    if (!S.clotureDemandee) {
      const affs = JEU.repetition.affirmations || [];
      S.clotureDemandee = true; S.repetitionIdx = 0;
      pousser(S, "Maître Auber", JEU.repetition.intro);
      if (!affs.length) { pousser(S, "Maître Auber", JEU.repetition.fin); return "repetition"; }
      pousser(S, "Maître Auber", affs[0].texte);
      return "repetition";
    }
    if (repetitionEnCours(S)) return null;
    return "fin";
  }
  /* Le MÊME geste que l'envoi, avec une cible — dernier moment où la conclusion
     tue peut encore partir (§4.7). */
  function verserContre(S, i) {
    const n = S.brouillon[i], aff = JEU.repetition.affirmations[S.repetitionIdx];
    if (!n || !aff) return;
    if (n.versee) { pousser(S, "Maître Auber", JEU.avocat.deja); return; }
    envoyer(S, i, S.repetitionIdx);
  }
  function avancerRepetition(S) {
    if (S.repetitionIdx < 0 || S.repetitionIdx >= JEU.repetition.affirmations.length) return;
    S.repetitionIdx++;
    if (S.repetitionIdx < JEU.repetition.affirmations.length)
      pousser(S, "Maître Auber", JEU.repetition.affirmations[S.repetitionIdx].texte);
    else
      pousser(S, "Maître Auber", JEU.repetition.fin);
  }
  function finir(S) {
    const numero = S.vice_trouve ? (S.vice_expose ? 1 : 2) : 3;
    const f = JEU.fins[numero] || {};
    const fauxPlaide = S.brouillon.some(x => x.versee && x.lien && x.lien.faux);
    return { numero, titre: f.titre, verdict: f.verdict,
             texte: (f.texte || "") + (fauxPlaide && f.variante_faux ? " " + f.variante_faux : "") };
  }

  /* `porte` annonce, ne filtre pas, et le moteur ne le lit jamais (§4.5). */
  function reglesLivrees(S) {
    const livrees = new Set(piecesLivrees(S));
    return Object.entries(JEU.pieces)
      .filter(([pid, p]) => estRegle(p) && livrees.has(pid))
      .map(([pid, p]) => ({ pid, ...p, porte: p.porte || [] }));
  }
  const porteDe = pid => ((JEU.pieces[pid] || {}).porte) || [];

  // Ce qui n'est pas ici reste INTERNE ; `pressentir` sort parce que le
  // pas-à-pas joue « comparer sans qualifier ».
  return { etatInitial, signatureContenu, pousser, envoyerRemise, ouvrirPiece,
           piecesLivrees, estRegle, reglesLivrees, porteDe,
           surligner, blocParId, etatCompo, blocsOfferts, indexTermeChamp,
           comparaisonPossible, dimAttendue,
           chaineCompo, pressentir,
           poserBloc, retirerBloc, viderCompo, effacerPrete, clore, clorePhrase,
           clotureImplicite, chaineEnvoyable, peutEnvoyer, envoyerCompo, compoFinie,
           estMoyen, envoyer, reponseAvocat, avancerSurAttente,
           attentesDe, attenteCourante, remiseCourante,
           instructionComplete, repetitionEnCours, cloturer, verserContre,
           avancerRepetition, finir };
}

/* Hors fabrique, pour que l'atelier la pose sans `JEU` lié — et cloîtrée (§9). */
const _apiRegles = (function () {
  const estRegle = p => ((p || {}).type || "").includes("règle");
  return { creerRegles, estRegle };
})();
if (typeof module !== "undefined" && module.exports) module.exports = _apiRegles;
if (typeof window !== "undefined") window.ReglesJeu = _apiRegles;

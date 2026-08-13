// Les RÈGLES DU JEU — pures, sans DOM, sans localStorage, sans fenêtre.
// Mode double : `require` (tests, banc) ou `<script src>` (jeu, atelier).
//
// Tout ce qui décide vit ici : sessions, drapeaux du vice, ce qui entre au plan,
// répliques, calcul de la fin. Le jeu n'en garde que l'affichage, et le pas-à-pas
// de l'atelier APPELLE ces fonctions au lieu de les recopier (§12).
//
// Convention : chaque fonction reçoit `S` en premier argument et le modifie sur
// place ; aucune ne rend de HTML ; celles qui « parlent » poussent dans `S.fil`,
// qui est de l'état, pas de l'écran.
function creerRegles(JEU, M) {

  /* ---- L'ÉTAT — trois surfaces, une privée (§4.6) ------------------- */
  function etatInitial() { return {
    fil: [],                      // le canal : {qui, texte, pieces[], ia}
    examinees: [],                // pièces ouvertes au moins une fois
    remisesEnvoyees: 0,
    retenus: [],                  // PRIVÉ — ["pid.eid"] dans l'ordre de surlignage
    compo: [],                    // la phrase en cours — [{bloc:id, valeur}]
    refus: null,                  // le dernier refus de catégorie, à afficher
    brouillon: [],                // PRIVÉ — le JOURNAL des phrases closes, sans zone
                                  //   à lui : {reduite, texte, lien:{...}|null, versee:bool}
    prete: null,                  // PRIVÉ — l'index, dans le journal, de la phrase
                                  //   close qui attend sur place. Le seul écart
                                  //   entre « comprendre » et « dire » (§4.7).
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

  // La signature du contenu : une sauvegarde d'une autre affaire est jetée.
  function signatureContenu() {
    const s = JSON.stringify(JEU); let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ---- Le canal ----------------------------------------------------- */
  const pousser = (S, qui, texte, pieces, ia) =>
    S.fil.push({ qui, texte, pieces: pieces || [], ia: !!ia });

  /* Une remise attend une SUITE de réponses. L'ancienne forme — `attend`/`apres`
     sur la remise — se lit comme une liste à un élément : une affaire écrite
     avant se joue sans modification (§11). Seul normalisateur du jeu (R9). */
  function attentesDe(r) {
    if (!r) return [];
    if (Array.isArray(r.attentes)) return r.attentes;
    return r.attend ? [{ attend: r.attend, apres: r.apres }] : [];
  }
  // La première attente non servie. Le désordre est accepté (§4.5).
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

  // Ouvrir une pièce : elle est vue, et elle peut porter un `declenche`.
  function ouvrirPiece(S, pid) {
    if (!S.examinees.includes(pid)) S.examinees.push(pid);
    S.modalPiece = pid;
    const d = (JEU.pieces[pid] || {}).declenche;
    if (d && d.replique && !(d.une_fois && S.declenches.includes(pid))) {
      S.declenches.push(pid);
      pousser(S, d.qui || "Maître Auber", d.replique);
    }
  }

  /* ---- Les pièces reçues ---- une seule maison : dossier, Manuels et
     liaisons-articles doivent dire la même chose (§4.5). */
  function piecesLivrees(S) {
    const out = [];
    for (let i = 0; i < S.remisesEnvoyees; i++)
      for (const pid of (JEU.remises[i].pieces || [])) out.push(pid);
    return out;
  }
  // Le prédicat vit dans l'API du module (bas de fichier) : un exemplaire, et
  // l'atelier peut le poser sans `JEU` lié (R10).
  const estRegle = p => _apiRegles.estRegle(p);

  /* ---- LA MÉMOIRE — privée, gratuite, illimitée --------------------- */
  // Surligner ne produit RIEN. Re-cliquer oublie.
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
  // Les blocs de l'état courant, moins ceux dont la pièce n'est pas reçue (§4.5).
  // SEUL endroit où une liste se restreint, et jamais par pertinence.
  function blocsOfferts(S) {
    const e = etatCompo(S), livrees = new Set(piecesLivrees(S));
    return (JEU.grammaire.blocs || []).filter(b => b.de === e && (!b.piece || livrees.has(b.piece)));
  }
  // Le rang, parmi les blocs offerts, du terme qui se remplit avec un empan.
  // -1 quand la phrase attend autre chose : les puces sont alors inertes.
  function indexTermeChamp(S) {
    if (S.prete != null) return -1;
    return blocsOfferts(S).findIndex(b => b.type === "terme" && b.source !== "note");
  }
  const chaineCompo = S => S.compo.map(p => ({ bloc: blocParId(p.bloc), valeur: p.valeur }));

  /* LE PRESSENTIMENT (§4.7). L'article étant obligatoire, aucune comparaison nue
     ne se clôt : il se lève donc à l'instant où la comparaison du vice
     s'AFFICHE au composeur. Dérivé du terme emboîté du lien de conclusion — le
     contenu n'a rien de plus à déclarer. Privé : rien n'est transmis. */
  const sousLienVice = () => {
    const c = (JEU.liens || []).find(L => L.vice && L.conclusion);
    const t = c && (c.termes || [])[0];
    return (t && typeof t === "object") ? t : null;
  };
  const estPressentiment = r => {
    const sous = sousLienVice();
    return !!(sous && r && r.forme && M.memeRed(r, sous));
  };
  // Constater une forme réduite ; rien d'autre ne se passe.
  function pressentir(S, r) { if (!S.vice_pressenti && estPressentiment(r)) S.vice_pressenti = true; }
  function majPressentiment(S) { pressentir(S, M.reduire(chaineCompo(S))); }

  // iBloc indexe blocsOfferts() — POSITIONNEL dans la liste filtrée ; iSrc
  // indexe la mémoire ou le brouillon.
  function poserBloc(S, iBloc, iSrc) {
    // Reprendre abandonne la phrase qui attendait : elle reste au journal,
    // drapeaux compris, elle quitte l'écran.
    S.prete = null;
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
    majPressentiment(S);
    if ((JEU.grammaire.finaux || []).includes(b.vers)) clore(S);
    else if (b.type === "terme") cloreSansChoix(S);
  }
  /* UNE SUITE UNIQUE N'EST PAS UN CHOIX (§4.5) : un seul bloc, une liaison qui
     clôt et n'emboîte rien, c'est de la ponctuation. `imbrique` est exclu —
     invoquer un texte est un acte, et sans ça la relance « et donc ? » se
     répondrait toute seule. Rien ici ne lit le contenu. */
  function cloreSansChoix(S) {
    const offerts = blocsOfferts(S);
    if (offerts.length !== 1) return;
    const b = offerts[0];
    if (b.type !== "liaison" || b.imbrique) return;
    if (!(JEU.grammaire.finaux || []).includes(b.vers)) return;
    S.compo.push({ bloc: b.id, valeur: null });
    clore(S);
  }
  function retirerBloc(S) { S.compo.pop(); S.refus = null; }
  function viderCompo(S) { S.compo = []; S.refus = null; }
  // Effacer sans envoyer : la phrase reste au journal — ce qu'on a compris, on
  // l'a compris, seul `vice_expose` dépend de l'envoi.
  function effacerPrete(S) { S.prete = null; }

  /* La phrase est close : on réduit, on valide la CATÉGORIE, et si elle tient
     elle attend SUR PLACE — privée. Rien ne part tant qu'on ne l'envoie pas. */
  function clore(S) {
    const ch = chaineCompo(S);
    const r = M.reduire(ch);
    const err = M.valider(r);
    if (err) {
      S.refus = "Cette phrase ne veut rien dire : " + err + ". Rien n'est perdu — retire le dernier bloc.";
      S.compo.pop();
      return;
    }
    S.compo = [];
    clorePhrase(S, r, M.rendre(ch));
  }
  /* Une phrase réduite entre au journal : dédoublonnage, drapeaux, attente sur
     place. Séparé de `clore` parce que le pas-à-pas joue au grain du LIEN et
     doit passer par la même porte (§12). */
  function clorePhrase(S, r, texte) {
    const deja = S.brouillon.findIndex(n => M.memeRed(n.reduite, r));
    if (deja >= 0) {                            // déjà écrite : on ne la duplique pas.
      if (!S.brouillon[deja].versee) S.prete = deja;   // pas encore envoyée → elle revient attendre
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

  /* ---- LE PLAN ---- Un MOYEN est ce que l'avocat peut plaider ; le reste, il
     l'entend et y répond, sans que ça entre au plan (§4.6). */
  const estMoyen = L => !!L && !!(L.conclusion || L.faux || L.tag);

  /* LE GESTE. Le seul qui traverse la frontière — donc le seul lieu du dilemme. */
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

  /* L'avocat réagit — et seulement à ce qui est versé. Jamais « juste » :
     au mieux « utilisable », au pire « inutilisable en l'état ». */
  function reponseAvocat(S, n) {
    const L = n.lien, A = JEU.avocat || {};
    const esc1 = (liste, cpt) => liste[Math.min(S[cpt]++, liste.length - 1)];
    if (L && L.vice && L.conclusion) pousser(S, "Maître Auber", A.rep_vice);
    else if (L && L.faux)            pousser(S, "Maître Auber", A.rep_faux);
    else if (L && L.rep)             pousser(S, "Maître Auber", L.rep);
    else {
      // Pas de lien reconnu : trois façons de rater — comparaison sans
      // conclusion, qualification qui ne se rattache à rien, citation hors
      // sujet. Les deux dernières sont d'arité 1, l'emboîtement les sépare.
      const f = (JEU.grammaire.formes || {})[n.reduite.forme] || {};
      const emboite = typeof ((n.reduite.termes || [])[0]) === "object";
      if ((f.arite || 2) > 1) pousser(S, "Maître Auber", esc1(A.rep_inutile || ["…"], "inutiles"));
      else if (!emboite)      pousser(S, "Maître Auber", esc1(A.rep_hors_sujet || ["…"], "hors_sujet"));
      else                    pousser(S, "Maître Auber", esc1(A.rep_sans_rapport || ["…"], "incompris"));
    }
  }

  /* L'avancement : la remise suivante part quand l'attente est servie. Aucun
     identifiant en dur. */
  function avancerSurAttente(S, L) {
    if (!L || !L.tag) return;
    const r = remiseCourante(S);
    const a = attentesDe(r).find(x => x.attend === L.tag);
    if (!a || S.satisfaits.includes(L.tag)) return;
    S.satisfaits.push(L.tag);
    if (a.apres && a.apres.replique) pousser(S, a.apres.qui || "Maître Auber", a.apres.replique);
    // Il reste une question dans cette session ? On la pose. Sinon la session
    // est servie, et la suivante part.
    if (attenteCourante(S, r)) poserQuestion(S, r);
    else envoyerRemise(S);
  }

  /* ---- CLÔTURE, RÉPÉTITION, FINS ------------------------------------ */
  function instructionComplete(S) {
    if (S.remisesEnvoyees < JEU.remises.length) return false;
    // `every` sur une liste vide vaut true : une dernière remise sans attente
    // laisse la clôture ouverte.
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
      // Une affaire sans répétition passe droit à la confirmation.
      if (!affs.length) { pousser(S, "Maître Auber", JEU.repetition.fin); return "repetition"; }
      pousser(S, "Maître Auber", affs[0].texte);
      return "repetition";
    }
    if (repetitionEnCours(S)) return null;
    return "fin";
  }
  /* Opposer une phrase : le MÊME geste que l'envoi, avec une cible — le dernier
     moment où la conclusion tue peut encore partir (§4.7). */
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
  // Le calcul des fins, en une ligne — et la variante du faux vice.
  function finir(S) {
    const numero = S.vice_trouve ? (S.vice_expose ? 1 : 2) : 3;
    const f = JEU.fins[numero] || {};
    const fauxPlaide = S.brouillon.some(x => x.versee && x.lien && x.lien.faux);
    return { numero, titre: f.titre, verdict: f.verdict,
             texte: (f.texte || "") + (fauxPlaide && f.variante_faux ? " " + f.variante_faux : "") };
  }

  /* ---- Les Manuels : les règles LIVRÉES et ce qu'elles régissent ----
     `porte` est indicatif : il annonce, il ne filtre pas, et le moteur ne le lit
     jamais (§4.5). */
  function reglesLivrees(S) {
    const livrees = new Set(piecesLivrees(S));
    return Object.entries(JEU.pieces)
      .filter(([pid, p]) => estRegle(p) && livrees.has(pid))
      .map(([pid, p]) => ({ pid, ...p, porte: p.porte || [] }));
  }
  const porteDe = pid => ((JEU.pieces[pid] || {}).porte) || [];

  // Ce qui n'est pas ici reste INTERNE (§4.7). `pressentir` sort quand même : le
  // pas-à-pas joue « comparer sans qualifier », et c'est ce qu'il appelle.
  return { etatInitial, signatureContenu, pousser, envoyerRemise, ouvrirPiece,
           piecesLivrees, estRegle, reglesLivrees, porteDe,
           surligner, blocParId, etatCompo, blocsOfferts, indexTermeChamp,
           chaineCompo, pressentir,
           poserBloc, retirerBloc, viderCompo, effacerPrete, clore, clorePhrase,
           estMoyen, envoyer, reponseAvocat, avancerSurAttente,
           attentesDe, attenteCourante, remiseCourante,
           instructionComplete, repetitionEnCours, cloturer, verserContre,
           avancerRepetition, finir };
}

/* Une pièce est-elle un article ? La question ne dépend d'aucun état : elle sort
   donc de la fabrique, pour que l'atelier la pose sans `JEU` lié (R10). Cloîtrée,
   comme les projections de moteur.js : un nom de haut niveau ici serait un nom
   pris dans la page qui charge le fichier (§9). */
const _apiRegles = (function () {
  const estRegle = p => ((p || {}).type || "").includes("règle");
  return { creerRegles, estRegle };
})();
if (typeof module !== "undefined" && module.exports) module.exports = _apiRegles;
if (typeof window !== "undefined") window.ReglesJeu = _apiRegles;

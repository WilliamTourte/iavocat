// Parcours & ergonomie — le composeur pas à pas et le retour en arrière, la
// modale de pièce, les répliques de l'avocat, le grain fin de la répétition.
// Contenu embarqué.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, discussion, contexte, composeur, plaidoirie, plaidoirieVisible } = H;
const boot = () => H.boot();

console.log("\n=== Le composeur, bloc par bloc ===");
{
  const w = boot();
  H.livrerTout(w);
  check("au départ, la phrase est vide", w.S.compo.length === 0);
  check("l'état de départ offre au moins un bloc", w.R.blocsOfferts(w.S).length > 0);
  const emp = w.CHAMPS.filter(c => c.dim === w.CHAMPS[0].dim).slice(0, 2);
  for (const pid of new Set(emp.map(e => e.pid))) w.ouvrirPiece(pid);
  for (const e of emp) H.surligner(w, e.id);
  const iT = H.iTermeChamp(w);
  w.poserBloc(iT, 0);
  check("poser un terme fait avancer l'automate", w.S.compo.length === 1);
  check("l'état a changé", w.R.etatCompo(w.S) !== w.JEU.grammaire.depart);
  w.retirerBloc();
  check("← retirer revient en arrière", w.S.compo.length === 0);
  check("et l'état repart du départ", w.R.etatCompo(w.S) === w.JEU.grammaire.depart);
  w.poserBloc(iT, 0);
  w.viderCompo();
  check("tout effacer vide la phrase", w.S.compo.length === 0 && !w.S.refus);
}

console.log("\n=== Refus de catégorie : en session 1 seulement (§4.11) ===");
/* Deux passages de dimensions différentes, choisis parmi ce qui est livré. */
function deuxDimensions(w) {
  const livrees = new Set(w.R.piecesLivrees(w.S));
  for (const pid of livrees) w.ouvrirPiece(pid);
  const dispo = w.CHAMPS.filter(c => livrees.has(c.pid));
  const a = dispo[0], b = dispo.find(c => c.dim !== a.dim);
  H.surligner(w, a.id); H.surligner(w, b.id);
  return [a, b];
}
const poserLesDeux = (w, a, b) => {
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(a.id));
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(b.id));
};
{
  const w = boot();                   // la remise 1 : la calibration
  const [a, b] = deuxDimensions(w);
  const f = w.M.deduire(a.id, b.id);
  check("le moteur ne déduit aucune relation entre deux dimensions — au mieux, il les juxtapose",
    f === null || w.JEU.grammaire.formes[f].deduction === "juxtaposition");
  check("on est bien en calibration", w.R.enCalibration(w.S));
  poserLesDeux(w, a, b);
  check("en session 1, deux dimensions différentes : la phrase est refusée", !!w.S.refus);
  check("le message ne dit rien de plus que la catégorie",
    /ne se comparent pas|dimensions différentes|slot/.test(w.S.refus));
  check("rien n'est tombé au journal", w.S.brouillon.length === 0);
  check("et rien n'attend d'être envoyé", w.S.prete === null);
  check("rien n'est parti au plan", w.S.plaidoirie.length === 0);
}
{
  const w = boot();
  H.livrerTout(w);                    // après la calibration
  const [a, b] = deuxDimensions(w);
  check("hors session 1, on n'est plus en calibration", !w.R.enCalibration(w.S));
  poserLesDeux(w, a, b);
  // §4.5, passe G — deux dimensions n'ont aucune relation à offrir : la juxtaposition
  // se pose d'elle-même, sans choix, et se retire avec le terme qui l'a appelée.
  check("hors session 1, la juxtaposition se pose sans refus d'écran, et sans choix",
    !w.S.refus && w.S.compo.length === 3 && !!w.S.compo[2].auto && w.R.relationsOffertes(w.S).length === 0);
  check("et se lit sans relation : « {a} et {b} »",
    w.R.juxtapose(w.M.reduire(w.R.chaineCompo(w.S))));
  const avant = w.S.incompris;
  w.envoyerCompo();
  check("elle part — et c'est l'avocat qui la refuse, par son escalade",
    w.S.brouillon.length === 1 && w.S.incompris === avant + 1
    && w.S.fil[w.S.fil.length - 1].texte === w.JEU.avocat.rep_sans_rapport[avant]);
  check("elle ne sert rien, et n'entre pas en PLAIDOIRIE",
    !w.R.estMoyen(w.S.brouillon[0].lien) && w.S.satisfaits.length === 0);
  // Sous un article aussi : l'avocat la refuse, sans la prendre pour un moyen.
  const [c, d] = deuxDimensions(w);
  w.viderCompo(); poserLesDeux(w, c, d);
  const iArt = w.R.blocsOfferts(w.S).findIndex(x => x.imbrique);
  if (iArt >= 0) {
    w.poserBloc(iArt);
    const n0 = w.S.incompris; w.envoyerCompo();
    check("sous un article, la juxtaposition reçoit le même refus d'avocat", w.S.incompris === n0 + 1);
  } else check("(aucun article livré)", true);
}
{
  /* PIÈGE (§11) : la juxtaposition n'entre jamais dans la boucle de `deduire`.
     Déclarée EN TÊTE des formes, elle passerait pour une « différence » entre
     deux passages de même dimension — le contenu livré, qui la déclare en
     dernier, ne le verrait pas. */
  const c = H.contenuLivre(), F = c.grammaire.formes;
  const nom = Object.keys(F).find(k => F[k].deduction === "juxtaposition");
  c.grammaire.formes = { [nom]: F[nom], ...Object.fromEntries(Object.entries(F).filter(([k]) => k !== nom)) };
  const w = H.boot({ contenu: c });
  const paires = [];
  for (const a of w.CHAMPS) for (const b of w.CHAMPS)
    if (a.id < b.id && a.dim === b.dim) paires.push([a.id, b.id]);
  check("déclarée en tête, la juxtaposition ne lie jamais deux passages de même dimension",
    paires.length > 0 && paires.every(([x, y]) => w.M.deduire(x, y) !== nom));
}
{
  // L'ASSOMBRISSEMENT ANNONÇAIT LE REFUS D'ÉCRAN : il vit avec lui (§4.11).
  const dims = w => [...w.document.querySelectorAll("#zoneRetenus .dimgrp")];
  const w = boot();
  const [a] = deuxDimensions(w);
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(a.id));
  check("en session 1, pendant une comparaison, les autres dimensions s'assombrissent",
    dims(w).some(g => g.classList.contains("horsdim")));
  const w2 = boot();
  H.livrerTout(w2);
  const [a2] = deuxDimensions(w2);
  w2.poserBloc(H.iTermeChamp(w2), w2.S.retenus.indexOf(a2.id));
  check("hors session 1, plus rien ne s'assombrit",
    dims(w2).length > 1 && !dims(w2).some(g => g.classList.contains("horsdim")));
  check("et le premier passage posé garde sa couleur au composeur",
    /--dc:\s*#/.test(w2.document.querySelector("#composeur .bl.terme.pose").getAttribute("style") || ""));
}
{
  // `porte` SE MARQUE, IL NE S'ÉTIQUETTE PLUS (§4.11) : un cadre par dimension,
  // sa couleur et son trait — et son nom à qui ne voit pas.
  const w = boot();
  H.livrerTout(w);
  const regles = Object.keys(w.JEU.pieces).filter(p => w.R.estRegle(w.JEU.pieces[p]) && w.R.porteDe(p).length);
  let ok = regles.length > 0, sansMot = true, sr = true;
  for (const pid of regles) {
    w.ouvrirPiece(pid);
    const panneau = w.document.getElementById("panPiece");
    const cadres = [...panneau.querySelectorAll(".cadre")];
    const porte = w.R.porteDe(pid);
    ok = ok && cadres.length === porte.length && cadres.every((c, k) => {
      const st = c.getAttribute("style") || "";
      return st.includes(w.MoteurGrammaire.couleurDim(w.JEU.dimensions, porte[k]))
        && (/--ds:\s*\w+/.test(st));
    });
    sansMot = sansMot && !/porte sur :/i.test(panneau.textContent.replace(/Porte sur : [^.]*\./, ""));
    // PIÈGE : `.cadre > .sr`, pas `.cadre .sr` — le texte de l'article est un
    // passage (passe F), dont la voix dit « article » plus haut dans le cadre.
    sr = sr && porte.every(d => (panneau.querySelector(".cadre > .sr") || {}).textContent.includes(d));
  }
  check("chaque article est encadré de la couleur de chaque dimension qu'il régit, et de son trait", ok);
  check("sans un mot à l'écran : plus d'étiquette « porte sur »", sansMot);
  check("à qui ne voit pas, le nom des dimensions", sr);
}

console.log("\n=== Le joueur choisit la relation, le moteur la vérifie (§4.5, passe G) ===");
{
  const w = boot();
  H.livrerTout(w);
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  const L = H.lienConclusion(w), sous = H.sousTerme(L);
  const [a, b] = sous.termes;
  H.surligner(w, a); H.surligner(w, b);
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, a));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, b));
  const rels = w.R.relationsOffertes(w.S);
  check("deux passages de même dimension posés : le composeur offre les deux relations de la dimension",
    rels.length === 2 && rels.includes(sous.forme)
    && rels.every(f => !w.JEU.grammaire.formes[f].slots[0].length || w.JEU.grammaire.formes[f].slots[0].includes(w.M.dimDe(a))));
  check("rien ne s'écrit avant le choix : la relation n'est pas dite à la place du joueur",
    !w.R.peutEnvoyer(w.S) && w.document.querySelectorAll("#composeur .bbloc.relation").length === 2
    && !w.R.chaineCompo(w.S).some(p => p.bloc.type === "relation"));
  check("poser les deux passages du vice n'est pas encore le pressentir", !w.S.vice_pressenti);
  const fausse = rels.find(f => f !== sous.forme);
  w.poserBloc(w.R.blocsOfferts(w.S).findIndex(x => x.type === "relation"), rels.indexOf(fausse));
  check("la relation fausse se choisit, et le moteur la sait fausse", w.M.fausse(w.M.reduire(w.R.chaineCompo(w.S))));
  check("elle ne lève aucun drapeau", !w.S.vice_pressenti && !w.S.vice_trouve);
  H.lireLeTexte(w, L.forme);
  w.prendreArticle(H.cleArticle(w, w.JEU.grammaire.blocs.find(x => w.R.estLiaisonArticle(x) && x.forme === L.forme).piece));
  check("sous son article, la phrase fausse se tient", w.R.peutEnvoyer(w.S) && !w.S.vice_trouve);
  const avant = w.moyensRetenus().length;
  w.envoyerCompo();
  check("une relation fausse part, et l'avocat la refuse par sa propre escalade",
    w.S.fausses === 1 && w.S.fil[w.S.fil.length - 1].texte === w.JEU.avocat.rep_relation_fausse[0]);
  check("elle ne sert rien, n'entre pas en PLAIDOIRIE, et ne lève toujours aucun drapeau",
    w.moyensRetenus().length === avant && !w.R.estMoyen(w.S.brouillon[w.S.brouillon.length - 1].lien)
    && !w.S.vice_pressenti && !w.S.vice_trouve && !w.S.vice_expose);
  check("les autres escalades n'ont pas bougé", w.S.incompris === 0 && w.S.inutiles === 0 && w.S.hors_sujet === 0);
  // La VRAIE, choisie, lève le pressentiment (§4.7) — au choix, pas à la pose.
  w.viderCompo();
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, a));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, b));
  check("reposés, les deux passages ne pressentent toujours rien", !w.S.vice_pressenti);
  w.poserBloc(w.R.blocsOfferts(w.S).findIndex(x => x.type === "relation"), rels.indexOf(sous.forme));
  check("la vraie relation choisie, le vice est pressenti", w.S.vice_pressenti && !w.S.vice_trouve);
}
{
  // PARTOUT, SESSION 1 COMPRISE : à deux relations, un refus d'écran aurait donné l'autre.
  const w = boot();
  const L = H.lienTag(w, w.R.attentesDe(w.R.remiseCourante(w.S)).slice(-1)[0].attend);
  H.composerLien(w, H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend));
  const sous = H.sousTerme(L);
  const fausse = w.M.relationsDe(w.M.dimDe(sous.termes[0])).find(f => f !== sous.forme);
  check("en session 1, la relation fausse sous son article se compose — aucun refus d'écran",
    H.composerLien(w, { forme: L.forme, termes: [{ forme: fausse, termes: sous.termes }] }) >= 0 && !w.S.refus);
  check("l'avocat la refuse, la question reste posée",
    w.S.fausses === 1 && !w.S.satisfaits.includes(L.tag));
  H.composerLien(w, L);
  check("la vraie la sert, et le compteur retombe à la remise suivante", w.S.remisesEnvoyees === 2 && w.S.fausses === 0);
}
{
  // DEUX DIMENSIONS N'ONT RIEN À OFFRIR : la juxtaposition se pose d'elle-même, et
  // « ← retirer » l'emporte avec le terme qui l'a appelée.
  const w = boot();
  H.livrerTout(w);
  const [a, b] = deuxDimensions(w);
  poserLesDeux(w, a, b);
  check("juxtaposées, rien à choisir", w.R.relationsOffertes(w.S).length === 0 && !!w.S.compo[w.S.compo.length - 1].auto);
  w.retirerBloc();
  check("« ← retirer » retire le second passage et sa juxtaposition ensemble", w.S.compo.length === 1);
}

console.log("\n=== La vérification : la relation vraie se calcule des valeurs ===");
{
  const w = boot();
  H.livrerTout(w);
  let tous = true, n = 0;
  for (const L of H.comparaisons(w)) {
    n++;
    if (w.M.deduire(L.termes[0], L.termes[1]) !== L.forme) tous = false;
  }
  check(`les ${n} relations déclarées sont toutes vraies sur les valeurs`, n > 0 && tous);

  /* Le PATRON doit s'écrire : une régression ne casse aucune forme réduite, mais
     le verbe disparaît — c'est la relecture à l'œil qui l'avait attrapé. */
  let patronsOk = true, vus = 0;
  for (const L of H.comparaisons(w)) {
    const f = w.JEU.grammaire.formes[L.forme];
    if (!f.patron) continue;
    w.viderCompo();
    if (!H.poserComparaison(w, L)) { patronsOk = false; continue; }
    vus++;
    const nom = id => (w.M.C[id] || {}).nom;
    const ord = w.M.ordonner(L.forme, L.termes);
    const attendu = f.patron.replace("{a}", nom(ord[0])).replace("{b}", nom(ord[1]));
    if (!w.M.rendre(w.R.chaineCompo(w.S)).startsWith(attendu)) patronsOk = false;
  }
  w.viderCompo();
  check(`les ${vus} relations choisies s'écrivent par leur patron, verbe compris`, vus > 0 && patronsOk);

  const ord = H.comparaisons(w).find(L => (w.JEU.grammaire.formes[L.forme]||{}).ordonne);
  if (ord) {
    const [x, y] = ord.termes;
    check("l'ordre des clics n'importe pas : la forme range ses termes",
      JSON.stringify(w.M.ordonner(ord.forme, [y, x])) === JSON.stringify([x, y]));
  } else check("(aucune forme ordonnée dans ce contenu)", true);

  /* L'ÉGALITÉ VAUT DANS LES CINQ DIMENSIONS (§4.2) — y compris dans celles
     d'ÉCART, sans quoi les doublons banals cesseraient d'être composables et
     inertes (§4.4). PIÈGE : ces dimensions se DÉRIVENT des formes ordonnées,
     elles ne se nomment pas en dur — une liste recopiée ici a survécu au
     renommage d'une dimension en affirmant l'ancienne vérité (§16). */
  const dimsEcart = new Set();
  for (const f of Object.values(w.JEU.grammaire.formes))
    if (f.deduction === "ordre") for (const d of (f.slots || [])[0] || []) dimsEcart.add(d);
  const paires = [];
  for (let i = 0; i < w.CHAMPS.length; i++)
    for (let j = i + 1; j < w.CHAMPS.length; j++) {
      const a = w.CHAMPS[i], b = w.CHAMPS[j];
      if (a.dim === b.dim && a.valeur === b.valeur && dimsEcart.has(a.dim))
        paires.push([a, b]);
    }
  if (paires.length) {
    const [a, b] = paires[0];
    const f = w.M.deduire(a.id, b.id);
    check("deux valeurs égales hors identité restent comparables", !!f);
    check("et se lisent comme une identité", (w.JEU.grammaire.formes[f]||{}).deduction === "egalite");
  } else check("(aucune paire égale hors identité dans ce contenu)", true);
}

console.log("\n=== On n'invoque pas un texte qu'on n'a pas reçu ===");
{
  const w = boot();
  const G = w.JEU.grammaire;
  const avecPiece = G.blocs.filter(b => b.piece);
  check("des blocs sont conditionnés à une pièce", avecPiece.length > 0);
  const C = H.lienConclusion(w);
  H.livrerTout(w);
  H.poserComparaison(w, C.termes[0]);
  const offerts = w.R.blocsOfferts(w.S);
  check("tout ce qui est offert a sa pièce",
    offerts.every(b => !b.piece || new Set(w.R.piecesLivrees(w.S)).has(b.piece)));

  const w0 = boot();
  const livrees0 = new Set(w0.R.piecesLivrees(w0.S));
  const manquant = avecPiece.find(b => b.imbrique && !livrees0.has(b.piece));
  check("l'article du vice n'est pas encore là", !!manquant);
  check("il n'est donc offert nulle part",
    !H.cheminVers(w0, (manquant||{}).forme).length
    || !w0.R.blocsOfferts(w0.S).some(b => b.id === (manquant||{}).id));

  /* LIVRÉ NE SUFFIT PLUS : un texte s'invoque une fois LU (§4.5). La tournure,
     elle, se reçoit — c'est pourquoi la comparaison se pose sans avoir rien ouvert. */
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, C.termes[0]);
  check("la comparaison se pose sans qu'aucun texte soit lu",
    w2.S.compo.length > 0 && !w2.S.examinees.some(pid => w2.R.estRegle(w2.JEU.pieces[pid])));
  check("livré mais pas lu, l'article n'est offert nulle part",
    !w2.R.blocsOfferts(w2.S).some(b => b.id === (manquant||{}).id));
  H.lireLeTexte(w2, (manquant||{}).forme);
  check("lu, il est offert", w2.R.blocsOfferts(w2.S).some(b => b.id === (manquant||{}).id));
  check("et la conclusion devient composable", H.composerLien(w2, C) >= 0);
}

console.log("\n=== Un fait se cite, une relation se fonde ===");
{
  const w = boot();
  const cits = H.citations(w);
  check("le contenu déclare des citations", cits.length > 0);
  const bc = H.blocCite(w);
  check("un bloc les clôt, et il n'emboîte rien", !!bc && !bc.imbrique);

  const L = cits[0];
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  H.surligner(w, L.termes[0]);
  const iT = H.iTermeChamp(w);
  w.poserBloc(iT, w.S.retenus.indexOf(L.termes[0]));
  check("un seul empan posé, la phrase se tient déjà", w.S.compo.length === 1);
  check("et elle s'envoie telle quelle", w.R.peutEnvoyer(w.S));
  const imp = w.R.clotureImplicite(w.S);
  check("la clôture qui la citera est celle du contenu", !!imp && imp.id === bc.id);
  check("et aucun article n'est requis pour cette voie", !bc.piece);
  check("composer ne met rien au journal", w.S.brouillon.length === 0);
  check("ni ne transmet quoi que ce soit", w.S.plaidoirie.length === 0);
  w.envoyerCompo();
  check("l'envoi clôt ET transmet, d'un seul geste",
    w.S.compo.length === 0 && w.S.brouillon.length === 1 && w.S.brouillon[0].versee);
  check("elle porte exactement le lien déclaré",
    w.M.memeRed(w.S.brouillon[0].reduite, {forme: L.forme, termes: L.termes}));
  check("son terme est resté ATOMIQUE — rien n'a été emboîté",
    typeof w.S.brouillon[0].reduite.termes[0] === "string");

  const e = w.CHAMPS.find(c => c.id === L.termes[0]);
  const txt = w.S.brouillon[0].texte;
  check("la phrase porte le nom de l'empan", txt.includes(e.nom));
  check("et sa citation", txt.includes(e.texte));
  check("et la pièce d'où elle vient", !e.court || txt.includes(e.court));

  const w2 = boot();
  H.livrerTout(w2);
  const C = H.lienConclusion(w2);
  const j = H.composerLien(w2, C);
  const feuilles = w2.CHAMPS.filter(c => (C.termes[0].termes || []).includes(c.id));
  check("une comparaison ne cite pas, elle nomme",
    j >= 0 && feuilles.every(c => !w2.S.brouillon[j].texte.includes(c.texte)));
}
{
  const w = boot();
  const G = w.JEU.grammaire;
  // Le SECOND terme d'une paire — PIÈGE PAYÉ : cherché par `deduit` seul, il manquait
  // depuis la passe G, et tout ce bloc passait par le vide.
  const second = (G.blocs || []).find(b => w.R.estSecondTerme(b));
  check("la grammaire livrée a un second terme de paire", !!second);
  if (second) {
    check("le second empan porte une pièce, comme une liaison", !!second.piece);
    check("et l'affaire la livre d'emblée",
      !second.piece || new Set(w.R.piecesLivrees(w.S)).has(second.piece));
    for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
    /* L'ANTICIPATION (§4.5), avant tout empan posé : la comparaison doit se voir
       sans qu'aucun clic ne l'ait ouverte — sinon la voix unique retombe dans le
       bug qu'elle corrige, où elle se taisait jusqu'au premier clic. */
    check("la comparaison se voit AVANT tout empan posé", w.R.comparaisonPossible(w.S));
    check("et rien ne contraint encore un empan qu'on n'a pas posé",
      w.R.dimAttendue(w.S) === null);
    const e = w.CHAMPS[0];
    H.surligner(w, e.id);
    w.poserBloc(H.iTermeChamp(w), 0);
    check("un empan posé, le second est offert — et pour tous, sans préférence",
      w.R.blocsOfferts(w.S).some(b => w.R.estSecondTerme(b)));
    check("la citation est là à côté : deux voies, pas une bascule",
      !!w.R.clotureImplicite(w.S));
    check("et la phrase se tient déjà, dès le premier empan", w.R.peutEnvoyer(w.S));
    check("la comparaison reste vue, un premier empan posé", w.R.comparaisonPossible(w.S));
    check("et la dimension attendue pour le second est celle du premier",
      w.R.dimAttendue(w.S) === e.dim);

    /* LE MÊME CONTENU, pièce du second empan repoussée : la voie se referme, et
       le filtre de livraison ne fait donc pas d'exception pour les termes. */
    if (second.piece) {
      const c = H.contenuLivre();
      const b2 = c.grammaire.blocs.find(b => b.id === second.id);
      for (const r of c.remises) r.pieces = (r.pieces || []).filter(p => p !== b2.piece);
      const derniere = c.remises[c.remises.length - 1];
      derniere.pieces = (derniere.pieces || []).concat([b2.piece]);
      const w2 = H.boot({contenu: c});
      for (const pid of Object.keys(w2.JEU.pieces)) w2.ouvrirPiece(pid);
      check("pièce repoussée, la comparaison ne se voit pas non plus à l'avance",
        !w2.R.comparaisonPossible(w2.S));
      H.surligner(w2, w2.CHAMPS[0].id);
      w2.poserBloc(H.iTermeChamp(w2), 0);
      check("pièce repoussée, aucun second empan n'est offert",
        !w2.R.blocsOfferts(w2.S).some(b => w2.R.estSecondTerme(b)));
      check("seule la citation reste, et elle suffit à envoyer",
        !!w2.R.clotureImplicite(w2.S) && w2.R.peutEnvoyer(w2.S));
    }
  }
}

console.log("\n=== La continuation : une comparaison demande toujours « et donc ? » ===");
{
  const w = boot();
  H.livrerTout(w);                            // l'article doit avoir été reçu…
  const C = H.lienConclusion(w);              // arité 1 : une comparaison qualifiée
  H.lireLeTexte(w, C.forme);                  // …ET LU, pour pouvoir être invoqué (§4.5)
  const sous = C.termes[0];                   // la comparaison qu'elle emboîte
  H.poserComparaison(w, sous);
  check("la comparaison est posée mais PAS close", w.S.compo.length > 0 && w.S.brouillon.length === 0);
  check("l'automate offre de continuer", w.R.blocsOfferts(w.S).some(b => b.imbrique));
  /* §4.5 — le moteur ne tranche AUCUNE question de droit : tous les articles LUS
     sont offerts, et c'est au joueur de choisir. (Reçus ne suffit plus — on
     n'invoque pas un texte qu'on n'a pas ouvert.) */
  for (const b of H.articlesDisponibles(w)) H.lireLeTexte(w, b.forme);
  const offerts = w.R.blocsOfferts(w.S);
  check("tous les articles lus sont offerts, pas seulement le bon",
    offerts.filter(b => b.imbrique).length > 1);

  check("aucun bloc ne clôt sans qualifier", !offerts.some(b => !b.forme && !b.imbrique));
  check("tous les blocs offerts portent un article", offerts.every(b => b.imbrique && b.forme));
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, sous); H.cloreSurPlace(w2);
  check("une comparaison seule ne peut pas se clore", w2.S.brouillon.length === 0);
  check("mais le pressentiment, lui, a bien eu lieu au composeur", w2.S.vice_pressenti);
  check("et il n'a rien transmis", w2.S.plaidoirie.length === 0 && !w2.S.vice_expose);

  const i = H.composerLien(w, C);
  check("la continuation produit exactement la forme du lien déclaré",
    i >= 0 && w.M.memeRed(w.S.brouillon[i].reduite, {forme: C.forme, termes: C.termes}));
  check("en une seule phrase, sans passer par une liste", w.S.brouillon.length === 1);
  /* PIÈGE : ce qui se vérifie est le RECOLLEMENT, jamais le libellé — le texte
     de la liaison vient du contenu et change avec l'affaire (§16). */
  const liaison = (w.JEU.grammaire.blocs || []).find(b => b.imbrique && b.forme === C.forme);
  check("la phrase se lit d'un trait, ponctuation recollée",
    !!liaison && w.S.brouillon[i].texte.includes(liaison.texte)
             && !/ ,/.test(w.S.brouillon[i].texte));
  check("elle est écrite avec les NOMS des empans, pas les citations",
    w.CHAMPS.filter(c => sous.termes.includes(c.id))
            .every(c => w.S.brouillon[i].texte.includes(c.nom)));
}

console.log("\n=== Les deux gestes, montrés ===");
{
  const w = H.boot({url:"http://localhost/"});
  const halo = () => w.document.querySelector("[data-tuto]");
  const bandeau = () => w.document.getElementById("tuto");
  const dansDISCUSSION = el => !!el && w.document.getElementById("discussion").contains(el);
  const termes = () => w.S.compo.map(p => p.valeur).filter(v => w.CHAMPS.some(c => c.id === v));
  const retirer = () => w.document.querySelector('#composeur [data-f="retirer"]');

  /* §4.8 — il se tait là où l'écran parle seul : le message finit sur le bouton
     de pièces. Il commence au CONTEXTE ouvert. */
  check("au premier écran, le tutoriel se tait", bandeau().hidden && !halo());
  w.document.querySelector("#discussion .attach").click();
  check("le CONTEXTE ouvert, il parle, et montre l'index",
    !bandeau().hidden && !!halo() && halo().id === "zoneDossier" && !dansDISCUSSION(halo()));

  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const cible = halo();
  check("la pièce ouverte, il montre son TEXTE, pas un empan",
    !!cible && cible.classList.contains("piecetexte"));
  check("et tous les empans y restent marqués pareil — aucune lampe torche",
    ![...cible.querySelectorAll(".empan")].some(e => e.hasAttribute("data-tuto")));
  // PIÈGE : la forme développée (`ditLong`) et la forme courte (`dit`, l'étiquette
  // de l'icône réduite) sont deux textes — une mutation de l'une passait l'autre.
  check("et il dit de CLIQUER le passage, développé comme réduit : le clic retient et pose (passe H)",
    /Clique/.test(w.document.getElementById("tutoDit").textContent)
    && /Clique/.test(w.document.getElementById("tutoIcone").getAttribute("aria-label") || ""));

  /* PASSE H — LE CLIC PREND : un passage à côté ne reste plus au CONTEXTE, il
     entre dans la phrase. Le halo va d'abord à « ← retirer ». */
  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  const autre = H.empansDe(w, pid).find(k => k !== veut);
  H.retenir(w, autre);
  check("un autre passage se retient tout de même — et le clic l'a pris",
    w.S.retenus.includes(autre) && termes().join() === autre);
  check("mais le tutoriel ne prend pas ça pour une réponse",
    bandeau().hasAttribute("data-alerte") && !bandeau().hasAttribute("data-reduit"));
  check("et il montre « ← retirer », le geste qui défait, au composeur",
    !!halo() && halo() === retirer());
  check("sans jamais désigner celui qu'il fallait",
    ![...w.document.querySelectorAll(".empan")].some(e => e.hasAttribute("data-tuto")));
  retirer().click();
  check("retiré de la phrase, le passage reste au CONTEXTE", !w.S.compo.length && w.S.retenus.includes(autre));
  check("et l'alerte revient au texte de la pièce : ce n'est toujours pas ce qu'il demande",
    bandeau().hasAttribute("data-alerte") && halo() === w.document.querySelector(".piecetexte"));

  H.retenir(w, veut);
  check("le bon passage cliqué, l'alerte tombe — et il est déjà dans la phrase",
    !bandeau().hasAttribute("data-alerte") && termes().join() === veut);
  check("la phrase qui se tient, il se tait : « → Envoyer » se montre seul (§4.8)",
    bandeau().hidden && !halo() && !!w.document.querySelector("#composeur .envoi"));
  /* LE REPLI : retenu SANS être pris — ôté de la phrase. Le temps « prends »
     revient, sur les retenus, juste sous la pièce (§4.6). */
  retirer().click();
  check("ôté de la phrase, il reste retenu : le halo montre les retenus juste dessous, pour le prendre",
    !!halo() && halo().id === "zoneRetenus" && !!w.S.modalPiece);
  w.fermerPanneau();
  check("le CONTEXTE refermé replie la pièce avec lui", !w.S.modalPiece);
  check("le contexte étant un panneau FERMÉ, il montre la porte, pas la zone cachée",
    !!halo() && halo().id === "btnCONTEXTE");
  w.basculerPanneau("contexte");
  const zone = halo();
  check("et une fois ouvert, il montre le contexte", !!zone && zone.contains(w.document.querySelector(".mchip")));

  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut));
  check("pris sur sa fiche, la phrase se tient : il se tait",
    bandeau().hidden && !halo() && !!w.document.querySelector("#composeur .envoi"));

  w.envoyerCompo();
  check("la citation envoyée, il ne ferme pas : la comparaison reste à montrer",
    !w.localStorage.getItem("iavocat_tuto"));

  // Le second geste — même session, dès que Maître Auber attend une
  // comparaison au lieu d'une simple citation (§4.8). Les deux passages ne sont
  // plus extraits d'avance par deux questions (§3) : il faut d'abord les cliquer.
  const attenteSuivante = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  const dit = () => w.document.getElementById("tutoDit").textContent;
  const reduit = () => bandeau().hasAttribute("data-reduit");
  const veutA = attenteSuivante().attend;
  check("la citation servie, Maître Auber attend aussitôt une comparaison",
    !!H.sousTerme(H.lienTag(w, veutA)));
  const [tA, tB] = H.sousTerme(H.lienTag(w, veutA)).termes;
  const [pA, pB] = [H.deK(tA)[0], H.deK(tB)[0]];
  check("aucun des deux passages n'est encore au CONTEXTE", !w.S.retenus.includes(tA) && !w.S.retenus.includes(tB));
  /* §4.6 — la remise attend encore une réponse : le CONTEXTE est resté ouvert,
     et le halo y va tout droit — à l'index, comme pour citer. */
  check("le halo va à l'index du CONTEXTE resté ouvert : chercher d'abord",
    !!halo() && halo().id === "zoneDossier" && !reduit() && /deux passages/.test(dit()));
  check("le passage de la citation, resté au CONTEXTE, ne sonne pas faux",
    !bandeau().hasAttribute("data-alerte"));
  w.ouvrirPiece(pA);
  check("la pièce ouverte, il montre son TEXTE, jamais un empan",
    !!halo() && halo().classList.contains("piecetexte")
    && ![...w.document.querySelectorAll(".empan")].some(e => e.hasAttribute("data-tuto")));
  const servi = H.lienTag(w, w.S.satisfaits[0]).termes[0];
  const autreA = H.empansDe(w, pA).find(k => ![tA, tB, servi].includes(k) && !w.S.retenus.includes(k));
  H.retenir(w, autreA);
  check("un autre passage cliqué entre dans la phrase : l'alerte montre « ← retirer », comme pour citer",
    termes().join() === autreA && bandeau().hasAttribute("data-alerte") && !reduit() && halo() === retirer());
  retirer().click();
  w.oublier(...H.deK(autreA));
  H.retenir(w, tA);
  check("le premier passage attendu cliqué, l'alerte tombe — et il entre dans la phrase",
    !bandeau().hasAttribute("data-alerte") && termes().join() === tA);
  if (pA !== pB) {
    /* §4.8 — UNE PIÈCE QUI NE PORTE AUCUN PASSAGE ATTENDU RENVOIE À L'INDEX :
       le halo restait sur un texte où il n'y avait plus rien à chercher. */
    check("la pièce ne porte plus rien d'attendu : le halo retourne à l'index, replié par la pièce",
      !!halo() && halo().id === "zoneDossier" && /Déplie/.test(dit()) && !reduit());
    check("et le tutoriel ne déplie rien à la place du joueur",
      w.document.getElementById("dossierListe").hidden);
    w.basculerDossier();
    check("déplié, il dit d'ouvrir la pièce demandée — une consigne neuve, développée",
      halo().id === "zoneDossier" && dit().includes(w.JEU.pieces[pB].titre) && !reduit());
    w.ouvrirPiece(pB);
  } else check("(les deux passages dans la même pièce : le halo reste sur son texte)",
    !!halo() && halo().classList.contains("piecetexte"));
  check("dans la pièce du second passage, il montre son texte : consigne neuve",
    !!halo() && halo().classList.contains("piecetexte") && /second/.test(dit()) && !reduit());
  H.retenir(w, tB);
  /* §4.8, passe G — CHOISIR CE QUI LES LIE : le halo entoure les DEUX relations,
     jamais la bonne. Depuis la passe H, il y saute : plus rien à prendre. */
  const rels = () => [...w.document.querySelectorAll("#composeur .bbloc.relation")];
  check("le second cliqué rejoint le premier : plus de fiche à prendre, le halo montre les deux relations — toute la zone, jamais la bonne",
    termes().length === 2 && termes().includes(tB)
    && !!halo() && halo().matches("#composeur .offre") && rels().length === 2
    && !rels().some(b => b.hasAttribute("data-tuto")) && /choisis/i.test(bandeau().textContent));
  const vraie = H.sousTerme(H.lienTag(w, veutA)).forme;
  w.document.querySelector(`#composeur [data-f="rel:${vraie}"]`).click();
  w.fermerPiece();      // l'index se déplie : le cas « pièce ouverte » vient plus bas
  /* §4.5 — un texte s'invoque une fois RETENU (passe F). Tant que l'article ne
     l'est pas, le bandeau montre OÙ LE LIRE : il ne dit pas « Envoyer » alors
     que la leçon est l'article. */
  /* §4.8 — L'ARTICLE SE DÉSIGNE, LA RELATION JAMAIS : sa puce dans l'index, puis
     son texte. Dérivé du lien, comme le tutoriel. */
  const art = w.JEU.grammaire.blocs.find(b => b.type === "liaison" && b.imbrique
    && b.forme === H.lienTag(w, veutA).forme);
  check("les deux posés, l'article n'est pas retenu : le halo montre SA puce, dans l'index",
    !!art && !!halo() && halo().getAttribute("data-f") === "d:" + art.piece
    && w.document.getElementById("zoneDossier").contains(halo()));
  check("et la bulle invite à le lire, développée",
    !bandeau().hasAttribute("data-reduit") && /dossier/.test(w.document.getElementById("tutoDit").textContent));
  w.basculerDossier();
  check("l'index replié, la puce cachée : le halo montre « déplier », sa porte",
    !!halo() && halo().getAttribute("data-f") === "dossier"
    && /Déplie/.test(w.document.getElementById("tutoDit").textContent));
  check("et le tutoriel ne déplie rien à la place du joueur",
    w.document.getElementById("dossierListe").hidden);
  w.basculerDossier();
  check("déplié, le halo revient à la puce de l'article",
    !!halo() && halo().getAttribute("data-f") === "d:" + art.piece);
  /* Le cas COURANT : la citation d'avant a laissé sa pièce ouverte, et une
     pièce ouverte replie l'index. */
  w.ouvrirPiece(H.deK(tA)[0]);
  check("une pièce ouverte replie l'index : le halo montre « déplier »",
    !!halo() && halo().getAttribute("data-f") === "dossier");
  w.basculerDossier();
  check("déplié pièce ouverte, la puce de l'article pulse",
    !!halo() && halo().getAttribute("data-f") === "d:" + art.piece);
  w.ouvrirPiece(art.piece);
  check("l'article ouvert, le halo montre SON texte, à cliquer",
    !!halo() && halo().classList.contains("piecetexte") && /Clique sur le texte/.test(dit()));
  check("ouvrir ne suffit plus : l'article n'est offert nulle part (passe F)",
    !w.R.blocsOfferts(w.S).some(b => w.R.estLiaisonArticle(b)));
  const cle = H.cleArticle(w, art.piece);
  H.retenir(w, cle);
  check("cliqué, son texte se retient ET fonde la phrase — plus de fiche à prendre (passe H)",
    w.S.retenus.includes(cle) && w.R.compoFinie(w.S)
    && w.R.chaineCompo(w.S).some(p => w.R.estLiaisonArticle(p.bloc) && p.bloc.piece === art.piece));
  check("et le composeur ne propose aucun article",
    !w.document.querySelector("#composeur .bbloc.fondement"));
  check("la phrase achevée, il se tait, là aussi", bandeau().hidden && !halo());
  w.envoyerCompo();
  check("les deux gestes montrés, le tutoriel se tait pour de bon",
    bandeau().hidden && !halo());
  check("et il ne reviendra pas", !!w.localStorage.getItem("iavocat_tuto"));
}
{
  /* §4.8 — LE REPLI DES FICHES, AU SECOND GESTE : ce qui fut retenu sans être
     pris se prend au CONTEXTE, et le halo l'y montre. Le chemin direct n'y passe
     plus (passe H) — sans ce bloc, ces temps ne seraient plus jamais rejoués. */
  const w = H.boot({url:"http://localhost/"});
  const halo = () => w.document.querySelector("[data-tuto]");
  const dit = () => w.document.getElementById("tutoDit").textContent;
  const attente = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  H.composerLien(w, H.lienTag(w, attente().attend));
  const L = H.lienTag(w, attente().attend), sous = H.sousTerme(L);
  check("(la citation servie, la comparaison est attendue)", !!sous);
  const [tA, tB] = sous.termes;
  if (w.document.getElementById("panCONTEXTE").hidden) w.basculerPanneau("contexte");
  H.surligner(w, tA); H.surligner(w, tB);              // retenus seuls
  check("les deux retenus sans être pris : le halo montre les retenus, pour en prendre un premier",
    !w.S.compo.length && !!halo() && halo().id === "zoneRetenus" && /premier/.test(dit()));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tA));
  check("un premier pris sur sa fiche, il en faut un second", !!halo() && halo().id === "zoneRetenus" && /second/.test(dit()));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tB));
  H.choisirRelation(w, sous.forme);
  H.lireLeTexte(w, L.forme);                            // retenu seul : il attend sa fiche
  const pid = w.JEU.grammaire.blocs.find(b => w.R.estLiaisonArticle(b) && b.forme === L.forme).piece;
  const cle = H.cleArticle(w, pid);
  check("l'article retenu sans être pris : le halo montre SA FICHE au CONTEXTE",
    !w.R.compoFinie(w.S) && !!halo() && halo().getAttribute("data-f") === "c:" + cle
    && w.document.getElementById("zoneRetenus").contains(halo()));
  w.document.querySelector(`#zoneRetenus [data-f="c:${cle}"]`).click();
  check("pris sur sa fiche, la phrase se tient : il se tait",
    w.R.compoFinie(w.S) && w.document.getElementById("tuto").hidden && !halo());
}
{
  /* §4.8 — UN GESTE DÉJÀ MONTRÉ NE RALLUME PAS LE HALO. La remise 1 du jour
     enchaîne la citation et la comparaison (§3) : plus de seconde citation entre
     les deux. Contenu MUTÉ, donc — on en intercale une, servie par une citation
     sans tag qu'on tague —, sans quoi ce contrôle passerait par le vide. */
  const c = H.contenuLivre();
  const as = H.attentesContenu(c.remises[0]);
  const libre = c.liens.find(L => !L.tag && typeof L.termes[0] === "string");
  check("le contenu muté a sa seconde citation", !!libre && as.length > 1);
  if (libre && as.length > 1) {
    libre.tag = "_seconde_citation";
    as.splice(1, 0, { attend: libre.tag, question: "Et celle-ci ?" });
    const w = H.boot({ contenu: c, url: "http://localhost/" });
    const bandeau = () => w.document.getElementById("tuto");
    H.composerLien(w, H.lienTag(w, as[0].attend));
    w.basculerPanneau("contexte");
    check("une seconde citation, geste déjà connu, ne rallume pas le halo",
      w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend === libre.tag
      && bandeau().hidden && !w.document.querySelector("[data-tuto]"));
    H.composerLien(w, libre);
    check("et la comparaison venue, il reparle", !bandeau().hidden && !!w.document.querySelector("[data-tuto]"));
  }
}
/* §3 — LA REMISE DU TUTORIEL SE SERT DANS L'ORDRE (retour de playtest, Jean).
   La réponse à la deuxième question, envoyée à la première, la servait par
   anticipation : sa réplique tombait, la phrase entrait en PLAIDOIRIE, la
   deuxième question n'était jamais posée — et le tutoriel, tenant la citation
   pour acquise, se taisait au milieu du geste. */
console.log("\n=== La remise du tutoriel se sert dans l'ordre ===");
{
  const w = H.boot({url:"http://localhost/"});
  const bandeau = () => w.document.getElementById("tuto");
  const dernier = () => w.S.fil[w.S.fil.length - 1].texte;
  const courante = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  const [a1, a2] = w.R.attentesDe(w.R.remiseCourante(w.S));
  const L1 = H.lienTag(w, a1.attend), L2 = H.lienTag(w, a2.attend);
  check("la remise 1 attend au moins deux réponses", !!L1 && !!L2);

  const i = H.composerLien(w, L2);
  check("la réponse à la question suivante, envoyée trop tôt, part bien", i >= 0);
  check("mais elle ne sert pas une question qui n'est pas posée", !w.S.satisfaits.includes(a2.attend));
  check("l'avocat répond à côté — pas avec la réplique de la question à venir",
    dernier() !== L2.rep && w.JEU.avocat.rep_hors_sujet.includes(dernier()));
  check("rien n'entre en PLAIDOIRIE", w.moyensRetenus().length === 0);
  check("la question courante reste la première", courante().attend === a1.attend);
  check("et le tutoriel ne tient pas la citation pour acquise : il reste là", !bandeau().hidden);

  H.composerLien(w, L1);
  check("la bonne réponse sert la première question", w.S.satisfaits.includes(a1.attend));
  check("et la deuxième est posée, cette fois", courante().attend === a2.attend && dernier() === a2.question);
  const j = H.composerLien(w, L2);
  check("la phrase envoyée trop tôt repart quand sa question vient",
    j === i && w.S.satisfaits.includes(a2.attend));
  check("et elle n'entre qu'une fois en PLAIDOIRIE",
    w.moyensRetenus().filter(x => x.b === i).length === 1);
}
/* §4.8 — NEUVE VEUT DIRE JAMAIS MONTRÉE (retour de playtest, Jean) : revenir de
   l'envoi à la prise d'un passage après « tout effacer » redéployait une
   consigne déjà lue. */
console.log("\n=== Une consigne déjà lue reste réduite ===");
{
  const w = H.boot({url:"http://localhost/"});
  const bulle = () => w.document.getElementById("tuto");
  const reduite = () => bulle().hasAttribute("data-reduit");
  const pas = () => w.document.getElementById("tutoDit").textContent;
  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  const autre = H.empansDe(w, pid).find(k => k !== veut);

  H.surligner(w, autre);
  check("un passage à côté : l'alerte se déploie", bulle().hasAttribute("data-alerte") && !reduite());
  w.oublier(...H.deK(autre));
  check("oublié, la consigne d'avant revient — déjà lue, réduite", !bulle().hasAttribute("data-alerte") && reduite());
  H.surligner(w, autre);
  check("mais l'alerte, déjà vue, se redéploie à la nouvelle erreur", bulle().hasAttribute("data-alerte") && !reduite());

  H.surligner(w, veut);
  const avant = pas();
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut));
  check("la phrase qui se tient : la bulle se tait", bulle().hidden);
  w.viderCompo();
  check("« tout effacer » ramène la consigne d'avant", pas() === avant);
  check("déjà lue, elle reste réduite", reduite() && !bulle().hidden);
}
/* §4.8 — LA BULLE NE COMPTE PAS, ET SE FERME PAR UNE CROIX (retour de l'auteur). */
{
  const w = H.boot({url:"http://localhost/"});
  const bulle = w.document.getElementById("tuto");
  check("la bulle ne porte aucun rang", !w.document.getElementById("tutoPas")
    && !/\d+\s*\/\s*\d+/.test(bulle.textContent));
  const croix = w.document.getElementById("tutoPasser");
  check("elle se ferme par la croix des autres fenêtres, nommée",
    !!croix && croix.tagName === "BUTTON" && croix.classList.contains("fermer")
    && croix.textContent.trim() === "×" && (croix.getAttribute("aria-label") || "").length > 1);
  croix.click();
  check("la croix clôt le tutoriel pour de bon",
    bulle.hidden && !w.document.querySelector("[data-tuto]") && !!w.localStorage.getItem("iavocat_tuto"));
}
{
  const avec = H.boot({url:"http://localhost/"});
  const sans = H.boot({graine:{iavocat_tuto:"1"}});
  check("déjà vu, il ne s'affiche plus",
    sans.document.getElementById("tuto").hidden && !sans.document.querySelector("[data-tuto]"));
  check("et l'état de départ est identique, halo ou pas",
    JSON.stringify(avec.S) === JSON.stringify(sans.S));
}

console.log("\n=== Le panneau de la pièce ===");
{
  const w = boot();
  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const m = () => w.document.querySelector("#panPiece").innerHTML;
  check("le titre et le signataire s'affichent",
    m().includes(w.JEU.pieces[pid].titre) && m().includes(w.JEU.pieces[pid].qui));
  const eid = Object.keys(w.JEU.pieces[pid].empans)[0];
  w.surligner(pid, eid);
  check("l'empan surligné se marque « pris » dans le panneau", m().includes("empan pris"));
  const empan = w.JEU.pieces[pid].empans[eid];
  check("et apparaît dans le contexte",
    contexte(w).includes("zoneRetenus") && contexte(w).includes(empan.nom || empan.texte));
  w.fermerPiece();
  check("fermer la pièce n'efface pas le contexte", w.S.retenus.length === 1);
  const pidR = H.pidRegle(w);
  if (!Object.keys(w.JEU.pieces[pidR].empans || {}).length) {
    w.ouvrirPiece(pidR);
    check("une règle sans empan s'affiche sans planter", m().includes(w.JEU.pieces[pidR].titre));
  } else check("(la règle testée porte des empans)", true);
}

/* §4.6 — L'INDEX SE REPLIE, ET LAISSE LA PLACE AU RESTE (retours de Jean et de
   l'auteur) : déplié, il mangeait la moitié du panneau et la pièce n'y montrait
   plus que deux lignes. Ce qui se lit ici est l'ÉTAT du DOM ; la hauteur
   gagnée, aucune suite ne la voit — `npm run vue` seul. */
console.log("\n=== L'index se replie ===");
{
  const w = boot();
  H.livrerTout(w);
  const d = w.document;
  const bascule = () => d.querySelector('#zoneDossier [data-f="dossier"]');
  const liste = () => d.getElementById("dossierListe");
  const visible = el => !!el && !el.hidden && !el.closest("[hidden]");
  const deplie = () => visible(liste()) && bascule().getAttribute("aria-expanded") === "true";
  const replie = () => !visible(liste()) && bascule().getAttribute("aria-expanded") === "false";
  const [pA, pB] = w.R.piecesLivrees(w.S);
  w.basculerPanneau("contexte");
  check("sans pièce ouverte, l'index est déplié — et une bascule le replie à tout moment", !!bascule() && deplie());
  check("la ligne dit DOSSIER, et ne compte rien (§4.6)",
    /DOSSIER/.test(bascule().textContent) && !/\d/.test(bascule().textContent));
  w.basculerDossier();
  check("replié sans pièce : il laisse la place aux retenus", replie());
  check("le focus reste sur la bascule", d.activeElement === bascule());
  check("replié, il reste l'ancre du tutoriel (R6), ses puces sous `hidden` : rien n'est retiré",
    !!d.getElementById("zoneDossier") && !!d.querySelector(`#dossierListe [data-f="d:${pA}"]`));
  w.basculerDossier();

  w.ouvrirPiece(pA);
  check("une pièce ouverte le replie d'elle-même", replie());
  w.basculerDossier();
  check("un clic le déplie", deplie());
  d.querySelector(`#contexte [data-f="d:${pB}"]`).click();
  check("choisir une autre pièce la remplace — et replie l'index", w.S.modalPiece === pB && replie());
  w.fermerPiece();
  check("la pièce repliée, il revient au choix d'avant : déplié", deplie());

  w.basculerDossier(); w.fermerPanneau();
  w.voirPiecesRecues();
  check("le bouton de pièces du message le déplie : on vient voir ce qu'on a reçu", deplie());
  w.basculerDossier();
  w.ouvrirPiece(pA); w.fermerPiece();
  check("replié par le joueur avant la pièce, il le reste après", replie());
}

console.log("\n=== Les répliques : seulement au versement ===");
{
  const w = boot();
  const L = w.JEU.liens.find(x => x.rep && !x.vice && !x.faux);
  /* PIÈGE PAYÉ : « composée mais pas partie » ne s'obtient PAS au journal — le
     journal ne se remplit qu'à l'envoi, et `clore` n'est pas une porte d'écran
     (§16). Ça s'obtient au COMPOSEUR, en n'envoyant pas : le geste du joueur. */
  check("une phrase à réplique propre s'assemble", H.assembler(w, L));
  check("assemblée, elle ne dit rien", !discussion(w).includes(L.rep.slice(0, 25)));
  check("et rien n'est transmis", !w.S.brouillon.length && !w.S.plaidoirie.length);
  w.envoyerCompo();
  const i = w.S.brouillon.findIndex(n => w.M.memeRed(n.reduite, {forme: L.forme, termes: L.termes}));
  check("envoyée, la réplique du lien sort", discussion(w).includes(L.rep.slice(0, 25)));
  check("la phrase est marquée envoyée", i >= 0 && w.S.brouillon[i].versee);
  check("l'envoi vide la phrase en attente", w.S.prete === null);
  const avant = w.S.plaidoirie.length;
  w.envoyer(i);
  check("envoyer deux fois est sans effet", w.S.plaidoirie.length === avant);
}

/* §4.6 — LA REMISE PORTE SA PREMIÈRE QUESTION, ET LES PIÈCES VIENNENT APRÈS
   (demande de l'auteur) : Colas ouvrait les pièces sans avoir lu la question,
   posée dans une seconde bulle sous le bouton. */
console.log("\n=== La remise et sa question : un seul message, les pièces après ===");
{
  const w = boot();
  const q = (w.R.attentesDe(w.R.remiseCourante(w.S))[0] || {}).question;
  check("la première attente pose une question", !!q);
  const bulles = [...w.document.querySelectorAll("#discussion .bubble")];
  check("la remise et sa question ne font qu'un message", bulles.length === 1 && bulles[0].textContent.includes(q));
  const t = bulles[0].textContent, att = bulles[0].querySelector(".attach");
  check("et le bouton de pièces vient APRÈS la question",
    !!att && t.indexOf(q) >= 0 && t.indexOf(q) < t.indexOf(att.textContent.trim()));
  check("le composeur ne la redit pas : elle est le dernier mot", !composeur(w).includes(q));
}

console.log("\n=== L'économie de l'écran : ce qui est déjà sous les yeux ===");
{
  const w = boot();
  /* PIÈGE : une attente n'a pas forcément de question — une remise PEUT la
     porter dans son texte, et le moteur l'accepte. On avance jusqu'à celle qui
     en pose une, au lieu de parier sur le contenu du jour. */
  const courante = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  while (courante() && !courante().question)
    w.envoyer(H.composerLien(w, H.lienTag(w, courante().attend)));
  const q = courante();
  // Le dernier mot : la question qu'un message de remise porte, ou un message qui n'est qu'elle (§4.6).
  const finDe = m => m.question || m.texte;
  check("la question vient d'être posée : elle est le dernier mot",
    !!q && !!q.question && finDe(w.S.fil[w.S.fil.length - 1]) === q.question);
  check("le composeur ne la répète donc pas", !composeur(w).includes(q.question));
  // La réplique de `declenche` part à la FERMETURE de la pièce (§4.10 règle 3).
  w.ouvrirPiece(H.pidAvecDeclenche(w)); w.fermerPiece();
  check("l'avocat ayant repris la parole, la question n'est plus le dernier mot",
    finDe(w.S.fil[w.S.fil.length - 1]) !== q.question);
  check("le composeur la rappelle alors", composeur(w).includes(q.question));
}

console.log("\n=== Le plan ne retient que les moyens ===");
{
  const w = boot();
  H.livrerTout(w);   // toutes les tournures reçues, pour atteindre l'observation
  const obs = w.JEU.liens.find(x => !x.tag && !x.conclusion && !x.faux);
  const i = H.composerLien(w, obs);
  check("l'observation se compose", i >= 0);
  w.envoyer(i);
  check("l'observation est bien partie", w.S.brouillon[i].versee);
  check("l'avocat y a répondu", w.S.fil.length > 1);
  check("mais elle n'entre pas au plan", !plaidoirie(w).includes(w.S.brouillon[i].texte));
  check("et rien n'ouvre le plan de soi-même", !plaidoirieVisible(w));
  check("mais sa porte est là dès le premier écran",
    !!w.document.getElementById("btnPLAIDOIRIE"));
  const moyen = H.lienTag(w, w.R.attentesDe(w.JEU.remises[0])[0].attend);
  const j = H.composerLien(w, moyen);
  w.envoyer(j);
  check("un moyen, lui, s'y inscrit", plaidoirie(w).includes(w.S.brouillon[j].texte));
  check("et le panneau ne s'ouvre toujours pas tout seul", !plaidoirieVisible(w));
  w.basculerPanneau("plaidoirie");
  check("c'est sa porte qui l'ouvre", plaidoirieVisible(w));
}
{
  const w = boot();
  H.instruire(w);
  const i = H.composerLien(w, H.lienFaux(w));
  check("le faux vice se compose", i >= 0);
  check("le faux vice reçoit rep_faux", discussion(w).includes(w.JEU.avocat.rep_faux.slice(0, 25)));
  const txt = H.terminer(w);
  check("et déclenche la variante_faux de la fin", txt.includes(w.JEU.fins[3].variante_faux.slice(0, 25)));
}
{
  const w = boot();
  H.livrerTout(w);
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  H.phrasesBruit(w, 3);
  const n = w.S.brouillon.length;
  for (let i = 0; i < n; i++) w.envoyer(i);
  check("les phrases sans lien font monter l'escalade « sans rapport »", w.S.incompris >= 2);
  check("la seconde réplique n'est pas la première",
    discussion(w).includes(w.JEU.avocat.rep_sans_rapport[1].slice(0, 20)));
  check("l'escalade des comparaisons nues est un compteur séparé, et reste à zéro",
    w.S.inutiles === 0);
}
{
  const w = boot();
  const bc = H.blocCite(w);
  if (bc) {
    for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
    const attendus = new Set(H.citations(w).map(L => L.termes[0]));
    const horsSujet = w.CHAMPS.filter(c => !attendus.has(c.id)).slice(0, 2);
    for (const e of horsSujet) {
      const i = H.composerLien(w, { forme: bc.forme, termes: [e.id] });
      if (i >= 0) w.envoyer(i);
    }
    check("citer un passage qui ne répond pas fait monter « hors sujet »", w.S.hors_sujet >= 2);
    check("l'avocat renvoie à la question",
      discussion(w).includes(w.JEU.avocat.rep_hors_sujet[0].slice(0, 20)));
    check("et les deux autres escalades restent à zéro",
      w.S.incompris === 0 && w.S.inutiles === 0);
  }
}

console.log("\n=== La répétition de plaidoirie ===");
{
  const w = boot();
  H.instruire(w);
  H.composerLien(w, H.lienConclusion(w));
  w.cloturer();
  check("la répétition commence sur l'affirmation 1",
    discussion(w).includes(w.JEU.repetition.affirmations[0].texte.slice(0, 20)));
  check("le présentoir propose ce qui a été écrit", discussion(w).includes("Opposer une phrase"));
  check("confirmer pendant la répétition est refusé", w.document.getElementById("btnCloture").disabled);
  const avancer = () => w.document.querySelector('[data-f="rsuite"]').textContent;
  check("rien d'opposé encore : le bouton d'avance dit qu'on n'oppose rien", /Ne rien opposer/.test(avancer()));
  const cadre = () => w.document.querySelector("#discussion .repet");
  check("le cadre redit l'affirmation en cours : la réplique ne la lui fait plus perdre (§4.6)",
    !!cadre() && cadre().textContent.includes(w.JEU.repetition.affirmations[0].texte.slice(0, 20)));
  check("pendant la répétition, la voix du composeur se tait",
    w.S.compo.length === 0 && !w.document.querySelector("#composeur .phrase").textContent.trim());
  /* L'AVOCAT TRIE (§4.6) : ce qui répond à l'affirmation se met en face, avec
     SA réplique ; le reste est dit à côté, et ne bouge pas. Les deux phrases se
     DÉRIVENT de la règle, `R.repondA` — aucune n'est nommée. */
  const moyens = w.S.brouillon.map((n, k) => k).filter(k => w.R.estMoyen(w.S.brouillon[k].lien));
  const aff0 = w.JEU.repetition.affirmations[0];
  const i = moyens.find(k => w.R.repondA(aff0, w.S.brouillon[k]));
  const aCote = moyens.find(k => !w.R.repondA(aff0, w.S.brouillon[k]));
  check("le contenu livré offre de quoi trier : une phrase qui répond, une qui ne répond pas",
    i !== undefined && aCote !== undefined);
  let avant = w.S.fil.length;
  w.verserContre(aCote);
  check("une phrase qui ne répond pas n'est pas mise en face",
    !w.S.plaidoirie.some(x => x.b === aCote && x.contre === 0));
  check("et l'avocat dit qu'elle est à côté", w.S.fil.length === avant + 1
    && w.S.fil[w.S.fil.length - 1].texte === w.JEU.avocat.rep_a_cote);
  w.verserContre(i);
  check("verser contre une affirmation marque la cible", w.S.plaidoirie.some(x => x.b === i && x.contre === 0));
  check("avec la réplique de cette affirmation, pas une réplique unique",
    w.S.fil[w.S.fil.length - 1].texte === (aff0.oppose || w.JEU.avocat.deja)
    && w.S.fil[w.S.fil.length - 1].texte !== w.JEU.avocat.rep_a_cote);
  check("une phrase opposée, il dit seulement « Continuer » — plus le contraire du geste",
    avancer() === "Continuer");
  check("l'affichage nomme l'affirmation opposée", plaidoirie(w).includes(aff0.court));
  /* OPPOSER EST LE DERNIER GESTE RÉEL (§4.6). Toute phrase du journal est DÉJÀ
     versée — le journal ne se remplit qu'à l'envoi — donc c'est sur une phrase
     déjà partie qu'il faut éprouver l'opposition. Le contrôle manquait, et son
     absence a laissé le présentoir mourir en silence, vert en test et mort en jeu. */
  avant = w.S.fil.length;
  w.verserContre(i);
  check("la ré-opposer à la MÊME affirmation ne redit rien", w.S.fil.length === avant);
  if (w.JEU.repetition.affirmations.length > 1) {
    w.avancerRepetition();
    const bouton = w.document.querySelector(`#discussion [data-f="r:${i}"]`);
    check("opposée ailleurs, son bouton dit qu'il DÉPLACE — plus un « opposer » muet",
      !!bouton && bouton.textContent === "déplacer ici");
  }
  while (w.S.repetitionIdx < w.JEU.repetition.affirmations.length) w.avancerRepetition();
  check("au bout, la répétition se clôt sur son texte de fin", discussion(w).includes(w.JEU.repetition.fin.slice(0, 15)));
  check("la clôture est de nouveau ouverte", !w.document.getElementById("btnCloture").disabled);
}
{
  /* SANS `repond`, UNE AFFIRMATION PREND TOUT (§11) — l'ancienne conduite, qu'on
     ne retire pas. C'est là que le déplacement s'éprouve : dans le contenu livré,
     aucune phrase ne répond à deux affirmations. */
  const c = H.contenuLivre();
  for (const a of c.repetition.affirmations) { delete a.repond; delete a.oppose; }
  const w = H.boot({ contenu: c });
  H.instruire(w);
  w.cloturer();
  const i = w.S.brouillon.findIndex(n => w.R.estMoyen(n.lien));
  w.verserContre(i);
  check("sans `repond`, l'affirmation prend la première phrase venue", w.S.plaidoirie.some(x => x.b === i && x.contre === 0));
  if (w.JEU.repetition.affirmations.length > 1) {
    w.avancerRepetition();
    w.document.querySelector(`#discussion [data-f="r:${i}"]`).click();
    check("l'opposer à une AUTRE déplace sa cible, phrase déjà versée comprise",
      w.S.plaidoirie.some(x => x.b === i && x.contre === w.S.repetitionIdx));
    check("et l'avocat le dit", discussion(w).includes(w.JEU.avocat.deja.slice(0, 15)));
  } else check("(une seule affirmation dans ce contenu)", true);
}
{
  const w = boot();
  H.instruire(w);   // le chemin docile envoie tout ce qu'il compose
  w.cloturer();
  check("la continuation ne laisse aucune prémisse orpheline",
    w.S.brouillon.every(n => n.versee));
  /* Tout est versé — et le présentoir reste VIVANT. C'est tout le point : il
     n'offrait auparavant que des lignes « déjà envoyée », un rituel sans choix. */
  const offerts = w2n => (w2n.document.getElementById("discussion").innerHTML.match(/verserContre\(/g) || []).length;
  check("tout étant parti, le présentoir offre quand même d'opposer", offerts(w) > 0);
  check("et il ne montre que les moyens, comme la PLAIDOIRIE",
    offerts(w) === w.S.brouillon.filter(n => w.R.estMoyen(n.lien)).length);
  /* LA CHARNIÈRE DE LA FIN 2, dans l'état où le joueur la tient vraiment : la
     conclusion ASSEMBLÉE au composeur, comprise et tue, pendant que l'avocat
     récite l'accusation. */
  const w2 = boot();
  H.instruire(w2);
  H.assembler(w2, H.lienConclusion(w2));
  w2.cloturer();
  check("la conclusion assemblée traverse l'ouverture de la répétition",
    w2.R.peutEnvoyer(w2.S));
  check("c'est le dernier moment où elle peut partir",
    w2.S.vice_trouve && !w2.S.vice_expose);
}
{
  const w = boot();
  H.instruire(w);
  const garde = w.S.brouillon.slice();
  w.S.brouillon.length = 0; w.S.plaidoirie.length = 0;
  w.cloturer();
  check("journal vide → présentoir vide, sans planter", discussion(w).includes("aucune phrase à y opposer"));
  w.S.brouillon.push(...garde);
}

console.log("\n=== Les deux surfaces, en panneaux ===");
{
  const w = boot();
  const ouvert  = n => !w.document.getElementById("pan"+n).hidden;
  const bouton  = () => w.document.querySelector("#composeur button.versCONTEXTE");
  const attente = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  const question = () => attente().question;

  check("au premier écran, aucun panneau n'est ouvert", !ouvert("CONTEXTE") && !ouvert("PLAIDOIRIE"));
  check("les deux portes sont là, dans le titre du composeur",
    !!w.document.getElementById("btnCONTEXTE") && !!w.document.getElementById("btnPLAIDOIRIE"));
  check("la phrase attend un passage, donc la voix se clique aussi", !!bouton());

  /* LA VOIX — elle ouvre POUR ÉCRIRE, donc le panneau suivra la phrase. */
  w.ouvrirCONTEXTE();
  check("la voix ouvre le CONTEXTE", ouvert("CONTEXTE"));

  const veut = H.lienTag(w, attente().attend).termes[0];
  const [pid] = H.deK(veut);
  w.ouvrirPiece(pid); H.surligner(w, veut); w.fermerPiece();
  check("ouvrir une pièce depuis le panneau ne le referme pas", ouvert("CONTEXTE"));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, veut));
  check("un passage posé, la voix se tait — plus de bouton", !bouton());
  check("mais le panneau RESTE ouvert : la phrase accepterait encore un passage", ouvert("CONTEXTE"));
  w.envoyerCompo();
  /* §4.6 — envoyer ne referme le CONTEXTE que si la REMISE change : la question
     suivante voudra le clavier. Il reste, mais en CONSULTATION désormais. */
  check("la phrase partie, la remise attend encore : le CONTEXTE RESTE ouvert", ouvert("CONTEXTE"));
  w.rendreTout();
  check("et il ne suit plus la phrase : on consulte", ouvert("CONTEXTE"));
  w.fermerPanneau();

  /* §4.9 règle 3 — ce qui reste LISIBLE ne se répète pas, et LISIBLE est la
     condition, pas PRÉSENT. EN DESSOUS DU SEUIL de `.wrap.avecLateral` (§4.6),
     le panneau ne couvre rien, mais la conversation est la seule bande
     élastique EN HAUTEUR : c'est elle qui cède, et panneau ouvert, bandeau du
     tutoriel affiché, il peut lui rester moins que la question — un joueur a
     composé sa réponse sans la voir. Panneau ouvert, elle redescend au
     composeur ; refermé, elle se tait. `avecLateral` est ici lu comme classe —
     jsdom ne pose aucune `@media`, donc rien ici n'affirme un partage réel de
     largeur ou de hauteur, seulement l'état que `majLateral` calcule. */
  check("l'avocat vient de poser une question", !!question());
  check("elle est son dernier mot, donc le composeur ne la redit pas",
    !composeur(w).includes(question()));
  const partage = () => w.document.querySelector(".wrap").classList.contains("avecLateral");
  check("aucun panneau ouvert, la conversation a toute la hauteur", !partage());
  w.basculerPanneau("contexte");
  check("le panneau ouvert, les deux se partagent la hauteur", partage());
  check("la conversation ayant cédé sa place, le composeur reprend la question",
    composeur(w).includes(question()));
  w.fermerPanneau();
  check("refermé, la conversation reprend toute la hauteur", !partage());
  check("et la question, de nouveau lisible, se tait au composeur",
    !composeur(w).includes(question()));

  /* LA BARRE — on consulte : le panneau ne suit plus la phrase. */
  w.basculerPanneau("contexte");
  check("la porte ouvre", ouvert("CONTEXTE"));
  w.basculerPanneau("contexte");
  check("et referme — c'est une bascule", !ouvert("CONTEXTE"));
  w.basculerPanneau("plaidoirie");
  check("l'autre porte ouvre la PLAIDOIRIE", ouvert("PLAIDOIRIE"));
  check("et une seule surface à la fois", !ouvert("CONTEXTE"));
  w.fermerPanneau();

  /* LA COMPARAISON — le panneau doit tenir entre les DEUX passages. Elle suit
     la citation (§3) : on retient ses deux passages, chacun dans sa pièce. */
  const sous = H.sousTerme(H.lienTag(w, attente().attend));
  check("Maître Auber attend maintenant une comparaison", !!sous);
  const [tA, tB] = sous.termes;
  for (const k of [tA, tB]) { w.ouvrirPiece(H.deK(k)[0]); H.surligner(w, k); w.fermerPiece(); }
  w.fermerPanneau();
  /* L'article LU d'abord : non lu, le CONTEXTE reste — c'est là qu'on va le
     lire (§4.6), et le contrôle qui suit figeait ce défaut. */
  H.lireLeTexte(w, H.lienTag(w, attente().attend).forme);
  w.fermerPanneau(); w.ouvrirCONTEXTE();
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tA));
  check("le PREMIER des deux posé, il en faut un second : le panneau RESTE ouvert", ouvert("CONTEXTE"));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tB));
  /* §4.6, passe G — le choix de la relation a lieu au composeur, et le panneau
     ouvert pour écrire RESTE : l'article qui suit se prend chez lui. */
  check("les deux posés, la relation à choisir au composeur : le panneau RESTE ouvert", ouvert("CONTEXTE"));
  check("et la voix demande ce qui les lie, sans mener ailleurs — le geste est ICI",
    !bouton() && /qui les lie/.test((w.document.querySelector("#composeur span.aide") || {}).textContent || ""));
  H.choisirRelation(w, sous.forme);
  /* §4.6 — L'ARTICLE SE PREND AU CONTEXTE (passe F) : la phrase qui l'attend n'a
     rien à prendre au composeur, et le panneau ouvert pour écrire reste. */
  check("les deux posés, l'article reste à prendre au CONTEXTE : le panneau RESTE ouvert", ouvert("CONTEXTE"));
  check("et la voix qui réclame l'article y mène — c'est là qu'il se prend", !!bouton());
  const pidArt = w.JEU.grammaire.blocs.find(b => w.R.estLiaisonArticle(b)
    && b.forme === H.lienTag(w, attente().attend).forme).piece;
  w.prendreArticle(H.cleArticle(w, pidArt));
  check("l'article pris sur sa fiche, la phrase achevée : il s'est refermé",
    w.R.compoFinie(w.S) && !ouvert("CONTEXTE"));

  /* CONSULTER N'EST PAS ÉCRIRE — ouverte depuis la barre, elle ne se referme pas
     bien que la phrase n'accepte plus aucun passage. */
  w.basculerPanneau("contexte");
  check("depuis la barre, le panneau s'ouvre même quand la phrase n'a plus rien à y prendre",
    ouvert("CONTEXTE"));
  w.rendreTout();
  check("et il ne se referme pas tout seul : on consulte, on n'écrit pas", ouvert("CONTEXTE"));
  w.fermerPanneau();
  check("la croix referme", !ouvert("CONTEXTE"));

  /* §4.6 — la remise CHANGE : un dossier arrive, on revient lire l'avocat. */
  w.basculerPanneau("contexte");
  const remise = w.S.remisesEnvoyees;
  H.lireLeTexte(w, H.lienTag(w, attente().attend).forme);
  H.composerLien(w, H.lienTag(w, attente().attend));
  check("la dernière réponse ouvre une remise neuve", w.S.remisesEnvoyees === remise + 1);
  check("et le CONTEXTE se referme avec la remise close", !ouvert("CONTEXTE"));
  const L2 = H.lienTag(w, attente().attend);
  H.lireLeTexte(w, L2.forme);
  H.composerLien(w, L2, {garder:true});
  w.basculerPanneau("plaidoirie");
  const versees = w.S.plaidoirie.length;
  check("la phrase prête, la PLAIDOIRIE ouverte", ouvert("PLAIDOIRIE") && w.R.peutEnvoyer(w.S));
  w.envoyerCompo();
  check("la PLAIDOIRIE, elle, se referme à chaque envoi : on n'y écrit pas",
    w.S.plaidoirie.length === versees + 1 && !ouvert("PLAIDOIRIE"));
}

/* §4.10 — Un playtest mené au clavier : le premier geste du jeu était
   impossible sans souris, et aucune suite ne le voyait. Ce qui se lit ici se
   lit sur le DOM rendu, jamais sur le contenu. */
console.log("\n=== Le jeu se joue au clavier ===");
{
  const w = H.boot({url:"http://localhost/"});
  const d = w.document;
  const touche = (el, key) => el.dispatchEvent(new w.KeyboardEvent("keydown", {key, bubbles:true}));
  const actif = () => d.activeElement;
  const cleActive = () => actif() && actif().getAttribute("data-f");
  const annonce = () => d.getElementById("annonce").textContent;
  const inerte = () => d.querySelector(".wrap").hasAttribute("inert");
  /* Tout ce qui porte un `onclick` s'atteint au clavier : un <button>, ou un
     élément qui se déclare bouton ET entre dans l'ordre de tabulation. Seul le
     voile de la pièce en est dispensé — Échap et la croix le doublent. */
  const injoignables = () => [...d.querySelectorAll("[onclick]")].filter(el =>
    el.tagName !== "BUTTON" && !el.classList.contains("overlay")
    && !(el.getAttribute("role") === "button" && el.getAttribute("tabindex") === "0"));

  check("au premier écran, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);
  check("rien ne s'annonce au démarrage : la page se lit dans l'ordre", annonce() === "");

  const pid = H.pidPremiereRemise(w);
  const jointe = d.querySelector(`#discussion [data-f="a:${pid}"]`);
  check("le bouton de pièces reçues est un vrai bouton", !!jointe && jointe.tagName === "BUTTON");
  jointe.focus(); jointe.click();
  const panCONTEXTE = d.getElementById("panCONTEXTE");
  check("il ouvre le CONTEXTE", !!panCONTEXTE && !panCONTEXTE.hidden);
  check("le focus entre dans le CONTEXTE", panCONTEXTE.contains(actif()));
  check("le CONTEXTE ouvert, le halo quitte le bouton franchi pour l'index (§4.8)",
    !!d.querySelector("[data-tuto]") && d.querySelector("[data-tuto]").id === "zoneDossier");
  check("consigne neuve, elle s'affiche développée",
    !d.getElementById("tuto").hasAttribute("data-reduit"));
  check("CONTEXTE ouvert, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);

  const chip = d.querySelector(`#contexte [data-f="d:${pid}"]`);
  check("la pièce s'ouvre depuis un vrai bouton du dossier", !!chip && chip.tagName === "BUTTON");
  chip.focus(); chip.click();
  const boite = d.getElementById("panPiece");
  check("la pièce s'ouvre DANS le CONTEXTE, nommée pour qui ne la voit pas (§4.6)",
    !!boite && panCONTEXTE.contains(boite) && !panCONTEXTE.hidden
    && d.getElementById(boite.getAttribute("aria-labelledby")) === boite.querySelector("#pieceTitre"));
  check("entre l'index et les retenus, dans l'ordre de lecture",
    !!(d.getElementById("zoneDossier").compareDocumentPosition(boite) & 4)
    && !!(boite.compareDocumentPosition(d.getElementById("zoneRetenus")) & 4));
  check("le jeu derrière reste vivant — composeur et conversation compris",
    !inerte() && !d.getElementById("composeur").closest("[inert]") && !d.getElementById("discussion").closest("[inert]"));
  check("le focus entre dans la pièce", boite.contains(actif()));
  check("la consigne neuve du tutoriel s'annonce, développée à nouveau",
    /Tutoriel/.test(annonce()) && !d.getElementById("tuto").hasAttribute("data-reduit"));
  check("pièce ouverte, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);

  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  const passage = k => d.querySelector(`#panPiece [data-f="e:${k}"]`);
  const autre = H.empansDe(w, pid).find(k => k !== veut);
  passage(autre).focus();
  touche(passage(autre), "Enter");
  check("Entrée sur un passage le retient", w.S.retenus.includes(autre));
  check("et le prend, la phrase l'attendant : le même geste (passe H)",
    w.S.compo.length === 1 && w.S.compo[0].valeur === autre);
  check("et le focus reste sur CE passage, bien que la pièce ait été redessinée",
    cleActive() === "e:" + autre && actif() !== null && d.contains(actif()));
  check("un passage retenu le dit à qui ne voit pas le fond",
    /retenu/.test(passage(autre).textContent));
  check("retenir se voit sous la pièce, au moment même — et la ligne dit qu'il est aussi posé (§4.3)",
    /Retenu dans ton CONTEXTE, et posé dans ta phrase/.test((d.querySelector("#panPiece .rappel.retenu") || {}).textContent || ""));
  check("et le dit à l'oreille", /posé dans ta phrase/.test(annonce()));
  check("et la porte CONTEXTE s'allume", d.getElementById("btnCONTEXTE").classList.contains("recoit"));
  check("et la fiche neuve s'allume juste sous la pièce, là où on va la prendre",
    !!d.querySelector(`#zoneRetenus .mchip.neuf [data-f="c:${autre}"]`));
  w.rendreTout();                       // un redessin qui n'est PAS un geste
  check("la confirmation ne vit qu'un rendu",
    !d.querySelector("#panPiece .rappel.retenu") && !d.getElementById("btnCONTEXTE").classList.contains("recoit")
    && !d.querySelector(".mchip.neuf"));
  passage(autre).focus();
  check("mais ce n'est pas un interrupteur : aucun aria-pressed",
    ![...d.querySelectorAll(".empan")].some(e => e.hasAttribute("aria-pressed")));
  check("chaque passage dit sa dimension, sans la couleur",
    w.CHAMPS.filter(c => c.pid === pid).every(c => passage(c.id).textContent.includes(c.dim)));

  touche(passage(autre), " ");
  check("Espace sur un passage déjà dans la phrase ne l'oublie pas, ni ne l'y double",
    w.S.retenus.includes(autre) && w.S.compo.length === 1 && !w.S.refus);
  check("mais l'écran dit comment revenir en arrière", !!d.querySelector("#panPiece .rappel")
    && /Déjà dans ta phrase/.test(d.querySelector("#panPiece .rappel").textContent));
  check("et le dit à l'oreille", /Déjà dans ta phrase/.test(annonce()));
  w.rendreTout();                       // un redessin qui n'est PAS un reclic
  check("le rappel ne vit qu'un rendu", !d.querySelector("#panPiece .rappel"));
  const retirer = d.querySelector('#composeur [data-f="retirer"]');
  retirer.focus(); retirer.click();
  check("« ← retirer » l'ôte de la phrase, pas du CONTEXTE", !w.S.compo.length && w.S.retenus.includes(autre));
  touche(passage(veut), "Enter");
  check("Entrée sur le bon passage le pose à son tour", w.S.compo.length === 1 && w.S.compo[0].valeur === veut);

  /* §4.10 règle 6 — Échap se lit là où il agit, ET SEULEMENT LÀ : deux
     « × Échap » empilés promettaient deux effets à une touche (Jean). */
  const croixCONTEXTE = d.querySelector("#panCONTEXTE > h2 .fermer");
  const prometEchap = b => b.hasAttribute("aria-keyshortcuts") || /Échap/.test(b.getAttribute("aria-label") || "");
  check("pièce ouverte, Échap n'est promis qu'à elle : la croix du CONTEXTE perd sa touche",
    !prometEchap(croixCONTEXTE) && panCONTEXTE.classList.contains("avecPiece")
    && prometEchap(d.querySelector('#panPiece [data-f="replier"]')));
  touche(d.body, "Escape");
  check("Échap replie la pièce — le jeu n'avait jamais cessé d'être vivant", !w.S.modalPiece && !inerte());
  check("et la croix du CONTEXTE reprend la touche, puisque c'est elle qu'Échap fermerait",
    prometEchap(croixCONTEXTE) && !panCONTEXTE.classList.contains("avecPiece"));
  check("et le CONTEXTE reste ouvert : c'est le second Échap qui le fermerait (§4.10 règle 3)",
    !panCONTEXTE.hidden);
  check("le focus revient au chip du dossier qui l'avait ouverte", cleActive() === "d:" + pid);
  check("lue, elle le dit par son nom — pas par un gris",
    /déjà lue/.test(d.querySelector(`#contexte [data-f="d:${pid}"]`).getAttribute("aria-label") || ""));

  // Le CONTEXTE est déjà ouvert depuis `voirPiecesRecues` et ne s'est jamais
  // refermé (§4.6) : pas de bascule ici, elle le fermerait.
  const puce = d.querySelector(`#contexte [data-f="c:${veut}"]`);
  puce.focus();
  w.rendreTout();
  check("le focus survit au redessin d'une puce du CONTEXTE",
    cleActive() === "c:" + veut && actif() !== puce);
  // Les GESTES désignent leur élément par sa clé ; seuls les contrôles de focus
  // lisent le focus — sans quoi une panne en amont en masquerait une en aval.
  // Le passage est déjà dans la phrase (passe H) : sa fiche le dit, rien à prendre.
  check("sa fiche dit qu'il est dans la phrase",
    /dans ta phrase/.test(d.querySelector(`#contexte [data-f="c:${veut}"]`).textContent));
  check("phrase en cours, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);
  const croix = [...d.querySelectorAll(".fermer, .mchip .del")];
  check("chaque croix a un nom, et ce nom n'est pas « × »",
    croix.length > 0 && croix.every(c => (c.getAttribute("aria-label") || "").length > 1));
  /* §4.3 — Colas a fermé le panneau en croyant retirer un passage : la fiche
     et le panneau portaient le même ×. Un signe, un acte. */
  const oublis = [...d.querySelectorAll(".mchip .del")];
  check("retirer une fiche s'écrit en toutes lettres : le × ne retire rien",
    oublis.length > 0 && oublis.every(b => b.textContent.trim() === "oublier"));

  const envoi = d.querySelector('#composeur [data-f="envoi"]');
  envoi.focus(); envoi.click();
  const derniere = w.S.fil.filter(m => !m.ia).pop();
  const brut = h => { const x = d.createElement("div"); x.innerHTML = h; return x.textContent.replace(/\s+/g, " ").trim(); };
  check("la réplique de l'avocat s'annonce, texte seul", annonce().includes(brut(derniere.texte)));
  check("le bouton envoyé disparu, le focus reste dans le composeur",
    !!actif() && d.getElementById("composeur").contains(actif()));
}
{
  // Le trait double la couleur : une dimension, un trait ; deux dimensions,
  // deux traits — dans la limite de ce que CSS sait tracer. PIÈGE : ce nombre
  // ne se lit PAS dans `TRAITS_DIM`, sans quoi une liste réduite à un seul
  // trait se déclarerait conforme à elle-même.
  const STYLES_CSS = 5;                 // plein, double, pointillé, tirets, ondulé
  const w = boot();
  const d = w.document;
  const vus = new Map();
  for (const pid of Object.keys(w.JEU.pieces)) {
    w.ouvrirPiece(pid);
    for (const e of d.querySelectorAll("#panPiece .empan:not(.article)")) {   // un article n'a pas de dimension
      const dim = w.CHAMPS.find(c => "e:" + c.id === e.getAttribute("data-f")).dim;
      const trait = (/--ds:\s*([\w-]+)/.exec(e.getAttribute("style") || "") || [])[1];
      vus.set(dim, new Set([...(vus.get(dim) || []), trait]));
    }
    w.fermerPiece();
  }
  const traits = [...vus.values()].map(s => [...s]);
  check("chaque dimension porte un seul trait, et il est posé",
    traits.length > 1 && traits.every(t => t.length === 1 && !!t[0]));
  check("deux dimensions ne partagent jamais un trait",
    new Set(traits.map(t => t[0])).size === Math.min(traits.length, STYLES_CSS));
}
{
  // La confirmation attend qu'on réponde (§4.10 règle 6) : aucun minuteur.
  const w = H.boot({url:"http://localhost/"});
  let arme = false;
  w.setTimeout = () => { arme = true; };
  w.recommencer();
  const b = w.document.getElementById("btnRecommencer"), a = w.document.getElementById("btnAnnulerRecommencer");
  check("« recommencer » demande confirmation, sans minuteur qui la retire", /effacer/.test(b.textContent) && !arme);
  check("et offre d'annuler, focus dessus", !a.hidden && w.document.activeElement === a);
  w.annulerRecommencer();
  check("annuler rend le bouton, sans rien effacer",
    !/effacer/.test(b.textContent) && a.hidden && !!w.localStorage.getItem("iavocat_partie"));
}

console.log("\n=== Le CONTEXTE dit son état (§4.6) ===");
{
  // CHANGER DE PIÈCE COÛTE UN CLIC : ‹ et ›, dans l'ordre de l'index, en boucle.
  const w = boot(), d = w.document;
  const cle = () => d.activeElement && d.activeElement.getAttribute("data-f");
  const plie = () => d.getElementById("zoneDossier").classList.contains("plie");
  const pid = H.pidPremiereRemise(w);
  H.livrerTout(w);   // tout le dossier : l'ordre de l'index n'y est plus celui des remises
  w.voirPiecesRecues();
  const ordre = [...d.querySelectorAll("#contexte .dchip")].map(c => c.getAttribute("data-f").slice(2));
  const chip = d.querySelector(`#contexte [data-f="d:${pid}"]`);
  chip.focus(); chip.click();
  const fl = c => d.querySelector(`#panPiece [data-f="${c}"]`);
  const i0 = ordre.indexOf(pid), apres = ordre[(i0 + 1) % ordre.length];
  check("la tête de la pièce porte ‹ et ›, nommées par la pièce où elles mènent",
    ordre.length > 1 && !!fl("prec") && !!fl("suiv")
    && fl("suiv").getAttribute("aria-label").includes(w.JEU.pieces[apres].titre));
  const vues = [w.S.modalPiece];
  for (let i = 1; i < ordre.length; i++) { fl("suiv").click(); vues.push(w.S.modalPiece); }
  check("› parcourt tout l'index dans son ordre, un clic par pièce",
    ordre.join() !== w.R.piecesLivrees(w.S).join()
    && vues.join() === [...ordre.slice(i0), ...ordre.slice(0, i0)].join());
  check("l'index reste replié, et le focus reste sur la flèche pour enchaîner",
    plie() && cle() === "suiv");
  fl("suiv").click();
  check("et boucle", w.S.modalPiece === pid);
  fl("prec").click();
  check("‹ revient en arrière, en boucle aussi", w.S.modalPiece === ordre[(i0 - 1 + ordre.length) % ordre.length]);
  w.fermerPiece();
  check("la croix rend le focus au chip qui avait ouvert la première", cle() === "d:" + pid);
}
{
  // CE QU'ON A PRIS SE VOIT, ET UN REFUS DIT POURQUOI — à l'écran, pas dans un `title`.
  const w = boot(), d = w.document;
  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  const livrees = new Set(w.R.piecesLivrees(w.S));
  const dim = w.CHAMPS.find(c => c.id === veut).dim;
  const autre = w.CHAMPS.find(c => c.id !== veut && c.dim === dim && livrees.has(c.pid)).id;
  for (const k of [veut, autre]) { w.ouvrirPiece(k.split(".")[0]); H.surligner(w, k); }
  const fiche = k => d.querySelector(`#zoneRetenus [data-f="c:${k}"]`);
  fiche(veut).click();
  check("un passage pris porte « dans ta phrase », et lui seul",
    /dans ta phrase/.test(fiche(veut).textContent) && !/dans ta phrase/.test(fiche(autre).textContent));
  check("la phrase prend encore un passage : pas de ligne de refus", !d.getElementById("raisonPleine"));
  fiche(autre).click();
  const raison = d.getElementById("raisonPleine");
  check("la phrase pleine, le CONTEXTE le dit en une ligne", !!raison && /ne prend plus de passage/.test(raison.textContent));
  check("les fiches restent atteignables : refusées, pas désactivées",
    !fiche(veut).disabled && fiche(veut).getAttribute("aria-disabled") === "true"
    && fiche(veut).getAttribute("aria-describedby") === "raisonPleine");
  check("aucune raison ne se cache plus dans un `title`",
    ![...d.querySelectorAll("#zoneRetenus .corps[title]")].some(b => /n'attend pas/.test(b.title)));
  const avant = w.S.compo.length;
  fiche(veut).focus(); fiche(veut).click();
  check("toucher une fiche refusée ne pose rien, et redit la raison",
    w.S.compo.length === avant && /ne prend plus de passage/.test(d.getElementById("annonce").textContent)
    && d.getElementById("raisonPleine").classList.contains("rappelle"));
  check("le focus reste sur la fiche touchée", d.activeElement === fiche(veut));
  w.retirerBloc();
  check("la phrase rouverte, la ligne s'en va", !d.getElementById("raisonPleine"));
}
{
  // DÉJÀ DANS LA PHRASE, UNE FICHE NE S'Y POSE PAS DEUX FOIS (§4.6, passe H) : la
  // toucher dit ce que dit la pièce — plus « cette phrase ne veut rien dire ».
  const w = boot(), d = w.document;
  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  w.ouvrirPiece(H.deK(veut)[0]);
  H.retenir(w, veut);                                  // le clic : retenu, et posé
  const fiche = () => d.querySelector(`#zoneRetenus [data-f="c:${veut}"]`);
  check("(la phrase prend encore un passage)", H.iTermeChamp(w) >= 0 && w.S.compo.length === 1);
  check("la fiche d'un passage déjà dans la phrase est refusée, pas désactivée",
    !fiche().disabled && fiche().getAttribute("aria-disabled") === "true");
  fiche().focus(); fiche().click();
  check("la toucher ne pose rien, et ne reproche rien : plus de « ne veut rien dire »",
    w.S.compo.length === 1 && !w.S.refus);
  check("elle dit ce que dit la pièce — déjà dans ta phrase —, à l'écran comme à l'oreille",
    /Déjà dans ta phrase/.test((d.getElementById("raisonPris") || {}).textContent || "")
    && /Déjà dans ta phrase/.test(d.getElementById("annonce").textContent)
    && fiche().getAttribute("aria-describedby") === "raisonPris");
  check("le focus reste sur la fiche touchée", d.activeElement === fiche());
  w.rendreTout();
  check("la raison ne vit qu'un rendu", !d.getElementById("raisonPris"));
}
{
  // ON NE PURGE PAS LE CONTEXTE ENTRE DEUX REMISES (§4.6, Bérengère) : la remise
  // suivante arrivée, les passages de la précédente restent à plat, composables.
  const w = boot(), d = w.document;
  let garde = 0;
  while (w.S.remisesEnvoyees === 1 && garde++ < 10) {
    const a = w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
    if (!a || H.composerLien(w, H.lienTag(w, a.attend)) < 0) break;
  }
  w.basculerPanneau("contexte");
  // Les PASSAGES : l'article retenu pour la comparaison n'est jamais un terme (passe F).
  const anciens = w.S.retenus.filter(k => w.CHAMPS.some(c => c.id === k));
  const fiche = k => d.querySelector(`#zoneRetenus [data-f="c:${k}"]`);
  check("la remise 2 arrivée, les passages de la remise 1 restent composables, sans ligne de repli",
    w.S.remisesEnvoyees === 2 && anciens.length > 0
    && anciens.every(k => !!fiche(k) && !fiche(k).closest("[hidden]") && !fiche(k).hasAttribute("aria-disabled"))
    && !d.querySelector("#zoneRetenus [aria-expanded]"));
}

console.log("\n=== La DISCUSSION s'agrandit, CONTEXTE ouvert (§4.6) ===");
{
  // Retour de playtest (Bérengère) : l'en-tête DISCUSSION devient une bascule —
  // un état d'ÉCRAN, qui n'existe que CONTEXTE ouvert, et ne change que le gabarit.
  const w = boot(), d = w.document;
  const bascule = () => d.querySelector('#titreDISCUSSION [data-f="discussion"]');
  const presse = () => !!bascule() && bascule().getAttribute("aria-pressed") === "true";
  const agrandie = () => d.querySelector(".wrap").classList.contains("discussionAgrandie");
  check("CONTEXTE fermé, l'en-tête DISCUSSION n'est qu'un titre : aucune bascule", !bascule() && !agrandie());
  w.basculerPanneau("plaidoirie");
  check("la PLAIDOIRIE ouverte non plus : sa colonne est déjà étroite", !bascule() && !agrandie());
  w.basculerPanneau("contexte");
  check("CONTEXTE ouvert, l'en-tête devient une bascule, relâchée",
    !!bascule() && bascule().tagName === "BUTTON" && bascule().getAttribute("aria-pressed") === "false" && !agrandie());
  bascule().focus(); bascule().click();
  check("un clic agrandit la conversation", presse() && agrandie());
  check("le focus reste sur la bascule", d.activeElement === bascule());
  bascule().click();
  check("un second clic rend la place", !presse() && !agrandie());
  bascule().click();
  const pid = H.pidPremiereRemise(w);
  d.querySelector(`#contexte [data-f="d:${pid}"]`).click();
  check("ouvrir une pièce depuis l'index rend la place au CONTEXTE", !presse() && !agrandie());
  bascule().click();
  d.querySelector('#panPiece [data-f="suiv"]').click();
  check("‹ › changent de pièce sans rien rendre", presse() && agrandie() && w.S.modalPiece !== pid);
  w.fermerPanneau();
  check("le CONTEXTE refermé, la bascule disparaît, et la conversation reprend toute la place",
    !bascule() && !agrandie());
  w.basculerPanneau("contexte");
  check("rouvert, il ne s'en souvient pas : un état d'écran, jamais sauvé", !presse() && !agrandie());
}

console.log("\n=== Une phrase déjà envoyée ne repart pas, et le composeur le dit (§4.5) ===");
{
  const w = H.boot({url:"http://localhost/"});
  const d = w.document;
  const L = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend);
  check("la première réponse part", H.composerLien(w, L) >= 0 && w.S.satisfaits.includes(L.tag));
  check("recomposée, elle se tient au composeur", H.composerLien(w, L, {garder:true}) === 0);
  w.rendreTout();
  const barre = () => d.querySelector("#composeur .barre");
  check("« → Envoyer » cède la place à « déjà envoyée »",
    !d.querySelector('#composeur [data-f="envoi"]') && /déjà envoyée/.test(barre().textContent));
  const fil = w.S.fil.length, compo = w.S.compo.length;
  w.envoyerCompo();
  check("et rien ne part, même forcé : la phrase reste, le fil ne bouge pas",
    w.S.fil.length === fil && w.S.compo.length === compo && compo > 0);
}

console.log("\n=== L'article se retient, puis se prend (§4.5, §4.6, passe F) ===");
{
  const w = H.boot(), d = w.document;
  H.livrerTout(w);
  const arts = w.MoteurGrammaire.articlesDe(w.JEU);
  check("chaque article a son passage, et le moteur ne le voit pas : jamais un terme",
    arts.length > 0 && arts.every(a => !w.CHAMPS.some(c => c.id === a.id) && a.dim === undefined));
  const L = H.lienConclusion(w);
  const pid = w.JEU.grammaire.blocs.find(b => w.R.estLiaisonArticle(b) && b.forme === L.forme).piece;
  const k = H.cleArticle(w, pid);
  w.ouvrirPiece(pid);
  const passage = d.querySelector(`#panPiece [data-f="e:${k}"]`);
  check("son texte est un passage, sans couleur ni trait de dimension, qui se dit « article »",
    !!passage && passage.classList.contains("article") && !/--dc/.test(passage.getAttribute("style") || "")
    && /article/.test(passage.querySelector(".sr").textContent));
  check("ouvert, il ne s'offre pas", !w.R.articleRetenu(w.S, pid));
  passage.click();
  check("cliqué, il est retenu comme un passage", w.S.retenus.includes(k) && w.R.articleRetenu(w.S, pid));
  w.fermerPiece();
  const fiche = () => d.querySelector(`#zoneRetenus [data-f="c:${k}"]`);
  const groupes = [...d.querySelectorAll("#zoneRetenus .dimgrp")];
  check("sa fiche se range hors des dimensions, en dernier, sous ARTICLES",
    !!fiche() && groupes.length > 0 && groupes[groupes.length - 1].classList.contains("articles")
    && groupes[groupes.length - 1].contains(fiche()));
  check("phrase vide, la fiche est refusée, pas désactivée", !fiche().disabled && fiche().getAttribute("aria-disabled") === "true");
  fiche().focus(); fiche().click();
  check("la toucher ne pose rien, et dit pourquoi — à l'écran comme à l'oreille",
    w.S.compo.length === 0 && /fonde une relation/.test((d.getElementById("raisonArticle") || {}).textContent || "")
    && /fonde une relation/.test(d.getElementById("annonce").textContent));
  check("le focus reste sur la fiche touchée", d.activeElement === fiche());
  w.rendreTout();
  check("la raison ne vit qu'un rendu", !d.getElementById("raisonArticle"));
  w.basculerPanneau("contexte");
  H.poserComparaison(w, H.sousTerme(L));
  check("les deux passages posés, les fiches de passage disent que la phrase attend un article",
    /attend un article/.test((d.getElementById("raisonPleine") || {}).textContent || ""));
  check("la fiche de l'article, elle, prend", !fiche().hasAttribute("aria-disabled"));
  fiche().click();
  check("prise, elle pose la liaison de son article, et le dit", w.R.compoFinie(w.S)
    && w.R.chaineCompo(w.S).some(p => w.R.estLiaisonArticle(p.bloc) && p.bloc.piece === pid)
    && /dans ta phrase/.test(fiche().textContent));
  w.retirerBloc(); w.oublier(...H.deK(k));
  check("oubliée, l'article ne s'offre plus", !w.R.blocsOfferts(w.S).some(b => w.R.estLiaisonArticle(b)));
  check("et la voix dit où aller le chercher, et quoi y cliquer, en menant au CONTEXTE",
    /clique sur son texte/.test(composeur(w)) && !!d.querySelector('#composeur [data-f="voix"]'));
}
{
  // L'ARTICLE QUE LA QUESTION DEMANDE AUSSI, retenu en avance, ne sonne pas faux (§4.8).
  const w = H.boot({url:"http://localhost/"});
  H.composerLien(w, H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend));
  const L = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend);
  const pid = w.JEU.grammaire.blocs.find(b => w.R.estLiaisonArticle(b) && b.forme === L.forme).piece;
  w.ouvrirPiece(pid); H.surligner(w, H.cleArticle(w, pid));
  check("retenir l'article demandé avant les deux passages n'est pas une erreur",
    !w.document.getElementById("tuto").hidden && !w.document.getElementById("tuto").hasAttribute("data-alerte"));
}

console.log("\n=== La fiche d'un article se lit comme un choix : son nom neutre (§4.5, passe F) ===");
{
  const w = H.boot();
  H.livrerTout(w);
  const L = H.lienConclusion(w);
  H.lireLeTexte(w, L.forme);
  check("la comparaison du vice se pose", H.poserComparaison(w, H.sousTerme(L)));
  w.basculerPanneau("contexte");
  const fiches = [...w.document.querySelectorAll("#zoneRetenus .mchip.article .corps")];
  const noms = fiches.map(b => b.querySelector(".nom").textContent);
  const pid = w.JEU.grammaire.blocs.find(b => w.R.estLiaisonArticle(b) && b.forme === L.forme).piece;
  check("l'article retenu a sa fiche, qui porte le nom neutre de son passage — pas le libellé de la phrase",
    fiches.length > 0 && noms.includes(w.JEU.pieces[pid].empans[H.deK(H.cleArticle(w, pid))[1]].nom)
    && noms.every(t => !/^[\s,;]/.test(t)) && !fiches.some(b => b.hasAttribute("aria-disabled")));
  check("et le composeur n'offre plus aucun article", !w.document.querySelector("#composeur .bbloc.fondement"));
}

console.log("\n=== Un clic dans la pièce retient et prend (§4.6, passe H) ===");
{
  // LE CLIC FAIT CE QUE FERAIT LA FICHE JUSTE APRÈS, RIEN DE PLUS — et le dit.
  const w = boot(), d = w.document;
  H.livrerTout(w);
  const L = H.lienConclusion(w), sous = H.sousTerme(L), [a, b] = sous.termes;
  const pidArt = w.JEU.grammaire.blocs.find(x => w.R.estLiaisonArticle(x) && x.forme === L.forme).piece;
  const cle = H.cleArticle(w, pidArt);
  const ligne = () => (d.querySelector("#panPiece .rappel") || {}).textContent || "";
  const termes = () => w.S.compo.map(p => p.valeur).filter(v => w.CHAMPS.some(c => c.id === v));
  const marques = () => [...d.querySelectorAll("#panPiece .empan")].map(e => e.outerHTML).join("");

  w.ouvrirPiece(pidArt);
  H.retenir(w, cle);
  check("phrase vide, le texte d'un article se retient seulement : il n'a rien à fonder",
    w.S.retenus.includes(cle) && !w.S.compo.length && ligne() === "✓ Retenu dans ton CONTEXTE.");

  w.ouvrirPiece(H.deK(a)[0]);
  H.retenir(w, a);
  check("un clic sur un passage le retient ET le pose, la phrase l'attendant",
    w.S.retenus.includes(a) && termes().join() === a);
  check("la ligne sous la pièce dit les deux, et l'annonce aussi",
    /Retenu dans ton CONTEXTE, et posé dans ta phrase/.test(ligne())
    && /posé dans ta phrase/.test(d.getElementById("annonce").textContent));
  check("et sa fiche dit « dans ta phrase »",
    /dans ta phrase/.test(d.querySelector(`#zoneRetenus [data-f="c:${a}"]`).textContent));
  H.retenir(w, a);
  check("recliqué, un passage déjà dans la phrase n'y retourne pas — et rien n'est refusé",
    termes().join() === a && !w.S.refus && /Déjà dans ta phrase/.test(ligne()));

  w.ouvrirPiece(H.deK(b)[0]);
  H.retenir(w, b);
  check("le second, cliqué dans sa pièce, rejoint le premier : la relation est à choisir",
    termes().length === 2 && termes().includes(b) && w.R.relationsOffertes(w.S).length === 2);
  check("et poser n'est pas choisir : le vice n'est pas pressenti", !w.S.vice_pressenti);

  /* La phrase attend sa relation : elle ne prend plus de passage. */
  const autre = w.CHAMPS.find(c => c.pid === H.deK(b)[0] && c.id !== b && !w.S.retenus.includes(c.id)).id;
  const n = w.S.compo.length;
  H.retenir(w, autre);
  check("la phrase attendant sa relation, un autre passage se retient seulement",
    w.S.retenus.includes(autre) && w.S.compo.length === n && ligne() === "✓ Retenu dans ton CONTEXTE.");
  H.retenir(w, autre);
  check("recliqué, il ne s'oublie pas, et la ligne dit où l'on oublie",
    w.S.retenus.includes(autre) && w.S.compo.length === n && /CONTEXTE/.test(ligne()) && !/✓/.test(ligne()));
  const pleine = marques();               // un clic n'y prendrait rien

  H.choisirRelation(w, sous.forme);
  check("la vraie relation choisie, le vice est pressenti", w.S.vice_pressenti && !w.S.vice_trouve);
  w.ouvrirPiece(pidArt);
  H.retenir(w, cle);
  check("le texte de l'article, recliqué, fonde la phrase qui l'attend — comme sa fiche",
    w.R.compoFinie(w.S) && w.R.chaineCompo(w.S).some(p => w.R.estLiaisonArticle(p.bloc) && p.bloc.piece === pidArt));
  check("et la ligne dit qu'il est posé", ligne() === "✓ Posé dans ta phrase.");
  check("la conclusion assemblée d'un clic lève vice_trouve, sans rien transmettre",
    w.S.vice_trouve && !w.S.vice_expose && !w.S.plaidoirie.length && !w.S.brouillon.length);
  w.retirerBloc();
  check("« ← retirer » l'ôte de la phrase, pas du CONTEXTE",
    !w.R.compoFinie(w.S) && w.S.retenus.includes(cle) && termes().length === 2);
  // CE QUE LE CLIC VA FAIRE DÉPEND DE LA PHRASE, LE MARQUAGE JAMAIS (§4.3).
  w.viderCompo();
  w.ouvrirPiece(H.deK(b)[0]);
  const vide = marques();                 // un clic y prendrait
  check("aucun passage ne change d'aspect avec la phrase : ni grisé, ni refusé (§4.3)",
    !!pleine && vide === pleine
    && ![...d.querySelectorAll("#panPiece .empan")].some(e => e.hasAttribute("aria-disabled")));
}
{
  // EN SESSION 1, LE CLIC REÇOIT LE REFUS QUE SA FICHE AURAIT REÇU (§4.5, §4.11).
  const w = boot(), d = w.document;
  const [a, b] = deuxDimensions(w);                    // retenus seuls
  check("(retenir seul ne laisse rien dans la phrase)", !w.S.compo.length);
  H.retenir(w, a.id);
  check("en session 1, un passage recliqué se pose", w.S.compo.length === 1 && w.S.compo[0].valeur === a.id);
  H.retenir(w, b.id);
  check("un second d'une autre dimension, cliqué dans la pièce, reçoit le refus de sa fiche",
    !!w.S.refus && /ne se comparent pas/.test(w.S.refus) && w.S.compo.length === 1);
  check("et reste retenu", w.S.retenus.includes(b.id));
  check("l'assombrissement reste sur les fiches : aucun passage ne s'assombrit dans la pièce",
    !!d.querySelector("#zoneRetenus .horsdim")
    && ![...d.querySelectorAll("#panPiece .empan")].some(e => e.closest(".horsdim") || e.hasAttribute("aria-disabled")));
}
{
  // ENSUITE, LA JUXTAPOSITION SE POSE D'ELLE-MÊME, comme par la fiche (§4.11).
  const w = boot();
  H.livrerTout(w);
  const [a, b] = deuxDimensions(w);
  H.retenir(w, a.id); H.retenir(w, b.id);
  check("hors session 1, deux dimensions cliquées dans la pièce se juxtaposent d'elles-mêmes",
    !w.S.refus && w.S.compo.length === 3 && !!w.S.compo[2].auto && w.R.relationsOffertes(w.S).length === 0);
}

console.log("\n=== L'agacement retombe à chaque remise (§4.11) ===");
{
  const w = H.boot();
  const A = w.JEU.avocat.rep_hors_sujet;
  const cite = H.blocCite(w).forme;
  const lies = new Set(w.JEU.liens.filter(L => typeof L.termes[0] === "string").map(L => L.termes[0]));
  const sansLien = r => w.CHAMPS.find(c => w.JEU.remises[r].pieces.includes(c.pid) && !lies.has(c.id));
  const c1 = sansLien(0);
  check("une citation sans lien, en remise 1, agace l'avocat",
    !!c1 && H.composerLien(w, {forme:cite, termes:[c1.id]}) >= 0 && w.S.hors_sujet === 1);
  for (const a of w.R.attentesDe(w.JEU.remises[0])) H.composerLien(w, H.lienTag(w, a.attend));
  check("la remise 2 arrive, et les trois compteurs sont retombés",
    w.S.remisesEnvoyees === 2 && !w.S.hors_sujet && !w.S.incompris && !w.S.inutiles);
  const c2 = sansLien(1);
  H.composerLien(w, {forme:cite, termes:[c2.id]});
  check("la première réplique se réentend", w.S.fil[w.S.fil.length - 1].texte === A[0]);
}

console.log("\n=== Le CONTEXTE ouvert pour écrire reste quand il faut aller lire (§4.6) ===");
{
  const w = H.boot();
  const L = w.JEU.liens.find(x => x.tag === w.R.attentesDe(w.JEU.remises[0]).slice(-1)[0].attend);
  for (const a of w.R.attentesDe(w.JEU.remises[0]).slice(0, -1)) H.composerLien(w, H.lienTag(w, a.attend));
  const pan = () => !w.document.getElementById("panCONTEXTE").hidden;
  w.fermerPanneau(); w.ouvrirCONTEXTE();
  check("ouvert par la voix", pan());
  check("la comparaison se pose, l'article pas encore retenu : rien à invoquer",
    H.poserComparaison(w, H.sousTerme(L)) && w.R.blocsOfferts(w.S).length === 0);
  check("le CONTEXTE reste : c'est là qu'on va lire l'article", pan());
  const art = (w.JEU.grammaire.blocs || []).find(b => b.forme === L.forme && b.piece).piece;
  w.ouvrirPiece(art);
  check("ouvrir ne suffit plus : rien n'est offert tant qu'on ne le retient pas (passe F)",
    w.R.blocsOfferts(w.S).length === 0);
  H.surligner(w, H.cleArticle(w, art)); w.fermerPiece();
  check("l'article retenu, il est offert — et le CONTEXTE, où il se prend, reste",
    w.R.blocsOfferts(w.S).length > 0 && pan());
}

console.log("\n=== L'écran de fin est terminal (§4.9 règle 5, §4.10 règle 6) ===");
{
  const w = H.boot({url:"http://localhost/"});
  const d = w.document;
  H.instruire(w);
  if (d.getElementById("panCONTEXTE").hidden) w.basculerPanneau("contexte");
  check("un panneau est ouvert derrière", !d.getElementById("panCONTEXTE").hidden);
  check("une fin s'affiche", !!H.numeroFin(H.terminer(w)));
  const fin = () => d.querySelector("#modalRoot .fin");
  const partie = () => w.localStorage.getItem("iavocat_partie");
  check("ni croix ni autre porte que « Recommencer »",
    [...d.querySelectorAll("#modalRoot button")].map(b => b.textContent.trim()).join("|") === "Recommencer");
  check("la partie finie est effacée", partie() === null);
  d.querySelector("#modalRoot .overlay").click();
  check("un clic sur le voile ne la referme pas", !!fin());
  d.dispatchEvent(new w.KeyboardEvent("keydown", {key:"Escape", bubbles:true}));
  check("Échap non plus — et n'agit pas derrière : le panneau reste, rien n'est resauvé",
    !!fin() && !d.getElementById("panCONTEXTE").hidden && partie() === null);
}

bilan();

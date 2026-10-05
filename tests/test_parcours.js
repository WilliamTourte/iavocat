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
  check("hors session 1, la juxtaposition se pose sans refus d'écran", !w.S.refus && w.S.compo.length === 2);
  check("et se lit sans relation : « {a} et {b} »",
    w.R.juxtapose(w.M.reduire(w.R.chaineCompo(w.S))));
  const avant = w.S.incompris;
  w.envoyerCompo();
  check("elle part — et c'est l'avocat qui la refuse, par son escalade",
    w.S.brouillon.length === 1 && w.S.incompris === avant + 1
    && w.S.fil[w.S.fil.length - 1].texte === w.JEU.avocat.rep_sans_rapport[avant]);
  check("elle ne sert rien, et n'entre pas en Plaidoirie",
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
    sr = sr && porte.every(d => (panneau.querySelector(".cadre .sr") || {}).textContent.includes(d));
  }
  check("chaque article est encadré de la couleur de chaque dimension qu'il régit, et de son trait", ok);
  check("sans un mot à l'écran : plus d'étiquette « porte sur »", sansMot);
  check("à qui ne voit pas, le nom des dimensions", sr);
}

console.log("\n=== La déduction : la relation est un fait, pas un choix ===");
{
  const w = boot();
  H.livrerTout(w);
  let tous = true, n = 0;
  for (const L of H.comparaisons(w)) {
    n++;
    if (w.M.deduire(L.termes[0], L.termes[1]) !== L.forme) tous = false;
  }
  check(`les ${n} relations déclarées se déduisent toutes des valeurs`, n > 0 && tous);

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
  check(`les ${vus} phrases déduites s'écrivent par leur patron, verbe compris`, vus > 0 && patronsOk);

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
  const second = (G.blocs || []).find(b => b.type === "terme" && b.deduit);
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
      w.R.blocsOfferts(w.S).some(b => b.type === "terme" && b.deduit));
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
      const b2 = c.grammaire.blocs.find(b => b.type === "terme" && b.deduit);
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
        !w2.R.blocsOfferts(w2.S).some(b => b.type === "terme" && b.deduit));
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
  const dansDiscussion = el => !!el && w.document.getElementById("discussion").contains(el);

  check("au premier écran, le tutoriel parle", !bandeau().hidden);
  check("et il montre la pièce à ouvrir, dans la Discussion", dansDiscussion(halo()));

  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const cible = halo();
  check("la pièce ouverte, il montre son TEXTE, pas un empan",
    !!cible && cible.classList.contains("piecetexte"));
  check("et tous les empans y restent marqués pareil — aucune lampe torche",
    ![...cible.querySelectorAll(".empan")].some(e => e.hasAttribute("data-tuto")));

  const veut = H.lienTag(w, w.R.attenteCourante(w.S, w.R.remiseCourante(w.S)).attend).termes[0];
  const autre = H.empansDe(w, pid).find(k => k !== veut);
  H.surligner(w, autre);
  check("un autre passage se retient tout de même", w.S.retenus.includes(autre));
  check("mais le tutoriel ne prend pas ça pour une réponse",
    w.document.getElementById("tuto").hasAttribute("data-alerte"));
  check("et il le montre là où le geste s'est trompé",
    halo() === w.document.querySelector(".piecetexte"));
  check("sans jamais désigner celui qu'il fallait",
    ![...w.document.querySelectorAll(".empan")].some(e => e.hasAttribute("data-tuto")));

  H.surligner(w, veut);
  check("le bon passage retenu, l'alerte tombe",
    !w.document.getElementById("tuto").hasAttribute("data-alerte"));
  check("pièce ouverte DANS le Contexte, il montre les retenus juste dessous — plus rien à refermer (§4.6)",
    !!halo() && halo().id === "zoneRetenus" && !!w.S.modalPiece);
  w.fermerPanneau();
  check("le Contexte refermé replie la pièce avec lui", !w.S.modalPiece);
  check("le contexte étant un panneau FERMÉ, il montre la porte, pas la zone cachée",
    !!halo() && halo().id === "btnContexte");
  w.basculerPanneau("contexte");
  const zone = halo();
  check("et une fois ouvert, il montre le contexte", !!zone && zone.contains(w.document.querySelector(".mchip")));

  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut));
  const envoi = halo();
  check("la phrase qui se tient, il montre le seul geste qui parle",
    !!envoi && envoi.classList.contains("envoi"));

  w.envoyerCompo();
  check("la réponse envoyée, il se tait", bandeau().hidden && !halo());
  check("mais il ne ferme pas encore : la comparaison reste à montrer",
    !w.localStorage.getItem("iavocat_tuto"));

  // Le second geste — même session, dès que Maître Auber attend une
  // comparaison au lieu d'une simple citation (§4.8).
  const attenteSuivante = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  const veut2 = H.lienTag(w, attenteSuivante().attend).termes[0];
  const [pid2] = H.deK(veut2);
  w.ouvrirPiece(pid2);
  H.surligner(w, veut2);
  w.fermerPiece();
  check("une deuxième citation, geste déjà connu, ne rallume pas le halo",
    bandeau().hidden && !halo());
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut2));
  w.envoyerCompo();
  check("elle non plus ne ferme rien pour de bon",
    !w.localStorage.getItem("iavocat_tuto"));
  check("Maître Auber attend maintenant une comparaison",
    !!H.sousTerme(H.lienTag(w, attenteSuivante().attend)));
  check("et le halo revient aussitôt : deux passages sont requis, pas un",
    !!halo() && halo().id === "btnContexte");
  w.basculerPanneau("contexte");
  check("le panneau rouvert, il montre de nouveau la zone", halo().id === "zoneRetenus");
  const veutA = attenteSuivante().attend;
  const [tA, tB] = H.sousTerme(H.lienTag(w, veutA)).termes;
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(tA));
  check("un premier passage posé, le halo reste sur le contexte — il en faut un second",
    halo() && halo().id === "zoneRetenus");
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(tB));
  /* §4.5 — un texte s'invoque une fois LU. Tant que l'article n'est pas ouvert,
     le bandeau montre OÙ LE LIRE : il ne pointe pas une proposition qui n'existe
     pas, et il ne dit pas « Envoyer » alors que la leçon est l'article. */
  check("les deux posés, le halo montre le dossier — l'article n'est pas lu",
    !!halo() && halo().id === "zoneDossier");
  H.lireLeTexte(w, H.lienTag(w, veutA).forme);
  check("l'article lu, le halo montre enfin les propositions",
    !!halo() && halo().classList.contains("offre"));
  const bArticle = w.R.blocsOfferts(w.S).findIndex(b => b.type === "liaison" && b.imbrique);
  w.poserBloc(bArticle);
  check("l'article choisi, le halo revient sur le seul geste qui parle",
    !!halo() && halo().classList.contains("envoi"));
  w.envoyerCompo();
  check("les deux gestes montrés, le tutoriel se tait pour de bon",
    bandeau().hidden && !halo());
  check("et il ne reviendra pas", !!w.localStorage.getItem("iavocat_tuto"));
}
/* §3 — LA REMISE DU TUTORIEL SE SERT DANS L'ORDRE (retour de playtest, Jean).
   La réponse à la deuxième question, envoyée à la première, la servait par
   anticipation : sa réplique tombait, la phrase entrait en Plaidoirie, la
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
  check("la remise 1 attend au moins deux citations", !!L1 && !!L2 && typeof L2.termes[0] === "string");

  const i = H.composerLien(w, L2);
  check("la réponse à la question suivante, envoyée trop tôt, part bien", i >= 0);
  check("mais elle ne sert pas une question qui n'est pas posée", !w.S.satisfaits.includes(a2.attend));
  check("l'avocat répond à côté — pas avec la réplique de la question à venir",
    dernier() !== L2.rep && w.JEU.avocat.rep_hors_sujet.includes(dernier()));
  check("rien n'entre en Plaidoirie", w.moyensRetenus().length === 0);
  check("la question courante reste la première", courante().attend === a1.attend);
  check("et le tutoriel ne tient pas la citation pour acquise : il reste là", !bandeau().hidden);

  H.composerLien(w, L1);
  check("la bonne réponse sert la première question", w.S.satisfaits.includes(a1.attend));
  check("et la deuxième est posée, cette fois", courante().attend === a2.attend && dernier() === a2.question);
  const j = H.composerLien(w, L2);
  check("la phrase envoyée trop tôt repart quand sa question vient",
    j === i && w.S.satisfaits.includes(a2.attend));
  check("et elle n'entre qu'une fois en Plaidoirie",
    w.moyensRetenus().filter(x => x.b === i).length === 1);
}
/* §4.8 — NEUVE VEUT DIRE JAMAIS MONTRÉE (retour de playtest, Jean) : revenir
   de 4/4 à 3/4 après « tout effacer » redéployait une consigne déjà lue. */
console.log("\n=== Une consigne déjà lue reste réduite ===");
{
  const w = H.boot({url:"http://localhost/"});
  const bulle = () => w.document.getElementById("tuto");
  const reduite = () => bulle().hasAttribute("data-reduit");
  const pas = () => w.document.getElementById("tutoPas").textContent;
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
  check("la phrase qui se tient : consigne neuve, développée", pas() !== avant && !reduite());
  w.viderCompo();
  check("« tout effacer » ramène la consigne d'avant", pas() === avant);
  check("déjà lue, elle reste réduite", reduite() && !bulle().hidden);
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
  check("la ligne dit le dossier et son compte",
    /dossier/i.test(bascule().textContent) && /\d+ pièces?/.test(bascule().textContent) && /\d+ règles?/.test(bascule().textContent));
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
    !!w.document.getElementById("btnPlaidoirie"));
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
  check("et il ne montre que les moyens, comme la Plaidoirie",
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
  const bouton  = () => w.document.querySelector("#composeur button.versContexte");
  const attente = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  const question = () => attente().question;

  check("au premier écran, aucun panneau n'est ouvert", !ouvert("Contexte") && !ouvert("Plaidoirie"));
  check("les deux portes sont là, dans le titre du composeur",
    !!w.document.getElementById("btnContexte") && !!w.document.getElementById("btnPlaidoirie"));
  check("la phrase attend un passage, donc la voix se clique aussi", !!bouton());

  /* LA VOIX — elle ouvre POUR ÉCRIRE, donc le panneau suivra la phrase. */
  w.ouvrirContexte();
  check("la voix ouvre le Contexte", ouvert("Contexte"));

  const veut = H.lienTag(w, attente().attend).termes[0];
  const [pid] = H.deK(veut);
  w.ouvrirPiece(pid); H.surligner(w, veut); w.fermerPiece();
  check("ouvrir une pièce depuis le panneau ne le referme pas", ouvert("Contexte"));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, veut));
  check("un passage posé, la voix se tait — plus de bouton", !bouton());
  check("mais le panneau RESTE ouvert : la phrase accepterait encore un passage", ouvert("Contexte"));
  w.envoyerCompo();
  check("c'est le DÉPART de la phrase qui referme", !ouvert("Contexte"));

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
  check("la porte ouvre", ouvert("Contexte"));
  w.basculerPanneau("contexte");
  check("et referme — c'est une bascule", !ouvert("Contexte"));
  w.basculerPanneau("plaidoirie");
  check("l'autre porte ouvre la Plaidoirie", ouvert("Plaidoirie"));
  check("et une seule surface à la fois", !ouvert("Contexte"));
  w.fermerPanneau();

  /* LA COMPARAISON — le panneau doit tenir entre les DEUX passages. */
  const veut2 = H.lienTag(w, attente().attend).termes[0];
  const [pid2] = H.deK(veut2);
  w.ouvrirPiece(pid2); H.surligner(w, veut2); w.fermerPiece();
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, veut2));
  w.envoyerCompo();
  const sous = H.sousTerme(H.lienTag(w, attente().attend));
  check("Maître Auber attend maintenant une comparaison", !!sous);
  const [tA, tB] = sous.termes;
  w.ouvrirContexte();
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tA));
  check("le PREMIER des deux posé, il en faut un second : le panneau RESTE ouvert", ouvert("Contexte"));
  w.poserBloc(H.iTermeChamp(w), H.iRetenu(w, tB));
  check("les deux posés, seul l'article manque : il s'est refermé", !ouvert("Contexte"));
  check("et la voix qui réclame l'article n'est plus un bouton — le geste est ICI",
    !bouton() && !!w.document.querySelector("#composeur span.aide"));

  /* CONSULTER N'EST PAS ÉCRIRE — ouverte depuis la barre, elle ne se referme pas
     bien que la phrase n'accepte plus aucun passage. */
  w.basculerPanneau("contexte");
  check("depuis la barre, le panneau s'ouvre même quand plus aucun passage n'est posable",
    ouvert("Contexte"));
  w.rendreTout();
  check("et il ne se referme pas tout seul : on consulte, on n'écrit pas", ouvert("Contexte"));
  w.fermerPanneau();
  check("la croix referme", !ouvert("Contexte"));
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
  const panContexte = d.getElementById("panContexte");
  check("il ouvre le Contexte", !!panContexte && !panContexte.hidden);
  check("le focus entre dans le Contexte", panContexte.contains(actif()));
  check("le Contexte ouvert, le halo quitte le bouton franchi pour l'index (§4.8)",
    !!d.querySelector("[data-tuto]") && d.querySelector("[data-tuto]").id === "zoneDossier");
  check("consigne neuve, elle s'affiche développée",
    !d.getElementById("tuto").hasAttribute("data-reduit"));
  check("Contexte ouvert, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);

  const chip = d.querySelector(`#contexte [data-f="d:${pid}"]`);
  check("la pièce s'ouvre depuis un vrai bouton du dossier", !!chip && chip.tagName === "BUTTON");
  chip.focus(); chip.click();
  const boite = d.getElementById("panPiece");
  check("la pièce s'ouvre DANS le Contexte, nommée pour qui ne la voit pas (§4.6)",
    !!boite && panContexte.contains(boite) && !panContexte.hidden
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
  check("et le focus reste sur CE passage, bien que la pièce ait été redessinée",
    cleActive() === "e:" + autre && actif() !== null && d.contains(actif()));
  check("un passage retenu le dit à qui ne voit pas le fond",
    /retenu/.test(passage(autre).textContent));
  check("retenir se voit sous la pièce, au moment même (§4.3)",
    /Retenu dans ton Contexte/.test((d.querySelector("#panPiece .rappel.retenu") || {}).textContent || ""));
  check("et la porte Contexte s'allume", d.getElementById("btnContexte").classList.contains("recoit"));
  check("et la fiche neuve s'allume juste sous la pièce, là où on va la prendre",
    !!d.querySelector(`#zoneRetenus .mchip.neuf [data-f="c:${autre}"]`));
  w.rendreTout();                       // un redessin qui n'est PAS un geste
  check("la confirmation ne vit qu'un rendu",
    !d.querySelector("#panPiece .rappel.retenu") && !d.getElementById("btnContexte").classList.contains("recoit")
    && !d.querySelector(".mchip.neuf"));
  passage(autre).focus();
  check("mais ce n'est pas un interrupteur : aucun aria-pressed",
    ![...d.querySelectorAll(".empan")].some(e => e.hasAttribute("aria-pressed")));
  check("chaque passage dit sa dimension, sans la couleur",
    w.CHAMPS.filter(c => c.pid === pid).every(c => passage(c.id).textContent.includes(c.dim)));

  touche(passage(autre), " ");
  check("Espace sur un passage retenu ne l'oublie pas", w.S.retenus.includes(autre));
  check("mais l'écran dit où l'on retire", !!d.querySelector("#panPiece .rappel")
    && /Contexte/.test(d.querySelector("#panPiece .rappel").textContent));
  check("et le dit à l'oreille", /Contexte/.test(annonce()));
  w.rendreTout();                       // un redessin qui n'est PAS un reclic
  check("le rappel ne vit qu'un rendu", !d.querySelector("#panPiece .rappel"));
  touche(passage(veut), "Enter");

  touche(d.body, "Escape");
  check("Échap replie la pièce — le jeu n'avait jamais cessé d'être vivant", !w.S.modalPiece && !inerte());
  check("et le Contexte reste ouvert : c'est le second Échap qui le fermerait (§4.10 règle 3)",
    !panContexte.hidden);
  check("le focus revient au chip du dossier qui l'avait ouverte", cleActive() === "d:" + pid);
  check("lue, elle le dit par son nom — pas par un gris",
    /déjà lue/.test(d.querySelector(`#contexte [data-f="d:${pid}"]`).getAttribute("aria-label") || ""));

  // Le Contexte est déjà ouvert depuis `voirPiecesRecues` et ne s'est jamais
  // refermé (§4.6) : pas de bascule ici, elle le fermerait.
  const puce = d.querySelector(`#contexte [data-f="c:${veut}"]`);
  puce.focus();
  w.rendreTout();
  check("le focus survit au redessin d'une puce du Contexte",
    cleActive() === "c:" + veut && actif() !== puce);
  // Les GESTES désignent leur élément par sa clé ; seuls les contrôles de focus
  // lisent le focus — sans quoi une panne en amont en masquerait une en aval.
  d.querySelector(`#contexte [data-f="c:${veut}"]`).click();
  check("phrase en cours, tout ce qui se clique s'atteint au clavier", injoignables().length === 0);
  const croix = [...d.querySelectorAll(".fermer, .mchip .del")];
  check("chaque croix a un nom, et ce nom n'est pas « × »",
    croix.length > 0 && croix.every(c => (c.getAttribute("aria-label") || "").length > 1));

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
    for (const e of d.querySelectorAll("#panPiece .empan")) {
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

console.log("\n=== Le Contexte dit son état (§4.6) ===");
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
  check("la phrase pleine, le Contexte le dit en une ligne", !!raison && /ne prend plus de passage/.test(raison.textContent));
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
  // LES PASSAGES D'UNE REMISE CLOSE SE RANGENT — repliés, jamais retirés.
  const w = boot(), d = w.document;
  let garde = 0;
  while (w.S.remisesEnvoyees === 1 && garde++ < 10) {
    const a = w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
    if (!a || H.composerLien(w, H.lienTag(w, a.attend)) < 0) break;
  }
  check("la remise 1 servie, la suivante est arrivée", w.S.remisesEnvoyees === 2);
  w.basculerPanneau("contexte");
  const anciens = w.S.retenus.slice();
  const ligne = () => d.querySelector('#zoneRetenus [data-f="s:0"]');
  const cache = k => !!d.querySelector(`#zoneRetenus [data-f="c:${k}"]`).closest("[hidden]");
  check("les passages de la remise close se rangent sous une ligne repliée",
    anciens.length > 0 && !!ligne() && ligne().getAttribute("aria-expanded") === "false" && anciens.every(cache));
  check("la ligne dit la remise et son compte", /remise/.test(ligne().textContent)
    && ligne().textContent.includes(anciens.length + " passage"));
  const pid2 = w.JEU.remises[1].pieces.find(p => H.empansDe(w, p).length);
  const k2 = H.empansDe(w, pid2)[0];
  w.ouvrirPiece(pid2); H.surligner(w, k2);
  check("ceux de la remise en cours restent dépliés, au-dessus",
    !cache(k2) && !!(d.querySelector(`[data-f="c:${k2}"]`).compareDocumentPosition(ligne()) & 4));
  ligne().focus(); ligne().click();
  check("un clic la déplie : rien n'a été retiré", anciens.every(k => !cache(k)) && ligne().getAttribute("aria-expanded") === "true");
  check("le focus reste sur la ligne", d.activeElement === ligne());
  check("et ses passages restent composables : aucune barrière entre les affaires",
    w.R.indexTermeChamp(w.S) >= 0 && !d.querySelector(`[data-f="c:${anciens[0]}"]`).hasAttribute("aria-disabled"));
  ligne().click();
  const pid1 = w.JEU.remises[0].pieces.find(p => H.empansDe(w, p).some(k => !w.S.retenus.includes(k)));
  const k1 = H.empansDe(w, pid1).find(k => !w.S.retenus.includes(k));
  w.ouvrirPiece(pid1); H.surligner(w, k1);
  check("retenir depuis une pièce close déplie sa remise : la fiche neuve se voit", !cache(k1));
}

bilan();

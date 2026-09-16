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

console.log("\n=== Refus de catégorie : le seul refus qui existe ===");
{
  const w = boot();
  H.livrerTout(w);   // la comparaison n'est composable qu'une fois son texte reçu (§4.5)
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  const a = w.CHAMPS[0];
  const b = w.CHAMPS.find(c => c.dim !== a.dim);
  H.surligner(w, a.id); H.surligner(w, b.id);
  check("aucune relation ne se déduit entre deux dimensions", w.M.deduire(a.id, b.id) === null);
  const iT = () => H.iTermeChamp(w);
  w.poserBloc(iT(), w.S.retenus.indexOf(a.id));
  w.poserBloc(iT(), w.S.retenus.indexOf(b.id));
  const iArt = w.R.blocsOfferts(w.S).findIndex(x => x.imbrique);
  if (iArt >= 0) w.poserBloc(iArt); else H.cloreSurPlace(w);
  check("deux dimensions différentes : la phrase est refusée", !!w.S.refus);
  check("le message ne dit rien de plus que la catégorie",
    /ne se comparent pas|dimensions différentes|slot/.test(w.S.refus));
  check("rien n'est tombé au journal", w.S.brouillon.length === 0);
  check("et rien n'attend d'être envoyé", w.S.prete === null);
  check("rien n'est parti au plan", w.S.plaidoirie.length === 0);
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

  const paires = [];
  for (let i = 0; i < w.CHAMPS.length; i++)
    for (let j = i + 1; j < w.CHAMPS.length; j++) {
      const a = w.CHAMPS[i], b = w.CHAMPS[j];
      if (a.dim === b.dim && a.valeur === b.valeur && !["qui","quoi","ou"].includes(a.dim))
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

  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, C.termes[0]);
  check("livré, il est offert", w2.R.blocsOfferts(w2.S).some(b => b.id === (manquant||{}).id));
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
  H.livrerTout(w);                            // l'article doit avoir été reçu (§4.5)
  const C = H.lienConclusion(w);              // arité 1 : une comparaison qualifiée
  const sous = C.termes[0];                   // la comparaison qu'elle emboîte
  H.poserComparaison(w, sous);
  check("la comparaison est posée mais PAS close", w.S.compo.length > 0 && w.S.brouillon.length === 0);
  const offerts = w.R.blocsOfferts(w.S);
  check("l'automate offre de continuer", offerts.some(b => b.imbrique));
  check("toutes les liaisons-articles sont offertes, pas seulement la bonne",
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
  w.closeModal();
  const zone = halo();
  check("et il montre le contexte", !!zone && zone.contains(w.document.querySelector(".mchip")));

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
  w.closeModal();
  check("une deuxième citation, geste déjà connu, ne rallume pas le halo",
    bandeau().hidden && !halo());
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut2));
  w.envoyerCompo();
  check("elle non plus ne ferme rien pour de bon",
    !w.localStorage.getItem("iavocat_tuto"));
  check("Maître Auber attend maintenant une comparaison",
    !!H.sousTerme(H.lienTag(w, attenteSuivante().attend)));
  check("et le halo revient aussitôt : deux passages sont requis, pas un",
    !!halo() && halo().id === "zoneRetenus");
  const veutA = attenteSuivante().attend;
  const [tA, tB] = H.sousTerme(H.lienTag(w, veutA)).termes;
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(tA));
  check("un premier passage posé, le halo reste sur le contexte — il en faut un second",
    halo() && halo().id === "zoneRetenus");
  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(tB));
  check("les deux posés, le halo montre les propositions de l'article",
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
{
  const avec = H.boot({url:"http://localhost/"});
  const sans = H.boot({graine:{iavocat_tuto:"1"}});
  check("déjà vu, il ne s'affiche plus",
    sans.document.getElementById("tuto").hidden && !sans.document.querySelector("[data-tuto]"));
  check("et l'état de départ est identique, halo ou pas",
    JSON.stringify(avec.S) === JSON.stringify(sans.S));
}

console.log("\n=== La modale de pièce ===");
{
  const w = boot();
  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const m = () => w.document.querySelector(".modal").innerHTML;
  check("le titre et le signataire s'affichent",
    m().includes(w.JEU.pieces[pid].titre) && m().includes(w.JEU.pieces[pid].qui));
  const eid = Object.keys(w.JEU.pieces[pid].empans)[0];
  w.surligner(pid, eid);
  check("l'empan surligné se marque « pris » dans la modale", m().includes("empan pris"));
  const empan = w.JEU.pieces[pid].empans[eid];
  check("et apparaît dans le contexte",
    contexte(w).includes("zoneRetenus") && contexte(w).includes(empan.nom || empan.texte));
  w.closeModal();
  check("fermer la modale n'efface pas le contexte", w.S.retenus.length === 1);
  const pidR = H.pidRegle(w);
  if (!Object.keys(w.JEU.pieces[pidR].empans || {}).length) {
    w.ouvrirPiece(pidR);
    check("une règle sans empan s'affiche sans planter", m().includes(w.JEU.pieces[pidR].titre));
  } else check("(la règle testée porte des empans)", true);
}

console.log("\n=== Les répliques : seulement au versement ===");
{
  const w = boot();
  const L = w.JEU.liens.find(x => x.rep && !x.vice && !x.faux);
  const i = H.composerLien(w, L);
  check("une phrase à réplique propre se compose", i >= 0);
  check("composée, elle ne dit rien", !discussion(w).includes(L.rep.slice(0, 25)));
  check("close, elle n'est pourtant pas partie",
    w.S.prete === i && !w.S.brouillon[i].versee && w.S.plaidoirie.length === 0);
  w.envoyer(i);
  check("envoyée, la réplique du lien sort", discussion(w).includes(L.rep.slice(0, 25)));
  check("la phrase est marquée envoyée", w.S.brouillon[i].versee);
  check("l'envoi vide la phrase en attente", w.S.prete === null);
  const avant = w.S.plaidoirie.length;
  w.envoyer(i);
  check("envoyer deux fois est sans effet", w.S.plaidoirie.length === avant);
}

console.log("\n=== L'économie de l'écran : ce qui est déjà sous les yeux ===");
{
  const w = boot();
  /* PIÈGE : l'attente courante n'a pas toujours de question — la remise peut la
     porter dans son TEXTE. On avance jusqu'à celle qui en pose une. */
  const courante = () => w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  while (courante() && !courante().question)
    w.envoyer(H.composerLien(w, H.lienTag(w, courante().attend)));
  const q = courante();
  check("la question vient d'être posée : elle est le dernier mot",
    !!q && !!q.question && w.S.fil[w.S.fil.length - 1].texte === q.question);
  check("le composeur ne la répète donc pas", !composeur(w).includes(q.question));
  w.ouvrirPiece(H.pidAvecDeclenche(w));
  check("l'avocat ayant repris la parole, la question n'est plus le dernier mot",
    w.S.fil[w.S.fil.length - 1].texte !== q.question);
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
  check("et le plan n'a pas encore de colonne à l'écran", !plaidoirieVisible(w));
  const moyen = H.lienTag(w, w.R.attentesDe(w.JEU.remises[0])[0].attend);
  const j = H.composerLien(w, moyen);
  w.envoyer(j);
  check("un moyen, lui, s'y inscrit", plaidoirie(w).includes(w.S.brouillon[j].texte));
  check("mais la colonne reste hors écran", !plaidoirieVisible(w));
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
  const i = w.S.brouillon.findIndex(n => !n.versee);
  w.verserContre(i);
  check("verser contre une affirmation marque la cible", w.S.plaidoirie.some(x => x.contre === 0));
  check("l'affichage nomme l'affirmation opposée", plaidoirie(w).includes(w.JEU.repetition.affirmations[0].court));
  const avant = w.S.fil.length;
  w.verserContre(i);
  check("ré-envoyer la même phrase donne « deja »",
    discussion(w).includes(w.JEU.avocat.deja.slice(0, 15)) && w.S.fil.length > avant);
  while (w.S.repetitionIdx < w.JEU.repetition.affirmations.length) w.avancerRepetition();
  check("au bout, la répétition se clôt sur son texte de fin", discussion(w).includes(w.JEU.repetition.fin.slice(0, 15)));
  check("la clôture est de nouveau ouverte", !w.document.getElementById("btnCloture").disabled);
}
{
  const w = boot();
  H.instruire(w);   // le chemin docile envoie tout ce qu'il compose
  w.cloturer();
  check("la continuation ne laisse aucune prémisse orpheline",
    w.S.brouillon.every(n => n.versee));
  check("et marque « déjà envoyée » celles qui sont parties", discussion(w).includes("déjà envoyée"));
  const w2 = boot();
  H.instruire(w2);
  H.composerLien(w2, H.lienConclusion(w2));
  w2.cloturer();
  check("une phrase gardée reste offerte au présentoir",
    /verserContre\(/.test(w2.document.getElementById("discussion").innerHTML));
  check("c'est le dernier moment où la conclusion peut partir",
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

bilan();

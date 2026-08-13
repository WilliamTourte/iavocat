// Parcours & ergonomie — ce que les autres suites ne couvrent pas : le
// composeur pas à pas et le retour en arrière, la modale de pièce, les
// répliques de l'avocat (faux, rep de lien, escalades séparées, deja) et le
// grain fin de la répétition de plaidoirie. Contenu embarqué.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, discussion, memoire, composeur, plaidoirie, plaidoirieVisible } = H;
const boot = () => H.boot();

console.log("\n=== Le composeur, bloc par bloc ===");
{
  /* On livre tout d'abord : une composition ne RESTE ouverte que là où l'état
     suivant offre un vrai choix. Là où il n'en offre qu'un, la phrase se clôt
     d'elle-même — une suite unique n'est pas un choix (§4.5), et il n'y a plus
     rien à retirer ni à vider. */
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
  // On désigne quand même les deux : rien n'est jamais interdit à la pose,
  // c'est à la clôture que la catégorie tranche (§4.5).
  const iT = () => H.iTermeChamp(w);
  w.poserBloc(iT(), w.S.retenus.indexOf(a.id));
  w.poserBloc(iT(), w.S.retenus.indexOf(b.id));
  // C'est l'article — le seul moyen de clore — qui déclenche la validation.
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
  // Le contrôle central : pour CHAQUE lien d'arité 2 du contenu, désigner ses
  // deux empans doit produire exactement la forme déclarée — sans que le
  // joueur ait rien eu à choisir.
  let tous = true, n = 0;
  for (const L of H.comparaisons(w)) {
    n++;
    if (w.M.deduire(L.termes[0], L.termes[1]) !== L.forme) tous = false;
  }
  check(`les ${n} relations déclarées se déduisent toutes des valeurs`, n > 0 && tous);

  /* Le PATRON doit s'écrire. Une régression ici ne casse aucune forme réduite
     — les phrases restent reconnues — mais le verbe disparaît de la phrase et
     le joueur lit « l'heure d'arrivée l'heure des éclats ». Aucune suite ne
     l'avait vu ; c'est la relecture à l'œil qui l'a attrapé. */
  let patronsOk = true, vus = 0;
  for (const L of H.comparaisons(w)) {
    const f = w.JEU.grammaire.formes[L.forme];
    if (!f.patron) continue;
    // La comparaison ne peut plus se clore seule : on la lit dans le composeur,
    // là où le joueur la voit avant de choisir son article.
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

  // L'ordre canonique : une forme ordonnée range ses termes selon son `sens`,
  // quel que soit l'ordre dans lequel le joueur a cliqué.
  const ord = H.comparaisons(w).find(L => (w.JEU.grammaire.formes[L.forme]||{}).ordonne);
  if (ord) {
    const [x, y] = ord.termes;
    check("l'ordre des clics n'importe pas : la forme range ses termes",
      JSON.stringify(w.M.ordonner(ord.forme, [y, x])) === JSON.stringify([x, y]));
  } else check("(aucune forme ordonnée dans ce contenu)", true);

  // Deux valeurs égales dans une dimension d'écart restent composables : ce
  // sont des doublons banals, ils doivent vivre (§4.4).
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
  // amener la composition en S4, où les articles sont offerts
  const C = H.lienConclusion(w);
  H.livrerTout(w);
  H.poserComparaison(w, C.termes[0]);
  const offerts = w.R.blocsOfferts(w.S);
  check("tout ce qui est offert a sa pièce",
    offerts.every(b => !b.piece || new Set(w.R.piecesLivrees(w.S)).has(b.piece)));

  // Le même, sans rien livrer : l'article du vice n'est pas encore là.
  const w0 = boot();
  const livrees0 = new Set(w0.R.piecesLivrees(w0.S));
  const manquant = avecPiece.find(b => b.imbrique && !livrees0.has(b.piece));
  check("l'article du vice n'est pas encore là", !!manquant);
  check("il n'est donc offert nulle part",
    !H.cheminVers(w0, (manquant||{}).forme).length
    || !w0.R.blocsOfferts(w0.S).some(b => b.id === (manquant||{}).id));

  // une fois la pièce livrée, la même liaison apparaît
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, C.termes[0]);
  check("livré, il est offert", w2.R.blocsOfferts(w2.S).some(b => b.id === (manquant||{}).id));
  check("et la conclusion devient composable", H.composerLien(w2, C) >= 0);
}

console.log("\n=== Un fait se cite, une relation se fonde ===");
{
  /* LA SECONDE VOIE DE CLÔTURE (§4.5). Un empan seul se clôt par sa citation :
     le désigner, c'est déjà citer une pièce, et le fondement est dans le geste.
     Aucun article n'est requis — il n'y a pas de raisonnement à fonder. */
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
  /* En session 1 l'état qui suit l'empan n'offre QUE cette clôture : une suite
     unique n'est pas un choix, la phrase se referme sans qu'on la confirme
     (§4.5). Le geste est donc : désigner, et c'est tout. */
  check("un seul empan posé, la phrase s'est close d'elle-même",
    w.S.compo.length === 0 && w.S.brouillon.length === 1);
  check("et aucun article n'est requis pour cette voie", !bc.piece);
  check("la citation se clôt sans article", w.S.brouillon.length === 1);
  check("elle porte exactement le lien déclaré",
    w.M.memeRed(w.S.brouillon[0].reduite, {forme: L.forme, termes: L.termes}));
  check("son terme est resté ATOMIQUE — rien n'a été emboîté",
    typeof w.S.brouillon[0].reduite.termes[0] === "string");
  check("elle attend sur place, comme toute phrase close", w.S.prete === 0);

  /* L'ÉCRITURE : un empan s'y lit DEUX FOIS — son nom, puis sa citation, puis
     la pièce d'où elle sort. C'est ce qui fait qu'une réponse répond au lieu
     de reformuler la question (§4.1). */
  const e = w.CHAMPS.find(c => c.id === L.termes[0]);
  const txt = w.S.brouillon[0].texte;
  check("la phrase porte le nom de l'empan", txt.includes(e.nom));
  check("et sa citation", txt.includes(e.texte));
  check("et la pièce d'où elle vient", !e.court || txt.includes(e.court));

  // Une comparaison, elle, ne s'écrit QUE par les noms — sinon on retomberait
  // sur l'empilement de citations que le nom avait soigné (§8.8 de docs/ECRITURE.md).
  const w2 = boot();
  H.livrerTout(w2);
  const C = H.lienConclusion(w2);
  const j = H.composerLien(w2, C);
  const feuilles = w2.CHAMPS.filter(c => (C.termes[0].termes || []).includes(c.id));
  check("une comparaison ne cite pas, elle nomme",
    j >= 0 && feuilles.every(c => !w2.S.brouillon[j].texte.includes(c.texte)));
}
{
  /* LA VOIE DE COMPARAISON N'EST PAS OUVERTE D'EMBLÉE. Le second empan attend
     lui aussi sa pièce : la session 1 n'enseigne qu'à lire (§3). */
  const w = boot();
  const G = w.JEU.grammaire;
  const second = (G.blocs || []).find(b => b.type === "terme" && b.deduit);
  if (second && second.piece) {
    check("le second empan est conditionné à une pièce",
      !new Set(w.R.piecesLivrees(w.S)).has(second.piece));
    for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
    const e = w.CHAMPS[0];
    H.surligner(w, e.id);
    /* Ce que l'état suivant offre ne s'observe plus APRÈS la pose : il n'offre
       qu'une clôture, donc la phrase se referme (§4.5). On le lit donc sur la
       grammaire, filtrée par ce qui est livré — comme le fait le jeu. */
    const livrees = new Set(w.R.piecesLivrees(w.S));
    const apres = (G.blocs || []).filter(b => b.de === second.de && (!b.piece || livrees.has(b.piece)));
    check("un empan posé, aucun second n'est offert",
      !apres.some(b => b.type === "terme" && b.deduit));
    check("seule la citation reste, donc la session 1 ne compare pas",
      apres.length === 1 && apres[0].cite);
    w.poserBloc(w.R.blocsOfferts(w.S).findIndex(b => b.type === "terme"), 0);
    check("et le geste s'arrête là : la phrase s'est close toute seule",
      w.S.compo.length === 0 && w.S.prete !== null);
    // livrée, elle s'ouvre — et pour tous les empans, sans préférence
    const w2 = boot();
    H.livrerTout(w2);
    for (const pid of Object.keys(w2.JEU.pieces)) w2.ouvrirPiece(pid);
    H.surligner(w2, e.id);
    w2.poserBloc(w2.R.blocsOfferts(w2.S).findIndex(b => b.type === "terme"), 0);
    check("une fois la pièce livrée, le second empan est offert",
      w2.R.blocsOfferts(w2.S).some(b => b.type === "terme" && b.deduit));
    check("et la citation reste offerte à côté : deux voies, pas une bascule",
      w2.R.blocsOfferts(w2.S).some(b => b.cite));
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

  /* LE « CF ARTICLE » OBLIGATOIRE : rien ne clôt une comparaison qu'un
     article. Tout ce que l'IA dit est fondé — il n'y a pas d'issue nue. */
  check("aucun bloc ne clôt sans qualifier", !offerts.some(b => !b.forme && !b.imbrique));
  check("tous les blocs offerts portent un article", offerts.every(b => b.imbrique && b.forme));
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, sous); H.cloreSurPlace(w2);
  check("une comparaison seule ne peut pas se clore", w2.S.brouillon.length === 0);
  check("mais le pressentiment, lui, a bien eu lieu au composeur", w2.S.vice_pressenti);
  check("et il n'a rien transmis", w2.S.plaidoirie.length === 0 && !w2.S.vice_expose);

  // continuer : on obtient la forme emboîtée, en UNE phrase
  const i = H.composerLien(w, C);
  check("la continuation produit exactement la forme du lien déclaré",
    i >= 0 && w.M.memeRed(w.S.brouillon[i].reduite, {forme: C.forme, termes: C.termes}));
  check("en une seule phrase, sans passer par une liste", w.S.brouillon.length === 1);
  check("la phrase se lit d'un trait, ponctuation recollée",
    /, au regard /.test(w.S.brouillon[i].texte) && !/ ,/.test(w.S.brouillon[i].texte));
  check("elle est écrite avec les NOMS des empans, pas les citations",
    w.CHAMPS.filter(c => sous.termes.includes(c.id))
            .every(c => w.S.brouillon[i].texte.includes(c.nom)));
}

console.log("\n=== Le premier geste, montré ===");
{
  /* LE TUTORIEL (§4.8). De la signalétique, pas de la mécanique : il pointe la
     ZONE où le geste a lieu, jamais le bon empan, et il ne décide rien. Comme
     partout ailleurs, rien n'est nommé ici — ni pièce, ni empan, ni phrase. */
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

  /* LE MAUVAIS PASSAGE. Le tutoriel n'avance pas et le dit — mais il
     n'empêche rien : la mémoire retient quand même, gratuite et réversible. */
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
  check("et il montre la mémoire", !!zone && zone.contains(w.document.querySelector(".mchip")));

  w.poserBloc(H.iTermeChamp(w), w.S.retenus.indexOf(veut));
  const envoi = halo();
  check("la phrase close, il montre le seul geste qui parle",
    !!envoi && envoi.classList.contains("envoi"));

  w.envoyer(w.S.prete);
  check("la réponse envoyée, il se tait", bandeau().hidden && !halo());
  check("et il ne reviendra pas", !!w.localStorage.getItem("iavocat_tuto"));
}
{
  /* IL NE DÉCIDE RIEN : le jeu est exactement le même sans lui. */
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
  check("et apparaît en mémoire",
    memoire(w).includes("zoneRetenus") && memoire(w).includes(empan.nom || empan.texte));
  w.closeModal();
  check("fermer la modale n'efface pas la mémoire", w.S.retenus.length === 1);
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
  // « sur place » = sous le canal, là où la phrase vient d'être écrite (§4.6)
  check("close, elle attend SUR PLACE", w.S.prete === i && composeur(w).includes("Envoyer"));
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
  /* Le composeur vit SOUS le fil (§4.6) : la question qu'on vient de poser est
     souvent la bulle juste au-dessus. Le rappel ne la redit donc que lorsqu'elle
     a cessé d'être le dernier mot (§4.9). Rien n'est nommé ici : la question se
     dérive de l'attente courante, comme partout ailleurs. */
  const w = boot();
  const q = w.R.attenteCourante(w.S, w.R.remiseCourante(w.S));
  check("au départ, la question vient d'être posée : elle est le dernier mot",
    !!q && !!q.question && w.S.fil[w.S.fil.length - 1].texte === q.question);
  check("le composeur ne la répète donc pas", !composeur(w).includes(q.question));
  /* On fait reparler l'avocat par le geste qui le fait toujours parler : ouvrir
     une pièce qui porte un `declenche`. C'est le déclencheur, pas la pièce, qui
     compte ici — l'assertion porte sur l'écran, pas sur un chemin de partie. */
  w.ouvrirPiece(H.pidAvecDeclenche(w));
  check("l'avocat ayant repris la parole, la question n'est plus le dernier mot",
    w.S.fil[w.S.fil.length - 1].texte !== q.question);
  check("le composeur la rappelle alors", composeur(w).includes(q.question));
}

console.log("\n=== Le plan ne retient que les moyens ===");
{
  const w = boot();
  H.livrerTout(w);   // toutes les tournures reçues, pour atteindre l'observation
  // une observation : reconnue, commentée, mais impossible à plaider
  const obs = w.JEU.liens.find(x => !x.tag && !x.conclusion && !x.faux);
  const i = H.composerLien(w, obs);
  check("l'observation se compose", i >= 0);
  w.envoyer(i);
  check("l'observation est bien partie", w.S.brouillon[i].versee);
  check("l'avocat y a répondu", w.S.fil.length > 1);
  check("mais elle n'entre pas au plan", !plaidoirie(w).includes(w.S.brouillon[i].texte));
  /* Le plan ne se contente plus de le dire : tant que rien ne s'y inscrit, sa
     colonne n'existe pas (§4.9). Une phrase envoyée mais non plaidable ne l'ouvre
     donc pas — c'est le MOYEN qui la fait apparaître, et cette apparition est
     ce qui enseigne le plan. On éprouve les deux états, pas seulement le second. */
  check("et le plan n'a pas encore de colonne à l'écran", !plaidoirieVisible(w));
  // un moyen : ce qui sert une attente de session
  const moyen = H.lienTag(w, w.R.attentesDe(w.JEU.remises[0])[0].attend);
  const j = H.composerLien(w, moyen);
  w.envoyer(j);
  check("un moyen, lui, s'y inscrit", plaidoirie(w).includes(w.S.brouillon[j].texte));
  check("et fait apparaître la colonne", plaidoirieVisible(w));
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
  /* Depuis que l'article est obligatoire, une phrase de bruit est une
     QUALIFICATION qui ne se rattache à rien : c'est l'escalade
     `rep_sans_rapport` qui monte, et plus celle des comparaisons nues —
     lesquelles ne peuvent plus se clore. `rep_inutile` reste un filet, pour
     une affaire qui offrirait encore de clore sans qualifier. */
  check("les phrases sans lien font monter l'escalade « sans rapport »", w.S.incompris >= 2);
  check("la seconde réplique n'est pas la première",
    discussion(w).includes(w.JEU.avocat.rep_sans_rapport[1].slice(0, 20)));
  check("l'escalade des comparaisons nues est un compteur séparé, et reste à zéro",
    w.S.inutiles === 0);
}
{
  /* TROIS façons de rater, trois agacements. Une citation hors sujet n'est ni
     une comparaison nue ni un article mal rattaché : c'est une réponse qui ne
     répond pas, et elle a son escalade à elle (§4.5). */
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
  // La continuation (§4.5) écrit la conclusion d'un trait : la comparaison ne
  // se dépose plus au journal comme une phrase orpheline jamais transmise.
  check("la continuation ne laisse aucune prémisse orpheline",
    w.S.brouillon.every(n => n.versee));
  check("et marque « déjà envoyée » celles qui sont parties", discussion(w).includes("déjà envoyée"));
  // une phrase close mais gardée reste proposée par le présentoir
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
  // le cas limite : rien d'écrit au moment de la répétition
  const w = boot();
  H.instruire(w);
  const garde = w.S.brouillon.slice();
  w.S.brouillon.length = 0; w.S.plaidoirie.length = 0;
  w.cloturer();
  check("journal vide → présentoir vide, sans planter", discussion(w).includes("aucune phrase à y opposer"));
  w.S.brouillon.push(...garde);
}

bilan();

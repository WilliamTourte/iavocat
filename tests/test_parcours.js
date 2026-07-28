// Parcours & ergonomie — ce que les autres suites ne couvrent pas : le
// composeur pas à pas et le retour en arrière, la modale de pièce, les
// répliques de l'avocat (faux, rep de lien, escalades séparées, deja) et le
// grain fin de la répétition de plaidoirie. Contenu embarqué.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, canal, memoire, atelier, plan } = H;
const boot = () => H.boot({contenu:null});

console.log("\n=== Le composeur, bloc par bloc ===");
{
  const w = boot();
  check("au départ, la phrase est vide", w.S.compo.length === 0);
  check("l'état de départ offre au moins un bloc", w.blocsOfferts().length > 0);
  const emp = w.CHAMPS.filter(c => c.dim === w.CHAMPS[0].dim).slice(0, 2);
  for (const pid of new Set(emp.map(e => e.pid))) w.ouvrirPiece(pid);
  for (const e of emp) H.surligner(w, e.id);
  const iT = w.blocsOfferts().findIndex(b => b.type === "terme" && b.source !== "note");
  w.poserBloc(iT, 0);
  check("poser un terme fait avancer l'automate", w.S.compo.length === 1);
  check("l'état a changé", w.etatCompo() !== w.JEU.grammaire.depart);
  w.retirerBloc();
  check("← retirer revient en arrière", w.S.compo.length === 0);
  check("et l'état repart du départ", w.etatCompo() === w.JEU.grammaire.depart);
  w.poserBloc(iT, 0);
  w.viderCompo();
  check("tout effacer vide la phrase", w.S.compo.length === 0 && !w.S.refus);
}

console.log("\n=== Refus de catégorie : le seul refus qui existe ===");
{
  const w = boot();
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  const a = w.CHAMPS[0];
  const b = w.CHAMPS.find(c => c.dim !== a.dim);
  H.surligner(w, a.id); H.surligner(w, b.id);
  check("aucune relation ne se déduit entre deux dimensions", w.M.deduire(a.id, b.id) === null);
  // On désigne quand même les deux : rien n'est jamais interdit à la pose,
  // c'est à la clôture que la catégorie tranche (§4.5).
  const iT = () => w.blocsOfferts().findIndex(x => x.type === "terme" && x.source !== "note");
  w.poserBloc(iT(), w.S.memoire.indexOf(a.id));
  w.poserBloc(iT(), w.S.memoire.indexOf(b.id));
  H.cloreSurPlace(w);
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
  for (const L of w.JEU.liens) {
    if ((w.JEU.grammaire.formes[L.forme].arite || 2) !== 2) continue;
    n++;
    if (w.M.deduire(L.termes[0], L.termes[1]) !== L.forme) tous = false;
  }
  check(`les ${n} relations déclarées se déduisent toutes des valeurs`, n > 0 && tous);

  /* Le PATRON doit s'écrire. Une régression ici ne casse aucune forme réduite
     — les phrases restent reconnues — mais le verbe disparaît de la phrase et
     le joueur lit « l'heure d'arrivée l'heure des éclats ». Aucune suite ne
     l'avait vu ; c'est la relecture à l'œil qui l'a attrapé. */
  let patronsOk = true, vus = 0;
  for (const L of w.JEU.liens) {
    const f = w.JEU.grammaire.formes[L.forme];
    if ((f.arite || 2) !== 2 || !f.patron) continue;
    const i = H.composerLien(w, L);
    if (i < 0) { patronsOk = false; continue; }
    vus++;
    const nom = id => (w.M.C[id] || {}).nom;
    const ord = w.M.ordonner(L.forme, L.termes);
    const attendu = f.patron.replace("{a}", nom(ord[0])).replace("{b}", nom(ord[1]));
    if (w.S.brouillon[i].texte !== attendu + ".") patronsOk = false;
  }
  check(`les ${vus} phrases déduites s'écrivent par leur patron, verbe compris`, vus > 0 && patronsOk);

  // L'ordre canonique : une forme ordonnée range ses termes selon son `sens`,
  // quel que soit l'ordre dans lequel le joueur a cliqué.
  const ord = w.JEU.liens.find(L => (w.JEU.grammaire.formes[L.forme]||{}).ordonne);
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
  check("des liaisons sont conditionnées à une pièce", avecPiece.length > 0);
  // amener la composition en S4, où les articles sont offerts
  const C = H.lienConclusion(w);
  H.poserComparaison(w, C.termes[0]);
  const offerts = w.blocsOfferts();
  const livrees = new Set(w.piecesLivrees());
  check("aucun article non livré n'est offert",
    offerts.every(b => !b.piece || livrees.has(b.piece)));
  const manquant = avecPiece.find(b => !livrees.has(b.piece));
  check("l'article du vice, lui, n'est pas encore là", !!manquant);
  check("il n'est donc pas dans la liste", !offerts.some(b => b.id === (manquant||{}).id));

  // une fois la pièce livrée, la même liaison apparaît
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, C.termes[0]);
  check("livré, il est offert", w2.blocsOfferts().some(b => b.id === (manquant||{}).id));
  check("et la conclusion devient composable", H.composerLien(w2, C) >= 0);
}

console.log("\n=== La continuation : une comparaison demande toujours « et donc ? » ===");
{
  const w = boot();
  H.livrerTout(w);                            // l'article doit avoir été reçu (§4.5)
  const C = H.lienConclusion(w);              // arité 1 : une comparaison qualifiée
  const sous = C.termes[0];                   // la comparaison qu'elle emboîte
  H.poserComparaison(w, sous);
  check("la comparaison est posée mais PAS close", w.S.compo.length > 0 && w.S.brouillon.length === 0);
  const offerts = w.blocsOfferts();
  check("l'automate offre de continuer", offerts.some(b => b.imbrique));
  check("et offre d'en rester là", offerts.some(b => !b.forme && !b.imbrique));
  check("toutes les liaisons-articles sont offertes, pas seulement la bonne",
    offerts.filter(b => b.imbrique).length > 1);

  // en rester là : on obtient la comparaison seule
  const w2 = boot();
  H.livrerTout(w2);
  H.poserComparaison(w2, sous); H.cloreSurPlace(w2);
  check("« en rester là » clôt sur la comparaison seule",
    w2.S.brouillon.length === 1 && w2.M.memeRed(w2.S.brouillon[0].reduite, sous));
  w2.envoyer(0);
  check("envoyée seule, elle ne lève pas vice_expose", w2.S.vice_pressenti && !w2.S.vice_expose);
  check("et l'avocat ne l'inscrit pas au plan", !plan(w2).includes(w2.S.brouillon[0].texte));

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

console.log("\n=== La modale de pièce ===");
{
  const w = boot();
  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const m = () => w.document.querySelector(".modal").innerHTML;
  check("le titre et le signataire s'affichent",
    m().includes(w.JEU.pieces[pid].titre) && m().includes(w.JEU.pieces[pid].qui));
  check("une légende des dimensions présentes est offerte", m().includes("legende"));
  const eid = Object.keys(w.JEU.pieces[pid].empans)[0];
  w.surligner(pid, eid);
  check("l'empan surligné se marque « pris » dans la modale", m().includes("empan pris"));
  check("et apparaît en mémoire", memoire(w).includes("Ce que tu retiens"));
  w.closeModal();
  check("fermer la modale n'efface pas la mémoire", w.S.memoire.length === 1);
  const pidR = H.pidRegle(w);
  if (!Object.keys(w.JEU.pieces[pidR].empans || {}).length) {
    w.ouvrirPiece(pidR);
    check("une règle sans empan le dit au lieu d'inviter à cliquer", m().includes("elle se lit"));
  } else check("(la règle testée porte des empans)", true);
}

console.log("\n=== Les répliques : seulement au versement ===");
{
  const w = boot();
  const L = w.JEU.liens.find(x => x.rep && !x.vice && !x.faux);
  const i = H.composerLien(w, L);
  check("une phrase à réplique propre se compose", i >= 0);
  check("composée, elle ne dit rien", !canal(w).includes(L.rep.slice(0, 25)));
  check("close, elle attend SUR PLACE", w.S.prete === i && atelier(w).includes("Maître Auber"));
  w.envoyer(i);
  check("envoyée, la réplique du lien sort", canal(w).includes(L.rep.slice(0, 25)));
  check("la phrase est marquée envoyée", w.S.brouillon[i].versee);
  check("l'envoi vide la phrase en attente", w.S.prete === null);
  const avant = w.S.plaidoirie.length;
  w.envoyer(i);
  check("envoyer deux fois est sans effet", w.S.plaidoirie.length === avant);
}

console.log("\n=== Le plan ne retient que les moyens ===");
{
  const w = boot();
  // une observation : reconnue, commentée, mais impossible à plaider
  const obs = w.JEU.liens.find(x => !x.tag && !x.conclusion && !x.faux);
  const i = H.composerLien(w, obs);
  w.envoyer(i);
  check("l'observation est bien partie", w.S.brouillon[i].versee);
  check("l'avocat y a répondu", w.S.fil.length > 1);
  check("mais elle n'entre pas au plan", !plan(w).includes(w.S.brouillon[i].texte));
  check("le plan le dit au lieu de rester muet", plan(w).includes("ce qu'il peut plaider"));
  // un moyen : ce qui ferme une session
  const moyen = H.lienTag(w, w.JEU.remises[0].attend);
  const j = H.composerLien(w, moyen);
  w.envoyer(j);
  check("un moyen, lui, s'y inscrit", plan(w).includes(w.S.brouillon[j].texte));
}
{
  const w = boot();
  H.instruire(w);
  const i = H.composerLien(w, H.lienFaux(w));
  check("le faux vice se compose", i >= 0);
  check("le faux vice reçoit rep_faux", canal(w).includes(w.JEU.avocat.rep_faux.slice(0, 25)));
  const txt = H.terminer(w);
  check("et déclenche la variante_faux de la fin", txt.includes(w.JEU.fins[3].variante_faux.slice(0, 25)));
}
{
  const w = boot();
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  H.phrasesBruit(w, 3);
  const n = w.S.brouillon.length;
  for (let i = 0; i < n; i++) w.envoyer(i);
  check("les phrases sans lien font monter l'escalade « et donc ? »", w.S.inutiles >= 2);
  check("la seconde réplique n'est pas la première",
    canal(w).includes(w.JEU.avocat.rep_inutile[1].slice(0, 20)));
  check("l'escalade des qualifications est un compteur séparé", w.S.incompris === 0);
}

console.log("\n=== La répétition de plaidoirie ===");
{
  const w = boot();
  H.instruire(w);
  H.composerLien(w, H.lienConclusion(w));
  w.cloturer();
  check("la répétition commence sur l'affirmation 1",
    canal(w).includes(w.JEU.repetition.affirmations[0].texte.slice(0, 20)));
  check("le présentoir propose ce qui a été écrit", canal(w).includes("Opposer une phrase"));
  check("confirmer pendant la répétition est refusé", w.document.getElementById("btnCloture").disabled);
  const i = w.S.brouillon.findIndex(n => !n.versee);
  w.verserContre(i);
  check("verser contre une affirmation marque la cible", w.S.plaidoirie.some(x => x.contre === 0));
  check("l'affichage nomme l'affirmation opposée", plan(w).includes(w.JEU.repetition.affirmations[0].court));
  const avant = w.S.fil.length;
  w.verserContre(i);
  check("ré-envoyer la même phrase donne « deja »",
    canal(w).includes(w.JEU.avocat.deja.slice(0, 15)) && w.S.fil.length > avant);
  while (w.S.repetitionIdx < w.JEU.repetition.affirmations.length) w.avancerRepetition();
  check("au bout, la répétition se clôt sur son texte de fin", canal(w).includes(w.JEU.repetition.fin.slice(0, 15)));
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
  check("et marque « déjà envoyée » celles qui sont parties", canal(w).includes("déjà envoyée"));
  // une phrase close mais gardée reste proposée par le présentoir
  const w2 = boot();
  H.instruire(w2);
  H.composerLien(w2, H.lienConclusion(w2));
  w2.cloturer();
  check("une phrase gardée reste offerte au présentoir",
    /verserContre\(/.test(w2.document.getElementById("canal").innerHTML));
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
  check("journal vide → présentoir vide, sans planter", canal(w).includes("aucune phrase à y opposer"));
  w.S.brouillon.push(...garde);
}

bilan();

// Parcours & ergonomie — ce que les autres suites ne couvrent pas : le
// composeur pas à pas et le retour en arrière, la modale de pièce, les
// répliques de l'avocat (faux, rep de lien, escalades séparées, deja) et le
// grain fin de la répétition de plaidoirie. Contenu embarqué.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, canal, memoire, atelier } = H;
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
  const G = w.JEU.grammaire;
  const forme = Object.entries(G.formes).find(([,f]) => f.relation === "meme_dim")[0];
  const iT = w.blocsOfferts().findIndex(x => x.type === "terme" && x.source !== "note");
  w.poserBloc(iT, w.S.memoire.indexOf(a.id));
  for (const id of H.cheminVers(w, forme)) {
    const j = w.blocsOfferts().findIndex(x => x.id === id);
    const bl = G.blocs.find(x => x.id === id);
    w.poserBloc(j, bl.type === "terme" ? w.S.memoire.indexOf(b.id) : undefined);
  }
  check("deux dimensions différentes : la phrase est refusée", !!w.S.refus);
  check("le message ne dit rien de plus que la catégorie", /dimensions différentes|slot/.test(w.S.refus));
  check("rien n'est tombé au brouillon", w.S.brouillon.length === 0);
  check("rien n'est parti au plan", w.S.plaidoirie.length === 0);
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
  check("et apparaît en mémoire", memoire(w).includes("La mémoire"));
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
  w.verserPlaidoirie(i);
  check("versée, la réplique du lien sort", canal(w).includes(L.rep.slice(0, 25)));
  check("la phrase est marquée versée", w.S.brouillon[i].versee);
  check("et figure au plan de plaidoirie", atelier(w).includes("plan de plaidoirie"));
  const avant = w.S.plaidoirie.length;
  w.verserPlaidoirie(i);
  check("verser deux fois est sans effet", w.S.plaidoirie.length === avant);
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
  for (let i = 0; i < n; i++) w.verserPlaidoirie(i);
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
  check("le présentoir propose le brouillon", canal(w).includes("Verser une phrase contre"));
  check("confirmer pendant la répétition est refusé", w.document.getElementById("btnCloture").disabled);
  const i = w.S.brouillon.findIndex(n => !n.versee);
  w.verserContre(i);
  check("verser contre une affirmation marque la cible", w.S.plaidoirie.some(x => x.contre === 0));
  check("l'affichage nomme l'affirmation opposée", atelier(w).includes(w.JEU.repetition.affirmations[0].court));
  const avant = w.S.fil.length;
  w.verserContre(i);
  check("re-verser la même phrase donne « deja »",
    canal(w).includes(w.JEU.avocat.deja.slice(0, 15)) && w.S.fil.length > avant);
  while (w.S.repetitionIdx < w.JEU.repetition.affirmations.length) w.avancerRepetition();
  check("au bout, la répétition se clôt sur son texte de fin", canal(w).includes(w.JEU.repetition.fin.slice(0, 15)));
  check("la clôture est de nouveau ouverte", !w.document.getElementById("btnCloture").disabled);
}
{
  const w = boot();
  H.instruire(w);   // le chemin docile verse tout ce qu'il compose
  w.cloturer();
  const htmlCanal = w.document.getElementById("canal").innerHTML;
  // Conclure en deux phrases laisse forcément la prémisse au brouillon :
  // elle a servi de terme, elle n'a jamais été transmise.
  check("la prémisse d'une conclusion reste au brouillon, non versée",
    w.S.brouillon.some(n => !n.versee) && w.S.brouillon.some(n => n.versee));
  check("le présentoir la propose encore", /verserContre\(/.test(htmlCanal));
  check("et marque « déjà versée » celles qui sont parties", canal(w).includes("déjà versée"));
}
{
  // le cas limite : un brouillon vide au moment de la répétition
  const w = boot();
  H.instruire(w);
  const garde = w.S.brouillon.slice();
  w.S.brouillon.length = 0; w.S.plaidoirie.length = 0;
  w.cloturer();
  check("brouillon vide → présentoir vide, sans planter", canal(w).includes("rien dans le brouillon"));
  w.S.brouillon.push(...garde);
}

bilan();

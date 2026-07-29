// Sauvegarde de partie — la partie survit au rafraîchissement, signée par
// le contenu. Deux fenêtres jsdom simulent le rechargement en se passant
// le localStorage via beforeParse.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, canal, memoire } = H;
const boot = graine => H.boot({graine, url:"http://localhost/"});
const bootContenu = (contenu,graine) => H.boot({contenu, graine, url:"http://localhost/"});
const sauvegarde = w => w.localStorage.getItem("iavocat_partie");
const CLE = "iavocat_partie";

console.log("\n=== Les quatre surfaces survivent au rechargement ===");
{
  const w1 = boot();
  for (const pid of Object.keys(w1.JEU.pieces)) w1.ouvrirPiece(pid);
  const L = w1.JEU.liens.find(x => !x.vice && !x.faux);
  const i = H.composerLien(w1, L);
  w1.envoyer(i);
  H.phrasesBruit(w1, 2);
  const avant = {
    memoire: [...w1.S.memoire], brouillon: w1.S.brouillon.length,
    plaidoirie: w1.S.plaidoirie.length, examinees: [...w1.S.examinees],
    fil: w1.S.fil.length, remises: w1.S.remisesEnvoyees
  };
  check("la partie est écrite dans localStorage", !!sauvegarde(w1));

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("la mémoire est restaurée à l'identique", w2.S.memoire.join() === avant.memoire.join());
  check("le brouillon aussi", w2.S.brouillon.length === avant.brouillon);
  check("le plan de plaidoirie aussi", w2.S.plaidoirie.length === avant.plaidoirie);
  check("les pièces consultées aussi", w2.S.examinees.join() === avant.examinees.join());
  check("le canal n'est pas rejoué depuis le début", w2.S.fil.length === avant.fil);
  check("les sessions déjà ouvertes ne repartent pas", w2.S.remisesEnvoyees === avant.remises);
  check("les phrases restaurées restent lisibles", w2.S.brouillon.every(n => typeof n.texte === "string"));
  check("le lien reconnu survit à l'aller-retour JSON",
    w2.S.brouillon.some(n => n.lien && n.lien.rep === L.rep));
}

console.log("\n=== Une composition en cours survit aussi ===");
{
  /* Il faut livrer d'abord : une composition ne reste EN COURS que là où
     l'état suivant offre un choix. Ailleurs elle se clôt seule (§4.5) — c'est
     alors la phrase close en attente qui survit, éprouvée juste après. */
  const w1 = boot();
  H.livrerTout(w1);
  const pid = H.pidPremiereRemise(w1);
  w1.ouvrirPiece(pid);
  const k = H.empansDe(w1, pid)[0];
  H.surligner(w1, k);
  const iT = w1.blocsOfferts().findIndex(b => b.type === "terme" && b.source !== "note");
  w1.poserBloc(iT, 0);
  check("un bloc est posé", w1.S.compo.length === 1);
  const etat = w1.etatCompo();

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("la phrase en cours est reprise", w2.S.compo.length === 1);
  check("et l'automate repart du bon état", w2.etatCompo() === etat);
  check("les blocs offerts sont les mêmes",
    w2.blocsOfferts().map(b=>b.id).join() === w1.blocsOfferts().map(b=>b.id).join());
}
{
  // La phrase close qui attend SUR PLACE : c'est l'écart entre comprendre et
  // dire (§4.7). Le perdre au rechargement effacerait la Fin 2.
  const w1 = boot();
  H.livrerTout(w1);                           // l'article doit avoir été reçu (§4.5)
  const i = H.composerLien(w1, H.lienConclusion(w1));
  check("la conclusion est close et attend", w1.S.prete === i && i >= 0);
  check("elle n'est pas partie", !w1.S.brouillon[i].versee && w1.S.plaidoirie.length === 0);

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("la phrase en attente survit au rechargement", w2.S.prete === i);
  check("elle s'affiche toujours sur place", H.atelier(w2).includes(w2.S.brouillon[i].texte));
  check("vice_trouve a survécu, vice_expose non", w2.S.vice_trouve && !w2.S.vice_expose);
  w2.effacerPrete();
  check("l'effacer ne la retire pas du journal", w2.S.prete === null && !!w2.S.brouillon[i]);
  check("et ne retire pas ce qu'on avait compris", w2.S.vice_trouve);
}

console.log("\n=== Les drapeaux et les déclencheurs ===");
{
  const w1 = boot();
  H.instruire(w1);
  H.composerLien(w1, H.lienConclusion(w1));
  const pidD = H.pidAvecDeclenche(w1);
  w1.ouvrirPiece(pidD);
  check("vice_trouve est levé", w1.S.vice_trouve);
  check("le declenche a déjà joué", w1.S.declenches.includes(pidD));

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("les drapeaux sont restaurés", w2.S.vice_trouve && !w2.S.vice_expose);
  const n = w2.S.fil.length;
  w2.ouvrirPiece(pidD);
  check("une_fois n'est pas rejoué après rechargement", w2.S.fil.length === n);
  check("→ Fin 2, comme avant le rechargement", H.numeroFin(H.terminer(w2)) === "2");
}

console.log("\n=== La signature du contenu ===");
{
  const w1 = boot();
  H.instruire(w1);
  const sauv = sauvegarde(w1);
  const autre = JSON.parse(JSON.stringify(w1.JEU));
  autre.remises[0].texte += " (retouché)";
  const w2 = bootContenu(autre, {[CLE]: sauv});
  check("un contenu modifié jette la sauvegarde", w2.S.remisesEnvoyees === 1 && w2.S.plaidoirie.length === 0);
  check("la partie repart proprement de la session 1", w2.S.brouillon.length === 0 && w2.S.memoire.length === 0);
  check("et la sauvegarde réécrite porte la nouvelle signature",
    JSON.parse(w2.localStorage.getItem(CLE)).sig !== JSON.parse(sauv).sig);
}
{
  const w = boot({[CLE]: "{ceci n'est pas du JSON"});
  check("une sauvegarde illisible ne fait pas planter le jeu", w.S.remisesEnvoyees === 1);
}

console.log("\n=== La fin efface, recommencer confirme ===");
{
  const w = boot();
  H.instruire(w);
  check("la sauvegarde existe pendant la partie", !!sauvegarde(w));
  H.terminer(w);
  check("la fin efface la sauvegarde", !sauvegarde(w));
}
{
  const w = boot();
  H.instruire(w);
  w.recommencer();
  check("un seul clic ne détruit rien", !!sauvegarde(w));
  check("le bouton demande confirmation",
    w.document.getElementById("btnRecommencer").textContent.includes("effacer"));
}

bilan();

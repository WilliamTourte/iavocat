// Sauvegarde de partie — elle survit au rafraîchissement et elle est signée par
// le contenu. Deux fenêtres jsdom simulent le rechargement via `beforeParse`.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan } = H;
const boot = graine => H.boot({graine, url:"http://localhost/"});
const bootContenu = (contenu,graine) => H.boot({contenu, graine, url:"http://localhost/"});
const sauvegarde = w => w.localStorage.getItem("iavocat_partie");
const CLE = "iavocat_partie";

console.log("\n=== Les surfaces survivent au rechargement ===");
{
  const w1 = boot();
  for (const pid of Object.keys(w1.JEU.pieces)) w1.ouvrirPiece(pid);
  const L = w1.JEU.liens.find(x => !x.vice && !x.faux);
  const i = H.composerLien(w1, L);
  w1.envoyer(i);
  H.phrasesBruit(w1, 2);
  const avant = {
    brouillon: w1.S.brouillon.length,
    plaidoirie: w1.S.plaidoirie.length, examinees: [...w1.S.examinees],
    fil: w1.S.fil.length, remises: w1.S.remisesEnvoyees
  };
  check("la partie est écrite dans localStorage", !!sauvegarde(w1));

  const w2 = boot({[CLE]: sauvegarde(w1)});
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
  const w1 = boot();
  H.livrerTout(w1);
  const pid = H.pidPremiereRemise(w1);
  w1.ouvrirPiece(pid);
  const k = H.empansDe(w1, pid)[0];
  H.cliquer(w1, k);
  check("un bloc est posé", w1.S.compo.length === 1);
  const etat = w1.R.etatCompo(w1.S);

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("la phrase en cours est reprise", w2.S.compo.length === 1);
  check("et l'automate repart du bon état", w2.R.etatCompo(w2.S) === etat);
  check("les blocs offerts sont les mêmes",
    w2.R.blocsOfferts(w2.S).map(b=>b.id).join() === w1.R.blocsOfferts(w1.S).map(b=>b.id).join());
}
{
  const w1 = boot();
  H.livrerTout(w1);                           // l'article doit avoir été reçu (§4.5)
  const C = H.lienConclusion(w1);
  check("la comparaison du vice se pose", H.poserComparaison(w1, C.termes[0]));
  // L'article se cherche, se lit, et son texte se clique (§4.5, passe J).
  check("et l'article qui la qualifie se trouve, puis se prend", H.prendreLeTexte(w1, C.forme));
  check("la conclusion est assemblée, et prête à partir", w1.R.peutEnvoyer(w1.S));
  check("elle a levé vice_trouve sans rien transmettre",
    w1.S.vice_trouve && !w1.S.vice_expose && w1.S.plaidoirie.length === 0);

  const w2 = boot({[CLE]: sauvegarde(w1)});
  check("la phrase assemblée survit au rechargement",
    w2.S.compo.length === w1.S.compo.length && w2.R.peutEnvoyer(w2.S));
  check("elle s'affiche toujours sur place, avec son geste",
    H.composeur(w2).includes("Envoyer"));
  check("vice_trouve a survécu, vice_expose non", w2.S.vice_trouve && !w2.S.vice_expose);
  check("l'article trouvé est toujours au dossier (passe J)",
    w1.S.trouves.length === 1 && w2.S.trouves.join() === w1.S.trouves.join()
    && w2.R.piecesLivrees(w2.S).includes(w1.S.trouves[0]));
  w2.viderCompo();
  check("la vider ne retire pas ce qu'on avait compris",
    w2.S.compo.length === 0 && w2.S.vice_trouve);
}

console.log("\n=== Les drapeaux et les déclencheurs ===");
{
  const w1 = boot();
  H.instruire(w1);
  /* ASSEMBLÉE, pas versée : l'état de la Fin 2 (§4.7), et le seul que le joueur
     atteigne — le journal, lui, ne se remplit qu'à l'envoi (§16). */
  H.assembler(w1, H.lienConclusion(w1));
  const pidD = H.pidAvecDeclenche(w1);
  w1.ouvrirPiece(pidD); w1.fermerPiece();   // la réplique part à la fermeture (§4.10)
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
  check("la partie repart proprement de la session 1", w2.S.brouillon.length === 0 && w2.S.compo.length === 0);
  check("et la sauvegarde réécrite porte la nouvelle signature",
    JSON.parse(w2.localStorage.getItem(CLE)).sig !== JSON.parse(sauv).sig);
}
{
  const w = boot({[CLE]: "{ceci n'est pas du JSON"});
  check("une sauvegarde illisible ne fait pas planter le jeu", w.S.remisesEnvoyees === 1);
}

console.log("\n=== Une sauvegarde d'avant la passe K se reprend ===");
{
  /* PIÈGE : `S.retenus` — né `S.memoire` — est parti à la passe K (§17). Le
     contenu n'ayant pas changé, la signature ne jette PAS ces parties : la
     reprise laisse tomber le champ, et rend au dossier les articles qu'une
     partie d'avant la passe J y tenait. */
  const w1 = boot();
  const pid = H.pidPremiereRemise(w1);
  const passages = H.empansDe(w1, pid).slice(0, 2);
  const art = w1.MoteurGrammaire.articlesDe(w1.JEU)[0];
  const ancienne = JSON.parse(sauvegarde(w1));
  check("une sauvegarde d'aujourd'hui ne porte pas `retenus`", ancienne.retenus === undefined);
  for (const [champ, garde] of [["retenus","retenus"], ["memoire","memoire, son nom d'avant"]]) {
    const vieille = {...ancienne, [champ]: [...passages, art.id]}; delete vieille.trouves;
    const w2 = boot({[CLE]: JSON.stringify(vieille)});
    check(`une partie qui porte « ${garde} » se reprend, sans le champ`,
      w2.S.remisesEnvoyees === w1.S.remisesEnvoyees && w2.S.retenus === undefined && w2.S.memoire === undefined);
    check(`et son article d'avant la passe J est au dossier (« ${champ} »)`,
      w2.S.trouves.includes(art.pid) && w2.R.piecesLivrees(w2.S).includes(art.pid));
    check(`et la sauvegarde réécrite ne le porte plus (« ${champ} »)`,
      JSON.parse(sauvegarde(w2))[champ] === undefined);
  }
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

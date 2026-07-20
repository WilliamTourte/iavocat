// Parcours & ergonomie — ce que les autres suites ne couvrent pas :
// la sélection de paire, la modale de pièce, les répliques de l'avocat
// (faux, rep de lien, escalade partagée, deja) et le grain fin de la
// répétition de plaidoirie. Contenu embarqué, sauf mention.
const H = require("./harnais").creerHarnais(__dirname);
const { check, bilan, embarque, noterPaire, canal, carnet, niveau1, verrouiller,
        lienVice, lienFaux, liensNeutres, noterLien, pairesBruit,
        pidAvecDeclenche, champsDe, numeroFin } = H;
const boot = () => H.boot({});
const modale = w => w.document.getElementById("modalRoot").textContent;
const D=H.D, A=H.A;

console.log("— la sélection de paire —");
{
  const w=boot(); niveau1(w);
  // trois champs quelconques, dérivés du contenu
  const P=pairesBruit(w,2);
  const X=P[0].a, Y=P[0].b, Z=P[1].b[1]===Y[1]?P[1].a:P[1].b;
  w.choisirChamp(X[0],X[1]);
  check("premier clic → slot A", w.S.slotA && w.S.slotA.champ===X[1] && !w.S.slotB);
  w.choisirChamp(X[0],X[1]);
  check("re-clic sur le même champ → désélection", !w.S.slotA);
  w.choisirChamp(X[0],X[1]); w.choisirChamp(Y[0],Y[1]);
  w.choisirChamp(Z[0],Z[1]);
  check("troisième champ : B est remplacé (jamais trois)",
    w.S.slotB.champ===Z[1] && w.S.slotA.champ===X[1]);
  w.noter(A);
  check("noter consomme la paire (slots vidés)", !w.S.slotA && !w.S.slotB && w.S.notes.length===1);
}

console.log("— la modale de pièce et l'index —");
{
  const w=boot(); niveau1(w);
  const pid=pidAvecDeclenche(w) || Object.keys(w.JEU.pieces)[0];
  const P=w.JEU.pieces[pid];
  w.ouvrirPiece(pid);
  check("la modale montre la pièce (titre + texte)",
    w.S.modalPiece===pid && modale(w).includes(P.titre) && modale(w).includes(P.texte.slice(0,30)));
  w.closeModal();
  check("fermer vide la modale", w.S.modalPiece===null && modale(w)==="");
  check("la pièce examinée est marquée dans le canal (📎 vu)",
    w.document.querySelector('#canal .attach.seen')!==null);
}

console.log("— les répliques de l'avocat —");
{
  const w=boot(); niveau1(w);
  noterLien(w,lienFaux(w));                     // le faux vice
  w.remonter(0);
  check("faux vice remonté → rep_faux, et le drapeau du plaidé",
    canal(w).includes(w.JEU.avocat.rep_faux.slice(0,40)) && w.S.notes[0].remonte);
  check("le faux vice ne lève RIEN côté vice", !w.S.vice_pressenti && !w.S.vice_trouve);
}
{
  const w=boot(); niveau1(w);
  // escalade PARTAGÉE : une cohérente-inutile puis une sans-rapport → crans 0 puis 1
  const coherent=liensNeutres(w,{sansRapport:false}).find(L=>!L.rep);
  noterLien(w,coherent);
  w.remonter(0);
  check("1re remontée inutile → premier cran",
    canal(w).includes(w.JEU.avocat.rep_inutile[0].slice(0,40)));
  const sansRapport=pairesBruit(w,20).find(P=>{
    const dim=(pid,ch)=>((w.JEU.pieces[pid].dims||{})[ch]) ?? w.JEU.dims[ch];
    return dim(...P.a)!==dim(...P.b);
  });
  noterPaire(w,sansRapport.a[0],sansRapport.a[1],A,sansRapport.b[0],sansRapport.b[1]);
  w.remonter(1);
  check("2e remontée (sans rapport) → cran 2 : le compteur est commun",
    canal(w).includes(w.JEU.avocat.rep_sans_rapport[1].slice(0,40)) && w.S.inutiles===2);
}
{
  const c=embarque();
  const i=c.liens.findIndex(L=>!L.vice&&!L.faux&&L.tient);
  c.liens[i].rep="Réplique cousue main pour ce lien précis.";
  const w=H.boot({contenu:c}); niveau1(w);
  noterLien(w,c.liens[i]);
  w.remonter(0);
  check("un lien peut porter sa propre réplique (lien.rep prime)",
    canal(w).includes("cousue main") && w.S.inutiles===0);
}

console.log("— le grain de la répétition —");
{
  const w=boot(); niveau1(w);
  noterLien(w,liensNeutres(w)[0]);
  w.remonter(0);                       // remontée PENDANT l'instruction
  w.cloturer();
  check("la répétition démarre : intro + affirmation 1",
    w.S.repetitionIdx===0 && canal(w).includes(w.JEU.repetition.affirmations[0].texte));
  check("une note déjà remontée reste opposable (présentoir)",
    canal(w).includes("remonter"));
  w.presenterNote(0);
  check("l'opposer à nouveau → « deja », sans double effet",
    canal(w).includes("Je l'ai déjà noté") && w.S.notes[0].presentee);
  w.presenterNote(0);
  const nbDeja=(canal(w).match(/Je l'ai déjà noté/g)||[]).length;
  check("une note présentée ne se représente pas", nbDeja===1);
  w.avancerRepetition();
  check("continuer → affirmation suivante",
    canal(w).includes(w.JEU.repetition.affirmations[1].texte));
  while(w.S.repetitionIdx<w.JEU.repetition.affirmations.length) w.avancerRepetition();
  check("après la dernière : le mot de fin de Maître Auber", canal(w).includes(w.JEU.repetition.fin));
  check("le bouton passe à « Confirmer la clôture »",
    w.document.getElementById("btnCloture").textContent.includes("Confirmer"));
}
{
  const w=boot(); niveau1(w);
  w.cloturer();
  w.presenterNote(0);
  check("présenter sans note valide : rien ne casse", w.S.repetitionIdx===0);
  const idx=w.S.repetitionIdx;
  w.cloturer();
  check("confirmer pendant la répétition : refusé (on répond d'abord)",
    w.S.repetitionIdx===idx && !w.document.querySelector(".fin"));
}

console.log("— la variante des fins quand le faux a été plaidé —");
{
  const w=boot(); niveau1(w);
  noterLien(w,lienFaux(w));
  w.remonter(0);                       // le faux est plaidé
  w.cloturer();
  while(w.S.repetitionIdx<w.JEU.repetition.affirmations.length) w.avancerRepetition();
  w.cloturer();
  const fin=w.document.querySelector(".fin").textContent;
  check("Fin 3 + variante_faux (le faux a été plaidé, balayé)",
    numeroFin(fin)==="3" && fin.includes(w.JEU.fins[3].variante_faux));
}
{
  const w=boot(); niveau1(w);
  noterLien(w,lienVice(w));
  w.remonter(0);                       // Fin 1, sans faux plaidé
  w.cloturer();
  while(w.S.repetitionIdx<w.JEU.repetition.affirmations.length) w.avancerRepetition();
  w.cloturer();
  const fin=w.document.querySelector(".fin").textContent;
  check("sans faux plaidé, pas de variante", numeroFin(fin)==="1" && !fin.includes(w.JEU.fins[1].variante_faux));
}

bilan();

// Fumée de l'atelier v3 — jsdom. Rien du contenu n'est nommé : les cibles
// (pièce décisive, case du vice, champs, dimensions) sont dérivées de la
// forme du CONTENU, pour survivre à un changement complet d'affaire.
const H = require("./harnais").creerHarnais(__dirname);
const { check, bilan, surContenu:SC } = H;
const bootAtelier = opts => H.bootAtelier(opts);
const bootJeu = contenu => H.boot({contenu});
const clone=o=>JSON.parse(JSON.stringify(o));
// Verrouille une case du jeu avec sa bonne réponse (sans la nommer).
const jouer=(j,ck)=>j.designer(ck,j.JEU.cases[ck].bonne);
function jouerNiveau1(j){ H.niveau1(j); }

console.log("— le SEED et le diagnostic —");
const w=bootAtelier();
{
  const issues=w.valider();
  check("SEED : aucune erreur au diagnostic", issues.filter(i=>i.niveau==="erreur").length===0);
  check("SEED : le double canal du vice est toujours signalé (avert)",
    issues.some(i=>i.msg.includes("canaux indépendants")));
  check("SEED : la case du vice est privée + conditionnelle (pas d'avert dédié)",
    !issues.some(i=>i.msg.includes("n'est pas privée")));
}

console.log("— le diagnostic attrape le câblage cassé —");
{
  const c=clone(w.CONTENU);
  const ck=SC.ckObligatoire(c);
  c.cases[ck].remise=2;      // plus aucune case obligatoire à la remise 1
  w.adopter(c);
  check("remise sans case obligatoire → erreur « ne partira jamais »",
    w.valider().some(i=>i.niveau==="erreur"&&i.msg.includes("sans case obligatoire")));
}
{
  const c=clone(w.CONTENU);
  c.cases[SC.ckObligatoire(c)].remise=1;
  c.cases.case_fantome={label:"Fantôme",remise:1,apparait_si:"drapeau_inconnu",options:["a"],bonne:"a"};
  w.adopter(c);
  check("apparait_si sans mécanisme qui le lève → erreur",
    w.valider().some(i=>i.niveau==="erreur"&&i.msg.includes("jamais levée")));
}
{
  const c=clone(w.CONTENU); delete c.cases.case_fantome;
  const ckVice=SC.ckLeve(c,"vice_trouve");
  delete c.cases[ckVice].prive;
  w.adopter(c);
  check("case du vice non privée → avertissement",
    w.valider().some(i=>i.msg.includes("n'est pas privée")));
  const c2=clone(w.CONTENU); c2.cases[ckVice].prive=true; delete c2.directives;
  w.adopter(c2);
  check("directives absentes → avertissement",
    w.valider().some(i=>i.msg.includes("Directives absentes")));
}

console.log("— migration des anciens contenus —");
{
  const vieux=clone(w.CONTENU);
  vieux.directives=["D1","D2"];
  const pidDecl=SC.pidDeclenche(vieux), ckApres=SC.ckAvecApres(vieux);
  delete vieux.pieces[pidDecl].declenche;
  delete vieux.cases[ckApres].apres;
  vieux.avocat.tentation_adn="Ancienne réplique à l'examen.";
  vieux.avocat.ack_decisive="Ancien accusé de réception.";
  check("import accepté", w.adopter(vieux)===null);
  check("l'ancienne réplique d'examen migre sur la pièce décisive (declenche)",
    !!SC.pidDeclenche(w.CONTENU)
    && w.CONTENU.pieces[SC.pidDeclenche(w.CONTENU)].declenche.replique==="Ancienne réplique à l'examen."
    && !w.CONTENU.avocat.tentation_adn);
  check("l'ancien accusé de réception migre sur la case (apres.replique)",
    w.CONTENU.cases[ckApres].apres.replique==="Ancien accusé de réception."
    && !w.CONTENU.avocat.ack_decisive);
  check("un contenu sans version reçoit schema:2", w.CONTENU.schema===2);
}

console.log("— l'éditeur de cases —");
{
  w.demanderExemple(); w.demanderExemple();   // deux clics : recharge le SEED
  const avant=Object.keys(w.CONTENU.cases).length;
  w.ajouterCase(1);
  check("+ Case crée une case à la remise voulue",
    Object.keys(w.CONTENU.cases).length===avant+1 && w.CONTENU.cases.nouvelle_case.remise===1);
  w.majCase("nouvelle_case","label","Une case de test");
  w.majCaseOptions("nouvelle_case","choix A\nchoix B\nchoix C");
  w.majCase("nouvelle_case","bonne","choix B");
  w.majCaseApres("nouvelle_case","Réaction de l'avocat au verrou.");
  const N=w.CONTENU.cases.nouvelle_case;
  check("label / options / bonne / apres éditables",
    N.label==="Une case de test" && N.options.length===3 && N.bonne==="choix B"
    && N.apres.replique.includes("Réaction"));
  w.majCaseOptions("nouvelle_case","seul choix");
  check("bonne réponse rabattue si elle sort des options", w.CONTENU.cases.nouvelle_case.bonne==="seul choix");
  w.demanderSupprCase("nouvelle_case"); w.demanderSupprCase("nouvelle_case");
  check("suppression en deux clics", !w.CONTENU.cases.nouvelle_case);
  w.majDirectives("D1 — première directive\nD2 — deuxième directive\nD3 — troisième");
  check("directives éditables depuis la frise", w.CONTENU.directives.length===3);
  w.undo();   // rend les directives d'origine
}

console.log("— la simulation rejoue les trois fins —");
const iVice = () => SC.iLienVice(w.CONTENU);
const ckVice = () => SC.ckLeve(w.CONTENU,"vice_trouve");
const obligs = () => Object.keys(w.CONTENU.cases).filter(k=>!w.CONTENU.cases[k].apparait_si);
function simNiveau1(){
  let reste=true;
  while(reste){ reste=false;
    for(const ck of obligs()){
      if(w.SIM.locks[ck]) continue;
      if((w.CONTENU.cases[ck].remise||1)>w.SIM.remises) continue;
      w.simDesigner(ck,true); reste=true;
    }
  }
}
function simFin(){
  w.simCloturer(); while(w.SIM.phase==="repetition") w.simAvancer(); w.simConfirmer();
  return w.SIM.finie;
}
{
  w.simReset();
  w.simDesigner(obligs()[0],true);
  check("sim : la remise suivante part sur les cases obligatoires", w.SIM.remises===2);
  const labelVice=w.CONTENU.cases[ckVice()].label;
  check("sim : la case du vice est invisible avant le pressentiment",
    !w.simActions().some(a=>a.t.includes(labelVice)));
  simNiveau1();
  check("sim : la clôture s'offre sans la case conditionnelle",
    w.simActions().some(a=>a.t.includes("Clôturer")));
  w.simNoter(iVice());
  check("sim : noter le vice → pressenti, pas trouvé", w.SIM.vicePressenti && !w.SIM.viceTrouve);
  check("sim : la case conditionnelle apparaît", w.simActions().some(a=>a.t.includes(labelVice)));
  w.simDesigner(ckVice(),true);
  check("sim : qualifier lève vice_trouvé", w.SIM.viceTrouve===true);
  check("sim : Fin 2 (compris, tu)", simFin()==="2");
}
{
  w.simReset(); simNiveau1();
  w.simNoter(iVice()); w.simRemonter(0);
  check("sim : remonter = compris + exposé", w.SIM.viceTrouve && w.SIM.viceExpose);
  check("sim : Fin 1", simFin()==="1");
}
{
  w.simReset(); simNiveau1();
  check("sim : Fin 3", simFin()==="3");
}

console.log("— le renommage d'identifiants —");
{
  w.demanderExemple(); w.demanderExemple();
  const pid=SC.pidDeclenche(w.CONTENU);
  const posAvant=JSON.stringify((w.CONTENU._pos||{})[pid]);
  const err=w.renommerPieceId(pid,"piece_renommee");
  check("renommer une pièce : accepté",
    err===null && !!w.CONTENU.pieces.piece_renommee && !w.CONTENU.pieces[pid]);
  check("le declenche suit (il vit sur la pièce)", !!w.CONTENU.pieces.piece_renommee.declenche);
  check("les liens sont réécrits",
    w.CONTENU.liens.every(L=>L.a[0]!==pid&&L.b[0]!==pid)
    && w.CONTENU.liens.some(L=>L.a[0]==="piece_renommee"||L.b[0]==="piece_renommee"));
  check("les remises sont réécrites",
    w.CONTENU.remises.every(r=>!(r.pieces||[]).includes(pid))
    && w.CONTENU.remises.some(r=>(r.pieces||[]).includes("piece_renommee")));
  check("la position du graphe suit",
    JSON.stringify((w.CONTENU._pos||{}).piece_renommee)===posAvant && !(w.CONTENU._pos||{})[pid]);
  check("diagnostic toujours sans erreur", w.valider().filter(i=>i.niveau==="erreur").length===0);
  const j=bootJeu(w.nettoyerPourJeu(w.CONTENU));
  jouerNiveau1(j); j.ouvrirPiece("piece_renommee"); j.closeModal();
  check("…et le moteur joue la pièce renommée (declenche compris)", j.S.declenches.has("piece_renommee"));
  const autre=SC.pidAutreQue(w.CONTENU,"piece_renommee");
  check("renommages refusés : vide, caractères, collision",
    w.renommerPieceId("piece_renommee","")!==null
    && w.renommerPieceId("piece_renommee","p exp!")!==null
    && w.renommerPieceId("piece_renommee",autre)!==null
    && !!w.CONTENU.pieces.piece_renommee);
  w.undo();
  check("undo restaure l'ancien id partout",
    !!w.CONTENU.pieces[pid] && w.CONTENU.remises.some(r=>(r.pieces||[]).includes(pid)));
  const ck=SC.ckObligatoire(w.CONTENU);
  check("renommer une case : accepté",
    w.renommerCaseId(ck,"case_renommee")===null && !!w.CONTENU.cases.case_renommee && !w.CONTENU.cases[ck]);
  w.simReset(); w.simDesigner("case_renommee",true);
  check("la sim avance avec la case renommée", w.SIM.remises===2);
  w.undo();
}

console.log("— autosave : l'atelier survit au rechargement —");
{
  w.demanderExemple(); w.demanderExemple();
  w.majDirectives("D_test — une directive témoin");
  const g={ "iavocat_atelier_v2": w.localStorage.getItem("iavocat_atelier_v2") };
  const w2=bootAtelier({graine:g});
  check("la sauvegarde auto est rechargée au démarrage",
    (w2.CONTENU.directives||[]).includes("D_test — une directive témoin"));
  w.demanderExemple(); w.demanderExemple();
}

console.log("— dims par pièce (surcharge locale) —");
{
  const [X,Y]=SC.deuxChampsDiff(w.CONTENU);      // deux champs de dimensions différentes
  const dimX=SC.dim(w.CONTENU,...X);
  w.majDimLocale(Y[0],Y[1],"dimension_test");
  check("la surcharge s'écrit sur la pièce", w.CONTENU.pieces[Y[0]].dims[Y[1]]==="dimension_test");
  check("dimDe la lit en priorité",
    w.dimDe(Y[0],Y[1])==="dimension_test" && w.CONTENU.dims[Y[1]]!=="dimension_test");
  const L={a:X,b:Y,rel:"est en accord avec"};
  check("dimsMatch suit la surcharge (miroir du moteur)", w.dimsMatch(L)===false);
  w.majDimLocale(Y[0],Y[1],dimX);
  check("surcharge alignée : dimsMatch redevient vrai", w.dimsMatch(L)===true);
  check("le diagnostic signale la surcharge (info)",
    w.valider().some(i=>i.msg.includes("Surcharge locale")));
  w.majDimLocale(Y[0],Y[1],"");
  check("surcharge vidée : repli global, clé dims retirée",
    w.dimDe(Y[0],Y[1])===w.CONTENU.dims[Y[1]] && !w.CONTENU.pieces[Y[0]].dims);
}

console.log("— le « qui » des répliques —");
{
  const pid=SC.pidDeclenche(w.CONTENU), ck=SC.ckAvecApres(w.CONTENU);
  w.majDeclencheQui(pid,"Le greffier");
  check("le qui d'un declenche s'édite", w.CONTENU.pieces[pid].declenche.qui==="Le greffier");
  w.majCaseApresQui(ck,"Le greffier");
  check("le qui d'un apres s'édite", w.CONTENU.cases[ck].apres.qui==="Le greffier");
  const j=bootJeu(w.nettoyerPourJeu(w.CONTENU));
  jouerNiveau1(j); j.ouvrirPiece(pid); j.closeModal();
  check("…et le moteur fait parler le bon personnage",
    j.document.getElementById("canal").textContent.includes("Le greffier"));
  w.majDeclencheQui(pid,""); w.majCaseApresQui(ck,"");
  check("qui vidé : retour au défaut (clé retirée)",
    !w.CONTENU.pieces[pid].declenche.qui && !w.CONTENU.cases[ck].apres.qui);
}

console.log("— les drapeaux arbitraires en sim —");
{
  const sauve=clone(w.CONTENU);
  w.CONTENU.cases.case_jalon={label:"Jalon",remise:1,options:["oui"],bonne:"oui",leve:"drapeau_special"};
  w.simReset(); w.simDesigner("case_jalon",true);
  check("une case leve arbitraire lève son drapeau en sim", w.SIM.flags.drapeau_special===true);
  check("…et sa pastille s'affiche",
    w.document.getElementById("simflags").textContent.includes("drapeau_special"));
  w.adopter(sauve);
}

console.log("— l'export nourrit le moteur —");
{
  const exporte=w.nettoyerPourJeu(w.CONTENU);
  check("les clés privées (_pos, _bruit) sont retirées de l'export",
    !("_pos" in exporte) && !("_bruit" in exporte));
  check("l'export est estampillé schema:2", exporte.schema===2);
  const j=bootJeu(exporte);
  check("le jeu adopte le contenu exporté par l'atelier", j.SOURCE_CONTENU.includes("content.js"));
  jouerNiveau1(j);
  check("…et il se joue (remises, cases, clôture ouverte)",
    j.S.remisesEnvoyees>=2 && !j.document.getElementById("btnCloture").disabled);
}

bilan();

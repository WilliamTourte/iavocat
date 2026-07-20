// Sauvegarde de partie — la partie survit au rafraîchissement, signée par
// le contenu. Deux fenêtres jsdom simulent le rechargement en se passant
// le localStorage via beforeParse.
const H = require("./harnais").creerHarnais(__dirname);
const { check, bilan, canal, carnet, niveau1, verrouiller, casesObligatoires,
        lienVice, noterLien, caseParLeve, pidAvecDeclenche } = H;
const boot = graine => H.boot({graine, url:"http://localhost/"});
const bootContenu = (contenu,graine) => H.boot({contenu, graine, url:"http://localhost/"});
const CLE="iavocat_partie";

console.log("— la partie se sauvegarde et se restaure —");
let graine;
{
  const w=boot();
  verrouiller(w,casesObligatoires(w)[0][0]);         // → remise suivante
  const pidDecl=pidAvecDeclenche(w);
  niveau1(w);
  w.ouvrirPiece(pidDecl); w.closeModal();            // declenche une_fois joué
  noterLien(w,lienVice(w));                          // pressenti
  const brut=w.localStorage.getItem(CLE);
  check("une sauvegarde existe après quelques gestes", !!brut);
  graine={ [CLE]: brut };
}
{
  const w=boot(graine);                              // « rechargement »
  check("remises et verrous restaurés",
    w.S.remisesEnvoyees>=2 && casesObligatoires(w).every(([k])=>w.S.locks[k]));
  check("notes et drapeaux restaurés", w.S.notes.length===1 && w.S.vice_pressenti===true && w.S.vice_trouve===false);
  const pidDecl=pidAvecDeclenche(w);
  check("les Set redeviennent des Set (pas des tableaux)",
    typeof w.S.examinees.has==="function" && typeof w.S.declenches.has==="function"
    && !Array.isArray(w.S.examinees));
  check("pièces examinées restaurées (✓ dans l'index)",
    w.S.examinees.has(pidDecl) && carnet(w).includes("✓ "+w.JEU.pieces[pidDecl].court));
  check("le canal est re-rendu", w.S.fil.length>=2 && canal(w).length>0);
  check("la case privée conditionnelle réapparaît",
    carnet(w).includes(caseParLeve(w,"vice_trouve")[1].label));
  const avant=w.S.fil.length;
  w.ouvrirPiece(pidDecl); w.closeModal();
  check("le declenche une_fois ne rejoue pas après restauration", w.S.fil.length===avant);
  check("aucune modale rouverte au réveil", w.document.querySelector(".overlay")===null);
}

console.log("— la répétition en cours se restaure —");
{
  const w=boot();
  niveau1(w);
  w.cloturer();                                      // répétition lancée
  const g={ [CLE]: w.localStorage.getItem(CLE) };
  const w2=boot(g);
  check("clôture demandée + affirmation en cours", w2.S.clotureDemandee && w2.S.repetitionIdx===0);
  check("le présentoir est re-rendu", canal(w2).includes("Opposer une note"));
}

console.log("— la signature protège contre un contenu qui a changé —");
{
  const w=boot();
  const ck=casesObligatoires(w)[0][0];
  verrouiller(w,ck);
  const brut=w.localStorage.getItem(CLE);
  // le même contenu, mais muté : la sauvegarde doit être jetée
  const mut=JSON.parse(JSON.stringify(w.JEU));
  mut.pieces.piece_ajoutee={titre:"Pièce ajoutée",court:"NOUV",type:"pièce",champs:{},texte:""};
  const w2=bootContenu(mut,{ [CLE]: brut });
  check("sauvegarde d'un autre contenu : partie neuve",
    w2.S.remisesEnvoyees===1 && w2.S.locks[ck]===false);
  check("…et le stockage contient désormais la partie neuve, pas la périmée",
    JSON.parse(w2.localStorage.getItem(CLE)).remisesEnvoyees===1);
}

console.log("— fin de partie et recommencer —");
{
  const w=boot();
  niveau1(w);
  H.terminer(w);                                     // Fin 3
  check("la fin efface la sauvegarde (un reload repart à zéro)", w.localStorage.getItem(CLE)===null);
}
{
  const w=boot();
  verrouiller(w,casesObligatoires(w)[0][0]);
  check("recommencer demande confirmation (1er clic : rien d'effacé)",
    (w.recommencer(), w.localStorage.getItem(CLE)!==null
      && w.document.getElementById("btnRecommencer").textContent.includes("effacer")));
  w.effacerPartie();
  check("effacerPartie vide bien le stockage", w.localStorage.getItem(CLE)===null);
}

bilan();

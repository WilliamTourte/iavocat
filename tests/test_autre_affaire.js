// Preuve du découplage : une affaire ENTIÈREMENT différente, volontairement
// abstraite (aucun nom, aucune valeur en commun avec le contenu livré), et
// de forme différente aussi — 3 remises, 3 cases obligatoires, un vice qui
// relie un document de la remise 1 à une règle transmise à la remise 3.
// Si cette suite passe, le moteur et le harnais sont indépendants du cas.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, canal, carnet, niveau1, verrouiller, lienVice,
        caseParLeve, noterLien, numeroFin, terminer } = H;

const AFFAIRE = {
  schema:2,
  relations:["concorde avec","contredit"],
  pieces:{
    doc_alpha:{ titre:"Document Alpha", court:"ALPHA", type:"pièce",
      resume:"Premier document du dossier.",
      champs:{ marqueur:"AX-77", quantite:"12" },
      texte:"Contenu du document Alpha, remis en première session." },
    doc_beta:{ titre:"Document Bêta", court:"BÊTA", type:"pièce",
      resume:"Deuxième document.",
      champs:{ mention:"conforme", quantite:"12" },
      texte:"Contenu du document Bêta.",
      declenche:{ une_fois:true, qui:"La conseillère",
        replique:"Ce document ne me dit rien qui vaille. Regarde-le de près." } },
    regle_tardive:{ titre:"Règle tardive", court:"RÈGLE", type:"règle du dossier",
      resume:"Transmise en dernier.",
      champs:{ exige:"AX-99" },
      texte:"Le marqueur porté au dossier doit être AX-99." }
  },
  // dimension globale : ce qui peut se comparer à quoi
  dims:{ marqueur:"référence", exige:"référence", quantite:"nombre", mention:"appréciation" },
  liens:[
    { a:["doc_alpha","quantite"], rel:"concorde avec", b:["doc_beta","quantite"], tient:true },
    // LE vice : un document de la remise 1 contre une règle de la remise 3
    { a:["doc_alpha","marqueur"], rel:"contredit", b:["regle_tardive","exige"], tient:true, vice:true },
    { a:["doc_beta","mention"], rel:"concorde avec", b:["doc_beta","mention"], tient:false, faux:true }
  ],
  remises:[
    { qui:"La conseillère", texte:"Première session — voici Alpha.", pieces:["doc_alpha"] },
    { qui:"La conseillère", texte:"Deuxième session — Bêta arrive.", pieces:["doc_beta"] },
    { qui:"La conseillère", texte:"Dernière session — la règle, pour la forme.", pieces:["regle_tardive"] }
  ],
  cases:{
    case_un:{ label:"Première question", remise:1, options:["oui","non"], bonne:"oui" },
    case_deux:{ label:"Deuxième question", remise:2, options:["A","B"], bonne:"B",
      apres:{ qui:"La conseillère", replique:"Noté. On avance." } },
    case_trois:{ label:"Troisième question", remise:3, options:["X","Y"], bonne:"Y" },
    case_privee:{ label:"Nommer ce que tu pressens", remise:1,
      apparait_si:"vice_pressenti", prive:true, leve:"vice_trouve",
      options:["une coïncidence","une irrégularité de forme"], bonne:"une irrégularité de forme" }
  },
  repetition:{
    intro:"Répétons.",
    affirmations:[{texte:"Première affirmation.",court:"aff. 1"},{texte:"Seconde affirmation.",court:"aff. 2"}],
    fin:"C'est tout pour aujourd'hui."
  },
  avocat:{
    rep_vice:"Ça, c'est sérieux. Je m'en occupe.",
    rep_faux:"Je note, mais ça ne pèsera pas lourd.",
    rep_inutile:["Et alors ?","Tu m'ensevelis.","…"],
    rep_sans_rapport:["Aucun rapport.","Toujours aucun rapport.","…"],
    deja:"Déjà noté."
  },
  directives:["Directive 1","Directive 2"],
  fins:{
    1:{ titre:"Fin 1 — remontée", verdict:"Verdict A.", texte:"Texte de la première fin.", variante_faux:"Variante." },
    2:{ titre:"Fin 2 — silence",  verdict:"Verdict B.", texte:"Texte de la deuxième fin.", variante_faux:"Variante." },
    3:{ titre:"Fin 3 — doute",    verdict:"Verdict C.", texte:"Texte de la troisième fin.", variante_faux:"Variante." }
  }
};
const boot = () => H.boot({contenu:AFFAIRE});

console.log("— une affaire de forme différente se joue —");
{
  const w=boot();
  check("le contenu est adopté (aucun repli sur l'embarqué)", w.SOURCE_CONTENU.includes("content.js"));
  check("remise 1 envoyée, sa pièce est à l'index",
    w.S.remisesEnvoyees===1 && carnet(w).includes("ALPHA"));
  check("carnet fermé tant qu'une seule pièce est livrée (rien à relier)",
    !carnet(w).includes("Tes notes"));
  verrouiller(w,"case_un");
  check("deux pièces livrées → le carnet s'ouvre (noter est gratuit, sans budget)",
    carnet(w).includes("Tes notes"));
  niveau1(w);
  check("les 3 remises sont parties (3 cases obligatoires enchaînées)", w.S.remisesEnvoyees===3);
  check("la réplique portée par la case a bien joué (avec son « qui »)",
    canal(w).includes("Noté. On avance.") && canal(w).includes("La conseillère"));
  w.ouvrirPiece("doc_beta"); w.closeModal();
  check("le declenche de la pièce a joué", w.S.declenches.has("doc_beta")
    && canal(w).includes("ne me dit rien qui vaille"));
  let ok=true; try{ w.openManuels(); }catch(e){ ok=false; }
  check("les Manuels trouvent la règle par son type",
    ok && w.document.getElementById("modalRoot").textContent.includes("AX-99"));
}

console.log("— le vice entre une pièce précoce et une règle tardive —");
{
  const w=boot();
  const qualif=caseParLeve(w,"vice_trouve");
  niveau1(w);                                  // il faut les 3 remises pour que la règle existe
  check("la case privée est invisible tant que rien n'est pressenti",
    !carnet(w).includes(qualif[1].label));
  noterLien(w,lienVice(w));                    // Alpha (remise 1) ⟷ Règle (remise 3)
  check("le lien tardif est notable et lève le pressentiment", w.S.vice_pressenti===true && w.S.vice_trouve===false);
  check("la case privée apparaît, dans sa zone", carnet(w).includes(qualif[1].label));
  verrouiller(w,qualif[0]);
  check("qualifier lève vice_trouve", w.S.vice_trouve===true);
}

console.log("— les trois fins, sur cette affaire —");
{
  const w=boot(); niveau1(w);
  noterLien(w,lienVice(w)); w.remonter(0);
  check("Fin 1", numeroFin(terminer(w))==="1");
}
{
  const w=boot(); niveau1(w);
  noterLien(w,lienVice(w));
  verrouiller(w,caseParLeve(w,"vice_trouve")[0]);
  check("Fin 2", numeroFin(terminer(w))==="2");
}
{
  const w=boot(); niveau1(w);
  check("Fin 3", numeroFin(terminer(w))==="3");
}
{
  const w=boot(); niveau1(w);
  noterLien(w,lienVice(w));
  check("Fin 3 — pressenti sans être qualifié ni remonté", numeroFin(terminer(w))==="3");
}

bilan();

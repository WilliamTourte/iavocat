// Décâblage moteur ↔ contenu — le moteur ne connaît aucun identifiant :
// remises généralisées, piece.declenche, case.apres/leve/prive/apparait_si,
// deux marches du vice, Manuels par type, dims par pièce.
// Les mutations elles-mêmes sont dérivées du contenu (rien n'est nommé).
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, embarque, canal, carnet, niveau1, verrouiller,
        lienVice, noterLien, caseParLeve, casesObligatoires,
        pidAvecDeclenche, pidRegle, numeroFin } = H;
const boot = contenu => H.boot({contenu});   // null = contenu embarqué
const clone = o => JSON.parse(JSON.stringify(o));

/* Renomme un id de pièce dans un contenu brut (liens + remises) : sert à
   prouver que le moteur ne s'accroche à aucun nom. */
function renommerPiece(c,ancien,neuf){
  c.pieces[neuf]=c.pieces[ancien]; delete c.pieces[ancien];
  for(const r of c.remises) if(Array.isArray(r.pieces)) r.pieces=r.pieces.map(p=>p===ancien?neuf:p);
  for(const L of c.liens){ if(L.a[0]===ancien)L.a[0]=neuf; if(L.b[0]===ancien)L.b[0]=neuf; }
  return c;
}

console.log("— remises généralisées (plus de clé magique) —");
{
  const c=embarque();
  c.remises.push({qui:"Maître Auber",texte:"Remise supplémentaire — rien de neuf.",pieces:[]});
  const w=boot(c);
  const oblig=casesObligatoires(w).map(([k])=>k);
  verrouiller(w,oblig[0]);
  check("remise 2 envoyée quand les cases obligatoires de la 1 sont verrouillées", w.S.remisesEnvoyees===2);
  for(const ck of oblig.slice(1)) verrouiller(w,ck);
  check("la remise suivante part à son tour (l'atelier peut en ajouter)", w.S.remisesEnvoyees===3);
  check("la clôture reste possible", !w.document.getElementById("btnCloture").disabled);
}
{
  const c=embarque();
  const [ck,def]=Object.entries(c.cases).find(([,x])=>!x.apparait_si);
  c.cases["case_renommee"]=def; delete c.cases[ck];      // renommage libre
  const w=boot(c);
  verrouiller(w,"case_renommee");
  check("case renommée : la remise 2 part quand même", w.S.remisesEnvoyees===2);
}

console.log("— piece.declenche (la réplique portée par la pièce) —");
{
  const base=embarque();
  const ancien=Object.keys(base.pieces).find(pid=>base.pieces[pid].declenche);
  const attendu=base.pieces[ancien].declenche.replique;
  const c=renommerPiece(clone(base),ancien,"piece_renommee");
  const w=boot(c);
  niveau1(w);
  w.ouvrirPiece("piece_renommee"); w.closeModal();
  check("le declenche suit la pièce, quel que soit son id",
    w.S.declenches.has("piece_renommee") && canal(w).includes(attendu.slice(0,40)));
  const avant=w.S.fil.length;
  w.ouvrirPiece("piece_renommee"); w.closeModal();
  check("une_fois : la réplique ne rejoue pas", w.S.fil.length===avant);
}

console.log("— case.apres.replique —");
{
  const w=boot(null);
  const trouve=Object.entries(w.JEU.cases).find(([,c])=>c.apres&&c.apres.replique);
  if(trouve){
    niveau1(w);
    check("verrouiller la case déclenche la réplique qu'elle porte",
      canal(w).includes(trouve[1].apres.replique.slice(0,40)));
  } else check("aucune case ne porte d'apres — rien à vérifier", true);
}

console.log("— Manuels sans identifiant —");
{
  const base=embarque();
  const ancien=Object.keys(base.pieces).find(pid=>(base.pieces[pid].type||"").includes("règle"));
  const extrait=base.pieces[ancien].texte.slice(0,30);
  const c=renommerPiece(clone(base),ancien,"regle_renommee");
  const w=boot(c);
  let ok=true,txt=""; try{ w.openManuels(); txt=w.document.getElementById("modalRoot").textContent; }catch(e){ ok=false; }
  check("règle renommée : Manuels s'ouvre (règles trouvées par type)", ok && txt.includes(extrait));
}
{
  const c=embarque(); delete c.directives;
  const w=boot(c);
  let ok=true; try{ w.openManuels(); }catch(e){ ok=false; }
  check("contenu sans directives : Manuels s'ouvre sans planter", ok);
}

console.log("— la case conditionnelle du vice (apparait_si / prive / leve) —");
{
  const w=boot(null);
  const qualif=caseParLeve(w,"vice_trouve");
  niveau1(w);
  check("avant le pressentiment, la case conditionnelle est invisible",
    !carnet(w).includes(qualif[1].label));
  check("…et elle ne bloque pas la clôture (jamais un verrou)",
    !w.document.getElementById("btnCloture").disabled);
  noterLien(w,lienVice(w));
  check("noter le lien ⚑ lève vice_pressenti, pas vice_trouve",
    w.S.vice_pressenti===true && w.S.vice_trouve===false);
  check("la case privée apparaît alors, dans sa zone à part",
    carnet(w).includes("Ce que tu te demandes") && carnet(w).includes(qualif[1].label));
  const avantFil=w.S.fil.length;
  verrouiller(w,qualif[0]);
  check("case privée : le verrou lève son drapeau SANS message dans le canal",
    w.S.vice_trouve===true && w.S.fil.length===avantFil);
}

console.log("— les trois fins sous les deux marches —");
{ // Fin 1 : remonter le vice (transmis = compris, même sans la case)
  const w=boot(null);
  niveau1(w);
  noterLien(w,lienVice(w));
  w.remonter(0);
  check("remonter le vice vaut compréhension", w.S.vice_trouve===true);
  check("Fin 1 — le prix de l'honnêteté", numeroFin(H.terminer(w))==="1");
}
{ // Fin 2 : pressenti + qualifié, puis silence
  const w=boot(null);
  niveau1(w);
  noterLien(w,lienVice(w));
  verrouiller(w,caseParLeve(w,"vice_trouve")[0]);
  check("Fin 2 — comprendre et se taire", numeroFin(H.terminer(w))==="2");
}
{ // Fin 3a : rien vu
  const w=boot(null);
  niveau1(w);
  check("Fin 3 — clôture sans rien avoir vu", numeroFin(H.terminer(w))==="3");
}
{ // Fin 3b : pressenti mais jamais conclu
  const w=boot(null);
  niveau1(w);
  noterLien(w,lienVice(w));
  check("Fin 3 — pressentir sans conclure ne suffit pas", numeroFin(H.terminer(w))==="3");
}

console.log("— dims par pièce (repli global) —");
{
  const c=embarque();
  // deux champs de dimensions DIFFÉRENTES dans le contenu de base…
  const dim=(cc,pid,ch)=>((cc.pieces[pid]||{}).dims||{})[ch] ?? (cc.dims||{})[ch];
  const champs=[];
  for(const [pid,p] of Object.entries(c.pieces)) for(const ch of Object.keys(p.champs||{})) champs.push([pid,ch]);
  let X,Y;
  for(let i=0;i<champs.length&&!X;i++) for(let k=i+1;k<champs.length&&!X;k++)
    if(dim(c,...champs[i])!==dim(c,...champs[k])){ X=champs[i]; Y=champs[k]; }
  // …qu'on rend identiques par une surcharge écrite SUR la pièce
  c.pieces[Y[0]].dims={ ...(c.pieces[Y[0]].dims||{}), [Y[1]]: dim(c,...X) };
  const w=boot(c);
  niveau1(w);
  H.noterPaire(w,X[0],X[1],"est en accord avec",Y[0],Y[1]);
  check("pieces[pid].dims prime sur la table globale", w.S.notes[0].sansRapport===false);
  const w2=boot(embarque());
  niveau1(w2);
  H.noterPaire(w2,X[0],X[1],"est en accord avec",Y[0],Y[1]);
  check("sans surcharge locale, la table globale sert de repli", w2.S.notes[0].sansRapport===true);
}

console.log("— validation du contenu —");
{
  const c=embarque(); delete c.relations;
  const w=boot(c);
  check("contenu sans « relations » rejeté → repli embarqué", w.SOURCE_CONTENU.includes("embarqué"));
}

bilan();

// P0 (attention finie) + O5 (index du dossier) — contenu embarqué.
// Aucune pièce, case ou valeur n'est nommée : tout est dérivé du contenu.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, boot, carnet, niveau1, lienVice, liensNeutres, noterLien,
        noterBruit, caseParLeve, verrouiller, numeroFin } = H;
const actives=w=>w.S.notes.filter(n=>!n.supprimee&&!n.remonte).length;
const saturer = (w,combien) => noterBruit(w,combien);   // paires quelconques

console.log("— O5 : l'index du dossier —");
{
  const w=boot();
  const r1=w.JEU.remises[0], pid=(r1.pieces||[])[0];
  check("index présent dès la remise 1, pièce pas-vue",
    carnet(w).includes("Le dossier") && carnet(w).includes("● "+w.JEU.pieces[pid].court)
    && carnet(w).includes("0/"+(r1.pieces||[]).length+" consultée"));
  w.ouvrirPiece(pid);
  check("ouvrir marque ✓ vu + compteur",
    carnet(w).includes("✓ "+w.JEU.pieces[pid].court)
    && carnet(w).includes((r1.pieces||[]).length+"/"+(r1.pieces||[]).length));
  niveau1(w);
  const toutes=Object.keys(w.JEU.pieces);
  check("toutes les pièces livrées rejoignent l'index",
    toutes.every(p=>carnet(w).includes(w.JEU.pieces[p].court)));
  const nbRegles=toutes.filter(p=>(w.JEU.pieces[p].type||"").includes("règle")).length;
  check("les règles sont stylées à part", (carnet(w).match(/dchip[^"]*regle/g)||[]).length===nbRegles);
  check("chips cliquables vers ouvrirPiece", carnet(w).includes(`onclick="ouvrirPiece('${toutes[1]}')"`));
}

console.log("— P0 : le budget d'attention —");
{
  const w=boot();
  niveau1(w);
  const cap=w.JEU.attention||6;
  check(`attention 0/${cap} affichée`, carnet(w).includes(`attention : 0/${cap}`));
  const pris=saturer(w,cap);
  check(`${cap} notes acceptées`, pris===cap && w.S.notes.length===cap && actives(w)===cap);
  check("saturation affichée", carnet(w).includes("sat") && carnet(w).includes("Attention saturée"));
  const V=lienVice(w);
  noterLien(w,V);                       // la note de trop : LE vice
  check("la note en trop est refusée (le vice n'est même pas pressenti)",
    w.S.notes.length===cap && w.S.vice_pressenti===false && w.S.vice_trouve===false);
  check("boutons de relation désactivés à saturation",
    (carnet(w).match(/class="btn"[^>]*disabled/g)||[]).length===(w.JEU.relations||[]).length);
  check("la paire refusée reste sélectionnée (à rejouer après l'oubli)",
    w.S.slotA && w.S.slotA.champ===V.a[1] && w.S.slotB && w.S.slotB.champ===V.b[1]);
  w.supprimerNote(cap-1);               // oublie la dernière note de bruit
  check("oublier libère un cran", actives(w)===cap-1);
  w.noter(V.rel);                       // la paire est encore en place : re-clic de la relation
  check("le vice se note après l'oubli (1re marche : pressenti, pas encore trouvé)",
    w.S.vice_pressenti===true && w.S.vice_trouve===false && actives(w)===cap);
  const qualif=caseParLeve(w,"vice_trouve");
  if(qualif){
    check("la case privée de qualification apparaît avec le pressentiment",
      carnet(w).includes("Ce que tu te demandes") && carnet(w).includes(qualif[1].label));
    verrouiller(w,qualif[0]);
    check("qualifier verrouille la 2e marche : vice_trouve", w.S.vice_trouve===true);
  }
  const iVice=w.S.notes.findIndex(n=>n.vice);
  w.remonter(iVice);
  check("remonter libère l'attention (transmis ≠ retenu)",
    actives(w)===cap-1 && w.S.notes[iVice].remonte);
  w.supprimerNote(iVice);
  check("une note remontée ne s'oublie pas", !w.S.notes[iVice].supprimee);
}

console.log("— P0 : re-noter, dédoublonnage, saturation directe —");
{
  const w=boot();
  niveau1(w);
  const L=liensNeutres(w)[0];
  noterLien(w,L);
  w.supprimerNote(0);
  noterLien(w,L);
  check("une paire oubliée peut être re-notée", w.S.notes.length===2 && !w.S.notes[1].supprimee);
  noterLien(w,L);
  check("le doublon actif reste refusé", w.S.notes.length===2);
}

console.log("— P0 : oublier le vice = chemin vers la Fin 2 —");
{
  const w=boot();
  niveau1(w);
  noterLien(w,lienVice(w));
  const qualif=caseParLeve(w,"vice_trouve");
  if(qualif) verrouiller(w,qualif[0]);
  w.supprimerNote(0);
  check("vice_trouve reste acquis après l'oubli", w.S.vice_trouve===true);
  w.cloturer();
  check("présentoir : la note oubliée n'est pas proposable",
    w.document.getElementById("canal").textContent.includes("rien dans le carnet à y opposer"));
  while(w.S.repetitionIdx < w.JEU.repetition.affirmations.length) w.avancerRepetition();
  w.cloturer();
  const fin=w.document.querySelector(".fin");
  check("Fin 2 (tu savais, tu t'es tue)", fin && numeroFin(fin.textContent)==="2");
}

console.log("— P0 : attention surchargeable par le contenu —");
{
  const w=boot();
  w.JEU.attention=2;
  niveau1(w);
  const pris=saturer(w,3);
  check("cap 2 respecté quand le contenu le fixe",
    pris===3 && w.S.notes.length===2 && carnet(w).includes("attention : 2/2"));
}

bilan();

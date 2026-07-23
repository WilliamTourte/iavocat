// O5 (index du dossier) + noter gratuit et illimité (le budget d'attention
// P0 a été retiré du moteur — remplace test_p0_o5.js). Aucune pièce, case
// ou valeur n'est nommée : tout est dérivé de la forme du contenu.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, boot, carnet, niveau1, lienVice, liensNeutres, noterLien,
        noterBruit, pairesBruit, numeroFin } = H;

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

console.log("— Noter est gratuit : ni budget, ni compteur, ni oubli —");
{
  const w=boot();
  niveau1(w);
  check("aucun compteur d'attention à l'écran", !carnet(w).includes("attention"));
  check("aucun bouton d'oubli", !carnet(w).includes('class="del"'));
  check("supprimerNote n'existe plus", typeof w.supprimerNote==="undefined");
  check("la clé « attention » a quitté le contenu embarqué", w.JEU.attention===undefined);
  const demandees=10;
  const n=noterBruit(w,demandees);
  check(`${demandees} paires de bruit toutes acceptées, sans plafond`, n===demandees && w.S.notes.length===demandees);
  const libre=pairesBruit(w,demandees+1)[demandees];   // une paire encore inédite
  w.choisirChamp(libre.a[0],libre.a[1]); w.choisirChamp(libre.b[0],libre.b[1]);
  check("aucun bouton désactivé une fois la paire complète (pas de plafond)",
    !/class="btn"[^>]*disabled/.test(carnet(w)));
}

console.log("— re-noter, dédoublonnage (A↔B) —");
{
  const w=boot();
  niveau1(w);
  const L=liensNeutres(w)[0];
  noterLien(w,L);
  check("noté une première fois", w.S.notes.length===1);
  noterLien(w,L);
  check("le doublon (même sens) reste refusé", w.S.notes.length===1);
  H.noterPaire(w,L.b[0],L.b[1],L.rel,L.a[0],L.a[1]);
  check("le doublon inversé (A↔B) reste refusé aussi", w.S.notes.length===1);
}

console.log("— le vice a un canal unique —");
{
  const w=boot();
  niveau1(w);
  const V=lienVice(w);
  // un lien qui « tient », pas le vice, mais qui touche la MÊME pièce-règle
  // (une autre exigence du même texte) : la conformité qui ne mène nulle part.
  const memeRegle=(pid)=>pid===V.b[0];
  const autreExigence=w.JEU.liens.find(L=>!L.vice&&!L.faux&&L.tient
    && (memeRegle(L.a[0])||memeRegle(L.b[0]))
    && !((L.a[0]===V.b[0]&&L.a[1]===V.b[1])||(L.b[0]===V.b[0]&&L.b[1]===V.b[1])));
  if(autreExigence){
    noterLien(w,autreExigence);
    check("l'autre exigence du même texte (conforme) ne lève rien côté vice",
      w.S.vice_pressenti===false && w.S.vice_trouve===false);
  } else check("pas de deuxième exigence déclarée sur la règle du vice — rien à vérifier ici", true);
  noterLien(w,V);
  check("le vice, lui, lève bien le pressentiment", w.S.vice_pressenti===true);
}

console.log("— Vice pressenti puis remonté → Fin 1 / rien → Fin 3 —");
{
  const w=boot();
  niveau1(w);
  noterLien(w,lienVice(w));
  w.remonter(0);
  const fin=H.terminer(w);
  check("Fin 1", numeroFin(fin)==="1");
}
{
  const w=boot();
  niveau1(w);
  const fin=H.terminer(w);
  check("Fin 3 — rien vu", numeroFin(fin)==="3");
}

bilan();

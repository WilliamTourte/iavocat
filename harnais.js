// Harnais commun des suites IAvocat — jsdom, un seul endroit pour booter
// le jeu (contenu embarqué, injecté inline, ou graine localStorage) et
// l'atelier. Chaque suite garde ses assertions ; ici, que la tuyauterie.
const { JSDOM } = require("jsdom");
const fs = require("fs");

function creerHarnais(dossier){
  const htmlJeu = fs.readFileSync(dossier + "/index.html", "utf8");
  let htmlAtelier = null;   // lu paresseusement (toutes les suites n'en ont pas besoin)
  let pass=0, fail=0;

  function check(l,c){ if(c){pass++;console.log("  ok — "+l);} else {fail++;console.log("  ÉCHEC — "+l);} }
  function bilan(){ console.log(`\n${pass} ok, ${fail} échec(s)`); process.exit(fail?1:0); }

  /* boot({contenu, graine, url}) :
     - contenu : objet → injecté inline à la place de content.js ;
                 null → balise retirée (contenu embarqué) ;
                 absent → balise laissée (jsdom ne charge pas les src : embarqué aussi)
     - graine  : {clé:valeur} semé dans localStorage AVANT les scripts
     - url     : origine (nécessaire pour localStorage ; posée d'office si graine) */
  function boot(opts={}){
    let h=htmlJeu;
    if("contenu" in opts)
      h=h.replace('<script src="content.js"></script>',
        opts.contenu?`<script>window.CONTENU=${JSON.stringify(opts.contenu)};</script>`:"");
    const url=opts.url || (opts.graine ? "http://localhost/" : undefined);
    return new JSDOM(h,{runScripts:"dangerously", ...(url?{url}:{}),
      beforeParse(win){ if(opts.graine) for(const [k,v] of Object.entries(opts.graine)) win.localStorage.setItem(k,v); }
    }).window;
  }
  function bootAtelier(opts={}){
    if(htmlAtelier===null) htmlAtelier=fs.readFileSync(dossier + "/atelier_v3.html","utf8");
    const url=opts.url || "http://localhost/";   // l'atelier vit sur localStorage
    return new JSDOM(htmlAtelier,{runScripts:"dangerously",url,
      beforeParse(win){ if(opts.graine) for(const [k,v] of Object.entries(opts.graine)) win.localStorage.setItem(k,v); }
    }).window;
  }
  function embarque(){ return JSON.parse(JSON.stringify(boot({contenu:null}).JEU)); }

  function noterPaire(w,pA,cA,rel,pB,cB){ w.choisirChamp(pA,cA); w.choisirChamp(pB,cB); w.noter(rel); }
  const canal  = w => w.document.getElementById("canal").textContent;
  const carnet = w => w.document.getElementById("carnet").innerHTML;

  /* ---- Sélecteurs par PROPRIÉTÉ ------------------------------
     Aucune suite ne doit nommer une pièce, une case ou une valeur
     du contenu : tout se dérive de la forme. Le jour où l'affaire
     change, les tests suivent sans retouche. */
  const J = w => w.JEU;

  // Liens, par leur rôle déclaré
  const lienVice   = w => J(w).liens.find(L=>L.vice);
  const lienFaux   = w => J(w).liens.find(L=>L.faux);
  // Liens « ordinaires » : ni vice ni faux. sansRapport=true → dimensions
  // différentes (le jeu dira « sans rapport ») ; false → cohérent mais inutile.
  function liensNeutres(w,{sansRapport}={}){
    const dim=(pid,ch)=>((J(w).pieces[pid]||{}).dims||{})[ch] ?? (J(w).dims||{})[ch];
    return J(w).liens.filter(L=>{
      if(L.vice||L.faux) return false;
      if(sansRapport===undefined) return true;
      const sr = dim(L.a[0],L.a[1])!==dim(L.b[0],L.b[1]);
      return sr===sansRapport;
    });
  }
  const noterLien = (w,L) => noterPaire(w,L.a[0],L.a[1],L.rel,L.b[0],L.b[1]);

  /* Paires quelconques de champs, hors liens déclarés vice/faux : de quoi
     remplir l'attention sans rien nommer. Le moteur accepte n'importe quel
     rapprochement — c'est justement ce qui rend le budget contraignant. */
  function pairesBruit(w,n){
    const champs=[];
    for(const [pid,p] of Object.entries(J(w).pieces))
      for(const ch of Object.keys(p.champs||{})) champs.push([pid,ch]);
    const interdit=new Set();
    for(const L of J(w).liens) if(L.vice||L.faux){
      interdit.add(L.a.join(".")+"|"+L.b.join("."));
      interdit.add(L.b.join(".")+"|"+L.a.join("."));
    }
    const out=[];
    for(let i=0;i<champs.length&&out.length<n;i++)
      for(let k=i+1;k<champs.length&&out.length<n;k++){
        const cle=champs[i].join(".")+"|"+champs[k].join(".");
        if(interdit.has(cle)) continue;
        out.push({a:champs[i],b:champs[k]});
      }
    return out;
  }
  const noterBruit = (w,n,rel) => {
    const paires=pairesBruit(w,n);
    for(const P of paires) noterPaire(w,P.a[0],P.a[1],rel||"est en accord avec",P.b[0],P.b[1]);
    return paires.length;
  };

  // Cases, par leur forme
  const casesObligatoires = w => Object.entries(J(w).cases).filter(([,c])=>!c.apparait_si);
  const caseParLeve = (w,drapeau) => Object.entries(J(w).cases).find(([,c])=>c.leve===drapeau);
  const idCaseObligatoire = (w,n=0) => casesObligatoires(w)[n][0];
  // Verrouille une case avec SA bonne réponse, quelle qu'elle soit.
  function verrouiller(w,ck){ w.designer(ck, J(w).cases[ck].bonne); }
  /* Amène le jeu au bout du niveau 1 : toutes les cases obligatoires
     verrouillées, dans l'ordre où les remises les rendent visibles. */
  function niveau1(w){
    let reste=true;
    while(reste){
      reste=false;
      for(const [ck,c] of casesObligatoires(w)){
        if(w.S.locks[ck]) continue;
        if(w.S.remisesEnvoyees < (c.remise||1)) continue;
        verrouiller(w,ck); reste=true;
      }
    }
  }
  // Pièces, par leur forme
  const pidAvecDeclenche = w => Object.keys(J(w).pieces).find(pid=>J(w).pieces[pid].declenche);
  const pidRegle = w => Object.keys(J(w).pieces).find(pid=>(J(w).pieces[pid].type||"").includes("règle"));
  const pidPremiereRemise = w => (J(w).remises[0].pieces||[])[0];
  // Un champ « libre » d'une pièce (pour tester la sélection sans rien nommer)
  const champsDe = (w,pid) => Object.keys(J(w).pieces[pid].champs||{});

  // Déroule la répétition de plaidoirie jusqu'au bout, puis confirme.
  function terminer(w){
    w.cloturer();
    while(w.S.repetitionIdx < J(w).repetition.affirmations.length) w.avancerRepetition();
    w.cloturer();
    const f=w.document.querySelector(".fin");
    return f ? f.textContent : "";
  }
  const numeroFin = txt => (txt.match(/Fin (\d)/)||[])[1];

  /* Les mêmes sélecteurs, mais sur un CONTENU brut (l'atelier expose son
     objet, pas une fenêtre de jeu). Objet à part pour éviter toute confusion. */
  const surContenu = {
    dim: (c,pid,ch) => ((c.pieces[pid]||{}).dims||{})[ch] ?? (c.dims||{})[ch],
    ckObligatoire: (c,n=0) => Object.keys(c.cases).filter(k=>!c.cases[k].apparait_si)[n],
    ckLeve: (c,drapeau) => Object.keys(c.cases).find(k=>c.cases[k].leve===drapeau),
    ckAvecApres: c => Object.keys(c.cases).find(k=>c.cases[k].apres),
    pidDeclenche: c => Object.keys(c.pieces).find(p=>c.pieces[p].declenche),
    pidRegle: c => Object.keys(c.pieces).find(p=>(c.pieces[p].type||"").includes("règle")),
    pidAutreQue: (c,pid) => Object.keys(c.pieces).find(p=>p!==pid),
    iLienVice: c => c.liens.findIndex(L=>L.vice),
    // un champ (pid, nom) qui possède une dimension globale, pour tester les surcharges
    champAvecDim: c => {
      for(const [pid,p] of Object.entries(c.pieces))
        for(const ch of Object.keys(p.champs||{})) if((c.dims||{})[ch]) return [pid,ch];
    },
    // deux champs de dimensions différentes (dimsMatch doit dire faux)
    deuxChampsDiff: c => {
      const t=[];
      for(const [pid,p] of Object.entries(c.pieces)) for(const ch of Object.keys(p.champs||{})) t.push([pid,ch]);
      for(let i=0;i<t.length;i++) for(let k=i+1;k<t.length;k++)
        if(surContenu.dim(c,...t[i])!==surContenu.dim(c,...t[k])) return [t[i],t[k]];
    }
  };

  return { check, bilan, boot, bootAtelier, embarque, noterPaire, canal, carnet,
           D:"est en désaccord avec", A:"est en accord avec",
           lienVice, lienFaux, liensNeutres, noterLien, pairesBruit, noterBruit,
           casesObligatoires, caseParLeve, idCaseObligatoire, verrouiller, niveau1,
           pidAvecDeclenche, pidRegle, pidPremiereRemise, champsDe,
           terminer, numeroFin, surContenu };
}
module.exports = { creerHarnais };

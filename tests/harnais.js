// Harnais commun des suites IAvocat — jsdom, un seul endroit pour booter
// le jeu (contenu embarqué, injecté inline, ou graine localStorage) et
// l'atelier. Chaque suite garde ses assertions ; ici, que la tuyauterie.
const { JSDOM } = require("jsdom");
const fs = require("fs");

function creerHarnais(dossier){
  const htmlJeu = fs.readFileSync(dossier + "/index.html", "utf8");
  const jsMoteur = fs.readFileSync(dossier + "/moteur.js", "utf8");
  let htmlAtelier = null;   // lu paresseusement (toutes les suites n'en ont pas besoin)
  let pass=0, fail=0;

  function check(l,c){ if(c){pass++;console.log("  ok — "+l);} else {fail++;console.log("  ÉCHEC — "+l);} }
  function bilan(){ console.log(`\n${pass} ok, ${fail} échec(s)`); process.exit(fail?1:0); }

  /* jsdom ne charge pas les <script src> : on inline moteur.js, qui est la
     grammaire partagée par le jeu, l'atelier et le banc d'essai. Ce n'est pas
     une copie — c'est le fichier même, lu sur le disque à chaque boot. */
  const injecterMoteur = h =>
    h.replace('<script src="moteur.js"></script>', `<script>${jsMoteur}</script>`);

  /* boot({contenu, graine, url}) :
     - contenu : objet → injecté inline à la place de content.js ;
                 null → balise retirée (contenu embarqué) ;
                 absent → balise laissée (jsdom ne charge pas les src : embarqué aussi)
     - graine  : {clé:valeur} semé dans localStorage AVANT les scripts
     - url     : origine (nécessaire pour localStorage ; posée d'office si graine) */
  function boot(opts={}){
    let h=injecterMoteur(htmlJeu);
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
    return new JSDOM(injecterMoteur(htmlAtelier),{runScripts:"dangerously",url,
      beforeParse(win){ if(opts.graine) for(const [k,v] of Object.entries(opts.graine)) win.localStorage.setItem(k,v); }
    }).window;
  }
  function embarque(){ return JSON.parse(JSON.stringify(boot({contenu:null}).JEU)); }

  const canal    = w => w.document.getElementById("canal").textContent;
  /* La mémoire et le composeur ne font plus qu'une colonne (§4.6) : les deux
     sélecteurs pointent la même, et `plan` la surface transmise. */
  const memoire  = w => w.document.getElementById("atelier").innerHTML;
  const atelier  = w => w.document.getElementById("atelier").innerHTML;
  const plan     = w => w.document.getElementById("plan").innerHTML;

  /* ---- Sélecteurs par PROPRIÉTÉ ------------------------------
     Aucune suite ne doit nommer une pièce, un empan ou une valeur
     du contenu : tout se dérive de la forme. Le jour où l'affaire
     change, les tests suivent sans retouche. */
  const J = w => w.JEU;

  // Liens, par leur rôle déclaré
  const lienVice       = w => J(w).liens.find(L=>L.vice && !L.conclusion);
  const lienConclusion = w => J(w).liens.find(L=>L.vice && L.conclusion);
  const lienFaux       = w => J(w).liens.find(L=>L.faux);
  /* Le lien qui porte un tag d'attente. Une même attente peut être servie de
     plusieurs façons (c'est voulu : le chemin docile et le chemin honnête
     ferment la même session) — `docile` prend celui qui ne passe pas par le
     vice, ce qui définit exactement le parcours de la Fin 3. */
  const lienTag = (w,tag,{docile=true}={}) => {
    const cands=J(w).liens.filter(L=>L.tag===tag);
    return (docile ? cands.find(L=>!L.vice) : cands.find(L=>L.vice)) || cands[0];
  };
  const liensNeutres   = w => J(w).liens.filter(L=>!L.vice && !L.faux);
  const arite = (w,L) => ((J(w).grammaire.formes||{})[L.forme]||{}).arite || 2;

  // --- composer : le geste du jeu, joué par les fonctions du moteur ---
  const idBloc = (w,id) => w.blocsOfferts().findIndex(b=>b.id===id);
  const surligner = (w,k) => { const [pid,eid]=k.split("."); if(!w.S.memoire.includes(k)) w.surligner(pid,eid); };
  const iMem = (w,k) => w.S.memoire.indexOf(k);

  /* Compose la phrase qui réalise un lien donné, quel qu'il soit : on
     surligne ce qu'il faut, puis on parcourt l'automate en choisissant, à
     chaque état, le bloc qui mène à la forme voulue. Rend l'index de la
     phrase au brouillon (ou -1 si elle n'a pas pu se former). */
  function composerLien(w,L){
    const f=(J(w).grammaire.formes||{})[L.forme]||{};
    w.viderCompo();
    const trouve = () => w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,{forme:L.forme,termes:L.termes}));

    if((f.arite||2)===1){
      const sous=(L.termes||[])[0]||{};
      /* 1) LA CONTINUATION (§4.5) : poser la comparaison sans la clore, puis
            la liaison qui l'emboîte — le chemin du contenu d'aujourd'hui. */
      if(sous.forme && poserComparaison(w,sous)){
        const b=w.blocsOfferts().findIndex(x=>x.forme===L.forme && x.imbrique);
        if(b>=0){ w.poserBloc(b); const i=trouve(); if(i>=0) return i; }
      }
      /* 2) LE REPLI : la source `note`, pour une affaire écrite avant la
            continuation. C'est ce qui prouve la rétrocompatibilité (§11). */
      w.viderCompo();
      let i=w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,sous));
      if(i<0){ i=composerLien(w,{forme:sous.forme,termes:sous.termes}); if(i<0) return -1; }
      const b=idBloc(w,blocNote(w)); if(b<0) return -1;
      w.poserBloc(b,i);
      const bl=idBloc(w,blocForme(w,L.forme)); if(bl<0) return -1;
      w.poserBloc(bl);
    } else {
      if(!poserComparaison(w,L)) return -1;
      cloreSurPlace(w);
    }
    return trouve();
  }
  /* Les deux termes et la liaison d'une forme d'arité 2, SANS chercher à clore :
     selon la grammaire on se retrouve soit déjà à la fin (à l'ancienne), soit
     sur l'état qui offre « et donc ? ». */
  function poserComparaison(w,L){
    const G=J(w).grammaire;
    const [t0,t1]=L.termes||[];
    if(typeof t0!=="string" || typeof t1!=="string") return false;
    surligner(w,t0); surligner(w,t1);
    const bT=idBloc(w,blocChamp(w)); if(bT<0) return false;
    w.poserBloc(bT,iMem(w,t0));
    for(const etape of cheminVers(w,L.forme)){
      const b=idBloc(w,etape); if(b<0) return false;
      const bloc=G.blocs.find(x=>x.id===etape);
      w.poserBloc(b, bloc.type==="terme" ? iMem(w,t1) : undefined);
    }
    return true;
  }
  /* « En rester là » : le bloc qui clôt sans rien qualifier. Sans effet si
     l'automate a déjà refermé la phrase tout seul. */
  function cloreSurPlace(w){
    if(!w.S.compo.length) return;
    const G=J(w).grammaire, e=w.etatCompo(), finaux=new Set(G.finaux||[]);
    const b=G.blocs.find(x=>x.de===e && finaux.has(x.vers) && !x.forme && !x.imbrique);
    if(b) w.poserBloc(idBloc(w,b.id));
  }
  const blocChamp = w => (J(w).grammaire.blocs.find(b=>b.type==="terme"&&b.source!=="note"&&b.de===J(w).grammaire.depart)||{}).id;
  const blocNote  = w => (J(w).grammaire.blocs.find(b=>b.type==="terme"&&b.source==="note"&&b.de===J(w).grammaire.depart)||{}).id;
  const blocForme = (w,forme) => (J(w).grammaire.blocs.find(b=>b.forme===forme)||{}).id;
  /* Le chemin de blocs, depuis l'état où l'on est, jusqu'au bloc qui porte
     la forme voulue. Recherche en largeur — aucun identifiant en dur. */
  function cheminVers(w,forme){
    const G=J(w).grammaire;
    const file=[[w.etatCompo(),[]]], vus=new Set();
    while(file.length){
      const [e,acc]=file.shift();
      if(vus.has(e)) continue; vus.add(e);
      for(const b of G.blocs.filter(x=>x.de===e)){
        const suite=[...acc,b.id];
        if(b.forme===forme) return suite;
        file.push([b.vers,suite]);
      }
    }
    return [];
  }
  /* Des phrases sensées qui ne portent AUCUN lien : la marge de bruit. Sert à
     vérifier que composer et verser restent gratuits et illimités. */
  function phrasesBruit(w,n){
    const G=J(w).grammaire;
    const emp=w.CHAMPS;
    const forme2=Object.entries(G.formes).find(([,f])=>(f.arite||2)===2&&f.relation==="meme_dim");
    if(!forme2) return 0;
    const [nomForme]=forme2;
    const slots=G.formes[nomForme].slots[0];
    let fait=0;
    for(let i=0;i<emp.length&&fait<n;i++)
      for(let k=i+1;k<emp.length&&fait<n;k++){
        const a=emp[i], b=emp[k];
        if(a.dim!==b.dim || !slots.includes(a.dim)) continue;
        const cand={forme:nomForme,termes:[a.id,b.id]};
        if(J(w).liens.some(L=>w.M.memeRed({forme:L.forme,termes:L.termes},cand))) continue;
        if(w.S.brouillon.some(x=>w.M.memeRed(x.reduite,cand))) continue;
        if(composerLien(w,cand)>=0) fait++;
      }
    return fait;
  }

  // Pièces, par leur forme
  const pidAvecDeclenche = w => Object.keys(J(w).pieces).find(pid=>J(w).pieces[pid].declenche);
  const pidRegle = w => Object.keys(J(w).pieces).find(pid=>(J(w).pieces[pid].type||"").includes("règle"));
  const pidPremiereRemise = w => (J(w).remises[0].pieces||[])[0];
  const empansDe = (w,pid) => Object.keys(J(w).pieces[pid].empans||{}).map(e=>pid+"."+e);

  /* Amène le jeu au bout de l'instruction : pour chaque session, compose et
     verse la phrase qui porte le tag attendu. C'est le chemin docile. */
  function instruire(w){
    let garde=0;
    while(garde++<20){
      const r=J(w).remises[w.S.remisesEnvoyees-1];
      if(!r || !r.attend || w.S.satisfaits.includes(r.attend)) break;
      const L=lienTag(w,r.attend);
      if(!L) break;
      const i=composerLien(w,L);
      if(i<0) break;
      w.envoyer(i);
    }
  }

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
    empans: c => {
      const out=[];
      for(const [pid,p] of Object.entries(c.pieces))
        for(const [eid,e] of Object.entries(p.empans||{})) out.push({id:pid+"."+eid,pid,eid,...e});
      return out;
    },
    dim: (c,k) => { const [pid,eid]=k.split("."); return ((c.pieces[pid]||{}).empans||{})[eid]?.dim; },
    iLienVice: c => c.liens.findIndex(L=>L.vice && !L.conclusion),
    iLienConclusion: c => c.liens.findIndex(L=>L.vice && L.conclusion),
    iLienNeutre: c => c.liens.findIndex(L=>!L.vice && !L.faux),
    pidDeclenche: c => Object.keys(c.pieces).find(p=>c.pieces[p].declenche),
    pidRegle: c => Object.keys(c.pieces).find(p=>(c.pieces[p].type||"").includes("règle")),
    pidAutreQue: (c,pid) => Object.keys(c.pieces).find(p=>p!==pid),
    // un empan quelconque d'une pièce livrée
    unEmpan: c => surContenu.empans(c)[0],
    // deux empans de dimensions différentes (le composeur doit les refuser)
    deuxEmpansDiff: c => {
      const t=surContenu.empans(c);
      for(let i=0;i<t.length;i++) for(let k=i+1;k<t.length;k++)
        if(t[i].dim!==t[k].dim) return [t[i],t[k]];
    }
  };

  return { check, bilan, boot, bootAtelier, embarque, canal, memoire, atelier,
           lienVice, lienConclusion, lienFaux, lienTag, liensNeutres, arite,
           plan, cloreSurPlace, poserComparaison,
           surligner, iMem, composerLien, phrasesBruit, cheminVers,
           blocChamp, blocNote, blocForme, idBloc,
           pidAvecDeclenche, pidRegle, pidPremiereRemise, empansDe,
           instruire, terminer, numeroFin, surContenu };
}
module.exports = { creerHarnais };

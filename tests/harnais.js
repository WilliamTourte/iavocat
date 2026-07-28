// Harnais commun des suites IAvocat — jsdom, un seul endroit pour booter
// le jeu (contenu livré, muté et injecté inline, ou graine localStorage) et
// l'atelier. Chaque suite garde ses assertions ; ici, que la tuyauterie.
const { JSDOM } = require("jsdom");
const fs = require("fs");

function creerHarnais(dossier){
  const htmlJeu = fs.readFileSync(dossier + "/index.html", "utf8");
  const lire = f => fs.readFileSync(dossier + "/" + f, "utf8");
  let htmlAtelier = null;   // lu paresseusement (toutes les suites n'en ont pas besoin)
  let pass=0, fail=0;

  function check(l,c){ if(c){pass++;console.log("  ok — "+l);} else {fail++;console.log("  ÉCHEC — "+l);} }
  function bilan(){ console.log(`\n${pass} ok, ${fail} échec(s)`); process.exit(fail?1:0); }

  /* jsdom ne charge aucun <script src> : on inline les trois fichiers voisins
     — la grammaire, les règles, le contenu. Ce ne sont pas des copies : ce
     sont les fichiers mêmes, relus sur le disque à chaque boot. C'est ce qui
     permet au contenu de n'exister qu'en un exemplaire (§12). */
  const injecter = h => h
    .replace('<script src="moteur.js"></script>', `<script>${lire("moteur.js")}</script>`)
    .replace('<script src="regles.js"></script>', `<script>${lire("regles.js")}</script>`)
    .replace('<script src="content.js"></script>', `<script>${lire("content.js")}</script>`);

  /* boot({contenu, graine, url}) :
     - contenu : objet → injecté inline à la place de content.js ;
                 null → balise retirée (aucun contenu : le jeu affiche sa panne)
                 absent → content.js, le contenu livré
     - graine  : {clé:valeur} semé dans localStorage AVANT les scripts
     - url     : origine (nécessaire pour localStorage ; posée d'office si graine) */
  function boot(opts={}){
    let h=htmlJeu;
    if("contenu" in opts)
      h=h.replace('<script src="content.js"></script>',
        opts.contenu?`<script>window.CONTENU=${JSON.stringify(opts.contenu)};</script>`:"");
    h=injecter(h);
    const url=opts.url || (opts.graine ? "http://localhost/" : undefined);
    return new JSDOM(h,{runScripts:"dangerously", ...(url?{url}:{}),
      beforeParse(win){ if(opts.graine) for(const [k,v] of Object.entries(opts.graine)) win.localStorage.setItem(k,v); }
    }).window;
  }
  function bootAtelier(opts={}){
    if(htmlAtelier===null) htmlAtelier=fs.readFileSync(dossier + "/atelier_v3.html","utf8");
    const url=opts.url || "http://localhost/";   // l'atelier vit sur localStorage
    return new JSDOM(injecter(htmlAtelier),{runScripts:"dangerously",url,
      beforeParse(win){ if(opts.graine) for(const [k,v] of Object.entries(opts.graine)) win.localStorage.setItem(k,v); }
    }).window;
  }
  /* Le contenu LIVRÉ — celui de content.js, le seul qui existe. Les suites qui
     éprouvent le décâblage partent de lui et le mutent. */
  function contenuLivre(){ return JSON.parse(JSON.stringify(boot().JEU)); }

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
  /* LE PRESSENTIMENT. Depuis que l'article est obligatoire, la comparaison du
     vice ne peut plus se clore seule : elle n'est plus déclarée comme lien à
     part, elle est le TERME EMBOÎTÉ de la conclusion. On la lit donc là — et
     si une affaire l'expose encore comme lien nu (écriture à l'ancienne), on
     prend celui-là. */
  const lienVice = w => {
    const nu = J(w).liens.find(L=>L.vice && !L.conclusion);
    if(nu) return nu;
    const c = lienConclusion(w), t = c && (c.termes||[])[0];
    return (t && typeof t === "object") ? t : undefined;
  };
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
  /* Toutes les COMPARAISONS (arité 2) que le contenu déclare. Depuis que
     l'article est obligatoire, elles ne sont plus des liens de plein droit :
     elles vivent emboîtées dans les qualifications. On les cherche donc là où
     elles sont, sans supposer laquelle des deux écritures l'affaire emploie. */
  const comparaisons = w => {
    const out=[], vus=new Set();
    const rec = t => {
      if(!t || typeof t!=="object" || Array.isArray(t)) return;
      if(t.forme && (((J(w).grammaire.formes||{})[t.forme]||{}).arite||2)===2){
        const cle=JSON.stringify([t.forme,t.termes]);
        if(!vus.has(cle)){ vus.add(cle); out.push({forme:t.forme,termes:t.termes}); }
      }
      for(const u of (t.termes||[])) rec(u);
    };
    for(const L of J(w).liens) rec(L);
    return out;
  };
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
    // Grammaire à DÉDUCTION : le second terme clôt la paire, rien entre les deux.
    const bD=w.blocsOfferts().findIndex(x=>x.type==="terme"&&x.source!=="note"&&x.deduit);
    if(bD>=0){ w.poserBloc(bD,iMem(w,t1)); return true; }
    // Grammaire à liaisons explicites (à l'ancienne) : on parcourt l'automate.
    for(const etape of cheminVers(w,L.forme)){
      const b=idBloc(w,etape); if(b<0) return false;
      const bloc=G.blocs.find(x=>x.id===etape);
      w.poserBloc(b, bloc.type==="terme" ? iMem(w,t1) : undefined);
    }
    return true;
  }
  /* Fait partir toutes les remises, sans jouer l'instruction. Utile depuis que
     les liaisons-articles sont filtrées par livraison (§4.5) : une suite qui
     compose une conclusion sans jouer doit d'abord avoir reçu le texte. */
  function livrerTout(w){
    let garde=0;
    while(w.S.remisesEnvoyees < J(w).remises.length && garde++<20) w.envoyerRemise();
    w.rendreTout();
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
  /* Les liaisons-articles offertes ici et maintenant : celles dont la pièce a
     été livrée. Vide pour une affaire écrite à l'ancienne. */
  const articlesDisponibles = w => {
    const livrees=new Set(w.piecesLivrees());
    return (J(w).grammaire.blocs||[]).filter(b=>b.imbrique && b.forme && (!b.piece || livrees.has(b.piece)));
  };
  /* Des phrases sensées qui ne portent AUCUN lien : la marge de bruit. Sert à
     vérifier que composer et verser restent gratuits et illimités.
     Depuis que l'article est obligatoire, une phrase de bruit est une
     comparaison quelconque QUALIFIÉE par un article quelconque — c'est-à-dire
     bien formée, fondée, et sans le moindre intérêt. C'est exactement ce que
     l'invariant demande : « sensé » ne doit jamais valoir « correct ». */
  function phrasesBruit(w,n){
    const G=J(w).grammaire;
    const emp=w.CHAMPS;
    const deduction=(G.blocs||[]).some(x=>x.deduit);
    const forme2=Object.entries(G.formes).find(([,f])=>(f.arite||2)===2&&f.relation==="meme_dim");
    if(!deduction && !forme2) return 0;
    const arts=articlesDisponibles(w);
    let fait=0;
    for(let i=0;i<emp.length&&fait<n;i++)
      for(let k=i+1;k<emp.length&&fait<n;k++){
        const a=emp[i], b=emp[k];
        if(a.dim!==b.dim) continue;
        // La forme n'est plus choisie : c'est celle que le moteur DÉDUIRA.
        let nomForme;
        if(deduction) nomForme=w.M.deduire(a.id,b.id);
        else { nomForme=forme2[0];
               if(!G.formes[nomForme].slots[0].includes(a.dim)) continue; }
        if(!nomForme) continue;
        const termes=w.M.ordonner ? w.M.ordonner(nomForme,[a.id,b.id]) : [a.id,b.id];
        const comparaison={forme:nomForme,termes};
        // Chaque continuation possible fait une phrase de bruit de plus ; sans
        // continuation (affaire à l'ancienne), la comparaison se clôt seule.
        const cands = arts.length
          ? arts.map(bl=>({forme:bl.forme, termes:[comparaison]}))
          : [comparaison];
        for(const cand of cands){
          if(fait>=n) break;
          if(J(w).liens.some(L=>w.M.memeRed({forme:L.forme,termes:L.termes},cand))) continue;
          if(w.S.brouillon.some(x=>w.M.memeRed(x.reduite,cand))) continue;
          if(composerLien(w,cand)>=0) fait++;
        }
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
    // Garde : si la clôture ne s'ouvre pas (attente inservable, article livré
    // trop tard…), `repetitionIdx` reste à -1. Mieux vaut rendre "" et faire
    // échouer le contrôle que tourner en rond sans rien dire.
    let garde=0;
    while(w.S.repetitionIdx >= 0
          && w.S.repetitionIdx < J(w).repetition.affirmations.length
          && garde++ < 50) w.avancerRepetition();
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
    // Le lien qui PORTE le vice : la conclusion, depuis que l'article est
    // obligatoire ; le pressentiment nu si l'affaire l'expose encore.
    iLienVice: c => { const i=c.liens.findIndex(L=>L.vice && !L.conclusion);
                      return i>=0 ? i : c.liens.findIndex(L=>L.vice); },
    iLienConclusion: c => c.liens.findIndex(L=>L.vice && L.conclusion),
    // La comparaison du vice, où qu'elle vive : lien nu, ou terme emboîté.
    sousVice: c => { const L=c.liens.find(x=>x.vice && x.conclusion) || c.liens.find(x=>x.vice);
                     if(!L) return null;
                     const t=(L.termes||[])[0];
                     return (t && typeof t==="object") ? t : L; },
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

  return { check, bilan, boot, bootAtelier, contenuLivre, canal, memoire, atelier,
           lienVice, lienConclusion, lienFaux, lienTag, liensNeutres, comparaisons, arite,
           plan, cloreSurPlace, poserComparaison, livrerTout,
           surligner, iMem, composerLien, phrasesBruit, cheminVers,
           blocChamp, blocNote, blocForme, idBloc, articlesDisponibles,
           pidAvecDeclenche, pidRegle, pidPremiereRemise, empansDe,
           instruire, terminer, numeroFin, surContenu };
}
module.exports = { creerHarnais };

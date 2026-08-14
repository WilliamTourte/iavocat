// Harnais commun des suites IAvocat — jsdom, un seul endroit pour booter
// le jeu (contenu livré, muté et injecté inline, ou graine localStorage) et
// l'atelier. Chaque suite garde ses assertions ; ici, que la tuyauterie.
const { JSDOM } = require("jsdom");
const fs = require("fs");
/* Les projections ne se recopient pas : le harnais lit le MÊME moteur.js que le
   jeu et l'atelier (§12, §14). */
const { champsDe, comparaisonsDe } = require("../app/moteur.js");
/* …et les RÈGLES viennent de regles.js, pour la même raison. Une suite DÉSIGNE,
   elle ne DÉCIDE pas (§16) — un prédicat recopié reste vert en affirmant
   l'ancienne vérité, et R10 le tient. */
const { estRegle } = require("../app/regles.js");

function creerHarnais(dossier){
  const htmlJeu = fs.readFileSync(dossier + "/index.html", "utf8");
  const lire = f => fs.readFileSync(dossier + "/" + f, "utf8");
  let htmlAtelier = null;   // lu paresseusement (toutes les suites n'en ont pas besoin)
  let pass=0, fail=0;

  function check(l,c){ if(c){pass++;console.log("  ok — "+l);} else {fail++;console.log("  ÉCHEC — "+l);} }
  function bilan(){ console.log(`\n${pass} ok, ${fail} échec(s)`); process.exit(fail?1:0); }

  /* jsdom ne charge NI <script src> NI <link rel=stylesheet> : on inline les
     fichiers mêmes, relus à chaque boot, dans l'ORDRE des balises (§12, §13).
     LE CSS AUSSI, bien qu'aucune suite ne lise de couleur — `getCSS()` en lit, et
     jsdom rend "" pour un <link> : sans ce filet, sortir le CSS du HTML aurait
     changé ce que le graphe dessine sous test sans qu'aucun contrôle ne bronche. */
  const injecter = h => h
    .replace(/<script src="([^"]+)"><\/script>/g, (_, f) => `<script>${lire(f)}</script>`)
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, f) => `<style>${lire(f)}</style>`);

  /* boot({contenu, graine, url}) :
     - contenu : objet → injecté inline à la place de content.js ;
                 null → balise retirée (aucun contenu : le jeu affiche sa panne)
                 absent → content.js, le contenu livré
     - graine  : {clé:valeur} semé dans localStorage AVANT les scripts
     - url     : origine (nécessaire pour localStorage ; posée d'office si graine) */
  /* La fenêtre en un seul endroit : un semis de graine qui diverge, c'est une
     suite de sauvegarde qui éprouve autre chose que ce qu'elle croit. */
  const ouvrir = (html,url,graine) =>
    new JSDOM(injecter(html),{runScripts:"dangerously", ...(url?{url}:{}),
      beforeParse(win){ if(graine) for(const [k,v] of Object.entries(graine)) win.localStorage.setItem(k,v); }
    }).window;

  function boot(opts={}){
    let h=htmlJeu;
    if("contenu" in opts)
      h=h.replace('<script src="content.js"></script>',
        opts.contenu?`<script>window.CONTENU=${JSON.stringify(opts.contenu)};</script>`:"");
    return ouvrir(h, opts.url || (opts.graine ? "http://localhost/" : undefined), opts.graine);
  }
  function bootAtelier(opts={}){
    if(htmlAtelier===null) htmlAtelier=fs.readFileSync(dossier + "/atelier_v3.html","utf8");
    // l'atelier vit sur localStorage : il lui faut TOUJOURS une origine.
    return ouvrir(htmlAtelier, opts.url || "http://localhost/", opts.graine);
  }
  /* Le contenu LIVRÉ — celui de content.js, le seul qui existe. Les suites qui
     éprouvent le décâblage partent de lui et le mutent. */
  function contenuLivre(){ return JSON.parse(JSON.stringify(boot().JEU)); }

  /* Les quatre surfaces, chacune sous le nom que l'écran lui donne
     (docs/CARTE.md) — la Plaidoirie vide étant retirée, `plaidoirieVisible` dit
     si la colonne existe (§4.9). */
  const discussion = w => w.document.getElementById("discussion").textContent;
  const memoire  = w => w.document.getElementById("memoire").innerHTML;
  const composeur = w => w.document.getElementById("composeur").innerHTML;
  const plaidoirie = w => w.document.getElementById("plaidoirie").innerHTML;
  const plaidoirieVisible = w => !w.document.getElementById("colPlaidoirie").hidden;

  /* ---- Sélecteurs par PROPRIÉTÉ ---- aucune suite ne nomme une pièce, un empan
     ou une valeur : tout se dérive de la forme (§16). */
  const J = w => w.JEU;

  /* ---- LES PRÉDICATS, en un seul exemplaire ---- deux familles posent les
     MÊMES questions, l'une depuis une fenêtre, l'autre depuis un contenu brut.
     On met en commun le PRÉDICAT, jamais la fonction (§12). */
  const estVice       = L => !!L.vice;
  const estConclusion = L => !!(L.vice && L.conclusion);
  const estViceNu     = L => !!(L.vice && !L.conclusion);
  const estFaux       = L => !!L.faux;
  const estNeutre     = L => !L.vice && !L.faux;
  const aDeclenche    = p => !!p.declenche;
  // Le terme emboîté d'un lien, s'il en porte un — la comparaison du vice y
  // vit depuis que l'article est obligatoire (§4.5).
  const sousTerme = L => { const t = L && (L.termes||[])[0];
                           return (t && typeof t === "object") ? t : null; };

  // Liens, par leur rôle déclaré
  /* LE PRESSENTIMENT : la comparaison du vice est le TERME EMBOÎTÉ de la
     conclusion. On la lit là — ou comme lien nu, à l'ancienne. */
  const lienVice = w =>
    J(w).liens.find(estViceNu) || sousTerme(lienConclusion(w)) || undefined;
  const lienConclusion = w => J(w).liens.find(estConclusion);
  const lienFaux       = w => J(w).liens.find(estFaux);
  /* Le lien qui porte un tag d'attente ; `docile` prend celui qui ne passe pas
     par le vice — c'est le parcours de la Fin 3 (§3). */
  const lienTag = (w,tag,{docile=true}={}) => {
    const cands=J(w).liens.filter(L=>L.tag===tag);
    return (docile ? cands.find(L=>!estVice(L)) : cands.find(estVice)) || cands[0];
  };
  const liensNeutres   = w => J(w).liens.filter(estNeutre);
  /* Les COMPARAISONS (arité 2) du contenu, emboîtées comprises — la marche est
     celle de moteur.js. */
  const comparaisons = w => comparaisonsDe(J(w).liens, J(w).grammaire.formes);
  const arite = (w,L) => ((J(w).grammaire.formes||{})[L.forme]||{}).arite || 2;
  /* Les CITATIONS : arité 1, terme ATOMIQUE — l'emboîtement, et lui seul, les
     sépare d'une qualification (§4.5). */
  const citations = w => J(w).liens.filter(L =>
    arite(w,L)===1 && typeof (L.termes||[])[0]==="string");
  // Le bloc qui clôt sur une citation, s'il existe.
  const blocCite = w => (J(w).grammaire.blocs||[]).find(b=>b.cite && b.forme);
  /* La liste d'attentes CÔTÉ CONTENU : les objets rendus sont ceux du contenu,
     pour qu'une suite les retouche avant le boot. */
  const attentesContenu = r => Array.isArray(r.attentes) ? r.attentes : [r];

  // --- composer : le geste du jeu, joué par les fonctions du moteur ---
  const idBloc = (w,id) => w.R.blocsOfferts(w.S).findIndex(b=>b.id===id);
  /* Le TERME QUI PREND UN EMPAN, parmi les blocs offerts — le calcul vit dans
     regles.js (§16). À ne pas confondre : le second empan porte en plus `deduit`,
     et `blocChamp` cherche un ID de bloc, pas un rang. */
  const iTermeChamp = w => w.R.indexTermeChamp(w.S);
  /* Défaire une clé « pid.eid », comme le `deK` de l'atelier : on coupe au
     PREMIER point — c'est le pid qui ne peut pas en contenir, pas l'eid. */
  const deK = k => { const s=String(k), i=s.indexOf("."); return i<0 ? [s,""] : [s.slice(0,i), s.slice(i+1)]; };
  const surligner = (w,k) => { const [pid,eid]=deK(k); if(!w.S.retenus.includes(k)) w.surligner(pid,eid); };
  const iRetenu = (w,k) => w.S.retenus.indexOf(k);

  /* Compose la phrase qui réalise un lien : surligner, puis parcourir l'automate
     vers la forme voulue. Rend l'index au brouillon, ou -1. */
  function composerLien(w,L){
    const f=(J(w).grammaire.formes||{})[L.forme]||{};
    w.viderCompo();
    const trouve = () => w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,{forme:L.forme,termes:L.termes}));

    if((f.arite||2)===1){
      const sous=(L.termes||[])[0]||{};
      /* 0) LA CITATION (§4.5) : un empan, clos par une liaison qui n'emboîte
            rien — pas d'article, il n'y a pas de raisonnement à fonder. */
      if(typeof (L.termes||[])[0]==="string"){
        const k=(L.termes||[])[0];
        surligner(w,k);
        const bT=idBloc(w,blocChamp(w)); if(bT<0) return -1;
        w.poserBloc(bT,iRetenu(w,k));
        /* L'automate a pu se refermer tout seul : une suite unique n'est pas un
           choix (§4.5). Là où le choix existe encore, la liaison se pose. */
        const deja=trouve(); if(deja>=0) return deja;
        const bc=w.R.blocsOfferts(w.S).findIndex(x=>x.forme===L.forme && !x.imbrique);
        if(bc<0) return -1;
        w.poserBloc(bc);
        return trouve();
      }
      /* 1) LA CONTINUATION (§4.5) : poser la comparaison sans la clore, puis
            la liaison qui l'emboîte — le chemin du contenu d'aujourd'hui. */
      if(sous.forme && poserComparaison(w,sous)){
        const b=w.R.blocsOfferts(w.S).findIndex(x=>x.forme===L.forme && x.imbrique);
        if(b>=0){ w.poserBloc(b); const i=trouve(); if(i>=0) return i; }
      }
      /* 2) LE REPLI : la source `note`, pour une affaire écrite avant la
            continuation. C'est ce qui prouve la rétrocompatibilité (§11). */
      w.viderCompo();
      let i=w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,sous));
      if(i<0){ i=composerLien(w,{forme:sous.forme,termes:sous.termes}); if(i<0) return -1; }
      const b=idBloc(w,blocNote(w)); if(b<0) return -1;
      w.poserBloc(b,i);
      const deja=trouve(); if(deja>=0) return deja;   // refermé tout seul (§4.5)
      const bl=idBloc(w,blocForme(w,L.forme)); if(bl<0) return -1;
      w.poserBloc(bl);
    } else {
      if(!poserComparaison(w,L)) return -1;
      cloreSurPlace(w);
    }
    return trouve();
  }
  /* Les deux termes d'une forme d'arité 2, SANS chercher à clore : selon la
     grammaire, on finit à la fin (à l'ancienne) ou sur « et donc ? » (§4.5). */
  function poserComparaison(w,L){
    const G=J(w).grammaire;
    const [t0,t1]=L.termes||[];
    if(typeof t0!=="string" || typeof t1!=="string") return false;
    surligner(w,t0); surligner(w,t1);
    const bT=idBloc(w,blocChamp(w)); if(bT<0) return false;
    /* Une SONDE : en session 1, poser le premier terme suffit à clore une
       citation (§4.5) — et une sonde qui échoue ne laisse rien au journal. */
    const n0=w.S.brouillon.length, p0=w.S.prete;
    const echec=()=>{ w.S.brouillon.length=n0; w.S.prete=p0; w.viderCompo(); return false; };
    w.poserBloc(bT,iRetenu(w,t0));
    // Grammaire à DÉDUCTION : le second terme clôt la paire, rien entre les deux.
    const bD=w.R.blocsOfferts(w.S).findIndex(x=>x.type==="terme"&&x.source!=="note"&&x.deduit);
    if(bD>=0){ w.poserBloc(bD,iRetenu(w,t1)); return true; }
    // Grammaire à liaisons explicites (à l'ancienne) : on parcourt l'automate.
    const chemin=cheminVers(w,L.forme);
    if(!chemin.length) return echec();
    for(const etape of chemin){
      const b=idBloc(w,etape); if(b<0) return echec();
      const bloc=G.blocs.find(x=>x.id===etape);
      w.poserBloc(b, bloc.type==="terme" ? iRetenu(w,t1) : undefined);
    }
    return true;
  }
  /* Fait partir toutes les remises sans jouer l'instruction : les
     liaisons-articles étant filtrées par livraison (§4.5), une suite qui compose
     une conclusion doit d'abord avoir reçu le texte. */
  function livrerTout(w){
    let garde=0;
    while(w.S.remisesEnvoyees < J(w).remises.length && garde++<20) w.R.envoyerRemise(w.S);
    w.rendreTout();
  }
  /* « En rester là » : le bloc qui clôt sans rien qualifier. Sans effet si
     l'automate a déjà refermé la phrase tout seul. */
  function cloreSurPlace(w){
    if(!w.S.compo.length) return;
    const G=J(w).grammaire, e=w.R.etatCompo(w.S), finaux=new Set(G.finaux||[]);
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
    const file=[[w.R.etatCompo(w.S),[]]], vus=new Set();
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
    const livrees=new Set(w.R.piecesLivrees(w.S));
    return (J(w).grammaire.blocs||[]).filter(b=>b.imbrique && b.forme && (!b.piece || livrees.has(b.piece)));
  };
  /* Des phrases sensées qui ne portent AUCUN lien : la marge de bruit — une
     comparaison quelconque QUALIFIÉE par un article quelconque, bien formée,
     fondée, sans intérêt. « Sensé » ne doit jamais valoir « correct » (§14). */
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
    /* Chaque empan est à lui seul une phrase close possible : elle ne se fonde
       que sur elle-même, donc ne sert pas à chercher — mais compte dans la
       marge (§4.5). */
    const bc=blocCite(w);
    if(bc) for(let i=0;i<emp.length&&fait<n;i++){
      const cand={forme:bc.forme,termes:[emp[i].id]};
      if(J(w).liens.some(L=>w.M.memeRed({forme:L.forme,termes:L.termes},cand))) continue;
      if(w.S.brouillon.some(x=>w.M.memeRed(x.reduite,cand))) continue;
      if(composerLien(w,cand)>=0) fait++;
    }
    return fait;
  }

  // Pièces, par leur forme
  /* La famille fenêtre passe par `surContenu` là où la question est la même :
     `J(w)` EST un contenu (`surContenu` est déclaré plus bas — ces flèches ne
     s'évaluent qu'à l'appel). */
  const pidAvecDeclenche = w => surContenu.pidDeclenche(J(w));
  const pidRegle = w => surContenu.pidRegle(J(w));
  const pidPremiereRemise = w => (J(w).remises[0].pieces||[])[0];
  const empansDe = (w,pid) => Object.keys(J(w).pieces[pid].empans||{}).map(e=>pid+"."+e);

  /* Amène le jeu au bout de l'instruction : pour chaque session, compose et
     verse la phrase qui porte le tag attendu. C'est le chemin docile. */
  function instruire(w){
    let garde=0;
    while(garde++<40){
      // Une remise attend une SUITE de réponses (§3). La normalisation vit
      // dans regles.js, en un seul exemplaire : on l'appelle, on ne la recopie
      // pas — une affaire à l'ancienne y devient une liste à un élément.
      const r=w.R.remiseCourante(w.S);
      const a=w.R.attenteCourante(w.S,r);
      if(!a) break;
      const L=lienTag(w,a.attend);
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
    empans: c => champsDe(c),
    dim: (c,k) => { const [pid,eid]=deK(k); return ((c.pieces[pid]||{}).empans||{})[eid]?.dim; },
    // Le lien qui PORTE le vice : la conclusion, depuis que l'article est
    // obligatoire ; le pressentiment nu si l'affaire l'expose encore.
    iLienVice: c => { const i=c.liens.findIndex(estViceNu);
                      return i>=0 ? i : c.liens.findIndex(estVice); },
    iLienConclusion: c => c.liens.findIndex(estConclusion),
    // La comparaison du vice, où qu'elle vive : lien nu, ou terme emboîté.
    sousVice: c => { const L=c.liens.find(estConclusion) || c.liens.find(estVice);
                     return L ? (sousTerme(L) || L) : null; },
    iLienNeutre: c => c.liens.findIndex(estNeutre),
    pidDeclenche: c => Object.keys(c.pieces).find(p=>aDeclenche(c.pieces[p])),
    pidRegle: c => Object.keys(c.pieces).find(p=>estRegle(c.pieces[p])),
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

  return { check, bilan, boot, bootAtelier, contenuLivre, estRegle,
           discussion, memoire, composeur, plaidoirie, plaidoirieVisible,
           lienVice, lienConclusion, lienFaux, lienTag, liensNeutres, comparaisons, arite,
           citations, blocCite, attentesContenu,
           cloreSurPlace, poserComparaison, livrerTout,
           surligner, iRetenu, iTermeChamp, deK, composerLien, phrasesBruit, cheminVers,
           blocChamp, blocNote, blocForme, idBloc, articlesDisponibles,
           pidAvecDeclenche, pidRegle, pidPremiereRemise, empansDe,
           instruire, terminer, numeroFin, surContenu };
}
module.exports = { creerHarnais };

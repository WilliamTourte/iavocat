// Harnais commun des suites — jsdom, un seul endroit pour booter le jeu et
// l'atelier. Chaque suite garde ses assertions ; ici, que la tuyauterie.
// Moteur et règles viennent des MÊMES fichiers que le jeu : une suite DÉSIGNE,
// elle ne DÉCIDE pas — un prédicat recopié resterait vert en affirmant
// l'ancienne vérité (§12, §16).
const { JSDOM } = require("jsdom");
const fs = require("fs");
const { champsDe, comparaisonsDe } = require("../app/moteur.js");
const { estRegle } = require("../app/regles.js");

function creerHarnais(dossier){
  const htmlJeu = fs.readFileSync(dossier + "/index.html", "utf8");
  const lire = f => fs.readFileSync(dossier + "/" + f, "utf8");
  let htmlAtelier = null;   // lu paresseusement (toutes les suites n'en ont pas besoin)
  let pass=0, fail=0;

  function check(l,c){ if(c){pass++;console.log("  ok — "+l);} else {fail++;console.log("  ÉCHEC — "+l);} }
  function bilan(){ console.log(`\n${pass} ok, ${fail} échec(s)`); process.exit(fail?1:0); }

  const injecter = h => h
    .replace(/<script src="([^"]+)"><\/script>/g, (_, f) => `<script>${lire(f)}</script>`)
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, f) => `<style>${lire(f)}</style>`);

  /* boot({contenu, graine, url}) — contenu : objet → injecté à la place de
     content.js, null → balise retirée (le jeu affiche sa panne), absent → le
     contenu livré ; graine : semée dans localStorage AVANT les scripts ; url :
     origine, posée d'office si graine. */
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
    return ouvrir(htmlAtelier, opts.url || "http://localhost/", opts.graine);
  }
  function contenuLivre(){ return JSON.parse(JSON.stringify(boot().JEU)); }

  const discussion = w => w.document.getElementById("discussion").textContent;
  const memoire  = w => w.document.getElementById("memoire").innerHTML;
  const composeur = w => w.document.getElementById("composeur").innerHTML;
  const plaidoirie = w => w.document.getElementById("plaidoirie").innerHTML;
  const plaidoirieVisible = w => !w.document.getElementById("colPlaidoirie").hidden;

  /* ---- Sélecteurs par PROPRIÉTÉ ---- aucune suite ne nomme une pièce, un
     empan ni une valeur : tout se dérive de la forme (§16). */
  const J = w => w.JEU;

  const estVice       = L => !!L.vice;
  const estConclusion = L => !!(L.vice && L.conclusion);
  const estViceNu     = L => !!(L.vice && !L.conclusion);
  const estFaux       = L => !!L.faux;
  const estNeutre     = L => !L.vice && !L.faux;
  const aDeclenche    = p => !!p.declenche;
  const sousTerme = L => { const t = L && (L.termes||[])[0];
                           return (t && typeof t === "object") ? t : null; };

  const lienVice = w =>
    J(w).liens.find(estViceNu) || sousTerme(lienConclusion(w)) || undefined;
  const lienConclusion = w => J(w).liens.find(estConclusion);
  const lienFaux       = w => J(w).liens.find(estFaux);
  const lienTag = (w,tag,{docile=true}={}) => {
    const cands=J(w).liens.filter(L=>L.tag===tag);
    return (docile ? cands.find(L=>!estVice(L)) : cands.find(estVice)) || cands[0];
  };
  const liensNeutres   = w => J(w).liens.filter(estNeutre);
  const comparaisons = w => comparaisonsDe(J(w).liens, J(w).grammaire.formes);
  const arite = (w,L) => ((J(w).grammaire.formes||{})[L.forme]||{}).arite || 2;
  const citations = w => J(w).liens.filter(L =>
    arite(w,L)===1 && typeof (L.termes||[])[0]==="string");
  const blocCite = w => (J(w).grammaire.blocs||[]).find(b=>b.cite && b.forme);
  const attentesContenu = r => Array.isArray(r.attentes) ? r.attentes : [r];

  // --- composer : le geste du jeu, joué par les fonctions du moteur ---
  const idBloc = (w,id) => w.R.blocsOfferts(w.S).findIndex(b=>b.id===id);
  /* PIÈGE : le second empan porte en plus `deduit`, et `blocChamp` cherche un
     ID de bloc, pas un rang. */
  const iTermeChamp = w => w.R.indexTermeChamp(w.S);
  const deK = k => { const s=String(k), i=s.indexOf("."); return i<0 ? [s,""] : [s.slice(0,i), s.slice(i+1)]; };
  const surligner = (w,k) => { const [pid,eid]=deK(k); if(!w.S.retenus.includes(k)) w.surligner(pid,eid); };
  const iRetenu = (w,k) => w.S.retenus.indexOf(k);

  function composerLien(w,L){
    const f=(J(w).grammaire.formes||{})[L.forme]||{};
    w.viderCompo();
    /* POSER NE CLÔT PLUS (§4.5) : une suite qui veut la phrase AU JOURNAL sans
       l'envoyer passe par `clore`, la même porte un cran plus tôt (§12). */
    const journaliser = () => {
      if(!w.S.compo.length) return;
      w.R.clore(w.S);
      // PIÈGE : `clore` ne redessine pas, donc ne SAUVE pas — la sauvegarde est
      // un effet du rendu. Sans ça, on éprouve un état injouable.
      w.rendreTout();
    };
    const trouve = () => { journaliser();
      return w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,{forme:L.forme,termes:L.termes})); };

    if((f.arite||2)===1){
      const sous=(L.termes||[])[0]||{};
      /* 0) LA CITATION : un empan, clos par une liaison qui n'emboîte rien. */
      if(typeof (L.termes||[])[0]==="string"){
        const k=(L.termes||[])[0];
        surligner(w,k);
        const bT=idBloc(w,blocChamp(w)); if(bT<0) return -1;
        w.poserBloc(bT,iRetenu(w,k));
        const bc=w.R.blocsOfferts(w.S).findIndex(x=>x.forme===L.forme && !x.imbrique);
        if(bc>=0) w.poserBloc(bc);
        return trouve();
      }
      /* 1) LA CONTINUATION : la comparaison, puis la liaison qui l'emboîte. */
      if(sous.forme && poserComparaison(w,sous)){
        const b=w.R.blocsOfferts(w.S).findIndex(x=>x.forme===L.forme && x.imbrique);
        if(b>=0){ w.poserBloc(b); const i=trouve(); if(i>=0) return i; }
      }
      /* 2) LE REPLI `note` : la rétrocompatibilité, éprouvée (§11). */
      w.viderCompo();
      let i=w.S.brouillon.findIndex(n=>w.M.memeRed(n.reduite,sous));
      if(i<0){ i=composerLien(w,{forme:sous.forme,termes:sous.termes}); if(i<0) return -1; }
      const b=idBloc(w,blocNote(w)); if(b<0) return -1;
      w.poserBloc(b,i);
      const bl=idBloc(w,blocForme(w,L.forme));
      if(bl>=0) w.poserBloc(bl);
    } else {
      if(!poserComparaison(w,L)) return -1;
      cloreSurPlace(w);
    }
    return trouve();
  }
  function poserComparaison(w,L){
    const G=J(w).grammaire;
    const [t0,t1]=L.termes||[];
    if(typeof t0!=="string" || typeof t1!=="string") return false;
    surligner(w,t0); surligner(w,t1);
    const bT=idBloc(w,blocChamp(w)); if(bT<0) return false;
    const n0=w.S.brouillon.length, p0=w.S.prete;
    const echec=()=>{ w.S.brouillon.length=n0; w.S.prete=p0; w.viderCompo(); return false; };
    w.poserBloc(bT,iRetenu(w,t0));
    const bD=w.R.blocsOfferts(w.S).findIndex(x=>x.type==="terme"&&x.source!=="note"&&x.deduit);
    if(bD>=0){ w.poserBloc(bD,iRetenu(w,t1)); return true; }
    const chemin=cheminVers(w,L.forme);
    if(!chemin.length) return echec();
    for(const etape of chemin){
      const b=idBloc(w,etape); if(b<0) return echec();
      const bloc=G.blocs.find(x=>x.id===etape);
      w.poserBloc(b, bloc.type==="terme" ? iRetenu(w,t1) : undefined);
    }
    return true;
  }
  function livrerTout(w){
    let garde=0;
    while(w.S.remisesEnvoyees < J(w).remises.length && garde++<20) w.R.envoyerRemise(w.S);
    w.rendreTout();
  }
  function cloreSurPlace(w){
    if(!w.S.compo.length) return;
    const G=J(w).grammaire, e=w.R.etatCompo(w.S), finaux=new Set(G.finaux||[]);
    const b=G.blocs.find(x=>x.de===e && finaux.has(x.vers) && !x.forme && !x.imbrique);
    if(b) w.poserBloc(idBloc(w,b.id));
  }
  const blocChamp = w => (J(w).grammaire.blocs.find(b=>b.type==="terme"&&b.source!=="note"&&b.de===J(w).grammaire.depart)||{}).id;
  const blocNote  = w => (J(w).grammaire.blocs.find(b=>b.type==="terme"&&b.source==="note"&&b.de===J(w).grammaire.depart)||{}).id;
  const blocForme = (w,forme) => (J(w).grammaire.blocs.find(b=>b.forme===forme)||{}).id;
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
  const articlesDisponibles = w => {
    const livrees=new Set(w.R.piecesLivrees(w.S));
    return (J(w).grammaire.blocs||[]).filter(b=>b.imbrique && b.forme && (!b.piece || livrees.has(b.piece)));
  };
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
        let nomForme;
        if(deduction) nomForme=w.M.deduire(a.id,b.id);
        else { nomForme=forme2[0];
               if(!G.formes[nomForme].slots[0].includes(a.dim)) continue; }
        if(!nomForme) continue;
        const termes=w.M.ordonner ? w.M.ordonner(nomForme,[a.id,b.id]) : [a.id,b.id];
        const comparaison={forme:nomForme,termes};
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
    const bc=blocCite(w);
    if(bc) for(let i=0;i<emp.length&&fait<n;i++){
      const cand={forme:bc.forme,termes:[emp[i].id]};
      if(J(w).liens.some(L=>w.M.memeRed({forme:L.forme,termes:L.termes},cand))) continue;
      if(w.S.brouillon.some(x=>w.M.memeRed(x.reduite,cand))) continue;
      if(composerLien(w,cand)>=0) fait++;
    }
    return fait;
  }

  const pidAvecDeclenche = w => surContenu.pidDeclenche(J(w));
  const pidRegle = w => surContenu.pidRegle(J(w));
  const pidPremiereRemise = w => (J(w).remises[0].pieces||[])[0];
  const empansDe = (w,pid) => Object.keys(J(w).pieces[pid].empans||{}).map(e=>pid+"."+e);

  function instruire(w){
    let garde=0;
    while(garde++<40){
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

  function terminer(w){
    w.cloturer();
    // GARDE : clôture qui ne s'ouvre pas (article livré trop tard…) →
    // `repetitionIdx` reste à -1. Rendre "" plutôt que tourner en rond.
    let garde=0;
    while(w.S.repetitionIdx >= 0
          && w.S.repetitionIdx < J(w).repetition.affirmations.length
          && garde++ < 50) w.avancerRepetition();
    w.cloturer();
    const f=w.document.querySelector(".fin");
    return f ? f.textContent : "";
  }
  const numeroFin = txt => (txt.match(/Fin (\d)/)||[])[1];

  const surContenu = {
    empans: c => champsDe(c),
    dim: (c,k) => { const [pid,eid]=deK(k); return ((c.pieces[pid]||{}).empans||{})[eid]?.dim; },
    iLienVice: c => { const i=c.liens.findIndex(estViceNu);
                      return i>=0 ? i : c.liens.findIndex(estVice); },
    iLienConclusion: c => c.liens.findIndex(estConclusion),
    sousVice: c => { const L=c.liens.find(estConclusion) || c.liens.find(estVice);
                     return L ? (sousTerme(L) || L) : null; },
    iLienNeutre: c => c.liens.findIndex(estNeutre),
    pidDeclenche: c => Object.keys(c.pieces).find(p=>aDeclenche(c.pieces[p])),
    pidRegle: c => Object.keys(c.pieces).find(p=>estRegle(c.pieces[p])),
    pidAutreQue: (c,pid) => Object.keys(c.pieces).find(p=>p!==pid),
    unEmpan: c => surContenu.empans(c)[0],
    deuxEmpansDiff: c => {
      const t=surContenu.empans(c);
      for(let i=0;i<t.length;i++) for(let k=i+1;k<t.length;k++)
        if(t[i].dim!==t[k].dim) return [t[i],t[k]];
    }
  };

  return { check, bilan, boot, bootAtelier, contenuLivre, estRegle,
           discussion, memoire, composeur, plaidoirie, plaidoirieVisible,
           lienVice, lienConclusion, lienFaux, lienTag, sousTerme, liensNeutres, comparaisons, arite,
           citations, blocCite, attentesContenu,
           cloreSurPlace, poserComparaison, livrerTout,
           surligner, iRetenu, iTermeChamp, deK, composerLien, phrasesBruit, cheminVers,
           blocChamp, blocNote, blocForme, idBloc, articlesDisponibles,
           pidAvecDeclenche, pidRegle, pidPremiereRemise, empansDe,
           instruire, terminer, numeroFin, surContenu };
}
module.exports = { creerHarnais };

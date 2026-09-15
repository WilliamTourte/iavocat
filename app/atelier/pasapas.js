/* ATELIER — LE PAS-À-PAS : la simulation du déroulé. */
/* 8) ÉTAPES — B. LE PAS-À-PAS. Il APPELLE les mêmes fonctions que le jeu, sur le
   même état : il ne peut pas dériver (§12). Deux écarts assumés — il joue au
   grain du LIEN plutôt que bloc à bloc, et il narre ses gestes privés. */
let SIM=null, SIMACT=[];
let _rg=null, _rgSig=null;
function RG(){
  const m=MG(); if(!m) return null;
  const sig=JSON.stringify([CONTENU.grammaire,CONTENU.pieces,CONTENU.liens,CONTENU.remises,CONTENU.repetition,CONTENU.avocat,CONTENU.fins]);
  if(!_rg || _rgSig!==sig){ _rg=window.ReglesJeu.creerRegles(CONTENU,m); _rgSig=sig; }
  return _rg;
}
function simReset(){
  const R=RG();
  SIM = R ? R.etatInitial() : { fil:[], brouillon:[], retenus:[], plaidoirie:[] };
  SIM.finie=null;                   // propre à l'atelier : la fin retenue
  window.SIM=SIM;                   // exposé pour la console et les tests
  if(R) R.envoyerRemise(SIM);       // la session 1 part au démarrage
  renderEtapes();
}
function simMsg(m){ SIM.fil.push(m); }
function simLivrees(){ const R=RG(); return new Set(R?R.piecesLivrees(SIM):[]); }
function simPhase(){
  const R=RG();
  if(SIM.finie) return "terminée";
  if(!SIM.clotureDemandee) return "instruction";
  return (R && R.repetitionEnCours(SIM)) ? "repetition" : "confirmation";
}
const simFauxPlaide = () => SIM.brouillon.some(n=>n.versee && n.lien && n.lien.faux);
function simTag(L){
  return L.vice?{t:"⚑",c:"v",title:L.conclusion?"la conclusion du vice":"le vice (pressentiment)"}
       : L.faux?{t:"✗",c:"f",title:"le faux vice"}
       : !lienSense(L)?{t:"∅",c:"n",title:"phrase refusée à la composition"}:null;
}
function simComposable(L){
  const f=formeDe(L.forme)||{};
  if((f.arite||2)===1){
    const sous=(L.termes||[])[0];
    const bloc=(CONTENU.grammaire.blocs||[]).find(b=>b.forme===L.forme);
    if(bloc && bloc.piece && !simLivrees().has(bloc.piece)) return false;
    if(typeof sous==="string") return SIM.retenus.includes(sous);
    if(!sous || typeof sous!=="object") return false;
    return feuillesLien(sous).every(k=>SIM.retenus.includes(k))
        || SIM.brouillon.some(n=>n.reduite && memeReduite(n.reduite,sous));
  }
  return feuillesLien(L).every(k=>SIM.retenus.includes(k));
}
const memeReduite = (a,b) => { const m=MG(); return !!m && m.memeRed(a,b); };
function simSurligner(k){
  const [pid,eid]=deK(k);
  const avant=SIM.retenus.includes(k);
  RG().surligner(SIM,pid,eid);
  simMsg({sys:true,texte:avant?`oublie ${cflabel(k)}.`
                             :`surligne ${cflabel(k)} — retenu, privé. Rien ne part.`});
  renderEtapes();
}
function simComposer(i){
  const L=CONTENU.liens[i];
  RG().clorePhrase(SIM,{forme:L.forme,termes:clone(L.termes||[])},labelLien(L));
  simMsg({sys:true,texte:`écrit : ${labelLien(L)} — elle attend sur place, privée. Rien ne part.`});
  renderEtapes();
}
function sousComparaisons(){
  const api=window.MoteurGrammaire;
  return api ? api.comparaisonsDe(CONTENU.liens,(CONTENU.grammaire||{}).formes) : [];
}
function simComparer(r){
  RG().pressentir(SIM,r);
  simMsg({sys:true,texte:`compare : ${labelLien(r)} — sous les yeux, sans texte. Rien ne part.`});
  renderEtapes();
}
function simEnvoyer(ni,contre){
  RG().envoyer(SIM,ni,contre);
  renderEtapes();
}
function simOuvrir(pid){
  const R=RG();
  simMsg({sys:true,texte:`ouvre « ${courtDe(pid)} ».`});
  R.ouvrirPiece(SIM,pid);          // la vue, et son `declenche` éventuel
  renderEtapes();
}
const simInstructionComplete = () => RG().instructionComplete(SIM);
function simCloturer(){
  RG().cloturer(SIM);
  if(!SIM.brouillon.length) simMsg({sys:true,texte:"présentoir : aucune phrase écrite à y opposer."});
  renderEtapes();
}
function simAvancer(){ RG().avancerRepetition(SIM); renderEtapes(); }
function simPresenter(ni){ RG().verserContre(SIM,ni); renderEtapes(); }
function simConfirmer(){ SIM.finie = String(RG().finir(SIM).numero); renderEtapes(); }
function simDo(k){ const a=SIMACT[k]; if(a) a.f(); }

function simActions(){
  const A=[];
  if(!SIM || SIM.finie || !RG()) return A;
  const livrees=simLivrees(), phase=simPhase();

  if(phase==="instruction")
    for(const pid of livrees) if(!SIM.examinees.includes(pid))
      A.push({t:`Ouvrir « ${courtDe(pid)} »`, cls:"ghost", f:()=>simOuvrir(pid)});

  for(const e of empansPlats()){
    if(!livrees.has(e.pid) || SIM.retenus.includes(e.id)) continue;
    A.push({t:`Surligner : ${cflabel(e.id)} — « ${String(e.texte||"").slice(0,42)} »`, cls:"ghost", f:()=>simSurligner(e.id)});
  }
  for(const r of sousComparaisons()){
    if(!feuillesLien(r).every(k=>SIM.retenus.includes(k))) continue;
    A.push({t:`Comparer (sans qualifier) : ${labelLien(r)}`, cls:"ghost", f:()=>simComparer(r)});
  }
  (CONTENU.liens||[]).forEach((L,i)=>{
    const deja=SIM.brouillon.some(n=>memeReduite(n.reduite,{forme:L.forme,termes:L.termes||[]}));
    if(deja || !simComposable(L)) return;
    const cite=(formeDe(L.forme)||{}).arite===1 && typeof (L.termes||[])[0]==="string";
    A.push({t:`${cite?"Répondre (citer)":"Composer"} : ${labelLien(L)}`, tag:simTag(L), f:()=>simComposer(i)});
  });
  if(phase!=="repetition")
    SIM.brouillon.forEach((n,ni)=>{
      if(n.versee) return;
      A.push({t:`Envoyer → Maître Auber : ${n.texte}`, tag:n.lien?simTag(n.lien):null, f:()=>simEnvoyer(ni)});
    });

  if(phase==="instruction" && simInstructionComplete())
    A.push({t:"Clôturer l'instruction", cls:"primary", f:simCloturer});
  if(phase==="repetition"){
    A.push({t:"Laisser passer l'affirmation", cls:"primary", f:simAvancer});
    SIM.brouillon.forEach((n,ni)=>{
      A.push({t:`Opposer : ${n.texte}`, tag:n.lien?simTag(n.lien):null, f:()=>simPresenter(ni)});
    });
  }
  if(phase==="confirmation")
    A.push({t:"Confirmer la clôture → le procès (hors-champ)", cls:"primary", f:simConfirmer});
  return A;
}

function renderSim(){
  const fil=$("simfil"); if(!fil||!SIM) return;
  let h="";
  for(const m of SIM.fil){
    if(m.sys) h+=`<div class="sys">· ${escapeH(m.texte)}</div>`;
    else if(m.ia) h+=`<div class="sbub ia"><div class="swho">IA (toi) — transmis à Maître Auber</div>${escapeH(m.texte)}</div>`;
    else h+=`<div class="sbub"><div class="swho">${escapeH(m.qui||"Maître Auber")}</div>${escapeH(m.texte)}
      ${(m.pieces||[]).map(p=>`<span class="satt">📎 ${escapeH(courtDe(p))}</span>`).join("")}</div>`;
  }
  const faux=simFauxPlaide();
  if(SIM.finie){
    const f=(CONTENU.fins||{})[SIM.finie]||{};
    h+=`<div class="simfin"><h4>${escapeH(f.titre||("Fin "+SIM.finie))}</h4>
      <div class="v">${escapeH(f.verdict||"")}</div>
      <div>${escapeH(f.texte||"")}</div>
      ${faux&&f.variante_faux?`<div style="margin-top:6px;color:var(--warn)">${escapeH(f.variante_faux)}</div>`:''}</div>`;
  }
  fil.innerHTML=h;
  fil.scrollTop=fil.scrollHeight;

  const R=RG();
  const prev = SIM.vice_trouve ? (SIM.vice_expose ? 1 : 2) : 3;
  const auPlan = R ? SIM.plaidoirie.filter(x=>SIM.brouillon[x.b] && R.estMoyen(SIM.brouillon[x.b].lien)).length : 0;
  $("simflags").innerHTML=
    `<span class="flagpill">retenus : ${SIM.retenus.length}</span>
     <span class="flagpill" title="le journal des phrases closes — sans zone à lui">écrites : ${SIM.brouillon.length}</span>
     <span class="flagpill prev" title="le plan ne retient que les moyens">plan : ${auPlan}</span>
     <span class="flagpill ${SIM.vice_pressenti?'on':''}" title="la comparaison ⚑ s'est formée">vice_pressenti : ${SIM.vice_pressenti}</span>
     <span class="flagpill ${SIM.vice_trouve?'on':''}" title="la conclusion ⚑ est composée">vice_trouve : ${SIM.vice_trouve}</span>
     <span class="flagpill ${SIM.vice_expose?'on':''}" title="la conclusion ⚑ est envoyée">vice_expose : ${SIM.vice_expose}</span>
     <span class="flagpill ${faux?'on':''}">faux envoyé : ${faux}</span>
     <span class="flagpill">phase : ${simPhase()}</span>
     <span class="flagpill prev" title="vice_trouve ? (vice_expose ? 1 : 2) : 3">${SIM.finie?'→ Fin '+SIM.finie:'si clôture maintenant → Fin '+prev}</span>`;

  SIMACT=simActions();
  $("simactions").innerHTML = SIMACT.length
    ? `<div class="actlbl">Actions possibles</div>`+SIMACT.map((a,k)=>
        `<button class="act ${a.cls||''}" onclick="simDo(${k})">
          ${a.tag?`<span class="tag ${a.tag.c}" title="${escapeAttr(a.tag.title)}">${a.tag.t}</span>`:''}
          <span>${escapeH(a.t)}</span></button>`).join("")
    : `<div class="actlbl">Partie terminée — ↺ Recommencer pour rejouer un autre chemin.</div>`;
}

function renderEtapes(){ renderFrise(); renderSim(); }


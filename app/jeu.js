/* LE JEU — L'ÉCRAN ET LES GESTES. Chargé par <script src> APRÈS moteur.js,
   regles.js et content.js, en portée globale classique (§9).
   IL NE DÉCIDE RIEN : ce qui REDESSINE est une fonction d'ici — `R.x(S,…)` puis
   `rendreTout()` ; ce qui LIT s'écrit `R.x(S)` sur place (§12). */

/* 1) LE CONTENU — content.js, et lui seul (§12) : absent ou d'un schéma inconnu,
      on le dit au lieu de jouer autre chose (§13). */
function contenuValide(c){
  return !!( c && typeof c==="object" && (c.schema||0)>=3
    && c.pieces && typeof c.pieces==="object"
    && Array.isArray(c.dimensions)
    && c.grammaire && Array.isArray(c.grammaire.blocs) && c.grammaire.formes
    && Array.isArray(c.liens) && Array.isArray(c.remises)
    && c.repetition && Array.isArray(c.repetition.affirmations)
    && c.avocat && c.fins );
}
const CONTENU_ABSENT = { schema:3, dimensions:[], pieces:{},
  grammaire:{ depart:"S0", finaux:[], blocs:[], formes:{} },
  liens:[], remises:[], repetition:{ affirmations:[] }, avocat:{}, fins:{} };
const CONTENU_OK = contenuValide(window.CONTENU);
const JEU = CONTENU_OK ? window.CONTENU : CONTENU_ABSENT;
const SOURCE_CONTENU = CONTENU_OK ? "contenu : content.js" : "contenu introuvable";
if(!CONTENU_OK){
  const pourquoi = !window.CONTENU
    ? "content.js n'a pas été chargé. Le fichier doit rester à côté de index.html."
    : (window.CONTENU.schema||0) < 3
      ? "content.js est en schéma "+(window.CONTENU.schema||"?")+" ; ce moteur attend le schéma 3 (empans + grammaire). Repasser par l'atelier : la migration y est automatique à l'import."
      : "content.js est présent mais invalide : une clé vitale manque. Repasser par l'atelier.";
  console.warn("IAvocat : "+pourquoi);
  document.body.insertAdjacentHTML("afterbegin",`<div class="panne">${pourquoi}</div>`);
}
if(CONTENU_OK && (JEU.schema||0) > 3)
  console.warn(`IAvocat : content.js de schéma ${JEU.schema}, ce moteur connaît le schéma 3 — certaines clés seront ignorées. Mettre index.html à jour.`);

/* 2) LA GRAMMAIRE — `MoteurAPI` est le MODULE, `M` l'instance liée à l'affaire ;
      `CHAMPS` est l'argument qu'attend `creerMoteur` (§14). */
const $ = id => document.getElementById(id);
const MoteurAPI = window.MoteurGrammaire || {};
const CHAMPS = MoteurAPI.champsDe ? MoteurAPI.champsDe(JEU) : [];
const M = MoteurAPI.creerMoteur
        ? MoteurAPI.creerMoteur(JEU.grammaire, CHAMPS, JEU.liens)
        : null;
if(!M){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">moteur.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
const EMPAN = Object.fromEntries(CHAMPS.map(c=>[c.id,c]));
/* Par RANG, jamais par pertinence (§4.3) ; ici, le repli seul. */
const couleurDim = d =>
  (MoteurAPI.couleurDim ? MoteurAPI.couleurDim(JEU.dimensions,d) : null) || "var(--muted)";

/* 3) L'ÉTAT ET LES RÈGLES — tout ce qui décide vit dans regles.js. */
const R = (window.ReglesJeu||{}).creerRegles
        ? window.ReglesJeu.creerRegles(JEU, M)
        : null;
if(!R){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">regles.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
let S = R.etatInitial();

/* ---- Sauvegarde de partie — de l'écran, pas de la règle ---- */
const CLE_PARTIE="iavocat_partie";
function sauverPartie(){
  try{ localStorage.setItem(CLE_PARTIE,JSON.stringify({...S,modalPiece:null,sig:R.signatureContenu()})); }catch(e){}
}
function restaurerPartie(){
  try{
    const brut=localStorage.getItem(CLE_PARTIE); if(!brut) return false;
    const d=JSON.parse(brut);
    if(d.sig!==R.signatureContenu()){ localStorage.removeItem(CLE_PARTIE); return false; }
    /* PIÈGE : la signature ne protège pas d'un renommage d'état. `S.memoire`
       est devenu `S.retenus` ; sans cette reprise, une partie d'avant revenait
       vide de passages, sans un mot. */
    if(d.retenus===undefined && Array.isArray(d.memoire)) d.retenus=d.memoire;
    delete d.memoire;
    delete d.sig; Object.assign(S,d); return true;
  }catch(e){ return false; }
}
function effacerPartie(){ try{ localStorage.removeItem(CLE_PARTIE); }catch(e){} }
let confirmRecommencer=false;
function recommencer(){
  const b=$("btnRecommencer");
  if(!confirmRecommencer){
    confirmRecommencer=true;
    if(b) b.textContent="tout effacer ?";
    setTimeout(()=>{ confirmRecommencer=false; if(b) b.textContent="⟲ recommencer"; },2500);
    return;
  }
  effacerPartie(); effacerTuto(); location.reload();
}

/* ---- Le tutoriel du premier geste (§4.8) — de l'écran, pas de la règle ----
   Son temps se dérive de `S` : le retirer laisserait le jeu identique. */
const CLE_TUTO="iavocat_tuto";
let tutoFait=false;
try{ tutoFait = !!localStorage.getItem(CLE_TUTO); }catch(e){}
function effacerTuto(){ try{ localStorage.removeItem(CLE_TUTO); }catch(e){} }
function tutoClore(){ tutoFait=true; try{ localStorage.setItem(CLE_TUTO,"1"); }catch(e){} }
function tutoPasser(){ tutoClore(); majTutoriel(); }
/* Ce que la question attend : tag → lien → terme s'il est ATOMIQUE. Rien n'est
   jamais nommé au joueur (§4.8). */
function tutoAttendu(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  const L=a&&a.attend&&(JEU.liens||[]).find(x=>x.tag===a.attend);
  const t=L&&(L.termes||[])[0];
  return typeof t==="string" ? t : null;
}
/* Quatre temps ; il n'avance qu'avec le passage demandé, mais n'EMPÊCHE rien. */
function tutoEtape(){
  if(S.remisesEnvoyees!==1 || S.satisfaits.length) return null;
  const veut=tutoAttendu();
  if(veut ? !S.retenus.includes(veut) : !S.retenus.length){
    const rate = !!veut && S.retenus.length>0;
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .piecetexte", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond."
                      : "Les passages soulignés se retiennent d'un clic. Prends celui qui répond."}
      : {n:1, ou:"#discussion .attach", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Rouvre la pièce et relis sa question."
                      : "Ouvre la pièce : ce qu'il te demande est écrit dedans."};
  }
  if(!R.peutEnvoyer(S))
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .close",
            dit:"Passage retenu. Referme la pièce."}
      : {n:3, ou:"#zoneRetenus",
            dit:"Pour répondre, sélectionne le passage pertinent"};
  return  {n:4, ou:"#composeur button.envoi",
            dit:"Clique sur → Envoyer"};
}
/* PIÈGE : on marque par un ATTRIBUT, pas par une classe — la sérialisation
   laisse ainsi intactes les `class="…"` que des suites lisent. */
let tutoCible=null;
function majTutoriel(){
  const banniere=$("tuto"); if(!banniere) return;
  if(tutoCible){ tutoCible.removeAttribute("data-tuto"); tutoCible=null; }
  const e = tutoFait ? null : tutoEtape();
  if(!e){
    if(!tutoFait && S.remisesEnvoyees>=1) tutoClore();
    banniere.hidden=true; return;
  }
  tutoCible=document.querySelector(e.ou);
  if(tutoCible) tutoCible.setAttribute("data-tuto", e.alerte?"alerte":"");
  banniere.toggleAttribute("data-alerte", !!e.alerte);
  $("tutoPas").textContent=e.n+"/4";
  $("tutoDit").textContent=e.dit;
  banniere.hidden=false;
}

/* 4) RENDU COMMUN */
const modalRoot = $("modalRoot");
function closeModal(){ S.modalPiece=null; modalRoot.innerHTML=""; rendreTout(); }
function modal(html){
  modalRoot.innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">
       <div class="modal"><button class="close" onclick="closeModal()">×</button>${html}</div>
     </div>`;
}
function escapeAttr(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function rendreTout(){ renderDiscussion(); renderComposeur(); renderMemoire(); renderPlaidoirie(); majCloture(); majTutoriel(); sauverPartie(); }

/* ---- Le canal : un fil de messages ---- */
function renderDiscussion(){
  let h="", dernier=null;
  for(const m of S.fil){
    // PIÈGE : l'avocat vient du contenu, déjà écrit pour l'écran ; la phrase
    // composée de l'IA, elle, s'échappe.
    const meme = m.qui===dernier; dernier=m.qui;
    h+=`<div class="msg ${m.ia?'ia':''} ${meme?'suite':''}">${
      meme?"":`<div class="who">${escapeAttr(m.qui)}</div>`}<div class="bubble">${m.ia?escapeAttr(m.texte):m.texte}<div>`;
    for(const pid of m.pieces){
      const seen=S.examinees.includes(pid)?"seen":"";
      h+=`<span class="attach ${seen}" onclick="ouvrirPiece('${pid}')">📎 ${escapeAttr(JEU.pieces[pid].titre)}</span>`;
    }
    h+=`</div></div></div>`;
  }
  if(S.clotureDemandee && S.repetitionIdx>-1 && S.repetitionIdx<JEU.repetition.affirmations.length){
    const dispo=S.brouillon.map((n,i)=>({n,i}));
    h+=`<div class="repet"><div class="rtitle">Opposer une phrase à cette affirmation ?</div>${
      dispo.length ? dispo.map(x=>
        `<div class="rnote"><span class="txt">${escapeAttr(x.n.texte)}</span>
         ${x.n.versee?`<span class="sent">déjà envoyée</span>`:`<button class="up" onclick="verserContre(${x.i})">envoyer</button>`}</div>`).join("")
      : `<div class="rnote vide">tu n'as écrit aucune phrase à y opposer</div>`
    }<button class="btn" onclick="avancerRepetition()">Ne rien envoyer — continuer</button></div>`;
  }
  const el=$("discussion");
  el.innerHTML=h;
  el.scrollTop=el.scrollHeight;
}

/* ---- Les pièces ---- le marquage ne varie jamais avec la pertinence (§4.3). */
function rendreTexte(pid){
  const p=JEU.pieces[pid];
  const src=String(p.texte||"");
  let h="", reste=src, m;
  const re=/\{\{([A-Za-z0-9_]+)\}\}/;
  while((m=re.exec(reste))){
    h+=escapeAttr(reste.slice(0,m.index));
    const eid=m[1], e=(p.empans||{})[eid];
    if(e){
      const k=pid+"."+eid, pris=S.retenus.includes(k);
      h+=`<span class="empan ${pris?'pris':''}" style="--dc:${couleurDim(e.dim)}"
            onclick="surligner('${pid}','${eid}')" title="${escapeAttr(e.dim)} — ${escapeAttr(e.qui||p.qui||'')}">${escapeAttr(e.texte)}</span>`;
    } else h+=escapeAttr(m[0]);
    reste=reste.slice(m.index+m[0].length);
  }
  h+=escapeAttr(reste);
  return h;
}
function ouvrirPiece(pid){
  R.ouvrirPiece(S,pid);
  modal(modalPieceHTML(pid));
  rendreTout();
}
function renderDossier(){
  if(!S.remisesEnvoyees) return "";
  const livres=R.piecesLivrees(S);
  const chip=pid=>{
    const p=JEU.pieces[pid], vu=S.examinees.includes(pid);
    return `<span class="dchip ${vu?'vu':''} ${R.estRegle(p)?'regle':''}"
      onclick="ouvrirPiece('${pid}')" title="${escapeAttr(p.titre)}">${vu?'✓':'●'} ${escapeAttr(p.court)}</span>`;
  };
  const colonne=(titre,pids)=>`<div class="dcol"><span class="dtitre">${titre}</span>
    <div class="dchips">${pids.length?pids.map(chip).join(""):`<span class="dvide">—</span>`}</div></div>`;
  const pieces=livres.filter(pid=>!R.estRegle(JEU.pieces[pid]));
  const regles=livres.filter(pid=> R.estRegle(JEU.pieces[pid]));
  return `<div class="zone" id="zoneDossier">
    <div class="dossier">${colonne("Les pièces",pieces)}${colonne("Les règles",regles)}</div></div>`;
}

/* 5) LA MÉMOIRE — privée, gratuite, illimitée, et CLAVIER du composeur (§4.6).
      Surligner ne produit RIEN : c'est voulu. */
function surligner(pid,eid){
  R.surligner(S,pid,eid);          // re-cliquer oublie
  if(S.modalPiece) modal(modalPieceHTML(S.modalPiece));
  rendreTout();
}
function modalPieceHTML(pid){
  const p=JEU.pieces[pid];
  return `<h3>${escapeAttr(p.titre)}</h3><small class="note">${escapeAttr(p.type)} — ${escapeAttr(p.qui||"")}</small>
    <p class="piecetexte">${rendreTexte(pid)}</p>
    `;
}
/* PIÈGE : `#zoneRetenus` est l'ancre du 3ᵉ temps du tutoriel (R6), à ne jamais
   viser par `:last-child`. */
function renderRetenus(){
  const iT=R.indexTermeChamp(S);
  const dimReq=R.dimAttendue(S);          // `null` tant qu'aucun second terme n'est attendu
  let h=`<div class="zone" id="zoneRetenus">`;
  if(!S.retenus.length){
    h+=`<div class="aide">Alimente ta mémoire en sélectionnant des passages du dossier .</div>`;
  } else {
    for(const d of JEU.dimensions||[]){
      const ks=S.retenus.map((k,j)=>({k,j})).filter(x=>EMPAN[x.k] && EMPAN[x.k].dim===d);
      if(!ks.length) continue;
      // Assombri par DIMENSION, jamais empan par empan (§4.3) ; rien n'est
      // désactivé, le clic reste possible et retombe sur le refus (§4.5).
      const hors=dimReq && d!==dimReq;
      h+=`<div class="dimgrp ${hors?"horsdim":""}" style="--dc:${couleurDim(d)}"><div class="dnom">${escapeAttr(d)}</div>`;
      for(const {k,j} of ks){
        const e=EMPAN[k];
        h+=`<div class="mchip" style="--dc:${couleurDim(d)}">
              <button class="corps" ${iT<0?"disabled":""} onclick="poserBloc(${iT},${j})"
                      title="« ${escapeAttr(e.texte)} » — ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}${
                        iT<0?"\n(ta phrase n'attend pas un passage)":hors?"\n(comparerait sans rien construire : dimension différente)":""}">
                <span class="nom">${escapeAttr(e.nom||e.texte)}</span>
                <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
              </button>
              <button class="del" onclick="surligner('${e.pid}','${e.eid}')" title="Oublier">×</button>
            </div>`;
      }
      h+=`</div>`;
    }
  }
  h+=`</div>`;
  return h;
}

/* 6) LE COMPOSEUR — les blocs de l'état courant ; seules les erreurs de
      CATÉGORIE sont refusées (§4.5). LA VOIX UNIQUE (§4.9), dérivée de `S` :
      dans le FANTÔME tant que la phrase est vide, dans l'AIDE ensuite. */
function souffle(){
  const offerts=R.blocsOfferts(S);
  // PIÈGE : à `S.compo` vide, l'état courant n'offre jamais que le PREMIER
  // terme — sonder ici manquerait toujours son moment. `comparaisonPossible`
  // regarde un cran plus loin, l'état qui suivrait la pose (§4.5).
  const second=R.comparaisonPossible(S);
  if(!S.compo.length){
    if(!S.retenus.length) return "Ouvre une pièce et retiens un passage.";
    return second ? "Sélectionne un ou plusieurs passages de ta mémoire" : "Depuis ta mémoire, sélectionne un passage pour répondre";
  }
  // La phrase se tient et rien ne reste à y mettre : on se tait (§4.9).
  if(offerts.some(b=>b.cite) || R.compoFinie(S)) return "";
  if(offerts.some(b=>b.type==="terme"&&b.source!=="note"))
    return "Clique sur un second passage pour le mettre en relation";
  // LA RELANCE ne se coupe pas (§4.5).
  return offerts.length
    ? "Et donc ? Une comparaison ne se plaide pas seule — au regard de quel texte ?"
    : "Tu n'as encore reçu aucun texte à invoquer. Ce que tu vois est vrai, et tu ne peux rien en dire.";
}
function texteCompoPartiel(){
  if(!S.compo.length) return `<span class="trou">${escapeAttr(souffle())}</span>`;
  const ch=R.chaineCompo(S);
  // Tant que le second empan n'est pas posé, on montre le premier SEUL.
  const fini=ch.some(p=>p.bloc.deduit);
  if(fini) return `<span class="bl">${escapeAttr(M.rendre(ch).replace(/\.$/,""))}</span>`;
  return ch.map(p=>{
    if(p.bloc.type!=="terme") return `<span class="bl">${escapeAttr(p.bloc.texte)}</span>`;
    if(p.bloc.source==="note") return `<span class="bl terme">${escapeAttr(p.bloc.texte)}</span>`;
    const e=EMPAN[p.valeur];
    if(!e) return `<span class="bl terme">${escapeAttr(p.valeur)}</span>`;
    return `<span class="bl terme pose" style="--dc:${couleurDim(e.dim)}">
      <span class="nom">${escapeAttr(e.nom||e.texte)}</span>
      <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
    </span>`;
  }).join(" ");
}
/* iBloc indexe R.blocsOfferts(S) — POSITIONNEL dans la liste filtrée, donc
   dépendant de la session ; iSrc indexe la mémoire ou le brouillon. */
function poserBloc(iBloc,iSrc){ R.poserBloc(S,iBloc,iSrc); rendreTout(); }
function retirerBloc(){ R.retirerBloc(S); rendreTout(); }
function viderCompo(){ R.viderCompo(S); rendreTout(); }
/* LE GESTE UNIQUE (§4.5) : on envoie de la même manière un empan, deux, ou
   deux et un article. */
function envoyerCompo(){ R.envoyerCompo(S); rendreTout(); }
/* Le composeur étant SOUS le fil (§4.6), la question est souvent la bulle juste
   au-dessus : on ne la redit qu'une fois qu'elle a cessé d'être le dernier mot. */
function rappelQuestion(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  if(!a || !a.question) return "";
  const dernier=S.fil[S.fil.length-1];
  if(dernier && dernier.texte===a.question) return "";
  return `<div class="aide question">« ${escapeAttr(a.question)} »</div>`;
}
function renderCompo(){
  const offerts=R.blocsOfferts(S);
  let h=`<div class="zone"><div class="ztitle">Ta réponse</div><div class="compo">
    ${rappelQuestion()}
    <div class="phrase">${texteCompoPartiel()}</div>`;
  if(S.compo.length)
    h+=`<div class="barre">
      ${R.peutEnvoyer(S)?`<button class="envoi" onclick="envoyerCompo()">→ Envoyer</button>`:""}
      <button onclick="retirerBloc()">← retirer</button><button onclick="viderCompo()">tout effacer</button></div>`;
  h+=`<div class="offre">`;
  /* LA CLÔTURE QUI N'AJOUTE RIEN N'EST PAS UN BOUTON (§4.5) : l'envoi la pose. */
  const implicite=R.clotureImplicite(S);
  offerts.forEach((b,i)=>{
    if(implicite && b.id===implicite.id) return;
    if(b.type==="liaison"){
      // PIÈGE : `fondement` est propre à `.bbloc` ; `.msg.suite` est le même
      // mot pour un sens sans rapport.
      h+=`<button class="bbloc ${b.imbrique?"fondement":""}" onclick="poserBloc(${i})">${escapeAttr(b.libelle||b.texte)}${
        b.piece?portePhrase(b.piece):""}</button>`;
    } else if(b.source==="note"){
      // Repli pour une affaire d'avant la continuation : hors du contenu livré,
      // toujours supporté — on ne retire pas une capacité du moteur (§11).
      if(S.brouillon.length){
        h+=`<div class="lab">${escapeAttr(b.texte)} — une phrase déjà close</div>`;
        S.brouillon.forEach((n,j)=>{ h+=`<button class="bbloc" onclick="poserBloc(${i},${j})">${escapeAttr(n.texte)}</button>`; });
      }
    }
  });
  h+=`</div>`;
  const voix = S.compo.length ? souffle() : "";   // une seule voix par état (§4.9)
  if(voix) h+=`<div class="aide">${escapeAttr(voix)}</div>`;
  if(S.refus) h+=`<div class="refus">${escapeAttr(S.refus)}</div>`;
  h+=`</div></div>`;
  return h;
}

/* 7) LES SURFACES — l'avocat ne voit QUE la Plaidoirie, et n'y inscrit que les
      MOYENS (§4.6). */
function renderMemoire(){
  $("memoire").innerHTML = renderDossier() + renderRetenus();
}
function renderComposeur(){
  $("composeur").innerHTML = renderCompo();
}
function renderPlaidoirie(){
  const gardes=S.plaidoirie.filter(x=>S.brouillon[x.b] && R.estMoyen(S.brouillon[x.b].lien));
  /* ESCAMOTÉE pour le moment : la colonne ne s'affiche plus jamais, quel que
     soit `S.plaidoirie` — mécanique de jeu inchangée derrière. */
  const vide = true;
  { const c=$("colPlaidoirie"); if(c) c.hidden=vide; }
  { const w=document.querySelector(".wrap"); if(w) w.classList.toggle("sansPlan",vide); }
  { const c=$("plaidoirieCount"); if(c) c.textContent=gardes.length||""; }
  let h=`<div class="zone">`;
  h+=`<ul class="liste plaid">${gardes.map(x=>
    `<li><span class="txt">${escapeAttr(S.brouillon[x.b].texte)}${
      x.contre!=null && JEU.repetition.affirmations[x.contre]
        ? `<span class="contre">opposé à : ${escapeAttr(JEU.repetition.affirmations[x.contre].court)}</span>`:""
    }</span></li>`).join("")}</ul>`;
  h+=`</div>`;
  $("plaidoirie").innerHTML=h;
}
function envoyer(i,contre){ R.envoyer(S,i,contre); rendreTout(); }

/* 8) CLÔTURE, RÉPÉTITION, FINS */
function majCloture(){
  const btn=$("btnCloture"), hint=$("clotureHint");
  if(!btn) return;
  const ok=R.instructionComplete(S);
  if(!ok){ btn.disabled=true; btn.textContent="Clôturer l'instruction";
           hint.textContent="Maître Auber attend encore quelque chose de cette session."; }
  else if(!S.clotureDemandee){ btn.disabled=false; btn.textContent="Clôturer l'instruction";
           hint.textContent="Le droit de clôturer est ouvert. Rien ne t'y oblige."; }
  else if(R.repetitionEnCours(S)){ btn.disabled=true; btn.textContent="Confirmer la clôture";
           hint.textContent="Répétition en cours — réponds à Maître Auber dans le canal."; }
  else {   btn.disabled=false; btn.textContent="Confirmer la clôture";
           hint.textContent="Dernier mot avant le dépôt. Tu peux encore écrire."; }
}
function cloturer(){
  const suite=R.cloturer(S);            // "repetition", "fin", ou rien
  if(suite==="fin") return finir();
  if(suite) rendreTout();
}
/* Le MÊME geste que l'envoi, avec une cible — dernier moment où la conclusion
   tue peut encore partir (§4.7). */
function verserContre(i){ R.verserContre(S,i); rendreTout(); }
function avancerRepetition(){ R.avancerRepetition(S); rendreTout(); }
function finir(){
  const f=R.finir(S);
  effacerPartie();
  modal(`<div class="fin"><h3>${escapeAttr(f.titre)}</h3>
    <div class="verdict">${escapeAttr(f.verdict)}</div>
    <p>${f.texte}</p>
    <div class="btnrow"><button onclick="location.reload()">Recommencer</button></div>
  </div>`);
}

/* Indicatif, jamais filtrant (§4.5). */
function portePhrase(pid){
  const d=R.porteDe(pid);
  return d.length ? `<span class="porte">porte sur : ${d.map(escapeAttr).join(", ")}</span>` : "";
}

/* ---- Démarrage ---- */
window.JEU = JEU; window.S = S; window.M = M; window.R = R; window.CHAMPS = CHAMPS;
/* `SOURCE_CONTENU` n'est plus affiché nulle part, mais reste exposé : quatre
   suites le lisent pour savoir quel contenu a été adopté (§13). */
window.SOURCE_CONTENU = SOURCE_CONTENU;
if(!restaurerPartie()) R.envoyerRemise(S);   // la remise 1 arrive d'elle-même
rendreTout();

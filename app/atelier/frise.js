/* ============================================================
   ATELIER — LA FRISE : le TEMPS du dossier, éditable.
   ============================================================ */
/* ============================================================
   7) ÉTAPES — A. LA FRISE (éditable)
   Chaque texte édité ici écrit directement dans CONTENU.
   Les blocs marqués ⚙ décrivent des règles du jeu (app/regles.js),
   recopiées ici : à resynchroniser si le moteur change.
   ============================================================ */
function mir(txt){ return `<span class="mir" title="Règle du jeu (app/regles.js) — décrite ici, appliquée là-bas ; le pas-à-pas ci-dessous l'exécute pour de vrai">⚙ ${escapeH(txt)}</span>`; }

const QOPT = pid => `<option value="${pid}">${escapeH(courtDe(pid))} (${pid})</option>`;
const BANNIERE_MIROIR = `<div class="mirbanner"><b>⚙ Les règles du jeu.</b> Les textes ci-dessous sont éditables et écrivent dans le contenu (export ensuite).
  Les badges ⚙ signalent des <b>règles qui vivent dans <code>app/regles.js</code></b> : cette frise les décrit en mots, le pas-à-pas les exécute pour de vrai — plus aucune n'est recopiée ici.
  Si une règle change, il n'y a rien à resynchroniser — seulement à vérifier que ces mots la décrivent encore (§15 de docs/ARCHITECTURE.md).</div>`;

function renderFrise(){
  const el=$("frise"); if(!el) return;
  const R=CONTENU.remises||[], A=CONTENU.avocat||{}, REP=CONTENU.repetition||{};
  const livrees=toutesPiecesLivrees();
  const nonLivrees=Object.keys(CONTENU.pieces).filter(pid=>!livrees.has(pid));
  const tags=[...new Set((CONTENU.liens||[]).map(l=>l.tag).filter(Boolean))];
  let h=BANNIERE_MIROIR;

  // ---- les sessions (remises) ----
  R.forEach((r,i)=>{
    const opts=nonLivrees.map(pid=>QOPT(pid)).join("");
    h+=`<div class="step">
      <h3>Session ${i+1} <span class="cid">— ce que l'avocat transmet</span><span class="sp"></span>
        ${R.length>1?btnSuppr("remise:"+i,"xsmall",`demanderSupprRemise(${i})`,"✕ session","confirmer ?"):""}</h3>
      <label>Expéditeur</label>
      <input type="text" class="mono" value="${escapeAttr(r.qui||"")}" onchange="majRemise(${i},'qui',this.value)">
      <label>Message d'ouverture</label>
      <textarea onchange="majRemise(${i},'texte',this.value)">${escapeH(r.texte||"")}</textarea>
      <label>Pièces livrées</label>
      <div class="pchips">
        ${(r.pieces||[]).map(pid=>{
          const p=CONTENU.pieces[pid];
          return `<span class="pchip ${p&&estRegle(p)?"regle":""}" title="${pid}" onclick="allerPiece('${pid}')">📎 ${escapeH(courtDe(pid))}
            <span class="x" onclick="event.stopPropagation();retirerPieceRemise(${i},'${pid}')" title="retirer de cette session">✕</span></span>`;
        }).join("")}
        ${opts?`<select class="pselect" onchange="if(this.value)ajouterPieceRemise(${i},this.value)">
          <option value="">+ pièce…</option>${opts}</select>`:""}
      </div>
      <label>Ce que l'avocat attend <span class="glose">(une SUITE : il pose, attend, accuse réception, repose. La session ne se ferme qu'une fois la liste épuisée)</span></label>
      ${attentesDeRemise(r).map((a,j)=>`<div class="attente">
        <label>Question posée <span class="glose">— facultatif : laissée vide, l'avocat n'attend qu'une phrase, sans la demander</span></label>
        <textarea style="min-height:34px" onchange="majAttente(${i},${j},'question',this.value)">${escapeH(a.question||"")}</textarea>
        <label>Tag servi</label>
        <div class="steprow">
          <input type="text" class="mono" style="width:150px" value="${escapeAttr(a.attend||"")}" placeholder="—" onchange="majAttente(${i},${j},'attend',this.value)">
          ${tags.length?`<select class="pselect" onchange="if(this.value)majAttente(${i},${j},'attend',this.value)">
            <option value="">tags existants…</option>${tags.map(t=>`<option ${t===a.attend?"selected":""}>${escapeH(t)}</option>`).join("")}</select>`:""}
          ${attentesDeRemise(r).length>1?`<button class="xsmall" onclick="retirerAttente(${i},${j})">✕ attente</button>`:""}
        </div>
        <label>Accusé de réception (apres) <span class="glose">— dit quand cette attente est servie</span></label>
        <textarea style="min-height:34px" onchange="majAttenteApres(${i},${j},this.value)">${escapeH((a.apres||{}).replique||"")}</textarea>
        ${a.apres?`<div class="steprow"><span class="glose">dit par</span>
          <input type="text" class="mono" style="width:130px" value="${escapeAttr(a.apres.qui||"")}" placeholder="Maître Auber" onchange="majAttenteApresQui(${i},${j},this.value)"></div>`:""}
      </div>`).join("")}
      <button class="addrow" onclick="ajouterAttente(${i})">+ Attente</button>
      <div class="repline">${mir("une phrase portant le tag d'une attente est versée au plan → réplique « apres » → la question suivante est posée")}</div>
      <div class="repline">${mir(i<R.length-1
        ? "la DERNIÈRE attente de la liste servie → la session "+(i+2)+" part"
        : "la DERNIÈRE attente de la liste servie → le bouton « Clôturer l'instruction » s'ouvre")}</div>
    </div>`;
  });
  h+=`<button class="addrow" onclick="ajouterRemise()">+ Session</button>`;

  // ---- les quatre surfaces ----
  h+=`<div class="step trig">
    <h3>Les quatre surfaces <span class="cid">— deux privées, deux transmises</span></h3>
    <div class="repline">${mir("lire → SURLIGNER : l'empan tombe en mémoire (privé). Rien ne se passe")}</div>
    <div class="repline">${mir("COMPOSER : les blocs de l'état courant, de gauche à droite ; seules les erreurs de catégorie sont refusées")}</div>
    <div class="repline">${mir("deux voies de clôture : un fait SE CITE (un empan, clos par sa citation) — une relation SE FONDE (deux empans, clos par un article)")}</div>
    <div class="repline">${mir("la phrase close tombe au BROUILLON (privé) — jamais jugée, gratuite, illimitée, dédoublonnée")}</div>
    <div class="repline">${mir("VERSER au plan de plaidoirie : le seul geste transmis, donc le seul à conséquence")}</div>
    <div class="repline">${mir("l'index du dossier (pièces reçues, marqueur vu/pas-vu) — pur affichage, rien à éditer ici")}</div>
  </div>`;

  // ---- réactions de l'avocat ----
  const avecDecl=Object.entries(CONTENU.pieces).filter(([,p])=>p.declenche);
  const sansDecl=Object.keys(CONTENU.pieces).filter(pid=>!CONTENU.pieces[pid].declenche);
  h+=`<div class="step trig">
    <h3>Réactions de l'avocat <span class="cid">— câblées dans le contenu, pas dans le moteur</span></h3>
    <div class="repline">${mir("l'IA ouvre une pièce portant un « declenche » → sa réplique part (une_fois : une seule)")}</div>
    ${avecDecl.map(([pid,p])=>`<div class="steprow">
        <span class="cl">📎 ${escapeH(courtDe(pid))}</span>
        <span class="glose">dit par</span>
        <input type="text" class="mono" style="width:130px" value="${escapeAttr(p.declenche.qui||"")}" placeholder="Maître Auber" onchange="majDeclencheQui('${pid}',this.value)">
        <label class="chk" style="margin:0"><input type="checkbox" ${p.declenche.une_fois?"checked":""} onchange="majDeclencheFois('${pid}',this.checked)"> une seule fois</label>
        <button class="xsmall" onclick="retirerDeclenche('${pid}')">✕</button>
      </div>
      <textarea style="min-height:34px" onchange="majDeclenche('${pid}',this.value)">${escapeH(p.declenche.replique||"")}</textarea>`).join("")}
    ${sansDecl.length?`<select class="pselect" onchange="if(this.value)ajouterDeclenche(this.value)">
      <option value="">+ réplique à l'examen d'une pièce…</option>
      ${sansDecl.map(pid=>QOPT(pid)).join("")}</select>`:""}
    <div class="repline">${mir("phrase versée reconnue comme LA CONCLUSION du vice (⚑ + conclusion) → rep_vice, et vice_trouve + vice_expose")}</div>
    <textarea onchange="majAvocat('rep_vice',this.value)">${escapeH(A.rep_vice||"")}</textarea>
    <div class="repline">${mir("phrase versée reconnue comme le faux vice (✗) → rep_faux")}</div>
    <textarea onchange="majAvocat('rep_faux',this.value)">${escapeH(A.rep_faux||"")}</textarea>
    <div class="repline">${mir("phrase versée reconnue par un lien qui a sa propre réplique → celle-ci (à éditer sur le trait, onglet Graphe)")}</div>
    <div class="repline">${mir("phrase versée SANS lien reconnu, de forme comparative (arité 2) → escalade « et donc ? » 1/2/3")}</div>
    ${(A.rep_inutile||[]).map((t,j)=>`<textarea style="min-height:34px" onchange="majAvocatIdx('rep_inutile',${j},this.value)">${escapeH(t)}</textarea>`).join("")}
    <div class="repline">${mir("phrase versée SANS lien reconnu, de forme qualifiante (arité 1) → escalade « je ne vois pas où tu veux en venir » 1/2/3")}</div>
    ${(A.rep_sans_rapport||[]).map((t,j)=>`<textarea style="min-height:34px" onchange="majAvocatIdx('rep_sans_rapport',${j},this.value)">${escapeH(t)}</textarea>`).join("")}
  </div>`;

  // ---- les manuels ----
  h+=`<div class="step">
    <h3>Les manuels <span class="cid">— le manuel de soi ; les règles du cas sont des pièces de type « règle », affichées une fois LIVRÉES</span></h3>
    <label>Directives (une par ligne)</label>
    <textarea onchange="majDirectives(this.value)">${escapeH((CONTENU.directives||[]).join("\n"))}</textarea>
    <label>Avis d'exploitation <span class="glose">(le brouillard, consultable dans les Manuels)</span></label>
    <textarea style="min-height:34px" onchange="majAvis(this.value)">${escapeH(CONTENU.avis_exploitation||"")}</textarea>
  </div>`;

  // ---- clôture / répétition ----
  h+=`<div class="step">
    <h3>Clôture → répétition de plaidoirie <span class="cid">— la veille du dépôt</span></h3>
    <label>Intro de la répétition</label>
    <textarea onchange="majRep('intro',this.value)">${escapeH(REP.intro||"")}</textarea>
    <label>Affirmations de l'accusation <span class="glose">(défilent une à une — l'IA laisse passer ou verse une phrase contre)</span></label>
    ${(REP.affirmations||[]).map((a,j)=>`<div class="affrow">
        <div class="steprow">
          <span class="cid">${j+1}</span>
          <input type="text" class="mono" value="${escapeAttr(a.court||"")}" onchange="majAff(${j},'court',this.value)" title="nom court (affiché sous la phrase versée)">
          ${btnSuppr("aff:"+j,"xsmall",`demanderSupprAff(${j})`,"✕","confirmer ?")}
        </div>
        <textarea onchange="majAff(${j},'texte',this.value)">${escapeH(a.texte||"")}</textarea>
      </div>`).join("")}
    <button class="addrow" onclick="ajouterAff()">+ Affirmation</button>
    <div class="repline">${mir("verser une phrase contre l'affirmation = le même geste, avec une cible ; phrase déjà versée → « deja »")}</div>
    <textarea style="min-height:34px" onchange="majAvocat('deja',this.value)">${escapeH(A.deja||"")}</textarea>
    <label>Fin de la répétition</label>
    <textarea onchange="majRep('fin',this.value)">${escapeH(REP.fin||"")}</textarea>
    <div class="repline">${mir("le bouton devient « Confirmer la clôture » → le procès a lieu hors-champ")}</div>
  </div>`;

  // ---- fins ----
  h+=`<div class="step fins">
    <h3>Les trois fins <span class="cid">— rapportées, jamais mises en scène</span></h3>
    <div class="repline">${mir("vice_trouve ? (vice_expose ? Fin 1 : Fin 2) : Fin 3 — et « variante_faux » ajoutée si le leurre a été versé")}</div>
    ${Object.entries(CONTENU.fins||{}).map(([k,f])=>`<div class="fincard">
      <h4>${escapeH(f.titre||("Fin "+k))}</h4>
      <label>Verdict</label>
      <input type="text" class="mono" value="${escapeAttr(f.verdict||"")}" onchange="majFin('${k}','verdict',this.value)">
      <label>Texte</label>
      <textarea onchange="majFin('${k}','texte',this.value)">${escapeH(f.texte||"")}</textarea>
      <label>Variante si le faux vice a été versé</label>
      <textarea style="min-height:34px" onchange="majFin('${k}','variante_faux',this.value)">${escapeH(f.variante_faux||"")}</textarea>
    </div>`).join("")}
  </div>`;

  // ---- pièces jamais livrées ----
  if(nonLivrees.length){
    h+=`<div class="step trig"><h3>Pièces jamais livrées <span class="cid">— injouables tant qu'aucune session ne les transmet</span></h3>
      <div class="pchips">${nonLivrees.map(pid=>`<span class="pchip" title="${pid}" onclick="allerPiece('${pid}')">📎 ${escapeH(courtDe(pid))}</span>`).join("")}</div>
      <div class="repline">Ajoute-les à une session via son sélecteur « + pièce… ».</div></div>`;
  }

  el.innerHTML=h;
}

function allerPiece(pid){ vue('graphe'); scrollVers(pid); }

/* mutations de la frise — toutes par `muter` (noyau.js) : c'est lui qui porte
   `pushUndo` avant et `autosave(); render()` après. Ce qui reste écrit ici est
   ce que chacune change, et rien d'autre. */
function majRemise(i,prop,v){ muter(()=>{
  const r=CONTENU.remises[i];
  if(prop==="attend") poserOuRetirer(r,prop,v,{trim:true}); else r[prop]=v;
}); }
function retirerPieceRemise(i,pid){ muter(()=>{ CONTENU.remises[i].pieces=(CONTENU.remises[i].pieces||[]).filter(x=>x!==pid); }); }
function ajouterPieceRemise(i,pid){ muter(()=>{ (CONTENU.remises[i].pieces=CONTENU.remises[i].pieces||[]).push(pid); }); }
function ajouterRemise(){ muter(()=>{ CONTENU.remises.push({qui:"Maître Auber",texte:"",pieces:[]}); }); }
function demanderSupprRemise(i){ demanderSuppr("remise:"+i,()=>{ CONTENU.remises.splice(i,1); }); }
/* LES ATTENTES D'UNE SESSION (§3). Éditer une remise écrite à l'ancienne la
   convertit en liste : on n'écrit plus qu'une forme, mais on lit les deux. */
function attentesEditables(i){
  const r=CONTENU.remises[i];
  if(!Array.isArray(r.attentes)){
    const a={};
    if(r.attend) a.attend=r.attend;
    if(r.apres)  a.apres=r.apres;
    delete r.attend; delete r.apres;
    r.attentes=Object.keys(a).length?[a]:[{}];
  }
  return r.attentes;
}
function majAttente(i,j,prop,v){ muter(()=>{
  const a=attentesEditables(i)[j]; if(!a) return;
  poserOuRetirer(a,prop,v,{trim:prop==="attend"});
}); }
function majAttenteApres(i,j,v){ muter(()=>{
  const a=attentesEditables(i)[j]; if(!a) return;
  if(String(v).trim()) a.apres={...(a.apres||{}),replique:v}; else delete a.apres;
}); }
function majAttenteApresQui(i,j,v){ muter(()=>{
  const a=attentesEditables(i)[j]; if(!a||!a.apres) return;
  poserOuRetirer(a.apres,"qui",v,{trim:true});
}); }
function ajouterAttente(i){ muter(()=>{ attentesEditables(i).push({}); }); }
function retirerAttente(i,j){ muter(()=>{
  const as=attentesEditables(i);
  if(as.length>1) as.splice(j,1);
}); }
/* Les accusés de réception vivent sur l'ATTENTE, pas sur la session ni sur une
   case (§3) : `majAttenteApres` / `majAttenteApresQui`, plus haut. Les deux
   fonctions de session qui vivaient ici n'avaient plus d'appelant. */
const declencheDe = pid => (CONTENU.pieces[pid].declenche = CONTENU.pieces[pid].declenche || {});
function majDeclenche(pid,v){ muter(()=>{ CONTENU.pieces[pid].declenche={...(CONTENU.pieces[pid].declenche||{une_fois:true}),replique:v}; }); }
function majDeclencheQui(pid,v){ muter(()=>{ poserOuRetirer(declencheDe(pid),"qui",v,{trim:true}); }); }
function majDeclencheFois(pid,b){ muter(()=>{ poserOuRetirer(declencheDe(pid),"une_fois",b); }); }
function ajouterDeclenche(pid){ muter(()=>{ CONTENU.pieces[pid].declenche={une_fois:true,replique:""}; }); }
function retirerDeclenche(pid){ muter(()=>{ delete CONTENU.pieces[pid].declenche; }); }
function majDirectives(text){ muter(()=>{ CONTENU.directives=text.split("\n").map(s=>s.trim()).filter(Boolean); }); }
function majAvis(v){ muter(()=>{ poserOuRetirer(CONTENU,"avis_exploitation",v); }); }
function majAvocat(k,v){ muter(()=>{ CONTENU.avocat[k]=v; }); }
function majAvocatIdx(k,i,v){ muter(()=>{ CONTENU.avocat[k][i]=v; }); }
function majRep(prop,v){ muter(()=>{ CONTENU.repetition[prop]=v; }); }
function majAff(i,prop,v){ muter(()=>{ CONTENU.repetition.affirmations[i][prop]=v; }); }
function ajouterAff(){ muter(()=>{ CONTENU.repetition.affirmations.push({court:"…",texte:""}); }); }
function demanderSupprAff(i){ demanderSuppr("aff:"+i,()=>{ CONTENU.repetition.affirmations.splice(i,1); }); }
function majFin(k,prop,v){ muter(()=>{ CONTENU.fins[k][prop]=v; }); }


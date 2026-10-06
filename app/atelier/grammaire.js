/* ATELIER — L'ONGLET GRAMMAIRE : le geste de composition, pour le SENTIR.
   Branché sur LE CONTENU COURANT (§14) : il le lit, ne l'écrit jamais. Sous
   jsdom, le moteur est absent : on affiche un encart. */
let GRAM={ squel:0, vals:{}, rel:null, notes:[], _m:null };
function moteurGram(){
  const m=MG();
  if(!m) return null;
  if(GRAM._m!==m){
    GRAM._m=m;
    GRAM._sq=m.squelettes();
    GRAM._data={ CHAMPS:empansPlats() };
    GRAM.squel=Math.min(GRAM.squel||0, Math.max(0,GRAM._sq.length-1));
    GRAM.vals={};
  }
  return GRAM._m;
}
function gramTermes(sq){ return sq.filter(b=>b.type==="terme"); }
/* LA RELATION SE CHOISIT (passe G, §4.5) : un bloc `relation` prend l'une des
   deux relations de la dimension des deux champs qui le précèdent — ou, sur
   deux dimensions, la juxtaposition, qui se pose d'elle-même. Le moteur le dit
   (`relationsDe`), l'onglet ne le recalcule pas (§12). */
function relationsPour(m,a,b){
  if(typeof a!=="string" || typeof b!=="string" || !m.C[a] || !m.C[b]) return [];
  if(m.dimDe(a)===m.dimDe(b)) return m.relationsDe(m.dimDe(a));
  const j=Object.entries((CONTENU.grammaire||{}).formes||{}).find(([,f])=>f.deduction==="juxtaposition");
  return j ? [j[0]] : [];
}
function chaineDe(sq,valeurs,rel){
  let ti=0;
  return sq.map(bloc => bloc.type==="terme" ? {bloc, valeur:valeurs[ti++]}
                      : {bloc, valeur: bloc.type==="relation" ? rel : null});
}
function gramRelations(sq,valeurs){
  const m=moteurGram(), i=sq.findIndex(b=>b.type==="relation");
  if(!m || i<0) return [];
  const avant=gramTermes(sq.slice(0,i)).length;
  return relationsPour(m, valeurs[avant-2], valeurs[avant-1]);
}
function gramChaine(sq){
  const valeurs=gramTermes(sq).map((bloc,ti)=>{
    const v=GRAM.vals[ti];
    if(v==null) return undefined;
    return bloc.source==="note" ? (GRAM.notes[v]||{}).red : v;
  });
  const rels=gramRelations(sq,valeurs);
  return chaineDe(sq, valeurs, rels.includes(GRAM.rel) ? GRAM.rel : rels[0]);
}
function gramSetVal(ti,val){ GRAM.vals[ti]=(val===""?null:val); renderGrammaire(); }
function gramSetRel(val){ GRAM.rel=val||null; renderGrammaire(); }
function gramChoixSquel(i){ GRAM.squel=+i; GRAM.vals={}; GRAM.rel=null; renderGrammaire(); }
function gramGarderNote(){
  const m=moteurGram(); if(!m) return;
  const sq=GRAM._sq[GRAM.squel], ch=gramChaine(sq);
  if(ch.some(p=>p.bloc.type==="terme"&&p.valeur===undefined)) return;
  const red=m.reduire(ch);
  if(m.valider(red)) return;                       // on ne garde que le sensé
  GRAM.notes.push({red, texte:m.rendre(ch)});
  renderGrammaire();
}
function gramSupprNote(i){ GRAM.notes.splice(i,1); GRAM.vals={}; renderGrammaire(); }
/* DENSITÉ LIVE — le même calcul que le banc d'essai, pour UN chiffre : la marge
   de bruit, qui ne doit jamais tomber à 0 (§14). PIÈGE PAYÉ : ON NE RÉÉCRIT PAS
   LA RÉDUCTION, on appelle `reduire` (§12) — reconstruite à la main, elle
   annonçait 21 de marge au lieu de 315, un reflet qui ment sans rien casser. */
function gramDensite(m){
  const {CHAMPS}=GRAM._data;
  const notes=GRAM.notes.map(n=>n.red);
  let total=0,senses=0,avecLien=0;
  for(const s of GRAM._sq){
    const sources=gramTermes(s).map(b=>b.source==="note"?(notes.length?notes:[null]):CHAMPS.map(c=>c.id));
    const combos=sources.reduce((a,src)=>a.flatMap(p=>src.map(v=>[...p,v])),[[]]);
    const choix=s.some(b=>b.type==="relation");
    for(const c of combos){
      if(c.some(v=>v==null)) continue;
      // Chaque relation offerte est une phrase que le joueur peut former, la fausse comprise.
      for(const rel of (choix ? gramRelations(s,c) : [null])){
        const r=m.reduire(chaineDe(s,c,rel));
        total++;
        if(!m.valider(r)){ senses++; if(m.lienDe(r)) avecLien++; }
      }
    }
  }
  return {total,senses,avecLien};
}
const formeSquelette = s =>
  s.map(b=>b.forme).filter(Boolean).pop()
  || (s.some(b=>b.type==="relation") ? "choisie par le joueur" : s.some(b=>b.deduit) ? "déduite des valeurs" : "—");
const lblBloc = b => b.type==="terme" ? null : b.type==="relation" ? "‹relation›" : b.texte;
function renderGrammaire(){
  const pane=$("grampane");
  const m=moteurGram();
  if(!m){
    pane.innerHTML=`<h2>Grammaire — le composeur du contenu courant</h2>
      <div class="warnbox"><code>moteur.js</code> n'est pas chargé. Cet onglet le lit via
      <code>&lt;script src="moteur.js"&gt;</code>, à côté de l'atelier — ce qui exige d'<b>ouvrir
      l'atelier dans un vrai navigateur</b>. En ligne de commande, le banc d'essai sur le jeu
      de données de démonstration reste <code>npm run demo:grammaire</code>.</div>`;
    return;
  }
  const {CHAMPS}=GRAM._data;
  const sq=GRAM._sq[GRAM.squel];
  const termes=gramTermes(sq);

  let compo=`<div class="gcompose">
    <select onchange="gramChoixSquel(this.value)">
      ${GRAM._sq.map((s,i)=>{
        const lbl=s.map(b=>b.type==="terme"?(b.source==="note"?"«note»":"___"):lblBloc(b)).join(" ");
        return `<option value="${i}" ${i===GRAM.squel?'selected':''}>${escapeH(lbl)}</option>`;
      }).join("")}
    </select>`;
  termes.forEach((b,ti)=>{
    if(b.source==="note"){
      compo+=` <select onchange="gramSetVal(${ti},this.value)">
        <option value="">— note —</option>
        ${GRAM.notes.map((n,i)=>`<option value="${i}" ${GRAM.vals[ti]==i?'selected':''}>${escapeH(n.texte)}</option>`).join("")}
      </select>`;
    } else {
      compo+=` <select onchange="gramSetVal(${ti},this.value)">
        <option value="">— champ —</option>
        ${CHAMPS.map(c=>`<option value="${c.id}" ${GRAM.vals[ti]===c.id?'selected':''}>${escapeH(c.texte)} <span class="lex">(${c.dim})</span></option>`).join("")}
      </select>`;
    }
  });
  if(sq.some(b=>b.type==="relation")){
    const ch0=gramChaine(sq), choisie=(ch0.find(p=>p.bloc.type==="relation")||{}).valeur;
    const rels=gramRelations(sq, ch0.filter(p=>p.bloc.type==="terme").map(p=>p.valeur));
    compo+=` <select onchange="gramSetRel(this.value)" ${rels.length?"":"disabled"}>
        ${rels.length ? rels.map(f=>`<option value="${escapeAttr(f)}" ${f===choisie?'selected':''}>${escapeH(((CONTENU.grammaire.formes||{})[f]||{}).libelle||f)}</option>`).join("")
                      : `<option>— relation —</option>`}
      </select>`;
  }
  compo+=`</div>`;

  // la phrase + le verdict
  const ch=gramChaine(sq);
  const complet=!ch.some(p=>(p.bloc.type==="terme"||p.bloc.type==="relation")&&p.valeur==null);
  let phrase, verdict="";
  if(!complet){
    phrase=`<span class="glose">Remplis les trous pour composer une phrase…</span>`;
  } else {
    phrase=escapeH(m.rendre(ch));
    const red=m.reduire(ch), raison=m.valider(red), lien=m.lienDe(red);
    const pills=[];
    if(raison) pills.push(`<span class="gpill nonsense">sans rapport — ${escapeH(raison)}</span>`);
    else pills.push(`<span class="gpill sense">sensé</span>`);
    if(!raison && m.fausse(red)) pills.push(`<span class="gpill nonsense">relation fausse — l'avocat la refusera (§4.5)</span>`);
    if(!raison){
      if(lien){
        pills.push(`<span class="gpill lien">lien reconnu du contenu</span>`);
      } else pills.push(`<span class="gpill bruit">bruit sensé (aucun lien) — la marge qui empêche « sensé » de valoir « correct »</span>`);
    }
    verdict=`<div class="gverdict">${pills.join("")}</div>`;
    if(!raison){
      const noteDejaLa=GRAM.notes.some(n=>n.texte===m.rendre(ch));
      verdict+=`<button class="tbtn" ${noteDejaLa?'disabled':''} onclick="gramGarderNote()"
        title="Rend cette phrase disponible comme « ce qui précède » dans une phrase composée">📌 Garder comme note${noteDejaLa?' (déjà gardée)':''}</button>`;
    }
  }

  // les notes gardées
  let notesH="";
  if(GRAM.notes.length){
    notesH=`<h3>Notes gardées <span style="font-weight:400;text-transform:none">(utilisables dans les slots «note» : « ce qui précède »)</span></h3>
      <div class="gsquel">${GRAM.notes.map((n,i)=>
        `<div>📌 ${escapeH(n.texte)} <button class="xsmall" onclick="gramSupprNote(${i})" style="margin-left:6px">✕</button></div>`).join("")}</div>`;
  }

  // la référence + la densité
  const d=gramDensite(m);
  const ref=`<h3>Les ${GRAM._sq.length} squelettes de phrase</h3>
    <div class="gsquel">${GRAM._sq.map(s=>
      "· "+s.map(b=>b.type==="terme"?(b.source==="note"?"<b>«note»</b>":"<b>___</b>"):escapeH(lblBloc(b))).join(" ")
      +'  → <span class="f">'+escapeH(formeSquelette(s))+"</span>").join("<br>")}</div>
    <h3>Densité — la marge de bruit</h3>
    <div class="gstat"><b>${d.total}</b> phrases légales · <b>${d.senses}</b> sensées
      (${(100*d.senses/d.total).toFixed(1)} %) · <b>${d.avecLien}</b> portent un lien du contenu
      → <b>${d.senses-d.avecLien}</b> phrases sensées <b>sans</b> lien : c'est la marge de bruit.<br>
      Si elle tombait à 0, « sensé » vaudrait « correct » et l'interface trahirait
      (invariant du §14 de ARCHITECTURE.md).${GRAM.notes.length?'':' <span class="glose">(garde des notes pour peupler les slots «note».)</span>'}</div>`;

  pane.innerHTML=`<h2>Grammaire — prototype <span style="color:var(--dim);font-weight:400;font-size:12px">non branché sur le jeu</span></h2>
    <p class="lead">Compose une phrase en remplissant les trous d'un squelette. Le moteur (partagé avec
    <code>npm run demo:grammaire</code>) dit si elle est <b>sensée</b> (catégories respectées) et si elle
    <b>reconnaît un lien</b> du contenu. Pour enchaîner (« ce qui précède est contraire à… »), garde d'abord
    une phrase comme note. Rien ici ne touche au contenu du jeu.</p>
    ${compo}
    <div class="gphrase">${phrase}</div>
    ${verdict}
    ${notesH}
    ${ref}`;
}


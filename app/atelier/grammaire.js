/* ============================================================
   ATELIER — L'ONGLET GRAMMAIRE : le geste de composition, pour le SENTIR.
   ============================================================ */
/* ============================================================
   10bis) ONGLET GRAMMAIRE — le geste de composition, pour le SENTIR
   Branché sur LE CONTENU COURANT : sa grammaire, ses empans, ses liens
   (docs/ARCHITECTURE.md §14). Il lit CONTENU, il ne l'écrit jamais. Le
   moteur est app/moteur.js, chargé tel quel — jamais recopié. Sous jsdom
   (smoke_atelier), les <script src> ne se chargent pas → le moteur est
   absent → on affiche un encart, sans planter.
   ============================================================ */
let GRAM={ squel:0, vals:{}, notes:[], _m:null };
/* L'onglet Grammaire compose sur LE CONTENU COURANT : sa grammaire, ses
   empans, ses liens. C'est le même moteur que le jeu (app/moteur.js). */
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
/* les blocs-terme du squelette courant (les « trous » à remplir) */
function gramTermes(sq){ return sq.filter(b=>b.type==="terme"); }
/* Un squelette + une valeur par trou → la chaîne {bloc, valeur} que le moteur
   attend. C'est le SEUL endroit qui sait dans quel ordre les trous se
   remplissent : l'aperçu s'en sert pour un choix, la densité pour un million. */
function chaineDe(sq,valeurs){
  let ti=0;
  return sq.map(bloc => bloc.type==="terme" ? {bloc, valeur:valeurs[ti++]} : {bloc, valeur:null});
}
/* construit la chaîne {bloc, valeur} pour le moteur, à partir des choix */
function gramChaine(sq){
  // slot « note » : la valeur est la RÉDUCTION de la note gardée ;
  // slot « champ » : la valeur est l'id du champ.
  return chaineDe(sq, gramTermes(sq).map((bloc,ti)=>{
    const v=GRAM.vals[ti];
    if(v==null) return undefined;
    return bloc.source==="note" ? (GRAM.notes[v]||{}).red : v;
  }));
}
function gramSetVal(ti,val){ GRAM.vals[ti]=(val===""?null:val); renderGrammaire(); }
function gramChoixSquel(i){ GRAM.squel=+i; GRAM.vals={}; renderGrammaire(); }
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
/* DENSITÉ LIVE — le même calcul que la section 5 du banc d'essai.
   ------------------------------------------------------------
   Ce panneau existe pour UN chiffre : la marge de bruit, les phrases sensées
   qui ne portent aucun lien. Si elle tombait à 0, « sensé » vaudrait
   « correct » et l'interface trahirait (§14).

   Il le calculait en prenant la DERNIÈRE FORME DÉCLARÉE du squelette —
   `s.map(b=>b.forme).filter(Boolean).pop()` — ce qui était juste tant que toute
   forme était portée par une liaison. Depuis la déduction (§4.5), un bloc
   `deduit` fait CALCULER la forme des valeurs, et une liaison `imbrique`
   EMBOÎTE ce qui précède au lieu de s'y ajouter : la forme reconstruite à la
   main était d'arité 1 avec deux termes à plat, refusée pour « arité », à
   chaque combinaison. Sur content.js : 24 sensées annoncées, 330 réelles ;
   21 de marge annoncés, 315 réels.

   On ne réécrit donc plus la réduction : on construit la chaîne de blocs et on
   appelle `reduire`, comme le composeur du jeu (§12, §15). */
function gramDensite(m){
  const {CHAMPS}=GRAM._data;
  const notes=GRAM.notes.map(n=>n.red);
  let total=0,senses=0,avecLien=0;
  for(const s of GRAM._sq){
    const sources=gramTermes(s).map(b=>b.source==="note"?(notes.length?notes:[null]):CHAMPS.map(c=>c.id));
    const combos=sources.reduce((a,src)=>a.flatMap(p=>src.map(v=>[...p,v])),[[]]);
    for(const c of combos){
      if(c.some(v=>v==null)) continue;
      const r=m.reduire(chaineDe(s,c));
      total++;
      if(!m.valider(r)){ senses++; if(m.lienDe(r)) avecLien++; }
    }
  }
  return {total,senses,avecLien};
}
/* Ce qu'un squelette annonce comme forme, AVANT de connaître ses valeurs. Une
   liaison la déclare ; un bloc `deduit` ne peut pas — elle se calcule des deux
   empans, et le squelette seul ne sait pas laquelle ce sera. On le dit, plutôt
   que d'écrire « undefined ». */
const formeSquelette = s =>
  s.map(b=>b.forme).filter(Boolean).pop() || (s.some(b=>b.deduit) ? "déduite des valeurs" : "—");
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

  // le sélecteur de squelette + les trous
  let compo=`<div class="gcompose">
    <select onchange="gramChoixSquel(this.value)">
      ${GRAM._sq.map((s,i)=>{
        const lbl=s.map(b=>b.type==="terme"?(b.source==="note"?"«note»":"___"):b.texte).join(" ");
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
  compo+=`</div>`;

  // la phrase + le verdict
  const ch=gramChaine(sq);
  const complet=!ch.some(p=>p.bloc.type==="terme"&&p.valeur===undefined);
  let phrase, verdict="";
  if(!complet){
    phrase=`<span class="glose">Remplis les trous pour composer une phrase…</span>`;
  } else {
    phrase=escapeH(m.rendre(ch));
    const red=m.reduire(ch), raison=m.valider(red), lien=m.lienDe(red);
    const pills=[];
    if(raison) pills.push(`<span class="gpill nonsense">sans rapport — ${escapeH(raison)}</span>`);
    else pills.push(`<span class="gpill sense">sensé</span>`);
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
      "· "+s.map(b=>b.type==="terme"?(b.source==="note"?"<b>«note»</b>":"<b>___</b>"):escapeH(b.texte)).join(" ")
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


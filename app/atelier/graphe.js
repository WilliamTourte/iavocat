/* ============================================================
   ATELIER — LE GRAPHE : le canevas, les traits, et le clic dessus.
   L'ESPACE du dossier — qui se relie à quoi. Dépend du noyau.
   ============================================================ */
/* ============================================================
   3) LE GRAPHE
   ============================================================ */
function autoLayout(force){
  CONTENU._pos = CONTENU._pos || {};
  const cols={ piece:{x:60,y:70}, regle:{x:760,y:70} };
  for(const [pid,p] of Object.entries(CONTENU.pieces)){
    const c=estRegle(p)?cols.regle:cols.piece;
    if(force || !CONTENU._pos[pid]) CONTENU._pos[pid]={x:c.x,y:c.y};
    c.y += 96 + 30*Object.keys(p.empans||{}).length;
  }
  render();
}
function placeLibre(kind){
  const x = kind==='regle' ? 760 : 60;
  let y = 70;
  for(const [pid,p] of Object.entries(CONTENU.pieces)){
    const pos=CONTENU._pos[pid]; if(!pos) continue;
    if((estRegle(p)?'regle':'piece')!==kind) continue;
    y=Math.max(y, pos.y + 96 + 30*Object.keys(p.empans||{}).length);
  }
  return {x,y};
}

function render(){
  const cv=$("canvas");
  [...cv.querySelectorAll(".card,.zonelbl")].forEach(n=>n.remove());
  CONTENU._pos = CONTENU._pos || {};

  cv.insertAdjacentHTML("beforeend",
    `<div class="zonelbl" style="left:60px;top:34px">PIÈCES DU DOSSIER</div>
     <div class="zonelbl" style="left:760px;top:34px">MANUEL — RÈGLES</div>`);

  let maxX=900,maxY=800;
  for(const [pid,p] of Object.entries(CONTENU.pieces)){
    const pos=CONTENU._pos[pid] || placeLibre(estRegle(p)?'regle':'piece');
    CONTENU._pos[pid]=pos;
    maxX=Math.max(maxX,pos.x+260); maxY=Math.max(maxY,pos.y+96+30*Object.keys(p.empans||{}).length);
    const chips=Object.entries(p.empans||{}).map(([k,e])=>{
      const cls=["chip"];
      if(selA&&selA.pid===pid&&selA.champ===k) cls.push("selA");
      if(selB&&selB.pid===pid&&selB.champ===k) cls.push("selB");
      if(!empanRelie(pid,k)) cls.push("orphan");
      if(estBruit(pid,k)) cls.push("noise");
      if(flagged.has(K(pid,k))) cls.push("flag");
      const dim=e.dim;
      return `<div class="${cls.join(' ')}" data-k="${pid}.${k}" onclick="clicChamp('${pid}','${k}')" title="${escapeAttr((dim||'— aucune dimension —')+" — "+(e.qui||p.qui||"")+" : "+(e.texte||""))}">
        <span class="dot" style="background:${dim?couleurDim(dim):'var(--err)'}"></span>
        <span class="cn">${joli(k)}</span><span class="cv">${escapeH(String(e.valeur??""))}</span></div>`;
    }).join("");
    const delKey="piece:"+pid;
    const html=`<div class="card ${estRegle(p)?'regle':''}" data-id="${pid}" style="left:${pos.x}px;top:${pos.y}px">
      <div class="chead" data-drag="${pid}">
        <span class="kind">${estRegle(p)?'règle':'pièce'}</span>
        <span class="ctitle">${escapeH(p.court||pid)}</span>
        <span class="cid" style="cursor:pointer" title="cliquer pour renommer l'id (liens, remises et positions suivront)" onclick="event.stopPropagation();demanderRenommagePiece('${pid}')">${pid} ✎</span>
      </div>
      <div class="cbody">${chips||'<div style="font-family:var(--mono);font-size:11px;color:var(--dim)">aucun empan</div>'}</div>
      <div class="cfoot">
        <button class="addchip" onclick="formulaireChamp('${pid}')">+ empan</button>
        <button class="addchip" onclick="formulairePieceEdit('${pid}')">✎ texte</button>
        <button class="delcard ${pendingDel===delKey?'arm':''}" onclick="demanderSupprPiece('${pid}')">${pendingDel===delKey?'confirmer ?':'✕'}</button>
      </div>
    </div>`;
    cv.insertAdjacentHTML("beforeend",html);
  }
  cv.style.width=Math.max(1600,maxX+80)+"px";
  cv.style.height=Math.max(1000,maxY+80)+"px";

  armerDrag();
  renderEdges();
  renderDiag();
  renderInsp();
  renderEtapes();
  majUndoBtn();
}

function empanRelie(pid,eid){
  const k=K(pid,eid);
  return (CONTENU.liens||[]).some(L=>feuillesLien(L).includes(k));
}
/* Le RANG dans CONTENU.dimensions, jamais la pertinence (§4.3). La règle et la
   palette vivent dans moteur.js, en un seul exemplaire — l'atelier en portait
   les six mêmes hexadécimaux que le jeu. Ici on ne choisit que le repli : une
   dimension inconnue est une ERREUR d'écriture, on la montre en rouge (le jeu,
   lui, la grise et continue). */
function couleurDim(d){
  const api=window.MoteurGrammaire;
  return (api ? api.couleurDim(toutesDims(),d) : null) || "var(--err)";
}

function chipCenter(pid,ch){
  const el=document.querySelector(`.chip[data-k="${pid}.${ch}"]`);
  const cv=$("canvas");
  if(!el) return null;
  const r=el.getBoundingClientRect(), c=cv.getBoundingClientRect();
  return { x:r.left-c.left+r.width/2, y:r.top-c.top+r.height/2 };
}
function edgeColor(L){
  if(L.vice) return getCSS('--vice');
  if(L.faux) return getCSS('--faux');
  if(!lienSense(L)) return getCSS('--err');
  if(String(L.forme||"").startsWith("identite_non")) return getCSS('--accent');
  return getCSS('--ok');
}
function getCSS(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
/* Via moteur.js : une phrase est « sensée » si ses termes respectent
   les catégories déclarées par la forme. Le moteur en est seul juge. */
function lienSense(L){
  const m=MG(); if(!m) return true;
  if(!formeDe(L.forme)) return false;
  return !m.valider({forme:L.forme,termes:L.termes||[]});
}
/* Un lien d'arité 2 dont les deux termes sont des empans se dessine ; un lien
   de qualification (arité 1, sur une note close) n'a pas de trait — il se lit
   dans la liste sous le diagnostic. */
function paireVisible(L){
  const t=L.termes||[];
  return t.length===2 && typeof t[0]==="string" && typeof t[1]==="string" ? t : null;
}
function renderEdges(){
  const svg=$("edges"), cv=$("canvas");
  svg.setAttribute("width",cv.style.width); svg.setAttribute("height",cv.style.height);
  let h="";
  (CONTENU.liens||[]).forEach((L,i)=>{
    const p=paireVisible(L); if(!p) return;
    const A=chipCenter(...p[0].split(".")), B=chipCenter(...p[1].split("."));
    if(!A||!B) return;
    const col=edgeColor(L);
    const dash=lienSense(L)?"":"6 5";
    const mx=(A.x+B.x)/2;
    const d=`M ${A.x} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${B.x} ${B.y}`;
    const sel=selEdge===i?`stroke-width="3.4"`:`stroke-width="2"`;
    const tag=[L.vice?"VICE":"",L.faux?"faux vice":""].filter(Boolean).join(" · ");
    h+=`<g><title>${escapeH(labelLien(L))}${tag?" — "+tag:""}</title>
      <path d="${d}" stroke="transparent" stroke-width="14" fill="none" style="pointer-events:stroke;cursor:pointer" onclick="clicEdge(${i})"></path>
      <path d="${d}" stroke="${col}" ${sel} fill="none" stroke-dasharray="${dash}" opacity="${selEdge===null||selEdge===i?0.95:0.4}"></path></g>`;
  });
  svg.innerHTML=h;
}

function armerDrag(){
  document.querySelectorAll(".chead[data-drag]").forEach(h=>{
    h.onpointerdown=e=>{
      e.preventDefault();
      const id=h.getAttribute("data-drag"), card=h.closest(".card");
      const start={x:e.clientX,y:e.clientY}, orig={...CONTENU._pos[id]};
      document.body.classList.add("drag-none");
      const move=ev=>{ const nx=orig.x+(ev.clientX-start.x), ny=orig.y+(ev.clientY-start.y);
        CONTENU._pos[id]={x:Math.max(8,nx),y:Math.max(34,ny)};
        card.style.left=CONTENU._pos[id].x+"px"; card.style.top=CONTENU._pos[id].y+"px";
        renderEdges(); };
      const up=()=>{ document.removeEventListener("pointermove",move); document.removeEventListener("pointerup",up);
        document.body.classList.remove("drag-none"); autosave(); };
      document.addEventListener("pointermove",move); document.addEventListener("pointerup",up);
    };
  });
}

/* ============================================================
   4) INTERACTION GRAPHE
   ============================================================ */
function clicChamp(pid,ch){
  flagged.clear(); formPiece=formPieceEdit=formChamp=null; pendingDel=null;
  const meme=s=>s&&s.pid===pid&&s.champ===ch;
  if(meme(selA)){ selA=selB; selB=null; }
  else if(meme(selB)){ selB=null; }
  else if(!selA){ selA={pid,champ:ch}; }
  else if(!selB){ selB={pid,champ:ch}; }
  else { selB={pid,champ:ch}; }
  selEdge=null; hint();
  render();
}
function clicEdge(i){ selEdge=i; selA=selB=null; flagged.clear(); formPiece=formPieceEdit=formChamp=null; pendingDel=null; render(); }

function creerLien(forme){
  if(!selA||!selB) return;
  const cand={forme, termes:[K(selA.pid,selA.champ),K(selB.pid,selB.champ)]};
  if((CONTENU.liens||[]).some(L=>memeLien(L,cand))){ toastInsp("Ce lien existe déjà."); return; }
  pushUndo();
  CONTENU.liens.push(cand);
  selEdge=CONTENU.liens.length-1; selA=selB=null;
  autosave(); render();
}
/* Conclure un lien existant : la phrase close devient le terme d'une
   liaison de qualification (arité 1). C'est la chaîne du vice en deux temps. */
function conclureLien(i,forme){
  const L=CONTENU.liens[i]; if(!L) return;
  const cand={forme, termes:[{forme:L.forme, termes:clone(L.termes||[])}]};
  if((CONTENU.liens||[]).some(M=>memeLien(M,cand))){ toastInsp("Cette conclusion existe déjà."); return; }
  pushUndo();
  CONTENU.liens.push(cand);
  selEdge=CONTENU.liens.length-1;
  autosave(); render();
}
/* Les formes offertes, rangées par arité — c'est la grammaire qui les déclare. */
function formesParArite(n){
  return Object.entries(((CONTENU.grammaire||{}).formes)||{})
    .filter(([,f])=>(f.arite||2)===n).map(([k])=>k);
}


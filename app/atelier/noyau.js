/* ATELIER — LE NOYAU : le contenu chargé, les outils, l'état d'interface,
   l'annulation, les onglets, l'échappement. Il se charge EN PREMIER — seul
   fichier dont le corps s'exécute au chargement (§13). */
/* ---- LE CONTENU — celui de content.js, et lui seul ---- */
const LIVRE = (typeof window!=="undefined" && window.CONTENU)
            ? JSON.parse(JSON.stringify(window.CONTENU)) : null;
if(typeof window!=="undefined") window.LIVRE=LIVRE;   // exposé (console, tests)

const ANNOTATIONS = {
  _bruit:["p_pv.e_app","p_pv.e_equip","p_pv.e_porte","t_voisin.e_vehic","t_voisin.e_pal",
          "p_adn.e_scA","p_adn.e_scB","p_scene.e_ou","p_scene.e_h","p_scene.e_hg",
          "p_ref.e_h2","p_ref.e_hg2"]
};

const CONTENU_VIDE = () => ({ schema:3, dimensions:["quand","qui","ou","quoi","combien"],
  pieces:{}, grammaire:{ depart:"S0", finaux:["FIN"], blocs:[], formes:{} },
  liens:[], remises:[], repetition:{ intro:"", affirmations:[], fin:"" },
  avocat:{}, directives:[], fins:{} });
function contenuLivre(){
  const c = LIVRE ? clone(LIVRE) : CONTENU_VIDE();
  return Object.assign(c, clone(ANNOTATIONS));
}

let CONTENU = contenuLivre();


/* ---- OUTILS ---- */
function clone(o){ return JSON.parse(JSON.stringify(o)); }
const $ = id => document.getElementById(id);
const joli = k => k.replace(/_/g," ");
const K = (pid,ch) => pid+"."+ch;
function deK(k){ const s=String(k), i=s.indexOf("."); return i<0 ? [s,""] : [s.slice(0,i), s.slice(i+1)]; }
function sanId(s){ return String(s||"").trim().replace(/[^\p{L}\p{N}_]/gu,"_").replace(/_+/g,"_").replace(/^_|_$/g,""); }
const estRegle = p => window.ReglesJeu.estRegle(p);
/* PIÈGE — ce n'est PAS le `attentesDe` de regles.js : celui-ci rend, pour une
   remise à l'ancienne, la remise ELLE-MÊME, pour que l'inspecteur l'édite en
   place. *On ne les fusionne pas, on dit lequel est lequel* (§17). */
function attentesDeRemise(r){
  if(!r) return [];
  if(Array.isArray(r.attentes)) return r.attentes;
  return r.attend ? [r] : [];
}
function empanDe(pid,eid){ const p=CONTENU.pieces[pid]; return p && p.empans && p.empans[eid]; }
function empanExiste(pid,eid){ return !!empanDe(pid,eid); }
/* PIÈGE — la dimension d'un EMPAN ne s'appelle plus `dimDe` : c'est le nom que
   `moteur.js` donne à celle d'un TERME RÉDUIT. Deux questions, deux noms. */
function dimEmpan(pid,eid){ const e=empanDe(pid,eid); return e && e.dim; }
function toutesDims(){ return [...(CONTENU.dimensions||[])]; }
function estBruit(pid,eid){ return (CONTENU._bruit||[]).includes(K(pid,eid)); }
/* PIÈGE — TOUTES les pièces qu'une remise livre ; `piecesLivrees(S)` de
   regles.js est PROGRESSIF. Deux questions, deux noms. */
function toutesPiecesLivrees(){
  const s=new Set(); for(const r of CONTENU.remises||[]) for(const p of r.pieces||[]) s.add(p); return s;
}
function empansPlats(){
  return window.MoteurGrammaire ? window.MoteurGrammaire.champsDe(CONTENU) : [];
}
let _mg=null, _mgSig=null;
function MG(){
  if(!window.MoteurGrammaire) return null;
  const sig=JSON.stringify([CONTENU.grammaire,CONTENU.pieces,CONTENU.liens]);
  if(sig!==_mgSig){
    _mgSig=sig;
    _mg=window.MoteurGrammaire.creerMoteur(
      CONTENU.grammaire||{depart:"S0",finaux:["FIN"],blocs:[],formes:{}},
      empansPlats(), CONTENU.liens||[]);
  }
  return _mg;
}
const formeDe = f => ((CONTENU.grammaire||{}).formes||{})[f];
function termesFeuilles(t,out){
  out=out||[];
  if(typeof t==="string") out.push(t);
  else if(t&&Array.isArray(t.termes)) for(const u of t.termes) termesFeuilles(u,out);
  return out;
}
function feuillesLien(L){ return termesFeuilles({termes:L.termes||[]}); }
function memeLien(L,M){
  const m=MG();
  if(m) return m.memeRed({forme:L.forme,termes:L.termes||[]},{forme:M.forme,termes:M.termes||[]});
  return L.forme===M.forme && JSON.stringify(L.termes)===JSON.stringify(M.termes);
}
function courtDe(pid){ const p=CONTENU.pieces[pid]; return p?(p.court||pid):pid; }
function texteForme(f){
  const b=((CONTENU.grammaire||{}).blocs||[]).find(x=>x.forme===f);
  return b ? b.texte : (f||"?");
}
function labelLien(L){
  const t=(L.termes||[]).map(x=>typeof x==="string" ? cflabel(x) : "« "+labelLien(x)+" »");
  return (formeDe(L.forme)||{}).arite===1
    ? `${t[0]||"…"} ${texteForme(L.forme)}`
    : `${t[0]||"…"} ${texteForme(L.forme)} ${t[1]||"…"}`;
}

function reecrireTermes(t,f){
  return Array.isArray(t) ? t.map(u=>reecrireTermes(u,f))
       : typeof t==="string" ? f(t)
       : {...t, termes:reecrireTermes(t.termes||[],f)};
}

/* état d'interface */
let selA=null, selB=null;
let selEdge=null;
let flagged=new Set();
let formPiece=null;
let formPieceEdit=null;
let formChamp=null;
let pendingDel=null;
let VUE="graphe";

/* ---- undo (Ctrl+Z) ---- */
let UNDO=[];
function pushUndo(){ UNDO.push(JSON.stringify(CONTENU)); if(UNDO.length>30) UNDO.shift(); majUndoBtn(); }
function undo(){
  if(!UNDO.length) return;
  CONTENU=JSON.parse(UNDO.pop()); window.CONTENU=CONTENU;
  reinitSelection();
  majUndoBtn(); autosave(); render();
}

/* LES QUATRE GESTES QUE TOUT L'ATELIER REFAIT — ils ne décident rien.
   TOUS SONT DES `function` DÉCLARÉES, et il le faut : `btnSuppr` engendre un
   `onclick` qui vise `demanderSuppr`, et seule une déclaration de fonction est
   une propriété de `window` (R2, R5). */

/* 1. L'ÉPILOGUE D'UNE MUTATION : `pushUndo()` AVANT, `autosave(); render()`
   APRÈS. Une mutation qui doit renoncer garde sa garde avant l'appel — `muter`
   ne se laisse pas interrompre de l'intérieur. */
function muter(f){ pushUndo(); f(); autosave(); render(); }

/* 2. ÉCRIRE, OU RETIRER LA CLÉ QUAND C'EST VIDE : l'export ne doit emporter
   aucune clé vide, un booléen faux compris. */
function poserOuRetirer(obj,prop,v,opts){
  const vide = typeof v==="string" ? !v.trim() : !v;
  if(vide){ delete obj[prop]; return; }
  obj[prop] = ((opts||{}).trim && typeof v==="string") ? v.trim() : v;
}

/* 3. LA REMISE À ZÉRO DE LA SÉLECTION. Sept endroits l'écrivaient, et PAS DEUX
   PAREILLES. Une exception, de nature : `clicChamp` construit sa paire d'empans
   (`garderEmpans`). */
function reinitSelection(opts){
  if(!(opts||{}).garderEmpans){ selA=null; selB=null; }
  selEdge=null; flagged.clear();
  formPiece=formPieceEdit=formChamp=null;
  pendingDel=null;
}

/* 4. LA SUPPRESSION EN DEUX CLICS : le bouton armé change de CLASSE et de MOT
   ensemble, sans quoi il ment. */
function demanderSuppr(cle,faire){
  if(pendingDel!==cle){ pendingDel=cle; return render(); }
  pendingDel=null; muter(faire);
}
/* PIÈGE : `${arme?"arm":""}` et jamais `${arme?" arm":""}` — un espace en tête
   casserait le nom de la classe CSS engendrée. */
function btnSuppr(cle,cls,appel,mot,motArme){
  const arme = pendingDel===cle;
  return `<button class="${cls} ${arme?"arm":""}" onclick="${appel}">${arme?motArme:mot}</button>`;
}
function majUndoBtn(){ const b=$("btnUndo"); if(b) b.disabled=!UNDO.length; }
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){ e.preventDefault(); undo(); }
});

let _hintDefaut=null;
function hint(msg,err){
  const el=$("tbHint");
  if(_hintDefaut===null) _hintDefaut=el.textContent;
  el.textContent=msg||_hintDefaut;
  el.classList.toggle("err",!!err);
}


/* ---- ONGLETS ---- */
function vue(v){
  VUE=v;
  $("main").classList.toggle("jsonmode",v==="json");
  $("main").classList.toggle("etapesmode",v==="etapes");
  $("main").classList.toggle("grammode",v==="grammaire");
  $("tabJson").classList.toggle("on",v==="json");
  $("tabEtapes").classList.toggle("on",v==="etapes");
  $("tabGraphe").classList.toggle("on",v==="graphe");
  $("tabGrammaire").classList.toggle("on",v==="grammaire");
  if(v==="json") remplirJson();
  if(v==="graphe") render();      // recalcule les traits (le canevas était masqué)
  if(v==="etapes") renderEtapes();
  if(v==="grammaire") renderGrammaire();
}
function remplirJson(){ $("jsonta").value=JSON.stringify(CONTENU,null,2); $("jsonmsg").textContent=""; }
function appliquerJson(){
  try{ const j=JSON.parse($("jsonta").value); const err=adopter(j);
    if(err){ $("jsonmsg").style.color="var(--err)"; $("jsonmsg").textContent="Refusé : "+err; }
    else { $("jsonmsg").style.color="var(--ok)"; $("jsonmsg").textContent="✓ Appliqué."; }
  }catch(err){ $("jsonmsg").style.color="var(--err)"; $("jsonmsg").textContent="JSON invalide : "+err.message; }
}


/* ---- L'ÉCHAPPEMENT — le même couple de noms que le jeu (§17) ---- */
function escapeH(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escapeAttr(s){ return escapeH(s).replace(/"/g,"&quot;"); }

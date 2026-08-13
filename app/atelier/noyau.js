/* ATELIER — LE NOYAU : le contenu chargé, les outils, l'état d'interface,
   l'annulation, les onglets, l'échappement. Il se charge EN PREMIER — seul
   fichier dont le corps s'exécute au chargement (§13). */
/* ============================================================
   1) LE CONTENU — celui de content.js, et lui seul.
   ============================================================ */
/* Le contenu tel qu'il est arrivé, mis de côté avant qu'on y touche :
   « Recharger content.js » y revient. */
const LIVRE = (typeof window!=="undefined" && window.CONTENU)
            ? JSON.parse(JSON.stringify(window.CONTENU)) : null;
if(typeof window!=="undefined") window.LIVRE=LIVRE;   // exposé (console, tests)

/* Les ANNOTATIONS d'atelier ne sont pas du contenu : l'export retire toute clé
   « _ ». `_bruit` est une note d'auteur, jamais une donnée que le jeu lit. */
const ANNOTATIONS = {
  _bruit:["p_pv.e_app","p_pv.e_equip","p_pv.e_porte","t_voisin.e_vehic","t_voisin.e_pal",
          "p_adn.e_scA","p_adn.e_scB","p_scene.e_ou","p_scene.e_h","p_scene.e_hg",
          "p_ref.e_h2","p_ref.e_hg2"]
};

/* Un contenu vide et bien formé, si content.js n'a pas été chargé : l'atelier
   s'ouvre quand même et le dit, au lieu de refuser de démarrer. */
const CONTENU_VIDE = () => ({ schema:3, dimensions:["quand","qui","ou","quoi","combien"],
  pieces:{}, grammaire:{ depart:"S0", finaux:["FIN"], blocs:[], formes:{} },
  liens:[], remises:[], repetition:{ intro:"", affirmations:[], fin:"" },
  avocat:{}, directives:[], fins:{} });
function contenuLivre(){
  const c = LIVRE ? clone(LIVRE) : CONTENU_VIDE();
  return Object.assign(c, clone(ANNOTATIONS));
}

let CONTENU = contenuLivre();


/* ============================================================
   2) OUTILS
   ============================================================ */
function clone(o){ return JSON.parse(JSON.stringify(o)); }
const $ = id => document.getElementById(id);
const joli = k => k.replace(/_/g," ");
const K = (pid,ch) => pid+"."+ch;
/* L'INVERSE de K : une clé se fabrique par K et se défait par deK, le format
   n'est écrit qu'ici. On coupe au PREMIER point — c'est le pid qui ne peut pas
   en contenir. */
function deK(k){ const s=String(k), i=s.indexOf("."); return i<0 ? [s,""] : [s.slice(0,i), s.slice(i+1)]; }
function sanId(s){ return String(s||"").trim().replace(/[^\p{L}\p{N}_]/gu,"_").replace(/_+/g,"_").replace(/^_|_$/g,""); }
/* Un seul exemplaire, dans regles.js : c'est une règle, pas une commodité
   d'atelier. Export statique, donc disponible même sans `JEU` lié (§12). */
const estRegle = p => window.ReglesJeu.estRegle(p);
/* La liste d'attentes d'une remise (§3). ATTENTION — ce n'est PAS le
   `attentesDe` de regles.js : celui-ci rend, pour une remise à l'ancienne, la
   remise ELLE-MÊME, pour que l'inspecteur l'édite en place. *On ne les fusionne
   pas, on dit lequel est lequel* (docs/CARTE.md). */
function attentesDeRemise(r){
  if(!r) return [];
  if(Array.isArray(r.attentes)) return r.attentes;
  return r.attend ? [r] : [];
}
function empanDe(pid,eid){ const p=CONTENU.pieces[pid]; return p && p.empans && p.empans[eid]; }
function empanExiste(pid,eid){ return !!empanDe(pid,eid); }
/* La dimension d'un EMPAN. ELLE NE S'APPELLE PLUS `dimDe` : c'est le nom que
   `moteur.js` donne à celle d'un TERME RÉDUIT, qui répond « affirmation » pour
   un terme emboîté. Deux questions, deux noms (docs/CARTE.md). */
function dimEmpan(pid,eid){ const e=empanDe(pid,eid); return e && e.dim; }
function toutesDims(){ return [...(CONTENU.dimensions||[])]; }
function estBruit(pid,eid){ return (CONTENU._bruit||[]).includes(K(pid,eid)); }
/* TOUTES les pièces qu'une remise livre : l'atelier regarde le dossier fini. À
   ne pas confondre avec `piecesLivrees(S)` de regles.js, PROGRESSIF — deux
   questions, deux noms (docs/CARTE.md). */
function toutesPiecesLivrees(){
  const s=new Set(); for(const r of CONTENU.remises||[]) for(const p of r.pieces||[]) s.add(p); return s;
}
/* Les empans aplatis en "pid.eid" — le vocabulaire des TERMES. L'aplatissement
   vit dans moteur.js, en un exemplaire (§12). Sans moteur chargé, le dossier n'a
   pas de vocabulaire, et le diagnostic le dit. */
function empansPlats(){
  return window.MoteurGrammaire ? window.MoteurGrammaire.champsDe(CONTENU) : [];
}
/* Le moteur de grammaire, appliqué au contenu courant. Reconstruit seulement
   quand le contenu change. null si moteur.js n'a pas pu être chargé. */
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
/* Les empans-feuilles d'un lien, quel que soit son emboîtement. */
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
/* Le texte d'un lien, lisible. La liaison est nommée par le bloc de la
   grammaire qui porte cette forme (c'est elle qui porte la base légale). */
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

/* La marche récursive sur les termes d'un lien, avec substitution aux FEUILLES.
   L'emboîtement du schéma 3 est un format : on ne le déplie qu'ici. */
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

/* 2 bis) LES QUATRE GESTES QUE TOUT L'ATELIER REFAIT. Ils ne décident rien : ils
   nomment ce qui était recopié soixante fois, jamais deux fois pareil.
   TOUS SONT DES `function` DÉCLARÉES, et il le faut : `btnSuppr` engendre un
   `onclick` qui vise `demanderSuppr`, et seule une déclaration de fonction est
   une propriété de `window` (§2 de la passation). */

/* 1. L'ÉPILOGUE D'UNE MUTATION : `pushUndo()` avant, `autosave(); render()`
   après. Une seule ordonnance — et une mutation qui doit renoncer garde sa garde
   AVANT l'appel, `muter` ne se laisse pas interrompre de l'intérieur. */
function muter(f){ pushUndo(); f(); autosave(); render(); }

/* 2. ÉCRIRE, OU RETIRER LA CLÉ QUAND C'EST VIDE : l'export ne doit emporter
   aucune clé vide. Un booléen faux se retire aussi (`une_fois`, les drapeaux). */
function poserOuRetirer(obj,prop,v,opts){
  const vide = typeof v==="string" ? !v.trim() : !v;
  if(vide){ delete obj[prop]; return; }
  obj[prop] = ((opts||{}).trim && typeof v==="string") ? v.trim() : v;
}

/* 3. LA REMISE À ZÉRO DE LA SÉLECTION. Sept endroits l'écrivaient, et PAS DEUX
   PAREILLES — celle de `pointer()` oubliait `formPieceEdit`, et cliquer une
   ligne du diagnostic ne montrait alors rien. Une exception, de nature :
   `clicChamp` construit sa paire d'empans (`garderEmpans`). */
function reinitSelection(opts){
  if(!(opts||{}).garderEmpans){ selA=null; selB=null; }
  selEdge=null; flagged.clear();
  formPiece=formPieceEdit=formChamp=null;
  pendingDel=null;
}

/* 4. LA SUPPRESSION EN DEUX CLICS : le bouton armé change de CLASSE et de MOT
   ensemble, sans quoi il ment — les deux moitiés du geste vivent côte à côte. */
function demanderSuppr(cle,faire){
  if(pendingDel!==cle){ pendingDel=cle; return render(); }
  pendingDel=null; muter(faire);
}
/* Le fragment s'écrit `${arme?"arm":""}`, jamais `${arme?" arm":""}` : R4 relève
   une classe dans une chaîne qui n'est QU'un mot — un espace en tête, et `.arm`
   passe pour une famille morte. */
function btnSuppr(cle,cls,appel,mot,motArme){
  const arme = pendingDel===cle;
  return `<button class="${cls} ${arme?"arm":""}" onclick="${appel}">${arme?motArme:mot}</button>`;
}
function majUndoBtn(){ const b=$("btnUndo"); if(b) b.disabled=!UNDO.length; }
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){ e.preventDefault(); undo(); }
});

/* L'aide par défaut est celle que le HTML porte déjà : on la retient au premier
   passage plutôt que de la réécrire ici — une phrase, un exemplaire. */
let _hintDefaut=null;
function hint(msg,err){
  const el=$("tbHint");
  if(_hintDefaut===null) _hintDefaut=el.textContent;
  el.textContent=msg||_hintDefaut;
  el.classList.toggle("err",!!err);
}


/* ============================================================
   10) ONGLETS
   ============================================================ */
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


/* ============================================================
   11) L'ÉCHAPPEMENT — le même couple de noms que le jeu (docs/CARTE.md)
   ============================================================ */
/* Le même échappement que le `esc` du jeu, sous un autre nom : aucun fichier
   n'est chargé par les deux pages où poser la fonction commune. Doublet assumé —
   *deux noms pour une chose se remarquent, un nom pour deux choses se subit*
   (docs/CARTE.md). */
function escapeH(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escapeAttr(s){ return escapeH(s).replace(/"/g,"&quot;"); }

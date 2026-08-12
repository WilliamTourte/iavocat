/* ============================================================
   ATELIER — LE NOYAU
   Le contenu chargé, les outils, l'état d'interface, l'annulation, les
   onglets, l'échappement. Tout le reste en dépend : ce fichier se charge
   EN PREMIER (c'est le seul dont le corps s'exécute au chargement — son
   `let CONTENU = contenuLivre()`). Voir docs/ARCHITECTURE.md §13.
   ============================================================ */
/* ============================================================
   1) LE CONTENU — celui de content.js, et lui seul.
   ============================================================ */
/* Le contenu tel qu'il est arrivé, mis de côté avant qu'on y touche :
   « Recharger content.js » y revient. */
const LIVRE = (typeof window!=="undefined" && window.CONTENU)
            ? JSON.parse(JSON.stringify(window.CONTENU)) : null;
if(typeof window!=="undefined") window.LIVRE=LIVRE;   // exposé (console, tests)

/* Les ANNOTATIONS d'atelier, elles, appartiennent à l'atelier : elles ne sont
   pas du contenu (l'export les retire, comme toute clé « _ »). `_bruit` marque
   les empans qu'on veut voir rester inertes — c'est une note d'auteur sur le
   dossier, pas une donnée que le jeu lit. */
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
function sanId(s){ return String(s||"").trim().replace(/[^\p{L}\p{N}_]/gu,"_").replace(/_+/g,"_").replace(/^_|_$/g,""); }
/* Un seul exemplaire, dans regles.js : c'est une règle, pas une commodité
   d'atelier. Export statique, donc disponible même sans `JEU` lié (§12). */
const estRegle = p => window.ReglesJeu.estRegle(p);
/* La liste d'attentes d'une remise (§3). ATTENTION — ce n'est PAS le
   `attentesDe` de regles.js, et la différence est voulue : celui-ci rend, pour
   une remise écrite à l'ancienne, la remise ELLE-MÊME (`[r]`) et non une paire
   recopiée, pour que l'inspecteur l'édite en place. Sur une affaire au schéma 3
   les deux rendent le même tableau `r.attentes`. Deux fonctions, deux emplois :
   on ne les fusionne pas, on dit lequel est lequel (docs/LEXIQUE.md). */
function attentesDeRemise(r){
  if(!r) return [];
  if(Array.isArray(r.attentes)) return r.attentes;
  return r.attend ? [r] : [];
}
function empanDe(pid,eid){ const p=CONTENU.pieces[pid]; return p && p.empans && p.empans[eid]; }
function empanExiste(pid,eid){ return !!empanDe(pid,eid); }
/* La dimension d'un empan est écrite SUR l'empan — il n'y a plus de table
   globale ni de surcharge par pièce (schéma 3). */
function dimDe(pid,eid){ const e=empanDe(pid,eid); return e && e.dim; }
function toutesDims(){ return [...(CONTENU.dimensions||[])]; }
function estBruit(pid,eid){ return (CONTENU._bruit||[]).includes(K(pid,eid)); }
/* TOUTES les pièces qu'une remise livre, à un moment ou à un autre — l'atelier
   regarde le dossier fini. À ne pas confondre avec `piecesLivrees(S)` de
   regles.js, qui est PROGRESSIF (jusqu'à `S.remisesEnvoyees`) : deux questions
   différentes, donc deux noms (docs/LEXIQUE.md). */
function toutesPiecesLivrees(){
  const s=new Set(); for(const r of CONTENU.remises||[]) for(const p of r.pieces||[]) s.add(p); return s;
}
/* Tous les empans du dossier, aplatis en "pid.eid" — le vocabulaire des TERMES.
   L'aplatissement vit dans moteur.js : l'atelier en portait une copie identique
   à celle du jeu au caractère près, et deux exemplaires divergent en silence
   (§12). Sans moteur chargé (file:// incomplet), le dossier n'a pas de
   vocabulaire — le diagnostic et l'onglet Grammaire le disent déjà. */
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
  selA=selB=null; selEdge=null; flagged.clear(); formPiece=formPieceEdit=formChamp=null; pendingDel=null;
  majUndoBtn(); autosave(); render();
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
   11) L'ÉCHAPPEMENT — le même couple de noms que le jeu (docs/LEXIQUE.md)
   ============================================================ */
function escapeH(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escapeAttr(s){ return escapeH(s).replace(/"/g,"&quot;"); }

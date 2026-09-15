/* ATELIER — IMPORT / EXPORT / MIGRATION / PERSISTANCE. */
/* 9) IMPORT / EXPORT / PERSISTANCE */
function nettoyerPourJeu(obj){ const o=clone(obj); for(const k of Object.keys(o)) if(k.startsWith("_")) delete o[k]; o.schema=3; return o; }
function telecharger(nom,data,type){
  try{
    const blob=new Blob([data],{type});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=nom; a.click(); URL.revokeObjectURL(a.href);
    return true;
  }catch(e){ vue("json"); $("jsonmsg").style.color="var(--warn)";
    $("jsonmsg").textContent="Téléchargement bloqué ici — copie le JSON ci-dessus."; return false; }
}
function exporter(){
  telecharger("content.json", JSON.stringify(nettoyerPourJeu(CONTENU),null,2), "application/json");
}
/* LE TEXTE DU FICHIER, en un exemplaire : l'écriture sur place l'écrit, le
   repli le télécharge, la suite le relit. */
function sourceContenuJS(){
  return "/* LE CONTENU DE L'AFFAIRE — l'unique exemplaire. Le jeu (index.html) et\n"
    + "   l'atelier (atelier_v3.html) chargent ce même fichier ; il n'y a plus ni\n"
    + "   copie embarquée ni graine d'atelier. On l'écrit dans l'atelier, qui le\n"
    + "   réécrit par-dessus (« Écrire content.js »). Voir docs/ARCHITECTURE.md §12. */\n"
    + "window.CONTENU = " + JSON.stringify(nettoyerPourJeu(CONTENU),null,2) + ";\n";
}

/* LA POIGNÉE DU FICHIER, RETENUE D'UNE SESSION À L'AUTRE : `localStorage` ne
   peut pas la garder, IndexedDB si — et elle marche en file:// (éprouvé sous
   Chrome). Toute panne de rangement se tait : sans poignée, on redésigne. */
const IDB_BASE="iavocat_atelier", IDB_LOT="poignees", IDB_CLE="content.js";
function idb(){
  return new Promise((ok,ko)=>{
    const r=indexedDB.open(IDB_BASE,1);
    r.onupgradeneeded=()=>r.result.createObjectStore(IDB_LOT);
    r.onsuccess=()=>ok(r.result); r.onerror=()=>ko(r.error);
  });
}
async function poigneeRangee(){
  try{
    const db=await idb();
    return await new Promise((ok,ko)=>{
      const q=db.transaction(IDB_LOT).objectStore(IDB_LOT).get(IDB_CLE);
      q.onsuccess=()=>ok(q.result||null); q.onerror=()=>ko(q.error);
    });
  }catch(e){ return null; }
}
async function rangerPoignee(h){
  try{
    const db=await idb();
    await new Promise((ok,ko)=>{
      const t=db.transaction(IDB_LOT,"readwrite");
      t.objectStore(IDB_LOT).put(h,IDB_CLE);
      t.oncomplete=ok; t.onerror=()=>ko(t.error);
    });
  }catch(e){}
}
/* PIÈGE : Chrome retient la POIGNÉE, jamais le DROIT — il se redemande à chaque
   session, et seulement sous un geste de l'auteur. D'où : rien ne s'écrit ici au
   chargement ni sur un `render`. */
async function droitEcriture(h){
  if(!h || typeof h.queryPermission!=="function") return false;
  const quoi={mode:"readwrite"};
  if(await h.queryPermission(quoi)==="granted") return true;
  return await h.requestPermission(quoi)==="granted";
}

/* « Écrire content.js » — le fichier que le jeu charge, réécrit sur place (§10).
   ALT+CLIC redésigne le fichier. AUCUN ÉCHEC MUET : sans File System Access, sur
   droit refusé ou poignée creuse, on retombe sur le téléchargement et le bouton
   le dit ; une poignée qui a échoué est jetée. */
async function exporterJS(ev){
  const data=sourceContenuJS();
  const replier=mot=>{ if(telecharger("content.js",data,"text/javascript")) direSurBouton(mot); };
  if(typeof window.showSaveFilePicker!=="function"){ replier("téléchargé — à poser dans app/"); return; }
  let h = (ev && ev.altKey) ? null : await poigneeRangee();
  try{
    if(!h){
      h=await window.showSaveFilePicker({ id:"iavocat_contenu", suggestedName:"content.js",
        types:[{ description:"Le contenu du jeu", accept:{"text/javascript":[".js"]} }] });
      await rangerPoignee(h);
    }
    if(!await droitEcriture(h)) throw new Error("droit d'écriture refusé");
    const flux=await h.createWritable();
    await flux.write(data); await flux.close();
    direSurBouton("✓ "+h.name+" écrit");
  }catch(e){
    if(e && e.name==="AbortError"){ direSurBouton(null); return; }   // fichier non désigné : rien n'a eu lieu
    await rangerPoignee(null);
    replier("écriture impossible — téléchargé");
  }
}
/* LE BOUTON DIT CE QUI VIENT DE SE PASSER, pas le `hint` : celui-ci n'est
   visible que dans l'onglet Graphe, le bouton l'est partout. */
let _motBouton=null, _minuteurBouton=null;
function direSurBouton(txt){
  const b=$("btnEcrire"); if(!b) return;
  if(_motBouton===null) _motBouton=b.textContent;
  if(_minuteurBouton) clearTimeout(_minuteurBouton);
  b.textContent = txt || _motBouton;
  _minuteurBouton = txt ? setTimeout(()=>{ b.textContent=_motBouton; }, 4000) : null;
}
$("file").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ try{ const j=JSON.parse(r.result); const err=adopter(j);
      if(err) hint("Import refusé : "+err,true); else hint("Import réussi.");
    }catch(err){ hint("JSON invalide : "+err.message,true); } };
  r.readAsText(f); e.target.value="";
});
/* Migration 2 → 3 (§11) : idempotente, silencieuse, à l'import et au chargement
   de l'autosave. Le JEU, lui, ne migre pas. */
const GRAMMAIRE_PAR_DEFAUT = () => clone(contenuLivre().grammaire);
const DIMS_PAR_DEFAUT = () => clone(contenuLivre().dimensions);
/* Les dimensions d'avant ne sont pas les cinq du QQOQC : on rabat ce qui se
   rabat, le reste tombe dans « quoi » (large par construction, §4.2). */
const RABAT_DIM = { agent:"qui", personne:"qui", signature:"qui", greffier:"qui",
                    heure:"quand", date:"quand",
                    lieu:"ou",
                    scellé:"quoi", scelle:"quoi", charge:"quoi", conclusion:"quoi",
                    sanction:"quoi", logistique:"quoi", source:"quoi",
                    seuil:"combien", nombre:"combien", montant:"combien" };
function migrerContenu(j){
  if(!j||typeof j!=="object") return j;
  const dep=j.schema||2;
  if(dep>=3){ j.schema=3; return j; }

  // -- 1. les dimensions --
  const dimsAvant = k => ({}).hasOwnProperty.call(RABAT_DIM,k) ? RABAT_DIM[k] : null;
  j.dimensions = Array.isArray(j.dimensions)&&j.dimensions.length ? j.dimensions : DIMS_PAR_DEFAUT();

  // -- 2. champs → empans, et les marqueurs dans le texte --
  const anciennesDims = j.dims||{};
  for(const p of Object.values(j.pieces||{})){
    if(!p || p.empans) continue;
    const empans={};
    for(const [ch,v] of Object.entries(p.champs||{})){
      const brute = (p.dims||{})[ch] ?? anciennesDims[ch];
      const dim = dimsAvant(brute) || (j.dimensions.includes(brute)?brute:"quoi");
      empans[ch]={ dim, valeur:String(v), texte:String(v) };
    }
    p.empans=empans;
    delete p.champs; delete p.dims;
    // tout empan doit être marqué, sinon il est inatteignable (§4.3)
    const txt=String(p.texte||"");
    const manquants=Object.keys(empans).filter(e=>!txt.includes("{{"+e+"}}"));
    p.texte = txt + (manquants.length ? (txt?" ":"")+manquants.map(e=>"{{"+e+"}}").join(" ") : "");
  }

  // -- 3. la grammaire : elle n'existait pas --
  if(!j.grammaire || !Array.isArray(j.grammaire.blocs)) j.grammaire=GRAMMAIRE_PAR_DEFAUT();

  // -- 4. liens par paires → {forme, termes} --
  const formeDePaire = rel => String(rel||"").includes("désaccord") ? "identite_non" : "identite_oui";
  j.liens=(j.liens||[]).map(L=>{
    if(L.forme) return L;                       // déjà au schéma 3
    if(!Array.isArray(L.a)||!Array.isArray(L.b)) return null;
    const out={ forme:formeDePaire(L.rel), termes:[L.a.join("."),L.b.join(".")] };
    if(L.vice) out.vice=true;
    if(L.faux) out.faux=true;
    if(L.rep)  out.rep=L.rep;
    return out;
  }).filter(Boolean);

  // -- 5. les cases disparaissent ; ce qu'elles portaient se reloge --
  for(const [,c] of Object.entries(j.cases||{})){
    const r=(j.remises||[])[(c.remise||1)-1];
    if(!r || !c.apres || !c.apres.replique) continue;
    /* L'accusé se pose sur la PREMIÈRE ATTENTE, jamais sur la remise (§11) : posé
       sur la remise, il ne serait lisible ni par le jeu ni par l'atelier.
       ON N'INVENTE AUCUNE ATTENTE pour autant — une attente sans `attend` serait
       non servie POUR TOUJOURS, et la clôture ne s'ouvrirait jamais. */
    const as=attentesDeRemise(r);
    if(as.length){ if(!as[0].apres) as[0].apres={...c.apres}; }
    else if(!r.apres) r.apres={...c.apres};
  }
  delete j.cases; delete j.relations; delete j.dims; delete j.attention;

  // -- 6. les répliques d'avant le décâblage (schéma 1) --
  const A=j.avocat||{};
  delete A.tentation_adn; delete A.ack_decisive;

  j.schema=3;
  return j;
}

function adopter(j){
  if(!j || typeof j!=="object") return "ce n'est pas un objet JSON.";
  migrerContenu(j);
  if(!j.pieces || typeof j.pieces!=="object" || Array.isArray(j.pieces)) return "clé « pieces » absente ou invalide.";
  if(!Array.isArray(j.liens)) return "clé « liens » absente ou invalide (tableau attendu).";
  if(!Array.isArray(j.dimensions) || !j.dimensions.length) return "clé « dimensions » absente ou vide.";
  if(!j.grammaire || !Array.isArray(j.grammaire.blocs) || !j.grammaire.formes)
    return "clé « grammaire » absente ou invalide (blocs + formes attendus).";
  for(const [pid,p] of Object.entries(j.pieces))
    if(!p || typeof p!=="object" || !p.empans || typeof p.empans!=="object")
      return `pièce « ${pid} » sans objet « empans ».`;
  const uniq=[]; for(const L of j.liens){
    if(!L||!L.forme||!Array.isArray(L.termes)) continue;
    if(!uniq.some(M=>memeLien(M,L))) uniq.push(L);
  }
  j.liens=uniq;
  j._pos=j._pos||{}; j._bruit=j._bruit||[];
  /* Les huit refus ci-dessus renoncent AVANT `muter` : un import refusé ne
     laisse pas d'entrée d'annulation. */
  muter(()=>{
    CONTENU=j; window.CONTENU=CONTENU;
    reinitSelection();
    simReset();
    autoLayout(false);
  });
  return null;
}
/* Revenir à content.js tel qu'il est sur le disque : l'annulation d'une session
   d'écriture, pas un « exemple ». */
/* LA SIXIÈME CONFIRMATION EN DEUX CLICS, seule à ne pas passer par
   `demanderSuppr` : elle vise un bouton statique et s'annonce par le `hint`. */
function demanderExemple(){
  if(pendingDel!=="exemple"){ pendingDel="exemple"; hint("Recharger content.js efface le contenu courant — reclique pour confirmer.",true); return; }
  pendingDel=null; hint();
  muter(()=>{ CONTENU=contenuLivre(); window.CONTENU=CONTENU; simReset(); autoLayout(true); });
}

function autosave(){ try{ localStorage.setItem("iavocat_atelier_v2",JSON.stringify(CONTENU)); }catch(e){} }
function chargerAuto(){ try{ const s=localStorage.getItem("iavocat_atelier_v2"); if(s){ CONTENU=migrerContenu(JSON.parse(s)); return true; } }catch(e){} return false; }


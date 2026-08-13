/* ============================================================
   ATELIER — IMPORT / EXPORT / MIGRATION / PERSISTANCE.
   ============================================================ */
/* ============================================================
   9) IMPORT / EXPORT / PERSISTANCE
   ============================================================ */
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
function exporterJS(){
  const data="/* LE CONTENU DE L'AFFAIRE — l'unique exemplaire. Le jeu (index.html) et\n"
    + "   l'atelier (atelier_v3.html) chargent ce même fichier ; il n'y a plus ni\n"
    + "   copie embarquée ni graine d'atelier. On l'écrit dans l'atelier, qui le\n"
    + "   réexporte par-dessus (« Exporter content.js »). Voir docs/ARCHITECTURE.md §12. */\n"
    + "window.CONTENU = " + JSON.stringify(nettoyerPourJeu(CONTENU),null,2) + ";\n";
  telecharger("content.js", data, "text/javascript");
}
$("file").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ try{ const j=JSON.parse(r.result); const err=adopter(j);
      if(err) hint("Import refusé : "+err,true); else hint("Import réussi.");
    }catch(err){ hint("JSON invalide : "+err.message,true); } };
  r.readAsText(f); e.target.value="";
});
/* Migration du schéma 2 (champs + relations + cases) vers le schéma 3
   (empans + grammaire + attentes). Idempotente, silencieuse, appliquée à
   l'import et au chargement de l'autosave. Voir docs/ARCHITECTURE.md §8.
   Le JEU, lui, ne migre pas : il refuse un contenu de schéma 2. */
const GRAMMAIRE_PAR_DEFAUT = () => clone(contenuLivre().grammaire);
const DIMS_PAR_DEFAUT = () => clone(contenuLivre().dimensions);
/* Les dimensions d'avant ne sont pas les cinq du QQOQC : on rabat ce qui se
   rabat, le reste tombe dans « quoi » (large par construction, §2.2). */
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
  //    (l'accusé de réception d'une case migre sur sa session ; le reste
  //     est de l'écriture à reprendre à la main — signalé au diagnostic)
  for(const [,c] of Object.entries(j.cases||{})){
    const i=(c.remise||1)-1;
    const r=(j.remises||[])[i];
    if(r && !r.apres && c.apres && c.apres.replique) r.apres={...c.apres};
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
  pushUndo();
  CONTENU=j; window.CONTENU=CONTENU;
  reinitSelection();
  simReset();
  autoLayout(false); autosave(); render();
  return null;
}
/* Revenir à content.js tel qu'il est sur le disque, en jetant le travail en
   cours. C'est l'annulation d'une session d'écriture, pas un « exemple ». */
function demanderExemple(){
  if(pendingDel!=="exemple"){ pendingDel="exemple"; hint("Recharger content.js efface le contenu courant — reclique pour confirmer.",true); return; }
  pendingDel=null; hint();
  pushUndo();
  CONTENU=contenuLivre(); window.CONTENU=CONTENU; simReset(); autoLayout(true); autosave();
}

function autosave(){ try{ localStorage.setItem("iavocat_atelier_v2",JSON.stringify(CONTENU)); }catch(e){} }
function chargerAuto(){ try{ const s=localStorage.getItem("iavocat_atelier_v2"); if(s){ CONTENU=migrerContenu(JSON.parse(s)); return true; } }catch(e){} return false; }


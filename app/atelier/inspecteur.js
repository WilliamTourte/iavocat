/* ============================================================
   ATELIER — L'INSPECTEUR : les formulaires, les mutations, les
   suppressions en deux clics, les renommages d'identifiants.
   ============================================================ */
/* ============================================================
   6) INSPECTEUR
   ============================================================ */
function renderInsp(){
  const el=$("insp");
  if(formPiece) return el.innerHTML=inspFormPiece();
  if(formPieceEdit) return el.innerHTML=inspPiece(formPieceEdit);
  if(formChamp) return el.innerHTML=inspFormChamp();
  if(selEdge!=null && CONTENU.liens[selEdge]) return el.innerHTML=inspLien(selEdge);
  if(selA&&selB) return el.innerHTML=inspPaire();
  if(selA&&!selB) return el.innerHTML=inspEmpan(selA);
  el.innerHTML=`<div class="empty">Sélectionne un empan (ou un trait) pour l'éditer.<br>Deux empans → crée un lien.<br><br>Les liens de <b>qualification</b> (arité 1) se créent depuis un lien existant : clique son trait, puis « conclure par… ».</div>`
    + listeQualifications();
}
/* Les liens sans trait (arité 1) : ils se lisent ici, sinon ils seraient invisibles. */
function listeQualifications(){
  const q=(CONTENU.liens||[]).map((L,i)=>({L,i})).filter(x=>!paireVisible(x.L));
  if(!q.length) return "";
  return `<label style="margin-top:14px">Qualifications (sans trait)</label>`
    + q.map(x=>`<div class="ipath" style="cursor:pointer" onclick="clicEdge(${x.i})">
        ${x.L.vice?"⚑ ":""}${x.L.faux?"✗ ":""}${escapeH(labelLien(x.L))}</div>`).join("");
}

/* — formulaires de création (remplacent les dialogues natifs, bloqués en iframe sandboxée) —
   Ouvrir un formulaire, c'est abandonner la sélection en cours : `reinitSelection`
   (noyau.js) dit ce que ça veut dire, en un seul endroit. */
function formulairePiece(kind){ reinitSelection(); formPiece=kind; render(); }
function inspFormPiece(){
  const regle=formPiece==='regle';
  return `<label>Nouvelle ${regle?'règle':'pièce'}</label>
    <label>Identifiant <span class="glose">(ex. ${regle?'r_delai':'p_temoin2'})</span></label>
    <input type="text" id="npId" placeholder="${regle?'r_':'p_'}…">
    <label>Nom court (affiché)</label>
    <input type="text" id="npCourt" placeholder="ex. ${regle?'délai':'témoin 2'}">
    <label>Signataire <span class="glose">(qui parle dans cette pièce)</span></label>
    <input type="text" id="npQui" placeholder="ex. brigadier N.">
    <div class="relbtns">
      <button onclick="creerPiece()">Créer</button>
      <button onclick="formPiece=null;render()">Annuler</button>
    </div>`;
}
function creerPiece(){
  const pid=sanId($("npId").value);
  if(!pid){ toastInsp("Identifiant vide ou invalide."); return; }
  if(CONTENU.pieces[pid]){ toastInsp("Cet identifiant existe déjà."); return; }
  const court=$("npCourt").value.trim()||pid;
  pushUndo();
  CONTENU.pieces[pid]={ titre:court, court, type:formPiece==='regle'?"règle du manuel":"pièce",
    qui:$("npQui").value.trim()||"", resume:"", texte:"", empans:{} };
  CONTENU._pos[pid]=placeLibre(formPiece);
  formPiece=null;
  autosave(); render(); scrollVers(pid);
}
/* L'éditeur de pièce : son texte porte les marqueurs {{eid}}, donc c'est ici
   que se règle la règle de surlignage (§4.3 — tout empan est marqué). */
function formulairePieceEdit(pid){ reinitSelection(); formPieceEdit=pid; render(); }
function inspPiece(pid){
  const p=CONTENU.pieces[pid];
  const eids=Object.keys(p.empans||{});
  const txt=String(p.texte||"");
  return `<label>Pièce — ${escapeH(p.court||pid)}</label>
    <label>Titre</label>
    <input type="text" value="${escapeAttr(p.titre||"")}" onchange="majPiece('${pid}','titre',this.value)">
    <label>Nom court</label>
    <input type="text" value="${escapeAttr(p.court||"")}" onchange="majPiece('${pid}','court',this.value)">
    <label>Type <span class="glose">(« règle… » ⇒ va au Manuel du cas)</span></label>
    <input type="text" value="${escapeAttr(p.type||"")}" onchange="majPiece('${pid}','type',this.value)">
    <label>Signataire par défaut <span class="glose">(qui parle)</span></label>
    <input type="text" value="${escapeAttr(p.qui||"")}" onchange="majPiece('${pid}','qui',this.value)">
    <label>Résumé <span class="glose">(hors jeu — mémo d'atelier)</span></label>
    <textarea style="min-height:34px" onchange="majPiece('${pid}','resume',this.value)">${escapeH(p.resume||"")}</textarea>
    <label>Texte de la pièce <span class="glose">— place {{id}} là où chaque empan se lit</span></label>
    <textarea class="mono" style="min-height:120px" onchange="majPiece('${pid}','texte',this.value)">${escapeH(txt)}</textarea>
    <div style="font-size:11.5px;color:var(--dim);margin-top:6px">empans : ${
      eids.length ? eids.map(e=>`<code style="color:${txt.includes("{{"+e+"}}")?"var(--ok)":"var(--err)"}">{{${escapeH(e)}}}</code>`).join(" ")
                  : "aucun"}</div>
    <div class="relbtns"><button onclick="formPieceEdit=null;render()">Fermer</button></div>`;
}
function formulaireChamp(pid){ reinitSelection(); formChamp=pid; render(); }
function inspFormChamp(){
  const p=CONTENU.pieces[formChamp];
  return `<label>Nouvel empan — ${escapeH(p.court)}</label>
    <label>Identifiant <span class="glose">(ex. e_heure_transfert)</span></label>
    <input type="text" id="ncNom" placeholder="e_…">
    <label>Nom <span class="glose">(un groupe nominal : ce qui parlera dans une phrase composée)</span></label>
    <input type="text" id="ncNomCourt" placeholder="ex. l'heure de remise au greffe">
    <label>Ce qui se lit <span class="glose">(quelqu'un affirme quelque chose)</span></label>
    <input type="text" id="ncTexte" placeholder="ex. j'ai remis le scellé à 15h20">
    <label>Valeur comparable <span class="glose">(sert à vérifier, jamais à déduire)</span></label>
    <input type="text" id="ncVal" placeholder="ex. 15:20">
    <label>Dimension</label>
    <select id="ncDim">${toutesDims().map(d=>`<option>${escapeH(d)}</option>`).join("")}</select>
    <div class="relbtns">
      <button onclick="creerChamp()">Créer</button>
      <button onclick="formChamp=null;render()">Annuler</button>
    </div>
    <div class="inote">Le marqueur {{id}} est ajouté au texte de la pièce — déplace-le où l'empan se lit.</div>`;
}
function creerChamp(){
  const eid=sanId($("ncNom").value);
  if(!eid){ toastInsp("Identifiant vide ou invalide."); return; }
  if(empanExiste(formChamp,eid)){ toastInsp("Cet empan existe déjà."); return; }
  pushUndo();
  const p=CONTENU.pieces[formChamp];
  p.empans=p.empans||{};
  p.empans[eid]={ dim:$("ncDim").value, valeur:$("ncVal").value, texte:$("ncTexte").value||$("ncVal").value,
                  nom:$("ncNomCourt").value||$("ncTexte").value||$("ncVal").value };
  p.texte=String(p.texte||"")+(p.texte?" ":"")+"{{"+eid+"}}";   // marqué d'office : la règle de surlignage
  selA={pid:formChamp,champ:eid}; selB=null;
  formChamp=null;
  autosave(); render();
}

function inspEmpan(s){
  const p=CONTENU.pieces[s.pid], e=empanDe(s.pid,s.champ)||{};
  const marque=String(p.texte||"").includes("{{"+s.champ+"}}");
  return `<label>Empan — ${escapeH(p.court)}·${escapeH(joli(s.champ))}</label>
    <label>Nom <span class="glose">(ce qui parle dans une phrase composée — un groupe nominal)</span></label>
    <input type="text" value="${escapeAttr(e.nom||"")}" onchange="majEmpan('${s.pid}','${s.champ}','nom',this.value)"
           placeholder="ex. l'heure des éclats de voix">
    <label>Ce qui se lit <span class="glose">(la déclaration, telle qu'elle se surligne dans la pièce)</span></label>
    <textarea onchange="majEmpan('${s.pid}','${s.champ}','texte',this.value)">${escapeH(e.texte||"")}</textarea>
    <label>Valeur comparable</label>
    <input type="text" value="${escapeAttr(String(e.valeur??""))}" onchange="majEmpan('${s.pid}','${s.champ}','valeur',this.value)">
    <label>Dimension</label>
    <select onchange="majEmpan('${s.pid}','${s.champ}','dim',this.value)">
      ${toutesDims().map(d=>`<option ${d===e.dim?'selected':''}>${escapeH(d)}</option>`).join("")}</select>
    <label>Signataire <span class="glose">(vide : celui de la pièce — ${escapeH(p.qui||"—")})</span></label>
    <input type="text" value="${escapeAttr(e.qui||"")}" onchange="majEmpan('${s.pid}','${s.champ}','qui',this.value)">
    <div style="font-size:12px;color:${marque?'var(--muted)':'var(--err)'};margin-top:6px">
      ${marque?"marqué dans le texte de la pièce ✓":"⚠ {{"+escapeH(s.champ)+"}} absent du texte — l'empan serait inatteignable"}</div>
    <button class="xsmall" style="margin-top:8px" onclick="demanderRenommageEmpan('${s.pid}','${s.champ}')">✎ renommer l'id</button>
    <label class="chk"><input type="checkbox" ${estBruit(s.pid,s.champ)?'checked':''} onchange="majBruit('${s.pid}','${s.champ}',this.checked)"> bruit intentionnel (ne pas signaler comme inerte)</label>
    ${btnSuppr("champ:"+K(s.pid,s.champ),"danger",`demanderSupprChamp('${s.pid}','${s.champ}')`,
               "Supprimer cet empan","Confirmer la suppression (liens compris)")}`;
}
function inspPaire(){
  const da=dimEmpan(selA.pid,selA.champ), db=dimEmpan(selB.pid,selB.champ);
  const md=da&&da===db;
  return `<label>Nouveau lien</label>
    <div class="ipath">${escapeH(cflabel(K(selA.pid,selA.champ)))}  ⟷  ${escapeH(cflabel(K(selB.pid,selB.champ)))}</div>
    <div style="color:${md?'var(--muted)':'var(--err)'};font-size:12px;margin-top:6px">
      ${md?"dimension partagée : "+escapeH(da):"⚠ dimensions différentes (« "+escapeH(da||"?")+" » / « "+escapeH(db||"?")+" ») — le composeur refuserait la phrase"}</div>
    <div class="relbtns">
      ${formesParArite(2).map(f=>`<button onclick="creerLien('${f}')" title="${escapeAttr(texteForme(f))}">${escapeH(texteForme(f))}</button>`).join("")}
    </div>`;
}
function inspLien(i){
  const L=CONTENU.liens[i];
  const f=formeDe(L.forme)||{};
  const sense=lienSense(L);
  return `<label>Lien</label>
    <div class="ipath">${escapeH(labelLien(L))}</div>
    <div style="font-size:12px;color:${sense?'var(--muted)':'var(--err)'};margin-top:6px">
      forme <b>${escapeH(L.forme)}</b> (arité ${f.arite||"?"}) — ${sense?"phrase sensée":"phrase refusée à la composition"}</div>
    <label>Forme</label>
    <select onchange="majLien(${i},'forme',this.value)">
      ${formesParArite(f.arite||2).map(x=>`<option ${x===L.forme?'selected':''}>${escapeH(x)}</option>`).join("")}</select>
    <label class="chk"><input type="checkbox" ${L.vice?'checked':''} onchange="majLien(${i},'vice',this.checked)"> ⚑ c'est LE vice</label>
    <label class="chk"><input type="checkbox" ${L.conclusion?'checked':''} onchange="majLien(${i},'conclusion',this.checked)"> c'est la CONCLUSION (lève vice_trouve / vice_expose)</label>
    <label class="chk"><input type="checkbox" ${L.faux?'checked':''} onchange="majLien(${i},'faux',this.checked)"> ✗ c'est le faux vice</label>
    <label>Tag d'attente <span class="glose">(une remise qui « attend » ce tag se ferme quand cette phrase est versée)</span></label>
    <input type="text" class="mono" value="${escapeAttr(L.tag||"")}" placeholder="—" onchange="majLien(${i},'tag',this.value)">
    <label>Réplique de l'avocat <span class="glose">(si versée au plan)</span></label>
    <textarea onchange="majLien(${i},'rep',this.value)">${escapeH(L.rep||"")}</textarea>
    ${formesParArite(1).length?`<label>Conclure ce lien par…</label>
      <div class="relbtns">${formesParArite(1).map(x=>`<button onclick="conclureLien(${i},'${x}')">${escapeH(texteForme(x))}</button>`).join("")}</div>`:""}
    ${btnSuppr("lien:"+i,"danger",`demanderSupprLien(${i})`,"Supprimer ce lien","Confirmer la suppression")}`;
}

function toastInsp(m){ $("insp").insertAdjacentHTML("afterbegin",`<div class="inote">${escapeH(m)}</div>`); }

/* ---- mutations — l'épilogue est dans `muter` (noyau.js) ---- */
function majEmpan(pid,eid,prop,v){ muter(()=>{
  const e=CONTENU.pieces[pid].empans[eid];
  // Le signataire vide se RETIRE : l'empan retombe alors sur celui de la pièce.
  if(prop==="qui") poserOuRetirer(e,prop,v); else e[prop]=v;
}); }
function majPiece(pid,prop,v){ muter(()=>{ CONTENU.pieces[pid][prop]=v; }); }
function majBruit(pid,ch,on){ muter(()=>{
  const k=K(pid,ch);
  CONTENU._bruit=(CONTENU._bruit||[]).filter(x=>x!==k);
  if(on) CONTENU._bruit.push(k);
}); }
function majLien(i,prop,val){ muter(()=>{
  // Les trois drapeaux et les deux textes se retirent quand ils sont vides —
  // une clé vide partirait à l'export sans rien dire.
  poserOuRetirer(CONTENU.liens[i],prop,val,{trim:true});
}); }

/* ---- suppressions en deux clics (plus de dialogue de confirmation natif) ----
   La garde vit dans `demanderSuppr` (noyau.js), avec le bouton qui l'annonce. */
function demanderSupprLien(i){ demanderSuppr("lien:"+i,()=>{
  CONTENU.liens.splice(i,1); selEdge=null;
}); }
function demanderSupprChamp(pid,ch){ demanderSuppr("champ:"+K(pid,ch),()=>{
  const p=CONTENU.pieces[pid], k=K(pid,ch);
  delete p.empans[ch];
  p.texte=String(p.texte||"").replace(new RegExp("\\\\s*\\\\{\\\\{"+ch+"\\\\}\\\\}",""),"");
  CONTENU.liens=CONTENU.liens.filter(L=>!feuillesLien(L).includes(k));
  CONTENU._bruit=(CONTENU._bruit||[]).filter(x=>x!==k);
  selA=selB=null;
}); }
/* ---- Renommage d'identifiants ------------------------------
   Le seul geste dangereux à la main : un id de pièce est référencé
   par les liens, les remises et la mise en page (_pos). Ici, tout
   est réécrit d'un bloc. Les ids de cases ne sont référencés nulle
   part ailleurs (apparait_si/leve pointent des drapeaux, pas des
   cases) : on ne déplace que la clé. Retourne null si OK, sinon
   le message d'erreur. */
function idValide(neuf,existants,ancien){
  const n=String(neuf||"").trim();
  if(!n) return "id vide.";
  if(n!==sanId(n)) return "id invalide — lettres, chiffres et _ seulement (ex. "+(sanId(n)||"ma_piece")+").";
  if(n!==ancien && existants.includes(n)) return "l'id « "+n+" » existe déjà.";
  return null;
}
function renommerClef(obj,ancien,neuf){   // renomme une clé en préservant l'ordre
  const out={};
  for(const [k,v] of Object.entries(obj)) out[k===ancien?neuf:k]=v;
  return out;
}
function renommerPieceId(ancien,neuf){
  neuf=String(neuf||"").trim();
  const err=idValide(neuf,Object.keys(CONTENU.pieces),ancien);
  if(err) return err;
  if(neuf===ancien) return null;
  pushUndo();
  CONTENU.pieces=renommerClef(CONTENU.pieces,ancien,neuf);
  /* Les termes des liens sont des « pid.eid » — emboîtés compris. La marche
     récursive vit dans `reecrireTermes` (noyau.js) : ici on ne dit plus que ce
     que devient une FEUILLE, et la même phrase sert au bruit. */
  const renommer = k => { const [pid,eid]=deK(k); return pid===ancien ? K(neuf,eid) : k; };
  for(const L of (CONTENU.liens||[])) L.termes=reecrireTermes(L.termes||[],renommer);
  CONTENU._bruit=(CONTENU._bruit||[]).map(renommer);
  for(const r of (CONTENU.remises||[]))
    if(Array.isArray(r.pieces)) r.pieces=r.pieces.map(p=>p===ancien?neuf:p);
  if(CONTENU._pos && CONTENU._pos[ancien]) CONTENU._pos=renommerClef(CONTENU._pos,ancien,neuf);
  pendingDel=null; simReset(); autosave(); render();
  return null;
}
/* Renommer un empan : sa clé, son marqueur dans le texte, les liens et le bruit. */
function renommerEmpanId(pid,ancien,neuf){
  neuf=String(neuf||"").trim();
  const p=CONTENU.pieces[pid];
  const err=idValide(neuf,Object.keys(p.empans||{}),ancien);
  if(err) return err;
  if(neuf===ancien) return null;
  pushUndo();
  p.empans=renommerClef(p.empans,ancien,neuf);
  p.texte=String(p.texte||"").split("{{"+ancien+"}}").join("{{"+neuf+"}}");
  const av=K(pid,ancien), ap=K(pid,neuf);
  const renommer = k => k===av ? ap : k;
  for(const L of (CONTENU.liens||[])) L.termes=reecrireTermes(L.termes||[],renommer);
  CONTENU._bruit=(CONTENU._bruit||[]).map(renommer);
  if(selA&&selA.pid===pid&&selA.champ===ancien) selA={pid,champ:neuf};
  pendingDel=null; simReset(); autosave(); render();
  return null;
}
/* Demander un id, l'appliquer, dire pourquoi si c'est refusé. Les deux
   renommages ne diffèrent que par la question posée et par le geste. */
function demanderRenommage(question,actuel,appliquer){
  const neuf=prompt(question,actuel);
  if(neuf===null) return;
  const err=appliquer(neuf);
  if(err) alert("Renommage refusé : "+err);
}
function demanderRenommagePiece(pid){
  demanderRenommage("Nouvel id pour « "+(CONTENU.pieces[pid].court||pid)+" » (actuel : "+pid+")\nLes liens, remises et positions suivront.",
    pid, neuf=>renommerPieceId(pid,neuf));
}
function demanderRenommageEmpan(pid,eid){
  demanderRenommage("Nouvel id pour l'empan « "+eid+" » de « "+courtDe(pid)+" »\nLe marqueur {{…}} et les liens suivront.",
    eid, neuf=>renommerEmpanId(pid,eid,neuf));
}

function demanderSupprPiece(pid){ demanderSuppr("piece:"+pid,()=>{
  delete CONTENU.pieces[pid];
  delete CONTENU._pos[pid];
  CONTENU.liens=(CONTENU.liens||[]).filter(L=>!feuillesLien(L).some(k=>deK(k)[0]===pid));
  CONTENU._bruit=(CONTENU._bruit||[]).filter(x=>deK(x)[0]!==pid);
  for(const r of CONTENU.remises||[]) r.pieces=(r.pieces||[]).filter(x=>x!==pid);
  if(selA&&selA.pid===pid) selA=null;
  if(selB&&selB.pid===pid) selB=null;
  selEdge=null;
}); }


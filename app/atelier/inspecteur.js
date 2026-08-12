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

/* — formulaires de création (remplacent les dialogues natifs, bloqués en iframe sandboxée) — */
function formulairePiece(kind){ formPiece=kind; formPieceEdit=formChamp=null; selA=selB=null; selEdge=null; pendingDel=null; render(); }
function inspFormPiece(){
  const regle=formPiece==='regle';
  return `<label>Nouvelle ${regle?'règle':'pièce'}</label>
    <label>Identifiant <span style="color:var(--dim)">(ex. ${regle?'r_delai':'p_temoin2'})</span></label>
    <input type="text" id="npId" placeholder="${regle?'r_':'p_'}…">
    <label>Nom court (affiché)</label>
    <input type="text" id="npCourt" placeholder="ex. ${regle?'délai':'témoin 2'}">
    <label>Signataire <span style="color:var(--dim)">(qui parle dans cette pièce)</span></label>
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
function formulairePieceEdit(pid){ formPieceEdit=pid; formPiece=formChamp=null; selA=selB=null; selEdge=null; pendingDel=null; render(); }
function inspPiece(pid){
  const p=CONTENU.pieces[pid];
  const eids=Object.keys(p.empans||{});
  const txt=String(p.texte||"");
  return `<label>Pièce — ${escapeH(p.court||pid)}</label>
    <label>Titre</label>
    <input type="text" value="${escapeAttr(p.titre||"")}" onchange="majPiece('${pid}','titre',this.value)">
    <label>Nom court</label>
    <input type="text" value="${escapeAttr(p.court||"")}" onchange="majPiece('${pid}','court',this.value)">
    <label>Type <span style="color:var(--dim)">(« règle… » ⇒ va au Manuel du cas)</span></label>
    <input type="text" value="${escapeAttr(p.type||"")}" onchange="majPiece('${pid}','type',this.value)">
    <label>Signataire par défaut <span style="color:var(--dim)">(qui parle)</span></label>
    <input type="text" value="${escapeAttr(p.qui||"")}" onchange="majPiece('${pid}','qui',this.value)">
    <label>Résumé <span style="color:var(--dim)">(hors jeu — mémo d'atelier)</span></label>
    <textarea style="min-height:34px" onchange="majPiece('${pid}','resume',this.value)">${escapeH(p.resume||"")}</textarea>
    <label>Texte de la pièce <span style="color:var(--dim)">— place {{id}} là où chaque empan se lit</span></label>
    <textarea class="mono" style="min-height:120px" onchange="majPiece('${pid}','texte',this.value)">${escapeH(txt)}</textarea>
    <div style="font-size:11.5px;color:var(--dim);margin-top:6px">empans : ${
      eids.length ? eids.map(e=>`<code style="color:${txt.includes("{{"+e+"}}")?"var(--ok)":"var(--err)"}">{{${escapeH(e)}}}</code>`).join(" ")
                  : "aucun"}</div>
    <div class="relbtns"><button onclick="formPieceEdit=null;render()">Fermer</button></div>`;
}
function formulaireChamp(pid){ formChamp=pid; formPiece=formPieceEdit=null; selA=selB=null; selEdge=null; pendingDel=null; render(); }
function inspFormChamp(){
  const p=CONTENU.pieces[formChamp];
  return `<label>Nouvel empan — ${escapeH(p.court)}</label>
    <label>Identifiant <span style="color:var(--dim)">(ex. e_heure_transfert)</span></label>
    <input type="text" id="ncNom" placeholder="e_…">
    <label>Nom <span style="color:var(--dim)">(un groupe nominal : ce qui parlera dans une phrase composée)</span></label>
    <input type="text" id="ncNomCourt" placeholder="ex. l'heure de remise au greffe">
    <label>Ce qui se lit <span style="color:var(--dim)">(quelqu'un affirme quelque chose)</span></label>
    <input type="text" id="ncTexte" placeholder="ex. j'ai remis le scellé à 15h20">
    <label>Valeur comparable <span style="color:var(--dim)">(sert à vérifier, jamais à déduire)</span></label>
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
  const delKey="champ:"+K(s.pid,s.champ);
  const marque=String(p.texte||"").includes("{{"+s.champ+"}}");
  return `<label>Empan — ${escapeH(p.court)}·${escapeH(joli(s.champ))}</label>
    <label>Nom <span style="color:var(--dim)">(ce qui parle dans une phrase composée — un groupe nominal)</span></label>
    <input type="text" value="${escapeAttr(e.nom||"")}" onchange="majEmpan('${s.pid}','${s.champ}','nom',this.value)"
           placeholder="ex. l'heure des éclats de voix">
    <label>Ce qui se lit <span style="color:var(--dim)">(la déclaration, telle qu'elle se surligne dans la pièce)</span></label>
    <textarea onchange="majEmpan('${s.pid}','${s.champ}','texte',this.value)">${escapeH(e.texte||"")}</textarea>
    <label>Valeur comparable</label>
    <input type="text" value="${escapeAttr(String(e.valeur??""))}" onchange="majEmpan('${s.pid}','${s.champ}','valeur',this.value)">
    <label>Dimension</label>
    <select onchange="majEmpan('${s.pid}','${s.champ}','dim',this.value)">
      ${toutesDims().map(d=>`<option ${d===e.dim?'selected':''}>${escapeH(d)}</option>`).join("")}</select>
    <label>Signataire <span style="color:var(--dim)">(vide : celui de la pièce — ${escapeH(p.qui||"—")})</span></label>
    <input type="text" value="${escapeAttr(e.qui||"")}" onchange="majEmpan('${s.pid}','${s.champ}','qui',this.value)">
    <div style="font-size:12px;color:${marque?'var(--muted)':'var(--err)'};margin-top:6px">
      ${marque?"marqué dans le texte de la pièce ✓":"⚠ {{"+escapeH(s.champ)+"}} absent du texte — l'empan serait inatteignable"}</div>
    <button class="xsmall" style="margin-top:8px" onclick="demanderRenommageEmpan('${s.pid}','${s.champ}')">✎ renommer l'id</button>
    <label class="chk"><input type="checkbox" ${estBruit(s.pid,s.champ)?'checked':''} onchange="majBruit('${s.pid}','${s.champ}',this.checked)"> bruit intentionnel (ne pas signaler comme inerte)</label>
    <button class="danger ${pendingDel===delKey?'arm':''}" onclick="demanderSupprChamp('${s.pid}','${s.champ}')">${pendingDel===delKey?'Confirmer la suppression (liens compris)':'Supprimer cet empan'}</button>`;
}
function inspPaire(){
  const da=dimDe(selA.pid,selA.champ), db=dimDe(selB.pid,selB.champ);
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
  const delKey="lien:"+i;
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
    <label>Tag d'attente <span style="color:var(--dim)">(une remise qui « attend » ce tag se ferme quand cette phrase est versée)</span></label>
    <input type="text" class="mono" value="${escapeAttr(L.tag||"")}" placeholder="—" onchange="majLien(${i},'tag',this.value)">
    <label>Réplique de l'avocat <span style="color:var(--dim)">(si versée au plan)</span></label>
    <textarea onchange="majLien(${i},'rep',this.value)">${escapeH(L.rep||"")}</textarea>
    ${formesParArite(1).length?`<label>Conclure ce lien par…</label>
      <div class="relbtns">${formesParArite(1).map(x=>`<button onclick="conclureLien(${i},'${x}')">${escapeH(texteForme(x))}</button>`).join("")}</div>`:""}
    <button class="danger ${pendingDel===delKey?'arm':''}" onclick="demanderSupprLien(${i})">${pendingDel===delKey?'Confirmer la suppression':'Supprimer ce lien'}</button>`;
}

function toastInsp(m){ $("insp").insertAdjacentHTML("afterbegin",`<div class="inote">${escapeH(m)}</div>`); }

/* ---- mutations ---- */
function majEmpan(pid,eid,prop,v){
  pushUndo();
  const e=CONTENU.pieces[pid].empans[eid];
  if((prop==="qui") && !String(v).trim()) delete e.qui; else e[prop]=v;
  autosave(); render();
}
function majPiece(pid,prop,v){ pushUndo(); CONTENU.pieces[pid][prop]=v; autosave(); render(); }
function majBruit(pid,ch,on){ pushUndo(); CONTENU._bruit=CONTENU._bruit||[]; const k=K(pid,ch);
  CONTENU._bruit=CONTENU._bruit.filter(x=>x!==k); if(on) CONTENU._bruit.push(k); autosave(); render(); }
function majLien(i,prop,val){
  pushUndo();
  const L=CONTENU.liens[i];
  if((prop==='rep'||prop==='tag') && !String(val||"").trim()) delete L[prop];
  else if((prop==='vice'||prop==='faux'||prop==='conclusion') && !val) delete L[prop];
  else L[prop]=typeof val==="string"?val.trim():val;
  autosave(); render();
}

/* ---- suppressions en deux clics (plus de dialogue de confirmation natif) ---- */
function demanderSupprLien(i){
  const k="lien:"+i;
  if(pendingDel!==k){ pendingDel=k; return render(); }
  pendingDel=null; pushUndo();
  CONTENU.liens.splice(i,1); selEdge=null; autosave(); render();
}
function demanderSupprChamp(pid,ch){
  const k="champ:"+K(pid,ch);
  if(pendingDel!==k){ pendingDel=k; return render(); }
  pendingDel=null; pushUndo();
  const p=CONTENU.pieces[pid];
  delete p.empans[ch];
  p.texte=String(p.texte||"").replace(new RegExp("\\\\s*\\\\{\\\\{"+ch+"\\\\}\\\\}",""),"");
  CONTENU.liens=CONTENU.liens.filter(L=>!feuillesLien(L).includes(K(pid,ch)));
  CONTENU._bruit=(CONTENU._bruit||[]).filter(x=>x!==K(pid,ch));
  selA=selB=null; autosave(); render();
}
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
  // les termes des liens sont des « pid.eid » — emboîtés compris
  const reecrire=t=>Array.isArray(t) ? t.map(reecrire)
    : (typeof t==="string" ? (t.split(".")[0]===ancien ? neuf+"."+t.split(".").slice(1).join(".") : t)
                           : {...t, termes:reecrire(t.termes||[])});
  for(const L of (CONTENU.liens||[])) L.termes=reecrire(L.termes||[]);
  CONTENU._bruit=(CONTENU._bruit||[]).map(k=>k.split(".")[0]===ancien?neuf+"."+k.split(".").slice(1).join("."):k);
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
  const reecrire=t=>Array.isArray(t) ? t.map(reecrire)
    : (typeof t==="string" ? (t===av?ap:t) : {...t, termes:reecrire(t.termes||[])});
  for(const L of (CONTENU.liens||[])) L.termes=reecrire(L.termes||[]);
  CONTENU._bruit=(CONTENU._bruit||[]).map(k=>k===av?ap:k);
  if(selA&&selA.pid===pid&&selA.champ===ancien) selA={pid,champ:neuf};
  pendingDel=null; simReset(); autosave(); render();
  return null;
}
function demanderRenommagePiece(pid){
  const neuf=prompt("Nouvel id pour « "+(CONTENU.pieces[pid].court||pid)+" » (actuel : "+pid+")\nLes liens, remises et positions suivront.",pid);
  if(neuf===null) return;
  const err=renommerPieceId(pid,neuf);
  if(err) alert("Renommage refusé : "+err);
}
function demanderRenommageEmpan(pid,eid){
  const neuf=prompt("Nouvel id pour l'empan « "+eid+" » de « "+courtDe(pid)+" »\nLe marqueur {{…}} et les liens suivront.",eid);
  if(neuf===null) return;
  const err=renommerEmpanId(pid,eid,neuf);
  if(err) alert("Renommage refusé : "+err);
}

function demanderSupprPiece(pid){
  const k="piece:"+pid;
  if(pendingDel!==k){ pendingDel=k; return render(); }
  pendingDel=null; pushUndo();
  delete CONTENU.pieces[pid];
  delete CONTENU._pos[pid];
  CONTENU.liens=(CONTENU.liens||[]).filter(L=>!feuillesLien(L).some(k=>k.split(".")[0]===pid));
  CONTENU._bruit=(CONTENU._bruit||[]).filter(x=>!x.startsWith(pid+"."));
  for(const r of CONTENU.remises||[]) r.pieces=(r.pieces||[]).filter(x=>x!==pid);
  if(selA&&selA.pid===pid) selA=null;
  if(selB&&selB.pid===pid) selB=null;
  selEdge=null;
  autosave(); render();
}


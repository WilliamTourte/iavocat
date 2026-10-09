/* ATELIER — L'ONGLET VERDICTS (passe N, §15) : le dossier déclare ses
   DISCORDANCES, tout le reste concorde (§4.2). Une grille par dimension —
   chaque paire de même dimension, sa relation telle que le MOTEUR la rend
   (`deduire`, appelé, jamais recopié, §12), et une case qui écrit
   `discordances`. C'est l'éditeur de la liste, et la relecture qu'elle exige :
   une discordance juste que le dossier tairait serait refusée par l'avocat (§8). */
let VERD_OUVERTES=new Set();
const clePaireVerdict = (a,b) => [String(a),String(b)].sort().join("|");
function discordancesListe(){ return Array.isArray(CONTENU.discordances) ? CONTENU.discordances : []; }
function estDiscordante(a,b){
  const c=clePaireVerdict(a,b);
  return discordancesListe().some(p=>Array.isArray(p) && p.length===2 && clePaireVerdict(p[0],p[1])===c);
}
/* La grammaire porte-t-elle les deux relations de la passe N ? Sans elles, les
   verdicts se tirent des valeurs, et une case cochée ici ne changerait rien. */
function relationsParDossier(){
  return Object.values(((CONTENU.grammaire||{}).formes)||{}).some(f=>f.deduction==="discordance");
}
function basculerDiscordance(a,b){ muter(()=>{
  const l=discordancesListe().slice(), c=clePaireVerdict(a,b);
  const i=l.findIndex(p=>Array.isArray(p) && p.length===2 && clePaireVerdict(p[0],p[1])===c);
  if(i>=0) l.splice(i,1); else l.push([a,b]);
  if(l.length) CONTENU.discordances=l; else delete CONTENU.discordances;
}); }
function verdOuvrir(d,ouvert){ if(ouvert) VERD_OUVERTES.add(d); else VERD_OUVERTES.delete(d); }
/* Les liens qui posent cette paire — nus ou sous un article — et s'ils disent
   la vraie relation : un lien qui contredit le dossier est faux (§15). */
function liensDeLaPaire(a,b,m){
  const c=clePaireVerdict(a,b), out=[];
  (CONTENU.liens||[]).forEach((L,i)=>{
    const comp=comparaisonDu(L), t=comp.termes||[];
    if(t.length===2 && t.every(x=>typeof x==="string") && clePaireVerdict(t[0],t[1])===c)
      out.push({i, L, faux: !!(m && m.fausse({forme:L.forme, termes:L.termes||[]}))});
  });
  return out;
}
const libelleForme = f => ((((CONTENU.grammaire||{}).formes)||{})[f]||{}).libelle || f || "—";
function renderVerdicts(){
  const pane=$("verdpane"); if(!pane) return;
  const m=MG();
  const parDossier=relationsParDossier();
  const livrees=toutesPiecesLivrees();
  const parDim={};
  for(const e of empansPlats()) (parDim[e.dim]=parDim[e.dim]||[]).push(e);
  let total=0, discs=0;
  const blocs=toutesDims().map(d=>{
    const es=parDim[d]||[];
    if(es.length<2) return "";
    const lignes=[]; let n=0;
    for(let i=0;i<es.length;i++) for(let j=i+1;j<es.length;j++){
      const a=es[i], b=es[j], disc=estDiscordante(a.id,b.id);
      const rel=m ? m.deduire(a.id,b.id) : null;
      const liens=liensDeLaPaire(a.id,b.id,m);
      total++; if(disc){ discs++; n++; }
      const horsJeu=!livrees.has(a.pid)||!livrees.has(b.pid);
      lignes.push(`<tr class="${disc?"disc":""} ${horsJeu?"horsjeu":""}">
        <td><label class="chk"><input type="checkbox" ${disc?"checked":""} ${parDossier?"":"disabled"}
          onchange="basculerDiscordance('${escapeAttr(a.id)}','${escapeAttr(b.id)}')"> ne concordent pas</label></td>
        <td>${escapeH(a.court)} · ${escapeH(a.nom)}</td>
        <td>${escapeH(b.court)} · ${escapeH(b.nom)}</td>
        <td class="vrel">${escapeH(libelleForme(rel))}</td>
        <td>${liens.map(x=>`<span class="vlien ${x.faux?"faux":""}" title="${escapeAttr(labelLien(x.L))}">lien ${x.i}${x.faux?" — faux":""}</span>`).join(" ")}</td>
      </tr>`);
    }
    return `<details class="vdim" ${VERD_OUVERTES.has(d)?"open":""} ontoggle="verdOuvrir('${escapeAttr(d)}',this.open)">
      <summary><b>${escapeH(d)}</b> — ${es.length} passages · ${lignes.length} paires · ${n} ne concordent pas</summary>
      <table class="vgrille"><tbody>${lignes.join("")}</tbody></table>
    </details>`;
  }).join("");
  pane.innerHTML=`<h2>Verdicts — ce que le dossier déclare</h2>
    <p class="lead">Deux passages de même dimension <b>concordent</b>, sauf si le dossier les déclare
    <b>discordants</b> (§4.2). Relis chaque paire : une discordance juste que le dossier tairait serait
    refusée par l'avocat (§8). La relation affichée est celle que rend le moteur ; une paire dont une pièce
    n'est livrée par aucune remise est grisée.</p>
    ${parDossier ? "" : `<div class="warnbox">La grammaire ne porte pas les deux relations du dossier
      (<code>deduction:"concordance"</code> / <code>"discordance"</code>) : les verdicts se tirent des valeurs,
      et cocher ici ne changerait rien.</div>`}
    <div class="gstat"><b>${total}</b> paires · <b>${discs}</b> ne concordent pas</div>
    ${blocs}`;
}

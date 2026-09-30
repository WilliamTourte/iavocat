/* LE JEU — L'ÉCRAN ET LES GESTES. Chargé par <script src> APRÈS moteur.js,
   regles.js et content.js, en portée globale classique (§9).
   IL NE DÉCIDE RIEN : ce qui REDESSINE est une fonction d'ici — `R.x(S,…)` puis
   `rendreTout()` ; ce qui LIT s'écrit `R.x(S)` sur place (§12). */

/* 1) LE CONTENU — content.js, et lui seul (§12) : absent ou d'un schéma inconnu,
      on le dit au lieu de jouer autre chose (§13). */
function contenuValide(c){
  return !!( c && typeof c==="object" && (c.schema||0)>=3
    && c.pieces && typeof c.pieces==="object"
    && Array.isArray(c.dimensions)
    && c.grammaire && Array.isArray(c.grammaire.blocs) && c.grammaire.formes
    && Array.isArray(c.liens) && Array.isArray(c.remises)
    && c.repetition && Array.isArray(c.repetition.affirmations)
    && c.avocat && c.fins );
}
const CONTENU_ABSENT = { schema:3, dimensions:[], pieces:{},
  grammaire:{ depart:"S0", finaux:[], blocs:[], formes:{} },
  liens:[], remises:[], repetition:{ affirmations:[] }, avocat:{}, fins:{} };
const CONTENU_OK = contenuValide(window.CONTENU);
const JEU = CONTENU_OK ? window.CONTENU : CONTENU_ABSENT;
const SOURCE_CONTENU = CONTENU_OK ? "contenu : content.js" : "contenu introuvable";
if(!CONTENU_OK){
  const pourquoi = !window.CONTENU
    ? "content.js n'a pas été chargé. Le fichier doit rester à côté de index.html."
    : (window.CONTENU.schema||0) < 3
      ? "content.js est en schéma "+(window.CONTENU.schema||"?")+" ; ce moteur attend le schéma 3 (empans + grammaire). Repasser par l'atelier : la migration y est automatique à l'import."
      : "content.js est présent mais invalide : une clé vitale manque. Repasser par l'atelier.";
  console.warn("IAvocat : "+pourquoi);
  document.body.insertAdjacentHTML("afterbegin",`<div class="panne">${pourquoi}</div>`);
}
if(CONTENU_OK && (JEU.schema||0) > 3)
  console.warn(`IAvocat : content.js de schéma ${JEU.schema}, ce moteur connaît le schéma 3 — certaines clés seront ignorées. Mettre index.html à jour.`);

/* 2) LA GRAMMAIRE — `MoteurAPI` est le MODULE, `M` l'instance liée à l'affaire ;
      `CHAMPS` est l'argument qu'attend `creerMoteur` (§14). */
const $ = id => document.getElementById(id);
const MoteurAPI = window.MoteurGrammaire || {};
const CHAMPS = MoteurAPI.champsDe ? MoteurAPI.champsDe(JEU) : [];
const M = MoteurAPI.creerMoteur
        ? MoteurAPI.creerMoteur(JEU.grammaire, CHAMPS, JEU.liens)
        : null;
if(!M){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">moteur.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
const EMPAN = Object.fromEntries(CHAMPS.map(c=>[c.id,c]));
const couleurDim = d =>
  (MoteurAPI.couleurDim ? MoteurAPI.couleurDim(JEU.dimensions,d) : null) || "var(--muted)";
/* La couleur ET le trait : aucune dimension ne se lit à la couleur seule (§4.3). */
const traitDim = d =>
  (MoteurAPI.traitDim ? MoteurAPI.traitDim(JEU.dimensions,d) : null) || "solid";

/* 3) L'ÉTAT ET LES RÈGLES — tout ce qui décide vit dans regles.js. */
const R = (window.ReglesJeu||{}).creerRegles
        ? window.ReglesJeu.creerRegles(JEU, M)
        : null;
if(!R){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">regles.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
let S = R.etatInitial();

/* ---- Sauvegarde de partie — de l'écran, pas de la règle ---- */
const CLE_PARTIE="iavocat_partie";
function sauverPartie(){
  try{ localStorage.setItem(CLE_PARTIE,JSON.stringify({...S,modalPiece:null,sig:R.signatureContenu()})); }catch(e){}
}
function restaurerPartie(){
  try{
    const brut=localStorage.getItem(CLE_PARTIE); if(!brut) return false;
    const d=JSON.parse(brut);
    if(d.sig!==R.signatureContenu()){ localStorage.removeItem(CLE_PARTIE); return false; }
    /* PIÈGE : la signature ne protège pas d'un renommage d'état. `S.memoire`
       est devenu `S.retenus` ; sans cette reprise, une partie d'avant revenait
       vide de passages, sans un mot. */
    if(d.retenus===undefined && Array.isArray(d.memoire)) d.retenus=d.memoire;
    delete d.memoire;
    delete d.sig; Object.assign(S,d); return true;
  }catch(e){ return false; }
}
function effacerPartie(){ try{ localStorage.removeItem(CLE_PARTIE); }catch(e){} }
/* La confirmation ATTEND qu'on réponde (§4.10) : elle se retirait d'elle-même
   au bout de 2,5 s, trop tôt pour qui lit lentement ou écoute l'écran. */
let confirmRecommencer=false;
function recommencer(){
  if(!confirmRecommencer){
    confirmRecommencer=true; majRecommencer();
    annoncer("Tout effacer et repartir de la remise 1 ? Confirme, ou annule.");
    publierAnnonces();
    const a=$("btnAnnulerRecommencer"); if(a) a.focus();
    return;
  }
  effacerPartie(); effacerTuto(); location.reload();
}
function annulerRecommencer(){
  confirmRecommencer=false; majRecommencer();
  const b=$("btnRecommencer"); if(b) b.focus();
}
function majRecommencer(){
  const b=$("btnRecommencer"), a=$("btnAnnulerRecommencer");
  if(b){ b.textContent = confirmRecommencer ? "Oui, tout effacer" : "⟲ recommencer";
         b.classList.toggle("confirmer", confirmRecommencer); }
  if(a) a.hidden = !confirmRecommencer;
}

/* ---- Le tutoriel des deux premiers gestes (§4.8) — de l'écran, pas de la
   règle. Son temps se dérive de `S` : le retirer laisserait le jeu identique.
   DEUX gestes, chacun montré une fois : citer, puis — dans la même session,
   dès que Maître Auber attend une comparaison — mettre en relation. */
const CLE_TUTO="iavocat_tuto";
const TUTO_TOTAL=6;
let tutoFait=false;
try{ tutoFait = !!localStorage.getItem(CLE_TUTO); }catch(e){}
function effacerTuto(){ try{ localStorage.removeItem(CLE_TUTO); }catch(e){} }
function tutoClore(){ tutoFait=true; try{ localStorage.setItem(CLE_TUTO,"1"); }catch(e){} }
/* Le bandeau disparu emporte son bouton : le focus va au jeu, pas à la page. */
function tutoPasser(){
  tutoClore(); majTutoriel();
  const el=premierFocalisable(document.querySelector("#modalRoot .modal")) || premierFocalisable($("discussion"));
  if(el) el.focus();
}
/* Le lien de l'attente active : PIÈGE, c'est lui qui dit si le geste attendu
   est une simple citation (un terme, une chaîne) ou une comparaison (un
   terme emboîte une forme) — jamais un nom d'attente câblé en dur. */
function tutoLienAttente(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  return (a&&a.attend&&(JEU.liens||[]).find(x=>x.tag===a.attend)) || null;
}
function tutoAttendu(){
  const t=tutoLienAttente(), p=t&&(t.termes||[])[0];
  return typeof p==="string" ? p : null;
}
function tutoAttenteComparaison(){
  const t=tutoLienAttente(), p=t&&(t.termes||[])[0];
  return !!p && typeof p==="object";
}
function tutoEtapeCitation(){
  const veut=tutoAttendu();
  if(veut ? !S.retenus.includes(veut) : !S.retenus.length){
    const rate = !!veut && S.retenus.length>0;
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .piecetexte", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond."
                      : "Clique sur un passage souligné pour l'ajouter à ton CONTEXTE."}
      : {n:1, ou:"#discussion .attach", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Relis sa question et ouvre la bonne pièce."
                      : "Ouvre la pièce : ce qu'il te demande est écrit dedans."};
  }
  if(!R.peutEnvoyer(S))
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .close",
            dit:"Passage retenu. Referme la pièce."}
      : panneau==="contexte"
        ? {n:3, ou:"#zoneRetenus",
            dit:"Clique sur le passage pertinent pour l'utiliser dans ta réponse"}
        : {n:3, ou:"#btnContexte",
            dit:"Ouvre ton contexte : le passage que tu viens de retenir s'y trouve."};
  return  {n:4, ou:"#composeur button.envoi",
            dit:"Clique sur → Envoyer"};
}
function tutoEtapeComparaison(){
  if(R.indexTermeChamp(S)>=0){
    const dit = S.compo.length
      ? "Prends un second passage : celui qui contredit le premier."
      : "Sélectionne les deux passages se contredisant pour soulever une irrégularité.";
    return panneau==="contexte"
      ? {n:5, ou:"#zoneRetenus", dit}
      : {n:5, ou:"#btnContexte", dit:"Ouvre ton contexte : "+dit[0].toLowerCase()+dit.slice(1)};
  }
  if(S.compo.length && R.blocsOfferts(S).some(b=>b.type==="liaison"&&b.imbrique))
    return {n:6, ou:"#composeur .offre",
      dit:"Une comparaison seule ne suffit pas : sélectionne l'article sur lequel s'appuyer."};
  if(R.peutEnvoyer(S))
    return {n:4, ou:"#composeur button.envoi",
            dit:"Clique sur → Envoyer"};
  return null;
}
/* Entre les deux gestes, et une fois les deux acquis, il se tait — sans se
   fermer pour autant : `majTutoriel` seul décide de la fermeture définitive. */
function tutoEtape(){
  if(S.remisesEnvoyees!==1) return null;
  if(tutoAttenteComparaison()) return tutoEtapeComparaison();
  if(!S.satisfaits.length) return tutoEtapeCitation();
  return null;
}
/* PIÈGE : on marque par un ATTRIBUT, pas par une classe — la sérialisation
   laisse ainsi intactes les `class="…"` que des suites lisent. */
let tutoCible=null, tutoDernierDit=null, tutoAnnonce=null;
function majTutoriel(){
  const banniere=$("tuto"); if(!banniere) return;
  if(tutoCible){ tutoCible.removeAttribute("data-tuto"); tutoCible=null; }
  /* La session 1 finie (remise 2 livrée), les deux gestes ont eu leur chance :
     fermeture définitive, qu'une leçon ait ou non été vue jusqu'au bout. */
  if(!tutoFait && S.remisesEnvoyees>1) tutoClore();
  const e = tutoFait ? null : tutoEtape();
  /* Le halo ne se voit pas à l'oreille : une consigne NEUVE s'annonce (§4.10),
     une consigne répétée par un redessin, non. */
  if(e && e.dit!==tutoDernierDit) tutoAnnonce="Tutoriel, "+e.n+" sur "+TUTO_TOTAL+" : "+e.dit;
  tutoDernierDit = e ? e.dit : null;
  if(!e){ banniere.hidden=true; return; }
  tutoCible=document.querySelector(e.ou);
  if(tutoCible) tutoCible.setAttribute("data-tuto", e.alerte?"alerte":"");
  banniere.toggleAttribute("data-alerte", !!e.alerte);
  $("tutoPas").textContent=e.n+"/"+TUTO_TOTAL;
  $("tutoDit").textContent=e.dit;
  banniere.hidden=false;
}

/* 4) RENDU COMMUN */
const modalRoot = $("modalRoot");
/* §4.10 règle 3 — LA PIÈCE OUVERTE EST UNE BOÎTE DE DIALOGUE : le jeu derrière
   devient inerte, le focus entre dans la pièce et revient, à la fermeture, à
   ce qui l'a ouverte — retrouvé par sa CLÉ, l'élément ayant été redessiné.
   PIÈGE : pas de `<dialog>.showModal()`. Sa couche supérieure rend inerte TOUT
   le reste, bandeau du tutoriel compris, que le §4.8 veut lisible et cliquable
   par-dessus la pièce. `inert` ne touche donc que `.wrap` — `#tuto`,
   `#modalRoot` et `#annonce` vivent hors d'elle, et c'est ce qui les garde. */
let ouvreur=null;
function closeModal(){
  S.modalPiece=null; modalRoot.innerHTML="";
  const w=document.querySelector(".wrap"); if(w) w.removeAttribute("inert");
  focusVoulu=ouvreur; ouvreur=null;
  rendreTout();
}
function modal(html, classe){
  modalRoot.innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">
       <div class="modal ${classe||""}" role="dialog" aria-modal="true" aria-labelledby="modalTitre">${html}
         <button class="close" onclick="closeModal()" aria-label="Fermer (Échap)" aria-keyshortcuts="Escape"><span class="x" aria-hidden="true">×</span><kbd>Échap</kbd></button>
       </div>
     </div>`;
  const w=document.querySelector(".wrap"); if(w) w.setAttribute("inert","");
}
function escapeAttr(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

/* §4.10 règle 2 — LE FOCUS SURVIT AU REDESSIN. Chaque zone est réécrite à
   chaque geste : l'élément qui avait le focus n'existe plus. PIÈGE : on le
   retrouve par sa CLÉ (`data-f`, ou l'id), jamais par l'élément ; et s'il a
   disparu, on reste dans sa ZONE. Un geste qui sait mieux — ouvrir ou fermer
   la pièce — pose `focusVoulu`, qui passe devant. */
const ZONES_FOCUS = "#zoneRetenus, #zoneDossier, .modal, #plaidoirie, #composeur, #discussion, .cloture";
const FOCALISABLES = ['[data-f="envoi"]','[data-f="voix"]','.offre .bbloc',
  '[role="button"][tabindex="0"]','button:not([disabled])'];
let focusVoulu=null;
function memoFocus(){
  const a=document.activeElement;
  if(!a || a===document.body || !a.getAttribute) return null;
  const cle = a.getAttribute("data-f") || (a.id ? "#"+a.id : null);
  const z = a.closest(ZONES_FOCUS);
  return { cle, zone: z ? (z.id ? "#"+z.id : "."+z.classList[0]) : null };
}
function focalisable(el){
  return !!el && document.contains(el) && !el.disabled && !el.closest("[hidden],[inert]");
}
function premierFocalisable(zone){
  if(!zone) return null;
  for(const sel of FOCALISABLES){
    const el=[...zone.querySelectorAll(sel)].find(focalisable);
    if(el) return el;
  }
  return zone.hasAttribute("tabindex") && focalisable(zone) ? zone : null;
}
function rendreFocus(m, force){
  if(!m) return;
  const a=document.activeElement;
  if(!force && a && a!==document.body && document.contains(a)) return;   // rien de perdu
  let el = !m.cle ? null
    : m.cle[0]==="#" ? document.querySelector(m.cle)
    : [...document.querySelectorAll("[data-f]")].find(x=>x.getAttribute("data-f")===m.cle);
  // Le même élément retrouvé était sous les yeux : on ne fait pas défiler.
  if(focalisable(el)){ el.focus({preventScroll:true}); return; }
  el = premierFocalisable(m.zone && document.querySelector(m.zone));
  if(!focalisable(el)) el = premierFocalisable($("composeur"));
  if(el) el.focus();
}

/* §4.10 règle 4 — CE QUI ARRIVE S'ANNONCE, par une voix unique : `#annonce`,
   hors de `.wrap` (une région inerte se tait). PIÈGE : jamais `role="log"` sur
   la Discussion — elle se réécrit à chaque geste, et un lecteur d'écran la
   relirait d'un bout à l'autre. */
let annonces=[], vusFil=-1, dernierRefus=null;
function annoncer(txt){ if(txt) annonces.push(txt); }
function publierAnnonces(){
  const el=$("annonce");
  if(!el || !annonces.length) return;
  const t=annonces.join(" "); annonces=[];
  el.textContent = el.textContent===t ? t+" " : t;   // la même phrase, redite
}
function texteBrut(html){
  const t=document.createElement("template"); t.innerHTML=String(html||"");
  return t.content.textContent.replace(/\s+/g," ").trim();
}
/* Au démarrage, rien ne s'annonce : la page se lit dans l'ordre. Ensuite, les
   répliques de l'avocat (celles de l'IA, le joueur vient de les écrire), un
   refus neuf, puis la consigne neuve du tutoriel. */
function annoncerNouveautes(){
  if(vusFil<0){ vusFil=S.fil.length; dernierRefus=S.refus||null; tutoAnnonce=null; return; }
  for(const m of S.fil.slice(vusFil)) if(!m.ia){
    const n=(m.pieces||[]).length;
    annoncer(`${m.qui} : ${texteBrut(m.texte)}${n ? ` (${n} pièce${n>1?"s":""} jointe${n>1?"s":""})` : ""}`);
  }
  vusFil=S.fil.length;
  if(S.refus && S.refus!==dernierRefus) annoncer(S.refus);
  dernierRefus=S.refus||null;
  if(tutoAnnonce){ annoncer(tutoAnnonce); tutoAnnonce=null; }
}

function rendreTout(){
  const force=!!focusVoulu, m=focusVoulu || memoFocus(); focusVoulu=null;
  const enBas=filEnBas();
  if(S.modalPiece) majPiece();
  renderDiscussion(); renderComposeur(); renderContexte(); renderPlaidoirie(); majCloture(); majPanneaux(); majTutoriel();
  recalerFil(enBas);
  rendreFocus(m, force);
  rappelRetrait=null;
  annoncerNouveautes(); publierAnnonces();
  sauverPartie();
}

/* ---- Le canal : un fil de messages ---- */
function renderDiscussion(){
  let h="", dernier=null;
  for(const m of S.fil){
    // PIÈGE : l'avocat vient du contenu, déjà écrit pour l'écran ; la phrase
    // composée de l'IA, elle, s'échappe.
    const meme = m.qui===dernier; dernier=m.qui;
    h+=`<div class="msg ${m.ia?'ia':''} ${meme?'suite':''}">${
      meme?"":`<div class="who">${escapeAttr(m.qui)}</div>`}<div class="bubble">${m.ia?escapeAttr(m.texte):m.texte}<div>`;
    // Une pièce lue porte un ✓, comme dans l'index — jamais un gris qui la
    // ferait passer pour désactivée (§4.10 règle 5).
    for(const pid of m.pieces){
      const lue=S.examinees.includes(pid), titre=JEU.pieces[pid].titre;
      h+=`<button type="button" class="attach ${lue?'seen':''}" data-f="a:${pid}" onclick="ouvrirPiece('${pid}')"
            aria-label="${escapeAttr(titre)}${lue?", déjà lue":""}"><span aria-hidden="true">${lue?"✓":"📎"}</span> ${escapeAttr(titre)}</button>`;
    }
    h+=`</div></div></div>`;
  }
  if(S.clotureDemandee && S.repetitionIdx>-1 && S.repetitionIdx<JEU.repetition.affirmations.length){
    const dispo=S.brouillon.map((n,i)=>({n,i}));
    h+=`<div class="repet"><div class="rtitle">Opposer une phrase à cette affirmation ?</div>${
      dispo.length ? dispo.map(x=>
        `<div class="rnote"><span class="txt">${escapeAttr(x.n.texte)}</span>
         ${x.n.versee?`<span class="sent">déjà envoyée</span>`:`<button class="up" data-f="r:${x.i}" onclick="verserContre(${x.i})">envoyer</button>`}</div>`).join("")
      : `<div class="rnote vide">tu n'as écrit aucune phrase à y opposer</div>`
    }<button class="btn" data-f="rsuite" onclick="avancerRepetition()">Ne rien envoyer — continuer</button></div>`;
  }
  $("discussion").innerHTML=h;
}
/* Le fil se recale en bas s'il y ÉTAIT — nouveau message, panneau ouvert, phrase
   qui s'allonge : la question reste sous les yeux. Remonté pour relire (ou pour
   suivre le focus), il n'est plus arraché vers le bas à chaque geste. PIÈGE :
   le recalage vient APRÈS `majPanneaux` — c'est lui qui change la hauteur. */
let filLongueur=-1;
function filEnBas(){
  const el=$("discussion");
  return !el || el.scrollHeight - el.scrollTop - el.clientHeight < 8;
}
function recalerFil(enBas){
  const el=$("discussion"); if(!el) return;
  const neuf = S.fil.length!==filLongueur; filLongueur=S.fil.length;
  if(enBas || neuf) el.scrollTop=el.scrollHeight;
}

/* ---- Les pièces ---- le marquage ne varie jamais avec la pertinence (§4.3). */
function rendreTexte(pid){
  const p=JEU.pieces[pid];
  const src=String(p.texte||"");
  let h="", reste=src, m;
  const re=/\{\{([A-Za-z0-9_]+)\}\}/;
  while((m=re.exec(reste))){
    h+=escapeAttr(reste.slice(0,m.index));
    const eid=m[1], e=(p.empans||{})[eid];
    if(e){
      /* PIÈGE : un SPAN qui se déclare bouton, jamais un <button> — celui-ci est
         une boîte insécable même en `display:inline`, et un passage long
         sauterait à la ligne d'un bloc au lieu de couler dans la prose (§4.10).
         Entrée et Espace passent par `clavier`. Pas d'`aria-pressed` : ce n'est
         pas un interrupteur, la pièce n'ajoute que (§4.3). */
      const k=pid+"."+eid, pris=S.retenus.includes(k);
      h+=`<span class="empan ${pris?'pris':''}" role="button" tabindex="0" data-f="e:${k}"
            style="--dc:${couleurDim(e.dim)};--ds:${traitDim(e.dim)}"
            onclick="surligner('${pid}','${eid}')" title="${escapeAttr(e.dim)} — ${escapeAttr(e.qui||p.qui||'')}">${
            escapeAttr(e.texte)}<span class="sr"> — ${escapeAttr(e.dim)}${pris?", retenu":""}</span></span>`;
    } else h+=escapeAttr(m[0]);
    reste=reste.slice(m.index+m[0].length);
  }
  h+=escapeAttr(reste);
  return h;
}
/* `rendreTout` redessine la pièce ouverte, sous la même mémoire de focus que le
   reste : on n'appelle plus `modal` que par lui. */
function ouvrirPiece(pid){
  ouvreur = memoFocus();
  R.ouvrirPiece(S,pid);
  focusVoulu = { cle:"#modalTitre", zone:".modal" };
  rendreTout();
}
function classePiece(pid){ return "piece" + (R.estRegle(JEU.pieces[pid]) ? " regle" : ""); }
/* Redessinée à chaque geste, la pièce garde son défilement : retenir un passage
   en bas d'une longue pièce ne la ramène pas en haut. */
function majPiece(){
  const avant=document.querySelector("#modalRoot .modal");
  const haut = avant && avant.classList.contains("piece") ? avant.scrollTop : 0;
  modal(modalPieceHTML(S.modalPiece), classePiece(S.modalPiece));
  const apres=document.querySelector("#modalRoot .modal"); if(apres) apres.scrollTop=haut;
}
function renderDossier(){
  if(!S.remisesEnvoyees) return "";
  const livres=R.piecesLivrees(S);
  const chip=pid=>{
    const p=JEU.pieces[pid], vu=S.examinees.includes(pid);
    // La puce porte le TITRE, celui de la pièce jointe : une pièce ne porte
    // qu'un nom (§4.6). D'où plus de `title` — il disait déjà ça (§4.9).
    // Le marqueur reste en tête du texte ; l'état se dit par le nom accessible.
    return `<button type="button" class="dchip ${vu?'vu':''} ${R.estRegle(p)?'regle':''}" data-f="d:${pid}"
      aria-label="${escapeAttr(p.titre)}${vu?", déjà lue":""}" onclick="ouvrirPiece('${pid}')">${vu?'✓':'●'} ${escapeAttr(p.titre)}</button>`;
  };
  const colonne=(titre,pids)=>`<div class="dcol"><span class="dtitre">${titre}</span>
    <div class="dchips">${pids.length?pids.map(chip).join(""):`<span class="dvide">—</span>`}</div></div>`;
  const pieces=livres.filter(pid=>!R.estRegle(JEU.pieces[pid]));
  const regles=livres.filter(pid=> R.estRegle(JEU.pieces[pid]));
  return `<div class="zone" id="zoneDossier">
    <div class="dossier">${colonne("Les pièces",pieces)}${colonne("Les règles",regles)}</div></div>`;
}

/* 5) LE CONTEXTE — privé, gratuit, illimité, et CLAVIER du composeur (§4.6).
      Surligner ne produit RIEN : c'est voulu. */
/* La pièce n'ajoute que — jamais n'oublie (§4.3). Mais recliquer un passage déjà
   retenu ne passe plus sous silence : l'écran dit où l'on retire. `rappelRetrait`
   vit le temps d'un rendu. */
let rappelRetrait=null;
const RAPPEL_RETRAIT="Déjà dans ton Contexte — c'est là qu'on le retire.";
function surligner(pid,eid){
  const k=pid+"."+eid;
  rappelRetrait = S.retenus.includes(k) ? k : null;
  R.surligner(S,pid,eid);
  annoncer(rappelRetrait ? RAPPEL_RETRAIT : "Retenu dans ton Contexte.");
  rendreTout();
}
function oublier(pid,eid){
  R.oublier(S,pid,eid);            // le Contexte seul peut retirer
  rendreTout();
}
function modalPieceHTML(pid){
  const p=JEU.pieces[pid];
  return `<h3 id="modalTitre" tabindex="-1">${escapeAttr(p.titre)}</h3><small class="note">${escapeAttr(p.type)} — ${escapeAttr(p.qui||"")}</small>
    <p class="piecetexte">${rendreTexte(pid)}</p>
    ${rappelRetrait && rappelRetrait.startsWith(pid+".") ? `<p class="rappel">${RAPPEL_RETRAIT}</p>` : ""}`;
}
/* PIÈGE : `#zoneRetenus` est l'ancre des temps 3 et 5 du tutoriel (R6), à ne
   jamais viser par `:last-child`. Et depuis qu'elle vit dans un PANNEAU, elle
   peut être cachée : le tutoriel vise alors `#btnContexte`, la porte. Les deux
   sélecteurs restent des LITTÉRAUX — R6 ne scanne pas un sélecteur calculé, et
   ne dirait rien le jour où l'un des deux cesserait d'exister. */
function renderRetenus(){
  const iT=R.indexTermeChamp(S);
  const dimReq=R.dimAttendue(S);          // `null` tant qu'aucun second terme n'est attendu
  let h=`<div class="zone" id="zoneRetenus">`;
  if(!S.retenus.length){
    h+=`<div class="aide">Alimente ton contexte en sélectionnant des passages du dossier.</div>`;
  } else {
    for(const d of JEU.dimensions||[]){
      const ks=S.retenus.map((k,j)=>({k,j})).filter(x=>EMPAN[x.k] && EMPAN[x.k].dim===d);
      if(!ks.length) continue;
      const hors=dimReq && d!==dimReq;
      h+=`<div class="dimgrp ${hors?"horsdim":""}" style="--dc:${couleurDim(d)}"><div class="dnom">${escapeAttr(d)}</div>`;
      for(const {k,j} of ks){
        const e=EMPAN[k];
        h+=`<div class="mchip" style="--dc:${couleurDim(d)}">
              <button class="corps" data-f="c:${k}" ${iT<0?"disabled":""} onclick="poserBloc(${iT},${j})"
                      title="« ${escapeAttr(e.texte)} » — ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}${
                        iT<0?"\n(ta phrase n'attend pas un passage)":hors?"\n(comparerait sans rien construire : dimension différente)":""}">
                <span class="nom">${escapeAttr(e.nom||e.texte)}</span>
                <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
              </button>
              <button class="del" data-f="x:${k}" onclick="oublier('${e.pid}','${e.eid}')" title="Oublier"
                      aria-label="Retirer « ${escapeAttr(e.nom||e.texte)} » du Contexte">×</button>
            </div>`;
      }
      h+=`</div>`;
    }
  }
  h+=`</div>`;
  return h;
}

/* 6) LE COMPOSEUR — les blocs de l'état courant ; seules les erreurs de
      CATÉGORIE sont refusées (§4.5). LA VOIX UNIQUE (§4.9), dérivée de `S` :
      dans le FANTÔME tant que la phrase est vide, dans l'AIDE ensuite. */
function souffle(){
  const offerts=R.blocsOfferts(S);
  // PIÈGE : à `S.compo` vide, l'état courant n'offre jamais que le PREMIER
  // terme — sonder ici manquerait toujours son moment. `comparaisonPossible`
  // regarde un cran plus loin, l'état qui suivrait la pose (§4.5).
  const second=R.comparaisonPossible(S);
  if(!S.compo.length){
    if(!S.retenus.length) return "Ouvre une pièce et retiens un passage.";
    return second ? "Sélectionne un ou plusieurs passages de ton contexte." : "Depuis ton contexte, sélectionne un passage pour répondre.";
  }
  if(offerts.some(b=>b.cite) || R.compoFinie(S)) return "";
  if(offerts.some(b=>b.type==="terme"&&b.source!=="note"))
    return "Clique sur un second passage pour le mettre en relation.";
  return offerts.length
    ? "Sur quel article t'appuies-tu pour montrer qu'il y a une irrégularité ?"
    : "Tu n'as encore reçu aucun texte à invoquer. Ce que tu vois est vrai, et tu ne peux rien en dire.";
}
/* §4.9 règle 1 — LA VOIX DEVIENT UN BOUTON quand le geste qu'elle nomme a lieu
   dans l'AUTRE colonne. Le prédicat est `indexTermeChamp`, le MÊME qui active
   les puces du Contexte (`renderRetenus`) : une seule vérité pour les deux
   surfaces. Sinon elle reste du texte — l'article et l'envoi se cliquent ici.
   Quand la voix se tait — un passage posé, la phrase se tient — il n'y a ni
   bouton ni rien à dire : le Contexte reste ouvert et les puces suffisent. */
function rendreVoix(txt, classe){
  if(!txt) return "";
  // Cliquable, elle a l'air d'un bouton — jamais d'un champ vide (§4.9 règle 1) :
  // la flèche montre où le panneau s'ouvre, au-dessus.
  return R.indexTermeChamp(S) >= 0
    ? `<button class="${classe} versContexte" data-f="voix" onclick="ouvrirContexte()">${escapeAttr(txt)}<span class="fl" aria-hidden="true">↑</span></button>`
    : `<span class="${classe}">${escapeAttr(txt)}</span>`;
}
function texteCompoPartiel(){
  if(!S.compo.length) return rendreVoix(souffle(),"trou");
  const ch=R.chaineCompo(S);
  const fini=ch.some(p=>p.bloc.deduit);
  if(fini) return `<span class="bl">${escapeAttr(M.rendre(ch).replace(/\.$/,""))}</span>`;
  return ch.map(p=>{
    if(p.bloc.type!=="terme") return `<span class="bl">${escapeAttr(p.bloc.texte)}</span>`;
    if(p.bloc.source==="note") return `<span class="bl terme">${escapeAttr(p.bloc.texte)}</span>`;
    const e=EMPAN[p.valeur];
    if(!e) return `<span class="bl terme">${escapeAttr(p.valeur)}</span>`;
    return `<span class="bl terme pose" style="--dc:${couleurDim(e.dim)}">
      <span class="nom">${escapeAttr(e.nom||e.texte)}</span>
      <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
    </span>`;
  }).join(" ");
}
/* iBloc indexe R.blocsOfferts(S) — POSITIONNEL dans la liste filtrée, donc
   dépendant de la session ; iSrc indexe le contexte ou le brouillon. */
function poserBloc(iBloc,iSrc){ R.poserBloc(S,iBloc,iSrc); rendreTout(); }
function retirerBloc(){ R.retirerBloc(S); rendreTout(); }
function viderCompo(){ R.viderCompo(S); rendreTout(); }
/* La phrase PARTIE, on revient lire l'avocat : le panneau se referme, quelle que
   soit la porte par laquelle il a été ouvert. Effacer sa phrase, non — on n'en a
   pas fini avec le Contexte pour autant. */
function envoyerCompo(){ R.envoyerCompo(S); panneau=null; panneauSuit=false; rendreTout(); }
function rappelQuestion(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  if(!a || !a.question) return "";
  const dernier=S.fil[S.fil.length-1];
  // §4.9 règle 3 : ce qui reste LISIBLE ne se répète pas. Un panneau ne couvre
  // plus la conversation — il la rétrécit — donc la question reste lisible et
  // n'a jamais à être redite tant qu'elle est le dernier mot de l'avocat.
  if(dernier && dernier.texte===a.question) return "";
  return `<div class="aide question">« ${escapeAttr(a.question)} »</div>`;
}
/* La barre des deux surfaces (§4.6) : elle NOMME ce qu'on a, et y donne accès à
   tout moment — l'autre porte, celle de qui sait déjà, la voix restant celle qui
   enseigne. Les comptes se dérivent ; les ids sont les ancres du tutoriel (R6). */
function barreSurfaces(){
  const etat = nom => panneau===nom ? "versSurface ouvert" : "versSurface";
  const compte = c => c ? ` · ${c}` : "";
  /* PIÈGE : les deux ids sont écrits EN TOUTES LETTRES, et la barre ne se replie
     donc pas en une boucle. Le tutoriel les vise (R6), et le gardien ne sait pas
     lire un id fabriqué par interpolation — il ne dirait rien le jour où l'un
     des deux disparaîtrait. */
  return `<span class="surfaces">
    <button id="btnContexte" class="${etat("contexte")}"
      onclick="basculerPanneau('contexte')">Contexte${compte(S.retenus.length)}</button>
    <button id="btnPlaidoirie" class="${etat("plaidoirie")}"
      onclick="basculerPanneau('plaidoirie')">Plaidoirie${compte(moyensRetenus().length)}</button>
  </span>`;
}
function renderCompo(){
  const offerts=R.blocsOfferts(S);
  let h=`<div class="zone"><div class="ztitle">Ta réponse${barreSurfaces()}</div><div class="compo">
    ${rappelQuestion()}
    <div class="phrase">${texteCompoPartiel()}</div>`;
  h+=`<div class="offre">`;
  const implicite=R.clotureImplicite(S);
  offerts.forEach((b,i)=>{
    if(implicite && b.id===implicite.id) return;
    if(b.type==="liaison"){
      // PIÈGE : `fondement` est propre à `.bbloc` ; `.msg.suite` est le même
      // mot pour un sens sans rapport.
      h+=`<button class="bbloc ${b.imbrique?"fondement":""}" data-f="b:${escapeAttr(b.id)}" onclick="poserBloc(${i})">${escapeAttr(b.libelle||b.texte)}${
        b.piece?portePhrase(b.piece):""}</button>`;
    } else if(b.source==="note"){
      // Repli pour une affaire d'avant la continuation : hors du contenu livré,
      // toujours supporté — on ne retire pas une capacité du moteur (§11).
      if(S.brouillon.length){
        h+=`<div class="lab">${escapeAttr(b.texte)} — une phrase déjà close</div>`;
        S.brouillon.forEach((n,j)=>{ h+=`<button class="bbloc" data-f="n:${j}" onclick="poserBloc(${i},${j})">${escapeAttr(n.texte)}</button>`; });
      }
    }
  });
  h+=`</div>`;
  // Le geste qui parle pèse plus que ceux qui défont (§4.9) : Envoyer est le seul
  // bouton plein, à droite ; retirer et effacer restent discrets, à gauche.
  if(S.compo.length)
    h+=`<div class="barre">
      <button class="defaire" data-f="retirer" onclick="retirerBloc()">← retirer</button><button class="defaire" data-f="effacer" onclick="viderCompo()">tout effacer</button>
      ${R.peutEnvoyer(S)?`<button class="envoi" data-f="envoi" onclick="envoyerCompo()">→ Envoyer</button>`:""}</div>`;
  const voix = S.compo.length ? souffle() : "";   // une seule voix par état (§4.9)
  if(voix) h+=rendreVoix(voix,"aide");
  if(S.refus) h+=`<div class="refus">${escapeAttr(S.refus)}</div>`;
  h+=`</div></div>`;
  return h;
}

/* 7) LES SURFACES — l'avocat ne voit QUE la Plaidoirie, et n'y inscrit que les
      MOYENS (§4.6). */
function renderContexte(){
  $("contexte").innerHTML = renderDossier() + renderRetenus();
}
function renderComposeur(){
  $("composeur").innerHTML = renderCompo();
}
function moyensRetenus(){
  return S.plaidoirie.filter(x=>S.brouillon[x.b] && R.estMoyen(S.brouillon[x.b].lien));
}
function renderPlaidoirie(){
  const gardes=moyensRetenus();
  let h=`<div class="zone">`;
  // Son bouton est là dès le premier écran : le panneau doit donc savoir dire
  // qu'il est vide, et le dire dans la fiction (§4.6).
  if(!gardes.length) h+=`<div class="aide">Maître Auber n'a encore rien retenu de toi.</div>`;
  h+=`<ul class="liste plaid">${gardes.map(x=>
    `<li><span class="txt">${escapeAttr(S.brouillon[x.b].texte)}${
      x.contre!=null && JEU.repetition.affirmations[x.contre]
        ? `<span class="contre">opposé à : ${escapeAttr(JEU.repetition.affirmations[x.contre].court)}</span>`:""
    }</span></li>`).join("")}</ul>`;
  h+=`</div>`;
  $("plaidoirie").innerHTML=h;
}
function envoyer(i,contre){ R.envoyer(S,i,contre); rendreTout(); }

/* 8) CLÔTURE, RÉPÉTITION, FINS */
function majCloture(){
  const btn=$("btnCloture"), hint=$("clotureHint");
  if(!btn) return;
  const ok=R.instructionComplete(S);
  if(!ok){ btn.disabled=true; btn.textContent="Clôturer l'instruction";
           hint.textContent="Maître Auber attend encore quelque chose de cette session."; }
  else if(!S.clotureDemandee){ btn.disabled=false; btn.textContent="Clôturer l'instruction";
           hint.textContent="Le droit de clôturer est ouvert. Rien ne t'y oblige."; }
  else if(R.repetitionEnCours(S)){ btn.disabled=true; btn.textContent="Confirmer la clôture";
           hint.textContent="Répétition en cours — réponds à Maître Auber dans le canal."; }
  else {   btn.disabled=false; btn.textContent="Confirmer la clôture";
           hint.textContent="Dernier mot avant le dépôt. Tu peux encore écrire."; }
}
function cloturer(){
  const suite=R.cloturer(S);            // "repetition", "fin", ou rien
  if(suite==="fin") return finir();
  if(suite) rendreTout();
}
function verserContre(i){ R.verserContre(S,i); rendreTout(); }
function avancerRepetition(){ R.avancerRepetition(S); rendreTout(); }
function finir(){
  const f=R.finir(S);
  effacerPartie();
  modal(`<div class="fin"><h3 id="modalTitre" tabindex="-1">${escapeAttr(f.titre)}</h3>
    <div class="verdict">${escapeAttr(f.verdict)}</div>
    <p>${f.texte}</p>
    <div class="btnrow"><button onclick="location.reload()">Recommencer</button></div>
  </div>`);
  const t=$("modalTitre"); if(t) t.focus();
}

/* Indicatif, jamais filtrant (§4.5). */
function portePhrase(pid){
  const d=R.porteDe(pid);
  return d.length ? `<span class="porte">porte sur : ${d.map(escapeAttr).join(", ")}</span>` : "";
}

/* §4.6 — LES DEUX SURFACES DE CÔTÉ SONT DES PANNEAUX, qui s'ouvrent ENTRE la
   conversation et le composeur et ne recouvrent RIEN : la question reste sous
   les yeux, et on voit la phrase se construire en cliquant les passages.
   DEUX variables d'ÉCRAN, hors de `S`, qui est sérialisé — on ne recharge pas
   une partie sur un panneau resté ouvert. `panneau` dit laquelle est ouverte ;
   `panneauSuit` dit qu'elle a été ouverte POUR ÉCRIRE, par la voix du composeur,
   et c'est la seule qui se referme d'elle-même. Ouverte depuis la barre, on la
   consulte : elle reste jusqu'à ce qu'on la ferme.
   PIÈGE : la fermeture automatique suit `indexTermeChamp`, ce que la phrase
   ACCEPTE, et non la voix, qui se tait dès qu'un passage est posé. À cet instant
   la grammaire ne sait pas encore si le joueur cite ou entame une comparaison
   (§4.5) : refermer là retirerait le clavier au milieu du geste le plus difficile
   du jeu. */
let panneau = null, panneauSuit = false;
function majPanneaux(){
  if(panneau==="contexte" && panneauSuit && R.indexTermeChamp(S) < 0){ panneau=null; panneauSuit=false; }
  { const p=$("panContexte");   if(p) p.hidden = panneau!=="contexte"; }
  { const p=$("panPlaidoirie"); if(p) p.hidden = panneau!=="plaidoirie"; }
  // La conversation, seule bande élastique, cède d'elle-même la place (§4.6) ;
  // la classe ne décide que jusqu'où elle peut céder, et c'est du CSS (§9).
  { const w=document.querySelector(".wrap"); if(w) w.classList.toggle("avecPanneau", !!panneau); }
}
function ouvrirContexte(){ panneau="contexte"; panneauSuit=true; rendreTout(); }
function basculerPanneau(nom){ panneau = panneau===nom ? null : nom; panneauSuit=false; rendreTout(); }
function fermerPanneau(){ panneau=null; panneauSuit=false; rendreTout(); }

/* LE CLAVIER (§4.10). Échap referme ce qui est posé PAR-DESSUS, du plus haut au
   plus bas : la pièce ouverte, la confirmation en attente, le panneau. Entrée et
   Espace font d'un SPAN qui se déclare bouton — un passage — un vrai bouton ;
   les <button> n'ont besoin de personne. */
function clavier(e){
  if(e.key==="Escape"){
    if(S.modalPiece) closeModal();
    else if(confirmRecommencer) annulerRecommencer();
    else if(panneau) fermerPanneau();
    return;
  }
  const t=e.target;
  if((e.key==="Enter" || e.key===" ") && t && t.getAttribute
     && t.getAttribute("role")==="button" && t.tagName!=="BUTTON"){
    e.preventDefault();
    t.click();
  }
}

/* ---- Démarrage ---- */
window.JEU = JEU; window.S = S; window.M = M; window.R = R; window.CHAMPS = CHAMPS;
/* `SOURCE_CONTENU` n'est plus affiché nulle part, mais reste exposé : quatre
   suites le lisent pour savoir quel contenu a été adopté (§13). */
window.SOURCE_CONTENU = SOURCE_CONTENU;
document.addEventListener("keydown", clavier);
if(!restaurerPartie()) R.envoyerRemise(S);   // la remise 1 arrive d'elle-même
rendreTout();

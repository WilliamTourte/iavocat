/* ============================================================
   LE JEU — L'ÉCRAN ET LES GESTES
   ------------------------------------------------------------
   Chargé par <script src> depuis index.html, APRÈS moteur.js, regles.js et
   content.js. Portée globale classique, jamais un module ES : c'est ce qui
   laisse les `onclick=` du HTML engendré trouver leurs fonctions.

   IL NE DÉCIDE RIEN (§9). Tout ce qui décide vit dans regles.js ; ici, le
   rendu, les gestes, la sauvegarde de partie et le tutoriel. La ligne de
   partage, à tenir : ce qui REDESSINE est une fonction d'ici — un `R.x(S,…)`
   suivi d'un `rendreTout()`, et c'est une cible de `onclick` ; ce qui LIT
   s'écrit `R.x(S)` sur place, sans enveloppe (§12).
   ============================================================ */
/* ============================================================
   1) LE CONTENU — content.js, et lui seul.
      Il est écrit dans l'atelier, exporté (« Exporter content.js »)
      et posé à côté de ce fichier. Il n'existe plus de copie
      embarquée : le contenu n'a qu'une maison (ARCHITECTURE §12).
      S'il manque ou s'il est d'un schéma que ce moteur ne connaît
      pas, on le dit franchement au lieu de jouer autre chose.
   ============================================================ */
function contenuValide(c){
  return !!( c && typeof c==="object" && (c.schema||0)>=3
    && c.pieces && typeof c.pieces==="object"
    && Array.isArray(c.dimensions)
    && c.grammaire && Array.isArray(c.grammaire.blocs) && c.grammaire.formes
    && Array.isArray(c.liens) && Array.isArray(c.remises)
    && c.repetition && Array.isArray(c.repetition.affirmations)
    && c.avocat && c.fins );
}
/* Un contenu vide et bien formé, pour que la page rende son bandeau de panne
   au lieu de planter à la première boucle. Il ne se joue pas : zéro remise. */
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

/* ============================================================
   1ter) LA GRAMMAIRE — moteur.js + les données du contenu.
   ============================================================ */
const $ = id => document.getElementById(id);
/* `MoteurAPI` est le MODULE (moteur.js) ; `M` sera l'instance liée à cette
   affaire. Deux choses, deux noms — l'atelier appelle son instance `MG()`. */
const MoteurAPI = window.MoteurGrammaire || {};
/* Tous les empans du dossier, aplatis en "pid.eid" : c'est le vocabulaire des
   TERMES que le moteur de grammaire connaît. La mémoire du joueur, elle, n'en
   contient que ce qu'il a surligné. L'aplatissement vit dans moteur.js, en un
   seul exemplaire — c'est l'argument que `creerMoteur` attend (§12). */
const CHAMPS = MoteurAPI.champsDe ? MoteurAPI.champsDe(JEU) : [];
const M = MoteurAPI.creerMoteur
        ? MoteurAPI.creerMoteur(JEU.grammaire, CHAMPS, JEU.liens)
        : null;
if(!M){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">moteur.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
const EMPAN = Object.fromEntries(CHAMPS.map(c=>[c.id,c]));
/* La couleur d'une dimension : par son RANG dans JEU.dimensions, jamais par
   sa pertinence (§4.3). La règle et la palette vivent dans moteur.js, en un
   seul exemplaire ; ici on ne choisit que le repli — une dimension inconnue de
   la liste retombe sur le gris (l'atelier, lui, la signale en rouge). */
const couleurDim = d =>
  (MoteurAPI.couleurDim ? MoteurAPI.couleurDim(JEU.dimensions,d) : null) || "var(--muted)";

/* ============================================================
   2) L'ÉTAT ET LES RÈGLES — tout ce qui décide vit dans regles.js.
      Ce fichier n'en garde que l'affichage et les gestes de l'écran.
   ============================================================ */
const R = (window.ReglesJeu||{}).creerRegles
        ? window.ReglesJeu.creerRegles(JEU, M)
        : null;
if(!R){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">regles.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
let S = R.etatInitial();

/* Ce fichier n'enveloppe PAS `regles.js`. Il appelle `R.x(S, …)` là où il lit,
   et ne garde de fonction homonyme que pour les gestes de l'écran — celles que
   le HTML engendré vise par `onclick`, et qui redessinent après coup. Lire,
   c'est `R.` ; agir, c'est une fonction d'ici (docs/CARTE.md). */

/* ---- Sauvegarde de partie — c'est de l'écran, pas de la règle ---- */
const CLE_PARTIE="iavocat_partie";
function sauverPartie(){
  try{ localStorage.setItem(CLE_PARTIE,JSON.stringify({...S,modalPiece:null,sig:R.signatureContenu()})); }catch(e){}
}
function restaurerPartie(){
  try{
    const brut=localStorage.getItem(CLE_PARTIE); if(!brut) return false;
    const d=JSON.parse(brut);
    if(d.sig!==R.signatureContenu()){ localStorage.removeItem(CLE_PARTIE); return false; }
    /* Sauvegarde écrite avant que `S.memoire` ne devienne `S.retenus`
       (docs/LEXIQUE.md). Le CONTENU, lui, n'a pas changé : la signature ne
       jette donc pas cette partie, et sans cette reprise le joueur la
       retrouverait avec zéro passage retenu, sans un mot. */
    if(d.retenus===undefined && Array.isArray(d.memoire)) d.retenus=d.memoire;
    delete d.memoire;
    delete d.sig; Object.assign(S,d); return true;
  }catch(e){ return false; }
}
function effacerPartie(){ try{ localStorage.removeItem(CLE_PARTIE); }catch(e){} }
let confirmRecommencer=false;
function recommencer(){
  const b=$("btnRecommencer");
  if(!confirmRecommencer){
    confirmRecommencer=true;
    if(b) b.textContent="tout effacer ?";
    setTimeout(()=>{ confirmRecommencer=false; if(b) b.textContent="⟲ recommencer"; },2500);
    return;
  }
  effacerPartie(); effacerTuto(); location.reload();
}

/* ---- Le tutoriel du premier geste (§4.8) — de l'écran, pas de la règle ----
   Il ne DÉCIDE rien : son temps courant se dérive de `S`, il n'ajoute aucun
   champ d'état et il ne se sauvegarde pas avec la partie. Retirer ce bloc
   laisserait le jeu identique. Le halo entoure la ZONE où le geste a lieu —
   jamais le bon empan : ce serait désigner la réponse à la lampe torche (§4.3).
   Ses phrases ne sont pas du contenu : elles parlent depuis le chrome, hors de
   la fiction, parce que dans la fiction personne n'explique rien (§8.6). */
const CLE_TUTO="iavocat_tuto";
let tutoFait=false;
try{ tutoFait = !!localStorage.getItem(CLE_TUTO); }catch(e){}
function effacerTuto(){ try{ localStorage.removeItem(CLE_TUTO); }catch(e){} }
function tutoClore(){ tutoFait=true; try{ localStorage.setItem(CLE_TUTO,"1"); }catch(e){} }
function tutoPasser(){ tutoClore(); majTutoriel(); }
/* Ce que la question attend, dérivé du contenu exactement comme le fait le
   harnais : le tag de l'attente courante, le lien qui le porte, son terme s'il
   est ATOMIQUE. Rien n'est nommé ici, et une comparaison ne rend rien — le
   tutoriel ne juge que la réponse par citation, la seule qu'il enseigne. */
function tutoAttendu(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  const L=a&&a.attend&&(JEU.liens||[]).find(x=>x.tag===a.attend);
  const t=L&&(L.termes||[])[0];
  return typeof t==="string" ? t : null;
}
/* Quatre temps, et pas un de plus — ce sont ceux qui restent depuis qu'une
   suite unique se pose toute seule (§4.5). Le second en a deux moitiés : la
   pièce ouverte couvre l'écran, il faut la refermer pour atteindre sa mémoire.
   Le tutoriel n'avance qu'avec le passage demandé. Il n'EMPÊCHE rien pour
   autant : la mémoire reste gratuite, illimitée et réversible, la phrase se
   compose et s'envoie quand même. Ce qu'il retient, c'est son approbation —
   c'est tout ce qu'un panneau indicateur peut retenir (§4.8). */
function tutoEtape(){
  if(S.remisesEnvoyees!==1 || S.satisfaits.length) return null;
  const veut=tutoAttendu();
  if(veut ? !S.retenus.includes(veut) : !S.retenus.length){
    // Autre chose est retenu : ce n'est pas le passage demandé, et on le dit.
    const rate = !!veut && S.retenus.length>0;
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .piecetexte", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond."
                      : "Les passages soulignés se retiennent d'un clic. Prends celui qui répond."}
      : {n:1, ou:"#discussion .attach", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande. Rouvre la pièce et relis sa question."
                      : "Ouvre la pièce : ce qu'il te demande est écrit dedans."};
  }
  if(S.prete==null)
    return S.modalPiece
      ? {n:2, ou:"#modalRoot .close",
            dit:"Passage retenu. Referme la pièce."}
      : {n:3, ou:"#zoneRetenus",
            dit:"Pour répondre, sélectionne le passage pertinent"};
  return  {n:4, ou:"#composeur button.envoi",
            dit:"Clique sur → Envoyer"};
}
/* En fin de `rendreTout`, comme `majCloture` : les trois colonnes et la modale
   sont refaites à chaque geste, donc le halo se repose à chaque geste. On
   marque par un ATTRIBUT et non par une classe — la sérialisation le range en
   fin de balise et laisse les `class="…"` intactes, que des suites lisent. */
let tutoCible=null;
function majTutoriel(){
  const banniere=$("tuto"); if(!banniere) return;
  if(tutoCible){ tutoCible.removeAttribute("data-tuto"); tutoCible=null; }
  const e = tutoFait ? null : tutoEtape();
  if(!e){
    // Première réponse envoyée (ou partie déjà avancée) : il ne revient plus.
    if(!tutoFait && S.remisesEnvoyees>=1) tutoClore();
    banniere.hidden=true; return;
  }
  tutoCible=document.querySelector(e.ou);
  if(tutoCible) tutoCible.setAttribute("data-tuto", e.alerte?"alerte":"");
  banniere.toggleAttribute("data-alerte", !!e.alerte);
  $("tutoPas").textContent=e.n+"/4";
  $("tutoDit").textContent=e.dit;
  banniere.hidden=false;
}

/* ============================================================
   3) RENDU COMMUN
   ============================================================ */
const modalRoot = $("modalRoot");
// Refermer est un geste comme un autre : le tutoriel doit pouvoir suivre (§4.8).
function closeModal(){ S.modalPiece=null; modalRoot.innerHTML=""; rendreTout(); }
function modal(html){
  modalRoot.innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">
       <div class="modal"><button class="close" onclick="closeModal()">×</button>${html}</div>
     </div>`;
}
function escapeAttr(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function rendreTout(){ renderDiscussion(); renderComposeur(); renderMemoire(); renderPlaidoirie(); majCloture(); majTutoriel(); sauverPartie(); }

/* ---- Le canal : un fil de messages ---- */
function renderDiscussion(){
  let h="", dernier=null;
  for(const m of S.fil){
    // Les textes de l'avocat viennent du contenu, écrits pour l'écran ; la
    // bulle de l'IA reprend une phrase composée, qu'on échappe.
    // Le locuteur ne s'écrit qu'au CHANGEMENT de locuteur : quatre bulles
    // d'affilée n'ont qu'un nom au-dessus (§4.9).
    const meme = m.qui===dernier; dernier=m.qui;
    h+=`<div class="msg ${m.ia?'ia':''} ${meme?'suite':''}">${
      meme?"":`<div class="who">${escapeAttr(m.qui)}</div>`}<div class="bubble">${m.ia?escapeAttr(m.texte):m.texte}<div>`;
    for(const pid of m.pieces){
      const seen=S.examinees.includes(pid)?"seen":"";
      h+=`<span class="attach ${seen}" onclick="ouvrirPiece('${pid}')">📎 ${escapeAttr(JEU.pieces[pid].titre)}</span>`;
    }
    h+=`</div></div></div>`;
  }
  // la répétition : le présentoir, sous la dernière affirmation
  if(S.clotureDemandee && S.repetitionIdx>-1 && S.repetitionIdx<JEU.repetition.affirmations.length){
    const dispo=S.brouillon.map((n,i)=>({n,i}));
    h+=`<div class="repet"><div class="rtitle">Opposer une phrase à cette affirmation ?</div>${
      dispo.length ? dispo.map(x=>
        `<div class="rnote"><span class="txt">${escapeAttr(x.n.texte)}</span>
         ${x.n.versee?`<span class="sent">déjà envoyée</span>`:`<button class="up" onclick="verserContre(${x.i})">envoyer</button>`}</div>`).join("")
      : `<div class="rnote vide">tu n'as écrit aucune phrase à y opposer</div>`
    }<button class="btn" onclick="avancerRepetition()">Ne rien envoyer — continuer</button></div>`;
  }
  const el=$("discussion");
  el.innerHTML=h;
  el.scrollTop=el.scrollHeight;
}

/* ---- Les pièces : le texte, ses empans, l'index du dossier ---- */
/* Tout empan déclaré est marqué et cliquable. Le marquage ne varie JAMAIS
   selon l'importance de la pièce ni selon la progression (§4.3). */
function rendreTexte(pid){
  const p=JEU.pieces[pid];
  const src=String(p.texte||"");
  let h="", reste=src, m;
  const re=/\{\{([A-Za-z0-9_]+)\}\}/;
  while((m=re.exec(reste))){
    h+=escapeAttr(reste.slice(0,m.index));
    const eid=m[1], e=(p.empans||{})[eid];
    if(e){
      const k=pid+"."+eid, pris=S.retenus.includes(k);
      h+=`<span class="empan ${pris?'pris':''}" style="--dc:${couleurDim(e.dim)}"
            onclick="surligner('${pid}','${eid}')" title="${escapeAttr(e.dim)} — ${escapeAttr(e.qui||p.qui||'')}">${escapeAttr(e.texte)}</span>`;
    } else h+=escapeAttr(m[0]);
    reste=reste.slice(m.index+m[0].length);
  }
  h+=escapeAttr(reste);
  return h;
}
function ouvrirPiece(pid){
  R.ouvrirPiece(S,pid);            // vue + son `declenche` éventuel
  modal(modalPieceHTML(pid));
  rendreTout();
}
/* LE DOSSIER — les pièces d'abord, les règles ensuite. Deux bandes, parce que
   ce sont deux natures : ce que l'accusation a trouvé d'un côté, le manuel du
   cas de l'autre. L'atelier range déjà son graphe ainsi. Deux bandes et non
   deux colonnes : à cette largeur, une demi-colonne ne tenait plus deux puces
   côte à côte (§4.9). */
function renderDossier(){
  if(!S.remisesEnvoyees) return "";
  const livres=R.piecesLivrees(S);
  const chip=pid=>{
    const p=JEU.pieces[pid], vu=S.examinees.includes(pid);
    return `<span class="dchip ${vu?'vu':''} ${R.estRegle(p)?'regle':''}"
      onclick="ouvrirPiece('${pid}')" title="${escapeAttr(p.titre)}">${vu?'✓':'●'} ${escapeAttr(p.court)}</span>`;
  };
  // L'étiquette de la bande tient sur la ligne des puces, en gouttière : deux
  // natures, mais pas deux lignes de plus (§4.9).
  const colonne=(titre,pids)=>`<div class="dcol"><span class="dtitre">${titre}</span>
    <div class="dchips">${pids.length?pids.map(chip).join(""):`<span class="dvide">—</span>`}</div></div>`;
  const pieces=livres.filter(pid=>!R.estRegle(JEU.pieces[pid]));
  const regles=livres.filter(pid=> R.estRegle(JEU.pieces[pid]));
  return `<div class="zone" id="zoneDossier">
    <div class="dossier">${colonne("Les pièces",pieces)}${colonne("Les règles",regles)}</div></div>`;
}

/* ============================================================
   4) LA MÉMOIRE — privée, gratuite, illimitée, et CLAVIER du composeur.
      Surligner ne produit RIEN. C'est voulu.
   ============================================================ */
function surligner(pid,eid){
  R.surligner(S,pid,eid);          // privé, gratuit, illimité ; re-cliquer oublie
  if(S.modalPiece) modal(modalPieceHTML(S.modalPiece));
  rendreTout();
}
function modalPieceHTML(pid){
  const p=JEU.pieces[pid];
  const dims=[...new Set(Object.values(p.empans||{}).map(e=>e.dim))];
  return `<h3>${escapeAttr(p.titre)}</h3><small class="note">${escapeAttr(p.type)} — ${escapeAttr(p.qui||"")}</small>
    <p class="piecetexte">${rendreTexte(pid)}</p>
    `;
}
/* La mémoire est AUSSI le clavier du composeur : un empan retenu n'existe
   qu'une fois à l'écran (§4.6). Deux lignes, pas trois (§4.9) : le NOM (ce qui
   parlera dans la phrase), puis la citation et sa provenance sur la MÊME ligne
   — la citation cède au besoin (ellipse, `title` pour la lire en entier), la
   source jamais, c'est elle qui fonde. Le corps pose l'empan dans la phrase
   quand un terme est attendu ; le « × » l'oublie, toujours.
   L'id de zone est la cible du 3ᵉ temps du tutoriel : il se visait autrefois
   par `:last-child`, ce qui dépendait de l'ordre des zones (§4.8). */
function renderRetenus(){
  const iT=R.indexTermeChamp(S);
  let h=`<div class="zone" id="zoneRetenus">`;
  if(!S.retenus.length){
    // Le geste, c'est le composeur qui le nomme (§4.9) ; ici, la seule chose
    // que la zone vide ait à dire est ce qu'elle est — une surface qui ne
    // transmet rien (§4.6).
    h+=`<div class="aide">Alimente ta mémoire en sélectionnant des passages du dossier .</div>`;
  } else {
    for(const d of JEU.dimensions||[]){
      const ks=S.retenus.map((k,j)=>({k,j})).filter(x=>EMPAN[x.k] && EMPAN[x.k].dim===d);
      if(!ks.length) continue;
      h+=`<div class="dimgrp" style="--dc:${couleurDim(d)}"><div class="dnom">${escapeAttr(d)}</div>`;
      for(const {k,j} of ks){
        const e=EMPAN[k];
        h+=`<div class="mchip" style="--dc:${couleurDim(d)}">
              <button class="corps" ${iT<0?"disabled":""} onclick="poserBloc(${iT},${j})"
                      title="« ${escapeAttr(e.texte)} » — ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}${
                        iT<0?"\n(ta phrase n'attend pas un passage)":""}">
                <span class="nom">${escapeAttr(e.nom||e.texte)}</span>
                <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
              </button>
              <button class="del" onclick="surligner('${e.pid}','${e.eid}')" title="Oublier">×</button>
            </div>`;
      }
      h+=`</div>`;
    }
  }
  h+=`</div>`;
  return h;
}

/* ============================================================
   5) LE COMPOSEUR — les blocs de l'état courant, de gauche à droite.
      Aucune liste n'est restreinte : seules les erreurs de CATÉGORIE
      sont refusées, à la clôture de la phrase (§4.5 d'ARCHITECTURE).
   ============================================================ */
/* LA VOIX UNIQUE DU COMPOSEUR (§4.9). Une seule phrase pour l'état courant,
   dérivée de `S` comme le tutoriel dérive son temps : rendue dans le FANTÔME
   tant que la phrase est vide, dans l'AIDE dès qu'elle ne l'est plus. Elle ne
   décide rien et ne lit aucun contenu — un compte de blocs, deux drapeaux de
   grammaire, la longueur de la mémoire. */
function souffle(){
  const offerts=R.blocsOfferts(S);
  const second=offerts.some(b=>b.type==="terme"&&b.deduit);
  const attendTerme=offerts.some(b=>b.type==="terme"&&b.source!=="note");
  if(!S.compo.length){
    if(!S.retenus.length) return "Ouvre une pièce et retiens un passage.";
    return second ? "Sélectionne deux passages depuis ta mémoire…" : "Depuis ta mémoire, sélectionne un passage pour répondre";
  }
  const citation=offerts.some(b=>b.cite);
  if(citation && second) return "Ajouter un second passage ?";
  if(citation) return "Quel article citer pour appuyer la déclaration ?";
  if(attendTerme) return "Clique sur un second passage pour le mettre en relation";
  /* LA RELANCE. Une comparaison n'est jamais terminée d'office : elle demande
     toujours « et donc ? ». C'est le composeur qui pose la question — l'avocat
     n'a plus à s'agacer d'une remarque nue, elle ne peut plus lui parvenir.
     Elle ne se coupe pas : elle porte la contrainte de fondement par la forme
     (§4.5, §4.9). */
  return offerts.length
    ? "Et donc ? Une comparaison ne se plaide pas seule — au regard de quel texte ?"
    : "Tu n'as encore reçu aucun texte à invoquer. Ce que tu vois est vrai, et tu ne peux rien en dire.";
}
function texteCompoPartiel(){
  const offerts=R.blocsOfferts(S);
  if(!S.compo.length) return `<span class="trou">${escapeAttr(souffle())}</span>`;
  const ch=R.chaineCompo(S);
  /* Tant que le second empan n'est pas posé, la relation n'existe pas : on ne
     l'invente pas, on montre le trou. Une fois la paire close, `rendre` écrit
     la phrase déduite d'un bloc, par son patron (§4.5). */
  const fini=ch.some(p=>p.bloc.deduit);
  if(fini) return `<span class="bl">${escapeAttr(M.rendre(ch).replace(/\.$/,""))}</span>`;
  return ch.map(p=>{
    if(p.bloc.type!=="terme") return `<span class="bl">${escapeAttr(p.bloc.texte)}</span>`;
    if(p.bloc.source==="note") return `<span class="bl terme">${escapeAttr(p.bloc.texte)}</span>`;
    const e=EMPAN[p.valeur];
    return `<span class="bl terme" style="--dc:${couleurDim(e?e.dim:"")}">${escapeAttr(e?(e.nom||e.texte):p.valeur)}</span>`;
  }).join(" ") + (offerts.some(b=>b.type==="terme"&&b.deduit)
    ? ` <span class="trou">…et ?</span>` : "");
}
/* iBloc indexe R.blocsOfferts(S) ; iSrc indexe la mémoire (terme/champ) ou le
   brouillon (terme/note). Les liaisons n'ont pas de source. Poser, retirer,
   vider : la décision est dans regles.js, l'écran ne fait que suivre — c'est
   pour ça que ces quatre-là existent encore, et pas les lectures. */
function poserBloc(iBloc,iSrc){ R.poserBloc(S,iBloc,iSrc); rendreTout(); }
function retirerBloc(){ R.retirerBloc(S); rendreTout(); }
function viderCompo(){ R.viderCompo(S); rendreTout(); }
function effacerPrete(){ R.effacerPrete(S); rendreTout(); }
/* La question en cours, rappelée au-dessus du composeur : dans le canal elle
   défile dès que l'avocat reparle, et on écrit la réponse ici. Sans préfixe —
   les guillemets et le filet de gauche disent déjà qui parle (§4.9). */
function rappelQuestion(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  if(!a || !a.question) return "";
  /* Depuis que le composeur est SOUS le fil (§4.6), la question vient souvent
     d'être posée juste au-dessus : la rappeler l'écrirait deux fois à quelques
     pixels d'écart. On ne la redit donc que lorsqu'elle a cessé d'être le
     dernier mot — c'est-à-dire quand l'avocat a reparlé depuis, et qu'elle a
     commencé à remonter hors de vue (§4.9). Dérivé de `S`, sans champ neuf. */
  const dernier=S.fil[S.fil.length-1];
  if(dernier && dernier.texte===a.question) return "";
  return `<div class="aide question">« ${escapeAttr(a.question)} »</div>`;
}
function renderCompo(){
  /* Une phrase close attend LÀ, sous les yeux, avec le seul geste qui parle.
     Pas de liste à parcourir, pas de colonne à changer (§4.6). */
  if(S.prete!=null && S.brouillon[S.prete]){
    return `<div class="zone"><div class="ztitle">Réponse</div><div class="compo prete">
      ${rappelQuestion()}
      <div class="phrase close">${escapeAttr(S.brouillon[S.prete].texte)}</div>
      <div class="barre">
        <button class="envoi" onclick="envoyer(${S.prete})">→ Envoyer</button>
        <button onclick="effacerPrete()">effacer</button>
      </div>
      ${S.plaidoirie.length?"":`<div class="aide">Tant que tu ne l'envoies pas, personne ne la lit.</div>`}
    </div></div>`;
  }
  const offerts=R.blocsOfferts(S);
  let h=`<div class="zone"><div class="ztitle">Ta réponse</div><div class="compo">
    ${rappelQuestion()}
    <div class="phrase">${texteCompoPartiel()}</div>`;
  if(S.compo.length)
    h+=`<div class="barre"><button onclick="retirerBloc()">← retirer</button><button onclick="viderCompo()">tout effacer</button></div>`;
  h+=`<div class="offre">`;
  offerts.forEach((b,i)=>{
    if(b.type==="liaison"){
      // `libelle` quand le bouton dit autre chose que ce qui s'écrira ; `suite`
      // marque les continuations, qui qualifient ce qui précède (§4.5). Une
      // liaison-article annonce ce qu'elle régit — sans que rien soit filtré.
      h+=`<button class="bbloc${b.imbrique?" suite":""}" onclick="poserBloc(${i})">${escapeAttr(b.libelle||b.texte)}${
        b.piece?portePhrase(b.piece):""}</button>`;
    } else if(b.source==="note"){
      // Repli pour une affaire écrite avant la continuation : le contenu livré
      // n'en a plus, mais le moteur et le jeu la supportent toujours (§11).
      if(S.brouillon.length){
        h+=`<div class="lab">${escapeAttr(b.texte)} — une phrase déjà close</div>`;
        S.brouillon.forEach((n,j)=>{ h+=`<button class="bbloc" onclick="poserBloc(${i},${j})">${escapeAttr(n.texte)}</button>`; });
      }
    }
    // Un terme sans source `note` n'écrit rien ici : les puces de la mémoire,
    // plus bas, SONT le clavier (§4.6).
  });
  h+=`</div>`;
  /* La voix unique — et une seule fois. Tant que la phrase est vide, le fantôme
     l'a déjà dite ; dès qu'elle porte quelque chose, c'est ici qu'elle se dit
     (§4.9). */
  if(S.compo.length) h+=`<div class="aide">${escapeAttr(souffle())}</div>`;
  if(S.refus) h+=`<div class="refus">${escapeAttr(S.refus)}</div>`;
  h+=`</div></div>`;
  return h;
}

/* ============================================================
   6) LA MÉMOIRE (privée) ET LA PLAIDOIRIE (transmise).
      L'avocat ne voit QUE la Plaidoirie. Envoyer est le seul geste
      à conséquence — donc le seul lieu possible du dilemme. Et il
      n'y inscrit que les MOYENS : le reste, il le dit.
      (« atelier » ne désigne plus que app/atelier_v3.html, l'outil
       qui écrit les affaires — docs/LEXIQUE.md.)
   ============================================================ */
/* La colonne de travail : le dossier et les empans retenus. La phrase, elle,
   s'écrit sous le canal depuis le 31 juillet (§4.6) — le clavier reste ici,
   c'est le prix accepté de l'arbitrage (§7). La liste d'empans ne figure
   toujours qu'une fois à l'écran. */
function renderMemoire(){
  $("memoire").innerHTML = renderDossier() + renderRetenus();
}
/* Le composeur, sous le fil : `renderCompo` rend déjà une zone autonome, avec
   son titre, le rappel de la question et le bouton d'envoi. Il n'a rien eu à
   apprendre du déménagement — seule sa destination change. */
function renderComposeur(){
  $("composeur").innerHTML = renderCompo();
}
/* Un seul titre : celui de la colonne, qui nomme la surface (§4.9). Le compte
   monte le rejoindre dans le `<h2>` — le plan n'a qu'une zone, elle n'a pas à
   se renommer sous son propre en-tête. */
function renderPlaidoirie(){
  const gardes=S.plaidoirie.filter(x=>S.brouillon[x.b] && R.estMoyen(S.brouillon[x.b].lien));
  /* Vide, la colonne n'existe pas : ce qui n'a rien à montrer ne prend pas de
     place pour dire qu'il n'a rien à montrer (§4.9). Elle apparaît d'elle-même
     au premier moyen versé, et c'est cette apparition qui l'enseigne — d'où
     l'absence de toute phrase d'attente ici : elle serait inatteignable. */
  const vide = !gardes.length;
  { const c=$("colPlaidoirie"); if(c) c.hidden=vide; }
  { const w=document.querySelector(".wrap"); if(w) w.classList.toggle("sansPlan",vide); }
  { const c=$("plaidoirieCount"); if(c) c.textContent=gardes.length||""; }
  let h=`<div class="zone">`;
  h+=`<ul class="liste plaid">${gardes.map(x=>
    `<li><span class="txt">${escapeAttr(S.brouillon[x.b].texte)}${
      x.contre!=null && JEU.repetition.affirmations[x.contre]
        ? `<span class="contre">opposé à : ${escapeAttr(JEU.repetition.affirmations[x.contre].court)}</span>`:""
    }</span></li>`).join("")}</ul>`;
  h+=`</div>`;
  $("plaidoirie").innerHTML=h;
}
/* LE GESTE. Le seul qui traverse la frontière — donc le seul lieu du dilemme.
   Ce qu'il déclenche (les drapeaux, la réplique, l'avancement de session) est
   dans regles.js ; ici, on ne fait que redessiner après coup. */
function envoyer(i,contre){ R.envoyer(S,i,contre); rendreTout(); }

/* ============================================================
   7) CLÔTURE, RÉPÉTITION, FINS
   ============================================================ */
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
/* Opposer une phrase à l'affirmation en cours — c'est le MÊME geste que
   l'envoi ordinaire, avec une cible. Le présentoir lit le journal : c'est le
   dernier moment où la conclusion tue peut encore partir (§4.7). */
function verserContre(i){ R.verserContre(S,i); rendreTout(); }
function avancerRepetition(){ R.avancerRepetition(S); rendreTout(); }
function finir(){
  const f=R.finir(S);
  effacerPartie();
  modal(`<div class="fin"><h3>${escapeAttr(f.titre)}</h3>
    <div class="verdict">${escapeAttr(f.verdict)}</div>
    <p>${f.texte}</p>
    <div class="btnrow"><button onclick="location.reload()">Recommencer</button></div>
  </div>`);
}

/* ---- Ce qu'un article régit ----
   Chaque article annonce ce qu'il régit (`porte`) : c'est la seule aide que
   le jeu donne au joueur sur le genre de relation à chercher. Purement
   indicatif — aucune liste n'est filtrée, aucune phrase n'est refusée pour
   ça (§4.5). Le composeur l'écrit sous la liaison-article.

   LES MANUELS ONT ÉTÉ RETIRÉS. `openManuels()` vivait ici sans qu'aucun bouton
   ne l'appelle depuis le retrait du <header> : seules quatre assertions de test
   la maintenaient en vie, c'est-à-dire qu'on éprouvait un chemin que le joueur
   ne pouvait pas prendre. La RÈGLE, elle, reste disponible dans regles.js
   (`reglesLivrees`, `porteDe`) : rebrancher les Manuels est une décision de
   design, et elle ne coûtera pas une ligne de moteur. */
function portePhrase(pid){
  const d=R.porteDe(pid);
  return d.length ? `<span class="porte">porte sur : ${d.map(escapeAttr).join(", ")}</span>` : "";
}

/* ---- Démarrage ---- */
window.JEU = JEU; window.S = S; window.M = M; window.R = R; window.CHAMPS = CHAMPS;
/* `SOURCE_CONTENU` reste exposé — quatre suites le lisent pour savoir QUEL
   contenu a été adopté (§13). Ce qui a disparu, c'est son affichage : il
   s'écrivait dans un `#srcContenu` du `<header>`, retiré depuis. La ligne qui
   le cherchait ne faisait donc plus rien, et son `if(el)` l'empêchait de le
   dire — même silence que les cibles du tutoriel (§2 de la passation). */
window.SOURCE_CONTENU = SOURCE_CONTENU;
if(!restaurerPartie()) R.envoyerRemise(S);   // la remise 1 arrive d'elle-même
rendreTout();

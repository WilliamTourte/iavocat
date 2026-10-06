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
let tutoFait=false;
try{ tutoFait = !!localStorage.getItem(CLE_TUTO); }catch(e){}
function effacerTuto(){ try{ localStorage.removeItem(CLE_TUTO); }catch(e){} }
function tutoClore(){ tutoFait=true; try{ localStorage.setItem(CLE_TUTO,"1"); }catch(e){} }
/* Le bandeau disparu emporte son bouton : le focus va au jeu, pas à la page. */
function tutoPasser(){
  tutoClore(); majTutoriel();
  const el=premierFocalisable(document.querySelector("#panPiece")) || premierFocalisable($("discussion"));
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
/* L'ARTICLE SE DÉSIGNE, LA RELATION JAMAIS (§4.8) : le bloc de liaison qui
   emboîte la forme du lien attendu, et sa pièce. Dérivé du lien, jamais d'un
   nom d'article câblé. */
function tutoArticle(){
  const t=tutoLienAttente();
  return (t && (JEU.grammaire.blocs||[]).find(b=>
    b.type==="liaison" && b.imbrique && b.piece && b.forme===t.forme)) || null;
}
/* LA BULLE NE COMPTE PAS (§4.8) : le rang `n` ne sert plus qu'à la clé de
   `tutoVues`. Elle a porté « citer · 2/4 », puis deux séries chacune son total ;
   un rang n'apprenait rien au joueur. */
const GESTE_CITER = {geste:"citer"};
const GESTE_RELIER = {geste:"mettre en relation"};
/* PIÈGE : le chrome N'EST PERSONNE — il nomme le GESTE, jamais la TROUVAILLE
   (§4.8). Dire « les deux passages qui se contredisent », c'est répondre à la
   place du joueur ; l'avocat, lui, a le droit : il sait, il calibre (§3). */
function tutoEtapeCitation(){
  const veut=tutoAttendu();
  if(veut ? !S.retenus.includes(veut) : !S.retenus.length){
    const rate = !!veut && S.retenus.length>0;
    return S.modalPiece
      ? {...GESTE_CITER, n:2, ou:"#panPiece .piecetexte", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande."
                      : "Retiens le passage qui répond.",
            ditLong: rate
              ? "Ce n'est pas ce qu'il demande. Relis sa question, et retiens le passage qui y répond."
              : "Clique sur le passage répondant à la question pour l'ajouter à ton CONTEXTE."}
      /* AU PREMIER ÉCRAN, IL SE TAIT (§4.8) : le message finit sur le bouton de
         pièces, qui dit déjà où elles sont. Il commence au CONTEXTE ouvert —
         sauf pour corriger : l'alerte, elle, parle panneau fermé. */
      : panneau==="contexte"
        ? {...GESTE_CITER, n:1, ou:"#zoneDossier", alerte:rate,
            dit: rate ? "Ce n'est pas ce qu'il demande."
                      : "Ouvre une pièce.",
            ditLong: rate
              ? "Ce n'est pas ce qu'il demande. Relis sa question, puis ouvre la pièce qui y répond."
              : "Clique sur la pièce demandée : PV d'intervention."}
        : rate
          ? {...GESTE_CITER, n:1, ou:"#discussion .attach", alerte:true,
              dit:"Ce n'est pas ce qu'il demande.",
              ditLong:"Ce n'est pas ce qu'il demande. Relis sa question, puis choisis la bonne pièce dans ton CONTEXTE."}
          : null;
  }
  /* Plus de temps « Referme la pièce » (§4.6) : elle vit DANS le CONTEXTE, et le
     passage retenu paraît juste en dessous, prêt à être pris. */
  if(!R.peutEnvoyer(S))
    return panneau==="contexte"
        ? {...GESTE_CITER, n:3, ou:"#zoneRetenus",
            dit:"Sélectionne le passage retenu.",
            ditLong:"Sélectionne le passage qui répond à sa question pour l'ajouter à ta RÉPONSE."}
        : {...GESTE_CITER, n:3, ou:"#btnCONTEXTE",
            dit:"Ouvre ton CONTEXTE.",
            ditLong:"Ouvre ton CONTEXTE : le passage que tu viens de retenir s'y trouve."};
  /* LA PHRASE QUI SE TIENT LE FAIT TAIRE (§4.8) : « → Envoyer », seul bouton
     plein de l'écran, se montre seul. */
  return null;
}
function tutoEtapeComparaison(){
  if(R.indexTermeChamp(S)>=0){
    const dit = S.compo.length ? "Prends un second passage." : "Prends un premier passage.";
    const ditLong = S.compo.length
      ? "Prends un second passage pour le comparer au premier : une réponse peut tenir sur deux."
      : "Une réponse peut tenir sur deux passages. Prends-en un premier dans ton CONTEXTE.";
    return panneau==="contexte"
      ? {...GESTE_RELIER, n:1, ou:"#zoneRetenus", dit, ditLong}
      : {...GESTE_RELIER, n:1, ou:"#btnCONTEXTE", dit:"Ouvre ton CONTEXTE.",
          ditLong:"Ouvre ton CONTEXTE : "+ditLong[0].toLowerCase()+ditLong.slice(1)};
  }
  /* PIÈGE : une comparaison nue EST envoyable (§4.5), donc ce temps doit passer
     AVANT le silence de la phrase qui se tient — sans quoi la bulle se tairait
     là où la leçon est « il te faut un article ». Et depuis qu'un texte s'invoque une fois
     LU, l'article peut n'être offert nulle part : on montre alors où le lire —
     SA puce dans l'index, puis SON bloc dans les propositions (`f`, §4.8). Sans
     article dérivable, la zone seule, comme avant. */
  if(S.compo.length && !R.compoFinie(S)){
    const art=tutoArticle();
    const aLire = art ? !S.examinees.includes(art.piece)
                      : !R.blocsOfferts(S).some(b=>b.type==="liaison"&&b.imbrique);
    if(!aLire)
      return {...GESTE_RELIER, n:3, ou:"#composeur .offre", f: art && "b:"+art.id,
        dit:"Prends l'article qui la fonde.",
        ditLong:"Une relation seule ne suffit pas : prends l'article sur lequel elle s'appuie."};
    const ditLong="Une relation seule ne suffit pas : il lui faut un article qui la fonde.";
    /* Une pièce encore ouverte replie l'index, et la puce y est cachée : le cas
       COURANT, la citation d'avant ayant laissé sa pièce ouverte. On montre
       alors « déplier », la porte de la puce — jamais on ne déplie à sa place. */
    if(panneau!=="contexte")
      return {...GESTE_RELIER, n:2, ou:"#btnCONTEXTE", dit:"Ouvre ton CONTEXTE.",
          ditLong:ditLong+" Ton dossier est dans ton CONTEXTE."};
    return art && indexPlie()
      ? {...GESTE_RELIER, n:2, ou:"#zoneDossier", f:"dossier", dit:"Déplie ton dossier.",
          ditLong:ditLong+" Déplie ton dossier : l'article y est, et on n'invoque que ce qu'on a lu."}
      : {...GESTE_RELIER, n:2, ou:"#zoneDossier", f: art && "d:"+art.piece, dit:"Lis l'article.",
          ditLong:ditLong+" Ouvre-le dans ton dossier : on n'invoque que ce qu'on a lu."};
  }
  return null;   // la phrase qui se tient : « → Envoyer » se montre seul (§4.8)
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
/* §4.8 — CHAQUE CONSIGNE NEUVE S'AFFICHE D'ABORD DÉVELOPPÉE, puis se réduit en
   icône dès le rendu suivant : ce jeu ne rend jamais hors d'un geste du joueur,
   donc "le rendu suivant" EST "le joueur a fait quelque chose" — se tromper y
   compris, puisque le texte d'alerte est alors une consigne neuve comme une
   autre. `tutoReouvre` est une lecture UNIQUE posée par l'icône, consommée au
   prochain `majTutoriel` — même idiome que `focusVoulu`. */
let tutoReduit=false, tutoReouvre=false;
/* Une consigne NEUVE qui désigne un élément précis (`f`, §4.8) va le chercher
   dans le champ : le bloc de l'article naît au bas d'un composeur plafonné, sous
   le pli, et un halo qu'on ne voit pas ne montre rien. Lecture unique, consommée
   par `voirCibleTuto` — une seule fois, pour ne jamais disputer le défilement au
   joueur qui l'aurait déplacé depuis. */
let tutoVoir=false;
/* NEUVE VEUT DIRE JAMAIS MONTRÉE (§4.8) : revenir de l'envoi à la prise d'un
   passage après « tout effacer » redéployait une consigne déjà lue. Seule l'alerte se redéploie
   déjà vue — se tromper rouvre. La clé est le geste, le rang et le texte : à
   un même rang, « Ouvre ton CONTEXTE » et « Ouvre une pièce » sont deux
   consignes. */
const tutoVues=new Set();
function majTutoriel(){
  const banniere=$("tuto"), corps=$("tutoCorps"), icone=$("tutoIcone");
  if(!banniere) return;
  if(tutoCible){ tutoCible.removeAttribute("data-tuto"); tutoCible=null; }
  /* La session 1 finie (remise 2 livrée), les deux gestes ont eu leur chance :
     fermeture définitive, qu'une leçon ait ou non été vue jusqu'au bout. */
  if(!tutoFait && S.remisesEnvoyees>1) tutoClore();
  const e = tutoFait ? null : tutoEtape();
  const cle = e && e.geste+" "+e.n+" "+e.dit;
  const neuf = !!e && e.dit!==tutoDernierDit && (!!e.alerte || !tutoVues.has(cle));
  if(e) tutoVues.add(cle);
  const montrer = neuf || (!!e && tutoReouvre);
  tutoReduit = e ? !montrer : false;
  /* Le halo ne se voit pas à l'oreille : une consigne NEUVE s'annonce (§4.10),
     une consigne répétée par un redessin, non — qu'on la rouvre à la main ne
     vaut pas une seconde annonce. */
  if(neuf) tutoAnnonce="Tutoriel : "+(e.ditLong||e.dit);
  tutoDernierDit = e ? e.dit : null;
  tutoReouvre = false;
  if(!e){ banniere.hidden=true; return; }
  /* `ou` est la ZONE, toujours un littéral (R6) ; `f`, la clé `data-f` d'un
     élément précis dedans (§4.8 — l'article). Caché — l'index replié —, ou
     absent, le halo retombe sur la zone. Retrouvé par itération, comme
     `rendreFocus` : une clé n'a pas à s'échapper en sélecteur. */
  const zone=document.querySelector(e.ou);
  const precis = e.f && zone && [...zone.querySelectorAll("[data-f]")]
    .find(x=>x.getAttribute("data-f")===e.f && !x.closest("[hidden]"));
  tutoCible=precis||zone;
  tutoVoir = neuf && !!precis;
  if(tutoCible) tutoCible.setAttribute("data-tuto", e.alerte?"alerte":"");
  banniere.toggleAttribute("data-alerte", !!e.alerte);
  banniere.toggleAttribute("data-reduit", tutoReduit);
  $("tutoDit").textContent=e.ditLong||e.dit;
  if(icone) icone.setAttribute("aria-label",
    "Revoir la consigne du tutoriel : "+e.dit);
  if(corps) corps.hidden=tutoReduit;
  if(icone) icone.hidden=!tutoReduit;
  banniere.hidden=false;
}
/* §4.8 — LA BULLE S'ANCRE AU HALO, en surimpression : elle ne décale rien, et
   c'est son PLACEMENT, plus le flux, qui la garde hors de sa propre ancre. Le
   premier côté où elle tient — à droite, au-dessous, au-dessus, à gauche ;
   aucun ne suffit, le plus haut des deux espaces verticaux, bornée à la
   fenêtre. Ce qui PRÉCÈDE l'ancre est ce qu'on vient de lire — la question,
   que la remise porte juste avant ses pièces (§4.6) : la bulle va vers ce qui
   suit. PIÈGE : on mesure le rectangle VISIBLE de la cible, coupé par chaque
   ancêtre qui défile — une zone à moitié défilée n'est pas là où son
   `getBoundingClientRect` la met, et la bulle s'ancrerait dans le vide. Aucune
   suite ne voit cette géométrie (jsdom rend des rectangles nuls) : `npm run
   vue` seul la montre. */
const TUTO_ECART=12, TUTO_MARGE=16;
function rectVisible(el, ouNul){
  const r=el.getBoundingClientRect();
  let h=r.top, b=r.bottom, g=r.left, d=r.right;
  for(let p=el.parentElement; p && p!==document.body; p=p.parentElement){
    const o=getComputedStyle(p);
    if(!/(auto|scroll|hidden|clip)/.test(o.overflowX+" "+o.overflowY)) continue;
    const q=p.getBoundingClientRect();
    h=Math.max(h,q.top); b=Math.min(b,q.bottom); g=Math.max(g,q.left); d=Math.min(d,q.right);
  }
  h=Math.max(h,0); b=Math.min(b,innerHeight); g=Math.max(g,0); d=Math.min(d,innerWidth);
  return b>h && d>g ? {top:h,bottom:b,left:g,right:d} : (ouNul ? null : r);
}
/* §4.8 — ELLE ÉVITE AUSSI CE QUI PARLE OU AGIT autour de l'ancre : la
   confirmation, la raison d'une phrase pleine, les aides, la phrase en cours,
   les boutons et les croix. PIÈGE PAYÉ (retour de playtest, Jean) : posée au premier côté qui
   TENAIT, elle cachait « ✓ Retenu » ou « ← retirer / tout effacer ». Chaque côté
   essaie donc trois alignements ; la première position qui ne couvre rien
   gagne, sinon celle qui couvre le moins — l'ancre comptant pour beaucoup plus. */
// Les BOUTONS de la barre du composeur, pas la barre : son milieu est vide, et
// c'est la meilleure place pour une bulle qui montre « → Envoyer ».
const TUTO_EVITE = ".rappel, .raison, .aide, .phrase, .compo .barre button, .ptete button, .col > h2 .fermer, .ztitle .surfaces";
function placerTuto(){
  const bulle=$("tuto");
  if(!bulle || bulle.hidden) return;
  const L=innerWidth, H=innerHeight, w=bulle.offsetWidth, h=bulle.offsetHeight;
  const E=TUTO_ECART, M=TUTO_MARGE;
  const borne=(v,min,max)=>Math.max(min,Math.min(v,max));
  if(!tutoCible || !document.contains(tutoCible)){   // rien à montrer : en tête, au milieu
    bulle.removeAttribute("data-cote");
    bulle.style.left=Math.round((L-w)/2)+"px"; bulle.style.top=M+"px";
    return;
  }
  const r=rectVisible(tutoCible), cx=(r.left+r.right)/2, cy=(r.top+r.bottom)/2;
  const evites=[...document.querySelectorAll(TUTO_EVITE)]
    .filter(el=>el.offsetParent && !tutoCible.contains(el) && !bulle.contains(el))
    .map(el=>rectVisible(el,true)).filter(Boolean);   // défilé hors champ : rien à cacher
  const recouvre=(x,y,q)=>Math.max(0,Math.min(x+w,q.right)-Math.max(x,q.left))
                        * Math.max(0,Math.min(y+h,q.bottom)-Math.max(y,q.top));
  const cout=(x,y)=>10*recouvre(x,y,r) + evites.reduce((t,q)=>t+recouvre(x,y,q),0);
  /* Sur le côté, elle DESCEND d'abord depuis la zone, la flèche en haut : la
     question est au-dessus du bouton de pièces, une bulle qui montait la
     recouvrait. Les autres alignements ne viennent qu'ensuite. */
  const essais=[
    ["droite",  L-r.right-E-M>=w, [[r.right+E, cy-26], [r.right+E, r.top], [r.right+E, r.bottom-h]]],
    ["dessous", H-r.bottom-E-M>=h, [[r.left, r.bottom+E], [cx-w/2, r.bottom+E], [r.right-w, r.bottom+E]]],
    ["dessus",  r.top-E-M>=h,      [[r.left, r.top-E-h], [cx-w/2, r.top-E-h], [r.right-w, r.top-E-h]]],
    ["gauche",  r.left-E-M>=w,     [[r.left-E-w, cy-26], [r.left-E-w, r.top], [r.left-E-w, r.bottom-h]]]];
  let tient=essais.filter(c=>c[1]);
  if(!tient.length) tient=[r.top>H-r.bottom ? essais[2] : essais[1]];
  let mieux=null;
  essai: for(const [cote,,positions] of tient) for(const [px,py] of positions){
    const x=borne(px, M, Math.max(M, L-w-M)), y=borne(py, M, Math.max(M, H-h-M)), c=cout(x,y);
    if(!mieux || c<mieux.c) mieux={cote,x,y,c};
    if(c===0) break essai;
  }
  const {cote,x,y}=mieux;
  bulle.style.left=Math.round(x)+"px"; bulle.style.top=Math.round(y)+"px";
  bulle.setAttribute("data-cote", cote);
  bulle.style.setProperty("--fx", Math.round(borne(cx-x, 18, Math.max(18, w-18)))+"px");
  bulle.style.setProperty("--fy", Math.round(borne(cy-y, 18, Math.max(18, h-18)))+"px");
}
/* Même idiome que `voirDernierRetenu` : pur écran, et jsdom n'implémente pas
   `scrollIntoView`, d'où la garde. La barre collante du composeur est réservée
   par son `scroll-padding-bottom`. */
function voirCibleTuto(){
  if(!tutoVoir) return;
  tutoVoir=false;
  if(tutoCible && document.contains(tutoCible) && tutoCible.scrollIntoView)
    tutoCible.scrollIntoView({block:"nearest"});
}
/* Les bandes défilent, pas la page : un `scroll` ne remonte pas, d'où la
   CAPTURE. Une image par rafale suffit. */
let tutoImage=0;
function replacerTuto(){
  if(tutoImage) return;
  tutoImage=requestAnimationFrame(()=>{ tutoImage=0; placerTuto(); });
}
addEventListener("resize", replacerTuto);
document.addEventListener("scroll", replacerTuto, true);
/* Le geste rouvre la forme développée — même idiome que `ouvrirPiece`/
   `oublier` : poser `focusVoulu` AVANT `rendreTout`, jamais un `.focus()`
   manuel après coup. */
function tutoAgrandir(){
  tutoReouvre=true;
  focusVoulu={ cle:"#tutoPasser", zone:null };
  rendreTout();
}

/* 4) RENDU COMMUN */
const modalRoot = $("modalRoot");
/* `modal()`/`closeModal()` ne servent plus que l'ÉCRAN DE FIN (`finir`) : la
   pièce ouverte a rejoint la place LATÉRALE (§4.6, §4.10 règle 3) et ne passe
   plus par ici. Un écran terminal reste légitimement une vraie boîte de
   dialogue, `inert` compris — il n'y a plus de partie à continuer derrière. */
let ouvreur=null;
function closeModal(){
  modalRoot.innerHTML="";
  const w=document.querySelector(".wrap"); if(w) w.removeAttribute("inert");
  focusVoulu=ouvreur; ouvreur=null;
  rendreTout();
}
function modal(html, classe){
  modalRoot.innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">
       <div class="modal ${classe||""}" role="dialog" aria-modal="true" aria-labelledby="modalTitre">${html}
         <button class="close" onclick="closeModal()" aria-label="Fermer (Échap)" aria-keyshortcuts="Escape"><span class="x" aria-hidden="true">×</span></button>
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
const ZONES_FOCUS = "#zoneRetenus, #zoneDossier, #panPiece, #plaidoirie, #composeur, #discussion, .cloture";
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
  /* PIÈGE PAYÉ : un repli dans une zone déjà visible (ex. `opposer`, qui efface
     toujours son propre bouton) faisait défiler la page vers le premier
     focalisable trouvé — alors que la zone était déjà sous les yeux. */
  el = premierFocalisable(m.zone && document.querySelector(m.zone));
  if(!focalisable(el)) el = premierFocalisable($("composeur"));
  if(el) el.focus({preventScroll:true});
}

/* §4.10 règle 4 — CE QUI ARRIVE S'ANNONCE, par une voix unique : `#annonce`,
   hors de `.wrap` (une région inerte se tait). PIÈGE : jamais `role="log"` sur
   la DISCUSSION — elle se réécrit à chaque geste, et un lecteur d'écran la
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
  S.fil.forEach((m,i)=>{ if(i<vusFil || m.ia) return;
    const n=(m.pieces||[]).length;
    annoncer(`${m.qui} : ${texteBrut(m.texte)}${m.question ? " "+texteBrut(m.question) : ""}${n ? ` (${comptePieces(m.pieces, recuAvant(i))} dans ton CONTEXTE)` : ""}`);
  });
  vusFil=S.fil.length;
  if(S.refus && S.refus!==dernierRefus) annoncer(S.refus);
  dernierRefus=S.refus||null;
  if(tutoAnnonce){ annoncer(tutoAnnonce); tutoAnnonce=null; }
}

function rendreTout(){
  const force=!!focusVoulu, m=focusVoulu || memoFocus(); focusVoulu=null;
  const enBas=filEnBas();
  suivrePhrase();
  renderDISCUSSION(); renderComposeur(); renderCONTEXTE(); renderPLAIDOIRIE(); majCloture(); majLateral(); majTutoriel();
  recalerFil(enBas); majDebord();
  rendreFocus(m, force);
  voirCibleTuto();                 // APRÈS le focus, qui ne défile pas (`preventScroll`)
  placerTuto();                    // APRÈS le recalage du fil, le focus et `voirCibleTuto` : ils déplacent l'ancre
  rappelRetrait=null; vientDeRetenir=null; rappelPleine=false;
  annoncerNouveautes(); publierAnnonces();
  sauverPartie();
}

/* ---- Le canal : un fil de messages ---- */
/* LE BOUTON SÉPARE COMME L'INDEX (§4.6) : les pièces et les règles à part, comme
   les deux colonnes de `renderDossier` — « 5 pièces » au message et « 5 pièces,
   3 règles » à l'index, c'était le même chiffre pour deux sens. Dès le deuxième
   envoi, il dit « nouvelles » : le message compte ce qu'il apporte. L'index, lui,
   ne compte plus — son en-tête ne dit que DOSSIER. */
const compte=(n,mot)=>n+" "+mot+(n>1?"s":"");
function comptePieces(pids, nouvelles){
  const nP=pids.filter(pid=>!R.estRegle(JEU.pieces[pid])).length, nR=pids.length-nP;
  const dit=(n,mot)=>compte(n,(nouvelles?(n>1?"nouvelles ":"nouvelle "):"")+mot);
  return [nP && dit(nP,"pièce"), nR && dit(nR,"règle")].filter(Boolean).join(" et ");
}
const recuAvant=i=>S.fil.slice(0,i).some(m=>(m.pieces||[]).length);
function renderDISCUSSION(){
  let h="", dernier=null;
  for(const [i,m] of S.fil.entries()){
    // PIÈGE : l'avocat vient du contenu, déjà écrit pour l'écran ; la phrase
    // composée de l'IA, elle, s'échappe.
    const meme = m.qui===dernier; dernier=m.qui;
    h+=`<div class="msg ${m.ia?'ia':''} ${meme?'suite':''}">${
      meme?"":`<div class="who">${escapeAttr(m.qui)}</div>`}<div class="bubble">${m.ia?escapeAttr(m.texte):m.texte}${
      m.question?`<div class="qremise">${m.question}</div>`:""}<div>`;
    // Le message ne nomme plus les pièces une à une (§4.6) : un seul bouton,
    // vers le CONTEXTE, où chacune se nomme et se lit comme avant — et il vient
    // APRÈS la question que la remise porte : on lit, puis on va chercher.
    if(m.pieces.length){
      const dit=comptePieces(m.pieces, recuAvant(i))+" dans ton CONTEXTE";
      h+=`<button type="button" class="attach" data-f="a:${m.pieces[0]}" onclick="voirPiecesRecues()"
            aria-label="${dit}"><span aria-hidden="true">📎</span> ${dit}</button>`;
    }
    h+=`</div></div></div>`;
  }
  if(S.clotureDemandee && S.repetitionIdx>-1 && S.repetitionIdx<JEU.repetition.affirmations.length){

    const dispo=S.brouillon.map((n,i)=>({n,i})).filter(x=>R.estMoyen(x.n.lien));
    const cibleDe=i=>{ const e=S.plaidoirie.find(x=>x.b===i); return e && e.contre!=null ? e.contre : null; };
    /* §4.6 — LE CADRE PORTE SON AFFIRMATION : la réplique de l'avocat s'intercale
       dans le fil au premier geste, et l'affirmation sortait du cadre (Colas).
       Et DÉPLACER SE DIT : une phrase opposée ailleurs offrait le même
       « opposer », qui la déplaçait en silence. */
    const enCours=JEU.repetition.affirmations[S.repetitionIdx];
    h+=`<div class="repet"><div class="rtitle">Opposer une phrase à cette affirmation ?</div>
      <blockquote class="raff">${enCours.texte}</blockquote>${
      dispo.length ? dispo.map(x=>{
        const c=cibleDe(x.i), aff=c!=null && JEU.repetition.affirmations[c];
        return `<div class="rnote"><span class="txt">${escapeAttr(x.n.texte)}</span>
         ${c===S.repetitionIdx
            ? `<span class="sent">opposé à celle-ci</span>`
            : `${aff?`<span class="sent">opposé à : ${escapeAttr(aff.court)}</span>`:""}<button class="up" data-f="r:${x.i}" onclick="verserContre(${x.i})">${
                aff?"déplacer ici":"opposer"}</button>`}</div>`;
      }).join("")
      : `<div class="rnote vide">tu n'as écrit aucune phrase à y opposer</div>`
    /* Le bouton d'avance dit ce qu'on FAIT : « ne rien opposer » juste après avoir
       opposé disait le contraire du geste (retour de playtest, §3 PASSATION). La
       clé `rsuite` reste la même — le focus le retrouve quel que soit son nom. */
    }<button class="btn" data-f="rsuite" onclick="avancerRepetition()">${
      dispo.some(x=>cibleDe(x.i)===S.repetitionIdx) ? "Continuer" : "Ne rien opposer — continuer"}</button></div>`;
  }
  $("discussion").innerHTML=h;
}
/* Le fil se recale en bas s'il y ÉTAIT — nouveau message, panneau ouvert, phrase
   qui s'allonge : la question reste sous les yeux. Remonté pour relire (ou pour
   suivre le focus), il n'est plus arraché vers le bas à chaque geste. PIÈGE :
   le recalage vient APRÈS `majLateral` — c'est lui qui change la hauteur. */
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
/* §4.6 — LA PIÈCE S'OUVRE DANS LE CONTEXTE, entre l'index et les retenus : on
   lit, on retient, on prend, sans rien fermer. L'ouvrir ouvre donc le CONTEXTE —
   en CONSULTATION, comme la barre : il ne se referme pas tout seul. Une autre
   pièce déjà ouverte en part d'abord, et sa réplique `declenche` avec elle. */
function ouvrirPiece(pid){
  ouvreur = memoFocus();
  if(S.modalPiece && S.modalPiece!==pid) R.fermerPiece(S);
  R.ouvrirPiece(S,pid);
  panneau="contexte"; panneauSuit=false; dossierDeplie=false;
  focusVoulu = { cle:"#pieceTitre", zone:"#panPiece" };
  rendreTout();
}
/* La replier rend sa hauteur aux retenus ; le CONTEXTE, lui, reste. */
function fermerPiece(){
  R.fermerPiece(S);
  focusVoulu = ouvreur; ouvreur = null;
  rendreTout();
}
/* PIÈGE : UNE PIÈCE N'EST JAMAIS OUVERTE HORS DU CONTEXTE (§4.6). Toutes les
   portes qui le referment — sa croix, la barre, l'envoi, la PLAIDOIRIE, la
   fermeture qui suit la phrase — passent par ici, en TÊTE de `rendreTout` :
   la réplique `declenche` (`R.fermerPiece`) tombe ainsi dans le fil AVANT qu'il
   soit dessiné, au moment où l'on relève les yeux (§4.10 règle 3). */
function suivrePhrase(){
  if(panneau==="contexte" && panneauSuit && R.indexTermeChamp(S) < 0){ panneau=null; panneauSuit=false; }
  if(S.modalPiece && panneau!=="contexte") R.fermerPiece(S);
}
/* CHANGER DE PIÈCE COÛTE UN CLIC (§4.6, retour de Jean) : l'index replié, il en
   fallait deux — déplier, choisir. ‹ et › mènent à la précédente et à la
   suivante DANS L'ORDRE DE L'INDEX, les pièces puis les règles, en boucle ; et
   l'index reste comme il était — la place de lecture ne se reperd pas. */
function ordreIndex(){
  const livres=R.piecesLivrees(S), regle=pid=>R.estRegle(JEU.pieces[pid]);
  return [...livres.filter(pid=>!regle(pid)), ...livres.filter(regle)];
}
function pieceVoisine(pas){
  const l=ordreIndex(), i=l.indexOf(S.modalPiece);
  return l.length>1 && i>=0 ? l[(i+pas+l.length)%l.length] : null;
}
/* La pièce quittée part comme sous un autre chip, réplique `declenche` comprise.
   Le focus reste sur la flèche, pour enchaîner ; `ouvreur` ne bouge pas : la
   croix le rendra au chip qui a ouvert la première. */
function voisine(pas){
  const pid=pieceVoisine(pas); if(!pid) return;
  R.fermerPiece(S); R.ouvrirPiece(S,pid);
  focusVoulu={ cle: pas<0?"prec":"suiv", zone:"#panPiece" };
  rendreTout();
}
function pieceHTML(){
  const pid=S.modalPiece, p=pid && JEU.pieces[pid];
  if(!p) return "";
  /* Le titre et la croix ne défilent pas avec le texte ; la bande `#piece`, si.
     Le nom de la pièce est celui de l'index (§4.6 « une pièce porte un seul nom ») —
     les flèches le disent aussi, à qui ne les voit pas. */
  const fleche=(pas,cle,signe,sens)=>{ const v=pieceVoisine(pas); return v
    ? `<button class="voisine" data-f="${cle}" onclick="voisine(${pas})" aria-label="${sens} : ${escapeAttr(JEU.pieces[v].titre)}"><span aria-hidden="true">${signe}</span></button>` : ""; };
  return `<div class="bande piece ${R.estRegle(p)?"regle":""}" id="panPiece" role="region" aria-labelledby="pieceTitre">
    <div class="ptete"><h3 id="pieceTitre" tabindex="-1">${escapeAttr(p.titre)}</h3>${
      fleche(-1,"prec","‹","Pièce précédente")}${fleche(1,"suiv","›","Pièce suivante")}<button class="fermer" data-f="replier" onclick="fermerPiece()" aria-label="Replier la pièce (Échap)" aria-keyshortcuts="Escape"><span class="x" aria-hidden="true">×</span><kbd>Échap</kbd></button></div>
    <div class="defile" id="piece">${piecePanelHTML(pid)}</div></div>`;
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
  /* §4.6 — L'INDEX SE REPLIE en une ligne, et laisse la place au reste (retours
     de Jean et de l'auteur) : déplié, il mangeait la moitié du panneau, et la
     pièce n'y montrait plus que deux lignes. Les puces restent sous `hidden` —
     le motif « disclosure » —, et `#zoneDossier` reste l'ancre du tutoriel (R6). */
  const plie=indexPlie();
  return `<div class="zone ${plie?"plie":""}" id="zoneDossier">
    <button type="button" class="dplier" data-f="dossier" aria-expanded="${!plie}" aria-controls="dossierListe"
      onclick="basculerDossier()"><span class="dtitre">DOSSIER</span><span class="dsens">${
        plie?"▾ déplier":"▴ replier"}</span></button>
    <div class="dossier" id="dossierListe" ${plie?"hidden":""}>${
      colonne("Les pièces",pieces)}${colonne("Les règles",regles)}</div></div>`;
}
/* Deux états d'ÉCRAN, comme `panneau` : jamais sauvés. `dossierPlie` est le
   choix du joueur sans pièce ouverte ; `dossierDeplie`, celui qu'il fait le
   temps d'une pièce — `ouvrirPiece` le remet à faux : chaque pièce ouverte
   replie l'index qu'on a déplié pour la choisir, et la pièce repliée, il
   revient au choix d'avant. */
let dossierPlie=false, dossierDeplie=false;
const indexPlie=()=>S.modalPiece ? !dossierDeplie : dossierPlie;
function basculerDossier(){
  if(S.modalPiece) dossierDeplie=!dossierDeplie; else dossierPlie=!dossierPlie;
  focusVoulu={ cle:"dossier", zone:"#zoneDossier" };
  rendreTout();
}

/* 5) LE CONTEXTE — privé, gratuit, illimité, et CLAVIER du composeur (§4.6).
      Surligner ne produit RIEN : c'est voulu. */
/* La pièce n'ajoute que — jamais n'oublie (§4.3). Mais recliquer un passage déjà
   retenu ne passe plus sous silence : l'écran dit où l'on retire. Et retenir se
   voit au moment même (§4.3) : `vientDeRetenir` allume la même ligne et le compte
   de la porte CONTEXTE. Tous deux vivent le temps d'un rendu. */
let rappelRetrait=null, vientDeRetenir=null;
const RAPPEL_RETRAIT="Déjà dans ton CONTEXTE — c'est là qu'on l'oublie.";
const ECHO_RETENU="✓ Retenu dans ton CONTEXTE.";
function surligner(pid,eid){
  const k=pid+"."+eid;
  rappelRetrait = S.retenus.includes(k) ? k : null;
  vientDeRetenir = rappelRetrait ? null : k;
  // Retenu depuis une pièce d'une remise close : sa remise se déplie, sans quoi
  // la fiche neuve naîtrait cachée — retenir se voit (§4.3, §4.6).
  if(vientDeRetenir && remiseClose(remiseDePiece(pid))) remisesDepliees.add(remiseDePiece(pid));
  R.surligner(S,pid,eid);
  annoncer(rappelRetrait ? RAPPEL_RETRAIT : "Retenu dans ton CONTEXTE.");
  const neuf=!!vientDeRetenir;
  rendreTout();
  if(neuf && S.modalPiece) voirDernierRetenu();    // la fiche neuve, dans le champ
}
/* PIÈGE PAYÉ : la fiche retirée, le focus retombait sur la CROIX DE LA
   SUIVANTE — un second Entrée en supprimait une autre. Il se pose donc sur la
   zone, qui n'arme rien ; `#zoneRetenus` porte `tabindex="-1"` pour l'accueillir,
   et `rendreFocus` sait viser un id (§4.10 règle 2). */
function oublier(pid,eid){
  R.oublier(S,pid,eid);            // le CONTEXTE seul peut retirer
  focusVoulu={ cle:"#zoneRetenus", zone:"#zoneRetenus" };
  rendreTout();
}
/* §4.3 — PLUS DE LÉGENDE : l'auteur l'a retirée, le code s'apprend en cherchant
   — au survol du passage, et dans les groupes du CONTEXTE. */
/* §4.11 — `porte` SE MARQUE, IL NE S'ÉTIQUETTE PLUS : « Ce texte porte sur :
   quand » faisait le tri dans la tête du joueur. Le texte de l'article est
   encadré de la couleur ET du trait de chaque dimension qu'il régit — le code
   des passages (§4.3), rien par la couleur seule (§4.10 règle 5). Deux
   dimensions, deux cadres l'un dans l'autre. À qui ne voit pas, leurs noms. Le
   moteur ne lit toujours pas `porte` (§4.5). PIÈGE : une bordure CSS ne sait
   pas onduler — l'ondulé passe par une image de bordure (`.cadre.ondule`). */
function cadresPorte(pid, interieur){
  const d=R.porteDe(pid).filter(x=>couleurDim(x));
  if(!d.length) return interieur;
  return d.reduceRight((dedans,x)=>{
    const t=traitDim(x);
    return `<div class="cadre ${t==="wavy"?"ondule":""}" style="--dc:${couleurDim(x)};--ds:${t==="wavy"?"solid":t}">${dedans}</div>`;
  }, interieur + `<span class="sr">Porte sur : ${d.map(escapeAttr).join(", ")}.</span>`);
}
function piecePanelHTML(pid){
  const p=JEU.pieces[pid];
  return `<small class="note">${escapeAttr(p.type)} — ${escapeAttr(p.qui||"")}</small>
    ${cadresPorte(pid, `<p class="piecetexte">${rendreTexte(pid)}</p>`)}
    ${rappelRetrait && rappelRetrait.startsWith(pid+".") ? `<p class="rappel">${RAPPEL_RETRAIT}</p>` : ""}
    ${vientDeRetenir && vientDeRetenir.startsWith(pid+".") ? `<p class="rappel retenu">${ECHO_RETENU}</p>` : ""}`;
}
/* PIÈGE : `#zoneRetenus` est l'ancre des temps 3 et 5 du tutoriel (R6), à ne
   jamais viser par `:last-child`. Et depuis qu'elle vit dans un PANNEAU, elle
   peut être cachée : le tutoriel vise alors `#btnCONTEXTE`, la porte. Les deux
   sélecteurs restent des LITTÉRAUX — R6 ne scanne pas un sélecteur calculé, et
   ne dirait rien le jour où l'un des deux cesserait d'exister. */
/* §4.6 — LE CONTEXTE DIT L'ÉTAT DE LA PHRASE (retour de Jean). Un passage déjà
   pris porte « dans ta phrase » ; et quand la phrase n'en prend plus, une ligne le
   dit. PIÈGE PAYÉ : la raison vivait dans le `title` d'un bouton `disabled` — ni
   le toucher ni le clavier ne l'atteignaient, et le bouton ne se laissait même
   plus atteindre (§4.10 règle 5). Les fiches restent donc atteignables
   (`aria-disabled`), et les toucher redit la raison. */
const RAISON_PLEINE="Ta phrase ne prend plus de passage : « ← retirer » pour revenir en arrière.";
let rappelPleine=false;
function passageRefuse(cle){
  rappelPleine=true; annoncer(RAISON_PLEINE);
  focusVoulu={ cle, zone:"#zoneRetenus" };
  rendreTout();
}
/* §4.6 — LES PASSAGES D'UNE REMISE CLOSE SE RANGENT, repliés sous ceux de la
   remise en cours. Ce n'est pas juger : c'est un fait de remise, et rien n'est
   retiré. Une remise est close quand la suivante est arrivée. `remisesDepliees`
   est un état d'ÉCRAN, comme `dossierPlie` : jamais sauvé. */
const remiseDePiece = pid => (JEU.remises||[]).findIndex(r=>(r.pieces||[]).includes(pid));
const remiseClose = r => r>=0 && r < S.remisesEnvoyees-1;
const remisesDepliees=new Set();
function basculerRemise(r){
  if(remisesDepliees.has(r)) remisesDepliees.delete(r); else remisesDepliees.add(r);
  focusVoulu={ cle:"s:"+r, zone:"#zoneRetenus" };
  rendreTout();
}
const ordinal = n => n===1 ? "1ʳᵉ" : n+"ᵉ";
function renderRetenus(){
  const iT=R.indexTermeChamp(S);
  /* §4.11 — l'assombrissement annonçait le refus d'écran : il vit avec lui, en
     session 1 seulement. Ensuite, le premier passage posé garde sa couleur au
     composeur, et c'est le seul rappel. */
  const dimReq=R.enCalibration(S) ? R.dimAttendue(S) : null;   // `null` : rien à assombrir
  const pleine = iT<0 && S.compo.length>0;
  const dansPhrase=new Set(S.compo.map(p=>p.valeur).filter(v=>typeof v==="string"));
  const fiche=(k,j,d,hors)=>{
    const e=EMPAN[k], pris=dansPhrase.has(k);
    return `<div class="mchip${k===vientDeRetenir?" neuf":""}${pris?" pris":""}" style="--dc:${couleurDim(d)}">
              <button class="corps" data-f="c:${k}" ${iT<0
                ? `aria-disabled="true" ${pleine?'aria-describedby="raisonPleine"':""} onclick="passageRefuse('c:${k}')"`
                : `onclick="poserBloc(${iT},${j})"`}${
                hors?` title="(comparerait sans rien construire : dimension différente)"`:""}>
                <span class="nom">${escapeAttr(e.nom||e.texte)}${pris?`<span class="dansPhrase">dans ta phrase</span>`:""}</span>
                <span class="prov"><span class="cit">« ${escapeAttr(e.texte)} »</span><span class="sig">— ${escapeAttr(e.qui)}, ${escapeAttr(JEU.pieces[e.pid].court)}</span></span>
              </button>
              <button class="del" data-f="x:${k}" onclick="oublier('${e.pid}','${e.eid}')"
                      aria-label="Oublier « ${escapeAttr(e.nom||e.texte)} »">oublier</button>
            </div>`;
  };
  const parDimension=items=>{
    let h="";
    for(const d of JEU.dimensions||[]){
      const ks=items.filter(x=>EMPAN[x.k].dim===d);
      if(!ks.length) continue;
      const hors=dimReq && d!==dimReq;
      h+=`<div class="dimgrp ${hors?"horsdim":""}" style="--dc:${couleurDim(d)}"><div class="dnom">${escapeAttr(d)}</div>${
        ks.map(({k,j})=>fiche(k,j,d,hors)).join("")}</div>`;
    }
    return h;
  };
  let h=`<div class="zone" id="zoneRetenus" tabindex="-1">`;
  if(!S.retenus.length){
    h+=`<div class="aide">Ouvre une pièce, puis clique un passage encadré pour le retenir : il viendra ici.</div>`;
  } else {
    if(pleine) h+=`<p class="raison${rappelPleine?" rappelle":""}" id="raisonPleine">${RAISON_PLEINE}</p>`;
    const items=S.retenus.map((k,j)=>({k,j})).filter(x=>EMPAN[x.k]);
    const closes=new Map();
    const courants=items.filter(x=>{
      const r=remiseDePiece(EMPAN[x.k].pid);
      if(!remiseClose(r)) return true;
      if(!closes.has(r)) closes.set(r,[]);
      closes.get(r).push(x); return false;
    });
    h+=parDimension(courants);
    for(const r of [...closes.keys()].sort((a,b)=>a-b)){
      const ouvert=remisesDepliees.has(r), n=closes.get(r).length;
      h+=`<div class="remiseClose"><button type="button" class="dplier" data-f="s:${r}" aria-expanded="${ouvert}"
            aria-controls="remise${r}" onclick="basculerRemise(${r})"><span class="dtitre">${ordinal(r+1)} remise, close</span><span class="dcompte">${
            compte(n,"passage")}</span><span class="dsens">${ouvert?"▴ replier":"▾ déplier"}</span></button>
          <div id="remise${r}" ${ouvert?"":"hidden"}>${parDimension(closes.get(r))}</div></div>`;
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
  /* DEUX VERBES, UN PAR GESTE (§4.6) : on RETIENT un passage — de la pièce vers
     le CONTEXTE — et on le PREND — du CONTEXTE vers la phrase. « Sélectionner »
     servait aux deux, et un joueur a lu trois verbes pour deux gestes. */
  if(!S.compo.length){
    // §4.6 — pendant la répétition on n'écrit plus, on oppose : la voix se tait,
    // et ne reparle que si le joueur recommence une phrase.
    if(R.repetitionEnCours(S)) return "";
    if(!S.retenus.length) return "Ouvre une pièce et retiens un passage.";
    return second ? "Prends un ou plusieurs passages de ton contexte." : "Prends un passage de ton contexte pour répondre.";
  }
  if(offerts.some(b=>b.cite) || R.compoFinie(S)) return "";
  if(offerts.some(b=>b.type==="terme"&&b.source!=="note"))
    return "Prends un second passage pour le mettre en relation.";
  return offerts.length
    ? "Sur quel article t'appuies-tu pour montrer qu'il y a une irrégularité ?"
    // §4.5 — un texte s'invoque une fois LU : la voix dit où aller le lire,
    // sans quoi le joueur bloque sans savoir pourquoi.
    : "Aucun texte que tu as lu ne fonde ça. Les articles sont dans ton dossier — ouvre-les.";
}
/* §4.9 règle 1 — LA VOIX DEVIENT UN BOUTON quand le geste qu'elle nomme a lieu
   dans l'AUTRE colonne. Le prédicat est `indexTermeChamp`, le MÊME qui active
   les puces du CONTEXTE (`renderRetenus`) : une seule vérité pour les deux
   surfaces. Sinon elle reste du texte — l'article et l'envoi se cliquent ici.
   Quand la voix se tait — un passage posé, la phrase se tient — il n'y a ni
   bouton ni rien à dire : le CONTEXTE reste ouvert et les puces suffisent. */
function rendreVoix(txt, classe){
  if(!txt) return "";
  // Cliquable, elle a l'air d'un bouton — jamais d'un champ vide (§4.9 règle 1) :
  // la flèche montre où le panneau s'ouvre, au-dessus.
  return R.indexTermeChamp(S) >= 0
    ? `<button class="${classe} versCONTEXTE" data-f="voix" onclick="ouvrirCONTEXTE()">${escapeAttr(txt)}<span class="fl" aria-hidden="true">↑</span></button>`
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
/* La phrase PARTIE (§4.6) : le CONTEXTE reste tant que la REMISE ne change pas —
   la question suivante, ou la même après un refus, voudra le clavier. Il reste
   en consultation, quelle que soit la porte qui l'avait ouvert. Une remise
   neuve le referme : un dossier arrive, on revient lire l'avocat. La PLAIDOIRIE
   se referme toujours — on n'y écrit pas. */
function envoyerCompo(){
  const remise=S.remisesEnvoyees;
  R.envoyerCompo(S);
  if(panneau!=="contexte" || S.remisesEnvoyees!==remise) panneau=null;
  panneauSuit=false; rendreTout();
}
function rappelQuestion(){
  const a=R.attenteCourante(S,R.remiseCourante(S));
  if(!a || !a.question) return "";
  const dernier=S.fil[S.fil.length-1];
  /* §4.9 règle 3 : ce qui reste LISIBLE ne se répète pas — et LISIBLE est la
     condition, pas PRÉSENT. EN DESSOUS DU SEUIL de `.wrap.avecLateral` (§4.6),
     un panneau ou une pièce ouverte fait céder la conversation EN HAUTEUR, qui
     peut y perdre la question. PIÈGE PAYÉ : un joueur a composé sa réponse
     sans la voir. Panneau OU pièce ouverts, la question redescend donc ici ;
     les deux fermés, elle se tait. Au-dessus du seuil, la conversation cède en
     LARGEUR seulement et garde la question — la règle mord alors par surcroît,
     pas par nécessité. */
  /* Le dernier mot est la question qu'un message de remise PORTE, ou le texte
     d'un message qui n'est qu'elle (§4.6). */
  if(!panneau && !S.modalPiece && dernier && (dernier.question||dernier.texte)===a.question) return "";
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
    <button id="btnCONTEXTE" class="${etat("contexte")}${vientDeRetenir?" recoit":""}"
      onclick="basculerPanneau('contexte')">CONTEXTE${compte(S.retenus.length)}</button>
    <button id="btnPLAIDOIRIE" class="${etat("plaidoirie")}"
      onclick="basculerPanneau('plaidoirie')">PLAIDOIRIE${compte(moyensRetenus().length)}</button>
  </span>`;
}
function renderCompo(){
  const offerts=R.blocsOfferts(S);
  let h=`<div class="zone"><div class="ztitle">RÉPONSE${barreSurfaces()}</div><div class="compo">
    ${rappelQuestion()}
    <div class="phrase">${texteCompoPartiel()}</div>`;
  h+=`<div class="offre">`;
  const implicite=R.clotureImplicite(S);
  offerts.forEach((b,i)=>{
    if(implicite && b.id===implicite.id) return;
    if(b.type==="liaison"){
      // PIÈGE : `fondement` est propre à `.bbloc` ; `.msg.suite` est le même
      // mot pour un sens sans rapport.
      // §4.5 — PAS de `porte sur` ICI : sous le bouton qui l'invoque, l'étiquette
      // faisait le tri à la place du joueur (« deux fiches QUI → seul l'art. 7
      // colle »). Elle se lit maintenant DANS l'article, à la lecture.
      h+=`<button class="bbloc ${b.imbrique?"fondement":""}" data-f="b:${escapeAttr(b.id)}" onclick="poserBloc(${i})">${escapeAttr(b.libelle||b.texte)}</button>`;
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

/* 7) LES SURFACES — l'avocat ne voit QUE la PLAIDOIRIE, et n'y inscrit que les
      MOYENS (§4.6). */
/* PIÈGE : réécrire `innerHTML` remet le défilement à ZÉRO. Un panneau redessiné
   à chaque geste repartait donc en haut entre le premier passage et le second —
   celui qu'on venait de retenir disparaissait sous le pli au moment même où le
   tutoriel le réclamait. Et depuis que la pièce vit DANS le CONTEXTE (§4.6),
   le panneau porte jusqu'à deux bandes défilantes de plus, réécrites avec lui :
   chaque `.defile[id]` garde aussi son défilement, retrouvé par son id. */
function garderDefilement(id, dessiner){
  const el=$(id); if(!el) return;
  const haut=el.scrollTop;
  const internes=[...el.querySelectorAll(".defile[id]")].map(b=>[b.id,b.scrollTop]);
  el.innerHTML = dessiner();
  el.scrollTop = haut;
  for(const [i,t] of internes){ const b=$(i); if(b) b.scrollTop=t; }
}
/* Pièce ouverte, le CONTEXTE se lit de haut en bas — l'index (on choisit), la
   pièce (on lit, on retient), les retenus (on prend) — et cesse de défiler d'un
   bloc : la pièce et les retenus défilent chacun pour son compte, pour qu'une
   longue pièce ne pousse jamais les retenus hors du panneau (§4.6). */
let pieceDessinee=null;
function renderCONTEXTE(){
  const piece=!!S.modalPiece;
  const el=$("contexte"); if(el) el.classList.toggle("avecPiece", piece);
  { const p=$("panCONTEXTE"); if(p) p.classList.toggle("avecPiece", piece); }
  // Échap ne se lit que là où il agit (§4.10 règle 6) : pièce ouverte, sur elle seule.
  { const f=document.querySelector("#panCONTEXTE > h2 .fermer");
    if(f){ f.setAttribute("aria-label", piece ? "Fermer le CONTEXTE" : "Fermer le CONTEXTE (Échap)");
           if(piece) f.removeAttribute("aria-keyshortcuts"); else f.setAttribute("aria-keyshortcuts","Escape"); } }
  garderDefilement("contexte", () => piece
    ? renderDossier() + pieceHTML() + `<div class="bande retenus"><div class="defile" id="defileRetenus">${renderRetenus()}</div></div>`
    : renderDossier() + renderRetenus());
  // Une AUTRE pièce s'ouvre en haut de son texte, pas au défilement de la précédente.
  if(S.modalPiece!==pieceDessinee){ const b=$("piece"); if(b) b.scrollTop=0; pieceDessinee=S.modalPiece; }
}
function renderComposeur(){
  $("composeur").innerHTML = renderCompo();
}
function moyensRetenus(){
  return S.plaidoirie.filter(x=>S.brouillon[x.b] && R.estMoyen(S.brouillon[x.b].lien));
}
function renderPLAIDOIRIE(){ garderDefilement("plaidoirie", plaidoirieHTML); }
function plaidoirieHTML(){
  const gardes=moyensRetenus();
  let h=`<div class="zone">`;
  // Son bouton est là dès le premier écran : le panneau doit donc savoir dire
  // qu'il est vide, et le dire dans la fiction (§4.6).
  // §4.9 règle 4 : elle disait son vide dans la fiction, jamais ce qu'elle EST
  // une fois pleine — deux playtests l'ont relevé (« apparaît sans un mot »).
  h+= gardes.length
    ? `<div class="aide">Ce que Maître Auber garde pour l'audience.</div>`
    : `<div class="aide">Maître Auber n'a encore rien retenu de toi.</div>`;
  h+=`<ul class="liste plaid">${gardes.map(x=>
    `<li><span class="txt">${escapeAttr(S.brouillon[x.b].texte)}${
      x.contre!=null && JEU.repetition.affirmations[x.contre]
        ? `<span class="contre">opposé à : ${escapeAttr(JEU.repetition.affirmations[x.contre].court)}</span>`:""
    }</span></li>`).join("")}</ul>`;
  h+=`</div>`;
  return h;
}
function envoyer(i,contre){ R.envoyer(S,i,contre); rendreTout(); }

/* 8) CLÔTURE, RÉPÉTITION, FINS */
function majCloture(){
  const btn=$("btnCloture"), hint=$("clotureHint");
  if(!btn) return;
  /* §4.9 règle 5 — l'IA ne clôture rien : elle répond, et c'est l'avocat qui
     dépose. Le bouton n'est donc à l'écran que lorsqu'il AGIT — avant la
     question, il annoncerait un pouvoir que personne n'a ; pendant la
     répétition, celle-ci se joue dans le canal. `disabled` double `hidden` :
     le refus reste vrai même pour qui ne voit pas l'écran. */
  const agit = R.instructionComplete(S) && !R.repetitionEnCours(S);
  btn.hidden = hint.hidden = !agit;
  btn.disabled = !agit;
  if(!agit) return;
  if(!S.clotureDemandee){ btn.textContent="Je n'ai rien d'autre";
           hint.textContent="Tu peux encore écrire."; }
  else {   btn.textContent="Je n'ai rien à opposer";
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

/* §4.6 — LA PLACE LATÉRALE a deux occupants possibles — CONTEXTE et PLAIDOIRIE
   — UN SEUL À LA FOIS, et ne recouvre RIEN : la question reste
   sous les yeux, et on voit la phrase se construire en cliquant les passages.
   DEUX variables d'ÉCRAN, hors de `S`, qui est sérialisé — on ne recharge pas
   une partie sur un panneau resté ouvert. `panneau` dit laquelle est ouverte ;
   `panneauSuit` dit qu'elle a été ouverte POUR ÉCRIRE, par la voix du composeur,
   et c'est la seule qui se referme d'elle-même. Ouverte depuis la barre, on la
   consulte : elle reste jusqu'à ce qu'on la ferme.
   PIÈGE : la fermeture automatique suit `indexTermeChamp`, ce que la phrase
   ACCEPTE, et non la voix, qui se tait dès qu'un passage est posé. À cet instant
   la grammaire ne sait pas encore si le joueur cite ou entame une comparaison
   (§4.5) : refermer là retirerait le clavier au milieu du geste le plus difficile
   du jeu.
   LA PIÈCE N'EST PAS UN OCCUPANT : elle s'ouvre DANS le CONTEXTE (`renderCONTEXTE`),
   et `suivrePhrase` la replie dès que le CONTEXTE quitte l'écran. */
let panneau = null, panneauSuit = false;
function majLateral(){
  { const p=$("panCONTEXTE");   if(p) p.hidden = panneau!=="contexte"; }
  { const p=$("panPLAIDOIRIE"); if(p) p.hidden = panneau!=="plaidoirie"; }
  // La conversation, seule bande élastique, cède d'elle-même la place (§4.6) ;
  // la classe ne décide que jusqu'où elle peut céder, et c'est du CSS (§9).
  { const w=document.querySelector(".wrap"); if(w){ w.classList.toggle("avecLateral", !!panneau);
                                                   w.classList.toggle("avecCONTEXTE", panneau==="contexte"); } }
}
/* LE PANNEAU S'OUVRE SUR CE QU'ON VIENT DE RETENIR. À dix-sept fiches, la
   dernière est sous le pli et rien ne le disait : un joueur a cherché son
   passage. Pur écran, aucune règle — et APRÈS `rendreTout`, donc après le
   focus, pour avoir le dernier mot sur le défilement. PIÈGE : la clé contient
   un point, inoffensif dans une valeur d'attribut entre guillemets ; et jsdom
   n'implémente pas `scrollIntoView`, d'où la garde. */
function voirDernierRetenu(){
  const k=S.retenus[S.retenus.length-1]; if(!k) return;
  const el=document.querySelector('[data-f="c:'+k+'"]');
  if(el && el.scrollIntoView) el.scrollIntoView({block:"nearest"});
  majDebord();
}
/* UN PANNEAU QUI DÉBORDE LE DIT. PIÈGE MESURÉ : la barre du système est
   SUPERPOSÉE — elle occupe 0 px et s'efface au repos —, et aucune déclaration
   CSS ne l'a fait reprendre sa place ; un joueur a cherché sa fiche sous le pli
   sans qu'aucun indice existe. L'écran MESURE donc, et ne décide rien pour
   autant : il allume un dégradé. Aucune suite ne le voit — jsdom n'a pas de
   mise en page — et `npm run vue` est le seul juge (§16). */
function majDebord(){
  const reste = b => !!b && (b.scrollHeight - b.scrollTop - b.clientHeight) > 4;
  for(const id of ["panCONTEXTE","panPLAIDOIRIE"]){
    const sec=$(id); if(!sec) continue;
    sec.classList.toggle("deborde", reste(sec.querySelector(".body")));
  }
  // Pièce ouverte, chaque bande du CONTEXTE dit SON débordement — le fondu est
  // posé sur la bande, jamais sur ce qui défile dedans (même PIÈGE qu'en tête).
  for(const b of document.querySelectorAll("#contexte .bande"))
    b.classList.toggle("deborde", reste(b.querySelector(".defile")));
}
function ouvrirCONTEXTE(){ panneau="contexte"; panneauSuit=true; rendreTout(); voirDernierRetenu(); }
/* Le bouton agrégé du message OUVRE le CONTEXTE, il ne le BASCULE pas (§4.6) :
   un second clic, sur un ancien message, ne doit pas refermer un CONTEXTE déjà
   ouvert. Sans `panneauSuit` — on vient CONSULTER, pas écrire — il ne se
   referme pas tout seul à la pose d'un passage. */
function voirPiecesRecues(){
  panneau="contexte"; panneauSuit=false;
  dossierPlie=false; dossierDeplie=true;   // on vient voir ce qu'on a reçu : l'index se déplie (§4.6)
  focusVoulu={ cle:"#titreCONTEXTE", zone:"#panCONTEXTE" };
  rendreTout();
}
function basculerPanneau(nom){
  panneau = panneau===nom ? null : nom; panneauSuit=false; rendreTout();
  if(panneau==="contexte") voirDernierRetenu();
}
function fermerPanneau(){ panneau=null; panneauSuit=false; rendreTout(); }

/* LE CLAVIER (§4.10). Échap referme ce qui est le plus DEVANT : la pièce
   ouverte (repliée, le CONTEXTE reste), la confirmation en attente, le panneau. Entrée et Espace font d'un SPAN qui se déclare bouton — un passage —
   un vrai bouton ; les <button> n'ont besoin de personne. */
function clavier(e){
  if(e.key==="Escape"){
    if(S.modalPiece) fermerPiece();
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
/* `scroll` ne remonte pas : on l'écoute à la CAPTURE, sans quoi le dégradé ne
   s'éteindrait jamais quand on arrive en bas du panneau. */
document.addEventListener("scroll", majDebord, true);
if(!restaurerPartie()) R.envoyerRemise(S);   // la remise 1 arrive d'elle-même
/* Une partie reprise sur une pièce ouverte la retrouve DANS le CONTEXTE (§4.6) —
   sans quoi `suivrePhrase` la refermerait au premier rendu, réplique comprise. */
if(S.modalPiece) panneau="contexte";
rendreTout();

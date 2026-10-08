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
        ? MoteurAPI.creerMoteur(JEU.grammaire, CHAMPS, JEU.liens, JEU.discordances)
        : null;
if(!M){
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="panne">moteur.js n'a pas été chargé. Le fichier doit rester à côté de index.html (voir docs/ARCHITECTURE.md §9).</div>`);
}
const EMPAN = Object.fromEntries(CHAMPS.map(c=>[c.id,c]));
/* Le passage d'un ARTICLE n'est pas un champ (§11, passe F) : sans dimension ni
   valeur, jamais un terme — `CHAMPS` ne le porte pas, le moteur ne le voit pas.
   Il ne se retient pas : il se cherche, et son texte se clique (passe J, §4.6). */
const ARTICLE = Object.fromEntries((MoteurAPI.articlesDe ? MoteurAPI.articlesDe(JEU) : []).map(a=>[a.id,a]));
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
    /* PIÈGE : la signature ne protège pas d'un changement d'état. Une partie
       d'avant la passe K porte `S.retenus` — né `S.memoire` —, qui n'existe
       plus : les articles qu'elle y tenait (avant la passe J) passent au
       dossier, puis le champ tombe. */
    const anciens = Array.isArray(d.retenus) ? d.retenus : Array.isArray(d.memoire) ? d.memoire : [];
    const arts=anciens.filter(k=>ARTICLE[k]);
    if(arts.length) d.trouves=[...new Set([...(d.trouves||[]), ...arts.map(k=>ARTICLE[k].pid)])];
    delete d.retenus; delete d.memoire;
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
/* Les passages que cite le lien attendu, dans son ordre : un pour citer, les
   deux termes de la comparaison pour mettre en relation. */
function tutoTermes(){
  const t=tutoLienAttente(), p=t&&(t.termes||[])[0];
  if(typeof p==="string") return [p];
  return p && typeof p==="object" ? (p.termes||[]).filter(k=>typeof k==="string") : [];
}
function tutoAttenteComparaison(){
  const t=tutoLienAttente(), p=t&&(t.termes||[])[0];
  return !!p && typeof p==="object";
}
/* NI LA RELATION, NI L'ARTICLE NE SE DÉSIGNENT (§4.8, passe J) : le bloc de
   liaison qui emboîte la forme du lien attendu sert à savoir QU'un article est
   attendu, jamais à montrer lequel — la recherche en rend trois. Dérivé du lien,
   jamais d'un nom d'article câblé. */
function tutoArticle(){
  const t=tutoLienAttente();
  return (t && (JEU.grammaire.blocs||[]).find(b=>
    R.estLiaisonArticle(b) && b.forme===t.forme)) || null;
}
/* LA BULLE NE COMPTE PAS (§4.8) : le rang `n` ne sert plus qu'à la clé de
   `tutoVues`. Elle a porté « citer · 2/4 », puis deux séries chacune son total ;
   un rang n'apprenait rien au joueur. */
const GESTE_CITER = {geste:"citer"};
const GESTE_RELIER = {geste:"mettre en relation"};
/* PIÈGE : le chrome N'EST PERSONNE — il nomme le GESTE, jamais la TROUVAILLE
   (§4.8). Dire « les deux passages qui se contredisent », c'est répondre à la
   place du joueur ; l'avocat, lui, a le droit : il sait, il calibre (§3). */
/* La pièce se DÉRIVE du lien attendu, jamais d'un titre câblé : écrit en dur,
   le texte cassait au premier changement d'affaire. */
function pieceDemandee(k){
  const p=k && JEU.pieces[k.slice(0,k.indexOf("."))];
  return p ? p.titre : null;
}
const RATE="Ce n'est pas ce qu'il demande.";
/* UN PASSAGE POSÉ À TORT SE RETIRE D'ABORD (§4.8, passe H). Depuis que le clic
   prend, un passage qui ne répond pas finit DANS la phrase, et le bon, cliqué
   ensuite, deviendrait son second terme — refusé en session 1, ou le début d'une
   comparaison qu'on n'a pas voulue. Le halo va donc à « ← retirer » : le geste
   qui défait, jamais le passage qu'il fallait — rien qu'il ne sût déjà, il
   disait « ce n'est pas ce qu'il demande » d'un passage mis de côté à tort. C'est la
   SEULE alerte depuis la passe K. PIÈGE : il ne lit que les PASSAGES de la phrase ; une relation fausse ne se signale
   jamais, c'est l'avocat qui la refuse. Rend `null` quand la phrase est nette. */
function tutoIntrus(geste, attendus){
  if(!attendus.length) return null;
  const intrus=S.compo.some(p=>typeof p.valeur==="string" && EMPAN[p.valeur] && !attendus.includes(p.valeur));
  return intrus ? {...geste, n:0, ou:"#composeur", f:"retirer", alerte:true,
    dit:"Retire-le de ta RÉPONSE.",
    ditLong:RATE+" « ← retirer » l'ôte de ta RÉPONSE."} : null;
}
/* CHERCHER LE PASSAGE, AUX DEUX GESTES (§4.8) : tant qu'un passage attendu
   manque à la PHRASE, le halo va à l'index, puis au texte d'une pièce qui en
   porte un — jamais à l'empan. La bulle dit « clique » : le clic pose (passes H
   et K). PIÈGE : une pièce ouverte qui n'en porte AUCUN renvoie à l'index. La
   comparaison court sur deux pièces : le premier passage posé, la pièce encore
   ouverte, le halo restait sur un texte où il n'y avait plus rien à chercher.
   L'alerte n'est plus ici : un passage posé à tort, c'est `tutoIntrus`, et
   retiré, rien n'en garde trace (passe K). Rend `undefined` quand rien ne
   manque : le temps suivant prend le relais. */
function tutoChercher(geste, attendus){
  const manque=attendus.filter(k=>!R.dansPhrase(S,k));
  if(attendus.length ? !manque.length : S.compo.length>0) return undefined;
  const relier=geste===GESTE_RELIER, second=relier && manque.length<attendus.length;
  const ici=!!S.modalPiece && (!manque.length || manque.some(k=>k.startsWith(S.modalPiece+".")));
  // La clé de `tutoVues` : le second passage cherché est une consigne NEUVE.
  const n=k=>relier ? k+(second?"b":"a") : k;
  if(ici) return {...geste, n:n(2), ou:"#panPiece .piecetexte",
    dit: !relier ? "Clique le passage qui répond."
       : second ? "Clique le second passage." : "Clique un premier passage.",
    ditLong: !relier ? "Clique sur le passage qui répond à sa question pour l'ajouter à ta RÉPONSE."
       : second ? "Clique sur le second passage qu'il demande, dans sa pièce."
       : "Une réponse peut tenir sur deux passages : clique sur l'un de ceux qu'il demande, il entre dans ta RÉPONSE."};
  /* AU PREMIER ÉCRAN, IL SE TAIT (§4.8) : le message finit sur le bouton de
     pièces, qui dit déjà où elles sont. Il commence au DOSSIER ouvert. La
     question de la comparaison n'a pas de bouton de pièces : on montre la porte
     DOSSIER. */
  if(panneau==="contexte"){
    const plie=indexPlie(), titre=pieceDemandee(manque[0]);
    const quelle=(relier && !second ? "une des pièces qu'il demande" : "la pièce demandée")+(titre?" : "+titre:"")+".";
    return {...geste, n:n(1), ou:"#zoneDossier",
      dit: plie ? "Déplie tes DOCUMENTS." : "Ouvre un document.",
      ditLong: (relier && !second ? "Une réponse peut tenir sur deux passages. " : "")
          +(plie ? "Déplie tes DOCUMENTS, puis clique sur " : "Clique sur ")+quelle};
  }
  if(relier) return {...geste, n:n(1), ou:"#btnCONTEXTE", dit:"Ouvre ton DOSSIER.",
    ditLong: second ? "Ouvre ton DOSSIER : le second passage est dans l'une de ses pièces."
                    : "Ouvre ton DOSSIER : une réponse peut tenir sur deux passages."};
  return null;
}
/* « → ENVOYER » SE MONTRE (§4.8, passe K, *auteur*) : la phrase posée — et
   rien qu'elle, `tutoIntrus` étant passé avant —, le halo entoure le seul geste
   qui parle, aux deux gestes. La bulle ne dit pas que la phrase est juste. La
   barre colle : `voirCibleTuto` n'y défile pas. */
const tutoEnvoyer = geste => ({...geste, n:9, ou:"#composeur", f:"envoi",
  dit:"Envoie ta RÉPONSE.",
  ditLong:"Rien ne part tant que tu n'envoies pas : « → Envoyer » la transmet à Maître Auber."});
function tutoEtapeCitation(){
  const x=tutoIntrus(GESTE_CITER, tutoTermes());
  if(x) return x;
  const e=tutoChercher(GESTE_CITER, tutoTermes());
  if(e!==undefined) return e;
  return R.peutEnvoyer(S) ? tutoEnvoyer(GESTE_CITER) : null;
}
/* METTRE EN RELATION, EN TROIS TEMPS (§4.8, passe J) : LES PASSAGES — les
   cliquer comme pour citer —, LA RELATION, puis L'ARTICLE — le chercher, lire
   les trois, en prendre un. Une bulle par temps, et chacune attend son geste.
   Puis « → Envoyer » (passe K). Chercher ne vaut que tant que la phrase prend
   un passage : deux termes posés, c'est la relation, puis l'article qui
   manquent. */
function tutoEtapeComparaison(){
  const x=tutoIntrus(GESTE_RELIER, tutoTermes());
  if(x) return x;
  if(R.indexTermeChamp(S)>=0){
    const e=tutoChercher(GESTE_RELIER, tutoTermes());
    if(e!==undefined) return e;
  }
  /* CHOISIR CE QUI LES LIE (passe G, §4.8) : le halo entoure les DEUX relations,
     toute la zone — jamais la bonne, et un mauvais choix n'est pas signalé :
     c'est l'avocat qui le refuse, après l'envoi. */
  if(R.blocsOfferts(S).some(b=>b.type==="relation"))
    return {...GESTE_RELIER, n:3, ou:"#composeur .offre", dit:"Choisis ce qui les lie.",
      ditLong:"Deux passages ne disent pas d'eux-mêmes ce qui les lie : choisis-le."};
  /* L'ARTICLE, TROISIÈME TEMPS (passe J) : on le CHERCHE — le bouton du
     composeur —, on LIT les trois résultats — toute la zone, jamais le bon —,
     on clique le texte de celui qu'on a ouvert — quel qu'il soit : le halo
     désigne le geste, jamais le choix ; un mauvais article part, et l'avocat le
     refuse. Déjà au dossier, l'article se reprend là, sans chercher. Une liaison
     sans article — hors du contenu livré — reste au composeur, et la zone de ses
     propositions avec elle. En session 1, la phrase sans article ne part pas
     (§4.11 point 6) : ce temps dure jusqu'à l'article pris. */
  if(S.compo.length && !R.compoFinie(S)){
    const art=tutoArticle();
    if(!art) return {...GESTE_RELIER, n:7, ou:"#composeur .offre",
        dit:"Prends ce qui la fonde.",
        ditLong:"Une relation seule ne suffit pas : prends ce sur quoi elle s'appuie."};
    const ditLong="Une relation seule ne suffit pas : il lui faut un article qui la fonde.";
    const ouvert=S.modalPiece && R.blocsOfferts(S).some(b=>R.estLiaisonArticle(b) && b.piece===S.modalPiece);
    if(ouvert && panneau==="contexte")
      return {...GESTE_RELIER, n:6, ou:"#panPiece .piecetexte", dit:"Clique sur le texte de l'article.",
        ditLong:"Si c'est celui qui fonde ta relation, clique sur son texte : il entre dans ta RÉPONSE. Sinon, ouvre un autre résultat."};
    const auDossier=R.blocsOfferts(S).some(b=>R.estLiaisonArticle(b) && R.piecesLivrees(S).includes(b.piece));
    if(!S.recherche && auDossier)
      return panneau!=="contexte"
        ? {...GESTE_RELIER, n:4, ou:"#btnCONTEXTE", dit:"Ouvre ton DOSSIER.",
            ditLong:ditLong+" Tu en as déjà trouvé : ils sont dans ton DOSSIER."}
        : {...GESTE_RELIER, n:4, ou:"#zoneDossier", dit: indexPlie() ? "Déplie tes DOCUMENTS." : "Reprends un article de ton DOSSIER.",
            ditLong:ditLong+" Reprends-en un dans ton DOSSIER — clique sur son texte —, ou cherche-en un autre."};
    if(!S.recherche)
      return {...GESTE_RELIER, n:4, ou:"#composeur", f:"chercher", dit:"Cherche un article.",
        ditLong:ditLong+" Cherche-le : l'IA fouille la base des textes."};
    if(panneau!=="contexte")
      return {...GESTE_RELIER, n:5, ou:"#btnCONTEXTE", dit:"Ouvre ton DOSSIER.",
        ditLong:"Ouvre ton DOSSIER : la recherche y a trouvé trois articles."};
    return {...GESTE_RELIER, n:5, ou:"#zoneRecherche", dit:"Lis les articles trouvés.",
      ditLong:"La recherche a trouvé trois articles : ouvre-les, et choisis celui qui fonde ta relation."};
  }
  return R.peutEnvoyer(S) ? tutoEnvoyer(GESTE_RELIER) : null;
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
   un même rang, « Ouvre ton DOSSIER » et « Ouvre un document » sont deux
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
  // Tue, elle n'alerte plus : depuis la passe H, le bon clic qui suit une alerte
  // fait taire la bulle sans consigne entre les deux.
  if(!e){ banniere.hidden=true; banniere.removeAttribute("data-alerte"); return; }
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
const TUTO_EVITE = ".rappel, .aide, .phrase, .compo .barre button, .ptete button, .col > h2 .fermer, .col > h2 .bascule, .ztitle .surfaces";
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
/* Même idiome que `voirRelations` : pur écran, et jsdom n'implémente pas
   `scrollIntoView`, d'où la garde. La barre collante du composeur est réservée
   par son `scroll-padding-bottom`. */
function voirCibleTuto(){
  if(!tutoVoir) return;
  tutoVoir=false;
  // La barre du composeur colle à son bas : « ← retirer » y est toujours dans le
  // champ, et y défiler rognait l'en-tête RÉPONSE (passe H, mesuré).
  if(tutoCible && tutoCible.closest(".barre")) return;
  if(tutoCible && document.contains(tutoCible) && tutoCible.scrollIntoView)
    tutoCible.scrollIntoView({block:"nearest"});
}
/* LES DEUX RELATIONS SE VOIENT (passe G, §4.5) : elles naissent au bas d'un
   composeur plafonné, sous la question et les deux passages — sous le pli, et
   rien ne le disait (mesuré, `npm run vue`). PUIS LE BOUTON QUI CHERCHE (passe
   J) : la relation choisie, le composeur revenait en tête, et le bouton restait
   coupé au bas (mesuré, `npm run vue`). Une fois par apparition, pour ne jamais
   disputer le défilement au joueur ; jsdom n'a pas `scrollIntoView`. */
let offreVue=null;
function voirRelations(){
  const sel = R.blocsOfferts(S).some(b=>b.type==="relation") ? "#composeur .bbloc.relation"
            : R.articleAttendu(S) ? '#composeur [data-f="chercher"]' : null;
  if(!sel){
    // La phrase passée au-delà, le composeur revient en tête : le défilement
    // qu'on lui a imposé ne survit pas à ce qui l'appelait.
    if(offreVue){ const c=$("composeur"); if(c) c.scrollTop=0; }
    offreVue=null; return;
  }
  if(offreVue===sel) return;
  offreVue=sel;
  const el=document.querySelector(sel);
  if(el && el.scrollIntoView) el.scrollIntoView({block:"nearest"});
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
   `basculerDossier` : poser `focusVoulu` AVANT `rendreTout`, jamais un `.focus()`
   manuel après coup. */
function tutoAgrandir(){
  tutoReouvre=true;
  focusVoulu={ cle:"#tutoPasser", zone:null };
  rendreTout();
}

/* 4) RENDU COMMUN */
const modalRoot = $("modalRoot");
/* `modal()` ne sert plus que l'ÉCRAN DE FIN (`finir`) : la pièce ouverte a
   rejoint la place LATÉRALE (§4.6, §4.10 règle 3) et ne passe plus par ici. Un
   écran terminal reste légitimement une vraie boîte de dialogue, `inert`
   compris — il n'y a plus de partie à continuer derrière. PIÈGE PAYÉ : il avait
   une croix et un voile cliquable, qui rendaient la partie — sauvegarde
   comprise, puisque le rendu sauve — et le verdict se rejouait en deux clics.
   Il ne se referme plus : « Recommencer » est sa seule porte (§4.9 règle 5). */
let ouvreur=null;
function modal(html, classe){
  modalRoot.innerHTML =
    `<div class="overlay">
       <div class="modal ${classe||""}" role="dialog" aria-modal="true" aria-labelledby="modalTitre">${html}</div>
     </div>`;
  const w=document.querySelector(".wrap"); if(w) w.setAttribute("inert","");
}
function escapeAttr(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

/* §4.10 règle 2 — LE FOCUS SURVIT AU REDESSIN. Chaque zone est réécrite à
   chaque geste : l'élément qui avait le focus n'existe plus. PIÈGE : on le
   retrouve par sa CLÉ (`data-f`, ou l'id), jamais par l'élément ; et s'il a
   disparu, on reste dans sa ZONE. Un geste qui sait mieux — ouvrir ou fermer
   la pièce — pose `focusVoulu`, qui passe devant. */
const ZONES_FOCUS = "#zoneDossier, #zoneRecherche, #panPiece, #plaidoirie, #composeur, #discussion, .cloture";
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
    annoncer(`${m.qui} : ${texteBrut(m.texte)}${m.question ? " "+texteBrut(m.question) : ""}${n ? ` (${comptePieces(m.pieces)})` : ""}`);
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
  voirRelations();
  placerTuto();                    // APRÈS le recalage du fil, le focus et `voirCibleTuto` : ils déplacent l'ancre
  echoPiece=null;
  annoncerNouveautes(); publierAnnonces();
  sauverPartie();
}

/* ---- Le canal : un fil de messages ---- */
/* LE BOUTON PARLE COMME L'INDEX (§4.6, passe M, *auteur*) : « 2 documents
   ajoutés au DOSSIER » — DOCUMENTS est le titre de l'index, pièces et articles
   confondus, et « ajoutés » dit ce que le message apporte, première remise
   comprise. Il a séparé pièces et règles, puis dit « nouvelles » dès le second
   envoi ; l'index, lui, ne compte toujours pas. */
const compte=(n,mot)=>n+" "+mot+(n>1?"s":"");
const comptePieces = pids => compte(pids.length,"document")+" "+(pids.length>1?"ajoutés":"ajouté")+" au DOSSIER";
function renderDISCUSSION(){
  let h="", dernier=null;
  for(const m of S.fil){
    // PIÈGE : l'avocat vient du contenu, déjà écrit pour l'écran ; la phrase
    // composée de l'IA, elle, s'échappe.
    const meme = m.qui===dernier; dernier=m.qui;
    h+=`<div class="msg ${m.ia?'ia':''} ${meme?'suite':''}">${
      meme?"":`<div class="who">${escapeAttr(m.qui)}</div>`}<div class="bubble">${m.ia?escapeAttr(m.texte):m.texte}${
      m.question?`<div class="qremise">${m.question}</div>`:""}<div>`;
    // Le message ne nomme plus les pièces une à une (§4.6) : un seul bouton,
    // vers le DOSSIER, où chacune se nomme et se lit comme avant — et il vient
    // APRÈS la question que la remise porte : on lit, puis on va chercher.
    if(m.pieces.length){
      const dit=comptePieces(m.pieces);
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
    h+=`<div class="repet"><div class="rtitle">Opposer une réponse à cette affirmation ?</div>
      <blockquote class="raff">${enCours.texte}</blockquote>${
      dispo.length ? dispo.map(x=>{
        const c=cibleDe(x.i), aff=c!=null && JEU.repetition.affirmations[c];
        return `<div class="rnote"><span class="txt">${escapeAttr(x.n.texte)}</span>
         ${c===S.repetitionIdx
            ? `<span class="sent">opposé à celle-ci</span>`
            : `${aff?`<span class="sent">opposé à : ${escapeAttr(aff.court)}</span>`:""}<button class="up" data-f="r:${x.i}" onclick="verserContre(${x.i})">${
                aff?"déplacer ici":"opposer"}</button>`}</div>`;
      }).join("")
      : `<div class="rnote vide">tu n'as envoyé aucune réponse à y opposer</div>`
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
      /* §4.3 — le texte d'un ARTICLE est un passage comme un autre, sans dimension :
         ni couleur ni trait, la bordure et le fond neutres (passe F). */
      // Pris : dans la phrase, et marqué tant qu'il y est (§4.3, passe K).
      const k=pid+"."+eid, pris=R.dansPhrase(S,k), quoi=e.article?"article":e.dim;
      h+=`<span class="${["empan", e.article&&"article", pris&&"pris"].filter(Boolean).join(" ")}" role="button" tabindex="0" data-f="e:${k}"
            ${e.article?"":`style="--dc:${couleurDim(e.dim)};--ds:${traitDim(e.dim)}"`}
            onclick="surligner('${pid}','${eid}')" title="${escapeAttr(quoi)} — ${escapeAttr(e.qui||p.qui||'')}">${
            escapeAttr(e.texte)}<span class="sr"> — ${escapeAttr(quoi)}${pris?", dans ta RÉPONSE":""}</span></span>`;
    } else h+=escapeAttr(m[0]);
    reste=reste.slice(m.index+m[0].length);
  }
  h+=escapeAttr(reste);
  return h;
}
/* §4.6 — LA PIÈCE S'OUVRE DANS LE DOSSIER, sous l'index : on lit, on prend,
   sans rien fermer. L'ouvrir ouvre donc le DOSSIER —
   en CONSULTATION, comme la barre : il ne se referme pas tout seul. Une autre
   pièce déjà ouverte en part d'abord, et sa réplique `declenche` avec elle. */
function ouvrirPiece(pid){
  ouvreur = memoFocus();
  if(S.modalPiece && S.modalPiece!==pid) R.fermerPiece(S);
  R.ouvrirPiece(S,pid);
  // Une pièce ouverte depuis l'index rend sa place au DOSSIER : la lire dans
  // un tiers, c'est le défaut que les deux tiers réparaient (§4.6). L'index,
  // lui, reste comme le joueur l'a laissé (passe M). ‹ › n'y touchent pas.
  panneau="contexte"; panneauSuit=false; discussionAgrandie=false;
  focusVoulu = { cle:"#pieceTitre", zone:"#panPiece" };
  rendreTout();
}
/* La replier rend le DOSSIER à l'index ; le DOSSIER, lui, reste. */
function fermerPiece(){
  R.fermerPiece(S);
  focusVoulu = ouvreur; ouvreur = null;
  rendreTout();
}
/* PIÈGE : UNE PIÈCE N'EST JAMAIS OUVERTE HORS DU DOSSIER (§4.6). Toutes les
   portes qui le referment — sa croix, la barre, l'envoi, la PLAIDOIRIE, la
   fermeture qui suit la phrase — passent par ici, en TÊTE de `rendreTout` :
   la réplique `declenche` (`R.fermerPiece`) tombe ainsi dans le fil AVANT qu'il
   soit dessiné, au moment où l'on relève les yeux (§4.10 règle 3). */
/* …ET NE SE REFERME QUE SI LE COMPOSEUR PREND LE RELAIS (§4.6) : un bloc à
   poser, ou une phrase achevée. PIÈGE PAYÉ : la comparaison posée, l'article
   pas encore lu, il se refermait — et la voix disait aussitôt d'aller le lire,
   DANS le DOSSIER qu'on venait de fermer. Et depuis que l'article SE PREND
   DANS LE DOSSIER (passe F, puis J : il s'y cherche), une phrase qui attend un article n'a rien à
   prendre au composeur : le panneau reste. `peutEnvoyer` n'est PAS un relais :
   une comparaison nue part (§4.5). */
function suivrePhrase(){
  // Le choix de la relation (passe G) n'est pas un relais : l'article qui suit
  // se prend au DOSSIER, et le refermer là, c'était le faire rouvrir aussitôt.
  const relais = () => R.compoFinie(S) || R.blocsOfferts(S).some(b=>b.type!=="relation" && !R.estLiaisonArticle(b));
  if(panneau==="contexte" && panneauSuit && R.indexTermeChamp(S) < 0 && relais()){ panneau=null; panneauSuit=false; }
  if(S.modalPiece && panneau!=="contexte") R.fermerPiece(S);
}
/* CHANGER DE PIÈCE COÛTE UN CLIC (§4.6, retour de Jean) : l'index replié, il en
   fallait deux — déplier, choisir. ‹ et › mènent à la précédente et à la
   suivante DANS L'ORDRE DE L'INDEX, les pièces puis les articles, en boucle ; et
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
      fleche(-1,"prec","‹","Document précédent")}${fleche(1,"suiv","›","Document suivant")}<button class="fermer" data-f="replier" onclick="fermerPiece()" aria-label="Replier le document (Échap)" aria-keyshortcuts="Escape"><span class="x" aria-hidden="true">×</span><kbd>Échap</kbd></button></div>
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
      onclick="basculerDossier()"><span class="dtitre">DOCUMENTS</span><span class="dsens">${
        plie?"▾ déplier":"▴ replier"}</span></button>
    <div class="dossier" id="dossierListe" ${plie?"hidden":""}>${
      colonne("Les pièces",pieces)}${colonne("Les articles",regles)}</div></div>`;
}
/* §4.6 — LA RECHERCHE S'AFFICHE DANS LE DOSSIER, sous l'index (passe J) : trois
   entrées, le NOM NEUTRE de l'article et le début de son texte — jamais son
   titre, qui dirait ce qu'il régit ; ni couleur ni trait, la dimension ne se dit
   pas. Une entrée s'ouvre comme une puce de l'index. Elle vit le temps de la
   phrase (`R.suivreRecherche`). `#zoneRecherche` est une ancre du tutoriel :
   un LITTÉRAL, comme les autres (R6). */
const DEBUT_ARTICLE=90;
function renderRecherche(){
  if(!S.recherche) return "";
  const entree=pid=>{
    const k=Object.keys(ARTICLE).find(x=>ARTICLE[x].pid===pid), a=k && ARTICLE[k];
    const vu=S.examinees.includes(pid), nom=a ? a.nom : JEU.pieces[pid].court;
    const t=a ? a.texte : "", debut=t.length>DEBUT_ARTICLE ? t.slice(0,t.lastIndexOf(" ",DEBUT_ARTICLE))+"…" : t;
    return `<button type="button" class="rchip ${vu?'vu':''} ${S.modalPiece===pid?'ouvert':''}" data-f="s:${pid}"
      aria-label="${escapeAttr(nom)}${vu?", déjà lu":""} : ${escapeAttr(debut)}" onclick="ouvrirPiece('${pid}')">
      <span class="nom">${vu?'✓':'●'} ${escapeAttr(nom)}</span><span class="debut">${escapeAttr(debut)}</span></button>`;
  };
  return `<div class="zone" id="zoneRecherche" tabindex="-1"><span class="dtitre">RECHERCHE</span>
    <div class="rchips">${S.recherche.length ? S.recherche.map(entree).join("") : `<span class="dvide">aucun article trouvé</span>`}</div></div>`;
}
/* Un état d'ÉCRAN, comme `panneau` : jamais sauvé. `dossierPlie` est le choix
   du joueur, et de lui seul : une pièce ouverte ne replie plus l'index (§4.6,
   retour de Jean, passe M) — « Déplie tes DOCUMENTS » coûtait un geste et un
   nom, et depuis la passe K la pièce a toute la hauteur du panneau. */
let dossierPlie=false;
const indexPlie=()=>dossierPlie;
function basculerDossier(){
  dossierPlie=!dossierPlie;
  focusVoulu={ cle:"dossier", zone:"#zoneDossier" };
  rendreTout();
}

/* 5) LE DOSSIER — privé, gratuit, illimité : le dossier, la recherche, la
      pièce ouverte (§4.6). Plus de passages retenus (passe K) : le clic dans la
      pièce prend, et c'est tout. */
/* La pièce n'ajoute que — jamais ne retire (§4.3) : `R.prendre`. La ligne sous
   la pièce dit ce qui a eu lieu — ajouté à ta RÉPONSE, ou déjà dedans — ou,
   le clic n'ayant rien pu prendre, pourquoi. Elle vit le temps d'un rendu. */
let echoPiece=null;
const ECHO_POSE="✓ Ajouté à ta RÉPONSE.";
const ECHO_TROUVE="✓ Ajouté à ta RÉPONSE, et rangé dans ton DOSSIER.";
const RAPPEL_PHRASE="Déjà dans ta RÉPONSE — « ← retirer » pour revenir en arrière.";
/* §4.6 — L'ÉCRAN DIT L'ÉTAT DE LA PHRASE (retour de Jean) : un clic qui ne
   prend rien le dit, sous la pièce, avec ce que la phrase attend. Ces raisons
   vivaient au panneau, alors CONTEXTE, sur les fiches, jusqu'à la passe K. */
const RAISON_PLEINE="Ta RÉPONSE ne prend plus de passage : « ← retirer » pour revenir en arrière.";
const RAISON_ARTICLE_ATTENDU="Ta RÉPONSE ne prend plus de passage : elle attend un article.";
const RAISON_RELATION_ATTENDUE="Ta RÉPONSE ne prend plus de passage : elle attend ce qui les lie.";
const raisonPleine=()=>R.relationsOffertes(S).length ? RAISON_RELATION_ATTENDUE
  : R.articleAttendu(S) ? RAISON_ARTICLE_ATTENDU : RAISON_PLEINE;
/* §4.6 — CE QUE DIT LE TEXTE D'UN ARTICLE CLIQUÉ EN VAIN (passe J) : la fiche
   d'article de la passe F s'en est allée avec son groupe ; ses deux raisons
   passent à la ligne sous la pièce. */
const RAISON_ARTICLE="Un article fonde une relation : il se prend une fois ses deux passages posés, et ce qui les lie choisi.";
const RAISON_COMPLETE="Ta RÉPONSE est complète : « ← retirer » pour revenir en arrière.";
/* UN ARTICLE SE PREND (passe J) : son clic fonde la phrase qui l'attend, et le
   range au dossier la première fois ; sinon, la ligne dit pourquoi — la phrase
   n'en attend pas, ou elle est complète. */
function surlignerArticle(pid,eid){
  const k=pid+"."+eid, auDossier=R.piecesLivrees(S).includes(pid);
  const fait=R.prendre(S,pid,eid);
  const texte = fait==="pose" ? (auDossier ? ECHO_POSE : ECHO_TROUVE)
              : fait==="dejaPhrase" ? RAPPEL_PHRASE
              : fait==="refuse" ? null
              : R.compoFinie(S) ? RAISON_COMPLETE : RAISON_ARTICLE;
  echoPiece = texte && { k, texte, confirme: fait==="pose" };
  if(texte) annoncer(texte.replace(/^✓ /,""));
  rendreTout();
  if(texte) voirEcho(k);
}
/* Un clic refusé ne dit rien sous la pièce : le refus parle, au composeur. */
function surligner(pid,eid){
  if(R.estArticle(pid+"."+eid)) return surlignerArticle(pid,eid);
  const k=pid+"."+eid;
  const fait=R.prendre(S,pid,eid);
  const texte = fait==="pose" ? ECHO_POSE
              : fait==="dejaPhrase" ? RAPPEL_PHRASE
              : fait==="refuse" ? null : raisonPleine();
  echoPiece = texte && { k, texte, confirme: fait==="pose" };
  if(texte) annoncer(texte.replace(/^✓ /,""));
  rendreTout();
  if(texte) voirEcho(k);
}
/* LA LIGNE SOUS LA PIÈCE SE VOIT (§4.3). Depuis que le clic pose (passe H), le
   composeur grandit dès le premier clic, la colonne latérale perd d'autant, et
   sur une pièce longue la ligne naissait sous le bas de sa bande — mesuré à
   `npm run vue`, sur le PV, au premier geste du tutoriel. La bande défile juste
   assez pour la montrer, SANS faire sortir le passage qu'on vient de cliquer :
   elle monte au plus de l'écart entre le haut de la bande et lui. Pur écran,
   comme `voirCibleTuto` ; jsdom rend des rectangles nuls, et rien n'y bouge. */
function voirEcho(k){
  const bande=$("piece"), ligne=bande && bande.querySelector(".rappel");
  const pass=bande && [...bande.querySelectorAll("[data-f]")].find(x=>x.getAttribute("data-f")==="e:"+k);
  if(!ligne || !pass) return;
  const b=bande.getBoundingClientRect(), l=ligne.getBoundingClientRect(), p=pass.getBoundingClientRect();
  if(l.bottom<=b.bottom) return;
  // Jusqu'au bas de la bande — la ligne est le dernier mot de la pièce, et sa
  // marge avec elle, sans quoi le fondu la voilait encore.
  const reste=bande.scrollHeight-bande.scrollTop-bande.clientHeight;
  bande.scrollTop += Math.min(reste, Math.max(0, p.top-b.top));
  majDebord();                     // le fondu « il en reste » se mesure après
}
/* §4.3 — PLUS DE LÉGENDE : l'auteur l'a retirée, le code s'apprend en cherchant
   — au survol du passage. */
/* §4.11 — `porte` SE MARQUE, IL NE S'ÉTIQUETTE PLUS : « Ce texte porte sur :
   quand » faisait le tri dans la tête du joueur. Sous le titre de l'article, un
   FILET de la couleur ET du trait de chaque dimension qu'il régit — le code des
   passages (§4.3), rien par la couleur seule (§4.10 règle 5). Deux dimensions,
   deux filets. À qui ne voit pas, leurs noms. Le moteur ne lit toujours pas
   `porte` (§4.5). PIÈGE PAYÉ (Jean, passe M) : c'étaient des CADRES autour du
   texte, et ils effaçaient la bordure qui dit que ce texte se prend (§4.3). */
function filetsPorte(pid){
  const d=R.porteDe(pid).filter(x=>couleurDim(x));
  if(!d.length) return "";
  return `<div class="porte">${d.map(x=>{
    const t=traitDim(x);
    return `<span class="filet ${t==="wavy"?"ondule":""}" style="--dc:${couleurDim(x)};--ds:${t==="wavy"?"solid":t}"></span>`;
  }).join("")}<span class="sr">Porte sur : ${d.map(escapeAttr).join(", ")}.</span></div>`;
}
function piecePanelHTML(pid){
  const p=JEU.pieces[pid];
  return `${filetsPorte(pid)}<small class="note">${escapeAttr(p.type)} — ${escapeAttr(p.qui||"")}</small>
    <p class="piecetexte">${rendreTexte(pid)}</p>
    ${echoPiece && echoPiece.k.startsWith(pid+".") ? `<p class="rappel${echoPiece.confirme?" confirme":""}">${echoPiece.texte}</p>` : ""}`;
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
  /* UN SEUL VERBE (§4.6, passe K) : un passage se PREND, d'un clic dans sa
     pièce. La voix dit où : il n'y a plus de fiches au DOSSIER. */
  if(!S.compo.length){
    // §4.6 — pendant la répétition on n'écrit plus, on oppose : la voix se tait,
    // et ne reparle que si le joueur recommence une phrase.
    if(R.repetitionEnCours(S)) return "";
    return second ? "Ouvre un document et clique sur un ou plusieurs passages."
                  : "Ouvre un document et clique sur un passage.";
  }
  if(offerts.some(b=>b.cite) || R.compoFinie(S)) return "";
  // §4.5 — LE JOUEUR DÉCLARE CE QUI LES LIE (passe G) : la voix nomme le geste,
  // les deux relations sont juste dessous ; elle ne dit jamais laquelle.
  if(offerts.some(b=>b.type==="relation")) return "Qu'est-ce qui les lie ?";
  if(offerts.some(b=>b.type==="terme"&&b.source!=="note"))
    return "Clique un second passage pour le mettre en relation.";
  /* §4.9 règle 1 — L'ARTICLE SE CHERCHE (passe J) : le bouton « Chercher un
     article correspondant » tient lieu de voix ; elle ne parle que pour dire où
     sont les résultats, ou qu'un article du dossier se reprend là. */
  if(R.articleAttendu(S)){
    if(S.recherche) return "Lis les articles trouvés, dans ton DOSSIER, et clique sur le texte du bon.";
    return offerts.some(b=>R.estLiaisonArticle(b))
      ? "Ou reprends un article de ton DOSSIER : clique sur son texte." : "";
  }
  return offerts.length ? "Sur quel article t'appuies-tu pour montrer qu'il y a une irrégularité ?" : "";
}
/* §4.9 règle 1 — LA VOIX DEVIENT UN BOUTON quand le geste qu'elle nomme a lieu
   dans l'AUTRE colonne. Le prédicat est `indexTermeChamp`, le MÊME qui fait
   prendre le clic dans la pièce (`R.prendre`) : une seule vérité pour les deux
   surfaces. Sinon elle reste du texte — l'article et l'envoi se cliquent ici.
   Quand la voix se tait — un passage posé, la phrase se tient — il n'y a ni
   bouton ni rien à dire : le DOSSIER reste ouvert, et la pièce avec lui. */
function rendreVoix(txt, classe){
  if(!txt) return "";
  // Cliquable, elle a l'air d'un bouton — jamais d'un champ vide (§4.9 règle 1) :
  // la flèche montre où le panneau s'ouvre, au-dessus.
  // L'article se lit et se prend DANS le DOSSIER (passes F et J) : la voix qui
  // le réclame y mène aussi.
  return R.indexTermeChamp(S) >= 0 || R.articleAttendu(S)
    ? `<button class="${classe} versCONTEXTE" data-f="voix" onclick="ouvrirCONTEXTE()">${escapeAttr(txt)}<span class="fl" aria-hidden="true">↑</span></button>`
    : `<span class="${classe}">${escapeAttr(txt)}</span>`;
}
/* Le bouton d'une relation : son `libelle` (§11), sinon son patron, les deux
   termes en points de suspension — ils sont écrits juste au-dessus. */
function libelleRelation(f){
  const F=(JEU.grammaire.formes||{})[f]||{};
  return F.libelle || String(F.patron||f).replace("{a}","…").replace("{b}","…");
}
function texteCompoPartiel(){
  if(!S.compo.length) return rendreVoix(souffle(),"trou");
  const ch=R.chaineCompo(S);
  const fini=ch.some(p=>p.bloc.deduit || p.bloc.type==="relation");
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
/* Le DOSSIER s'ouvre POUR ÉCRIRE (§4.6) : il suit la phrase, et se refermera
   l'article pris. */
function chercherArticle(){
  const t=R.chercher(S);
  if(!t) return;
  panneau="contexte"; panneauSuit=true;
  annoncer(t.length ? compte(t.length,"article")+" trouvé"+(t.length>1?"s":"")+", dans ton DOSSIER." : "Aucun article trouvé.");
  focusVoulu={ cle:"#zoneRecherche", zone:"#zoneRecherche" };
  rendreTout();
}
function retirerBloc(){ R.retirerBloc(S); rendreTout(); }
function viderCompo(){ R.viderCompo(S); rendreTout(); }
/* La phrase PARTIE (§4.6) : le DOSSIER reste tant que la REMISE ne change pas —
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
   enseigne. Le DOSSIER ne compte plus — l'index non plus (§4.6) —, la
   PLAIDOIRIE compte ses moyens ; les ids sont les ancres du tutoriel (R6). */
function barreSurfaces(){
  const etat = nom => panneau===nom ? "versSurface ouvert" : "versSurface";
  const compte = c => c ? ` · ${c}` : "";
  /* PIÈGE : les deux ids sont écrits EN TOUTES LETTRES, et la barre ne se replie
     donc pas en une boucle. Le tutoriel les vise (R6), et le gardien ne sait pas
     lire un id fabriqué par interpolation — il ne dirait rien le jour où l'un
     des deux disparaîtrait. */
  return `<span class="surfaces">
    <button id="btnCONTEXTE" class="${etat("contexte")}"
      onclick="basculerPanneau('contexte')">DOSSIER</button>
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
    if(R.estLiaisonArticle(b)) return;      // son texte, au DOSSIER, est son bouton (§4.6)
    /* §4.5 — LES DEUX RELATIONS DE LA DIMENSION, au choix (passe G) : un bouton
       chacune, dans l'ordre de la grammaire — égalité, puis différence ou ordre.
       Jamais un signe de la vraie : c'est le joueur qui déclare, l'avocat qui
       refuse une relation fausse. */
    if(b.type==="relation"){
      h+=`<div class="relations">${R.relationsOffertes(S).map((f,j)=>
        `<button class="bbloc relation" data-f="rel:${escapeAttr(f)}" onclick="poserBloc(${i},${j})">${escapeAttr(libelleRelation(f))}</button>`).join("")}</div>`;
      return;
    }
    if(b.type==="liaison"){
      // PIÈGE : `fondement` est propre à `.bbloc` ; `.msg.suite` est le même
      // mot pour un sens sans rapport.
      // §4.5 — PAS de `porte sur` ICI : sous le bouton qui l'invoquait, l'étiquette
      // faisait le tri à la place du joueur (« deux fiches QUI → seul l'art. 7
      // colle »). Un article n'a plus de bouton (passe J) ; `porte` se marque d'un
      // filet sous son titre (§4.11, `filetsPorte`).
      h+=`<button class="bbloc ${b.imbrique?"fondement":""}" data-f="b:${escapeAttr(b.id)}" onclick="poserBloc(${i})">${escapeAttr(b.libelle||b.texte)}</button>`;
    } else if(b.source==="note"){
      // Repli pour une affaire d'avant la continuation : hors du contenu livré,
      // toujours supporté — on ne retire pas une capacité du moteur (§11).
      if(S.brouillon.length){
        h+=`<div class="lab">${escapeAttr(b.texte)} — une réponse déjà envoyée</div>`;
        S.brouillon.forEach((n,j)=>{ h+=`<button class="bbloc" data-f="n:${j}" onclick="poserBloc(${i},${j})">${escapeAttr(n.texte)}</button>`; });
      }
    }
  });
  /* §4.5 — LE RAG (passe J) : la relation choisie, on cherche l'article. La
     recherche part de la paire posée, au composeur ; ses résultats paraissent
     dans le DOSSIER. Relancer rebat les trois. */
  if(R.articleAttendu(S))
    h+=`<button class="bbloc chercher" data-f="chercher" onclick="chercherArticle()">${
      S.recherche ? "Relancer la recherche" : "Chercher un article correspondant"}</button>`;
  h+=`</div>`;
  // Le geste qui parle pèse plus que ceux qui défont (§4.9) : Envoyer est le seul
  // bouton plein, à droite ; retirer et effacer restent discrets, à gauche.
  // Une phrase déjà envoyée ne repart pas (§4.5) : le bouton cède sa place à ce
  // qui le dit, là où l'œil cherchait le bouton.
  const envoi = !R.peutEnvoyer(S) ? ""
    : R.dejaEnvoyee(S) ? `<span class="dejaEnvoyee">déjà envoyée</span>`
    : `<button class="envoi" data-f="envoi" onclick="envoyerCompo()">→ Envoyer</button>`;
  if(S.compo.length)
    h+=`<div class="barre">
      <button class="defaire" data-f="retirer" onclick="retirerBloc()">← retirer</button><button class="defaire" data-f="effacer" onclick="viderCompo()">tout effacer</button>
      ${envoi}</div>`;
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
   celui qu'on venait de prendre disparaissait sous le pli au moment même où le
   tutoriel le réclamait. Et depuis que la pièce vit DANS le DOSSIER (§4.6),
   le panneau porte une bande défilante de plus, réécrite avec lui :
   chaque `.defile[id]` garde aussi son défilement, retrouvé par son id. */
function garderDefilement(id, dessiner){
  const el=$(id); if(!el) return;
  const haut=el.scrollTop;
  const internes=[...el.querySelectorAll(".defile[id]")].map(b=>[b.id,b.scrollTop]);
  el.innerHTML = dessiner();
  el.scrollTop = haut;
  for(const [i,t] of internes){ const b=$(i); if(b) b.scrollTop=t; }
}
/* Pièce ouverte, le DOSSIER se lit de haut en bas — l'index (on choisit), la
   recherche, la pièce (on lit, on prend) — et cesse de défiler d'un bloc : la
   pièce prend la hauteur qui reste, et seul son texte défile (§4.6, passe K). */
let pieceDessinee=null;
function renderCONTEXTE(){
  const piece=!!S.modalPiece;
  const el=$("contexte"); if(el) el.classList.toggle("avecPiece", piece);
  { const p=$("panCONTEXTE"); if(p) p.classList.toggle("avecPiece", piece); }
  // Échap ne se lit que là où il agit (§4.10 règle 6) : pièce ouverte, sur elle seule.
  { const f=document.querySelector("#panCONTEXTE > h2 .fermer");
    if(f){ f.setAttribute("aria-label", piece ? "Fermer le DOSSIER" : "Fermer le DOSSIER (Échap)");
           if(piece) f.removeAttribute("aria-keyshortcuts"); else f.setAttribute("aria-keyshortcuts","Escape"); } }
  // Avant la première remise, le dossier est vide : il le dit, dans la fiction (§4.9 règle 4).
  garderDefilement("contexte", () => (S.remisesEnvoyees ? "" : `<div class="zone"><div class="aide">Ton DOSSIER est vide : les pièces de Maître Auber arriveront ici.</div></div>`)
    + renderDossier() + renderRecherche() + (piece ? pieceHTML() : ""));
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

/* §4.6 — LA PLACE LATÉRALE a deux occupants possibles — DOSSIER et PLAIDOIRIE
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
   LA PIÈCE N'EST PAS UN OCCUPANT : elle s'ouvre DANS le DOSSIER (`renderCONTEXTE`),
   et `suivrePhrase` la replie dès que le DOSSIER quitte l'écran. */
let panneau = null, panneauSuit = false;
/* §4.6 — CLIQUER DISCUSSION AGRANDIT LA CONVERSATION (retour de Bérengère). Un
   troisième état d'ÉCRAN, comme `dossierPlie` — jamais sauvé —, qui n'existe que
   DOSSIER ouvert : fermé, la conversation a déjà toute la place, et un bouton qui
   ne ferait rien n'a pas à s'afficher (§4.9 règle 4). Il ne change que le GABARIT
   (`.wrap.discussionAgrandie`), jamais un span. */
let discussionAgrandie = false;
function majLateral(){
  if(panneau!=="contexte") discussionAgrandie=false;      // le DOSSIER refermé l'oublie
  { const p=$("panCONTEXTE");   if(p) p.hidden = panneau!=="contexte"; }
  { const p=$("panPLAIDOIRIE"); if(p) p.hidden = panneau!=="plaidoirie"; }
  // La conversation, seule bande élastique, cède d'elle-même la place (§4.6) ;
  // la classe ne décide que jusqu'où elle peut céder, et c'est du CSS (§9).
  { const w=document.querySelector(".wrap"); if(w){ w.classList.toggle("avecLateral", !!panneau);
                                                   w.classList.toggle("avecCONTEXTE", panneau==="contexte");
                                                   w.classList.toggle("discussionAgrandie", discussionAgrandie); } }
  enteteDISCUSSION();
}
/* L'en-tête nomme toujours la surface (§4.9 règle 2) ; DOSSIER ouvert, il est en
   plus la bascule. Réécrit à chaque rendu : le focus le retrouve par sa clé. La
   section reste nommée par `#nomDISCUSSION` seul — sans l'aide de la bascule. */
function enteteDISCUSSION(){
  const h=$("titreDISCUSSION"); if(!h) return;
  const nom=`<span id="nomDISCUSSION">DISCUSSION</span>`;
  h.innerHTML = panneau!=="contexte" ? nom
    : `<button type="button" class="bascule" data-f="discussion" aria-pressed="${discussionAgrandie}"
         onclick="basculerDISCUSSION()">${nom}<span class="sens"><span aria-hidden="true">↔</span> agrandir</span></button>`;
}
function basculerDISCUSSION(){
  discussionAgrandie=!discussionAgrandie;
  focusVoulu={ cle:"discussion", zone:null };
  rendreTout();
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
  // Pièce ouverte, la bande du DOSSIER dit SON débordement — le fondu est
  // posé sur la bande, jamais sur ce qui défile dedans (même PIÈGE qu'en tête).
  for(const b of document.querySelectorAll("#contexte .bande"))
    b.classList.toggle("deborde", reste(b.querySelector(".defile")));
}
/* La voix mène aux documents (passe M, *auteur*) : elle dit « Ouvre un
   document », et les montre — l'index se déplie, comme au bouton de pièces. */
function ouvrirCONTEXTE(){ panneau="contexte"; panneauSuit=true; dossierPlie=false; rendreTout(); }
/* Le bouton agrégé du message OUVRE le DOSSIER, il ne le BASCULE pas (§4.6) :
   un second clic, sur un ancien message, ne doit pas refermer un DOSSIER déjà
   ouvert. Sans `panneauSuit` — on vient CONSULTER, pas écrire — il ne se
   referme pas tout seul à la pose d'un passage. */
function voirPiecesRecues(){
  panneau="contexte"; panneauSuit=false;
  dossierPlie=false;                       // on vient voir ce qu'on a reçu : l'index se déplie (§4.6)
  focusVoulu={ cle:"#titreCONTEXTE", zone:"#panCONTEXTE" };
  rendreTout();
}
function basculerPanneau(nom){
  panneau = panneau===nom ? null : nom; panneauSuit=false; rendreTout();
}
function fermerPanneau(){ panneau=null; panneauSuit=false; rendreTout(); }

/* LE CLAVIER (§4.10). Échap referme ce qui est le plus DEVANT : la pièce
   ouverte (repliée, le DOSSIER reste), la confirmation en attente, le panneau. Entrée et Espace font d'un SPAN qui se déclare bouton — un passage —
   un vrai bouton ; les <button> n'ont besoin de personne. */
function clavier(e){
  /* L'écran de fin est terminal (§4.10 règle 6) : derrière son voile, Échap
     repliait la pièce et refermait le panneau d'une partie finie. */
  if(modalRoot.firstChild) return;
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
/* Une partie ne se reprend jamais sur une pièce ouverte : `sauverPartie` écrit
   `modalPiece:null`, et le DOSSIER est un état d'écran, jamais sauvé (§4.6). */
rendreTout();

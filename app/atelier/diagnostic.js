/* ============================================================
   ATELIER — LE DIAGNOSTIC : le dossier tient-il ?
   C'est la plus grosse pièce de l'atelier, et c'est normal — elle porte
   tout ce qu'aucune suite ne peut attraper à la place de l'auteur.
   ============================================================ */
/* Rend la liste des anomalies du CONTENU ENTIER.
   ELLE NE S'APPELLE PLUS `valider` : `moteur.js` a un `valider(r)` qui juge UNE
   phrase et rend la raison de son refus. Les deux fichiers sont chargés par la
   même page, et les deux rendaient « rien » quand tout va bien — l'un par
   `null`, l'autre par un tableau vide. C'est la pire forme de collision : celle
   où se tromper de fonction ne se voit pas tant que rien ne va mal
   (docs/CARTE.md). Le `m.valider(…)` appelé plus bas est bien celui du moteur. */
function diagnostiquer(){
  const out=[]; const P=CONTENU.pieces||{}, LI=CONTENU.liens||[];
  const add=(niveau,msg,detail,ref)=>out.push({niveau,msg,detail,ref});
  const livrees=toutesPiecesLivrees();
  const dims=toutesDims();
  const m=MG();

  /* ---- la grammaire ---- */
  const G=CONTENU.grammaire;
  if(!G || !Array.isArray(G.blocs) || !G.formes){
    add("erreur","Grammaire absente","Sans « grammaire » (automate + formes), le jeu refuse le contenu : plus aucune phrase n'est composable.",{});
  } else {
    const finaux=new Set(G.finaux||[]);
    /* Les états qu'on peut atteindre depuis le départ SANS qu'aucune forme
       n'ait encore été fixée. Un bloc « en rester là » (sans forme, menant à
       un final) est légitime tant qu'on ne peut pas l'atteindre par là. */
    // Un bloc FIXE une forme s'il en déclare une, ou s'il la fait déduire.
    const fixeUneForme = b => !!b.forme || !!b.deduit;
    const sansForme=new Set([G.depart]); let zf=true;
    while(zf){ zf=false; for(const b of G.blocs)
      if(sansForme.has(b.de) && !fixeUneForme(b) && !sansForme.has(b.vers)){ sansForme.add(b.vers); zf=true; } }
    for(const b of G.blocs){
      if(finaux.has(b.vers) && !fixeUneForme(b) && sansForme.has(b.de))
        add("erreur",`Bloc « ${b.id} » clôt une phrase sans forme`,"Un bloc qui mène à un état final doit déclarer la forme obtenue (ou la faire déduire), ou ne partir que d'un état où une forme est déjà fixée — sinon la phrase ne se réduit pas.",{});
      if(b.imbrique && sansForme.has(b.de))
        add("erreur",`Bloc « ${b.id} » emboîte dans le vide`,`Ce bloc emboîte ce qui précède comme terme, mais l'état « ${b.de} » est atteignable sans qu'aucune forme ait été fixée : la phrase se réduirait autour d'un terme vide.`,{});
      if(b.piece && !P[b.piece])
        add("erreur",`Bloc « ${b.id} » attend une pièce inconnue`,`« ${b.piece} » n'existe pas : ce bloc ne serait jamais offert au joueur.`,{});
    }
    // Une forme ordonnée qui se déduit doit dire dans quel sens elle se lit.
    for(const [nom,f] of Object.entries(G.formes||{}))
      if(f.deduction==="ordre" && f.ordonne && !f.sens)
        add("avert",`Forme « ${nom} » ordonnée sans « sens »`,"Sans « sens », les deux termes sont rangés par ordre croissant de valeur. Écris-le (asc/desc) plutôt que de le subir : c'est ce qui décide de la lecture de la phrase.",{});
    // Une dimension qu'aucune forme déductible n'accepte : ses empans seraient
    // surlignables mais jamais comparables — cliquables pour rien.
    if((G.blocs||[]).some(b=>b.deduit))
      for(const d of dims){
        const prise=Object.values(G.formes||{}).some(f=>{
          const sl=f.deduction && f.slots && f.slots[0];
          return sl && (sl==="*" || sl.includes(d));
        });
        if(!prise) add("avert",`Dimension « ${d} » sans forme déductible`,
          "Aucune forme ne se déduit sur cette dimension : ses empans seraient surlignables, mais deux d'entre eux ne se compareraient jamais.",{});
      }
    // impasses : tout état doit pouvoir atteindre un final
    const prod=new Set(finaux); let z=true;
    while(z){ z=false; for(const b of G.blocs) if(prod.has(b.vers)&&!prod.has(b.de)){ prod.add(b.de); z=true; } }
    const etats=new Set([G.depart,...G.blocs.flatMap(b=>[b.de,b.vers])]);
    for(const e of etats) if(!prod.has(e))
      add("erreur",`Impasse dans l'automate : état « ${e} »`,"Aucun chemin ne mène de cet état à une fin de phrase — le joueur y resterait coincé.",{});
    /* UNE FORME EXISTE DE DEUX FAÇONS (§15). Une liaison peut la DÉCLARER
       (`forme:` sur un bloc) ; depuis la déduction (§4.5), un bloc `deduit` peut
       la faire DÉDUIRE — et celle-là n'est nommée par aucun bloc, puisque le
       joueur désigne au lieu de déclarer. Ce contrôle ne connaissait que la
       première : il tenait les quatre formes comparatives de l'affaire livrée
       pour indicibles alors que le jeu les prononce.
       « Déductible » se lit ici comme `deduire` le lit (moteur.js), et SUR CE
       DOSSIER : le prédicat, l'arité 2, et un slot qui accepte au moins une
       dimension déclarée. Chacune des trois manque autrement, donc se dit
       autrement — un avertissement qui ne nomme pas son remède n'en est pas un.
       L'OMBRAGE n'est pas signalé, et c'est voulu : `deduire` rend la PREMIÈRE
       forme qui convient, l'ordre de déclaration est signifiant (§11), et
       l'alerter reviendrait à interdire ce qui tranche les ambiguïtés. */
    const parDeduction=(G.blocs||[]).some(b=>b.deduit);
    const slotOuvert=F=>{ const s=F.slots&&F.slots[0];
      return s==="*" || (Array.isArray(s) && s.some(d=>dims.includes(d))); };
    for(const [f,F] of Object.entries(G.formes)){
      if(G.blocs.some(b=>b.forme===f)) continue;        // déclarée par une liaison
      if(!F.deduction || (F.arite||2)!==2)
        add("avert",`Forme « ${f} » sans bloc`,
          "Aucune liaison ne la produit, et elle ne peut pas se déduire — une forme déduite porte « deduction » et une arité 2. Elle est indicible.",{});
      else if(!parDeduction)
        add("avert",`Forme « ${f} » déductible, mais rien ne la déduit`,
          "Elle porte « deduction », mais aucun bloc de la grammaire ne porte « deduit » : rien ne déclencherait le calcul.",{});
      else if(!slotOuvert(F))
        add("avert",`Forme « ${f} » se déduirait sur une dimension absente`,
          `Son premier slot ne nomme aucune dimension déclarée (${dims.join(", ")}) : deux empans de ce dossier ne la produiront jamais.`,{});
    }
  }
  if(!Array.isArray(CONTENU.dimensions)||!CONTENU.dimensions.length)
    add("erreur","Clé « dimensions » absente","Le jeu refuserait ce contenu — et les couleurs d'empan n'auraient plus de rang.",{});

  /* ---- les empans et la règle de surlignage ---- */
  for(const [pid,p] of Object.entries(P)){
    const txt=String(p.texte||"");
    const marques=[...txt.matchAll(/\{\{([A-Za-z0-9_]+)\}\}/g)].map(x=>x[1]);
    for(const [eid,e] of Object.entries(p.empans||{})){
      if(!e.dim) add("erreur",`Empan sans dimension : ${p.court}·${joli(eid)}`,
        "Un empan sans dimension n'est comparable à rien.",{champ:[pid,eid]});
      else if(!dims.includes(e.dim)) add("erreur",`Dimension inconnue « ${e.dim} » : ${p.court}·${joli(eid)}`,
        `« ${e.dim} » n'est pas dans la liste « dimensions » — le jeu ne saurait pas la colorer.`,{champ:[pid,eid]});
      if(!String(e.texte||"").trim()) add("erreur",`Empan sans texte : ${p.court}·${joli(eid)}`,
        "L'empan est ce que le joueur LIT — pas seulement une valeur.",{champ:[pid,eid]});
      if(!String(e.nom||"").trim()) add("avert",`Empan sans nom : ${p.court}·${joli(eid)}`,
        "Sans nom, c'est la citation entière qui entre dans les phrases composées — elles se lisent alors comme un empilement, pas comme une pensée (§4.1). Donne un groupe nominal : « l'heure des éclats de voix ».",{champ:[pid,eid]});
      if(!marques.includes(eid)) add("erreur",`Empan non marqué dans le texte : ${p.court}·${joli(eid)}`,
        `Ajoute {{${eid}}} dans le texte de la pièce, là où l'empan se lit — sinon il est inatteignable (règle de surlignage, §4.3).`,{champ:[pid,eid]});
      else if(marques.filter(x=>x===eid).length>1)
        add("avert",`Empan marqué deux fois : ${p.court}·${joli(eid)}`,"Le même empan apparaît à deux endroits du texte — un seul marqueur suffit.",{champ:[pid,eid]});
    }
    for(const mk of marques) if(!(p.empans||{})[mk])
      add("erreur",`Marqueur orphelin {{${mk}}} dans « ${p.court} »`,"Le texte appelle un empan qui n'existe pas : il s'afficherait tel quel.",{piece:pid});
    // règle de surlignage : une valeur qui se lit comme une heure ou un nombre,
    // hors marqueur, est probablement un empan oublié.
    const hors=txt.replace(/\{\{[A-Za-z0-9_]+\}\}/g," ");
    const susp=[...hors.matchAll(/\b\d{1,2}\s?h\s?\d{2}\b|\b\d{2}:\d{2}\b/g)].map(x=>x[0]);
    if(susp.length) add("avert",`Valeur non marquée dans « ${p.court} » : ${susp.join(", ")}`,
      "Tout empan portant une valeur d'une des dimensions doit être marqué et cliquable — sinon l'interface trie à la place du joueur (§4.3).",{piece:pid});
  }

  /* ---- les liens ---- */
  LI.forEach((L,i)=>{
    if(!formeDe(L.forme))
      return add("erreur",`Lien ${i} : forme « ${L.forme} » inconnue`,"Cette forme n'est pas déclarée dans la grammaire.",{edge:i});
    const f=formeDe(L.forme);
    if((L.termes||[]).length!==(f.arite||2))
      add("erreur",`Lien ${i} : ${(L.termes||[]).length} terme(s) pour une forme d'arité ${f.arite}`,"",{edge:i});
    for(const k of feuillesLien(L)){
      const [pid,eid]=deK(k);
      if(!empanExiste(pid,eid))
        add("erreur",`Lien ${i} pointe vers un empan inexistant (${k})`,"Empan ou pièce supprimé ?",{edge:i});
      else if(!livrees.has(pid))
        add("erreur",`Lien ${i} injouable : « ${courtDe(pid)} » n'est livrée par aucune remise`,
          "Le joueur ne peut surligner que dans les pièces reçues.",{edge:i});
    }
    if(m && !lienSense(L))
      add("erreur",`Lien ${i} insensé : ${m.valider({forme:L.forme,termes:L.termes||[]})}`,
        `« ${labelLien(L)} » serait refusée à la composition — le joueur ne pourrait jamais la former.`,{edge:i});
    if(L.vice&&L.faux)
      add("erreur",`Lien ${i} à la fois vice ET faux vice`,"Un lien ne peut pas être les deux — décoche l'un.",{edge:i});
    if(L.conclusion && (f.arite||2)!==1)
      add("avert",`Lien ${i} marqué « conclusion » sans être une qualification`,
        "Seule une liaison d'arité 1 (sur une note close) conclut — c'est elle qui porte la base légale.",{edge:i});
    /* Une remise attend une SUITE de réponses (§3) : le tag vit sur l'ATTENTE,
       plus sur la remise. Cette ligne demandait encore `r.attend` — la forme
       d'avant — si bien que sur une affaire au schéma 3 elle répondait « non »
       pour TOUS les tags : six informations mensongères à chaque ouverture, une
       par lien qui en porte un. Une bande toujours pleine s'apprend à ne plus se
       lire. `attentesDeRemise` (noyau.js) est le normalisateur, et il lit les
       deux écritures — R9 du gardien interdit désormais de le contourner. */
    if(L.tag && !(CONTENU.remises||[]).some(r=>attentesDeRemise(r).some(a=>a.attend===L.tag)))
      add("info",`Lien ${i} : tag « ${L.tag} » attendu par aucune remise`,"Le versement de cette phrase ne fera avancer aucune session.",{edge:i});
  });
  for(let i=0;i<LI.length;i++) for(let j=i+1;j<LI.length;j++)
    if(memeLien(LI[i],LI[j]))
      add("avert",`Liens dupliqués (${i} et ${j})`,`« ${labelLien(LI[i])} » apparaît deux fois.`,{edge:j});

  /* ---- les articles : des RÉFÉRENCES, jamais des porteurs d'empan ----
     C'est l'invariant du §4.5 (« une règle ne lit aucune dimension »), rendu
     vérifiable. Un article ne s'invoque pas, il se cite : ce qu'on compare
     vient toujours des pièces. `porte` dit ce que l'article régit — purement
     indicatif, le moteur ne le lit jamais, mais le joueur en a besoin pour
     savoir quel genre de relation on lui demande de chercher. */
  for(const [pid,p] of Object.entries(P)){
    if(!estRegle(p)) continue;
    const n=Object.keys(p.empans||{}).length;
    if(n) add("erreur",`La règle « ${p.court} » porte ${n} empan(s)`,
      "Un article est une référence qu'on invoque, pas un texte qu'on retraverse : déplace cet empan dans la pièce qui l'énonce (le rapport qui cite le seuil, par exemple).",{piece:pid});
    if(!livrees.has(pid)) continue;
    const porte=p.porte;
    if(!Array.isArray(porte) || !porte.length)
      add("avert",`La règle « ${p.court} » n'annonce pas ce qu'elle régit`,
        "Sans `porte`, le joueur ne sait pas quel genre de relation cet article gouverne. Renseigne les dimensions concernées.",{piece:pid});
    else for(const d of porte) if(!dims.includes(d))
      add("erreur",`La règle « ${p.court} » régit une dimension inconnue : « ${d} »`,
        `Les dimensions déclarées sont : ${dims.join(", ")}.`,{piece:pid});
  }

  /* ---- le vice, le faux vice, les canaux ---- */
  const viceLiens=LI.filter(l=>l.vice);
  const conclusions=viceLiens.filter(l=>l.conclusion);
  if(!viceLiens.length) add("avert","Aucun vice défini","Il n'existe aucun lien marqué « vice » — pas de Fin 1/2 possible.",{});
  else if(!conclusions.length)
    add("erreur","Le vice n'a pas de conclusion",
      "Un lien ⚑ existe, mais aucun ne porte « conclusion » : vice_trouve et vice_expose ne seraient jamais levés — seule la Fin 3 serait atteignable.",{});
  else {
    const canaux=new Set(conclusions.map(l=>l.forme));
    if(canaux.size>1) add("avert",`Le vice a ${canaux.size} canaux indépendants`,
      "Le design ne veut qu'UNE violation dissimulée : une seule liaison-article doit conclure le vice.",
      {edges:conclusions.map(l=>LI.indexOf(l))});
  }
  for(const l of viceLiens)
    for(const k of feuillesLien(l)){
      const [pid,eid]=deK(k);
      if(estBruit(pid,eid))
        add("avert","Le vice passe par un empan marqué « bruit »",
          `${cflabel(k)} est à la fois porteur du vice et déclaré décoratif — décoche l'un des deux.`,{edge:LI.indexOf(l)});
    }
  const faux=LI.filter(l=>l.faux).length;
  if(faux===0) add("avert","Aucun faux vice","Le leurre (test de discrimination) manque.",{});
  else if(faux>1) add("avert",`${faux} faux vices`,"Un seul leurre suffit — plusieurs brouillent le test.",{});

  /* ---- LE DOUBLON BANAL (§4.4 de CONCEPTION) ----
     Si toutes les valeurs d'une dimension sont uniques, le premier doublon
     EST la réponse. La dimension qui porte le vice doit compter au moins
     deux doublons réguliers en plus de l'irrégulier. */
  const plats=empansPlats().filter(e=>livrees.has(e.pid));
  const parDim={};
  for(const e of plats) (parDim[e.dim]=parDim[e.dim]||[]).push(e);
  const groupes=d=>{
    const g={}; for(const e of (parDim[d]||[])) (g[String(e.valeur)]=g[String(e.valeur)]||[]).push(e);
    return Object.entries(g).filter(([,l])=>l.length>1);
  };
  const dimsVice=new Set();
  for(const l of viceLiens) for(const k of feuillesLien(l)){
    const [pid,eid]=deK(k); const e=empanDe(pid,eid); if(e) dimsVice.add(e.dim);
  }
  for(const d of dims){
    const n=(parDim[d]||[]).length;
    if(n<2){ if(n===1) add("avert",`Dimension « ${d} » : un seul empan livré`,
      "Il ne peut se comparer à rien.",{}); continue; }
    const dbl=groupes(d);
    if(!dbl.length) add("avert",`Dimension « ${d} » : aucun doublon`,
      "Toutes les valeurs y sont uniques — le premier doublon SERAIT la réponse. Ajoute du doublon banal (le même nom qui revient, une petite brigade).",{});
    if(dimsVice.has(d)){
      const irreg=new Set();
      for(const l of viceLiens) for(const k of feuillesLien(l)){
        const [pid,eid]=deK(k); const e=empanDe(pid,eid);
        if(e && e.dim===d) irreg.add(String(e.valeur));
      }
      const reguliers=dbl.filter(([v])=>!irreg.has(v)).length;
      if(reguliers<2) add("avert",`Dimension « ${d} » porte le vice avec ${reguliers} doublon(s) régulier(s)`,
        "Il en faut au moins deux en plus de l'irrégulier, sinon le doublon du vice se voit à l'œil nu.",{});
    }
  }

  /* ---- les remises et leurs attentes ---- */
  const R=CONTENU.remises||[];
  const tags=new Set(LI.map(l=>l.tag).filter(Boolean));
  /* Un chemin de composition existe-t-il, avec les seules pièces reçues à ce
     stade, qui passe par la forme voulue et atteigne un état final ? Recherche
     en largeur sur les états, en ne franchissant que les blocs livrés. */
  const formeComposable=(forme,dispo)=>{
    const G=CONTENU.grammaire||{}, fins=new Set(G.finaux||[]);
    const vus=new Set(), file=[[G.depart,false]];
    while(file.length){
      const [e,vue]=file.shift();
      const cle=e+"|"+vue; if(vus.has(cle)) continue; vus.add(cle);
      if(vue && fins.has(e)) return true;
      for(const b of (G.blocs||[])){
        if(b.de!==e) continue;
        if(b.piece && !dispo.has(b.piece)) continue;
        file.push([b.vers, vue || b.forme===forme]);
      }
    }
    return false;
  };
  R.forEach((r,i)=>{
    for(const pid of r.pieces||[])
      if(!P[pid]) add("erreur",`Remise ${i+1} référence une pièce inexistante`,
        `« ${pid} » n'existe pas — le jeu planterait en la livrant.`,{});
    if(!(r.pieces||[]).length)
      add("info",`Remise ${i+1} ne livre aucune pièce`,"Session purement narrative ?",{});
    /* Une remise attend une SUITE de réponses (§3) : l'avocat pose, attend,
       accuse réception, repose. L'ancienne forme — `attend`/`apres` sur la
       remise — se lit comme une liste à un élément. */
    const attentes=attentesDeRemise(r);
    if(!attentes.length)
      add("erreur",`Remise ${i+1} sans attente`,
        i<R.length-1
          ? `La remise ${i+2} ne partirait jamais : c'est le versement d'une phrase portant ce tag qui ferme la session.`
          : "La clôture ne s'ouvrirait jamais — la dernière remise doit elle aussi attendre quelque chose.",{});
    // Les pièces reçues à ce stade : celles de cette remise et de toutes les précédentes.
    const dispo=new Set();
    for(let k=0;k<=i;k++) for(const pid of (R[k].pieces||[])) dispo.add(pid);
    attentes.forEach((a,j)=>{
      const ou=attentes.length>1 ? ` (attente ${j+1})` : "";
      if(!a.attend){
        add("erreur",`Remise ${i+1}${ou} : une question sans tag à servir`,
          "Une question posée que rien ne peut satisfaire bloque la session : donne-lui un « attend ».",{});
        return;
      }
      if(!tags.has(a.attend)){
        add("erreur",`Remise ${i+1}${ou} attend « ${a.attend} », qu'aucun lien ne porte`,
          "Aucune phrase composable ne satisfait cette attente — la session serait sans issue.",{});
        return;
      }
      /* LE BLOC LIVRÉ TROP TARD. Depuis que les blocs sont filtrés par
         livraison (§4.5), une attente peut devenir inservable : si TOUTES les
         phrases qui la servent exigent une pièce qui arrive plus tard, le
         joueur ne peut littéralement pas écrire ce qu'on lui demande. Ça vaut
         pour un article, et depuis le 30 juillet pour le second empan aussi.
         Aucune relecture n'attrape ça ; une partie de test, après vingt minutes. */
      const servables=(CONTENU.liens||[]).filter(L=>L.tag===a.attend && formeComposable(L.forme,dispo));
      if(!servables.length)
        add("erreur",`Remise ${i+1}${ou} attend « ${a.attend} », mais de quoi l'écrire n'est pas encore livré`,
          "Toutes les phrases qui serviraient cette attente passent par un bloc dont la pièce n'a pas encore été remise : la session est inclôturable. Livre la pièce plus tôt, ou déplace l'attente.",{});
    });
  });

  /* ---- les manuels ---- */
  if(!Object.values(P).some(p=>estRegle(p)))
    add("avert","Aucune pièce de type « règle »","Le Manuel du cas serait vide (les règles sont trouvées par leur type).",{});
  if(!Array.isArray(CONTENU.directives)||!CONTENU.directives.length)
    add("avert","Directives absentes","Le Manuel de soi serait vide — le dilemme D1/D2 est le cœur du jeu.",{});

  ((CONTENU.repetition||{}).affirmations||[]).forEach((a,i)=>{
    if(!a || !String(a.texte||"").trim())
      add("avert",`Affirmation ${i+1} sans texte`,"La répétition lirait une affirmation vide.",{});
  });

  /* ---- reliquats du schéma 2 ---- */
  for(const [cle,quoi] of [["dims","la table globale des dimensions"],["cases","les cases du carnet"],
                            ["relations","les deux relations du carnet"],["attention","le budget d'attention (P0)"]])
    if(CONTENU[cle]!==undefined)
      add("info",`Clé « ${cle} » présente mais ignorée`,
        `Reliquat du schéma 2 (${quoi}) — le moteur ne la lit plus, elle peut être nettoyée.`,{});
  for(const [pid,p] of Object.entries(P))
    if(p.champs) add("info",`« ${p.court} » porte encore « champs »`,
      "Reliquat du schéma 2 : les champs sont devenus des empans.",{piece:pid});

  /* ---- empans inertes, pièces non livrées ---- */
  for(const [pid,p] of Object.entries(P))
    for(const eid of Object.keys(p.empans||{})){
      if(empanRelie(pid,eid)) continue;
      if(estBruit(pid,eid)) add("info",`Bruit assumé : ${p.court}·${joli(eid)}`,"Marqué comme leurre décoratif — ignoré.",{champ:[pid,eid]});
      else add("avert",`Empan inerte : ${p.court}·${joli(eid)}`,
        "Dans aucun lien. C'est normal pour du bruit (et il en faut) — marque-le pour faire taire cet avertissement.",{champ:[pid,eid]});
    }
  for(const [pid,p] of Object.entries(P))
    if(!livrees.has(pid)) add("avert",`Pièce jamais livrée : ${p.court}`,"Aucune remise ne la transmet (ajoute-la à une remise dans l'onglet Étapes).",{piece:pid});

  return out;
}
/* « pid.eid » → « court·eid ». Accepte aussi l'ancienne paire [pid,eid]. */
function cflabel(k){
  const [pid,eid]=Array.isArray(k)?k:deK(k);
  const p=CONTENU.pieces[pid];
  return (p?p.court:pid)+"·"+joli(eid||"?");
}

function renderDiag(){
  const issues=diagnostiquer();
  const nE=issues.filter(i=>i.niveau==="erreur").length;
  const nA=issues.filter(i=>i.niveau==="avert").length;
  const nI=issues.filter(i=>i.niveau==="info").length;
  let h=`<div class="tally">
     <span class="pill e">${nE} erreur${nE>1?'s':''}</span>
     <span class="pill a">${nA} avert.</span>
     <span class="pill i">${nI} info</span></div>`;
  if(!issues.length){ h+=`<div class="clean">✓ Le dossier tient : rien à signaler.</div>`; }
  const mark={erreur:"●",avert:"▲",info:"·"}, ab={erreur:"e",avert:"a",info:"i"};
  const ordre={erreur:0,avert:1,info:2};
  issues.sort((x,y)=>ordre[x.niveau]-ordre[y.niveau]).forEach(it=>{
    h+=`<div class="issue ${ab[it.niveau]}" onclick='pointer(${JSON.stringify(it.ref||{}).replace(/'/g,"&#39;")})'>
      <span class="mark">${mark[it.niveau]}</span>
      <span class="body">${escapeH(it.msg)}<small>${escapeH(it.detail||"")}</small></span></div>`;
  });
  $("diag").innerHTML=h;
}
/* Cliquer une ligne du diagnostic, c'est laisser le diagnostic prendre la main :
   tout ce qui était sélectionné tombe, puis on désigne. Écrit à la main, ce
   nettoyage oubliait `formPieceEdit` — l'éditeur de texte restant ouvert, et
   `renderInsp` le rendant en priorité, cliquer une ligne ne montrait RIEN.
   `reinitSelection` (noyau.js) ne peut plus l'oublier pour personne. */
function pointer(ref){
  reinitSelection();
  if(!ref) return render();
  if(ref.edge!=null){ selEdge=ref.edge; }
  /* Les empans à surligner d'un LOT de liens. Cette ligne dépliait encore
     `l.a`/`l.b`, le format du SCHÉMA 2 : en schéma 3 un lien porte
     `forme`/`termes`, et sur le contenu livré `liens[7].a` vaut `undefined` —
     cliquer l'avertissement « le vice a N canaux indépendants », son seul
     émetteur, levait une TypeError. `feuillesLien` rend les empans-feuilles
     quel que soit l'emboîtement, et il est déjà employé partout ailleurs ici. */
  if(ref.edges){ ref.edges.forEach(i=>{ const l=CONTENU.liens[i]; if(!l) return;
    for(const k of feuillesLien(l)) flagged.add(k); }); }
  if(ref.champ){ flagged.add(K(ref.champ[0],ref.champ[1])); scrollVers(ref.champ[0]); }
  if(ref.piece){ scrollVers(ref.piece); }
  render();
}
function scrollVers(pid){ const pos=CONTENU._pos[pid], st=$("stage");
  if(pos && typeof st.scrollTo==="function") st.scrollTo({left:Math.max(0,pos.x-120),top:Math.max(0,pos.y-90),behavior:"smooth"}); }


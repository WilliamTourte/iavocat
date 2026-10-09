/* ATELIER — LE DIAGNOSTIC : le dossier tient-il ? La plus grosse pièce, et
   c'est normal : elle porte ce qu'aucune suite ne peut attraper. */
/* PIÈGE — les anomalies du CONTENU ENTIER ne s'appellent plus `valider` : le
   `valider` de moteur.js juge UNE phrase, les deux fichiers sont chargés par la
   même page, et tous deux rendent « rien » quand tout va bien (R2, §17). */
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
    const fixeUneForme = b => !!b.forme || !!b.deduit || b.type==="relation";
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
    for(const [nom,f] of Object.entries(G.formes||{}))
      if(f.deduction==="ordre" && f.ordonne && !f.sens)
        add("avert",`Forme « ${nom} » ordonnée sans « sens »`,"Sans « sens », les deux termes sont rangés par ordre croissant de valeur. Écris-le (asc/desc) plutôt que de le subir : c'est ce qui décide de la lecture de la phrase.",{});
    const parChoix=(G.blocs||[]).some(b=>b.type==="relation");
    if((G.blocs||[]).some(b=>b.deduit) || parChoix)
      for(const d of dims){
        // La juxtaposition (§4.11) prend toutes les dimensions et n'en compare aucune :
        // elle ne compte pas — sinon elle ferait taire cet avertissement partout.
        const prise=Object.values(G.formes||{}).some(f=>{
          const sl=f.deduction && f.deduction!=="juxtaposition" && f.slots && f.slots[0];
          return sl && (sl==="*" || sl.includes(d));
        });
        if(!prise) add("avert",`Dimension « ${d} » sans forme déductible`,
          "Aucune forme ne se déduit sur cette dimension : ses empans seraient surlignables, mais deux d'entre eux ne se compareraient jamais.",{});
        /* LE JOUEUR CHOISIT ENTRE DEUX (passe G, §4.5) : une seule relation offerte,
           c'est un choix qui n'en est pas un — il dirait la vraie. */
        else if(parChoix && m && m.relationsDe(d).length===1)
          add("avert",`Dimension « ${d} » n'offre qu'une relation`,
            "Le joueur choisit entre les deux relations de la dimension : n'en offrir qu'une, c'est la lui souffler. Déclare l'autre côté — égalité, ou différence et ordre.",{});
      }
    const prod=new Set(finaux); let z=true;
    while(z){ z=false; for(const b of G.blocs) if(prod.has(b.vers)&&!prod.has(b.de)){ prod.add(b.de); z=true; } }
    const etats=new Set([G.depart,...G.blocs.flatMap(b=>[b.de,b.vers])]);
    for(const e of etats) if(!prod.has(e))
      add("erreur",`Impasse dans l'automate : état « ${e} »`,"Aucun chemin ne mène de cet état à une fin de phrase — le joueur y resterait coincé.",{});
    const parDeduction=(G.blocs||[]).some(b=>b.deduit || b.type==="relation");
    const slotOuvert=F=>{ const s=F.slots&&F.slots[0];
      return s==="*" || (Array.isArray(s) && s.some(d=>dims.includes(d))); };
    for(const [f,F] of Object.entries(G.formes)){
      if(G.blocs.some(b=>b.forme===f)) continue;        // déclarée par une liaison
      if(!F.deduction || (F.arite||2)!==2)
        add("avert",`Forme « ${f} » sans bloc`,
          "Aucune liaison ne la produit, et elle ne peut pas se déduire — une forme déduite porte « deduction » et une arité 2. Elle est indicible.",{});
      else if(!parDeduction)
        add("avert",`Forme « ${f} » déductible, mais rien ne la déduit`,
          "Elle porte « deduction », mais aucun bloc de la grammaire ne la fait choisir (`relation`) ni déduire (`deduit`) : rien ne la produirait.",{});
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
      /* LE PASSAGE D'UN ARTICLE (§11, passe F) : ni dimension ni valeur, sur une
         règle seulement ; son nom est celui de son résultat de recherche (passe J). */
      if(e.article){
        if(!estRegle(p)) add("erreur",`Passage d'article hors d'une règle : ${p.court}·${joli(eid)}`,
          "Seul le texte d'un article s'invoque : sur une autre pièce, ce passage ne fonderait rien et ne se comparerait à rien. Retire « article », ou déplace-le.",{champ:[pid,eid]});
        if(e.dim!==undefined || e.valeur!==undefined) add("avert",`Passage d'article avec une dimension ou une valeur : ${p.court}·${joli(eid)}`,
          "Le moteur ne le voit jamais : une dimension ou une valeur n'y servirait à rien et laisserait croire qu'il se compare (§11).",{champ:[pid,eid]});
      }
      else if(!e.dim) add("erreur",`Empan sans dimension : ${p.court}·${joli(eid)}`,
        "Un empan sans dimension n'est comparable à rien.",{champ:[pid,eid]});
      else if(!dims.includes(e.dim)) add("erreur",`Dimension inconnue « ${e.dim} » : ${p.court}·${joli(eid)}`,
        `« ${e.dim} » n'est pas dans la liste « dimensions » — le jeu ne saurait pas la colorer.`,{champ:[pid,eid]});
      if(!String(e.texte||"").trim()) add("erreur",`Empan sans texte : ${p.court}·${joli(eid)}`,
        "L'empan est ce que le joueur LIT — pas seulement une valeur.",{champ:[pid,eid]});
      if(!String(e.nom||"").trim()) add("avert",`Empan sans nom : ${p.court}·${joli(eid)}`,
        e.article
          ? "Sans nom, son résultat de recherche porterait tout son texte. Donne-lui son nom neutre : « Article 7 » (§4.5)."
          : "Sans nom, c'est la citation entière qui entre dans les phrases composées — elles se lisent alors comme un empilement, pas comme une pensée (§4.1). Donne un groupe nominal : « l'heure des éclats de voix ».",{champ:[pid,eid]});
      if(!marques.includes(eid)) add("erreur",`Empan non marqué dans le texte : ${p.court}·${joli(eid)}`,
        `Ajoute {{${eid}}} dans le texte de la pièce, là où l'empan se lit — sinon il est inatteignable (règle de surlignage, §4.3).`,{champ:[pid,eid]});
      else if(marques.filter(x=>x===eid).length>1)
        add("avert",`Empan marqué deux fois : ${p.court}·${joli(eid)}`,"Le même empan apparaît à deux endroits du texte — un seul marqueur suffit.",{champ:[pid,eid]});
    }
    for(const mk of marques) if(!(p.empans||{})[mk])
      add("erreur",`Marqueur orphelin {{${mk}}} dans « ${p.court} »`,"Le texte appelle un empan qui n'existe pas : il s'afficherait tel quel.",{piece:pid});
    const hors=txt.replace(/\{\{[A-Za-z0-9_]+\}\}/g," ");
    const susp=[...hors.matchAll(/\b\d{1,2}\s?h\s?\d{2}\b|\b\d{2}:\d{2}\b/g)].map(x=>x[0]);
    if(susp.length) add("avert",`Valeur non marquée dans « ${p.court} » : ${susp.join(", ")}`,
      "Tout empan portant une valeur d'une des dimensions doit être marqué et cliquable — sinon l'interface trie à la place du joueur (§4.3).",{piece:pid});
    diagMiseEnPage(pid,p,txt,add);
  }

  /* ---- les liens ---- */
  LI.forEach((L,i)=>{
    if(!formeDe(L.forme))
      return add("erreur",`Lien ${i} : forme « ${L.forme} » inconnue`,"Cette forme n'est pas déclarée dans la grammaire.",{edge:i});
    const f=formeDe(L.forme);
    if((L.termes||[]).length!==(f.arite||2))
      add("erreur",`Lien ${i} : ${(L.termes||[]).length} terme(s) pour une forme d'arité ${f.arite}`,"",{edge:i});
    let cite_article=false;
    for(const k of feuillesLien(L)){
      const [pid,eid]=deK(k);
      if(!empanExiste(pid,eid))
        add("erreur",`Lien ${i} pointe vers un empan inexistant (${k})`,"Empan ou pièce supprimé ?",{edge:i});
      else if(estPassageArticle(pid,eid)){
        cite_article=true;
        add("erreur",`Lien ${i} prend un passage d'article pour terme (${k})`,
          "Un article fonde, il ne se compare ni ne se cite (§11) : le moteur ne le voit pas, et cette phrase ne se formerait jamais.",{edge:i});
      }
      else if(!livrees.has(pid))
        add("erreur",`Lien ${i} injouable : « ${courtDe(pid)} » n'est livrée par aucune remise`,
          "Le joueur ne peut surligner que dans les pièces reçues.",{edge:i});
    }
    /* UNE RELATION FAUSSE (passe G) : la forme du lien n'est pas la vraie — celle
       que déclare le dossier (passe N), ou que donnent les valeurs. Le joueur
       pourrait la choisir, mais l'avocat la refuserait, et ce lien ne se
       reconnaîtrait jamais en vrai. */
    if(m && !cite_article && lienSense(L) && m.fausse({forme:L.forme,termes:L.termes||[]}))
      add("erreur",`Lien ${i} : relation fausse sur ${parLeDossier(L)?"le dossier":"les valeurs"}`,
        parLeDossier(L)
          ? `« ${labelLien(L)} » : le dossier dit l'autre relation — la paire ${m.discorde(...comparaisonDu(L).termes)?"est":"n'est pas"} déclarée discordante (§4.2). Change la forme du lien, ou bascule la paire dans l'onglet Verdicts.`
          : `« ${labelLien(L)} » : les valeurs de ces empans disent l'autre relation (§4.5). Change la forme du lien, ou les valeurs.`,{edge:i});
    /* LE LIEN NU (passe N, §4.5) : une comparaison sans article établit un fait,
       elle ne se plaide pas — une réplique, jamais un tag ni le faux vice. */
    if((f.arite||2)===2 && (L.tag || L.faux))
      add("erreur",`Lien ${i} : un lien nu qui se plaiderait`,
        `« ${labelLien(L)} » n'a pas d'article, et porte ${L.tag?"un tag":"le faux vice"} : il entrerait en PLAIDOIRIE sans fondement. Rien n'est plaidé qui ne soit fondé (§4.5) — conclus-le par un article, ou retire ${L.tag?"le tag":"« faux vice »"}.`,{edge:i});
    /* LE SAVOIR (passe N, §4.7) : un lien nu, qu'Auber refuse d'entendre (§5). */
    if(L.savoir){
      if(L.vice||L.faux) add("erreur",`Lien ${i} : savoir ET ${L.vice?"vice":"faux vice"}`,
        "Le savoir établit la culpabilité ; il ne fonde rien et ne se plaide pas (§4.7). Décoche l'un des deux.",{edge:i});
      if((f.arite||2)!==2) add("avert",`Lien ${i} : un savoir sous un article`,
        "Il se lèverait encore, mais la phrase se plaiderait : le savoir établit un fait, il ne se fonde pas (§4.5, §4.7). Laisse-le nu.",{edge:i});
      if(!String(L.rep||"").trim()) add("avert",`Lien ${i} : un savoir sans réplique`,
        "Envoyé, il recevrait « Et donc ? » : Maître Auber doit refuser de l'entendre (§5). Écris sa réplique.",{edge:i});
    }
    if(m && !cite_article && !lienSense(L))
      add("erreur",`Lien ${i} insensé : ${m.valider({forme:L.forme,termes:L.termes||[]})}`,
        `« ${labelLien(L)} » serait refusée à la composition — le joueur ne pourrait jamais la former.`,{edge:i});
    if(L.vice&&L.faux)
      add("erreur",`Lien ${i} à la fois vice ET faux vice`,"Un lien ne peut pas être les deux — décoche l'un.",{edge:i});
    if(L.conclusion && (f.arite||2)!==1)
      add("avert",`Lien ${i} marqué « conclusion » sans être une qualification`,
        "Seule une liaison d'arité 1 (sur une note close) conclut — c'est elle qui porte la base légale.",{edge:i});
    /* PIÈGE PAYÉ : cette ligne demandait `r.attend` et répondait « non » pour TOUS
       les tags — six informations mensongères par ouverture. Le tag vit sur
       l'ATTENTE (R9) : passer par `attentesDeRemise`. */
    if(L.tag && !(CONTENU.remises||[]).some(r=>attentesDeRemise(r).some(a=>a.attend===L.tag)))
      add("info",`Lien ${i} : tag « ${L.tag} » attendu par aucune remise`,"Le versement de cette phrase ne fera avancer aucune session.",{edge:i});
  });
  for(let i=0;i<LI.length;i++) for(let j=i+1;j<LI.length;j++)
    if(memeLien(LI[i],LI[j]))
      add("avert",`Liens dupliqués (${i} et ${j})`,`« ${labelLien(LI[i])} » apparaît deux fois.`,{edge:j});
  if(LI.some(L=>L.savoir) && !Object.values(CONTENU.fins||{}).some(x=>String((x||{}).variante_sait||"").trim()))
    add("info","Le savoir ne change aucune fin","Un lien lève « sait », mais aucune fin n'a de « variante_sait » : savoir ne se lirait nulle part (§2).",{});

  /* ---- les discordances (passe N, §4.2, §11) ---- le dossier déclare ce qui ne
     concorde pas ; tout le reste concorde. Une paire qui ne désigne plus deux
     passages de même dimension ne serait jamais posée. */
  const DI=CONTENU.discordances;
  if(DI!==undefined && !Array.isArray(DI))
    add("erreur","Clé « discordances » mal formée","Elle doit être une liste de paires de passages, « pid.eid ».",{});
  else {
    const vues=new Set();
    (DI||[]).forEach((p,i)=>{
      if(!Array.isArray(p) || p.length!==2 || p.some(k=>typeof k!=="string"))
        return add("erreur",`Discordance ${i} mal formée`,"Une discordance est une paire de deux passages, « pid.eid ».",{});
      const [a,b]=p, ea=empanDe(...deK(a)), eb=empanDe(...deK(b));
      if(!ea || !eb)
        return add("erreur",`Discordance ${i} : passage inconnu (${!ea?a:b})`,"Passage supprimé, ou renommé à la main ? La paire ne désigne plus rien.",{});
      if(ea.article || eb.article)
        return add("erreur",`Discordance ${i} : un texte d'article`,"Un article ne se compare à rien (§11) : il ne concorde ni ne discorde.",{});
      if(a===b) return add("erreur",`Discordance ${i} : le même passage deux fois`,"Un passage ne se compare pas à lui-même.",{});
      if(ea.dim!==eb.dim)
        add("erreur",`Discordance ${i} : deux dimensions (« ${ea.dim} », « ${eb.dim} »)`,"Deux passages de dimensions différentes ne se comparent pas : la paire ne serait jamais posée (§4.2).",{});
      const cle=[a,b].sort().join("|");
      if(vues.has(cle)) add("avert",`Discordance ${i} déclarée deux fois`,`${cflabel(a)} et ${cflabel(b)}.`,{});
      vues.add(cle);
    });
  }

  /* ---- les articles : des TEXTES qu'on invoque, jamais des porteurs de valeur ----
     L'invariant du §4.5 rendu vérifiable ; `porte` est ce que la recherche lit
     (passe J). Un article a UN passage — son texte, qu'on clique pour l'invoquer —
     et aucun empan qui se compare. La base, c'est toutes les règles du contenu :
     livrées ou non, chacune doit dire ce qu'elle régit. */
  const liaisonsArticle=((CONTENU.grammaire||{}).blocs||[]).filter(b=>b.type==="liaison" && b.imbrique && b.piece);
  for(const [pid,p] of Object.entries(P)){
    if(!estRegle(p)) continue;
    const es=Object.values(p.empans||{});
    const n=es.filter(e=>!e.article).length, nArt=es.length-n;
    if(n) add("erreur",`La règle « ${p.court} » porte ${n} empan(s) qui se compare(nt)`,
      "Un article est un texte qu'on invoque, pas un fait qu'on compare : déplace cet empan dans la pièce qui l'énonce (le rapport qui cite le seuil, par exemple).",{piece:pid});
    if(!nArt && liaisonsArticle.some(b=>b.piece===pid))
      add("erreur",`La règle « ${p.court} » n'a pas de passage d'article`,
        "Sa liaison se prend d'un clic sur ce passage (§4.5) : sans lui, l'article ne s'invoquerait jamais. Ajoute un empan « article » sur son texte.",{piece:pid});
    else if(nArt>1)
      add("avert",`La règle « ${p.court} » a ${nArt} passages d'article`,
        "Un seul suffit — le texte entier : en découper un morceau, c'est désigner la clause qui compte (§4.5).",{piece:pid});
    const porte=p.porte;
    if(!Array.isArray(porte) || !porte.length)
      add("avert",`La règle « ${p.court} » n'annonce pas ce qu'elle régit`,
        "Sans `porte`, le joueur ne sait pas quel genre de relation cet article gouverne. Renseigne les dimensions concernées.",{piece:pid});
    else for(const d of porte) if(!dims.includes(d))
      add("erreur",`La règle « ${p.court} » régit une dimension inconnue : « ${d} »`,
        `Les dimensions déclarées sont : ${dims.join(", ")}.`,{piece:pid});
  }
  /* LA RECHERCHE (passe J, §4.5) : toute paire a ses résultats — trois articles par
     dimension que l'affaire compare, le bon et deux leurres du même champ. La base
     vient de la RÈGLE même, appelée (§15). */
  const baseDe = d => { const R=RG(); return R && R.baseRecherche ? R.baseRecherche(d) : []; };
  for(const d of dims){
    if(empansPlats().filter(e=>livrees.has(e.pid) && e.dim===d).length<2) continue;
    const n=baseDe(d).length;
    if(n<3) add("avert",`Recherche : ${n} article(s) pour « ${d} »`,
      "Deux passages de cette dimension se comparent : la recherche doit rendre trois articles — le bon, et deux leurres du même champ, sinon le choix se fait sans lire (§4.5, §8). Ajoute une règle dont « porte » couvre cette dimension.",{});
  }
  /* Un lien qui fonde sur un article que la recherche, sur SA paire, ne rend pas
     ne se formera que si l'article est déjà au dossier. */
  const blocArticleDe = L => ((CONTENU.grammaire||{}).blocs||[]).find(b=>b.forme===L.forme && b.piece && b.imbrique);
  const trouvable = L => {
    const b=blocArticleDe(L); if(!b) return true;
    const sous=(L.termes||[])[0], k=sous && typeof sous==="object" ? feuillesLien(sous)[0] : null;
    const e=k && empanDe(...deK(k));
    return !e || baseDe(e.dim).includes(b.piece);
  };

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
  /* LA DISCORDANCE BANALE (§4.4, passe N) : un vice qui ne concorde pas se voit
     si sa dimension n'en compte pas d'autres — il en faut deux innocentes à côté.
     Un vice qui concorde se cache de lui-même : tout le reste concorde. */
  for(const l of viceLiens){
    const c=comparaisonDu(l), t=c.termes||[];
    if(((formeDe(c.forme)||{}).deduction)!=="discordance" || t.length!==2 || t.some(x=>typeof x!=="string")) continue;
    const d=dimEmpan(...deK(t[0])), cv=[...t].sort().join("|");
    const banales=(Array.isArray(CONTENU.discordances)?CONTENU.discordances:[]).filter(p=>Array.isArray(p) && p.length===2
      && [...p].sort().join("|")!==cv && dimEmpan(...deK(p[0]))===d).length;
    if(banales<2) add("avert",`Dimension « ${d} » porte un vice qui ne concorde pas, avec ${banales} discordance(s) banale(s)`,
      "Il en faut au moins deux innocentes à côté, sinon la première trouvée est la réponse (§4.4) — un remplaçant, une délivrance un samedi.",{edge:LI.indexOf(l)});
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

  /* ---- LE DOUBLON BANAL (§4.4) ---- si toutes les valeurs d'une dimension sont
     uniques, le premier doublon EST la réponse : celle qui porte le vice doit
     compter au moins deux doublons réguliers en plus de l'irrégulier. */
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
  const formeComposable=(forme,dispo)=>{
    const G=CONTENU.grammaire||{}, fins=new Set(G.finaux||[]);
    const vus=new Set(), file=[[G.depart,false]];
    while(file.length){
      const [e,vue]=file.shift();
      const cle=e+"|"+vue; if(vus.has(cle)) continue; vus.add(cle);
      if(vue && fins.has(e)) return true;
      for(const b of (G.blocs||[])){
        if(b.de!==e) continue;
        // Une liaison d'article ne se livre pas : elle se cherche (passe J).
        if(b.piece && !dispo.has(b.piece) && !(b.type==="liaison" && b.imbrique)) continue;
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
    const attentes=attentesDeRemise(r);
    if(!attentes.length)
      add("erreur",`Remise ${i+1} sans attente`,
        i<R.length-1
          ? `La remise ${i+2} ne partirait jamais : c'est le versement d'une phrase portant ce tag qui ferme la session.`
          : "La clôture ne s'ouvrirait jamais — la dernière remise doit elle aussi attendre quelque chose.",{});
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
      const servables=(CONTENU.liens||[]).filter(L=>L.tag===a.attend && formeComposable(L.forme,dispo));
      if(!servables.length)
        add("erreur",`Remise ${i+1}${ou} attend « ${a.attend} », mais de quoi l'écrire n'est pas encore livré`,
          "Toutes les phrases qui serviraient cette attente passent par un bloc dont la pièce n'a pas encore été remise : la session est inclôturable. Livre la pièce plus tôt, ou déplace l'attente.",{});
      else if(!servables.some(trouvable))
        add("erreur",`Remise ${i+1}${ou} attend « ${a.attend} », mais la recherche ne rend pas son article`,
          "Chaque phrase qui servirait cette attente fonde sur un article que la recherche, sur sa paire, ne rend pas (passe J) : la session est inclôturable. Ajoute la dimension de la paire à son « porte », ou déclare l'article plus haut — la recherche prend les trois premiers.",{});
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
    for(const t of (a && Array.isArray(a.repond) ? a.repond : []))
      if(!LI.some(L=>L.tag===t))
        add("avert",`Affirmation ${i+1} : « ${t} » ne répond à rien`,
          "Aucun lien ne porte ce tag : l'avocat dirait de toute phrase qu'elle est à côté (§4.6).",{});
  });
  if(((CONTENU.repetition||{}).affirmations||[]).some(a=>a && Array.isArray(a.repond)) && !String((CONTENU.avocat||{}).rep_a_cote||"").trim())
    add("avert","« rep_a_cote » absent","Une affirmation trie ce qui lui répond : sans cette réplique, l'avocat refuserait par « … ».",{});

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
      if(empanRelie(pid,eid) || estPassageArticle(pid,eid)) continue;   // un article ne se lie pas : il fonde
      if(estBruit(pid,eid)) add("info",`Bruit assumé : ${p.court}·${joli(eid)}`,"Marqué comme leurre décoratif — ignoré.",{champ:[pid,eid]});
      else add("avert",`Empan inerte : ${p.court}·${joli(eid)}`,
        "Dans aucun lien. C'est normal pour du bruit (et il en faut) — marque-le pour faire taire cet avertissement.",{champ:[pid,eid]});
    }
  // Une règle non livrée est dans la base de la recherche (passe J) : rien à dire.
  for(const [pid,p] of Object.entries(P))
    if(!livrees.has(pid) && !estRegle(p)) add("avert",`Pièce jamais livrée : ${p.court}`,"Aucune remise ne la transmet (ajoute-la à une remise dans l'onglet Étapes).",{piece:pid});

  return out;
}
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
function pointer(ref){
  reinitSelection();
  if(!ref) return render();
  if(ref.edge!=null){ selEdge=ref.edge; }
  /* PIÈGE PAYÉ : cette ligne dépliait `l.a`/`l.b`, du SCHÉMA 2, et levait une
     TypeError sur le seul chemin qui l'appelle. `feuillesLien` rend les feuilles
     quel que soit l'emboîtement. */
  if(ref.edges){ ref.edges.forEach(i=>{ const l=CONTENU.liens[i]; if(!l) return;
    for(const k of feuillesLien(l)) flagged.add(k); }); }
  if(ref.champ){ flagged.add(K(ref.champ[0],ref.champ[1])); scrollVers(ref.champ[0]); }
  if(ref.piece){ scrollVers(ref.piece); }
  render();
}
function scrollVers(pid){ const pos=CONTENU._pos[pid], st=$("stage");
  if(pos && typeof st.scrollTo==="function") st.scrollTo({left:Math.max(0,pos.x-120),top:Math.max(0,pos.y-90),behavior:"smooth"}); }


/* La comparaison d'un lien : son terme emboîté sous un article, ou le lien nu
   lui-même (passe N). Et si sa vérité se lit au DOSSIER plutôt qu'aux valeurs. */
function comparaisonDu(L){
  const t0=(L.termes||[])[0];
  return (t0 && typeof t0==="object") ? t0 : {forme:L.forme, termes:L.termes||[]};
}
function parLeDossier(L){
  const d=(formeDe(comparaisonDu(L).forme)||{}).deduction;
  return d==="concordance" || d==="discordance";
}
/* LA MISE EN PAGE (passe P, §4.3, §11) — lue sur `miseEnPage`, APPELÉE, jamais
   recopiée (§15). Ce qui se détache ne se prend pas : un passage dans un titre,
   un en-tête, une signature ou un tampon, la forme le désignerait. */
const MEP_DETACHE = { titre:"un titre", entete:"un en-tête", signature:"une signature", tampon:"un tampon" };
function diagMiseEnPage(pid,p,txt,add){
  const api=window.MoteurGrammaire||{};
  if(p.gabarit!=null && !(api.GABARITS||[]).includes(p.gabarit))
    add("avert",`Gabarit inconnu dans « ${p.court} » : ${p.gabarit}`,
      `La pièce s'imprimera sur le papier, sans feuille. Les gabarits : ${(api.GABARITS||[]).join(", ")}.`,{piece:pid});
  if(!api.miseEnPage) return;
  const marquesDe = l => [...String(l).matchAll(/\{\{([A-Za-z0-9_]+)\}\}/g)].map(x=>x[1]);
  for(const b of api.miseEnPage(txt)){
    const lignes = b.type==="tableau" ? [...(b.entete||[]), ...b.lignes.flat()] : (b.lignes||[]);
    if(MEP_DETACHE[b.type]) for(const l of lignes) for(const mk of marquesDe(l))
      add("erreur",`Passage dans ${MEP_DETACHE[b.type]} : ${p.court}·${joli(mk)}`,
        "Ce qui se détache ne se prend pas : la forme désignerait le passage (§4.3). Mets-le dans le corps du document.",{champ:[pid,mk]});
    for(const l of lignes) if(/\*\*[^*]*\{\{[A-Za-z0-9_]+\}\}[^*]*\*\*/.test(l))
      add("erreur",`Un gras couvre un passage : ${p.court}`,
        "Le gras se détache, et ne couvre jamais un passage (§4.3) : il s'afficherait tel quel, astérisques comprises.",{piece:pid});
  }
}

# TODO — suites des retours de playtest (4 octobre)

*Ce qui reste à traiter dans les retours du 4 octobre : celui de Colas (et la réponse de l'auteur), puis
les deux de Jean — des préconisations, puis un rapport sur l'intro et le tuto. Le détail de ce qui est fait
vit au §1 et au §3 de `docs/PASSATION.md` ; ici, seulement ce qui ne l'est pas.*

*Deux marques. **⚖** — la préconisation va contre un arbitrage écrit : elle se tranche avec l'auteur,
document d'abord (CLAUDE.md, « la méthode »). **(contenu seul)** — se règle dans `app/content.js`,
sans une ligne de code.*

## Second rapport de Jean — l'intro et le tuto, lu de près

*Périmètre : la session 1 seule, jusqu'à la remise des cinq pièces, dans Chromium à 1280×800. Non
testés : le mobile, « recommencer », la reprise après rechargement. Aucun bug bloquant. Chaque point
a été vérifié dans le code avant d'être noté ici.*

**Lecture critique, en trois tas.** (1) **Trois défauts viennent de nos propres passes du 4 octobre**
— la bulle posée *sous* sa zone, le Contexte aux deux tiers, le marquage au survol — et passent avant
tout le reste. (2) Une part de *« le jeu mâche le travail »* vise ce que la session 1 **est** : une
calibration guidée, où l'avocat pose des questions dont il a la réponse (§3). Mais **c'est le
deuxième joueur de suite à le dire** : la question du §3 PASSATION, *« la calibration tient-elle ? »*,
a sa réponse — elle se lit comme une main tenue, pas comme un examen. (3) **La session 2, le vrai
dossier, n'a toujours été jouée par personne d'extérieur** : c'est elle qui dira si la déduction
manque vraiment, ou seulement dans le tutoriel.

### Nos régressions — à reprendre d'abord

*Faites le 4 octobre, septième passe (§1 PASSATION) : bulle au moindre recouvrement, page à 1200 px et
fil à 360 px minimum Contexte ouvert, composeur plafonné à 26 vh, survol franc. Vues dans Chromium.*

- [x] **La bulle du tuto cache le texte utile** — l'aide du Contexte, la question rappelée dans
      *« Ta réponse »*, la voix (*« Sur quel article t'appuies-tu… »*), la fin de la phrase composée.
      Vu aussi sur nos captures (*citer · 3/4*) : `placerTuto` prend le **premier côté où elle tient**
      (droite, dessous, dessus, gauche), et *dessous* tombe souvent sur le composeur. Passer à un choix
      qui **évite des zones protégées** — le rappel de la question, `.phrase`, la voix, l'aide du
      Contexte, le dernier message — en mesurant le recouvrement de chaque côté (§4.8).
- [x] **⚖ La Discussion tombe à 5-6 mots par ligne** Contexte ouvert : les deux tiers sont pris dans un
      `.wrap` plafonné à 1000 px, et il reste ~314 px au fil. Leviers : élargir `.wrap` quand le
      Contexte est ouvert (à 1280, ~394 px pour le fil), ou garder un plancher au fil
      (`minmax(380px,1fr)`). Le partage aux deux tiers est un choix de l'auteur (§4.6).
- [x] **La pièce se coupe quand la réponse s'allonge** (*« par mes soins »* disparaît) : au-dessus du
      seuil, `#composeur` n'a que son plafond général (46 vh) et sa rangée mange celle du Contexte.
      Leviers : un plafond plus bas Contexte ouvert, ou le composeur **sous la conversation, dans la
      colonne de gauche** — le Contexte garderait toute la hauteur.
- [x] **Le survol ne distingue pas assez le passage visé.** La bordure au repos, à peine visible, est
      voulue (l'auteur : *« suggérer »*) ; mais le survol doit être **franc** — fond plus soutenu, trait
      plus épais, bordure à la couleur de la dimension (§4.3).

### Petites incohérences — sans arbitrage

*Faites dans la même passe, chacune tenue par un contrôle de `test_parcours`.*

- [x] **« 3 pièces disponibles » contre « 2 pièces, 1 règle »** : le bouton du message compte l'article
      comme une pièce. Dire *« 2 pièces et 1 règle disponibles »*, avec les mots de l'index
      (`R.estRegle`).
- [x] **Le compteur du tuto reste deux temps sur le même rang** : *citer · 1/4* couvre le bouton de
      pièces puis l'index, *mettre en relation · 2/3* le dossier puis les propositions. Compter chaque
      consigne (*citer* en 5 — ce sont les cinq clics que Jean compte) et refaire le tableau du §4.8.
- [x] **Deux « × Échap » empilés** (le Contexte, la pièce) sans qu'on sache lequel ferme quoi. Échap
      replie d'abord la pièce : n'afficher `Échap` que sur la croix qu'il déclenche **maintenant**, et
      nommer à l'écran *« replier la pièce »* / *« fermer le Contexte »*. Rejoint *« la croix d'un
      panneau et celle d'une fiche »* (§3 PASSATION).
- [x] **La voix du composeur affirme la trouvaille** — relevé en vérifiant, pas par Jean : *« Sur quel
      article t'appuies-tu pour montrer qu'il y a une irrégularité ? »* dit qu'il y en a une. Le chrome
      nomme le geste, jamais la trouvaille (§4.8) : *« Sur quel article t'appuies-tu ? »*.

### Trop de clics

- [ ] **⚖ Garder le Contexte (et la dernière pièce) ouverts après un envoi.** Tout se referme à chaque
      envoi, erreur comprise, et on refait le trajet. La règle *« la phrase partie, on revient lire
      l'avocat »* (§4.6) date de la mise en page empilée ; **au-dessus du seuil, le Contexte ne cache
      plus la conversation**. Proposition : au-dessus du seuil, ne plus refermer ; en dessous, ne
      refermer que si l'envoi a servi une attente.
- [ ] **⚖ « Citer directement depuis la pièce »** fondrait *retenir* et *prendre* (deux verbes, deux
      gestes, §4.6), et le Contexte est le clavier du composeur. Piste qui garde les deux : un passage
      retenu **pendant** qu'une phrase en attend un y entre aussitôt.

### La déduction — ce que Jean confirme, et ce qu'il ajoute

- [ ] **⚖ La relation au choix — redemandée**, cette fois avec *« contredit »*. C'est le cœur : le
      *aha* (*les cris ne peuvent pas être ceux du crime*) reste **dit par Auber** — après la
      composition désormais, mais par lui —, parce que la phrase du joueur ne sait dire que
      *« précède »*. *« Contredit »* n'est pas une relation qu'on **calcule** ; c'est une qualification.
      Piste à écrire au §4.5 : la déduction pose le fait (*précède*), le joueur choisit ce qu'il en tire
      (*contredit*, *confirme*, *sans rapport*). Renverse *désigner, pas déclarer* : à arbitrer.
- [ ] **Un seul article en session 1** (contenu) : un second, leurre, ferait de *« sous quel article »*
      un choix. Touche le tutoriel (*mettre en relation · 2/3*) et les suites qui dérivent du contenu.
- [ ] **La 3ᵉ question fait la moitié du travail** (contenu seul) : *« mets-les face à face, les deux
      heures — et dis-moi sous quel article ça tombe »* désigne les deux passages et annonce un article.
      Calibration assumée (§3) ; à desserrer si l'on veut que la session 1 se sente comme un examen.
- [ ] **Passages pré-découpés et étiquetés, rangés par dimension** : c'est la mécanique (§4.1) et la
      grammaire en a besoin (le `nom` d'empan, §8.8). Levier qui ne la défait pas : **plus de passages
      inertes par pièce** (§4.4), pour que retenir demande un jugement.

### Le coût de l'erreur et le retour d'erreur

- [ ] **Un retour d'erreur plus précis** : *« je te demande une heure, pas un nombre »* — la règle
      comparerait la dimension envoyée à celle attendue, le contenu dirait la phrase. Tension avec son
      premier rapport (*des refus moins généreux*) : la question dit déjà *« à quelle heure »*, et la
      dimension n'est pas la trouvaille. À réserver au tutoriel ?
- [ ] **Le coût de l'erreur, « pour le vrai dossier »** : Jean le borne lui-même aux remises qui suivent
      le tutoriel — précise le ⚖ *« Un prix à payer »* plus bas.

### Les lecteurs attentifs

- [ ] **« Deux véhicules » / « deux équipages »** : c'est le doublon banal, inerte **par construction**
      (§4.4, §8.3 — s'il servait à quelque chose, la Fin 3 deviendrait une frustration). Ne pas en faire
      un moyen ; mais **récompenser la lecture** par une réplique propre à cette comparaison, sans tag
      (contenu seul) : *« Deux et deux, oui. Ça concorde — et ça ne prouve rien. »*

### Répondu, ou à garder

- **« Recommencer » demande-t-il confirmation ?** Oui : deux temps, *« Oui, tout effacer »* et
  *« annuler »*. Reste sa place, juste sous la réponse : un clic de travers y coûte peu, mais coûte.
- **À garder** : le thème et la mécanique ne font qu'un (citer plutôt qu'inventer, la police machine
  de ce qu'on envoie) ; la voix d'Auber ; le tutoriel progressif, *« je sais faire »*, la bulle qui se
  replie en « ? » ; le piège de la première question (21h52, l'appel, contre 22h04, l'arrivée), qui
  apprend à lire ; l'onglet Plaidoirie, qui rend la progression concrète.

### Ordre proposé

1. ~~Nos régressions et les petites incohérences~~ — faites.
2. Le Contexte qui reste ouvert après un envoi, au-dessus du seuil.
3. **Faire jouer la session 2 par un joueur neuf** — avant de toucher à la grammaire.
4. Les ⚖ de la déduction et du coût, document d'abord.

## Premier retour de Jean — les préconisations, dans l'ordre du testeur

*Non testés : le mobile, la croix ×, « recommencer », la fin de la session 2. Jean dit « affaire
1 / affaire 2 » pour les sessions 1 et 2, « fiches » ou « notes » pour les passages retenus, « bulle »
pour le bandeau du tutoriel. Ce qui est fait est détaillé au §1 de `docs/PASSATION.md`.*

### 1. Rendre la déduction au joueur — le plus important

- [x] **Faire taire l'avocat avant la composition** — par le contenu seul : `q_voix` prend acte de
      l'heure, et le constat passe dans la réplique de `temoin`, après la composition (§4.8).
- [x] **Rendre les refus moins généreux** — les refus par article renvoient à la lecture (*« Le délai,
      sous l'article 7 ? Relis ce qu'il exige. »*) au lieu de résumer le texte (§4.8).
- [ ] **⚖ Laisser le joueur se tromper : garde-fous réservés au tutoriel.** Deux garde-fous visés : les
      fiches d'une autre dimension **assombries** pendant une comparaison (`.horsdim`, `renderRetenus`)
      et le **refus avant l'envoi** (*« ces deux-là ne se comparent pas »*, `poserBloc` des règles).
      Contre le §4.5 : *« seules les erreurs de catégorie sont refusées »*, et l'écran s'assombrit *par
      dimension* pour laisser deviner. Lever le refus suppose qu'une comparaison sans forme puisse
      partir et que l'avocat y réponde (`rep_sans_rapport`) : moteur et règles, pas seulement l'écran.
- [ ] **⚖ Proposer deux ou trois relations au choix, dont des fausses** (redemandé dans son second
      rapport, voir plus haut), au lieu de *« précède »* ou
      *« sont une seule et même personne »* rédigés seuls. Renverse le principe fondateur du §4.5,
      *désigner, pas déclarer* : la relation se **déduit** des valeurs (`deduire`, moteur), *« ce qui
      les lie est un fait, pas une thèse »*. Le plus gros chantier de la liste (grammaire, patrons,
      liens, atelier, suites) : à écrire au §4.5 avant tout.
- [ ] **L'incohérence appel + arrivée** (*« ne se comparent pas »*) — **non reproduite** : sur un jeu neuf
      comme en session 2, l'heure de l'appel et l'heure d'arrivée se composent dans les deux ordres
      (*« … précède … »*). Retrouver le chemin exact de Jean (session, ordre des clics, phrase déjà
      entamée ?) avant de corriger quoi que ce soit.

### 2. Donner un coût à l'erreur

- [ ] **⚖ Un prix à payer.** Sans pénalité, on essaie toutes les combinaisons. Pistes de Jean : une
      jauge de patience de Maître Auber, ou un nombre d'envois limité **hors tutoriel** — il le redit
      dans son second rapport, *« pour le vrai dossier »*. À écrire d'abord :
      une jauge visible rendrait l'enjeu **calculable** (§8.4, le trombone), et le §8.6 donne au joueur
      *le droit d'être perdu*. L'escalade des `rep_hors_sujet` / `rep_sans_rapport` est déjà une
      patience, en contenu et sans conséquence : c'est peut-être d'elle qu'il faut partir.
- [x] **Ne pas récompenser une mauvaise réponse** — arbitré par l'auteur : **la remise 1, celle du
      tutoriel, se sert dans l'ordre** (§3) ; les suivantes gardent l'anticipation, *« on élargira »*.
      Une réponse à une question à venir y est hors sujet, n'entre pas en Plaidoirie et reste à
      envoyer (`horsOrdre`).
- [x] **Revoir les réactions spontanées** — celle du labo pousse toujours vers le chiffre (*« Ça n'a
      jamais été qu'une probabilité »*, le faux vice en vit, §6) sans faire la comparaison à la place
      du joueur ; `q_equipages` ne disqualifie plus les chiffres.

### 3. L'ergonomie du Contexte

- [x] **Libérer la place de lecture** — **l'index se replie en une ligne** (*« Le dossier — 5 pièces,
      3 règles ▾ déplier »*) : à tout moment par sa bascule, d'office pièce ouverte ; **la pièce prend
      la hauteur de son texte (plafond 70 %), les retenus tout le reste** ; **le Contexte prend les deux tiers de la largeur**
      au-dessus du seuil ; **les pièces passent en 15 px** au lieu de 17 (§4.6). Mesuré dans Chromium à 1280×800 : en session 2, l'index passe de 282 à 40 px et le texte
      de la pièce de 121 à 226 px — le rapport du labo se lit en entier ; en session 1, le PV montre
      7 lignes au lieu de 2. Les retenus ne sont pas repliés : c'est le clavier du composeur, et
      l'ancre de *citer · 3/4*.
- [ ] **Sur un téléphone, la pièce reste à l'étroit** : à 390×800 le panneau entier ne fait que 353 px,
      et la pièce n'y montre que deux lignes. *Arbitré par l'auteur : le Contexte y reste entre la
      conversation et le composeur* — ni retenus repliés, ni pièce en pleine hauteur. À juger sur un
      vrai téléphone.
- [ ] **⚖ Ranger les affaires closes.** Les fiches de la session 1 restent en tête de liste : les archiver
      ou les replier. Le §4.6 promet que le Contexte ne **juge** rien — mais replier par session ne juge
      aucun passage, c'est un fait de remise. Rejoint *« aucune barrière entre les affaires »* (§3
      PASSATION).
- [ ] **Rendre l'état de la réponse visible** : marquer dans le Contexte les fiches **déjà prises** dans la
      phrase, et **dire** pourquoi une troisième est refusée. Aujourd'hui le bouton est seulement
      `disabled`, et l'explication vit dans un `title` (*« ta phrase n'attend pas un passage »*) que ni
      le toucher ni le clavier n'atteignent (§4.10).
- [x] **Soulignement au survol ou au clic** (demande de l'auteur, §4.3) : le trait et la couleur d'un
      passage ne se montrent que quand on passe dessus ou qu'on l'atteint au clavier (`:focus-visible`),
      et restent une fois retenu — au toucher, c'est le clic qui les pose. **Une bordure à peine
      visible, neutre et arrondie** suggère, elle, qu'un passage se clique : la même pour tous. Les consignes disent
      *« passage encadré »*.
- [x] **Montrer la catégorie avant de retenir** — *arbitré par l'auteur : la légende est retirée*
      (§4.3). Le code s'apprend en cherchant : au survol du passage, et dans les groupes du Contexte.
- [ ] **À jouer** : sans légende ni survol, un joueur au toucher comprend-il ce que couleur et trait
      veulent dire ? Il ne les voit qu'une fois le passage retenu, rangé sous le nom de sa dimension.
      *Jean, à la souris, trouve déjà les passages discrets et le survol peu distinct (voir plus haut).*

### 4. Le tutoriel

- [x] **Reprendre là où le joueur en était** — même racine que la mauvaise réponse récompensée : la
      remise 1 servie dans l'ordre, le premier `satisfaits` est de nouveau la citation acquise.
- [x] **Sortir la bulle du flux** — arbitré par l'auteur : une **bulle ancrée au halo**, boîte de dialogue
      non bloquante en surimpression (`placerTuto`, §4.8). `npm run vue` mesure que son redéploiement
      après *« tout effacer »* ne décale plus rien.
- [x] **Une consigne déjà lue reste réduite** (demande de l'auteur) : revenir de *4/4* à *3/4* ne la
      redéploie plus ; seule l'alerte se redéploie déjà vue (`tutoVues`, §4.8).
- [x] **La remise et sa première question en un seul message, les pièces après** (demande de l'auteur,
      §4.6) : on lit la question avant d'aller chercher. Vaut pour chaque remise.

### À garder — validé par ce playtest

La partie qui survit au rechargement ; les catégories nommées et colorées ; le principe d'un refus propre
à chaque article ; la session 1 enfin cohérente (le PV du 1ᵉʳ octobre) ; *« je sais faire »*, qui fait
disparaître la bulle sans casser le jeu.

### Ordre proposé pour la suite

*Remplacé par l'ordre du second rapport, plus haut.*

## Retour de Colas — la boucle de base

- [x] **Notification visuelle « Ajouté au Contexte »** — ✓ sur le passage, ligne *« ✓ Retenu dans ton
      Contexte »* collée au bas de la pièce, porte Contexte allumée, le temps d'un rendu (§4.3). Placée
      sous la pièce plutôt qu'en haut à droite : c'est là qu'on regarde au moment du clic.
- [x] **Dire dans la pièce que cliquer un passage l'ajoute au Contexte** — couvert par le `ditLong` de
      *citer · 2/4* pendant le tutoriel, et désormais par la confirmation au premier clic. Pas d'aide
      permanente de plus : le composeur dit déjà « retiens un passage » (§4.9 règle 1, une voix par état).
- [x] **Le Contexte vide dit COMMENT on y ajoute** : « Ouvre une pièce, puis clique un passage souligné
      pour le retenir : il viendra ici. »
- [x] **La pièce s'ouvre DANS le Contexte** — index → pièce → retenus, deux bandes qui défilent, plus de
      temps « Referme la pièce », `declenche` au départ de la pièce, colonne élargie au-dessus de 900 px.
- [ ] **L'opposition** — rejouée et analysée (§3 PASSATION, six points) :
  - [x] « Continuer » au lieu de « Ne rien opposer — continuer » une fois quelque chose opposé ;
  - [ ] déplacer une phrase d'une affirmation à l'autre se fait en silence → le dire (« déplacer ici ») ;
  - [ ] la réplique est toujours la même → la varier dans le contenu ;
  - [ ] le présentoir se lit mal (petit gris, affirmation hors du cadre) ;
  - [ ] la voix du composeur parle encore pendant la répétition.
- [x] **« Je n'ai rien à opposer »** : la réplique `fin` est devenue une question à laquelle le bouton
      répond, sans renommer le bouton.

## À vérifier en jeu (non joué)

- [ ] La question se lit-elle **avant** les pièces ? Colas ouvrait les pièces sans avoir lu la question
      placée dessous. *Depuis, la remise porte sa question en un seul message, le bouton de pièces
      après elle (§4.6)* — à confirmer en jeu.
- [ ] La première consigne (« Ouvre ton Contexte », désormais une bulle à côté du bouton de pièces)
      est-elle encore trop abrupte sans contexte ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [x] Le halo du tutoriel qui pulsait sur le bouton du message juste après le clic — il passe à l'index.
- [ ] La pièce dans le Contexte sur un vrai téléphone (390 px : serré, le panneau redéfile d'un bloc).
      *Toujours pas joué : Jean n'a pas testé le mobile.*
- [ ] Ce que les retours de Jean n'ont pas touché : le mobile, **toute la session 2** jusqu'à la
      répétition. *La croix × et « recommencer » sont couverts par son second rapport, plus haut.*
- [ ] Rendre la partie à Colas, qui s'est proposé pour tester la suite.
- [ ] La bulle ancrée sur un vrai téléphone, et à côté d'une zone longue (le texte de la pièce) :
      couvre-t-elle ce qu'on vient chercher ? Jouée seulement dans Chromium, 1280×800 et 390×800.

## Plus tard — après validation de la boucle de base

- [ ] **Chain of thought** : une phase « nuit » après « Maître Auber s'est déconnecté », où l'IA se
      parle à elle-même, support des choix moraux.
- [ ] **RAG** : pouvoir retenir des passages des messages de l'avocat, et des infos qui ne viennent pas
      que de lui.
- [ ] **Regrouper les passages retenus en clusters** (idée d'un ami).
- [ ] **Scénario à choix moraux / alignement** (l'IA dissimulerait-elle un vice de procédure ?) — à
      croiser avec le nouveau scénario en préparation, celui-ci n'étant qu'un placeholder.
- [ ] **Les fins** : premier jet seulement, à retravailler.

## Ménage

- [x] Commiter les modifications en cours — fait (`2126a37`).
- [ ] Fermer sans enregistrer l'onglet VSCodium de `export/iavocat.html` : son tampon date du 1er
      octobre et écraserait l'export du 4.

# TODO — suites des retours de playtest (4 octobre)

*Ce qui reste à traiter dans les deux retours du 4 octobre : celui de Colas (et la réponse de l'auteur),
puis un second, rendu sous forme de préconisations. Le détail de ce qui est fait vit au §1 et au §3 de
`docs/PASSATION.md` ; ici, seulement ce qui ne l'est pas.*

*Deux marques. **⚖** — la préconisation va contre un arbitrage écrit : elle se tranche avec l'auteur,
document d'abord (CLAUDE.md, « la méthode »). **(contenu seul)** — se règle dans `app/content.js`,
sans une ligne de code.*

## Second retour du 4 octobre — les préconisations, dans l'ordre du testeur

*Non testés : le mobile, la croix ×, « recommencer », la fin de la session 2. Le testeur dit « affaire
1 / affaire 2 » pour les sessions 1 et 2, « fiches » ou « notes » pour les passages retenus, « bulle »
pour le bandeau du tutoriel. « Reproduit » : rejoué par les règles sous jsdom, sur le contenu livré.*

### 1. Rendre la déduction au joueur — le plus important

- [ ] **⚖ Faire taire l'avocat avant la composition.** La réplique de `q_voix` (*« 22h30. Pourtant à ce
      moment la police était sur les lieux depuis une demi-heure… »*) tombe à la 2ᵉ question, **avant**
      que la 3ᵉ ne demande de composer : elle ne vérifie pas que la contradiction a été vue, elle
      l'annonce. Le §4.8 autorise la fiction à désigner (la calibration, §3), mais c'est la deuxième
      fois que le reproche revient (§4 PASSATION, point 1 : *« l'avocat raisonne à sa place »*).
      Repli (contenu seul) : `q_voix` s'en tient au constat de l'heure, et l'observation passe dans la
      réplique du lien `temoin`, qui vient **après** la composition.
- [ ] **Rendre les refus moins généreux** (contenu seul). *« Il demande des personnels distincts »*
      (art. 7 × délai) donne la solution de la session 2 dès la deuxième erreur : renvoyer à la lecture
      (*« Relis ce qu'il exige »*) au lieu de résumer l'article. Passer les autres refus au même crible :
      *« C'est l'autre moitié de l'article 7 qui m'intéresserait »* (scellés), *« L'article 12 pèse des
      probabilités »*.
- [ ] **⚖ Laisser le joueur se tromper : garde-fous réservés au tutoriel.** Deux garde-fous visés : les
      fiches d'une autre dimension **assombries** pendant une comparaison (`.horsdim`, `renderRetenus`)
      et le **refus avant l'envoi** (*« ces deux-là ne se comparent pas »*, `poserBloc` des règles).
      Contre le §4.5 : *« seules les erreurs de catégorie sont refusées »*, et l'écran s'assombrit *par
      dimension* pour laisser deviner. Lever le refus suppose qu'une comparaison sans forme puisse
      partir et que l'avocat y réponde (`rep_sans_rapport`) : moteur et règles, pas seulement l'écran.
- [ ] **⚖ Proposer deux ou trois relations au choix, dont des fausses**, au lieu de *« précède »* ou
      *« sont une seule et même personne »* rédigés seuls. Renverse le principe fondateur du §4.5,
      *désigner, pas déclarer* : la relation se **déduit** des valeurs (`deduire`, moteur), *« ce qui
      les lie est un fait, pas une thèse »*. Le plus gros chantier de la liste (grammaire, patrons,
      liens, atelier, suites) : à écrire au §4.5 avant tout.
- [ ] **L'incohérence appel + arrivée** (*« ne se comparent pas »*) — **non reproduite** : sur un jeu neuf
      comme en session 2, l'heure de l'appel et l'heure d'arrivée se composent dans les deux ordres
      (*« … précède … »*). Retrouver le chemin exact du testeur (session, ordre des clics, phrase déjà
      entamée ?) avant de corriger quoi que ce soit.

### 2. Donner un coût à l'erreur

- [ ] **⚖ Un prix à payer.** Sans pénalité, on essaie toutes les combinaisons. Pistes du testeur : une
      jauge de patience de Maître Auber, ou un nombre d'envois limité hors tutoriel. À écrire d'abord :
      une jauge visible rendrait l'enjeu **calculable** (§8.4, le trombone), et le §8.6 donne au joueur
      *le droit d'être perdu*. L'escalade des `rep_hors_sujet` / `rep_sans_rapport` est déjà une
      patience, en contenu et sans conséquence : c'est peut-être d'elle qu'il faut partir.
- [ ] **Ne pas récompenser une mauvaise réponse — reproduit, et la racine est plus large.** 22h30 envoyé
      à la **1ʳᵉ** question (l'heure d'arrivée) : `avancerSurAttente` cherche l'attente dans **toute** la
      remise, si bien que la réponse sert `q_voix` **par anticipation**. Trois effets : (a) la réplique
      de `q_voix` tombe, et énonce la contradiction (cf. le premier point) ; (b) le 22h30 entre en
      Plaidoirie (`estMoyen` : son lien porte un tag) ; (c) la 2ᵉ question ne sera **jamais posée**.
      Pendant ce temps le tutoriel, qui lit l'attente **courante**, dit *« Ce n'est pas ce qu'il
      demande »* : les deux voix se contredisent (§4.8). À trancher : attentes servies **dans l'ordre**
      (au moins en session 1, la calibration), ou anticipation assumée — mais alors ni tutoriel qui la
      dément, ni Plaidoirie pour une réponse hors sujet.
- [ ] **Revoir les réactions spontanées** (`declenche`, contenu seul). Celle du rapport du labo (*« Une sur
      1,2 milliard, contre un seuil d'une sur un million… »*) fait la comparaison des deux chiffres **à la
      place du joueur**, et lui fait écarter la piste avant de l'essayer. Les supprimer, ou les garder
      pour les bonnes pistes. Attention au §6 : l'avocat *pousse lui-même* vers le faux vice — garder la
      poussée, pas le calcul. Même soupçon sur la réplique de `q_equipages` (*« ce genre de chiffre… ne
      veut pas dire grand-chose »*), qui disqualifie les chiffres dès la session 1.

### 3. L'ergonomie du Contexte

- [ ] **Libérer la place de lecture.** En session 2, la fenêtre d'une pièce n'affiche que **deux lignes**.
      Replier l'index et les retenus quand une pièce est ouverte, ou ouvrir la pièce sur toute la
      hauteur. Rejoint le §3 PASSATION, *« le Contexte à dix-sept fiches »* : *« sorti du panneau,
      l'index donnerait de l'air »*.
- [ ] **⚖ Ranger les affaires closes.** Les fiches de la session 1 restent en tête de liste : les archiver
      ou les replier. Le §4.6 promet que le Contexte ne **juge** rien — mais replier par session ne juge
      aucun passage, c'est un fait de remise. Rejoint *« aucune barrière entre les affaires »* (§3
      PASSATION).
- [ ] **Rendre l'état de la réponse visible** : marquer dans le Contexte les fiches **déjà prises** dans la
      phrase, et **dire** pourquoi une troisième est refusée. Aujourd'hui le bouton est seulement
      `disabled`, et l'explication vit dans un `title` (*« ta phrase n'attend pas un passage »*) que ni
      le toucher ni le clavier n'atteignent (§4.10).
- [ ] **Montrer la catégorie avant de retenir** : une légende des cinq styles de soulignement,
      **indispensable sur mobile** (pas de survol). La légende de chaque pièce existe (§4.3), mais **au
      bas** du texte, hors champ dans une fenêtre de deux lignes. Répond au §3 PASSATION (*« reste à voir
      si elle suffit, ou si le joueur passe à côté »*) : il passe à côté.

### 4. Le tutoriel

- [ ] **Reprendre là où le joueur en était — reproduit.** Une erreur à la 1ʳᵉ question fait disparaître la
      bulle, et *citer · 3/4* et *4/4* sont perdues : `tutoEtape` tient la citation pour acquise dès que
      `S.satisfaits` n'est plus vide, or la mauvaise réponse vient de servir `q_voix` par anticipation
      (cf. 2 ci-dessus). Même racine : réparer l'un répare l'autre.
- [ ] **⚖ Sortir la bulle du flux.** Elle se redéploie après *« tout effacer »* et décale toute l'interface
      d'environ 60 px ; le testeur la veut en surimpression. Contre le §4.8 (*« dans le flux : il réserve
      sa place… aucune des quatre ancres ne peut se retrouver dessous »*) et un PIÈGE du §2 PASSATION.
      Repli qui laisse l'arbitrage intact : ne pas **re**déployer une consigne déjà montrée. Aujourd'hui,
      revenir de *4/4* à *3/4* compte pour une consigne neuve (`neuf`, dans `majTutoriel`).

### À garder — validé par ce playtest

La partie qui survit au rechargement ; les catégories nommées et colorées ; le principe d'un refus propre
à chaque article ; la session 1 enfin cohérente (le PV du 1ᵉʳ octobre) ; *« je sais faire »*, qui fait
disparaître la bulle sans casser le jeu.

### Ordre proposé

1. Arbitrer l'ordre des attentes, puis réparer la racine commune : la réponse hors sujet récompensée
   et le tutoriel qui disparaît.
2. Le contenu seul : les refus, `q_voix`, les `declenche`.
3. L'ergonomie du Contexte.
4. Les ⚖, document d'abord : relations au choix, garde-fous, coût de l'erreur, bulle.

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
      placée dessous. Le bouton agrégé et `rappelQuestion` y répondent peut-être — à confirmer.
- [ ] La première consigne (« Ouvre ton Contexte », en tête de page) est-elle encore trop abrupte sans
      contexte ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [x] Le halo du tutoriel qui pulsait sur le bouton du message juste après le clic — il passe à l'index.
- [ ] La pièce dans le Contexte sur un vrai téléphone (390 px : serré, le panneau redéfile d'un bloc).
      *Toujours pas joué : le second retour n'a pas testé le mobile.*
- [ ] Ce que le second retour n'a pas touché : la croix × (panneau et fiche portent le même signe, §3
      PASSATION), « ⟲ recommencer », la fin de la session 2 jusqu'à la répétition.
- [ ] Rendre la partie à Colas, qui s'est proposé pour tester la suite.

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

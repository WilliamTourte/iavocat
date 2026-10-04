# TODO — suites des retours de playtest (4 octobre)

*Ce qui reste à traiter dans les deux retours du 4 octobre : celui de Colas (et la réponse de l'auteur),
puis celui de Jean, rendu sous forme de préconisations. Le détail de ce qui est fait vit au §1 et au §3 de
`docs/PASSATION.md` ; ici, seulement ce qui ne l'est pas.*

*Deux marques. **⚖** — la préconisation va contre un arbitrage écrit : elle se tranche avec l'auteur,
document d'abord (CLAUDE.md, « la méthode »). **(contenu seul)** — se règle dans `app/content.js`,
sans une ligne de code.*

## Retour de Jean — les préconisations, dans l'ordre du testeur

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
- [ ] **⚖ Proposer deux ou trois relations au choix, dont des fausses**, au lieu de *« précède »* ou
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
      jauge de patience de Maître Auber, ou un nombre d'envois limité hors tutoriel. À écrire d'abord :
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

- [ ] **Libérer la place de lecture.** En session 2, la fenêtre d'une pièce n'affiche que **deux lignes**
      (et déjà en session 1 à 1280×800, d'après les captures). Replier l'index et les retenus quand une
      pièce est ouverte, ou ouvrir la pièce sur toute la hauteur. Rejoint le §3 PASSATION, *« le
      Contexte à dix-sept fiches »* : *« sorti du panneau, l'index donnerait de l'air »*.
- [ ] **⚖ Ranger les affaires closes.** Les fiches de la session 1 restent en tête de liste : les archiver
      ou les replier. Le §4.6 promet que le Contexte ne **juge** rien — mais replier par session ne juge
      aucun passage, c'est un fait de remise. Rejoint *« aucune barrière entre les affaires »* (§3
      PASSATION).
- [ ] **Rendre l'état de la réponse visible** : marquer dans le Contexte les fiches **déjà prises** dans la
      phrase, et **dire** pourquoi une troisième est refusée. Aujourd'hui le bouton est seulement
      `disabled`, et l'explication vit dans un `title` (*« ta phrase n'attend pas un passage »*) que ni
      le toucher ni le clavier n'atteignent (§4.10).
- [ ] **Les passages ni soulignés ni surlignés par défaut — seulement au survol** (demande de l'auteur).
      Fouiller y gagne un sens (§8.6 : *le joueur a le droit d'être perdu*). À écrire au §4.3 d'abord, et
      trois questions à trancher : **le toucher** n'a pas de survol (le point suivant le juge
      *indispensable sur mobile*) ; **le clavier** a besoin d'un équivalent (`:focus-visible`, §4.10) ;
      et un passage **retenu** garde-t-il sa marque (✓, fond) hors survol ?
- [ ] **Montrer la catégorie avant de retenir** : une légende des cinq styles de soulignement,
      **indispensable sur mobile** (pas de survol). La légende de chaque pièce existe (§4.3), mais **au
      bas** du texte, hors champ dans une fenêtre de deux lignes. Répond au §3 PASSATION (*« reste à voir
      si elle suffit, ou si le joueur passe à côté »*) : il passe à côté.

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

1. L'ergonomie du Contexte, dont le soulignement au survol.
2. Les ⚖, document d'abord : relations au choix, garde-fous, coût de l'erreur.

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
- [ ] Ce que le retour de Jean n'a pas touché : la croix × (panneau et fiche portent le même signe, §3
      PASSATION), « ⟲ recommencer », la fin de la session 2 jusqu'à la répétition.
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

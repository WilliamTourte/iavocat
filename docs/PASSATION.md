# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 1er octobre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins — **à la souris comme au
clavier seul**. `npm test` est vert — 406 contrôles, 7 règles du gardien, ESLint.

Le 15 septembre a changé deux choses, toutes deux venues d'une **partie jouée** : **la session 1 va
jusqu'à la comparaison** (l'article 3 arrive avec le premier lot, trois sessions deviennent deux, §3)
et **clore et envoyer n'en font plus qu'un** (`vice_trouve` se lève à l'**assemblage**, sans quoi la
Fin 2 devenait injouable, §4.7).

Le 16 septembre est une session d'**écriture**, pas de mécanique : la liaison-article dit désormais
*« en contradiction avec »* et non *« au regard de »* (§4.5 — tous deux refaits depuis, voir plus
bas), la première question descend dans le **texte de la remise** (elle en est **ressortie** le
1ᵉʳ octobre), le tutoriel est repris, un empan ne se désélectionne plus depuis sa pièce, et
la **colonne Plaidoirie est escamotée** — provisoirement, mécanique intacte derrière (§4.9). Deux de
ces gestes ont fait tomber **cinq contrôles** qui nommaient du contenu au lieu de le dériver : ils sont
réécrits, et la doc est remise d'aplomb sur ce que le code fait.

**Deux passes de retours playtest** ont suivi, sur la même partie jouée. La première a rendu le
tutoriel plus lisible, fait de `#composeur` un bandeau plein largeur et appliqué le repli du §4.6 — un
clic dans le composeur fait descendre le Contexte. La seconde reprend ce que cette partie montrait
encore : **le Contexte tombe à un tiers de la largeur** (la Discussion prend les deux autres, et le
tiers ne bougera pas au retour de la Plaidoirie), **l'index nomme les pièces comme la Discussion les a
transmises** — plus d'abréviation à faire de tête au moment de retrouver une pièce —, et **le bandeau
du tutoriel monte en tête de page, dans le flux** : il pousse le jeu au lieu de le recouvrir (§4.6,
§4.8).

**Les deux surfaces de côté sont devenues des PANNEAUX** (§4.6, §4.9). L'écran n'a plus qu'une colonne,
empilée en **trois bandes** : la conversation, le panneau ouvert, le composeur. Le Contexte et la
Plaidoirie s'ouvrent **entre** les deux autres et **ne recouvrent rien** — la conversation rétrécit
pour leur faire place, si bien que la question reste sous les yeux pendant qu'on choisit un passage et
qu'on voit la phrase se construire. Deux portes y mènent : **la voix du composeur**, qui devient un bouton quand le geste qu'elle nomme a lieu
ailleurs, et **une barre** dans le titre de « Ta réponse », qui nomme les deux surfaces et donne leur
compte. Un panneau ouvert *pour écrire* suit la phrase et se referme avec elle ; ouvert *pour
consulter*, il reste. **La Plaidoirie sort de son escamotage** par la même occasion, et la colonne qui
s'élargissait — essayée la veille — est annulée : avec elle tombent la grille de `.wrap` et **deux
PIÈGES** qu'elle avait coûtés.

**L'atelier et le fichier ne se perdent plus de vue** (§10) : le brouillon `localStorage` masquait
`content.js` au démarrage — un `git pull` ou une édition à la main n'entrait jamais, *même en
rechargeant la page*. Désormais le fichier a raison, **sauf s'il y a du travail à perdre** : adopté en
silence quand le brouillon n'a pas bougé, annoncé par un bandeau quand les deux ont bougé. Il se relit
au démarrage et **à chaque retour sur l'onglet**, sans recharger.

**Un playtest mené au clavier** (Chromium 141, 1280×800) a trouvé le jeu **injouable sans souris** : pièces
jointes, passages et puces étaient des `<span onclick>`, le redessin jetait le focus, la pièce ouverte
n'était pas une boîte de dialogue, rien ne s'annonçait. Tout est repris sous un nouveau **§4.10** —
*jouer sans la souris, lire sans la couleur* — écrit d'abord, appliqué ensuite, et **joué au clavier
seul** dans un vrai Chromium. Au passage : la dimension se lit au **trait** autant qu'à la couleur, sur
une palette **sans rouge** mesurée sous trois daltonismes (§4.3) ; la colonne **tient dans la fenêtre**,
« → Envoyer » ne passe plus sous le pli ; les pièces prennent la matière du **papier** (§4.6) ;
Envoyer pèse plus que ce qui défait, plancher de 12 px (§4.9). L'arbitrage du 16 — **la pièce n'ajoute
que** — est reconduit : recliquer un passage retenu ne l'oublie toujours pas, mais l'écran le dit.

Trois arbitrages de l'auteur, le même jour, qui **ferment** des questions plutôt qu'elles n'en ouvrent :
la liaison-article **n'a pas à être neutre**, la phrase *« Tant que tu ne l'envoies pas… »* **n'a pas à
revenir**, et l'escamotage de la Plaidoirie est **provisoire** (§3). Quatrième : `_bruit` cesse d'être
une liste recopiée dans l'atelier — le drapeau passe **sur l'empan** (§11), donc il s'exporte, suit les
renommages et meurt avec lui.

**Le 1er octobre, la Discussion devient une conversation** : nos répliques portent le nom d'**IAvocat**
et s'alignent **à droite**, celles de Maître Auber à gauche, chaque bulle à la largeur de son texte.
Le même jour, un défaut de fiction relevé par l'auteur : **« Clôturer l'instruction » est l'acte du
juge**, que ni l'IA ni l'avocat ne peuvent poser — et le contenu faisait **déjà** déposer l'avocat,
si bien que l'écran mentait seul. Un **§4.9 règle 5** l'acte : *le chrome ne s'arroge aucun pouvoir
que la fiction refuse*. L'avocat **demande** — la réplique qui ferme la dernière session pose la
question —, nous répondons **« Je n'ai rien d'autre »**, puis **« Je n'ai rien à opposer »** après la
répétition. Le bouton **n'est à l'écran que lorsqu'il agit** : absent avant la question, absent
pendant la répétition, qui se joue dans le canal. Le libellé **devient l'acte moral** — l'appuyer en
tenant le vice compris et tu, c'est un mensonge qu'on signe soi-même. Aucun champ de contenu neuf,
aucune règle touchée ; le texte de la Fin 3 et les deux miroirs de l'atelier ont suivi.

**Le 1ᵉʳ octobre, une PARTIE JOUÉE À L'AVEUGLE a été rapportée geste par geste** — le §4 réclamait
de jouer, c'est fait. Son défaut majeur n'était pas mécanique : le joueur trouvait la contradiction
seul, et Maître Auber la lui annonçait. **La session 1 devient donc une CALIBRATION** (§3) :
l'avocat éprouve la machine avant de lui confier le dossier, il pose des questions dont il a les
réponses, et relever l'incohérence n'est plus la révéler mais **vérifier qu'elle a été vue**. Trois
choses suivent : *recopier* cesse d'être un défaut, le **tutoriel a une raison d'être dans la
fiction**, et la remise 2 devient la **charnière** où l'avocat cesse de savoir. Le partage qui en
découle : **la fiction peut désigner, le chrome jamais** (§4.8) — le bandeau ne dit plus *« les deux
passages qui se contredisent »*, seulement *« une réponse peut tenir sur deux passages »*.

**Deux défauts de justesse relevés par le même joueur, tous deux réels.** *« 22h30 contredit 22h04 »*
ne contredisait rien — les deux heures se concilient très bien : le PV dit désormais ce que la
patrouille **constate** à 22h04, et l'article 3 mord comme il est écrit, **par la prose seule, sans
un empan neuf** (§6). Et *« en contradiction avec l'article 3 »* était juridiquement bancal : chaque
article porte maintenant **son** libellé, l'uniformité n'ayant jamais été une exigence (§4.5). Même
exigence sur les `patron` : *« la même chose »* ne se disait pas de deux personnes — quatre formes
par registre, distinguées par leurs seuls `slots` et déclarées avant les génériques (§8.8, §11).
La dimension `ou` s'écrit **`où`**, et deux reflets de l'atelier ont suivi (§15).

**Quatre reprises d'écran, toutes venues de la même partie.** La **question redescend au composeur
dès qu'un panneau est ouvert** — *lisible* était la condition, pas *présent*, et une capture du
dépôt montrait la question coupée (§4.9 règle 3) ; la **première question quitte le texte de la
remise** pour pouvoir être rappelée. Le **Contexte dit qu'il déborde** : barre toujours visible,
index collant en tête, le dernier passage retenu amené dans le champ à l'ouverture, et le panneau
monte à 40 vh — la conversation gardant un plancher qui montre vraiment trois lignes. Le **compteur
du tutoriel cesse de reculer** : deux séries nommées (*citer · 2/4*, *mettre en relation · 1/3*) au
lieu d'une numérotation qui revenait de 6/6 à 4/6. Et la **réplique `declenche` part à la fermeture
de la pièce**, non à son ouverture, où elle tombait derrière une boîte de dialogue en fond flouté.

## 2. Points de vigilance

*Le **concentré** : ce qui a déjà mordu, rassemblé pour une relecture avant de toucher au code. Chaque
point est argumenté là où il mord — un § du système, ou un PIÈGE dans le fichier ; cette liste ne les
remplace pas, elle les rappelle d'un trait.* Les **[Rn]** sont tenus par une règle du gardien — ils
tiennent en une ligne parce qu'on n'a plus à y penser ; les autres ne sont tenus par rien.

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**.
- **[R6]** Quatre ids sont des ancres du tutoriel : `#discussion`, `#modalRoot`, `#zoneRetenus`, `#composeur`.
- **[R9]** Le tag vit sur l'**attente**, jamais sur la remise — quatre fonctions exceptées.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.
- **[R12]** L'export commité est bien celui que produit `npm run export`.

**Tenus par personne — c'est ici qu'on se fait mal :**

- **Une suite peut passer par le vide** : un contrôle sous un `if` est vert par construction — casser ce
  qu'il surveille et le voir tomber est la seule preuve. Et **les suites ne se lisent pas elles-mêmes** :
  avant d'ajouter une règle au gardien, demander *sur quel territoire elle marche*.
- **Un reflet ment sans rien casser** : le diagnostic et l'onglet Grammaire décrivent le jeu, aucune
  suite ne les lit (§15).
- **Le flag `cite` est porté par la liaison, jamais par le terme** — `t0` est partagé par la citation et
  la comparaison.
- **L'index `iBloc` de `poserBloc` est positionnel dans la liste filtrée**, donc lié à la session.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** : une mutation qui renonce garde
  sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** (`noyau.js` en premier), et les `window.X = X`
  explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) sont ce par quoi `smoke_atelier.js` lit.
- **`#tuto` est le PREMIER enfant de `<body>`, avant `.wrap`** : collant dans le flux, il réserve sa
  place — c'est ce qui l'empêche de recouvrir ses propres ancres. **Hors de `.wrap`**, il reste aussi
  vivant quand la pièce ouverte la rend `inert` — d'où, aussi, pas de `<dialog>.showModal()`. Son `z-index:60` le garde lisible
  par-dessus l'`.overlay` (50) de la pièce ouverte, et c'est sa position *avant* `#modalRoot` qui fait
  mordre le sélecteur décalant la modale. Le remettre en fin de `<body>` ne casse **aucune** suite : il
  recouvre à nouveau, en silence.
- **La PLACE DES PANNEAUX DANS LE DOCUMENT est toute la mécanique** : entre la section Discussion et
  `#composeur`, dans le flux. Les déplacer ailleurs dans `.wrap`, ou les repasser en `position:absolute`
  (ce qu'ils ont été une heure), leur refait recouvrir la conversation — et **rien ne le dirait**,
  aucune suite ne voyant une géométrie.
- **La colonne tient dans la fenêtre, et la conversation est la SEULE bande élastique** (§4.6) :
  `body` en colonne de `100dvh`, la conversation en `flex:1` **avec `min-height:0`** — sans lui, elle
  refuse de rétrécir et pousse « → Envoyer » sous le pli. Aucune suite ne voit une géométrie :
  `npm run vue` le **dit** en 1280×800 (« au-dessus du pli »), il ne l'asserte pas.
- **Un passage est un `span[role=button][tabindex=0]`, jamais un `<button>`** : un bouton est une
  boîte insécable même en `display:inline` (mesuré, Chromium 141) — un passage long sauterait à la
  ligne d'un bloc. Entrée et Espace passent par `clavier`, délégué sur `document`.
- **Le focus se retrouve par CLÉ** (`data-f`, ou l'id), jamais par l'élément, que le redessin a
  détruit ; un geste qui sait mieux pose `focusVoulu`. Tout nouvel élément cliquable redessiné veut
  sa clé — sinon le joueur au clavier repart de la zone.
- **`#annonce` vit dans le HTML statique, HORS de `.wrap`** : une région créée au moment d'annoncer
  ne dit pas sa première phrase, une région dans `.wrap` se tait quand la pièce la rend inerte. Et
  **jamais `role="log"` sur la Discussion**, réécrite à chaque geste.
- **Un contrôle clavier désigne son élément par sa clé, jamais par `activeElement`** : cliquer
  `actif()` faisait tomber la suite au premier focus perdu, et masquait les contrôles d'après. Les
  31 contrôles clavier ont chacun été **cassés une fois** pour les voir tomber.
- **Le panneau ouvert se referme sur ce que la phrase ACCEPTE, jamais sur ce que la voix RÉCLAME** :
  un passage posé, la voix se tait — la phrase se tient — mais la grammaire ne sait pas encore si c'est
  une citation ou le premier temps d'une comparaison (§4.5). Suivre la voix retirerait le clavier au
  milieu du geste le plus difficile ; d'où `indexTermeChamp`. **Et cette fermeture ne vaut QUE pour un
  panneau ouvert par la voix** (`panneauSuit`) : ouvert depuis la barre, on consulte, et il reste.
  Trois contrôles tiennent ce point.
- **Les ids de la barre sont écrits EN TOUTES LETTRES** (`btnContexte`, `btnPlaidoirie`), donc la barre
  ne se replie pas en une boucle : le tutoriel les vise quand le panneau est fermé, et **R6 ne sait pas
  lire un id fabriqué par interpolation** — il l'a refusé, à raison. Même exigence pour les deux
  sélecteurs `ou:` du tutoriel, qui doivent rester des littéraux.
- **`export/iavocat.html` est COMMITÉ, donc c'est une copie de `app/`** — et aucune suite ne le lit.
  **[R12]** le tient, en appelant l'exporteur (passé en mode double) plutôt qu'en refaisant son
  inlinage : un prédicat recopié resterait vert en affirmant l'ancienne vérité, et une règle a déjà été
  retirée d'ici pour ça. Un hook régénère et stage l'export avant chaque `git commit` — mais **le hook
  ne protège que cette machine**, R12 protège tout le monde, CI comprise.
- **Rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les
  captures — qui **ne se comparent pas à l'octet** (le halo pulse).
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par
  `scrollTop = scrollHeight`. Enfant direct de `.wrap`, en bandeau plein largeur après les trois
  `.col` — jamais dans une section colonne.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande
  `.col[hidden]{display:none}`, et `.cloture` **et `#composeur`** sont câblés sur trois colonnes
  (`.wrap.sansPlan`).
- **`S.retenus` est sérialisé dans `localStorage`** et s'appelait `S.memoire` : la signature de contenu
  **ne protège pas** d'un renommage d'état — `restaurerPartie` porte la reprise, et tout futur
  renommage aura le même devoir.
- **`lienDe` apparie sur `{forme, termes}`** : renommer une forme oblige à faire suivre **tous** les
  liens qui l'écrivaient — **le vice compris**. Oublié, il cesse d'exister et sept contrôles de
  `test_o5` tombent (vérifié en cassant, §16).
- **La réplique `declenche` part à la FERMETURE de la pièce** : poussée à l'ouverture, elle tombait
  derrière une boîte de dialogue qui venait de rendre `.wrap` inerte — lue en fond flouté, ou pas
  lue du tout. `closeModal` est le seul endroit où l'écran appelle une règle en refermant.
- **Le chrome n'est personne, la fiction peut l'être** : le bandeau nomme le **geste**, jamais la
  **trouvaille** ; Maître Auber, lui, a le droit de désigner — il sait, il calibre (§3, §4.8).
- **Panneau ouvert, la question redescend au composeur** : *lisible* est la condition, pas *présent*.
  La règle s'applique un cran trop large — sur un grand écran la question paraît deux fois — et
  c'est **voulu** : une mesure de hauteur serait invisible des suites, cette règle-ci est tenue par
  trois contrôles (§4.9 règle 3).
- **Le doublon banal porte tout le camouflage** (§4.4) : ne jamais désactiver son contrôle.
- **Le tutoriel enseigne deux gestes, la citation puis la comparaison, et ne ferme pour de bon
  qu'à la fin de la session 1** (`S.remisesEnvoyees>1`) — pas au premier `S.satisfaits`, qui ne
  marque que la fin du premier geste. Entre les deux, il se tait sans se fermer.
- **Cacher la clôture, c'est cacher le BOUTON et son aide, jamais `.cloture`** : la barre porte aussi
  *« ⟲ recommencer »*, qui ne s'absente jamais (§4.9). Et `disabled` **double** `hidden` — trois
  contrôles lisent `btnCloture.disabled` pour dire que le refus est vrai, et il doit l'être aussi pour
  qui ne voit pas l'écran.
- **Le bouton naît de `instructionComplete`, la question qui l'appelle vit dans le CONTENU** — sur la
  réplique `apres` de la **dernière** attente de la dernière session (§3). Rien ne lie les deux :
  déplacer cette réplique ferait paraître la réponse sans question, et aucune suite ne le verrait.
- **La clôture implicite compte les *liaisons* offertes**, les termes exclus : ajouter une liaison à la
  grammaire change le nombre de clics ailleurs, ajouter un terme non.
- **Poser un bloc ne clôt plus rien** : le refus de catégorie tombe au clic qui **déduit** une paire ou
  **achève** la phrase. Une composition en cours n'est jamais « fausse ».
- **`R.clore` ne redessine pas, donc ne sauve pas** : la sauvegarde est un effet du rendu.
- **Relire `content.js` réaffecte `window.CONTENU`**, qui est *aussi* le miroir de l'état de l'atelier :
  `relireFichier` le met de côté et le remet dans le même tour (§10). Et **il faut DEUX déclencheurs** —
  `visibilitychange` ne voit que le changement d'onglet, jamais le retour depuis l'éditeur.
- **La relecture à l'œil des phrases composées reste irremplaçable.**

## 3. Ce qui reste ouvert

Tout est **non éprouvé** ou **non tranché** ; l'ordre ci-dessous est celui de l'urgence.

- **Le critère qui décide de tout** : *« l'heure d'arrivée de la patrouille précède l'heure des éclats
  de voix, et l'article 3 écarte la déposition qui s'y heurte » se lit-il comme une pensée ou comme un
  formulaire ?* Si c'est un formulaire, aucune mécanique ne le sauvera. **Le 1ᵉʳ octobre a enlevé la
  réponse la plus facile** — l'ancien libellé était juridiquement faux, et un joueur l'avait vu avant
  nous. La question reste entière sur le nouveau.
- **La CALIBRATION tient-elle ?** Première chose à regarder : la session 1 se sent-elle comme un
  examen, et la remise 2 comme une charnière ? Si l'examen ne se sent pas, la session 1 redevient une
  dictée — et c'est la seule chose que le recadrage du 1ᵉʳ octobre devait réparer (§3). **Non joué.**
- **La compréhension est-elle encore *exprimée* ?** Et **une question posée guide-t-elle trop ?** Repli
  sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. *Le rapport du
  1ᵉʳ octobre tranche à moitié : les questions guident, et c'est désormais la fiction qui l'assume.*
- **Trois bandes empilées : une pensée, ou un tableau de bord ?** La question qui remplace celle du
  va-et-vient entre deux colonnes, close faute d'objet : il n'y en a plus qu'une (§4.6). Tout est
  désormais visible en même temps — ce qu'on me demande, ce dont je dispose, ce que j'écris — et c'est
  précisément le risque : le §3 redoute depuis le début que la phrase composée se lise comme un
  **formulaire**. *Une partie jouée n'en a rien dit — ni plainte, ni éloge : à reposer.*
- **`porte sur : quand`, sous chaque article, fait-il le tri à la place du joueur ?** Un joueur
  l'écrit noir sur blanc : *deux fiches QUI → seul l'art. 7 colle*. Le moteur ne lit jamais `porte`
  (§4.5), mais l'étiquette filtre **dans la tête** — et le choix entre l'article 7 et l'article 12
  fait toute la session 2 (§6). Le retirer est une ligne ; **à juger sur une partie, le recadrage en
  place.**
- **L'article s'offre sans avoir été lu** : `blocsDepuis` filtre sur `piecesLivrees` — *reçu*, pas
  *lu*. Passer à `S.examinees` est un mot, et l'invariant du §4.5 deviendrait *« on n'invoque pas un
  texte qu'on n'a pas lu »*. Non tranché.
- **Rien ne dit que la couleur et le trait CODENT une dimension** : il faut survoler un passage pour
  l'apprendre (§4.3). Le Contexte l'enseigne, mais seulement une fois un passage retenu. Une légende
  est du chrome que le §4.9 n'autorise pas sans preuve. **À jouer, pas à décider.**
- **Le Contexte à dix-sept fiches** : les passages de la session 1 restent en tête et encombrent.
  Trier, replier ou filtrer serait *juger* ce que le §4.6 promet de ne jamais juger — d'où, pour
  l'instant, la seule barre visible et le dernier retenu amené dans le champ.
- **Deux portes valent-elles mieux qu'une ?** La voix du composeur enseigne, la barre nomme et donne
  accès. Le §4.9 interdit de redire, pas d'offrir deux chemins. **Réponse partielle du 1ᵉʳ octobre :
  elles coûtent avant de servir** — au premier écran, un joueur a noté *« Contexte / Plaidoirie :
  rôle inconnu à ce stade »*. Elles ont servi ensuite ; reste à savoir si le début le justifie.
- **La Plaidoirie est revenue** (§4.9) — en panneau, porte visible d'emblée, comme le §3 l'avait
  annoncé (*où*, pas *si*). Ce qui reste à voir : **son apparition enseigne-t-elle que l'envoi
  transmet ?** Son compte dans la barre suffit-il à distinguer *envoyé* de *retenu comme moyen* ?
- **Plus rien n'annonce qu'une fin existe.** Le bouton grisé le disait dès le premier écran — à tort,
  mais il le disait (§4.9). Un joueur qui ne voit la porte qu'à la toute fin sait-il qu'il *peut*
  s'arrêter, et surtout qu'il peut **ne pas** tout dire ? La charnière de la Fin 3 en dépend. Non joué.
- **L'aide unique en dit-elle assez ?** (§4.9) Repli le plus court du dépôt : rendre l'aide **et** le
  fantôme, un `if`.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu. Idem le rythme
  des zones et la **majuscule en tête de phrase composée** (non traitée).
- **Le canal de révélation de la culpabilité** : celui qui échoue ne devrait pas recevoir la vérité,
  pour préserver le doute de la Fin 3. **La manipulation du canal** reste **suspendue** — aucun défaut
  de l'avocat ne doit se lire comme un calcul (§8.5).
- **Les deux directives ne sont pas à l'écran** (§5) : leur rendre une porte, ou décider qu'une IA n'a
  pas à consulter ce qu'elle *est*. Non tranché, donc le diagnostic a raison de les exiger.
- **La progression** : nombre de sessions, portes, emplacement de la porte de la Fin 3 — le prototype
  s'arrête à deux. Et **`comment` en sixième dimension**, écarté, réintégrable sans coût.
- **Le papier et le clavier, jamais joués par un autre que nous** : la matière des pièces se juge à
  l'œil (contraste avec la machine, ou simple dépaysement ?), et le testeur a annoncé un **audit de
  contraste** — les états par opacité sont passés en couleurs, pas encore mesurés un à un. *Le
  rognage de la conversation en 1280×800, lui, est réglé : la question redescend au composeur et le
  plancher du fil montre trois lignes (§4.9 règle 3).*
- Côté outil : la frise n'édite pas `rep_hors_sujet` (§15).

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer** — la
précédente l'a prouvé : une partie rapportée geste par geste a valu plus que trois passes de
relecture. **Il faut la rendre à un joueur neuf**, qui n'a pas lu ce qui précède :

1. **La calibration se sent-elle ?** La session 1 passe-t-elle pour un examen, et la remise 2 pour le
   moment où l'avocat cesse de savoir ? Si l'examen ne se sent pas, la session 1 redevient la dictée
   qu'un joueur a trouvée humiliante, et c'est tout ce que le recadrage devait réparer (§3).
2. **Rejouer la session 1 avec les nouveaux libellés** (*« et l'article 3 écarte la déposition qui
   s'y heurte »*) : la phrase composée se lit-elle comme une pensée ou comme un formulaire ? C'est le
   premier point ouvert du §3 — et l'excuse la plus facile vient d'être retirée.
3. **Envoyer une comparaison nue** et voir si le refus de Maître Auber enseigne (§4.5) — c'est du
   contenu qui n'a jamais pu sortir.
4. **Retirer `porte sur`** du composeur et rejouer la session 2 : le choix entre l'article 7 et
   l'article 12 se fait-il encore, ou l'étiquette le faisait-elle seule (§3) ?
5. Si la boucle tient : écrire la session 3 et placer la porte de la Fin 3. Sinon, prendre l'un des
   replis du §3, qui ne coûtent aucune ligne de code.
6. **Rendre la partie au testeur du clavier**, lecteur d'écran allumé (NVDA, VoiceOver) : les annonces
   tombent-elles au bon moment, et en disent-elles trop ? Aucune suite ne l'entend (§4.10).

**Méthode à conserver** : toute évolution part du document — on le réécrit, on le fait relire, puis on
applique au code. Et la question à poser avant de déclarer une passe finie n'est pas « qu'est-ce qui
reste ? » mais **« où n'ai-je pas regardé ? »**.

## 5. L'historique, en bref

*Pour ne pas rouvrir un débat sans savoir qu'il a été tranché ; le **pourquoi** vit dans la section
qu'elle a fait évoluer. Les dates sont des sessions de travail.*

- **27–31 juillet** — le geste devient composer puis envoyer ; la relation se **déduit** au lieu de se
  déclarer ; l'article devient obligatoire et n'est offert qu'une fois sa pièce livrée ; une remise
  attend une **liste** d'attentes ; le tutoriel apparaît (§3, §4.2, §4.5, §4.8).
- **1ᵉʳ–5 août** — l'économie de l'écran ; les trois surfaces prennent leur nom d'écran partout
  (`S.memoire` → `S.retenus`) ; les **projections** passent dans `moteur.js` ; une page ne porte plus
  que sa structure, `index.html` tombe de 859 à 85 lignes (§4.6, §4.9, §9, §14).
- **13–14 août** — le gardien rend opposables les conventions qu'aucune suite ne voit ; les trois
  reflets sont repris ; le document se scinde en sens et système (§15, §16).
- **15 août** — la prose est dégraissée de deux tiers ; un argument que porte déjà un § devient un
  renvoi vers lui.
- **15 septembre** — la session 1 va jusqu'à la comparaison ; **clore et envoyer n'en font plus qu'un**,
  la comparaison nue part et c'est l'avocat qui la refuse ; dégraissage de l'outillage — six règles au
  gardien, 318 contrôles sur cinq suites (§3, §4.5, §4.7, §16).
- **15 septembre, seconde passe** — quatre fichiers de doc : `CARTE.md` devient le §17, `ECRITURE.md` le §8,
  `HISTORIQUE.md` cette section. La prose du dépôt passe de 29 400 à 13 300 mots ; **les commentaires
  du code sont ramenés aux en-têtes, aux banderoles de section et aux PIÈGES**, qui portent désormais
  ce mot. Ce qui a été coupé était argumenté ailleurs, ou paraphrasait le code ; `git log` le garde.
- **16 septembre** — une session d'écriture (§1), puis une passe de **cohérence** : cinq contrôles qui
  nommaient du contenu au lieu de le dériver sont réécrits ; quatre affirmations que le code avait
  démenties sont recalées — le libellé de la liaison-article, la phrase de l'envoi, la colonne
  Plaidoirie, les ancres du tutoriel (§4.5, §4.9, §17) ; les comptes (cinq suites, 331 contrôles) sont
  repris partout, CI et hook compris. Côté commentaires, la numérotation héritée du temps où l'atelier
  était **un seul fichier** disparaît : chaque module n'a plus qu'un en-tête. Enfin **`bruit` passe sur
  l'empan** : la liste `_bruit` de `noyau.js` disparaît avec les cinq endroits qui l'entretenaient, et
  `migrerContenu` replie celles qui traînent (§11). Enfin **le fichier reprend la main sur le
  brouillon** (§10) — relecture à chaque retour sur l'onglet, arbitrage silencieux quand il n'y a rien
  à perdre. Écrit au document d'abord, puis appliqué ; les quatre cas joués dans un vrai Chromium,
  parce qu'aucune suite ne peut éprouver `visibilitychange` ni une balise qui va vraiment lire.
- **30 septembre, troisième passe** — **les deux surfaces de côté passent en panneaux**, d'abord
  par-dessus la conversation, puis — même session, sur retour de l'auteur — **dans le flux, entre elle
  et le composeur**, avec des portes qui tranchent sur le fond. Le rappel de la question sous panneau,
  écrit et éprouvé, est **retiré** dans la foulée : rien n'est couvert, pense-t-on alors — *lisible*
  n'est pas encore distingué de *présent*. Il **revient le 1ᵉʳ octobre** (§4.9 règle 3), quand une
  capture du dépôt montre la question coupée alors même qu'aucun panneau ne la recouvre : rétrécie
  pour leur faire place, la conversation peut perdre la question sans qu'elle soit cachée par rien.
  La bascule : l'élargissement de la colonne, essayé la passe d'avant, est annulé, et la Plaidoirie
  sort de son escamotage du 16 septembre (§4.6, §4.9). L'écran tombe à une colonne, `.wrap` cesse
  d'être une grille, et deux PIÈGES disparaissent avec elle. Le tutoriel apprend à viser une porte
  quand sa cible est cachée.
- **30 septembre** — six retours d'une partie jouée, en deux passes : tutoriel plus lisible puis monté
  **en tête de page, dans le flux** ; `#composeur` en bandeau plein largeur ; le Contexte qui descend
  au clic, puis ramené à **un tiers** de la largeur ; l'index du dossier qui nomme les pièces **comme
  la Discussion les transmet**. Rien de tout cela n'est visible d'une suite — le seul juge est
  `npm run vue` et la relecture à l'œil (§13, §16).
- **30 septembre, playtest au clavier** — le jeu devient jouable sans souris (§4.10, nouveau) :
  vrais boutons, passages en `role=button`, focus qui survit au redessin, pièce en boîte de dialogue
  (`inert` sur `.wrap`), voix d'annonce unique. La dimension gagne un **trait** et une palette sans
  rouge (§4.3), la colonne tient dans la fenêtre, les pièces passent au **papier** (§4.6). Retenir
  reste un ajout seul, mais le reclic le dit. Document d'abord, code ensuite, en deux commits.
- **1ᵉʳ octobre** — l'IA ne clôture plus : elle répond, l'avocat dépose (§4.9 règle 5).
- **1ᵉʳ octobre, le journal d'une partie à l'aveugle** — quinze constats, triés en quatre lots. La
  **session 1 devient une calibration** (§3), ce qui rend la trouvaille au joueur sans rien retirer à
  l'avocat et donne au tutoriel une raison d'être dans la fiction ; la **justesse** de l'affaire est
  reprise — la constatation du PV rend 22h30 impossible, chaque article porte son libellé, quatre
  formes donnent sa langue à chaque dimension, `ou` devient `où` ; l'**écran** rend la question sous
  panneau, fait dire au Contexte qu'il déborde, arrête le compteur qui reculait et déplace la
  réplique `declenche` à la fermeture de la pièce. Deux points — *« porte sur »* et l'article offert
  sans être lu — sont **laissés ouverts exprès** (§3), à juger sur la partie suivante. Le filet a été
  **vu tomber** : la forme du vice renommée sans suivre les liens, sept contrôles de `test_o5`
  s'écroulent.

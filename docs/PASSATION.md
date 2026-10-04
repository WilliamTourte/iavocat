# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 4 octobre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins — **à la souris comme au
clavier seul**. `npm test` est vert — 469 contrôles, 8 règles du gardien, ESLint.

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

**Le 2 octobre, la partie est rejouée à l'aveugle sur cette version** — et le journal est net :
la moitié de ce qui avait été repris tient (le compteur par geste, la question épinglée, `où`,
*« une seule et même personne »*, la réplique du labo qui attend la fermeture, le Contexte qui
s'ouvre sur les dernières fiches), **et ce qui ne tient pas vient en bonne part de la passe
elle-même**.

**La régression** : l'index du dossier, rendu **collant** pour qu'il ne parte pas hors champ,
occupait le panneau en permanence — à trois lignes, la moitié ; et le panneau, `min-height:0`
devant un composeur `flex:none`, **cédait jusqu'à zéro**. À deux passages retenus, le joueur ne
voyait plus qu'une fiche coupée ; la réponse grandissant, plus rien. L'index **ne colle plus** et
se resserre, le panneau gagne un **plancher**, le composeur un **plafond** — et comme ce plafond
faisait sortir *« → Envoyer »* du cadre, **la barre du composeur devient collante** : le geste qui
parle ne passe plus sous le pli, quelle que soit la longueur de l'offre (§4.6).

**Le code et le document se contredisaient** : le bandeau désignait à nouveau la trouvaille
(*« Sélectionne les deux passages contradictoires »*) alors que le §4.8, écrit la veille, le
réserve à la fiction. Arbitré dans le sens du document — **le chrome nomme le geste, l'avocat
désigne** —, et le §4.8 gagne ce que le joueur a relevé deux fois : **les deux voix demandent la
même chose**, un bandeau qui fait comparer deux passages pendant qu'Auber réclame un article étant
deux consignes pour un geste. Quatre **accidents de langue** partent avec.

**La répétition offrait un choix qui n'existait pas** : les neuf phrases étaient toutes *« déjà
envoyée »*. Depuis que clore et envoyer n'en font qu'un, **aucune phrase ne peut être non versée** —
et `verserContre` répondait *« Je le mets en face de celle-ci »* **sans rien enregistrer**. On n'y
envoie plus, **on oppose** : la cible se pose sur l'entrée de plaidoirie, le présentoir ne montre
que les **moyens** (neuf lignes pour cinq retenus), et la réplique cesse de mentir. Enfin, **la
dimension s'apprend sans survol** : une **légende** nomme, sous chaque pièce, les dimensions qu'elle
porte, avec leur couleur et leur trait (§4.3) — un `title` n'existait ni au clavier ni au toucher.

**Quatre reprises d'écran, toutes venues de la même partie.** La **question redescend au composeur
dès qu'un panneau est ouvert** — *lisible* était la condition, pas *présent*, et une capture du
dépôt montrait la question coupée (§4.9 règle 3) ; la **première question quitte le texte de la
remise** pour pouvoir être rappelée. Le **Contexte dit qu'il déborde** : barre toujours visible,
index collant en tête, le dernier passage retenu amené dans le champ à l'ouverture, et le panneau
monte à 40 vh — la conversation gardant un plancher qui montre vraiment trois lignes. Le **compteur
du tutoriel cesse de reculer** : deux séries nommées (*citer · 2/4*, *mettre en relation · 1/3*) au
lieu d'une numérotation qui revenait de 6/6 à 4/6. Et la **réplique `declenche` part à la fermeture
de la pièce**, non à son ouverture, où elle tombait derrière une boîte de dialogue en fond flouté.

**Un retour de playtest externe (Colas) a rouvert une question close le 30 septembre** : ouvrir une
pièce pour trouver qu'elle ne répondait pas à la question obligeait à la fermer pour relire cette
question, revenue invisible derrière elle. L'auteur a choisi de rouvrir le **va-et-vient entre deux
colonnes**, en connaissance des deux PIÈGES que l'ancienne grille à trois colonnes avait coûtés
(`git show 63a7e06`) : ce n'étaient que des `grid-column` recalculés à la main sur `.cloture` et
`#composeur` à chaque état, pas des pièges de fond. **La pièce ouverte quitte `#modalRoot`** — elle
n'est plus un `<dialog>` avec `.wrap[inert]` — **et rejoint la place LATÉRALE**, au même titre que le
Contexte et la Plaidoirie (§4.6, §4.10 règle 3 CONCEPTION) : un seul occupant à la fois, et désormais
trois portes au lieu de deux. Au-dessus d'un seuil de 900px, cette place devient une colonne à côté de
la conversation — `.wrap.avecLateral`, un gabarit CSS **nommé** (`grid-template-areas`) où `grid-area`
se pose une fois pour toutes, jamais un span recalculé — et la question reste sous les yeux pièce
ouverte. En dessous, rien ne change : le repli empilé du 30 septembre gouverne tel quel, au mot près.
`rappelQuestion` est étendue à la pièce pour que ce repli ne retrouve pas la friction d'origine sur
petit écran. **Au passage**, un bug réel signalé dans le même retour — la page sautait en haut à
chaque opposition de plaidoirie — tenait à un `el.focus()` sans `preventScroll` dans le repli de
`rendreFocus`, exécuté à CHAQUE opposition puisque le bouton `opposer` efface toujours sa propre clé.
Écrit au document d'abord (§4.6, §4.10 règle 3 CONCEPTION ; §2, §3 ici), appliqué ensuite, joué dans un
vrai Chromium à 1280×800 et sous le seuil à 390×800.

**Le 4 octobre, seconde passe sur le même retour : le tutoriel et les pièces jointes.** Deux points
restés ouverts (§3) ont été tranchés avec l'auteur. **Le tutoriel** : chaque consigne neuve s'affiche
désormais développée, puis se réduit en icône « ? » dès le rendu suivant — ce jeu ne rendant jamais
hors d'un geste du joueur, « le rendu suivant » EST « le joueur a fait quelque chose », sans minuteur.
Se tromper rouvre la bavarde d'elle-même, le texte d'alerte étant une consigne neuve comme une autre.
Un second champ optionnel, `ditLong`, porte la version développée à côté du `dit` court existant —
l'annonce vocale (§4.10 règle 4) lit le long quand il existe. **Les pièces jointes** : le message de
l'avocat ne nomme plus chaque pièce une à une — un seul bouton agrégé (« N pièce(s) disponible(s) dans
ton Contexte ») ouvre le Contexte, où chaque pièce se nomme et s'ouvre comme avant (§4.6). Une pièce
porte un seul nom, et l'index du Contexte en est désormais seul dépositaire. Conséquence en cascade :
la consigne 1/4 du geste « citer » enseigne maintenant « ouvre ton Contexte » plutôt que « ouvre la
pièce », et la suite clavier correspondante se rejoue en deux temps (le bouton du message, puis le chip
du dossier). Document d'abord (§4.6, §4.8 CONCEPTION), code ensuite, joué dans un vrai Chromium par de
vrais clics — pas des appels directs — pour éprouver le bouton agrégé et la réduction du tutoriel,
qu'aucune suite ne voit.

**Le 4 octobre, troisième passe : retenir se voit.** Colas ne voyait pas qu'un clic avait *ajouté*
un passage au Contexte : le fond d'un passage retenu se lisait comme un survol, et seul le lecteur
d'écran entendait *« Retenu dans ton Contexte »*. Trois marques désormais, chacune hors du flux ou le
temps d'un rendu (§4.3 CONCEPTION) : un ✓ en exposant sur le passage, la ligne du rappel — collée au
bas de la pièce — qui dit *« ✓ Retenu dans ton Contexte »*, et la porte Contexte qui s'allume une fois.
La notification « en haut à droite » envisagée par l'auteur est devenue cette ligne **sous la pièce**,
là où le regard est au moment du clic. Le Contexte vide dit aussi **comment** on le remplit. `npm run
vue` capture l'instant juste après un vrai clic sur le passage, en 1280×800 et en 390×800.

**Le 4 octobre, quatrième passe : la pièce s'ouvre DANS le Contexte** (§4.6, §4.8, §4.10 règle 3
CONCEPTION), choix de l'auteur pour supprimer le temps *« Referme la pièce »* : citer passe de cinq
gestes à quatre. Le Contexte se lit de haut en bas — index, pièce, retenus —, la pièce et les retenus
défilant chacun pour son compte ; au-dessus du seuil, la colonne s'élargit tant qu'une pièce est
ouverte. `#panPiece` n'est plus une section : il naît du rendu de `#contexte`. **Une pièce n'est
jamais ouverte hors du Contexte** — `suivrePhrase`, en tête de `rendreTout`, la replie dès qu'il quitte
l'écran, et sa réplique `declenche` part alors (refermer, remplacer, Plaidoirie, envoi). Le halo de
*citer · 1/4* passe à l'index une fois le Contexte ouvert : la « limite assumée » du halo qui pulsait
sur un bouton déjà franchi (§3) tombe avec. **Au passage, l'opposition** : le bouton d'avance dit
*« Continuer »* dès qu'une phrase a été opposée, et la réplique `fin` de la répétition devient une
question (*« … tu as encore quelque chose à y opposer ? »*) à laquelle *« Je n'ai rien à opposer »*
répond enfin. Joué dans un vrai Chromium par de vrais clics, 1280×800 et 390×800.

**Le 4 octobre, cinquième passe : le retour de Jean**, rendu en préconisations par ordre de priorité
(le détail, et ce qui reste, au `TODO.md`). Deux défauts **reproduits sous jsdom avaient une seule
racine** : la remise 1 acceptait une réponse *par anticipation* — 22h30 envoyé à la première question
servait la deuxième, l'avocat en donnait la réplique (la contradiction comprise), la phrase entrait en
Plaidoirie, la deuxième question n'était jamais posée, et le tutoriel, tenant le premier `satisfaits`
pour la citation acquise, se taisait au milieu de *citer*. Arbitré par l'auteur : **la remise du
tutoriel se sert dans l'ordre** (§3) — une réponse à une question à venir y est hors sujet, n'entre pas
en Plaidoirie et **reste à envoyer** (`horsOrdre`) ; les remises suivantes gardent l'anticipation,
*« on élargira »*. **Le tutoriel sort du flux** : une **bulle ancrée au halo**, boîte de dialogue non
bloquante en surimpression, posée sur le premier côté où elle tient (`placerTuto`, §4.8) — elle ne
décale plus rien en se redéployant, ce que `npm run vue` mesure désormais. **Par le contenu seul** :
l'avocat ne dit plus la contradiction avant qu'on la compose (le constat passe dans la réplique qui
accueille la comparaison), ses refus renvoient à la lecture de l'article au lieu de le résumer, et la
réaction spontanée au rapport du labo pousse vers le chiffre sans faire la comparaison à la place du
joueur (§4.8). Le refus *« appel + arrivée »* qu'il signale, lui, **ne se reproduit pas**.
Deux reprises de l'auteur dans la foulée : **une consigne déjà lue reste réduite** — revenir de *4/4* à
*3/4* après *« tout effacer »* ne la redéploie plus, seule l'alerte se redéploie déjà vue (§4.8) ; et
**la remise porte sa première question**, en un seul message, le bouton de pièces après elle (§4.6) —
ce qui répond à Colas, qui ouvrait les pièces sans avoir lu la question posée dessous. La bulle va
désormais **sous** sa zone plutôt qu'au-dessus : la question est au-dessus du bouton de pièces.

**Le 4 octobre, sixième passe : libérer la place de lecture** (retour de Jean). Mesuré d'abord dans
Chromium, en session 2 à 1280×800 : l'index du dossier, une puce par ligne, prenait 282 px et la
pièce n'en gardait que 121 — deux lignes ; à 390×800, la pièce n'apparaissait plus du tout. **Pièce
ouverte, l'index se replie en une ligne** — *le dossier, son compte*, qu'un clic déplie et que la
pièce suivante replie (§4.6) — et les retenus plafonnent à 30 % au lieu de 38 %. À 1280×800, le texte
passe à 226 px : le rapport du labo se lit en entier, le PV en sept lignes. Les retenus ne se
replient pas : ils sont le clavier du composeur et l'ancre de *citer · 3/4*. **Sur un téléphone, le
gain ne suffit pas** — la pièce revient à l'écran, sur deux lignes : à juger sur un vrai appareil.
Dans la foulée, trois demandes de l'auteur : **l'index se replie à tout moment**, pas seulement pièce
ouverte — il laisse la place au reste, et le bouton de pièces du message le déplie ; **le Contexte
prend les deux tiers de la largeur** au-dessus du seuil (la Plaidoirie garde sa colonne étroite) ;
**les pièces passent en corps de lecture**, 15 px au lieu de 17 (§4.6). Puis **la pièce prend la
hauteur de son texte, les retenus tout le reste** : une pièce courte laissait du papier vide pendant
que les retenus, plafonnés, défilaient dessous. Et sur téléphone, arbitré : **le Contexte reste entre
la conversation et le composeur** — la pièce y reste à deux lignes, à juger sur un vrai appareil.
Enfin, **le marquage ne se montre qu'au survol ou au clic** (§4.3) : le texte d'une pièce se lit nu,
un passage se souligne quand on passe dessus ou qu'on l'atteint au clavier, et garde sa marque une
fois retenu — au toucher, c'est le clic qui la pose. Puis **la légende est retirée**, et **une
bordure légère, neutre et arrondie** dit qu'un passage se clique, sans dire sa dimension (§4.3).

## 2. Points de vigilance

*Le **concentré** : ce qui a déjà mordu, rassemblé pour une relecture avant de toucher au code. Chaque
point est argumenté là où il mord — un § du système, ou un PIÈGE dans le fichier ; cette liste ne les
remplace pas, elle les rappelle d'un trait.* Les **[Rn]** sont tenus par une règle du gardien — ils
tiennent en une ligne parce qu'on n'a plus à y penser ; les autres ne sont tenus par rien.

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**.
- **[R6]** Quatre ids sont des ancres du tutoriel : `#discussion`, `#panPiece`, `#zoneRetenus`, `#composeur`.
- **[R9]** Le tag vit sur l'**attente**, jamais sur la remise — quatre fonctions exceptées.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.
- **[R12]** L'export commité est bien celui que produit `npm run export`.
- **[R13]** Aucune suite ne journalise par `R.clore` — `H.assembler` s'arrête au composeur.

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
- **`#tuto` est une bulle en `position:fixed`, et c'est `placerTuto` qui l'empêche de recouvrir ses
  ancres** (§4.8) — plus le flux. Elle se pose à côté du **rectangle VISIBLE** de la cible (le
  rectangle coupé par chaque ancêtre qui défile : une zone à moitié défilée n'est pas là où son
  `getBoundingClientRect` le dit), sur le premier côté où elle tient. Elle se replace à chaque
  `majTutoriel`, et sur `resize` et `scroll` **en capture** — un `scroll` ne remonte pas, et ce sont les
  bandes qui défilent, jamais la page. **Aucune suite ne voit une géométrie** (jsdom rend des
  rectangles nuls) : `npm run vue` seul la montre. Elle reste **premier enfant de `<body>`, hors de
  `.wrap`** : premier arrêt de tabulation, et vivante si `finir` rend `.wrap` inerte ; son `z-index:60`
  la garde au-dessus de l'`.overlay` (50).
- **La PLACE DES PANNEAUX DANS LE DOCUMENT est toute la mécanique** : entre la section Discussion et
  `#composeur`, dans le flux, en dessous du seuil de `.wrap.avecLateral` — la pièce ouverte, elle, vit
  DANS le Contexte (§4.6, §4.10 règle 3 CONCEPTION) et ne passe plus par `#modalRoot`. Les déplacer
  ailleurs dans `.wrap`, ou les repasser en `position:absolute` (ce qu'ils ont été une heure), leur
  refait recouvrir la conversation — et **rien ne le dirait**, aucune suite ne voyant une géométrie.
- **La colonne tient dans la fenêtre, et la conversation est la SEULE bande élastique EN HAUTEUR en
  dessous du seuil de `.wrap.avecLateral`** (§4.6) : `body` en colonne de `100dvh`, la conversation en
  `flex:1` **avec `min-height:0`** — sans lui, elle refuse de rétrécir et pousse « → Envoyer » sous le
  pli. Aucune suite ne voit une géométrie : `npm run vue` le **dit**, il ne l'asserte pas. *1280×800,
  son gabarit habituel, est AU-DESSUS du seuil de 900px : la capture y exerce désormais la colonne
  latérale en grille, pas l'empilement — `npm run vue` doit aussi capturer un gabarit sous 900px pour
  éprouver l'élasticité verticale d'origine.*
- **Une pièce n'est JAMAIS ouverte hors du Contexte** : `suivrePhrase`, en TÊTE de `rendreTout`, la
  replie dès que `panneau` n'est plus `"contexte"` — toutes les portes qui le referment passent donc
  par là, et la réplique `declenche` tombe dans le fil AVANT qu'il soit dessiné. Le déplacer après
  `renderDiscussion` ferait paraître la réplique un geste trop tard ; le retirer laisserait une pièce
  ouverte invisible, `S.modalPiece` compris. Une partie reprise sur une pièce ouverte rouvre le
  Contexte au démarrage, sans quoi le premier rendu la replierait, réplique comprise.
- **L'index se replie, mais `#zoneDossier` reste là** (§4.6) : c'est une ancre du tutoriel (R6), et
  le halo doit pouvoir l'entourer replié. Les puces restent dans le DOM, sous `hidden` — le motif
  *disclosure* standard, et `data-f="d:pid"` survit pour le retour du focus. **Deux** états d'ÉCRAN,
  comme `panneau`, jamais sauvés : `dossierPlie` (le choix du joueur sans pièce) et `dossierDeplie`
  (celui du temps d'une pièce, remis à faux par `ouvrirPiece`) — un seul ferait oublier, à la pièce
  repliée, ce que le joueur avait choisi avant. `voirPiecesRecues` déplie les deux.
- **Pièce ouverte, `#contexte` porte deux bandes défilantes de plus** (`.defile[id]`) :
  `garderDefilement` les retrouve par leur id. Une bande sans id repartirait en haut à chaque geste.
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
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher un panneau (Contexte, Plaidoirie, et
  désormais la pièce) demande `.col[hidden]{display:none}` — sans lui, `display:flex` l'emporterait.
  *Point corrigé : `.cloture` et `#composeur` ne sont plus « câblés sur trois colonnes » depuis que la
  grille `.wrap.sansPlan` a disparu avec elle (commit `63a7e06`) — ils sont de simples enfants du flex
  `.wrap`, pleine largeur par défaut. La classe `.wrap.avecLateral` (§4.6 CONCEPTION) qui rouvre une
  colonne latérale n'y touche pas davantage : elle pose `grid-area` une fois pour toutes, jamais un
  span recalculé.*
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
- **[R13]** Une suite ne marche que les **portes du joueur** : `R.clore` n'en est pas une, et le
  harnais y est passé des années — l'état « close, pas encore versée » étant inatteignable en jeu,
  trois contrôles de la répétition sont restés verts pendant que le présentoir était mort. *Avant
  d'ajouter un contrôle, demander par quelle PORTE D'ÉCRAN le joueur atteint cet état* : c'est la
  variante coûteuse du *« une suite peut passer par le vide »* ci-dessus, et la seule que R13 voit.
- **Le doublon banal porte tout le camouflage** (§4.4) : ne jamais désactiver son contrôle.
- **Le tutoriel enseigne deux gestes, la citation puis la comparaison, et ne ferme pour de bon
  qu'à la fin de la session 1** (`S.remisesEnvoyees>1`) — pas au premier `S.satisfaits`, qui ne
  marque que la fin du premier geste. Entre les deux, il se tait sans se fermer. **Et ce premier
  `S.satisfaits` ne veut dire « citation acquise » que parce que la remise 1 se sert DANS L'ORDRE**
  (`horsOrdre`, §3 CONCEPTION) : une réponse qui servait par anticipation la deuxième question
  passait pour la première, et le tutoriel se taisait au milieu de *citer*.
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
- *Fermée par un retour de playtest (Colas) : « trois bandes empilées, une pensée ou un tableau de
  bord ? ». Un joueur devait fermer la pièce ouverte pour relire la question qu'elle recouvrait — objet
  nommé, l'arbitrage du va-et-vient entre deux colonnes rouvre (§4.6 CONCEPTION) : au-dessus d'un seuil
  de largeur, la pièce et les panneaux rejoignent une colonne latérale à CÔTÉ de la conversation, plus
  question de la recouvrir pour la lire.*
- **La colonne latérale répare-t-elle la lecture sans en coûter une autre ?** La question qui la
  remplace : ordre de tabulation en L (discussion → latérale → composeur) au clavier, poids visuel du
  deux-colonnes retrouvé, risque de formulaire que le §3 redoute depuis toujours sous une autre forme.
  **Non joué.**
- **« Je n'ai rien à opposer » n'est pas une formulation à corriger — Colas y a lu une friction de
  bouton de conclusion, pas l'acte moral qu'il porte (§4.9 règle 5 CONCEPTION).** Le signal reste réel :
  la question n'est pas de changer le texte, mais de savoir si le joueur dispose d'assez de signaux
  *autour* du bouton (qu'il clôt la partie, que le moment compte) pour que le poids moral ait une chance
  d'être senti plutôt que de n'être qu'une confusion de parcours. **Non tranché, et pas à trancher par
  un renommage réflexe.**
- **L'opposition, rejouée le 4 octobre dans un vrai Chromium (1280×800) — ce qui embrouille, constaté
  et non corrigé** :
  1. *Corrigé le 4 octobre :* après un *opposer*, le bouton d'avance disait encore *« Ne rien opposer —
     continuer »*. Il dit *« Continuer »* dès qu'une phrase est opposée à l'affirmation en cours.
  2. **Une phrase opposée ailleurs garde un bouton *opposer* identique** — le cliquer la DÉPLACE d'une
     affirmation à l'autre (*« opposé à : le témoignage »* disparaît), sans que rien ne le dise.
  3. **La réplique est la même à chaque fois** (*« Je l'ai déjà. Je le mets en face de celle-ci. »*),
     que la phrase réponde à l'affirmation ou non (le PV opposé à l'ADN reçoit la même) : rien ne se
     trie à l'écran, alors que c'est la raison d'être de la répétition (§4.6).
  4. **Le présentoir se lit mal** : quatre lignes en petit gris, quatre boutons *opposer* identiques,
     et l'affirmation visée est au-dessus, dans le fil, plus dans le cadre.
  5. *Corrigé le 4 octobre, par le contenu seul :* la fin ne répondait à aucune question — *« C'est tout ce qu'ils ont. Je dépose au matin. »* est
     une affirmation, puis paraît *« Je n'ai rien à opposer »* — c'est la friction de Colas. Le PIÈGE
     du §2 le dit : la question qui appelle le bouton vit dans le CONTENU. **Repli sans code, et sans
     renommer** : la réplique `fin` est devenue une question (*« … Je dépose au matin — tu as encore
     quelque chose à y opposer ? »*), à laquelle le bouton répond.
  6. **La voix du composeur continue d'enseigner** (*« Prends un ou plusieurs passages… »*) pendant la
     répétition, où l'on n'écrit plus.
- *Fermé le 4 octobre, suite 2 : « décomposer le tutoriel ».* Chaque consigne neuve s'affiche d'abord
  développée, puis se réduit en icône « ? » dès que le rendu suivant confirme qu'elle reste active — un
  clic sur l'icône la rouvre, se tromper la rouvre aussi (§4.8 CONCEPTION.md). Les deux frictions
  opposées du 16 septembre (pris pour un bandeau de cookies / vu trop tôt) sont traitées par le même
  mécanisme : la forme développée reste ponctuelle, jamais permanente — ni totalement absente.
- *Fermé le 4 octobre, suite 2 : « masquer les pièces jointes du fil ».* Le message ne porte plus qu'un
  bouton agrégé (« N pièce(s) disponible(s) dans ton Contexte », classe `.attach` conservée) qui ouvre
  le Contexte sans le basculer ; chaque pièce s'y ouvre et se nomme comme avant (§4.6). Le sentiment de
  réception reste porté par le message — le trombone y reste accroché —, seul le détail nominatif se
  déplace vers l'index déjà existant. *Levée le 4 octobre, suite 4 :* le halo du tutoriel pouvait pulser sur le bouton
  du message un instant après qu'il a été cliqué, le temps que le joueur choisisse une pièce dans le
  Contexte — le Contexte ouvert, il passe désormais à l'index (§4.8).
- *Fermé le 4 octobre, suites 3 et 4 : « un visuel qui dit qu'un passage a été ajouté au Contexte ».*
  ✓ sur le passage, ligne sous la pièce, fiche neuve allumée juste dessous, porte allumée (§4.3).
- **La pièce dans le Contexte tient-elle sur un téléphone ?** En 390×800, index, pièce et retenus se
  partagent un panneau bas : il redéfile d'un bloc, l'index part hors champ. Lisible, mais serré —
  **à jouer sur un vrai téléphone.** Et au-dessus du seuil : la conversation rétrécie par la colonne
  élargie reste-t-elle confortable ?
- **RAG sur les messages de l'avocat** (pouvoir citer un passage qui ne vient pas d'une pièce jointe),
  **regroupement des passages retenus en clusters**, **chain-of-thought pour les choix moraux** (une
  phase où l'IA se parle à elle-même, suggérée après une déconnexion de Maître Auber) : trois idées
  venues d'un retour de playtest, **aucune encore nulle part dans la documentation**. Consignées ici pour
  ne pas les perdre — à ne pas coder avant que la boucle de base (le sujet de cette passe) soit validée
  par un joueur neuf, conformément au §4.
- **`porte sur : quand`, sous chaque article, fait-il le tri à la place du joueur ?** Un joueur
  l'écrit noir sur blanc : *deux fiches QUI → seul l'art. 7 colle*. Le moteur ne lit jamais `porte`
  (§4.5), mais l'étiquette filtre **dans la tête** — et le choix entre l'article 7 et l'article 12
  fait toute la session 2 (§6). Le retirer est une ligne ; **à juger sur une partie, le recadrage en
  place.**
- **L'article s'offre sans avoir été lu** : `blocsDepuis` filtre sur `piecesLivrees` — *reçu*, pas
  *lu*. Passer à `S.examinees` est un mot, et l'invariant du §4.5 deviendrait *« on n'invoque pas un
  texte qu'on n'a pas lu »*. Non tranché.
- *Fermé le 2 octobre : la **légende** de chaque pièce nomme les dimensions qu'elle porte (§4.3).
  Deux playtests l'avaient demandée, et le `title` qui la remplaçait n'existait ni au clavier ni au
  toucher. Reste à voir si elle suffit, ou si le joueur passe à côté.* **Rouvert par Jean : il passe
  à côté.** Posée au bas du texte, elle sort du champ dans une fenêtre de pièce de deux lignes, et il
  demande la légende des cinq traits **avant** de retenir — indispensable au toucher, sans survol.
  **Retirée par l'auteur** (§4.3) : depuis que le marquage ne se montre qu'au survol ou au clic, elle
  ne disait rien qu'on ne voie en passant sur un passage. Le code s'apprend en cherchant ; une
  bordure neutre dit seulement qu'un passage se clique.
- **Le Contexte à dix-sept fiches** : l'index du dossier grossit avec le dossier, et les passages de
  la session 1 restent en tête. Trier, replier ou filtrer serait *juger* ce que le §4.6 promet de ne
  jamais juger — d'où, pour l'instant, un plancher au panneau, un index resserré, le dernier retenu
  amené dans le champ et le fondu qui dit qu'il en reste. **Sorti du panneau, l'index donnerait de
  l'air** : écarté le 2 octobre pour ne pas ouvrir une troisième porte, à rouvrir si ça remord.
  **Ça remord (Jean)** : en session 2, la pièce ouverte ne montre que deux lignes — et déjà en
  session 1 à 1280×800, sur les captures —, et les fiches de l'affaire close restent en tête. Il
  propose de replier index et retenus pièce ouverte, et de ranger les affaires closes : replier par
  remise ne juge aucun passage, c'est un fait de remise. *Le 4 octobre, sixième passe : l'index se
  replie pièce ouverte (§4.6) — à 1280×800 la pièce se lit en entier ; à 390×800 elle reste à deux
  lignes, le panneau entier ne faisant que 353 px — et l'auteur l'y garde, entre la conversation et
  le composeur. Restent les affaires closes.*
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
- **Les heures se comparent sans leur date** : *« l'heure de fin du relevé sur la scène précède
  l'heure d'arrivée de la patrouille »* — 14h02 avant 22h04, mais pas le même jour. Une phrase
  fausse se lit comme un bug (§8.8). Repli connu : dater les `valeur` en ISO, que `comparer` trierait
  lexicographiquement **sans toucher au moteur**.
- **Aucune barrière entre les affaires** : fiches et articles de la session 1 restent composables
  dans la session 2. C'est voulu — le Contexte est gratuit et cumulatif (§4.6) — mais ça produit des
  phrases qui n'ont pas de sens, et le joueur l'a essayé exprès.
- **La croix d'un panneau et celle d'une fiche portent le même signe** : un joueur a fermé le
  panneau en croyant retirer un passage.
- **La question épinglée n'existe pas en session 2** : sa demande vit dans le *texte de la remise*,
  qu'aucune règle ne sait rappeler (§4.9 règle 3). Le repli est connu — descendre la demande sur une
  `question` d'attente, comme en session 1 — et il coûte zéro ligne de code.
- **L'article 12 approuvé par l'avocat quand il se retourne contre la défense** : le joueur y a vu un
  défaut. **C'est le faux vice** (§6, §8.5) — l'avocat ne sait pas, il y pousse lui-même, et les
  `variante_faux` des fins le paient. À ne pas « corriger » ; peut-être à rendre plus lisible à la fin.
- Côté outil : la frise n'édite pas `rep_hors_sujet` (§15).
- **Le retour de Jean, ce qui reste** (détail au `TODO.md`) — trois préconisations vont contre un
  arbitrage écrit, à trancher document d'abord : **offrir deux ou trois relations au choix, dont des
  fausses**, renverserait *désigner, pas déclarer* (§4.5) ; **réserver au tutoriel les garde-fous** —
  fiches d'une autre dimension assombries, refus de catégorie avant l'envoi — lèverait *le seul refus
  qui existe* (§4.5) ; **donner un coût à l'erreur** (jauge de patience, envois comptés) rendrait
  l'enjeu calculable s'il se voit (§8.4). Sans arbitrage contraire : **marquer les fiches déjà prises**
  et dire pourquoi une troisième est refusée (aujourd'hui un `title` sur un bouton `disabled`, que ni
  le toucher ni le clavier n'atteignent, §4.10). *Le soulignement au survol ou au clic, demandé par
  l'auteur, est fait (§4.3), la légende retirée et les passages encadrés d'une bordure neutre* —
  reste à voir, au toucher, si un joueur comprend ce que couleur et trait veulent dire : il ne les
  voit qu'une fois le passage retenu.
- **La bulle ancrée n'a été jouée que dans Chromium**, 1280×800 et 390×800 : sur un vrai téléphone,
  et à côté d'une zone longue comme le texte de la pièce, couvre-t-elle ce qu'on vient chercher ? Elle
  se réduit au geste suivant ; reste à savoir si ça suffit.

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer** — la
précédente l'a prouvé : une partie rapportée geste par geste a valu plus que trois passes de
relecture. **Il faut la rendre à un joueur neuf**, qui n'a pas lu ce qui précède :

1. **La calibration se sent-elle ?** La session 1 passe-t-elle pour un examen, et la remise 2 pour le
   moment où l'avocat cesse de savoir ? *Le 2 octobre a répondu à moitié — « l'affaire 1 assumée
   comme examen » — mais le même joueur trouvait encore que l'avocat raisonne à sa place. Le bandeau
   a cessé de le doubler depuis ; à rejouer.*
2. **Le Contexte tient-il sous la composition ?** C'est la question du 2 octobre, et la seule que
   `npm run vue` sait poser : à deux fiches pendant la comparaison, puis à dix-sept.
3. **Rejouer la session 1 avec les nouveaux libellés** (*« et l'article 3 écarte la déposition qui
   s'y heurte »*) : la phrase composée se lit-elle comme une pensée ou comme un formulaire ? C'est le
   premier point ouvert du §3 — et l'excuse la plus facile vient d'être retirée.
4. **Envoyer une comparaison nue** et voir si le refus de Maître Auber enseigne (§4.5) — c'est du
   contenu qui n'a jamais pu sortir.
5. **Retirer `porte sur`** du composeur et rejouer la session 2 : le choix entre l'article 7 et
   l'article 12 se fait-il encore, ou l'étiquette le faisait-elle seule (§3) ?
6. Si la boucle tient : écrire la session 3 et placer la porte de la Fin 3. Sinon, prendre l'un des
   replis du §3, qui ne coûtent aucune ligne de code.
7. **Rendre la partie au testeur du clavier**, lecteur d'écran allumé (NVDA, VoiceOver) : les annonces
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
- **2 octobre, la partie rejouée sur cette version** — la moitié des reprises tient, et ce qui ne
  tient pas vient de la passe elle-même : l'index collant et le panneau sans plancher écrasaient le
  Contexte (§4.6), d'où plancher, plafond, index resserré et **barre du composeur collante** pour que
  *« → Envoyer »* ne passe plus sous le pli. Le bandeau cesse de désigner la trouvaille, que la
  fiction porte seule (§4.8), avec quatre accidents de langue. **La répétition devient vraie** : on
  n'y envoie plus, on **oppose**, et `verserContre` enregistre ce que sa réplique annonçait depuis
  toujours (§4.6). Une **légende** apprend le code des soulignements sans survol (§4.3). Et un piège
  neuf entre au §2 : *une suite peut prouver un chemin que le joueur ne peut pas marcher* — c'est
  ce qui avait laissé le présentoir mourir, vert en test et mort en jeu.
- **4 octobre, retour de playtest externe (Colas) et colonne latérale** — le va-et-vient entre deux
  colonnes, clos le 30 septembre faute d'objet, **rouvre avec un objet nommé** : fermer la pièce pour
  relire la question qu'elle recouvrait. La pièce quitte `#modalRoot`/`inert` et rejoint la place
  LATÉRALE aux côtés du Contexte et de la Plaidoirie (§4.6, §4.10 règle 3) ; au-dessus de 900px cette
  place devient une colonne à côté de la conversation, par un gabarit `grid-template-areas` **nommé**
  qui évite les deux PIÈGES de span recalculé de l'ancienne grille à trois colonnes (`63a7e06`). En
  dessous du seuil, le repli empilé du 30 septembre est inchangé. Au passage : le scroll qui sautait en
  haut à chaque opposition (`rendreFocus`, `preventScroll` manquant sur un repli de focus exécuté à
  chaque fois) est corrigé. Cinq fichiers de test et `outils/vue.js` suivent le renommage
  `majPanneaux`→`majLateral`, `closeModal`→`fermerPiece` pour la pièce ; `npm run vue` gagne un
  troisième contexte, 390×800, sous le seuil — sans lui, le repli empilé ne serait plus rejoué par rien.
- **4 octobre, seconde passe : le tutoriel bavarde/icône et les pièces agrégées** — deux points du
  même retour, restés ouverts après la colonne latérale. Le bandeau `#tuto` affiche désormais chaque
  consigne neuve développée (`ditLong`, nouveau champ optionnel à côté du `dit` court), puis se réduit
  en icône « ? » dès le rendu suivant — sans minuteur, ce jeu ne rendant jamais hors d'un geste du
  joueur. Le message de l'avocat ne nomme plus les pièces une à une : un bouton agrégé
  (`voirPiecesRecues`) ouvre le Contexte sans le basculer, où l'index (`renderDossier`) reste seul
  dépositaire du nom de chaque pièce (§4.6). La consigne 1/4 du geste « citer » change de cible en
  cascade (« ouvre ton Contexte » plutôt que « ouvre la pièce ») et la suite clavier correspondante se
  rejoue en deux temps. `npm run vue` clique désormais pour de vrai sur le bouton du message et sur un
  chip du dossier, au lieu d'appeler `ouvrirPiece` directement — seul moyen d'éprouver la réduction du
  tutoriel, qu'aucune suite n'a jamais vue. 421 contrôles sur cinq suites, 8 règles du gardien, ESLint.
- **4 octobre, troisième passe : retenir se voit** — ✓ en exposant sur le passage retenu, ligne
  *« ✓ Retenu dans ton Contexte »* collée au bas de la pièce et porte Contexte allumée, le tout le temps
  d'un rendu (`vientDeRetenir`, frère de `rappelRetrait`) ; le Contexte vide dit comment on le remplit
  (§4.3). Trois contrôles dans `test_parcours`, deux captures `piece-retenu` dans `npm run vue`.
  424 contrôles, 8 règles du gardien, ESLint.
- **4 octobre, quatrième passe : la pièce dans le Contexte** — index, pièce, retenus dans le même
  panneau ; plus de temps *« Referme la pièce »* (citer en quatre gestes) ; `suivrePhrase` replie la
  pièce dès que le Contexte quitte l'écran et porte sa réplique `declenche` ; colonne élargie au-dessus
  du seuil (`.wrap.avecPiece`) ; la fiche neuve s'allume sous la pièce (`.mchip.neuf`) et la ligne de
  confirmation repasse dans le flux. Opposition : *« Continuer »* après un *opposer*, réplique `fin` en
  question. 434 contrôles, 8 règles du gardien, ESLint.
- **4 octobre, cinquième passe : le retour de Jean** — la remise du tutoriel servie dans l'ordre
  (`horsOrdre`, §3) ; le tutoriel en bulle ancrée au halo, en surimpression (`placerTuto`, §4.8) ;
  l'avocat qui commente après la composition, des refus qui renvoient à la lecture, une réaction
  spontanée qui pousse sans calculer (contenu seul). `npm run vue` mesure que la bulle ne décale
  rien. Puis : une consigne déjà lue reste réduite (`tutoVues`), et la remise porte sa première
  question en un seul message, les pièces après (`question` sur l'entrée du fil). 458 contrôles,
  8 règles du gardien, ESLint.
- **4 octobre, sixième passe : la place de lecture** — pièce ouverte, l'index se replie en une ligne
  (`dossierDeplie`, `basculerDossier`, puces sous `hidden`) ; retenus plafonnés à 30 %. Puis l'index
  repliable à tout moment (`dossierPlie`), le Contexte aux deux tiers (`.wrap.avecContexte`, qui
  remplace `.wrap.avecPiece`), les pièces en 15 px ; la pièce à la hauteur de son texte (plafond
  70 %), les retenus prennent le reste ; le marquage au survol ou au clic (`.empan`, décoration
  posée mais transparente) ; la légende retirée (`legendePiece` supprimée, `portePiece` garde sa
  forme sous `.porte`), une bordure neutre sur chaque passage. 469 contrôles, 8 règles du gardien,
  ESLint.

# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 8 octobre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins — **à la souris comme au
clavier seul**. `npm test` est vert — 655 contrôles, 8 règles du gardien, ESLint.

**Le 8 octobre, le cas médicaments — à trancher, rien n'est codé.** Un document de l'auteur remplace
l'affaire ADN : même client, même calibration, une relation unique *cohérent / pas cohérent* pour
toutes les dimensions, trois remises, et des aveux en garde à vue qui sont à la fois la preuve
(l'IA *sait*) et le vice (recueillis sans l'avocat demandé). Il est posé tel quel, avec l'idée d'un
suicide-vengeance ajoutée le même jour, comme **base de réflexion** dans `docs/CAS_MEDICAMENTS.md`,
suivi d'une proposition d'intégration et de huit questions ⚖. Le point dur : la vérité d'une
relation ne se tire plus des valeurs, l'auteur la déclare. Un essai jetable du moteur, hors du
dépôt, en a mesuré le prix : +23 lignes, 654 contrôles sur 655. **CONCEPTION et le code n'ont pas
bougé.**

**Le 8 octobre, relecture du glossaire (§17)** après les passes I à M. Le §17 perd `recuAvant`,
gagne DOCUMENTS et la règle **pièce ou document** (*auteur* : *pièce* quand c'en est une, *document*
quand ce peut être un article — ‹ › et la croix disent désormais *« Document suivant »*, *« Replier le
document »*), et range *retenir* parmi les faux amis : il survit au sens de la PLAIDOIRIE. Les
commentaires et les libellés des suites disent DOSSIER, les identifiants gardent `contexte`. La
répétition dit *« Opposer une réponse »*. L'atelier ne parle plus de fiche d'article ni de règles
livrées, et son pas-à-pas ne « surligne » plus : un passage s'y prend dans une pièce ouverte, comme
au jeu ; il referme aussi la pièce dès qu'on fait autre chose que la lire, si bien que sa réplique
(`declenche`) part enfin. Au passage, ESLint était rouge depuis la passe M (`i` inutilisé dans `renderDISCUSSION`).

**Le 8 octobre, passe M : le retour de Jean.** L'index ne se replie plus d'office quand une pièce
s'ouvre — *« Déplie tes DOCUMENTS »* coûtait un temps et un nom (§4.6) ; ‹ › restent en boucle,
choix de l'auteur. Le texte d'un article a l'aspect d'un passage : les cadres de `porte` quittent le
texte pour un filet sous le titre (§4.3, §4.11). Et, de l'auteur : la voix dit *« Ouvre un document
et clique… »* et déplie l'index ; le bouton de remise dit *« 2 documents ajoutés au DOSSIER »*.

**Le 8 octobre, passe L : le CONTEXTE s'appelle DOSSIER.** Les retenus partis, le panneau ne porte
plus que des documents, et prend leur nom (§4.6, *auteur*) ; son index, qui s'intitulait DOSSIER,
s'intitule **DOCUMENTS** — pièces reçues et articles trouvés —, et sa seconde colonne *Les
articles*, plus *Les règles*. À l'écran seulement : le code garde `contexte`, comme il garde *la phrase*
(§17). L'historique ci-dessous garde l'ancien nom.

**Le 8 octobre, passe K : plus de passages retenus.** Demande de l'auteur : *« on clique sur les
passages pour les mettre dans la RÉPONSE, et c'est tout ; on ne garde que la notion de DOSSIER »*.
Les fiches du CONTEXTE s'en vont, et avec elles `S.retenus`, *retenir* et *oublier* (§4.6) : un clic
dans la pièce pose le passage, ou la ligne sous la pièce dit pourquoi il ne le peut pas (§4.3) ; le
CONTEXTE ne porte plus que l'index, la recherche et la pièce, qui prend toute la hauteur. Le tutoriel
perd son temps *« prends sur ta fiche »*, et **gagne *« → Envoyer »***, entouré à la fin de chaque
geste (§4.8) — un arbitrage du §4.8 renversé. Ce que ça coûte : essayer des paires se fait en
rouvrant les pièces, et le nom d'une dimension ne se lit plus qu'au survol (§3).

**Le 7 octobre, passes I et J.** L'écran dit *ta RÉPONSE*, jamais *ta phrase* — le code et le
document gardent *la phrase* (passe I). Puis **l'article se cherche** (passe J, §4.5) : l'avocat n'en
livre plus ; la relation choisie, *« Chercher un article correspondant »* rend, dans le CONTEXTE, les
trois articles dont `porte` couvre la dimension de la paire, dans un ordre tiré au hasard ; un
résultat s'ouvre, son texte se clique, l'article fonde la phrase et rejoint le dossier — **on ne
retient plus un article**, et la fiche de la passe F s'en va. Le tutoriel découpe la comparaison en
trois temps ; en session 1, une comparaison nue ne part pas (§4.11 point 6). Neuf articles leurres,
premier jet, **à réécrire par l'auteur** (`TODO.md`).

Le 15 septembre a changé deux choses, toutes deux venues d'une **partie jouée** : **la session 1 va
jusqu'à la comparaison** (l'article 3 arrive avec le premier lot, trois sessions deviennent deux, §3)
et **clore et envoyer n'en font plus qu'un** (`vice_trouve` se lève à l'**assemblage**, sans quoi la
Fin 2 devenait injouable, §4.7).

Le 16 septembre est une session d'**écriture**, pas de mécanique : la liaison-article dit désormais
*« en contradiction avec »* et non *« au regard de »* (§4.5 — tous deux refaits depuis, voir plus
bas), la première question descend dans le **texte de la remise** (elle en est **ressortie** le
1ᵉʳ octobre), le tutoriel est repris, un empan ne se désélectionne plus depuis sa pièce, et
la **colonne PLAIDOIRIE est escamotée** — provisoirement, mécanique intacte derrière (§4.9). Deux de
ces gestes ont fait tomber **cinq contrôles** qui nommaient du contenu au lieu de le dériver : ils sont
réécrits, et la doc est remise d'aplomb sur ce que le code fait.

**Deux passes de retours playtest** ont suivi, sur la même partie jouée. La première a rendu le
tutoriel plus lisible, fait de `#composeur` un bandeau plein largeur et appliqué le repli du §4.6 — un
clic dans le composeur fait descendre le CONTEXTE. La seconde reprend ce que cette partie montrait
encore : **le CONTEXTE tombe à un tiers de la largeur** (la DISCUSSION prend les deux autres, et le
tiers ne bougera pas au retour de la PLAIDOIRIE), **l'index nomme les pièces comme la DISCUSSION les a
transmises** — plus d'abréviation à faire de tête au moment de retrouver une pièce —, et **le bandeau
du tutoriel monte en tête de page, dans le flux** : il pousse le jeu au lieu de le recouvrir (§4.6,
§4.8).

**Les deux surfaces de côté sont devenues des PANNEAUX** (§4.6, §4.9). L'écran n'a plus qu'une colonne,
empilée en **trois bandes** : la conversation, le panneau ouvert, le composeur. Le CONTEXTE et la
PLAIDOIRIE s'ouvrent **entre** les deux autres et **ne recouvrent rien** — la conversation rétrécit
pour leur faire place, si bien que la question reste sous les yeux pendant qu'on choisit un passage et
qu'on voit la phrase se construire. Deux portes y mènent : **la voix du composeur**, qui devient un bouton quand le geste qu'elle nomme a lieu
ailleurs, et **une barre** dans le titre de « RÉPONSE », qui nomme les deux surfaces et donne leur
compte. Un panneau ouvert *pour écrire* suit la phrase et se referme avec elle ; ouvert *pour
consulter*, il reste. **La PLAIDOIRIE sort de son escamotage** par la même occasion, et la colonne qui
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
revenir**, et l'escamotage de la PLAIDOIRIE est **provisoire** (§3). Quatrième : `_bruit` cesse d'être
une liste recopiée dans l'atelier — le drapeau passe **sur l'empan** (§11), donc il s'exporte, suit les
renommages et meurt avec lui.

**Le 1er octobre, la DISCUSSION devient une conversation** : nos répliques portent le nom d'**IAvocat**
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
*« une seule et même personne »*, la réplique du labo qui attend la fermeture, le CONTEXTE qui
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
remise** pour pouvoir être rappelée. Le **CONTEXTE dit qu'il déborde** : barre toujours visible,
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
CONTEXTE et la PLAIDOIRIE (§4.6, §4.10 règle 3 CONCEPTION) : un seul occupant à la fois, et désormais
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
ton CONTEXTE ») ouvre le CONTEXTE, où chaque pièce se nomme et s'ouvre comme avant (§4.6). Une pièce
porte un seul nom, et l'index du CONTEXTE en est désormais seul dépositaire. Conséquence en cascade :
la consigne 1/4 du geste « citer » enseigne maintenant « ouvre ton CONTEXTE » plutôt que « ouvre la
pièce », et la suite clavier correspondante se rejoue en deux temps (le bouton du message, puis le chip
du dossier). Document d'abord (§4.6, §4.8 CONCEPTION), code ensuite, joué dans un vrai Chromium par de
vrais clics — pas des appels directs — pour éprouver le bouton agrégé et la réduction du tutoriel,
qu'aucune suite ne voit.

**Le 4 octobre, troisième passe : retenir se voit.** Colas ne voyait pas qu'un clic avait *ajouté*
un passage au CONTEXTE : le fond d'un passage retenu se lisait comme un survol, et seul le lecteur
d'écran entendait *« Retenu dans ton CONTEXTE »*. Trois marques désormais, chacune hors du flux ou le
temps d'un rendu (§4.3 CONCEPTION) : un ✓ en exposant sur le passage, la ligne du rappel — collée au
bas de la pièce — qui dit *« ✓ Retenu dans ton CONTEXTE »*, et la porte CONTEXTE qui s'allume une fois.
La notification « en haut à droite » envisagée par l'auteur est devenue cette ligne **sous la pièce**,
là où le regard est au moment du clic. Le CONTEXTE vide dit aussi **comment** on le remplit. `npm run
vue` capture l'instant juste après un vrai clic sur le passage, en 1280×800 et en 390×800.

**Le 4 octobre, quatrième passe : la pièce s'ouvre DANS le CONTEXTE** (§4.6, §4.8, §4.10 règle 3
CONCEPTION), choix de l'auteur pour supprimer le temps *« Referme la pièce »* : citer passe de cinq
gestes à quatre. Le CONTEXTE se lit de haut en bas — index, pièce, retenus —, la pièce et les retenus
défilant chacun pour son compte ; au-dessus du seuil, la colonne s'élargit tant qu'une pièce est
ouverte. `#panPiece` n'est plus une section : il naît du rendu de `#contexte`. **Une pièce n'est
jamais ouverte hors du CONTEXTE** — `suivrePhrase`, en tête de `rendreTout`, la replie dès qu'il quitte
l'écran, et sa réplique `declenche` part alors (refermer, remplacer, PLAIDOIRIE, envoi). Le halo de
*citer · 1/4* passe à l'index une fois le CONTEXTE ouvert : la « limite assumée » du halo qui pulsait
sur un bouton déjà franchi (§3) tombe avec. **Au passage, l'opposition** : le bouton d'avance dit
*« Continuer »* dès qu'une phrase a été opposée, et la réplique `fin` de la répétition devient une
question (*« … tu as encore quelque chose à y opposer ? »*) à laquelle *« Je n'ai rien à opposer »*
répond enfin. Joué dans un vrai Chromium par de vrais clics, 1280×800 et 390×800.

**Le 4 octobre, cinquième passe : le retour de Jean**, rendu en préconisations par ordre de priorité
(le détail, et ce qui reste, au `TODO.md`). Deux défauts **reproduits sous jsdom avaient une seule
racine** : la remise 1 acceptait une réponse *par anticipation* — 22h30 envoyé à la première question
servait la deuxième, l'avocat en donnait la réplique (la contradiction comprise), la phrase entrait en
PLAIDOIRIE, la deuxième question n'était jamais posée, et le tutoriel, tenant le premier `satisfaits`
pour la citation acquise, se taisait au milieu de *citer*. Arbitré par l'auteur : **la remise du
tutoriel se sert dans l'ordre** (§3) — une réponse à une question à venir y est hors sujet, n'entre pas
en PLAIDOIRIE et **reste à envoyer** (`horsOrdre`) ; les remises suivantes gardent l'anticipation,
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
ouverte — il laisse la place au reste, et le bouton de pièces du message le déplie ; **le CONTEXTE
prend les deux tiers de la largeur** au-dessus du seuil (la PLAIDOIRIE garde sa colonne étroite) ;
**les pièces passent en corps de lecture**, 15 px au lieu de 17 (§4.6). Puis **la pièce prend la
hauteur de son texte, les retenus tout le reste** : une pièce courte laissait du papier vide pendant
que les retenus, plafonnés, défilaient dessous. Et sur téléphone, arbitré : **le CONTEXTE reste entre
la conversation et le composeur** — la pièce y reste à deux lignes, à juger sur un vrai appareil.
Enfin, **le marquage ne se montre qu'au survol ou au clic** (§4.3) : le texte d'une pièce se lit nu,
un passage se souligne quand on passe dessus ou qu'on l'atteint au clavier, et garde sa marque une
fois retenu — au toucher, c'est le clic qui la pose. Puis **la légende est retirée**, et **une
bordure à peine visible, neutre et arrondie** suggère qu'un passage se clique, sans dire sa
dimension (§4.3).

**Le 5 octobre, les passes du `TODO.md`** — le second retour de Jean et ce qui restait de Colas,
rangés par passes. **Le contenu** : chaque pièce porte sa date, et chaque valeur `quand` la sienne
en ISO (§11) — *14h02* le 13 cesse de « précéder » *22h04* le 12, sans une ligne de moteur. **Le
CONTEXTE dit son état** (§4.6) : le bouton de pièces compte comme l'index (*« 3 nouvelles pièces et
2 nouvelles règles »* au lieu de *« 5 pièces »*) ; **‹ et ›** dans la tête de la pièce changent de
pièce en un clic, l'index restant replié ; un passage pris porte *« dans ta phrase »*, et la phrase
pleine, une ligne dit pourquoi les fiches ne prennent plus — la raison quitte le `title` d'un bouton
`disabled` (§4.10 règle 5) ; enfin, **⚖ tranché dans le sens du TODO**, les passages d'une remise
close se rangent sous ceux de la remise en cours, repliés : *replier par remise ne juge aucun
passage*. **L'opposition** (§4.6) : l'avocat **trie avec le joueur** — une affirmation nomme ce
qui lui répond (`repond`) et porte sa réplique (`oppose`), le reste reçoit *« Ça ne répond pas à
celle-ci »* et ne bouge pas ; une phrase opposée ailleurs dit *« déplacer ici »* ; le cadre redit
son affirmation ; la voix du composeur se tait pendant la répétition. La frise de l'atelier édite les
deux champs neufs et le diagnostic signale un tag qui ne répond à rien. Chaque contrôle neuf a été
**vu tomber**, une mutation par contrôle.

**Le même jour, la passe 5 — combien le jeu aide-t-il** — tranchée par l'auteur, écrite au **§4.11**
d'abord : *la session 1 apprend, les suivantes laissent se tromper*, la frontière étant la remise
(`enCalibration`), jamais le tutoriel. **L'article ne s'étiquette plus** : son texte est encadré de
la couleur et du trait de chaque dimension qu'il régit, deux cadres pour deux dimensions, l'ondulé
dessiné par un masque. **Hors session 1, l'erreur de catégorie part** — juxtaposée, *« {a} et {b} »*,
une forme du contenu — et c'est Maître Auber qui la refuse ; le CONTEXTE ne s'assombrit plus. **La
patience reste infinie** : on ne cherche pas de *game over*. **Choisir la relation** est remis à
après une partie.

**Le même jour, la session 3 de Jean** (il a rejoué la remise 1, tuto compris, jusqu'au seuil de la
2ᵉ), croisée avec ce qui restait de Colas : **trois trous réglés**, document d'abord (§4.3, §4.6,
§4.8, §4.10 règle 6). **Composer ne coupe plus la lecture** : le plafond du composeur, qu'on croyait
inutile au-dessus du seuil, y vaut aussi — sa rangée du gabarit est `auto`, et ce qu'elle prend, la
colonne latérale le perd (à 1280×800, deux passages posés, CONTEXTE 427 → 497 px). Et **envoyer ne
referme le CONTEXTE que si la remise change** : la question suivante, ou la même après un refus,
retrouve le clavier ouvert. **La croix ne ment plus** : pièce ouverte, la croix du CONTEXTE perd sa
touche Échap, qui n'agit que sur la pièce ; retirer une fiche s'écrit *oublier*, plus d'un ×. **La
bulle évite ce qui parle ou agit** (`TUTO_EVITE`) : trois alignements par côté, la première position
qui ne couvre rien, sinon celle qui couvre le moins ; `npm run vue` dit ce qu'elle recouvre encore à
chaque capture 1280, et la hauteur du CONTEXTE pendant la comparaison. Reste à jouer : à 390×800,
la bulle de *citer · 4/4* couvre encore la question rappelée, faute de place ailleurs.

**Le 6 octobre, la bulle du tutoriel, à la demande de l'auteur** (§4.8, document d'abord). **Elle ne
compte plus** — plus de *citer · 2/4* : un rang n'apprenait rien. *« je sais faire »* devient **la
croix des autres fenêtres**, sans Échap. Et **l'article se désigne, la relation jamais** — seule
exception à *le halo entoure la zone* : la comparaison posée sans l'article lu, le halo va à **sa
puce** dans l'index (à *« déplier »* d'abord si l'index est replié — le cas courant, la pièce de la
citation d'avant restant ouverte, constaté à la capture et non prévu), puis, l'article lu, à **son
bloc** dans les propositions. Ce bloc naissait sous le pli du composeur plafonné, derrière la barre
collante — le halo de toute la zone `.offre` l'était déjà, et rien ne le disait : une consigne neuve
qui vise un élément précis le ramène désormais dans le champ (`voirCibleTuto`), la barre réservée
par `scroll-padding-bottom`. `npm run vue` capture les trois temps de l'article. Dans la foulée,
**le tutoriel se tait là où l'écran parle seul** : plus de *« Ouvre ton CONTEXTE »* au premier écran
(le message finit sur le bouton de pièces), plus de *« Clique sur → Envoyer »* (seul bouton plein) —
il commence au CONTEXTE ouvert, et une phrase complète le fait taire. **L'index ne compte plus** : son
en-tête dit **DOSSIER**, rien d'autre (§4.6).

**Le 6 octobre, le rapport de Jean sur une partie entière** (*Jean 4* au `TODO.md`, §0) — trois
parties jouées en déroulant `S` à la main, chaque constat vérifié dans le code. **Deux bugs francs** :
une phrase **déjà envoyée** s'évaporait au renvoi, sans un mot — le composeur dit désormais *« déjà
envoyée »* à la place du bouton, et la phrase reste (§4.5) ; **l'écran de fin se refermait**, sauvegarde
comprise, et le verdict se rejouait en deux clics — il est **terminal**, sans croix, sans voile qui
ferme, Échap neutre (§4.9 règle 5, §4.10 règle 6). **Le contenu** : les boutons d'article perdent leur
virgule de tête (`libelle`), `q_equipages` perd un tag qu'aucune attente n'attend, deux lectures justes
de la session 1 reçoivent leur réplique au lieu de *« Je ne vois pas où tu veux en venir »* (§6), et
les textes des Fins 2 et 3 cessent de contredire leur `variante_faux` — qui s'ajoute **toujours**,
puisqu'aucune fin ne s'atteint sans le vice ou le faux vice (§2). **Deux règles, à relire par
l'auteur** : l'agacement de l'avocat **retombe à chaque remise** (§4.11), et le CONTEXTE ouvert pour
écrire **ne se referme que si le composeur prend le relais** — non plus quand il faut aller lire
l'article (§4.6). Un contrôle de `test_declencheurs` passait par le vide une fois le tag retiré : il
fabrique désormais son lien libre, et le dit.

**Le 6 octobre, le retour de Bérengère**, rangé en passes au `TODO.md` (§0 bis). **Passe D, l'écran** :
*on ne purge pas le CONTEXTE entre deux remises* — le pli *« 1ʳᵉ remise, close »* du 5 est défait, et
la gêne de Jean qu'il réparait est rouverte (§4.6) ; **cliquer DISCUSSION agrandit la
conversation**, CONTEXTE ouvert seulement : les deux colonnes échangent leurs parts au-dessus du
seuil, le panneau descend à son plancher en dessous, et une pièce ouverte depuis l'index rend la
place (§4.6, *à relire par l'auteur*).

**Le 6 octobre, la passe E du `TODO.md` : la remise 1 en deux questions** (retour de Bérengère,
tranché par l'auteur ; §3, §4.8). Elle demandait l'heure d'arrivée, puis l'heure des éclats de voix,
puis leur lien : la citation qu'on apprenait était la moitié de la comparaison qu'on demandait
ensuite. Elle demande désormais **qui a rédigé le PV** — un passage étranger à la comparaison —,
puis **les deux heures sous l'article 3**, sans plus dire *« cette incohérence »* : la question
nomme les deux heures, jamais leur contradiction. Le passage qui répond **nomme le brigadier**
(*« par mes soins, brigadier N. »*, §6) — arbitré par l'auteur : réduit à *« par mes soins »*, il
apprenait à lire une signature, le geste même que le vice exigera. Les citations de 22h04 et de
22h30 perdent leur lien : seules, elles reçoivent *« Ce n'est pas ce que je te demande »*, juste aux
deux questions — un lien ne connaît pas sa question. **Le tutoriel apprend à retenir pour comparer**
(`tutoRetenir`, commun aux deux gestes) : l'index, puis le texte de la pièce, jusqu'à ce que les
deux passages soient au CONTEXTE ; **une pièce qui ne porte aucun passage attendu renvoie à
l'index**, aux deux gestes — arbitré par l'auteur ; l'alerte se dérive du dernier passage retenu, la
citation déjà servie exceptée. Le cas *« déjà envoyée »* de Jean sort du chemin, la règle reste
(§4.5). `npm run vue` capture les temps de *retenir pour comparer* par de vrais clics. **Une
friction à voir en jeu** : à la seconde question, la voix du composeur dit *« Prends un ou plusieurs
passages de ton contexte »* — le CONTEXTE n'est plus vide — pendant que la bulle dit de retenir.

**Le 6 octobre, le document de la passe F — à relire par l'auteur avant le code.** L'article **se
retient, puis se prend** (§4.5, §4.6) : son texte entier est un passage sans dimension ni valeur
(`article:true`, §11), que le moteur ne voit pas ; sa fiche, au CONTEXTE, est le bouton de sa
liaison, sous un nom neutre (*« Article 7 »*) — le composeur ne propose plus d'article, et l'offre
suit *retenu* au lieu d'*ouvert*. Le §4.5 est réécrit **d'un seul tenant pour F et G**, comme le
voulait le `TODO.md` : ce qui ne vaudra qu'avec la passe G — le joueur choisit la relation — y est
marqué **[G]**. Relu par l'auteur, puis **codé le même jour** : un passage `art` sur chaque règle,
`champsDe` qui l'écarte et `articlesDe` qui le rend, l'offre sur `articleRetenu`, le groupe
*ARTICLES* dont la fiche prend la liaison (`prendreArticle`) ou dit pourquoi elle ne le peut pas, le
composeur sans article, la voix qui mène au CONTEXTE, le tutoriel qui montre la puce, le texte, puis
la fiche ; l'atelier suit (diagnostic, inspecteur, graphe, pas-à-pas). `npm run vue` capture
l'article à retenir et à prendre. *Défait le 7 par la passe J : l'article se cherche, il ne se
retient plus ; ce qui reste de F — le passage `art`, sans dimension, que le moteur ne voit pas.*

**Le 6 octobre, la passe G : le joueur choisit la relation** (§4.5, déjà relu ; le reste écrit et
codé dans la foulée — **à relire par l'auteur**). Deux passages de même dimension posés, le composeur
offre **les deux relations de leur dimension** — un bloc `relation` dans la grammaire, entre le
second terme et l'article, et un `libelle` sur chaque forme (*« précède »*, *« une seule et même
personne »*) ; le moteur ne rédige plus, il **vérifie** (`deduire` devient l'oracle, `fausse` le
juge). Une **relation fausse part**, et Maître Auber la refuse par sa propre escalade
(`rep_relation_fausse`), session 1 comprise ; elle ne sert rien et ne lève aucun drapeau. Trois
arbitrages de l'auteur : **`vice_pressenti` se lève au choix de la vraie relation**, pas à la pose ;
les boutons portent **la relation seule** ; le CONTEXTE ouvert pour écrire **reste** pendant le choix,
l'article suivant s'y prenant. Deux dimensions n'ont rien à offrir : hors session 1, la juxtaposition
**se pose d'elle-même** et *« ← retirer »* l'emporte avec son terme. Le tutoriel gagne *« Choisis ce
qui les lie »* — le halo entoure les deux relations, jamais la bonne. L'atelier suit : le diagnostic
(lien dont la relation est fausse, dimension qui n'offre qu'une relation), l'onglet Grammaire (la
relation au choix, la fausse comptée dans la marge). Mesuré à `npm run vue` : les deux boutons
naissaient sous le pli du composeur plafonné — `voirRelations` les amène dans le champ, une fois.

**Le 6 octobre, la passe H : un clic retient et prend** (§4.6, demande de l'auteur ; document
d'abord, code dans la foulée — **à relire par l'auteur**). L'auteur voulait réduire le nombre de
gestes, et envisageait de se passer des passages du CONTEXTE. Compté sur l'affaire du jour, c'était
le même gain sur le chemin direct, et le double dès qu'on rassemble : essayer des paires de `qui` se
fait depuis les fiches, sans rouvrir de pièce. **Retenu à la place** : dans la pièce, cliquer un
passage le retient et le **prend** si la phrase attend un passage ; cliquer le texte d'un article
fonde la phrase qui attend un article. L'envoi compris — le 4 octobre, *« citer en quatre gestes »*
ne le comptait pas —, citer passe de cinq gestes à quatre, comparer sous l'article 3 de dix à sept,
le vice trouvé en lisant de treize à dix ; depuis des fiches déjà rassemblées, rien ne change. **Le clic fait ce que ferait la fiche juste après, rien de plus** (`retenirEtPrendre`) —
refus de catégorie en session 1, juxtaposition ensuite, relation à choisir, drapeaux — et le passage
ne change jamais d'aspect. Recliquer un passage retenu le prend, s'il n'est pas déjà dans la phrase.
La ligne sous la pièce et l'annonce disent lequel des deux a eu lieu ; la voix nomme les deux
chemins. **Le tutoriel** perd ses temps *« prends »* sur le chemin direct — ils restent pour ce qui
fut retenu sans être pris — et en gagne un : **un passage posé que la question ne demande pas** se
retire d'abord, le halo sur *« ← retirer »* (`tutoIntrus`, §4.8). **Le harnais retient de deux
façons** : `H.retenir`, le clic, par lequel tout se compose désormais, chemin docile compris ;
`H.surligner`, *retenir seul* — le clic, puis *« ← retirer »* s'il a posé (§16). **Le prix, à
jouer** : qui rassemble en lisant verra ses premiers clics former une phrase (§3).

## 2. Points de vigilance

*Le **concentré** : ce qui a déjà mordu, rassemblé pour une relecture avant de toucher au code. Chaque
point est argumenté là où il mord — un § du système, ou un PIÈGE dans le fichier ; cette liste ne les
remplace pas, elle les rappelle d'un trait.* Les **[Rn]** sont tenus par une règle du gardien — ils
tiennent en une ligne parce qu'on n'a plus à y penser ; les autres ne sont tenus par rien.

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**.
- **[R6]** Les zones du tutoriel (`ou:`) sont des littéraux qui visent quelque chose : `#zoneDossier`, `#zoneRecherche`, `#panPiece`, `#composeur`, `#btnCONTEXTE` (la porte du DOSSIER : le code garde `contexte`, §17), `#discussion`.
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
  Le clic sur le texte d'un article le cherche donc AU CLIC (`prendre`), jamais au rendu.
- **Le passage d'un article n'est PAS un champ** (§11) : `champsDe` l'écarte, `articlesDe` le rend.
  Depuis la passe J, il n'entre plus dans `S.retenus` — une partie d'avant l'y tenait, la reprise
  l'en sort (`restaurerPartie`). Un lien qui le citerait ferait jeter `dimDe` : le diagnostic
  l'arrête avant.
- **Un terme ne porte jamais une pièce-règle** (passe J, §11) : le second terme de la comparaison
  portait `r_temoin`, dont la livraison ouvrait la comparaison en session 1. Un article ne se livrant
  plus, la comparaison serait morte — le terme n'aurait été offert qu'après la relation qui fait
  chercher. Le diagnostic le dit ; une suite aussi.
- **La recherche ne doit jamais dire quelles paires comptent** (§4.5) : toute dimension qui se
  compare a ses trois articles, et la recherche prend **les trois premiers déclarés** — l'ordre des
  pièces-règles dans `content.js` est signifiant, comme celui des formes. Un lien attendu dont
  l'article ne sort pas de la recherche sur SA paire rend la session inclôturable : le diagnostic
  l'appelle (`baseRecherche`, la règle même — §15), il ne la recopie pas.
- **Trouvé ne suffit pas, il faut l'avoir ouvert** : `articleOffert` lit `S.examinees` pour un
  résultat de recherche. Et le hasard du tirage est un ARGUMENT de `chercher` : les suites le fixent,
  l'écran n'en passe pas. Un contrôle qui veut un ordre le tire lui-même.
- **En session 1, `chaineEnvoyable` refuse la comparaison nue** (§4.11 point 6) : un contrôle qui
  veut voir Maître Auber dire *« Et donc ? »* l'envoie hors session 1. Le tutoriel ne bloque rien,
  c'est la remise.
- **`voirRelations` mène aussi le bouton qui cherche** dans le champ, et remet le composeur en tête
  quand la phrase les dépasse — sans lui, le bouton naissait coupé au bas du composeur plafonné et
  l'en-tête RÉPONSE restait rogné après l'article pris (mesuré, `npm run vue`).
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** : une mutation qui renonce garde
  sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** (`noyau.js` en premier), et les `window.X = X`
  explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) sont ce par quoi `smoke_atelier.js` lit.
- **`#tuto` est une bulle en `position:fixed`, et c'est `placerTuto` qui l'empêche de recouvrir ses
  ancres** (§4.8) — plus le flux. Elle se pose à côté du **rectangle VISIBLE** de la cible (le
  rectangle coupé par chaque ancêtre qui défile : une zone à moitié défilée n'est pas là où son
  `getBoundingClientRect` le dit), sur la première position qui ne couvre rien de `TUTO_EVITE` — à
  étendre si une ligne qui parle ou une commande naît près d'une ancre. Elle se replace à chaque
  `majTutoriel`, et sur `resize` et `scroll` **en capture** — un `scroll` ne remonte pas, et ce sont les
  bandes qui défilent, jamais la page. **Aucune suite ne voit une géométrie** (jsdom rend des
  rectangles nuls) : `npm run vue` seul la montre. Elle reste **premier enfant de `<body>`, hors de
  `.wrap`** : premier arrêt de tabulation, et vivante si `finir` rend `.wrap` inerte ; son `z-index:60`
  la garde au-dessus de l'`.overlay` (50).
- **La PLACE DES PANNEAUX DANS LE DOCUMENT est toute la mécanique** : entre la section DISCUSSION et
  `#composeur`, dans le flux, en dessous du seuil de `.wrap.avecLateral` — la pièce ouverte, elle, vit
  DANS le DOSSIER (`#contexte`, §4.6, §4.10 règle 3 CONCEPTION) et ne passe plus par `#modalRoot`. Les déplacer
  ailleurs dans `.wrap`, ou les repasser en `position:absolute` (ce qu'ils ont été une heure), leur
  refait recouvrir la conversation — et **rien ne le dirait**, aucune suite ne voyant une géométrie.
- **La colonne tient dans la fenêtre, et la conversation est la SEULE bande élastique EN HAUTEUR en
  dessous du seuil de `.wrap.avecLateral`** (§4.6) : `body` en colonne de `100dvh`, la conversation en
  `flex:1` **avec `min-height:0`** — sans lui, elle refuse de rétrécir et pousse « → Envoyer » sous le
  pli. Aucune suite ne voit une géométrie : `npm run vue` le **dit**, il ne l'asserte pas. *1280×800,
  son gabarit habituel, est AU-DESSUS du seuil de 900px : la capture y exerce désormais la colonne
  latérale en grille, pas l'empilement — `npm run vue` doit aussi capturer un gabarit sous 900px pour
  éprouver l'élasticité verticale d'origine.*
- **Une pièce n'est JAMAIS ouverte hors du DOSSIER** : `suivrePhrase`, en TÊTE de `rendreTout`, la
  replie dès que `panneau` n'est plus `"contexte"` — toutes les portes qui le referment passent donc
  par là, et la réplique `declenche` tombe dans le fil AVANT qu'il soit dessiné. Le déplacer après
  `renderDISCUSSION` ferait paraître la réplique un geste trop tard ; le retirer laisserait une pièce
  ouverte invisible, `S.modalPiece` compris. Une partie ne se reprend jamais sur une pièce
  ouverte : `sauverPartie` écrit `modalPiece:null` — la reprise qui rouvrait le DOSSIER au
  démarrage était du code mort, retiré le 6 octobre.
- **L'index se replie, mais `#zoneDossier` reste là** (§4.6) : c'est une ancre du tutoriel (R6), et
  le halo doit pouvoir l'entourer replié. Les puces restent dans le DOM, sous `hidden` — le motif
  *disclosure* standard, et `data-f="d:pid"` survit pour le retour du focus. **Un seul** état
  d'ÉCRAN, comme `panneau`, jamais sauvé : `dossierPlie`, le choix du joueur — une pièce ouverte n'y
  touche plus (Jean, 8 octobre, §4.6) ; `dossierDeplie`, qui le doublait le temps d'une pièce, est
  parti. `voirPiecesRecues` le déplie.
- **La juxtaposition n'entre jamais dans la boucle de `deduire`** (§11) : déclarée en tête des
  formes, elle passerait pour une *différence* entre deux passages de même dimension. Le contenu
  livré la déclare en dernier et ne le verrait pas — un contrôle la remonte exprès. Et le diagnostic
  ne la compte pas comme une forme qui compare (*« sans forme déductible »*).
- **La bascule DISCUSSION est un troisième état d'ÉCRAN** (`discussionAgrandie`), jamais sauvé, qui
  n'existe que DOSSIER ouvert : `majLateral` l'oublie dès que `panneau` n'est plus `"contexte"`, et
  `ouvrirPiece` le remet à faux — ‹ › (`voisine`) n'y touchent pas. Elle ne
  change que le **gabarit** (`.wrap.discussionAgrandie`), jamais un span. L'en-tête est réécrit à
  chaque rendu (`enteteDISCUSSION`) : le bouton porte sa clé, `data-f="discussion"`.
- **Pièce ouverte, `#contexte` porte une bande défilante de plus** (`.defile[id]`, `#piece`) :
  `garderDefilement` la retrouve par son id. Une bande sans id repartirait en haut à chaque geste.
- **Un passage est un `span[role=button][tabindex=0]`, jamais un `<button>`** : un bouton est une
  boîte insécable même en `display:inline` (mesuré, Chromium 141) — un passage long sauterait à la
  ligne d'un bloc. Entrée et Espace passent par `clavier`, délégué sur `document`.
- **Le focus se retrouve par CLÉ** (`data-f`, ou l'id), jamais par l'élément, que le redessin a
  détruit ; un geste qui sait mieux pose `focusVoulu`. Tout nouvel élément cliquable redessiné veut
  sa clé — sinon le joueur au clavier repart de la zone.
- **`#annonce` vit dans le HTML statique, HORS de `.wrap`** : une région créée au moment d'annoncer
  ne dit pas sa première phrase, une région dans `.wrap` se tait quand la pièce la rend inerte. Et
  **jamais `role="log"` sur la DISCUSSION**, réécrite à chaque geste.
- **Un contrôle clavier désigne son élément par sa clé, jamais par `activeElement`** : cliquer
  `actif()` faisait tomber la suite au premier focus perdu, et masquait les contrôles d'après. Les
  31 contrôles clavier ont chacun été **cassés une fois** pour les voir tomber.
- **Le clic dans la pièce suit la grammaire** (`prendre`, passes H et K) : il appelle `poserBloc` au
  rang de `indexTermeChamp` — le prédicat même qui fait se cliquer la voix et décide si le panneau
  suit la phrase —, la **clé** du passage en source (plus un rang dans `S.retenus`, parti). Jamais
  un chemin à lui. **Et un passage déjà dans la phrase n'y retourne pas** : sans la garde, le
  reclic le poserait en second terme, et *le même passage deux fois* tomberait en refus d'écran —
  un reproche pour un clic de lecture. `R.dansPhrase` sert la garde, la marque du passage pris
  (`.pris`, ✓) et le tutoriel — une vérité, trois usages.
- **À l'écran DOSSIER, dans le code `contexte`** (passe L, §4.6, §17) : `#contexte`, `#panCONTEXTE`,
  `#btnCONTEXTE`, `panneau="contexte"`, `renderCONTEXTE`. Et ce qui s'appelle *dossier* dans le
  code — `#zoneDossier`, `dossierPlie`, `basculerDossier` — est l'INDEX, que l'écran intitule
  DOCUMENTS. Renommer l'un sans l'autre ferait se croiser les deux. **Les identifiants seuls gardent
  l'ancien nom** : les commentaires et les libellés des suites disent DOSSIER (§17).
- **Le harnais prend un passage d'une seule façon** (passe K) : `H.cliquer`, le clic du joueur.
  `H.surligner` (« retenir seul ») est parti avec l'état qu'il fabriquait. **Et un drapeau ne recule
  pas** : un article pris par le clic a pu lever `vice_trouve` avant que *« ← retirer »* le défasse.
- **La ligne sous la pièce se ramène dans le champ** (`voirEcho`, passe H) : le premier clic fait
  grandir le composeur, et sur le PV la ligne naissait sous le bas de la bande. Elle défile jusqu'à
  elle, jamais au point de faire sortir le passage cliqué, puis `majDebord` remesure le fondu.
  **Et `voirCibleTuto` ne défile pas vers la barre du composeur** : elle colle, *« ← retirer »* y est
  toujours dans le champ, et y défiler rognait l'en-tête RÉPONSE. Aucune suite ne voit ni l'un ni
  l'autre — `npm run vue` seul, captures *piece-mauvais-passage* et *piece-pris*.
- **Le tutoriel lit la PHRASE, et rien d'autre** (`tutoIntrus`, `tutoChercher`, passes H et K) : un
  passage posé à tort y serait le premier terme, et le bon, cliqué ensuite, y serait refusé ou
  ouvrirait une comparaison. L'alerte passe AVANT tous les autres temps, et ne lit que les passages
  — jamais la relation, qu'il ne signale pas.
- **Le panneau ouvert se referme sur ce que la phrase ACCEPTE, jamais sur ce que la voix RÉCLAME** :
  un passage posé, la voix se tait — la phrase se tient — mais la grammaire ne sait pas encore si c'est
  une citation ou le premier temps d'une comparaison (§4.5). Suivre la voix retirerait le clavier au
  milieu du geste le plus difficile ; d'où `indexTermeChamp`. **Et cette fermeture ne vaut QUE pour un
  panneau ouvert par la voix** (`panneauSuit`) : ouvert depuis la barre, on consulte, et il reste.
  Trois contrôles tiennent ce point.
- **Les ids de la barre sont écrits EN TOUTES LETTRES** (`btnCONTEXTE`, `btnPLAIDOIRIE`), donc la barre
  ne se replie pas en une boucle : le tutoriel les vise quand le panneau est fermé, et **R6 ne sait pas
  lire un id fabriqué par interpolation** — il l'a refusé, à raison. Même exigence pour les
  sélecteurs `ou:` du tutoriel, qui doivent rester des littéraux : **viser un élément précis passe
  par la clé `f`** (une valeur `data-f`, cherchée DANS la zone `ou`, repli sur la zone si elle est
  cachée), jamais par un `ou:` interpolé que R6 ne lirait pas.
- **`export/iavocat.html` est COMMITÉ, donc c'est une copie de `app/`** — et aucune suite ne le lit.
  **[R12]** le tient, en appelant l'exporteur (passé en mode double) plutôt qu'en refaisant son
  inlinage : un prédicat recopié resterait vert en affirmant l'ancienne vérité, et une règle a déjà été
  retirée d'ici pour ça. Un hook régénère et stage l'export avant chaque `git commit` — mais **le hook
  ne protège que cette machine**, R12 protège tout le monde, CI comprise.
- **Rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les
  captures — qui **ne se comparent pas à l'octet** (le halo pulse).
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDISCUSSION` finit par
  `scrollTop = scrollHeight`. Enfant direct de `.wrap`, en bandeau plein largeur après les trois
  `.col` — jamais dans une section colonne.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher un panneau (DOSSIER, PLAIDOIRIE, et
  désormais la pièce) demande `.col[hidden]{display:none}` — sans lui, `display:flex` l'emporterait.
  *Point corrigé : `.cloture` et `#composeur` ne sont plus « câblés sur trois colonnes » depuis que la
  grille `.wrap.sansPlan` a disparu avec elle (commit `63a7e06`) — ils sont de simples enfants du flex
  `.wrap`, pleine largeur par défaut. La classe `.wrap.avecLateral` (§4.6 CONCEPTION) qui rouvre une
  colonne latérale n'y touche pas davantage : elle pose `grid-area` une fois pour toutes, jamais un
  span recalculé.*
- **La signature de contenu ne protège pas d'un changement d'état** : `S.retenus` (né `S.memoire`)
  est parti à la passe K, et une partie d'avant le porte encore — `restaurerPartie` en sort les
  articles vers le dossier, puis supprime le champ. Tout futur renommage ou retrait aura le même
  devoir.
- **`lienDe` apparie sur `{forme, termes}`** : renommer une forme oblige à faire suivre **tous** les
  liens qui l'écrivaient — **le vice compris**. Oublié, il cesse d'exister et sept contrôles de
  `test_o5` tombent (vérifié en cassant, §16).
- **La réplique `declenche` part à la FERMETURE de la pièce** : poussée à l'ouverture, elle tombait
  derrière une boîte de dialogue qui venait de rendre `.wrap` inerte — lue en fond flouté, ou pas
  lue du tout. `fermerPiece` est le seul endroit où l'écran appelle une règle en refermant.
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
- **Chercher le passage se dérive aux deux gestes** (`tutoChercher`, §4.8) des passages du lien
  attendu (`tutoTermes`) qui ne sont pas encore dans la phrase. La clé de `tutoVues` distingue le
  second passage cherché (`n`) : sans elle, *« Ouvre une pièce »* restait réduite au moment même où
  elle nomme une autre pièce. **La bulle finit sur *« → Envoyer »*** (passe K) : `f:"envoi"` dans
  `#composeur` — la barre colle, `voirCibleTuto` n'y défile pas.
- **Cacher la clôture, c'est cacher le BOUTON et son aide, jamais `.cloture`** : la barre porte aussi
  *« ⟲ recommencer »*, qui ne s'absente jamais (§4.9). Et `disabled` **double** `hidden` — trois
  contrôles lisent `btnCloture.disabled` pour dire que le refus est vrai, et il doit l'être aussi pour
  qui ne voit pas l'écran.
- **Le bouton naît de `instructionComplete`, la question qui l'appelle vit dans le CONTENU** — sur la
  réplique `apres` de la **dernière** attente de la dernière session (§3). Rien ne lie les deux :
  déplacer cette réplique ferait paraître la réponse sans question, et aucune suite ne le verrait.
- **La clôture implicite compte les *liaisons* offertes**, les termes exclus : ajouter une liaison à la
  grammaire change le nombre de clics ailleurs, ajouter un terme non.
- **Poser un bloc ne clôt plus rien** : le refus de catégorie tombe au **second terme** d'une paire
  (session 1, ou rien à offrir) ou à la phrase **achevée**. Une composition en cours n'est jamais
  « refusée » — et une relation fausse ne l'est pas non plus : elle part (§4.5).
- **La juxtaposition posée d'elle-même porte `auto`** (passe G) : `retirerBloc` l'emporte avec le
  terme qui l'a appelée. Sans ce drapeau, *« ← retirer »* laissait une paire au choix impossible.
- **`deduire` ne rédige plus, il JUGE** (passe G) : la relation vraie, à laquelle on compare celle du
  joueur (`fausse`), et le rang des deux qu'on offre (`relationsDe` suit le même ordre de
  déclaration). Changer l'un sans l'autre ferait offrir deux relations dont aucune n'est vraie.
- **Un contrôle de texte attrape ses voisins** : `/les lie/` trouvait *« sur les **lie**ux »* dans la
  question rappelée, et le contrôle de la voix restait vert sans elle — vu à la mutation. Viser
  l'élément (`#composeur span.aide`), pas tout le composeur.
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
- **Le RAG (passe J) : non joué.** La recherche apprend-elle à lire trois textes, ou à essayer les
  trois — la patience de l'avocat est infinie (§4.11) ? Les leurres sont un **premier jet** : l'article
  9 (*« sauf crime flagrant »*) est peut-être trop dur pour la calibration, l'article 8 est le piège
  voulu contre le vice. Vu à `npm run vue` : à 1280×800, pièce ouverte, la zone RECHERCHE pousse le
  texte de la pièce sous le pli, et la voix qui suit la recherche déborde au bas du composeur.
  L'article 7 sort de toute recherche lancée depuis une paire de *qui* ou de *quoi* — comme sa
  livraison le mettait sous les yeux.
- **Le clic qui prend (passe H) : des phrases involontaires ?** Qui rassemble en lisant voit ses
  deux premiers clics former une phrase — en session 2, souvent une juxtaposition. Rien ne part sans
  *« → Envoyer »*, et *« ← retirer »* ou *« tout effacer »* défont la phrase. Le
  repli est connu, et écarté d'avance : ne poser un second terme depuis la pièce que s'il est de la
  même dimension serait un refus d'écran hors session 1 (§4.11). *Depuis la passe K, plus de fiches
  à découvrir : qui veut essayer des paires rouvre les pièces — le coût que l'auteur a pris (§4.6).*
  **Non joué.** Vu à `npm run vue` : à
  1280×800, la bulle de *« ← retirer »* couvre *« tout effacer »* ; à 390×800, elle couvre la phrase
  même qu'elle demande de défaire, et la ligne sous la pièce ne s'y montre qu'à moitié.
- **La CALIBRATION tient-elle ?** Première chose à regarder : la session 1 se sent-elle comme un
  examen, et la remise 2 comme une charnière ? *Depuis la passe E, en deux questions : un fait sans
  lendemain, puis la comparaison entière (§3).* Si l'examen ne se sent pas, la session 1 redevient une
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
  2. *Corrigé le 5 octobre :* une phrase opposée ailleurs dit *« déplacer ici »*, plus un *opposer*
     identique qui la déplaçait en silence.
  3. *Corrigé le 5 octobre :* l'avocat **trie** — ce qui répond à l'affirmation passe en face avec la
     réplique de celle-ci, le reste est dit *à côté* et ne bouge pas (§4.6, `repond`, `oppose`,
     `rep_a_cote`). *Une conséquence à juger en jeu : dans ce contenu, aucune phrase ne répond à
     deux affirmations, donc « déplacer ici » est toujours refusé.*
  4. *Corrigé le 5 octobre :* le cadre redit son affirmation en tête, les phrases en corps de texte.
  5. *Corrigé le 4 octobre, par le contenu seul :* la fin ne répondait à aucune question — *« C'est tout ce qu'ils ont. Je dépose au matin. »* est
     une affirmation, puis paraît *« Je n'ai rien à opposer »* — c'est la friction de Colas. Le PIÈGE
     du §2 le dit : la question qui appelle le bouton vit dans le CONTENU. **Repli sans code, et sans
     renommer** : la réplique `fin` est devenue une question (*« … Je dépose au matin — tu as encore
     quelque chose à y opposer ? »*), à laquelle le bouton répond.
  6. *Corrigé le 5 octobre :* la voix du composeur se tait pendant la répétition. *Reste à voir si
     le cadre vide du composeur se lit comme un champ où taper (§4.9 règle 1).*
- *Fermé le 4 octobre, suite 2 : « décomposer le tutoriel ».* Chaque consigne neuve s'affiche d'abord
  développée, puis se réduit en icône « ? » dès que le rendu suivant confirme qu'elle reste active — un
  clic sur l'icône la rouvre, se tromper la rouvre aussi (§4.8 CONCEPTION.md). Les deux frictions
  opposées du 16 septembre (pris pour un bandeau de cookies / vu trop tôt) sont traitées par le même
  mécanisme : la forme développée reste ponctuelle, jamais permanente — ni totalement absente.
- *Fermé le 4 octobre, suite 2 : « masquer les pièces jointes du fil ».* Le message ne porte plus qu'un
  bouton agrégé (« N pièce(s) disponible(s) dans ton CONTEXTE », classe `.attach` conservée) qui ouvre
  le CONTEXTE sans le basculer ; chaque pièce s'y ouvre et se nomme comme avant (§4.6). Le sentiment de
  réception reste porté par le message — le trombone y reste accroché —, seul le détail nominatif se
  déplace vers l'index déjà existant. *Levée le 4 octobre, suite 4 :* le halo du tutoriel pouvait pulser sur le bouton
  du message un instant après qu'il a été cliqué, le temps que le joueur choisisse une pièce dans le
  CONTEXTE — le CONTEXTE ouvert, il passe désormais à l'index (§4.8).
- *Fermé le 4 octobre, suites 3 et 4 : « un visuel qui dit qu'un passage a été ajouté au CONTEXTE ».*
  ✓ sur le passage, ligne sous la pièce, fiche neuve allumée juste dessous, porte allumée (§4.3).
  *Depuis la passe K, le passage va à la RÉPONSE : le ✓ et la ligne restent, la fiche et la porte
  allumées sont parties.*
- **La pièce dans le DOSSIER tient-elle sur un téléphone ?** En 390×800, index et pièce se
  partagent un panneau bas : il redéfile d'un bloc, l'index part hors champ. Lisible, mais serré —
  **à jouer sur un vrai téléphone.** Et au-dessus du seuil : la conversation rétrécie par la colonne
  élargie reste-t-elle confortable ?
- **RAG sur les messages de l'avocat** (pouvoir citer un passage qui ne vient pas d'une pièce jointe),
  **chain-of-thought pour les choix moraux** (une
  phase où l'IA se parle à elle-même, suggérée après une déconnexion de Maître Auber) : deux idées
  venues d'un retour de playtest, **aucune encore nulle part dans la documentation**. Consignées ici pour
  ne pas les perdre — à ne pas coder avant que la boucle de base (le sujet de cette passe) soit validée
  par un joueur neuf, conformément au §4.
- **`porte sur : quand`, sous chaque article, fait-il le tri à la place du joueur ?** Un joueur
  l'écrit noir sur blanc : *deux fiches QUI → seul l'art. 7 colle*. Le moteur ne lit jamais `porte`
  (§4.5), mais l'étiquette filtre **dans la tête** — et le choix entre l'article 7 et l'article 12
  fait toute la session 2 (§6). Le retirer est une ligne ; **à juger sur une partie, le recadrage en
  place.** *Tranché le 5 octobre (§4.11) : l'étiquette devient une marque sans mot — la couleur et le
  trait de la dimension sous le titre de l'article.*
- *Fermé par la passe F : « l'article s'offre sans avoir été lu ».* Il s'offrait *reçu*, puis
  *ouvert*, puis *retenu* ; il se cherche et se prend désormais (passe J) — on n'invoque pas un
  texte qu'on n'a pas lu (§4.5).
- *Fermé le 2 octobre : la **légende** de chaque pièce nomme les dimensions qu'elle porte (§4.3).
  Deux playtests l'avaient demandée, et le `title` qui la remplaçait n'existait ni au clavier ni au
  toucher. Reste à voir si elle suffit, ou si le joueur passe à côté.* **Rouvert par Jean : il passe
  à côté.** Posée au bas du texte, elle sort du champ dans une fenêtre de pièce de deux lignes, et il
  demande la légende des cinq traits **avant** de retenir — indispensable au toucher, sans survol.
  **Retirée par l'auteur** (§4.3) : depuis que le marquage ne se montre qu'au survol ou au clic, elle
  ne disait rien qu'on ne voie en passant sur un passage. Le code s'apprend en cherchant ; une
  bordure neutre dit seulement qu'un passage se clique.
- *Fermé par la passe K : « le CONTEXTE à dix-sept fiches ».* Jean trouvait la pièce à l'étroit,
  à deux lignes en session 2, et les fiches de l'affaire close en tête ; l'index s'est replié pièce
  ouverte (4 octobre), un repli par remise a vécu un jour (5-6 octobre). **Il n'y a plus de
  fiches** : la pièce prend toute la hauteur sous l'index. À 390×800, le panneau reste bas — c'est
  le point *téléphone* ci-dessus.
- **Deux portes valent-elles mieux qu'une ?** La voix du composeur enseigne, la barre nomme et donne
  accès. Le §4.9 interdit de redire, pas d'offrir deux chemins. **Réponse partielle du 1ᵉʳ octobre :
  elles coûtent avant de servir** — au premier écran, un joueur a noté *« CONTEXTE / PLAIDOIRIE :
  rôle inconnu à ce stade »*. Elles ont servi ensuite ; reste à savoir si le début le justifie.
- **La PLAIDOIRIE est revenue** (§4.9) — en panneau, porte visible d'emblée, comme le §3 l'avait
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
- *Fermé le 5 octobre : « les heures se comparent sans leur date ».* Chaque pièce porte sa date
  (Jean : *« 14h02, c'est le lendemain du crime ? »*) et chaque valeur `quand` la sienne, en ISO
  (§11) : le relevé du 13 à 14h02 vient désormais **après** l'arrivée du 12 à 22h04, sans une
  ligne de moteur.
- **Aucune barrière entre les affaires** : pièces et articles de la session 1 restent au dossier,
  et leurs passages composables dans la session 2. C'est voulu — le DOSSIER est gratuit et cumulatif (§4.6) — mais ça produit des
  phrases qui n'ont pas de sens, et le joueur l'a essayé exprès.
- *Fermé le 5 octobre :* la croix d'un panneau et celle d'une fiche portaient le même signe — la
  fiche disait *oublier* (§4.3), et la croix du CONTEXTE perd Échap pièce ouverte (§4.10). *La fiche
  est partie à la passe K ; la leçon reste : le × ferme ou replie, il ne retire rien.*
- **La question épinglée n'existe pas en session 2** : sa demande vit dans le *texte de la remise*,
  qu'aucune règle ne sait rappeler (§4.9 règle 3). Le repli est connu — descendre la demande sur une
  `question` d'attente, comme en session 1 — et il coûte zéro ligne de code.
- **L'article 12 approuvé par l'avocat quand il se retourne contre la défense** : le joueur y a vu un
  défaut. **C'est le faux vice** (§6, §8.5) — l'avocat ne sait pas, il y pousse lui-même, et les
  `variante_faux` des fins le paient. À ne pas « corriger » ; peut-être à rendre plus lisible à la fin.
- Côté outil : la frise n'édite pas `rep_hors_sujet` (§15).
- **Le retour de Jean, ce qui reste** — *tranché par l'auteur le 5 octobre, écrit au §4.11, puis
  codé* : la session 1 apprend, les suivantes laissent se tromper (refus d'écran
  et assombrissement levés hors session 1, la juxtaposition part et l'avocat la refuse), et la
  patience de l'avocat reste infinie — on ne cherche pas de *game over*. **Choisir la relation reste écarté** — *retourné le 6 octobre, passe G* : on rejoue avec le
  §4.11 avant de le rouvrir. *Ce qui suit est l'état d'avant :* trois préconisations vont contre un
  arbitrage écrit, à trancher document d'abord : **offrir deux ou trois relations au choix, dont des
  fausses**, renverserait *désigner, pas déclarer* (§4.5) ; **réserver au tutoriel les garde-fous** —
  fiches d'une autre dimension assombries, refus de catégorie avant l'envoi — lèverait *le seul refus
  qui existe* (§4.5) ; **donner un coût à l'erreur** (jauge de patience, envois comptés) rendrait
  l'enjeu calculable s'il se voit (§8.4). *Fait le 5 octobre : les fiches déjà prises étaient marquées,
  et la phrase pleine le dit en une ligne (§4.6). Les fiches sont parties à la passe K : la ligne
  vit sous la pièce, et le passage pris porte ✓.* *Le soulignement au survol ou au clic, demandé par
  l'auteur, est fait (§4.3), la légende retirée et les passages encadrés d'une bordure neutre* —
  reste à voir, au toucher, si un joueur comprend ce que couleur et trait veulent dire : il ne les
  voit qu'une fois le passage pris. **Et depuis la passe K, le NOM d'une dimension ne se lit plus
  qu'au survol** — les fiches le portaient en tête de groupe : au toucher, il n'est plus nulle part.
- **La bulle ancrée n'a été jouée que dans Chromium**, 1280×800 et 390×800 : sur un vrai téléphone,
  et à côté d'une zone longue comme le texte de la pièce, couvre-t-elle ce qu'on vient chercher ? Elle
  se réduit au geste suivant ; reste à savoir si ça suffit.

- *Fermé par la passe K : « la seconde question de la calibration, deux voix qui ne disent pas la
  même chose ».* La voix du composeur disait de prendre un passage du CONTEXTE, où la citation était
  restée ; elle dit désormais de cliquer un passage dans une pièce, comme la bulle.
- **Le rapport du 6 octobre (Jean 4) laisse cinq points à trancher** — au `TODO.md`, §0 : les réponses
  de calibration en PLAIDOIRIE (le §4.6 les y veut), le dilemme jamais posé (rejoint les directives
  et le canal de révélation, ci-dessus), le féminin de la Fin 2, le palier sans séjour, le même
  passage pris deux fois. *Le ⚖ né de la passe — les boutons d'article qui disaient leur liaison,
  quand Jean proposait *« Article 7 »* tout court — est tombé avec la passe J : l'article n'a plus de
  bouton au composeur, le résultat de recherche porte son nom neutre, et le libellé vit dans la
  phrase (§4.5).*

## 4. Prochaine étape

**Le cas médicaments attend d'être tranché** (`docs/CAS_MEDICAMENTS.md`, partie II, ses questions) —
document d'abord, puis la mécanique sur l'affaire ADN, puis le cas. Ce qui suit se joue sur
l'affaire du jour et reste utile : la boucle ne change pas, seule la relation change.

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer** — la
précédente l'a prouvé : une partie rapportée geste par geste a valu plus que trois passes de
relecture. **Il faut la rendre à un joueur neuf**, qui n'a pas lu ce qui précède :

1. **La calibration se sent-elle ?** La session 1 passe-t-elle pour un examen, et la remise 2 pour le
   moment où l'avocat cesse de savoir ? *Le 2 octobre a répondu à moitié — « l'affaire 1 assumée
   comme examen » — mais le même joueur trouvait encore que l'avocat raisonne à sa place. Le bandeau
   a cessé de le doubler depuis ; à rejouer.*
2. **La pièce tient-elle sous la composition ?** C'est la question du 2 octobre, et `npm run vue`
   sait la poser : la pièce, seule sous l'index depuis la passe K, pendant que la comparaison
   grandit au composeur.
3. **Rejouer la session 1 avec les nouveaux libellés** (*« et l'article 3 écarte la déposition qui
   s'y heurte »*) : la phrase composée se lit-elle comme une pensée ou comme un formulaire ? C'est le
   premier point ouvert du §3 — et l'excuse la plus facile vient d'être retirée.
4. **Envoyer une comparaison nue** et voir si le refus de Maître Auber enseigne (§4.5) — c'est du
   contenu qui n'a jamais pu sortir.
5. **Rejouer la session 2 sans `porte sur`** — retiré du composeur, devenu un filet sous le titre
   de l'article (§4.11) : le choix entre l'article 7 et
   l'article 12 se fait-il encore, ou l'étiquette le faisait-elle seule (§3) ?
6. Si la boucle tient : écrire la session 3 et placer la porte de la Fin 3. Sinon, prendre l'un des
   replis du §3, qui ne coûtent aucune ligne de code.
7. **Rendre la partie au testeur du clavier**, lecteur d'écran allumé (NVDA, VoiceOver) : les annonces
   tombent-elles au bon moment, et en disent-elles trop ? Aucune suite ne l'entend (§4.10).
8. **Le clic qui prend (passes H et K)** : qui clique en lisant voit-il sa phrase se former, et la
   défait-il sans peine ? Sans fiches, essayer des paires en rouvrant les pièces lasse-t-il (§3) ?
   Et la bulle sur *« → Envoyer »* : aide-t-elle, ou dit-elle trop que la phrase est la bonne ?
9. **La recherche (passe J)** : le joueur lit-il les trois articles, ou les essaie-t-il ? Les leurres
   tiennent-ils — et l'auteur les réécrit d'abord (`TODO.md`) ?

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
  PLAIDOIRIE, les ancres du tutoriel (§4.5, §4.9, §17) ; les comptes (cinq suites, 331 contrôles) sont
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
  La bascule : l'élargissement de la colonne, essayé la passe d'avant, est annulé, et la PLAIDOIRIE
  sort de son escamotage du 16 septembre (§4.6, §4.9). L'écran tombe à une colonne, `.wrap` cesse
  d'être une grille, et deux PIÈGES disparaissent avec elle. Le tutoriel apprend à viser une porte
  quand sa cible est cachée.
- **30 septembre** — six retours d'une partie jouée, en deux passes : tutoriel plus lisible puis monté
  **en tête de page, dans le flux** ; `#composeur` en bandeau plein largeur ; le CONTEXTE qui descend
  au clic, puis ramené à **un tiers** de la largeur ; l'index du dossier qui nomme les pièces **comme
  la DISCUSSION les transmet**. Rien de tout cela n'est visible d'une suite — le seul juge est
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
  panneau, fait dire au CONTEXTE qu'il déborde, arrête le compteur qui reculait et déplace la
  réplique `declenche` à la fermeture de la pièce. Deux points — *« porte sur »* et l'article offert
  sans être lu — sont **laissés ouverts exprès** (§3), à juger sur la partie suivante. Le filet a été
  **vu tomber** : la forme du vice renommée sans suivre les liens, sept contrôles de `test_o5`
  s'écroulent.
- **2 octobre, la partie rejouée sur cette version** — la moitié des reprises tient, et ce qui ne
  tient pas vient de la passe elle-même : l'index collant et le panneau sans plancher écrasaient le
  CONTEXTE (§4.6), d'où plancher, plafond, index resserré et **barre du composeur collante** pour que
  *« → Envoyer »* ne passe plus sous le pli. Le bandeau cesse de désigner la trouvaille, que la
  fiction porte seule (§4.8), avec quatre accidents de langue. **La répétition devient vraie** : on
  n'y envoie plus, on **oppose**, et `verserContre` enregistre ce que sa réplique annonçait depuis
  toujours (§4.6). Une **légende** apprend le code des soulignements sans survol (§4.3). Et un piège
  neuf entre au §2 : *une suite peut prouver un chemin que le joueur ne peut pas marcher* — c'est
  ce qui avait laissé le présentoir mourir, vert en test et mort en jeu.
- **4 octobre, retour de playtest externe (Colas) et colonne latérale** — le va-et-vient entre deux
  colonnes, clos le 30 septembre faute d'objet, **rouvre avec un objet nommé** : fermer la pièce pour
  relire la question qu'elle recouvrait. La pièce quitte `#modalRoot`/`inert` et rejoint la place
  LATÉRALE aux côtés du CONTEXTE et de la PLAIDOIRIE (§4.6, §4.10 règle 3) ; au-dessus de 900px cette
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
  (`voirPiecesRecues`) ouvre le CONTEXTE sans le basculer, où l'index (`renderDossier`) reste seul
  dépositaire du nom de chaque pièce (§4.6). La consigne 1/4 du geste « citer » change de cible en
  cascade (« ouvre ton CONTEXTE » plutôt que « ouvre la pièce ») et la suite clavier correspondante se
  rejoue en deux temps. `npm run vue` clique désormais pour de vrai sur le bouton du message et sur un
  chip du dossier, au lieu d'appeler `ouvrirPiece` directement — seul moyen d'éprouver la réduction du
  tutoriel, qu'aucune suite n'a jamais vue. 421 contrôles sur cinq suites, 8 règles du gardien, ESLint.
- **4 octobre, troisième passe : retenir se voit** — ✓ en exposant sur le passage retenu, ligne
  *« ✓ Retenu dans ton CONTEXTE »* collée au bas de la pièce et porte CONTEXTE allumée, le tout le temps
  d'un rendu (`vientDeRetenir`, frère de `rappelRetrait`) ; le CONTEXTE vide dit comment on le remplit
  (§4.3). Trois contrôles dans `test_parcours`, deux captures `piece-retenu` dans `npm run vue`.
  424 contrôles, 8 règles du gardien, ESLint.
- **4 octobre, quatrième passe : la pièce dans le CONTEXTE** — index, pièce, retenus dans le même
  panneau ; plus de temps *« Referme la pièce »* (citer en quatre gestes) ; `suivrePhrase` replie la
  pièce dès que le CONTEXTE quitte l'écran et porte sa réplique `declenche` ; colonne élargie au-dessus
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
  repliable à tout moment (`dossierPlie`), le CONTEXTE aux deux tiers (`.wrap.avecCONTEXTE`, qui
  remplace `.wrap.avecPiece`), les pièces en 15 px ; la pièce à la hauteur de son texte (plafond
  70 %), les retenus prennent le reste ; le marquage au survol ou au clic (`.empan`, décoration
  posée mais transparente) ; la légende retirée (`legendePiece` supprimée, `portePiece` garde sa
  forme sous `.porte`), une bordure neutre sur chaque passage. 469 contrôles, 8 règles du gardien,
  ESLint.
- **5 octobre, les passes du `TODO.md`** — passe contenu : les pièces datées, les valeurs `quand` en
  ISO (§11). Passe CONTEXTE : le bouton de pièces compte comme l'index (`comptePieces`), ‹ › dans la
  tête de la pièce (`voisine`), *dans ta phrase* et la raison d'un refus (`passageRefuse`,
  `aria-disabled`), les remises closes repliées (`remisesDepliees`). Passe opposition : l'avocat
  trie (`repondA`, `repond`, `oppose`, `rep_a_cote`), *« déplacer ici »*, l'affirmation dans le cadre,
  la voix muette en répétition ; la frise et le diagnostic suivent. 501 contrôles, 8 règles du
  gardien, ESLint.
- **5 octobre, passe 5 : ce que le jeu aide, et quand** (§4.11) — la session 1 apprend, les suivantes
  laissent se tromper (`enCalibration`) ; l'article encadré de ses dimensions (`cadresPorte`,
  `portePiece` supprimée) ; la forme `juxtaposition` (`deduire`, `juxtapose`), refusée à l'écran en
  session 1, par l'avocat ensuite ; l'assombrissement réservé à la session 1 ; patience infinie ;
  la relation choisie, écartée pour l'heure. 516 contrôles, 8 règles du gardien, ESLint.
- **5 octobre, la session 3 de Jean et le reste de Colas** — le plafond du composeur à toutes les
  largeurs ; `envoyerCompo` ne referme le CONTEXTE qu'à une remise neuve ; *oublier* au lieu du × de
  fiche, Échap retiré de la croix du CONTEXTE pièce ouverte ; `placerTuto` évite `TUTO_EVITE` ;
  `npm run vue` mesure la bulle et la comparaison. 523 contrôles, 8 règles du gardien, ESLint.
- **6 octobre, la bulle du tutoriel** (§4.8) — plus de rang, la croix au lieu de *« je sais
  faire »* ; l'article désigné (`tutoArticle`, la clé `f`) : *« déplier »*, sa puce, puis son bloc,
  ramené dans le champ (`voirCibleTuto`). Puis le silence au premier écran et à la phrase complète,
  et l'en-tête DOSSIER sans compte. 532 contrôles, 8 règles du gardien, ESLint.
- **6 octobre, le rapport de Jean (Jean 4)** — `dejaEnvoyee` et *« déjà envoyée »* au composeur ;
  l'écran de fin terminal (`closeModal` supprimé, `clavier` neutre sous `#modalRoot`) ; le tutoriel
  dit *« Prends »* et dérive sa pièce (`pieceDemandee`) ; les compteurs d'agacement remis à zéro par
  `envoyerRemise` ; `suivrePhrase` attend un relais (`blocsOfferts`, `compoFinie`) ; contenu : `libelle`
  des articles, deux liens sans tag, fins réécrites. 552 contrôles, 8 règles du gardien, ESLint.
- **6 octobre, le retour de Bérengère, passe D** (§4.6) — le pli des remises closes défait
  (`remiseClose`, `remisesDepliees`, `basculerRemise`, `ordinal` supprimés, sept contrôles réduits à
  un) ; la DISCUSSION qui s'agrandit (`enteteDISCUSSION`, `basculerDISCUSSION`, `discussionAgrandie`,
  `.wrap.discussionAgrandie`), capturée par `npm run vue` en 1280×800 et 390×800. 555 contrôles,
  8 règles du gardien, ESLint.
- **6 octobre, passe E du `TODO.md` : la remise 1 en deux questions** (§3, §4.8) — `q_redacteur`
  remplace `q_arrivee` et `q_voix` ; `e_sig` nomme le brigadier ; les liens de 22h04 et 22h30
  retirés ; `tutoRetenir`, `tutoTermes`, `tutoServis` (`tutoAttendu` retiré), la pièce sans passage
  attendu renvoie à l'index ; une seconde citation, sur contenu muté, ne rallume pas le halo ; `npm
  run vue` capture *retenir pour comparer*. Fusionnée avec la passe D : 563 contrôles, 8 règles du
  gardien, ESLint.
- **6 octobre, passe F : l'article se retient, puis se prend** (§4.5, §4.6, §4.8, §11, §15) — le
  document d'abord, avec le §4.5 entier pour F et G, relu ; puis `articlesDe`, `articleRetenu`,
  `estLiaisonArticle`, `articleAttendu`, `prendreArticle`, `articleRefuse`, `tutoCleArticle`, le
  groupe *ARTICLES* ; l'atelier et les suites suivent. 587 contrôles, 8 règles du gardien, ESLint.
- **6 octobre, passe G : le joueur choisit la relation** (§4.2, §4.5, §4.7, §4.8, §4.11, §11, §14) —
  le bloc `relation` et le `libelle` des formes, `relationsDe` et `fausse` au moteur,
  `relationsOffertes`, `estSecondTerme`, la juxtaposition `auto`, `rep_relation_fausse` et
  `S.fausses` aux règles ; les deux boutons, `voirRelations`, le temps *« Choisis ce qui les lie »* ;
  le diagnostic et l'onglet Grammaire. Deux contrôles passaient par le vide (`deduit` cherché,
  disparu) : réécrits, avec un contrôle qui exige le second terme. 610 contrôles, 8 règles du
  gardien, ESLint.
- **6 octobre, passe H : un clic retient et prend** (§4.3, §4.5, §4.6, §4.8, §4.9, §4.10) — demande
  de l'auteur, pour réduire le nombre de gestes ; *se passer du CONTEXTE* écarté au compte.
  `retenirEtPrendre` aux règles — la fiche, rien de plus, et la garde *déjà dans la phrase* ; à
  l'écran, `echoPiece` (qui remplace `rappelRetrait`) et ses cinq lignes, la voix qui nomme les deux
  chemins, `tutoIntrus` et les consignes qui disent *clique*. Le harnais compose par le clic
  (`H.retenir`, `H.prendreLeTexte`), `H.surligner` devient *retenir seul* ; `npm run vue` clique,
  ne prend plus de fiche, et a montré deux défauts que la passe faisait naître — la ligne sous la
  pièce passée sous le pli (`voirEcho`), l'en-tête RÉPONSE rogné (`voirCibleTuto`). Chaque
  contrôle neuf vu tomber, une mutation chacun. 643 contrôles, 8 règles du gardien, ESLint.
  Une relecture de cohérence suit : le compte des gestes dit qu'il compte l'envoi, le pas-à-pas
  perd une branche morte, et la fiche d'un passage déjà dans la phrase dit *« déjà dans ta
  phrase »* comme la pièce, au lieu de *« ne veut rien dire »* (`passageDejaPris`). 649 contrôles.
- **7 octobre, passes I et J** (§4.5, §4.6, §4.8, §4.11, §6, §7, §8, §11, §15) — l'écran dit *ta
  RÉPONSE* ; puis **l'article se cherche** : `chercher`, `baseRecherche`, `articleOffert`,
  `suivreRecherche`, `S.recherche`, `S.trouves` aux règles ; le bouton du composeur et la zone
  RECHERCHE à l'écran ; la fiche d'article de la passe F retirée ; le tutoriel en trois temps ; la
  comparaison nue retenue en session 1. Neuf leurres, premier jet. Le harnais cherche, ouvre, clique
  (`H.prendreLeTexte`) ; le diagnostic et le pas-à-pas appellent `baseRecherche`. Chaque contrôle
  neuf vu tomber, dix mutations. 657 contrôles.
- **8 octobre, passe K** (§4.3, §4.6, §4.8, §4.11, §16, §17) — **plus de passages retenus** :
  `S.retenus`, `surligner`/`oublier` aux règles, `renderRetenus` et les fiches à l'écran s'en vont ;
  `retenirEtPrendre` devient `prendre`, et `poserBloc` reçoit la clé du passage. La pièce prend la
  hauteur du CONTEXTE ; un clic qui ne prend rien dit pourquoi sous la pièce. Le tutoriel perd
  *« prends sur ta fiche »* et gagne *« → Envoyer »* aux deux gestes (`tutoEnvoyer`,
  `tutoChercher`). La reprise laisse tomber `retenus`/`memoire`. Le pas-à-pas de l'atelier garde
  ses repérages à lui (`SIM.surlignes`). Le harnais n'a plus que `H.cliquer`. Sept mutations, chaque
  contrôle neuf vu tomber. Au passage, `npm test` était rouge depuis `da63f26` (*« RÉPONSE.. »*).
  646 contrôles.
- **8 octobre, passe L** (§4.6, §17) — le CONTEXTE s'appelle **DOSSIER** à l'écran, son index
  **DOCUMENTS** (*auteur* : il tient les pièces et les articles) ; le code garde `contexte`. Une vingtaine de chaînes, l'atelier (inspecteur, frise), et
  un contrôle qui veut qu'aucun mot de CONTEXTE ne reste à l'écran, vu tomber. 647 contrôles.
- **8 octobre, passe M** (§4.3, §4.6, §4.8, §4.11) — le retour de Jean : `dossierDeplie` s'en va,
  l'index ne se replie plus qu'à la main ; `cadresPorte` devient `filetsPorte`, un filet sous le
  titre, et le texte de l'article a l'aspect d'un passage. Deux mutations, les contrôles neufs vus
  tomber. Puis la voix (« Ouvre un document », l'index déplié) et le bouton de remise (« N documents
  ajoutés au DOSSIER »). 650 contrôles.
- **8 octobre, relecture du glossaire** (§4.6, §4.8, §16, §17) — ce que les passes I à M avaient
  laissé derrière : `recuAvant` au §17, `retenirEtPrendre` au §2, la fiche d'article de l'atelier,
  les règles « livrées » de la frise, `SIM.surlignes` du pas-à-pas (remplacé par les pièces
  ouvertes), « se retient ET se pose » dans `vue.js`, `.dcompte` mort. CONTEXTE → DOSSIER dans les
  commentaires et les libellés ; *pièce* / *document* tranché par l'auteur ; la répétition dit
  *réponse*. ESLint, rouge depuis la passe M, revient au vert. Puis le pas-à-pas referme la pièce
  (`simRefermer`) : le `declenche` n'y partait jamais. Cinq contrôles neufs vus tomber.
  655 contrôles.

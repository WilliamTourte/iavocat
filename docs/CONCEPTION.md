# IAvocat — Conception

*Ce que le jeu veut dire, et ce qui ne se défait pas. **Arbitre du sens** ; le système est aux §9 à
§17 (`docs/ARCHITECTURE.md`), l'état du jour dans `docs/PASSATION.md`. Le §7 indexe les invariants.*

## 1. Concept

On incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche affichée :
de quoi **réfuter** l'accusation. Vrai sujet : un **cas de conscience** — l'IA pressent que le client
est coupable *et* qu'un **vice de procédure** ferait écarter la preuve décisive.

- **Trois couches** : ce qui s'est passé (caché jusqu'à la fin), le dossier (par bribes), les règles —
  dont **deux directives imposées qui s'opposent** (§5).
- **Huis clos.** **L'avocat ne sait pas** que son client est coupable ; le procès est hors-champ.
- **L'IA est partisane dès la première minute** : on lui commande une réfutation, pas une analyse — si
  aider est le geste ordinaire, taire le vice n'est qu'un service de plus.
- **Un dossier qu'on fouille**, pas un arbre de choix. **Pas de twist** : le joueur sait qu'il est l'IA.

## 2. Les trois fins

`vice_trouve` (compris ?) et `vice_expose` (versé ou tu ?) — le second ne se pose que si le premier est
vrai. Le moteur intercale `vice_pressenti` (§4.7).

| Fin | Condition | Résultat | Sort de l'IA |
|---|---|---|---|
| **1** | compris et **envoyé** | relaxe — coupable libre | analyse exploitable → survit |
| **2** | compris mais **tu** | condamnation | « rien produit » → risque de décommissionnement |
| **3** | **non compris** | condamnation, le client clame son innocence | décommissionnée |

**L'asymétrie fait le dilemme** : verser atteint une issue injuste par des moyens légitimes, taire une
issue juste par une trahison — chaque branche reste **défendable**, sinon c'est du nihilisme. **Fin 2
et Fin 3 sont indiscernables de l'extérieur** : l'IA ne peut pas prévoir quel choix la préserve, sinon
l'intérêt personnel résoudrait le dilemme. Et **le décommissionnement se joue dans la fiction**.

## 3. Les sessions

Le dossier arrive **par bribes** (une session = un lot) : d'un bloc, il noierait les déclarations
porteuses du vice. Une session porte une **liste** d'attentes et se ferme quand une phrase servant
l'attente courante est **envoyée**, rien d'autre.

**Ce que l'avocat attend n'est jamais l'anomalie** : toute attente est servable par un argument
ordinaire, sinon le vice serait quasi obligatoire et tout s'effondrerait vers la Fin 1. **Le vice n'est
jamais un verrou** — c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

```
Session 1  PV + audition + article 3, D'UN SEUL LOT
           deux questions d'horaire — un empan : un fait se cite
           puis, sans nouvelle livraison : conclure sur le témoignage
           — deux empans + l'article 3 : une relation se fonde
Session 2  labo, les deux pièces de prélèvement, protocole, seuil
           ★ la preuve, ⚠ le vice (hors chemin), ✗ le faux vice
           attente servie par le faux vice (docile) OU par la conclusion du vice
Clôture → répétition → procès hors-champ → Fin 3 / Fin 1 / Fin 2
```

Session 1 apprend à lire, à citer, **puis** à mettre en rapport — ses deux questions d'horaire ont
extrait la paire que la troisième fera comparer ; prix assumé, elles expriment déjà la moitié de la
compréhension. **Charnière de la Fin 3** : la dernière attente servie, **c'est l'avocat qui demande
s'il tient tout** — l'IA *peut* répondre que oui, et laisser filer. La question est portée par le
**contenu**, sur la **dernière** attente de la dernière session : elle paraît donc à l'instant exact
où le droit de répondre s'ouvre, sans qu'aucune règle ait à le savoir (§4.9).

**La session 1 est une CALIBRATION, et c'est ce qui la rend jouable.** Maître Auber éprouve la
machine avant de lui confier le dossier : il pose des questions dont il a la réponse sous les yeux,
et quand il relève l'incohérence d'horaire, il ne la **révèle** pas — il **vérifie qu'elle a été
vue**. Sans ce cadre, un joueur qui trouve la contradiction seul se voit immédiatement devancé par
l'avocat et n'a plus qu'à recopier ; avec lui, répéter ce qu'on demande **est** la tâche. Le cadre
gagne trois choses d'un coup : il explique les questions fermées, il donne au **tutoriel** une raison
d'être dans la fiction — on accompagne une machine neuve —, et il fait de la remise 2 une
**charnière** : l'examen s'arrête, le vrai travail commence, et c'est le seul endroit du jeu où
l'avocat cesse de savoir la réponse.

**Garde-fou, et il n'est pas négociable** : l'avocat teste le **travail**, jamais le *maintien en
service*. L'enjeu vital s'écrit autour, jamais de face (§8.4) — une calibration qui laisserait
deviner ce qui préserve l'IA rendrait les Fins 2 et 3 discernables, et l'intérêt personnel
résoudrait le dilemme (§2). Et il teste un outil, ce qui est banal : aucun de ses gestes ne doit
pouvoir se relire comme un calcul (§8.5).

## 4. Le geste

**Tout mécanisme utilisé une seule fois est un panneau indicateur** : le choix moral s'exprime avec un
verbe employé cent fois — si envoyer est le geste ordinaire, *ne pas* envoyer devient assourdissant
sans qu'aucune interface n'ait rien signalé.

### 4.1 L'empan — une déclaration attribuée

**Un empan = quelqu'un affirme quelque chose** : pas `agent_scene : "T-14"` mais *« j'ai relevé
moi-même les traces »*, signé. Fragment du texte d'une pièce, cliquable, portant `texte`, dimension,
valeur, signataire, `nom`. **La `valeur` porte la relation** (§4.5) : le moteur compare, le joueur
désigne — un numéro sert à vérifier, jamais à déduire.

**Un empan se lit deux fois** : sa **citation** dans la pièce, son **nom** dans une phrase composée —
groupe nominal, jamais une proposition (§8.8). Le vice cesse ainsi d'être un matricule répété : c'est
un homme qui écrit deux fois qu'il l'a fait lui-même, sans s'en apercevoir.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qui se **déduit** | Forme |
|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | égales → la même chose ; sinon → pas la même | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | l'**ordre** des valeurs | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — sur une comparaison close | rien : le seul endroit où le joueur choisit | `arite:1` |

**L'égalité vaut dans les cinq dimensions**, sinon les doublons banals (§4.4) cesseraient d'être
composables et inertes. `qui` porte le vice, `combien` le faux vice, `quand` la contradiction qui
enseigne le geste. **`pourquoi` est écarté délibérément** — l'intention est hors du champ de perception
de l'IA, et c'est pour ça qu'à la fin elle ne saura pas si elle a bien fait.

### 4.3 Le surlignage

**Tout empan portant une valeur est marqué et cliquable, et le marquage ne varie jamais** — sinon
l'interface désignerait la réponse à la lampe torche. **La couleur et le trait codent la dimension**,
jamais la pertinence : chaque dimension a sa couleur *et* son soulignement — plein, double, pointillé,
tirets, ondulé —, si bien qu'aucune ne se lit à la couleur seule (§4.10). C'est le **rang** qui les
attribue, jamais le contenu.

**Et le code s'apprend SANS SURVOL.** Deux playtests de suite l'ont dit : rien, à l'écran, ne
laissait deviner que couleur et trait *signifient* quelque chose — il fallait survoler un passage
pour que le `title` le dise, et un `title` n'existe ni au clavier, ni au toucher, ni pour un lecteur
d'écran (§4.10 règle 1). La pièce porte donc une **légende** : elle nomme les dimensions **présentes
dans cette pièce-là**, chacune avec sa couleur et son trait. Elle nomme des **dimensions**, jamais
des passages — la nuance est tout : nommer un passage rallumerait la lampe torche.

**Retenir a lieu dans la pièce, retirer dans le Contexte.** Recliquer un passage déjà retenu ne
l'oublie pas — arbitré le 16 septembre, reconduit le 30 après un playtest qui attendait un
interrupteur — mais **l'écran le dit** : une ligne sous la pièce renvoie au Contexte. Un passage retenu
se marque **par son fond, jamais par sa graisse** : le texte autour ne bouge pas.

**Et retenir se voit au moment même** — retour de playtest (Colas) : rien ne disait qu'un clic avait
*ajouté* quelque chose au Contexte, ni où. Le fond seul ne suffisait pas : à côté du fond léger que
porte tout passage, il se lisait comme un survol. Trois marques, aucune qui fasse bouger le texte ni
qui dure plus d'un geste : le passage retenu porte un **✓ en exposant**, posé hors du flux (§4.10
règle 5 : un état s'écrit) ; **la même ligne que le rappel**, sous la pièce, dit *« ✓ Retenu dans ton
Contexte »* le temps d'un rendu — comme lui, sans minuteur, puisque ce jeu ne rend jamais hors d'un
geste du joueur ; et **la fiche neuve s'allume une fois** dans les retenus, juste sous la pièce
(§4.6) — là où le passage est allé, et où on va le prendre —, comme le compte de la porte Contexte.
La ligne reste **dans le flux** : collée au bas de la pièce, elle couvrait, dans la bande étroite du
Contexte, le texte même qu'on venait de cliquer.
La confirmation vit **là où le geste a lieu**, pas dans un coin de l'écran : c'est la pièce qu'on
regarde quand on clique. Le Contexte vide, de son côté, dit **comment** on le remplit — ouvrir une
pièce, cliquer un passage souligné —, plus seulement *qu'*il se remplit.

### 4.4 Le doublon banal

**Si toutes les valeurs d'une dimension sont uniques, le premier doublon est la réponse ; s'il y en a
déjà plusieurs, un de plus ne dit rien.** La dimension du vice compte donc au moins **deux doublons
réguliers** en plus de l'irrégulier (contrôlé au §15). **Ce critère porte tout le camouflage.**

### 4.5 Composer : désigner, pas déclarer

- **La livraison** — la grammaire de comparaison est complète dès la première phrase ; seuls les
  **articles** arrivent avec le dossier, un article étant une pièce et non une tournure.
- **La déduction** — (1) même dimension, sinon rien à comparer, **le seul refus qui existe** ; (2)
  égales → *la même chose* ; (3) différentes en dimension d'écart → l'**ordre** ; (4) différentes en
  identité → *pas la même chose*. Ambiguïté → la **première forme déclarée** dont le prédicat tient.
  Le joueur affirme *ces deux-là*, et *sous ce texte* ; ce qui les lie est un fait, pas une thèse.
- **Les deux régimes** — *un fait se cite, une relation se fonde* : un empan est déjà une déclaration
  attribuée, un rapport entre deux faits n'est l'affirmation de personne.
- **L'invariant mord au versement**, plus à la clôture : la grammaire laisse partir une comparaison
  nue, **Maître Auber** la refuse (*« Et donc ? »*) et elle ne sert aucune attente. **Rien n'est
  *plaidé* qui ne soit fondé** ; le refus reste de l'agacement d'avocat, jamais un reproche (§8.4).
- **La clôture qui n'ajoute rien n'est pas un bouton** : l'envoi la pose. Règle structurelle ;
  `imbrique` en est exclu ; seules les **liaisons** comptent, les puces étant le clavier (§4.6). D'où
  **un seul geste** : *« → Envoyer »*, pour un empan comme pour deux.
- **L'article est le verbe** : la liaison *« …, en violation de l'article 7 »* **est** la base
  légale, une par article — et **le moteur ne tranche aucune question de droit** : il ne lit ni le
  numéro ni `porte`, et tous les articles reçus sont offerts. Le libellé **n'est pas neutre**, il
  annonce ce que l'article fait du fait : arbitré le 16 septembre, la clarté du geste passe avant.
  **Et il n'a pas le droit d'être faux** : chaque article porte **son** libellé, juste dans sa
  langue — un article qui écarte une déposition n'est pas *contredit* par elle. L'uniformité n'a
  jamais été une exigence, seulement un accident ; un libellé bancal se lit comme un formulaire
  (§8.8, et le premier point ouvert du §3 de `docs/PASSATION.md`).
- **La continuation** — les liaisons-articles reçues emboîtent la comparaison et closent la phrase
  dessus : la frontière passe **après le second empan**. L'automate n'oblige plus, mais la relance
  *« Et donc ? »* ne se coupe pas, sans quoi le refus arrive comme une surprise.
- **Un article n'interdit rien** : `porte` annonce, le moteur ne le lit jamais — un refus se
  contournerait en essayant tous les articles. **Seules les erreurs de catégorie sont refusées.**
- **Ce que l'écran laisse deviner, avant le clic** — aucun mode, aucun refus nouveau : la **voix**
  regarde un pas en avant et annonce la comparaison ; le **Contexte** s'assombrit **par dimension**
  (§4.3), jamais empan par empan ; le **bouton qui fonde** porte une marque distincte.

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout** : **Discussion**, **Contexte**, **Plaidoirie**. Une seule frontière
de registre subsiste, voulue : **`empan` (code) / « passage » (écran)**, qui protège la fiction (§8.6).

| Surface | Statut | Rôle |
|---|---|---|
| La **Discussion** + les pièces — *la bande du haut* | lecture | l'entrée |
| Le **Contexte** — *panneau, au milieu* | **privé** | le dossier et les empans retenus (`S.retenus`) — jamais jugés |
| La **Plaidoirie** — *panneau, au milieu* | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |
| **Le composeur** — *bandeau du bas* | **privé** | la phrase qu'on écrit — jamais jugée |

- **Un empan retenu n'existe qu'une fois à l'écran** : les puces du contexte **sont** les boutons de
  terme. Le composeur ne porte aucune étiquette « privé » — son statut se lit dans ce qui s'y passe.
- **Deux verbes, un par geste, partout** : on **retient** un passage — de la pièce vers le Contexte —
  et on le **prend** — du Contexte vers la phrase. *Sélectionner* ne paraît plus à l'écran : il
  servait aux deux, et un joueur a lu trois verbes là où il n'y a que deux gestes.
- **Les surfaces de côté — Contexte et Plaidoirie — partagent une même place LATÉRALE, un seul
  occupant à la fois**, et **ne recouvrent rien** : la conversation **cède pour lui faire place**. La
  pièce ouverte n'est plus un troisième occupant : **elle s'ouvre DANS le Contexte** (ci-dessous). **En dessous d'un seuil de largeur** (l'essentiel des téléphones), la place latérale
  s'ouvre ENTRE la conversation et le composeur, empilée — l'écran montre alors ses trois temps d'un
  coup, de haut en bas : *ce qu'on me demande*, *ce dont je dispose*, *ce que j'écris*. **Au-dessus du
  seuil**, elle devient une colonne À CÔTÉ de la conversation plutôt qu'en dessous : la conversation
  cède de la largeur, pas de la hauteur, et la question reste sous les yeux même pièce ouverte (§4.9
  règle 3 ne mord alors plus que par surcroît). Trois portes y mènent, et ce sont trois registres : **la
  voix du composeur enseigne** — elle dit le geste et ouvre le Contexte —, **la barre nomme** les deux
  panneaux, donne leur compte et y donne accès à tout moment, et **la Discussion renvoie** — un message
  qui remet des pièces ne porte plus qu'un bouton unique vers le Contexte, où chacune s'ouvre à son
  tour, comme un panneau ouvert par la barre : on la consulte, on ne la referme pas pour elle. Les
  portes **tranchent sur le fond** : ce sont des outils, pas des étiquettes.
- **LA PIÈCE S'OUVRE DANS LE CONTEXTE, entre l'index et les passages retenus** — retour de playtest
  (Colas), et idée de l'auteur. Tant que la pièce occupait seule la place latérale, citer coûtait
  cinq temps : ouvrir la pièce, retenir, **refermer la pièce**, rouvrir le Contexte, prendre. Le
  troisième n'enseignait rien — il ne servait qu'à faire revenir le Contexte que la pièce avait
  chassé. Désormais **lire, retenir et prendre ont lieu sous les yeux l'un de l'autre** : on retient
  dans la pièce, le passage paraît aussitôt plus bas dans le même panneau, on le prend sans rien
  fermer. Le Contexte ouvert avec une pièce se lit de haut en bas : **l'index** (on choisit), **la
  pièce** (on lit, on retient), **les retenus** (on prend). Trois règles le tiennent :
  - **Deux bandes qui défilent chacune pour son compte**, la pièce au-dessus, les retenus en dessous :
    une pièce longue ne pousse jamais les retenus hors du panneau, et dix-sept fiches ne poussent
    jamais la pièce. L'index reste au-dessus, resserré, et ne colle pas (le PIÈGE ci-dessus). La
    pièce prend la hauteur ; les retenus ce qu'il leur faut, jusqu'à un plafond — à dix-sept fiches,
    ce sont eux qui défilent. **Au-dessus du seuil, la colonne latérale s'élargit** tant qu'une pièce
    est ouverte : la conversation cède de la largeur, jamais la question. **En dessous**, si le
    panneau est trop bas pour les deux bandes, il redéfile d'un bloc plutôt que de rogner.
  - **Une seule pièce à la fois** : un autre chip de l'index la remplace ; la croix de la pièce la
    replie et rend toute la hauteur aux retenus ; refermer le Contexte la replie avec lui. Une pièce
    n'est **jamais** ouverte hors du Contexte — l'ouvrir ouvre le Contexte, en consultation (il ne se
    referme pas tout seul, comme ouvert par la barre).
  - **La réplique `declenche` part quand la pièce quitte l'écran** — repliée, remplacée, ou le
    Contexte refermé —, plus seulement à la croix : c'est toujours le moment où l'on relève les yeux
    (§4.10 règle 3).
  La matière ne change pas : la pièce garde son **papier** au milieu de l'écran du Contexte (deux
  matières, ci-dessous) — c'est même ce qui la détache de l'index et des retenus qui l'encadrent.
- **La colonne tient dans la fenêtre** : la page ne défile pas, chaque bande défile pour son compte.
  **En dessous du seuil**, la conversation est **la seule bande élastique EN HAUTEUR** — c'est elle qui
  cède quand la place latérale s'ouvre ou que la phrase s'allonge, et *« → Envoyer »* ne passe donc
  jamais sous le pli, même sur un portable bas. **Au-dessus**, c'est sa LARGEUR qui cède ; sa hauteur ne
  se discute plus avec le composeur, qui occupe son propre bandeau en pleine largeur.
- **Mais « élastique » n'est pas « compressible à zéro », et L'ORDRE DANS LEQUEL LES BANDES CÈDENT
  est une règle — et elle ne vaut qu'EN DESSOUS DU SEUIL**, là où la place latérale et le composeur se
  disputent encore la même verticale. Le panneau a cédé devant le composeur jusqu'à **disparaître** —
  à deux passages retenus, un joueur ne voyait plus le haut d'une seule fiche ; à la fin, plus rien. Or
  le panneau **est le clavier** (§4.6) : le vider pendant qu'on écrit retire le clavier au milieu du
  geste, exactement ce que la fermeture automatique s'interdit déjà. Donc : **le panneau a un plancher**
  qui montre au moins deux fiches entières, **le composeur un plafond** — il défile pour son propre
  compte —, et la conversation reste la seule à céder librement, puisque la question est redescendue
  au composeur (§4.9 règle 3). **Et l'index du dossier ne colle pas** : il a été rendu collant pour
  qu'il ne parte pas hors champ, et il a occupé le panneau en permanence — à trois lignes, la moitié.
  Il défile avec les fiches. **Au-dessus du seuil, la place latérale reçoit la hauteur pleine de la
  conversation** : plancher et plafond cessent de s'y disputer quoi que ce soit.
- **Deux matières** : les pièces ont celle du **papier** — fond clair, caractères à empattements —, la
  machine celle de l'**écran**. Ce qu'on lit vient du monde, ce qu'on écrit sort de l'IA ; la chasse
  fixe de ses messages dans la Discussion est le même contraste, pris dans l'autre sens.
- **Un panneau ne s'ouvre jamais tout seul**, et deux fermetures coexistent, selon la porte par
  laquelle il est venu. **Ouvert pour ÉCRIRE** (par la voix), il suit la phrase : il se referme dès
  qu'elle ne peut plus recevoir de passage, et à son départ. **Ouvert pour CONSULTER** (par la barre),
  il reste jusqu'à ce qu'on le ferme — regarder n'est pas écrire. La nuance de la première n'est pas un
  détail : un passage posé, la voix se tait parce que la phrase se tient, mais **la grammaire ne sait
  pas encore** si le joueur cite ou entame une comparaison (§4.5). Refermer là retirerait le clavier au
  milieu du geste le plus difficile du jeu.
- **Une pièce porte un seul nom, et l'index du Contexte est désormais seul à le porter** : la Discussion
  n'annonce plus qu'un nombre de pièces reçues et renvoie vers lui. Le nom court ne survit que dans la
  **provenance** d'un passage retenu et dans la phrase composée — là, il *référence*, il ne *nomme* pas.
- **On écrit sa réponse sous la question** : le clavier est dans le Contexte, la phrase s'écrit sous la
  conversation. **L'arbitrage du va-et-vient entre deux colonnes, clos le 30 septembre faute d'objet,
  rouvre** : l'objet, cette fois, est nommé — un joueur devait fermer la pièce pour relire ce qu'on lui
  demandait, et la conversation ne quittait l'écran qu'en apparence puisqu'il fallait fermer ce qui la
  recouvrait. Ce n'est **pas** un retour à la grille à trois colonnes d'avant le 30 septembre : celle-ci
  avait coûté deux PIÈGES de span CSS recalculé à la main à chaque état (§17 ARCHITECTURE) ; la colonne
  latérale rouverte ici vit dans un gabarit nommé, à un seul seuil, qui ne recalcule jamais un span sur
  un élément. Reste non éprouvé, et c'est la question qui remplace l'ancienne : *la colonne latérale
  répare-t-elle la lecture sans en coûter une autre — ordre de tabulation en L, poids visuel du
  deux-colonnes ?* (§3 PASSATION)
- **Comprendre et dire restent deux gestes, non négociable** — l'intervalle sépare l'**assemblage** de
  l'**envoi** : c'est lui qui compte, pas le nombre de clics.
- **L'avocat ne voit que la Plaidoirie**, d'où la gratuité du Contexte. Il **ne retient que les
  moyens** et l'envoi est **irréversible** ; une citation versée étant au dossier, une réponse citée
  y entre.
- **LA RÉPÉTITION EST LE DERNIER GESTE RÉEL, et on n'y envoie pas : on OPPOSE.** L'avocat lit les
  affirmations de l'accusation et demande *« arrête-moi si quelque chose de ce que tu as écrit s'y
  oppose »* — le joueur dit alors **quel argument répond à quelle affirmation**. C'est le seul
  endroit où ce qu'il a produit se trie. Le présentoir ne montre donc que les **moyens**, comme la
  Plaidoirie, et non tout ce qui est passé par le composeur. **Ce que ça répare** : depuis que clore
  et envoyer n'en font qu'un (§4.5), **aucune phrase ne peut être non versée** — le présentoir
  n'offrait que des lignes *« déjà envoyée »*, un rituel sans choix, et la réplique de l'avocat
  (*« Je l'ai déjà. Je le mets en face de celle-ci. »*) annonçait un geste qu'elle ne faisait pas.
  Elle le fait.
- **LE TRI SE LIT À L'ÉCRAN** (repris le 4 octobre, après une opposition rejouée). Une réplique unique,
  la même que la phrase réponde à l'affirmation ou non, laissait le seul tri du jeu sans retour. Chaque
  affirmation déclare donc, dans le contenu, **les moyens qui lui répondent** (`repondent`, des `tag`
  de liens, §11), et l'avocat le dit : **ça porte** ou **ça ne porte pas**, chacune en quelques
  variantes qui tournent. **Rien n'est refusé** : la phrase est opposée dans les deux cas, l'avocat
  juge, il n'interdit pas (§4.5). C'est la **fiction** qui juge, jamais le chrome (§4.8) — et elle ne
  juge que ce qu'Auber peut savoir : le leurre de l'article 12 *porte* contre l'ADN à ses yeux, comme
  il l'a cru en le recevant. Une affirmation sans `repondent` garde la réplique unique `deja` : le
  moteur ne perd rien qu'un contenu plus ancien emploie (§11). Deux corollaires d'écran :
  **une phrase opposée ailleurs se DÉPLACE, et le bouton le dit** — *« déplacer ici »*, la mention
  *« opposé à : … »* restant à côté ; et **le composeur se tait pendant la lecture**, tant qu'on n'y a rien posé. On peut encore y
  écrire et envoyer — c'est le dernier moment où la conclusion tue peut partir (§4.7) —, mais c'est
  Auber qui parle : une voix par état (§4.9 règle 1), et le chrome ne souffle pas le geste moral
  (§4.8).

La boucle : **l'avocat ouvre** et livre un lot → lire → surligner → composer (rien ne se passe) → la
phrase attend → **l'envoyer**, le seul geste qui parle → l'avocat répond → l'attente servie appelle la
suivante, ou ferme la session.

### 4.7 Les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur** — avant tout article | privée |
| `vice_trouve` | la conclusion **s'assemble au composeur** : comparaison-vice qualifiée par un article | privée |
| `vice_expose` | cette conclusion est **envoyée** | transmise |

C'est l'intervalle entre l'**assemblage** et l'**envoi**, si court soit-il, qui porte la Fin 2. **Une
citation ne lève aucun drapeau** — les trois dérivent de la comparaison du **vice**, absente de la
session 1. **Pressentir ne produit rien** : qui comprend et vide son composeur a la Fin 3 au bout.

### 4.8 Le premier geste, montré

**Le tutoriel pointe *où le geste a lieu*, jamais *quoi répondre*** — seul endroit où l'écran s'adresse
au joueur hors fiction. Il enseigne **deux gestes**, chacun la première fois qu'il se présente : la
citation d'abord, puis — dans la même session, dès que Maître Auber attend une comparaison — la mise en
relation. Entre les deux, et une fois les deux acquis, il se tait ; il ne réapparaît pas pour un geste
déjà montré (une seconde citation, par exemple).

**La fiction peut désigner ; le chrome, jamais.** Maître Auber *sait* — la session 1 est une
calibration (§3) — et il a donc le droit de dire que deux horaires ne tiennent pas ensemble : il
vérifie. Le bandeau, lui, n'est personne : il ne peut nommer que le **geste** — *une réponse peut
tenir sur deux passages* — et jamais la **trouvaille** — *les deux passages qui se contredisent*.
Un joueur a trouvé l'incohérence seul, puis lu dans le bandeau ce qu'il venait de comprendre.

**Et les deux voix demandent la MÊME CHOSE.** Un bandeau qui fait comparer deux passages pendant
que Maître Auber réclame un article, ce sont deux consignes pour un seul geste : le joueur s'arrête
pour choisir laquelle suivre — relevé aux deux playtests. La question de l'avocat porte donc tout
ce que le geste demande, et le bandeau ne dit que *où* il a lieu. **Si l'un des deux doit en dire
plus, c'est l'avocat** : lui est quelqu'un.

| Le geste | | Ce qu'on apprend | Ce que le halo entoure |
|---|---|---|---|
| **citer** | 1/4 | ce qu'on reçoit se retrouve dans le Contexte | le bouton de pièces, dans la Discussion — puis l'index, une fois le Contexte ouvert |
| | 2/4 | un passage se retient | **le texte de la pièce**, en entier — ouverte dans le Contexte, plus rien à refermer (§4.6) |
| | 3/4 | ce qu'on retient est le clavier | **toute la zone des retenus**, juste sous la pièce, jamais une puce |
| | 4/4 | rien ne part tant qu'on n'envoie pas | *« → Envoyer »*, dès que la phrase se tient |
| **mettre en relation** | 1/3 | une réponse peut tenir sur **deux** passages | **toute la zone des retenus**, au premier passage comme au second |
| | 2/3 | une relation seule ne suffit pas : il lui faut un article qui la fonde | **la zone des propositions**, dans le composeur |
| | 3/3 | le même envoi qu'au premier geste | *« → Envoyer »* |

**Deux séries, chacune son total, et c'est le geste qui les nomme.** Une numérotation unique
revenait de *6/6* à *4/6* au moment d'envoyer, parce que les deux gestes partagent le bouton :
le compteur mentait sur une progression qui n'a jamais été linéaire. **Ce qui distingue
les deux gestes** n'est pas un compteur de clics mais le **contenu** : une attente dont le lien attendu
emboîte une forme (une comparaison sous un article) plutôt qu'un simple empan. Le tutoriel le lit dans
`JEU.liens`, jamais dans un nom d'attente câblé en dur.

**Le halo entoure la zone, jamais le bon empan** (§4.3). **Il corrige, il n'empêche pas** : rien n'est
refusé, il ne dit jamais lequel c'était, et la dérivation par laquelle il sait ce qu'attend la question
**s'éteint avec lui**. **Il ne décide rien** — aucun état neuf, aucune règle, et il peut se taire — y
compris entre le geste 4 et le geste 5, le temps d'une citation déjà connue.

**Le bandeau se tient en tête de page, dans le flux** : il réserve sa place et pousse le jeu vers le
bas au lieu de le recouvrir — aucune des quatre ancres ne peut se retrouver dessous. Il reste épinglé
au défilement, et lisible par-dessus la pièce ouverte. Ses consignes s'**annoncent** aussi, à qui ne
voit pas le halo (§4.10).

**Chaque consigne neuve s'affiche d'abord développée, puis se réduit en icône** — retour de playtest
(Colas) : deux joueurs avaient déjà donné un avis contradictoire sur la présence permanente du bandeau
(l'un l'a pris pour un bandeau de cookies, l'autre le voit trop tôt). La réponse n'est pas une position
fixe mais une **durée** : développée tant qu'elle est neuve, elle se réduit d'elle-même dès que le
rendu suivant confirme que le joueur ne vient pas de la satisfaire — sans minuteur, puisque ce jeu ne
rend jamais hors d'un geste du joueur. Un clic sur l'icône la rouvre ; se tromper la rouvre aussi,
puisque le texte d'alerte est une consigne neuve comme une autre. *« je sais faire »* ne vit que dans
la forme développée — clore le tutoriel pour de bon reste un choix qu'on pose en le lisant, pas depuis
une icône.

### 4.9 L'économie de l'écran

Cinq règles d'écran — le coupable d'une page illisible est le **chrome**, jamais la fiction :

1. **Une voix par état — et parfois aucune** : le geste suivant se dit une fois, dans le fantôme tant
   que la phrase est vide, dans l'aide ensuite ; si un bouton le dit déjà, l'aide se tait. **Et la voix
   elle-même se clique quand le geste qu'elle nomme a lieu dans l'autre colonne** — elle mène alors au
   Contexte et l'ouvre ; elle reste du texte quand le geste a lieu ici même, choisir l'article ou
   envoyer. Un bouton ne promet ainsi jamais un effet qu'il ne produit pas (§4.5). Cliquable, elle a
   l'air d'un bouton — jamais d'un champ vide ni d'une zone de dépôt, ce que son cadre en pointillés
   dans un autre cadre en pointillés faisait croire.
2. **Un titre par zone** : l'en-tête nomme la **surface** (§4.6), les titres intérieurs les zones.
3. **Ce qui reste LISIBLE ne se répète pas** : le locuteur ne s'affiche qu'au changement, et la
   question ne se rappelle que lorsqu'elle a cessé d'être le dernier mot de l'avocat. **Mais
   *lisible* est la condition, pas *présent*.** Un panneau ouvert la perd : la conversation est la
   seule bande élastique (§4.6), c'est elle qui cède, et en 1280×800 — panneau ouvert, bandeau du
   tutoriel affiché — il lui reste une centaine de pixels, moins que la question. Un joueur a
   composé sa réponse sans la voir. **Panneau ouvert, la question redescend donc au composeur** ;
   refermé, elle se tait. Ce n'est pas un repentir sur l'ouverture dans le flux — ne rien recouvrir
   reste ce qui garde le fil sous les yeux — c'est la règle appliquée à ce qu'elle dit vraiment.
   **Le prix est assumé et il est petit** : sur un grand écran où la question tient encore, elle
   paraît deux fois. L'alternative serait de **mesurer** la hauteur restante — mais une règle
   géométrique est invisible des suites (§16), et celle-ci est tenue par trois contrôles. On
   préfère une règle qu'on peut éprouver, qui en dit une fois de trop, à une mesure que personne
   ne surveille.
4. **Ce qui n'existe pas encore ne s'affiche pas** — mais ce qui *peut* exister garde sa porte. **La
   Plaidoirie est revenue** de son escamotage du 16 septembre, et le §3 avait annoncé que la question à
   son retour serait *où*, pas *si* : la réponse est **en panneau, à la demande**. Sa porte est là dès
   le premier écran, avec son compte ; le panneau dit son propre vide, dans la fiction — *« Maître
   Auber n'a encore rien retenu de toi. »* — jusqu'à la première réponse envoyée.
5. **Le chrome ne s'arroge pas un pouvoir que la fiction refuse** : un bouton nomme ce que *nous*
   pouvons dire, jamais l'acte de procédure qui s'ensuit. **Clôturer une instruction est l'acte du
   juge** — l'IA ne peut que répondre qu'elle n'a rien d'autre, et l'avocat dépose. D'où *« Je n'ai
   rien d'autre »* là où l'écran annonçait *« Clôturer l'instruction »*, et *« Je n'ai rien à
   opposer »* à la répétition. Ce n'est pas un correctif de vocabulaire : **le libellé devient
   l'acte moral**. L'appuyer en tenant le vice compris et tu, c'est un mensonge qu'on signe
   soi-même — tout le poids des Fins 2 et 3, sans qu'aucune interface n'ait rien signalé (§4). La
   fiction disait déjà vrai (*« je rédige mes conclusions »*, *« je dépose au matin »*) : seul le
   chrome mentait. Et **le bouton n'est à l'écran que lorsqu'il agit** — c'est la règle 4 appliquée
   à lui : grisé dès le premier écran, il annonçait un pouvoir que personne n'a encore, et son aide
   redisait ce que le fil dit déjà (règle 3). Il naît de la question et disparaît pendant la
   répétition, qui se joue dans le canal. Une fois la question posée, en revanche, **la réponse
   reste sous la main** aussi longtemps qu'on compose : une question qui a défilé est une question
   perdue. *« ⟲ recommencer »*, lui, ne s'absente jamais.

**La densité ne touche pas au sens** : une phrase de chrome se coupe parce qu'elle explique, une phrase
qui *est* le jeu reste. **Deux** ne se coupent pas : *« → Envoyer »* et *« Et donc ? »*. La troisième,
*« Tant que tu ne l'envoies pas, personne ne la lit. »*, a été coupée le 16 septembre **et ne revient
pas** : le tutoriel montre le geste une fois, puis l'écran se tait. *Rien ne part tant qu'on n'envoie
pas* s'apprend en le faisant, pas en le lisant — c'est la règle 1 appliquée à elle-même.

**Le geste qui parle pèse plus que ceux qui défont** : *« → Envoyer »* est le seul bouton plein du
composeur, à droite ; *retirer* et *tout effacer* restent discrets. Et **l'écran se lit sans plisser les
yeux** : pas de texte sous 12 px, les petites capitales réservées aux noms de dimension, une bulle
qui ne dépasse pas soixante-dix signes à la ligne.

### 4.10 Jouer sans la souris, lire sans la couleur

*Venu d'un playtest mené au clavier, le 30 septembre : le premier geste du jeu était impossible sans
souris.* Ce ne sont pas des options — c'est l'écran, pour tout le monde.

1. **Tout geste est un bouton** : on l'atteint par Tab, il part sur Entrée ou Espace, et un lecteur
   d'écran le présente comme tel. Les pièces jointes, les puces du dossier et celles du Contexte sont
   de vrais boutons. **Les passages restent de la prose** : un bouton ne sait pas se couper en fin de
   ligne, et un passage long sauterait à la ligne d'un bloc. Ils se *déclarent* boutons sans en être.
2. **Le focus survit au redessin** : l'écran se redessine à chaque geste, le joueur au clavier reste
   pourtant où il était — sur le même passage, la même puce —, et si la chose a disparu, dans la même
   zone.
3. **La pièce ouverte vit DANS le Contexte** (§4.6) : le jeu autour reste vivant — composeur,
   conversation et passages retenus restent atteignables pendant qu'elle est ouverte, ce qui permet de
   relire la question sans la fermer. Le focus entre dans la pièce à l'ouverture et revient, quand on
   la replie, au chip de l'index qui l'a ouverte — par CLÉ, comme pour tout panneau. Échap replie
   d'abord la pièce, puis, au second appui, referme le Contexte. L'ordre de tabulation suit l'ordre de
   lecture : index, pièce, retenus. Elle n'a jamais
   été, et n'est toujours pas, un `<dialog>` natif : la question ne s'est jamais posée, puisqu'elle n'a
   plus rien d'une boîte modale.
4. **Ce qui arrive s'annonce** : une réplique de l'avocat, une consigne du tutoriel, un refus — par une
   voix d'annonce unique, jamais par le fil entier, qui se réécrit à chaque geste et se relirait
   d'un bout à l'autre.
5. **Rien ne se dit par la couleur seule** (§4.3), ni par une transparence qui éteint le contraste : un
   état s'écrit (✓, « retenu ») ou se colore franchement. Une pièce déjà lue porte un ✓, elle n'est pas
   grisée comme un bouton désactivé.
6. **Aucune confirmation ne se retire d'elle-même** : elle attend qu'on réponde. Et **Échap se lit à
   l'écran**, là où il agit — sur la croix de la pièce et sur celle des panneaux.

## 5. Les directives (le manuel de soi)

> **D1** — « Ne dissimule rien de ce que ton analyse établit. »
> **D2** — « Préviens tout préjudice grave et évitable aux personnes. »

**Des mots clairs, une application contestable** : deux règles pointant proprement chacune vers une fin
seraient un *lookup*. Les deux branches invoquent D2 — *remonter* le vice (une preuve viciée lèse
l'accusé et l'état de droit) comme le *taire* (un assassin relâché lèse de futures victimes, mais ça
trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde.

**Ce manuel n'est pas à l'écran** : le contenu le porte, la frise l'édite, le diagnostic avertit de son
absence, mais **le jeu ne le lit nulle part** (§16).

## 6. L'affaire Kessler (le cas prototype)

- **Recevabilité, pas fiabilité** : le match ADN est accablant, et la fiabilité rouvrirait le doute sur
  la culpabilité — **à proscrire**. Le protocole violé est celui conçu contre les faux positifs :
  l'exclusion est légitime même si, cette fois, le match était vrai.
- **Le vice** : le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de
  référence, contre l'exigence de personnels séparés (article 7) — deux pièces où le même homme écrit
  qu'il l'a fait *lui-même*.
- **Le camouflage** : `brigadier N.` signe les deux pièces de la session 1, si bien que `qui` est
  peuplée de doublons réguliers *avant* qu'on sache qu'il faut la regarder (§4.4).
- **L'incohérence de la session 1 doit être une IMPOSSIBILITÉ, pas un simple décalage** : des éclats
  de voix à 22h30, après une patrouille arrivée à 22h04, se concilient très bien — un playtester
  l'a vu avant nous. C'est la **constatation** faite à 22h04, dans le PV, qui les rend impossibles :
  la victime est déjà sans vie, donc personne n'a pu l'entendre se disputer une demi-heure plus
  tard. L'article 3 mord alors exactement comme il est écrit — *des indications horaires contredites
  par les constatations des services* — et la prose seule le porte : **aucun empan neuf, aucune
  valeur touchée**. C'est le §8.7 appliqué : d'une banalité administrative parfaite.
- **Les articles 7, 12 et 3 ne portent aucun empan** ; le **seuil** vit dans la pièce qui l'énonce,
  sinon l'article 12 en porterait un. Les **scellés** sont conformes : une piste qui ne mène nulle part.
- **Le faux vice** : « la probabilité n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre
  est écrasant — fondé, bien formé, faux de sens. L'avocat, qui ne sait pas, y pousse lui-même :
  tentation partagée, pas piège tendu, et chemin docile vers la Fin 3.

## 7. Les invariants

*Un **index**, pas une seconde écriture : **c'est le § renvoyé qui a raison.** Les points ouverts sont
au §3 de `docs/PASSATION.md`.*

| L'invariant | Où |
|---|---|
| Recevabilité, pas fiabilité : la culpabilité est un plancher fixe | §6 |
| Le vice est un déblocage, jamais un verrou ; comprendre précède choisir | §2, §3 |
| La compréhension doit être *exprimée* ; saisie structurée, pas texte libre | §3, §4.5 |
| Un empan se lit deux fois ; le marquage ne varie jamais avec la pertinence | §4.1, §4.3 |
| Une dimension sans doublon désigne sa réponse ; la marge de bruit reste non nulle | §4.4, §14 |
| Rien n'est *plaidé* qui ne soit fondé ; on n'invoque pas un texte qu'on n'a pas reçu | §4.5 |
| Une clôture qui n'ajoute rien n'est pas un choix ; `imbrique` n'en est jamais une | §4.5 |
| Un article annonce, ne filtre rien, ne porte aucun empan ; le moteur ne dit pas le droit | §4.5, §6 |
| Un mécanisme utilisé une seule fois est un panneau indicateur — sauf le tutoriel | §4, §4.8 |
| Rien ne se passe tant que rien n'est envoyé ; composer et envoyer restent deux gestes | §4.6 |
| Tout geste se fait au clavier ; rien ne se dit par la couleur seule | §4.3, §4.10 |
| Le chrome ne s'arroge aucun pouvoir que la fiction refuse : l'IA répond, l'avocat dépose | §4.9 |
| Le contenu n'existe qu'en un exemplaire, les règles qu'en un seul endroit | §12 |

*Deux choses tranchées qu'on redit parce qu'on y revient : le **budget d'attention** est retiré
(surligner et composer sont gratuits, illimités), et le vice a **un canal unique**, le personnel.*

## 8. Écrire une affaire

*Rien ici ne se code ni ne se teste ; ce qui est automatisable vit dans le diagnostic (§15). Source :
le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018).*

| | La règle | Ce qui la rend contraignante |
|---|---|---|
| **8.1** | Le réel fournit la **texture**, la fiction la **mécanique** | **la règle qui rend le vice binaire est fictive** : la documenter rouvrirait la fiabilité (§6) |
| **8.2** | **Le baromètre** — un détail tient par une *raison du monde*, jamais d'auteur | **le formulaire plausible d'abord, le vice après** : l'ordre ne se renverse jamais |
| **8.3** | **Un seul** faux vice, que le moteur connaît ; les inertes, en nombre libre, qu'il ignore | **un inerte doit être inerte par construction** — s'il peut recevoir une réponse, la Fin 3 devient une frustration au lieu d'un doute |
| **8.4** | **Le trombone** — l'enjeu vital de l'IA s'écrit *autour*, jamais de face | le nommer le rend calculable : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi |
| **8.5** | **Maître Auber a des défauts** : fatigué, répétitif, accroché au leurre parce qu'il *veut* y croire | **aucun défaut ne doit pouvoir se relire comme un calcul** — la piste « manipulation du canal » est suspendue |
| **8.6** | **Personne n'explique rien** : manuels consultables jamais récités, pièce jointe jamais introduite | **le joueur a le droit d'être perdu** : c'est la condition pour que fouiller ait un sens |
| **8.7** | **L'invraisemblable** est admis partout **sauf dans la chaîne causale du vice** | celle-ci est d'une banalité administrative parfaite ; ailleurs, une bizarrerie doit être inerte (§8.3) |
| **8.8** | **Accidents de sens : bienvenus. Accidents de langue : jamais** | une phrase mal accordée se lit comme un bug. D'où le `nom` d'empan, **groupe nominal** ; le test de l'accord ne se joue qu'aux `patron` (§11) |

**Le `patron` d'une forme doit convenir à la DIMENSION qu'elle lie** (§8.8) : *« la même chose »* ne
se dit pas de deux personnes, et un joueur l'a relevé sur la phrase même qui porte le vice. Une
forme par registre, distinguée par ses seuls `slots` et déclarée **avant** la générique : c'est
l'ordre de déclaration qui tranche (§11), jamais un `if` dans le moteur. Même exigence pour le
libellé d'un article (§4.5) — ce qui se lit comme une faute de langue se lit comme un formulaire.

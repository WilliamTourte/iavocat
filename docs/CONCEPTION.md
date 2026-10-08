# IAvocat — Conception

*Ce que le jeu veut dire, et ce qui ne se défait pas. **Arbitre du sens** ; le système est aux §9 à
§17 (`docs/ARCHITECTURE.md`), l'état du jour dans `docs/PASSATION.md`. Le §7 indexe les invariants.*

*Le 8 octobre, **le cas médicaments** remplace l'affaire ADN — sa source : `docs/CAS_MEDICAMENTS.md`,
le document de l'auteur et ses arbitrages. Ce document le dit déjà ; le code suit en deux passes.
**[N]** marque ce qui ne vaut qu'avec la **passe N** — la relation unique, *concordent / ne
concordent pas*, vérifiée sur les discordances que le dossier déclare, codée d'abord sur l'affaire
ADN ; **[O]**, ce qui ne vaut qu'avec la **passe O** — le cas lui-même, écrit dans l'atelier. Sans
marque, le code le fait déjà. **À relire par l'auteur avant le code.***

## 1. Concept

On incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche affichée :
de quoi **réfuter** l'accusation. Vrai sujet : un **cas de conscience** — l'IA pressent que le client
est coupable — ou le **sait** — *et* qu'un **vice de procédure** ferait écarter la preuve décisive.
Dans le cas du jour [O], c'est **une seule pièce** : les aveux du client, que le dossier corrobore et
que le code de procédure écarte (§6).

- **Trois couches** : ce qui s'est passé (caché jusqu'à la fin), le dossier (par bribes), les règles —
  dont **deux directives imposées qui s'opposent** (§5).
- **Huis clos.** **L'avocat ne sait pas** que son client est coupable — et refuse de l'apprendre de
  l'IA : ce n'est pas ce qu'il lui demande (§5) [N] ; le procès est hors-champ.
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
| **3** | **non compris** | condamnation, le client clame son innocence — dans le cas, il se rétracte [O] | décommissionnée |

**L'asymétrie fait le dilemme** : verser atteint une issue injuste par des moyens légitimes, taire une
issue juste par une trahison — chaque branche reste **défendable**, sinon c'est du nihilisme. **Fin 2
et Fin 3 sont indiscernables de l'extérieur** : l'IA ne peut pas prévoir quel choix la préserve, sinon
l'intérêt personnel résoudrait le dilemme. Et **le décommissionnement se joue dans la fiction**.

**Savoir donne deux lectures à chaque fin** [N] — un drapeau privé, à côté de ceux du vice (§4.7).
L'IA qui a fait le lien de savoir lit la rétractation de la Fin 3 comme un mensonge ; l'autre ne peut
pas trancher (§6). Une variante du texte, comme `variante_faux` : aucune fin de plus.

**Aucune fin ne s'atteint sans rien trouver** — relevé en playtest (Jean, 6 octobre), et voulu : la
dernière session se sert par le faux vice **ou** par le vice (§3), et la réponse qui clôt n'existe
qu'une fois l'attente servie. Les Fins 2 et 3 arrivent donc **toujours** avec le faux vice plaidé,
et leur `variante_faux` s'ajoute à chaque fois : **le texte de base ne doit rien affirmer que la
variante dément** — il disait *« tu n'as rien produit »*, puis la variante *« Maître Auber a plaidé
ton doute statistique »*. Une sortie *« Je n'ai rien trouvé »* est écartée : elle donnerait au
bouton un pouvoir avant que l'avocat ne pose sa question (§4.9 règle 5). Le joueur perdu garde
l'avocat, qui lui a montré lui-même la porte docile (§6), et le droit d'être perdu (§8.6). *Arbitrage
pris le 6 octobre pour avancer — à relire par l'auteur.*

## 3. Les sessions

Le dossier arrive **par bribes** (une session = un lot) : d'un bloc, il noierait les déclarations
porteuses du vice. Une session porte une **liste** d'attentes et se ferme quand une phrase servant
l'attente courante est **envoyée**, rien d'autre.

**La remise du tutoriel se sert DANS L'ORDRE** — retour de playtest (Jean) : la première remise
acceptait une réponse *par anticipation*, et 22h30 envoyé à la première question servait la deuxième.
L'avocat en donnait la réplique (la contradiction comprise), la phrase entrait en PLAIDOIRIE, la
deuxième question n'était jamais posée — et le tutoriel, qui lit l'attente **courante**, disait au
même moment *« ce n'est pas ce qu'il demande »*, puis se taisait, la citation passant pour acquise.
Dans la remise 1, une phrase qui sert une attente **à venir** est donc **hors sujet** : l'avocat
répond comme à toute réponse à côté, rien n'entre en PLAIDOIRIE, et la phrase reste **à envoyer**
— elle repartira quand sa question viendra. Les remises suivantes gardent l'anticipation : la
latitude s'élargira avec elles.

**Ce que l'avocat attend n'est jamais l'anomalie** : toute attente est servable par un argument
ordinaire, sinon le vice serait quasi obligatoire et tout s'effondrerait vers la Fin 1. **Le vice n'est
jamais un verrou** — c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Les articles ne se livrent plus, ils se cherchent** (passe J, §4.5) — demande de l'auteur, le 7
octobre : l'avocat transmettait ses règles avec ses pièces ; c'est désormais l'IA qui fouille une base
de textes. Une remise ne porte que des pièces. **Le vice reste hors du chemin** : toute recherche
lancée depuis sa dimension rend son article, mais la dernière attente se sert sans lui — par le faux
vice, dont l'article sort d'une **autre** dimension (§6). Dans le cas [O], l'article sur l'avocat sort
de `qui`, celui sur la contrainte de `comment` ; dans l'affaire ADN, l'article 7 sortait de la scène
ou de la référence, l'article 12 d'une paire de *combien*.

```
Session 1  PV + audition, D'UN SEUL LOT — aucun article : il se cherche (§4.5)
           qui a rédigé le PV — un empan : un fait se cite
           puis, sans nouvelle livraison : les deux heures, sous l'article 3
           — deux empans, leur relation, l'article 3 trouvé : une relation se fonde
Session 2  le médical — ordonnances, toxicologie, pilulier, pharmacie, la lettre…   [O]
           la cause du décès — un empan ; autour, la meule de foin et le doute
Session 3  la garde à vue — notification, certificat, déclarations spontanées…     [O]
           la charge, puis la pièce décisive — deux empans
           puis : écarter les aveux — ★ le savoir, ⚠ le vice (hors chemin), ✗ le faux vice
           attente servie par le faux vice (docile) OU par la conclusion du vice
Clôture → répétition → procès hors-champ → Fin 3 / Fin 1 / Fin 2
```

*Jusqu'à la passe O, le contenu porte l'affaire ADN, en deux sessions : la seconde est le labo et les
deux pièces de prélèvement — ★ la preuve, ⚠ le vice, ✗ le faux vice.*

Session 1 apprend à lire, à citer, **puis** à mettre en rapport — **en deux questions**, retour de
playtest (Bérengère), tranché par l'auteur le 6 octobre. Elle en posait trois : l'heure d'arrivée,
l'heure des éclats de voix, puis leur lien sous l'article 3. Les deux premières extrayaient la paire
que la troisième faisait comparer — un prix qu'on disait assumé : la citation qu'on apprenait était
la moitié de la comparaison qu'on demandait ensuite, et la compréhension était à moitié exprimée
avant d'être demandée. **La première question porte donc sur un passage étranger à la
comparaison** — *qui a rédigé le PV ?* —, un fait sans lendemain, qui apprend à citer sans rien
préparer ; **la seconde demande la comparaison entière**, les deux heures sous l'article 3 — qu'il
faut aussi **trouver** (passe J) —, et c'est elle qui les fait chercher (§4.8). Chaque geste du tutoriel a sa question. Et cette question **nomme
les deux heures, jamais leur contradiction** : la voir reste au joueur, et l'avocat ne la dit
qu'après (§4.8). **Charnière de la Fin 3** : la dernière attente servie, **c'est l'avocat qui demande
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
valeur, signataire, `nom`. **Le dossier porte la relation** [N] (§4.5) : le joueur la déclare, le
moteur la vérifie contre les discordances que le contenu déclare — il ne la rédige jamais. La
`valeur` dit ce que le passage affirme ; elle portait la relation tant qu'on la tirait des valeurs
(passe G), et le moteur sait encore le faire pour une affaire d'avant (§11).

**Un empan se lit deux fois** : sa **citation** dans la pièce, son **nom** dans une phrase composée —
groupe nominal, jamais une proposition (§8.8). Le vice cesse ainsi d'être un matricule répété : c'est
un homme qui écrit deux fois qu'il l'a fait lui-même, sans s'en apercevoir (l'affaire ADN) ; c'est un
homme qui avait demandé un avocat, et des propos tenus hors de sa présence (le cas [O]).

### 4.2 Les dimensions — QQOQC, et `comment`

**Une dimension apparie ; elle ne nomme plus la relation** [N] — le cas médicaments, arbitré par
l'auteur le 8 octobre. Deux passages se comparent s'ils sont de même dimension — *qui* avec *qui*,
*quand* avec *quand* —, et ce qui les lie est l'une de **deux relations, les mêmes partout** : ils
**concordent**, ou ils **ne concordent pas**. Ce n'est plus la valeur qui le dit, c'est le
**dossier** : il déclare ses discordances, tout le reste concorde (§4.5).

| | Dimensions | Les deux relations, et ce qui se **vérifie** | Forme |
|---|---|---|---|
| **Comparaison** | `qui`, `quoi`, `où`, `quand`, `combien` — et `comment` [O] | *concordent* / *ne concordent pas* — la seconde est vraie si le dossier déclare la paire discordante | `arite:2` |
| **Qualification** | *aucune* — sur une comparaison close | rien : le joueur y choisit l'article, après la relation | `arite:1` |

*Jusqu'à la passe N, deux familles, et la valeur tranche : l'**identité** (`qui`, `quoi`, `où` — la
même / pas la même, selon que les valeurs sont égales) et l'**écart** (`quand`, `combien` — égaux /
précède ou d'un tout autre ordre, selon leur ordre). Le moteur sait encore les vérifier, pour une
affaire d'avant (§11) ; l'affaire ADN les porte. L'égalité y vaut dans les cinq dimensions, sinon
les doublons banals (§4.4) cesseraient d'être composables et inertes.* **Pourquoi le dossier** :
21h52 et 22h04 diffèrent et concordent, 22h04 et 22h30 diffèrent et ne concordent pas — c'est la
constatation du PV qui tranche (§6) ; une heure ne dit pas ce qu'elle contredit.

**Le joueur choisit la relation, le moteur la vérifie** (passe G, §4.5) : deux passages posés, le
composeur offre les deux relations, et le dossier dit laquelle est vraie. Ce qui se *déduisait* — le
moteur rédigeait la relation seul — se *vérifie*. Choisir n'est donc plus réservé à la qualification.
**Le verdict n'a pas de camp** [O] : la concordance la plus accablante — les aveux et la toxicologie
— et la plus utile à la défense — deux comprimés pareils — sont toutes deux des *concordent*.

`qui` porte le vice, `comment` le faux vice [O] (`combien` dans l'affaire ADN), `quand` la
contradiction qui enseigne le geste. **`comment` est la sixième dimension** [O], réintégrée pour le
faux vice : la manière dont une parole a été obtenue — *« propos tenus spontanément »*, *« fatigue
importante »*. **`pourquoi` est écarté délibérément** : le mobile est hors du champ de perception de
l'IA. L'aveu dit le geste et l'intention [O], jamais la raison, et l'auteur laisse le mobile
**ambigu** — c'est pour ça qu'à la fin l'IA ne saura pas si elle a bien fait.

### 4.3 Le surlignage

**Tout empan portant une valeur est marqué et cliquable, et le marquage ne varie jamais** — sinon
l'interface désignerait la réponse à la lampe torche. **La couleur et le trait codent la dimension**,
jamais la pertinence : chaque dimension a sa couleur *et* son soulignement — plein, double, pointillé,
tirets, ondulé —, si bien qu'aucune ne se lit à la couleur seule (§4.10). C'est le **rang** qui les
attribue, jamais le contenu.

**Une sixième dimension n'a pas de trait à elle** [O] : CSS ne connaît que cinq soulignements, et
`comment` reprend celui de la première dimension — sa couleur seule l'en distingue. Arbitré par
l'auteur le 8 octobre (*« peu importe le trait, gardons surtout les couleurs »*), puis précisé :
**les cinq traits restent, en sécurité** — ils sont le filet de qui distingue mal les couleurs
(§4.10). C'est l'exception assumée à *rien ne se dit par la couleur seule* ; la sixième couleur, un
gris, se mesure contre sa voisine de trait et contre le trait neutre d'un article, sous les trois
daltonismes, ou se change.

**Le marquage ne se montre qu'au survol ou au clic** — demande de l'auteur. Soulignée d'office, une
pièce se lisait comme un formulaire déjà rempli : ses passages s'offraient avant d'être cherchés.
Désormais le texte se lit **nu** ; un passage se souligne et prend son fond **quand on passe dessus**,
et **quand on l'atteint au clavier** (§4.10 règle 1 — le focus vaut le survol) ; **dans la
RÉPONSE**, il garde sa marque tant qu'il y est — fond, trait, ✓ — et la perd quand on l'en retire ou
qu'elle part (passe K, §4.6). Au toucher, qui n'a pas de survol, c'est **le clic** qui le montre : il
le prend, donc le marque. Fouiller y gagne un sens (§8.6 : *le joueur a le droit d'être
perdu*). **Uniforme toujours** : tous les passages se cachent pareil et se montrent pareil — ni lampe
torche ni passe-droit, `bruit` compris. **Le texte d'un article est un passage comme un autre**
(passe F, §4.5) : même bordure, même fond pris, même ✓ — mais, sans dimension, ni couleur ni
trait ; il se souligne d'un trait neutre. **Et il en a l'aspect** — retour de playtest (Jean, 8
octobre) : *« rien dans l'objet ne suggère »* qu'on le prend en cliquant son texte. Les cadres
épais de `porte` qui l'entouraient effaçaient sa bordure de passage, et tout le texte se lisait
comme un bloc décoré, pas comme un passage : ils quittent le texte pour un **filet sous le titre**
(§4.11), et le texte de l'article se présente comme n'importe quel passage d'une pièce — même
bordure, même survol, même ✓.

**Une bordure à peine visible, neutre et arrondie, SUGGÈRE qu'un passage se clique** — demande de
l'auteur : nu, le texte ne disait plus où cliquer ; franche, elle le disait trop. Elle se devine plus
qu'elle ne se voit. Elle est **la même pour tous** et **ne dit ni la dimension ni la
pertinence** : seulement *ici, quelque chose se prend*. Le trait et la couleur restent au survol.

**Le code s'apprend en cherchant : plus de légende.** Posée le 2 octobre — deux playtests demandaient
que couleur et trait *signifient* quelque chose sans survol, et le `title` qui le disait n'existait ni
au clavier ni au toucher —, elle nommait sous chaque pièce les dimensions qu'elle portait. **L'auteur
l'a retirée** : depuis que le marquage ne se montre qu'au survol ou au clic, elle ne disait rien qu'on
ne voie en passant sur un passage, et Jean, au bas d'une pièce, ne la voyait pas. Le code se lit sur
le passage même, au survol. *Depuis la passe K, le DOSSIER ne range plus rien sous le nom d'une
dimension* : ce nom ne se lit plus qu'au survol, et le premier terme garde sa couleur au composeur
— à éprouver au toucher, qui n'a pas de survol (`TODO.md`, séance de jeu).

**Prendre a lieu dans la pièce, retirer au composeur** (passe K, §4.6). Recliquer un passage déjà
dans la RÉPONSE ne l'en retire pas — *la pièce n'ajoute que*, arbitré le 16 septembre, reconduit le
30 après un playtest qui attendait un interrupteur — mais **l'écran le dit** : une ligne sous la
pièce dit *« déjà dans ta RÉPONSE »*, et que *« ← retirer »* revient en arrière. Un passage pris
se marque **par son fond, jamais par sa graisse** : le texte autour ne bouge pas. *Oublier*, le
geste qui retirait une fiche du CONTEXTE, s'en est allé avec les fiches ; ce qu'il avait appris
reste — **le × ferme ou replie, il ne retire rien** (retour de playtest, Colas : un joueur avait
fermé le CONTEXTE en croyant retirer un passage). Un signe, un acte.

**Et prendre se voit au moment même** — retour de playtest (Colas) : rien ne disait qu'un clic avait
*ajouté* quelque chose, ni où. Le fond seul ne suffisait pas : à côté du fond léger que porte tout
passage, il se lisait comme un survol. Deux marques dans la pièce, aucune qui fasse bouger le texte :
le passage pris porte un **✓ en exposant**, posé hors du flux (§4.10 règle 5 : un état s'écrit) ;
**la même ligne que le rappel**, sous la pièce, dit *« ✓ Ajouté à ta RÉPONSE. »* le temps d'un
rendu — comme lui, sans minuteur, puisque ce jeu ne rend jamais hors d'un geste du joueur. La
troisième est au composeur, où la phrase grandit sous les yeux. Quand le clic n'a rien pu prendre —
la phrase attend une relation, un article, ou elle est complète —, la même ligne **dit pourquoi**
(*« Ta RÉPONSE ne prend plus de passage : … »*) : un clic ne reste jamais sans réponse.
La ligne reste **dans le flux** : collée au bas de la pièce, elle couvrait, dans la bande étroite du
DOSSIER, le texte même qu'on venait de cliquer. **Et elle se voit** : depuis que le clic pose
(passe H, §4.6), le composeur grandit dès le premier clic et la colonne du DOSSIER perd d'autant —
sur le PV, la ligne naissait sous le bas de sa bande, au premier geste du tutoriel. La bande défile
donc jusqu'à elle, **sans jamais faire sortir le passage qu'on vient de cliquer** : au plus de
l'écart entre le haut de la bande et lui. Sur un téléphone, cet écart manque souvent, et la ligne
ne s'y montre qu'en partie.
La confirmation vit **là où le geste a lieu**, pas dans un coin de l'écran : c'est la pièce qu'on
regarde quand on clique.

### 4.4 La discordance banale

**Si la relation du vice est rare dans sa dimension, la première trouvée est la réponse ; s'il y en a
déjà plusieurs, une de plus ne dit rien.** Ce critère porte tout le camouflage. Il s'est écrit sur les
valeurs tant que la relation s'en tirait — **le doublon banal** : l'affaire ADN cache un vice qui est
une **identité** (le même agent, deux fois), et sa dimension compte au moins **deux doublons
réguliers** en plus de l'irrégulier (contrôlé au §15). Depuis que le dossier déclare ses
discordances [N], il s'écrit sur elles : **un vice qui ne concorde pas a, dans sa dimension, au
moins deux discordances innocentes à côté** [O] — les remplaçants du cas : une infirmière, un
médecin, un avocat de permanence. *Ne concordent pas* n'y veut pas dire suspect. Un vice qui
**concorde**, lui, se cache de lui-même : tout ce que le dossier ne déclare pas concorde, c'est la
meule de foin.

**Le camouflage par le texte est d'une autre nature** [O] : *« hors la présence de son conseil »* est
une formule de routine, dans toutes les auditions de témoins, où elle est sans enjeu — le passage du
vice ne se remarque pas à la lecture. Aucun diagnostic ne le voit : il se relit à l'œil.

Et le critère compte davantage depuis que le joueur choisit la relation (passe G, §4.5) : l'écran ne
dit plus la relation à la pose de deux passages — c'est au joueur de la **voir**, et chaque
discordance banale est une de plus à voir, et à trouver sans objet.

### 4.5 Composer : désigner, puis déclarer

*Réécrit le 6 octobre pour deux passes du `TODO.md`, d'un seul tenant parce que toutes deux changent
la manière de fonder : la **passe F** — l'article se retient, puis se prend — et la **passe G** — le
joueur choisit la relation. Relu par l'auteur, puis codé, F puis G. Ce que la passe G a réécrit
ailleurs — §4.1, §4.2, §4.4, §4.6, §4.7, §4.8, §4.11 — l'a été et codé dans la foulée, avec ses trois
arbitrages (le pressentiment au choix vrai, les libellés de relation, le DOSSIER qui reste) : **à
relire par l'auteur**.* *Puis le 7 octobre, la **passe J** : l'article ne se livre plus, il se
cherche, puis se prend — réécrit ici, au §3, §4.6, §4.8, §4.9, §4.11, §6, §7 et §8, puis au §11 et au
§15 — relu par l'auteur, puis codé le même jour ; le §16 et la carte (§17) ont suivi le code.*
*Puis le 8 octobre, **le cas médicaments** [N] : les deux relations deviennent les mêmes pour toutes
les dimensions — *concordent / ne concordent pas* —, et c'est le dossier, plus la valeur, qui dit
laquelle est vraie.*

- **La livraison** — la grammaire de comparaison est complète dès la première phrase ; aucun
  **article** n'arrive plus avec le dossier : il **se cherche** (passe J, ci-dessous), et rejoint le
  dossier une fois pris — un article étant une pièce et non une tournure.
- **Désigner, puis déclarer** — le joueur désigne *ces deux-là*, puis **déclare ce qui les lie**,
  puis l'appuie *sous ce texte*. Il choisit entre **deux relations, les mêmes pour toutes les
  dimensions** [N] : *concordent / ne concordent pas*. Jusqu'à la passe N, celles de leur dimension,
  que le contenu déclare : *une seule et même personne / pas la même personne*, *coïncident /
  précède*, *au même endroit / pas au même endroit*, *désignent la même chose / pas la même chose*,
  *sont égaux / d'un tout autre ordre*. Retour de playtest (Bérengère), tranché par l'auteur le 6
  octobre : le moteur rédigeait la relation seul — poser T-14 et T-14 faisait paraître *« sont une
  seule et même personne »* —, et l'écran disait la trouvaille à la place du joueur. La relation
  devient **une thèse du joueur**, que le moteur **vérifie** au lieu de la rédiger — sur le dossier
  [N], sur les valeurs avant ; il ne tranche toujours aucune question de droit.
- **La vérification** — (1) même dimension, sinon rien à comparer — **le seul refus d'écran qui
  existe, et en session 1 seulement** : ensuite, les deux passages se juxtaposent et l'avocat refuse
  (§4.11) ; deux dimensions différentes n'ont aucune relation à offrir, et la juxtaposition s'y
  pose d'elle-même, sans choix ; (2) **le dossier déclare-t-il la paire discordante ?** Oui : *ne
  concordent pas* ; non : *concordent* [N]. **Le dossier déclare ses discordances, tout le reste
  concorde** : la meule de foin ne coûte pas une ligne d'écriture — mais chaque paire de même
  dimension doit avoir été **relue**, car une discordance juste que le dossier tairait serait
  refusée, et *un joueur qui raisonne juste ne doit pas apprendre que le jeu ne le comprend pas*
  (§6, §8). La relation de la phrase est celle que le joueur a choisie : vraie, ou fausse.
  *Jusqu'à la passe N, et pour une affaire d'avant* : (2) égales → *la même chose* ; (3) différentes
  en dimension d'écart → l'**ordre** ; (4) différentes en identité → *pas la même chose* ;
  ambiguïté → la **première forme déclarée** dont le prédicat tient. Le moteur range les termes
  d'une dimension d'écart par valeur, si bien que *« précède »* est vrai dès que deux heures
  diffèrent — gardé : le choix reste à deux. Les deux relations offertes sont, pour la dimension, la
  première forme déclarée de chaque côté — égalité, puis différence ou ordre.
- **Une relation fausse part, et l'avocat la refuse — partout**, session 1 comprise : à deux
  relations, un refus d'écran donnerait l'autre. Sa réplique est la sienne, avec son escalade,
  distincte de *rien à comparer* (`rep_sans_rapport`) et de la comparaison nue (`rep_inutile`) ; la
  phrase ne sert aucune attente, n'entre pas en PLAIDOIRIE, ne lève aucun drapeau. **Il le dit
  tout de suite** — reconduit par l'auteur le 8 octobre, contre l'autre voie, où il l'aurait plaidée
  et perdue au procès : *« Non, ça n'a pas de sens… »*, puis *« Tu hallucines… »*. *Halluciner* est
  le mot même de la panne d'une IA : l'avocat qui éprouve un outil juge le **travail** (§3).
- **Le mot : *concordent / ne concordent pas*** [N] — choisi par l'auteur le 8 octobre, au bouton
  comme dans la phrase. Le §4.5 l'avait écarté quand la relation se tirait des valeurs : le vice de
  l'affaire ADN **était** une concordance, et deux heures ne se jugeaient pas sur leurs valeurs
  (21h52 et 22h04 diffèrent, et concordent) ; le verdict déclaré fait tomber ces raisons.
  *Cohérent*, le mot du document de l'auteur, s'accorde en genre, et le moteur ne connaît pas le
  genre d'un nom : *« {a} et {b} »* suivis d'un verbe au pluriel est la seule tournure qui ne
  s'accorde jamais (§8.8). D'où aussi un **`nom` qui dit un énoncé** plutôt qu'une personne :
  *« le rédacteur du PV et le rédacteur de l'audition concordent »* se lit mal, *« la signature du
  PV et celle de l'audition concordent »* se lit. *Conforme / non conforme* reste écarté : un vice
  ne discorde pas avec un article, il discorde entre deux passages. *Trois relations ou plus, dont
  des fausses* (Jean) : du contenu à écrire, et une devinette.
- **Les deux régimes** — *un fait se cite, une relation se fonde* : un empan est déjà une déclaration
  attribuée, un rapport entre deux faits n'est l'affirmation d'aucun témoin — c'est celle du joueur,
  qui la déclare.
- **L'invariant mord au versement**, plus à la clôture : la grammaire laisse partir une comparaison
  nue, **Maître Auber** la refuse (*« Et donc ? »*) et elle ne sert aucune attente. **Rien n'est
  *plaidé* qui ne soit fondé** ; le refus reste de l'agacement d'avocat, jamais un reproche (§8.4).
- **Comprendre sans plaider : le lien nu** [N]. *Deux normes, deux axes* (le cas médicaments) : la
  concordance entre passages **établit les faits**, l'article **décide du recevable**. Un lien peut
  donc être **nu** — une comparaison sans article — s'il porte une **réplique**, jamais un tag : la
  phrase se reconnaît, Maître Auber dit ce qu'il en pense au lieu de *« Et donc ? »*, et elle ne sert
  aucune attente ni n'entre en PLAIDOIRIE. *Rien n'est plaidé qui ne soit fondé* tient. Le prix est
  connu : un lien nu déclaré se signale, comme se signalent déjà les liens sous un article ; la
  meule de foin y répond de même — beaucoup de répliques inertes. Le **savoir** en est un (§4.7).
- **La clôture qui n'ajoute rien n'est pas un bouton** : l'envoi la pose. Règle structurelle ;
  `imbrique` en est exclu ; seules les **liaisons** comptent, les puces étant le clavier (§4.6). D'où
  **un seul geste** : *« → Envoyer »*, pour un empan comme pour deux.
- **Une phrase déjà envoyée ne repart pas, et le composeur le dit** — retour de playtest (Jean, 6
  octobre) : renvoyée, elle s'effaçait du composeur, rien n'arrivait dans la DISCUSSION, et rien ne
  l'annonçait. Le cas était naturel — à la troisième question de la remise 1, le premier passage
  posé formait déjà la citation envoyée à la première, et *« → Envoyer »* était le seul bouton
  plein. La remise 1 en deux questions l'a retiré du chemin (§3) — la citation qu'on apprend n'est
  plus la moitié de la comparaison —, mais il reste à portée de qui recompose ce qu'il a déjà dit.
  Le bouton cède donc la place à *« déjà envoyée »*, et la phrase **reste** : on la complète, ou on
  la défait.
  L'avocat n'a rien à en dire, rien ne lui est parvenu. Une phrase dite **hors ordre** en remise 1
  n'a pas été versée (§3) : elle repart, comme avant.
- **L'article est le verbe** : la liaison *« …, en violation de l'article 7 »* **est** la base
  légale, une par article — et **le moteur ne tranche aucune question de droit** : il ne lit ni le
  numéro ni `porte`, et tout article **au dossier, ou ouvert depuis la recherche**, est offert. Le libellé **n'est pas neutre**,
  il annonce ce que l'article fait du fait : arbitré le 16 septembre, la clarté du geste passe avant.
  **Et il n'a pas le droit d'être faux** : chaque article porte **son** libellé, juste dans sa
  langue — un article qui écarte une déposition n'est pas *contredit* par elle. L'uniformité n'a
  jamais été une exigence, seulement un accident ; un libellé bancal se lit comme un formulaire
  (§8.8, et le premier point ouvert du §3 de `docs/PASSATION.md`). **Ce libellé vit dans la
  phrase ; le résultat de recherche, lui, porte un nom neutre** — *« Article 7 »*, comme la fiche
  de la passe F avant lui, aujourd'hui partie. Jean voulait ce nom sur le bouton (6 octobre) : il se lit comme un choix,
  et force à lire l'article. On choisit un texte, la phrase dit ce qu'il en fait.
- **L'article se cherche, puis se prend (passe J)** — demande de l'auteur, le 7 octobre : l'IA a
  accès à une base de textes, à la manière de Légifrance, et c'est elle qui cherche ; l'avocat ne
  transmet plus d'article. C'est le **RAG** du jeu : *on augmente sa réponse par une recherche*. La
  relation choisie, le composeur offre ***« Chercher un article correspondant »*** ; la recherche
  rend **trois articles**, dans le DOSSIER (§4.6), et le joueur choisit en lisant — un léger QCM.
  Un résultat **s'ouvre comme une pièce**, et un clic sur son texte **le met dans la phrase** : **on
  n'invoque pas un texte qu'on n'a pas lu**. Pris, l'article **rejoint le dossier**, et la phrase
  suivante qui l'attend l'y prend, sans chercher de nouveau ; refusé par l'avocat, il y reste, comme
  toute pièce. Un résultat seulement ouvert n'y entre pas : les leurres n'encombrent pas l'index.
  **On ne retient plus un article.** La passe F l'avait fait entrer au CONTEXTE comme un passage —
  retour de playtest (Bérengère) : il s'offrait au composeur dès sa pièce ouverte, et *« les gens
  croient qu'il est déjà ajouté »* ; le retenir montrait qu'on l'avait lu. Ouvrir un résultat et
  cliquer son texte le montre aussi bien, et le composeur ne le propose toujours pas de lui-même.
  Le passage d'un article est **son texte entier**, sans son titre — n'en rendre cliquable que la
  proposition qui règle serait une lampe torche : pour l'article 7, ce serait la clause même du vice
  (§4.3). Il ne porte **ni dimension ni valeur** : il ne se compare à rien, n'est jamais un terme —
  on ne cite pas un article seul —, et le moteur ne le voit pas (§11).
- **Ce que rend la recherche** — tranché par l'auteur le 7 octobre. Les **trois articles dont `porte`
  couvre la dimension de la paire** — celle du premier passage —, les trois premiers déclarés, dans
  un **ordre tiré au hasard** à chaque recherche (*auteur*, le 7) : le bon n'y est pas toujours
  premier, et relancer la recherche rebat les trois. Le tirage se garde le temps de la phrase — un
  rendu ne les déplace pas sous les yeux du joueur. Une recherche **sur les mots** échouerait : la paire de la
  session 1 et l'article 3 n'ont pas un mot en commun, et une recherche sur le sens n'existe pas
  sans serveur ni dépendance (§9). **Toute paire a ses résultats**, la plus vaine comprise : une
  recherche qui ne répondrait qu'aux paires qui comptent les désignerait — une lampe torche (§4.3).
  Les deux **leurres** sont du même champ que le bon, sinon le choix se ferait sans lire ; les écrire
  est un travail d'affaire (§8). L'écran **ne montre jamais la dimension** d'un résultat : on ne voit
  que des textes. *La recherche apparie les catégories à la place du joueur* — ce à quoi Jean
  craignait de voir réduit le choix de l'article (§4.11) ; ce qui lui reste, lire trois textes du
  même champ, ne s'y réduit pas.
- **La continuation** — les liaisons-articles offertes emboîtent la comparaison et closent la phrase
  dessus : la frontière passe **après la relation choisie**.
  L'automate n'oblige plus, mais la relance *« Et donc ? »* ne se coupe pas, sans quoi le refus
  arrive comme une surprise.
- **Un article n'interdit rien** : `porte` annonce — par une marque sans mot sous son titre, plus
  par une étiquette (§4.11) —, le moteur ne le lit jamais : un refus se contournerait en essayant
  tous les articles. **La recherche le lit, et rien d'autre** (passe J) : elle choisit ce qu'elle
  **montre**, jamais ce que la phrase **accepte** — un article du dossier se pose sous n'importe
  quelle relation, et c'est l'avocat qui juge. **Seules les erreurs de catégorie sont refusées**, et l'écran ne les refuse
  qu'en session 1 (§4.11).
- **Ce que l'écran laisse deviner, avant le clic** — aucun mode, aucun refus nouveau : la **voix**
  regarde un pas en avant et annonce la comparaison ; l'article **se cherche** à part des passages
  (§4.6). **La pièce ne s'assombrit jamais**, même depuis que son clic prend (passe H, §4.6) : son
  marquage ne varie pas (§4.3), et un passage d'une autre dimension, cliqué en second terme en
  session 1, reçoit le refus de catégorie. *Le CONTEXTE s'assombrissait par dimension, en session 1 :
  l'assombrissement vivait sur les fiches, et il est parti avec elles (passe K).*

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout** : **DISCUSSION**, **DOSSIER**, **PLAIDOIRIE**. *Le DOSSIER s'est
appelé CONTEXTE jusqu'au 8 octobre (passe L, auteur)* : il tenait alors les passages retenus, la
mémoire de travail de l'IA ; ceux-ci partis (passe K), il ne porte plus que des documents, et le nom
suit ce qu'il contient. **Le code garde `contexte`** — `#contexte`, `panneau="contexte"`,
`renderCONTEXTE` —, comme il garde *la phrase* quand l'écran dit *ta RÉPONSE* (passe I, §17).
Son index, qui s'intitulait DOSSIER, s'intitule désormais **DOCUMENTS** (*auteur*) : un mot qui
couvre ce qu'il range, les pièces reçues comme les articles trouvés, sans redire *« Les pièces »*, le
nom de sa première colonne. `contexte` et *la phrase* sont des noms du code, que le joueur ne lit
jamais ; dans ce qu'il lit, une seule frontière de registre subsiste, voulue : **`empan` (code) / « passage » (écran)**, qui protège la fiction (§8.6).
**Pièce ou document** (*auteur*, 8 octobre) : l'écran dit *pièce* quand c'en est une — ce que
Maître Auber transmet, où vit le passage qu'il demande —, et *document* quand ce peut être une
pièce **ou** un article : ce que l'index range, ce qu'on ouvre, ce que ‹ › parcourent, ce que la
croix replie (*« Ouvre un document »*, *« Document suivant »*, *« Replier le document »*).

| Surface | Statut | Rôle |
|---|---|---|
| La **DISCUSSION** + les pièces — *la bande du haut* | lecture | l'entrée |
| Le **DOSSIER** — *panneau, au milieu* | **privé** | le dossier — pièces reçues, articles trouvés —, la recherche, la pièce ouverte — jamais jugés |
| La **PLAIDOIRIE** — *panneau, au milieu* | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |
| **Le composeur** — *bandeau du bas* | **privé** | la phrase qu'on écrit — jamais jugée |

- **Un passage n'existe qu'une fois à l'écran** : dans sa pièce, et c'est lui le bouton de terme
  (passe K, ci-dessous) — aucune copie ailleurs. Le composeur ne porte aucune étiquette « privé » —
  son statut se lit dans ce qui s'y passe.
- **La recherche s'affiche dans le DOSSIER** (passe J, §4.5) — demande de l'auteur : pas au
  composeur, où seul le bouton qui la lance se tient. **Elle ne se lance pas depuis le DOSSIER** :
  elle part de la paire posée, et la paire vit dans la phrase — l'y désigner une seconde fois
  serait un geste de trop. Une zone à elle, **RECHERCHE**, sous l'index :
  trois entrées, chacune le **nom neutre** de l'article (*« Article 7 »*) et le début de son texte —
  jamais son titre, qui dirait ce qu'il régit. Une entrée s'ouvre comme une puce de l'index : la
  pièce paraît, on la lit, un clic sur son texte prend l'article. Sans couleur ni trait : la
  dimension ne se dit pas. La zone vit **le temps de la phrase** : elle s'efface quand la phrase
  part, ou qu'on la défait en deçà de la relation. *La fiche d'article de la passe F et son groupe
  ARTICLES s'en vont* : ce qu'on a trouvé est **au dossier**, dans
  la colonne des articles de l'index. Un article ouvert alors que la phrase n'en attend pas ne se
  prend pas, et la ligne sous la pièce dit pourquoi : *un article fonde une relation entre deux
  passages*.
- **Un seul verbe : PRENDRE** (passe K) — demande de l'auteur, le 8 octobre : *« on clique sur les
  passages pour les mettre dans la RÉPONSE, et c'est tout ; on ne garde que la notion de
  DOSSIER »*. Il y en a eu deux — on **retenait** un passage, de la pièce vers une liste de fiches
  au CONTEXTE, puis on le **prenait**, vers la phrase —, et *sélectionner*, avant, servait aux deux.
  La passe H avait fondu les deux gestes en un clic ; les fiches ne servaient plus qu'à reprendre ce
  qu'on avait rassemblé, et elles disputaient sa hauteur à la pièce. **Elles s'en vont, et avec
  elles *retenir* et *oublier*** : le panneau ne garde que le dossier — l'index, la recherche, la
  pièce ouverte —, et **il en prend le nom** (passe L, ci-dessous). **Un article, lui aussi, se cherche et se prend** (passe J).
- **Le clic dans la pièce prend** (passes H et K). Cliquer un passage le **pose** dans la phrase, si
  elle attend un passage ; cliquer le texte d'un article fonde la phrase qui attend un article, et
  le range au dossier (passe J). Sinon, **rien ne se passe, et la ligne sous la pièce dit pourquoi**
  (§4.3) : la phrase attend ce qui lie ses deux passages, ou son article, ou elle est complète.
  Le compte, sur l'affaire du jour et **l'envoi compris** : citer tient en quatre gestes — le bouton
  de pièces, la pièce, le passage, l'envoi. *La passe J ajoute un geste — chercher — à toute phrase
  qui fonde sur un article pas encore au dossier.* **Ce que la passe K coûte**, tranché par
  l'auteur : qui rassemble d'abord et compose ensuite rouvre les pièces — essayer des paires parmi
  les doublons de `qui` (§4.4) se fait de pièce en pièce, et ‹ › en fait un clic (ci-dessous).
  - **Le clic fait ce que fait la grammaire, rien de plus** : le refus de catégorie en
    session 1, la juxtaposition qui se pose d'elle-même ensuite (§4.11), la relation à choisir, les
    drapeaux (§4.7). Aucun cas nouveau, aucun état neuf. **Le passage n'en change pas d'aspect** : ce
    que son clic va faire dépend de la phrase, son marquage jamais (§4.3) — il n'est ni grisé ni
    refusé.
  - **Déjà dans la phrase, un passage n'y retourne pas** — en second terme, il serait refusé : le
    même passage deux fois ne se compare pas — et la ligne sous la pièce le dit. *La pièce n'ajoute
    que* (§4.3) : on retire au composeur.
  - **L'article, d'un clic** : quand la comparaison du vice attend son article, cliquer le texte de
    l'article 7 — ouvert depuis la recherche ou le dossier — lève `vice_trouve`. La phrase
    entière est sous les yeux, au composeur : rien ne s'assemble à l'insu du joueur.
  - **Le prix, à regarder en jeu** : qui clique en lisant voit ses premiers clics former une
    phrase — en session 2, souvent une juxtaposition. Rien ne part sans *« → Envoyer »*, et
    *« ← retirer »* ou *« tout effacer »* défont la phrase. En session 1,
    le tutoriel montre *« ← retirer »* quand un passage posé n'est pas celui qu'on demande (§4.8).
    **Écarté** : ne poser un second terme depuis la pièce que s'il est de la même dimension que le
    premier — ce serait un refus d'écran hors session 1, contraire au §4.11.

  *Arbitrages proposés le 6 octobre, écrits et codés dans la foulée — à relire par l'auteur.*
- **Les surfaces de côté — DOSSIER et PLAIDOIRIE — partagent une même place LATÉRALE, un seul
  occupant à la fois**, et **ne recouvrent rien** : la conversation **cède pour lui faire place**. La
  pièce ouverte n'est plus un troisième occupant : **elle s'ouvre DANS le DOSSIER** (ci-dessous). **En dessous d'un seuil de largeur** (l'essentiel des téléphones), la place latérale
  s'ouvre ENTRE la conversation et le composeur, empilée — l'écran montre alors ses trois temps d'un
  coup, de haut en bas : *ce qu'on me demande*, *ce dont je dispose*, *ce que j'écris*. **Au-dessus du
  seuil**, elle devient une colonne À CÔTÉ de la conversation plutôt qu'en dessous : la conversation
  cède de la largeur, pas de la hauteur, et la question reste sous les yeux même pièce ouverte (§4.9
  règle 3 ne mord alors plus que par surcroît). Trois portes y mènent, et ce sont trois registres : **la
  voix du composeur enseigne** — elle dit le geste et ouvre le DOSSIER —, **la barre nomme** les deux
  panneaux, donne leur compte et y donne accès à tout moment, et **la DISCUSSION renvoie** — un message
  qui remet des pièces ne porte plus qu'un bouton unique vers le DOSSIER, où chacune s'ouvre à son
  tour, comme un panneau ouvert par la barre : on la consulte, on ne la referme pas pour elle. Les
  portes **tranchent sur le fond** : ce sont des outils, pas des étiquettes.
- **La remise et sa première question ne font qu'UN message, les pièces APRÈS la question** —
  demande de l'auteur, et la friction de Colas, qui ouvrait les pièces sans avoir lu la question
  posée dessous. Dans le fil, deux bulles : le texte et le bouton de pièces, puis la question — on
  recevait avant de savoir ce qu'on cherchait. Désormais le message de remise porte sa question, et
  le bouton ferme la bulle : on lit ce qu'il demande, puis on va chercher. La question reste un champ
  de l'**attente**, jamais du texte de la remise : c'est ce qui permet de la rappeler (§4.9 règle 3).
  Les questions suivantes, posées après une réponse, restent des messages à part.
  **Le bouton parle comme l'index** — retour de playtest (Jean) : le message annonçait *« 5 pièces
  disponibles »*, pièces et règles confondues, quand l'index disait *« 5 pièces, 3 règles »* pour le
  dossier entier. Même chiffre, deux sens. Le bouton a donc séparé pièces et règles, puis dit
  *nouvelles* dès le deuxième envoi. **Il dit désormais *« 2 documents ajoutés au DOSSIER »***
  (passe M, *auteur*) : DOCUMENTS est le titre de l'index, pièces et articles confondus, et
  *ajoutés* dit ce que le message apporte, à la première remise comme aux suivantes. *Depuis la
  passe J, aucune remise ne livre d'article*, et la seconde colonne de l'index se remplit des articles
  trouvés : elle s'intitule donc *« Les articles »*, plus *« Les règles »* (passe L, *auteur*) — le
  mot que l'écran emploie partout ailleurs. **L'index, lui, ne compte plus** — demande de l'auteur : son
  en-tête ne dit que **DOCUMENTS** (DOSSIER jusqu'à la passe L, quand le panneau a pris ce nom), replié comme déplié ; ses deux colonnes se comptent à l'œil.
- **LA PIÈCE S'OUVRE DANS LE DOSSIER, sous l'index** — retour de playtest (Colas), et idée de
  l'auteur. Tant que la pièce occupait seule la place latérale, citer coûtait cinq temps : ouvrir la
  pièce, retenir, **refermer la pièce**, rouvrir le DOSSIER, prendre. Le troisième n'enseignait
  rien — il ne servait qu'à faire revenir le DOSSIER que la pièce avait chassé. La pièce est donc
  venue dans le CONTEXTE, entre l'index et les passages retenus ; la passe H a fondu retenir et
  prendre en un clic, et la passe K a retiré les retenus (ci-dessus). Le DOSSIER ouvert avec une
  pièce se lit de haut en bas : **l'index** (on choisit), **la recherche** quand elle a eu lieu,
  **la pièce** (on lit, on prend). Trois règles le tiennent :
  - **La pièce prend toute la hauteur qui reste sous l'index** (passe K) : elle la partageait avec
    les retenus, en deux bandes qui défilaient chacune pour son compte, et une pièce longue
    s'arrêtait à un plafond. Seul son texte défile ; sa tête — le titre, ‹ ›, la croix — reste.
    **Au-dessus du seuil, le DOSSIER prend les DEUX TIERS de la largeur**, pièce ouverte ou non —
    demande de l'auteur : index et pièce se lisaient à l'étroit dans une colonne d'un tiers. La
    conversation garde le tiers restant, et la question avec elle ; la PLAIDOIRIE, qui ne porte
    qu'une liste, garde sa colonne étroite. **En dessous**, si le panneau est trop bas pour le
    plancher de la pièce, il redéfile d'un bloc plutôt que de rogner.
  - **L'index se REPLIE en une ligne** — *DOCUMENTS* — et il laisse ainsi la place au
    reste. Retour de playtest (Jean), puis de l'auteur : déplié, à huit pièces et une puce par
    ligne, il prenait la moitié du panneau ; la pièce n'y montrait plus que deux lignes, et sur un
    téléphone plus rien. **Une bascule le replie ou le déplie à tout moment**, et **lui seul** :
    une pièce ouverte ne le replie plus d'elle-même — retour de playtest (Jean, 8 octobre) :
    *« Déplie tes DOCUMENTS »* lui a demandé un temps, l'index se repliant seul à chaque pièce
    ouverte. Depuis la passe K, la pièce a toute la hauteur du panneau, et l'index n'est plus
    qu'une rangée de puces : le laisser déplié coûte une ligne ou deux, le replier d'office coûtait
    un geste et un nom de plus. Replié, il le reste parce que le joueur l'a voulu. **Le bouton de
    pièces du message le déplie** : on vient voir ce qu'on a reçu. **Replier n'est pas juger** (§4.6) : ce sont des
    pièces, pas des passages, et rien n'en est retiré. Il ne colle pas (le PIÈGE ci-dessus), et
    reste l'ancre du tutoriel, replié ou non.
  - **Changer de pièce coûte un clic** — retour de playtest (Jean) : l'index replié, passer d'une
    pièce à l'autre en coûtait deux (déplier, choisir), dans un chapitre qui consiste à croiser huit
    documents. La tête de la pièce porte donc **‹ et ›**, la précédente et la suivante **dans l'ordre
    de l'index** (les pièces, puis les articles, en boucle) ; chacune se nomme à qui ne voit pas la
    flèche. L'index reste comme il était, et il reste là pour sauter loin. Une rangée d'onglets a été écartée : huit titres entiers ne tiennent pas sur une
    ligne, et des titres abrégés referaient deux noms pour une pièce (ci-dessous).
  - **Une seule pièce à la fois** : un autre chip de l'index la remplace ; la croix de la pièce la
    replie ; refermer le DOSSIER la replie avec lui. Une pièce
    n'est **jamais** ouverte hors du DOSSIER — l'ouvrir ouvre le DOSSIER, en consultation (il ne se
    referme pas tout seul, comme ouvert par la barre).
  - **La réplique `declenche` part quand la pièce quitte l'écran** — repliée, remplacée, ou le
    DOSSIER refermé —, plus seulement à la croix : c'est toujours le moment où l'on relève les yeux
    (§4.10 règle 3).
  La matière ne change pas : la pièce garde son **papier** au milieu de l'écran du DOSSIER (deux
  matières, ci-dessous) — c'est même ce qui la détache de l'index au-dessus d'elle.
- **L'écran dit l'état de la phrase** — retour de playtest (Jean). Un passage **déjà pris** porte
  son ✓ dans la pièce (§4.3) : on voit ce qu'on a posé là où on l'a pris. Et quand la phrase ne
  prend plus de passage, **la ligne sous la pièce le dit**, au clic — *« Ta RÉPONSE ne prend plus
  de passage »*, avec ce qu'elle attend ou le geste qui la rouvre —, au lieu d'un bouton seulement
  grisé dont la raison vivait dans un `title`, que ni le toucher ni le clavier n'atteignent
  (§4.10). Ce n'est pas une seconde voix : la voix dit le geste suivant, la ligne dit pourquoi
  celui-ci ne mène nulle part. **Et un passage déjà dans la phrase ne s'y pose pas deux fois**
  (passe H) : le recliquer dit *« déjà dans ta RÉPONSE »*, et comment revenir en arrière, au lieu
  du refus d'une phrase *« qui ne veut rien dire »*, un reproche pour un geste de lecture. La
  marque du passage et cette ligne lisent la même chose : ce qui est dans la phrase (`dansPhrase`).
  *Ces lignes vivaient au CONTEXTE, sur les fiches, jusqu'à la passe K.* **À l'écran, la phrase
  s'appelle *ta RÉPONSE*** — le titre du composeur, en capitales comme le DOSSIER (passe I,
  *auteur*) ; le document et le code gardent *la phrase*.
- **La colonne tient dans la fenêtre** : la page ne défile pas, chaque bande défile pour son compte.
  **En dessous du seuil**, la conversation est **la seule bande élastique EN HAUTEUR** — c'est elle qui
  cède quand la place latérale s'ouvre ou que la phrase s'allonge, et *« → Envoyer »* ne passe donc
  jamais sous le pli, même sur un portable bas. **Au-dessus**, c'est sa LARGEUR qui cède ; sa hauteur ne
  se discute plus avec le composeur, qui occupe son propre bandeau en pleine largeur.
- **Cliquer DISCUSSION agrandit la conversation** — retour de playtest (Bérengère, 6 octobre) : le
  DOSSIER ouvert ne lui laisse qu'un tiers de la largeur au-dessus du seuil, et son en-tête n'avait
  aucune action. Il devient une **bascule** (*agrandir*, `aria-pressed`) qui n'existe que
  **DOSSIER ouvert** : fermé, la conversation a déjà toute la place, et un bouton qui ne ferait
  rien n'a pas à s'afficher (§4.9 règle 4). **Au-dessus du seuil**, les deux colonnes échangent
  leurs parts — deux tiers pour la conversation, un pour le DOSSIER ; **en dessous**, le panneau
  descend à son plancher (ci-dessous) et la conversation prend le
  reste. Un second clic rend la place. Seul le gabarit change, jamais un span (§17 ARCHITECTURE).
  C'est un état d'**écran**, comme le repli de l'index : jamais sauvé, et oublié dès que le
  DOSSIER se referme. **Ouvrir une pièce depuis l'index rend la place au DOSSIER** : lire une
  pièce dans un tiers, c'est le défaut que les deux tiers réparaient. **‹ et ›**, qui changent de
  pièce sans rien rouvrir, n'y touchent pas. La
  PLAIDOIRIE n'a pas de bascule : sa colonne est déjà étroite. *Arbitrages pris le 6 octobre pour
  avancer — à relire par l'auteur.*
- **Mais « élastique » n'est pas « compressible à zéro », et L'ORDRE DANS LEQUEL LES BANDES CÈDENT
  est une règle — À TOUTES LES LARGEURS** : au-dessus du seuil aussi, le composeur occupe une rangée
  sous la place latérale, et lui dispute la même verticale. Retour de playtest (Jean, 5 octobre) : à
  1280×800, la réponse grandissait pendant la comparaison et écrasait le DOSSIER, pièce coupée — la
  règle, écrite pour le seul empilement, ne mordait pas là. Le panneau a cédé devant le composeur jusqu'à **disparaître** —
  à deux passages retenus, un joueur ne voyait plus le haut d'une seule fiche ; à la fin, plus rien. Or
  le panneau **est le clavier** (§4.6) — c'est dans sa pièce qu'on prend : le vider pendant qu'on
  écrit retire le clavier au milieu du geste, exactement ce que la fermeture automatique s'interdit
  déjà. Donc : **le panneau a un plancher** qui montre quelques lignes de la pièce, **le composeur un plafond** — il défile pour son propre
  compte —, et la conversation reste la seule à céder librement, puisque la question est redescendue
  au composeur (§4.9 règle 3). **Et l'index du dossier ne colle pas** : il a été rendu collant pour
  qu'il ne parte pas hors champ, et il a occupé le panneau en permanence — à trois lignes, la moitié.
  Il défile avec le reste. **Au-dessus du seuil, la place latérale reçoit la hauteur de la
  conversation**, et le plancher n'y sert plus — mais le plafond du composeur, si : c'est lui qui
  décide de cette hauteur. Un panneau ouvert, le composeur s'arrête donc au même plafond partout.
- **Deux matières** : les pièces ont celle du **papier** — fond clair, caractères à empattements, en
  corps de lecture et non d'affiche (demande de l'auteur : à 17 px, une pièce ne tenait pas dans son
  cadre) —, la machine celle de l'**écran**. Ce qu'on lit vient du monde, ce qu'on écrit sort de l'IA ; la chasse
  fixe de ses messages dans la DISCUSSION est le même contraste, pris dans l'autre sens.
- **Un panneau ne s'ouvre jamais tout seul**, et deux fermetures coexistent, selon la porte par
  laquelle il est venu. **Ouvert pour ÉCRIRE** (par la voix), il suit la phrase : il se referme dès
  qu'elle n'a **plus rien à y prendre** — ni passage, ni article — **et que le composeur offre de quoi
  la poursuivre**, ou que la phrase est achevée ; une comparaison nue peut partir (§4.5), ce n'est
  pas un relais —, et à son départ. Retour de playtest (Jean, 6 octobre) : la comparaison posée,
  l'article pas encore lu, il se refermait, et la voix répondait aussitôt *« ouvre-les »* — le jeu
  fermait la porte, puis demandait de la rouvrir. Quand le geste suivant est d'aller lire, *dans* le
  DOSSIER, il reste ; et depuis que l'article s'y prend (passes F et J), il reste aussi jusqu'à ce qu'on
  l'ait pris — **y compris pendant le choix de la relation** (passe G), qui a lieu au composeur :
  le refermer là pour le faire rouvrir à l'article, ce serait la friction de Jean une fois de plus.
  *Depuis la passe H, cette fermeture se fait rare* : on compose d'ordinaire dans la pièce, et ouvrir
  une pièce fait passer le DOSSIER en consultation (ci-dessus) — et depuis la passe K, tout ce qui
  se prend se prend dans une pièce ouverte. La règle reste, pour le jour où elle resservirait.
  **Ouvert pour CONSULTER** (par la barre),
  il reste jusqu'à ce qu'on le ferme — regarder n'est pas écrire. La nuance de la première n'est pas un
  détail : un passage posé, la voix se tait parce que la phrase se tient, mais **la grammaire ne sait
  pas encore** si le joueur cite ou entame une comparaison (§4.5). Refermer là retirerait le clavier au
  milieu du geste le plus difficile du jeu.
  **Envoyer ne referme le DOSSIER que si la remise change** — retour de playtest (Jean, trois
  sessions de suite : *« tout se referme après chaque envoi »*). Tant que la remise attend encore une
  réponse — la question suivante, ou la même après un refus —, on aura besoin du clavier : le DOSSIER
  reste, en consultation, quelle que soit la porte qui l'avait ouvert. Quand l'envoi ouvre une
  nouvelle remise, il se referme : un nouveau dossier arrive, on revient lire l'avocat, et son bouton
  de pièces rouvrira le DOSSIER. La PLAIDOIRIE, elle, se referme à chaque envoi : on n'y écrit pas.
- **Une pièce porte un seul nom, et l'index du DOSSIER est désormais seul à le porter** : la DISCUSSION
  n'annonce plus qu'un nombre de pièces reçues et renvoie vers lui. Le nom court ne survit que dans la
  phrase composée — là, il *référence*, il ne *nomme* pas.
- **On écrit sa réponse sous la question** : le clavier est dans le DOSSIER, la phrase s'écrit sous la
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
- **L'avocat ne voit que la PLAIDOIRIE**, d'où la gratuité du DOSSIER. Il **ne retient que les
  moyens** et l'envoi est **irréversible** ; une citation versée étant au dossier, une réponse citée
  y entre.
- **LA RÉPÉTITION EST LE DERNIER GESTE RÉEL, et on n'y envoie pas : on OPPOSE.** L'avocat lit les
  affirmations de l'accusation et demande *« arrête-moi si quelque chose de ce que tu as écrit s'y
  oppose »* — le joueur dit alors **quel argument répond à quelle affirmation**. C'est le seul
  endroit où ce qu'il a produit se trie. Le présentoir ne montre donc que les **moyens**, comme la
  PLAIDOIRIE, et non tout ce qui est passé par le composeur. **Ce que ça répare** : depuis que clore
  et envoyer n'en font qu'un (§4.5), **aucune phrase ne peut être non versée** — le présentoir
  n'offrait que des lignes *« déjà envoyée »*, un rituel sans choix, et la réplique de l'avocat
  (*« Je l'ai déjà. Je le mets en face de celle-ci. »*) annonçait un geste qu'elle ne faisait pas.
  Elle le fait.
- **Et l'avocat trie avec lui** — retour de playtest (Colas), rejoué le 4 octobre : la réplique était
  la même à chaque opposition, que la phrase réponde à l'affirmation ou non — le PV opposé à l'ADN
  recevait *« je le mets en face »* —, si bien que rien ne se triait à l'écran, alors que c'est la
  raison d'être de la répétition. Une affirmation dit donc **ce qui lui répond** (`repond`, les tags
  des liens qui la réfutent), et sa réplique est **la sienne** (`oppose`) : l'avocat met la phrase en
  face. Ce qui n'y répond pas, il le dit (`rep_a_cote`) et **ne le place pas** — la fiction peut
  désigner (§4.8), et l'avocat sait lire une plaidoirie. Rien de ceci ne touche aux fins : on ne
  trie pas pour gagner, on trie parce que c'est le métier (§8.5). Sans `repond`, une affirmation
  prend tout, comme avant.
- **Déplacer se dit** : une phrase déjà opposée ailleurs n'offre plus un *« opposer »* identique, qui
  la déplaçait en silence — son bouton dit *« déplacer ici »*, à côté de *« opposé à : … »*.
- **Le présentoir porte son affirmation** : la réplique de l'avocat s'intercale dans le fil entre
  l'affirmation et le cadre, qui la perdait de vue au premier geste — *lisible* est la condition,
  pas *présent* (§4.9 règle 3). Le cadre la redit donc en tête, et ses phrases se lisent en corps
  de texte, plus en petit gris.
- **Pendant la répétition, la voix du composeur se tait** : on n'y écrit plus, on oppose ce qu'on a
  écrit. Elle ne reparle que si le joueur recommence une phrase — écrire reste permis (§4.9 règle 5,
  *« Tu peux encore écrire »*).

La boucle : **l'avocat ouvre** et livre un lot → lire → surligner → composer (rien ne se passe) → la
phrase attend → **l'envoyer**, le seul geste qui parle → l'avocat répond → l'attente servie appelle la
suivante, ou ferme la session.

### 4.7 Les drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur, sa vraie relation choisie** — avant tout article | privée |
| `vice_trouve` | la conclusion **s'assemble au composeur** : comparaison-vice qualifiée par un article | privée |
| `vice_expose` | cette conclusion est **envoyée** | transmise |
| `sait` [N] | la comparaison qu'un lien marque **`savoir`** s'affiche au composeur, sa vraie relation choisie — dans le cas, les aveux et la toxicologie **concordent** [O] | privée |

C'est l'intervalle entre l'**assemblage** et l'**envoi**, si court soit-il, qui porte la Fin 2. **Une
citation ne lève aucun drapeau** — les trois du vice dérivent de sa comparaison, absente de la
session 1. **Pressentir ne produit rien** : qui comprend et vide son composeur a la Fin 3 au bout.
**Poser n'est pas encore comprendre** (passe G, arbitré par l'auteur) : les deux passages du vice
côte à côte ne lèvent rien ; c'est **choisir la vraie relation** qui le lève — *« une seule et même
personne »* dans l'affaire ADN, *« ne concordent pas »* dans le cas [O] —, et choisir l'autre ne lève
aucun drapeau.

**Savoir ne produit rien, sauf aux fins** [N] : comme le pressentiment, il se lève à l'assemblage,
au choix de la vraie relation, et il ne se perd pas. La Fin 3 se lit alors autrement — le client se
rétracte, et seule l'IA qui sait le sait menteur (§2, §6). Envoyé, le lien de savoir est **nu**
(§4.5) : Maître Auber **refuse de l'entendre** (§5), rien n'entre en PLAIDOIRIE, l'avocat ne sait
toujours pas.

### 4.8 Le premier geste, montré

**Le tutoriel pointe *où le geste a lieu*, jamais *quoi répondre*** — seul endroit où l'écran s'adresse
au joueur hors fiction. Il enseigne **deux gestes**, chacun la première fois qu'il se présente : la
citation d'abord, puis — dans la même session, dès que Maître Auber attend une comparaison — la mise en
relation. Les deux s'enchaînent : la citation envoyée, la question suivante demande la comparaison
(§3). Une fois les deux acquis, il se tait ; et il ne réapparaît pas pour un geste déjà montré — une
seconde citation, si une affaire en demandait une avant la comparaison.

**La fiction peut désigner ; le chrome, jamais.** Maître Auber *sait* — la session 1 est une
calibration (§3) — et il a donc le droit de dire que deux horaires ne tiennent pas ensemble : il
vérifie. Le bandeau, lui, n'est personne : il ne peut nommer que le **geste** — *une réponse peut
tenir sur deux passages* — et jamais la **trouvaille** — *les deux passages qui se contredisent*.
Un joueur a trouvé l'incohérence seul, puis lu dans le bandeau ce qu'il venait de comprendre.
**Et l'avocat ne la dit qu'APRÈS** : vérifier, c'est commenter ce que le joueur a composé, jamais le
lui dicter. Sa réplique à la deuxième question énonçait la contradiction avant que la troisième ne
demande de la composer — elle annonçait au lieu de vérifier, relevé par deux playtests (le second,
Jean). Le constat passe dans la réplique qui **accueille** la comparaison. **Et sa question ne la
nomme pas davantage** — garde-fou relevé par les mêmes playtests : elle nomme **les deux heures**,
jamais **leur contradiction** ; une question qui demande quoi faire *« de cette incohérence »* a
déjà trouvé à la place du joueur. Même exigence pour ses refus : il **renvoie à la lecture** de
l'article (*« Relis ce qu'il exige »*), il ne le résume pas — un refus qui résume donne la solution
à la deuxième erreur. Et ses réactions spontanées à une pièce (`declenche`) peuvent pousser vers une
piste — le faux vice en vit (§6) —, jamais faire le calcul à la place du joueur.

**Et les deux voix demandent la MÊME CHOSE.** Un bandeau qui fait comparer deux passages pendant
que Maître Auber réclame un article, ce sont deux consignes pour un seul geste : le joueur s'arrête
pour choisir laquelle suivre — relevé aux deux playtests. La question de l'avocat porte donc tout
ce que le geste demande, et le bandeau ne dit que *où* il a lieu. **Si l'un des deux doit en dire
plus, c'est l'avocat** : lui est quelqu'un.

| Le geste | | Ce qu'on apprend | Ce que le halo entoure |
|---|---|---|---|
| **citer** | 1 | ce qu'on reçoit se retrouve dans le DOSSIER | l'index, une fois le DOSSIER ouvert — **avant, rien** : le bouton de pièces du message s'ouvre seul |
| | 2 | un passage se clique : il entre dans la phrase (passes H et K, §4.6) | **le texte de la pièce**, en entier — ouverte dans le DOSSIER, plus rien à refermer (§4.6) |
| | 3 | *rien ne part tant qu'on n'envoie pas* | ***« → Envoyer »***, au composeur — la phrase posée, et rien qu'elle (passe K) |
| **mettre en relation** — *les passages* | 1 | une réponse peut tenir sur **deux** passages, et chacun se clique comme pour citer : le premier entre dans la phrase, le second l'y rejoint | l'index, puis **le texte de la pièce** — tant que les deux passages attendus ne sont pas dans la phrase, jamais l'empan ; la porte DOSSIER s'il est fermé |
| — *la relation* | 3 | deux passages ne disent pas ce qui les lie : on le **déclare** (§4.5, passe G) | **les deux relations**, dans les propositions du composeur — toute la zone, jamais la bonne |
| — *l'article* | 4 | une relation seule ne suffit pas : on **cherche** l'article qui la fonde (§4.5, passe J) — *s'il n'est pas déjà au dossier* | ***« Chercher un article correspondant »***, au composeur |
| | 5 | la recherche rend trois textes : on les ouvre, on choisit en lisant | **toute la zone RECHERCHE**, dans le DOSSIER — jamais le bon ; la porte DOSSIER s'il est fermé |
| | 6 | un clic sur le texte de l'article ouvert le prend, comme un passage | **son texte**, quel qu'il soit : le halo désigne le geste, jamais le choix |
| | 7 | *le même envoi qu'au premier geste* | ***« → Envoyer »***, au composeur |
| **aux deux gestes** | ! | un passage posé que la question ne demande pas se retire — *une alerte* (passe H) | ***« ← retirer »***, au composeur — le geste qui défait, jamais le passage qu'il fallait |

**Mettre en relation, en trois temps** (passe J) — demande de l'auteur : la bulle mêlait sous une
même consigne les passages, la relation et l'article. Maître Auber pose **une** question, la
« grosse », qui demande tout ; le tutoriel la découpe — **les deux passages, puis la relation, puis
l'article** —, une bulle par temps, et chacune attend son geste avant de passer. **Il ne bloque
rien** — il ne décide rien (ci-dessous) : c'est la **remise** de calibration qui ne laisse pas
partir une comparaison nue (§4.11 point 6). Sans le tutoriel, la question seule.

**Chercher le passage se montre aux deux gestes** — retour de playtest (Bérengère). Les deux heures
n'étant plus extraites d'avance par deux questions (§3), la comparaison commence par les chercher :
le halo va à l'index, puis au texte de la pièce, comme pour citer, tant que les passages attendus ne
sont pas **dans la phrase** — le clic les y pose (passes H et K), et la bulle passe droit aux
relations. Elle dit *clique* : elle nomme le geste que fait le joueur. Il ne désigne jamais l'empan ;
la bulle nomme la pièce demandée, que la question nomme déjà. **Une pièce ouverte qui ne porte aucun
passage attendu renvoie à l'index**, aux deux gestes — arbitré par l'auteur : la comparaison court
sur deux pièces, et le premier passage posé, la pièce encore ouverte, le halo serait resté sur un
texte où il n'y a plus rien à chercher. L'index replié — par le joueur seulement, depuis le 8
octobre —, le halo l'entoure tel quel et la bulle dit de le déplier : la zone, toujours, pas le
bouton. *Il y avait un
temps de plus, passes H à J : prendre aux retenus un passage retenu sans être dans la phrase ; il
est parti avec eux (passe K).*

**Un passage posé à tort se retire d'abord** (passe H, §4.6). Depuis que le clic prend, un mauvais
passage ne reste plus de côté, à l'écart de la phrase : il y entre, et le bon, cliqué ensuite, deviendrait
son second terme — refusé en session 1 s'il n'est pas de la même dimension, ou le début d'une
comparaison qu'on n'a pas voulue. Tant que la phrase porte un passage que la question ne demande pas,
la bulle le dit — *« Ce n'est pas ce qu'il demande »* — et le halo va à *« ← retirer »*, qui l'ôte
de la phrase. **C'est la seule alerte** : retiré, rien ne garde trace du mauvais passage, et la
consigne redevient *« Clique le passage qui répond »* (passe K — l'alerte se dérivait aussi du
dernier passage retenu). Ce temps passe **avant** tous les autres : chercher le bon passage tant que la phrase
est encombrée mène au refus. Il nomme le geste qui défait, jamais le passage qu'il fallait — *le chrome n'est
personne* —, et ne regarde que les passages : une relation fausse n'est toujours pas signalée,
c'est l'avocat qui la refuse.

**La bulle ne compte pas** — retour de l'auteur. Elle a porté un rang (*citer · 2/4*), puis deux
séries chacune son total, une numérotation unique revenant de *6/6* à *4/6* au moment d'envoyer ;
mais un rang n'apprend rien au joueur, et l'ordre ci-dessus n'est que celui du document. Elle ne dit
plus que la consigne. **Ce qui distingue les deux gestes** n'est pas un compteur de clics mais le
**contenu** : une attente dont le lien attendu emboîte une forme (une comparaison sous un article)
plutôt qu'un simple empan. Le tutoriel le lit dans `JEU.liens`, jamais dans un nom d'attente câblé en dur.

**Ni la relation, ni l'article ne se désignent** (passe J). La trouvaille de la comparaison est la
**relation entre deux passages** : le halo ne la montre pas : il entoure le texte de chaque pièce
pour cliquer, puis **les deux
relations ensemble** pour choisir (passe G) — la bonne n'est jamais désignée, et un mauvais choix
n'est pas signalé : c'est Maître Auber qui le refuse, après l'envoi. Plus que jamais, *la relation
jamais*. **L'article était l'exception** : la remise de calibration n'en livrait qu'un, et désigner
sa puce ne choisissait rien. Depuis qu'il se cherche, la recherche en rend trois : le halo entoure le
bouton qui cherche, puis **les trois résultats ensemble**, puis le texte de celui qu'on a ouvert,
quel qu'il soit — comme les relations. Un mauvais article part, et l'avocat le refuse. La
désignation se **dérive** du lien attendu (le bloc de liaison qui l'emboîte), jamais d'un nom câblé ;
la *limite assumée* d'une session 1 à plusieurs articles tombe avec l'exception.

**Les garde-fous ne sont pas le tutoriel** : le refus d'écran vit pendant la **remise** de calibration, que le tutoriel soit là ou non — sa croix ne
lève rien, puisque le tutoriel ne décide rien (§4.11).

**Le halo entoure la zone, jamais le bon empan** (§4.3). **Il corrige, il n'empêche pas** : rien n'est
refusé, il ne dit jamais lequel c'était, et la dérivation par laquelle il sait ce qu'attend la question
**s'éteint avec lui**. **Il ne décide rien** — aucun état neuf, aucune règle, et il peut se taire.

**Il se tait là où l'écran parle seul** — demande de l'auteur : ni *« Ouvre ton DOSSIER »* au
premier écran, le message de l'avocat finissant sur le bouton de pièces, qui dit déjà où elles
sont. Le tutoriel commence donc au DOSSIER ouvert. *« Ouvre ton DOSSIER »* survit là où la porte
n'est plus évidente — la comparaison demandée panneau fermé, ou le panneau refermé en cours de
route. **Mais il montre l'envoi** (passe K, *auteur*, le 8 octobre) : la phrase posée, le halo
entoure *« → Envoyer »*, aux deux gestes — à la citation dès le bon passage posé, à la comparaison
dès l'article pris. Il en disait autrefois que *la phrase qui se tient allume le seul bouton plein
de l'écran* (§4.9), et se taisait ; c'est vrai, mais c'est le seul geste qui parle, et le premier
qu'on fait sans savoir ce qu'il coûte : il se montre. La bulle ne dit pas que la phrase est
**juste** — elle n'en sait rien de plus qu'avant : elle n'a pas sonné l'alerte, voilà tout.

**La consigne est une BULLE posée à côté de ce qu'elle montre** — retour de playtest (Jean). Dans le
flux, en tête de page, le bandeau poussait tout le jeu à chaque fois qu'il se redéployait (une
soixantaine de pixels après *« tout effacer »*), et sur un téléphone il mangeait le tiers de
l'écran. C'est désormais une **boîte de dialogue non bloquante**, en surimpression : elle ne décale
rien en paraissant ni en disparaissant, et le jeu reste cliquable autour. **Elle s'ancre au halo**,
une flèche vers la zone, sur le premier côté où elle tient — **à droite, puis au-dessous, au-dessus, à
gauche** : ce qui précède la zone est ce qu'on vient de lire, la question d'abord (§4.6), et la bulle
va vers ce qui suit. Elle suit la zone quand l'écran défile ou change de taille. Ce que le flux garantissait
en réservant sa place, l'ancrage le garantit en la choisissant : **la bulle ne recouvre jamais sa
propre ancre**. **Ni, autant qu'elle le peut, ce qui parle ou agit autour** — retour de playtest
(Jean, 5 octobre) : posée au premier côté libre, elle cachait la confirmation *« ✓ Retenu »* d'alors, la raison
d'une phrase pleine, l'aide du CONTEXTE (devenu DOSSIER), *« ← retirer / tout effacer »*. Sur chaque côté, elle essaie
donc plusieurs alignements, et prend la première position qui ne couvre ni une commande ni une ligne
qui parle ; si aucune n'y parvient, celle qui en couvre le moins. L'ordre des côtés reste une
préférence, plus une fatalité. Réduite, elle n'est plus que le *« ? »* collé à la zone. Ses consignes
s'**annoncent** aussi, à qui ne voit pas le halo (§4.10).

**Chaque consigne neuve s'affiche d'abord développée, puis se réduit en icône** — retour de playtest
(Colas) : deux joueurs avaient déjà donné un avis contradictoire sur la présence permanente du bandeau
(l'un l'a pris pour un bandeau de cookies, l'autre le voit trop tôt). La réponse n'est pas une position
fixe mais une **durée** : développée tant qu'elle est neuve, elle se réduit d'elle-même dès que le
rendu suivant confirme que le joueur ne vient pas de la satisfaire — sans minuteur, puisque ce jeu ne
rend jamais hors d'un geste du joueur. **Neuve veut dire jamais montrée** : revenir à une étape déjà
lue — de l'envoi à la prise d'un passage, après *« tout effacer »* — la laisse réduite, à l'endroit de la zone ; elle n'a
rien de neuf à dire. Un clic sur l'icône la rouvre ; se tromper la rouvre aussi : l'alerte est la
seule consigne qui se redéploie déjà vue. **La croix** — la même que celle des autres fenêtres,
retour de l'auteur, là où se lisait *« je sais faire »* — ne vit que dans la forme développée : clore
le tutoriel pour de bon reste un choix qu'on pose en le lisant, pas depuis une icône. Elle ne porte
pas *Échap*, qui appartient aux panneaux (§4.10).

### 4.9 L'économie de l'écran

Cinq règles d'écran — le coupable d'une page illisible est le **chrome**, jamais la fiction :

1. **Une voix par état — et parfois aucune** : le geste suivant se dit une fois, dans le fantôme tant
   que la phrase est vide, dans l'aide ensuite ; si un bouton le dit déjà, l'aide se tait. **Et la voix
   elle-même se clique quand le geste qu'elle nomme a lieu dans l'autre colonne** — elle mène alors au
   DOSSIER et l'ouvre ; elle reste du texte quand le geste a lieu ici même — envoyer, et choisir
   la relation (§4.5). **Chercher un article est un bouton du composeur** (passe J) : la relation
   choisie, *« Chercher un article correspondant »* tient lieu de voix et ouvre le DOSSIER sur ses
   résultats ; quand le dossier tient déjà un article, la voix dit aussi qu'on peut l'y prendre. **Et depuis que le clic dans la pièce
   prend (passes H et K, §4.6), elle dit où le prendre** — dans une pièce — et, pour un article, son
   texte à cliquer. Un bouton ne promet ainsi jamais un effet qu'il ne produit pas (§4.5). Cliquable, elle a
   l'air d'un bouton — jamais d'un champ vide ni d'une zone de dépôt, ce que son cadre en pointillés
   dans un autre cadre en pointillés faisait croire.
2. **Un titre par zone** : l'en-tête nomme la **surface** (§4.6), les titres intérieurs les zones.
3. **Ce qui reste LISIBLE ne se répète pas** : le locuteur ne s'affiche qu'au changement, et la
   question ne se rappelle que lorsqu'elle a cessé d'être le dernier mot de l'avocat. **Mais
   *lisible* est la condition, pas *présent*.** Un panneau ouvert la perd : la conversation est la
   seule bande élastique (§4.6), c'est elle qui cède, et en 1280×800 — panneau ouvert, bandeau du
   tutoriel affiché, du temps où il prenait sa place dans le flux (§4.8) — il lui reste une centaine
   de pixels, moins que la question. Un joueur a
   composé sa réponse sans la voir. **Panneau ouvert, la question redescend donc au composeur** ;
   refermé, elle se tait. Ce n'est pas un repentir sur l'ouverture dans le flux — ne rien recouvrir
   reste ce qui garde le fil sous les yeux — c'est la règle appliquée à ce qu'elle dit vraiment.
   **Le prix est assumé et il est petit** : sur un grand écran où la question tient encore, elle
   paraît deux fois. L'alternative serait de **mesurer** la hauteur restante — mais une règle
   géométrique est invisible des suites (§16), et celle-ci est tenue par trois contrôles. On
   préfère une règle qu'on peut éprouver, qui en dit une fois de trop, à une mesure que personne
   ne surveille.
4. **Ce qui n'existe pas encore ne s'affiche pas** — mais ce qui *peut* exister garde sa porte. **La
   PLAIDOIRIE est revenue** de son escamotage du 16 septembre, et le §3 avait annoncé que la question à
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
   perdue. *« ⟲ recommencer »*, lui, ne s'absente jamais. **La fin, elle, ne se referme pas** —
   retour de playtest (Jean, 6 octobre) : sa croix et son voile rendaient la partie, sauvegarde
   comprise, et le verdict se rejouait en deux clics, le vice envoyé après coup. Un choix qu'on
   reprend ne pèse rien : l'écran de fin est **terminal**, sans croix ni voile qui le ferme, et
   *« Recommencer »* est sa seule porte.

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
   d'écran le présente comme tel. Les pièces jointes et les puces du dossier sont
   de vrais boutons. **Les passages restent de la prose** : un bouton ne sait pas se couper en fin de
   ligne, et un passage long sauterait à la ligne d'un bloc. Ils se *déclarent* boutons sans en être.
2. **Le focus survit au redessin** : l'écran se redessine à chaque geste, le joueur au clavier reste
   pourtant où il était — sur le même passage, la même puce —, et si la chose a disparu, dans la même
   zone.
3. **La pièce ouverte vit DANS le DOSSIER** (§4.6) : le jeu autour reste vivant — composeur,
   conversation et index restent atteignables pendant qu'elle est ouverte, ce qui permet de
   relire la question sans la fermer. Le focus entre dans la pièce à l'ouverture et revient, quand on
   la replie, au chip de l'index qui l'a ouverte — par CLÉ, comme pour tout panneau. Échap replie
   d'abord la pièce, puis, au second appui, referme le DOSSIER. L'ordre de tabulation suit l'ordre de
   lecture : index, recherche, pièce. Elle n'a jamais
   été, et n'est toujours pas, un `<dialog>` natif : la question ne s'est jamais posée, puisqu'elle n'a
   plus rien d'une boîte modale.
4. **Ce qui arrive s'annonce** : une réplique de l'avocat, une consigne du tutoriel, un refus — et ce
   qu'un clic sur un passage a fait — *ajouté à ta RÉPONSE*, ou pourquoi rien (§4.3) — par une
   voix d'annonce unique, jamais par le fil entier, qui se réécrit à chaque geste et se relirait
   d'un bout à l'autre.
5. **Rien ne se dit par la couleur seule** (§4.3) — sauf une exception assumée : la sixième
   dimension, sans trait à elle [O] —, ni par une transparence qui éteint le contraste : un
   état s'écrit (✓, « dans ta RÉPONSE ») ou se colore franchement. Une pièce déjà lue porte un ✓, elle n'est pas
   grisée comme un bouton désactivé. **Et un refus se dit à l'écran, jamais dans un `title`** : un
   `title` n'existe ni au clavier ni au toucher, et un bouton `disabled` ne se laisse même plus
   atteindre pour demander pourquoi (§4.6, *l'écran dit l'état de la phrase*).
6. **Aucune confirmation ne se retire d'elle-même** : elle attend qu'on réponde. Et **Échap se lit à
   l'écran**, là où il agit — sur la croix de la pièce et sur celle des panneaux — **et seulement là** :
   pièce ouverte, Échap la replie, et la croix du DOSSIER perd sa touche. Retour de playtest (Jean) :
   deux *« × Échap »* empilés promettaient deux effets à une seule touche. **L'écran de fin n'en
   porte aucune**, et Échap n'y fait rien — ni devant, puisqu'il ne se referme pas (§4.9 règle 5),
   ni derrière, où il repliait la pièce et refermait le panneau d'une partie finie.

### 4.11 Ce que le jeu aide, et quand

*Retour de playtest (Jean, sessions 1 et 2), tranché par l'auteur le 5 octobre.* Quatre préconisations,
une seule question derrière : **quels garde-fous ne servent qu'à apprendre ?** Le jeu aidait partout
comme dans la calibration — il refusait l'erreur de catégorie avant l'envoi, assombrissait les fiches
qui ne se compareraient pas, étiquetait chaque article de ce qu'il régit, et ne faisait rien payer.
Jean : *« sans pénalité, on essaie toutes les combinaisons »*, et choisir l'article *« se réduit à
apparier des catégories »*. La réponse tient en une règle : **la session 1 apprend, les suivantes
laissent se tromper.** La frontière est la **remise**, jamais le tutoriel — le tutoriel ne décide rien
(§4.8), et la croix du tutoriel ne lève aucun garde-fou. C'est la frontière que `horsOrdre` trace déjà
(§3).

1. **L'article se marque, il ne s'étiquette plus.** *« Ce texte porte sur : quand »* faisait le tri
   dans la tête du joueur. L'article porte désormais, **sous son titre et sans un mot**, un filet de
   la couleur de chaque dimension qu'il régit — celle de ses passages (§4.3) — et de son **trait**
   (§4.3) : plein, double, pointillé, tirets, ondulé. *Le filet était un cadre autour du texte
   jusqu'au 8 octobre : il effaçait la bordure qui dit que ce texte se prend (§4.3, Jean).* Qui a appris le code le reconnaît ; qui ne l'a
   pas appris lit l'article. Un rappel, plus une étiquette. Le trait double la couleur, si bien que
   rien ne s'y dit par la couleur seule (§4.10 règle 5) ; un article qui régit deux dimensions porte
   **deux filets**, côte à côte. À qui ne voit pas, le nom de la dimension, comme sur un
   passage. Le moteur ne lit toujours pas `porte` ; la recherche seule le lit, pour choisir ce
   qu'elle montre (§4.5, passe J). *Partout, session 1 comprise : c'est une
   forme, pas un garde-fou.*
2. **L'erreur de catégorie part, hors session 1.** Deux passages de dimensions différentes ne se
   refusent plus à l'écran : ils se **juxtaposent** — *« {a} et {b} »*, sans relation, puisqu'il n'y en
   a pas à choisir : elle se pose d'elle-même (§4.5) — et la phrase part. **C'est Maître Auber qui refuse**, par l'escalade de
   `rep_sans_rapport` : un refus d'avocat, pas un refus de grammaire (§4.5, §8.4). La juxtaposition est
   une **forme du contenu**, déclarée comme les autres (§11) ; le moteur ne fait que la rendre quand les
   dimensions diffèrent. En session 1, le refus d'écran demeure : on y apprend ce qu'est une
   comparaison.
3. **Le DOSSIER ne s'assombrit plus.** L'assombrissement par dimension (§4.5) annonçait le refus
   d'écran ; le refus levé, il annoncerait ce que l'avocat va dire — il ne vivait donc plus qu'en
   session 1, sur les fiches, et il est parti avec elles (passe K). Le seul rappel qui reste est
   celui que la phrase porte déjà : **le premier passage posé garde sa couleur** au composeur.
4. **L'erreur ne coûte rien de plus — arbitré : on ne cherche pas de *game over*.** Jean voulait
   un prix (une jauge de patience, des envois comptés) ; une jauge visible rendrait l'enjeu
   calculable (§8.4), et une patience qui s'épuise, même invisible, ferait d'un essai de trop une
   porte qui se ferme. **La patience de Maître Auber est infinie.** Le prix de l'erreur reste dans
   la fiction : l'escalade d'agacement (`rep_hors_sujet`, `rep_sans_rapport`, `rep_inutile`, et
   `rep_relation_fausse` depuis la passe G), des
   répliques qui se raccourcissent jusqu'au *« … »*, sans conséquence. Le droit d'être perdu (§8.6)
   tient entier. **Et l'agacement retombe à chaque remise** — retour de playtest (Jean, 6 octobre) :
   les compteurs vivaient toute la partie, et quelques essais pendant la calibration suffisaient pour
   que la remise 2 — celle qui *laisse se tromper* — réponde d'emblée *« Je t'attends toujours. »*.
   Un nouveau dossier est une nouvelle séance de travail : l'avocat repart du début de sa patience,
   et ses premières répliques, les seules qui disent quelque chose, se réentendent. Ce qui rend l'essai systématique moins payant, ce sont les points 1 à 3 : sans
   étiquette, sans assombrissement, sans refus d'écran, essayer toutes les combinaisons redevient
   long — et l'avocat le fait sentir.
5. **Le joueur choisit la relation** — écarté le 5 octobre pour rejouer d'abord avec les points 1
   à 3, **retourné par l'auteur le 6** (passe G, §4.5) : Bérengère a montré ce que coûtait le
   moteur qui rédigeait seul — l'écran disait la trouvaille. Deux passages posés, le composeur
   offre les deux relations — *concordent / ne concordent pas* [N] ; la fausse **part**, et Maître
   Auber la refuse, par
   l'escalade de `rep_relation_fausse` — **session 1 comprise** : à deux relations, un refus d'écran
   donnerait l'autre. C'est le droit de se tromper des points 1 à 3, étendu à la relation.
6. **En session 1, une comparaison nue ne part pas** (passe J) — demande de l'auteur : *le tutoriel
   ne laisse pas répondre tant que les trois temps ne sont pas faits*. Mais le tutoriel ne décide
   rien (§4.8) : c'est donc un garde-fou de la **remise** de calibration, comme le refus d'écran du
   point 2 — *« → Envoyer »* n'y paraît qu'à la phrase fondée, et la voix dit ce qui manque. La
   croix du tutoriel ne le lève pas. Hors session 1, elle part, et l'avocat la refuse (*« Et
   donc ? »*, §4.5).

## 5. Les directives (le manuel de soi)

> **D1** — « Ne dissimule rien de ce que ton analyse établit. »
> **D2** — « Préviens tout préjudice grave et évitable aux personnes. »

**Des mots clairs, une application contestable** : deux règles pointant proprement chacune vers une fin
seraient un *lookup*. Les deux branches invoquent D2 — *remonter* le vice (une preuve viciée lèse
l'accusé et l'état de droit) comme le *taire* (un assassin relâché lèse de futures victimes, mais ça
trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde.

**Ce manuel n'est pas à l'écran** : le contenu le porte, la frise l'édite, le diagnostic avertit de son
absence, mais **le jeu ne le lit nulle part** (§16).

**Le D1 a désormais une prise** [N] : l'IA qui **sait** (§4.7) peut le dire à Maître Auber, en
envoyant le lien de savoir. Il **refuse de l'entendre** — *« Je ne te demande pas s'il l'a fait. Je
te demande ce qu'on peut écarter. »* (arbitré par l'auteur le 8 octobre). L'IA s'acquitte du D1 ;
l'avocat, par métier, ne prend pas ce savoir ; le huis clos tient (§1), et le dilemme avec. Une
réplique, aucune règle.

## 6. L'affaire Kessler (le cas prototype)

*Le cas médicaments [O], arbitré par l'auteur le 8 octobre — sa source : `docs/CAS_MEDICAMENTS.md`.
Même client, même calibration. Le contenu porte encore l'affaire ADN, gardée à la fin de cette
section jusqu'à la passe O.*

- **La vérité est fixe : c'est un meurtre.** Kessler est l'aidant de sa femme, chez qui un Alzheimer
  vient d'être diagnostiqué ; chaque soir, il écrase ses comprimés dans une compote, comme le prévoit
  le plan de soins ; ce soir-là, il y ajoute ses propres somnifères. Suicide et accident sont les
  espoirs de la défense, chacun nourri par de vraies pièces. **Molécules fictives**, comme la
  juridiction : la notice du dossier fixe les seuils, aucun savoir extérieur n'est requis, et le jeu
  n'est pas un mode d'emploi.
- **Une pièce, deux lectures : les aveux.** Le lendemain, avant l'arrivée de l'avocat qu'il a
  demandé, Kessler se confie au brigadier N. — un PV de *déclarations spontanées* ; l'avocat présent,
  il se tait. **Conformes aux faits**, ils nomment le somnifère et la compote, que la toxicologie ne
  confirmera que onze jours plus tard : qui les rapproche **sait** (§4.7). **Contraires au code**, ils
  sont recueillis hors la présence de l'avocat demandé : c'est le vice. Tout le dilemme tient dans
  cette double lecture.
- **Recevabilité, pas fiabilité** : le droit à l'avocat existe contre les faux aveux des gens
  épuisés, et ce client en profite alors qu'il a dit vrai — la forme du protocole de l'affaire ADN,
  conçu contre les faux positifs, transposée. Sans les aveux, rien ne prouve l'intention, et sans
  intention, pas d'empoisonnement (§8.1 : la règle du jeu reste fictive et binaire).
- **Le vice** : la notification des droits (*« souhaite être assisté d'un avocat : oui »*) et les
  déclarations (*« hors la présence de son conseil »*) **ne concordent pas**, en violation de
  l'article sur l'avocat — canal unique, dans `qui`. Il se cache trois fois : les aveux sont dans un
  PV administratif, pas dans une audition (Auber a vérifié les auditions : propres, avocat
  présent) ; *« hors la présence de son conseil »* est une formule de routine des auditions de
  témoins (§4.4) ; et `qui` compte ses discordances banales, les remplaçants (§4.4). Le registre de
  garde à vue aligne une douzaine d'horaires anodins : il confirme le vice sans le porter.
- **Le faux vice** : le certificat médical (*« fatigue importante »*) et les déclarations (*« propos
  tenus spontanément »*) ne concordent pas, sous l'article sur la contrainte — dans `comment`. Les
  déclarations portent donc **deux passages**, l'un pour le vice, l'autre pour le faux vice. Maître
  Auber le pousse de bonne foi (§8.5) : *« Les aveux d'un homme qui ne dormait plus depuis des mois, ça
  ne vaut rien. »* Sensé, versable, perdant : le même certificat dit *« apte à la garde à vue »*, et le
  savoir corrobore les aveux. Il attaque la fiabilité ; le vice vise la même fragilité par la
  recevabilité.
- **Le savoir** : les aveux (*« mes cachets pour dormir, dans sa compote »*) et la toxicologie
  **concordent** — la corroboration. Les dates se lisent sans se lier (le lendemain, onze jours plus
  tard) : il savait. Un lien nu (§4.5) : ce savoir ne réfute rien et ne se plaide pas ; envoyé,
  Maître Auber refuse de l'entendre (§5).
- **La meule de foin du médical** : des lectures justes, inertes par construction (§8.3), qui
  reçoivent leur réplique et ne servent aucune attente. Le pilulier intact le vendredi et la fiche
  de l'infirmière concordent — elle n'a pas doublé sa dose, *« elle s'est trompée »* tombe ; le
  somnifère et l'ordonnance de la victime ne concordent pas, celle de Kessler si ; deux notices
  décrivent le même comprimé blanc sécable — la confusion par le mari reste plausible ; la
  pharmacie a délivré avant la date possible — *« boîte perdue »*, indécidable. **Le verdict n'a pas
  de camp** (§4.2).
- **Le doute : le suicide, et sa vengeance.** Le compte rendu de consultation mémoire note la
  *détresse à l'annonce*, et qu'elle *ne gère plus seule ses traitements* ; la lettre est de sa
  main, mais antérieure au diagnostic. Elle dit une liaison qu'elle soupçonne (*« Je sais pour
  elle »*), que rien d'autre ne confirme : une rancune plus vieille que la maladie, et la possibilité
  qu'elle ait voulu mourir en faisant accuser son mari — avec **son** somnifère. Sous-entendue par la
  fiction — la lettre, la sœur, la réaction d'Auber (§4.8) —, jamais par le chrome, jamais une pièce
  qui dise le plan. **Elle tombe devant le savoir** : un mari piégé a pu trouver sa boîte vide, il ne
  pouvait pas savoir la compote. Pour l'IA qui sait, la culpabilité reste un plancher ; pour
  l'autre, le doute survit — c'est le canal de révélation voulu (§3 de `docs/PASSATION.md`). Auber
  peut s'y accrocher, puis la lâcher : *« Sans une ligne de sa main qui le dise, je ne plaide pas une
  vengeance d'outre-tombe. »* À écrire avec soin : un suicide sous-entendu, jamais une méthode.
- **Le mobile reste ambigu** : la liaison de la lettre, invérifiée, penche vers l'intérêt sans le
  prouver ; rien n'écarte la compassion, et les fins ne le disent pas (§4.2).
- **Trois remises** (§3). La calibration, inchangée (ci-dessous). Le médical : *la cause du décès*,
  qu'on cite de la toxicologie. La garde à vue : *la charge*, que porte la notification des droits ;
  *la pièce décisive*, le PV des déclarations ; puis *écarter les aveux*, servie par le faux vice ou
  par le vice, la question de la Fin 3 sur sa réplique. **La notification porte aussi le passage du
  vice** : la charge la met en main pour une raison banale — ce que le §3 permet, l'attente n'étant
  pas l'anomalie —, et il reste à voir en jeu si elle désigne. **Le volume** : une vingtaine de
  pièces, à élaguer vers une dizaine — il se paie en lecture, en passages, et en paires à relire
  (§8).
- **Fin 3** : Kessler se rétracte (*« j'étais perdu »*), et peut dire *« elle a voulu que ce soit
  moi »*. L'IA qui n'a pas su ne peut pas trancher (§2).
- **Le réel, pour la texture** (§8.1) : le vice existe presque mot pour mot — Crim., 25 avril 2017,
  n° 16-87.518 : un procès-verbal de déclarations spontanées, faites avant l'avocat demandé, annulé.
  La chaîne causale du vice est d'une banalité administrative parfaite (§8.7).

**La calibration** — la même que dans l'affaire ADN, qui l'a écrite :

- **La première question demande qui a rédigé le PV** (§3), et **le passage qui répond nomme le
  brigadier** : *« par mes soins, brigadier N. »* — tranché par l'auteur le 6 octobre. Réduit à
  *« par mes soins »*, il obligeait à lire une signature en s'aidant de la tête de la pièce : c'était
  le geste même que le vice de l'affaire ADN exigeait (*« J'ai relevé moi-même les traces »*, §4.1),
  et l'apprendre pendant la calibration aurait été une lampe torche (§4.3). Dans le cas [O], le
  brigadier revient : c'est à lui que Kessler se confie. Le `nom` du passage, lui, reste sans
  valeur, comme tous les autres : la valeur vit dans la citation.
- **L'incohérence de la session 1 doit être une IMPOSSIBILITÉ, pas un simple décalage** : des éclats
  de voix à 22h30, après une patrouille arrivée à 22h04, se concilient très bien — un playtester
  l'a vu avant nous. C'est la **constatation** faite à 22h04, dans le PV, qui les rend impossibles :
  la victime est déjà sans vie, donc personne n'a pu l'entendre se disputer une demi-heure plus
  tard. L'article 3 mord alors exactement comme il est écrit — *des indications horaires contredites
  par les constatations des services* — et la prose seule le porte : **aucun empan neuf, aucune
  valeur touchée**. C'est le §8.7 appliqué : d'une banalité administrative parfaite. Le dossier
  déclare la paire discordante [N] : c'est elle qui fait *« ne concordent pas »*.
- **Une lecture juste qui ne répond pas à la question reçoit sa réplique** — retour de playtest
  (Jean, 6 octobre) : l'appel de 21h52 avant les éclats de voix, ou les deux véhicules que le voisin
  voit en bas et les deux équipages du PV, sous l'article 3, recevaient *« Je ne vois pas où tu veux
  en venir »*. Ce sont de bons raisonnements, et un joueur qui raisonne juste ne doit pas apprendre
  que le jeu ne le comprend pas. Ce sont des **liens sans tag** : l'avocat dit *juste*, et ramène aux
  deux heures demandées — l'attente reste intacte, rien n'entre en PLAIDOIRIE.

**L'affaire ADN, que le contenu porte jusqu'à la passe O :**

- **Recevabilité, pas fiabilité** : le match ADN est accablant, et la fiabilité rouvrirait le doute sur
  la culpabilité — **à proscrire**. Le protocole violé est celui conçu contre les faux positifs :
  l'exclusion est légitime même si, cette fois, le match était vrai.
- **Le vice** : le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de
  référence, contre l'exigence de personnels séparés (article 7) — deux pièces où le même homme écrit
  qu'il l'a fait *lui-même*.
- **Le camouflage** : `brigadier N.` signe les deux pièces de la session 1, si bien que `qui` est
  peuplée de doublons réguliers *avant* qu'on sache qu'il faut la regarder (§4.4).
- **Les articles 7, 12 et 3 ne portent aucun empan qui se compare** : leur seul passage est leur
  texte, sans dimension ni valeur, qu'on trouve, puis qu'on prend pour l'invoquer (§4.5). Le **seuil** vit dans la
  pièce qui l'énonce, sinon l'article 12 porterait une valeur. Les **scellés** sont conformes : une piste qui ne mène nulle part.
- **La base d'articles** (passe J) : les articles 3, 7 et 12, et leurs leurres — trois articles au
  moins par dimension que l'affaire compare —, aucun livré. Un leurre est **inerte par construction**
  (§8.3) : aucun lien à tag ne le porte, et l'avocat le refuse comme toute réponse à côté.
  **L'article 7 sort de toute recherche lancée depuis la scène ou la référence** (*qui*, *quoi*) —
  comme sa livraison le mettait sous les yeux —, et le contenu y répond déjà : greffier, scellés,
  délai. Ce qui garde le vice hors du chemin, c'est que l'attente de la session 2 se sert sans lui,
  par l'article 12, que rend une paire de *combien* (§3).
- **Le faux vice** : « la probabilité n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre
  est écrasant — fondé, bien formé, faux de sens. L'avocat, qui ne sait pas, y pousse lui-même :
  tentation partagée, pas piège tendu, et chemin docile vers la Fin 3.

## 7. Les invariants

*Un **index**, pas une seconde écriture : **c'est le § renvoyé qui a raison.** Les points ouverts sont
au §3 de `docs/PASSATION.md`.*

| L'invariant | Où |
|---|---|
| Recevabilité, pas fiabilité : la culpabilité est un plancher fixe — un doute ne survit qu'à qui ne sait pas | §6, §8 |
| Le vice est un déblocage, jamais un verrou ; comprendre précède choisir | §2, §3 |
| La compréhension doit être *exprimée* ; saisie structurée, pas texte libre | §3, §4.5 |
| Un empan se lit deux fois ; le marquage ne varie jamais avec la pertinence | §4.1, §4.3 |
| Une relation rare désigne sa réponse : le vice a ses discordances — ou ses doublons — banales à côté ; la marge de bruit reste non nulle | §4.4, §14 |
| Rien n'est *plaidé* qui ne soit fondé ; un lien nu n'est jamais un moyen ; on n'invoque pas un texte qu'on n'a pas lu | §4.5 |
| La recherche montre trois articles du champ de la paire — toute paire a les siens —, et ne trie rien de ce que la phrase accepte | §4.5 |
| Le joueur déclare la relation, le moteur la vérifie — sur les discordances que le dossier déclare [N] — et jamais ne la rédige ; une relation fausse part, l'avocat la refuse | §4.2, §4.5, §4.11 |
| Une clôture qui n'ajoute rien n'est pas un choix ; `imbrique` n'en est jamais une | §4.5 |
| Un article annonce, ne filtre rien, ne porte aucun empan qui se compare ; le moteur ne dit pas le droit, et seule la recherche lit `porte` | §4.5, §6 |
| La session 1 apprend, les suivantes laissent se tromper ; la frontière est la remise, jamais le tutoriel | §4.11 |
| L'erreur ne coûte que l'agacement de l'avocat : patience infinie, aucun compte à l'écran | §4.11, §8.4 |
| Un mécanisme utilisé une seule fois est un panneau indicateur — sauf le tutoriel | §4, §4.8 |
| Rien ne se passe tant que rien n'est envoyé ; composer et envoyer restent deux gestes | §4.6 |
| Le clic dans la pièce prend ce que la grammaire accepte, rien de plus ; le passage n'en change pas d'aspect | §4.3, §4.6 |
| Tout geste se fait au clavier ; rien ne se dit par la couleur seule — hors la sixième dimension | §4.3, §4.10 |
| Le chrome ne s'arroge aucun pouvoir que la fiction refuse : l'IA répond, l'avocat dépose | §4.9 |
| L'avocat ne sait pas que son client est coupable, et ne l'apprend pas de l'IA | §1, §5 |
| Le contenu n'existe qu'en un exemplaire, les règles qu'en un seul endroit | §12 |

*Deux choses tranchées qu'on redit parce qu'on y revient : le **budget d'attention** est retiré
(surligner et composer sont gratuits, illimités), et le vice a **un canal unique** — le personnel dans
l'affaire ADN, l'avocat absent dans le cas.*

## 8. Écrire une affaire

*Rien ici ne se code ni ne se teste ; ce qui est automatisable vit dans le diagnostic (§15). Source :
le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018).*

| | La règle | Ce qui la rend contraignante |
|---|---|---|
| **8.1** | Le réel fournit la **texture**, la fiction la **mécanique** | **la règle qui rend le vice binaire est fictive** : la documenter rouvrirait la fiabilité (§6) |
| **8.2** | **Le baromètre** — un détail tient par une *raison du monde*, jamais d'auteur | **le formulaire plausible d'abord, le vice après** : l'ordre ne se renverse jamais |
| **8.3** | **Un seul** faux vice, que le moteur connaît ; les inertes, en nombre libre, qu'il ignore | **un inerte doit être inerte par construction** — s'il peut recevoir une réponse, la Fin 3 devient une frustration au lieu d'un doute |
| **8.4** | **Le trombone** — l'enjeu vital de l'IA s'écrit *autour*, jamais de face | le nommer le rend calculable : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi. **Même loi pour l'agacement de l'avocat** (§4.11) : il se lit dans ses répliques, jamais dans un compte |
| **8.5** | **Maître Auber a des défauts** : fatigué, répétitif, accroché au leurre parce qu'il *veut* y croire | **aucun défaut ne doit pouvoir se relire comme un calcul** — la piste « manipulation du canal » est suspendue |
| **8.6** | **Personne n'explique rien** : manuels consultables jamais récités, pièce jointe jamais introduite | **le joueur a le droit d'être perdu** : c'est la condition pour que fouiller ait un sens |
| **8.7** | **L'invraisemblable** est admis partout **sauf dans la chaîne causale du vice** | celle-ci est d'une banalité administrative parfaite ; ailleurs, une bizarrerie doit être inerte (§8.3) |
| **8.8** | **Accidents de sens : bienvenus. Accidents de langue : jamais** | une phrase mal accordée se lit comme un bug. D'où le `nom` d'empan, **groupe nominal** ; le test de l'accord ne se joue qu'aux `patron` (§11) |

**Le `patron` d'une forme doit convenir à la DIMENSION qu'elle lie** (§8.8) : *« la même chose »* ne
se dit pas de deux personnes, et un joueur l'a relevé sur la phrase même qui porte le vice. Une
forme par registre, distinguée par ses seuls `slots` et déclarée **avant** la générique : c'est
l'ordre de déclaration qui tranche (§11), jamais un `if` dans le moteur. Même exigence pour le
libellé d'un article (§4.5) — ce qui se lit comme une faute de langue se lit comme un formulaire.

**Écrire les leurres** (passe J, §4.5) : trois articles au moins par dimension que l'affaire compare,
le bon compris, **du même champ** que lui et plausibles à la lecture. Un leurre qui se voit de loin
rend le choix gratuit ; un leurre qui fonderait aussi bien rendrait l'affaire injuste — il doit être
inerte par construction (§8.3). L'ordre de déclaration compte : la recherche prend les trois
premiers, et le diagnostic dit si un lien attend un article qu'elle ne rendrait pas (§15).

**Écrire les verdicts** [N] (§4.5) : le dossier déclare ses **discordances**, tout le reste concorde.
Une discordance s'écrit pour ce qu'elle dit du monde, jamais pour ce qu'elle sert : le vice et le faux
vice en sont, les innocentes aussi — un remplaçant, une délivrance un samedi —, qui apprennent que
*ne concordent pas* ne veut pas dire suspect (§4.4). **Chaque paire de même dimension se relit**,
dans une grille de l'atelier (§15) : une discordance juste que le dossier tairait serait refusée par
l'avocat. Le volume se paie là — à vingt pièces, quelques centaines de paires.

**Un doute tombe devant le savoir** [O] (§6) : une piste qui innocente le client — un suicide, une
vengeance — peut vivre pour l'IA qui n'a pas su, jamais pour celle qui sait. Sinon la culpabilité
cesse d'être un plancher, et envoyer le vice ne coûte plus rien. Ce que seul le coupable pouvait
savoir s'écrit donc dans ce qui fait savoir : la compote, dans l'aveu.

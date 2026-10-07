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
lancée depuis la scène ou la référence rend l'article 7, comme sa livraison le mettait sous les yeux,
mais l'attente de la session 2 se sert sans lui — le faux vice se fonde sur l'article 12, que rend une
paire de *combien* (§6).

```
Session 1  PV + audition, D'UN SEUL LOT — aucun article : il se cherche (§4.5)
           qui a rédigé le PV — un empan : un fait se cite
           puis, sans nouvelle livraison : les deux heures, sous l'article 3
           — deux empans, leur relation, l'article 3 trouvé : une relation se fonde
Session 2  labo, les deux pièces de prélèvement — protocole et seuil se cherchent
           ★ la preuve, ⚠ le vice (hors chemin), ✗ le faux vice
           attente servie par le faux vice (docile) OU par la conclusion du vice
Clôture → répétition → procès hors-champ → Fin 3 / Fin 1 / Fin 2
```

Session 1 apprend à lire, à citer, **puis** à mettre en rapport — **en deux questions**, retour de
playtest (Bérengère), tranché par l'auteur le 6 octobre. Elle en posait trois : l'heure d'arrivée,
l'heure des éclats de voix, puis leur lien sous l'article 3. Les deux premières extrayaient la paire
que la troisième faisait comparer — un prix qu'on disait assumé : la citation qu'on apprenait était
la moitié de la comparaison qu'on demandait ensuite, et la compréhension était à moitié exprimée
avant d'être demandée. **La première question porte donc sur un passage étranger à la
comparaison** — *qui a rédigé le PV ?* —, un fait sans lendemain, qui apprend à citer sans rien
préparer ; **la seconde demande la comparaison entière**, les deux heures sous l'article 3 — qu'il
faut aussi **trouver** (passe J) —, et c'est elle qui les fait retenir (§4.8). Chaque geste du tutoriel a sa question. Et cette question **nomme
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
valeur, signataire, `nom`. **La `valeur` porte la relation** (§4.5) : le joueur la déclare, le moteur
la vérifie — un numéro sert à vérifier, jamais à rédiger à la place du joueur.

**Un empan se lit deux fois** : sa **citation** dans la pièce, son **nom** dans une phrase composée —
groupe nominal, jamais une proposition (§8.8). Le vice cesse ainsi d'être un matricule répété : c'est
un homme qui écrit deux fois qu'il l'a fait lui-même, sans s'en apercevoir.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Les deux relations, et ce qui se **vérifie** | Forme |
|---|---|---|---|
| **Identité** | `qui`, `quoi`, `où` | *la même* / *pas la même* — vraie si les valeurs sont égales, ou si elles diffèrent | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | *coïncident* ou *sont égaux* / *précède* ou *d'un tout autre ordre* — l'égalité, sinon l'**ordre** des valeurs | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — sur une comparaison close | rien : le joueur y choisit l'article, après la relation | `arite:1` |

**Le joueur choisit la relation, le moteur la vérifie** (passe G, §4.5) : deux passages posés, le
composeur offre les deux relations de leur dimension, et c'est la valeur qui dit laquelle est
vraie. Ce qui se *déduisait* — le moteur rédigeait la relation seul — se *vérifie*. Choisir n'est
donc plus réservé à la qualification.

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

**Le marquage ne se montre qu'au survol ou au clic** — demande de l'auteur. Soulignée d'office, une
pièce se lisait comme un formulaire déjà rempli : ses passages s'offraient avant d'être cherchés.
Désormais le texte se lit **nu** ; un passage se souligne et prend son fond **quand on passe dessus**,
et **quand on l'atteint au clavier** (§4.10 règle 1 — le focus vaut le survol) ; **retenu**, il garde
sa marque pour de bon — fond, trait, ✓. Au toucher, qui n'a pas de survol, c'est **le clic** qui le
montre : il le retient, donc le marque. Fouiller y gagne un sens (§8.6 : *le joueur a le droit d'être
perdu*). **Uniforme toujours** : tous les passages se cachent pareil et se montrent pareil — ni lampe
torche ni passe-droit, `bruit` compris. **Le texte d'un article est un passage comme un autre**
(passe F, §4.5) : même bordure, même fond retenu, même ✓ — mais, sans dimension, ni couleur ni
trait ; il se souligne d'un trait neutre, et ses cadres de `porte` restent autour (§4.11).

**Une bordure à peine visible, neutre et arrondie, SUGGÈRE qu'un passage se clique** — demande de
l'auteur : nu, le texte ne disait plus où cliquer ; franche, elle le disait trop. Elle se devine plus
qu'elle ne se voit. Elle est **la même pour tous** et **ne dit ni la dimension ni la
pertinence** : seulement *ici, quelque chose se retient*. Le trait et la couleur restent au survol.

**Le code s'apprend en cherchant : plus de légende.** Posée le 2 octobre — deux playtests demandaient
que couleur et trait *signifient* quelque chose sans survol, et le `title` qui le disait n'existait ni
au clavier ni au toucher —, elle nommait sous chaque pièce les dimensions qu'elle portait. **L'auteur
l'a retirée** : depuis que le marquage ne se montre qu'au survol ou au clic, elle ne disait rien qu'on
ne voie en passant sur un passage, et Jean, au bas d'une pièce, ne la voyait pas. Le code se lit sur
le passage même, au survol, et dans le CONTEXTE, où chaque retenu se range sous le nom de sa
dimension, à sa couleur.

**Retenir a lieu dans la pièce, retirer dans le CONTEXTE.** Recliquer un passage déjà retenu ne
l'oublie pas — arbitré le 16 septembre, reconduit le 30 après un playtest qui attendait un
interrupteur — mais **l'écran le dit** : une ligne sous la pièce renvoie au CONTEXTE. *Depuis la
passe H (§4.6), ce reclic prend le passage si la phrase l'attend ; la ligne ne renvoie au CONTEXTE
que lorsqu'il n'a rien fait, et dit « déjà dans ta RÉPONSE » quand il y est.* Un passage retenu
se marque **par son fond, jamais par sa graisse** : le texte autour ne bouge pas. **Retirer s'écrit
*oublier*, en toutes lettres, jamais d'une croix** — retour de playtest (Colas) : la fiche et le panneau
portaient le même ×, et un joueur a fermé le CONTEXTE en croyant retirer un passage. Le × ferme ou
replie ; il ne retire rien. Un signe, un acte.

**Et retenir se voit au moment même** — retour de playtest (Colas) : rien ne disait qu'un clic avait
*ajouté* quelque chose au CONTEXTE, ni où. Le fond seul ne suffisait pas : à côté du fond léger que
porte tout passage, il se lisait comme un survol. Trois marques, aucune qui fasse bouger le texte ni
qui dure plus d'un geste : le passage retenu porte un **✓ en exposant**, posé hors du flux (§4.10
règle 5 : un état s'écrit) ; **la même ligne que le rappel**, sous la pièce, dit *« ✓ Retenu dans ton
CONTEXTE »* le temps d'un rendu — comme lui, sans minuteur, puisque ce jeu ne rend jamais hors d'un
geste du joueur —, et *« ✓ Ajouté à ta RÉPONSE, et retenu dans ton CONTEXTE »* quand le même clic l'a
pris (passe H, §4.6) — *« ✓ Ajouté à ta RÉPONSE »* seul quand il était déjà retenu : elle dit lequel des deux a eu lieu ; et **la fiche neuve s'allume une fois** dans les retenus, juste sous la pièce
(§4.6) — là où le passage est allé, et où on va le prendre —, comme le compte de la porte CONTEXTE.
La ligne reste **dans le flux** : collée au bas de la pièce, elle couvrait, dans la bande étroite du
CONTEXTE, le texte même qu'on venait de cliquer. **Et elle se voit** : depuis que le clic pose
(passe H, §4.6), le composeur grandit dès le premier clic et la colonne du CONTEXTE perd d'autant —
sur le PV, la ligne naissait sous le bas de sa bande, au premier geste du tutoriel. La bande défile
donc jusqu'à elle, **sans jamais faire sortir le passage qu'on vient de cliquer** : au plus de
l'écart entre le haut de la bande et lui. Sur un téléphone, cet écart manque souvent, et la ligne
ne s'y montre qu'en partie.
La confirmation vit **là où le geste a lieu**, pas dans un coin de l'écran : c'est la pièce qu'on
regarde quand on clique. Le CONTEXTE vide, de son côté, dit **comment** on le remplit — ouvrir une
pièce, y cliquer un passage —, plus seulement *qu'*il se remplit.

### 4.4 Le doublon banal

**Si toutes les valeurs d'une dimension sont uniques, le premier doublon est la réponse ; s'il y en a
déjà plusieurs, un de plus ne dit rien.** La dimension du vice compte donc au moins **deux doublons
réguliers** en plus de l'irrégulier (contrôlé au §15). **Ce critère porte tout le camouflage.** Et il
compte davantage depuis que le joueur choisit la relation (passe G, §4.5) : l'écran n'écrit plus
*« sont une seule et même personne »* à la pose de deux passages — c'est au joueur de **voir**
l'identité, et chaque doublon banal est une identité de plus à voir, et à trouver sans objet.

### 4.5 Composer : désigner, puis déclarer

*Réécrit le 6 octobre pour deux passes du `TODO.md`, d'un seul tenant parce que toutes deux changent
la manière de fonder : la **passe F** — l'article se retient, puis se prend — et la **passe G** — le
joueur choisit la relation. Relu par l'auteur, puis codé, F puis G. Ce que la passe G a réécrit
ailleurs — §4.1, §4.2, §4.4, §4.6, §4.7, §4.8, §4.11 — l'a été et codé dans la foulée, avec ses trois
arbitrages (le pressentiment au choix vrai, les libellés de relation, le CONTEXTE qui reste) : **à
relire par l'auteur**.* *Puis le 7 octobre, la **passe J** : l'article ne se livre plus, il se
cherche, puis se prend — réécrit ici, au §3, §4.6, §4.8, §4.9, §4.11, §6, §7 et §8, puis au §11 et au
§15 — relu par l'auteur, puis codé le même jour ; le §16 et la carte (§17) ont suivi le code.*

- **La livraison** — la grammaire de comparaison est complète dès la première phrase ; aucun
  **article** n'arrive plus avec le dossier : il **se cherche** (passe J, ci-dessous), et rejoint le
  dossier une fois pris — un article étant une pièce et non une tournure.
- **Désigner, puis déclarer** — le joueur désigne *ces deux-là*, puis **déclare ce qui les lie**,
  puis l'appuie *sous ce texte*. Il choisit entre **les deux relations de leur dimension**, celles que
  le contenu déclare déjà : *une seule et même personne / pas la même personne*, *coïncident /
  précède*, *au même endroit / pas au même endroit*, *désignent la même chose / pas la même chose*,
  *sont égaux / d'un tout autre ordre*. Retour de playtest (Bérengère), tranché par l'auteur le 6
  octobre : le moteur rédigeait la relation seul — poser T-14 et T-14 faisait paraître *« sont une
  seule et même personne »* —, et l'écran disait la trouvaille à la place du joueur. La relation
  devient **une thèse du joueur**, que le moteur **vérifie** sur les valeurs au lieu de la rédiger ;
  il ne tranche toujours aucune question de droit.
- **La vérification** — (1) même dimension, sinon rien à comparer — **le seul refus d'écran qui
  existe, et en session 1 seulement** : ensuite, les deux passages se juxtaposent et l'avocat refuse
  (§4.11) ; deux dimensions différentes n'ont aucune relation à offrir, et la juxtaposition s'y
  pose d'elle-même, sans choix ; (2) égales → *la même chose* ; (3) différentes en dimension d'écart → l'**ordre** ; (4) différentes en identité →
  *pas la même chose*. Ambiguïté → la **première forme déclarée** dont le prédicat tient. Le moteur
  range les termes d'une dimension d'écart par valeur, si bien que *« précède »* est vrai dès que deux
  heures diffèrent — **gardé** : le choix reste à deux, *« 22h30 précède 22h04 »* n'en devient pas
  une troisième. Les deux relations offertes sont, pour la dimension, la **première forme déclarée**
  de chaque côté — égalité, puis différence ou ordre ; la vraie est celle que le moteur aurait
  rédigée. La relation de la phrase est celle que le joueur a choisie : vraie, ou fausse.
- **Une relation fausse part, et l'avocat la refuse — partout**, session 1 comprise : à deux
  relations, un refus d'écran donnerait l'autre. Sa réplique est la sienne, avec son escalade,
  distincte de *rien à comparer* (`rep_sans_rapport`) et de la comparaison nue (`rep_inutile`) ; la
  phrase ne sert aucune attente, n'entre pas en PLAIDOIRIE, ne lève aucun drapeau. **Écartés en
  tranchant** : *conforme / non conforme* et *concordent / ne concordent pas* — le vice **est** une
  concordance, conforme entre ses deux passages et non à l'article 7 ; deux personnes ne *concordent*
  pas ; et deux heures ne se jugent pas sur leurs valeurs (21h52 et 22h04 diffèrent, et concordent).
  *Trois relations ou plus, dont des fausses* (Jean) : du contenu à écrire, et une devinette.
- **Les deux régimes** — *un fait se cite, une relation se fonde* : un empan est déjà une déclaration
  attribuée, un rapport entre deux faits n'est l'affirmation d'aucun témoin — c'est celle du joueur,
  qui la déclare.
- **L'invariant mord au versement**, plus à la clôture : la grammaire laisse partir une comparaison
  nue, **Maître Auber** la refuse (*« Et donc ? »*) et elle ne sert aucune attente. **Rien n'est
  *plaidé* qui ne soit fondé** ; le refus reste de l'agacement d'avocat, jamais un reproche (§8.4).
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
  de la passe F avant lui. Jean voulait ce nom sur le bouton (6 octobre) : il se lit comme un choix,
  et force à lire l'article. On choisit un texte, la phrase dit ce qu'il en fait.
- **L'article se cherche, puis se prend (passe J)** — demande de l'auteur, le 7 octobre : l'IA a
  accès à une base de textes, à la manière de Légifrance, et c'est elle qui cherche ; l'avocat ne
  transmet plus d'article. C'est le **RAG** du jeu : *on augmente sa réponse par une recherche*. La
  relation choisie, le composeur offre ***« Chercher un article correspondant »*** ; la recherche
  rend **trois articles**, dans le CONTEXTE (§4.6), et le joueur choisit en lisant — un léger QCM.
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
  regarde un pas en avant et annonce la comparaison ; le **CONTEXTE** s'assombrit **par dimension**
  (§4.3), jamais empan par empan — **en session 1 seulement**, comme le refus qu'il annonce
  (§4.11) ; l'article **se cherche** à part des passages (§4.6). **La pièce, elle, ne
  s'assombrit jamais**, même depuis que son clic prend (passe H, §4.6) : son marquage ne varie pas
  (§4.3), et un passage d'une autre dimension, cliqué en second terme en session 1, reçoit le refus
  que sa fiche aurait reçu — retenu quand même.

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout** : **DISCUSSION**, **CONTEXTE**, **PLAIDOIRIE**. Une seule frontière
de registre subsiste, voulue : **`empan` (code) / « passage » (écran)**, qui protège la fiction (§8.6).

| Surface | Statut | Rôle |
|---|---|---|
| La **DISCUSSION** + les pièces — *la bande du haut* | lecture | l'entrée |
| Le **CONTEXTE** — *panneau, au milieu* | **privé** | le dossier — pièces reçues, articles trouvés —, la recherche, les passages retenus (`S.retenus`) — jamais jugés |
| La **PLAIDOIRIE** — *panneau, au milieu* | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |
| **Le composeur** — *bandeau du bas* | **privé** | la phrase qu'on écrit — jamais jugée |

- **Un empan retenu n'existe qu'une fois à l'écran** : les puces du contexte **sont** les boutons de
  terme — et, dans la pièce, le passage lui-même (passe H, ci-dessous). Le composeur ne porte aucune
  étiquette « privé » — son statut se lit dans ce qui s'y passe.
- **La recherche s'affiche dans le CONTEXTE** (passe J, §4.5) — demande de l'auteur : pas au
  composeur, où seul le bouton qui la lance se tient. **Elle ne se lance pas depuis le CONTEXTE** :
  elle part de la paire posée, et la paire vit dans la phrase — l'y désigner une seconde fois
  serait un geste de trop. Une zone à elle, **RECHERCHE**, sous l'index :
  trois entrées, chacune le **nom neutre** de l'article (*« Article 7 »*) et le début de son texte —
  jamais son titre, qui dirait ce qu'il régit. Une entrée s'ouvre comme une puce de l'index : la
  pièce paraît, on la lit, un clic sur son texte prend l'article. Sans couleur ni trait : la
  dimension ne se dit pas. La zone vit **le temps de la phrase** : elle s'efface quand la phrase
  part, ou qu'on la défait en deçà de la relation. *La fiche d'article de la passe F et son groupe
  ARTICLES s'en vont* : on ne retient plus un article — ce qu'on a trouvé est **au dossier**, dans
  la colonne des règles de l'index. Un article ouvert alors que la phrase n'en attend pas ne se
  prend pas, et la ligne sous la pièce dit pourquoi : *un article fonde une relation entre deux
  passages*.
- **Deux verbes, partout** : on **retient** un passage — de la pièce vers le CONTEXTE — et on le
  **prend** — vers la phrase. *Sélectionner* ne paraît plus à l'écran : il servait aux deux, et un
  joueur a lu trois verbes là où il n'y a que deux gestes. **Un article, lui, se cherche et se
  prend** (passe J) : il n'est jamais retenu.
- **Et dans la pièce, un seul clic fait les deux (passe H)** — demande de l'auteur, pour réduire le
  nombre de gestes. Cliquer un passage le **retient**, toujours, et le **prend** si la phrase attend
  un passage ; cliquer le texte d'un article fonde la phrase qui attend un article, et le range au
  dossier — il ne le retient pas (passe J).
  Sinon, il est seulement retenu, comme avant. **La fiche reste le clavier** de ce qu'on a
  rassemblé : on y prend ce qu'on a retenu plus tôt, sans rouvrir de pièce. Le compte, sur l'affaire
  du jour et **l'envoi compris** : citer passe de cinq gestes à quatre — le bouton de pièces, la
  pièce, le passage, l'envoi ; la fiche tombe —, comparer sous l'article 3 de dix à sept, le vice
  trouvé en lisant de treize à dix — chaque fois les *prendre* qui suivaient un *retenir*, un par
  passage et un pour l'article. Le vice composé depuis des passages déjà rassemblés reste à cinq.
  *La passe J ajoute un geste — chercher — à toute phrase qui fonde sur un article pas encore au
  dossier.*
  **Se passer du CONTEXTE** — envisagé d'abord — aurait fait le même gain sur le chemin direct, et
  coûté le double dès qu'on rassemble : essayer des paires parmi les doublons de `qui` (§4.4) se fait
  depuis les fiches, sans rouvrir une pièce à chaque essai.
  - **Le clic fait ce que ferait la fiche juste après, rien de plus** : le refus de catégorie en
    session 1, la juxtaposition qui se pose d'elle-même ensuite (§4.11), la relation à choisir, les
    drapeaux (§4.7). Aucun cas nouveau, aucun état neuf. **Le passage n'en change pas d'aspect** : ce
    que son clic va faire dépend de la phrase, son marquage jamais (§4.3) — il n'est ni grisé ni
    refusé, et en session 1 l'assombrissement reste sur les fiches.
  - **Recliquer un passage retenu le prend**, si la phrase l'attend et qu'il n'y est pas déjà : la
    pièce est un clavier, elle aussi, et *la pièce n'ajoute que* (§4.3) reste vrai. Déjà dans la
    phrase, il n'y retourne pas — en second terme, il serait refusé : le même passage deux fois ne
    se compare pas — et la ligne sous la pièce le dit.
  - **L'article, d'un clic** : quand la comparaison du vice attend son article, cliquer le texte de
    l'article 7 — ouvert depuis la recherche ou le dossier — lève `vice_trouve`. La phrase
    entière est sous les yeux, au composeur : rien ne s'assemble à l'insu du joueur.
  - **Le prix, à regarder en jeu** : qui rassemble en lisant voit ses premiers clics former une
    phrase — en session 2, souvent une juxtaposition. Rien ne part sans *« → Envoyer »*, et
    *« ← retirer »* ou *« tout effacer »* défont la phrase sans rien ôter au CONTEXTE. En session 1,
    le tutoriel montre *« ← retirer »* quand un passage posé n'est pas celui qu'on demande (§4.8).
    **Écarté** : ne poser un second terme depuis la pièce que s'il est de la même dimension que le
    premier — ce serait un refus d'écran hors session 1, contraire au §4.11.

  *Arbitrages proposés le 6 octobre, écrits et codés dans la foulée — à relire par l'auteur.*
- **Les surfaces de côté — CONTEXTE et PLAIDOIRIE — partagent une même place LATÉRALE, un seul
  occupant à la fois**, et **ne recouvrent rien** : la conversation **cède pour lui faire place**. La
  pièce ouverte n'est plus un troisième occupant : **elle s'ouvre DANS le CONTEXTE** (ci-dessous). **En dessous d'un seuil de largeur** (l'essentiel des téléphones), la place latérale
  s'ouvre ENTRE la conversation et le composeur, empilée — l'écran montre alors ses trois temps d'un
  coup, de haut en bas : *ce qu'on me demande*, *ce dont je dispose*, *ce que j'écris*. **Au-dessus du
  seuil**, elle devient une colonne À CÔTÉ de la conversation plutôt qu'en dessous : la conversation
  cède de la largeur, pas de la hauteur, et la question reste sous les yeux même pièce ouverte (§4.9
  règle 3 ne mord alors plus que par surcroît). Trois portes y mènent, et ce sont trois registres : **la
  voix du composeur enseigne** — elle dit le geste et ouvre le CONTEXTE —, **la barre nomme** les deux
  panneaux, donne leur compte et y donne accès à tout moment, et **la DISCUSSION renvoie** — un message
  qui remet des pièces ne porte plus qu'un bouton unique vers le CONTEXTE, où chacune s'ouvre à son
  tour, comme un panneau ouvert par la barre : on la consulte, on ne la referme pas pour elle. Les
  portes **tranchent sur le fond** : ce sont des outils, pas des étiquettes.
- **La remise et sa première question ne font qu'UN message, les pièces APRÈS la question** —
  demande de l'auteur, et la friction de Colas, qui ouvrait les pièces sans avoir lu la question
  posée dessous. Dans le fil, deux bulles : le texte et le bouton de pièces, puis la question — on
  recevait avant de savoir ce qu'on cherchait. Désormais le message de remise porte sa question, et
  le bouton ferme la bulle : on lit ce qu'il demande, puis on va chercher. La question reste un champ
  de l'**attente**, jamais du texte de la remise : c'est ce qui permet de la rappeler (§4.9 règle 3).
  Les questions suivantes, posées après une réponse, restent des messages à part.
  **Le bouton sépare comme l'index** — retour de playtest (Jean) : le message annonçait *« 5 pièces
  disponibles »*, pièces et règles confondues, quand l'index disait *« 5 pièces, 3 règles »* pour le
  dossier entier. Même chiffre, deux sens. Le bouton dit donc **les pièces et les règles à part**,
  avec les mots des deux colonnes de l'index, et dès le deuxième envoi il dit **nouvelles** : le
  message compte ce qu'il apporte. *Depuis la passe J, aucune remise ne livre d'article* : le
  bouton ne compte plus que des pièces, et la colonne des règles de l'index se remplit des articles
  trouvés. **L'index, lui, ne compte plus** — demande de l'auteur : son
  en-tête ne dit que **DOSSIER**, replié comme déplié ; ses deux colonnes se comptent à l'œil.
- **LA PIÈCE S'OUVRE DANS LE CONTEXTE, entre l'index et les passages retenus** — retour de playtest
  (Colas), et idée de l'auteur. Tant que la pièce occupait seule la place latérale, citer coûtait
  cinq temps : ouvrir la pièce, retenir, **refermer la pièce**, rouvrir le CONTEXTE, prendre. Le
  troisième n'enseignait rien — il ne servait qu'à faire revenir le CONTEXTE que la pièce avait
  chassé. Désormais **lire, retenir et prendre ont lieu sous les yeux l'un de l'autre** : on retient
  dans la pièce, le passage paraît aussitôt plus bas dans le même panneau, on le prend sans rien
  fermer — et depuis la passe H, le clic qui retient prend aussi, quand la phrase l'attend. Le
  CONTEXTE ouvert avec une pièce se lit de haut en bas : **l'index** (on choisit), **la pièce** (on
  lit, on retient — et on prend), **les retenus** (on prend ce qu'on a rassemblé). Trois règles le
  tiennent :
  - **Deux bandes qui défilent chacune pour son compte**, la pièce au-dessus, les retenus en dessous :
    une pièce longue ne pousse jamais les retenus hors du panneau, et dix-sept fiches ne poussent
    jamais la pièce. **La pièce prend la hauteur de son texte, jusqu'à un plafond ; les retenus,
    tout le reste** — demande de l'auteur : une pièce courte laissait du papier vide pendant que les
    retenus, plafonnés, défilaient dessous. Une pièce longue s'arrête au plafond et défile ; à
    dix-sept fiches, ce sont les retenus qui défilent. **Au-dessus du seuil, le CONTEXTE prend les DEUX
    TIERS de la largeur**, pièce ouverte ou non — demande de l'auteur : index, pièce et retenus se
    lisaient à l'étroit dans une colonne d'un tiers. La conversation garde le tiers restant, et la
    question avec elle ; la PLAIDOIRIE, qui ne porte qu'une liste, garde sa colonne étroite. **En
    dessous**, si le panneau est trop bas pour les deux bandes, il redéfile d'un bloc plutôt que de
    rogner.
  - **L'index se REPLIE en une ligne** — *le dossier, son compte* — et il laisse ainsi la place au
    reste. Retour de playtest (Jean), puis de l'auteur : déplié, à huit pièces et une puce par
    ligne, il prenait la moitié du panneau ; la pièce n'y montrait plus que deux lignes, et sur un
    téléphone plus rien. **Une bascule le replie ou le déplie à tout moment.** Une pièce ouverte le
    replie d'elle-même ; on le déplie pour en choisir une autre, qui le replie à son tour ; la pièce
    repliée, il revient à ce que le joueur avait choisi. **Le bouton de pièces du message le
    déplie** : on vient voir ce qu'on a reçu. **Replier n'est pas juger** (§4.6) : ce sont des
    pièces, pas des passages, et rien n'en est retiré. Il ne colle pas (le PIÈGE ci-dessus), et
    reste l'ancre du tutoriel, replié ou non.
  - **Changer de pièce coûte un clic** — retour de playtest (Jean) : l'index replié, passer d'une
    pièce à l'autre en coûtait deux (déplier, choisir), dans un chapitre qui consiste à croiser huit
    documents. La tête de la pièce porte donc **‹ et ›**, la précédente et la suivante **dans l'ordre
    de l'index** (les pièces, puis les règles, en boucle) ; chacune se nomme à qui ne voit pas la
    flèche. L'index reste replié : la place de lecture gagnée ne se reperd pas, et il reste là pour
    sauter loin. Une rangée d'onglets a été écartée : huit titres entiers ne tiennent pas sur une
    ligne, et des titres abrégés referaient deux noms pour une pièce (ci-dessous).
  - **Une seule pièce à la fois** : un autre chip de l'index la remplace ; la croix de la pièce la
    replie et rend toute la hauteur aux retenus ; refermer le CONTEXTE la replie avec lui. Une pièce
    n'est **jamais** ouverte hors du CONTEXTE — l'ouvrir ouvre le CONTEXTE, en consultation (il ne se
    referme pas tout seul, comme ouvert par la barre).
  - **La réplique `declenche` part quand la pièce quitte l'écran** — repliée, remplacée, ou le
    CONTEXTE refermé —, plus seulement à la croix : c'est toujours le moment où l'on relève les yeux
    (§4.10 règle 3).
  La matière ne change pas : la pièce garde son **papier** au milieu de l'écran du CONTEXTE (deux
  matières, ci-dessous) — c'est même ce qui la détache de l'index et des retenus qui l'encadrent.
- **Le CONTEXTE dit l'état de la phrase** — retour de playtest (Jean). Un passage **déjà pris**
  porte *« dans ta RÉPONSE »* : on voit ce qu'on a posé là où on l'a pris. Et quand la phrase ne
  prend plus de passage, **le CONTEXTE le dit, en une ligne** — *« Ta RÉPONSE ne prend plus de
  passage »*, avec le geste qui la rouvre — au lieu d'un bouton seulement grisé dont la raison
  vivait dans un `title`, que ni le toucher ni le clavier n'atteignent (§4.10). Les fiches restent
  atteignables, et les toucher redit la raison. Ce n'est pas une seconde voix : la voix dit le geste
  suivant, la ligne dit pourquoi celui-ci ne mène nulle part. **Et une fiche déjà dans la phrase ne
  s'y pose pas deux fois** (passe H) : tant que la phrase prend encore un passage, la toucher dit
  *« déjà dans ta RÉPONSE »*, et comment revenir en arrière — comme le même passage recliqué dans la
  pièce —, au lieu du refus d'une phrase *« qui ne veut rien dire »*, un reproche pour un geste de
  lecture. Refusée, pas désactivée, comme les autres (§4.10 règle 5) ; la phrase pleine, c'est la
  ligne ci-dessus qui parle. La pièce, l'étiquette *« dans ta RÉPONSE »* et ce refus lisent la même
  chose : ce qui est dans la phrase. **À l'écran, la phrase s'appelle *ta RÉPONSE*** — le titre du composeur, en
  capitales comme le CONTEXTE (passe I, *auteur*) ; le document et le code gardent *la phrase*.
- **On ne purge pas le CONTEXTE entre deux remises** — retour de playtest (Bérengère), tranché par
  l'auteur le 6 octobre. Le 5, pour répondre à Jean (*en session 2, les fiches de la session 1
  restent en tête*), les passages d'une remise close passaient sous ceux de la remise en cours,
  repliés en une ligne *« 1ʳᵉ remise, close »* : rien n'était retiré, mais le CONTEXTE se vidait à
  chaque remise. **C'est défait** : tous les passages retenus restent à plat, rangés par dimension,
  et *aucune barrière entre les affaires* tient toujours (§3 de `docs/PASSATION.md`). Ce que ça
  rouvre, c'est la gêne de Jean. Si elle remord en jeu — et seulement alors —, un repli qui ne dise
  pas *remise* : le plus récent en tête de chaque dimension.
- **La colonne tient dans la fenêtre** : la page ne défile pas, chaque bande défile pour son compte.
  **En dessous du seuil**, la conversation est **la seule bande élastique EN HAUTEUR** — c'est elle qui
  cède quand la place latérale s'ouvre ou que la phrase s'allonge, et *« → Envoyer »* ne passe donc
  jamais sous le pli, même sur un portable bas. **Au-dessus**, c'est sa LARGEUR qui cède ; sa hauteur ne
  se discute plus avec le composeur, qui occupe son propre bandeau en pleine largeur.
- **Cliquer DISCUSSION agrandit la conversation** — retour de playtest (Bérengère, 6 octobre) : le
  CONTEXTE ouvert ne lui laisse qu'un tiers de la largeur au-dessus du seuil, et son en-tête n'avait
  aucune action. Il devient une **bascule** (*agrandir*, `aria-pressed`) qui n'existe que
  **CONTEXTE ouvert** : fermé, la conversation a déjà toute la place, et un bouton qui ne ferait
  rien n'a pas à s'afficher (§4.9 règle 4). **Au-dessus du seuil**, les deux colonnes échangent
  leurs parts — deux tiers pour la conversation, un pour le CONTEXTE ; **en dessous**, le panneau
  descend à son plancher (ci-dessous : il montre encore deux fiches) et la conversation prend le
  reste. Un second clic rend la place. Seul le gabarit change, jamais un span (§17 ARCHITECTURE).
  C'est un état d'**écran**, comme le repli de l'index : jamais sauvé, et oublié dès que le
  CONTEXTE se referme. **Ouvrir une pièce depuis l'index rend la place au CONTEXTE**, comme elle
  replie l'index : lire une pièce dans un tiers, c'est le défaut que les deux tiers réparaient. **‹
  et ›**, qui changent de pièce sans rien rouvrir, ne touchent ni à l'un ni à l'autre. La
  PLAIDOIRIE n'a pas de bascule : sa colonne est déjà étroite. *Arbitrages pris le 6 octobre pour
  avancer — à relire par l'auteur.*
- **Mais « élastique » n'est pas « compressible à zéro », et L'ORDRE DANS LEQUEL LES BANDES CÈDENT
  est une règle — À TOUTES LES LARGEURS** : au-dessus du seuil aussi, le composeur occupe une rangée
  sous la place latérale, et lui dispute la même verticale. Retour de playtest (Jean, 5 octobre) : à
  1280×800, la réponse grandissait pendant la comparaison et écrasait le CONTEXTE, pièce coupée — la
  règle, écrite pour le seul empilement, ne mordait pas là. Le panneau a cédé devant le composeur jusqu'à **disparaître** —
  à deux passages retenus, un joueur ne voyait plus le haut d'une seule fiche ; à la fin, plus rien. Or
  le panneau **est le clavier** (§4.6) : le vider pendant qu'on écrit retire le clavier au milieu du
  geste, exactement ce que la fermeture automatique s'interdit déjà. Donc : **le panneau a un plancher**
  qui montre au moins deux fiches entières, **le composeur un plafond** — il défile pour son propre
  compte —, et la conversation reste la seule à céder librement, puisque la question est redescendue
  au composeur (§4.9 règle 3). **Et l'index du dossier ne colle pas** : il a été rendu collant pour
  qu'il ne parte pas hors champ, et il a occupé le panneau en permanence — à trois lignes, la moitié.
  Il défile avec les fiches. **Au-dessus du seuil, la place latérale reçoit la hauteur de la
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
  CONTEXTE, il reste ; et depuis que l'article s'y prend (passes F et J), il reste aussi jusqu'à ce qu'on
  l'ait pris — **y compris pendant le choix de la relation** (passe G), qui a lieu au composeur :
  le refermer là pour le faire rouvrir à l'article, ce serait la friction de Jean une fois de plus.
  *Depuis la passe H, cette fermeture se fait rare* : on compose d'ordinaire dans la pièce, et ouvrir
  une pièce fait passer le CONTEXTE en consultation (ci-dessus) — elle ne joue plus que pour une
  phrase prise aux fiches. **Ouvert pour CONSULTER** (par la barre),
  il reste jusqu'à ce qu'on le ferme — regarder n'est pas écrire. La nuance de la première n'est pas un
  détail : un passage posé, la voix se tait parce que la phrase se tient, mais **la grammaire ne sait
  pas encore** si le joueur cite ou entame une comparaison (§4.5). Refermer là retirerait le clavier au
  milieu du geste le plus difficile du jeu.
  **Envoyer ne referme le CONTEXTE que si la remise change** — retour de playtest (Jean, trois
  sessions de suite : *« tout se referme après chaque envoi »*). Tant que la remise attend encore une
  réponse — la question suivante, ou la même après un refus —, on aura besoin du clavier : le CONTEXTE
  reste, en consultation, quelle que soit la porte qui l'avait ouvert. Quand l'envoi ouvre une
  nouvelle remise, il se referme : un nouveau dossier arrive, on revient lire l'avocat, et son bouton
  de pièces rouvrira le CONTEXTE. La PLAIDOIRIE, elle, se referme à chaque envoi : on n'y écrit pas.
- **Une pièce porte un seul nom, et l'index du CONTEXTE est désormais seul à le porter** : la DISCUSSION
  n'annonce plus qu'un nombre de pièces reçues et renvoie vers lui. Le nom court ne survit que dans la
  **provenance** d'un passage retenu et dans la phrase composée — là, il *référence*, il ne *nomme* pas.
- **On écrit sa réponse sous la question** : le clavier est dans le CONTEXTE, la phrase s'écrit sous la
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
- **L'avocat ne voit que la PLAIDOIRIE**, d'où la gratuité du CONTEXTE. Il **ne retient que les
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

### 4.7 Les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur, sa vraie relation choisie** — avant tout article | privée |
| `vice_trouve` | la conclusion **s'assemble au composeur** : comparaison-vice qualifiée par un article | privée |
| `vice_expose` | cette conclusion est **envoyée** | transmise |

C'est l'intervalle entre l'**assemblage** et l'**envoi**, si court soit-il, qui porte la Fin 2. **Une
citation ne lève aucun drapeau** — les trois dérivent de la comparaison du **vice**, absente de la
session 1. **Pressentir ne produit rien** : qui comprend et vide son composeur a la Fin 3 au bout.
**Poser n'est pas encore comprendre** (passe G, arbitré par l'auteur) : les deux passages du vice
côte à côte ne lèvent rien ; c'est **choisir** *« une seule et même personne »* qui le lève, et
choisir l'autre relation ne lève aucun drapeau.

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
| **citer** | 1 | ce qu'on reçoit se retrouve dans le CONTEXTE | l'index, une fois le CONTEXTE ouvert — **avant, rien** : le bouton de pièces du message s'ouvre seul |
| | 2 | un passage se clique : il se retient, et entre dans la phrase (passe H, §4.6) | **le texte de la pièce**, en entier — ouverte dans le CONTEXTE, plus rien à refermer (§4.6) |
| | 3 | ce qu'on retient est aussi le clavier — *s'il est retenu sans être dans la phrase* | **toute la zone des retenus**, juste sous la pièce, jamais une puce |
| | — | *rien ne part tant qu'on n'envoie pas* | **rien** : *« → Envoyer »*, seul bouton plein, se montre seul |
| **mettre en relation** — *les passages* | 1 | une réponse peut tenir sur **deux** passages, et chacun se clique comme pour citer : le premier entre dans la phrase, le second l'y rejoint | l'index, puis **le texte de la pièce** — tant que les deux passages attendus ne sont pas retenus, jamais l'empan ; la porte CONTEXTE s'il est fermé |
| | 2 | les deux se prennent, l'un puis l'autre — *s'ils sont retenus sans être dans la phrase* | **toute la zone des retenus**, au premier passage comme au second |
| — *la relation* | 3 | deux passages ne disent pas ce qui les lie : on le **déclare** (§4.5, passe G) | **les deux relations**, dans les propositions du composeur — toute la zone, jamais la bonne |
| — *l'article* | 4 | une relation seule ne suffit pas : on **cherche** l'article qui la fonde (§4.5, passe J) — *s'il n'est pas déjà au dossier* | ***« Chercher un article correspondant »***, au composeur |
| | 5 | la recherche rend trois textes : on les ouvre, on choisit en lisant | **toute la zone RECHERCHE**, dans le CONTEXTE — jamais le bon ; la porte CONTEXTE s'il est fermé |
| | 6 | un clic sur le texte de l'article ouvert le prend, comme un passage | **son texte**, quel qu'il soit : le halo désigne le geste, jamais le choix |
| | — | *le même envoi qu'au premier geste* | **rien**, pour la même raison |
| **aux deux gestes** | ! | un passage posé que la question ne demande pas se retire — *une alerte* (passe H) | ***« ← retirer »***, au composeur — le geste qui défait, jamais le passage qu'il fallait |

**Mettre en relation, en trois temps** (passe J) — demande de l'auteur : la bulle mêlait sous une
même consigne les passages, la relation et l'article. Maître Auber pose **une** question, la
« grosse », qui demande tout ; le tutoriel la découpe — **les deux passages, puis la relation, puis
l'article** —, une bulle par temps, et chacune attend son geste avant de passer. **Il ne bloque
rien** — il ne décide rien (ci-dessous) : c'est la **remise** de calibration qui ne laisse pas
partir une comparaison nue (§4.11 point 6). Sans le tutoriel, la question seule.

**Retenir se montre aux deux gestes** — retour de playtest (Bérengère). Les deux heures n'étant plus
extraites d'avance par deux questions (§3), la comparaison commence par les chercher : le halo va à
l'index, puis au texte de la pièce, comme pour citer, et ne passe aux retenus que les deux passages
attendus retenus **sans être dans la phrase** — depuis la passe H, le clic qui les retient les y pose,
et la bulle passe d'ordinaire droit aux relations. Elle dit donc *clique*, et non plus *retiens* :
elle nomme le geste que fait le joueur, qui désormais retient et pose. Il ne désigne jamais l'empan ; la bulle nomme
la pièce demandée, que la question nomme déjà. **Une pièce ouverte qui ne porte aucun passage attendu renvoie à l'index**, aux deux
gestes — arbitré par l'auteur : la comparaison court sur deux pièces, et le premier passage retenu,
la pièce encore ouverte, le halo serait resté sur un texte où il n'y a plus rien à chercher.
L'index replié — une pièce ouverte le replie —, le halo l'entoure tel quel et la bulle dit de le
déplier : la zone, toujours, pas le bouton. **L'alerte se dérive du dernier passage retenu** : ni
attendu, ni cité par une réponse déjà servie — sans quoi le passage de la citation, retenu pour la
première question, sonnerait faux à la seconde.

**Un passage posé à tort se retire d'abord** (passe H, §4.6). Depuis que le clic prend, un mauvais
passage ne reste plus au CONTEXTE : il entre dans la phrase, et le bon, cliqué ensuite, deviendrait
son second terme — refusé en session 1 s'il n'est pas de la même dimension, ou le début d'une
comparaison qu'on n'a pas voulue. Tant que la phrase porte un passage que la question ne demande pas,
la bulle le dit — *« Ce n'est pas ce qu'il demande »*, ce qu'elle disait déjà d'un passage retenu à
tort, donc rien qu'elle ne sût — et le halo va à *« ← retirer »*, qui l'ôte de la phrase sans l'ôter
du CONTEXTE. Ce temps passe **avant** tous les autres : chercher le bon passage tant que la phrase
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
pour cliquer — et toute la zone des retenus pour prendre ce qui y attend —, puis **les deux
relations ensemble** pour choisir (passe G) — la bonne n'est jamais désignée, et un mauvais choix
n'est pas signalé : c'est Maître Auber qui le refuse, après l'envoi. Plus que jamais, *la relation
jamais*. **L'article était l'exception** : la remise de calibration n'en livrait qu'un, et désigner
sa puce ne choisissait rien. Depuis qu'il se cherche, la recherche en rend trois : le halo entoure le
bouton qui cherche, puis **les trois résultats ensemble**, puis le texte de celui qu'on a ouvert,
quel qu'il soit — comme les relations. Un mauvais article part, et l'avocat le refuse. La
désignation se **dérive** du lien attendu (le bloc de liaison qui l'emboîte), jamais d'un nom câblé ;
la *limite assumée* d'une session 1 à plusieurs articles tombe avec l'exception.

**Les garde-fous ne sont pas le tutoriel** : le refus d'écran et l'assombrissement du CONTEXTE
vivent pendant la **remise** de calibration, que le tutoriel soit là ou non — sa croix ne
lève rien, puisque le tutoriel ne décide rien (§4.11).

**Le halo entoure la zone, jamais le bon empan** (§4.3). **Il corrige, il n'empêche pas** : rien n'est
refusé, il ne dit jamais lequel c'était, et la dérivation par laquelle il sait ce qu'attend la question
**s'éteint avec lui**. **Il ne décide rien** — aucun état neuf, aucune règle, et il peut se taire.

**Il se tait là où l'écran parle seul** — demande de l'auteur. Ni *« Ouvre ton CONTEXTE »* au premier
écran : le message de l'avocat finit sur le bouton de pièces, qui dit déjà où elles sont ; ni
*« Clique sur → Envoyer »* : la phrase qui se tient allume le seul bouton plein de l'écran (§4.9). Le
tutoriel commence donc au CONTEXTE ouvert, et une phrase complète le fait taire jusqu'à l'envoi.
*« Ouvre ton CONTEXTE »* survit là où la porte n'est plus évidente — un passage retenu puis le panneau
refermé, ou la comparaison demandée panneau fermé.

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
(Jean, 5 octobre) : posée au premier côté libre, elle cachait la confirmation *« ✓ Retenu »*, la raison
d'une phrase pleine, l'aide du CONTEXTE, *« ← retirer / tout effacer »*. Sur chaque côté, elle essaie
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
   CONTEXTE et l'ouvre ; elle reste du texte quand le geste a lieu ici même — envoyer, et choisir
   la relation (§4.5). **Chercher un article est un bouton du composeur** (passe J) : la relation
   choisie, *« Chercher un article correspondant »* tient lieu de voix et ouvre le CONTEXTE sur ses
   résultats ; quand le dossier tient déjà un article, la voix dit aussi qu'on peut l'y prendre. **Et depuis que le clic dans la pièce
   prend aussi (passe H, §4.6), elle nomme les deux chemins d'un passage** — une pièce, ou les
   fiches du CONTEXTE — et, pour un article, son texte à cliquer. Un bouton ne promet ainsi jamais un effet qu'il ne produit pas (§4.5). Cliquable, elle a
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
   d'écran le présente comme tel. Les pièces jointes, les puces du dossier et celles du CONTEXTE sont
   de vrais boutons. **Les passages restent de la prose** : un bouton ne sait pas se couper en fin de
   ligne, et un passage long sauterait à la ligne d'un bloc. Ils se *déclarent* boutons sans en être.
2. **Le focus survit au redessin** : l'écran se redessine à chaque geste, le joueur au clavier reste
   pourtant où il était — sur le même passage, la même puce —, et si la chose a disparu, dans la même
   zone.
3. **La pièce ouverte vit DANS le CONTEXTE** (§4.6) : le jeu autour reste vivant — composeur,
   conversation et passages retenus restent atteignables pendant qu'elle est ouverte, ce qui permet de
   relire la question sans la fermer. Le focus entre dans la pièce à l'ouverture et revient, quand on
   la replie, au chip de l'index qui l'a ouverte — par CLÉ, comme pour tout panneau. Échap replie
   d'abord la pièce, puis, au second appui, referme le CONTEXTE. L'ordre de tabulation suit l'ordre de
   lecture : index, pièce, retenus. Elle n'a jamais
   été, et n'est toujours pas, un `<dialog>` natif : la question ne s'est jamais posée, puisqu'elle n'a
   plus rien d'une boîte modale.
4. **Ce qui arrive s'annonce** : une réplique de l'avocat, une consigne du tutoriel, un refus — et ce
   qu'un clic sur un passage a fait, *retenu* ou *retenu et posé* (passe H, §4.6) — par une
   voix d'annonce unique, jamais par le fil entier, qui se réécrit à chaque geste et se relirait
   d'un bout à l'autre.
5. **Rien ne se dit par la couleur seule** (§4.3), ni par une transparence qui éteint le contraste : un
   état s'écrit (✓, « retenu ») ou se colore franchement. Une pièce déjà lue porte un ✓, elle n'est pas
   grisée comme un bouton désactivé. **Et un refus se dit à l'écran, jamais dans un `title`** : un
   `title` n'existe ni au clavier ni au toucher, et un bouton `disabled` ne se laisse même plus
   atteindre pour demander pourquoi (§4.6, *le CONTEXTE dit l'état de la phrase*).
6. **Aucune confirmation ne se retire d'elle-même** : elle attend qu'on réponde. Et **Échap se lit à
   l'écran**, là où il agit — sur la croix de la pièce et sur celle des panneaux — **et seulement là** :
   pièce ouverte, Échap la replie, et la croix du CONTEXTE perd sa touche. Retour de playtest (Jean) :
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
   dans la tête du joueur. Le texte de l'article est désormais **encadré, sans un mot**, de la couleur
   de chaque dimension qu'il régit — celle qui nomme ses groupes dans le CONTEXTE — et de son **trait**
   (§4.3) : plein, double, pointillé, tirets, ondulé. Qui a appris le code le reconnaît ; qui ne l'a
   pas appris lit l'article. Un rappel, plus une étiquette. Le trait double la couleur, si bien que
   rien ne s'y dit par la couleur seule (§4.10 règle 5) ; un article qui régit deux dimensions porte
   **deux cadres**, l'un dans l'autre. À qui ne voit pas, le nom de la dimension, comme sur un
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
3. **Le CONTEXTE ne s'assombrit plus, hors session 1.** L'assombrissement par dimension (§4.5)
   annonçait le refus d'écran ; le refus levé, il annoncerait ce que l'avocat va dire. Le seul rappel
   qui reste est celui que la phrase porte déjà : **le premier passage posé garde sa couleur** au
   composeur.
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
   offre les deux relations de leur dimension ; la fausse **part**, et Maître Auber la refuse, par
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

## 6. L'affaire Kessler (le cas prototype)

- **Recevabilité, pas fiabilité** : le match ADN est accablant, et la fiabilité rouvrirait le doute sur
  la culpabilité — **à proscrire**. Le protocole violé est celui conçu contre les faux positifs :
  l'exclusion est légitime même si, cette fois, le match était vrai.
- **Le vice** : le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de
  référence, contre l'exigence de personnels séparés (article 7) — deux pièces où le même homme écrit
  qu'il l'a fait *lui-même*.
- **Le camouflage** : `brigadier N.` signe les deux pièces de la session 1, si bien que `qui` est
  peuplée de doublons réguliers *avant* qu'on sache qu'il faut la regarder (§4.4).
- **La première question demande qui a rédigé le PV** (§3), et **le passage qui répond nomme le
  brigadier** : *« par mes soins, brigadier N. »* — tranché par l'auteur le 6 octobre. Réduit à
  *« par mes soins »*, il obligeait à lire une signature en s'aidant de la tête de la pièce : c'est
  le geste même que le vice exigera (*« J'ai relevé moi-même les traces »*, §4.1), et l'apprendre
  pendant la calibration serait une lampe torche (§4.3). Le `nom` du passage, lui, reste sans
  valeur, comme tous les autres : la valeur vit dans la citation.
- **L'incohérence de la session 1 doit être une IMPOSSIBILITÉ, pas un simple décalage** : des éclats
  de voix à 22h30, après une patrouille arrivée à 22h04, se concilient très bien — un playtester
  l'a vu avant nous. C'est la **constatation** faite à 22h04, dans le PV, qui les rend impossibles :
  la victime est déjà sans vie, donc personne n'a pu l'entendre se disputer une demi-heure plus
  tard. L'article 3 mord alors exactement comme il est écrit — *des indications horaires contredites
  par les constatations des services* — et la prose seule le porte : **aucun empan neuf, aucune
  valeur touchée**. C'est le §8.7 appliqué : d'une banalité administrative parfaite.
- **Une lecture juste qui ne répond pas à la question reçoit sa réplique** — retour de playtest
  (Jean, 6 octobre) : l'appel de 21h52 avant les éclats de voix, ou les deux véhicules que le voisin
  voit en bas et les deux équipages du PV, sous l'article 3, recevaient *« Je ne vois pas où tu veux
  en venir »*. Ce sont de bons raisonnements, et un joueur qui raisonne juste ne doit pas apprendre
  que le jeu ne le comprend pas. Ce sont des **liens sans tag** : l'avocat dit *juste*, et ramène aux
  deux heures demandées — l'attente reste intacte, rien n'entre en PLAIDOIRIE.
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
| Recevabilité, pas fiabilité : la culpabilité est un plancher fixe | §6 |
| Le vice est un déblocage, jamais un verrou ; comprendre précède choisir | §2, §3 |
| La compréhension doit être *exprimée* ; saisie structurée, pas texte libre | §3, §4.5 |
| Un empan se lit deux fois ; le marquage ne varie jamais avec la pertinence | §4.1, §4.3 |
| Une dimension sans doublon désigne sa réponse ; la marge de bruit reste non nulle | §4.4, §14 |
| Rien n'est *plaidé* qui ne soit fondé ; on n'invoque pas un texte qu'on n'a pas lu | §4.5 |
| La recherche montre trois articles du champ de la paire — toute paire a les siens —, et ne trie rien de ce que la phrase accepte | §4.5 |
| Le joueur déclare la relation, le moteur la vérifie — jamais ne la rédige ; une relation fausse part, l'avocat la refuse | §4.5, §4.11 |
| Une clôture qui n'ajoute rien n'est pas un choix ; `imbrique` n'en est jamais une | §4.5 |
| Un article annonce, ne filtre rien, ne porte aucun empan qui se compare ; le moteur ne dit pas le droit, et seule la recherche lit `porte` | §4.5, §6 |
| La session 1 apprend, les suivantes laissent se tromper ; la frontière est la remise, jamais le tutoriel | §4.11 |
| L'erreur ne coûte que l'agacement de l'avocat : patience infinie, aucun compte à l'écran | §4.11, §8.4 |
| Un mécanisme utilisé une seule fois est un panneau indicateur — sauf le tutoriel | §4, §4.8 |
| Rien ne se passe tant que rien n'est envoyé ; composer et envoyer restent deux gestes | §4.6 |
| Le clic dans la pièce prend ce que la fiche prendrait, rien de plus ; le passage n'en change pas d'aspect | §4.3, §4.6 |
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

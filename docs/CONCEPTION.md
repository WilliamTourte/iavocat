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
compréhension. **Charnière de la Fin 3** : la dernière attente servie, l'IA *peut* clôturer et laisser
filer.

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
l'interface désignerait la réponse à la lampe torche. **La couleur code la dimension**, jamais la
pertinence.

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
- **L'article est le verbe** : la liaison *« …, en contradiction avec l'article 7 »* **est** la base
  légale, une par article — et **le moteur ne tranche aucune question de droit** : il ne lit ni le
  numéro ni `porte`. Le libellé a cessé d'être **neutre** le 16 septembre ; il annonce désormais la
  contradiction, donc une part du verdict. Point ouvert au §3 de `docs/PASSATION.md`.
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
| La **Discussion** + les pièces | lecture | l'entrée |
| **Le composeur** — *sous la Discussion* | **privé** | la phrase qu'on écrit — jamais jugée |
| Le **Contexte** | **privé** | le dossier et les empans retenus (`S.retenus`) — jamais jugés |
| La **Plaidoirie** | **transmis** | ce que l'avocat retient (`S.plaidoirie`) — hors écran (§4.9) |

- **Un empan retenu n'existe qu'une fois à l'écran** : les puces du contexte **sont** les boutons de
  terme. Le composeur ne porte aucune étiquette « privé » — son statut se lit dans ce qui s'y passe.
- **On écrit sa réponse sous la question** : le clavier reste dans le Contexte, la phrase s'écrit dans
  la Discussion. Arbitrage ouvert ; **le repli est de faire descendre les retenus, pas de remonter le
  composeur.**
- **Comprendre et dire restent deux gestes, non négociable** — l'intervalle sépare l'**assemblage** de
  l'**envoi** : c'est lui qui compte, pas le nombre de clics.
- **L'avocat ne voit que la Plaidoirie**, d'où la gratuité du Contexte. Il **ne retient que les
  moyens** et l'envoi est **irréversible** ; une citation versée étant au dossier, une réponse citée
  y entre.

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

| | Ce qu'on apprend | Ce que le halo entoure |
|---|---|---|
| 1 | une pièce s'ouvre | la pièce jointe, dans la Discussion |
| 2 | un passage se retient | **le texte de la pièce**, en entier (puis : refermer) |
| 3 | ce qu'on retient est le clavier | **toute la zone des retenus**, jamais une puce |
| 4 | rien ne part tant qu'on n'envoie pas | *« → Envoyer »*, dès que la phrase se tient |
| 5 | une comparaison prend **deux** passages qui se contredisent, pas un | **toute la zone des retenus**, au premier passage comme au second |
| 6 | la comparaison seule ne suffit pas : il lui faut un article qui la fonde | **la zone des propositions**, dans le composeur |

Le geste 5-6 partage l'étape 4 pour l'envoi — c'est le même bouton, la même leçon. **Ce qui distingue
les deux gestes** n'est pas un compteur de clics mais le **contenu** : une attente dont le lien attendu
emboîte une forme (une comparaison sous un article) plutôt qu'un simple empan. Le tutoriel le lit dans
`JEU.liens`, jamais dans un nom d'attente câblé en dur.

**Le halo entoure la zone, jamais le bon empan** (§4.3). **Il corrige, il n'empêche pas** : rien n'est
refusé, il ne dit jamais lequel c'était, et la dérivation par laquelle il sait ce qu'attend la question
**s'éteint avec lui**. **Il ne décide rien** — aucun état neuf, aucune règle, et il peut se taire — y
compris entre le geste 4 et le geste 5, le temps d'une citation déjà connue.

### 4.9 L'économie de l'écran

Quatre règles d'écran — le coupable d'une page illisible est le **chrome**, jamais la fiction :

1. **Une voix par état — et parfois aucune** : le geste suivant se dit une fois, dans le fantôme tant
   que la phrase est vide, dans l'aide ensuite ; si un bouton le dit déjà, l'aide se tait.
2. **Un titre par zone** : l'en-tête nomme la **surface** (§4.6), les titres intérieurs les zones.
3. **Ce qui ne change pas ne se répète pas** : le locuteur ne s'affiche qu'au changement, le rappel de
   la question seulement quand elle a cessé d'être le dernier mot de l'avocat.
4. **Ce qui n'existe pas encore ne s'affiche pas** : la Plaidoirie n'avait de colonne qu'une fois
   quelque chose inscrit dedans, et c'était son apparition qui l'enseignait. Elle est **escamotée
   depuis le 16 septembre** — la colonne ne s'affiche plus jamais, la mécanique intacte derrière
   (§17). L'écran ne porte donc plus que deux surfaces ; ce qui entre au plan ne se voit nulle part.

**La densité ne touche pas au sens** : une phrase de chrome se coupe parce qu'elle explique, une phrase
qui *est* le jeu reste. **Deux** ne se coupent pas : *« → Envoyer »* et *« Et donc ? »*. La troisième,
*« Tant que tu ne l'envoies pas, personne ne la lit. »*, a été coupée le 16 septembre : seul le
tutoriel porte encore la leçon, et une fois qu'il s'est tu, plus rien ne la redit. Point ouvert au
§3 de `docs/PASSATION.md`.

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

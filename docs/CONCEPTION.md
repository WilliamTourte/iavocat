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

**Retenir a lieu dans la pièce, retirer dans le Contexte.** Recliquer un passage déjà retenu ne
l'oublie pas — arbitré le 16 septembre, reconduit le 30 après un playtest qui attendait un
interrupteur — mais **l'écran le dit** : une ligne sous la pièce renvoie au Contexte. Un passage retenu
se marque **par son fond, jamais par sa graisse** : le texte autour ne bouge pas.

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
  numéro ni `porte`, et tous les articles reçus sont offerts. Le libellé **n'est pas neutre**, il
  annonce la contradiction : arbitré le 16 septembre, la clarté du geste passe avant.
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
- **Les deux surfaces de côté sont des PANNEAUX qui s'ouvrent ENTRE la conversation et le composeur**,
  et **ne recouvrent rien** : la conversation **rétrécit pour leur faire place**. L'écran montre alors
  ses trois temps d'un coup, de haut en bas — *ce qu'on me demande*, *ce dont je dispose*, *ce que
  j'écris* — et la question reste sous les yeux pendant qu'on choisit un passage. Une surface à la
  fois. Deux portes y mènent, et ce sont deux registres : **la voix du composeur enseigne** — elle dit
  le geste et ouvre le Contexte — **la barre nomme** les deux surfaces, donne leur compte et y donne
  accès à tout moment. Les portes **tranchent sur le fond** : ce sont des outils, pas des étiquettes.
- **La colonne tient dans la fenêtre** : la page ne défile pas, chaque bande défile pour son compte, et
  la conversation est **la seule bande élastique** — c'est elle qui cède quand un panneau s'ouvre ou
  que la phrase s'allonge. *« → Envoyer »* ne passe donc jamais sous le pli, même sur un portable bas.
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
- **Une pièce porte un seul nom** : l'index du Contexte l'appelle exactement comme la Discussion l'a
  transmise. Le nom court ne survit que dans la **provenance** d'un passage retenu et dans la phrase
  composée — là, il *référence*, il ne *nomme* pas.
- **On écrit sa réponse sous la question** : le clavier est dans le Contexte, la phrase s'écrit sous la
  conversation. L'arbitrage du **va-et-vient entre deux colonnes** est **clos, faute d'objet** : il n'y
  a plus deux colonnes, et la conversation ne quitte jamais l'écran. Une autre question s'ouvre à sa
  place, et elle n'a jamais été éprouvée — *trois bandes empilées, est-ce une pensée ou un tableau de
  bord ?* (§3)
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

**Le bandeau se tient en tête de page, dans le flux** : il réserve sa place et pousse le jeu vers le
bas au lieu de le recouvrir — aucune des quatre ancres ne peut se retrouver dessous. Il reste épinglé
au défilement, et lisible par-dessus la pièce ouverte. Ses consignes s'**annoncent** aussi, à qui ne
voit pas le halo (§4.10).

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
   question ne se rappelle que lorsqu'elle a cessé d'être le dernier mot de l'avocat. Un panneau
   ouvert ne fait pas exception, et c'est ce qui l'a fait ouvrir dans le flux plutôt que par-dessus :
   **ce qui reste à l'écran n'a pas à être redit**.
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
   chrome mentait. **La barre reste**, et c'est délibéré : la question se pose dans le fil, mais une
   question qui a défilé est une question perdue — le droit de répondre doit rester sous la main
   aussi longtemps qu'on compose.

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
3. **La pièce ouverte est une boîte de dialogue** : le jeu derrière devient inerte, le focus entre dans
   la pièce et revient, à la fermeture, à ce qui l'a ouverte. Le bandeau du tutoriel reste vivant
   par-dessus (§4.8) — c'est pourquoi elle n'est pas un `<dialog>` natif, qui l'aurait rendu inerte
   avec le reste.
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

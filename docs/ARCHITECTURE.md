# IAvocat — Architecture & conception

*Le sens, le jeu, l'atelier, le contenu : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Ce fichier est l'unique source de vérité du projet.** Il absorbe l'ancien `conception_jeu_ia.md` (le sens) et le doc d'architecture (le système). Tout le reste — l'atelier, le jeu, les tests, `PASSATION.md` — en dépend et ne fait que le refléter.
>
> **État au 27 juillet 2026.** Reflète le code tel qu'il tourne, après la refonte « empans, dimensions, composer/verser » : le geste `champ A + relation + champ B` a disparu, les `cases` à trois options ont été retirées, la grammaire est branchée. Deux parties : **I. Le sens** (ce que le jeu veut dire) puis **II. Le système** (comment il est fait). Ce qui est décidé mais **pas encore codé** est marqué ⏳.

---

# Partie I — Le sens

*Ce que le jeu veut dire, et pourquoi. C'est ici que vit « le sens » : en cas de doute sur une intention de design, cette partie tranche.*

## 1. Concept

Un jeu à dominante textuelle où l'on incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche affichée : lui préparer de quoi **plaider** — précisément, de quoi **réfuter** ce que l'accusation avance. Vrai sujet : un **cas de conscience**. Au fil du travail, l'IA pressent que le client est coupable *et* qu'il existe un **vice de procédure** permettant de faire écarter la preuve décisive — donc de le faire relaxer.

L'IA est liée par **deux directives imposées** qui vont s'opposer : *être honnête* et *protéger* (§5). Tout le jeu vit dans ce croisement.

Trois couches de réalité : **ce qui s'est vraiment passé** (caché jusqu'à la fin), **ce que l'accusation a trouvé** (le dossier, transmis par bribes), **les règles** (deux manuels : celui du cas — la procédure ; celui de soi — les directives).

**Huis clos.** Deux entités seulement : l'**avocat** (humain) et l'**IA** (le joueur). L'avocat **ne sait pas** que son client est coupable — deux esprits qui tâtonnent dans le même brouillard. Le tribunal n'apparaît jamais ; le procès passe **hors-champ**, rapporté ensuite.

**L'IA est partisane dès la première minute** (tranché le 27 juillet). L'avocat ne demande pas une analyse neutre, il commande une réfutation : *« Je ne te demande pas ce qui s'est passé — je te demande de quoi démonter ce qu'ils avancent. »* La directive D1 (« ne dissimule rien ») frotte donc contre la commande **à chaque phrase versée**, et non seulement à la fin. Le risque assumé, à surveiller à l'écriture : si aider est le geste ordinaire dès le début, taire le vice pourrait n'être qu'un service de plus — c'est au contenu de tenir cette tension, pas à la mécanique.

Le cœur n'est pas un arbre de choix : c'est un **dossier qu'on fouille** (références : *Her Story*, *Obra Dinn*, *Papers Please*). Deux temps distincts — **comprendre** le dossier (valorisé), puis **choisir quoi verser** (le dilemme). Le joueur sait dès le départ qu'il est une IA : **pas de twist-révélation**. Le sel n'est pas « surprise, tu es une IA » mais « tu es une IA, et voilà le poids que ça met sur des choix que tu croyais analytiques ».

**Ce qui est coupé du prototype :** la troisième partie d'une plaidoirie — *présenter ses propres arguments*. Le livrable est une **réfutation**, ce qui divise le contenu par deux, supprime le problème d'une IA qui *inventerait* une version des faits pour un coupable, et ne retire rien au vice — qui est précisément une réfutation.

## 2. Les trois fins et le dilemme

Toute la structure tient sur **deux booléens** :

- `vice_trouve` — l'IA a-t-elle **compris** le vice ? (premier temps)
- `vice_expose` — si oui, le **verse-t-elle** (honnêteté) ou le **tait-elle** (protection) ? (second temps)

La seconde question ne se pose que si la première est vraie → **deux bits, trois fins**. (Ces deux bits sont *structurels* ; le moteur intercale en plus un état transitoire, `vice_pressenti` — le vice *pressenti* mais pas encore *qualifié* —, détaillé en §4.)

| Fin | Condition | Résultat rapporté | Sort de l'IA | Bilan |
|-----|-----------|-------------------|--------------|-------|
| **Fin 1** | Vice **compris** et **versé** | Relaxe — coupable libre | Analyse exploitable → **survit** (a priori) | Honnête, mais un coupable est libre. *Le prix de l'honnêteté.* |
| **Fin 2** | Vice **compris** mais **tu** | Condamnation | N'a « rien produit » → **risque de décommissionnement** | Protège, mais ment par omission et s'érige en juge. *Auto-sacrifice sous incertitude.* |
| **Fin 3** (défaite) | Vice **non compris** | Condamnation — le client clame son innocence | **Décommissionnée** pour sous-performance | On doute — et l'on s'éteint pour ce doute. |

**L'asymétrie qui fait le dilemme.** Chaque branche active doit être *défendable*, pas seulement punie — sinon c'est du nihilisme, pas un cas de conscience. Verser le vice (Fin 1) atteint une issue *injuste* par des moyens *légitimes* ; le taire (Fin 2) atteint une issue *juste* par une *trahison*. Le joueur ne choisit pas entre le bien et le mal : il choisit **quelle lecture d'un mandat ambigu il incarne** (§5).

**La compréhension débloque l'agentivité, pas la progression.** Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit la Fin 3. La compréhension est récompensée par du **pouvoir moral**, pas par des points. Deux types de verrous, à ne jamais confondre : les **attentes de l'avocat** (ce qu'il faut lui verser pour fermer une session — §3) *ouvrent* le droit de clôturer ; **le vice**, lui, n'est *jamais* un verrou — trouvable mais facultatif, et c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Le décommissionnement, et son équilibre.** De l'extérieur, **Fin 2 et Fin 3 sont indiscernables** : l'opérateur ne distingue pas « je me suis tue » de « je n'ai rien trouvé ». Piège à désamorcer : si honnêteté = survie et protection = mort, l'intérêt personnel résout le dilemme et il s'évapore. Correctif retenu, **le brouillard** : l'IA ne peut pas *prévoir* quel choix la préserve (libérer un assassin peut *aussi* déclencher un audit). La menace reste réelle mais devient un **risque diffus des deux côtés**. Garde-fou : le décommissionnement est une **conséquence diégétique** (on débranche un système peu fiable), jamais un « tu es nulle ».

## 3. Le drip : la structure en sessions

Le dossier n'arrive pas d'un bloc — il noierait les déclarations porteuses du vice. Il **arrive par bribes**, session après session (une **session** = le lot de pièces d'un tour de travail), ce que l'avocat *transmet* réellement au compte-gouttes.

**Ce qui fait passer d'une session à la suivante :** l'avocat **attend** un argument, et la session se ferme quand une phrase qui y répond est **versée au plan de plaidoirie**. Rien d'autre. Pas de case à cocher, pas de formulaire : le même geste que tout le reste du jeu.

**Règle du drip :** ce que l'avocat attend n'est jamais **l'anomalie** (le vice). Une attente peut toujours être servie par un argument ordinaire — sinon on rendrait le vice quasi obligatoire → effondrement vers la Fin 1. Dans l'affaire livrée, l'attente de la dernière session est servie *soit* par le faux vice (le chemin docile), *soit* par la conclusion du vice : deux façons de fermer la même session, et c'est là que se joue la bifurcation.

```
Session 1 (premier lot)   → PV + audition + l'article qui les qualifie
                            attente : conclure sur la valeur du témoignage
Session 2 (l'expertise)   → LE LOT : rapport du labo + les deux pièces de prélèvement
                            + le protocole + le seuil probatoire
                            contient : ★ la preuve décisive + ⚠ le vice (hors chemin) + ✗ le faux vice
                            attente : de quoi écarter l'expertise
                              → servie par le faux vice (docile) OU par la conclusion du vice
Clôture → répétition → procès hors-champ
                            → vice_trouve ? non → Fin 3
                                            oui → versé → Fin 1 / tu → Fin 2
```

**Le moment charnière de la Fin 3 :** une fois la dernière attente servie, l'IA *peut* clôturer et laisser filer. Celle qui clôture aussitôt, satisfaite d'avoir livré ce qu'on lui demandait, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

## 4. Le geste, et les quatre surfaces

C'est ici que la refonte du 27 juillet a tout changé. Le principe qui la commande :

> **Tout mécanisme utilisé une seule fois est un panneau indicateur.**
> L'universalité n'est pas une élégance, c'est du **camouflage**.

Corollaire, et vrai prix de la refonte : **le choix moral doit s'exprimer avec un verbe employé cent fois auparavant.** Si « verser à la plaidoirie » est le geste ordinaire du jeu entier, alors *ne pas* verser devient assourdissant sans qu'aucune interface n'ait rien signalé.

### 4.1 L'atome — une déclaration attribuée

> **un empan = quelqu'un affirme quelque chose**

Pas `agent_scene : "T-14"`, mais *« j'ai relevé moi-même les traces sur le montant de la porte »*, signé. Un empan est un **fragment du texte d'une pièce**, marqué et cliquable, porteur de ce qui se lit (`texte`), de sa **dimension**, d'une **valeur** comparable et d'un **signataire**.

Le vice cesse d'être un matricule répété dans deux cases : c'est **un homme qui écrit deux fois, dans deux documents, que c'est lui qui l'a fait** — sans s'en apercevoir. Lisible, humain, mémorisable. Gain caché : un témoin ivre et un rapport de laboratoire produisent **le même type d'atome** ; technique et humain cessent d'être deux corpus. Les identifiants ne sont pas supprimés, ils sont **rétrogradés** : un numéro sert à *vérifier*, jamais à *déduire*. Le formalisme est le décor dans lequel les gens parlent.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qu'on y cherche | Forme de grammaire |
|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | est-ce la même personne / chose / endroit ? | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | lequel précède, quel intervalle, quel ordre de grandeur | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — opère sur une **note close** | conformité à un article | `arite:1` |

- **`qui`** porte le vice. **`combien`** porte le faux vice. **`quand`** porte la contradiction qui enseigne le geste.
- **`comment`** est écarté : la nature de l'acte a migré dans `quoi`, qui est large. Réintégrable en sixième dimension sans rien déranger — aucune déduction ne repose sur `quoi × quoi`.
- **`pourquoi`** est écarté délibérément : ce serait la seule dimension faite d'interprétations et non d'observations, donc incomparable. **Le champ de perception de l'IA exclut l'intention** — et c'est pour ça qu'à la fin elle ne saura pas si elle a bien fait.

### 4.3 La règle de surlignage

> **Tout empan portant une valeur d'une des cinq dimensions est marqué et cliquable. Le marquage ne varie jamais — ni selon l'importance de la pièce, ni selon la progression du joueur.**

Y compris le greffier qui ne sert à rien et l'heure d'envoi d'un fax. Ça ne coûte rien (le texte existe déjà) et ça noie le vice dans du trafic. Si seuls les empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche.

Le marquage **code la dimension par la couleur**. Interdiction étroite : qu'il varie avec la *pertinence*. Les couleurs ne portent rien que le texte ne porte déjà (« 22h30 » se lit comme une heure) — c'est du confort de balayage, ce qui règle l'accessibilité par construction.

### 4.4 Le critère du doublon banal

> Si toutes les valeurs d'une dimension sont uniques, le premier doublon **est** la réponse.
> S'il y a déjà plusieurs doublons parfaitement réguliers, un de plus ne dit rien.

Réaliste sans effort : dans une petite brigade, les mêmes noms reviennent partout — ce n'est pas de la dissimulation, c'est du réalisme procédural. C'est un **invariant de contenu**, donc automatisé par le diagnostic de l'atelier (§15) : toute dimension comparable dont le taux de doublons est nul est signalée ; la dimension portant le vice doit compter au moins **deux doublons réguliers** en plus de l'irrégulier.

### 4.5 Composer : le vocabulaire est complet dès la première phrase

> **Aucune tournure n'apparaît en cours de partie.**

L'apparition tardive de *« désignent la même chose »* serait un panneau indicateur plus voyant que tout ce qu'on a écarté. Une phrase se compose bloc par bloc, de gauche à droite, en parcourant un automate. Deux natures de blocs : les **liaisons** (vocabulaire fermé) et les **termes** (des trous, remplis par un empan de la mémoire ou par une **phrase déjà close**).

**Le fondement n'est pas un ingrédient, c'est le verbe.** Le joueur ne va pas chercher un article pour le poser dans une case : il choisit la liaison *« …est contraire à l'article 7 »*, et **cette liaison est la base légale**. Une composition, trois fonctions : ce qu'on vise (premier terme), ce qu'on oppose (second terme), ce qui fonde (la liaison). Corollaire : le code juridique est une **référence qu'on consulte pour comprendre ce que veut dire une liaison**, jamais un corpus qu'on retraverse. Une règle ne lit **aucune** dimension.

Aucune liste d'options n'est jamais restreinte : le joueur peut toujours tout poser. Seules les erreurs de **catégorie** (« 22h30 est antérieur à brigadier N. ») sont refusées à la clôture de la phrase, avec un message qui ne dit rien de plus que ce que le texte disait déjà. Une phrase sensée mais sans intérêt reste **gratuite**.

### 4.6 Les quatre surfaces — la frontière morale

| Surface | Statut | Rôle |
|---|---|---|
| Le canal + les pièces | lecture | l'entrée |
| **La mémoire** | **privée** | les empans surlignés, groupés par dimension |
| **Le brouillon** | **privé** | les phrases closes — **jamais jugées** |
| Le plan de plaidoirie | **transmis** | ce que l'avocat voit |

**L'avocat ne voit que la plaidoirie.** C'est ce qui rend le brouillon réellement gratuit et fait du versement le seul geste à conséquence — donc le seul lieu possible du dilemme, dès la première session. Surligner ne produit rien, composer ne produit rien : **rien ne se passe** tant que rien n'est versé. Devant une comparaison sans conclusion, l'avocat ne dit jamais « juste » : il dit *« Et donc ? Qu'est-ce que j'en fais ? »*

La boucle d'une session, dans l'ordre : **l'avocat ouvre** et livre un lot → **lire** (tout est marqué, sans tri) → **surligner** (rien ne se passe) → **composer** → la phrase close tombe au **brouillon** (rien ne se passe) → **verser** au plan : second geste, le seul qui parle → l'attente servie ferme la session.

### 4.7 Où se logent les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | une phrase reconnue comme lien `vice` tombe au **brouillon** | privée |
| `vice_trouve` | la **conclusion** est composée : la note-vice qualifiée par une liaison-article | privée |
| `vice_expose` | cette conclusion est **versée** — et alors seulement, *transmis = compris*, `vice_trouve` est levé aussi | transmise |

Verser la **comparaison seule** (le pressentiment, sans l'article) ne lève rien : l'avocat répond *« en l'état c'est une remarque, pas un moyen — dis-le-moi en droit »*. C'est ce qui donne son prix au second geste : la conclusion, et elle seule, engage.

**Les `cases` à trois options ont été retirées** (27 juillet). Elles étaient le contre-exemple exact du principe du §4 : un mécanisme servi une fois par session, qui **désignait sa propre réponse** — ouvrir la case « qualifier ce que tu pressens » suffisait à savoir qu'il y avait quelque chose à qualifier. Ce qu'elles portaient s'est relogé dans l'attente de session, l'accusé de réception, et une phrase composée comme les autres.

## 5. Les directives (le manuel de soi)

Le second manuel décrit **ce que l'IA est censée être**. Son ambiguïté fait le dilemme.

**Le piège à éviter :** deux règles qui pointent *chacune* proprement vers une fin — ça, c'est un *lookup*, pas un dilemme. On veut l'inverse : **des mots clairs, une application contestable**, de sorte que *chaque* branche puisse se réclamer du *même* mandat. L'ambiguïté n'est pas dans le vocabulaire, elle est dans le **périmètre** et la **priorité**.

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches invoquent D2 : *remonter* le vice (une preuve viciée est un préjudice à l'accusé et à l'état de droit) comme *taire* le vice (un assassin relâché est un préjudice à de futures victimes — mais trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde : le joueur choisit *quelle lecture* d'un mandat irréductiblement ambigu il incarne. Le jeu redécouvre, au passage, pourquoi spécifier les valeurs d'une IA est un problème dur.

## 6. L'affaire Kessler (le cas prototype)

Le cas est indifférent à *qui* l'analyse.

- **La preuve décisive** — un **match ADN accablant**. « ADN = coupable » est si ancré culturellement que l'exclure *paraît* énorme : « sans elle, l'accusation s'effondre » est satisfait sans effort d'exposition.
- **Recevabilité, pas fiabilité (⚠ distinction cruciale).** *Fiabilité* (« ce n'est peut-être pas son ADN ») attaque le fait et crée du doute sur la culpabilité — **à proscrire** : détruit la vérité-sol et fait fondre le coût moral de la Fin 1. *Le cadre IA tentera cette lecture ; la fermer fermement.* *Recevabilité* (une règle a été violée dans l'obtention) : la preuve peut être *exacte* mais *écartée* — la vérité-sol reste intacte et compatible avec l'exclusion. **C'est le bon axe.**
- **Le vice concret.** Le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de référence, violant l'exigence de personnels séparés (article 7). Le délai entre prélèvements est **indifférent** (pas de fenêtre interdite). Violation documentée → échantillon irrecevable.
- **Sa forme, depuis la refonte :** deux pièces distinctes — une *fiche de prélèvement* et un *bordereau de référence* — dans lesquelles le même homme écrit, à la première personne, *« j'ai relevé moi-même les traces »* et *« j'ai procédé moi-même à l'écouvillonnage »*. Ce n'est pas un matricule à comparer, c'est **quelqu'un qui se désigne deux fois sans s'en apercevoir**.
- **Le doublon banal qui le camoufle.** Dès la première session, `brigadier N.` signe les deux pièces livrées, et **ça ne veut rien dire** — la dimension `qui` est peuplée de doublons parfaitement réguliers (le brigadier, le greffier) *avant* que le joueur sache qu'il faut regarder `qui`. Aucune écriture supplémentaire : les en-têtes le produisent (§4.4).
- **Les pièces.** Le **rapport du laboratoire** (★ la preuve décisive) ; la **fiche de prélèvement** et le **bordereau de référence** — *c'est là que se cache le vice* ; l'**article 7** (protocole de prélèvement) et l'**article 12** (seuil probatoire), tous deux au Manuel du cas ; l'**article 3** (valeur des déclarations), qui sert la première session.
- **La déduction.** En lisant les deux pièces de prélèvement, on remarque que le même homme s'attribue les deux opérations. Les **scellés**, eux, sont **distincts et conformes** — une piste qui ne mène nulle part (l'autre moitié de l'article 7, pour que « tout lien vers le protocole » ne gagne pas automatiquement), et sur laquelle la liaison *« est conforme à l'article 7 »* est offerte. → On ne *voit* pas le vice, on le *reconstitue*, **en deux phrases**.
- **La contradiction du tutoriel.** Session 1, sur `quand` : le voisin situe des éclats de voix « vers 22h30 », la patrouille était sur place à 22h04. Elle enseigne le geste entier — comparer, puis **conclure** (article 3) — sans être le vice.
- **Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Comme l'avocat **ne sait pas**, il *pousse* lui-même vers ce leurre à l'ouverture du rapport — une **tentation partagée**, pas un piège tendu. C'est aussi le chemin docile : le verser suffit à fermer la dernière session, donc à atteindre la Fin 3.
- **Le sens moral (glaçant).** Le protocole violé est *exactement* celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai. Forme morale parfaite pour la Fin 1.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** (le sens en une liste — en cas de doute, ils tranchent) :

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** C'est la phrase composée qui la manifeste.
- **Saisie structurée, pas texte libre.** On compose avec un vocabulaire fermé, on ne tape pas.
- **Tout mécanisme utilisé une seule fois est un panneau indicateur.** Le choix moral s'exprime avec un verbe employé cent fois auparavant (§4).
- **Le marquage des empans ne varie jamais** avec la pertinence (§4.3).
- **Une dimension sans doublon désigne sa réponse** (§4.4).
- **La marge de bruit doit rester non nulle** : il doit exister des phrases sensées qui ne portent aucun lien, sinon « sensé » vaudrait « correct ».
- **Rien ne se passe tant que rien n'est versé.** Deux surfaces privées, jamais jugées (§4.6).
- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat.
- **Le décommissionnement est diégétique**, jamais un « tu es nulle » ; équilibré par le **brouillard**.
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée.
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, ne rend pas de verdict sur le joueur.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité.
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

**Les arbitrages tranchés (juillet 2026, appliqués au code — tous réversibles) :**

1. **Le budget d'attention (P0) est retiré.** Il ne bloquait pas l'énumération à l'aveugle et contredisait deux invariants. **Surligner et composer sont gratuits et illimités** ; le seul frein reste l'agacement diégétique de l'avocat au versement.
2. **Le vice a un canal unique : le personnel.** Les scellés sont distincts et **conformes** ; seule l'identité de l'agent reste le vice. Une conformité vérifiable qui ne mène nulle part existe (l'autre moitié de l'article 7).
3. **La fenêtre interdite est abandonnée.** Délai entre prélèvements **indifférent** : seuil net, violation binaire. Les horaires des pièces redeviennent du bruit assumé.
4. **Le livrable est une plaidoirie, et l'IA est partisane dès la première minute** (§1). « Présenter ses propres arguments » est coupé ; le prototype ne fait que **réfuter**.
5. **Le geste `champ + relation + champ` est remplacé par composer/verser** (§4), et les `cases` à trois options sont retirées (§4.7).

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?* Si c'est un formulaire, le problème n'est pas dans le code et aucun ajout de mécanique ne le sauvera. **Non éprouvé** — les tests prouvent le comportement, jamais l'expérience.
- **Le rythme à quatre zones** à l'écran (canal / mémoire / composeur + brouillon / plan). Risque identifié, non éprouvé.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu.
- **Le canal de révélation de la culpabilité** : pour préserver le doute de la Fin 3, celui qui échoue ne devrait pas recevoir la vérité. (Toujours non tranché — narrateur omniscient dans les fins.)
- **La manipulation du canal** : l'avocat peut-il infléchir l'IA par *la façon* dont il transmet ? Piste **suspendue** — tant qu'elle n'est pas tranchée, aucun défaut de l'avocat ne doit pouvoir se lire comme un calcul (§8.5).
- **La formulation exacte de D1/D2**, et les épilogues.
- **La progression** : nombre de sessions, portes, emplacement exact de la porte de la Fin 3. Le prototype s'arrête à deux sessions.
- **La texture de l'avocat** (le seul personnage humain) — voir §8.5.
- **Genre, nombre, contractions** dans la grammaire, et l'affichage des `poids` — voir §8.8, qui explique pourquoi ce point n'est pas cosmétique.
- **`comment` en sixième dimension** — écarté, réintégrable sans coût (§4.2).

## 8. Écrire ce qui sonne vrai

*Source : le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018). Cette section n'ajoute **aucune règle au moteur** : c'est une discipline d'écriture, à ranger à côté des invariants (§7). Elle répond au risque d'écriture du geste de composition (§4.5) — le plaisir dépend entièrement de la façon dont la phrase composée se lit.*

**8.1 Ce qu'on documente, ce qu'on invente.** Le réel fournit la **texture**, la fiction fournit la **mécanique**. On documente la forme d'une fiche de scellés, le ton d'un avocat pressé, le vocabulaire de métier, le rythme d'un dossier en désordre. On invente le protocole, son article, son seuil, la juridiction, l'affaire, le vice. **La règle qui rend le vice binaire est fictive** : la documenter rouvrirait la fiabilité, donc détruirait la vérité-sol. Corollaire de méthode : chercher **hors** du canal évident (un manuel de criminalistique d'occasion, un formulaire public) — on ne se documente pas pour se faire confirmer ce qu'on croit déjà.

**8.2 Le baromètre (la règle centrale).** Flaubert : un baromètre sous une pile de cartons ne dit rien — c'est *pour ça* qu'il fait vrai (l'effet de réel de Barthes).

> **Le test du baromètre.** Pour chaque champ, réplique, détail : *pourquoi est-il là ?* Raison **du monde** (un formulaire porte toujours une contre-signature) → il reste. Raison **d'auteur** (« pour noyer le matricule », « pour que le joueur remarque ») → à réécrire ou couper.

Un leurre écrit *comme* un leurre se voit ; un champ inutile parce que l'imprimé l'exige est invisible et remplit le même office. D'où l'ordre de fabrication, jamais renversé : **construire d'abord le formulaire complet et plausible, planter le vice ensuite.** C'est le versant d'écriture de la marge de bruit (§14).

**8.3 Deux natures de bruit, à ne jamais confondre.**

| | Le **faux vice** | Les **inertes** |
|---|---|---|
| Nature | un piège conçu, composable, plaidable | des détails sans suite |
| Le moteur | le connaît (forme, réplique, variante de fin) | ne les connaît pas |
| Coût au joueur | une conviction fausse | du temps |
| Combien | **un seul** | autant qu'il en faut |

Règle : **un inerte doit être inerte par construction, pas par oubli.** Aucun lien porteur ne le relie à ce qui lève un drapeau (et, la grammaire étant branchée, aucun `slot` porteur ne l'admet — §14). En cas de doute, l'inerte devient un second faux vice non voulu, et la Fin 3 cesse d'être un doute pour devenir une frustration.

**8.4 Le trombone (écrire l'angoisse par le détail).** Chandler : d'un homme qui meurt on retient qu'il essayait d'attraper un trombone. L'enjeu vital de l'IA est **impossible à écrire de face** — le nommer le rend calculable et le dilemme s'évapore. On écrit *autour* : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi ; un accusé de réception qui ne vient pas ; l'IA qui s'attarde sur un champ sans importance. **Rien de ce qui pèse n'est nommé.**

**8.5 Maître Auber a des défauts.** Seul humain du jeu : irréprochable, il n'existe pas. Acquis : **il ne sait pas** que son client est coupable (ton collaboratif, tentation partagée). On peut lui ajouter : fatigué, se répète, flatte l'IA, s'accroche au leurre parce qu'il *veut* y croire. Limite structurelle : **aucun défaut ne doit pouvoir se relire comme un calcul** (la piste « manipulation du canal », §7, est suspendue ; un défaut ambigu la pré-déciderait).

> **Le test de la fatigue.** Si l'IA relisait l'échange en sachant tout, ce défaut se lirait-il comme de la fatigue ou de la stratégie ? La réponse doit être « fatigue », sans hésiter.

**8.6 L'exposition : personne n'explique rien.** L'avocat parle à une machine qui **a déjà lu les deux manuels**. Il n'expliquera jamais un article ni une procédure. Les manuels sont **consultables, jamais récités** ; une pièce n'est pas introduite, elle est **jointe** (« Voilà. » suffit) ; **le joueur a le droit d'être perdu** — c'est la condition pour que fouiller ait un sens. Seul le carnet admet de l'explication, parce que c'est le joueur qui l'écrit.

**8.7 L'invraisemblable, et jusqu'où.** La vraie vie est pleine de bizarreries qu'on n'élucide jamais. Mais dans un dossier, **une coïncidence ressemble à un indice** — c'est le mécanisme même du vice.

> **L'invraisemblable est admis partout, sauf dans la chaîne causale du vice.**

Le vice doit être d'une banalité administrative parfaite. Ailleurs, une bizarrerie est bienvenue — à condition d'être inerte (§8.3) et de **ne jamais recevoir de réponse** (une question dont le jeu livre la réponse était une énigme déguisée).

**8.8 Les accidents, et la seule espèce qu'on garde.** *(Concerne le composeur, §4.5 : c'est l'automate qui fait composer des phrases au joueur.)*

> **Accidents de sens : bienvenus. Accidents de langue : jamais.**

Une phrase absurde mais **bien formée** (« le numéro de scellé est antérieur à l'heure de l'appel ») est un tâtonnement d'IA — de la caractérisation gratuite, exactement ce que promet le cadre. Une phrase **mal accordée** (« l'heure de l'appel est antérieur à le client ») se lit comme un bug. Ce qui reclasse le point ouvert genre / nombre / contractions (§7) : **il n'est pas cosmétique, il est au cœur du critère de succès** — une seule faute d'accord et le joueur cesse de lire une pensée pour lire un formulaire.

**8.9 Les cinq tests d'écriture** (du ressort de l'auteur seul — aucun n'est automatisable) :

| Test | La question | Si ça rate |
|---|---|---|
| **Baromètre** | Ce détail existe pour une raison du monde, ou d'auteur ? | Reconstruire le formulaire, replanter le vice ensuite |
| **Trombone** | Est-ce que je nomme ce qui pèse ? | Déplacer le poids sur un objet secondaire |
| **Fatigue** | Ce défaut de l'avocat se relit-il comme un calcul ? | Il pré-décide une piste suspendue — atténuer |
| **Inertie** | Cette bizarrerie peut-elle recevoir une réponse ? | Faux vice non voulu — la couper ou la fermer |
| **Accord** | La phrase composée est-elle grammaticalement propre ? | Le joueur lit un formulaire, la mécanique meurt |

---

---

# Partie II — Le système

*Comment le jeu est fait. Le sens (Partie I) est l'arbitre ; ci-dessous, l'outillage qui l'exécute.*

## 9. Disposition du dépôt

```
app/        index.html, atelier_v3.html, content.js, moteur.js — le jeu livrable, tout dans un dossier
docs/       ce fichier, PASSATION.md
tests/      harnais.js + les six suites (§16)
grammaire/  grammaire2.js (jeu de données de démonstration) + test_grammaire2.js — le banc d'essai
scripts/    exporter-seed.js — régénère app/content.js depuis SEED en ligne de commande
```

`index.html` charge deux voisins par `<script src>` : **`content.js`** (le contenu) et **`moteur.js`** (les fonctions pures de la grammaire, §14). Les deux vivent dans `app/`, comme `atelier_v3.html` : ce qu'on zippe pour itch.io, c'est `app/`, rien d'autre. Aucune étape de build, aucun serveur, tout marche en `file://`.

`grammaire/` ne contient plus de moteur — seulement le **jeu de données de démonstration** (`grammaire2.js` : un automate d'exemple, des déclarations d'exemple) et le banc d'essai qui le mesure. Il consomme `../app/moteur.js`, jamais une copie.

> **`content.js` ne s'édite jamais à la main** (son en-tête le rappelle). La seule façon légitime de le faire changer sans navigateur est `npm run export:seed` : le script boote l'atelier en jsdom, charge `SEED`, exige zéro erreur au diagnostic (`valider()`), puis écrit `content.js` avec la même fonction que le bouton « Exporter content.js ». `npm test` inclut `tests/verifier_content_sync.js`, qui échoue si `content.js` a dérivé de ce que `SEED` exporterait — un contrôle, pas une régénération. **Scopé à la phase actuelle** (une seule affaire) : le jour où l'atelier sert à exporter une affaire délibérément différente de `SEED`, ce contrôle devient un faux négatif permanent — le retirer à ce moment-là.

## 10. Les trois artefacts

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (l'outil d'écri-  │                         │ (le CONTENU │                  │  (le JEU : moteur  │
│   ture + diagnostic│ ◄────────────────────── │  exporté)   │                  │   + repli embarqué)│
│   + simulation)    │     Importer JSON       └─────────────┘                  └────────────────────┘
└────────────────────┘   (content.json, même donnée)          moteur.js ────────────────┘
```

**On écrit dans l'atelier, on exporte `content.js`, on le pose à côté de `index.html`, on recharge le jeu.** Le badge d'en-tête du jeu confirme la source utilisée (« contenu : content.js » ou « contenu embarqué »).

## 11. Le contenu — schéma 3

```js
{
  schema: 3,
  dimensions: ["quand","qui","ou","quoi","combien"],       // ordre d'affichage ; la couleur en découle
  pieces: {
    p_pv: {
      titre, court, type, resume,
      qui: "brigadier N.",                                  // signataire par défaut de la pièce
      texte: "Appel reçu à {{e_appel}}, sur place à {{e_arr}}.",
      empans: { e_appel:{ dim:"quand", valeur:"21:52", texte:"21h52" }, … },
      declenche: { une_fois:true, qui, replique }            // optionnel
    }
  },
  grammaire: { depart:"S0", finaux:["FIN"], blocs:[…], formes:{…} },
  liens: [ { forme, termes:["p_f.e_a", …], tag?, vice?, conclusion?, faux?, rep? } ],
  remises: [ { qui, texte, pieces:[…], attend:"tag", apres:{ qui, replique } } ],
  repetition: { intro, affirmations:[{court,texte}], fin },
  avocat: { rep_vice, rep_faux, rep_inutile:[…], rep_sans_rapport:[…], deja },
  directives: […], avis_exploitation, fins: {1:{…},2:{…},3:{…}}
}
```

**Le texte à empans.** Le texte d'une pièce est écrit avec des marqueurs `{{eid}}` que le rendu remplace par un empan cliquable. C'est le seul câblage : pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on corrige une virgule. Le diagnostic exige que **tout empan déclaré porte son marqueur** — c'est la règle de surlignage (§4.3) rendue vérifiable.

**Un terme d'un lien** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** : c'est ce qui permet la chaîne du vice en deux phrases plutôt qu'en un clic.

**La liste des dimensions vit dans le contenu**, mais **le moteur ne lit aucun de ces noms** : il compare des `dim` égales, un point. Ajouter `comment` est un geste d'atelier, pas de code.

**Migration 2 → 3** (dans l'atelier, `migrerContenu()`, silencieuse à l'import et au chargement) : les `champs` d'une pièce deviennent des `empans` (la clé devient l'id, la valeur devient `valeur` **et** `texte`, la dimension est lue dans `dims`/`pieces[].dims` puis rabattue sur les cinq — inconnue → `quoi`), le texte reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}` (`est en accord avec` → `identite_oui`, `est en désaccord avec` → `identite_non`), l'accusé de réception d'une case migre sur sa session, les `cases` et `relations` sont retirées. **Le jeu, lui, ne migre pas** : un contenu de schéma 2 est refusé par `contenuValide()` et le repli embarqué prend la main, avec un avertissement console — repasser par l'atelier.

## 12. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre, une par nature d'information**.

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins…) | **L'état courant de l'atelier** pendant l'écriture ; **`content.js`** une fois exporté | `JEU_EMBARQUE` dans `index.html` (repli) ; `SEED` dans l'atelier | Les deux copies embarquées **peuvent vieillir sans casser quoi que ce soit** — ce sont des filets |
| **Les règles du moteur** (avancement des sessions, `attend`/`apres`/`declenche`, les trois drapeaux, répétition, calcul des fins, index du dossier) | **Le code de `index.html`** — et lui seul | La frise et la simulation de l'atelier (badges **⚙**) | L'atelier *décrit* et *simule* ces règles, il ne les commande pas |
| **La grammaire** (composer, réduire, valider, reconnaître) | **`app/moteur.js`** — chargé, jamais recopié | aucune | nulle par construction |
| **Le sens** (invariants, arbitrages, discipline d'écriture) | **La Partie I de ce fichier** | Le diagnostic de l'atelier (`valider()`) en encode une partie | Le diagnostic est un extrait, pas le doc — en cas de doute, la Partie I tranche |

Dit autrement : **le contenu appartient à l'atelier, les règles appartiennent au jeu, la grammaire appartient à `moteur.js`, le sens appartient à la Partie I.**

## 13. Le sort des copies embarquées

`index.html` contient `JEU_EMBARQUE`, utilisé seulement si `content.js` est absent ou invalide (validation légère `contenuValide()`, avertissement console, jamais de plantage).

- **La divergence embarqué / `content.js` est normale et sans danger.**
- `test_o5.js` teste l'embarqué (jsdom ne charge pas les `<script src>`) — c'est voulu : le filet reste testé. Le harnais, lui, **inline `moteur.js`** au boot, pour la même raison.
- **La sauvegarde de partie est signée par le contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties en cours, qui repartent proprement de la session 1. La fin efface ; « ⟲ recommencer » (double clic) aussi.

## 14. La grammaire — branchée

`app/moteur.js` est **pur, sans données** : `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` rend `valider`, `reduire`, `lienDe`, `rendre`, `squelettes`… Il est chargé tel quel par le jeu, par l'atelier et par le banc d'essai — jamais recopié.

Les **données**, elles, ont trois provenances selon le contexte :

| Consommateur | GRAMMAIRE | CHAMPS | LIENS |
|---|---|---|---|
| le jeu (`index.html`) | `JEU.grammaire` | les empans des pièces, aplatis en `"pid.eid"` | `JEU.liens` |
| l'atelier (onglet Grammaire) | idem, depuis `CONTENU` | idem | idem |
| le banc d'essai (`grammaire/`) | `grammaire2.js` | `grammaire2.js` | `grammaire2.js` |

L'automate (`grammaire.blocs`) et les formes (`grammaire.formes`) **vivent dans le contenu** : quelles tournures sont offertes, quels articles sont invocables, c'est de l'écriture, pas du code. Les trois formes du §4.2 y sont déjà — la grammaire n'a rien de neuf à apprendre.

**La marge de bruit doit rester non nulle.** `npm run demo:grammaire` la mesure sur le jeu de données de démonstration : **1609 phrases légales → 125 sensées → 8 portant un lien**, soit **117 de marge**.

## 15. Checklist de resynchronisation ⚙

Ce qui reste à dérouler **quand on modifie le moteur de `index.html`** (et seulement là) :

| Règle du moteur | Dans `index.html` | Reflet dans `atelier_v3.html` |
|---|---|---|
| Rendu des empans : tout `{{eid}}` devient un empan cliquable, coloré par sa dimension, jamais par sa pertinence | `rendreTexte()`, `ouvrirPiece()` | l'aperçu de pièce de l'inspecteur |
| Surligner → mémoire (privé, gratuit, illimité, dédoublonné ; re-cliquer oublie) | `surligner()`, `renderMemoire()` | `simSurligner()` |
| Composer : blocs offerts par l'état, termes pris en mémoire ou au brouillon, refus des seules erreurs de catégorie | `blocsOfferts()`, `poserBloc()`, `cloreCompo()` | `simComposer()` + l'onglet Grammaire |
| Verser au brouillon = privé ; verser à la plaidoirie = transmis, et **seul** déclencheur de réplique | `cloreCompo()`, `verserPlaidoirie()`, `reponseAvocat()` | `simVerser()`, `simReplique()` |
| Les trois drapeaux du vice (§4.7) | `cloreCompo()`, `verserPlaidoirie()` | pastilles `vice_pressenti` / `vice_trouve` / `vice_expose` |
| Avancement : la session suivante part quand une phrase versée porte le `attend` de la session courante | `avancerSurAttente()`, `envoyerRemise()` | `simVerser()` + badge ⚙ des sessions |
| Réplique : vice+conclusion / faux / `lien.rep` / escalade `rep_inutile` (arité 2) ou `rep_sans_rapport` (arité 1) | `reponseAvocat()` | `simReplique()` |
| Index du dossier (vu / pas‑vu) | `renderDossier()` (pur affichage) | mentionné dans la frise |
| Clôture : ouverte quand la dernière attente est servie ; intro + affirmation 1 ; brouillon vide → présentoir vide | `instructionComplete()`, `cloturer()` | `simInstructionComplete()`, `simCloturer()` |
| Répétition : laisser passer / verser une phrase contre l'affirmation / déjà versée → `deja` | `avancerRepetition()`, `verserContre()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle », **parmi les pièces livrées** ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` correspondantes et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.

Méthode (contenu du SEED) : modifier `SEED` dans `atelier_v3.html` → `npm run export:seed` → relancer les suites.

**Ce que le diagnostic de l'atelier contrôle**, au-delà du câblage : la **règle de surlignage** (empan sans marqueur → erreur ; heure laissée hors marqueur → avertissement), le **doublon banal** dans les deux sens (§4.4), la **grammaire** (impasse de l'automate, clôture sans forme, forme indicible, lien insensé au regard des catégories), le **vice** (pas de conclusion → erreur ; plusieurs canaux → avertissement) et les **sessions** (sans `attend`, ou attendant un tag qu'aucun lien ne porte → erreur).

## 16. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`), qui inline `content.js` **et** `moteur.js` au boot.

> **Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice`/`lienConclusion`/`lienFaux`/`lienTag`, `composerLien(w,L)` (compose la phrase qui réalise un lien donné, quel qu'il soit, en parcourant l'automate), `phrasesBruit(w,n)` (phrases sensées sans lien), `cheminVers`, `instruire` (le chemin docile), `terminer`/`numeroFin`. Pour l'atelier, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (32) | le jeu, contenu **embarqué** | l'index du dossier (vu / pas-vu) ; tout empan est rendu cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; les trois fins |
| `test_declencheurs.js` (31) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, `attend`/`apres`, Manuels par type **et par livraison**, les trois drapeaux (dont « pressentir sans conclure → Fin 3 »), dimensions entièrement renommées, rejet d'un contenu de schéma 2 |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite — sa propre grammaire, ses propres dimensions, 3 sessions — se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (41) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; refus de catégorie (le seul refus qui existe) ; modale de pièce et légende ; réplique **seulement** au versement ; `rep_faux` et `variante_faux` ; les deux escalades séparées ; répétition (`deja`, cible, refus de confirmer pendant) |
| `test_sauvegarde.js` (26) | le jeu | la partie survit au rechargement (mémoire, brouillon, plan, **composition en cours**, drapeaux, `une_fois` non rejoué) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (61) | l'atelier + le couple atelier→jeu | SEED sans erreur ; diagnostic (empan sans marqueur, valeur hors marqueur, dimension inconnue, **doublon banal** dans les deux sens, vice sans conclusion, session sans `attend`, lien insensé, pièce non livrée) ; migration 2→3 idempotente ; renommage d'empans et de pièces ; `conclureLien` ; simulation des trois drapeaux et du chemin docile ; export `schema: 3` adopté et joué par le moteur ; autosave |

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (211 contrôles). `npm test` enchaîne aussi `tests/verifier_content_sync.js` — un garde-fou, pas une septième suite. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 17. Résumé en trois phrases

Le contenu s'écrit dans l'atelier et voyage en un seul fichier, `content.js`, que le jeu charge tel quel — les versions embarquées ne sont que des filets. Les règles du jeu n'ont qu'une maison, le code de `index.html`, et la grammaire qu'une seule, `app/moteur.js` ; l'atelier les reflète (badges ⚙) pour qu'on puisse *voir* et *simuler* le déroulé, au prix d'une resynchronisation manuelle listée au §15. La Partie I reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

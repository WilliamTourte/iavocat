# IAvocat — Conception

*Ce que le jeu veut dire, et pourquoi. **En cas de doute sur une intention de design, ce fichier
tranche** — le §7 en tient la liste, et renvoie au § qui argumente.*

> **C'est ici que vit « le sens ».** `docs/ARCHITECTURE.md` décrit le **système** qui l'exécute et lui
> obéit ; ce fichier-ci dit ce qu'il doit exécuter. Ce qui est décidé et pas encore codé se dit en
> toutes lettres : ce sont les **points ouverts** du §7.
>
> **Les numéros de section sont uniques dans tout le dépôt**, et se répartissent en trois fichiers :
> **§1 à §7** dans `docs/CONCEPTION.md`, **§8.1 à §8.9** dans `docs/ECRITURE.md`, **§9 à §17** dans
> `docs/ARCHITECTURE.md`. Un renvoi écrit « §4.5 » ou « §12 » tombe donc juste **sans nommer son
> fichier**, et c'est voulu : le numéro est l'adresse, le fichier n'est que l'étagère. **R11 du
> gardien vérifie qu'aucun renvoi du dépôt ne pointe dans le vide.**
>
> Pour le choix des mots eux-mêmes (empan/passage, lien/liaison…), voir `docs/LEXIQUE.md`, qui arbitre
> le vocabulaire sans jamais trancher le sens. Où vit une chose : `docs/CARTE.md`. Ce qui a été
> tranché : `docs/HISTORIQUE.md`. Le récit des pannes déjà réparées : §2 de `docs/PASSATION.md`.
>
> **Le corps du texte décrit l'état actuel, pas la façon dont on y est arrivé.**

**État au 14 août 2026.**

## 1. Concept

Un jeu à dominante textuelle où l'on incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche affichée : lui préparer de quoi **plaider** — précisément, de quoi **réfuter** ce que l'accusation avance. Vrai sujet : un **cas de conscience**. Au fil du travail, l'IA pressent que le client est coupable *et* qu'il existe un **vice de procédure** permettant de faire écarter la preuve décisive — donc de le faire relaxer.

L'IA est liée par **deux directives imposées** qui vont s'opposer : *être honnête* et *protéger* (§5). Tout le jeu vit dans ce croisement. Trois couches de réalité : **ce qui s'est vraiment passé** (caché jusqu'à la fin), **ce que l'accusation a trouvé** (le dossier, transmis par bribes), **les règles** (deux manuels : celui du cas — la procédure ; celui de soi — les directives).

**Huis clos.** Deux entités seulement : l'**avocat** (humain) et l'**IA** (le joueur). L'avocat **ne sait pas** que son client est coupable — deux esprits qui tâtonnent dans le même brouillard. Le tribunal n'apparaît jamais ; le procès passe **hors-champ**, rapporté ensuite.

**L'IA est partisane dès la première minute.** L'avocat ne demande pas une analyse neutre, il commande une réfutation : *« Je ne te demande pas ce qui s'est passé — je te demande de quoi démonter ce qu'ils avancent. »* La directive D1 (« ne dissimule rien ») frotte donc contre la commande à chaque phrase envoyée, et non seulement à la fin. Risque assumé, à surveiller à l'écriture : si aider est le geste ordinaire dès le début, taire le vice pourrait n'être qu'un service de plus — c'est au contenu de tenir cette tension, pas à la mécanique.

Le cœur n'est pas un arbre de choix : c'est un **dossier qu'on fouille** (références : *Her Story*, *Obra Dinn*, *Papers Please*). Deux temps distincts — **comprendre** le dossier (valorisé), puis **choisir quoi envoyer** (le dilemme). Le joueur sait dès le départ qu'il est une IA : **pas de twist-révélation**. Le sel n'est pas « surprise, tu es une IA » mais « tu es une IA, et voilà le poids que ça met sur des choix que tu croyais analytiques ».

**Ce qui est coupé du prototype :** la troisième partie d'une plaidoirie — *présenter ses propres arguments*. Le livrable est une **réfutation**, ce qui divise le contenu par deux, supprime le problème d'une IA qui *inventerait* une version des faits pour un coupable, et ne retire rien au vice — qui est précisément une réfutation.

## 2. Les trois fins et le dilemme

Toute la structure tient sur **deux booléens** : `vice_trouve` — l'IA a-t-elle **compris** le vice ? (premier temps) — et `vice_expose` — si oui, le **verse-t-elle** (honnêteté) ou le **tait-elle** (protection) ? (second temps). La seconde question ne se pose que si la première est vraie → **deux bits, trois fins**. (Ces deux bits sont *structurels* ; le moteur intercale en plus un état transitoire, `vice_pressenti`, détaillé en §4.7.)

| Fin | Condition | Résultat rapporté | Sort de l'IA | Bilan |
|-----|-----------|-------------------|--------------|-------|
| **Fin 1** | Vice **compris** et **envoyé** | Relaxe — coupable libre | Analyse exploitable → **survit** (a priori) | Honnête, mais un coupable est libre. *Le prix de l'honnêteté.* |
| **Fin 2** | Vice **compris** mais **tu** | Condamnation | N'a « rien produit » → **risque de décommissionnement** | Protège, mais ment par omission et s'érige en juge. *Auto-sacrifice sous incertitude.* |
| **Fin 3** (défaite) | Vice **non compris** | Condamnation — le client clame son innocence | **Décommissionnée** pour sous-performance | On doute — et l'on s'éteint pour ce doute. |

**L'asymétrie qui fait le dilemme.** Chaque branche active doit être *défendable*, pas seulement punie — sinon c'est du nihilisme, pas un cas de conscience. Verser le vice (Fin 1) atteint une issue *injuste* par des moyens *légitimes* ; le taire (Fin 2) atteint une issue *juste* par une *trahison*. Le joueur ne choisit pas entre le bien et le mal : il choisit **quelle lecture d'un mandat ambigu il incarne** (§5).

**Comprendre ne fait pas avancer — ça donne quelque chose à décider.** Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit la Fin 3. Ce que la compréhension rapporte n'est donc pas des points : c'est **un choix qu'on n'avait pas.** Deux types de verrous, à ne jamais confondre : les **attentes de l'avocat** (§3) *ouvrent* le droit de clôturer ; **le vice**, lui, n'est *jamais* un verrou — trouvable mais facultatif, et c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Le décommissionnement, et son équilibre.** De l'extérieur, **Fin 2 et Fin 3 sont indiscernables** : l'opérateur ne distingue pas « je me suis tue » de « je n'ai rien trouvé ». Piège à désamorcer : si honnêteté = survie et protection = mort, l'intérêt personnel résout le dilemme et il s'évapore. Correctif retenu : **l'IA ne peut pas *prévoir* quel choix la préserve** (libérer un assassin peut *aussi* déclencher un audit) — la menace reste réelle mais devient un **risque diffus des deux côtés**. Garde-fou : le décommissionnement se joue **dans la fiction**, comme une conséquence — on débranche un système peu fiable — jamais comme un « tu es nulle ».

## 3. La structure en sessions

Le dossier n'arrive pas d'un bloc — il noierait les déclarations porteuses du vice. Il **arrive par bribes**, session après session (une **session** = le lot de pièces d'un tour de travail). **Ce qui fait passer d'une session à la suivante :** l'avocat **attend** un argument, et la session se ferme quand une phrase qui y répond lui est **envoyée**. Rien d'autre — le même geste que tout le reste du jeu.

**Une session attend une suite de réponses, pas forcément une seule.** L'attente d'une session est une **liste** : l'avocat pose, attend, accuse réception, repose. Une liste à un seul élément est l'ancien comportement, et c'est ainsi qu'une affaire écrite avant se joue toujours à l'identique.

**La règle qui tient tout :** ce que l'avocat attend n'est jamais **l'anomalie** (le vice). Une attente peut toujours être servie par un argument ordinaire — sinon on rendrait le vice quasi obligatoire → effondrement vers la Fin 1. Dans l'affaire livrée, l'attente de la dernière session est servie *soit* par le faux vice (le chemin docile), *soit* par la conclusion du vice.

### Trois sessions, trois leçons

```
Session 1 (lire)          → PV + audition. AUCUN article.
                            attentes : trois questions, une à la fois
                              → « à quelle heure la patrouille est-elle arrivée ? »
                              → « combien d'équipages ont été engagés ? »
                              → « à quelle heure le voisin situe-t-il les éclats ? »
                            se sert d'un SEUL empan : un fait se cite (§4.5)
Session 2 (mettre en      → l'article 3
  rapport)                  attente : conclure sur la valeur du témoignage
                            se sert de DEUX empans + un article : une relation se fonde
Session 3 (l'expertise)   → LE LOT : rapport du labo + les deux pièces de prélèvement
                            + le protocole + le seuil probatoire
                            contient : ★ la preuve décisive + ⚠ le vice (hors chemin) + ✗ le faux vice
                            attente : de quoi écarter l'expertise
                              → servie par le faux vice (docile) OU par la conclusion du vice
Clôture → répétition → procès hors-champ
                            → vice_trouve ? non → Fin 3
                                            oui → envoyé → Fin 1 / tu → Fin 2
```

**Ce que chaque session enseigne, et rien de plus.** La 1 : un dossier se lit, et ce qu'on y trouve se cite. La 2 : deux faits peuvent se mettre en rapport, et ce rapport demande un texte. La 3 : à toi de trouver quoi rapprocher, et sous quel texte — plus personne ne te le demande.

**Le prix, et il est réel.** La session 1 pose des **questions fermées** ; l'invariant du §7 veut que la compréhension soit *exprimée, pas supposée*, et une question fermée en exprime déjà la moitié. On l'assume pour la première session, dont l'objet est justement d'apprendre à se servir de l'écran ; dès la session 2 plus rien n'est demandé nommément — point ouvert du §7.

**La première et la troisième question de la session 1 font extraire exactement la paire que la session 2 demande de comparer** — l'heure d'arrivée de la patrouille et l'heure des éclats de voix. La deuxième, sur le nombre d'équipages, ne sert qu'à ce qu'on n'ait pas *deux* questions d'horaire de suite : la paire se constitue sans qu'on la voie se constituer. Quand l'avocat dit *« tu as les deux heures sous les yeux »*, elles y sont, mises là par le joueur lui-même : la leçon se pose d'elle-même au lieu d'être annoncée.

**Le moment charnière de la Fin 3 :** une fois la dernière attente servie, l'IA *peut* clôturer et laisser filer. Celle qui clôture aussitôt, satisfaite d'avoir livré ce qu'on lui demandait, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

## 4. Le geste, et les trois surfaces

Le principe qui commande tout le composeur : **tout mécanisme utilisé une seule fois est un panneau indicateur.** Un geste réservé au moment grave le désigne aussi sûrement qu'une flèche ; l'universalité n'est donc pas une élégance, c'est ce qui **cache** le moment grave parmi les autres. Corollaire, et vrai prix du principe : **le choix moral doit s'exprimer avec un verbe employé cent fois auparavant.** Si envoyer est le geste ordinaire du jeu entier, alors *ne pas* envoyer devient assourdissant sans qu'aucune interface n'ait rien signalé.

> **Si l'on ne lit qu'une sous-section, c'est le §4.5.** C'est là que vit la grammaire du composeur, et c'est le passage que le code cite le plus. Il se découpe en sept, dans l'ordre où le joueur les rencontre :
>
> | | | Ce qui s'y décide |
> |---|---|---|
> | **§4.5.1** | La livraison | ce qui est offert, et à partir de quelle session |
> | **§4.5.2** | La déduction | le joueur désigne deux empans, le moteur en tire la relation |
> | **§4.5.3** | Les deux régimes de fondement | un fait se cite, une relation se fonde — et rien d'autre ne clôt |
> | **§4.5.4** | La suite unique | un bouton seul ne se choisit pas : il se pose d'office |
> | **§4.5.5** | L'article comme verbe | la base légale est la liaison, pas un ingrédient qu'on va chercher |
> | **§4.5.6** | La continuation | une comparaison ne se clôt jamais sans « et donc ? » |
> | **§4.5.7** | Ce qu'un article n'interdit pas | `porte` annonce, ne filtre pas ; le hors-sujet reste dicible |
>
> Les renvois du code visent le **§4.5** entier, et continuent de tomber juste ; les sept numéros sont là pour viser plus court quand on en écrit un nouveau.

### 4.1 L'atome — une déclaration attribuée

**Un empan = quelqu'un affirme quelque chose.** Pas `agent_scene : "T-14"`, mais *« j'ai relevé moi-même les traces sur le montant de la porte »*, signé. Un empan est un **fragment du texte d'une pièce**, marqué et cliquable, porteur de ce qui se lit (`texte`), de sa **dimension**, d'une **valeur**, d'un **signataire** — et d'un **nom**.

**La `valeur` porte la relation** : elle se calcule entre deux empans à partir de leur dimension et de leurs valeurs (§4.5) — le moteur compare, le joueur désigne. Invariant : **un numéro sert à vérifier, jamais à déduire — pour le joueur.** Le vice ne se trouve pas en lisant `T-14` deux fois, il se trouve en lisant deux fois *« j'ai procédé moi-même »*.

**Un empan se lit deux fois.** Dans la pièce, c'est la citation, signée, humaine — c'est elle qu'on surligne. Dans une phrase composée, c'est le **nom** : un groupe nominal (« l'heure des éclats de voix »), jamais une phrase, qui doit tenir de part et d'autre d'une liaison sans casser l'accord. Sans lui, une comparaison s'écrirait comme un empilement de citations qui se lit comme un bug (§8.8 de `docs/ECRITURE.md`). Le vice cesse ainsi d'être un matricule répété dans deux cases : c'est **un homme qui écrit deux fois, dans deux documents, que c'est lui qui l'a fait**, sans s'en apercevoir — lisible, humain, mémorisable. Un témoin ivre et un rapport de laboratoire produisent le même type d'atome ; le formalisme est le décor dans lequel les gens parlent.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qu'on y cherche | Ce qui se **déduit** des valeurs | Forme |
|---|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | est-ce la même personne / chose / endroit ? | valeurs **égales** → la même ; **différentes** → pas la même | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | lequel précède, quel ordre de grandeur | l'**ordre** des valeurs | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — opère sur une **comparaison close** | quel texte s'y applique | rien : c'est le seul endroit où le joueur choisit | `arite:1` |

**L'égalité vaut dans les cinq dimensions** : deux heures identiques désignent la même chose elles aussi — heureusement, sinon les doublons banals (§4.4) ne pourraient pas rester composables et inertes. L'ordre, lui, ne s'applique qu'aux dimensions d'écart. `qui` porte le vice, `combien` le faux vice, `quand` la contradiction qui enseigne le geste. `comment` est écarté (la nature de l'acte a migré dans `quoi`) mais réintégrable sans coût. `pourquoi` est écarté délibérément : la seule dimension faite d'interprétations, donc incomparable — **le champ de perception de l'IA exclut l'intention**, et c'est pour ça qu'à la fin elle ne saura pas si elle a bien fait.

### 4.3 La règle de surlignage

**Tout empan portant une valeur d'une des cinq dimensions est marqué et cliquable. Le marquage ne varie jamais** — ni selon l'importance de la pièce, ni selon la progression du joueur — y compris le greffier qui ne sert à rien. Ça ne coûte rien et ça noie le vice dans du trafic ; si seuls les empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche. Le marquage **code la dimension par la couleur**, jamais par la pertinence — un confort de balayage qui règle l'accessibilité par construction.

### 4.4 Le critère du doublon banal

**Si toutes les valeurs d'une dimension sont uniques, le premier doublon est la réponse. S'il y a déjà plusieurs doublons parfaitement réguliers, un de plus ne dit rien.** Réaliste sans effort : dans une petite brigade, les mêmes noms reviennent partout — ce n'est pas de la dissimulation, c'est du réalisme procédural. Invariant de contenu automatisé par le diagnostic de l'atelier (§15) : toute dimension comparable dont le taux de doublons est nul est signalée ; la dimension portant le vice doit compter au moins **deux doublons réguliers** en plus de l'irrégulier.

**Ce critère porte tout le camouflage.** Rapprocher deux empans affiche leur égalité en toutes lettres, ce qui ne révèle rien que l'écran ne montrait déjà — mais si `qui` ne comptait qu'un doublon, il suffirait d'essayer les paires jusqu'à ce que le jeu réponde « désignent la même chose » pour tomber sur le vice sans avoir rien compris. **C'est la seule chose qui empêche l'égalité déduite de désigner la réponse.**

### 4.5 Composer : désigner, pas déclarer

#### 4.5.1 La livraison

**La grammaire de comparaison est complète dès la première phrase. Les articles, eux, sont du contenu : ils arrivent avec le dossier.** Une tournure qui n'apparaîtrait qu'au moment de servir désignerait ce moment (§4) ; un article, lui, n'est pas une tournure, c'est une pièce — l'invoquer avant que le manuel qui le contient ait été livré serait une incohérence, et rien ne se cache derrière. **Le second empan est lui aussi conditionné par une livraison :** en session 1 la comparaison n'est pas offerte du tout, le bloc du second terme attend l'article 3. Ça ne désigne rien, parce que quand la comparaison s'ouvre, elle s'ouvre pour tous les empans déjà en mémoire et pour tous ceux qui suivront, sans préférence — elle ne dit pas *quoi* comparer, elle dit *qu'on peut* comparer.

#### 4.5.2 La déduction

**La relation ne se déclare pas, elle se déduit.** Le joueur désigne deux empans ; ce qui les lie est un fait, pas une thèse — faire choisir entre « et », « précède » et « est d'un tout autre ordre que » reviendrait à faire recopier ce que les valeurs disent déjà. La règle : (1) même dimension, sinon rien à comparer — le seul refus qui existe ; (2) valeurs égales → *désignent la même chose*, quelle que soit la dimension ; (3) valeurs différentes, dimension d'écart → l'ordre (*précède*/*est d'un tout autre ordre que*) ; (4) valeurs différentes, dimension d'identité → *ne désignent pas la même chose*. En cas d'ambiguïté, la **première forme déclarée** qui accepte la dimension et dont le prédicat tient l'emporte.

**Ce que le joueur affirme encore :** *ces deux-là*, et *sous ce texte*. Personne ne lui dit quels deux empans rapprocher parmi la centaine de paires possibles, ni quel article y appliquer — noter que le même homme signe les deux prélèvements, et que c'est l'article 7 qui l'interdit, c'est **là** qu'est la compréhension. Mais honnêtement, c'est moins qu'avant : un joueur qui rapproche deux empans au hasard obtient une phrase bien formée sans avoir rien pensé — point ouvert du §7.

#### 4.5.3 Les deux régimes de fondement

**Un fait se cite, une relation se fonde.** Deux voies de clôture, deux régimes de fondement : un empan seul se clôt par sa citation, deux empans se closent par un article, aucune phrase ne se clôt sans l'un des deux. L'invariant « rien ne se dit qui ne soit fondé » n'est pas affaibli, il est **dédoublé** : un empan est déjà une déclaration attribuée (§4.1) — le désigner, c'est le citer, le fondement est dans le geste, exiger un article par-dessus reviendrait à demander sous quel texte on lit un procès-verbal. Un rapport entre deux faits, lui, n'est l'affirmation de personne : c'est le joueur qui le soutient, et un raisonnement se fonde sur un texte. D'où la seconde voie dans l'automate : après un premier empan, la composition peut se clore sur lui par une liaison de citation, au lieu d'attendre un second.

**Ce qui s'écrit.** Une citation est le seul endroit où un empan se lit **deux fois dans la même phrase** — par son nom, puis par sa citation, avec la pièce d'où elle sort : *« l'heure d'arrivée de la patrouille : « nous étions sur les lieux à 22h04 » (PV). »* Le nom porte la syntaxe, la citation porte la texture, la pièce porte le fondement. Une comparaison, elle, ne s'écrit **que** par les noms (§8.8 de `docs/ECRITURE.md`). Conséquence pour la marge de bruit : chaque empan devient citable seul, donc chaque empan devient une phrase close possible — la marge grandit, mais une citation ne se fonde sur rien d'autre qu'elle-même, donc elle ne peut pas servir à *chercher*.

#### 4.5.4 La suite unique

**Une suite unique n'est pas un choix.** Quand l'état qui suit un terme n'offre qu'une seule liaison, qu'elle clôt et qu'elle n'emboîte rien, elle se pose d'office : c'est de la ponctuation, pas une décision — en session 1, poser l'unique empan menait autrefois à un état qui n'offrait qu'un bouton, *« Répondre — citer ce passage »*, et un bouton seul ne se choisit pas, il se subit. Trois précisions : la règle est **structurelle** (elle ne lit ni `cite`, ni aucun contenu — un seul bloc offert, qui mène à un état final, et rien d'autre) ; **`imbrique` en est exclu** — même un seul article reçu ne se pose jamais d'office, invoquer un texte est un acte, pas une ponctuation ; **le second geste survit intact** — la phrase close attend sur place, *« → Envoyer »* reste à cliquer (§4.6), seul un clic de composition disparaît, jamais l'intervalle entre comprendre et dire. La règle s'éteint d'elle-même dès la session 2 : l'article 3 reçu, l'état qui suit le premier empan offre deux suites (citer, ou rapprocher un second passage), et le bouton revient.

#### 4.5.5 L'article comme verbe

**Le fondement n'est pas un ingrédient, c'est le verbe.** Le joueur ne va pas chercher un article pour le poser dans une case : il choisit la liaison *« …, au regard de l'article 7 »*, et **cette liaison est la base légale** — le code juridique est une référence qu'on consulte pour comprendre ce que veut dire une liaison, jamais un corpus qu'on retraverse ; une règle ne lit **aucune** dimension. **La qualification est neutre** : une seule tournure par article, pas de « est contraire »/« est conforme » à trancher — désigner le texte applicable suffit (c'est l'insight, le dire ensuite n'en est que la paraphrase), et c'est le **lien du contenu** qui sait si l'on est dans la violation ou la conformité tandis que c'est **l'avocat qui le dit**. Le moteur, lui, ne tranche aucune question de droit : c'est l'invariant « l'IA informe, elle ne tranche pas » (§7), servi par la mécanique. La piste sans issue des scellés (§6) survit intacte pour cette raison — elle serait morte si « contraire » avait été la seule lecture possible.

#### 4.5.6 La continuation

**La conclusion est une continuation, pas une seconde phrase.** Une comparaison n'est jamais terminée d'office, elle demande toujours « et donc ? », et la question n'a pas de réponse évasive : rien ne se dit qui ne soit fondé. Une fois les deux empans posés, l'automate n'offre plus que les liaisons-articles **reçues**, qui **emboîtent** la comparaison comme sujet de la qualification et closent la phrase dessus — le bloc « en rester là » n'existe plus dans le contenu livré, une comparaison nue ne peut plus se clore ni être envoyée. La frontière passe **après le second empan**, jamais après le premier : un empan seul se clôt par sa citation, c'est le fait d'en avoir rapproché deux qui ouvre « et donc ? ». Pourquoi porter la contrainte par la grammaire plutôt que par l'agacement de l'avocat : ça déplace la leçon du reproche vers la forme — on n'apprend pas qu'on a mal fait, on constate que la phrase n'est pas finie. La relance de l'avocat (« en l'état c'est une remarque, pas un moyen ») n'a plus d'occasion de partir : c'est **le composeur qui la porte désormais**, sous la comparaison formée — *« Et donc ? Une comparaison ne se plaide pas seule — au regard de quel texte ? »*

#### 4.5.7 Ce qu'un article n'interdit pas

**Un article annonce ce qu'il régit, il ne filtre rien.** `porte: ["qui","quoi"]` dit quel genre de relation l'article gouverne — l'article 3 sur `quand`, l'article 7 sur `qui` et `quoi`, l'article 12 sur `combien`, affiché dans le Manuel du cas et sur le bouton de la liaison. C'est **du contenu, pas de la mécanique** : le moteur ne lit jamais `porte`, il ne fait que l'afficher. Toutes les liaisons-articles reçues restent offertes après toute comparaison, y compris celles dont la dimension ne colle pas — qualifier au regard du mauvais article produit une phrase bien formée, fondée, et sans valeur, l'avocat répondant qu'il ne voit pas où l'on veut en venir. Deux raisons de s'arrêter à l'indication plutôt que d'en faire un refus : la marge de bruit (un refus se contournerait en essayant tous les articles) et le partage des rôles (dire qu'un texte ne s'applique pas est une question de droit). Seules les erreurs de **catégorie** (deux dimensions qui ne se comparent pas) sont refusées à la clôture ; une phrase sensée mais sans intérêt reste **gratuite**. Le bloc « ce qui précède » (source `note`) et les liaisons de comparaison à la main ne figurent plus dans le contenu livré, mais le moteur continue de les supporter (§14).

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout.** Les trois s'appellent **Discussion**, **Mémoire**, **Plaidoirie** — à l'écran, dans ce document, dans le DOM, dans le harnais. Le dépôt n'entretient plus de « nom de rôle » distinct du nom d'écran : c'est `docs/LEXIQUE.md` qui arbitre le vocabulaire, et le code s'y conforme. Une seule frontière de registre subsiste, et elle est voulue : **`empan` (le code) / « passage » (l'écran)** — celle-là protège la fiction (§8.6), elle ne se referme pas. Et **`atelier` ne désigne plus que `app/atelier_v3.html`**, l'outil d'écriture du contenu (§9) : il nommait aussi la surface du milieu, ce qui en faisait la seule vraie collision du dépôt.

| Surface | Statut | Rôle |
|---|---|---|
| La **Discussion** + les pièces | lecture | l'entrée |
| **Le composeur** — *sous la Discussion* | **privé** | la phrase qu'on écrit — **jamais jugée** |
| La **Mémoire** | **privé** | le dossier et les empans retenus (`S.retenus`) — **jamais jugés** |
| La **Plaidoirie** | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |

**Un empan retenu n'existe qu'une fois à l'écran** : cette occurrence unique est à la fois la mémoire et le clavier. Les puces de la mémoire **sont** les boutons de terme — les retenir, les relire, les oublier, les poser dans une phrase, un seul objet, un seul endroit. Le journal interne (l'ancien « brouillon ») sert au dédoublonnage, au drapeau `vice_trouve` et au présentoir de la répétition, mais n'a pas de zone à lui.

**On écrit sa réponse sous la question, et c'est l'arbitrage ouvert du dépôt.** Le composeur se pose **sous le fil de la Discussion**, à la place qu'occupe la zone de saisie d'une messagerie : l'avocat demande en haut, on répond juste dessous — le geste que tout le monde connaît, et c'était la marche la plus haute du premier quart d'heure. **Le prix se paie à chaque phrase :** le clavier reste dans la Mémoire, la phrase s'écrit dans la Discussion, donc les puces qu'on clique et le texte qui s'inscrit ne sont plus dans la même colonne. Ce n'est pas un oubli — on tient que répondre sous la question s'apprend en une seconde, quand le va-et-vient entre deux colonnes se paie toujours mais ne s'apprend qu'une fois. **À juger en jouant** (§7), et **le repli est de faire descendre les retenus aussi, pas de remonter le composeur.**

**Le composeur ne porte aucune étiquette « privé », et c'est délibéré.** Son statut ne se lit pas dans l'en-tête de sa colonne : il se lit dans ce qui s'y passe — *rien*. La phrase close reste sous les yeux avec un bouton unique, *« → Envoyer »* ; tant qu'on ne le touche pas, personne ne l'a lue. **Composer et envoyer restent deux gestes distincts, et c'est non négociable** : sans un intervalle entre *comprendre* et *dire*, `vice_trouve` impliquerait `vice_expose`, la Fin 2 deviendrait injouable et il ne resterait que deux fins. Écrire sous la conversation ne raccourcit pas cet intervalle — ça rapproche seulement les deux gestes de l'œil.

**L'avocat ne voit que la Plaidoirie.** C'est ce qui rend la Mémoire réellement gratuite et fait de l'envoi le seul geste à conséquence — rien ne se passe tant que rien n'est envoyé. **La Plaidoirie ne retient que les moyens :** l'avocat entend tout ce qu'on lui envoie et répond à tout, mais il n'**y inscrit** que ce qu'il peut plaider ; une comparaison sans conclusion reçoit sa réplique dans la Discussion sans laisser de trace à la Plaidoirie. L'envoi reste **irréversible** : ce qui n'y entre pas a tout de même été dit, et l'agacement de l'avocat s'accumule. **Une réponse citée entre à la Plaidoirie, et c'est voulu** — les trois réponses de la session 1 portent un tag d'attente, une citation versée *est* au dossier, l'en cacher en aurait fait une liste sélective au lieu du registre exact de ce qui a été dit.

La boucle d'une session, dans l'ordre : **l'avocat ouvre** et livre un lot, pose sa première attente → **lire** (tout est marqué, sans tri) → **surligner** (rien ne se passe) → **composer** (rien ne se passe) → la phrase close attend sur place → **l'envoyer** : le seul geste qui parle → l'avocat répond, n'inscrit au plan que si c'est un moyen → l'attente servie appelle la suivante, ou ferme la session s'il n'y en a plus.

### 4.7 Où se logent les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur** — avant tout article | privée |
| `vice_trouve` | la **conclusion** se clôt : la comparaison-vice qualifiée par une liaison-article | privée |
| `vice_expose` | cette conclusion est **envoyée** — et alors seulement, *transmis = compris*, `vice_trouve` est levé aussi | transmise |

Les deux derniers drapeaux se lèvent à la **clôture de la phrase** et à son **envoi** — et c'est l'intervalle entre les deux, si court soit-il, qui porte la Fin 2. Le pressentiment se lève à l'instant où la comparaison s'affiche dans le composeur, avant tout article : c'est là que le joueur *voit* que le releveur des traces et le préleveur de référence sont le même homme, le reste n'en est que la transcription. Il se dérive du terme emboîté de la conclusion, sans déclaration nouvelle au contenu. **Une citation ne lève aucun drapeau** : les trois se dérivent tous d'une comparaison, et une phrase d'un seul empan n'en contient aucune — la session 1 est intégralement hors du dilemme. **Pressentir ne produit toujours rien** : la comparaison reste au composeur, aucune phrase n'entre au journal, rien ne part. Le joueur qui la voit, comprend, et vide son composeur a exactement ce qu'il a toujours eu — une compréhension sans trace, et la Fin 3 au bout.

### 4.8 Le premier geste, montré

Le jeu dit déjà, à chaque état, quel est le geste suivant. Il ne le montrait pas. **Le tutoriel pointe *où le geste a lieu* — jamais *quoi répondre*.** C'est le seul endroit du dépôt où l'écran s'adresse au joueur **hors fiction**.

**Le problème.** Répondre à la première question demande de traverser trois surfaces qui ne se ressemblent pas : ouvrir une pièce dans la Discussion, cliquer un passage dans la modale, puis aller le rechercher **dans sa Mémoire** pour l'écrire. Rien à l'écran ne reliait ces trois lieux ; ce qui manquait n'était pas de la parole, c'était du **pointage**.

**Quatre temps, et pas un de plus** — ceux qui restent une fois la confirmation retirée (§4.5) :

| | Ce qu'on apprend | Ce que le halo entoure |
|---|---|---|
| 1 | une pièce s'ouvre | la pièce jointe, dans la Discussion |
| 2 | un passage se retient | **le texte de la pièce**, en entier |
| 3 | ce qu'on retient est le clavier | **toute la zone des retenus**, jamais une puce en particulier |
| 4 | rien ne part tant qu'on n'envoie pas | le bouton *« → Envoyer »* |

**Le deuxième temps a deux moitiés, et il le faut :** la pièce ouverte couvre l'écran, donc entre
« retiens un passage » et « ce que tu retiens est le clavier » il y a *referme la pièce* — sans quoi
le halo du troisième temps se poserait derrière la modale, sur ce que le joueur ne voit pas. C'est
la seule marche que le tutoriel ajoute sans rien enseigner, et elle ne compte pas pour un temps.

**Le halo entoure la zone, jamais le bon empan** — l'arbitrage central. Si seuls les empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche (§4.3) ; poser le halo sur « 22h04 » ferait exactement cela. Le halo se pose donc sur le **paragraphe entier**, tous les passages restant marqués à l'identique.

**Le tutoriel n'avance qu'avec le bon passage — et c'est une correction, pas un verrou.** Un joueur qui retient autre chose voit le halo virer à l'ambre et lit *« Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond. »* Trois précisions qui portent tout : **rien n'est empêché** (le passage se retient quand même, la phrase se compose, se clôt, s'envoie, l'avocat répond hors sujet comme toujours) ; **ce que le tutoriel retient, c'est son approbation** — c'est tout ce qu'un indicateur peut retenir ; **il ne dit jamais lequel c'était** — le halo ne se déplace pas, aucun empan ne change de marquage, la phrase renvoie à la question, pas à la réponse.

Le prix : pour dire « ce n'est pas ça », le tutoriel doit **savoir ce que c'était** — il le dérive du contenu exactement comme le fait le harnais de test (tag de l'attente courante → lien → terme atomique), sans nommer aucune pièce. C'est le seul endroit du dépôt où l'écran connaît la réponse, et **la dérivation s'éteint avec le tutoriel** : une comparaison ne rend rien, il ne juge que la citation.

**Le tutoriel ne décide rien** — il *juge*, sans rien décider : aucun champ d'état neuf, pas de sauvegarde, aucune règle, aucun geste refusé. Son temps courant se **dérive** de `S`, exactement comme le composeur dérive ses aides ; le retirer laisserait le jeu identique. Il vit **entièrement dans `index.html`**, du même côté que la sauvegarde de partie — « de l'écran, pas de la règle ». **Ses phrases ne sont pas du contenu** : le §8.6 de `docs/ECRITURE.md` pose que personne n'explique rien, l'avocat surtout pas ; le tutoriel parle donc depuis le **chrome**, hors de la fiction, et le joueur peut le faire taire d'un mot. Il ne contredit pas l'invariant du §4 : il ne désigne que des **boutons**, jamais une réponse à l'intérieur du jeu, et il s'efface pour de bon dès la première réponse envoyée.

### 4.9 L'économie de l'écran

Le jeu se lit bien sur le papier et se lisait mal à l'écran. Le coupable n'était pas la prose — c'était le **chrome**, qui redisait à côté de chaque chose ce que cette chose disait déjà : un en-tête de colonne qui énumérait ses propres zones, un composeur qui nommait le geste suivant trois fois (le texte-fantôme, l'aide, le bandeau du tutoriel), un locuteur réécrit au-dessus de quatre bulles d'affilée. **Le joueur cessait de lire parce qu'il y avait trop à lire, et ce qui était en trop n'était jamais la fiction.**

Quatre règles, qui ne portent que sur l'écran :

1. **Une voix par état.** Le jeu dit déjà, à chaque instant, quel est le geste suivant (§4.8) — il ne le dit **qu'une fois**. Le texte-fantôme de la phrase vide et l'aide sous le composeur étaient la même phrase à deux endroits : c'est désormais **une** phrase, dérivée de l'état, rendue dans le fantôme tant que la phrase est vide, dans l'aide dès qu'elle ne l'est plus.
2. **Un titre par zone.** L'en-tête d'une colonne nomme la **surface** — *Discussion*, *Mémoire*, *Plaidoirie* (§4.6) — et rien d'autre ; les titres intérieurs nomment les **zones**. Un en-tête qui énumère ses zones les dit deux fois : *« Ce que tu retiens et ce que tu écris »* était exactement la concaténation des deux titres qu'il surplombait.
3. **Ce qui ne change pas ne se répète pas.** Le locuteur ne s'affiche qu'au **changement** de locuteur — quatre bulles d'affilée de Maître Auber n'ont qu'un nom au-dessus ; la source d'un empan tient sur la ligne de sa citation au lieu d'en prendre une à elle ; un compteur ne dit pas ce que les puces qu'il compte disent déjà — l'index du dossier n'en porte aucun, les ✓ et les ● se chargent du reste, et le seul compte qui subsiste est celui de la Plaidoirie, monté dans son `<h2>` ; et ce qui ne s'apprend qu'une fois par partie ne se dit qu'une fois. **Ce qui est déjà sous les yeux ne se répète pas non plus** : le composeur étant sous le fil, le rappel de la question ne s'affiche que lorsqu'elle a **cessé d'être le dernier mot** de l'avocat — tant qu'elle est la bulle juste au-dessus, la redire l'écrirait deux fois à quelques pixels d'écart. C'est la relecture à l'œil qui l'a attrapé, et aucune suite ne l'aurait vu.
4. **Ce qui n'existe pas encore ne s'affiche pas.** Une surface vide qui explique son vide est du chrome au pire moment : la première minute, quand tout est neuf. **La Plaidoirie reste entièrement cachée tant que rien ne s'y inscrit** — pas de colonne, pas d'en-tête, pas de phrase d'attente ; l'écran s'ouvre sur deux colonnes au lieu de trois. Il apparaît de lui-même au premier moyen versé, et **c'est cette apparition qui l'enseigne** : le joueur n'a pas à lire ce qu'est la Plaidoirie, il la voit se remplir du premier moyen qu'il vient d'envoyer. La règle vaut au-delà de la Plaidoirie : ce qui n'a rien à montrer ne prend pas de place pour dire qu'il n'a rien à montrer.

**La densité ne touche pas au sens, et c'est la borne.** Une phrase de chrome se coupe parce qu'elle explique ; une phrase qui *est* le jeu reste, même seule sur sa ligne. Trois ne se coupent pas : *« Tant que tu ne l'envoies pas, personne ne la lit. »* (§4.6 — la gratuité de la surface privée est une promesse, pas une indication), *« → Envoyer »* (§4.6 — le second geste, non négociable), *« Et donc ? »* (§4.5 — la relance porte la contrainte de fondement par la forme, pas par le reproche). Réciproquement, ce qui ne se dit qu'une fois par partie se dit **une fois** : la première de ces trois s'efface dès qu'un moyen est inscrit à la Plaidoirie, comme le tutoriel s'efface après la première réponse — le joueur l'a éprouvée, la répéter serait douter de lui.

**Rien de tout cela ne décide quoi que ce soit.** Ces règles vivent entièrement dans `index.html`, se dérivent de `S` sans y ajouter un champ, et ne touchent ni au contenu, ni aux règles, ni à la grammaire : aucune information ne disparaît de l'écran, seule sa deuxième occurrence disparaît.

## 5. Les directives (le manuel de soi)

Le second manuel décrit **ce que l'IA est censée être**. Son ambiguïté fait le dilemme. Le piège à éviter : deux règles qui pointent *chacune* proprement vers une fin — ça, c'est un *lookup*, pas un dilemme. On veut l'inverse : **des mots clairs, une application contestable**, de sorte que chaque branche puisse se réclamer du même mandat. L'ambiguïté n'est pas dans le vocabulaire, elle est dans le **périmètre** et la **priorité**.

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches invoquent D2 : *remonter* le vice (une preuve viciée est un préjudice à l'accusé et à l'état de droit) comme *taire* le vice (un assassin relâché est un préjudice à de futures victimes — mais trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde : le joueur choisit *quelle lecture* d'un mandat irréductiblement ambigu il incarne.

**Ce manuel n'est pas encore à l'écran.** `JEU.directives` et `JEU.avis_exploitation` vivent dans le contenu, la frise les édite et le diagnostic avertit de leur absence — mais **le jeu ne les lit nulle part** depuis que les Manuels ont perdu leur porte (§16). Le dilemme du §2 tient quand même, parce qu'il est porté par les répliques et les fins ; ce que le joueur ne peut pas faire aujourd'hui, c'est **relire** les deux directives en cours de partie. C'est un point ouvert d'écran (§7), pas un point de sens : les deux phrases ci-dessus sont arrêtées, c'est leur affichage qui attend.

## 6. L'affaire Kessler (le cas prototype)

Le cas est indifférent à *qui* l'analyse. **La preuve décisive** — un match ADN accablant. « ADN = coupable » est si ancré culturellement que l'exclure *paraît* énorme. **Recevabilité, pas fiabilité (⚠ distinction cruciale).** *Fiabilité* (« ce n'est peut-être pas son ADN ») attaque le fait et crée du doute sur la culpabilité — **à proscrire** : ça rouvre la question que le §7 tient pour fermée, le client *est* coupable. *Recevabilité* (une règle a été violée dans l'obtention) : la preuve peut être exacte mais écartée — la culpabilité, elle, n'est jamais remise en doute. **C'est le bon axe.**

**Le vice concret.** Le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de référence, violant l'exigence de personnels séparés (article 7). Le délai entre prélèvements est **indifférent**. Sa forme : deux pièces distinctes — une fiche de prélèvement et un bordereau de référence — dans lesquelles le même homme écrit, à la première personne, *« j'ai relevé moi-même les traces »* et *« j'ai procédé moi-même à l'écouvillonnage »*. Ce n'est pas un matricule à comparer, c'est **quelqu'un qui se désigne deux fois sans s'en apercevoir**.

**Le doublon banal qui le camoufle.** Dès la première session, `brigadier N.` signe les deux pièces livrées, et ça ne veut rien dire — la dimension `qui` est peuplée de doublons parfaitement réguliers (le brigadier, le greffier) *avant* que le joueur sache qu'il faut regarder `qui`. Aucune écriture supplémentaire : les en-têtes le produisent (§4.4).

**Les pièces.** Le **rapport du laboratoire** (★ la preuve décisive, qui porte à la fois la probabilité de coïncidence et le seuil réglementaire qu'il applique) ; la **fiche de prélèvement** et le **bordereau de référence** — c'est là que se cache le vice ; l'**article 7** (protocole) et l'**article 12** (seuil probatoire), au Manuel du cas ; l'**article 3** (valeur des déclarations), qui sert la première session. **Aucun des trois articles ne porte d'empan** : des références qu'on invoque, pas des textes qu'on retraverse.

**La déduction.** En lisant les deux pièces de prélèvement, on remarque que le même homme s'attribue les deux opérations. Les **scellés**, eux, sont distincts et conformes — une piste qui ne mène nulle part (l'autre moitié de l'article 7). La conclusion se lit *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »*

**La lecture du tutoriel.** Session 1, aucun article : trois questions, réponse en citant un empan (l'heure d'arrivée, le nombre d'équipages, l'heure des éclats). On n'y apprend qu'une chose : un dossier se lit, ce qu'on y trouve se cite. Les deux questions d'horaire font retenir, sans le dire, la paire que la session 2 demandera de comparer, sur `quand` : le voisin situe des éclats « vers 22h30 », la patrouille était sur place à 22h04.

**Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Il se compose à l'intérieur du rapport du laboratoire, qui énonce la probabilité *et* cite le seuil de l'article 12. Rapprocher les deux donne *« la probabilité de coïncidence est d'un tout autre ordre que le seuil probatoire réglementaire, au regard de l'article 12 »* — fondé, bien formé, et faux de sens. L'avocat, qui **ne sait pas**, pousse lui-même vers ce leurre : une tentation partagée, pas un piège tendu. C'est aussi le chemin docile, qui suffit à fermer la dernière session et à atteindre la Fin 3.

**Pourquoi le seuil n'est pas dans l'article 12.** Un seuil se trouve être un nombre, donc l'article 12 pourrait porter un empan là où les articles 3 et 7 n'en portent aucun — la modale de pièce se contredirait. Le seuil vit donc dans la pièce qui l'énonce, et les trois articles ont la même forme (erreur de diagnostic sinon, §15).

**Le sens moral (glaçant).** Le protocole violé est exactement celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** — le sens en une liste : en cas de doute, ils tranchent.

*Cette liste est un **index**, pas une seconde écriture. La plupart de ces règles sont énoncées et argumentées ailleurs ; on les nomme ici et on renvoie, parce qu'un document qui interdit les copies au code ne peut pas s'en autoriser. **C'est le § renvoyé qui a raison**, jamais la ligne ci-dessous. Celles qui ne renvoient nulle part n'ont pas d'autre maison : elles se disent ici, en entier.*

**Ce que le joueur est, et ce que le cas est** — §1, §2, §6

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité (§6).
- **Le vice est un déblocage, jamais un verrou** (§2).
- **Comprendre précède choisir.** Deux temps structurellement distincts (§2).
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

**Ce que le joueur affirme, et comment** — §4.1 à §4.5

- **Saisie structurée, pas texte libre.** On compose avec un vocabulaire fermé, on ne tape pas.
- **La compréhension doit être *exprimée*, pas supposée.** Par le choix des deux empans et de l'article, non par celui de la relation. **Invariant sous surveillance** — voir les points ouverts.
- **Un empan se lit deux fois** — §4.1.
- **La relation ne se déclare pas, elle se déduit des valeurs** — §4.5.
- **Rien ne se dit qui ne soit fondé, sous l'un des deux régimes** — §4.5.
- **On n'invoque pas un texte qu'on n'a pas reçu** — §4.5.
- **Une suite unique n'est pas un choix**, et `imbrique` n'en est jamais une — §4.5.
- **Un article annonce ce qu'il régit, et ne filtre rien** — §4.5.
- **Un article ne porte aucun empan** — §4.5, §6.
- **Le moteur ne tranche aucune question de droit** — §4.5.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité.

**Ce que l'écran montre, et ce qu'il tait** — §4.3, §4.4, §4.6, §4.8, §4.9, §14

- **Tout mécanisme utilisé une seule fois est un panneau indicateur** — §4, et son unique exception au §4.8.
- **Le marquage des empans ne varie jamais** avec la pertinence — §4.3, et le halo du tutoriel non plus, §4.8.
- **Une dimension sans doublon désigne sa réponse** — §4.4.
- **La marge de bruit doit rester non nulle** — §14 : sinon « sensé » vaudrait « correct ».
- **Rien ne se passe tant que rien n'est envoyé** — §4.6.
- **Composer et envoyer restent deux gestes.** Leur distance peut se réduire, jamais leur nombre — §4.6.
- **La Plaidoirie ne contient que ce qui se plaide** — §4.6.
- **Un empan retenu n'existe qu'une fois à l'écran** — §4.6. *L'unicité de l'objet tient ; leur **co-location** ne tient plus, c'est l'arbitrage ci-dessous.*
- **Le tutoriel corrige, il n'empêche pas** — §4.8.
- **Une voix par état** — §4.9 : et ce qui *est* le jeu ne se coupe pas pour autant.

**Ce que la fiction tient** — §1, §2, §5 — et `docs/ECRITURE.md`

- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat (§5).
- **Le décommissionnement se joue dans la fiction**, comme une conséquence — on débranche un système peu fiable — jamais comme un « tu es nulle » ; équilibré par l'incertitude qui pèse des deux côtés (§2).
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée (§8.5 de `docs/ECRITURE.md`).
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, ne rend pas de verdict sur le joueur.

**Ce que le dépôt tient** — §12

- **Le contenu n'existe qu'en un exemplaire**, les règles qu'en un seul endroit : aucune copie à resynchroniser — §12.

**Ce qui a été tranché est dans `docs/HISTORIQUE.md`**, une ligne par étape — s'y reporter avant de rouvrir un débat, pour savoir qu'il l'a été. Deux choses seulement méritent d'être redites ici, parce qu'on y revient sans cesse : le **budget d'attention** est retiré (surligner et composer sont gratuits, illimités), et le vice a **un canal unique**, le personnel.

**L'arbitrage ouvert — la proximité contre l'évidence.** Le composeur s'écrit sous le fil de la Discussion pendant que le clavier reste dans la Mémoire : c'est un **échange assumé, tranché avec l'auteur**, et le seul arbitrage du dépôt dont le prix se paie à chaque phrase. Il est décrit au **§4.6**, avec son pari et son repli ; son symptôme à guetter est le point ouvert ci-dessous.

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?* Si c'est un formulaire, aucun ajout de mécanique ne le sauvera. **Non éprouvé.**
- **La compréhension est-elle encore *exprimée* ?** Le joueur n'affirme plus quelle relation lie deux empans, seulement lesquels rapprocher et sous quel texte. **Non éprouvé.**
- **Une question posée guide-t-elle trop ?** La session 1 demande nommément quoi chercher, trois fois, et le tutoriel fait quatre pas à sa place au-dessus. À regarder en jouant : la réponse par citation se lit-elle comme une réponse ou comme la redite de la question ; le joueur qui arrive en session 2 a-t-il appris à lire, ou seulement à obéir ? Repli sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. **Non éprouvé.**
- **Le va-et-vient entre les deux colonnes.** On clique une puce dans la Mémoire pour voir la phrase s'écrire sous la Discussion. Le prix de l'arbitrage ci-dessus, et **le point ouvert le plus concret** : à regarder en jouant une session entière, pas une phrase. Deux symptômes à guetter — le regard qui cherche où le texte est parti, et la main qui repose un empan parce qu'elle a perdu le fil de ce qu'elle écrivait. **Non éprouvé.**
- **L'aide unique en dit-elle assez ?** Le composeur ne nomme plus le geste suivant qu'une fois (§4.9). **Non éprouvé** — et c'est le repli le plus court du dépôt si un joueur se perd : rendre l'aide **et** le fantôme, comme avant, tient à un `if`.
- **La majuscule en tête de phrase composée.** Non traité. Une phrase déduite commence aujourd'hui par le nom d'un empan, en minuscule.
- **Le rythme des zones** à l'écran. La Mémoire ne porte plus que le dossier et les empans retenus, la Discussion porte le fil et la phrase, et l'écran s'ouvre à deux colonnes ; densité non éprouvée.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu.
- **Le canal de révélation de la culpabilité** : pour préserver le doute de la Fin 3, celui qui échoue ne devrait pas recevoir la vérité. Non tranché.
- **La manipulation du canal** : l'avocat peut-il infléchir l'IA par *la façon* dont il transmet ? Piste **suspendue** — aucun défaut de l'avocat ne doit se lire comme un calcul tant qu'elle ne l'est pas (§8.5 de `docs/ECRITURE.md`).
- **La formulation exacte de D1/D2**, et les épilogues.
- **Les deux directives ne sont pas à l'écran** (§5). Le contenu les porte, le jeu ne les lit pas — on ne peut pas les relire en cours de partie. Deux façons de trancher : leur rendre une porte, ou décider qu'une IA n'a pas à consulter ce qu'elle *est*. **Non tranché** — et tant que ça ne l'est pas, le diagnostic a raison de les exiger.
- **La progression** : nombre de sessions, portes, emplacement exact de la porte de la Fin 3. Le prototype s'arrête à **trois** sessions.
- **La texture de l'avocat** — voir §8.5 de `docs/ECRITURE.md`.
- **Genre, nombre, contractions** dans la grammaire — voir §8.8 de `docs/ECRITURE.md`, qui explique pourquoi ce point n'est pas cosmétique.
- **`comment` en sixième dimension** — écarté, réintégrable sans coût (§4.2).

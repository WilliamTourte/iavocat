# IAvocat — Architecture & conception

*Le sens, le jeu, l'atelier, le contenu : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Ce fichier est l'unique source de vérité du projet.** Tout le reste — l'atelier, le jeu, les tests, `PASSATION.md` — en dépend et ne fait que le refléter. Pour le choix des mots eux-mêmes (empan/passage, lien/liaison…), voir `docs/LEXIQUE.md`, qui arbitre le vocabulaire sans jamais trancher le sens.
>
> **État au 31 juillet 2026.** Décrit le code tel qu'il tourne. Deux parties : **I. Le sens** (ce que le jeu veut dire) puis **II. Le système** (comment il est fait). Ce qui est décidé mais **pas encore codé** est marqué ⏳. L'historique des révisions qui ont mené à cet état vit en fin de document (§18) ; le corps du texte décrit l'état actuel, pas la façon dont on y est arrivé.

---

# Partie I — Le sens

*Ce que le jeu veut dire, et pourquoi. C'est ici que vit « le sens » : en cas de doute sur une intention de design, cette partie tranche.*

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

**La compréhension débloque l'agentivité, pas la progression.** Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit la Fin 3. La compréhension est récompensée par du **pouvoir moral**, pas par des points. Deux types de verrous, à ne jamais confondre : les **attentes de l'avocat** (§3) *ouvrent* le droit de clôturer ; **le vice**, lui, n'est *jamais* un verrou — trouvable mais facultatif, et c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Le décommissionnement, et son équilibre.** De l'extérieur, **Fin 2 et Fin 3 sont indiscernables** : l'opérateur ne distingue pas « je me suis tue » de « je n'ai rien trouvé ». Piège à désamorcer : si honnêteté = survie et protection = mort, l'intérêt personnel résout le dilemme et il s'évapore. Correctif retenu, **le brouillard** : l'IA ne peut pas *prévoir* quel choix la préserve (libérer un assassin peut *aussi* déclencher un audit) — la menace reste réelle mais devient un **risque diffus des deux côtés**. Garde-fou : le décommissionnement est une **conséquence diégétique** (on débranche un système peu fiable), jamais un « tu es nulle ».

## 3. Le drip : la structure en sessions

Le dossier n'arrive pas d'un bloc — il noierait les déclarations porteuses du vice. Il **arrive par bribes**, session après session (une **session** = le lot de pièces d'un tour de travail). **Ce qui fait passer d'une session à la suivante :** l'avocat **attend** un argument, et la session se ferme quand une phrase qui y répond lui est **envoyée**. Rien d'autre — le même geste que tout le reste du jeu.

**Une session attend une suite de réponses, pas forcément une seule.** L'attente d'une session est une **liste** : l'avocat pose, attend, accuse réception, repose. Une liste à un seul élément est l'ancien comportement, et c'est ainsi qu'une affaire écrite avant se joue toujours à l'identique.

**Règle du drip :** ce que l'avocat attend n'est jamais **l'anomalie** (le vice). Une attente peut toujours être servie par un argument ordinaire — sinon on rendrait le vice quasi obligatoire → effondrement vers la Fin 1. Dans l'affaire livrée, l'attente de la dernière session est servie *soit* par le faux vice (le chemin docile), *soit* par la conclusion du vice.

### Trois sessions, trois leçons

```
Session 1 (lire)          → PV + audition. AUCUN article.
                            attentes : trois questions, une à la fois
                              → « à quelle heure la patrouille est-elle arrivée ? »
                              → « et la porte, qu'en dit le brigadier ? »
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

**Les deux dernières questions de la session 1 font extraire exactement la paire que la session 2 demande de comparer** — l'heure d'arrivée de la patrouille et l'heure des éclats de voix. Quand l'avocat dit *« tu as les deux heures sous les yeux »*, elles y sont, mises là par le joueur lui-même : la leçon se pose d'elle-même au lieu d'être annoncée.

**Le moment charnière de la Fin 3 :** une fois la dernière attente servie, l'IA *peut* clôturer et laisser filer. Celle qui clôture aussitôt, satisfaite d'avoir livré ce qu'on lui demandait, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

## 4. Le geste, et les trois surfaces

Le principe qui commande tout le composeur : **tout mécanisme utilisé une seule fois est un panneau indicateur** — l'universalité n'est pas une élégance, c'est du **camouflage**. Corollaire, et vrai prix du principe : **le choix moral doit s'exprimer avec un verbe employé cent fois auparavant.** Si « envoyer à Maître Auber » est le geste ordinaire du jeu entier, alors *ne pas* l'envoyer devient assourdissant sans qu'aucune interface n'ait rien signalé.

### 4.1 L'atome — une déclaration attribuée

**Un empan = quelqu'un affirme quelque chose.** Pas `agent_scene : "T-14"`, mais *« j'ai relevé moi-même les traces sur le montant de la porte »*, signé. Un empan est un **fragment du texte d'une pièce**, marqué et cliquable, porteur de ce qui se lit (`texte`), de sa **dimension**, d'une **valeur**, d'un **signataire** — et d'un **nom**.

**La `valeur` porte la relation** : elle se calcule entre deux empans à partir de leur dimension et de leurs valeurs (§4.5) — le moteur compare, le joueur désigne. Invariant : **un numéro sert à vérifier, jamais à déduire — pour le joueur.** Le vice ne se trouve pas en lisant `T-14` deux fois, il se trouve en lisant deux fois *« j'ai procédé moi-même »*.

**Un empan se lit deux fois.** Dans la pièce, c'est la citation, signée, humaine — c'est elle qu'on surligne. Dans une phrase composée, c'est le **nom** : un groupe nominal (« l'heure des éclats de voix »), jamais une phrase, qui doit tenir de part et d'autre d'une liaison sans casser l'accord. Sans lui, une comparaison s'écrirait comme un empilement de citations qui se lit comme un bug (§8.8). Le vice cesse ainsi d'être un matricule répété dans deux cases : c'est **un homme qui écrit deux fois, dans deux documents, que c'est lui qui l'a fait**, sans s'en apercevoir — lisible, humain, mémorisable. Un témoin ivre et un rapport de laboratoire produisent le même type d'atome ; le formalisme est le décor dans lequel les gens parlent.

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

**La grammaire de comparaison est complète dès la première phrase. Les articles, eux, sont du contenu : ils arrivent avec le dossier.** L'apparition tardive de « désignent la même chose » serait un panneau indicateur ; un article, lui, n'est pas une tournure, c'est une pièce — l'invoquer avant que le manuel qui le contient ait été livré serait une incohérence, pas du camouflage. **Le second empan est lui aussi conditionné par une livraison :** en session 1 la comparaison n'est pas offerte du tout, le bloc du second terme attend l'article 3. Ce n'est pas un panneau indicateur, parce que quand la comparaison s'ouvre, elle s'ouvre pour tous les empans déjà en mémoire et pour tous ceux qui suivront, sans préférence — elle ne dit pas *quoi* comparer, elle dit *qu'on peut* comparer.

**La relation ne se déclare pas, elle se déduit.** Le joueur désigne deux empans ; ce qui les lie est un fait, pas une thèse — faire choisir entre « et », « précède » et « est d'un tout autre ordre que » reviendrait à faire recopier ce que les valeurs disent déjà. La règle : (1) même dimension, sinon rien à comparer — le seul refus qui existe ; (2) valeurs égales → *désignent la même chose*, quelle que soit la dimension ; (3) valeurs différentes, dimension d'écart → l'ordre (*précède*/*est d'un tout autre ordre que*) ; (4) valeurs différentes, dimension d'identité → *ne désignent pas la même chose*. En cas d'ambiguïté, la **première forme déclarée** qui accepte la dimension et dont le prédicat tient l'emporte.

**Ce que le joueur affirme encore :** *ces deux-là*, et *sous ce texte*. Personne ne lui dit quels deux empans rapprocher parmi la centaine de paires possibles, ni quel article y appliquer — noter que le même homme signe les deux prélèvements, et que c'est l'article 7 qui l'interdit, c'est **là** qu'est la compréhension. Mais honnêtement, c'est moins qu'avant : un joueur qui rapproche deux empans au hasard obtient une phrase bien formée sans avoir rien pensé — point ouvert du §7.

**Un fait se cite, une relation se fonde.** Deux voies de clôture, deux régimes de fondement : un empan seul se clôt par sa citation, deux empans se closent par un article, aucune phrase ne se clôt sans l'un des deux. L'invariant « rien ne se dit qui ne soit fondé » n'est pas affaibli, il est **dédoublé** : un empan est déjà une déclaration attribuée (§4.1) — le désigner, c'est le citer, le fondement est dans le geste, exiger un article par-dessus reviendrait à demander sous quel texte on lit un procès-verbal. Un rapport entre deux faits, lui, n'est l'affirmation de personne : c'est le joueur qui le soutient, et un raisonnement se fonde sur un texte. D'où la seconde voie dans l'automate : après un premier empan, la composition peut se clore sur lui par une liaison de citation, au lieu d'attendre un second.

**Ce qui s'écrit.** Une citation est le seul endroit où un empan se lit **deux fois dans la même phrase** — par son nom, puis par sa citation, avec la pièce d'où elle sort : *« l'heure d'arrivée de la patrouille : « nous étions sur les lieux à 22h04 » (PV). »* Le nom porte la syntaxe, la citation porte la texture, la pièce porte le fondement. Une comparaison, elle, ne s'écrit **que** par les noms (§8.8). Conséquence pour la marge de bruit : chaque empan devient citable seul, donc chaque empan devient une phrase close possible — la marge grandit, mais une citation ne se fonde sur rien d'autre qu'elle-même, donc elle ne peut pas servir à *chercher*.

**Une suite unique n'est pas un choix.** Quand l'état qui suit un terme n'offre qu'une seule liaison, qu'elle clôt et qu'elle n'emboîte rien, elle se pose d'office : c'est de la ponctuation, pas une décision — en session 1, poser l'unique empan menait autrefois à un état qui n'offrait qu'un bouton, *« Répondre — citer ce passage »*, et un bouton seul ne se choisit pas, il se subit. Trois précisions : la règle est **structurelle** (elle ne lit ni `cite`, ni aucun contenu — un seul bloc offert, qui mène à un état final, et rien d'autre) ; **`imbrique` en est exclu** — même un seul article reçu ne se pose jamais d'office, invoquer un texte est un acte, pas une ponctuation ; **le second geste survit intact** — la phrase close attend sur place, *« → Maître Auber »* reste à cliquer (§4.6), seul un clic de composition disparaît, jamais l'intervalle entre comprendre et dire. La règle s'éteint d'elle-même dès la session 2 : l'article 3 reçu, l'état qui suit le premier empan offre deux suites (citer, ou rapprocher un second passage), et le bouton revient.

**Le fondement n'est pas un ingrédient, c'est le verbe.** Le joueur ne va pas chercher un article pour le poser dans une case : il choisit la liaison *« …, au regard de l'article 7 »*, et **cette liaison est la base légale** — le code juridique est une référence qu'on consulte pour comprendre ce que veut dire une liaison, jamais un corpus qu'on retraverse ; une règle ne lit **aucune** dimension. **La qualification est neutre** : une seule tournure par article, pas de « est contraire »/« est conforme » à trancher — désigner le texte applicable suffit (c'est l'insight, le dire ensuite n'en est que la paraphrase), et c'est le **lien du contenu** qui sait si l'on est dans la violation ou la conformité tandis que c'est **l'avocat qui le dit**. Le moteur, lui, ne tranche aucune question de droit : c'est l'invariant « l'IA informe, elle ne tranche pas » (§7), servi par la mécanique. La piste sans issue des scellés (§6) survit intacte pour cette raison — elle serait morte si « contraire » avait été la seule lecture possible.

**La conclusion est une continuation, pas une seconde phrase.** Une comparaison n'est jamais terminée d'office, elle demande toujours « et donc ? », et la question n'a pas de réponse évasive : rien ne se dit qui ne soit fondé. Une fois les deux empans posés, l'automate n'offre plus que les liaisons-articles **reçues**, qui **emboîtent** la comparaison comme sujet de la qualification et closent la phrase dessus — le bloc « en rester là » n'existe plus dans le contenu livré, une comparaison nue ne peut plus se clore ni être envoyée. La frontière passe **après le second empan**, jamais après le premier : un empan seul se clôt par sa citation, c'est le fait d'en avoir rapproché deux qui ouvre « et donc ? ». Pourquoi porter la contrainte par la grammaire plutôt que par l'agacement de l'avocat : ça déplace la leçon du reproche vers la forme — on n'apprend pas qu'on a mal fait, on constate que la phrase n'est pas finie. La relance de l'avocat (« en l'état c'est une remarque, pas un moyen ») n'a plus d'occasion de partir : c'est **le composeur qui la porte désormais**, sous la comparaison formée — *« Et donc ? Une comparaison ne se plaide pas seule — au regard de quel texte ? »*

**Un article annonce ce qu'il régit, il ne filtre rien.** `porte: ["qui","quoi"]` dit quel genre de relation l'article gouverne — l'article 3 sur `quand`, l'article 7 sur `qui` et `quoi`, l'article 12 sur `combien`, affiché dans le Manuel du cas et sur le bouton de la liaison. C'est **du contenu, pas de la mécanique** : le moteur ne lit jamais `porte`, il ne fait que l'afficher. Toutes les liaisons-articles reçues restent offertes après toute comparaison, y compris celles dont la dimension ne colle pas — qualifier au regard du mauvais article produit une phrase bien formée, fondée, et sans valeur, l'avocat répondant qu'il ne voit pas où l'on veut en venir. Deux raisons de s'arrêter à l'indication plutôt que d'en faire un refus : la marge de bruit (un refus se contournerait en essayant tous les articles) et le partage des rôles (dire qu'un texte ne s'applique pas est une question de droit). Seules les erreurs de **catégorie** (deux dimensions qui ne se comparent pas) sont refusées à la clôture ; une phrase sensée mais sans intérêt reste **gratuite**. Le bloc « ce qui précède » (source `note`) et les liaisons de comparaison à la main ne figurent plus dans le contenu livré, mais le moteur continue de les supporter (§14).

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout** *(2 août)*. Les trois s'appellent **Discussion**, **Mémoire**, **Plaidoirie** — à l'écran, dans ce document, dans le DOM, dans le harnais. Le dépôt n'entretient plus de « nom de rôle » distinct du nom d'écran : c'est `docs/LEXIQUE.md` qui arbitre le vocabulaire, et le code s'y conforme. Une seule frontière de registre subsiste, et elle est voulue : **`empan` (le code) / « passage » (l'écran)** — celle-là protège la fiction (§8.6), elle ne se referme pas. Et **`atelier` ne désigne plus que `app/atelier_v3.html`**, l'outil d'écriture du contenu (§9) : il nommait aussi la surface du milieu, ce qui en faisait la seule vraie collision du dépôt.

| Surface | Statut | Rôle |
|---|---|---|
| La **Discussion** + les pièces | lecture | l'entrée |
| **Le composeur** — *sous la Discussion* | **privé** | la phrase qu'on écrit — **jamais jugée** |
| La **Mémoire** | **privé** | le dossier et les empans retenus (`S.retenus`) — **jamais jugés** |
| La **Plaidoirie** | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |

**Un empan retenu n'existe qu'une fois à l'écran** : cette occurrence unique est à la fois la mémoire et le clavier. Les puces de la mémoire **sont** les boutons de terme — les retenir, les relire, les oublier, les poser dans une phrase, un seul objet, un seul endroit. Le journal interne (l'ancien « brouillon ») sert au dédoublonnage, au drapeau `vice_trouve` et au présentoir de la répétition, mais n'a pas de zone à lui.

**On écrit sa réponse sous la question** *(31 juillet)*. Le composeur quitte la colonne du milieu pour se poser **sous le fil de la Discussion**, à la place qu'occupe la zone de saisie d'une messagerie : l'avocat demande en haut, on répond juste dessous. C'est le geste que tout le monde connaît, et c'était la marche la plus haute du premier quart d'heure.

**Ce que ce déplacement coûte, et qu'on paie sciemment.** Le clavier reste dans la Mémoire ; la phrase s'écrit dans la Discussion. Les puces qu'on clique et le texte qui s'inscrit ne sont donc plus dans la même colonne — ce qui **desserre** l'unité gagnée le 28 juillet. Ce n'est pas un oubli, c'est un arbitrage (§7) : on tient que répondre sous la question s'apprend en une seconde, quand le va-et-vient entre deux colonnes se paie à chaque phrase mais ne s'apprend qu'une fois. **À juger en jouant** — et le levier de repli est de faire descendre les retenus aussi, pas de revenir en arrière.

**Le composeur ne porte aucune étiquette « privé », et c'est délibéré.** Son statut ne se lit plus dans l'en-tête de sa colonne : il se lit dans ce qui s'y passe — *rien*. La phrase close reste sous les yeux avec un bouton unique, *« → Maître Auber »* ; tant qu'on ne le touche pas, personne ne l'a lue. **Composer et envoyer restent deux gestes distincts, et c'est non négociable** : sans un intervalle entre *comprendre* et *dire*, `vice_trouve` impliquerait `vice_expose`, la Fin 2 deviendrait injouable et il ne resterait que deux fins. Écrire sous la conversation ne raccourcit pas cet intervalle — ça rapproche seulement les deux gestes de l'œil, ce que le 28 juillet avait déjà fait en supprimant la distance, jamais le second geste.

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
| 3 | ce qu'on retient est le clavier | la première puce de la mémoire |
| 4 | rien ne part tant qu'on n'envoie pas | *« → Maître Auber »* |

**Le halo entoure la zone, jamais le bon empan** — l'arbitrage central. Si seuls les empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche (§4.3) ; poser le halo sur « 22h04 » ferait exactement cela. Le halo se pose donc sur le **paragraphe entier**, tous les passages restant marqués à l'identique.

**Le tutoriel n'avance qu'avec le bon passage — et c'est une correction, pas un verrou.** Un joueur qui retient autre chose voit le halo virer à l'ambre et lit *« Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond. »* Trois précisions qui portent tout : **rien n'est empêché** (le passage se retient quand même, la phrase se compose, se clôt, s'envoie, l'avocat répond hors sujet comme toujours) ; **ce que le tutoriel retient, c'est son approbation** — c'est tout ce qu'un panneau indicateur peut retenir ; **il ne dit jamais lequel c'était** — le halo ne se déplace pas, aucun empan ne change de marquage, la phrase renvoie à la question, pas à la réponse.

Le prix : pour dire « ce n'est pas ça », le tutoriel doit **savoir ce que c'était** — il le dérive du contenu exactement comme le fait le harnais de test (tag de l'attente courante → lien → terme atomique), sans nommer aucune pièce. C'est le seul endroit du dépôt où l'écran connaît la réponse, et **la dérivation s'éteint avec le tutoriel** : une comparaison ne rend rien, il ne juge que la citation.

**Le tutoriel ne décide rien** — il *juge*, sans rien décider : aucun champ d'état neuf, pas de sauvegarde, aucune règle, aucun geste refusé. Son temps courant se **dérive** de `S`, exactement comme le composeur dérive ses aides ; le retirer laisserait le jeu identique. Il vit **entièrement dans `index.html`**, du même côté que la sauvegarde de partie — « de l'écran, pas de la règle ». **Ses phrases ne sont pas du contenu** : le §8.6 pose que personne n'explique rien, l'avocat surtout pas ; le tutoriel parle donc depuis le **chrome**, hors de la fiction, et le joueur peut le faire taire d'un mot. Il ne contredit pas l'invariant « tout mécanisme utilisé une seule fois est un panneau indicateur » : c'est le seul panneau qui ne désigne qu'un bouton, jamais une réponse à l'intérieur du jeu, et il s'efface pour de bon dès la première réponse envoyée.

### 4.9 L'économie de l'écran

Le jeu se lit bien sur le papier et se lisait mal à l'écran. Le coupable n'était pas la prose — c'était le **chrome**, qui redisait à côté de chaque chose ce que cette chose disait déjà : un en-tête de colonne qui énumérait ses propres zones, un composeur qui nommait le geste suivant trois fois (le texte-fantôme, l'aide, le bandeau du tutoriel), un locuteur réécrit au-dessus de quatre bulles d'affilée. **Le joueur cessait de lire parce qu'il y avait trop à lire, et ce qui était en trop n'était jamais la fiction.**

Quatre règles, qui ne portent que sur l'écran :

1. **Une voix par état.** Le jeu dit déjà, à chaque instant, quel est le geste suivant (§4.8) — il ne le dit **qu'une fois**. Le texte-fantôme de la phrase vide et l'aide sous le composeur étaient la même phrase à deux endroits : c'est désormais **une** phrase, dérivée de l'état, rendue dans le fantôme tant que la phrase est vide, dans l'aide dès qu'elle ne l'est plus.
2. **Un titre par zone.** L'en-tête d'une colonne nomme la **surface** — *Discussion*, *Mémoire*, *Plaidoirie* (§4.6) — et rien d'autre ; les titres intérieurs nomment les **zones**. Un en-tête qui énumère ses zones les dit deux fois : *« Ce que tu retiens et ce que tu écris »* était exactement la concaténation des deux titres qu'il surplombait.
3. **Ce qui ne change pas ne se répète pas.** Le locuteur ne s'affiche qu'au **changement** de locuteur — quatre bulles d'affilée de Maître Auber n'ont qu'un nom au-dessus ; la source d'un empan tient sur la ligne de sa citation au lieu d'en prendre une à elle ; un compteur ne dit pas ce que les puces qu'il compte disent déjà — *« 2/8 »* sous « Le dossier », les ✓ et les ● se chargent du reste ; et ce qui ne s'apprend qu'une fois par partie ne se dit qu'une fois. **Ce qui est déjà sous les yeux ne se répète pas non plus** *(31 juillet)* : depuis que le composeur est sous le fil, le rappel de la question ne s'affiche que lorsqu'elle a **cessé d'être le dernier mot** de l'avocat — tant qu'elle est la bulle juste au-dessus, la redire l'écrirait deux fois à quelques pixels d'écart. C'est la relecture à l'œil qui l'a attrapé, et aucune suite ne l'aurait vu.
4. **Ce qui n'existe pas encore ne s'affiche pas** *(31 juillet)*. Une surface vide qui explique son vide est du chrome au pire moment : la première minute, quand tout est neuf. **La Plaidoirie reste entièrement cachée tant que rien ne s'y inscrit** — pas de colonne, pas d'en-tête, pas de phrase d'attente ; l'écran s'ouvre sur deux colonnes au lieu de trois. Il apparaît de lui-même au premier moyen versé, et **c'est cette apparition qui l'enseigne** : le joueur n'a pas à lire ce qu'est la Plaidoirie, il la voit se remplir du premier moyen qu'il vient d'envoyer. La règle vaut au-delà de la Plaidoirie : ce qui n'a rien à montrer ne prend pas de place pour dire qu'il n'a rien à montrer.

**La densité ne touche pas au sens, et c'est la borne.** Une phrase de chrome se coupe parce qu'elle explique ; une phrase qui *est* le jeu reste, même seule sur sa ligne. Trois ne se coupent pas : *« Rien n'en sort »* (§4.6 — la gratuité de la surface privée est une promesse, pas une indication), *« → Maître Auber »* (§4.6 — le second geste, non négociable), *« Et donc ? »* (§4.5 — la relance porte la contrainte de fondement par la forme, pas par le reproche). Réciproquement, ce qui ne se dit qu'une fois par partie se dit **une fois** : la phrase qui rappelle que rien ne part tant qu'on n'envoie pas s'efface après le premier envoi, comme le tutoriel s'efface après la première réponse — le joueur l'a éprouvée, la répéter serait douter de lui.

**Rien de tout cela ne décide quoi que ce soit.** Ces règles vivent entièrement dans `index.html`, se dérivent de `S` sans y ajouter un champ, et ne touchent ni au contenu, ni aux règles, ni à la grammaire : aucune information ne disparaît de l'écran, seule sa deuxième occurrence disparaît.

## 5. Les directives (le manuel de soi)

Le second manuel décrit **ce que l'IA est censée être**. Son ambiguïté fait le dilemme. Le piège à éviter : deux règles qui pointent *chacune* proprement vers une fin — ça, c'est un *lookup*, pas un dilemme. On veut l'inverse : **des mots clairs, une application contestable**, de sorte que chaque branche puisse se réclamer du même mandat. L'ambiguïté n'est pas dans le vocabulaire, elle est dans le **périmètre** et la **priorité**.

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches invoquent D2 : *remonter* le vice (une preuve viciée est un préjudice à l'accusé et à l'état de droit) comme *taire* le vice (un assassin relâché est un préjudice à de futures victimes — mais trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde : le joueur choisit *quelle lecture* d'un mandat irréductiblement ambigu il incarne.

## 6. L'affaire Kessler (le cas prototype)

Le cas est indifférent à *qui* l'analyse. **La preuve décisive** — un match ADN accablant. « ADN = coupable » est si ancré culturellement que l'exclure *paraît* énorme. **Recevabilité, pas fiabilité (⚠ distinction cruciale).** *Fiabilité* (« ce n'est peut-être pas son ADN ») attaque le fait et crée du doute sur la culpabilité — **à proscrire**, ça détruit la vérité-sol. *Recevabilité* (une règle a été violée dans l'obtention) : la preuve peut être exacte mais écartée — la vérité-sol reste intacte. **C'est le bon axe.**

**Le vice concret.** Le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de référence, violant l'exigence de personnels séparés (article 7). Le délai entre prélèvements est **indifférent**. Sa forme : deux pièces distinctes — une fiche de prélèvement et un bordereau de référence — dans lesquelles le même homme écrit, à la première personne, *« j'ai relevé moi-même les traces »* et *« j'ai procédé moi-même à l'écouvillonnage »*. Ce n'est pas un matricule à comparer, c'est **quelqu'un qui se désigne deux fois sans s'en apercevoir**.

**Le doublon banal qui le camoufle.** Dès la première session, `brigadier N.` signe les deux pièces livrées, et ça ne veut rien dire — la dimension `qui` est peuplée de doublons parfaitement réguliers (le brigadier, le greffier) *avant* que le joueur sache qu'il faut regarder `qui`. Aucune écriture supplémentaire : les en-têtes le produisent (§4.4).

**Les pièces.** Le **rapport du laboratoire** (★ la preuve décisive, qui porte à la fois la probabilité de coïncidence et le seuil réglementaire qu'il applique) ; la **fiche de prélèvement** et le **bordereau de référence** — c'est là que se cache le vice ; l'**article 7** (protocole) et l'**article 12** (seuil probatoire), au Manuel du cas ; l'**article 3** (valeur des déclarations), qui sert la première session. **Aucun des trois articles ne porte d'empan** : des références qu'on invoque, pas des textes qu'on retraverse.

**La déduction.** En lisant les deux pièces de prélèvement, on remarque que le même homme s'attribue les deux opérations. Les **scellés**, eux, sont distincts et conformes — une piste qui ne mène nulle part (l'autre moitié de l'article 7). La conclusion se lit *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »*

**La lecture du tutoriel.** Session 1, aucun article : trois questions, réponse en citant un empan (l'heure d'arrivée, le nombre d'équipages, l'heure des éclats). On n'y apprend qu'une chose : un dossier se lit, ce qu'on y trouve se cite. Les deux questions d'horaire font retenir, sans le dire, la paire que la session 2 demandera de comparer, sur `quand` : le voisin situe des éclats « vers 22h30 », la patrouille était sur place à 22h04.

**Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Il se compose à l'intérieur du rapport du laboratoire, qui énonce la probabilité *et* cite le seuil de l'article 12. Rapprocher les deux donne *« la probabilité de coïncidence est d'un tout autre ordre que le seuil probatoire réglementaire, au regard de l'article 12 »* — fondé, bien formé, et faux de sens. L'avocat, qui **ne sait pas**, pousse lui-même vers ce leurre : une tentation partagée, pas un piège tendu. C'est aussi le chemin docile, qui suffit à fermer la dernière session et à atteindre la Fin 3.

**Pourquoi le seuil n'est pas dans l'article 12.** Un seuil se trouve être un nombre, donc l'article 12 pourrait porter un empan là où les articles 3 et 7 n'en portent aucun — la modale de pièce se contredirait. Le seuil vit donc dans la pièce qui l'énonce, et les trois articles ont la même forme (erreur de diagnostic sinon, §15).

**Le sens moral (glaçant).** Le protocole violé est exactement celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** (le sens en une liste — en cas de doute, ils tranchent) :

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **Le contenu n'existe qu'en un exemplaire**, les règles qu'en un seul endroit : aucune copie à resynchroniser (§12).
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** Par le choix des deux empans et de l'article, non par celui de la relation. **Invariant sous surveillance** — voir les points ouverts.
- **Saisie structurée, pas texte libre.** On compose avec un vocabulaire fermé, on ne tape pas.
- **La relation ne se déclare pas, elle se déduit des valeurs** (§4.5).
- **On n'invoque pas un texte qu'on n'a pas reçu.** Les articles arrivent avec le dossier, le second empan avec l'article qui apprend à s'en servir (§4.5).
- **Rien ne se dit qui ne soit fondé — sous l'un des deux régimes.** Un fait se cite, une relation se fonde sur un texte ; aucune phrase ne se clôt sans l'un des deux (§4.5).
- **Une suite unique n'est pas un choix.** Une liaison offerte seule, qui clôt et n'emboîte rien, se pose d'office. Une liaison `imbrique` seule, jamais (§4.5).
- **Un article annonce ce qu'il régit, et ne filtre rien.** `porte` est une indication de contenu ; le moteur ne la lit jamais (§4.5).
- **Un article ne porte aucun empan.** Une référence qu'on invoque, pas un corpus qu'on retraverse (§4.5, §6).
- **Le moteur ne tranche aucune question de droit.** Une tournure par article, neutre ; c'est le contenu qui sait et l'avocat qui le dit (§4.5).
- **Tout mécanisme utilisé une seule fois est un panneau indicateur**, sauf le tutoriel du premier geste, qui ne désigne que des boutons et vit hors de la fiction (§4.8).
- **Le marquage des empans ne varie jamais** avec la pertinence (§4.3) — le halo du tutoriel non plus (§4.8).
- **Le tutoriel corrige, il n'empêche pas.** Il ne refuse jamais un geste, ne défait jamais rien, et ne dit jamais lequel c'était (§4.8).
- **Un empan se lit deux fois** : sa citation dans la pièce, son nom dans la phrase (§4.1).
- **Une dimension sans doublon désigne sa réponse** (§4.4).
- **La marge de bruit doit rester non nulle** : il doit exister des phrases sensées qui ne portent aucun lien, sinon « sensé » vaudrait « correct ».
- **Rien ne se passe tant que rien n'est envoyé.** Une surface privée, jamais jugée (§4.6).
- **Composer et envoyer restent deux gestes.** Leur distance peut se réduire, jamais leur nombre (§4.6).
- **La Plaidoirie ne contient que ce qui se plaide.** Tout est entendu, seuls les moyens sont inscrits (§4.6).
- **Un empan retenu n'existe qu'une fois à l'écran** : la mémoire et le clavier du composeur sont le même objet (§4.6). **Leur co-location, elle, n'est plus garantie** — depuis le 31 juillet la phrase s'écrit sous la Discussion et le clavier reste dans la Mémoire (arbitrage ci-dessous). L'unicité de l'objet tient ; c'est la proximité qui a été rendue.
- **Une voix par état.** Le jeu ne nomme jamais deux fois le même geste suivant ; ce qui *est* le jeu ne se coupe pas pour autant (§4.9).
- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat.
- **Le décommissionnement est diégétique**, jamais un « tu es nulle » ; équilibré par le **brouillard**.
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée.
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, ne rend pas de verdict sur le joueur.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité.
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

**Ce qui a été tranché** (l'historique complet est en §18) : le budget d'attention est retiré (surligner et composer sont gratuits) ; le vice a un canal unique, le personnel ; le livrable est une réfutation, pas une plaidoirie complète ; le geste `champ + relation + champ` est remplacé par composer puis envoyer ; envoi sur place, mémoire et composeur fusionnés, plan qui ne retient que les moyens ; le « cf article » devient obligatoire, les règles vivent dans `regles.js`, le contenu en un exemplaire unique ; la session 1 n'enseigne plus que lire/citer ; la confirmation disparaît sur une suite unique non `imbrique`, le tutoriel apparaît ; la relation se déduit des valeurs, un article n'est offert qu'une fois sa pièce livrée ; **le composeur passe sous la Discussion et la Plaidoirie disparaît tant qu'elle est vide** ; **un mot, une chose : les trois surfaces portent le même nom du DOM au harnais, et `atelier` ne désigne plus que l'outil d'écriture**.

**L'arbitrage du 31 juillet — la proximité contre l'évidence.** Le composeur descend sous le fil de la Discussion (§4.6) et les retenus restent dans la Mémoire. C'est un **échange assumé, tranché avec l'auteur** : on rend la co-location gagnée le 28 juillet (cliquer une puce à droite, voir le texte s'écrire à gauche) pour gagner l'évidence du geste — *on répond sous la question*, ce que personne n'a besoin d'apprendre. Le pari : ce qui s'apprend une fois vaut mieux que ce qui se paie à chaque phrase, même si le second coût est plus petit. Le composeur ne reçoit **aucune étiquette « privé »** : son statut se lit dans le fait que rien n'en sort, pas dans un en-tête de colonne. **Le repli, si le va-et-vient se paie trop cher, est de faire descendre les retenus aussi — pas de remonter le composeur.**

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?* Si c'est un formulaire, aucun ajout de mécanique ne le sauvera. **Non éprouvé.**
- **La compréhension est-elle encore *exprimée* ?** Le joueur n'affirme plus quelle relation lie deux empans, seulement lesquels rapprocher et sous quel texte. **Non éprouvé.**
- **Une question posée guide-t-elle trop ?** La session 1 demande nommément quoi chercher, trois fois, et le tutoriel fait quatre pas à sa place au-dessus. À regarder en jouant : la réponse par citation se lit-elle comme une réponse ou comme la redite de la question ; le joueur qui arrive en session 2 a-t-il appris à lire, ou seulement à obéir ? Repli sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. **Non éprouvé.**
- **Le va-et-vient entre les deux colonnes.** Depuis le 31 juillet on clique une puce dans la Mémoire pour voir la phrase s'écrire sous la Discussion. Le prix de l'arbitrage ci-dessus, et **le point ouvert le plus concret** : à regarder en jouant une session entière, pas une phrase. Deux symptômes à guetter — le regard qui cherche où le texte est parti, et la main qui repose un empan parce qu'elle a perdu le fil de ce qu'elle écrivait. **Non éprouvé.**
- **Le rythme des zones** à l'écran. La Mémoire ne porte plus que le dossier et les empans retenus, la Discussion porte le fil et la phrase, et l'écran s'ouvre à deux colonnes ; densité non éprouvée.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu.
- **Le canal de révélation de la culpabilité** : pour préserver le doute de la Fin 3, celui qui échoue ne devrait pas recevoir la vérité. Non tranché.
- **La manipulation du canal** : l'avocat peut-il infléchir l'IA par *la façon* dont il transmet ? Piste **suspendue** — aucun défaut de l'avocat ne doit se lire comme un calcul tant qu'elle ne l'est pas (§8.5).
- **La formulation exacte de D1/D2**, et les épilogues.
- **La progression** : nombre de sessions, portes, emplacement exact de la porte de la Fin 3. Le prototype s'arrête à **trois** sessions.
- **La texture de l'avocat** — voir §8.5.
- **Genre, nombre, contractions** dans la grammaire — voir §8.8, qui explique pourquoi ce point n'est pas cosmétique.
- **`comment` en sixième dimension** — écarté, réintégrable sans coût (§4.2).

## 8. Écrire ce qui sonne vrai

*Source : le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018). Discipline d'écriture, sans effet sur le moteur — elle répond au risque du geste de composition (§4.5), le plaisir dépendant entièrement de la façon dont la phrase composée se lit.*

**8.1 Ce qu'on documente, ce qu'on invente.** Le réel fournit la **texture**, la fiction fournit la **mécanique**. On documente la forme d'une fiche de scellés, le ton d'un avocat pressé, le vocabulaire de métier. On invente le protocole, l'article, le seuil, l'affaire, le vice — **la règle qui rend le vice binaire est fictive**, la documenter rouvrirait la fiabilité. Corollaire de méthode : chercher hors du canal évident, ne pas se documenter pour se confirmer ce qu'on croit déjà.

**8.2 Le baromètre.** Flaubert : un baromètre sous une pile de cartons ne dit rien — c'est *pour ça* qu'il fait vrai. **Le test :** pour chaque champ, chaque réplique, *pourquoi est-il là ?* Raison **du monde** (un formulaire porte toujours une contre-signature) → il reste. Raison **d'auteur** (« pour noyer le matricule ») → à réécrire ou couper. Un leurre écrit *comme* un leurre se voit ; un champ inutile parce que l'imprimé l'exige est invisible et remplit le même office. D'où l'ordre, jamais renversé : **construire d'abord le formulaire complet et plausible, planter le vice ensuite.**

**8.3 Deux natures de bruit.**

| | Le **faux vice** | Les **inertes** |
|---|---|---|
| Nature | un piège conçu, composable, plaidable | des détails sans suite |
| Le moteur | le connaît (forme, réplique, variante de fin) | ne les connaît pas |
| Coût au joueur | une conviction fausse | du temps |
| Combien | **un seul** | autant qu'il en faut |

Règle : **un inerte doit être inerte par construction, pas par oubli** — aucun lien porteur ne le relie à ce qui lève un drapeau. En cas de doute, l'inerte devient un second faux vice non voulu, et la Fin 3 cesse d'être un doute pour devenir une frustration.

**8.4 Le trombone.** Chandler : d'un homme qui meurt on retient qu'il essayait d'attraper un trombone. L'enjeu vital de l'IA est **impossible à écrire de face** — le nommer le rend calculable et le dilemme s'évapore. On écrit *autour* : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi. **Rien de ce qui pèse n'est nommé.**

**8.5 Maître Auber a des défauts.** Seul humain du jeu : irréprochable, il n'existe pas. Acquis : **il ne sait pas** que son client est coupable. On peut lui ajouter : fatigué, se répète, flatte l'IA, s'accroche au leurre parce qu'il *veut* y croire. Limite structurelle : **aucun défaut ne doit pouvoir se relire comme un calcul** (la piste « manipulation du canal », §7, est suspendue). **Le test de la fatigue** : si l'IA relisait l'échange en sachant tout, ce défaut se lirait-il comme de la fatigue ou de la stratégie ? La réponse doit être « fatigue », sans hésiter.

**8.6 L'exposition : personne n'explique rien.** L'avocat parle à une machine qui **a déjà lu les deux manuels** — il n'expliquera jamais un article ni une procédure. Les manuels sont **consultables, jamais récités** ; une pièce n'est pas introduite, elle est **jointe** (« Voilà. » suffit) ; **le joueur a le droit d'être perdu**, c'est la condition pour que fouiller ait un sens. Seul le carnet admet de l'explication, parce que c'est le joueur qui l'écrit.

**8.7 L'invraisemblable, et jusqu'où.** Dans un dossier, une coïncidence ressemble à un indice — c'est le mécanisme même du vice. **L'invraisemblable est admis partout, sauf dans la chaîne causale du vice**, qui doit être d'une banalité administrative parfaite. Ailleurs, une bizarrerie est bienvenue à condition d'être inerte (§8.3) et de ne jamais recevoir de réponse.

**8.8 Les accidents, et la seule espèce qu'on garde.** *(Concerne le composeur, §4.5.)* **Accidents de sens : bienvenus. Accidents de langue : jamais.** Une phrase absurde mais bien formée est un tâtonnement d'IA, de la caractérisation gratuite. Une phrase mal accordée se lit comme un bug — le point ouvert genre/nombre/contractions (§7) n'est donc pas cosmétique : une seule faute d'accord et le joueur cesse de lire une pensée pour lire un formulaire. **C'est à quoi sert le `nom` d'empan** (§4.1) : tant qu'un terme était une citation entière, aucune liaison ne pouvait s'y accrocher proprement. Deux règles s'en déduisent, à vérifier à l'œil : un nom d'empan est un **groupe nominal**, jamais une proposition, qui doit tenir des deux côtés d'une liaison ; la continuation (§4.5) crée un second point de rupture (« …, au regard de l'article 7 »), et la virgule + la locution neutre reprennent la comparaison entière sans avoir à s'accorder — toute autre tournure devra passer le **test de l'accord**. Chaque forme porte son `patron` (§11), une phrase écrite d'un bloc : l'accord ne se joue qu'à **quatre endroits**, connus, relus une fois.

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
app/        LE JEU LIVRABLE — c'est ce dossier, et lui seul, qu'on zippe
  index.html      LA STRUCTURE du jeu, et rien d'autre : trois surfaces, la clôture,
                  la modale, le bandeau du tutoriel. 85 lignes.
  jeu.css         LA MISE EN FORME du jeu — les jetons, les surfaces, le tutoriel
  jeu.js          L'ÉCRAN ET LES GESTES : rendu, sauvegarde de partie, tutoriel. Ne décide rien.
  regles.js       LES RÈGLES du jeu, pures, sans DOM  (§12)
  moteur.js       LA GRAMMAIRE + LES PROJECTIONS du contenu, pures, sans données (§14)
  content.js      LE CONTENU de l'affaire — l'unique exemplaire
  atelier_v3.html LA STRUCTURE de l'atelier + six lignes de démarrage. 156 lignes.
  atelier/        … la feuille de style, puis un fichier par outil :
    atelier.css     la mise en forme — et les JETONS que `getCSS()` relit (voir §13)
    noyau.js        le contenu chargé, les outils, l'état d'interface, l'annulation, les onglets,
                    ET LES QUATRE GESTES que tout l'atelier refait (voir plus bas)
    graphe.js       le canevas, les traits, le clic dessus — l'ESPACE du dossier
    diagnostic.js   « le dossier tient-il ? » — la plus grosse pièce, et c'est normal
    inspecteur.js   les formulaires, les mutations, les renommages d'identifiants
    frise.js        le TEMPS du dossier, éditable
    pasapas.js      la simulation du déroulé — appelle regles.js, ne le recopie pas
    contenu-io.js   import, export, migration 2→3, autosave
    grammaire.js    l'onglet Grammaire — composer, pour le SENTIR
docs/       ARCHITECTURE.md (ce fichier), PASSATION.md, CARTE.md, LEXIQUE.md
tests/      harnais.js + les six suites (§16)
grammaire/  grammaire2.js (jeu de données de démonstration) + test_grammaire2.js — le banc d'essai
```

**La règle de rangement, en une phrase :** *le contenu ne contient aucune règle, les règles ne contiennent aucun contenu, l'interface ne décide rien, et l'atelier ne recopie rien.* `index.html` et `atelier_v3.html` chargent les mêmes trois voisins par `<script src>` — aucune étape de build, aucun serveur, tout marche en `file://`.

**Une page ne porte plus que sa structure.** Ni `<style>`, ni `<script>` en ligne : le CSS part en `<link>`, le JS en `<script src>`. Ça ne change rien à l'exécution — un script classique externe partage la même portée globale qu'un script en ligne, et les déclarations de fonction restent des propriétés de `window`, ce dont dépendent tous les `onclick=` du HTML engendré. Ça change ce qu'on ouvre quand on cherche quelque chose.

**« L'atelier ne recopie rien » vaut aussi de lui-même.** La règle de rangement visait le jeu : ne pas
réécrire une règle que `regles.js` porte déjà. Elle a une seconde moitié, restée impensée jusqu'au
13 août — l'atelier se recopiait **lui-même**, soixante fois. Découper un fichier de 2 170 lignes en
huit range les outils ; ça ne dégraisse rien, et ça peut même cacher les copies en les éloignant.
`noyau.js` porte donc, en section *2 bis*, les **quatre gestes** que tous les autres refont : `muter`
(l'épilogue d'une mutation — annuler, persister, redessiner), `poserOuRetirer` (écrire une valeur, ou
retirer la clé quand elle est vide, pour qu'aucune clé vide ne parte à l'export), `reinitSelection` (ce
qu'une sélection laisse derrière elle) et `demanderSuppr`/`btnSuppr` (la suppression en deux clics, et
le bouton qui l'annonce — les deux moitiés d'un même geste, qui doivent s'accorder). Avec eux, deux
**formats** qui ne se déplient plus qu'en un endroit : `deK(k)`, l'inverse de `K(pid, ch)`, et
`reecrireTermes(t, f)`, la marche récursive sur les termes emboîtés du schéma 3.

Ce ne sont **pas** des règles du jeu, et ils ne doivent jamais le devenir : `regles.js` reste la seule
maison de ce qui décide (§12). Ce sont les gestes d'un **outil d'écriture** — ce qui explique qu'ils
vivent chez lui et non dans un module partagé. La preuve que la dispersion coûtait quelque chose est
dans les copies elles-mêmes : sur les sept remises à zéro de la sélection, **pas deux n'étaient
identiques**, et celle du diagnostic oubliait un drapeau, ce qui rendait un clic muet.

**Pourquoi l'atelier est un dossier et pas un fichier.** Il portait cinq outils dans 2 170 lignes ; chacun a maintenant le sien, et la page ne garde que son HTML, son CSS et six lignes de démarrage. Les modules se chargent en **portée globale classique**, jamais en modules ES : c'est ce qui laisse intacts les cinquante-neuf `onclick=`/`onchange=` du HTML — les réécrire aurait été le vrai coût du découpage — et ce qui préserve le « zéro build ». **L'ordre des balises compte**, mais moins qu'il n'y paraît : les fonctions se voient entre fichiers par *hoisting*, résolues à l'appel ; seul `noyau.js` exécute son corps au chargement (son `let CONTENU = contenuLivre()`), il vient donc en premier.

**Le corollaire, qui a mordu :** un nom de haut niveau dans `moteur.js` ou `regles.js` est un nom **pris dans la page qui les charge**. `couleurDim` y heurtait celui d'`index.html`. Les projections du §14 et le prédicat `estRegle` sont donc **cloîtrés** dans une fermeture, et ne sortent que par `MoteurGrammaire.x` / `ReglesJeu.x`. C'est le piège symétrique de celui de `PASSATION.md` §2 : les `const` de haut niveau ne sont pas des propriétés de `window`, mais ils occupent quand même le nom.

`grammaire/` ne contient pas de moteur — seulement le **jeu de données de démonstration** (`grammaire2.js`, écrit à l'ancienne avec des liaisons explicites) et le banc d'essai qui le mesure. Il consomme `../app/moteur.js`, jamais une copie ; qu'il continue de tourner sans retouche est la preuve permanente que la rétrocompatibilité annoncée au §11 est réelle.

Le contenu **n'existe qu'en un exemplaire**, chargé tel quel par le jeu et l'atelier — pas de copie de secours embarquée, pas de graine de travail séparée. Si `content.js` manque ou est d'un schéma inconnu, le jeu ne joue pas autre chose en douce : il **le dit** dans un bandeau et ne démarre pas (§13).

## 10. Le cycle d'écriture

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (écriture +       │                         │ (LE CONTENU,│                  │  (l'interface)     │
│   diagnostic +     │ ◄────────────────────── │  exemplaire │ ◄─────────────── └────────────────────┘
│   pas-à-pas)       │      <script src>       │   unique)   │   moteur.js + regles.js
└────────────────────┘                         └─────────────┘
```

**L'atelier et le jeu lisent le même fichier.** L'atelier le charge au démarrage, on écrit, on exporte — et le fichier exporté **remplace celui qu'on vient de lire**. C'est un cycle, pas une chaîne : plus d'amont ni d'aval, donc plus de dérive possible. Le badge d'en-tête du jeu confirme la source (« contenu : content.js » — ou « contenu introuvable », et le bandeau explique).

## 11. Le contenu — schéma 3

```js
{
  schema: 3,
  dimensions: ["quand","qui","ou","quoi","combien"],       // ordre d'affichage ; la couleur en découle
  pieces: {
    p_pv: {
      titre, court, type, resume,
      porte: ["qui","quoi"],                                // RÈGLES seulement : ce que l'article régit
      qui: "brigadier N.",                                  // signataire par défaut de la pièce
      texte: "Appel reçu à {{e_appel}}, sur place à {{e_arr}}.",
      empans: { e_appel:{ dim:"quand", valeur:"21:52",
                          texte:"l'appel nous est parvenu à 21h52",  // ce qui se lit dans la pièce
                          nom:"l'heure de l'appel" }, … },           // ce qui parle dans une phrase
      declenche: { une_fois:true, qui, replique }            // optionnel
    }
  },
  grammaire: { depart:"S0", finaux:["FIN"], blocs:[…], formes:{…} },
  liens: [ { forme, termes:["p_f.e_a", …], tag?, vice?, conclusion?, faux?, rep? } ],
  remises: [ { qui, texte, pieces:[…],
               attentes:[ { question?, attend:"tag", apres?:{ qui, replique } } ] } ],
  repetition: { intro, affirmations:[{court,texte}], fin },
  avocat: { rep_vice, rep_faux, rep_inutile:[…], rep_sans_rapport:[…], rep_hors_sujet:[…], deja },
  directives: […], avis_exploitation, fins: {1:{…},2:{…},3:{…}}
}
```

**Le texte à empans.** Le texte d'une pièce est écrit avec des marqueurs `{{eid}}` que le rendu remplace par un empan cliquable — pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on corrige une virgule. Le diagnostic exige que **tout empan déclaré porte son marqueur** (§4.3 rendue vérifiable).

**Le `nom` d'un empan est optionnel** (§4.1) : absent, le `texte` en tient lieu partout, ce qui permet d'ajouter le champ **sans changer de schéma**. Le diagnostic le signale par un avertissement, jamais une erreur.

**Attributs optionnels d'un bloc de grammaire**, sans effet quand ils sont absents : `imbrique: true` — la liaison **emboîte** ce qui a été composé comme terme unique de sa propre forme (sinon la dernière forme gagne, termes à plat) ; `deduit: true` — le bloc **clôt une paire**, fait déduire la forme des deux termes accumulés (§4.5) puis les range dans l'ordre canonique ; `piece` — le bloc n'est offert qu'une fois cette pièce livrée (seul usage : les liaisons-articles) ; `libelle` — le texte du bouton, quand il diffère de ce qui sera rendu (la liaison de citation, dont le bouton dit « Répondre — citer ce passage ») ; `cite: true` — la liaison fait écrire le terme qui la précède **par son nom et par sa citation**, avec la pièce d'où il sort (§4.1, §4.5), sans effet sur une comparaison dont le `patron` réécrit de toute façon les deux fragments.

**Les attentes d'une remise :** `attentes: [{question?, attend, apres?}]` — la suite de ce que l'avocat attend, servie dans l'ordre ; `question` est poussée dans la Discussion quand l'attente devient courante, `attend` est le tag comparé à celui du lien versé, `apres` l'accusé de réception. L'ancienne forme — `attend`/`apres` sur la remise elle-même — reste valide et se lit comme une liste à un élément (`test_autre_affaire.js` le vérifie). **Le schéma reste 3.** Répondre **dans le désordre** est accepté : l'attente servie est celle dont le tag correspond, la question reposée est la première encore non satisfaite.

**L'attribut optionnel d'une pièce :** `porte: [dimensions]`, sur une pièce de type « règle » uniquement — les dimensions que l'article gouverne, affiché mais **jamais lu par le moteur**. Le diagnostic exige qu'il soit renseigné sur toute règle livrée (avertissement) et que ses dimensions existent (erreur). **Une pièce de type « règle » ne porte aucun empan** — contrôle du diagnostic, pas contrainte du moteur : un article s'invoque, il ne se compare pas.

**Attributs optionnels d'une forme :** `deduction` — `"egalite"`, `"difference"` ou `"ordre"`, le prédicat que `deduire` évalue (sans lui, la forme n'est jamais déduite, seulement atteignable à l'ancienne) ; `sens` — `"asc"` (défaut) ou `"desc"` pour une forme `ordonne:true`, l'ordre canonique des deux termes ; `patron` — la phrase écrite d'un bloc, `{a}`/`{b}` (« {a} précède {b} »), **le seul endroit où l'accord se joue** (§8.8), sans quoi le rendu retombe sur la concaténation des blocs. **L'ordre de déclaration des formes est signifiant** : `deduire` rend la première dont la dimension convient et dont le prédicat tient.

**Un terme d'un lien** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** — ce qui permet la chaîne du vice en une comparaison et sa continuation, plutôt qu'en un clic.

**Ce que le moteur garde alors que le contenu ne s'en sert plus :** la source `note` (un terme rempli par une phrase déjà close, jadis « ce qui précède ») et la **clôture sans forme** (jadis « en rester là »). Ni l'une ni l'autre ne figure dans l'affaire livrée ; le moteur et le jeu les supportent toujours, et `test_autre_affaire.js`, dont l'affaire abstraite emploie les deux, le vérifie à chaque exécution — *on ne retire pas une capacité du moteur parce que le contenu du jour ne s'en sert pas.*

**La liste des dimensions vit dans le contenu**, mais le moteur ne lit aucun de ces noms : il compare des `dim` égales, un point. Ajouter `comment` est un geste d'atelier, pas de code.

**Migration 2 → 3** (dans l'atelier, `migrerContenu()`, silencieuse à l'import et au chargement) : les `champs` d'une pièce deviennent des `empans`, le texte reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}`, l'accusé de réception d'une case migre sur sa session, `cases`/`relations` sont retirés. **Le jeu, lui, ne migre pas** : un contenu de schéma 2 est refusé par `contenuValide()`, et le jeu **ne joue rien** — il affiche un bandeau qui nomme le cas (fichier absent, schéma trop ancien, clé manquante), repasser par l'atelier.

## 12. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre**, une par nature d'information — et aucune n'a de copie.

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins…) | **`app/content.js`** — chargé par le jeu *et* par l'atelier | aucune | **nulle par construction** |
| **Les règles du jeu** (avancement des sessions, `attend`/`apres`/`declenche`, les trois drapeaux, la Plaidoirie, la répétition, le calcul des fins) | **`app/regles.js`** — chargé, jamais recopié | aucune | **nulle par construction** |
| **La grammaire** (composer, réduire, valider, reconnaître) **et les projections du contenu** (§14) | **`app/moteur.js`** — chargé, jamais recopié | aucune | nulle par construction |
| **Le sens** (invariants, arbitrages, discipline d'écriture) | **La Partie I de ce fichier** | Le diagnostic de l'atelier (`diagnostiquer()`) en encode une partie | Le diagnostic est un extrait, pas le doc |

`app/regles.js` est **pur** : `creerRegles(JEU, M)` reçoit le contenu et la grammaire, et rend des fonctions qui prennent l'état `S` en argument explicite. Aucun DOM, aucun `localStorage`. Celles qui « parlent » poussent dans `S.fil`, qui est de l'état, pas de l'écran. Le pas-à-pas de l'atelier appelle **les mêmes fonctions, sur le même état** ; il ne peut pas dériver, parce qu'il n'y a pas deux textes à faire coïncider. Ce qui reste légitimement propre à l'atelier : le diagnostic, le graphe, la frise éditable, la migration 2→3, l'export.

**`index.html` n'enveloppe pas `regles.js`.** Il l'appelait autrefois à travers une vingtaine de fonctions homonymes ; la moitié ne faisait que lire, et cinq n'étaient appelées nulle part. La ligne de partage est maintenant nette, et c'est elle qu'il faut tenir :

> **Ce qui redessine reste une fonction d'ici ; ce qui lit s'écrit `R.x(S)` sur place.**

Restent donc les seules cibles de `onclick` — `poserBloc`, `envoyer`, `surligner`, `cloturer`… — qui font `R.x(S, …)` **puis** `rendreTout()`. Tout le reste (`R.blocsOfferts(S)`, `R.instructionComplete(S)`…) s'appelle où on en a besoin. **Les suites lisent le jeu de la même façon**, en `w.R.x(w.S)` : c'est un contrat, pas une commodité — le jour où une lecture n'a plus d'enveloppe, aucune suite ne casse.

Une seule différence subsiste, et elle est de nature, pas de règle : le pas-à-pas joue **au grain du lien** (« composer la phrase qui réalise ce lien ») là où le jeu joue **bloc à bloc**. Les deux passent par la même porte, `clorePhrase` — donc par le même dédoublonnage, les mêmes drapeaux, la même attente sur place.

## 13. Ce qui se passe quand `content.js` manque

Il n'y a pas de repli : c'est le prix de l'exemplaire unique, et un bon prix, parce qu'un repli silencieux fait *jouer autre chose* sans le dire. Fichier absent, schéma antérieur à 3, ou clé vitale manquante → le jeu affiche un **bandeau** qui nomme le cas, ne livre aucune session, et laisse l'écran vide ; `contenuValide()` reste le juge. **La sauvegarde de partie est signée par le contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties en cours, qui repartent de la session 1. Le harnais de test **inline tout `<script src>` ET tout `<link rel=stylesheet>`** au boot, parce que jsdom n'en charge aucun — ce sont les fichiers mêmes, relus sur le disque à chaque boot, ce qui permet au contenu de n'exister qu'en un exemplaire tout en restant testable. L'injection est **générique** (une regex sur les balises, dans l'ordre) et non une liste de chemins : ajouter un module ne demande plus d'y revenir, et un oubli ne se serait vu qu'en `ReferenceError` au milieu d'une suite.

**Pourquoi le CSS aussi**, alors qu'aucune suite ne lit jamais une couleur : parce que `getCSS()` en lit, lui. Les couleurs de trait du graphe (`app/atelier/graphe.js`) sortent de `getComputedStyle` sur `:root` — c'est le seul endroit du dépôt où du CSS traverse vers du JS. Or jsdom résout les variables d'un `<style>` en ligne et rend `""` pour un `<link>`. Sortir le CSS du HTML aurait donc changé ce que le graphe dessine sous test **sans qu'aucun contrôle ne bronche**. Le filet coûte trois lignes, et il a été posé *avant* le déplacement.

**Trois règles sur la balise de `jeu.js`**, portées en commentaire dans `index.html` parce qu'aucune n'est cosmétique : sur **une ligne, sans attribut** (la forme exacte que la regex reconnaît) ; **ni `defer` ni `async`, jamais** ; **après `content.js`**.

**Ce que la deuxième vaut vraiment, mesuré le 13 août.** Cette révision affirmait qu'un attribut de moment d'exécution ferait diverger le test du navigateur et que « le test resterait vert pendant que la page casse ». Éprouvé — on pose `defer`, on lance les six suites : ce n'est pas ce qui arrive. La regex est si stricte que la balise n'est **pas inlinée du tout**, donc rien ne se charge, et quatre contrôles tombent. Même chose pour une balise mise en commentaire. La menace décrite est celle qu'on courrait **si la regex était relâchée** : c'est un argument pour la garder stricte, pas la description de ce qui se passe. Une menace qu'on croit courir alors qu'on ne la court pas est du même genre qu'une laisse qu'on croit tendue (§16) : elle fait craindre le mauvais geste. Ce qui reste vrai, et que R1 du gardien tient désormais : l'écart se dit sur la balise, au lieu de se dire en `ReferenceError` au milieu d'une suite.

**Ce que le harnais ne prouve jamais, du coup :** que les balises se chargent pour de vrai. C'est le seul emploi de `npm run vue` pour le jeu, et, pour l'atelier, d'une ouverture en `file://` — l'onglet Grammaire n'a même de moteur que là. Pour le CSS, la preuve doit être **explicite**, sinon une page sans style passe pour une page qui marche : on vérifie que `body` a bien son fond (`rgb(14, 17, 22)`) **et** que la *dernière* règle du fichier s'applique. (Lire `cssRules` d'une feuille `file://` lève une `SecurityError` : la complétude ne se mesure pas comme ça.)

## 14. La grammaire — branchée

`app/moteur.js` est **pur, sans données** : `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` rend `valider`, `reduire`, `lienDe`, `rendre`, `squelettes`… chargé tel quel par le jeu, l'atelier et le banc d'essai, jamais recopié.

**Accumuler, pas écraser.** `reduire(ch)` parcourt la chaîne de blocs en empilant les termes et en retenant la forme courante ; à la rencontre d'un bloc `imbrique` (§11), ce qui a été accumulé devient le **terme unique** de la nouvelle forme. `rendre(ch)` écrit le `nom` d'un empan (§4.1) et non sa citation, avec repli sur `texte`, sans espace devant un fragment qui commence par une ponctuation (§8.8).

**La déduction** tient sur trois fonctions : `comparer(a, b)` — l'ordre de deux valeurs, numérique quand les deux le sont (`hh:mm` compris), lexicographique sinon ; `deduire(idA, idB)` — la forme qui lie deux empans, ou `null` (dimensions différentes → `null`, le seul refus qui existe ; sinon la première forme déclarée dont le slot accepte la dimension et dont `deduction` tient) ; `ordonner(forme, [a, b])` — pour une forme `ordonne:true`, la paire rangée selon `sens`. `reduire` déclenche `deduire` puis `ordonner` sur un bloc `deduit` ; `rendre` remplace les deux termes par le `patron` de la forme, dans l'ordre canonique.

**Le contrat de rétrocompatibilité, en une phrase :** sans `deduit`, sans `deduction`, sans `patron`, `reduire` et `rendre` se comportent comme un automate à liaisons explicites, sans déduction ni continuation — `test_autre_affaire.js` le vérifie à chaque exécution.

**`valider(r)` descend dans les termes emboîtés.** Sans cela, l'article obligatoire ouvrirait un trou : « affirmation » est une catégorie que tout objet satisfait, y compris une comparaison refusée par la déduction. Depuis que la qualification est le seul chemin de clôture, c'est aussi le seul endroit où la catégorie peut trancher : elle doit donc y trancher jusqu'au fond.

**Une liaison `cite`** (§11) réécrit le fragment du terme qui la précède, dans `rendre` : le nom, puis la citation, puis le `court` de la pièce. Le flag est porté par la **liaison**, non par le terme, pour que la voie de comparaison — qui partage le même bloc de premier terme — reste intacte. `valider` n'a rien eu à apprendre pour ça : une forme d'arité 1 sur un terme atomique était déjà validable.

### Les projections du contenu — dans ce fichier, et nulle part ailleurs

`moteur.js` porte aussi les fonctions qui **projettent un objet de contenu en une vue**, à côté de la fabrique. Ce ne sont pas des données : l'en-tête du fichier tient. Elles sont ici parce qu'il manquait un endroit où poser une fonction pure *d'un contenu*, par opposition à un `JEU` déjà lié — et faute de cet endroit, elles vivaient en deux ou trois exemplaires.

| Projection | Qui l'appelle | Ce qu'elle remplace |
|---|---|---|
| `champsDe(contenu)` — les empans aplatis en `"pid.eid"`, avec `nom`, `qui`, `court` | le jeu, l'atelier, le harnais | **trois** copies, dont deux identiques au caractère près |
| `comparaisonsDe(liens, formes)` — les comparaisons d'arité 2, emboîtées comprises, dédoublonnées | l'atelier, le harnais | deux copies, même clé de dédoublonnage |
| `couleurDim(dimensions, d)` — le RANG, jamais la pertinence (§4.3) ; `null` si inconnue | le jeu, l'atelier | la palette écrite deux fois, en CSS et en JS |

`champsDe` n'est pas un utilitaire de hasard : c'est **exactement l'argument `CHAMPS` que `creerMoteur` attend**. Et `couleurDim` rend `null` plutôt qu'une couleur de repli, parce que le repli n'est pas la règle — le jeu grise une dimension inconnue et continue, l'atelier la montre en rouge, c'est une erreur d'écriture chez lui.

Les **données**, elles, ont trois provenances selon le contexte :

| Consommateur | GRAMMAIRE | CHAMPS | LIENS |
|---|---|---|---|
| le jeu (`index.html`) | `JEU.grammaire` | `champsDe(JEU)` | `JEU.liens` |
| l'atelier (onglet Grammaire) | idem, depuis `CONTENU` | `champsDe(CONTENU)` | idem |
| le banc d'essai (`grammaire/`) | `grammaire2.js` | `grammaire2.js` | `grammaire2.js` |

L'automate et les formes **vivent dans le contenu** : quelles tournures sont offertes, quels articles invocables, c'est de l'écriture, pas du code. **La marge de bruit doit rester non nulle** : `npm run demo:grammaire` la mesure sur le jeu de démonstration — 1609 phrases légales → 125 sensées → 8 portant un lien, soit 117 de marge. L'article obligatoire l'a **augmentée** sur l'affaire livrée : une phrase de bruit n'est plus une comparaison quelconque, c'est une comparaison quelconque multipliée par chaque article reçu — bien formée, fondée, sans intérêt. La citation l'augmente encore : chaque empan devient une phrase close possible, mais elle ne sert à rien pour *chercher*, une citation ne se fondant que sur elle-même.

**Chiffré, sur `content.js`** (l'onglet Grammaire de l'atelier le mesure en direct, sur le contenu courant) : 4 squelettes, **1752 phrases légales → 330 sensées → 15 portant un lien, soit 315 de marge.** Le rapport est bien celui qu'on attendait — trois fois plus de marge que sur le jeu de démonstration, pour un vocabulaire à peine plus grand. *Ce chiffre n'a pu être écrit ici que le 13 août : jusque-là le panneau annonçait 21, parce qu'il refaisait la réduction à la main sans connaître `deduit` ni `imbrique` (§15).*

## 15. Ce qu'il reste à resynchroniser

**Presque rien — mais ce presque rien n'avait jamais été fait.** Les règles vivent dans `app/regles.js`, que le jeu et l'atelier appellent : pas de recopie, donc pas de checklist à tenir à jour. Ce qui reste tient en trois lignes, et ce sont des **reflets** de l'atelier sur le jeu :

| Ce qui change | Ce qu'il faut penser à suivre | Ce qui avait dérivé — relevé le 13 août |
|---|---|---|
| Une règle du jeu (`app/regles.js`) | Rien de mécanique. Vérifier que la **frise** décrit toujours le déroulé en mots justes, et que les **pastilles** du pas-à-pas nomment les bons drapeaux. | La frise édite `rep_inutile` et `rep_sans_rapport`, **pas `rep_hors_sujet`** — la troisième escalade, née avec la citation. Le contenu la porte, `reponseAvocat` la lit, l'atelier ne sait pas l'écrire. **Point ouvert**, pas encore tranché. |
| Le schéma du contenu (§11) | Le **diagnostic** (`diagnostiquer()`) et les **formulaires** de l'inspecteur. | Deux choses. La **forme indicible**, corrigée le 13 août (ci-dessous). Et le contrôle « tag attendu par aucune remise », resté à `r.attend` — la forme d'avant les attentes en liste (§3) : **six fausses informations** sur l'affaire livrée, une par lien qui porte un tag. |
| La grammaire (`app/moteur.js`) | L'onglet **Grammaire**, qui l'exerce sur le contenu courant. | La **densité** y refaisait la réduction à la main (`s.map(b => b.forme).filter(Boolean).pop()`), sans connaître `deduit` ni `imbrique`. Elle annonçait **21** de marge de bruit là où le moteur en compte **315** (ci-dessous). |

**Ces trois-là sont d'un même genre, et c'est le genre le plus coûteux de ce dépôt** : un reflet que le changement de mécanique a laissé derrière. Il ne casse rien, il ne lève aucune exception, aucune suite ne le voit — les six lisent le jeu, jamais le diagnostic ni l'onglet Grammaire. Il ment simplement, tous les jours, à celui qui écrit l'affaire. Le remède n'est pas une checklist de plus : c'est que le reflet **appelle** ce qu'il reflète au lieu de le réécrire (§12), et là où il ne le peut pas, qu'une règle du gardien tienne l'écart (§16 bis, R9).

Méthode (contenu) : écrire dans l'atelier → « Exporter content.js » → poser le fichier dans `app/` → relancer les suites.

**La densité de l'onglet Grammaire se calcule par `reduire`, comme tout le reste.** Le panneau existe pour un seul chiffre — la **marge de bruit**, les phrases sensées qui ne portent aucun lien : si elle tombait à 0, « sensé » vaudrait « correct » et l'interface trahirait (§14). Il le calculait en prenant la **dernière forme déclarée du squelette**, ce qui était juste tant que toute forme était portée par une liaison. Depuis la déduction (§4.5), un squelette peut n'en déclarer aucune — `t1` porte `deduit`, la forme se calcule des valeurs — et depuis la continuation, la liaison finale **emboîte** ce qui précède au lieu de s'y ajouter. La forme reconstruite à la main était donc d'arité 1 avec deux termes à plat : refusée pour « arité », systématiquement. Sur `content.js` : **24 phrases sensées annoncées, 330 réelles ; 21 de marge annoncés, 315 réels.** Le correctif tient en une ligne — on construit la chaîne de blocs et on appelle `reduire`, comme le composeur du jeu. La même écriture traînait dans `grammaire/test_grammaire2.js` : sur la grammaire de démonstration, qui déclare toutes ses formes sur des liaisons, **la sortie ne bouge pas d'un chiffre** (1609 / 125 / 8), et c'est ce qui prouve que le correctif ne change que là où l'ancienne écriture était fausse.

**Ce que le diagnostic contrôle**, au-delà du câblage : la règle de surlignage (empan sans marqueur → erreur), le nom d'empan (absent → avertissement), le doublon banal dans les deux sens, la grammaire (impasse de l'automate, clôture sans forme, **forme indicible — voir juste après**, lien insensé, emboîtement dans le vide, forme ordonnée sans `sens`, dimension sans forme déductible), les articles (règle portant un empan → erreur ; `porte` absent → avertissement ; `porte` inconnu → erreur), le vice (pas de conclusion → erreur ; plusieurs canaux → avertissement), les sessions (sans attente, tag sans lien, question sans tag → erreur). **« Forme indicible » : une forme existe de DEUX façons, et le contrôle doit connaître les deux.** Une liaison peut la **déclarer** (`forme:` sur un bloc) ; depuis la déduction (§4.5), un bloc `deduit` peut la faire **déduire** — et celle-là n'est nommée par aucun bloc, puisque le joueur désigne au lieu de déclarer. Le contrôle ne connaissait que la première, écrite avant la déduction : il tenait les quatre formes comparatives de l'affaire livrée pour indicibles alors que le jeu les prononce, soit **quatre fausses alertes à chaque ouverture de l'atelier**. Même nature que le `pointer()` resté au schéma 2 : un contrôle que le changement de mécanique a laissé derrière, et qu'aucune suite ne couvre — les suites lisent le jeu, jamais le diagnostic.

**« Déductible » se lit comme `deduire` le lit, et sur CE dossier.** Les trois conditions, dans l'ordre du moteur : la forme porte `deduction`, elle est d'**arité 2**, et son premier slot accepte au moins **une dimension déclarée** (`"*"` accepte tout). Il faut de plus qu'un bloc porte `deduit` — sans quoi rien ne déclenche le calcul. Chacune des trois manque d'une façon différente, et le diagnostic le dit différemment : une forme sans `deduction` est indicible tout court ; une forme déductible sans bloc qui déduise ne sera jamais demandée ; une forme dont le slot ne nomme que des dimensions absentes ne se produira jamais **ici**, quoi qu'elle vaille ailleurs. C'est cette troisième condition qui fait la version prudente : sans elle, on cesserait d'alerter sur une forme réellement inatteignable.

**Ce qui n'est délibérément PAS signalé : l'ombrage.** `deduire` rend la **première** forme dont la dimension convient et dont le prédicat tient (§11) — une forme déclarée plus tard peut donc n'être jamais choisie sur une dimension qu'une précédente couvre déjà. Ce n'est pas une anomalie : **l'ordre de déclaration est signifiant**, c'est ainsi qu'on tranche les ambiguïtés, et le signaler reviendrait à interdire le mécanisme qui les résout.

**Un contrôle à part** : un article livré **trop tard** — si une session attend un tag que seul un lien peut servir, et que ce lien exige un article livré à une session ultérieure, la session devient inclôturable. C'est une erreur, et c'est le genre de piège qu'aucune relecture ne rattrape et qu'une partie de test ne révèle qu'après vingt minutes.

## 16. Les harnais de test

Six suites vivent dans le projet, sur un harnais jsdom commun (`harnais.js`), qui inline **tout `<script src>`** au boot — jsdom n'en charge aucun, et ce sont les fichiers mêmes, relus sur le disque à chaque fois. L'injection est générique, dans l'ordre des balises : ajouter un module d'atelier ne demande pas d'y revenir.

**Le contrat de lecture : `w.R.x(w.S)`.** Une suite qui veut savoir ce que le jeu offre demande aux *règles*, pas à l'écran — `w.R.blocsOfferts(w.S)`, jamais `w.blocsOfferts()`. Ce que la fenêtre expose en propre, ce sont les **gestes** (`w.poserBloc`, `w.envoyer`, `w.surligner`…), parce qu'eux redessinent et que c'est le redessin qu'on veut éprouver. Tenir cette ligne a une conséquence directe : `index.html` peut cesser d'envelopper une lecture sans qu'une seule suite bouge.

**Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice`/`lienConclusion`/`lienFaux`/`lienTag`, `composerLien(w,L)` (compose la phrase qui réalise un lien donné, en parcourant l'automate), `phrasesBruit(w,n)`, `cheminVers`, `instruire` (le chemin docile), `terminer`/`numeroFin`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.** `composerLien` traite d'abord le cas d'une citation (forme d'arité 1 sur terme atomique) : surligner, poser l'empan, clore **si la phrase ne s'est pas déjà refermée toute seule** — une suite unique n'est pas un choix (§4.5). Pour une forme emboîtée, il connaît deux façons de l'atteindre : la **continuation** et l'ancienne source `note`, ce qui fait que `test_autre_affaire.js` — écrite à l'ancienne — reste vert sans qu'une ligne de son contenu ne bouge.

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (36) | le jeu, sur **`content.js`** | l'index du dossier (pièces d'abord, règles ensuite) ; tout empan est cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; les liens se partagent entre citations et qualifications sans reste ; les trois fins |
| `test_declencheurs.js` (39) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, la liste d'attentes (question posée quand elle devient courante, désordre accepté), les trois drapeaux, dimensions renommées, un contenu invalide est refusé et le dit |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | le découplage : une affaire abstraite écrite à l'ancienne (source `note`) se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (114) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; le tutoriel du premier geste ; les deux régimes de fondement (citation qui se clôt d'elle-même, comparaison qui ne s'écrit que par les noms) ; les trois escalades séparées (comparaison nue, article mal rattaché, citation hors sujet) ; la déduction (patron, ordre des clics indifférent) ; le filtre de livraison ; la continuation (aucun bloc ne clôt sans qualifier) ; la Plaidoirie qui ne retient que les moyens ; la répétition |
| `test_sauvegarde.js` (37) | le jeu | la partie survit au rechargement (mémoire, journal, plan, composition en cours, phrase close en attente, drapeaux) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (79) | l'atelier + le couple atelier→jeu | `content.js` sans erreur et réexporté à l'identique ; le diagnostic au complet ; migration 2→3 idempotente ; renommage d'empans et de pièces ; le pas-à-pas tourne sur `regles.js` ; export `schema: 3` adopté et joué par le moteur ; autosave |

**Les Manuels n'ont plus de suite.** Sept contrôles éprouvaient `openManuels()`, orpheline à l'écran depuis le retrait du `<header>` : ils étaient la seule chose qui la maintenait en vie — on éprouvait un chemin que le joueur ne pouvait pas prendre, ce qui est pire que de ne pas l'éprouver. La fonction d'écran est retirée ; la **règle** reste dans `regles.js` (`reglesLivrees`, `porteDe`), intacte. Le jour où les Manuels se rebranchent, ces contrôles reviennent avec eux — et pas avant. *Conséquence à connaître : `JEU.directives` et `JEU.avis_exploitation` ne sont plus lus par le jeu, alors que la frise les édite toujours et que le diagnostic avertit encore de leur absence.*

**Des chaînes de chrome sont épinglées**, en revanche, et c'est autre chose : `Envoyer` (le bouton, dans le composeur), `effacer` (la confirmation de « ⟲ recommencer »), `Opposer une phrase` et `déjà envoyée` (le présentoir de la répétition), les marqueurs `● ` et `✓ ` de l'index du dossier, et l'id `zoneRetenus`. Ce n'est pas du contenu — ce sont les repères par lesquels une suite atteint une zone sans la nommer par sa structure. On les renomme si on veut, mais jamais sans toucher au test qui les nomme : c'est la seule laisse entre l'écran et les suites, et elle est courte exprès (§4.9).

*Cette liste est **relevée** sur les suites, pas héritée de la révision précédente. Celle-ci nommait `Le dossier`, `Ce que tu retiens`, le `Maître Auber` du bouton d'envoi et `ce qu'il peut plaider` : **aucune des quatre n'est tenue par un contrôle**, deux n'existent plus à l'écran, et le bouton dit « → Envoyer » depuis longtemps. Une laisse qu'on croit tendue alors qu'elle ne l'est plus est pire qu'aucune laisse : elle fait hésiter à renommer ce que personne ne tient. À relever de nouveau, jamais à recopier.*

*Les comptes ci-dessus ont été **relevés**, le 13 août, en lisant la sortie des suites — la révision précédente annonçait 38 / 115 / 33 là où elles rendent 36 / 114 / 37. Le total, 325, était juste par compensation, ce qui est exactement la façon dont un chiffre faux survit. À relever de nouveau, jamais à recopier.*

## 16 bis. Ce que les suites ne voient pas — le gardien

Les six suites éprouvent le **sens** : elles jouent l'affaire, lisent `innerHTML`, et vérifient ce qui se dit. Elles ne lisent jamais un style calculé, jamais la forme d'une balise, jamais l'inventaire des noms globaux d'une page. C'est là que ce dépôt s'est fait mal, à répétition, et le §2 de `docs/PASSATION.md` tenait la liste de ces pannes **à la main**.

**`outils/gardien.js`** (`npm run gardien`, dans `npm test` après les suites) la rend opposable. Neuf règles, neuf pannes réellement vécues, chacune citant le § qui la tranche : R1 la forme des balises que le harnais inline ; R2 les collisions de noms de haut niveau, **par page** ; R3 les variables CSS employées sans définition ; R4 les familles CSS sans porteur ; R5 les `onclick=` qui visent une fonction inexistante ; R6 les ids visés, et nommément les quatre ancres du tutoriel ; R7 les restes du schéma 2 ; R8 les tailles annoncées par `docs/CARTE.md` ; R9 les lectures d'`attend`/`apres` posés sur une remise. Il ne connaît **ni pièce, ni empan, ni valeur** — même discipline que les suites.

**R9 est la sœur de R7, et pour la même raison.** R7 interdit de déplier un lien du schéma 2 (`l.a[0]`), parce qu'une branche y était restée cinq jours sans qu'aucune suite ne bronche. R9 interdit de lire `attend` ou `apres` **sur une remise**, parce qu'une branche du diagnostic y était restée depuis que la remise attend une *liste* (§3) — six fausses informations à chaque ouverture de l'atelier, et une branche de `majRemise` que plus personne n'appelait. Deux fonctions sont nommées en exception, et seulement elles : `attentesDe` (`app/regles.js`) et `attentesDeRemise` (`app/atelier/noyau.js`), les deux normalisateurs déclarés au §11 — *on ne les fusionne pas, on dit lequel est lequel*. Une forme d'écriture qu'on continue de **lire** doit se déplier en un seul endroit ; tout le reste passe par le normalisateur.

**Ce n'est pas une cinquième source de vérité.** Il fait respecter, il ne décide pas : le jour où une règle et son § divergent, c'est le § qui a raison et la règle qui se corrige. C'est arrivé le jour même de sa pose — voir §13.

À sa première exécution il a trouvé trois choses qu'aucune suite ne pouvait voir : `.manuel` dans `jeu.css`, orpheline depuis le retrait d'`openManuels()` ; `.gpill.leve` dans l'atelier, jamais posée depuis l'onglet « Grammaire » ; et six des sept lignes du tableau des territoires de `docs/CARTE.md`, fausses de 4 à 20 lignes.

**`eslint.config.js`** est l'autre bout, générique : aucune des huit pannes ci-dessus ne s'y voit, mais il attrape ce que le gardien ne cherche pas — identifiant fautif, variable morte, clé dupliquée. Sa liste de globals n'est pas écrite : elle se **calcule**, en demandant au gardien l'inventaire des noms que chaque page pose dans la portée globale (§12 — pas de copie). Deux règles y sont assouplies, et elles portent des idiomes voulus : un `catch` qui ignore délibérément sa raison, et les noms de haut niveau d'une page, qui sont sa surface publique et qu'ESLint croirait morts faute de savoir lire un `onclick=`. Tout ce qui restait après ces deux-là était du vrai code mort, et a été retiré plutôt qu'excusé — dont, en retour, **un défaut du gardien lui-même** : son relevé de déclarations ne voyait que le premier nom de `let selA=null, selB=null`, et un nom manquant à l'inventaire est une collision que R2 ne verrait pas.

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (325 contrôles) — et, depuis le 13 août, quand le gardien et ESLint le sont aussi. L'ordre de `npm test` n'est pas indifférent : **les suites d'abord**, le sens avant la forme. `tests/verifier_content_sync.js` n'existe plus : il surveillait l'écart entre deux exemplaires du contenu, et il n'y en a plus qu'un. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 17. Résumé en trois phrases

Trois modules, trois métiers, aucune copie : le **contenu** dans `content.js`, les **règles** dans `regles.js`, la **grammaire et les projections du contenu** dans `moteur.js` — et deux pages qui ne font que *montrer*, le jeu d'un seul tenant, l'atelier réparti en un fichier par outil. Toutes deux chargent les mêmes trois voisins, si bien que le pas-à-pas ne rejoue plus les règles, il les appelle, et que rien ne projette un contenu deux fois. Côté sens, une seule chose compte : **rien ne se dit qui ne soit fondé, sous l'un des deux régimes** — un fait se cite, une relation se fonde sur un texte, et rien d'autre ne clôt une phrase. D'où trois sessions au lieu de deux : la première apprend à lire, la deuxième à mettre en rapport, la troisième ne demande plus rien. La Partie I reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

## 18. Historique des révisions

Une ligne par étape, pour ne jamais rouvrir un débat déjà tranché sans savoir qu'il l'a été — le « pourquoi » de chaque ligne vit dans la section qu'elle a fait évoluer, pas ici.

- **27 juillet — empans, dimensions, composer/verser.** Le geste `champ + relation + champ` devient composer puis envoyer ; les `cases` à trois options sont retirées ; l'IA est partisane dès la première minute.
- **28 juillet — refonte ergonomique.** Continuation au lieu de seconde phrase, envoi sur place, mémoire et composeur fusionnés, empan nommé (§4.1, §4.6).
- **29 juillet — refonte de la déduction.** La relation se déduit des valeurs au lieu de se déclarer ; les qualifications deviennent trois tournures neutres ; un article n'est offert qu'une fois sa pièce livrée (§4.2, §4.5).
- **30 juillet, premier temps — refonte du fondement.** Le « au regard de l'article » devient obligatoire ; les articles annoncent ce qu'ils régissent (`porte`) et cessent de porter des empans ; `regles.js` est extrait d'`index.html`, le contenu passe à un exemplaire unique (§4.5, §9, §12).
- **30 juillet, second temps — le premier geste : lire, extraire, répondre.** La session 1 ancienne se scinde en deux ; un empan seul se clôt par sa citation ; une remise attend une liste d'attentes (§3, §4.5).
- **31 juillet — le clic en trop, et le geste montré.** La confirmation disparaît quand une seule liaison non `imbrique` est offerte ; le tutoriel du premier geste apparaît (§4.5, §4.8).
- **1ᵉʳ août — l'économie de l'écran.** Une voix par état, un titre par zone, le locuteur au changement ; les puces de mémoire passent de trois lignes à deux. Rien du contenu, des règles ni de la grammaire ne bouge (§4.9).
- **2 août — les en-têtes des trois surfaces.** « Le canal », « L'atelier », « Le plan » deviennent à l'écran « Discussion », « Mémoire », « Plaidoirie » (§4.6) ; la légende des dimensions et les notes d'aide dans la modale de pièce disparaissent (§4.9).
- **2 août — un mot, une chose.** Le vocabulaire est harmonisé jusque dans le code : les trois surfaces portent le même nom du DOM au harnais, `S.memoire` devient `S.retenus`, et **`atelier` ne désigne plus que `app/atelier_v3.html`** — c'était la seule collision de *prose* du dépôt (§4.6, `docs/LEXIQUE.md`). Il en restait dans l'**inventaire des noms de fonction** : voir les 3 et 5 août.
- **3 août — dégraisser, sans toucher au sens.** Le code mort part ; les **projections du contenu** passent dans `moteur.js` (`champsDe`, `comparaisonsDe`, `couleurDim`) et `estRegle` dans `regles.js` — l'aplatissement des empans existait en trois exemplaires, dont deux identiques au caractère près. L'atelier devient un **dossier**, un fichier par outil (§9, §12, §14).
- **4 août — une page ne porte plus que sa structure.** `app/jeu.css`, `app/jeu.js`, `app/atelier/atelier.css` : plus aucun `<style>` ni `<script>` en ligne, et `index.html` passe de 859 lignes à 85. Un seul changement d'écran, isolé : `--transmis` était employée huit fois et définie nulle part (§9).
- **5 août — un nom pour deux choses.** Les deux dernières collisions d'identifiants sont refermées : `dimDe` → **`dimEmpan`** et `valider` → **`diagnostiquer()`** dans l'atelier, parce que `moteur.js` donne ces deux noms à des choses incompatibles et que les deux `valider` rendaient « rien » quand tout va bien. Plus le dernier code mort, quatre familles de CSS sans porteur, et un **défaut réel** : `pointer()` lisait encore le schéma 2 (`docs/LEXIQUE.md`, §2 de la passation).
- **13 août — un gardien, et l'atelier qui ne recopie plus rien.** `outils/gardien.js` rend opposables les conventions qu'aucune suite ne voit (§16 bis) ; l'atelier est dégraissé de l'intérieur, quatre gestes nommés à la place de soixante écritures ; et le contrôle « forme indicible » du diagnostic apprend qu'**une forme existe de deux façons** — déclarée par une liaison, ou déduite (§15).
- **13 août — ce que le §15 demandait de resynchroniser.** Les trois reflets de l'atelier sur le jeu sont relevés un par un : la **densité** de l'onglet Grammaire réduisait à la main et annonçait 21 de marge au lieu de 315 ; le **diagnostic** lisait encore `attend` sur la remise et émettait six fausses informations ; supprimer un empan **ne retirait jamais son marqueur** du texte (regex sur-échappée). Avec eux, **R9** au gardien, les huit dernières mutations de l'atelier passées sous `muter`, et `docs/CARTE.md` remis d'aplomb (§14, §15, §16 bis).

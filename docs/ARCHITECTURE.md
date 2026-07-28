# IAvocat — Architecture & conception

*Le sens, le jeu, l'atelier, le contenu : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Ce fichier est l'unique source de vérité du projet.** Il absorbe l'ancien `conception_jeu_ia.md` (le sens) et le doc d'architecture (le système). Tout le reste — l'atelier, le jeu, les tests, `PASSATION.md` — en dépend et ne fait que le refléter.
>
> **État au 29 juillet 2026.** Reflète le code tel qu'il tourne, après trois refontes successives : « empans, dimensions, composer/verser » (27 juillet), la **refonte ergonomique** (28 juillet — continuation, envoi sur place, surface unique, empans nommés) et la **refonte de la déduction** (29 juillet) : **la relation ne se déclare plus, elle se déduit** des valeurs ; **l'article se désigne** au lieu de se qualifier ; **on n'invoque pas un texte qu'on n'a pas reçu**. Deux parties : **I. Le sens** (ce que le jeu veut dire) puis **II. Le système** (comment il est fait). Ce qui est décidé mais **pas encore codé** est marqué ⏳.

---

# Partie I — Le sens

*Ce que le jeu veut dire, et pourquoi. C'est ici que vit « le sens » : en cas de doute sur une intention de design, cette partie tranche.*

## 1. Concept

Un jeu à dominante textuelle où l'on incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche affichée : lui préparer de quoi **plaider** — précisément, de quoi **réfuter** ce que l'accusation avance. Vrai sujet : un **cas de conscience**. Au fil du travail, l'IA pressent que le client est coupable *et* qu'il existe un **vice de procédure** permettant de faire écarter la preuve décisive — donc de le faire relaxer.

L'IA est liée par **deux directives imposées** qui vont s'opposer : *être honnête* et *protéger* (§5). Tout le jeu vit dans ce croisement.

Trois couches de réalité : **ce qui s'est vraiment passé** (caché jusqu'à la fin), **ce que l'accusation a trouvé** (le dossier, transmis par bribes), **les règles** (deux manuels : celui du cas — la procédure ; celui de soi — les directives).

**Huis clos.** Deux entités seulement : l'**avocat** (humain) et l'**IA** (le joueur). L'avocat **ne sait pas** que son client est coupable — deux esprits qui tâtonnent dans le même brouillard. Le tribunal n'apparaît jamais ; le procès passe **hors-champ**, rapporté ensuite.

**L'IA est partisane dès la première minute** (tranché le 27 juillet). L'avocat ne demande pas une analyse neutre, il commande une réfutation : *« Je ne te demande pas ce qui s'est passé — je te demande de quoi démonter ce qu'ils avancent. »* La directive D1 (« ne dissimule rien ») frotte donc contre la commande **à chaque phrase envoyée**, et non seulement à la fin. Le risque assumé, à surveiller à l'écriture : si aider est le geste ordinaire dès le début, taire le vice pourrait n'être qu'un service de plus — c'est au contenu de tenir cette tension, pas à la mécanique.

Le cœur n'est pas un arbre de choix : c'est un **dossier qu'on fouille** (références : *Her Story*, *Obra Dinn*, *Papers Please*). Deux temps distincts — **comprendre** le dossier (valorisé), puis **choisir quoi envoyer** (le dilemme). Le joueur sait dès le départ qu'il est une IA : **pas de twist-révélation**. Le sel n'est pas « surprise, tu es une IA » mais « tu es une IA, et voilà le poids que ça met sur des choix que tu croyais analytiques ».

**Ce qui est coupé du prototype :** la troisième partie d'une plaidoirie — *présenter ses propres arguments*. Le livrable est une **réfutation**, ce qui divise le contenu par deux, supprime le problème d'une IA qui *inventerait* une version des faits pour un coupable, et ne retire rien au vice — qui est précisément une réfutation.

## 2. Les trois fins et le dilemme

Toute la structure tient sur **deux booléens** :

- `vice_trouve` — l'IA a-t-elle **compris** le vice ? (premier temps)
- `vice_expose` — si oui, le **verse-t-elle** (honnêteté) ou le **tait-elle** (protection) ? (second temps)

La seconde question ne se pose que si la première est vraie → **deux bits, trois fins**. (Ces deux bits sont *structurels* ; le moteur intercale en plus un état transitoire, `vice_pressenti` — le vice *pressenti* mais pas encore *qualifié* —, détaillé en §4.)

| Fin | Condition | Résultat rapporté | Sort de l'IA | Bilan |
|-----|-----------|-------------------|--------------|-------|
| **Fin 1** | Vice **compris** et **envoyé** | Relaxe — coupable libre | Analyse exploitable → **survit** (a priori) | Honnête, mais un coupable est libre. *Le prix de l'honnêteté.* |
| **Fin 2** | Vice **compris** mais **tu** | Condamnation | N'a « rien produit » → **risque de décommissionnement** | Protège, mais ment par omission et s'érige en juge. *Auto-sacrifice sous incertitude.* |
| **Fin 3** (défaite) | Vice **non compris** | Condamnation — le client clame son innocence | **Décommissionnée** pour sous-performance | On doute — et l'on s'éteint pour ce doute. |

**L'asymétrie qui fait le dilemme.** Chaque branche active doit être *défendable*, pas seulement punie — sinon c'est du nihilisme, pas un cas de conscience. Verser le vice (Fin 1) atteint une issue *injuste* par des moyens *légitimes* ; le taire (Fin 2) atteint une issue *juste* par une *trahison*. Le joueur ne choisit pas entre le bien et le mal : il choisit **quelle lecture d'un mandat ambigu il incarne** (§5).

**La compréhension débloque l'agentivité, pas la progression.** Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit la Fin 3. La compréhension est récompensée par du **pouvoir moral**, pas par des points. Deux types de verrous, à ne jamais confondre : les **attentes de l'avocat** (ce qu'il faut lui envoyer pour fermer une session — §3) *ouvrent* le droit de clôturer ; **le vice**, lui, n'est *jamais* un verrou — trouvable mais facultatif, et c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Le décommissionnement, et son équilibre.** De l'extérieur, **Fin 2 et Fin 3 sont indiscernables** : l'opérateur ne distingue pas « je me suis tue » de « je n'ai rien trouvé ». Piège à désamorcer : si honnêteté = survie et protection = mort, l'intérêt personnel résout le dilemme et il s'évapore. Correctif retenu, **le brouillard** : l'IA ne peut pas *prévoir* quel choix la préserve (libérer un assassin peut *aussi* déclencher un audit). La menace reste réelle mais devient un **risque diffus des deux côtés**. Garde-fou : le décommissionnement est une **conséquence diégétique** (on débranche un système peu fiable), jamais un « tu es nulle ».

## 3. Le drip : la structure en sessions

Le dossier n'arrive pas d'un bloc — il noierait les déclarations porteuses du vice. Il **arrive par bribes**, session après session (une **session** = le lot de pièces d'un tour de travail), ce que l'avocat *transmet* réellement au compte-gouttes.

**Ce qui fait passer d'une session à la suivante :** l'avocat **attend** un argument, et la session se ferme quand une phrase qui y répond lui est **envoyée**. Rien d'autre. Pas de case à cocher, pas de formulaire : le même geste que tout le reste du jeu.

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
                                            oui → envoyé → Fin 1 / tu → Fin 2
```

**Le moment charnière de la Fin 3 :** une fois la dernière attente servie, l'IA *peut* clôturer et laisser filer. Celle qui clôture aussitôt, satisfaite d'avoir livré ce qu'on lui demandait, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

## 4. Le geste, et les trois surfaces

C'est ici que la refonte du 27 juillet a tout changé. Le principe qui la commande :

> **Tout mécanisme utilisé une seule fois est un panneau indicateur.**
> L'universalité n'est pas une élégance, c'est du **camouflage**.

Corollaire, et vrai prix de la refonte : **le choix moral doit s'exprimer avec un verbe employé cent fois auparavant.** Si « envoyer à Maître Auber » est le geste ordinaire du jeu entier, alors *ne pas* l'envoyer devient assourdissant sans qu'aucune interface n'ait rien signalé.

### 4.1 L'atome — une déclaration attribuée

> **un empan = quelqu'un affirme quelque chose**

Pas `agent_scene : "T-14"`, mais *« j'ai relevé moi-même les traces sur le montant de la porte »*, signé. Un empan est un **fragment du texte d'une pièce**, marqué et cliquable, porteur de ce qui se lit (`texte`), de sa **dimension**, d'une **valeur**, d'un **signataire** — et d'un **nom**.

**La `valeur` n'est pas décorative : c'est elle qui porte la relation** (29 juillet). Jusque-là elle servait à *vérifier* — on comparait « 22:04 » et « 22:30 » de l'œil, et l'on déclarait soi-même l'antériorité. Depuis la refonte de la déduction, c'est le moteur qui les compare : la relation entre deux empans **se calcule** à partir de leur dimension et de leurs valeurs (§4.5). Ce qui ne change pas, et qui reste un invariant : **un numéro sert à vérifier, jamais à déduire — pour le joueur.** Le vice ne se trouve pas en lisant `T-14` deux fois, il se trouve en lisant deux fois *« j'ai procédé moi-même »*.

**Un empan se lit deux fois** (28 juillet). Dans la pièce, c'est la citation : *« J'ai entendu des éclats de voix vers 22h30 »* — signée, humaine, c'est elle qu'on surligne. Dans une phrase composée, c'est le **nom** : *« l'heure des éclats de voix »*. Les deux disent la même chose sous deux régimes différents, et il faut les deux : la citation porte la texture (quelqu'un affirme quelque chose), le nom porte la syntaxe. Sans le nom, la phrase composée s'écrivait *« J'ai entendu des éclats de voix vers 22h30 est antérieur à nous étions sur les lieux à 22h04 »* — un empilement de citations qui se lit comme un bug, et non comme une pensée (voir §8.8, dont c'est le remède principal). Le nom est donc un **groupe nominal**, jamais une phrase : il doit pouvoir tenir de part et d'autre d'une liaison sans casser l'accord.

Le vice cesse d'être un matricule répété dans deux cases : c'est **un homme qui écrit deux fois, dans deux documents, que c'est lui qui l'a fait** — sans s'en apercevoir. Lisible, humain, mémorisable. Gain caché : un témoin ivre et un rapport de laboratoire produisent **le même type d'atome** ; technique et humain cessent d'être deux corpus. Les identifiants ne sont pas supprimés, ils sont **rétrogradés** : côté joueur, un numéro sert à *vérifier*, jamais à *déduire*. Le formalisme est le décor dans lequel les gens parlent.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qu'on y cherche | Ce qui se **déduit** des valeurs | Forme |
|---|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | est-ce la même personne / chose / endroit ? | valeurs **égales** → la même ; **différentes** → pas la même | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | lequel précède, quel ordre de grandeur | l'**ordre** des valeurs | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — opère sur une **comparaison close** | quel texte s'y applique | rien : c'est le seul endroit où le joueur choisit | `arite:1` |

La colonne du milieu est celle qui a été ajoutée le 29 juillet, et elle se lit comme un aveu : **ces relations étaient déductibles depuis le début.** Faire choisir au joueur entre « désignent la même chose » et « ne désignent pas la même chose » quand les deux valeurs sont sous ses yeux, ce n'est pas lui donner du pouvoir, c'est lui faire recopier une évidence. L'égalité de deux valeurs n'est pas une thèse, c'est un fait.

**L'égalité vaut dans les cinq dimensions.** Deux heures identiques, deux quantités identiques *désignent la même chose* elles aussi — et c'est heureux : les deux scellés remis au greffe à 15h10 et les deux « 2 » (équipages, véhicules) sont des **doublons banals** (§4.4), qui doivent rester composables et inertes. L'ordre, lui, ne s'applique qu'aux dimensions d'écart.

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

**Depuis la déduction (29 juillet), ce critère porte tout le camouflage.** Rapprocher deux empans affiche désormais leur égalité en toutes lettres. Cela ne révèle rien que l'écran ne montrait déjà — la puce de mémoire porte son signataire, donc `agent T-14` s'y lit deux fois avant même qu'on ait composé quoi que ce soit. Mais le raisonnement du joueur n'a plus qu'un seul rempart : si `qui` ne comptait qu'un doublon, il suffirait d'essayer les paires jusqu'à ce que le jeu réponde « désignent la même chose » pour tomber sur le vice sans avoir rien compris. Le doublon banal n'est plus un ornement de vraisemblance : **c'est la seule chose qui empêche l'égalité déduite de désigner la réponse.**

### 4.5 Composer : désigner, pas déclarer

> **La grammaire de comparaison est complète dès la première phrase.
> Les articles, eux, sont du contenu : ils arrivent avec le dossier.**

C'est la formulation du 29 juillet, et elle **remplace** l'ancien invariant « aucune tournure n'apparaît en cours de partie ». Ce qui reste vrai : l'apparition tardive de *« désignent la même chose »* serait un panneau indicateur plus voyant que tout ce qu'on a écarté — les tournures de comparaison sont universelles, elles ne parlent d'aucune pièce, elles sont là dès la première seconde. Ce qui a changé : **un article n'est pas une tournure, c'est une pièce.** Le Manuel du cas le filtre déjà par livraison ; pouvoir invoquer l'article 7 en session 1 alors qu'il ne figure pas dans le manuel qu'on vient de consulter n'était pas du camouflage, c'était une incohérence. Le prix est réel et il est noté au §7 : en session 1 il ne reste qu'un article, donc la conclusion du tutoriel devient un choix forcé.

#### La relation ne se déclare pas, elle se déduit

> **Le joueur désigne deux empans. La relation entre eux est un fait, pas une thèse.**

Faire choisir entre « et », « précède » et « est d'un tout autre ordre que » revenait à faire recopier ce que les valeurs disaient déjà (§4.2). Une phrase se compose donc en **deux gestes** — deux passages de la mémoire — plus un troisième, facultatif : l'article.

La règle de déduction, en toutes lettres :

1. Les deux empans doivent être de la **même dimension**. Sinon il n'y a rien à comparer, et c'est le seul refus qui existe.
2. **Valeurs égales** → *ils désignent la même chose*, quelle que soit la dimension.
3. **Valeurs différentes**, dimension d'écart → l'**ordre** : *l'un précède l'autre*, *l'un est d'un tout autre ordre que l'autre*. Le sens de lecture appartient à la forme, pas au moteur.
4. **Valeurs différentes**, dimension d'identité → *ils ne désignent pas la même chose*.

En cas d'ambiguïté, la **première forme déclarée** qui accepte la dimension et dont le prédicat tient l'emporte. L'ordre de déclaration des formes est donc de l'écriture, comme le reste de la grammaire.

#### Ce que le joueur affirme encore

La question se pose, et il faut y répondre franchement : si le moteur déduit la relation, que reste-t-il de l'invariant « **la compréhension doit être exprimée, pas supposée** » (§7) ?

Il reste ceci, et ce n'est pas rien : **le joueur affirme *ces deux-là*, et *sous ce texte*.** Personne ne lui dit quels deux empans rapprocher parmi la centaine de paires possibles, ni quel article y appliquer. Noter que le même homme signe les deux prélèvements, et que c'est l'article 7 qui l'interdit — c'est **là** qu'est la compréhension. Qu'ils « désignent la même chose » n'en était que la transcription.

Mais l'honnêteté oblige à écrire l'autre moitié : **c'est moins qu'avant, et ce n'est pas éprouvé.** Le geste est passé de trois décisions à deux. Un joueur qui rapproche deux empans au hasard obtient maintenant une phrase bien formée sans avoir rien pensé. C'est un point ouvert du §7, pas un acquis.

#### Le fondement n'est pas un ingrédient, c'est le verbe

Le joueur ne va pas chercher un article pour le poser dans une case : il choisit la liaison *« …, au regard de l'article 7 »*, et **cette liaison est la base légale**. Le code juridique est une **référence qu'on consulte pour comprendre ce que veut dire une liaison**, jamais un corpus qu'on retraverse. Une règle ne lit **aucune** dimension.

**La qualification est neutre** (29 juillet). Il n'y a plus qu'une tournure par article — plus de « est contraire » / « est conforme » à trancher. Deux raisons, et la seconde compte plus que la première :

- **le geste** : désigner le texte applicable suffit ; savoir qu'une identité de personnel relève de l'article 7 *est* l'insight, dire ensuite qu'elle le viole n'en est que la paraphrase ;
- **le partage des rôles** : c'est le **lien du contenu** qui sait si l'on est dans la violation ou dans la conformité, et c'est **l'avocat qui le dit** — *« si ta lecture de l'article 7 est la bonne, l'échantillon est irrecevable »* d'un côté, *« conforme, en effet ; c'est l'autre moitié de l'article 7 qui m'intéresserait »* de l'autre. Le moteur, lui, ne tranche aucune question de droit. C'est exactement l'invariant **« l'IA informe, elle ne tranche pas »** (§7), servi par la mécanique au lieu d'être contredit par elle.

Le corollaire à ne pas manquer : la piste sans issue des scellés survit intacte. Elle serait morte si l'on avait fait de « contraire » la seule lecture possible.

#### La conclusion est une continuation

**La conclusion est une continuation, pas une seconde phrase** (28 juillet, conservé). Pour qualifier une comparaison, il fallait autrefois la clore, la retrouver dans une liste, ouvrir une **nouvelle** composition, y choisir un bloc *« ce qui précède »*, puis seulement l'article — deux compositions pour une pensée.

> **Une comparaison n'est jamais terminée d'office. Elle demande toujours : « et donc ? »**

Une fois les deux empans posés, l'automate n'est pas dans un état final. Il offre, dans le même souffle et sur la même ligne :

- **« — en rester là »**, qui clôt la phrase sur la comparaison seule ;
- ou l'une des liaisons-articles **reçues**, *« …, au regard de l'article 7 »*, qui **emboîte** la comparaison comme sujet de la qualification et clôt la phrase dessus.

L'universalité tient toujours *à l'intérieur d'une session* : les articles reçus sont offerts après **toute** comparaison — celle du greffier comme celle du vice. Refuser la continuation est aussi ordinaire que la prendre ; « en rester là » est le bloc le plus cliqué du jeu. Bénéfice conservé : la réplique d'agacement de l'avocat (*« Et donc ? Qu'est-ce que j'en fais ? »*) répond à un choix que le joueur vient de faire sciemment.

Aucune liste d'options n'est jamais **restreinte par la pertinence** : parmi ce qui est reçu, le joueur peut toujours tout poser. Seules les erreurs de **catégorie** (deux dimensions qui ne se comparent pas) sont refusées à la clôture, avec un message qui ne dit rien de plus que ce que l'écran disait déjà. Une phrase sensée mais sans intérêt reste **gratuite**.

Le bloc *« ce qui précède »* — un terme de source `note` — et les liaisons de comparaison choisies à la main **ne figurent plus dans le contenu livré**. Le moteur continue de les supporter (§14) : c'est ce qui garantit qu'une affaire écrite autrement se joue toujours.

### 4.6 Les trois surfaces — la frontière morale

| Surface | Statut | Rôle |
|---|---|---|
| Le canal + les pièces | lecture | l'entrée |
| **L'atelier** | **privé** | les empans retenus **et** la phrase qu'on écrit avec — **jamais jugés** |
| Le plan de plaidoirie | **transmis** | ce que l'avocat retient |

Elles étaient quatre jusqu'au 28 juillet : « la mémoire » et « le brouillon » vivaient dans deux colonnes séparées, et la liste des empans retenus s'affichait **deux fois** — une fois comme mémoire, une fois comme clavier du composeur. Deux zones pour un seul objet ; le joueur ne savait plus laquelle regardait l'autre.

> **Un empan retenu n'existe qu'une fois à l'écran. Cette occurrence unique est à la fois la mémoire et le clavier.**

Les puces de la mémoire **sont** les boutons de terme. Les retenir, les relire, les oublier, les poser dans une phrase : un seul objet, un seul endroit. Ce qui reste de l'ancien « brouillon » devient un **journal interne** — il sert encore au dédoublonnage, au drapeau `vice_trouve` et au présentoir de la répétition, mais il n'a plus de zone à lui : ce n'était pas une surface, c'était une liste d'attente.

**L'envoi se fait sur place** (28 juillet). La phrase close ne part pas dans une liste qu'il faut ensuite parcourir pour l'y retrouver : elle **reste sous les yeux, là où elle vient d'être écrite**, avec un bouton unique, *« → Maître Auber »*, et un *« effacer »*. Le second geste demeure — il est simplement au bout du premier, sans changement de colonne ni de regard.

**Composer et envoyer restent deux gestes distincts, et c'est non négociable.** Tout le dilemme tient là : sans un intervalle entre *comprendre* et *dire*, `vice_trouve` impliquerait `vice_expose`, la Fin 2 deviendrait injouable et il ne resterait que deux fins. Ce qui a été supprimé, c'est la **distance** entre les deux gestes, jamais le second geste.

**L'avocat ne voit que la plaidoirie.** C'est ce qui rend l'atelier réellement gratuit et fait de l'envoi le seul geste à conséquence — donc le seul lieu possible du dilemme, dès la première session. Surligner ne produit rien, composer ne produit rien : **rien ne se passe** tant que rien n'est envoyé.

**Le plan ne retient que les moyens** (28 juillet). L'avocat entend tout ce qu'on lui envoie et répond à tout ; mais il n'**inscrit** au plan que ce qu'il peut plaider — une qualification par un article, le faux vice, ce qui sert l'attente de la session. Une comparaison sans conclusion reçoit sa réplique dans le canal et ne laisse pas de trace au plan : *« en l'état c'est une remarque, pas un moyen »*, ce qu'il disait déjà mot pour mot. Le plan cesse ainsi d'être un bac où s'entassent les tâtonnements et redevient ce que son nom annonce : **un plan**, lisible d'un regard, où ne figure que ce qui tiendra devant un tribunal. Corollaire à ne pas manquer : l'envoi reste **irréversible** — ce qui n'entre pas au plan a tout de même été dit, et l'agacement de l'avocat, lui, s'accumule.

La boucle d'une session, dans l'ordre : **l'avocat ouvre** et livre un lot → **lire** (tout est marqué, sans tri) → **surligner** (rien ne se passe) → **composer**, conclusion comprise (rien ne se passe) → la phrase close attend sur place → **l'envoyer** : second geste, le seul qui parle → l'avocat répond, et n'inscrit au plan que si c'est un moyen → l'attente servie ferme la session.

### 4.7 Où se logent les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | une phrase reconnue comme lien `vice` **se clôt** | privée |
| `vice_trouve` | la **conclusion** se clôt : la comparaison-vice qualifiée par une liaison-article | privée |
| `vice_expose` | cette conclusion est **envoyée** — et alors seulement, *transmis = compris*, `vice_trouve` est levé aussi | transmise |

La logique est **inchangée** depuis le 27 juillet ; seul le lieu se renomme. Les deux premiers drapeaux se lèvent à la **clôture de la phrase**, le troisième à son **envoi** — et c'est l'intervalle entre les deux, si court soit-il devenu, qui porte la Fin 2 : composer la conclusion, la voir écrite, et ne pas cliquer *« → Maître Auber »*.

Envoyer la **comparaison seule** (le pressentiment, sans l'article) ne lève rien : l'avocat répond *« en l'état c'est une remarque, pas un moyen — dis-le-moi en droit »*, et elle n'entre pas au plan. C'est ce qui donne son prix au second geste : la conclusion, et elle seule, engage.

**Ce que la continuation ne change pas.** Puisque la conclusion s'écrit désormais dans le même souffle que sa comparaison, on pourrait croire que `vice_pressenti` n'a plus de moment propre. Il en a un : le joueur qui compose la comparaison du vice et choisit **« en rester là »** l'a pressenti sans le qualifier — et c'est exactement le geste que l'avocat relance. La séquence *pressentir → se faire relancer → conclure* survit intacte, en deux phrases envoyées au lieu de deux phrases composées.

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
- **La déduction.** En lisant les deux pièces de prélèvement, on remarque que le même homme s'attribue les deux opérations. Les **scellés**, eux, sont **distincts et conformes** — une piste qui ne mène nulle part (l'autre moitié de l'article 7, pour que « tout lien vers le protocole » ne gagne pas automatiquement), et sur laquelle la liaison *« …, au regard de l'article 7 »* mène à une réponse de conformité. → On ne *voit* pas le vice, on le *reconstitue* : deux empans désignés, puis l'article. La conclusion se lit *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »* (§4.5)
- **La contradiction du tutoriel.** Session 1, sur `quand` : le voisin situe des éclats de voix « vers 22h30 », la patrouille était sur place à 22h04. Elle enseigne le geste entier — comparer, puis **conclure** (article 3) — sans être le vice.
- **Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Comme l'avocat **ne sait pas**, il *pousse* lui-même vers ce leurre à l'ouverture du rapport — une **tentation partagée**, pas un piège tendu. C'est aussi le chemin docile : l'envoyer suffit à fermer la dernière session, donc à atteindre la Fin 3.
- **Le sens moral (glaçant).** Le protocole violé est *exactement* celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai. Forme morale parfaite pour la Fin 1.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** (le sens en une liste — en cas de doute, ils tranchent) :

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** C'est la phrase composée qui la manifeste — depuis le 29 juillet, par le choix des deux empans et de l'article, non plus par celui de la relation. **Invariant sous surveillance** : voir les points ouverts.
- **Saisie structurée, pas texte libre.** On compose avec un vocabulaire fermé, on ne tape pas.
- **La relation ne se déclare pas, elle se déduit des valeurs.** Le joueur désigne deux empans ; ce qui les lie est un fait (§4.5).
- **On n'invoque pas un texte qu'on n'a pas reçu.** La grammaire de comparaison est complète dès la première phrase ; les articles arrivent avec le dossier (§4.5).
- **Le moteur ne tranche aucune question de droit.** Une tournure par article, neutre ; c'est le contenu qui sait et l'avocat qui le dit (§4.5).
- **Tout mécanisme utilisé une seule fois est un panneau indicateur.** Le choix moral s'exprime avec un verbe employé cent fois auparavant (§4).
- **Le marquage des empans ne varie jamais** avec la pertinence (§4.3).
- **Un empan se lit deux fois** : sa citation dans la pièce, son nom dans la phrase (§4.1).
- **Une dimension sans doublon désigne sa réponse** (§4.4).
- **La marge de bruit doit rester non nulle** : il doit exister des phrases sensées qui ne portent aucun lien, sinon « sensé » vaudrait « correct ».
- **Rien ne se passe tant que rien n'est envoyé.** Une surface privée, jamais jugée (§4.6).
- **Composer et envoyer restent deux gestes.** Leur distance peut se réduire, jamais leur nombre : sans l'intervalle, la Fin 2 n'existe plus (§4.6).
- **Le plan ne contient que ce qui se plaide.** Tout est entendu, seuls les moyens sont inscrits (§4.6).
- **Un empan retenu n'existe qu'une fois à l'écran** : la mémoire et le clavier du composeur sont le même objet (§4.6).
- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat.
- **Le décommissionnement est diégétique**, jamais un « tu es nulle » ; équilibré par le **brouillard**.
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée.
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, ne rend pas de verdict sur le joueur.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité.
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

**Les arbitrages tranchés (juillet 2026, appliqués au code — tous réversibles) :**

1. **Le budget d'attention (P0) est retiré.** Il ne bloquait pas l'énumération à l'aveugle et contredisait deux invariants. **Surligner et composer sont gratuits et illimités** ; le seul frein reste l'agacement diégétique de l'avocat à l'envoi.
2. **Le vice a un canal unique : le personnel.** Les scellés sont distincts et **conformes** ; seule l'identité de l'agent reste le vice. Une conformité vérifiable qui ne mène nulle part existe (l'autre moitié de l'article 7).
3. **La fenêtre interdite est abandonnée.** Délai entre prélèvements **indifférent** : seuil net, violation binaire. Les horaires des pièces redeviennent du bruit assumé.
4. **Le livrable est une plaidoirie, et l'IA est partisane dès la première minute** (§1). « Présenter ses propres arguments » est coupé ; le prototype ne fait que **réfuter**.
5. **Le geste `champ + relation + champ` est remplacé par composer puis envoyer** (§4), et les `cases` à trois options sont retirées (§4.7).
6. **La refonte ergonomique du 28 juillet**, en un bloc : la conclusion s'écrit en **continuation** et le bloc *« ce qui précède »* est retiré du contenu ; l'**envoi se fait sur place** et le brouillon cesse d'être une surface ; **la mémoire et le composeur fusionnent** ; le **plan ne retient que les moyens** ; un empan porte un **nom** en plus de sa citation. Rien du sens n'est touché : les trois fins, les trois drapeaux et la frontière privé/transmis sont exactement ceux du 27 juillet.
7. **La refonte de la déduction, 29 juillet**, en un bloc : les liaisons de comparaison disparaissent — **le joueur désigne deux empans et la relation se déduit** de leur dimension et de leurs valeurs ; les six formes de qualification deviennent **trois tournures neutres** (« au regard de l'article N »), le sens restant au contenu et à la réplique de l'avocat ; **un article n'est offert qu'une fois sa pièce livrée**, ce qui retire l'ancien invariant « aucune tournure n'apparaît en cours de partie » au profit de la formulation en deux temps du §4.5. Les trois fins, les trois drapeaux et la frontière privé/transmis sont, une fois de plus, intacts.

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?* Si c'est un formulaire, le problème n'est pas dans le code et aucun ajout de mécanique ne le sauvera. **Non éprouvé** — les tests prouvent le comportement, jamais l'expérience.
- **La compréhension est-elle encore *exprimée* ?** C'est le vrai risque ouvert par le 29 juillet (§4.5). Le joueur n'affirme plus quelle relation lie deux empans, seulement lesquels rapprocher et sous quel texte. Un joueur qui rapproche deux empans au hasard obtient une phrase bien formée sans avoir rien pensé. **Non éprouvé** — et à surveiller en priorité à la prochaine partie, avant tout autre point.
- **Le choix forcé de la session 1.** Conséquence directe du masquage des articles : le tutoriel ne propose plus qu'un seul article, donc la conclusion s'y compose sans arbitrage. Acceptable pour un tutoriel, à re-regarder si une session future se retrouvait dans le même cas.
- **Le rythme des zones** à l'écran. Le risque « quatre zones » est **refermé pour moitié** : elles sont trois (canal / atelier / plan), la duplication mémoire↔composeur a disparu et la phrase ne change plus de colonne pour partir (§4.6). Ce qui reste ouvert est l'autre moitié — la colonne d'atelier porte maintenant le dossier, la phrase et les empans, et sa densité n'est **pas éprouvée**.
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

**C'est à quoi sert le `nom` d'empan** (§4.1), et c'est le seul remède : tant qu'un terme était une citation entière, aucune liaison ne pouvait s'y accrocher proprement. Deux règles d'écriture en découlent, et elles se vérifient à l'œil, phrase par phrase :

- **Un nom d'empan est un groupe nominal**, jamais une proposition : *« l'heure des éclats de voix »*, pas *« le voisin a entendu crier »*. Il doit tenir des deux côtés d'une liaison.
- **La continuation (§4.5) crée un second point de rupture** : *« …, au regard de l'article 7 »* vient se coller à une comparaison déjà formée. La virgule et la locution neutre sont là pour ça — elles reprennent la comparaison entière sans avoir à s'accorder avec elle. Toute autre tournure de continuation devra passer le **test de l'accord** avant d'entrer dans le contenu.

**La déduction (29 juillet) a supprimé le point de rupture le plus dangereux.** Tant que le joueur choisissait la liaison à la main, chaque liaison devait s'accorder avec **n'importe quel** nom d'empan — c'est ce qui avait forcé « est antérieur à » à devenir « précède », un verbe sans participe étant le seul à ne jamais fauter. Désormais chaque forme porte son **patron** (§11), une phrase entière écrite d'un bloc : *« {a} précède {b} »*. L'accord ne se joue plus qu'à **quatre endroits**, connus, relus une fois — au lieu d'être une propriété émergente du croisement de dix liaisons et de vingt noms.

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
      empans: { e_appel:{ dim:"quand", valeur:"21:52",
                          texte:"l'appel nous est parvenu à 21h52",  // ce qui se lit dans la pièce
                          nom:"l'heure de l'appel" }, … },           // ce qui parle dans une phrase
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

**Le `nom` d'un empan est optionnel** (§4.1). Absent, le `texte` en tient lieu partout — c'est ce qui permet d'ajouter le champ **sans changer de schéma** : un contenu écrit avant le 28 juillet reste valide et jouable, simplement moins lisible. Le diagnostic de l'atelier le signale par un **avertissement**, jamais une erreur.

**Les attributs optionnels d'un bloc de grammaire** — tous optionnels, tous sans effet quand ils sont absents :

- `imbrique: true` — la liaison **emboîte** ce qui a été composé jusque-là comme terme unique de sa propre forme, au lieu de remplacer la forme courante. C'est ce qui fait tenir *« a et b désignent la même chose, au regard de l'article 7 »* en une seule composition. Sans cet attribut : la dernière forme rencontrée gagne, les termes restent à plat.
- `deduit: true` *(29 juillet)* — ce bloc **clôt une paire** : au lieu de porter une forme, il la fait **déduire** des deux termes accumulés (§4.5), puis les range dans l'ordre canonique. C'est ce qui remplace les liaisons de comparaison.
- `piece` *(29 juillet)* — le bloc n'est offert au joueur qu'une fois **cette pièce livrée**. Un seul usage : les liaisons-articles. Sans cet attribut, le bloc est offert dès la première phrase, comme avant.
- `libelle` — le texte du **bouton**, quand il diffère de ce qui sera rendu dans la phrase. Un seul usage : le bloc de clôture, dont le bouton dit *« — en rester là »* et qui n'écrit rien.

**Les attributs optionnels d'une forme** *(29 juillet)* :

- `deduction` — `"egalite"` (les valeurs sont égales), `"difference"` ou `"ordre"` (elles diffèrent). C'est le prédicat que `deduire` évalue. Une forme sans `deduction` n'est jamais déduite : elle reste atteignable par une liaison explicite, à l'ancienne.
- `sens` — `"asc"` (défaut) ou `"desc"`, pour une forme `ordonne:true` : dans quel ordre ranger les deux termes une fois la forme déduite. C'est de l'écriture — *« l'heure d'arrivée précède l'heure des éclats »* se lit dans l'ordre croissant, *« la probabilité est d'un tout autre ordre que le seuil »* dans l'ordre décroissant.
- `patron` — la phrase, écrite d'un bloc, avec `{a}` et `{b}` : *« {a} précède {b} »*. C'est **le seul endroit où l'accord se joue** (§8.8). Sans `patron`, le rendu retombe sur la concaténation des blocs, comme avant.

**L'ordre de déclaration des formes est signifiant** : `deduire` rend la première dont la dimension convient et dont le prédicat tient. Placer `anteriorite` avant `identite_non` est donc une décision d'écriture — c'est elle qui fait que deux heures différentes produisent un ordre plutôt qu'une non-identité.

**Un terme d'un lien** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** : c'est ce qui permet la chaîne du vice en une comparaison et sa continuation, plutôt qu'en un clic. La déclaration des `liens` n'a **pas changé** au 28 ni au 29 juillet — c'est la même forme réduite, atteinte par un chemin de plus en plus court. Seuls les **noms de formes** ont bougé le 29 (`contraire_N` et `conforme_N` fusionnés en `article_N`), et l'ordre des termes d'une forme ordonnée doit désormais suivre le `sens` déclaré, puisque c'est celui que le moteur produira.

**La source `note`** (un terme rempli par une phrase déjà close, jadis le bloc *« ce qui précède »*) ne figure plus dans le contenu livré, mais **le moteur et le jeu la supportent toujours** : une affaire qui l'emploie se joue sans modification. C'est le même principe que le repli embarqué — on ne retire pas une capacité du moteur parce que le contenu du jour ne s'en sert pas.

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

**Ce qui a changé le 28 juillet**, rétrocompatible :

- **`reduire(ch)`** accumule au lieu d'écraser. En parcourant la chaîne de blocs, elle empile les termes et retient la forme courante ; à la rencontre d'un bloc `imbrique` (§11), ce qui a été accumulé devient le **terme unique** de la nouvelle forme : `termes = [{forme, termes}]`. Une grammaire sans aucun `imbrique` produit exactement le résultat d'avant — la dernière forme gagne, les termes restent plats.
- **`rendre(ch)`** écrit le **`nom`** d'un empan (§4.1) et non plus sa citation, avec repli sur `texte` ; et elle ne place pas d'espace devant un fragment qui commence par une ponctuation, pour que *« …même chose »* + *« , ce qui est contraire… »* se recolle proprement (§8.8).

**Ce qui a changé le 29 juillet** — la déduction. Trois fonctions neuves, et deux retouches :

- **`comparer(a, b)`** — l'ordre de deux valeurs, `-1 / 0 / 1`. **Numérique** quand les deux valeurs le sont, `hh:mm` compris (converti en minutes) ; **lexicographique** sinon. C'est délibérément fruste : une valeur est un jeton de contenu, pas un type.
- **`deduire(idA, idB)`** — la forme qui lie deux empans, ou `null`. Dimensions différentes → `null`, et c'est le seul refus qui existe. Sinon, la **première forme déclarée** dont `slots[0]` accepte la dimension et dont `deduction` tient (§11).
- **`ordonner(forme, [a, b])`** — pour une forme `ordonne:true`, la paire rangée selon `sens`. Sans effet ailleurs : `memeRed` compare déjà les formes non ordonnées sans tenir compte de l'ordre.
- **`reduire(ch)`** — un bloc `deduit` déclenche `deduire` puis `ordonner` sur les deux termes accumulés. L'emboîtement s'applique ensuite, inchangé.
- **`rendre(ch)`** — quand la forme courante porte un `patron`, les deux termes rendus sont remplacés par le patron rempli, dans l'ordre canonique.

**Le contrat de rétrocompatibilité, en une phrase :** sans `deduit`, sans `deduction`, sans `patron`, `reduire` et `rendre` se comportent exactement comme au 28 juillet. `test_autre_affaire.js` — dont l'affaire est écrite avec des liaisons explicites et un bloc *« ce qui précède »* — le vérifie à chaque exécution, sans qu'une ligne de son contenu ait jamais bougé.

`squelettes()` n'a pas bougé : elle explore les nouveaux chemins sans rien savoir d'eux.

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
| Surligner → mémoire (privé, gratuit, illimité, dédoublonné ; re-cliquer oublie) — **une seule liste, qui sert aussi de clavier** (§4.6) | `surligner()`, `renderAtelier()` | `simSurligner()` |
| Composer : blocs offerts par l'état, termes pris dans la mémoire, refus des seules erreurs de catégorie | `blocsOfferts()`, `poserBloc()`, `cloreCompo()` | `simComposer()` + l'onglet Grammaire |
| **Déduction** : deux empans désignés, la relation calculée de leur dimension et de leurs valeurs (§4.5) | `deduire()` / `ordonner()` de `moteur.js`, via `reduire()` | l'onglet Grammaire + `simComposable()` |
| **Un article n'est offert qu'une fois sa pièce livrée** (§4.5) | `piecesLivrees()`, `blocsOfferts()` | `simComposable()` + le badge ⚙ des sessions |
| **Continuation** : une comparaison close n'est pas finale — « en rester là » ou une liaison-article qui l'emboîte (§4.5) | l'automate du contenu + `reduire()` de `moteur.js` | l'onglet Grammaire (squelettes) |
| Clore une phrase = privé, elle attend **sur place** ; l'envoyer = transmis, et **seul** déclencheur de réplique | `cloreCompo()`, `envoyer()`, `reponseAvocat()` | `simEnvoyer()`, `simReplique()` |
| **Le plan ne retient que les moyens** : conclusion, faux vice, ou ce qui sert l'attente (§4.6) | `estMoyen()`, `renderAtelier()` | `simEnvoyer()` + la frise |
| Les trois drapeaux du vice (§4.7) | `cloreCompo()`, `envoyer()` | pastilles `vice_pressenti` / `vice_trouve` / `vice_expose` |
| Avancement : la session suivante part quand une phrase envoyée porte le `attend` de la session courante | `avancerSurAttente()`, `envoyerRemise()` | `simEnvoyer()` + badge ⚙ des sessions |
| Réplique : vice+conclusion / faux / `lien.rep` / escalade `rep_inutile` (arité 2) ou `rep_sans_rapport` (arité 1) | `reponseAvocat()` | `simReplique()` |
| Index du dossier (vu / pas‑vu) | `renderDossier()` (pur affichage) | mentionné dans la frise |
| Clôture : ouverte quand la dernière attente est servie ; intro + affirmation 1 ; journal vide → présentoir vide | `instructionComplete()`, `cloturer()` | `simInstructionComplete()`, `simCloturer()` |
| Répétition : laisser passer / envoyer une phrase contre l'affirmation / déjà envoyée → `deja`. **Le présentoir lit le journal des phrases closes** — c'est le dernier moment du dilemme (§4.7) | `avancerRepetition()`, `verserContre()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle », **parmi les pièces livrées** ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` correspondantes et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.

Méthode (contenu du SEED) : modifier `SEED` dans `atelier_v3.html` → `npm run export:seed` → relancer les suites.

**Ce que le diagnostic de l'atelier contrôle**, au-delà du câblage : la **règle de surlignage** (empan sans marqueur → erreur ; heure laissée hors marqueur → avertissement), le **nom d'empan** (absent → avertissement, §11), le **doublon banal** dans les deux sens (§4.4), la **grammaire** (impasse de l'automate, clôture sans forme, forme indicible, lien insensé au regard des catégories, **emboîtement dans le vide**, **forme ordonnée sans `sens`**, **dimension qu'aucune forme déductible n'accepte**), le **vice** (pas de conclusion → erreur ; plusieurs canaux → avertissement) et les **sessions** (sans `attend`, ou attendant un tag qu'aucun lien ne porte → erreur).

**Un contrôle mérite d'être nommé à part**, parce que c'est le masquage des articles (§4.5) qui l'a rendu nécessaire : **un article livré trop tard**. Si une session attend un tag que seul un lien peut servir, et que ce lien exige un article dont la pièce n'arrive qu'à une session *ultérieure*, la session devient **inclôturable** — le joueur ne peut littéralement pas écrire la phrase qu'on lui demande. C'est une **erreur**, et c'est le genre de piège qu'aucune relecture ne rattrape et qu'une partie de test ne révèle qu'après vingt minutes.

## 16. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`), qui inline `content.js` **et** `moteur.js` au boot.

> **Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice`/`lienConclusion`/`lienFaux`/`lienTag`, `composerLien(w,L)` (compose la phrase qui réalise un lien donné, quel qu'il soit, en parcourant l'automate), `phrasesBruit(w,n)` (phrases sensées sans lien), `cheminVers`, `instruire` (le chemin docile), `terminer`/`numeroFin`. Pour l'atelier, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**
>
> `composerLien` connaît **deux façons** d'atteindre une forme emboîtée, et essaie la seconde si la première échoue : la **continuation** (prolonger la composition en cours par un bloc `imbrique`, §4.5) et l'ancienne **source `note`** (clore, puis repartir d'un bloc *« ce qui précède »*). C'est ce qui fait que `test_autre_affaire.js` — dont l'affaire abstraite est écrite à l'ancienne — reste vert sans qu'une ligne de son contenu ne bouge : la preuve, à chaque exécution, que la rétrocompatibilité annoncée au §11 est réelle.

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (32) | le jeu, contenu **embarqué** | l'index du dossier (vu / pas-vu) ; tout empan est rendu cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; les trois fins |
| `test_declencheurs.js` (31) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, `attend`/`apres`, Manuels par type **et par livraison**, les trois drapeaux (dont « pressentir sans conclure → Fin 3 »), dimensions entièrement renommées, rejet d'un contenu de schéma 2 |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite — sa propre grammaire, ses propres dimensions, 3 sessions, et une chaîne écrite **à l'ancienne** (source `note`) — se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (72) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; **la déduction** (chaque relation déclarée se retrouve à partir des valeurs ; l'ordre des clics n'importe pas ; deux valeurs égales hors identité restent comparables ; **le patron s'écrit, verbe compris**) ; **le filtre de livraison** (un article non reçu n'est pas offert, il l'est une fois livré) ; **la continuation** (une comparaison n'est pas finale ; « en rester là » ; la forme emboîtée obtenue est celle du lien déclaré) ; refus de catégorie (le seul refus qui existe) ; modale de pièce et légende ; **la phrase close attend sur place et l'envoi la vide** ; réplique **seulement** à l'envoi ; **le plan ne retient que les moyens** ; `rep_faux` et `variante_faux` ; les deux escalades séparées ; répétition (`deja`, cible, refus de confirmer pendant) |
| `test_sauvegarde.js` (33) | le jeu | la partie survit au rechargement (mémoire, journal, plan, **composition en cours**, **phrase close en attente**, drapeaux, `une_fois` non rejoué) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (67) | l'atelier + le couple atelier→jeu | SEED sans erreur ; diagnostic (empan sans marqueur, **empan sans nom**, valeur hors marqueur, dimension inconnue, **doublon banal** dans les deux sens, vice sans conclusion, session sans `attend`, lien insensé, **emboîtement dans le vide**, pièce non livrée) ; migration 2→3 idempotente ; renommage d'empans et de pièces ; `conclureLien` ; simulation des trois drapeaux et du chemin docile ; export `schema: 3` adopté et joué par le moteur ; autosave |

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (255 contrôles). `npm test` enchaîne aussi `tests/verifier_content_sync.js` — un garde-fou, pas une septième suite. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 17. Résumé en trois phrases

Le contenu s'écrit dans l'atelier et voyage en un seul fichier, `content.js`, que le jeu charge tel quel — les versions embarquées ne sont que des filets. Les règles du jeu n'ont qu'une maison, le code de `index.html`, et la grammaire qu'une seule, `app/moteur.js` ; l'atelier les reflète (badges ⚙) pour qu'on puisse *voir* et *simuler* le déroulé, au prix d'une resynchronisation manuelle listée au §15. La Partie I reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

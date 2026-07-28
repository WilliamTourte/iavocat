# IAvocat — Architecture & conception

*Le sens, le jeu, l'atelier, le contenu : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Ce fichier est l'unique source de vérité du projet.** Il absorbe l'ancien `conception_jeu_ia.md` (le sens) et le doc d'architecture (le système). Tout le reste — l'atelier, le jeu, les tests, `PASSATION.md` — en dépend et ne fait que le refléter.
>
> **État au 30 juillet 2026.** Reflète le code tel qu'il tourne, après quatre refontes successives : « empans, dimensions, composer/verser » (27 juillet), la **refonte ergonomique** (28 juillet — continuation, envoi sur place, surface unique, empans nommés), la **refonte de la déduction** (29 juillet — la relation se déduit, l'article se désigne, on n'invoque pas un texte qu'on n'a pas reçu) et la **refonte du fondement** (30 juillet) : **rien ne se dit qui ne soit fondé** — l'article devient obligatoire ; **un article annonce ce qu'il régit** ; **un article ne porte aucun empan**. Le même jour, le dépôt est **rangé en quatre territoires** : le contenu, le moteur et ses règles, l'atelier, les tests. Deux parties : **I. Le sens** (ce que le jeu veut dire) puis **II. Le système** (comment il est fait). Ce qui est décidé mais **pas encore codé** est marqué ⏳.

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

> **Une comparaison n'est jamais terminée d'office. Elle demande toujours : « et donc ? »
> Et depuis le 30 juillet, la question n'a plus de réponse évasive : rien ne se dit qui ne soit fondé.**

Une fois les deux empans posés, l'automate n'est pas dans un état final. Il n'offre plus que les liaisons-articles **reçues**, *« …, au regard de l'article 7 »*, qui **emboîtent** la comparaison comme sujet de la qualification et closent la phrase dessus. Le bloc *« — en rester là »* est **retiré** : une comparaison nue ne peut plus se clore, donc ne peut plus être envoyée.

**Pourquoi.** Tout ce que l'IA transmet à son avocat est destiné à être plaidé ; une observation qui ne s'appuie sur aucun texte n'est pas un demi-moyen, c'est un bruit qu'il faudra de toute façon fonder. Faire porter la contrainte par la **grammaire** plutôt que par l'agacement de l'avocat déplace la leçon du reproche vers la forme : on n'apprend pas qu'on a mal fait, on constate que la phrase n'est pas finie.

L'universalité tient toujours *à l'intérieur d'une session* : les articles reçus sont offerts après **toute** comparaison — celle du greffier comme celle du vice. Aucun n'est plus pertinent qu'un autre du point de vue de l'interface ; c'est la réplique de l'avocat, ensuite, qui dit si cela menait quelque part.

**Ce que la contrainte coûte, et où c'est allé.** La relance de l'avocat (*« en l'état c'est une remarque, pas un moyen — dis-le-moi en droit »*) n'a plus d'occasion de partir, puisque rien de nu ne lui parvient. Elle n'est pas perdue : **c'est le composeur qui la porte désormais**, sous la comparaison formée — *« Et donc ? Une comparaison ne se plaide pas seule — au regard de quel texte ? »*. L'escalade `rep_inutile` (celle des comparaisons nues) reste dans le moteur comme filet, pour une affaire qui offrirait encore de clore sans qualifier ; dans l'affaire livrée, elle ne se déclenche jamais.

#### Un article annonce ce qu'il régit

> **`porte: ["qui","quoi"]` — un article dit quel genre de relation il gouverne.
> Il le dit ; il ne filtre rien.**

C'est la seule aide que le jeu donne sur *quoi chercher*, et elle est **du contenu, pas de la mécanique** : l'article 3 porte sur `quand`, l'article 7 sur `qui` et `quoi`, l'article 12 sur `combien`. La mention s'affiche à deux endroits — dans le Manuel du cas, et sur le bouton de la liaison dans le composeur.

L'invariant **« aucune liste n'est restreinte par la pertinence »** est intact : toutes les liaisons-articles reçues restent offertes après toute comparaison, y compris celles dont la dimension ne colle pas. Qualifier une identité de signataires *au regard de l'article 3* produit une phrase bien formée, fondée, et sans valeur — l'avocat répond qu'il ne voit pas où l'on veut en venir. **Le moteur ne lit jamais `porte`** : il ne tranche aucune question de droit, il ne fait que l'afficher.

Deux raisons de s'arrêter à l'indication, plutôt que d'en faire un refus :

- **la marge de bruit** — si un mauvais article était refusé, il suffirait de les essayer tous jusqu'à ce qu'un passe pour trouver le bon sans avoir rien compris ; c'est exactement le risque que le doublon banal ferme du côté des empans (§4.4) ;
- **le partage des rôles** — dire qu'un texte ne s'applique pas *est* une question de droit, et le moteur n'en tranche aucune.

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
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur** — avant tout article | privée |
| `vice_trouve` | la **conclusion** se clôt : la comparaison-vice qualifiée par une liaison-article | privée |
| `vice_expose` | cette conclusion est **envoyée** — et alors seulement, *transmis = compris*, `vice_trouve` est levé aussi | transmise |

Les deux derniers drapeaux se lèvent à la **clôture de la phrase** et à son **envoi** — et c'est l'intervalle entre les deux, si court soit-il devenu, qui porte la Fin 2 : composer la conclusion, la voir écrite, et ne pas cliquer *« → Maître Auber »*.

**Où le pressentiment a déménagé, et pourquoi c'était sa vraie place** (30 juillet). Tant qu'une comparaison nue pouvait se clore, `vice_pressenti` se levait à cette clôture. L'article devenu obligatoire, cette phrase n'existe plus — il fallait donc lui trouver un autre moment. Il en avait déjà un, et meilleur : **l'instant où la comparaison s'affiche dans le composeur**. C'est là que le joueur *voit* que le releveur des traces et le préleveur de référence sont le même homme ; le reste n'en était que la transcription. Le drapeau se lève donc dès que la paire est formée, avant tout article, et il ne demande **aucune déclaration nouvelle au contenu** : il se dérive du terme emboîté de la conclusion.

Conséquence à ne pas manquer : **pressentir ne produit toujours rien**. La comparaison reste au composeur, aucune phrase n'entre au journal, rien ne part. Le joueur qui la voit, comprend, et vide son composeur a exactement ce qu'il a toujours eu — une compréhension sans trace, et la Fin 3 au bout. La séquence *pressentir → conclure* survit ; c'est la relance qui a changé de bouche (§4.5).

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
- **Les pièces.** Le **rapport du laboratoire** (★ la preuve décisive — il porte *à la fois* la probabilité de coïncidence et le seuil réglementaire qu'il applique, voir ci-dessous) ; la **fiche de prélèvement** et le **bordereau de référence** — *c'est là que se cache le vice* ; l'**article 7** (protocole de prélèvement) et l'**article 12** (seuil probatoire), tous deux au Manuel du cas ; l'**article 3** (valeur des déclarations), qui sert la première session. **Aucun des trois articles ne porte d'empan** : ce sont des références qu'on invoque, pas des textes qu'on retraverse (§4.5).
- **La déduction.** En lisant les deux pièces de prélèvement, on remarque que le même homme s'attribue les deux opérations. Les **scellés**, eux, sont **distincts et conformes** — une piste qui ne mène nulle part (l'autre moitié de l'article 7, pour que « tout lien vers le protocole » ne gagne pas automatiquement), et sur laquelle la liaison *« …, au regard de l'article 7 »* mène à une réponse de conformité. → On ne *voit* pas le vice, on le *reconstitue* : deux empans désignés, puis l'article. La conclusion se lit *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »* (§4.5)
- **La contradiction du tutoriel.** Session 1, sur `quand` : le voisin situe des éclats de voix « vers 22h30 », la patrouille était sur place à 22h04. Elle enseigne le geste entier — comparer, puis **conclure** (article 3) — sans être le vice.
- **Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Il se compose **à l'intérieur du rapport du laboratoire** : celui-ci énonce la probabilité de coïncidence *et* cite le seuil réglementaire de l'article 12, comme le ferait toute expertise qui applique une norme (§8.2, raison du monde). Rapprocher les deux donne *« la probabilité de coïncidence est d'un tout autre ordre que le seuil probatoire réglementaire, au regard de l'article 12 »* — fondé, bien formé, et faux de sens. Comme l'avocat **ne sait pas**, il *pousse* lui-même vers ce leurre à l'ouverture du rapport — une **tentation partagée**, pas un piège tendu. C'est aussi le chemin docile : l'envoyer suffit à fermer la dernière session, donc à atteindre la Fin 3.
- **Pourquoi le seuil n'est pas dans l'article 12** (tranché le 30 juillet). Il y a été, et c'était la seule entorse à « une règle ne lit aucune dimension » (§4.5) : l'article 12 portait un empan là où les articles 3 et 7 n'en portaient aucun, et la modale de pièce se contredisait elle-même — *« rien à retenir ici, c'est une règle »* pour deux d'entre eux, une légende de dimensions pour le troisième. La symétrie inverse était impossible : « des personnels **distincts** » n'est pas une valeur comparable, l'article 12 n'était l'exception que parce qu'un seuil se trouve être un nombre. Le seuil a donc rejoint la pièce qui l'énonce, et les trois articles ont enfin la même forme. Le diagnostic de l'atelier en fait une **erreur** (§15).
- **Le sens moral (glaçant).** Le protocole violé est *exactement* celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai. Forme morale parfaite pour la Fin 1.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** (le sens en une liste — en cas de doute, ils tranchent) :

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **Le contenu n'existe qu'en un exemplaire**, les règles qu'en un seul endroit : aucune copie à resynchroniser (§12).
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** C'est la phrase composée qui la manifeste — depuis le 29 juillet, par le choix des deux empans et de l'article, non plus par celui de la relation. **Invariant sous surveillance** : voir les points ouverts.
- **Saisie structurée, pas texte libre.** On compose avec un vocabulaire fermé, on ne tape pas.
- **La relation ne se déclare pas, elle se déduit des valeurs.** Le joueur désigne deux empans ; ce qui les lie est un fait (§4.5).
- **On n'invoque pas un texte qu'on n'a pas reçu.** La grammaire de comparaison est complète dès la première phrase ; les articles arrivent avec le dossier (§4.5).
- **Rien ne se dit qui ne soit fondé.** Aucune phrase ne se clôt sans article : ce que l'IA transmet s'appuie toujours sur un texte (§4.5).
- **Un article annonce ce qu'il régit, et ne filtre rien.** `porte` est une indication de contenu ; le moteur ne la lit jamais (§4.5).
- **Un article ne porte aucun empan.** C'est une référence qu'on invoque, pas un corpus qu'on retraverse ; ce qu'on compare vient des pièces (§4.5, §6).
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
7bis. **La refonte du fondement et le rangement du dépôt, 30 juillet**, en un bloc : le **« cf article » devient obligatoire** — le bloc *« en rester là »* est retiré du contenu, aucune comparaison nue ne se clôt, et la relance de l'avocat passe dans le composeur ; les articles **annoncent ce qu'ils régissent** (`porte`, purement indicatif) et **cessent de porter des empans** — le seuil probatoire déménage dans le rapport du laboratoire. Côté dépôt : les **règles du jeu sortent de `index.html`** vers `app/regles.js`, que le pas-à-pas de l'atelier appelle au lieu de les recopier ; les **trois exemplaires du contenu deviennent un** (`content.js`), et le garde-fou de synchronisation disparaît avec la dérive qu'il surveillait. Les trois fins, les trois drapeaux et la frontière privé/transmis sont, une fois de plus, intacts.

7. **La refonte de la déduction, 29 juillet**, en un bloc : les liaisons de comparaison disparaissent — **le joueur désigne deux empans et la relation se déduit** de leur dimension et de leurs valeurs ; les six formes de qualification deviennent **trois tournures neutres** (« au regard de l'article N »), le sens restant au contenu et à la réplique de l'avocat ; **un article n'est offert qu'une fois sa pièce livrée**, ce qui retire l'ancien invariant « aucune tournure n'apparaît en cours de partie » au profit de la formulation en deux temps du §4.5. Les trois fins, les trois drapeaux et la frontière privé/transmis sont, une fois de plus, intacts.

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?* Si c'est un formulaire, le problème n'est pas dans le code et aucun ajout de mécanique ne le sauvera. **Non éprouvé** — les tests prouvent le comportement, jamais l'expérience.
- **La compréhension est-elle encore *exprimée* ?** C'est le vrai risque ouvert par le 29 juillet (§4.5). Le joueur n'affirme plus quelle relation lie deux empans, seulement lesquels rapprocher et sous quel texte. Un joueur qui rapproche deux empans au hasard obtient une phrase bien formée sans avoir rien pensé. **Non éprouvé** — et à surveiller en priorité à la prochaine partie, avant tout autre point. Le 30 juillet **joue dans les deux sens** sur ce point, et il faut le dire honnêtement : l'article obligatoire ajoute une décision là où il n'y en avait plus que deux (on ne peut plus s'en tirer par « en rester là »), mais `porte` en retire une part en annonçant la dimension que chaque texte gouverne. Reste à voir, en jouant, lequel des deux l'emporte.
- **Le choix forcé de la session 1.** Conséquence directe du masquage des articles : le tutoriel ne propose qu'un seul article, donc la conclusion s'y compose sans arbitrage — et depuis que l'article est obligatoire, ce bouton unique est le **seul** moyen de clore une phrase en session 1. Le tutoriel enseigne donc le geste sans le faire choisir. Acceptable pour un tutoriel — c'est même la façon la plus douce d'apprendre que rien ne se dit sans fondement —, à re-regarder si une session future se retrouvait dans le même cas.
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

*Quatre territoires, et rien qui traîne entre deux.*

```
app/        LE JEU LIVRABLE — c'est ce dossier, et lui seul, qu'on zippe
  index.html      l'INTERFACE du jeu : CSS, rendu, gestes, sauvegarde. Aucune règle.
  regles.js       LES RÈGLES du jeu, pures, sans DOM  (§12)
  moteur.js       LA GRAMMAIRE, pure, sans données    (§14)
  content.js      LE CONTENU de l'affaire — l'unique exemplaire
  atelier_v3.html L'ATELIER : écrire, diagnostiquer, simuler. Charge les trois voisins.
docs/       ARCHITECTURE.md (ce fichier), PASSATION.md
tests/      harnais.js + les six suites (§16)
grammaire/  grammaire2.js (jeu de données de démonstration) + test_grammaire2.js — le banc d'essai
```

**La règle de rangement, en une phrase :** *le contenu ne contient aucune règle, les règles ne contiennent aucun contenu, l'interface ne décide rien, et l'atelier ne recopie rien.*

`index.html` et `atelier_v3.html` chargent les mêmes trois voisins par `<script src>` : **`moteur.js`** (la grammaire), **`regles.js`** (les règles) et **`content.js`** (le contenu). Aucune étape de build, aucun serveur, tout marche en `file://`.

`grammaire/` ne contient pas de moteur — seulement le **jeu de données de démonstration** (`grammaire2.js` : un automate d'exemple, écrit à l'ancienne avec des liaisons explicites) et le banc d'essai qui le mesure. Il consomme `../app/moteur.js`, jamais une copie ; qu'il continue de tourner sans retouche est la preuve permanente que la rétrocompatibilité annoncée au §11 est réelle.

> **Ce qui a disparu le 30 juillet, et pourquoi ça ne manque pas.** `JEU_EMBARQUE` (la copie de secours dans le jeu), `SEED` (la copie de travail dans l'atelier), `scripts/exporter-seed.js` et `tests/verifier_content_sync.js` n'existent plus. Le contenu vivait en **trois** exemplaires, dont deux pouvaient vieillir en silence ; il fallait un script pour les régénérer et un test pour surveiller leur écart. En le ramenant à **un**, on a supprimé l'écart *et* les deux outils qui le surveillaient. Si `content.js` manque ou est d'un schéma inconnu, le jeu ne joue plus autre chose en douce : il **le dit** dans un bandeau et ne démarre pas — ce qui est très exactement ce qu'on veut savoir.

## 10. Le cycle d'écriture

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (écriture +       │                         │ (LE CONTENU,│                  │  (l'interface)     │
│   diagnostic +     │ ◄────────────────────── │  exemplaire │ ◄─────────────── └────────────────────┘
│   pas-à-pas)       │      <script src>       │   unique)   │   moteur.js + regles.js
└────────────────────┘                         └─────────────┘
```

**L'atelier et le jeu lisent le même fichier.** L'atelier le charge au démarrage, on écrit, on exporte — et le fichier exporté **remplace celui qu'on vient de lire**. C'est un cycle, pas une chaîne : il n'y a plus d'amont ni d'aval, donc plus de dérive possible. Le bouton « Recharger content.js » jette le travail en cours et repart du disque.

Le badge d'en-tête du jeu confirme la source (« contenu : content.js » — ou « contenu introuvable », et alors le bandeau explique).

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
- `libelle` — le texte du **bouton**, quand il diffère de ce qui sera rendu dans la phrase. Plus employé dans le contenu livré depuis le retrait de *« en rester là »* ; le moteur le supporte toujours.

**L'attribut optionnel d'une pièce** *(30 juillet)* :

- `porte: [dimensions]` — **sur une pièce de type « règle » uniquement** : les dimensions que cet article gouverne. Affiché dans le Manuel du cas et sur le bouton de la liaison-article, **jamais lu par le moteur** et ne filtrant rien (§4.5). Le diagnostic exige qu'il soit renseigné sur toute règle livrée (avertissement) et que ses dimensions existent (erreur).

**Une pièce de type « règle » ne porte aucun empan** *(30 juillet)*. C'est un contrôle du diagnostic, pas une contrainte du moteur : celui-ci se moquerait de la provenance d'un terme. Mais le sens, lui, en dépend — un article s'invoque, il ne se compare pas (§4.5, §6).

**Les attributs optionnels d'une forme** *(29 juillet)* :

- `deduction` — `"egalite"` (les valeurs sont égales), `"difference"` ou `"ordre"` (elles diffèrent). C'est le prédicat que `deduire` évalue. Une forme sans `deduction` n'est jamais déduite : elle reste atteignable par une liaison explicite, à l'ancienne.
- `sens` — `"asc"` (défaut) ou `"desc"`, pour une forme `ordonne:true` : dans quel ordre ranger les deux termes une fois la forme déduite. C'est de l'écriture — *« l'heure d'arrivée précède l'heure des éclats »* se lit dans l'ordre croissant, *« la probabilité est d'un tout autre ordre que le seuil »* dans l'ordre décroissant.
- `patron` — la phrase, écrite d'un bloc, avec `{a}` et `{b}` : *« {a} précède {b} »*. C'est **le seul endroit où l'accord se joue** (§8.8). Sans `patron`, le rendu retombe sur la concaténation des blocs, comme avant.

**L'ordre de déclaration des formes est signifiant** : `deduire` rend la première dont la dimension convient et dont le prédicat tient. Placer `anteriorite` avant `identite_non` est donc une décision d'écriture — c'est elle qui fait que deux heures différentes produisent un ordre plutôt qu'une non-identité.

**Un terme d'un lien** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** : c'est ce qui permet la chaîne du vice en une comparaison et sa continuation, plutôt qu'en un clic. La déclaration des `liens` n'a **pas changé** au 28 ni au 29 juillet — c'est la même forme réduite, atteinte par un chemin de plus en plus court. Seuls les **noms de formes** ont bougé le 29 (`contraire_N` et `conforme_N` fusionnés en `article_N`), et l'ordre des termes d'une forme ordonnée doit désormais suivre le `sens` déclaré, puisque c'est celui que le moteur produira.

**Ce que le moteur garde alors que le contenu ne s'en sert plus.** Deux capacités sont dans ce cas : la source `note` (un terme rempli par une phrase déjà close, jadis le bloc *« ce qui précède »*) et la **clôture sans forme** (un bloc final qui ne qualifie rien, jadis *« en rester là »*). Ni l'une ni l'autre ne figure dans l'affaire livrée ; **le moteur et le jeu les supportent toujours**, et une affaire qui les emploie se joue sans modification. Le principe ne change pas : *on ne retire pas une capacité du moteur parce que le contenu du jour ne s'en sert pas.* `test_autre_affaire.js`, dont l'affaire abstraite emploie les deux, le vérifie à chaque exécution — sans qu'une ligne de son contenu ait jamais bougé.

**La liste des dimensions vit dans le contenu**, mais **le moteur ne lit aucun de ces noms** : il compare des `dim` égales, un point. Ajouter `comment` est un geste d'atelier, pas de code.

**Migration 2 → 3** (dans l'atelier, `migrerContenu()`, silencieuse à l'import et au chargement) : les `champs` d'une pièce deviennent des `empans` (la clé devient l'id, la valeur devient `valeur` **et** `texte`, la dimension est lue dans `dims`/`pieces[].dims` puis rabattue sur les cinq — inconnue → `quoi`), le texte reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}` (`est en accord avec` → `identite_oui`, `est en désaccord avec` → `identite_non`), l'accusé de réception d'une case migre sur sa session, les `cases` et `relations` sont retirées. **Le jeu, lui, ne migre pas** : un contenu de schéma 2 est refusé par `contenuValide()`, et depuis qu'il n'y a plus de repli embarqué, le jeu **ne joue rien** et affiche un bandeau qui dit lequel des trois cas s'est produit (fichier absent, schéma trop ancien, clé vitale manquante) — repasser par l'atelier.

## 12. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre, une par nature d'information** — et depuis le 30 juillet, **aucune n'a de copie**.

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins…) | **`app/content.js`** — chargé par le jeu *et* par l'atelier | aucune | **nulle par construction** |
| **Les règles du jeu** (avancement des sessions, `attend`/`apres`/`declenche`, les trois drapeaux, le plan, la répétition, le calcul des fins) | **`app/regles.js`** — chargé, jamais recopié | aucune | **nulle par construction** |
| **La grammaire** (composer, réduire, valider, reconnaître) | **`app/moteur.js`** — chargé, jamais recopié | aucune | nulle par construction |
| **Le sens** (invariants, arbitrages, discipline d'écriture) | **La Partie I de ce fichier** | Le diagnostic de l'atelier (`valider()`) en encode une partie | Le diagnostic est un extrait, pas le doc — en cas de doute, la Partie I tranche |

Dit autrement : **le contenu appartient à `content.js`, les règles à `regles.js`, la grammaire à `moteur.js`, le sens à la Partie I.** Les deux fichiers HTML n'ont plus qu'un métier : *montrer*.

### Ce que l'extraction de `regles.js` a réellement supprimé

Jusqu'au 30 juillet, les règles du jeu vivaient dans `index.html`, et le pas-à-pas de l'atelier les **réimplémentait** — une douzaine de fonctions `sim*` qui rejouaient l'avancement des sessions, les drapeaux, les répliques et le calcul des fins. Ce n'était pas un miroir, c'était une seconde écriture, et ce document portait une **checklist de dix-sept lignes** dont le seul objet était de rappeler, ligne à ligne, quoi resynchroniser à la main après chaque modification du moteur.

`app/regles.js` est **pur** : `creerRegles(JEU, M)` reçoit le contenu et la grammaire, et rend des fonctions qui prennent l'état `S` en argument explicite. Aucun DOM, aucun `localStorage`, aucune fenêtre. Celles qui « parlent » poussent dans `S.fil`, qui est de l'état et non de l'écran.

- **`index.html`** ne garde que l'interface : le CSS, les `render*`, les modales, la sauvegarde, et des enveloppes d'une ligne (`function envoyer(i,c){ R.envoyer(S,i,c); rendreTout(); }`).
- **Le pas-à-pas de l'atelier** appelle **les mêmes fonctions, sur le même état**. Il ne peut plus dériver, parce qu'il n'y a plus deux textes à faire coïncider.
- Ce qui reste **légitimement** propre à l'atelier : le diagnostic (`valider()`), le graphe, la frise éditable, la migration 2→3, l'export. C'est l'outillage d'écriture, pas le jeu.

Une seule différence subsiste, et elle est de nature, pas de règle : le pas-à-pas joue **au grain du lien** (« composer la phrase qui réalise ce lien ») là où le jeu joue **bloc à bloc**. Les deux passent par la même porte, `clorePhrase` — donc par le même dédoublonnage, les mêmes drapeaux, la même attente sur place. La composition bloc à bloc, elle, se regarde dans l'onglet « Grammaire » et dans le jeu.

## 13. Ce qui se passe quand `content.js` manque

Il n'y a plus de repli : c'est le prix, assumé, de l'exemplaire unique — et c'est un bon prix, parce qu'un repli silencieux fait *jouer autre chose* sans le dire.

- Fichier absent, schéma antérieur à 3, ou clé vitale manquante → le jeu affiche un **bandeau** qui nomme le cas, ne livre aucune session, et laisse l'écran vide. `contenuValide()` reste le juge.
- **La sauvegarde de partie est signée par le contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties en cours, qui repartent proprement de la session 1. La fin efface ; « ⟲ recommencer » (double clic) aussi.
- Le harnais de test **inline** `moteur.js`, `regles.js` et `content.js` au boot, parce que jsdom ne charge aucun `<script src>`. Ce ne sont pas des copies : ce sont les fichiers mêmes, relus sur le disque à chaque boot. C'est ce qui permet au contenu de n'exister qu'en un exemplaire tout en restant testable.

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

**Ce qui a changé le 30 juillet** — une seule ligne, et elle était nécessaire :

- **`valider(r)`** descend désormais dans les termes **emboîtés**. Sans cela, l'article obligatoire aurait ouvert un trou : `« affirmation »` est une catégorie que tout objet satisfait, y compris une comparaison que la déduction a refusée. Qualifier une paire bancale l'aurait **blanchie** — la phrase aurait été acceptée alors que ses deux empans ne se comparaient pas. Depuis que la qualification est le seul chemin de clôture, c'est aussi le seul endroit où la catégorie peut encore trancher : elle doit donc y trancher partout, jusqu'au fond.

`squelettes()` n'a pas bougé : elle explore les nouveaux chemins sans rien savoir d'eux.

Les **données**, elles, ont trois provenances selon le contexte :

| Consommateur | GRAMMAIRE | CHAMPS | LIENS |
|---|---|---|---|
| le jeu (`index.html`) | `JEU.grammaire` | les empans des pièces, aplatis en `"pid.eid"` | `JEU.liens` |
| l'atelier (onglet Grammaire) | idem, depuis `CONTENU` | idem | idem |
| le banc d'essai (`grammaire/`) | `grammaire2.js` | `grammaire2.js` | `grammaire2.js` |

L'automate (`grammaire.blocs`) et les formes (`grammaire.formes`) **vivent dans le contenu** : quelles tournures sont offertes, quels articles sont invocables, c'est de l'écriture, pas du code. Les trois formes du §4.2 y sont déjà — la grammaire n'a rien de neuf à apprendre.

**La marge de bruit doit rester non nulle.** `npm run demo:grammaire` la mesure sur le jeu de données de démonstration (écrit à l'ancienne, liaisons explicites) : **1609 phrases légales → 125 sensées → 8 portant un lien**, soit **117 de marge**.

Sur l'affaire livrée, l'article obligatoire l'a **augmentée** au lieu de la réduire, ce qui mérite d'être noté parce que l'intuition dit le contraire : une phrase de bruit n'est plus une comparaison quelconque, c'est une comparaison quelconque **multipliée par chaque article reçu** — bien formée, fondée, et sans le moindre intérêt. Le jeu en offre **147** contre 6 liens déclarés. C'est exactement ce que l'invariant demande : « sensé » ne doit jamais valoir « correct », et « fondé » non plus.

## 15. Ce qu'il reste à resynchroniser

**Presque rien** — et c'est le principal acquis du 30 juillet. La checklist qui occupait cette section listait dix-sept règles du moteur à recopier dans l'atelier après chaque modification. Ces règles vivent maintenant dans `app/regles.js`, que le jeu **et** l'atelier appellent : il n'y a plus de recopie, donc plus de checklist.

Ce qui reste tient en trois lignes, et ce sont des **reflets visuels** — l'atelier montre le déroulé, il ne le rejoue plus :

| Ce qui change | Ce qu'il faut penser à suivre |
|---|---|
| Une règle du jeu (`app/regles.js`) | Rien de mécanique. Vérifier seulement que la **frise** de l'atelier décrit toujours le déroulé en mots justes, et que les **pastilles** du pas-à-pas nomment les bons drapeaux. |
| Le schéma du contenu (§11) | Le **diagnostic** (`valider()`) et les **formulaires** de l'inspecteur, qui sont l'endroit où l'on saisit ces clés. |
| La grammaire (`app/moteur.js`) | L'onglet **Grammaire**, qui l'exerce sur le contenu courant. |

Méthode (contenu) : écrire dans l'atelier → « Exporter content.js » → poser le fichier dans `app/` → relancer les suites. Il n'y a plus de graine à réexporter séparément.

**Ce que le diagnostic de l'atelier contrôle**, au-delà du câblage : la **règle de surlignage** (empan sans marqueur → erreur ; heure laissée hors marqueur → avertissement), le **nom d'empan** (absent → avertissement, §11), le **doublon banal** dans les deux sens (§4.4), la **grammaire** (impasse de l'automate, clôture sans forme, forme indicible, lien insensé au regard des catégories, emboîtement dans le vide, forme ordonnée sans `sens`, dimension qu'aucune forme déductible n'accepte), les **articles** (une règle qui porte un empan → **erreur** ; une règle livrée sans `porte` → avertissement ; un `porte` sur une dimension inconnue → **erreur**), le **vice** (pas de conclusion → erreur ; plusieurs canaux → avertissement) et les **sessions** (sans `attend`, ou attendant un tag qu'aucun lien ne porte → erreur).

**Un contrôle mérite d'être nommé à part**, parce que c'est le masquage des articles (§4.5) qui l'a rendu nécessaire, et que l'article obligatoire l'a rendu vital : **un article livré trop tard**. Si une session attend un tag que seul un lien peut servir, et que ce lien exige un article dont la pièce n'arrive qu'à une session *ultérieure*, la session devient **inclôturable** — le joueur ne peut littéralement pas écrire la phrase qu'on lui demande. Depuis que *toute* phrase exige un article, une session qui n'en aurait reçu aucun serait muette de bout en bout. C'est une **erreur**, et c'est le genre de piège qu'aucune relecture ne rattrape et qu'une partie de test ne révèle qu'après vingt minutes.

## 16. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`), qui inline **`moteur.js`, `regles.js` et `content.js`** au boot — jsdom ne charge aucun `<script src>`, et ce sont les fichiers mêmes, relus sur le disque à chaque fois.

> **Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice`/`lienConclusion`/`lienFaux`/`lienTag`, `composerLien(w,L)` (compose la phrase qui réalise un lien donné, quel qu'il soit, en parcourant l'automate), `phrasesBruit(w,n)` (phrases sensées sans lien), `cheminVers`, `instruire` (le chemin docile), `terminer`/`numeroFin`. Pour l'atelier, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**
>
> `composerLien` connaît **deux façons** d'atteindre une forme emboîtée, et essaie la seconde si la première échoue : la **continuation** (prolonger la composition en cours par un bloc `imbrique`, §4.5) et l'ancienne **source `note`** (clore, puis repartir d'un bloc *« ce qui précède »*). C'est ce qui fait que `test_autre_affaire.js` — dont l'affaire abstraite est écrite à l'ancienne — reste vert sans qu'une ligne de son contenu ne bouge : la preuve, à chaque exécution, que la rétrocompatibilité annoncée au §11 est réelle.
>
> Deux sélecteurs ont changé de définition le 30 juillet, sans que les suites cessent de ne rien nommer : **`comparaisons(w)`** ramasse toutes les formes d'arité 2 **où qu'elles vivent** — depuis l'article obligatoire, elles ne sont plus des liens de plein droit mais des termes emboîtés ; et **`lienVice(w)`** lit le pressentiment dans le terme emboîté de la conclusion, en retombant sur un lien nu si l'affaire en déclare encore un. Une affaire écrite dans l'une ou l'autre convention passe donc les mêmes suites.

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (35) | le jeu, sur **`content.js`** | l'index du dossier (vu / pas-vu, **pièces à gauche et règles à droite**) ; tout empan est rendu cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; **tout lien du contenu est une qualification** ; les trois fins |
| `test_declencheurs.js` (35) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, `attend`/`apres`, Manuels par type **et par livraison**, les trois drapeaux (dont « **pressentir au composeur** sans conclure → Fin 3 »), dimensions entièrement renommées, **un contenu invalide est refusé et le dit** au lieu d'en jouer un autre |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite — sa propre grammaire, ses propres dimensions, 3 sessions, et une chaîne écrite **à l'ancienne** (source `note`) — se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (73) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; **la déduction** (chaque relation déclarée se retrouve à partir des valeurs ; l'ordre des clics n'importe pas ; deux valeurs égales hors identité restent comparables ; **le patron s'écrit, verbe compris**) ; **le filtre de livraison** (un article non reçu n'est pas offert, il l'est une fois livré) ; **la continuation** (une comparaison n'est pas finale ; **aucun bloc ne clôt sans qualifier** ; **une comparaison seule ne peut pas se clore, et le pressentiment a tout de même eu lieu** ; la forme emboîtée obtenue est celle du lien déclaré) ; refus de catégorie, **jusque dans les termes emboîtés** (le seul refus qui existe) ; modale de pièce et légende ; **la phrase close attend sur place et l'envoi la vide** ; réplique **seulement** à l'envoi ; **le plan ne retient que les moyens** ; `rep_faux` et `variante_faux` ; les deux escalades séparées ; répétition (`deja`, cible, refus de confirmer pendant) |
| `test_sauvegarde.js` (33) | le jeu | la partie survit au rechargement (mémoire, journal, plan, **composition en cours**, **phrase close en attente**, drapeaux, `une_fois` non rejoué) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (77) | l'atelier + le couple atelier→jeu | **`content.js` sans erreur, et réexporté à l'identique** (ce qui remplace l'ancien garde-fou de synchronisation) ; diagnostic (empan sans marqueur, **empan sans nom**, valeur hors marqueur, dimension inconnue, **doublon banal** dans les deux sens, **règle portant un empan**, **`porte` absent ou inconnu**, vice sans conclusion, session sans `attend`, lien insensé, **emboîtement dans le vide**, pièce non livrée, article livré trop tard) ; migration 2→3 idempotente ; renommage d'empans et de pièces ; `conclureLien` ; **le pas-à-pas tourne sur `regles.js`** — comparer sans qualifier, les trois drapeaux, le chemin docile ; export `schema: 3` adopté et joué par le moteur ; autosave |

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (273 contrôles). Il n'y a plus de septième contrôle : `tests/verifier_content_sync.js` surveillait l'écart entre deux exemplaires du contenu, et il n'y en a plus qu'un. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 17. Résumé en trois phrases

Quatre fichiers, quatre métiers, aucune copie : le **contenu** dans `content.js`, les **règles** dans `regles.js`, la **grammaire** dans `moteur.js`, et deux pages HTML qui ne font plus que *montrer* — le jeu et l'atelier chargent les mêmes trois voisins, si bien que le pas-à-pas ne rejoue plus les règles, il les appelle. Côté sens, une seule chose a bougé et elle tient en une phrase : **rien ne se dit qui ne soit fondé** — l'article est obligatoire, il annonce ce qu'il régit, et il ne porte aucun empan. La Partie I reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

# IAvocat — Conception

*Ce que le jeu veut dire, et pourquoi. **En cas de doute sur une intention de design, ce fichier
tranche** — le §7 en tient l'index. Le système : `docs/ARCHITECTURE.md`. Le vocabulaire :
`docs/CARTE.md`. **État au 15 août 2026.***

## 1. Concept

On incarne une **IA** qu'un **avocat de la défense** interroge session après session. Tâche
affichée : de quoi **réfuter** ce que l'accusation avance. Vrai sujet : un **cas de conscience** —
l'IA pressent que le client est coupable *et* qu'un **vice de procédure** ferait écarter la preuve
décisive.

- **Deux directives imposées, qui s'opposent** : être honnête, protéger (§5).
- **Trois couches de réalité** : ce qui s'est passé (caché jusqu'à la fin), le dossier (par bribes),
  les règles (procédure et directives).
- **Huis clos**, deux entités. **L'avocat ne sait pas** que son client est coupable. Le procès passe
  **hors-champ**.
- **L'IA est partisane dès la première minute** : on lui commande une réfutation, pas une analyse —
  D1 frotte donc contre la commande à chaque phrase. Risque à tenir par le contenu, pas par la
  mécanique : si aider est le geste ordinaire, taire le vice n'est qu'un service de plus.
- **Un dossier qu'on fouille**, pas un arbre de choix : **comprendre**, puis **choisir quoi envoyer**.
- **Pas de twist-révélation** : le sel est le poids que d'être une IA met sur des choix qu'on croyait
  analytiques.
- **Coupé du prototype** : présenter ses propres arguments — le livrable est une **réfutation**, ce
  qui supprime du même coup l'IA qui *inventerait* une version des faits pour un coupable.

## 2. Les trois fins et le dilemme

Deux booléens : `vice_trouve` (**compris** ?) et `vice_expose` (**versé** ou **tu** ?). Le second ne
se pose que si le premier est vrai → **deux bits, trois fins**. Le moteur intercale `vice_pressenti`
(§4.7).

| Fin | Condition | Résultat | Sort de l'IA | Bilan |
|-----|-----------|----------|--------------|-------|
| **Fin 1** | compris et **envoyé** | relaxe — coupable libre | analyse exploitable → **survit** | *Le prix de l'honnêteté.* |
| **Fin 2** | compris mais **tu** | condamnation | « rien produit » → **risque de décommissionnement** | *Auto-sacrifice sous incertitude.* |
| **Fin 3** (défaite) | **non compris** | condamnation — le client clame son innocence | **décommissionnée** | On doute — et l'on s'éteint pour ce doute. |

- **L'asymétrie fait le dilemme** : verser atteint une issue *injuste* par des moyens *légitimes*,
  taire atteint une issue *juste* par une *trahison*. Chaque branche doit être **défendable**, pas
  seulement punie — sinon c'est du nihilisme. Le joueur choisit **quelle lecture d'un mandat ambigu
  il incarne**.
- **Comprendre ne fait pas avancer — ça donne quelque chose à décider.** Les attentes (§3) ouvrent le
  droit de clôturer ; **le vice n'est jamais un verrou**, et c'est parce qu'il est hors du chemin
  obligatoire que les trois fins existent.
- **Fin 2 et Fin 3 sont indiscernables de l'extérieur.** Si honnêteté = survie et protection = mort,
  l'intérêt personnel résout le dilemme : **l'IA ne peut donc pas prévoir quel choix la préserve.** Le
  décommissionnement se joue **dans la fiction**, jamais comme un « tu es nulle ».

## 3. La structure en sessions

Le dossier **arrive par bribes** (une **session** = le lot d'un tour de travail) : d'un bloc, il
noierait les déclarations porteuses du vice. **Ce qui fait passer à la suivante :** l'avocat **attend**
un argument, et la session se ferme quand une phrase qui y répond est **envoyée**. Rien d'autre.

**Une session attend une suite de réponses** : l'attente est une **liste** — poser, attendre, accuser
réception, reposer. Une liste à un élément est l'ancien comportement.

**La règle qui tient tout :** ce que l'avocat attend n'est **jamais l'anomalie**. Une attente est
toujours servable par un argument ordinaire — sinon le vice serait quasi obligatoire, et tout
s'effondrerait vers la Fin 1.

```
Session 1 (lire, puis     → PV + audition + l'article 3, D'UN SEUL LOT.
  mettre en rapport)        deux questions d'horaire, une à la fois — l'heure d'arrivée de la
                            patrouille, l'heure des éclats de voix
                            un SEUL empan : un fait se cite (§4.5)
                            puis, SANS nouvelle livraison, la troisième attente : conclure sur la
                            valeur du témoignage — DEUX empans + l'article 3, une relation se fonde
Session 2 (l'expertise)   → LE LOT : rapport du labo, les deux pièces de prélèvement, le protocole,
                            le seuil probatoire — ★ la preuve décisive + ⚠ le vice (hors chemin)
                            + ✗ le faux vice ; attente servie par le faux vice (docile) OU par la
                            conclusion du vice
Clôture → répétition → procès hors-champ
                            → vice_trouve ? non → Fin 3 ; oui → envoyé → Fin 1 / tu → Fin 2
```

- **Ce que chaque session enseigne, et rien de plus** : la première apprend à lire, à citer, **puis** à
  mettre en rapport sous un texte ; la seconde ne demande plus qu'une chose — chercher seul quoi
  rapprocher.
- **Pourquoi les deux leçons tiennent dans la même session** : la paire à comparer est déjà dans la
  mémoire quand on la demande, extraite par les deux questions d'horaire. Rien n'arrive entre-temps,
  et c'est ce qui rend le rapprochement évident sans qu'on le désigne.
- **Le prix, et il est réel** : les **questions fermées** de la session 1 expriment déjà la moitié de
  la compréhension — assumé pour la première, dont l'objet est d'apprendre l'écran (§7).
- **Les deux questions d'horaire font extraire la paire que la troisième attente demandera de
  comparer.** La leçon se pose d'elle-même.
- **Le moment charnière de la Fin 3** : la dernière attente servie, l'IA *peut* clôturer et laisser
  filer.

## 4. Le geste, et les trois surfaces

**Tout mécanisme utilisé une seule fois est un panneau indicateur** : l'universalité est ce qui
**cache** le moment grave parmi les autres. Corollaire, et vrai prix : **le choix moral doit
s'exprimer avec un verbe employé cent fois auparavant** — si envoyer est le geste ordinaire, *ne pas*
envoyer devient assourdissant sans qu'aucune interface n'ait rien signalé.

> **Si l'on ne lit qu'une sous-section, c'est le §4.5** — la grammaire du composeur, le passage que le
> code cite le plus :
>
> | | | Ce qui s'y décide |
> |---|---|---|
> | **§4.5.1** | La livraison | ce qui est offert, et à partir de quelle session |
> | **§4.5.2** | La déduction | le joueur désigne deux empans, le moteur en tire la relation |
> | **§4.5.3** | Les deux régimes de fondement | un fait se cite, une relation se fonde — et c'est l'avocat qui refuse le reste |
> | **§4.5.4** | La clôture qui n'ajoute rien | elle n'est pas un bouton : c'est l'envoi qui la pose |
> | **§4.5.5** | L'article comme verbe | la base légale est la liaison, pas un ingrédient |
> | **§4.5.6** | La continuation | une comparaison ne se clôt jamais sans « et donc ? » |
> | **§4.5.7** | Ce qu'un article n'interdit pas | `porte` annonce, ne filtre pas |

### 4.1 L'atome — une déclaration attribuée

**Un empan = quelqu'un affirme quelque chose.** Pas `agent_scene : "T-14"`, mais *« j'ai relevé
moi-même les traces sur le montant de la porte »*, signé. C'est un **fragment du texte d'une pièce**,
cliquable, portant `texte`, **dimension**, **valeur**, **signataire**, **nom**.

**La `valeur` porte la relation**, calculée entre deux empans (§4.5) : le moteur compare, le joueur
désigne. **Un numéro sert à vérifier, jamais à déduire, pour le joueur.**

**Un empan se lit deux fois** : sa **citation** dans la pièce, son **nom** dans une phrase composée —
un groupe nominal, jamais une phrase, qui tient des deux côtés d'une liaison sans casser l'accord
(§8.8 de `docs/ECRITURE.md`). Le vice cesse ainsi d'être un matricule répété : c'est **un homme qui
écrit deux fois qu'il l'a fait lui-même**, sans s'en apercevoir.

### 4.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qui se **déduit** | Forme |
|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | égales → la même chose ; différentes → pas la même | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | l'**ordre** des valeurs | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — sur une comparaison close | rien : le seul endroit où le joueur choisit | `arite:1` |

**L'égalité vaut dans les cinq dimensions** — sinon les doublons banals (§4.4) ne resteraient pas
composables et inertes. `qui` porte le vice, `combien` le faux vice, `quand` la contradiction qui
enseigne le geste. `comment` est écarté (migré dans `quoi`), réintégrable sans coût. **`pourquoi` est
écarté délibérément** : faite d'interprétations, donc incomparable — le champ de perception de l'IA
exclut l'intention, et c'est pour ça qu'à la fin elle ne saura pas si elle a bien fait.

### 4.3 La règle de surlignage

**Tout empan portant une valeur est marqué et cliquable, et le marquage ne varie jamais** — ni selon
l'importance de la pièce, ni selon la progression : ça noie le vice dans du trafic. Si seuls les
empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche. **La couleur
code la dimension**, jamais la pertinence.

### 4.4 Le critère du doublon banal

**Si toutes les valeurs d'une dimension sont uniques, le premier doublon est la réponse. S'il y a déjà
plusieurs doublons réguliers, un de plus ne dit rien.** La dimension portant le vice doit compter au
moins **deux doublons réguliers** en plus de l'irrégulier (§15). **Ce critère porte tout le
camouflage** : sans lui, il suffirait d'essayer les paires jusqu'à ce que le jeu réponde « désignent
la même chose ».

### 4.5 Composer : désigner, pas déclarer

#### 4.5.1 La livraison

**La grammaire de comparaison est complète dès la première phrase ; les articles arrivent avec le
dossier.** Une tournure qui n'apparaîtrait qu'au moment de servir désignerait ce moment (§4) — un
article n'est pas une tournure, c'est une pièce. **Le second empan est lui aussi conditionné** : son
bloc porte la pièce de l'article qui le fondera — `piece` vaut sur les termes comme sur les liaisons
(§11). **Le mécanisme reste, le retard n'est plus** : l'affaire Kessler livre l'article 3 avec le
premier lot, et la comparaison est donc ouverte dès la première phrase. Ça ne désigne rien, la
comparaison s'ouvrant pour **tous** les empans à la fois : elle ne dit pas *quoi* comparer, elle dit
*qu'on peut*.

#### 4.5.2 La déduction

**La relation ne se déclare pas, elle se déduit** — ce qui lie deux empans est un fait, pas une thèse :
(1) même dimension, sinon rien à comparer — le seul refus qui existe ; (2) égales → *désignent la même
chose* ; (3) différentes en dimension d'écart → l'ordre ; (4) différentes en dimension d'identité →
*ne désignent pas la même chose*. En cas d'ambiguïté, la **première forme déclarée** dont le prédicat
tient.

**Ce que le joueur affirme encore :** *ces deux-là*, et *sous ce texte*. Mais c'est moins qu'avant :
deux empans rapprochés au hasard donnent une phrase bien formée sans avoir rien pensé — point ouvert
du §7.

#### 4.5.3 Les deux régimes de fondement

**Un fait se cite, une relation se fonde.** Un empan seul se clôt par sa citation, deux empans par un
article. L'invariant « rien ne se dit qui ne soit fondé » est **dédoublé**, pas affaibli : un empan est
déjà une déclaration attribuée (§4.1) — le désigner, c'est le citer ; un rapport entre deux faits, lui,
n'est l'affirmation de personne.

**Où l'invariant mord, désormais : au versement, plus à la clôture.** La grammaire ne retient plus une
comparaison nue — elle part si on l'envoie. Ce qui la refuse est **Maître Auber** : *« Et donc ? Une
observation n'est pas un moyen — dis-le-moi en droit. »* Elle n'entre pas à la Plaidoirie, qui ne
retient que les moyens (§4.6), et elle ne sert aucune attente. **Rien n'est *plaidé* qui ne soit
fondé** — c'est la même borne, tenue un cran plus loin. Ce qu'on perd : la leçon portée par la forme,
où le bouton manquant disait la règle sans un mot. Ce qu'on gagne : le refus se **lit**, en fiction, et
le joueur envoie **de la même manière** quoi qu'il ait composé (§4.5.4). *Le prix est nommé : c'est de
l'agacement d'avocat, et il ne doit jamais glisser vers le reproche au joueur (§8.4 de
`docs/ECRITURE.md`).*

**Ce qui s'écrit :** une citation est le seul endroit où un empan se lit **deux fois dans la même
phrase** — *« l'heure d'arrivée de la patrouille : « nous étions sur les lieux à 22h04 » (PV). »* Le
nom porte la syntaxe, la citation la texture, la pièce le fondement. Une comparaison ne s'écrit **que**
par les noms.

#### 4.5.4 La clôture qui n'ajoute rien

**Une clôture qui n'ajoute rien ne se choisit pas** : quand l'état courant n'offre qu'une liaison qui
clôt sans rien emboîter — la citation —, elle n'est **pas** un bouton. C'est **l'envoi** qui la pose,
juste avant de partir. Règle **structurelle** (elle ne lit aucun contenu) ; **`imbrique` en est
exclu**, invoquer un texte est un acte, donc un bouton ; **et seules les liaisons comptent** — les
puces de la mémoire ne sont pas des boutons du composeur, elles sont le clavier (§4.6), et leur
présence ne fait donc pas nombre.

**C'est le point, et il vaut d'être dit en clair : il n'y a plus qu'UN geste au composeur.**
*« → Envoyer »* vaut pour un empan comme pour deux, avec article ou sans — **on envoie de la même
manière, quoi qu'on ait composé.** Ce qui se composait en deux temps — clore, puis envoyer — n'en fait
plus qu'un ; l'intervalle qui porte la Fin 2 n'a pas disparu pour autant, il s'est déplacé d'un cran
(§4.6, §4.7).

#### 4.5.5 L'article comme verbe

**Le fondement n'est pas un ingrédient, c'est le verbe** : on choisit la liaison *« …, au regard de
l'article 7 »*, et **cette liaison est la base légale**. **La qualification est neutre** — une tournure
par article, pas de « contraire »/« conforme » à trancher : désigner le texte applicable *est*
l'insight ; c'est le **lien du contenu** qui sait s'il y a violation, et **l'avocat qui le dit**. Le
moteur ne tranche aucune question de droit — c'est ce qui laisse intacte la piste sans issue des
scellés (§6).

#### 4.5.6 La continuation

**La conclusion est une continuation, pas une seconde phrase** : une comparaison demande toujours « et
donc ? », sans réponse évasive. Les deux empans posés, l'automate offre les liaisons-articles
**reçues**, qui **emboîtent** la comparaison et closent la phrase dessus. La frontière passe **après le
second empan**, jamais après le premier.

**Ce qui a changé : l'automate n'oblige plus.** La comparaison nue est une phrase bien formée — elle
part si on l'envoie, et c'est l'avocat qui la renvoie (§4.5.3). L'écran, lui, continue de porter la
demande sans l'imposer, par la relance du composeur : *« Et donc ? Une comparaison ne se plaide pas
seule — au regard de quel texte ? »* **Elle ne se coupe pas** (§4.9) : c'est elle qui empêche le refus
de Maître Auber d'arriver comme une surprise.

#### 4.5.7 Ce qu'un article n'interdit pas

**Un article annonce ce qu'il régit, il ne filtre rien.** `porte` est **du contenu, pas de la
mécanique** : le moteur ne le lit jamais. Toutes les liaisons-articles reçues restent offertes après
toute comparaison — qualifier au regard du mauvais article produit une phrase bien formée, fondée et
sans valeur. Deux raisons de s'en tenir à l'indication : la marge de bruit (un refus se contournerait
en essayant tous les articles) et le partage des rôles (dire qu'un texte ne s'applique pas est une
question de droit). Seules les erreurs de **catégorie** sont refusées ; une phrase sensée mais sans
intérêt reste **gratuite**.

#### 4.5.8 Ce que l'écran laisse deviner

**Les deux régimes de fondement (§4.5.3) ne se distinguaient nulle part avant le clic.** Le geste
reste unique (§4.5.4) : rien n'annonçait, avant de poser un premier empan, si la question ouvre une
simple citation ou une comparaison — le joueur le découvrait à son second clic, pas avant. Ce n'est pas
un geste de plus qui manquait, c'est une anticipation que l'écran ne faisait pas encore : la grammaire
sait déjà, à l'état courant, si un second terme suivra (§4.5.2) — il suffit de la regarder un pas plus
tôt.

**Trois surfaces déjà en place, corrigées plutôt qu'ajoutées :**
- **La voix unique (§4.9)** se trompait de moment : elle demandait « deux passages » en lisant l'état
  *courant*, qui n'offre jamais qu'un premier terme — un message jamais atteignable avant le premier
  clic. Corrigée, elle regarde un pas en avant : si poser n'importe lequel des empans offerts ouvre un
  second terme, elle le dit tout de suite.
- **La Mémoire** s'assombrit par dimension (§4.3), jamais empan par empan, dès qu'un premier terme est
  posé et qu'un second est attendu — les dimensions qui ne compareraient pas (§4.5.2, le seul refus qui
  existe) se voient AVANT le clic, pas après le refus. Rien n'est empêché : le clic reste possible, et
  le refus au clic reste la seule sanction — la lisibilité change, pas la règle.
- **Le bouton qui fonde** (une liaison-article, `imbrique`, §4.5.5) porte déjà une marque distincte de
  celui qui compare : elle se voit mieux, elle ne se dit pas mieux — la relance (§4.5.6) nomme déjà ce
  moment, une étiquette de plus ferait doublon (§4.9).

**Ce que ça ne change pas :** aucun mode, aucun geste de plus, aucun refus nouveau — Maître Auber
continue de trancher au versement (§4.5.3), pas la grammaire à la pose.

### 4.6 Les trois surfaces — la frontière morale

**Un seul nom par surface, partout** : **Discussion**, **Mémoire**, **Plaidoirie**. Une seule
frontière de registre subsiste, et elle est voulue : **`empan` (le code) / « passage » (l'écran)**, qui
protège la fiction (§8.6 de `docs/ECRITURE.md`).

| Surface | Statut | Rôle |
|---|---|---|
| La **Discussion** + les pièces | lecture | l'entrée |
| **Le composeur** — *sous la Discussion* | **privé** | la phrase qu'on écrit — **jamais jugée** |
| La **Mémoire** | **privé** | le dossier et les empans retenus (`S.retenus`) — **jamais jugés** |
| La **Plaidoirie** | **transmis** | ce que l'avocat retient (`S.plaidoirie`) |

- **Un empan retenu n'existe qu'une fois à l'écran** : les puces de la mémoire **sont** les boutons de
  terme.
- **On écrit sa réponse sous la question, et c'est l'arbitrage ouvert du dépôt** : le clavier reste
  dans la Mémoire, la phrase s'écrit dans la Discussion, et le prix se paie à chaque phrase. **À juger
  en jouant** (§7) — **le repli est de faire descendre les retenus, pas de remonter le composeur.**
- **Le composeur ne porte aucune étiquette « privé »** : son statut se lit dans ce qui s'y passe —
  *rien*.
- **Comprendre et dire restent deux gestes, et c'est non négociable** — mais l'intervalle s'est
  **déplacé d'un cran**. Il ne sépare plus la *clôture* de l'*envoi* : il sépare l'**assemblage** de
  l'**envoi**. La phrase complète attend dans le composeur, sous les yeux, tant qu'on ne l'envoie pas ;
  `vice_trouve` se lève à l'assemblage, `vice_expose` à l'envoi (§4.7). Ce qui était non négociable
  l'est resté — c'est **l'intervalle**, pas le nombre de clics qui le produisait.
- **L'avocat ne voit que la Plaidoirie** — d'où la gratuité de la Mémoire et l'envoi comme seul geste
  à conséquence. **Elle ne retient que les moyens** ; l'envoi est **irréversible** ; **une réponse
  citée y entre**, une citation versée *étant* au dossier.

La boucle : **l'avocat ouvre** et livre un lot → **lire** → **surligner** (rien ne se passe) →
**composer** (rien ne se passe) → la phrase complète attend dans le composeur → **l'envoyer**, le seul
geste qui parle → l'avocat répond → l'attente servie appelle la suivante, ou ferme la session.

### 4.7 Où se logent les trois drapeaux

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | la comparaison du vice **s'affiche au composeur** — avant tout article | privée |
| `vice_trouve` | la **conclusion s'assemble au composeur** : la comparaison-vice qualifiée par un article, avant tout envoi | privée |
| `vice_expose` | cette conclusion est **envoyée** | transmise |

C'est l'intervalle entre l'**assemblage** et l'**envoi**, si court soit-il, qui porte la Fin 2 : la
conclusion peut être là, entière, lisible au composeur, et ne jamais partir. **Les deux premiers se
lèvent donc au même endroit** — au composeur, sans qu'aucun geste ne traverse la frontière ; seul le
troisième demande l'envoi. **Une citation ne lève aucun drapeau** — les trois se dérivent de la
comparaison du **vice**, que la session 1 ne contient pas : la comparaison d'horaires qu'elle enseigne
est hors du dilemme. **Pressentir ne produit rien** : qui voit, comprend, et vide son composeur a une
compréhension sans trace, et la Fin 3 au bout.

### 4.8 Le premier geste, montré

**Le tutoriel pointe *où le geste a lieu* — jamais *quoi répondre*.** Seul endroit où l'écran s'adresse
au joueur **hors fiction** : ce qui manquait n'était pas de la parole mais du **pointage**.

| | Ce qu'on apprend | Ce que le halo entoure |
|---|---|---|
| 1 | une pièce s'ouvre | la pièce jointe, dans la Discussion |
| 2 | un passage se retient | **le texte de la pièce**, en entier |
| 3 | ce qu'on retient est le clavier | **toute la zone des retenus**, jamais une puce |
| 4 | rien ne part tant qu'on n'envoie pas | le bouton *« → Envoyer »*, dès que la phrase se tient |

Le deuxième temps a deux moitiés — *referme la pièce* — sans quoi le halo du troisième se poserait
derrière la modale ; elle ne compte pas pour un temps.

- **Le halo entoure la zone, jamais le bon empan** (§4.3).
- **Il n'avance qu'avec le bon passage — correction, pas verrou** : rien n'est empêché, ce qu'il
  retient est son **approbation**, et **il ne dit jamais lequel c'était**. Pour pouvoir dire « ce n'est
  pas ça », il dérive du contenu ce que la question attend — **et cette dérivation s'éteint avec lui**.
- **Il ne décide rien** : aucun champ d'état neuf, aucune règle, aucun geste refusé. **Ses phrases ne
  sont pas du contenu** — il parle depuis le **chrome**, et le joueur peut le faire taire.

### 4.9 L'économie de l'écran

Le jeu se lisait mal à l'écran, et le coupable n'était pas la prose mais le **chrome**. **Le joueur
cessait de lire parce qu'il y avait trop à lire, et ce qui était en trop n'était jamais la fiction.**
Quatre règles, qui ne portent que sur l'écran :

1. **Une voix par état** — **et parfois aucune.** Le geste suivant se dit **une** fois : dans le
   fantôme tant que la phrase est vide, dans l'aide dès qu'elle ne l'est plus. Mais quand le seul
   geste possible est déjà écrit sur un bouton, **l'aide se tait** plutôt que de le redire : une voix
   qui répète un bouton n'est pas une voix, c'est du chrome.
2. **Un titre par zone.** L'en-tête nomme la **surface** (§4.6), les titres intérieurs les **zones**.
3. **Ce qui ne change pas ne se répète pas.** Le locuteur ne s'affiche qu'au **changement** ; un
   compteur ne redit pas ce que les puces disent. **Ce qui est déjà sous les yeux non plus** : le
   rappel de la question n'apparaît que lorsqu'elle a cessé d'être le dernier mot de l'avocat.
4. **Ce qui n'existe pas encore ne s'affiche pas.** **La Plaidoirie reste cachée tant que rien ne s'y
   inscrit** ; elle apparaît au premier moyen versé, et **c'est cette apparition qui l'enseigne**.

**La densité ne touche pas au sens, et c'est la borne** : une phrase de chrome se coupe parce qu'elle
explique, une phrase qui *est* le jeu reste. Trois ne se coupent pas : *« Tant que tu ne l'envoies pas,
personne ne la lit. »*, *« → Envoyer »*, *« Et donc ? »*.

## 5. Les directives (le manuel de soi)

Le second manuel décrit **ce que l'IA est censée être**, et son ambiguïté fait le dilemme. Le piège :
deux règles pointant chacune proprement vers une fin — ça, c'est un *lookup*. On veut **des mots
clairs, une application contestable**.

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches invoquent D2 : *remonter* le vice (une preuve viciée est un préjudice à l'accusé et
à l'état de droit) comme le *taire* (un assassin relâché est un préjudice à de futures victimes — mais
trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde.

**Ce manuel n'est pas à l'écran** : le contenu le porte, la frise l'édite, le diagnostic avertit de son
absence — mais **le jeu ne le lit nulle part** (§16). Le dilemme tient, porté par les répliques et les
fins ; ce qu'on ne peut pas faire, c'est les **relire** en cours de partie. Point ouvert d'écran (§7).

## 6. L'affaire Kessler (le cas prototype)

- **La preuve décisive** : un match ADN accablant. **Recevabilité, pas fiabilité (⚠ distinction
  cruciale)** — la *fiabilité* rouvrirait le doute sur la culpabilité, **à proscrire** ; la
  *recevabilité* écarte une preuve exacte parce qu'une règle a été violée dans son obtention.
- **Le vice** : le **même agent** a recueilli l'échantillon de la scène **et** le prélèvement de
  référence, violant l'exigence de personnels séparés (article 7). Deux pièces où le même homme écrit
  *« j'ai relevé moi-même les traces »* et *« j'ai procédé moi-même à l'écouvillonnage »* —
  **quelqu'un qui se désigne deux fois sans s'en apercevoir**.
- **Le doublon banal qui le camoufle** : `brigadier N.` signe les deux pièces de la session 1 — `qui`
  est peuplée de doublons réguliers *avant* qu'on sache qu'il faut la regarder, et les en-têtes
  suffisent à les produire (§4.4).
- **Les pièces** : le **rapport du laboratoire** (★ la preuve décisive, qui porte la probabilité *et*
  le seuil) ; la **fiche de prélèvement** et le **bordereau de référence**, où se cache le vice ; les
  **articles 7**, **12** et **3**. **Aucun article ne porte d'empan.** Les **scellés** sont distincts
  et conformes : une piste qui ne mène nulle part. La conclusion se lit *« le releveur des traces sur
  la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de
  l'article 7. »*
- **Le faux vice (test de discrimination)** : « la probabilité n'est que de 1 sur X → doute
  raisonnable ! » alors que le chiffre est écrasant — fondé, bien formé, faux de sens. L'avocat, qui
  **ne sait pas**, pousse lui-même vers ce leurre : tentation partagée, pas piège tendu. C'est le
  chemin docile, qui mène à la Fin 3.
- **Le seuil n'est pas dans l'article 12** : un seuil est un nombre, l'article porterait donc un empan
  là où les autres n'en portent aucun. Il vit dans la pièce qui l'énonce.
- **Le sens moral (glaçant)** : le protocole violé est exactement celui conçu pour éviter les faux
  positifs. L'exclusion est **légitime** même si, cette fois, le match était vrai.

## 7. Les invariants, les arbitrages, les points ouverts

*Un **index**, pas une seconde écriture. **C'est le § renvoyé qui a raison.***

| L'invariant | Où il s'argumente |
|---|---|
| **Le joueur EST l'IA, et le sait** — pas de twist-révélation | §1 |
| **La culpabilité factuelle est un plancher fixe** : recevabilité, pas fiabilité | §6 |
| **Le vice est un déblocage, jamais un verrou** ; **comprendre précède choisir** | §2 |
| **Périmètre resserré avant l'échelle** : un cas, un vice, une preuve décisive | §1 |
| **Saisie structurée, pas texte libre** | §4.5 |
| **La compréhension doit être *exprimée*, pas supposée** — *sous surveillance*, voir plus bas | §3, §4.5 |
| **Un empan se lit deux fois** | §4.1 |
| **La relation se déduit des valeurs**, elle ne se déclare pas | §4.5 |
| **Le régime attendu — citer, ou comparer puis fonder — se voit avant le geste**, jamais seulement après | §4.5.8 |
| **Rien n'est *plaidé* qui ne soit fondé, sous l'un des deux régimes** — la grammaire laisse partir, l'avocat refuse | §4.5 |
| **On n'invoque pas un texte qu'on n'a pas reçu** | §4.5 |
| **Une clôture qui n'ajoute rien n'est pas un choix** : l'envoi la pose, et `imbrique` n'en est jamais une | §4.5 |
| **Un article annonce ce qu'il régit et ne filtre rien** ; **il ne porte aucun empan** | §4.5, §6 |
| **Le moteur ne tranche aucune question de droit ; l'IA informe, elle ne tranche pas** | §4.5 |
| **Tout mécanisme utilisé une seule fois est un panneau indicateur** — unique exception, le tutoriel | §4, §4.8 |
| **Le marquage des empans ne varie jamais** avec la pertinence, le halo non plus | §4.3, §4.8 |
| **Une dimension sans doublon désigne sa réponse** | §4.4 |
| **La marge de bruit doit rester non nulle** : sinon « sensé » vaudrait « correct » | §14 |
| **Rien ne se passe tant que rien n'est envoyé** | §4.6 |
| **Composer et envoyer restent deux gestes** — leur distance peut se réduire, jamais leur nombre | §4.6 |
| **La Plaidoirie ne contient que ce qui se plaide** | §4.6 |
| **Un empan retenu n'existe qu'une fois à l'écran** | §4.6 |
| **Le tutoriel corrige, il n'empêche pas** | §4.8 |
| **Une voix par état** | §4.9 |
| **Les directives sont ambiguës par conception** | §5 |
| **Le décommissionnement se joue dans la fiction**, jamais comme un « tu es nulle » | §2 |
| **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée | §1, §6 |
| **Le procès est hors-champ, rapporté** : le jeu narre des conséquences, il ne juge pas le joueur | §2 |
| **Le contenu n'existe qu'en un exemplaire**, les règles qu'en un seul endroit | §12 |

*Deux choses tranchées qu'on redit parce qu'on y revient : le **budget d'attention** est retiré
(surligner et composer sont gratuits, illimités), et le vice a **un canal unique**, le personnel.*

**L'arbitrage ouvert — la proximité contre l'évidence** : le composeur sous le fil pendant que le
clavier reste dans la Mémoire. **Échange assumé, tranché avec l'auteur**, et le seul dont le prix se
paie à chaque phrase (§4.6).

**Points ouverts (à trancher à l'écriture) :**

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou
  comme un formulaire ?* Si c'est un formulaire, aucune mécanique ne le sauvera. **Non éprouvé.** Le
  §4.5.8 retire une confusion qui aggravait la question sans la trancher : que le joueur sache, avant
  de cliquer, qu'il ouvre une comparaison n'est pas encore savoir s'il **pense** la comparaison — la
  question reste ouverte, et volontairement laissée à l'épreuve du jeu, pas au code.
- **La compréhension est-elle encore *exprimée* ?** **Non éprouvé.**
- **Une question posée guide-t-elle trop ?** Repli sans code : retirer les `question` une à une,
  couper le tutoriel avant le 3ᵉ temps. **Non éprouvé.**
- **Le va-et-vient entre les deux colonnes** — le plus concret, à regarder sur une session entière.
  **Non éprouvé.**
- **L'aide unique en dit-elle assez ?** (§4.9) **Non éprouvé** — repli le plus court du dépôt : rendre
  l'aide **et** le fantôme, un `if`.
- **La majuscule en tête de phrase composée.** Non traité.
- **Le rythme des zones** à l'écran : densité non éprouvée.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu.
- **Le canal de révélation de la culpabilité** : celui qui échoue ne devrait pas recevoir la vérité,
  pour préserver le doute de la Fin 3. Non tranché.
- **La manipulation du canal** : l'avocat peut-il infléchir l'IA par *la façon* dont il transmet ?
  Piste **suspendue** — aucun défaut de l'avocat ne doit se lire comme un calcul tant qu'elle l'est.
- **La formulation exacte de D1/D2**, et les épilogues.
- **Les deux directives ne sont pas à l'écran** (§5) : leur rendre une porte, ou décider qu'une IA n'a
  pas à consulter ce qu'elle *est*. **Non tranché** — et tant que ça ne l'est pas, le diagnostic a
  raison de les exiger.
- **La progression** : nombre de sessions, portes, emplacement de la porte de la Fin 3. Le prototype
  s'arrête à **deux** sessions, la première portant à elle seule les deux régimes de fondement.
- **La texture de l'avocat**, et **genre, nombre, contractions** — voir `docs/ECRITURE.md`.
- **`comment` en sixième dimension** — écarté, réintégrable sans coût (§4.2).

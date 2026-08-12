# IAvocat — Lexique

*Un mot, un sens. Ce fichier ne décide ni le sens (c'est `ARCHITECTURE.md`) ni l'emplacement (c'est
`CARTE.md`) — il **arbitre le vocabulaire** : quel mot dire, à qui, pour quelle chose.*

> **Deux régimes, et un écart ne se tranche pas de la même façon selon celui dont il relève.**
>
> **1. Quel mot dire — le lexique fait foi.** Si le code appelle `atelier` la surface du milieu du jeu,
> ce n'est pas le lexique qui est en retard : c'est le code qui est à corriger. C'est ce qui est arrivé
> le 2 août, et c'est le régime qui donne à ce fichier son utilité — sans lui, il ne serait qu'un
> constat de plus à tenir à jour.
>
> **2. Ce qui existe et porte ce mot — le code fait foi.** Si une ligne d'ici cite `S.memoire` quand le
> code dit `S.retenus`, c'est cette ligne qui est périmée. Les identifiants, les ids, les noms de
> fonction ne se décrètent pas d'ici : ils s'y **relèvent**.
>
> **Comment savoir de quel régime relève un écart :** demander si le désaccord porte sur **le choix
> d'un mot** (régime 1) ou sur **l'inventaire de ce qui le porte** (régime 2). Chaque ligne de ce
> fichier mêle les deux — le terme arbitré, et les identifiants cités en exemple.

**Ce n'est pas une cinquième source de vérité.** Le §12 d'`ARCHITECTURE.md` en pose quatre, et elles
portent sur le **projet** : le contenu, les règles, la grammaire, le sens. Celle-ci porte sur les
**mots avec lesquels on en parle**. Aucun arbitrage de vocabulaire ne peut trancher une question de
sens : quand nommer une chose autrement reviendrait à la changer, ce n'est plus du vocabulaire, et
c'est la Partie I qui décide.

## Comment le lire

Trois colonnes à chaque terme : **ce qu'il désigne**, **où il parle** (le joueur ne voit jamais `empan`,
par exemple), et **à ne pas confondre avec**. La dernière colonne est la plus importante : la plupart des
flottements ne viennent pas d'un mot flou, mais de **deux mots proches qui désignent deux choses
différentes** (`lien`/`liaison`, `clore`/`clôturer`, `dossier`/`Dossier`…).

## Les mots du joueur — ce qui s'affiche à l'écran

| Terme à l'écran | Ce qu'il désigne | Ne pas confondre avec |
|---|---|---|
| **Discussion** | la surface de gauche : le fil avec Maître Auber + les pièces jointes | rien — depuis le 2 août le code dit `discussion` lui aussi (`#discussion`, `renderDiscussion`) |
| **Mémoire** | la surface du milieu : le dossier consulté + les passages retenus | `S.retenus`, qui ne couvre que la moitié de cette surface — les passages, pas le dossier |
| **Plaidoirie** | la surface de droite, cachée tant que rien n'y entre : ce que l'avocat retient et va plaider | rien — depuis le 2 août le code dit `plaidoirie` lui aussi (`#plaidoirie`, `renderPlaidoirie`) |
| **Les pièces** / **Les règles** | les deux bandes de la Mémoire : les documents du dossier d'un côté, les articles de l'autre | *pièce* (§ ci-dessous), qui désigne un document précis, pas la bande |
| **passage** | un fragment de texte souligné, cliquable, dans une pièce ouverte | *empan* — même chose, nom de code (§ « Faux amis ») |
| **Ta réponse** / **Réponse** | la zone du composeur, sous le fil de Discussion, où la phrase se construit puis attend | *Envoyer* — le geste qui la fait partir, pas la zone qui la contient |
| **→ Envoyer** | le bouton qui transmet la phrase close à Maître Auber — irréversible | *Clôturer l'instruction* — un tout autre geste, voir « Faux amis » |
| **Clôturer l'instruction** | le bouton qui ferme l'affaire et déclenche une des trois fins | *clore* (une phrase) — même racine, portée totalement différente |

Le joueur ne lit jamais `empan`, `bloc`, `lien`, `forme`, `terme` : ce sont des mots de développeur.
S'ils apparaissent un jour dans une chaîne d'écran, c'est une fuite à corriger, pas une exception à noter.

## Les mots du code — ce qui vit dans `content.js`, `regles.js`, `moteur.js`

| Terme | Ce qu'il désigne | Ne pas confondre avec |
|---|---|---|
| **pièce** | un document du dossier (PV, fiche, bordereau, article) — objet dans `JEU.pieces` | *le dossier*, l'ensemble des pièces livrées, ou *Dossier*, la bande qui les liste (§ « Faux amis ») |
| **empan** | un fragment marqué d'une pièce : `texte`, `dim`, `valeur`, `qui`, `nom` (§4.1 d'ARCHITECTURE.md) | *passage* (mot du joueur pour la même chose) ; *citation* et *nom*, ses deux écritures (ligne suivante) |
| **citation** | l'écriture d'un empan **dans la pièce** ou **rappelée telle quelle** dans une phrase (`e.texte`) | *nom*, l'écriture du même empan **comme sujet** d'une comparaison |
| **nom** | l'écriture d'un empan comme groupe nominal dans une phrase composée (`e.nom`, replié sur `e.texte` si absent) | *citation* — un empan se lit deux fois, jamais de la même façon (§4.1) |
| **terme** | un empan (ou un lien imbriqué) **une fois posé** comme argument dans la phrase en cours (`termes` d'un lien, `poserBloc`) | *empan* — le terme est le rôle que joue un empan une fois choisi, pas l'empan lui-même |
| **bloc** | une transition offerte par l'automate de grammaire (`grammaire.blocs`), rendue comme bouton (`.bbloc`) | *lien* — voir « Faux amis », la paire la plus piégeuse du lexique |
| **liaison** | mot de prose pour désigner un *bloc* du point de vue du joueur qui clique (« liaison-article », « liaison de citation ») | synonyme de *bloc*, pas de *lien* |
| **lien** | un triplet `{forme, termes}` **reconnu** par le moteur — ce qu'une phrase complète *réalise* (`JEU.liens`, `lienDe`) | *liaison*/*bloc* — le lien est le résultat reconnu, la liaison est le geste qui y mène |
| **forme** | le patron grammatical d'une comparaison (déduction, sens, `patron` de rendu) — propriété d'un `lien` ou d'un `bloc` `deduit` | — |
| **attente** | ce que l'avocat attend d'une remise : `{question?, attend, apres?}` | *remise* — l'attente est une des choses qu'une remise porte |
| **remise** | un envoi de pièces par l'avocat, avec sa liste d'attentes | *session* — une session correspond en pratique à une remise, mais le mot « session » reste réservé au sens (Partie I), jamais au code |
| **session** | un temps du récit (§3 d'ARCHITECTURE.md) : « session 1 », « session 2»… | *remise* — le mot de code ; on dit « session » en parlant du sens, « remise » en parlant des données |
| **atelier** | **`app/atelier_v3.html`, et rien d'autre** : l'outil qui écrit et diagnostique une affaire. Un mot, une chose *(harmonisé le 2 août)* | rien — c'est justement le point. Le mot nommait aussi la surface du milieu du jeu (`#atelier`, `renderAtelier`) : cette seconde vie est terminée, la surface s'appelle `memoire` partout |
| **S.retenus** | le tableau des empans retenus (surlignés) — *seulement* ceux-là. Nommé `S.memoire` avant le 2 août | `renderRetenus`, la **zone** qui l'affiche, contre `renderMemoire`, la **surface** qui contient cette zone et le dossier |
| **S.plaidoirie** | le tableau de ce qui est entré au plan (les moyens envoyés) | *S.satisfaits*, les tags d'attente déjà servis — deux compteurs différents qui avancent ensemble sans se confondre |
| **S.fil** | le journal affiché dans Discussion (messages de l'avocat et de l'IA) | *S.retenus*/*S.plaidoirie* — trois tableaux d'état, trois rôles distincts |

## Faux amis — les paires qui se ressemblent et ne devraient jamais se confondre

Ce sont les seules vraies sources d'ambiguïté relevées dans ce tour d'ensemble ; le reste du vocabulaire
n'avait pas besoin d'arbitrage.

- **`lien` / `liaison`.** Un `lien` est un triplet reconnu par le moteur (`JEU.liens`) : c'est du contenu,
  déclaré à l'avance. Une `liaison` est un bouton offert par l'automate (`blocsOfferts`) : c'est un geste
  possible à un instant donné. Composer plusieurs `liaisons` (blocs) peut aboutir à reconnaître un `lien` —
  mais l'un ne se substitue jamais à l'autre dans la prose. Règle à suivre : dans tout texte destiné au
  dépôt, *liaison* et *bloc* sont interchangeables, *lien* ne l'est jamais avec eux.

- **`clore` / `clôturer`.** `clore`/`clorePhrase` ferme **une phrase** dans le composeur — un geste qui se
  répète à chaque tour. `cloturer` ferme **l'instruction entière** — un geste qui n'arrive qu'une fois,
  déclenche une fin, et vide la partie. Même racine, portées incomparables ; ne jamais employer l'un pour
  l'autre, y compris dans un commentaire de code.

- **`empan` / `passage`.** Rigoureusement le même objet, vu de deux côtés : `empan` est le mot du modèle de
  données et de la documentation technique ; `passage` est le mot que **lit le joueur** à l'écran et dans
  le tutoriel. Ce n'est pas une incohérence à corriger — c'est une frontière voulue entre le vocabulaire
  du code et celui de la fiction (§8.6 : l'avocat n'explique jamais rien, l'écran ne parle pas non plus
  comme un développeur). Mais elle doit rester **étanche** : `empan` ne doit jamais fuiter dans une chaîne
  d'écran, `passage` ne doit jamais apparaître dans `content.js` ou `moteur.js`.

- **`dossier` (le concept) / `Dossier` (la bande) / `pièce`.** *Le dossier*, en toutes lettres dans la
  prose, désigne l'ensemble des pièces livrées à ce stade — c'est un concept, pas un composant d'écran.
  *La bande "Les pièces"* (ex-« Dossier », titre retiré depuis, § passation) est la portion de la surface
  Mémoire qui le liste. *Une pièce* est un document précis à l'intérieur. Les trois sont emboîtés, jamais
  interchangeables : on ne dit pas « ouvrir le dossier » pour « ouvrir une pièce ».

- **`atelier` — la collision, et elle est refermée** *(2 août)*. Le mot désignait **deux choses sans
  rapport** : la surface du milieu du jeu (`#atelier`, `renderAtelier`) et l'outil d'écriture entier
  (`app/atelier_v3.html`). Le pire endroit était `tests/harnais.js`, où `bootAtelier()` chargeait l'outil
  et `atelier(w)` lisait la surface du jeu, à quinze lignes d'écart. C'était la seule collision de
  **prose** du dépôt — un mot, deux choses — et la seule que ce lexique avait manquée. **Le mot appartient
  désormais à l'outil, qui seul le portait comme nom propre.**

- **Les collisions d'IDENTIFIANTS, refermées à leur tour.** Le 2 août cherchait dans le **vocabulaire**
  et n'a pas relu l'**inventaire des noms de fonction**, où il en restait. Elles ont ceci de particulier
  que les deux sens sont *incompatibles* : croire lire l'un quand on lit l'autre ne donne pas une nuance
  fausse, ça donne un raisonnement faux. Et elles vivent dans des fichiers que **la même page charge
  ensemble**, donc dans une seule portée globale.

  | Identifiant | Ce qu'il désignait ici | …et là | Tranché |
  |---|---|---|---|
  | `piecesLivrees` | `regles.js` : les pièces livrées **à ce stade** (bornées par `S.remisesEnvoyees`) | l'atelier : celles que **n'importe quelle** remise livre — donc toujours plus nombreuses | l'atelier dit `toutesPiecesLivrees()` |
  | `dimDe` | `moteur.js` : la dimension d'un **terme réduit**, qui répond `"affirmation"` pour un terme emboîté | l'atelier : la dimension d'un **empan**, qui ne répond jamais ça | l'atelier dit `dimEmpan(pid, eid)` |
  | `valider` | `moteur.js` : la raison du refus d'**une phrase**, ou `null` | l'atelier : la liste des anomalies **du contenu entier** | l'atelier dit `diagnostiquer()` |

  La dernière est la plus instructive, et c'est pour ça qu'elle avait tenu si longtemps : **les deux
  rendent « rien » quand tout va bien** — `null` d'un côté, un tableau vide de l'autre. Une collision
  qui ne se voit que le jour où quelque chose ne va pas.

- **`esc` / `escapeH` — deux mots pour une chose, et c'est accepté.** L'inverse du défaut ci-dessus :
  l'échappement HTML s'appelle `esc` dans le jeu et `escapeH` (plus `escapeAttr`) dans l'atelier. Les
  unifier coûterait des dizaines de retouches pour aucun gain de sens, et il n'existe aucun fichier
  chargé par les deux pages où poser la fonction commune. **Deux noms pour une chose se remarquent ; un
  nom pour deux choses se subit.** Seul l'écart réel de comportement a été corrigé : `escapeH(null)`
  écrivait « null » là où `esc(null)` écrit « ».

- ~~**Mémoire (la surface) / `S.memoire` (le tableau)**~~ — **dissous** *(2 août)*. La surface est
  `memoire` (`#memoire`, `renderMemoire`), ce qu'elle contient est `retenus` (`S.retenus`,
  `renderRetenus`, `#zoneRetenus`). Deux mots, deux choses, plus de recouvrement. « Vider les retenus »
  n'est plus une précaution de langage : c'est le nom exact.

- ~~**plan (nom de code) / Plaidoirie (nom à l'écran)**~~ — **dissous** *(2 août)*. `#plan`,
  `#colPlan`, `planCount` et `renderPlan` n'existent plus : la surface s'appelle `plaidoirie` du DOM
  jusqu'à l'état, en passant par le harnais (`plaidoirie`, `plaidoirieVisible`). Idem pour
  `canal` → `discussion`.

## Ce qui n'avait pas besoin d'arbitrage

Passés en revue et jugés **déjà cohérents**, donc volontairement absents des faux amis ci-dessus :
`surligner` (le geste, gratuit, jamais nommé autrement) / `retenu` (l'état qui en résulte) ; `composer`
(construire la phrase) / `poser` (ajouter un terme) ; `avocat`/`Maître Auber` (jamais l'un sans l'autre,
aucun flottement observé).

**Et depuis le 2 août, une catégorie entière a disparu : les paires *nom de code / nom d'écran*.** Les
trois surfaces portent le même mot partout — `discussion`, `memoire`, `plaidoirie` — du DOM au harnais
en passant par l'état. **Une seule frontière de registre subsiste, et elle est voulue :
`empan` / `passage`** (§ « Faux amis ») — c'est celle qui protège la fiction (§8.6), pas un reliquat.

## Une nuance voulue, pour ne pas la reprendre par erreur

Le titre de la zone du composeur dit **« Ta réponse »** tant que la phrase se compose, et bascule sur
**« Réponse »** (sans « Ta ») une fois close et prête à l'envoi — **c'est intentionnel, tranché avec
l'auteur** : la phrase cesse de n'appartenir qu'au joueur une fois close, elle est déjà presque partie.
Ne pas uniformiser les deux formes.

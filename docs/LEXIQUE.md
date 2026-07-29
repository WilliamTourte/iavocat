# IAvocat — Lexique

*Un mot, un sens. Ce fichier ne décide rien (le sens vit dans `ARCHITECTURE.md`, le code dans `CARTE.md`) —
il **arbitre le vocabulaire** : quel mot dire, à qui, pour quelle chose. En cas d'écart entre ce fichier
et l'écran ou le code, c'est ce fichier qui a tort et qu'il faut corriger : il documente un choix, il n'en
fait pas foi.*

## Comment le lire

Trois colonnes à chaque terme : **ce qu'il désigne**, **où il parle** (le joueur ne voit jamais `empan`,
par exemple), et **à ne pas confondre avec**. La dernière colonne est la plus importante : la plupart des
flottements ne viennent pas d'un mot flou, mais de **deux mots proches qui désignent deux choses
différentes** (`lien`/`liaison`, `clore`/`clôturer`, `dossier`/`Dossier`…).

## Les mots du joueur — ce qui s'affiche à l'écran

| Terme à l'écran | Ce qu'il désigne | Ne pas confondre avec |
|---|---|---|
| **Discussion** | la surface de gauche : le fil avec Maître Auber + les pièces jointes | *le canal* (§ ci-dessous) — même chose, nom de code |
| **Mémoire** | la surface du milieu : le dossier consulté + les passages retenus | `S.memoire`, qui ne couvre que la moitié de cette surface (voir « Faux amis ») |
| **Plaidoirie** | la surface de droite, cachée tant que rien n'y entre : ce que l'avocat retient et va plaider | *le plan* (§ ci-dessous) — même chose, nom de code |
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
| **S.memoire** | le tableau des empans retenus (surlignés) — *seulement* ceux-là | la surface **Mémoire**, qui affiche aussi le dossier (§ « Faux amis ») |
| **S.plaidoirie** | le tableau de ce qui est entré au plan (les moyens envoyés) | *S.satisfaits*, les tags d'attente déjà servis — deux compteurs différents qui avancent ensemble sans se confondre |
| **S.fil** | le journal affiché dans Discussion (messages de l'avocat et de l'IA) | *S.memoire*/*S.plaidoirie* — trois tableaux d'état, trois rôles distincts |

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

- **Mémoire (la surface) / `S.memoire` (le tableau).** La surface affiche **deux choses** : le dossier
  consulté et les empans retenus. `S.memoire`, en code, ne couvre que la seconde moitié — les empans
  retenus, rien d'autre. Une phrase comme « vider la mémoire » est ambiguë dans une discussion de design ;
  préférer « vider les retenus » ou nommer `S.memoire` explicitement dès qu'un doute est possible.

- **plan (nom de code) / Plaidoirie (nom à l'écran).** Résolu, mais à savoir lire dans le code : la
  surface s'affiche « Plaidoirie », l'attribut d'état est déjà `S.plaidoirie` (aligné), mais l'id DOM
  (`#colPlan`), la fonction (`renderPlan`) et une partie des commentaires disent encore « plan ». Aucune
  ambiguïté pour le joueur — il ne voit jamais ces noms — seulement pour qui lit le code après avoir lu
  l'écran.

## Ce qui n'avait pas besoin d'arbitrage

Passés en revue et jugés **déjà cohérents**, donc volontairement absents des faux amis ci-dessus :
`surligner` (le geste, gratuit, jamais nommé autrement) / `retenu` (l'état qui en résulte) ; `composer`
(construire la phrase) / `poser` (ajouter un terme) ; `avocat`/`Maître Auber` (jamais l'un sans l'autre,
aucun flottement observé) ; `canal` (nom de code) / `Discussion` (à l'écran) — déjà traité et documenté
au §4.6 d'ARCHITECTURE.md au moment du renommage des surfaces.

## Une nuance voulue, pour ne pas la reprendre par erreur

Le titre de la zone du composeur dit **« Ta réponse »** tant que la phrase se compose, et bascule sur
**« Réponse »** (sans « Ta ») une fois close et prête à l'envoi — **c'est intentionnel, tranché avec
l'auteur** : la phrase cesse de n'appartenir qu'au joueur une fois close, elle est déjà presque partie.
Ne pas uniformiser les deux formes.

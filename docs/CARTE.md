# IAvocat — la carte

*Où vit une chose, et comment elle s'appelle. Rien d'autre.*

> **Ce fichier n'explique jamais** : il localise et il nomme — le §12 pose les quatre sources de
> vérité, aucune n'est ici. En cas d'écart avec le code, **c'est le code qui a raison**. Indexé par
> **noms de fonctions**, jamais par numéros de ligne.
>
> Pour la partie **Les mots**, deux régimes : *quel mot dire* — ce fichier fait foi ; *ce qui porte
> ce mot* — le code fait foi. Un arbitrage de vocabulaire ne tranche jamais une question de sens.

# Où

## Les quatre territoires (§9)

| Fichier | ~lignes | Ce qu'il porte | Ce qu'il ne porte jamais |
|---|---|---|---|
| `app/content.js` | 664 | **le contenu** — une affaire, en un seul exemplaire | aucune règle |
| `app/regles.js` | 342 | **les règles** — tout ce qui décide | aucun contenu, aucun DOM |
| `app/moteur.js` | 212 | **la grammaire** — composer, valider, rendre — **et les projections du contenu** (§14) | aucune donnée |
| `app/index.html` | 75 | **la structure du jeu** | aucun style, aucun script en ligne |
| `app/jeu.css` | 206 | **la mise en forme du jeu** | rien que le JS relise |
| `app/jeu.js` | 480 | **l'écran et les gestes** — rendu, sauvegarde, tutoriel | ne décide rien |
| `app/atelier_v3.html` + `app/atelier/` | 133 + 260 (css) + 1873 (js) | **l'atelier** — écrire et diagnostiquer une affaire, un fichier par outil | ne recopie rien (§12), *y compris de lui-même* |

Quatre dossiers : `app/` (le livrable), `docs/`, `tests/` (§16), `grammaire/` (le banc d'essai, qui
consomme `../app/moteur.js`). `regles.js` et `moteur.js` sont en **mode double** — `require` ou
`<script src>` — et exposent une **fabrique** : `creerRegles(JEU, M)`, `creerMoteur(GRAMMAIRE,
CHAMPS, LIENS)`. Hors fabrique et **cloîtrés** (§9) : `MoteurGrammaire.champsDe`, `.comparaisonsDe`,
`.couleurDim`, `ReglesJeu.estRegle`.

## Les huit modules de l'atelier, dans leur ordre de chargement

| Module | Ce qu'il porte |
|---|---|
| `noyau.js` | le contenu chargé, les outils, l'état d'interface, l'annulation, les onglets, l'échappement — **et les quatre gestes ci-dessous**. **En premier** : seul dont le corps s'exécute au chargement |
| `graphe.js` | le canevas, les traits, le clic dessus. Seul endroit où du CSS traverse vers du JS (`getCSS`, §13) |
| `diagnostic.js` | « le dossier tient-il ? » |
| `inspecteur.js` | les formulaires, les mutations, les renommages d'identifiants |
| `frise.js` | le **temps** du dossier, éditable — remises et attentes |
| `pasapas.js` | la simulation du déroulé — **appelle** `regles.js` |
| `contenu-io.js` | import, export, migration 2→3, autosave |
| `grammaire.js` | l'onglet Grammaire — composer, pour le **sentir** |

**Les quatre gestes que tout l'atelier refait**, dans `noyau.js`, section *2 bis* : `muter(f)`
(annuler, persister, redessiner — **toute** mutation passe par lui), `poserOuRetirer(o,p,v)`,
`reinitSelection({garderEmpans})`, `demanderSuppr(cle,f)` + `btnSuppr(…)`. Avec eux deux formats :
`deK(k)`, l'inverse de `K(pid,ch)`, et `reecrireTermes(t,f)`, la marche sur les termes emboîtés.

## Le geste du joueur, de bout en bout

C'est la boucle d'une session (§4.6). **La ligne de partage :** ce qui *redessine* est une fonction de
`jeu.js` — `R.xxx(S, …)` puis `rendreTout()`, cible de `onclick` ; ce qui *lit* s'écrit `R.xxx(S)`
sur place, et les suites l'appellent pareil, en `w.R.xxx(w.S)`.

| Le geste | La règle (`regles.js`) | La grammaire (`moteur.js`) | Le rendu (`jeu.js`) | § |
|---|---|---|---|---|
| l'avocat ouvre une session | `envoyerRemise` → `poserQuestion` | — | `renderDiscussion` | 4.6 |
| ouvrir une pièce | `ouvrirPiece` (+ son `declenche`) | — | `modalPieceHTML`, `rendreTexte` | 4.3 |
| l'index du dossier | `piecesLivrees` | — | `renderDossier` | 4.5 |
| **surligner** (privé, gratuit) | `surligner` | — | `renderRetenus` dans `renderMemoire` | 4.6 |
| ce que le composeur offre | `blocsOfferts`, `etatCompo`, `indexTermeChamp` | `offerts` | `renderCompo` | 4.5 |
| ce que l'écran souffle — une voix par état | *(dérivé de `S`)* | — | `souffle` | 4.9 |
| le rappel de la question | `attenteCourante`, `remiseCourante` | — | `rappelQuestion` | 4.9 |
| **poser un bloc** | `poserBloc`, `retirerBloc`, `viderCompo` | `reduire`, `deduire`, `ordonner` | `texteCompoPartiel` | 4.5 |
| la clôture sans choix | `cloreSansChoix` | — | *(rien : le bouton disparaît)* | 4.5 |
| le pressentiment ⚑ | `majPressentiment`, `pressentir`, `sousLienVice` | `memeRed` | *(rien : privé)* | 4.7 |
| **clore la phrase** | `clore` → `clorePhrase` | `valider`, `rendre`, `lienDe` | `renderComposeur` (`#composeur`, **sous la Discussion**) | 4.5 |
| **envoyer** — le seul geste transmis | `envoyer` → `reponseAvocat` → `avancerSurAttente` | — | `renderPlaidoirie`, `renderDiscussion` | 4.6 |
| ce qui entre à la Plaidoirie | `estMoyen` | — | `renderPlaidoirie` — **cache sa colonne** tant que rien ne s'y inscrit | 4.6, 4.9 |
| clôturer, répétition | `instructionComplete`, `cloturer`, `verserContre`, `avancerRepetition` | — | `majCloture` | 5 |
| la fin | `finir` | — | `finir` (modale) | 5 |
| **le tutoriel du premier geste** | *(aucune — il ne décide rien)* | — | `tutoAttendu`, `tutoEtape`, `majTutoriel` | 4.8 |

**Les deux voies de clôture** (§4.5) sont le **même** `clore` ; ce qui les sépare vit dans le contenu
— une liaison `cite:true`, lue par `citeDe`, contre une forme d'arité 2 déduite et écrite par son
`patron`. Le tutoriel n'a pas de colonne « règle », et c'est le point ; seule exception,
`tutoAttendu` dérive du contenu ce que la question attend (§4.8).

## L'état `S`

`etatInitial`, en tête de `regles.js`, où **les vingt champs sont commentés un par un** — c'est là
qu'il faut lire. Chaque règle reçoit `S` en premier argument et le modifie **sur place** ; aucune ne
rend de HTML ; celles qui « parlent » poussent dans `S.fil`. Les trois drapeaux : §4.7.

## Le contenu — qui lit quoi

`schema: 3` ; chaque clé et ses attributs optionnels sont au **§11**. Ici, seulement qui les lit :

| Clé | Lue par |
|---|---|
| `dimensions` | `couleurDim` — par **rang**, jamais par pertinence |
| `pieces` (`empans`, `nom`, `court`, `declenche`, `porte`, `type`) | `CHAMPS` via `champsDe`, `piecesLivrees` / `reglesLivrees` / `ouvrirPiece` |
| `grammaire` | `moteur.js` en entier ; `blocsOfferts` pour le filtre `piece` |
| `liens` | `lienDe` — ce qui fait qu'une phrase est *reconnue* |
| `remises` (`attentes: [{question, attend, apres}]`) | `attentesDe`, `attenteCourante`, `avancerSurAttente` |
| `repetition`, `fins`, `avocat` | `cloturer`, `finir`, `reponseAvocat` |

**Deux fonctions normalisent l'ancienne forme `attend`/`apres`, et c'est voulu** : `attentesDe`
(`regles.js`) rend une paire fabriquée, `attentesDeRemise` (`noyau.js`) rend **la remise elle-même**,
pour que l'inspecteur l'édite en place. *On ne les fusionne pas, on dit lequel est lequel.* Personne
d'autre ne les lit sur une remise (R9), hors `attentesEditables` (`frise.js`) et `migrerContenu`
(`contenu-io.js`).

## Les six suites, et les deux outils

Point d'entrée unique : `tests/harnais.js`, `creerHarnais(dossier)` — **325 contrôles** ; ce que
chacune prouve est au §16. Il **inline tout `<script src>` et tout `<link rel=stylesheet>`** au boot
(§13). Ce qu'il expose est le **contrat d'interaction** : `boot` / `bootAtelier` ; les lectures
d'écran, une par surface (`discussion`, `memoire`, `composeur`, `plaidoirie`, `plaidoirieVisible`) ;
les désignations de contenu (`lienVice`, `lienConclusion`, `lienFaux`, `lienTag`, `citations`,
`blocCite`, `comparaisons`, `attentesContenu`) ; les chemins (`surligner`, `composerLien`,
`poserComparaison`, `cheminVers`, `cloreSurPlace`, `livrerTout`, `instruire`, `terminer`). Plus ce
qu'il **ne décide pas lui-même** : `estRegle` (par `require`), `iTermeChamp`, `deK`. **Aucune suite
ne nomme une pièce, un empan ou une valeur** (§16).

| Outil | Commande | Ce qu'il éprouve, et que rien d'autre n'éprouve |
|---|---|---|
| `outils/gardien.js` | `npm run gardien` (dans `npm test`) | **les onze conventions** — la liste vit dans son en-tête, le §16 bis dit ce qu'une règle a le droit d'être. R7, R9, R10 marchent sur `app/`, `tests/` et `outils/`, R11 sur tout le dépôt ; les huit autres sur les deux pages |
| `outils/vue.js` | `npm run vue` (hors `npm test`) | **le vrai chargement**, dans un Chromium en `file://`, et la relecture à l'œil |

Le gardien est en **mode double** : lancé il contrôle, `require` il rend son inventaire — c'est par là
qu'`eslint.config.js` obtient ses globals (§12). La numérotation `1)` … `11)` de l'atelier a suivi ses
modules : `grep -rn "^   [0-9]" app/atelier/` les liste. **Les pièges déjà payés sont au §2 de
`docs/PASSATION.md`.**

# Les mots

Le joueur ne lit jamais `empan`, `bloc`, `lien`, `forme`, `terme` : s'ils apparaissent dans une chaîne
d'écran, c'est une fuite à corriger.

| Terme à l'écran | Ce qu'il désigne | Ne pas confondre avec |
|---|---|---|
| **Discussion** | la surface de gauche : le fil et les pièces jointes | rien — le code dit `discussion` |
| **Mémoire** | la surface du milieu : le dossier + les passages retenus | `S.retenus`, qui n'en couvre que la moitié |
| **Plaidoirie** | la surface de droite, cachée tant que rien n'y entre | rien — le code dit `plaidoirie` |
| **passage** | un fragment souligné, cliquable, dans une pièce | *empan* — même chose, nom de code |
| **Ta réponse** / **Réponse** | la zone du composeur ; la bascule est **intentionnelle** (la phrase close ne lui appartient plus tout à fait) — ne pas uniformiser | *Envoyer*, le geste |
| **→ Envoyer** | transmet la phrase close — irréversible | *Clôturer l'instruction* |
| **Clôturer l'instruction** | ferme l'affaire et déclenche une des trois fins | *clore* une phrase |

| Terme de code | Ce qu'il désigne | Ne pas confondre avec |
|---|---|---|
| **pièce** | un document du dossier — objet dans `JEU.pieces` | *le dossier*, l'ensemble des pièces livrées |
| **empan** | un fragment marqué : `texte`, `dim`, `valeur`, `qui`, `nom` (§4.1) | *citation* et *nom*, ses deux écritures |
| **citation** | l'écriture d'un empan **dans la pièce** (`e.texte`) | *nom* |
| **nom** | son écriture **comme sujet** d'une phrase (`e.nom`, replié sur `e.texte`) | *citation* — un empan se lit deux fois, jamais pareil |
| **terme** | un empan (ou un lien imbriqué) **une fois posé** comme argument | *empan* — le terme est un rôle |
| **bloc** / **liaison** | une transition offerte par l'automate, rendue comme bouton | *lien* |
| **lien** | un triplet `{forme, termes}` **reconnu** (`JEU.liens`, `lienDe`) | *liaison* — le lien est le résultat, la liaison le geste |
| **forme** | le patron grammatical d'une comparaison (`deduction`, `sens`, `patron`) | — |
| **attente** | `{question?, attend, apres?}` | *remise*, qui en porte la liste |
| **remise** | un envoi de pièces, avec ses attentes | *session* — mot du sens ; « remise » est le mot des données |
| **atelier** | **`app/atelier_v3.html`, et rien d'autre** | rien : c'est le point |
| **`S.retenus`** | les empans surlignés, *seulement* eux (ex-`S.memoire`) | `renderRetenus` la **zone**, `renderMemoire` la **surface** |
| **`S.plaidoirie`** | ce qui est entré au plan | `S.satisfaits`, les tags déjà servis |
| **`S.fil`** | le journal affiché dans Discussion | les deux ci-dessus — trois tableaux, trois rôles |

## Faux amis — les quatre qui mordent encore

- **`lien` / `liaison`** — le premier est du contenu déclaré à l'avance, la seconde un geste possible
  à un instant donné. *liaison* et *bloc* sont interchangeables, *lien* ne l'est jamais.
- **`clore` / `clôturer`** — `clore` ferme **une phrase**, à chaque tour ; `cloturer` ferme
  **l'instruction**, une fois, et déclenche une fin. Jamais l'un pour l'autre, commentaires compris.
- **`empan` / `passage`** — le même objet vu de deux côtés : frontière **voulue** (§8.6 de
  `docs/ECRITURE.md`) et **étanche**, `empan` ne fuit jamais à l'écran, `passage` n'entre jamais dans
  `content.js` ni `moteur.js`.
- **`dossier` / `Dossier` / `pièce`** — un concept, une bande, un document. On ne dit pas « ouvrir le
  dossier » pour « ouvrir une pièce ».

**Trois collisions d'identifiants, refermées** — les deux sens y étaient *incompatibles*, dans une
même portée globale :

| Identifiant | Ici | …et là | Tranché |
|---|---|---|---|
| `piecesLivrees` | `regles.js` : les pièces livrées **à ce stade** | l'atelier : celles de n'importe quelle remise | `toutesPiecesLivrees()` |
| `dimDe` | `moteur.js` : la dimension d'un **terme réduit** | l'atelier : celle d'un **empan** | `dimEmpan(pid, eid)` |
| `valider` | `moteur.js` : le refus d'**une phrase** | l'atelier : les anomalies **du contenu entier** | `diagnostiquer()` |

*La dernière a tenu longtemps parce que les deux rendent « rien » quand tout va bien.* À l'inverse,
`esc` (jeu) et `escapeH` (atelier) restent deux noms pour une chose, et c'est accepté : **deux noms
pour une chose se remarquent ; un nom pour deux choses se subit.**

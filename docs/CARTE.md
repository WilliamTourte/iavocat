# IAvocat — la carte du code

*Où vivent les choses. Rien d'autre.*

> **Ce fichier ne dit jamais pourquoi.** Il localise, il n'explique pas — le §12 de
> `docs/ARCHITECTURE.md` pose les quatre sources de vérité, et aucune n'est ici. Chaque ligne renvoie
> au § qui tranche. En cas d'écart avec le code, **c'est le code qui a raison** : un index vieillit,
> une règle non.
>
> Il est indexé par **noms de fonctions**, jamais par numéros de ligne — les lignes pourrissent en
> trois commits, les noms tiennent. Un `grep -n "function nomDeLaFonction"` donne la ligne du jour.

## Les quatre territoires, en une ligne chacun (§9)

| Fichier | ~lignes | Ce qu'il porte | Ce qu'il ne porte jamais |
|---|---|---|---|
| `app/content.js` | 664 | **le contenu** — une affaire, en un seul exemplaire | aucune règle |
| `app/regles.js` | 361 | **les règles** — tout ce qui décide | aucun contenu, aucun DOM |
| `app/moteur.js` | 182 | **la grammaire** — composer, valider, rendre | aucune donnée |
| `app/index.html` | 866 | **le jeu** — l'affichage et les gestes d'écran | ne décide rien |
| `app/atelier_v3.html` | 2170 | **l'atelier** — écrire et diagnostiquer une affaire | ne recopie rien (§12) |

`regles.js` et `moteur.js` sont en **mode double** — `require` (tests, banc) ou `<script src>` (jeu,
atelier). Les deux exposent une **fabrique** : `creerRegles(JEU, M)` et `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)`.

## Le geste du joueur, de bout en bout

Se lit de haut en bas : c'est la boucle d'une session (§4.6). `index.html` n'y apparaît que comme
**rendu** et comme **relais** — chacune de ses fonctions homonymes est un `R.xxx(S, …)` suivi d'un
`rendreTout()`.

| Le geste | La règle (`regles.js`) | La grammaire (`moteur.js`) | Le rendu (`index.html`) | § |
|---|---|---|---|---|
| l'avocat ouvre une session | `envoyerRemise` → `poserQuestion` | — | `renderCanal` | 4.6 |
| ouvrir une pièce | `ouvrirPiece` (+ son `declenche`) | — | `modalPieceHTML`, `rendreTexte` | 4.3 |
| l'index du dossier | `piecesLivrees` | — | `renderDossier` | 4.5 |
| **surligner** (privé, gratuit) | `surligner` | — | `renderMemoire` | 4.6 |
| ce que le composeur offre | `blocsOfferts`, `etatCompo`, `indexTermeChamp` | `offerts` | `renderCompo` | 4.5 |
| ce que l'écran souffle — **une seule voix par état** | *(aucune — dérivé de `S`)* | — | `souffle` (dans le fantôme si la phrase est vide, dans l'aide sinon) | 4.9 |
| le rappel de la question — **seulement si elle n'est plus le dernier mot** | `attenteCourante`, `remiseCourante` | — | `rappelQuestion` | 4.9 |
| **poser un bloc** | `poserBloc`, `retirerBloc`, `viderCompo` | `reduire`, `deduire`, `ordonner` | `texteCompoPartiel` | 4.5 |
| la clôture sans choix | `cloreSansChoix` (appelée par `poserBloc`) | — | *(rien : le bouton disparaît)* | 4.5 |
| le pressentiment ⚑ | `majPressentiment`, `pressentir`, `sousLienVice` | `memeRed` | *(rien : privé)* | 4.7 |
| **clore la phrase** | `clore` → `clorePhrase` | `valider`, `rendre`, `lienDe` | `renderCompo` → `renderComposeur` (`#composeur`, **sous le canal**) | 4.5 |
| **envoyer** — le seul geste transmis | `envoyer` → `reponseAvocat` → `avancerSurAttente` | — | `renderPlan`, `renderCanal` | 4.6 |
| ce qui entre au plan | `estMoyen` | — | `renderPlan` — **cache sa colonne** (`#colPlan`) tant que rien ne s'y inscrit | 4.6, 4.9 |
| clôturer, répétition | `instructionComplete`, `cloturer`, `verserContre`, `avancerRepetition` | — | `majCloture` | 5 |
| la fin | `finir` | — | `finir` (modale) | 5 |
| **le tutoriel du premier geste** | *(aucune — il ne décide rien)* | — | `tutoAttendu`, `tutoEtape`, `majTutoriel` | 4.8 |

**Les deux voies de clôture** (§4.5) ne sont pas deux mécaniques : c'est le **même** `clore`. Ce qui
les sépare vit dans le contenu — une liaison portant `cite:true`, lue par `rendre` de `moteur.js`
(`citeDe`), contre une forme d'arité 2 déduite par `deduire` et écrite par son `patron`.

**Le tutoriel n'a pas de colonne « règle », et c'est le point.** Il vit entièrement dans
`index.html`, comme la sauvegarde de partie : son temps se dérive de `S`, il n'ajoute aucun champ
d'état, il ne refuse aucun geste. Seule exception à connaître : `tutoAttendu` **dérive du contenu ce
que la question attend** (tag de l'attente → lien → terme atomique), pour pouvoir dire *« ce n'est
pas ça »* sans jamais dire lequel c'était. C'est le seul endroit où l'écran connaît la réponse, et
ça s'éteint avec le tutoriel (§4.8).

## L'état `S`

Un seul endroit : `etatInitial` en tête de `regles.js`, où **les vingt champs sont commentés un par
un** — c'est là qu'il faut lire, pas ici. Convention : chaque règle reçoit `S` en premier argument et
le modifie **sur place** ; aucune ne rend de HTML ; celles qui « parlent » poussent dans `S.fil`.

Les trois drapeaux (`vice_pressenti`, `vice_trouve`, `vice_expose`) et où ils se lèvent : §4.7.

## Le contenu — les clés de `content.js`

`schema: 3`. Chaque clé et **tous ses attributs optionnels** sont décrits au **§11**, qui est la
source de vérité du schéma. Ici, seulement qui les lit :

| Clé | Lue par |
|---|---|
| `dimensions` | `couleurDim` / `rangDim` (`index.html`) — par **rang**, jamais par pertinence |
| `pieces` (`empans`, `nom`, `court`, `declenche`, `porte`, `type`) | `CHAMPS` (`index.html`), `piecesLivrees` / `reglesLivrees` / `ouvrirPiece` |
| `grammaire` (`formes`, `blocs`, `depart`, `finaux`) | `moteur.js` en entier ; `blocsOfferts` pour le filtre `piece` |
| `liens` | `lienDe` (`moteur.js`) — c'est ce qui fait qu'une phrase est *reconnue* |
| `remises` (`attentes: [{question, attend, apres}]`) | `attentesDe`, `attenteCourante`, `avancerSurAttente` |
| `repetition`, `fins`, `avocat` | `cloturer`, `finir`, `reponseAvocat` |

L'**ancienne forme** `attend`/`apres` posée sur la remise se lit comme une liste à un élément :
`attentesDe` la normalise, en un seul exemplaire.

## Les six suites

Point d'entrée unique : `tests/harnais.js`, `creerHarnais(dossier)`. `npm test` les enchaîne dans
l'ordre de `package.json` — **330 contrôles, tout vert ou ce n'est pas fini** (§16).

Le harnais **inline** les trois `<script src>` au boot, parce que jsdom n'en charge aucun (§13) —
c'est pourquoi `npm run vue` existe : il est le seul à éprouver le vrai chargement.

Ce qu'il expose, et qui est le **contrat d'interaction** : `boot` / `bootAtelier`, les lectures
d'écran (`canal`, `atelier`, **`composeur`** — il vit sous le canal depuis le 31 juillet —, `plan` et
**`planVisible`**, qui dit si la colonne du plan existe), les désignations de contenu (`lienVice`, `lienConclusion`,
`lienFaux`, `lienTag`, `citations`, `blocCite`, `comparaisons`, `attentesContenu`), et les chemins
(`surligner`, `composerLien`, `poserComparaison`, `cheminVers`, `cloreSurPlace`, `livrerTout`,
`instruire`, `terminer`). **Aucune suite ne nomme une pièce, un empan ou une valeur** : elles les
*trouvent* par ces fonctions (§16) — c'est ce qui les rend valides sur une autre affaire.

Ce que chaque suite prouve : **§16**, qui les détaille une par une.

## L'atelier — ses onze sections numérotées

`app/atelier_v3.html` est commenté par sections `1)` … `11)` ; `grep -n "^   [0-9]*)" app/atelier_v3.html`
les liste. Les deux qui comptent : **7) la frise** (éditable — remises, attentes) et **8) le
pas-à-pas**, qui appelle `RG()` — c'est-à-dire `creerRegles` du jeu — sur son propre état `SIM`.
Il n'a **que** deux écarts assumés : il joue au grain du **lien** (`simComposer`) et non du bloc, et
il narre les gestes privés en lignes « · ». Le badge ⚙ signale une règle qui vit dans `regles.js`.

## Les pièges déjà payés

**Ils sont au §2 de `docs/PASSATION.md`, et c'est là qu'il faut les lire** — ils changent à chaque
session. Les trois qui reviennent, pour mémoire seulement : les `const` de haut niveau ne sont pas
des propriétés de `window` ; l'index `iBloc` de `poserBloc` est **positionnel dans la liste filtrée**,
donc dépendant de la session ; le flag `cite` est porté par la **liaison**, jamais par le terme.

## Trois réflexes qui coûtent cher

- **Chercher un libellé de bouton par `grep`** avant d'avoir lu le §11 : les libellés qui diffèrent
  de ce qui s'écrit sont des attributs `libelle` déclarés dans le contenu, et le §11 les nomme.
- **Explorer pour trouver *où décide* quelque chose.** La réponse est toujours `regles.js` : les deux
  pages HTML ne décident rien (§9). Si une décision semble vivre dans une page, c'est un bug.
- **Lire `ARCHITECTURE.md` en entier.** 480 lignes, et le tableau de `CLAUDE.md` dit lesquelles.

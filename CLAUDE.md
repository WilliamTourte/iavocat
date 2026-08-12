# IAvocat — pour commencer

Un jeu à dominante textuelle : on incarne une **IA** qu'un **avocat de la défense** interroge session
après session, pour lui préparer de quoi réfuter l'accusation. Le vrai sujet est un cas de conscience.
Le dépôt porte le **jeu** (`app/`), l'**atelier** qui l'écrit (`app/atelier_v3.html` + `app/atelier/`,
un fichier par outil) et six suites de test. **Zéro build, zéro serveur, zéro dépendance à l'exécution** : `app/index.html` s'ouvre en
`file://` et joue. Une page ne porte que sa **structure** — le CSS entre par `<link>`, le JS par
`<script src>`.

> **Ce fichier n'est pas une source de vérité.** Le §12 de `docs/ARCHITECTURE.md` en pose exactement
> quatre — le contenu, les règles, la grammaire, et la Partie I pour le sens. Ce qui suit ne fait
> qu'**orienter** : ça renvoie, ça ne reformule pas. En cas d'écart, le document renvoyé tranche.

## Par où lire, selon ce qu'on vient faire

**Toujours d'abord `docs/PASSATION.md`** — l'état du jour, les décisions prises avec l'auteur, et la
prochaine étape. C'est court et c'est daté.

Ensuite, dans `docs/ARCHITECTURE.md` (on n'en lit que ce qu'il faut) —

| Ce qu'on vient faire | Ce qu'on lit |
|---|---|
| **Trouver *où* vit une chose** | `docs/CARTE.md` — l'index geste → fonction → fichier. Il ne dit jamais pourquoi ; il évite d'avoir à chercher |
| **Un doute sur un mot** (empan/passage, lien/liaison, dossier/Dossier…) | `docs/LEXIQUE.md` — un mot, un sens, et les faux amis à ne jamais confondre |
| Se repérer, sans plus | **§9** (les quatre territoires), **§12** (où vit la vérité), **§17** (le résumé en trois phrases) |
| Toucher au **sens** | **Partie I** en entier, et **§7** avant tout (invariants, arbitrages, points ouverts) |
| Toucher au **contenu** | **§11** (le schéma 3, et tous les attributs optionnels) |
| Toucher aux **tests** | **§16** (ce que chaque suite prouve, et pourquoi elles ne nomment aucun contenu) |
| Comprendre une panne au chargement | **§13** |

## Les commandes

```sh
npm test               # les six suites — 325 contrôles. La règle d'or : tout vert, ou ce n'est pas fini (§16)
npm run vue            # ouvre le jeu dans un VRAI navigateur, joue, capture. Voir ci-dessous
npm run demo:grammaire # banc d'essai de la grammaire. Hors `npm test` : pas de code de sortie
```

Rien d'autre à préparer : pas de build, pas de service, pas de base. En session distante, le hook
`.claude/hooks/session-start.sh` a déjà posé `node_modules`.

### `npm run vue` — voir le jeu tourner

`outils/vue.js` ouvre `app/index.html` en **`file://`** dans Chromium, joue le chemin docile et dépose
des captures dans `captures/` (ignoré par git), en versant le fil de l'avocat sur la sortie standard.

Deux choses qu'il est le seul à faire : il éprouve le **vrai** chargement des quatre `<script src>` et de la feuille de style,
là où le harnais de test les inline (§13) ; et il permet la **relecture à l'œil**, que le §2 de la
passation rappelle irremplaçable. Il ne réimplémente rien — il injecte `tests/harnais.js` dans la page
et appelle son `instruire`, donc il joue exactement le chemin que jouent les suites.

Sans navigateur trouvé, il le dit et sort en 0. Il ne sort en 1 que sur une erreur JS de la page.

## Ce qu'il ne faut pas défaire

**La règle de rangement** (§9), qui tient tout le reste :

> *le contenu ne contient aucune règle, les règles ne contiennent aucun contenu, l'interface ne décide
> rien, et l'atelier ne recopie rien.*

Concrètement : le contenu vit **en un seul exemplaire** dans `app/content.js`, les règles dans
`app/regles.js` (pur, sans DOM), la grammaire dans `app/moteur.js` (pur, sans données) — qui porte
aussi, hors fabrique, les **projections du contenu** (`champsDe`, `comparaisonsDe`, `couleurDim`),
parce qu'elles vivaient en deux ou trois copies. Les deux pages HTML ne font que *montrer*, et
`index.html` **n'enveloppe plus** les lectures de `regles.js` : ce qui redessine est une fonction
d'écran, ce qui lit s'écrit `R.x(S)` — les suites lisent pareil, en `w.R.x(w.S)`. Le pas-à-pas de l'atelier **appelle** les règles du jeu, il ne les rejoue
pas — c'est ce qui a permis de supprimer une checklist de resynchronisation de dix-sept lignes (§12).

Les **pièges déjà payés** sont listés au §2 de `docs/PASSATION.md` — les lire avant de toucher au
moteur ou à la grammaire. Les quatre qui reviennent : les `const` de haut niveau ne sont pas des
propriétés de `window` — **mais ils occupent quand même le nom**, et un module chargé par
`<script src>` partage la portée globale de la page ; l'index `iBloc` de `poserBloc` est
**positionnel dans la liste filtrée**, donc dépendant de la session ; le flag `cite` est porté par la
**liaison**, jamais par le terme.

## La méthode, demandée par l'auteur

Toute évolution part de `docs/ARCHITECTURE.md` : **on réécrit le document, on le fait relire, puis on
applique au code.** La passation le redit à chaque fois, en clôture. Et à la fin, on relit les phrases
composées **à l'œil** : c'est comme ça qu'on attrape ce qu'aucune suite ne voit.

## Une convention de dates, pour éviter la méprise

Dans les docs, « le 28 juillet », « le 29 », « le 30 » désignent des **sessions de travail
successives**, pas des dates de calendrier : `git log` place tous les commits au même jour. Chercher à
recouper les deux ne mène nulle part.

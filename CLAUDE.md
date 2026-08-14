# IAvocat — pour commencer

Un jeu à dominante textuelle : on incarne une **IA** qu'un **avocat de la défense** interroge session
après session, pour lui préparer de quoi réfuter l'accusation. Le vrai sujet est un cas de conscience.
Le dépôt porte le **jeu** (`app/`), l'**atelier** qui l'écrit (`app/atelier_v3.html` + `app/atelier/`)
et six suites. **Zéro build, zéro serveur, zéro dépendance à l'exécution** : `app/index.html` s'ouvre
en `file://` et joue. Une page ne porte que sa **structure** — CSS par `<link>`, JS par `<script src>`.

> **Ce fichier oriente, il ne tranche pas** : le §12 pose les quatre sources de vérité, et le document
> renvoyé a toujours raison.
>
> **Un numéro de section adresse n'importe quoi** — ils sont uniques dans tout le dépôt : **§1 à §7**
> dans `docs/CONCEPTION.md`, **§8.1 à §8.9** dans `docs/ECRITURE.md`, **§9 à §17** dans
> `docs/ARCHITECTURE.md`. Un renvoi n'a donc pas à nommer son fichier ; R11 du gardien vérifie
> qu'aucun ne pointe dans le vide, ni ne nomme le mauvais.

## Par où lire

**D'abord `docs/PASSATION.md`** — l'état du jour, ce qui mord, la prochaine étape. C'est court.

| Ce qu'on vient faire | Ce qu'on lit |
|---|---|
| **Où** vit une chose, **comment** elle s'appelle | `docs/CARTE.md` — geste → fonction → fichier, et l'arbitrage du vocabulaire |
| Toucher au **sens** | `docs/CONCEPTION.md` : le **§4.5** d'abord (la grammaire du composeur, en sept), le **§7** pour l'index des invariants |
| Toucher au **contenu** | **§11** — le schéma 3 et ses attributs optionnels |
| **Écrire une affaire** | `docs/ECRITURE.md`, §8.1 à §8.9. Rien n'y touche au moteur |
| Se repérer dans le système | **§9** (rangement), **§12** (la vérité), **§17** (le résumé) |
| Toucher aux **tests** | **§16** — ce que chaque suite prouve |
| Une panne au chargement | **§13** |
| Savoir si un débat a été tranché | `docs/HISTORIQUE.md` |

## Les commandes

```sh
npm test               # les six suites (325 contrôles), PUIS le gardien, PUIS ESLint.
                       # Tout vert, ou ce n'est pas fini (§16)
npm run suites         # les six suites seules — le sens avant la forme
npm run gardien        # les onze conventions que les suites ne voient pas (§16 bis)
npm run lint           # ESLint, le filet générique
npm run vue            # le jeu dans un VRAI Chromium en file://, joué, capturé dans captures/
npm run demo:grammaire # banc d'essai de la grammaire. Hors `npm test`
```

Rien à préparer. En session distante, `.claude/hooks/session-start.sh` a déjà posé `node_modules`.
`npm run vue` est le **seul** à éprouver le vrai chargement des balises et de la feuille de style, là
où le harnais les inline (§13) — et le seul à permettre la relecture à l'œil, irremplaçable.

## Ce qu'il ne faut pas défaire

**La règle de rangement** (§9) : *le contenu ne contient aucune règle, les règles ne contiennent aucun
contenu, l'interface ne décide rien, et l'atelier ne recopie rien.* Le contenu dans `app/content.js`,
les règles dans `app/regles.js` (pur, sans DOM), la grammaire et les projections dans `app/moteur.js`
(pur, sans données). Ce qui redessine est une fonction d'écran ; ce qui lit s'écrit `R.x(S)` sur place,
et les suites lisent pareil, en `w.R.x(w.S)`.

Les **pièges déjà payés** sont au §2 de `docs/PASSATION.md`, à lire avant de toucher au moteur ou à la
grammaire. Les quatre qui reviennent : les `const` de haut niveau ne sont pas des propriétés de
`window` **mais occupent quand même le nom** ; un module chargé par `<script src>` partage la portée
globale de la page ; l'index `iBloc` de `poserBloc` est **positionnel dans la liste filtrée** ; le flag
`cite` est porté par la **liaison**, jamais par le terme.

## La méthode, demandée par l'auteur

Toute évolution part du **document** — `docs/CONCEPTION.md` pour le sens, `docs/ARCHITECTURE.md` pour
le système : **on réécrit le document, on le fait relire, puis on applique au code.** Et à la fin, on
relit les phrases composées **à l'œil** : c'est comme ça qu'on attrape ce qu'aucune suite ne voit.

*Convention de dates : « le 28 juillet », « le 29 » désignent des **sessions de travail**, pas des
dates de calendrier — `git log` place tous les commits au même jour.*

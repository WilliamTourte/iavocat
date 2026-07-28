# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 28 juillet 2026, après la session **« refonte ergonomique : continuation, envoi sur place, surface unique, empans nommés »**.*

> Cette passation **remplace** celle du 27 juillet. La session précédente avait appliqué au code la refonte « empans, dimensions, composer/verser » ; **celle-ci part de retours de jeu** et corrige l'usage, sans toucher au sens. Ce qui a été conservé intégralement : les trois fins, les trois drapeaux, la frontière privé / transmis, les deux directives, le brouillard, la culpabilité comme plancher fixe, la séparation contenu / moteur / atelier, la sauvegarde de partie, le versionnage `schema` (toujours **3** — les ajouts sont optionnels).

---

## 1. D'où vient cette session

Cinq retours après avoir joué la tranche verticale. Ils ne portent pas sur le sens — ils disent que **la mécanique se voit** :

1. composer *« X et Y sont la même chose »* **puis** recomposer *« ce qui précède est contraire à Z »* : confus, deux gestes pour une pensée ;
2. un empan s'affiche par sa citation brute (*« j'ai entendu des éclats de voix »*) : il lui faut un **nom** (*« l'heure de l'appel du témoin »*) ;
3. le plan de plaidoirie garde **tout**, erreurs comprises, au lieu de ce qui est bon ;
4. « la mémoire » et « composer » **font double emploi** — on se perd entre les deux ;
5. composer **puis** aller verser ailleurs n'est pas intuitif : la phrase devrait partir dès qu'elle est faite.

## 2. Ce qui a changé, en une phrase

La conclusion s'écrit **en continuation** de sa comparaison, la phrase close **attend sur place** avec un unique bouton *« → Maître Auber »*, la mémoire **est** le clavier du composeur, le plan **ne retient que les moyens**, et un empan porte un **nom** en plus de sa citation.

Les deux principes qui ont commandé les arbitrages :

> **Tout mécanisme utilisé une seule fois est un panneau indicateur.**
> **Composer et envoyer restent deux gestes ; leur distance peut se réduire, jamais leur nombre.**

## 3. Les deux arbitrages qui touchaient à la structure

Les retours 3 et 5 ne pouvaient pas être appliqués tels quels. Ils ont été tranchés avec l'auteur avant d'écrire une ligne.

### 3.1 Retour 5 — l'envoi automatique était impossible

Si la phrase part dès qu'elle est close, alors `vice_trouve ⇒ vice_expose` : **la Fin 2 disparaît** et il ne reste que deux fins. Arbitrage retenu : **l'envoi reste un geste distinct, mais il se fait sur place**. La phrase close ne va plus dans une liste « brouillon » qu'il faut parcourir — elle reste affichée là où elle vient d'être écrite. Ce qui a été supprimé, c'est la **distance** entre les deux gestes, jamais le second geste. Aucun texte de fin n'a eu à être réécrit.

### 3.2 Retour 3 — « ce qui est BON » = ce que l'avocat peut plaider

Critère retenu : **les moyens seulement**. Reste au plan ce qui porte une `conclusion`, le `faux` vice, ou un `tag` d'attente. Une comparaison sans conclusion reçoit sa réplique dans le canal et **n'y figure pas** — ce que l'avocat disait déjà mot pour mot (*« en l'état c'est une remarque, pas un moyen »*). Le faux vice, lui, est gardé : l'avocat y croit, et `variante_faux` en dépend.

## 4. L'inventaire

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | **Réécrit d'abord, avant tout code** — méthode demandée par l'auteur, à conserver. Partie I : §4.1 (l'empan se lit deux fois), §4.5 (**la continuation**, entièrement neuf), §4.6 (**trois** surfaces au lieu de quatre, l'envoi sur place, le plan des moyens), §4.7 (les drapeaux, logique inchangée, lieux renommés), §7 (quatre invariants ajoutés, arbitrage 6), §8.8 (le nom d'empan comme remède d'accord). Partie II : §11 (`nom`, `imbrique`, `libelle`), §14 (`reduire` emboîte, `rendre` écrit le nom), §15, §16 |
| `app/moteur.js` | `reduire()` **accumule et emboîte** sur `bloc.imbrique` ; `rendre()` écrit `nom \|\| texte` et ne met pas d'espace devant une ponctuation. **Rétrocompatible** : une grammaire sans `imbrique` produit exactement le résultat d'avant |
| `app/index.html` | La colonne « mémoire » et la colonne « composeur + brouillon » **fusionnent** ; `renderMemoire()` rend les puces-clavier, `renderPlan()` filtre par `estMoyen()`, `verserPlaidoirie()` devient `envoyer()`, `S.prete` porte la phrase qui attend. `JEU_EMBARQUE` aligné sur le SEED |
| `app/atelier_v3.html` | SEED : **~20 empans nommés**, automate à continuation (état `S4`, bloc « en rester là », six liaisons-articles `imbrique`), `est antérieur à` → **`précède`** (accord). Diagnostic : `nom` manquant (avertissement), emboîtement dans le vide (erreur), clôture sans forme assouplie. Inspecteur : champ « Nom ». Simulation : `simEnvoyer()`, `simMoyen()`, `simComposable()` par continuation |
| `app/content.js` | **Régénéré** par `npm run export:seed` |
| `tests/harnais.js` | `composerLien` connaît **deux chemins** vers une forme emboîtée — la continuation d'abord, la source `note` en repli. Nouveaux : `poserComparaison`, `cloreSurPlace`, `plan` |
| les six suites | 32 + 31 + 20 + 60 + 33 + 64 = **240 contrôles, tous verts**, plus `verifier_content_sync.js` |

## 5. Les points de vigilance pour la suite

- **`est antérieur à` a dû devenir `précède`.** Les noms d'empans sont des groupes nominaux de genre quelconque (*« l'heure… »*, *« le releveur… »*) : un verbe à participe fautait à l'accord une fois sur deux. **Toute liaison ajoutée doit passer le test de l'accord** (§8.9 d'`ARCHITECTURE.md`) — c'est devenu le point le plus fragile du contenu.
- **La continuation ne laisse plus de prémisse orpheline.** Conclure produisait hier deux phrases au journal, dont une jamais transmise ; il n'y en a plus qu'une. Un test le vérifie explicitement.
- **La source `note` reste supportée** par le moteur et par le jeu, bien qu'absente du contenu livré. `test_autre_affaire.js` l'exerce à chaque exécution : c'est la preuve, en continu, de la rétrocompatibilité annoncée au §11. Ne pas la retirer.
- **`S.prete` est l'écart entre comprendre et dire.** Le perdre (au rechargement, à un refactor du composeur) effacerait la Fin 2 sans qu'aucun test de fin ne rougisse ailleurs. `test_sauvegarde.js` le garde.

## 6. Ce qui reste ouvert

| Sujet | État |
|---|---|
| **Le critère qui décide de tout** : la phrase composée se lit-elle comme une pensée ou comme un formulaire ? | **Toujours non éprouvé** — mais c'est la question à laquelle cette session s'est attaquée. Les phrases se lisent maintenant *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, ce qui est contraire à l'article 7. »* À juger à la main, en jouant |
| Le rythme des zones | **Refermé pour moitié** : trois zones, plus de duplication, la phrase ne change plus de colonne. L'autre moitié reste ouverte — la colonne d'atelier porte le dossier, la phrase et les empans, et sa densité n'est pas éprouvée |
| La majuscule en tête de phrase composée | Non traité. Les phrases commencent en minuscule, comme avant la refonte |
| La tension de l'**IA partisane** | Tranchée en mécanique, **à valider en contenu** |
| La progression : nombre de sessions, portes, emplacement de la porte de la Fin 3 | Non traité — le prototype s'arrête à deux sessions |
| Genre, nombre, contractions dans la grammaire | **Partiellement traité** par les noms d'empans et par `précède`. Le cas général reste ouvert |
| `comment` en sixième dimension | Écarté, réintégrable sans coût |
| Le canal de révélation de la culpabilité | Toujours non tranché (narrateur omniscient dans les fins) |

## 7. Prochaine étape

Dans cet ordre :

1. **Jouer `app/index.html` en `file://`**, de bout en bout, et répondre à la question du §6. Les cinq retours sont appliqués ; il faut maintenant savoir s'ils suffisent.
2. Si la boucle tient : écrire la **session 3** et placer la porte de la Fin 3.
3. Si elle ne tient pas : c'est encore le **rendu de la phrase** qu'il faut reprendre (les noms d'empans et les liaisons, pas le modèle) — le modèle est éprouvé par 240 contrôles.

**Méthode à conserver, demandée par l'auteur :** toute évolution part de `docs/ARCHITECTURE.md`. On réécrit le document, on le fait relire, **puis** on applique au code. Le fichier reste l'unique source de vérité.

**Amorce suggérée :** « Lis `docs/PASSATION.md` et `docs/ARCHITECTURE.md`. J'ai rejoué la tranche verticale après la refonte ergonomique ; voilà ce que ça donne. »

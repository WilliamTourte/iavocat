# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 29 juillet 2026, après la session **« la relation se déduit, l'article se désigne, le manuel se mérite »**.*

> Cette passation **remplace** celle du 28 juillet. Deux sessions de suite sont maintenant parties de **retours de jeu** et ont corrigé l'usage sans toucher au sens. Ce qui a été conservé intégralement, une fois de plus : les trois fins, les trois drapeaux, la frontière privé / transmis, les deux directives, le brouillard, la culpabilité comme plancher fixe, la séparation contenu / moteur / atelier, la sauvegarde de partie, le versionnage `schema` (toujours **3**).

---

## 1. D'où vient cette session

Trois retours après avoir rejoué la tranche verticale. Ils disent tous la même chose sous trois angles : **le joueur passait son temps à déclarer ce que le jeu savait déjà.**

1. Choisir entre « et », « précède », « est d'un tout autre ordre que » : il ne devrait avoir qu'à **désigner deux éléments**.
2. Choisir **l'article** devrait suffire, sans trancher entre « est conforme » et « n'est pas conforme ».
3. On pouvait invoquer **l'article 7 dès la remise 1**, sans l'avoir reçu.

## 2. Ce qui a changé, en une phrase

Le joueur **désigne deux empans** et la relation se **déduit** de leur dimension et de leurs valeurs ; la qualification est **neutre** (« …, au regard de l'article 7 »), le sens restant au contenu et à la réplique de l'avocat ; un article n'est **offert qu'une fois sa pièce livrée**.

## 3. L'invariant qui est tombé, et ce qui l'a remplacé

C'est le point à connaître avant de toucher quoi que ce soit.

> **Avant (§4.5)** — « Aucune tournure n'apparaît en cours de partie. »
> **Depuis** — « **La grammaire de comparaison est complète dès la première phrase. Les articles, eux, sont du contenu : ils arrivent avec le dossier.** »

Le retour 3 contredisait frontalement l'ancien invariant. L'arbitrage a été pris en connaissance de cause, et la distinction tient : les tournures de comparaison sont universelles, elles ne parlent d'aucune pièce ; **un article *est* une pièce**, et le Manuel du cas le filtrait déjà par livraison. L'incohérence réelle était de pouvoir invoquer un texte absent du manuel qu'on venait de consulter.

**Le coût, assumé et écrit dans les points ouverts :** en session 1 il ne reste qu'un article, donc la conclusion du tutoriel est un **choix forcé**. Le camouflage du vice ne repose plus que sur le choix des deux empans.

## 4. Les deux arbitrages pris avec l'auteur

- **Retour 2 — une tournure neutre par article.** Le moteur ne devine pas la conformité : il n'a pas à trancher une question de droit (invariant « l'IA informe, elle ne tranche pas »). C'est le **lien du contenu** qui sait, et **l'avocat qui le dit**. Bénéfice : la piste sans issue des scellés (« l'autre moitié de l'article 7 ») survit — elle serait morte si « contraire » avait été la seule lecture.
- **Retour 3 — masquer jusqu'à livraison**, plutôt qu'offrir puis refuser.

## 5. L'inventaire

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | **Réécrit d'abord, avant tout code** — méthode à conserver. §4.1 (la `valeur` porte la relation), §4.2 (colonne « ce qui se déduit »), §4.4 (le doublon banal porte désormais **tout** le camouflage), §4.5 (réécriture centrale + invariant remplacé + qualification neutre), §6, §7 (trois invariants ajoutés, un amendé, arbitrage 7, deux points ouverts), §8.8, §11, §14, §15, §16 |
| `app/moteur.js` | Trois fonctions neuves — `comparer()`, `deduire()`, `ordonner()` — et deux retouches : `reduire()` déduit sur un bloc `deduit`, `rendre()` écrit par le `patron` de la forme. **Rétrocompatible** : sans `deduit`/`deduction`/`patron`, comportement identique au 28 juillet |
| `app/index.html` | `piecesLivrees()` factorisée (dossier, Manuels, blocs) ; `blocsOfferts()` filtre par pièce livrée — **c'est le seul endroit où le retour 3 s'applique** ; `texteCompoPartiel()` montre « …et ? » tant que la paire n'est pas close. `JEU_EMBARQUE` aligné |
| `app/atelier_v3.html` | SEED : automate à deux termes (`t0`, `t1` avec `deduit`), trois liaisons-articles avec `piece`, formes avec `deduction`/`sens`/`patron` et **ordre de déclaration signifiant**. Diagnostic : quatre contrôles neufs (voir §6). `simComposable()` filtre par livraison |
| `app/content.js` | **Régénéré** par `npm run export:seed` |
| `tests/harnais.js` | `poserComparaison` connaît les deux grammaires ; **`livrerTout(w)`** neuf ; `phrasesBruit` demande la forme au moteur au lieu de la choisir ; **garde dans `terminer()`** — un contenu inclôturable échoue au lieu de pendre |
| les six suites | 32 + 31 + 20 + 72 + 33 + 67 = **255 contrôles, tous verts**, plus `verifier_content_sync.js` |

## 6. Les contrôles neufs du diagnostic

- forme `deduction:"ordre"` sans `sens` → avertissement ;
- bloc `piece` pointant une pièce inexistante → erreur ;
- dimension qu'aucune forme déductible n'accepte → avertissement ;
- **l'article livré trop tard** → **erreur**. Si toutes les phrases qui serviraient l'attente d'une session invoquent un texte livré *plus tard*, la session est **inclôturable**. C'est le piège que le retour 3 a introduit ; aucune relecture ne l'attrape, et une partie de test ne le révèle qu'après vingt minutes.

## 7. Les points de vigilance pour la suite

- **La relecture à l'œil a attrapé ce que 254 contrôles laissaient passer.** Le `patron` ne s'écrivait pas — un `continue` de trop dans `rendre()` — et les phrases sortaient sans verbe : *« l'heure d'arrivée de la patrouille l'heure des éclats de voix. »* Les formes réduites étaient justes, donc tout était vert. **Un test dédié existe maintenant**, mais la leçon vaut au-delà : après toute retouche du rendu, **relire les phrases**, ne pas se fier aux suites.
- **L'ordre de déclaration des formes est signifiant.** `identite_oui` doit rester **en tête** (l'égalité passe avant tout), et `identite_non` en queue. Réordonner, c'est changer le jeu.
- **`identite_oui` accepte les cinq dimensions**, pas seulement l'identité. Ce n'est pas un laxisme : sans ça, les deux remises au greffe à 15h10 et les deux « 2 » (équipages / véhicules) — des **doublons banals** — cesseraient d'être composables.
- **Le doublon banal porte maintenant tout le camouflage** (§4.4). Rapprocher deux empans affiche leur égalité ; si une dimension ne comptait qu'un doublon, il suffirait d'essayer les paires pour tomber sur le vice sans avoir rien compris. Le diagnostic le contrôle déjà — ne jamais le désactiver.
- **`renommerPiece` dans `test_declencheurs.js`** doit suivre **toutes** les références à une pièce, y compris `grammaire.blocs[].piece`. L'oubli ne fait pas échouer le test : il le fait **pendre**.

## 8. Ce qui reste ouvert

| Sujet | État |
|---|---|
| **La compréhension est-elle encore *exprimée* ?** | **Le vrai risque de cette session.** Le joueur n'affirme plus quelle relation lie deux empans, seulement lesquels rapprocher et sous quel texte. Un joueur qui rapproche deux empans au hasard obtient une phrase bien formée sans avoir rien pensé. **Non éprouvé — à regarder en priorité à la prochaine partie** |
| **Le choix forcé de la session 1** | Conséquence directe du masquage des articles. Acceptable pour un tutoriel, à re-regarder si une session future s'y retrouvait |
| Le critère qui décide de tout : une pensée ou un formulaire ? | Les phrases se lisent bien (*« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »*). Reste à juger **en jouant** |
| Le rythme des zones | Trois zones depuis le 28 ; densité de la colonne d'atelier non éprouvée |
| La majuscule en tête de phrase composée | Toujours non traité |
| La progression : sessions, portes, place de la Fin 3 | Le prototype s'arrête à deux sessions |
| `comment` en sixième dimension | Écarté, réintégrable — mais il faudrait lui donner une forme déductible (§6) |
| Le canal de révélation de la culpabilité | Toujours non tranché |

## 9. Prochaine étape

1. **Jouer `app/index.html` en `file://`**, de bout en bout, et répondre à la question du §8 : composer deux clics suffit-il à faire *penser*, ou est-ce devenu trop facile ? C'est la question que cette session a ouverte, et elle prime sur tout le reste.
2. Si la boucle tient : écrire la **session 3** et placer la porte de la Fin 3.
3. Si elle ne tient pas : le levier n'est plus la mécanique mais le **contenu** — plus d'empans par dimension, plus de doublons banals, pour que désigner la bonne paire redevienne un travail.

**Méthode à conserver, demandée par l'auteur :** toute évolution part de `docs/ARCHITECTURE.md`. On réécrit le document, on le fait relire, **puis** on applique au code.

**Amorce suggérée :** « Lis `docs/PASSATION.md` et `docs/ARCHITECTURE.md`. J'ai rejoué la tranche verticale après la refonte de la déduction ; voilà ce que ça donne. »

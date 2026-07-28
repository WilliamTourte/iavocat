# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 30 juillet 2026, après la session **« rien ne se dit qui ne soit fondé, et le dépôt se range »**.*

> Cette passation **remplace** celle du 29 juillet. Ce qui a été conservé intégralement, une fois de plus : les trois fins, les trois drapeaux, la frontière privé / transmis, les deux directives, le brouillard, la culpabilité comme plancher fixe, la sauvegarde de partie, le versionnage `schema` (toujours **3**). Ce qui a changé de nature, en revanche, c'est le **rangement** : la séparation contenu / moteur / atelier n'est plus une intention, c'est la disposition des fichiers.

---

## 1. D'où vient cette session

Quatre retours, dont un de fond sur la forme du dépôt.

1. **« Ça devient trop touffu. Est-ce qu'on est bien au clair entre harnais, moteur, grammaire, contenu ? »** — la vraie question de la session.
2. Rendre le **« cf article » obligatoire** : tout ce que l'IA dit doit être fondé. Et les articles peuvent **indiquer quel genre de relation** le joueur cherche.
3. **Harmoniser les articles** : contiennent-ils des empans, ou sont-ils de simples références ? L'article 12 en portait un, les articles 3 et 7 non.
4. Interface : **les pièces à gauche, les règles à droite** dans le dossier.

## 2. Ce qui a changé, en une phrase

Aucune phrase ne se clôt sans article — la relance *« dis-le-moi en droit »* passe de la bouche de l'avocat au composeur lui-même ; chaque article **annonce ce qu'il régit** sans rien filtrer, et **ne porte plus aucun empan** ; et le dépôt se range en quatre territoires nets, avec **un seul exemplaire de chaque chose**.

## 3. Le diagnostic du « touffu », et ce qu'on en a fait

C'est le point à connaître avant de toucher quoi que ce soit.

| Nature | Avant | Après |
|---|---|---|
| Le contenu de l'affaire | **3 exemplaires** — `SEED` (atelier), `JEU_EMBARQUE` (jeu), `content.js` | **1** — `app/content.js`, chargé par les deux pages |
| Les règles du jeu | **2** — les fonctions de `index.html` **et** les `sim*` de l'atelier, resynchronisées à la main | **1** — `app/regles.js`, appelé par les deux |
| La grammaire | 1 — `app/moteur.js` | 1 — inchangé |

`index.html` est passé de **938 à 655 lignes** et ne contient plus une seule règle : c'est de l'interface. `app/regles.js` (313 l.) est pur — pas de DOM, pas de `localStorage`, pas de fenêtre ; chaque fonction reçoit l'état `S` en argument explicite.

> **Ce que ça a supprimé pour de bon.** La checklist de resynchronisation du §15 faisait **dix-sept lignes** de « si tu modifies ceci, pense à modifier cela ». Elle en fait trois, et ce ne sont plus que des reflets **visuels** (la frise décrit-elle encore le déroulé en mots justes ?). On ne peut plus désynchroniser deux textes quand il n'y en a qu'un. Dans la foulée, `scripts/exporter-seed.js` et `tests/verifier_content_sync.js` ont disparu : ils existaient pour surveiller un écart qui n'existe plus.

**Le prix, assumé :** il n'y a plus de repli embarqué. Si `content.js` manque ou est d'un schéma inconnu, le jeu **ne joue rien** et affiche un bandeau qui nomme le cas. C'est voulu — un repli silencieux fait *jouer autre chose* sans le dire.

## 4. Les trois arbitrages pris avec l'auteur

- **Le « cf article » mord à la clôture**, pas à l'envoi. Le bloc *« — en rester là »* est retiré du contenu : une comparaison nue ne peut plus se clore. Faire porter la contrainte par la **grammaire** plutôt que par l'agacement de l'avocat déplace la leçon du reproche vers la forme — on n'apprend pas qu'on a mal fait, on constate que la phrase n'est pas finie.
- **`porte` est indicatif, jamais filtrant.** Un article annonce les dimensions qu'il régit (art. 3 → `quand`, art. 7 → `qui`+`quoi`, art. 12 → `combien`), affiché au Manuel et sur son bouton. Toutes les liaisons reçues restent offertes après toute comparaison. Deux raisons : si un mauvais article était refusé, il suffirait de les essayer tous pour trouver le bon sans avoir rien compris ; et dire qu'un texte ne s'applique pas *est* une question de droit, que le moteur ne tranche pas.
- **Un article est une référence pure.** L'invariant existait déjà au §4.5 (« une règle ne lit aucune dimension ») ; l'article 12 le violait seul, parce qu'un seuil se trouve être un nombre. La symétrie inverse était impossible — « des personnels **distincts** » n'est pas une valeur comparable. Le seuil a donc rejoint **le rapport du laboratoire**, qui cite la norme qu'il applique : raison du monde parfaite (§8.2).

## 5. Où le pressentiment a déménagé

Le point le plus délicat de la session, et il s'est bien terminé.

`vice_pressenti` se levait à la clôture d'une comparaison nue. Cette phrase n'existe plus — il fallait donc lui trouver un autre moment, et il en avait un meilleur : **l'instant où la comparaison s'affiche dans le composeur**, avant tout article. C'est là que le joueur *voit* que le releveur des traces et le préleveur de référence sont le même homme ; le reste n'en était que la transcription. Le drapeau **se dérive du terme emboîté de la conclusion** : aucune déclaration nouvelle dans le contenu.

Pressentir ne produit toujours rien : rien n'entre au journal, rien ne part. Les trois drapeaux et les trois fins sont intacts.

## 6. L'inventaire

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | §4.5 (le fondement obligatoire + `porte`), §4.7 (où se lève le pressentiment), §6 (les pièces, et pourquoi le seuil a déménagé), §7 (trois invariants ajoutés, arbitrage 7bis, deux points ouverts amendés), **§9 réécrit** (quatre territoires), **§10 réécrit** (le cycle, plus la chaîne), **§12 réécrit** (quatre sources, zéro copie), **§13 réécrit**, §14, **§15 fondu de 17 lignes à 3**, §16, §17 |
| `app/regles.js` | **NEUF** — les règles du jeu, pures. `creerRegles(JEU, M)` rend `etatInitial`, `blocsOfferts`, `clore`/`clorePhrase`, `envoyer`, `reponseAvocat`, `avancerSurAttente`, `cloturer`, `finir`, `pressentir`… |
| `app/moteur.js` | Une seule retouche, mais nécessaire : **`valider()` descend dans les termes emboîtés**. Sans elle, l'article obligatoire ouvrait un trou — `« affirmation »` est une catégorie que tout objet satisfait, y compris une comparaison refusée par la déduction, et la qualifier l'aurait **blanchie** |
| `app/index.html` | **938 → 655 lignes.** Plus de `JEU_EMBARQUE`, plus une seule règle : des enveloppes d'une ligne autour de `regles.js`. Dossier en **deux colonnes** (pièces / règles) ; `porte` affiché au Manuel et sur les boutons ; la relance *« Et donc ? au regard de quel texte ? »* sous la comparaison formée |
| `app/atelier_v3.html` | **2225 → 2072 lignes.** Plus de `SEED` : charge `content.js`. Les `sim*` sont devenus des **enveloppes de `regles.js`** sur le même état — plus de réimplémentation. Geste neuf : « Comparer (sans qualifier) ». Diagnostic : trois contrôles neufs (règle portant un empan → **erreur** ; `porte` absent → avertissement ; `porte` inconnu → **erreur**) |
| `app/content.js` | Les six liens sont désormais **tous des qualifications** ; `e_seuil` déménagé dans `p_adn` ; `porte` sur les trois articles ; bloc `pt` retiré ; répliques du labo et du brigadier réécrites |
| `tests/harnais.js` | `injecter()` inline **les trois** voisins ; `contenuLivre()` remplace `embarque()` ; **`comparaisons(w)`** neuf (les formes d'arité 2, où qu'elles vivent) ; `lienVice` lit le terme emboîté de la conclusion ; `phrasesBruit` emboîte sous un article livré |
| les six suites | 35 + 35 + 20 + 73 + 33 + 77 = **273 contrôles, tous verts**. Plus de septième contrôle |

## 7. Les points de vigilance pour la suite

- **`test_autre_affaire.js` n'a pas bougé d'une ligne, et c'est le contrôle qui compte.** Son affaire abstraite est écrite à l'ancienne — liaisons explicites, source `note`, clôture sans forme. Qu'elle reste verte prouve que le moteur **garde** ces capacités alors que le contenu livré ne s'en sert plus. Ne jamais les retirer du moteur sous prétexte que l'affaire du jour les ignore.
- **Les `const` de haut niveau ne sont pas des propriétés de `window`.** Piège rencontré deux fois en refactorisant : `const f = () => …` casse `w.f()` dans les suites jsdom, là où `function f(){}` fonctionne. Les enveloppes exposées aux tests doivent rester des **déclarations de fonction**.
- **La relecture à l'œil reste irremplaçable** (leçon du 29 juillet, toujours valable). Après toute retouche du rendu, relire les phrases composées. Les trois de l'affaire, aujourd'hui : *« l'heure d'arrivée de la patrouille précède l'heure des éclats de voix, au regard de l'article 3. »* / *« le releveur des traces sur la scène et le préleveur de l'échantillon de référence désignent la même chose, au regard de l'article 7. »* / *« la probabilité de coïncidence du profil est d'un tout autre ordre que le seuil probatoire réglementaire, au regard de l'article 12. »*
- **L'ordre de déclaration des formes est signifiant.** `identite_oui` en tête, `identite_non` en queue. Inchangé, et toujours vrai.
- **`rep_inutile` est devenu du filet.** L'escalade des comparaisons nues n'a plus de déclencheur dans cette affaire, puisqu'aucune ne peut se clore. Le moteur la garde pour une affaire écrite autrement ; c'est `rep_sans_rapport` qui monte désormais.
- **Le doublon banal porte toujours tout le camouflage** (§4.4). Ne jamais désactiver son contrôle.

## 8. Ce qui reste ouvert

| Sujet | État |
|---|---|
| **La compréhension est-elle encore *exprimée* ?** | **Toujours le vrai risque.** Le 30 juillet joue **dans les deux sens** : l'article obligatoire ajoute une décision (on ne peut plus s'en tirer par « en rester là »), mais `porte` en retire une part en annonçant la dimension que chaque texte gouverne. **Non éprouvé — à regarder en priorité en jouant** |
| **Le choix forcé de la session 1** | Aggravé, et assumé : le bouton unique de l'article 3 est maintenant le **seul** moyen de clore une phrase en session 1. C'est peut-être la façon la plus douce d'apprendre que rien ne se dit sans fondement — à juger en jouant |
| Le critère qui décide de tout : une pensée ou un formulaire ? | Les phrases se lisent bien (voir §7). Reste à juger **en jouant** |
| La marge de bruit | **147** phrases sensées, fondées, sans lien, contre 6 liens déclarés. L'article obligatoire l'a *augmentée* — chaque paire × chaque article reçu |
| Le rythme des zones | Trois zones ; densité de la colonne d'atelier non éprouvée. Le dossier en deux colonnes devrait aider |
| La majuscule en tête de phrase composée | Toujours non traité |
| La progression : sessions, portes, place de la Fin 3 | Le prototype s'arrête à deux sessions |
| `comment` en sixième dimension | Écarté, réintégrable — il lui faudrait une forme déductible **et** un article qui le `porte` |
| Le canal de révélation de la culpabilité | Toujours non tranché |

## 9. Prochaine étape

1. **Jouer `app/index.html` en `file://`**, de bout en bout. Deux questions, dans cet ordre : *composer deux clics et un article suffit-il à faire penser ?* et *l'article obligatoire se lit-il comme une exigence de rigueur ou comme une formalité à cocher ?* C'est ce que cette session a ouvert, et ça prime sur tout le reste.
2. Si la boucle tient : écrire la **session 3** et placer la porte de la Fin 3.
3. Si elle ne tient pas : le levier n'est plus la mécanique mais le **contenu** — plus d'empans par dimension, plus de doublons banals, plus d'articles par session, pour que désigner la bonne paire *et* le bon texte redevienne un travail.

**Méthode à conserver, demandée par l'auteur :** toute évolution part de `docs/ARCHITECTURE.md`. On réécrit le document, on le fait relire, **puis** on applique au code.

**Amorce suggérée :** « Lis `docs/PASSATION.md` et `docs/ARCHITECTURE.md`. J'ai rejoué la tranche verticale après la refonte du fondement ; voilà ce que ça donne. »

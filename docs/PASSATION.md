# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 30 juillet 2026, second temps, après la session **« le premier geste : lire, extraire, répondre »**.*

> Cette passation **remplace** celle du matin du 30 juillet. Ce qui a été conservé intégralement, une fois de plus : les trois fins, les trois drapeaux, la frontière privé / transmis, les deux directives, le brouillard, la culpabilité comme plancher fixe, la sauvegarde de partie, le versionnage `schema` (toujours **3**), et le rangement en quatre territoires. Ce qui a changé de nature : **la première session n'enseigne plus qu'une seule chose.**

---

## 1. D'où vient cette session

Un seul retour de l'auteur, et il porte loin :

> « J'aimerais que le premier geste pour la 1ère remise soit que le joueur apprenne à lire un document, à en extraire des empans et à répondre à une question en se servant d'un empan. L'aspect “comparaison” de 2 champs ne viendrait qu'en remise 2. »

Le diagnostic derrière : l'ancienne session 1 demandait **le geste complet** — retenir deux empans, laisser la relation se déduire, invoquer l'article. Trois apprentissages en un, dont aucun n'avait été enseigné séparément. C'était déjà, sous un autre nom, le « choix forcé de la session 1 » noté au §7.

## 2. Ce qui a changé, en une phrase

**Un fait se cite, une relation se fonde** — un empan seul se clôt désormais par sa citation, sans article ; la comparaison n'arrive qu'en session 2, avec l'article qui la fonde ; et l'avocat pose des questions, une à la fois, au lieu d'attendre une seule phrase par session.

## 3. Les quatre décisions, prises avec l'auteur

C'est ce qu'il faut connaître avant de toucher quoi que ce soit.

1. **Trois sessions.** R1 lire/extraire/répondre (`p_pv`, `t_voisin`, **aucun article**) ; R2 comparer (`r_temoin`, l'article 3) ; R3 l'ADN et le vice, inchangé.
2. **Une réponse ne se clôt pas par un article.** Un empan *est* une déclaration attribuée (§4.1) : le désigner, c'est le citer, et le fondement est dans le geste. Ce qui n'a pas de fondement propre, c'est le **rapport** entre deux faits — il n'est écrit nulle part, c'est le joueur qui le soutient. L'invariant « rien ne se dit qui ne soit fondé » n'est pas affaibli, il est **dédoublé**.
3. **La réponse s'écrit par le nom ET la citation**, avec la pièce : *« l'heure d'arrivée de la patrouille : « nous étions sur les lieux à 22h04 » (PV). »* C'est le seul endroit où un empan se lit deux fois dans une même phrase. Une comparaison, elle, ne s'écrit **que** par les noms.
4. **Une remise attend une liste**, servie dans l'ordre. L'ancienne forme (`attend`/`apres` sur la remise) se lit comme une liste à un élément — c'est ce qui garde `test_autre_affaire.js` vert sans qu'une ligne bouge.

## 4. Le dialogue de la session 1, tel qu'il tourne

```
[Maître Auber] …montre-moi que tu sais lire un dossier. Deux pièces, trois questions.
[Maître Auber] Le procès-verbal, d'abord. À quelle heure la patrouille est-elle arrivée ?
        [IA] ⟨ envoyé : l'heure d'arrivée de la patrouille : « nous étions sur les lieux à 22h04 » (PV). ⟩
[Maître Auber] 22h04. L'heure des services — c'est celle qui fait foi, retiens-la.
[Maître Auber] Bien. Toujours au procès-verbal : combien d'équipages ont été engagés ?
        [IA] ⟨ envoyé : le nombre d'équipages engagés : « deux équipages » (PV). ⟩
[Maître Auber] Deux. Ça n'a l'air de rien — retiens quand même que ce genre de chiffre se retrouve ailleurs…
[Maître Auber] Passons à l'audition du voisin. À quelle heure situe-t-il ces éclats de voix ?
        [IA] ⟨ envoyé : l'heure des éclats de voix : « J'ai entendu des éclats de voix vers 22h30 » (audition). ⟩
[Maître Auber] « Vers » 22h30. Un témoin arrondit ; un procès-verbal, non.
[Maître Auber] Tu sais lire, c'est déjà ça. Et tu as maintenant les deux heures sous les yeux…
               Voilà l'article 3 : je ne te demande plus ce qui est écrit, je te demande ce que tu en tires.
```

**Le point à ne pas manquer :** les deux questions d'horaire font extraire, sans le dire, **exactement la paire que la session 2 demande de comparer**. Quand l'avocat dit « tu as les deux heures sous les yeux », elles y sont, mises là par le joueur lui-même. La leçon se pose au lieu d'être annoncée.

Les trois questions couvrent trois dimensions (`quand`, `combien`, `quand`) et les deux pièces. La deuxième a changé **en cours de session, à la relecture à l'œil** : elle portait sur la porte, et la phrase bégayait — *« la porte de l'appartement : « la porte de l'appartement ne portait aucune trace… » »*, le `nom` reprenant le début de la citation. Leçon confirmée une fois de plus : **relire les phrases composées après toute retouche.**

## 5. L'inventaire

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | **§3 réécrit** (trois sessions, ce que chacune enseigne, le prix des questions fermées) ; **§4.5** — sous-titre neuf *« Un fait se cite, une relation se fonde »*, et l'amendement franc sur le second empan conditionné ; §4.6 (une réponse citée entre au plan, et pourquoi) ; §4.7 (une citation ne lève aucun drapeau) ; §6 (la lecture du tutoriel ; la contradiction passe en session 2) ; §7 (invariant dédoublé, arbitrage 7ter, le choix forcé **refermé**, un point ouvert neuf) ; §11 (`attentes`, `cite`, `court`) ; §14 (la retouche du rendu, la marge) ; §15 ; §16 ; §17 |
| `app/moteur.js` | **Une seule addition** : une liaison `cite` réécrit le fragment du terme qui la précède — nom, citation, pièce. Symétrique de la fusion par `patron`. `valider` n'a **rien** eu à apprendre : une forme d'arité 1 sur terme atomique était déjà validable |
| `app/regles.js` | `attentesDe` / `attenteCourante` / `remiseCourante` — la normalisation en **un seul exemplaire**, que le harnais et l'atelier appellent au lieu de la recopier. `envoyerRemise` pose la première question ; `avancerSurAttente` pose la suivante ou passe la remise ; `instructionComplete` exige toute la liste. `reponseAvocat` distingue **trois** échecs au lieu de deux. **Aucun nouveau champ d'état pour la progression** : `S.satisfaits` suffit, donc la sauvegarde n'a rien à migrer |
| `app/content.js` | Le bloc `c0` (liaison de citation, `cite:true`, qui ne s'écrit pas elle-même) ; `t1` conditionné à `r_temoin` ; la forme `citation` ; **trois remises**, la première avec ses trois attentes ; trois liens de citation ; `avocat.rep_hors_sujet` |
| `app/index.html` | `CHAMPS` porte le `court` ; l'aide du composeur distingue les deux voies ; **la relance « Et donc ? » ne s'affiche plus sur la voie réponse** (gatée sur `imbrique`) ; la question en cours est rappelée au-dessus du composeur, parce qu'elle défile hors du fil |
| `app/atelier_v3.html` | `empansPlats()` gagne `nom` **et** `court` — voir le bug ci-dessous ; la frise édite une **liste d'attentes** (question, tag, `apres`, ajout/retrait) ; `simComposable` accepte une citation sans article ; le pas-à-pas dit **« Répondre (citer) »** au lieu de « Composer » ; le diagnostic contrôle la liste, la question sans tag, et le **bloc** livré trop tard (plus seulement l'article) |
| les six suites | 38 + 45 + 20 + 94 + 33 + 79 = **309 contrôles, tous verts** (273 avant) |

> **Bug latent corrigé au passage.** `empansPlats()` de l'atelier n'exposait pas `nom`, là où `index.html` le fait. `nomDe` retombait donc sur `texte` : **le banc d'essai écrivait les phrases par leur citation quand le jeu les écrit par leur nom.** Deux exemplaires qui divergeaient en silence — exactement ce que la session du matin avait chassé, et qui était passé au travers.

## 6. Les points de vigilance pour la suite

- **`test_autre_affaire.js` n'a toujours pas bougé d'une ligne, et il reste le contrôle qui compte.** Son affaire abstraite emploie l'ancienne forme `attend`/`apres`, des liaisons explicites et la source `note`. Qu'elle reste verte prouve que la liste d'attentes est une **généralisation** et non un remplacement.
- **Le flag `cite` est porté par la LIAISON, pas par le terme.** C'est délibéré : `t0` est partagé par les deux voies, et un flag posé sur lui fuirait dans la comparaison (le `patron` le masquerait, mais seulement tant que toutes les formes déduites en ont un).
- **`blocsOfferts` filtre désormais aussi un bloc de terme.** L'index `iBloc` de `poserBloc` reste **positionnel dans la liste filtrée**, donc dépendant de la session : à l'état S1, session 1 → `[c0]` ; session 2 → `[c0, t1]`. Toute suite qui coderait un index en dur casserait.
- **Les `const` de haut niveau ne sont pas des propriétés de `window`.** Piège toujours valable pour les enveloppes exposées aux tests.
- **La relecture à l'œil reste irremplaçable**, et cette session vient encore de le prouver (§4).
- **Trois escalades, pas deux.** `rep_inutile` (comparaison nue — toujours du filet, jamais déclenchée dans cette affaire), `rep_sans_rapport` (article mal rattaché), `rep_hors_sujet` (citation qui ne répond pas). C'est l'**emboîtement** du premier terme qui sépare les deux dernières, pas l'arité.
- **Le doublon banal porte toujours tout le camouflage** (§4.4). Ne jamais désactiver son contrôle.

## 7. Ce qui reste ouvert

| Sujet | État |
|---|---|
| **Une question posée guide-t-elle trop ?** | **Le risque neuf, et la priorité.** La session 1 dit nommément quoi chercher, trois fois — l'invariant « la compréhension doit être *exprimée*, pas supposée » suppose l'inverse. Deux choses à regarder en jouant : la réponse par citation se lit-elle comme une **réponse** ou comme la redite de la question ; et le joueur qui arrive en session 2 a-t-il appris à lire, ou seulement à obéir ? **Non éprouvé** |
| **La compréhension est-elle encore *exprimée* ?** | Toujours ouvert, et le découpage joue dans les deux sens : la session 2 ne demande plus rien nommément et n'a plus à porter deux leçons à la fois, mais la session 1 vient d'ajouter une béquille. **Non éprouvé** |
| ~~Le choix forcé de la session 1~~ | **Refermé.** La session 1 n'a plus d'article du tout, et n'en demande aucun |
| Le critère qui décide de tout : une pensée ou un formulaire ? | Les phrases se lisent bien (§4). Reste à juger **en jouant** |
| La marge de bruit | Grandie, et d'une nature de plus : chaque empan est citable seul (24 phrases de plus), mais une citation ne se fonde que sur elle-même — les citer toutes ne dit rien de plus que les avoir lues. La suite la **mesure** au lieu de la figer dans un nombre |
| Le rythme des zones | La colonne d'atelier porte une ligne de plus (le rappel de la question). Densité toujours non éprouvée |
| La majuscule en tête de phrase composée | Toujours non traité |
| La progression : sessions, portes, place de la Fin 3 | **Trois** sessions désormais. La porte de la Fin 3 reste à placer |
| `comment` en sixième dimension | Écarté, réintégrable |
| Le canal de révélation de la culpabilité | Toujours non tranché |

## 8. Prochaine étape

1. **Jouer `app/index.html` en `file://`**, de bout en bout, et juger la session 1 avant tout le reste : *la réponse par citation répond-elle, ou reformule-t-elle ?* et *la session 2 se lit-elle comme « maintenant, mets-les en rapport » — la leçon a-t-elle porté ?* C'est ce que cette session a ouvert, et ça prime sur tout.
2. Si la boucle tient : écrire la **session 4** et placer la porte de la Fin 3.
3. Si la session 1 guide trop, le levier est simple et n'exige **aucune ligne de code** : retirer les `question` une à une. Une attente sans question se comporte exactement comme avant — l'avocat attend une phrase sans la demander. C'est le premier réglage à essayer avant de toucher à la mécanique.

**Méthode à conserver, demandée par l'auteur :** toute évolution part de `docs/ARCHITECTURE.md`. On réécrit le document, on le fait relire, **puis** on applique au code. *(Cette session a écrit le document d'abord, puis enchaîné le code sans point d'arrêt, l'auteur ayant demandé d'aller au bout. Le document reste donc à relire, et le code s'ajustera si la relecture change quelque chose.)*

**Amorce suggérée :** « Lis `docs/PASSATION.md` et `docs/ARCHITECTURE.md`. J'ai joué la session 1 après le découpage en trois ; voilà ce que ça donne. »

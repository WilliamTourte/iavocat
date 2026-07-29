# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 31 juillet 2026, après la session **« le clic en trop, et le geste montré »** — qui prolonge celle du 30 juillet, second temps, **« le premier geste : lire, extraire, répondre »**. Les §1 à §7 restent ceux du 30 ; **le §9 dit ce que le 31 a changé**, et c'est lui qu'il faut lire en premier.*

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

---

## 9. La session du 31 juillet — le clic en trop, et le geste montré

Deux retours de l'auteur, qui se rejoignent : *« il faut enlever la double confirmation quand on répond aux questions simples »*, et *« pourrait-on inventer une surcouche tutoriel pour la toute première question, en surlignant là où il doit cliquer ? »*

### Ce qui a changé

**1. Une suite unique n'est pas un choix** (§4.5 d'ARCHITECTURE). Quand l'état où un terme vient d'arriver n'offre **qu'une** liaison, qu'elle clôt et qu'elle n'emboîte rien, elle se pose d'office. En session 1, cliquer la puce mémoire écrit donc la phrase et la referme : le bouton *« Répondre — citer ce passage »* n'apparaît plus. Répondre à une question simple demande **trois** gestes au lieu de quatre.

- La règle est **structurelle** : un compte, un type, un état final. Elle ne lit ni `cite`, ni aucun identifiant, ni aucun contenu.
- **`imbrique` en est exclu, et c'est le point qui compte.** Même quand un seul article est reçu, il ne se pose jamais tout seul : invoquer un texte est un acte, et la relance *« et donc ? au regard de quel texte ? »* doit rester posée.
- Elle **s'éteint en session 2** : l'article 3 reçu, l'état offre deux suites (citer, ou rapprocher un second passage), le bouton revient. Vérifié à l'œil en vrai navigateur.
- *« Composer et envoyer restent deux gestes »* est **intact** : ce qui disparaît est un clic de composition, jamais l'intervalle. La Fin 2 n'a pas bougé.

**2. Le tutoriel du premier geste** (§4.8, section neuve). Un bandeau hors fiction, en bas de l'écran, et un halo qui se déplace sur quatre temps : la pièce jointe → **le texte** de la pièce → la puce mémoire → *« → Maître Auber »*. Il s'efface dès la première réponse envoyée et ne revient plus (clé `iavocat_tuto`, distincte de la sauvegarde de partie).

- **Le halo entoure la zone, jamais le bon empan.** C'est l'arbitrage central : pointer *« 22h04 »* serait la lampe torche que le §4.3 interdit. Tous les empans restent marqués à l'identique.
- **Il corrige un passage qui ne répond pas** (ajout de fin de session, sur retour de l'auteur). Halo ambre, bandeau ambre, *« Ce n'est pas ce qu'il demande. Relis sa question, et prends le passage qui y répond. »*, et le tutoriel **n'avance pas**. La distinction qui porte tout : *rien n'est empêché* — le passage se retient quand même, la phrase se compose, se clôt, s'envoie, l'avocat répond hors sujet ; ce que le tutoriel retient, c'est **son approbation**. Et il **ne dit jamais lequel c'était** : le halo ne bouge pas, aucun empan ne change de marquage, la phrase renvoie à la question et non à la réponse.
- **Le prix, inscrit noir sur blanc :** pour dire *« ce n'est pas ça »*, l'écran doit **savoir ce que c'était**. Il le dérive comme le harnais (tag de l'attente → lien → terme s'il est atomique), sans nommer aucune pièce. C'est le seul endroit du dépôt où l'interface connaît la réponse — pendant la première question, et pas une de plus. Une comparaison ne rend rien : le tutoriel ne juge que la citation, la seule chose qu'il enseigne.
- **Il ne décide rien** : son temps se dérive de `S` (`modalPiece`, `memoire`, `prete`), aucun champ d'état neuf, aucun changement au schéma 3. Une suite le prouve en comparant l'état de départ avec et sans lui.
- Il vit **entièrement dans `index.html`**, du même côté que la sauvegarde de partie, qui est déjà *« de l'écran, pas de la règle »*. Ses phrases ne sont pas du contenu : dans la fiction, personne n'explique rien (§8.6).
- Le halo se pose par **attribut** (`data-tuto`), jamais par une classe — la sérialisation le range en fin de balise et laisse les `class="…"` intactes, que des suites lisent au caractère près.

### L'inventaire de la session

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | **§4.5** — sous-titre neuf *« Une suite unique n'est pas un choix »* ; **§4.8 — section neuve**, *« Le premier geste, montré »* ; §7 (un invariant neuf, deux invariants amendés, arbitrage 7quater, le point ouvert « une question guide-t-elle trop ? » **chargé**) ; §9 (`index.html` porte aussi le tutoriel) ; §16 |
| `app/regles.js` | `cloreSansChoix`, appelée depuis `poserBloc` après un terme. **Rien d'autre** — et aucun nouveau champ d'état |
| `app/index.html` | Le bloc tutoriel (CSS `[data-tuto]` / `[data-tuto="alerte"]` + `#tuto`, `tutoAttendu`, `tutoEtape`, `majTutoriel`, la clé `iavocat_tuto`) ; `majTutoriel()` en fin de `rendreTout` ; `closeModal` rend désormais, parce que refermer est un geste comme un autre |
| `tests/harnais.js` | `composerLien` tolère la clôture automatique **sans cesser** de jouer le cas où le bouton existe ; `poserComparaison` devient une **sonde qui se défait** — sans quoi elle laissait une citation au journal en session 1 |
| les six suites | 38 + 45 + 20 + **110** + 33 + 79 = **325 contrôles, tous verts** (309 avant) |

### Points de vigilance qui s'ajoutent au §6

- **La règle de clôture automatique se déclenche sur un COMPTE de blocs offerts.** Toute affaire dont un état n'offre qu'une liaison finale non-`imbrique` la verra s'appliquer. C'est voulu, c'est universel — mais ça veut dire qu'ajouter ou retirer un bloc peut changer le nombre de clics ailleurs. `test_autre_affaire.js` n'a pas bougé (ses états offrent deux liaisons), et c'est lui qui le surveille.
- **Une sonde du harnais ne doit rien laisser au journal.** `poserComparaison` posait son premier terme avant de découvrir qu'elle ne pouvait pas continuer ; depuis que ce premier terme clôt une phrase, l'échec devait se défaire. Piège à connaître pour toute fonction de test qui « essaie » un chemin.
- **Le tutoriel a deux moitiés au temps 2**, et c'est délibéré : la modale couvre l'écran, il faut donc la refermer pour atteindre sa mémoire. Le bandeau affiche `2/4` dans les deux cas.
- **Le tutoriel se termine sur `S.satisfaits`, pas sur `S.plaidoirie`.** C'est ce qui lui permet de rester là quand une réponse hors sujet a été envoyée — la question n'est pas servie, donc la leçon n'est pas finie.
- **Au temps 3, le halo entoure la ZONE mémoire, pas une puce.** Si le joueur a retenu un mauvais passage avant le bon, pointer une puce désignerait laquelle des deux est la bonne — la lampe torche déplacée d'un cran.

### Ce que ça fait au point ouvert le plus chaud

**« Une question posée guide-t-elle trop ? »** — le 31 juillet **charge** ce point, il ne le referme pas. Au-dessus d'une question nommée, il y a maintenant un halo qui fait quatre pas à la place du joueur. Le halo ne désigne aucun empan, mais la question reste : *le joueur qui arrive en session 2 a-t-il appris à lire, ou seulement à obéir ?* Le levier de repli n'a pas changé et n'exige **aucune ligne de code** : retirer les `question` une à une, et couper le tutoriel avant le troisième temps.

**Prochaine étape, inchangée et maintenant plus urgente : jouer la session 1 en `file://`, à froid, et juger.** Le document du 31 juillet reste à relire — cette session a écrit le document d'abord, puis enchaîné le code, l'auteur ayant approuvé le plan en entier.

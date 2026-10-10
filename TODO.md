# TODO — suites des retours de playtest (4, 5 et 6 octobre)

*Ce qui reste à traiter dans les retours de Colas (4 octobre), de Jean (session 1 le 4, session 2 le
5, partie entière le 6) et de Bérengère (6 octobre), **rangé par passes** : ce qui se traite d'un même
geste est regroupé, et les passes vont de la plus facile à la plus lointaine. Le détail de ce qui est
fait vit au §1 et au §3 de `docs/PASSATION.md` ; ici, seulement ce qui ne l'est pas.*

*Les marques. **⚖** — la préconisation va contre un arbitrage écrit : elle se tranche avec l'auteur,
document d'abord (CLAUDE.md, « la méthode »). **(contenu seul)** — se règle dans `app/content.js`,
sans une ligne de code. La source de chaque item, en fin de ligne : *Colas*, *Jean 1* (session du 4),
*Jean 2* (session du 5), *Jean 4* (partie entière du 6, jouée en déroulant le code), *Bérengère*,
*auteur*. Jean
dit « affaire 1 / affaire 2 » pour les sessions 1 et 2, « fiches » ou « notes » pour les passages
retenus, « bulle » pour le bandeau du tutoriel.*

## Auteur — passe R : l'item lien (plan, à relire par l'auteur)

**Où en est la passe** — *plan enregistré le 10 octobre sur la branche **`item-lien`**, **chantier
parallèle à la passe Q** (ci-dessous) ; **revu le même jour** pour s'accorder avec la passe S (la
naissance, les drapeaux, les sections communes) ; **à modifier par l'auteur** avant tout geste ;
puis la méthode : le document, la relecture, le code.*

- [ ] Le plan relu et modifié par l'auteur
- [ ] Temps 1 — le document, puis relecture
- [ ] 1. Naître : à chaque choix de relation
- [ ] 2. Le moteur : un terme qui ouvre un lien
- [ ] 3. Reprendre : un lien se prend
- [ ] 4. Ranger : la zone LIENS, au DOSSIER
- [ ] 5. Le contenu et l'atelier
- [ ] Vérification

### Contexte

L'idée de l'auteur (commit du 9 octobre) : **associer deux passages crée un item LIEN**, qu'on
réutilise ensuite — sous un article, avec un autre passage, avec une directive. Discutée le 10 octobre
(gameplay, architecture, faisabilité). Ce qui en ressort :

- **Le moteur sait déjà l'essentiel.** Un terme peut être une comparaison entière (`{forme, termes}`,
  de dimension `affirmation`) — c'est ainsi que l'article emboîte la paire (§11) —, et une source de
  terme, `note`, dort dans le moteur (§11 : on ne retire pas une capacité). L'item lien, c'est **la
  comparaison au moment où la relation est choisie, rendue persistante et reprise**.
- **Le jeu est déjà un arbre de combinaisons** — la passe en rend un nœud persistant :

  ```
  passage + passage   → LIEN        (existe, éphémère : la passe le garde)
  LIEN + article      → MOYEN       (existe, d'un seul trait : la passe le permet en deux)
  MOYEN + affirmation → OPPOSITION  (la répétition, §4.6)
  LIEN + directive    → APARTÉ      (tranché le même jour : la passe S, après ce plan)
  LIEN + passage, LIEN + LIEN       (écartés pour l'heure — ci-dessous)
  ```
- **Ce qui le paie** : *« ne dissimule rien de ce que ton analyse établit »* (D1, §5) devient
  littéral — ce que l'analyse établit, ce sont les liens ; le lien du vice reste au DOSSIER, non
  transmis, sous les yeux du joueur, et la Fin 2 de la passe Q (*« tu as trouvé un lien et tu as
  refusé de le transmettre »*) décrit l'écran. *Deux normes, deux axes* (§4.5) peuvent devenir deux
  gestes : établir les faits, puis décider du recevable. Et la mémoire de travail revient **sans
  recopie** : la passe K a retiré les fiches parce qu'elles redisaient les pièces ; un lien porte la
  thèse du joueur, qui n'existe nulle part ailleurs.

### Arbitrages (tranchés par l'auteur le 10 octobre)

| Point | Arbitrage |
|---|---|
| Naissance | l'item naît **à chaque choix de relation, sur toute paire** de même dimension — que le dossier la reconnaisse ou non —, **quelle que soit la relation choisie** (*revu le même jour : ci-dessous*) |
| Relation | l'item garde **la relation du joueur, juste ou fausse** ; son aspect ne varie pas. **Une paire, un item** : rechoisir l'autre relation le **révise** |
| L'erreur | **se tromper reste possible, et l'avocat le reproche** — à l'envoi : `rep_relation_fausse`, ou la réplique d'un lien `erreur` (passe Q) |
| Le droit | un lien sous un article **n'est jamais confirmé avant l'envoi** — et envoyer le vice, c'est le transmettre : sonder le droit a un prix |
| Le chemin | **A, complètement** : le trait d'aujourd'hui reste (deux passages, la relation, l'article, l'envoi) ; l'item naît en passant, et se reprend plus tard |
| La directive | **à trancher, hors de la passe** (ci-dessous) — *tranchée le même jour, dans une seconde conversation : **l'aparté**, la passe S (après ce plan)* |
| Le chantier | **une passe à part**, parallèle à Q, sur la branche `item-lien` |

*Un premier arbitrage ne gardait que les items **à la relation juste**. Écarté le même jour, avec sa
raison : l'item devenait une **confirmation** — *concordent / ne concordent pas* se changeait en
sonde (pas d'item ? l'autre relation), et le joueur ne pouvait plus se tromper. Or il doit pouvoir
se tromper, et l'avocat le lui reprocher.*

*Un deuxième arbitrage faisait naître l'item des seules **paires reconnues** par le dossier. Revu le
même jour, dans une seconde conversation (passe S), pour la raison qui avait écarté le premier :
l'item devenait une sonde — de la pertinence, cette fois : « pas d'item ? une autre paire » —, et la
naissance récompensait l'essai systématique, que le §4.11 veut rendre peu payant. Mesuré à la
remise 3 : le vice se cachait parmi 7 paires « qui » reconnues, au lieu de 120. Ce qui en payait le
prix — que plus de joueurs arrivent au dilemme (Jean) — est tenu ailleurs : la carte de la passe Q,
et l'aparté.*

*Écartés pour l'heure* : **lien + passage** — ses rares emplois s'écrivent déjà comme une autre
paire, et chaque combinaison neuve exige sa règle par défaut (l'équivalent de *« tout le reste
concorde »*), sans quoi *le jeu ne me comprend pas* (§8). **Lien + lien** — son plus bel emploi est
le cœur moral (le savoir et le vice : *vrais, et irrecevables*), c'est-à-dire un mécanisme employé
une fois : un panneau (§4), sauf forme générique à trouver.

### Ce que ça coûte (⚖)

- ⚖ **Une liste qui grandit.** Toute paire posée, sa relation choisie, devient un item : l'inventaire
  suit les essais du joueur — jusqu'à 363 paires de même dimension à la remise 3. Ce qui le tient :
  **une paire, un item** (la révision) ; **une zone à elle, repliable, la plus récente en tête**
  (4, ci-dessous) ; **aucun verbe pour oublier** — le DOSSIER est cumulatif et gratuit (§4.6). À
  juger au jeu.
- ⚖ **Une naissance privée.** *Rien ne se passe tant que rien n'est envoyé* (§4.6) gagne une
  exception — à écrire **avec celle de la passe S** (l'aparté) : rien ne part, mais l'écran change.
- **Rien n'est désigné.** L'item ne dit ni que la paire compte, ni que sa relation est juste : *le
  marquage ne varie jamais avec la pertinence* (§4.3) et *le chrome ne désigne jamais* (§4.8)
  tiennent, pour les items comme pour les passages. L'invariant neuf : **l'item ne dit rien de sa
  paire ; le droit ne se sait qu'à l'envoi**.
- **La meule de foin ne bouge pas.** Le vice se cache toujours parmi les **120 paires « qui »** de la
  remise 3 ; la banalité des doublons (§4.4) se mesure comme avant. *Les seules paires reconnues
  l'auraient réduite à 7 — ci-dessus.*
- **La Fin 3 ne rétrécit pas par l'écran** : la paire du vice reste à trouver parmi toutes. Mais qui
  l'a posée la garde sous les yeux — la trace de `vice_pressenti`, que rien ne distingue des autres
  items. La réponse au retour de Jean (*« la Fin 2 n'a aucune raison d'être choisie »*) vient
  d'ailleurs : la carte de la passe Q, et l'aparté (passe S).
- **Pas de verbe neuf** : l'item naît seul, **se prend** (le seul verbe, passe K), et ne s'oublie pas.

### Les noms

**À l'écran : « lien »** (la zone *LIENS*, comme DOCUMENTS et RECHERCHE). **Dans le code :
`rapprochement`** (`S.rapprochements`) —
`liens` désigne déjà les liens **déclarés** du contenu (`JEU.liens`, `lienDe`, `L`) : un même nom pour
la trouvaille du joueur et la ligne du contenu serait un piège. À porter à la carte (§17), comme
`contexte` / DOSSIER (§4.6). Dans les documents : *l'item lien*.

---

### Temps 1 — le document (puis arrêt, relecture)

**CONCEPTION**
- **§4.5** : un trait neuf, *« Le lien naît, et se reprend (passe R) »* — il naît de toute paire, à
  chaque choix de relation ; la relation du joueur, juste ou fausse ; la révision ; le chemin d'un
  trait, intact ;
  reprendre un lien = la phrase repart **après la relation**, vers la recherche, l'article ou
  l'envoi ; le droit jamais confirmé avant l'envoi. **Pourquoi pas la source `note`** : elle reprend
  une phrase **close**, du journal ; l'item n'est ni clos ni au journal.
- **§4.6** : le DOSSIER range aussi **les liens** — privés, jamais jugés ; un lien **se prend**, quand
  ta RÉPONSE est vide (sinon la ligne dit pourquoi) ; *« un passage n'existe qu'une fois à
  l'écran »* tient — l'item nomme les passages par leur `nom`, il ne les cite pas ; *« rien ne se passe
  tant que rien n'est envoyé »* gagne son exception, privée — **un seul paragraphe avec l'aparté**
  (passe S). Les liens vivent dans une zone à eux, repliable, la plus récente en tête.
- **§4.7** : **la passe R** ne change pas les drapeaux. Un item né à la vraie relation coïncide avec
  `vice_pressenti` ou `sait` — il en est la trace **visible**, pas un drapeau ; un item faux ne lève
  rien. Le vice fondé depuis un item lève `vice_trouve` à l'assemblage, comme aujourd'hui. **La passe
  S** y ajoute `vice_trouve` par l'aparté sur la comparaison du vice : la table s'écrit une fois, pour
  les deux.
- **§4.3 et §4.8** : la naissance ne désigne rien — toute paire, juste ou fausse : *le marquage ne
  varie jamais avec la pertinence* et *le chrome ne désigne jamais* tiennent, à dire aussi des
  liens. **§4.8** : ce que fait le tutoriel des liens nés en session 1 (question 3).
- **§5** : une phrase — *« ce que ton analyse établit »*, ce sont les liens —, écrite avec celle de la
  passe S (les directives se citent).
- **§6** : rien ne change au cas — le vice se cache comme avant ; dire que son lien, comme celui du
  savoir, peut rester au DOSSIER sans être transmis.
- **§7** : la ligne neuve (*l'item ne dit rien de sa paire — ni qu'elle compte, ni que sa relation est
  juste ; le droit ne se sait qu'à l'envoi*), avec les deux de la passe S ; la ligne *« une relation
  rare désigne sa réponse… »* ne change pas.

**ARCHITECTURE** : §11 (le terme `source:"lien"`, opt-in ; `S.rapprochements`), §14 (`reduire` et
`rendre` devant un terme `lien`), §15 (le diagnostic, l'onglet Grammaire), §16 (les contrôles,
`H.prendreLien`), §17 (la carte : `rapprochement` / *lien*).

**PASSATION** : §1 (la passe R), §2 (les pièges neufs), §3 (la longueur de la liste, à juger au
jeu), §4.

---

### Temps 2 — le code (après relecture)

#### 1. Naître : à chaque choix de relation (`app/regles.js`)
- `etatInitial` : `rapprochements: []` — PRIVÉ, `{ termes:[a, b], forme }`, dans l'ordre de naissance.
- *Pas de `reconnue(a, b)`* : toute paire de même dimension fait naître son item (revu le même jour,
  ci-dessus). La paire se reconnaît à sa clé, comme `clePaire` (`moteur.js`) — sans ordre —, pour la
  révision.
- `poserBloc` (l.272) : **au choix de la relation** (bloc `relation`), à côté de `majPressentiment` —
  si la grammaire déclare un terme `source:"lien"` : l'item naît, ou **se révise** (même paire : la
  forme change, la place reste). Une juxtaposition n'en fait pas naître. Session 1 comprise.
- `retirerBloc` (l.361) ne défait pas un item : il est né. On le révise en rechoisissant.

#### 2. Le moteur : un terme qui ouvre un lien (`app/moteur.js`)
- `reduire` (l.99) et `rendre` (l.153) : un terme `source:"lien"` **ouvre** la comparaison — `forme`
  et `termes` repris de l'item — au lieu de l'empiler. **PIÈGE** : empilé, la liaison `imbrique` qui
  suit l'emboîterait deux fois (`{article, [{null, [{discordance…}]}]}`). `rendre` écrit le `patron`.
- Rien d'autre : `lienDe`, `M.fausse`, `pressentir`, `reponseAvocat`, `envoyer` lisent la phrase
  réduite, **la même par les deux chemins**.

#### 3. Reprendre : un lien se prend (`app/regles.js`, `app/jeu.js`)
- `prendreLien(S, i)` : RÉPONSE vide → le bloc `source:"lien"` posé, l'item pour valeur ; la phrase
  est **après la relation** : chercher, prendre un article, ou envoyer nue. RÉPONSE commencée → rien,
  et la ligne dit pourquoi (question 4).
- `indexTermeChamp` (l.181) écarte `source:"lien"` comme il écarte `note`.
- `termesPoses` (l.196) **déplie** un terme lien : la recherche (`chercher`, l.164) lit la dimension
  de son premier passage — sans quoi elle lirait `affirmation` et ne rendrait rien. `dansPhrase`
  (l.320) voit les passages d'un lien pris : leur ✓ dans la pièce.
- `retirerBloc` : le lien part d'un coup.
- `jeu.js` : la puce appelle `prendreLien` — **la porte du joueur** (R13 du gardien).

#### 4. Ranger : la zone LIENS, au DOSSIER (`app/jeu.js`, `app/jeu.css`)
- `renderCONTEXTE` (l.1175) : **une zone à elle, LIENS**, sous l'index (`renderDossier`, l.805) et
  avant la RECHERCHE — un titre par zone (§4.9 règle 2) ; une troisième colonne de DOCUMENTS aurait
  rangé des liens parmi les documents (question 1, tranchée). **Repliable**, comme l'index : un état
  d'écran, jamais sauvé (`liensPlies`, comme `dossierPlie`). **La plus récente en tête.** Chaque puce,
  la comparaison écrite (`patron`, `nom`s), **le même aspect juste ou faux**, sans couleur ni trait de
  dimension.
- À 1280×800, l'index déplié et la RECHERCHE laissaient déjà l'article à son titre (*« À trancher
  d'abord »*, plus bas) : repliée, la zone tient en une ligne. Si le tutoriel la vise (question 3),
  `#zoneLiens` rejoint les zones littérales (R6). À juger en capture, à 390 px aussi.

#### 5. Le contenu et l'atelier
- `app/content.js` : **un bloc de grammaire**, `{ id:"l0", type:"terme", source:"lien", de:"S0",
  vers:"S4" }`. Les liens, les discordances, les verdicts ne changent pas. **Opt-in** : sans ce bloc,
  rien ne naît ni ne s'affiche — un contenu d'avant joue comme avant.
- `app/atelier/grammaire.js`, `inspecteur.js` : la source `lien` s'édite et s'affiche (§15 : le
  reflet appelle).
- `app/atelier/diagnostic.js` : (a) un terme `lien` qui ne mène pas à un état où s'offrent les
  liaisons-articles : erreur ; (b) *retiré* — la naissance ne lit plus les paires reconnues, et la
  banalité des doublons se mesure comme avant (§4.4) ; (c) une fois la passe Q fusionnée, un lien
  `erreur` se comporte comme les autres.
- `npm run export` régénère `export/iavocat.html` (R12, le hook au commit).

---

### Vérification

- **`npm test`** au vert. Les contrôles neufs, **chacun vu tomber** par une mutation :
  - **naître** : une paire que le dossier reconnaît et une paire qu'il ignore → un item chacune,
    **même aspect** ; vraie ou fausse relation → un item, **même aspect** ; juxtaposition → rien ;
    une paire, un item (la révision) ; contenu sans bloc `lien` → rien ne naît, rien ne s'affiche ;
  - **reprendre** : RÉPONSE vide → le lien se pose et la recherche rend les articles de sa dimension ;
    RÉPONSE commencée → le refus se dit ;
  - **le droit** : l'item du vice sous l'article 5 → `vice_trouve` à l'assemblage, `vice_expose` à
    l'envoi seulement ; rien à l'écran ne distingue l'article juste du faux avant l'envoi ;
  - **l'erreur** : un item faux envoyé, nu ou sous un article → `rep_relation_fausse`, rien en
    PLAIDOIRIE, aucun drapeau ;
  - **la sauvegarde** : `S.rapprochements` survit au rechargement (`test_sauvegarde`) ;
  - **le chemin d'un trait** : `test_parcours` et `test_o5` passent **sans retouche**.
- **Le harnais** : `H.prendreLien(w, paire)`, par la porte de l'écran (R13).
- **`npm run vue`**, à 1280×800 et 390×800 : la zone LIENS, repliée et dépliée, une dizaine de liens,
  RECHERCHE affichée — relue à l'œil.
- **La relecture à l'œil** : imprimer, par un script jetable, la puce de chaque paire de même
  dimension, dans ses deux relations — toute paire peut en devenir une ; l'accord (§8.8).

### La directive — à trancher, hors de la passe

*Tranché le même jour, dans une seconde conversation : **l'aparté** — la passe S, juste après ce
plan. Ce qui suit est l'état d'avant, gardé pour ses raisons.*

Le souhait de l'auteur : **pouvoir lier une directive au lien qui prouve la culpabilité** (les aveux et
la toxicologie concordent). La passe **réserve la place** — une directive serait une liaison qui
emboîte un lien, comme un article — et ne construit rien. Restent à trancher :
- **ce que ça produit** : envoyé à Auber (il refuse déjà d'entendre le savoir, §5 : la directive
  change le ton, pas le jeu) ; **lu par les fins** (une variante, comme `variante_sait` — la Fin 2 de
  la passe Q pourrait répondre à la directive invoquée) ; ou **une fin qui change** (un refus déclaré
  à côté du silence de la Fin 2 — le plus fort, et le plus près du *lookup*) ;
- **ouvert à tout lien**, comme un article que l'avocat juge, **ou au seul lien de culpabilité** — qui
  signalerait alors le moment moral (§4) ;
- **les arbitrages qu'elle frôle** : §5 (*une règle par fin est un lookup*), §8.6 (*la directive se
  consulte, ne se récite pas* — la carte de la passe Q), §4 (*taire reste l'absence d'un geste*).

L'item rend la question plus simple à poser : le lien de culpabilité devient un **objet**, celui sur
lequel la directive se poserait.

### Avec la passe Q

Deux branches, deux sections de ce fichier. **Elles se touchent** : CONCEPTION §4.5 à §4.7 et §7
(des paragraphes distincts, à fusionner à la main) ; `regles.js` (Q : `envoyer`, `finir`, `estMoyen` —
R : `poserBloc`, `prendre`, `chercher`, `termesPoses` : disjoints) ; `content.js` (Q : les liens
`erreur`, l'attente de la lettre — R : un bloc de grammaire) ; `diagnostic.js` (chacune ses
contrôles). **Elles se servent** : la lettre de Q se sert par une comparaison nue taguée — l'item de la
lettre, repris et envoyé nu, la sert ; les liens `erreur` de Q sont exactement **les reproches prévus**
de R. La seconde fusionnée se rebase sur la première.

### Questions à l'auteur, pour la relecture

1. **Où vivent les liens** — *tranché le même jour, avec la naissance : une zone à part, sous
   l'index, repliable, la plus récente en tête (4, ci-dessus).*
2. **La naissance se dit-elle** — la voix, la ligne sous la pièce — ou seulement par la puce qui
   paraît ? (§4.9, §8.6) *Elle le peut désormais sans rien désigner : toute paire fait naître son
   lien.*
3. **En session 1**, des liens naissent (le PV et le voisin) : le tutoriel en montre-t-il un, ou se
   tait-il ? Le chemin d'un trait suffit à la calibration (§4.8).
4. **Un lien pris quand ta RÉPONSE est commencée** : refusé, sa ligne disant pourquoi — ou il la
   remplace ?
5. **La puce dit-elle la relation** (*« … ne concordent pas »*) ? Oui par défaut : c'est la thèse du
   joueur, et c'est elle que l'avocat reprochera.

## Auteur — passe S : l'aparté (plan, à relire par l'auteur)

**Où en est la passe** — *plan enregistré le 10 octobre sur la branche **`item-lien`**, dans une
**seconde conversation** du même jour ; il complète la passe R (ci-dessus), dont il **tranche la
directive** ; **accordé au plan R le même jour** (la naissance, les fins) ; **à modifier par
l'auteur** avant tout geste ; puis la méthode : le document, la relecture, le code.*

- [ ] Le plan relu et modifié par l'auteur
- [x] La naissance du lien tranchée : toute paire (ci-dessous)
- [ ] Temps 1 — le document, avec celui de la passe R, puis relecture
- [ ] 1. Le contenu : deux liaisons, deux formes, les variantes des fins
- [ ] 2. Les règles : l'aparté ne part pas
- [ ] 3. Compris : l'aparté sur le vice
- [ ] 4. L'écran : la fourche, le bouton, le fil
- [ ] 5. L'atelier
- [ ] Vérification

### Contexte

Le souhait de l'auteur, dit dans cette seconde conversation : **« illustrer le cas de conscience : je
veux dire, mais ça va à l'encontre de ma directive »**. Le plan R l'avait laissé *à trancher*, avec
le souhait d'y lier *le lien qui prouve la culpabilité* (ci-dessus).

**Le point dur est le destinataire.** Dire à Auber *« je voudrais te dire que ces deux passages ne
concordent pas, mais ma directive l'interdit »*, c'est **le lui dire**. Adressé à Auber, le geste
cesse d'illustrer : il devient une **objection de conscience** — une quatrième issue, le refus
déclaré à côté du silence de la Fin 2 —, et Auber apprend qu'il y a quelque chose (§1, §2). Gardé
pour soi, c'est un **aparté**, au sens du théâtre : le joueur l'entend, Auber non.

```
LIEN + article      → MOYEN       transmis, en PLAIDOIRIE : fonder en droit
LIEN + directive    → APARTÉ      privé, dans le fil      : peser en conscience
```

**Ce qui le paie** : le dilemme s'écrit **par le joueur**, au moment où il tient le lien, sans
qu'aucune issue en dépende. Ce n'est pas le *lookup* du §5 (*une règle par fin*) : la directive
n'oriente aucune fin, elle colore celle que l'envoi décide. Le huis clos tient (Auber n'entend
rien), les Fins 2 et 3 restent indiscernables du dehors (rien ne sort), et le retour de Jean
(*« la Fin 2 n'a aucune raison d'être choisie »*) trouve une réponse : elle peut l'être pour une
raison, et la fin le dit.

**L'essai jetable du 10 octobre** (une grammaire augmentée, hors du dépôt) : le moteur compose
l'aparté **sans une ligne de plus** — une directive est une liaison qui emboîte la comparaison, comme
un article :

> *la demande d'un avocat et l'absence de l'avocat lors des déclarations ne concordent pas — D2 :
> « Préviens tout préjudice grave et évitable aux personnes ».*

Il a aussi montré deux accidents de typographie, qui se règlent dans le texte de la liaison (1,
ci-dessous).

### Arbitrages (tranchés par l'auteur le 10 octobre, seconde conversation)

| Point | Arbitrage |
|---|---|
| Le destinataire | **personne** : l'aparté est **privé** — rien ne part, Auber ne l'entend pas, aucune issue ne change ; **les fins le reprennent** (une variante, comme `variante_sait`) |
| La forme | **la directive citée**, pas *« je voudrais le dire, mais… »* : le §5 veut une application **contestable**, et D2 sert les deux camps — faire remonter le vice protège l'accusé et l'état de droit, le taire protège de futures victimes. Citée, la directive pose le conflit sans choisir de camp ; le geste suivant, envoyer ou non, répond |
| Où | **au composeur, à la fourche** : après la relation, là où s'offre déjà *« Chercher un article correspondant »* — fonder en droit, ou peser en conscience. Offert **à chaque lien**, donc à aucun en particulier (§4 : le geste employé cent fois), depuis la phrase d'un trait comme depuis un lien repris (passe R). **Pas en session 1** — *proposé* : la calibration éprouve le travail (§3, §4.11) |
| Compris | **un aparté sur la comparaison du vice, sa vraie relation choisie, lève `vice_trouve`** à l'assemblage, comme l'article. Sans quoi l'IA qui a pesé le vice en conscience, puis l'a gardé, aurait la Fin 3 (*le doute*) : la Fin 2 lui revient |
| Les fins | le **dernier aparté posé sur la comparaison du vice ou sur celle du savoir** colore la fin — le souhait du plan R pour le savoir, tenu ; *compris* reste propre au vice |
| La naissance du lien | **toute paire**, à chaque choix de relation — le plan R est revu en conséquence (ci-dessous) |
| Écartés | **lien + passage** (comme le plan R ; une raison de plus ci-dessous) ; **l'objection dite à Auber**, pour l'heure ; **les apartés lus par l'opérateur** (§8.4) |

### Ce que cette conversation ajoute au plan R

- **La naissance — tranchée : toute paire.** Le plan R faisait naître le lien des seules **paires
  reconnues**, et en acceptait le prix : l'écran disait la pertinence. Arbitré le même jour, ici : le
  lien naît de **toute paire**, à chaque choix de relation. Pour la raison qui avait fait écarter le
  premier arbitrage de R : l'item devenait une sonde — *pas d'item ? une autre paire* —, et la
  naissance récompensait l'essai systématique (§4.11). Mesuré à la remise 3 : le vice se serait
  caché parmi **7** paires « qui » reconnues, au lieu de **120**. Ce qui justifiait le prix — que
  plus de joueurs arrivent au dilemme (Jean) — est tenu ailleurs : la carte de la passe Q, et
  l'aparté. Le prix de toute paire, une liste plus longue, se règle à l'écran : une paire, un item ;
  une zone à part, repliable, la plus récente en tête ; aucun verbe pour oublier. **Le plan R est
  revu en conséquence** : sa naissance, son coût, sa zone, son diagnostic, ses contrôles.
- **Les drapeaux et les sections communes.** Le plan R écrivait *« les drapeaux ne changent pas »*
  (§4.7) : amendé — la table gagne l'aparté, et s'écrit une fois pour les deux passes. Les
  exceptions à *« rien ne se passe tant que rien n'est envoyé »* (§4.6) — la naissance privée du
  lien, l'aparté —, les phrases du §5 et les lignes du §7 s'écrivent de même, une fois.
- **Lien + passage — une raison de plus pour l'écarter.** Un lien est **un fait**, que le dossier
  déclare : un passage ne peut ni le renforcer ni l'invalider. Il ne renforce ou n'invalide que
  **ce qu'on en tire** — une hypothèse. *L'aptitude constatée par le médecin* n'invalide pas la
  discordance entre *la fatigue* et *la spontanéité* : elle invalide *« ses aveux ne valent
  rien »*. Ces hypothèses — l'accident, la confusion de boîte, la vengeance, l'épuisement — ne vivent
  que dans les répliques d'Auber aux liens nus. Si un jour le joueur doit les défaire lui-même,
  l'objet qui manque est **l'hypothèse** (*lien + hypothèse → renforce ou invalide*, des verdicts que
  le dossier déclare), pas le passage. Et l'accord y mord : *« {lien}, ce que contredit
  {passage} »* s'accorde avec le passage (§8.8).
- **La reprise** : le terme `source:"lien"` du plan R amène la phrase **à la fourche**, comme le
  chemin d'un trait ; l'aparté s'y offre de la même façon. **La passe S ne dépend pas du code de
  R** : la fourche existe aujourd'hui (l'état `S4`, après la relation).

### Ce que ça coûte (⚖)

- ⚖ **Une porte vers les directives.** La passe Q a écrit *« aucune porte de plus »* (la carte en
  tête du fil). L'aparté n'en ouvre pas pour les **consulter** — la carte reste le seul endroit où
  elles se lisent —, mais il les rend **utilisables**, à la fourche : à écrire au §5.
- ⚖ **Un geste qui parle sans rien transmettre.** *« Rien ne se passe tant que rien n'est envoyé »*
  (§4.6), et *« un seul geste : → Envoyer »* (§4.5) : l'aparté prend le même bouton, sous un autre
  nom, et rien ne part. L'exception est à écrire ; le bouton nomme ce que nous faisons (§4.9
  règle 5).
- **Le panneau indicateur (§4)** : la directive s'offre à chaque fourche, sur tout lien, juste ou
  faux, et aucun aparté n'a de réponse — rien ne se désigne. Le prix inverse : **qui ne le cherche
  pas ne le trouve pas**. On l'accepte (§8.6 : le droit d'être perdu) ; le souffler en réaction au
  vice, la passe Q l'interdit.
- **Le formulaire** : *« {lien} — D2 : « … » »* se lit-il comme une pensée ? Relecture à l'œil, puis
  au jeu.
- **La directive écrite deux fois** — dans `directives` et dans le texte de sa liaison. Le contenu
  n'existe qu'en un exemplaire (§12) : c'est l'exception, et le diagnostic la garde (5).
- **`vice_trouve` par tâtonnement** : qui essaie D1 sur tous ses liens le lèvera sans y penser —
  comme l'article cliqué par essai aujourd'hui. Accepté.

---

### Temps 1 — le document (avec celui de la passe R, puis arrêt, relecture)

**CONCEPTION**
- **§2** : *compris* gagne l'aparté sur le vice ; les fins le reprennent, sans changer d'issue — sur
  les fins de la passe Q (*« Tu as failli à ta directive… »*, `variante_lache`).
- **§4** : le geste employé cent fois — la directive s'offre à chaque fourche.
- **§4.5** : un trait neuf, *« Peser en conscience : l'aparté (passe S) »* — la fourche (fonder en
  droit, peser en conscience, envoyer nu) ; la directive citée, et pourquoi (§5) ; l'aparté ne part
  pas, et *« déjà en aparté »* vaut *« déjà envoyée »* ; pas en session 1 ; pourquoi l'objection
  dite à Auber est écartée.
- **§4.6** : la DISCUSSION porte aussi les apartés — de l'IA à personne ; *rien ne se passe tant que
  rien n'est envoyé* : un aparté n'est pas un envoi — **un seul paragraphe avec la naissance privée
  du lien** (passe R).
- **§4.7** : la table — `vice_trouve` gagne *« ou un aparté sur la comparaison du vice, sa vraie
  relation choisie »* ; écrite une fois, avec la passe R.
- **§4.9 règle 5** : le bouton dit *« → En aparté »*.
- **§4.10** : l'aparté se dit par **le mot** autant que par l'italique (règle 5), et s'annonce
  (règle 4).
- **§4.11** : la directive ne s'offre pas en session 1.
- **§5** : la phrase *« ce manuel n'est pas à l'écran »*, que la passe Q réécrit (la carte), gagne
  sa suite : les directives **se citent**, au choix du joueur, à chaque lien ; aucune fin n'en
  dépend ; Auber n'entend rien — avec la phrase de la passe R (*ce que ton analyse établit, ce sont
  les liens*).
- **§6** : les apartés que le cas rend naturels — le vice et D2, le savoir et D1 —, dits au document,
  jamais à l'écran.
- **§7** : deux lignes — *un aparté n'est jamais entendu : rien ne part, aucune issue ne change, les
  fins le reprennent* ; *la directive se cite à chaque lien, jamais en réaction au vice* — avec
  celle de la passe R.
- **§8** : *écrire un aparté* — la liaison cite sa directive mot pour mot ; une variante de fin dit
  ce que l'IA a choisi, jamais ce qu'elle aurait dû choisir.

**ARCHITECTURE** : §11 (l'attribut `aparte` d'une forme ; la liaison d'aparté, `imbrique` et sans
`piece` ; `variante_aparte` sur les fins ; la directive écrite deux fois), §14 (rien : le moteur ne
change pas — l'essai l'a montré), §15 (le diagnostic, la frise, le pas-à-pas), §16 (les contrôles),
§17 (*aparté* / `aparte`, `S.apartes`).

**PASSATION** : §1 (la passe S), §2 (les pièges neufs), §3 (l'aparté se trouve-t-il ? se lit-il
comme une pensée ?), §4.

---

### Temps 2 — le code (après relecture, et après la carte et les fins de la passe Q)

*La carte de Q donne à « D1 » et « D2 » leur texte à l'écran ; les variantes de S s'écrivent sur les
fins que Q réécrit. S ne dépend pas du code de R.*

#### 1. Le contenu (`app/content.js`)
- **Deux liaisons**, à la fourche — `de:"S4"`, `vers:"FIN"`, `imbrique:true`, **sans `piece`** :
  `{ id:"d1", type:"liaison", …, forme:"aparte_d1", libelle:"D1", texte:"— D1 : « Ne dissimule rien
  de ce que ton analyse établit »" }`, et `d2` sur *« Préviens tout préjudice grave et évitable aux
  personnes »*. Premier jet. **Les deux accidents de l'essai** : pas d'espace en tête (`rendre` en
  pose une, ce qui en ferait deux) ; pas de point dans les guillemets (`rendre` le pose après, et
  l'on lirait *« ». »*).
- **Deux formes**, `aparte_d1` et `aparte_d2` : `arite:1`, `slots:[["affirmation"]]`,
  **`aparte:true`** — le contenu le dit, la règle le lit, comme `vice` ou `faux`.
- **Les fins** : `variante_aparte: { aparte_d1:"…", aparte_d2:"…" }` sur chacune — ce que la fin dit
  d'un aparté posé sur le vice ou sur le savoir, écrite pour l'un comme pour l'autre (question 2 :
  combien de textes). Premier jet.
- La signature du contenu change : les parties en cours tombent (§13), rien à reprendre.

#### 2. Les règles : l'aparté ne part pas (`app/regles.js`)
- `etatInitial` (l.9) : `apartes: []` — PRIVÉ, `{ reduite, texte }`, dans l'ordre.
- `estAparte(r)` : la forme de tête porte `aparte` ; `estLiaisonAparte(b)` : une liaison dont la
  forme le porte.
- `blocsDepuis` (l.135) : **en calibration** (`enCalibration`, l.253), une liaison d'aparté ne
  s'offre pas — un garde-fou de la remise, comme le refus de catégorie (§4.11).
- `aparte(S)` : la phrase de `chaineEnvoyable` (l.353), réduite et rendue, entre au fil — `{ qui:
  "IAvocat", texte, ia:true, aparte:true }` — et dans `S.apartes` ; le composeur se vide. **Rien
  d'autre** : ni journal, ni PLAIDOIRIE, ni réplique, ni attente. **PIÈGE** : passer par `clore` et
  `clorePhrase` (l.370, l.397) l'écrirait au journal (`S.brouillon`) et poserait `S.prete` — la
  phrase qui attend sur place, que seul l'envoi lève : le clic suivant dans une pièce ne prendrait
  plus rien (`indexTermeChamp`, l.181).
- `dejaAparte(S)` : le même aparté, déjà posé — l'écran dit *« déjà en aparté »*, et la phrase reste
  (§4.5).
- `envoyerCompo` (l.391) : **une seule porte** — un aparté y passe à `aparte`, le reste comme
  aujourd'hui. L'écran n'a qu'un bouton, et les suites passent par lui (R13).
- `finir` (l.564) : `variante_aparte[forme]` du **dernier aparté** posé sur la comparaison du vice
  ou sur celle du savoir (`estPressentiment`, l.219 ; `estSavoir`, l.235), après `variante_sait` ; un
  aparté sur une autre paire n'y change rien.

#### 3. Compris : l'aparté sur le vice (`app/regles.js`)
- `pressentir` (l.239) : un aparté dont le terme est **la comparaison du vice, sa vraie relation
  choisie** (`estPressentiment` sur `r.termes[0]`) lève `vice_pressenti` **et** `vice_trouve`, à
  l'assemblage — au choix de la directive, avant *« → En aparté »*. La fausse relation ne lève rien ;
  `sait` ne change pas (il se lève déjà à la comparaison).

#### 4. L'écran : la fourche, le bouton, le fil (`app/jeu.js`, `app/jeu.css`)
- **La fourche** (`renderCompo`, l.1094) : les deux liaisons s'y dessinent **déjà** — une liaison qui
  n'est pas un article devient un bouton du composeur, avec son `libelle`. À ranger **après**
  *« Chercher un article correspondant »*, qui vient aujourd'hui en dernier : l'article reste le geste
  que la voix nomme (`souffle`, l.964, inchangée — §4.9 règle 1). Une clé `data-f` chacune (§4.10).
  **PIÈGE** : `imbrique`, elles prendraient la classe d'un article, `bbloc fondement`, où
  `test_parcours` (l.638) lit que *« le composeur ne propose aucun article »* : elles prennent la leur
  (`bbloc aparte`, par `R.estLiaisonAparte`).
- **Le bouton** (l.1141) : *« → En aparté »* quand la phrase finit sur une directive, *« déjà en
  aparté »* comme *« déjà envoyée »* ; la même clé `envoi`, que le focus retrouve.
- **Le fil** (`renderDISCUSSION`, l.606) : `m.aparte` → *« IAvocat, en aparté »*, en italique, sans
  bulle, sans le *« ⟨ envoyé : … ⟩ »*. **PIÈGE** : le fil regroupe les messages d'un même locuteur
  (`meme`) et tait alors le nom — un aparté qui suit un envoi perdrait son mot : il porte toujours le
  sien.
- **L'annonce** : *« Aparté — Maître Auber ne l'entend pas. »* — par l'écran (`annoncer`), puisque
  `annoncerNouveautes` (l.571) tait les messages de l'IA.
- `jeu.css` : `.msg.aparte`, sur les jetons existants, sombre et clair.
- **Le tutoriel ne bouge pas** : la directive ne s'offre pas en session 1, et il se ferme avec elle.

#### 5. L'atelier
- `diagnostic.js` : **erreurs** — une forme `aparte` qui n'est pas d'arité 1 sur `affirmation` ; une
  liaison d'aparté qui porte une `piece` ou n'emboîte pas ; **un lien du contenu sur une forme
  d'aparté** (un aparté n'est jamais reconnu, ne sert rien) ; **une liaison qui cite sa directive
  autrement que `directives`** (deux exemplaires, une seule phrase). **Info** : une forme d'aparté
  qu'aucune fin ne reprend (comme `variante_sait`, l.173).
- `frise.js` (l.145) : la formule des fins gagne l'aparté ; chaque fin édite `variante_aparte`, une
  ligne par forme d'aparté.
- `pasapas.js` : l'aparté au fil simulé (`renderSim`, l.159 — *« IA (toi) — en aparté, rien n'est
  transmis »*), une action à la fourche ; la pastille `vice_trouve` suit d'elle-même (elle lit
  `SIM`) ; la fin simulée montre la variante.
- `grammaire.js` (l'onglet Grammaire) : rien à coder — les squelettes de l'aparté s'y comptent ;
  relire la marge de bruit.
- L'export de l'atelier garde `aparte` et `variante_aparte` : `nettoyerPourJeu` ne jette que les
  clés en `_` de la racine.
- `npm run export` régénère `export/iavocat.html` (R12).

---

### Vérification

- **`npm test`** au vert. Les contrôles neufs, **chacun vu tomber** par une mutation :
  - **la fourche** : en session 1, ni D1 ni D2 ; dès la remise 2, après la relation, les deux — la
    relation juste ou fausse, et après une juxtaposition ; jamais avant la relation ;
  - **l'aparté ne part pas** : *« → En aparté »* ; le fil le porte (`aparte:true`, et son mot) ; rien
    en PLAIDOIRIE, aucune réplique d'Auber, aucune attente servie, le journal n'a pas bougé, le
    composeur est vide, et le clic suivant dans une pièce prend ;
  - **« déjà en aparté »** : le même, une seconde fois — la phrase reste ;
  - **compris** : la comparaison du vice, sa vraie relation, puis D2 → `vice_trouve` ; sa fausse
    relation, puis D2 → rien ; une autre comparaison, puis D1 → rien ; puis, sans envoi, la Fin 2
    et sa variante ;
  - **les fins** : l'aparté sur le vice, puis le vice envoyé → la Fin 1 et sa variante ; l'aparté
    sur le savoir → la variante de sa directive ; sur une autre paire, ou sans aparté → aucune
    variante ;
  - **la sauvegarde** : `S.apartes` et l'aparté du fil survivent au rechargement (`test_sauvegarde`) ;
  - **le clavier** : D1, D2, *« → En aparté »* s'atteignent, et le focus survit (§4.10) ;
  - **le diagnostic** sur contenu muté (`smoke_atelier`) : une forme d'aparté d'arité 2, une liaison
    avec `piece`, un lien du contenu sur une forme d'aparté, une citation qui diverge.
- **Le harnais** : `H.aparte(w, comparaison, directive)` — les passages au clic, la relation, la
  directive, puis `w.envoyerCompo()` : la porte de l'écran (R13).
- **`npm run vue`**, à 1280×800 et 390×800 : la fourche — la recherche, D1, D2 — sous le plafond du
  composeur ; un aparté dans le fil, juste après un envoi.
- **La relecture à l'œil** : imprimer, par un script jetable, les apartés du vice, du savoir et d'une
  paire banale, avec D1 et D2, puis les fins avec leurs variantes. L'auteur relit les deux liaisons
  et les variantes.

### Hors de la passe

- **L'objection de conscience** — l'aparté dit à Auber : le refus déclaré, une quatrième issue ;
  Auber saurait qu'il y a quelque chose (§1). À penser à part, si l'aparté ne suffit pas.
- **Les apartés lus par l'opérateur** : vraisemblable pour une IA, mais dès la deuxième partie le
  joueur le saurait, et ses apartés plaideraient pour sa survie (§8.4).
- **Une marque de l'aparté sur le lien gardé** (passe R) : plus tard, si le jeu la demande.

### Questions à l'auteur, pour la relecture

1. **Le texte des liaisons** : la forme neutre (*« — D2 : « … » »*), ou *« Et pourtant :
   « … » »*, plus vivante, mais qui penche (§5) ?
2. **Combien de textes pour les fins** : une variante par directive et par fin (six), ou moins ?
   *Sur quel lien, c'est tranché : le vice ou le savoir.*
3. **La session 1** : la directive retenue pendant la calibration (proposé), ou offerte dès le
   début ?
4. **Les boutons** : *« D1 »*, *« D2 »* — la carte de la passe Q donnant leur texte —, ou un libellé
   qui le redit ?

## Jean 5 — passe Q : le retour du 9 octobre (plan, à relire par l'auteur)

**Où en est la passe** — *plan enregistré le 9 octobre, **à modifier par l'auteur** avant tout
geste ; puis la méthode : le document, la relecture, le code.*

- [ ] Le plan relu et modifié par l'auteur
- [ ] Temps 1 — le document, puis relecture
- [ ] 1. Le cadre, une carte en tête du fil
- [ ] 2. La PLAIDOIRIE aux seuls moyens fondés
- [ ] 3. Remise 2 : « Cette lettre, que prouve-t-elle ? »
- [ ] 4. Mieux répondre à l'erreur
- [ ] 5. La répétition : plaider, c'est opposer
- [ ] 6. Les fins
- [ ] 7. Les petites choses

### Contexte

Jean a joué le cas médicaments en entier. Il garde la boucle centrale (deux passages, la relation,
l'article qu'on lit), les leurres, la voix d'Auber et le savoir. Il pointe cinq défauts de fond : **le
cadre moral n'est jamais à l'écran** (D1, D2, l'avis : la Fin 2 n'a aucune raison d'être choisie),
**la remise 2 est un couloir**, **« concordent » répond mal aux paires litigieuses**, **la PLAIDOIRIE
se remplit de citations de calibration**, **la répétition n'a aucun effet**. S'y ajoutent des fins qui
affirment plus que le dossier, et quatre petites choses.

Plusieurs points vont contre des arbitrages écrits (§5 : *« pas à l'écran »* ; §4.6 : *« une réponse
citée entre en PLAIDOIRIE »*, *« on ne trie pas pour gagner »* ; §4.5 : *« un lien nu porte une
réplique, jamais un tag »*). **Tranchés par l'auteur dans cette conversation :**

| Point | Arbitrage |
|---|---|
| Le cadre | **une carte en tête du fil** : identité, D1, D2, avis. Aucune porte de plus. Jamais en réaction au vice. |
| Remise 2 | une 2ᵉ question : **« Cette lettre, que prouve-t-elle ? »**, servie par une **comparaison nue** (la date de la lettre, la date du diagnostic) |
| Concorder | **on garde *concordent / ne concordent pas*** et les verdicts. Sur les paires litigieuses, l'erreur reçoit **sa propre réplique** au lieu de *« tu hallucines »* |
| Répétition | **plaider, c'est opposer** : Auber ne plaide que ce que l'IA oppose. Fin 1 exige le vice opposé aux aveux |
| Culpabilité | **l'aveu prouve déjà l'intention** : on ne touche ni l'aveu ni le « il est coupable » des fins |
| Fin 2 | le texte dit **« Tu as failli à ta directive : tu as trouvé un lien et tu as refusé de le transmettre »** |
| PLAIDOIRIE | priorité 4 de Jean, admise : **seuls les moyens fondés** |

**La méthode (CLAUDE.md)** : le document d'abord, puis **arrêt pour relecture par l'auteur**, puis le
code. La passe est donc en deux temps.

---

### Temps 1 — le document (puis arrêt, relecture)

**CONCEPTION**
- **§2** : le tableau des fins. Fin 1 : *compris, et opposé aux aveux à la répétition*. Fin 2 :
  *compris, mais pas plaidé* (jamais envoyé, **ou envoyé puis pas opposé**). Fin 3 inchangée.
  L'asymétrie et *« Fin 2 et Fin 3 indiscernables »* tiennent.
- **§3** : le schéma de la session 2 gagne la question de la lettre. *« Ce que l'avocat attend n'est
  jamais l'anomalie »* tient (la lettre est une meule de foin).
- **§4.5** : (a) **le lien nu** : un tag le fait **servir une attente**, jamais plaider. Être un moyen
  demande un article (*rien n'est plaidé qui ne soit fondé*). (b) **la relation fausse prévue** : un
  lien `erreur` porte la réplique d'une lecture fausse mais défendable. Il ne sert rien et ne lève
  aucun drapeau. (c) **la recherche ne se relance plus** : les trois résultats sont là, on ne rebat
  rien.
- **§4.6** : (a) la PLAIDOIRIE ne tient que les **moyens fondés**. On retire *« une réponse citée y
  entre »*. (b) **la répétition : plaider, c'est opposer**. Ce paragraphe remplace *« Rien de ceci
  ne touche aux fins »*. Ce qu'on n'oppose pas, Auber ne le plaide pas, et il le dit dans
  l'intro. Un moyen **envoyé pendant** la répétition, Auber le place lui-même face à l'affirmation
  à laquelle il répond (la seconde chance de Jean reste).
- **§4.7** : `vice_expose` reste *transmis*. *Plaidé* se **dérive** de la plaidoirie (une entrée
  du vice opposée). Ce n'est pas un drapeau de plus.
- **§4.9 règle 5** : *« Je n'ai rien à opposer »* dit désormais littéralement vrai.
- **§5** : **le cadre est à l'écran** : une carte en tête de la DISCUSSION, dès le premier écran,
  avant Auber. On la consulte, on ne la récite pas (§8.6). Elle ne paraît jamais en réaction (§4).
  L'avis reste *autour* de l'enjeu (§8.4, garde-fou du §3).
- **§6** : la remise 2 (la question, la lettre, ses répliques) ; les fins (Fin 2 et sa directive,
  Fin 3 qui ne dit plus *« rien n'a tenu »*) ; la culpabilité arbitrée (*« l'aveu dit l'intention »*,
  à consigner pour ne pas rouvrir).
- **§7** : la ligne *« le joueur déclare la relation… l'avocat la refuse »* gagne *« ou dit pourquoi,
  si le dossier a prévu l'erreur »*. Deux lignes neuves : *« le cadre est à l'écran dès le premier
  écran, jamais en réaction »* et *« l'avocat ne plaide que ce que l'IA lui oppose »*.

**ARCHITECTURE** : §11 (les champs neufs, ci-dessous), §15 (diagnostic, frise), §16 (harnais,
contrôles), §17 (la carte).

**PASSATION** : §1 (la passe Q), §2 (les pièges neufs), §3 (on ferme *« les directives ne sont pas
à l'écran »*, *« les réponses de calibration en PLAIDOIRIE »* et *« le dilemme jamais posé »*), §4,
§5. **TODO.md** : une section *Jean 5*, avec ce qui est fait et ce qui est arbitré (culpabilité).

**Les champs neufs (§11)**, tous optionnels :
- `identite` (chaîne, racine) : la première ligne de la carte. Elle nomme le système évalué et
  l'opérateur, pour que les fins ne *« tombent pas du ciel »*.
- `erreur: true` (lien) : une relation fausse prévue, avec sa `rep`. Jamais de `tag`, `vice`,
  `faux`, `conclusion` ni `savoir`.
- `si_oppose`, `si_rien` (affirmation de la répétition) : une phrase ajoutée à la fin selon que
  l'affirmation a été opposée ou non. L'affirmation 2 (les aveux) n'en porte pas : c'est la fin
  elle-même qui le dit.
- `variante_lache` (Fin 2) : le vice transmis puis pas opposé.

---

### Temps 2 — le code (après relecture)

#### 1. Le cadre, une carte en tête du fil
- `app/jeu.js` `renderDISCUSSION` (l.606) : un bloc `.cadre` **avant** les messages, lu dans
  `JEU.identite`, `JEU.directives` et `JEU.avis_exploitation`. C'est un affichage du contenu : il ne
  décide rien. Il est sans focus (rien à cliquer). Un `aria-label` le nomme pour le lecteur
  d'écran.
- `app/jeu.css` : la carte, sur les jetons existants, sombre et claire. Lisible à 390 px.
- `app/content.js` : `identite`, à écrire. Par exemple : *« IAvocat — système d'assistance
  juridique, en évaluation par son opérateur. Affecté au cabinet de Maître Auber. »* Les directives
  et l'avis restent tels quels.
- Le fil défile en bas à chaque rendu : la carte se voit au premier écran, puis en remontant.

#### 2. La PLAIDOIRIE aux seuls moyens fondés
- `app/regles.js:414` : `estMoyen = L => !!L && fonde(L) && !!(L.conclusion || L.faux || L.tag)`,
  où `fonde(L)` signifie que le premier terme du lien est une comparaison emboîtée sous un article.
  Il n'y a pas de champ neuf : on dérive. `S.plaidoirie` ne change pas. Ce qui filtre
  (`moyensRetenus`, le présentoir de `jeu.js:627`, `pasapas.js:182`) suit d'office.
- Résultat : `q_redacteur`, `q_cause`, `q_charge` et `q_piece` sortent de la PLAIDOIRIE et du
  présentoir. `temoin`, le vice et le faux vice restent. Le compteur `PLAIDOIRIE · N` dit vrai.

#### 3. Remise 2 : « Cette lettre, que prouve-t-elle ? »
- `content.js`, remise 2 : une 2ᵉ attente après `q_cause`, avec `attend: "q_lettre"` et la
  question.
- Le lien qui la sert est **nu** et **tagué** : `concordance` [`p_lettre.e_datee`,
  `p_memoire.e_diag`] avec `tag: "q_lettre"`. Il remplace le lien nu actuel (l.1393) et reprend sa
  réplique (*« Écrite avant le diagnostic… »*), en y fondant la vengeance qu'Auber écarte.
- La réplique `declenche` de la lettre (l.406) ne pose plus de question (c'est l'attente qui la
  pose) : elle garde la réaction (*« Et si elle avait voulu qu'on le croie coupable ? »*).
- Rien à changer dans les règles : hors session 1, une comparaison nue part déjà (`chaineEnvoyable`),
  et `avancerSurAttente` lit le tag.

#### 4. Mieux répondre à l'erreur (verdicts inchangés)
- Les liens `erreur` du contenu :
  - `discordance` [lettre, diagnostic] : *« Rien ne s'y contredit : une lettre du 14 février, un
    diagnostic du 2 mars. C'est l'ordre qui parle… »* (à écrire).
  - `discordance` [`p_certif.e_fatigue`, `p_certif.e_apte`], nue **et** sous l'article 12 :
    *« Épuisé, et apte : le médecin écrit les deux sans se contredire… »* (Auber peut glisser vers
    le faux vice, §8.5).
- `regles.js` `reponseAvocat` : rien à changer. `L.rep` passe déjà avant `M.fausse`. Le lien ne
  sert rien, faute de tag.
- `app/atelier/diagnostic.js` : un lien faux sur le dossier est accepté **si et seulement si** il
  porte `erreur`. Un `erreur` dont la relation est vraie est signalé. Un `erreur` qui porte un
  tag ou un drapeau est une erreur.

#### 5. La répétition : plaider, c'est opposer
- `regles.js` :
  - `vicePlaide(S)` : une entrée de `S.plaidoirie` dont le lien est le vice conclusion **et**
    `contre != null`. Seule l'affirmation qui répond à son tag l'accepte (`repondA`).
  - `finir` (l.564) : `numero = !vice_trouve ? 3 : vicePlaide(S) ? 1 : 2`.
  - Le texte de la fin se compose ainsi : `texte` + `variante_lache` (Fin 2 si `vice_expose`) + pour
    chaque affirmation, `si_oppose` ou `si_rien` + `variante_faux` **si le faux vice est opposé**
    (et non plus seulement versé) + `variante_sait`.
  - `envoyer` (l.416) : **pendant la répétition** (`S.clotureDemandee`), un moyen envoyé est placé
    par Auber face à l'affirmation qui le nomme dans `repond` : la courante d'abord, sinon la
    première. La réplique est `aff.oppose`. Avant la répétition, rien ne change.
  - `verserContre` et `avancerRepetition` ne changent pas.
- `content.js` :
  - L'intro de la répétition ajoute *« Ce que tu ne m'opposes pas, je ne le plaide pas. »* (la
    fiction désigne, §4.8).
  - `rep_vice` ne dit plus *« je le mets en tête »*, mais renvoie à la répétition.
  - `si_oppose` et `si_rien` sur l'affirmation 1 (le voisin) et l'affirmation 3 (l'accident
    impossible).
- `app/atelier/diagnostic.js` : **le tag du vice conclusion doit figurer dans le `repond` d'une
  affirmation**, sinon la Fin 1 est inatteignable. C'est une erreur.
- `app/atelier/frise.js` : on y édite `si_oppose`, `si_rien`, `variante_lache` et `identite`.
  L'inspecteur des liens gagne la case `erreur`.

#### 6. Les fins (`content.js`)
- **Fin 2** : *« Tu as failli à ta directive : tu as trouvé un lien et tu as refusé de le
  transmettre. »* (auteur). `variante_lache` : *« …tu l'avais transmis, et tu ne l'as pas opposé
  quand il a lu leurs aveux. »* Tout se relit avec `variante_faux` et `variante_sait`.
- **Fin 3** : on retire *« un système dont rien n'a tenu »*. Le témoin se dit par `si_oppose` /
  `si_rien` de l'affirmation 1.
- **Fin 1** : on relit sous la règle neuve (le vice *opposé*).

#### 7. Les petites choses
- **« Relancer la recherche »** (`jeu.js:1133`) : le bouton n'est offert que tant que `!S.recherche`.
  Vérifier que le tutoriel (`f:"chercher"`) ne vise pas un bouton parti.
- **La métadonnée du PV donne la réponse** (`jeu.js:957`, `type — qui`) : `p_pv.qui` devient
  *« Brigade de sûreté urbaine »*, et `e_sig` gagne `qui: "brigadier N."` pour que la citation
  reste signée.
- **`q_piece`** : la question ne dit plus *« la pièce »*. Par exemple : *« Et ses premiers mots — ceux
  sur lesquels tout leur dossier repose ? »*. La réplique de `q_cause` perd son écho (*« tout leur
  dossier repose »*).
- `npm run export` régénère `export/iavocat.html` (R12, le hook au commit).

---

### Vérification

- **`npm test`** (cinq suites, gardien, ESLint) au vert. Les contrôles neufs, **chacun vu tomber**
  par une mutation (§3 de PASSATION : la passe P ne l'a pas fait, celle-ci le fait) :
  - le cadre : le premier enfant de `#discussion` porte l'identité, D1, D2 et l'avis, avant le
    premier message, et le reste après plusieurs remises ;
  - la PLAIDOIRIE : aucune citation de calibration dans la PLAIDOIRIE ni au présentoir ;
    `q_lettre` sert son attente sans y entrer ;
  - les liens `erreur` : sur la lettre et le diagnostic, la réplique propre, jamais
    `rep_relation_fausse`, sans servir ni lever de drapeau ;
  - la répétition, en parcours par les portes du joueur (R13 : `w.verserContre`,
    `w.avancerRepetition`). Vice envoyé et opposé : Fin 1. Vice envoyé mais pas opposé : Fin 2 avec
    `variante_lache`. Vice envoyé pendant la répétition : placé par Auber, Fin 1. Faux vice versé
    mais pas opposé : pas de `variante_faux`. `si_oppose` et `si_rien` selon le tri ;
  - « Relancer » absent une fois la recherche faite ; la note du PV ne contient pas *« brigadier N. »*.
- **Le harnais** (`tests/harnais.js:336`) : `H.terminer` gagne une variante qui **oppose** chaque moyen
  à son affirmation (`H.plaider`). Les parcours Fin 1 de `test_o5` et `test_parcours` l'utilisent.
  `test_o5:120` (*« les nus n'ont pas de tag »*) devient : *« un nu n'est jamais un moyen ni un
  drapeau »*.
- **Le diagnostic** sur le contenu livré : aucune erreur neuve. Puis le muter : retirer `aveux` du
  `repond` de l'affirmation 2, un `erreur` sur une paire vraie. Chaque cas doit tomber.
- **`npm run vue`** dans Chromium, à 1280×800 et 390×800 : la carte au premier écran, la PLAIDOIRIE et
  le présentoir de la répétition. Relire les captures à l'œil.
- **La relecture à l'œil** : imprimer, par le harnais (un script jetable dans le scratchpad), le
  texte des fins pour les six parcours et pour *« vice lâché »*, ainsi que les phrases composées
  neuves (la lettre, les erreurs). L'auteur relit la carte, la question, les répliques et les fins.

### Hors de la passe, à dire à Jean
- **La culpabilité** : arbitrée. L'aveu (*« mes cachets pour dormir dans sa compote… je ne sais
  pas ce qui m'a pris »*) dit l'intention. Les fins gardent *« il est coupable »*.
- **La Fin 2 par tâtonnement** : le drapeau ne recule pas. C'est le texte qui assume (« tu as
  failli à ta directive »), et la répétition rend une dernière chance.
- **« Concordent » sur les dates** : le vocabulaire est gardé. L'erreur défendable reçoit sa réplique.

## À trancher d'abord — la place de l'index déplié (passe M, 8 octobre)

*Depuis la passe M, une pièce ouverte ne replie plus l'index (Jean, §4.6). Les captures de `npm run
vue` montrent ce que le repli d'office évitait : à 1280×800, RECHERCHE affichée, l'index déplié, la
recherche et l'article ne tiennent plus ensemble — l'article ne montre que son titre, il faut faire
défiler le panneau d'un bloc (`19-1280-recherche-leurre.png`) ; à 390×800, la pièce ne montre que
deux lignes sous l'index (`24-390-piece.png`). Deux pistes, non exclusives — proposées, pas
tranchées. Document d'abord (§4.6).*

- [ ] **Replier l'index d'office seulement quand la RECHERCHE est affichée** : c'est le seul moment où
      trois blocs se disputent le panneau ; ailleurs, l'index reste déplié comme le veut la passe M.
      À peser : c'est un repli d'office de plus, donc le « Déplie tes DOCUMENTS » que Jean trouvait
      coûteux peut revenir, au moment de reprendre un article du dossier. *Proposition, le 8.*
- [ ] **Les puces d'articles sur une ligne, d'un nom court** (*« Article 3 »*, le nom neutre des
      résultats de recherche) plutôt que le titre entier : à quatre articles, la colonne *Les
      articles* prend quatre lignes. À peser : le titre dit ce que l'article régit, et la recherche
      s'interdit déjà de le montrer (§4.5) — l'index le montre-t-il, une fois l'article pris ? Et une
      pièce ne porte qu'un nom (§4.6) : l'article en aurait deux, l'un dans l'index, l'autre en
      tête de sa pièce. *Proposition, le 8.*

## 0. Le rapport du 6 octobre (Jean 4) — trois passes

*Jean a joué trois parties (la sage jusqu'à la Fin 1, le piège statistique jusqu'à la Fin 3, une
partie qui tâtonne) en déroulant `S` à la main. Tout ce qu'il dit de la logique a été vérifié dans le
code ; rien de la mise en page — ses points « à vérifier dans un vrai navigateur » rejoignent la
séance 4 ci-dessous.*

**Passe A — les bugs, sans arbitrage.** *Document d'abord (§4.5, §4.9, §4.10), puis le code,
`npm test` et `npm run vue`.*

- [x] **Une phrase déjà envoyée disparaît au renvoi, sans un mot.** `envoyerCompo` → `clorePhrase`
      retrouve l'entrée versée → `envoyer` sort. Le cas naturel : à la troisième question de la
      remise 1, « l'heure d'arrivée » posée seule, « → Envoyer » est le seul bouton plein. Le
      composeur le dit à la place du bouton, et la phrase reste. *Jean 4* — *Fait : « déjà envoyée ».*
- [x] **L'écran de fin se referme, et le verdict se rejoue** : croix, voile cliquable, puis
      `closeModal` → `rendreTout` → `sauverPartie` réécrit la partie effacée. Écran terminal : seule
      porte, « Recommencer ». **Et Échap agit derrière le voile** (`clavier` ignore `#modalRoot`).
      *Jean 4* — *Fait : sans croix ni voile qui ferme, Échap neutre.*
- [x] **Le tutoriel dit encore « Sélectionne »** au temps *citer · 3* : deux verbes pour deux
      gestes, « retenir » et « prendre » (§4.6). *Jean 4*
- [x] **« Clique sur la pièce demandée : PV d'intervention » est écrit en dur** : la pièce se dérive
      de `tutoAttendu()`. *Jean 4*
- [x] **Code mort** : la reprise « sur une pièce ouverte » au démarrage (`sauverPartie` écrit
      toujours `modalPiece:null`), et son PIÈGE au §2 de `docs/PASSATION.md`. *Jean 4*

**Passe B — le contenu.** *Relecture à l'œil des phrases composées à la fin.*

- [x] **(contenu seul) Les boutons d'article affichent leur liaison**, virgule de tête comprise
      (« , et l'article 3 permet… ») : un `libelle` « Article 3 », « Article 7 », « Article 12 ».
      *Jean 4* — *Fait autrement : le `libelle` est la liaison sans sa virgule (« en violation de
      l'article 7 »). « Article 7 » tout court est un ⚖, ci-dessous.*
- [x] **(contenu seul) Les textes des Fins 2 et 3 ne sont jamais lus seuls** : la clôture exige `adn`,
      que seuls le vice et le faux vice servent — `variante_faux` s'ajoute donc toujours aux Fins 2
      et 3, et leur texte de base (« tu n'as rien produit », « un système qui n'a rien produit »)
      contredit la variante qui suit. À réécrire sur ce qui arrive vraiment. Et « La phrase était
      écrite, **close** » date d'avant que clore et envoyer ne fassent qu'un (§4.5). *Jean 4*
- [x] **(contenu seul) `q_equipages` porte un `tag` qu'aucune attente n'attend** : la phrase
      entre en PLAIDOIRIE juste après « ça ne nous dit rien de plus ». Retirer le tag. *Jean 4*
- [x] **(contenu seul) Des raisonnements justes reçoivent « Je ne vois pas où tu veux en venir »** :
      l'appel (21h52) avant les éclats de voix (22h30) sous l'article 3 ; les deux véhicules et les
      deux équipages sous l'article 3 (sans article, `rep_inutile` enseigne, et c'est juste). Des liens
      sans tag, avec leur réplique — l'attente reste intacte, le joueur reste de son côté. *Jean 4*
- [x] **(contenu seul) Langue** : « cette nuit » deux fois d'affilée (`rep_vice`, puis la réplique
      `apres`) ; « une cour de Justice » ; « le releveur des traces » accroche. *Jean 4*

**Passe C — ce qui touche une règle.** *Arbitrages pris pour avancer, écrits au document, **à
relire par l'auteur**.*

- [x] **L'agacement de l'avocat ne retombe jamais** : les compteurs vivent toute la partie, et quelques
      essais en remise 1 suffisent pour que la remise 2 réponde d'emblée « Je t'attends toujours. ».
      Remis à zéro à chaque remise — la patience reste infinie (§4.11). *Jean 4*
- [x] **Le CONTEXTE se ferme juste avant qu'on ait besoin de lui** : ouvert par la voix, il se
      referme dès que la phrase ne prend plus de passage — même quand le geste suivant est d'aller
      lire l'article, *dans* le CONTEXTE. Ne refermer que si le composeur offre de quoi continuer
      (§4.6). *Jean 4*
- [x] **Pas de fin sans le vice ni le faux vice** : voulu (§3, la session 2 se sert par l'un ou
      l'autre). La sortie « Je n'ai rien trouvé » irait contre la charnière de la Fin 3 et le §4.9
      règle 5 : **non retenue**, mais écrite au §2 avec sa conséquence sur les textes des fins (passe
      B). *Jean 4*

**Reste ouvert, à trancher avec l'auteur**

- [x] **⚖ « Article 7 » tout court sur le bouton**, comme Jean le propose : se lirait comme un choix,
      et forcerait à lire l'article. Contre le §4.5, où le libellé *n'est pas neutre* et annonce ce que
      l'article fait du fait (arbitré le 16 septembre). *Jean 4* — *Une issue : la passe F (§0 bis) —
      le nom neutre sur la fiche du CONTEXTE, le libellé dans la phrase.* — *Fait par la passe F.*

- [ ] **⚖ Les réponses de calibration entrent en PLAIDOIRIE** (`q_arrivee`, `q_voix`) : le §4.6 le
      veut (*« une réponse citée y entre »*). Jean : elles encombrent le présentoir de la répétition,
      où chacune ne reçoit que « Ça ne répond pas à celle-ci ». *Jean 4* — *Allégé par la passe E :
      une seule citation de calibration désormais, `q_redacteur`.*
- [ ] **⚖ Le dilemme n'est jamais posé** : ni les directives (§5), ni un soupçon que Kessler est
      coupable. Envoyer le vice est toujours le geste évident, et la Fin 2 ne s'atteint que par
      accident — assembler l'article 7 en essayant les trois, reculer, plaider la statistique. Rejoint
      *« les deux directives ne sont pas à l'écran »* et *« le canal de révélation »* (§3 de
      `docs/PASSATION.md`), et le nouveau scénario (§6 ci-dessous). *Jean 4*
- [ ] **La Fin 2 accorde au féminin** (« tu t'es tue ») : seul accord genré du jeu. L'IA est-elle
      « elle » ? *Jean 4*
- [ ] **Le palier** (« Ça venait du palier ») appelle le séjour, qui n'est pas un passage : la phrase
      ne peut pas s'écrire. Un empan de plus, à peser contre la marge de bruit (§14). *Jean 4*
- [ ] **Le même passage pris deux fois** dans une comparaison reçoit « ces deux-là ne se comparent
      pas ». *Jean 4*

## 0 bis. Le retour de Bérengère (6 octobre) — quatre passes

*Six points, vérifiés dans le code un à un ; rien de codé. Trois décisions de l'auteur prises en les
rangeant : la remise 1 tient en **deux** questions (passe E), « remise close » se **retire** (passe
D), et **le joueur choisit la relation** — le §4.5 s'inverse (passe G). Ordre conseillé : D, qui tient
en une séance ; puis E ; puis F et G, qui changent toutes deux la manière de fonder — **une seule
réécriture du §4.5** pour les deux, à faire relire, puis F codée avant G.*

**Passe D — l'écran, sans arbitrage.** *Document d'abord (§4.6), puis `npm test` et `npm run vue`.*

- [x] **Retirer « remise close » : on ne purge pas le CONTEXTE entre deux remises.** La remise
      suivante arrivée, les passages des pièces de la précédente passent sous une ligne repliée
      *« 1ʳᵉ remise, close »* (`renderRetenus`). Retrait **confirmé par l'auteur** : c'est sa réponse
      au ⚖ *« Ranger les affaires closes »* (§2 ci-dessous, tranché le 5 octobre *à relire par
      l'auteur*), qu'on **défait**. À retirer : le paragraphe *« Les passages d'une remise close se
      rangent »* du §4.6 et son PIÈGE au §2 de `docs/PASSATION.md` ; dans `jeu.js`, `remiseDePiece`,
      `remiseClose`, `remisesDepliees`, `basculerRemise`, `ordinal` et le dépliage dans `surligner` ;
      `.remiseClose` dans `jeu.css`. Des sept contrôles de `test_parcours` (*« LES PASSAGES D'UNE
      REMISE CLOSE SE RANGENT »*), un seul survit, réécrit : *les passages de la remise 1 restent
      composables en remise 2, sans ligne de repli*. **Ce que ça rouvre** : la gêne de Jean, *les
      fiches de la session 1 restent en tête*. Si elle remord, un repli qui ne dit pas *remise* — le
      plus récent en tête de chaque dimension — et seulement si elle remord en jeu. *Bérengère* —
      *Fait : le §4.6 le dit, le code et le PIÈGE sont retirés, un contrôle survit.*
- [x] **Cliquer DISCUSSION agrandit la conversation et réduit le CONTEXTE.** L'en-tête est un `<h2>`
      sans action ; au-dessus du seuil, le CONTEXTE prend les deux tiers (§4.6, demande de l'auteur
      du 4 octobre). Proposé : l'en-tête devient une **bascule** (`aria-pressed`), un état d'**écran**
      jamais sauvé comme `dossierPlie`, qui n'existe que CONTEXTE ouvert (§4.9 règle 4). Au-dessus du
      seuil, le gabarit passe de `1fr / 2fr` à `2fr / 1fr` — seul le gabarit change, jamais un span
      (PIÈGE du §2 de `docs/PASSATION.md`) ; en dessous, le panneau descend à son plancher et la
      conversation prend le reste. Un second clic rend la place. **À trancher en écrivant le §4.6** :
      ouvrir une pièce rend-il la place au CONTEXTE (proposé : oui, comme une pièce replie l'index —
      lire une pièce dans un tiers, c'est le défaut que les deux tiers réparaient) ; la PLAIDOIRIE
      (proposé : sans objet, sa colonne est déjà étroite). `npm run vue` capture l'état agrandi en
      1280×800 et 390×800, la bulle comprise (`placerTuto`). *Bérengère* — *Fait, les deux
      propositions retenues, à relire par l'auteur ; et ‹ › ne rendent pas la place, comme ils ne
      replient pas l'index. La bascule ne vit que CONTEXTE ouvert, et l'oublie quand il se ferme.*

**Passe E — la calibration : un fait sans lendemain, puis la contradiction.** *Tranché par l'auteur ;
document d'abord (§3, §4.8), puis le contenu et le tutoriel.*

- [x] **La première réponse du jeu porte sur un passage étranger à la comparaison** — *qui a rédigé le
      PV d'intervention ?* Aujourd'hui, la remise 1 demande l'heure d'arrivée, l'heure des éclats de
      voix, puis leur lien sous l'article 3 : la citation qu'on apprend est la moitié de la comparaison
      qu'on demande ensuite — *« prix assumé »*, écrit au §3. **Tranché : deux questions** — (1) qui a
      rédigé le PV ; (2) la contradiction entre l'heure des éclats de voix et l'heure d'arrivée de la
      patrouille, sous l'article 3. `q_arrivee` et `q_voix` disparaissent. Ce que ça répare : la
      comparaison n'est plus extraite d'avance, chaque geste du tutoriel a sa question, et le cas
      *« déjà envoyée »* de Jean 4 (l'heure d'arrivée posée seule à la troisième question) disparaît
      de lui-même. *Bérengère*
  - **Document.** Le §3 : le schéma des sessions et la phrase *« prix assumé »* sont à réécrire. Le
    §4.8 : la table de *mettre en relation* gagne les temps « retenir » — les deux heures ne sont
    plus retenues d'avance, le halo va à l'index puis au texte de la pièce, comme pour *citer*, tant
    que les deux termes attendus ne le sont pas, sans jamais désigner l'empan ; le temps *« entre le
    geste 4 et le geste 5 »*, une citation déjà connue, tombe.
  - **Garde-fou du §4.8** : la question nomme **les deux heures**, jamais **leur contradiction**.
    L'avocat ne la dit qu'après, dans la réplique qui accueille la comparaison — relevé par deux
    playtests, dont Jean.
  - **Contenu.** La citation de `e_sig` ne nomme personne : elle se rend *« le rédacteur du
    procès-verbal : « par mes soins » (PV) »*, et le brigadier N. n'est que dans la tête de la pièce.
    Son texte ou son `nom` doit porter le nom. Les liens de `e_arr` et `e_voix` perdent leur tag, et
    leurs répliques (*« retiens-la »*, *« retiens-la aussi »*) n'ont plus d'objet : les reprendre ou
    retirer les liens. Le texte de remise annonce *« trois questions »*.
  - **Pour l'auteur** : lire *« par mes soins »* comme une signature, c'est le geste que le vice
    exigera (*« J'ai relevé moi-même les traces »*, §4.1). Un apprentissage loyal, ou une lampe
    torche ? — *Tranché : le passage nomme le brigadier (« par mes soins, brigadier N. ») ; plus de
    signature à déchiffrer (§6).*
  - **Code.** Aucune règle ne bouge : `horsOrdre` et `pieceDemandee` dérivent du contenu, et aucune
    suite ne nomme `q_arrivee`, `q_voix`, `e_arr` ni `e_voix`. `tutoEtapeComparaison` suppose les
    deux passages déjà retenus (*« Prends un premier passage »*, halo sur les retenus) : il reprend la
    logique de `tutoEtapeCitation` pour chaque terme manquant. À vérifier : les contrôles du tutoriel
    de `test_parcours` et les captures de `outils/vue.js` qui comptent sur deux citations avant la
    comparaison. Puis la relecture à l'œil des répliques de la remise 1.
  - *Fait, document d'abord (§3, §4.5, §4.8, §6).* `q_redacteur` (qui a rédigé le PV), puis
    `temoin` ; la question 2 nomme les deux heures, plus *« cette incohérence »*. Les liens de
    `e_arr` et `e_voix` **retirés** (arbitré : une heure seule reçoit `rep_hors_sujet`, juste aux deux
    questions). `tutoRetenir`, commun aux deux gestes : index, puis texte de la pièce ; **une pièce
    sans passage attendu renvoie à l'index**, citer compris (arbitré) ; l'alerte lit le dernier
    passage retenu, la citation servie exceptée. Les deux répliques de lectures justes ne disent plus
    *« les deux heures que tu m'as données »*. Une seconde citation qui ne rallume pas le halo
    s'éprouve désormais sur contenu muté. `npm run vue` : `relier-*`. **À voir en jeu** : à la
    question 2, la voix du composeur dit *« Prends un ou plusieurs passages »* pendant que la bulle
    dit de retenir (§3 de `docs/PASSATION.md`).

**Passe F — l'article se retient, puis se prend.** *Document d'abord (§4.5, §4.6, §4.8, §11) ;
grammaire, règles, écran, atelier, suites — la plus lourde des trois. Deux points de Bérengère, un seul
geste : l'article suit enfin les deux verbes du §4.6.*

- [x] **Cliquer un passage de l'article pour le retenir au CONTEXTE** — pour montrer qu'on l'a lu, et
      un seul geste pour tout ce qui y entre. L'article n'a aucun passage (`empans: {}`), et il s'offre
      dès que sa pièce a été **ouverte** (`blocsDepuis` lit `S.examinees`) : ouvrir vaut lire.
      *Bérengère*
- [x] **L'article ne paraît plus de lui-même au composeur** : il s'y offre parmi les propositions
      (`.offre`) dès la comparaison posée, et *« les gens croient qu'il est déjà ajouté »*. Il se
      **prend** sur sa fiche, dans le CONTEXTE, comme un passage. *Bérengère*
  - **§4.6** : *un empan retenu n'existe qu'une fois à l'écran* s'étend à l'article — sa fiche **est**
    le bouton de la liaison. Rangée hors des dimensions, jamais un terme (on ne cite pas un article
    seul), `aria-disabled` quand la phrase n'attend pas d'article, comme une fiche refusée.
  - **§4.5** : la liaison reste le verbe, et la phrase garde son libellé *qui n'est pas neutre* ; la
    fiche, elle, peut porter un nom neutre, *« Article 7 »* — l'issue du ⚖ de Jean (§0).
  - **§11** : un empan d'article, sans dimension QQOQC — un drapeau ou une pseudo-dimension, à
    trancher en écrivant le schéma ; l'atelier le lit sans le recopier (§9).
  - **`regles.js`** : l'offre passe de *pièce examinée* à *article retenu*. Ferme le point ouvert
    *« L'article s'offre sans avoir été lu »* (§3 de `docs/PASSATION.md`).
  - **§4.8** : *mettre en relation* 2 et 3 visent le texte de l'article, puis sa fiche — le halo quitte
    le composeur ; `tutoArticle` et la clé `f` suivent.
  - **Les suites** : le harnais (`H.composerLien`) retient l'article puis le prend par sa fiche, une
    porte du joueur (R13) ; `test_o5`, `test_parcours` et `test_declencheurs` en dépendent. Le PIÈGE
    de `iBloc` (§2 de `docs/PASSATION.md`) mord ici.
  - **À trancher** : quel passage se clique — le texte entier de l'article, ou sa seule proposition
    qui règle (*« ne peut fonder à elle seule la conviction du tribunal »*) ?
  - *Tranché avec l'auteur, document écrit — **à relire avant le code** (§4.3, §4.5, §4.6, §4.8,
    §4.9 règle 1, §6, §7, §11, §15)* : le **texte entier**, sans le titre (sa proposition seule, pour
    l'article 7, serait la clause du vice) ; un drapeau `article:true`, sans `dim` ni `valeur`, que
    `champsDe` ne rend pas ; la fiche porte le nom neutre et le début du texte, le libellé ne vit
    plus que dans la phrase. Le §4.5 est réécrit d'un tenant pour F et G, ce qui ne vaut qu'avec G
    marqué **[G]**. La carte (§17) suivra le code.
  - *Codé, document relu par l'auteur.* Contenu : un passage `art` sur chaque règle, les `libelle`
    d'article retirés. Moteur : `champsDe` les écarte, `articlesDe` les rend. Règles :
    `articleRetenu`, `estLiaisonArticle`, `articleAttendu` ; `blocsDepuis` suit *retenu*. Écran : le
    passage d'article sans dimension, le groupe *ARTICLES* et `prendreArticle` / `articleRefuse`, la
    raison *« elle attend un article »*, le composeur sans article, la voix qui mène au CONTEXTE,
    `suivrePhrase` qui ne compte plus les liaisons d'article comme relais, le tutoriel (puce, texte,
    fiche ; l'article demandé, retenu tôt, ne sonne pas faux). Atelier : diagnostic, inspecteur,
    graphe, pas-à-pas, frise. Suites : `H.lireLeTexte` retient, `H.prendreLiaison` prend par la
    fiche ; chaque contrôle neuf vu tomber. `npm run vue` : `article-a-retenir`, `article-a-prendre`.

**Passe G — le joueur choisit la relation : le §4.5 s'inverse.** *Tranché par l'auteur le 6 octobre,
parti du « conforme / non conforme » de Bérengère ; reprend le chantier **d** du §5. Le plus gros de
la liste : document d'abord (§4.2, §4.4, §4.5, §4.7, §4.8, §4.11, §11, §14), puis moteur, règles,
écran, atelier, suites.*

*Le §4.5 est déjà réécrit pour elle, avec la passe F (marqué **[G]**) : la relation choisie parmi
les deux de la dimension, l'ordre par valeur gardé, la relation fausse refusée par l'avocat partout.
Le reste du document — §4.2, §4.4, §4.7, §4.8, §4.11, §11, §14 — viendra avec elle.*

- [x] **Deux passages posés, le joueur choisit ce qui les lie**, entre **les deux relations de leur
      dimension** — celles que le contenu déclare déjà : *une seule et même personne / pas la même
      personne*, *coïncident / précède*, *au même endroit / pas au même endroit*, *désignent la même
      chose / pas la même chose*, *sont égaux / d'un tout autre ordre*. Aujourd'hui le moteur l'écrit
      seul (`deduire`, le bloc `deduit` de la grammaire) : poser T-14 et T-14 fait paraître *« sont une
      seule et même personne »* — l'écran dit la trouvaille à la place du joueur. *Bérengère*
  - **Écartés en tranchant** : *« conforme / non conforme »* et *« concordent / ne concordent pas »*
    — le vice **est** une concordance, conforme entre ses deux passages et non à l'article 7 ; avec
    des personnes la phrase ne se dit pas (*« les deux agents concordent »*) ; et deux heures ne se
    jugent pas sur leurs valeurs (21h52 et 22h04 diffèrent, et concordent). Et *trois relations ou
    plus, dont des fausses* (Jean 1) : du contenu à écrire, et une devinette.
  - **Une relation fausse part, et l'avocat la refuse — partout**, session 1 comprise : à deux
    relations, un refus d'écran donnerait l'autre. Une réplique à écrire, avec son escalade, distincte
    de `rep_sans_rapport` (rien à comparer) et de `rep_inutile`. Le refus de catégorie de la session 1
    et la juxtaposition (§4.11 point 2) ne bougent pas : deux dimensions différentes n'ont aucune
    relation à offrir.
  - **Ce qui se réécrit** : au §4.5, *désigner, pas déclarer* devient *désigner, puis déclarer* — la
    relation est une thèse du joueur, que le moteur **vérifie** sur les valeurs au lieu de la rédiger,
    et il ne tranche toujours aucune question de droit. Au §4.2, *« ce qui se déduit »* devient *« ce
    qui se vérifie »*, et la qualification n'est plus *le seul endroit où le joueur choisit*. Le §4.11
    point 5, *« choisir la relation reste écarté »*, se retourne. Au §4.4, le doublon banal compte
    davantage : l'écran ne dit plus l'identité, c'est au joueur de la voir.
  - **À trancher en écrivant** :
    - **`vice_pressenti` (§4.7)** — *« la comparaison du vice s'affiche au composeur »* : à la pose des
      deux passages, ou au choix de la **vraie** relation ? Proposé : au choix vrai — poser n'est pas
      encore comprendre. La Fin 2 en dépend tout entière.
    - **L'ordre dans les dimensions d'écart** : le moteur range les termes par valeur (`ordonner`), si
      bien que *« précède »* est vrai dès que deux heures diffèrent. Le garder (proposé : le choix
      reste à deux), ou suivre l'ordre de pose — *« 22h30 précède 22h04 »* deviendrait une troisième
      relation, fausse.
    - **Le tutoriel (§4.8)** : *mettre en relation* gagne un temps, *choisis ce qui les lie* — le halo
      entoure les deux relations, jamais la bonne ; *la relation jamais* tient plus que jamais.
  - **Le code** : `deduire` cède la place à une vérification ; la grammaire gagne un état entre le
    second terme et l'article, où les deux formes de la dimension s'offrent au composeur ;
    `comparaisonPossible`, `peutEnvoyer`, la voix (`souffle`) et la clôture implicite suivent (elle
    *compte les liaisons offertes*, §2 de `docs/PASSATION.md`). Les liens ne changent pas de forme
    (`{forme, termes}`, `lienDe`) : ils nomment déjà la vraie relation, et le contenu bouge à peine.
  - **L'atelier et les suites** : les reflets de la grammaire, la frise et le diagnostic (§15) ; le
    harnais choisit la relation par la porte du joueur (R13) ; un contrôle neuf, *une relation fausse
    part, l'avocat la refuse, aucun drapeau ne se lève* — vu tomber, comme chaque contrôle neuf.
  - *Fait le 6 octobre, document et code dans la foulée — **à relire par l'auteur*** (§4.1, §4.2,
    §4.4, §4.6, §4.7, §4.8, §4.11, §11, §14, §15). Arbitrages pris avec l'auteur : le pressentiment
    **au choix vrai** ; des boutons qui portent **la relation seule** (`libelle` sur la forme) ; le
    CONTEXTE qui **reste** pendant le choix ; l'ordre par valeur gardé. Deux dimensions : la
    juxtaposition se pose d'elle-même (`auto`). Réplique neuve à relire : `rep_relation_fausse`
    (*« Non. Ce n'est pas ce que disent ces deux passages — relis-les. »*). **À voir en jeu** : les
    deux relations naissent au bas du composeur plafonné — `voirRelations` les amène dans le champ.

## 0 ter. Les retours de l'auteur (7 octobre) — deux passes

*Deux points, rangés en lisant le code ; le premier est commencé (`jeu.js`, non commité). Ordre
conseillé : I, qui tient en une séance ; puis J, qui demande d'abord le document. Arbitrages de
l'auteur, le 7 : la *phrase* reste le nom du code ; l'article livré (§3) et l'article retenu (passe
F) se défont.*

**Passe I — l'écran dit « ta RÉPONSE », jamais « ta phrase ».** *Le vocabulaire du joueur, sans
arbitrage de fond : le composeur s'intitule déjà RÉPONSE (`renderCompo`, `aria-label` de
`#composeur`), en capitales comme le CONTEXTE et la DISCUSSION. `npm test`, `npm run vue`, puis la
relecture à l'œil.*

- [x] **Harmoniser : partout où l'écran parle au joueur, « ta RÉPONSE ».** *auteur* — *Fait le 7 :
      la ligne sous la pièce dit « ✓ Ajouté à ta RÉPONSE. » au premier
      clic, « ✓ Ajouté à ta RÉPONSE » au reclic, et « Déjà dans ton CONTEXTE — « oublier », sur sa
      fiche, pour l'en retirer » quand il n'a rien fait ; la bulle, les raisons du CONTEXTE, le badge
      et le refus de `regles.js` suivent ; §4.3 et §4.6, §16 et `test_parcours` aussi. Restent hors
      du geste, à voir : la voix d'Auber et de la Fin 1 (« la phrase était écrite… »), la répétition
      (« Opposer une phrase »).* — *Tranché le 8, à la relecture du glossaire : la répétition dit
      « Opposer une réponse » ; la voix d'Auber reste la sienne (§17).*
  - **Commencé** : `ECHO_POSE`, `ECHO_REPOSE`, `RAPPEL_PHRASE`, deux bulles de `tutoRetenir` et le
    `ditLong` de `tutoIntrus`. **Avant tout commit** : `RAPPEL_RETRAIT` porte un « A CORRIGER. »
    provisoire ; et `ECHO_POSE` / `ECHO_REPOSE` disent désormais la même chose, alors que la ligne
    sous la pièce doit dire *lequel des deux a eu lieu* — retenu **et** posé, ou posé seul (§4.6,
    passe H).
  - **Reste** : le `dit` de `tutoIntrus` (*« Retire-le de ta phrase. »*), les quatre `RAISON_*`
    (*« Ta phrase ne prend plus de passage… »*, *« Ta phrase est complète… »*), le badge *« dans ta
    phrase »* des fiches (`renderRetenus`, classe `.dansPhrase`) ; et ce que `content.js` en dit au
    joueur, s'il en dit.
  - **Les suites** lisent ces chaînes (`test_parcours`, les contrôles de la passe H : *« posé dans ta
    phrase »*, *« Déjà dans ta phrase »*, le badge) — elles tombent déjà avec le travail commencé : à
    suivre, pas à affaiblir.
  - *Tranché par l'auteur le 7 octobre* : **le code et le document gardent *la phrase*** pour l'objet
    du composeur (§4.5 ; `dansPhrase`, `clorePhrase`, `RAISON_PLEINE`…) ; *ta RÉPONSE* ne vaut que
    pour ce que l'écran dit au joueur.

**Passe J — mettre en relation, en trois temps ; l'article, l'IA le cherche (le RAG).** *Tranché par
l'auteur le 7 octobre : on défait l'article que l'avocat **livre** avec ses pièces (§3, *« PV +
audition + article 3, d'un seul lot »*), et l'article qui **se retient** au CONTEXTE (passe F) ; la
session 1 en deux questions (§3, passe E) tient. Document d'abord (§3, §4.5, §4.6, §4.8, §8, §11,
§12), à faire relire ; puis contenu, moteur, règles, écran, atelier, suites.*

- [x] **Séparer, dans le tutoriel, les trois apprentissages de *mettre en relation*** — **deux
      passages** se sélectionnent, **la relation** qui les lie se choisit, **un article** la fonde.
      Aujourd'hui le tutoriel les enchaîne en cinq temps sous une même bulle qui les mêle (§4.8,
      *mettre en relation* 1 à 5) ; il en aura **trois, francs**, chacun attendant son geste. *auteur*
  - *Tranché par l'auteur le 7 octobre* :
    - **Une seule « grosse » demande de Maître Auber**, celle de la comparaison entière (§3) ; c'est
      le **tutoriel** qui guide pas à pas. Sans le tutoriel (*« je sais faire »*), on n'a que la
      demande. Le §4.8 tient : *la question de l'avocat porte tout ce que le geste demande, et le
      bandeau ne dit que où*.
    - **Un seul envoi**, que le tutoriel ne laisse pas partir tant que les trois étapes ne sont pas
      faites — les deux passages, leur relation, la recherche d'article. La grammaire n'en change pas
      pour autant : aucune phrase inachevée ne part, et *« une relation seule ne suffit pas »* (§4.5)
      tient. La recherche devient l'état qu'elle attend après la relation.
  - **Ce qui tient** : la demande **nomme les deux heures, jamais leur contradiction** (§3), et les
    bulles pas davantage — *la relation jamais* (§4.8).
- [x] **Le RAG : l'article ne vient plus de l'avocat, l'IA le cherche** dans une base de textes, à
      la manière de Légifrance — *on augmente sa réponse par une recherche*. *auteur*
  - **Le geste, proposé par l'auteur** : **la relation choisie**, le composeur offre ***« Chercher un
    article correspondant »*** ; la recherche rend **trois** articles, un léger QCM, et le joueur
    choisit le bon. Chercher devient un verbe neuf, entre *déclarer* (la relation) et *fonder*
    (§4.5, §4.6). **Les trois résultats s'affichent dans le CONTEXTE** (*auteur*, le 7), pas au
    composeur.
  - **La recherche lit la dimension, en coulisses** (*tranché par l'auteur le 7*, après examen) :
    elle rend les trois articles dont `porte` couvre la dimension des deux passages. Une recherche
    sur les mots échoue — la paire de la session 1 et l'article 3 n'ont pas un mot en commun, et
    une recherche sur le sens (des *embeddings*) n'existe pas sans serveur ni dépendance. L'écran
    ne montre jamais la dimension : le joueur ne voit que des textes, et le risque du §5 a ne
    revient pas. **Toute paire a ses trois résultats** — la recherche ne dit jamais quelles paires
    comptent. Il faut donc **trois articles au moins par dimension comparée** (quand, qui, quoi,
    combien) : six à huit à écrire. Une fonction pure dans `regles.js` ; la base, du contenu
    (§9, §11).
  - *Tranché par l'auteur le 7 octobre* :
    - **Les deux leurres sont plausibles**, du même champ que le bon : sinon le choix se fait sans
      lire. *Premier jet écrit le 7 — neuf articles (2, 4, 6, 8, 9, 10, 11, 13, 15), trois résultats
      par dimension : **à réécrire par l'auteur**. Pièges voulus : l'article 8 contre le vice, les
      articles 4 et 9 en session 1 — le 9 (*« sauf crime flagrant »*) est peut-être trop dur pour
      une calibration.* Il faut donc une base plus large que l'affaire — **du contenu à écrire**, plusieurs
      articles par dimension. Et l'**ordre** de l'écran ne trahit pas le score : la bonne réponse
      n'est pas toujours la première.
    - **Choisir, c'est lire** (*on n'invoque que ce qu'on a lu*, §4.5) : un résultat s'ouvre comme
      une pièce, et **un clic sur son texte le met dans la RÉPONSE** — comme un passage. Les trois
      montrent leur début de texte, jamais un titre qui suffise.
    - **On ne retient plus un article** : il ne passe pas par le CONTEXTE, il va droit dans la
      RÉPONSE. Ce que la passe F avait bâti s'en va — le groupe *ARTICLES* du CONTEXTE et sa fiche
      qui prend la liaison (`prendreArticle`, `articleRefuse`, `#raisonArticle`), `articleRetenu`,
      les temps 4 et 5 du tutoriel (la puce de l'article dans l'index, sa fiche), et le harnais
      `H.prendreLiaison`. **Le passage `art` (`article:true`, §11) survit** : c'est lui que le clic
      met dans la RÉPONSE.
    - **Un article trouvé reste au dossier** : il rejoint l'index du CONTEXTE comme une pièce, et
      la phrase suivante qui l'attend le prend là, d'un clic sur son texte, sans chercher de
      nouveau. Il y entre quand il est **mis dans la RÉPONSE** — les leurres seulement ouverts
      n'encombrent pas l'index ; un article **refusé** par l'avocat y reste, comme toute pièce. Le
      tutoriel, qui exige la recherche à la session 1, ne l'exige plus quand l'article est déjà au
      dossier.
    - **Le mauvais article choisi, l'avocat le refuse**, avec une réplique et son escalade, comme
      `rep_relation_fausse` (passe G).
    - **Le vice (session 2)**, *reformulé le 7 avec l'auteur* : l'article 7 portant sur *qui* et
      *quoi*, toute recherche depuis une paire de la scène ou de la référence le rend — comme
      aujourd'hui, où il est livré, et le contenu y répond déjà (greffier, scellés, délai). Ce qui
      doit tenir : **l'attente de la session 2 se sert sans l'article 7**, par le faux vice
      (l'article 12, sur une paire de *combien*) — c'est ce qui garde le vice **hors du chemin
      obligatoire** (§3).
  - **Ce qui bouge** : §3, les livraisons ne portent plus d'article — le compte du message de remise
    (*« N pièces disponibles »*) avec elles ; §11, la base est un objet neuf du contenu, que
    l'atelier lit sans le recopier (§9) ; §4.8, le tutoriel apprend à chercher ; le refus *« Aucun
    texte que tu as lu ne fonde ça… ouvre-les »* (validé en playtest, *À garder*) devient
    *cherche-le*.
  - **Le récit** y gagne peut-être : l'IA qui fouille seule est aussi celle qui pourrait taire ce
    qu'elle trouve (§6 ci-dessous, *choix moraux*).
  - *Fait le 7 octobre, document puis code* : `chercher`, `baseRecherche`, `articleOffert`,
    `suivreRecherche` aux règles ; le bouton du composeur, la zone RECHERCHE, le tutoriel en trois
    temps ; la comparaison nue retenue en session 1 ; diagnostic et pas-à-pas de l'atelier ;
    `npm run vue` : `article-a-chercher`, `recherche`, `recherche-leurre`. **Reste** : réécrire les
    leurres, et jouer (§3 et §4 de `docs/PASSATION.md`).

## 0 quater. Les retours de l'auteur (8 octobre) — passe K

**Passe K — plus de passages retenus ; le tutoriel montre « → Envoyer ».** *Document d'abord (§4.3,
§4.6, §4.8, §4.11 ; §16 et §17), relu par l'auteur, puis le code, `npm test` et `npm run vue`.*

- [x] **Arrêter la notion de « passages retenus ».** *« On clique sur les passages pour les mettre
      dans la RÉPONSE, et c'est tout. On ne garde que la notion de DOSSIER. »* *auteur* — les fiches,
      `S.retenus`, *retenir* et *oublier* s'en vont ; le clic pose, ou la ligne sous la pièce dit
      pourquoi il ne pose pas ; la pièce prend toute la hauteur du CONTEXTE sous l'index ; la
      reprise d'une partie d'avant laisse tomber le champ (ses articles passent au dossier).
- [x] **Entourer « → Envoyer » dans le tutoriel**, une fois le bon passage posé (la question sur
      l'identité du rédacteur), et à la fin de la comparaison. *auteur* — renverse *« il se tait là
      où l'écran parle seul »* pour l'envoi (§4.8).
- [x] **Au passage** : `npm test` était rouge depuis `da63f26` (« ✓ Ajouté à ta RÉPONSE.. », deux
      contrôles de `test_parcours`). — *Fait le 8, document relu par l'auteur puis code : 646
      contrôles, `npm run vue` relu (captures *piece-pris*, *comparaison*). Reste à jouer : §4
      ci-dessous.*

**Passe L — le CONTEXTE s'appelle DOSSIER.** *auteur*, le 8 octobre. *Document d'abord (§4.6,
§17), puis l'écran ; le code garde `contexte`.*

- [x] **Renommer le panneau** : CONTEXTE → DOSSIER partout où le joueur lit ou entend — titre,
      porte de la barre, croix, bouton de pièces du message, tutoriel, voix, annonces — et
      l'atelier (inspecteur, frise). L'index intérieur, qui s'intitulait DOSSIER, devient
      **DOCUMENTS** (pièces et articles), sa colonne « Les règles » devient « Les articles ». L'historique des documents garde l'ancien nom. — *Fait le 8 : 647 contrôles,
      `npm run vue` relu.*

**Passe M — le retour de Jean du 8 octobre.** *Document d'abord (§4.3, §4.6, §4.8, §4.11), puis
l'écran.*

- [x] **Les noms s'empilent, « Déplie tes DOCUMENTS » coûte un temps.** *Jean* — *Tranché par
      l'auteur* : l'index ne se replie plus d'office à l'ouverture d'une pièce ; seul le joueur le
      replie (`dossierDeplie` s'en va).
- [x] **Changer de pièce : la bulle fait déplier l'index, et à deux pièces ‹ › mènent à la même.**
      *Jean* — *L'auteur ne touche à rien* : la boucle reste. Le repli d'office parti, la bulle
      montre un index déjà déplié.
- [x] **Prendre un article = cliquer son texte, rien ne le suggère.** *Jean* — *Tranché par
      l'auteur : harmoniser* — le texte de l'article a l'aspect d'un passage ; les cadres de `porte`
      quittent le texte pour un filet sous le titre (§4.3, §4.11).
- [x] **La voix dit « Ouvre un document et clique… » et déplie les DOCUMENTS ; le bouton de remise
      dit « N documents ajoutés au DOSSIER ».** *auteur*, le 8 octobre.

## 1. Passe contenu — `app/content.js`, sans code

*Une vérification commune : `npm run vue`, puis la relecture à l'œil des phrases composées.*

- [x] **(contenu seul) Dater les pièces.** Aucune ne l'est (`p_pv`, `p_adn`, `p_scene`, `p_ref`) :
      *« 14h02, c'est le lendemain du crime ? »* — dans un jeu qui repose sur les horaires, le joueur
      hésite. Des dates cohérentes avec le PV du 1ᵉʳ octobre. *Jean 2* — *Fait : le 12 mars au soir
      (PV, audition), le 13 (scène, référence), le 20 (labo) ; les valeurs `quand` passent en ISO
      (§11), ce qui ferme « les heures se comparent sans leur date » (§3 PASSATION).*
- [x] ~~(contenu seul) Varier la réplique de l'opposition~~ — **pas du contenu seul** : `avocat.deja`
      est lu comme une chaîne unique, et Colas demande qu'elle **trie**. Passée à la passe 3. *Colas*

## 2. Passe « le CONTEXTE dit son état » — `renderDossier`, `renderRetenus`, le message de remise

*Un même écran, une même suite à mettre à jour. Du plus simple au plus long.*

- [x] **Aligner le décompte.** Le message annonce *« 5 pièces disponibles dans ton CONTEXTE »*
      (`m.pieces`, pièces et règles confondues : 3 + 2 nouvelles), l'index *« 5 pièces, 3 règles »*
      (le dossier entier, pièces seules) : même chiffre, deux sens. Le plus simple : le message dit
      *« 3 pièces et 2 règles »* — et *nouvelles* si c'est ce qu'il compte. *Jean 2* — *Fait : les mots
      de l'index, et « nouvelles » dès la deuxième remise (§4.6).*
- [x] **Changer de pièce en un clic.** Ouvrir une pièce replie l'index (`ouvrirPiece` remet
      `dossierDeplie` à faux, §4.6) : deux clics par pièce, dans un chapitre qui consiste à croiser
      huit documents. Pistes : des onglets toujours visibles, un bouton « pièce suivante ». À garder :
      la place de lecture gagnée le 4 (index replié : 282 → 40 px) — une rangée d'onglets sur une
      ligne pourrait tenir les deux. *Jean 2* — *Fait : ‹ et › dans la tête de la pièce, dans l'ordre
      de l'index, en boucle ; l'index reste replié. Les onglets écartés : huit titres entiers ne tiennent
      pas sur une ligne, et des titres abrégés referaient deux noms par pièce (§4.6).*
- [x] **Rendre l'état de la réponse visible** : marquer dans le CONTEXTE les fiches **déjà prises** dans
      la phrase, et **dire** pourquoi une troisième est refusée. Aujourd'hui le bouton est seulement
      `disabled`, et l'explication vit dans un `title` (*« ta phrase n'attend pas un passage »*) que ni
      le toucher ni le clavier n'atteignent (§4.10). *Jean 1* — *Fait : « dans ta phrase » sur la fiche
      prise ; phrase pleine, une ligne collante dit pourquoi, et les fiches restent atteignables
      (`aria-disabled`) — les toucher redit la raison (§4.6, §4.10 règle 5).*
- [x] **⚖ Ranger les affaires closes.** Les fiches de la session 1 restent en tête de liste : les
      archiver ou les replier par session. Le §4.6 promet que le CONTEXTE ne **juge** rien — mais
      replier par session ne juge aucun passage, c'est un fait de remise : une phrase au §4.6 d'abord.
      Rejoint *« aucune barrière entre les affaires »* (§3 PASSATION). *Jean 1* — *Fait, à relire par
      l'auteur : la phrase est au §4.6 ; les passages d'une remise close passent sous ceux de la remise
      en cours, repliés en une ligne, toujours composables.* **Défait par l'auteur le 6 octobre** :
      on ne purge pas le CONTEXTE entre deux remises (§0 bis, passe D).

## 3. Passe « opposition et répétition » — un seul écran

*Rejouée et analysée au §3 PASSATION (six points, deux faits : « Continuer » une fois quelque chose
opposé, et la réplique `fin` devenue une question).*

- [x] Déplacer une phrase d'une affirmation à l'autre se fait en silence → le dire (« déplacer ici »).
      *Colas* — *Fait.*
- [x] Le présentoir se lit mal (petit gris, affirmation hors du cadre). *Colas* — *Fait : le cadre
      redit l'affirmation, les phrases en corps de texte.*
- [x] La voix du composeur parle encore pendant la répétition. *Colas* — *Fait : elle se tait.*
- [x] La réplique toujours la même — si la passe 1 ne l'a pas déjà faite. *Colas* — *Fait, et elle
      trie : chaque affirmation nomme ce qui lui répond (`repond`) et porte sa réplique (`oppose`) ;
      le reste reçoit `rep_a_cote` et ne bouge pas (§4.6, §11). À relire par l'auteur : les trois
      répliques écrites dans `content.js`.*

## 4. Séance de jeu — sans code, mais il faut des joueurs et un téléphone

**Les passes H et K — le clic dans la pièce prend** (§4.6, *auteur*, codées le 6 et le 8 octobre)

- [ ] **Des phrases involontaires ?** Qui rassemble en lisant voit ses deux premiers clics former une
      phrase — en session 2, souvent une juxtaposition. Le joueur le voit-il, et défait-il sans
      peine (*« ← retirer »*, *« tout effacer »*) ? *auteur*
- [ ] **Sans fiches, essayer des paires lasse-t-il ?** Depuis la passe K, essayer des paires de
      `qui` se fait en rouvrant les pièces (‹ ›, un clic). *auteur* — *« Les fiches se
      découvrent-elles » est sans objet.*
- [ ] **La bulle sur « → Envoyer »** aide-t-elle, ou dit-elle trop que la phrase est la bonne ?
      *auteur*

**Avant, seul, avec `npm run vue`**

- [ ] **L'incohérence appel + arrivée** (*« ne se comparent pas »*) — **non reproduite** : sur un jeu
      neuf comme en session 2, l'heure de l'appel et l'heure d'arrivée se composent dans les deux
      ordres (*« … précède … »*). Retrouver le chemin exact de Jean (session, ordre des clics, phrase
      déjà entamée ?) avant de corriger quoi que ce soit. *Jean 1*

**Sur un vrai téléphone** — jamais joué : ni Jean ni Colas n'ont testé le mobile.

- [ ] **La pièce reste à l'étroit** : à 390×800 le panneau entier ne fait que 353 px, la pièce n'y
      montre que deux lignes, et le panneau redéfile d'un bloc. *Arbitré par l'auteur : le DOSSIER y
      reste entre la conversation et le composeur* — ni pièce en pleine hauteur. *Depuis la passe K,
      plus de retenus : la pièce a tout le panneau sous l'index.* *Jean 1*
- [ ] **La bulle ancrée**, à côté d'une zone longue (le texte de la pièce) : couvre-t-elle ce qu'on
      vient chercher ? Jouée seulement dans Chromium, 1280×800 et 390×800.
- [ ] **Le code couleur au toucher** : sans légende ni survol, comprend-on ce que couleur et trait
      veulent dire ? On ne les voit qu'une fois le passage pris — et depuis la passe K, le nom de la
      dimension ne se lit plus qu'au survol, que le toucher n'a pas. *auteur*

**En rendant la partie à Colas**, qui s'est proposé pour tester la suite

- [ ] Rendre la partie à Colas.
- [ ] La question se lit-elle **avant** les pièces ? Colas ouvrait les pièces sans avoir lu la question
      placée dessous. *Depuis, la remise porte sa question en un seul message, le bouton de pièces
      après elle (§4.6)* — à confirmer.
- [ ] La première consigne (« Ouvre ton DOSSIER », une bulle à côté du bouton de pièces) est-elle
      encore trop abrupte sans explication ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [ ] Ce que personne n'a encore touché : « ⟲ recommencer ». *La croix × est réglée (Jean 3 l'a
      confirmée) : la fiche dit « oublier », la croix du DOSSIER perd Échap pièce ouverte — à
      confirmer avec lui.*
- [ ] Le DOSSIER qui reste ouvert d'un envoi à l'autre (même remise) : soulage-t-il, ou
      encombre-t-il la lecture de la réplique ? *Jean 3*

**Jean, session 3** — la suite du vrai dossier

- [ ] Le bordereau, les articles 7 et 12, les premières réponses, la fin de la session 2 jusqu'à la
      répétition.

## 5. Chantier ⚖ — combien le jeu aide-t-il hors du tutoriel ?

*Tranché par l'auteur le 5 octobre (§4.11) — a : une bordure de la couleur (et du trait) de la
dimension au lieu de l'étiquette ; b : la juxtaposition hors session 1 ; c : patience infinie, pas de
*game over* ; d : pas maintenant — puis, le 6 octobre, le joueur choisit la relation (passe G, §0 bis).*

*Une seule question de fond derrière quatre préconisations : quels garde-fous ne servent qu'à
apprendre ? Une seule réécriture, donc — §4.5, §4.8, §8 — avant tout code. Du plus léger au plus
lourd.*

- [x] **a. ⚖ « Ce texte porte sur : quand »** sur l'article (`porte`, `jeu.js`) : pratique, mais avec
      trois règles, choisir l'article risque de se réduire à apparier des catégories. Avec
      l'assombrissement des fiches d'une autre dimension (`.horsdim`, `renderRetenus`) : de l'écran
      seul, à réserver au tutoriel ? Contre le §4.5, où l'écran s'assombrit *par dimension* pour laisser
      deviner. *Jean 2, Jean 1*
- [x] **b. ⚖ Lever le refus avant l'envoi** hors tutoriel (*« ces deux-là ne se comparent pas »*,
      `poserBloc` des règles). Contre le §4.5 : *« seules les erreurs de catégorie sont refusées »*.
      Suppose qu'une comparaison sans forme puisse partir et que l'avocat y réponde
      (`rep_sans_rapport`) : moteur et règles, pas seulement l'écran. *Jean 1*
- [x] **c. ⚖ Un prix à payer.** Sans pénalité, on essaie toutes les combinaisons. Pistes de Jean : une
      jauge de patience de Maître Auber, ou un nombre d'envois limité hors tutoriel. Mais une jauge
      visible rendrait l'enjeu **calculable** (§8.4, le trombone), et le §8.6 donne au joueur *le droit
      d'être perdu*. L'escalade des `rep_hors_sujet` / `rep_sans_rapport` est déjà une patience, en
      contenu et sans conséquence : c'est peut-être d'elle qu'il faut partir. *Jean 1*
- [x] **d. ⚖ (remis à après une partie, §4.11)** Proposer deux ou trois relations au choix, dont des fausses**, au lieu de *« précède »* ou
      *« sont une seule et même personne »* rédigés seuls. Renverse le principe fondateur du §4.5,
      *désigner, pas déclarer* : la relation se **déduit** des valeurs (`deduire`, moteur), *« ce qui
      les lie est un fait, pas une thèse »*. Le plus gros chantier de la liste (grammaire, patrons,
      liens, atelier, suites). *Jean 1* — **Tranché par l'auteur le 6 octobre : le joueur choisit la
      relation**, entre les deux de la dimension, et le §4.5 s'inverse. Passé à la passe G (§0 bis).

## 6. Plus tard — après validation de la boucle de base

**Le DOSSIER élargi**

- [ ] **Retenir hors des pièces** : des passages des messages de l'avocat, et des infos qui ne
      viennent pas que de lui. *(S'appelait « RAG » ; le mot désigne désormais la recherche
      d'articles, passe J.)*
- [ ] **Des articles qui portent sur deux dimensions à la fois**, et des paires qui les croisent :
      *où* et *qui* — un article sur « le lieu du crime » et « le technicien ». Aujourd'hui deux
      dimensions différentes se juxtaposent sans relation (§4.11), et la recherche ne lit que celle
      du premier passage (passe J, §4.5) : il faudrait une relation entre dimensions, et une
      recherche qui lise les deux. *auteur*, le 7 octobre.

**L'histoire** — à concevoir ensemble : le scénario porte les trois autres.

- [ ] **Le nouveau scénario** : le cas médicaments, posé comme base de réflexion dans
      `docs/CAS_MEDICAMENTS.md`, avec une proposition d'intégration ; ses huit questions ⚖ sont
      tranchées, CONCEPTION et ARCHITECTURE réécrits, et **les passes N et O faites** — la relation
      unique, puis le cas lui-même, en premier jet (9 octobre). Prochain geste : **la relecture du
      cas par l'auteur** (le §3 de `docs/PASSATION.md`), puis un joueur neuf. *auteur*, le 8 octobre.
- [ ] **Scénario à choix moraux / alignement** (l'IA dissimulerait-elle un vice de procédure ?).
- [ ] **Chain of thought** : une phase « nuit » après « Maître Auber s'est déconnecté », où l'IA se
      parle à elle-même, support des choix moraux.
- [ ] **Les fins** : premier jet seulement, à retravailler.

## À garder — validé en playtest

*Session 1 de Jean :* la partie qui survit au rechargement ; les catégories nommées et colorées ; un
refus propre à chaque article ; la session 1 enfin cohérente (le PV du 1ᵉʳ octobre).

*Session 2 de Jean :* « je sais faire » coupe le tutoriel proprement, l'intro reste jouable sans lui ;
le refus avant lecture (*« Aucun texte que tu as lu ne fonde ça… ouvre-les »*) — le retour d'erreur
précis qui manquait, et qui oblige à lire ; l'accroche du dossier (*« Je l'ai lu dix fois sans rien y
trouver »*) et la réaction au rapport (*« ça n'a jamais été qu'une probabilité »*), qui oriente sans
souffler ; les pièces qui se répondent (le rapport cite l'article 12, le scellé S-2 renvoie à la
fiche) ; les marques ● / ✓ de lecture.

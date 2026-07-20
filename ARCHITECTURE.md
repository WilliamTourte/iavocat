# IAvocat — Architecture : atelier, jeu, contenu

*Qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

---

## 1. Les trois artefacts

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (l'outil d'écri-  │                         │ (le CONTENU │                  │  (le JEU : moteur  │
│   ture + diagnostic│ ◄────────────────────── │  exporté)   │                  │   + repli embarqué)│
│   + simulation)    │     Importer JSON       └─────────────┘                  └────────────────────┘
└────────────────────┘   (content.json, même donnée)
```

Le flux de travail quotidien tient en une phrase : **on écrit dans l'atelier, on exporte `content.js`, on pose le fichier à côté de `index.html`, on recharge le jeu.** Le badge d'en-tête du jeu confirme la source utilisée (« contenu : content.js » ou « contenu embarqué »). Il n'y a aucune étape de build, aucun serveur, aucune dépendance ; tout marche en `file://` comme sur itch.io.

## 2. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **trois, une par nature d'information**. C'est la distinction qui rend le système sain :

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, champs, liens, remises, répliques, fins, `attention`…) | **L'état courant de l'atelier** (sa sauvegarde locale `localStorage`) pendant l'écriture ; **`content.js`** une fois exporté — c'est lui que le jeu exécute | `JEU_EMBARQUE` dans `index.html` (repli) ; `SEED` dans l'atelier (exemple de départ) | Les deux copies embarquées **peuvent vieillir sans casser quoi que ce soit** — ce sont des filets, pas des références |
| **Les règles du moteur** (avancement des remises, sémantique de `declenche`/`apres`/`leve`/`prive`/`apparait_si`, deux marches du vice, répétition, calcul des fins, P0, O5) | **Le code de `index.html`** — et lui seul | La frise et la simulation de l'atelier (tout ce qui porte un badge **⚙**) ; le commentaire « Règles recopiées du moteur » en tête de la section 8 de l'atelier | Le miroir a **fondu** depuis le décâblage : le *câblage* (qui déclenche quoi) vit dans le contenu, seule la *sémantique* des clés reste à refléter. L'atelier *décrit* et *simule* ces règles, il ne les commande pas |
| **Les invariants de design** (vice = déblocage jamais verrou, recevabilité pas fiabilité, une seule violation, etc.) | **`conception_jeu_ia.md`** | Le diagnostic de l'atelier (`valider()`) en encode une partie en contrôles automatiques | Le diagnostic est un extrait, pas le doc entier — en cas de doute, le doc tranche |

Dit autrement : **le contenu appartient à l'atelier, les règles appartiennent au jeu, le sens appartient au doc de conception.** L'atelier est le seul endroit où l'on *écrit* ; le jeu est le seul endroit où les règles *s'exécutent* ; les diagnostics et la simulation sont des miroirs de confort.

## 3. Le sort des copies embarquées

`index.html` contient `JEU_EMBARQUE`, utilisé seulement si `content.js` est absent ou invalide (validation légère `contenuValide()`, avertissement console en cas de rejet, jamais de plantage). Conséquences pratiques :

- **La divergence embarqué / content.js est normale et sans danger.** Le jeu joue toujours `content.js` s'il est là.
- **Le harnais `test_p0_o5.js` teste l'embarqué** (jsdom ne charge pas les `<script src>`) — c'est voulu : le filet de sécurité reste testé. `test_declencheurs.js` et `smoke_atelier.js` testent, eux, des contenus injectés inline (mutés ou exportés de l'atelier).
- Si un jour l'embarqué diverge trop pour rester un filet crédible : copier le JSON de l'atelier dans `JEU_EMBARQUE` (un collage). Rythme conseillé : à chaque jalon de contenu, pas à chaque retouche.
- Le `SEED` de l'atelier suit la même logique : c'est le contenu d'exemple du bouton « Recharger l'exemple », rien de plus.
- **Le carnet s'ouvre à deux pièces livrées**, pas à « deux remises » : le contenu reste libre de tout livrer d'un coup (seuil décâblé en juillet 2026, débusqué par `test_autre_affaire.js`).
- **La sauvegarde de partie est signée par le contenu** (condensé de `JEU` dans `localStorage`, clé `iavocat_partie`). Conséquence voulue : livrer un nouveau `content.js` invalide les parties en cours des testeurs — elles repartent proprement de la remise 1 au lieu de référencer des pièces ou des cases disparues. La fin d'une partie efface la sauvegarde ; le bouton « ⟲ recommencer » (double clic) aussi.

## 4. Checklist de resynchronisation ⚙

> **Décâblage (juillet 2026).** Le moteur ne contient plus **aucun identifiant de contenu**. Ce qui était câblé en dur a rejoint le contenu : la tentation vit sur la pièce (`pieces[pid].declenche` : `replique`, `une_fois`, `qui`), l'accusé de réception sur la case (`cases[ck].apres.replique`), et les cases portent leur propre comportement (`apparait_si` : conditionnelle, `prive` : rien dans le canal, `leve` : lève un drapeau au verrou). Les dimensions peuvent s'écrire **sur la pièce** (`pieces[pid].dims`), la table globale `dims` restant le repli — l'atelier édite les deux (inspecteur de champ : « surcharge sur cette pièce ») et son `dimDe(pid, champ)` est le miroir exact de celui du moteur. Le contenu exporté est estampillé `schema: 2` ; le moteur avertit en console s'il reçoit un contenu d'avant le décâblage (répliques migrables ignorées) ou d'un schéma plus récent que lui. L'ancienne option « déplacer les déclencheurs dans le contenu » est donc **prise** — le miroir a fondu d'autant.

**Les deux marches du vice** (règle du moteur) : noter le lien ⚑ lève `vice_pressenti` ; `vice_trouve` s'acquiert en verrouillant la case qui porte `leve:"vice_trouve"` — **ou** en remontant la note (transmis = compris). Sans case `leve` dans le contenu : régime à une marche (noter suffit). Pressentir sans conclure ni transmettre → Fin 3.

Ce qui reste à dérouler **quand on modifie le moteur de `index.html`** (et seulement là) :

| Règle du moteur | Dans `index.html` | Reflet dans `atelier_v3.html` |
|---|---|---|
| Toutes les cases **obligatoires** (sans `apparait_si`) dues verrouillées → remise suivante ; les conditionnelles ne bloquent ni remise ni clôture | `verrouiller()`, `casesObligatoires()`, `niveau1Complet()` | `simDesigner()`, `simActions()` + badge ⚙ des remises |
| Sémantique de `declenche` / `apres` / `leve` / `prive` / `apparait_si` | `ouvrirPiece()`, `verrouiller()`, `caseVisible()` | `simOuvrir()`, `simDesigner()`, `simCaseVisible()` |
| Deux marches du vice (+ « transmis = compris ») | `noter()`, `reponseAvocat()` | `simNoter()`, `simReplique()`, pastille `vice_pressenti` |
| Réplique au remontage : vice / faux / `lien.rep` / escalade partagée inutile‑sans‑rapport | `reponseAvocat()` | `simReplique()` |
| **P0** : `attention` (défaut 6) notes actives max ; remontée = libérée ; oubli (✕) libère sans effacer `vice_trouve` ; paire oubliée re‑notable | `attentionMax()`, `notesActives()`, `noter()`, `supprimerNote()` | `simAttentionMax()`, `simNoter()`, `simOublier()`, pastille « attention » |
| **O5** : index du dossier (vu / pas‑vu) | `renderCarnet()` (pur affichage) | rien à simuler — mentionné dans la frise |
| Clôture : intro + affirmation 1 ; carnet vide → présentoir vide | `cloturer()` | `simCloturer()` |
| Répétition : laisser passer / présenter = remonter en contexte / déjà remontée → `deja` | `avancerRepetition()`, `presenterNote()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` (avec `vice_expose = trouvé ET remonté`) + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle » ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` correspondantes et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.

**Migration.** L'atelier migre silencieusement les anciens contenus à l'import et au chargement (`migrerContenu()` : `avocat.tentation_adn` → `declenche` de la pièce décisive, `avocat.ack_decisive` → `apres` de la case décisive). Le jeu, lui, ne migre pas : un vieux `content.js` reste valide mais perd ces deux répliques — repasser par l'atelier.

## 5. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`).

> **Les tests ne nomment aucun contenu.** Ni pièce, ni case, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice(w)` (le lien qui porte `vice:true`), `caseParLeve(w,"vice_trouve")`, `niveau1(w)` (verrouille chaque case obligatoire avec **sa** bonne réponse, dans l'ordre des remises), `pairesBruit(w,n)` (paires quelconques pour saturer l'attention), `pidAvecDeclenche`, `pidRegle`, `terminer(w)`/`numeroFin`. Pour l'atelier, qui manipule un contenu brut, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_p0_o5.js` (23) | le jeu, contenu **embarqué** | P0 (cap, oubli, re‑notation, vice qualifié puis oublié → Fin 2, clé `attention`) et O5 (index, marqueurs), sous les deux marches |
| `test_declencheurs.js` (22) | le jeu, contenus **mutés** injectés inline | le décâblage : remises généralisées et renommages libres, `declenche`/`apres`, Manuels par type et sans directives, case conditionnelle (invisible, non bloquante, privée, `leve`), les trois fins sous les deux marches (dont « pressentir sans conclure → Fin 3 »), dims par pièce, rejet d'un contenu sans `relations` |
| `test_autre_affaire.js` (16) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite de forme différente (3 remises, 3 cases obligatoires, budget d'attention 3, vice reliant une pièce de la remise 1 à une règle de la remise 3) se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (23) | le jeu | l'ergonomie et le grain fin : sélection/désélection de paire, modale de pièce, marqueurs vus, rep_faux et drapeau du plaidé, escalade partagée inutile/sans-rapport, `lien.rep`, répétition (deja, non-représentation, refus de confirmer pendant), `variante_faux` des fins |
| `test_sauvegarde.js` (16) | le jeu | la partie survit au rechargement (état, Set, répétition en cours, `une_fois` non rejoué), la signature jette une sauvegarde d'un autre contenu, la fin efface, recommencer confirme avant d'effacer |
| `smoke_atelier.js` (54) | l'atelier + le couple atelier→jeu | SEED sans erreur, diagnostic qui attrape le câblage cassé, migration des vieux contenus, éditeur de cases, **renommage d'ids** (pièces : liens/remises/_pos réécrits ; cases), autosave rechargé, surcharges de dims, le « qui » des répliques joué par le moteur, pastilles des drapeaux `leve`, export estampillé `schema: 2`, simulation des trois fins, export adopté et joué par le moteur |

(`test_boucle.js` et `smoke3.js` étaient les suites d'avant le décâblage — leurs terrains sont couverts par celles-ci ; `test_parcours.js` a été réécrite sur le harnais commun.)

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes.**

## 6. Résumé en trois phrases

Le contenu s'écrit dans l'atelier et voyage en un seul fichier, `content.js`, que le jeu charge tel quel — les versions embarquées ne sont que des filets. Les règles du jeu n'ont qu'une maison, le code de `index.html` ; l'atelier les reflète (badges ⚙) pour qu'on puisse *voir* et *simuler* le déroulé, au prix d'une resynchronisation manuelle listée ci‑dessus. Le doc de conception reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

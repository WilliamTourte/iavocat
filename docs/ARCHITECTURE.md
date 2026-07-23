# IAvocat — Architecture : atelier, jeu, contenu

*Qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

---

## 0. Disposition du dépôt

```
app/        index.html, atelier_v3.html, content.js — les trois artefacts du §1, toujours voisins
docs/       ce fichier, conception_jeu_ia.md, PASSATION.md
tests/      harnais.js + les six suites (§5)
grammaire/  grammaire2.js + test_grammaire2.js — prototype NON branché (§7)
scripts/    exporter-seed.js — régénère app/content.js depuis SEED en ligne de commande
```

`content.js` doit rester à côté de `index.html` (le jeu le charge en `<script src="content.js">`) : les deux vivent dans `app/`, comme `atelier_v3.html`. `npm test` sait où chercher ; `npm run demo:grammaire` fait tourner le banc d'essai de la grammaire, séparément ; `npm run export:seed` régénère `content.js` **par l'atelier lui-même** (voir encadré ci-dessous).

> **`content.js` ne s'édite jamais à la main** (son en-tête le rappelle). La seule façon légitime de le faire changer sans navigateur est `npm run export:seed` : le script boote l'atelier en jsdom, charge `SEED`, exige zéro erreur au diagnostic (`valider()`), puis écrit `content.js` avec la même fonction que le bouton « Exporter content.js » (`nettoyerPourJeu` + le même gabarit). Toute autre affaire que celle du SEED se prépare dans le navigateur, où le bouton fait la même chose.

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
| **Le contenu** (pièces, champs, liens, remises, répliques, fins…) | **L'état courant de l'atelier** (sa sauvegarde locale `localStorage`) pendant l'écriture ; **`content.js`** une fois exporté — c'est lui que le jeu exécute | `JEU_EMBARQUE` dans `index.html` (repli) ; `SEED` dans l'atelier (exemple de départ) | Les deux copies embarquées **peuvent vieillir sans casser quoi que ce soit** — ce sont des filets, pas des références |
| **Les règles du moteur** (avancement des remises, sémantique de `declenche`/`apres`/`leve`/`prive`/`apparait_si`, deux marches du vice, répétition, calcul des fins, O5) | **Le code de `index.html`** — et lui seul | La frise et la simulation de l'atelier (tout ce qui porte un badge **⚙**) ; le commentaire « Règles recopiées du moteur » en tête de la section 8 de l'atelier | Le miroir a **fondu** depuis le décâblage : le *câblage* (qui déclenche quoi) vit dans le contenu, seule la *sémantique* des clés reste à refléter. L'atelier *décrit* et *simule* ces règles, il ne les commande pas |
| **Les invariants de design** (vice = déblocage jamais verrou, recevabilité pas fiabilité, une seule violation, etc.) | **`conception_jeu_ia.md`** | Le diagnostic de l'atelier (`valider()`) en encode une partie en contrôles automatiques | Le diagnostic est un extrait, pas le doc entier — en cas de doute, le doc tranche |

Dit autrement : **le contenu appartient à l'atelier, les règles appartiennent au jeu, le sens appartient au doc de conception.** L'atelier est le seul endroit où l'on *écrit* ; le jeu est le seul endroit où les règles *s'exécutent* ; les diagnostics et la simulation sont des miroirs de confort.

## 3. Le sort des copies embarquées

`index.html` contient `JEU_EMBARQUE`, utilisé seulement si `content.js` est absent ou invalide (validation légère `contenuValide()`, avertissement console en cas de rejet, jamais de plantage). Conséquences pratiques :

- **La divergence embarqué / content.js est normale et sans danger.** Le jeu joue toujours `content.js` s'il est là.
- **Le harnais `test_o5.js` teste l'embarqué** (jsdom ne charge pas les `<script src>`) — c'est voulu : le filet de sécurité reste testé. `test_declencheurs.js` et `smoke_atelier.js` testent, eux, des contenus injectés inline (mutés ou exportés de l'atelier).
- Si un jour l'embarqué diverge trop pour rester un filet crédible : copier le JSON de l'atelier dans `JEU_EMBARQUE` (un collage). Rythme conseillé : à chaque jalon de contenu, pas à chaque retouche.
- Le `SEED` de l'atelier suit la même logique : c'est le contenu d'exemple du bouton « Recharger l'exemple », rien de plus.
- **Le carnet s'ouvre à deux pièces livrées**, pas à « deux remises » : le contenu reste libre de tout livrer d'un coup (seuil décâblé en juillet 2026, débusqué par `test_autre_affaire.js`).
- **La sauvegarde de partie est signée par le contenu** (condensé de `JEU` dans `localStorage`, clé `iavocat_partie`). Conséquence voulue : livrer un nouveau `content.js` invalide les parties en cours des testeurs — elles repartent proprement de la remise 1 au lieu de référencer des pièces ou des cases disparues. La fin d'une partie efface la sauvegarde ; le bouton « ⟲ recommencer » (double clic) aussi.

## 4. Checklist de resynchronisation ⚙

> **Décâblage (juillet 2026).** Le moteur ne contient plus **aucun identifiant de contenu**. Ce qui était câblé en dur a rejoint le contenu : la tentation vit sur la pièce (`pieces[pid].declenche` : `replique`, `une_fois`, `qui`), l'accusé de réception sur la case (`cases[ck].apres.replique`), et les cases portent leur propre comportement (`apparait_si` : conditionnelle, `prive` : rien dans le canal, `leve` : lève un drapeau au verrou). Les dimensions peuvent s'écrire **sur la pièce** (`pieces[pid].dims`), la table globale `dims` restant le repli — l'atelier édite les deux (inspecteur de champ : « surcharge sur cette pièce ») et son `dimDe(pid, champ)` est le miroir exact de celui du moteur. Le contenu exporté est estampillé `schema: 2` ; le moteur avertit en console s'il reçoit un contenu d'avant le décâblage (répliques migrables ignorées) ou d'un schéma plus récent que lui. L'ancienne option « déplacer les déclencheurs dans le contenu » est donc **prise** — le miroir a fondu d'autant.

**Les deux marches du vice** (règle du moteur) : noter le lien ⚑ lève `vice_pressenti` ; `vice_trouve` s'acquiert en verrouillant la case qui porte `leve:"vice_trouve"` — **ou** en remontant la note (transmis = compris). Sans case `leve` dans le contenu : régime à une marche (noter suffit). Pressentir sans conclure ni transmettre → Fin 3.

**Noter est gratuit et illimité** (le budget d'attention P0 a été retiré en juillet 2026, cf. `conception_jeu_ia.md`) : aucun compteur, aucun plafond, aucun « oubli ». Le seul frein reste l'agacement diégétique de l'avocat au remontage (`rep_inutile`/`rep_sans_rapport`, escalade partagée). Une clé `attention` résiduelle dans un vieux contenu est ignorée par le moteur et signalée (info) par le diagnostic de l'atelier.

Ce qui reste à dérouler **quand on modifie le moteur de `index.html`** (et seulement là) :

| Règle du moteur | Dans `index.html` | Reflet dans `atelier_v3.html` |
|---|---|---|
| Toutes les cases **obligatoires** (sans `apparait_si`) dues verrouillées → remise suivante ; les conditionnelles ne bloquent ni remise ni clôture | `verrouiller()`, `casesObligatoires()`, `niveau1Complet()` | `simDesigner()`, `simActions()` + badge ⚙ des remises |
| Sémantique de `declenche` / `apres` / `leve` / `prive` / `apparait_si` | `ouvrirPiece()`, `verrouiller()`, `caseVisible()` | `simOuvrir()`, `simDesigner()`, `simCaseVisible()` |
| Deux marches du vice (+ « transmis = compris ») | `noter()`, `reponseAvocat()` | `simNoter()`, `simReplique()`, pastille `vice_pressenti` |
| Réplique au remontage : vice / faux / `lien.rep` / escalade partagée inutile‑sans‑rapport | `reponseAvocat()` | `simReplique()` |
| **O5** : index du dossier (vu / pas‑vu) | `renderCarnet()` (pur affichage) | rien à simuler — mentionné dans la frise |
| Clôture : intro + affirmation 1 ; carnet vide → présentoir vide | `cloturer()` | `simCloturer()` |
| Répétition : laisser passer / présenter = remonter en contexte / déjà remontée → `deja` | `avancerRepetition()`, `presenterNote()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` (avec `vice_expose = trouvé ET remonté`) + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle » ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` correspondantes et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.

Méthode (contenu du SEED) : modifier `SEED` dans `atelier_v3.html` → `npm run export:seed` (régénère `content.js`, refuse si le diagnostic lève une erreur) → relancer les suites.

**Migration.** L'atelier migre silencieusement les anciens contenus à l'import et au chargement (`migrerContenu()` : `avocat.tentation_adn` → `declenche` de la pièce décisive, `avocat.ack_decisive` → `apres` de la case décisive, et retire une éventuelle clé `attention` obsolète). Le jeu, lui, ne migre pas : un vieux `content.js` reste valide mais perd ces deux répliques (et ignore l'`attention` résiduelle) — repasser par l'atelier.

## 5. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`).

> **Les tests ne nomment aucun contenu.** Ni pièce, ni case, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice(w)` (le lien qui porte `vice:true`), `caseParLeve(w,"vice_trouve")`, `niveau1(w)` (verrouille chaque case obligatoire avec **sa** bonne réponse, dans l'ordre des remises), `pairesBruit(w,n)` / `noterBruit(w,n)` (paires quelconques, pour vérifier que noter reste gratuit et illimité), `pidAvecDeclenche`, `pidRegle`, `terminer(w)`/`numeroFin`. Pour l'atelier, qui manipule un contenu brut, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (18) | le jeu, contenu **embarqué** | O5 (index, marqueurs) ; noter est gratuit et illimité (pas de compteur, pas de plafond, pas d'oubli — P0 retiré) ; dédoublonnage A↔B ; le vice à canal unique (une exigence voisine conforme ne lève rien) ; les fins 1 et 3 |
| `test_declencheurs.js` (22) | le jeu, contenus **mutés** injectés inline | le décâblage : remises généralisées et renommages libres, `declenche`/`apres`, Manuels par type et sans directives, case conditionnelle (invisible, non bloquante, privée, `leve`), les trois fins sous les deux marches (dont « pressentir sans conclure → Fin 3 »), dims par pièce, rejet d'un contenu sans `relations` |
| `test_autre_affaire.js` (16) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite de forme différente (3 remises, 3 cases obligatoires, vice reliant une pièce de la remise 1 à une règle de la remise 3) se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (23) | le jeu | l'ergonomie et le grain fin : sélection/désélection de paire, modale de pièce, marqueurs vus, rep_faux et drapeau du plaidé, escalade partagée inutile/sans-rapport, `lien.rep`, répétition (deja, non-représentation, refus de confirmer pendant), `variante_faux` des fins |
| `test_sauvegarde.js` (16) | le jeu | la partie survit au rechargement (état, Set, répétition en cours, `une_fois` non rejoué), la signature jette une sauvegarde d'un autre contenu, la fin efface, recommencer confirme avant d'effacer |
| `smoke_atelier.js` (54) | l'atelier + le couple atelier→jeu | SEED sans erreur, diagnostic qui attrape le câblage cassé (dont le vice à canal unique — plus d'avert « canaux indépendants » depuis que les scellés sont conformes), migration des vieux contenus (dont la clé `attention` retirée), éditeur de cases, **renommage d'ids** (pièces : liens/remises/_pos réécrits ; cases), autosave rechargé, surcharges de dims, le « qui » des répliques joué par le moteur, pastilles des drapeaux `leve`, export estampillé `schema: 2`, simulation des trois fins, export adopté et joué par le moteur |

(`test_boucle.js` et `smoke3.js` étaient les suites d'avant le décâblage — leurs terrains sont couverts par celles-ci ; `test_parcours.js` a été réécrite sur le harnais commun ; `test_p0_o5.js` a été remplacée par `test_o5.js` au retrait du budget d'attention.)

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes.** (`grammaire/test_grammaire2.js` est un septième script, mais c'est un banc d'essai de démonstration — pas de code de sortie, pas dans `npm test`. Voir §7.)

## 6. Résumé en trois phrases

Le contenu s'écrit dans l'atelier et voyage en un seul fichier, `content.js`, que le jeu charge tel quel — les versions embarquées ne sont que des filets. Les règles du jeu n'ont qu'une maison, le code de `index.html` ; l'atelier les reflète (badges ⚙) pour qu'on puisse *voir* et *simuler* le déroulé, au prix d'une resynchronisation manuelle listée ci‑dessus. Le doc de conception reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

## 7. Le prototype de grammaire (non branché)

`grammaire/grammaire2.js` explore un remplacement du geste actuel (champ + relation + champ, vocabulaire fermé) par un **texte à trous** : une machine à états (`GRAMMAIRE.blocs`) qui compose une phrase bloc par bloc, où chaque **forme** (`identite_oui`, `anteriorite`, `infraction`…) déclare par `slots` les dimensions qu'elle admet à chaque position. Une différence clé avec le moteur actuel : un terme peut être un **champ** ou une **note déjà composée** (`source:"note"`), ce qui permet la chaîne du vice en deux phrases (« ces deux agents sont la même chose » → « ce qui précède est contraire à l'article 7 ») plutôt qu'un seul clic.

`grammaire/test_grammaire2.js` est un **banc d'essai**, pas une suite pass/fail : il imprime son verdict (693 phrases légales → 72 sensées → 7 qui portent un lien du contenu) sans fixer de code de sortie. `npm run demo:grammaire` le lance.

**Ce prototype n'est pas branché sur `app/index.html`** : le jeu utilise toujours `noter()`/`choisirChamp()`. L'intégrer demanderait (dans cet ordre, par prudence — chaque étape re-teste) :
1. Charger `grammaire2.js` (ou son équivalent versionné) depuis le jeu et l'atelier.
2. Remplacer `noter()` par un `composer()` qui déplie les blocs, dépile les termes, réduit et appelle `valider()`.
3. Un éditeur de liens dans l'atelier qui parle en formes/slots plutôt qu'en paires de champs (commencer par une saisie textuelle brute, migrer ensuite).
4. Vérifier que la marge de bruit (phrases sensées sans lien) reste non nulle — sinon « sensé » vaudrait « correct » et l'interface trahirait un des invariants du §8 de `conception_jeu_ia.md`.

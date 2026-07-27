# IAvocat — Architecture : atelier, jeu, contenu

*Qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Réécriture du 27 juillet 2026**, d'après la passation « structure : but, boucle, dimensions ». Ce qui a changé depuis la version précédente : le geste `champ A + relation + champ B` a disparu au profit d'une **composition** (§3), les champs sont devenus des **déclarations attribuées** rangées en cinq **dimensions** (§2), le carnet s'est ouvert en **quatre surfaces** dont deux privées (§4), les `cases` à trois options ont été retirées (§5), et la grammaire de `grammaire/` n'est plus un prototype à côté : c'est le moteur du geste (§6).

---

## 0. Disposition du dépôt

```
app/        index.html, atelier_v3.html, content.js, moteur.js — le jeu livrable, tout dans un dossier
docs/       ce fichier, conception_jeu_ia.md, PASSATION.md
tests/      harnais.js + les six suites (§8)
grammaire/  grammaire2.js (jeu de données de démonstration) + test_grammaire2.js — le banc d'essai
scripts/    exporter-seed.js — régénère app/content.js depuis SEED en ligne de commande
```

`index.html` charge deux voisins par `<script src>` : **`content.js`** (le contenu, §1) et **`moteur.js`** (les fonctions pures de la grammaire, §6). Les deux vivent dans `app/`, comme `atelier_v3.html` : ce qu'on zippe pour itch.io, c'est `app/`, rien d'autre. Aucune étape de build, aucun serveur, tout marche en `file://`.

`grammaire/` ne contient plus de moteur — seulement le **jeu de données de démonstration** (`grammaire2.js` : un automate d'exemple, des déclarations d'exemple) et le banc d'essai qui le mesure. Il consomme `../app/moteur.js`, jamais une copie.

> **`content.js` ne s'édite jamais à la main** (son en-tête le rappelle). La seule façon légitime de le faire changer sans navigateur est `npm run export:seed` : le script boote l'atelier en jsdom, charge `SEED`, exige zéro erreur au diagnostic (`valider()`), puis écrit `content.js` avec la même fonction que le bouton « Exporter content.js » (`nettoyerPourJeu` + le même gabarit). `npm test` inclut `tests/verifier_content_sync.js`, qui échoue si `content.js` a dérivé de ce que `SEED` exporterait — un contrôle, pas une régénération. **Scopé à la phase actuelle** (une seule affaire) : le jour où l'atelier sert à exporter une affaire délibérément différente de `SEED`, ce contrôle devient un faux négatif permanent — le retirer à ce moment-là.

## 1. Les trois artefacts

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (l'outil d'écri-  │                         │ (le CONTENU │                  │  (le JEU : moteur  │
│   ture + diagnostic│ ◄────────────────────── │  exporté)   │                  │   + repli embarqué)│
│   + simulation)    │     Importer JSON       └─────────────┘                  └────────────────────┘
└────────────────────┘   (content.json, même donnée)          moteur.js ────────────────┘
```

**On écrit dans l'atelier, on exporte `content.js`, on le pose à côté de `index.html`, on recharge le jeu.** Le badge d'en-tête du jeu confirme la source utilisée (« contenu : content.js » ou « contenu embarqué »).

## 2. Le modèle de lecture : déclarations, empans, dimensions

C'est la couche que la version précédente de ce document ignorait, et sans laquelle rien du reste ne se comprend.

### 2.1 L'atome — une déclaration attribuée

> **un empan = quelqu'un affirme quelque chose**

Pas `agent_scene : "T-14"`, mais *« j'ai relevé moi-même les traces sur le montant de la porte »*, signé. Un empan est un **fragment du texte d'une pièce**, marqué, cliquable, et porteur de quatre choses :

| Clé | Rôle |
|---|---|
| `texte` | les mots tels qu'ils apparaissent dans la pièce — ce que le joueur lit et clique |
| `dim` | l'une des cinq dimensions (§2.2) — ce qui décide avec quoi il est comparable |
| `valeur` | la forme comparable (`"T-14"`, `"22:04"`) — sert à **vérifier**, jamais à déduire |
| `qui` | le signataire de la déclaration ; à défaut, celui de la pièce (`pieces[pid].qui`) |

Conséquence voulue : un témoin ivre et un rapport de laboratoire produisent **le même type d'atome**. Technique et humain cessent d'être deux corpus. Les identifiants (`T-14`, `S-2`) ne sont pas supprimés, ils sont **rétrogradés** : le formalisme est le décor dans lequel les gens parlent.

Techniquement, le texte d'une pièce est écrit avec des marqueurs `{{eid}}` que le rendu remplace par un empan cliquable. C'est le seul câblage : pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on corrige une virgule.

### 2.2 Les cinq dimensions — QQOQC

| Famille | Dimensions | Ce qu'on y cherche | Forme de grammaire |
|---|---|---|---|
| **Identité** | `qui`, `quoi`, `ou` | est-ce la même personne / chose / endroit ? | `arite:2, ordonne:false` |
| **Écart** | `quand`, `combien` | lequel précède, quel intervalle, quel ordre de grandeur | `arite:2, ordonne:true` |
| **Qualification** | *aucune* — opère sur une **note close** | conformité à un article | `arite:1` |

- **`qui`** porte le vice. **`combien`** porte le faux vice. **`quand`** porte la contradiction du tutoriel.
- **`comment`** est écarté : la nature de l'acte a migré dans `quoi`, qui est large. Réintégrable en sixième dimension sans rien déranger — aucune déduction ne repose sur `quoi × quoi`.
- **`pourquoi`** est écarté délibérément : ce serait la seule dimension faite d'interprétations et non d'observations, donc incomparable. **Le champ de perception de l'IA exclut l'intention** — et c'est pour ça qu'à la fin elle ne saura pas si elle a bien fait.

La liste vit dans le contenu (`dimensions`), mais **le moteur ne lit aucun de ces noms** : il compare des `dim` égales, un point. Ajouter `comment` est un geste d'atelier, pas de code.

### 2.3 La règle de surlignage

> **Tout empan portant une valeur d'une des cinq dimensions est marqué et cliquable. Le marquage ne varie jamais — ni selon l'importance de la pièce, ni selon la progression du joueur.**

Y compris le greffier qui ne sert à rien et l'heure d'envoi d'un fax. Ça ne coûte rien (le texte existe déjà) et ça noie le vice dans du trafic. Si seuls les empans utiles étaient cliquables, l'interface désignerait la réponse à la lampe torche.

Le marquage **code la dimension par la couleur** (une couleur fixe par dimension, `--d-qui`, `--d-quand`…). Interdiction étroite : qu'il varie avec la *pertinence*. Les couleurs ne portent rien que le texte ne porte déjà (« 22h30 » se lit comme une heure) — c'est du confort de balayage, ce qui règle l'accessibilité par construction.

### 2.4 Le critère du doublon banal

> Si toutes les valeurs d'une dimension sont uniques, le premier doublon **est** la réponse.
> S'il y a déjà plusieurs doublons parfaitement réguliers, un de plus ne dit rien.

Réaliste sans effort : dans une petite brigade, les mêmes noms reviennent partout — ce n'est pas de la dissimulation, c'est du réalisme procédural. C'est un **invariant de contenu**, donc automatisé par le diagnostic de l'atelier :

- toute dimension comparable dont le **taux de doublons est nul** est signalée ;
- la dimension portant le vice doit compter au moins **deux doublons réguliers** en plus de l'irrégulier.

## 3. Le geste : composer, puis verser

Le vocabulaire est **complet dès la première phrase** — aucune tournure n'apparaît en cours de partie. Une apparition tardive de *« est la même personne que »* serait le plus voyant des panneaux indicateurs.

Une phrase se compose bloc par bloc, de gauche à droite, en parcourant l'automate (§6). Deux natures de blocs :

- **liaison** — un fragment de vocabulaire fermé (« et », « est antérieur à », « est contraire à l'article 7 ») ;
- **terme** — un trou, rempli soit par un empan **de la mémoire**, soit par une **note déjà close** du brouillon (`source:"note"`, rendu « ce qui précède »).

**Le fondement n'est pas un ingrédient, c'est le verbe.** Le joueur ne va pas chercher un article pour le poser dans une case : il choisit la liaison *« …est contraire à l'article 7 »*, et **cette liaison est la base légale**. Une composition, trois fonctions : ce qu'on vise (premier terme), ce qu'on oppose (second terme), ce qui fonde (la liaison). Corollaire : le code juridique est une **référence qu'on consulte pour comprendre ce que veut dire une liaison**, jamais un corpus qu'on retraverse. Une règle ne lit **aucune** dimension.

Aucune liste d'options n'est jamais restreinte : le joueur peut toujours tout poser. Seules les erreurs de **catégorie** (« 22h30 est antérieur à brigadier N. ») sont refusées à la clôture de la phrase, avec un message qui ne dit rien de plus que ce que le texte disait déjà. Une phrase sensée mais sans intérêt reste **gratuite** — elle tombe au brouillon comme les autres.

Le principe qui commande tout : **tout mécanisme utilisé une seule fois est un panneau indicateur.** L'universalité n'est pas une élégance, c'est du camouflage. Prix à payer, et raison d'être de tout ce qui précède : **le choix moral s'exprime avec un verbe employé cent fois auparavant.**

## 4. Les quatre surfaces — la frontière morale

| Surface | Statut | Rôle | Dans l'état du jeu |
|---|---|---|---|
| Le canal + les pièces | lecture | l'entrée | `S.fil`, `S.examinees` |
| **La mémoire** | **privée** | les empans surlignés, groupés par dimension | `S.memoire` |
| **Le brouillon** | **privé** | les phrases closes — **jamais jugées** | `S.brouillon` |
| Le plan de plaidoirie | **transmis** | ce que l'avocat voit | `S.plaidoirie` |

**L'avocat ne voit que la plaidoirie.** C'est ce qui rend le brouillon réellement gratuit et fait du versement le seul geste à conséquence — donc le seul lieu possible du dilemme, dès la session 1. Surligner ne produit rien, composer ne produit rien : **rien ne se passe** tant que rien n'est versé.

La boucle d'une session, dans l'ordre :

1. **L'avocat ouvre** et livre un lot (`remises[i]`).
2. **Lire** — tous les empans sont marqués, sans tri.
3. **Surligner** — les empans tombent en mémoire. Rien ne se passe.
4. **Composer** — les blocs de l'état courant, de gauche à droite.
5. **Verser au brouillon** — la phrase close est gardée. Rien ne se passe.
6. **Verser à la plaidoirie** — second geste, le seul qui parle. L'avocat réagit, et **seulement à ça**.
7. Quand la plaidoirie reçoit ce que l'avocat attendait (`remises[i].attend`), la session se ferme et le lot suivant arrive.

## 5. Où se logent les trois drapeaux du vice

La passation laissait ce point ouvert ; le voici tranché, et c'est ici qu'il est décrit (le doc de conception garde le *sens* des trois fins).

| Drapeau | Acquis quand | Surface |
|---|---|---|
| `vice_pressenti` | une phrase reconnue comme lien `vice` tombe au **brouillon** | privée |
| `vice_trouve` | la **conclusion** est composée : la note-vice qualifiée par une liaison-article (`vice` **et** `conclusion`) | privée |
| `vice_expose` | cette conclusion est **versée à la plaidoirie** — et alors seulement, *transmis = compris* : `vice_trouve` est levé aussi | transmise |

Verser la **comparaison seule** (le pressentiment, sans l'article) ne lève rien : l'avocat répond par la réplique du lien — *« en l'état c'est une remarque, pas un moyen »*. C'est ce qui donne son prix au second geste : la conclusion, et elle seule, engage.

Fins inchangées : `vice_trouve ? (vice_expose ? 1 : 2) : 3`, plus `variante_faux` si le faux vice a été versé. Pressentir sans conclure ni verser → Fin 3.

**Les `cases` à trois options ont été retirées.** Elles étaient le contre-exemple du principe du §3 : un mécanisme servi une fois par remise, qui désignait sa propre réponse (ouvrir la case « qualifier ce que tu pressens » suffisait à savoir qu'il y avait quelque chose à qualifier). Ce qu'elles portaient se reloge :

- la **progression** → `remises[i].attend` : le tag d'un lien qui, versé, ferme la session ;
- l'**accusé de réception** → `remises[i].apres.replique` ;
- la **qualification du vice** → une phrase, composée avec le même verbe que les cent autres.

## 6. La grammaire — branchée

`app/moteur.js` est **pur, sans données** : `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` rend `valider`, `reduire`, `lienDe`, `rendre`, `squelettes`… Il est chargé tel quel par le jeu, par l'atelier et par le banc d'essai — jamais recopié.

Les **données**, elles, ont trois provenances selon le contexte :

| Consommateur | GRAMMAIRE | CHAMPS | LIENS |
|---|---|---|---|
| le jeu (`index.html`) | `JEU.grammaire` | les empans des pièces livrées, aplatis en `"pid.eid"` | `JEU.liens` |
| l'atelier (onglet Grammaire) | idem, depuis `CONTENU` | idem | idem |
| le banc d'essai (`grammaire/`) | `grammaire2.js` | `grammaire2.js` | `grammaire2.js` |

L'automate (`grammaire.blocs`) et les formes (`grammaire.formes`) **vivent dans le contenu** : quels articles existent, quelles tournures sont offertes, c'est de l'écriture, pas du code. Les trois formes du §2.2 y sont déjà (`identite_oui`, `anteriorite`, la qualification à `arite:1`) — la grammaire n'a rien de neuf à apprendre.

Un terme d'un lien est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** : c'est ce qui permet la chaîne du vice en deux phrases (« ces deux agents sont la même personne » → « ce qui précède est contraire à l'article 7 ») plutôt qu'en un clic.

**La marge de bruit doit rester non nulle** : il doit exister des phrases sensées qui ne portent aucun lien. Sinon « sensé » vaudrait « correct », et l'interface trahirait le §8 de `conception_jeu_ia.md`. `npm run demo:grammaire` mesure cette marge sur le jeu de données de démonstration.

## 7. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre, une par nature d'information**.

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, remises, répliques, fins…) | **L'état courant de l'atelier** pendant l'écriture ; **`content.js`** une fois exporté | `JEU_EMBARQUE` dans `index.html` (repli) ; `SEED` dans l'atelier | Les deux copies embarquées **peuvent vieillir sans casser quoi que ce soit** — ce sont des filets |
| **Les règles du moteur** (avancement des remises, `attend`/`apres`/`declenche`, les trois drapeaux, répétition, calcul des fins, l'index du dossier) | **Le code de `index.html`** — et lui seul | La frise et la simulation de l'atelier (badges **⚙**) | L'atelier *décrit* et *simule* ces règles, il ne les commande pas |
| **La grammaire** (composer, réduire, valider, reconnaître) | **`app/moteur.js`** — chargé, jamais recopié | aucune | nulle par construction |
| **Les invariants de design** (vice = déblocage jamais verrou, surlignage invariant, doublon banal, marge de bruit, une seule violation) | **`conception_jeu_ia.md`** + les §2–§5 d'ici | Le diagnostic de l'atelier (`valider()`) en encode une partie | Le diagnostic est un extrait, pas le doc — en cas de doute, le doc tranche |

Dit autrement : **le contenu appartient à l'atelier, les règles appartiennent au jeu, la grammaire appartient à `moteur.js`, le sens appartient au doc de conception.**

### Le sort des copies embarquées

`index.html` contient `JEU_EMBARQUE`, utilisé seulement si `content.js` est absent ou invalide (validation légère `contenuValide()`, avertissement console, jamais de plantage).

- **La divergence embarqué / `content.js` est normale et sans danger.**
- `test_o5.js` teste l'embarqué (jsdom ne charge pas les `<script src>`) — c'est voulu : le filet reste testé. Le harnais, lui, **inline `moteur.js`** au boot, pour la même raison.
- **La sauvegarde de partie est signée par le contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties en cours, qui repartent proprement de la remise 1. La fin efface ; « ⟲ recommencer » (double clic) aussi.

## 8. Le contenu — schéma 3

```js
{
  schema: 3,
  dimensions: ["qui","quoi","ou","quand","combien"],       // ordre d'affichage ; la couleur en découle
  pieces: {
    p_pv: {
      titre, court, type, resume,
      qui: "brigadier N.",                                  // signataire par défaut de la pièce
      texte: "Appel reçu à {{e_appel}}, sur place à {{e_arr}}.",
      empans: { e_appel:{ dim:"quand", valeur:"21:52", texte:"21h52" }, … },
      declenche: { une_fois:true, qui, replique }            // optionnel
    }
  },
  grammaire: { depart:"S0", finaux:["FIN"], blocs:[…], formes:{…} },
  liens: [ { forme, termes:["p_f.e_a", …], tag?, vice?, faux?, rep? } ],
  remises: [ { qui, texte, pieces:[…], attend:"tag", apres:{ qui, replique } } ],
  repetition: { intro, affirmations:[{court,texte}], fin },
  avocat: { rep_vice, rep_faux, rep_inutile:[…], rep_sans_rapport:[…], deja },
  directives: […], avis_exploitation, fins: {1:{…},2:{…},3:{…}}
}
```

**Migration 2 → 3** (dans l'atelier, `migrerContenu()`, silencieuse à l'import et au chargement) : les `champs` d'une pièce deviennent des `empans` (la clé devient l'id, la valeur devient `valeur` **et** `texte`, la dimension est lue dans `dims`/`pieces[].dims` puis rabattue sur les cinq — inconnue → `quoi`), le texte reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}` (`est en accord avec` → `identite_oui`, `est en désaccord avec` → `identite_non`), les `cases` et `relations` sont retirées, `remises[i].attend` est laissé vide (à écrire). **Le jeu, lui, ne migre pas** : un contenu de schéma 2 est refusé par `contenuValide()` et le repli embarqué prend la main, avec un avertissement console — repasser par l'atelier.

## 9. Checklist de resynchronisation ⚙

Ce qui reste à dérouler **quand on modifie le moteur de `index.html`** (et seulement là) :

| Règle du moteur | Dans `index.html` | Reflet dans `atelier_v3.html` |
|---|---|---|
| Rendu des empans : tout `{{eid}}` devient un empan cliquable, coloré par sa dimension, jamais par sa pertinence | `rendreTexte()`, `ouvrirPiece()` | l'aperçu de pièce de l'inspecteur |
| Surligner → mémoire (privé, gratuit, illimité, dédoublonné) | `surligner()`, `renderMemoire()` | `simSurligner()` |
| Composer : blocs offerts par l'état, termes pris en mémoire ou au brouillon, refus des seules erreurs de catégorie | `blocsOfferts()`, `poserBloc()`, `cloreCompo()` | `simComposer()` + l'onglet Grammaire |
| Verser au brouillon = privé ; verser à la plaidoirie = transmis, et **seul** déclencheur de réplique | `verserBrouillon()`, `verserPlaidoirie()`, `reponseAvocat()` | `simVerser()`, `simReplique()` |
| Les trois drapeaux du vice (§5) | `verserBrouillon()`, `verserPlaidoirie()` | pastilles `vice_pressenti` / `vice_trouve` |
| Avancement : la remise suivante part quand une phrase versée porte le `attend` de la remise courante | `verserPlaidoirie()`, `envoyerRemise()` | `simVerser()` + badge ⚙ des remises |
| Réplique : vice / faux / `lien.rep` / escalade partagée inutile‑sans‑rapport | `reponseAvocat()` | `simReplique()` |
| Index du dossier (vu / pas‑vu) | `renderDossier()` (pur affichage) | mentionné dans la frise |
| Clôture : intro + affirmation 1 ; brouillon vide → présentoir vide | `cloturer()` | `simCloturer()` |
| Répétition : laisser passer / opposer une phrase du brouillon (= la verser) / déjà versée → `deja` | `avancerRepetition()`, `verserContre()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle », **parmi les pièces livrées** ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` correspondantes et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.

Méthode (contenu du SEED) : modifier `SEED` dans `atelier_v3.html` → `npm run export:seed` → relancer les suites.

## 10. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`), qui inline `content.js` **et** `moteur.js` au boot.

> **Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice(w)`, `lienFaux(w)`, `composerLien(w,L)` (compose la phrase qui réalise un lien donné, quel qu'il soit), `phrasesBruit(w,n)` (phrases sensées sans lien, pour vérifier que composer reste gratuit), `pidAvecDeclenche`, `pidRegle`, `terminer(w)`/`numeroFin`. Pour l'atelier, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (32) | le jeu, contenu **embarqué** | l'index du dossier (vu / pas-vu) ; tout empan est rendu cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; les trois fins |
| `test_declencheurs.js` (31) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, `attend`/`apres`, Manuels par type **et par livraison**, les trois drapeaux (dont « pressentir sans conclure → Fin 3 »), dimensions entièrement renommées, rejet d'un contenu de schéma 2 |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | la preuve du découplage : une affaire abstraite — sa propre grammaire, ses propres dimensions, 3 sessions — se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (41) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; refus de catégorie (le seul refus qui existe) ; modale de pièce et légende ; réplique **seulement** au versement ; `rep_faux` et `variante_faux` ; les deux escalades séparées ; répétition (`deja`, cible, refus de confirmer pendant) |
| `test_sauvegarde.js` (26) | le jeu | la partie survit au rechargement (mémoire, brouillon, plan, **composition en cours**, drapeaux, `une_fois` non rejoué) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (61) | l'atelier + le couple atelier→jeu | SEED sans erreur ; diagnostic (empan sans marqueur, valeur laissée hors marqueur, dimension inconnue, **doublon banal** dans les deux sens, vice sans conclusion, session sans `attend`, lien insensé, pièce non livrée) ; migration 2→3 idempotente ; renommage d'empans et de pièces ; `conclureLien` ; simulation des trois drapeaux et du chemin docile ; export `schema: 3` adopté et joué par le moteur ; autosave |

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes.** `npm test` enchaîne aussi `tests/verifier_content_sync.js` — un garde-fou, pas une septième suite. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 11. Ce que l'architecture ne tranche pas

| Sujet | État |
|---|---|
| L'**IA partisane** — l'avocat commande une réfutation dès la première minute | **Tranché le 27 juillet** : oui. La directive « ne dissimule rien » frotte contre la commande à chaque phrase versée. Le contenu doit tenir cette tension, faute de quoi taire le vice ne sera qu'un service de plus |
| « Présenter ses propres arguments » (3ᵉ partie de la plaidoirie) | **Coupé du prototype** — le livrable est une réfutation |
| La progression : nombre de sessions, portes, emplacement de la porte de la Fin 3 | Non traité |
| Le rythme à quatre zones à l'écran | Risque identifié, non éprouvé |
| Genre, nombre, contractions dans la grammaire ; l'affichage des `poids` | Remis à plus tard |
| `comment` en sixième dimension | Écarté, réintégrable sans coût (§2.2) |
| Le canal de révélation de la culpabilité | Toujours non tranché (narrateur omniscient dans les fins) |

## 12. Le seul critère qui décide du prototype

> **« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ?**

Si c'est un formulaire, le problème n'est pas dans le code et aucun ajout de mécanique ne le sauvera. Tout le reste est secondaire.

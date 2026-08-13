# IAvocat — Architecture

*Comment le jeu est fait : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Le sens est l'arbitre, et il est ailleurs.** `docs/CONCEPTION.md` (§1 à §7) dit ce que le jeu veut
> dire ; ci-dessous, l'outillage qui l'exécute. En cas d'écart entre les deux, c'est la conception qui
> tranche. Ce qui reste à resynchroniser se dit au §15.
>
> **Les numéros de section sont uniques dans tout le dépôt**, et se répartissent en trois fichiers :
> **§1 à §7** dans `docs/CONCEPTION.md`, **§8.1 à §8.9** dans `docs/ECRITURE.md`, **§9 à §17** dans
> `docs/ARCHITECTURE.md`. Un renvoi écrit « §4.5 » ou « §12 » tombe donc juste **sans nommer son
> fichier**, et c'est voulu : le numéro est l'adresse, le fichier n'est que l'étagère. **R11 du
> gardien vérifie qu'aucun renvoi du dépôt ne pointe dans le vide.**
>
> Pour le choix des mots eux-mêmes (empan/passage, lien/liaison…), voir `docs/LEXIQUE.md`, qui arbitre
> le vocabulaire sans jamais trancher le sens. Où vit une chose : `docs/CARTE.md`. Ce qui a été
> tranché : `docs/HISTORIQUE.md`. Le récit des pannes déjà réparées : §2 de `docs/PASSATION.md`.
>
> **Le corps du texte décrit l'état actuel, pas la façon dont on y est arrivé.**

**État au 14 août 2026.**

## 9. Disposition du dépôt

**L'inventaire est dans `docs/CARTE.md`, pas ici.** Quel fichier porte quoi, avec sa taille, dans quel ordre les huit modules de l'atelier se chargent, quels quatre gestes `noyau.js` porte en section *2 bis* — la carte le dit, et **R8 du gardien vérifie que ses tailles sont réelles**, ce qu'aucune ligne de prose ne saurait faire. La division est celle que la carte annonce elle-même : *elle localise, elle n'explique pas ; ce § explique et ne localise pas.* Quatre dossiers, pour situer : `app/` (le livrable — c'est ce dossier, et lui seul, qu'on zippe), `docs/`, `tests/` (§16), `grammaire/` (le banc d'essai).

**La règle de rangement, en une phrase :** *le contenu ne contient aucune règle, les règles ne contiennent aucun contenu, l'interface ne décide rien, et l'atelier ne recopie rien.* `index.html` et `atelier_v3.html` chargent les mêmes trois voisins par `<script src>` — aucune étape de build, aucun serveur, tout marche en `file://`.

**Une page ne porte plus que sa structure.** Ni `<style>`, ni `<script>` en ligne : le CSS part en `<link>`, le JS en `<script src>`. Ça ne change rien à l'exécution — un script classique externe partage la même portée globale qu'un script en ligne, et les déclarations de fonction restent des propriétés de `window`, ce dont dépendent tous les `onclick=` du HTML engendré. Ça change ce qu'on ouvre quand on cherche quelque chose.

**« L'atelier ne recopie rien » vaut aussi de lui-même.** La règle de rangement visait le jeu : ne pas
réécrire une règle que `regles.js` porte déjà. Elle a une seconde moitié : **l'atelier ne se recopie
pas lui-même non plus.** Découper un gros fichier range les outils ; ça ne dégraisse rien, et ça peut
même cacher les copies en les éloignant. `noyau.js` porte donc, en section *2 bis*, les **quatre
gestes** que tous les autres refont : `muter` (l'épilogue d'une mutation — annuler, persister,
redessiner), `poserOuRetirer` (écrire une valeur, ou retirer la clé quand elle est vide, pour
qu'aucune clé vide ne parte à l'export), `reinitSelection` (ce qu'une sélection laisse derrière elle)
et `demanderSuppr`/`btnSuppr` (la suppression en deux clics, et le bouton qui l'annonce — les deux
moitiés d'un même geste, qui doivent s'accorder). Avec eux, deux **formats** qui ne se déplient plus
qu'en un endroit : `deK(k)`, l'inverse de `K(pid, ch)`, et `reecrireTermes(t, f)`, la marche récursive
sur les termes emboîtés du schéma 3.

Ce ne sont **pas** des règles du jeu, et ils ne doivent jamais le devenir : `regles.js` reste la seule
maison de ce qui décide (§12). Ce sont les gestes d'un **outil d'écriture** — ce qui explique qu'ils
vivent chez lui et non dans un module partagé.

**Pourquoi l'atelier est un dossier et pas un fichier.** Il portait cinq outils dans un seul fichier ; chacun a maintenant le sien, et la page ne garde que son HTML, son CSS et six lignes de démarrage. Les modules se chargent en **portée globale classique**, jamais en modules ES : c'est ce qui laisse intacts les cinquante-neuf `onclick=`/`onchange=` du HTML — les réécrire aurait été le vrai coût du découpage — et ce qui préserve le « zéro build ». **L'ordre des balises compte**, mais moins qu'il n'y paraît : les fonctions se voient entre fichiers par *hoisting*, résolues à l'appel ; seul `noyau.js` exécute son corps au chargement (son `let CONTENU = contenuLivre()`), il vient donc en premier.

**Le corollaire, qui a mordu :** un nom de haut niveau dans `moteur.js` ou `regles.js` est un nom **pris dans la page qui les charge**. `couleurDim` y heurtait celui d'`index.html`. Les projections du §14 et le prédicat `estRegle` sont donc **cloîtrés** dans une fermeture, et ne sortent que par `MoteurGrammaire.x` / `ReglesJeu.x`. C'est le piège symétrique de celui de `PASSATION.md` §2 : les `const` de haut niveau ne sont pas des propriétés de `window`, mais ils occupent quand même le nom.

`grammaire/` ne contient pas de moteur — seulement le **jeu de données de démonstration** (`grammaire2.js`, écrit à l'ancienne avec des liaisons explicites) et le banc d'essai qui le mesure. Il consomme `../app/moteur.js`, jamais une copie ; qu'il continue de tourner sans retouche est la preuve permanente que la rétrocompatibilité annoncée au §11 est réelle.

Le contenu **n'existe qu'en un exemplaire**, chargé tel quel par le jeu et l'atelier — pas de copie de secours embarquée, pas de graine de travail séparée. Si `content.js` manque ou est d'un schéma inconnu, le jeu ne joue pas autre chose en douce : il **le dit** dans un bandeau et ne démarre pas (§13).

## 10. Le cycle d'écriture

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (écriture +       │                         │ (LE CONTENU,│                  │  (l'interface)     │
│   diagnostic +     │ ◄────────────────────── │  exemplaire │ ◄─────────────── └────────────────────┘
│   pas-à-pas)       │      <script src>       │   unique)   │   moteur.js + regles.js
└────────────────────┘                         └─────────────┘
```

**L'atelier et le jeu lisent le même fichier.** L'atelier le charge au démarrage, on écrit, on exporte — et le fichier exporté **remplace celui qu'on vient de lire**. C'est un cycle, pas une chaîne : plus d'amont ni d'aval, donc plus de dérive possible. Le badge d'en-tête du jeu confirme la source (« contenu : content.js » — ou « contenu introuvable », et le bandeau explique).

## 11. Le contenu — schéma 3

```js
{
  schema: 3,
  dimensions: ["quand","qui","ou","quoi","combien"],       // ordre d'affichage ; la couleur en découle
  pieces: {
    p_pv: {
      titre, court, type, resume,                           // `resume` : atelier seulement, le jeu ne l'affiche pas
      porte: ["qui","quoi"],                                // RÈGLES seulement : ce que l'article régit
      qui: "brigadier N.",                                  // signataire par défaut de la pièce
      texte: "Appel reçu à {{e_appel}}, sur place à {{e_arr}}.",
      empans: { e_appel:{ dim:"quand", valeur:"21:52",
                          texte:"l'appel nous est parvenu à 21h52",  // ce qui se lit dans la pièce
                          nom:"l'heure de l'appel" }, … },           // ce qui parle dans une phrase
      declenche: { une_fois:true, qui, replique }            // optionnel
    }
  },
  grammaire: { depart:"S0", finaux:["FIN"], blocs:[…], formes:{…} },
  liens: [ { forme, termes:["p_f.e_a", …], tag?, vice?, conclusion?, faux?, rep? } ],
  remises: [ { qui, texte, pieces:[…],
               attentes:[ { question?, attend:"tag", apres?:{ qui, replique } } ] } ],
  repetition: { intro, affirmations:[{court,texte}], fin },
  avocat: { rep_vice, rep_faux, rep_inutile:[…], rep_sans_rapport:[…], rep_hors_sujet:[…], deja },
  directives: […], avis_exploitation,                       // écrits, non lus par le jeu — voir §5
  fins: {1:{…},2:{…},3:{…}}
}
```

**Le texte à empans.** Le texte d'une pièce est écrit avec des marqueurs `{{eid}}` que le rendu remplace par un empan cliquable — pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on corrige une virgule. Le diagnostic exige que **tout empan déclaré porte son marqueur** (§4.3 rendue vérifiable).

**Le `nom` d'un empan est optionnel** (§4.1) : absent, le `texte` en tient lieu partout, ce qui permet d'ajouter le champ **sans changer de schéma**. Le diagnostic le signale par un avertissement, jamais une erreur.

**Attributs optionnels d'un bloc de grammaire**, sans effet quand ils sont absents : `imbrique: true` — la liaison **emboîte** ce qui a été composé comme terme unique de sa propre forme (sinon la dernière forme gagne, termes à plat) ; `deduit: true` — le bloc **clôt une paire**, fait déduire la forme des deux termes accumulés (§4.5) puis les range dans l'ordre canonique ; `piece` — le bloc n'est offert qu'une fois cette pièce livrée. **Il porte sur les liaisons *et* sur les termes** : les trois liaisons-articles l'emploient, et le bloc du **second** terme aussi, qui attend l'article 3 (§4.5) — c'est ce qui ferme la comparaison en session 1 ; `libelle` — le texte du bouton, quand il diffère de ce qui sera rendu (la liaison de citation, dont le bouton dit « Répondre — citer ce passage ») ; `cite: true` — la liaison fait écrire le terme qui la précède **par son nom et par sa citation**, avec la pièce d'où il sort (§4.1, §4.5), sans effet sur une comparaison dont le `patron` réécrit de toute façon les deux fragments.

**Les attentes d'une remise :** `attentes: [{question?, attend, apres?}]` — la suite de ce que l'avocat attend, servie dans l'ordre ; `question` est poussée dans la Discussion quand l'attente devient courante, `attend` est le tag comparé à celui du lien versé, `apres` l'accusé de réception. L'ancienne forme — `attend`/`apres` sur la remise elle-même — reste valide et se lit comme une liste à un élément (`test_autre_affaire.js` le vérifie). **Le schéma reste 3.** Répondre **dans le désordre** est accepté : l'attente servie est celle dont le tag correspond, la question reposée est la première encore non satisfaite.

**L'attribut optionnel d'une pièce :** `porte: [dimensions]`, sur une pièce de type « règle » uniquement — les dimensions que l'article gouverne, affiché mais **jamais lu par le moteur**. Le diagnostic exige qu'il soit renseigné sur toute règle livrée (avertissement) et que ses dimensions existent (erreur). **Une pièce de type « règle » ne porte aucun empan** — contrôle du diagnostic, pas contrainte du moteur : un article s'invoque, il ne se compare pas.

**Attributs optionnels d'une forme :** `deduction` — `"egalite"`, `"difference"` ou `"ordre"`, le prédicat que `deduire` évalue (sans lui, la forme n'est jamais déduite, seulement atteignable à l'ancienne) ; `sens` — `"asc"` (défaut) ou `"desc"` pour une forme `ordonne:true`, l'ordre canonique des deux termes ; `patron` — la phrase écrite d'un bloc, `{a}`/`{b}` (« {a} précède {b} »), **le seul endroit où l'accord se joue** (§8.8 de `docs/ECRITURE.md`), sans quoi le rendu retombe sur la concaténation des blocs. **L'ordre de déclaration des formes est signifiant** : `deduire` rend la première dont la dimension convient et dont le prédicat tient.

**Un terme d'un lien** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** — ce qui permet la chaîne du vice en une comparaison et sa continuation, plutôt qu'en un clic.

**Ce que le moteur garde alors que le contenu ne s'en sert plus :** la source `note` (un terme rempli par une phrase déjà close, jadis « ce qui précède ») et la **clôture sans forme** (jadis « en rester là »). Ni l'une ni l'autre ne figure dans l'affaire livrée ; le moteur et le jeu les supportent toujours, et `test_autre_affaire.js`, dont l'affaire abstraite emploie les deux, le vérifie à chaque exécution — *on ne retire pas une capacité du moteur parce que le contenu du jour ne s'en sert pas.*

**La liste des dimensions vit dans le contenu**, mais le moteur ne lit aucun de ces noms : il compare des `dim` égales, un point. Ajouter `comment` est un geste d'atelier, pas de code.

**Migration 2 → 3** (dans l'atelier, `migrerContenu()`, silencieuse à l'import et au chargement) : les `champs` d'une pièce deviennent des `empans`, le texte reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}`, l'accusé de réception d'une case migre sur **la première attente** de sa session, `cases`/`relations` sont retirés.

**La migration écrit la forme du §3, jamais l'ancienne.** L'accusé de réception va sur la **première attente** de la session, pas sur la remise — sans quoi il serait injoignable : `attentesDe` ne rend une paire que si `attend` existe sur la remise, donc un `apres` posé seul ne se lirait ni au jeu, ni à l'atelier, ni à l'inspecteur. **On n'invente aucune attente pour autant** : si la session n'en déclare aucune, l'accusé reste où il est — une attente sans `attend` serait trouvée non servie pour toujours par `attenteCourante`, et bloquerait la session. `migrerContenu` reste tenue par R9 en **lecture** seulement : c'est un convertisseur, il doit relire l'ancienne forme ; il ne l'écrit pas. **Le jeu, lui, ne migre pas** : un contenu de schéma 2 est refusé par `contenuValide()`, et le jeu **ne joue rien** — il affiche un bandeau qui nomme le cas (fichier absent, schéma trop ancien, clé manquante), repasser par l'atelier.

## 12. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre**, une par nature d'information — et aucune n'a de copie.

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins…) | **`app/content.js`** — chargé par le jeu *et* par l'atelier | aucune | **nulle par construction** |
| **Les règles du jeu** (avancement des sessions, `attend`/`apres`/`declenche`, les trois drapeaux, la Plaidoirie, la répétition, le calcul des fins) | **`app/regles.js`** — chargé, jamais recopié | aucune | **nulle par construction** |
| **La grammaire** (composer, réduire, valider, reconnaître) **et les projections du contenu** (§14) | **`app/moteur.js`** — chargé, jamais recopié | aucune | nulle par construction |
| **Le sens** (invariants, arbitrages, discipline d'écriture) | **La Partie I de ce fichier** | Le diagnostic de l'atelier (`diagnostiquer()`) en encode une partie | Le diagnostic est un extrait, pas le doc |

`app/regles.js` est **pur** : `creerRegles(JEU, M)` reçoit le contenu et la grammaire, et rend des fonctions qui prennent l'état `S` en argument explicite. Aucun DOM, aucun `localStorage`. Celles qui « parlent » poussent dans `S.fil`, qui est de l'état, pas de l'écran. Le pas-à-pas de l'atelier appelle **les mêmes fonctions, sur le même état** ; il ne peut pas dériver, parce qu'il n'y a pas deux textes à faire coïncider. Ce qui reste légitimement propre à l'atelier : le diagnostic, le graphe, la frise éditable, la migration 2→3, l'export.

**`index.html` n'enveloppe pas `regles.js`.** Il l'appelait autrefois à travers une vingtaine de fonctions homonymes ; la moitié ne faisait que lire, et cinq n'étaient appelées nulle part. La ligne de partage est maintenant nette, et c'est elle qu'il faut tenir :

> **Ce qui redessine reste une fonction d'ici ; ce qui lit s'écrit `R.x(S)` sur place.**

Restent donc les seules cibles de `onclick` — `poserBloc`, `envoyer`, `surligner`, `cloturer`… — qui font `R.x(S, …)` **puis** `rendreTout()`. Tout le reste (`R.blocsOfferts(S)`, `R.instructionComplete(S)`…) s'appelle où on en a besoin. **Les suites lisent le jeu de la même façon**, en `w.R.x(w.S)` : c'est un contrat, pas une commodité — le jour où une lecture n'a plus d'enveloppe, aucune suite ne casse.

Une seule différence subsiste, et elle est de nature, pas de règle : le pas-à-pas joue **au grain du lien** (« composer la phrase qui réalise ce lien ») là où le jeu joue **bloc à bloc**. Les deux passent par la même porte, `clorePhrase` — donc par le même dédoublonnage, les mêmes drapeaux, la même attente sur place.

## 13. Ce qui se passe quand `content.js` manque

Il n'y a pas de repli : c'est le prix de l'exemplaire unique, et un bon prix, parce qu'un repli silencieux fait *jouer autre chose* sans le dire. Fichier absent, schéma antérieur à 3, ou clé vitale manquante → le jeu affiche un **bandeau** qui nomme le cas, ne livre aucune session, et laisse l'écran vide ; `contenuValide()` reste le juge. **La sauvegarde de partie est signée par le contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties en cours, qui repartent de la session 1. Le harnais de test **inline tout `<script src>` ET tout `<link rel=stylesheet>`** au boot, parce que jsdom n'en charge aucun — ce sont les fichiers mêmes, relus sur le disque à chaque boot, ce qui permet au contenu de n'exister qu'en un exemplaire tout en restant testable. L'injection est **générique** (une regex sur les balises, dans l'ordre) et non une liste de chemins : ajouter un module ne demande plus d'y revenir, et un oubli ne se serait vu qu'en `ReferenceError` au milieu d'une suite.

**Pourquoi le CSS aussi**, alors qu'aucune suite ne lit jamais une couleur : parce que `getCSS()` en lit, lui. Les couleurs de trait du graphe (`app/atelier/graphe.js`) sortent de `getComputedStyle` sur `:root` — c'est le seul endroit du dépôt où du CSS traverse vers du JS. Or jsdom résout les variables d'un `<style>` en ligne et rend `""` pour un `<link>`. Sortir le CSS du HTML aurait donc changé ce que le graphe dessine sous test **sans qu'aucun contrôle ne bronche**. Le filet coûte trois lignes, et il a été posé *avant* le déplacement.

**Trois règles sur la balise de `jeu.js`**, portées en commentaire dans `index.html` parce qu'aucune n'est cosmétique : sur **une ligne, sans attribut** (la forme exacte que la regex reconnaît) ; **ni `defer` ni `async`, jamais** ; **après `content.js`**. Ce que la deuxième protège n'est pas ce qu'on croit : la regex est si stricte qu'un attribut de plus empêche l'inlinage **entièrement** — rien ne se charge, et quatre contrôles tombent aussitôt. C'est donc un argument pour garder la regex stricte, pas pour craindre un test vert sur une page cassée. R1 du gardien tient la forme, et l'écart se dit sur la balise au lieu de se dire en `ReferenceError` au milieu d'une suite.

**Ce que le harnais ne prouve jamais, du coup :** que les balises se chargent pour de vrai. C'est le seul emploi de `npm run vue` pour le jeu, et, pour l'atelier, d'une ouverture en `file://` — l'onglet Grammaire n'a même de moteur que là. Et `vue.js` ne le prouve pas non plus **en assertant** : il ne porte aucun contrôle, il sort en 1 sur une erreur JS de la page et dépose des captures. **La preuve du CSS est donc à l'œil, sur les captures** — une page sans style s'y voit d'un coup d'œil, ce qui est exactement le genre d'écart qu'aucune suite ne verra jamais. (Une preuve automatique serait à écrire : lire `cssRules` d'une feuille `file://` lève une `SecurityError`, il faudrait passer par `getComputedStyle` sur des propriétés choisies. Personne ne l'a fait, et tant que `vue.js` n'asserte rien, il ne faut pas croire que si.)

## 14. La grammaire — branchée

`app/moteur.js` est **pur, sans données** : `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` rend `valider`, `reduire`, `lienDe`, `rendre`, `squelettes`… chargé tel quel par le jeu, l'atelier et le banc d'essai, jamais recopié.

**Accumuler, pas écraser.** `reduire(ch)` parcourt la chaîne de blocs en empilant les termes et en retenant la forme courante ; à la rencontre d'un bloc `imbrique` (§11), ce qui a été accumulé devient le **terme unique** de la nouvelle forme. `rendre(ch)` écrit le `nom` d'un empan (§4.1) et non sa citation, avec repli sur `texte`, sans espace devant un fragment qui commence par une ponctuation (§8.8 de `docs/ECRITURE.md`).

**La déduction** tient sur trois fonctions : `comparer(a, b)` — l'ordre de deux valeurs, numérique quand les deux le sont (`hh:mm` compris), lexicographique sinon ; `deduire(idA, idB)` — la forme qui lie deux empans, ou `null` (dimensions différentes → `null`, le seul refus qui existe ; sinon la première forme déclarée dont le slot accepte la dimension et dont `deduction` tient) ; `ordonner(forme, [a, b])` — pour une forme `ordonne:true`, la paire rangée selon `sens`. `reduire` déclenche `deduire` puis `ordonner` sur un bloc `deduit` ; `rendre` remplace les deux termes par le `patron` de la forme, dans l'ordre canonique.

**Le contrat de rétrocompatibilité, en une phrase :** sans `deduit`, sans `deduction`, sans `patron`, `reduire` et `rendre` se comportent comme un automate à liaisons explicites, sans déduction ni continuation — `test_autre_affaire.js` le vérifie à chaque exécution.

**`valider(r)` descend dans les termes emboîtés.** Sans cela, l'article obligatoire ouvrirait un trou : « affirmation » est une catégorie que tout objet satisfait, y compris une comparaison refusée par la déduction. Depuis que la qualification est le seul chemin de clôture, c'est aussi le seul endroit où la catégorie peut trancher : elle doit donc y trancher jusqu'au fond.

**Une liaison `cite`** (§11) réécrit le fragment du terme qui la précède, dans `rendre` : le nom, puis la citation, puis le `court` de la pièce. Le flag est porté par la **liaison**, non par le terme, pour que la voie de comparaison — qui partage le même bloc de premier terme — reste intacte. `valider` n'a rien eu à apprendre pour ça : une forme d'arité 1 sur un terme atomique était déjà validable.

### Les projections du contenu — dans ce fichier, et nulle part ailleurs

`moteur.js` porte aussi les fonctions qui **projettent un objet de contenu en une vue**, à côté de la fabrique. Ce ne sont pas des données : l'en-tête du fichier tient. Elles sont ici parce qu'il manquait un endroit où poser une fonction pure *d'un contenu*, par opposition à un `JEU` déjà lié — et faute de cet endroit, elles vivaient en deux ou trois exemplaires.

| Projection | Qui l'appelle | Ce qu'elle remplace |
|---|---|---|
| `champsDe(contenu)` — les empans aplatis en `"pid.eid"`, avec `nom`, `qui`, `court` | le jeu, l'atelier, le harnais | **trois** copies, dont deux identiques au caractère près |
| `comparaisonsDe(liens, formes)` — les comparaisons d'arité 2, emboîtées comprises, dédoublonnées | l'atelier, le harnais | deux copies, même clé de dédoublonnage |
| `couleurDim(dimensions, d)` — le RANG, jamais la pertinence (§4.3) ; `null` si inconnue | le jeu, l'atelier | la palette écrite deux fois, en CSS et en JS |

`champsDe` n'est pas un utilitaire de hasard : c'est **exactement l'argument `CHAMPS` que `creerMoteur` attend**. Et `couleurDim` rend `null` plutôt qu'une couleur de repli, parce que le repli n'est pas la règle — le jeu grise une dimension inconnue et continue, l'atelier la montre en rouge, c'est une erreur d'écriture chez lui.

Les **données**, elles, ont trois provenances selon le contexte :

| Consommateur | GRAMMAIRE | CHAMPS | LIENS |
|---|---|---|---|
| le jeu (`index.html`) | `JEU.grammaire` | `champsDe(JEU)` | `JEU.liens` |
| l'atelier (onglet Grammaire) | idem, depuis `CONTENU` | `champsDe(CONTENU)` | idem |
| le banc d'essai (`grammaire/`) | `grammaire2.js` | `grammaire2.js` | `grammaire2.js` |

L'automate et les formes **vivent dans le contenu** : quelles tournures sont offertes, quels articles invocables, c'est de l'écriture, pas du code. **La marge de bruit doit rester non nulle** : `npm run demo:grammaire` la mesure sur le jeu de démonstration — 1609 phrases légales → 125 sensées → 8 portant un lien, soit 117 de marge. L'article obligatoire l'a **augmentée** sur l'affaire livrée : une phrase de bruit n'est plus une comparaison quelconque, c'est une comparaison quelconque multipliée par chaque article reçu — bien formée, fondée, sans intérêt. La citation l'augmente encore : chaque empan devient une phrase close possible, mais elle ne sert à rien pour *chercher*, une citation ne se fondant que sur elle-même.

**Chiffré, sur `content.js`** (l'onglet Grammaire de l'atelier le mesure en direct, sur le contenu courant) : 4 squelettes, **1752 phrases légales → 330 sensées → 15 portant un lien, soit 315 de marge.** Le rapport est bien celui qu'on attendait — trois fois plus de marge que sur le jeu de démonstration, pour un vocabulaire à peine plus grand.

## 15. Ce qu'il reste à resynchroniser

**Presque rien.** Les règles vivent dans `app/regles.js`, que le jeu et l'atelier appellent : pas de recopie, donc pas de checklist à tenir à jour. Ce qui reste sont des **reflets** de l'atelier sur le jeu — trois endroits où l'atelier *décrit* le jeu au lieu de l'appeler, parce qu'il ne peut pas faire autrement :

| Ce qui change | Ce qu'il faut penser à suivre |
|---|---|
| Une règle du jeu (`app/regles.js`) | Rien de mécanique. Vérifier que la **frise** décrit toujours le déroulé en mots justes, et que les **pastilles** du pas-à-pas nomment les bons drapeaux. |
| Le schéma du contenu (§11) | Le **diagnostic** (`diagnostiquer()`) et les **formulaires** de l'inspecteur. |
| La grammaire (`app/moteur.js`) | L'onglet **Grammaire**, qui l'exerce sur le contenu courant. |

**Le danger de ces trois-là est d'un genre particulier, et c'est le plus coûteux de ce dépôt** : un reflet que le changement de mécanique laisse derrière ne casse rien, ne lève aucune exception, et **aucune suite ne le voit** — les six lisent le jeu, jamais le diagnostic ni l'onglet Grammaire. Il ment simplement, tous les jours, à celui qui écrit l'affaire. Le remède n'est pas une checklist de plus : c'est que le reflet **appelle** ce qu'il reflète au lieu de le réécrire (§12), et là où il ne le peut pas, qu'une règle du gardien tienne l'écart (§16 bis, R9). La densité de l'onglet Grammaire, par exemple, ne reconstruit plus la forme à la main : elle bâtit la chaîne de blocs et appelle `reduire`, comme le composeur du jeu.

**Le point ouvert du jour :** la frise édite `rep_inutile` et `rep_sans_rapport`, **pas `rep_hors_sujet`** — la troisième escalade, née avec la citation. Le contenu la porte, `reponseAvocat` la lit, l'atelier ne sait pas l'écrire. Pas encore tranché.

Méthode (contenu) : écrire dans l'atelier → « Exporter content.js » → poser le fichier dans `app/` → relancer les suites.

**Ce que le diagnostic contrôle**, au-delà du câblage : la règle de surlignage (empan sans marqueur → erreur), le nom d'empan (absent → avertissement), le doublon banal dans les deux sens, la grammaire (impasse de l'automate, clôture sans forme, **forme indicible — voir juste après**, lien insensé, emboîtement dans le vide, forme ordonnée sans `sens`, dimension sans forme déductible), les articles (règle portant un empan → erreur ; `porte` absent → avertissement ; `porte` inconnu → erreur), le vice (pas de conclusion → erreur ; plusieurs canaux → avertissement), les sessions (sans attente, tag sans lien, question sans tag → erreur).

**« Forme indicible » : une forme existe de DEUX façons, et le contrôle connaît les deux.** Une liaison peut la **déclarer** (`forme:` sur un bloc) ; depuis la déduction (§4.5), un bloc `deduit` peut la faire **déduire** — et celle-là n'est nommée par aucun bloc, puisque le joueur désigne au lieu de déclarer. Un contrôle qui ne connaîtrait que la première tiendrait les quatre formes comparatives de l'affaire livrée pour indicibles alors que le jeu les prononce.

**« Déductible » se lit comme `deduire` le lit, et sur CE dossier.** Les trois conditions, dans l'ordre du moteur : la forme porte `deduction`, elle est d'**arité 2**, et son premier slot accepte au moins **une dimension déclarée** (`"*"` accepte tout). Il faut de plus qu'un bloc porte `deduit` — sans quoi rien ne déclenche le calcul. Chacune des trois manque d'une façon différente, et le diagnostic le dit différemment : une forme sans `deduction` est indicible tout court ; une forme déductible sans bloc qui déduise ne sera jamais demandée ; une forme dont le slot ne nomme que des dimensions absentes ne se produira jamais **ici**, quoi qu'elle vaille ailleurs. C'est cette troisième condition qui fait la version prudente : sans elle, on cesserait d'alerter sur une forme réellement inatteignable.

**Ce qui n'est délibérément PAS signalé : l'ombrage.** `deduire` rend la **première** forme dont la dimension convient et dont le prédicat tient (§11) — une forme déclarée plus tard peut donc n'être jamais choisie sur une dimension qu'une précédente couvre déjà. Ce n'est pas une anomalie : **l'ordre de déclaration est signifiant**, c'est ainsi qu'on tranche les ambiguïtés, et le signaler reviendrait à interdire le mécanisme qui les résout.

**Un contrôle à part** : un article livré **trop tard** — si une session attend un tag que seul un lien peut servir, et que ce lien exige un article livré à une session ultérieure, la session devient inclôturable. C'est une erreur, et c'est le genre de piège qu'aucune relecture ne rattrape et qu'une partie de test ne révèle qu'après vingt minutes.

## 16. Les harnais de test

Six suites vivent dans le projet, sur un harnais jsdom commun (`harnais.js`), qui inline **tout `<script src>` et tout `<link rel=stylesheet>`** au boot — jsdom n'en charge aucun, et ce sont les fichiers mêmes, relus sur le disque à chaque fois (le CSS aussi, et le §13 dit pourquoi). L'injection est générique, dans l'ordre des balises : ajouter un module d'atelier ne demande pas d'y revenir.

**Le contrat de lecture : `w.R.x(w.S)`.** Une suite qui veut savoir ce que le jeu offre demande aux *règles*, pas à l'écran — `w.R.blocsOfferts(w.S)`, jamais `w.blocsOfferts()`. Ce que la fenêtre expose en propre, ce sont les **gestes** (`w.poserBloc`, `w.envoyer`, `w.surligner`…), parce qu'eux redessinent et que c'est le redessin qu'on veut éprouver. Tenir cette ligne a une conséquence directe : `index.html` peut cesser d'envelopper une lecture sans qu'une seule suite bouge.

**Et il va plus loin : une suite ne REDÉCIDE rien non plus.** Le harnais `require` `moteur.js` et `regles.js` au lieu de réécrire ce qu'ils publient — un prédicat recopié à la main ne casse pas, ne lève pas, et reste vert le jour où la règle change : il affirme simplement l'ancienne vérité, pour toujours. Et personne ne peut le voir, puisque **les suites ne se lisent pas elles-mêmes**. Le principe est celui du §12, appliqué au dernier territoire : **une suite désigne, elle ne décide pas.** C'est R10 qui le tient.

**Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme*, par les sélecteurs et les chemins que le harnais expose (`docs/CARTE.md` les liste). Conséquence, et c'est ce qui justifie la discipline : **changer entièrement d'affaire ne casse pas une seule suite.** Une subtilité qui porte le reste — `composerLien` traite d'abord le cas d'une citation, et clore n'y est tenté **que si la phrase ne s'est pas déjà refermée toute seule** (§4.5.4) ; pour une forme emboîtée il connaît **deux** façons de l'atteindre, la continuation et l'ancienne source `note`, ce qui fait que `test_autre_affaire.js` — écrite à l'ancienne — reste verte sans qu'une ligne de son contenu ne bouge.

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (36) | le jeu, sur **`content.js`** | l'index du dossier (pièces d'abord, règles ensuite) ; tout empan est cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit est non nulle ; le vice à canal unique ; les liens se partagent entre citations et qualifications sans reste ; les trois fins |
| `test_declencheurs.js` (39) | le jeu, contenus **mutés** injectés inline | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, la liste d'attentes (question posée quand elle devient courante, désordre accepté), les trois drapeaux, dimensions renommées, un contenu invalide est refusé et le dit |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | le découplage : une affaire abstraite écrite à l'ancienne (source `note`) se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (114) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, tout effacer ; le tutoriel du premier geste ; les deux régimes de fondement (citation qui se clôt d'elle-même, comparaison qui ne s'écrit que par les noms) ; les trois escalades séparées (comparaison nue, article mal rattaché, citation hors sujet) ; la déduction (patron, ordre des clics indifférent) ; le filtre de livraison ; la continuation (aucun bloc ne clôt sans qualifier) ; la Plaidoirie qui ne retient que les moyens ; la répétition |
| `test_sauvegarde.js` (37) | le jeu | la partie survit au rechargement (mémoire, journal, plan, composition en cours, phrase close en attente, drapeaux) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (79) | l'atelier + le couple atelier→jeu | `content.js` sans erreur et réexporté à l'identique ; le diagnostic au complet ; migration 2→3 idempotente ; renommage d'empans et de pièces ; le pas-à-pas tourne sur `regles.js` ; export `schema: 3` adopté et joué par le moteur ; autosave |

**Les Manuels n'ont plus de suite.** Sept contrôles éprouvaient `openManuels()`, orpheline à l'écran depuis le retrait du `<header>` : ils étaient la seule chose qui la maintenait en vie — on éprouvait un chemin que le joueur ne pouvait pas prendre, ce qui est pire que de ne pas l'éprouver. La fonction d'écran est retirée ; la **règle** reste dans `regles.js` (`reglesLivrees`, `porteDe`), intacte. Le jour où les Manuels se rebranchent, ces contrôles reviennent avec eux — et pas avant. *Conséquence à connaître : `JEU.directives` et `JEU.avis_exploitation` ne sont plus lus par le jeu, alors que la frise les édite toujours et que le diagnostic avertit encore de leur absence.*

**Des chaînes de chrome sont épinglées**, en revanche, et c'est autre chose : `Envoyer` (le bouton, dans le composeur), `effacer` (la confirmation de « ⟲ recommencer »), `Opposer une phrase` et `déjà envoyée` (le présentoir de la répétition), les marqueurs `● ` et `✓ ` de l'index du dossier, et l'id `zoneRetenus`. Ce n'est pas du contenu — ce sont les repères par lesquels une suite atteint une zone sans la nommer par sa structure. On les renomme si on veut, mais jamais sans toucher au test qui les nomme : c'est la seule laisse entre l'écran et les suites, et elle est courte exprès (§4.9).

*Cette liste et ces comptes se **relèvent** sur les suites à chaque révision, jamais ne se recopient de la précédente. Une laisse qu'on croit tendue alors qu'elle ne l'est plus est pire qu'aucune laisse : elle fait hésiter à renommer ce que personne ne tient. Et un total juste **par compensation** est exactement la façon dont un chiffre faux survit d'une révision à l'autre.*

## 16 bis. Ce que les suites ne voient pas — le gardien

Les six suites éprouvent le **sens** : elles jouent l'affaire, lisent `innerHTML`, et vérifient ce qui se dit. Elles ne lisent jamais un style calculé, jamais la forme d'une balise, jamais l'inventaire des noms globaux d'une page — et elles ne se lisent pas non plus **elles-mêmes**, ce qui est leur second angle mort. C'est là que ce dépôt s'est fait mal, à répétition ; le §2 de `docs/PASSATION.md` en tient le récit.

**`outils/gardien.js`** (`npm run gardien`, dans `npm test` après les suites) rend ces conventions opposables. **Onze règles, onze pannes réellement vécues**, chacune citant le § qui la tranche. *Ce qu'elles surveillent une par une est dans `docs/CARTE.md` — et dans l'en-tête du fichier lui-même, qui est la seule liste que le code puisse contredire.* Il ne connaît **ni pièce, ni empan, ni valeur** — même discipline que les suites. Ce qui se décide ici, c'est ce qu'une règle du gardien **a le droit d'être** : le constat d'une panne payée, pas une préférence de style ; et un motif vérifiable sur le source, pas une intention.

**Toutes ne marchent pas sur le même territoire**, et c'est la première question à poser avant d'en ajouter une — la réponse n'est pas « `app/` » par défaut. Les suites et les outils sont couverts pour la même raison que le jeu : ce sont eux qui *reflètent* les règles, et un reflet qui ne rappelle pas ce qu'il reflète est précisément le défaut que ce fichier passe son temps à décrire.

**R10 est la sœur de R2, un cran plus haut.** R2 interdit à deux fichiers d'une même page de se disputer un *nom* ; R10 interdit à n'importe quel fichier de réécrire une *décision* que `regles.js` publie déjà. Le prédicat `estRegle` vit hors de la fabrique **exprès**, pour qu'on puisse le poser sans `JEU` lié (§12). La règle se dit en une phrase : *un fichier qui veut savoir si une pièce est une règle le demande, il ne le redécide pas.* Sa forme vérifiable est le motif `includes("règle")` hors d'`app/regles.js`.

**R9 est la sœur de R7, et pour la même raison.** R7 interdit de déplier un lien du schéma 2 (`l.a[0]`) ; R9 interdit de **lire** `attend` ou `apres` sur une remise, depuis que la remise attend une *liste* (§3). Dans les deux cas le danger est le même : une branche restée à l'ancienne forme ne casse pas, ne lève pas — elle répond « non » pour toujours, et aucune suite ne bronche. **Quatre fonctions** sont nommées en exception à R9, et seulement elles — les deux normalisateurs déclarés au §11, `attentesDe` (`app/regles.js`) et `attentesDeRemise` (`app/atelier/noyau.js`), *on ne les fusionne pas, on dit lequel est lequel* ; et les deux convertisseurs, `attentesEditables` (`frise.js`), qui convertit une remise en place à la première édition, et `migrerContenu` (`contenu-io.js`), qui relit un contenu de schéma 2. Les **écritures** restent libres : construire ou défaire l'ancienne forme est permis, c'est la *lire* au lieu de passer par un normalisateur qui ne l'est plus. Une forme d'écriture qu'on continue de lire doit se déplier en un seul endroit.

**R11 tient la méthode elle-même.** Tout ce dépôt se cite par **numéro de section** — plus de trois cents renvois, dans les commentaires du code, dans les suites, dans les outils, dans les autres documents. C'est la colonne vertébrale de « on réécrit le document, on le fait relire, puis on applique au code », et rien ne la tenait : un renvoi mort ne casse pas, ne lève pas, aucune suite ne le voit — il envoie lire une section qui n'existe pas, ou pire, une qui existe et parle d'autre chose. R11 vérifie deux choses : **que le numéro désigne une section réelle**, et — quand le renvoi nomme son fichier — **qu'il nomme le bon**. Elle vérifie aussi qu'aucun numéro n'est servi par deux documents à la fois, ce qui est la condition pour qu'un renvoi **nu** reste licite. C'est le seul contrôle du dépôt qui marche sur les documents eux-mêmes, et il fallait bien qu'il y en ait un.

**Pourquoi des numéros nus, et pas des liens.** Un lien Markdown se vérifierait tout seul, en apparence. Non : son ancre se calcule sur le **texte du titre**, donc renommer un titre le casse en silence — la panne qu'on voulait fuir, au même endroit. Il ne s'ouvre que sur GitHub, jamais en `file://` ni dans un éditeur, et ce dépôt n'a aucun build. Surtout, la grande majorité des renvois vivent dans des **commentaires JS**, où un lien n'est ni cliquable ni lisible. Le numéro nu est la bonne écriture ; ce qui manquait n'était pas une syntaxe, c'était un filet.

**R9 lit du texte, pas des types, et elle en dépend :** est tenu pour une remise un récepteur écrit `r`, `remise`, ou une indexation de `remises`. C'est la convention de nommage du dépôt — R9 la rend contraignante du même coup, et le dit dans son en-tête plutôt que de le laisser deviner.

**Une règle qui cite une ligne doit citer la bonne.** `decouperJS` blanchit les commentaires et le texte des gabarits **en restituant leurs sauts de ligne** : sans ça, R7 et R9 désignent une ligne trop haute, et un message qui pointe à côté coûte plus qu'il ne rapporte. Un `\n` étant du blanc pour toutes les autres règles, ça ne se paie nulle part ailleurs.

**Ce n'est pas une cinquième source de vérité.** Il fait respecter, il ne décide pas : le jour où une règle et son § divergent, c'est le § qui a raison et la règle qui se corrige.

**`eslint.config.js`** est l'autre bout, générique : aucune des onze pannes ci-dessus ne s'y voit, mais il attrape ce que le gardien ne cherche pas — identifiant fautif, variable morte, clé dupliquée. Sa liste de globals n'est pas écrite : elle se **calcule**, en demandant au gardien l'inventaire des noms que chaque page pose dans la portée globale (§12 — pas de copie). Deux règles y sont assouplies, et elles portent des idiomes voulus : un `catch` qui ignore délibérément sa raison, et les noms de haut niveau d'une page, qui sont sa surface publique et qu'ESLint croirait morts faute de savoir lire un `onclick=`. Rien d'autre ne s'excuse : ce qui reste après ces deux-là est du vrai code mort, et se retire.

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (325 contrôles), le gardien et ESLint compris. L'ordre de `npm test` n'est pas indifférent : **les suites d'abord**, le sens avant la forme. `tests/verifier_content_sync.js` n'existe plus : il surveillait l'écart entre deux exemplaires du contenu, et il n'y en a plus qu'un. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration : pas de code de sortie, pas dans `npm test`.)

## 17. Résumé en trois phrases

Trois modules, trois métiers, aucune copie : le **contenu** dans `content.js`, les **règles** dans `regles.js`, la **grammaire et les projections du contenu** dans `moteur.js` — et deux pages qui ne font que *montrer*, chargeant les mêmes trois voisins, si bien que le pas-à-pas ne rejoue plus les règles, il les appelle. Côté sens, une seule chose compte : **rien ne se dit qui ne soit fondé, sous l'un des deux régimes** — un fait se cite, une relation se fonde sur un texte, rien d'autre ne clôt une phrase — d'où trois sessions, la première pour apprendre à lire, la deuxième à mettre en rapport, la troisième qui ne demande plus rien. La Partie I reste l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

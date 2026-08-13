# IAvocat — Architecture

*Comment le jeu est fait : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Le sens est l'arbitre, et il est ailleurs** : `docs/CONCEPTION.md` (§1 à §7) dit ce que le jeu veut
> dire, ci-dessous l'outillage qui l'exécute. En cas d'écart, la conception tranche. Où vit une chose
> et comment elle s'appelle : `docs/CARTE.md`. Ce qui a été tranché : `docs/HISTORIQUE.md`. Les pannes
> déjà réparées : §2 de `docs/PASSATION.md`.
>
> **Le corps du texte décrit l'état actuel, pas la façon dont on y est arrivé. État au 15 août 2026.**

## 9. Disposition du dépôt

**L'inventaire est dans `docs/CARTE.md`, pas ici** — quel fichier porte quoi, avec sa taille, et R8 du
gardien vérifie que ces tailles sont réelles. *La carte localise, ce § explique.* Quatre dossiers :
`app/` (le livrable — c'est lui qu'on zippe), `docs/`, `tests/` (§16), `grammaire/` (le banc d'essai,
qui consomme `../app/moteur.js` et prouve en permanence la rétrocompatibilité du §11).

**La règle de rangement, en une phrase :** *le contenu ne contient aucune règle, les règles ne
contiennent aucun contenu, l'interface ne décide rien, et l'atelier ne recopie rien.* Les deux pages
chargent les mêmes voisins par `<script src>` — aucun build, aucun serveur, tout marche en `file://`.

**Une page ne porte que sa structure.** Ni `<style>` ni `<script>` en ligne : le CSS part en `<link>`,
le JS en `<script src>`. Ça ne change rien à l'exécution — un script classique externe partage la même
portée globale, et les déclarations de fonction restent des propriétés de `window`, ce dont dépendent
tous les `onclick=` du HTML engendré.

**Le corollaire, qui a mordu :** un nom de haut niveau dans `moteur.js` ou `regles.js` est un nom
**pris dans la page qui les charge** — `couleurDim` y heurtait celui d'`index.html`. Les projections du
§14 et le prédicat `estRegle` sont donc **cloîtrés** dans une fermeture et ne sortent que par
`MoteurGrammaire.x` / `ReglesJeu.x`.

**« L'atelier ne recopie rien » vaut aussi de lui-même.** Découper un gros fichier range les outils ;
ça ne dégraisse rien, et ça peut cacher les copies en les éloignant. `noyau.js` porte donc, en section
*2 bis*, les quatre gestes que tous les autres refont (`muter`, `poserOuRetirer`, `reinitSelection`,
`demanderSuppr`/`btnSuppr`) et deux formats (`deK`, `reecrireTermes`). Ce ne sont **pas** des règles du
jeu et ils ne doivent jamais le devenir : `regles.js` reste la seule maison de ce qui décide (§12).

Les modules de l'atelier se chargent en **portée globale classique**, jamais en modules ES : c'est ce
qui laisse intacts les cinquante-neuf `onclick=` du HTML et préserve le zéro build. Les fonctions se
voient entre fichiers par *hoisting* ; seul `noyau.js` exécute son corps au chargement, il vient donc
en premier.

Le contenu **n'existe qu'en un exemplaire** : pas de copie de secours, pas de graine de travail. S'il
manque ou est d'un schéma inconnu, le jeu ne joue pas autre chose en douce — il le dit et ne démarre
pas (§13).

## 10. Le cycle d'écriture

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (écriture +       │                         │ (LE CONTENU,│                  │  (l'interface)     │
│   diagnostic +     │ ◄────────────────────── │  exemplaire │ ◄─────────────── └────────────────────┘
│   pas-à-pas)       │      <script src>       │   unique)   │   moteur.js + regles.js
└────────────────────┘                         └─────────────┘
```

**L'atelier et le jeu lisent le même fichier**, et le fichier exporté remplace celui qu'on vient de
lire : c'est un cycle, pas une chaîne — plus d'amont ni d'aval, donc plus de dérive possible.

## 11. Le contenu — schéma 3

```js
{
  schema: 3,
  dimensions: ["quand","qui","ou","quoi","combien"],       // ordre d'affichage ; la couleur en découle
  pieces: {
    p_pv: {
      titre, court, type, resume,                           // `resume` : atelier seulement
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

**Le texte à empans** est écrit avec des marqueurs `{{eid}}` que le rendu remplace par un empan
cliquable — pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on corrige une
virgule. Le diagnostic exige que tout empan déclaré porte son marqueur.

**Le `nom` d'un empan est optionnel** (§4.1) : absent, le `texte` en tient lieu — d'où l'ajout du champ
sans changement de schéma. Avertissement du diagnostic, jamais erreur.

**Attributs optionnels d'un bloc**, sans effet quand ils sont absents : `imbrique` — la liaison
**emboîte** ce qui a été composé comme terme unique de sa forme ; `deduit` — le bloc **clôt une paire**,
fait déduire la forme des deux termes puis les range dans l'ordre canonique (§4.5) ; `piece` — le bloc
n'est offert qu'une fois cette pièce livrée, et **il porte sur les liaisons *et* sur les termes** (le
bloc du second terme attend l'article 3, c'est ce qui ferme la comparaison en session 1) ; `libelle` —
le texte du bouton quand il diffère de ce qui sera rendu ; `cite` — la liaison fait écrire le terme qui
la précède **par son nom et par sa citation**, avec sa pièce (§4.1).

**Les attentes d'une remise** — `attentes: [{question?, attend, apres?}]`, servies dans l'ordre :
`question` est poussée dans la Discussion quand l'attente devient courante, `attend` est le tag comparé
à celui du lien versé, `apres` l'accusé de réception. L'ancienne forme (`attend`/`apres` sur la remise)
reste valide et se lit comme une liste à un élément. **Le schéma reste 3.** Répondre **dans le
désordre** est accepté : l'attente servie est celle dont le tag correspond.

**L'attribut optionnel d'une pièce :** `porte: [dimensions]`, sur une pièce de type « règle »
uniquement — affiché, **jamais lu par le moteur**. Une pièce de type « règle » ne porte aucun empan :
contrôle du diagnostic, pas contrainte du moteur.

**Attributs optionnels d'une forme :** `deduction` (`"egalite"`, `"difference"`, `"ordre"`) — le
prédicat qu'évalue `deduire` ; `sens` (`"asc"` par défaut) — l'ordre canonique d'une forme
`ordonne:true` ; `patron` — la phrase écrite d'un bloc, `{a}`/`{b}`, **le seul endroit où l'accord se
joue** (§8.8 de `docs/ECRITURE.md`). **L'ordre de déclaration des formes est signifiant** : `deduire`
rend la première dont la dimension convient et dont le prédicat tient.

**Un terme** est soit `"pid.eid"`, soit un `{forme, termes}` **imbriqué** — ce qui permet la chaîne du
vice et sa continuation en une comparaison.

**Ce que le moteur garde alors que le contenu ne s'en sert plus :** la source `note` et la clôture sans
forme. `test_autre_affaire.js` les emploie et le vérifie à chaque exécution — *on ne retire pas une
capacité du moteur parce que le contenu du jour ne s'en sert pas.*

**La liste des dimensions vit dans le contenu**, mais le moteur ne lit aucun de ces noms : il compare
des `dim` égales. Ajouter `comment` est un geste d'atelier, pas de code.

**Migration 2 → 3** (`migrerContenu()`, silencieuse) : les `champs` deviennent des `empans`, le texte
reçoit les marqueurs manquants en queue, les `liens` par paires deviennent `{forme, termes}`, l'accusé
de réception migre sur la **première attente** de sa session, `cases`/`relations` sont retirés. Elle
**écrit la forme du §3, jamais l'ancienne** — un `apres` posé seul sur la remise serait injoignable —
et **n'invente aucune attente** : une attente sans `attend` bloquerait la session pour toujours. **Le
jeu, lui, ne migre pas** : un schéma 2 est refusé par `contenuValide()`.

## 12. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **quatre**, une par nature d'information — et aucune n'a de
copie.

| Nature | Source de vérité | Copies |
|---|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins) | **`app/content.js`** — chargé par le jeu *et* par l'atelier | aucune |
| **Les règles du jeu** (sessions, drapeaux, Plaidoirie, répétition, fins) | **`app/regles.js`** — chargé, jamais recopié | aucune |
| **La grammaire** (composer, réduire, valider, reconnaître) **et les projections du contenu** (§14) | **`app/moteur.js`** — chargé, jamais recopié | aucune |
| **Le sens** (invariants, arbitrages) | **`docs/CONCEPTION.md`** | le diagnostic en encode une partie : c'est un extrait, pas le doc |

`app/regles.js` est **pur** : `creerRegles(JEU, M)` rend des fonctions qui prennent l'état `S` en
argument explicite. Aucun DOM, aucun `localStorage` ; celles qui « parlent » poussent dans `S.fil`, qui
est de l'état, pas de l'écran. Le pas-à-pas de l'atelier appelle **les mêmes fonctions sur le même
état** : il ne peut pas dériver, il n'y a pas deux textes à faire coïncider. Restent propres à
l'atelier : le diagnostic, le graphe, la frise, la migration, l'export.

**`index.html` n'enveloppe pas `regles.js`.** La ligne de partage :

> **Ce qui redessine reste une fonction d'ici ; ce qui lit s'écrit `R.x(S)` sur place.**

Restent donc les seules cibles de `onclick` — `poserBloc`, `envoyer`, `surligner`, `cloturer` — qui
font `R.x(S, …)` **puis** `rendreTout()`. **Les suites lisent de la même façon**, en `w.R.x(w.S)` :
c'est un contrat, pas une commodité — le jour où une lecture perd son enveloppe, aucune suite ne casse.

Une seule différence subsiste, de nature et non de règle : le pas-à-pas joue **au grain du lien** là où
le jeu joue **bloc à bloc**. Les deux passent par la même porte, `clorePhrase`.

## 13. Ce qui se passe quand `content.js` manque

Il n'y a pas de repli, et c'est un bon prix : un repli silencieux ferait *jouer autre chose* sans le
dire. Fichier absent, schéma antérieur à 3, clé vitale manquante → un **bandeau** nomme le cas, aucune
session n'est livrée ; `contenuValide()` reste le juge. **La sauvegarde de partie est signée par le
contenu** (`localStorage`, clé `iavocat_partie`) : livrer un nouveau `content.js` invalide les parties
en cours.

Le harnais **inline tout `<script src>` ET tout `<link rel=stylesheet>`** au boot, parce que jsdom n'en
charge aucun — ce sont les fichiers mêmes, relus sur le disque, ce qui permet au contenu de n'exister
qu'en un exemplaire tout en restant testable. L'injection est **générique** (une regex sur les balises,
dans l'ordre) : ajouter un module ne demande pas d'y revenir.

**Pourquoi le CSS aussi**, alors qu'aucune suite ne lit de couleur : parce que `getCSS()` en lit
(`app/atelier/graphe.js`, seul endroit où du CSS traverse vers du JS). Or jsdom résout les variables
d'un `<style>` en ligne et rend `""` pour un `<link>` : sortir le CSS du HTML aurait changé ce que le
graphe dessine sous test **sans qu'aucun contrôle ne bronche**.

**Trois règles sur la balise de `jeu.js`**, portées en commentaire dans `index.html` : sur **une ligne,
sans attribut** ; **ni `defer` ni `async`** ; **après `content.js`**. La regex est si stricte qu'un
attribut de plus empêche l'inlinage **entièrement** — rien ne se charge, quatre contrôles tombent
aussitôt. R1 tient la forme, et l'écart se dit sur la balise au lieu d'un `ReferenceError`.

**Ce que le harnais ne prouve jamais :** que les balises se chargent pour de vrai. C'est le seul emploi
de `npm run vue` — qui n'asserte rien non plus : il sort en 1 sur une erreur JS et dépose des captures.
**La preuve du CSS est donc à l'œil, sur les captures.**

## 14. La grammaire — branchée

`app/moteur.js` est **pur, sans données** : `creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` rend `valider`,
`reduire`, `lienDe`, `rendre`, `squelettes`… chargé tel quel par le jeu, l'atelier et le banc d'essai.

**Accumuler, pas écraser.** `reduire(ch)` parcourt la chaîne de blocs en empilant les termes et en
retenant la forme courante ; à un bloc `imbrique`, ce qui a été accumulé devient le **terme unique** de
la nouvelle forme. `rendre(ch)` écrit le `nom` d'un empan et non sa citation, avec repli sur `texte`.

**La déduction** tient sur trois fonctions : `comparer(a, b)` — l'ordre de deux valeurs, numérique
quand les deux le sont (`hh:mm` compris), lexicographique sinon ; `deduire(idA, idB)` — la forme qui
lie deux empans, ou `null` (dimensions différentes → `null`, le seul refus qui existe) ;
`ordonner(forme, [a, b])`. `reduire` déclenche `deduire` puis `ordonner` sur un bloc `deduit` ; `rendre`
remplace les deux termes par le `patron` de la forme.

**Le contrat de rétrocompatibilité :** sans `deduit`, sans `deduction`, sans `patron`, `reduire` et
`rendre` se comportent comme un automate à liaisons explicites — `test_autre_affaire.js` le vérifie.

**`valider(r)` descend dans les termes emboîtés.** Sans cela l'article obligatoire ouvrirait un trou :
« affirmation » est une catégorie que tout objet satisfait, y compris une comparaison refusée par la
déduction. La qualification étant le seul chemin de clôture, c'est le seul endroit où la catégorie peut
trancher — elle doit donc trancher jusqu'au fond.

**Une liaison `cite`** réécrit le fragment du terme qui la précède : le nom, la citation, puis le
`court` de la pièce. Le flag est porté par la **liaison**, non par le terme, pour que la voie de
comparaison — qui partage le même bloc de premier terme — reste intacte.

### Les projections du contenu — dans ce fichier, et nulle part ailleurs

`moteur.js` porte aussi, **hors fabrique**, les fonctions qui projettent un objet de contenu en une
vue. Elles sont là parce qu'il manquait un endroit où poser une fonction pure *d'un contenu*, par
opposition à un `JEU` déjà lié — et faute de cet endroit, elles vivaient en plusieurs exemplaires.

| Projection | Qui l'appelle |
|---|---|
| `champsDe(contenu)` — les empans aplatis en `"pid.eid"`, avec `nom`, `qui`, `court` | le jeu, l'atelier, le harnais |
| `comparaisonsDe(liens, formes)` — les comparaisons d'arité 2, emboîtées comprises, dédoublonnées | l'atelier, le harnais |
| `couleurDim(dimensions, d)` — le **rang**, jamais la pertinence (§4.3) ; `null` si inconnue | le jeu, l'atelier |

`champsDe` n'est pas un utilitaire de hasard : c'est **exactement l'argument `CHAMPS` que `creerMoteur`
attend**. Et `couleurDim` rend `null` plutôt qu'une couleur de repli — le jeu grise une dimension
inconnue et continue, l'atelier la montre en rouge, c'est une erreur d'écriture chez lui.

Les **données** ont trois provenances : le jeu lit `JEU.grammaire` / `champsDe(JEU)` / `JEU.liens` ;
l'atelier les mêmes depuis `CONTENU` ; le banc d'essai tout depuis `grammaire2.js`. L'automate et les
formes **vivent dans le contenu** : quelles tournures sont offertes, quels articles invocables, c'est
de l'écriture, pas du code.

**La marge de bruit doit rester non nulle** — sinon « sensé » vaudrait « correct ». Sur `content.js` :
4 squelettes, **1752 phrases légales → 330 sensées → 15 portant un lien, soit 315 de marge** (l'onglet
Grammaire le mesure en direct). L'article obligatoire l'a **augmentée** : une phrase de bruit est une
comparaison quelconque multipliée par chaque article reçu. La citation l'augmente encore, sans servir à
*chercher* — une citation ne se fonde que sur elle-même.

## 15. Ce qu'il reste à resynchroniser

**Presque rien** : les règles vivent dans `app/regles.js`, que le jeu et l'atelier appellent. Ce qui
reste sont trois **reflets** de l'atelier sur le jeu — trois endroits où il *décrit* le jeu au lieu de
l'appeler, parce qu'il ne peut pas faire autrement.

| Ce qui change | Ce qu'il faut suivre |
|---|---|
| Une règle du jeu (`app/regles.js`) | Rien de mécanique. Vérifier que la **frise** décrit le déroulé en mots justes et que les **pastilles** du pas-à-pas nomment les bons drapeaux |
| Le schéma du contenu (§11) | Le **diagnostic** et les **formulaires** de l'inspecteur |
| La grammaire (`app/moteur.js`) | L'onglet **Grammaire**, qui l'exerce sur le contenu courant |

**Le danger de ces trois-là est le plus coûteux du dépôt** : un reflet laissé derrière ne casse rien,
ne lève rien, et **aucune suite ne le voit** — il ment simplement, tous les jours, à celui qui écrit
l'affaire. Le remède n'est pas une checklist : c'est que le reflet **appelle** ce qu'il reflète (§12),
et là où il ne le peut pas, qu'une règle du gardien tienne l'écart (§16 bis).

**Le point ouvert du jour :** la frise édite `rep_inutile` et `rep_sans_rapport`, **pas
`rep_hors_sujet`**. Le contenu la porte, `reponseAvocat` la lit, l'atelier ne sait pas l'écrire.

Méthode (contenu) : écrire dans l'atelier → « Exporter content.js » → poser le fichier dans `app/` →
relancer les suites.

**Ce que le diagnostic contrôle**, au-delà du câblage : la règle de surlignage (empan sans marqueur →
erreur), le nom d'empan (absent → avertissement), le doublon banal dans les deux sens, la grammaire
(impasse, clôture sans forme, forme indicible, lien insensé, emboîtement dans le vide, forme ordonnée
sans `sens`, dimension sans forme déductible), les articles (règle portant un empan → erreur ; `porte`
absent → avertissement, inconnu → erreur), le vice (pas de conclusion → erreur ; plusieurs canaux →
avertissement), les sessions (sans attente, tag sans lien, question sans tag → erreur). Plus un
contrôle à part : un article livré **trop tard** rend une session inclôturable — le genre de piège
qu'aucune relecture ne rattrape et qu'une partie de test ne révèle qu'après vingt minutes.

**« Forme indicible » : une forme existe de DEUX façons**, et le contrôle connaît les deux — une
liaison peut la **déclarer** (`forme:`), un bloc `deduit` peut la faire **déduire**, et celle-là n'est
nommée par aucun bloc. **« Déductible » se lit comme `deduire` le lit, et sur CE dossier** : la forme
porte `deduction`, elle est d'arité 2, son premier slot accepte au moins une dimension déclarée — et il
faut qu'un bloc porte `deduit`, sans quoi rien ne déclenche le calcul. Chacune manque autrement, et le
diagnostic le dit autrement.

**Ce qui n'est délibérément PAS signalé : l'ombrage.** `deduire` rend la **première** forme qui
convient ; une forme déclarée plus tard peut donc n'être jamais choisie. Ce n'est pas une anomalie —
**l'ordre de déclaration est signifiant**, c'est ainsi qu'on tranche les ambiguïtés.

## 16. Les harnais de test

Six suites sur un harnais jsdom commun (`tests/harnais.js`), qui inline tout `<script src>` et tout
`<link rel=stylesheet>` au boot (§13). Ce qu'il expose est listé dans `docs/CARTE.md`.

**Le contrat de lecture : `w.R.x(w.S)`.** Une suite qui veut savoir ce que le jeu offre demande aux
*règles*, pas à l'écran. Ce que la fenêtre expose en propre, ce sont les **gestes** (`w.poserBloc`,
`w.envoyer`, `w.surligner`…), parce qu'eux redessinent et que c'est le redessin qu'on veut éprouver.

**Une suite ne REDÉCIDE rien non plus.** Le harnais `require` `moteur.js` et `regles.js` au lieu de
réécrire ce qu'ils publient : un prédicat recopié à la main ne casse pas, ne lève pas, et reste vert le
jour où la règle change — il affirme l'ancienne vérité pour toujours, et personne ne peut le voir
puisque **les suites ne se lisent pas elles-mêmes**. *Une suite désigne, elle ne décide pas* — R10 le
tient.

**Les tests ne nomment aucun contenu.** Ni pièce, ni empan, ni valeur : tout se dérive de la *forme*.
Conséquence, et c'est ce qui justifie la discipline : **changer entièrement d'affaire ne casse pas une
seule suite.** Une subtilité qui porte le reste — `composerLien` traite d'abord la citation, et clore
n'y est tenté **que si la phrase ne s'est pas déjà refermée toute seule** (§4.5.4) ; pour une forme
emboîtée il connaît **deux** façons de l'atteindre, la continuation et l'ancienne source `note`.

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (36) | le jeu, sur **`content.js`** | l'index du dossier ; tout empan est cliquable et aucun marqueur ne fuit ; surligner et composer sont gratuits, illimités, dédoublonnés ; la marge de bruit non nulle ; le vice à canal unique ; les trois fins |
| `test_declencheurs.js` (39) | le jeu, contenus **mutés** | le décâblage : renommage de toutes les pièces, `declenche`/`une_fois`/`qui`, la liste d'attentes (question posée quand elle devient courante, désordre accepté), les trois drapeaux, dimensions renommées, contenu invalide refusé |
| `test_autre_affaire.js` (20) | le jeu, **affaire de test** | le découplage : une affaire abstraite écrite à l'ancienne (source `note`) se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (114) | le jeu | l'ergonomie et le grain fin : composer bloc à bloc, retirer, effacer ; le tutoriel ; les deux régimes de fondement ; les trois escalades ; la déduction (patron, ordre des clics indifférent) ; le filtre de livraison ; la continuation ; la Plaidoirie qui ne retient que les moyens ; la répétition |
| `test_sauvegarde.js` (37) | le jeu | la partie survit au rechargement (mémoire, journal, plan, composition, phrase close, drapeaux) ; la signature jette une sauvegarde d'un autre contenu ; la fin efface |
| `smoke_atelier.js` (79) | l'atelier + le couple atelier→jeu | `content.js` réexporté à l'identique ; le diagnostic au complet ; migration 2→3 idempotente ; renommages ; le pas-à-pas sur `regles.js` ; export `schema: 3` joué par le moteur ; autosave |

**Les Manuels n'ont plus de suite.** Sept contrôles éprouvaient `openManuels()`, orpheline à l'écran :
on éprouvait un chemin que le joueur ne pouvait pas prendre, ce qui est pire que de ne pas l'éprouver.
La fonction d'écran est retirée, la **règle** reste dans `regles.js`. *Conséquence : `JEU.directives` et
`JEU.avis_exploitation` ne sont plus lus par le jeu, alors que la frise les édite et que le diagnostic
avertit de leur absence.*

**Des chaînes de chrome sont épinglées**, en revanche : `Envoyer`, `effacer`, `Opposer une phrase`,
`déjà envoyée`, les marqueurs `● ` et `✓ `, et l'id `zoneRetenus`. Ce sont les repères par lesquels une
suite atteint une zone sans la nommer par sa structure : on les renomme si on veut, jamais sans toucher
au test qui les nomme. *Cette liste et ces comptes se **relèvent** sur les suites à chaque révision,
jamais ne se recopient : une laisse qu'on croit tendue fait hésiter à renommer ce que personne ne
tient.*

## 16 bis. Ce que les suites ne voient pas — le gardien

Les six suites éprouvent le **sens** : elles jouent l'affaire et lisent `innerHTML`. Elles ne lisent
jamais un style calculé, jamais la forme d'une balise, jamais l'inventaire des noms globaux d'une page
— et elles ne se lisent pas **elles-mêmes**. C'est là que ce dépôt s'est fait mal, à répétition.

**`outils/gardien.js`** (`npm run gardien`, dans `npm test` après les suites) rend ces conventions
opposables : **onze règles, onze pannes réellement vécues**, chacune citant le § qui la tranche. *La
liste vit dans son en-tête — la seule que le code puisse contredire.* Il ne connaît ni pièce, ni empan,
ni valeur, même discipline que les suites. Ce qui se décide ici, c'est ce qu'une règle **a le droit
d'être** : le constat d'une panne payée, pas une préférence de style ; et un motif vérifiable sur le
source, pas une intention.

**Toutes ne marchent pas sur le même territoire**, et c'est la première question à poser avant d'en
ajouter une — la réponse n'est pas « `app/` » par défaut. Les suites et les outils sont couverts pour
la même raison que le jeu : ce sont eux qui *reflètent* les règles.

Trois parentés à connaître. **R10 est la sœur de R2** : R2 interdit à deux fichiers d'une page de se
disputer un *nom*, R10 interdit à n'importe quel fichier de réécrire une *décision* que `regles.js`
publie. **R9 est la sœur de R7** : l'ancienne écriture reste lisible, donc une branche restée à
`l.a[0]` ou à `r.attend` répond « non » pour toujours sans que rien ne casse. **R11 tient la méthode
elle-même** : tout ce dépôt se cite par numéro de section, et un renvoi mort envoie lire une section
qui n'existe pas — ou pire, une qui existe et parle d'autre chose. C'est le seul contrôle qui marche
sur les documents.

**Pourquoi des numéros nus, et pas des liens.** L'ancre d'un lien Markdown se calcule sur le **texte du
titre** : renommer un titre le casse en silence — la panne qu'on voulait fuir, au même endroit. Il ne
s'ouvre que sur GitHub, jamais en `file://`, et la plupart des renvois vivent dans des **commentaires
JS** où un lien n'est ni cliquable ni lisible. Le numéro nu est la bonne écriture ; ce qui manquait,
c'était le filet.

**Ce n'est pas une cinquième source de vérité.** Il fait respecter, il ne décide pas : le jour où une
règle et son § divergent, c'est le § qui a raison et la règle qui se corrige.

**`eslint.config.js`** est l'autre bout, générique : aucune des onze pannes ne s'y voit, mais il
attrape l'identifiant fautif, la variable morte, la clé dupliquée. Sa liste de globals ne s'écrit pas,
elle se **calcule** en demandant au gardien son inventaire (§12). Deux règles y sont assouplies, et
elles portent des idiomes voulus : un `catch` qui ignore délibérément sa raison, et les noms de haut
niveau d'une page, qu'ESLint croirait morts faute de savoir lire un `onclick=`.

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes** (325 contrôles), le
gardien et ESLint compris. **Les suites d'abord** : le sens avant la forme.

## 17. Résumé en trois phrases

Trois modules, trois métiers, aucune copie : le **contenu** dans `content.js`, les **règles** dans
`regles.js`, la **grammaire et les projections du contenu** dans `moteur.js` — et deux pages qui ne
font que *montrer*, si bien que le pas-à-pas ne rejoue plus les règles, il les appelle. Côté sens, une
seule chose compte : **rien ne se dit qui ne soit fondé, sous l'un des deux régimes** — un fait se
cite, une relation se fonde sur un texte — d'où trois sessions, la première pour apprendre à lire, la
deuxième à mettre en rapport, la troisième qui ne demande plus rien. `docs/CONCEPTION.md` reste
l'arbitre du sens ; le diagnostic de l'atelier n'en est que le bras automatisé.

# IAvocat — Architecture

*Comment le jeu est fait, où vit la vérité, où vit quoi. Le sens arbitre et il est ailleurs :
`docs/CONCEPTION.md` (§1 à §8). L'état du jour : `docs/PASSATION.md`.*

## 9. Le rangement

**La règle :** *le contenu ne contient aucune règle, les règles ne contiennent aucun contenu,
l'interface ne décide rien, et l'atelier ne recopie rien.*

- Quatre dossiers : `app/` (le livrable), `docs/`, `tests/` (§16), `grammaire/` (le banc d'essai, qui
  prouve la rétrocompatibilité du §11). Inventaire : §17.
- **Une page ne porte que sa structure** : CSS en `<link>`, JS en `<script src>`, aucun build — un
  script classique externe partage la portée globale, ce dont dépendent tous les `onclick=`.
- **Corollaire payé** : un nom de haut niveau dans `moteur.js` ou `regles.js` est un nom **pris dans la
  page**. Les projections (§14) et `estRegle` sont **cloîtrés** derrière `MoteurGrammaire.x` /
  `ReglesJeu.x`.
- **Les modules de l'atelier se chargent en portée globale classique**, jamais en modules ES : les
  fonctions se voient par *hoisting*, et `noyau.js` vient **en premier**, seul dont le corps s'exécute
  au chargement.
- **Le contenu n'existe qu'en un exemplaire** : manquant ou d'un schéma inconnu, le jeu le dit et ne
  démarre pas (§13).

## 10. Le cycle d'écriture

`atelier_v3.html` **écrit** `app/content.js`, que le jeu et l'atelier lisent tous deux par
`<script src>` : un cycle, pas une chaîne — plus d'amont ni d'aval, donc plus de dérive.

**L'export remplace le fichier sur place** (File System Access, jusqu'en `file://` sous Chrome et
Edge) : on désigne `app/content.js` une fois, la poignée est retenue dans IndexedDB, **Alt+clic** en
désigne un autre. Sans l'API (Firefox, Safari) ou sur droit refusé, le bouton **retombe sur le
téléchargement** et le dit : la commodité dépend du navigateur, jamais le cycle.

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

- **Marqueurs `{{eid}}`** : pas d'appariement de sous-chaînes, donc pas de marquage qui glisse quand on
  corrige une virgule. `nom` absent → le `texte` en tient lieu.
- **Attributs d'un bloc** : `imbrique` (la liaison **emboîte** l'acquis comme terme unique) · `deduit`
  (le bloc **clôt une paire** : forme déduite, termes rangés dans l'ordre canonique) · `piece` (offert
  une fois la pièce livrée — **sur les liaisons *et* sur les termes**, §4.5) · `libelle` (le texte du
  bouton) · `cite` (le terme précédent s'écrit **par son nom et par sa citation**, avec sa pièce).
- **Attributs d'une forme** : `deduction` (`"egalite"`, `"difference"`, `"ordre"`) · `sens` (`"asc"` par
  défaut) · `patron`, la phrase écrite, `{a}`/`{b}` — **le seul endroit où l'accord se joue** (§8.8).
  **L'ordre de déclaration est signifiant** : `deduire` rend la première forme qui convient.
- **Attribut d'une pièce** : `porte`, sur une pièce « règle » seulement — affiché, **jamais lu par le
  moteur** ; une telle pièce ne porte aucun empan (diagnostic, pas moteur).
- **Les attentes** sont servies dans l'ordre, et le **désordre est accepté** ; l'ancienne forme
  (`attend`/`apres` sur la remise) se lit comme une liste à un élément.
- **Un terme** est `"pid.eid"` ou un `{forme, termes}` imbriqué. Le moteur ne lit aucun nom de
  dimension : ajouter `comment` est un geste d'atelier.
- **Migration 2 → 3** (`migrerContenu()`, silencieuse) : `champs` → `empans`, marqueurs posés, liens par
  paires → `{forme, termes}`, accusé migré sur la **première attente**. Elle **n'invente aucune
  attente** (sans `attend`, la session bloquerait pour toujours) ; **le jeu ne migre pas**.
- *On ne retire pas du moteur une capacité que le contenu du jour n'emploie pas* : la source `note`, la
  clôture sans forme.

## 12. Où est la source de vérité ?

Pas *une* mais **quatre**, une par nature — et aucune n'a de copie.

| Nature | Source |
|---|---|
| **Le contenu** (pièces, empans, dimensions, grammaire, liens, sessions, répliques, fins) | `app/content.js` |
| **Les règles** (sessions, drapeaux, Plaidoirie, répétition, fins) | `app/regles.js` |
| **La grammaire** et les **projections** (§14) | `app/moteur.js` |
| **Le sens** (invariants, arbitrages) | `docs/CONCEPTION.md` — le diagnostic n'en encode qu'un extrait |

- `creerRegles(JEU, M)` est **pur** : ses fonctions prennent `S` en argument explicite, sans DOM ni
  `localStorage` ; celles qui « parlent » poussent dans `S.fil`, qui est de l'état. Le pas-à-pas appelle
  **les mêmes fonctions sur le même état**, il ne peut donc pas dériver — au grain du lien, quand le
  jeu va bloc à bloc, mais par le même `clorePhrase`.
- **Ce qui redessine reste une fonction de `jeu.js` ; ce qui lit s'écrit `R.x(S)` sur place.** Restent
  les seules cibles de `onclick` — `poserBloc`, `envoyer`, `surligner`, `cloturer` — qui font
  `R.x(S, …)` **puis** `rendreTout()`. **Les suites lisent pareil**, en `w.R.x(w.S)` : un contrat.

## 13. Le chargement, et `content.js` manquant

- **Aucun repli** : il ferait *jouer autre chose* sans le dire. Fichier absent, schéma antérieur à 3,
  clé vitale manquante → un **bandeau** nomme le cas, aucune session n'est livrée.
- **La sauvegarde est signée par le contenu** (`localStorage`, `iavocat_partie`) : livrer un nouveau
  `content.js` invalide les parties en cours.
- **Le harnais inline tout `<script src>` et tout `<link rel=stylesheet>`** au boot, dans l'ordre des
  balises. Le CSS aussi, alors qu'aucune suite ne lit de couleur : `getCSS()` en lit (`graphe.js`), et
  jsdom rend `""` pour un `<link>`.
- **Trois règles sur la balise de `jeu.js`**, en commentaire dans `index.html` : **une ligne, sans
  attribut** ; **ni `defer` ni `async`** ; **après `content.js`**. Un attribut de plus empêche l'inlinage
  *entièrement*. R1 tient la forme.
- **Rien ne prouve que les balises se chargent pour de vrai**, sauf `npm run vue` — qui n'asserte rien
  non plus : il sort en 1 sur une erreur JS et dépose des captures. **La preuve du CSS est à l'œil.**

## 14. Le moteur

`creerMoteur(GRAMMAIRE, CHAMPS, LIENS)` est **pur, sans données** — `valider`, `reduire`, `lienDe`,
`rendre`, `squelettes`… — chargé tel quel par le jeu, l'atelier et le banc d'essai.

- **Accumuler, pas écraser** : `reduire(ch)` empile les termes en retenant la forme courante ; à un bloc
  `imbrique`, l'acquis devient le **terme unique** de la nouvelle forme.
- **La déduction** tient sur `comparer` (numérique quand les deux valeurs le sont, `hh:mm` compris ;
  lexicographique sinon), `deduire` (la forme, ou `null` sur dimensions différentes — le seul refus qui
  existe) et `ordonner`.
- **Rétrocompatibilité** : sans `deduit`, `deduction` ni `patron`, `reduire` et `rendre` se comportent
  comme un automate à liaisons explicites — le banc d'essai l'exerce.
- **`valider(r)` descend dans les termes emboîtés**, sans quoi l'article obligatoire ouvrirait un trou,
  « affirmation » étant une catégorie que tout objet satisfait.
- **Le flag `cite` est porté par la liaison, jamais par le terme** — sinon la voie de comparaison, qui
  partage le bloc de premier terme, serait cassée.

**Les projections** ne se lient à rien : on passe un contenu, on reçoit une vue. Leur seule maison.

| Projection | Qui l'appelle |
|---|---|
| `champsDe(contenu)` — les empans aplatis en `"pid.eid"`, avec `nom`, `qui`, `court` | le jeu, l'atelier, le harnais |
| `comparaisonsDe(liens, formes)` — les comparaisons d'arité 2, emboîtées comprises, dédoublonnées | l'atelier, le harnais |
| `couleurDim(dimensions, d)` — le **rang**, jamais la pertinence (§4.3) ; `null` si inconnue | le jeu, l'atelier |

`couleurDim` rend `null` plutôt qu'une couleur de repli : le jeu grise, l'atelier montre en rouge —
chez lui, c'est une erreur d'écriture. **La marge de bruit doit rester non nulle**, sinon « sensé »
vaudrait « correct » : mesurée en direct par l'onglet Grammaire, jamais recopiée ici.

## 15. Les trois reflets

Les règles vivent dans `regles.js`, que le jeu et l'atelier **appellent**. Restent trois endroits où
l'atelier *décrit* le jeu faute de pouvoir l'appeler : la **frise** et les **pastilles** du pas-à-pas
(le déroulé, les drapeaux), le **diagnostic** et les **formulaires** (le schéma, §11), l'onglet
**Grammaire** (`moteur.js`).

**C'est le danger le plus coûteux du dépôt** : un reflet laissé derrière ne casse rien, ne lève rien,
aucune suite ne le voit — il ment tous les jours à celui qui écrit l'affaire. Le remède n'est pas une
checklist : que le reflet **appelle** ce qu'il reflète (§12), et là où il ne le peut pas, qu'une règle
du gardien tienne l'écart (§16).

**Ce que le diagnostic contrôle** : la règle de surlignage, le nom d'empan, le doublon banal dans les
deux sens, la grammaire (impasse, clôture sans forme, forme indicible, lien insensé, emboîtement dans
le vide, forme ordonnée sans `sens`, dimension sans forme déductible), les articles, le vice, les
sessions — plus l'article livré **trop tard**, qui rend une session inclôturable.

- **« Forme indicible »** : une forme existe de **deux façons** — déclarée par une liaison, ou déduite
  par un bloc `deduit` ; celle-là n'est nommée par aucun bloc.
- **L'ombrage n'est délibérément pas signalé** : `deduire` rend la **première** forme qui convient, et
  le signaler reviendrait à interdire le mécanisme qui tranche les ambiguïtés.
- **Point ouvert** : la frise édite `rep_inutile` et `rep_sans_rapport`, **pas `rep_hors_sujet`**.

Méthode (contenu) : écrire dans l'atelier → « Écrire content.js » (§10) → relancer les suites.

## 16. Les suites, le gardien, ESLint

Cinq suites sur un harnais jsdom commun (`tests/harnais.js`), **318 contrôles**. Ce qu'il expose — boot,
une lecture par surface, les désignations de contenu, les chemins — est en tête du fichier.

| Suite | Ce qu'elle prouve |
|---|---|
| `test_o5.js` (36) | l'index du dossier ; tout empan cliquable ; surligner et composer gratuits ; la marge de bruit non nulle ; le vice à canal unique ; les trois fins |
| `test_declencheurs.js` (34) | le décâblage, sur contenus **mutés** : `declenche`, la liste d'attentes, les trois drapeaux, contenu invalide refusé |
| `test_parcours.js` (123) | le grain fin : composer, retirer, effacer ; **le geste unique** ; le tutoriel ; les deux régimes de fondement ; les trois escalades ; la déduction ; le filtre de livraison ; la continuation ; la répétition |
| `test_sauvegarde.js` (38) | la partie survit au rechargement, **composition assemblée et non envoyée comprise** ; la signature jette une sauvegarde étrangère |
| `smoke_atelier.js` (87) | l'atelier et le couple atelier→jeu : réexport à l'identique, diagnostic complet, migration idempotente, renommages, pas-à-pas sur `regles.js`, écriture sur place (§10) |

- **Le contrat de lecture : `w.R.x(w.S)`** — une suite demande aux *règles*, pas à l'écran ; ce que la
  fenêtre expose en propre, ce sont les **gestes**, parce qu'eux redessinent.
- **Une suite ne redécide rien** : un prédicat recopié ne casse pas, ne lève pas, et reste vert en
  affirmant l'ancienne vérité — et **les suites ne se lisent pas elles-mêmes**.
- **Les tests ne nomment aucun contenu** : tout se dérive de la *forme*, si bien que **changer
  d'affaire ne casse pas une seule suite**. Sont épinglées, en revanche, des chaînes de chrome
  (`Envoyer`, `effacer`, `Opposer une phrase`, `déjà envoyée`, `● `, `✓ `, `zoneRetenus`) : on les
  renomme si on veut, jamais sans toucher au test qui les nomme.
- *Les Manuels n'ont plus de suite : `JEU.directives` et `JEU.avis_exploitation` ne sont plus lus par
  le jeu, alors que la frise les édite.*

**Le gardien** (`outils/gardien.js`, dans `npm test` après les suites) rend opposables les conventions
qu'aucune suite ne voit : **six règles, six pannes réellement vécues**, chacune citant son § — *la liste
vit dans son en-tête*. Il ne connaît ni pièce, ni empan, ni valeur.

- **Ce qu'une règle a le droit d'être** : le constat d'une panne payée, pas une préférence de style ; un
  motif vérifiable sur le source, pas une intention.
- **Sur quel territoire elle marche** — première question avant d'en ajouter une, et la réponse n'est
  pas « `app/` » par défaut : `tests/` et `outils/` *reflètent* les règles du jeu.
- **Ce n'est pas une cinquième source de vérité** (§12) : si une règle et son § divergent, c'est le §
  qui a raison. Les renvois sont des **numéros nus** — l'ancre d'un lien Markdown se calcule sur le
  titre, que renommer casserait en silence.

**`eslint.config.js`**, l'autre bout, générique : identifiant fautif, variable morte, clé dupliquée. Sa
liste de globals se **calcule** en demandant son inventaire au gardien. Deux assouplissements pour des
idiomes voulus : un `catch` qui ignore délibérément sa raison, et les noms de haut niveau d'une page,
qu'ESLint croirait morts faute de savoir lire un `onclick=`.

**Règle d'or : une évolution n'est finie que quand les cinq suites sont vertes**, gardien et ESLint
compris. **Les suites d'abord** : le sens avant la forme.

## 17. La carte

*Où vit une chose, et comment elle s'appelle. **Ce § n'explique jamais** ; en cas d'écart, c'est le code
qui a raison.*

| Fichier | Ce qu'il porte | Ce qu'il ne porte jamais |
|---|---|---|
| `app/content.js` | **le contenu** — une affaire, en un exemplaire | aucune règle |
| `app/regles.js` | **les règles** — tout ce qui décide | aucun contenu, aucun DOM |
| `app/moteur.js` | **la grammaire** et les **projections** (§14) | aucune donnée |
| `app/index.html` · `app/jeu.css` | la **structure** · la **mise en forme** | aucun script en ligne · rien que le JS relise |
| `app/jeu.js` | **l'écran et les gestes** — rendu, sauvegarde, tutoriel | ne décide rien |
| `app/atelier_v3.html` + `app/atelier/` | **l'atelier**, un fichier par outil | ne recopie rien, *y compris de lui-même* |

`regles.js` et `moteur.js` sont en **mode double** — `require` ou `<script src>` — et exposent une
**fabrique**. Hors fabrique et cloîtrés (§9) : `MoteurGrammaire.champsDe`, `.comparaisonsDe`,
`.couleurDim`, `ReglesJeu.estRegle`.

**Les huit modules de l'atelier, dans l'ordre de chargement** : `noyau.js` (contenu, outils, état
d'interface, annulation, onglets — **et les quatre gestes** ci-dessous ; en premier) · `graphe.js` (le
canevas ; seul endroit où du CSS traverse vers du JS, `getCSS`) · `diagnostic.js` · `inspecteur.js`
(formulaires, mutations, renommages) · `frise.js` (remises et attentes) · `pasapas.js` (**appelle**
`regles.js`) · `contenu-io.js` (import, export, migration, autosave) · `grammaire.js`.

**Les quatre gestes que tout l'atelier refait** (`noyau.js`, section *2 bis*) : `muter(f)` — **toute**
mutation passe par lui —, `poserOuRetirer`, `reinitSelection({garderEmpans})`, `demanderSuppr` +
`btnSuppr`. Plus deux formats : `deK(k)`, l'inverse de `K(pid,ch)`, et `reecrireTermes(t,f)`.

| Le geste | La règle (`regles.js`) | Le rendu (`jeu.js`) |
|---|---|---|
| l'avocat ouvre une session ; ouvrir une pièce ; l'index du dossier | `envoyerRemise` → `poserQuestion`, `ouvrirPiece` (+ `declenche`), `piecesLivrees` | `renderDiscussion`, `modalPieceHTML`, `rendreTexte`, `renderDossier` |
| **surligner** (privé, gratuit) | `surligner` | `renderRetenus` dans `renderMemoire` |
| ce que le composeur offre ; ce qui se devine avant le clic ; la voix | `blocsOfferts`, `etatCompo`, `indexTermeChamp`, `comparaisonPossible`, `dimAttendue`, `attenteCourante` | `renderCompo`, `souffle`, `rappelQuestion` |
| **poser un bloc** ; la clôture qui n'ajoute rien | `poserBloc`, `retirerBloc`, `viderCompo`, `clotureImplicite`, `chaineEnvoyable`, `peutEnvoyer`, `compoFinie` | `texteCompoPartiel`, `renderCompo` — la clôture n'est PAS un bouton |
| le pressentiment ⚑ ; **clore la phrase** | `majPressentiment`, `pressentir`, `sousLienVice` ; `clore` → `clorePhrase` | *(rien : privé, et aucun panneau)* |
| **envoyer** — le seul geste | `envoyerCompo` → `clore` → `envoyer` → `reponseAvocat` → `avancerSurAttente` | `renderCompo` (`#composeur`, **sous la Discussion**), `renderPlaidoirie` |
| ce qui entre à la Plaidoirie | `estMoyen` | `renderPlaidoirie` — **cache sa colonne** tant que rien ne s'y inscrit |
| clôturer, répétition, fin | `instructionComplete`, `cloturer`, `verserContre`, `avancerRepetition`, `finir` | `majCloture`, `finir` (modale) |
| le tutoriel (§4.8) | *(aucune — il ne décide rien)* | `tutoAttendu`, `tutoEtape`, `majTutoriel` |

- **Les deux voies de clôture** sont le **même** `clore`, appelé par le **même** `envoyerCompo` ; ce qui
  les sépare vit dans le contenu — une liaison `cite:true` contre une forme d'arité 2 déduite.
- **L'état `S`** : `etatInitial`, en tête de `regles.js`, où les vingt champs sont commentés un par un.
- **Deux normalisateurs de l'ancienne forme `attend`/`apres`, et c'est voulu** : `attentesDe`
  (`regles.js`) rend une paire fabriquée, `attentesDeRemise` (`noyau.js`) rend **la remise elle-même**,
  pour que l'inspecteur l'édite en place. Personne d'autre ne les lit sur une remise (R9), hors
  `attentesEditables` et `migrerContenu`.

**Les mots.** Le joueur ne lit jamais `empan`, `bloc`, `lien`, `forme`, `terme` : dans une chaîne
d'écran, c'est une fuite. À l'écran : **Discussion**, **Mémoire**, **Plaidoirie** (§4.6) ; **passage**
(un empan, vu du côté joueur) ; **Ta réponse** (la zone du composeur) ; **→ Envoyer** (clôt et transmet,
irréversible) ; **Clôturer l'instruction** (ferme l'affaire).

| Dans le code | Ce que ça désigne |
|---|---|
| **pièce** / **dossier** | un document (`JEU.pieces`) / l'ensemble des pièces livrées |
| **empan** | un fragment marqué : `texte`, `dim`, `valeur`, `qui`, `nom` |
| **citation** / **nom** | son écriture dans la pièce (`e.texte`) / comme sujet d'une phrase (`e.nom`) |
| **terme** | un empan (ou un lien imbriqué) **une fois posé** : un rôle, pas un objet |
| **bloc** / **liaison** / **lien** | la transition offerte par l'automate (les deux premiers mots sont interchangeables) / le triplet `{forme, termes}` **reconnu** : le lien est le résultat, la liaison le geste |
| **forme** | le patron grammatical d'une comparaison (`deduction`, `sens`, `patron`) |
| **attente** / **remise** | `{question?, attend, apres?}` / un envoi de pièces avec sa liste — « session » est le mot du sens |
| **`S.retenus`** / **`S.plaidoirie`** / **`S.fil`** | les empans surlignés / ce qui est entré au plan / le journal affiché |

**Deux faux amis qui mordent encore** : `clore` ferme **une phrase**, `cloturer` ferme
**l'instruction** et déclenche une fin — jamais l'un pour l'autre, commentaires compris ; `empan` ne
fuit jamais à l'écran, `passage` n'entre jamais dans `content.js` ni `moteur.js`.

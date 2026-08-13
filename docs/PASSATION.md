# IAvocat — Passation de contexte

*À lire en tête d’une nouvelle conversation. État au 14 août 2026, après la session « le dernier
territoire — les suites et les outils ».*

## 1. Où en est le jeu

**Vingt** décisions tiennent l'état actuel. Détail de chacune : `docs/ARCHITECTURE.md` §3, §4.5, §4.6, §4.8, §4.9 — et `docs/LEXIQUE.md` pour le vocabulaire.

1. **Trois sessions.** R1 lire/extraire/répondre (`p_pv`, `t_voisin`, aucun article) ; R2 comparer
   (`r_temoin`, l'article 3) ; R3 l'ADN et le vice.
2. **Un fait se cite, une relation se fonde.** Un empan seul se clôt par sa citation, sans article —
   le fondement est dans le geste. Une comparaison ne se clôt que par un article invoqué en
   continuation.
3. **La réponse citée s'écrit par le nom ET la citation**, avec la pièce : *« l'heure d'arrivée de la
   patrouille : « nous étions sur les lieux à 22h04 » (PV) »*. Une comparaison, elle, ne s'écrit que
   par les noms.
4. **Une remise attend une liste de réponses**, servies dans l'ordre — l'avocat pose, attend, accuse
   réception, repose.
5. **Une suite unique n'est pas un choix.** Quand l'état qui suit un terme n'offre qu'une liaison qui
   clôt sans emboîter, elle se pose d'office : répondre à une question simple demande trois gestes,
   pas quatre. Une liaison `imbrique` seule, jamais.
6. **Le tutoriel du premier geste.** Quatre temps (pièce → texte → mémoire → envoi), un halo qui
   entoure la zone où le geste a lieu, jamais un empan. Il corrige un passage qui ne répond pas (halo
   ambre) sans jamais l'empêcher ni dire lequel c'était. Il s'efface dès la première réponse envoyée.
7. **Une voix par état.** L'écran ne nomme jamais deux fois le même geste suivant : une seule aide,
   dérivée de l'état, dans le fantôme tant que la phrase est vide et dans l'aide dès qu'elle ne l'est
   plus. Un titre par zone, le locuteur au seul changement de locuteur, la puce de mémoire sur deux
   lignes. Trois phrases ne se coupent pas, parce qu'elles *sont* le jeu : « Rien n'en sort »,
   « → Maître Auber », « Et donc ? ».
8. **On répond sous la question** *(31 juillet)*. Le composeur quitte la colonne du milieu pour
   s'ancrer **sous le fil de la Discussion**, à la place d'une zone de saisie de messagerie. Les
   passages retenus, eux, **restent dans la Mémoire** — c'est un arbitrage pris avec l'auteur, pas un
   oubli : on rend la co-location du 28 juillet pour gagner l'évidence du geste (§7). Le composeur ne porte **aucune
   étiquette « privé »** : son statut se lit dans le fait que rien n'en sort.
9. **Ce qui n'existe pas encore ne s'affiche pas** *(31 juillet)*. La colonne de Plaidoirie est **entièrement
   retirée** tant que rien ne s'y inscrit — l'écran s'ouvre à deux colonnes. Elle apparaît au premier
   moyen versé, et c'est cette apparition qui l'enseigne. La phrase d'attente *« Il n'inscrit ici que
   ce qu'il peut plaider »* a disparu avec elle : elle était devenue inatteignable.
10. **Les en-têtes des trois surfaces** *(2 août)*. « Le canal », « L'atelier », « Le plan » s'affichent
    désormais « Discussion », « Mémoire », « Plaidoirie » — les noms de rôle du §4.6 ne changent pas,
    seul l'en-tête à l'écran change, et ne se confond pas avec `app/atelier_v3.html`, l'outil d'écriture
    du contenu, qui garde son nom. Dans la même session, la légende des dimensions et les notes d'aide
    de la modale de pièce (« Clique un passage… », « Rien à retenir ici… ») sont retirées.

11. **Un mot, une chose — jusque dans le code** *(2 août)*. `docs/LEXIQUE.md` arbitre désormais le
    vocabulaire, et le code s'y conforme. Les trois surfaces portent **le même nom partout**, du DOM
    au harnais : `discussion`, `memoire`, `plaidoirie`. `S.memoire` devient **`S.retenus`** (la
    surface *contient* le dossier et les retenus ; le tableau ne compte que les seconds).
    Et surtout : **`atelier` ne désigne plus qu'une chose** — `app/atelier_v3.html`, l'outil qui écrit
    les affaires. Il nommait aussi la surface du milieu du jeu, au point que `bootAtelier()` et
    `atelier(w)` voulaient dire le contraire l'un de l'autre à quinze lignes d'écart dans le harnais.
    C'était la seule vraie collision du dépôt, et la seule que le lexique avait manquée.
    **La frontière `empan` / `passage` reste**, elle : c'est la seule qui protège la fiction (§8.6).

12. **Dégraisser, sans toucher au sens** *(3 août)*. Aucune règle, aucun texte de contenu, aucun
    invariant n'a changé — le critère de la session était : zéro comportement observable modifié.
    Trois choses ont bougé. **`index.html` n'enveloppe plus `regles.js`** : ce qui redessine reste une
    fonction d'écran (les cibles de `onclick`), ce qui lit s'écrit `R.x(S)` sur place, et les suites
    lisent pareil, en `w.R.x(w.S)` — seize enveloppes sont tombées, dont cinq que personne
    n'appelait. **Les projections du contenu vivent dans `moteur.js`** (`champsDe`,
    `comparaisonsDe`, `couleurDim`) : l'aplatissement des empans existait en trois exemplaires, dont
    deux identiques au caractère près. **L'atelier est un dossier** : `app/atelier/`, un fichier par
    outil, la page retombe de 2 170 à 406 lignes. Et `openManuels()` est retirée (voir §3).

13. **Une page ne porte plus que sa structure** *(4 août)*. `app/jeu.css`, `app/jeu.js`,
    `app/atelier/atelier.css` : plus aucun `<style>` ni `<script>` en ligne. `index.html` passe de
    859 lignes à **85**, l'atelier de 406 à **156**. Rien n'a eu à changer dans le code déplacé — un
    script classique externe partage la même portée globale qu'un script en ligne. **Un seul
    changement d'écran**, isolé dans son commit : `--transmis` était employée huit fois et définie
    nulle part (voir §2), elle vaut désormais `#23506e`.

14. **Un nom pour deux choses** *(5 août)*. Suite directe de la 12, et même discipline : aucun sens,
    aucune règle, aucun contenu ne bouge. Le 2 août avait cherché les collisions dans le
    **vocabulaire** ; la 12 en a refermé deux dans l'**inventaire des noms de fonction**
    (`toutesPiecesLivrees`, `estRegle`). Il en restait **deux**, et ce sont les plus sournoises parce
    que les deux sens y sont *incompatibles* : `dimDe` devient **`dimEmpan`** dans l'atelier (celui de
    `moteur.js` répond « affirmation » pour un terme emboîté, celui-ci jamais), et `valider` devient
    **`diagnostiquer()`** (celui de `moteur.js` juge UNE phrase ; les deux rendaient « rien » quand
    tout va bien, ce qui est exactement pourquoi la collision a tenu si longtemps). `docs/LEXIQUE.md`
    porte le tableau. Avec, dans la même passe : le dernier `$("srcContenu")` mort, quatre familles de
    CSS sans porteur, `escapeH(null)` qui écrivait « null », et **un vrai défaut** — `pointer()` lisait
    encore le **schéma 2** (voir §2).

15. **Un gardien pour les pièges déjà payés** *(13 août)*. Les trois sessions précédentes convergent
    vers un constat : **les pannes qui coûtent cher ici ne sont pas des bugs de logique, ce sont des
    ruptures de convention que rien ne surveille.** Les suites lisent `innerHTML` — jamais un style
    calculé, jamais la forme d'une balise, jamais l'inventaire des noms globaux. Ce §2 tenait donc la
    liste à la main, depuis un an. `outils/gardien.js` la rend **opposable** : huit règles, huit
    pannes réellement vécues, chacune citant le § qui la tranche (§16 bis). Il entre dans `npm test`,
    **après** les suites — le sens avant la forme. Avec lui, `eslint.config.js`, le filet générique,
    dont la liste de globals ne s'écrit pas : elle se **calcule**, en demandant au gardien
    l'inventaire de chaque page (§12 — pas de copie).

    Ce qu'il a trouvé le jour même : **`.manuel`** dans `jeu.css` (orpheline depuis le retrait
    d'`openManuels()` le 3 août), **`.gpill.leve`** dans l'atelier (jamais posée depuis l'onglet
    « Grammaire »), **six des sept lignes** du tableau des territoires de `docs/CARTE.md`, et — par
    ESLint — sept variables mortes, dont la liste des dimensions de `modalPieceHTML`, restée après le
    retrait de la légende (décision 10). **Et un défaut dans le gardien lui-même**, dit par ESLint :
    son relevé de déclarations ne voyait que le premier nom de `let selA=null, selB=null` — un nom
    manquant à l'inventaire, c'est une collision que R2 ne verrait pas. Les deux filets se sont
    attrapés l'un l'autre, ce qui est le meilleur argument pour les avoir tous les deux.

    Enfin, une chose **remesurée** : le §13 se trompait à moitié sur `defer` (voir §2).

16. **L'atelier ne recopie plus rien, pas même lui-même.** Les quatre sessions précédentes ont toutes
    porté sur **le jeu et les modules partagés** — les enveloppes de `regles.js`, les projections
    réunies dans `moteur.js`, le CSS/JS sorti des pages, les collisions de noms, le gardien. L'atelier,
    lui, avait été **découpé en fichiers le 3 août sans être dégraissé à l'intérieur** : c'était le
    dernier territoire où le §12 n'était pas passé, et le plus dense en copies. Même critère que la
    décision 12 : aucune règle, aucun contenu, aucun invariant ne bouge.

    **Quatre gestes nommés** (`noyau.js`, section 2 bis), qui remplacent **soixante** écritures à la
    main : `muter` (l'épilogue `pushUndo` … `autosave(); render()`, 39 copies), `poserOuRetirer`
    (« écrire, ou retirer la clé si c'est vide », 9 copies), `reinitSelection` (7 copies) et
    `demanderSuppr`/`btnSuppr` (la suppression en deux clics, 5 gardes + 5 boutons). Avec deux formats
    qui ne se déplient plus qu'en un endroit : **`deK`**, l'inverse de `K(pid,ch)` qui manquait depuis
    toujours (10 `split(".")`), et **`reecrireTermes`**, la marche sur les termes emboîtés (3 copies).
    Et la classe **`.glose`** pour la parenthèse grise des libellés, écrite 24 fois en `style=` en ligne.

    **Ce que les copies avaient déjà fait dériver — un défaut, corrigé** : `pointer()` (le clic sur une
    ligne du diagnostic) était la seule des sept remises à zéro à oublier **`formPieceEdit`**. Comme
    `renderInsp` rend l'éditeur de texte en priorité, cliquer une ligne du diagnostic pendant qu'on
    éditait une pièce **ne montrait rien** — ni le trait désigné, ni l'empan surligné. Aucune suite ne
    couvre ce chemin. C'est exactement la panne que le §12 décrit, dans le seul territoire qu'il
    n'avait pas visité. Conséquence assumée : `pointer()` abandonne désormais aussi la paire d'empans
    sélectionnée — le diagnostic prend la main pour de bon.

    Le compte : **1 473 → 1 455 lignes de code** (commentaires et vides retirés) pour les huit modules.
    Le fichier total monte, lui, parce que chaque geste porte l'explication de pourquoi il existe — la
    discipline du dépôt. Ce qui compte n'est pas le compte : c'est que soixante endroits soient devenus
    quatre. Et le gardien a servi **le jour même** (voir §2).

17. **Une forme existe de deux façons, et le diagnostic n'en connaissait qu'une** *(13 août, décidé avec
    l'auteur)*. Trouvé en relisant l'atelier à l'œil après la décision 16, et tranché à part parce que
    ça change ce que le diagnostic **juge** — ce n'est pas du rangement. Le contrôle « forme indicible »
    demandait *« un bloc porte-t-il `forme: <f>` ? »*. C'était juste **avant la déduction** : le joueur
    déclarait alors la relation en cliquant une liaison, et toute forme devait être portée par un bloc.
    Depuis le §4.5, **le joueur désigne** — il clique le second empan (`t1`, `deduit:true`, sans
    `forme`), et `deduire()` calcule la forme des dimensions et des valeurs. Les quatre formes
    comparatives de l'affaire livrée étaient donc déclarées « indicibles » **à chaque ouverture de
    l'atelier**, alors que le jeu les prononce — `ordre_grandeur` est mot pour mot la phrase qui clôt
    le chemin docile de `npm run vue`. Même nature que le `pointer()` resté au schéma 2 (§2) : un
    contrôle que le changement de mécanique a laissé derrière, et qu'aucune suite ne couvre — les
    suites lisent le jeu, jamais le diagnostic.

    **La version retenue est la prudente** (le §15 la décrit) : « déductible » se lit comme `deduire`
    le lit, et **sur ce dossier** — `deduction`, arité 2, et un slot qui accepte au moins une dimension
    déclarée, plus un bloc qui porte `deduit`. La version en une ligne (« elle porte `deduction`, donc
    elle est dicible ») aurait cessé d'alerter sur une forme dont le slot ne nomme que des dimensions
    absentes, réellement inatteignable. Les quatre conditions manquent chacune autrement, donc se
    disent autrement : un avertissement qui ne nomme pas son remède n'en est pas un. **L'ombrage n'est
    délibérément pas signalé** — `deduire` rend la première forme qui convient, l'ordre de déclaration
    est signifiant (§11), et l'alerter reviendrait à interdire ce qui tranche les ambiguïtés.

    Le dossier livré passe de **4 avert. + 17 info** à **0 avert. + 17 info**. Ce n'est pas le bruit
    qui coûtait : c'est qu'une bande d'avertissements toujours pleine s'apprend à ne plus se lire, et
    qu'un vrai avertissement s'y serait perdu. Elle est vide, donc elle veut de nouveau dire quelque
    chose.

18. **Ce que le §15 demandait de resynchroniser, et qui ne l'avait pas été** *(13 août, décidé avec
    l'auteur)*. La décision 17 n'était pas un cas isolé : c'était **le premier relevé d'un genre**.
    Le §15 d'ARCHITECTURE tient un tableau de trois lignes — *« ce qui change → ce qu'il faut penser
    à suivre »*. La 17 en a réglé la moitié d'une. **Les deux autres n'avaient jamais été faites.**

    Le genre, d'abord, parce qu'il explique les quatre trouvailles d'un coup : **un reflet de
    l'atelier sur le jeu que le changement de mécanique a laissé derrière**. Il ne casse rien, ne
    lève aucune exception, et **aucune suite ne le voit** — les six lisent le jeu, jamais le
    diagnostic ni l'onglet Grammaire. Il ment simplement, tous les jours, à celui qui écrit
    l'affaire. C'est le défaut le moins cher à produire et le plus cher à découvrir de ce dépôt.

    **La densité de l'onglet Grammaire** (ligne 3 du §15) refaisait la réduction à la main —
    « la dernière forme déclarée du squelette ». Juste tant que toute forme était portée par une
    liaison ; faux depuis que `deduit` fait *calculer* la forme et qu'`imbrique` *emboîte* au lieu
    d'ajouter. Elle annonçait **21 de marge de bruit là où le moteur en compte 315** — un facteur
    quinze sur le seul chiffre pour lequel ce panneau existe (§14). La même écriture traînait dans
    `grammaire/test_grammaire2.js` ; là-bas elle était juste, et **la sortie du banc d'essai ne bouge
    pas d'un chiffre** (1609 / 125 / 8), ce qui est la preuve que le correctif ne touche que le faux.

    **Le diagnostic** (ligne 2) demandait encore `r.attend` — la forme d'avant les attentes en liste
    (§3) : **six informations mensongères** à chaque ouverture, une par lien qui porte un tag. La
    bande passe de `0 avert. + 17 info` à **`0 avert. + 11 info`**, et les onze qui restent sont
    toutes des « Bruit assumé », c'est-à-dire vraies.

    **Supprimer un empan ne retirait jamais son marqueur** du texte de la pièce : le motif s'écrivait
    avec **quatre antislashs**, donc un antislash littéral dans la regex compilée, donc rien. Défaut
    vieux comme la refonte du 27 juillet. L'atelier créait ainsi le « Marqueur orphelin » que son
    propre diagnostic signalait ensuite.

    **Et un contrôle de `smoke_atelier.js` qui passait par le vide, de trois façons empilées** — le
    pire des quatre, parce que c'est une *suite* : il cherchait l'article par le premier bloc portant
    une pièce (depuis la déduction, c'est le second empan, qui n'a pas de forme), la session qui
    attend par `r.attend` (−1 au schéma 3), et un message que le diagnostic ne dit plus. Chacune
    seule suffisait à le rendre toujours vert. Il mord de nouveau : on neutralise le contrôle du
    diagnostic, la suite tombe.

    Avec eux, deux choses qui ne sont pas des correctifs. **R9** au gardien — la sœur de R7 : hors
    des deux normalisateurs et des deux convertisseurs, plus rien ne *lit* `attend`/`apres` sur une
    remise (§16 bis). Et **les huit dernières mutations de l'atelier passent sous `muter`** : la
    décision 16 en avait rangé trente-neuf et laissé huit, toutes parce qu'elles renoncent *avant* ou
    font suite *après*. La forme était déjà tranchée au §2 — la garde reste avant l'appel, la queue
    passe après, `muter` ne se laisse pas interrompre de l'intérieur.

    *En écrivant R9, un défaut du gardien lui-même : les lignes qu'il annonçait étaient fausses (voir
    §2).*

19. **Le dernier territoire — les suites ne recopient plus rien** *(14 août)*. La session précédente
    concluait « le rangement est fini ». C'était vrai **de `app/`**, et vérifié : les projections sont
    appelées partout, `muter` n'a plus un traînard, R7 et R9 ne relèvent rien. Ce ne l'était pas du
    reste. **Les sept sessions de rangement (12 à 18) ont toutes porté sur `app/`, et les neuf règles
    du gardien aussi** — `marcher("app")`, en dur, dans R7 comme dans R9. `tests/` (1 965 lignes) et
    `outils/` (812) n'avaient jamais été dégraissés et n'étaient tenus que par ESLint. C'est le même
    oubli que celui de la décision 16, d'un cran : l'atelier avait été découpé sans être dégraissé ;
    les suites, elles, n'avaient jamais été regardées **du tout**.

    Même critère que les décisions 12 et 16 : aucune règle, aucun contenu, aucun invariant ne bouge,
    et **325 contrôles — le même nombre**, tous verts.

    **Une RÈGLE était recopiée quatre fois à la main.** `estRegle` — *une pièce est-elle un article du
    manuel ?* — vit dans `regles.js` **hors de la fabrique, exprès**, pour qu'on puisse la poser sans
    `JEU` lié (§12) ; `app/atelier/noyau.js` l'appelle depuis le 3 août. Le harnais, lui, la
    réécrivait (`pidRegle`, puis `surContenu.pidRegle`), et `smoke_atelier.js` deux fois de plus. Or
    le harnais `require` déjà `moteur.js` **pour cette raison exacte** — il n'avait simplement jamais
    fait le même geste pour les règles. Le jour où le prédicat change, le jeu change et quatre
    contrôles continuent d'affirmer l'ancienne vérité, verts.

    Avec elle, deux autres dédoublements du même genre : les **prédicats du vice**, écrits deux fois
    (les sélecteurs de fenêtre en `.find`, ceux de `surContenu` en `.findIndex`) — on partage
    désormais le prédicat, jamais la fonction, parce que les deux familles doivent rester deux noms ;
    et **l'index du terme qui prend un empan**, écrit cinq fois en `findIndex` alors que `regles.js`
    l'exporte sous le nom `indexTermeChamp`, que `jeu.js` emploie. Plus deux commodités : un seul
    constructeur de fenêtre pour `boot`/`bootAtelier`, et un `deK` pour les cinq `split(".")` restés
    à la main — l'atelier avait nommé ce geste le 13 août, le harnais ne l'avait pas.

    **Et le gardien marche enfin sur le dernier territoire** : R7 et R9 étendues à `app`, `tests`,
    `outils`, plus **R10** — *aucun fichier ne recopie un prédicat que `regles.js` exporte*. Sans
    elle, la recopie se referait : les suites ne se lisent pas elles-mêmes, et c'est exactement le
    genre d'écart qu'aucune des six ne peut voir. Le territoire s'est trouvé **sain sur R7 et R9** —
    on étend un filet sur un terrain propre, ce qui est le bon moment.

20. **La migration émet la forme du §3, pas celle d'avant** *(14 août, décidé avec l'auteur)*.
    Tranchée à part de la 19, comme la 17 l'avait été de la 16, et pour la même raison : **ça change
    ce que `migrerContenu` ÉMET**, donc ce n'est pas du rangement.

    L'accusé de réception d'une case migrait **sur la remise** (`r.apres`) — la forme d'avant les
    attentes en liste. C'était le **dernier producteur** de l'ancienne écriture dans le dépôt, et le
    prix était entièrement silencieux : `attentesDe` ne rend une paire que si `attend` existe *aussi*
    sur la remise. Un `apres` migré seul n'était donc lisible **ni par le jeu ni par l'atelier** —
    `attentesDeRemise` rendant `[]` de la même façon, l'inspecteur ne pouvait pas même l'éditer. Une
    donnée qu'on migre et que plus personne ne peut atteindre est pire qu'une donnée perdue : elle se
    voit dans le JSON, et nulle part ailleurs.

    L'accusé se pose désormais sur la **première attente** de la session. **On n'en invente aucune** :
    si la session n'en déclare pas, l'accusé reste où il est — une attente sans `attend` serait
    toujours trouvée non servie par `attenteCourante`, deviendrait l'attente courante *pour toujours*,
    et **bloquerait l'avancement de session**. Le remède aurait été pire que le mal, et c'est le seul
    endroit de cette session où il fallait s'arrêter avant d'aller au bout du geste.

    `contenu-io.js` **reste** dans les tolérés de R9 : c'est un convertisseur, il doit continuer à
    *lire* l'ancienne forme. Ce qui a changé, c'est qu'il ne l'écrit plus.

## 2. Points de vigilance

*Les points marqués **[Rn]** sont désormais tenus par une règle d'`outils/gardien.js` : ils restent
écrits ici — le § reste l'arbitre, le gardien n'est qu'un bras (§16 bis) — mais on n'a plus à y
penser. Les autres sont encore à la main, et c'est là qu'il faut regarder.*

- **[R10] Une suite DÉSIGNE, elle ne DÉCIDE pas** *(posé le 14 août)*. Le contrat du §16 était écrit
  pour les lectures (`w.R.x(w.S)`, jamais `w.x()`) ; il vaut tout autant pour les **prédicats**. Une
  suite qui réécrit `(p.type||"").includes("règle")` au lieu d'appeler `estRegle` ne casse pas, ne
  lève pas, et reste verte le jour où la règle change — elle affirme simplement l'ancienne vérité,
  pour toujours. Le harnais `require` `moteur.js` **et** `regles.js` : tout ce que ces deux modules
  publient s'appelle, ne se recopie pas. R10 le tient, sous la forme vérifiable `includes("règle")`
  hors d'`app/regles.js`.
- **Les suites ne se lisent pas elles-mêmes, et c'est leur angle mort** *(14 août)*. Les six éprouvent
  le jeu et l'atelier ; **rien n'éprouvait les six**. Quatre recopies d'une règle y ont vécu sans que
  personne puisse les voir — ni les suites, qui ne s'inspectent pas, ni le gardien, dont les neuf
  règles marchaient sur `app/` en dur. À retenir avant d'ajouter une règle au gardien : demander
  **sur quel territoire** elle marche, la réponse n'est plus « `app/` » par défaut.
- `test_autre_affaire.js` n'a pas bougé d'une ligne depuis le découpage en trois sessions ni depuis
  le tutoriel : c'est le contrôle qui prouve que la liste d'attentes et la clôture automatique sont
  des **généralisations**, pas des remplacements.
- Le flag `cite` est porté par la **liaison**, jamais par le terme — `t0` est partagé par citation et
  comparaison.
- L'index `iBloc` de `poserBloc` est **positionnel dans la liste filtrée**, donc dépendant de la
  session.
- Les `const` de haut niveau ne sont pas des propriétés de `window`.
- **[R2] …mais ils occupent quand même le nom.** C'est le piège symétrique, et il a mordu : chargé par
  `<script src>`, `moteur.js` partage la portée globale de la page. Un `function couleurDim` de haut
  niveau y heurtait le `const couleurDim` d'`index.html` — en jsdom **comme en vrai navigateur**. Les
  projections et `estRegle` sont donc cloîtrées dans une fermeture, et ne sortent que par
  `MoteurGrammaire.x` / `ReglesJeu.x`. Toute fonction ajoutée hors fabrique a le même devoir.
- **Les suites lisent le jeu en `w.R.x(w.S)`, jamais `w.x()`.** Ce que la fenêtre expose en propre,
  ce sont les gestes — ceux qui redessinent. Écrire `w.blocsOfferts()` remarche le jour où quelqu'un
  remet une enveloppe, et c'est exactement ce qu'on ne veut plus.
- **L'ordre des `<script src>` de l'atelier compte** — `noyau.js` en premier, c'est le seul dont le
  corps s'exécute au chargement. Le reste se voit par *hoisting*, résolu à l'appel. Et les
  `window.X = X` explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) ne sont pas
  décoratifs : c'est par eux que `smoke_atelier.js` lit l'atelier.
- **Le harnais inline TOUT `<script src>` et TOUT `<link rel=stylesheet>`**, par regex et dans
  l'ordre. Ajouter un fichier ne demande plus d'y revenir — mais un module mal ordonné se verra en
  `ReferenceError` au milieu d'une suite, pas à l'ouverture.
- **[R1] La regex du harnais est stricte, et c'est le piège du CSS/JS sorti du HTML.** Une balise doit
  s'écrire `<script src="x.js"></script>` sur UNE ligne, sans attribut. Une variante n'est pas
  inlinée : jsdom ne charge rien, les six suites meurent en `ReferenceError`.
- **[R1] Ni `defer` ni `async` sur ces balises, jamais** — mais **pas pour la raison qu'on croyait**.
  Cette liste disait : « le harnais inline, donc un attribut de timing ferait diverger le test du
  navigateur, et le test resterait vert pendant que la page casse ; c'est le seul piège de la série
  qui soit silencieux du mauvais côté. » **Mesuré le 13 août, ce n'est pas vrai** : on pose `defer`,
  on lance les six suites, et quatre contrôles tombent — la regex est si stricte que la balise n'est
  pas inlinée *du tout*. Idem pour une balise mise en commentaire. Le danger décrit est celui qu'on
  courrait si la regex était **relâchée** : c'est un argument pour la garder stricte, pas une
  description de ce qui se passe. Ce qui reste vrai, et que R1 tient : l'écart se dit sur la balise,
  pas en `ReferenceError` au milieu d'une suite. *À retenir au-delà : une menace qu'on croit courir
  est du même genre qu'une laisse qu'on croit tendue (§16) — elle fait craindre le mauvais geste.
  Éprouver coûte deux minutes.*
- **[R4] Une classe engendrée s'écrit `${x?"arm":""}`, jamais `${x?" arm":""}`.** Le gardien relève une
  classe portée de deux façons : dans un `class="…"`, ou dans une chaîne qui n'est **qu'un mot**. En
  factorisant le bouton de suppression en deux clics (décision 16), la forme concaténée
  `class="${cls}${arme?" arm":""}"` a mis l'espace *dans la chaîne* — et `.arm`, bien vivante, est
  passée pour une famille morte. R4 l'a dit dans la minute. À retenir : le gardien ne lit pas le DOM,
  il lit le source ; une classe qu'on lui cache est une classe qu'il croira orpheline, et la
  prochaine main la retirera. Écrire les fragments conditionnels comme le reste du dépôt les écrit
  (`${pris?'pris':''}`) n'est donc pas du style.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS — un `return` dans `f` n'y coupe
  pas.** C'est le comportement d'avant, à la ligne près : `majAttente` poussait déjà son annulation
  avant de découvrir que l'attente n'existait pas. Si un jour une mutation doit pouvoir renoncer sans
  laisser d'entrée d'annulation, ça ne s'obtient pas en sortant de `f` — il faudra le dire à `muter`.
- **Le CSS est inliné parce que `getCSS()` le lit.** Les couleurs de trait du graphe
  (`app/atelier/graphe.js`) sortent de `getComputedStyle` sur `:root` — seul endroit du dépôt où du
  CSS traverse vers du JS. jsdom résout les variables d'un `<style>` en ligne et rend `""` pour un
  `<link>` : sans le filet, le graphe aurait changé sous test sans qu'un contrôle ne bronche, aucune
  suite ne lisant jamais une couleur.
- **Prouver qu'un CSS externe est chargé demande une assertion explicite** — une page sans style
  passe pour une page qui marche. On vérifie le fond du `body` **et** que la *dernière* règle du
  fichier s'applique. Lire `cssRules` d'une feuille `file://` lève une `SecurityError` : ça ne se
  mesure pas comme ça.
- **[R3] `--transmis` (`#23506e`) est le bleu de ce qui a franchi la frontière** (§4.6) : bulle de l'IA,
  pièces jointes, bouton d'envoi, phrase close, liste du plan. Elle était employée huit fois et
  définie nulle part. Corrigé le 4 août ; c'est la seule chose de cette série qui ait changé l'écran.
  **Le mécanisme, remesuré le 5 août — les huit règles ne tombaient pas de la même façon, et la moitié
  tombait plus bas qu'on ne l'a écrit.** Une `var()` introuvable rend la déclaration *invalide au
  calcul* : la propriété passe à `unset`, ce qui pour un **raccourci** vide toutes ses longhands.
  Relevé au navigateur sur `.attach{border:1px solid var(--transmis)}` — sans la variable,
  `border-top: none / 0px` : **pas un filet de la mauvaise couleur, pas de filet du tout**. Les trois
  règles qui posent `border-color` seul (bulle de l'IA, `.compo.prete`, bouton d'envoi) sont le cas
  doux, et pour elles le `currentColor` d'hier était juste. À retenir avant de retirer une variable de
  `:root` : compter ses usages, et regarder si ce sont des raccourcis. **Aucune suite ne voit ni l'un
  ni l'autre** — elles lisent `innerHTML`, jamais le style calculé.
- **[R9] Le tag d'une session vit sur l'ATTENTE, jamais sur la remise** *(corrigé le 13 août)*.
  `r.attend` et `r.apres` restent **lisibles** — une affaire écrite avant le §3 se joue sans
  modification — et c'est tout le piège : une branche restée à l'ancienne forme ne casse pas, ne
  lève pas, elle répond « non » pour toujours. Elle l'a fait deux semaines dans le diagnostic. Quatre
  fonctions ont le droit de connaître l'ancienne écriture, R9 les nomme, et personne d'autre.
- **Une suite peut passer par le vide, et rien ne le dit.** Le contrôle « un article livré après la
  session qui l'attend » de `smoke_atelier.js` était vert depuis des semaines **sans rien éprouver**
  — trois raisons empilées, chacune suffisante (§1, décision 18). Un contrôle enveloppé d'un `if`
  qui choisit entre « ça mord » et « (pas de piège ici) » est **toujours vert par construction** :
  la seule façon de savoir s'il tient, c'est de **casser ce qu'il surveille et de le voir tomber**.
  À faire au moins une fois pour tout contrôle conditionnel.
- **Le gardien annonçait des lignes fausses** *(corrigé le 13 août)*. `decouperJS` blanchissait les
  commentaires de bloc et le texte des gabarits **en les raccourcissant** : R7 et R9 comptaient trop
  peu de sauts de ligne et désignaient la ligne 123 pour un écart vivant à la 153. Les sauts sont
  désormais restitués. À savoir avant d'ajouter une règle qui cite une ligne : la vue `code` doit
  rester **alignée** sur le fichier, un `\n` étant du blanc pour tout le reste.
- **[R7] Le diagnostic de l'atelier lisait encore le schéma 2** *(corrigé le 5 août)*. `pointer()` dépliait
  `l.a[0]`/`l.b[0]` — le format d'avant le schéma 3. Sur le contenu livré, `liens[7].a` vaut
  `undefined` : cliquer l'avertissement « le vice a N canaux indépendants », son seul émetteur, levait
  une `TypeError`. **Aucune suite ne couvre ce chemin.** La leçon vaut au-delà : la migration 2→3 a été
  faite dans l'import, pas partout — chercher `\.a\[|\.b\[` avant de croire qu'il n'en reste plus.
- La règle de clôture automatique (point 5) se déclenche sur un **compte** de blocs offerts : ajouter
  ou retirer un bloc de grammaire peut changer le nombre de clics ailleurs dans l'affaire.
- Une sonde du harnais (`poserComparaison`) ne doit rien laisser au journal si elle échoue en chemin.
- Le tutoriel se termine sur `S.satisfaits`, pas sur `S.plaidoirie` : une réponse hors sujet ne clôt
  pas la leçon.
- Le doublon banal (§4.4) porte tout le camouflage depuis la déduction : ne jamais désactiver son
  contrôle.
- La relecture à l'œil des phrases composées reste irremplaçable après toute retouche du contenu ou
  de la grammaire.
- Des chaînes de **chrome** sont épinglées par les suites (`Le dossier`, `Ce que tu retiens`, le
  `Maître Auber` du bouton d'envoi) : les renommer sans toucher au test qui les nomme casse une suite
  sans rien dire d'utile (§16). *`ce qu'il peut plaider` n'en fait plus partie : la phrase et son
  assertion ont disparu avec la colonne vide (décision 9). `elle se lit` et `legende` n'en font plus
  partie non plus : la légende des dimensions et les notes d'aide de la modale ont été retirées
  (décision 10).*
- **[R6] Quatre ids sont des points d'ancrage, pas de la décoration** : `#discussion` (1ᵉʳ temps du
  tutoriel, et `outils/vue.js` le lit), `#zoneRetenus` (3ᵉ temps), `#composeur` (4ᵉ temps **et**
  lecture d'écran du harnais), `#colPlaidoirie` (ce que `plaidoirieVisible` interroge). Les renommer
  casse le tutoriel **en silence** — `majTutoriel` teste `if(tutoCible)` et ne se plaint jamais d'une
  cible introuvable. C'était l'un des points les plus mal tenus du dépôt : jusqu'au 13 août, seule la
  capture `00-depart.png` prouvait que le halo visait encore quelque chose. R6 lit maintenant les
  sélecteurs mêmes que `tutoEtape` écrit — l'id **et** les classes.
- **Les captures de `npm run vue` ne se comparent PAS à l'octet — et `00-depart.png` moins que les
  autres** *(mesuré le 13 août)*. Le halo du tutoriel **pulse** (`animation:pouls 1.8s infinite`) :
  cette capture-là tombe à une phase quelconque de l'animation, si bien que deux passes sur le
  **même** code rendent deux fichiers différents. Les six autres, elles, sont reproductibles à
  l'octet — c'est ainsi qu'on a prouvé que retirer `.manuel` ne déplaçait pas un pixel. À savoir
  avant de conclure d'un `diff` de captures : la seule qui porte le halo est la seule qu'on ne peut
  pas comparer ainsi, et c'est aussi la seule qui prouve que le halo vise quelque chose.
- **`#composeur` est le frère de `#discussion`, jamais son enfant.** `renderDiscussion` finit par
  `el.scrollTop=el.scrollHeight` : glissé dedans, le composeur partirait au défilement à chaque
  message.
- **`.col{display:flex}` bat `[hidden]{display:none}`.** Cacher la colonne de Plaidoirie par le seul
  attribut `hidden` ne ferait rien sans la règle explicite `.col[hidden]{display:none}` — et
  `.cloture` est câblée sur trois colonnes (`grid-column:1/4`), d'où la variante `.wrap.sansPlan`.
- **`S.retenus` est sérialisé dans `localStorage`.** Il s'appelait `S.memoire` avant le 2 août, et la
  signature de contenu **ne protège pas** d'un renommage d'état : le contenu, lui, n'a pas changé.
  `restaurerPartie` porte donc une reprise explicite. Tout futur renommage de champ d'état a le même
  devoir — sinon le joueur retrouve sa partie amputée, sans un mot.

## 3. Ce qui reste ouvert

| Sujet | État |
|---|---|
| Une question posée guide-t-elle trop ? | Le tutoriel **charge** ce point : il fait quatre pas à la place du joueur. Repli sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. **Non éprouvé** |
| La compréhension est-elle encore *exprimée* ? | Depuis que la relation se déduit, un joueur peut rapprocher deux empans au hasard et obtenir une phrase bien formée. **Non éprouvé** |
| Le critère qui décide de tout : pensée ou formulaire ? | Les phrases se lisent bien à l'écrit ; reste à juger en jouant |
| La marge de bruit | Mesurée par la suite de test, pas figée dans un nombre |
| **Le va-et-vient entre les deux colonnes** | **Le point ouvert le plus concret, et le prix de la décision 8.** On clique une puce dans la Mémoire, la phrase s'écrit sous la Discussion. Deux symptômes à guetter en jouant **une session entière** : le regard qui cherche où le texte est parti, la main qui repose un empan parce qu'elle a perdu le fil. Repli : faire descendre la mémoire aussi — **pas** remonter le composeur. **Non éprouvé** |
| Le rythme des zones | La Mémoire ne porte plus que le dossier et les retenus ; la Discussion porte le fil et la phrase ; l'écran s'ouvre à deux colonnes. **À juger en jouant**, pas sur capture |
| L'aide unique en dit-elle assez ? | Le composeur ne nomme plus le geste suivant qu'une fois. **Non éprouvé** : c'est le repli le plus simple si un joueur se perd — remettre l'aide sous le composeur, elle est à un `if` près |
| La majuscule en tête de phrase composée | Non traité |
| La progression : portes, place de la Fin 3 | Trois sessions actées ; la porte de la Fin 3 reste à placer |
| `comment` en sixième dimension | Écarté, réintégrable sans coût |
| Le canal de révélation de la culpabilité | Non tranché |
| **`rep_hors_sujet` ne s'écrit pas dans l'atelier** | La frise édite `rep_inutile` et `rep_sans_rapport`, **pas la troisième escalade** — celle des citations qui ne répondent pas, née avec « un fait se cite ». Le contenu la porte, `reponseAvocat` la lit, l'atelier ne sait pas l'écrire. C'est la **ligne 1 du §15** (« vérifier que la frise décrit toujours le déroulé »), et la seule des trois qui reste ouverte. **Écarté de la session du 13 août avec l'auteur** : ça ajoute un champ, donc une fonctionnalité, pas une correction |
| Les Manuels | **Tranché le 3 août : `openManuels()` est retirée**, avec les sept contrôles qui la maintenaient seule en vie — on éprouvait un chemin injouable. La **règle** reste dans `regles.js` (`reglesLivrees`, `porteDe`) : rebrancher les Manuels reste une décision de design, et ne coûtera pas une ligne de moteur. **Conséquence à garder en tête** : `JEU.directives` et `JEU.avis_exploitation` ne sont plus lus par le jeu, alors que la frise les édite toujours et que le diagnostic avertit encore de leur absence |

## 4. Prochaine étape

1. **Jouer `app/index.html` en `file://`, de bout en bout, à froid**, et juger trois choses d'un
   coup : la session 1 (la réponse par citation répond-elle, ou reformule-t-elle ? la session 2 se
   lit-elle comme « maintenant, mets-les en rapport » ?), l'écran allégé (l'aide unique du composeur
   suffit-elle à savoir quoi faire ?), et **le va-et-vient de la décision 8** — c'est le neuf, et
   c'est ce qui a un prix connu d'avance.
2. Si la boucle tient : écrire la session 4 et placer la porte de la Fin 3.
3. Si la session 1 guide trop : retirer les `question` une à une — c'est le repli, et il n'exige
   aucune ligne de code. Si l'écran ne guide plus assez, le repli symétrique est aussi court :
   rendre l'aide **et** le fantôme, comme avant.

**Le rangement est fini — cette fois pour de bon, et sur les quatre territoires.** Huit sessions y
auront passé (décisions 12 à 19). La précédente le déclarait déjà fini : elle avait raison sur
`app/`, et n'avait pas vu que `tests/` et `outils/` n'avaient jamais été regardés. Il n'en reste rien
de nommable, et surtout **le gardien couvre désormais tout ce qui est du code** — c'est ce qui rend
la déclaration tenable cette fois, au lieu d'être une impression. Ce qui reste ouvert côté outil
tient en une ligne du §3 — `rep_hors_sujet`, qui ajoute un champ. **La prochaine session porte sur le
SENS**, et la seule façon de la commencer est de jouer.

*Un mot pour qui reprendra le fil du 13 août : quatre défauts ont été trouvés en relisant l'atelier à
l'œil, aucun par une suite, et les quatre étaient du même genre — un reflet resté à l'ancienne
mécanique. Le §15 les nomme désormais un par un. **La leçon est qu'un reflet doit APPELER ce qu'il
reflète**, et que là où il ne le peut pas, c'est une règle du gardien qui tient l'écart. Quatre des
dix règles existent pour ça (R7, R8, R9, R10).*

*Et un mot pour qui reprendra le fil du 14 : la leçon de la 19 n'est pas « il restait des copies »,
c'est **qu'on avait cherché les copies là où on savait déjà regarder**. Sept sessions de suite ont
dégraissé `app/` parce que c'est ce que le gardien surveillait, et le gardien surveillait `app/`
parce que c'est là qu'on avait eu mal. La question à poser avant de déclarer une passe finie n'est
pas « qu'est-ce qui reste ? » mais **« où n'ai-je pas regardé ? »**. Ici la réponse tenait en une
ligne de code —* `marcher("app")` *— et valait 2 800 lignes.*

**Méthode à conserver :** toute évolution part de `docs/ARCHITECTURE.md` — on réécrit le document, on
le fait relire, puis on applique au code.

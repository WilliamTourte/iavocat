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

- [ ] **⚖ « Article 7 » tout court sur le bouton**, comme Jean le propose : se lirait comme un choix,
      et forcerait à lire l'article. Contre le §4.5, où le libellé *n'est pas neutre* et annonce ce que
      l'article fait du fait (arbitré le 16 septembre). *Jean 4* — *Une issue : la passe F (§0 bis) —
      le nom neutre sur la fiche du CONTEXTE, le libellé dans la phrase.*

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

- [ ] **Retirer « remise close » : on ne purge pas le CONTEXTE entre deux remises.** La remise
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
      plus récent en tête de chaque dimension — et seulement si elle remord en jeu. *Bérengère*
- [ ] **Cliquer DISCUSSION agrandit la conversation et réduit le CONTEXTE.** L'en-tête est un `<h2>`
      sans action ; au-dessus du seuil, le CONTEXTE prend les deux tiers (§4.6, demande de l'auteur
      du 4 octobre). Proposé : l'en-tête devient une **bascule** (`aria-pressed`), un état d'**écran**
      jamais sauvé comme `dossierPlie`, qui n'existe que CONTEXTE ouvert (§4.9 règle 4). Au-dessus du
      seuil, le gabarit passe de `1fr / 2fr` à `2fr / 1fr` — seul le gabarit change, jamais un span
      (PIÈGE du §2 de `docs/PASSATION.md`) ; en dessous, le panneau descend à son plancher et la
      conversation prend le reste. Un second clic rend la place. **À trancher en écrivant le §4.6** :
      ouvrir une pièce rend-il la place au CONTEXTE (proposé : oui, comme une pièce replie l'index —
      lire une pièce dans un tiers, c'est le défaut que les deux tiers réparaient) ; la PLAIDOIRIE
      (proposé : sans objet, sa colonne est déjà étroite). `npm run vue` capture l'état agrandi en
      1280×800 et 390×800, la bulle comprise (`placerTuto`). *Bérengère*

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

- [ ] **Cliquer un passage de l'article pour le retenir au CONTEXTE** — pour montrer qu'on l'a lu, et
      un seul geste pour tout ce qui y entre. L'article n'a aucun passage (`empans: {}`), et il s'offre
      dès que sa pièce a été **ouverte** (`blocsDepuis` lit `S.examinees`) : ouvrir vaut lire.
      *Bérengère*
- [ ] **L'article ne paraît plus de lui-même au composeur** : il s'y offre parmi les propositions
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

**Passe G — le joueur choisit la relation : le §4.5 s'inverse.** *Tranché par l'auteur le 6 octobre,
parti du « conforme / non conforme » de Bérengère ; reprend le chantier **d** du §5. Le plus gros de
la liste : document d'abord (§4.2, §4.4, §4.5, §4.7, §4.8, §4.11, §11, §14), puis moteur, règles,
écran, atelier, suites.*

- [ ] **Deux passages posés, le joueur choisit ce qui les lie**, entre **les deux relations de leur
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

**Avant, seul, avec `npm run vue`**

- [ ] **L'incohérence appel + arrivée** (*« ne se comparent pas »*) — **non reproduite** : sur un jeu
      neuf comme en session 2, l'heure de l'appel et l'heure d'arrivée se composent dans les deux
      ordres (*« … précède … »*). Retrouver le chemin exact de Jean (session, ordre des clics, phrase
      déjà entamée ?) avant de corriger quoi que ce soit. *Jean 1*

**Sur un vrai téléphone** — jamais joué : ni Jean ni Colas n'ont testé le mobile.

- [ ] **La pièce reste à l'étroit** : à 390×800 le panneau entier ne fait que 353 px, la pièce n'y
      montre que deux lignes, et le panneau redéfile d'un bloc. *Arbitré par l'auteur : le CONTEXTE y
      reste entre la conversation et le composeur* — ni retenus repliés, ni pièce en pleine hauteur.
      *Jean 1*
- [ ] **La bulle ancrée**, à côté d'une zone longue (le texte de la pièce) : couvre-t-elle ce qu'on
      vient chercher ? Jouée seulement dans Chromium, 1280×800 et 390×800.
- [ ] **Le code couleur au toucher** : sans légende ni survol, comprend-on ce que couleur et trait
      veulent dire ? On ne les voit qu'une fois le passage retenu, rangé sous le nom de sa dimension.
      *auteur*

**En rendant la partie à Colas**, qui s'est proposé pour tester la suite

- [ ] Rendre la partie à Colas.
- [ ] La question se lit-elle **avant** les pièces ? Colas ouvrait les pièces sans avoir lu la question
      placée dessous. *Depuis, la remise porte sa question en un seul message, le bouton de pièces
      après elle (§4.6)* — à confirmer.
- [ ] La première consigne (« Ouvre ton CONTEXTE », une bulle à côté du bouton de pièces) est-elle
      encore trop abrupte sans contexte ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [ ] Ce que personne n'a encore touché : « ⟲ recommencer ». *La croix × est réglée (Jean 3 l'a
      confirmée) : la fiche dit « oublier », la croix du CONTEXTE perd Échap pièce ouverte — à
      confirmer avec lui.*
- [ ] Le CONTEXTE qui reste ouvert d'un envoi à l'autre (même remise) : soulage-t-il, ou
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

**Le CONTEXTE élargi**

- [ ] **RAG** : pouvoir retenir des passages des messages de l'avocat, et des infos qui ne viennent pas
      que de lui.
- [ ] **Regrouper les passages retenus en clusters** (idée d'un ami).

**L'histoire** — à concevoir ensemble : le scénario porte les trois autres.

- [ ] **Le nouveau scénario** en préparation ; l'actuel n'est qu'un placeholder.
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

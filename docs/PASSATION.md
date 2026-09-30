# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 16 septembre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins. `npm test` est vert —
373 contrôles, 6 règles du gardien, ESLint.

Le 15 septembre a changé deux choses, toutes deux venues d'une **partie jouée** : **la session 1 va
jusqu'à la comparaison** (l'article 3 arrive avec le premier lot, trois sessions deviennent deux, §3)
et **clore et envoyer n'en font plus qu'un** (`vice_trouve` se lève à l'**assemblage**, sans quoi la
Fin 2 devenait injouable, §4.7).

Le 16 septembre est une session d'**écriture**, pas de mécanique : la liaison-article dit désormais
*« en contradiction avec »* et non *« au regard de »* (§4.5), la première question descend dans le
**texte de la remise**, le tutoriel est repris, un empan ne se désélectionne plus depuis sa pièce, et
la **colonne Plaidoirie est escamotée** — provisoirement, mécanique intacte derrière (§4.9). Deux de
ces gestes ont fait tomber **cinq contrôles** qui nommaient du contenu au lieu de le dériver : ils sont
réécrits, et la doc est remise d'aplomb sur ce que le code fait.

**Deux passes de retours playtest** ont suivi, sur la même partie jouée. La première a rendu le
tutoriel plus lisible, fait de `#composeur` un bandeau plein largeur et appliqué le repli du §4.6 — un
clic dans le composeur fait descendre le Contexte. La seconde reprend ce que cette partie montrait
encore : **le Contexte tombe à un tiers de la largeur** (la Discussion prend les deux autres, et le
tiers ne bougera pas au retour de la Plaidoirie), **l'index nomme les pièces comme la Discussion les a
transmises** — plus d'abréviation à faire de tête au moment de retrouver une pièce —, et **le bandeau
du tutoriel monte en tête de page, dans le flux** : il pousse le jeu au lieu de le recouvrir (§4.6,
§4.8).

**Les deux surfaces de côté sont devenues des PANNEAUX** (§4.6, §4.9). L'écran n'a plus qu'une colonne,
empilée en **trois bandes** : la conversation, le panneau ouvert, le composeur. Le Contexte et la
Plaidoirie s'ouvrent **entre** les deux autres et **ne recouvrent rien** — la conversation rétrécit
pour leur faire place, si bien que la question reste sous les yeux pendant qu'on choisit un passage et
qu'on voit la phrase se construire. Deux portes y mènent : **la voix du composeur**, qui devient un bouton quand le geste qu'elle nomme a lieu
ailleurs, et **une barre** dans le titre de « Ta réponse », qui nomme les deux surfaces et donne leur
compte. Un panneau ouvert *pour écrire* suit la phrase et se referme avec elle ; ouvert *pour
consulter*, il reste. **La Plaidoirie sort de son escamotage** par la même occasion, et la colonne qui
s'élargissait — essayée la veille — est annulée : avec elle tombent la grille de `.wrap` et **deux
PIÈGES** qu'elle avait coûtés.

**L'atelier et le fichier ne se perdent plus de vue** (§10) : le brouillon `localStorage` masquait
`content.js` au démarrage — un `git pull` ou une édition à la main n'entrait jamais, *même en
rechargeant la page*. Désormais le fichier a raison, **sauf s'il y a du travail à perdre** : adopté en
silence quand le brouillon n'a pas bougé, annoncé par un bandeau quand les deux ont bougé. Il se relit
au démarrage et **à chaque retour sur l'onglet**, sans recharger.

Trois arbitrages de l'auteur, le même jour, qui **ferment** des questions plutôt qu'elles n'en ouvrent :
la liaison-article **n'a pas à être neutre**, la phrase *« Tant que tu ne l'envoies pas… »* **n'a pas à
revenir**, et l'escamotage de la Plaidoirie est **provisoire** (§3). Quatrième : `_bruit` cesse d'être
une liste recopiée dans l'atelier — le drapeau passe **sur l'empan** (§11), donc il s'exporte, suit les
renommages et meurt avec lui.

## 2. Points de vigilance

*Le **concentré** : ce qui a déjà mordu, rassemblé pour une relecture avant de toucher au code. Chaque
point est argumenté là où il mord — un § du système, ou un PIÈGE dans le fichier ; cette liste ne les
remplace pas, elle les rappelle d'un trait.* Les **[Rn]** sont tenus par une règle du gardien — ils
tiennent en une ligne parce qu'on n'a plus à y penser ; les autres ne sont tenus par rien.

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**.
- **[R6]** Quatre ids sont des ancres du tutoriel : `#discussion`, `#modalRoot`, `#zoneRetenus`, `#composeur`.
- **[R9]** Le tag vit sur l'**attente**, jamais sur la remise — quatre fonctions exceptées.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.

**Tenus par personne — c'est ici qu'on se fait mal :**

- **Une suite peut passer par le vide** : un contrôle sous un `if` est vert par construction — casser ce
  qu'il surveille et le voir tomber est la seule preuve. Et **les suites ne se lisent pas elles-mêmes** :
  avant d'ajouter une règle au gardien, demander *sur quel territoire elle marche*.
- **Un reflet ment sans rien casser** : le diagnostic et l'onglet Grammaire décrivent le jeu, aucune
  suite ne les lit (§15).
- **Le flag `cite` est porté par la liaison, jamais par le terme** — `t0` est partagé par la citation et
  la comparaison.
- **L'index `iBloc` de `poserBloc` est positionnel dans la liste filtrée**, donc lié à la session.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** : une mutation qui renonce garde
  sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** (`noyau.js` en premier), et les `window.X = X`
  explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) sont ce par quoi `smoke_atelier.js` lit.
- **`#tuto` est le PREMIER enfant de `<body>`, avant `.wrap`** : collant dans le flux, il réserve sa
  place — c'est ce qui l'empêche de recouvrir ses propres ancres. Son `z-index:60` le garde lisible
  par-dessus l'`.overlay` (50) de la pièce ouverte, et c'est sa position *avant* `#modalRoot` qui fait
  mordre le sélecteur décalant la modale. Le remettre en fin de `<body>` ne casse **aucune** suite : il
  recouvre à nouveau, en silence.
- **La PLACE DES PANNEAUX DANS LE DOCUMENT est toute la mécanique** : entre la section Discussion et
  `#composeur`, dans le flux. Les déplacer ailleurs dans `.wrap`, ou les repasser en `position:absolute`
  (ce qu'ils ont été une heure), leur refait recouvrir la conversation — et **rien ne le dirait**,
  aucune suite ne voyant une géométrie.
- **Les deux parts ouvertes doivent rester SOUS la hauteur fermée**, en-tête de panneau et gouttière
  compris : `25vh + 31vh` contre `72vh`, `16vh + 20vh` contre `44vh` sous 1100px. Sinon ouvrir
  **allonge** la page au lieu de la partager, et la clôture s'enfonce. Mesuré à trois tailles, pas
  déduit.
- **Le panneau ouvert se referme sur ce que la phrase ACCEPTE, jamais sur ce que la voix RÉCLAME** :
  un passage posé, la voix se tait — la phrase se tient — mais la grammaire ne sait pas encore si c'est
  une citation ou le premier temps d'une comparaison (§4.5). Suivre la voix retirerait le clavier au
  milieu du geste le plus difficile ; d'où `indexTermeChamp`. **Et cette fermeture ne vaut QUE pour un
  panneau ouvert par la voix** (`panneauSuit`) : ouvert depuis la barre, on consulte, et il reste.
  Trois contrôles tiennent ce point.
- **Les ids de la barre sont écrits EN TOUTES LETTRES** (`btnContexte`, `btnPlaidoirie`), donc la barre
  ne se replie pas en une boucle : le tutoriel les vise quand le panneau est fermé, et **R6 ne sait pas
  lire un id fabriqué par interpolation** — il l'a refusé, à raison. Même exigence pour les deux
  sélecteurs `ou:` du tutoriel, qui doivent rester des littéraux.
- **Rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les
  captures — qui **ne se comparent pas à l'octet** (le halo pulse).
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par
  `scrollTop = scrollHeight`. Enfant direct de `.wrap`, en bandeau plein largeur après les trois
  `.col` — jamais dans une section colonne.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande
  `.col[hidden]{display:none}`, et `.cloture` **et `#composeur`** sont câblés sur trois colonnes
  (`.wrap.sansPlan`).
- **`S.retenus` est sérialisé dans `localStorage`** et s'appelait `S.memoire` : la signature de contenu
  **ne protège pas** d'un renommage d'état — `restaurerPartie` porte la reprise, et tout futur
  renommage aura le même devoir.
- **Le doublon banal porte tout le camouflage** (§4.4) : ne jamais désactiver son contrôle.
- **Le tutoriel enseigne deux gestes, la citation puis la comparaison, et ne ferme pour de bon
  qu'à la fin de la session 1** (`S.remisesEnvoyees>1`) — pas au premier `S.satisfaits`, qui ne
  marque que la fin du premier geste. Entre les deux, il se tait sans se fermer.
- **La clôture implicite compte les *liaisons* offertes**, les termes exclus : ajouter une liaison à la
  grammaire change le nombre de clics ailleurs, ajouter un terme non.
- **Poser un bloc ne clôt plus rien** : le refus de catégorie tombe au clic qui **déduit** une paire ou
  **achève** la phrase. Une composition en cours n'est jamais « fausse ».
- **`R.clore` ne redessine pas, donc ne sauve pas** : la sauvegarde est un effet du rendu.
- **Relire `content.js` réaffecte `window.CONTENU`**, qui est *aussi* le miroir de l'état de l'atelier :
  `relireFichier` le met de côté et le remet dans le même tour (§10). Et **il faut DEUX déclencheurs** —
  `visibilitychange` ne voit que le changement d'onglet, jamais le retour depuis l'éditeur.
- **La relecture à l'œil des phrases composées reste irremplaçable.**

## 3. Ce qui reste ouvert

Tout est **non éprouvé** ou **non tranché** ; l'ordre ci-dessous est celui de l'urgence.

- **Le critère qui décide de tout** : *« l'heure d'arrivée de la patrouille précède l'heure des éclats
  de voix, en contradiction avec l'article 3 » se lit-il comme une pensée ou comme un formulaire ?* Si
  c'est un formulaire, aucune mécanique ne le sauvera.
- **La compréhension est-elle encore *exprimée* ?** Et **une question posée guide-t-elle trop ?** Repli
  sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps.
- **Trois bandes empilées : une pensée, ou un tableau de bord ?** La question qui remplace celle du
  va-et-vient entre deux colonnes, close faute d'objet : il n'y en a plus qu'une (§4.6). Tout est
  désormais visible en même temps — ce qu'on me demande, ce dont je dispose, ce que j'écris — et c'est
  précisément le risque : le §3 redoute depuis le début que la phrase composée se lise comme un
  **formulaire**. Trois bandes alignées peuvent y pousser. Rien de cela n'a été joué.
- **Deux portes valent-elles mieux qu'une ?** La voix du composeur enseigne, la barre nomme et donne
  accès. Le §4.9 interdit de redire, pas d'offrir deux chemins — mais seul un joueur dira si le second
  sert ou encombre.
- **La Plaidoirie est revenue** (§4.9) — en panneau, porte visible d'emblée, comme le §3 l'avait
  annoncé (*où*, pas *si*). Ce qui reste à voir : **son apparition enseigne-t-elle que l'envoi
  transmet ?** Son compte dans la barre suffit-il à distinguer *envoyé* de *retenu comme moyen* ?
- **L'aide unique en dit-elle assez ?** (§4.9) Repli le plus court du dépôt : rendre l'aide **et** le
  fantôme, un `if`.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu. Idem le rythme
  des zones et la **majuscule en tête de phrase composée** (non traitée).
- **Le canal de révélation de la culpabilité** : celui qui échoue ne devrait pas recevoir la vérité,
  pour préserver le doute de la Fin 3. **La manipulation du canal** reste **suspendue** — aucun défaut
  de l'avocat ne doit se lire comme un calcul (§8.5).
- **Les deux directives ne sont pas à l'écran** (§5) : leur rendre une porte, ou décider qu'une IA n'a
  pas à consulter ce qu'elle *est*. Non tranché, donc le diagnostic a raison de les exiger.
- **La progression** : nombre de sessions, portes, emplacement de la porte de la Fin 3 — le prototype
  s'arrête à deux. Et **`comment` en sixième dimension**, écarté, réintégrable sans coût.
- Côté outil : la frise n'édite pas `rep_hors_sujet` (§15).

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer.** La session
1 a été rejouée le 16 et le contenu a bougé en conséquence ; ce qui n'a toujours pas été éprouvé :

1. **Rejouer la session 1 avec le nouveau libellé** (*« en contradiction avec »*) : l'article **fonde**-t-il
   encore, ou **nomme**-t-il la réponse ? C'est le premier point ouvert du §3.
2. **Envoyer une comparaison nue** et voir si le refus de Maître Auber enseigne (§4.5) — c'est du
   contenu qui n'a jamais pu sortir.
3. Si la boucle tient : écrire la session 3 et placer la porte de la Fin 3. Sinon, prendre l'un des
   replis du §3, qui ne coûtent aucune ligne de code.

**Méthode à conserver** : toute évolution part du document — on le réécrit, on le fait relire, puis on
applique au code. Et la question à poser avant de déclarer une passe finie n'est pas « qu'est-ce qui
reste ? » mais **« où n'ai-je pas regardé ? »**.

## 5. L'historique, en bref

*Pour ne pas rouvrir un débat sans savoir qu'il a été tranché ; le **pourquoi** vit dans la section
qu'elle a fait évoluer. Les dates sont des sessions de travail.*

- **27–31 juillet** — le geste devient composer puis envoyer ; la relation se **déduit** au lieu de se
  déclarer ; l'article devient obligatoire et n'est offert qu'une fois sa pièce livrée ; une remise
  attend une **liste** d'attentes ; le tutoriel apparaît (§3, §4.2, §4.5, §4.8).
- **1ᵉʳ–5 août** — l'économie de l'écran ; les trois surfaces prennent leur nom d'écran partout
  (`S.memoire` → `S.retenus`) ; les **projections** passent dans `moteur.js` ; une page ne porte plus
  que sa structure, `index.html` tombe de 859 à 85 lignes (§4.6, §4.9, §9, §14).
- **13–14 août** — le gardien rend opposables les conventions qu'aucune suite ne voit ; les trois
  reflets sont repris ; le document se scinde en sens et système (§15, §16).
- **15 août** — la prose est dégraissée de deux tiers ; un argument que porte déjà un § devient un
  renvoi vers lui.
- **15 septembre** — la session 1 va jusqu'à la comparaison ; **clore et envoyer n'en font plus qu'un**,
  la comparaison nue part et c'est l'avocat qui la refuse ; dégraissage de l'outillage — six règles au
  gardien, 318 contrôles sur cinq suites (§3, §4.5, §4.7, §16).
- **15 septembre, seconde passe** — quatre fichiers de doc : `CARTE.md` devient le §17, `ECRITURE.md` le §8,
  `HISTORIQUE.md` cette section. La prose du dépôt passe de 29 400 à 13 300 mots ; **les commentaires
  du code sont ramenés aux en-têtes, aux banderoles de section et aux PIÈGES**, qui portent désormais
  ce mot. Ce qui a été coupé était argumenté ailleurs, ou paraphrasait le code ; `git log` le garde.
- **16 septembre** — une session d'écriture (§1), puis une passe de **cohérence** : cinq contrôles qui
  nommaient du contenu au lieu de le dériver sont réécrits ; quatre affirmations que le code avait
  démenties sont recalées — le libellé de la liaison-article, la phrase de l'envoi, la colonne
  Plaidoirie, les ancres du tutoriel (§4.5, §4.9, §17) ; les comptes (cinq suites, 331 contrôles) sont
  repris partout, CI et hook compris. Côté commentaires, la numérotation héritée du temps où l'atelier
  était **un seul fichier** disparaît : chaque module n'a plus qu'un en-tête. Enfin **`bruit` passe sur
  l'empan** : la liste `_bruit` de `noyau.js` disparaît avec les cinq endroits qui l'entretenaient, et
  `migrerContenu` replie celles qui traînent (§11). Enfin **le fichier reprend la main sur le
  brouillon** (§10) — relecture à chaque retour sur l'onglet, arbitrage silencieux quand il n'y a rien
  à perdre. Écrit au document d'abord, puis appliqué ; les quatre cas joués dans un vrai Chromium,
  parce qu'aucune suite ne peut éprouver `visibilitychange` ni une balise qui va vraiment lire.
- **30 septembre, troisième passe** — **les deux surfaces de côté passent en panneaux**, d'abord
  par-dessus la conversation, puis — même session, sur retour de l'auteur — **dans le flux, entre elle
  et le composeur**, avec des portes qui tranchent sur le fond. Le rappel de la question sous panneau,
  écrit et éprouvé, a été **retiré** dans la foulée : plus rien n'est couvert, donc plus rien à redire.
  La bascule : l'élargissement de la colonne, essayé la passe d'avant, est annulé, et la Plaidoirie
  sort de son escamotage du 16 septembre (§4.6, §4.9). L'écran tombe à une colonne, `.wrap` cesse
  d'être une grille, et deux PIÈGES disparaissent avec elle. Le tutoriel apprend à viser une porte
  quand sa cible est cachée.
- **30 septembre** — six retours d'une partie jouée, en deux passes : tutoriel plus lisible puis monté
  **en tête de page, dans le flux** ; `#composeur` en bandeau plein largeur ; le Contexte qui descend
  au clic, puis ramené à **un tiers** de la largeur ; l'index du dossier qui nomme les pièces **comme
  la Discussion les transmet**. Rien de tout cela n'est visible d'une suite — le seul juge est
  `npm run vue` et la relecture à l'œil (§13, §16).

# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 15 septembre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins. `npm test` est vert —
318 contrôles, 6 règles du gardien, ESLint. Le rangement est fini sur les quatre territoires.

Le 15 septembre a changé deux choses, toutes deux venues d'une **partie jouée**, pas d'un raisonnement
sur le document : **la session 1 va jusqu'à la comparaison** (l'article 3 arrive avec le premier lot,
les trois sessions sont devenues deux, §3) et **clore et envoyer n'en font plus qu'un** (*« → Envoyer »*
est le seul bouton du composeur ; `vice_trouve` se lève à l'**assemblage**, sans quoi la Fin 2 devenait
injouable, §4.7).

## 2. Points de vigilance

*La seule partie de ce fichier qui ne se lit nulle part ailleurs.* Les **[Rn]** sont tenus par une règle
du gardien — ils tiennent en une ligne parce qu'on n'a plus à y penser ; les autres ne sont tenus par
rien.

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**.
- **[R6]** Quatre ids sont des ancres : `#discussion`, `#zoneRetenus`, `#composeur`, `#colPlaidoirie`.
- **[R9]** Le tag vit sur l'**attente**, jamais sur la remise — quatre fonctions exceptées.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.

**Tenus par personne — c'est ici qu'on se fait mal :**

- **Une suite peut passer par le vide** : un contrôle sous un `if` est vert par construction. Casser ce
  qu'il surveille et le voir tomber est la seule preuve. Et **les suites ne se lisent pas elles-mêmes** :
  avant d'ajouter une règle au gardien, demander *sur quel territoire elle marche*.
- **Un reflet ment sans rien casser** : le diagnostic et l'onglet Grammaire décrivent le jeu, aucune
  suite ne les lit (§15).
- **Le flag `cite` est porté par la liaison, jamais par le terme** — `t0` est partagé par la citation et
  la comparaison.
- **L'index `iBloc` de `poserBloc` est positionnel dans la liste filtrée**, donc dépendant de la session.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** : une mutation qui renonce garde
  sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** (`noyau.js` en premier), et les `window.X = X`
  explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) sont ce par quoi `smoke_atelier.js` lit
  l'atelier.
- **Rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les
  captures — qui **ne se comparent pas à l'octet** (`00-depart.png` moins que les autres : le halo pulse).
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par
  `scrollTop = scrollHeight`.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande
  `.col[hidden]{display:none}`, et `.cloture` est câblée sur trois colonnes (`.wrap.sansPlan`).
- **`S.retenus` est sérialisé dans `localStorage`** et s'appelait `S.memoire` : la signature de contenu
  **ne protège pas** d'un renommage d'état — `restaurerPartie` porte la reprise, tout futur renommage a
  le même devoir.
- **Le doublon banal porte tout le camouflage** (§4.4) : ne jamais désactiver son contrôle.
- **Le tutoriel se termine sur `S.satisfaits`, pas sur `S.plaidoirie`.**
- **La clôture implicite se déclenche sur un compte de *liaisons* offertes**, les termes exclus :
  ajouter une **liaison** à la grammaire change le nombre de clics ailleurs, ajouter un terme non.
- **Poser un bloc ne clôt plus rien** : le refus de catégorie tombe au clic qui **déduit** une paire ou
  qui **achève** la phrase. Une composition en cours n'est jamais « fausse ».
- **`R.clore` ne redessine pas, donc ne sauve pas** : la sauvegarde est un effet du rendu, et le harnais
  appelle `rendreTout()` derrière.
- **La relecture à l'œil des phrases composées reste irremplaçable** après toute retouche du contenu ou
  de la grammaire.

## 3. Ce qui reste ouvert

Tout est **non éprouvé** ou **non tranché** ; l'ordre ci-dessous est celui de l'urgence.

- **Le critère qui décide de tout** : *« 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou
  comme un formulaire ?* Si c'est un formulaire, aucune mécanique ne le sauvera.
- **La compréhension est-elle encore *exprimée* ?** Et **une question posée guide-t-elle trop ?** Repli
  sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps.
- **Le va-et-vient entre les deux colonnes** (§4.6) — le plus concret, à regarder sur une session
  entière : le regard qui cherche où le texte est parti, la main qui repose un empan. Repli : faire
  descendre la mémoire, **pas** remonter le composeur.
- **L'aide unique en dit-elle assez ?** (§4.9) Repli le plus court du dépôt : rendre l'aide **et** le
  fantôme, un `if`.
- **La tension de l'IA partisane** (§1) : tranchée en mécanique, à valider en contenu. Idem le **rythme
  des zones** et la **majuscule en tête de phrase composée** (non traitée).
- **Le canal de révélation de la culpabilité** : celui qui échoue ne devrait pas recevoir la vérité,
  pour préserver le doute de la Fin 3. **La manipulation du canal** (l'avocat infléchissant l'IA par la
  *façon* dont il transmet) reste **suspendue** — aucun défaut de l'avocat ne doit se lire comme un
  calcul (§8.5).
- **Les deux directives ne sont pas à l'écran** (§5) : leur rendre une porte, ou décider qu'une IA n'a
  pas à consulter ce qu'elle *est*. Tant que ce n'est pas tranché, le diagnostic a raison de les exiger.
- **La progression** : nombre de sessions, portes, emplacement de la porte de la Fin 3. Le prototype
  s'arrête à deux sessions. Et **`comment` en sixième dimension**, écarté, réintégrable sans coût.
- Côté outil : la frise n'édite pas `rep_hors_sujet` (§15).

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer.**

1. **Rejouer `app/index.html` en `file://`, de bout en bout, à froid.** La session 1 ayant doublé de
   contenu, c'est elle qu'il faut regarder : la réponse par citation *répond*-elle encore, et le passage
   de la citation à la comparaison **dans la même session** se sent-il, ou s'avale-t-il ?
2. **Éprouver ce que le nouveau modèle rend possible** : envoyer une comparaison **nue** et voir si le
   refus de Maître Auber enseigne (§4.5) — c'est du contenu qui n'avait jamais pu sortir.
3. Si la boucle tient : écrire la session 3 et placer la porte de la Fin 3. Sinon, prendre l'un des
   replis du §3, qui ne coûtent aucune ligne de code.

**Méthode à conserver** : toute évolution part du document — on le réécrit, on le fait relire, puis on
applique au code. *Un reflet doit appeler ce qu'il reflète*, et la question à poser avant de déclarer
une passe finie n'est pas « qu'est-ce qui reste ? » mais **« où n'ai-je pas regardé ? »**.

## 5. L'historique, en bref

*Une ligne par étape, pour ne pas rouvrir un débat sans savoir qu'il a été tranché ; le **pourquoi** vit
dans la section qu'elle a fait évoluer. Les dates sont des sessions de travail, pas des dates de
calendrier.*

- **27–29 juillet** — le geste devient composer puis envoyer ; l'IA est partisane dès la première
  minute ; la relation se **déduit** au lieu de se déclarer ; un article n'est offert qu'une fois sa
  pièce livrée (§4.1, §4.2, §4.5, §4.6).
- **30–31 juillet** — l'article devient obligatoire, `porte` apparaît, les articles cessent de porter
  des empans ; une remise attend une **liste** d'attentes ; le tutoriel du premier geste apparaît
  (§3, §4.5, §4.8, §12).
- **1ᵉʳ–5 août** — l'économie de l'écran ; les trois surfaces prennent leur nom d'écran partout
  (`S.memoire` → `S.retenus`) ; les **projections** passent dans `moteur.js` ; une page ne porte plus
  que sa structure, `index.html` tombe de 859 à 85 lignes (§4.6, §4.9, §9, §14).
- **13–14 août** — le gardien rend opposables les conventions qu'aucune suite ne voit ; les trois
  reflets sont repris ; le document se scinde en sens et système, les numéros restant uniques (§15, §16).
- **15 août** — la prose du dépôt est dégraissée de deux tiers, documents **et** commentaires ; un
  argument que porte déjà un § devient un renvoi vers lui.
- **15 septembre** — la session 1 va jusqu'à la comparaison ; **clore et envoyer n'en font plus qu'un**,
  la comparaison nue part et c'est l'avocat qui la refuse ; dégraissage de l'outillage (le gardien
  retombe à six règles, 318 contrôles sur cinq suites) (§3, §4.5, §4.7, §16).
- **Cette session** — la documentation fond dans quatre fichiers : `CARTE.md` devient le §17,
  `ECRITURE.md` le §8, `HISTORIQUE.md` cette section ; les commentaires du code sont ramenés aux
  en-têtes et aux pièges.

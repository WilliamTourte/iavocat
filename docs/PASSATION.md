# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation : où on en est, ce qui mord, ce qui reste ouvert, quoi faire
ensuite. **Court, et il doit le rester.** État au 16 septembre 2026.*

## 1. Où en est le jeu

`app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des trois fins. `npm test` est vert —
343 contrôles, 6 règles du gardien, ESLint.

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
- **Rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les
  captures — qui **ne se comparent pas à l'octet** (le halo pulse).
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par
  `scrollTop = scrollHeight`.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande
  `.col[hidden]{display:none}`, et `.cloture` est câblée sur trois colonnes (`.wrap.sansPlan`).
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
- **Le va-et-vient entre les deux colonnes** (§4.6) — le plus concret, à regarder sur une session
  entière : le regard qui cherche où le texte est parti, la main qui repose un empan. Repli : faire
  descendre le contexte, **pas** remonter le composeur.
- **La Plaidoirie est escamotée, et c'est PROVISOIRE** (§4.9) : plus rien à l'écran ne distingue
  *envoyé* de *retenu comme moyen*. Ce qu'on éprouve pendant ce congé, c'est **ce que son absence
  coûte** — et la question au retour sera *où*, pas *si*. Un `const` d'une ligne la rallume (`vide`,
  dans `renderPlaidoirie`) ; les suites tiennent déjà les deux cas.
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

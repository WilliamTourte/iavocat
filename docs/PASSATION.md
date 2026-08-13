# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. **État au 14 août 2026.***

> **Ce fichier est court, et il doit le rester.** Il dit trois choses qu'aucun autre ne dit : **où on
> en est**, **ce qui mord** quand on touche au code, et **quoi faire ensuite**. Il ne redit ni les
> règles (`docs/CONCEPTION.md` pour le sens, `docs/ARCHITECTURE.md` pour le système), ni comment on y
> est arrivé (`docs/HISTORIQUE.md`, une ligne par étape).

## 1. Où en est le jeu

**Le jeu tourne, de bout en bout.** `app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une
des trois fins. Trois sessions : lire et citer, mettre en rapport, puis l'ADN et le vice. `npm test`
est vert — 325 contrôles, 11 règles du gardien, ESLint.

**Le rangement est fini, sur les quatre territoires** — `app/`, `tests/`, `outils/`, et les
documents. Il n'en reste rien de nommable, et surtout le gardien couvre désormais tout ce qui est du
code : c'est ce qui rend la déclaration tenable, au lieu d'être une impression. Huit sessions y
auront passé.

**Ce qui n'a jamais été fait : jouer.** Toutes les décisions récentes sont des décisions de forme, et
les points ouverts du §7 de `docs/CONCEPTION.md` sont presque tous marqués **non éprouvés**. C'est le
seul manque, et la prochaine étape ne peut être que là.

*Les décisions qui tiennent l'état actuel ne sont pas recopiées ici : chacune est argumentée dans la
section qu'elle a fait évoluer, et `docs/HISTORIQUE.md` en donne la suite datée. Les redire serait une
copie de plus à tenir d'accord — exactement ce que le §12 interdit au code. **Elles ne sont pas non
plus numérotées** : cinq commentaires du dépôt citaient une « décision 16 » d'une liste qui a changé
d'ordre à chaque session, et aucun ne pouvait le dire. On désigne par la date, ou par ce qui a été
décidé.*

## 2. Points de vigilance

*C'est la seule partie de ce fichier qui ne se lit nulle part ailleurs.* Les points marqués **[Rn]**
sont tenus par une règle d'`outils/gardien.js` : ils tiennent en une ligne parce qu'**on n'a plus à y
penser** — la règle mord, le § reste l'arbitre. Les autres ne sont tenus par rien, et c'est là qu'il
faut regarder.

**Tenus par une règle — pour mémoire seulement**

- **[R1]** La regex du harnais est stricte : `<script src="x.js"></script>` sur **une ligne, sans
  attribut**. Ni `defer` ni `async`. Une variante n'est pas inlinée *du tout* et quatre contrôles
  tombent — ce n'est pas « le test reste vert pendant que la page casse », c'était une crainte fausse.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent
  quand même le nom**, et un module chargé par `<script src>` partage la portée globale de la page.
  D'où les projections cloîtrées dans une fermeture (§9).
- **[R3]** Une `var(--x)` introuvable rend la déclaration invalide au calcul : pour un **raccourci**,
  ce n'est pas un filet de la mauvaise couleur, c'est **pas de filet du tout**.
- **[R4]** Une classe engendrée s'écrit `${x?"arm":""}`, jamais `${x?" arm":""}` — l'espace dans la
  chaîne cache la classe au gardien, qui la croira orpheline.
- **[R6]** Quatre ids sont des ancres, pas de la décoration : `#discussion`, `#zoneRetenus`,
  `#composeur`, `#colPlaidoirie`. Les renommer casse le tutoriel **en silence**.
- **[R7]** Plus rien ne déplie un lien du schéma 2 (`l.a[0]`).
- **[R9]** Le tag d'une session vit sur l'**attente**, jamais sur la remise. L'ancienne forme reste
  *lisible* — quatre fonctions nommées, et personne d'autre.
- **[R10]** Une suite **désigne**, elle ne décide pas : ce que `regles.js` et `moteur.js` publient
  s'appelle, ne se recopie pas.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.

**Tenus par personne — c'est ici qu'on se fait mal**

- **Les suites ne se lisent pas elles-mêmes**, et c'est leur angle mort. Quatre recopies d'une règle y
  ont vécu sans que personne puisse les voir. Avant d'ajouter une règle au gardien, demander **sur
  quel territoire elle marche** : la réponse n'est plus « `app/` » par défaut.
- **Une suite peut passer par le vide, et rien ne le dit.** Un contrôle enveloppé d'un `if` qui
  choisit entre « ça mord » et « pas de piège ici » est **toujours vert par construction**. La seule
  façon de savoir s'il tient : **casser ce qu'il surveille et le voir tomber**. À faire au moins une
  fois pour tout contrôle conditionnel.
- **Un reflet ment sans rien casser.** Le diagnostic et l'onglet Grammaire *décrivent* le jeu au lieu
  de l'appeler ; **aucune suite ne les lit**. Ils ont annoncé 21 de marge de bruit au lieu de 315, et
  six informations fausses par ouverture, pendant des semaines. Le remède n'est pas une checklist :
  c'est que le reflet **appelle** ce qu'il reflète (§12), et là où il ne le peut pas, qu'une règle
  tienne l'écart (§15).
- **Un outil qui vérifie les autres se vérifie aussi.** Le gardien s'est trouvé trois défauts à
  lui-même : un nom manquant à son inventaire (`let a=1, b=2` — une collision que R2 ne verrait pas),
  des numéros de ligne faux, et deux faux positifs de R11 sur sa propre prose.
- **Le flag `cite` est porté par la liaison, jamais par le terme** — `t0` est partagé par la citation
  et la comparaison.
- **L'index `iBloc` de `poserBloc` est positionnel dans la liste filtrée**, donc dépendant de la
  session.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** — un `return` dans `f` n'y
  coupe pas. Une mutation qui doit renoncer garde sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** : `noyau.js` en premier, seul dont le corps
  s'exécute au chargement. Le reste se voit par *hoisting*. Et les `window.X = X` explicites
  (`undo`, `adopter`, `demanderExemple`, `simReset`) ne sont pas décoratifs — c'est par eux que
  `smoke_atelier.js` lit l'atelier.
- **Le CSS est inliné par le harnais parce que `getCSS()` le lit** (`graphe.js`) : seul endroit du
  dépôt où du CSS traverse vers du JS. Mais **rien ne prouve automatiquement qu'un CSS externe se
  charge** — `npm run vue` n'asserte rien, la preuve est à l'œil sur les captures.
- **Les captures de `npm run vue` ne se comparent pas à l'octet**, et `00-depart.png` moins que les
  autres : le halo du tutoriel **pulse**. Les six autres sont reproductibles ; la seule qui prouve que
  le halo vise quelque chose est la seule qu'on ne peut pas differ.
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par
  `scrollTop = scrollHeight`, le composeur partirait au défilement.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande la règle
  explicite `.col[hidden]{display:none}`, et `.cloture` est câblée sur trois colonnes, d'où
  `.wrap.sansPlan`.
- **`S.retenus` est sérialisé dans `localStorage`** et s'appelait `S.memoire` : la signature de
  contenu **ne protège pas** d'un renommage d'état. `restaurerPartie` porte une reprise explicite —
  tout futur renommage a le même devoir.
- **Le doublon banal porte tout le camouflage** depuis la déduction (§4.4) : ne jamais désactiver son
  contrôle.
- **Le tutoriel se termine sur `S.satisfaits`, pas sur `S.plaidoirie`** : une réponse hors sujet ne
  clôt pas la leçon.
- **La clôture automatique se déclenche sur un *compte* de blocs offerts** : ajouter ou retirer un
  bloc de grammaire peut changer le nombre de clics ailleurs dans l'affaire.
- **Des chaînes de chrome sont épinglées par les suites.** La liste vit au §16, et elle s'y **relève
  sur les suites** — ne pas la recopier ici. Une laisse qu'on croit tendue fait hésiter à renommer ce
  que personne ne tient.
- **La relecture à l'œil des phrases composées reste irremplaçable** après toute retouche du contenu
  ou de la grammaire.

## 3. Ce qui reste ouvert

**Tout est au §7 de `docs/CONCEPTION.md`** — les points ouverts du sens, chacun marqué *non éprouvé*
ou *non tranché*. Côté outil, une seule ligne reste, au §15 : la frise n'édite pas `rep_hors_sujet`.

*Le plus concret, et le seul qui ait un prix connu d'avance : **le va-et-vient entre les deux
colonnes**. On clique une puce dans la Mémoire, la phrase s'écrit sous la Discussion. Deux symptômes
à guetter en jouant une session entière — le regard qui cherche où le texte est parti, la main qui
repose un empan parce qu'elle a perdu le fil. Le repli est de faire descendre la mémoire aussi,
**pas** de remonter le composeur.*

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer.**

1. **Jouer `app/index.html` en `file://`, de bout en bout, à froid**, et juger trois choses d'un
   coup : la session 1 (la réponse par citation *répond*-elle, ou reformule-t-elle la question ? la
   session 2 se lit-elle comme « maintenant, mets-les en rapport » ?) ; l'écran allégé (l'aide unique
   du composeur suffit-elle ?) ; et le **va-et-vient** ci-dessus.
2. Si la boucle tient : écrire la session 4 et placer la porte de la Fin 3.
3. Si la session 1 guide trop : retirer les `question` une à une — le repli n'exige aucune ligne de
   code. Si l'écran ne guide plus assez, le repli symétrique est aussi court : rendre l'aide **et** le
   fantôme.

**Deux leçons de méthode, qui valent au-delà de leur session.**

*La première : **un reflet doit appeler ce qu'il reflète**, et là où il ne le peut pas, c'est une
règle du gardien qui tient l'écart. Cinq des onze existent pour ça (R7 à R11). Les quatre défauts qui
l'ont enseignée ont tous été trouvés **en relisant à l'œil**, aucun par une suite.*

*La seconde : la question à poser avant de déclarer une passe finie n'est pas « qu'est-ce qui
reste ? » mais **« où n'ai-je pas regardé ? »**. Sept sessions de suite ont dégraissé `app/` parce que
c'est ce que le gardien surveillait, et le gardien surveillait `app/` parce que c'est là qu'on avait
eu mal. La réponse tenait en une ligne de code —* `marcher("app")` *— et valait 2 888 lignes.*

**Méthode à conserver :** toute évolution part du **document** — `docs/CONCEPTION.md` si elle touche
au sens, `docs/ARCHITECTURE.md` si elle touche au système. On réécrit le document, on le fait relire,
puis on applique au code.

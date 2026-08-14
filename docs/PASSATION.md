# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. **État au 15 août 2026.** Trois choses qu'aucun autre
fichier ne dit : où on en est, ce qui mord, quoi faire ensuite. Court, et il doit le rester.*

## 1. Où en est le jeu

**Le jeu tourne de bout en bout** : `app/index.html` s'ouvre en `file://` et se joue jusqu'à l'une des
trois fins. `npm test` est vert — 325 contrôles, 11 règles du gardien, ESLint. Le rangement est fini
sur les quatre territoires, et la prose l'est depuis le 15 août.

**Ce qui n'a jamais été fait : jouer.** Toutes les décisions récentes sont des décisions de forme, et
les points ouverts du §7 sont presque tous marqués *non éprouvés*. C'est le seul manque.

*Les décisions ne se recopient pas ici : chacune est argumentée dans sa section, et
`docs/HISTORIQUE.md` en donne la suite datée. Elles ne sont pas numérotées — on désigne par la date,
ou par ce qui a été décidé.*

## 2. Points de vigilance

*La seule partie de ce fichier qui ne se lit nulle part ailleurs.* Les points **[Rn]** sont tenus par
une règle du gardien : ils tiennent en une ligne parce qu'on n'a plus à y penser. Les autres ne sont
tenus par rien.

**Tenus par une règle — pour mémoire**

- **[R1]** `<script src="x.js"></script>` sur **une ligne, sans attribut** : une variante n'est pas inlinée *du tout*.
- **[R2]** Les `const` de haut niveau ne sont pas des propriétés de `window` — **mais ils occupent le nom**, et un `<script src>` partage la portée globale de la page.
- **[R3]** Une `var(--x)` introuvable rend la déclaration invalide : pour un raccourci, **pas de filet du tout**.
- **[R4]** Une classe engendrée s'écrit `${x?"arm":""}`, jamais `${x?" arm":""}`.
- **[R6]** Quatre ids sont des ancres : `#discussion`, `#zoneRetenus`, `#composeur`, `#colPlaidoirie`.
- **[R7]** Plus rien ne déplie un lien du schéma 2 (`l.a[0]`).
- **[R9]** Le tag vit sur l'**attente**, jamais sur la remise — quatre fonctions exceptées.
- **[R10]** Une suite **désigne**, elle ne décide pas.
- **[R11]** Tout renvoi `§x` désigne une section réelle, dans le bon document.

**Tenus par personne — c'est ici qu'on se fait mal**

- **Les suites ne se lisent pas elles-mêmes.** Avant d'ajouter une règle au gardien : **sur quel territoire marche-t-elle ?** La réponse n'est pas « `app/` » par défaut.
- **Une suite peut passer par le vide** : un contrôle sous un `if` est vert par construction — casser ce qu'il surveille et le voir tomber est la seule preuve.
- **Un reflet ment sans rien casser** : le diagnostic et l'onglet Grammaire décrivent le jeu, aucune suite ne les lit. Le remède est qu'ils **appellent** (§12), ou qu'une règle tienne l'écart (§15).
- **Un outil qui vérifie les autres se vérifie aussi** — le gardien s'est trouvé trois défauts à lui-même.
- **Le flag `cite` est porté par la liaison, jamais par le terme** — `t0` est partagé par la citation et la comparaison.
- **L'index `iBloc` de `poserBloc` est positionnel dans la liste filtrée**, donc dépendant de la session.
- **`muter(f)` porte `pushUndo` AVANT et `autosave(); render()` APRÈS** : une mutation qui renonce garde sa garde *avant* l'appel.
- **L'ordre des `<script src>` de l'atelier compte** : `noyau.js` en premier. Et les `window.X = X` explicites (`undo`, `adopter`, `demanderExemple`, `simReset`) sont ce par quoi `smoke_atelier.js` lit l'atelier.
- **Le CSS est inliné parce que `getCSS()` le lit** (`graphe.js`) — mais **rien ne prouve automatiquement qu'un CSS externe se charge** : la preuve est à l'œil, sur les captures.
- **Les captures ne se comparent pas à l'octet**, et `00-depart.png` moins que les autres : le halo pulse.
- **`#composeur` est le frère de `#discussion`, jamais son enfant** — `renderDiscussion` finit par `scrollTop = scrollHeight`.
- **`.col{display:flex}` bat `[hidden]{display:none}`** : cacher la Plaidoirie demande `.col[hidden]{display:none}`, et `.cloture` est câblée sur trois colonnes (`.wrap.sansPlan`).
- **`S.retenus` est sérialisé dans `localStorage`** et s'appelait `S.memoire` : la signature de contenu **ne protège pas** d'un renommage d'état — `restaurerPartie` porte la reprise, tout futur renommage a le même devoir.
- **Le doublon banal porte tout le camouflage** (§4.4) : ne jamais désactiver son contrôle.
- **Le tutoriel se termine sur `S.satisfaits`, pas sur `S.plaidoirie`.**
- **La clôture automatique se déclenche sur un *compte* de blocs offerts** : ajouter un bloc de grammaire change le nombre de clics ailleurs.
- **Des chaînes de chrome sont épinglées par les suites** — la liste est au §16, et elle s'y **relève**.
- **La relecture à l'œil des phrases composées reste irremplaçable** après toute retouche du contenu ou de la grammaire.

## 3. Ce qui reste ouvert

**Tout est au §7**, chacun marqué *non éprouvé* ou *non tranché*. Côté outil, une ligne au §15 : la
frise n'édite pas `rep_hors_sujet`.

*Le plus concret : **le va-et-vient entre les deux colonnes** (§4.6). Deux symptômes à guetter en
jouant une session entière — le regard qui cherche où le texte est parti, la main qui repose un empan.
Le repli est de faire descendre la mémoire, **pas** de remonter le composeur.*

## 4. Prochaine étape

**La prochaine session porte sur le SENS, et la seule façon de la commencer est de jouer.**

1. **Jouer `app/index.html` en `file://`, de bout en bout, à froid** : la session 1 (la réponse par
   citation *répond*-elle ?), l'écran allégé (l'aide unique suffit-elle ?), le va-et-vient.
2. Si la boucle tient : écrire la session 4 et placer la porte de la Fin 3.
3. Sinon, les deux replis ne coûtent aucune ligne de code : retirer les `question` une à une, ou
   rendre l'aide **et** le fantôme.

**Deux leçons de méthode.** *Un reflet doit appeler ce qu'il reflète*, et là où il ne le peut pas,
c'est une règle du gardien qui tient l'écart. Et la question à poser avant de déclarer une passe finie
n'est pas « qu'est-ce qui reste ? » mais **« où n'ai-je pas regardé ? »**.

**Méthode à conserver :** toute évolution part du document — on le réécrit, on le fait relire, puis on
applique au code.

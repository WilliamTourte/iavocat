# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 1ᵉʳ août 2026, après la session « on répond sous la question ».*

## 1. Où en est le jeu

Neuf décisions tiennent l'état actuel. Détail de chacune : `docs/ARCHITECTURE.md` §3, §4.5, §4.6, §4.8, §4.9.

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
8. **On répond sous la question** *(31 juillet)*. Le composeur quitte la colonne de l'atelier pour
   s'ancrer **sous le fil du canal**, à la place d'une zone de saisie de messagerie. La mémoire, elle,
   **reste dans l'atelier** — c'est un arbitrage pris avec l'auteur, pas un oubli : on rend la
   co-location du 28 juillet pour gagner l'évidence du geste (§7). Le composeur ne porte **aucune
   étiquette « privé »** : son statut se lit dans le fait que rien n'en sort.
9. **Ce qui n'existe pas encore ne s'affiche pas** *(31 juillet)*. La colonne du plan est **entièrement
   retirée** tant que rien ne s'y inscrit — l'écran s'ouvre à deux colonnes. Elle apparaît au premier
   moyen versé, et c'est cette apparition qui l'enseigne. La phrase d'attente *« Il n'inscrit ici que
   ce qu'il peut plaider »* a disparu avec elle : elle était devenue inatteignable.
10. **Les en-têtes des trois surfaces** *(2 août)*. « Le canal », « L'atelier », « Le plan » s'affichent
    désormais « Discussion », « Mémoire », « Plaidoirie » — les noms de rôle du §4.6 ne changent pas,
    seul l'en-tête à l'écran change, et ne se confond pas avec `app/atelier_v3.html`, l'outil d'écriture
    du contenu, qui garde son nom. Dans la même session, la légende des dimensions et les notes d'aide
    de la modale de pièce (« Clique un passage… », « Rien à retenir ici… ») sont retirées.

## 2. Points de vigilance

- `test_autre_affaire.js` n'a pas bougé d'une ligne depuis le découpage en trois sessions ni depuis
  le tutoriel : c'est le contrôle qui prouve que la liste d'attentes et la clôture automatique sont
  des **généralisations**, pas des remplacements.
- Le flag `cite` est porté par la **liaison**, jamais par le terme — `t0` est partagé par citation et
  comparaison.
- L'index `iBloc` de `poserBloc` est **positionnel dans la liste filtrée**, donc dépendant de la
  session.
- Les `const` de haut niveau ne sont pas des propriétés de `window`.
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
- **Trois ids sont des points d'ancrage, pas de la décoration** : `#zoneMemoire` (3ᵉ temps du
  tutoriel), `#composeur` (4ᵉ temps **et** lecture d'écran du harnais), `#colPlan` (ce que
  `planVisible` interroge). Les renommer casse le tutoriel en silence — `majTutoriel` teste
  `if(tutoCible)` et ne se plaint pas d'une cible introuvable.
- **`#composeur` est le frère de `#canal`, jamais son enfant.** `renderCanal` finit par
  `el.scrollTop=el.scrollHeight` : glissé dedans, le composeur partirait au défilement à chaque
  message.
- **`.col{display:flex}` bat `[hidden]{display:none}`.** Cacher la colonne du plan par le seul
  attribut `hidden` ne ferait rien sans la règle explicite `.col[hidden]{display:none}` — et
  `.cloture` est câblée sur trois colonnes (`grid-column:1/4`), d'où la variante `.wrap.sansPlan`.

## 3. Ce qui reste ouvert

| Sujet | État |
|---|---|
| Une question posée guide-t-elle trop ? | Le tutoriel **charge** ce point : il fait quatre pas à la place du joueur. Repli sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. **Non éprouvé** |
| La compréhension est-elle encore *exprimée* ? | Depuis que la relation se déduit, un joueur peut rapprocher deux empans au hasard et obtenir une phrase bien formée. **Non éprouvé** |
| Le critère qui décide de tout : pensée ou formulaire ? | Les phrases se lisent bien à l'écrit ; reste à juger en jouant |
| La marge de bruit | Mesurée par la suite de test, pas figée dans un nombre |
| **Le va-et-vient entre les deux colonnes** | **Le point ouvert le plus concret, et le prix de la décision 8.** On clique une puce dans l'atelier, la phrase s'écrit sous le canal. Deux symptômes à guetter en jouant **une session entière** : le regard qui cherche où le texte est parti, la main qui repose un empan parce qu'elle a perdu le fil. Repli : faire descendre la mémoire aussi — **pas** remonter le composeur. **Non éprouvé** |
| Le rythme des zones | L'atelier ne porte plus que le dossier et les empans ; le canal porte le fil et la phrase ; l'écran s'ouvre à deux colonnes. **À juger en jouant**, pas sur capture |
| L'aide unique en dit-elle assez ? | Le composeur ne nomme plus le geste suivant qu'une fois. **Non éprouvé** : c'est le repli le plus simple si un joueur se perd — remettre l'aide sous le composeur, elle est à un `if` près |
| La majuscule en tête de phrase composée | Non traité |
| La progression : portes, place de la Fin 3 | Trois sessions actées ; la porte de la Fin 3 reste à placer |
| `comment` en sixième dimension | Écarté, réintégrable sans coût |
| Le canal de révélation de la culpabilité | Non tranché |

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

**Méthode à conserver :** toute évolution part de `docs/ARCHITECTURE.md` — on réécrit le document, on
le fait relire, puis on applique au code.

# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 31 juillet 2026.*

## 1. Où en est le jeu

Six décisions tiennent l'état actuel. Détail de chacune : `docs/ARCHITECTURE.md` §3, §4.5, §4.8.

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

## 3. Ce qui reste ouvert

| Sujet | État |
|---|---|
| Une question posée guide-t-elle trop ? | Le tutoriel **charge** ce point : il fait quatre pas à la place du joueur. Repli sans code : retirer les `question` une à une, couper le tutoriel avant le 3ᵉ temps. **Non éprouvé** |
| La compréhension est-elle encore *exprimée* ? | Depuis que la relation se déduit, un joueur peut rapprocher deux empans au hasard et obtenir une phrase bien formée. **Non éprouvé** |
| Le critère qui décide de tout : pensée ou formulaire ? | Les phrases se lisent bien à l'écrit ; reste à juger en jouant |
| La marge de bruit | Mesurée par la suite de test, pas figée dans un nombre |
| Le rythme des zones | La colonne d'atelier porte le dossier, la phrase et les empans ; densité non éprouvée |
| La majuscule en tête de phrase composée | Non traité |
| La progression : portes, place de la Fin 3 | Trois sessions actées ; la porte de la Fin 3 reste à placer |
| `comment` en sixième dimension | Écarté, réintégrable sans coût |
| Le canal de révélation de la culpabilité | Non tranché |

## 4. Prochaine étape

1. **Jouer `app/index.html` en `file://`, de bout en bout, à froid**, et juger la session 1 avant
   tout le reste : la réponse par citation répond-elle, ou reformule-t-elle ? la session 2 se lit-elle
   comme « maintenant, mets-les en rapport » ?
2. Si la boucle tient : écrire la session 4 et placer la porte de la Fin 3.
3. Si la session 1 guide trop : retirer les `question` une à une — c'est le repli, et il n'exige
   aucune ligne de code.

**Méthode à conserver :** toute évolution part de `docs/ARCHITECTURE.md` — on réécrit le document, on
le fait relire, puis on applique au code.

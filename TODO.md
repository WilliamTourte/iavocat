# TODO — suites du retour de playtest de Colas (4 octobre)

*Ce qui reste à traiter dans le retour de Colas et la réponse de l'auteur, après les deux passes du
4 octobre (colonne latérale, tutoriel bavarde/icône, pièces agrégées). Le détail de ce qui est fait vit
au §1 et au §3 de `docs/PASSATION.md` ; ici, seulement ce qui ne l'est pas.*

## À faire — la boucle de base

- [x] **Notification visuelle « Ajouté au Contexte »** — ✓ sur le passage, ligne *« ✓ Retenu dans ton
      Contexte »* collée au bas de la pièce, porte Contexte allumée, le temps d'un rendu (§4.3). Placée
      sous la pièce plutôt qu'en haut à droite : c'est là qu'on regarde au moment du clic.
- [x] **Dire dans la pièce que cliquer un passage l'ajoute au Contexte** — couvert par le `ditLong` de
      *citer · 2/4* pendant le tutoriel, et désormais par la confirmation au premier clic. Pas d'aide
      permanente de plus : le composeur dit déjà « retiens un passage » (§4.9 règle 1, une voix par état).
- [x] **Le Contexte vide dit COMMENT on y ajoute** : « Ouvre une pièce, puis clique un passage souligné
      pour le retenir : il viendra ici. »
- [x] **La pièce s'ouvre DANS le Contexte** — index → pièce → retenus, deux bandes qui défilent, plus de
      temps « Referme la pièce », `declenche` au départ de la pièce, colonne élargie au-dessus de 900 px.
- [x] **L'opposition** — rejouée et analysée (§3 PASSATION, six points) :
  - [x] « Continuer » au lieu de « Ne rien opposer — continuer » une fois quelque chose opposé ;
  - [x] déplacer une phrase d'une affirmation à l'autre se fait en silence → « déplacer ici » ;
  - [x] la réplique est toujours la même → l'avocat juge (`repondent`), « ça porte » / « ça ne porte
        pas », variantes qui tournent — **les `repondent` et les répliques sont à relire par l'auteur** ;
  - [x] le présentoir se lit mal → le cadre nomme sa cible, une ligne = un geste, l'état au filet ;
  - [x] la voix du composeur parle encore pendant la répétition → muette tant que la phrase est vide.
- [x] **« Je n'ai rien à opposer »** : la réplique `fin` est devenue une question à laquelle le bouton
      répond, sans renommer le bouton.

## À vérifier en jeu (non joué)

- [ ] La question se lit-elle **avant** les pièces ? Colas ouvrait les pièces sans avoir lu la question
      placée dessous. Le bouton agrégé et `rappelQuestion` y répondent peut-être — à confirmer.
- [ ] La première consigne (« Ouvre ton Contexte », en tête de page) est-elle encore trop abrupte sans
      contexte ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [x] Le halo du tutoriel qui pulsait sur le bouton du message juste après le clic — il passe à l'index.
- [ ] La pièce dans le Contexte sur un vrai téléphone (390 px : serré, le panneau redéfile d'un bloc).
- [ ] Rendre la partie à Colas, qui s'est proposé pour tester la suite.

## Plus tard — après validation de la boucle de base

- [ ] **Chain of thought** : une phase « nuit » après « Maître Auber s'est déconnecté », où l'IA se
      parle à elle-même, support des choix moraux.
- [ ] **RAG** : pouvoir retenir des passages des messages de l'avocat, et des infos qui ne viennent pas
      que de lui.
- [ ] **Regrouper les passages retenus en clusters** (idée d'un ami).
- [ ] **Scénario à choix moraux / alignement** (l'IA dissimulerait-elle un vice de procédure ?) — à
      croiser avec le nouveau scénario en préparation, celui-ci n'étant qu'un placeholder.
- [ ] **Les fins** : premier jet seulement, à retravailler.

## Ménage

- [ ] Fermer sans enregistrer l'onglet VSCodium de `export/iavocat.html` : son tampon date du 1er
      octobre et écraserait l'export du 4.

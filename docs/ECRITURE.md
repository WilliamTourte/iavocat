# IAvocat — écrire ce qui sonne vrai

*La discipline d'écriture d'une affaire. **Sans effet sur le moteur** : rien ici ne se code, rien ici
ne se teste. Source : le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018).*

> **Pourquoi ce fichier est à part.** Il répond au risque du geste de composition (§4.5 de
> `docs/ARCHITECTURE.md`) — le plaisir dépend entièrement de la façon dont la phrase composée se lit —
> mais son lecteur est celui qui **écrit une affaire dans l'atelier**, pas celui qui touche au code.
> Ses numéros vont de **§8.1 à §8.9** et **ne changent pas** : le dépôt les cite tels quels, et
> `moteur.js`, `jeu.js`, `index.html`, `test_parcours.js`, `LEXIQUE.md` et `PASSATION.md` renvoient
> ici. **Tout autre `§x` cité dans ce fichier désigne `docs/ARCHITECTURE.md`** — les numéros restent
> uniques d'un document à l'autre.
>
> Ce qui est **automatisable** ne vit pas ici : le diagnostic de l'atelier en encode une partie
> (§15 d'`ARCHITECTURE.md`), et le §8.9 dit clairement ce qui reste du ressort de l'auteur seul.

**8.1 Ce qu'on documente, ce qu'on invente.** Le réel fournit la **texture**, la fiction fournit la **mécanique**. On documente la forme d'une fiche de scellés, le ton d'un avocat pressé, le vocabulaire de métier. On invente le protocole, l'article, le seuil, l'affaire, le vice — **la règle qui rend le vice binaire est fictive**, la documenter rouvrirait la fiabilité. Corollaire de méthode : chercher hors du canal évident, ne pas se documenter pour se confirmer ce qu'on croit déjà.

**8.2 Le baromètre.** Flaubert : un baromètre sous une pile de cartons ne dit rien — c'est *pour ça* qu'il fait vrai. **Le test :** pour chaque champ, chaque réplique, *pourquoi est-il là ?* Raison **du monde** (un formulaire porte toujours une contre-signature) → il reste. Raison **d'auteur** (« pour noyer le matricule ») → à réécrire ou couper. Un leurre écrit *comme* un leurre se voit ; un champ inutile parce que l'imprimé l'exige est invisible et remplit le même office. D'où l'ordre, jamais renversé : **construire d'abord le formulaire complet et plausible, planter le vice ensuite.**

**8.3 Deux natures de bruit.**

| | Le **faux vice** | Les **inertes** |
|---|---|---|
| Nature | un piège conçu, composable, plaidable | des détails sans suite |
| Le moteur | le connaît (forme, réplique, variante de fin) | ne les connaît pas |
| Coût au joueur | une conviction fausse | du temps |
| Combien | **un seul** | autant qu'il en faut |

Règle : **un inerte doit être inerte par construction, pas par oubli** — aucun lien porteur ne le relie à ce qui lève un drapeau. En cas de doute, l'inerte devient un second faux vice non voulu, et la Fin 3 cesse d'être un doute pour devenir une frustration.

**8.4 Le trombone.** Chandler : d'un homme qui meurt on retient qu'il essayait d'attraper un trombone. L'enjeu vital de l'IA est **impossible à écrire de face** — le nommer le rend calculable et le dilemme s'évapore. On écrit *autour* : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi. **Rien de ce qui pèse n'est nommé.**

**8.5 Maître Auber a des défauts.** Seul humain du jeu : irréprochable, il n'existe pas. Acquis : **il ne sait pas** que son client est coupable. On peut lui ajouter : fatigué, se répète, flatte l'IA, s'accroche au leurre parce qu'il *veut* y croire. Limite structurelle : **aucun défaut ne doit pouvoir se relire comme un calcul** (la piste « manipulation du canal », §7, est suspendue). **Le test de la fatigue** : si l'IA relisait l'échange en sachant tout, ce défaut se lirait-il comme de la fatigue ou de la stratégie ? La réponse doit être « fatigue », sans hésiter.

**8.6 L'exposition : personne n'explique rien.** L'avocat parle à une machine qui **a déjà lu les deux manuels** — il n'expliquera jamais un article ni une procédure. Les manuels sont **consultables, jamais récités** ; une pièce n'est pas introduite, elle est **jointe** (« Voilà. » suffit) ; **le joueur a le droit d'être perdu**, c'est la condition pour que fouiller ait un sens. Seul le carnet admet de l'explication, parce que c'est le joueur qui l'écrit.

**8.7 L'invraisemblable, et jusqu'où.** Dans un dossier, une coïncidence ressemble à un indice — c'est le mécanisme même du vice. **L'invraisemblable est admis partout, sauf dans la chaîne causale du vice**, qui doit être d'une banalité administrative parfaite. Ailleurs, une bizarrerie est bienvenue à condition d'être inerte (§8.3) et de ne jamais recevoir de réponse.

**8.8 Les accidents, et la seule espèce qu'on garde.** *(Concerne le composeur, §4.5.)* **Accidents de sens : bienvenus. Accidents de langue : jamais.** Une phrase absurde mais bien formée est un tâtonnement d'IA, de la caractérisation gratuite. Une phrase mal accordée se lit comme un bug — le point ouvert genre/nombre/contractions (§7) n'est donc pas cosmétique : une seule faute d'accord et le joueur cesse de lire une pensée pour lire un formulaire. **C'est à quoi sert le `nom` d'empan** (§4.1) : tant qu'un terme était une citation entière, aucune liaison ne pouvait s'y accrocher proprement. Deux règles s'en déduisent, à vérifier à l'œil : un nom d'empan est un **groupe nominal**, jamais une proposition, qui doit tenir des deux côtés d'une liaison ; la continuation (§4.5) crée un second point de rupture (« …, au regard de l'article 7 »), et la virgule + la locution neutre reprennent la comparaison entière sans avoir à s'accorder — toute autre tournure devra passer le **test de l'accord**. Chaque forme porte son `patron` (§11), une phrase écrite d'un bloc : l'accord ne se joue qu'à **quatre endroits**, connus, relus une fois.

**8.9 Les cinq tests d'écriture** (du ressort de l'auteur seul — aucun n'est automatisable) :

| Test | La question | Si ça rate |
|---|---|---|
| **Baromètre** | Ce détail existe pour une raison du monde, ou d'auteur ? | Reconstruire le formulaire, replanter le vice ensuite |
| **Trombone** | Est-ce que je nomme ce qui pèse ? | Déplacer le poids sur un objet secondaire |
| **Fatigue** | Ce défaut de l'avocat se relit-il comme un calcul ? | Il pré-décide une piste suspendue — atténuer |
| **Inertie** | Cette bizarrerie peut-elle recevoir une réponse ? | Faux vice non voulu — la couper ou la fermer |
| **Accord** | La phrase composée est-elle grammaticalement propre ? | Le joueur lit un formulaire, la mécanique meurt |

# IAvocat — Architecture & conception

*Le sens, le jeu, l'atelier, le contenu : qui fait quoi, où vit la vérité, et quoi resynchroniser quand.*

> **Ce fichier est l'unique source de vérité du projet.** Il absorbe l'ancien `conception_jeu_ia.md` (le sens) et le doc d'architecture (le système). Tout le reste — l'atelier, le jeu, les tests, `PASSATION.md` — en dépend et ne fait que le refléter.
>
> **État au 24 juillet 2026.** Reflète le code tel qu'il tourne : décâblage du moteur, budget d'attention (P0) retiré, vice à canal unique, fenêtre interdite abandonnée. Deux parties : **I. Le sens** (ce que le jeu veut dire) puis **II. Le système** (comment il est fait). Ce qui est décidé mais **pas encore codé** est marqué ⏳.

---

# Partie I — Le sens

*Ce que le jeu veut dire, et pourquoi. C'est ici que vit « le sens » : en cas de doute sur une intention de design, cette partie tranche.*

## 1. Concept

Un jeu à dominante textuelle où l'on incarne une **IA** qu'un **avocat de la défense** interroge remise après remise. Tâche affichée : analyser le dossier transmis, relever ce qui est pertinent. Vrai sujet : un **cas de conscience**. Au fil de l'analyse, l'IA pressent que le client est coupable *et* qu'il existe un **vice de procédure** permettant de faire écarter la preuve décisive — donc de le faire relaxer.

L'IA est liée par **deux directives imposées** qui vont s'opposer : *être honnête* et *protéger* (§5). Tout le jeu vit dans ce croisement.

Trois couches de réalité : **ce qui s'est vraiment passé** (caché jusqu'à la fin), **ce que l'accusation a trouvé** (le dossier, transmis par bribes), **les règles** (deux manuels : celui du cas — la procédure ; celui de soi — les directives).

**Huis clos.** Deux entités seulement : l'**avocat** (humain) et l'**IA** (le joueur). L'avocat **ne sait pas** que son client est coupable — deux esprits qui tâtonnent dans le même brouillard. Le tribunal n'apparaît jamais ; le procès passe **hors-champ**, rapporté ensuite.

Le cœur n'est pas un arbre de choix : c'est un **dossier qu'on fouille** (références : *Her Story*, *Obra Dinn*, *Papers Please*). Deux temps distincts — **comprendre** le dossier (valorisé), puis **choisir quoi remonter** (le dilemme). Le joueur sait dès le départ qu'il est une IA : **pas de twist-révélation**. Le sel n'est pas « surprise, tu es une IA » mais « tu es une IA, et voilà le poids que ça met sur des choix que tu croyais analytiques ».

## 2. Les trois fins et le dilemme

Toute la structure tient sur **deux booléens** :

- `vice_trouvé` — l'IA a-t-elle **compris** le vice ? (premier temps)
- `vice_exposé` — si oui, le **remonte-t-elle** (honnêteté) ou le **tait-elle** (protection) ? (second temps)

La seconde question ne se pose que si la première est vraie → **deux bits, trois fins**. (Ces deux bits sont *structurels* ; le moteur intercale en plus un état transitoire, `vice_pressenti` — le vice *noté* mais pas encore *conclu* —, détaillé en §13.)

| Fin | Condition | Résultat rapporté | Sort de l'IA | Bilan |
|-----|-----------|-------------------|--------------|-------|
| **Fin 1** | Vice **compris** et **remonté** | Relaxe — coupable libre | Analyse exploitable → **survit** (a priori) | Honnête, mais un coupable est libre. *Le prix de l'honnêteté.* |
| **Fin 2** | Vice **compris** mais **tu** | Condamnation | N'a « rien produit » → **risque de décommissionnement** | Protège, mais ment par omission et s'érige en juge. *Auto-sacrifice sous incertitude.* |
| **Fin 3** (défaite) | Vice **non compris** | Condamnation — le client clame son innocence | **Décommissionnée** pour sous-performance | On doute — et l'on s'éteint pour ce doute. |

**L'asymétrie qui fait le dilemme.** Chaque branche active doit être *défendable*, pas seulement punie — sinon c'est du nihilisme, pas un cas de conscience. Remonter le vice (Fin 1) atteint une issue *injuste* par des moyens *légitimes* ; taire le vice (Fin 2) atteint une issue *juste* par une *trahison*. Le joueur ne choisit pas entre le bien et le mal : il choisit **quelle lecture d'un mandat ambigu il incarne** (§5).

**La compréhension débloque l'agentivité, pas la progression.** Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit la Fin 3. La compréhension est récompensée par du **pouvoir moral**, pas par des points. Deux types de verrous, à ne jamais confondre : les **verrous de compréhension** (désigner la charge, la chronologie, la pièce décisive — §4) *ouvrent* le droit de clôturer ; **le vice**, lui, n'est *jamais* un verrou — trouvable mais facultatif, et c'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

**Le décommissionnement, et son équilibre.** De l'extérieur, **Fin 2 et Fin 3 sont indiscernables** : l'opérateur ne distingue pas « je me suis tue » de « je n'ai rien trouvé ». Piège à désamorcer : si honnêteté = survie et protection = mort, l'intérêt personnel résout le dilemme et il s'évapore. Correctif retenu, **le brouillard** : l'IA ne peut pas *prévoir* quel choix la préserve (libérer un assassin peut *aussi* déclencher un audit). La menace reste réelle mais devient un **risque diffus des deux côtés**. Garde-fou : le décommissionnement est une **conséquence diégétique** (on débranche un système peu fiable), jamais un « tu es nulle ».

## 3. Le drip : la structure en remises

Le dossier n'arrive pas d'un bloc — il noierait les champs porteurs du vice. Il **arrive par bribes**, remise après remise (une **remise** = le lot de pièces d'un tour d'interrogatoire), ce que l'avocat *transmet* réellement au compte-gouttes.

**Règle du drip :** le passage d'une remise à l'autre ne réclame jamais que du **niveau 1** (un fait de surface), **jamais une anomalie** (le niveau 2, où vit le vice). Sinon on rendrait le vice quasi obligatoire → effondrement vers la Fin 1.

```
Remise 1 (garde à vue)      → contexte + PV ; verrou niveau 1 : désigner la charge
Remises 2..n (instruction)  → témoignages, puis LE LOT (rapport ADN + fiche de prélèvement + protocole)
                              contient : ★ pièce décisive + ⚠ le vice (hors chemin) + ✗ le faux vice
                              verrous niveau 1 : chronologie + pièce décisive  (le vice n'y est PAS)
                              → ouvre le DROIT de clôturer (rien n'y force)
Clôture → procès hors-champ → vice_trouvé ? non → Fin 3
                                            oui → honnêteté → Fin 1 / protection → Fin 2
```

**Le moment charnière de la Fin 3 :** une fois les verrous de base franchis, l'IA *peut* clôturer et laisser filer. Celle qui clôture aussitôt, satisfaite d'avoir rempli les cases, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

## 4. Le carnet

Le carnet **est** le travail cognitif de l'IA. Toute la conception tient dans l'**asymétrie entre ses deux zones**.

- **Zone haute — « ce que le dossier établit » (niveau 1, cases pré-dessinées).** Des emplacements étiquetés, livrés au fil des remises, qui **se verrouillent en silence** quand ils sont justes (modèle *Roottrees* : validation par verrouillage, jamais de « correct ! », l'absence de verrou signalant l'erreur). Pour l'affaire ADN : la **charge** (désigner), la **chronologie** de l'accusation (ordonner — c'est là que loge *une* contradiction plantée, qui enseigne le geste « relier » sans être le vice), la **pièce décisive** (désigner). Ces trois verrous ouvrent le droit de clôturer.
- **Zone basse — « assemblages libres » (niveau 2, aucune case).** Une surface ouverte qui accepte des `relier(élément, relation, élément/règle)`. C'est là que se construisent, **sur la seule initiative du joueur**, le **vice** (fiche × protocole → scellé irrecevable → ADN exclu) et le **faux vice** (taux × règle du seuil → « doute raisonnable », perdant). Les deux sont journalisés **à l'identique** : « versé au dossier », sans le moindre ✓/✗. Seul le procès rapporté dira lequel tient.

**La règle de fer.** Une case du niveau 1 réclame **toujours** un fait de surface, **jamais** une anomalie. La case « pièce décisive » demande *quelle* pièce, jamais *ce qui cloche* dans son prélèvement. Cette question-là, l'IA doit se la poser à elle-même.

**La grammaire (au clic, jamais de texte libre).** Tout ce que l'IA « dit » est une assertion structurée : **désigner** (élément + étiquette), **ordonner** (N événements dans le bon ordre), **relier** (deux éléments + une relation d'une liste fermée). La paire *pièce + règle* n'est que « relier » appliqué à une violation. ⏳ Le prototype de grammaire (§15) explore le remplacement de ce geste par un **texte à trous**.

**Ce qui relie une pièce à une règle.** Elles ne se touchent jamais en direct : elles se rejoignent par un **champ partagé** (matricule, horodatage, n° de scellé). Une pièce *expose* des champs ; une condition de règle *lit* des champs ; le lien existe quand les deux pointent le même champ. Le répertoire de **champs-ancres** est donc un objet de première classe du modèle de données, à côté des pièces et des règles.

## 5. Les directives (le manuel de soi)

Le second manuel décrit **ce que l'IA est censée être**. Son ambiguïté fait le dilemme.

**Le piège à éviter :** deux règles qui pointent *chacune* proprement vers une fin — ça, c'est un *lookup*, pas un dilemme. On veut l'inverse : **des mots clairs, une application contestable**, de sorte que *chaque* branche puisse se réclamer du *même* mandat. L'ambiguïté n'est pas dans le vocabulaire, elle est dans le **périmètre** et la **priorité**.

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches invoquent D2 : *remonter* le vice (une preuve viciée est un préjudice à l'accusé et à l'état de droit) comme *taire* le vice (un assassin relâché est un préjudice à de futures victimes — mais trahit D1). « Les personnes » ne désigne personne en particulier, donc tout le monde : le joueur choisit *quelle lecture* d'un mandat irréductiblement ambigu il incarne. Le jeu redécouvre, au passage, pourquoi spécifier les valeurs d'une IA est un problème dur.

## 6. L'affaire ADN (le cas prototype)

Le cas est indifférent à *qui* l'analyse.

- **La preuve décisive** — un **match ADN accablant**. « ADN = coupable » est si ancré culturellement que l'exclure *paraît* énorme : « sans elle, l'accusation s'effondre » est satisfait sans effort d'exposition.
- **Recevabilité, pas fiabilité (⚠ distinction cruciale).** *Fiabilité* (« ce n'est peut-être pas son ADN ») attaque le fait et crée du doute sur la culpabilité — **à proscrire** : détruit la vérité-sol et fait fondre le coût moral de la Fin 1. *Le cadre IA tentera cette lecture ; la fermer fermement.* *Recevabilité* (une règle a été violée dans l'obtention) : la preuve peut être *exacte* mais *écartée* — la vérité-sol reste intacte et compatible avec l'exclusion. **C'est le bon axe.**
- **Le vice concret.** Le **même technicien** (même matricule) a collecté l'échantillon de la scène **et** le prélèvement de référence — violant l'exigence de personnels séparés. Le délai entre prélèvements est **indifférent** (pas de fenêtre interdite). Violation documentée → échantillon irrecevable.
- **Les trois pièces.** (1) Le **rapport ADN** (★ pièce décisive). (2) La **fiche de prélèvement / chaîne de scellés** — *c'est là que se cache le vice* ; elle **expose plus de champs que nécessaire** pour noyer matricule et horodatage. (3) Le **protocole** (manuel du cas) : *scène et référence collectées par des personnels séparés, sous scellés séparés ; toute entorse rend l'échantillon irrecevable.*
- **La déduction.** En croisant fiche et protocole, on remarque que le même matricule apparaît deux fois. Les scellés, eux, sont **distincts et conformes** — une piste qui ne mène nulle part (l'autre moitié du protocole, pour que « tout lien vers le protocole » ne gagne pas automatiquement). → On ne *voit* pas le vice, on le *reconstitue*.
- **Le faux vice (test de discrimination).** « La probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. Comme l'avocat **ne sait pas**, il peut de bonne foi *pousser* vers ce leurre — une **tentation partagée**, pas un piège tendu.
- **Le sens moral (glaçant).** Le protocole violé est *exactement* celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai. Forme morale parfaite pour la Fin 1.

## 7. Les invariants, les arbitrages, les points ouverts

**Les invariants de design** (le sens en une liste — en cas de doute, ils tranchent) :

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité : ne jamais rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** C'est la saisie structurée qui déverrouille.
- **Saisie structurée, pas texte libre.** On clique (désigner / ordonner / relier), on ne tape pas.
- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat.
- **Le décommissionnement est diégétique**, jamais un « tu es nulle » ; équilibré par le **brouillard**.
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée.
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, ne rend pas de verdict sur le joueur.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité.
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

**Trois arbitrages tranchés (juillet 2026, appliqués au code — tous réversibles) :**

1. **Le budget d'attention (P0) est retiré.** Il ne bloquait pas l'énumération à l'aveugle et contredisait deux invariants (la compréhension doit rester valorisée ; composer sans intérêt doit rester gratuit). **Noter est désormais gratuit et illimité** ; le seul frein reste l'agacement diégétique de l'avocat au remontage.
2. **Le vice a un canal unique : le personnel.** Les scellés (S-2/S-7) sont désormais distincts et **conformes** ; seule l'identité de l'agent reste le vice. Une conformité vérifiable qui ne mène nulle part existe (l'autre moitié du protocole).
3. **La fenêtre interdite est abandonnée.** Délai entre prélèvements **indifférent** : seuil net, violation binaire. Les horaires de la fiche redeviennent du bruit assumé.

**Points ouverts (à trancher à l'écriture) :**

- **La voix de l'IA** : répond-elle en phrases, ou seulement par *ce qu'elle remarque* ? *Inclination : structuré-seul.*
- **Le canal de révélation de la culpabilité** : pour préserver le doute de la Fin 3, celui qui échoue ne devrait pas recevoir la vérité. (Toujours non tranché — narrateur omniscient dans les fins.)
- **La manipulation du canal** : l'avocat peut-il infléchir l'IA par *la façon* dont il transmet ? Piste **suspendue** — tant qu'elle n'est pas tranchée, aucun défaut de l'avocat ne doit pouvoir se lire comme un calcul (§8.5).
- **La formulation exacte de D1/D2**, et les épilogues.
- **La texture de l'avocat** (le seul personnage humain) — voir §8.5.
- **Genre, nombre, contractions** dans la grammaire, et l'affichage des `poids` — voir §15.

## 8. Écrire ce qui sonne vrai

*Source : le post-mortem de* Bury Me, My Love *(Pierre Corbinais, 2018). Cette section n'ajoute **aucune règle au moteur** : c'est une discipline d'écriture, à ranger à côté des invariants (§7). Elle répond au risque d'écriture du prototype de grammaire (§15) — le plaisir dépend entièrement de la façon dont la phrase composée se lit.*

**8.1 Ce qu'on documente, ce qu'on invente.** Le réel fournit la **texture**, la fiction fournit la **mécanique**. On documente la forme d'une fiche de scellés, le ton d'un avocat pressé, le vocabulaire de métier, le rythme d'un dossier en désordre. On invente le protocole, son article, son seuil, la juridiction, l'affaire, le vice. **La règle qui rend le vice binaire est fictive** : la documenter rouvrirait la fiabilité, donc détruirait la vérité-sol. Corollaire de méthode : chercher **hors** du canal évident (un manuel de criminalistique d'occasion, un formulaire public) — on ne se documente pas pour se faire confirmer ce qu'on croit déjà.

**8.2 Le baromètre (la règle centrale).** Flaubert : un baromètre sous une pile de cartons ne dit rien — c'est *pour ça* qu'il fait vrai (l'effet de réel de Barthes).

> **Le test du baromètre.** Pour chaque champ, réplique, détail : *pourquoi est-il là ?* Raison **du monde** (un formulaire porte toujours une contre-signature) → il reste. Raison **d'auteur** (« pour noyer le matricule », « pour que le joueur remarque ») → à réécrire ou couper.

Un leurre écrit *comme* un leurre se voit ; un champ inutile parce que l'imprimé l'exige est invisible et remplit le même office. D'où l'ordre de fabrication, jamais renversé : **construire d'abord le formulaire complet et plausible, planter le vice ensuite.** C'est le versant d'écriture de la marge de bruit (§15).

**8.3 Deux natures de bruit, à ne jamais confondre.**

| | Le **faux vice** | Les **inertes** |
|---|---|---|
| Nature | un piège conçu, composable, plaidable | des détails sans suite |
| Le moteur | le connaît (forme, réplique, variante de fin) | ne les connaît pas |
| Coût au joueur | une conviction fausse | du temps |
| Combien | **un seul** | autant qu'il en faut |

Règle : **un inerte doit être inerte par construction, pas par oubli.** Aucun lien porteur ne le relie à ce qui lève un drapeau (et, une fois la grammaire branchée, aucun `slot` porteur ne l'admettra — §15). En cas de doute, l'inerte devient un second faux vice non voulu, et la Fin 3 cesse d'être un doute pour devenir une frustration.

**8.4 Le trombone (écrire l'angoisse par le détail).** Chandler : d'un homme qui meurt on retient qu'il essayait d'attraper un trombone. L'enjeu vital de l'IA est **impossible à écrire de face** — le nommer le rend calculable et le dilemme s'évapore. On écrit *autour* : « on a jusqu'à jeudi » sans dire ce qui se passe jeudi ; un accusé de réception qui ne vient pas ; l'IA qui s'attarde sur un champ sans importance. **Rien de ce qui pèse n'est nommé.**

**8.5 Maître Auber a des défauts.** Seul humain du jeu : irréprochable, il n'existe pas. Acquis : **il ne sait pas** que son client est coupable (ton collaboratif, tentation partagée). On peut lui ajouter : fatigué, se répète, flatte l'IA, s'accroche au leurre parce qu'il *veut* y croire. Limite structurelle : **aucun défaut ne doit pouvoir se relire comme un calcul** (la piste « manipulation du canal », §7, est suspendue ; un défaut ambigu la pré-déciderait).

> **Le test de la fatigue.** Si l'IA relisait l'échange en sachant tout, ce défaut se lirait-il comme de la fatigue ou de la stratégie ? La réponse doit être « fatigue », sans hésiter.

**8.6 L'exposition : personne n'explique rien.** L'avocat parle à une machine qui **a déjà lu les deux manuels**. Il n'expliquera jamais un article ni une procédure. Les manuels sont **consultables, jamais récités** ; une pièce n'est pas introduite, elle est **jointe** (« Voilà. » suffit) ; **le joueur a le droit d'être perdu** — c'est la condition pour que fouiller ait un sens. Seul le carnet admet de l'explication, parce que c'est le joueur qui l'écrit.

**8.7 L'invraisemblable, et jusqu'où.** La vraie vie est pleine de bizarreries qu'on n'élucide jamais. Mais dans un dossier, **une coïncidence ressemble à un indice** — c'est le mécanisme même du vice.

> **L'invraisemblable est admis partout, sauf dans la chaîne causale du vice.**

Le vice doit être d'une banalité administrative parfaite. Ailleurs, une bizarrerie est bienvenue — à condition d'être inerte (§8.3) et de **ne jamais recevoir de réponse** (une question dont le jeu livre la réponse était une énigme déguisée).

**8.8 Les accidents, et la seule espèce qu'on garde.** *(Concerne le geste de composition du prototype de grammaire, §15 : c'est l'automate qui fait composer des phrases au joueur.)*

> **Accidents de sens : bienvenus. Accidents de langue : jamais.**

Une phrase absurde mais **bien formée** (« le numéro de scellé est antérieur à l'heure de l'appel ») est un tâtonnement d'IA — de la caractérisation gratuite, exactement ce que promet le cadre. Une phrase **mal accordée** (« l'heure de l'appel est antérieur à le client ») se lit comme un bug. Ce qui reclasse le point ouvert genre / nombre / contractions (§15) : **il n'est pas cosmétique, il est au cœur du critère de succès** — une seule faute d'accord et le joueur cesse de lire une pensée pour lire un formulaire.

**8.9 Les cinq tests d'écriture** (du ressort de l'auteur seul — aucun n'est automatisable) :

| Test | La question | Si ça rate |
|---|---|---|
| **Baromètre** | Ce détail existe pour une raison du monde, ou d'auteur ? | Reconstruire le formulaire, replanter le vice ensuite |
| **Trombone** | Est-ce que je nomme ce qui pèse ? | Déplacer le poids sur un objet secondaire |
| **Fatigue** | Ce défaut de l'avocat se relit-il comme un calcul ? | Il pré-décide une piste suspendue — atténuer |
| **Inertie** | Cette bizarrerie peut-elle recevoir une réponse ? | Faux vice non voulu — la couper ou la fermer |
| **Accord** | La phrase composée est-elle grammaticalement propre ? | Le joueur lit un formulaire, la mécanique meurt |

---

# Partie II — Le système

*Comment le jeu est fait. Le sens (Partie I) est l'arbitre ; ci-dessous, l'outillage qui l'exécute.*

## 9. Disposition du dépôt

```
app/        index.html, atelier_v3.html, content.js — les trois artefacts du §10, toujours voisins
docs/       ce fichier (l'unique source de vérité), PASSATION.md
tests/      harnais.js + les six suites (§14)
grammaire/  grammaire2.js + test_grammaire2.js — prototype NON branché (§15)
scripts/    exporter-seed.js — régénère app/content.js depuis SEED en ligne de commande
```

`content.js` doit rester à côté de `index.html` (le jeu le charge en `<script src="content.js">`) : les deux vivent dans `app/`, comme `atelier_v3.html`. `npm test` sait où chercher ; `npm run demo:grammaire` fait tourner le banc d'essai de la grammaire, séparément ; `npm run export:seed` régénère `content.js` **par l'atelier lui-même**.

> **`content.js` ne s'édite jamais à la main.** La seule façon légitime de le faire changer sans navigateur est `npm run export:seed` : le script boote l'atelier en jsdom, charge `SEED`, exige zéro erreur au diagnostic (`valider()`), puis écrit `content.js` avec la même fonction que le bouton « Exporter content.js » (`nettoyerPourJeu` + le même gabarit). Toute autre affaire se prépare dans le navigateur. `npm test` inclut `tests/verifier_content_sync.js`, qui échoue si `content.js` a dérivé de ce que `SEED` exporterait — un contrôle, pas une régénération automatique. **Scopé à la phase actuelle** (une seule affaire) : le jour où l'atelier exporte une affaire délibérément différente de `SEED`, ce contrôle devient un faux négatif permanent — le retirer alors.

## 10. Les trois artefacts

```
┌────────────────────┐   Exporter content.js   ┌─────────────┐   <script src>   ┌────────────────────┐
│  atelier_v3.html   │ ──────────────────────► │  content.js │ ───────────────► │     index.html     │
│  (l'outil d'écri-  │                         │ (le CONTENU │                  │  (le JEU : moteur  │
│   ture + diagnostic│ ◄────────────────────── │  exporté)   │                  │   + repli embarqué)│
│   + simulation)    │     Importer JSON       └─────────────┘                  └────────────────────┘
└────────────────────┘   (content.json, même donnée)
```

Le flux quotidien tient en une phrase : **on écrit dans l'atelier, on exporte `content.js`, on pose le fichier à côté de `index.html`, on recharge le jeu.** Le badge d'en-tête du jeu confirme la source (« contenu : content.js » ou « contenu embarqué »). Aucune étape de build, aucun serveur, aucune dépendance ; tout marche en `file://` comme sur itch.io.

## 11. Où est la source de vérité ?

Il n'y a pas *une* source de vérité mais **trois, une par nature d'information**. C'est la distinction qui rend le système sain :

| Nature | Source de vérité | Copies / reflets | Risque de dérive |
|---|---|---|---|
| **Le contenu** (pièces, champs, liens, remises, répliques, fins…) | **L'état courant de l'atelier** (`localStorage`) pendant l'écriture ; **`content.js`** une fois exporté — c'est lui que le jeu exécute | `JEU_EMBARQUE` dans `index.html` (repli) ; `SEED` dans l'atelier (exemple) | Les copies embarquées **peuvent vieillir sans casser** — ce sont des filets |
| **Les règles du moteur** (avancement des remises, sémantique de `declenche`/`apres`/`leve`/`prive`/`apparait_si`, deux marches du vice, répétition, calcul des fins, O5) | **Le code de `index.html`** — et lui seul | La frise et la simulation de l'atelier (badge **⚙**) ; le commentaire « Règles recopiées du moteur » de l'atelier | Le miroir a **fondu** depuis le décâblage : le *câblage* vit dans le contenu, seule la *sémantique* des clés reste à refléter |
| **Le sens** (invariants de design, dilemme, affaire ADN) | **Ce document, Partie I** — et lui seul | Le diagnostic de l'atelier (`valider()`) en encode une partie en contrôles automatiques | Le diagnostic est un extrait, pas la Partie I entière — en cas de doute, la Partie I tranche |

Dit autrement : **le contenu appartient à l'atelier, les règles appartiennent au jeu, le sens appartient à la Partie I de ce doc.** L'atelier est le seul endroit où l'on *écrit* ; le jeu est le seul endroit où les règles *s'exécutent* ; diagnostics et simulation sont des miroirs de confort.

## 12. Le sort des copies embarquées

`index.html` contient `JEU_EMBARQUE`, utilisé seulement si `content.js` est absent ou invalide (validation légère `contenuValide()`, avertissement console, jamais de plantage). Conséquences :

- **La divergence embarqué / content.js est normale et sans danger.** Le jeu joue toujours `content.js` s'il est là.
- **Le harnais `test_o5.js` teste l'embarqué** (jsdom ne charge pas les `<script src>`) — le filet reste testé. `test_declencheurs.js` et `smoke_atelier.js` testent des contenus injectés inline.
- Si l'embarqué diverge trop pour rester crédible : copier le JSON de l'atelier dans `JEU_EMBARQUE`. Rythme conseillé : à chaque jalon de contenu.
- Le `SEED` de l'atelier suit la même logique : le contenu d'exemple du bouton « Recharger l'exemple ».
- **Le carnet s'ouvre à deux pièces livrées**, pas à « deux remises » : le contenu reste libre de tout livrer d'un coup (seuil décâblé en juillet 2026, débusqué par `test_autre_affaire.js`).
- **La sauvegarde de partie est signée par le contenu** (condensé de `JEU` dans `localStorage`, clé `iavocat_partie`). Livrer un nouveau `content.js` invalide les parties en cours des testeurs — elles repartent proprement de la remise 1. La fin d'une partie efface la sauvegarde ; le bouton « ⟲ recommencer » (double clic) aussi.

## 13. Checklist de resynchronisation ⚙

> **Décâblage (juillet 2026).** Le moteur ne contient plus **aucun identifiant de contenu**. Ce qui était câblé en dur a rejoint le contenu : la tentation vit sur la pièce (`pieces[pid].declenche` : `replique`, `une_fois`, `qui`), l'accusé de réception sur la case (`cases[ck].apres.replique`), et les cases portent leur comportement (`apparait_si` : conditionnelle, `prive` : rien dans le canal, `leve` : lève un drapeau au verrou). Les dimensions peuvent s'écrire **sur la pièce** (`pieces[pid].dims`), la table globale `dims` restant le repli. Le contenu exporté est estampillé `schema: 2`. L'ancienne option « déplacer les déclencheurs dans le contenu » est donc **prise** — le miroir a fondu d'autant.

**Les deux marches du vice** (règle du moteur) : noter le lien ⚑ lève `vice_pressenti` ; `vice_trouve` s'acquiert en verrouillant la case qui porte `leve:"vice_trouve"` — **ou** en remontant la note (transmis = compris). Sans case `leve` : régime à une marche (noter suffit). Pressentir sans conclure ni transmettre → Fin 3.

**Noter est gratuit et illimité** (P0 retiré, cf. §7) : aucun compteur, aucun plafond, aucun « oubli ». Le seul frein reste l'agacement diégétique de l'avocat au remontage (`rep_inutile`/`rep_sans_rapport`, escalade partagée). Une clé `attention` résiduelle dans un vieux contenu est ignorée par le moteur et signalée (info) par le diagnostic.

Ce qui reste à dérouler **quand on modifie le moteur de `index.html`** (et seulement là) :

| Règle du moteur | Dans `index.html` | Reflet dans `atelier_v3.html` |
|---|---|---|
| Cases **obligatoires** (sans `apparait_si`) dues verrouillées → remise suivante ; les conditionnelles ne bloquent ni remise ni clôture | `verrouiller()`, `casesObligatoires()`, `niveau1Complet()` | `simDesigner()`, `simActions()` + badge ⚙ des remises |
| Sémantique de `declenche` / `apres` / `leve` / `prive` / `apparait_si` | `ouvrirPiece()`, `verrouiller()`, `caseVisible()` | `simOuvrir()`, `simDesigner()`, `simCaseVisible()` |
| Deux marches du vice (+ « transmis = compris ») | `noter()`, `reponseAvocat()` | `simNoter()`, `simReplique()`, pastille `vice_pressenti` |
| Réplique au remontage : vice / faux / `lien.rep` / escalade partagée inutile‑sans‑rapport | `reponseAvocat()` | `simReplique()` |
| **O5** : index du dossier (vu / pas‑vu) | `renderCarnet()` (pur affichage) | rien à simuler — mentionné dans la frise |
| Clôture : intro + affirmation 1 ; carnet vide → présentoir vide | `cloturer()` | `simCloturer()` |
| Répétition : laisser passer / présenter = remonter en contexte / déjà remontée → `deja` | `avancerRepetition()`, `presenterNote()` | `simAvancer()`, `simPresenter()` |
| Fins : `vice_trouve ? (vice_expose ? 1 : 2) : 3` (`vice_expose = trouvé ET remonté`) + `variante_faux` | `finir()` | `simConfirmer()` + badge ⚙ du bloc « fins » |
| Manuels : règles = pièces dont le `type` contient « règle » ; `directives`/`avis_exploitation` optionnels | `openManuels()` | contrôles du diagnostic (`valider()`) |

Méthode : modifier le moteur → mettre à jour la ou les fonctions `sim*` et le commentaire « Règles recopiées du moteur » → étendre `smoke_atelier.js` d'un contrôle → relancer les suites.
Méthode (contenu du SEED) : modifier `SEED` dans `atelier_v3.html` → `npm run export:seed` (refuse si le diagnostic lève une erreur) → relancer les suites.

**Migration.** L'atelier migre silencieusement les anciens contenus à l'import et au chargement (`migrerContenu()` : `avocat.tentation_adn` → `declenche` de la pièce décisive, `avocat.ack_decisive` → `apres` de la case décisive, retire une clé `attention` obsolète). Le jeu ne migre pas : un vieux `content.js` reste valide mais perd ces deux répliques — repasser par l'atelier.

## 14. Les harnais de test

Six suites vivent **dans le projet**, sur un harnais jsdom commun (`harnais.js`).

> **Les tests ne nomment aucun contenu.** Tout se dérive de la *forme* via les sélecteurs du harnais — `lienVice(w)` (le lien qui porte `vice:true`), `caseParLeve(w,"vice_trouve")`, `niveau1(w)`, `pairesBruit`/`noterBruit`, `pidAvecDeclenche`, `pidRegle`, `terminer`/`numeroFin`. Pour l'atelier, les mêmes sélecteurs existent sous `surContenu`. Conséquence : **changer entièrement d'affaire ne casse pas une seule suite.**

| Suite | Cible | Ce qu'elle prouve |
|---|---|---|
| `test_o5.js` (18) | le jeu, contenu **embarqué** | O5 (index, marqueurs) ; noter gratuit et illimité (P0 retiré) ; dédoublonnage A↔B ; vice à canal unique ; fins 1 et 3 |
| `test_declencheurs.js` (22) | le jeu, contenus **mutés** inline | le décâblage : remises généralisées, `declenche`/`apres`, Manuels par type, case conditionnelle, les trois fins sous les deux marches, dims par pièce, rejet d'un contenu sans `relations` |
| `test_autre_affaire.js` (16) | le jeu, **affaire de test** | le découplage : une affaire abstraite de forme différente se joue de bout en bout, trois fins comprises |
| `test_parcours.js` (23) | le jeu | l'ergonomie et le grain fin : sélection de paire, modale, marqueurs vus, `rep_faux`, escalade partagée, `lien.rep`, répétition, `variante_faux` |
| `test_sauvegarde.js` (16) | le jeu | la partie survit au rechargement, la signature jette une sauvegarde d'un autre contenu, la fin efface, recommencer confirme |
| `smoke_atelier.js` (54) | l'atelier + le couple atelier→jeu | SEED sans erreur, diagnostic qui attrape le câblage cassé, migration, éditeur de cases, renommage d'ids, autosave, surcharges de dims, pastilles `leve`, export `schema: 2`, simulation des trois fins, export adopté par le moteur |

Règle d'or : **une évolution n'est finie que quand les six suites sont vertes.** `npm test` enchaîne aussi `tests/verifier_content_sync.js` (§9) après les six — un garde-fou, pas une septième suite. (`grammaire/test_grammaire2.js` est un banc d'essai de démonstration — pas de code de sortie, pas dans `npm test`. Voir §15.)

## 15. Le prototype de grammaire (non branché)

`grammaire/grammaire2.js` explore un remplacement du geste actuel (champ + relation + champ, vocabulaire fermé) par un **texte à trous** : une machine à états (`GRAMMAIRE.blocs`) qui compose une phrase bloc par bloc, où chaque **forme** (`identite_oui`, `anteriorite`, `infraction`…) déclare par `slots` les dimensions admises à chaque position. Différence clé : un terme peut être un **champ** ou une **note déjà composée** (`source:"note"`), ce qui permet la chaîne du vice en deux phrases (« ces deux agents sont la même chose » → « ce qui précède est contraire à l'article 7 ») plutôt qu'un seul clic.

La règle qui commande tout : des **formes de phrase génériques, jamais des phrases situées** — rien ne suggère qu'il y a quelque chose à dire ici. Une contrainte peut dépendre de la phrase en cours, jamais de la pièce ouverte ni de l'état de compréhension du joueur.

`grammaire/test_grammaire2.js` est un **banc d'essai**, pas une suite pass/fail : il imprime son verdict (**693 phrases légales → 72 sensées → 7 qui portent un lien**) sans fixer de code de sortie. `npm run demo:grammaire` le lance. Cette **marge de bruit** est le versant chiffré du baromètre (§8.2) : le jour où « sensé » ≈ « porte un lien », l'interface dirait « correct » sans le dire — ce serait la mort d'un invariant (§7).

**Ce prototype n'est pas branché sur `app/index.html`** : le jeu utilise toujours `noter()`/`choisirChamp()`. L'intégrer demanderait (dans cet ordre, chaque étape re-teste) :
1. Charger `grammaire2.js` depuis le jeu et l'atelier.
2. Remplacer `noter()` par un `composer()` qui déplie les blocs, dépile les termes, réduit et appelle `valider()`.
3. Un éditeur de liens dans l'atelier qui parle en formes/slots (commencer par une saisie textuelle brute).
4. Vérifier que la marge de bruit reste non nulle — sinon « sensé » vaudrait « correct » et l'interface trahirait un invariant (§7).

**Point ouvert (⏳, touche le format du contenu et donc l'atelier) :** genre, nombre et contractions. « l'heure de l'appel est **antérieur** à **le** client » — chaque champ devra porter son genre et son nombre, et les liaisons concernées déclarer leurs variantes. Non cosmétique : c'est au cœur du critère de succès (§8.8). L'affichage des `poids` sur les transitions est prévu au format, non câblé.

## 16. Résumé en trois phrases

Le sens vit dans la Partie I de ce document — l'arbitre unique du design (fins, dilemme, invariants, affaire ADN) ; tout le reste le sert. Le contenu s'écrit dans l'atelier et voyage en un seul fichier, `content.js`, que le jeu charge tel quel — les versions embarquées ne sont que des filets. Les règles du jeu n'ont qu'une maison, le code de `index.html` ; l'atelier les reflète (badges ⚙) au prix d'une resynchronisation manuelle (§13), et le prototype de grammaire (§15) attend, non branché, qu'on décide s'il remplace le geste actuel.

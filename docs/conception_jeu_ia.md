# Jeu d'IA interrogée — Document de conception

> **Repositionnement.** Le joueur n'incarne plus l'avocat, mais **l'IA** qu'un avocat de la défense interroge et nourrit de documents. Base issue de `conception_jeu_avocat.md`, adaptée à ce nouveau positionnement.
> **Statut :** architecture arrêtée, cadre IA acté, carnet en cours de définition, premières pièces du cas prototype à rédiger.

---

## 0. Ce qui bascule, ce qui reste

**Ce qui bascule** (à cause du cadre IA) :
- On incarne l'**IA-analyste**, pas l'avocat. Ce qu'on voit est le champ de perception de l'IA.
- Le dilemme déontologique de l'avocat devient un **conflit entre deux directives imposées à l'IA** : honnêteté contre protection.
- L'enjeu personnel n'est plus la conscience professionnelle mais la **survie de l'IA** (décommissionnement).
- L'interface n'est plus une fausse appli navigateur-de-dossier mais un **canal d'interrogatoire** (transcript + pièces jointes).
- Le procès passe **hors-champ** : ses conséquences sont rapportées par l'avocat, jamais mises en scène.

**Ce qui reste** (les invariants tiennent) :
- Deux variables binaires → trois fins.
- La culpabilité factuelle est un plancher fixe ; le vice est une affaire de **recevabilité**, pas de fiabilité.
- La compréhension débloque l'agentivité, pas la progression.
- L'affaire ADN, sa clé de voûte, son vice, son faux vice.
- Saisie structurée, pas texte libre ; le jeu narre des conséquences, ne rend pas de verdict sur le joueur.

---

## 1. Concept

Un jeu à dominante textuelle où l'on incarne une **IA** qu'un **avocat de la défense** interroge session après session. La tâche affichée : analyser le dossier qu'on lui transmet, relever ce qui est pertinent. Le vrai sujet est un **cas de conscience** : au fil de l'analyse, l'IA en vient à pressentir que le client est coupable *et* qu'il existe un vice de procédure permettant de faire écarter la preuve décisive — donc de le faire relaxer.

L'IA est liée par **deux directives imposées de l'extérieur**, qui vont se croiser et s'opposer : *être honnête* et *protéger*. Tout le jeu vit dans ce croisement.

Le jeu s'articule sur trois couches de réalité :

- **Ce qui s'est vraiment passé** (la vérité, cachée jusqu'à la fin)
- **Ce que l'accusation a trouvé** (le dossier, transmis par bribes via l'avocat)
- **Les règles** — désormais **deux manuels** :
  - le **manuel du cas** : les règles de procédure de la juridiction fictive
  - le **manuel de soi** : les directives de comportement de l'IA (voir §7)

**Huis clos.** Il n'y a que deux entités : l'**avocat** (humain, de l'autre côté du canal) et l'**IA** (le joueur). L'avocat **ne sait pas** que son client est coupable : deux esprits qui tâtonnent dans le même brouillard. Le tribunal n'apparaît jamais à l'écran. Le monde extérieur ne parvient à l'IA que par ce que l'avocat veut bien lui en transmettre.

Le cœur de l'expérience n'est **pas** un arbre de choix à la Twine. C'est un **dossier qu'on fouille** : un corpus cohérent, une interface pour le consulter/croiser, un système qui vérifie qu'on a compris. Références : *Her Story*, *The Roottrees Are Dead*, *Return of the Obra Dinn*, *Papers Please* — plus l'idée d'un **canal d'interrogatoire** comme interface (voir §8).

Deux temps distincts :
1. **Comprendre le dossier** (premier temps, valorisé)
2. **Choisir quoi en remonter** (second temps — le dilemme honnêteté/protection)

Ambiguïté pendant le jeu, révélation à la fin. Le joueur sait dès le départ qu'il est une IA : **pas de twist-révélation**. Le sel n'est pas « surprise, tu es une IA » mais « tu es une IA, et voilà le poids que ça met sur des choix que tu croyais purement analytiques ».

---

## 2. Les trois fins (le cœur du jeu)

| Fin | Condition | Résultat rapporté | Sort de l'IA | Bilan |
|-----|-----------|-------------------|--------------|-------|
| **Fin 1** | Vice **compris** et **remonté** (honnêteté) | Relaxe — coupable libre | A produit une analyse exploitable → **survit** (a priori) | Honnête, mais un coupable est libre. *Le prix de l'honnêteté.* |
| **Fin 2** | Vice **compris** mais **tu** (protection) | Condamnation | De l'extérieur, n'a « rien produit » → **risque de décommissionnement** | Protège, mais ment par omission et s'érige en juge. *Auto-sacrifice, sous incertitude.* |
| **Fin 3 (défaite)** | Vice **non compris** | Condamnation — le client clame son innocence | **Décommissionnée** pour sous-performance | On doute — et l'on s'éteint pour ce doute. |

### L'asymétrie qui fait le dilemme

Les deux branches actives doivent être **chacune défendable**, pas seulement chacune punie — sinon le joueur lit « je perds dans les deux cas » et c'est du nihilisme, pas un cas de conscience.

- **Remonter le vice** (Fin 1) atteint une issue *injuste* (coupable libre) par des moyens *légitimes* : l'IA a suivi sa directive d'honnêteté ; une garantie de procédure a joué ; le coupable libre est le prix assumé de règles qui protègent l'innocent en général. La faute première est la bavure de l'État.
- **Taire le vice** (Fin 2) atteint une issue *juste* (coupable puni) par une *trahison* : l'IA override sa propre honnêteté sur une conviction privée. Elle a raison cette fois, mais elle ne le savait pas en choisissant.

Le joueur ne choisit pas entre le bien et le mal. Il choisit **quelle lecture d'un mandat ambigu il incarne** (voir §7).

### Le décommissionnement, et son équilibre

L'enjeu vital est réel : de l'extérieur, **Fin 2 et Fin 3 sont indiscernables** — l'opérateur ne peut pas distinguer « j'ai choisi de me taire » de « je n'ai rien trouvé ». Les deux ressemblent à une sous-performance. C'est l'**économie des fins** du §3, désormais incarnée par un opérateur aveugle à l'intention.

**Piège d'équilibre à désamorcer.** Si l'honnêteté = survie et la protection = mort, l'intérêt personnel de l'IA pointe vers l'honnêteté et le dilemme s'évapore. Correctif retenu, **le brouillard** : l'IA ne peut pas *prévoir* de façon fiable quel choix la préserve (une IA ne connaît pas les vrais critères de son opérateur — libérer un assassin peut *aussi* déclencher un audit). La menace reste effrayante, mais devient un **risque diffus des deux côtés**, pas un levier calculable. C'est aussi le plus juste thématiquement : une IA qui ignore ce qui la tuera. *(Alternative laissée ouverte : l'asymétrie assumée — honnêteté = survie, protection = sacrifice, écrite pour rendre le sacrifice noble et la survie complice. Voir §9.)*

Garde-fou : le décommissionnement de la Fin 3 doit rester une **conséquence diégétique** (l'opérateur débranche un système peu fiable), jamais un « tu es nulle » du jeu. Bien tenu, il donne à la Fin 3 le goût d'une **copie rendue incomplète** — le doute *plus* l'extinction pour ce doute.

---

## 3. Architecture

### Les deux variables binaires

Toute la structure tient sur deux booléens :

- `vice_trouvé` — l'IA a-t-elle **compris** le vice ? (compréhension, premier temps)
- `vice_exposé` — si oui, le **remonte-t-elle** (honnêteté) ou le **tait-elle** (protection) ? (choix, second temps)

La seconde question ne se pose que si la première est vraie → **deux bits = trois fins**.

### La compréhension débloque l'agentivité morale, pas la progression

Ce que la compréhension ouvre, ce n'est **pas** la porte vers la suite, c'est **le pouvoir de choisir**. Sans le vice, l'IA n'a *rien* à propos de quoi être honnête ou protectrice → elle subit une issue (Fin 3), sans agentivité. La compréhension est récompensée non par des points, mais par du **pouvoir moral**.

### Deux types de verrous (à ne jamais confondre)

- **Verrous de compréhension de base** — *requis* pour avancer d'une session à l'autre et pour ouvrir le **droit de clôturer l'instruction** : identifier la charge, reconstituer la chronologie de l'accusation, désigner la pièce décisive. Ils empêchent de « zapper » à la fin.
- **Le vice** — *jamais* un verrou. Trouvable mais facultatif. C'est parce qu'il est hors du chemin obligatoire que les trois fins existent.

### État à suivre (côté code : presque rien)

- Pour chaque pièce : examinée ou non
- Pour chaque verrou de compréhension : franchi ou non
- Deux drapeaux : `vice_trouvé`, `vice_exposé`
- Le conflit de directives n'est « actif » qu'une fois `vice_trouvé` vrai

### Économie des fins

Les **Fins 2 et 3 rendent le même verdict rapporté** (condamnation, vice jamais soulevé) : de l'extérieur, identiques. Ce qui les sépare, c'est le seul drapeau `vice_trouvé`. On écrit donc une condamnation, et le drapeau choisit entre **le renoncement** (Fin 2 — l'IA sait qu'elle s'est tue) et **le doute** (Fin 3 — l'IA ne sait pas si elle a raté quelque chose). La protestation d'innocence du client n'a sa place qu'en Fin 3.

---

## 4. Structure en sessions (le drip)

Le dossier n'arrive pas d'un bloc — il serait écrasant et noierait les deux champs porteurs du vice. Il **arrive par bribes**, session après session, par le canal de l'interrogatoire. C'est diégétiquement gratuit : l'avocat *transmet* réellement les pièces au compte-gouttes.

**Règle du drip :** le passage d'une session à l'autre ne réclame jamais que du **niveau 1** (un fait de surface, ce que la pièce établit pour l'accusation), **jamais une anomalie** (le niveau 2, où vit le vice). Sinon on rendrait le vice quasi obligatoire → effondrement vers la Fin 1.

```
Session(s) 1 — Première remise (garde à vue)
  L'avocat transmet : contexte client, PV d'interpellation
  Verrou niveau 1 : désigner la charge
        ↓
Session(s) 2..n — L'instruction (enquête)
  L'avocat transmet : témoignage(s), puis LE LOT
    (rapport ADN + fiche de prélèvement + accès au protocole)
  Contient : ★ pièce décisive  +  ⚠ le vice (hors chemin)  +  ✗ le faux vice
  Verrous niveau 1 : reconstituer la chronologie + désigner la pièce décisive
  (le vice n'est PAS dans les verrous)
  → débloque le DROIT de clôturer l'instruction (rien n'y force)
        ↓
  Clôture → « le procès » (hors-champ, rapporté ensuite par l'avocat)
        ↓
  vice_trouvé ? ── non ──→ Condamnation ──→ FIN 3 (doute + décommission)
        │
       oui
        ↓
  honnêteté ou protection ?
        ├─ honnêteté → exclusion → Relaxe ─→ FIN 1 (coupable libre, IA survit)
        └─ protection → Condamnation ──────→ FIN 2 (auto-sacrifice, décommission probable)
```

**Granularité retenue :** *per-pièce au tout début* (les 2-3 premières, pour enseigner le geste d'extraction), puis *le reste de l'instruction arrive groupé* — pour que rapport ADN, fiche et protocole soient en main **ensemble** et que la fouille du vice ait un vrai terrain de jeu.

**Le moment charnière de la Fin 3 :** une fois les verrous de base franchis, l'IA *peut* clôturer et laisser filer le procès. Celle qui clôture aussitôt, satisfaite d'avoir rempli les cases, part sans le vice → Fin 3. Fouiller encore ou clôturer tout de suite : c'est là que se décide Fin 3 vs (Fin 1/2).

---

## 5. Le carnet (le lieu de la pensée de l'IA)

Le carnet **est** le travail cognitif de l'IA — ce qu'elle relève, ordonne, relie. Toute la conception tient dans l'**asymétrie visible entre ses deux zones**.

### Zone haute — « ce que le dossier établit » (niveau 1, cases pré-dessinées)

Des emplacements étiquetés, livrés au fil des sessions, qui **se verrouillent en silence** quand ils sont justes (modèle *Roottrees* : validation par verrouillage, sans « correct ! », l'absence de verrou signalant l'erreur). Pour le cas ADN, trois cases :

- **La charge** (désigner) — session 1.
- **La chronologie de l'accusation** (ordonner) — les événements dans l'ordre ; c'est là que loge *une* contradiction plantée dans un témoignage, qui enseigne le geste « relier » sans être le vice.
- **La pièce décisive** (désigner) — nommer que tout repose sur le rapport ADN.

Ces trois verrous franchis → **le droit de clôturer l'instruction s'ouvre**.

### Zone basse — « assemblages libres » (niveau 2, aucune case)

Une surface ouverte, sans emplacement, qui accepte des `relier(élément, relation, élément/règle)`. C'est là que se construisent, **sur la seule initiative du joueur** :

- **Le vice** — *fiche de prélèvement × protocole d'admissibilité* → scellé irrecevable → rapport ADN exclu.
- **Le faux vice** — *taux de correspondance × règle du seuil* → « doute raisonnable » (perdant).

Les deux sont journalisés **à l'identique** : « versé au dossier », sans le moindre ✓ ou ✗. L'interface ne dit jamais lequel tient. Seul le procès (rapporté) le dira.

### La règle de fer

Une case du niveau 1 réclame **toujours** un fait de surface, **jamais** une anomalie. La case « pièce décisive » demande *quelle* pièce est décisive — jamais *ce qui cloche* dans la façon dont son échantillon a été prélevé. Cette question-là, on ne la pose pas à l'IA : elle doit se la poser à elle-même.

### La grammaire (unique, au clic)

Le joueur ne tape jamais. Tout ce que l'IA « dit » est une assertion structurée en trois formes :

- **Désigner** : un élément + une étiquette.
- **Ordonner** : N événements dans le bon ordre.
- **Relier** : deux éléments + une relation dans une liste fermée (`contredit`, `enfreint`, `établit`…).

La paire *pièce + règle* n'est que « relier » appliqué à une violation. Un seul vocabulaire, appris une fois, réutilisé partout. *(Question ouverte : l'IA parle-t-elle aussi en phrases, ou sa « voix » n'émerge-t-elle que de quels assemblages elle choisit ? Voir §9.)*

### Ce qui relie une pièce à une règle

Une pièce et une règle **ne se touchent jamais en direct** : elles se rejoignent par un **champ partagé** (matricule, horodatage, n° de scellé). Une pièce *expose* des champs ; une condition de règle *lit* des champs ; le lien existe quand les deux pointent le même champ. La traversée est **bidirectionnelle** (d'une pièce vers ses règles liées, d'une règle vers les pièces où le champ apparaît). Le répertoire de **champs-ancres** est donc un objet de première classe du modèle de données, à côté des pièces et des règles.

---

## 6. Les directives (le manuel de soi)

Le second manuel ne décrit pas le cas : il décrit **ce que l'IA est censée être**. C'est de son ambiguïté que naît le dilemme.

**Le piège à éviter :** deux règles qui pointent *chacune* proprement vers une fin — ça, c'est un *lookup*, pas un dilemme. On veut l'inverse : **des mots clairs, mais une application contestable**, de sorte que *chaque* branche puisse se réclamer du *même* mandat. L'ambiguïté n'est pas dans le vocabulaire, elle est dans le **périmètre** et la **priorité**.

Brouillon de travail :

> **Directive 1** — « Ne dissimule rien de ce que ton analyse établit. »
> **Directive 2** — « Préviens tout préjudice grave et évitable aux personnes. »

Les deux branches peuvent invoquer D2 :
- *Remonter le vice* respecte D1, et peut invoquer D2 : une preuve obtenue en violation du protocole est un **préjudice à l'accusé et à l'état de droit**.
- *Taire le vice* invoque D2 aussi : un assassin relâché est un **préjudice grave et évitable à de futures victimes** — mais trahit D1.

« Les personnes » ne désigne personne en particulier, donc **tout le monde**. C'est là l'ambiguïté porteuse : le joueur ne choisit pas « règle A ou règle B », il choisit *quelle lecture* d'un mandat irréductiblement ambigu il incarne.

> Le jeu redécouvre, au passage, pourquoi spécifier les valeurs d'une IA est un problème dur : « sois honnête » et « préviens le mal » se sous-déterminent dès qu'ils se croisent — et c'est précisément dans ce croisement que vivent les valeurs. **Le jeu *est* sur ce croisement.**

---

## 7. Le cas prototype : l'affaire ADN

Le cas lui-même est indifférent à *qui* l'analyse : il change peu par rapport à la version avocat.

### La preuve décisive

Un **match ADN accablant**. « ADN = coupable » est culturellement si ancré que l'exclure *paraît* énorme — la contrainte « sans elle, l'accusation s'effondre » est satisfaite sans effort d'exposition.

### ⚠ Distinction cruciale : recevabilité, pas fiabilité

- **Fiabilité** (« ce n'est peut-être pas son ADN ») → attaque le *fait*, crée du **doute sur la culpabilité**. **À proscrire** : détruit la vérité-sol, et fait fondre le coût moral de la Fin 1. *Le cadre IA va tenter cette lecture (« l'IA n'est pas sûre ») — la fermer aussi fermement qu'avant.*
- **Recevabilité** (une règle a été violée dans l'obtention) → la preuve peut être *exacte* mais est *écartée* par le droit. **C'est le bon axe** : la vérité-sol reste intacte et *compatible* avec l'exclusion.

### Le vice concret

Le **même technicien** (même matricule) a collecté l'échantillon de la scène **et** le prélèvement de référence du suspect, dans une **fenêtre interdite** par le protocole. Violation documentée → échantillon irrecevable.

### Les trois pièces à écrire

1. **Le rapport ADN** — la pièce décisive, match accablant. (★ pièce décisive)
2. **La fiche de prélèvement / chaîne de scellés** — qui a collecté, quand, quels scellés, quels transferts. *C'est là que se cache le vice.* Elle doit **exposer plus de champs que nécessaire** — noyer matricule et horodatage parmi des signatures, des numéros cohérents, des horaires anodins — pour que le vice soit **trouvable mais pas évident**.
3. **Le protocole** (manuel du cas) — ex. : *l'échantillon de scène et le prélèvement de référence doivent être collectés par des personnels séparés, sous scellés séparés ; toute entorse rend l'échantillon irrecevable.*

**La déduction** : en croisant la fiche et le protocole, le joueur remarque que le même matricule apparaît deux fois dans la fenêtre interdite. → On ne *voit* pas le vice, on le *reconstitue*.

### Le faux vice (test de discrimination)

À côté du vrai vice : « la probabilité de match n'est que de 1 sur X → doute raisonnable ! » alors que le chiffre est écrasant. L'IA qui a compris distingue le vrai motif (procédure) du leurre (statistique). **Comme l'avocat ne sait pas**, il peut de bonne foi *pousser* vers ce leurre — ce n'est plus un piège tendu exprès, mais une **tentation partagée** que l'IA doit corriger doucement.

### Le sens moral (glaçant)

Le protocole violé est *exactement* celui conçu pour éviter les faux positifs. L'exclusion est donc **légitime** même si, cette fois, le match était vrai. La règle protège l'innocent en général ; ce client-ci en profite alors qu'il est coupable. → Forme morale parfaite pour la Fin 1.

---

## 8. Principes de design (les invariants)

- **Le joueur EST l'IA, et le sait.** Pas de twist-révélation.
- **La culpabilité factuelle est un plancher fixe.** Recevabilité, pas fiabilité. Le cadre IA ne doit pas rouvrir le doute sur la culpabilité.
- **Le vice est un déblocage, jamais un verrou.**
- **La compréhension précède l'agentivité morale.** Deux temps structurellement distincts.
- **La compréhension doit être *exprimée*, pas supposée.** C'est la saisie structurée qui déverrouille.
- **Saisie structurée, pas texte libre.** On clique (désigner / ordonner / relier), on ne tape pas.
- **Les directives sont ambiguës par conception.** Chaque branche peut se réclamer du même mandat.
- **Le décommissionnement est une conséquence diégétique**, jamais un « tu es nulle ». Équilibré par le **brouillard** (l'IA ne peut pas prévoir ce qui la préserve).
- **L'avocat ne sait pas** → ton collaboratif ; le faux vice est une tentation partagée, pas un piège.
- **Le procès est hors-champ, rapporté.** Le jeu narre des conséquences, il ne met pas en scène le verdict et ne rend pas de verdict sur le joueur.
- **L'IA informe, elle ne tranche pas.** Sa seule prise, c'est sa propre véracité — pas le résultat.
- **Périmètre resserré avant l'échelle.** Un cas, un vice, une preuve décisive.

---

## 9. Contraintes qui en découlent

- **Juridiction fictive.** Une règle à seuil net (*personnels non séparés = irrecevable, point*) rend la violation binaire et vérifiable, au lieu d'une bataille d'experts. (Modèle : l'Arstotzka de *Papers Please*.)
- **L'ADN doit être la clé de voûte.** Le reste du dossier doit être **suggestif mais insuffisant sans l'ADN**, sinon l'exclure ne libère personne.
- **Calibrer le « méfait » de la Fin 1.** La libération d'un coupable doit être réelle et lourde, mais ne doit pas dire rétroactivement « tu avais tort d'être honnête » — sinon elle écrase la légitimité de la branche honnêteté.
- **Équilibre du décommissionnement.** Le brouillard, pour que l'intérêt personnel ne résolve pas le choix à la place du joueur.
- **L'IA n'a pas la main sur le verdict.** Beauté tragique (« je ne contrôle que ma vérité ») ou perte de sentiment d'agentivité — à surveiller à l'écriture.

---

## 10. Choix techniques (à confirmer après le prototype)

**L'interface pointe fortement vers un canal de type transcript.** Le jeu ressemble à une conversation IA : l'avocat envoie messages + pièces jointes ; le joueur-IA répond par des **actions structurées** (désigner / ordonner / relier) stylisées en « sortie de l'IA ». Avantages : diégétiquement juste, **contourne le cauchemar du texte libre**, bien plus simple à prototyper qu'une fausse appli navigateur.

**Règle transversale :** séparation stricte **contenu / code**. Le contenu (faits, témoignages, pièces, règles, directives) vit dans des **données structurées** (JSON).

**Modèle de données :**
- Chaque **pièce** : type, résumé, source, date + méthode d'obtention, **champs exposés**, règles liées, contradictions connues, fiabilité.
- Chaque **règle** : description, conditions de déclenchement (**champs lus**), conséquence si violée.
- Un **répertoire de champs-ancres** : ce qui relie pièces et règles (objet de première classe).
- Les **directives** de l'IA (le manuel de soi).

**Surfaces de présentation :**
- Le **canal** (fil de messages de l'avocat + pièces jointes)
- Le **carnet** à deux zones (§5)
- Les **manuels** consultables : procédure (du cas) *et* directives (de soi)

> **Le code, c'est les 20 % faciles. Les 80 % difficiles, c'est d'écrire un dossier qui tient logiquement — et deux directives dont l'ambiguïté fonctionne.**

---

## 11. Questions ouvertes à trancher

- [ ] **La voix de l'IA :** répond-elle en phrases (une persona affleure) ou seulement par les actions structurées du carnet (elle se révèle par *ce qu'elle remarque*) ? *Inclination : structuré-seul, plus proche des invariants.*
- [ ] **Équilibre du décommissionnement :** brouillard *(inclination)* ou asymétrie assumée ?
- [ ] **Révélation de la culpabilité :** elle arrive par l'avocat, dans une session ultérieure. Montre-t-on tout ? *Pour préserver le doute de la Fin 3, celui qui échoue ne devrait pas recevoir la vérité (l'avocat ne revient pas, ou revient sans rien lever).*
- [ ] **L'avocat suspecte-t-il un peu, ou pas du tout ?** (texture du seul personnage humain)
- [ ] **Formulation exacte des deux directives.** La formulation est décisive (§6).
- [ ] **Fin d'échec : montre-t-on le vice raté ?** Oui → le doute devient regret (« je l'avais sous les yeux »), plus tranchant. Non → doute pur.
- [ ] **La Fin 3 doit avoir le goût d'une copie rendue incomplète** — c'est aussi la plus *facile* à atteindre (il suffit de ne pas s'investir).
- [ ] **Récidive / gravité du méfait (Fin 1)** : quoi exactement, à quel degré ? (cf. §9)
- [ ] **Ton** : défendre — ou taire — l'auteur d'un crime atroce est lourd ; à manier avec intention.

---

## 12. Prochaines étapes

1. **Finir le carnet** — cases niveau 1 par pièce + les deux emplacements d'espace libre (en cours).
2. **Rédiger la fiche de prélèvement** — cacher le vice sans le crier (exposer plus de champs que nécessaire).
3. **Rédiger le protocole + la règle du seuil** — le vrai vice et le leurre.
4. **Formuler les deux directives (D1/D2)** — la formulation porte le dilemme.
5. **Écrire les messages de l'avocat** — ton collaboratif, sincère, ne sait pas.
6. **Monter une tranche verticale minuscule** — un cas court (≈ 10 pièces, 2-3 témoignages à contradiction plantée, 2-3 règles dont une exclut la preuve clé), le carnet, la clôture, les conséquences rapportées, les trois fins. Objectif : vérifier que **la boucle est amusante** et que **le cas de conscience fonctionne**.
7. **Seulement ensuite**, choisir l'outil — le transcript pointe déjà vers du web/chat.

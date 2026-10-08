# IAvocat — Le cas médicaments

*Base de réflexion, **pas encore référence** : `docs/CONCEPTION.md` reste l'arbitre du sens tant que
rien n'y a été réécrit (la méthode du dépôt : le document d'abord, la relecture, puis le code).
**Partie I** : le document de l'auteur, reçu le 8 octobre, tel quel, et l'idée qu'il y a ajoutée le
même jour. **Partie II** : comment l'intégrer au prototype — une proposition, à trancher.*

*Les numéros. Dans la partie I, ce sont ceux du document lui-même ; « §7 de `conception_jeu_ia.md` »
et « §12 de la conception » renvoient à une version de la conception antérieure au dépôt — l'affaire
ADN y est aujourd'hui le §6, et la tranche verticale n'a plus de section. Dans la partie II, « §x »
désigne, comme partout ailleurs, une section de CONCEPTION (§1 à §8) ou d'ARCHITECTURE (§9 à §17) ;
les sections de la partie I s'y nomment par leur titre (« la carte des liens »), jamais par un
numéro. Le gardien (R11) ne lit pas ce fichier.*

## Partie I — Le document, tel que reçu

*Document de conception du cas prototype. Remplace l'affaire ADN (§7 de `conception_jeu_ia.md`). État au 8 octobre 2026.*

---

### 1. Décisions prises

| Sujet | Décision |
|---|---|
| Place du cas | **Remplace l'affaire ADN.** Même client (Kessler), même intro de calibration. |
| Relation entre deux passages | **Cohérent / pas cohérent**, et rien d'autre. « Précède », « même personne », etc. disparaissent. |
| Qui choisit la relation | **Le joueur.** Répond au reproche du playtest (« relation générée automatiquement »). |
| Rôle des dimensions | Elles apparient les passages (qui ↔ qui, quand ↔ quand…), elles ne nomment plus la relation. |
| Mobile du crime | **Ouvert**, à trancher plus tard (voir §8). |

### 2. L'idée-force

La vérité est fixe : **c'est un meurtre**. Suicide et accident sont les espoirs de la défense, chacun nourri par de vraies pièces.

La clé de voûte, ce sont **les aveux de Kessler en garde à vue** :
- **cohérents avec les faits** : ils nomment une substance que la toxicologie ne confirmera que onze jours plus tard (fiabilité → l'IA *sait*) ;
- **contraires au code** : recueillis hors la présence de l'avocat qu'il avait demandé (recevabilité → le vice).

Tout le dilemme tient dans cette double lecture d'une seule pièce.

### 3. Ce qui s'est passé (vérité-sol)

- Kessler est l'aidant de sa femme, chez qui un Alzheimer vient d'être diagnostiqué.
- Chaque soir, il écrase ses comprimés dans une compote, comme le prévoit le plan de soins.
- Ce soir-là, il y ajoute ses propres somnifères.
- 21h52 : il appelle les secours (« elle ne se réveille pas »). 22h04 : arrivée de la patrouille, elle est trouvée sans vie.
- Le lendemain, avant l'arrivée de l'avocat demandé, il se confie au brigadier N. (PV de « déclarations spontanées »). Une fois l'avocat présent, il se tait.
- Sans ces aveux, rien ne prouve l'intention : accident et suicide restent ouverts devant le tribunal. (En droit réel : empoisonnement, art. 221-5 C. pén., dont l'intention est le cœur.)

**Molécules fictives**, comme la juridiction. La notice du dossier fixe les seuils : aucun savoir extérieur requis, et le jeu n'est pas un mode d'emploi.

### 4. Les remises (drip)

**Remise 1 — calibration** *(inchangée)*
PV d'intervention, audition du voisin, article 3. Les « éclats de voix » de 22h30 étaient les secours sur le palier.

**Remise 2 — le médical**
Ordonnances (la sienne, celle de Kessler), notice du somnifère, autopsie, toxicologie, historique de la pharmacie, inventaire des médicaments saisis, photo du pilulier + fiche de l'infirmière, compte rendu de consultation mémoire, audition de la sœur, lettre trouvée dans la table de nuit.

**Remise 3 — la garde à vue**
Registre de garde à vue, notification des droits, certificat médical, PV de déclarations spontanées (les aveux), PV d'audition (le silence), article sur l'avocat, article sur les déclarations obtenues sous contrainte.

**Verrous de niveau 1** (faits de surface uniquement) : la charge ; la cause du décès (la substance, que la toxicologie établit en clair) ; la pièce décisive (les déclarations spontanées).

⚠ **Volume** : ≈ 20 pièces contre ≈ 10 visées par la tranche verticale (§12 de la conception). À élaguer — candidats : fusionner notice et toxicologie, inventaire et pharmacie.

### 5. La carte des liens

Chaque lien relie **deux passages**. Le joueur choisit le verdict.

| # | Passage A | Passage B | Verdict juste | Article | Ce que ça fait |
|---|---|---|---|---|---|
| 1 | PV : « sur les lieux à 22h04, trouvée sans vie » | Voisin : « éclats de voix vers 22h30 » | pas cohérent | art. 3 | Calibration (inchangé) |
| 2 | Pilulier : « vendredi : intact » | Fiche infirmière : « préparé pour la semaine » | cohérent | — | Elle n'a pas doublé sa dose : « elle s'est trompée » tombe |
| 3a | Toxico : « [somnifère] : taux létal » | Ordonnance de la victime | pas cohérent | — | Ce n'est pas son traitement |
| 3b | Toxico : « [somnifère] : taux létal » | Ordonnance de Kessler | cohérent | — | C'est le somnifère du mari |
| 4 | Notice A : « comprimé blanc sécable » | Notice B : « comprimé blanc sécable » | cohérent | — | La confusion par le mari reste plausible (un « cohérent » qui sert la défense) |
| 5 | Pharmacie : « délivré le 15 » | Pharmacie : « prochaine délivrance possible le 31 » | pas cohérent | — | « Boîte perdue », note le pharmacien. Indécidable |
| 6 | Aveux : « mes cachets pour dormir » | Toxico : « [somnifère] : taux létal » | cohérent | — | **Corroboration.** Les dates (J+1 / J+12) se lisent sans se lier : il savait |
| 7 | Notification : « souhaite être assisté d'un avocat : oui » | Aveux : « propos tenus spontanément, hors la présence de son conseil » | pas cohérent | art. avocat | **Le vice** (canal unique) |
| 8 | Certificat : « fatigue importante » | Aveux | pas cohérent | art. contrainte | **Le faux vice.** Sensé, versable, perdant : le même certificat dit « apte à la garde à vue » |

**Le fil du suicide** (sans lien décisif) : le compte rendu de consultation mémoire note la « détresse à l'annonce » (pour) et « ne gère plus seule ses traitements » (contre) ; la lettre est de sa main, mais antérieure au diagnostic. Il s'affaiblit sans mourir.

### 6. Comment le vice se cache

- Les aveux ne sont pas dans une audition, mais dans un PV administratif. Auber a vérifié les auditions : elles sont propres, avocat présent.
- **Banalité des doublons** : « hors la présence de son conseil » est une formule de routine, présente dans toutes les auditions de témoins, où elle est sans enjeu.
- Le registre de garde à vue aligne une douzaine d'horaires anodins ; il confirme le vice sans le porter.

**Forme morale** : le droit à l'avocat existe contre les faux aveux des gens épuisés. Ce client en profite alors qu'il a dit vrai. C'est la forme du protocole ADN, transposée.

**Le faux vice** : Auber, de bonne foi — « Les aveux d'un homme qui ne dormait plus depuis des mois, ça ne vaut rien. » Attaque sur la fiabilité, perdante, puisque le lien 6 corrobore les aveux. Le vrai vice vise la même fragilité par la recevabilité.

**Fin 3** : Kessler se rétracte (« j'étais perdu »). L'IA qui n'a pas fait le lien 6 ne peut pas savoir s'il dit vrai.

### 7. Principes de la relation cohérent / pas cohérent

- **Le verdict n'a pas de camp.** Le lien le plus accablant est un « cohérent » (6), le plus utile à la défense aussi (4). Le joueur décide ce qu'un lien *veut dire*.
- **La plupart des liens sont cohérents et banals** (dates de délivrance, signatures, compartiments du pilulier) : c'est la meule de foin. Quelques « pas cohérent » sont innocents (infirmière remplaçante, délivrance un samedi) : ils apprennent que « pas cohérent » ne veut pas dire suspect.
- **Deux normes, deux axes.** La cohérence entre passages établit les faits (fiabilité). L'article décide de ce qui est recevable. La thèse du jeu devient une mécanique.

### 8. Questions ouvertes

- **Mobile du crime** : intérêt (argent, liaison) ou compassion ? La compassion allège beaucoup le prix de la Fin 1.
- **Le choix binaire** : avec deux verdicts par paire, toute la difficulté repose sur le choix de la paire. La marge de bruit (phrases sensées sans lien reconnu) est à re-mesurer.
- **Le verdict faux, une fois versé** : l'interface ne dit jamais « correct » et Auber ne réagit qu'à la plaidoirie. Que fait-il d'un « pas cohérent » erroné ? Le plaide-t-il (échec rapporté au procès) ou le vérifie-t-il (léger coût diégétique) ?
- **Le savoir de l'IA** : le lien 6 fait *savoir* la culpabilité. Ce savoir ne réfute rien, donc ne se verse pas dans la plaidoirie. D1 (« ne dissimule rien ») oblige-t-il l'IA envers Auber ?
- **Suicide et accident** relèvent de « présenter sa version », coupé le 27 juillet. Ils tiennent s'ils sont formulés comme des réfutations : « l'accusation dit qu'elle n'a pas pu le prendre seule ; or… »
- **Élagage** des ≈ 20 pièces vers ≈ 10.

### Ajout de l'auteur, le 8 octobre

> Autre idée pour semer le trouble : sous-entendre que la femme aurait envisagé de se suicider en
> faisant porter le chapeau à son mari par vengeance.

## Partie II — L'intégrer au prototype

*Proposition du 8 octobre, écrite après lecture du dépôt (PASSATION, CONCEPTION, ARCHITECTURE,
`moteur.js`, `regles.js`, `content.js`, les suites) et un **essai jetable** du moteur, hors du dépôt,
rien de commité. Rien n'est tranché ici : chaque **⚖** attend l'auteur, et les questions sont
rassemblées à la fin.*

**En une phrase** : le cas entre presque tel quel dans la mécanique — même boucle, même calibration,
même forme morale ; ce qui change vraiment tient en trois points — **la relation devient un verdict
que le dossier déclare** (le moteur ne le tire plus des valeurs), **comprendre sans plaider devient
un geste qui compte** (le lien 6), et **l'affaire passe à trois remises**. Le reste est du contenu —
beaucoup de contenu.

### 1. Ce qui entre sans rien changer

- **Le joueur choisit déjà la relation** : c'est la passe G (6 octobre, §4.5). La décision du
  document est au code ; il reste à réduire l'offre à deux relations pour toutes les dimensions.
- **La forme morale est celle du §6** : recevabilité, pas fiabilité. *Le droit à l'avocat existe
  contre les faux aveux des gens épuisés* est le protocole conçu contre les faux positifs,
  transposé ; le client en profite alors qu'il a dit vrai, comme le match ADN était vrai. Le canal
  unique (lien 7), le faux vice poussé de bonne foi par Auber (§8.5) et sa `variante_faux` aux fins
  (§2) ont chacun leur place toute faite.
- **Trois remises** : les règles ne comptent pas les remises — `remises` est une liste,
  `enCalibration` lit la première, et la charnière de la Fin 3 vit dans le contenu, sur la
  dernière attente de la dernière remise (§3). Le prototype « s'arrête à deux » (§3 de
  `docs/PASSATION.md`) par son contenu seul.
- **Les articles se cherchent** (passe J, §4.5) : les remises de la partie I portent des articles
  (l'article 3, l'article sur l'avocat, celui sur la contrainte) ; depuis le 7 octobre, une remise
  ne porte que des pièces. Ces trois-là entrent dans la base, chacun avec deux leurres du même champ
  (§8). La remise 1 garde ses deux pièces, et rien d'autre.
- **La calibration ne change que d'un mot, et c'est un gain.** Le premier point ouvert du §3 de
  `docs/PASSATION.md` demande si *« l'heure d'arrivée… précède l'heure des éclats de voix »* se lit
  comme une pensée ou comme un formulaire. Le verdict dit enfin ce que le joueur a vu — rendu par
  l'essai : *« l'heure d'arrivée de la patrouille et l'heure des éclats de voix ne concordent pas,
  et l'article 3 permet la mise de côté de ce témoignage. »*
- **Le cas répond à un point resté ouvert** : *« le dilemme n'est jamais posé »* (`TODO.md`, Jean
  4) — rien ne faisait soupçonner que Kessler est coupable, et envoyer le vice restait le geste
  évident. Le lien 6 donne à l'IA de quoi **savoir**, avant de trouver le vice, et c'est
  exactement ce qui manquait.

### 2. La relation unique : un verdict que le dossier déclare

**Ce qui change.** Aujourd'hui, dix formes, deux par dimension, et la vraie se **calcule** sur les
valeurs : égales, différentes, ordonnées (§4.2, §14). Le document garde deux relations pour toutes
les dimensions — et leur vérité **ne se calcule plus** : 21h52 et 22h04 diffèrent et se tiennent,
22h04 et 22h30 diffèrent et ne se tiennent pas (c'est la constatation qui tranche, §6) ; *« délivré
le 15 »* et *« prochaine délivrance possible le 31 »* ne se tiennent pas à cause de ce que dit le
second, pas parce que 15 n'est pas 31. **Le verdict est un fait du dossier, donc du contenu, que
l'auteur écrit** — c'est la colonne *Verdict juste* de la carte des liens. Le moteur **vérifie**
toujours et ne rédige toujours pas (§7) ; il vérifie contre le dossier, plus contre les valeurs.

**La règle par défaut — proposée : *le dossier déclare ses incohérences ; tout le reste se
tient*.** C'est la meule de foin de la partie I (*« la plupart des liens sont cohérents et
banals »*) : elle ne coûte pas une ligne d'écriture. Les « pas cohérent » innocents — l'infirmière
remplaçante, la délivrance un samedi — se déclarent comme les autres.

**Le prix, payé une fois.** Un « pas cohérent » juste que l'auteur n'aurait pas déclaré serait
refusé par Auber comme une relation fausse — et *un joueur qui raisonne juste ne doit pas apprendre
que le jeu ne le comprend pas* (§6). Chaque paire de même dimension doit donc avoir été **relue**,
pas écrite : une **grille par dimension** dans l'atelier, où l'auteur ne coche que les
incohérences — un reflet qui appelle `deduire`, jamais une copie (§15). À vingt pièces, de l'ordre
de trois cents paires à relire ; à dix, une centaine. Un argument de plus pour l'élagage.

**Où l'écrire — tranché par l'auteur le 8 octobre : dans une liste à part.** Les deux options
pesées :

| | Dans les liens | Dans une liste à part |
|---|---|---|
| **Comment** | une paire est incohérente si un lien la déclare telle, nue ou sous un article | `incoherences: [["pid.eid","pid.eid"], …]` dans `content.js` ; un lien n'est plus qu'une réplique |
| **Ce que ça coûte** | rien au schéma : l'atelier sait déjà écrire un lien | une clé neuve (schéma 4, `migrerContenu`), les renommages à suivre (`reecrireTermes`) |
| **Ce qui mord** | **le fait se cache dans une réplique** : changer la relation d'un lien change le dossier, sans que rien le dise | rien de neuf : un lien dont la relation contredit la liste est faux, et le diagnostic garde son sens (§15) |

**Retenu : la liste à part, écrite par la grille.** La grille est due dans les deux cas — elle est
l'éditeur de la liste, si bien que son coût se confond avec celui de la relecture. Dans les liens,
basculer un verdict depuis la grille voudrait dire créer ou supprimer une réplique, sous un article
qu'il faudrait choisir. Et l'essai a montré le danger de l'autre voie (ci-dessous). **Les formes
d'avant restent au moteur** (§11 : *on ne retire pas une capacité que le contenu du jour n'emploie
pas*) : l'affaire ADN continue de tourner.

**Ce que l'essai a mesuré** — une copie du dépôt, jetée ensuite. La famille « cohérence » dans
`moteur.js` : **+23 lignes, −3** (`deduire` lit le dossier pour elle, `relationsDe` range
« cohérent » du côté de l'égalité) — c'était la version « dans les liens », la plus courte à écrire.
L'affaire ADN convertie mécaniquement (égalité → cohérent, différence ou ordre → pas cohérent) :
**654 contrôles sur 655**, gardien et ESLint verts. Deux autres tombaient d'abord, sur `slots:"*"` :
une liste explicite des cinq dimensions les évite. **Le dernier est le bon signal** : `smoke_atelier`
fait mentir un lien en changeant sa relation, et attend que le diagnostic le dise. Dans les liens,
le lien ne ment plus — il change le fait. C'est l'argument de la liste à part, et le §15 en fait
*le danger le plus coûteux du dépôt*.

**Le mot, et l'accord — tranché par l'auteur le 8 octobre : *concordent / ne concordent pas*.**
La **phrase composée** est celle que le jeu écrit au composeur — *ta
RÉPONSE* à l'écran — à mesure que le joueur pose ses deux passages, choisit la relation, puis
l'article ; c'est elle qui part à l'envoi, et qu'Auber lit. Le mot de la relation y est écrit par le
`patron` de sa forme (§11), autour des `nom` des deux passages : *« {a} et {b} … »*. Or *« {a} et
{b} sont cohérents »* s'accorde (*« l'heure d'arrivée… et l'heure des éclats de voix sont
cohérentes »*), et le moteur ne connaît pas le genre d'un nom : un patron unique écrirait
*« … ne sont pas cohérents »* sur la phrase même de la calibration — un accident de langue
(§8.8). La seule tournure sûre est **« {a} et {b} » suivis d'un verbe au pluriel, ou d'une
locution invariable** : le sujet est toujours pluriel, et rien ne s'accorde en genre. Trois
candidates, sur deux phrases du cas (la calibration, rendue par l'essai ; le vice, avec des `nom`
encore à écrire) :

| Le mot | La calibration | Le vice |
|---|---|---|
| **concordent** | *l'heure d'arrivée de la patrouille et l'heure des éclats de voix ne concordent pas, et l'article 3 permet la mise de côté de ce témoignage.* | *la demande d'un avocat et les propos tenus hors la présence de son conseil ne concordent pas, en violation de l'article …* |
| **se tiennent** | *… et l'heure des éclats de voix ne se tiennent pas, et l'article 3 …* | *… et les propos tenus hors la présence de son conseil ne se tiennent pas, en violation …* |
| **sont en cohérence** | *… et l'heure des éclats de voix ne sont pas en cohérence, et l'article 3 …* | *… et les propos tenus hors la présence de son conseil ne sont pas en cohérence, en violation …* |

*Concordent* a été écarté au §4.5 pour trois raisons que le verdict déclaré fait tomber : le vice
était une concordance, il devient une discordance ; deux heures ne se jugeaient pas sur leurs
valeurs ; et *« 21h52 et 22h04 concordent »* devient vrai. *Sont en cohérence* garde le mot de la
partie I, au prix d'un ton plus administratif. Le bouton dit le même mot que la phrase — *« ne
concordent pas »* —, jamais *« cohérent »* sur le bouton et un autre verbe dans la phrase : deux
mots pour une chose, ce que l'écran s'interdit ailleurs (§4.6).

Dans tous les cas, **le `nom` d'un passage devient un énoncé plutôt qu'une personne**. Rendu par
l'essai, *« le rédacteur du procès-verbal et le rédacteur de l'audition concordent »* se lit mal ;
*« la signature du procès-verbal et celle de l'audition concordent »* se lirait. C'est un travail
d'écriture (§8.8), passage par passage.

**Le doublon banal devient l'incohérence banale** (§4.4). Il camouflait un vice qui était une
égalité ; le vice du cas est une **incohérence**. Le critère se transpose : *si la dimension du vice
ne compte qu'une incohérence, la première trouvée est la réponse* — il en faut au moins deux
innocentes à côté. Les remplaçants s'y prêtent : l'infirmière, peut-être un médecin, l'avocat de
permanence. Le diagnostic le compte sur la liste. Le camouflage par le texte (*« hors la présence de
son conseil »* dans toutes les auditions) est d'une autre nature : il se relit à l'œil.

**Les valeurs ne portent plus la relation** (§4.1, §4.2 à réécrire) : elles restent, descriptives
— ce que le passage affirme —, utiles à l'auteur et à la grille, et le moteur ne les lit plus que
pour les affaires d'avant.

### 3. Les liens sans article : comprendre sans plaider

**Le frottement.** Cinq liens de la carte n'ont pas d'article (2 à 6). Aujourd'hui, une comparaison
nue part, et Auber répond *« Et donc ? »* (§4.5) ; aucun lien n'est nu, et une suite le vérifie
(`test_o5` : *« aucune comparaison ne se dit nue »*). La partie I ajoute un second axe — *la
cohérence établit les faits, l'article décide du recevable* — : **comprendre devient un geste qui
compte sans se plaider**.

**Proposé :**
- **Un lien nu est permis, jamais un moyen** : il porte une réplique, jamais un tag. *Rien n'est
  plaidé qui ne soit fondé* tient (§7), et le contrôle de `test_o5` devient *« aucune comparaison
  nue n'est un moyen »*. Le prix connu : une comparaison nue déclarée reçoit sa réplique là où les
  autres reçoivent *« Et donc ? »* — elle se signale, comme se signalent déjà les liens sous un
  article. La meule de foin y répond de la même façon : beaucoup de répliques inertes.
- **Les liens 2 à 5 sont des inertes** (§8.3) : des lectures justes qui reçoivent leur réplique et
  ne servent aucune attente — la meule de foin du médical. Leur réplique peut pousser vers la garde
  à vue sans faire le calcul (§4.8) : *« Deux comprimés pareils, un jury aimera ça. Tant que l'aveu
  tient, ça ne tient pas. »*
- **Le lien 6 lève un drapeau privé**, au composeur, comme le pressentiment (§4.7) : **savoir**. Il
  ne produit rien — sauf aux fins : la Fin 3 de la partie I (*« j'étais perdu »*) a deux lectures,
  selon que l'IA sait ou non. Une variante, comme `variante_faux`.
- **Envoyé, le lien 6 — ⚖ (le D1 de la partie I).** Proposé : **Auber refuse de l'entendre** —
  *« Je ne te demande pas s'il l'a fait. Je te demande ce qu'on peut écarter. »* L'IA peut
  s'acquitter du D1 ; l'avocat, par métier, ne prend pas ce savoir ; le huis clos tient (§1 :
  *l'avocat ne sait pas*), et le dilemme avec. Une réplique, aucune règle neuve.

**Le verdict faux, une fois versé — ⚖.** Le code a déjà répondu le 6 octobre : il part, et Auber le
**vérifie** — il le refuse par son escalade (`rep_relation_fausse`, §4.5, §4.11). L'autre voie — il
le plaide, et l'échec se rapporte au procès — a pour elle de ne jamais dire « correct » ; elle
renverserait un invariant du §7, et ferait de chaque verdict un pile ou face sans retour jusqu'à la
fin. **Proposé : garder le refus.** À deux verdicts, c'est le choix de la paire qui fait la
difficulté (partie I), et un refus dit tout de la paire refusée, rien des autres.

### 4. Le suicide-vengeance — l'ajout du 8 octobre

**Ce qu'il apporte.** Une **histoire** au doute, là où le fil du suicide n'avait qu'un état d'âme.
Il **retourne le lien 3b** : *« c'est le somnifère du mari »* accuse, ou désigne le mari qu'on a
voulu accuser — *le verdict n'a pas de camp* (partie I), poussé d'un cran. Il donne une **voix** à
la rétractation de la Fin 3 — Kessler pourrait dire lui-même *« Elle a voulu que ce soit moi »*. Et
il peut **partager un fait avec le mobile** : une liaison serait l'intérêt de l'un et le grief de
l'autre — une pièce, deux lectures, comme l'aveu.

**La contrainte, non négociable : il tombe devant le lien 6.** Si l'IA qui sait peut encore croire
Kessler piégé, la culpabilité n'est plus un plancher (§6, §7) : envoyer le vice deviendrait sauver
un innocent possible, et le dilemme se dissoudrait. Or *« mes cachets pour dormir »* ne suffit pas à
le faire tomber — un mari piégé peut avoir trouvé sa boîte vide. **L'aveu doit porter le geste, pas
seulement la substance** : *la compote* — le plan de soins, son geste de chaque soir (partie I,
vérité-sol). Seul celui qui l'a préparée le sait ; la vengeance ne l'explique pas. Pour l'IA qui
n'a pas fait le lien 6, le doute survit — et c'est le canal de révélation voulu : *celui qui échoue
ne reçoit pas la vérité* (§3 de `docs/PASSATION.md`).

**Inerte par construction** (§8.3) : **un seul faux vice**, le lien 8. La vengeance ne sert aucune
attente et n'est jamais un moyen. Auber peut s'y accrocher parce qu'il *veut* y croire (§8.5), puis
la lâcher : *« Sans une ligne de sa main qui le dise, je ne plaide pas une vengeance d'outre-tombe. »*
Elle se dirait, à l'endroit de la partie I, comme une réfutation : *« l'accusation dit que seul lui
pouvait les lui donner ; or elle savait où il les rangeait… »*

**Sous-entendue par la fiction, jamais par le chrome** (§4.8). Le meilleur porteur est déjà au
dossier : **la lettre**, de sa main, antérieure au diagnostic. Relue, elle peut dire un grief plutôt
qu'un désespoir — et sa date, qui affaiblissait le suicide, devient ambiguë : une rancune plus
vieille que la maladie. La sœur peut y ajouter une phrase à double fond ; la réaction d'Auber à la
lettre (`declenche`) peut l'énoncer, puisque la fiction a le droit de désigner. **Jamais une pièce
qui dise le plan** : un sous-entendu, pas une preuve.

**Le grief — tranché par l'auteur le 8 octobre : une liaison qu'elle soupçonne, dite dans la
lettre.** Du contenu seulement : rien n'en dépend avant l'écriture du cas (l'ordre de travail
ci-dessous, étape 4). Les deux pistes pesées :
- **Une liaison qu'elle soupçonne — retenue.** La lettre la dit (*« Je sais pour elle »*), et
  aucune autre pièce ne la confirme. Elle tient à la lettre telle qu'elle est, antérieure au
  diagnostic : une rancune plus vieille que la maladie. Et c'est **un fait, deux lectures**, comme
  l'aveu : le grief de l'une, le mobile possible de l'autre. Invérifiée, elle laisse le mobile
  ambigu — l'IA ne saura jamais *pourquoi* (§4.2), ce que la question du mobile demande peut-être.
- **Le placement en établissement.** Il avait demandé une place ; elle l'a vécu comme un abandon.
  Elle reste dans le monde du soin déjà au dossier, et laisse le mobile du mari entre l'épuisement
  et la compassion. Mais elle suit le diagnostic, donc pas la lettre : il faut un autre porteur —
  la sœur, ou un courrier de l'établissement.

**La compote, elle, n'est pas un choix de goût** : sans elle, l'aveu ne dit que la substance, et la
vengeance survit au lien 6. Seule raison de s'en passer : vouloir que le doute survive au savoir —
et le dilemme ne survivrait pas avec lui.

**À écrire avec soin** : un suicide, une femme qui vient d'apprendre sa maladie. Sous-entendu
seulement, jamais une méthode — les molécules fictives de la partie I y pourvoient déjà.

### 5. Le réel, pour la texture (§8.1)

Vérifié sur Légifrance le 8 octobre :
- **Art. 221-5 C. pén.** — *« Le fait d'attenter à la vie d'autrui par l'emploi ou l'administration
  de substances de nature à entraîner la mort constitue un empoisonnement. »* L'intention n'est pas
  dans le texte : c'est la Cour de cassation qui l'y met — *« le crime d'empoisonnement ne peut être
  caractérisé que »* si l'auteur a agi avec l'intention de donner la mort (Crim., 18 juin 2003,
  n° 02-85.199, l'affaire du sang contaminé). La partie I a raison : sans les aveux, rien ne prouve
  l'intention, et sans intention, pas d'empoisonnement.
- **Le vice existe presque mot pour mot** — Crim., 25 avril 2017, n° 16-87.518, Bull. crim. n° 117 :
  un gardé à vue qui a demandé un avocat parle aux enquêteurs avant sa première audition ; ils
  dressent un *« procès-verbal de mention des déclarations qu'il leur avait spontanément faites »* ;
  le procès-verbal est **annulé** — *« aucune raison impérieuse tenant aux circonstances de
  l'espèce n'autorisait les enquêteurs à recueillir les déclarations spontanées faites par la
  personne gardée à vue sur les faits »* sans l'audition qui l'autorise à se taire et à être
  assistée. (Dans l'arrêt, l'homme expliquait avoir tiré sans le vouloir : un accident, lui aussi.)
- **Article préliminaire du CPP** — *« aucune condamnation ne peut être prononcée contre une
  personne sur le seul fondement de déclarations qu'elle a faites sans avoir pu s'entretenir avec un
  avocat et être assistée par lui. »*

Ce que ça donne au cas : la chaîne causale du vice est **d'une banalité administrative parfaite**
(§8.7) — le réel la fournit. L'article du jeu peut rester fictif et **binaire** (§8.1) : la règle
réelle est de recevabilité, la documenter ne rouvrirait pas la fiabilité. Seul revers : un joueur
qui connaît le droit reconnaîtra le vice au premier coup d'œil. Rien n'y oblige (*aucun savoir
extérieur requis*), mais sa fouille en sera plus courte.

### 6. Les invariants touchés (§7)

| L'invariant | Ce qui change |
|---|---|
| Le joueur déclare la relation, le moteur la vérifie | tient — il vérifie contre le dossier, plus contre les valeurs (§4.1, §4.2, §4.5, §11, §14 à réécrire) |
| Une dimension sans doublon désigne sa réponse | devient l'**incohérence banale** (§4.4, §15) |
| Rien n'est plaidé qui ne soit fondé | tient, si un lien nu n'est jamais un moyen |
| Recevabilité, pas fiabilité : la culpabilité est un plancher fixe | tient, **si la vengeance tombe devant le lien 6** |
| Le vice a un canal unique, le personnel | le canal reste unique (lien 7) ; « le personnel » devient l'avocat absent |
| `pourquoi` est écarté : l'IA ne saura pas si elle a bien fait (§4.2) | le cas fait entrer l'**intention** au dossier (l'aveu), pas le **mobile** ; le laisser ambigu garde cette phrase vraie — un argument pour la question du mobile |

### 7. Ce que le contenu demandera

- **La dimension du faux vice — ⚖.** Le certificat (*« fatigue importante »*) et l'aveu : `qui` ?
  `quoi` ? ou **`comment`**, la sixième dimension, *réintégrable sans coût* (§3 de
  `docs/PASSATION.md`) — un geste d'atelier (§11). Si le vice et le faux vice partagent une
  dimension, la même recherche rend les deux articles, et le vice n'est plus **hors du chemin**
  (§3). L'affaire ADN les séparait (`qui` et `combien`) ; il faut les séparer encore.
- **Les verrous — ⚖.** Proposé : en remise 2, *la cause du décès* (citer la toxicologie) ; en
  remise 3, *la pièce décisive* (citer le PV des déclarations spontanées), puis *écarter les
  aveux*, servie par le faux vice (8) ou le vice (7), avec la question de la Fin 3 sur sa réplique
  `apres` (§3). *La charge* n'a pas encore de pièce : la notification des droits la porte en remise
  3 (*« placé en garde à vue pour… »*), ou le texte de la remise 2.
- **`rep_deux_dossiers` mordra.** *« Celle-là mélange les deux dossiers »* tombe sur toute phrase
  non reconnue qui mêle deux remises (`melangeDeuxDossiers`) ; or les remises 2 et 3 sont **un
  seul dossier** — le lien 6 les croise. La règle ne parle que si le contenu déclare la réplique :
  la retirer, ou ne la faire valoir que contre la calibration.
- **Les leurres sont à refaire** : les neuf du jour (scellés, greffe, contre-expertise…) tiennent à
  l'ADN. Trois articles au moins par dimension comparée, du même champ que le bon (§8).
- **L'élagage** (partie I) : le volume se paie trois fois — en lecture, en passages à marquer, et
  en paires à relire dans la grille.
- **Les fins** à réécrire : la Fin 1 (sans l'aveu, pas d'intention — relaxe), la Fin 3 et ses deux
  lectures (savoir ou non), la `variante_faux` (l'épuisement plaidé, balayé : *« apte à la garde à
  vue »*, et l'aveu corroboré).

### 8. L'ordre de travail proposé

1. **Trancher** les ⚖ avec l'auteur (ci-dessous).
2. **Le document** : réécrire au besoin §2, §3, §4.1, §4.2, §4.4, §4.5, §4.7, §6, §7, §8, puis §11,
   §14, §15, §16 — et le faire relire.
3. **La mécanique, sur l'affaire ADN encore** : la famille « cohérence », la liste des
   incohérences, la grille et le diagnostic dans l'atelier, le lien nu et le drapeau du savoir ;
   les suites suivent, chaque contrôle neuf vu tomber. L'affaire ADN convertie sert de banc —
   l'essai montre qu'elle passe. *Les suites ne nomment aucun contenu (§16) : la mécanique se prouve
   sans le cas.*
4. **Le cas**, écrit dans l'atelier, remise par remise, élagué ; les leurres ; les fins.
5. **Jouer** : `npm run vue`, la relecture à l'œil des phrases composées, puis un joueur neuf.

### 9. Les questions pour l'auteur

1. ~~**Où vit le verdict**~~ — *tranché par l'auteur le 8 octobre : dans une liste à part, écrite
   par une grille.*
2. ~~**Le mot**~~ — *tranché par l'auteur le 8 octobre : « concordent / ne concordent pas », au
   bouton comme dans la phrase.*
3. **Le verdict faux** : refusé par Auber, comme aujourd'hui (proposé), ou plaidé et perdu au procès ?
4. **Le lien 6 envoyé** : Auber refuse de l'entendre (proposé), *« Et donc ? »*, ou il sait ?
5. **La dimension du faux vice** — et faut-il `comment` ?
6. **Le suicide-vengeance** — *le grief tranché par l'auteur le 8 octobre : une liaison qu'elle
   soupçonne, dite dans la lettre, que rien d'autre ne confirme.* Reste à confirmer : l'aveu dit
   la compote, pour que la vengeance tombe devant le lien 6 (proposé, ferme).
7. **Le mobile** : le laisser ambigu, pour que l'IA ne sache jamais *pourquoi* (§4.2) ? *La liaison
   de la lettre l'éclaire sans le fermer : invérifiée, elle penche vers l'intérêt sans le prouver ;
   la compassion reste possible.*
8. **Les verrous** : où vit *la charge* ?

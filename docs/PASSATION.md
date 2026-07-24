# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 23 juillet 2026, après la session **« consolidation des deux lignées »**.*

> Cette passation **remplace** celle du 21 juillet : le dépôt avait divergé en deux lignées parallèles (l'une avec sauvegarde/schema/deux marches/généralisation `apparait_si`, l'autre avec les décisions de contenu ci-dessous et le prototype de grammaire) ; cette session les a réconciliées. Rien de la lignée du 21 juillet n'a été perdu : ses décisions de contenu ont été portées sur le moteur le plus avancé, pas l'inverse.

---

## 1. L'inventaire

| Fichier | État |
|---|---|
| `app/index.html` | le jeu : moteur + `JEU_EMBARQUE` (repli). Sauvegarde, `schema`, deux marches, `apparait_si`/`prive`/`leve` **conservés** ; P0/attention **retiré** ; vice ramené à un canal (le personnel). |
| `app/content.js` | le contenu joué. **Régénéré par `npm run export:seed`** (l'atelier lui-même, via jsdom) après un premier passage à la main pendant la consolidation — l'en-tête « ne pas éditer à la main » est de nouveau vrai. |
| `app/atelier_v3.html` | l'outil d'écriture + diagnostic + simulation. Miroir `sim*` de P0 retiré ; diagnostic « canaux indépendants » vérifié silencieux sur le SEED (un seul canal désormais) ; migration nettoie une clé `attention` résiduelle. |
| `tests/test_o5.js` | **remplace `test_p0_o5.js`** — 18 contrôles, vert. |
| `tests/test_declencheurs.js`, `test_autre_affaire.js`, `test_parcours.js`, `test_sauvegarde.js`, `smoke_atelier.js` | mis à jour où le retrait de P0 et le vice à canal unique les touchaient ; verts. |
| `grammaire/grammaire2.js` / `grammaire/test_grammaire2.js` | la grammaire du texte à trous et son banc d'essai (démonstration, pas une suite pass/fail). **Prototype non branché** — le jeu utilise toujours `noter()`/`choisirChamp()`. Mesures inchangées : 693 → 72 → 7. |
| `docs/ARCHITECTURE.md` | **l'unique source de vérité.** A absorbé `conception_jeu_ia.md` (le sens) : Partie I (concept, fins, carnet, directives, affaire ADN, invariants, discipline d'écriture « Écrire ce qui sonne vrai ») + Partie II (disposition, artefacts, source de vérité, copies, resync, tests, prototype de grammaire). P0 retiré, vice à canal unique, fenêtre interdite abandonnée — tout est reflété. |
| ~~`docs/conception_jeu_ia.md`~~ | **supprimé.** Son contenu de sens vit désormais dans `ARCHITECTURE.md`, Partie I. |
| `scripts/exporter-seed.js` | **nouveau.** `npm run export:seed` — régénère `content.js` depuis `SEED`, par l'atelier (diagnostic + export), jamais à la main. |
| `package.json` | `npm test` pointe vers `test_o5.js` ; `npm run demo:grammaire` lance le banc d'essai (hors `test`) ; `npm run export:seed` régénère `content.js`. |

**Rien ne manque** : les six suites + le prototype de grammaire sont tous présents et cohérents entre eux.

## 2. Ce que la session a fait

### Réconciliation, pas remplacement

Deux fils de travail avaient divergé sans se recroiser : l'un avait poussé l'infrastructure du moteur (sauvegarde de partie, versionnage `schema`, deux marches du vice, généralisation `apparait_si`/`prive`/`leve`, dims par pièce) ; l'autre avait pris des décisions de contenu/design (retrait de P0, vice à canal unique, abandon de la fenêtre interdite) et amorcé un nouveau système de grammaire, mais sur une version du moteur antérieure à ces infrastructures. Plutôt que de choisir un camp, les décisions de contenu ont été **portées sur le moteur le plus avancé** — aucune des deux lignées n'a été jetée.

### `attention` (P0) est retiré — décision confirmée, appliquée sur le moteur complet

Même raisonnement que documenté précédemment : le budget de notes actives ne bloquait pas l'énumération à l'aveugle (oublier était gratuit), coûtait une clé de contenu, quatre fonctions miroir `sim*`, une pastille, du CSS, et contredisait « noter doit rester gratuit ». Concrètement retiré de `app/index.html` (`attentionMax`, `notesActives`, `attentionPleine`, `supprimerNote`, le bouton ✕, la pastille « attention »), de `app/atelier_v3.html` (mêmes miroirs + `majAttention` + l'input de l'éditeur), et de `app/content.js`/`JEU_EMBARQUE` (clé `attention`). La migration de l'atelier (`migrerContenu()`) retire désormais aussi une clé `attention` héritée d'un vieux contenu ; le diagnostic (`valider()`) la signale en info (« présente mais ignorée ») plutôt qu'en erreur de format.

**Ce qui n'a pas bougé :** les deux marches du vice (`vice_pressenti` → `vice_trouve`), la sauvegarde de partie, le versionnage `schema`, `apparait_si`/`prive`/`leve` — tout ça appartenait à l'autre lignée et reste en place.

### Le vice a un canal unique : le personnel

La fiche violait auparavant *deux* exigences indépendantes du protocole (agents séparés **et** scellés séparés) — deux signaux pour une seule faute. Décision : les scellés (`S-2`/`S-7`) deviennent distincts et donc **conformes** ; seule l'identité de l'agent (`T-14` des deux côtés) reste le vice. Un nouveau lien de « conformité qui ne mène nulle part » existe (scellés conformes à l'article 7), pour que ce ne soit plus vrai que « tout lien vers le protocole gagne ». Le diagnostic de l'atelier (`canaux.size>1` → avert « canaux indépendants ») n'a nécessité **aucune modification de code** : il regroupait déjà les liens-vice par la cible-règle qu'ils violent, donc retirer les deux liens-vice sur les scellés a suffi à faire taire l'avertissement sur le SEED.

### La fenêtre interdite est abandonnée

Le protocole déclare désormais le délai entre les deux prélèvements **indifférent** — seuil net, violation binaire (l'identité de l'agent, point). Les horaires de la fiche redeviennent du bruit assumé. `ARCHITECTURE.md` Partie I §6 (affaire ADN) mis à jour en conséquence.

### Le prototype de grammaire est archivé, pas intégré

`grammaire2.js`/`test_grammaire2.js` vivent dans `grammaire/`, en dehors de `app/` et `tests/` : ce sont des fichiers autonomes (`require("./grammaire2.js")`, pas de dépendance à `app/`). Le jeu n'en a pas connaissance. `docs/ARCHITECTURE.md` §15 documente le plan d'intégration en quatre étapes.

### `content.js` re-garanti conforme (correctif après coup)

Pendant la consolidation, `app/content.js` et `SEED` (dans `atelier_v3.html`) ont été édités à la main, en parallèle, pour rester synchronisés — ce qui viole l'invariant du §11 de `ARCHITECTURE.md` (« l'atelier est le seul endroit où l'on écrit »). Corrigé : `scripts/exporter-seed.js` boote l'atelier en jsdom, charge `SEED`, exige zéro erreur au diagnostic, puis exporte `content.js` avec la fonction réelle du bouton « Exporter ». `npm run export:seed` le relance à volonté ; `content.js` est désormais un export véritable, pas une copie tapée à la main. Si le SEED change à nouveau, ce script est la commande à lancer — pas un copier-coller.

**Le garde-fou est maintenant automatique à la détection (pas à la correction) :** `tests/verifier_content_sync.js`, ajouté à `npm test`, échoue si `content.js` a dérivé de ce que `SEED` exporterait — sans jamais réécrire de fichier tout seul pendant les tests. Scopé à la phase actuelle (une seule affaire, celle de `SEED`) : à retirer le jour où l'atelier exporte délibérément une autre affaire (voir l'avertissement en tête de ce fichier de test et dans `ARCHITECTURE.md` §9).

## 3. Ce qui reste ouvert

- **Le canal de révélation de la culpabilité.** Toujours non tranché (narrateur omniscient dans les fins).
- **La formulation exacte de D1/D2**, et les épilogues.
- **L'intégration de la grammaire** — voir `docs/ARCHITECTURE.md` §15. C'est le chantier le plus significatif restant : remplacer `noter()` par `composer()`, côté jeu et atelier.
- **Genre, nombre, contractions** dans la grammaire ; l'affichage des `poids`.
- **La texture de l'avocat.**

## 4. Prochaine étape

Dans cet ordre :

1. **Jouer la tranche verticale de bout en bout** (`app/index.html` en `file://`) pour confirmer à l'oreille que le retrait de P0 et le vice à canal unique ne cassent rien du ressenti — les tests prouvent le comportement, pas l'expérience.
2. **Décider si la grammaire remplace ou complète** le geste actuel avant d'y toucher au code — c'est une question de contenu/expérience, pas seulement technique (cf. `ARCHITECTURE.md` §15, point 4 : la marge de bruit doit rester non nulle).
3. Si la grammaire est adoptée : suivre le plan en quatre étapes du §15, en retestant après chacune.

**Amorce suggérée :** « Lis `docs/ARCHITECTURE.md` et `docs/PASSATION.md`. On regarde si la grammaire (`grammaire/`) remplace le geste actuel ou le complète, avant d'y toucher. »

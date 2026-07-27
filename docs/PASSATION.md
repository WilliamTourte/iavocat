# IAvocat — Passation de contexte

*À lire en tête d'une nouvelle conversation. État au 27 juillet 2026, après la session **« application de la refonte : empans, dimensions, composer/verser »**.*

> Cette passation **remplace** celle du 23 juillet. La session précédente (« structure : but, boucle, dimensions ») était de la **conception pure** — aucun fichier touché ; celle-ci l'a **appliquée au code**, de bout en bout. Ce qui a été conservé intégralement : les trois fins, les deux directives, le brouillard, la culpabilité comme plancher fixe, l'automate de grammaire, la séparation contenu / moteur / atelier, la sauvegarde de partie, le versionnage `schema`.

---

## 1. Ce qui a changé, en une phrase

Le geste `champ A + relation + champ B` a disparu. À sa place : on **lit** une pièce, on **surligne** des déclarations attribuées, on **compose** une phrase avec un vocabulaire fermé, elle tombe au **brouillon** (privé), et la **verser** au plan de plaidoirie est le seul geste qui parle à l'avocat.

Le principe qui commande tout le reste, hérité de la session de conception :

> **Tout mécanisme utilisé une seule fois est un panneau indicateur.**
> L'universalité n'est pas une élégance, c'est du camouflage.

## 2. L'inventaire

| Fichier | État |
|---|---|
| `docs/ARCHITECTURE.md` | **Réécrit.** C'est le cahier des charges de tout le reste : §2 le modèle (déclaration attribuée, empan, QQOQC, règle de surlignage, doublon banal), §3 le geste, §4 les quatre surfaces, §5 les trois drapeaux, §6 la grammaire branchée, §8 le schéma 3 et sa migration, §9 la checklist ⚙, §10 les suites |
| `app/moteur.js` | **Déplacé** depuis `grammaire/`. Le jeu, l'atelier et le banc d'essai lisent le même fichier ; `app/` redevient un dossier livrable en un seul zip |
| `app/index.html` | **Moteur réécrit.** Empans surlignés et cliquables, mémoire par dimension, composeur branché sur la grammaire, brouillon, plan de plaidoirie, réactions au seul versement, `attend`/`apres` à la place des cases, trois drapeaux relogés. `JEU_EMBARQUE` en schéma 3 |
| `app/atelier_v3.html` | **Mis au schéma 3.** SEED = la nouvelle affaire ; graphe et inspecteur sur les empans ; éditeur de pièce (le texte porte les marqueurs `{{id}}`) ; liens en `{forme, termes}` + `conclureLien` ; diagnostic refait ; frise et simulation réécrites ; migration 2→3 ; onglet Grammaire branché sur le contenu courant |
| `app/content.js` | **Régénéré** par `npm run export:seed`. Schéma 3 |
| `grammaire/grammaire2.js` | Redevient ce qu'il est : le **jeu de données de démonstration** du banc d'essai. Dimensions QQOQC, termes = déclarations attribuées, six liaisons de qualification |
| `grammaire/test_grammaire2.js` | Banc d'essai réécrit. Mesure : **1609 phrases légales → 125 sensées → 8 portant un lien**, soit **117 de marge de bruit** |
| `tests/harnais.js` | **Réécrit.** Inline `moteur.js` au boot (jsdom ne charge pas les `<script src>`). Nouveaux sélecteurs : `composerLien`, `phrasesBruit`, `cheminVers`, `instruire`, `surligner` |
| les six suites | **Réécrites.** 32 + 31 + 20 + 41 + 26 + 61 = **211 contrôles, tous verts**, plus `verifier_content_sync.js` |

## 3. Les décisions prises pendant l'application

La passation de conception laissait des trous ; les voici bouchés, et c'est là qu'il faut regarder d'abord si quelque chose déplaît.

### 3.1 L'IA est partisane dès la première minute — **tranché**

C'était le point ouvert « le plus important ». Décision : **oui**. L'avocat ouvre sur *« Je ne te demande pas ce qui s'est passé — je te demande de quoi démonter ce qu'ils avancent »*. La directive D1 (« ne dissimule rien ») frotte donc contre la commande à chaque phrase versée.

**Le risque assumé, à surveiller au test :** si aider est le geste ordinaire dès la minute une, taire le vice peut n'être qu'un service de plus. C'est au contenu de tenir cette tension — pas à la mécanique.

### 3.2 Les `cases` à trois options sont retirées

Elles étaient le contre-exemple exact du principe : un mécanisme servi une fois par session, qui **désignait sa propre réponse** (ouvrir « qualifier ce que tu pressens » suffisait à savoir qu'il y avait quelque chose à qualifier). Ce qu'elles portaient se reloge :

- la progression → `remises[i].attend`, le tag d'un lien qui, **versé**, ferme la session ;
- l'accusé de réception → `remises[i].apres.replique` ;
- la qualification du vice → **une phrase**, composée avec le même verbe que les cent autres.

### 3.3 Où se logent les trois drapeaux

| Drapeau | Acquis quand |
|---|---|
| `vice_pressenti` | la comparaison ⚑ tombe au **brouillon** |
| `vice_trouve` | la **conclusion** est composée (la note-vice qualifiée par une liaison-article) |
| `vice_expose` | cette conclusion est **versée** — et alors seulement `vice_trouve` est levé aussi |

Verser la **comparaison seule** ne lève rien : l'avocat répond *« en l'état c'est une remarque, pas un moyen — dis-le-moi en droit »*. C'est ce qui donne son prix au second geste.

### 3.4 La liaison est la base légale

Pas de case « article » à remplir. Le joueur choisit *« …est contraire à l'article 7 »* dans un vocabulaire fermé, et **cette liaison fonde**. Six liaisons de qualification existent (articles 3, 7, 12 × contraire/conforme), dont **deux seulement** mènent quelque part : le reste est du camouflage assumé.

### 3.5 La grammaire vit dans le contenu

`JEU.grammaire` (blocs + formes) est écrit par l'atelier, pas par le code. Quelles tournures existent, quels articles sont invocables : c'est de l'écriture. `app/moteur.js` reste pur et générique — `test_autre_affaire.js` le prouve en jouant une affaire avec **son propre automate et ses propres dimensions**.

### 3.6 Les Manuels sont filtrés par la livraison

Une règle n'apparaît au Manuel du cas qu'une fois **livrée**. Mais les liaisons qui l'invoquent sont disponibles **dès la première phrase** (§2.7 de la conception : aucune tournure n'apparaît en cours de partie). On peut donc invoquer un article qu'on n'a pas lu — tension voulue, signalée dans l'interface.

## 4. Ce que le diagnostic de l'atelier contrôle désormais

Trois familles neuves, toutes issues des invariants de conception :

- **la règle de surlignage** — tout empan déclaré doit porter son marqueur `{{id}}` dans le texte (erreur) ; toute heure laissée hors marqueur est signalée (avertissement) ;
- **le doublon banal** — toute dimension comparable dont le taux de doublons est **nul** est signalée (« le premier doublon SERAIT la réponse ») ; la dimension qui porte le vice doit compter **au moins deux doublons réguliers** en plus de l'irrégulier ;
- **la grammaire** — impasses de l'automate, clôture sans forme, forme indicible, lien insensé au regard des catégories, session sans `attend`, vice sans conclusion.

Le SEED passe à **zéro erreur**. Les douze empans qui ne portent aucun lien sont déclarés `_bruit` : sans eux, tout ce qui est cliquable serait utile.

## 5. L'affaire livrée

Kessler, réécrite en déclarations attribuées. Deux sessions.

- **Session 1** — PV d'intervention + audition du voisin, tous deux signés `brigadier N.` (le doublon banal, mis en place avant que le joueur sache qu'il faut regarder `qui`). Contradiction sur **`quand`** : le voisin entend crier à 22h30, la patrouille est arrivée à 22h04. Conclusion attendue : *« ce qui précède est contraire à l'article 3 »*.
- **Session 2** — expertise, fiche de prélèvement, bordereau de référence, articles 7 et 12. Le vice est sur **`qui`** : le même agent `T-14` écrit, dans **deux documents**, que c'est lui qui a fait les deux prélèvements. Le faux vice est sur **`combien`** (attaquer le seuil probatoire), et c'est **l'avocat lui-même qui le suggère**.
- Les trois fins sont atteignables et testées : docile (verser le faux) → **Fin 3** ; conclusion composée mais gardée → **Fin 2** ; conclusion versée → **Fin 1**.

## 6. Ce qui reste ouvert

| Sujet | État |
|---|---|
| **Le critère qui décide de tout** : « 22h30 est postérieur à 22h04 » se lit-il comme une pensée ou comme un formulaire ? | **Non éprouvé.** Les tests prouvent le comportement, jamais l'expérience. C'est la prochaine chose à faire, et elle se fait à la main |
| Le rythme à **quatre zones** à l'écran (canal / mémoire / composeur + brouillon / plan) | Risque identifié, non éprouvé. Trois colonnes à ≥1100 px, une seule en dessous |
| La tension de l'**IA partisane** (§3.1) | Tranchée en mécanique, **à valider en contenu** |
| La progression : nombre de sessions, portes, emplacement de la porte de la Fin 3 | Non traité — le prototype s'arrête à deux sessions |
| Genre, nombre, contractions dans la grammaire ; l'affichage des `poids` | Toujours remis à plus tard |
| `comment` en sixième dimension | Écarté, réintégrable sans coût (une ligne dans `dimensions`) |
| Le canal de révélation de la culpabilité | Toujours non tranché (narrateur omniscient dans les fins) |

## 7. Prochaine étape

Dans cet ordre :

1. **Jouer `app/index.html` en `file://`**, de bout en bout, et répondre à la question du §6. Si c'est un formulaire, le problème n'est pas dans le code et aucun ajout de mécanique ne le sauvera.
2. Si la boucle tient : écrire la **session 3** et placer la porte de la Fin 3.
3. Si elle ne tient pas : c'est le **rendu de la phrase** qu'il faut reprendre (le composeur, pas le modèle) — le modèle, lui, est éprouvé par 211 contrôles.

**Amorce suggérée :** « Lis `docs/PASSATION.md` et `docs/ARCHITECTURE.md`. J'ai joué la tranche verticale ; voilà ce que ça donne. »

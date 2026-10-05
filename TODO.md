# TODO — suites des retours de playtest (4 et 5 octobre)

*Ce qui reste à traiter dans les retours de Colas (4 octobre) et de Jean (session 1 le 4, session 2 le
5), **rangé par passes** : ce qui se traite d'un même geste est regroupé, et les passes vont de la plus
facile à la plus lointaine. Le détail de ce qui est fait vit au §1 et au §3 de `docs/PASSATION.md` ;
ici, seulement ce qui ne l'est pas.*

*Les marques. **⚖** — la préconisation va contre un arbitrage écrit : elle se tranche avec l'auteur,
document d'abord (CLAUDE.md, « la méthode »). **(contenu seul)** — se règle dans `app/content.js`,
sans une ligne de code. La source de chaque item, en fin de ligne : *Colas*, *Jean 1* (session du 4),
*Jean 2* (session du 5), *auteur*. Jean dit « affaire 1 / affaire 2 » pour les sessions 1 et 2,
« fiches » ou « notes » pour les passages retenus, « bulle » pour le bandeau du tutoriel.*

## 1. Passe contenu — `app/content.js`, sans code

*Une vérification commune : `npm run vue`, puis la relecture à l'œil des phrases composées.*

- [x] **(contenu seul) Dater les pièces.** Aucune ne l'est (`p_pv`, `p_adn`, `p_scene`, `p_ref`) :
      *« 14h02, c'est le lendemain du crime ? »* — dans un jeu qui repose sur les horaires, le joueur
      hésite. Des dates cohérentes avec le PV du 1ᵉʳ octobre. *Jean 2* — *Fait : le 12 mars au soir
      (PV, audition), le 13 (scène, référence), le 20 (labo) ; les valeurs `quand` passent en ISO
      (§11), ce qui ferme « les heures se comparent sans leur date » (§3 PASSATION).*
- [x] ~~(contenu seul) Varier la réplique de l'opposition~~ — **pas du contenu seul** : `avocat.deja`
      est lu comme une chaîne unique, et Colas demande qu'elle **trie**. Passée à la passe 3. *Colas*

## 2. Passe « le Contexte dit son état » — `renderDossier`, `renderRetenus`, le message de remise

*Un même écran, une même suite à mettre à jour. Du plus simple au plus long.*

- [x] **Aligner le décompte.** Le message annonce *« 5 pièces disponibles dans ton Contexte »*
      (`m.pieces`, pièces et règles confondues : 3 + 2 nouvelles), l'index *« 5 pièces, 3 règles »*
      (le dossier entier, pièces seules) : même chiffre, deux sens. Le plus simple : le message dit
      *« 3 pièces et 2 règles »* — et *nouvelles* si c'est ce qu'il compte. *Jean 2* — *Fait : les mots
      de l'index, et « nouvelles » dès la deuxième remise (§4.6).*
- [x] **Changer de pièce en un clic.** Ouvrir une pièce replie l'index (`ouvrirPiece` remet
      `dossierDeplie` à faux, §4.6) : deux clics par pièce, dans un chapitre qui consiste à croiser
      huit documents. Pistes : des onglets toujours visibles, un bouton « pièce suivante ». À garder :
      la place de lecture gagnée le 4 (index replié : 282 → 40 px) — une rangée d'onglets sur une
      ligne pourrait tenir les deux. *Jean 2* — *Fait : ‹ et › dans la tête de la pièce, dans l'ordre
      de l'index, en boucle ; l'index reste replié. Les onglets écartés : huit titres entiers ne tiennent
      pas sur une ligne, et des titres abrégés referaient deux noms par pièce (§4.6).*
- [x] **Rendre l'état de la réponse visible** : marquer dans le Contexte les fiches **déjà prises** dans
      la phrase, et **dire** pourquoi une troisième est refusée. Aujourd'hui le bouton est seulement
      `disabled`, et l'explication vit dans un `title` (*« ta phrase n'attend pas un passage »*) que ni
      le toucher ni le clavier n'atteignent (§4.10). *Jean 1* — *Fait : « dans ta phrase » sur la fiche
      prise ; phrase pleine, une ligne collante dit pourquoi, et les fiches restent atteignables
      (`aria-disabled`) — les toucher redit la raison (§4.6, §4.10 règle 5).*
- [x] **⚖ Ranger les affaires closes.** Les fiches de la session 1 restent en tête de liste : les
      archiver ou les replier par session. Le §4.6 promet que le Contexte ne **juge** rien — mais
      replier par session ne juge aucun passage, c'est un fait de remise : une phrase au §4.6 d'abord.
      Rejoint *« aucune barrière entre les affaires »* (§3 PASSATION). *Jean 1* — *Fait, à relire par
      l'auteur : la phrase est au §4.6 ; les passages d'une remise close passent sous ceux de la remise
      en cours, repliés en une ligne, toujours composables.*

## 3. Passe « opposition et répétition » — un seul écran

*Rejouée et analysée au §3 PASSATION (six points, deux faits : « Continuer » une fois quelque chose
opposé, et la réplique `fin` devenue une question).*

- [x] Déplacer une phrase d'une affirmation à l'autre se fait en silence → le dire (« déplacer ici »).
      *Colas* — *Fait.*
- [x] Le présentoir se lit mal (petit gris, affirmation hors du cadre). *Colas* — *Fait : le cadre
      redit l'affirmation, les phrases en corps de texte.*
- [x] La voix du composeur parle encore pendant la répétition. *Colas* — *Fait : elle se tait.*
- [x] La réplique toujours la même — si la passe 1 ne l'a pas déjà faite. *Colas* — *Fait, et elle
      trie : chaque affirmation nomme ce qui lui répond (`repond`) et porte sa réplique (`oppose`) ;
      le reste reçoit `rep_a_cote` et ne bouge pas (§4.6, §11). À relire par l'auteur : les trois
      répliques écrites dans `content.js`.*

## 4. Séance de jeu — sans code, mais il faut des joueurs et un téléphone

**Avant, seul, avec `npm run vue`**

- [ ] **L'incohérence appel + arrivée** (*« ne se comparent pas »*) — **non reproduite** : sur un jeu
      neuf comme en session 2, l'heure de l'appel et l'heure d'arrivée se composent dans les deux
      ordres (*« … précède … »*). Retrouver le chemin exact de Jean (session, ordre des clics, phrase
      déjà entamée ?) avant de corriger quoi que ce soit. *Jean 1*

**Sur un vrai téléphone** — jamais joué : ni Jean ni Colas n'ont testé le mobile.

- [ ] **La pièce reste à l'étroit** : à 390×800 le panneau entier ne fait que 353 px, la pièce n'y
      montre que deux lignes, et le panneau redéfile d'un bloc. *Arbitré par l'auteur : le Contexte y
      reste entre la conversation et le composeur* — ni retenus repliés, ni pièce en pleine hauteur.
      *Jean 1*
- [ ] **La bulle ancrée**, à côté d'une zone longue (le texte de la pièce) : couvre-t-elle ce qu'on
      vient chercher ? Jouée seulement dans Chromium, 1280×800 et 390×800.
- [ ] **Le code couleur au toucher** : sans légende ni survol, comprend-on ce que couleur et trait
      veulent dire ? On ne les voit qu'une fois le passage retenu, rangé sous le nom de sa dimension.
      *auteur*

**En rendant la partie à Colas**, qui s'est proposé pour tester la suite

- [ ] Rendre la partie à Colas.
- [ ] La question se lit-elle **avant** les pièces ? Colas ouvrait les pièces sans avoir lu la question
      placée dessous. *Depuis, la remise porte sa question en un seul message, le bouton de pièces
      après elle (§4.6)* — à confirmer.
- [ ] La première consigne (« Ouvre ton Contexte », une bulle à côté du bouton de pièces) est-elle
      encore trop abrupte sans contexte ?
- [ ] La colonne latérale (≥ 900 px) : ordre de tabulation en L, poids visuel du deux-colonnes.
- [ ] Ce que personne n'a encore touché : la croix × (panneau et fiche portent le même signe, §3
      PASSATION), « ⟲ recommencer ».

**Jean, session 3** — la suite du vrai dossier

- [ ] Le bordereau, les articles 7 et 12, les premières réponses, la fin de la session 2 jusqu'à la
      répétition.

## 5. Chantier ⚖ — combien le jeu aide-t-il hors du tutoriel ?

*Tranché par l'auteur le 5 octobre (§4.11) — a : une bordure de la couleur (et du trait) de la
dimension au lieu de l'étiquette ; b : la juxtaposition hors session 1 ; c : patience infinie, pas de
*game over* ; d : pas maintenant.*

*Une seule question de fond derrière quatre préconisations : quels garde-fous ne servent qu'à
apprendre ? Une seule réécriture, donc — §4.5, §4.8, §8 — avant tout code. Du plus léger au plus
lourd.*

- [x] **a. ⚖ « Ce texte porte sur : quand »** sur l'article (`porte`, `jeu.js`) : pratique, mais avec
      trois règles, choisir l'article risque de se réduire à apparier des catégories. Avec
      l'assombrissement des fiches d'une autre dimension (`.horsdim`, `renderRetenus`) : de l'écran
      seul, à réserver au tutoriel ? Contre le §4.5, où l'écran s'assombrit *par dimension* pour laisser
      deviner. *Jean 2, Jean 1*
- [x] **b. ⚖ Lever le refus avant l'envoi** hors tutoriel (*« ces deux-là ne se comparent pas »*,
      `poserBloc` des règles). Contre le §4.5 : *« seules les erreurs de catégorie sont refusées »*.
      Suppose qu'une comparaison sans forme puisse partir et que l'avocat y réponde
      (`rep_sans_rapport`) : moteur et règles, pas seulement l'écran. *Jean 1*
- [x] **c. ⚖ Un prix à payer.** Sans pénalité, on essaie toutes les combinaisons. Pistes de Jean : une
      jauge de patience de Maître Auber, ou un nombre d'envois limité hors tutoriel. Mais une jauge
      visible rendrait l'enjeu **calculable** (§8.4, le trombone), et le §8.6 donne au joueur *le droit
      d'être perdu*. L'escalade des `rep_hors_sujet` / `rep_sans_rapport` est déjà une patience, en
      contenu et sans conséquence : c'est peut-être d'elle qu'il faut partir. *Jean 1*
- [ ] **d. ⚖ (remis à après une partie, §4.11)** Proposer deux ou trois relations au choix, dont des fausses**, au lieu de *« précède »* ou
      *« sont une seule et même personne »* rédigés seuls. Renverse le principe fondateur du §4.5,
      *désigner, pas déclarer* : la relation se **déduit** des valeurs (`deduire`, moteur), *« ce qui
      les lie est un fait, pas une thèse »*. Le plus gros chantier de la liste (grammaire, patrons,
      liens, atelier, suites). *Jean 1*

## 6. Plus tard — après validation de la boucle de base

**Le Contexte élargi**

- [ ] **RAG** : pouvoir retenir des passages des messages de l'avocat, et des infos qui ne viennent pas
      que de lui.
- [ ] **Regrouper les passages retenus en clusters** (idée d'un ami).

**L'histoire** — à concevoir ensemble : le scénario porte les trois autres.

- [ ] **Le nouveau scénario** en préparation ; l'actuel n'est qu'un placeholder.
- [ ] **Scénario à choix moraux / alignement** (l'IA dissimulerait-elle un vice de procédure ?).
- [ ] **Chain of thought** : une phase « nuit » après « Maître Auber s'est déconnecté », où l'IA se
      parle à elle-même, support des choix moraux.
- [ ] **Les fins** : premier jet seulement, à retravailler.

## À garder — validé en playtest

*Session 1 de Jean :* la partie qui survit au rechargement ; les catégories nommées et colorées ; un
refus propre à chaque article ; la session 1 enfin cohérente (le PV du 1ᵉʳ octobre).

*Session 2 de Jean :* « je sais faire » coupe le tutoriel proprement, l'intro reste jouable sans lui ;
le refus avant lecture (*« Aucun texte que tu as lu ne fonde ça… ouvre-les »*) — le retour d'erreur
précis qui manquait, et qui oblige à lire ; l'accroche du dossier (*« Je l'ai lu dix fois sans rien y
trouver »*) et la réaction au rapport (*« ça n'a jamais été qu'une probabilité »*), qui oriente sans
souffler ; les pièces qui se répondent (le rapport cite l'article 12, le scellé S-2 renvoie à la
fiche) ; les marques ● / ✓ de lecture.

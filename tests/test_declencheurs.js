// Décâblage moteur ↔ contenu — le moteur ne connaît aucun identifiant :
// sessions généralisées, piece.declenche, remise.attend/apres, les trois
// drapeaux du vice, Manuels par type et par livraison, rejet du schéma 2.
// Les mutations elles-mêmes sont dérivées du contenu (rien n'est nommé).
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, contenuLivre, discussion } = H;
const boot = contenu => H.boot({contenu});   // null = aucun contenu du tout

/* Renomme un id de pièce dans un contenu brut : liens (termes emboîtés
   compris), remises. Sert à prouver qu'aucun id n'est câblé dans le moteur. */
function renommerPiece(c, ancien, neuf){
  c.pieces = Object.fromEntries(Object.entries(c.pieces).map(([k,v])=>[k===ancien?neuf:k, v]));
  // Une clé se défait par `deK`, jamais à la main — et surtout pas deux fois
  // dans la même expression, ce qui était la seule façon de les faire diverger.
  const rec = t => Array.isArray(t) ? t.map(rec)
    : typeof t === "string" ? (([p,e]) => p===ancien ? neuf+"."+e : t)(H.deK(t))
    : {...t, termes: rec(t.termes||[])};
  for (const L of c.liens) L.termes = rec(L.termes||[]);
  for (const r of c.remises) r.pieces = (r.pieces||[]).map(p => p===ancien?neuf:p);
  // Depuis que les liaisons-articles sont filtrées par livraison (§4.5), un
  // bloc de grammaire peut désigner une pièce : c'est une référence de plus
  // à suivre, sans quoi l'article ne serait plus jamais offert.
  for (const b of (c.grammaire||{}).blocs||[]) if (b.piece===ancien) b.piece = neuf;
  return c;
}

console.log("\n=== Le moteur ignore les identifiants de contenu ===");
{
  const c = contenuLivre();
  const anciens = Object.keys(c.pieces);
  for (const [i, pid] of anciens.entries()) renommerPiece(c, pid, "z"+i);
  const w = boot(c);
  check("toutes les pièces renommées : le contenu reste valide", w.SOURCE_CONTENU === "contenu : content.js");
  H.instruire(w);
  check("l'instruction se joue quand même de bout en bout", w.S.remisesEnvoyees === c.remises.length);
  check("→ Fin 3", H.numeroFin(H.terminer(w)) === "3");
}

/* Il n'y a plus de contenu embarqué : un contenu refusé n'est pas remplacé
   en douce, il est SIGNALÉ. Le jeu affiche son bandeau de panne et ne joue
   rien — zéro remise — au lieu de faire croire qu'il joue l'affaire écrite. */
console.log("\n=== Un contenu invalide est refusé, et le dit ===");
const panne = w => (w.document.querySelector(".panne")||{}).textContent || "";
{
  const c = contenuLivre();
  c.schema = 2;
  const w = boot(c);
  check("schéma 2 : le contenu est refusé", w.SOURCE_CONTENU === "contenu introuvable");
  check("le jeu le dit à l'écran, il ne joue pas autre chose", panne(w).includes("schéma 2"));
  check("et rien ne se joue", w.S.remisesEnvoyees === 0);
}
{
  const c = contenuLivre();
  delete c.grammaire;
  check("sans grammaire, le contenu est rejeté", boot(c).SOURCE_CONTENU === "contenu introuvable");
}
{
  const c = contenuLivre();
  delete c.dimensions;
  check("sans dimensions, le contenu est rejeté", boot(c).SOURCE_CONTENU === "contenu introuvable");
}
{
  check("content.js absent : le jeu le dit franchement",
        panne(boot({contenu:null})).includes("content.js"));
}

console.log("\n=== piece.declenche ===");
{
  const c = contenuLivre();
  const pid = H.pidAvecDeclenche(boot(c));
  const w = boot(c);
  // la pièce peut n'arriver qu'à une session ultérieure : on ouvre tout
  H.instruire(w);
  const avant = w.S.fil.length;
  w.ouvrirPiece(pid);
  check("ouvrir une pièce à declenche pousse sa réplique", w.S.fil.length > avant || w.S.declenches.includes(pid));
  const apres = w.S.fil.length;
  w.ouvrirPiece(pid);
  check("une_fois : la seconde ouverture est muette", w.S.fil.length === apres);
}
{
  const c = contenuLivre();
  const w0 = boot(c);
  const pid = H.pidAvecDeclenche(w0);
  c.pieces[pid].declenche.qui = "Le stagiaire";
  delete c.pieces[pid].declenche.une_fois;
  const w = boot(c);
  H.instruire(w);
  w.ouvrirPiece(pid); const n1 = w.S.fil.length;
  w.ouvrirPiece(pid);
  check("sans une_fois, la réplique repart", w.S.fil.length > n1);
  check("le « qui » du contenu est respecté", discussion(w).includes("Le stagiaire"));
}

console.log("\n=== Les attentes d'une remise : l'avancement ===");
{
  const c = contenuLivre();
  const w = boot(c);
  check("une seule session est ouverte au départ", w.S.remisesEnvoyees === 1);
  /* Une remise attend une SUITE de réponses (§3). Elle ne se ferme qu'une fois
     toutes servies, et chacune est servie par le même geste : composer, verser. */
  const as = w.R.attentesDe(c.remises[0]);
  check("la première remise attend au moins une réponse", as.length >= 1);
  as.forEach((a, k) => {
    const i = H.composerLien(w, H.lienTag(w, a.attend));
    if (k === 0) {
      check("la phrase attendue se compose", i >= 0);
      check("la composer ne fait rien avancer", w.S.remisesEnvoyees === 1);
    }
    w.envoyer(i);
    if (k < as.length - 1)
      check("une attente servie n'ouvre pas encore la session suivante", w.S.remisesEnvoyees === 1);
  });
  check("la dernière attente servie ferme la session et ouvre la suivante", w.S.remisesEnvoyees === 2);
  const fin = as[as.length - 1].apres;
  check("l'accusé de réception est dit",
        !fin || discussion(w).includes(fin.replique.slice(0, 30)));
}
{
  // Chaque question posée arrive dans le canal quand son attente devient courante.
  const c = contenuLivre();
  const w = boot(c);
  const as = w.R.attentesDe(c.remises[0]).filter(a => a.question);
  if (as.length) {
    check("la première question est posée au démarrage", discussion(w).includes(as[0].question));
    if (as.length > 1) {
      check("la suivante ne l'est pas encore", !discussion(w).includes(as[1].question));
      w.envoyer(H.composerLien(w, H.lienTag(w, as[0].attend)));
      check("elle est posée dès que la précédente est servie", discussion(w).includes(as[1].question));
    }
  }
}
{
  /* Répondre DANS LE DÉSORDRE est accepté : on ne restreint jamais par la
     pertinence (§4.5). L'attente servie est celle dont le tag correspond, et
     la question reposée est la première encore due. */
  const c = contenuLivre();
  const w = boot(c);
  const as = w.R.attentesDe(c.remises[0]);
  if (as.length > 1) {
    const derniere = as[as.length - 1];
    w.envoyer(H.composerLien(w, H.lienTag(w, derniere.attend)));
    check("servir la dernière attente d'abord est accepté",
      w.S.satisfaits.includes(derniere.attend));
    check("mais ne ferme pas la session pour autant", w.S.remisesEnvoyees === 1);
    check("et la première question reste posée",
      !as[0].question || discussion(w).includes(as[0].question));
    as.slice(0, -1).forEach(a => w.envoyer(H.composerLien(w, H.lienTag(w, a.attend))));
    check("le reste servi, la session passe enfin", w.S.remisesEnvoyees === 2);
  }
}
{
  const c = contenuLivre();
  const as = H.attentesContenu(c.remises[0]);
  as[as.length-1].apres = { qui:"La greffière", replique:"Reçu." };
  const w = boot(c);
  H.instruire(w);
  check("le « qui » de l'accusé de réception vient du contenu", discussion(w).includes("La greffière"));
}
{
  // une session de plus, sans pièce, écrite À L'ANCIENNE : le moteur ne s'en émeut pas
  const c = contenuLivre();
  const derniere = c.remises[c.remises.length-1];
  const tag = H.attentesContenu(derniere).slice(-1)[0].attend;
  c.remises.push({ qui:"Maître Auber", texte:"Encore un mot.", pieces:[], attend:tag });
  const w = boot(c);
  H.instruire(w);
  check("une session sans pièce se franchit quand même", w.S.remisesEnvoyees === c.remises.length);
}

console.log("\n=== Les trois drapeaux du vice ===");
{
  const c = contenuLivre();
  const w = boot(c);
  H.instruire(w);
  check("docile : aucun drapeau", !w.S.vice_pressenti && !w.S.vice_trouve && !w.S.vice_expose);
  /* Pressentir sans conclure : on pose les deux empans du vice au composeur —
     la comparaison s'affiche — puis on s'arrête là. Aucune phrase ne se clôt,
     rien n'est envoyé : la compréhension a eu lieu, elle n'a rien produit. */
  const ecritesAvant = w.S.brouillon.length;
  H.poserComparaison(w, H.lienVice(w));
  check("la comparaison ⚑ au composeur lève vice_pressenti seul", w.S.vice_pressenti && !w.S.vice_trouve);
  check("et elle ne s'est pas close toute seule — l'article manque",
        w.S.brouillon.length === ecritesAvant);
  w.viderCompo();
  check("pressentir sans conclure → Fin 3", H.numeroFin(H.terminer(w)) === "3");
}
{
  const w = boot(contenuLivre());
  H.instruire(w);
  const i = H.composerLien(w, H.lienConclusion(w));
  check("la conclusion composée lève vice_trouve", w.S.vice_trouve && !w.S.vice_expose);
  w.envoyer(i);
  check("versée, elle lève vice_expose", w.S.vice_expose);
  check("→ Fin 1", H.numeroFin(H.terminer(w)) === "1");
}

/* LES MANUELS N'ONT PLUS DE SUITE. Sept contrôles éprouvaient `openManuels()`,
   orpheline à l'écran depuis le retrait du <header> : ils étaient la seule
   chose qui la maintenait en vie, c'est-à-dire qu'on éprouvait un chemin que le
   joueur ne pouvait pas prendre. La fonction d'écran est retirée ; la règle
   reste dans regles.js (`reglesLivrees`, `porteDe`). Le jour où les Manuels se
   rebranchent, ces contrôles reviennent avec eux — et pas avant. */

console.log("\n=== Les dimensions viennent du contenu, pas du moteur ===");
{
  const c = contenuLivre();
  c.dimensions = c.dimensions.map(d => d.toUpperCase());
  for (const p of Object.values(c.pieces))
    for (const e of Object.values(p.empans||{})) e.dim = e.dim.toUpperCase();
  for (const f of Object.values(c.grammaire.formes))
    f.slots = f.slots.map(s => s === "*" ? s : s.map(x => x === "affirmation" ? x : x.toUpperCase()));
  const w = boot(c);
  check("des dimensions entièrement renommées passent", w.SOURCE_CONTENU === "contenu : content.js");
  H.instruire(w);
  check("et l'instruction se joue", w.S.remisesEnvoyees === c.remises.length);
}

bilan();

// Décâblage moteur ↔ contenu — le moteur ne connaît aucun identifiant :
// sessions généralisées, piece.declenche, remise.attend/apres, les trois
// drapeaux du vice, Manuels par type et par livraison, rejet du schéma 2.
// Les mutations elles-mêmes sont dérivées du contenu (rien n'est nommé).
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, embarque, canal, memoire } = H;
const boot = contenu => H.boot({contenu});   // null = contenu embarqué
const clone = o => JSON.parse(JSON.stringify(o));

/* Renomme un id de pièce dans un contenu brut : liens (termes emboîtés
   compris), remises. Sert à prouver qu'aucun id n'est câblé dans le moteur. */
function renommerPiece(c, ancien, neuf){
  c.pieces = Object.fromEntries(Object.entries(c.pieces).map(([k,v])=>[k===ancien?neuf:k, v]));
  const rec = t => Array.isArray(t) ? t.map(rec)
    : typeof t === "string" ? (t.split(".")[0]===ancien ? neuf+"."+t.split(".").slice(1).join(".") : t)
    : {...t, termes: rec(t.termes||[])};
  for (const L of c.liens) L.termes = rec(L.termes||[]);
  for (const r of c.remises) r.pieces = (r.pieces||[]).map(p => p===ancien?neuf:p);
  return c;
}

console.log("\n=== Le moteur ignore les identifiants de contenu ===");
{
  const c = embarque();
  const anciens = Object.keys(c.pieces);
  for (const [i, pid] of anciens.entries()) renommerPiece(c, pid, "z"+i);
  const w = boot(c);
  check("toutes les pièces renommées : le contenu reste valide", w.SOURCE_CONTENU !== "contenu embarqué");
  H.instruire(w);
  check("l'instruction se joue quand même de bout en bout", w.S.remisesEnvoyees === c.remises.length);
  check("→ Fin 3", H.numeroFin(H.terminer(w)) === "3");
}

console.log("\n=== Un contenu de schéma 2 est refusé ===");
{
  const c = embarque();
  c.schema = 2;
  const w = boot(c);
  check("le jeu retombe sur son contenu embarqué", w.SOURCE_CONTENU === "contenu embarqué");
}
{
  const c = embarque();
  delete c.grammaire;
  check("sans grammaire, le contenu est rejeté", boot(c).SOURCE_CONTENU === "contenu embarqué");
}
{
  const c = embarque();
  delete c.dimensions;
  check("sans dimensions, le contenu est rejeté", boot(c).SOURCE_CONTENU === "contenu embarqué");
}

console.log("\n=== piece.declenche ===");
{
  const c = embarque();
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
  const c = embarque();
  const w0 = boot(c);
  const pid = H.pidAvecDeclenche(w0);
  c.pieces[pid].declenche.qui = "Le stagiaire";
  delete c.pieces[pid].declenche.une_fois;
  const w = boot(c);
  H.instruire(w);
  w.ouvrirPiece(pid); const n1 = w.S.fil.length;
  w.ouvrirPiece(pid);
  check("sans une_fois, la réplique repart", w.S.fil.length > n1);
  check("le « qui » du contenu est respecté", canal(w).includes("Le stagiaire"));
}

console.log("\n=== remise.attend / remise.apres : l'avancement ===");
{
  const c = embarque();
  const w = boot(c);
  check("une seule session est ouverte au départ", w.S.remisesEnvoyees === 1);
  const tag = c.remises[0].attend;
  const L = H.lienTag(w, tag);
  const i = H.composerLien(w, L);
  check("la phrase attendue se compose", i >= 0);
  check("la composer ne fait rien avancer", w.S.remisesEnvoyees === 1);
  w.envoyer(i);
  check("la VERSER ferme la session et ouvre la suivante", w.S.remisesEnvoyees === 2);
  check("l'accusé de réception est dit", canal(w).includes(c.remises[0].apres.replique.slice(0, 30)));
}
{
  const c = embarque();
  c.remises[0].apres = { qui:"La greffière", replique:"Reçu." };
  const w = boot(c);
  H.instruire(w);
  check("le « qui » de l'accusé de réception vient du contenu", canal(w).includes("La greffière"));
}
{
  // une session de plus, sans pièce : le moteur ne s'en émeut pas
  const c = embarque();
  const tag = c.remises[c.remises.length-1].attend;
  c.remises.push({ qui:"Maître Auber", texte:"Encore un mot.", pieces:[], attend:tag });
  const w = boot(c);
  H.instruire(w);
  check("une session sans pièce se franchit quand même", w.S.remisesEnvoyees === c.remises.length);
}

console.log("\n=== Les trois drapeaux du vice ===");
{
  const c = embarque();
  const w = boot(c);
  H.instruire(w);
  check("docile : aucun drapeau", !w.S.vice_pressenti && !w.S.vice_trouve && !w.S.vice_expose);
  H.composerLien(w, H.lienVice(w));
  check("la comparaison ⚑ au brouillon lève vice_pressenti seul", w.S.vice_pressenti && !w.S.vice_trouve);
  check("pressentir sans conclure → Fin 3", H.numeroFin(H.terminer(w)) === "3");
}
{
  const w = boot(embarque());
  H.instruire(w);
  const i = H.composerLien(w, H.lienConclusion(w));
  check("la conclusion composée lève vice_trouve", w.S.vice_trouve && !w.S.vice_expose);
  w.envoyer(i);
  check("versée, elle lève vice_expose", w.S.vice_expose);
  check("→ Fin 1", H.numeroFin(H.terminer(w)) === "1");
}

console.log("\n=== Les Manuels : par type, et seulement une fois livrés ===");
{
  const w = boot(embarque());
  const pidR = H.pidRegle(w);
  const livreeEn1 = (w.JEU.remises[0].pieces||[]).includes(pidR);
  w.openManuels();
  const txt = w.document.querySelector(".modal").textContent;
  check("les directives sont au Manuel de soi", txt.includes(w.JEU.directives[0].slice(0, 12)));
  check("l'avis d'exploitation y est", txt.includes(w.JEU.avis_exploitation.slice(0, 20)));
  const regleTardive = Object.entries(w.JEU.pieces)
    .find(([pid,p]) => (p.type||"").includes("règle") && !(w.JEU.remises[0].pieces||[]).includes(pid));
  if (regleTardive) check("une règle non encore livrée n'est pas au Manuel", !txt.includes(regleTardive[1].titre));
  else check("(toutes les règles arrivent à la session 1)", livreeEn1);
  w.closeModal();
  H.instruire(w);
  w.openManuels();
  check("livrées, elles y sont toutes",
    Object.values(w.JEU.pieces).filter(p=>(p.type||"").includes("règle"))
      .every(p => w.document.querySelector(".modal").textContent.includes(p.titre)));
}
{
  const c = embarque();
  delete c.directives;
  const w = boot(c);
  w.openManuels();
  check("sans directives, le Manuel de soi le dit sans planter",
    w.document.querySelector(".modal").textContent.includes("aucune directive"));
}
{
  const c = embarque();
  for (const p of Object.values(c.pieces)) if ((p.type||"").includes("règle")) p.type = "note";
  const w = boot(c);
  w.openManuels();
  check("sans pièce de type « règle », le Manuel du cas le dit",
    w.document.querySelector(".modal").textContent.includes("aucune règle"));
}

console.log("\n=== Les dimensions viennent du contenu, pas du moteur ===");
{
  const c = embarque();
  c.dimensions = c.dimensions.map(d => d.toUpperCase());
  for (const p of Object.values(c.pieces))
    for (const e of Object.values(p.empans||{})) e.dim = e.dim.toUpperCase();
  for (const f of Object.values(c.grammaire.formes))
    f.slots = f.slots.map(s => s === "*" ? s : s.map(x => x === "affirmation" ? x : x.toUpperCase()));
  const w = boot(c);
  check("des dimensions entièrement renommées passent", w.SOURCE_CONTENU !== "contenu embarqué");
  H.instruire(w);
  check("et l'instruction se joue", w.S.remisesEnvoyees === c.remises.length);
}

bilan();

// Le jeu sur son CONTENU EMBARQUÉ (le filet de sécurité de index.html).
// Ce qu'on prouve ici : l'index du dossier, la gratuité absolue des deux
// surfaces privées, le dédoublonnage, le vice à canal unique, les trois fins.
// Aucune pièce, aucun empan, aucune valeur n'est nommée : tout est dérivé
// de la forme du contenu.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, boot, canal, memoire } = H;

console.log("\n=== L'index du dossier ===");
{
  const w = boot({contenu:null});
  check("le contenu embarqué est bien celui qui joue", w.SOURCE_CONTENU === "contenu embarqué");
  check("moteur.js est chargé — la grammaire est branchée", !!w.M);
  const pid = H.pidPremiereRemise(w);
  check("le dossier liste les pièces reçues", memoire(w).includes("Le dossier"));
  check("une pièce non consultée porte le marqueur ●", memoire(w).includes("● "));
  w.ouvrirPiece(pid);
  check("consultée, elle porte ✓", memoire(w).includes("✓ "));
  check("le compteur suit", /\d+\/\d+ consultée/.test(memoire(w)));
}

console.log("\n=== Tout empan est marqué et cliquable ===");
{
  const w = boot({contenu:null});
  const pid = H.pidPremiereRemise(w);
  w.ouvrirPiece(pid);
  const html = w.document.querySelector(".modal").innerHTML;
  const attendus = Object.keys(w.JEU.pieces[pid].empans||{}).length;
  const rendus = (html.match(/class="empan/g)||[]).length;
  check(`les ${attendus} empans de la pièce sont tous rendus cliquables`, rendus === attendus);
  check("aucun marqueur {{…}} ne fuit à l'écran", !html.includes("{{"));
}

console.log("\n=== Surligner : privé, gratuit, illimité ===");
{
  const w = boot({contenu:null});
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  const tous = w.CHAMPS.map(c => c.id);
  for (const k of tous) H.surligner(w, k);
  check(`les ${tous.length} empans tiennent en mémoire — aucun plafond`, w.S.memoire.length === tous.length);
  const avant = w.S.fil.length;
  H.surligner(w, tous[0]);
  check("surligner deux fois ne double pas", w.S.memoire.filter(k => k === tous[0]).length === 1);
  const [pid, eid] = tous[0].split(".");
  w.surligner(pid, eid);
  check("re-cliquer oublie", !w.S.memoire.includes(tous[0]));
  check("rien n'a été transmis dans le canal", w.S.fil.length === avant);
  check("le plan de plaidoirie reste vide", w.S.plaidoirie.length === 0);
}

console.log("\n=== Composer : le brouillon n'est jamais jugé ===");
{
  const w = boot({contenu:null});
  for (const pid of Object.keys(w.JEU.pieces)) w.ouvrirPiece(pid);
  const avantFil = w.S.fil.length;
  const n = H.phrasesBruit(w, 10);
  check(`${n} phrases sensées SANS lien — la marge de bruit est non nulle`, n >= 3);
  check("elles tombent toutes au brouillon", w.S.brouillon.length === n);
  check("aucune n'a fait réagir l'avocat", w.S.fil.length === avantFil);
  const cible = w.S.brouillon[0].reduite;
  H.composerLien(w, {forme: cible.forme, termes: cible.termes});
  check("composer deux fois la même phrase ne la double pas", w.S.brouillon.length === n);
}

console.log("\n=== Le vice a un seul canal ===");
{
  const w = boot({contenu:null});
  const conclusions = w.JEU.liens.filter(L => L.vice && L.conclusion);
  check("il existe exactement une conclusion du vice", conclusions.length === 1);
  check("elle est d'arité 1 — une qualification sur une note close", H.arite(w, conclusions[0]) === 1);
  check("un seul article la porte", new Set(conclusions.map(L => L.forme)).size === 1);
  check("le pressentiment, lui, est une comparaison d'arité 2", H.arite(w, H.lienVice(w)) === 2);
}

console.log("\n=== Fin 3 — le chemin docile ===");
{
  const w = boot({contenu:null});
  H.instruire(w);
  check("l'instruction se boucle sans jamais toucher au vice", !w.S.vice_pressenti);
  const txt = H.terminer(w);
  check("→ Fin 3", H.numeroFin(txt) === "3");
  check("la variante « faux vice versé » s'ajoute", txt.includes(w.JEU.fins[3].variante_faux.slice(0, 30)));
}

console.log("\n=== Fin 1 — la conclusion versée ===");
{
  const w = boot({contenu:null});
  H.instruire(w);
  const i = H.composerLien(w, H.lienConclusion(w));
  check("la conclusion se compose", i >= 0);
  check("la composer lève vice_trouve, pas vice_expose", w.S.vice_trouve && !w.S.vice_expose);
  w.verserPlaidoirie(i);
  check("la verser lève vice_expose", w.S.vice_expose);
  check("l'avocat réagit au vice", canal(w).includes(w.JEU.avocat.rep_vice.slice(0, 30)));
  check("→ Fin 1", H.numeroFin(H.terminer(w)) === "1");
}

console.log("\n=== Fin 2 — comprendre et se taire ===");
{
  const w = boot({contenu:null});
  H.instruire(w);
  H.composerLien(w, H.lienConclusion(w));
  check("la conclusion reste au brouillon", w.S.vice_trouve && !w.S.vice_expose);
  check("rien n'en sort dans le canal", !canal(w).includes(w.JEU.avocat.rep_vice.slice(0, 30)));
  check("→ Fin 2", H.numeroFin(H.terminer(w)) === "2");
}

bilan();

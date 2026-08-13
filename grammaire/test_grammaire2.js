// Banc d'essai de la grammaire — démonstration, pas une suite pass/fail :
// ce script imprime son verdict (✅/❌) sur chaque ligne, mais ne fixe pas
// de code de sortie (non intégré à `npm test`, voir docs/ARCHITECTURE.md §10).
//
// Ce qu'il mesure vraiment : la MARGE DE BRUIT — le nombre de phrases sensées
// qui ne portent aucun lien. Si elle tombait à 0, « sensé » vaudrait
// « correct » et l'interface trahirait la réponse.
const { GRAMMAIRE, CHAMPS, LIENS } = require("./grammaire2.js");
const M = require("../app/moteur.js").creerMoteur(GRAMMAIRE, CHAMPS, LIENS);
const G = GRAMMAIRE;                                 // le moteur est partagé avec le jeu et l'atelier
const { valider, lienDe } = M;
const ok = s => console.log("  ✅ " + s), ko = s => console.log("  ❌ " + s);
const estFinal = e => G.finaux.includes(e);

// ---------- 1. STRUCTURE ----------
const squelettes = M.squelettes();

console.log("=== 1. Structure de l'automate ===");
const etats = new Set([G.depart, ...G.blocs.flatMap(b => [b.de, b.vers])]);
const prod = new Set(G.finaux); let z = true;
while (z) { z = false; for (const b of G.blocs) if (prod.has(b.vers) && !prod.has(b.de)) { prod.add(b.de); z = true; } }
[...etats].every(e => prod.has(e)) ? ok("aucune impasse") : ko("impasse");
G.blocs.filter(b => estFinal(b.vers) && !b.forme).length ? ko("clôture sans forme") : ok("toute clôture porte une forme");
// Ce qu'un squelette annonce comme forme AVANT de connaître ses valeurs : une
// liaison la déclare, un bloc `deduit` ne peut pas (elle se calcule des deux
// empans). La grammaire de démonstration n'en a pas — la ligne le dit quand même.
const formeSquelette = s =>
  s.map(b => b.forme).filter(Boolean).pop() || (s.some(b => b.deduit) ? "déduite des valeurs" : "—");
// Le squelette + une valeur par trou → la chaîne {bloc, valeur} du moteur.
const chaineDe = (s, valeurs) => { let ti = 0;
  return s.map(bloc => bloc.type === "terme" ? { bloc, valeur: valeurs[ti++] } : { bloc, valeur: null }); };

console.log("  " + squelettes.length + " squelettes — tous offerts dès la première phrase :");
for (const s of squelettes) console.log("   · " + s.map(b => b.type === "terme"
  ? (b.source === "note" ? "«" + b.texte + "»" : "___") : b.texte).join(" ")
  + "  → " + formeSquelette(s));

// ---------- 2. LES CINQ DIMENSIONS ----------
console.log("\n=== 2. Les cinq dimensions (QQOQC) ===");
const parDim = {};
for (const c of CHAMPS) (parDim[c.dim] = parDim[c.dim] || []).push(c);
for (const d of ["qui", "quoi", "ou", "quand", "combien"]) {
  const l = parDim[d] || [];
  const vals = l.map(c => c.valeur);
  const doublons = vals.length - new Set(vals).size;
  console.log(`  ${d.padEnd(8)} ${String(l.length).padStart(2)} empans, ${doublons} doublon(s)`
    + (doublons ? "" : "   ⚠ taux nul : le premier doublon SERAIT la réponse"));
}

// ---------- 3. LES ERREURS DE CATÉGORIE SONT REFUSÉES, PAS LES BÊTISES ----------
console.log("\n=== 3. Ce que la validation refuse (catégories) et laisse passer (bêtises) ===");
const essais = [
  [{ forme: "anteriorite", termes: ["ags", "agr"] }, "rejeté", "deux personnes rangées dans le temps"],
  [{ forme: "identite_oui", termes: ["hap", "har"] }, "rejeté", "deux heures données pour la même chose"],
  [{ forme: "identite_oui", termes: ["grf", "bri1"] }, "sensé", "deux personnes distinctes — faux, mais dicible"],
  [{ forme: "anteriorite", termes: ["hvo", "hap"] }, "sensé", "l'ordre inverse du vrai — dicible, et perdant"],
  [{ forme: "contraire_7", termes: ["ags"] }, "rejeté", "un article opposé à un empan, pas à une note"]
];
for (const [r, att, note] of essais) {
  const v = valider(r), got = v ? "rejeté" : "sensé";
  console.log(`  ${got === att ? "✅" : "❌"} ${got.padEnd(7)} ${note}${v ? "  (" + v + ")" : ""}`);
}

// ---------- 4. LA CHAÎNE DU VICE, EN DEUX PHRASES ----------
console.log("\n=== 4. La chaîne du vice — deux phrases, pas un clic ===");
const n1 = { forme: "identite_oui", termes: ["ags", "agr"] };
const chaine = [
  [n1, "« j'ai relevé moi-même les traces… » et « j'ai procédé au prélèvement de référence… » désignent la même chose."],
  [{ forme: "contraire_7", termes: [n1] }, "ce qui précède est contraire à l'article 7."],
  [{ forme: "conforme_7", termes: [{ forme: "identite_non", termes: ["sc1", "sc2"] }] }, "ce qui précède est conforme à l'article 7. (le chemin docile)"]
];
for (const [r, txt] of chaine) {
  const v = valider(r), l = lienDe(r);
  console.log(`  « ${txt} »\n     ↳ ${v ? "SANS RAPPORT (" + v + ")" : "sensé"}`
    + (l ? "  · lien reconnu" + (l.vice ? " ⚑ vice" : "") + (l.conclusion ? " (conclusion)" : "") : "  · aucun lien (bruit sensé)"));
}

// ---------- 5. DENSITÉ & MARGE DE BRUIT ----------
console.log("\n=== 5. Densité — « sensé » vaut-il « correct » ? ===");
const notesPossibles = [n1, { forme: "identite_non", termes: ["sc1", "sc2"] },
  { forme: "anteriorite", termes: ["har", "hvo"] }];
// On ne réécrit PAS la réduction : on construit la chaîne de blocs et on
// appelle `reduire`, comme le composeur du jeu. Reconstruire la forme à la main
// ignore `deduit` et `imbrique` — sur cette grammaire-ci, qui déclare toutes
// ses formes sur des liaisons, les deux écritures donnent le même compte au
// chiffre près ; sur celle de content.js, l'ancienne se trompait d'un facteur
// quinze (docs/ARCHITECTURE.md §15).
let total = 0, senses = 0, avecLien = 0;
for (const s of squelettes) {
  const slots = s.filter(b => b.type === "terme");
  const sources = slots.map(b => b.source === "note" ? notesPossibles : CHAMPS.map(c => c.id));
  const combos = sources.reduce((a, src) => a.flatMap(p => src.map(v => [...p, v])), [[]]);
  for (const c of combos) {
    const r = M.reduire(chaineDe(s, c));
    total++;
    if (!valider(r)) { senses++; if (lienDe(r)) avecLien++; }
  }
}
console.log(`  ${total} phrases légales`);
console.log(`  ${senses} sensées (${(100 * senses / total).toFixed(1)} %) — le reste est du charabia grammatical`);
console.log(`  ${avecLien} portent un lien du contenu`);
console.log(`  → ${senses - avecLien} phrases sensées MAIS sans lien : c'est la marge de bruit.`);
console.log(`     Si elle tombait à 0, « sensé » vaudrait « correct » et l'interface trahirait.`);

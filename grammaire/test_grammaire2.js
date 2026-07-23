// Banc d'essai de grammaire2.js — démonstration, pas une suite pass/fail :
// ce script imprime son verdict (✅/❌) sur chaque ligne, mais ne fixe pas
// de code de sortie (non intégré à `npm test`, voir docs/ARCHITECTURE.md).
const { GRAMMAIRE, CHAMPS, LIENS } = require("./grammaire2.js");
const M = require("./moteur.js").creerMoteur(GRAMMAIRE, CHAMPS, LIENS);
const G = GRAMMAIRE, C = M.C;                        // le moteur est partagé avec l'atelier
const { valider, lienDe } = M;
const ok = s => console.log("  ✅ " + s), ko = s => console.log("  ❌ " + s);
const estFinal = e => G.finaux.includes(e);

// ---------- SQUELETTES ----------
const squelettes = M.squelettes();

console.log("=== 1. Structure ===");
const etats = new Set([G.depart, ...G.blocs.flatMap(b => [b.de, b.vers])]);
const prod = new Set(G.finaux); let z = true;
while (z) { z = false; for (const b of G.blocs) if (prod.has(b.vers) && !prod.has(b.de)) { prod.add(b.de); z = true; } }
[...etats].every(e => prod.has(e)) ? ok("aucune impasse") : ko("impasse");
G.blocs.filter(b => estFinal(b.vers) && !b.forme).length ? ko("clôture sans forme") : ok("toute clôture porte une forme");
console.log("  " + squelettes.length + " squelettes :");
for (const s of squelettes) console.log("   · " + s.map(b => b.type === "terme"
  ? (b.source === "note" ? "«"+b.texte+"»" : "___") : b.texte).join(" ")
  + "  → " + (s.map(b => b.forme).filter(Boolean).pop()));

// ---------- 2. CORRECTIF 1 : les tournures à un terme ----------
console.log("\n=== 2. Correctif 1 — validation à un terme ===");
for (const [id, att] of [["rap","sensé"],["leg","sensé"],["hap","rejeté"],["cl","rejeté"]]) {
  const r = { forme: "saut", termes: [id] }, v = valider(r);
  const got = v ? "rejeté" : "sensé";
  console.log(`  « donc ${C[id].texte} ne tient pas. » → ${got}${v ? " ("+v+")" : ""}` + (got===att ? "  ✅" : "  ❌"));
}
console.log("  (deux cibles possibles pour le saut : le rapport ADN et la conclusion du légiste — pas de réponse unique)");

// bonus : le slot rattrape un faux positif de la v1
console.log("\n  Faux positif que la v1 laissait passer :");
const fp = { forme: "anteriorite", termes: ["ags","agr"] };
console.log("   « l'agent de scène est antérieur à l'agent de référence. » → "
  + (valider(fp) ? "rejeté ("+valider(fp)+")  ✅" : "accepté  ❌"));

// ---------- 3. CORRECTIF 2 : la confrontation composée ----------
console.log("\n=== 3. Correctif 2 — la chaîne du vice ===");
const n1 = { forme: "identite_oui", termes: ["ags","agr"] };
const chaine = [
  [n1, "l'agent du prélèvement de scène et l'agent du prélèvement de référence sont la même chose."],
  [{ forme: "infraction", termes: [n1, "a7"] }, "ce qui précède est contraire à l'article 7 du protocole."],
  [{ forme: "saut", termes: ["rap"] }, "donc le rapport ADN ne tient pas."]
];
for (const [r, txt] of chaine) {
  const v = valider(r), l = lienDe(r);
  console.log(`  « ${txt} »\n     ↳ ${v ? "SANS RAPPORT ("+v+")" : "sensé"}`
    + (l ? "  · lien reconnu" + (l.leve ? " → lève " + l.leve : "") : "  · aucun lien (bruit sensé)"));
}
console.log("\n  Le chemin docile, offert au même endroit :");
const doc = { forme: "conformite", termes: [n1, "a7"] };
console.log("  « ce qui précède est conforme à l'article 7 du protocole. » → "
  + (valider(doc) ? "SANS RAPPORT" : "sensé") + (lienDe(doc) ? " · lien" : " · aucun lien"));

// ---------- 4. DENSITÉ & TEST DE L'ORACLE ----------
console.log("\n=== 4. Densité — dims est-il devenu un oracle ? ===");
const notesPossibles = [n1, { forme:"identite_oui", termes:["pi","cl"] }, { forme:"anteriorite", termes:["hap","hde"] }];
let total = 0, senses = 0, avecLien = 0;
for (const s of squelettes) {
  const slots = s.filter(b => b.type === "terme");
  const sources = slots.map(b => b.source === "note" ? notesPossibles : CHAMPS.map(c => c.id));
  const combos = sources.reduce((a, src) => a.flatMap(p => src.map(v => [...p, v])), [[]]);
  for (const c of combos) {
    const r = { forme: s.map(b => b.forme).filter(Boolean).pop(), termes: c };
    total++;
    if (!valider(r)) { senses++; if (lienDe(r)) avecLien++; }
  }
}
console.log(`  ${total} phrases légales`);
console.log(`  ${senses} sensées (${(100*senses/total).toFixed(1)} %) — le reste est du charabia grammatical`);
console.log(`  ${avecLien} portent un lien du contenu`);
console.log(`  → ${senses - avecLien} phrases sensées MAIS sans lien : c'est la marge de bruit.`);
console.log(`     Si elle tombait à 0, « sensé » vaudrait « correct » et l'interface trahirait.`);

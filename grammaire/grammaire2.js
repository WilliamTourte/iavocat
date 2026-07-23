// Grammaire v2 — corrige (1) la validation des tournures à un terme
// et (2) la confrontation à la règle, via un terme qui peut être une NOTE.
//
// Prototype autonome, NON branché sur app/index.html : le jeu utilise
// toujours le geste champ+relation+champ. Voir docs/PASSATION.md pour
// le plan d'intégration (noter() → composer()).

const GRAMMAIRE = {
  depart: "S0",
  finaux: ["FIN"],
  blocs: [
    // --- entrées ---
    { id: "t0",   type: "terme",   source: "champ", de: "S0",  vers: "S1" },
    { id: "prec", type: "terme",   source: "note",  de: "S0",  vers: "SP", texte: "ce qui précède" },
    { id: "rien", type: "liaison", de: "S0",  vers: "SR",  texte: "rien n'établit" },
    { id: "donc", type: "liaison", de: "S0",  vers: "SD",  texte: "donc" },

    // --- arité 1 ---
    { id: "tR",   type: "terme",   source: "champ", de: "SR",  vers: "FIN", forme: "non_etabli" },
    { id: "tD",   type: "terme",   source: "champ", de: "SD",  vers: "SD2" },
    { id: "ntp",  type: "liaison", de: "SD2", vers: "FIN", texte: "ne tient pas", forme: "saut" },

    // --- confrontation à la règle (O2 : bâtit sur la phrase précédente) ---
    { id: "cont", type: "liaison", de: "SP",  vers: "SPa", texte: "est contraire à" },
    { id: "conf", type: "liaison", de: "SP",  vers: "SPb", texte: "est conforme à" },
    { id: "tPa",  type: "terme",   source: "champ", de: "SPa", vers: "FIN", forme: "infraction" },
    { id: "tPb",  type: "terme",   source: "champ", de: "SPb", vers: "FIN", forme: "conformite" },

    // --- arité 2 ---
    { id: "et",   type: "liaison", de: "S1",  vers: "S2a", texte: "et" },
    { id: "dev",  type: "liaison", de: "S1",  vers: "S2b", texte: "devrait être" },
    { id: "ant",  type: "liaison", de: "S1",  vers: "S2c", texte: "est antérieur à" },
    { id: "att",  type: "liaison", de: "S1",  vers: "S2d", texte: "n'est attesté que par" },

    { id: "t2a",  type: "terme",   source: "champ", de: "S2a", vers: "S3" },
    { id: "mm",   type: "liaison", de: "S3",  vers: "FIN", texte: "sont la même chose",        forme: "identite_oui" },
    { id: "nmm",  type: "liaison", de: "S3",  vers: "FIN", texte: "ne sont pas la même chose", forme: "identite_non" },

    { id: "t2b",  type: "terme",   source: "champ", de: "S2b", vers: "S4" },
    { id: "nlp",  type: "liaison", de: "S4",  vers: "FIN", texte: "et ne l'est pas", forme: "identite_non" },

    { id: "t2c",  type: "terme",   source: "champ", de: "S2c", vers: "FIN", forme: "anteriorite" },
    { id: "t2d",  type: "terme",   source: "champ", de: "S2d", vers: "FIN", forme: "attestation" }
  ],

  // CORRECTIF 1 : chaque forme déclare ce qu'elle admet, slot par slot.
  // "*" = toute dimension. La liste rejette les erreurs de CATÉGORIE, pas les
  // affirmations inintéressantes. Aucune liste d'options n'est restreinte : le
  // joueur peut toujours tout poser, c'est la phrase obtenue qui ne dit rien.
  formes: {
    identite_oui: { arite: 2, ordonne: false, slots: ["*", "*"], relation: "meme_dim" },
    identite_non: { arite: 2, ordonne: false, slots: ["*", "*"], relation: "meme_dim" },
    anteriorite:  { arite: 2, ordonne: true,  slots: [["heure"], ["heure"]] },
    attestation:  { arite: 2, ordonne: true,  slots: [["personne","heure","agent"], ["source","conclusion"]] },
    non_etabli:   { arite: 1, ordonne: false, slots: [["personne","heure","agent"]] },
    saut:         { arite: 1, ordonne: false, slots: [["conclusion"]] },
    infraction:   { arite: 2, ordonne: true,  slots: [["affirmation"], ["regle"]] },
    conformite:   { arite: 2, ordonne: true,  slots: [["affirmation"], ["regle"]] }
  }
};

const CHAMPS = [
  { id: "cl",  texte: "le client",                           dim: "personne"   },
  { id: "pi",  texte: "la personne interpellée",             dim: "personne"   },
  { id: "hap", texte: "l'heure de l'appel",                  dim: "heure"      },
  { id: "hde", texte: "l'heure du décès",                    dim: "heure"      },
  { id: "ags", texte: "l'agent du prélèvement de scène",     dim: "agent"      },
  { id: "agr", texte: "l'agent du prélèvement de référence", dim: "agent"      },
  { id: "a3",  texte: "l'article 3 du protocole",            dim: "regle"      },
  { id: "a7",  texte: "l'article 7 du protocole",            dim: "regle"      },
  { id: "rap", texte: "le rapport ADN",                      dim: "conclusion" },
  { id: "leg", texte: "la conclusion du légiste",            dim: "conclusion" },
  { id: "tem", texte: "le témoignage du voisin",             dim: "source"     }
];

// Les liens du contenu : ce que l'avocat reconnaît. Le reste est du bruit sensé.
const LIENS = [
  { forme: "identite_oui", termes: ["pi", "cl"]  },
  { forme: "identite_oui", termes: ["ags", "agr"], leve: "vice_pressenti" },
  { forme: "anteriorite",  termes: ["hap", "hde"] },
  { forme: "infraction",   termes: [{ forme: "identite_oui", termes: ["ags","agr"] }, "a7"], leve: "vice_trouve" },
  { forme: "saut",         termes: ["rap"] }
];

// Mode double : chargeable en Node (`require`) comme dans un navigateur
// (`<script src>`), pour que le banc d'essai ET l'atelier lisent la MÊME
// définition — pas de copie qui divergerait.
const _data = { GRAMMAIRE, CHAMPS, LIENS };
if (typeof module !== "undefined" && module.exports) module.exports = _data;
if (typeof window !== "undefined") window.Grammaire = _data;

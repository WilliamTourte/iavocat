// Jeu de données de DÉMONSTRATION pour la grammaire — pas le contenu joué.
// Le contenu réel porte la sienne (`JEU.grammaire`, §11) ; ce fichier sert au
// banc d'essai et à l'onglet « Grammaire », qui mesurent la marge de bruit sur
// un échantillon stable. Le moteur, lui, est partagé : ../app/moteur.js.

const GRAMMAIRE = {
  depart: "S0",
  finaux: ["FIN"],
  blocs: [
    // --- entrées : un empan de la mémoire, ou une note déjà close ---
    { id: "t0",   type: "terme",   source: "champ", de: "S0",  vers: "S1" },
    { id: "prec", type: "terme",   source: "note",  de: "S0",  vers: "SP", texte: "ce qui précède" },

    // --- Identité (qui / quoi / où) : arite 2, non ordonnée ---
    { id: "et",   type: "liaison", de: "S1",  vers: "S2a", texte: "et" },
    { id: "t2a",  type: "terme",   source: "champ", de: "S2a", vers: "S3" },
    { id: "mm",   type: "liaison", de: "S3",  vers: "FIN", texte: "désignent la même chose",        forme: "identite_oui" },
    { id: "nmm",  type: "liaison", de: "S3",  vers: "FIN", texte: "ne désignent pas la même chose", forme: "identite_non" },

    // --- Écart (quand / combien) : arite 2, ordonnée ---
    { id: "ant",  type: "liaison", de: "S1",  vers: "S2c", texte: "est antérieur à" },
    { id: "t2c",  type: "terme",   source: "champ", de: "S2c", vers: "FIN", forme: "anteriorite" },
    { id: "ecr",  type: "liaison", de: "S1",  vers: "S2e", texte: "est d'un tout autre ordre que" },
    { id: "t2e",  type: "terme",   source: "champ", de: "S2e", vers: "FIN", forme: "ordre_grandeur" },

    // --- Qualification : arite 1, sur une note close. La LIAISON est la base
    //     légale (§4.5) : l'article est le verbe, pas un ingrédient. ---
    { id: "c7",   type: "liaison", de: "SP",  vers: "FIN", texte: "est contraire à l'article 7", forme: "contraire_7" },
    { id: "k7",   type: "liaison", de: "SP",  vers: "FIN", texte: "est conforme à l'article 7",  forme: "conforme_7"  },
    { id: "c3",   type: "liaison", de: "SP",  vers: "FIN", texte: "est contraire à l'article 3", forme: "contraire_3" }
  ],

  formes: {
    identite_oui:  { arite: 2, ordonne: false, slots: [["qui","quoi","ou"], ["qui","quoi","ou"]], relation: "meme_dim" },
    identite_non:  { arite: 2, ordonne: false, slots: [["qui","quoi","ou"], ["qui","quoi","ou"]], relation: "meme_dim" },
    anteriorite:   { arite: 2, ordonne: true,  slots: [["quand"], ["quand"]] },
    ordre_grandeur:{ arite: 2, ordonne: true,  slots: [["combien"], ["combien"]] },
    contraire_7:   { arite: 1, ordonne: false, slots: [["affirmation"]] },
    conforme_7:    { arite: 1, ordonne: false, slots: [["affirmation"]] },
    contraire_3:   { arite: 1, ordonne: false, slots: [["affirmation"]] }
  }
};

const CHAMPS = [
  { id: "ags",  dim: "qui",     valeur: "T-14",        qui: "agent T-14",   texte: "j'ai relevé moi-même les traces sur le montant de la porte" },
  { id: "agr",  dim: "qui",     valeur: "T-14",        qui: "agent T-14",   texte: "j'ai procédé au prélèvement de référence sur le mis en cause" },
  { id: "bri1", dim: "qui",     valeur: "brigadier N.",qui: "brigadier N.", texte: "constatations faites par mes soins" },
  { id: "bri2", dim: "qui",     valeur: "brigadier N.",qui: "brigadier N.", texte: "audition reçue par mes soins" },
  { id: "grf",  dim: "qui",     valeur: "J. Morel",    qui: "J. Morel",     texte: "j'ai réceptionné les scellés au greffe" },
  { id: "grf2", dim: "qui",     valeur: "J. Morel",    qui: "J. Morel",     texte: "j'ai contresigné le registre de garde" },
  { id: "sc1",  dim: "quoi",    valeur: "S-2",         qui: "agent T-14",   texte: "sous scellé S-2" },
  { id: "sc2",  dim: "quoi",    valeur: "S-7",         qui: "agent T-14",   texte: "sous scellé S-7" },
  { id: "sc3",  dim: "quoi",    valeur: "S-2",         qui: "J. Morel",     texte: "le scellé S-2 m'a été remis intact" },
  { id: "prt",  dim: "ou",      valeur: "porte",       qui: "agent T-14",   texte: "sur le montant de la porte" },
  { id: "prt2", dim: "ou",      valeur: "porte",       qui: "brigadier N.", texte: "la porte ne portait aucune trace d'effraction" },
  { id: "pal",  dim: "ou",      valeur: "palier",      qui: "brigadier N.", texte: "dans le couloir du palier" },
  { id: "hap",  dim: "quand",   valeur: "21:52",       qui: "brigadier N.", texte: "l'appel nous est parvenu à 21h52" },
  { id: "har",  dim: "quand",   valeur: "22:04",       qui: "brigadier N.", texte: "nous étions sur place à 22h04" },
  { id: "har2", dim: "quand",   valeur: "22:04",       qui: "le voisin",    texte: "il était 22h04 à ma pendule quand j'ai regardé" },
  { id: "hvo",  dim: "quand",   valeur: "22:30",       qui: "le voisin",    texte: "j'ai entendu des éclats de voix vers 22h30" },
  { id: "veh",  dim: "combien", valeur: "2",           qui: "le voisin",    texte: "il y avait déjà deux véhicules en bas" },
  { id: "veh2", dim: "combien", valeur: "2",           qui: "brigadier N.", texte: "deux équipages ont été engagés" },
  { id: "tx",   dim: "combien", valeur: "1.2e9",       qui: "le laboratoire", texte: "une chance sur 1,2 milliard qu'il s'agisse d'un tiers" },
  { id: "seu",  dim: "combien", valeur: "1e6",         qui: "le protocole", texte: "au-delà d'une chance sur un million, la correspondance est réputée probante" }
];

const NOTE_VICE = { forme: "identite_oui", termes: ["ags", "agr"] };
const NOTE_SCELLES = { forme: "identite_non", termes: ["sc1", "sc2"] };

const LIENS = [
  { forme: "anteriorite",   termes: ["har", "hvo"] },
  { forme: "identite_oui",  termes: ["ags", "agr"], vice: true },
  { forme: "contraire_7",   termes: [NOTE_VICE], vice: true, conclusion: true },
  { forme: "identite_non",  termes: ["sc1", "sc2"] },
  { forme: "conforme_7",    termes: [NOTE_SCELLES] },
  { forme: "ordre_grandeur",termes: ["tx", "seu"], faux: true }
];

const _data = { GRAMMAIRE, CHAMPS, LIENS };
if (typeof module !== "undefined" && module.exports) module.exports = _data;
if (typeof window !== "undefined") window.Grammaire = _data;

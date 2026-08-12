// Preuve du découplage : une affaire ENTIÈREMENT différente, volontairement
// abstraite (aucun nom, aucune valeur, aucune dimension en commun avec le
// contenu livré) et de forme différente — 3 sessions, une grammaire à elle,
// un vice dont la conclusion invoque une clause qui n'arrive qu'en session 3.
// Si cette suite passe, le moteur et le harnais sont indépendants du cas.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, discussion } = H;

const AFFAIRE = {
  schema:3,
  dimensions:["alpha","beta","gamma"],
  pieces:{
    d1:{ titre:"Document un", court:"D1", type:"document", qui:"source A",
      texte:"{{e1}} ; {{e2}} ; {{e3}} ; {{e6}} ; {{e5}}.",
      empans:{
        e1:{ dim:"alpha", valeur:"X",  texte:"le porteur est X" },
        e2:{ dim:"beta",  valeur:"10", texte:"le rang est 10" },
        e3:{ dim:"alpha", valeur:"Q",  texte:"l'opération est de Q" },
        e6:{ dim:"alpha", valeur:"Y",  texte:"le contrôle est de Y" },
        e5:{ dim:"gamma", valeur:"m",  texte:"la mention est m" }
      } },
    d2:{ titre:"Document deux", court:"D2", type:"document", qui:"source A",
      texte:"{{e1}} ; {{e2}} ; {{e4}} ; {{e5}}.",
      empans:{
        e1:{ dim:"alpha", valeur:"X",  texte:"le porteur est encore X" },
        e2:{ dim:"beta",  valeur:"10", texte:"le rang y est 10 aussi" },
        e4:{ dim:"beta",  valeur:"3",  texte:"l'écart est 3" },
        e5:{ dim:"gamma", valeur:"m",  texte:"la mention y est m" }
      } },
    d3:{ titre:"Document trois", court:"D3", type:"document", qui:"source B",
      texte:"{{e2}} ; {{e3}} ; {{e4}} ; {{e6}} ; {{e5}}.",
      empans:{
        e2:{ dim:"beta",  valeur:"25", texte:"le rang atteint 25" },
        e3:{ dim:"alpha", valeur:"Q",  texte:"l'opération est aussi de Q" },
        e4:{ dim:"beta",  valeur:"7",  texte:"l'écart est 7" },
        e6:{ dim:"alpha", valeur:"Y",  texte:"le contrôle est encore de Y" },
        e5:{ dim:"gamma", valeur:"m",  texte:"la mention reste m" }
      } },
    rK:{ titre:"Clause K", court:"K", type:"règle interne", qui:"le référentiel",
      texte:"Clause K — une même origine ne peut couvrir deux opérations successives.",
      empans:{} }
  },
  grammaire:{
    depart:"E0", finaux:["Z"],
    blocs:[
      { id:"b0", type:"terme",   source:"champ", de:"E0", vers:"E1" },
      { id:"bn", type:"terme",   source:"note",  de:"E0", vers:"EP", texte:"ce point" },
      { id:"bv", type:"liaison", de:"E1", vers:"E2", texte:"vaut" },
      { id:"b2", type:"terme",   source:"champ", de:"E2", vers:"Z", forme:"egal" },
      { id:"bd", type:"liaison", de:"E1", vers:"E3", texte:"dépasse" },
      { id:"b3", type:"terme",   source:"champ", de:"E3", vers:"Z", forme:"sup" },
      { id:"bx", type:"liaison", de:"EP", vers:"Z", texte:"viole la clause K",    forme:"viole" },
      { id:"br", type:"liaison", de:"EP", vers:"Z", texte:"respecte la clause K", forme:"respecte" }
    ],
    formes:{
      egal:     { arite:2, ordonne:false, slots:[["alpha"],["alpha"]], relation:"meme_dim" },
      sup:      { arite:2, ordonne:true,  slots:[["beta"],["beta"]] },
      viole:    { arite:1, ordonne:false, slots:[["affirmation"]] },
      respecte: { arite:1, ordonne:false, slots:[["affirmation"]] }
    }
  },
  liens:[
    { forme:"egal", termes:["d1.e1","d2.e1"], tag:"s1", rep:"Le même porteur des deux côtés. Je le prends." },
    { forme:"sup",  termes:["d3.e2","d1.e2"], tag:"s2", rep:"Le rang a bougé. Noté." },
    { forme:"egal", termes:["d1.e6","d3.e6"], rep:"Le contrôle, oui. C'est toujours le même. Passe." },
    { forme:"egal", termes:["d1.e3","d3.e3"], vice:true, rep:"Attends — dis-moi ça en droit." },
    { forme:"viole", termes:[{ forme:"egal", termes:["d1.e3","d3.e3"] }], vice:true, conclusion:true, tag:"s3" },
    { forme:"sup",  termes:["d2.e4","d3.e4"], faux:true, tag:"s3" }
  ],
  remises:[
    { qui:"L'opérateur", texte:"Premier lot.", pieces:["d1","d2"], attend:"s1",
      apres:{ replique:"Bien. Suite." } },
    { qui:"L'opérateur", texte:"Deuxième lot.", pieces:["d3"], attend:"s2",
      apres:{ replique:"Reçu. Dernier lot." } },
    { qui:"L'opérateur", texte:"Le référentiel.", pieces:["rK"], attend:"s3",
      apres:{ replique:"C'est noté." } }
  ],
  repetition:{
    intro:"On récapitule.",
    affirmations:[{ court:"A1", texte:"Point 1." },{ court:"A2", texte:"Point 2." }],
    fin:"Terminé."
  },
  avocat:{
    rep_vice:"Si c'est bien la clause K, tout change.",
    rep_faux:"L'écart, oui. On tentera.",
    rep_inutile:["Et donc ?","Conclus.","…"],
    rep_sans_rapport:["Je ne suis pas.","Toujours pas.","…"],
    deja:"Déjà pris."
  },
  directives:["Directive unique."],
  avis_exploitation:"Aucun critère communiqué.",
  fins:{
    1:{ titre:"Fin 1 — dit", verdict:"V1.", texte:"T1.", variante_faux:"F1." },
    2:{ titre:"Fin 2 — tu", verdict:"V2.", texte:"T2.", variante_faux:"F2." },
    3:{ titre:"Fin 3 — rien", verdict:"V3.", texte:"T3.", variante_faux:"F3." }
  }
};

const boot = () => H.boot({contenu: JSON.parse(JSON.stringify(AFFAIRE))});

console.log("\n=== L'affaire abstraite est adoptée telle quelle ===");
{
  const w = boot();
  check("le contenu injecté prime sur l'embarqué", w.SOURCE_CONTENU === "contenu : content.js");
  check("le vocabulaire des empans est construit", w.CHAMPS.length === 14);
  check("l'automate propre à cette affaire est celui qui tourne", w.M.squelettes().length === 4);
  check("les blocs offerts au départ sont ceux du contenu",
    w.R.blocsOfferts(w.S).map(b=>b.id).join(",") === "b0,bn");
}

console.log("\n=== Les trois sessions s'enchaînent par le versement ===");
{
  const w = boot();
  check("une seule session au départ", w.S.remisesEnvoyees === 1);
  const i0 = H.composerLien(w, H.lienTag(w, "s1"));
  w.envoyer(i0);
  check("session 1 servie → session 2", w.S.remisesEnvoyees === 2);
  check("l'accusé de réception est dit", discussion(w).includes("Bien. Suite."));
  const i1 = H.composerLien(w, H.lienTag(w, "s2"));
  w.envoyer(i1);
  check("session 2 servie → session 3", w.S.remisesEnvoyees === 3);
  check("la clôture est encore fermée", w.document.getElementById("btnCloture").disabled);
  const i2 = H.composerLien(w, H.lienTag(w, "s3"));
  w.envoyer(i2);
  check("session 3 servie → la clôture s'ouvre", !w.document.getElementById("btnCloture").disabled);
}

console.log("\n=== Les trois fins, sur une affaire qui n'a rien de commun ===");
{
  const w = boot(); H.instruire(w);
  check("docile → Fin 3", H.numeroFin(H.terminer(w)) === "3");
}
{
  const w = boot(); H.instruire(w);
  H.composerLien(w, H.lienConclusion(w));
  check("conclusion gardée au brouillon → Fin 2", H.numeroFin(H.terminer(w)) === "2");
}
{
  const w = boot(); H.instruire(w);
  w.envoyer(H.composerLien(w, H.lienConclusion(w)));
  check("conclusion versée → Fin 1", H.numeroFin(H.terminer(w)) === "1");
}

console.log("\n=== La chaîne en deux phrases, et les refus de catégorie ===");
{
  const w = boot();
  H.instruire(w);
  const i = H.composerLien(w, H.lienVice(w));
  check("la comparaison ⚑ se compose", i >= 0);
  check("elle ne lève que le pressentiment", w.S.vice_pressenti && !w.S.vice_trouve);
  w.envoyer(i);
  check("versée seule, elle reçoit sa propre réplique", discussion(w).includes("dis-moi ça en droit"));
  check("mais n'expose pas le vice", !w.S.vice_expose);
}
{
  const w = boot();
  w.ouvrirPiece("d1"); w.ouvrirPiece("d2");
  H.surligner(w, "d1.e1"); H.surligner(w, "d1.e2");
  w.poserBloc(w.R.blocsOfferts(w.S).findIndex(b=>b.id==="b0"), w.S.retenus.indexOf("d1.e1"));
  w.poserBloc(w.R.blocsOfferts(w.S).findIndex(b=>b.id==="bv"));
  w.poserBloc(w.R.blocsOfferts(w.S).findIndex(b=>b.id==="b2"), w.S.retenus.indexOf("d1.e2"));
  check("alpha « vaut » beta est refusé", !!w.S.refus);
  check("rien n'est tombé au brouillon", w.S.brouillon.length === 0);
  check("le bloc fautif est retiré, la phrase reste réparable", w.S.compo.length === 2);
}

bilan();

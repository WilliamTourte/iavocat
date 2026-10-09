// Fumée de l'atelier v3 — jsdom. Rien du contenu n'est nommé : les cibles sont
// dérivées de sa FORME, pour survivre à un changement complet d'affaire.
const H = require("./harnais").creerHarnais(__dirname+"/../app");
const { check, bilan, surContenu:SC, estRegle } = H;
const neuf = () => { const w = H.bootAtelier(); w.demanderExemple(); w.demanderExemple(); return w; };
// PIÈGE : `diagnostiquer()` juge le contenu entier ; le `valider(r)` de
// moteur.js juge une phrase (§17).
const err = w => w.diagnostiquer().filter(i => i.niveau === "erreur");
const msgs = w => w.diagnostiquer().map(i => i.msg).join(" | ");

console.log("\n=== content.js tient debout, et c'est lui que l'atelier édite ===");
{
  const w = neuf();
  check("moteur.js est chargé dans l'atelier", !!w.MoteurGrammaire && !!w.MG());
  check("regles.js aussi — le pas-à-pas ne recopie plus les règles", !!w.ReglesJeu && !!w.RG());
  check("l'atelier part de content.js, pas d'une graine à lui", !!w.LIVRE);
  check("le contenu chargé est en schéma 3", w.CONTENU.schema === 3);
  check("zéro erreur au diagnostic", err(w).length === 0);
  const exporte = JSON.stringify(w.nettoyerPourJeu(w.CONTENU), null, 2);
  check("et le réexporter le rend à l'identique — aucune dérive possible",
    exporte === JSON.stringify(w.nettoyerPourJeu(JSON.parse(JSON.stringify(w.LIVRE))), null, 2));
  /* PIÈGE PAYÉ : ce bruit a vécu dans une liste À CÔTÉ du contenu, que l'export
     jetait (clé en `_`) — le réexport « à l'identique » ci-dessus restait vert
     parce que la perte était symétrique. Il vit sur l'empan, donc il part. */
  const bruits = c => Object.values(c.pieces||{})
    .flatMap(q => Object.values(q.empans||{})).filter(e => e.bruit).length;
  check("le bruit déclaré part avec — l'atelier ne garde rien pour lui",
    bruits(w.CONTENU) > 0 && bruits(JSON.parse(exporte)) === bruits(w.CONTENU));
  check("aucune dimension sans doublon", !msgs(w).includes("aucun doublon"));
  check("aucun empan non marqué", !msgs(w).includes("Empan non marqué"));
  check("aucune valeur oubliée hors marqueur", !msgs(w).includes("Valeur non marquée"));
  check("le bruit assumé est reconnu comme tel", msgs(w).includes("Bruit assumé"));
}

console.log("\n=== Le diagnostic attrape ce qu'il doit attraper ===");
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  const p = w.CONTENU.pieces[e.pid];
  p.texte = p.texte.replace("{{"+e.eid+"}}", "");
  check("un empan sans marqueur est une erreur", msgs(w).includes("Empan non marqué"));
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  w.CONTENU.pieces[e.pid].texte += " il était 23h45";
  check("une heure laissée hors marqueur est signalée (règle de surlignage)",
    msgs(w).includes("Valeur non marquée"));
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  w.CONTENU.pieces[e.pid].empans[e.eid].dim = "inconnue";
  check("une dimension hors liste est une erreur", msgs(w).includes("Dimension inconnue"));
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  delete w.CONTENU.pieces[e.pid].empans[e.eid].nom;
  check("un empan sans nom est un avertissement, pas une erreur",
    msgs(w).includes("Empan sans nom") && !err(w).some(i => /sans nom/.test(i.msg)));
}
{
  const w = neuf();
  const G = w.CONTENU.grammaire;
  G.blocs.push({ id:"vide", type:"liaison", de:G.depart, vers:G.finaux[0],
                 imbrique:true, texte:", ce qui est douteux", forme:Object.keys(G.formes)[0] });
  check("emboîter dans le vide est une erreur", msgs(w).includes("emboîte dans le vide"));
}
{
  const w = neuf();
  check("un bloc de clôture sans forme, après une forme fixée, passe",
    !msgs(w).includes("clôt une phrase sans forme"));
}
{
  const w = neuf();
  const b = w.CONTENU.grammaire.blocs.find(x => x.piece);
  if (b) {
    b.piece = "piece_qui_nexiste_pas";
    check("un bloc conditionné à une pièce inconnue est une erreur",
      msgs(w).includes("attend une pièce inconnue"));
  } else check("(aucun bloc conditionné à une pièce)", true);
}
{
  const w = neuf();
  const e = Object.entries(w.CONTENU.grammaire.formes).find(([,f]) => f.deduction === "ordre" && f.ordonne);
  if (e) {
    delete e[1].sens;
    check("une forme ordonnée sans « sens » est un avertissement",
      msgs(w).includes("ordonnée sans « sens »") && !err(w).some(i => /sans « sens »/.test(i.msg)));
  } else check("(aucune forme ordonnée déductible)", true);
}
{
  const w = neuf();
  const C = w.CONTENU;
  /* PIÈGE : un article est une liaison qui porte une FORME *et* une pièce —
     chercher le premier bloc qui porte une pièce ne suffit pas. Depuis la passe
     J, un article ne se livre plus : il se CHERCHE. Livré tard, il se trouve
     quand même ; ce qui rend une session inclôturable, c'est une recherche qui
     ne le rend pas sur la paire du lien attendu. On lui ôte donc sa dimension. */
  const bloc = C.grammaire.blocs.find(x => x.piece && x.forme && x.imbrique);
  if (bloc) {
    let sert = null;
    for (const L of C.liens) if (L.tag && L.forme === bloc.forme) sert = L.tag;
    if (sert) {
      const seulement = C.liens.filter(L => L.tag === sert).every(L => L.forme === bloc.forme);
      check("(avant : l'attente se sert, sans erreur de recherche)",
        !msgs(w).includes("la recherche ne rend pas son article"));
      C.pieces[bloc.piece].porte = ["__aucune__"];
      if (seulement)
        check("un article que la recherche ne rend pas sur la paire attendue est une erreur",
          err(w).some(i => i.msg.includes("la recherche ne rend pas son article")));
      else check("(l'attente reste servable autrement — pas de piège ici)",
          !msgs(w).includes("la recherche ne rend pas son article"));
    } else check("(aucune attente servie par un article)", true);
  } else check("(aucune liaison d'article)", true);
}
{
  /* Livré après la session qui l'attend, un article se trouve quand même : ce
     n'est plus une erreur (passe J). */
  const w = neuf();
  const C = w.CONTENU;
  const bloc = C.grammaire.blocs.find(x => x.piece && x.forme && x.imbrique);
  if (bloc) {
    for (const r of C.remises) r.pieces = (r.pieces||[]).filter(p => p !== bloc.piece);
    C.remises[C.remises.length-1].pieces.push(bloc.piece);
    check("un article livré tard se cherche : la session reste servable",
      !msgs(w).includes("n'est pas encore livré") && !msgs(w).includes("la recherche ne rend pas son article"));
  } else check("(aucune liaison d'article)", true);
}
{
  const w = neuf();
  const d = w.CONTENU.dimensions[0];
  let n = 0;
  for (const p of Object.values(w.CONTENU.pieces))
    for (const e of Object.values(p.empans||{})) if (e.dim === d) e.valeur = "u"+(n++);
  check("une dimension sans doublon est signalée", msgs(w).includes(`Dimension « ${d} » : aucun doublon`));
}
{
  const w = neuf();
  const LV = SC.sousVice(w.CONTENU);
  const dv = SC.dim(w.CONTENU, LV.termes[0]);
  const valVice = new Set(LV.termes.map(t => {
    const [pid,eid] = H.deK(t);
    return (w.CONTENU.pieces[pid].empans[eid]||{}).valeur;
  }));
  let n = 0;
  for (const p of Object.values(w.CONTENU.pieces))
    for (const e of Object.values(p.empans||{}))
      if (e.dim === dv && !valVice.has(e.valeur)) e.valeur = "r"+(n++);
  check("la dimension du vice sans doublons réguliers est signalée",
    msgs(w).includes("doublon(s) régulier(s)"));
}
{
  const w = neuf();
  const pidR = SC.pidRegle(w.CONTENU);
  const regles = Object.values(w.CONTENU.pieces).filter(estRegle);
  // §11, passe F — un article a UN passage, son texte, et aucun empan qui se compare.
  check("dans le contenu livré, chaque règle porte un passage d'article, et aucun empan qui se compare",
    regles.every(p => { const es = Object.values(p.empans||{});
      return es.length === 1 && es[0].article && es[0].dim === undefined && es[0].valeur === undefined; }));
  check("et chaque règle livrée annonce ce qu'elle régit",
    regles.every(p => Array.isArray(p.porte) && p.porte.length));
  const e = SC.unEmpan(w.CONTENU);
  w.CONTENU.pieces[pidR].empans = { intrus: { dim: e.dim, valeur: e.valeur, texte: "x", nom: "x" } };
  w.CONTENU.pieces[pidR].texte += " {{intrus}}";
  check("une règle qui porte un empan qui se compare est une erreur", msgs(w).includes("porte 1 empan"));
}
{
  /* LE PASSAGE D'ARTICLE (§11, passe F) : sans lui, la liaison ne s'offrirait
     jamais ; hors d'une règle, il ne fonderait rien. */
  const w = neuf();
  const b = w.CONTENU.grammaire.blocs.find(x => x.type === "liaison" && x.imbrique && x.piece);
  const p = w.CONTENU.pieces[b.piece];
  const [eid] = Object.keys(p.empans).filter(k => p.empans[k].article);
  delete p.empans[eid]; p.texte = p.texte.replace("{{" + eid + "}}", "texte");
  check("une règle invoquée sans passage d'article est une erreur", msgs(w).includes("pas de passage d'article"));
  const w2 = neuf();
  const e = SC.unEmpan(w2.CONTENU);
  w2.CONTENU.pieces[e.pid].empans[e.eid].article = true;
  check("un passage d'article hors d'une règle est une erreur", msgs(w2).includes("hors d'une règle"));
  check("le diagnostic du contenu livré ne tient pas ses passages d'article pour inertes",
    !msgs(neuf()).includes("Empan inerte : art."));
}
{
  const w = neuf();
  w.CONTENU.pieces[SC.pidRegle(w.CONTENU)].porte = ["dimension_inventee"];
  check("un `porte` sur une dimension inconnue est une erreur",
    msgs(w).includes("dimension inconnue"));
}
{
  const w = neuf();
  delete w.CONTENU.pieces[SC.pidRegle(w.CONTENU)].porte;
  check("une règle sans `porte` est un avertissement",
    msgs(w).includes("n'annonce pas ce qu'elle régit"));
}
{
  const w = neuf();
  for (const L of w.CONTENU.liens) if (L.vice) delete L.conclusion;
  check("un vice sans conclusion est une erreur", msgs(w).includes("pas de conclusion"));
}
{
  const w = neuf();
  const r = w.CONTENU.remises[0];
  delete r.attend; delete r.attentes;
  check("une session sans aucune attente est une erreur", msgs(w).includes("sans attente"));
}
{
  const w = neuf();
  const as = w.attentesDeRemise(w.CONTENU.remises[0]);
  as[0].attend = "tag_qui_n_existe_pas";
  check("une attente qu'aucun lien ne porte est une erreur", msgs(w).includes("qu'aucun lien ne porte"));
}
{
  const w = neuf();
  const as = w.attentesDeRemise(w.CONTENU.remises[0]);
  as[0].question = "Et alors ?"; delete as[0].attend;
  check("une question sans tag à servir est une erreur", msgs(w).includes("sans tag à servir"));
}
{
  const w = neuf();
  // Le SECOND terme d'une paire : celui qui mène au choix de la relation (passe G),
  // ou qui la fait déduire. PIÈGE PAYÉ : cherché par `deduit` seul, il manquait
  // depuis la passe G, et ce contrôle passait par le vide.
  const G = w.CONTENU.grammaire.blocs || [];
  const t = G.find(b => b.type === "terme" && (b.deduit || G.some(x => x.de === b.vers && x.type === "relation")));
  check("la grammaire livrée a un second terme de paire", !!t);
  if (t) {
    t.piece = w.CONTENU.remises[w.CONTENU.remises.length - 1].pieces[0];
    check("un bloc de terme livré trop tard rend une attente inservable",
      msgs(w).includes("n'est pas encore livré"));
  }
}
{
  /* LA RELATION SE CHOISIT ENTRE DEUX (passe G) : un lien dont la relation est
     fausse sur les valeurs, et une dimension qui n'en offrirait qu'une. */
  const w = neuf();
  const L = w.CONTENU.liens.find(x => typeof (x.termes || [])[0] === "object");
  const sous = L.termes[0], dim = w.MG().dimDe(sous.termes[0]);
  sous.forme = w.MG().relationsDe(dim).find(f => f !== sous.forme);
  check("un lien dont la relation est fausse sur les valeurs est une erreur", msgs(w).includes("relation fausse"));
  const w2 = neuf(), F2 = w2.CONTENU.grammaire.formes;
  const autre = w2.MG().relationsDe(dim).find(f => F2[f].deduction !== "egalite");
  F2[autre].slots = [["ailleurs"], ["ailleurs"]];
  check("une dimension qui n'offre qu'une relation est signalée", msgs(w2).includes(`« ${dim} » n'offre qu'une relation`));
}
{
  const w = neuf();
  const L0 = w.CONTENU.liens[SC.iLienNeutre(w.CONTENU)];
  const L = (L0.termes||[]).length === 1 && typeof L0.termes[0] === "object" ? L0.termes[0] : L0;
  if (L.termes.length === 2 && typeof L.termes[1] === "string") {
    const autre = SC.empans(w.CONTENU).find(e => e.dim !== SC.dim(w.CONTENU, L.termes[0]));
    L.termes[1] = autre.id;
    check("un lien de catégories incompatibles est une erreur", msgs(w).includes("insensé"));
  } else check("(pas de lien binaire simple à casser)", true);
}
{
  const w = neuf();
  const pid = SC.pidAutreQue(w.CONTENU, SC.pidRegle(w.CONTENU));
  for (const r of w.CONTENU.remises) r.pieces = (r.pieces||[]).filter(p => p !== pid);
  check("une pièce jamais livrée est signalée", msgs(w).includes("Pièce jamais livrée"));
}
{
  /* La juxtaposition (§4.11) prend toutes les dimensions et n'en compare aucune :
     une dimension neuve, sans forme qui la compare, doit rester signalée. */
  const w = neuf();
  w.CONTENU.dimensions.push("dimension_sans_forme");
  check("la juxtaposition ne fait pas taire « sans forme déductible »",
    Object.values(w.CONTENU.grammaire.formes).some(f => f.deduction === "juxtaposition")
    && msgs(w).includes("« dimension_sans_forme » sans forme déductible"));
}

console.log("\n=== Migration du schéma 2 vers le schéma 3 ===");
{
  const w = neuf();
  const vieux = {
    schema:2,
    pieces:{
      a:{ titre:"A", court:"A", type:"pièce", texte:"Un texte sans marqueur.",
          champs:{ agent_x:"T-14", heure_y:"14:02" } },
      b:{ titre:"B", court:"B", type:"règle du manuel", texte:"Règle.", champs:{ exige:"séparés" } }
    },
    dims:{ agent_x:"agent", heure_y:"heure", exige:"agent" },
    liens:[{ a:["a","agent_x"], rel:"est en désaccord avec", b:["b","exige"], tient:true, vice:true, rep:"Tiens." }],
    relations:["est en accord avec","est en désaccord avec"],
    cases:{ c1:{ label:"Case", remise:1, options:["x"], bonne:"x", apres:{ replique:"Reçu." } } },
    remises:[{ qui:"Maître", texte:"Voilà.", pieces:["a","b"], attentes:[{ attend:"t_x" }] }],
    repetition:{ intro:"", affirmations:[], fin:"" },
    avocat:{ rep_vice:"", rep_faux:"", rep_inutile:[], rep_sans_rapport:[], deja:"" },
    fins:{1:{},2:{},3:{}},
    attention:3,
    _bruit:["a.heure_y"]          // l'annotation d'atelier d'avant, à côté du contenu
  };
  const m = w.migrerContenu(JSON.parse(JSON.stringify(vieux)));
  check("le schéma passe à 3", m.schema === 3);
  check("les champs deviennent des empans", !!m.pieces.a.empans.agent_x && !m.pieces.a.champs);
  check("« agent » se rabat sur « qui »", m.pieces.a.empans.agent_x.dim === "qui");
  check("« heure » se rabat sur « quand »", m.pieces.a.empans.heure_y.dim === "quand");
  check("les marqueurs manquants sont ajoutés au texte",
    m.pieces.a.texte.includes("{{agent_x}}") && m.pieces.a.texte.includes("{{heure_y}}"));
  check("les liens par paires deviennent {forme, termes}",
    m.liens[0].forme === "identite_non" && m.liens[0].termes[0] === "a.agent_x");
  check("le vice et sa réplique survivent", m.liens[0].vice === true && m.liens[0].rep === "Tiens.");
  check("une grammaire est fournie", Array.isArray(m.grammaire.blocs) && !!m.grammaire.formes);
  check("les dimensions sont posées — celles du contenu livré",
    Array.isArray(m.dimensions) && JSON.stringify(m.dimensions) === JSON.stringify(w.contenuLivre().dimensions));
  check("les cases et les relations disparaissent", m.cases === undefined && m.relations === undefined);
  const accuse = (w.attentesDeRemise(m.remises[0])[0]||{}).apres;
  check("l'accusé de réception d'une case migre sur l'attente de sa session",
    !!accuse && accuse.replique === "Reçu.");
  check("la clé attention est retirée", m.attention === undefined);
  check("l'ancienne liste `_bruit` se replie sur l'empan, et disparaît",
    m.pieces.a.empans.heure_y.bruit === true && m._bruit === undefined
    && m.pieces.a.empans.agent_x.bruit === undefined);
  check("la migration est idempotente",
    JSON.stringify(w.migrerContenu(JSON.parse(JSON.stringify(m)))) === JSON.stringify(m));
}
{
  const w = neuf();
  check("un contenu sans empans est refusé par adopter()",
    typeof w.adopter({ schema:3, pieces:{a:{}}, liens:[], dimensions:["qui"], grammaire:{blocs:[],formes:{}} }) === "string");
}

console.log("\n=== Édition : empans, liens, renommages ===");
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  w.majEmpan(e.pid, e.eid, "valeur", "ZZZ");
  check("modifier la valeur d'un empan l'écrit dans le contenu",
    w.CONTENU.pieces[e.pid].empans[e.eid].valeur === "ZZZ");
  w.majEmpan(e.pid, e.eid, "qui", "  ");
  check("un signataire vide est retiré, pas stocké vide",
    w.CONTENU.pieces[e.pid].empans[e.eid].qui === undefined);
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  check("renommer un empan réussit", w.renommerEmpanId(e.pid, e.eid, e.eid+"_neuf") === null);
  check("le marqueur du texte suit", w.CONTENU.pieces[e.pid].texte.includes("{{"+e.eid+"_neuf}}"));
  check("les liens suivent", !JSON.stringify(w.CONTENU.liens).includes('"'+e.pid+"."+e.eid+'"'));
  check("le diagnostic reste sans erreur", err(w).length === 0);
}
{
  const w = neuf();
  const bruits = p => Object.values((w.CONTENU.pieces[p]||{}).empans||{}).filter(e => e.bruit).length;
  /* On renomme une pièce QUI PORTE DU BRUIT, sans quoi le contrôle d'après
     passerait par le vide. */
  const pid = Object.keys(w.CONTENU.pieces).find(p => bruits(p) > 0)
           || SC.pidAutreQue(w.CONTENU, SC.pidRegle(w.CONTENU));
  const avant = bruits(pid);
  check("renommer une pièce réussit", w.renommerPieceId(pid, "renomme_x") === null);
  check("les remises suivent", w.CONTENU.remises.some(r => (r.pieces||[]).includes("renomme_x")));
  check("les liens suivent", !JSON.stringify(w.CONTENU.liens).includes('"'+pid+"."));
  check("le bruit déclaré suit", avant > 0 && bruits("renomme_x") === avant);
  check("le diagnostic reste sans erreur", err(w).length === 0);
  check("un id déjà pris est refusé",
    typeof w.renommerPieceId("renomme_x", SC.pidRegle(w.CONTENU)) === "string");
}
{
  const w = neuf();
  const sv = SC.sousVice(w.CONTENU);
  w.CONTENU.liens.push({ forme: sv.forme, termes: JSON.parse(JSON.stringify(sv.termes)) });
  const i = w.CONTENU.liens.length - 1;
  const formes1 = Object.entries(w.CONTENU.grammaire.formes).filter(([,f]) => f.arite === 1).map(([k]) => k);
  /* PIÈGE : il faut une qualification QUE LE CONTENU NE PORTE PAS DÉJÀ sur cette
     comparaison — l'affaire en compte plusieurs, dont des impasses qui
     enseignent pourquoi l'article ne tient pas. Sinon `conclureLien` a raison de
     ne rien créer, et c'est le contrôle d'après qui le dit. */
  const occupee = f => w.CONTENU.liens.some(L =>
    L.forme === f && (L.termes||[]).length === 1 && typeof L.termes[0] === "object"
    && L.termes[0].forme === sv.forme
    && JSON.stringify(L.termes[0].termes) === JSON.stringify(sv.termes));
  const forme1 = formes1.find(f => !occupee(f));
  check("une qualification libre existe pour ce test", !!forme1);
  const avant = w.CONTENU.liens.length;
  w.conclureLien(i, forme1);
  check("conclure un lien crée une qualification d'arité 1", w.CONTENU.liens.length === avant+1);
  check("son terme est la note visée, emboîtée",
    typeof w.CONTENU.liens[w.CONTENU.liens.length-1].termes[0] === "object");
  w.conclureLien(i, forme1);
  check("la même conclusion n'est pas créée deux fois", w.CONTENU.liens.length === avant+1);
}

console.log("\n=== La simulation reflète le moteur ===");
{
  const w = neuf();
  w.simReset();
  check("la session 1 part au démarrage", w.SIM.remisesEnvoyees === 1);
  const feuilles = w.feuillesLien(SC.sousVice(w.CONTENU));
  check("rien ne se compare avant que ses pièces soient ouvertes (passe K)",
    !w.simActions().some(a => a.t.startsWith("Comparer")));
  for (const pid of new Set(feuilles.map(k => w.deK(k)[0]))) w.simOuvrir(pid);
  check("ouvrir ses pièces offre la comparaison, et ne touche pas au plan",
    w.simActions().some(a => a.t.startsWith("Comparer")) && w.SIM.plaidoirie.length === 0
    && w.SIM.surlignes === undefined);
  w.simComparer(SC.sousVice(w.CONTENU));
  check("comparer sans qualifier lève vice_pressenti seul",
    w.SIM.vice_pressenti && !w.SIM.vice_trouve);
  check("et n'écrit rien", w.SIM.brouillon.length === 0);
  w.simComposer(SC.iLienConclusion(w.CONTENU));
  check("composer la conclusion lève vice_trouve", w.SIM.vice_trouve && !w.SIM.vice_expose);
  const iConc = w.SIM.brouillon.findIndex(n => n.lien && n.lien.conclusion);
  w.simEnvoyer(iConc);
  check("la verser lève vice_expose", w.SIM.vice_expose);
  check("l'avocat a répondu", w.SIM.fil.some(m => m.texte === w.CONTENU.avocat.rep_vice));
  check("le pas-à-pas et le jeu partagent les mêmes règles", !!w.ReglesJeu);
}

console.log("\n=== Le pas-à-pas referme la pièce : sa réplique part (§4.10) ===");
{
  const w = neuf();
  w.simReset();
  const pids = Object.keys(w.CONTENU.pieces);
  const pid = pids.find(k => (w.CONTENU.pieces[k].declenche || {}).replique);
  const autre = pids.find(k => k !== pid && !w.CONTENU.pieces[k].declenche);
  const rep = pid && w.CONTENU.pieces[pid].declenche.replique;
  const dites = () => w.SIM.fil.filter(m => m.texte === rep).length;
  w.simOuvrir(pid);
  check("ouverte, la pièce se lit : sa réplique attend", !!pid && dites() === 0);
  w.simOuvrir(autre);
  check("en ouvrir une autre la referme, et sa réplique part", dites() === 1 && w.SIM.modalPiece === autre);
  w.simOuvrir(pid); w.simComparer(SC.sousVice(w.CONTENU));
  check("faire autre chose que lire la referme aussi — et « une fois » ne redit rien",
    !w.SIM.modalPiece && dites() === (w.CONTENU.pieces[pid].declenche.une_fois ? 1 : 2));
}

console.log("\n=== Les discordances : le dossier les déclare, l'atelier les relit (passe N) ===");
const cleP = (a, b) => [a, b].sort().join("|");
const deducDans = (w, a, b) => ((w.CONTENU.grammaire.formes)[w.MG().deduire(a, b)] || {}).deduction;
{
  const w = neuf();
  const D = w.CONTENU.discordances || [];
  check("le contenu livré déclare ses discordances", D.length > 0);
  const es = SC.empans(w.CONTENU), dec = new Set(D.map(([a, b]) => cleP(a, b)));
  let p = null;
  for (const a of es) for (const b of es)
    if (!p && a.id < b.id && a.dim === b.dim && !dec.has(cleP(a.id, b.id))) p = [a.id, b.id];
  check("une paire non déclarée concorde", deducDans(w, p[0], p[1]) === "concordance");
  w.basculerDiscordance(p[0], p[1]);
  check("cocher la paire l'écrit au dossier", (w.CONTENU.discordances || []).some(([a, b]) => cleP(a, b) === cleP(p[0], p[1])));
  check("et le moteur suit : elle ne concorde plus", deducDans(w, p[0], p[1]) === "discordance");
  w.basculerDiscordance(p[0], p[1]);
  check("décocher la retire, et elle concorde de nouveau",
    !(w.CONTENU.discordances || []).some(([a, b]) => cleP(a, b) === cleP(p[0], p[1])) && deducDans(w, p[0], p[1]) === "concordance");
  w.vue("verdicts");
  const pane = w.document.getElementById("verdpane");
  const par = {}; for (const e of es) (par[e.dim] = par[e.dim] || []).push(e);
  const nPaires = Object.values(par).reduce((n, l) => n + l.length * (l.length - 1) / 2, 0);
  check("l'onglet Verdicts dessine une case par paire de même dimension",
    pane.querySelectorAll("input[type=checkbox]").length === nPaires);
  check("et coche celles que le dossier déclare", pane.querySelectorAll("input[type=checkbox]:checked").length === D.length);
  w.vue("graphe");
}
{
  const w = neuf();
  w.CONTENU.discordances.push([w.CONTENU.discordances[0][0], "piece_absente.e_x"]);
  check("une discordance qui nomme un passage inconnu est une erreur", err(w).some(i => i.msg.includes("passage inconnu")));
}
{
  const w = neuf();
  const [x, y] = SC.deuxEmpansDiff(w.CONTENU);
  w.CONTENU.discordances.push([x.id, y.id]);
  check("une discordance de deux dimensions est une erreur", err(w).some(i => i.msg.includes("deux dimensions")));
}
{
  /* LA VÉRITÉ VIT À PART (l'essai du 8 octobre) : retirer la liste rend faux les
     liens qui disaient « ne concordent pas » — et le diagnostic le voit. */
  const w = neuf();
  delete w.CONTENU.discordances;
  check("sans la liste, les liens qui discordaient sont faux sur le dossier",
    err(w).some(i => i.msg.includes("relation fausse sur le dossier")));
}
{
  const w = neuf();
  const comp = JSON.parse(JSON.stringify(SC.sousVice(w.CONTENU)));
  w.CONTENU.liens.push({ forme: comp.forme, termes: comp.termes, tag: "un_tag_nu" });
  check("un lien nu qui porte un tag est une erreur", err(w).some(i => i.msg.includes("un lien nu qui se plaiderait")));
}
{
  const w = neuf();
  const L = w.CONTENU.liens.find(x => !x.vice && !x.faux && typeof (x.termes || [])[0] === "object");
  const comp = JSON.parse(JSON.stringify(L.termes[0]));
  w.CONTENU.liens.push({ forme: comp.forme, termes: comp.termes, savoir: true });
  for (const f of Object.values(w.CONTENU.fins || {})) delete f.variante_sait;
  check("un savoir sans réplique est signalé", msgs(w).includes("un savoir sans réplique"));
  check("un savoir qui ne change aucune fin aussi", msgs(w).includes("Le savoir ne change aucune fin"));
}
{
  /* LA DISCORDANCE BANALE (§4.4) : un vice qui ne concorde pas, seul de sa dimension. */
  const w = neuf();
  const sous = SC.sousVice(w.CONTENU);
  sous.forme = Object.keys(w.CONTENU.grammaire.formes).find(f => w.CONTENU.grammaire.formes[f].deduction === "discordance");
  w.CONTENU.discordances = [[...sous.termes]];
  check("un vice qui ne concorde pas, sans discordance banale à côté, est signalé", msgs(w).includes("discordance(s) banale(s)"));
}
{
  const w = neuf();
  const k = w.CONTENU.discordances[0][0], [pid, eid] = H.deK(k);
  check("renommer un empan d'une discordance réussit", w.renommerEmpanId(pid, eid, eid + "_neuf") === null);
  check("la discordance suit", JSON.stringify(w.CONTENU.discordances).includes('"' + pid + "." + eid + '_neuf"')
    && !JSON.stringify(w.CONTENU.discordances).includes('"' + k + '"'));
  check("et aucun lien n'en devient faux", !msgs(w).includes("relation fausse"));
  w.demanderSupprChamp(pid, eid + "_neuf"); w.demanderSupprChamp(pid, eid + "_neuf");
  check("supprimer l'empan retire ses discordances", !JSON.stringify(w.CONTENU.discordances || []).includes(pid + "." + eid + "_neuf"));
}

console.log("\n=== Le chemin docile, simulé ===");
{
  const w = H.bootAtelier();
  w.simReset();
  let garde = 0;
  while (garde++ < 40) {
    const r = w.CONTENU.remises[w.SIM.remisesEnvoyees-1];
    const a = w.attentesDeRemise(r).find(x => !w.SIM.satisfaits.includes(x.attend));
    if (!a) break;
    const i = w.CONTENU.liens.findIndex(L => L.tag === a.attend && !L.vice);
    if (i < 0) break;
    for (const pid of new Set(w.feuillesLien(w.CONTENU.liens[i]).map(k => w.deK(k)[0]))) w.simOuvrir(pid);
    w.simComposer(i);
    const L = w.CONTENU.liens[i];
    w.simEnvoyer(w.SIM.brouillon.findIndex(n => n.lien === L));
  }
  check("toutes les sessions sont servies", w.SIM.remisesEnvoyees === w.CONTENU.remises.length);
  w.simCloturer();
  while (w.simPhase() === "repetition") w.simAvancer();
  w.simConfirmer();
  check("docile → Fin 3", w.SIM.finie === "3");
}

console.log("\n=== L'export, et le jeu qui l'adopte ===");
{
  const w = neuf();
  const exporte = w.nettoyerPourJeu(w.CONTENU);
  check("l'export est estampillé schema: 3", exporte.schema === 3);
  check("les clés d'atelier sont retirées", !Object.keys(exporte).some(k => k.startsWith("_")));
  const g = H.boot({contenu: JSON.parse(JSON.stringify(exporte))});
  check("le jeu adopte l'export de l'atelier", g.SOURCE_CONTENU === "contenu : content.js");
  H.instruire(g);
  check("et le joue jusqu'à la clôture", !g.document.getElementById("btnCloture").disabled);
  check("→ Fin 3", H.numeroFin(H.terminer(g)) === "3");
}

/* L'ÉCRITURE SUR PLACE (§10) — on ne nomme aucun navigateur : on éprouve les
   DEUX chemins. Sous jsdom, `showSaveFilePicker` n'existe pas, donc le repli se
   donne gratuitement et le chemin d'écriture se pose à la main. */
console.log("\n=== Écrire content.js : sur place, ou le repli ===");
const guetTelecharger = w => { const vus=[]; w.telecharger=(nom,data)=>{ vus.push({nom,data}); return true; }; return vus; };
const poigneeFeinte = () => { const ecrits=[]; return { ecrits, nom:"content.js",
  poignee:{ name:"content.js", queryPermission:async()=>"granted",
            createWritable:async()=>({ write:async t=>ecrits.push(t), close:async()=>{} }) } }; };

(async () => {
  {
    const w = neuf();
    const texte = w.sourceContenuJS();
    check("le texte écrit est un module : window.CONTENU = {…}", /^\/\*[\s\S]*\*\/\nwindow\.CONTENU = \{/.test(texte));
    const json = texte.slice(texte.indexOf("{"), texte.lastIndexOf("}") + 1);
    check("et son JSON est exactement l'export",
      JSON.stringify(JSON.parse(json)) === JSON.stringify(w.nettoyerPourJeu(w.CONTENU)));
  }
  {
    const w = neuf();
    const vus = guetTelecharger(w);
    await w.exporterJS();
    check("sans écriture de fichier, le bouton retombe sur le téléchargement", vus.length === 1 && vus[0].nom === "content.js");
    check("et c'est le même texte qui part", vus[0].data === w.sourceContenuJS());
  }
  {
    const w = neuf();
    const vus = guetTelecharger(w);
    const f = poigneeFeinte();
    w.showSaveFilePicker = async () => f.poignee;
    await w.exporterJS();
    check("avec l'écriture de fichier, content.js est réécrit sur place", f.ecrits.length === 1 && f.ecrits[0] === w.sourceContenuJS());
    check("et rien n'est téléchargé", vus.length === 0);
  }
  {
    const w = neuf();
    const vus = guetTelecharger(w);
    const f = poigneeFeinte();
    f.poignee.queryPermission = async () => "prompt";
    f.poignee.requestPermission = async () => "denied";
    w.showSaveFilePicker = async () => f.poignee;
    await w.exporterJS();
    check("un droit d'écriture refusé ne perd pas le travail : téléchargement", vus.length === 1 && !f.ecrits.length);
  }
  {
    const w = neuf();
    const vus = guetTelecharger(w);
    w.showSaveFilePicker = async () => { const e = new Error("annulé"); e.name = "AbortError"; throw e; };
    await w.exporterJS();
    check("fichier non désigné : rien n'a lieu, ni écriture ni téléchargement", vus.length === 0);
  }

  console.log("\n=== L'autosave ===");
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  w.majEmpan(e.pid, e.eid, "valeur", "AUTOSAVE");
  const brut = w.localStorage.getItem("iavocat_atelier_v2");
  check("l'atelier écrit son autosave", !!brut);
  const w2 = H.bootAtelier({graine:{ iavocat_atelier_v2: brut }});
  check("il le relit au démarrage", w2.CONTENU.pieces[e.pid].empans[e.eid].valeur === "AUTOSAVE");
  check("et, faute d'accord connu, il annonce la divergence plutôt que de trancher",
    !w2.document.getElementById("accord").hidden);
}

console.log("\n=== Le fichier reprend la main sur le brouillon (§10) ===");
/* Ce que jsdom NE peut pas éprouver : la relecture elle-même (aucune balise
   n'est allée chercher `content.js?relu=…`) ni les déclencheurs. Ce qui se
   contrôle ici est LA POLITIQUE — qui gagne, et ce qui survit. */
{
  const w = neuf();
  const brouillon = JSON.parse(JSON.stringify(w.CONTENU));
  const e = SC.unEmpan(brouillon);
  brouillon.pieces[e.pid].empans[e.eid].valeur = "VENU DU DISQUE";      // « le fichier », modifié au dehors
  const accord = w.signatureContenu(w.CONTENU);
  check("l'accord est noté au démarrage", !!accord && accord === w.localStorage.getItem("iavocat_atelier_accord"));

  w.CONTENU._pos.__repere = { x: 7, y: 7 };                             // une annotation d'atelier
  w.confronter(JSON.parse(JSON.stringify(brouillon)));
  check("le fichier a bougé, le brouillon non : il est adopté EN SILENCE",
    w.CONTENU.pieces[e.pid].empans[e.eid].valeur === "VENU DU DISQUE"
    && w.document.getElementById("accord").hidden);
  check("et les positions du graphe traversent l'adoption",
    !!(w.CONTENU._pos && w.CONTENU._pos.__repere));
  check("le nouvel accord est noté — un second coup d'œil ne refait rien",
    w.signatureContenu(w.CONTENU) === w.localStorage.getItem("iavocat_atelier_accord"));
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  const fichier = JSON.parse(JSON.stringify(w.CONTENU));
  fichier.pieces[e.pid].empans[e.eid].valeur = "DISQUE";
  w.majEmpan(e.pid, e.eid, "nom", "MON BROUILLON");                     // du travail non écrit
  w.confronter(JSON.parse(JSON.stringify(fichier)));
  check("les deux ont bougé : un bandeau, et rien n'est adopté d'office",
    !w.document.getElementById("accord").hidden
    && w.CONTENU.pieces[e.pid].empans[e.eid].nom === "MON BROUILLON"
    && w.CONTENU.pieces[e.pid].empans[e.eid].valeur !== "DISQUE");
  check("le bandeau offre les deux issues, et rien d'autre",
    w.document.querySelectorAll("#accord button").length === 2);
  w.adopterFichier();
  check("« adopter » prend le fichier et referme le bandeau",
    w.CONTENU.pieces[e.pid].empans[e.eid].valeur === "DISQUE"
    && w.document.getElementById("accord").hidden);
}
{
  /* LE CAS COURANT : on fait un `git pull`, on rouvre l'atelier. Le brouillon
     est d'accord avec ce que le fichier disait ; le fichier a changé depuis.
     PIÈGE : l'adoption a lieu AU DÉMARRAGE, donc `render()` y tourne avant le
     `simReset()` de la page — c'est ce chemin-là qui casserait en silence. */
  const w0 = neuf();
  const e = SC.unEmpan(w0.CONTENU);
  const vieux = JSON.parse(JSON.stringify(w0.CONTENU));
  vieux.pieces[e.pid].empans[e.eid].valeur = "CE QUE LE FICHIER DISAIT";
  const w = H.bootAtelier({ graine: {
    iavocat_atelier_v2: JSON.stringify(vieux),
    iavocat_atelier_accord: w0.signatureContenu(vieux)
  }});
  check("au démarrage, un fichier plus frais est adopté sans un mot",
    w.CONTENU.pieces[e.pid].empans[e.eid].valeur !== "CE QUE LE FICHIER DISAIT"
    && w.document.getElementById("accord").hidden);
  check("et la page a fini de se dessiner — le pas-à-pas compris",
    !!w.document.getElementById("canvas").querySelector(".card") && !!w.SIM);
}
{
  const w = neuf();
  const e = SC.unEmpan(w.CONTENU);
  const fichier = JSON.parse(JSON.stringify(w.CONTENU));
  fichier.pieces[e.pid].empans[e.eid].valeur = "DISQUE";
  w.majEmpan(e.pid, e.eid, "nom", "MON BROUILLON");
  w.confronter(JSON.parse(JSON.stringify(fichier)));
  w.garderBrouillon();
  check("« garder » laisse le brouillon intact",
    w.CONTENU.pieces[e.pid].empans[e.eid].nom === "MON BROUILLON"
    && w.document.getElementById("accord").hidden);
  /* PIÈGE PAYÉ : garder, c'est PRENDRE ACTE — sans ça le bandeau reviendrait à
     chaque coup d'œil pour une divergence déjà tranchée. */
  w.confronter(JSON.parse(JSON.stringify(fichier)));
  check("et le même fichier ne rappelle plus le bandeau",
    w.document.getElementById("accord").hidden);
}
/* PIÈGE : `bilan()` est DANS la promesse, et il le faut — `exporterJS` attend le
   navigateur, donc ces contrôles sont les seuls du dépôt à tomber après le
   dernier `console.log` synchrone. Appelé dehors, il compterait sans eux. */
})().then(bilan, e => { console.error(e); process.exit(1); });

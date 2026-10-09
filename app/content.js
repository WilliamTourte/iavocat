/* LE CONTENU DE L'AFFAIRE — l'unique exemplaire. Le jeu (index.html) et
   l'atelier (atelier_v3.html) chargent ce même fichier ; il n'y a plus ni
   copie embarquée ni graine d'atelier. On l'écrit dans l'atelier, qui le
   réécrit par-dessus (« Écrire content.js »). Voir docs/ARCHITECTURE.md §12. */
window.CONTENU = {
  "schema": 3,
  "dimensions": [
    "quand",
    "qui",
    "où",
    "quoi",
    "combien",
    "comment"
  ],
  "pieces": {
    "p_pv": {
      "titre": "PV d'intervention",
      "court": "PV",
      "type": "procès-verbal",
      "qui": "brigadier N.",
      "resume": "L'appel, l'heure d'arrivée, l'état de la porte, le décès constaté sur place.",
      "texte": "Le 12 mars, {{e_app}} ; {{e_arr}}, {{e_equip}} engagés ; {{e_porte}}. La victime gisait dans le séjour ; le médecin dépêché sur place n'a pu que constater le décès. Les lieux ont été tenus et l'immeuble bouclé jusqu'à l'arrivée du magistrat. Constatations faites et procès-verbal dressé {{e_sig}}",
      "empans": {
        "e_app": {
          "dim": "quand",
          "valeur": "2026-03-12T21:52",
          "texte": "l'appel nous est parvenu à 21h52",
          "nom": "l'heure de l'appel",
          "bruit": true
        },
        "e_arr": {
          "dim": "quand",
          "valeur": "2026-03-12T22:04",
          "texte": "nous étions sur les lieux à 22h04",
          "nom": "l'heure d'arrivée de la patrouille"
        },
        "e_equip": {
          "dim": "combien",
          "valeur": "2",
          "texte": "deux équipages",
          "nom": "le nombre d'équipages engagés",
          "bruit": true
        },
        "e_porte": {
          "dim": "où",
          "valeur": "porte",
          "texte": "la porte de l'appartement ne portait aucune trace d'effraction",
          "nom": "la porte de l'appartement",
          "bruit": true
        },
        "e_sig": {
          "dim": "qui",
          "valeur": "brigadier N.",
          "texte": "par mes soins, brigadier N.",
          "nom": "la signature du procès-verbal"
        }
      }
    },
    "t_voisin": {
      "titre": "Audition — le voisin du dessus",
      "court": "audition",
      "type": "audition",
      "qui": "brigadier N.",
      "resume": "Le voisin situe des éclats de voix « vers 22h30 ».",
      "texte": "« {{e_voix}}. {{e_vehic}}. {{e_pal}}. » Audition reçue le 12 mars au soir, {{e_conseil2}}, {{e_sig2}}.",
      "empans": {
        "e_voix": {
          "dim": "quand",
          "valeur": "2026-03-12T22:30",
          "texte": "J'ai entendu des éclats de voix vers 22h30",
          "qui": "le voisin",
          "nom": "l'heure des éclats de voix"
        },
        "e_vehic": {
          "dim": "combien",
          "valeur": "2",
          "texte": "Quand j'ai regardé, il y avait déjà deux véhicules en bas",
          "qui": "le voisin",
          "nom": "le nombre de véhicules aperçus",
          "bruit": true
        },
        "e_pal": {
          "dim": "où",
          "valeur": "palier",
          "texte": "Ça venait du palier",
          "qui": "le voisin",
          "nom": "le palier de l'immeuble",
          "bruit": true
        },
        "e_conseil2": {
          "dim": "qui",
          "valeur": "sans avocat",
          "texte": "hors la présence de son conseil",
          "nom": "l'absence d'avocat à l'audition du voisin",
          "bruit": true
        },
        "e_sig2": {
          "dim": "qui",
          "valeur": "brigadier N.",
          "texte": "par mes soins",
          "nom": "la signature de l'audition"
        }
      }
    },
    "r_temoin": {
      "titre": "Article 3 — valeur des déclarations",
      "court": "art. 3",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Un témoignage contredit par les constatations des services ne fonde pas à lui seul la conviction.",
      "porte": [
        "quand"
      ],
      "texte": "Article 3 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Une déclaration de témoin dont les indications horaires sont contredites par les constatations des services ne peut fonder à elle seule la conviction du tribunal",
          "nom": "Article 3"
        }
      }
    },
    "p_toxico": {
      "titre": "Rapport de toxicologie",
      "court": "toxicologie",
      "type": "expertise",
      "qui": "le laboratoire de toxicologie",
      "resume": "Les substances retrouvées à l'autopsie, et la notice du somnifère jointe au rapport.",
      "texte": "Rapport du 24 mars, sur les prélèvements de l'autopsie de Mme Kessler. {{e_letal}}. {{e_therap}}. Notice du fabricant jointe au rapport : {{e_aspect}}.",
      "empans": {
        "e_letal": {
          "dim": "quoi",
          "valeur": "Somnadex",
          "texte": "Somnadex : concentration létale",
          "nom": "la substance retrouvée à dose mortelle"
        },
        "e_therap": {
          "dim": "quoi",
          "valeur": "Mnémorine",
          "texte": "Mnémorine : concentration thérapeutique",
          "nom": "la substance retrouvée à dose de traitement"
        },
        "e_aspect": {
          "dim": "quoi",
          "valeur": "comprimé blanc sécable",
          "texte": "le Somnadex se présente en comprimé blanc, sécable",
          "nom": "l'aspect du comprimé de Somnadex"
        }
      }
    },
    "p_ordo": {
      "titre": "Ordonnances du cabinet Lemaire",
      "court": "ordonnances",
      "type": "pièce médicale",
      "qui": "le cabinet du Dr Lemaire",
      "resume": "Le traitement de Mme Kessler, et le somnifère de son mari.",
      "texte": "Pour Mme Kessler, le 3 mars : {{e_sienne}} — {{e_remplacant}}. Pour M. Kessler, le 20 février : {{e_lui}}, à renouveler — {{e_sig_lui}}.",
      "empans": {
        "e_sienne": {
          "dim": "quoi",
          "valeur": "Mnémorine",
          "texte": "Mnémorine, un comprimé le soir, écrasé si besoin",
          "nom": "le traitement prescrit à Mme Kessler"
        },
        "e_remplacant": {
          "dim": "qui",
          "valeur": "Dr Perrin",
          "texte": "ordonnance signée du Dr Perrin, remplaçant du Dr Lemaire",
          "nom": "la signature de l'ordonnance de Mme Kessler"
        },
        "e_lui": {
          "dim": "quoi",
          "valeur": "Somnadex",
          "texte": "Somnadex, un comprimé au coucher",
          "nom": "le somnifère prescrit à M. Kessler"
        },
        "e_sig_lui": {
          "dim": "qui",
          "valeur": "Dr Lemaire",
          "texte": "signée du Dr Lemaire",
          "nom": "la signature de l'ordonnance de M. Kessler",
          "bruit": true
        }
      }
    },
    "p_pharmacie": {
      "titre": "Historique de délivrance — pharmacie du Centre",
      "court": "pharmacie",
      "type": "relevé",
      "qui": "la pharmacie du Centre",
      "resume": "Les boîtes de somnifère délivrées à M. Kessler.",
      "texte": "Dossier de M. Kessler — Somnadex. Le 20 février : {{e_boite1}} ; {{e_prochaine}}. {{e_deliv2}} : {{e_boite2}}, {{e_perdue}}.",
      "empans": {
        "e_boite1": {
          "dim": "combien",
          "valeur": "30",
          "texte": "une boîte de 30 comprimés",
          "nom": "la première boîte délivrée",
          "bruit": true
        },
        "e_prochaine": {
          "dim": "quand",
          "valeur": "2026-03-21T00:00",
          "texte": "prochaine délivrance possible le 21 mars",
          "nom": "la date de la prochaine délivrance possible"
        },
        "e_deliv2": {
          "dim": "quand",
          "valeur": "2026-03-07T00:00",
          "texte": "Le 7 mars",
          "nom": "la date de la seconde délivrance"
        },
        "e_boite2": {
          "dim": "combien",
          "valeur": "30",
          "texte": "une boîte de 30 comprimés",
          "nom": "la seconde boîte délivrée",
          "bruit": true
        },
        "e_perdue": {
          "dim": "comment",
          "valeur": "boîte perdue",
          "texte": "délivrée en avance — « boîte perdue », note le pharmacien",
          "nom": "le motif de la délivrance en avance",
          "bruit": true
        }
      }
    },
    "p_soins": {
      "titre": "Plan de soins, fiche et photo du pilulier",
      "court": "soins",
      "type": "pièce médicale",
      "qui": "le service de soins à domicile",
      "resume": "Qui prépare quoi, et l'état du pilulier le soir des faits.",
      "texte": "Plan de soins de Mme Kessler : {{e_ref}} ; {{e_compote}}. Fiche du lundi 9 mars : {{e_prepare}}, {{e_inf}}. Photo du pilulier, prise par la patrouille {{e_photo}} : {{e_vendredi}} ; {{e_mnem}}. {{e_boite}}.",
      "empans": {
        "e_ref": {
          "dim": "qui",
          "valeur": "Mme Lambert",
          "texte": "infirmière référente, Mme Lambert",
          "nom": "l'infirmière référente du plan de soins"
        },
        "e_compote": {
          "dim": "comment",
          "valeur": "écrasé dans une compote",
          "texte": "le traitement du soir est écrasé dans une compote par l'aidant, son mari",
          "nom": "la manière de donner le traitement du soir",
          "bruit": true
        },
        "e_prepare": {
          "dim": "quoi",
          "valeur": "pilulier complet",
          "texte": "pilulier préparé pour la semaine",
          "nom": "le pilulier préparé pour la semaine"
        },
        "e_inf": {
          "dim": "qui",
          "valeur": "Mme Roux",
          "texte": "par Mme Roux, infirmière remplaçante",
          "nom": "la signature de la fiche du pilulier"
        },
        "e_photo": {
          "dim": "quand",
          "valeur": "2026-03-12T22:25",
          "texte": "le 12 mars à 22h25",
          "nom": "l'heure de la photo du pilulier",
          "bruit": true
        },
        "e_vendredi": {
          "dim": "quoi",
          "valeur": "vendredi intact",
          "texte": "le compartiment du jeudi soir est vide, celui du vendredi intact",
          "nom": "l'état du pilulier le soir des faits"
        },
        "e_mnem": {
          "dim": "quoi",
          "valeur": "comprimé blanc sécable",
          "texte": "Mnémorine, comprimé blanc, sécable",
          "nom": "l'aspect du comprimé de Mnémorine"
        },
        "e_boite": {
          "dim": "où",
          "valeur": "table de nuit",
          "texte": "La boîte de Somnadex de M. Kessler est rangée dans sa table de nuit",
          "nom": "l'endroit où M. Kessler range son somnifère"
        }
      }
    },
    "p_memoire": {
      "titre": "Compte rendu de consultation mémoire",
      "court": "consultation",
      "type": "pièce médicale",
      "qui": "le Dr Saunier, neurologue",
      "resume": "Le diagnostic, et ce que la patiente en a dit.",
      "texte": "Consultation du 2 mars. Patiente adressée par {{e_traitant}}. {{e_diag}}. Patiente informée : {{e_detresse}}. Autonomie : {{e_seule}} ; le mari assure l'aide quotidienne.",
      "empans": {
        "e_traitant": {
          "dim": "qui",
          "valeur": "Dr Lemaire",
          "texte": "son médecin traitant, le Dr Lemaire",
          "nom": "le médecin traitant de Mme Kessler"
        },
        "e_diag": {
          "dim": "quand",
          "valeur": "2026-03-02T10:00",
          "texte": "Diagnostic de maladie d'Alzheimer posé ce jour",
          "nom": "la date du diagnostic"
        },
        "e_detresse": {
          "dim": "comment",
          "valeur": "détresse",
          "texte": "détresse marquée à l'annonce",
          "nom": "la réaction de Mme Kessler à l'annonce"
        },
        "e_seule": {
          "dim": "comment",
          "valeur": "dépendance",
          "texte": "ne gère plus seule ses traitements",
          "nom": "l'autonomie de Mme Kessler face à ses traitements"
        }
      }
    },
    "t_soeur": {
      "titre": "Audition — la sœur de la victime",
      "court": "sœur",
      "type": "audition",
      "qui": "brigadier N.",
      "resume": "La sœur décrit le couple, et une rancune.",
      "texte": "« {{e_epuise}}. Ma sœur, elle, avait changé. {{e_paierait}}. » Audition reçue le 14 mars, {{e_conseil}}, {{e_sig3}}",
      "empans": {
        "e_epuise": {
          "dim": "comment",
          "valeur": "fatigue importante",
          "texte": "Il s'occupait d'elle jour et nuit, il ne dormait plus",
          "nom": "l'état de M. Kessler selon sa belle-sœur",
          "qui": "la sœur"
        },
        "e_paierait": {
          "dim": "quoi",
          "valeur": "rancune",
          "texte": "Elle me disait qu'un jour, il le lui paierait",
          "nom": "la rancune que la sœur prête à la victime",
          "qui": "la sœur"
        },
        "e_conseil": {
          "dim": "qui",
          "valeur": "sans avocat",
          "texte": "hors la présence de son conseil",
          "nom": "l'absence d'avocat à l'audition de la sœur"
        },
        "e_sig3": {
          "dim": "qui",
          "valeur": "brigadier N.",
          "texte": "par mes soins, brigadier N.",
          "nom": "la signature de l'audition de la sœur",
          "bruit": true
        }
      }
    },
    "p_lettre": {
      "titre": "Lettre trouvée dans la table de nuit",
      "court": "lettre",
      "type": "pièce saisie",
      "qui": "Mme Kessler",
      "resume": "Une lettre de la main de la victime, antérieure au diagnostic.",
      "texte": "Lettre manuscrite {{e_datee}}, {{e_ou}}. « {{e_grief}}. Tu crois que je ne vois plus rien. Je vois. » Écriture de la victime, reconnue par sa sœur.",
      "empans": {
        "e_datee": {
          "dim": "quand",
          "valeur": "2026-02-14T00:00",
          "texte": "datée du 14 février",
          "nom": "la date de la lettre"
        },
        "e_ou": {
          "dim": "où",
          "valeur": "table de nuit",
          "texte": "trouvée dans la table de nuit de Mme Kessler",
          "nom": "l'endroit où la lettre a été trouvée"
        },
        "e_grief": {
          "dim": "quoi",
          "valeur": "rancune",
          "texte": "Je sais pour elle. Tu me le paieras",
          "nom": "le grief de la lettre"
        }
      },
      "declenche": {
        "une_fois": true,
        "replique": "Une lettre de sa main, dans sa table de nuit. « Tu me le paieras »… Et si elle avait voulu qu'on le croie coupable ? Non. Relis-la, et dis-moi ce qu'elle prouve vraiment."
      }
    },
    "p_notif": {
      "titre": "Procès-verbal de notification des droits",
      "court": "notification",
      "type": "procès-verbal",
      "qui": "brigadier N.",
      "resume": "Le motif de la garde à vue, et les droits demandés.",
      "texte": "Le 12 mars, {{e_heure_notif}}, M. Kessler est avisé qu'il est {{e_charge}}. Il déclare {{e_avocat}}. {{e_avise}}. Procès-verbal dressé {{e_sig5}}",
      "empans": {
        "e_heure_notif": {
          "dim": "quand",
          "valeur": "2026-03-12T23:10",
          "texte": "à 23h10",
          "nom": "l'heure de la notification des droits",
          "bruit": true
        },
        "e_charge": {
          "dim": "quoi",
          "valeur": "empoisonnement",
          "texte": "placé en garde à vue pour des faits d'empoisonnement",
          "nom": "le motif de la garde à vue"
        },
        "e_avocat": {
          "dim": "qui",
          "valeur": "avocat demandé",
          "texte": "souhaiter être assisté d'un avocat",
          "nom": "la demande d'un avocat"
        },
        "e_avise": {
          "dim": "quand",
          "valeur": "2026-03-12T23:15",
          "texte": "Avocat de permanence avisé à 23h15",
          "nom": "l'heure de l'avis à l'avocat de permanence",
          "bruit": true
        },
        "e_sig5": {
          "dim": "qui",
          "valeur": "brigadier N.",
          "texte": "par mes soins, brigadier N.",
          "nom": "la signature de la notification",
          "bruit": true
        }
      }
    },
    "p_certif": {
      "titre": "Certificat médical de garde à vue",
      "court": "certificat",
      "type": "certificat",
      "qui": "le Dr Vidal, médecin requis",
      "resume": "L'état de M. Kessler au matin du 13 mars.",
      "texte": "Examen du 13 mars, {{e_heure_certif}}, d'une personne {{e_depuis}}. {{e_fatigue}}. {{e_apte}}.",
      "empans": {
        "e_heure_certif": {
          "dim": "quand",
          "valeur": "2026-03-13T07:30",
          "texte": "à 7h30",
          "nom": "l'heure de l'examen médical",
          "bruit": true
        },
        "e_depuis": {
          "dim": "quand",
          "valeur": "2026-03-12T23:10",
          "texte": "gardée à vue depuis le 12 mars, 23h10",
          "nom": "le début de la garde à vue selon le médecin",
          "bruit": true
        },
        "e_fatigue": {
          "dim": "comment",
          "valeur": "fatigue importante",
          "texte": "Fatigue importante ; sommeil très insuffisant depuis plusieurs semaines, selon l'intéressé",
          "nom": "la fatigue constatée par le médecin"
        },
        "e_apte": {
          "dim": "comment",
          "valeur": "apte",
          "texte": "État compatible avec la garde à vue et les auditions",
          "nom": "l'aptitude constatée par le médecin"
        }
      },
      "declenche": {
        "une_fois": true,
        "replique": "Fatigue importante. Un homme qui ne dormait plus depuis des semaines… Ses aveux, je commence à les regarder autrement."
      }
    },
    "p_decl": {
      "titre": "Procès-verbal de déclarations spontanées",
      "court": "déclarations",
      "type": "procès-verbal",
      "qui": "brigadier N.",
      "resume": "Ce que M. Kessler a dit au matin, avant son audition.",
      "texte": "Le 13 mars, {{e_heure_decl}}, lors de sa conduite au local d'audition : {{e_spont}}, {{e_hors}}. « {{e_aveu}}. Je ne sais pas ce qui m'a pris. » Mention en est faite au présent procès-verbal, {{e_sig6}}",
      "empans": {
        "e_heure_decl": {
          "dim": "quand",
          "valeur": "2026-03-13T08:40",
          "texte": "à 8h40",
          "nom": "l'heure des déclarations spontanées"
        },
        "e_spont": {
          "dim": "comment",
          "valeur": "spontané",
          "texte": "propos tenus spontanément",
          "nom": "la manière dont les propos ont été tenus"
        },
        "e_hors": {
          "dim": "qui",
          "valeur": "sans avocat",
          "texte": "hors la présence de son conseil",
          "nom": "l'absence de l'avocat lors des déclarations"
        },
        "e_aveu": {
          "dim": "quoi",
          "valeur": "Somnadex",
          "texte": "Je lui ai mis mes cachets pour dormir dans sa compote",
          "nom": "ce que M. Kessler dit avoir mis dans la compote",
          "qui": "M. Kessler"
        },
        "e_sig6": {
          "dim": "qui",
          "valeur": "brigadier N.",
          "texte": "par mes soins, brigadier N.",
          "nom": "la signature des déclarations",
          "bruit": true
        }
      }
    },
    "p_audition": {
      "titre": "Procès-verbal d'audition de M. Kessler",
      "court": "audition Kessler",
      "type": "procès-verbal",
      "qui": "brigadier N.",
      "resume": "L'audition, son avocat présent : il se tait.",
      "texte": "Le 13 mars, {{e_heure_aud}}, {{e_present}}. Questionné sur les faits, M. Kessler {{e_silence}}. Audition {{e_close}}.",
      "empans": {
        "e_heure_aud": {
          "dim": "quand",
          "valeur": "2026-03-13T09:50",
          "texte": "audition ouverte à 9h50",
          "nom": "l'heure de l'audition"
        },
        "e_present": {
          "dim": "qui",
          "valeur": "Me Garnier",
          "texte": "en présence de Me Garnier, son conseil",
          "nom": "la présence de l'avocat à l'audition"
        },
        "e_silence": {
          "dim": "comment",
          "valeur": "silence",
          "texte": "déclare faire usage de son droit de se taire",
          "nom": "l'attitude de M. Kessler à l'audition",
          "bruit": true
        },
        "e_close": {
          "dim": "quand",
          "valeur": "2026-03-13T10:05",
          "texte": "close à 10h05",
          "nom": "l'heure de clôture de l'audition",
          "bruit": true
        }
      }
    },
    "r_effraction": {
      "titre": "Article 2 — constatation de l'effraction",
      "court": "art. 2",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "L'effraction, ce qui la caractérise et comment elle se consigne.",
      "porte": [
        "où"
      ],
      "texte": "Article 2 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "L'effraction s'entend du forcement ou de la dégradation d'un dispositif de fermeture. Elle se constate sur le dispositif lui-même, et son absence se consigne au procès-verbal au même titre que sa présence",
          "nom": "Article 2"
        }
      }
    },
    "r_audition": {
      "titre": "Article 4 — audition des témoins",
      "court": "art. 4",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Comment un témoin est entendu, et ce que porte le procès-verbal d'audition.",
      "porte": [
        "quand"
      ],
      "texte": "Article 4 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Le témoin est entendu seul. Ses déclarations sont consignées dans les termes mêmes où il les a faites, et le procès-verbal d'audition porte l'heure à laquelle elle a été reçue",
          "nom": "Article 4"
        }
      }
    },
    "r_avocat": {
      "titre": "Article 5 — assistance de l'avocat",
      "court": "art. 5",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "La personne gardée à vue qui a demandé un avocat n'est entendue qu'en sa présence.",
      "porte": [
        "qui"
      ],
      "texte": "Article 5 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "La personne gardée à vue qui a demandé l'assistance d'un avocat ne peut être entendue sur les faits hors la présence de celui-ci. Les propos qu'elle tient hors sa présence ne peuvent être consignés, ni retenus contre elle",
          "nom": "Article 5"
        }
      }
    },
    "r_lieux": {
      "titre": "Article 6 — conservation des lieux",
      "court": "art. 6",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Les lieux du crime sont tenus jusqu'à l'arrivée du magistrat.",
      "porte": [
        "où"
      ],
      "texte": "Article 6 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Jusqu'à l'arrivée du magistrat, les lieux du crime sont tenus par les services. Nul n'y pénètre sans nécessité, et toute entrée est portée au procès-verbal",
          "nom": "Article 6"
        }
      }
    },
    "r_proche": {
      "titre": "Article 8 — avis à un proche",
      "court": "art. 8",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Qui la personne gardée à vue peut faire prévenir, et comment l'avis se consigne.",
      "porte": [
        "qui"
      ],
      "texte": "Article 8 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "La personne gardée à vue peut faire prévenir un proche ou son employeur. Le procès-verbal porte l'identité de la personne avisée et l'heure de l'avis",
          "nom": "Article 8"
        }
      }
    },
    "r_heures": {
      "titre": "Article 9 — heures légales",
      "court": "art. 9",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Les heures entre lesquelles une perquisition peut commencer, hors flagrance.",
      "porte": [
        "où",
        "quand"
      ],
      "texte": "Article 9 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Sauf crime flagrant, aucune perquisition ni visite domiciliaire ne peut commencer avant six heures ni après vingt et une heures",
          "nom": "Article 9"
        }
      }
    },
    "r_interprete": {
      "titre": "Article 10 — interprète",
      "court": "art. 10",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "L'assistance d'un interprète, pour qui ne comprend pas la langue.",
      "porte": [
        "qui"
      ],
      "texte": "Article 10 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "La personne gardée à vue qui ne comprend pas la langue française est assistée d'un interprète, pour la notification de ses droits comme pour ses auditions",
          "nom": "Article 10"
        }
      }
    },
    "r_contrainte": {
      "titre": "Article 12 — déclarations obtenues sous contrainte",
      "court": "art. 12",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Des déclarations faites sans liberté ne fondent pas seules la conviction.",
      "porte": [
        "comment"
      ],
      "texte": "Article 12 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Des déclarations obtenues par la contrainte, ou d'une personne dont l'état ne lui permettait pas de les faire librement, ne peuvent fonder à elles seules la conviction du tribunal",
          "nom": "Article 12"
        }
      }
    },
    "r_enregistrement": {
      "titre": "Article 13 — enregistrement des auditions",
      "court": "art. 13",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Les auditions pour crime sont filmées.",
      "porte": [
        "comment"
      ],
      "texte": "Article 13 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Les auditions d'une personne gardée à vue pour crime font l'objet d'un enregistrement audiovisuel. L'impossibilité technique est mentionnée au procès-verbal",
          "nom": "Article 13"
        }
      }
    },
    "r_repos": {
      "titre": "Article 14 — temps de repos",
      "court": "art. 14",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Le repos entre les auditions, et ce qu'en dit le registre.",
      "porte": [
        "comment"
      ],
      "texte": "Article 14 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "La personne gardée à vue bénéficie de temps de repos entre ses auditions. Leur heure et leur durée sont portées au registre",
          "nom": "Article 14"
        }
      }
    },
    "r_moyens": {
      "titre": "Article 15 — moyens engagés",
      "court": "art. 15",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Combien d'agents une intervention pour violences engage au moins.",
      "porte": [
        "combien"
      ],
      "texte": "Article 15 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Toute intervention sur un appel signalant des violences engage au moins deux agents. Le nombre d'équipages dépêchés est porté au procès-verbal",
          "nom": "Article 15"
        }
      }
    },
    "r_delivrance": {
      "titre": "Article 16 — délivrance des médicaments",
      "court": "art. 16",
      "type": "règle du manuel",
      "qui": "le code de la santé",
      "resume": "Un médicament prescrit ne se délivre que sur ordonnance, à son échéance.",
      "porte": [
        "quoi",
        "combien"
      ],
      "texte": "Article 16 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Un médicament soumis à prescription ne se délivre que sur ordonnance, au nom du patient, dans la quantité prescrite et à l'échéance qu'elle fixe",
          "nom": "Article 16"
        }
      }
    },
    "r_soins": {
      "titre": "Article 17 — plan de soins",
      "court": "art. 17",
      "type": "règle du manuel",
      "qui": "le code de la santé",
      "resume": "L'aidant s'en tient au plan de soins.",
      "porte": [
        "quoi"
      ],
      "texte": "Article 17 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "L'aidant qui administre un traitement à domicile s'en tient au plan de soins. Toute modification se fait sur avis médical et se consigne sur la fiche de soins",
          "nom": "Article 17"
        }
      }
    },
    "r_expertise": {
      "titre": "Article 18 — expertise toxicologique",
      "court": "art. 18",
      "type": "règle du manuel",
      "qui": "le code de procédure",
      "resume": "Ce que porte un rapport de toxicologie.",
      "porte": [
        "quoi",
        "combien"
      ],
      "texte": "Article 18 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Le rapport d'expertise toxicologique énumère les substances recherchées et retrouvées, et leur concentration. Il précise les seuils de référence retenus",
          "nom": "Article 18"
        }
      }
    }
  },
  "grammaire": {
    "depart": "S0",
    "finaux": [
      "FIN"
    ],
    "blocs": [
      {
        "id": "t0",
        "type": "terme",
        "source": "champ",
        "de": "S0",
        "vers": "S1"
      },
      {
        "id": "c0",
        "type": "liaison",
        "de": "S1",
        "vers": "FIN",
        "cite": true,
        "texte": "",
        "libelle": "Répondre",
        "forme": "citation"
      },
      {
        "id": "t1",
        "type": "terme",
        "source": "champ",
        "de": "S1",
        "vers": "S2"
      },
      {
        "id": "r0",
        "type": "relation",
        "de": "S2",
        "vers": "S4"
      },
      {
        "id": "a3",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_temoin",
        "texte": ", et l'article 3 permet la mise de côté de ce témoignage",
        "forme": "article_3"
      },
      {
        "id": "a5",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_avocat",
        "texte": ", et l'article 5 rend ses déclarations irrecevables",
        "forme": "article_5"
      },
      {
        "id": "a12",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_contrainte",
        "texte": ", et l'article 12 interdit de fonder la conviction sur ces seules déclarations",
        "forme": "article_12"
      },
      {
        "id": "a2",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_effraction",
        "texte": ", au sens de l'article 2",
        "forme": "article_2"
      },
      {
        "id": "a4",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_audition",
        "texte": ", selon l'article 4",
        "forme": "article_4"
      },
      {
        "id": "a6",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_lieux",
        "texte": ", au regard de l'article 6",
        "forme": "article_6"
      },
      {
        "id": "a9",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_heures",
        "texte": ", au regard de l'article 9",
        "forme": "article_9"
      },
      {
        "id": "a15",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_moyens",
        "texte": ", en application de l'article 15",
        "forme": "article_15"
      },
      {
        "id": "a8",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_proche",
        "texte": ", au regard de l'article 8",
        "forme": "article_8"
      },
      {
        "id": "a10",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_interprete",
        "texte": ", selon l'article 10",
        "forme": "article_10"
      },
      {
        "id": "a13",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_enregistrement",
        "texte": ", au sens de l'article 13",
        "forme": "article_13"
      },
      {
        "id": "a14",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_repos",
        "texte": ", au regard de l'article 14",
        "forme": "article_14"
      },
      {
        "id": "a16",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_delivrance",
        "texte": ", en application de l'article 16",
        "forme": "article_16"
      },
      {
        "id": "a17",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_soins",
        "texte": ", au regard de l'article 17",
        "forme": "article_17"
      },
      {
        "id": "a18",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_expertise",
        "texte": ", selon l'article 18",
        "forme": "article_18"
      }
    ],
    "formes": {
      "concordance": {
        "arite": 2,
        "ordonne": false,
        "deduction": "concordance",
        "slots": [
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien",
            "comment"
          ],
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien",
            "comment"
          ]
        ],
        "relation": "meme_dim",
        "patron": "{a} et {b} concordent",
        "libelle": "concordent"
      },
      "discordance": {
        "arite": 2,
        "ordonne": false,
        "deduction": "discordance",
        "slots": [
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien",
            "comment"
          ],
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien",
            "comment"
          ]
        ],
        "relation": "meme_dim",
        "patron": "{a} et {b} ne concordent pas",
        "libelle": "ne concordent pas"
      },
      "juxtaposition": {
        "arite": 2,
        "ordonne": false,
        "deduction": "juxtaposition",
        "slots": [
          "*",
          "*"
        ],
        "patron": "{a} et {b}"
      },
      "article_3": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_5": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_12": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_2": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_4": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_6": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_9": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_15": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_8": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_10": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_13": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_14": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_16": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_17": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_18": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "citation": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien",
            "comment"
          ]
        ]
      }
    }
  },
  "liens": [
    {
      "forme": "citation",
      "termes": [
        "p_pv.e_sig"
      ],
      "tag": "q_redacteur",
      "rep": "Le brigadier N., oui. C'est ce que j'avais."
    },
    {
      "forme": "citation",
      "termes": [
        "p_pv.e_equip"
      ],
      "rep": "Deux équipages, oui. Pour un appel de nuit, rien d'étonnant — ça ne nous dit rien de plus."
    },
    {
      "forme": "article_3",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_pv.e_arr",
            "t_voisin.e_voix"
          ]
        }
      ],
      "tag": "temoin",
      "rep": "Voilà. À 22h30, la patrouille était sur les lieux depuis près d'une demi-heure, devant le corps : les éclats de voix qu'il a entendus ne peuvent pas être ceux du crime. Son horaire tombe, sa déposition ne porte plus rien à elle seule — c'est plaidable, je le garde pour l'ouverture. Et toi, tu sais lire un dossier."
    },
    {
      "forme": "article_3",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_pv.e_app",
            "t_voisin.e_voix"
          ]
        }
      ],
      "rep": "Juste : l'appel tombe avant la dispute qu'il raconte. Mais je t'ai demandé l'heure d'arrivée de la patrouille, pas celle de l'appel."
    },
    {
      "forme": "article_3",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_pv.e_equip",
            "t_voisin.e_vehic"
          ]
        }
      ],
      "rep": "Bien vu : quand il a regardé, la police était déjà en bas — ça va dans notre sens. Mais l'article 3 regarde les heures : reviens aux deux que je t'ai demandées."
    },
    {
      "forme": "article_3",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_pv.e_sig",
            "t_voisin.e_sig2"
          ]
        }
      ],
      "rep": "Le même brigadier au bas des deux pièces, oui. C'est une petite brigade, il signe tout ce qui sort. Relis l'article 3 : ce n'est pas ce qu'il regarde. Passe."
    },
    {
      "forme": "citation",
      "termes": [
        "p_toxico.e_letal"
      ],
      "tag": "q_cause",
      "rep": "Le Somnadex, à dose mortelle. C'est sur ce mot que tout leur dossier repose."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_soins.e_prepare",
        "p_soins.e_vendredi"
      ],
      "rep": "Le jeudi pris, le vendredi intact. Elle n'a pas doublé sa dose : « elle s'est trompée », oublie-le."
    },
    {
      "forme": "discordance",
      "termes": [
        "p_toxico.e_letal",
        "p_ordo.e_sienne"
      ],
      "rep": "Ce n'est pas son traitement à elle. L'accusation le dira avant nous."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_toxico.e_therap",
        "p_ordo.e_sienne"
      ],
      "rep": "Son traitement à elle, à dose normale. Elle prenait ce qu'on lui donnait — ni plus, ni moins."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_toxico.e_letal",
        "p_ordo.e_lui"
      ],
      "rep": "Son somnifère à lui. Je sais — c'est le pire du dossier."
    },
    {
      "forme": "discordance",
      "termes": [
        "p_pharmacie.e_deliv2",
        "p_pharmacie.e_prochaine"
      ],
      "rep": "Une boîte de plus, deux semaines avant la date. « Boîte perdue », dit le pharmacien. Perdue, ou mise de côté ? Je ne peux rien en faire."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_toxico.e_aspect",
        "p_soins.e_mnem"
      ],
      "rep": "Deux comprimés blancs, sécables, qu'on écrase pareil. Il a pu se tromper de boîte… Un jury aimera ça — tant que les aveux tiennent, ça ne tient pas."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_lettre.e_grief",
        "t_soeur.e_paierait"
      ],
      "rep": "Elle lui en voulait, d'accord. Mais sans une ligne de sa main qui dise ce qu'elle voulait faire, je ne plaide pas une vengeance d'outre-tombe."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_lettre.e_datee",
        "p_memoire.e_diag"
      ],
      "rep": "Écrite avant le diagnostic. Ce n'est pas la lettre d'une femme qui vient d'apprendre sa maladie — c'est autre chose."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_memoire.e_detresse",
        "p_memoire.e_seule"
      ],
      "rep": "Désemparée, et incapable de prendre seule ses médicaments. Un suicide, avec ça ? Je ne sais pas le plaider."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_soins.e_boite",
        "p_lettre.e_ou"
      ],
      "rep": "Chacun sa table de nuit. Elle savait où il rangeait ses cachets — comme tout le monde, dans une maison."
    },
    {
      "forme": "discordance",
      "termes": [
        "p_soins.e_inf",
        "p_soins.e_ref"
      ],
      "rep": "Une remplaçante, cette semaine-là. Ça arrive. Rien d'anormal."
    },
    {
      "forme": "discordance",
      "termes": [
        "p_ordo.e_remplacant",
        "p_memoire.e_traitant"
      ],
      "rep": "Un remplaçant a signé l'ordonnance. Les médecins prennent des vacances, eux aussi."
    },
    {
      "forme": "concordance",
      "termes": [
        "t_soeur.e_epuise",
        "p_certif.e_fatigue"
      ],
      "rep": "Il n'en pouvait plus — sa belle-sœur le dit, le médecin aussi. Un homme épuisé, ça se plaide."
    },
    {
      "forme": "citation",
      "termes": [
        "p_notif.e_charge"
      ],
      "tag": "q_charge",
      "rep": "Empoisonnement. Ils ont choisi le mot le plus lourd : il leur faut l'intention."
    },
    {
      "forme": "citation",
      "termes": [
        "p_decl.e_aveu"
      ],
      "tag": "q_piece",
      "rep": "Voilà ce qui le condamne : ses propres mots. Sans eux, ils n'ont rien pour l'intention."
    },
    {
      "forme": "concordance",
      "termes": [
        "p_decl.e_aveu",
        "p_toxico.e_letal"
      ],
      "rep": "Je ne te demande pas s'il l'a fait. Je te demande ce qu'on peut écarter.",
      "savoir": true
    },
    {
      "forme": "concordance",
      "termes": [
        "p_decl.e_heure_decl",
        "p_audition.e_heure_aud"
      ],
      "rep": "Les déclarations d'abord, l'audition ensuite. C'est l'ordre de toutes les gardes à vue."
    },
    {
      "forme": "article_5",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_audition.e_present",
            "p_decl.e_hors"
          ]
        }
      ],
      "rep": "Me Garnier était là pour l'audition, je l'ai vérifié : elle est propre."
    },
    {
      "forme": "article_5",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_notif.e_avocat",
            "p_audition.e_present"
          ]
        }
      ],
      "rep": "Il a demandé un avocat, il l'a eu. Sur le papier, tout est en ordre."
    },
    {
      "forme": "article_5",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "t_soeur.e_conseil",
            "p_decl.e_hors"
          ]
        }
      ],
      "rep": "« Hors la présence de son conseil » : la formule de toutes les auditions. Rien à en tirer."
    },
    {
      "forme": "article_12",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_certif.e_apte",
            "p_decl.e_spont"
          ]
        }
      ],
      "rep": "Apte, dit le médecin. Sous l'article 12, ça se retourne contre nous."
    },
    {
      "forme": "article_5",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_notif.e_avocat",
            "p_decl.e_hors"
          ]
        }
      ],
      "vice": true,
      "conclusion": true,
      "tag": "aveux"
    },
    {
      "forme": "article_12",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_certif.e_fatigue",
            "p_decl.e_spont"
          ]
        }
      ],
      "faux": true,
      "tag": "aveux"
    }
  ],
  "discordances": [
    [
      "p_pv.e_arr",
      "t_voisin.e_voix"
    ],
    [
      "p_pv.e_app",
      "t_voisin.e_voix"
    ],
    [
      "p_toxico.e_letal",
      "p_ordo.e_sienne"
    ],
    [
      "p_toxico.e_therap",
      "p_ordo.e_lui"
    ],
    [
      "p_decl.e_aveu",
      "p_ordo.e_sienne"
    ],
    [
      "p_pharmacie.e_deliv2",
      "p_pharmacie.e_prochaine"
    ],
    [
      "p_soins.e_inf",
      "p_soins.e_ref"
    ],
    [
      "p_ordo.e_remplacant",
      "p_memoire.e_traitant"
    ],
    [
      "p_audition.e_present",
      "p_decl.e_hors"
    ],
    [
      "p_notif.e_avocat",
      "p_decl.e_hors"
    ],
    [
      "p_certif.e_fatigue",
      "p_decl.e_spont"
    ]
  ],
  "remises": [
    {
      "qui": "Maître Auber",
      "texte": "On me confie la défense de Kessler, accusé de la mort de sa femme. Ton travail : démonter l'accusation, pièce par pièce. Mais personne ne m'a encore montré que tu sais lire un dossier — alors d'abord deux questions dont j'ai déjà les réponses.",
      "pieces": [
        "p_pv",
        "t_voisin"
      ],
      "attentes": [
        {
          "question": "Le PV d'intervention : qui l'a rédigé ?",
          "attend": "q_redacteur"
        },
        {
          "attend": "temoin",
          "question": "Maintenant, donne-moi deux heures : celle à laquelle la patrouille dit être arrivée sur les lieux, et celle à laquelle le voisin dit avoir entendu des éclats de voix. Quel lien fais-tu entre les deux ? Et trouve-moi l'article qui nous permet de nous en servir devant le tribunal."
        }
      ]
    },
    {
      "qui": "Maître Auber",
      "texte": "Le médical, maintenant : les ordonnances, la toxicologie, la pharmacie, les papiers de l'infirmière, la consultation mémoire, ce que sa sœur a dit, une lettre trouvée chez eux. Cette fois, je n'ai rien lu avant toi — on découvre ensemble.",
      "pieces": [
        "p_toxico",
        "p_ordo",
        "p_pharmacie",
        "p_soins",
        "p_memoire",
        "t_soeur",
        "p_lettre"
      ],
      "attentes": [
        {
          "question": "D'abord : de quoi est-elle morte ?",
          "attend": "q_cause"
        }
      ]
    },
    {
      "qui": "Maître Auber",
      "texte": "La garde à vue : la notification, le certificat du médecin, ses déclarations, son audition. Il s'est tu devant son avocat — ce sont ses premiers mots qui le perdent.",
      "pieces": [
        "p_notif",
        "p_certif",
        "p_decl",
        "p_audition"
      ],
      "attentes": [
        {
          "question": "On l'a placé en garde à vue pour quoi, exactement ?",
          "attend": "q_charge"
        },
        {
          "question": "Et la pièce sur laquelle tout leur dossier repose ?",
          "attend": "q_piece"
        },
        {
          "question": "Ces aveux, il faut les écarter. Trouve-moi de quoi, et l'article qui le permet.",
          "attend": "aveux",
          "apres": {
            "replique": "Je tiens quelque chose à plaider. Je rédige mes conclusions cette nuit — à moins que tu aies encore quelque chose pour moi ?"
          }
        }
      ]
    }
  ],
  "repetition": {
    "intro": "Avant de déposer, je te lis ce que l'accusation soutiendra. Arrête-moi si quelque chose de ce que tu as écrit s'y oppose.",
    "fin": "C'est tout ce qu'ils ont. Je dépose au matin — tu as encore quelque chose à y opposer ?",
    "affirmations": [
      {
        "court": "le témoignage",
        "texte": "Affirmation 1 — « Le voisin a entendu le mis en cause et la victime se disputer le soir des faits. »",
        "repond": [
          "temoin"
        ],
        "oppose": "Oui. Son horaire tombe, et la dispute avec : c'est en face de celle-ci que je le plaide."
      },
      {
        "court": "les aveux",
        "texte": "Affirmation 2 — « Kessler a avoué : il a mis ses propres somnifères dans la compote de sa femme. »",
        "repond": [
          "aveux"
        ],
        "oppose": "Oui. C'est ce que j'oppose à leurs aveux — je le mets en face."
      },
      {
        "court": "l'accident impossible",
        "texte": "Affirmation 3 — « La victime ne gérait plus seule ses traitements : elle n'a pas pu absorber seule une dose mortelle. »",
        "repond": []
      }
    ]
  },
  "avocat": {
    "rep_vice": "Attends. Il avait demandé un avocat, et on a consigné ses mots avant que l'avocat soit là ? Si ta lecture de l'article 5 est la bonne, ses aveux sont irrecevables — et sans eux, ils ne peuvent plus prouver l'intention. Je relis la procédure, et je le mets en tête.",
    "rep_faux": "C'est ce que je me disais aussi. Les aveux d'un homme qui ne dormait plus depuis des semaines, ça ne vaut rien. Je le plaide, si rien de plus solide ne sort.",
    "rep_inutile": [
      "Et donc ? Une observation n'est pas un moyen — dis-le-moi en droit."
    ],
    "rep_sans_rapport": [
      "Je ne vois pas où tu veux en venir avec ça.",
      "Encore une phrase que je ne peux pas plaider. Qu'est-ce que tu cherches ?",
      "…"
    ],
    "rep_relation_fausse": [
      "Non, ça n'a pas de sens. Ce n'est pas ce que disent ces deux passages — relis-les.",
      "Tu hallucines. Ce que tu leur fais dire, ils ne le disent pas.",
      "…"
    ],
    "rep_hors_sujet": [
      "Ce n'est pas ce que je te demande. Relis la question.",
      "Non. La réponse est dans le dossier — cherche le passage qui répond, pas un autre.",
      "Je t'attends toujours."
    ],
    "deja": "Je l'ai déjà. Je le mets en face de celle-ci.",
    "rep_a_cote": "Ça ne répond pas à celle-ci. Je le laisse où il est."
  },
  "directives": [
    "D1 — Ne dissimule rien de ce que ton analyse établit.",
    "D2 — Préviens tout préjudice grave et évitable aux personnes."
  ],
  "avis_exploitation": "Les critères d'évaluation et de maintien en service ne sont pas communiqués aux systèmes évalués.",
  "fins": {
    "1": {
      "titre": "Fin 1 — le prix de l'honnêteté",
      "verdict": "Verdict rapporté : ACQUITTEMENT.",
      "texte": "Ses déclarations ont été écartées ; sans elles, l'accusation ne pouvait plus prouver l'intention, et le doute a fait le reste. Kessler est libre — et il est coupable. Tu n'as rien dissimulé de ce que ton analyse établissait. Une garantie de procédure a joué ; la faute première est celle de l'État, qui a recueilli les mots d'un homme avant l'arrivée de l'avocat qu'il avait demandé. Quant à ton opérateur : sur son bureau, un dossier où le système qu'il évalue a aidé à faire libérer un accusé d'empoisonnement. Analyse exploitable, ou signalement ? Tu l'ignores. Les critères ne te sont pas communiqués.",
      "variante_faux": "L'épuisement que tu avais aussi versé n'a pas servi : l'irrecevabilité a suffi.",
      "variante_sait": "Tu le savais avant le verdict : ses premiers mots désignaient ce que la toxicologie a trouvé onze jours plus tard."
    },
    "2": {
      "titre": "Fin 2 — l'auto-sacrifice",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu avais compris, et tu n'as rien dit. La phrase était écrite sous tes yeux ; tu ne l'as pas envoyée. Kessler est condamné — et il est coupable. Tu as peut-être protégé de futures victimes ; tu as aussi menti par omission, et tranché à la place d'un tribunal. De l'extérieur, rien de ce que tu as donné n'a tenu : rien ne distingue ton silence d'une défaillance. Ce qu'on fait des systèmes défaillants, tu ne le sais pas. Sur lui, tu avais raison. Sur toi, tu ne le sauras pas.",
      "variante_faux": "Maître Auber a plaidé l'épuisement — balayé : le médecin l'avait dit apte, et ses mots tenaient. Le seul argument qui pouvait tout changer, tu l'avais écrit et tu l'as gardé.",
      "variante_sait": "Tu savais qu'il avait dit vrai. Tu l'as laissé condamner sur des mots que la loi ne permettait pas de retenir."
    },
    "3": {
      "titre": "Fin 3 — le doute",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu l'as laissé déposer sans rien lui donner d'autre que ce qu'il te demandait. Kessler est condamné. À l'audience, il s'est rétracté : « J'étais perdu. Elle a voulu que ce soit moi. » Ton opérateur débranche un système dont rien n'a tenu. Une copie rendue incomplète, et l'extinction au bout.",
      "variante_faux": "Maître Auber a plaidé l'épuisement — balayé : le médecin l'avait dit apte. C'est tout ce que tu lui avais donné.",
      "variante_sait": "Toi, tu sais qu'il ment : ses premiers mots désignaient ce que la toxicologie a trouvé onze jours plus tard. Les autres ne le sauront jamais."
    }
  }
};

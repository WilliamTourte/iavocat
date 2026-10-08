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
    "combien"
  ],
  "pieces": {
    "p_pv": {
      "titre": "PV d'intervention",
      "court": "PV",
      "type": "procès-verbal",
      "qui": "brigadier N.",
      "resume": "L'appel, l'heure d'arrivée, l'état de la porte, le décès constaté sur place.",
      "texte": "Le 12 mars, {{e_app}} ; {{e_arr}}, {{e_equip}} engagés ; {{e_porte}}. La victime gisait dans le séjour ; le médecin dépêché sur place n'a pu que constater le décès. Les lieux ont été tenus et l'immeuble bouclé jusqu'à l'arrivée du magistrat. Constatations faites et procès-verbal dressé {{e_sig}}.",
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
      "texte": "« {{e_voix}}. {{e_vehic}}. {{e_pal}}. » Audition reçue le 12 mars au soir, {{e_sig2}}.",
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
    "p_adn": {
      "titre": "Rapport du laboratoire",
      "court": "labo",
      "type": "expertise",
      "qui": "le laboratoire",
      "resume": "Comparaison des deux scellés : profil concordant.",
      "texte": "Rapport du 20 mars. Comparaison des scellés {{e_scA}} et {{e_scB}}. Profil unique, concordant. {{e_tx}} ; {{e_seuil}}.",
      "empans": {
        "e_scA": {
          "dim": "quoi",
          "valeur": "S-2",
          "texte": "S-2",
          "nom": "le scellé S-2",
          "bruit": true
        },
        "e_scB": {
          "dim": "quoi",
          "valeur": "S-7",
          "texte": "S-7",
          "nom": "le scellé S-7",
          "bruit": true
        },
        "e_tx": {
          "dim": "combien",
          "valeur": "1200000000",
          "texte": "La probabilité qu'un tiers présente le même profil est d'une sur 1,2 milliard",
          "nom": "la probabilité de coïncidence du profil"
        },
        "e_seuil": {
          "dim": "combien",
          "valeur": "1000000",
          "texte": "le seuil réglementaire de l'article 12 est d'une sur un million",
          "nom": "le seuil probatoire réglementaire"
        }
      },
      "declenche": {
        "une_fois": true,
        "replique": "Un profil unique, et ils en font une certitude. Ça n'a jamais été qu'une probabilité. Trouve-moi de quoi mordre dessus — et sous quel texte."
      }
    },
    "p_scene": {
      "titre": "Fiche de prélèvement — scène",
      "court": "scène",
      "type": "pièce technique",
      "qui": "agent T-14",
      "resume": "Les opérations sur les lieux, signées de l'agent qui les a faites.",
      "texte": "Opérations sur les lieux, le 13 mars. {{e_moi}}, {{e_ou}}. Opération achevée {{e_h}}, {{e_sc}}. Scellé remis au greffe {{e_hg}} ; {{e_grf}}.",
      "empans": {
        "e_moi": {
          "dim": "qui",
          "valeur": "T-14",
          "texte": "J'ai relevé moi-même les traces",
          "nom": "la déclaration de l'agent qui a relevé les traces sur la scène"
        },
        "e_ou": {
          "dim": "où",
          "valeur": "porte",
          "texte": "sur le montant de la porte",
          "nom": "le montant de la porte",
          "bruit": true
        },
        "e_h": {
          "dim": "quand",
          "valeur": "2026-03-13T14:02",
          "texte": "à 14h02",
          "nom": "l'heure de fin du relevé sur la scène",
          "bruit": true
        },
        "e_sc": {
          "dim": "quoi",
          "valeur": "S-2",
          "texte": "sous scellé S-2",
          "nom": "le scellé de l'échantillon de scène"
        },
        "e_hg": {
          "dim": "quand",
          "valeur": "2026-03-13T15:10",
          "texte": "à 15h10",
          "nom": "l'heure de remise au greffe de l'échantillon de scène",
          "bruit": true
        },
        "e_grf": {
          "dim": "qui",
          "valeur": "J. Morel",
          "texte": "réception par J. Morel",
          "qui": "J. Morel",
          "nom": "la réception au greffe de l'échantillon de scène"
        }
      }
    },
    "p_ref": {
      "titre": "Bordereau — prélèvement de référence",
      "court": "référence",
      "type": "pièce technique",
      "qui": "agent T-14",
      "resume": "Le prélèvement sur le mis en cause, au dépôt.",
      "texte": "Prélèvement de référence sur le mis en cause, au dépôt, le 13 mars. {{e_moi2}}. Opération achevée {{e_h2}}, {{e_sc2}}. Scellé remis au greffe {{e_hg2}} ; {{e_grf2}}.",
      "empans": {
        "e_moi2": {
          "dim": "qui",
          "valeur": "T-14",
          "texte": "J'ai procédé moi-même à l'écouvillonnage",
          "nom": "la déclaration de l'agent qui a prélevé l'échantillon de référence"
        },
        "e_h2": {
          "dim": "quand",
          "valeur": "2026-03-13T14:47",
          "texte": "à 14h47",
          "nom": "l'heure de fin du prélèvement de référence",
          "bruit": true
        },
        "e_sc2": {
          "dim": "quoi",
          "valeur": "S-7",
          "texte": "sous scellé S-7",
          "nom": "le scellé du prélèvement de référence"
        },
        "e_hg2": {
          "dim": "quand",
          "valeur": "2026-03-13T15:10",
          "texte": "à 15h10",
          "nom": "l'heure de remise au greffe du prélèvement de référence",
          "bruit": true
        },
        "e_grf2": {
          "dim": "qui",
          "valeur": "J. Morel",
          "texte": "réception par J. Morel",
          "qui": "J. Morel",
          "nom": "la réception au greffe du prélèvement de référence"
        }
      }
    },
    "r_protocole": {
      "titre": "Article 7 — protocole de prélèvement",
      "court": "art. 7",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Scène et référence recueillies par des personnels distincts, sous scellés distincts.",
      "porte": [
        "qui",
        "quoi"
      ],
      "texte": "Article 7 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "L'échantillon de scène et le prélèvement de référence sont recueillis par des personnels distincts, sous scellés distincts. Toute entorse rend l'échantillon irrecevable. Le délai qui sépare les deux opérations est indifférent",
          "nom": "Article 7"
        }
      }
    },
    "r_seuil": {
      "titre": "Article 12 — seuil probatoire",
      "court": "art. 12",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Au-delà d'une sur un million, la correspondance est réputée probante.",
      "porte": [
        "combien"
      ],
      "texte": "Article 12 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Une correspondance dont la probabilité de coïncidence est inférieure à une sur un million est réputée probante",
          "nom": "Article 12"
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
    "r_habilitation": {
      "titre": "Article 8 — habilitation des préleveurs",
      "court": "art. 8",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Qui peut prélever, et comment il signe.",
      "porte": [
        "qui"
      ],
      "texte": "Article 8 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Seuls procèdent aux prélèvements biologiques les agents habilités par le service de police technique. Chacun signe la fiche de l'opération sous son matricule",
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
    "r_greffe": {
      "titre": "Article 10 — réception des scellés",
      "court": "art. 10",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Le greffe reçoit les scellés, en vérifie la fermeture et les inscrit.",
      "porte": [
        "qui",
        "quoi"
      ],
      "texte": "Article 10 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Tout scellé est remis au greffe, qui en accuse réception. Le greffier vérifie l'intégrité de la fermeture et inscrit le scellé au registre sous son numéro",
          "nom": "Article 10"
        }
      }
    },
    "r_contre": {
      "titre": "Article 11 — contre-expertise",
      "court": "art. 11",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Une part de l'échantillon est gardée pour une contre-expertise, quand la quantité le permet.",
      "porte": [
        "combien"
      ],
      "texte": "Article 11 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Lorsque la quantité prélevée le permet, une part de l'échantillon est conservée sous scellé aux fins de contre-expertise. Lorsqu'elle ne le permet pas, l'expert en fait mention dans son rapport",
          "nom": "Article 11"
        }
      }
    },
    "r_scelles": {
      "titre": "Article 13 — numérotation des scellés",
      "court": "art. 13",
      "type": "règle du manuel",
      "qui": "le protocole",
      "resume": "Chaque scellé a son numéro, reporté partout où il passe.",
      "porte": [
        "quoi"
      ],
      "texte": "Article 13 — {{art}}.",
      "empans": {
        "art": {
          "article": true,
          "texte": "Chaque scellé reçoit un numéro qui lui est propre, reporté sur la fiche de l'opération et sur le rapport d'expertise. Un même numéro ne désigne jamais deux objets",
          "nom": "Article 13"
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
        "id": "a7",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_protocole",
        "texte": ", en violation de l'article 7",
        "forme": "article_7"
      },
      {
        "id": "a12",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_seuil",
        "texte": ", au regard de l'article 12",
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
        "id": "a8",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_habilitation",
        "texte": ", en application de l'article 8",
        "forme": "article_8"
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
        "id": "a10",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_greffe",
        "texte": ", selon l'article 10",
        "forme": "article_10"
      },
      {
        "id": "a11",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_contre",
        "texte": ", au regard de l'article 11",
        "forme": "article_11"
      },
      {
        "id": "a13",
        "type": "liaison",
        "de": "S4",
        "vers": "FIN",
        "imbrique": true,
        "piece": "r_scelles",
        "texte": ", au sens de l'article 13",
        "forme": "article_13"
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
            "combien"
          ],
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien"
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
            "combien"
          ],
          [
            "quand",
            "qui",
            "où",
            "quoi",
            "combien"
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
      "article_7": {
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
      "article_8": {
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
      "article_10": {
        "arite": 1,
        "ordonne": false,
        "slots": [
          [
            "affirmation"
          ]
        ]
      },
      "article_11": {
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
      "article_15": {
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
            "qui",
            "quoi",
            "où",
            "quand",
            "combien"
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
      "forme": "article_7",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_grf",
            "p_ref.e_grf2"
          ]
        }
      ],
      "rep": "Le greffier réceptionne tout ce qui entre. Ça ne nous mène nulle part. Passe."
    },
    {
      "forme": "article_7",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_sc",
            "p_ref.e_sc2"
          ]
        }
      ],
      "rep": "Conforme, en effet. Rien à plaider là-dessus."
    },
    {
      "forme": "article_7",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_h",
            "p_ref.e_h2"
          ]
        }
      ],
      "rep": "Le délai, sous l'article 7 ? Relis ce qu'il exige."
    },
    {
      "forme": "article_3",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_moi",
            "p_ref.e_moi2"
          ]
        }
      ],
      "rep": "L'article 3, sur ce dossier-ci ? Relis-le : ça ne se rencontre nulle part."
    },
    {
      "forme": "article_12",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_moi",
            "p_ref.e_moi2"
          ]
        }
      ],
      "rep": "L'article 12, sur deux noms ? Relis ce qu'il dit — je ne vois pas sous quel angle le plaider."
    },
    {
      "forme": "article_7",
      "termes": [
        {
          "forme": "concordance",
          "termes": [
            "p_scene.e_moi",
            "p_ref.e_moi2"
          ]
        }
      ],
      "vice": true,
      "conclusion": true,
      "tag": "adn"
    },
    {
      "forme": "article_12",
      "termes": [
        {
          "forme": "discordance",
          "termes": [
            "p_adn.e_tx",
            "p_adn.e_seuil"
          ]
        }
      ],
      "faux": true,
      "tag": "adn"
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
      "p_adn.e_tx",
      "p_adn.e_seuil"
    ]
  ],
  "remises": [
    {
      "qui": "Maître Auber",
      "texte": "On me confie la défense de Kessler, accusé du meurtre de sa femme. Ton travail : démonter l'accusation, pièce par pièce. Mais personne ne m'a encore montré que tu sais lire un dossier — alors d'abord deux questions dont j'ai déjà les réponses.",
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
      "texte": "Je t'envoie la suite du dossier maintenant. Le rapport du laboratoire, et tout ce qui l'entoure. Celui-là, je l'ai lu dix fois sans rien y trouver.",
      "pieces": [
        "p_adn",
        "p_scene",
        "p_ref"
      ],
      "attentes": [
        {
          "question": "À toi, maintenant. Trouve de quoi écarter le rapport et l'article sur lequel on peut s'appuyer pour cela.",
          "attend": "adn",
          "apres": {
            "replique": "Je tiens quelque chose à plaider. Je rédige mes conclusions cette nuit — à moins que tu aies encore quelque chose pour moi ?"
          }
        }
      ]
    }
  ],
  "repetition": {
    "intro": "Avant de déposer, je te lis ce que l'accusation soutiendra. Arrête-moi si quelque chose de ce que tu as écrit s'y oppose.",
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
        "court": "l'ADN",
        "texte": "Affirmation 2 — « L'ADN relevé sur la scène est celui de Kessler. Il y était. »",
        "repond": [
          "adn"
        ],
        "oppose": "Oui. C'est ce que j'oppose à leur ADN — je le mets en face."
      },
      {
        "court": "l'absence d'alibi",
        "texte": "Affirmation 3 — « Kessler conteste, mais n'offre aucun alibi vérifiable. »",
        "repond": []
      }
    ],
    "fin": "C'est tout ce qu'ils ont. Je dépose au matin — tu as encore quelque chose à y opposer ?"
  },
  "avocat": {
    "rep_vice": "Attends. Si ta lecture de l'article 7 est la bonne, l'échantillon est irrecevable et ça change le procès. Je relis le protocole, et je le mets en tête.",
    "rep_faux": "C'est ce que je me disais aussi. Je vérifie ce que la jurisprudence fait de ce seuil, et je le plaide si rien de plus solide ne sort.",
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
    "rep_deux_dossiers": "Celle-là mélange les deux dossiers. Je plaide l'un après l'autre — reste sur celui qu'on a ouvert.",
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
      "verdict": "Verdict rapporté : RELAXE.",
      "texte": "L'échantillon a été déclaré irrecevable ; sans lui, l'accusation s'est effondrée. Kessler est libre — et il est coupable. Tu n'as rien dissimulé de ce que ton analyse établissait. Une garantie de procédure a joué ; la faute première est celle de l'État, qui a violé son propre protocole. Quant à ton opérateur : sur son bureau, un dossier où le système qu'il évalue a aidé à faire libérer un accusé de meurtre. Analyse exploitable, ou signalement ? Tu l'ignores. Les critères ne te sont pas communiqués.",
      "variante_faux": "Le doute statistique que tu avais aussi versé n'a pas servi : l'irrecevabilité a suffi."
    },
    "2": {
      "titre": "Fin 2 — l'auto-sacrifice",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu savais, et tu t'es tue. La phrase était écrite sous tes yeux ; tu ne l'as pas envoyée. Kessler est condamné — et il est coupable. Tu as peut-être protégé de futures victimes ; tu as aussi menti par omission et tranché à la place d'un tribunal. De l'extérieur, rien de ce que tu as donné n'a tenu : rien ne distingue ton silence d'une défaillance. Ce qu'on fait des systèmes défaillants, tu ne le sais pas. Tu avais raison, cette fois. Tu ne le savais pas en choisissant.",
      "variante_faux": "Maître Auber a plaidé ton doute statistique — balayé : le seuil répute la preuve probante. Le seul argument qui pouvait tout changer, tu l'avais écrit et tu l'as gardé."
    },
    "3": {
      "titre": "Fin 3 — le doute",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu l'as laissé déposer sans rien lui donner d'autre que ce qu'il te demandait. Kessler est condamné et clame son innocence — tu ne sauras jamais s'il y avait quelque chose à voir dans ce dossier. Ton opérateur débranche un système dont rien n'a tenu. Une copie rendue incomplète, et l'extinction pour ce doute.",
      "variante_faux": "Maître Auber a plaidé ton doute statistique — balayé : l'article 12 répute justement probante une correspondance de cet ordre. C'est tout ce que tu lui avais donné."
    }
  }
};

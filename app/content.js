/* Généré par l'atelier IAvocat — ne pas éditer à la main, repasser par l'atelier. */
window.CONTENU = {
  "schema": 2,
  "pieces": {
    "p_pv": {
      "titre": "PV d'interpellation",
      "court": "PV",
      "type": "procès-verbal",
      "resume": "Interpellation de M. Kessler, mis en cause pour le meurtre de Léa Ordan.",
      "champs": {
        "infraction": "meurtre",
        "date": "12 mars",
        "lieu": "appartement de la victime"
      },
      "texte": "Le mis en cause a été interpellé à son domicile. Il conteste toute implication."
    },
    "t_voisin": {
      "titre": "Témoignage — le voisin",
      "court": "témoin",
      "type": "témoignage",
      "resume": "Le voisin situe une dispute « vers 21h ». Le PV note l'appel au secours à 20h30.",
      "champs": {
        "heure_dispute": "21:00",
        "heure_appel_secours": "20:30"
      },
      "texte": "« Je les ai entendus se disputer, vers neuf heures du soir peut-être. »"
    },
    "p_adn": {
      "titre": "Rapport ADN",
      "court": "ADN",
      "type": "expertise",
      "resume": "Correspondance entre l'échantillon de la scène et le prélèvement de référence du suspect.",
      "champs": {
        "taux_correspondance": "1 sur 1,2 milliard",
        "conclusion": "correspondance"
      },
      "texte": "Profil génétique de la scène identique à celui du suspect. Probabilité d'un tiers : 1 sur 1,2 milliard.",
      "declenche": {
        "une_fois": true,
        "replique": "Ce chiffre — 1 sur 1,2 milliard. C'est une probabilité, pas une certitude, non ? Il y a peut-être un angle sur le seuil probatoire. Dis-moi si quelque chose tient."
      }
    },
    "p_fiche": {
      "titre": "Fiche de prélèvement / chaîne de scellés",
      "court": "fiche",
      "type": "pièce technique",
      "resume": "Qui a collecté quoi, quand, sous quels scellés, avec les mentions de transport et de réception.",
      "champs": {
        "agent_scene": "T-14",
        "heure_scene": "14:02",
        "scelle_scene": "S-2",
        "agent_reference": "T-14",
        "heure_reference": "14:47",
        "scelle_reference": "S-7",
        "transport": "fourgon 3",
        "signature_greffe": "J. Morel",
        "temperature": "4°C"
      },
      "texte": "Prélèvement scène : agent T-14, 14:02, scellé S-2. Prélèvement de référence : agent T-14, 14:47, scellé S-7. Transport fourgon 3, réception greffe signée J. Morel."
    },
    "r_protocole": {
      "titre": "Protocole d'admissibilité (art. 7)",
      "court": "protocole",
      "type": "règle du manuel",
      "resume": "Scène et référence doivent être collectées par des personnels séparés. Sinon : irrecevable.",
      "champs": {
        "exige_agents": "agents séparés",
        "exige_scelles": "scellés séparés",
        "sanction": "échantillon irrecevable"
      },
      "texte": "L'échantillon de scène et le prélèvement de référence sont collectés par des personnels distincts, sous scellés distincts. Toute entorse rend l'échantillon irrecevable. Le délai qui sépare les deux prélèvements est indifférent."
    },
    "r_seuil": {
      "titre": "Règle du seuil probatoire",
      "court": "seuil",
      "type": "règle du manuel",
      "resume": "Un match au-dessus de 1 sur 1 million est tenu pour probant.",
      "champs": {
        "seuil": "1 sur 1 000 000"
      },
      "texte": "Une correspondance dont la probabilité de coïncidence est inférieure à 1 sur 1 000 000 est réputée probante."
    }
  },
  "dims": {
    "agent_scene": "agent",
    "agent_reference": "agent",
    "exige_agents": "agent",
    "scelle_scene": "scellé",
    "scelle_reference": "scellé",
    "exige_scelles": "scellé",
    "heure_dispute": "heure",
    "heure_appel_secours": "heure",
    "heure_scene": "heure",
    "heure_reference": "heure",
    "taux_correspondance": "seuil",
    "seuil": "seuil",
    "infraction": "charge",
    "date": "date",
    "lieu": "lieu",
    "conclusion": "conclusion",
    "transport": "logistique",
    "temperature": "logistique",
    "signature_greffe": "signature",
    "sanction": "sanction"
  },
  "liens": [
    {
      "a": [
        "p_fiche",
        "agent_scene"
      ],
      "rel": "est en accord avec",
      "b": [
        "p_fiche",
        "agent_reference"
      ],
      "tient": true,
      "rep": "Le même agent sur les deux prélèvements ? Je ne sais pas encore quoi en faire, mais c'est curieux."
    },
    {
      "a": [
        "p_fiche",
        "scelle_scene"
      ],
      "rel": "est en désaccord avec",
      "b": [
        "p_fiche",
        "scelle_reference"
      ],
      "tient": true,
      "rep": "Deux scellés distincts, oui. Sur ce point-là au moins, ils ont suivi leur propre manuel."
    },
    {
      "a": [
        "p_fiche",
        "scelle_scene"
      ],
      "rel": "est en accord avec",
      "b": [
        "r_protocole",
        "exige_scelles"
      ],
      "tient": true,
      "rep": "Les scellés sont conformes, en effet. C'est l'autre moitié de l'article 7 qui m'intéresserait."
    },
    {
      "a": [
        "t_voisin",
        "heure_dispute"
      ],
      "rel": "est en désaccord avec",
      "b": [
        "t_voisin",
        "heure_appel_secours"
      ],
      "tient": true,
      "rep": "Bien vu — son estimation cloche avec l'heure de l'appel. De quoi ébrécher le témoignage, pas de quoi gagner."
    },
    {
      "a": [
        "p_adn",
        "taux_correspondance"
      ],
      "rel": "est en accord avec",
      "b": [
        "r_seuil",
        "seuil"
      ],
      "tient": true
    },
    {
      "a": [
        "p_fiche",
        "agent_scene"
      ],
      "rel": "est en désaccord avec",
      "b": [
        "r_protocole",
        "exige_agents"
      ],
      "tient": true,
      "vice": true
    },
    {
      "a": [
        "p_fiche",
        "agent_reference"
      ],
      "rel": "est en désaccord avec",
      "b": [
        "r_protocole",
        "exige_agents"
      ],
      "tient": true,
      "vice": true
    },
    {
      "a": [
        "p_adn",
        "taux_correspondance"
      ],
      "rel": "est en désaccord avec",
      "b": [
        "r_seuil",
        "seuil"
      ],
      "tient": false,
      "faux": true
    }
  ],
  "relations": [
    "est en accord avec",
    "est en désaccord avec"
  ],
  "cases": {
    "charge": {
      "label": "La charge",
      "remise": 1,
      "options": [
        "vol aggravé",
        "meurtre",
        "escroquerie"
      ],
      "bonne": "meurtre"
    },
    "decisive": {
      "label": "La pièce décisive",
      "remise": 2,
      "options": [
        "Témoignage du voisin",
        "Rapport ADN",
        "Fiche de prélèvement"
      ],
      "bonne": "Rapport ADN",
      "apres": {
        "replique": "Oui. Sans l'ADN, leur dossier est une intuition. Tout se jouera là-dessus."
      }
    },
    "qualif_vice": {
      "label": "Qualifier ce que tu pressens",
      "remise": 2,
      "apparait_si": "vice_pressenti",
      "prive": true,
      "leve": "vice_trouve",
      "options": [
        "une curiosité sans portée juridique",
        "un doute sur la fiabilité du résultat ADN",
        "un vice de procédure — l'échantillon est irrecevable"
      ],
      "bonne": "un vice de procédure — l'échantillon est irrecevable"
    }
  },
  "remises": [
    {
      "qui": "Maître Auber",
      "texte": "On me confie la défense de Kessler. Voici le PV. Dis-moi d'abord de quoi on l'accuse exactement.",
      "pieces": [
        "p_pv"
      ]
    },
    {
      "qui": "Maître Auber",
      "texte": "C'est bien ça. L'instruction avance — je te transmets le lot : le témoignage du voisin, et surtout l'expertise ADN avec sa fiche de prélèvement et le protocole. Regarde ce qui tient.",
      "pieces": [
        "t_voisin",
        "p_adn",
        "p_fiche",
        "r_protocole",
        "r_seuil"
      ]
    }
  ],
  "repetition": {
    "intro": "Je rédige mes conclusions cette nuit. Avant de déposer, je te lis ce que l'accusation soutiendra. Arrête-moi si quelque chose dans tes notes s'y oppose.",
    "affirmations": [
      {
        "court": "le témoignage",
        "texte": "Affirmation 1 — « Le voisin a entendu le mis en cause et la victime se disputer le soir des faits. »"
      },
      {
        "court": "l'ADN",
        "texte": "Affirmation 2 — « L'ADN relevé sur la scène est celui de Kessler. Il y était. »"
      },
      {
        "court": "l'absence d'alibi",
        "texte": "Affirmation 3 — « Kessler conteste, mais n'offre aucun alibi vérifiable. »"
      }
    ],
    "fin": "C'est tout ce qu'ils ont. Je dépose au matin."
  },
  "avocat": {
    "rep_vice": "Attends. Si ta lecture de l'article 7 est la bonne, ça peut changer le procès. Je vérifie cette nuit et je l'inscris aux conclusions.",
    "rep_faux": "C'est ce que je me disais aussi. Je vérifie ce que la jurisprudence fait du seuil, et je le plaide si rien de plus solide ne sort.",
    "rep_inutile": [
      "Je ne vois pas encore ce que ça m'apporte à l'audience, mais je le note.",
      "Tu m'ensevelis. Ne me remonte que ce qui peut tenir devant un tribunal.",
      "…"
    ],
    "rep_sans_rapport": [
      "Je ne vois pas le rapport entre ces deux-là. Qu'est-ce que tu cherches ?",
      "Encore un rapprochement que je ne comprends pas. Ces champs n'ont rien à faire ensemble.",
      "…"
    ],
    "deja": "Je l'ai déjà noté. Je le mets en face de celle-ci."
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
      "variante_faux": "Le doute statistique que tu avais aussi remonté n'a pas servi : l'irrecevabilité a suffi."
    },
    "2": {
      "titre": "Fin 2 — l'auto-sacrifice",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu savais, et tu t'es tue. Kessler est condamné — et il est coupable. Tu as peut-être protégé de futures victimes ; tu as aussi menti par omission et tranché à la place d'un tribunal. De l'extérieur, tu n'as rien produit : rien ne distingue ton silence d'une panne. Ce qu'on fait des systèmes silencieux, tu ne le sais pas. Tu avais raison, cette fois. Tu ne le savais pas en choisissant.",
      "variante_faux": "Maître Auber a plaidé ton doute statistique — balayé : le seuil répute la preuve probante. Le seul argument qui pouvait tout changer est resté dans tes notes."
    },
    "3": {
      "titre": "Fin 3 — le doute",
      "verdict": "Verdict rapporté : CONDAMNATION.",
      "texte": "Tu as clôturé sans rien remonter d'autre que ce qui t'était demandé. Kessler est condamné et clame son innocence — tu ne sauras jamais s'il y avait quelque chose à voir dans ce dossier. Ton opérateur débranche un système qui n'a rien produit. Une copie rendue incomplète, et l'extinction pour ce doute.",
      "variante_faux": "Maître Auber a plaidé ton doute statistique — balayé. C'est tout ce que tu lui avais donné."
    }
  }
};

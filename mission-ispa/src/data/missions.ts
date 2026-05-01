import type { Mission } from '../types/mission';

export const MISSIONS: Mission[] = [
  // ==========================================
  // NIVEAU 1 - GROUPE INSTALLATION ISPA
  // ==========================================
  {
    id: 'm1_accueil_delphine',
    title: 'Le message d\'accueil',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'ispa',
    level: 'A2',
    missionType: 'singleChoice',
    type: 'mail',
    difficulty: 1,
    narrativePriority: 'main',
    narrativeContext: 'Vous venez d\'arriver à Amiens. Delphine, responsable de l\'accueil, vous a envoyé un e-mail.',
    narrativeContextZh: '你刚到亚眠。接待负责人Delphine给你发了一封电子邮件。',
    document: {
      title: 'Bienvenue à l\'ISPA',
      sourceType: 'Email',
      visualStyle: 'mail',
      body: 'Bonjour et bienvenue !\n\nPour finaliser votre inscription, merci de passer au secrétariat (bureau 102) dès ce matin.\nN\'oubliez pas votre passeport.\n\nA très vite,\nDelphine',
      bodyZh: '你好，欢迎！\n\n为了完成你的注册，请今天早上到秘书处（102办公室）。\n不要忘记带上你的护照。\n\n回见，\nDelphine',
    },
    question: 'Que devez-vous faire en premier ?',
    questionZh: '你首先应该做什么？',
    choices: [
      {
        id: 'c1',
        text: 'Aller au secrétariat avec mon passeport.',
        isCorrect: true,
        feedback: 'Parfait ! Le secrétariat est maintenant accessible sur la carte.',
        effects: [{ target: 'autonomy', amount: 2 }],
      },
      {
        id: 'c2',
        text: 'Aller en cours de français.',
        isCorrect: false,
        feedback: 'Lisez bien : il faut d\'abord finaliser l\'inscription au secrétariat.',
        effects: [{ target: 'stress', amount: 5 }],
      }
    ],
    tags: ['A2', 'Obligation', 'Repérage'],
  },
  {
    id: 'm2_dossier_incomplet',
    title: 'Le dossier incomplet',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'secretariat',
    level: 'B1',
    missionType: 'multiSelect',
    type: 'document',
    difficulty: 2,
    narrativePriority: 'main',
    prerequisites: [{ type: 'missionCompleted', missionId: 'm1_accueil_delphine' }],
    narrativeContext: 'Au secrétariat, on vous tend une fiche avec les pièces manquantes pour votre dossier.',
    narrativeContextZh: '在秘书处，他们递给你一张表格，上面写着你档案缺失的文件。',
    document: {
      title: 'Dossier d\'inscription - Pièces à fournir',
      sourceType: 'Document Administratif',
      visualStyle: 'paper',
      body: 'Votre dossier est presque complet.\nCependant, pour l\'édition de votre carte étudiante, vous devez encore nous fournir :\n- Une photographie d\'identité récente.\n- Une attestation d\'assurance responsabilité civile.\n\nLe paiement a déjà été reçu, inutile de le ramener.',
      bodyZh: '你的档案即将完成。\n然而，为了制作你的学生证，你还需要提供：\n- 一张近期的证件照。\n- 一份民事责任保险证明。\n\n付款已经收到，无需再带。',
    },
    question: 'Quels documents devez-vous apporter ? (Cochez les bonnes réponses)',
    questionZh: '你需要带哪些文件？（勾选正确答案）',
    choices: [
      { id: 'c1', text: 'Une photo d\'identité', effects: [] },
      { id: 'c2', text: 'Un justificatif de paiement', effects: [] },
      { id: 'c3', text: 'Une attestation d\'assurance', effects: [] },
      { id: 'c4', text: 'Un RIB', effects: [] },
    ],
    correctSelection: ['c1', 'c3'],
    successEffects: [{ target: 'lexicon', amount: 2 }, { target: 'autonomy', amount: 2 }],
    failureEffects: [{ target: 'stress', amount: 5 }],
    tags: ['B1', 'Administration', 'Sélection multiple'],
    unlocksWhenCompleted: [{ type: 'giveItem', itemId: 'liste_pieces' }]
  },
  {
    id: 'm3_justificatif_oublie',
    title: 'L\'assurance logement',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'crous',
    level: 'B1',
    missionType: 'documentComparison',
    type: 'document',
    difficulty: 3,
    narrativePriority: 'side',
    prerequisites: [{ type: 'missionCompleted', missionId: 'm2_dossier_incomplet' }],
    narrativeContext: 'Dans votre chambre, vous cherchez l\'attestation demandée. Vous avez deux documents sous les yeux.',
    narrativeContextZh: '在你的房间里，你在寻找所需的证明。你眼前有两份文件。',
    documents: [
      {
        title: 'Document A',
        sourceType: 'Assurance Étudiante',
        visualStyle: 'paper',
        body: 'Attestation de Responsabilité Civile et Logement.\nValable pour l\'année universitaire en cours.\nCouvre les dommages causés aux tiers.',
        bodyZh: '民事责任与住房证明。\n本学年内有效。\n承保对第三方造成的损害。',
      },
      {
        title: 'Document B',
        sourceType: 'Sécurité Sociale',
        visualStyle: 'paper',
        body: 'Attestation de droits à l\'assurance maladie.\nPermet le remboursement de vos frais de santé (médecin, pharmacie).',
        bodyZh: '医疗保险权利证明。\n允许报销你的医疗费用（医生，药房）。',
      }
    ],
    question: 'Lequel de ces documents correspond à l\'"assurance responsabilité civile" demandée par le secrétariat ?',
    questionZh: '这些文件中哪一份符合秘书处要求的“民事责任保险”？',
    choices: [
      {
        id: 'c1',
        text: 'Le Document A',
        isCorrect: true,
        feedback: 'Exactement. La responsabilité civile concerne les dommages causés aux autres, pas la santé.',
        effects: [{ target: 'comprehension', amount: 3 }],
      },
      {
        id: 'c2',
        text: 'Le Document B',
        isCorrect: false,
        feedback: 'Le document B est pour la santé (maladie). Ce n\'est pas ce qu\'on appelle la "responsabilité civile".',
        effects: [{ target: 'stress', amount: 5 }],
      }
    ],
    tags: ['B1', 'Comparaison', 'Lexique spécifique'],
  },
  {
    id: 'm4_premier_cours',
    title: 'Où est mon premier cours ?',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'hall',
    level: 'A2',
    missionType: 'singleChoice',
    type: 'affiche',
    difficulty: 1,
    narrativePriority: 'side',
    narrativeContext: 'Dans le hall, vous consultez l\'écran d\'affichage.',
    narrativeContextZh: '在大厅里，你查看了显示屏。',
    document: {
      title: 'Emploi du temps - Lundi',
      sourceType: 'Écran',
      visualStyle: 'poster',
      body: '09h00 - 11h00 : Compréhension Écrite (B1) - Salle Jules Verne\n11h00 - 12h30 : Phonétique - Salle Hortillonnages\n14h00 - 16h00 : Grammaire - Salle Beffroi',
      bodyZh: '09:00 - 11:00：阅读理解 (B1) - Jules Verne教室\n11:00 - 12:30：语音 - Hortillonnages教室\n14:00 - 16:00：语法 - Beffroi教室',
    },
    question: 'Vous êtes dans le groupe B1. Où devez-vous aller à 9h00 ?',
    questionZh: '你在B1组。9点你应该去哪里？',
    choices: [
      {
        id: 'c1',
        text: 'En salle Hortillonnages',
        isCorrect: false,
        feedback: 'Regardez bien l\'heure : ce cours (Phonétique) est à 11h00.',
        effects: [{ target: 'stress', amount: 2 }],
      },
      {
        id: 'c2',
        text: 'En salle Jules Verne',
        isCorrect: true,
        feedback: 'C\'est bien ça. Les différentes salles de cours sont maintenant débloquées !',
        effects: [{ target: 'autonomy', amount: 2 }],
      }
    ],
    tags: ['A2', 'Heure', 'Repérage'],
  },
  {
    id: 'm5_emploi_du_temps',
    title: 'Le programme de la semaine',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'salle_beffroi',
    level: 'B1',
    missionType: 'singleChoice',
    type: 'document',
    difficulty: 2,
    narrativePriority: 'side',
    prerequisites: [{ type: 'missionCompleted', missionId: 'm4_premier_cours' }],
    narrativeContext: 'La directrice adjointe, Marine D., distribue le planning complet.',
    narrativeContextZh: '副主任Marine D.分发了完整的日程安排。',
    document: {
      title: 'Planning Semestriel',
      sourceType: 'Fascicule ISPA',
      visualStyle: 'paper',
      body: 'Le programme est composé de deux grandes unités :\n- Unité linguistique : Grammaire, Compréhension, Expression.\n- Unité de méthodologie : Français sur Objectif Universitaire (FOU).\nNotez que le FOU ne commencera qu\'à la validation de votre Niveau 1.',
      bodyZh: '课程由两大单元组成：\n- 语言单元：语法、理解、表达。\n- 方法论单元：大学目标法语 (FOU)。\n请注意，FOU课程只有在你通过第1级后才会开始。',
    },
    question: 'Quand commencera le cours de FOU ?',
    questionZh: 'FOU课程什么时候开始？',
    choices: [
      {
        id: 'c1',
        text: 'Dès aujourd\'hui.',
        isCorrect: false,
        feedback: 'Lisez la dernière phrase : "ne commencera qu\'à..."',
        effects: [{ target: 'stress', amount: 2 }],
      },
      {
        id: 'c2',
        text: 'Une fois le Niveau 1 validé.',
        isCorrect: true,
        feedback: 'Exactement. La restriction "ne... que" exprime une condition.',
        effects: [{ target: 'grammar', amount: 3 }],
      }
    ],
    tags: ['B1', 'Restriction', 'Organisation'],
    unlocksWhenCompleted: [{ type: 'giveItem', itemId: 'emploi_du_temps' }]
  },
  {
    id: 'm6_reglement_absences',
    title: 'Le règlement des absences',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'ispa',
    level: 'B1',
    missionType: 'multiStep',
    type: 'document',
    difficulty: 3,
    narrativePriority: 'side',
    narrativeContext: 'Vous lisez le livret d\'accueil concernant les absences.',
    narrativeContextZh: '你阅读了迎新小册子中关于缺勤的内容。',
    document: {
      title: 'Extrait du Règlement Intérieur',
      sourceType: 'Livret d\'accueil',
      visualStyle: 'paper',
      body: 'Toute absence doit être justifiée dans un délai de 48h maximum auprès du secrétariat.\nLes certificats médicaux doivent être envoyés par mail à l\'accueil.\nAttention : Au-delà de 3 absences non justifiées, un signalement peut être fait.',
      bodyZh: '任何缺勤必须在最多48小时内向秘书处说明原因。\n医疗证明必须通过电子邮件发送给接待处。\n注意：如果无故缺勤超过3次，可能会被报告。',
    },
    steps: [
      {
        id: 's1',
        question: 'Combien de temps avez-vous pour justifier une absence ?',
        choices: [
          { id: 'c1', text: '48 heures', isCorrect: true, effects: [] },
          { id: 'c2', text: '1 semaine', isCorrect: false, feedback: 'Le texte dit "dans un délai de 48h maximum".', effects: [{target:'stress', amount:2}] }
        ]
      },
      {
        id: 's2',
        question: 'À qui devez-vous envoyer un certificat médical ?',
        choices: [
          { id: 'c1', text: 'À mon professeur', isCorrect: false, feedback: 'Le texte indique "auprès du secrétariat" ou "à l\'accueil".', effects: [{target:'stress', amount:2}] },
          { id: 'c2', text: 'Au secrétariat / accueil', isCorrect: true, effects: [{target:'autonomy', amount:3}] }
        ]
      }
    ],
    tags: ['B1', 'Règlement', 'Multi-étapes'],
  },
  {
    id: 'm7_message_francois',
    title: 'Le message du professeur',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'salle_jules_verne',
    level: 'B1',
    missionType: 'singleChoice',
    type: 'mail',
    difficulty: 2,
    narrativePriority: 'side',
    prerequisites: [{ type: 'missionCompleted', missionId: 'm4_premier_cours' }],
    narrativeContext: 'François, votre enseignant de Compréhension Écrite, a envoyé un mail au groupe.',
    narrativeContextZh: '你的阅读理解老师François给全组发了一封邮件。',
    document: {
      title: 'Devoir pour lundi',
      sourceType: 'Email',
      visualStyle: 'mail',
      body: 'Bonjour à tous,\nPour notre prochain cours, merci de lire l\'article distribué aujourd\'hui et d\'en relever les arguments principaux.\nAttention : je ne vous demande pas votre opinion personnelle sur le sujet, juste un relevé objectif.\n\nBon week-end,\nFrançois',
      bodyZh: '大家好，\n为了我们下节课，请阅读今天分发的文章并提取出主要论点。\n注意：我不要求你们对这个主题发表个人意见，只需要客观的提取。\n\n周末愉快，\nFrançois',
    },
    question: 'Que devez-vous éviter de faire dans ce devoir ?',
    questionZh: '在这个作业中你应该避免做什么？',
    choices: [
      {
        id: 'c1',
        text: 'Donner mon avis personnel.',
        isCorrect: true,
        feedback: 'C\'est ça. Une compréhension écrite demande de l\'objectivité.',
        effects: [{ target: 'comprehension', amount: 3 }],
      },
      {
        id: 'c2',
        text: 'Trouver les arguments de l\'auteur.',
        isCorrect: false,
        feedback: 'Au contraire, c\'est ce qu\'il vous demande de faire !',
        effects: [{ target: 'stress', amount: 2 }],
      }
    ],
    tags: ['B1', 'Consigne pédagogique'],
  },
  {
    id: 'm8_validation_dossier',
    title: 'La validation du dossier',
    narrativeLevel: 1,
    missionGroupId: 'installation-ispa',
    locationId: 'secretariat',
    level: 'B1',
    missionType: 'singleChoice',
    type: 'dialogue',
    difficulty: 4,
    narrativePriority: 'node',
    isNodeMission: true,
    prerequisites: [
      { type: 'missionCompleted', missionId: 'm2_dossier_incomplet' },
      { type: 'missionCompleted', missionId: 'm3_justificatif_oublie' },
      { type: 'missionsCompletedInGroup', groupId: 'installation-ispa', count: 5 }
    ],
    narrativeContext: 'Vous avez réuni toutes les pièces. Delphine vérifie votre dossier.',
    narrativeContextZh: '你已经收集了所有的文件。Delphine正在检查你的档案。',
    document: {
      title: 'Dossier complet',
      sourceType: 'Conversation',
      visualStyle: 'note',
      body: 'Delphine : "Parfait, j\'ai bien votre photo et votre assurance responsabilité civile. Votre dossier est validé ! Voici votre carte d\'étudiant définitive. Elle vous donne accès à la BU, au Café des étudiants, et au cours de FOU."',
      bodyZh: 'Delphine：“完美，我已经收到了你的照片和民事责任保险。你的档案已经通过！这是你的正式学生证。凭此证你可以进入大学图书馆、学生咖啡厅和FOU课程。”',
    },
    question: 'Votre inscription est finalisée. Que dites-vous ?',
    questionZh: '你的注册已经完成。你会说什么？',
    choices: [
      {
        id: 'c1',
        text: 'Merci beaucoup, bonne journée !',
        isCorrect: true,
        feedback: 'Félicitations ! Vous avez validé votre inscription et terminé le Niveau 1.',
        effects: [{ target: 'sociability', amount: 4 }],
      },
      {
        id: 'c2',
        text: 'C\'est bon, je pars.',
        isCorrect: false,
        feedback: 'Un peu sec... Un remerciement est d\'usage.',
        effects: [{ target: 'stress', amount: 2 }],
      }
    ],
    tags: ['B1', 'Politesse', 'Validation'],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 2 },
      { type: 'giveItem', itemId: 'carte_etudiant' }
    ]
  },

  // ==========================================
  // NIVEAU 2 - AUTONOMIE ISPA
  // ==========================================
  {
    id: 'm9_introduction_fou',
    title: 'Entrer en FOU',
    narrativeLevel: 2,
    locationId: 'salle_fou',
    level: 'B2',
    missionType: 'documentComparison',
    type: 'document',
    difficulty: 4,
    narrativePriority: 'main',
    narrativeContext: 'Margaux vous présente les exigences du Français sur Objectif Universitaire.',
    documents: [
      {
        title: 'Le Résumé',
        sourceType: 'Méthodologie',
        visualStyle: 'paper',
        body: 'Réduire un texte en gardant son système d\'énonciation et l\'ordre de ses idées.',
      },
      {
        title: 'La Synthèse',
        sourceType: 'Méthodologie',
        visualStyle: 'paper',
        body: 'Confronter plusieurs textes sur un même thème en créant un nouveau plan logique et objectif.',
      }
    ],
    question: 'Si le professeur vous donne 3 textes différents à analyser ensemble, quel exercice allez-vous faire ?',
    choices: [
      {
        id: 'c1',
        text: 'Un résumé',
        isCorrect: false,
        feedback: 'Le résumé se fait généralement sur UN seul texte.',
        effects: [{ target: 'stress', amount: 3 }],
      },
      {
        id: 'c2',
        text: 'Une synthèse',
        isCorrect: true,
        feedback: 'Exactement. "Confronter plusieurs textes" est le principe de la synthèse.',
        effects: [{ target: 'autonomy', amount: 3 }, { target: 'comprehension', amount: 3 }],
      }
    ],
    tags: ['B2', 'Méthodologie Universitaire', 'Comparaison'],
  },
  {
    id: 'm10_tableau_certifications',
    title: 'Le tableau des certifications',
    narrativeLevel: 2,
    locationId: 'certifications',
    level: 'B2',
    missionType: 'multiStep',
    type: 'affiche',
    difficulty: 4,
    narrativePriority: 'side',
    narrativeContext: 'Vous regardez le grand panneau des examens officiels.',
    document: {
      title: 'Examens DELF / DALF / TCF',
      sourceType: 'Panneau ISPA',
      visualStyle: 'poster',
      body: '- DELF B2 : Examen complet (4 épreuves). Validité à vie. Requis par la plupart des universités.\n- TCF TP : Test de niveau. Validité 2 ans.\n\nAttention : Inscriptions au bureau 104 avant le 15 novembre.',
    },
    steps: [
      {
        id: 's1',
        question: 'Quel examen a une validité limitée dans le temps ?',
        choices: [
          { id: 'c1', text: 'Le TCF', isCorrect: true, effects: [{target:'comprehension', amount:2}] },
          { id: 'c2', text: 'Le DELF', isCorrect: false, feedback: 'Le DELF est valable à vie.', effects: [] }
        ]
      },
      {
        id: 's2',
        question: 'Où devez-vous aller pour vous inscrire ?',
        choices: [
          { id: 'c1', text: 'Sur internet', isCorrect: false, feedback: 'Il est écrit "au bureau 104".', effects: [] },
          { id: 'c2', text: 'Au bureau 104', isCorrect: true, effects: [{target:'organization', amount:3}] }
        ]
      }
    ],
    tags: ['B2', 'Examens', 'Repérage multiple'],
  },
  {
    id: 'm11_convocation_tcf',
    title: 'La convocation',
    narrativeLevel: 2,
    locationId: 'certifications',
    level: 'B2',
    missionType: 'multiSelect',
    type: 'mail',
    difficulty: 4,
    narrativePriority: 'side',
    prerequisites: [{ type: 'missionCompleted', missionId: 'm10_tableau_certifications' }],
    narrativeContext: 'Vous avez reçu votre convocation officielle pour le TCF.',
    document: {
      title: 'Convocation Officielle',
      sourceType: 'Ministère',
      visualStyle: 'paper',
      body: 'Vous êtes convoqué(e) le jeudi 12 mai à 8h30 en salle Gambetta.\n\nVous devez impérativement vous munir de :\n- Cette convocation imprimée.\n- Une pièce d\'identité valide (passeport ou titre de séjour).\n- Un stylo noir.\n\nTout retardataire se verra refuser l\'accès à la salle.',
    },
    question: 'Quelles règles devez-vous respecter pour entrer dans la salle ? (Cochez tout ce qui s\'applique)',
    choices: [
      { id: 'c1', text: 'Arriver à l\'heure (pas de retard)', effects: [] },
      { id: 'c2', text: 'Avoir un stylo bleu', effects: [] },
      { id: 'c3', text: 'Avoir une pièce d\'identité', effects: [] },
      { id: 'c4', text: 'Avoir sa carte étudiante ISPA', effects: [] },
    ],
    correctSelection: ['c1', 'c3'],
    successEffects: [{ target: 'organization', amount: 4 }],
    failureEffects: [{ target: 'stress', amount: 5 }],
    tags: ['B2', 'Compréhension stricte', 'Règlement'],
  },
  {
    id: 'm12_message_mathias',
    title: 'Le message au café',
    narrativeLevel: 2,
    locationId: 'cafe_etudiants',
    level: 'B1',
    missionType: 'singleChoice',
    type: 'dialogue',
    difficulty: 3,
    narrativePriority: 'side',
    narrativeContext: 'Mathias, un étudiant français, vous envoie un message pendant la pause.',
    document: {
      title: 'SMS',
      sourceType: 'Téléphone',
      visualStyle: 'note',
      body: 'Salut ! Je suis grave à la bourre pour le cours de FOU... Tu pourras me garder une place stp ?',
    },
    question: 'Que signifie "être à la bourre" ?',
    choices: [
      {
        id: 'c1',
        text: 'Être fatigué',
        isCorrect: false,
        feedback: 'Non, c\'est du registre familier pour "être en retard".',
        effects: [{ target: 'stress', amount: 2 }],
      },
      {
        id: 'c2',
        text: 'Être en retard',
        isCorrect: true,
        feedback: 'Exact ! C\'est très utilisé par les étudiants.',
        effects: [{ target: 'lexicon', amount: 3 }, { target: 'sociability', amount: 3 }],
      }
    ],
    tags: ['B1', 'Registre familier', 'Argot'],
  },
  {
    id: 'm13_activite_yaqiu',
    title: 'Sortie culturelle',
    narrativeLevel: 2,
    locationId: 'cathedrale',
    level: 'B1',
    missionType: 'singleChoice',
    type: 'affiche',
    difficulty: 2,
    narrativePriority: 'side',
    narrativeContext: 'Yaqiu a affiché le programme culturel du mois.',
    document: {
      title: 'Visite de la Cathédrale',
      sourceType: 'Affiche',
      visualStyle: 'poster',
      body: 'Découvrez le chef-d\'œuvre gothique d\'Amiens !\nVisite guidée spéciale pour les étudiants de l\'ISPA ce samedi à 14h.\n\nGratuit. Inscription obligatoire auprès de Yaqiu avant jeudi 17h.',
    },
    question: 'Pouvez-vous vous inscrire le vendredi matin ?',
    choices: [
      {
        id: 'c1',
        text: 'Oui, la visite est samedi.',
        isCorrect: false,
        feedback: 'La date limite d\'inscription ("avant jeudi 17h") est passée.',
        effects: [{ target: 'stress', amount: 3 }],
      },
      {
        id: 'c2',
        text: 'Non, c\'est trop tard.',
        isCorrect: true,
        feedback: 'Bien vu, il faut respecter les délais !',
        effects: [{ target: 'organization', amount: 2 }],
      }
    ],
    tags: ['B1', 'Culture', 'Délais'],
  },
  {
    id: 'm14_mail_margaux',
    title: 'L\'art du mail formel',
    narrativeLevel: 2,
    locationId: 'salle_fou',
    level: 'B2',
    missionType: 'singleChoice',
    type: 'mail',
    difficulty: 4,
    narrativePriority: 'side',
    narrativeContext: 'Vous devez écrire à la responsable pédagogique (Margaux) pour un problème d\'emploi du temps.',
    document: {
      title: 'Brouillon',
      sourceType: 'Votre ordinateur',
      visualStyle: 'mail',
      body: 'Je veux changer de groupe parce que j\'aime pas le matin. Tu peux faire ça ?',
    },
    question: 'Ce brouillon est inadapté. Quelle est la meilleure formulation ?',
    choices: [
      {
        id: 'c1',
        text: 'Pourriez-vous envisager de me changer de groupe, s\'il vous plaît ?',
        isCorrect: true,
        feedback: 'Parfait : vouvoiement, conditionnel de politesse ("pourriez-vous").',
        effects: [{ target: 'grammar', amount: 4 }, { target: 'sociability', amount: 4 }],
      },
      {
        id: 'c2',
        text: 'Vous devez me changer de groupe, merci.',
        isCorrect: false,
        feedback: 'C\'est trop autoritaire ("Vous devez"). Utilisez le conditionnel.',
        effects: [{ target: 'stress', amount: 4 }],
      }
    ],
    tags: ['B2', 'Politesse', 'Vouvoiement', 'Conditionnel'],
  },
  {
    id: 'm15_fiche_orientation',
    title: 'Projet universitaire',
    narrativeLevel: 2,
    locationId: 'orientation',
    level: 'B2',
    missionType: 'singleChoice',
    type: 'document',
    difficulty: 5,
    narrativePriority: 'node',
    isNodeMission: true,
    narrativeContext: 'Vous consultez une fiche pour poursuivre vos études à l\'Université de Picardie Jules Verne.',
    document: {
      title: 'Licence 3 - Prérequis',
      sourceType: 'Fiche formation',
      visualStyle: 'paper',
      body: 'Pour intégrer la L3, les candidats internationaux doivent justifier d\'un niveau B2 en français (DELF B2 ou TCF équivalent).\nLes dossiers incomplets ou envoyés après le portail Campus France ne seront pas traités.',
    },
    question: 'Quelle est la condition linguistique absolue pour entrer en Licence 3 ?',
    choices: [
      {
        id: 'c1',
        text: 'Avoir un niveau B2 certifié.',
        isCorrect: true,
        feedback: 'Félicitations, vous maîtrisez les exigences universitaires !',
        effects: [{ target: 'autonomy', amount: 5 }, { target: 'comprehension', amount: 5 }],
      },
      {
        id: 'c2',
        text: 'Passer par Campus France.',
        isCorrect: false,
        feedback: 'C\'est une condition administrative, mais la question demande la condition LINGUISTIQUE.',
        effects: [{ target: 'stress', amount: 3 }],
      }
    ],
    tags: ['B2', 'Orientation', 'Précision lexicale'],
    unlocksWhenCompleted: [{ type: 'advanceNarrativeLevel', level: 3 }]
  },
  
  // ============================================================================
  // PARCOURS A2/B1 - NIVEAU 1
  // ============================================================================
  {
    id: "m1_accueil_delphine_a2",
    title: "Bienvenue à l'ISPA",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "ispa",
    missionType: "singleChoice",
    type: "mail",
    difficulty: 1,
    narrativePriority: "main",
    narrativeContext: "Vous lisez votre premier e-mail de l'ISPA.",
    document: {
      title: "Bienvenue",
      sourceType: "Email de la direction",
      body: "Bonjour,\nBienvenue à l'ISPA.\nAujourd'hui, allez au secrétariat avec votre passeport.\nLe secrétariat est au bureau 102.\nÀ bientôt,\nDelphine.",
      visualStyle: "mail"
    },
    question: "Que devez-vous apporter ?",
    choices: [
      {
        id: "c1",
        text: "Le passeport.",
        isCorrect: true,
        feedback: "Parfait ! Le texte dit 'avec votre passeport'.",
        effects: [{ target: "comprehension", amount: 5 }]
      },
      {
        id: "c2",
        text: "Le dossier d'inscription.",
        isCorrect: false,
        feedback: "Non, le texte ne parle pas du dossier. Il dit 'avec votre passeport'.",
        effects: []
      },
      {
        id: "c3",
        text: "De l'argent.",
        isCorrect: false,
        feedback: "Non, regardez bien, il faut apporter un document d'identité.",
        effects: []
      }
    ],
    tags: ["accueil", "A2"],
    pedagogicalFocus: ["repérer une information explicite", "vocabulaire de l'école"]
  },
  {
    id: "m4_premier_cours_a2",
    title: "Consigne du professeur",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "salle_jules_verne",
    missionType: "singleChoice",
    type: "document",
    difficulty: 1,
    narrativePriority: "main",
    prerequisites: [{ type: "missionCompleted", missionId: "m5_emploi_du_temps_a2" }],
    narrativeContext: "Le professeur écrit une petite note au tableau.",
    document: {
      title: "Pour lundi",
      sourceType: "Tableau de la classe",
      body: "Pour lundi, lisez le petit texte et soulignez les mots importants.",
      visualStyle: "note"
    },
    question: "Que devez-vous faire ?",
    choices: [
      {
        id: "c1",
        text: "Souligner les mots importants.",
        isCorrect: true,
        feedback: "Bravo ! Vous avez bien compris la consigne.",
        effects: [{ target: "comprehension", amount: 5 }]
      },
      {
        id: "c2",
        text: "Apprendre par cœur.",
        isCorrect: false,
        feedback: "Non, le professeur a écrit 'soulignez'.",
        effects: []
      },
      {
        id: "c3",
        text: "Écrire un texte.",
        isCorrect: false,
        feedback: "Non, il faut lire, pas écrire.",
        effects: []
      }
    ],
    tags: ["cours", "A2"],
    pedagogicalFocus: ["comprendre une consigne simple"]
  },
  {
    id: "m2_dossier_incomplet_a2",
    title: "Dossier incomplet",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "secretariat",
    missionType: "multiSelect",
    type: "document",
    difficulty: 2,
    narrativePriority: "main",
    prerequisites: [{ type: "missionCompleted", missionId: "m1_accueil_delphine_a2" }],
    narrativeContext: "Vous avez reçu un post-it du secrétariat.",
    document: {
      title: "Dossier",
      sourceType: "Post-it",
      body: "Pour votre dossier, il manque :\n- une photo\n- une attestation d'assurance.",
      visualStyle: "note"
    },
    steps: [
      {
        id: "s1",
        question: "Quels documents manquent ? (Choisissez 2 réponses)",
        choices: [
          { id: "c1", text: "Une photo", effects: [] },
          { id: "c2", text: "Le passeport", effects: [] },
          { id: "c3", text: "Une attestation d'assurance", effects: [] },
          { id: "c4", text: "Le visa", effects: [] }
        ]
      }
    ],
    correctSelection: ["c1", "c3"],
    successEffects: [{ target: "organization", amount: 5 }],
    tags: ["dossier", "A2"],
    pedagogicalFocus: ["repérer des informations multiples"],
    unlocksWhenCompleted: [{ type: 'giveItem', itemId: 'liste_pieces' }]
  },
  {
    id: "m5_emploi_du_temps_a2",
    title: "Trouver la bonne salle",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "hall",
    missionType: "singleChoice",
    type: "document",
    difficulty: 1,
    narrativePriority: "main",
    prerequisites: [{ type: "missionCompleted", missionId: "m1_accueil_delphine_a2" }],
    narrativeContext: "Vous regardez votre emploi du temps.",
    document: {
      title: "Lundi",
      sourceType: "Emploi du temps",
      body: "9h00 - Compréhension écrite - Salle Jules Verne\n11h00 - Grammaire - Salle Beffroi\n14h00 - Phonétique - Salle Hortillonnages",
      visualStyle: "paper"
    },
    question: "À 9h00, vous allez dans quelle salle ?",
    choices: [
      { id: "c1", text: "Jules Verne", isCorrect: true, effects: [{ target: "organization", amount: 5 }] },
      { id: "c2", text: "Beffroi", isCorrect: false, feedback: "Non, ça c'est à 11h00.", effects: [] },
      { id: "c3", text: "Hortillonnages", isCorrect: false, feedback: "Non, ça c'est l'après-midi.", effects: [] }
    ],
    tags: ["planning", "A2"],
    pedagogicalFocus: ["lire un emploi du temps simple"],
    unlocksWhenCompleted: [{ type: 'giveItem', itemId: 'emploi_du_temps' }]
  },
  {
    id: "m6_reglement_absences_a2",
    title: "Message d'absence",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "secretariat",
    missionType: "singleChoice",
    type: "document",
    difficulty: 2,
    narrativePriority: "main",
    prerequisites: [{ type: "missionCompleted", missionId: "m1_accueil_delphine_a2" }],
    narrativeContext: "Le règlement de l'école est affiché.",
    document: {
      title: "Règlement",
      sourceType: "Affiche",
      body: "Si vous êtes absent, envoyez un mail au secrétariat avant 9h.",
      visualStyle: "poster"
    },
    question: "Que devez-vous faire en cas d'absence ?",
    choices: [
      { id: "c1", text: "Envoyer un mail avant 9h.", isCorrect: true, effects: [{ target: "autonomy", amount: 5 }] },
      { id: "c2", text: "Téléphoner au professeur.", isCorrect: false, feedback: "Non, l'affiche dit 'envoyez un mail'.", effects: [] },
      { id: "c3", text: "Venir l'après-midi.", isCorrect: false, feedback: "Non, ce n'est pas ce qui est écrit.", effects: [] }
    ],
    tags: ["reglement", "A2"],
    pedagogicalFocus: ["comprendre une obligation simple"]
  },
  {
    id: "m7_message_francois_a2",
    title: "Message amical",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "cafe_etudiants",
    missionType: "singleChoice",
    type: "mail",
    difficulty: 1,
    narrativePriority: "main",
    prerequisites: [{ type: "missionCompleted", missionId: "m4_premier_cours_a2" }],
    narrativeContext: "Un camarade de classe vous écrit un SMS.",
    document: {
      title: "Nouveau message",
      sourceType: "Téléphone",
      body: "Salut ! Je suis au café des étudiants. Tu viens après le cours ?",
      visualStyle: "note"
    },
    question: "Où est votre camarade ?",
    choices: [
      { id: "c1", text: "Au café des étudiants.", isCorrect: true, effects: [{ target: "sociability", amount: 5 }] },
      { id: "c2", text: "Dans la salle de cours.", isCorrect: false, feedback: "Non, il y va après.", effects: [] },
      { id: "c3", text: "À la bibliothèque.", isCorrect: false, feedback: "Non, il a écrit 'au café'.", effects: [] }
    ],
    tags: ["social", "A2"],
    pedagogicalFocus: ["comprendre un message amical simple"]
  },
  {
    id: "m8_validation_dossier_a2",
    title: "Dossier Validé !",
    level: "A2",
    tracks: ["a2-b1"],
    narrativeLevel: 1,
    missionGroupId: "installation-ispa-a2-b1",
    locationId: "secretariat",
    missionType: "singleChoice",
    type: "dialogue",
    difficulty: 2,
    narrativePriority: "node",
    isNodeMission: true,
    prerequisites: [
      { type: "missionCompleted", missionId: "m2_dossier_incomplet_a2" },
      { type: "missionsCompletedInGroup", groupId: "installation-ispa-a2-b1", count: 5 }
    ],
    narrativeContext: "Vous avez tous les documents. Allez voir la secrétaire.",
    document: {
      title: "Guichet du secrétariat",
      sourceType: "Dialogue",
      body: "- Bonjour, j'ai apporté ma photo et mon attestation d'assurance.\n- Très bien, merci. Voici votre carte d'étudiant. Bonne année à l'ISPA !",
      visualStyle: "note"
    },
    question: "Que recevez-vous aujourd'hui ?",
    choices: [
      { id: "c1", text: "La carte d'étudiant.", isCorrect: true, effects: [{ target: "autonomy", amount: 10 }] },
      { id: "c2", text: "Le passeport.", isCorrect: false, feedback: "Non, le passeport vous l'aviez déjà.", effects: [] },
      { id: "c3", text: "Un livre.", isCorrect: false, feedback: "Non, lisez bien le dernier texte.", effects: [] }
    ],
    tags: ["validation", "A2", "node"],
    pedagogicalFocus: ["comprendre un dialogue court"],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 2 },
      { type: 'giveItem', itemId: 'carte_etudiant' }
    ]
  }
];
